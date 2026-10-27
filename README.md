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
Elles sont encore chargées depuis l'ancien site. Pour les héberger ici :
copie les dossiers d'images dans `assets/`, puis dans `js/data.js` remplace
`const ASSETS = '...'` par `const ASSETS = 'assets/';`

## Mise en ligne
Importe ce dépôt sur Vercel : aucun réglage à faire.
