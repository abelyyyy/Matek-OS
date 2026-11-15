/* MATEK OS – egyszerű 3D-megjelenítő: forgatható drótváz és lapok, saját vetítéssel.
   A modell (forgatás, vetítés, lapok mélységi rendezése) DOM-független. */
(function (root) {
  'use strict';
  var MO = root.MO = root.MO || {};
  var P3 = MO.plot3d = {};

  /* Forgatás: előbb a függőleges (z) tengely körül az „az” szöggel, majd megdöntés az „el” szöggel */
  P3.rotate = function (p, az, el) {
    var ca = Math.cos(az), sa = Math.sin(az), ce = Math.cos(el), se = Math.sin(el);
    var x = p[0] * ca - p[1] * sa, y = p[0] * sa + p[1] * ca, z = p[2];
    return [x, y * se + z * ce, y * ce - z * se]; /* [képernyő x, képernyő fel, mélység (nagyobb = távolabb)] */
  };
  /* Párhuzamos vetítés enyhe távlattal; scale: képpont / egység */
  P3.project = function (p, view) {
    var r = P3.rotate(p, view.az, view.el), k = view.persp ? view.dist / (view.dist + r[2]) : 1;
    return { x: view.cx + r[0] * view.scale * k, y: view.cy - r[1] * view.scale * k, depth: r[2] };
  };
  /* Lapok rendezése hátulról előre (festő algoritmus) a csúcsok átlagos mélysége szerint */
  P3.sortFaces = function (faces, depths) {
    return faces.map(function (f, i) { var s = 0; f.v.forEach(function (k) { s += depths[k]; }); return { f: f, d: s / f.v.length, i: i }; })
      .sort(function (a, b) { return b.d - a.d; }).map(function (x) { return x.f; });
  };
  P3.bounds = function (pts) {
    var m = 0; pts.forEach(function (p) { m = Math.max(m, Math.hypot(p[0], p[1], p[2])); }); return m || 1;
  };

  function css(el, name, fb) { try { var v = getComputedStyle(el).getPropertyValue(name).trim(); return v || fb; } catch (e) { return fb; } }

  /* scene: { points: [[x,y,z]], edges: [[i,j] | {v:[i,j], dash:true, color:1}], faces: [{v:[i,j,k,...], color:0..3, alpha}],
              labels: [{p:[x,y,z] | i: csúcsindex, text}], dots: [csúcsindexek] } */
  P3.create = function (canvas, scene, opts) {
    var o = { az: 0.6, el: 0.4, persp: true, zoom: 1 }; for (var k in opts) o[k] = opts[k];
    var sc = scene || { points: [], edges: [], faces: [] }, ctx = canvas.getContext('2d'), W = 0, H = 0, dpr = 1, raf = 0;
    function resize() { var r = canvas.getBoundingClientRect(); dpr = Math.min(root.devicePixelRatio || 1, 3); W = Math.max(50, Math.round(r.width)); H = Math.max(50, Math.round(r.height)); canvas.width = W * dpr; canvas.height = H * dpr; }
    function draw() {
      raf = 0;
      var fg = css(canvas, '--fg', '#fff'), dim = css(canvas, '--dim', '#888');
      var cols = [css(canvas, '--c1', '#fff'), css(canvas, '--c2', '#6cb6ff'), css(canvas, '--c3', '#f0a35e'), css(canvas, '--c4', '#7ee0b0')];
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H);
      var R = P3.bounds(sc.points), view = { az: o.az, el: o.el, persp: o.persp, cx: W / 2, cy: H / 2, scale: Math.min(W, H) * 0.42 / R * o.zoom, dist: R * 6 };
      var pr = sc.points.map(function (p) { return P3.project(p, view); }), depths = pr.map(function (q) { return q.depth; });
      P3.sortFaces(sc.faces || [], depths).forEach(function (f) {
        ctx.beginPath(); f.v.forEach(function (i, n) { if (n) ctx.lineTo(pr[i].x, pr[i].y); else ctx.moveTo(pr[i].x, pr[i].y); }); ctx.closePath();
        ctx.globalAlpha = f.alpha === undefined ? 0.13 : f.alpha; ctx.fillStyle = cols[(f.color || 0) % 4]; ctx.fill(); ctx.globalAlpha = 1;
      });
      (sc.edges || []).forEach(function (e) {
        var v = e.v || e, a = pr[v[0]], b = pr[v[1]];
        ctx.strokeStyle = e.dim ? dim : e.color ? cols[e.color % 4] : fg; ctx.lineWidth = e.w || 1.5; ctx.setLineDash(e.dash ? [5, 4] : []);
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      });
      ctx.setLineDash([]);
      (sc.dots || []).forEach(function (i) { ctx.fillStyle = fg; ctx.beginPath(); ctx.arc(pr[i].x, pr[i].y, 3.5, 0, 6.2832); ctx.fill(); });
      ctx.font = '12px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace'; ctx.fillStyle = dim; ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
      (sc.labels || []).forEach(function (l) { var q = l.p ? P3.project(l.p, view) : pr[l.i]; ctx.fillText(l.text, q.x + 6, q.y - 4); });
    }
    function redraw() { if (!raf) raf = (root.requestAnimationFrame || setTimeout)(draw, 16); }
    var last = null; canvas.style.touchAction = 'none';
    canvas.addEventListener('pointerdown', function (e) { last = { x: e.clientX, y: e.clientY }; try { canvas.setPointerCapture(e.pointerId); } catch (er) {} });
    canvas.addEventListener('pointermove', function (e) {
      if (!last) return;
      o.az += (e.clientX - last.x) * 0.01; o.el = Math.min(Math.PI / 2, Math.max(-Math.PI / 2, o.el + (e.clientY - last.y) * 0.01));
      last = { x: e.clientX, y: e.clientY }; redraw();
    });
    var up = function () { last = null; }; canvas.addEventListener('pointerup', up); canvas.addEventListener('pointercancel', up);
    var ro = null; if (root.ResizeObserver) { ro = new ResizeObserver(function () { resize(); redraw(); }); ro.observe(canvas); }
    resize(); draw();
    return {
      view: o, redraw: redraw,
      setScene: function (s) { sc = s; redraw(); },
      setView: function (v) { for (var k2 in v) o[k2] = v[k2]; redraw(); },
      zoom: function (f) { o.zoom = Math.min(4, Math.max(0.3, o.zoom / f)); redraw(); },
      destroy: function () { if (ro) ro.disconnect(); }
    };
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = P3;
})(typeof window !== 'undefined' ? window : globalThis);
