/**
 * ticker.js — ONE shared requestAnimationFrame loop for every animated feature.
 *
 *   const task = ticker.add('mist', (now, dt) => { draw(); return true; }, { fps: 24 });
 *   task.wake();            // ask for frames
 *   // the callback returns true to keep running, anything else lets it sleep
 *
 * - Tasks that have nothing to do sleep, and the loop stops when every task sleeps,
 *   so an idle page costs zero CPU.
 * - Tasks may be frame-capped (`fps`) — slow atmospheric motion does not need 60 fps.
 * - pause()/resume() freeze everything while the tab is hidden.
 * - A task that throws is put to sleep and logged; it can never take the others down.
 */
export function createTicker() {
  const tasks = new Map();
  let raf = 0;
  let paused = false;

  const frame = (now) => {
    raf = 0;
    if (paused) return;
    let again = false;
    for (const task of tasks.values()) {
      if (!task.awake) continue;
      if (task.gap && task.last && now - task.last < task.gap - 2) {
        again = true; // not due yet, keep the loop alive
        continue;
      }
      const dt = task.last ? Math.min(now - task.last, 100) : 16;
      task.last = now;
      let keep = false;
      try {
        keep = task.fn(now, dt) === true;
      } catch (err) {
        console.error(err);
      }
      if (keep) again = true;
      else task.awake = false;
    }
    if (again && !paused) raf = requestAnimationFrame(frame);
  };

  const start = () => {
    if (!raf && !paused) raf = requestAnimationFrame(frame);
  };

  return {
    add(id, fn, { fps = 0 } = {}) {
      const task = { fn, awake: false, last: 0, gap: fps ? 1000 / fps : 0 };
      tasks.set(id, task);
      return {
        wake() {
          if (!task.awake) {
            task.awake = true;
            task.last = 0;
          }
          start();
        },
        sleep() {
          task.awake = false;
        },
        remove() {
          tasks.delete(id);
        }
      };
    },
    pause() {
      paused = true;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    },
    resume() {
      if (!paused) return;
      paused = false;
      let any = false;
      for (const task of tasks.values()) {
        task.last = 0;
        any = any || task.awake;
      }
      if (any) start();
    },
    destroy() {
      tasks.clear();
      paused = true;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    }
  };
}
