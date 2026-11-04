import { el, bilingual as bi } from './core/dom.js';
import { onLangChange, toggleLang, t } from './core/lang.js';
import { CONTENT, SITE } from './data/content.js';
import { socialLinks, ICONS } from './data/social.js';
import { projects } from './data/projects.js';
import { UI } from './data/ui.js';

const svg = (inner, vb = '0 0 24 24', extra = '') =>
  `<svg viewBox="${vb}" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ${extra}>${inner}</svg>`;
const ARROW = svg('<path d="M5 12h14M13 6l6 6-6 6"/>', '0 0 24 24', 'stroke-width="2"');
const SEARCH = svg('<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>', '0 0 24 24', 'stroke-width="2"');
const STARMARK = svg('<rect x="7" y="7" width="18" height="18"/><rect x="7" y="7" width="18" height="18" transform="rotate(45 16 16)"/><circle cx="16" cy="16" r="2.6" fill="currentColor"/>', '0 0 32 32', 'stroke-width="1.6"');
const ROSETTE = ['', 'rotate(45 100 100)', 'rotate(22.5 100 100)', 'rotate(67.5 100 100)']
  .map((r) => `<rect x="45" y="45" width="110" height="110"${r ? ` transform="${r}"` : ''}/>`)
  .join('');
const ORNAMENT = svg(`${ROSETTE}<circle cx="100" cy="100" r="96"/><circle cx="100" cy="100" r="30"/>`, '0 0 200 200', 'stroke-width=".6"');
const PALETTE = [['#0f5a43', '#2bb585'], ['#17483a', '#b8924a'], ['#124b52', '#2c8f7e'], ['#3a5a2a', '#d4b06a'], ['#0d3b34', '#5aa88a']];

const ico = (markup) => {
  const tpl = document.createElement('template');
  tpl.innerHTML = markup;
  return tpl.content.firstChild;
};
/** Set an attribute from a {bn,en} entry now and whenever the language changes. */
const bind = (node, attr, entry) => {
  const apply = () => node.setAttribute(attr, t(entry));
  apply();
  onLangChange(apply);
  return node;
};
const link = (href, props, kids) =>
  el('a', { href, ...(href.startsWith('mailto:') ? {} : { target: '_blank', rel: 'noopener noreferrer' }), ...props }, kids);
const eyebrowHead = (e, h, p) =>
  el('div', { class: 'sec-head reveal' }, [el('p', { class: 'eyebrow' }, bi(e)), el('h2', {}, bi(h)), p && el('p', {}, bi(p))]);

/** Word-by-word reveal: wraps each word of a node in a masked span. */
const split = (node) => {
  node.textContent
    .trim()
    .split(/\s+/)
    .forEach((word, i, all) => {
      if (i === 0) node.textContent = '';
      const inner = el('span', {}, word);
      inner.style.setProperty('--i', i);
      node.append(el('span', { class: 'w' }, inner), i < all.length - 1 ? ' ' : '');
    });
};

/* ---------- header ---------- */
function header() {
  const bar = el('header', { class: 'hdr' });
  const setOpen = (open) => {
    bar.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open));
  };
  const links = UI.nav.map((n) => el('a', { href: n.href, on: { click: () => setOpen(false) } }, bi(n)));
  const burger = bind(
    el('button', { class: 'burger', type: 'button', 'aria-expanded': 'false', 'aria-controls': 'nav-links', on: { click: () => setOpen(!bar.classList.contains('open')) } }, [el('i'), el('i')]),
    'aria-label', UI.menu
  );
  const lang = bind(
    el('button', { class: 'lang', type: 'button', on: { click: toggleLang } }, [el('span', { class: 'lb', text: CONTENT.nav.langBn }), el('span', { class: 'le', text: CONTENT.nav.langEn })]),
    'aria-label', UI.langLabel
  );
  document.addEventListener('keydown', (e) => e.key === 'Escape' && setOpen(false));
  document.addEventListener('click', (e) => !bar.contains(e.target) && setOpen(false));
  bar.append(
    el('a', { class: 'brand', href: '#top' }, [ico(STARMARK), el('span', { class: 'bt' }, bi(UI.brand))]),
    bind(el('nav', { class: 'nav-links', id: 'nav-links' }, [...links, el('span', { class: 'nav-ind', 'aria-hidden': 'true' })]), 'aria-label', UI.navLabel),
    el('div', { class: 'acts' }, [lang, burger])
  );
  return bar;
}

