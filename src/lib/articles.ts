import { getCollection, type CollectionEntry } from 'astro:content';
import { AMAZON_TAG, type Pet } from '../consts';

export type Article = CollectionEntry<'articles'>;

/** Published articles, newest first. Drafts are included only in dev. */
export async function getArticles(pet?: Pet): Promise<Article[]> {
  const all = await getCollection('articles', ({ data }) => import.meta.env.DEV || !data.draft);
  return all
    .filter((a) => !pet || a.data.pet === pet)
    .sort((a, b) => lastUpdated(b).valueOf() - lastUpdated(a).valueOf());
}

export function lastUpdated(a: Article): Date {
  return a.data.updatedDate ?? a.data.pubDate;
}

export function formatDate(d: Date): string {
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
}

export type Product = CollectionEntry<'products'>;

/** Products for the home page: featured first, and only products whose roundup is published. */
export async function getFeaturedProducts(): Promise<Product[]> {
  const published = new Set((await getArticles()).map((a) => a.id));
  const all = (await getCollection('products')).filter((p) => !p.data.roundup || published.has(p.data.roundup));
  return [...all.filter((p) => p.data.featured), ...all.filter((p) => !p.data.featured)];
}

/** Where a product's "Check price" button goes: its own link, or an Amazon search for the product name. */
export function productLink(p: Product): string {
  const url = new URL(p.data.href ?? `https://www.amazon.com/s?k=${encodeURIComponent(p.data.name)}`);
  if (AMAZON_TAG && /(^|\.)amazon\.com$/.test(url.hostname)) url.searchParams.set('tag', AMAZON_TAG);
  return url.toString();
}
