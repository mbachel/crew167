import type { ImageMetadata } from 'astro';

/**
 * Photos for the "Who we are" carousel on the homepage.
 *
 * Drop an image into `src/images/about/` and it becomes a slide — no code
 * change, no list to update. Vite resolves this glob at build time, so every
 * file goes through Astro's optimiser (responsive sizes, modern formats) and a
 * file the browser couldn't display fails the build rather than the page.
 *
 * Ordering is by filename, numerically, which is why the samples are prefixed
 * `01-`, `02-` and so on. The rest of the filename becomes the alt text, so
 * name them descriptively: `03-summit-of-the-day.jpg` reads as
 * "Summit of the day".
 *
 * The glob pattern has to be a literal for Vite to statically analyse it, so
 * the folder is fixed here rather than passed in.
 */
const files = import.meta.glob<{ default: ImageMetadata }>(
  '/src/images/about/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG,WEBP,AVIF}',
  { eager: true },
);

export interface AboutPhoto {
  src: ImageMetadata;
  filename: string;
  alt: string;
}

/** "03-summit-of-the-day.jpg" -> "Summit of the day" */
function altFromFilename(filename: string): string {
  const words = filename
    .replace(/\.[^.]+$/, '')
    .replace(/^\d+[-_]?/, '')
    .split(/[-_]+/)
    .filter(Boolean);

  if (words.length === 0) return 'Venturing Crew 167';
  const [first, ...rest] = words;
  return [first!.charAt(0).toUpperCase() + first!.slice(1), ...rest].join(' ');
}

const collator = new Intl.Collator('en', { numeric: true, sensitivity: 'base' });

export const aboutPhotos: AboutPhoto[] = Object.entries(files)
  .map(([path, mod]) => {
    const filename = path.split('/').pop()!;
    return { src: mod.default, filename, alt: altFromFilename(filename) };
  })
  .sort((a, b) => collator.compare(a.filename, b.filename));
