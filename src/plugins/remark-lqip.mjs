import path from "node:path";
import { readFileSync } from "node:fs";
import { visit } from "unist-util-visit";

export function remarkLqip() {
    let previews = {};
    try { previews = JSON.parse(readFileSync(new URL("../constants/lqips.json", import.meta.url), "utf8")); } catch {}
    return (tree, file) => {
        visit(tree, "image", node => {
            if (!node.url || /^(?:https?:)?\/\//i.test(node.url) || node.url.startsWith("data:")) return;
            const key = node.url.startsWith("/") ? "public:" + node.url.slice(1)
                : "src:" + path.relative(path.resolve("src"), path.resolve(path.dirname(file.path), node.url)).replace(/\\/g, "/");
            const preview = previews[key];
            if (!preview || !/^[0-9a-f]{18}$/i.test(preview.colors)) return;
            const c = preview.colors;
            node.data ||= {};
            const props = node.data.hProperties ||= {};
            props.width ||= preview.width;
            props.height ||= preview.height;
            props.loading ||= "lazy";
            props.decoding ||= "async";
            props.style = (props.style || "") + `;background:linear-gradient(135deg,#${c.slice(0,6)},#${c.slice(6,12)},#${c.slice(12,18)});aspect-ratio:${preview.width}/${preview.height}`;
        });
    };
}
