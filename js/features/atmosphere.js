/**
 * atmosphere.js — the thin layer of air between the footage and the page.
 *
 *   • drifting mist   WebGL shader → two drifting CSS gradients → static haze (chosen per device)
 *   • soft god-rays   shader only, mostly for the woodland scene
 *   • warm cursor light (desktop; its position comes from parallaxEngine through --lx / --ly)
 *   • fine film grain that also dithers the dark gradients so they never band
 *
 * Real environmental motion comes from the footage itself. This layer only ties the scenes
 * together, so its strength is eased down automatically while real video is playing.
 */
const make = (tag, cls) => {
  const node = document.createElement(tag);
  if (cls) node.className = cls;
  return node;
};

const VERT = 'attribute vec2 p;varying vec2 v;void main(){v=p*.5+.5;gl_Position=vec4(p,0.,1.);}';

const FRAG = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
varying vec2 v;
uniform vec2 uRes;
uniform float uT;
uniform vec3 uTint;
uniform float uAmt;
uniform float uRays;
float hash(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
  return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y);}
float fbm(vec2 p){float a=.5,s=0.;for(int i=0;i<4;i++){s+=a*noise(p);p=p*2.02+vec2(11.7,7.3);a*=.5;}return s;}
void main(){
  float asp=uRes.x/uRes.y;
  float h=1.-v.y;                                   // 0 = top of the screen, 1 = bottom
  vec2 q=vec2(v.x*asp,h);
  // two depth layers: a slow far haze and a faster near mist that the far layer warps
  float far=fbm(q*vec2(1.1,1.9)+vec2(uT*.006,0.));
  float near=fbm(q*vec2(2.1,3.1)+vec2(-uT*.014,uT*.003)+far*1.2);
  float d=mix(far,near,.6);
  float low=smoothstep(.3,1.,h);                    // mist gathers low in the frame...
  float band=exp(-pow((h-.62)*3.4,2.));             // ...and along a soft horizon band
  float m=smoothstep(.38,.82,d)*(.3+.7*max(low*.85,band));
  float a=m*uAmt*.55;
  // god rays from a sun just outside the top-left corner
  vec2 dv=q-vec2(.18*asp,-.08);
  float ang=atan(dv.y,dv.x);
  float beams=pow(.5+.5*sin(ang*15.+fbm(vec2(ang*3.,uT*.04))*4.),6.);
  float ray=beams*smoothstep(1.35,.05,length(dv))*(1.-h*.35)*uRays;
  a+=ray*.14;
  vec3 col=mix(uTint,vec3(1.,.93,.75),clamp(ray*3.,0.,1.));
  a=clamp(a,0.,.62);
  float dn=(hash(gl_FragCoord.xy+fract(uT))-.5)/255.;
  gl_FragColor=vec4(col*a+dn*a,a);                  // premultiplied alpha
}`;

function compile(gl, type, src) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
}

function initGL(canvas) {
  const gl = canvas.getContext('webgl', {
    alpha: true,
    premultipliedAlpha: true,
    antialias: false,
    depth: false,
    stencil: false,
    powerPreference: 'low-power'
  });
  if (!gl) return null;
  const vs = compile(gl, gl.VERTEX_SHADER, VERT);
  const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) return null;
  const prog = gl.createProgram();
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
  gl.useProgram(prog);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW); // one oversized triangle
  const loc = gl.getAttribLocation(prog, 'p');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  gl.clearColor(0, 0, 0, 0);
  const at = (name) => gl.getUniformLocation(prog, name);
  return { gl, u: { res: at('uRes'), t: at('uT'), tint: at('uTint'), amt: at('uAmt'), rays: at('uRays') } };
}

export function createAtmosphere({ host, ticker, profile }) {
  const root = make('div', 'atmos');
  root.setAttribute('aria-hidden', 'true');
  const mistCss = make('div', 'atmos__mist');
  mistCss.append(make('i'), make('i'));
  root.append(mistCss, make('div', 'atmos__light'), make('div', 'atmos__grain'));
  host.append(root);

  const t0 = performance.now();
  let mode = profile.mistMode(); // webgl | css | none
  let animated = profile.motion();
  let ctx = null;
  let canvas = null;
  let blend = { rgb: [223, 238, 221], amount: 0.8, rays: 0.1, live: 0 };
  let resizeTimer = 0;

  const useCss = () => {
    ctx = null;
    canvas?.remove();
    mode = profile.mistMode() === 'none' ? 'none' : 'css';
    root.dataset.mist = mode;
  };
  // The GPU may take the context away at any time (driver reset, too many tabs): carry on with the CSS mist.
  function onContextLost(e) {
    e.preventDefault();
    profile.log('WebGL context lost → CSS mist');
    useCss();
  }

  if (mode === 'webgl') {
    try {
      canvas = make('canvas', 'atmos__gl');
      ctx = initGL(canvas);
    } catch {
      ctx = null;
    }
    if (ctx) {
      root.prepend(canvas);
      canvas.addEventListener('webglcontextlost', onContextLost);
    } else {
      mode = 'css';
    }
  }
  root.dataset.mist = mode;
  host.dataset.motion = animated ? 'on' : 'off';

  function resize() {
    if (!ctx) return;
    const scale = profile.constrained ? 0.3 : 0.4; // fog is low-frequency, so a small buffer is plenty
    const w = Math.max(2, Math.round(innerWidth * scale));
    const h = Math.max(2, Math.round(innerHeight * scale));
    if (canvas.width === w && canvas.height === h) return;
    canvas.width = w;
    canvas.height = h;
    ctx.gl.viewport(0, 0, w, h);
    ctx.gl.uniform2f(ctx.u.res, w, h);
  }

  function draw(now) {
    if (!ctx) return;
    const { gl, u } = ctx;
    const live = blend.live; // real footage brings its own haze → ease the synthetic one off
    gl.uniform1f(u.t, ((now - t0) / 1000) % 1200);
    gl.uniform3f(u.tint, blend.rgb[0] / 255, blend.rgb[1] / 255, blend.rgb[2] / 255);
    gl.uniform1f(u.amt, blend.amount * (1 - 0.55 * live));
    gl.uniform1f(u.rays, blend.rays * (1 - 0.6 * live));
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  const task = ticker.add(
    'mist',
    (now) => {
      draw(now);
      return animated && !!ctx; // a static page draws exactly one frame per change
    },
    { fps: 24 }
  );

  resize();
  const onResize = () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      resize();
      task.wake();
    }, 150);
  };
  addEventListener('resize', onResize);
  if (ctx) task.wake();

  return {
    /** Called by the scene manager with the weighted mix of the scenes currently on screen. */
    setBlend(b) {
      blend = { rgb: b.rgb, amount: b.amount, rays: b.rays, live: b.live };
      root.style.setProperty('--mist', b.rgb.map(Math.round).join(','));
      root.style.setProperty('--mist-a', b.amount.toFixed(3));
      if (ctx) task.wake();
    },
    setAnimated(on) {
      animated = on;
      host.dataset.motion = on ? 'on' : 'off';
      if (ctx) task.wake();
    },
    get mode() {
      return mode;
    },
    destroy() {
      clearTimeout(resizeTimer);
      removeEventListener('resize', onResize);
      task.remove();
      canvas?.removeEventListener('webglcontextlost', onContextLost);
      // Hand the GPU context back right away instead of waiting for garbage collection.
      try {
        ctx?.gl.getExtension('WEBGL_lose_context')?.loseContext();
      } catch {
        /* already lost */
      }
      ctx = null;
      root.remove();
      delete host.dataset.motion;
    }
  };
}
