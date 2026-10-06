/**
 * Featured images in the site's illustrated style, generated from each article's data.
 * The same SVG is shown at the top of articles, as list thumbnails, and (rasterized to PNG
 * in src/pages/og/[slug].png.ts) as the social sharing image.
 */
import { DOG, CAT } from './pet-art';
import type { Article } from './articles';

export const FEATURED_WIDTH = 1200;
export const FEATURED_HEIGHT = 630;

type Tone = 'tomato' | 'pine' | 'yellow' | 'sand';

const INK = '#1C1A17';
const PALETTE: Record<Tone, { bg: string; text: string; verdict: string; photo: string }> = {
  tomato: { bg: '#F0553A', text: INK, verdict: '#FFFFFF', photo: '#114B3A' },
  pine: { bg: '#114B3A', text: '#FFFFFF', verdict: '#FFCF33', photo: '#F0553A' },
  yellow: { bg: '#FFCF33', text: INK, verdict: '#B8371F', photo: '#114B3A' },
  sand: { bg: '#F6EFE3', text: INK, verdict: '#B8371F', photo: '#F0553A' },
};
const TONES: Tone[] = ['tomato', 'pine', 'yellow', 'sand'];

const CAPTIONS = {
  dogs: ['chief treat tester', 'professional beggar', 'will sit for snacks', 'head of the snack patrol'],
  cats: ['head of knocking things off shelves', 'snack inspector', 'judging your dinner', 'counter-surfing pro'],
};

export interface FeaturedSpec {
  pet: 'dogs' | 'cats';
  kicker: string;
  subject: string;
  /** Optional big answer line. Articles leave it out so the image doesn't give the answer away. */
  verdict?: string;
  note?: string;
  tone: Tone;
}

/**
 * The image shows the question, never the answer: no verdict, no answer-revealing note, and a color
 * that's picked per article (not by answer) so "red" doesn't mean "no".
 */
export function specFor(article: Article): FeaturedSpec {
  const { title, pet, heroText, kind } = article.data;
  const n = hash(article.id);
  const tone = TONES[n % TONES.length];
  const note = CAPTIONS[pet][Math.floor(n / TONES.length) % CAPTIONS[pet].length];
  const m = title.match(/^Can (Dogs|Cats|Puppies|Kittens) (Eat|Drink|Have) (.+?)\??$/i);
  if (m) {
    return { pet, kicker: `Can ${m[1]} ${m[2]}`.toUpperCase(), subject: `${capitalize(m[3])}?`, note, tone };
  }
  return {
    pet,
    kicker: `${pet === 'dogs' ? 'Dogs' : 'Cats'} · ${kind === 'roundup' ? 'Product picks' : 'Guide'}`.toUpperCase(),
    subject: heroText ?? title,
    note,
    tone,
  };
}

function hash(s: string): number {
  let h = 0;
  for (const ch of s) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return h;
}

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Greedy word wrap by estimated character width. */
function wrap(text: string, fontSize: number, maxWidth: number, charWidth = 0.56): string[] {
  const maxChars = Math.max(4, Math.floor(maxWidth / (fontSize * charWidth)));
  const lines: string[] = [];
  let line = '';
  for (const word of text.split(/\s+/)) {
    const next = line ? `${line} ${word}` : word;
    if (next.length > maxChars && line) {
      lines.push(line);
      line = word;
    } else line = next;
  }
  if (line) lines.push(line);
  return lines;
}

/** Pick the largest font size (from the list) whose wrapped text fits in maxLines. */
function fit(text: string, sizes: number[], maxWidth: number, maxLines: number) {
  for (const size of sizes) {
    const lines = wrap(text, size, maxWidth);
    if (lines.length <= maxLines) return { size, lines };
  }
  const size = sizes[sizes.length - 1];
  return { size, lines: wrap(text, size, maxWidth).slice(0, maxLines) };
}

export function featuredSvg(spec: FeaturedSpec, opts: { title?: string } = {}): string {
  const c = PALETTE[spec.tone];
  const art = spec.pet === 'dogs' ? DOG : CAT;
  const textWidth = 620;
  const x = 72;

  const subject = spec.verdict
    ? fit(spec.subject, [118, 100, 84, 70, 58], textWidth, 2)
    : fit(spec.subject, [150, 124, 104, 88, 72, 58], textWidth, 3);
  const verdict = spec.verdict ? fit(spec.verdict, [150, 112, 84, 66], textWidth, 2) : null;

  // Vertical layout: kicker, subject lines, verdict lines, centered as a block.
  const kickerH = 44;
  const subjectH = subject.lines.length * subject.size * 1.0;
  const verdictH = verdict ? 24 + verdict.lines.length * verdict.size * 0.95 : 0;
  let y = Math.max(80, (FEATURED_HEIGHT - (kickerH + subjectH + verdictH)) / 2);

  const parts: string[] = [];
  parts.push(
    `<text x="${x}" y="${y + 28}" font-family="DM Sans" font-weight="700" font-size="28" letter-spacing="3" fill="${c.text}">${esc(spec.kicker)}</text>`,
  );
  y += kickerH;
  for (const line of subject.lines) {
    y += subject.size * 0.9;
    parts.push(
      `<text x="${x}" y="${y}" font-family="Bricolage Grotesque" font-weight="800" font-size="${subject.size}" letter-spacing="-2" fill="${c.text}">${esc(line)}</text>`,
    );
    y += subject.size * 0.1;
  }
  if (verdict) {
    y += 24;
    for (const line of verdict.lines) {
      y += verdict.size * 0.88;
      parts.push(
        `<text x="${x - 4}" y="${y}" font-family="Bricolage Grotesque" font-weight="800" font-size="${verdict.size}" letter-spacing="-3" fill="${c.verdict}">${esc(line)}</text>`,
      );
      y += verdict.size * 0.07;
    }
  }

  // Polaroid with the pet character, captioned with the handwritten note.
  const caption = spec.note ?? CAPTIONS[spec.pet][0];
  const captionFit = fit(caption, [40, 34, 28], 300, 2);
  const polaroid = `
    <g transform="translate(790 70) rotate(4 170 245)">
      <rect x="6" y="14" width="340" height="470" fill="rgba(28,26,23,0.18)" />
      <rect x="0" y="0" width="340" height="470" fill="#FFFFFF" />
      <rect x="16" y="16" width="308" height="330" fill="${c.photo}" />
      <svg x="16" y="16" width="308" height="330" viewBox="0 0 308 330" overflow="hidden">
        <svg x="-6" y="${spec.pet === 'dogs' ? 70 : 90}" width="320" height="${spec.pet === 'dogs' ? 291 : 262}" viewBox="${art.viewBox}">${art.body}</svg>
      </svg>
      ${captionFit.lines
        .map(
          (l, i) =>
            `<text x="170" y="${398 + i * captionFit.size * 1.0 + (captionFit.lines.length === 1 ? 14 : 0)}" text-anchor="middle" font-family="Caveat" font-weight="700" font-size="${captionFit.size}" fill="${INK}">${esc(l)}</text>`,
        )
        .join('')}
      <rect x="120" y="-14" width="100" height="30" fill="rgba(255,255,255,0.65)" transform="rotate(-4 170 0)" />
    </g>`;

  const label = opts.title ? `<title>${esc(opts.title)}</title>` : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${FEATURED_WIDTH} ${FEATURED_HEIGHT}" width="${FEATURED_WIDTH}" height="${FEATURED_HEIGHT}" role="img">${label}<rect width="${FEATURED_WIDTH}" height="${FEATURED_HEIGHT}" fill="${c.bg}" />${parts.join('')}${polaroid}</svg>`;
}
