import { defineCollection } from 'astro:content';
import { glob, file } from 'astro/loaders';
import { z } from 'astro/zod';

const articles = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/articles' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    // Used for the meta description and article cards.
    description: z.string().max(170),
    // Shown on cards around the site. Must NOT give away the answer (the answer belongs in the article).
    // Falls back to description when missing.
    teaser: z.string().max(170).optional(),
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
    // Colors the short-answer box: yes = green (fine), caution = yellow (careful / only sometimes), no = red (dangerous).
    verdict: z.enum(['yes', 'caution', 'no']).optional(),
    quickNote: z.string().optional(),
    // Shown in the big card on the home page.
    featured: z.boolean().default(false),
    // Short text for the featured image when the title is long (non "Can X eat Y" articles).
    heroText: z.string().optional(),
    // Stock photos used inside the article with <Photo n={0} />. Add entries with just a `query`;
    // scripts/fetch-photos.mjs downloads a matching Pexels photo and fills in src, alt and credit.
    photos: z
      .array(
        z.object({
          query: z.string().optional(),
          src: image().optional(),
          alt: z.string().optional(),
          credit: z.string().optional(),
          creditUrl: z.url().optional(),
          pexelsId: z.number().optional(),
        }),
      )
      .default([]),
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
