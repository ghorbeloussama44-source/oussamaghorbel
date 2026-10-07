/*
 * Motion design : préchargeur, intro du hero, défilement fluide (Lenis),
 * parallaxe souris et scroll, apparitions au scroll (GSAP ScrollTrigger),
 * bandeau défilant, boutons magnétiques et curseur personnalisé.
 * Tout est désactivé proprement si l'utilisateur préfère réduire les animations.
 */
(function () {
  "use strict";

  var root = document.documentElement;
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var gsap = window.gsap;
  var loader = document.getElementById("loader");

  function done() {
    if (loader) loader.remove();
    root.classList.add("is-loaded");
  }

  // Sans GSAP (fichier bloqué) ou animations réduites : on affiche tout directement.
  if (!gsap || reduced) {
    root.classList.add("no-motion");
    document.querySelectorAll(".reveal").forEach(function (n) { n.classList.add("is-visible"); });
    buildMarquee();
    document.addEventListener("site:render", buildMarquee);
    done();
    return;
  }

  var ScrollTrigger = window.ScrollTrigger;
  gsap.registerPlugin(ScrollTrigger);
  root.classList.add("has-motion");

  /* ---------- Défilement fluide ---------- */

  var lenis = null;
  if (window.Lenis) {
    lenis = new window.Lenis({ lerp: 0.1, wheelMultiplier: 1 });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);
    lenis.stop();

    document.addEventListener("click", function (e) {
      var a = e.target.closest('a[href^="#"]');
      if (!a) return;
      var id = a.getAttribute("href");
      var target = id === "#top" ? 0 : document.querySelector(id);
      if (target === null) return;
      e.preventDefault();
      lenis.scrollTo(target, { offset: id === "#top" ? 0 : -72, duration: 1.4 });
    });
  }

  /* ---------- Texte découpé en lettres (nom du hero) ---------- */

  document.querySelectorAll("[data-split]").forEach(function (line) {
    var text = line.textContent;
    line.textContent = "";
    line.setAttribute("aria-hidden", "true");
    text.split("").forEach(function (ch) {
      var outer = document.createElement("span");
      outer.className = "char";
      var inner = document.createElement("span");
      inner.textContent = ch;
      outer.appendChild(inner);
      line.appendChild(outer);
    });
  });

  /* ---------- Préchargeur puis intro ---------- */

  var counter = { v: 0 };
  var countEl = document.getElementById("loaderCount");
  var person = document.querySelector(".hero__person");

  gsap.set(".hero__name .char > span", { yPercent: 115 });
  gsap.set(".hero__in", { y: 30, opacity: 0 });
  gsap.set(".hero__person", { y: 80, opacity: 0, scale: 0.94 });
  gsap.set(".hero__halo, .hero__orbit", { scale: 0.6, opacity: 0 });
  gsap.set(".chip", { scale: 0, opacity: 0 });
  gsap.set(".hero__bigword span", { opacity: 0, yPercent: 30 });

  var loadTl = gsap.timeline();
  loadTl
    .to(".loader__logo .draw", { strokeDashoffset: 0, duration: 1.1, stagger: 0.18, ease: "power2.inOut" }, 0)
    .to(counter, {
      v: 100, duration: 1.4, ease: "power2.inOut",
      onUpdate: function () { if (countEl) countEl.textContent = Math.round(counter.v); }
    }, 0);

  function whenReady(cb) {
    var imgReady = !person || person.complete ? Promise.resolve()
      : new Promise(function (r) { person.addEventListener("load", r, { once: true }); person.addEventListener("error", r, { once: true }); });
    var fontsReady = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
    var timeout = new Promise(function (r) { setTimeout(r, 3500); });
    Promise.race([Promise.all([imgReady, fontsReady]), timeout]).then(function () {
      loadTl.then(cb);
    });
  }

  whenReady(function () {
    var tl = gsap.timeline({
      onComplete: function () { if (lenis) lenis.start(); }
    });
    tl.to(".loader__inner", { opacity: 0, y: -20, duration: 0.4, ease: "power2.in" })
      .to(loader, { yPercent: -100, duration: 0.9, ease: "expo.inOut", onComplete: done }, "-=0.1")
      .to(".hero__bigword span", { opacity: 1, yPercent: 0, duration: 1.4, ease: "expo.out" }, "-=0.45")
      .to(".hero__name .char > span", { yPercent: 0, duration: 1.1, stagger: 0.035, ease: "expo.out" }, "<0.1")
      .to(".hero__halo, .hero__orbit", { scale: 1, opacity: 1, duration: 1.4, ease: "expo.out" }, "<")
      .to(".hero__person", { y: 0, opacity: 1, scale: 1, duration: 1.4, ease: "expo.out" }, "<0.1")
      .to(".hero__in", { y: 0, opacity: 1, duration: 0.9, stagger: 0.08, ease: "power3.out" }, "<0.25")
      .to(".chip", { scale: 1, opacity: 1, duration: 0.8, stagger: 0.1, ease: "back.out(2)" }, "<0.2");
  });

  /* ---------- Parallaxe souris (calques à profondeur data-depth) ---------- */

  if (finePointer) {
    var layers = Array.prototype.map.call(document.querySelectorAll(".hero [data-depth]"), function (node) {
      var depth = parseFloat(node.getAttribute("data-depth")) || 0;
      return {
        depth: depth,
        x: gsap.quickTo(node, "x", { duration: 1.2, ease: "power3.out" }),
        y: gsap.quickTo(node, "y", { duration: 1.2, ease: "power3.out" })
      };
    });
    var hero = document.getElementById("hero");
    hero.addEventListener("pointermove", function (e) {
      var nx = e.clientX / window.innerWidth - 0.5;
      var ny = e.clientY / window.innerHeight - 0.5;
      layers.forEach(function (l) { l.x(nx * l.depth * -28); l.y(ny * l.depth * -20); });
    });
    hero.addEventListener("pointerleave", function () {
      layers.forEach(function (l) { l.x(0); l.y(0); });
    });
  }

  /* ---------- Parallaxe au scroll ---------- */

  var heroScroll = { trigger: "#hero", start: "top top", end: "bottom top", scrub: true };
  gsap.to(".hero__stage", { yPercent: 18, ease: "none", scrollTrigger: heroScroll });
  gsap.to(".hero__text", { yPercent: 30, opacity: 0.1, ease: "none", scrollTrigger: heroScroll });
  gsap.to(".hero__bigword", { xPercent: -18, ease: "none", scrollTrigger: heroScroll });

  /* ---------- Bandeau défilant (vitesse liée au scroll) ---------- */

  var marqueeTween = null;
  function buildMarquee() {
    var track = document.getElementById("marquee");
    if (!track || !window.SITE_CONTENT) return;
    var lang = root.lang || "fr";
    var labels = Object.keys(window.SITE_CONTENT.domains).map(function (k) {
      var d = window.SITE_CONTENT.domains[k];
      return d[lang] || d.en;
    });
    var group = document.createElement("div");
    group.className = "marquee__group";
    labels.concat(labels).forEach(function (txt) {
      var s = document.createElement("span");
      s.textContent = txt;
      group.appendChild(s);
      var dot = document.createElement("i");
      group.appendChild(dot);
    });
    track.innerHTML = "";
    track.appendChild(group);
    track.appendChild(group.cloneNode(true));
    if (!gsap || reduced) return;
    if (marqueeTween) marqueeTween.kill();
    gsap.set(track, { xPercent: 0 });
    marqueeTween = gsap.to(track, { xPercent: -50, duration: 28, ease: "none", repeat: -1 });
  }
  buildMarquee();
  ScrollTrigger.create({
    onUpdate: function (self) {
      if (!marqueeTween) return;
      var v = Math.min(4, 1 + Math.abs(self.getVelocity()) / 600);
      gsap.to(marqueeTween, { timeScale: self.direction < 0 ? -v : v, duration: 0.3, overwrite: true });
    }
  });

  /* ---------- Apparitions au scroll ---------- */

  // Titres : rideau qui se lève (fonctionne dans toutes les langues, y compris l'arabe).
  gsap.utils.toArray(".section h2").forEach(function (h) {
    gsap.fromTo(h, { clipPath: "inset(0 0 100% 0)", y: 40 }, {
      clipPath: "inset(0 0 0% 0)", y: 0, duration: 1.2, ease: "expo.out",
      scrollTrigger: { trigger: h, start: "top 88%" }
    });
  });

  // Blocs statiques marqués .reveal
  gsap.utils.toArray(".reveal").forEach(function (n) {
    n.classList.add("is-visible");
    gsap.fromTo(n, { y: 50, opacity: 0 }, {
      y: 0, opacity: 1, duration: 1.1, ease: "power3.out",
      scrollTrigger: { trigger: n, start: "top 90%" }
    });
  });

  // Chiffres clés qui comptent
  document.querySelectorAll(".stat strong").forEach(function (el) {
    var target = parseInt(el.textContent, 10);
    if (isNaN(target)) return;
    var from = target > 1000 ? target - 30 : 0;
    var obj = { v: from };
    el.textContent = from;
    gsap.to(obj, {
      v: target, duration: 1.8, ease: "power2.out",
      scrollTrigger: { trigger: el, start: "top 92%" },
      onUpdate: function () { el.textContent = Math.round(obj.v); }
    });
  });

  // Ligne de la frise qui se dessine
  function animateTimelines() {
    document.querySelectorAll(".timeline").forEach(function (tl) {
      gsap.fromTo(tl, { "--line": 0 }, {
        "--line": 1, ease: "none",
        scrollTrigger: { trigger: tl, start: "top 75%", end: "bottom 60%", scrub: true }
      });
    });
  }
  animateTimelines();

  // Éléments générés (projets, frise, compétences, galerie) : on les anime à chaque rendu.
  function animateDynamic() {
    ScrollTrigger.batch(".project:not(.is-in), .tl:not(.is-in), .skill:not(.is-in), .training li:not(.is-in), .gallery button:not(.is-in)", {
      start: "top 92%",
      onEnter: function (batch) {
        batch.forEach(function (n) { n.classList.add("is-in"); });
        gsap.fromTo(batch, { y: 60, opacity: 0, rotateX: -8 }, {
          y: 0, opacity: 1, rotateX: 0, duration: 1, stagger: 0.07, ease: "power3.out", clearProps: "transform,opacity"
        });
      }
    });

    // Parallaxe interne des photos de la galerie
    document.querySelectorAll(".gallery img:not(.has-px)").forEach(function (img) {
      img.classList.add("has-px");
      gsap.fromTo(img, { yPercent: -6, scale: 1.14 }, {
        yPercent: 6, scale: 1.14, ease: "none",
        scrollTrigger: { trigger: img.parentNode, start: "top bottom", end: "bottom top", scrub: true }
      });
    });

    bindTilt();
    ScrollTrigger.refresh();
  }

  document.addEventListener("site:render", function () {
    buildMarquee();
    animateDynamic();
  });
  document.addEventListener("site:filter", function () { ScrollTrigger.refresh(); });
  animateDynamic();

  /* ---------- Cartes inclinables ---------- */

  function bindTilt() {
    if (!finePointer) return;
    document.querySelectorAll(".project:not(.has-tilt), .domain:not(.has-tilt)").forEach(function (card) {
      card.classList.add("has-tilt");
      var rx = gsap.quickTo(card, "rotationX", { duration: 0.6, ease: "power3.out" });
      var ry = gsap.quickTo(card, "rotationY", { duration: 0.6, ease: "power3.out" });
      card.addEventListener("pointermove", function (e) {
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width;
        var py = (e.clientY - r.top) / r.height;
        rx((0.5 - py) * 10);
        ry((px - 0.5) * 12);
        card.style.setProperty("--mx", px * 100 + "%");
        card.style.setProperty("--my", py * 100 + "%");
      });
      card.addEventListener("pointerleave", function () { rx(0); ry(0); });
    });
  }

  /* ---------- Boutons magnétiques ---------- */

  if (finePointer) {
    document.querySelectorAll(".magnetic").forEach(function (btn) {
      var x = gsap.quickTo(btn, "x", { duration: 0.5, ease: "power3.out" });
      var y = gsap.quickTo(btn, "y", { duration: 0.5, ease: "power3.out" });
      btn.addEventListener("pointermove", function (e) {
        var r = btn.getBoundingClientRect();
        x((e.clientX - r.left - r.width / 2) * 0.35);
        y((e.clientY - r.top - r.height / 2) * 0.45);
      });
      btn.addEventListener("pointerleave", function () {
        gsap.to(btn, { x: 0, y: 0, duration: 0.9, ease: "elastic.out(1, 0.35)" });
      });
    });
  }

  /* ---------- Curseur ---------- */

  if (finePointer) {
    root.classList.add("has-cursor");
    var dot = document.querySelector(".cursor__dot");
    var ring = document.querySelector(".cursor__ring");
    var dx = gsap.quickTo(dot, "x", { duration: 0.12, ease: "power3.out" });
    var dy = gsap.quickTo(dot, "y", { duration: 0.12, ease: "power3.out" });
    var rx2 = gsap.quickTo(ring, "x", { duration: 0.5, ease: "power3.out" });
    var ry2 = gsap.quickTo(ring, "y", { duration: 0.5, ease: "power3.out" });
    window.addEventListener("pointermove", function (e) {
      dx(e.clientX); dy(e.clientY); rx2(e.clientX); ry2(e.clientY);
    }, { passive: true });
    document.addEventListener("pointerover", function (e) {
      var hot = e.target.closest("a, button, .project, .gallery button");
      root.classList.toggle("cursor-hover", !!hot);
      root.classList.toggle("cursor-view", !!(hot && hot.matches(".gallery button")));
    });
    document.addEventListener("pointerleave", function () { root.classList.add("cursor-out"); });
    document.addEventListener("pointerenter", function () { root.classList.remove("cursor-out"); });
  }
})();
