import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Content architecture
 * --------------------
 * issues    — one JSON file per issue (metadata + ordered section list)
 * articles  — one Markdown file per standalone feature article
 * events    — one JSON file per recurring community event
 * specials  — one JSON file per special (one-off) event weekend
 * gallery   — one JSON file per issue's gallery
 *
 * Adding Issue Two = add issue-002.json, its articles, and a gallery file.
 * No components need to change.
 */

const issues = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/issues' }),
  schema: z.object({
    number: z.number(),
    slug: z.string(),
    title: z.string(),
    subtitle: z.string().optional(),
    date: z.coerce.date(),
    description: z.string(),
    theme: z
      .object({
        /** Accent used for links/highlights inside this issue. */
        accent: z.string().default('var(--violet)'),
        /** Deep backdrop used on the cover and full-width breaks. */
        twilight: z.string().default('var(--twilight)'),
      })
      .default({}),
    /** Cover art: key into the issue's asset map (see src/lib/images.ts). */
    coverImage: z.string(),
    coverImageAlt: z.string(),
    /** True when the cover art already includes the masthead, title and
     *  cover lines (a finished magazine cover) — the hero then shows the
     *  image full rather than overlaying its own text. */
    coverImageComplete: z.boolean().default(false),
    coverLines: z.array(z.string()).default([]),
    featuredArticles: z.array(z.string()).default([]),
    /** Ordered sections rendered on the issue page. */
    sections: z.array(
      z.object({
        id: z.string(),
        type: z.enum([
          'founders-letter',
          'lead-feature',
          'stats',
          'gallery',
          'events',
          'founder-profile',
          'feedback',
          'mascot-corner',
          'closing',
        ]),
        title: z.string(),
        kicker: z.string().optional(),
        /** Section-specific payload; each section component documents its shape. */
        data: z.record(z.string(), z.any()).default({}),
      }),
    ),
    contributors: z.array(z.string()).default([]),
    categories: z.array(z.string()).default([]),
    status: z.enum(['draft', 'published']).default('draft'),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
    socialImage: z.string().optional(),
  }),
});

const articles = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/articles' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    issue: z.string(),
    standfirst: z.string(),
    authors: z.array(z.string()).default(['Rainbow Circuits']),
    date: z.coerce.date(),
    category: z.enum(['community', 'member-features', 'creative-corner', 'queer-ai', 'news']),
    heroImage: z.string().optional(),
    heroImageAlt: z.string().optional(),
    pullQuote: z.string().optional(),
    tags: z.array(z.string()).default([]),
    readingTime: z.string().optional(),
    status: z.enum(['draft', 'published']).default('draft'),
    /** Founder profiles: structured extras rendered alongside the body. */
    profile: z
      .object({
        role: z.string().optional(),
        favouriteGalaMemory: z.string().optional(),
        favouriteMascotDetail: z.string().optional(),
        personalQuote: z.string().optional(),
        quickFire: z
          .array(z.object({ q: z.string(), a: z.string() }))
          .default([]),
        links: z
          .array(z.object({ label: z.string(), url: z.string() }))
          .default([]),
      })
      .optional(),
  }),
});

const events = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/events' }),
  schema: z.object({
    name: z.string(),
    slug: z.string(),
    emoji: z.string().default('🌈'),
    description: z.string(),
    frequency: z.enum(['weekly', 'weekend', 'monthly']),
    schedule: z.string(),
    active: z.boolean().default(true),
    /**
     * True for events that pause during special event weekends
     * (Community Café pauses when a big weekend event runs).
     */
    pausesForSpecialEvents: z.boolean().default(false),
    /** Ways members can join in — kept visible to lower the pressure. */
    participationIdeas: z.array(z.string()).default([]),
    accent: z.string().default('var(--violet)'),
    displayOrder: z.number().default(99),
  }),
});

const specials = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/specials' }),
  schema: z.object({
    name: z.string(),
    slug: z.string(),
    description: z.string(),
    starts: z.coerce.date(),
    ends: z.coerce.date(),
    /** When true, Community Café does not run that weekend. */
    replacesCommunityCafe: z.boolean().default(false),
    recurrence: z.string().optional(),
  }),
});

const gallery = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/gallery' }),
  schema: z.object({
    issue: z.string(),
    /** How many items show before the "Show more" control. */
    initiallyVisible: z.number().default(6),
    items: z.array(
      z.object({
        /** Key into the issue's asset map, or "placeholder". */
        image: z.string(),
        alt: z.string(),
        title: z.string(),
        member: z.string(),
        companion: z.string().optional(),
        caption: z.string().optional(),
        creditUrl: z.string().optional(),
        contentWarning: z.string().optional(),
        nsfw: z.boolean().default(false),
        /** True until the real submission, credit, and consent are in place. */
        placeholder: z.boolean().default(false),
      }),
    ),
  }),
});

export const collections = { issues, articles, events, specials, gallery };
