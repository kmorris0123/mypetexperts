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

## Plain language (required)

Write so anyone can understand it on the first read, including someone who is stressed, reading on their phone,
or not a native English speaker. Aim for a 6th-grade reading level.

- Use everyday words. Write "a little" not "in moderation", "once in a while" not "occasionally", "make sick" not
  "cause toxicosis", "throw up" or "vomit" not "emesis", "pee" or "urinate" not "urination output".
- No idioms or business phrases: avoid "stopgap", "rule of thumb", "a red flag", "bottom line", "in a pinch",
  "err on the side of caution", "go-to", "game changer".
- One idea per sentence. If a sentence has more than about 20 words, split it.
- Name a chemical only when owners need it to read a label (like xylitol), and explain it right away.

### Keep the answer inside the article

The answer appears only in the article itself (opening paragraph, short-answer box, and Google's search snippet via
`description`). Everywhere else on the site (cards, lists, the home page, the featured image) shows the question
only, so people click through. That's what `teaser` is for:

- Good: "A grape rolls off the counter and your dog gets it first. Here's what vets want you to know."
- Bad: "No. Grapes can cause kidney failure." (gives the answer away)
- Don't hint with words like "safe", "dangerous", "toxic", "fine" or "okay" either.

### The short answer (`quickAnswer` and `quickNote`)

These appear in the big short-answer box at the top of the article, so they must be instantly clear.

- `quickAnswer`: 2-5 plain words that start with Yes, No, or a clear limit. Good: 'No.' 'Yes.' 'Yes, a little.'
  'Yes, if cooked.' 'Not every day.' 'Only once in a while.' 'Yes, but check the label.' Bad: 'Only as a stopgap.'
  'In moderation.' 'Contraindicated.' 'It depends.'
- `quickNote`: 2-5 lowercase words that add the single most useful detail. Good: 'not even one' 'never raw'
  'slices only, no core' 'kitten food until age 1'.
- Test: would a 10-year-old know exactly what to do after reading just these two lines? If not, rewrite them.
- `verdict` sets the box color and must match the answer: `yes` when it's fine to share (even in small amounts),
  `caution` when it's only okay sometimes, only in a certain form, or depends on the label, `no` when it's toxic or
  dangerous. When unsure between two, pick the safer one (caution over yes, no over caution).

## File format

Articles live in `src/content/articles/<slug>.mdx`. The filename is the URL. For a topic from
`content-plan/old-topics.csv`, use its `old_slug` exactly.

```mdx
---
title: 'Can Dogs Eat Bananas?'                 # Title case; the question itself for "can X eat Y" topics
description: 'One or two sentences, max 170 characters, that answer the question and say what the article covers.'
teaser: 'A curiosity line for cards on the site, max 170 characters. Must NOT give the answer.'
pet: dogs                                      # dogs | cats
kind: guide                                    # guide | roundup
pubDate: 2026-10-05                            # today's date
verdict: yes                                   # yes (green, fine) | caution (yellow, careful/only sometimes) | no (red, dangerous)
quickAnswer: 'Yes, a little.'                 # 2-5 plain words, see "The short answer" above
quickNote: 'peeled, in small slices'           # optional handwritten aside, 2-5 words, lowercase
sources:
  - title: 'Publisher: Page title'
    url: 'https://...'
---
```

Do not set `featured` (only one article is featured on the home page).

The featured image at the top of the article is generated automatically from the title (question only, never the answer).
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
