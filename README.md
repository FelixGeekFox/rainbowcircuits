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

## The feedback form

The "What Should We Do Next?" form posts to **Formspree** (a form backend, since
static hosting has no server), which emails submissions to `SITE.contactEmail`.
The endpoint lives in `formEndpoint` in `src/lib/site.ts` — set it to a
different Formspree form URL to re-point it, or `''` to disable it (the form
then tells visitors to reach out in the community instead).

Spam protection is layered: a honeypot field + minimum-submit-time check on the
page, plus Formspree's own spam filtering. Submissions also appear in the
Formspree dashboard.

## The locked mod page

The moderator guide lives at `/mods/` (unlinked from navigation, `noindex`).
It's **encrypted**: the passcode decrypts the guide in the browser, and only
the ciphertext (`src/content/protected/mod-guide.enc.json`) is committed. The
plaintext never enters the public repo.

**Editing the guide / setting the passcode:**

1. Edit `mod-content/mod-guide.html` — this is your local, gitignored
   plaintext (plain HTML). Keep a backup; it is the only editable copy and it
   does **not** live in git.
2. Encrypt it with your chosen passcode:

   ```powershell
   # PowerShell
   $env:MOD_PASSCODE = "your team passphrase"
   npm run encrypt-mods
   ```
   ```bash
   # bash
   MOD_PASSCODE="your team passphrase" npm run encrypt-mods
   ```
3. Commit + push the updated `src/content/protected/mod-guide.enc.json`.

Now anyone visiting `/mods/` needs the passphrase to read the guide. To change
who has access, pick a new passphrase and re-run step 2.

**Ships with a demo:** out of the box the page is encrypted with placeholder
content and the passcode `demo`, just so it works before you run the steps
above. Your first `npm run encrypt-mods` replaces it with the real guide under
your secret passcode.

**Honest limits:** this is real cryptography (AES-256-GCM, PBKDF2), so the
guide genuinely can't be read from the source without the passcode — but it's a
single shared secret. Anyone you give it to can read and re-share the content,
and there's no per-person access or revocation short of changing the passcode.
Choose a strong passphrase. (Once you're happy with this page, you can retire
the old public `rainbowcircuits-mods` site.)

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
