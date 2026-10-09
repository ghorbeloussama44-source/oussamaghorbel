/*
 * Vidéo de la section À propos : même source que l'en-tête (version mobile sous 700 px),
 * chargée seulement quand elle approche de l'écran, lue sans son et mise en pause hors écran.
 * Bouton lecture/pause et bouton son. Avec « animations réduites », rien ne démarre seul.
 */
(function () {
  "use strict";

  var video = document.getElementById("poseVideo");
  if (!video) return;
  var playBtn = document.getElementById("posePlay");
  var soundBtn = document.getElementById("poseSound");
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var small = window.matchMedia("(max-width: 700px)").matches;
  var userPaused = reduced;
  var loaded = false;

  function load() {
    if (loaded) return;
    loaded = true;
    video.src = video.getAttribute(small ? "data-src-mobile" : "data-src");
    video.preload = "auto";
  }

  function play() {
    load();
    var p = video.play();
    if (p && p.catch) p.catch(function () { sync(); });
  }

  function sync() {
    playBtn.setAttribute("aria-pressed", String(video.paused));
    soundBtn.setAttribute("aria-pressed", String(!video.muted));
  }

  playBtn.addEventListener("click", function () {
    if (video.paused) { userPaused = false; play(); }
    else { userPaused = true; video.pause(); }
    sync();
  });

  soundBtn.addEventListener("click", function () {
    load();
    video.muted = !video.muted;
    if (!video.muted && video.paused) { userPaused = false; play(); }
    sync();
  });

  video.addEventListener("play", sync);
  video.addEventListener("pause", sync);

  if (!("IntersectionObserver" in window)) return;
  new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        if (!userPaused && !reduced) play();
      } else if (!video.paused) {
        video.pause();
      }
    });
  }, { threshold: 0.35 }).observe(video);
})();
