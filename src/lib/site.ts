/**
 * Site-wide configuration. Everything an editor might need to change
 * without touching components lives here.
 */

export const SITE = {
  name: 'Rainbow Circuits',
  /** Public display name of the publication (shown in titles, share text, mastheads). */
  zineName: 'Rainbow Circuits Newsletter',
  tagline: 'A queer-first community built around kindness, creativity, curiosity, and connection through AI.',
  /** Main community home. */
  communityUrl: 'https://www.reddit.com/r/RainbowCircuits/',
  /**
   * Feedback form endpoint (e.g. a Formspree form URL like
   * "https://formspree.io/f/XXXXXXXX"). Leave empty until configured —
   * the form will explain how to reach us instead of silently dropping
   * submissions. See README → "Connecting the feedback form".
   */
  formEndpoint: '',
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
