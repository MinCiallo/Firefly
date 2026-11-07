import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import vm from "node:vm";
import test from "node:test";
import ts from "typescript";
import sharp from "sharp";
import { remarkWikiLink } from "../src/plugins/remark-wiki-link.js";
import { generateLqips } from "../scripts/generate-lqips.mjs";

const read = (p) => fs.readFile(new URL("../" + p, import.meta.url), "utf8");

async function contentApi(posts, projects = []) {
    let source = await read("src/utils/content-utils.ts");
    source = source.replace(/^import .*;\r?\n/gm, "").replaceAll("import.meta.env.PROD", "true");
    const context = { exports: {}, getCollection: async (name, filter) => (name === "projects" ? projects : posts).filter(filter || (() => true)) };
    vm.runInNewContext(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ESNext } }).outputText, context);
    return context.exports;
}
const post = (id, order, draft = false) => ({ id, data: { title: id, published: new Date("2026-01-01"), series: "Server", seriesOrder: order, draft } });

test("series preserve explicit order zero and filter production drafts", async () => {
    const posts = [post("last", undefined), post("second", 2), post("first", 0), post("draft", 1, true)];
    const api = await contentApi(posts);
    const series = await api.getSeriesPosts(posts[2]);
    assert.deepEqual(Array.from(series.posts, p => p.id), ["first", "second", "last"]);
    assert.equal(series.currentIndex, 0);
    assert.equal((await api.getSeriesList())[0].count, 3);
    assert.equal(await api.getSeriesPosts({ ...posts[0], data: { ...posts[0].data, series: "" } }), null);
});
test("project priority precedes date and drafts stay unpublished", async () => {
    const projects = [post("normal"), post("priority"), post("draft", 0, true)];
    projects[1].data.order = 3;
    const api = await contentApi([], projects);
    assert.deepEqual(Array.from(await api.getSortedProjects(), p => p.id), ["priority", "normal"]);
});

function transform(value) {
    const tree = { type: "root", children: [{ type: "paragraph", children: [{ type: "text", value }] }] };
    remarkWikiLink()(tree, { path: path.resolve("src/content/projects/dustbin.md") });
    return tree;
}
test("Wiki Links render cards, aliases and heading links using existing article URLs", () => {
    const card = transform("[[2026-9-20-1|模组介绍]]").children[0];
    assert.equal(card.data.hName, "a");
    assert.equal(card.data.hProperties.href, "/posts/2026-9-20-1/");
    assert.equal(card.children[0].children[0].children[0].value, "模组介绍");
    const inline = transform("阅读 [[2026-9-20-1#环境要求|运行环境]]。").children[0].children;
    assert.equal(inline[1].type, "link");
    assert.equal(inline[1].url, "/posts/2026-9-20-1/#环境要求");
    assert.equal(inline[1].children[0].value, "运行环境");
});
test("missing/unsafe wiki targets, code and image embeds remain untouched", () => {
    for (const value of ["[[../secrets]]", "[[missing-post]]", "![[2026-9-20-1]]"]) {
        assert.equal(transform(value).children[0].children[0].value, value);
    }
    const tree = { type: "root", children: [{ type: "code", value: "[[2026-9-20-1]]" }] };
    remarkWikiLink()(tree, {});
    assert.equal(tree.children[0].value, "[[2026-9-20-1]]");
});
test("LQIP distinguishes src/public images, refreshes changed files and removes deleted entries", async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), "firefly-lqip-"));
    try {
        await fs.mkdir(path.join(root, "src/assets"), { recursive: true });
        await fs.mkdir(path.join(root, "public/gallery"), { recursive: true });
        const first = path.join(root, "src/assets/test.png");
        const second = path.join(root, "public/gallery/test.png");
        await sharp({ create: { width: 8, height: 4, channels: 4, background: "#ff0000" } }).png().toFile(first);
        await sharp({ create: { width: 4, height: 8, channels: 3, background: "#0000ff" } }).png().toFile(second);
        const a = await generateLqips(root);
        assert.equal(a["src:assets/test.png"].colors, "ff0000ff0000ff0000");
        assert.equal(a["public:gallery/test.png"].colors, "0000ff0000ff0000ff");
        assert.equal(a["public:gallery/test.png"].height, 8);
        await sharp({ create: { width: 8, height: 4, channels: 3, background: "#00ff00" } }).png().toFile(first);
        await fs.utimes(first, new Date(), new Date(Date.now() + 2000));
        await fs.unlink(second);
        const b = await generateLqips(root);
        assert.equal(b["src:assets/test.png"].colors, "00ff0000ff0000ff00");
        assert.equal(b["public:gallery/test.png"], undefined);
    } finally { await fs.rm(root, { recursive: true, force: true }); }
});
