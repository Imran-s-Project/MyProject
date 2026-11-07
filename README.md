# Imran Ahmed — Portfolio (Static, Vanilla JavaScript)

No TypeScript. No Vite. No build step. This is a **plain static site** — just `index.html`, one CSS file and native browser ES modules — that you can upload as-is to any static host (Vercel, Netlify, GitHub Pages, Cloudflare Pages, …).

## Cinematic nature background

The old SVG landscape has been replaced by a **Cinematic Nature Background Engine**: six scenes of real footage, one per part of the page, cross-fading as you scroll.

| Part of the page | Scene id | Look |
|---|---|---|
| Hero | `hero` | mountain forest at sunrise |
| Projects | `valley` | cloud valley |
| About | `forest` | sunlit woodland |
| Skills | `river` | river through green land |
| Contact | `lake` | golden-hour lake |
| Footer | `blue-hour` | blue-hour horizon |

Pointer parallax, drifting mist and film grain sit on top. A pause/play button in the header (and reduced-motion) stops all movement.

**No footage is bundled**, because licence-checked clips could not be downloaded while the project was built. Until you add some, each scene shows its built-in fallback look, which is a complete design on its own.

### দ্রুত শুরু (বাংলায়)

আসল ভিডিও যোগ করতে:

1. `assets/nature/SOURCES.md` খুলুন। প্রতিটি সিনের জন্য যাচাই-করা Mixkit ক্লিপের লিংক আছে। ক্লিপটি আগে নিজে দেখে নিন, তারপর **Full HD** ডাউনলোড করুন (হাতে ডাউনলোড করুন, স্ক্রিপ্ট দিয়ে নয়)।
2. ফাইলের নাম বদলে `hero.mp4`, `valley.mp4`, `forest.mp4`, `river.mp4`, `lake.mp4`, `blue-hour.mp4` করুন এবং `assets/nature/source/` ফোল্ডারে রাখুন।
3. কম্পিউটারে ffmpeg ইনস্টল করুন (macOS: `brew install ffmpeg`, Windows: `winget install Gyan.FFmpeg`, Linux: `sudo apt install ffmpeg`)।
4. প্রজেক্ট ফোল্ডারে `node tools/make-nature-assets.mjs` চালান। এতে WebM, MP4, পোস্টার ও `manifest.json` তৈরি হবে।
5. `assets/nature/credits.example.json` কপি করে `credits.json` নাম দিন, অন্য ক্লিপ নিলে সেই এন্ট্রি ঠিক করুন, ডাউনলোডের তারিখ বসান। তারপর `node tools/make-nature-assets.mjs --check` চালান।
6. `node tools/dev-server.mjs` চালিয়ে `http://localhost:8080` খুলে দেখুন, তারপর deploy করুন।

### In English

1. Pick one clip per scene from `assets/nature/SOURCES.md` (or use your own footage) and preview it.
2. Download Full HD by hand, rename the files to the scene ids above and put them in `assets/nature/source/`.
3. Install ffmpeg, then run `node tools/make-nature-assets.mjs`.
4. Copy `assets/nature/credits.example.json` to `credits.json`, add the download dates, and run `node tools/make-nature-assets.mjs --check`.

Full details are in [`assets/nature/README.md`](assets/nature/README.md). Origins and licences are recorded in `assets/nature/SOURCES.md` and `assets/nature/CREDITS.md`.

## How the page is built

`index.html` contains only `<div id="app"></div>` and one `<script type="module" src="js/main.js">`. Every section (header, hero, projects, about with skills, contact, footer and the project modal) is built at runtime by `js/app.js`, using a tiny DOM-builder helper (`js/core/dom.js`). All visible text is bilingual: each string carries a Bangla and an English version, and the header switch flips between them.

After the page is rendered, `js/main.js` loads the nature engine with a dynamic import, so the page never waits for it.

## Folder structure

