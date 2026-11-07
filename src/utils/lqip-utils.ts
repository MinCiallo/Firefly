// Compact three-color gradients, following CuteLeaf/Firefly's LQIP format.
import data from "@/constants/lqips.json";
type Preview = { colors: string; width: number; height: number };
const previews = data as Record<string, Preview>;

export function getImagePreview(src: string, basePath = ""): Preview | undefined {
    if (/^(?:https?:)?\/\//i.test(src) || src.startsWith("data:")) return undefined;
    const isPublic = src.startsWith("/");
    const raw = isPublic ? src.slice(1) : [basePath, src].filter(Boolean).join("/");
    const parts: string[] = [];
    for (const part of raw.replace(/\\/g, "/").split("/")) {
        if (!part || part === ".") continue;
        if (part === "..") parts.pop();
        else parts.push(part);
    }
    const relative = parts.join("/").replace(/^src\//, "");
    return previews[(isPublic ? "public:" : "src:") + relative];
}

export function getLqipProps(src: string, basePath = "") {
    const preview = getImagePreview(src, basePath);
    const colors = preview?.colors;
    const gradient = colors && /^[0-9a-f]{18}$/i.test(colors)
        ? `linear-gradient(135deg, #${colors.slice(0, 6)} 0%, #${colors.slice(6, 12)} 50%, #${colors.slice(12, 18)} 100%)`
        : "linear-gradient(135deg, var(--btn-plain-bg-hover), var(--card-bg))";
    return { style: "background: " + gradient, width: preview?.width, height: preview?.height, known: !!preview };
}
