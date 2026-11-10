/* Éléments communs : loading screen, transitions, thème, contact, apparitions */
(() => {
  const root = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* =========================================================
     LOADING SCREEN (même design que l'ancien portfolio)
     La barre suit le vrai chargement des images de la page :
     rapide si tout est en cache, plus lent si beaucoup à charger.
  ========================================================= */
  // Le loader est écrit directement dans chaque page (visible dès le premier affichage).
  // En venant d'une autre page du site (classe from-nav), il ne rejoue pas son entrée.
  let loader = document.querySelector('.loader');
  if (!loader) {
    loader = document.createElement('div');
    loader.className = 'loader';
    loader.setAttribute('aria-hidden', 'true');
    loader.innerHTML = `<div class="ld-inner"><span class="ld-logo">Kaola Abidi</span><div class="ld-track"><div class="ld-fill" data-ld-bar></div></div></div>`;
    document.body.prepend(loader);
  }
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
    // la page suivante saura qu'on arrive par le rideau : pas de deuxième apparition
    try { sessionStorage.setItem('nav', '1'); } catch (e) {}
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
  window.lenis = lenis;

  /* =========================================================
     THÈME
  ========================================================= */
  const toggle = document.createElement('button');
  toggle.className = 'theme-toggle';
  toggle.setAttribute('aria-label', t('themeSwitch'));
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
     LANGUE : affiche l'autre langue ("FR" quand le site est en anglais).
     Au clic, le rideau passe et la page revient dans la nouvelle langue.
  ========================================================= */
  const other = LANG === 'en' ? 'fr' : 'en';
  const langBtn = document.createElement('button');
  langBtn.className = 'lang-toggle';
  langBtn.lang = other;
  langBtn.textContent = other.toUpperCase();
  langBtn.setAttribute('aria-label', t('langSwitch'));
  document.body.appendChild(langBtn);
  langBtn.addEventListener('click', () => {
    try { localStorage.setItem('lang', other); } catch (e) {}
    leaveTo(location.href.split('#')[0]); // sans #ancre, sinon la page ne se recharge pas
  });

  /* =========================================================
     CONTACT
  ========================================================= */
  const panel = document.createElement('div');
  panel.className = 'contact-panel';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-label', 'Contact');
  panel.innerHTML = `
    <div class="cp-top"><span>Kaola Abidi</span><button class="ulink" data-close>${t('close')}</button></div>
    <div class="cp-body">
      <div class="cp-info">
        <h2>${t('cpTitle')}</h2>
        <dl class="cp-list">
          <dt>Email</dt><dd><button class="cp-copy ulink" data-copy="${CONTACT.email}">${CONTACT.email}<span class="copied">${t('cpCopied')}</span></button></dd>
          <dt>${t('cpPhone')}</dt><dd><a class="ulink" href="${CONTACT.phoneHref}">${CONTACT.phone}</a></dd>
          <dt>Linkedin</dt><dd><a class="ulink" href="${CONTACT.linkedin}" target="_blank" rel="noopener">/in/kaola-abidi ↗</a></dd>
          <dt>${t('cpResume')}</dt><dd><a class="ulink" href="${asset(CONTACT.cv)}" target="_blank" rel="noopener">${t('cpDownload')}</a></dd>
        </dl>
      </div>
      <form class="cp-form" novalidate>
        <label class="cp-field"><span>${t('cfName')}</span><input name="name" type="text" autocomplete="name" required></label>
        <label class="cp-field"><span>Email</span><input name="email" type="email" autocomplete="email" required></label>
        <label class="cp-field"><span>${t('cfMessage')}</span><textarea name="message" rows="4" required></textarea></label>
        <input type="text" name="_honey" class="cp-honey" tabindex="-1" autocomplete="off" aria-hidden="true">
        <div class="cp-send">
          <button type="submit" class="cp-submit">${t('cfSend')} <span>↗</span></button>
          <span class="cp-status" role="status" aria-live="polite"></span>
        </div>
      </form>
    </div>
    <div class="cp-bottom"><span>${t('cpOpen')}</span><span>©2026</span></div>`;
  document.body.appendChild(panel);

  const openContact = () => { panel.classList.add('open'); if (lenis) lenis.stop(); };
  const closeContact = () => { panel.classList.remove('open'); if (lenis) lenis.start(); };
  document.querySelectorAll('[data-contact]').forEach((b) => b.addEventListener('click', openContact));
  panel.querySelector('[data-close]').addEventListener('click', closeContact);
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && panel.classList.contains('open')) closeContact(); });

  // Formulaire : envoi via FormSubmit (le message arrive par email, sans compte).
  // Au tout premier envoi, FormSubmit envoie un email de confirmation à activer.
  const form = panel.querySelector('.cp-form');
  const status = form.querySelector('.cp-status');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    if (fd.get('_honey')) return; // robot
    const name = String(fd.get('name') || '').trim();
    const email = String(fd.get('email') || '').trim();
    const message = String(fd.get('message') || '').trim();
    form.querySelectorAll('.cp-field').forEach((f) => f.classList.remove('err'));
    const bad = [];
    if (!name) bad.push('name');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) bad.push('email');
    if (!message) bad.push('message');
    if (bad.length) {
      bad.forEach((n) => form.querySelector(`[name="${n}"]`).closest('.cp-field').classList.add('err'));
      status.textContent = t('cfCheck');
      return;
    }
    form.classList.add('sending');
    status.textContent = t('cfSending');
    try {
      const r = await fetch(`https://formsubmit.co/ajax/${CONTACT.email}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ name, email, message, _subject: `Portfolio — ${name}`, _template: 'table', _captcha: 'false' }),
      });
      const data = await r.json().catch(() => ({}));
      if (!r.ok || String(data.success) === 'false') throw new Error(data.message || r.status);
      form.reset();
      form.classList.add('sent');
      status.textContent = t('cfSent');
    } catch (err) {
      status.innerHTML = `${t('cfError')} <a class="ulink" href="mailto:${CONTACT.email}">${CONTACT.email}</a>`;
    } finally {
      form.classList.remove('sending');
    }
  });

  const copyBtn = panel.querySelector('[data-copy]');
  copyBtn.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(copyBtn.dataset.copy); }
    catch (e) { location.href = 'mailto:' + copyBtn.dataset.copy; return; }
    copyBtn.classList.add('done');
    setTimeout(() => copyBtn.classList.remove('done'), 1600);
  });

  /* =========================================================
     CURSEUR PERSONNALISÉ (ordinateur uniquement)
     Un point + un anneau lila qui suit avec un léger retard.
     - sur un lien ou un bouton : l'anneau grossit
     - sur un élément data-cursor="view" : bulle lila "View"
     Le playground garde son propre curseur "Drag".
  ========================================================= */
  if (matchMedia('(hover: hover) and (pointer: fine)').matches && !document.getElementById('cursor')) {
    const dot = document.createElement('div');
    const ring = document.createElement('div');
    dot.className = 'c-dot';
    ring.className = 'c-ring';
    ring.innerHTML = `<span>${t('cursorView')}</span>`;
    document.body.append(ring, dot);
    root.classList.add('has-cursor');

    let mx = -100, my = -100, rx = -100, ry = -100, moving = false;
    const step = () => {
      rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
      ring.style.transform = `translate3d(${rx.toFixed(1)}px,${ry.toFixed(1)}px,0)`;
      if (Math.abs(mx - rx) + Math.abs(my - ry) > 0.3) requestAnimationFrame(step); else moving = false;
    };
    addEventListener('pointermove', (e) => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = `translate3d(${mx}px,${my}px,0)`;
      root.classList.remove('c-out');
      if (!moving) { moving = true; requestAnimationFrame(step); }
      const el = e.target.closest ? e.target : null;
      const view = el && el.closest('[data-cursor="view"]');
      const link = el && el.closest('a, button, [role="button"], label');
      const text = el && el.closest('input, textarea, select');
      ring.classList.toggle('is-view', !!view);
      ring.classList.toggle('is-link', !view && !!link);
      root.classList.toggle('c-text', !!text);
    }, { passive: true });
    document.addEventListener('pointerleave', () => root.classList.add('c-out'));
    addEventListener('pointerdown', () => ring.classList.add('is-down'));
    addEventListener('pointerup', () => ring.classList.remove('is-down'));
  }

  /* =========================================================
     MUSIQUE DE FOND : mini playlist (bouton rond à côté du thème)
     Les morceaux sont listés dans data.js (MUSIC). La lecture
     continue d'une page à l'autre (position gardée en mémoire).
  ========================================================= */
  const tracks = (typeof MUSIC !== 'undefined' ? MUSIC : []).filter((m) => m && m.src);
  if (tracks.length) {
    const audio = new Audio();
    audio.preload = 'metadata';
    let idx = 0, wantPlay = false, started = false;
    let saved = null;
    try { saved = JSON.parse(sessionStorage.getItem('music') || 'null'); } catch (e) {}
    if (saved && saved.i < tracks.length) idx = saved.i;

    const btn = document.createElement('button');
    btn.className = 'music-toggle';
    btn.setAttribute('aria-label', t('musicOpen'));
    btn.setAttribute('aria-expanded', 'false');
    btn.innerHTML = '<span class="eq"><i></i><i></i><i></i><i></i></span>';
    const pop = document.createElement('div');
    pop.className = 'music-pop';
    pop.innerHTML = `
      <div class="mp-top"><span class="accent">${t('musicNow')}</span><span class="mp-count"></span></div>
      <div class="mp-title"></div>
      <div class="mp-artist muted"></div>
      <div class="mp-bar"><i></i></div>
      <div class="mp-ctrl">
        <button data-m="prev" aria-label="${t('musicPrev')}">←</button>
        <button data-m="play" class="mp-play"></button>
        <button data-m="next" aria-label="${t('musicNext')}">→</button>
      </div>
      <ol class="mp-list">${tracks.map((m, i) => `<li><button data-m="pick" data-i="${i}"><span>${String(i + 1).padStart(2, '0')}</span>${m.title}</button></li>`).join('')}</ol>`;
    document.body.append(btn, pop);
    root.classList.add('has-music');

    const $m = (s) => pop.querySelector(s);
    const render = () => {
      const m = tracks[idx];
      $m('.mp-title').textContent = m.title;
      $m('.mp-artist').textContent = m.artist || '';
      $m('.mp-count').textContent = `${String(idx + 1).padStart(2, '0')} / ${String(tracks.length).padStart(2, '0')}`;
      $m('.mp-play').textContent = audio.paused ? t('musicPlay') : t('musicPause');
      btn.classList.toggle('playing', !audio.paused);
      pop.querySelectorAll('[data-m="pick"]').forEach((b) => b.classList.toggle('on', +b.dataset.i === idx));
    };
    const save = () => { try { sessionStorage.setItem('music', JSON.stringify({ i: idx, t: audio.currentTime || 0, p: wantPlay })); } catch (e) {} };
    const load = (i, time) => {
      idx = (i + tracks.length) % tracks.length;
      audio.src = asset(tracks[idx].src);
      if (time) audio.addEventListener('loadedmetadata', () => { audio.currentTime = Math.min(time, audio.duration - 1 || time); }, { once: true });
      render();
    };
    const play = () => { wantPlay = true; started = true; audio.volume = 0.6; return audio.play().then(render).catch(() => { render(); }); };
    const pause = () => { wantPlay = false; audio.pause(); render(); save(); };

    load(idx, saved && saved.t);
    // Reprise automatique si la musique jouait sur la page précédente.
    // Les navigateurs exigent parfois un clic : on reprend alors au premier geste.
    if (saved) started = true; // déjà lancée sur une autre page : on ne relance pas toute seule
    if (saved && saved.p) {
      wantPlay = true;
      audio.play().then(render).catch(() => {
        const resume = () => { if (wantPlay && audio.paused) audio.play().then(render).catch(() => {}); };
        addEventListener('pointerdown', resume, { once: true });
        addEventListener('keydown', resume, { once: true });
      });
    }

    btn.addEventListener('click', () => {
      const open = !pop.classList.contains('open');
      pop.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', String(open));
      if (open && !started) play(); // tout premier clic = lance la musique
    });
    pop.addEventListener('click', (e) => {
      const b = e.target.closest('[data-m]');
      if (!b) return;
      const a = b.dataset.m;
      if (a === 'play') audio.paused ? play() : pause();
      if (a === 'next') { load(idx + 1); play(); }
      if (a === 'prev') { audio.currentTime > 3 ? (audio.currentTime = 0) : load(idx - 1); play(); }
      if (a === 'pick') { load(+b.dataset.i); play(); }
    });
    document.addEventListener('click', (e) => {
      if (pop.classList.contains('open') && !pop.contains(e.target) && !btn.contains(e.target)) {
        pop.classList.remove('open'); btn.setAttribute('aria-expanded', 'false');
      }
    });
    audio.addEventListener('ended', () => { load(idx + 1); play(); });
    audio.addEventListener('timeupdate', () => {
      if (audio.duration) $m('.mp-bar i').style.transform = `scaleX(${audio.currentTime / audio.duration})`;
    });
    audio.addEventListener('play', render);
    audio.addEventListener('pause', render);
    addEventListener('pagehide', save);
    setInterval(save, 2000);
  }

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
