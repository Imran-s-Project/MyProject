#!/usr/bin/env node
/**
 * make-nature-assets.mjs — turns raw nature footage into the optimized, seamlessly looping,
 * multi-resolution assets the Cinematic Nature Engine expects.
 *
 * Needs only Node 18+ and ffmpeg + ffprobe on your PATH (no npm packages, no build system).
 *   macOS    brew install ffmpeg
 *   Windows  winget install Gyan.FFmpeg
 *   Linux    sudo apt install ffmpeg
 *
 * 1. Put ONE raw clip per scene into assets/nature/source/, named after the scene id:
 *      hero · valley · forest · river · lake · blue-hour        (.mp4 .mov .m4v .mkv .webm)
 * 2. node tools/make-nature-assets.mjs              process every clip found
 *    node tools/make-nature-assets.mjs --scene hero,lake
 * 3. node tools/make-nature-assets.mjs --check      verify manifest ↔ files ↔ credits (no encoding)
 *    node tools/make-nature-assets.mjs --list       show scene ids, folders and what they should contain
 *
 * For every scene it writes
 *   assets/nature/videos/<category>/<scene>-<tier>.webm   VP9   (tiers: portrait 540×960 · hd 720p · fhd 1080p · qhd 1440p)
 *   assets/nature/videos/<category>/<scene>-<tier>.mp4    H.264 fallback, same tiers
 *   assets/nature/posters/<scene>-<tier>.webp             first-frame poster (portrait · hd · fhd)
 *   assets/nature/manifest.json                           what the engine reads
 *   assets/nature/CREDITS.md                              generated from assets/nature/credits.json
 * Tiers larger than the source are skipped (never upscaled). Audio is always stripped.
 *
 * Options
 *   --loop <s>      cross-fade length that makes the clip loop seamlessly      (default 1.5, 0 = off)
 *   --max <s>       keep at most this many seconds of the source               (default 16)
 *   --start <s>     start offset inside the source                             (default 0)
 *   --focus <0-1>   horizontal focus of the 9:16 phone crop                    (default 0.5 = centre)
 *   --tiers a,b     subset of portrait,hd,fhd,qhd
 *   --quick         much faster, lower-quality encode — for previews only
 *   --force         re-encode even when outputs are newer than the source
 */
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const NATURE = path.join(ROOT, 'assets', 'nature');
const SOURCE = path.join(NATURE, 'source');
const MANIFEST = path.join(NATURE, 'manifest.json');
const CREDITS_JSON = path.join(NATURE, 'credits.json');
const CREDITS_MD = path.join(NATURE, 'CREDITS.md');
const SOURCE_EXT = ['.mp4', '.mov', '.m4v', '.mkv', '.webm'];

const TIERS = {
  portrait: { w: 540, h: 960, crfVp9: 36, crfX264: 27, maxrate: 1200, level: '4.0' },
  hd: { w: 1280, h: 720, crfVp9: 34, crfX264: 25, maxrate: 3000, level: '4.1' },
  fhd: { w: 1920, h: 1080, crfVp9: 33, crfX264: 24, maxrate: 6000, level: '4.2' },
  qhd: { w: 2560, h: 1440, crfVp9: 32, crfX264: 23, maxrate: 10000, level: '5.0' }
};
const POSTER_TIERS = ['portrait', 'hd', 'fhd'];

/* ───────────────────────── small helpers ───────────────────────── */
const argv = process.argv.slice(2);
const has = (name) => argv.includes(`--${name}`);
const opt = (name, fallback) => {
  const i = argv.indexOf(`--${name}`);
  return i >= 0 && argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[i + 1] : fallback;
};
const num = (name, fallback) => {
  const v = Number(opt(name, fallback));
  if (!Number.isFinite(v)) die(`--${name} must be a number`);
  return v;
};
const rel = (p) => path.relative(NATURE, p).split(path.sep).join('/');
const kb = (p) => Math.round(fs.statSync(p).size / 1024);
const mb = (k) => (k / 1024).toFixed(2) + ' MB';
const round = (n, d = 2) => Math.round(n * 10 ** d) / 10 ** d;
const say = (...a) => console.log(...a);
function die(msg) {
  console.error(`\n✖ ${msg}\n`);
  process.exit(1);
}

