/* Éléments communs : loading screen, transitions, thème, contact, apparitions */
(() => {
  const root = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* =========================================================
     LOADING SCREEN (même design que l'ancien portfolio)
     La barre suit le vrai chargement des images de la page :
     rapide si tout est en cache, plus lent si beaucoup à charger.
  ========================================================= */
  const loader = document.createElement('div');
  loader.className = 'loader';
  loader.innerHTML = `<div class="ld-inner"><span class="ld-logo">Kaola Abidi</span><div class="ld-track"><div class="ld-fill" data-ld-bar></div></div></div>`;
  document.body.prepend(loader);
  const barEl = loader.querySelector('[data-ld-bar]');
  const innerEl = loader.querySelector('.ld-inner');

  let target = 0, shown = 0, finished = false;
  const startT = performance.now();

  function trackImages() {
    // Images marquées "critical" par la page, sinon les images non-lazy (max 24)
    let imgs = [...document.querySelectorAll('img[data-critical]')];
    if (!imgs.length) imgs = [...document.images].filter((i) => i.loading !== 'lazy' && i.getAttribute('src')).slice(0, 24);
    imgs = imgs.filter((i) => i.getAttribute('src'));
    const total = imgs.length + 1; // +1 = polices
    let done = 0;
    const bump = () => { done++; target = done / total; };
    imgs.forEach((img) => {
      if (img.complete) bump();
      else { img.addEventListener('load', bump, { once: true }); img.addEventListener('error', bump, { once: true }); }
    });
    (document.fonts ? document.fonts.ready : Promise.resolve()).then(bump);
    setTimeout(() => { target = 1; }, 9000); // sécurité réseau lent
  }

  function loop() {
    // la barre suit la progression réelle (la transition CSS l'adoucit)
    if (target > shown) { shown = target; barEl.style.transform = `scaleX(${shown})`; }
    // minimum 800 ms pour que l'animation soit visible, comme avant
    if (target >= 1 && performance.now() - startT > 800) return finish();
    setTimeout(loop, 50); // timer : continue même si l'onglet est en arrière-plan
  }

  function finish() {
    if (finished) return;
    finished = true;
    barEl.style.transform = 'scaleX(1)';
    // petite pause à 100 %, puis le loader glisse vers le haut
    setTimeout(() => {
      loader.classList.add('done');
      root.classList.add('loaded');
      document.dispatchEvent(new Event('site:loaded'));
    }, 400);
  }

  if (reduce) { target = shown = 1; finish(); }
  else document.addEventListener('DOMContentLoaded', () => { trackImages(); loop(); });

  // Retour arrière (cache navigateur) : pas de loader bloqué
  addEventListener('pageshow', (e) => {
    if (e.persisted) { loader.classList.remove('below'); loader.classList.add('done'); root.classList.add('loaded'); }
  });

  /* ---------- Transition de sortie : le rideau monte, puis on change de page ---------- */
  // Tout lien vers un autre site (ou le CV) s'ouvre dans un nouvel onglet
  const isExternal = (a) => {
    try { const u = new URL(a.href, location.href); return /^https?:$/.test(u.protocol) && (u.origin !== location.origin || /\.pdf$/i.test(u.pathname)); }
    catch (err) { return false; }
  };
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a');
    if (a && isExternal(a)) { a.target = '_blank'; a.rel = 'noopener'; return; }
    if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (a.target === '_blank' || a.hasAttribute('download')) return;
    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin || /^(mailto|tel):/.test(a.href)) return;
    if (url.pathname === location.pathname && url.search === location.search) { e.preventDefault(); return; }
    e.preventDefault();
    leaveTo(url.href, a.dataset.label);
  });

  function leaveTo(href, label) {
    if (reduce) return (location.href = href);
    barEl.style.transition = 'none';
    barEl.style.transform = 'scaleX(0)';
    innerEl.style.animation = 'none';
    loader.classList.remove('done');
    loader.classList.add('below');
    loader.getBoundingClientRect(); // force le point de départ
    loader.classList.remove('below');
    innerEl.style.animation = '';
    barEl.style.transition = '';
    setTimeout(() => (location.href = href), 750);
  }
  window.leaveTo = leaveTo;

  /* =========================================================
     SMOOTH SCROLL (Lenis, pages qui défilent uniquement)
  ========================================================= */
  let lenis = null;
  if (window.Lenis && !reduce) {
    lenis = new Lenis({ duration: 1.25, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });
    const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
    // pas de scroll pendant le loading screen
    if (!root.classList.contains('loaded')) { lenis.stop(); document.addEventListener('site:loaded', () => lenis.start(), { once: true }); }
    addEventListener('pageshow', (e) => { if (e.persisted) lenis.start(); });
  }

  /* =========================================================
     THÈME
  ========================================================= */
  const toggle = document.createElement('button');
  toggle.className = 'theme-toggle';
  toggle.setAttribute('aria-label', 'Changer de thème');
  toggle.innerHTML = '<span></span>';
  document.body.appendChild(toggle);

  const setTheme = (t) => {
    root.dataset.theme = t;
    try { localStorage.setItem('theme', t); } catch (e) {}
  };
  toggle.addEventListener('click', () => {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    if (!document.startViewTransition || reduce) return setTheme(next);
    const r = toggle.getBoundingClientRect();
    const x = r.left + r.width / 2, y = r.top + r.height / 2;
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    root.classList.add('theme-tr');
    const tr = document.startViewTransition(() => setTheme(next));
    tr.ready.then(() => {
      root.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration: 900, easing: 'cubic-bezier(.7,0,.2,1)', pseudoElement: '::view-transition-new(root)' }
      );
    }).catch(() => {});
    tr.finished.catch(() => {}).finally(() => root.classList.remove('theme-tr'));
  });

  /* =========================================================
     CONTACT
  ========================================================= */
  const panel = document.createElement('div');
  panel.className = 'contact-panel';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-label', 'Contact');
  panel.innerHTML = `
    <div class="cp-top"><span>Kaola Abidi</span><button class="ulink" data-close>(Close)</button></div>
    <div class="cp-body">
      <h2>Let's <span>connect</span></h2>
      <dl class="cp-list">
        <dt>Email</dt><dd><button class="cp-copy ulink" data-copy="${CONTACT.email}">${CONTACT.email}<span class="copied">Copied</span></button></dd>
        <dt>Phone</dt><dd><a class="ulink" href="${CONTACT.phoneHref}">${CONTACT.phone}</a></dd>
        <dt>Linkedin</dt><dd><a class="ulink" href="${CONTACT.linkedin}" target="_blank" rel="noopener">/in/kaola-abidi ↗</a></dd>
        <dt>Resume</dt><dd><a class="ulink" href="${asset(CONTACT.cv)}" target="_blank" rel="noopener">Download PDF ↗</a></dd>
      </dl>
    </div>
    <div class="cp-bottom"><span>Open to internships & work-study</span><span>©2026</span></div>`;
  document.body.appendChild(panel);

  const openContact = () => { panel.classList.add('open'); if (lenis) lenis.stop(); };
  const closeContact = () => { panel.classList.remove('open'); if (lenis) lenis.start(); };
  document.querySelectorAll('[data-contact]').forEach((b) => b.addEventListener('click', openContact));
  panel.querySelector('[data-close]').addEventListener('click', closeContact);
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && panel.classList.contains('open')) closeContact(); });

  const copyBtn = panel.querySelector('[data-copy]');
  copyBtn.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(copyBtn.dataset.copy); }
    catch (e) { location.href = 'mailto:' + copyBtn.dataset.copy; return; }
    copyBtn.classList.add('done');
    setTimeout(() => copyBtn.classList.remove('done'), 1600);
  });

  /* =========================================================
     UTILITAIRES D'ANIMATION
  ========================================================= */
  // Découpe un titre en lettres pour une apparition lettre par lettre
  window.splitChars = (el) => {
    const text = el.textContent;
    el.setAttribute('aria-label', text);
    el.classList.add('split');
    // lettres regroupées par mot : un mot ne peut jamais être coupé en deux
    let i = 0;
    el.innerHTML = text.split(' ').map((word) =>
      `<span class="w" aria-hidden="true">${[...word].map((c) => `<span class="ch" style="--i:${i++}">${c}</span>`).join('')}</span>`
    ).join(' ');
  };
  document.querySelectorAll('[data-split]').forEach(splitChars);

  // Titre trop long pour sa colonne : on réduit la taille au lieu de le couper
  const fitEls = [...document.querySelectorAll('[data-fit]')];
  const fitAll = () => fitEls.forEach((el) => {
    el.style.fontSize = '';
    let size = parseFloat(getComputedStyle(el).fontSize);
    const max = el.parentElement.clientWidth;
    while (el.scrollWidth > max + 1 && size > 24) { size *= 0.95; el.style.fontSize = size + 'px'; }
  });
  if (fitEls.length) {
    fitEls.forEach((el) => { el.style.display = 'inline-block'; el.style.whiteSpace = 'nowrap'; });
    fitAll();
    if (document.fonts) document.fonts.ready.then(fitAll);
    addEventListener('resize', fitAll);
  }

  window.observeReveal = (els) => {
    if (!('IntersectionObserver' in window)) return els.forEach((e) => e.classList.add('in'));
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    // on attend la fin du loader pour que les premières apparitions se voient
    const go = () => els.forEach((e) => io.observe(e));
    root.classList.contains('loaded') ? go() : document.addEventListener('site:loaded', go, { once: true });
  };
  observeReveal([...document.querySelectorAll('.reveal')]);
})();
