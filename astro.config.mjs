// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import fs from 'node:fs';

// Last-updated dates for the sitemap, read from each article's frontmatter.
const lastmod = Object.fromEntries(
  fs.readdirSync('./src/content/articles').filter((f) => f.endsWith('.mdx')).map((f) => {
    const text = fs.readFileSync(`./src/content/articles/${f}`, 'utf8');
    const date = text.match(/^updatedDate:\s*'?([\d-]+)/m)?.[1] ?? text.match(/^pubDate:\s*'?([\d-]+)/m)?.[1];
    return [`/${f.replace(/\.mdx$/, '')}/`, date];
  }),
);

// https://astro.build/config
export default defineConfig({
  site: 'https://mypetexperts.com',
  trailingSlash: 'always',
  integrations: [
    mdx(),
    sitemap({
      filter: (page) => !page.includes('/og/') && !page.includes('/admin/'),
      serialize(item) {
        const date = lastmod[new URL(item.url).pathname];
        if (date) item.lastmod = new Date(date).toISOString();
        return item;
      },
    }),
  ],
});
