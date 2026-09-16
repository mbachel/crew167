/**
 * Optional build-time Instagram fetch.
 *
 * If INSTAGRAM_TOKEN is present in the environment, recent posts are pulled
 * during `astro build` and baked into the HTML as ordinary <img> tags — no
 * client-side JS, no third-party script, nothing to hydrate.
 *
 * If the token is missing or the request fails, this returns an empty array and
 * the build carries on; the Instagram section falls back to a follow card.
 *
 * Caveat worth knowing: Instagram's CDN URLs expire after a few days, so if you
 * use this path, rebuild on a schedule. The GitHub Actions workflow has a
 * weekly cron commented out for exactly this.
 */

export interface InstagramPost {
  id: string;
  caption?: string;
  permalink: string;
  imageUrl: string;
  isVideo: boolean;
  timestamp?: string;
}

interface GraphMedia {
  id: string;
  caption?: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  media_url?: string;
  thumbnail_url?: string;
  permalink: string;
  timestamp?: string;
}

export async function getInstagramPosts(limit = 6): Promise<InstagramPost[]> {
  const token = import.meta.env.INSTAGRAM_TOKEN ?? process.env.INSTAGRAM_TOKEN;
  if (!token) return [];

  const url = new URL('https://graph.instagram.com/me/media');
  url.searchParams.set(
    'fields',
    'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp',
  );
  url.searchParams.set('limit', String(limit));
  url.searchParams.set('access_token', token);

  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(10_000) });
    if (!response.ok) {
      console.warn(
        `[instagram] ${response.status} ${response.statusText} — falling back to the follow card.`,
      );
      return [];
    }

    const body = (await response.json()) as { data?: GraphMedia[] };

    return (body.data ?? [])
      .map((item): InstagramPost | null => {
        const imageUrl = item.media_type === 'VIDEO' ? item.thumbnail_url : item.media_url;
        if (!imageUrl) return null;
        return {
          id: item.id,
          caption: item.caption,
          permalink: item.permalink,
          imageUrl,
          isVideo: item.media_type === 'VIDEO',
          timestamp: item.timestamp,
        };
      })
      .filter((post): post is InstagramPost => post !== null)
      .slice(0, limit);
  } catch (error) {
    console.warn('[instagram] fetch failed — falling back to the follow card.', error);
    return [];
  }
}

/** First line of a caption, trimmed to something that fits under a thumbnail. */
export function shortCaption(caption: string | undefined, max = 90): string | undefined {
  if (!caption) return undefined;
  const firstLine = caption.split('\n')[0]!.trim();
  if (!firstLine) return undefined;
  return firstLine.length > max ? `${firstLine.slice(0, max - 1).trimEnd()}…` : firstLine;
}
