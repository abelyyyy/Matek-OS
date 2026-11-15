/* MATEK OS – ábrázoló motor. A modell (osztások, mintavétel) DOM-független,
   a rajzolás canvasra történik. */
(function (root) {
  'use strict';
  var MO = root.MO = root.MO || {};
  var P = MO.plot = {};

  /* ---------- modell ---------- */
  /* „Szép” tengelyosztások: 1, 2, 5 · 10^k lépésköz */
  P.ticks = function (min, max, target) {
    target = target || 8;
    var span = max - min; if (!(span > 0)) return { step: 1, list: [] };
    var raw = span / target, mag = Math.pow(10, Math.floor(Math.log(raw) / Math.LN10)), n = raw / mag;
    var step = (n < 1.5 ? 1 : n < 3.5 ? 2 : n < 7.5 ? 5 : 10) * mag;
    var list = [], first = Math.ceil(min / step - 1e-9);
    for (var i = first; i * step <= max + step * 1e-9; i++) {
      var v = i * step; list.push(Math.abs(v) < step * 1e-9 ? 0 : parseFloat(v.toPrecision(12)));
    }
    return { step: step, list: list };
  };

  /* Görbe mintavétele: szakaszokra bontva, ahol a függvény nincs értelmezve vagy ugrik */
  P.sample = function (f, xmin, xmax, n, ymin, ymax) {
    n = n || 400;
    var segs = [], cur = [], h = (xmax - xmin) / n, span = (ymax - ymin) || 1, py = NaN;
    for (var i = 0; i <= n; i++) {
      var x = xmin + i * h, y = f(x);
      if (!isFinite(y)) { if (cur.length > 1) segs.push(cur); cur = []; py = NaN; continue; }
      /* pólus: nagy ugrás ellentétes oldalra a látható tartományon kívül */
      if (isFinite(py) && Math.abs(y - py) > 2 * span && ((y > ymax && py < ymin) || (y < ymin && py > ymax))) {
        if (cur.length > 1) segs.push(cur); cur = [];
      }
      cur.push([x, y]); py = y;
    }
    if (cur.length > 1) segs.push(cur);
    return segs;
  };

  /* ---------- rajzolás ---------- */
  function css(el, name, fb) {
    try { var v = getComputedStyle(el).getPropertyValue(name).trim(); return v || fb; } catch (e) { return fb; }
  }
  var DASH = [[], [7, 4], [2, 4], [10, 3, 2, 3]];

  /* opts: { xmin,xmax,ymin,ymax, curves:[{f,label}], points:[{x,y,label}], segments:[{a:[x,y],b:[x,y]}],
             fills:[{f,g?,a,b}], interactive, equal } */
  P.create = function (canvas, opts) {
    var o = { xmin: -6, xmax: 6, ymin: -4, ymax: 4, curves: [], points: [], segments: [], fills: [], circles: [], polys: [], labels: [], arcs: [], interactive: true, grid: true, axes: true };
    for (var k in opts) o[k] = opts[k];
    var ctx = canvas.getContext('2d'), W = 0, H = 0, dpr = 1, raf = 0;

    function resize() {
      var r = canvas.getBoundingClientRect();
      dpr = Math.min(root.devicePixelRatio || 1, 3);
      W = Math.max(50, Math.round(r.width)); H = Math.max(50, Math.round(r.height));
      canvas.width = W * dpr; canvas.height = H * dpr;
      if (o.equal) { var cy = (o.ymin + o.ymax) / 2, half = (o.xmax - o.xmin) * H / W / 2; o.ymin = cy - half; o.ymax = cy + half; }
    }
    function sx(x) { return (x - o.xmin) / (o.xmax - o.xmin) * W; }
    function sy(y) { return H - (y - o.ymin) / (o.ymax - o.ymin) * H; }
    function ux(px) { return o.xmin + px / W * (o.xmax - o.xmin); }
    function uy(py) { return o.ymin + (H - py) / H * (o.ymax - o.ymin); }
    function lab(v) { return (MO.num ? MO.num(v, 6) : String(v)).replace('-', '\u2212'); }

    function draw() {
      raf = 0;
      var fg = css(canvas, '--fg', '#fff'), grid = css(canvas, '--line', '#222'), dim = css(canvas, '--dim', '#888');
      var cols = [css(canvas, '--c1', '#fff'), css(canvas, '--c2', '#6cb6ff'), css(canvas, '--c3', '#f0a35e'), css(canvas, '--c4', '#7ee0b0')];
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      var tx = P.ticks(o.xmin, o.xmax, Math.max(4, Math.round(W / 70))), ty = P.ticks(o.ymin, o.ymax, Math.max(3, Math.round(H / 55)));
      ctx.lineWidth = 1; ctx.strokeStyle = grid; ctx.setLineDash([]);
      if (o.grid) {
      ctx.beginPath();
      tx.list.forEach(function (v) { var x = Math.round(sx(v)) + 0.5; ctx.moveTo(x, 0); ctx.lineTo(x, H); });
      ty.list.forEach(function (v) { var y = Math.round(sy(v)) + 0.5; ctx.moveTo(0, y); ctx.lineTo(W, y); });
      ctx.stroke();
      }
      if (o.axes) {
      /* tengelyek */
      var ax = Math.min(Math.max(sy(0), 0), H), ay = Math.min(Math.max(sx(0), 0), W);
      ctx.strokeStyle = dim; ctx.beginPath();
      ctx.moveTo(0, Math.round(ax) + 0.5); ctx.lineTo(W, Math.round(ax) + 0.5);
      ctx.moveTo(Math.round(ay) + 0.5, 0); ctx.lineTo(Math.round(ay) + 0.5, H); ctx.stroke();
      ctx.fillStyle = dim; ctx.font = '11px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';
      ctx.textBaseline = 'top'; ctx.textAlign = 'center';
      var lyPos = Math.min(Math.max(ax + 4, 2), H - 14);
      tx.list.forEach(function (v) { var px = sx(v); if (v !== 0 && px > 14 && px < W - 14) ctx.fillText(lab(v), px, lyPos); });
      ctx.textBaseline = 'middle';
      var left = ay > W - 40; ctx.textAlign = left ? 'right' : 'left';
      ty.list.forEach(function (v) { var py = sy(v); if (v !== 0 && py > 10 && py < H - 10) ctx.fillText(lab(v), left ? ay - 5 : ay + 5, py); });
      ctx.textAlign = 'right'; ctx.textBaseline = 'bottom'; ctx.fillText('x', W - 4, Math.max(ax - 3, 12));
      ctx.textAlign = 'left'; ctx.textBaseline = 'top'; ctx.fillText('y', Math.min(ay + 5, W - 12), 3);

      }
      /* sokszögek, törött vonalak */
      o.polys.forEach(function (pl) {
        if (!pl.pts || pl.pts.length < 2) return;
        ctx.beginPath(); pl.pts.forEach(function (q, i) { if (i) ctx.lineTo(sx(q[0]), sy(q[1])); else ctx.moveTo(sx(q[0]), sy(q[1])); });
        if (pl.close !== false) ctx.closePath();
        var pc = pl.dim ? dim : cols[(pl.color || 0) % 4];
        if (pl.fill) { ctx.globalAlpha = pl.alpha || 0.16; ctx.fillStyle = pc; ctx.fill(); ctx.globalAlpha = 1; }
        if (pl.stroke !== false) { ctx.strokeStyle = pc; ctx.lineWidth = pl.w || 1.5; ctx.setLineDash(pl.dash || []); ctx.stroke(); ctx.setLineDash([]); }
      });
      /* körök (sugár a koordináta-rendszer egységében) */
      o.circles.forEach(function (c) {
        var rx = Math.abs(sx(c.x + c.r) - sx(c.x)), ry = Math.abs(sy(c.y + c.r) - sy(c.y)), cc = c.dim ? dim : cols[(c.color || 0) % 4];
        ctx.beginPath(); ctx.ellipse(sx(c.x), sy(c.y), rx, ry, 0, 0, 6.2832);
        if (c.fill) { ctx.globalAlpha = c.alpha || 0.14; ctx.fillStyle = cc; ctx.fill(); ctx.globalAlpha = 1; }
        ctx.strokeStyle = cc; ctx.lineWidth = c.w || 1.5; ctx.setLineDash(c.dash || []); ctx.stroke(); ctx.setLineDash([]);
      });
      /* kitöltések */
      o.fills.forEach(function (fl) {
        var n = 200, a = Math.max(fl.a, o.xmin), b = Math.min(fl.b, o.xmax); if (!(b > a)) return;
        ctx.beginPath();
        for (var i = 0; i <= n; i++) { var x = a + (b - a) * i / n, y = fl.f(x); if (!isFinite(y)) y = 0; if (i) ctx.lineTo(sx(x), sy(y)); else ctx.moveTo(sx(x), sy(y)); }
        for (var j = n; j >= 0; j--) { var x2 = a + (b - a) * j / n, y2 = fl.g ? fl.g(x2) : 0; if (!isFinite(y2)) y2 = 0; ctx.lineTo(sx(x2), sy(y2)); }
        ctx.closePath(); ctx.globalAlpha = 0.18; ctx.fillStyle = cols[(fl.color || 0) % 4]; ctx.fill(); ctx.globalAlpha = 1;
      });
      /* görbék: a szín mellett a vonalstílus is megkülönböztet */
      o.curves.forEach(function (c, idx) {
        if (!c || !c.f) return;
        var segs = P.sample(c.f, o.xmin, o.xmax, Math.min(1200, W * 2), o.ymin, o.ymax);
        ctx.strokeStyle = cols[idx % 4]; ctx.lineWidth = 2; ctx.setLineDash(DASH[idx % 4]); ctx.lineJoin = 'round';
        segs.forEach(function (s) {
          ctx.beginPath();
          for (var i = 0; i < s.length; i++) {
            var px = sx(s[i][0]), py = Math.min(Math.max(sy(s[i][1]), -5000), 5000);
            if (i) ctx.lineTo(px, py); else ctx.moveTo(px, py);
          }
          ctx.stroke();
        });
      });
      ctx.setLineDash([]);
      o.segments.forEach(function (s) {
        ctx.strokeStyle = s.dim ? dim : s.color ? cols[s.color % 4] : fg; ctx.lineWidth = s.w || 1.5; ctx.setLineDash(s.dash || []);
        ctx.beginPath(); ctx.moveTo(sx(s.a[0]), sy(s.a[1])); ctx.lineTo(sx(s.b[0]), sy(s.b[1])); ctx.stroke();
        if (s.arrow) { /* nyílhegy a b végpontnál */
          var ax1 = sx(s.a[0]), ay1 = sy(s.a[1]), bx1 = sx(s.b[0]), by1 = sy(s.b[1]), ang = Math.atan2(by1 - ay1, bx1 - ax1), L = 10;
          if (Math.hypot(bx1 - ax1, by1 - ay1) > 2) { ctx.setLineDash([]); ctx.fillStyle = ctx.strokeStyle; ctx.beginPath(); ctx.moveTo(bx1, by1); ctx.lineTo(bx1 - L * Math.cos(ang - 0.4), by1 - L * Math.sin(ang - 0.4)); ctx.lineTo(bx1 - L * Math.cos(ang + 0.4), by1 - L * Math.sin(ang + 0.4)); ctx.closePath(); ctx.fill(); }
        }
      });
      ctx.setLineDash([]);
      /* szögívek: középpont a koordináta-rendszerben, sugár képpontban, szögek radiánban (matematikai irány) */
      o.arcs.forEach(function (a) {
        ctx.strokeStyle = a.color ? cols[a.color % 4] : dim; ctx.lineWidth = 1.5; ctx.beginPath();
        ctx.arc(sx(a.x), sy(a.y), a.r || 22, -a.from, -a.to, true); ctx.stroke();
        if (a.label) { var am = (a.from + a.to) / 2, ar = (a.r || 22) + 11; ctx.fillStyle = a.color ? cols[a.color % 4] : dim; ctx.font = '12px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(a.label, sx(a.x) + ar * Math.cos(am), sy(a.y) - ar * Math.sin(am)); }
      });
      o.labels.forEach(function (l) {
        ctx.fillStyle = l.dim ? dim : l.color ? cols[l.color % 4] : fg; ctx.font = (l.size || 12) + 'px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';
        ctx.textAlign = l.align || 'left'; ctx.textBaseline = l.base || 'middle'; ctx.fillText(l.text, sx(l.x) + (l.dx || 0), sy(l.y) - (l.dy || 0));
      });
      o.points.forEach(function (p) {
        var pcol = p.color ? cols[p.color % 4] : fg;
        if (p.drag) { ctx.strokeStyle = pcol; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(sx(p.x), sy(p.y), 9, 0, 6.2832); ctx.stroke(); }
        ctx.fillStyle = pcol; ctx.beginPath(); ctx.arc(sx(p.x), sy(p.y), 4, 0, 6.2832); ctx.fill(); ctx.fillStyle = fg;
        if (p.label) { ctx.font = '12px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace'; ctx.textAlign = 'left'; ctx.textBaseline = 'bottom'; ctx.fillText(p.label, sx(p.x) + 7, sy(p.y) - 5); }
      });
    }
    function redraw() { if (!raf) raf = (root.requestAnimationFrame || setTimeout)(draw, 16); }

    function zoom(factor, cx, cy) {
      if (cx === undefined) { cx = (o.xmin + o.xmax) / 2; cy = (o.ymin + o.ymax) / 2; }
      var w = o.xmax - o.xmin; if ((w * factor < 1e-6 && factor < 1) || (w * factor > 1e7 && factor > 1)) return;
      o.xmin = cx + (o.xmin - cx) * factor; o.xmax = cx + (o.xmax - cx) * factor;
      o.ymin = cy + (o.ymin - cy) * factor; o.ymax = cy + (o.ymax - cy) * factor;
      redraw(); if (o.onview) o.onview(o);
    }

    var ptrs = {}, lastDist = 0, dragPt = null;
    /* ahol nincs mit húzni, a lap függőlegesen görgethető marad az ábra fölött is */
    canvas.style.touchAction = (o.interactive === false && !o.onDrag && !(o.points || []).some(function (p) { return p.drag; })) ? 'pan-y' : 'none';
    function hit(e) {
      var r = canvas.getBoundingClientRect(), mx = e.clientX - r.left, my = e.clientY - r.top, best = null, bd = 26;
      o.points.forEach(function (p) { if (!p.drag) return; var d = Math.hypot(sx(p.x) - mx, sy(p.y) - my); if (d < bd) { bd = d; best = p; } });
      return best;
    }
    canvas.addEventListener('pointerdown', function (e) {
      dragPt = hit(e); ptrs[e.pointerId] = { x: e.clientX, y: e.clientY };
      try { canvas.setPointerCapture(e.pointerId); } catch (er) {}
    });
    canvas.addEventListener('pointermove', function (e) {
      var p = ptrs[e.pointerId]; if (!p) return;
      var ids = Object.keys(ptrs), r = canvas.getBoundingClientRect();
      if (dragPt) {
        var nx = ux(e.clientX - r.left), ny = uy(e.clientY - r.top);
        if (o.snap) { nx = Math.round(nx / o.snap) * o.snap; ny = Math.round(ny / o.snap) * o.snap; }
        if (o.onDrag) o.onDrag(dragPt, nx, ny); else { dragPt.x = nx; dragPt.y = ny; redraw(); }
        p.x = e.clientX; p.y = e.clientY; return;
      }
      if (!o.interactive) return;
      if (ids.length === 1) {
        var dx = (e.clientX - p.x) / W * (o.xmax - o.xmin), dy = (e.clientY - p.y) / H * (o.ymax - o.ymin);
        o.xmin -= dx; o.xmax -= dx; o.ymin += dy; o.ymax += dy; redraw(); if (o.onview) o.onview(o);
      }
      p.x = e.clientX; p.y = e.clientY;
      if (ids.length === 2) {
        var a = ptrs[ids[0]], b = ptrs[ids[1]], dist = Math.hypot(a.x - b.x, a.y - b.y);
        if (lastDist > 0 && dist > 0) zoom(lastDist / dist, ux((a.x + b.x) / 2 - r.left), uy((a.y + b.y) / 2 - r.top));
        lastDist = dist;
      }
    });
    var up = function (e) { delete ptrs[e.pointerId]; lastDist = 0; dragPt = null; };
    canvas.addEventListener('pointerup', up); canvas.addEventListener('pointercancel', up);
    canvas.addEventListener('wheel', function (e) {
      if (!o.interactive) return;
      e.preventDefault(); var r = canvas.getBoundingClientRect();
      zoom(e.deltaY > 0 ? 1.15 : 1 / 1.15, ux(e.clientX - r.left), uy(e.clientY - r.top));
    }, { passive: false });
    var ro = null;
    if (root.ResizeObserver) { ro = new ResizeObserver(function () { resize(); redraw(); }); ro.observe(canvas); }
    resize(); draw();
    return {
      opts: o, redraw: redraw, zoom: zoom,
      set: function (patch) { for (var k2 in patch) o[k2] = patch[k2]; if (o.equal) resize(); redraw(); },
      destroy: function () { if (ro) ro.disconnect(); }
    };
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = P;
})(typeof window !== 'undefined' ? window : globalThis);