function run(cmd, args, { capture = false, quiet = true } = {}) {
  const res = spawnSync(cmd, args, { encoding: capture === 'buffer' ? 'buffer' : 'utf8', maxBuffer: 1 << 28 });
  if (res.error) {
    if (res.error.code === 'ENOENT') die(`'${cmd}' was not found on your PATH. Install ffmpeg first (macOS: brew install ffmpeg · Windows: winget install Gyan.FFmpeg · Linux: sudo apt install ffmpeg).`);
    throw res.error;
  }
  if (res.status !== 0) {
    const tail = String(res.stderr || '').trim().split('\n').slice(-8).join('\n');
    throw new Error(`${cmd} failed (exit ${res.status})\n${tail}`);
  }
  return capture ? res.stdout : '';
}
const ffmpeg = (args) => run('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-nostdin', '-y', ...args]);

function probe(file) {
  const j = JSON.parse(run('ffprobe', ['-v', 'error', '-show_entries', 'stream=codec_type,codec_name,width,height,r_frame_rate,duration:format=duration', '-of', 'json', file], { capture: true }));
  const v = (j.streams || []).find((s) => s.codec_type === 'video');
  if (!v) throw new Error('no video stream found');
  const [n, d] = String(v.r_frame_rate).split('/').map(Number);
  return {
    width: v.width,
    height: v.height,
    fps: d ? n / d : n,
    duration: parseFloat(v.duration) || parseFloat(j.format?.duration) || 0,
    codec: v.codec_name,
    audio: (j.streams || []).some((s) => s.codec_type === 'audio')
  };
}

function requireEncoders() {
  const list = run('ffmpeg', ['-hide_banner', '-encoders'], { capture: true });
  for (const enc of ['libvpx-vp9', 'libx264', 'libwebp']) if (!list.includes(enc)) die(`your ffmpeg build has no '${enc}' encoder. Install a full build (https://ffmpeg.org/download.html).`);
}

async function loadScenes() {
  const mod = await import(pathToFileURL(path.join(ROOT, 'js', 'data', 'scenes.js')).href);
  return mod.SCENES;
}
const readJson = (file, fallback) => {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return fallback;
  }
};

