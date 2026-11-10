/* ---------------------------------------------------------------
   Contenu du portfolio.
   Images : toutes dans le dossier assets/ (WebP compressé).
   - asset('x.webp')  -> image pleine taille (pages projets, fiches)
   - thumb('x.webp')  -> petite version (accueil, grille du playground)
   - un fichier .mp4 est affiché comme une vidéo en boucle (ex-GIF)
   Pour ajouter une image : mets-la en WebP dans assets/ (max ~2000 px)
   et sa petite version dans assets/thumbs/ (max ~720 px).

   Textes en deux langues : { en: 'English', fr: 'Français' }.
   Un texte identique dans les deux langues peut rester simple : 'Figma'.
---------------------------------------------------------------- */
const ASSETS = 'assets/';
const asset = (p) => ASSETS + encodeURI(p);
const thumb = (p) => (/\.webp$/.test(p) ? ASSETS + 'thumbs/' + encodeURI(p) : asset(p));
const isVideo = (p) => /\.mp4$/i.test(p);

const CONTACT = {
  email: 'kaola.abidi@gmail.com',
  phone: '+33 6 21 66 40 86',
  phoneHref: 'tel:+33621664086',
  linkedin: 'https://www.linkedin.com/in/kaola-abidi',
  cv: 'mon-cv.pdf', // ton CV, dans assets/
};

/* Musique de fond : mets tes fichiers MP3 dans assets/music/
   puis ajoute une ligne par morceau. Tant que la liste est vide,
   le bouton musique n'apparaît pas.
   Exemple : { title: 'Nom du morceau', artist: 'Artiste', src: 'music/morceau.mp3' }, */
const MUSIC = [
];

