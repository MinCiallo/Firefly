// Adapted from CuteLeaf/Firefly's generate-lqips.ts; cache invalidation also tracks file changes.
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { glob } from "glob";
import sharp from "sharp";

export async function generateLqips(root = process.cwd()) {
    const output = path.join(root, "src/constants/lqips.json");
    const cacheFile = path.join(root, ".astro/lqip-cache.json");
    let cache = {};
    try { cache = JSON.parse(await fs.readFile(cacheFile, "utf8")); } catch {}
    const files = (await glob("{src,public}/**/*.{png,jpg,jpeg,webp,avif}", {
        cwd: root,
        ignore: ["public/pio/**", "public/favicon/**", "public/vndb-covers/**", "public/assets/music/**", "public/assets/images/effects/**"],
    })).sort();
    const nextCache = {};
    const results = {};
    for (const file of files) {
        const absolute = path.join(root, file);
        const stat = await fs.stat(absolute);
        const key = file.replace(/\\/g, "/").replace(/^(src|public)\//, "$1:");
        const fingerprint = stat.size + ":" + stat.mtimeMs;
        let item = cache[key]?.fingerprint === fingerprint ? cache[key].item : null;
        if (!item) {
            try {
                const pipeline = sharp(absolute).rotate();
                const metadata = await pipeline.metadata();
                const { data } = await pipeline.resize(2, 2, { fit: "fill" }).removeAlpha().toColourspace("srgb").raw().toBuffer({ resolveWithObject: true });
                const colors = [0, 3, 9].map(offset => data.subarray(offset, offset + 3).toString("hex")).join("");
                const rotated = metadata.orientation >= 5 && metadata.orientation <= 8;
                item = { colors, width: rotated ? metadata.height : metadata.width, height: rotated ? metadata.width : metadata.height };
            } catch (error) {
                console.warn("[LQIP] Skipped " + file + ": " + error.message);
                continue;
            }
        }
        results[key] = item;
        nextCache[key] = { fingerprint, item };
    }
    await fs.mkdir(path.dirname(output), { recursive: true });
    await fs.mkdir(path.dirname(cacheFile), { recursive: true });
    const json = JSON.stringify(results, null, 2) + "\n";
    const old = await fs.readFile(output, "utf8").catch(() => "");
    if (json !== old) await fs.writeFile(output, json);
    await fs.writeFile(cacheFile, JSON.stringify(nextCache));
    console.log("[LQIP] " + Object.keys(results).length + " images ready");
    return results;
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
    await generateLqips();
}
