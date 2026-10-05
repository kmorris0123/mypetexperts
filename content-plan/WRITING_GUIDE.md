# My Pet Experts writing guide

Read this fully before writing any article. It applies to every article, written by a person, Claude, or the weekly
automation.

## Non-negotiables

1. **Every health or safety claim must come from a source you actually opened and read in this session.** Use
   reputable veterinary sources: Merck Veterinary Manual (merckvetmanual.com), ASPCA Animal Poison Control
   (aspca.org), Pet Poison Helpline (petpoisonhelpline.com), U.S. FDA Center for Veterinary Medicine (fda.gov),
   International Cat Care (icatcare.org/articles/...), AKC (akc.org), Cornell Feline Health Center (vet.cornell.edu),
   or peer-reviewed papers. Not other pet blogs. **Don't use VCA (vcahospitals.com)**: its terms forbid using AI to
   rewrite its content. Skip any site whose terms forbid AI use.
2. **Verify every source URL** returns HTTP 200 and is the real page, not a redirect to a homepage:
   `curl -sL -o /dev/null -w '%{http_code} %{url_effective}' -A 'Mozilla/5.0 (Macintosh)' URL`
   If a URL redirects somewhere generic or 404s, don't use it.
3. **Never invent facts, numbers, studies, quotes, or first-hand experience.** Never write "we tested," "my dog,"
   "in our experience," or anything implying hands-on use. If sources disagree or evidence is limited, say so plainly.
4. **Never copy text from sources.** Write everything in your own words.
5. **Never reuse text from the old WordPress site.** Old topics are rewritten from scratch.
6. When something could be an emergency, say "call your vet" clearly and include the poison hotline callout.

## Voice

- Plain, warm, and direct, like a knowledgeable friend. Short sentences. No fluff, no "In this article we will…",
  no "As a pet owner, you…", no "In conclusion".
- Answer the question in the first two sentences. The reader may be panicking.
- Use "your dog" / "your cat". Use bold sparingly for the key takeaway.
- American English. Avoid jargon; when a medical term helps, explain it ("pancreatitis, a painful inflammation of the
  pancreas").

## File format

Articles live in `src/content/articles/<slug>.mdx`. The filename is the URL. For a topic from
`content-plan/old-topics.csv`, use its `old_slug` exactly.

```mdx
---
title: 'Can Dogs Eat Bananas?'                 # Title case; the question itself for "can X eat Y" topics
description: 'One or two sentences, max 170 characters, that answer the question and say what the article covers.'
pet: dogs                                      # dogs | cats
kind: guide                                    # guide | roundup
pubDate: 2026-10-05                            # today's date
quickAnswer: 'Yes, in moderation.'             # very short: 'No.' 'Yes.' 'Yes, in moderation.' 'Only plain, cooked.' 'Not really.'
quickNote: 'peeled, in small slices'           # optional handwritten aside, 2-5 words, lowercase
sources:
  - title: 'Publisher: Page title'
    url: 'https://...'
---
```

Do not set `featured` (only one article is featured on the home page).

The featured image at the top of the article is generated automatically from the title, `quickAnswer` and `quickNote`.
For long titles that aren't "Can [pet] eat [food]?", add `heroText:` with a short 3-6 word version.

## Photos

Add 1 stock photo per article (2 for articles over 1,000 words). In the frontmatter, list a Pexels search query:

```yaml
photos:
  - query: 'golden retriever eating apple slice'
```

Then place it in the body, usually just before the second `##` heading:

```mdx
<Photo {...props.photos[0]} />
```

A GitHub Action downloads a matching photo and fills in the image, alt text and credit; don't add `src` yourself.
Queries should be simple and concrete (a pet, a food, a setting). Never choose a query that shows a pet eating
something the article says is dangerous.

## Components (available without importing)

- `<Callout type="danger" title="...">...</Callout>`: the emergency box. **Required** near the top of any article
  about something toxic or dangerous. Use exactly these hotlines:
  - ASPCA Animal Poison Control: [(888) 426-4435](tel:+18884264435)
  - Pet Poison Helpline: [(855) 764-7661](tel:+18557647661)
  Mention both may charge a fee, and not to induce vomiting unless a vet says to.
- `<Callout type="info" title="...">...</Callout>`: a neutral tip box.
- `<Callout type="warn" title="...">...</Callout>`: a caution box.

Inside a Callout, leave a blank line before a markdown list.

## Structure for "Can [pet] eat [food]?" articles

Aim for 700–1,200 words. Use `##` headings (they build the table of contents). Typical sections, adapt as needed:

1. Opening paragraph (no heading): the direct answer and the one-sentence why.
2. Danger callout if the food is toxic, OR a safe-serving section if it's okay.
3. `## Why [food] is (bad / okay) for [pets]`
4. `## Signs to watch for` (toxic foods) or `## How to serve it safely` (safe foods)
5. `## How much is too much?` only when sources give guidance. Never invent doses.
6. `## What to do if your [pet] ate [food]` (toxic or risky foods)
7. `## Safer alternatives` or `## Other treats to try`
8. End with the 10%-of-daily-calories treat rule where relevant, and link to a related article on the site using
   a relative link like `[foods that are toxic to dogs](/foods-toxic-to-dogs/)`. Only link to articles that exist in
   `src/content/articles/`.

Tables are welcome for comparisons (e.g. chocolate types). Keep them small.

## Before you finish

- Run `npm run build`; it must succeed.
- Re-read the article against its sources: every claim must be supported.
- Update `content-plan/old-topics.csv`: set `status` to `done` for the slug (if it's an old topic).
