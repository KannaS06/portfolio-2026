# Portfolio 2026 — Kaola Abidi

Site statique (HTML, CSS, JS), aucune installation nécessaire.

## Voir le site en local
Ouvre le dossier dans VS Code et lance-le avec l'extension **Live Server**
(clic droit sur `index.html` → *Open with Live Server*).
Un serveur local est nécessaire pour le playground (WebGL).

## Où modifier quoi
- `js/data.js` : textes, projets, descriptions du playground, contact, CV
- `css/style.css` : couleurs (en haut du fichier), typos, mise en page
- `fonts/` : police des titres (Chloe — licence usage personnel uniquement)

## Images
Tout est dans `assets/`, compressé (environ 9 Mo au lieu de 167 Mo).
- Images en **WebP**, 2000 px de large maximum.
- Petites versions (720 px max) dans `assets/thumbs/` : utilisées sur
  l'accueil et dans la grille du playground.
- Les anciens GIF des projets sont des vidéos **MP4** muettes en boucle,
  avec une image d'aperçu `.webp` du même nom.

Pour ajouter une image : exporte-la en WebP (qualité ~80, par exemple avec
[Squoosh](https://squoosh.app)), mets-la dans `assets/` et une version
720 px dans `assets/thumbs/` si elle va sur l'accueil ou dans le playground.
Évite les PNG de plusieurs Mo et les GIF : ils ralentissent tout le site.

## Mise en ligne
Importe ce dépôt sur Vercel : aucun réglage à faire.
