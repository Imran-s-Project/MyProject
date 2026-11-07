/**
 * scenes.js — design config for the six cinematic nature scenes.
 *
 * Which clips/posters exist is described separately by assets/nature/manifest.json
 * (written by tools/make-nature-assets.mjs). This file holds everything else:
 *   - which part of the page the scene belongs to (the element carrying data-scene="<id>")
 *   - the graceful fallback look used until/unless footage is available
 *   - how dark the readability veil must be, and how much atmosphere (mist/rays) to add
 *
 * Page order is hero → projects → about → skills → contact → footer, so the day
 * advances from morning light to blue hour as the visitor scrolls.
 */
export const SCENES = [
  {
    id: 'hero',
    category: 'mountains',
    title: { bn: 'পাহাড়ি বনে সকাল', en: 'Mountain forest at sunrise' },
    brief: 'Mountain ridges over dense green forest, low morning sun, slow cloud shadows and haze, wind in the canopy.',
    tint: '#1e4a3b',
    gradient: 'linear-gradient(180deg,#0a2620 0%,#17493c 36%,#4c8a72 58%,#cdd6ac 74%,#27503f 88%,#0a2a21 100%)',
    sun: { x: 72, y: 58, r: 56, rgb: '255,232,184', a: 0.5 },
    veil: [0.34, 0.46, 0.72],
    mist: { amount: 0.85, tint: '#dfeedd', rays: 0.12 }
  },
  {
    id: 'valley',
    category: 'mountains',
    title: { bn: 'মেঘে ঢাকা উপত্যকা', en: 'Cloud valley' },
    brief: 'Wide mountain valley with dense forest, clouds drifting along the slopes, soft overcast depth.',
    tint: '#124548',
    gradient: 'linear-gradient(180deg,#0a2528 0%,#164a4c 34%,#4f8f89 58%,#b3d3c4 72%,#2c5a52 86%,#0a2924 100%)',
    sun: { x: 30, y: 50, r: 60, rgb: '222,244,236', a: 0.34 },
    veil: [0.52, 0.6, 0.72],
    mist: { amount: 0.95, tint: '#cfe3e0', rays: 0 }
  },
  {
    id: 'forest',
    category: 'forest',
    title: { bn: 'রোদ-ছোঁয়া বন', en: 'Sunlit woodland' },
    brief: 'Real woodland: sunlight filtering through the canopy, moving leaves and branches, faint mist between trunks.',
    tint: '#1c4a2c',
    gradient: 'linear-gradient(180deg,#0b2a1c 0%,#1f5a34 38%,#4f8a45 60%,#c5cf82 76%,#285c34 90%,#0a2a1a 100%)',
    sun: { x: 22, y: 6, r: 62, rgb: '255,238,170', a: 0.55 },
    veil: [0.5, 0.58, 0.7],
    mist: { amount: 0.7, tint: '#e8f0cf', rays: 0.5 }
  },
  {
    id: 'river',
    category: 'rivers',
    title: { bn: 'নদী ও সবুজ প্রান্তর', en: 'River through green land' },
    brief: 'A flowing river through lush vegetation, soft reflections, clouds moving overhead, gentle cinematic light.',
    tint: '#14504f',
    gradient: 'linear-gradient(180deg,#0a2a30 0%,#14565a 36%,#4f9a94 58%,#bfe0d6 72%,#2b6b64 88%,#082a26 100%)',
    sun: { x: 62, y: 52, r: 58, rgb: '230,250,244', a: 0.38 },
    veil: [0.52, 0.6, 0.72],
    mist: { amount: 0.8, tint: '#d6ece8', rays: 0.08 }
  },
  {
    id: 'lake',
    category: 'sunset',
    title: { bn: 'সোনালি প্রহরের হ্রদ', en: 'Golden-hour lake' },
    brief: 'Calm lake at golden hour, warm light, soft reflections and slow water movement under sunset clouds.',
    tint: '#4a3a33',
    gradient: 'linear-gradient(180deg,#14212d 0%,#3d3f4a 30%,#9a6a52 52%,#f0b872 64%,#6e5a4e 76%,#232c33 90%,#0b1319 100%)',
    sun: { x: 50, y: 62, r: 54, rgb: '255,214,150', a: 0.62 },
    veil: [0.4, 0.5, 0.7],
    mist: { amount: 0.55, tint: '#f3d9b5', rays: 0 }
  },
  {
    id: 'blue-hour',
    category: 'night',
    title: { bn: 'নীল সন্ধ্যার দিগন্ত', en: 'Blue-hour horizon' },
    brief: 'Deep-blue evening sky over distant mountains, a natural low-light horizon with slow atmospheric movement.',
    tint: '#0d2440',
    gradient: 'linear-gradient(180deg,#040b18 0%,#0c2040 38%,#1d4268 58%,#5b86a6 70%,#16304a 84%,#050f1a 100%)',
    sun: { x: 50, y: 68, r: 60, rgb: '140,180,220', a: 0.3 },
    veil: [0.3, 0.5, 0.8],
    mist: { amount: 0.6, tint: '#9db7d4', rays: 0 }
  }
];

/** Folder (inside assets/nature/videos/) each scene's clips are filed under. */
export const CATEGORY = Object.fromEntries(SCENES.map((s) => [s.id, s.category]));
