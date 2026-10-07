/*
 * Éclats du hero : étoiles dorées qui scintillent sur deux calques
 * (derrière et devant le personnage). Chaque éclat a une profondeur :
 * les plus proches sont plus grands et bougent davantage avec la souris
 * et le scroll. Le mouvement de la souris sème aussi de petits éclats.
 */
(function () {
  "use strict";

  var hero = document.getElementById("hero");
  var back = document.getElementById("sparkBack");
  var front = document.getElementById("sparkFront");
  if (!hero || !back || !front || !back.getContext) return;

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var layers = [
    { canvas: back, ctx: back.getContext("2d"), parts: [], minZ: 0.15, maxZ: 0.6 },
    { canvas: front, ctx: front.getContext("2d"), parts: [], minZ: 0.6, maxZ: 1.5 }
  ];
  var trail = [];
  var W = 0, H = 0, dpr = 1;
  var mouse = { x: 0, y: 0, tx: 0, ty: 0 };
  var scrollY = 0;
  var visible = true;
  var GOLD = ["255,226,150", "230,199,124", "255,244,214", "200,162,74"];

  function rand(a, b) { return a + Math.random() * (b - a); }

  function make(layer, anywhere) {
    var z = rand(layer.minZ, layer.maxZ);
    return {
      x: rand(0, W), y: anywhere ? rand(0, H) : H + 20,
      z: z,
      r: rand(0.9, 2.0) * z * 1.8,
      vy: rand(6, 18) * z,
      vx: rand(-4, 4) * z,
      phase: rand(0, Math.PI * 2),
      speed: rand(0.6, 1.8),
      color: GOLD[(Math.random() * GOLD.length) | 0],
      star: Math.random() < 0.35
    };
  }

  function resize() {
    var r = hero.getBoundingClientRect();
    W = r.width; H = r.height;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    var area = W * H;
    var counts = [Math.round(area / 22000), Math.round(area / 42000)];
    layers.forEach(function (l, i) {
      l.canvas.width = Math.round(W * dpr);
      l.canvas.height = Math.round(H * dpr);
      l.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var n = Math.min(counts[i], i ? 40 : 70);
      l.parts = [];
      for (var k = 0; k < n; k++) l.parts.push(make(l, true));
    });
  }

  // Étoile à quatre branches avec halo : l'« éclat ».
  function glint(ctx, x, y, r, alpha, color, star) {
    var g = ctx.createRadialGradient(x, y, 0, x, y, r * 4);
    g.addColorStop(0, "rgba(" + color + "," + alpha + ")");
    g.addColorStop(0.25, "rgba(" + color + "," + alpha * 0.35 + ")");
    g.addColorStop(1, "rgba(" + color + ",0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, r * 4, 0, Math.PI * 2);
    ctx.fill();
    if (!star) return;
    var L = Math.min(r * 5, 18);
    ctx.strokeStyle = "rgba(" + color + "," + alpha * 0.9 + ")";
    ctx.lineWidth = Math.max(0.6, r * 0.35);
    ctx.beginPath();
    ctx.moveTo(x - L, y); ctx.lineTo(x + L, y);
    ctx.moveTo(x, y - L); ctx.lineTo(x, y + L);
    ctx.stroke();
  }

  function frame(now, dt) {
    var t = now / 1000;
    mouse.x += (mouse.tx - mouse.x) * 0.05;
    mouse.y += (mouse.ty - mouse.y) * 0.05;

    layers.forEach(function (l) {
      var ctx = l.ctx;
      ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = "lighter";
      l.parts.forEach(function (p, i) {
        if (!reduced) {
          p.y -= p.vy * dt;
          p.x += p.vx * dt + Math.sin(t * 0.6 + p.phase) * 0.15 * p.z;
          if (p.y < -30 || p.x < -40 || p.x > W + 40) l.parts[i] = make(l, false);
        }
        var tw = 0.5 + 0.5 * Math.sin(t * p.speed * 2.2 + p.phase);
        var alpha = Math.pow(tw, 3) * (0.35 + 0.55 * Math.min(1, p.z));
        if (alpha < 0.02) return;
        var px = p.x - mouse.x * 40 * p.z;
        var py = p.y - mouse.y * 30 * p.z - scrollY * 0.5 * p.z;
        glint(ctx, px, py, p.r, alpha, p.color, p.star && tw > 0.7);
      });
    });

    // Éclats semés par la souris (calque avant)
    var fctx = layers[1].ctx;
    for (var i = trail.length - 1; i >= 0; i--) {
      var s = trail[i];
      s.life -= dt;
      if (s.life <= 0) { trail.splice(i, 1); continue; }
      s.x += s.vx * dt; s.y += s.vy * dt; s.vy += 30 * dt;
      var k = s.life / s.max;
      glint(fctx, s.x, s.y, s.r * (0.6 + k * 0.6), k, s.color, true);
    }
  }

  var last = performance.now();
  function loop(now) {
    var dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    if (visible && !document.hidden) frame(now, dt);
    requestAnimationFrame(loop);
  }

  window.addEventListener("resize", resize);
  window.addEventListener("scroll", function () { scrollY = Math.min(window.scrollY, H); }, { passive: true });

  var lastEmit = 0;
  hero.addEventListener("pointermove", function (e) {
    var r = hero.getBoundingClientRect();
    mouse.tx = (e.clientX - r.left) / r.width - 0.5;
    mouse.ty = (e.clientY - r.top) / r.height - 0.5;
    if (reduced || !fine) return;
    var now = performance.now();
    if (now - lastEmit < 45 || trail.length > 40) return;
    lastEmit = now;
    trail.push({
      x: e.clientX - r.left + rand(-6, 6), y: e.clientY - r.top + rand(-6, 6),
      vx: rand(-20, 20), vy: rand(-40, -10), r: rand(1.2, 2.4),
      life: 0.9, max: 0.9, color: GOLD[(Math.random() * GOLD.length) | 0]
    });
  });

  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (en) { visible = en[0].isIntersecting; }).observe(hero);
  }

  resize();
  if (reduced) frame(4000, 0);
  else requestAnimationFrame(loop);
})();
