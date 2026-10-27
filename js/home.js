/* Accueil : bande de 6 projets, la carte survolée s'agrandit */
(() => {
  const strip = document.getElementById('strip');
  const list = document.getElementById('homeList');
  const entries = [...PROJECTS, PLAYGROUND_ENTRY];
  const pad = (i) => String(i + 1).padStart(2, '0');
  const href = (p) => p.href || `project.html?id=${p.id}`;

  strip.innerHTML = entries.map((p, i) => `
    <a class="card" href="${href(p)}" data-i="${i}" data-label="${p.name}" style="--d:${0.3 + i * 0.12}s">
      <div class="card-info">
        <div class="ci-idx">(${pad(i)})</div>
        <div>${p.name} — ${p.type},</div>
        <div class="ci-type">${p.date}${p.tools ? ' · ' + p.tools : ''}</div>
      </div>
      <div class="ph"><img src="${asset(p.cover)}" alt="${p.name}" decoding="async" data-critical></div>
      <span class="num">(${pad(i)})<i> ${p.name}</i></span>
    </a>`).join('');

  list.innerHTML = entries.map((p, i) =>
    `<a class="rv" href="${href(p)}" data-i="${i}" data-label="${p.name}" style="--d:${0.6 + i * 0.06}s">${p.name}</a>`).join('');

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
  try { start = +sessionStorage.getItem('home-active') || 0; } catch (e) {}
  // La carte active ne s'agrandit qu'une fois toutes les cartes apparues
  let introDone = false;
  const startActive = () => {
    if (introDone) return;
    introDone = true;
    if (active < 0) setActive(start);
  };
  const lastDelay = (0.3 + (entries.length - 1) * 0.12 + 0.8) * 1000;
  if (document.documentElement.classList.contains('loaded')) startActive();
  else document.addEventListener('site:loaded', () => setTimeout(startActive, lastDelay), { once: true });
  const remember = () => { try { sessionStorage.setItem('home-active', active); } catch (e) {} };

  const desktop = matchMedia('(min-width: 861px)');
  [...cards, ...links].forEach((el) => {
    el.addEventListener('mouseenter', () => desktop.matches && setActive(+el.dataset.i));
    el.addEventListener('focus', () => setActive(+el.dataset.i));
    el.addEventListener('click', remember);
  });

  // Molette / flèches : projet suivant
  let lock = 0;
  addEventListener('wheel', (e) => {
    if (!desktop.matches) return;
    const d = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
    if (Math.abs(d) < 8 || performance.now() < lock) return;
    lock = performance.now() + 520;
    setActive(active + (d > 0 ? 1 : -1));
  }, { passive: true });

  addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') setActive(active + 1);
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') setActive(active - 1);
    if (e.key === 'Enter' && document.activeElement === document.body) { remember(); leaveTo(cards[active].href, entries[active].name); }
  });

  // Léger parallaxe de la bande avec la souris (desktop)
  if (desktop.matches && matchMedia('(pointer: fine)').matches) {
    let tx = 0, x = 0, raf = 0;
    addEventListener('pointermove', (e) => {
      tx = (e.clientX / innerWidth - 0.5) * -24;
      if (!raf) raf = requestAnimationFrame(function step() {
        x += (tx - x) * 0.07;
        strip.style.transform = `translate3d(${x.toFixed(2)}px,0,0)`;
        raf = Math.abs(tx - x) > 0.05 ? requestAnimationFrame(step) : 0;
      });
    }, { passive: true });
  }
})();
