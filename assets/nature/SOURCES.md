# Footage sources — checked candidates

**No footage is bundled with this project.** The environment this project was built in could not download from any stock-video site, so no clip is included rather than one whose origin and licence could not be confirmed.

This file lists clips on Mixkit whose pages were opened and read on **6 November 2026**. For every clip below the page's title, duration, frame rate, offered download sizes, licence line and contributor handle were read.

**What was not done:** nobody watched these clips. Whether a clip *looks* right (calm movement, colour, no people, no logos or text) is judged only from its title, description and tags. **Preview each clip on its Mixkit page before you use it.**

## The licence, in short

Every clip under "Use" says on its own page: *"Download this free stock video clip for commercial or personal use, under the Mixkit Stock Video Free License."*

The licence text ([mixkit.co/license/modal/videoFree](https://mixkit.co/license/modal/videoFree/)) says the clips can be used in commercial and non-commercial projects for free; that you may "download, copy, modify, distribute, publicly perform and broadcast" them; that attribution is not required, though Mixkit asks for a credit "where reasonably possible" (`CREDITS.md` does that); and that there are "important limits" set out in the [User Terms](https://mixkit.co/terms/).

Read those Terms yourself before you publish. The clauses that matter for a website are 9.02 and 9.04 (selling clips, or making them available to third parties on a stock basis), 9.09 (never remove watermarks) and 9.10 (no scripts or bots to mass-download). A trimmed, looped, re-encoded background that plays inside your page is the normal "use in a project" case, but the exact boundaries are Mixkit's to define. This summary is not legal advice, and licence terms can change, so re-read the licence line on each page on the day you download.

Two practical rules follow:

- **Download by hand** — six clicks.
- **Never publish the original downloads.** Only the re-encoded files in `videos/` and `posters/` are meant to be served. `.gitignore` and `.vercelignore` already keep `assets/nature/source/` out of your repository and your deployment.

## Use these — one clip per scene

Save the download as `assets/nature/source/<scene>.mp4`. Choose **Full HD (1920×1080)** on the Mixkit page: it is enough for the `fhd` tier, and a 1080p source is never upscaled, so the `qhd` tier is simply skipped. Take the 4K download only if you want that tier for large retina screens. Mixkit labels its smaller download "HD Ready 1080x720", so treat it as 720p.

| Scene (file) | Suggested clip | Backups |
|---|---|---|
| `hero` — mountain forest | [Slow aerial tour through a mist-covered forest](https://mixkit.co/free-stock-video/slow-aerial-tour-through-a-mist-covered-forest-28342/) · 0:15 · 24 fps · up to 4K · @marcolopez | [Mountain covered by fog in an aerial view](https://mixkit.co/free-stock-video/mountain-covered-by-fog-in-an-aerial-view-44269/) · 0:17 · 24 fps · 1080p · @marcolopez |
| `valley` — projects | [Lush green valley with mountains and cloudy sky](https://mixkit.co/free-stock-video/lush-green-valley-with-mountains-and-cloudy-sky-100416/) · 0:18 · 24 fps · up to 4K · @mixkit | [Aerial View of Magnificent Green Hills](https://mixkit.co/free-stock-video/aerial-view-of-magnificent-green-hills-100408/) · 0:21 · 24 fps · up to 4K · @mixkit |
| `forest` — about | [Sunlight crossing the branches of trees](https://mixkit.co/free-stock-video/sunlight-crossing-the-branches-of-trees-1709/) · 0:34 · 24 fps · 1080p · @adrianpelletier | [Forest illuminated by the sun's rays](https://mixkit.co/free-stock-video/forest-illuminated-by-the-suns-rays-3006/) · 0:12 · 60 fps (the tool caps output at 30) · 1080p · @matthiasgroeneveld<br>[Huge trees in a large green forest](https://mixkit.co/free-stock-video/huge-trees-in-a-large-green-forest-5040/) · 0:40 · 30 fps · 1080p · @matthiasgroeneveld |
| `river` — skills | [A small river flowing freely in the wilderness of the countryside](https://mixkit.co/free-stock-video/a-small-river-flowing-freely-in-the-wilderness-of-the-51573/) · 0:12 · 24 fps · 1080p · @mixkit | [A crystal clear river water flowing on a sunny day](https://mixkit.co/free-stock-video/a-crystal-clear-river-water-flowing-on-a-sunny-day-51599/) · 0:11 · 24 fps · 1080p · @mixkit<br>[Forest stream in the sunlight](https://mixkit.co/free-stock-video/forest-stream-in-the-sunlight-529/) · 0:36 · 24 fps · up to 4K · @marcolopez (drone shot over a forest river) |
| `lake` — contact | [Sunset Glowing Over Lakeside Hills](https://mixkit.co/free-stock-video/sunset-glowing-over-lakeside-hills-101501/) · 0:22 · 24 fps · 1080p · @mixkit | [Sunset Reflections on Rippling Water](https://mixkit.co/free-stock-video/sunset-reflections-on-rippling-water-101205/) · 0:19 · 24 fps · up to 4K · @mixkit (still shot, gentle ripples) |
| `blue-hour` — footer | [Aerial View of Lake at Dusk](https://mixkit.co/free-stock-video/aerial-view-of-lake-at-dusk-101509/) · 0:20 · 24 fps · up to 4K · @mixkit | [Lake and Hills at Dusk](https://mixkit.co/free-stock-video/lake-and-hills-at-dusk-101524/) · 0:12 · 24 fps · up to 4K · @mixkit |

Notes:

- "up to 4K" means the page offers HD, Full HD and 4K; "1080p" means HD and Full HD only.
- The tool keeps up to 16 s of a clip (`--max`, from `--start`) and cross-fades the end into the start for a seamless loop. Every clip above is at least 11 s, and the tool's minimum is 8 s. For the long clips (`forest` 34 s, `river` backup 36 s), `--start` picks the stretch you like best.
- Dusk clips can be warmer or brighter than a true deep-blue hour. If the footer scene looks too warm, tune `tint` and `veil` for `blue-hour` in `js/data/scenes.js`, or pick another clip from the [dusk category](https://mixkit.co/free-stock-video/dusk/).

## Do not use — "Mixkit Restricted License"

These pages came up in the same searches but are **not** under the free commercial licence. Their free download is a 720p file marked "for personal use only"; commercial use needs a paid Envato licence.

- [Light streaks through trees in beautiful forest](https://mixkit.co/free-stock-video/light-streaks-through-trees-in-beautiful-forest-48107/)
- [Wild mountain river water flowing](https://mixkit.co/free-stock-video/wild-mountain-river-water-flowing-32327/)
- [Water flowing down the rocks of a river in nature](https://mixkit.co/free-stock-video/water-flowing-down-the-rocks-of-a-river-in-nature-38478/)

Clips that look equally free in a listing can still carry this licence, so **always read the licence line on the clip's own page**. It must say "Mixkit Stock Video Free License".

## Finding other clips

Mixkit categories worth browsing: [mist](https://mixkit.co/free-stock-video/mist/) · [mountain](https://mixkit.co/free-stock-video/mountain/) · [sunlight](https://mixkit.co/free-stock-video/sunlight/) · [river](https://mixkit.co/free-stock-video/river/) · [valley](https://mixkit.co/free-stock-video/valley/) · [golden hour](https://mixkit.co/free-stock-video/golden-hour/) · [dusk](https://mixkit.co/free-stock-video/dusk/)

A clip suits this site when it is:

- one continuous shot, landscape, at least 1080p, 8–30 s;
- slow-moving, with no hard cuts and no fast time-lapse;
- free of people, faces, text, logos and watermarks (Terms clause 13 puts third-party trademarks inside a clip on you to clear).

Your own footage works just as well, and is the way to have zero licence questions: drop it in `source/` under the same scene names and fill in `credits.json` with yourself as the author.
