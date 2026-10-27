/* =============================================================
   Playground : canvas infini en drag & drop, rendu en WebGL.
   Le fish-eye est un vrai effet d'objectif : toute la scène
   (images comprises) est déformée par un shader quand on grab.
   - Passe 1 : on dessine la grille dans une texture (un peu plus
     grande que l'écran, pour avoir de la matière sur les bords)
   - Passe 2 : on affiche cette texture à travers une lentille bombée
   - La boucle s'endort quand rien ne bouge
============================================================= */
(() => {
  const root = document.documentElement;
  const stage = document.getElementById('stage');
  const cursor = document.getElementById('cursor');

  /* ---------- Contenu : pièces éditoriales + les 5 sites intercalés ---------- */
  const items = [];
  const web = PROJECTS.map((p) => ({
    title: p.name, cat: t('pgWebsite'), src: p.cover, href: `project.html?id=${p.id}`, web: true,
    desc: p.desc.split('. ')[0].replace(/\.$/, '') + '.',
  }));
  const step = Math.floor(EDITORIAL.length / web.length);
  EDITORIAL.forEach((e, i) => {
    items.push({ ...e });
    if (i % step === 1 && web.length) items.push(web.shift());
  });
  items.push(...web);
  items.forEach((it, i) => { it.i = i; it.n = String(i + 1).padStart(2, '0'); });
  document.getElementById('count').textContent = `${items.length} ${t('pgWorks')}`;

  const mod = (a, b) => ((a % b) + b) % b;
  const OVER = 1.28;   // la scène est rendue 28 % plus grande que l'écran
  const MAX_TEX = 640; // taille max des textures (allège la mémoire et le GPU)

  /* =========================================================
     WEBGL
  ========================================================= */
  const canvas = document.createElement('canvas');
  canvas.className = 'pg-canvas';
  stage.appendChild(canvas);
  const gl = canvas.getContext('webgl', { antialias: false, alpha: false, preserveDrawingBuffer: false });
  if (!gl) { stage.innerHTML = `<p style="padding:120px 24px">${t('pgNoWebgl')}</p>`; return; }

  function program(vs, fs) {
    const p = gl.createProgram();
    [[gl.VERTEX_SHADER, vs], [gl.FRAGMENT_SHADER, fs]].forEach(([t, src]) => {
      const sh = gl.createShader(t);
      gl.shaderSource(sh, src); gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) console.error(gl.getShaderInfoLog(sh));
      gl.attachShader(p, sh);
    });
    gl.linkProgram(p);
    return p;
  }

  // Passe 1 : un rectangle texturé (image ou légende) en pixels
  const quadProg = program(`
    attribute vec2 a;
    uniform vec4 uRect; uniform vec2 uRes;
    varying vec2 vUv;
    void main() {
      vec2 p = uRect.xy + a * uRect.zw;
      vec2 c = p / uRes * 2.0 - 1.0;
      gl_Position = vec4(c.x, -c.y, 0.0, 1.0);
      vUv = a;
    }`, `
    precision mediump float;
    uniform sampler2D uTex; uniform float uAlpha; uniform float uUseTex; uniform vec3 uColor;
    varying vec2 vUv;
    void main() {
      vec4 t = texture2D(uTex, vUv);
      vec4 c = mix(vec4(uColor, 1.0), t, uUseTex);
      gl_FragColor = vec4(c.rgb, c.a * uAlpha);
    }`);

  // Passe 2 : la lentille fish-eye (centre bombé, bords compressés)
  const lensProg = program(`
    attribute vec2 a; varying vec2 vUv;
    void main() { vUv = a; gl_Position = vec4(a * 2.0 - 1.0, 0.0, 1.0); }`, `
    precision highp float;
    uniform sampler2D uScene; uniform float uLens; uniform vec2 uAspect; uniform float uOver; uniform vec3 uBg;
    varying vec2 vUv;
    void main() {
      vec2 p = vUv * 2.0 - 1.0;
      vec2 pc = p * uAspect;               // coin de l'écran = rayon 1
      float r2 = dot(pc, pc);
      float K = 0.38 * uLens;              // grossissement au centre
      float E = 0.2 * uLens;               // on montre plus de matière sur les bords
      vec2 q = p * (1.0 - K * (1.0 - r2)) * (1.0 + E);
      vec2 uv = q / uOver * 0.5 + 0.5;
      if (uv.x < 0.0 || uv.y < 0.0 || uv.x > 1.0 || uv.y > 1.0) { gl_FragColor = vec4(uBg, 1.0); return; }
      gl_FragColor = texture2D(uScene, uv);
    }`);

  const qU = {}, lU = {};
  ['uRect', 'uRes', 'uTex', 'uAlpha', 'uUseTex', 'uColor'].forEach((n) => (qU[n] = gl.getUniformLocation(quadProg, n)));
  ['uScene', 'uLens', 'uAspect', 'uOver', 'uBg'].forEach((n) => (lU[n] = gl.getUniformLocation(lensProg, n)));

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1]), gl.STATIC_DRAW);

  function makeTex() {
    const t = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    return t;
  }
  const blank = makeTex();
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 0]));

  // Framebuffer de la scène
  const fbo = gl.createFramebuffer();
  const sceneTex = makeTex();
  let dpr = 1, fbW = 0, fbH = 0;

  /* ---------- Couleurs du thème ---------- */
  const col = {};
  const hex = (h) => { h = h.trim().replace('#', ''); return [0, 2, 4].map((i) => parseInt(h.substr(i, 2), 16) / 255); };
  function readColors() {
    const cs = getComputedStyle(root);
    ['bg', 'ink', 'muted', 'accent', 'accent-soft'].forEach((k) => (col[k] = cs.getPropertyValue('--' + k).trim()));
    col.bgV = hex(col.bg); col.softV = hex(col['accent-soft']);
  }

  /* ---------- Textures des images (chargées une fois par visuel) ---------- */
  const assets = new Map(); // src → { tex, ready, ratio }
  const preloadBox = document.createElement('div');
  preloadBox.className = 'pg-preload';
  document.body.appendChild(preloadBox);

  items.forEach((it) => {
    if (assets.has(it.src)) return;
    const a = { tex: null, ready: false, ratio: 1.3 };
    assets.set(it.src, a);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.decoding = 'async';
    img.dataset.critical = ''; // compte dans le loading screen
    img.onload = () => {
      let w = img.naturalWidth || 600, h = img.naturalHeight || 848;
      a.ratio = h / w;
      const s = Math.min(1, MAX_TEX / Math.max(w, h));
      const c = document.createElement('canvas');
      c.width = Math.max(1, Math.round(w * s)); c.height = Math.max(1, Math.round(h * s));
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
      a.tex = makeTex();
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, c);
      a.ready = true;
      a.readyAt = performance.now();
      nodes.forEach((n) => { if (n.it.src === it.src) fit(n); });
      kick();
    };
    img.src = asset(it.src);
    preloadBox.appendChild(img);
  });

  /* ---------- Textures des légendes : "(07)" et le titre ---------- */
  const captions = new Map(); // index → { idx, title }
  const FONT_PX = 9;
  function textTex(text, color, dot) {
    const scale = dpr * 1.5;
    const c = document.createElement('canvas');
    const ctx = c.getContext('2d');
    const font = `400 ${FONT_PX * scale}px "JetBrains Mono", monospace`;
    ctx.font = font;
    if ('letterSpacing' in ctx) ctx.letterSpacing = `${0.4 * scale}px`;
    const w = Math.ceil(ctx.measureText(text).width + (dot ? 10 * scale : 0)) + 2;
    c.width = w; c.height = Math.ceil(FONT_PX * 1.6 * scale);
    ctx.font = font;
    if ('letterSpacing' in ctx) ctx.letterSpacing = `${0.4 * scale}px`;
    ctx.textBaseline = 'middle';
    ctx.fillStyle = color;
    ctx.fillText(text, 1, c.height / 2);
    if (dot) { ctx.fillStyle = col.accent; ctx.beginPath(); ctx.arc(w - 4 * scale, c.height / 2, 2 * scale, 0, 7); ctx.fill(); }
    const t = makeTex();
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, c);
    return { tex: t, w: w / scale, h: c.height / scale };
  }
  function buildCaptions() {
    captions.forEach((c) => { gl.deleteTexture(c.idx.tex); gl.deleteTexture(c.title.tex); });
    captions.clear();
    items.forEach((it) => captions.set(it.i, {
      idx: textTex(`(${it.n})`, col.muted, it.web),
      title: textTex(it.title.toUpperCase(), col.ink, false),
    }));
    kick();
  }

  /* ---------- État ---------- */
  let vw, vh, cellW, cellH, boxW, boxH, W, H, nodes = [];
  const s = { x: 0, y: 0, tx: 0, ty: 0, vx: 0, vy: 0, lens: 1, dragging: false, intro: true };
  let running = false, last = 0, loadedAt = 0, hovered = null;

  function fit(n) {
    const r = assets.get(n.it.src).ratio;
    let w = boxW, h = boxW * r;
    if (h > boxH) { h = boxH; w = boxH / r; }
    n.w = w; n.h = h;
    n.cy = n.row * cellH + cellH / 2 + boxH / 2 - h / 2; // posé sur la ligne de base
  }

  function build() {
    vw = innerWidth; vh = innerHeight;
    const small = vw < 760;
    cellW = small ? 170 : 270;
    cellH = small ? 220 : 320;
    boxW = small ? 104 : 160;
    boxH = small ? 136 : 205;

    // tailles du canvas et de la scène (plus grande que l'écran)
    const maxSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
    dpr = Math.min(window.devicePixelRatio || 1, 2, maxSize / (vw * OVER), maxSize / (vh * OVER));
    canvas.width = Math.round(vw * dpr); canvas.height = Math.round(vh * dpr);
    fbW = Math.round(vw * OVER * dpr); fbH = Math.round(vh * OVER * dpr);
    gl.bindTexture(gl.TEXTURE_2D, sceneTex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, fbW, fbH, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, sceneTex, 0);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    const L = items.length;
    const cols = Math.max(Math.ceil((vw * OVER) / cellW) + 3, 7);
    const rows = Math.max(Math.ceil((vh * OVER) / cellH) + 3, Math.ceil(L / cols));
    W = cols * cellW; H = rows * cellH;
    if (!build.done) { s.x = s.tx = -(W - vw) / 2; s.y = s.ty = -(H - vh) / 2; build.done = true; }

    nodes = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const it = items[mod(r * cols + c + r * 7, L)];
        const n = { it, row: r, cx: c * cellW + cellW / 2, a: 0, ha: 0 };
        fit(n);
        // apparition en vague depuis le centre de l'écran
        const px = mod(n.cx + s.x + cellW, W) - cellW, py = mod(n.cy + s.y + cellH, H) - cellH;
        n.delay = 150 + (Math.hypot(px - vw / 2, py - vh / 2) / Math.hypot(vw, vh)) * 1100;
        nodes.push(n);
      }
    }
    readColors();
    buildCaptions();
  }

  /* Position à l'écran (sans déformation) du centre d'un item */
  const screenX = (n) => mod(n.cx + s.x + cellW, W) - cellW;
  const screenY = (n) => mod(n.cy + s.y + cellH, H) - cellH;

  /* ---------- Rendu ---------- */
  function drawRect(x, y, w, h, tex, alpha, color) {
    gl.uniform4f(qU.uRect, x * dpr, y * dpr, w * dpr, h * dpr);
    gl.uniform1f(qU.uAlpha, alpha);
    if (tex) { gl.bindTexture(gl.TEXTURE_2D, tex); gl.uniform1f(qU.uUseTex, 1); }
    else { gl.bindTexture(gl.TEXTURE_2D, blank); gl.uniform1f(qU.uUseTex, 0); gl.uniform3fv(qU.uColor, color); }
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }

  function render(now) {
    // --- passe 1 : la grille, à plat, dans la texture de scène
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.viewport(0, 0, fbW, fbH);
    gl.clearColor(col.bgV[0], col.bgV[1], col.bgV[2], 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.useProgram(quadProg);
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    const aLoc = gl.getAttribLocation(quadProg, 'a');
    gl.enableVertexAttribArray(aLoc);
    gl.vertexAttribPointer(aLoc, 2, gl.FLOAT, false, 0, 0);
    gl.uniform2f(qU.uRes, fbW, fbH);
    gl.activeTexture(gl.TEXTURE0);
    gl.uniform1i(qU.uTex, 0);

    const ox = (vw * (OVER - 1)) / 2, oy = (vh * (OVER - 1)) / 2;
    const sw = vw * OVER, sh = vh * OVER;
    for (const n of nodes) {
      const x = screenX(n) - n.w / 2 + ox, y = screenY(n) - n.h / 2 + oy;
      if (x > sw || y > sh || x + n.w < 0 || y + n.h + 20 < 0) continue;
      const a = assets.get(n.it.src);
      if (n.a < 0.004) continue;
      if (a.ready) drawRect(x, y, n.w, n.h, a.tex, n.a);
      else drawRect(x, y, n.w, n.h, null, n.a * 0.8, col.softV);
      const cap = captions.get(n.it.i);
      if (cap) {
        drawRect(x, y + n.h + 5, cap.idx.w, cap.idx.h, cap.idx.tex, n.a);
        if (n.ha > 0.01) drawRect(x + n.w - cap.title.w, y + n.h + 5 + (1 - n.ha) * 4, cap.title.w, cap.title.h, cap.title.tex, n.ha * n.a);
      }
    }

    // --- passe 2 : la lentille vers l'écran
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.disable(gl.BLEND);
    gl.useProgram(lensProg);
    const aL = gl.getAttribLocation(lensProg, 'a');
    gl.enableVertexAttribArray(aL);
    gl.vertexAttribPointer(aL, 2, gl.FLOAT, false, 0, 0);
    gl.bindTexture(gl.TEXTURE_2D, sceneTex);
    gl.uniform1i(lU.uScene, 0);
    gl.uniform1f(lU.uLens, s.lens);
    const diag = Math.hypot(vw, vh);
    gl.uniform2f(lU.uAspect, vw / diag, vh / diag);
    gl.uniform1f(lU.uOver, OVER);
    gl.uniform3fv(lU.uBg, col.bgV);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }

  /* ---------- Boucle ---------- */
  function kick() {
    if (!running) { running = true; last = performance.now(); requestAnimationFrame(tick); }
  }
  function tick(now) {
    const k = Math.min(4, (now - last) / 16.667);
    last = now;
    let moving = false;

    if (s.dragging) {
      const f = 1 - Math.pow(0.62, k);
      s.x += (s.tx - s.x) * f; s.y += (s.ty - s.y) * f;
      moving = true;
    } else if (Math.abs(s.vx) > 0.02 || Math.abs(s.vy) > 0.02) {
      s.x += s.vx * k; s.y += s.vy * k;
      const fr = Math.pow(0.94, k);
      s.vx *= fr; s.vy *= fr;
      s.tx = s.x; s.ty = s.y;
      moving = true;
    }

    const lensTarget = s.dragging || s.intro ? 1 : 0;
    if (Math.abs(s.lens - lensTarget) > 0.0005) {
      s.lens += (lensTarget - s.lens) * (1 - Math.pow(s.dragging ? 0.87 : 0.955, k));
      moving = true;
    } else s.lens = lensTarget;

    // fondu d'apparition + titre au survol
    const fa = 1 - Math.pow(0.9, k), fh = 1 - Math.pow(0.8, k);
    for (const n of nodes) {
      const a = assets.get(n.it.src);
      const target = loadedAt && now - loadedAt > n.delay ? (a.ready ? 1 : 0.6) : 0;
      if (Math.abs(n.a - target) > 0.003) { n.a += (target - n.a) * fa; moving = true; } else n.a = target;
      const ht = n === hovered ? 1 : 0;
      if (Math.abs(n.ha - ht) > 0.01) { n.ha += (ht - n.ha) * fh; moving = true; } else n.ha = ht;
    }

    render(now);
    if (moving || s.dragging) requestAnimationFrame(tick);
    else running = false;
  }

  // Intro : la grille arrive bombée puis se pose à plat
  const onLoaded = () => { loadedAt = performance.now(); kick(); setTimeout(() => { s.intro = false; kick(); }, 500); };
  document.addEventListener('site:loaded', onLoaded);

  // Changement de thème : nouvelles couleurs et légendes
  new MutationObserver(() => { readColors(); buildCaptions(); }).observe(root, { attributes: true, attributeFilter: ['data-theme'] });
  // La police des légendes peut arriver après le premier rendu
  if (document.fonts) document.fonts.load(`${FONT_PX}px "JetBrains Mono"`).then(() => buildCaptions()).catch(() => {});

  /* ---------- Survol / clic : quel item est sous le curseur ? ---------- */
  function hit(cx, cy) {
    if (s.lens > 0.05) return null; // pendant la déformation on ne vise rien
    for (const n of nodes) {
      const x = screenX(n) - n.w / 2, y = screenY(n) - n.h / 2;
      if (cx >= x && cx <= x + n.w && cy >= y && cy <= y + n.h) return n;
    }
    return null;
  }

  /* ---------- Drag ---------- */
  let downX = 0, downY = 0, lastX = 0, lastY = 0, lastT = 0, moved = false, downNode = null;

  stage.addEventListener('pointerdown', (e) => {
    if (e.button !== 0) return;
    try { stage.setPointerCapture(e.pointerId); } catch (err) {}
    downNode = hit(e.clientX, e.clientY);
    s.dragging = true; moved = false;
    s.vx = s.vy = 0; s.tx = s.x; s.ty = s.y;
    downX = lastX = e.clientX; downY = lastY = e.clientY; lastT = performance.now();
    hovered = null;
    stage.classList.add('grabbing');
    cursor.classList.add('small');
    kick();
  });

  stage.addEventListener('pointermove', (e) => {
    if (!s.dragging) return;
    const now = performance.now();
    const dx = e.clientX - lastX, dy = e.clientY - lastY;
    const dt = Math.max(1, now - lastT);
    s.tx += dx; s.ty += dy;
    s.vx = s.vx * 0.5 + (dx / dt) * 16.667 * 0.5;
    s.vy = s.vy * 0.5 + (dy / dt) * 16.667 * 0.5;
    lastX = e.clientX; lastY = e.clientY; lastT = now;
    if (!moved && Math.hypot(e.clientX - downX, e.clientY - downY) > 6) moved = true;
  });

  const release = (e) => {
    if (!s.dragging) return;
    s.dragging = false;
    stage.classList.remove('grabbing');
    if (performance.now() - lastT > 90) s.vx = s.vy = 0;
    s.vx += (s.tx - s.x) * 0.08; s.vy += (s.ty - s.y) * 0.08;
    const max = 55;
    s.vx = Math.max(-max, Math.min(max, s.vx)); s.vy = Math.max(-max, Math.min(max, s.vy));
    if (!moved && downNode && e.type === 'pointerup') openItem(downNode.it.i);
    updateCursor(e);
    kick();
  };
  stage.addEventListener('pointerup', release);
  stage.addEventListener('pointercancel', release);

  stage.addEventListener('wheel', (e) => {
    e.preventDefault();
    const m = e.deltaMode === 1 ? 16 : 1;
    s.vx -= e.deltaX * m * 0.09; s.vy -= e.deltaY * m * 0.09;
    kick();
  }, { passive: false });

  /* ---------- Curseur ---------- */
  let mx = -200, my = -200, cRaf = 0;
  const placeCursor = () => { cursor.style.transform = `translate3d(${mx}px,${my}px,0)`; cRaf = 0; };
  function updateCursor(e) {
    if (s.dragging) return;
    const overStage = e.target === canvas || e.target === stage;
    const n = overStage ? hit(e.clientX, e.clientY) : null;
    if (n !== hovered) { hovered = n; kick(); }
    cursor.textContent = n ? t('pgOpen') : t('pgDrag');
    cursor.classList.toggle('small', !overStage);
  }
  addEventListener('pointermove', (e) => {
    mx = e.clientX; my = e.clientY;
    if (!cRaf) cRaf = requestAnimationFrame(placeCursor);
    updateCursor(e);
  }, { passive: true });
  document.addEventListener('pointerleave', () => { cursor.classList.add('hide'); hovered = null; kick(); });
  document.addEventListener('pointerenter', () => cursor.classList.remove('hide'));

  /* =========================================================
     FICHE DESIGN : image, mini description, flèches ← →
  ========================================================= */
  const lb = document.getElementById('lb');
  const lbImg = document.getElementById('lbImg');
  const lbText = document.getElementById('lbText');
  const $ = (id) => document.getElementById(id);
  let current = -1, busy = false;

  function fill(it) {
    $('lbCount').innerHTML = `<b>(${it.n})</b> / ${String(items.length).padStart(2, '0')}`;
    $('lbCat').textContent = it.cat;
    $('lbTitle').textContent = it.title;
    $('lbDesc').textContent = it.desc || '';
    $('lbLink').innerHTML = it.web ? `<a class="lb-link ulink" href="${it.href}" data-label="${it.title}">${t('pgView')}</a>` : '';
    lbImg.alt = it.title;
  }
  function preload(i) { const im = new Image(); im.src = asset(items[mod(i, items.length)].src); }

  function openItem(i) {
    current = i;
    const it = items[i];
    fill(it);
    lbImg.src = asset(it.src);
    lb.classList.add('open');
    cursor.classList.add('hide');
    preload(i + 1); preload(i - 1);
  }

  async function go(dir) {
    if (busy || current < 0) return;
    busy = true;
    const next = mod(current + dir, items.length);
    const it = items[next];
    current = next;
    try {
      lbImg.className = dir > 0 ? 'out-l' : 'out-r';
      lbText.classList.add('swap');
      const pre = new Image(); pre.src = asset(it.src);
      const ready = new Promise((r) => { if (pre.complete) r(); else { pre.onload = pre.onerror = r; } });
      const wait = (ms) => new Promise((r) => setTimeout(r, ms));
      await wait(380);
      await Promise.race([ready, wait(1500)]); // on n'attend jamais plus de 1,5 s
      fill(it);
      lbImg.src = pre.src;
      lbImg.className = dir > 0 ? 'in-l' : 'in-r';
      lbImg.getBoundingClientRect();
      lbImg.className = '';
      lbText.classList.remove('swap');
      preload(next + dir);
      await wait(200);
    } finally { busy = false; }
  }

  const closeLb = () => { lb.classList.remove('open'); cursor.classList.remove('hide'); current = -1; };
  lb.querySelector('[data-lb-prev]').addEventListener('click', () => go(-1));
  lb.querySelector('[data-lb-next]').addEventListener('click', () => go(1));
  lb.querySelector('[data-lb-close]').addEventListener('click', closeLb);
  // Swipe sur mobile
  let sx0 = 0, swiped = false;
  lb.addEventListener('pointerdown', (e) => { sx0 = e.clientX; swiped = false; });
  lb.addEventListener('pointerup', (e) => {
    const d = e.clientX - sx0;
    if (Math.abs(d) > 50 && e.pointerType !== 'mouse') { swiped = true; go(d < 0 ? 1 : -1); }
  });
  lb.addEventListener('click', (e) => {
    if (swiped) return;
    if (e.target === lb || e.target.classList.contains('lb-stage')) closeLb();
  });

  addEventListener('keydown', (e) => {
    if (lb.classList.contains('open')) {
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
      if (e.key === 'Escape') closeLb();
      return;
    }
    const v = 14;
    if (e.key === 'ArrowLeft') s.vx += v;
    if (e.key === 'ArrowRight') s.vx -= v;
    if (e.key === 'ArrowUp') s.vy += v;
    if (e.key === 'ArrowDown') s.vy -= v;
    kick();
  });

  let rT;
  addEventListener('resize', () => { clearTimeout(rT); rT = setTimeout(build, 150); });
  build();
  if (root.classList.contains('loaded')) onLoaded();
})();