/* ---------- hero ---------- */
function hero() {
  const h1 = el('h1', {}, bi(CONTENT.hero.name));
  h1.querySelectorAll('span').forEach(split);
  return el('section', { class: 'hero', id: 'top' }, [
    el('div', { class: 'orn', 'aria-hidden': 'true', html: ORNAMENT }),
    el('div', { class: 'wrap' }, [
      el('p', { class: 'eyebrow' }, bi(CONTENT.hero.eyebrow)),
      h1,
      el('p', { class: 'lead' }, bi(CONTENT.hero.tagline)),
      el('div', { class: 'cta' }, [
        el('a', { class: 'btn btn-p', href: '#projects' }, [...bi(CONTENT.hero.ctaPrimary), ico(ARROW)]),
        el('a', { class: 'btn btn-g', href: '#contact' }, bi(CONTENT.hero.ctaGhost))
      ])
    ]),
    el('a', { class: 'hint', href: '#projects' }, [el('i'), ...bi(CONTENT.hero.scrollHint)])
  ]);
}

/* ---------- projects ---------- */
const dlg = el('dialog', { class: 'dlg', 'aria-labelledby': 'dt' });
dlg.addEventListener('click', (e) => e.target === dlg && dlg.close());

const thumb = (p, i) => {
  const [a, b] = PALETTE[i % PALETTE.length];
  const node = el('div', { class: 'thumb', 'aria-hidden': 'true' });
  node.style.setProperty('--a', a);
  node.style.setProperty('--b', b);
  node.innerHTML = `<div class="zoom"><svg><rect width="100%" height="100%" fill="url(#geo)"/></svg><span class="mark">${p.mark}</span></div><span class="host">${new URL(p.url).host}</span>`;
  return node;
};
const tagsOf = (p) => {
  const bn = p.cat.bn.split(' / ');
  return p.cat.en.split(' / ').map((en, k) => el('span', {}, bi({ bn: bn[k] ?? en, en })));
};
const sr = (p) => el('span', { class: 'sr' }, bi(p.name));
const live = (p) =>
  link(p.url, { class: 'btn btn-p' }, [...bi(UI.live), sr(p), ico(ARROW)]);

function openDetails(p) {
  const x = el('button', { class: 'x', type: 'button', text: '×', on: { click: () => dlg.close() } });
  x.setAttribute('aria-label', t(UI.close));
  dlg.replaceChildren(
    x,
    thumb(p, projects.indexOf(p)),
    el('div', { class: 'body' }, [
      el('p', { class: 'cat' }, bi(p.cat)),
      el('h3', { id: 'dt' }, bi(p.name)),
      el('p', { class: 'desc' }, bi(p.desc)),
      el('div', { class: 'tags' }, tagsOf(p)),
      el('div', { class: 'acts' }, [live(p)])
    ])
  );
  dlg.showModal();
}

const card = (p, i) => {
  const node = el('article', { class: 'card reveal' }, [
    thumb(p, i),
    el('div', { class: 'body' }, [
      el('p', { class: 'cat' }, bi(p.cat)),
      el('h3', {}, bi(p.name)),
      el('p', { class: 'desc' }, bi(p.desc)),
      el('div', { class: 'tags' }, tagsOf(p)),
      el('div', { class: 'acts' }, [live(p), el('button', { class: 'btn btn-g', type: 'button', on: { click: () => openDetails(p) } }, [...bi(UI.details), sr(p)])])
    ])
  ]);
  node.style.setProperty('--i', i % 3);
  return node;
};

function projectsSection() {
  const S = CONTENT.projectsSection;
  let filter = 'all';
  let query = '';
  const chips = UI.filters.map(([k, bn, en]) =>
    el('button', { class: 'chip', type: 'button', 'aria-pressed': String(k === 'all'), data: { k }, on: { click: () => { filter = k; sync(); } } }, bi({ bn, en }))
  );
  const input = el('input', { type: 'search', autocomplete: 'off', on: { input: (e) => { query = e.target.value.trim().toLowerCase(); sync(); } } });
  bind(input, 'placeholder', UI.search);
  bind(input, 'aria-label', UI.search);
  const empty = el('p', { class: 'empty', hidden: true, role: 'status' }, bi(UI.empty));
  const items = projects.map((p, i) => ({
    p,
    node: card(p, i),
    hay: [p.name, p.cat, p.desc].flatMap((e) => [e.bn, e.en]).join(' ').toLowerCase()
  }));
  const sync = () => {
    let shown = 0;
    for (const it of items) {
      const ok = (filter === 'all' || it.p.cats.includes(filter)) && (!query || it.hay.includes(query));
      it.node.hidden = !ok;
      shown += ok;
    }
    empty.hidden = shown > 0;
    chips.forEach((c) => c.setAttribute('aria-pressed', String(c.dataset.k === filter)));
  };
  return el('section', { id: 'projects' }, el('div', { class: 'wrap' }, [
    eyebrowHead(S.eyebrow, S.heading, S.intro),
    el('div', { class: 'tools reveal' }, [
      bind(el('div', { class: 'chips', role: 'group' }, chips), 'aria-label', UI.filterLabel),
      el('label', { class: 'searchbox' }, [ico(SEARCH), input])
    ]),
    el('div', { class: 'grid' }, items.map((it) => it.node)),
    empty
  ]));
}

