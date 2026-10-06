#!/usr/bin/env node
/**
 * Tells IndexNow search engines (Bing, Yahoo, DuckDuckGo, Yandex; Bing also feeds ChatGPT search and Copilot)
 * about articles published or updated in the last 2 days, plus the home and section pages.
 * The key file lives at public/<key>.txt. Usage: node scripts/indexnow.mjs
 */
import fs from 'node:fs';

const HOST = 'mypetexperts.com';
const KEY = 'f385f8c755b62b547e93d1b6db190a24';
const DAYS = 2;

const since = Date.now() - DAYS * 24 * 60 * 60 * 1000;
const urls = [];
for (const f of fs.readdirSync('src/content/articles').filter((f) => f.endsWith('.mdx'))) {
  const text = fs.readFileSync(`src/content/articles/${f}`, 'utf8');
  if (/^draft:\s*true/m.test(text)) continue;
  const date = text.match(/^updatedDate:\s*'?([\d-]+)/m)?.[1] ?? text.match(/^pubDate:\s*'?([\d-]+)/m)?.[1];
  if (date && new Date(date).getTime() >= since) urls.push(`https://${HOST}/${f.replace(/\.mdx$/, '')}/`);
}
if (!urls.length) {
  console.log('No new or updated articles to submit.');
  process.exit(0);
}
urls.push(`https://${HOST}/`, `https://${HOST}/dogs/`, `https://${HOST}/cats/`);

const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList: urls }),
});
console.log(`IndexNow: submitted ${urls.length} URLs, status ${res.status}`);
