/* Page projet générée depuis data.js (project.html?id=essences) */
(() => {
  const id = new URLSearchParams(location.search).get('id');
  let i = PROJECTS.findIndex((p) => p.id === id);
  if (i < 0) i = 0;
  const p = PROJECTS[i];
  const pad = (n) => String(n + 1).padStart(2, '0');
  // Les 2 premières images comptent dans le loader, les autres chargent au scroll.
  // Les .mp4 (anciens GIF) : vidéo muette en boucle, chargée seulement quand elle approche de l'écran.
  const img = (src, alt, critical) => isVideo(src)
    ? `<video data-src="${asset(src)}" poster="${asset(src.replace(/\.mp4$/i, '.webp'))}" muted loop playsinline preload="none" aria-label="${alt}"></video>`
    : `<img src="${asset(src)}" alt="${alt}" decoding="async" ${critical ? 'data-critical' : 'loading="lazy"'}>`;

  document.title = `${p.name} — Kaola Abidi`;
  document.body.dataset.page = p.name;

  document.getElementById('project').innerHTML = `
    <aside class="p-side">
      <div class="p-index rv" style="--d:.3s">(${pad(i)}) — ${p.type}</div>
      <h1 class="p-title" data-split data-fit style="--d:.35s">${p.name}</h1>
      <p class="p-desc fd" style="--d:.8s">${p.desc}</p>
      <dl class="p-meta rv" style="--d:1s">
        <dt>${t('pDate')}</dt><dd>${p.date}</dd>
        <dt>${t('pTools')}</dt><dd>${p.tools}</dd>
        <dt>${t('pType')}</dt><dd>${p.type}</dd>
      </dl>
      ${p.url ? `<a class="p-visit ulink rv" style="--d:1.1s" href="${p.url}" target="_blank" rel="noopener">${t('pVisit')}</a>` : ''}
    </aside>
    <section class="p-media">
      <figure class="p-hero reveal">${img(p.hero || p.cover, p.name, true)}</figure>
      ${p.desktop.map((s, k) => `<figure class="reveal">${img(s, `${p.name} — desktop ${k + 1}`, k === 0)}</figure>`).join('')}
      <div class="p-label reveal"><span>(Responsive)</span></div>
      <div class="p-mobiles">
        ${p.mobile.map((s, k) => `<figure class="reveal" style="transition-delay:${k * 110}ms">${img(s, `${p.name} — mobile ${k + 1}`)}</figure>`).join('')}
      </div>
    </section>`;

  // Vidéos : on charge et on lance quand elles arrivent à l'écran, on met en pause en dehors
  const videos = [...document.querySelectorAll('.p-media video')];
  if ('IntersectionObserver' in window) {
    const vio = new IntersectionObserver((entries) => entries.forEach(({ target: v, isIntersecting }) => {
      if (isIntersecting) {
        if (!v.src) v.src = v.dataset.src;
        v.play().catch(() => {});
      } else if (v.src) v.pause();
    }), { rootMargin: '300px 0px' });
    videos.forEach((v) => vio.observe(v));
  } else videos.forEach((v) => { v.src = v.dataset.src; v.autoplay = true; });

  const prev = PROJECTS[(i - 1 + PROJECTS.length) % PROJECTS.length];
  const next = PROJECTS[(i + 1) % PROJECTS.length];
  document.getElementById('pnav').innerHTML = `
    <a class="reveal" href="project.html?id=${prev.id}" data-label="${prev.name}"><span class="muted">${t('pPrev')}</span><span class="big">${prev.name}</span></a>
    <a class="reveal" href="project.html?id=${next.id}" data-label="${next.name}"><span class="muted">${t('pNext')}</span><span class="big">${next.name}</span></a>`;
})();