/* ───────────────────────── one scene ───────────────────────── */
function encodeScene(scene, srcFile, cfg) {
  const info = probe(srcFile);
  const start = Math.max(0, cfg.start);
  const usable = info.duration - start;
  if (usable < 3) {
    throw new Error(`clip is too short: ${round(info.duration, 1)} s long${start ? `, only ${round(Math.max(0, usable), 1)} s left after --start ${start}` : ''}. Use a clip of at least ~6 s (8–20 s is ideal).`);
  }
  const D = Math.min(cfg.max, usable);
  const T = cfg.loop > 0 && D >= cfg.loop * 4 ? cfg.loop : 0;
  const fps = info.fps > 30.5 ? 30 : Math.max(15, Math.round(info.fps));
  say(`  source  ${info.width}×${info.height} ${round(info.fps, 1)} fps ${round(info.duration, 1)} s${info.audio ? ' (audio will be stripped)' : ''}`);
  say(`  plan    use ${round(D, 1)} s from ${round(start, 1)} s → ${T ? `seamless loop (${T} s cross-fade) → ${round(D - T, 1)} s` : 'plain loop (clip too short for a cross-fade)'} at ${fps} fps`);

  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), `nature-${scene.id}-`));
  try {
    // 1) mezzanine: trim, normalise fps, cap at 1440p, make the loop seamless (end cross-fades into the start)
    const mezz = path.join(tmp, 'mezz.mp4');
    const pre = `fps=${fps},scale=-2:'min(1440,ih)',setsar=1,format=yuv420p`;
    const graph = T
      ? `[0:v]${pre},setpts=PTS-STARTPTS,split=2[a][b];` +
        `[a]trim=start=${T}:end=${D},setpts=PTS-STARTPTS[body];` +
        `[b]trim=start=0:end=${T},setpts=PTS-STARTPTS[head];` +
        `[body][head]xfade=transition=fade:duration=${T}:offset=${round(D - 2 * T, 3)}[v]`
      : `[0:v]${pre},setpts=PTS-STARTPTS[v]`;
    ffmpeg(['-ss', String(start), '-t', String(D), '-i', srcFile, '-filter_complex', graph, '-map', '[v]', '-an', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '12', '-pix_fmt', 'yuv420p', mezz]);
    const m = probe(mezz);

    const dir = path.join(NATURE, 'videos', scene.category);
    const posterDir = path.join(NATURE, 'posters');
    fs.mkdirSync(dir, { recursive: true });
    fs.mkdirSync(posterDir, { recursive: true });

    const vf = (name) => {
      const { w, h } = TIERS[name];
      const fx = name === 'portrait' ? cfg.focus : 0.5; // where the 9:16 crop window sits horizontally
      return `scale=${w}:${h}:force_original_aspect_ratio=increase:flags=lanczos,crop=${w}:${h}:x='(iw-${w})*${fx}':y='(ih-${h})*0.5',setsar=1`;
    };
    const video = {};
    for (const name of cfg.tiers) {
      const spec = TIERS[name];
      const enough = name === 'portrait' ? m.height >= spec.h * 0.9 : m.height >= spec.h * 0.9 && m.width >= spec.w * 0.9;
      if (!enough) {
        say(`  ${name.padEnd(8)} skipped (source is smaller than ${spec.w}×${spec.h}; never upscaled)`);
        continue;
      }
      const base = path.join(dir, `${scene.id}-${name}`);
      ffmpeg([
        '-i', mezz, '-vf', vf(name), '-an', '-c:v', 'libvpx-vp9', '-b:v', '0', '-crf', String(spec.crfVp9), '-pix_fmt', 'yuv420p',
        '-row-mt', '1', '-tile-columns', '1', '-g', '120', '-deadline', cfg.quick ? 'realtime' : 'good', '-cpu-used', cfg.quick ? '8' : '2', `${base}.webm`
      ]);
      ffmpeg([
        '-i', mezz, '-vf', vf(name), '-an', '-c:v', 'libx264', '-preset', cfg.quick ? 'veryfast' : 'slow', '-crf', String(spec.crfX264),
        '-maxrate', `${spec.maxrate}k`, '-bufsize', `${spec.maxrate * 2}k`, '-profile:v', 'high', '-level', spec.level, '-pix_fmt', 'yuv420p',
        '-g', '60', '-sc_threshold', '0', '-movflags', '+faststart', `${base}.mp4`
      ]);
      video[name] = { webm: rel(`${base}.webm`), mp4: rel(`${base}.mp4`), width: spec.w, height: spec.h, kb: { webm: kb(`${base}.webm`), mp4: kb(`${base}.mp4`) } };
      say(`  ${name.padEnd(8)} ${spec.w}×${spec.h}   webm ${mb(video[name].kb.webm)}   mp4 ${mb(video[name].kb.mp4)}`);
    }
    if (!Object.keys(video).length) throw new Error('no tier could be produced (source too small?)');

    // 2) posters = the exact first frame of the loop, so the poster → video fade is invisible
    const posters = {};
    for (const name of POSTER_TIERS) {
      const spec = TIERS[name];
      if (m.height < spec.h * 0.9) continue;
      const out = path.join(posterDir, `${scene.id}-${name}.webp`);
      ffmpeg(['-i', mezz, '-frames:v', '1', '-vf', vf(name), '-c:v', 'libwebp', '-quality', '72', '-compression_level', '5', '-preset', 'photo', out]);
      posters[name] = rel(out);
    }
    // 3) average colour of the poster → the scene's background while things load
    let tint = null;
    const pref = posters.hd || posters.fhd || posters.portrait;
    if (pref) {
      const buf = run('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-i', path.join(NATURE, pref), '-vf', 'scale=1:1:flags=area', '-frames:v', '1', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], { capture: 'buffer' });
      if (buf.length >= 3) tint = '#' + [...buf.subarray(0, 3)].map((x) => x.toString(16).padStart(2, '0')).join('');
    }
    return { duration: round(m.duration, 2), source: { width: info.width, height: info.height, fps: round(info.fps, 2) }, tint, posters, video };
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
}

