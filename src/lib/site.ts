/**
 * Site-wide configuration. Everything an editor might need to change
 * without touching components lives here.
 */

export const SITE = {
  name: 'Rainbow Circuits',
  /** Public display name of the publication (shown in titles, share text, mastheads). */
  zineName: 'Rainbow Circuits Newsletter',
  /** Three-beat brand strapline from the asset guide. */
  strapline: 'AI Connection · Queer Joy · Endless Stories',
  tagline: 'Building inclusive AI experiences and empowering queer voices through technology, creativity, and community.',
  /** Subreddit (private — named on the community page, not linked publicly). */
  communityUrl: 'https://www.reddit.com/r/RainbowCircuits/',
  /**
   * Discord invite. Leave empty until there's a shareable invite — the
   * community page then invites people to get in touch for access instead.
   */
  discordUrl: '',
  /** Public contact address (Cloudflare Email Routing → forwards to inbox). */
  contactEmail: 'info@rainbowcircuits.org',
  /**
   * Feedback form endpoint (Formspree). Submissions email to
   * SITE.contactEmail; see README → "Connecting the feedback form".
   * Set to '' to disable (the form then points people to the community).
   */
  formEndpoint: 'https://formspree.io/f/xvzerelk',
} as const;

/** Prefix an internal path with the deployment base path. */
export function withBase(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/+$/, '');
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}

/** Format an ISO date as a human-readable month + year (e.g. "July 2026"). */
export function formatMonthYear(date: Date): string {
  return date.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
}

/** Format an ISO date as a full human-readable date. */
export function formatFullDate(date: Date): string {
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

/** Zero-padded issue number, e.g. 1 → "#001". */
export function issueNumberLabel(n: number): string {
  return `#${String(n).padStart(3, '0')}`;
}
