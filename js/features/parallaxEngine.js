/**
 * parallaxEngine.js — restrained pointer parallax + warm cursor light (fine pointers only).
 *
 * It never touches a layer directly. It eases the pointer to two numbers, --px / --py (−1…1),
 * and publishes them on the #scenes host. Every layer carries a `--depth` and a single CSS rule
 *
 *     transform: translate3d(px · depth · −30px, py · depth · −18px + scroll · depth · −36px, 0)
 *
 * so far layers (mountains, clouds: depth .35) drift slowly and foreground layers (depth ≥ .7)
 * move more. The same CSS rule also yields scroll-linked depth on touch devices, where there is
 * no pointer at all. The loop sleeps as soon as the motion has settled.
 */
export function createParallax({ host, ticker, profile }) {
  let on = false;
  let present = false;
  let tx = 0;
  let ty = 0;
  let x = 0;
  let y = 0; // eased parallax, −1…1
  let lx = 0;
  let ly = 0;
  let cx = 0;
  let cy = 0; // cursor light, px

  const atmos = () => host.querySelector('.atmos');

  const task = ticker.add('parallax', (now, dt) => {
    const k = 1 - Math.exp(-dt / 150); // ~150 ms time-constant: smooth, never snappy
    const kl = 1 - Math.exp(-dt / 90);
    x += (tx - x) * k;
    y += (ty - y) * k;
    cx += (lx - cx) * kl;
    cy += (ly - cy) * kl;
    host.style.setProperty('--px', x.toFixed(4));
    host.style.setProperty('--py', y.toFixed(4));
    host.style.setProperty('--lx', `${cx.toFixed(1)}px`);
    host.style.setProperty('--ly', `${cy.toFixed(1)}px`);
    return Math.abs(tx - x) > 0.0008 || Math.abs(ty - y) > 0.0008 || Math.abs(lx - cx) > 0.3 || Math.abs(ly - cy) > 0.3;
  });

  const onMove = (e) => {
    if (e.pointerType && e.pointerType !== 'mouse' && e.pointerType !== 'pen') return;
    tx = (e.clientX / innerWidth) * 2 - 1;
    ty = (e.clientY / innerHeight) * 2 - 1;
    lx = e.clientX;
    ly = e.clientY;
    if (!present) {
      present = true;
      cx = lx;
      cy = ly;
      atmos()?.classList.add('has-pointer');
    }
    task.wake();
  };
  const onLeave = () => {
    tx = 0;
    ty = 0;
    present = false;
    atmos()?.classList.remove('has-pointer');
    task.wake();
  };

  function setEnabled(enabled) {
    if (enabled === on) return;
    on = enabled;
    if (on) {
      addEventListener('pointermove', onMove, { passive: true });
      document.documentElement.addEventListener('pointerleave', onLeave);
      addEventListener('blur', onLeave);
    } else {
      removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      removeEventListener('blur', onLeave);
      onLeave(); // ease the layers back to centre
    }
  }

  setEnabled(profile.parallax());

  return {
    setEnabled,
    destroy() {
      setEnabled(false);
      task.remove();
    }
  };
}
