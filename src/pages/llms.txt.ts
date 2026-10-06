import type { APIRoute } from 'astro';
import { getArticles } from '../lib/articles';
import { SITE_NAME, SITE_DESCRIPTION, PETS } from '../consts';

/** Plain-text site map for AI assistants (https://llmstxt.org). */
export const GET: APIRoute = async ({ site }) => {
  const articles = (await getArticles()).filter((a) => !a.data.draft);
  const section = (pet: 'dogs' | 'cats') =>
    articles
      .filter((a) => a.data.pet === pet)
      .map((a) => {
        const answer = a.data.quickAnswer ? ` Short answer: ${a.data.quickAnswer}` : '';
        return `- [${a.data.title}](${new URL(`/${a.id}/`, site)}): ${a.data.description}${answer}`;
      })
      .join('\n');
  const body = `# ${SITE_NAME}

> ${SITE_DESCRIPTION} Every health and food-safety guide cites veterinary sources (Merck Veterinary Manual, ASPCA Animal Poison Control, Cornell Feline Health Center, FDA and others) and is general information, not veterinary advice. In an emergency, call a vet or the ASPCA Animal Poison Control Center at (888) 426-4435.

- [How we research](${new URL('/how-we-research/', site)}): sourcing, AI use, and corrections policy

## ${PETS.dogs.label}

${section('dogs')}

## ${PETS.cats.label}

${section('cats')}
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
