# Design Brief: My Pet Experts (mypetexperts.com)

## What it is
A content site for dog and cat owners. It makes money from affiliate links (Amazon, Chewy, pet brands). There are two kinds of articles:
1. **Guides:** vet-sourced safety and health info (e.g. "Foods That Are Toxic to Dogs"). These bring in search traffic and build trust.
2. **Product roundups:** "The Best No-Pull Dog Harnesses"-style articles with recommended products and "Check price" buttons. This is where the money comes from.

The site is relaunching after years of low-quality AI content, so the design has to feel **trustworthy, calm, and credible**: closer to a good health publication than a cluttered pet blog or a deal site.

## Audience
Everyday dog and cat owners, mostly on their phones, often arriving from Google with one specific question ("can my dog eat grapes?"). Some are worried because their pet just ate something. They need the answer and next steps fast.

## Brand and tone
- Warm, friendly, plain-spoken, not cutesy. No cartoon paws everywhere, no stock-photo overload.
- Credible: clear sources, update dates, a visible "How we research" link.
- Honest about money: affiliate disclosures are visible but not alarming.
- The current direction (open to change): warm off-white background, terracotta/burnt-orange accent (#c2571a), serif headings (Fraunces), sans-serif body (Inter), and a simple paw logo. Must support **light and dark mode**.

## Pages to design
1. **Home:** a short headline and value statement, two big entry points (Dogs / Cats), a "Latest articles" grid, and an always-visible **emergency box** with poison hotline phone numbers.
2. **Category hub (Dogs, Cats):** a title and short intro, a "Product picks" section and a "Guides" section, both shown as card grids.
3. **Guide article:** a category label, H1, a one-sentence summary, an "Updated [date] · How we research" line, a red **emergency callout** near the top (hotline numbers), a table of contents, a comparison table, long-form text with H2/H3 sections, a numbered "what to do" list, a **Sources** list at the bottom, and a "More for dogs" related-articles row.
4. **Product roundup article:** same as a guide, plus an affiliate disclosure bar at the top, a "How we picked" info callout, and **product cards**.
5. **Simple text pages:** About, How We Research, Affiliate Disclosure, Privacy.
6. **404:** friendly message ("we rebuilt the site, older pages are gone") with links to Dogs, Cats, and Home.

## Key components
- **Header:** logo and wordmark, nav (Dogs, Cats, How we research). Must work on mobile.
- **Footer:** a vet disclaimer with the poison hotline, links (About, How we research, Affiliate disclosure, Privacy), and the Amazon Associates line.
- **Article card:** a label ("DOGS · GUIDE" / "CATS · PRODUCT PICKS"), title, and a 1–2 line description. Design it with and without an image.
- **Callouts, in three styles:** info (neutral/green), warning (amber), danger/emergency (red, with tappable phone numbers).
- **Product card (most important for revenue):** an award label ("Best overall", "Best budget pick"), product name, optional product image, a "Best for:" line, a short paragraph, Pros/Cons lists, and a prominent **"Check price on Amazon"** button. Cards stack vertically in the article. Consider an optional "Our picks at a glance" summary table at the top of roundups.
- **Affiliate disclosure bar:** one small line at the top of roundups.
- **Table of contents box** and a **comparison table** that works on mobile.
- **Sources list:** small, numbered, with external links.

## Requirements
- Mobile-first: most traffic is phone users from Google search. Design at 375px wide and at desktop width.
- Fast and simple: static site (Astro), no heavy animation, minimal images. Pages must load quickly for SEO.
- Readable long-form text: about a 700px text column, generous line height, body text 17px or larger.
- Accessible: WCAG AA contrast in both light and dark mode, visible focus states, large tap targets.
- Room for ads later is optional and low priority. Affiliate buttons matter more than ad slots.

## Deliverables
Desktop and mobile mockups for: Home, a Category hub, a Guide article, and a Product roundup article. Plus a small style guide: colors (light and dark), type scale, buttons, cards, callouts, and the product card.
