/* MATEK OS – a szimulációk DOM-független modelljei (Node-ban tesztelhetők). */
(function (root) {
  'use strict';
  var MO = root.MO = root.MO || {};
  var M = MO.models = {};

  /* Mértékegység-átváltó: minden egység szorzója az alapegységhez képest */
  M.units = {
    hossz: { base: 'm', u: { mm: 1e-3, cm: 1e-2, dm: 0.1, m: 1, km: 1000 } },
    'terület': { base: 'm²', u: { 'mm²': 1e-6, 'cm²': 1e-4, 'dm²': 1e-2, 'm²': 1, ha: 1e4, 'km²': 1e6 } },
    'térfogat': { base: 'm³', u: { 'mm³': 1e-9, 'cm³ (ml)': 1e-6, 'dl': 1e-4, 'dm³ (liter)': 1e-3, hl: 0.1, 'm³': 1 } },
    'tömeg': { base: 'kg', u: { g: 1e-3, dkg: 1e-2, kg: 1, t: 1000 } },
    'idő': { base: 's', u: { s: 1, min: 60, h: 3600, nap: 86400 } },
    'sebesség': { base: 'm/s', u: { 'm/s': 1, 'km/h': 1 / 3.6 } }
  };
  M.convert = function (cat, value, from, to) {
    var c = M.units[cat]; if (!c || !(from in c.u) || !(to in c.u)) return NaN;
    return value * c.u[from] / c.u[to];
  };

  /* Egymás utáni százalékos változások */
  M.percentChain = function (base, changes) {
    var steps = [], v = base, f = 1;
    changes.forEach(function (p) { var q = 1 + p / 100; v *= q; f *= q; steps.push({ p: p, factor: q, value: v }); });
    return { steps: steps, factor: f, total: (f - 1) * 100, value: v };
  };

  /* Két tört összege lépésekkel */
  M.fracSum = function (a, b, c, d) {
    var L = MO.lcm(b, d), x = a * L / b, y = c * L / d, res = MO.Q.make(x + y, L);
    return { lcm: L, x: x, y: y, top: x + y, res: res };
  };

  /* Adatsor alapmutatói és a kördiagram szögei */
  M.stats = function (v) {
    var n = v.length, sum = 0, i; for (i = 0; i < n; i++) sum += v[i];
    var s = v.slice().sort(function (p, q) { return p - q; });
    var med = n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2, mean = sum / n, ss = 0;
    for (i = 0; i < n; i++) ss += (v[i] - mean) * (v[i] - mean);
    return { n: n, sum: sum, mean: mean, median: med, min: s[0], max: s[n - 1], range: s[n - 1] - s[0], sd: Math.sqrt(ss / n),
      angles: v.map(function (x) { return sum ? 360 * x / sum : 0; }) };
  };

  /* Négyzetgyök egyszerűsítése: n = k^2 * m, m négyzetmentes */
  M.sqrtParts = function (n) {
    var k = 1, m = n;
    for (var i = 2; i * i <= m; i++) while (m % (i * i) === 0) { m /= i * i; k *= i; }
    return { k: k, m: m };
  };

  /* Másodfokú egyenlet: ax^2 + bx + c = 0 */
  M.quad = function (a, b, c) {
    if (a === 0) return { kind: 'notquad' };
    var D = b * b - 4 * a * c, r = { kind: D > 0 ? 'two' : D === 0 ? 'one' : 'none', D: D, vertex: { x: -b / (2 * a), y: c - b * b / (4 * a) }, sum: -b / a, prod: c / a };
    if (D >= 0) {
      var s = Math.sqrt(D);
      r.x1 = (-b - s) / (2 * a); r.x2 = (-b + s) / (2 * a);
      if (r.x1 > r.x2) { var t = r.x1; r.x1 = r.x2; r.x2 = t; }
      var ints = [a, b, c].every(function (v) { return v === Math.round(v); });
      if (ints) {
        r.sq = M.sqrtParts(D); r.rational = r.sq.m === 1 || D === 0;
        if (r.rational) { r.q1 = MO.Q.make(-b - s, 2 * a); r.q2 = MO.Q.make(-b + s, 2 * a); if (MO.Q.val(r.q1) > MO.Q.val(r.q2)) { var u = r.q1; r.q1 = r.q2; r.q2 = u; } }
      }
    }
    return r;
  };

  /* Kétismeretlenes lineáris egyenletrendszer: a1 x + b1 y = c1, a2 x + b2 y = c2 */
  M.lin2 = function (a1, b1, c1, a2, b2, c2) {
    var D = a1 * b2 - a2 * b1, Dx = c1 * b2 - c2 * b1, Dy = a1 * c2 - a2 * c1;
    if (D !== 0) return { kind: 'one', D: D, Dx: Dx, Dy: Dy, x: Dx / D, y: Dy / D };
    var zero1 = a1 === 0 && b1 === 0, zero2 = a2 === 0 && b2 === 0;
    if ((zero1 && c1 !== 0) || (zero2 && c2 !== 0)) return { kind: 'none', D: D, Dx: Dx, Dy: Dy };
    return { kind: Dx === 0 && Dy === 0 ? 'inf' : 'none', D: D, Dx: Dx, Dy: Dy };
  };

  /* Kamatos kamat: évenkénti tőkésítés, tábla a grafikonhoz */
  M.compound = function (P, ratePct, years) {
    var q = 1 + ratePct / 100, rows = [], v = P;
    for (var n = 0; n <= years; n++) { rows.push({ n: n, value: v }); v *= q; }
    return { q: q, rows: rows, final: rows[years].value, interest: rows[years].value - P };
  };
  /* Egyenletes törlesztés: a hitel minden időszak végén kamatozik, utána jön a részlet */
  M.annuity = function (L, ratePct, n) {
    var r = ratePct / 100, pay = r === 0 ? L / n : L * r / (1 - Math.pow(1 + r, -n)), rows = [], bal = L;
    for (var k = 1; k <= n; k++) { var intr = bal * r; bal = bal + intr - pay; rows.push({ k: k, interest: intr, principal: pay - intr, balance: Math.abs(bal) < 1e-6 ? 0 : bal }); }
    return { payment: pay, total: pay * n, rows: rows };
  };

  /* Előjeltábla: a zérushelyek által kijelölt intervallumokon a függvény előjele */
  M.signTable = function (f, a, b, roots) {
    var pts = [a].concat(roots.filter(function (r) { return r > a && r < b; })).concat([b]), out = [];
    for (var i = 0; i + 1 < pts.length; i++) {
      var m = (pts[i] + pts[i + 1]) / 2, v = f(m);
      out.push({ from: pts[i], to: pts[i + 1], sign: !isFinite(v) ? '?' : v > 0 ? '+' : v < 0 ? '−' : '0' });
    }
    return out;
  };

  /* Leitner-rendszer: 5 doboz, a dobozhoz tartozó ismétlési köz napokban. rating: 0 = nem tudtam, 1 = nehezen, 2 = tudtam */
  M.leitnerDays = [1, 2, 4, 8, 16];
  M.leitner = function (rec, rating, now) {
    var box = rec && rec.b ? rec.b : 1, DAY = 86400000;
    if (rating === 0) return { b: 1, due: now + 10 * 60000 };
    if (rating === 1) return { b: box, due: now + DAY };
    return { b: Math.min(5, box + 1), due: now + M.leitnerDays[box - 1] * DAY };
  };
  M.leitnerDue = function (rec, now) { return !rec || !rec.due || rec.due <= now; };

  if (typeof module !== 'undefined' && module.exports) module.exports = M;
})(typeof window !== 'undefined' ? window : globalThis);
