/*
 * Vidéo de l'en-tête : version mobile sous 700 px, lecture automatique sans son,
 * pause quand l'en-tête sort de l'écran. Boutons pause et son.
 * Avec « animations réduites », la vidéo ne démarre pas seule : l'image d'aperçu reste.
 */
(function () {
  "use strict";

  var video = document.getElementById("heroVideo");
  if (!video) return;
  var playBtn = document.getElementById("heroPlay");
  var soundBtn = document.getElementById("heroSound");
  var watchBtn = document.getElementById("heroWatch");
  var timeEl = document.getElementById("heroTime");
  var durEl = document.getElementById("heroDur");
  var progress = document.getElementById("heroProgress");
  var hero = document.getElementById("hero");
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var userPaused = reduced;
  var visible = true;

  function label(btn, key) {
    var span = btn.querySelector("[data-i18n]");
    span.setAttribute("data-i18n", key);
    var dict = window.I18N && window.I18N[document.documentElement.lang || "fr"];
    if (dict && dict[key]) span.textContent = dict[key];
  }

  function sync() {
    var paused = video.paused;
    playBtn.setAttribute("aria-pressed", String(paused));
    label(playBtn, paused ? "video.play" : "video.pause");
    soundBtn.setAttribute("aria-pressed", String(!video.muted));
    label(soundBtn, video.muted ? "video.sound" : "video.mute");
    if (watchBtn) {
      watchBtn.setAttribute("aria-pressed", String(!video.muted));
      label(watchBtn, video.muted ? "hero.watch" : "video.mute");
    }
    if (hero) hero.classList.toggle("is-sound", !video.muted);
  }

  function fmt(sec) {
    sec = Math.max(0, Math.floor(sec || 0));
    var m = Math.floor(sec / 60), r = sec % 60;
    return (m < 10 ? "0" : "") + m + ":" + (r < 10 ? "0" : "") + r;
  }

  // Minutage façon générique de film
  video.addEventListener("loadedmetadata", function () { if (durEl) durEl.textContent = fmt(video.duration); });
  video.addEventListener("timeupdate", function () {
    if (timeEl) timeEl.textContent = fmt(video.currentTime);
    if (progress && video.duration) progress.style.transform = "scaleX(" + video.currentTime / video.duration + ")";
  });
  if (progress) {
    progress.parentNode.addEventListener("click", function (e) {
      if (!video.duration) return;
      var r = progress.parentNode.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width;
      if (document.documentElement.dir === "rtl") x = 1 - x;
      video.currentTime = Math.min(Math.max(x, 0), 1) * video.duration;
    });
  }

  function play() {
    var p = video.play();
    if (p && p.catch) p.catch(function () { sync(); });
  }

  var small = window.matchMedia("(max-width: 700px)").matches;
  if (reduced) video.removeAttribute("autoplay");
  video.src = video.getAttribute(small ? "data-src-mobile" : "data-src");

  playBtn.addEventListener("click", function () {
    if (video.paused) { userPaused = false; play(); }
    else { userPaused = true; video.pause(); }
  });

  soundBtn.addEventListener("click", function () {
    video.muted = !video.muted;
    if (!video.muted && video.paused) { userPaused = false; play(); }
    sync();
  });

  if (watchBtn) {
    watchBtn.addEventListener("click", function () {
      if (video.muted) {
        video.muted = false;
        video.currentTime = 0;
        userPaused = false;
        play();
      } else {
        video.muted = true;
      }
      sync();
    });
  }

  ["play", "pause", "volumechange"].forEach(function (ev) { video.addEventListener(ev, sync); });
  document.addEventListener("site:render", sync);

  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting;
      if (visible && !userPaused) play();
      else if (!visible && !video.paused) video.pause();
    }, { threshold: 0.15 }).observe(video);
  }

  if (!userPaused) play();
  sync();
})();
