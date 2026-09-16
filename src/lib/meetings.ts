/**
 * Meeting-date maths for "the 1st and 3rd Tuesday of every month".
 *
 * Kept dependency-free and side-effect-free so the same function can run at
 * build time (for the no-JS fallback) and in the browser (so the list is right
 * even months after the last deploy).
 */

const TUESDAY = 2; // 0 = Sunday

/** The `nth` Tuesday of a given month. `nth` is 1-based. */
function nthTuesday(year: number, month: number, nth: number): Date {
  const first = new Date(year, month, 1);
  const offset = (TUESDAY - first.getDay() + 7) % 7;
  return new Date(year, month, 1 + offset + (nth - 1) * 7);
}

export interface MeetingDate {
  date: Date;
  /** 1 or 3 — which Tuesday of the month this is. */
  ordinal: 1 | 3;
}

/**
 * The next `count` regular meetings on or after `from`.
 * Today counts as upcoming right up until the meeting ends.
 */
export function upcomingMeetings(count = 4, from: Date = new Date()): MeetingDate[] {
  const results: MeetingDate[] = [];
  const cursor = new Date(from.getFullYear(), from.getMonth(), 1);

  // A meeting is still "upcoming" until 20:30 on the day itself.
  const cutoff = new Date(from);
  cutoff.setHours(from.getHours(), from.getMinutes(), 0, 0);

  while (results.length < count) {
    for (const ordinal of [1, 3] as const) {
      const date = nthTuesday(cursor.getFullYear(), cursor.getMonth(), ordinal);
      const endOfMeeting = new Date(date);
      endOfMeeting.setHours(20, 30, 0, 0);
      if (endOfMeeting >= cutoff && results.length < count) {
        results.push({ date, ordinal });
      }
    }
    cursor.setMonth(cursor.getMonth() + 1);
  }

  return results;
}

export function formatMeetingDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

export function formatMeetingDateShort(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/** ISO date (YYYY-MM-DD) for <time datetime="…">. */
export function isoDate(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}
