import type { Article } from './articles';

/** Food types used for filtering on the Dogs and Cats pages. */
export const CATEGORIES = {
  fruit: 'Fruit',
  veggies: 'Veggies',
  meat: 'Meat & fish',
  dairy: 'Dairy',
  grains: 'Grains & snacks',
  nuts: 'Nuts',
  other: 'Other',
} as const;
export type Category = keyof typeof CATEGORIES;

// Checked in order; first match wins. Keys match words in the article's URL slug.
const RULES: [Category, RegExp][] = [
  ['grains', /popcorn|peanut-butter|potato-chips|french-fries|chocolate|ice-cream-cone/],
  ['nuts', /almond|cashew|walnut|pistachio|macadamia|pecan|peanut(?!-butter)/],
  ['dairy', /cheese|milk|yogurt|ice-cream|(?<!peanut-)butter|cream/],
  ['meat', /chicken|beef|pork|ham(?!ster)|bacon|turkey|hamburger|salmon|tuna|shrimp|fish|bone|broth|egg(?!plant)|meat|sausage|lamb|duck/],
  ['fruit', /apple|banana|blueberr|strawberr|raspberr|watermelon|melon|honeydew|mango|pineapple|orange|grape|raisin|avocado|coconut|peach|pear|cherr|kiwi|lemon|lime|berr/],
  ['veggies', /broccoli|carrot|cucumber|green-bean|peas|chickpea|corn|potato|spinach|lettuce|celery|mushroom|pumpkin|tomato|garlic|onion|zucchini|cabbage|kale|asparagus|pepper/],
  ['grains', /bread|rice|pasta|oatmeal|oat|cereal|popcorn|chips|fries|cracker|honey|cinnamon|chocolate|peanut-butter|candy|cookie|cake|sugar/],
];

export function categoryOf(article: Article): Category {
  if (article.data.category) return article.data.category;
  const slug = article.id.replace(/^can-(dogs|cats|puppies|kittens)-(eat|drink|have)-/, '');
  return RULES.find(([, rx]) => rx.test(slug))?.[0] ?? 'other';
}
