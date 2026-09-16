import { getCollection, render } from 'astro:content';
import type { AstroComponentFactory } from 'astro/runtime/server/index.js';

/**
 * Helpers for reading a page's markdown sections in an `.astro` template.
 *
 *   const copy = await pageCopy('home');
 *   const About = copy('about');          // -> <About />
 *
 *   const articles = await pageGroup('by-laws', 'articles');
 *   articles.map(({ title, Content }) => …)
 *
 * Both throw a build-time error naming the file and key if something is missing,
 * so a typo in a heading fails the build instead of silently rendering nothing.
 */

export interface Section {
  key: string;
  title: string;
  group: string;
  groupTitle: string;
  order: number;
  Content: AstroComponentFactory;
}

async function sectionsFor(page: string): Promise<Section[]> {
  const entries = await getCollection('pages', ({ data }) => data.page === page);

  if (entries.length === 0) {
    throw new Error(
      `No content found for page "${page}". Expected src/content/pages/${page}.md with at least one "## section" heading.`,
    );
  }

  const sections = await Promise.all(
    entries.map(async (entry) => {
      const { Content } = await render(entry);
      return {
        key: entry.data.key,
        title: entry.data.title,
        group: entry.data.group,
        groupTitle: entry.data.groupTitle,
        order: entry.data.order,
        Content,
      };
    }),
  );

  return sections.sort((a, b) => a.order - b.order);
}

/** Returns a lookup function for one page's sections. */
export async function pageCopy(page: string) {
  const sections = await sectionsFor(page);
  const byKey = new Map(sections.map((section) => [section.key, section]));

  return function section(key: string): AstroComponentFactory {
    const match = byKey.get(key);
    if (!match) {
      throw new Error(
        `src/content/pages/${page}.md has no "## ${key}" section. ` +
          `Found: ${[...byKey.keys()].join(', ') || '(none)'}`,
      );
    }
    return match.Content;
  };
}

/** All sections under one `#` group heading, in document order. */
export async function pageGroup(page: string, group: string): Promise<Section[]> {
  const sections = await sectionsFor(page);
  const matches = sections.filter((section) => section.group === group);

  if (matches.length === 0) {
    const groups = [...new Set(sections.map((section) => section.group))];
    throw new Error(
      `src/content/pages/${page}.md has no "# ${group}" group. Found: ${groups.join(', ')}`,
    );
  }

  return matches;
}
