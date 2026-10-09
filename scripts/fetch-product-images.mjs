#!/usr/bin/env node
/**
 * Adds the brand's official product photo to products that don't have one yet.
 *
 * Each product file (src/data/products/<id>.yaml) should have `imageSource:` set to the product's page on the
 * BRAND'S OWN website. This script reads that page's main image (og:image or Product JSON-LD), puts it on a white
 * background at max 1000px, saves it to public/products/<id>.jpg, and adds `image` and `imageCredit` to the file.
 * Never point imageSource at Amazon or other retailers.
 *
 * Usage: node scripts/fetch-product-images.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import YAML from 'yaml';

const DIR = 'src/data/products';
const OUT = 'public/products';
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36';
const RETAILERS = /amazon\.|chewy\.|petco\.|petsmart\.|walmart\.|target\.com|ebay\./i;

fs.mkdirSync(OUT, { recursive: true });

function candidates(html, base) {
  const out = [];
  for (const m of html.matchAll(/<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      const data = JSON.parse(m[1]);
      const nodes = Array.isArray(data) ? data : data['@graph'] ?? [data];
      for (const n of nodes) {
        if (!String(n?.['@type'] ?? '').includes('Product')) continue;
        let img = Array.isArray(n.image) ? n.image[0] : n.image;
        if (img && typeof img === 'object') img = img.url;
        if (typeof img === 'string') out.push(img);
      }
    } catch {}
  }
  for (const re of [
    /<meta[^>]+property=["']og:image(?::secure_url)?["'][^>]+content=["']([^"']+)/gi,
    /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image/gi,
    /<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)/gi,
  ]) {
    for (const m of html.matchAll(re)) out.push(m[1]);
  }
  return out
    .map((u) => u.replace(/&amp;/g, '&').trim())
    .map((u) => (u.startsWith('//') ? `https:${u}` : new URL(u, base).toString()))
    .filter((u) => !/logo|favicon|placeholder|default-share/i.test(u));
}

let added = 0;
for (const file of fs.readdirSync(DIR).filter((f) => /\.ya?ml$/.test(f))) {
  const full = path.join(DIR, file);
  const doc = YAML.parseDocument(fs.readFileSync(full, 'utf8'));
  const source = doc.get('imageSource');
  if (doc.get('image') || !source || RETAILERS.test(source)) continue;
  const id = file.replace(/\.ya?ml$/, '');
  try {
    const page = await fetch(source, { headers: { 'User-Agent': UA, Accept: 'text/html' } });
    if (!page.ok) throw new Error(`page ${page.status}`);
    let saved = false;
    for (const url of candidates(await page.text(), page.url)) {
      const res = await fetch(url, { headers: { 'User-Agent': UA, Accept: 'image/*' } });
      if (!res.ok) continue;
      const input = Buffer.from(await res.arrayBuffer());
      const meta = await sharp(input).metadata().catch(() => null);
      if (!meta || Math.min(meta.width ?? 0, meta.height ?? 0) < 250) continue;
      await sharp(input)
        .flatten({ background: '#ffffff' })
        .resize({ width: 1000, height: 1000, fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 86 })
        .toFile(path.join(OUT, `${id}.jpg`));
      doc.set('image', `/products/${id}.jpg`);
      if (!doc.get('imageCredit')) doc.set('imageCredit', `Photo: ${doc.get('brand') ?? String(doc.get('name')).split(' ')[0]}`);
      fs.writeFileSync(full, doc.toString({ lineWidth: 0 }));
      console.log(`${id}: ${url}`);
      added++;
      saved = true;
      break;
    }
    if (!saved) console.warn(`${id}: no usable image on ${source}`);
  } catch (e) {
    console.warn(`${id}: ${e.message}`);
  }
}
console.log(`Added ${added} product photo(s).`);