const PROJECTS = [
  {
    id: 'essences',
    name: 'Essences',
    type: { en: 'Exhibition website', fr: 'Site d’exposition' },
    date: { en: 'April 2026', fr: 'Avril 2026' },
    tools: 'HTML, CSS, JavaScript',
    cover: 'essences.webp',
    hero: 'essences/essencesbg.webp',
    desc: {
      en: "I created a website for a fictional exhibition during a redesign project for the museum 'La Maison du Bois et du Jouet' in Mazamet. The concept of this exhibition is to showcase traditional toys created from wood from their country of origin.",
      fr: 'J’ai créé le site d’une exposition fictive dans le cadre d’un projet de refonte pour le musée « La Maison du Bois et du Jouet » à Mazamet. Le concept de cette exposition est de présenter des jouets traditionnels fabriqués à partir du bois de leur pays d’origine.',
    },
    desktop: ['essences/download.mp4', 'essences/capture-d-cran-2026-05-05-191051.webp', 'essences/download-4.mp4', 'essences/deskessences.webp'],
    mobile: ['essences/mobil1.webp', 'essences/mobil2.webp', 'essences/mobil3.webp', 'essences/mobil4.webp'],
  },
  {
    id: 'knockout',
    name: 'Knockout',
    type: { en: 'Branding & web design', fr: 'Identité visuelle & web design' },
    date: { en: 'January 2026', fr: 'Janvier 2026' },
    tools: 'Figma',
    cover: 'knock-out/cover-bag.webp', // sac de frappe (accueil)
    hero: 'knock-out/hero-ring.webp', // ring vu d'en haut (1re image de la page projet)
    desc: {
      en: 'Knock Out Festival is a group branding and web design project developed as part of my studies. The project included a complete visual identity, and I was responsible for designing the website mockups with a minimalist and impactful approach. This project was inspired by the charisma and cultural impact of Muhammad Ali, one of the most iconic figures in boxing.',
      fr: 'Knock Out Festival est un projet de groupe en branding et web design réalisé pendant mes études. Le projet comprenait une identité visuelle complète, et j’étais en charge des maquettes du site, avec une approche minimaliste et percutante. Ce projet s’inspire du charisme et de l’impact culturel de Mohamed Ali, l’une des figures les plus emblématiques de la boxe.',
    },
    desktop: ['knock-out/macbook-air-1.webp', 'knock-out/macbook-air-2.webp', 'knock-out/macbook-air-8.webp', 'knock-out/macbook-air-9.webp'],
    mobile: ['knock-out/iphone-17-1.webp', 'knock-out/iphone-17-2.webp', 'knock-out/iphone-17-3.webp', 'knock-out/iphone-17-4.webp'],
  },
  {
    id: 'rosalya',
    name: 'Rosalya',
    type: { en: 'Skincare branding', fr: 'Branding cosmétique' },
    date: { en: 'December 2025', fr: 'Décembre 2025' },
    tools: 'WordPress, Photoshop',
    cover: 'rosalyaa.webp',
    hero: 'rosalya.webp',
    url: 'https://bdk5185a.mmiweb.iut-tlse3.fr/rosalya/',
    desc: {
      en: 'Rosalya is a branding project developed around a clean and minimalist skincare concept. The identity combines soft tones, refined typography and thoughtful composition to express a gentle, modern and cruelty-free approach to beauty.',
      fr: 'Rosalya est un projet de branding développé autour d’un concept de soin de la peau épuré et minimaliste. L’identité associe des tons doux, une typographie raffinée et une composition soignée pour exprimer une approche de la beauté douce, moderne et cruelty-free.',
    },
    desktop: ['rosalya/rosalya1-ezgif-com-video-to-gif-converter-2.mp4', 'rosalya/desktop-1.webp', 'rosalya/desktop-2.webp', 'rosalya/desktop-3.webp'],
    mobile: ['rosalya/mobile-1.webp', 'rosalya/mobile-2.webp', 'rosalya/mobile-3.webp', 'rosalya/mobile-4.webp'],
  },
  {
    id: 'yeng',
    name: 'Yeng',
    type: { en: 'Photographer portfolio', fr: 'Portfolio de photographe' },
    date: { en: 'November 2025', fr: 'Novembre 2025' },
    tools: 'Bootstrap',
    cover: 'yeng.webp',
    hero: 'yengbg.webp',
    url: 'https://bdk5185a.mmiweb.iut-tlse3.fr/yeng',
    desc: {
      en: 'Yeyoung Choi (yeng_p on Instagram) is a self-taught photographer with a seductive color palette and an eccentricity to her work. I decided to create a modern portfolio for her.',
      fr: 'Yeyoung Choi (yeng_p sur Instagram) est une photographe autodidacte à la palette de couleurs envoûtante et au travail excentrique. J’ai décidé de lui créer un portfolio moderne.',
    },
    desktop: ['yeng/yeng-loading-screen.mp4', 'yeng/yeng-about.webp', 'yeng/design-sans-titre-1.mp4', 'yeng/yeng-contact.webp'],
    mobile: ['yeng/iphone-1-yeng.webp', 'yeng/iphone-4-yeng.webp', 'yeng/iphone-2-yeng.webp', 'yeng/iphone-3-yeng.webp'],
  },
  {
    id: 'cyberjazz',
    name: 'Cyberjazz',
    type: { en: 'Identity & website mockup', fr: 'Identité & maquette de site' },
    date: { en: 'May 2025', fr: 'Mai 2025' },
    tools: 'Figma, Photoshop, Illustrator',
    cover: 'cyberjazz.webp',
    hero: 'ab6761860000eab1677ef678b75e1cc6b2d89535.webp',
    desc: {
      en: 'In this project, I designed a logo and website mockup for an imagined musical genre called Cyberjazz. The visual identity reflects a fusion of retro jazz aesthetics and futuristic digital influences. I discovered this genre through the work of Solène Velvet, an American singer-songwriter known for blending jazz, lo-fi and cyberpunk influences in what she calls “cyber jazz.”',
      fr: 'Dans ce projet, j’ai conçu un logo et une maquette de site pour un genre musical imaginaire : le Cyberjazz. L’identité visuelle reflète la fusion entre l’esthétique rétro du jazz et des influences numériques futuristes. J’ai découvert ce genre grâce au travail de Solène Velvet, autrice-compositrice-interprète américaine connue pour mêler jazz, lo-fi et cyberpunk dans ce qu’elle appelle le « cyber jazz ».',
    },
    desktop: ['cyberjazz/home.webp', 'cyberjazz/about.webp', 'cyberjazz/artists.webp', 'cyberjazz/listen.webp', 'cyberjazz/listen-2.webp'],
    mobile: ['cyberjazz/iphone-1.webp', 'cyberjazz/iphone-2.webp', 'cyberjazz/iphone-3.webp', 'cyberjazz/iphone-4.webp'],
  },
];

/* 6e entrée de l'accueil : le playground */
const PLAYGROUND_ENTRY = {
  id: 'playground',
  name: 'Playground',
  type: { en: 'Editorial, graphic & layout', fr: 'Édition, graphisme & mise en page' },
  date: '2024 — 2026',
  cover: 'image-16.webp',
  href: 'playground.html',
};

/* Pièces du playground (en plus des 5 sites, ajoutés automatiquement).
   desc = mini description affichée quand on ouvre un design.
   ⚠ Ce sont des propositions : relis-les et ajuste-les à ta guise. */
