/** motion.js — scroll reveals, active-nav indicator, header state, pointer effects. */
import { onLangChange } from '../core/lang.js';

export function initMotion() {
  const root = document.documentElement;
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
  root.classList.add('motion');

  // Reveal on scroll (one-shot).
  const io = new IntersectionObserver((list) => {
    for (const e of list) {
      if (!e.isIntersecting) continue;
      e.target.classList.add('in');
      io.unobserve(e.target);
    }
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach((n) => io.observe(n));

  // Header turns solid after the first scroll.
  const head = document.querySelector('.hdr');
  const onScroll = () => head.classList.toggle('solid', scrollY > 40);
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Active section tracking + sliding indicator.
  const links = [...document.querySelectorAll('.nav-links a')];
  const ind = document.querySelector('.nav-ind');
  let current = '';
  const mark = () => {
    const a = links.find((l) => l.hash === `#${current}`);
    links.forEach((l) => {
      l.classList.toggle('on', l === a);
      a === l ? l.setAttribute('aria-current', 'true') : l.removeAttribute('aria-current');
    });
    ind.style.cssText = a ? `opacity:1;width:${a.offsetWidth}px;transform:translateX(${a.offsetLeft}px)` : 'opacity:0';
  };
  const so = new IntersectionObserver((list) => {
    for (const e of list) if (e.isIntersecting) { current = e.target.id; mark(); }
  }, { rootMargin: '-45% 0px -50% 0px' });
  document.querySelectorAll('main > section[id]').forEach((s) => so.observe(s));
  onLangChange(() => requestAnimationFrame(mark));
  addEventListener('resize', mark);
  document.fonts?.ready.then(mark);

  // Magnetic buttons + card spotlight (mouse only, never on touch / reduced motion).
  if (finePointer && !calm) {
    let last = null;
    document.addEventListener('pointermove', (e) => {
      const b = e.target.closest?.('.btn');
      if (last && last !== b) last.style.translate = '';
      last = b;
      if (b) {
        const r = b.getBoundingClientRect();
        b.style.translate = `${(e.clientX - r.left - r.width / 2) * 0.16}px ${(e.clientY - r.top - r.height / 2) * 0.22}px`;
      }
      const c = e.target.closest?.('.card, .tile');
      if (c) {
        const r = c.getBoundingClientRect();
        c.style.setProperty('--mx', `${e.clientX - r.left}px`);
        c.style.setProperty('--my', `${e.clientY - r.top}px`);
      }
    }, { passive: true });
  }

  // Pause decorative CSS animation while the tab is hidden.
  document.addEventListener('visibilitychange', () => root.classList.toggle('paused', document.hidden));
}
