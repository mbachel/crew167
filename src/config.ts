/**
 * Single source of truth for everything about the crew that isn't prose.
 *
 * Prose lives in `src/content/**` as markdown. Names, addresses, emails, links
 * and third-party IDs live here so you only ever have to change them once.
 */

export const SITE = {
  name: 'Venturing Crew 167',
  shortName: 'Crew 167',
  tagline: 'Adventure, leadership, and service in Charlotte, NC',
  description:
    'Venturing Crew 167 is a coed BSA Venturing crew in Charlotte, North Carolina for youth 14–20. Backpacking, beekeeping, flag retirement, service, and leadership.',
  url: 'https://crew167.org',
  founded: 2015,
  locale: 'en_US',
} as const;

export const CONTACT = {
  advisorEmail: 'advisor@crew167.org',
  /** Youth-side inbox. Replaced the old general crew inbox. */
  presidentEmail: 'president@crew167.org',
  instagramHandle: 'venturecrew167',
  instagramUrl: 'https://www.instagram.com/venturecrew167/',
} as const;

export const MEETINGS = {
  cadence: '1st & 3rd Tuesday of every month',
  /** Occasional 5th-Tuesday meetings are in the by-laws; noted, not scheduled. */
  time: '7:00 - 8:30 PM',
  startHour: 19,
  venue: 'Good Shepherd Church',
  street: '13110 Moss Rd',
  city: 'Charlotte',
  state: 'NC',
  zip: '28273',
  get address() {
    return `${this.street}, ${this.city}, ${this.state} ${this.zip}`;
  },
  get mapUrl() {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      `${this.venue}, ${this.street}, ${this.city}, ${this.state} ${this.zip}`,
    )}`;
  },
} as const;

export const DUES = {
  youth: 25,
  adult: 5,
  when: 'Unit Renewal in March',
} as const;

export const BYLAWS = {
  /** Shown on /by-laws. Update whenever the crew adopts a revision. */
  revised: 'January 2026',
} as const;

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * THIRD-PARTY IDS — replace the two placeholders below. See SETUP.md.
 * ─────────────────────────────────────────────────────────────────────────────
 */
export const INTEGRATIONS = {
  /**
   * Formspree form ID — the bit after /f/ in your endpoint URL.
   * Get one free at https://formspree.io → New Form.
   * Example: 'xbljkqwe'
   */
  formspreeId: 'mppzkow',

  /**
   * Google Calendar ID. In Google Calendar: Settings → your calendar →
   * "Integrate calendar" → Calendar ID.
   * Example: 'c_abc123def456@group.calendar.google.com'
   */
  googleCalendarId: 'cltcrew167@gmail.com',
  googleCalendarTimeZone: 'America/New_York',

  /**
   * BSA online registration link. The old site's link carried tracking
   * parameters from a 2022 campaign — get a fresh one from my.scouting.org.
   */
  joinUrl: 'https://my.scouting.org/VES/OnlineReg/1.0.0/?tu=UF-MB-415caa0167',

  /**
   * Instagram section — pick ONE of the two, or neither.
   *
   * 1. `instagramEmbedUrl` — the src of any third-party feed iframe (Jotform,
   *    Elfsight, LightWidget…). It is lazy-loaded only once the section scrolls
   *    into view, so a slow widget can't hold up the rest of the page.
   *
   * 2. INSTAGRAM_TOKEN (env var / GitHub secret, not stored here) — a long-lived
   *    Instagram Graph API token. Posts are then fetched during `astro build`
   *    and baked into the HTML as plain images. Fastest option, no third-party
   *    scripts at all.
   *
   * With neither set, the section renders a designed "follow us" card and the
   * build still succeeds. See SETUP.md.
   */
  instagramEmbedUrl: '' as string,
  /** How many posts to show when using the build-time API fetch. */
  instagramPostCount: 6,
} as const;

export const formspreeEndpoint = `https://formspree.io/f/${INTEGRATIONS.formspreeId}`;

export const isFormspreeConfigured = !INTEGRATIONS.formspreeId.startsWith('YOUR_');
export const isCalendarConfigured = !INTEGRATIONS.googleCalendarId.startsWith('YOUR_');

export const NAV: ReadonlyArray<{ href: string; label: string }> = [
  { href: '/', label: 'Home' },
  { href: '/calendar/', label: 'Calendar' },
  { href: '/gallery/', label: 'Gallery' },
  { href: '/flag-retirement/', label: 'Flag Retirement' },
  { href: '/by-laws/', label: 'By-Laws' },
  { href: '/contact/', label: 'Contact' },
];

export const VENTURING_LINKS: ReadonlyArray<{ href: string; label: string }> = [
  { href: 'https://www.scouting.org/programs/venturing/', label: 'Venturing at Scouting America' },
  {
    href: 'https://www.buckskin.org/scouting/venturing/what-is-venturing/',
    label: 'What is Venturing?',
  },
];
