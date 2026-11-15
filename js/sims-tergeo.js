/* MATEK OS – térgeometriai szimulációk (Labor): testek felszíne és térfogata, kiterített háló, síkmetszetek.
   A modellek (tergeo*) DOM-függetlenek, Node-ban tesztelhetők. */
(function (root) {
  'use strict';
  var MO = root.MO = root.MO || {};
  var M = MO.models = MO.models || {};
  MO.simDefs = MO.simDefs || [];
  var PI = Math.PI, sqrt = Math.sqrt, DEG = 180 / PI;

  /* ---------------- vektor-segédek ---------------- */
  function sub(a, b) { return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]; }
  function add(a, b) { return [a[0] + b[0], a[1] + b[1], a[2] + b[2]]; }
  function mul(a, k) { return [a[0] * k, a[1] * k, a[2] * k]; }
  function dot(a, b) { return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; }
  function cross(a, b) { return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]; }
  function len(a) { return sqrt(dot(a, a)); }
  function unit(a) { var l = len(a) || 1; return mul(a, 1 / l); }
  M.tergeoVec = { sub: sub, add: add, mul: mul, dot: dot, cross: cross, len: len, unit: unit };

  /* ---------------- szabályos sokszög ---------------- */
  M.tergeoNgon = function (n, a) {
    var R = a / (2 * Math.sin(PI / n)), r = a / (2 * Math.tan(PI / n));
    return { R: R, r: r, T: n * a * r / 2, K: n * a };
  };
  function ring(n, R, z) { /* az első él (0–1. csúcs) felezőpontja a −y irányban, a néző felé */
    var out = []; for (var k = 0; k < n; k++) { var t = -PI / 2 - PI / n + 2 * PI * k / n; out.push([R * Math.cos(t), R * Math.sin(t), z]); } return out;
  }

  /* ---------------- testek számadatai ----------------
     teglatest {a,b,c} · hasab {n,a,m} · henger {r,m} · gula {n,a,m} · kup {r,m} · csonkagula {a,c,m} (négyzet alap) · csonkakup {R,r,m} · gomb {R} */
  M.tergeoCalc = function (type, p) {
    var o = { type: type }, g;
    if (type === 'teglatest') {
      o.T = p.a * p.b; o.P = 2 * (p.a + p.b) * p.c; o.A = 2 * (p.a * p.b + p.b * p.c + p.c * p.a); o.V = p.a * p.b * p.c;
      o.fab = sqrt(p.a * p.a + p.b * p.b); o.fbc = sqrt(p.b * p.b + p.c * p.c); o.fac = sqrt(p.a * p.a + p.c * p.c);
      o.d = sqrt(p.a * p.a + p.b * p.b + p.c * p.c); o.H = p.c;
    } else if (type === 'hasab') {
      g = M.tergeoNgon(p.n, p.a); o.ngon = g; o.T = g.T; o.K = g.K; o.P = g.K * p.m; o.A = 2 * g.T + o.P; o.V = g.T * p.m;
      o.fs = sqrt(p.a * p.a + p.m * p.m); o.H = p.m;
      var k = Math.floor(p.n / 2); o.D = p.n > 3 ? 2 * g.R * Math.sin(k * PI / p.n) : 0; o.d = p.n > 3 ? sqrt(o.D * o.D + p.m * p.m) : 0;
    } else if (type === 'henger') {
      o.T = PI * p.r * p.r; o.P = 2 * PI * p.r * p.m; o.A = 2 * o.T + o.P; o.V = o.T * p.m; o.d = sqrt(4 * p.r * p.r + p.m * p.m); o.H = p.m;
    } else if (type === 'gula') {
      g = M.tergeoNgon(p.n, p.a); o.ngon = g; o.T = g.T; o.mf = sqrt(p.m * p.m + g.r * g.r); o.e = sqrt(p.m * p.m + g.R * g.R);
      o.P = p.n * p.a * o.mf / 2; o.A = o.T + o.P; o.V = o.T * p.m / 3; o.alpha = Math.atan2(p.m, g.r) * DEG; o.beta = Math.atan2(p.m, g.R) * DEG; o.H = p.m;
    } else if (type === 'kup') {
      o.T = PI * p.r * p.r; o.alk = sqrt(p.r * p.r + p.m * p.m); o.P = PI * p.r * o.alk; o.A = o.T + o.P; o.V = o.T * p.m / 3;
      o.alpha = Math.atan2(p.m, p.r) * DEG; o.nyilas = 2 * Math.atan2(p.r, p.m) * DEG; o.omega = 360 * p.r / o.alk; o.H = p.m;
    } else if (type === 'csonkagula') {
      var dd = Math.abs(p.a - p.c) / 2; o.T = p.a * p.a; o.t = p.c * p.c; o.mf = sqrt(p.m * p.m + dd * dd); o.e = sqrt(p.m * p.m + 2 * dd * dd);
      o.P = 4 * (p.a + p.c) / 2 * o.mf; o.A = o.T + o.t + o.P; o.V = p.m / 3 * (o.T + sqrt(o.T * o.t) + o.t);
      o.alpha = dd > 1e-12 ? Math.atan2(p.m, dd) * DEG : 90; o.beta = dd > 1e-12 ? Math.atan2(p.m, dd * Math.SQRT2) * DEG : 90; o.H = p.m;
      o.d = sqrt(p.m * p.m + Math.pow((p.a + p.c) / Math.SQRT2, 2)); /* testátló: alsó és felső szemközti csúcs */
    } else if (type === 'csonkakup') {
      o.T = PI * p.R * p.R; o.t = PI * p.r * p.r; o.alk = sqrt(p.m * p.m + (p.R - p.r) * (p.R - p.r)); o.P = PI * (p.R + p.r) * o.alk;
      o.A = o.T + o.t + o.P; o.V = PI * p.m / 3 * (p.R * p.R + p.R * p.r + p.r * p.r);
      o.alpha = Math.abs(p.R - p.r) > 1e-12 ? Math.atan2(p.m, Math.abs(p.R - p.r)) * DEG : 90; o.H = p.m;
    } else if (type === 'gomb') {
      o.A = 4 * PI * p.R * p.R; o.V = 4 / 3 * PI * Math.pow(p.R, 3); o.H = 2 * p.R;
    } else throw new Error('ismeretlen test: ' + type);
    return o;
  };

  /* ---------------- 3D-háló (alaplap a z = 0 síkban, a test z ∈ [0; H]) ----------------
     pts, edges [{v, hide}], faces [{v, color, alpha}], labels [{p, text}], hl: {1, 2} segédháromszögek */
  M.tergeoMesh = function (type, p, N) {
    N = N || 32;
    var pts = [], edges = [], faces = [], labels = [], hl = {};
    function P(q) { pts.push(q); return pts.length - 1; }
    function E(i, j, hide, soft) { edges.push({ v: [i, j], hide: !!hide, soft: !!(hide && soft) }); }
    function loop(ids) { for (var i = 0; i < ids.length; i++) E(ids[i], ids[(i + 1) % ids.length]); }
    function prismLike(n, R1, R2, H, curved) {
      var B = ring(n, R1, 0).map(P), T = ring(n, R2, H).map(P); loop(B); loop(T);
      for (var k = 0; k < n; k++) {
        E(B[k], T[k], curved && k % (n / 2) !== n / 4, curved && k % 2 === 0);
        faces.push({ v: [B[k], B[(k + 1) % n], T[(k + 1) % n], T[k]], color: 0, alpha: curved ? 0.05 : 0.09 });
      }
      faces.push({ v: B.slice(), color: 1, alpha: 0.14 }); faces.push({ v: T.slice(), color: 0, alpha: 0.08 });
      return { B: B, T: T };
    }
    function pyrLike(n, R1, H, curved) {
      var B = ring(n, R1, 0).map(P), A = P([0, 0, H]); loop(B);
      for (var k = 0; k < n; k++) { E(B[k], A, curved && k % (n / 2) !== n / 4, curved && k % 2 === 0); faces.push({ v: [B[k], B[(k + 1) % n], A], color: 0, alpha: curved ? 0.05 : 0.09 }); }
      faces.push({ v: B.slice(), color: 1, alpha: 0.14 });
      return { B: B, A: A };
    }
    function mid(a, b) { return mul(add(a, b), 0.5); }
    var H, g, r1, s;
    if (type === 'teglatest') {
      H = p.c; var a2 = p.a / 2, b2 = p.b / 2;
      var bb = [[-a2, -b2, 0], [a2, -b2, 0], [a2, b2, 0], [-a2, b2, 0]].map(P), tt = [[-a2, -b2, H], [a2, -b2, H], [a2, b2, H], [-a2, b2, H]].map(P);
      loop(bb); loop(tt); for (var i = 0; i < 4; i++) { E(bb[i], tt[i]); faces.push({ v: [bb[i], bb[(i + 1) % 4], tt[(i + 1) % 4], tt[i]], color: 0, alpha: 0.09 }); }
      faces.push({ v: bb.slice(), color: 1, alpha: 0.14 }); faces.push({ v: tt.slice(), color: 0, alpha: 0.08 });
      labels.push({ p: mid(pts[bb[0]], pts[bb[1]]), text: 'a' }, { p: mid(pts[bb[1]], pts[bb[2]]), text: 'b' }, { p: mid(pts[bb[1]], pts[tt[1]]), text: 'c' });
      var A0 = pts[bb[0]], C0 = pts[bb[2]], G0 = pts[tt[2]];
      hl[1] = { pts: [A0, pts[bb[1]], C0], lab: ['A', 'B', 'C'], seg: [[0, 2, 'f']] };
      hl[2] = { pts: [A0, C0, G0], lab: ['A', 'C', 'G'], seg: [[0, 2, 'd']] };
    } else if (type === 'hasab') {
      H = p.m; g = M.tergeoNgon(p.n, p.a); s = prismLike(p.n, g.R, g.R, H, false);
      labels.push({ p: mid(pts[s.B[0]], pts[s.B[1]]), text: 'a' }, { p: mid(pts[s.B[1]], pts[s.T[1]]), text: 'm' });
      hl[1] = { pts: [pts[s.B[0]], pts[s.B[1]], pts[s.T[1]]], lab: ['', '', ''], seg: [[0, 2, 'f']] };
      var kk = Math.floor(p.n / 2);
      hl[2] = p.n > 3 ? { pts: [pts[s.B[0]], pts[s.B[kk]], pts[s.T[kk]]], lab: ['', 'D', ''], seg: [[0, 2, 'd']] } : hl[1];
    } else if (type === 'henger') {
      H = p.m; s = prismLike(N, p.r, p.r, H, true);
      labels.push({ p: [p.r * 0.5, 0, 0], text: 'r' }, { p: [p.r, 0, H / 2], text: 'm' });
      hl[1] = hl[2] = { pts: [[-p.r, 0, 0], [p.r, 0, 0], [p.r, 0, H], [-p.r, 0, H]], lab: ['', '', '', ''], seg: [[0, 2, 'átló']] };
    } else if (type === 'gula') {
      H = p.m; g = M.tergeoNgon(p.n, p.a); s = pyrLike(p.n, g.R, H, false);
      var F = mid(pts[s.B[0]], pts[s.B[1]]);
      labels.push({ p: mid(pts[s.B[1]], pts[s.B[2 % p.n]]), text: 'a' });
      hl[1] = { pts: [[0, 0, H], [0, 0, 0], F], lab: ['T', 'O', 'F  α'], seg: [[0, 2, 'mₒ']] };
      hl[2] = { pts: [[0, 0, H], [0, 0, 0], pts[s.B[1]]], lab: ['T', 'O', 'A  β'], seg: [[0, 2, 'e']] };
    } else if (type === 'kup') {
      H = p.m; s = pyrLike(N, p.r, H, true);
      hl[1] = hl[2] = { pts: [[0, 0, H], [0, 0, 0], [0, -p.r, 0]], lab: ['T', 'O', 'P  α'], seg: [[0, 2, 'a']] };
      labels.push({ p: [0, -p.r / 2, 0], text: 'r' });
    } else if (type === 'csonkagula') {
      H = p.m; s = prismLike(4, p.a / Math.SQRT2, p.c / Math.SQRT2, H, false);
      labels.push({ p: mid(pts[s.B[0]], pts[s.B[1]]), text: 'a' }, { p: mid(pts[s.T[1]], pts[s.T[2]]), text: 'c' });
      hl[1] = { pts: [[0, 0, 0], [0, -p.a / 2, 0], [0, -p.c / 2, H], [0, 0, H]], lab: ['O', 'F  α', '', ''], seg: [[1, 2, 'mₒ']] };
      hl[2] = { pts: [[0, 0, 0], pts[s.B[1]], pts[s.T[1]], [0, 0, H]], lab: ['O', 'A  β', '', ''], seg: [[1, 2, 'e']] };
    } else if (type === 'csonkakup') {
      H = p.m; s = prismLike(N, p.R, p.r, H, true);
      hl[1] = hl[2] = { pts: [[0, 0, 0], [0, -p.R, 0], [0, -p.r, H], [0, 0, H]], lab: ['O', 'P  α', '', ''], seg: [[1, 2, 'a']] };
      labels.push({ p: [p.R / 2, 0, 0], text: 'R' }, { p: [p.r / 2, 0, H], text: 'r' });
    } else if (type === 'gomb') {
      var L = Math.max(6, Math.round(N / 2)), R = p.R; H = 2 * R;
      var S = P([0, 0, 0]), Np = P([0, 0, H]), rows = [];
      for (var j = 1; j < L; j++) { var ph = PI * j / L; rows.push(ring(N, R * Math.sin(ph), R - R * Math.cos(ph)).map(P)); }
      for (j = 0; j < rows.length; j++) {
        var row = rows[j], eq = j === Math.floor(rows.length / 2);
        for (var k2 = 0; k2 < N; k2++) {
          E(row[k2], row[(k2 + 1) % N], !eq, j % 2 === 1);
          var up = j + 1 < rows.length ? rows[j + 1] : null, mer = k2 % (N / 2) === 0;
          if (up) { E(row[k2], up[k2], !mer, k2 % 2 === 0); faces.push({ v: [row[k2], row[(k2 + 1) % N], up[(k2 + 1) % N], up[k2]], color: 0, alpha: 0.04 }); }
        }
      }
      for (k2 = 0; k2 < N; k2++) {
        E(S, rows[0][k2], k2 % (N / 2) !== 0, k2 % 2 === 0); E(rows[rows.length - 1][k2], Np, k2 % (N / 2) !== 0, k2 % 2 === 0);
        faces.push({ v: [S, rows[0][(k2 + 1) % N], rows[0][k2]], color: 0, alpha: 0.04 });
        faces.push({ v: [rows[rows.length - 1][k2], rows[rows.length - 1][(k2 + 1) % N], Np], color: 0, alpha: 0.04 });
      }
      hl[1] = hl[2] = { pts: [[0, 0, R], [0, -R, R]], lab: ['O', ''], seg: [[0, 1, 'R']] };
    } else throw new Error('ismeretlen test: ' + type);
    return { pts: pts, edges: edges, faces: faces, labels: labels, hl: hl, H: H };
  };

  /* jelenet a megjelenítőnek: középre tolva, a rejtett élek nélkül, opcionális kiemeléssel és metszettel */
  M.tergeoScene = function (mesh, opt) {
    opt = opt || {};
    var dz = mesh.H / 2, sh = function (q) { return [q[0], q[1], q[2] - dz]; };
    var sc = { points: mesh.pts.map(sh), edges: [], faces: mesh.faces.slice(), labels: [], dots: [] };
    mesh.edges.forEach(function (e) { if (e.soft) sc.edges.push({ v: e.v, dim: true, w: 0.6 }); else if (!e.hide) sc.edges.push({ v: e.v, dim: !!opt.dimEdges }); });
    if (!opt.noLabels) mesh.labels.forEach(function (l) { sc.labels.push({ p: sh(l.p), text: l.text }); });
    var h = opt.hl && mesh.hl[opt.hl];
    if (h) {
      var b = sc.points.length; h.pts.forEach(function (q) { sc.points.push(sh(q)); });
      var ids = h.pts.map(function (q, i) { return b + i; });
      if (ids.length > 2) sc.faces.push({ v: ids, color: 2, alpha: 0.2 });
      for (var i = 0; i < ids.length; i++) if (ids.length > 2 || i === 0) sc.edges.push({ v: [ids[i], ids[(i + 1) % ids.length]], color: 2, dash: true, w: 2 });
      h.seg.forEach(function (sg) { sc.edges.push({ v: [b + sg[0], b + sg[1]], color: 2, w: 2.5 }); sc.labels.push({ p: sh(mul(add(h.pts[sg[0]], h.pts[sg[1]]), 0.5)), text: sg[2] }); });
      h.lab.forEach(function (t, i) { if (t) sc.labels.push({ i: b + i, text: t }); });
    }
    if (opt.section && opt.section.length > 2) {
      var b2 = sc.points.length; opt.section.forEach(function (q) { sc.points.push(sh(q)); });
      var sid = opt.section.map(function (q, i) { return b2 + i; });
      sc.faces.push({ v: sid, color: 2, alpha: 0.42 });
      for (var j = 0; j < sid.length; j++) sc.edges.push({ v: [sid[j], sid[(j + 1) % sid.length]], color: 2, w: 2.5 });
      if (opt.section.length <= 8) sid.forEach(function (k) { sc.dots.push(k); });
    }
    return sc;
  };

  /* ---------------- poliéder és sík metszete ----------------
     plane: {n: egységnormális, d}: n·x = d. Eredmény: a metszet csúcsai a síkban a súlypont körüli szög szerint rendezve. */
  M.tergeoSection = function (mesh, plane) {
    var n = plane.n, d0 = plane.d, raw = [], scale = M.tergeoSize(mesh.pts), eps = 1e-9 * scale;
    function pushU(q) { for (var i = 0; i < raw.length; i++) if (len(sub(raw[i], q)) < 1e-7 * scale) return; raw.push(q); }
    mesh.edges.forEach(function (e) {
      var A = mesh.pts[e.v[0]], B = mesh.pts[e.v[1]], da = dot(n, A) - d0, db = dot(n, B) - d0;
      if (Math.abs(da) <= eps) pushU(A); if (Math.abs(db) <= eps) pushU(B);
      if ((da > eps && db < -eps) || (da < -eps && db > eps)) pushU(add(A, mul(sub(B, A), da / (da - db))));
    });
    var res = { pts: [], k: raw.length, area: 0, per: 0, sides: [] };
    if (raw.length < 3) { res.pts = raw; return res; }
    var c = [0, 0, 0]; raw.forEach(function (q) { c = add(c, q); }); c = mul(c, 1 / raw.length);
    var u = null; raw.forEach(function (q) { if (!u && len(sub(q, c)) > 1e-7 * scale) u = unit(sub(q, c)); });
    var w = cross(n, u);
    var srt = raw.map(function (q) { var v = sub(q, c); return { q: q, t: Math.atan2(dot(v, w), dot(v, u)) }; }).sort(function (x, y) { return x.t - y.t; }).map(function (x) { return x.q; });
    var ar = [0, 0, 0];
    for (var i = 0; i < srt.length; i++) { var a = srt[i], b = srt[(i + 1) % srt.length]; ar = add(ar, cross(sub(a, c), sub(b, c))); var L = len(sub(b, a)); res.sides.push(L); res.per += L; }
    res.area = len(ar) / 2; res.pts = srt; res.k = srt.length; res.c = c;
    if (res.area < 1e-9 * scale * scale) { res.pts = srt; res.k = Math.min(2, srt.length); res.area = 0; } /* elfajuló: szakasz */
    return res;
  };
  M.tergeoSize = function (pts) { var m = 0; pts.forEach(function (q) { m = Math.max(m, Math.abs(q[0]), Math.abs(q[1]), Math.abs(q[2])); }); return m || 1; };

  /* a metszet alakjának neve (sokszögnél) */
  M.tergeoShape = function (pts) {
    var k = pts.length;
    if (k < 3) return '';
    var S = [], i; for (i = 0; i < k; i++) S.push(sub(pts[(i + 1) % k], pts[i]));
    var L = S.map(len), same = function (x, y) { return Math.abs(x - y) < 1e-6 * Math.max(x, y); }, eqAll = L.every(function (x) { return same(x, L[0]); });
    function right(i2) { return Math.abs(dot(S[i2], S[(i2 + 1) % k])) < 1e-6 * L[i2] * L[(i2 + 1) % k]; }
    function par(x, y) { return len(cross(x, y)) < 1e-6 * len(x) * len(y); }
    var allRight = true; for (i = 0; i < k; i++) if (!right(i)) allRight = false;
    if (k === 3) {
      if (eqAll) return 'szabályos háromszög';
      var r3 = right(0) || right(1) || right(2), iso = same(L[0], L[1]) || same(L[1], L[2]) || same(L[0], L[2]);
      return (r3 && iso) ? 'egyenlő szárú derékszögű háromszög' : r3 ? 'derékszögű háromszög' : iso ? 'egyenlő szárú háromszög' : 'háromszög';
    }
    if (k === 4) {
      var p1 = par(S[0], S[2]), p2 = par(S[1], S[3]);
      if (allRight) return eqAll ? 'négyzet' : 'téglalap';
      if (p1 && p2) return eqAll ? 'rombusz' : 'paralelogramma';
      if (p1 || p2) return 'trapéz';
      return 'négyszög';
    }
    var regular = eqAll; if (regular) { var c0 = dot(S[0], S[1]); for (i = 1; i < k; i++) if (Math.abs(dot(S[i], S[(i + 1) % k]) - c0) > 1e-6 * L[0] * L[0]) regular = false; }
    var nm = { 5: 'ötszög', 6: 'hatszög', 7: 'hétszög', 8: 'nyolcszög' }[k] || (k + '-szög');
    return regular ? 'szabályos ' + nm : nm;
  };

  /* ---------------- síkmetszet testenként ----------------
     type: kocka/teglatest {a,b,c}, gula {a,m} (négyzet alap), henger {r,m}, kup {r,m}, gomb {R}
     mode: par (alaplappal párhuzamos), atlos (alaplapra merőleges, az alaplap átlójával párhuzamos), testatlo (testátlóra merőleges), ferde
     pos ∈ [0; 1] a sík helyzete, th: a sík dőlésszöge az alaplaphoz (fok), ph: a dőlés iránya (fok) */
  M.tergeoSolidOf = function (type, p) {
    if (type === 'kocka') return { t: 'teglatest', p: { a: p.a, b: p.a, c: p.a } };
    if (type === 'teglatest') return { t: 'teglatest', p: { a: p.a, b: p.b, c: p.c } };
    if (type === 'gula') return { t: 'gula', p: { n: 4, a: p.a, m: p.m } };
    if (type === 'henger') return { t: 'henger', p: { r: p.r, m: p.m } };
    if (type === 'kup') return { t: 'kup', p: { r: p.r, m: p.m } };
    if (type === 'gomb') return { t: 'gomb', p: { R: p.R } };
    throw new Error('ismeretlen test: ' + type);
  };
  M.tergeoPlane = function (type, p, mode, pos, th, ph) {
    var so = M.tergeoSolidOf(type, p), H = M.tergeoCalc(so.t, so.p).H, n, pt, s = 0, smax = 0, dir;
    if (mode === 'par') { n = [0, 0, 1]; pt = [0, 0, pos * H]; }
    else if (mode === 'atlos') {
      if (so.t === 'teglatest') { dir = unit([so.p.a, so.p.b, 0]); smax = so.p.a * so.p.b / sqrt(so.p.a * so.p.a + so.p.b * so.p.b); }
      else if (so.t === 'gula') { dir = unit([1, 1, 0]); smax = p.a / Math.SQRT2; }
      else { dir = [1, 0, 0]; smax = so.t === 'gomb' ? p.R : p.r; }
      n = [-dir[1], dir[0], 0]; s = (2 * pos - 1) * smax; pt = [n[0] * s, n[1] * s, H / 2];
    } else if (mode === 'testatlo') {
      if (so.t !== 'teglatest') return null;
      var v = [so.p.a, so.p.b, so.p.c]; n = unit(v); pt = add([-so.p.a / 2, -so.p.b / 2, 0], mul(v, pos));
    } else {
      var t = th / DEG, f = ph / DEG; n = [Math.sin(t) * Math.cos(f), Math.sin(t) * Math.sin(f), Math.cos(t)]; pt = [0, 0, pos * H];
    }
    return { n: n, d: dot(n, pt), pt: pt, s: s, smax: smax, H: H };
  };
  M.tergeoCut = function (type, p, mode, pos, th, ph) {
    var so = M.tergeoSolidOf(type, p), pl = M.tergeoPlane(type, p, mode, pos, th, ph);
    var res = { type: type, mode: mode, plane: pl, ok: false };
    if (!pl) { res.msg = 'Ez a síkállás csak kockánál és téglatestnél értelmes: válassz másik síkot.'; return res; }
    var H = pl.H, z = pos * H;
    if (so.t === 'gomb') {
      var R = p.R, C = [0, 0, R], d = Math.abs(dot(pl.n, C) - pl.d);
      res.d = d;
      if (d >= R - 1e-12) { res.msg = d > R + 1e-12 ? 'A sík nem metszi a gömböt.' : 'A sík érinti a gömböt: a metszet egyetlen pont.'; return res; }
      var rho = sqrt(R * R - d * d), c0 = sub(C, mul(pl.n, dot(pl.n, C) - pl.d)), u = unit(cross(pl.n, Math.abs(pl.n[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0])), w = cross(pl.n, u), cp = [];
      for (var i = 0; i < 48; i++) { var a = 2 * PI * i / 48; cp.push(add(c0, add(mul(u, rho * Math.cos(a)), mul(w, rho * Math.sin(a))))); }
      res.ok = true; res.shape = 'kör'; res.rho = rho; res.area = PI * rho * rho; res.per = 2 * PI * rho; res.exact = true; res.pts = cp; return res;
    }
    var curved = so.t === 'henger' || so.t === 'kup', mesh = M.tergeoMesh(so.t, so.p, curved ? 120 : 0);
    var sec = M.tergeoSection(mesh, pl); res.pts = sec.pts; res.k = sec.k; res.sides = sec.sides;
    if (sec.k < 3) { res.msg = sec.k === 0 ? 'A sík nem metszi a testet.' : sec.k === 1 ? 'A sík csak egy pontban érinti a testet.' : 'A sík csak egy szakaszban érinti a testet (a metszet nem síkidom).'; return res; }
    res.ok = true; res.area = sec.area; res.per = sec.per; res.exact = !curved;
    if (!curved) res.shape = M.tergeoShape(sec.pts);
    if (so.t === 'gula' && mode === 'par') { res.lambda = (H - z) / H; res.side = p.a * res.lambda; res.area = res.side * res.side; res.per = 4 * res.side; res.shape = 'négyzet'; }
    if (so.t === 'henger') {
      var r = p.r;
      if (mode === 'par' || (mode === 'ferde' && th === 0)) { res.shape = 'kör'; res.rho = r; res.area = PI * r * r; res.per = 2 * PI * r; res.exact = true; }
      else if (mode === 'atlos') { var hw = sqrt(Math.max(0, r * r - pl.s * pl.s)); res.shape = 'téglalap'; res.w = 2 * hw; res.area = 2 * hw * p.m; res.per = 2 * (2 * hw + p.m); res.exact = true; }
      else {
        var tg = Math.tan(th / DEG);
        if (z - r * tg >= -1e-9 && z + r * tg <= p.m + 1e-9) { var ea = r / Math.cos(th / DEG); res.shape = 'ellipszis'; res.ea = ea; res.eb = r; res.area = PI * ea * r; res.per = PI * (3 * (ea + r) - sqrt((3 * ea + r) * (ea + 3 * r))); res.exact = true; res.ramanujan = true; }
        else res.shape = 'ellipszisdarab (ellipszisív és szakasz határolja)';
      }
    }
    if (so.t === 'kup') {
      var rr = p.r, m = p.m;
      if (mode === 'par' || (mode === 'ferde' && th === 0)) { res.lambda = (m - z) / m; res.rho = rr * res.lambda; res.shape = 'kör'; res.area = PI * res.rho * res.rho; res.per = 2 * PI * res.rho; res.exact = true; }
      else if (mode === 'atlos' && Math.abs(pl.s) < 1e-12) { res.shape = 'egyenlő szárú háromszög (tengelymetszet)'; res.area = rr * m; res.per = 2 * rr + 2 * sqrt(rr * rr + m * m); res.exact = true; }
      else if (mode === 'atlos') res.shape = 'hiperbolaív és szakasz által határolt síkidom';
      else res.shape = sec.pts.every(function (q) { return q[2] > 1e-6 * m; }) ? 'ellipszis' : 'kúpszelet-darab (görbe ív és szakasz határolja)';
    }
    if (so.t === 'kup' && res.lambda !== undefined) { res.Vsmall = M.tergeoCalc('kup', so.p).V * Math.pow(res.lambda, 3); }
    if (so.t === 'gula' && res.lambda !== undefined) { res.Vsmall = M.tergeoCalc('gula', so.p).V * Math.pow(res.lambda, 3); }
    return res;
  };

  /* ---------------- kiterített háló (síkban) ----------------
     type: kocka {a}, teglatest {a,b,c}, hasab3 / hasab4 {a,m}, henger {r,m}, gula4 {a,m}, kup {r,m}
     faces: [{pts, kind: 'alap'|'oldal', name, area, text}], labels: [{x, y, text}] */
  M.tergeoNet = function (type, p) {
    var faces = [], labels = [], groups = [];
    function rect(x0, y0, w, h, kind, name) { faces.push({ pts: [[x0, y0], [x0 + w, y0], [x0 + w, y0 + h], [x0, y0 + h]], kind: kind, name: name, area: w * h }); }
    function circ(cx, cy, r, kind, name) { var q = []; for (var i = 0; i < 72; i++) { var t = 2 * PI * i / 72; q.push([cx + r * Math.cos(t), cy + r * Math.sin(t)]); } faces.push({ pts: q, kind: kind, name: name, area: PI * r * r }); }
    var a = p.a, b, c, m;
    if (type === 'kocka' || type === 'teglatest') {
      b = type === 'kocka' ? a : p.b; c = type === 'kocka' ? a : p.c;
      rect(0, 0, a, b, 'alap', 'alaplap'); rect(0, -c, a, c, 'oldal', 'elülső lap'); rect(0, b, a, c, 'oldal', 'hátsó lap');
      rect(0, b + c, a, b, 'alap', 'fedőlap'); rect(-c, 0, c, b, 'oldal', 'bal oldallap'); rect(a, 0, c, b, 'oldal', 'jobb oldallap');
      groups.push({ name: 'alap- és fedőlap', count: 2, w: a, h: b, each: a * b }, { name: 'elülső és hátsó lap', count: 2, w: a, h: c, each: a * c }, { name: 'két oldallap', count: 2, w: b, h: c, each: b * c });
      labels.push({ x: a / 2, y: -c, text: 'a', dy: 14, align: 'center' }, { x: a + c, y: b / 2, text: 'b', dx: 10 });
      labels.push({ x: a + c / 2, y: 0, text: 'c', dy: 14, align: 'center' });
    } else if (type === 'hasab3' || type === 'hasab4') {
      var n = type === 'hasab3' ? 3 : 4; m = p.m; var g = M.tergeoNgon(n, a);
      for (var k = 0; k < n; k++) rect(k * a, 0, a, m, 'oldal', (k + 1) + '. oldallap');
      if (n === 3) {
        var h3 = a * sqrt(3) / 2;
        faces.push({ pts: [[0, 0], [a / 2, -h3], [a, 0]], kind: 'alap', name: 'alaplap', area: g.T });
        faces.push({ pts: [[0, m], [a, m], [a / 2, m + h3]], kind: 'alap', name: 'fedőlap', area: g.T });
      } else { rect(0, -a, a, a, 'alap', 'alaplap'); rect(0, m, a, a, 'alap', 'fedőlap'); }
      groups.push(n === 3 ? { name: 'alap- és fedőlap (szabályos háromszög)', count: 2, tri: a, each: g.T } : { name: 'alap- és fedőlap', count: 2, w: a, h: a, each: g.T }, { name: 'oldallapok', count: n, w: a, h: m, each: a * m });
      labels.push({ x: n * a / 2, y: -0.02, text: n + 'a = ' + MO.num(n * a, 3), dy: 14 }, { x: n * a + 0.02, y: m / 2, text: 'm', dx: 10 });
    } else if (type === 'henger') {
      var r = p.r; m = p.m; var L = 2 * PI * r;
      rect(0, 0, L, m, 'oldal', 'palást'); circ(PI * r, -r, r, 'alap', 'alaplap'); circ(PI * r, m + r, r, 'alap', 'fedőlap');
      groups.push({ name: 'alap- és fedőkör', count: 2, circ: r, each: PI * r * r }, { name: 'palást (téglalap)', count: 1, w: L, h: m, each: L * m });
      labels.push({ x: L / 2, y: m / 2, text: '2πr ≈ ' + MO.num(L, 2), dy: -10 }, { x: L + 0.02, y: m / 2, text: 'm', dx: 10 }, { x: PI * r, y: -r, text: 'r', dx: 0 });
    } else if (type === 'gula4') {
      m = p.m; var mf = sqrt(m * m + a * a / 4), h = a / 2;
      rect(-h, -h, a, a, 'alap', 'alaplap');
      faces.push({ pts: [[-h, -h], [h, -h], [0, -h - mf]], kind: 'oldal', name: 'oldallap', area: a * mf / 2 });
      faces.push({ pts: [[h, -h], [h, h], [h + mf, 0]], kind: 'oldal', name: 'oldallap', area: a * mf / 2 });
      faces.push({ pts: [[h, h], [-h, h], [0, h + mf]], kind: 'oldal', name: 'oldallap', area: a * mf / 2 });
      faces.push({ pts: [[-h, h], [-h, -h], [-h - mf, 0]], kind: 'oldal', name: 'oldallap', area: a * mf / 2 });
      groups.push({ name: 'alaplap (négyzet)', count: 1, w: a, h: a, each: a * a }, { name: 'oldallapok (egyenlő szárú háromszögek)', count: 4, base: a, mf: mf, each: a * mf / 2 });
      labels.push({ x: 0, y: -h, text: 'a', dy: -4 }, { x: 0, y: -h - mf / 2, text: 'mₒ ≈ ' + MO.num(mf, 2), dx: 8 });
    } else if (type === 'kup') {
      var rk = p.r; m = p.m; var al = sqrt(rk * rk + m * m), om = 2 * PI * rk / al, q = [[0, 0]];
      for (var i = 0; i <= 72; i++) { var t = -PI / 2 - om / 2 + om * i / 72; q.push([al * Math.cos(t), al * Math.sin(t)]); }
      faces.push({ pts: q, kind: 'oldal', name: 'palást (körcikk)', area: PI * rk * al });
      circ(0, -al - rk, rk, 'alap', 'alaplap');
      groups.push({ name: 'alaplap (kör)', count: 1, circ: rk, each: PI * rk * rk }, { name: 'palást (körcikk)', count: 1, R: al, omega: 360 * rk / al, each: PI * rk * al });
      labels.push({ x: al * 0.5 * Math.cos(-PI / 2 + om / 2), y: al * 0.5 * Math.sin(-PI / 2 + om / 2), text: 'a', dx: 6 }, { x: 0, y: -0.3 * al, text: 'ω ≈ ' + MO.num(360 * rk / al, 1) + '°', align: 'center' });
    } else throw new Error('ismeretlen test: ' + type);
    var A = 0; faces.forEach(function (f) { A += f.area; });
    labels = labels.filter(function (l) { return l.text; });
    return { faces: faces, labels: labels, groups: groups, A: A };
  };
  M.tergeoNetSolid = function (type, p) {
    if (type === 'kocka') return { t: 'teglatest', p: { a: p.a, b: p.a, c: p.a } };
    if (type === 'teglatest') return { t: 'teglatest', p: { a: p.a, b: p.b, c: p.c } };
    if (type === 'hasab3') return { t: 'hasab', p: { n: 3, a: p.a, m: p.m } };
    if (type === 'hasab4') return { t: 'hasab', p: { n: 4, a: p.a, m: p.m } };
    if (type === 'henger') return { t: 'henger', p: { r: p.r, m: p.m } };
    if (type === 'gula4') return { t: 'gula', p: { n: 4, a: p.a, m: p.m } };
    if (type === 'kup') return { t: 'kup', p: { r: p.r, m: p.m } };
    throw new Error('ismeretlen test: ' + type);
  };
  M.tergeoPolyArea = function (q) { var s = 0; for (var i = 0; i < q.length; i++) { var a = q[i], b = q[(i + 1) % q.length]; s += a[0] * b[1] - a[1] * b[0]; } return Math.abs(s) / 2; };

  /* ================= megjelenítés (csak build-en belül nyúl a DOM-hoz) ================= */
  function fmt(kit) {
    return {
      n: function (x, d) { return kit.tnum(x, d === undefined ? 3 : d); },
      q: function (x, d) { d = d === undefined ? 3 : d; var k = Math.pow(10, d), r = Math.round(x * k) / k; return (Math.abs(r - x) < 1e-9 ? '= ' : '\\approx ') + kit.tnum(x, d); },
      deg: function (x) { var r = Math.round(x * 100) / 100; return (Math.abs(r - x) < 1e-9 ? '= ' : '\\approx ') + kit.tnum(x, 2) + '^\\circ'; }
    };
  }
  function setLabel(n, kit, id, text, show) {
    var inp = kit.$('[data-in="' + id + '"]', n); if (!inp) return; var lab = inp.parentNode, sp = kit.$('span', lab);
    if (sp && sp.firstChild) sp.firstChild.nodeValue = text + ' ';
    lab.style.display = show ? '' : 'none';
  }
  function setIn(n, kit, id, v) { var i = kit.$('[data-in="' + id + '"]', n) || kit.$('[data-sel="' + id + '"]', n); if (i) i.value = v; }
  function fire(n, kit) { var i = kit.$('[data-in]', n); if (i) i.dispatchEvent(new Event('input')); }

  /* ---------- 1. Testek felszíne és térfogata ---------- */
  var SOLIDS = [['teglatest', 'téglatest'], ['hasab', 'egyenes hasáb (szabályos sokszög alap)'], ['henger', 'forgáshenger'], ['gula', 'gúla (szabályos sokszög alap)'],
    ['kup', 'forgáskúp'], ['csonkagula', 'csonkagúla (négyzet alap)'], ['csonkakup', 'csonkakúp'], ['gomb', 'gömb']];
  function testekParams(type, v) {
    if (type === 'teglatest') return { a: v.a, b: v.b, c: v.m };
    if (type === 'hasab' || type === 'gula') return { n: v.n, a: v.a, m: v.m };
    if (type === 'henger' || type === 'kup') return { r: v.a, m: v.m };
    if (type === 'csonkagula') return { a: v.a, c: v.b, m: v.m };
    if (type === 'csonkakup') return { R: v.a, r: v.b, m: v.m };
    return { R: v.a };
  }
  var SLIDER_LABELS = { /* [a, b, m, n] felirat; üres = rejtett */
    teglatest: ['a él', 'b él', 'c él (magasság)', ''], hasab: ['alapél (a)', '', 'testmagasság (m)', 'az alap oldalszáma (n)'], henger: ['sugár (r)', '', 'magasság (m)', ''],
    gula: ['alapél (a)', '', 'testmagasság (m)', 'az alap oldalszáma (n)'], kup: ['alapkör sugara (r)', '', 'magasság (m)', ''],
    csonkagula: ['alsó alapél (a)', 'felső alapél (c)', 'magasság (m)', ''], csonkakup: ['alsó sugár (R)', 'felső sugár (r)', 'magasság (m)', ''], gomb: ['sugár (R)', '', '', '']
  };
  M.tergeoSteps = function (kit, type, p, r) {
    var F = fmt(kit), n = F.n, q = F.q, deg = F.deg, s = [];
    if (type === 'teglatest') {
      s.push('**Alapterület:** $T = a\\cdot b = ' + n(p.a) + '\\cdot ' + n(p.b) + ' ' + q(r.T) + '$.');
      s.push('**Palást** (a négy oldallap): $P = 2(a+b)\\cdot c = 2\\cdot(' + n(p.a) + '+' + n(p.b) + ')\\cdot ' + n(p.c) + ' ' + q(r.P) + '$.');
      s.push('**Felszín:** $A = 2(ab+bc+ca) = 2\\cdot(' + n(p.a * p.b) + '+' + n(p.b * p.c) + '+' + n(p.c * p.a) + ') ' + q(r.A) + '$.');
      s.push('**Térfogat:** $V = abc = ' + n(p.a) + '\\cdot ' + n(p.b) + '\\cdot ' + n(p.c) + ' ' + q(r.V) + '$.');
      s.push('**Lapátlók:** $f_{ab} = \\sqrt{a^2+b^2} ' + q(r.fab) + '$, $f_{bc} ' + q(r.fbc) + '$, $f_{ac} ' + q(r.fac) + '$ (az ABC derékszögű háromszögből).');
      s.push('**Testátló:** az ACG derékszögű háromszögben $d = \\sqrt{f_{ab}^2+c^2} = \\sqrt{a^2+b^2+c^2} = \\sqrt{' + n(p.a * p.a) + '+' + n(p.b * p.b) + '+' + n(p.c * p.c) + '} ' + q(r.d) + '$.');
    } else if (type === 'hasab') {
      s.push('**Alapterület** (szabályos ' + p.n + '-szög, $n$ egyenlő szárú háromszögre bontva): $T = \\dfrac{n a^2}{4\\,\\mathrm{tg}\\frac{180^\\circ}{n}} = \\dfrac{' + p.n + '\\cdot ' + n(p.a) + '^2}{4\\,\\mathrm{tg}\\,' + n(180 / p.n, 2) + '^\\circ} ' + q(r.T) + '$.');
      s.push('**Palást** ($n$ darab $a\\times m$ téglalap): $P = n\\cdot a\\cdot m = ' + p.n + '\\cdot ' + n(p.a) + '\\cdot ' + n(p.m) + ' ' + q(r.P) + '$.');
      s.push('**Felszín:** $A = 2T + P = 2\\cdot ' + n(r.T) + ' + ' + n(r.P) + ' ' + q(r.A) + '$.');
      s.push('**Térfogat:** $V = T\\cdot m = ' + n(r.T) + '\\cdot ' + n(p.m) + ' ' + q(r.V) + '$.');
      s.push('**Oldallap átlója:** $f = \\sqrt{a^2+m^2} = \\sqrt{' + n(p.a * p.a) + '+' + n(p.m * p.m) + '} ' + q(r.fs) + '$.');
      s.push(p.n > 3 ? '**Leghosszabb testátló:** az alap leghosszabb átlója $D ' + q(r.D) + '$, így $d = \\sqrt{D^2+m^2} ' + q(r.d) + '$.' : 'A háromszög alapú hasábnak **nincs testátlója** (az alapnak nincs átlója).');
    } else if (type === 'henger') {
      s.push('**Alapterület:** $T = r^2\\pi = ' + n(p.r) + '^2\\pi ' + q(r.T) + '$.');
      s.push('**Palást** (kiterítve $2r\\pi \\times m$ téglalap): $P = 2r\\pi m = 2\\cdot ' + n(p.r) + '\\pi\\cdot ' + n(p.m) + ' ' + q(r.P) + '$.');
      s.push('**Felszín:** $A = 2r^2\\pi + 2r\\pi m = 2r\\pi(r+m) ' + q(r.A) + '$.');
      s.push('**Térfogat:** $V = r^2\\pi m = ' + n(p.r) + '^2\\pi\\cdot ' + n(p.m) + ' ' + q(r.V) + '$.');
      s.push('**Tengelymetszet** ($2r \\times m$ téglalap) átlója: $\\sqrt{(2r)^2+m^2} ' + q(r.d) + '$.');
    } else if (type === 'gula') {
      var g = r.ngon;
      s.push('**Alapterület** (szabályos ' + p.n + '-szög): $T = \\dfrac{n a^2}{4\\,\\mathrm{tg}\\frac{180^\\circ}{n}} ' + q(r.T) + '$. Az alap beírt körének sugara $\\rho = \\dfrac{a}{2\\,\\mathrm{tg}\\frac{180^\\circ}{n}} ' + q(g.r) + '$, a körülírt köré $R = \\dfrac{a}{2\\sin\\frac{180^\\circ}{n}} ' + q(g.R) + '$.');
      s.push('**Oldalmagasság** a TOF derékszögű háromszögből: $m_o = \\sqrt{m^2+\\rho^2} = \\sqrt{' + n(p.m) + '^2+' + n(g.r) + '^2} ' + q(r.mf) + '$.');
      s.push('**Oldalél** a TOA derékszögű háromszögből: $e = \\sqrt{m^2+R^2} = \\sqrt{' + n(p.m) + '^2+' + n(g.R) + '^2} ' + q(r.e) + '$.');
      s.push('**Palást** ($n$ egybevágó egyenlő szárú háromszög): $P = n\\cdot\\dfrac{a\\cdot m_o}{2} = ' + p.n + '\\cdot\\dfrac{' + n(p.a) + '\\cdot ' + n(r.mf) + '}{2} ' + q(r.P) + '$.');
      s.push('**Felszín:** $A = T + P = ' + n(r.T) + '+' + n(r.P) + ' ' + q(r.A) + '$.');
      s.push('**Térfogat:** $V = \\dfrac{T\\cdot m}{3} = \\dfrac{' + n(r.T) + '\\cdot ' + n(p.m) + '}{3} ' + q(r.V) + '$ (az azonos alapú, azonos magasságú hasáb harmada).');
      s.push('**Oldallap és alaplap hajlásszöge** ($\\alpha$, a TOF háromszögben F-nél): $\\mathrm{tg}\\,\\alpha = \\dfrac{m}{\\rho} = \\dfrac{' + n(p.m) + '}{' + n(g.r) + '}$, $\\alpha ' + deg(r.alpha) + '$.');
      s.push('**Oldalél és alaplap hajlásszöge** ($\\beta$, a TOA háromszögben A-nál): $\\mathrm{tg}\\,\\beta = \\dfrac{m}{R} = \\dfrac{' + n(p.m) + '}{' + n(g.R) + '}$, $\\beta ' + deg(r.beta) + '$.');
    } else if (type === 'kup') {
      s.push('**Alapterület:** $T = r^2\\pi = ' + n(p.r) + '^2\\pi ' + q(r.T) + '$.');
      s.push('**Alkotó** a TOP derékszögű háromszögből: $a = \\sqrt{r^2+m^2} = \\sqrt{' + n(p.r * p.r) + '+' + n(p.m * p.m) + '} ' + q(r.alk) + '$.');
      s.push('**Palást** (kiterítve $a$ sugarú körcikk): $P = r\\pi a = ' + n(p.r) + '\\pi\\cdot ' + n(r.alk) + ' ' + q(r.P) + '$.');
      s.push('**Felszín:** $A = r^2\\pi + r\\pi a = r\\pi(r+a) ' + q(r.A) + '$.');
      s.push('**Térfogat:** $V = \\dfrac{r^2\\pi m}{3} = \\dfrac{' + n(p.r) + '^2\\pi\\cdot ' + n(p.m) + '}{3} ' + q(r.V) + '$.');
      s.push('**Alkotó és alaplap hajlásszöge:** $\\mathrm{tg}\\,\\alpha = \\dfrac{m}{r}$, $\\alpha ' + deg(r.alpha) + '$; a kúp **nyílásszöge** $2\\cdot\\mathrm{arctg}\\dfrac{r}{m} ' + deg(r.nyilas) + '$.');
    } else if (type === 'csonkagula') {
      if (Math.abs(p.a - p.c) < 1e-12) s.push('Mivel $a = c$, ez a test valójában **négyzetes oszlop** (hasáb); a képletek ekkor is érvényesek.');
      else if (p.c > p.a) s.push('Most a felső alapél a nagyobb: a test „fejjel lefelé” áll, a képletek szimmetrikusak, ugyanúgy érvényesek.');
      s.push('**Alaplapok:** $T = a^2 ' + q(r.T) + '$, $t = c^2 ' + q(r.t) + '$.');
      s.push('**Oldalmagasság** (az $OFF_1O_1$ derékszögű trapézból): $m_o = \\sqrt{m^2+\\left(\\tfrac{a-c}{2}\\right)^2} = \\sqrt{' + n(p.m) + '^2+' + n(Math.abs(p.a - p.c) / 2) + '^2} ' + q(r.mf) + '$.');
      s.push('**Oldalél:** $e = \\sqrt{m^2+\\left(\\tfrac{(a-c)\\sqrt2}{2}\\right)^2} ' + q(r.e) + '$.');
      s.push('**Palást** (4 egybevágó szimmetrikus trapéz): $P = 4\\cdot\\dfrac{(a+c)\\,m_o}{2} = 4\\cdot\\dfrac{(' + n(p.a) + '+' + n(p.c) + ')\\cdot ' + n(r.mf) + '}{2} ' + q(r.P) + '$.');
      s.push('**Felszín:** $A = T + t + P = ' + n(r.T) + '+' + n(r.t) + '+' + n(r.P) + ' ' + q(r.A) + '$.');
      s.push('**Térfogat:** $V = \\dfrac{m}{3}\\left(T+\\sqrt{Tt}+t\\right) = \\dfrac{' + n(p.m) + '}{3}\\left(' + n(r.T) + '+' + n(Math.sqrt(r.T * r.t)) + '+' + n(r.t) + '\\right) ' + q(r.V) + '$.');
      s.push('**Testátló:** $d = \\sqrt{m^2+\\left(\\tfrac{(a+c)\\sqrt2}{2}\\right)^2} ' + q(r.d) + '$.');
      s.push('**Oldallap és alaplap hajlásszöge:** $\\mathrm{tg}\\,\\alpha = \\dfrac{m}{(a-c)/2}$, $\\alpha ' + deg(r.alpha) + '$; **oldalél és alaplap hajlásszöge:** $\\mathrm{tg}\\,\\beta = \\dfrac{m}{(a-c)\\sqrt2/2}$, $\\beta ' + deg(r.beta) + '$.');
    } else if (type === 'csonkakup') {
      if (Math.abs(p.R - p.r) < 1e-12) s.push('Mivel $R = r$, ez a test valójában **henger**; a képletek ekkor is érvényesek.');
      s.push('**Alaplapok:** $T = R^2\\pi ' + q(r.T) + '$, $t = r^2\\pi ' + q(r.t) + '$.');
      s.push('**Alkotó** (a tengelymetszet trapézából): $a = \\sqrt{m^2+(R-r)^2} = \\sqrt{' + n(p.m) + '^2+' + n(Math.abs(p.R - p.r)) + '^2} ' + q(r.alk) + '$.');
      s.push('**Palást:** $P = (R+r)\\pi a = (' + n(p.R) + '+' + n(p.r) + ')\\pi\\cdot ' + n(r.alk) + ' ' + q(r.P) + '$.');
      s.push('**Felszín:** $A = R^2\\pi + r^2\\pi + (R+r)\\pi a ' + q(r.A) + '$.');
      s.push('**Térfogat:** $V = \\dfrac{m\\pi}{3}\\left(R^2+Rr+r^2\\right) = \\dfrac{' + n(p.m) + '\\pi}{3}\\left(' + n(p.R * p.R) + '+' + n(p.R * p.r) + '+' + n(p.r * p.r) + '\\right) ' + q(r.V) + '$.');
      s.push('**Alkotó és alaplap hajlásszöge:** $\\mathrm{tg}\\,\\alpha = \\dfrac{m}{R-r}$, $\\alpha ' + deg(r.alpha) + '$.');
    } else {
      s.push('A gömbnek nincs alaplapja és palástja: a teljes felülete a **felszín**.');
      s.push('**Felszín:** $A = 4R^2\\pi = 4\\cdot ' + n(p.R) + '^2\\pi ' + q(r.A) + '$.');
      s.push('**Térfogat:** $V = \\dfrac{4R^3\\pi}{3} = \\dfrac{4\\cdot ' + n(p.R) + '^3\\pi}{3} ' + q(r.V) + '$.');
    }
    return s;
  };

  MO.simDefs.push({
    id: 'testek', title: 'Testek felszíne és térfogata', group: 'térgeometria', topic: 'geometria', sub: 'felszinterfogat',
    desc: 'Forgatható hasáb, henger, gúla, kúp, csonkagúla, csonkakúp és gömb: felszín, térfogat, hajlásszögek lépésenként, kiemelt segédháromszöggel.',
    formulas: ['geo-hasab-henger', 'geo-gula-kup', 'geo-csonkagula', 'geo-csonkakup', 'geo-gomb'],
    build: function (kit) {
      var n = kit.el('<div><div class="row">' + kit.select('test', 'test', SOLIDS, 'gula') +
        kit.select('kiem', 'kiemelt segédháromszög', [['1', 'oldallap / alkotó / lapátló'], ['2', 'oldalél / testátló'], ['0', 'nincs']], '1') + '</div>' +
        kit.plotBox(300) + '<p class="dim" style="margin:6px 0 10px;font-size:13px">Húzd az ábrát a forgatáshoz. A narancs, szaggatott háromszög a számoláshoz használt segédháromszög.</p>' +
        kit.slider('n', 'az alap oldalszáma (n)', 3, 8, 1, 4) + kit.slider('a', 'a', 1, 10, 0.5, 6) + kit.slider('b', 'b', 1, 10, 0.5, 3) + kit.slider('m', 'm', 1, 12, 0.5, 4) +
        '<div class="out" role="status" aria-live="polite"></div>' +
        '<div class="row" style="margin-top:12px">' +
        '<button class="btn sm" type="button" data-preset="gula|6|3|4|4|1">gúla: oldallap hajlásszöge</button>' +
        '<button class="btn sm" type="button" data-preset="gula|6|3|5|3|2">háromoldalú gúla: oldalél szöge</button>' +
        '<button class="btn sm" type="button" data-preset="teglatest|3|4|12|4|2">téglatest testátlója</button>' +
        '<button class="btn sm" type="button" data-preset="kup|3|3|4|4|1">kúp: alkotó, palást</button>' +
        '<button class="btn sm" type="button" data-preset="csonkakup|6|3|4|4|1">csonkakúp térfogata</button>' +
        '</div></div>');
      var p3 = null, out = kit.$('.out', n), selT = kit.$('[data-sel="test"]', n), selK = kit.$('[data-sel="kiem"]', n), last = null;
      function upd(v) {
        last = v || last; if (!p3 || !last) return; v = last;
        var type = selT.value, lab = SLIDER_LABELS[type];
        ['a', 'b', 'm', 'n'].forEach(function (id, i) { setLabel(n, kit, id, lab[i], !!lab[i]); });
        var p = testekParams(type, v), r = M.tergeoCalc(type, p), mesh = M.tergeoMesh(type, p, 32), hk = selK.value;
        p3.setScene(M.tergeoScene(mesh, { hl: hk === '0' ? 0 : +hk }));
        var kv = '<dl class="kv">' + (r.T !== undefined ? '<dt>alapterület</dt><dd>' + kit.tex('T ' + fmt(kit).q(r.T)) + '</dd>' : '') +
          (r.P !== undefined ? '<dt>palást</dt><dd>' + kit.tex('P ' + fmt(kit).q(r.P)) + '</dd>' : '') +
          '<dt>felszín</dt><dd>' + kit.tex('A ' + fmt(kit).q(r.A)) + '</dd><dt>térfogat</dt><dd>' + kit.tex('V ' + fmt(kit).q(r.V)) + '</dd></dl>';
        out.innerHTML = kv + kit.steps(M.tergeoSteps(kit, type, p, r));
      }
      setTimeout(function () {
        p3 = kit.mkPlot3d(kit.$('.plotbox', n), { points: [], edges: [], faces: [] }, { az: 0.45, el: 0.38 });
        kit.bindSliders(n, upd);
      }, 0);
      kit.on(selT, 'change', function () { upd(); }); kit.on(selK, 'change', function () { upd(); });
      kit.$$('[data-preset]', n).forEach(function (b) {
        kit.on(b, 'click', function () {
          var s = b.dataset.preset.split('|'); selT.value = s[0]; setIn(n, kit, 'a', s[1]); setIn(n, kit, 'b', s[2]); setIn(n, kit, 'm', s[3]); setIn(n, kit, 'n', s[4]); selK.value = s[5]; fire(n, kit);
        });
      });
      return n;
    }
  });

  /* ---------- 2. Kiterített háló ---------- */
  var NETS = [['kocka', 'kocka'], ['teglatest', 'téglatest'], ['hasab3', 'szabályos háromszög alapú hasáb'], ['hasab4', 'négyzet alapú hasáb'], ['henger', 'forgáshenger'], ['gula4', 'szabályos négyzet alapú gúla'], ['kup', 'forgáskúp']];
  var NET_LABELS = { kocka: ['él (a)', '', ''], teglatest: ['a él', 'b él', 'c él'], hasab3: ['alapél (a)', '', 'magasság (m)'], hasab4: ['alapél (a)', '', 'magasság (m)'],
    henger: ['sugár (r)', '', 'magasság (m)'], gula4: ['alapél (a)', '', 'testmagasság (m)'], kup: ['sugár (r)', '', 'magasság (m)'] };
  function netParams(type, v) {
    if (type === 'kocka') return { a: v.a };
    if (type === 'teglatest') return { a: v.a, b: v.b, c: v.m };
    if (type === 'henger' || type === 'kup') return { r: v.a, m: v.m };
    return { a: v.a, m: v.m };
  }
  MO.simDefs.push({
    id: 'kiteritett-halo', title: 'Kiterített háló', group: 'térgeometria', topic: 'geometria', sub: 'felszinterfogat',
    desc: 'A test és a síkba kiterített hálója egymás mellett: a felszín a háló lapjainak területösszege. A kúp palástja körcikk, a hengeré téglalap.',
    formulas: ['geo-hasab-henger', 'geo-gula-kup'],
    build: function (kit) {
      var n = kit.el('<div>' + kit.select('test', 'test', NETS, 'kup') +
        '<div style="display:grid;gap:12px;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));margin-top:10px"><div class="b3">' + kit.plotBox(300) +
        '<p class="dim" style="margin:4px 0 0;font-size:13px">a test (húzással forgatható)</p></div><div class="b2">' + kit.plotBox(300) +
        '<p class="dim" style="margin:4px 0 0;font-size:13px">a kiterített háló (kék: alaplapok, szürke: oldallapok / palást)</p></div></div>' +
        kit.slider('a', 'a', 1, 8, 0.5, 3) + kit.slider('b', 'b', 1, 8, 0.5, 2) + kit.slider('m', 'm', 1, 10, 0.5, 4) +
        '<div class="out" role="status" aria-live="polite"></div>' +
        '<div class="row" style="margin-top:12px">' +
        '<button class="btn sm" type="button" data-preset="kup|3|2|4">kúp: körcikk szöge</button>' +
        '<button class="btn sm" type="button" data-preset="henger|2|2|5">henger: palást téglalap</button>' +
        '<button class="btn sm" type="button" data-preset="gula4|6|2|4">négyzet alapú gúla hálója</button>' +
        '<button class="btn sm" type="button" data-preset="teglatest|3|4|5">téglatest hálója</button>' +
        '</div></div>');
      var p3 = null, p2 = null, out = kit.$('.out', n), selT = kit.$('[data-sel="test"]', n), last = null;
      function upd(v) {
        last = v || last; if (!p3 || !p2 || !last) return; v = last;
        var type = selT.value, lab = NET_LABELS[type];
        ['a', 'b', 'm'].forEach(function (id, i) { setLabel(n, kit, id, lab[i], !!lab[i]); });
        var p = netParams(type, v), so = M.tergeoNetSolid(type, p), r = M.tergeoCalc(so.t, so.p), net = M.tergeoNet(type, p), F = fmt(kit);
        p3.setScene(M.tergeoScene(M.tergeoMesh(so.t, so.p, 32), {}));
        var x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
        net.faces.forEach(function (f) { f.pts.forEach(function (q) { x0 = Math.min(x0, q[0]); x1 = Math.max(x1, q[0]); y0 = Math.min(y0, q[1]); y1 = Math.max(y1, q[1]); }); });
        var pad = 0.08 * Math.max(x1 - x0, y1 - y0), cv = kit.$('.b2 canvas', n), asp = cv && cv.clientWidth ? cv.clientHeight / cv.clientWidth : 1;
        x0 -= pad; x1 += pad; y0 -= pad; y1 += 2.5 * pad; /* felül hely a nagyító gomboknak */
        if ((y1 - y0) / (x1 - x0) > asp) { var cx0 = (x0 + x1) / 2, hw = (y1 - y0) / asp / 2; x0 = cx0 - hw; x1 = cx0 + hw; } pad = 0;
        var labels = net.labels.slice();
        net.faces.forEach(function (f) {
          if (f.pts.length > 8 && f.kind === 'oldal' && type === 'kup') return;
          var cx = 0, cy = 0; f.pts.forEach(function (q) { cx += q[0]; cy += q[1]; }); cx /= f.pts.length; cy /= f.pts.length;
          labels.push({ x: cx, y: cy, text: MO.num(f.area, 2), align: 'center' });
        });
        if (type === 'kup') labels.push({ x: 0, y: -0.7 * net.groups[1].R, text: MO.num(net.faces[0].area, 2), align: 'center' });
        p2.set({ xmin: x0 - pad, xmax: x1 + pad, ymin: y0 - pad, ymax: y1 + pad, equal: true, axes: false, grid: false, interactive: false,
          polys: net.faces.map(function (f) { return { pts: f.pts, fill: true, alpha: f.kind === 'alap' ? 0.22 : 0.1, color: f.kind === 'alap' ? 1 : 0, close: true, w: 1.5 }; }), labels: labels });
        var s = [], nn = F.n, qq = F.q, parts = [];
        net.groups.forEach(function (g) {
          var t;
          if (g.w !== undefined) t = (g.count > 1 ? g.count + '\\cdot ' : '') + '(' + nn(g.w) + '\\cdot ' + nn(g.h) + ')';
          else if (g.mf !== undefined) t = g.count + '\\cdot\\dfrac{' + nn(g.base) + '\\cdot ' + nn(g.mf) + '}{2}';
          else if (g.omega !== undefined) t = '\\dfrac{' + nn(g.omega, 2) + '^\\circ}{360^\\circ}\\cdot ' + nn(g.R) + '^2\\pi';
          else if (g.circ !== undefined) t = (g.count > 1 ? g.count + '\\cdot ' : '') + nn(g.circ) + '^2\\pi';
          else if (g.tri !== undefined) t = (g.count > 1 ? g.count + '\\cdot ' : '') + '\\dfrac{\\sqrt3}{4}\\cdot ' + nn(g.tri) + '^2';
          else t = (g.count > 1 ? g.count + '\\cdot ' : '') + nn(g.each);
          s.push('**' + g.name.charAt(0).toUpperCase() + g.name.slice(1) + ':** $' + t + ' ' + qq(g.count * g.each) + '$.');
          parts.push(nn(g.count * g.each));
        });
        if (type === 'henger') s.unshift('A henger palástja kiterítve **téglalap**: egyik oldala az alapkör kerülete, $2r\\pi = 2\\cdot ' + nn(p.r) + '\\pi ' + qq(2 * Math.PI * p.r) + '$, a másik a magasság, $m = ' + nn(p.m) + '$.');
        if (type === 'kup') s.unshift('A kúp palástja kiterítve **körcikk**: sugara az alkotó, $a = \\sqrt{r^2+m^2} ' + qq(r.alk) + '$; ívhossza az alapkör kerülete, ezért a középponti szöge $\\omega = 360^\\circ\\cdot\\dfrac{r}{a} = 360^\\circ\\cdot\\dfrac{' + nn(p.r) + '}{' + nn(r.alk) + '} ' + F.deg(r.omega) + '$.');
        if (type === 'gula4') s.unshift('Az oldallapok egyenlő szárú háromszögek, magasságuk az oldalmagasság: $m_o = \\sqrt{m^2+\\left(\\tfrac a2\\right)^2} ' + qq(r.mf) + '$.');
        s.push('**Felszín** = a háló területe: $A = ' + parts.join(' + ') + ' ' + qq(net.A) + '$. Ugyanez a képletből: $A ' + qq(r.A) + '$.');
        out.innerHTML = '<div class="ans">' + kit.tex('A ' + qq(net.A)) + '</div>' + kit.steps(s);
      }
      setTimeout(function () {
        p3 = kit.mkPlot3d(kit.$('.b3 .plotbox', n), { points: [], edges: [], faces: [] }, { az: 0.45, el: 0.38 });
        p2 = kit.mkPlot(kit.$('.b2 .plotbox', n), { equal: true, axes: false, grid: false, interactive: false });
        kit.bindSliders(n, upd);
      }, 0);
      kit.on(selT, 'change', function () { upd(); });
      kit.$$('[data-preset]', n).forEach(function (b) {
        kit.on(b, 'click', function () { var s = b.dataset.preset.split('|'); selT.value = s[0]; setIn(n, kit, 'a', s[1]); setIn(n, kit, 'b', s[2]); setIn(n, kit, 'm', s[3]); fire(n, kit); });
      });
      return n;
    }
  });

  /* ---------- 3. Síkmetszetek ---------- */
  var CUTS = [['kocka', 'kocka'], ['teglatest', 'téglatest'], ['gula', 'szabályos négyzet alapú gúla'], ['henger', 'forgáshenger'], ['kup', 'forgáskúp'], ['gomb', 'gömb']];
  var MODES = [['par', 'párhuzamos az alaplappal'], ['atlos', 'átlós, merőleges az alaplapra'], ['testatlo', 'merőleges a testátlóra'], ['ferde', 'ferde (dőlésszög és irány)']];
  var CUT_LABELS = { kocka: ['él (a)', '', ''], teglatest: ['a él', 'b él', 'c él'], gula: ['alapél (a)', '', 'magasság (m)'], henger: ['sugár (r)', '', 'magasság (m)'], kup: ['sugár (r)', '', 'magasság (m)'], gomb: ['sugár (R)', '', ''] };
  function cutParams(type, v) {
    if (type === 'kocka') return { a: v.a };
    if (type === 'teglatest') return { a: v.a, b: v.b, c: v.m };
    if (type === 'gula') return { a: v.a, m: v.m };
    if (type === 'gomb') return { R: v.a };
    return { r: v.a, m: v.m };
  }
  MO.simDefs.push({
    id: 'sikmetszet', title: 'Síkmetszetek', group: 'térgeometria', topic: 'geometria', sub: 'alakzatok',
    desc: 'Metszd el a kockát, téglatestet, gúlát, hengert, kúpot vagy gömböt egy állítható síkkal: a metszet alakja, kerülete és területe, a hasonlóság aránya.',
    formulas: ['geo-hasonlo-arany', 'geo-gomb'],
    build: function (kit) {
      var n = kit.el('<div><div class="row">' + kit.select('test', 'test', CUTS, 'kocka') + kit.select('mod', 'metsző sík', MODES, 'testatlo') + '</div>' +
        kit.plotBox(300) + '<p class="dim" style="margin:6px 0 10px;font-size:13px">Húzd az ábrát a forgatáshoz. A metszet narancs színnel kitöltve.</p>' +
        kit.slider('a', 'a', 1, 10, 0.5, 4) + kit.slider('b', 'b', 1, 10, 0.5, 3) + kit.slider('m', 'm', 1, 12, 0.5, 6) +
        kit.slider('h', 'a sík helyzete (%)', 0, 100, 1, 50) + kit.slider('th', 'dőlésszög az alaplaphoz (°)', 0, 80, 1, 30) + kit.slider('ph', 'a dőlés iránya (°)', 0, 180, 5, 30) +
        '<div class="out" role="status" aria-live="polite"></div>' +
        '<div class="row" style="margin-top:12px">' +
        '<button class="btn sm" type="button" data-preset="kocka|testatlo|4|50">kocka: szabályos hatszög</button>' +
        '<button class="btn sm" type="button" data-preset="kocka|atlos|4|50">kocka: átlós metszet</button>' +
        '<button class="btn sm" type="button" data-preset="kocka|testatlo|4|20">kocka: levágott sarok</button>' +
        '<button class="btn sm" type="button" data-preset="gula|par|6|50">gúla: a magasság felénél</button>' +
        '<button class="btn sm" type="button" data-preset="kup|par|3|25">kúp: λ³ térfogatarány</button>' +
        '<button class="btn sm" type="button" data-preset="gomb|par|5|80">gömb: metszetkör</button>' +
        '</div></div>');
      var p3 = null, out = kit.$('.out', n), selT = kit.$('[data-sel="test"]', n), selM = kit.$('[data-sel="mod"]', n), last = null;
      function upd(v) {
        last = v || last; if (!p3 || !last) return; v = last;
        var type = selT.value, mode = selM.value, lab = CUT_LABELS[type], F = fmt(kit), nn = F.n, q = F.q;
        ['a', 'b', 'm'].forEach(function (id, i) { setLabel(n, kit, id, lab[i], !!lab[i]); });
        setLabel(n, kit, 'h', mode === 'par' ? 'a sík magassága az alaplaptól (a teljes magasság %-a)' : mode === 'atlos' ? 'a sík eltolása az átlótól (%; 50 = az átlón át)' : mode === 'testatlo' ? 'a sík helye a testátlón (%; 50 = a középpont)' : 'a sík a tengelyt ennyi %-os magasságban metszi', true);
        setLabel(n, kit, 'th', 'dőlésszög az alaplaphoz (°)', mode === 'ferde'); setLabel(n, kit, 'ph', 'a dőlés iránya (°)', mode === 'ferde');
        var p = cutParams(type, v), so = M.tergeoSolidOf(type, p), pos = v.h / 100, res = M.tergeoCut(type, p, mode, pos, v.th, v.ph);
        var mesh = M.tergeoMesh(so.t, so.p, 32);
        var sc = M.tergeoScene(mesh, { section: res.ok ? res.pts : null, noLabels: true });
        if (so.t === 'teglatest' && (mode === 'testatlo' || mode === 'atlos')) { /* a testátló vagy az alaplap átlója szaggatottan */
          var dz = mesh.H / 2, A = [-so.p.a / 2, -so.p.b / 2, -dz], G = [so.p.a / 2, so.p.b / 2, mode === 'atlos' ? -dz : dz], b0 = sc.points.length;
          sc.points.push(A, G); sc.edges.push({ v: [b0, b0 + 1], color: 1, dash: true, w: 2 }); sc.labels.push({ i: b0, text: 'A' }, { i: b0 + 1, text: mode === 'atlos' ? 'C' : 'G' });
        }
        p3.setScene(sc);
        var s = [];
        if (!res.ok) { out.innerHTML = '<p class="msg bad">' + kit.esc(res.msg) + '</p>'; return; }
        var pl = res.plane, H = pl.H;
        if (mode === 'par') s.push('A sík párhuzamos az alaplappal, $' + nn(pos * H) + '$ magasan (a test magassága $' + nn(H) + '$).');
        else if (mode === 'atlos') s.push(so.t === 'teglatest' || so.t === 'gula' ? 'A sík merőleges az alaplapra és párhuzamos az alaplap egyik átlójával; az átlótól mért távolsága $' + nn(Math.abs(pl.s)) + '$.' : 'A sík merőleges az alaplapra (párhuzamos a tengellyel), a tengelytől mért távolsága $' + nn(Math.abs(pl.s)) + '$.');
        else if (mode === 'testatlo') s.push('A sík merőleges az $AG$ testátlóra, és azt az $A$ csúcstól a hossza $' + v.h + '\\%$-ánál metszi.');
        else s.push('A sík az alaplappal $' + v.th + '^\\circ$-os szöget zár be; a test tengelyét $' + nn(pos * H) + '$ magasan metszi.');
        if (so.t === 'teglatest' || (so.t === 'gula' && mode !== 'par')) {
          s.push('A metszet csúcsai a test **éleinek és a síknak a metszéspontjai**: most $' + res.k + '$ ilyen pont van. Ezeket a síkban a súlypontjuk körüli szög szerint sorba rendezve kapjuk a sokszöget.');
          s.push('Az oldalak: $' + res.sides.map(function (x) { return nn(x, 2); }).join(';\\ ') + '$, így a **kerület** $K ' + q(res.per, 2) + '$.');
          s.push('A **terület** a súlypontból húzott háromszögek területének összege: $T ' + q(res.area, 2) + '$.');
          if (type === 'kocka' && mode === 'testatlo' && Math.abs(pos - 0.5) < 1e-9) s.push('A középponton át: **szabályos hatszög**, oldala a lapátló fele, $\\tfrac{a\\sqrt2}{2}$; területe $\\tfrac{3\\sqrt3}{4}a^2 = \\tfrac{3\\sqrt3}{4}\\cdot ' + nn(p.a) + '^2 ' + q(3 * sqrt(3) / 4 * p.a * p.a, 2) + '$.');
          if (so.t === 'teglatest' && mode === 'atlos' && Math.abs(pos - 0.5) < 1e-9) s.push('Az átlón átmenő sík **átlós metszete** téglalap: oldalai az alaplap átlója, $\\sqrt{a^2+b^2} ' + q(sqrt(so.p.a * so.p.a + so.p.b * so.p.b), 2) + '$ és az oldalél, $' + nn(so.p.c) + '$.');
        } else if (so.t === 'gula') {
          var Vg = M.tergeoCalc('gula', so.p).V;
          s.push('A levágott kis gúla hasonló az eredetihez; a hasonlóság aránya a csúcstól mért magasságok aránya: $\\lambda = \\dfrac{m - z}{m} = \\dfrac{' + nn(H - pos * H) + '}{' + nn(H) + '} ' + q(res.lambda) + '$.');
          s.push('A metszet négyzet, oldala $\\lambda a ' + q(res.side) + '$, kerülete $K ' + q(res.per) + '$.');
          s.push('**Terület:** hasonló síkidomok területének aránya $\\lambda^2$: $T = \\lambda^2\\cdot a^2 = ' + nn(res.lambda * res.lambda) + '\\cdot ' + nn(p.a * p.a) + ' ' + q(res.area) + '$.');
          s.push('**Térfogat:** hasonló testeké $\\lambda^3$: a kis gúla $V_{\\text{kis}} = \\lambda^3 V = ' + nn(Math.pow(res.lambda, 3)) + '\\cdot ' + nn(Vg) + ' ' + q(res.Vsmall) + '$; a megmaradó csonkagúla térfogata $V - V_{\\text{kis}} ' + q(Vg - res.Vsmall) + '$.');
        } else if (so.t === 'gomb') {
          s.push('A gömb középpontjának távolsága a síktól $d ' + q(res.d) + '$.');
          s.push('A metszet mindig **kör**; sugara Pitagorasz-tétellel: $\\rho = \\sqrt{R^2-d^2} = \\sqrt{' + nn(p.R) + '^2-' + nn(res.d) + '^2} ' + q(res.rho) + '$.');
          s.push('Kerülete $K = 2\\rho\\pi ' + q(res.per, 2) + '$, területe $T = \\rho^2\\pi ' + q(res.area, 2) + '$.');
        } else if (res.shape === 'kör') {
          if (so.t === 'kup') {
            var Vk = M.tergeoCalc('kup', so.p).V;
            s.push('A levágott kis kúp hasonló az eredetihez: $\\lambda = \\dfrac{m - z}{m} ' + q(res.lambda) + '$, a metszetkör sugara $\\rho = \\lambda r ' + q(res.rho) + '$.');
            s.push('**Terület:** $T = \\lambda^2 r^2\\pi ' + q(res.area, 2) + '$, kerület $K = 2\\rho\\pi ' + q(res.per, 2) + '$.');
            s.push('**Térfogat:** a kis kúp $V_{\\text{kis}} = \\lambda^3 V = ' + nn(Math.pow(res.lambda, 3)) + '\\cdot ' + nn(Vk) + ' ' + q(res.Vsmall) + '$.');
          } else s.push('A metszet az alapkörrel egybevágó **kör**: $\\rho = r = ' + nn(p.r) + '$, $K = 2r\\pi ' + q(res.per, 2) + '$, $T = r^2\\pi ' + q(res.area, 2) + '$.');
        } else if (res.shape === 'téglalap') {
          s.push('A tengellyel párhuzamos sík a hengerből **téglalapot** vág ki: szélessége a körből kimetszett húr, $2\\sqrt{r^2-s^2} ' + q(res.w) + '$, magassága $m = ' + nn(p.m) + '$.');
          s.push('$K ' + q(res.per, 2) + '$, $T ' + q(res.area, 2) + '$.');
        } else if (res.shape === 'ellipszis' && res.ea) {
          s.push('A ferde sík a palástot zárt görbében metszi: **ellipszis**, kis féltengelye $r = ' + nn(p.r) + '$, nagy féltengelye $\\dfrac{r}{\\cos ' + v.th + '^\\circ} ' + q(res.ea) + '$.');
          s.push('Területe $T = ab\\pi ' + q(res.area, 2) + '$; kerülete (Ramanujan közelítésével) $K \\approx ' + nn(res.per, 2) + '$.');
        } else if (/egyenlő szárú/.test(res.shape)) {
          s.push('A tengelyen átmenő sík a kúpból a **tengelymetszetet** vágja ki: alapja $2r$, magassága $m$. $T = r\\cdot m ' + q(res.area, 2) + '$, $K = 2r + 2a ' + q(res.per, 2) + '$.');
        } else {
          s.push('A metszet határa görbe ív (és ha a sík az alaplapot is eléri, egy szakasz). Ennek pontos területét nem kell érettségin számolni; az ábra 120 oldalú közelítéséből: $T \\approx ' + nn(res.area, 2) + '$, $K \\approx ' + nn(res.per, 2) + '$.');
        }
        out.innerHTML = '<div class="ans">' + kit.md('**' + res.shape.charAt(0).toUpperCase() + res.shape.slice(1) + '** · $K ' + q(res.per, 2) + '$ · $T ' + q(res.area, 2) + '$') + '</div>' + kit.steps(s);
      }
      setTimeout(function () {
        p3 = kit.mkPlot3d(kit.$('.plotbox', n), { points: [], edges: [], faces: [] }, { az: 0.45, el: 0.38 });
        kit.bindSliders(n, upd);
      }, 0);
      kit.on(selT, 'change', function () { upd(); }); kit.on(selM, 'change', function () { upd(); });
      kit.$$('[data-preset]', n).forEach(function (b) {
        kit.on(b, 'click', function () { var s = b.dataset.preset.split('|'); selT.value = s[0]; selM.value = s[1]; setIn(n, kit, 'a', s[2]); setIn(n, kit, 'h', s[3]); fire(n, kit); });
      });
      return n;
    }
  });
})(typeof window !== 'undefined' ? window : globalThis);
