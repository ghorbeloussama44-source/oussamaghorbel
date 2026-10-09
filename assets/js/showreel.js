/*
 * Vidéo « showreel » : chargée seulement à l'approche de la section,
 * lue quand elle est visible, mise en pause sinon. Boutons pause et son.
 * Avec « animations réduites », la vidéo ne démarre pas seule.
 */
(function () {
  "use strict";

  var video = document.getElementById("showreelVideo");
  if (!video) return;
  var playBtn = document.getElementById("showreelPlay");
  var soundBtn = document.getElementById("showreelSound");
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var userPaused = reduced;
  var loaded = false;
  var visible = false;

  function label(btn, key) {
    var span = btn.querySelector("span");
    span.setAttribute("data-i18n", key);
    var dict = window.I18N && window.I18N[document.documentElement.lang || "fr"];
    if (dict && dict[key]) span.textContent = dict[key];
  }

  function sync() {
    var paused = video.paused;
    playBtn.setAttribute("aria-pressed", String(paused));
    label(playBtn, paused ? "showreel.play" : "showreel.pause");
    soundBtn.setAttribute("aria-pressed", String(!video.muted));
    label(soundBtn, video.muted ? "showreel.sound" : "showreel.mute");
  }

  function load() {
    if (loaded) return;
    loaded = true;
    var small = window.matchMedia("(max-width: 700px)").matches;
    video.src = video.getAttribute(small ? "data-src-mobile" : "data-src");
    video.preload = "auto";
  }

  function play() {
    var p = video.play();
    if (p && p.catch) p.catch(function () { sync(); });
  }

  function tryPlay() {
    if (userPaused || !visible) return;
    load();
    play();
  }

  playBtn.addEventListener("click", function () {
    load();
    if (video.paused) { userPaused = false; play(); }
    else { userPaused = true; video.pause(); }
  });

  soundBtn.addEventListener("click", function () {
    load();
    video.muted = !video.muted;
    if (!video.muted && video.paused) { userPaused = false; play(); }
    sync();
  });

  ["play", "pause", "volumechange"].forEach(function (ev) { video.addEventListener(ev, sync); });
  document.addEventListener("site:render", sync);

  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) load(); });
    }, { rootMargin: "600px 0px" }).observe(video);

    new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting;
      if (visible) tryPlay();
      else if (!video.paused) video.pause();
    }, { threshold: 0.25 }).observe(video);
  } else {
    load();
  }

  sync();
})();
