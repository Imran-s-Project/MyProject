/**
 * qualityProfile.js — how rich may the nature background be on THIS device?
 *
 * Pure decisions with no DOM side effects; the engine reads the profile and adapts.
 * Debug / QA overrides (URL query):
 *   ?nature=off    posters / fallback only, no mist, no parallax
 *   ?nature=low    behave like a constrained phone
 *   ?nature=high   behave like a desktop even on a touch screen
 *   ?nature-debug  log engine decisions to the console
 */
import { motionEnabled } from '../core/motionPref.js';

/** Delivery tiers, smallest → largest. `portrait` is a 9:16 crop made for phones. */
export const TIERS = ['portrait', 'hd', 'fhd', 'qhd'];
const CAP_KEY = 'imran-portfolio-nature-cap';

const mm = (q) => typeof matchMedia === 'function' && matchMedia(q).matches;

export function createProfile() {
  const params = new URLSearchParams(location.search);
  const force = params.get('nature'); // off | low | high | null
  const debug = params.has('nature-debug');
  const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection || null;
  const effective = conn?.effectiveType || '';
  const memory = navigator.deviceMemory ?? 4; // Safari/Firefox do not report it → assume a normal device
  const cores = navigator.hardwareConcurrency ?? 4;

  const coarse = force === 'high' ? false : force === 'low' || mm('(pointer: coarse)') || mm('(hover: none)');
  const slowNet = /(^|-)2g$/.test(effective) || effective === '3g';
  const veryslow = /(^|-)2g$/.test(effective);
  const lowEnd = force !== 'high' && (force === 'low' || memory <= 2 || cores <= 2);
  const saveData = !!conn?.saveData || mm('(prefers-reduced-data: reduce)');
  const constrained = force !== 'high' && (coarse || lowEnd || slowNet);

  // Highest tier index the frame-rate guard still allows: 3 = no restriction … 0 = portrait only,
  // -1 = posters only. Lowered when playback stutters; sticky for this browser session.
  let cap = 3;
  try {
    const stored = sessionStorage.getItem(CAP_KEY);
    if (stored !== null && Number.isFinite(Number(stored))) cap = Math.max(-1, Math.min(3, Math.floor(Number(stored))));
  } catch {
    /* storage unavailable — the guard simply starts fresh on every page load */
  }

  const profile = {
    force,
    debug,
    coarse,
    lowEnd,
    constrained,
    saveData,
    /** Concurrency budget: videos that may decode at the same time / exist at all. */
    maxPlaying: 2,
    maxAlive: constrained ? 2 : 3,
    /** The frame-rate guard calls this with the highest tier it still trusts (-1 = no video at all). */
    capAt(index) {
      cap = Math.max(-1, Math.min(3, Math.floor(index)));
      try {
        sessionStorage.setItem(CAP_KEY, String(cap));
      } catch {
        /* ignore */
      }
      return cap;
    },
    /** Highest tier index allowed right now (-1 = no video at all). */
    tierCap() {
      return Math.min(constrained ? 1 : 3, cap);
    },
    /** Is moving footage allowed at all? Otherwise elegant posters are used. */
    videoAllowed() {
      return force !== 'off' && motionEnabled() && !saveData && !veryslow && profile.tierCap() >= 0;
    },
    /** Is any ambient motion (mist drift, parallax, scale transitions) allowed? */
    motion() {
      return force !== 'off' && motionEnabled();
    },
    parallax() {
      return profile.motion() && !coarse;
    },
    /** webgl = shader mist · css = two drifting gradients · none = static haze only */
    mistMode() {
      if (force === 'off' || saveData || lowEnd) return 'none';
      return constrained ? 'css' : 'webgl';
    },
    log(...args) {
      if (debug) console.info('[nature]', ...args);
    }
  };
  return profile;
}
