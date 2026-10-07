(function () {
  "use strict";

  var I18N = window.I18N;
  var C = window.SITE_CONTENT;
  var LANGS = ["fr", "en", "ar", "ru"];
  var state = { lang: "fr", filter: "all" };

  /* ---------- Helpers ---------- */

  // Renvoie le texte dans la langue courante, avec repli EN puis FR.
  function t(value) {
    if (value == null) return "";
    if (typeof value === "string") return value;
    return value[state.lang] || value.en || value.fr || "";
  }

  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        if (k === "text") node.textContent = attrs[k];
        else node.setAttribute(k, attrs[k]);
      });
    }
    (children || []).forEach(function (c) { if (c) node.appendChild(c); });
    return node;
  }

  function storage(key, value) {
    try {
      if (value === undefined) return localStorage.getItem(key);
      localStorage.setItem(key, value);
    } catch (e) { return null; }
  }

  /* ---------- Rendering ---------- */

  function renderStatic() {
    var dict = I18N[state.lang];
    document.querySelectorAll("[data-i18n]").forEach(function (node) {
      var key = node.getAttribute("data-i18n");
      if (dict[key] != null) node.textContent = dict[key];
    });
    document.querySelectorAll("[data-domain-label]").forEach(function (node) {
      node.textContent = t(C.domains[node.getAttribute("data-domain-label")]);
    });
    document.title = dict["meta.title"];
  }

  function renderFilters() {
    var box = document.getElementById("filters");
    box.innerHTML = "";
    var keys = ["all"].concat(Object.keys(C.domains));
    keys.forEach(function (key) {
      var count = key === "all" ? C.PROJECTS.length
        : C.PROJECTS.filter(function (p) { return p.domains.indexOf(key) !== -1; }).length;
      if (!count) return;
      var label = key === "all" ? I18N[state.lang]["portfolio.all"] : t(C.domains[key]);
      var btn = el("button", { type: "button", "data-filter": key, "aria-pressed": String(state.filter === key) }, [
        document.createTextNode(label),
        el("span", { class: "count", text: String(count) })
      ]);
      btn.addEventListener("click", function () {
        state.filter = key;
        renderFilters();
        applyFilter();
      });
      box.appendChild(btn);
    });
  }

  function renderProjects() {
    var box = document.getElementById("projects");
    box.innerHTML = "";
    C.PROJECTS.forEach(function (p) {
      var tags = el("div", { class: "project__tags" }, p.domains.map(function (d) {
        return el("span", { class: "tag", "data-d": d, text: t(C.domains[d]) });
      }));
      var card = el("article", { class: "project", "data-domains": p.domains.join(" ") }, [
        p.image ? el("img", { class: "project__img", src: p.image, alt: t(p.title), loading: "lazy" }) : null,
        el("div", { class: "project__meta" }, [el("span", { class: "project__year", text: p.year }), tags]),
        el("h3", { text: t(p.title) }),
        el("p", { text: t(p.desc) }),
        p.link ? el("a", { class: "project__link", href: p.link, target: "_blank", rel: "noopener", text: "→ " + (t(p.linkLabel) || p.link) }) : null
      ]);
      box.appendChild(card);
    });
    applyFilter();
  }

  function applyFilter() {
    document.querySelectorAll("#projects .project").forEach(function (card) {
      var show = state.filter === "all" || card.getAttribute("data-domains").split(" ").indexOf(state.filter) !== -1;
      card.hidden = !show;
    });
  }

  function renderTimeline(id, items) {
    var box = document.getElementById(id);
    box.innerHTML = "";
    items.forEach(function (it) {
      var logo = it.logo
        ? el("span", { class: "tl__logo" }, [el("img", { src: it.logo, alt: "", loading: "lazy" })])
        : el("span", { class: "tl__logo tl__logo--dot" });
      box.appendChild(el("li", { class: "tl" }, [
        logo,
        el("div", null, [
          el("div", { class: "tl__period", text: it.period }),
          el("div", { class: "tl__role", text: t(it.role) }),
          el("div", { class: "tl__org", text: t(it.org) })
        ])
      ]));
    });
  }

  function renderTraining() {
    var box = document.getElementById("training");
    box.innerHTML = "";
    C.TRAINING.forEach(function (it) {
      box.appendChild(el("li", null, [el("b", { text: it.year }), el("span", { text: t(it.text) })]));
    });
  }

  function renderSkills() {
    var box = document.getElementById("skillGroups");
    box.innerHTML = "";
    C.SKILLS.forEach(function (g) {
      box.appendChild(el("div", { class: "skill reveal is-visible" }, [
        el("h3", { text: t(g.title) }),
        el("ul", null, g.items.map(function (s) { return el("li", { text: t(s) }); }))
      ]));
    });
  }

  function renderGallery() {
    var box = document.getElementById("galleryGrid");
    box.innerHTML = "";
    C.GALLERY.forEach(function (g) {
      var btn = el("button", { type: "button" }, [
        el("img", { src: g.src, alt: t(g.caption), loading: "lazy" }),
        el("span", { text: t(g.caption) })
      ]);
      btn.addEventListener("click", function () { openLightbox(g.src, t(g.caption)); });
      box.appendChild(btn);
    });
  }

  function render() {
    renderStatic();
    renderFilters();
    renderProjects();
    renderTimeline("experience", C.EXPERIENCE);
    renderTimeline("education", C.EDUCATION);
    renderTraining();
    renderSkills();
    renderGallery();
  }

  /* ---------- Language ---------- */

  function setLang(lang, save) {
    if (LANGS.indexOf(lang) === -1) lang = "fr";
    state.lang = lang;
    var root = document.documentElement;
    root.lang = lang;
    root.dir = lang === "ar" ? "rtl" : "ltr";
    document.querySelectorAll(".lang button").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.getAttribute("data-lang") === lang));
    });
    if (save) {
      storage("og-lang", lang);
      var url = new URL(window.location.href);
      url.searchParams.set("lang", lang);
      history.replaceState(null, "", url);
    }
    render();
  }

  function initialLang() {
    var fromUrl = new URLSearchParams(window.location.search).get("lang");
    if (fromUrl && LANGS.indexOf(fromUrl) !== -1) return fromUrl;
    var saved = storage("og-lang");
    if (saved && LANGS.indexOf(saved) !== -1) return saved;
    var nav = (navigator.language || "fr").slice(0, 2).toLowerCase();
    return LANGS.indexOf(nav) !== -1 ? nav : "fr";
  }

  /* ---------- Lightbox ---------- */

  var lb = document.getElementById("lightbox");
  function openLightbox(src, caption) {
    lb.querySelector("img").src = src;
    lb.querySelector("img").alt = caption;
    lb.querySelector("figcaption").textContent = caption;
    lb.hidden = false;
    lb.querySelector(".lightbox__close").focus();
  }
  function closeLightbox() { lb.hidden = true; }
  lb.addEventListener("click", function (e) { if (e.target === lb || e.target.classList.contains("lightbox__close")) closeLightbox(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !lb.hidden) closeLightbox(); });

  /* ---------- Nav ---------- */

  var nav = document.querySelector(".nav");
  var menu = document.getElementById("menu");
  var burger = document.querySelector(".burger");

  function onScroll() { nav.classList.toggle("is-scrolled", window.scrollY > 20); }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  burger.addEventListener("click", function () {
    var open = burger.getAttribute("aria-expanded") !== "true";
    burger.setAttribute("aria-expanded", String(open));
    menu.classList.toggle("is-open", open);
  });
  menu.addEventListener("click", function (e) {
    if (e.target.tagName === "A") {
      burger.setAttribute("aria-expanded", "false");
      menu.classList.remove("is-open");
    }
  });

  document.querySelectorAll(".lang button").forEach(function (b) {
    b.addEventListener("click", function () { setLang(b.getAttribute("data-lang"), true); });
  });

  /* ---------- Scroll effects ---------- */

  if ("IntersectionObserver" in window) {
    var revealObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-visible"); revealObs.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll(".reveal").forEach(function (n) { revealObs.observe(n); });

    var links = document.querySelectorAll(".nav__links a");
    var spyObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        links.forEach(function (a) { a.classList.toggle("is-active", a.getAttribute("href") === "#" + en.target.id); });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    document.querySelectorAll("main section[id]").forEach(function (s) { spyObs.observe(s); });
  } else {
    document.querySelectorAll(".reveal").forEach(function (n) { n.classList.add("is-visible"); });
  }

  document.getElementById("year").textContent = new Date().getFullYear();
  setLang(initialLang(), false);
})();
