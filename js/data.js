/* ---------------------------------------------------------------
   Contenu du portfolio.
   ASSETS : dossier où sont tes images. Pour l'instant elles sont
   chargées depuis l'ancien site. Quand tu copies tes dossiers
   d'images dans /assets, remplace par : const ASSETS = 'assets/';
---------------------------------------------------------------- */
const ASSETS = 'https://portfolio-gold-five-fn3zcnd0c9.vercel.app/';
const asset = (p) => ASSETS + encodeURI(p);

const CONTACT = {
  email: 'kaola.abidi@gmail.com',
  phone: '+33 6 21 66 40 86',
  phoneHref: 'tel:+33621664086',
  linkedin: 'https://www.linkedin.com/in/kaola-abidi',
  cv: 'mon-cv.pdf', // ton CV (dans le même dossier que les images)
};

const PROJECTS = [
  {
    id: 'essences',
    name: 'Essences',
    type: 'Exhibition website',
    date: 'April 2026',
    tools: 'HTML, CSS, JavaScript',
    cover: 'essences.webp',
    desc: "I created a website for a fictional exhibition during a redesign project for the museum 'La Maison du Bois et du Jouet' in Mazamet. The concept of this exhibition is to showcase traditional toys created from wood from their country of origin.",
    desktop: ['essences/download.gif', 'essences/Capture d’écran 2026-05-05 191051.png', 'essences/download (4).gif', 'essences/deskessences.png'],
    mobile: ['essences/mobil1.png', 'essences/mobil2.png', 'essences/mobil3.png', 'essences/mobil4.png'],
  },
  {
    id: 'knockout',
    name: 'Knockout',
    type: 'Branding & web design',
    date: 'January 2026',
    tools: 'Figma',
    cover: 'Knock out.png',
    desc: 'Knock Out Festival is a group branding and web design project developed as part of my studies. The project included a complete visual identity, and I was responsible for designing the website mockups with a minimalist and impactful approach. This project was inspired by the charisma and cultural impact of Muhammad Ali, one of the most iconic figures in boxing.',
    desktop: ['knock out/MacBook Air - 1.png', 'knock out/MacBook Air - 2.png', 'knock out/MacBook Air - 8.png', 'knock out/MacBook Air - 9.png'],
    mobile: ['knock out/iPhone 17 - 1.png', 'knock out/iPhone 17 - 2.png', 'knock out/iPhone 17 - 3.png', 'knock out/iPhone 17 - 4.png'],
  },
  {
    id: 'rosalya',
    name: 'Rosalya',
    type: 'Skincare branding',
    date: 'December 2025',
    tools: 'WordPress, Photoshop',
    cover: 'rosalyaa.png',
    url: 'https://bdk5185a.mmiweb.iut-tlse3.fr/rosalya/',
    desc: 'Rosalya is a branding project developed around a clean and minimalist skincare concept. The identity combines soft tones, refined typography and thoughtful composition to express a gentle, modern and cruelty-free approach to beauty.',
    desktop: ['rosalya/Rosalya1-ezgif.com-video-to-gif-converter (2).gif', 'rosalya/desktop 1.png', 'rosalya/desktop 2.png', 'rosalya/desktop 3.png'],
    mobile: ['rosalya/mobile 1.png', 'rosalya/mobile 2.png', 'rosalya/mobile 3.png', 'rosalya/mobile 4.png'],
  },
  {
    id: 'yeng',
    name: 'Yeng',
    type: 'Photographer portfolio',
    date: 'November 2025',
    tools: 'Bootstrap',
    cover: 'yeng.png',
    url: 'https://bdk5185a.mmiweb.iut-tlse3.fr/yeng',
    desc: 'Yeyoung Choi (yeng_p on Instagram) is a self-taught photographer with a seductive color palette and an eccentricity to her work. I decided to create a modern portfolio for her.',
    desktop: ['yeng/Yeng Loading screen.gif', 'yeng/yeng about.png', 'yeng/Design sans titre (1).gif', 'yeng/yeng contact.png'],
    mobile: ['yeng/iphone 1 yeng.png', 'yeng/iphone 4 yeng.png', 'yeng/iphone 2 yeng.png', 'yeng/iphone 3 yeng.png'],
  },
  {
    id: 'cyberjazz',
    name: 'Cyberjazz',
    type: 'Identity & website mockup',
    date: 'May 2025',
    tools: 'Figma, Photoshop, Illustrator',
    cover: 'Cyberjazz.png',
    desc: 'In this project, I designed a logo and website mockup for an imagined musical genre called Cyberjazz. The visual identity reflects a fusion of retro jazz aesthetics and futuristic digital influences. I discovered this genre through the work of Solène Velvet, an American singer-songwriter known for blending jazz, lo-fi and cyberpunk influences in what she calls “cyber jazz.”',
    desktop: ['Cyberjazz/Home.png', 'Cyberjazz/About.png', 'Cyberjazz/Artists.png', 'Cyberjazz/Listen.png', 'Cyberjazz/Listen 2.png'],
    mobile: ['Cyberjazz/Iphone 1.png', 'Cyberjazz/iPhone 2.png', 'Cyberjazz/iPhone 3.png', 'Cyberjazz/iPhone 4.png'],
  },
];

