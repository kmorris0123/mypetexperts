#!/usr/bin/env node
/**
 * Downloads Pexels stock photos for articles.
 *
 * In an article's frontmatter, list photos by search query:
 *
 *   photos:
 *     - query: 'golden retriever eating apple slice'
 *
 * This script finds a matching landscape photo on Pexels, saves it to src/assets/photos/,
 * and fills in src, alt (from Pexels) and photographer credit. Use it in the article body
 * with <Photo {...props.photos[0]} />.
 *
 * Needs PEXELS_API_KEY in the environment. Usage: node scripts/fetch-photos.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import YAML from 'yaml';

const KEY = process.env.PEXELS_API_KEY;
const ARTICLES = 'src/content/articles';
const PHOTOS = 'src/assets/photos';
const USED = 'content-plan/used-photos.json';

if (!KEY) {
  console.log('PEXELS_API_KEY not set; skipping photo downloads.');
  process.exit(0);
}

fs.mkdirSync(PHOTOS, { recursive: true });
const used = new Set(fs.existsSync(USED) ? JSON.parse(fs.readFileSync(USED, 'utf8')) : []);
let changed = 0;

async function search(query) {
  const url = `https://api.pexels.com/v1/search?${new URLSearchParams({ query, orientation: 'landscape', per_page: '15' })}`;
  const res = await fetch(url, { headers: { Authorization: KEY } });
  if (!res.ok) throw new Error(`Pexels search failed (${res.status}) for "${query}"`);
  const { photos = [] } = await res.json();
  return photos.find((p) => !used.has(p.id)) ?? null;
}

for (const file of fs.readdirSync(ARTICLES).filter((f) => /\.mdx?$/.test(f))) {
  const full = path.join(ARTICLES, file);
  const text = fs.readFileSync(full, 'utf8');
  const m = text.match(/^---\n([\s\S]*?)\n---\n/);
  if (!m) continue;
  const doc = YAML.parseDocument(m[1]);
  const photos = doc.get('photos');
  if (!photos || !YAML.isSeq(photos)) continue;

  const slug = file.replace(/\.mdx?$/, '');
  let dirty = false;
  for (const [i, item] of photos.items.entries()) {
    if (!YAML.isMap(item) || item.get('src') || !item.get('query')) continue;
    const query = item.get('query');
    const photo = await search(query);
    if (!photo) {
      console.warn(`No unused Pexels photo for "${query}" (${file})`);
      continue;
    }
    const name = `${slug}-${i + 1}.jpg`;
    const img = await fetch(photo.src.large2x);
    if (!img.ok) throw new Error(`Download failed (${img.status}) for photo ${photo.id}`);
    fs.writeFileSync(path.join(PHOTOS, name), Buffer.from(await img.arrayBuffer()));

    item.set('src', `../../assets/photos/${name}`);
    item.set('alt', photo.alt || query);
    item.set('credit', photo.photographer);
    item.set('creditUrl', photo.photographer_url);
    item.set('pexelsId', photo.id);
    used.add(photo.id);
    dirty = true;
    console.log(`${file}: "${query}" -> ${name} (${photo.photographer})`);
  }
  if (dirty) {
    fs.writeFileSync(full, `---\n${doc.toString({ lineWidth: 0 }).trimEnd()}\n---\n${text.slice(m[0].length)}`);
    changed++;
  }
}

fs.writeFileSync(USED, JSON.stringify([...used], null, 0) + '\n');
console.log(`Updated ${changed} article(s).`);
