import { getCollection } from "astro:content";

export async function GET() {
  const entries = await getCollection("dynamic");

  const items = entries.map((entry) => {
    const body = entry.body || "";
    // Simple text-to-HTML: wrap each paragraph in <p> tags
    const html = body
      .split("\n")
      .filter((line) => line.trim())
      .map((line) => `<p>${line.trim()}</p>`)
      .join("\n");

    return {
      id: entry.id,
      published: new Date(entry.data.published).getTime(),
      html,
      images: [],
      searchText: body,
    };
  });

  items.sort((a, b) => b.published - a.published);

  return new Response(JSON.stringify(items), {
    headers: { "Content-Type": "application/json" },
  });
}