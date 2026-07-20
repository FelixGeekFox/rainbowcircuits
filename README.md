# Rainbow Circuits — site & newsletter

The Rainbow Circuits community site and its web-native publication, the
**Rainbow Circuits Newsletter** (served under `/newsletter/`). Built with
[Astro](https://astro.build) as a fully static site — no database, no server,
content lives in editable files.

## Quick start

```bash
npm install
npm run dev       # local preview at http://localhost:4321/rainbowcircuits/
npm run build     # production build into dist/
```

## Where everything lives

| What | Where |
| --- | --- |
| Issue metadata & section order | `src/content/issues/issue-001.json` |
| Feature articles (Gala, Felix, Arthur) | `src/content/articles/*.md` |
| Recurring events (Prism Prompt, café…) | `src/content/events/*.json` |
| Special event weekends (the Gala) | `src/content/specials/*.json` |
| Gala gallery submissions | `src/content/gallery/issue-001.json` |
| Images | `src/assets/` + one line in `src/lib/images.ts` |
| Colours, fonts, spacing | `src/styles/global.css` |
| Community links & form endpoint | `src/lib/site.ts` |
| Topic archive definitions | `src/data/categories.ts` |

## Editing content

**Articles** are Markdown with frontmatter. Set `status: "draft"` to keep a
piece out of the build, `"published"` to ship it.

**Issues** are JSON. The `sections` array controls what appears on the issue
page and in what order; each section has a `type` that maps to a component
(`founders-letter`, `lead-feature`, `stats`, `gallery`, `events`,
`founder-profile`, `feedback`, `mascot-corner`, `closing`).

**Adding Issue Two**: copy `issue-001.json` → `issue-002.json`, bump
`number`/`slug`/`date`, write its articles and gallery file. The homepage,
archive, and navigation pick it up automatically; Issue One stays exactly
where it is.

**Images**: drop the file in `src/assets/<issue>/`, add one import line in
`src/lib/images.ts`, then refer to it by key from content files. Astro
generates responsive, optimised versions at build time — commit the original.

**Events**: Community Café has `pausesForSpecialEvents: true`. Special
weekends (in `src/content/specials/`) carry `replacesCommunityCafe: true` —
when one of those runs, the café does not.

## Placeholders

Anything not yet supplied is marked in square brackets, e.g.
`[Founder letter to be added]`, `[Member credit required]` — and placeholder
images render as an obvious dashed frame. **Before launching an issue**,
search the content folder for `[` and `placeholder` to confirm nothing
unfinished ships:

```bash
grep -rn "to be added\|required\]\|\[TBC\]\|placeholder" src/content/
```

Member gallery submissions must have consent + credit recorded before
`placeholder: true` is removed.

## Connecting the feedback form

The "What Should We Do Next?" form needs a form backend (static hosting has
no server). The simplest option:

1. Create a free form at [formspree.io](https://formspree.io) (no code, 50
   submissions/month free).
2. Put the endpoint URL into `formEndpoint` in `src/lib/site.ts`.

Until then the form validates but tells visitors to share feedback in the
community instead. Spam protection (honeypot + timing) is built in.

## Deploying

Pushing to `main` runs `.github/workflows/deploy.yml`, which builds the site
and publishes it to GitHub Pages.

**One-time setup**: in the GitHub repo go to *Settings → Pages* and set
**Source** to **GitHub Actions**. The site then lives at
`https://felixgeekfox.github.io/rainbowcircuits/`.

If you later use a custom domain, update `site`/`base` in `astro.config.mjs`.

## Accessibility & performance notes

- Reduced-motion preferences disable all decorative animation.
- The gallery lightbox is a native `<dialog>`: keyboard navigable, Esc to
  close, focus-trapped, background scroll locked.
- All meaningful images need real alt text (placeholders make this loud).
- Images lazy-load below the fold and ship in responsive modern formats.
