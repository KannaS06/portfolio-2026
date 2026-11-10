/* Accueil : deux affichages des projets
   - "slider" : bande horizontale, la carte survolée s'agrandit
   - "grid"   : grille éditoriale
   Le choix est gardé d'une visite à l'autre. */
(() => {
  const root = document.documentElement;
  const home = document.getElementById('home');
  const strip = document.getElementById('strip');
  const list = document.getElementById('homeList');
  const gridList = document.getElementById('gridList');
  const entries = PROJECTS;
  const pad = (i) => String(i + 1).padStart(2, '0');
  const href = (p) => `project.html?id=${p.id}`;
  const year = (p) => (String(p.date).match(/\d{4}/) || [''])[0];

  /* ---------- Layout 1 : la bande ---------- */
  // Le nom du projet n'apparaît qu'une fois : sous la carte. Au-dessus, seulement le type et les infos.
  strip.innerHTML = entries.map((p, i) => `
    <a class="card" href="${href(p)}" data-i="${i}" data-label="${p.name}" data-cursor="view" style="--d:${0.3 + i * 0.12}s">
      <div class="card-info">
        <div class="ci-idx">(${pad(i)})</div>
        <div>${p.type}</div>
        <div class="ci-type">${p.date} · ${p.tools}</div>
      </div>
      <div class="ph"><img src="${thumb(p.cover)}" alt="${p.name}" decoding="async" data-critical></div>
      <span class="num">(${pad(i)})<i> ${p.name}</i></span>
    </a>`).join('');

  list.innerHTML = entries.map((p, i) =>
    `<a class="rv" href="${href(p)}" data-i="${i}" data-label="${p.name}" style="--d:${0.6 + i * 0.06}s">${p.name}</a>`).join('');

  /* ---------- Layout 2 : la grille ---------- */
  gridList.innerHTML = entries.map((p, i) => `
    <a class="hg-item" href="${href(p)}" data-label="${p.name}" data-cursor="view" style="--d:${0.25 + i * 0.1}s">
      <div class="hg-ph"><img src="${thumb(p.cover)}" alt="${p.name}" decoding="async" loading="lazy"></div>
      <div class="hg-meta">
        <span class="accent">(${pad(i)})</span>
        <span><span class="hg-name">${p.name}</span><span class="muted hg-type">${p.type}</span></span>
        <span class="muted">${year(p)}</span>
      </div>
    </a>`).join('');

  /* ---------- Bascule entre les deux ---------- */
  const switchBtns = [...document.querySelectorAll('[data-layout]')];
  let layout = 'slider';
  try { layout = localStorage.getItem('home-layout') === 'grid' ? 'grid' : 'slider'; } catch (e) {}

  function applyLayout(next, animate) {
    const go = () => {
      layout = next;
      home.dataset.layout = next;
      switchBtns.forEach((b) => b.classList.toggle('on', b.dataset.layout === next));
      try { localStorage.setItem('home-layout', next); } catch (e) {}
      scrollTo(0, 0);
      if (window.lenis) window.lenis.scrollTo(0, { immediate: true });
      if (next === 'slider') startActive();
    };
    if (!animate) return go();
    home.classList.add('switching');
    setTimeout(() => { go(); requestAnimationFrame(() => home.classList.remove('switching')); }, 450);
  }
  switchBtns.forEach((b) => b.addEventListener('click', () => b.dataset.layout !== layout && applyLayout(b.dataset.layout, true)));

  /* ---------- Bande : carte active ---------- */
  const cards = [...strip.children];
  const links = [...list.children];
  let active = -1;

  const setActive = (i) => {
    i = (i + entries.length) % entries.length;
    if (i === active) return;
    active = i;
    cards.forEach((c, k) => c.classList.toggle('active', k === i));
    links.forEach((l, k) => l.classList.toggle('active', k === i));
  };

  let start = 0;
  try { start = Math.min(+sessionStorage.getItem('home-active') || 0, entries.length - 1); } catch (e) {}
  // La carte active ne s'agrandit qu'une fois toutes les cartes apparues
  let introDone = false;
  function startActive() {
    if (introDone) return;
    introDone = true;
    if (active < 0) setActive(start);
  }
  const lastDelay = (0.3 + (entries.length - 1) * 0.12 + 0.8) * 1000;
  applyLayout(layout, false);
  if (layout === 'slider') {
    introDone = false;
    if (root.classList.contains('loaded')) startActive();
    else document.addEventListener('site:loaded', () => setTimeout(startActive, lastDelay), { once: true });
  }
  const remember = () => { try { sessionStorage.setItem('home-active', active); } catch (e) {} };

  const desktop = matchMedia('(min-width: 861px)');
  [...cards, ...links].forEach((el) => {
    el.addEventListener('mouseenter', () => desktop.matches && setActive(+el.dataset.i));
    el.addEventListener('focus', () => setActive(+el.dataset.i));
    el.addEventListener('click', remember);
  });

  // Molette / flèches : projet suivant (bande, sur ordinateur)
  let lock = 0;
  addEventListener('wheel', (e) => {
    if (!desktop.matches || layout !== 'slider') return;
    const d = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
    if (Math.abs(d) < 8 || performance.now() < lock) return;
    lock = performance.now() + 520;
    setActive(active + (d > 0 ? 1 : -1));
  }, { passive: true });

  addEventListener('keydown', (e) => {
    if (layout !== 'slider') return;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') setActive(active + 1);
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') setActive(active - 1);
    if (e.key === 'Enter' && document.activeElement === document.body) { remember(); leaveTo(cards[active].href, entries[active].name); }
  });

  // Léger parallaxe de la bande avec la souris (ordinateur)
  if (desktop.matches && matchMedia('(pointer: fine)').matches) {
    let tx = 0, x = 0, raf = 0;
    addEventListener('pointermove', (e) => {
      if (layout !== 'slider') return;
      tx = (e.clientX / innerWidth - 0.5) * -24;
      if (!raf) raf = requestAnimationFrame(function step() {
        x += (tx - x) * 0.07;
        strip.style.transform = `translate3d(${x.toFixed(2)}px,0,0)`;
        raf = Math.abs(tx - x) > 0.05 ? requestAnimationFrame(step) : 0;
      });
    }, { passive: true });
  }

  // Grille : apparition des projets au scroll
  observeReveal([...gridList.children]);
})();
