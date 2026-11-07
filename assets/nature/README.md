# assets/nature — footage, posters and manifest

This folder is the only place the Cinematic Nature Engine reads media from.

**No footage ships with the project.** Until you add some, every scene uses its built-in fallback look (a graded gradient with mist, grain and light), which is a complete, working design on its own. Adding footage upgrades it; nothing breaks without it.

## Add footage in six steps

1. **Choose one clip per scene.** [`SOURCES.md`](SOURCES.md) lists checked Mixkit pages for all six scenes, or use your own footage. Preview every clip first.
2. **Download by hand** (Full HD is enough) and **rename** each file after its scene: `hero.mp4`, `valley.mp4`, `forest.mp4`, `river.mp4`, `lake.mp4`, `blue-hour.mp4`. `.mov`, `.m4v`, `.mkv` and `.webm` also work.
3. **Put them in `assets/nature/source/`.** This folder is git-ignored and never deployed.
4. **Install ffmpeg** (`ffmpeg` and `ffprobe` must be on your PATH; Node 18+) and run from the project root:
   ```bash
   node tools/make-nature-assets.mjs
   ```
   The tool trims each clip, loops it seamlessly, and writes WebM and MP4 files in every tier your source is big enough for, plus posters and `manifest.json`.
5. **Record the credits.** Copy `credits.example.json` to `credits.json`, fix any entry where you chose a different clip, and add the download date. Run the tool again (it regenerates `CREDITS.md`), then verify everything:
   ```bash
   node tools/make-nature-assets.mjs --check
   ```
6. **Look at it.** Run `node tools/dev-server.mjs` and open <http://localhost:8080/?nature-debug>. The console logs every decision the engine makes.

## What is in this folder

```
assets/nature/
  source/                                  your raw downloads (git-ignored, never deployed)
  videos/<category>/<scene>-<tier>.webm    VP9
  videos/<category>/<scene>-<tier>.mp4     H.264 fallback, same tiers
  posters/<scene>-<tier>.webp              exact first frame of each loop
  manifest.json                            written by the tool, read by the engine
  credits.json                             you fill this in: title, url, author, license, licenseUrl, downloaded, notes
  CREDITS.md                               generated from credits.json
  credits.example.json                     template for the suggested clips
  SOURCES.md                               where the suggested clips come from, and which ones to avoid
```

Category folders: `mountains` (hero, valley), `forest`, `rivers`, `sunset` (lake) and `night` (blue-hour). `waterfalls` and `clouds` are empty folders reserved for future scenes. The tool reads its scene list from `js/data/scenes.js`.

## What the tool does

Tiers (never upscaled: a tier larger than the source is skipped):

| Tier | Size | Used for |
|---|---|---|
| `portrait` | 540×960 (9:16 centre crop) | phones held upright |
| `hd` | 1280×720 | laptops, constrained devices |
| `fhd` | 1920×1080 | desktops |
| `qhd` | 2560×1440 | large high-DPI screens (needs a source above 1080p) |

Audio is always removed. Frame rate is capped at 30. The end of each clip is cross-faded into its start (1.5 s by default), so the loop has no visible seam; a clip too short for a cross-fade loops plainly. Posters are the exact first frame, so the poster-to-video fade is invisible.

```bash
node tools/make-nature-assets.mjs --list                # scene ids, folders, what each clip should show
node tools/make-nature-assets.mjs --scene hero,lake     # only these scenes
node tools/make-nature-assets.mjs --start 6 --max 14    # use 14 s starting at second 6 of the source
node tools/make-nature-assets.mjs --focus 0.3           # move the phone crop left (0 = left edge, 1 = right edge)
node tools/make-nature-assets.mjs --loop 2              # longer cross-fade (0 = no loop fade)
node tools/make-nature-assets.mjs --tiers hd,fhd        # subset of portrait,hd,fhd,qhd
node tools/make-nature-assets.mjs --quick               # fast, low-quality encode, previews only
node tools/make-nature-assets.mjs --force               # re-encode even if outputs are newer than the source
node tools/make-nature-assets.mjs --check               # verify manifest, files and credits; encodes nothing
```

Defaults: `--max 16`, `--start 0`, `--loop 1.5`, `--focus 0.5`. Scenes that are already up to date (same source, same settings) are skipped. Re-run the tool after editing `credits.json`; it refreshes `CREDITS.md` each time.

## What the engine does with the files

- Every scene starts as a poster over its fallback gradient. Videos load lazily as a scene approaches. At most 2 play at once and at most 3 exist at any moment (2 on constrained devices), and a scene's video is unloaded 3.6 s after it leaves.
- The tier is chosen from the viewport and `devicePixelRatio`. Touch devices, weak CPUs (2 cores or fewer, or 2 GB RAM or less) and slow networks are capped at `hd`.
- Video is replaced by posters when any of these holds: `?nature=off`, reduced motion, the header pause button, Save-Data or reduced-data mode, or a very slow connection.
- If playback keeps dropping frames, the engine steps down one tier. At the lowest tier it falls back to posters. The choice is remembered for the session.
- Videos pause when the tab is hidden and resume when it is visible again.
- Any failure (a missing file, a decode error, autoplay blocked) falls back to the poster, then to the gradient. The page never breaks.

## Optional parallax layers

Transparent PNG or WebP files can float above the footage. Add them to a scene in `manifest.json`; the tool keeps them when it re-encodes:

```json
"hero": { "...": "written by the tool", "layers": [ { "src": "layers/hero-foreground.webp", "depth": 0.9 } ] }
```

`src` is relative to this folder. `depth` runs from 0.1 to 1.4 (the footage itself sits at 0.35, and the default is 0.7); higher values move more with the pointer and scroll.

## URL flags

| Flag | Effect |
|---|---|
| `?nature=off` | posters and fallback only: no video, mist or parallax |
| `?nature=low` | behave like a constrained phone |
| `?nature=high` | behave like a desktop, even on a touch screen |
| `?nature-debug` | log engine decisions to the console and expose `window.__nature` |

## Troubleshooting

- **The poster stays and the video never plays.** Open the console with `?nature-debug` and the Network tab. Look for a 404, a wrong content type, or a server without HTTP Range support (Safari needs Range to play video). `node tools/dev-server.mjs` supports it.
- **You re-encoded a clip but still see the old one.** File names do not change between encodes. Hard-refresh. On Vercel, `vercel.json` lets browsers cache clips and posters for 7 days, so lower `max-age` there if that is too long.
- **Text is hard to read over your clip.** Raise that scene's `veil` in `js/data/scenes.js`; it sets how dark the readability overlay is.
- **A clip's colour fights its scene** (a warm dusk clip in `blue-hour`, say). Tune that scene's `tint`, `veil` and `mist` in `js/data/scenes.js`, or choose another clip.

## Licensing rules

- Add only footage you have the right to use. Keep each clip's licence page and never use watermarked or preview files.
- Every clip in use must have a complete entry (title, url, license) in `credits.json`. `--check` flags any that don't.
- The raw downloads in `source/` are not part of the site. Never deploy them.
