/**
 * scenes.js — original, procedurally drawn SVG landscapes (no external images).
 * One rAF-throttled scroll handler cross-fades the scenes, drifts them upward and
 * adds depth parallax per ridge. Reduced motion → calm, static cross-fades only.
 */
const W = 1600;
const H = 900;
const rnd = (s) => {
  const x = Math.sin(s * 127.1) * 43758.5453;
  return x - Math.floor(x);
};
const ridge = (seed, y, amp, rough) => {
  let d = `M0 ${H + 200}L0 ${y}`;
  for (let x = 0; x <= W; x += 32) {
    const h = Math.sin(x * 0.0032 * rough + seed) * amp + Math.sin(x * 0.0105 + seed * 2.3) * amp * 0.34 + (rnd(seed * 31 + x) - 0.5) * amp * 0.1;
    d += `L${x} ${(y + h).toFixed(0)}`;
  }
  return `${d}L${W} ${H + 200}Z`;
};
const clouds = (c, o) => `<g fill="${c}" opacity="${o}">${[[300, 210, 280, 30], [820, 300, 340, 38], [1280, 180, 260, 28], [620, 140, 220, 22]].map(([x, y, rx, ry]) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}"/>`).join('')}</g>`;

const SCENES = [
  // sunrise over mountains
  { sky: ['#1b4b3d', '#f0d6a0'], sun: [1120, 480, 84, '#fff0c8'], ridges: ['#b8c7a8', '#7ea48c', '#47745f', '#1d4739'], y: [470, 560, 650, 740] },
  // sunlit forest
  { sky: ['#9fcf9e', '#e6efc4'], sun: [520, 150, 70, '#fffbe0'], ridges: ['#6aa77a', '#3f8458', '#1f5c40', '#0d3426'], y: [500, 580, 660, 750],
    fg: '<g fill="#fff6cf" opacity=".16"><path d="M820 0h120L560 900H380z"/><path d="M1060 0h80L880 900H760z"/><path d="M600 0h70L380 900H300z"/></g>' },
  // river through the valley
  { sky: ['#b7d8d0', '#eef1dc'], sun: null, ridges: ['#82aa9a', '#4f8068', '#2d6249', '#164232'], y: [480, 570, 660, 750],
    fg: '<path d="M730 560C660 650 880 720 780 900h260c80-190-120-250-170-340z" fill="#d9eef0" opacity=".78"/>' },
  // green valley
  { sky: ['#f4e4b8', '#d3e5b9'], sun: [300, 200, 60, '#fff6d6'], ridges: ['#a8cd90', '#72ad76', '#3f8458', '#235a40'], y: [520, 600, 680, 760] },
  // sunset sky
  { sky: ['#27384d', '#f0a463'], sun: [800, 560, 100, '#ffd9a0'], bg: clouds('#ffe3c2', '.38'), ridges: ['#3a4a50', '#243b3a', '#17302b', '#0d221c'], y: [560, 630, 700, 770] }
];

const draw = (s, i) => {
  const rs = s.ridges.map((c, k) => `<g data-k="${k}"><path d="${ridge(i * 7 + k + 1, s.y[k], 100 - k * 22, 1 + k * 0.5)}" fill="${c}"/></g>`).join('');
  const sun = s.sun ? `<circle cx="${s.sun[0]}" cy="${s.sun[1]}" r="${s.sun[2]}" fill="${s.sun[3]}"/>` : '';
  return `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="sk${i}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${s.sky[0]}"/><stop offset="1" stop-color="${s.sky[1]}"/></linearGradient></defs><rect width="${W}" height="${H}" fill="url(#sk${i})"/>${sun}${s.bg || ''}${rs}${s.fg || ''}</svg>`;
};

export function initScenes(host) {
  host.innerHTML = SCENES.map(draw).join('');
  const layers = [...host.children];
  const groups = layers.map((l) => [...l.querySelectorAll('g[data-k]')]);
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const root = document.documentElement;
  const ease = (x) => x * x * (3 - 2 * x);
  let queued = false;

  const paint = () => {
    queued = false;
    const max = root.scrollHeight - innerHeight;
    const p = max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0;
    root.style.setProperty('--p', p.toFixed(4));
    const f = p * (layers.length - 1);
    const base = Math.min(layers.length - 2, Math.floor(f));
    const frac = f - base;
    layers.forEach((layer, i) => {
      const on = i === base || i === base + 1;
      layer.style.display = on ? '' : 'none';
      if (!on) return;
      layer.style.opacity = i === base ? 1 : calm ? Math.round(frac) : ease(frac);
      if (calm) return;
      const d = f - i; // 0 = current scene, negative = scene still arriving from below
      layer.style.transform = `translate3d(0,${(-d * 4).toFixed(2)}%,0) scale(${(1.05 - Math.abs(d) * 0.04).toFixed(3)})`;
      groups[i].forEach((g) => (g.style.transform = `translateY(${(-d * (g.dataset.k * 26 + 10)).toFixed(1)}px)`));
    });
  };
  const schedule = () => {
    if (!queued) {
      queued = true;
      requestAnimationFrame(paint);
    }
  };

  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', schedule);
  new ResizeObserver(schedule).observe(document.body);
  paint();
}
