const fs = require("fs");
const path = require("path");

const content = process.argv.slice(2).join(" ");
if (!content) {
	console.error("Usage: pnpm new-dynamic <content>");
	process.exit(1);
}

const now = new Date();
const dateStr = now.toISOString().replace("T", " ").slice(0, 19);
const fileName = now.toISOString().replace(/[:.]/g, "-").slice(0, 19) + ".md";
const filePath = path.join("src", "content", "dynamic", fileName);

const frontmatter = `---\npublished: ${dateStr}\n---\n\n${content}\n`;

fs.writeFileSync(filePath, frontmatter, "utf-8");
console.log(`Created: ${filePath}`);