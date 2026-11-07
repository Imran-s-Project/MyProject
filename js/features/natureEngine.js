/**
 * natureEngine.js — entry point of the Cinematic Nature Background Engine.
 *
 *   initNature(document.getElementById('scenes'))
 *
 * Wires four small, separate modules around ONE shared animation ticker:
 *   qualityProfile.js  what this device / connection / user preference allows
 *   sceneManager.js    scene stack, scroll → crossfade, video life-cycle, posters, fallbacks
 *   atmosphere.js      mist, god-rays, cursor light, film grain
 *   parallaxEngine.js  pointer parallax (desktop)
 *
 * The engine is loaded with a dynamic import after the page content has rendered, so it can
 * never delay or break the portfolio itself. If anything fails, the calm CSS fallback stays.
 *
 * Media is described by assets/nature/manifest.json (written by tools/make-nature-assets.mjs).
 * A missing, empty or broken manifest simply means "no footage yet": scenes use their fallback look.
 */
import { SCENES } from '../data/scenes.js';
import { createTicker } from '../core/ticker.js';
import { onMotionChange } from '../core/motionPref.js';
import { createProfile } from './qualityProfile.js';
import { createSceneManager } from './sceneManager.js';
import { createAtmosphere } from './atmosphere.js';
import { createParallax } from './parallaxEngine.js';

const MANIFEST_URL = new URL('../../assets/nature/manifest.json', import.meta.url).href;

async function loadManifest(url, profile) {
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), 6000);
  try {
    const res = await fetch(url, { signal: ctl.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data || typeof data !== 'object' || typeof data.scenes !== 'object' || data.scenes === null) throw new Error('unexpected shape');
    return data;
  } catch (err) {
    profile.log('manifest unavailable → fallback scenes', err?.message);
    return { version: 1, scenes: {} };
  } finally {
    clearTimeout(timer);
  }
}

export async function initNature(host) {
  if (!host) return null;
  const profile = createProfile();
  const ticker = createTicker();
  const manifest = await loadManifest(MANIFEST_URL, profile);

  const atmosphere = createAtmosphere({ host, ticker, profile });
  const manager = createSceneManager({
    host,
    ticker,
    profile,
    config: SCENES,
    manifest,
    manifestUrl: MANIFEST_URL,
    veil: document.querySelector('.veil'),
    onBlend: atmosphere.setBlend
  });
  const parallax = createParallax({ host, ticker, profile });

  // The header button / OS setting can turn ambient motion on or off at any time.
  const offMotion = onMotionChange(() => {
    atmosphere.setAnimated(profile.motion());
    parallax.setEnabled(profile.parallax());
    manager.refresh();
  });

  host.dataset.engine = 'ready';
  profile.log('ready', { mist: atmosphere.mode, mode: host.dataset.mode, constrained: profile.constrained });

  const api = {
    profile,
    manager,
    atmosphere,
    destroy() {
      offMotion();
      parallax.destroy();
      manager.destroy();
      atmosphere.destroy();
      ticker.destroy();
      delete host.dataset.engine;
      if (window.__nature === api) delete window.__nature;
    }
  };
  if (profile.debug) window.__nature = api; // QA hook: only with ?nature-debug in the URL
  return api;
}
