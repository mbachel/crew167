import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { pageSections } from './loaders/page-sections';

/**
 * `pages` — one markdown file per page in `src/content/pages/`, split into
 * sections by `##` headings (and optionally grouped by `#` headings).
 *
 * Edit the prose there; the page headings and layout stay in the `.astro`
 * templates. See src/loaders/page-sections.ts for the format.
 */
const pages = defineCollection({
  loader: pageSections({ base: 'src/content/pages' }),
  schema: z.object({
    /** Filename without the extension, e.g. 'home'. */
    page: z.string(),
    /** Slug of the enclosing `#` heading, or 'default' if there isn't one. */
    group: z.string(),
    /** Raw text of the enclosing `#` heading. */
    groupTitle: z.string(),
    /** Slug of the `##` heading — how templates look a section up. */
    key: z.string(),
    /** Raw text of the `##` heading, used where it's also display text. */
    title: z.string(),
    /** 1-based position within the group, in document order. */
    order: z.number(),
  }),
});

/**
 * `albums` — optional metadata for a photo folder in `src/images/gallery/<slug>/`.
 * The folder alone is enough to publish an album; this file just lets you set a
 * nicer title, a date, a blurb, a cover photo and per-photo captions.
 *
 * These stay one-file-per-album on purpose: each one describes a different
 * folder of images, so there's no single page they'd collapse into.
 */
const albums = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/albums' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date().optional(),
    description: z.string().optional(),
    /** Filename of the photo to use as the album cover, e.g. 'ridgeline.jpg'. */
    cover: z.string().optional(),
    /** Map of filename → caption. Any photo you leave out just has no caption. */
    captions: z.record(z.string(), z.string()).optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { pages, albums };
