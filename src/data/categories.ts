/**
 * Topic archives. A topic page is only generated once at least one
 * published article carries its slug, so empty archives never ship.
 */
export const CATEGORIES = [
  {
    slug: 'community',
    name: 'Community',
    description: 'Community news, event write-ups, and life around the circuit.',
  },
  {
    slug: 'member-features',
    name: 'Member Features',
    description: 'Interviews and profiles of the people who make Rainbow Circuits what it is.',
  },
  {
    slug: 'creative-corner',
    name: 'Creative Corner',
    description: 'Art, writing, and creative work from across the community.',
  },
  {
    slug: 'queer-ai',
    name: 'Queer & AI',
    description: 'Essays and conversations at the intersection of queer life and AI.',
  },
  {
    slug: 'news',
    name: 'News',
    description: 'Platform developments, announcements, and what’s coming next.',
  },
] as const;

export type CategorySlug = (typeof CATEGORIES)[number]['slug'];
