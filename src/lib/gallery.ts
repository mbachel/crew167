import type { ImageMetadata } from 'astro';
import { getCollection } from 'astro:content';

/**
 * Folder-driven photo albums.
 *
 * Drop a folder of images into `src/images/gallery/<slug>/` and it becomes an
 * album — no config required. Optionally add `src/content/albums/<slug>.md` to
 * set a nicer title, a date, a blurb, a cover photo, and per-photo captions.
 *
 * Vite resolves this glob at build time, so every image goes through Astro's
 * optimiser and nothing is read from disk at runtime.
 */
const imageFiles = import.meta.glob<{ default: ImageMetadata }>(
  '/src/images/gallery/*/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG,WEBP,AVIF}',
  { eager: true },
);

export interface Photo {
  src: ImageMetadata;
  filename: string;
  caption?: string;
  alt: string;
}

export interface Album {
  slug: string;
  title: string;
  date?: Date;
  description?: string;
  photos: Photo[];
  cover: Photo;
  count: number;
}

/** "2025-grayson-highlands" -> "Grayson Highlands" (+ 2025 picked up as the date) */
function titleFromSlug(slug: string): string {
  const withoutDate = slug.replace(/^\d{4}(?:-\d{2})?(?:-\d{2})?-/, '');
  return withoutDate
    .split('-')
    .filter(Boolean)
    .map((word) => (word.length <= 2 ? word : word[0]!.toUpperCase() + word.slice(1)))
    .join(' ');
}

/** A leading YYYY or YYYY-MM in the folder name doubles as the album date. */
function dateFromSlug(slug: string): Date | undefined {
  const match = /^(\d{4})(?:-(\d{2}))?(?:-(\d{2}))?/.exec(slug);
  if (!match) return undefined;
  const year = Number(match[1]);
  if (year < 1990 || year > 2200) return undefined;
  return new Date(year, match[2] ? Number(match[2]) - 1 : 0, match[3] ? Number(match[3]) : 1);
}

const collator = new Intl.Collator('en', { numeric: true, sensitivity: 'base' });

export async function getAlbums(): Promise<Album[]> {
  const meta = new Map(
    (await getCollection('albums', ({ data }) => import.meta.env.DEV || !data.draft)).map(
      (entry) => [entry.id, entry.data] as const,
    ),
  );

  const grouped = new Map<string, { filename: string; src: ImageMetadata }[]>();

  for (const [path, mod] of Object.entries(imageFiles)) {
    const segments = path.split('/');
    const slug = segments[4];
    const filename = segments[5];
    if (!slug || !filename) continue;
    if (!grouped.has(slug)) grouped.set(slug, []);
    grouped.get(slug)!.push({ filename, src: mod.default });
  }

  const albums: Album[] = [];

  for (const [slug, files] of grouped) {
    const data = meta.get(slug);
    if (data?.draft && !import.meta.env.DEV) continue;
    if (files.length === 0) continue;

    const title = data?.title ?? titleFromSlug(slug);
    files.sort((a, b) => collator.compare(a.filename, b.filename));

    const photos: Photo[] = files.map(({ filename, src }) => {
      const caption = data?.captions?.[filename];
      return {
        src,
        filename,
        caption,
        alt: caption ?? `${title} — Crew 167 photo`,
      };
    });

    const cover = data?.cover
      ? (photos.find((p) => p.filename === data.cover) ?? photos[0]!)
      : photos[0]!;

    albums.push({
      slug,
      title,
      date: data?.date ?? dateFromSlug(slug),
      description: data?.description,
      photos,
      cover,
      count: photos.length,
    });
  }

  // Newest first; albums without a date fall to the bottom, sorted by name.
  albums.sort((a, b) => {
    if (a.date && b.date) return b.date.getTime() - a.date.getTime();
    if (a.date) return -1;
    if (b.date) return 1;
    return collator.compare(b.slug, a.slug);
  });

  return albums;
}

export async function getAlbum(slug: string): Promise<Album | undefined> {
  return (await getAlbums()).find((album) => album.slug === slug);
}

export function formatAlbumDate(date?: Date): string | undefined {
  if (!date) return undefined;
  // Folder-derived dates are month-precision at best; don't imply a day.
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}
