/* MATEK OS – közös segédek a feladatgenerátorokhoz és a tananyagfájlokhoz. DOM-független. */
(function (root) {
  'use strict';
  var MO = root.MO = root.MO || {};
  var G = MO.gens = MO.gens || {};
  var K = MO.taskKit = {
    R: String.raw,
    T: function (x, d) { return MO.tnum(x, d); },                       /* szám TeX-ben, tizedesvesszővel */
    B: function (x) { return MO.tbig(x); },                              /* ezres tagolással */
    fr: function (n, d) { return (n < 0 ? '-' : '') + '\\dfrac{' + Math.abs(n) + '}{' + d + '}'; },
    q: function (n, d) { return MO.Q.tex(MO.Q.make(n, d)); },            /* egyszerűsített tört TeX-ben */
    sgn: function (x) { return x < 0 ? '-' : '+'; },
    par: function (x) { return x < 0 ? '(' + MO.tnum(x) + ')' : MO.tnum(x); },   /* negatív szám zárójelben */
    /* ax^2 + bx + c rendezett alakja; a CAS is érti, a tex() TeX-alakot ad */
    poly: function (cs, v) {
      v = v || 'x'; var s = '', n = cs.length - 1;
      cs.forEach(function (c, i) {
        if (!c) return; var p = n - i, ab = Math.abs(c), nm = p === 0 ? '' : p === 1 ? v : v + '^' + p;
        s += (s ? (c < 0 ? '-' : '+') : (c < 0 ? '-' : '')) + (ab === 1 && nm ? '' : MO.num(ab)) + nm;
      });
      return s || '0';
    },
    tex: function (s) { return String(s).replace(/\^(\d+)/g, '^{$1}').replace(/(\d),(\d)/g, '$1{,}$2'); },
    /* feleletválasztós válasz: a helyes és a hibás válaszokat megkeveri */
    choice: function (r, correct, wrong) {
      var all = r.shuffle([correct].concat(wrong));
      return { type: 'choice', options: all, correct: all.indexOf(correct) };
    },
    def: function (id, topic, sub, level, title, gen) { G[id] = { id: id, topic: topic, sub: sub, level: level, title: title, gen: gen }; }
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = K;
})(typeof window !== 'undefined' ? window : globalThis);
