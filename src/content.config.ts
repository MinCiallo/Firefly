import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const postsCollection = defineCollection({
	loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/posts" }),
	schema: z.object({
		title: z.string(),
		published: z.date(),
		updated: z.date().optional(),
		draft: z.boolean().optional().default(false),
		description: z.string().optional().default(""),
		image: z.string().optional().default(""),
		tags: z.array(z.string()).optional().default([]),
		category: z.string().optional().nullable().default(""),
		lang: z.string().optional().default(""),
		pinned: z.boolean().optional().default(false),
		author: z.string().optional().default(""),
		sourceLink: z.string().optional().default(""),
		licenseName: z.string().optional().default(""),
		licenseUrl: z.string().optional().default(""),
		comment: z.boolean().optional().default(true),
		password: z.string().optional().default(""),
		passwordHint: z.string().optional().default(""),
		series: z.string().optional().default(""),
		seriesOrder: z.number().optional(),

		/* For internal use */
		prevTitle: z.string().default(""),
		prevSlug: z.string().default(""),
		nextTitle: z.string().default(""),
		nextSlug: z.string().default(""),
	}),
});

const specCollection = defineCollection({
	loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/spec" }),
	schema: z.object({}),
});

const dynamicCollection = defineCollection({
	loader: glob({ pattern: "**/*.md", base: "./src/content/dynamic" }),
	schema: z.object({
		published: z.date(),
	}),
});

const projectsCollection = defineCollection({
    loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/projects" }),
    schema: z.object({
        title: z.string(),
        published: z.date(),
        draft: z.boolean().default(false),
        order: z.number().optional(),
        description: z.string().default(""),
        image: z.string().default(""),
        icon: z.string().default(""),
        tags: z.array(z.string()).default([]),
        status: z.string().default(""),
        lang: z.string().default(""),
        link: z.array(z.object({
            label: z.string(),
            icon: z.string().default(""),
            value: z.string().refine((value) => /^https?:\/\//i.test(value), "项目链接必须使用 http(s) URL"),
        })).default([]),
    }),
});

export const collections = {
    projects: projectsCollection,
	posts: postsCollection,
	spec: specCollection,
	dynamic: dynamicCollection,
};
