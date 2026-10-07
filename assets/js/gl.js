/*
 * Fond WebGL du hero : une étoffe de soie qui ondule, avec une fine trame
 * de tissage et un reflet doré qui suit la souris.
 * Repli : si WebGL est indisponible, le dégradé CSS de .hero reste visible.
 */
(function () {
  "use strict";

  var canvas = document.getElementById("gl");
  if (!canvas) return;
  var gl = canvas.getContext("webgl", { antialias: false, alpha: false, powerPreference: "low-power" });
  if (!gl) return;

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var VERT = "attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}";

  var FRAG = [
    "precision mediump float;",
    "uniform vec2 uRes;",
    "uniform float uTime;",
    "uniform vec2 uMouse;",
    "uniform float uScroll;",

    "float hash(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}",
    "float noise(vec2 p){vec2 i=floor(p),f=fract(p);vec2 u=f*f*(3.-2.*f);",
    "  return mix(mix(hash(i),hash(i+vec2(1,0)),u.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),u.x),u.y);}",
    "float fbm(vec2 p){float v=0.,a=.5;mat2 r=mat2(.8,.6,-.6,.8);",
    "  for(int i=0;i<5;i++){v+=a*noise(p);p=r*p*2.02;a*=.5;}return v;}",

    "void main(){",
    "  vec2 uv=gl_FragCoord.xy/uRes;",
    "  vec2 p=(gl_FragCoord.xy-.5*uRes)/uRes.y;",
    "  float t=uTime*.05;",
    "  vec2 m=(uMouse-.5)*vec2(uRes.x/uRes.y,1.);",
    "  float md=exp(-3.5*length(p-m));",
    "  p.y+=uScroll*.35;",
    "  vec2 q=vec2(fbm(p*1.1+t),fbm(p*1.1+vec2(5.2,1.3)-t));",
    "  vec2 r=vec2(fbm(p*1.4+2.*q+vec2(1.7,9.2)+t*1.4),fbm(p*1.4+2.*q+vec2(8.3,2.8)-t));",
    "  float f=fbm(p*1.2+2.4*r+md*.35);",
    // plis de l'étoffe
    "  float folds=sin((p.x*1.6+p.y*.7+3.2*r.x+md*.6)*3.2+uTime*.18);",
    "  float sheen=pow(.5+.5*folds,7.)*smoothstep(.25,.85,f);",
    // trame de tissage très discrète
    "  vec2 g=gl_FragCoord.xy*.9;",
    "  float weave=(sin(g.x)*.5+.5)*(sin(g.y)*.5+.5);",
    "  vec3 ink=vec3(.067,.075,.122);",
    "  vec3 indigo=vec3(.16,.17,.32);",
    "  vec3 gold=vec3(.86,.68,.33);",
    "  vec3 col=mix(ink,indigo,smoothstep(.2,.9,f)*.85);",
    "  col+=gold*sheen*(.55+md*.9);",
    "  col+=gold*md*.08;",
    "  col*=.96+.06*weave;",
    // vignette, plus sombre côté texte
    "  float vig=smoothstep(1.25,.2,length((uv-vec2(.62,.5))*vec2(1.25,1.)));",
    "  col*=.55+.45*vig;",
    "  gl_FragColor=vec4(col,1.);",
    "}"
  ].join("\n");

  function shader(type, src) {
    var s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { console.warn(gl.getShaderInfoLog(s)); return null; }
    return s;
  }

  var vs = shader(gl.VERTEX_SHADER, VERT);
  var fs = shader(gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) return;
  var prog = gl.createProgram();
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
  gl.useProgram(prog);

  var buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  var loc = gl.getAttribLocation(prog, "p");
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  var uRes = gl.getUniformLocation(prog, "uRes");
  var uTime = gl.getUniformLocation(prog, "uTime");
  var uMouse = gl.getUniformLocation(prog, "uMouse");
  var uScroll = gl.getUniformLocation(prog, "uScroll");

  var mouse = { x: 0.7, y: 0.6, tx: 0.7, ty: 0.6 };
  var scroll = 0;
  var visible = true;
  var start = performance.now();

  function resize() {
    // Rendu à résolution réduite : l'effet est doux, cela économise beaucoup de GPU.
    var dpr = Math.min(window.devicePixelRatio || 1, 1.5) * 0.6;
    var w = Math.max(1, Math.round(canvas.clientWidth * dpr));
    var h = Math.max(1, Math.round(canvas.clientHeight * dpr));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
    }
    gl.uniform2f(uRes, w, h);
  }

  function draw(now) {
    mouse.x += (mouse.tx - mouse.x) * 0.06;
    mouse.y += (mouse.ty - mouse.y) * 0.06;
    gl.uniform1f(uTime, reduced ? 12.0 : (now - start) / 1000);
    gl.uniform2f(uMouse, mouse.x, mouse.y);
    gl.uniform1f(uScroll, scroll);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  function loop(now) {
    if (visible && !document.hidden) draw(now);
    requestAnimationFrame(loop);
  }

  window.addEventListener("resize", function () { resize(); if (reduced) draw(0); });
  window.addEventListener("pointermove", function (e) {
    var r = canvas.getBoundingClientRect();
    mouse.tx = (e.clientX - r.left) / r.width;
    mouse.ty = 1 - (e.clientY - r.top) / r.height;
  }, { passive: true });
  window.addEventListener("scroll", function () {
    scroll = Math.min(1, window.scrollY / Math.max(1, canvas.clientHeight));
  }, { passive: true });

  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) { visible = entries[0].isIntersecting; }).observe(canvas);
  }

  resize();
  canvas.classList.add("is-ready");
  if (reduced) draw(0);
  else requestAnimationFrame(loop);
})();
