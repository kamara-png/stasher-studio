# Work pages backup — 2026-11-23

This folder is a temporary snapshot of the Work section before the pages were
replaced with blank placeholders. The live links were intentionally left in
place; the URLs still return HTTP 200 but show no content.

## Backed up files

- `work/index.html` — the Work listing: topbar with logo and `work (6)` /
  `about` / `contact`, a "Back to home" link, large **Work** heading, short lede
  and six themed project cards: Q Lounge, Apps, Generation Now, duo++,
  Porsche 3D and Poster Art.
- `work/q-lounge/index.html` — dark navy cover-photo theme with blue/magenta
  accents; large Q Lounge title, short overview, hero still, two near-square
  image cards with short captions, Scope chips and the CTA end panel.
- `work/allaces-games/index.html` — green Apps case study.
- `work/onedynamics/index.html` — dark Generation Now case study.
- `work/sawicki-legal/index.html` — dark duo++ case study.
- `work/ipg-interact/index.html` — dark Porsche 3D case study.
- `work/hipromine/index.html` — light/bright Poster Art case study.

Every case study used the same structure: breadcrumb, oversized title, short
overview, one hero image, up to three fully visible supporting images, a compact
deliverables/Scope panel, and the "Need a website, app or SaaS designed?" end
panel with **Start a project** and **All work**. Motion used `pjMiniFade` and
`pjMiniUp`; the homepage WebGL fold stayed behind the cards.

The blank placeholders include `<!-- stasher-blank-work-page -->` so the
post-hydration generator skips them, and `<!-- /* stasher-nav-shim */ -->` so the
local server does not inject its nav-click script into the empty page.

The visual styling still lives in `assets/portfolio/site.css` under `.proj--themed`,
`.pj-mini` and `.pj-simple`. The post-hydration DOM logic lives in
`C:\Users\tron\AppData\Local\Temp\opencode\apply-post-hydration.mjs`.

## Restore

Run `node .work-pages-backup/restore.mjs`, then run the post-hydration generator
again. The generator skips any page containing `<!-- stasher-blank-work-page -->`,
so restoring the original files makes it inject automatically.

`screenshots/` contains full-page JPEG renders of the listing and each case
study at 1440px wide.
