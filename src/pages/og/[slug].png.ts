import type { APIRoute, GetStaticPaths } from 'astro';
import { Resvg } from '@resvg/resvg-js';
import path from 'node:path';
import { getArticles, type Article } from '../../lib/articles';
import { featuredSvg, specFor, type FeaturedSpec } from '../../lib/featured';

// Resolved from the project root: this module is bundled elsewhere at build time.
const fontFiles = ['BricolageGrotesque-ExtraBold.ttf', 'DMSans-Bold.ttf', 'Caveat-Bold.ttf'].map((f) =>
  path.resolve(process.cwd(), 'src/og-fonts', f),
);

const HOME: FeaturedSpec = { pet: 'dogs', kicker: 'MY PET EXPERTS', subject: 'Good stuff for good dogs.', note: 'and cats, if they allow it', tone: 'yellow' };

export const getStaticPaths: GetStaticPaths = async () => {
  const articles = await getArticles();
  return [
    { params: { slug: 'home' }, props: { spec: HOME } },
    ...articles.map((a: Article) => ({ params: { slug: a.id }, props: { spec: specFor(a) } })),
  ];
};

export const GET: APIRoute = ({ props }) => {
  const svg = featuredSvg(props.spec as FeaturedSpec);
  const png = new Resvg(svg, {
    font: { fontFiles, loadSystemFonts: false, defaultFontFamily: 'DM Sans' },
    fitTo: { mode: 'width', value: 1200 },
  })
    .render()
    .asPng();
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
