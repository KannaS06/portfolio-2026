/* ---------------------------------------------------------------
   Langue du site : anglais (par défaut) ou français.
   - Textes fixes des pages et de l'interface : STR ci-dessous.
     Dans le HTML, un élément avec data-i18n="clé" prend ce texte.
   - Textes des projets (type, date, description…) : dans data.js,
     écrits sous la forme { en: '…', fr: '…' }.
   Pour modifier un texte, change-le ici, dans les deux langues.
---------------------------------------------------------------- */
const LANG = (() => {
  let l;
  try { l = localStorage.getItem('lang'); } catch (e) {}
  return l === 'fr' ? 'fr' : 'en';
})();
document.documentElement.lang = LANG;

const STR = {
  // En-tête, commun à toutes les pages
  navAbout: { en: 'About', fr: 'À propos' },
  navContact: { en: 'Contact', fr: 'Contact' },
  back: { en: '(Back)', fr: '(Retour)' },
  langSwitch: { en: 'Passer le site en français', fr: 'Switch to English' },
  themeSwitch: { en: 'Change theme', fr: 'Changer de thème' },

  // Accueil
  titleHome: { en: 'Kaola Abidi — Portfolio', fr: 'Kaola Abidi — Portfolio' },
  homeTagline: { en: '(Graphic &amp; Web Design)', fr: '(Design graphique &amp; web)' },
  homeIntro: {
    en: '<span class="accent">(Selected works)</span><br>Graphic &amp; web design student, ©2026',
    fr: '<span class="accent">(Projets choisis)</span><br>Études en design graphique &amp; web, ©2026',
  },
  homeStatement: {
    en: 'Minimal, intentional <em>digital identities</em> — between branding, editorial and the web.',
    fr: 'Des <em>identités numériques</em> minimalistes et réfléchies — entre branding, édition et web.',
  },
  homeProjects: { en: 'Projects', fr: 'Projets' },
  openTo: { en: 'Open to internships<br>&amp; work-study', fr: 'À la recherche d’un stage<br>ou d’une alternance' },

  // À propos
  titleAbout: { en: 'About — Kaola Abidi', fr: 'À propos — Kaola Abidi' },
  abKicker: {
    en: '<span class="accent">(About)</span><span class="muted">Graphic &amp; web design student — MMI</span>',
    fr: '<span class="accent">(À propos)</span><span class="muted">Études en design graphique &amp; web — MMI</span>',
  },
  abStatement: {
    en: 'I explore how to blend functionality and artistic direction to craft <span class="serif accent">meaningful digital identities</span> — guided by minimalism and a desire for creative independence.',
    fr: 'J’explore comment allier fonctionnalité et direction artistique pour créer des <span class="serif accent">identités numériques qui ont du sens</span> — avec le minimalisme pour boussole et l’envie d’une vraie indépendance créative.',
  },
  abProfileLabel: { en: '(01) Profile', fr: '(01) Profil' },
  abProfile: {
    en: 'I am a graphic and web design student passionate about visual creation, branding and user experience. As an aspiring freelance designer, I’m building my path with curiosity, autonomy and intention.',
    fr: 'J’étudie le design graphique et web, avec une passion pour la création visuelle, le branding et l’expérience utilisateur. Je construis mon parcours vers le freelance avec curiosité, autonomie et intention.',
  },
  abNowLabel: { en: '(02) Currently', fr: '(02) Actuellement' },
  abNow: {
    en: 'Looking for an <span class="accent">internship</span> or a <span class="accent">work-study program</span>.',
    fr: 'À la recherche d’un <span class="accent">stage</span> ou d’une <span class="accent">alternance</span>.',
  },
  abToolsLabel: { en: '(03) Toolkit', fr: '(03) Outils' },
  abInterestsLabel: { en: '(04) Interests', fr: '(04) Centres d’intérêt' },
  abFashion: { en: 'Fashion', fr: 'Mode' },
  abAnime: { en: 'Anime', fr: 'Anime' },
  abMusic: { en: 'Music', fr: 'Musique' },
  abGames: { en: 'Games', fr: 'Jeux vidéo' },
  abContactLabel: { en: '(05) Contact', fr: '(05) Contact' },
  abCv: { en: 'Resume (PDF) <span>↗</span>', fr: 'CV (PDF) <span>↗</span>' },

  // Page projet
  pDate: { en: 'Date', fr: 'Date' },
  pTools: { en: 'Tools', fr: 'Outils' },
  pType: { en: 'Type', fr: 'Type' },
  pVisit: { en: 'Visit the website ↗', fr: 'Voir le site ↗' },
  pScreens: { en: 'screens', fr: 'écrans' },
  pPrev: { en: '← Previous', fr: '← Précédent' },
  pNext: { en: 'Next →', fr: 'Suivant →' },

  // Playground
  titlePlayground: { en: 'Playground — Kaola Abidi', fr: 'Playground — Kaola Abidi' },
  pgHint: {
    en: '<b>(Drag)</b> to explore — <b>(Click)</b> to open',
    fr: '<b>(Glisser)</b> pour explorer — <b>(Cliquer)</b> pour ouvrir',
  },
  pgStage: { en: 'Playground — drag to explore', fr: 'Playground — glisser pour explorer' },
  pgDrag: { en: 'Drag', fr: 'Glisser' },
  pgOpen: { en: 'Open', fr: 'Ouvrir' },
  pgWorks: { en: 'works', fr: 'projets' },
  pgWebsite: { en: 'Website', fr: 'Site web' },
  pgView: { en: 'View project →', fr: 'Voir le projet →' },
  pgNoWebgl: { en: 'WebGL is not available on this browser.', fr: 'WebGL n’est pas disponible sur ce navigateur.' },
  lbPreview: { en: 'Preview', fr: 'Aperçu' },
  lbPrev: { en: 'Previous design', fr: 'Design précédent' },
  lbNext: { en: 'Next design', fr: 'Design suivant' },
  close: { en: '(Close)', fr: '(Fermer)' },

  // Panneau contact
  cpTitle: { en: 'Let’s <span>connect</span>', fr: 'Prenons <span>contact</span>' },
  cpPhone: { en: 'Phone', fr: 'Téléphone' },
  cpResume: { en: 'Resume', fr: 'CV' },
  cpDownload: { en: 'Download PDF ↗', fr: 'Télécharger le PDF ↗' },
  cpCopied: { en: 'Copied', fr: 'Copié' },
  cpOpen: { en: 'Open to internships & work-study', fr: 'À la recherche d’un stage ou d’une alternance' },
};

// Texte d'interface par sa clé
const t = (key) => (STR[key] ? STR[key][LANG] : key);

// Remplace chaque { en, fr } d'un objet (ou d'une liste) par la bonne langue
const localize = (o) => {
  for (const k in o) {
    const v = o[k];
    if (v && typeof v === 'object') o[k] = 'en' in v && 'fr' in v ? v[LANG] : localize(v);
  }
  return o;
};

// Textes fixes des pages
document.querySelectorAll('[data-i18n]').forEach((el) => { el.innerHTML = t(el.dataset.i18n); });
document.querySelectorAll('[data-i18n-aria]').forEach((el) => el.setAttribute('aria-label', t(el.dataset.i18nAria)));
