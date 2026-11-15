/* MATEK OS – síkgeometriai szimulációk: háromszög, kör és szögek, transzformációk, vektorok, koordinátageometria */
(function (root) {
  'use strict';
  var MO = root.MO = root.MO || {};
  var M = MO.models = MO.models || {};
  MO.simDefs = MO.simDefs || [];
  var PI = Math.PI, TAU = 2 * PI;

  /* ================= MODELLEK (DOM-mentes) ================= */
  M.geoDist = function (a, b) { return Math.hypot(a.x - b.x, a.y - b.y); };
  M.geoMid = function (a, b) { return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }; };
  /* a p csúcsnál az a és b irányok közti szög (0..pi); elfajuló esetben 0 */
  M.geoAngleAt = function (p, a, b) {
    var ux = a.x - p.x, uy = a.y - p.y, vx = b.x - p.x, vy = b.y - p.y, l = Math.hypot(ux, uy) * Math.hypot(vx, vy);
    if (l < 1e-12) return 0;
    return Math.acos(Math.max(-1, Math.min(1, (ux * vx + uy * vy) / l)));
  };
  /* szögív a p csúcsnál: {from, to} radiánban, to - from = a szög (< pi) */
  M.geoArcSpan = function (p, a, b) {
    var t1 = Math.atan2(a.y - p.y, a.x - p.x), t2 = Math.atan2(b.y - p.y, b.x - p.x), d = t2 - t1;
    while (d < 0) d += TAU; while (d >= TAU) d -= TAU;
    return d <= PI ? { from: t1, to: t1 + d } : { from: t2, to: t2 + (TAU - d) };
  };
  M.geoPolyArea = function (pts) { var s = 0, i, j; for (i = 0; i < pts.length; i++) { j = (i + 1) % pts.length; s += pts[i].x * pts[j].y - pts[j].x * pts[i].y; } return s / 2; };
  M.geoPerimeter = function (pts) { var s = 0, i; for (i = 0; i < pts.length; i++) s += M.geoDist(pts[i], pts[(i + 1) % pts.length]); return s; };
  M.geoFoot = function (p, a, b) {
    var dx = b.x - a.x, dy = b.y - a.y, l2 = dx * dx + dy * dy; if (l2 < 1e-18) return null;
    var t = ((p.x - a.x) * dx + (p.y - a.y) * dy) / l2; return { x: a.x + t * dx, y: a.y + t * dy };
  };
  /* háromszög nevezetes adatai; elfajuló (egy egyenesre eső) esetben {degenerate: true} */
  M.geoTriangle = function (A, B, C) {
    var a = M.geoDist(B, C), b = M.geoDist(A, C), c = M.geoDist(A, B), d2 = (B.x - A.x) * (C.y - A.y) - (B.y - A.y) * (C.x - A.x), mx = Math.max(a, b, c);
    if (Math.min(a, b, c) < 1e-9 || Math.abs(d2) < 1e-9 * mx * mx) return { degenerate: true, a: a, b: b, c: c };
    var area = Math.abs(d2) / 2, s = (a + b + c) / 2;
    var D = 2 * (A.x * (B.y - C.y) + B.x * (C.y - A.y) + C.x * (A.y - B.y)), a2 = A.x * A.x + A.y * A.y, b2 = B.x * B.x + B.y * B.y, c2 = C.x * C.x + C.y * C.y;
    var O = { x: (a2 * (B.y - C.y) + b2 * (C.y - A.y) + c2 * (A.y - B.y)) / D, y: (a2 * (C.x - B.x) + b2 * (A.x - C.x) + c2 * (B.x - A.x)) / D };
    var G = { x: (A.x + B.x + C.x) / 3, y: (A.y + B.y + C.y) / 3 };
    return { degenerate: false, a: a, b: b, c: c, alpha: M.geoAngleAt(A, B, C), beta: M.geoAngleAt(B, A, C), gamma: M.geoAngleAt(C, A, B),
      perimeter: a + b + c, s: s, area: area, centroid: G, circumcenter: O, R: M.geoDist(O, A),
      orthocenter: { x: A.x + B.x + C.x - 2 * O.x, y: A.y + B.y + C.y - 2 * O.y },
      incenter: { x: (a * A.x + b * B.x + c * C.x) / (a + b + c), y: (a * A.y + b * B.y + c * C.y) / (a + b + c) }, r: area / s };
  };
  /* a szögfelező talppontja az A csúcsból a BC oldalon (b = |AC|, c = |AB|) */
  M.geoBisectorFoot = function (A, B, C) { var b = M.geoDist(A, C), c = M.geoDist(A, B); return { x: (b * B.x + c * C.x) / (b + c), y: (b * B.y + c * C.y) / (b + c) }; };

  /* ---- kör és szögek ---- */
  M.geoOnCircle = function (O, r, t) { return { x: O.x + r * Math.cos(t), y: O.y + r * Math.sin(t) }; };
  function mod2pi(t) { t = t % TAU; return t < 0 ? t + TAU : t; }
  /* A, B, P a körön (szögparaméterük ta, tb, tp). Kerületi szög P-nél, és az AB ív (amely nem tartalmazza P-t) középponti szöge. */
  M.geoInscribedCentral = function (O, r, ta, tb, tp) {
    var eps = 1e-9, da = mod2pi(tb - ta), dp = mod2pi(tp - ta);
    if (da < eps || da > TAU - eps || dp < eps || dp > TAU - eps || Math.abs(dp - da) < eps) return { degenerate: true };
    var A = M.geoOnCircle(O, r, ta), B = M.geoOnCircle(O, r, tb), P = M.geoOnCircle(O, r, tp), from, span;
    if (dp < da) { from = tb; span = TAU - da; } else { from = ta; span = da; }
    return { degenerate: false, A: A, B: B, P: P, inscribed: M.geoAngleAt(P, A, B), central: span, arcFrom: from, chord: M.geoDist(A, B) };
  };
  /* külső pontból húzott érintők; null, ha a pont a körön belül van */
  M.geoTangents = function (O, r, P) {
    var d = M.geoDist(O, P); if (d < r - 1e-12) return null;
    if (d - r < 1e-12) return { d: d, t: 0, pts: [{ x: P.x, y: P.y }], between: PI };
    var phi = Math.atan2(P.y - O.y, P.x - O.x), th = Math.acos(r / d);
    return { d: d, t: Math.sqrt(d * d - r * r), pts: [M.geoOnCircle(O, r, phi + th), M.geoOnCircle(O, r, phi - th)], between: 2 * Math.asin(r / d) };
  };
  /* a körre írt négy pont (szögparaméterekkel) húrnégyszöget alkot; a szögek a csúcsok körüljárási sorrendjében */
  M.geoCyclicQuad = function (O, r, ts) {
    var idx = [0, 1, 2, 3].sort(function (i, j) { return mod2pi(ts[i]) - mod2pi(ts[j]); }), i, k, m = ts.map(mod2pi);
    for (k = 0; k < 4; k++) if (Math.abs(m[idx[(k + 1) % 4]] - m[idx[k]]) < 1e-9 || Math.abs(Math.abs(m[idx[(k + 1) % 4]] - m[idx[k]]) - TAU) < 1e-9) return { degenerate: true };
    var pts = idx.map(function (i2) { return M.geoOnCircle(O, r, ts[i2]); }), ang = [];
    for (i = 0; i < 4; i++) ang.push(M.geoAngleAt(pts[i], pts[(i + 3) % 4], pts[(i + 1) % 4]));
    return { degenerate: false, idx: idx, pts: pts, angles: ang, sum02: ang[0] + ang[2], sum13: ang[1] + ang[3] };
  };

  /* ---- transzformációk ---- */
  M.geoReflectLine = function (P, A, B) { var F = M.geoFoot(P, A, B); return F ? { x: 2 * F.x - P.x, y: 2 * F.y - P.y } : null; };
  M.geoReflectPoint = function (P, C) { return { x: 2 * C.x - P.x, y: 2 * C.y - P.y }; };
  M.geoTranslate = function (P, vx, vy) { return { x: P.x + vx, y: P.y + vy }; };
  M.geoRotate = function (P, C, phi) { var c = Math.cos(phi), s = Math.sin(phi), dx = P.x - C.x, dy = P.y - C.y; return { x: C.x + c * dx - s * dy, y: C.y + s * dx + c * dy }; };
  M.geoHomothety = function (P, C, l) { return { x: C.x + l * (P.x - C.x), y: C.y + l * (P.y - C.y) }; };
  /* kind: axis | point | shift | rot | homo ; par: {A, B, C, vx, vy, phi (rad), lambda}; null, ha a tengely elfajuló */
  M.geoTransform = function (kind, pts, par) {
    var out = [], i, q;
    for (i = 0; i < pts.length; i++) {
      var P = pts[i];
      if (kind === 'axis') q = M.geoReflectLine(P, par.A, par.B); else if (kind === 'point') q = M.geoReflectPoint(P, par.C);
      else if (kind === 'shift') q = M.geoTranslate(P, par.vx, par.vy); else if (kind === 'rot') q = M.geoRotate(P, par.C, par.phi);
      else if (kind === 'homo') q = M.geoHomothety(P, par.C, par.lambda); else q = null;
      if (!q) return null; out.push(q);
    }
    return out;
  };
  M.geoTransformInfo = function (pts, img) {
    var n = pts.length, i, j, iso = true, p0 = M.geoPerimeter(pts), p1 = M.geoPerimeter(img), a0 = M.geoPolyArea(pts), a1 = M.geoPolyArea(img);
    for (i = 0; i < n; i++) for (j = i + 1; j < n; j++) if (Math.abs(M.geoDist(pts[i], pts[j]) - M.geoDist(img[i], img[j])) > 1e-9 * (1 + M.geoDist(pts[i], pts[j]))) iso = false;
    return { isometry: iso, perimeterRatio: p0 > 1e-12 ? p1 / p0 : NaN, areaRatio: Math.abs(a0) > 1e-12 ? Math.abs(a1) / Math.abs(a0) : NaN,
      orientation: (Math.abs(a0) < 1e-12 || Math.abs(a1) < 1e-12) ? 0 : (a0 * a1 > 0 ? 1 : -1) };
  };

  /* ---- vektorok ---- */
  M.vecLen = function (a) { return Math.hypot(a.x, a.y); };
  M.vecDot = function (a, b) { return a.x * b.x + a.y * b.y; };
  M.vecAngle = function (a, b) { var l = M.vecLen(a) * M.vecLen(b); if (l < 1e-12) return null; return Math.acos(Math.max(-1, Math.min(1, M.vecDot(a, b) / l))); };
  M.vecProj = function (a, b) { var l2 = M.vecDot(b, b); if (l2 < 1e-12) return null; var k = M.vecDot(a, b) / l2; return { x: k * b.x, y: k * b.y, k: k }; };
  /* v = s d1 + t d2; null, ha d1 és d2 párhuzamos (vagy nullvektor) */
  M.vecDecomp = function (v, d1, d2) {
    var det = d1.x * d2.y - d1.y * d2.x; if (Math.abs(det) < 1e-9 * (M.vecLen(d1) * M.vecLen(d2) + 1e-300)) return null;
    return { s: (v.x * d2.y - v.y * d2.x) / det, t: (d1.x * v.y - d1.y * v.x) / det };
  };

  /* ---- koordinátageometria ---- */
  M.geoGcd = function (a, b) { a = Math.abs(a); b = Math.abs(b); while (b > 1e-9) { var t = a % b; a = b; b = t; } return a; };
  function nearInt(x) { return Math.abs(x - Math.round(x)) < 1e-9; }
  /* a P és Q ponton átmenő egyenes: Ax + By = C (egész együtthatókkal, ha lehet); null, ha P = Q */
  M.geoLine = function (P, Q) {
    var dx = Q.x - P.x, dy = Q.y - P.y; if (Math.hypot(dx, dy) < 1e-12) return null;
    var A = dy, B = -dx, C = dy * P.x - dx * P.y, ks = [1, 2, 4, 8], i, isInt = false;
    for (i = 0; i < ks.length; i++) if (nearInt(A * ks[i]) && nearInt(B * ks[i]) && nearInt(C * ks[i])) { A = Math.round(A * ks[i]); B = Math.round(B * ks[i]); C = Math.round(C * ks[i]); isInt = true; break; }
    if (isInt) { var g = M.geoGcd(M.geoGcd(A, B), C || 1); if (g > 0) { A /= g; B /= g; C /= g; } }
    if (A < 0 || (A === 0 && B < 0)) { A = -A; B = -B; C = -C; }
    A += 0; B += 0; C += 0;
    return { A: A, B: B, C: C, integer: isInt, vertical: Math.abs(B) < 1e-12, m: Math.abs(B) < 1e-12 ? null : -A / B, b: Math.abs(B) < 1e-12 ? null : C / B,
      xint: Math.abs(A) < 1e-12 ? null : C / A, yint: Math.abs(B) < 1e-12 ? null : C / B, dir: { x: B, y: -A }, normal: { x: A, y: B } };
  };
  M.geoLineLine = function (l1, l2) {
    var n1 = Math.hypot(l1.A, l1.B), n2 = Math.hypot(l2.A, l2.B), det = l1.A * l2.B - l2.A * l1.B, dot = l1.A * l2.A + l1.B * l2.B;
    var angle = Math.acos(Math.min(1, Math.abs(dot) / (n1 * n2))), perp = Math.abs(dot) < 1e-9 * n1 * n2;
    if (Math.abs(det) < 1e-9 * n1 * n2) {
      var px = l1.A * l1.C / (n1 * n1), py = l1.B * l1.C / (n1 * n1);
      return { kind: Math.abs(l2.A * px + l2.B * py - l2.C) / n2 < 1e-9 ? 'same' : 'parallel', angle: 0, perpendicular: false };
    }
    return { kind: 'point', x: (l1.C * l2.B - l2.C * l1.B) / det, y: (l1.A * l2.C - l2.A * l1.C) / det, angle: angle, perpendicular: perp };
  };
  /* kör (középpont O, sugár r) és az Ax+By=C egyenes metszése */
  M.geoCircleLine = function (O, r, l) {
    var A = l.A, B = l.B, C = l.C, n = Math.hypot(A, B), d = Math.abs(A * O.x + B * O.y - C) / n, quad, vert = Math.abs(B) < 1e-12, pts = [], cnt, D, i;
    if (!vert) quad = { v: 'x', a: A * A + B * B, b: -2 * (B * B * O.x + A * (C - O.y * B)), c: B * B * O.x * O.x + (C - O.y * B) * (C - O.y * B) - r * r * B * B };
    else { var x0 = C / A; quad = { v: 'y', a: 1, b: -2 * O.y, c: O.y * O.y + (x0 - O.x) * (x0 - O.x) - r * r, x0: x0 }; }
    D = quad.b * quad.b - 4 * quad.a * quad.c;
    var tol = 1e-9 * (quad.b * quad.b + Math.abs(4 * quad.a * quad.c) + 1);
    cnt = Math.abs(D) <= tol ? 1 : (D > 0 ? 2 : 0); quad.D = cnt === 1 ? 0 : D;
    for (i = 0; i < cnt; i++) {
      var s = cnt === 1 ? 0 : (i === 0 ? 1 : -1), w = (-quad.b + s * Math.sqrt(Math.max(quad.D, 0))) / (2 * quad.a);
      pts.push(vert ? { x: quad.x0, y: w } : { x: w, y: (C - A * w) / B });
    }
    return { n: cnt, pts: pts, d: d, quad: quad };
  };
  /* parabola: y = (x-u)^2/(2p) + v (p > 0) */
  M.geoParabola = function (u, v, p) { return { focus: { x: u, y: v + p / 2 }, directrix: v - p / 2, f: function (x) { return (x - u) * (x - u) / (2 * p) + v; } }; };
  M.geoParabolaLine = function (u, v, p, l) {
    var f = function (x) { return (x - u) * (x - u) / (2 * p) + v; };
    if (Math.abs(l.B) < 1e-12) { var x0 = l.C / l.A; return { n: 1, vertical: true, pts: [{ x: x0, y: f(x0) }], quad: null }; }
    var m = -l.A / l.B, k = l.C / l.B, quad = { a: 1, b: -2 * (u + p * m), c: u * u + 2 * p * (v - k), m: m, k: k };
    var D = quad.b * quad.b - 4 * quad.c, tol = 1e-9 * (quad.b * quad.b + Math.abs(4 * quad.c) + 1), cnt = Math.abs(D) <= tol ? 1 : (D > 0 ? 2 : 0), pts = [], i;
    quad.D = cnt === 1 ? 0 : D;
    for (i = 0; i < cnt; i++) { var x = (-quad.b + (i === 0 ? 1 : -1) * (cnt === 1 ? 0 : Math.sqrt(D))) / 2; pts.push({ x: x, y: m * x + k }); }
    return { n: cnt, vertical: false, pts: pts, quad: quad };
  };

  /* ================= KÖZÖS SEGÉDEK (a build-eken belül használva) ================= */
  function toDeg(t) { return t * 180 / PI; }
  function toRad(d) { return d * PI / 180; }
  function arrowSegs(a, b, o) {
    var dx = b.x - a.x, dy = b.y - a.y, l = Math.hypot(dx, dy), res = [], th, L, i;
    o = o || {}; var base = function (p, q) { var s = { a: [p.x, p.y], b: [q.x, q.y] }; for (var k in o) s[k] = o[k]; return s; };
    res.push(base(a, b)); if (l < 1e-9) return res;
    th = Math.atan2(dy, dx); L = Math.min(0.4, l * 0.45);
    for (i = -1; i <= 1; i += 2) res.push(base(b, { x: b.x - L * Math.cos(th + i * 0.45), y: b.y - L * Math.sin(th + i * 0.45) }));
    return res;
  }
  function longLine(P, Q, ext) { var dx = Q.x - P.x, dy = Q.y - P.y, l = Math.hypot(dx, dy), t = (ext || 60) / l; return { a: [P.x - t * dx, P.y - t * dy], b: [P.x + t * dx, P.y + t * dy] }; }
  function rightMark(V, p1, p2, s) {
    var u = { x: p1.x - V.x, y: p1.y - V.y }, w = { x: p2.x - V.x, y: p2.y - V.y }, lu = Math.hypot(u.x, u.y), lw = Math.hypot(w.x, w.y);
    if (lu < 1e-9 || lw < 1e-9) return null; u.x *= s / lu; u.y *= s / lu; w.x *= s / lw; w.y *= s / lw;
    return { pts: [[V.x + u.x, V.y + u.y], [V.x + u.x + w.x, V.y + u.y + w.y], [V.x + w.x, V.y + w.y]], close: false, w: 1.2, dim: true };
  }
  function arcPts(O, r, from, span, n) { var res = [], i; for (i = 0; i <= n; i++) res.push([O.x + r * Math.cos(from + span * i / n), O.y + r * Math.sin(from + span * i / n)]); return res; }
  function setIn(kit, n, k, v) { var i = kit.$('[data-in="' + k + '"]', n); if (i) { i.value = v; i.dispatchEvent(new Event('input')); } }
  function setSel(kit, n, v) { var s = kit.$('select', n); if (s) { s.value = v; s.dispatchEvent(new Event('change')); } }
  function fmtTools(kit) {
    var t = {};
    t.n = function (x, d) { return kit.tnum(x, d === undefined ? 2 : d); };
    t.ap = function (x, d) { d = d === undefined ? 2 : d; var r = Math.round(x * Math.pow(10, d)) / Math.pow(10, d); return (Math.abs(r - x) < 1e-9 ? '= ' : '\\approx ') + kit.tnum(x, d); };
    t.p = function (x, d) { return x < 0 ? '(' + kit.tnum(x, d === undefined ? 2 : d) + ')' : kit.tnum(x, d === undefined ? 2 : d); };
    t.pt = function (q, d) { return '\\left(' + kit.tnum(q.x, d === undefined ? 2 : d) + ';\\ ' + kit.tnum(q.y, d === undefined ? 2 : d) + '\\right)'; };
    t.ptA = function (q, d) { var a = t.pt(q, d), ex = Math.abs(Math.round(q.x * 100) / 100 - q.x) < 1e-9 && Math.abs(Math.round(q.y * 100) / 100 - q.y) < 1e-9; return (ex ? '=' : '\\approx') + ' ' + a; };
    t.deg = function (rad, d) { return kit.tnum(toDeg(rad), d === undefined ? 2 : d) + '^\\circ'; };
    t.degAp = function (rad, d) { d = d === undefined ? 2 : d; return t.ap(toDeg(rad), d).replace(/^(.*?) (-?[0-9{},]+)$/, '$1 $2') + '^\\circ'; };
    t.tex = function (s) { return kit.tex(s); };
    return t;
  }

  /* ================= 1. MOZGATHATÓ HÁROMSZÖG ================= */
  MO.simDefs.push({
    id: 'haromszog', title: 'Mozgatható háromszög', group: 'geometria', topic: 'geometria', sub: 'alakzatok',
    desc: 'Húzd a csúcsokat, és nézd az oldalakat, szögeket, kerületet, területet; kapcsold be a nevezetes vonalakat, pontokat és köröket.',
    formulas: ['geo-szinusztetel', 'geo-koszinusztetel', 'geo-beirt-korulirt', 'geo-sulypont-koord', 'geo-haromszog-terulet'],
    build: function (kit) {
      var F = fmtTools(kit), S = { A: { x: 1, y: 1 }, B: { x: 9, y: 2 }, C: { x: 4, y: 7.5 } }, L = { med: true, alt: false, perp: false, bis: false }, p = null;
      var n = kit.el('<div><div class="row" role="group" aria-label="Rétegek" style="margin-bottom:10px">' +
        '<button class="btn sm" type="button" data-layer="med" aria-pressed="true">súlyvonalak, S</button><button class="btn sm" type="button" data-layer="alt" aria-pressed="false">magasságok, M</button>' +
        '<button class="btn sm" type="button" data-layer="perp" aria-pressed="false">oldalfelezők, köré írt kör</button><button class="btn sm" type="button" data-layer="bis" aria-pressed="false">szögfelezők, beírt kör</button></div>' +
        kit.plotBox(340) + '<div class="legend"><span><i style="border-color:var(--c1);border-top-style:dashed"></i>súlyvonal</span><span><i style="border-color:var(--c2);border-top-style:dotted"></i>magasság</span><span><i style="border-color:var(--c3);border-top-style:dashed"></i>oldalfelező merőleges</span><span><i style="border-top-style:dashed"></i>szögfelező</span></div>' +
        '<div class="out md" style="margin-top:12px"></div>' +
        '<div class="lab" style="margin-top:12px">tipikus helyzetek</div><div class="row">' +
        '<button class="btn sm" type="button" data-preset="derekszogu">derékszögű</button><button class="btn sm" type="button" data-preset="egyenloszaru">egyenlő szárú</button>' +
        '<button class="btn sm" type="button" data-preset="szabalyos">szabályos</button><button class="btn sm" type="button" data-preset="tompaszogu">tompaszögű</button><button class="btn sm" type="button" data-preset="elfajulo">egy egyenesen</button></div></div>');
      function layerBtns() { kit.$$('[data-layer]', n).forEach(function (b) { b.setAttribute('aria-pressed', L[b.dataset.layer] ? 'true' : 'false'); }); }
      function draw() {
        if (!p) return;
        var A = S.A, B = S.B, C = S.C, T = M.geoTriangle(A, B, C), segs = [], circles = [], labels = [], arcs = [], polys = [{ pts: [[A.x, A.y], [B.x, B.y], [C.x, C.y]], fill: true, alpha: 0.07, w: 2 }];
        var pts = [{ x: A.x, y: A.y, label: 'A', drag: true, id: 'A' }, { x: B.x, y: B.y, label: 'B', drag: true, id: 'B' }, { x: C.x, y: C.y, label: 'C', drag: true, id: 'C' }];
        var V = [A, B, C], nm = ['a', 'b', 'c'];
        if (!T.degenerate) {
          var spans = [M.geoArcSpan(A, B, C), M.geoArcSpan(B, A, C), M.geoArcSpan(C, A, B)], vals = [T.alpha, T.beta, T.gamma], gr = ['α', 'β', 'γ'], i;
          for (i = 0; i < 3; i++) {
            arcs.push({ x: V[i].x, y: V[i].y, r: 24, from: spans[i].from, to: spans[i].to, label: gr[i] + ' ' + kit.num(toDeg(vals[i]), 1) + '°' });
            var o1 = V[(i + 1) % 3], o2 = V[(i + 2) % 3], mid = M.geoMid(o1, o2), ux = mid.x - V[i].x, uy = mid.y - V[i].y, ul = Math.hypot(ux, uy) || 1;
            labels.push({ x: mid.x, y: mid.y, text: nm[i], dx: 12 * ux / ul, dy: 12 * uy / ul, align: 'center', dim: true });
          }
          if (L.med) {
            for (i = 0; i < 3; i++) { var mm = M.geoMid(V[(i + 1) % 3], V[(i + 2) % 3]); segs.push({ a: [V[i].x, V[i].y], b: [mm.x, mm.y], color: 1, dash: [5, 4] }); }
            pts.push({ x: T.centroid.x, y: T.centroid.y, label: 'S', color: 1 });
          }
          if (L.alt) {
            for (i = 0; i < 3; i++) {
              var o1b = V[(i + 1) % 3], o2b = V[(i + 2) % 3], ft = M.geoFoot(V[i], o1b, o2b);
              segs.push({ a: [V[i].x, V[i].y], b: [ft.x, ft.y], color: 2, dash: [2, 3], w: 1.8 });
              var t = ((ft.x - o1b.x) * (o2b.x - o1b.x) + (ft.y - o1b.y) * (o2b.y - o1b.y)) / (T[nm[i]] * T[nm[i]]);
              if (t < 0) segs.push({ a: [o1b.x, o1b.y], b: [ft.x, ft.y], dim: true, dash: [2, 3] }); else if (t > 1) segs.push({ a: [o2b.x, o2b.y], b: [ft.x, ft.y], dim: true, dash: [2, 3] });
            }
            pts.push({ x: T.orthocenter.x, y: T.orthocenter.y, label: 'M', color: 2 });
          }
          if (L.perp) {
            for (i = 0; i < 3; i++) { var mp = M.geoMid(V[(i + 1) % 3], V[(i + 2) % 3]); segs.push({ a: [mp.x, mp.y], b: [T.circumcenter.x, T.circumcenter.y], color: 3, dash: [8, 3] }); }
            if (T.R < 1e4) circles.push({ x: T.circumcenter.x, y: T.circumcenter.y, r: T.R, color: 3, dash: [8, 3] });
            pts.push({ x: T.circumcenter.x, y: T.circumcenter.y, label: 'O', color: 3 });
          }
          if (L.bis) {
            for (i = 0; i < 3; i++) { var bf = M.geoBisectorFoot(V[i], V[(i + 1) % 3], V[(i + 2) % 3]); segs.push({ a: [V[i].x, V[i].y], b: [bf.x, bf.y], dash: [10, 4] }); }
            circles.push({ x: T.incenter.x, y: T.incenter.y, r: T.r, dash: [10, 4] });
            pts.push({ x: T.incenter.x, y: T.incenter.y, label: 'K' });
          }
        }
        p.set({ points: pts, segments: segs, circles: circles, labels: labels, arcs: arcs, polys: polys });
        kit.$('.out', n).innerHTML = report(T);
      }
      function report(T) {
        var A = S.A, B = S.B, C = S.C, t = F.tex, md = kit.md;
        if (T.degenerate) return '<p class="msg bad">A három pont egy egyenesre esik (vagy két csúcs egybeesik), ezért nincs háromszög: a terület 0, a szögek, a szinusz- és koszinusztétel, a köré és beírt kör nem értelmezhető. Húzd szét a csúcsokat!</p>' +
          kit.steps(['Az oldalak hossza: $a ' + F.ap(T.a) + '$, $b ' + F.ap(T.b) + '$, $c ' + F.ap(T.c) + '$.', 'Elfajuló esetben az egyik oldal a másik kettő összege (a háromszög-egyenlőtlenségben egyenlőség áll), ezért a háromszög területe $0$.']);
        var al = toDeg(T.alpha), be = toDeg(T.beta), ga = toDeg(T.gamma), R2 = 2 * T.R, steps = [], note = '';
        var kv = '<dl class="kv"><dt>oldalak</dt><dd>' + t('a ' + F.ap(T.a) + ',\\ b ' + F.ap(T.b) + ',\\ c ' + F.ap(T.c)) + '</dd>' +
          '<dt>szögek</dt><dd>' + t('\\alpha ' + F.ap(al) + '^\\circ,\\ \\beta ' + F.ap(be) + '^\\circ,\\ \\gamma ' + F.ap(ga) + '^\\circ') + '</dd>' +
          '<dt>kerület</dt><dd>' + t('K ' + F.ap(T.perimeter)) + '</dd><dt>terület</dt><dd>' + t('T ' + F.ap(T.area)) + '</dd></dl>';
        var eq = function (x, y) { return Math.abs(x - y) < 1e-6; };
        if (eq(T.a, T.b) && eq(T.b, T.c)) note = 'Szabályos háromszög: minden oldal egyenlő, minden szög $60^\\circ$, és $S = M = O = K$.';
        else if (Math.abs(ga - 90) < 1e-6 || Math.abs(al - 90) < 1e-6 || Math.abs(be - 90) < 1e-6) note = 'Derékszögű háromszög: a Pitagorasz-tétel érvényes, és a köré írt kör középpontja az átfogó felezőpontja (Thalész-tétel), $R$ az átfogó fele.';
        else if (eq(T.a, T.b) || eq(T.b, T.c) || eq(T.a, T.c)) note = 'Egyenlő szárú háromszög: két oldal és a velük szemközti két szög egyenlő.';
        steps.push('A szögeket a koszinusztételből számoljuk: $\\cos\\alpha=\\dfrac{b^2+c^2-a^2}{2bc}$ stb. Összegük $' + F.n(al + be + ga) + '^\\circ$.');
        steps.push('**Szinusztétel:** $\\dfrac{a}{\\sin\\alpha}=\\dfrac{' + F.n(T.a) + '}{' + F.n(Math.sin(T.alpha), 4) + '} ' + F.ap(T.a / Math.sin(T.alpha)) + '$, $\\dfrac{b}{\\sin\\beta} ' + F.ap(T.b / Math.sin(T.beta)) + '$, $\\dfrac{c}{\\sin\\gamma} ' + F.ap(T.c / Math.sin(T.gamma)) + '$. Mindhárom egyenlő $2R ' + F.ap(R2) + '$-vel, vagyis $R ' + F.ap(T.R) + '$.');
        var lc = T.c * T.c, rc = T.a * T.a + T.b * T.b - 2 * T.a * T.b * Math.cos(T.gamma);
        var la = T.a * T.a, ra = T.b * T.b + T.c * T.c - 2 * T.b * T.c * Math.cos(T.alpha), lb = T.b * T.b, rb = T.a * T.a + T.c * T.c - 2 * T.a * T.c * Math.cos(T.beta);
        steps.push('**Koszinusztétel:** $c^2=a^2+b^2-2ab\\cos\\gamma$. Bal oldal: $c^2 ' + F.ap(lc) + '$. Jobb oldal: $' + F.n(T.a * T.a) + '+' + F.n(T.b * T.b) + '-2\\cdot' + F.n(T.a) + '\\cdot' + F.n(T.b) + '\\cdot' + F.n(Math.cos(T.gamma), 4) + ' ' + F.ap(rc) + '$. A másik két oldalra is: a két oldal különbsége legfeljebb $' + F.n(Math.max(Math.abs(la - ra), Math.abs(lb - rb), Math.abs(lc - rc)), 6) + '$.');
        steps.push('**Kerület és terület:** $K=a+b+c ' + F.ap(T.perimeter) + '$; $T=\\dfrac{ab\\sin\\gamma}{2} ' + F.ap(T.a * T.b * Math.sin(T.gamma) / 2) + '$; Héron: $\\sqrt{s(s-a)(s-b)(s-c)} ' + F.ap(Math.sqrt(T.s * (T.s - T.a) * (T.s - T.b) * (T.s - T.c))) + '$.');
        if (L.med) steps.push('**Súlypont:** $S=\\left(\\dfrac{x_A+x_B+x_C}{3};\\dfrac{y_A+y_B+y_C}{3}\\right) ' + F.ptA(T.centroid) + '$. A súlyvonalakat $S$ csúcstól számítva $2:1$ arányban osztja.');
        if (L.alt) steps.push('**Magasságpont:** $M ' + F.ptA(T.orthocenter) + '$; $m_a=\\dfrac{2T}{a} ' + F.ap(2 * T.area / T.a) + '$, $m_b ' + F.ap(2 * T.area / T.b) + '$, $m_c ' + F.ap(2 * T.area / T.c) + '$.');
        if (L.perp) steps.push('**Köré írt kör:** $O ' + F.ptA(T.circumcenter) + '$, $R ' + F.ap(T.R) + '$. Ellenőrzés: $OA ' + F.ap(M.geoDist(T.circumcenter, A)) + '$, $OB ' + F.ap(M.geoDist(T.circumcenter, B)) + '$, $OC ' + F.ap(M.geoDist(T.circumcenter, C)) + '$.');
        if (L.bis) steps.push('**Beírt kör:** $r=\\dfrac{T}{s}=\\dfrac{' + F.n(T.area) + '}{' + F.n(T.s) + '} ' + F.ap(T.r) + '$ (ahol $s=\\frac{K}{2}$), a középpont $K ' + F.ptA(T.incenter) + '$.');
        return kv + (note ? '<p class="msg ok">' + md(note) + '</p>' : '') + kit.steps(steps);
      }
      var PRE = {
        derekszogu: { P: [[1, 1], [9, 1], [1, 7]], L: { med: false, alt: false, perp: true, bis: false } },
        egyenloszaru: { P: [[1, 1], [9, 1], [5, 8]], L: { med: true, alt: true, perp: false, bis: false } },
        szabalyos: { P: [[1, 1], [9, 1], [5, 1 + 4 * Math.sqrt(3)]], L: { med: true, alt: true, perp: true, bis: true } },
        tompaszogu: { P: [[1, 2], [9, 2], [-1, 5]], L: { med: false, alt: true, perp: true, bis: false } },
        elfajulo: { P: [[1, 1], [5, 3], [9, 5]], L: { med: true, alt: false, perp: false, bis: false } }
      };
      kit.$$('[data-preset]', n).forEach(function (b) { kit.on(b, 'click', function () { var d = PRE[b.dataset.preset]; S.A = { x: d.P[0][0], y: d.P[0][1] }; S.B = { x: d.P[1][0], y: d.P[1][1] }; S.C = { x: d.P[2][0], y: d.P[2][1] }; L = { med: d.L.med, alt: d.L.alt, perp: d.L.perp, bis: d.L.bis }; layerBtns(); draw(); }); });
      kit.$$('[data-layer]', n).forEach(function (b) { kit.on(b, 'click', function () { L[b.dataset.layer] = !L[b.dataset.layer]; layerBtns(); draw(); }); });
      setTimeout(function () {
        p = kit.mkPlot(kit.$('.plotbox', n), { xmin: -2, xmax: 12, ymin: -2, ymax: 12, equal: true, snap: 0.25, onDrag: function (pt, x, y) { if (S[pt.id]) { S[pt.id] = { x: x, y: y }; draw(); } } });
        layerBtns(); draw();
      }, 0);
      return n;
    }
  });

  /* ================= 2. KÖR ÉS SZÖGEK ================= */
  MO.simDefs.push({
    id: 'kor-szogek', title: 'Kör és szögek', group: 'geometria', topic: 'geometria', sub: 'alakzatok',
    desc: 'Kerületi és középponti szög, Thalész-tétel, érintőszakaszok és húrnégyszög: húzd a pontokat a körön, és nézd a szögeket.',
    formulas: ['geo-keruleti-kozeponti', 'geo-thalesz', 'geo-erintoszakasz', 'geo-hurnegyszog'],
    build: function (kit) {
      var F = fmtTools(kit), O = { x: 0, y: 0 }, p = null, V = { r: 4 };
      var st = { ta: toRad(210), tb: toRad(330), tp: toRad(80), t: [toRad(20), toRad(100), toRad(200), toRad(290)], E: { x: 7, y: 0 } };
      var n = kit.el('<div><label class="f"><span>mód</span><select data-mode><option value="keruleti">kerületi és középponti szög</option><option value="thalesz">Thalész-tétel</option><option value="erinto">érintőszakaszok</option><option value="hurnegyszog">húrnégyszög</option></select></label>' +
        kit.slider('r', 'a kör sugara', 2, 6, 0.5, 4) + kit.plotBox(340) + '<div class="out md" style="margin-top:12px"></div>' +
        '<div class="lab" style="margin-top:12px">tipikus helyzetek</div><div class="row">' +
        '<button class="btn sm" type="button" data-preset="keruleti">kerületi és középponti szög</button><button class="btn sm" type="button" data-preset="felkor">kerületi szög a kisebbik íven</button>' +
        '<button class="btn sm" type="button" data-preset="thalesz">Thalész-tétel</button><button class="btn sm" type="button" data-preset="erinto">érintők a külső pontból</button><button class="btn sm" type="button" data-preset="hurnegyszog">húrnégyszög</button></div></div>');
      var mode = function () { return kit.$('[data-mode]', n).value; };
      function pt(t) { return M.geoOnCircle(O, V.r, t); }
      function draw() {
        if (!p) return;
        var m = mode(), r = V.r, pts = [{ x: 0, y: 0, label: 'O' }], segs = [], polys = [], arcs = [], circ = [{ x: 0, y: 0, r: r }], html = '', steps = [], t = F.tex;
        if (m === 'keruleti') {
          var D = M.geoInscribedCentral(O, r, st.ta, st.tb, st.tp), A = pt(st.ta), B = pt(st.tb), P = pt(st.tp);
          pts.push({ x: A.x, y: A.y, label: 'A', drag: true, id: 'A' }, { x: B.x, y: B.y, label: 'B', drag: true, id: 'B' }, { x: P.x, y: P.y, label: 'P', drag: true, id: 'P' });
          if (D.degenerate) html = '<p class="msg bad">Két pont egybeesik, ezért nincs szög. Húzd szét a pontokat!</p>';
          else {
            segs.push({ a: [P.x, P.y], b: [A.x, A.y] }, { a: [P.x, P.y], b: [B.x, B.y] }, { a: [0, 0], b: [A.x, A.y], color: 1, dash: [5, 4] }, { a: [0, 0], b: [B.x, B.y], color: 1, dash: [5, 4] });
            polys.push({ pts: arcPts(O, r, D.arcFrom, D.central, 60), close: false, w: 3, color: 2 });
            var sp = M.geoArcSpan(P, A, B);
            arcs.push({ x: P.x, y: P.y, r: 26, from: sp.from, to: sp.to, color: 1, label: kit.num(toDeg(D.inscribed), 1) + '°' }, { x: 0, y: 0, r: 22, from: D.arcFrom, to: D.arcFrom + D.central, color: 2, label: kit.num(toDeg(D.central), 1) + '°' });
            html = '<dl class="kv"><dt>kerületi szög</dt><dd>' + t('\\gamma=\\angle APB ' + F.ap(toDeg(D.inscribed), 1) + '^\\circ') + '</dd><dt>középponti szög</dt><dd>' + t('\\varphi ' + F.ap(toDeg(D.central), 1) + '^\\circ') + '</dd><dt>arány</dt><dd>' + t('\\varphi:\\gamma ' + F.ap(D.central / D.inscribed, 3)) + '</dd></dl>';
            steps = ['A $P$ pontból az $AB$ ívre (amely nem tartalmazza $P$-t) látszó kerületi szög $\\gamma ' + F.ap(toDeg(D.inscribed), 1) + '^\\circ$.', 'Az ugyanazon az íven álló középponti szög $\\varphi ' + F.ap(toDeg(D.central), 1) + '^\\circ$, és $\\varphi=2\\gamma$: $2\\cdot' + F.n(toDeg(D.inscribed), 1) + '^\\circ ' + F.ap(2 * toDeg(D.inscribed), 1) + '^\\circ$.',
              D.central > PI + 1e-9 ? 'Mivel $P$ a kisebbik íven van, az $AB$ ív nagyobb félkörnél: a középponti szög $180^\\circ$-nál nagyobb (konkáv szög), a kerületi szög pedig tompaszög.' : 'Húzd $P$-t az ív másik oldalára: a kerületi szög $180^\\circ-\\gamma$ lesz, a hozzá tartozó ív a másik ív.'];
          }
        } else if (m === 'thalesz') {
          var A2 = pt(st.ta), B2 = pt(st.ta + PI), P2 = pt(st.tp), ang = M.geoAngleAt(P2, A2, B2);
          pts.push({ x: A2.x, y: A2.y, label: 'A', drag: true, id: 'A' }, { x: B2.x, y: B2.y, label: 'B' }, { x: P2.x, y: P2.y, label: 'P', drag: true, id: 'P' });
          segs.push({ a: [A2.x, A2.y], b: [B2.x, B2.y], color: 1 });
          if (M.geoDist(P2, A2) < 1e-6 || M.geoDist(P2, B2) < 1e-6) html = '<p class="msg bad">A $P$ pont egybeesik $A$-val vagy $B$-vel: nincs háromszög, a szög nem értelmezett.</p>'.replace(/\$P\$/, 'P').replace('$A$', 'A').replace('$B$', 'B');
          else {
            polys.push({ pts: [[A2.x, A2.y], [P2.x, P2.y], [B2.x, B2.y]], fill: true, alpha: 0.08 });
            var rm = rightMark(P2, A2, B2, 0.45); if (rm) polys.push(rm);
            arcs.push({ x: P2.x, y: P2.y, r: 22, from: M.geoArcSpan(P2, A2, B2).from, to: M.geoArcSpan(P2, A2, B2).to, color: 1, label: kit.num(toDeg(ang), 1) + '°' });
            var pa = M.geoDist(P2, A2), pb = M.geoDist(P2, B2), ab = 2 * r;
            html = '<dl class="kv"><dt>átmérő fölötti szög</dt><dd>' + t('\\angle APB ' + F.ap(toDeg(ang), 2) + '^\\circ') + '</dd><dt>Pitagorasz</dt><dd>' + t('PA^2+PB^2 ' + F.ap(pa * pa + pb * pb) + ',\\ AB^2 ' + F.ap(ab * ab)) + '</dd></dl>';
            steps = ['Az $AB$ szakasz a kör átmérője, hossza $2r=' + F.n(ab) + '$. Ez fölött a kör bármely másik pontjából $90^\\circ$-os szög látszik (Thalész-tétel).', 'A középponti szög az átmérőnél $180^\\circ$, a kerületi szög ennek fele: $\\dfrac{180^\\circ}{2}=90^\\circ$. Mért érték: $' + F.n(toDeg(ang), 2) + '^\\circ$.', 'Ellenőrzés Pitagorasz-tétellel: $PA^2+PB^2=' + F.n(pa * pa) + '+' + F.n(pb * pb) + ' ' + F.ap(pa * pa + pb * pb) + '$, és $AB^2=' + F.n(ab * ab) + '$ – megegyeznek.'];
          }
        } else if (m === 'erinto') {
          var E = st.E, T = M.geoTangents(O, r, E);
          pts.push({ x: E.x, y: E.y, label: 'E', drag: true, id: 'E' }); segs.push({ a: [0, 0], b: [E.x, E.y], dim: true, dash: [3, 3] });
          if (!T) html = '<p class="msg bad">Az E pont a körön belül van, ezért nem húzható belőle érintő. Húzd a kör külső részére!</p>';
          else if (T.t === 0) html = '<p class="msg ok">Az E pont a körön van: itt egyetlen érintő van, az érintőszakasz hossza 0.</p>';
          else {
            var T1 = T.pts[0], T2 = T.pts[1], i2, tn = ['T₁', 'T₂'];
            for (i2 = 0; i2 < 2; i2++) {
              var Q = T.pts[i2]; pts.push({ x: Q.x, y: Q.y, label: tn[i2], color: 2 });
              segs.push({ a: [E.x, E.y], b: [Q.x, Q.y], color: 1, w: 2 }, { a: [0, 0], b: [Q.x, Q.y], dash: [5, 4], color: 2 });
              var rmk = rightMark(Q, O, E, 0.4); if (rmk) polys.push(rmk);
            }
            var dot1 = (T1.x - O.x) * (T1.x - E.x) + (T1.y - O.y) * (T1.y - E.y);
            html = '<dl class="kv"><dt>távolság</dt><dd>' + t('OE ' + F.ap(T.d)) + '</dd><dt>érintőszakaszok</dt><dd>' + t('ET_1 ' + F.ap(M.geoDist(E, T1)) + ',\\ ET_2 ' + F.ap(M.geoDist(E, T2))) + '</dd><dt>sugár és érintő szöge</dt><dd>' + t('\\angle OT_1E ' + F.ap(toDeg(M.geoAngleAt(T1, O, E)), 2) + '^\\circ') + '</dd></dl>';
            steps = ['A két érintőszakasz egyenlő hosszú (külső pontból húzott érintők): $ET_1=ET_2 ' + F.ap(T.t) + '$.', 'Az érintési pontba húzott sugár merőleges az érintőre, ezért $OT_1E$ derékszögű háromszög: $ET=\\sqrt{OE^2-r^2}=\\sqrt{' + F.n(T.d * T.d) + '-' + F.n(r * r) + '} ' + F.ap(T.t) + '$.', 'Ellenőrzés: $\\overrightarrow{T_1O}\\cdot\\overrightarrow{T_1E} ' + F.ap(dot1, 4) + '$ (a merőlegesség miatt $0$). A két érintő szöge: $2\\arcsin\\dfrac{r}{OE} ' + F.ap(toDeg(T.between), 2) + '^\\circ$.'];
          }
        } else {
          var Q4 = M.geoCyclicQuad(O, r, st.t), lab = ['A', 'B', 'C', 'D'], k;
          if (Q4.degenerate) { for (k = 0; k < 4; k++) { var q0 = pt(st.t[k]); pts.push({ x: q0.x, y: q0.y, drag: true, id: String(k) }); } html = '<p class="msg bad">Két pont egybeesik, nincs négyszög. Húzd szét a pontokat!</p>'; }
          else {
            polys.push({ pts: Q4.pts.map(function (q) { return [q.x, q.y]; }), fill: true, alpha: 0.08, w: 2 });
            for (k = 0; k < 4; k++) {
              var Vq = Q4.pts[k], sp2 = M.geoArcSpan(Vq, Q4.pts[(k + 3) % 4], Q4.pts[(k + 1) % 4]);
              pts.push({ x: Vq.x, y: Vq.y, label: lab[k], drag: true, id: String(Q4.idx[k]) });
              arcs.push({ x: Vq.x, y: Vq.y, r: 20, from: sp2.from, to: sp2.to, color: k % 2 ? 2 : 1, label: kit.num(toDeg(Q4.angles[k]), 1) + '°' });
            }
            var g = Q4.angles.map(function (a) { return toDeg(a); });
            html = '<dl class="kv"><dt>szemközti szögek</dt><dd>' + t('\\alpha+\\gamma ' + F.ap(g[0] + g[2], 2) + '^\\circ') + '</dd><dd>' + t('\\beta+\\delta ' + F.ap(g[1] + g[3], 2) + '^\\circ') + '</dd></dl>';
            steps = ['A négy csúcs egy körön van, ezért a négyszög húrnégyszög. Szögei: $\\alpha ' + F.ap(g[0]) + '^\\circ$, $\\beta ' + F.ap(g[1]) + '^\\circ$, $\\gamma ' + F.ap(g[2]) + '^\\circ$, $\\delta ' + F.ap(g[3]) + '^\\circ$.',
              'Szemközti szögek összege: $\\alpha+\\gamma=' + F.n(g[0]) + '^\\circ+' + F.n(g[2]) + '^\\circ ' + F.ap(g[0] + g[2]) + '^\\circ$ és $\\beta+\\delta ' + F.ap(g[1] + g[3]) + '^\\circ$.',
              'Magyarázat: a két szemközti szög két, együtt a teljes kört kitevő ívhez tartozó kerületi szög, így összegük a teljes kör középponti szögének fele, $\\dfrac{360^\\circ}{2}=180^\\circ$.'];
          }
        }
        p.set({ points: pts, segments: segs, polys: polys, arcs: arcs, circles: circ });
        kit.$('.out', n).innerHTML = html.replace(/<p class="msg bad">(.*?)<\/p>/, function (a, b) { return '<p class="msg bad">' + b + '</p>'; }) + (steps.length ? kit.steps(steps) : '');
      }
      var PRE = {
        keruleti: function () { setSel(kit, n, 'keruleti'); st.ta = toRad(210); st.tb = toRad(330); st.tp = toRad(80); setIn(kit, n, 'r', 4); },
        felkor: function () { setSel(kit, n, 'keruleti'); st.ta = toRad(210); st.tb = toRad(330); st.tp = toRad(270); setIn(kit, n, 'r', 4); },
        thalesz: function () { setSel(kit, n, 'thalesz'); st.ta = toRad(160); st.tp = toRad(40); setIn(kit, n, 'r', 4); },
        erinto: function () { setSel(kit, n, 'erinto'); st.E = { x: 7, y: 2 }; setIn(kit, n, 'r', 4); },
        hurnegyszog: function () { setSel(kit, n, 'hurnegyszog'); st.t = [toRad(30), toRad(110), toRad(200), toRad(290)]; setIn(kit, n, 'r', 4); }
      };
      kit.$$('[data-preset]', n).forEach(function (b) { kit.on(b, 'click', function () { PRE[b.dataset.preset](); draw(); }); });
      kit.on(kit.$('[data-mode]', n), 'change', draw);
      setTimeout(function () {
        p = kit.mkPlot(kit.$('.plotbox', n), { xmin: -8, xmax: 8, ymin: -8, ymax: 8, equal: true, onDrag: function (pt, x, y) {
          var m = mode(), t = Math.atan2(y, x);
          if (pt.id === 'E') { st.E = { x: x, y: y }; } else if (m === 'hurnegyszog') st.t[+pt.id] = t; else if (pt.id === 'A') st.ta = t; else if (pt.id === 'B') st.tb = t; else if (pt.id === 'P') st.tp = t;
          draw();
        } });
        kit.bindSliders(n, function (v) { V = v; draw(); });
      }, 0);
      return n;
    }
  });

  /* ================= 3. GEOMETRIAI TRANSZFORMÁCIÓK ================= */
  MO.simDefs.push({
    id: 'geo-transzformaciok', title: 'Geometriai transzformációk', group: 'geometria', topic: 'geometria', sub: 'transzformaciok',
    desc: 'Tükrözés, eltolás, forgatás és középpontos hasonlóság egy négyszögön: nézd a képet, a koordinátákat és a megmaradó tulajdonságokat.',
    formulas: ['geo-hasonlo-arany'],
    build: function (kit) {
      var F = fmtTools(kit), p = null, V = { vx: 4, vy: -2, phi: 90, lam: 2 };
      var S = { pts: [{ x: 1, y: 1 }, { x: 4, y: 0.5 }, { x: 5, y: 3 }, { x: 2, y: 3.5 }], X1: { x: -2, y: -1 }, X2: { x: -2, y: 6 }, K: { x: 0, y: 0 } };
      var n = kit.el('<div><label class="f"><span>transzformáció</span><select data-mode><option value="axis">tengelyes tükrözés</option><option value="point">középpontos tükrözés</option><option value="shift">eltolás</option><option value="rot">forgatás pont körül</option><option value="homo">középpontos hasonlóság</option></select></label>' +
        '<div data-for="shift">' + kit.slider('vx', 'eltolás vektora, x irányban', -8, 8, 0.5, 4) + kit.slider('vy', 'eltolás vektora, y irányban', -8, 8, 0.5, -2) + '</div>' +
        '<div data-for="rot">' + kit.slider('phi', 'forgatás szöge (fok)', -180, 180, 5, 90) + '</div>' +
        '<div data-for="homo">' + kit.slider('lam', 'hasonlóság aránya (λ)', -3, 3, 0.25, 2) + '</div>' +
        kit.plotBox(340) + '<div class="legend"><span><i style="border-color:var(--fg)"></i>eredeti (folytonos)</span><span><i style="border-color:var(--c1);border-top-style:dashed"></i>kép (szaggatott)</span></div><div class="out md" style="margin-top:12px"></div>' +
        '<div class="lab" style="margin-top:12px">tipikus helyzetek</div><div class="row">' +
        '<button class="btn sm" type="button" data-preset="axis">tükrözés az y = x egyenesre</button><button class="btn sm" type="button" data-preset="point">tükrözés az origóra</button><button class="btn sm" type="button" data-preset="shift">eltolás</button>' +
        '<button class="btn sm" type="button" data-preset="rot">forgatás 90°-kal</button><button class="btn sm" type="button" data-preset="homo">nagyítás λ = 2</button><button class="btn sm" type="button" data-preset="neg">hasonlóság λ = −1,5</button></div></div>');
      var mode = function () { return kit.$('[data-mode]', n).value; };
      function showFor() { var m = mode(); kit.$$('[data-for]', n).forEach(function (d) { d.style.display = d.dataset['for'] === m ? '' : 'none'; }); }
      var nm = ['A', 'B', 'C', 'D'];
      function draw() {
        if (!p) return;
        showFor();
        var m = mode(), t = F.tex, par = { A: S.X1, B: S.X2, C: S.K, vx: V.vx, vy: V.vy, phi: toRad(V.phi), lambda: V.lam }, img = M.geoTransform(m, S.pts, par);
        var pts = [], segs = [], polys = [{ pts: S.pts.map(function (q) { return [q.x, q.y]; }), fill: true, alpha: 0.08, w: 2 }], arcs = [], i, html = '', steps = [];
        S.pts.forEach(function (q, k) { pts.push({ x: q.x, y: q.y, label: nm[k], drag: true, id: 'P' + k }); });
        if (m === 'axis') { var ll = M.geoDist(S.X1, S.X2) > 1e-9 ? longLine(S.X1, S.X2) : null; if (ll) { ll.color = 3; ll.dash = [8, 3]; ll.w = 2; segs.push(ll); } pts.push({ x: S.X1.x, y: S.X1.y, label: 'e₁', drag: true, id: 'X1', color: 3 }, { x: S.X2.x, y: S.X2.y, label: 'e₂', drag: true, id: 'X2', color: 3 }); }
        else if (m === 'point' || m === 'rot' || m === 'homo') pts.push({ x: S.K.x, y: S.K.y, label: 'K', drag: true, id: 'K', color: 3 });
        if (!img) html = '<p class="msg bad">A tengely két pontja egybeesik, ezért nem határoz meg egyenest: húzd szét az e₁ és e₂ pontot!</p>';
        else {
          polys.push({ pts: img.map(function (q) { return [q.x, q.y]; }), fill: true, alpha: 0.08, color: 1, dash: [6, 4], w: 2 });
          img.forEach(function (q, k) { pts.push({ x: q.x, y: q.y, label: nm[k] + "'", color: 1 }); segs.push({ a: [S.pts[k].x, S.pts[k].y], b: [q.x, q.y], dim: true, dash: [2, 3] }); });
          if (m === 'shift') for (i = 0; i < 1; i++) arrowSegs(S.pts[0], img[0], { color: 3, w: 2 }).forEach(function (s) { segs.push(s); });
          if (m === 'rot' && M.geoDist(S.pts[0], S.K) > 1e-9) { var th = Math.atan2(S.pts[0].y - S.K.y, S.pts[0].x - S.K.x), ph = toRad(V.phi); arcs.push({ x: S.K.x, y: S.K.y, r: 30, from: ph >= 0 ? th : th + ph, to: ph >= 0 ? th + ph : th, color: 3, label: kit.num(V.phi, 0) + '°' }); segs.push({ a: [S.K.x, S.K.y], b: [S.pts[0].x, S.pts[0].y], dim: true }, { a: [S.K.x, S.K.y], b: [img[0].x, img[0].y], dim: true }); }
          if (m === 'homo' || m === 'point') img.forEach(function (q) { segs.push({ a: [S.K.x, S.K.y], b: [q.x, q.y], dim: true, dash: [5, 4] }); });
          var info = M.geoTransformInfo(S.pts, img), collapsed = m === 'homo' && Math.abs(V.lam) < 1e-12;
          var rows = S.pts.map(function (q, k) { return '<tr><td>' + t(nm[k] + F.pt(q).replace(/^/, '')) + '</td><td>' + t(nm[k] + "'" + F.pt(img[k])) + '</td></tr>'; }).join('');
          html = '<div class="tblwrap"><table class="t"><thead><tr><th>eredeti pont</th><th>képpont</th></tr></thead><tbody>' + rows + '</tbody></table></div>';
          var oriTxt = info.orientation === 0 ? 'nem értelmezhető (a kép elfajult)' : info.orientation > 0 ? 'megmarad' : 'megfordul';
          html += '<dl class="kv"><dt>távolságtartó?</dt><dd>' + (info.isometry ? 'igen' : 'nem') + '</dd><dt>körüljárási irány</dt><dd>' + oriTxt + '</dd>' +
            '<dt>kerület aránya</dt><dd>' + t(isFinite(info.perimeterRatio) ? 'k\'/k ' + F.ap(info.perimeterRatio, 3) : '\\text{nem értelmezett}') + '</dd><dt>terület aránya</dt><dd>' + t(isFinite(info.areaRatio) ? 'T\'/T ' + F.ap(info.areaRatio, 3) : '\\text{nem értelmezett}') + '</dd></dl>';
          if (collapsed) html += '<p class="msg bad">λ = 0 esetén minden pont a K középpontba kerül: ez már nem hasonlóság, a kép egyetlen pont (kerület és terület 0).</p>';
          var desc = { axis: 'A tengelyes tükrözés a tengelyre merőleges egyenesen, a tengelytől ugyanakkora távolságra, a másik oldalra viszi a pontot. Távolságtartó, de a körüljárási irányt megfordítja.',
            point: 'A középpontos tükrözés: $P\'=2K-P$, vagyis a $K$ felezi a $PP\'$ szakaszt. Távolságtartó, megtartja a körüljárási irányt ($180^\\circ$-os forgatás).',
            shift: 'Az eltolás minden pontot ugyanazzal a $\\vec v=(' + F.n(V.vx) + ';\\ ' + F.n(V.vy) + ')$ vektorral mozgat: $P\'=P+\\vec v$. Távolságtartó, megtartja a körüljárási irányt.',
            rot: 'A $K$ körüli $' + F.n(V.phi, 0) + '^\\circ$-os forgatás: $K$ és $P$ távolsága nem változik, a $PKP\'$ szög $' + F.n(Math.abs(V.phi), 0) + '^\\circ$. Távolságtartó, megtartja a körüljárási irányt.',
            homo: 'A $K$ középpontú, $\\lambda=' + F.n(V.lam) + '$ arányú hasonlóság: $P\'=K+\\lambda(P-K)$. A kerület $|\\lambda|=' + F.n(Math.abs(V.lam)) + '$-szorosára, a terület $\\lambda^2=' + F.n(V.lam * V.lam, 4) + '$-szeresére változik' + (V.lam < 0 ? '; negatív $\\lambda$ esetén a kép a középpont túloldalán van (és fordított állású), a körüljárási irány mégis megmarad.' : '.') };
          steps.push(desc[m]);
          steps.push('Példa az $A$ csúcsra: $A=' + F.pt(S.pts[0]) + '\\ \\to\\ A\' ' + F.ptA(img[0]) + '$.');
          if (m === 'homo' && !collapsed) steps.push('Ellenőrzés: kerületarány $' + F.n(info.perimeterRatio, 3) + '=|\\lambda|$, területarány $' + F.n(info.areaRatio, 3) + '=\\lambda^2$.');
        }
        p.set({ points: pts, segments: segs, polys: polys, arcs: arcs });
        kit.$('.out', n).innerHTML = html + (steps.length ? kit.steps(steps) : '');
      }
      var PRE = {
        axis: function () { setSel(kit, n, 'axis'); S.X1 = { x: -6, y: -6 }; S.X2 = { x: 6, y: 6 }; },
        point: function () { setSel(kit, n, 'point'); S.K = { x: 0, y: 0 }; },
        shift: function () { setSel(kit, n, 'shift'); setIn(kit, n, 'vx', 4); setIn(kit, n, 'vy', -2); },
        rot: function () { setSel(kit, n, 'rot'); S.K = { x: 0, y: 0 }; setIn(kit, n, 'phi', 90); },
        homo: function () { setSel(kit, n, 'homo'); S.K = { x: 0, y: 0 }; setIn(kit, n, 'lam', 2); },
        neg: function () { setSel(kit, n, 'homo'); S.K = { x: 0, y: 0 }; setIn(kit, n, 'lam', -1.5); }
      };
      kit.$$('[data-preset]', n).forEach(function (b) { kit.on(b, 'click', function () { PRE[b.dataset.preset](); draw(); }); });
      kit.on(kit.$('[data-mode]', n), 'change', draw);
      setTimeout(function () {
        p = kit.mkPlot(kit.$('.plotbox', n), { xmin: -9, xmax: 9, ymin: -9, ymax: 9, equal: true, snap: 0.5, onDrag: function (pt, x, y) {
          if (pt.id[0] === 'P') S.pts[+pt.id[1]] = { x: x, y: y }; else S[pt.id] = { x: x, y: y }; draw();
        } });
        kit.bindSliders(n, function (v) { V = v; draw(); });
      }, 0);
      return n;
    }
  });

  /* ================= 4. VEKTOROK ================= */
  MO.simDefs.push({
    id: 'vektorok', title: 'Vektorok', group: 'geometria', topic: 'geometria', sub: 'vektorok',
    desc: 'Két vektor húzható végponttal: összeg, különbség, számszoros, skalárszorzat, hajlásszög, vetület és felbontás.',
    formulas: ['geo-vektor-koordinata-hossz', 'geo-vektor-muveletek', 'geo-skalarszorzat-koord', 'geo-skalarszorzat-szog'],
    build: function (kit) {
      var F = fmtTools(kit), p = null, V = { k: 2, psi: 90 }, a = { x: 3, y: 1 }, b = { x: -1, y: 3 };
      var n = kit.el('<div><label class="f"><span>mit mutasson az ábra?</span><select data-mode><option value="osszeg">összeg (paralelogramma-szabály)</option><option value="kulonbseg">különbség</option><option value="szorzo">számszoros</option><option value="vetulet">merőleges vetület</option><option value="felbontas">felbontás két irányra</option></select></label>' +
        '<div data-for="szorzo">' + kit.slider('k', 'szorzó (k)', -3, 3, 0.5, 2) + '</div><div data-for="felbontas">' + kit.slider('psi', 'a második összetevő iránya (fok)', 0, 355, 5, 90) + '</div>' +
        kit.plotBox(340) + '<div class="legend"><span><i style="border-color:var(--fg)"></i>a</span><span><i style="border-color:var(--c1);border-top-style:dashed"></i>b</span><span><i style="border-color:var(--c2)"></i>eredmény</span></div><div class="out md" style="margin-top:12px"></div>' +
        '<div class="lab" style="margin-top:12px">tipikus helyzetek</div><div class="row">' +
        '<button class="btn sm" type="button" data-preset="merőleges">merőleges vektorok</button><button class="btn sm" type="button" data-preset="rombusz">egyenlő hosszú vektorok (rombusz)</button><button class="btn sm" type="button" data-preset="parhuzamos">párhuzamos vektorok</button>' +
        '<button class="btn sm" type="button" data-preset="vetulet">vetület</button><button class="btn sm" type="button" data-preset="felbontas">felbontás</button></div></div>');
      var mode = function () { return kit.$('[data-mode]', n).value; };
      function showFor() { var m = mode(); kit.$$('[data-for]', n).forEach(function (d) { d.style.display = d.dataset['for'] === (m === 'szorzo' ? 'szorzo' : m === 'felbontas' ? 'felbontas' : '') ? '' : 'none'; }); }
      function sg(x, y) { return { x: x, y: y }; }
      function draw() {
        if (!p) return;
        showFor();
        var m = mode(), t = F.tex, O = sg(0, 0), segs = [], polys = [], labels = [], pts = [{ x: a.x, y: a.y, label: 'a', drag: true, id: 'a' }, { x: b.x, y: b.y, label: 'b', drag: true, id: 'b' }], steps = [], extra = '';
        var la = M.vecLen(a), lb = M.vecLen(b), dot = M.vecDot(a, b), g = M.vecAngle(a, b), sum = sg(a.x + b.x, a.y + b.y), dif = sg(a.x - b.x, a.y - b.y);
        arrowSegs(O, a, { w: 2.5 }).forEach(function (s) { segs.push(s); }); arrowSegs(O, b, { color: 1, dash: [6, 4], w: 2.5 }).forEach(function (s) { segs.push(s); });
        var res = function (q, o) { arrowSegs(O, q, o || { color: 2, w: 3 }).forEach(function (s) { segs.push(s); }); };
        if (m === 'osszeg') {
          segs.push({ a: [a.x, a.y], b: [sum.x, sum.y], dim: true, dash: [4, 3] }, { a: [b.x, b.y], b: [sum.x, sum.y], dim: true, dash: [4, 3] }); res(sum); labels.push({ x: sum.x, y: sum.y, text: 'a+b', dx: 8, dy: 8, color: 2 });
        } else if (m === 'kulonbseg') {
          arrowSegs(b, a, { color: 2, w: 3 }).forEach(function (s) { segs.push(s); }); res(dif, { color: 2, dim: true, dash: [4, 3] }); labels.push({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2, text: 'a−b', dx: 8, dy: 8, color: 2 });
        } else if (m === 'szorzo') {
          var ka = sg(V.k * a.x, V.k * a.y); res(ka); labels.push({ x: ka.x, y: ka.y, text: kit.num(V.k, 1) + '·a', dx: 8, dy: 8, color: 2 });
        } else if (m === 'vetulet') {
          var pr = M.vecProj(a, b);
          if (pr) { var lnb = longLine(O, b); lnb.dim = true; lnb.dash = [2, 4]; segs.push(lnb); segs.push({ a: [a.x, a.y], b: [pr.x, pr.y], dim: true, dash: [4, 3] }); res(sg(pr.x, pr.y)); pts.push({ x: pr.x, y: pr.y, color: 2, label: 'a_b' }); var rmk = rightMark(sg(pr.x, pr.y), a, b, 0.3); if (rmk && M.vecLen(sg(a.x - pr.x, a.y - pr.y)) > 1e-9 && M.vecLen(pr) > 1e-9) polys.push(rmk); }
        } else {
          var e = sg(Math.cos(toRad(V.psi)), Math.sin(toRad(V.psi))), dc = M.vecDecomp(a, b, e), l2 = longLine(O, e); l2.dim = true; l2.dash = [2, 4]; segs.push(l2);
          if (dc) { var c1 = sg(dc.s * b.x, dc.s * b.y), c2 = sg(dc.t * e.x, dc.t * e.y); res(c1); res(c2, { color: 3, w: 3 }); segs.push({ a: [c1.x, c1.y], b: [a.x, a.y], dim: true, dash: [4, 3] }, { a: [c2.x, c2.y], b: [a.x, a.y], dim: true, dash: [4, 3] }); }
        }
        /* kimenet */
        var kv = '<dl class="kv"><dt>koordináták</dt><dd>' + t('\\mathbf a=' + F.pt(a, 1).replace('\\ ', '\\ ') + ',\\ \\mathbf b=' + F.pt(b, 1)) + '</dd><dt>hosszak</dt><dd>' + t('|\\mathbf a| ' + F.ap(la) + ',\\ |\\mathbf b| ' + F.ap(lb)) + '</dd></dl>';
        var ste = [];
        ste.push('**Skalárszorzat koordinátákkal:** $\\mathbf a\\cdot\\mathbf b=a_xb_x+a_yb_y=' + F.p(a.x, 1) + '\\cdot' + F.p(b.x, 1) + '+' + F.p(a.y, 1) + '\\cdot' + F.p(b.y, 1) + '=' + F.n(dot, 2) + '$.');
        if (g === null) ste.push('Ha az egyik vektor nullvektor, nincs hajlásszög, és a skalárszorzat $0$. Húzd el a végpontot az origótól!');
        else {
          ste.push('**Alakban:** $|\\mathbf a||\\mathbf b|\\cos\\gamma=' + F.n(la) + '\\cdot' + F.n(lb) + '\\cdot' + F.n(Math.cos(g), 4) + ' ' + F.ap(la * lb * Math.cos(g)) + '$, ahonnan $\\gamma=\\arccos\\dfrac{\\mathbf a\\cdot\\mathbf b}{|\\mathbf a||\\mathbf b|} ' + F.ap(toDeg(g)) + '^\\circ$.');
          if (Math.abs(dot) < 1e-9 * la * lb) ste.push('**A két vektor merőleges**, mert a skalárszorzatuk $0$ ($\\gamma=90^\\circ$).');
          else if (Math.abs(Math.abs(dot) - la * lb) < 1e-9 * la * lb) ste.push('A két vektor párhuzamos (' + (dot > 0 ? 'azonos' : 'ellentétes') + ' irányú): $\\cos\\gamma=' + (dot > 0 ? '1' : '-1') + '$.');
        }
        if (m === 'osszeg') ste.push('**Összeg:** $\\mathbf a+\\mathbf b=(' + F.n(a.x, 1) + '+' + F.p(b.x, 1) + ';\\ ' + F.n(a.y, 1) + '+' + F.p(b.y, 1) + ')=' + F.pt(sum, 1) + '$, hossza $' + F.n(M.vecLen(sum)) + '$ (a paralelogramma átlója).');
        else if (m === 'kulonbseg') ste.push('**Különbség:** $\\mathbf a-\\mathbf b=(' + F.n(a.x, 1) + '-' + F.p(b.x, 1) + ';\\ ' + F.n(a.y, 1) + '-' + F.p(b.y, 1) + ')=' + F.pt(dif, 1) + '$; ez a $\\mathbf b$ végpontjából az $\\mathbf a$ végpontjába mutat.');
        else if (m === 'szorzo') ste.push('**Számszoros:** $' + F.n(V.k, 1) + '\\cdot\\mathbf a=' + F.pt(sg(V.k * a.x, V.k * a.y), 1) + '$, hossza $|k|\\cdot|\\mathbf a| ' + F.ap(Math.abs(V.k) * la) + '$' + (V.k < 0 ? ' (negatív szorzó: ellentétes irány)' : V.k === 0 ? ' (nullvektor)' : '') + '.');
        else if (m === 'vetulet') {
          var pr2 = M.vecProj(a, b);
          if (!pr2) ste.push('A $\\mathbf b$ nullvektor, ezért nem lehet rá vetíteni. Húzd el a $\\mathbf b$ végpontját az origótól!');
          else ste.push('**Merőleges vetület $\\mathbf b$-re:** $\\mathbf a_b=\\dfrac{\\mathbf a\\cdot\\mathbf b}{|\\mathbf b|^2}\\,\\mathbf b=\\dfrac{' + F.n(dot, 2) + '}{' + F.n(lb * lb, 2) + '}\\mathbf b=' + F.pt(pr2, 3).replace(/^/, '') + '$, hossza $|\\mathbf a||\\cos\\gamma| ' + F.ap(M.vecLen(pr2)) + '$.');
        } else {
          var e2 = sg(Math.cos(toRad(V.psi)), Math.sin(toRad(V.psi))), dc2 = M.vecDecomp(a, b, e2);
          if (!dc2) ste.push('A választott irány párhuzamos a $\\mathbf b$ vektorral (vagy $\\mathbf b$ nullvektor), ezért az $\\mathbf a$ vektor nem bontható fel két különböző irányú összetevőre. Változtasd az irányt!');
          else ste.push('**Felbontás:** $\\mathbf a=s\\,\\mathbf b+t\\,\\mathbf e$, ahol $\\mathbf e=(\\cos' + F.n(V.psi, 0) + '^\\circ;\\ \\sin' + F.n(V.psi, 0) + '^\\circ)$. A koordinátás egyenletrendszerből $s ' + F.ap(dc2.s, 3) + '$, $t ' + F.ap(dc2.t, 3) + '$: az összetevők $s\\mathbf b$ (kék, szaggatott irányban) és $t\\mathbf e$.');
        }
        p.set({ points: pts, segments: segs, polys: polys, labels: labels });
        kit.$('.out', n).innerHTML = kv + kit.steps(ste);
      }
      var PRE = {
        'merőleges': function () { a = sg(3, 1); b = sg(-1, 3); setSel(kit, n, 'osszeg'); },
        rombusz: function () { a = sg(3, 4); b = sg(4, 3); setSel(kit, n, 'kulonbseg'); },
        parhuzamos: function () { a = sg(2, 1); b = sg(4, 2); setSel(kit, n, 'osszeg'); },
        vetulet: function () { a = sg(4, 3); b = sg(5, 0); setSel(kit, n, 'vetulet'); },
        felbontas: function () { a = sg(3, 4); b = sg(3, 0); setSel(kit, n, 'felbontas'); setIn(kit, n, 'psi', 90); }
      };
      kit.$$('[data-preset]', n).forEach(function (bt) { kit.on(bt, 'click', function () { PRE[bt.dataset.preset](); draw(); }); });
      kit.on(kit.$('[data-mode]', n), 'change', draw);
      setTimeout(function () {
        p = kit.mkPlot(kit.$('.plotbox', n), { xmin: -8, xmax: 8, ymin: -8, ymax: 8, equal: true, snap: 0.5, onDrag: function (pt, x, y) { if (pt.id === 'a') a = sg(x, y); else b = sg(x, y); draw(); } });
        kit.bindSliders(n, function (v) { V = v; draw(); });
      }, 0);
      return n;
    }
  });

  /* ================= 5. KOORDINÁTAGEOMETRIA ================= */
  MO.simDefs.push({
    id: 'koordinatageometria', title: 'Koordinátageometria', group: 'geometria', topic: 'geometria', sub: 'koordgeo',
    desc: 'Egyenes, két egyenes, kör és egyenes, parabola és egyenes: egyenletek, metszéspontok és a számolás lépésenként.',
    formulas: ['geo-egyenes-normalvektoros', 'geo-egyenes-iranyvektoros', 'geo-egyenes-meredekseg', 'geo-egyenesek-helyzete', 'geo-kor-egyenlet', 'geo-parabola', 'geo-pont-tavolsag'],
    build: function (kit) {
      var F = fmtTools(kit), p = null, V = { cx: 0, cy: 0, r: 5, u: 0, v: -2, pp: 2 };
      var S = { P1: { x: 0, y: -2 }, Q1: { x: 4, y: 2 }, P2: { x: -2, y: 3 }, Q2: { x: 4, y: 0 } };
      var n = kit.el('<div><label class="f"><span>mód</span><select data-mode><option value="egyenes">egyenes két ponton át</option><option value="ketto">két egyenes</option><option value="kor">kör és egyenes</option><option value="parabola">parabola és egyenes</option></select></label>' +
        '<div data-for="kor">' + kit.slider('cx', 'a kör középpontja, x', -6, 6, 0.5, 0) + kit.slider('cy', 'a kör középpontja, y', -6, 6, 0.5, 0) + kit.slider('r', 'a kör sugara', 0.5, 7, 0.5, 5) + '</div>' +
        '<div data-for="parabola">' + kit.slider('u', 'csúcs, x (u)', -6, 6, 0.5, 0) + kit.slider('v', 'csúcs, y (v)', -6, 6, 0.5, -2) + kit.slider('pp', 'paraméter (p)', 0.5, 4, 0.5, 2) + '</div>' +
        kit.plotBox(340) + '<div class="out md" style="margin-top:12px"></div>' +
        '<div class="lab" style="margin-top:12px">tipikus helyzetek</div><div class="row">' +
        '<button class="btn sm" type="button" data-preset="egyenes">egyenes két ponton át</button><button class="btn sm" type="button" data-preset="merol">merőleges egyenesek</button><button class="btn sm" type="button" data-preset="parh">párhuzamos egyenesek</button>' +
        '<button class="btn sm" type="button" data-preset="erinto">érintő egyenes a körhöz</button><button class="btn sm" type="button" data-preset="szel">kör és szelő</button><button class="btn sm" type="button" data-preset="pszel">parabola és szelő</button><button class="btn sm" type="button" data-preset="perinto">parabola és érintő</button></div></div>');
      var mode = function () { return kit.$('[data-mode]', n).value; };
      function showFor() { var m = mode(); kit.$$('[data-for]', n).forEach(function (d) { d.style.display = d.dataset['for'] === m ? '' : 'none'; }); }
      var tn = function (x) { return kit.tnum(x, 3); };
      function lineTex(A, B, C) {
        var s = '';
        if (Math.abs(A) > 1e-12) s += (Math.abs(A - 1) < 1e-12 ? '' : Math.abs(A + 1) < 1e-12 ? '-' : tn(A)) + 'x';
        if (Math.abs(B) > 1e-12) s += (s ? (B < 0 ? ' - ' : ' + ') : (B < 0 ? '-' : '')) + (Math.abs(Math.abs(B) - 1) < 1e-12 ? '' : tn(Math.abs(B))) + 'y';
        return s + ' = ' + tn(C);
      }
      function slopeTex(l) {
        if (l.vertical) return 'x = ' + kit.exact(l.C / l.A);
        var s = 'y = ';
        if (Math.abs(l.m) > 1e-12) s += (l.m < 0 ? '-' : '') + (Math.abs(Math.abs(l.m) - 1) < 1e-12 ? '' : kit.exact(Math.abs(l.m))) + 'x';
        if (Math.abs(l.b) > 1e-12) s += (Math.abs(l.m) > 1e-12 ? (l.b < 0 ? ' - ' : ' + ') : (l.b < 0 ? '-' : '')) + kit.exact(Math.abs(l.b));
        else if (Math.abs(l.m) <= 1e-12) s += '0';
        return s;
      }
      function lineSteps(P, Q, l, name) {
        var dx = Q.x - P.x, dy = Q.y - P.y;
        return 'Az $' + name + '$ egyenes irányvektora $\\mathbf v=\\overrightarrow{PQ}=(' + tn(dx) + ';\\ ' + tn(dy) + ')$, normálvektora $\\mathbf n=(' + tn(dy) + ';\\ ' + tn(-dx) + ')$. Az $\\mathbf n\\cdot(X-P)=0$ egyenletből: $' + lineTex(l.A, l.B, l.C) + '$.';
      }
      function draw() {
        if (!p) return;
        showFor();
        var m = mode(), t = F.tex, segs = [], pts = [], circ = [], curves = [], html = '', ste = [], l1 = M.geoLine(S.P1, S.Q1), l2 = null, i;
        var dragP = function (id, lab, col) { pts.push({ x: S[id].x, y: S[id].y, label: lab, drag: true, id: id, color: col }); };
        var drawLine = function (P, Q, col, dash) { if (M.geoDist(P, Q) > 1e-9) { var ll = longLine(P, Q); ll.color = col; ll.w = 2; if (dash) ll.dash = dash; segs.push(ll); } };
        var degMsg = function (what) { return '<p class="msg bad">A ' + what + ' két pontja egybeesik, ezért nem határoz meg egyenest. Húzd szét a pontokat!</p>'; };
        dragP('P1', 'P', 0); dragP('Q1', 'Q', 0); drawLine(S.P1, S.Q1, 0);
        if (m === 'ketto') { l2 = M.geoLine(S.P2, S.Q2); dragP('P2', 'R', 1); dragP('Q2', 'S', 1); drawLine(S.P2, S.Q2, 1, [6, 4]); }
        if (m === 'egyenes') {
          if (!l1) html = degMsg('P és Q pont');
          else {
            var mt = l1.vertical ? 'nincs (függőleges egyenes)' : '', xi = l1.xint === null ? 'nincs (vízszintes egyenes)' : null, yi = l1.yint === null ? 'nincs (függőleges egyenes)' : null;
            html = '<dl class="kv"><dt>általános alak</dt><dd>' + t(lineTex(l1.A, l1.B, l1.C)) + '</dd><dt>meredekséggel</dt><dd>' + t(slopeTex(l1)) + '</dd><dt>irányvektor</dt><dd>' + t('\\mathbf v=' + F.pt(l1.dir, 3)) + '</dd><dt>normálvektor</dt><dd>' + t('\\mathbf n=' + F.pt(l1.normal, 3)) + '</dd>' +
              '<dt>meredekség</dt><dd>' + (l1.vertical ? 'nincs (függőleges egyenes)' : t('m=' + kit.exact(l1.m))) + '</dd><dt>x tengelymetszet</dt><dd>' + (xi || t('(' + kit.exact(l1.xint) + ';\\ 0)')) + '</dd><dt>y tengelymetszet</dt><dd>' + (yi || t('(0;\\ ' + kit.exact(l1.yint) + ')')) + '</dd></dl>';
            ste = [lineSteps(S.P1, S.Q1, l1, 'PQ'), 'A meredekség: ' + (l1.vertical ? '$x$ nem változik, az egyenes függőleges, nincs meredekség.' : '$m=\\dfrac{y_Q-y_P}{x_Q-x_P}=\\dfrac{' + tn(S.Q1.y - S.P1.y) + '}{' + tn(S.Q1.x - S.P1.x) + '}=' + kit.exact(l1.m) + '$, így $' + slopeTex(l1) + '$.'),
              'A tengelymetszetek: $y=0$-ból ' + (xi ? 'nincs ($x$ tengellyel párhuzamos)' : '$x=\\dfrac{C}{A}=' + kit.exact(l1.xint) + '$') + '; $x=0$-ból ' + (yi ? 'nincs ($y$ tengellyel párhuzamos)' : '$y=\\dfrac{C}{B}=' + kit.exact(l1.yint) + '$') + '.'];
            if (!l1.integer) ste.push('A pontok nem rácspontok, ezért az együtthatók tizedes törtek (kerekítve).');
          }
        } else if (m === 'ketto') {
          if (!l1 || !l2) html = degMsg(!l1 ? 'P és Q pont' : 'R és S pont');
          else {
            var X = M.geoLineLine(l1, l2);
            html = '<dl class="kv"><dt>első egyenes (folytonos)</dt><dd>' + t(lineTex(l1.A, l1.B, l1.C)) + '</dd><dt>második egyenes (szaggatott)</dt><dd>' + t(lineTex(l2.A, l2.B, l2.C)) + '</dd></dl>';
            ste.push('A két normálvektor: $\\mathbf n_1=' + F.pt(l1.normal, 3) + '$, $\\mathbf n_2=' + F.pt(l2.normal, 3) + '$.');
            if (X.kind === 'point') {
              pts.push({ x: X.x, y: X.y, color: 2, label: 'M' });
              ste.push('A két egyenlet egyenletrendszerét megoldva a metszéspont $M ' + F.ptA({ x: X.x, y: X.y }, 3) + '$.');
              ste.push('A hajlásszög: $\\cos\\varphi=\\dfrac{|\\mathbf n_1\\cdot\\mathbf n_2|}{|\\mathbf n_1||\\mathbf n_2|}=\\dfrac{' + tn(Math.abs(l1.A * l2.A + l1.B * l2.B)) + '}{' + tn(Math.hypot(l1.A, l1.B)) + '\\cdot' + tn(Math.hypot(l2.A, l2.B)) + '}$, így $\\varphi ' + F.ap(toDeg(X.angle), 2) + '^\\circ$.');
              if (!l1.vertical && !l2.vertical && Math.abs(1 + l1.m * l2.m) > 1e-12) ste.push('Meredekségekkel: $\\operatorname{tg}\\varphi=\\left|\\dfrac{m_1-m_2}{1+m_1m_2}\\right|=\\left|\\dfrac{' + F.p(l1.m, 3) + '-' + F.p(l2.m, 3) + '}{1+' + F.p(l1.m, 3) + '\\cdot' + F.p(l2.m, 3) + '}\\right| ' + F.ap(Math.abs((l1.m - l2.m) / (1 + l1.m * l2.m)), 3) + '$.');
              if (X.perpendicular) html += '<p class="msg ok">A két egyenes merőleges: $\\mathbf n_1\\cdot\\mathbf n_2=0$ (' + (l1.vertical || l2.vertical ? 'az egyik függőleges, a másik vízszintes' : 'a meredekségek szorzata $-1$') + ').</p>'.replace(/\$([^$]*)\$/g, '$1');
            } else if (X.kind === 'parallel') { html += '<p class="msg ok">A két egyenes párhuzamos, nincs metszéspontjuk (a normálvektorok egymás skalárszorosai).</p>'; ste.push('A normálvektorok párhuzamosak, de a két egyenes nem esik egybe: a rendszernek nincs megoldása.'); }
            else { html += '<p class="msg ok">A két egyenes egybeesik: végtelen sok közös pontjuk van.</p>'; ste.push('Az egyenletek egymás számszorosai, ezért a két egyenes ugyanaz.'); }
          }
        } else if (m === 'kor') {
          var O = { x: V.cx, y: V.cy };
          circ.push({ x: O.x, y: O.y, r: V.r, color: 1 }); pts.push({ x: O.x, y: O.y, label: 'O', color: 1 });
          if (!l1) html = degMsg('P és Q pont');
          else {
            var cl = M.geoCircleLine(O, V.r, l1), q = cl.quad, dd = cl.d;
            html = '<dl class="kv"><dt>kör</dt><dd>' + t('(x-' + F.p(O.x, 1) + ')^2+(y-' + F.p(O.y, 1) + ')^2=' + tn(V.r * V.r)) + '</dd><dt>egyenes</dt><dd>' + t(lineTex(l1.A, l1.B, l1.C)) + '</dd>' +
              '<dt>középpont távolsága</dt><dd>' + t('d=\\dfrac{|Ap+Bq-C|}{\\sqrt{A^2+B^2}} ' + F.ap(dd, 3)) + '</dd><dt>metszéspontok száma</dt><dd>' + cl.n + '</dd></dl>';
            ste.push('Az egyenes és a kör középpontjának távolsága: $d=\\dfrac{|' + F.p(l1.A, 3) + '\\cdot' + F.p(O.x, 1) + '+' + F.p(l1.B, 3) + '\\cdot' + F.p(O.y, 1) + '-' + F.p(l1.C, 3) + '|}{\\sqrt{' + tn(l1.A * l1.A) + '+' + tn(l1.B * l1.B) + '}} ' + F.ap(dd, 3) + '$; a sugár $r=' + tn(V.r) + '$.');
            if (q.v === 'x') ste.push('**Behelyettesítés:** az egyenes egyenletéből $y=\\dfrac{' + tn(l1.C) + (l1.A < 0 ? '+' + tn(-l1.A) : '-' + tn(l1.A)) + 'x}{' + tn(l1.B) + '}$, ezt a kör egyenletébe írva és $' + tn(l1.B * l1.B) + '$-tel szorozva: $B^2(x-p)^2+(C-Ax-qB)^2=r^2B^2$.');
            else ste.push('**Behelyettesítés:** az egyenes függőleges, $x=' + kit.exact(q.x0) + '$. Ezt a kör egyenletébe írva $(' + tn(q.x0) + '-' + F.p(O.x, 1) + ')^2+(y-' + F.p(O.y, 1) + ')^2=' + tn(V.r * V.r) + '$.');
            ste.push('**Másodfokú egyenlet:** $' + (q.v === 'x' ? 'ax^2+bx+c=0' : 'y^2+by+c=0') + '$, ahol $a=' + tn(q.a) + '$, $b=' + tn(q.b) + '$, $c=' + tn(q.c) + '$.');
            ste.push('**Diszkrimináns:** $D=b^2-4ac=' + F.p(q.b, 3) + '^2-4\\cdot' + F.p(q.a, 3) + '\\cdot' + F.p(q.c, 3) + '=' + tn(q.D) + '$.');
            if (cl.n === 0) { ste.push('Mivel $D<0$, nincs valós gyök: az egyenes nem metszi a kört ($d>r$).'); html += '<p class="msg ok">Az egyenes elkerüli a kört: $d>r$.</p>'.replace(/\$([^$]*)\$/g, '$1'); }
            else if (cl.n === 1) { ste.push('Mivel $D=0$, egy (kétszeres) gyök van: az egyenes érinti a kört ($d=r$). Az érintési pont: $E ' + F.ptA(cl.pts[0], 3) + '$.'); html += '<p class="msg ok">Érintő: az egyenes a kört egyetlen pontban érinti, $d=r$ (a sugár merőleges az egyenesre).</p>'; pts.push({ x: cl.pts[0].x, y: cl.pts[0].y, color: 2, label: 'E' }); segs.push({ a: [O.x, O.y], b: [cl.pts[0].x, cl.pts[0].y], dim: true, dash: [4, 3] }); }
            else { ste.push('Mivel $D>0$, két különböző valós gyök van: $' + (q.v === 'x' ? 'x' : 'y') + '_{1,2}=\\dfrac{-b\\pm\\sqrt{D}}{2a}$. A metszéspontok: $M_1 ' + F.ptA(cl.pts[0], 3) + '$, $M_2 ' + F.ptA(cl.pts[1], 3) + '$.'); cl.pts.forEach(function (c, k) { pts.push({ x: c.x, y: c.y, color: 2, label: 'M' + (k + 1) }); }); }
          }
        } else {
          var pb = M.geoParabola(V.u, V.v, V.pp);
          curves.push({ f: pb.f }); pts.push({ x: pb.focus.x, y: pb.focus.y, label: 'F', color: 3 }); segs.push({ a: [-60, pb.directrix], b: [60, pb.directrix], color: 3, dash: [8, 3] });
          html = '<dl class="kv"><dt>parabola</dt><dd>' + t('y=\\dfrac{(x-' + F.p(V.u, 1) + ')^2}{' + tn(2 * V.pp) + '}+' + F.p(V.v, 1)) + '</dd><dt>fókusz</dt><dd>' + t('F=' + F.pt(pb.focus, 3)) + '</dd><dt>vezéregyenes</dt><dd>' + t('y=' + tn(pb.directrix)) + '</dd></dl>';
          ste.push('A parabola egyenlete $(x-u)^2=2p(y-v)$ alakban: a csúcs $(' + tn(V.u) + ';\\ ' + tn(V.v) + ')$, $p=' + tn(V.pp) + '$. A fókusz a csúcs fölött $\\dfrac p2=' + tn(V.pp / 2) + '$-re van, a vezéregyenes alatta ugyanennyire: $y=v-\\dfrac p2$ (szaggatott).');
          if (!l1) html += degMsg('P és Q pont');
          else {
            var pl = M.geoParabolaLine(V.u, V.v, V.pp, l1);
            html += '<dl class="kv"><dt>egyenes</dt><dd>' + t(lineTex(l1.A, l1.B, l1.C)) + '</dd><dt>metszéspontok száma</dt><dd>' + (pl.vertical ? '1 (az egyenes függőleges, párhuzamos a tengellyel)' : pl.n) + '</dd></dl>';
            if (pl.vertical) ste.push('Az egyenes függőleges ($x=' + kit.exact(l1.C / l1.A) + '$), a parabola tengelyével párhuzamos, ezért pontosan egy pontban metszi: $' + F.pt(pl.pts[0], 3).replace(/^/, '') + '$.');
            else {
              var qq = pl.quad;
              ste.push('**Behelyettesítés:** $y=mx+k$, ahol $m=' + kit.exact(qq.m) + '$, $k=' + kit.exact(qq.k) + '$. A parabola egyenletébe: $\\dfrac{(x-u)^2}{2p}+v=mx+k$.');
              ste.push('**Másodfokú egyenlet:** $x^2-2(u+pm)x+u^2+2p(v-k)=0$, azaz $x^2+(' + tn(qq.b) + ')x+(' + tn(qq.c) + ')=0$.');
              ste.push('**Diszkrimináns:** $D=' + F.p(qq.b, 3) + '^2-4\\cdot' + F.p(qq.c, 3) + '=' + tn(qq.D) + '$.');
              if (pl.n === 0) { ste.push('$D<0$: az egyenes nem metszi a parabolát.'); html += '<p class="msg ok">Az egyenes elkerüli a parabolát.</p>'; }
              else if (pl.n === 1) { ste.push('$D=0$: az egyenes érinti a parabolát az $E ' + F.ptA(pl.pts[0], 3) + '$ pontban.'); html += '<p class="msg ok">Érintő: egyetlen közös pont, $D=0$.</p>'.replace(/\$([^$]*)\$/g, '$1'); pts.push({ x: pl.pts[0].x, y: pl.pts[0].y, color: 2, label: 'E' }); }
              else { ste.push('$D>0$: két metszéspont van: $M_1 ' + F.ptA(pl.pts[0], 3) + '$, $M_2 ' + F.ptA(pl.pts[1], 3) + '$.'); pl.pts.forEach(function (c, k) { pts.push({ x: c.x, y: c.y, color: 2, label: 'M' + (k + 1) }); }); }
            }
            if (pl.vertical) pts.push({ x: pl.pts[0].x, y: pl.pts[0].y, color: 2, label: 'M' });
          }
        }
        p.set({ points: pts, segments: segs, circles: circ, curves: curves });
        kit.$('.out', n).innerHTML = html + (ste.length ? kit.steps(ste) : '');
      }
      var PRE = {
        egyenes: function () { setSel(kit, n, 'egyenes'); S.P1 = { x: -2, y: 1 }; S.Q1 = { x: 2, y: -3 }; },
        merol: function () { setSel(kit, n, 'ketto'); S.P1 = { x: -4, y: -2 }; S.Q1 = { x: 4, y: 2 }; S.P2 = { x: 0, y: -4 }; S.Q2 = { x: -2, y: 0 }; },
        parh: function () { setSel(kit, n, 'ketto'); S.P1 = { x: -4, y: -2 }; S.Q1 = { x: 4, y: 2 }; S.P2 = { x: -4, y: 2 }; S.Q2 = { x: 4, y: 6 }; },
        erinto: function () { setSel(kit, n, 'kor'); setIn(kit, n, 'cx', 0); setIn(kit, n, 'cy', 0); setIn(kit, n, 'r', 5); S.P1 = { x: 5, y: -3 }; S.Q1 = { x: 5, y: 3 }; },
        szel: function () { setSel(kit, n, 'kor'); setIn(kit, n, 'cx', 1); setIn(kit, n, 'cy', 1); setIn(kit, n, 'r', 4); S.P1 = { x: -4, y: -2 }; S.Q1 = { x: 4, y: 4 }; },
        pszel: function () { setSel(kit, n, 'parabola'); setIn(kit, n, 'u', 0); setIn(kit, n, 'v', -2); setIn(kit, n, 'pp', 2); S.P1 = { x: -4, y: -2 }; S.Q1 = { x: 4, y: 2 }; },
        perinto: function () { setSel(kit, n, 'parabola'); setIn(kit, n, 'u', 0); setIn(kit, n, 'v', 0); setIn(kit, n, 'pp', 2); S.P1 = { x: 0, y: -1 }; S.Q1 = { x: 4, y: 3 }; }
      };
      kit.$$('[data-preset]', n).forEach(function (bt) { kit.on(bt, 'click', function () { PRE[bt.dataset.preset](); draw(); }); });
      kit.on(kit.$('[data-mode]', n), 'change', draw);
      setTimeout(function () {
        p = kit.mkPlot(kit.$('.plotbox', n), { xmin: -8, xmax: 8, ymin: -8, ymax: 8, equal: true, snap: 0.5, onDrag: function (pt, x, y) { if (S[pt.id]) { S[pt.id] = { x: x, y: y }; draw(); } } });
        kit.bindSliders(n, function (v) { V = v; draw(); });
      }, 0);
      return n;
    }
  });
})(typeof window !== 'undefined' ? window : globalThis);