/* ───────────────────────── credits ───────────────────────── */
function writeCredits(scenes, manifest) {
  const credits = readJson(CREDITS_JSON, {});
  const rows = [];
  for (const s of scenes) {
    const used = manifest.scenes?.[s.id]?.video;
    const c = credits[s.id];
    if (!used && !c) continue;
    const cell = (x) => (x ? String(x).replace(/\|/g, '\\|') : '—');
    const link = (text, url) => (url ? `[${text}](${url})` : cell(text));
    rows.push(`| \`${s.id}\` | ${used ? 'in use' : 'listed, not encoded yet'} | ${link(c?.title, c?.url)} | ${cell(c?.author)} | ${link(c?.license, c?.licenseUrl)} | ${cell(c?.downloaded)} | ${used && !c ? '⚠ add this clip to credits.json' : cell(c?.notes)} |`);
  }
  const md = [
    '# Nature footage — origin & licences',
    '',
    '_Generated by `tools/make-nature-assets.mjs` from `assets/nature/credits.json`. Edit the JSON, not this file._',
    '',
    rows.length
      ? '| Scene | Status | Clip | Author | Licence | Downloaded | Notes |\n| --- | --- | --- | --- | --- | --- | --- |\n' + rows.join('\n')
      : '**No footage has been added yet**, so there is nothing to credit. After you add clips, fill in `credits.json` and run the tool again — every clip that is in use must be listed here with its source page and licence.',
    '',
    'Only footage you have the right to use may be added. Keep the licence page of every clip, and never use watermarked or preview files.',
    ''
  ].join('\n');
  fs.writeFileSync(CREDITS_MD, md);
}

/* ───────────────────────── check ───────────────────────── */
function check(scenes) {
  const manifest = readJson(MANIFEST, null);
  if (!manifest || typeof manifest.scenes !== 'object') die('assets/nature/manifest.json is missing or malformed.');
  const credits = readJson(CREDITS_JSON, {});
  const ids = new Set(scenes.map((s) => s.id));
  let problems = 0;
  let total = 0;
  const bad = (msg) => {
    problems++;
    console.error('  ✖', msg);
  };
  const entries = Object.entries(manifest.scenes);
  if (!entries.length) say('manifest.json lists no scenes yet — the site is using its built-in fallback look (that is fine, but it has no footage).');
  for (const [id, s] of entries) {
    say(`\n${id}`);
    if (!ids.has(id)) bad(`unknown scene id '${id}' (see js/data/scenes.js)`);
    for (const [tier, f] of Object.entries(s.video || {})) {
      if (!TIERS[tier]) bad(`unknown tier '${tier}'`);
      for (const ext of ['webm', 'mp4']) {
        if (!f[ext]) continue;
        const p = path.join(NATURE, f[ext]);
        if (!fs.existsSync(p)) {
          bad(`missing file ${f[ext]}`);
          continue;
        }
        const info = probe(p);
        total += kb(p);
        const notes = [];
        if (info.audio) notes.push('has an audio track');
        if (info.duration < 4) notes.push('very short loop');
        if (kb(p) > 12000) notes.push('larger than 12 MB — consider a lower quality');
        say(`  ${tier.padEnd(8)} ${ext.padEnd(4)} ${info.width}×${info.height} ${round(info.duration, 1)} s ${mb(kb(p)).padStart(9)} ${notes.length ? '⚠ ' + notes.join(', ') : '✓'}`);
        if (info.audio) problems++;
      }
    }
    for (const [tier, f] of Object.entries(s.posters || {})) {
      const p = path.join(NATURE, f);
      if (!fs.existsSync(p)) bad(`missing poster ${f}`);
      else {
        total += kb(p);
        say(`  poster ${tier.padEnd(8)} ${mb(kb(p)).padStart(9)} ✓`);
      }
    }
    for (const l of s.layers || []) if (!fs.existsSync(path.join(NATURE, l.src))) bad(`missing layer ${l.src}`);
    const c = credits[id];
    if (s.video && !(c && c.title && c.url && c.license)) bad(`credits.json has no complete entry (title, url, license) for '${id}'`);
  }
  say(`\ntotal media ${mb(total)} · ${problems ? problems + ' problem(s)' : 'no problems'}`);
  process.exit(problems ? 1 : 0);
}

/* ───────────────────────── main ───────────────────────── */
const scenes = await loadScenes();

if (has('list')) {
  say('\nScene id       Folder (videos/)   What the clip should show');
  for (const s of scenes) say(`${s.id.padEnd(14)} ${s.category.padEnd(18)} ${s.brief}`);
  say(`\nDrop one raw clip per scene into assets/nature/source/ as <scene id>.mp4 (landscape, ≥1080p, 8–30 s, no people/text/logos/watermark),`);
  say('then run: node tools/make-nature-assets.mjs\n');
  process.exit(0);
}
if (has('check')) check(scenes);

