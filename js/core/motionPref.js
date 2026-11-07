/**
 * motionPref.js — should the living background move?
 *
 * Default: yes, unless the OS asks for reduced motion. The header button lets a
 * visitor override that either way, and the choice is remembered (WCAG 2.2.2:
 * anything that moves on its own for more than 5 seconds needs a pause control).
 */
const KEY = 'imran-portfolio-motion';
const listeners = new Set();
const reducedMq = typeof matchMedia === 'function' ? matchMedia('(prefers-reduced-motion: reduce)') : null;

let stored = null; // 'on' | 'off' | null (= follow the OS)
try {
  const v = localStorage.getItem(KEY);
  stored = v === 'on' || v === 'off' ? v : null;
} catch {
  /* storage unavailable — the default still works */
}

const emit = () => {
  for (const fn of listeners) fn(motionEnabled());
};

export const prefersReducedMotion = () => !!reducedMq?.matches;

/** True when the background should play. */
export function motionEnabled() {
  return stored ? stored === 'on' : !prefersReducedMotion();
}

export function setMotion(on) {
  stored = on ? 'on' : 'off';
  try {
    localStorage.setItem(KEY, stored);
  } catch {
    /* non-fatal */
  }
  emit();
}

export const toggleMotion = () => setMotion(!motionEnabled());

export function onMotionChange(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

// The OS setting can change while the page is open.
if (reducedMq) {
  if (reducedMq.addEventListener) reducedMq.addEventListener('change', () => !stored && emit());
  else reducedMq.addListener?.(() => !stored && emit());
}
