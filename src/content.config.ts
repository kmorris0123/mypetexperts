import { defineCollection } from 'astro:content';
import { glob, file } from 'astro/loaders';
import { z } from 'astro/zod';

const articles = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/articles' }),
  schema: z.object({
    title: z.string(),
    // Used for the meta description and article cards.
    description: z.string().max(170),
    pet: z.enum(['dogs', 'cats']),
    // guide = informational, roundup = product recommendations.
    kind: z.enum(['guide', 'roundup']),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    hasAffiliateLinks: z.boolean().default(false),
    // Drafts render in `npm run dev` but are left out of production builds.
    draft: z.boolean().default(false),
    // For "Can dogs eat X?" style guides: the one-word answer ("No.", "Yes.", "Sometimes.")
    // and an optional handwritten aside. Shown big on the home page and at the top of the article.
    quickAnswer: z.string().optional(),
    quickNote: z.string().optional(),
    // Shown in the big card on the home page.
    featured: z.boolean().default(false),
    sources: z.array(z.object({ title: z.string(), url: z.url() })).default([]),
  }),
});

const products = defineCollection({
  loader: file('src/data/products.yaml'),
  schema: z.object({
    name: z.string(),
    pet: z.enum(['dogs', 'cats']),
    category: z.string(),
    award: z.string().optional(),
    blurb: z.string(),
    bestFor: z.string().optional(),
    pros: z.array(z.string()).default([]),
    cons: z.array(z.string()).default([]),
    href: z.url().optional(),
    retailer: z.string().default('Amazon'),
    image: z.string().optional(),
    art: z.enum(['harness', 'fountain', 'bed', 'bowl', 'scratcher', 'wand']).default('harness'),
    note: z.string().optional(),
    roundup: z.string().optional(),
    featured: z.boolean().default(false),
  }),
});

export const collections = { articles, products };
