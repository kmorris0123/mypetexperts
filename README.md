# My Pet Experts

Astro site for mypetexperts.com: vet-sourced dog and cat guides plus affiliate product roundups.

## Commands

| Command | What it does |
| --- | --- |
| `npm install` | Install dependencies |
| `npm run dev` | Local dev server (drafts are visible here) |
| `npm run build` | Production build to `dist/` (drafts are excluded) |
| `npm run preview` | Preview the production build |

## Adding an article

Create `src/content/articles/<url-slug>.mdx`. The filename becomes the URL (`/url-slug/`).

```yaml
---
title: 'Article title'
description: 'Under 170 characters. Used for search results and cards.'
pet: dogs            # dogs | cats
kind: guide          # guide | roundup
pubDate: 2026-10-04
updatedDate: 2026-11-01   # optional, set when you meaningfully revise
hasAffiliateLinks: false  # true shows the disclosure notice at the top
draft: false
sources:
  - title: 'Source name'
    url: 'https://...'
---
```

Optional frontmatter for "Can dogs eat X?" guides: `quickAnswer: 'No.'`, `quickNote: 'not even one'`
(shown big at the top of the article), and `featured: true` to make it the big card on the home page.

Components available in `.mdx` without importing:

- `<Callout type="info|warn|danger" title="...">...</Callout>`
- `<ProductPick id="product-id">Why we picked it.</ProductPick>`

## Products and affiliate links

Every product lives once in `src/data/products.yaml` (name, pros/cons, award, affiliate `href`, optional photo).
Roundups reference products by `id`, and the home page's "What we'd buy" section shows them automatically.
Products without an `href` show "Affiliate link needed" and are hidden from the home page in production.

## Topic backlog

`content-plan/old-topics.csv` lists every dog and cat topic from the old WordPress site. Each one gets rewritten
from scratch (never reuse old text). Reuse the old slug as the filename so the old URL comes back, and set
`status` to `done` when it's published.

## Content rules

- Health and safety claims must be backed by a cited veterinary source (ASPCA, Merck Vet Manual, FDA, etc.).
- Never claim to have tested a product unless you actually used it.
- Affiliate links go through `ProductPick` so they get `rel="sponsored nofollow"`.

## Before launch

- [ ] Replace the placeholder bio on `src/pages/about.astro`
- [ ] Set `OWNER_NAME` and `OWNER_PHOTO` in `src/consts.ts` (signature and photo on the home page)
- [ ] Set up the contact inbox in `src/consts.ts`
- [ ] Add affiliate links in `src/data/products.yaml`, then set `draft: false` on `best-no-pull-dog-harness.mdx`
- [ ] Deploy `dist/` (Cloudflare Pages or Netlify: build command `npm run build`, output `dist`)
- [ ] Point the mypetexperts.com DNS at the new host; old WordPress URLs return 404 until their topic is rewritten
- [ ] Submit `https://mypetexperts.com/sitemap-index.xml` in Google Search Console