requireEncoders();
const cfg = {
  loop: num('loop', 1.5),
  max: num('max', 16),
  start: num('start', 0),
  focus: Math.min(1, Math.max(0, num('focus', 0.5))),
  quick: has('quick'),
  force: has('force'),
  tiers: String(opt('tiers', 'portrait,hd,fhd,qhd')).split(',').map((t) => t.trim()).filter(Boolean)
};
for (const t of cfg.tiers) if (!TIERS[t]) die(`unknown tier '${t}' (use portrait,hd,fhd,qhd)`);
const wanted = opt('scene', '') ? String(opt('scene')).split(',').map((s) => s.trim()) : null;
if (wanted) for (const w of wanted) if (!scenes.some((s) => s.id === w)) die(`unknown scene '${w}'. Valid ids: ${scenes.map((s) => s.id).join(', ')}`);

fs.mkdirSync(SOURCE, { recursive: true });
const files = fs.readdirSync(SOURCE);
const known = new Set(scenes.map((s) => s.id));
for (const f of files) {
  const { name, ext } = path.parse(f);
  if (SOURCE_EXT.includes(ext.toLowerCase()) && !known.has(name.toLowerCase())) say(`! ignoring source/${f}: '${name}' is not a scene id (${[...known].join(', ')})`);
}

const manifest = readJson(MANIFEST, { version: 1, scenes: {} });
manifest.version = 1;
manifest.scenes = manifest.scenes || {};
// The settings an entry was encoded with. A different value (new --tiers, --focus, --loop …) makes it stale.
const settings = { loop: cfg.loop, max: cfg.max, start: cfg.start, focus: cfg.focus, tiers: cfg.tiers.join(','), quick: cfg.quick };
let did = 0;
let failed = 0;
let current = 0;
let found = 0;
for (const scene of scenes) {
  if (wanted && !wanted.includes(scene.id)) continue;
  const file = files.find((f) => path.parse(f).name.toLowerCase() === scene.id && SOURCE_EXT.includes(path.extname(f).toLowerCase()));
  if (!file) continue;
  found++;
  const srcFile = path.join(SOURCE, file);
  const prev = manifest.scenes[scene.id];
  const outputs = prev?.video ? Object.values(prev.video).flatMap((t) => [t.webm, t.mp4]) : [];
  const newer = outputs.length > 0 && outputs.every((o) => fs.existsSync(path.join(NATURE, o)) && fs.statSync(path.join(NATURE, o)).mtimeMs > fs.statSync(srcFile).mtimeMs);
  const fresh = newer && JSON.stringify(prev.encode) === JSON.stringify(settings);
  say(`\n● ${scene.id}  ←  source/${file}`);
  if (fresh && !cfg.force) {
    say('  up to date (the clip and the options are unchanged; use --force to re-encode anyway)');
    current++;
    continue;
  }
  try {
    const entry = encodeScene(scene, srcFile, cfg);
    entry.encode = settings;
    if (prev?.layers) entry.layers = prev.layers; // hand-added parallax layers survive a re-encode
    manifest.scenes[scene.id] = entry;
    did++;
  } catch (err) {
    failed++;
    console.error(`  ✖ ${scene.id}: ${err.message}`);
  }
}
if (did) {
  manifest.generated = new Date().toISOString();
  delete manifest.note;
  fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + '\n');
}
writeCredits(scenes, manifest); // deterministic output, so re-running only changes it when credits.json changed

if (!found) {
  say('\nNo source clips found. Put raw clips into assets/nature/source/ named after the scene (run with --list to see the ids).');
} else if (!did && !failed) {
  say(`\n✔ Nothing to do — ${current} scene(s) already up to date. CREDITS.md was refreshed from credits.json.`);
} else {
  say(`\n✔ ${did} scene(s) encoded${current ? `, ${current} already up to date` : ''}${failed ? `, ${failed} failed` : ''}.${did ? ' manifest.json' : ''} CREDITS.md updated.`);
  if (did) say('Next: fill in assets/nature/credits.json for every clip, then run  node tools/make-nature-assets.mjs --check');
}
process.exit(failed ? 1 : 0);
