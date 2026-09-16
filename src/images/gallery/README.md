# Photo albums

**One folder = one album.** Drop a folder of photos in here and the gallery page,
the album page, the cover image and the lightbox all appear on the next build.
No config file is required.

```
src/images/gallery/
  2026-grayson-highlands/     <- the album
    IMG_0142.jpg
    IMG_0155.jpg
    IMG_0163.jpg
```

That publishes an album called **"Grayson Highlands"** at
`/gallery/2026-grayson-highlands/`, dated 2026, with `IMG_0142.jpg` as the cover.

## Naming

- **Start the folder with a year** (`2026-…`) or a year and month (`2026-06-…`).
  That's what sorts albums newest-first and gives them a date. Folders without a
  year still work — they just sort to the bottom.
- The rest of the folder name becomes the title: `2026-thanksgiving-in-the-woods`
  → "Thanksgiving in the Woods".
- Photos are ordered by filename, numerically — `photo-2.jpg` comes before
  `photo-10.jpg`, as you'd hope.
- `.jpg`, `.jpeg`, `.png`, `.webp` and `.avif` are all picked up.

## Optional: nicer titles and captions

To override any of the above, add a matching file at
`src/content/albums/<same-folder-name>.md`:

```markdown
---
title: Grayson Highlands
date: 2026-09-15
description: The annual backpacking trip.
cover: IMG_0155.jpg        # which photo to use as the album cover
captions:
  IMG_0142.jpg: Heading up from the trailhead.
  IMG_0163.jpg: Ponies. There are always ponies.
draft: false               # true = visible in dev, hidden on the live site
---
```

Every field is optional. Captions show on hover in the grid and under the photo
in the lightbox, and double as alt text.

## A note on file sizes

Don't resize or compress anything first — put the full-size originals straight
off the camera in here. Astro generates the responsive sizes at build time and
serves modern formats. Originals never reach the browser.

## The sample albums

`2025-grayson-highlands`, `2025-thanksgiving-in-the-woods` and
`2026-flag-retirement-ceremony` contain generated placeholder images so you can
see the gallery working. **Delete all three folders** (and their matching files
in `src/content/albums/`) once real photos are in.