const EDITORIAL = [
  { title: { en: 'Layout 01', fr: 'Mise en page 01' }, cat: { en: 'Layout', fr: 'Mise en page' }, src: 'chinese-shooting.webp',
    desc: { en: 'Editorial layout around a photoshoot. Image first, type as a quiet frame.', fr: 'Mise en page éditoriale autour d’un shooting photo. L’image d’abord, le texte comme un cadre discret.' } },
  { title: 'Hilda Furacão v1', cat: { en: 'Poster', fr: 'Affiche' }, src: 'posters/11.webp',
    desc: { en: 'Poster for the series Hilda Furacão. First exploration.', fr: 'Affiche pour la série Hilda Furacão. Première exploration.' } },
  { title: { en: 'Swan Lake Tickets', fr: 'Billets Le Lac des cygnes' }, cat: 'Print', src: 'ballet-tickets.webp',
    desc: { en: 'Ticket design for a Swan Lake ballet performance.', fr: 'Billets pour une représentation du ballet Le Lac des cygnes.' } },
  { title: { en: 'Blush Bakery Logo', fr: 'Logo Blush Bakery' }, cat: 'Branding', src: 'logo-fond-rose-1.webp',
    desc: { en: 'Logo for Blush Bakery, a soft and playful pastry brand.', fr: 'Logo de Blush Bakery, une marque de pâtisserie douce et ludique.' } },
  { title: 'Bazaar Magazine', cat: { en: 'Editorial', fr: 'Édition' }, src: 'magazine-jenie.webp',
    desc: { en: 'Magazine cover in the spirit of Harper’s Bazaar.', fr: 'Couverture de magazine dans l’esprit de Harper’s Bazaar.' } },
  { title: 'Knock Out', cat: { en: 'Poster', fr: 'Affiche' }, src: 'posters/13.webp',
    desc: { en: 'Festival poster from the Knock Out identity, inspired by Muhammad Ali.', fr: 'Affiche de festival issue de l’identité Knock Out, inspirée par Mohamed Ali.' } },
  { title: { en: 'Layout 02', fr: 'Mise en page 02' }, cat: { en: 'Layout', fr: 'Mise en page' }, src: 'layout-blush-bakery.webp',
    desc: { en: 'Brand layout for Blush Bakery.', fr: 'Mise en page de marque pour Blush Bakery.' } },
  { title: 'MJ', cat: { en: 'Poster', fr: 'Affiche' }, src: 'posters/12.webp',
    desc: { en: 'Music tribute poster.', fr: 'Affiche hommage musical.' } },
  { title: { en: 'Romantism', fr: 'Romantisme' }, cat: { en: 'Editorial', fr: 'Édition' }, src: 'magazine-spread.webp',
    desc: { en: 'Magazine spread on Romanticism.', fr: 'Double page de magazine sur le romantisme.' } },
  { title: { en: 'Museum Identity', fr: 'Identité de musée' }, cat: 'Branding', src: 'identity.webp',
    desc: { en: 'Visual identity for a museum.', fr: 'Identité visuelle pour un musée.' } },
  { title: 'Perfect Blue', cat: { en: 'Poster', fr: 'Affiche' }, src: 'posters/perfect-blue.webp',
    desc: { en: 'Poster tribute to Satoshi Kon’s Perfect Blue.', fr: 'Affiche hommage à Perfect Blue de Satoshi Kon.' } },
  { title: 'Glow Up Box', cat: 'Packaging', src: 'glow-up-card.webp',
    desc: { en: 'Card design for a personalised beauty box.', fr: 'Carte pour une box beauté personnalisée.' } },
  { title: { en: 'Layout 03', fr: 'Mise en page 03' }, cat: { en: 'Layout', fr: 'Mise en page' }, src: 'glowup.webp',
    desc: { en: 'Campaign layout for the Glow Up box.', fr: 'Mise en page de campagne pour la box Glow Up.' } },
  { title: "Breakfast at Tiffany's", cat: { en: 'Poster', fr: 'Affiche' }, src: 'posters/10.webp',
    desc: { en: 'Film poster for Breakfast at Tiffany’s.', fr: 'Affiche du film Diamants sur canapé (Breakfast at Tiffany’s).' } },
  { title: { en: 'Layout 04', fr: 'Mise en page 04' }, cat: { en: 'Layout', fr: 'Mise en page' }, src: 'yeng-layout.webp',
    desc: { en: 'Editorial layout for Yeng’s photography.', fr: 'Mise en page éditoriale pour les photos de Yeng.' } },
  { title: 'Palmarium', cat: { en: 'Guidelines', fr: 'Charte graphique' }, src: 'posters/charte-graphique-palmarium.webp',
    desc: { en: 'Brand guidelines for Le Palmarium.', fr: 'Charte graphique pour Le Palmarium.' } },
  { title: 'Rêve AI', cat: { en: 'Graphic', fr: 'Graphisme' }, src: 'coquelicot.webp',
    desc: { en: 'Graphic exploration for Rêve AI.', fr: 'Exploration graphique pour Rêve AI.' } },
  { title: 'Hilda Furacão v2', cat: { en: 'Poster', fr: 'Affiche' }, src: 'posters/hilda.webp',
    desc: { en: 'Poster for the series Hilda Furacão. Second version.', fr: 'Affiche pour la série Hilda Furacão. Deuxième version.' } },
  { title: 'Moodboard 02', cat: 'Moodboard', src: 'moodboard/2.webp',
    desc: { en: 'Moodboard. Colours, textures and references.', fr: 'Moodboard. Couleurs, textures et références.' } },
  { title: 'She Wants Revenge', cat: { en: 'Poster', fr: 'Affiche' }, src: 'posters/she-wants-revenge.webp',
    desc: { en: 'Gig poster for the band She Wants Revenge.', fr: 'Affiche de concert pour le groupe She Wants Revenge.' } },
];

// Garde uniquement la langue choisie (voir i18n.js)
localize(PROJECTS);
localize(PLAYGROUND_ENTRY);
localize(EDITORIAL);