/* ---------- about + skills ---------- */
function aboutSection() {
  const A = CONTENT.about;
  let n = 0;
  const groups = UI.groups.map((g) =>
    el('div', { class: 'sgroup' }, [
      el('h3', {}, bi(g)),
      el('div', { class: 'badges' }, g.i.map((k) => {
        const b = el('span', { class: 'badge reveal' }, [ico(STARMARK), A.skills[k]]);
        b.style.setProperty('--i', n++);
        return b;
      }))
    ])
  );
  return el('section', { id: 'about' }, el('div', { class: 'wrap' }, [
    eyebrowHead(A.eyebrow, A.heading),
    el('div', { class: 'about' }, [
      el('div', { class: 'panel reveal' }, A.paragraphs.map((p) => el('p', {}, bi(p)))),
      el('div', { class: 'panel reveal' }, [el('p', { class: 'cat' }, bi(A.skillsLabel)), ...groups])
    ])
  ]));
}

/* ---------- contact ---------- */
function contactSection() {
  const C = CONTENT.contactSection;
  const tiles = socialLinks.map((s, i) => {
    const a = link(s.url, { class: 'tile reveal', html: ICONS[s.icon] }, el('div', {}, [el('b', { text: s.name }), el('small', { text: s.handle })]));
    a.style.setProperty('--i', i % 4);
    return a;
  });
  return el('section', { id: 'contact' }, el('div', { class: 'wrap' }, [
    eyebrowHead(C.eyebrow, C.heading),
    el('div', { class: 'panel cprimary reveal' }, [
      el('div', {}, [el('h3', { text: SITE.email }), el('p', {}, bi(C.primaryBlurb))]),
      el('div', { class: 'acts' }, [
        el('a', { class: 'btn btn-p', href: `mailto:${SITE.email}` }, [...bi(C.primaryCta), ico(ARROW)]),
        el('a', { class: 'btn btn-g', href: SITE.resumeUrl, download: 'Imran-Ahmed-CV.pdf' }, bi(C.resumeCta))
      ])
    ]),
    el('div', { class: 'tiles' }, tiles)
  ]));
}

/* ---------- footer ---------- */
function footer() {
  const soc = socialLinks.map((s) => link(s.url, { 'aria-label': s.name, title: s.name, html: ICONS[s.icon] }));
  return el('footer', {}, el('div', { class: 'wrap' }, [
    el('div', { class: 'fgrid' }, [
      el('div', {}, [el('a', { class: 'brand', href: '#top' }, [ico(STARMARK), el('span', {}, bi(UI.brand))]), el('p', {}, bi(UI.footerDesc))]),
      el('div', {}, [el('h4', {}, bi(UI.explore)), el('div', { class: 'flinks' }, UI.nav.map((n) => el('a', { href: n.href }, bi(n))))]),
      el('div', {}, [el('h4', {}, bi(UI.follow)), el('div', { class: 'soc' }, soc)])
    ]),
    el('div', { class: 'fbar' }, [
      el('span', {}, [`© ${new Date().getFullYear()} Imran Ahmed · `, ...bi(CONTENT.footer)]),
      el('button', { class: 'btn btn-g totop', type: 'button', on: { click: () => scrollTo({ top: 0 }) } }, [...bi(UI.top), ico(ARROW)])
    ])
  ]));
}

export function renderApp(root) {
  root.append(
    el('div', { id: 'scenes', 'aria-hidden': 'true' }),
    el('div', { class: 'veil', 'aria-hidden': 'true' }),
    el('div', { class: 'progress', 'aria-hidden': 'true' }),
    header(),
    el('main', { id: 'main' }, [hero(), projectsSection(), aboutSection(), contactSection()]),
    footer(),
    dlg
  );
}