```
index.html                  minimal shell (#app), SEO and Open Graph meta, preloads
css/styles.css              one stylesheet; design tokens in :root, commented sections
vercel.json                 cache headers for the nature media
js/
  main.js                   entry point: renders the page, then starts the nature engine
  app.js                    assembles header, hero, projects, about/skills, contact, footer, modal
  core/
    dom.js                  el(): hyperscript-style element builder
    lang.js                 bn/en language state and persistence
    ticker.js               one shared requestAnimationFrame loop for all animation tasks
    motionPref.js           header pause/play button + reduced-motion handling
  data/
    content.js              ALL bilingual copy
    projects.js             project list
    social.js               social and contact links, icons
    ui.js                   interface labels (bn/en)
    scenes.js               the six nature scenes: page anchor, fallback look, readability veil, mist
  features/
    natureEngine.js         entry point of the background engine
    sceneManager.js         video and poster lifecycle, scroll-driven crossfades, FPS guard
    qualityProfile.js       device and network tiering, decoder budget
    parallaxEngine.js       pointer and scroll parallax by depth, cursor light
    atmosphere.js           WebGL mist and god-rays (CSS fallback), film grain
    motion.js               scroll reveals, active-nav indicator, header state, pointer effects
assets/nature/              footage, posters, manifest, credits (see assets/nature/README.md)
tools/
  make-nature-assets.mjs    turns raw clips into looping WebM/MP4 tiers, posters and the manifest
  dev-server.mjs            zero-dependency static server with HTTP Range support
```

**Unused legacy files.** `js/sections/*` and nine files in `js/features/` (`cursorGlow`, `emberField`, `headerOffset`, `magnetic`, `navIndicator`, `reveal`, `spotlight`, `starfield`, `typewriter`) are leftovers from earlier versions of the site. An import-graph scan from `js/main.js` shows nothing imports them, and they were already unused in the version this work started from. They were left untouched; delete them whenever you like.

## Editing

- **Change text (Bangla or English):** `js/data/content.js` (labels in `js/data/ui.js`)
- **Add or edit a project:** `js/data/projects.js`
- **Add or edit a social link:** `js/data/social.js`
- **Change colours, spacing, fonts:** `css/styles.css` (`:root` at the top)
- **Change a nature scene's fallback look, readability veil or mist:** `js/data/scenes.js`
- **Change page structure:** `js/app.js`

## Running locally

The site uses native ES modules, so it must be served over `http://`, not opened as a `file://` path. Use the bundled server. It has no dependencies and, unlike many simple servers, supports HTTP Range requests, which Safari needs to play video:

```bash
node tools/dev-server.mjs          # http://localhost:8080
node tools/dev-server.mjs 3000     # another port
```

## Deploying

Upload the folder as-is, or connect the repository. There is nothing to build. Use a host that serves HTTP Range requests for static files.

`vercel.json` sets the cache headers: the manifest is always revalidated, and clips and posters are cached for 7 days. File names stay the same when you re-encode, so after replacing a clip returning visitors may see the old one for up to 7 days; lower `max-age` in `vercel.json` if that matters. `.gitignore` and `.vercelignore` keep the raw downloads in `assets/nature/source/` out of your repository and deployment.

## URL flags (testing)

| Flag | Effect |
|---|---|
| `?nature=off` | posters and fallback only |
| `?nature=low` | behave like a constrained phone |
| `?nature=high` | behave like a desktop even on a touch screen |
| `?nature-debug` | log engine decisions and expose `window.__nature` |

## Accessibility and performance

- A visible pause/play button (WCAG 2.2.2). Choice is remembered; reduced-motion shows still posters.
- Real HTML text on a darkened readability layer. Small text sits on local scrims.
- Videos are muted, never autoplay with sound, and pause when the tab is hidden.
- At most 2 videos play at once and 3 exist at any moment. Phones get a 540×960 portrait tier and a lighter mist; Save-Data, slow networks and weak devices fall back to posters or a lower tier.
- Any media failure falls back to the poster, then to the gradient.

## Known limitations

- No footage is bundled (see above).
- `make-nature-assets.mjs` also writes H.264 MP4 fallbacks for browsers without VP9, but that path could not be playback-tested where the project was built. After you encode your clips, open the site once in Safari to confirm.
- The nature engine was tested in Chromium. The dependency-free accessibility checks were done by hand, not with an automated tool such as axe.
