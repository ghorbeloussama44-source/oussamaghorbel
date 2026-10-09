# Oussama Ghorbel

Site personnel et portfolio — ingénieur textile, ingénieur en mathématiques et entrepreneur.
Disponible en français, anglais, arabe et russe.

En ligne : https://ghorbeloussama44-source.github.io/oussamaghorbel/

## Structure

```
index.html            page unique (en-tête vidéo, à propos, portfolio, interlude, parcours, compétences, galerie, contact)
assets/css/site.css   mise en page et thème
assets/css/motion.css styles des animations (préchargeur, curseur, cartes)
assets/js/i18n.js     textes de l'interface dans les 4 langues
assets/js/content.js  contenu : projets, expériences, formations, compétences, galerie
assets/js/site.js     rendu, changement de langue, filtres, galerie
assets/js/gl.js       fond WebGL de la section contact (étoffe de soie animée)
assets/js/sparkles.js éclats dorés en parallaxe sur l'en-tête
assets/js/video.js    vidéo plein écran de l'en-tête
assets/video/         showreel (ordinateur, mobile) et image d'aperçu
assets/js/motion.js   motion design : intro, parallaxe, défilement fluide, apparitions
assets/vendor/        GSAP, ScrollTrigger et Lenis (copiés localement, sans CDN)
assets/img/           images web, logo, poses détourées
.claude/skills/       guide de design et de motion pour Claude Code
assets/images/        photos originales
assets/files/         CV en PDF
history/              ancien projet Mobirise (2017)
```

Le site est en HTML, CSS et JavaScript simples : aucune installation ni compilation, GitHub Pages le sert tel quel.

## Ajouter un travail au portfolio

Ajouter un bloc dans `PROJECTS` de `assets/js/content.js` :

```js
{
  year: "2026",
  domains: ["business", "textile"],      // business, textile, it, research
  image: "assets/img/mon-projet.jpg",    // optionnel
  link: "https://…",                     // optionnel
  title: { fr: "…", en: "…", ar: "…", ru: "…" },
  desc:  { fr: "…", en: "…", ar: "…", ru: "…" }
}
```

Si une langue manque, le site affiche l'anglais, puis le français.

## Prévisualiser localement

```
python3 -m http.server
```

puis ouvrir http://localhost:8000. On peut forcer une langue avec `?lang=fr|en|ar|ru`.
