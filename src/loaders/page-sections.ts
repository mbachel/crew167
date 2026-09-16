import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Loader } from 'astro/loaders';

/**
 * One markdown file per page, split into named sections.
 *
 * Instead of scattering a page's prose across a dozen tiny files, each page gets
 * a single file in `src/content/pages/`. Inside it:
 *
 *   # Group Heading     <- optional. Groups sections (articles, officers, …)
 *   ## section-key      <- starts a section. Everything under it is its body.
 *
 * Each section is rendered through Astro's own markdown pipeline, so plugins,
 * smart quotes and GFM all behave exactly as they would in a normal `.md` entry.
 *
 * The `##` headings are keys, not display text — page headings live in the
 * `.astro` templates. Where a heading *is* the display text (by-laws articles,
 * officer names), the loader keeps the raw text as `title` too.
 */

const FRONTMATTER = /^﻿?---\r?\n[\s\S]*?\r?\n---[ \t]*\r?\n?/;

function slugify(value: string): string {
  return value
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/['‘’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

interface ParsedSection {
  group: string;
  groupTitle: string;
  key: string;
  title: string;
  body: string;
}

export function parseSections(markdown: string): ParsedSection[] {
  const lines = markdown.replace(FRONTMATTER, '').split(/\r?\n/);
  const sections: (Omit<ParsedSection, 'body'> & { lines: string[] })[] = [];

  let fence: string | null = null;
  let group = 'default';
  let groupTitle = '';
  let current: (typeof sections)[number] | undefined;

  for (const line of lines) {
    // Track code fences so a "#" inside a snippet is never read as a heading.
    const fenceMatch = /^\s{0,3}(```+|~~~+)/.exec(line);
    if (fenceMatch) {
      const marker = fenceMatch[1]![0]!;
      if (fence === null) fence = marker;
      else if (marker === fence) fence = null;
    }

    if (fence === null) {
      const groupHeading = /^#[ \t]+(.+?)[ \t]*$/.exec(line);
      if (groupHeading) {
        groupTitle = groupHeading[1]!;
        group = slugify(groupTitle);
        continue;
      }

      const sectionHeading = /^##[ \t]+(.+?)[ \t]*$/.exec(line);
      if (sectionHeading) {
        const title = sectionHeading[1]!;
        current = { group, groupTitle, title, key: slugify(title), lines: [] };
        sections.push(current);
        continue;
      }
    }

    if (current) current.lines.push(line);
  }

  return sections.map(({ lines: body, ...rest }) => ({
    ...rest,
    body: body.join('\n').trim(),
  }));
}

export function pageSections(options: { base: string }): Loader {
  return {
    name: 'page-sections',

    async load({ config, store, logger, parseData, renderMarkdown, generateDigest, watcher }) {
      const dirPath = fileURLToPath(
        new URL(options.base.replace(/^\.?\//, '').replace(/\/?$/, '/'), config.root),
      );
      const rootPath = fileURLToPath(config.root);

      const syncFile = async (fileName: string) => {
        const filePath = path.join(dirPath, fileName);
        const page = fileName.replace(/\.md$/i, '');
        const parsed = parseSections(await readFile(filePath, 'utf8'));

        // Drop whatever this file produced last time before re-adding.
        for (const id of [...store.keys()]) {
          if (id.startsWith(`${page}/`)) store.delete(id);
        }

        if (parsed.length === 0) {
          logger.warn(`${fileName} has no "## section" headings — nothing to render.`);
          return;
        }

        const orderByGroup = new Map<string, number>();

        for (const section of parsed) {
          const order = (orderByGroup.get(section.group) ?? 0) + 1;
          orderByGroup.set(section.group, order);

          const id = `${page}/${section.key}`;
          const relativePath = path.relative(rootPath, filePath).split(path.sep).join('/');

          store.set({
            id,
            data: await parseData({
              id,
              filePath: relativePath,
              data: {
                page,
                group: section.group,
                groupTitle: section.groupTitle,
                key: section.key,
                title: section.title,
                order,
              },
            }),
            body: section.body,
            filePath: relativePath,
            digest: generateDigest(section.body),
            rendered: await renderMarkdown(section.body),
          });
        }
      };

      store.clear();
      const files = (await readdir(dirPath)).filter((file) => file.toLowerCase().endsWith('.md'));
      for (const file of files) await syncFile(file);

      if (!watcher) return;

      watcher.add(dirPath);
      const onChange = async (changedPath: string) => {
        if (!changedPath.startsWith(dirPath) || !changedPath.toLowerCase().endsWith('.md')) return;
        await syncFile(path.basename(changedPath));
        logger.info(`Reloaded sections from ${path.basename(changedPath)}`);
      };
      watcher.on('change', onChange);
      watcher.on('add', onChange);
    },
  };
}
