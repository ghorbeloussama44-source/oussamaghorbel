---
name: portfolio-site
description: Design system, motion design and content rules for Oussama Ghorbel's personal site (static HTML/CSS/JS on GitHub Pages, 4 languages, WebGL hero, GSAP animations). Use when adding a portfolio project, editing a section, changing animations or visuals, or adding a language string on this site.
---

# Site d'Oussama Ghorbel — guide de travail

Site statique servi par GitHub Pages depuis `main`, sans compilation. Aucun CDN : les
bibliothèques sont copiées dans `assets/vendor/` (GSAP, ScrollTrigger, Lenis).

## Fichiers

| Fichier | Rôle |
|---|---|
| `index.html` | Page unique. Textes fixes marqués `data-i18n="clé"`. |
| `assets/js/i18n.js` | Textes de l'interface en `fr`, `en`, `ar`, `ru`. Toute clé ajoutée doit exister dans les 4 langues. |
| `assets/js/content.js` | Contenu : `PROJECTS`, `EXPERIENCE`, `EDUCATION`, `TRAINING`, `SKILLS`, `GALLERY`. |
| `assets/js/site.js` | Rendu, langue, filtres. Émet `site:render` et `site:filter` sur `document`. |
| `assets/js/gl.js` | Shader WebGL (étoffe de soie animée), en fond de la section Contact. |
| `assets/js/sparkles.js` | Éclats dorés en parallaxe sur l'en-tête vidéo (calque arrière optionnel), traînée d'éclats sous la souris. |
| `assets/js/video.js` | Vidéo plein écran de l'en-tête : version mobile sous 700 px, lecture auto sans son, boutons pause et son. |
| `assets/video/` | `showreel.mp4` (720p), `showreel-mobile.mp4` (480p), `showreel-poster.jpg`. |
| `assets/js/motion.js` | Préchargeur, intro, Lenis, parallaxe, apparitions au scroll, marquee, curseur, boutons magnétiques. |
| `assets/css/site.css` | Mise en page et thème. `assets/css/motion.css` : styles propres aux animations. |
| `assets/img/` | Images web. `logo.svg` / `logo-dark.svg` (monogramme OG serif), `favicon.svg`, `pose-stand|navy|mic.webp` (poses détourées), `og-image.jpg` (partage). |

## Ajouter un projet

1. Ajouter un objet en tête de `PROJECTS` (ordre chronologique inverse) dans `content.js` :
   `year`, `domains` (`business`, `textile`, `it`, `research`), `title` et `desc` en 4 langues,
   `image` et `link` optionnels.
2. Image : la redimensionner à 1200 px de large maximum, JPEG qualité 80, dans `assets/img/`.
3. Ne rien inventer : n'écrire que ce qu'Oussama a fourni. Demander en cas de doute
   (dates, intitulés, chiffres).

## Poses détourées

Trois poses tirées de la vidéo ponctuent la page, chacune dans une arche dorée en parallaxe
(`<figure class="pose" data-pose>`) : `pose-stand` (À propos, costume marron souriant),
`pose-navy` (interlude, costume bleu marine), `pose-mic` (Contact, au micro).

Méthode : choisir l'image la plus nette du plan (variance du laplacien sur le visage),
détourer avec `rembg` + `birefnet-portrait` (venv dans le dossier temporaire, pas dans le dépôt),
recalculer les couleurs des bords avec `pymatting.estimate_foreground_ml`, rogner, agrandir de 1,25×
avec un léger accentuage, puis mettre à zéro l'alpha résiduel (< 24) pour éviter un voile autour.
Sur fond clair, ne pas mettre d'ombre portée : le masque de fondu la coupe net en haut.
Ne pas réutiliser le portrait « chaise en bois » envoyé avec la vidéo : Oussama a demandé de le retirer.

## Logo

Monogramme « OG » : O droit (Cormorant Garamond, graisse 400) en or, G italique (graisse 500) en ivoire,
dans un double anneau fin avec un petit losange. Les lettres sont vectorisées avec fontTools
(chemins SVG, aucune police nécessaire à l'affichage). `logo-dark.svg` sert sur fond clair.
Le préchargeur dessine ces mêmes chemins au trait, puis les remplit.

## Vidéo

- Encodage : H.264 `-crf 27 -preset slow -movflags +faststart`, AAC 96k ; version mobile 854 px de large, CRF 29, AAC 64k.
- Retirer tout plan montrant une marque tierce (le montage d'origine contenait des plans « Lemoon », coupés).
- Le Chromium de test n'a pas H.264 : pour tester la lecture, encoder une copie WebM temporaire et la servir à la place des .mp4 via `page.route`, sans la committer.

## Identité visuelle

- Couleurs : encre `#0e0f14`, ivoire `#f6f2ea`, champagne `#c9a96e` / `#e3cc98`, or foncé `#8c6d32`.
  Domaines : business `#b08d4f`, textile `#a4704f`, it `#5d7085`, research `#7a6a86`.
- Polices : Cormorant Garamond pour les titres (romain + italique, latin et cyrillique), Manrope pour le texte,
  Amiri pour les titres arabes et Noto Kufi Arabic pour le texte arabe.
- Ton : éditorial et sobre. Filets de 1 px, angles à 4 px, petites capitales espacées pour les libellés,
  pas de couleurs vives : les domaines sont des nuances autour du champagne.
- Le nom « Oussama Ghorbel » reste en lettres latines dans toutes les langues.
- L'arabe passe la page en `dir="rtl"` : utiliser des propriétés logiques
  (`inset-inline-start`, `margin-inline-start`…) plutôt que left/right.

## Règles de motion

- Courbes : `expo.out` pour les entrées, `power3.out` pour les apparitions, durées de 0,9 à 1,4 s.
- Ne jamais découper en lettres un texte traduit (ça casse la liaison des lettres arabes).
  Pour les titres, utiliser le rideau `clip-path` déjà en place.
- Les éléments générés par `site.js` sont animés via `ScrollTrigger.batch` dans `animateDynamic()` ;
  un nouveau type de liste doit y être ajouté.
- Respecter `prefers-reduced-motion` : `motion.js` s'arrête tôt et affiche tout ; `gl.js` dessine une image fixe.
- Parallaxe souris : ajouter `data-depth="0.2…1.6"` à un élément du hero.
- Performance : le shader tourne à résolution réduite et s'arrête hors écran ; garder le hero sous 1 Mo d'images.

## Vérifier avant de publier

```
python3 -m http.server 8765
```

Avec Playwright (Chromium est préinstallé dans les sessions cloud), ouvrir
`http://127.0.0.1:8765/?lang=fr|en|ar|ru` en 1440×900 et 390×844 et vérifier :
pas d'erreur console, pas de défilement horizontal (`scrollWidth` = largeur),
le hero après l'intro (~5 s), et un contexte `reducedMotion: 'reduce'`.
Pour le WebGL en headless : `--use-gl=angle --use-angle=swiftshader --enable-unsafe-swiftshader`.
