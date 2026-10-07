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
| `assets/js/gl.js` | Shader WebGL du hero (étoffe de soie, trame de tissage, reflet doré suivant la souris). |
| `assets/js/sparkles.js` | Éclats dorés en parallaxe, sur deux canvas (derrière et devant le personnage), plus une traînée d'éclats sous la souris. |
| `assets/js/motion.js` | Préchargeur, intro, Lenis, parallaxe, apparitions au scroll, marquee, curseur, boutons magnétiques. |
| `assets/css/site.css` | Mise en page et thème. `assets/css/motion.css` : styles propres aux animations. |
| `assets/img/` | Images web. `logo.svg` (monogramme OG), `favicon.svg`, `oussama-cutout.webp` (personnage détouré), `og-image.jpg` (partage). |

## Ajouter un projet

1. Ajouter un objet en tête de `PROJECTS` (ordre chronologique inverse) dans `content.js` :
   `year`, `domains` (`business`, `textile`, `it`, `research`), `title` et `desc` en 4 langues,
   `image` et `link` optionnels.
2. Image : la redimensionner à 1200 px de large maximum, JPEG qualité 80, dans `assets/img/`.
3. Ne rien inventer : n'écrire que ce qu'Oussama a fourni. Demander en cas de doute
   (dates, intitulés, chiffres).

## Détourer une nouvelle photo

Le personnage du hero (`assets/img/oussama-cutout.webp`) a été détouré avec `rembg`
et le modèle `birefnet-portrait`, installés dans un venv du dossier temporaire
(pas dans le dépôt) :

1. `python3 -m venv <tmp>/venv && <tmp>/venv/bin/pip install "rembg[cpu]"`
2. Générer le masque : `remove(image, session=new_session("birefnet-portrait"), only_mask=True)`.
3. Recalculer les couleurs des bords avec `pymatting.estimate_foreground_ml(image, alpha)`,
   puis désaturer ce qui reste de la couleur du fond dans les zones de bord (cheveux).
4. Rogner au cadre utile, exporter en WebP qualité 90, et mettre à jour `width`/`height` dans `index.html`.

La photo originale est gardée dans `assets/images/`.

## Identité visuelle

- Couleurs : encre `#11131f`, or `#c8a24a` / `#e6c77c`, papier `#f7f5f0`.
  Domaines : business or, textile `#c0643f`, it `#3f7fc0`, research `#6a58c2`.
- Polices : Manrope (latin et cyrillique), Noto Kufi Arabic pour l'arabe.
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
