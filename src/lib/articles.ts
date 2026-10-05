import { getCollection, type CollectionEntry } from 'astro:content';
import type { Pet } from '../consts';

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

/** Products for the home page. In production only products with an affiliate link are shown. */
export async function getFeaturedProducts(): Promise<Product[]> {
  const all = await getCollection('products');
  const usable = all.filter((p) => import.meta.env.DEV || p.data.href);
  return [...usable.filter((p) => p.data.featured), ...usable.filter((p) => !p.data.featured)];
}