/* 6e entrée de l'accueil : le playground */
const PLAYGROUND_ENTRY = {
  id: 'playground',
  name: 'Playground',
  type: 'Editorial, graphic & layout',
  date: '2024 — 2026',
  cover: 'image 16.png',
  href: 'playground.html',
};

/* Pièces du playground (en plus des 5 sites, ajoutés automatiquement).
   desc = mini description affichée quand on ouvre un design.
   ⚠ Ce sont des propositions : relis-les et ajuste-les à ta guise. */
const EDITORIAL = [
  { title: 'Layout 01', cat: 'Layout', src: 'chinese shooting.png', desc: 'Editorial layout around a photoshoot. Image first, type as a quiet frame.' },
  { title: 'Hilda Furacão v1', cat: 'Poster', src: 'Posters/11.svg', desc: 'Poster for the series Hilda Furacão. First exploration.' },
  { title: 'Swan Lake Tickets', cat: 'Print', src: 'Ballet Tickets.png', desc: 'Ticket design for a Swan Lake ballet performance.' },
  { title: 'Blush Bakery Logo', cat: 'Branding', src: 'Logo fond rose (1).png', desc: 'Logo for Blush Bakery, a soft and playful pastry brand.' },
  { title: 'Bazaar Magazine', cat: 'Editorial', src: 'Magazine Jenie.png', desc: 'Magazine cover in the spirit of Harper’s Bazaar.' },
  { title: 'Knock Out', cat: 'Poster', src: 'Posters/13.svg', desc: 'Festival poster from the Knock Out identity, inspired by Muhammad Ali.' },
  { title: 'Layout 02', cat: 'Layout', src: 'Layout blush bakery.png', desc: 'Brand layout for Blush Bakery.' },
  { title: 'MJ', cat: 'Poster', src: 'Posters/12.svg', desc: 'Music tribute poster.' },
  { title: 'Romantism', cat: 'Editorial', src: 'Magazine Spread.png', desc: 'Magazine spread on Romanticism.' },
  { title: 'Museum Identity', cat: 'Branding', src: 'Identity.png', desc: 'Visual identity for a museum.' },
  { title: 'Perfect Blue', cat: 'Poster', src: 'Posters/Perfect Blue.svg', desc: 'Poster tribute to Satoshi Kon’s Perfect Blue.' },
  { title: 'Glow Up Box', cat: 'Packaging', src: 'Glow Up card.png', desc: 'Card design for a personalised beauty box.' },
  { title: 'Layout 03', cat: 'Layout', src: 'glowup.png', desc: 'Campaign layout for the Glow Up box.' },
  { title: "Breakfast at Tiffany's", cat: 'Poster', src: 'Posters/10.svg', desc: 'Film poster for Breakfast at Tiffany’s.' },
  { title: 'Layout 04', cat: 'Layout', src: 'Yeng Layout.png', desc: 'Editorial layout for Yeng’s photography.' },
  { title: 'Palmarium', cat: 'Guidelines', src: 'Posters/Charte Graphique Palmarium.svg', desc: 'Brand guidelines for Le Palmarium.' },
  { title: 'Rêve AI', cat: 'Graphic', src: 'coquelicot.png', desc: 'Graphic exploration for Rêve AI.' },
  { title: 'Hilda Furacão v2', cat: 'Poster', src: 'Posters/Hilda.svg', desc: 'Poster for the series Hilda Furacão. Second version.' },
  { title: 'Moodboard 02', cat: 'Moodboard', src: 'Moodboard/2.png', desc: 'Moodboard. Colours, textures and references.' },
  { title: 'She Wants Revenge', cat: 'Poster', src: 'Posters/She wants revenge.png', desc: 'Gig poster for the band She Wants Revenge.' },
];
