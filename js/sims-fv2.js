(function (root) {
  'use strict';
  var MO = root.MO = root.MO || {};
  var M = MO.models = MO.models || {};
  MO.simDefs = MO.simDefs || [];
  var PI = Math.PI, EPS = 1e-9;
  var K = null;

  /* =====================================================================
     MODELLEK (DOM-mentesek)
     ===================================================================== */
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var t = a % b; a = b; b = t; } return a; }
  function minus(s) { return String(s).replace(/-/g, '−'); }

  /* r = x/pi -> {n, d} (d <= 24), vagy null */
  M.fv2PiFrac = function (r) {
    for (var d = 1; d <= 24; d++) { var n = r * d; if (Math.abs(n - Math.round(n)) < 1e-9) { n = Math.round(n); var g = gcd(n, d) || 1; return { n: n / g, d: d / g }; } }
    return null;
  };
  /* r*pi TeX-ben; exact: true, ha pontos alak */
  M.fv2PiTex = function (r) {
    var f = M.fv2PiFrac(r);
    if (!f) return { tex: MO.tnum(r * PI, 3), exact: false };
    if (f.n === 0) return { tex: '0', exact: true };
    var sg = f.n < 0 ? '-' : '', an = Math.abs(f.n), num = an === 1 ? '\\pi' : an + '\\pi';
    return { tex: sg + (f.d === 1 ? num : '\\frac{' + num + '}{' + f.d + '}'), exact: true };
  };
  /* fok TeX-ben */
  M.fv2DegTex = function (deg) {
    if (Math.abs(deg - Math.round(deg)) < 1e-7) return { tex: Math.round(deg) + '^\\circ', exact: true };
    return { tex: MO.tnum(deg, 2) + '^\\circ', exact: false };
  };

  /* ---------- egységkör ---------- */
  var SQ = { 0: '0', 30: '\\frac{1}{2}', 45: '\\frac{\\sqrt{2}}{2}', 60: '\\frac{\\sqrt{3}}{2}', 90: '1' };
  var TG = { 0: '0', 30: '\\frac{\\sqrt{3}}{3}', 45: '1', 60: '\\sqrt{3}', 90: null };
  function fold(n) { return n <= 90 ? n : n <= 180 ? 180 - n : n <= 270 ? n - 180 : 360 - n; }
  function sgn(v) { return v > 1e-12 ? 1 : v < -1e-12 ? -1 : 0; }
  function withSign(abs, s) { return abs === '0' ? '0' : (s < 0 ? '-' : '') + abs; }
  M.fv2UnitCircle = function (deg) {
    var isInt = Math.abs(deg - Math.round(deg)) < 1e-9; if (isInt) deg = Math.round(deg);
    var n = ((deg % 360) + 360) % 360, rad = deg * PI / 180, s = Math.sin(rad), c = Math.cos(rad);
    var r = fold(n), notable = isInt && Object.prototype.hasOwnProperty.call(SQ, r);
    var quad = (n > 0 && n < 90) ? 1 : (n > 90 && n < 180) ? 2 : (n > 180 && n < 270) ? 3 : (n > 270 && n < 360) ? 4 : 0;
    var tgDef = isInt ? (n % 180 !== 90) : Math.abs(c) > 1e-9, ctgDef = isInt ? (n % 180 !== 0) : Math.abs(s) > 1e-9;
    var tg = tgDef ? s / c : NaN, ctg = ctgDef ? c / s : NaN;
    var o = { deg: deg, n: n, rad: rad, quad: quad, notable: notable, radTex: M.fv2PiTex(deg / 180) };
    o.sin = { def: true, v: s, tex: notable ? withSign(SQ[r], sgn(s)) : null };
    o.cos = { def: true, v: c, tex: notable ? withSign(SQ[90 - r], sgn(c)) : null };
    var tgTex = null, ctgTex = null;
    if (notable) {
      if (tgDef) tgTex = withSign(TG[r], sgn(tg));
      if (ctgDef) ctgTex = withSign(TG[90 - r], sgn(ctg));
    }
    o.tg = { def: tgDef, v: tg, tex: tgTex }; o.ctg = { def: ctgDef, v: ctg, tex: ctgTex };
    return o;
  };

  /* ---------- trigonometrikus függvény grafikonja ---------- */
  function norm2pi(t) { t = t % (2 * PI); if (t < 0) t += 2 * PI; if (Math.abs(t - 2 * PI) < 1e-12) t = 0; return t; }
  function uniq(list) { var out = []; list.forEach(function (x) { if (!out.some(function (y) { return Math.abs(x - y) < 1e-9; })) out.push(x); }); return out.sort(function (a, b) { return a - b; }); }
  M.fv2Trig = function (type, A, w, phi, d) {
    function f(x) {
      var t = w * (x - phi);
      if (type === 'sin') return A * Math.sin(t) + d;
      if (type === 'cos') return A * Math.cos(t) + d;
      return Math.abs(Math.cos(t)) < 1e-9 ? NaN : A * Math.tan(t) + d;
    }
    if (A === 0 || w === 0) {
      var cst = type === 'cos' ? A + d : d;
      if (w === 0 && type === 'cos') cst = A + d; else if (w === 0) cst = d; else cst = d;
      return { type: type, deg: true, reason: w === 0 ? 'w' : 'A', f: f, constant: cst };
    }
    var aw = Math.abs(w), T = (type === 'tg' ? PI : 2 * PI) / aw, Ae = type === 'cos' ? A : A * (w > 0 ? 1 : -1);
    var o = { type: type, deg: false, A: A, w: w, phi: phi, d: d, T: T, f: f, aw: aw, Ae: Ae };
    var c = -d / Ae, ths = [], zeros = [];
    if (type === 'sin') {
      if (Math.abs(c) <= 1 + 1e-12) { var t1 = Math.asin(Math.max(-1, Math.min(1, c))); ths = uniq([norm2pi(t1), norm2pi(PI - t1)]); }
      zeros = ths.map(function (t) { return phi + t / aw; });
      var mx = Ae > 0 ? PI / 2 : 3 * PI / 2, mn = Ae > 0 ? 3 * PI / 2 : PI / 2;
      o.max = { x: phi + mx / aw, y: d + Math.abs(A) }; o.min = { x: phi + mn / aw, y: d - Math.abs(A) };
    } else if (type === 'cos') {
      if (Math.abs(c) <= 1 + 1e-12) { var t2 = Math.acos(Math.max(-1, Math.min(1, c))); ths = uniq([norm2pi(t2), norm2pi(-t2)]); }
      zeros = ths.map(function (t) { return phi + t / aw; });
      var mx2 = A > 0 ? 0 : PI, mn2 = A > 0 ? PI : 0;
      o.max = { x: phi + mx2 / aw, y: d + Math.abs(A) }; o.min = { x: phi + mn2 / aw, y: d - Math.abs(A) };
    } else {
      zeros = [phi + Math.atan(-d / Ae) / aw];
      o.asym = [phi + T / 2];
      o.window = [phi - T / 2, phi + T / 2];
    }
    o.zeros = zeros.sort(function (a, b) { return a - b; });
    o.range = type === 'tg' ? null : [d - Math.abs(A), d + Math.abs(A)];
    return o;
  };

  /* ---------- trigonometrikus alapegyenlet ---------- */
  M.fv2TrigEq = function (type, c) {
    var fam = [], none = false, special = null;
    if (type === 'sin') {
      if (Math.abs(c) > 1 + 1e-12) none = true;
      else if (Math.abs(c - 1) < 1e-12) { fam = [{ r0: PI / 2, step: 2 * PI }]; special = 'max'; }
      else if (Math.abs(c + 1) < 1e-12) { fam = [{ r0: -PI / 2, step: 2 * PI }]; special = 'min'; }
      else if (Math.abs(c) < 1e-12) { fam = [{ r0: 0, step: PI }]; special = 'zero'; }
      else { var a = Math.asin(c); fam = [{ r0: a, step: 2 * PI }, { r0: PI - a, step: 2 * PI }]; }
    } else if (type === 'cos') {
      if (Math.abs(c) > 1 + 1e-12) none = true;
      else if (Math.abs(c - 1) < 1e-12) { fam = [{ r0: 0, step: 2 * PI }]; special = 'max'; }
      else if (Math.abs(c + 1) < 1e-12) { fam = [{ r0: PI, step: 2 * PI }]; special = 'min'; }
      else if (Math.abs(c) < 1e-12) { fam = [{ r0: PI / 2, step: PI }]; special = 'zero'; }
      else { var b = Math.acos(c); fam = [{ r0: b, step: 2 * PI }, { r0: -b, step: 2 * PI }]; }
    } else {
      fam = [{ r0: Math.atan(c), step: PI }]; if (Math.abs(c) < 1e-12) special = 'zero';
    }
    return { type: type, c: c, none: none, special: special, fam: fam };
  };
  M.fv2TrigEqSolutions = function (eq, a, b) {
    var out = [];
    eq.fam.forEach(function (f) {
      var k0 = Math.ceil((a - f.r0) / f.step - 1e-12), k1 = Math.floor((b - f.r0) / f.step + 1e-12);
      for (var k = k0; k <= k1; k++) out.push(f.r0 + k * f.step);
    });
    return out.sort(function (x, y) { return x - y; });
  };
  M.fv2TrigFn = function (type) { return type === 'sin' ? Math.sin : type === 'cos' ? Math.cos : function (x) { return Math.abs(Math.cos(x)) < 1e-9 ? NaN : Math.tan(x); }; };

  /* ---------- grafikus megoldó ---------- */
  function relOk(rel, h) {
    var z = Math.abs(h) <= 1e-7;
    if (rel === '=') return z;
    if (rel === '<') return h < 0 && !z;
    if (rel === '>') return h > 0 && !z;
    if (rel === '≤') return h < 0 || z;
    return h > 0 || z;
  }
  M.fv2Solve = function (h, rel, a, b, nGrid) {
    nGrid = nGrid || 1200;
    var C = MO.cas, bps = [];
    function fin(x) { var v = h(x); return isFinite(v) ? v : NaN; }
    var roots = C.roots(function (x) { return fin(x); }, a, b);
    roots.forEach(function (r) { bps.push({ x: r, kind: 'root' }); });
    var step = (b - a) / nGrid, px = a, pv = fin(a);
    for (var i = 1; i <= nGrid; i++) {
      var x = a + i * step, v = fin(x);
      var nearRoot = roots.some(function (r) { return r >= px - 1e-9 && r <= x + 1e-9; });
      if (isNaN(pv) !== isNaN(v)) {
        var lo = px, hi = x, loN = isNaN(pv);
        for (var k = 0; k < 60; k++) { var m = (lo + hi) / 2; if (isNaN(fin(m)) === loN) lo = m; else hi = m; }
        var xe = Math.round(((lo + hi) / 2) * 1e8) / 1e8;
        bps.push({ x: xe, kind: 'edge' });
      } else if (!isNaN(pv) && !isNaN(v) && ((pv > 0) !== (v > 0)) && pv !== 0 && v !== 0 && !nearRoot) {
        var lo2 = px, hi2 = x, s0 = pv > 0;
        for (var k2 = 0; k2 < 60; k2++) { var m2 = (lo2 + hi2) / 2, vm = fin(m2); if (isNaN(vm)) break; if ((vm > 0) === s0) lo2 = m2; else hi2 = m2; }
        bps.push({ x: (lo2 + hi2) / 2, kind: 'pole' });
      }
      px = x; pv = v;
    }
    bps.sort(function (p, q) { return p.x - q.x; });
    var pts = [{ x: a, kind: 'view' }];
    bps.forEach(function (p) { if (p.x > a + 1e-9 && p.x < b - 1e-9 && Math.abs(p.x - pts[pts.length - 1].x) > 1e-7) pts.push(p); });
    pts.push({ x: b, kind: 'view' });
    function ptOk(p) {
      if (p.kind === 'pole') return false;
      var v = fin(p.x); if (isNaN(v)) return false;
      return relOk(rel, v);
    }
    var segOk = [];
    for (var j = 0; j + 1 < pts.length; j++) { var mid = (pts[j].x + pts[j + 1].x) / 2, vv = fin(mid); segOk.push(!isNaN(vv) && relOk(rel, vv)); }
    var ok = pts.map(ptOk), ivs = [], last = pts.length - 1, j = 0;
    while (j < segOk.length) {
      if (!segOk[j]) { j++; continue; }
      var s0 = j; while (j + 1 < segOk.length && segOk[j + 1] && ok[j + 1]) j++;
      var e0 = j + 1;
      ivs.push({ lo: pts[s0].x, hi: pts[e0].x, loEdge: s0 === 0, hiEdge: e0 === last, loC: s0 === 0 ? false : ok[s0], hiC: e0 === last ? false : ok[e0] });
      j++;
    }
    for (var q = 1; q < last; q++) if (ok[q] && !segOk[q - 1] && !segOk[q]) ivs.push({ lo: pts[q].x, hi: pts[q].x, loC: true, hiC: true, point: true });
    ivs.sort(function (u, w) { return u.lo - w.lo; });
    return { a: a, b: b, rel: rel, roots: roots, poles: pts.filter(function (p) { return p.kind === 'pole'; }).map(function (p) { return p.x; }),
      edges: pts.filter(function (p) { return p.kind === 'edge'; }).map(function (p) { return p.x; }), intervals: ivs,
      empty: ivs.length === 0, whole: ivs.length === 1 && ivs[0].loEdge && ivs[0].hiEdge };
  };
  M.fv2SetText = function (res, fmt) {
    fmt = fmt || function (x) { return minus(MO.num(Math.abs(x) < 5e-10 ? 0 : x, 3)); };
    if (res.empty) return '∅ (nincs megoldás)';
    return res.intervals.map(function (iv) {
      if (iv.point) return '{' + fmt(iv.lo) + '}';
      return (iv.loC ? '[' : ']') + fmt(iv.lo) + (iv.loEdge ? '*' : '') + '; ' + fmt(iv.hi) + (iv.hiEdge ? '*' : '') + (iv.hiC ? ']' : '[');
    }).join(' ∪ ');
  };

  /* ---------- paraméteres egyenlet ---------- */
  M.fv2ParamTypes = [
    { id: 'q1', label: 'x² − 2x + p = 0', Ltex: 'x^2-2x', Rtex: '-p', L: function (x) { return x * x - 2 * x; }, R: function (x, p) { return -p; } },
    { id: 'abs', label: '|x − 1| = p', Ltex: '|x-1|', Rtex: 'p', L: function (x) { return Math.abs(x - 1); }, R: function (x, p) { return p; } },
    { id: 'q3', label: 'x² = p·x − 1', Ltex: 'x^2', Rtex: 'px-1', L: function (x) { return x * x; }, R: function (x, p) { return p * x - 1; } },
    { id: 'lin', label: 'p·x² + 2x + 1 = 0', Ltex: 'px^2', Rtex: '-2x-1', L: function (x, p) { return p * x * x; }, R: function (x) { return -2 * x - 1; } }
  ];
  M.fv2ParamType = function (id) { return M.fv2ParamTypes.filter(function (t) { return t.id === id; })[0]; };
  M.fv2ParamSolve = function (id, p) {
    var r = [], D = null;
    if (id === 'q1') {
      D = 4 - 4 * p; if (D > EPS) r = [1 - Math.sqrt(1 - p), 1 + Math.sqrt(1 - p)]; else if (Math.abs(D) <= EPS) r = [1];
    } else if (id === 'abs') {
      if (p > EPS) r = [1 - p, 1 + p]; else if (Math.abs(p) <= EPS) r = [1];
    } else if (id === 'q3') {
      D = p * p - 4;
      if (D > EPS) { var s = Math.sqrt(D); r = [(p - s) / 2, (p + s) / 2]; } else if (Math.abs(D) <= EPS) r = [p / 2];
    } else {
      if (Math.abs(p) <= EPS) { r = [-0.5]; D = null; }
      else {
        D = 4 - 4 * p;
        if (D > EPS) { var s2 = Math.sqrt(1 - p), a1 = (-1 - s2) / p, a2 = (-1 + s2) / p; r = a1 < a2 ? [a1, a2] : [a2, a1]; }
        else if (Math.abs(D) <= EPS) r = [-1];
      }
    }
    return { roots: r, count: r.length, D: D, degenerate: id === 'lin' && Math.abs(p) <= EPS };
  };
  /* előre levezetett összefoglaló: feltétel (TeX), darabszám, próbafüggvény */
  M.fv2ParamSummary = function (id) {
    if (id === 'q1') return [
      { cond: 'p<1', n: 2, test: function (p) { return p < 1 - EPS; } },
      { cond: 'p=1', n: 1, test: function (p) { return Math.abs(p - 1) <= EPS; } },
      { cond: 'p>1', n: 0, test: function (p) { return p > 1 + EPS; } }];
    if (id === 'abs') return [
      { cond: 'p<0', n: 0, test: function (p) { return p < -EPS; } },
      { cond: 'p=0', n: 1, test: function (p) { return Math.abs(p) <= EPS; } },
      { cond: 'p>0', n: 2, test: function (p) { return p > EPS; } }];
    if (id === 'q3') return [
      { cond: 'p<-2 \\text{ vagy } p>2', n: 2, test: function (p) { return Math.abs(p) > 2 + EPS; } },
      { cond: 'p=-2 \\text{ vagy } p=2', n: 1, test: function (p) { return Math.abs(Math.abs(p) - 2) <= EPS; } },
      { cond: '-2<p<2', n: 0, test: function (p) { return Math.abs(p) < 2 - EPS; } }];
    return [
      { cond: 'p<1 \\text{ és } p\\neq 0', n: 2, test: function (p) { return p < 1 - EPS && Math.abs(p) > EPS; } },
      { cond: 'p=0 \\text{ vagy } p=1', n: 1, test: function (p) { return Math.abs(p) <= EPS || Math.abs(p - 1) <= EPS; } },
      { cond: 'p>1', n: 0, test: function (p) { return p > 1 + EPS; } }];
  };
  M.fv2ParamCount = function (id, p) {
    var s = M.fv2ParamSummary(id).filter(function (e) { return e.test(p); });
    return s.length === 1 ? s[0].n : -1;
  };

  /* =====================================================================
     SEGÉDEK (DOM-os)
     ===================================================================== */
  function T(s) { return '$' + s + '$'; }
  function kv(rows) { return '<dl class="kv">' + rows.map(function (r) { return '<dt>' + K.md(r[0]) + '</dt><dd><div class="md" style="overflow-x:auto;overflow-y:hidden">' + K.md(r[1]) + '</div></dd>'; }).join('') + '</dl>'; }
  function stack(rows) { return rows.map(function (r) { return '<div class="lab" style="margin-top:10px">' + K.md(r[0]) + '</div><div class="md" style="overflow-x:auto;overflow-y:hidden">' + K.md(r[1]) + '</div>'; }).join(''); }
  function badMsg(t) { return '<p class="msg bad">' + K.md(t) + '</p>'; }
  function setInput(n, key, val) { var inp = K.$('[data-in="' + key + '"]', n); if (inp) { inp.value = val; inp.dispatchEvent(new Event('input', { bubbles: true })); } }
  function niceVal(v) { for (var d = 1; d <= 60; d++) { var q = v * d; if (Math.abs(q - Math.round(q)) < 1e-9) return true; } return false; }
  function eqT(v) { return niceVal(v) ? '= ' + K.exact(v) : '\\approx ' + K.tnum(v, 4); }
  function numT(v) { return niceVal(v) ? K.exact(v) : K.tnum(v, 4); }
  function eqFromEx(ex, v) { return ex !== null ? '= ' + ex : '\\approx ' + K.tnum(v, 4); }
  function piLabel(k) { /* k * pi/2 */
    if (k === 0) return '0';
    var s = k < 0 ? '−' : '', a = Math.abs(k);
    if (a % 2 === 0) return s + (a / 2 === 1 ? '' : a / 2) + 'π';
    return s + (a === 1 ? '' : a) + 'π/2';
  }
  function piLabels(xmin, xmax, yoff) {
    var out = [], k0 = Math.ceil(xmin / (PI / 2) - 1e-9), k1 = Math.floor(xmax / (PI / 2) + 1e-9);
    for (var k = k0; k <= k1; k++) if (k !== 0) out.push({ x: k * PI / 2, y: 0, text: piLabel(k), dy: yoff, align: 'center', dim: true });
    return out;
  }
  function radEq(rad) { var r = M.fv2PiTex(rad / PI); return r.exact ? '= ' + r.tex : '\\approx ' + r.tex; }

  /* =====================================================================
     1. EGYSÉGKÖR
     ===================================================================== */
  MO.simDefs.push({
    id: 'egysegkor', title: 'Egységkör: szög, szinusz, koszinusz, tangens',
    desc: 'Húzd a pontot az egységkörön, és nézd a szög fok- és radiánértékét, a szögfüggvények értékét, a negyedet és az előjeleket.',
    group: 'függvények', topic: 'geometria', sub: 'trigonometria',
    build: function (kit) {
      K = kit;
      var n = kit.el('<div>' + kit.slider('a', 'szög (fok)', -360, 720, 1, 30) + kit.plotBox(320) +
        '<div class="legend"><span><i style="border-color:var(--c2)"></i>sin (függőleges szakasz)</span><span><i style="border-color:var(--c3)"></i>cos (vízszintes szakasz)</span><span><i style="border-color:var(--c4)"></i>tg (az érintőn)</span></div>' +
        '<div class="out"></div>' +
        '<div class="row" style="margin-top:12px">' + [30, 45, 60, 120, 210, 270, -60].map(function (d) { return '<button class="btn sm" type="button" data-preset="' + d + '">' + d + '°</button>'; }).join('') + '</div></div>');
      var p = null, cur = 30;
      function draw(deg) {
        var r = M.fv2UnitCircle(deg), c = Math.cos(r.rad), s = Math.sin(r.rad);
        var segs = [{ a: [0, 0], b: [c, s], w: 2 }, { a: [c, 0], b: [c, s], color: 1, w: 3 }, { a: [0, 0], b: [c, 0], color: 2, w: 3 }, { a: [1, -1.7], b: [1, 1.7], dim: true, dash: [4, 4] }];
        var labs = [{ x: c, y: s / 2, text: 'sin', dx: c >= 0 ? -8 : 8, align: c >= 0 ? 'right' : 'left', color: 1 }, { x: c / 2, y: 0, text: 'cos', dy: s >= 0 ? -12 : 12, align: 'center', color: 2 },
          { x: 0.6, y: 0.6, text: 'I.', dim: true, align: 'center' }, { x: -0.6, y: 0.6, text: 'II.', dim: true, align: 'center' }, { x: -0.6, y: -0.6, text: 'III.', dim: true, align: 'center' }, { x: 0.6, y: -0.6, text: 'IV.', dim: true, align: 'center' }];
        if (r.tg.def) {
          var t = r.tg.v, cl = Math.max(-1.7, Math.min(1.7, t)), k = Math.min(1, 1.7 / Math.max(1e-9, Math.abs(t)));
          segs.push({ a: [1, 0], b: [1, cl], color: 3, w: 3 }); segs.push({ a: [0, 0], b: [k, k * t], dash: [5, 4], dim: true });
          labs.push({ x: 1, y: cl / 2, text: 'tg', dx: 8, color: 3 });
        }
        p.set({ segments: segs, labels: labs, circles: [{ x: 0, y: 0, r: 1 }], points: [{ x: c, y: s, drag: true, label: 'P' }],
          arcs: [{ x: 0, y: 0, r: 20, from: Math.min(0, r.rad % (2 * PI)), to: Math.max(0, r.rad % (2 * PI)) }] });
      }
      function upd(v) {
        cur = Math.round(v.a); var r = M.fv2UnitCircle(cur);
        if (p) draw(cur);
        function line(name, o) {
          if (!o.def) return name + '\\ \\text{ nem értelmezett}';
          return name + ' ' + eqFromEx(o.tex, o.v);
        }
        var q = r.quad === 0 ? 'a szög szára a koordináta-tengelyen van, ezért nincs negyed' : r.quad + '. negyed';
        var sg = r.quad === 0 ? '' : '(sin ' + (r.sin.v > 0 ? '+' : '−') + ', cos ' + (r.cos.v > 0 ? '+' : '−') + ', tg ' + (r.quad % 2 ? '+' : '−') + ', ctg ' + (r.quad % 2 ? '+' : '−') + ')';
        var rows = [
          ['szög fokban', T('\\alpha=' + minus(cur) + '^\\circ')], ['szög radiánban', T('\\alpha ' + (r.radTex.exact ? '= ' : '\\approx ') + r.radTex.tex)],
          ['sin', T(line('\\sin\\alpha', r.sin))], ['cos', T(line('\\cos\\alpha', r.cos))],
          ['tg', T(line('\\operatorname{tg}\\alpha', r.tg))], ['ctg', T(line('\\operatorname{ctg}\\alpha', r.ctg))],
          ['negyed', kit.esc(q) + ' ' + kit.esc(sg)]];
        var st = [];
        st.push('A pont $P(\\cos\\alpha;\\ \\sin\\alpha)$ az egységkör pontja, $\\alpha=' + minus(cur) + '^\\circ$ a pozitív $x$ tengelytől mért (előjeles) szög.');
        var red = r.n;
        if (cur < 0 || cur >= 360) st.push('A szög ' + (cur < 0 ? 'negatív, ezért az óramutató járásával megegyező irányba forgatunk' : 'nagyobb, mint $360^\\circ$') + '; a $360^\\circ$-os periódus miatt ugyanaz, mint $' + red + '^\\circ$.');
        st.push('$\\sin\\alpha$ a pont $y$ koordinátája, $\\cos\\alpha$ az $x$ koordinátája; $\\operatorname{tg}\\alpha=\\dfrac{\\sin\\alpha}{\\cos\\alpha}$, $\\operatorname{ctg}\\alpha=\\dfrac{\\cos\\alpha}{\\sin\\alpha}$.');
        if (!r.tg.def) st.push('Itt $\\cos\\alpha=0$, ezért a tangens nem értelmezett (nullával osztanánk); a tangens értelmezési tartománya: $\\alpha\\neq 90^\\circ+k\\cdot 180^\\circ$.');
        if (!r.ctg.def) st.push('Itt $\\sin\\alpha=0$, ezért a kotangens nem értelmezett; a kotangens értelmezési tartománya: $\\alpha\\neq k\\cdot 180^\\circ$.');
        if (r.notable) st.push('Nevezetes szög: a hegyesszög-hasonmása $' + (red <= 90 ? red : red <= 180 ? 180 - red : red <= 270 ? red - 180 : 360 - red) + '^\\circ$, a pontos értékek ebből, az előjelek a negyedből adódnak.');
        else st.push('Ez nem nevezetes szög, ezért az értékek kerekítettek (jelölés: $\\approx$).');
        kit.$('.out', n).innerHTML = kv(rows) + kit.steps(st);
      }
      setTimeout(function () {
        p = kit.mkPlot(kit.$('.plotbox', n), { xmin: -1.9, xmax: 1.9, ymin: -1.9, ymax: 1.9, equal: true, interactive: false,
          onDrag: function (pt, x, y) {
            var ang = Math.atan2(y, x) * 180 / PI, d = ang - cur; d = ((d + 180) % 360 + 360) % 360 - 180;
            var nv = Math.max(-360, Math.min(720, Math.round(cur + d)));
            var inp = kit.$('[data-in="a"]', n); inp.value = nv; inp.dispatchEvent(new Event('input', { bubbles: true }));
          } });
        kit.bindSliders(n, upd);
      }, 0);
      kit.$$('[data-preset]', n).forEach(function (b) { kit.on(b, 'click', function () { setInput(n, 'a', b.dataset.preset); }); });
      return n;
    }
  });

  /* =====================================================================
     2. TRIGONOMETRIKUS FÜGGVÉNY GRAFIKONJA
     ===================================================================== */
  function trigName(t) { return t === 'sin' ? '\\sin' : t === 'cos' ? '\\cos' : '\\operatorname{tg}'; }
  function trigFormula(type, A, w, q, d) {
    var inner = (w === 1 ? '' : w === -1 ? '-' : K.tnum(w, 2));
    if (q === 0) inner += 'x'; else { var pt = M.fv2PiTex(Math.abs(q)).tex; inner += '\\left(x' + (q > 0 ? ' - ' : ' + ') + pt + '\\right)'; }
    return (A === 1 ? '' : A === -1 ? '-' : K.tnum(A, 2) + '\\cdot ') + trigName(type) + '\\left(' + inner + '\\right)' + (d === 0 ? '' : d > 0 ? ' + ' + K.tnum(d, 2) : ' - ' + K.tnum(-d, 2));
  }
  function xTex(x) { var r = M.fv2PiTex(x / PI); return r.exact ? '= ' + r.tex : '\\approx ' + r.tex; }
  function xVal(x) { var r = M.fv2PiTex(x / PI); return r.tex; }

  MO.simDefs.push({
    id: 'trig-grafikon', title: 'Trigonometrikus függvény grafikonja',
    desc: 'f(x) = A·sin(ω(x−φ))+d (vagy cos, tg): állítsd az amplitúdót, a körfrekvenciát, az eltolásokat, és olvasd le a periódust, az értékkészletet, a zérus- és szélsőértékhelyeket.',
    group: 'függvények', topic: 'fuggvenyek', sub: 'valosfv',
    build: function (kit) {
      K = kit;
      var n = kit.el('<div>' + kit.select('t', 'függvény', [['sin', 'sin'], ['cos', 'cos'], ['tg', 'tg']], 'sin') +
        kit.slider('A', 'A (amplitúdó)', -3, 3, 0.5, 2) + kit.slider('w', 'ω (körfrekvencia)', -3, 3, 0.5, 1) + kit.slider('q', 'φ (eltolás, π egységben)', -1, 1, 0.25, 0) + kit.slider('d', 'd (függőleges eltolás)', -3, 3, 0.5, 0) +
        kit.plotBox(300) + kit.legend([[0, 'f(x)']]) + '<div class="out"></div>' +
        '<div class="row" style="margin-top:12px"><button class="btn sm" type="button" data-preset="sin,1,1,0,0">sin x</button><button class="btn sm" type="button" data-preset="sin,2,2,0,0">2·sin 2x</button><button class="btn sm" type="button" data-preset="cos,1,1,0.5,1">cos(x−π/2)+1</button><button class="btn sm" type="button" data-preset="tg,1,1,0,0">tg x</button><button class="btn sm" type="button" data-preset="sin,2,0,0,0">ω = 0</button></div></div>');
      var p = null, XMIN = -2 * PI, XMAX = 2 * PI;
      function upd(v) {
        var type = kit.$('[data-sel="t"]', n).value, A = v.A, w = v.w, q = v.q, d = v.d, phi = q * PI;
        var m = M.fv2Trig(type, A, w, phi, d), out = kit.$('.out', n);
        var form = 'f(x) = ' + trigFormula(type, A, w, q, d);
        if (p) {
          var pts = [], labs = piLabels(XMIN, XMAX, -32), segs = [];
          if (!m.deg) {
            var cl = function (x, y, color, lab) { if (x >= XMIN - 1e-9 && x <= XMAX + 1e-9) pts.push({ x: x, y: y, color: color, label: lab }); };
            for (var k = -12; k <= 12; k++) {
              var off = k * m.T, base = k === 0;
              m.zeros.forEach(function (z, i) { cl(z + off, 0, 2, base && i === 0 ? 'z' : undefined); });
              if (m.max) { cl(m.max.x + off, m.max.y, 1, base ? 'max' : undefined); cl(m.min.x + off, m.min.y, 3, base ? 'min' : undefined); }
              if (m.asym) { var ax = m.asym[0] + off; if (ax > XMIN && ax < XMAX) segs.push({ a: [ax, -7], b: [ax, 7], dash: [4, 4], dim: true }); }
            }
          }
          p.set({ curves: [{ f: m.f }], points: pts, labels: labs, segments: segs });
        }
        var rows, st = [];
        if (m.deg) {
          var why = m.reason === 'w' ? 'ω = 0: ekkor ω(x−φ) = 0, a függvény nem periodikus, hanem állandó.' : 'A = 0: a trigonometrikus tag eltűnik, a függvény állandó.';
          out.innerHTML = badMsg('Elfajuló eset. ' + why) + kv([['f(x)', T('f(x)=' + K.tnum(m.constant, 2))], ['értékkészlet', T('\\left\\{' + K.tnum(m.constant, 2) + '\\right\\}')]]) +
            kit.steps(['Az $f(x)=' + trigFormula(type, A, w, q, d) + '$ képletben ' + (m.reason === 'w' ? '$\\omega=0$' : '$A=0$') + ', ezért $f(x)=' + K.tnum(m.constant, 2) + '$ minden $x$-re.', 'Nincs periódus, nincsenek szélsőérték- vagy zérushelyek (kivéve, ha az állandó $0$: akkor minden $x$ zérushely).']);
          return;
        }
        var Ts = M.fv2PiTex(m.T / PI), per = type === 'tg' ? '\\dfrac{\\pi}{|\\omega|}' : '\\dfrac{2\\pi}{|\\omega|}';
        rows = [['függvény', T(form)], ['periódus', T(per + ' ' + (Ts.exact ? '= ' : '\\approx ') + Ts.tex)]];
        if (type !== 'tg') rows.push(['amplitúdó', T('|A| = ' + K.tnum(Math.abs(A), 2))]);
        rows.push(['értékkészlet', type === 'tg' ? T('\\mathbb{R}') : T('\\left[' + K.tnum(m.range[0], 2) + ';\\ ' + K.tnum(m.range[1], 2) + '\\right]')]);
        var zs = m.zeros.map(function (z) { return 'x ' + xTex(z); });
        if (type === 'tg') {
          rows.push(['zérushely', zs.length ? T(zs[0] + ' + k\\cdot ' + Ts.tex) : '—']);
          rows.push(['függőleges aszimptota', T('x ' + xTex(m.asym[0]) + ' + k\\cdot ' + Ts.tex)]);
          rows.push(['szélsőérték', 'nincs']);
          st = ['A $\\operatorname{tg}$ függvény periódusa $\\pi$, ezért $f$ periódusa $\\dfrac{\\pi}{|\\omega|}' + (Ts.exact ? '=' : '\\approx') + Ts.tex + '$.',
            'Az értékkészlet minden valós szám, mert a tangens felvesz minden értéket ($A\\neq 0$).',
            'A tangens ott nem értelmezett, ahol $\\omega(x-\\varphi)=\\dfrac{\\pi}{2}+k\\pi$; itt függőleges aszimptoták vannak (szaggatott vonal).',
            'Zérushely: $A\\cdot\\operatorname{tg}(\\omega(x-\\varphi))+d=0$, vagyis $\\operatorname{tg}(\\omega(x-\\varphi))=' + K.tnum(-d / A, 2) + '$; periódusonként pontosan egy van.',
            'Szélsőértéke nincs, mert a függvény korlátlan.'];
        } else {
          rows.push(['zérushelyek egy perióduson', zs.length ? T(zs.join(';\\ ')) : 'nincs (az érték sosem 0)']);
          rows.push(['maximum', T('f(x) = ' + K.tnum(m.max.y, 2) + ',\\ x ' + xTex(m.max.x))]);
          rows.push(['minimum', T('f(x) = ' + K.tnum(m.min.y, 2) + ',\\ x ' + xTex(m.min.x))]);
          st = ['Az amplitúdó $|A|=' + K.tnum(Math.abs(A), 2) + '$, a középvonal $y=' + K.tnum(d, 2) + '$.',
            'A periódus $\\dfrac{2\\pi}{|\\omega|}' + (Ts.exact ? '=' : '\\approx') + Ts.tex + '$.',
            'Az értékkészlet: $[d-|A|;\\ d+|A|]=[' + K.tnum(m.range[0], 2) + ';\\ ' + K.tnum(m.range[1], 2) + ']$.',
            'Zérushely: ' + (zs.length ? 'ahol $' + trigName(type) + '(\\omega(x-\\varphi))=' + K.tnum(-d / m.Ae, 3) + '$; egy perióduson belül $' + zs.join(';\\ ') + '$ (a többi ezekből $k\\cdot T$ hozzáadásával kapható).' : 'a szinuszoid ($|d|>|A|$) nem metszi az $x$ tengelyt, nincs zérushely.'),
            'A maximum helye $x ' + xTex(m.max.x) + '$ (értéke $' + K.tnum(m.max.y, 2) + '$), a minimumé $x ' + xTex(m.min.x) + '$ (értéke $' + K.tnum(m.min.y, 2) + '$), és ezek mindegyike $T$ távolságonként ismétlődik.'];
        }
        out.innerHTML = kv(rows) + kit.steps(st);
      }
      setTimeout(function () {
        p = kit.mkPlot(kit.$('.plotbox', n), { xmin: XMIN - 0.3, xmax: XMAX + 0.3, ymin: -7, ymax: 7, interactive: false });
        kit.bindSliders(n, upd);
      }, 0);
      kit.on(kit.$('[data-sel="t"]', n), 'change', function () { var inp = kit.$('[data-in="A"]', n); inp.dispatchEvent(new Event('input', { bubbles: true })); });
      kit.$$('[data-preset]', n).forEach(function (b) { kit.on(b, 'click', function () {
        var s = b.dataset.preset.split(','); var sel = kit.$('[data-sel="t"]', n); sel.value = s[0];
        ['A', 'w', 'q', 'd'].forEach(function (k, i) { setInput(n, k, s[i + 1]); });
      }); });
      return n;
    }
  });

  /* =====================================================================
     3. TRIGONOMETRIKUS ALAPEGYENLET
     ===================================================================== */
  function famTex(f, unit) {
    var step = unit === 'rad' ? (Math.abs(f.step - PI) < 1e-9 ? '\\pi' : '2\\pi') : (Math.abs(f.step - PI) < 1e-9 ? '180^\\circ' : '360^\\circ');
    var kstep = unit === 'rad' ? (Math.abs(f.step - PI) < 1e-9 ? 'k\\pi' : '2k\\pi') : 'k\\cdot ' + step;
    var base = unit === 'rad' ? M.fv2PiTex(f.r0 / PI) : M.fv2DegTex(f.r0 * 180 / PI);
    var isZero = Math.abs(f.r0) < 1e-12;
    return 'x ' + (base.exact ? '= ' : '\\approx ') + (isZero ? kstep : base.tex + ' + ' + kstep);
  }
  function eqName(t) { return t === 'sin' ? '\\sin' : t === 'cos' ? '\\cos' : '\\operatorname{tg}'; }

  MO.simDefs.push({
    id: 'trig-egyenlet', title: 'Trigonometrikus alapegyenlet megoldásai',
    desc: 'Oldd meg a sin x = c, cos x = c, tg x = c egyenletet: az egységkörön és a grafikonon látod a megoldásokat, alatta az általános alakot k egész paraméterrel.',
    group: 'függvények', topic: 'geometria', sub: 'trigonometria',
    build: function (kit) {
      K = kit;
      var n = kit.el('<div>' + kit.select('t', 'egyenlet', [['sin', 'sin x = c'], ['cos', 'cos x = c'], ['tg', 'tg x = c']], 'sin') + kit.slider('c', 'c', -2, 2, 0.1, 0.5) +
        '<div class="lab" style="margin-top:8px">egységkör</div>' + kit.plotBox(260) + '<div class="lab" style="margin-top:8px">grafikon és az y = c egyenes</div>' + kit.plotBox(250) +
        '<div class="legend"><span><i style="border-color:var(--c1)"></i>szögfüggvény (folytonos)</span><span><i style="border-color:var(--c2);border-top-style:dashed"></i>y = c (szaggatott)</span></div><div class="out"></div>' +
        '<div class="row" style="margin-top:12px"><button class="btn sm" type="button" data-preset="sin,0.5">sin x = 1/2</button><button class="btn sm" type="button" data-preset="cos,-0.5">cos x = −1/2</button><button class="btn sm" type="button" data-preset="tg,1">tg x = 1</button><button class="btn sm" type="button" data-preset="sin,1.5">sin x = 1,5</button><button class="btn sm" type="button" data-preset="cos,0">cos x = 0</button><button class="btn sm" type="button" data-preset="sin,-1">sin x = −1</button></div></div>');
      var pc = null, pg = null, XMIN = -2 * PI, XMAX = 2 * PI;
      function upd(v) {
        var type = kit.$('[data-sel="t"]', n).value, c = Math.round(v.c * 1e6) / 1e6, eq = M.fv2TrigEq(type, c), out = kit.$('.out', n), nm = eqName(type);
        var inView = M.fv2TrigEqSolutions(eq, XMIN, XMAX), inCircle = M.fv2TrigEqSolutions(eq, 0, 2 * PI - 1e-9);
        if (pc && pg) {
          var segs = [], labs = [], pts = [];
          if (type === 'sin') segs.push({ a: [-1.8, c], b: [1.8, c], dash: [5, 4], color: 1 });
          else if (type === 'cos') segs.push({ a: [c, -1.8], b: [c, 1.8], dash: [5, 4], color: 1 });
          else { segs.push({ a: [1, -1.7], b: [1, 1.7], dim: true, dash: [4, 4] }); var k = Math.min(1.7, 1.7 / Math.max(1, Math.abs(c))); segs.push({ a: [-k, -k * c], b: [k, k * c], dash: [5, 4], color: 1 });
            if (Math.abs(c) <= 1.7) { pts.push({ x: 1, y: c, color: 2, label: 'c' }); } }
          inCircle.forEach(function (x, i) { pts.push({ x: Math.cos(x), y: Math.sin(x), label: 'x' + (i + 1), color: 0 }); segs.push({ a: [0, 0], b: [Math.cos(x), Math.sin(x)], w: 2 }); });
          pc.set({ segments: segs, points: pts, circles: [{ x: 0, y: 0, r: 1 }], labels: labs });
          var f = M.fv2TrigFn(type), ys = type === 'tg' ? 4 : 2.2, gp = [];
          inView.forEach(function (x) { gp.push({ x: x, y: c, color: 2 }); });
          pg.set({ ymin: -ys, ymax: ys, curves: [{ f: f }, { f: function () { return c; } }], points: gp, labels: piLabels(XMIN, XMAX, -32) });
        }
        var rows = [['egyenlet', T(nm + ' x = ' + K.tnum(c, 2))]], st = [];
        if (eq.none) {
          out.innerHTML = badMsg('Nincs megoldás: ' + (type === 'sin' ? '$-1\\le\\sin x\\le 1$' : '$-1\\le\\cos x\\le 1$') + ', de $c=' + K.tnum(c, 2) + '$ ennél ' + (c > 0 ? 'nagyobb' : 'kisebb') + ' (a vízszintes egyenes nem metszi az egységkört és a grafikont sem).') +
            kit.steps(['Az egységkörön a ' + (type === 'sin' ? 'szinusz az $y$' : 'koszinusz az $x$') + ' koordináta, ez legfeljebb $1$, legalább $-1$.', 'A $c=' + K.tnum(c, 2) + '$ érték kívül esik a $[-1;\\ 1]$ intervallumon, ezért a megoldáshalmaz üres.']);
          return;
        }
        var cs = K.tnum(c, 2), a1;
        if (type === 'sin') {
          if (eq.special === 'max') st = ['Az egységkörön csak a $(0;\\ 1)$ pont $y$ koordinátája $1$.', '$\\sin x = 1$ megoldása $x=\\dfrac{\\pi}{2}$ (a másik irány, $\\pi-\\dfrac{\\pi}{2}$, ugyanaz a pont).', 'Egy pont, ezért egy megoldáscsalád: ' + T(famTex(eq.fam[0], 'rad')) + ', $k\\in\\mathbb{Z}$.'];
          else if (eq.special === 'min') st = ['Az egységkörön csak a $(0;\\ -1)$ pont $y$ koordinátája $-1$.', '$\\sin x = -1$ megoldása $x=-\\dfrac{\\pi}{2}$ (vagy $\\dfrac{3\\pi}{2}$).', 'Egy megoldáscsalád: ' + T(famTex(eq.fam[0], 'rad')) + ', $k\\in\\mathbb{Z}$.'];
          else if (eq.special === 'zero') st = ['Az $y=0$ egyenes az egységkört a $(1;\\ 0)$ és $(-1;\\ 0)$ pontban metszi: $x=0$ és $x=\\pi$.', 'A két család ($0+2k\\pi$ és $\\pi+2k\\pi$) összevonható: ' + T(famTex(eq.fam[0], 'rad')) + ', $k\\in\\mathbb{Z}$.'];
          else {
            a1 = eq.fam[0].r0;
            st = ['Az $y=' + cs + '$ egyenes az egységkört két pontban metszi, ezért két iránya van a megoldásnak.', 'Az első: $x_1=\\arcsin ' + cs + ' ' + radEq(a1) + '$, azaz $x_1 ' + (M.fv2DegTex(a1 * 180 / PI).exact ? '=' : '\\approx') + ' ' + M.fv2DegTex(a1 * 180 / PI).tex + '$.',
              'A második: $x_2=\\pi-x_1 ' + radEq(eq.fam[1].r0) + '$ (mert $\\sin(\\pi-x)=\\sin x$).', 'A szinusz periódusa $2\\pi$ ($360^\\circ$), ezért az általános alak: ' + T(famTex(eq.fam[0], 'rad') + ',\\ ' + famTex(eq.fam[1], 'rad').replace(/^x/, 'x')) + ', $k\\in\\mathbb{Z}$.'];
          }
        } else if (type === 'cos') {
          if (eq.special === 'max') st = ['Az egységkörön csak az $(1;\\ 0)$ pont $x$ koordinátája $1$.', 'Megoldás: $x=0$, vagyis ' + T(famTex(eq.fam[0], 'rad')) + ', $k\\in\\mathbb{Z}$.'];
          else if (eq.special === 'min') st = ['Az egységkörön csak a $(-1;\\ 0)$ pont $x$ koordinátája $-1$.', 'Megoldás: $x=\\pi$, vagyis ' + T(famTex(eq.fam[0], 'rad')) + ', $k\\in\\mathbb{Z}$.'];
          else if (eq.special === 'zero') st = ['Az $x=0$ egyenes az egységkört a $(0;\\ 1)$ és $(0;\\ -1)$ pontban metszi: $x=\\dfrac{\\pi}{2}$ és $x=\\dfrac{3\\pi}{2}$.', 'A két család összevonható: ' + T(famTex(eq.fam[0], 'rad')) + ', $k\\in\\mathbb{Z}$.'];
          else {
            a1 = eq.fam[0].r0;
            st = ['Az $x=' + cs + '$ egyenes az egységkört két pontban metszi (az $x$ tengelyre szimmetrikusan).', 'Az első: $x_1=\\arccos ' + cs + ' ' + radEq(a1) + '$, azaz $x_1 ' + (M.fv2DegTex(a1 * 180 / PI).exact ? '=' : '\\approx') + ' ' + M.fv2DegTex(a1 * 180 / PI).tex + '$.',
              'A második: $x_2=-x_1$ (mert a koszinusz páros függvény).', 'A periódus $2\\pi$ ($360^\\circ$), ezért: ' + T(famTex(eq.fam[0], 'rad') + ',\\ ' + famTex(eq.fam[1], 'rad')) + ', $k\\in\\mathbb{Z}$; röviden $x=\\pm x_1+2k\\pi$.'];
          }
        } else {
          a1 = eq.fam[0].r0;
          st = ['A tangens értékkészlete minden valós szám, ezért bármely $c$-re van megoldás.', 'Az érintőn a $(1;\\ ' + cs + ')$ pontot az origóval összekötő egyenes az egységkört két átellenes pontban metszi, de ezek azonos tangenst adnak: egy irány.',
            'Egy megoldás: $x_1=\\operatorname{arctg} ' + cs + ' ' + radEq(a1) + '$, azaz $x_1 ' + (M.fv2DegTex(a1 * 180 / PI).exact ? '=' : '\\approx') + ' ' + M.fv2DegTex(a1 * 180 / PI).tex + '$.', 'A tangens periódusa $\\pi$ ($180^\\circ$), ezért: ' + T(famTex(eq.fam[0], 'rad')) + ', $k\\in\\mathbb{Z}$.'];
        }
        rows.push(['általános alak (radián)', T(eq.fam.map(function (f) { return famTex(f, 'rad'); }).join(',\\ ') + ',\\ k\\in\\mathbb{Z}')]);
        rows.push(['általános alak (fok)', T(eq.fam.map(function (f) { return famTex(f, 'deg'); }).join(',\\ ') + ',\\ k\\in\\mathbb{Z}')]);
        rows.push(['megoldások a $[0;\\ 2\\pi[$ intervallumon', inCircle.length ? T(inCircle.map(function (x) { return 'x ' + radEq(x); }).join(';\\ ')) : 'nincs']);
        out.innerHTML = stack(rows) + kit.steps(st);
      }
      setTimeout(function () {
        var boxes = kit.$$('.plotbox', n);
        pc = kit.mkPlot(boxes[0], { xmin: -1.9, xmax: 1.9, ymin: -1.9, ymax: 1.9, equal: true, interactive: false });
        pg = kit.mkPlot(boxes[1], { xmin: XMIN - 0.3, xmax: XMAX + 0.3, ymin: -2.2, ymax: 2.2, interactive: false });
        kit.bindSliders(n, upd);
      }, 0);
      kit.on(kit.$('[data-sel="t"]', n), 'change', function () { kit.$('[data-in="c"]', n).dispatchEvent(new Event('input', { bubbles: true })); });
      kit.$$('[data-preset]', n).forEach(function (b) { kit.on(b, 'click', function () { var s = b.dataset.preset.split(','); kit.$('[data-sel="t"]', n).value = s[0]; setInput(n, 'c', s[1]); }); });
      return n;
    }
  });

  /* =====================================================================
     4. GRAFIKUS EGYENLET- ÉS EGYENLŐTLENSÉG-MEGOLDÓ
     ===================================================================== */
  function numberLineSvg(res, ticks) {
    var W = 340, x0 = 20, x1 = 320, y = 34, a = res.a, b = res.b;
    function X(x) { return x0 + (x - a) / (b - a) * (x1 - x0); }
    var s = '<svg class="fig" viewBox="0 0 340 78" role="img" aria-label="számegyenes a megoldáshalmazzal" style="width:100%;height:auto">';
    s += '<line x1="' + x0 + '" y1="' + y + '" x2="' + x1 + '" y2="' + y + '" stroke="var(--dim)" stroke-width="1.5"/>';
    ticks.forEach(function (t) { var px = X(t); s += '<line x1="' + px + '" y1="' + (y - 4) + '" x2="' + px + '" y2="' + (y + 4) + '" stroke="var(--dim)"/><text x="' + px + '" y="' + (y + 18) + '" text-anchor="middle" font-size="10" fill="var(--dim)">' + minus(MO.num(t, 3)) + '</text>'; });
    res.intervals.forEach(function (iv) {
      var p0 = X(iv.lo), p1 = X(iv.hi);
      if (!iv.point) s += '<line x1="' + p0 + '" y1="' + y + '" x2="' + p1 + '" y2="' + y + '" stroke="var(--c2)" stroke-width="6" stroke-linecap="butt"/>';
      function end(px, closed, edge, dir) {
        if (edge) s += '<path d="M' + (dir > 0 ? px : px) + ' ' + (y - 8) + ' L' + (px + dir * 9) + ' ' + y + ' L' + px + ' ' + (y + 8) + ' Z" fill="var(--c2)"/>';
        else s += '<circle cx="' + px + '" cy="' + y + '" r="5.5" fill="' + (closed ? 'var(--fg)' : 'var(--bg)') + '" stroke="var(--fg)" stroke-width="1.8"/>';
      }
      end(p0, iv.loC, iv.loEdge, -1); if (!iv.point) end(p1, iv.hiC, iv.hiEdge, 1);
    });
    res.roots.forEach(function (r) { var px = X(r); s += '<text x="' + px + '" y="' + (y - 12) + '" text-anchor="middle" font-size="10" fill="var(--fg)">' + minus(MO.num(r, 2)) + '</text>'; });
    return s + '</svg>';
  }
  function gInput(val) { return '<label class="f"><span>g(x)</span><input type="text" data-gx value="' + val + '" autocomplete="off" autocapitalize="off" spellcheck="false"></label>'; }

  MO.simDefs.push({
    id: 'grafikus-megoldo', title: 'Grafikus egyenlet- és egyenlőtlenség-megoldó',
    desc: 'Írd be f(x)-et és g(x)-et, válassz relációt: a metszéspontokból és a grafikonból leolvasható a megoldáshalmaz intervallumokkal, számegyenessel.',
    group: 'függvények', topic: 'algebra', sub: 'egyenletek',
    build: function (kit) {
      K = kit;
      var A = -6, B = 6;
      var n = kit.el('<div>' + kit.fnInput('x^2') + gInput('2') + kit.select('rel', 'reláció: f(x) … g(x)', [['=', '='], ['<', '<'], ['≤', '≤'], ['>', '>'], ['≥', '≥']], '<') +
        kit.plotBox(300) + kit.legend([[0, 'f(x)'], [1, 'g(x)']]) + '<div class="lab" style="margin-top:10px">számegyenes</div><div class="nl"></div><div class="out"></div>' +
        '<div class="row" style="margin-top:12px"><button class="btn sm" type="button" data-preset="x^2@2@&lt;">x² &lt; 2</button><button class="btn sm" type="button" data-preset="x^2@x+2@≤">x² ≤ x + 2</button><button class="btn sm" type="button" data-preset="x^3-3x@x@&gt;">x³ − 3x &gt; x</button><button class="btn sm" type="button" data-preset="sin(x)@0,5@=">sin x = 0,5</button><button class="btn sm" type="button" data-preset="1/x@1@≥">1/x ≥ 1</button><button class="btn sm" type="button" data-preset="|x-1|@2@≤">|x−1| ≤ 2</button></div></div>');
      var p = null;
      function upd() {
        var out = kit.$('.out', n), nl = kit.$('.nl', n), rel = kit.$('[data-sel="rel"]', n).value, cf, cg;
        try { cf = kit.readFn(n); } catch (e) { out.innerHTML = badMsg('f(x): ' + (e.cas && e.message ? e.message : 'nem értem a képletet.')); nl.innerHTML = ''; return; }
        try { var gv = kit.$('[data-gx]', n).value; cg = kit.C.compile(gv); if (cg.vars.filter(function (v) { return v !== 'x'; }).length) throw { cas: true, message: 'Csak x szerepelhet változóként.' }; }
        catch (e2) { out.innerHTML = badMsg('g(x): ' + (e2.cas && e2.message ? e2.message : (e2.message && /[a-záéíóöőúüű]/i.test(e2.message) ? e2.message : 'nem értem a képletet.'))); nl.innerHTML = ''; return; }
        var f = function (x) { var v = cf.f(x); return isFinite(v) ? v : NaN; }, g = function (x) { var v = cg.f(x); return isFinite(v) ? v : NaN; };
        var h = function (x) { return f(x) - g(x); };
        var res = M.fv2Solve(h, rel, A, B);
        if (p) {
          var lo = Infinity, hi = -Infinity;
          for (var i = 0; i <= 240; i++) { var x = A + (B - A) * i / 240;[f(x), g(x)].forEach(function (v) { if (isFinite(v) && Math.abs(v) <= 12) { lo = Math.min(lo, v); hi = Math.max(hi, v); } }); }
          if (!isFinite(lo)) { lo = -4; hi = 4; } if (hi - lo < 2) { var mid = (hi + lo) / 2; lo = mid - 1; hi = mid + 1; }
          var pad = (hi - lo) * 0.15, pts = [];
          res.roots.forEach(function (r) { var y = f(r); if (isFinite(y)) pts.push({ x: r, y: y, color: 2, label: '(' + minus(MO.num(r, 2)) + ')' }); });
          var fills = res.intervals.filter(function (iv) { return !iv.point; }).map(function (iv) { return { f: f, g: g, a: iv.lo, b: iv.hi, color: 1 }; });
          p.set({ xmin: A, xmax: B, ymin: lo - pad, ymax: hi + pad, curves: [{ f: f }, { f: g }], points: pts, fills: rel === '=' ? [] : fills });
        }
        var tk = MO.plot.ticks(A, B, 7).list.filter(function (t) { return t >= A - 1e-9 && t <= B + 1e-9; });
        nl.innerHTML = numberLineSvg(res, tk);
        var setTxt = M.fv2SetText(res), nice = res.roots.every(function (r) { return Math.abs(r * 1000 - Math.round(r * 1000)) < 1e-6; });
        var relTex = { '=': '=', '<': '<', '≤': '\\le', '>': '>', '≥': '\\ge' }[rel];
        var rs = res.roots.length ? res.roots.map(function (r) { return 'x ' + (nice ? '=' : '\\approx') + ' ' + K.tnum(Math.abs(r) < 5e-10 ? 0 : r, 3); }).join(';\\ ') : null;
        var st = ['A feladat: $f(x)' + relTex + 'g(x)$, azaz ' + (rel === '=' ? 'a két grafikon metszéspontjait keressük' : (rel === '<' || rel === '≤') ? 'azokat az $x$ értékeket, ahol az $f$ grafikonja a $g$ grafikonja ' + (rel === '<' ? 'alatt' : 'alatt vagy rajta') + ' van' : 'azokat az $x$ értékeket, ahol az $f$ grafikonja a $g$ grafikonja ' + (rel === '>' ? 'fölött' : 'fölött vagy rajta') + ' van') + '.',
          rs ? 'A metszéspontok ($f(x)-g(x)=0$ gyökei a $[' + K.tnum(A, 0) + ';\\ ' + K.tnum(B, 0) + ']$ tartományban): $' + rs + '$.' : 'A megjelenített tartományban az $f$ és $g$ grafikonjának nincs metszéspontja.'];
        if (res.poles.length) st.push('Szakadási helyek (itt a függvény nem értelmezett, nem lehet megoldás): $x\\approx ' + res.poles.map(function (r) { return K.tnum(r, 3); }).join(';\\ ') + '$.');
        if (res.edges.length) st.push('Az értelmezési tartomány határa: $x\\approx ' + res.edges.map(function (r) { return K.tnum(r, 3); }).join(';\\ ') + '$.');
        if (rel !== '=') st.push('A gyökök a számegyenest részekre bontják; mindegyik részen megnézzük, hol van a megfelelő grafikon felül (kitöltött sáv). ' + ((rel === '≤' || rel === '≥') ? 'A reláció egyenlőséget is megenged, ezért a gyökök a halmazhoz tartoznak (teli karika).' : 'A reláció szigorú, ezért a gyökök nem tartoznak a halmazhoz (üres karika).'));
        st.push('A megoldáshalmaz a megjelenített tartományon: ' + '**' + kit.esc(setTxt) + '**.');
        out.innerHTML = '<div class="ans"><div class="lab">megoldáshalmaz</div><div>' + kit.esc(setTxt) + '</div></div>' + kit.steps(st) +
          '<div class="md dim" style="font-size:13px">' + kit.md('A megoldás a megjelenített $[' + A + ';\\ ' + B + ']$ tartományra vonatkozik, és numerikus (a gyököket számítógép keresi' + (nice ? '' : ', ezért a végpontok kerekítettek') + '). A *-gal jelölt végpont a nézet széle: ott a halmaz a tartományon kívül folytatódhat.') + '</div>';
      }
      setTimeout(function () { p = kit.mkPlot(kit.$('.plotbox', n), { xmin: A, xmax: B, ymin: -6, ymax: 6, interactive: false }); upd(); }, 0);
      kit.on(kit.$('[data-fx]', n), 'input', upd); kit.on(kit.$('[data-gx]', n), 'input', upd); kit.on(kit.$('[data-sel="rel"]', n), 'change', upd);
      kit.$$('[data-preset]', n).forEach(function (b) { kit.on(b, 'click', function () {
        var s = b.dataset.preset.split('@'); kit.$('[data-fx]', n).value = s[0]; kit.$('[data-gx]', n).value = s[1]; kit.$('[data-sel="rel"]', n).value = s[2]; upd();
      }); });
      return n;
    }
  });

  /* =====================================================================
     5. PARAMÉTERES EGYENLET
     ===================================================================== */
  var PSTEPS = {
    q1: ['Az $x^2-2x+p=0$ másodfokú egyenlet ($a=1,\\ b=-2,\\ c=p$).', 'A diszkrimináns: $D=b^2-4ac=4-4p$.', '$D>0\\iff p<1$: két különböző megoldás, $x=1\\pm\\sqrt{1-p}$.', '$D=0\\iff p=1$: egy megoldás, $x=1$.', '$D<0\\iff p>1$: nincs valós megoldás.'],
    abs: ['Az abszolútérték nemnegatív: $|x-1|\\ge 0$, ezért $p<0$ esetén nincs megoldás.', '$p=0$: $|x-1|=0\\iff x=1$, egy megoldás.', '$p>0$: $x-1=p$ vagy $x-1=-p$, azaz $x=1+p$ és $x=1-p$; ezek különböznek, két megoldás.'],
    q3: ['Rendezzük: $x^2=px-1\\iff x^2-px+1=0$ ($a=1,\\ b=-p,\\ c=1$).', 'A diszkrimináns: $D=p^2-4$.', '$D>0\\iff |p|>2$, azaz $p<-2$ vagy $p>2$: két megoldás, $x=\\dfrac{p\\pm\\sqrt{p^2-4}}{2}$.', '$D=0\\iff p=\\pm 2$: egy megoldás, $x=\\dfrac{p}{2}$ ($p=2$-nél $1$, $p=-2$-nél $-1$).', '$D<0\\iff -2<p<2$: nincs valós megoldás.'],
    lin: ['**$p=0$ (elfajuló eset):** az egyenlet $2x+1=0$, elsőfokú, egy megoldása van: $x=-\\dfrac{1}{2}$.', '**$p\\neq 0$:** másodfokú egyenlet ($a=p,\\ b=2,\\ c=1$), a diszkrimináns $D=4-4p$.', '$D>0\\iff p<1$ (és $p\\neq 0$): két megoldás, $x=\\dfrac{-1\\pm\\sqrt{1-p}}{p}$.', '$D=0\\iff p=1$: egy megoldás, $x=-1$.', '$D<0\\iff p>1$: nincs valós megoldás.']
  };
  MO.simDefs.push({
    id: 'parameteres', title: 'Paraméteres egyenlet: hány megoldás van?',
    desc: 'Válassz egyenlettípust, mozgasd a p paramétert: a két oldal grafikonján látod a megoldásokat, alatta p minden értékére levezetett megoldásszám-összefoglalót.',
    group: 'függvények', topic: 'algebra', sub: 'egyenletek',
    build: function (kit) {
      K = kit;
      var n = kit.el('<div>' + kit.select('t', 'egyenlettípus', M.fv2ParamTypes.map(function (t) { return [t.id, t.label]; }), 'q1') + kit.slider('p', 'p', -4, 4, 0.1, 0) + kit.plotBox(280) +
        kit.legend([[0, 'bal oldal'], [1, 'jobb oldal']]) + '<div class="out"></div><div class="sum"></div>' +
        '<div class="row" style="margin-top:12px"><button class="btn sm" type="button" data-preset="q1,0">két megoldás</button><button class="btn sm" type="button" data-preset="q1,1">pontosan egy</button><button class="btn sm" type="button" data-preset="q1,2">nincs megoldás</button><button class="btn sm" type="button" data-preset="lin,0">p = 0 elfajuló</button><button class="btn sm" type="button" data-preset="q3,2">x² = 2x − 1</button><button class="btn sm" type="button" data-preset="abs,3">|x−1| = 3</button></div></div>');
      var p = null;
      function sumHtml(id) {
        var t = M.fv2ParamType(id), sm = M.fv2ParamSummary(id), groups = [0, 1, 2].map(function (k) { return [k, sm.filter(function (e) { return e.n === k; }).map(function (e) { return e.cond; })]; });
        var lines = groups.map(function (g) { return g[1].length ? [g[0] + ' megoldás', T(g[1].join('\\ \\text{ vagy }\\ ').replace(/\\text\{ vagy \}\s*\\text\{ vagy \}/g, '\\text{ vagy }'))] : [g[0] + ' megoldás', 'egy p értékre sem']; });
        return '<div class="lab" style="margin-top:14px">összefoglaló: ' + kit.esc(t.label) + '</div>' + kit.steps(PSTEPS[id]) + '<div class="lab" style="margin-top:10px">p mely értékeire hány megoldás van</div>' + kv(lines);
      }
      function upd(v) {
        var id = kit.$('[data-sel="t"]', n).value, t = M.fv2ParamType(id), pv = Math.round(v.p * 1000) / 1000, r = M.fv2ParamSolve(id, pv), out = kit.$('.out', n);
        if (p) {
          var pts = r.roots.map(function (x) { return { x: x, y: t.L(x, pv), color: 2, label: 'x=' + minus(MO.num(x, 2)) }; });
          p.set({ curves: [{ f: function (x) { return t.L(x, pv); } }, { f: function (x) { return t.R(x, pv); } }], points: pts });
        }
        var rows = [['egyenlet', T(t.Ltex.replace(/p/g, 'p') + ' = ' + t.Rtex).replace('=  ', '= ')], ['p', T('p = ' + K.tnum(pv, 2))]];
        if (id === 'lin') rows[0][1] = T('px^2+2x+1=0');
        else if (id === 'q1') rows[0][1] = T('x^2-2x+p=0'); else if (id === 'q3') rows[0][1] = T('x^2=px-1'); else rows[0][1] = T('|x-1|=p');
        if (r.degenerate) rows.push(['megjegyzés', 'p = 0: az egyenlet elsőfokú ($2x+1=0$), nem másodfokú.']);
        else if (r.D !== null) rows.push(['diszkrimináns', T('D = ' + K.tnum(r.D, 3))]);
        rows.push(['valós megoldások száma', '**' + r.count + '**']);
        rows.push(['megoldások', r.count ? T(r.roots.map(function (x, i) { return 'x_{' + (i + 1) + '} ' + eqT(x); }).join(';\\ ')) : 'nincs valós megoldás']);
        out.innerHTML = kv(rows);
        kit.$('.sum', n).innerHTML = sumHtml(id);
      }
      setTimeout(function () { p = kit.mkPlot(kit.$('.plotbox', n), { xmin: -6, xmax: 6, ymin: -6, ymax: 6, interactive: false }); kit.bindSliders(n, upd); }, 0);
      kit.on(kit.$('[data-sel="t"]', n), 'change', function () { kit.$('[data-in="p"]', n).dispatchEvent(new Event('input', { bubbles: true })); });
      kit.$$('[data-preset]', n).forEach(function (b) { kit.on(b, 'click', function () { var s = b.dataset.preset.split(','); kit.$('[data-sel="t"]', n).value = s[0]; setInput(n, 'p', s[1]); }); });
      return n;
    }
  });
})(typeof window !== 'undefined' ? window : globalThis);
