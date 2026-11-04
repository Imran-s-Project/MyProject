import { renderApp } from './app.js';
import { initLang } from './core/lang.js';
import { initScenes } from './features/scenes.js';
import { initMotion } from './features/motion.js';

initLang();
renderApp(document.getElementById('app'));

// Each enhancement is isolated so one failure can never hide the content.
for (const run of [() => initScenes(document.getElementById('scenes')), initMotion]) {
  try {
    run();
  } catch (err) {
    console.error(err);
  }
}
