/* MATEK OS – mag: névtér, segédfüggvények, tárolás. DOM-független, Node-ban is fut. */
(function (root) {
  'use strict';
  var MO = root.MO = root.MO || {};

  /* ---------- számok ---------- */
  MO.gcd = function (a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var t = a % b; a = b; b = t; } return a; };
  MO.lcm = function (a, b) { return a / MO.gcd(a, b) * b; };

  /* Egzakt törtek */
  var Q = MO.Q = {
    make: function (n, d) {
      if (d === undefined) d = 1;
      if (d === 0) throw new Error('nulla nevező');
      if (d < 0) { n = -n; d = -d; }
      var g = MO.gcd(n, d) || 1;
      return { n: n / g, d: d / g };
    },
    add: function (a, b) { return Q.make(a.n * b.d + b.n * a.d, a.d * b.d); },
    sub: function (a, b) { return Q.make(a.n * b.d - b.n * a.d, a.d * b.d); },
    mul: function (a, b) { return Q.make(a.n * b.n, a.d * b.d); },
    div: function (a, b) { return Q.make(a.n * b.d, a.d * b.n); },
    val: function (a) { return a.n / a.d; },
    tex: function (a) {
      if (a.d === 1) return String(a.n);
      return (a.n < 0 ? '-' : '') + '\\dfrac{' + Math.abs(a.n) + '}{' + a.d + '}';
    },
    str: function (a) { return a.d === 1 ? String(a.n) : a.n + '/' + a.d; }
  };

  /* Szám kiírása magyar tizedesvesszővel, felesleges nullák nélkül */
  MO.num = function (x, digits) {
    if (!isFinite(x)) return '–';
    if (digits === undefined) digits = 6;
    var r = Math.round(x * Math.pow(10, digits)) / Math.pow(10, digits);
    if (Object.is(r, -0)) r = 0;
    var s = String(r);
    if (/e/.test(s)) s = r.toFixed(digits).replace(/0+$/, '').replace(/\.$/, '');
    return s.replace('.', ',');
  };
  /* Ugyanez TeX-ben (a vessző után nincs térköz) */
  MO.tnum = function (x, digits) { return MO.num(x, digits).replace(',', '{,}'); };
  /* Ezres tagolás szóközzel */
  MO.big = function (x) {
    var s = MO.num(x), p = s.split(',');
    p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return p.join(',');
  };
  MO.tbig = function (x) { return MO.big(x).replace(',', '{,}').replace(/ /g, '\\,'); };

  /* Determinisztikus véletlen (mulberry32) */
  MO.rng = function (seed) {
    var a = seed >>> 0;
    var r = function () {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      var t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
    r.int = function (lo, hi) { return lo + Math.floor(r() * (hi - lo + 1)); };
    r.pick = function (arr) { return arr[Math.floor(r() * arr.length)]; };
    r.nz = function (lo, hi) { var v = 0; while (v === 0) v = r.int(lo, hi); return v; };
    r.shuffle = function (arr) {
      var a2 = arr.slice();
      for (var i = a2.length - 1; i > 0; i--) { var j = Math.floor(r() * (i + 1)); var t = a2[i]; a2[i] = a2[j]; a2[j] = t; }
      return a2;
    };
    return r;
  };

  /* ---------- tárolás ---------- */
  var KEY = 'matekos.v1';
  var mem = null;
  function blank() {
    return { v: 1, state: {}, notes: {}, fav: {}, checked: {}, tasks: {}, errors: [], last: null, theme: 'dark', placement: null, cards: {}, exams: {} };
  }
  function ls() { try { return root.localStorage || null; } catch (e) { return null; } }
  MO.store = {
    load: function () {
      if (mem) return mem;
      mem = blank();
      try {
        var raw = ls() && ls().getItem(KEY);
        if (raw) { var o = JSON.parse(raw); for (var k in o) mem[k] = o[k]; }
      } catch (e) { /* sérült vagy nem elérhető tároló: üres állapottal indulunk */ }
      return mem;
    },
    save: function () {
      try { if (ls()) ls().setItem(KEY, JSON.stringify(mem)); } catch (e) { /* megtelt vagy tiltott */ }
    },
    get: function (k) { return MO.store.load()[k]; },
    set: function (k, v) { MO.store.load()[k] = v; MO.store.save(); },
    exportText: function () { return JSON.stringify(MO.store.load()); },
    importText: function (txt) {
      var o = JSON.parse(txt);
      if (!o || typeof o !== 'object' || o.v !== 1) throw new Error('Ez nem MATEK OS mentés.');
      var b = blank(); for (var k in b) if (o[k] !== undefined) b[k] = o[k];
      mem = b; MO.store.save();
    },
    reset: function () { mem = blank(); MO.store.save(); }
  };

  /* Hibatípusok a hibanaplóhoz */
  MO.errorTypes = ['számolási hiba', 'elvi hiba', 'értelmezési tartomány', 'feltétel kihagyva', 'rossz képlet', 'időhiány'];

  if (typeof module !== 'undefined' && module.exports) module.exports = MO;
})(typeof window !== 'undefined' ? window : globalThis);
