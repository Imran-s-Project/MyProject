import { renderApp } from './app.js';
import { initLang } from './core/lang.js';
import { initMotion } from './features/motion.js';

initLang();
renderApp(document.getElementById('app'));

// Each enhancement is isolated so one failure can never hide the content.
try {
  initMotion();
} catch (err) {
  console.error(err);
}

// The Cinematic Nature Engine loads after the content has rendered (dynamic import), so it can never
// delay or break the portfolio. If anything about it fails, the calm CSS background simply stays.
import('./features/natureEngine.js')
  .then((m) => m.initNature(document.getElementById('scenes')))
  .catch((err) => console.error(err));
