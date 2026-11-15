/* Számelmélet és logika: Euklideszi algoritmus, prímtényezők, szita, számrendszerek, igazságtábla, bizonyítási módszerek */
(function (root) {
  'use strict';
  var MO = root.MO = root.MO || {};
  var M = MO.models = MO.models || {};
  MO.simDefs = MO.simDefs || [];

  /* ====================== MODELLEK ====================== */
  var DIG = '0123456789ABCDEF';
  function bpow(b, e) { var r = BigInt(1), x = BigInt(b); for (var i = 0; i < e; i++) r *= x; return r; }

  M.szamelmeletGcd = function (a, b) { while (b) { var t = a % b; a = b; b = t; } return a; };
  M.szamelmeletLcm = function (a, b) { return (BigInt(a) / BigInt(M.szamelmeletGcd(a, b))) * BigInt(b); };
  M.szamelmeletEuclid = function (a, b) {
    var x = Math.max(a, b), y = Math.min(a, b), steps = [];
    while (y > 0) { var r = x % y; steps.push({ a: x, b: y, q: (x - r) / y, r: r }); x = y; y = r; }
    return { steps: steps, gcd: x };
  };

  M.szamelmeletFactor = function (n, maxIter) {
    maxIter = maxIter || 3000000;
    var fac = [], ladder = [], m = n, p = 2, it = 0;
    while (p * p <= m && it < maxIter) {
      if (m % p === 0) { var e = 0; while (m % p === 0) { ladder.push({ n: m, p: p }); m /= p; e++; } fac.push([p, e]); }
      p += (p === 2 ? 1 : 2); it++;
    }
    var complete = p * p > m;
    if (complete && m > 1) { ladder.push({ n: m, p: m }); fac.push([m, 1]); m = 1; }
    return { factors: fac, ladder: ladder, complete: complete, remaining: m };
  };
  M.szamelmeletValue = function (fac) { var v = BigInt(1); fac.forEach(function (f) { v *= bpow(f[0], f[1]); }); return v; };
  M.szamelmeletDivCount = function (fac) { var c = 1; fac.forEach(function (f) { c *= f[1] + 1; }); return c; };
  M.szamelmeletDivSum = function (fac) { var s = 1; fac.forEach(function (f) { var t = 0, pw = 1; for (var i = 0; i <= f[1]; i++) { t += pw; pw *= f[0]; } s *= t; }); return s; };
  M.szamelmeletDivisors = function (fac) {
    var d = [1]; fac.forEach(function (f) { var nd = [], pw = 1; for (var i = 0; i <= f[1]; i++) { d.forEach(function (x) { nd.push(x * pw); }); pw *= f[0]; } d = nd; });
    return d.sort(function (a, b) { return a - b; });
  };
  M.szamelmeletGcdLcm = function (fa, fb) {
    var ps = {}; fa.forEach(function (f) { ps[f[0]] = 1; }); fb.forEach(function (f) { ps[f[0]] = 1; });
    var list = Object.keys(ps).map(Number).sort(function (a, b) { return a - b; });
    function ex(fac, p) { for (var i = 0; i < fac.length; i++) if (fac[i][0] === p) return fac[i][1]; return 0; }
    var rows = [], g = [], l = [];
    list.forEach(function (p) { var x = ex(fa, p), y = ex(fb, p), mn = Math.min(x, y), mx = Math.max(x, y); rows.push({ p: p, ea: x, eb: y, min: mn, max: mx }); if (mn > 0) g.push([p, mn]); l.push([p, mx]); });
    return { rows: rows, gcd: g, lcm: l };
  };

  M.szamelmeletSieve = function (n) {
    var comp = [], steps = [], primes = [], p, m;
    for (p = 2; p * p <= n; p++) if (!comp[p]) { var cr = []; for (m = p * p; m <= n; m += p) if (!comp[m]) { comp[m] = true; cr.push(m); } steps.push({ p: p, crossed: cr }); }
    for (m = 2; m <= n; m++) if (!comp[m]) primes.push(m);
    return { n: n, steps: steps, primes: primes, root: Math.floor(Math.sqrt(n) + 1e-9) };
  };

  M.szamelmeletParse = function (str, base) {
    var s = String(str).replace(/[\s  ]/g, '').toUpperCase();
    if (!s) return { ok: false, err: 'Írj be egy számot.' };
    if (s.length > 20) return { ok: false, err: 'Legfeljebb 20 jegyű számot adj meg.' };
    var digits = [];
    for (var i = 0; i < s.length; i++) {
      var d = DIG.indexOf(s.charAt(i));
      if (d < 0 || d >= base) {
        var allowed = base <= 10 ? '0–' + (base - 1) : '0–9 és A–' + DIG.charAt(base - 1);
        return { ok: false, err: 'A(z) „' + s.charAt(i) + '” jegy nem szerepelhet a ' + base + ' alapú számrendszerben (megengedett jegyek: ' + allowed + ').' };
      }
      digits.push(d);
    }
    return { ok: true, digits: digits, base: base, text: s };
  };
  M.szamelmeletToDecimal = function (str, base) {
    var p = M.szamelmeletParse(str, base); if (!p.ok) return p;
    var rows = [], sum = BigInt(0), L = p.digits.length;
    p.digits.forEach(function (d, i) { var k = L - 1 - i, pw = bpow(base, k), prod = BigInt(d) * pw; sum += prod; rows.push({ d: d, k: k, pw: pw.toString(), prod: prod.toString(), sum: sum.toString() }); });
    return { ok: true, rows: rows, value: sum.toString(), base: base };
  };
  M.szamelmeletFromDecimal = function (v, base) {
    var x = BigInt(v), rows = [], b = BigInt(base);
    if (x === BigInt(0)) return { ok: true, rows: [], text: '0' };
    var rem = [];
    while (x > BigInt(0)) { var r = x % b, q = x / b; rows.push({ n: x.toString(), q: q.toString(), r: Number(r) }); rem.push(DIG.charAt(Number(r))); x = q; }
    return { ok: true, rows: rows, text: rem.reverse().join('') };
  };
  M.szamelmeletConvert = function (str, from, to) {
    var a = M.szamelmeletToDecimal(str, from); if (!a.ok) return a;
    var b = M.szamelmeletFromDecimal(a.value, to);
    return { ok: true, toDec: a, fromDec: b, value: a.value, result: b.text };
  };

  /* logikai elemző: ¬ > ∧ > ∨ > → (jobbra kötő) > ↔ */
  function tokenize(s) {
    var t = [], i = 0, c;
    while (i < s.length) {
      c = s.charAt(i);
      if (/\s/.test(c)) { i++; continue; }
      if (c === '(' || c === ')') { t.push({ k: c, pos: i + 1 }); i++; continue; }
      if (/[A-Da-d]/.test(c)) { t.push({ k: 'var', v: c.toUpperCase(), pos: i + 1 }); i++; continue; }
      if (c === '¬' || c === '!' || c === '~') { t.push({ k: 'not', pos: i + 1 }); i++; continue; }
      if (c === '∧' || c === '&') { t.push({ k: 'and', pos: i + 1 }); i += (c === '&' && s.charAt(i + 1) === '&') ? 2 : 1; continue; }
      if (c === '∨' || c === '|') { t.push({ k: 'or', pos: i + 1 }); i += (c === '|' && s.charAt(i + 1) === '|') ? 2 : 1; continue; }
      if (c === '→') { t.push({ k: 'imp', pos: i + 1 }); i++; continue; }
      if (c === '↔') { t.push({ k: 'iff', pos: i + 1 }); i++; continue; }
      if (s.substr(i, 3) === '<->') { t.push({ k: 'iff', pos: i + 1 }); i += 3; continue; }
      if (s.substr(i, 3) === '<=>') { t.push({ k: 'iff', pos: i + 1 }); i += 3; continue; }
      if (s.substr(i, 2) === '->') { t.push({ k: 'imp', pos: i + 1 }); i += 2; continue; }
      if (s.substr(i, 2) === '=>') { t.push({ k: 'imp', pos: i + 1 }); i += 2; continue; }
      if (/[A-Za-z]/.test(c)) throw { logic: 'Ismeretlen változó: „' + c + '”. Csak az A, B, C, D betűk használhatók.' };
      throw { logic: 'Ismeretlen jel a(z) ' + (i + 1) + '. helyen: „' + c + '”.' };
    }
    return t;
  }
  M.szamelmeletParseLogic = function (src) {
    var s = String(src == null ? '' : src);
    if (!s.replace(/\s/g, '')) return { ok: false, err: 'Írj be egy kifejezést.' };
    try {
      var tk = tokenize(s), pos = 0, vars = {};
      var peek = function () { return tk[pos]; };
      var parseIff = function () { var l = parseImp(); while (peek() && peek().k === 'iff') { pos++; l = { t: 'iff', l: l, r: parseImp() }; } return l; };
      var parseImp = function () { var l = parseOr(); if (peek() && peek().k === 'imp') { pos++; return { t: 'imp', l: l, r: parseImp() }; } return l; };
      var parseOr = function () { var l = parseAnd(); while (peek() && peek().k === 'or') { pos++; l = { t: 'or', l: l, r: parseAnd() }; } return l; };
      var parseAnd = function () { var l = parseNot(); while (peek() && peek().k === 'and') { pos++; l = { t: 'and', l: l, r: parseNot() }; } return l; };
      var parseNot = function () {
        var x = peek();
        if (!x) throw { logic: 'A kifejezés hirtelen véget ér: hiányzik egy változó vagy egy zárójeles kifejezés.' };
        if (x.k === 'not') { pos++; return { t: 'not', x: parseNot() }; }
        if (x.k === 'var') { pos++; vars[x.v] = 1; return { t: 'var', v: x.v }; }
        if (x.k === '(') {
          pos++; var e = parseIff(), y = peek();
          if (!y) throw { logic: 'Hiányzik a záró zárójel.' };
          if (y.k !== ')') throw { logic: 'Váratlan jel a(z) ' + y.pos + '. helyen: itt „)” kellene.' };
          pos++; return e;
        }
        if (x.k === ')') throw { logic: 'Üres vagy felesleges zárójel a(z) ' + x.pos + '. helyen.' };
        throw { logic: 'Hiányzik egy változó vagy zárójeles kifejezés a(z) ' + x.pos + '. helyen, a művelet előtt.' };
      };
      var ast = parseIff();
      if (pos < tk.length) {
        var z = tk[pos];
        if (z.k === ')') throw { logic: 'Felesleges „)” a(z) ' + z.pos + '. helyen: nincs hozzá nyitó zárójel.' };
        throw { logic: 'Két változó vagy kifejezés között hiányzik a művelet a(z) ' + z.pos + '. helyen.' };
      }
      return { ok: true, ast: ast, vars: Object.keys(vars).sort() };
    } catch (e) {
      if (e && e.logic) return { ok: false, err: e.logic };
      throw e;
    }
  };
  var PREC = { iff: 1, imp: 2, or: 3, and: 4, not: 5, 'var': 6 }, SYM = { iff: '↔', imp: '→', or: '∨', and: '∧' };
  function show(n) {
    if (n.t === 'var') return n.v;
    if (n.t === 'not') { var c = show(n.x); return '¬' + (PREC[n.x.t] < PREC.not ? '(' + c + ')' : c); }
    function side(ch, left) { var p = PREC[ch.t], q = PREC[n.t], w = p < q || (p === q && (n.t === 'iff' || (n.t === 'imp' && left))); var s = show(ch); return w ? '(' + s + ')' : s; }
    return side(n.l, true) + ' ' + SYM[n.t] + ' ' + side(n.r, false);
  }
  M.szamelmeletShowLogic = show;
  function evalL(n, env) {
    switch (n.t) {
      case 'var': return env[n.v];
      case 'not': return !evalL(n.x, env);
      case 'and': return evalL(n.l, env) && evalL(n.r, env);
      case 'or': return evalL(n.l, env) || evalL(n.r, env);
      case 'imp': return !evalL(n.l, env) || evalL(n.r, env);
      default: return evalL(n.l, env) === evalL(n.r, env);
    }
  }
  M.szamelmeletEvalLogic = evalL;
  function subs(n, out, seen) {
    if (n.t === 'var') return;
    if (n.t === 'not') subs(n.x, out, seen); else { subs(n.l, out, seen); subs(n.r, out, seen); }
    var s = show(n); if (!seen[s]) { seen[s] = 1; out.push({ text: s, node: n }); }
  }
  function envRows(vars) {
    var k = vars.length, rows = [];
    for (var r = 0; r < (1 << k); r++) { var env = {}; vars.forEach(function (v, j) { env[v] = !((r >> (k - 1 - j)) & 1); }); rows.push(env); }
    return rows;
  }
  M.szamelmeletTable = function (src) {
    var p = M.szamelmeletParseLogic(src); if (!p.ok) return p;
    var cols = []; subs(p.ast, cols, {});
    if (!cols.length) cols.push({ text: show(p.ast), node: p.ast });
    var rows = envRows(p.vars).map(function (env) { var c = cols.map(function (cl) { return evalL(cl.node, env); }); return { env: env, v: p.vars.map(function (x) { return env[x]; }), c: c, res: evalL(p.ast, env) }; });
    var tr = rows.filter(function (r) { return r.res; }).length;
    return { ok: true, ast: p.ast, text: show(p.ast), vars: p.vars, cols: cols, rows: rows, trueCount: tr, kind: tr === rows.length ? 'tautology' : tr === 0 ? 'contradiction' : 'neither' };
  };
  M.szamelmeletCompare = function (s1, s2) {
    var a = M.szamelmeletParseLogic(s1), b = M.szamelmeletParseLogic(s2);
    if (!a.ok) return { ok: false, err: 'Első kifejezés: ' + a.err };
    if (!b.ok) return { ok: false, err: 'Második kifejezés: ' + b.err };
    var vs = {}; a.vars.concat(b.vars).forEach(function (v) { vs[v] = 1; }); var vars = Object.keys(vs).sort(), diff = null;
    var rows = envRows(vars).map(function (env) { var x = evalL(a.ast, env), y = evalL(b.ast, env), r = { env: env, v: vars.map(function (q) { return env[q]; }), a: x, b: y, same: x === y }; if (!r.same && !diff) diff = r; return r; });
    return { ok: true, vars: vars, rows: rows, equal: !diff, diff: diff, textA: show(a.ast), textB: show(b.ast) };
  };

  M.szamelmeletInduction = function (kind, n) {
    var lhs = 0, i, terms = [];
    for (i = 1; i <= n; i++) { var t = kind === 'odd' ? 2 * i - 1 : i; lhs += t; terms.push(t); }
    var rhs = kind === 'odd' ? n * n : n * (n + 1) / 2;
    return { lhs: lhs, rhs: rhs, ok: lhs === rhs, terms: terms };
  };
  M.szamelmeletEuler = function (n) {
    var v = n * n + n + 41, d = 0;
    for (var i = 2; i * i <= v; i++) if (v % i === 0) { d = i; break; }
    return { value: v, prime: d === 0, divisor: d, cofactor: d ? v / d : 0 };
  };

  /* ====================== SEGÉDEK A FELÜLETHEZ ====================== */
  function grp(s) { s = String(s); var o = '', c = 0; for (var i = s.length - 1; i >= 0; i--) { o = s.charAt(i) + o; if (++c % 3 === 0 && i > 0) o = ' ' + o; } return o; }
  function gtex(s) { return grp(s).replace(/ /g, '\\,'); }
  function parseInt10(str, maxDigits) {
    var s = String(str).replace(/[\s  ]/g, '');
    if (!/^\d+$/.test(s)) return { ok: false, err: 'Pozitív egész számot írj be (csak számjegyekkel).' };
    s = s.replace(/^0+/, '') || '0';
    if (s.length > maxDigits) return { ok: false, err: 'Ez a szám túl nagy: legfeljebb ' + maxDigits + ' jegyű számot adj meg.' };
    if (s === '0') return { ok: false, err: 'A számnak pozitívnak kell lennie (0 nem megfelelő).' };
    return { ok: true, v: Number(s), s: s };
  }
  /* A „tananyag: …” címke (a keret rajzolja, nowrap) a hosszú alfejezetcímnél kilógna telefonon: a build után megengedjük a tördelést. */
  function fixTag() { setTimeout(function () { if (typeof document === 'undefined') return; var a = document.querySelectorAll('#main a.tag'); for (var i = 0; i < a.length; i++) { a[i].style.whiteSpace = 'normal'; a[i].style.borderRadius = '12px'; } }, 0); }
  function tin(key, label, val, extra) { return '<label class="f" style="flex:1;min-width:120px"><span>' + label + '</span><input type="text" inputmode="' + (extra || 'numeric') + '" data-k="' + key + '" value="' + val + '" autocomplete="off" autocapitalize="off" spellcheck="false"></label>'; }
  function setIn(kit, n, key, val) { var i = kit.$('[data-k="' + key + '"]', n); if (i) { i.value = val; i.dispatchEvent(new Event('input', { bubbles: true })); } }
  function setSel(kit, n, key, val) { var s = kit.$('[data-sel="' + key + '"]', n); if (s) { s.value = String(val); s.dispatchEvent(new Event('change', { bubbles: true })); } }
  function powTex(p, e) { return e === 1 ? String(p) : p + '^{' + e + '}'; }
  function canonTex(fac) { return fac.length ? fac.map(function (f) { return powTex(f[0], f[1]); }).join('\\cdot ') : '1'; }
  function table(head, rows) { return '<div class="tblwrap"><table class="t"><thead><tr>' + head.map(function (h) { return '<th>' + h + '</th>'; }).join('') + '</tr></thead><tbody>' + rows.map(function (r) { return '<tr>' + r.map(function (c) { return '<td>' + c + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table></div>'; }

  /* ====================== 1. EUKLIDESZI ALGORITMUS ====================== */
  MO.simDefs.push({
    id: 'euklidesz', title: 'Euklideszi algoritmus', group: 'számelmélet és logika', topic: 'algebra', sub: 'szamelmelet', formulas: ['a-lnko-lkkt'],
    desc: 'Két szám legnagyobb közös osztója maradékos osztások sorával, a legkisebb közös többszörös és a tört egyszerűsítése.',
    build: function (kit) {
      var n = kit.el('<div><div class="row">' + tin('a', 'a (pozitív egész)', '1071') + tin('b', 'b (pozitív egész)', '462') + '</div>' +
        '<div class="row" style="margin:10px 0 12px"><button class="btn sm" type="button" data-preset="1071,462">(1071; 462)</button><button class="btn sm" type="button" data-preset="126,210">tört egyszerűsítése: 126/210</button><button class="btn sm" type="button" data-preset="35,64">relatív prímek</button><button class="btn sm" type="button" data-preset="9876543210,1234567890">10 jegyű számok</button></div><div class="out"></div></div>');
      function upd() {
        var o = kit.$('.out', n), A = parseInt10(kit.$('[data-k="a"]', n).value, 10), B = parseInt10(kit.$('[data-k="b"]', n).value, 10);
        if (!A.ok) { o.innerHTML = '<p class="msg bad">a: ' + kit.esc(A.err) + '</p>'; return; }
        if (!B.ok) { o.innerHTML = '<p class="msg bad">b: ' + kit.esc(B.err) + '</p>'; return; }
        var a = A.v, b = B.v, E = M.szamelmeletEuclid(a, b), g = E.gcd, L = M.szamelmeletLcm(a, b).toString(), prod = (BigInt(a) * BigInt(b)).toString();
        var rows = E.steps.map(function (s, i) { return [i + 1, grp(s.a), grp(s.b), grp(s.q), grp(s.r), grp(s.a) + ' = ' + grp(s.q) + ' · ' + grp(s.b) + ' + ' + grp(s.r)]; });
        var h = '<div class="lab">maradékos osztások</div>' + table(['#', 'osztandó', 'osztó', 'hányados', 'maradék', 'a = q·b + r'], rows);
        h += '<div class="ans">' + kit.md('$(' + a + ';\\ ' + b + ') = ' + gtex(g) + '$ és $[' + a + ';\\ ' + b + '] = ' + gtex(L) + '$') + '</div>';
        var rel = g === 1 ? 'A két szám **relatív prím**, mert a legnagyobb közös osztójuk 1.' : 'A két szám nem relatív prím, közös osztójuk a ' + grp(g) + '.';
        var steps = [
          'A nagyobbik számot osztjuk a kisebbikkel, majd az osztót a maradékkal, és így tovább, amíg a maradék 0 nem lesz (' + E.steps.length + ' lépés).',
          'Az utolsó nem nulla maradék a legnagyobb közös osztó: $(' + a + ';\\ ' + b + ') = ' + gtex(g) + '$. ' + rel,
          'A legkisebb közös többszörös az $a\\cdot b = (a;\\ b)\\cdot[a;\\ b]$ összefüggésből: $a\\cdot b = ' + gtex(prod) + '$, ezért $[a;\\ b] = \\dfrac{' + gtex(prod) + '}{' + gtex(g) + '} = ' + gtex(L) + '$.'
        ];
        var a1 = a / g, b1 = b / g;
        if (b1 === 1) steps.push('A $\\dfrac{' + gtex(a) + '}{' + gtex(b) + '}$ tört a közös osztóval egyszerűsítve egész szám: $' + gtex(a1) + '$.');
        else if (g === 1) steps.push('A $\\dfrac{' + gtex(a) + '}{' + gtex(b) + '}$ tört nem egyszerűsíthető, mert $(a;\\ b) = 1$.');
        else steps.push('A $\\dfrac{' + gtex(a) + '}{' + gtex(b) + '}$ tört egyszerűsítése a legnagyobb közös osztóval: $\\dfrac{' + gtex(a) + '}{' + gtex(b) + '} = \\dfrac{' + gtex(a) + ' : ' + gtex(g) + '}{' + gtex(b) + ' : ' + gtex(g) + '} = \\dfrac{' + gtex(a1) + '}{' + gtex(b1) + '}$.');
        h += kit.steps(steps);
        o.innerHTML = h;
      }
      kit.$$('input', n).forEach(function (i) { kit.on(i, 'input', upd); });
      kit.$$('[data-preset]', n).forEach(function (b) { kit.on(b, 'click', function () { var s = b.dataset.preset.split(','); setIn(kit, n, 'a', s[0]); setIn(kit, n, 'b', s[1]); }); });
      upd(); fixTag();
      return n;
    }
  });

  /* ====================== 2. PRÍMTÉNYEZŐS FELBONTÁS ====================== */
  function factorBlock(kit, N, label) {
    var F = M.szamelmeletFactor(N.v), h = '';
    if (!F.complete) return '<p class="msg bad">A(z) ' + grp(N.s) + ' szám a próbaosztással a lépéskorlát miatt nem bontható fel teljesen; maradék tényező: ' + grp(F.remaining) + '.</p>';
    if (N.v === 1) return '<p class="msg ok">Az 1 nem prím és nem összetett szám, ezért nincs prímtényezős felbontása. Egyetlen osztója önmaga: az osztók száma 1.</p>';
    var fac = F.factors, cnt = M.szamelmeletDivCount(fac), sum = M.szamelmeletDivSum(fac);
    h += '<div class="lab">' + label + ': osztogatás („létra”)</div>';
    h += table(['szám', 'legkisebb prímosztó'], F.ladder.map(function (r) { return [grp(r.n), grp(r.p)]; }).concat([['1', '']]));
    var prime = fac.length === 1 && fac[0][1] === 1;
    h += '<div class="ans">' + kit.md('$' + gtex(N.s) + ' = ' + canonTex(fac) + '$') + (prime ? '<br>' + grp(N.s) + ' prímszám.' : '') + '</div>';
    var cT = fac.map(function (f) { return '(' + f[1] + '+1)'; }).join('\\cdot ');
    var sT = fac.map(function (f) { var p = f[0], e = f[1], t; if (e <= 4) { t = ['1']; for (var i = 1; i <= e; i++) t.push(powTex(p, i)); t = t.join('+'); } else t = '1+' + p + '+\\dots+' + p + '^{' + e + '}'; return '(' + t + ')'; }).join('\\cdot ');
    var st = [
      'Mindig a legkisebb lehetséges prímmel osztunk, amíg 1-et nem kapunk. A próbaosztás elég $\\sqrt{' + gtex(N.s) + '}\\approx ' + kit.tnum(Math.sqrt(N.v), 1) + '$-ig, mert ha egy szám összetett, van $\\sqrt{n}$-nél nem nagyobb prímosztója.',
      'Kanonikus alak: $' + gtex(N.s) + ' = ' + canonTex(fac) + '$.',
      'Az osztók száma a kitevők eggyel növelt értékének szorzata: $' + cT + ' = ' + cnt + '$.',
      'Az osztók összege: $' + sT + ' = ' + gtex(sum) + '$.'
    ];
    h += kit.steps(st);
    if (cnt <= 60) { var d = M.szamelmeletDivisors(fac); h += '<div class="lab" style="margin-top:10px">az osztók (' + cnt + ' db)</div><div class="cells">' + d.map(function (x) { return '<span>' + grp(x) + '</span>'; }).join('') + '</div>'; }
    else h += '<p class="dim">Az osztók listája nem fér ki: ' + cnt + ' osztó van (60-nál több).</p>';
    return h;
  }
  MO.simDefs.push({
    id: 'primtenyezok', title: 'Prímtényezős felbontás, osztók, lnko és lkkt', group: 'számelmélet és logika', topic: 'algebra', sub: 'szamelmelet', formulas: ['a-osztok-szama', 'a-lnko-lkkt'],
    desc: 'Prímtényezős felbontás létrával, az osztók száma és összege, két szám lnko-ja és lkkt-ja a prímtényezős alakból.',
    build: function (kit) {
      var n = kit.el('<div><div class="row">' + tin('n', 'n (legfeljebb 12 jegy)', '360') + tin('m', 'második szám (elhagyható)', '84') + '</div>' +
        '<div class="row" style="margin:10px 0 12px"><button class="btn sm" type="button" data-preset="360,84">360 és 84</button><button class="btn sm" type="button" data-preset="720,">osztók száma: 720</button><button class="btn sm" type="button" data-preset="999999999989,">nagy prím (12 jegy)</button><button class="btn sm" type="button" data-preset="1001,693">relatív prímek? 1001 és 693</button></div><div class="out"></div></div>');
      function upd() {
        var o = kit.$('.out', n), N = parseInt10(kit.$('[data-k="n"]', n).value, 12), mv = kit.$('[data-k="m"]', n).value.trim();
        if (!N.ok) { o.innerHTML = '<p class="msg bad">n: ' + kit.esc(N.err) + '</p>'; return; }
        var h = factorBlock(kit, N, 'n = ' + grp(N.s));
        if (mv) {
          var Mm = parseInt10(mv, 12);
          if (!Mm.ok) h += '<p class="msg bad">második szám: ' + kit.esc(Mm.err) + '</p>';
          else {
            var fa = M.szamelmeletFactor(N.v), fb = M.szamelmeletFactor(Mm.v);
            h += '<hr style="border:0;border-top:1px solid var(--line);margin:14px 0">';
            h += factorBlock(kit, Mm, 'm = ' + grp(Mm.s));
            if (fa.complete && fb.complete) {
              var R = M.szamelmeletGcdLcm(fa.factors, fb.factors), g = M.szamelmeletValue(R.gcd).toString(), l = M.szamelmeletValue(R.lcm).toString();
              h += '<div class="lab" style="margin-top:14px">lnko és lkkt a prímtényezős alakból</div>';
              if (R.rows.length) h += table(['prím', 'kitevő n-ben', 'kitevő m-ben', 'kisebb', 'nagyobb'], R.rows.map(function (r) { return [r.p, r.ea, r.eb, r.min, r.max]; }));
              h += '<div class="ans">' + kit.md('$(' + N.s + ';\\ ' + Mm.s + ') = ' + (R.gcd.length ? canonTex(R.gcd) + ' = ' : '') + gtex(g) + '$') + '<br>' + kit.md('$[' + N.s + ';\\ ' + Mm.s + '] = ' + (R.lcm.length ? canonTex(R.lcm) + ' = ' : '') + gtex(l) + '$') + '</div>';
              h += kit.steps(['A **közös** prímeket a **kisebb** kitevővel vesszük: ez adja a legnagyobb közös osztót' + (g === '1' ? ' (itt 1, a két szám relatív prím).' : '.'),
                'Az **összes** prímet a **nagyobb** kitevővel vesszük: ez adja a legkisebb közös többszöröst.',
                'Ellenőrzés: $n\\cdot m = ' + gtex((BigInt(N.v) * BigInt(Mm.v)).toString()) + '$ és $(n;\\ m)\\cdot[n;\\ m] = ' + gtex((BigInt(g) * BigInt(l)).toString()) + '$.']);
            }
          }
        }
        o.innerHTML = h;
      }
      kit.$$('input', n).forEach(function (i) { kit.on(i, 'input', upd); });
      kit.$$('[data-preset]', n).forEach(function (b) { kit.on(b, 'click', function () { var s = b.dataset.preset.split(','); setIn(kit, n, 'n', s[0]); setIn(kit, n, 'm', s[1] || ''); }); });
      upd(); fixTag();
      return n;
    }
  });

  /* ====================== 3. ERATOSZTHENÉSZ SZITÁJA ====================== */
  MO.simDefs.push({
    id: 'szita', title: 'Eratoszthenész szitája', group: 'számelmélet és logika', topic: 'algebra', sub: 'szamelmelet',
    desc: 'Prímszámok keresése a többszörösök kihúzásával, lépésenként vagy egyben; miért elég a gyökig szitálni.',
    build: function (kit) {
      var n = kit.el('<div>' + kit.slider('n', 'felső határ (n)', 30, 200, 1, 50) +
        '<div class="row" style="margin:10px 0"><button class="btn pri" type="button" data-act="next">következő prím többszöröseinek kihúzása</button><button class="btn" type="button" data-act="all">végig</button><button class="btn" type="button" data-act="reset">újra</button></div>' +
        '<div class="row" style="margin-bottom:12px"><button class="btn sm" type="button" data-preset="50">n = 50</button><button class="btn sm" type="button" data-preset="100:all">n = 100, kész szita</button><button class="btn sm" type="button" data-preset="30:all">n = 30, kész szita</button></div><div class="out"></div></div>');
      var S = null, k = 0, curN = 0;
      function render() {
        var o = kit.$('.out', n), cross = {}, i, usedP = {};
        for (i = 0; i < k; i++) { usedP[S.steps[i].p] = 1; S.steps[i].crossed.forEach(function (m) { cross[m] = 1; }); }
        var done = k >= S.steps.length, cells = '', left = 0;
        for (var m = 2; m <= S.n; m++) {
          var cls = cross[m] ? 'off' : ((done || usedP[m]) ? 'on' : ''); if (!cross[m]) left++;
          cells += '<span' + (cls ? ' class="' + cls + '"' : '') + '>' + m + '</span>';
        }
        var h = '<div class="cells">' + cells + '</div>';
        var cur = k > 0 ? S.steps[k - 1] : null, nxt = !done ? S.steps[k].p : null;
        var st = [];
        st.push(done ? 'A szita kész: a legfeljebb ' + S.root + ' nagyságú prímek (' + S.steps.map(function (s) { return s.p; }).join(', ') + ') többszöröseit kihúztuk, a megmaradt számok mind prímek.' :
          'Következő lépés: a ' + nxt + ' többszöröseinek kihúzása (' + nxt + '² = ' + (nxt * nxt) + '-től kezdve, mert a kisebb többszörösöket a kisebb prímek már kihúzták).');
        if (cur) st.push('Az utolsó lépés: ' + cur.p + ' többszörösei közül ' + (cur.crossed.length ? 'újonnan kihúztuk: ' + cur.crossed.join(', ') + '.' : 'már mind ki volt húzva.'));
        h += '<p class="dim" style="margin-top:10px">Kihúzott számok: ' + (S.n - 1 - left) + ', megmaradt (még prímjelölt): ' + left + '.</p>';
        h += kit.steps(st);
        if (done) h += '<div class="ans">' + kit.md('$n = ' + S.n + '$ esetén **' + S.primes.length + ' prím** van: ' + S.primes.join(', ') + '.') + '</div>';
        h += '<div class="lab" style="margin-top:10px">miért elég √n-ig szitálni?</div>';
        h += '<div class="md">' + kit.md('Ha egy $m \\le n$ szám összetett, akkor $m = a\\cdot b$ valamilyen $1 < a \\le b$ esetén, ezért $a^2 \\le m \\le n$, vagyis $a \\le \\sqrt{n}$. Így $m$-nek van $\\sqrt{n}$-nél nem nagyobb prímosztója, és $m$-et már kihúztuk annak a prímnek a többszöröseként. Itt $\\sqrt{' + S.n + '} \\approx ' + kit.tnum(Math.sqrt(S.n), 2) + '$, tehát legfeljebb ' + S.root + '-ig kell szitálni.') + '</div>';
        o.innerHTML = h;
      }
      function setN(v) { curN = v; S = M.szamelmeletSieve(v); k = 0; render(); }
      kit.bindSliders(n, function (v) { if (v.n !== curN) setN(v.n); });
      kit.$$('[data-act]', n).forEach(function (b) { kit.on(b, 'click', function () {
        var a = b.dataset.act; if (a === 'next') { if (k < S.steps.length) k++; } else if (a === 'all') k = S.steps.length; else k = 0; render(); }); });
      fixTag();
      kit.$$('[data-preset]', n).forEach(function (b) { kit.on(b, 'click', function () {
        var s = b.dataset.preset.split(':'), inp = kit.$('[data-in="n"]', n); inp.value = s[0]; inp.dispatchEvent(new Event('input'));
        if (+s[0] === curN && S) { k = 0; } if (s[1] === 'all') k = S.steps.length; render(); }); });
      return n;
    }
  });

  /* ====================== 4. SZÁMRENDSZER-ÁTVÁLTÓ ====================== */
  MO.simDefs.push({
    id: 'szamrendszer', title: 'Számrendszer-átváltó', group: 'számelmélet és logika', topic: 'algebra', sub: 'szamelmelet', formulas: ['a-szamrendszer'],
    desc: 'Szám átírása tetszőleges alapból tízesbe (helyiértékek összege) és tízesből a cél alapba (ismételt maradékos osztás).',
    build: function (kit) {
      var bases = []; for (var i = 2; i <= 16; i++) bases.push([i, String(i)]);
      var n = kit.el('<div><div class="row">' + tin('num', 'szám', '101101', 'text') + kit.select('from', 'a szám alapja', bases, 2) + kit.select('to', 'cél alap', bases, 8) + '</div>' +
        '<p class="dim" style="margin:6px 0 0">A követelmény (2.2.2) az n ≤ 9 alapú számrendszerekről szól; a 10–16 alap (A–F jegyekkel) kiegészítés.</p>' +
        '<div class="row" style="margin:10px 0 12px"><button class="btn sm" type="button" data-preset="101101,2,10">101101₂ tízesbe</button><button class="btn sm" type="button" data-preset="45,10,2">45 kettesbe</button><button class="btn sm" type="button" data-preset="2134,5,7">2134₅ hetesbe</button><button class="btn sm" type="button" data-preset="1000,10,8">1000 nyolcasba</button></div><div class="out"></div></div>');
      function upd() {
        var o = kit.$('.out', n), s = kit.$('[data-k="num"]', n).value, f = +kit.$('[data-sel="from"]', n).value, t = +kit.$('[data-sel="to"]', n).value;
        var c = M.szamelmeletConvert(s, f, t);
        if (!c.ok) { o.innerHTML = '<p class="msg bad">' + kit.esc(c.err) + '</p>'; return; }
        var txt = c.toDec ? s.replace(/[\s  ]/g, '').toUpperCase() : s, h = '';
        if (f !== 10) {
          var terms = c.toDec.rows.map(function (r) { return DIG.charAt(r.d) + '\\cdot ' + f + '^{' + r.k + '}'; }).join(' + ');
          h += '<div class="lab">1. átírás tízes számrendszerbe: helyiértékes alak</div>';
          h += table(['jegy', 'helyiérték', 'szorzat', 'részösszeg'], c.toDec.rows.map(function (r) { return [DIG.charAt(r.d), f + '^' + r.k + ' = ' + grp(r.pw), grp(r.prod), grp(r.sum)]; }));
          h += '<div class="mathblock">' + kit.md('$' + txt + '_{(' + f + ')} = ' + terms + ' = ' + gtex(c.value) + '$') + '</div>';
        } else h += '<p class="dim">A szám már tízes számrendszerben van, az első lépést kihagyjuk.</p>';
        if (t !== 10) {
          h += '<div class="lab" style="margin-top:10px">2. átírás ' + t + ' alapú számrendszerbe: ismételt maradékos osztás (osztó: ' + t + ')</div>';
          if (c.fromDec.rows.length) h += table(['osztandó', 'osztó', 'hányados', 'maradék (jegy)'], c.fromDec.rows.map(function (r) { return [grp(r.n), t, grp(r.q), DIG.charAt(r.r)]; }));
          h += '<p class="dim">A maradékokat alulról felfelé (visszafelé) olvassuk le.</p>';
        } else h += '<p class="dim" style="margin-top:8px">A cél a tízes számrendszer, további lépés nincs.</p>';
        h += '<div class="ans">' + kit.md('$' + txt + '_{(' + f + ')} = ' + c.result + '_{(' + t + ')}$') + '<br><span class="dim">tízes számrendszerben: ' + grp(c.value) + '</span></div>';
        o.innerHTML = h;
      }
      kit.on(kit.$('[data-k="num"]', n), 'input', upd);
      kit.$$('select', n).forEach(function (e) { kit.on(e, 'change', upd); });
      kit.$$('[data-preset]', n).forEach(function (b) { kit.on(b, 'click', function () { var s = b.dataset.preset.split(','); kit.$('[data-sel="from"]', n).value = s[1]; kit.$('[data-sel="to"]', n).value = s[2]; setIn(kit, n, 'num', s[0]); }); });
      upd(); fixTag();
      return n;
    }
  });

  /* ====================== 5. IGAZSÁGTÁBLA ====================== */
  function ih(b) { return b ? 'I' : 'H'; }
  function ttHtml(T) {
    var head = T.vars.concat(T.cols.map(function (c) { return kit_esc(c.text); }));
    var rows = T.rows.map(function (r) { return r.v.map(ih).concat(r.c.map(ih)); });
    return table(head, rows);
  }
  function kit_esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  MO.simDefs.push({
    id: 'igazsagtabla', title: 'Igazságtábla-generátor', group: 'számelmélet és logika', topic: 'gondolkodas', sub: 'logika', formulas: ['g-logika-demorgan', 'g-logika-implikacio'],
    desc: 'Logikai kifejezés teljes igazságtáblája részkifejezésekkel, tautológia-vizsgálat és két kifejezés ekvivalenciájának ellenőrzése.',
    build: function (kit) {
      var keys = ['¬', '∧', '∨', '→', '↔', '(', ')', 'A', 'B', 'C', 'D'];
      var n = kit.el('<div><div class="row">' + tin('e1', 'kifejezés', '¬(A∧B)', 'text') + tin('e2', 'összehasonlítás ezzel (elhagyható)', '¬A∨¬B', 'text') + '</div>' +
        '<div class="row" style="margin:8px 0">' + keys.map(function (k) { return '<button class="btn sm" type="button" data-ins="' + k + '" style="min-width:42px">' + k + '</button>'; }).join('') + '</div>' +
        '<p class="dim" style="margin:0 0 8px">Változók: A, B, C, D. Jelek: ¬ vagy !, ∧ vagy &amp;, ∨ vagy |, → vagy -&gt;, ↔ vagy &lt;-&gt;. Erősség: ¬, ∧, ∨, →, ↔. I = igaz, H = hamis.</p>' +
        '<div class="row" style="margin-bottom:12px"><button class="btn sm" type="button" data-preset="¬(A∧B)|¬A∨¬B">De Morgan (∧)</button><button class="btn sm" type="button" data-preset="¬(A∨B)|¬A∧¬B">De Morgan (∨)</button><button class="btn sm" type="button" data-preset="A→B|¬B→¬A">kontrapozíció</button><button class="btn sm" type="button" data-preset="¬(A→B)|A∧¬B">implikáció tagadása</button><button class="btn sm" type="button" data-preset="A→B|B→A">megfordítás</button><button class="btn sm" type="button" data-preset="A∨¬A|">tautológia</button></div><div class="out"></div></div>');
      var last = kit.$('[data-k="e1"]', n);
      kit.$$('[data-k]', n).forEach(function (i) { kit.on(i, 'focus', function () { last = i; }); });
      function upd() {
        var o = kit.$('.out', n), s1 = kit.$('[data-k="e1"]', n).value, s2 = kit.$('[data-k="e2"]', n).value, h = '';
        var T = M.szamelmeletTable(s1);
        if (!T.ok) { o.innerHTML = '<p class="msg bad">Első kifejezés: ' + kit.esc(T.err) + '</p>'; return; }
        var kind = { tautology: 'azonosan igaz (tautológia): minden sorban igaz', contradiction: 'azonosan hamis: minden sorban hamis', neither: 'egyik sem: van igaz és van hamis sora is' }[T.kind];
        h += '<div class="lab">igazságtábla: ' + kit_esc(T.text) + '</div>' + ttHtml(T);
        h += '<div class="ans">A kifejezés ' + kind + '. (Igaz sorok száma: ' + T.trueCount + ', összes sor: ' + T.rows.length + '.)</div>';
        if (s2.trim()) {
          var T2 = M.szamelmeletTable(s2);
          if (!T2.ok) h += '<p class="msg bad">Második kifejezés: ' + kit.esc(T2.err) + '</p>';
          else {
            var C = M.szamelmeletCompare(s1, s2);
            h += '<div class="lab" style="margin-top:12px">igazságtábla: ' + kit_esc(T2.text) + '</div>' + ttHtml(T2);
            h += '<div class="lab" style="margin-top:12px">összehasonlítás</div>' + table(C.vars.concat([kit_esc(C.textA), kit_esc(C.textB), 'egyezik?']), C.rows.map(function (r) { return r.v.map(ih).concat([ih(r.a), ih(r.b), r.same ? 'igen' : 'NEM']); }));
            if (C.equal) h += '<p class="msg ok">A két kifejezés ekvivalens: minden sorban ugyanaz az értékük.</p>';
            else h += '<p class="msg bad">A két kifejezés nem ekvivalens. Például ' + C.vars.map(function (v) { return v + ' = ' + ih(C.diff.env[v]); }).join(', ') + ' esetén az elsőé ' + ih(C.diff.a) + ', a másodiké ' + ih(C.diff.b) + '.</p>';
          }
        }
        h += kit.steps(['A kifejezést a műveletek erőssége szerint (¬, ∧, ∨, →, ↔) bontjuk részkifejezésekre, minden részkifejezésnek külön oszlopa van.',
          T.vars.length + ' változó esetén ' + T.rows.length + ' sor van (2^' + T.vars.length + ' lehetőség).',
          'Két kifejezés akkor ekvivalens, ha minden sorban megegyezik az értékük, vagyis az „akkor és csak akkor” összekötésük tautológia.']);
        o.innerHTML = h;
      }
      kit.$$('[data-k]', n).forEach(function (i) { kit.on(i, 'input', upd); });
      kit.$$('[data-ins]', n).forEach(function (b) { kit.on(b, 'click', function () {
        var i = last, a = i.selectionStart == null ? i.value.length : i.selectionStart, z = i.selectionEnd == null ? a : i.selectionEnd;
        i.value = i.value.slice(0, a) + b.dataset.ins + i.value.slice(z); i.focus(); try { i.setSelectionRange(a + 1, a + 1); } catch (e) { /* nincs kijelölés */ } upd(); }); });
      kit.$$('[data-preset]', n).forEach(function (b) { kit.on(b, 'click', function () { var s = b.dataset.preset.split('|'); setIn(kit, n, 'e1', s[0]); setIn(kit, n, 'e2', s[1] || ''); }); });
      upd();
      return n;
    }
  });

  /* ====================== 6. BIZONYÍTÁSI MÓDSZEREK ====================== */
  var PROOFS = [
    { id: 'parat', title: 'Két páratlan szám összege páros', kind: 'direkt bizonyítás', slider: null, claim: 'Két páratlan szám összege páros.', steps: [
      { t: 'Legyen $a = 2k+1$ és $b = 2m+1$, ahol $k, m$ egészek.', w: 'A páratlan szám definíciója: 2-vel osztva 1 maradékot ad.' },
      { t: '$a + b = (2k+1) + (2m+1) = 2k + 2m + 2$.', w: 'Összevonjuk a tagokat.' },
      { t: '$a + b = 2\\,(k + m + 1)$.', w: 'Kiemeljük a 2-t.' },
      { t: '$k+m+1$ egész szám, ezért $a+b$ a 2 egész számú többszöröse, vagyis páros. Az állítást bebizonyítottuk.', w: 'A páros szám definíciója: $2\\cdot$(egész).' }] },
    { id: 'oszt3', title: 'A 3-mal oszthatóság szabálya háromjegyű számra', kind: 'direkt bizonyítás', slider: null, claim: 'Egy háromjegyű szám pontosan akkor osztható 3-mal, ha a számjegyeinek összege osztható 3-mal.', steps: [
      { t: 'Legyen a szám $N = 100a + 10b + c$, ahol $a, b, c$ a számjegyei.', w: 'A tízes számrendszer helyiértékes írásmódja.' },
      { t: '$N = (99a + a) + (9b + b) + c$.', w: '$100 = 99 + 1$ és $10 = 9 + 1$.' },
      { t: '$N = 9\\,(11a + b) + (a + b + c)$.', w: 'A 9-cel osztható tagokat csoportosítjuk.' },
      { t: 'A $9\\,(11a+b)$ tag osztható 9-cel, ezért 3-mal is.', w: '$9 = 3\\cdot 3$.' },
      { t: 'Ezért $N$ pontosan akkor osztható 3-mal, ha $a+b+c$ osztható 3-mal.', w: 'Ha az összeg egyik tagja osztható 3-mal, akkor az összeg pontosan akkor osztható 3-mal, ha a másik tag is az.' },
      { t: 'Ugyanez a gondolatmenet 9-cel is működik: $N$ pontosan akkor osztható 9-cel, ha $a+b+c$ osztható 9-cel.', w: 'A $9\\,(11a+b)$ tag 9-cel is osztható.' }] },
    { id: 'sqrt2', title: '√2 irracionális', kind: 'indirekt bizonyítás', slider: null, claim: 'A $\\sqrt{2}$ irracionális szám.', steps: [
      { t: 'Tegyük fel az ellenkezőjét: $\\sqrt{2}$ racionális, azaz $\\sqrt{2} = \\dfrac{p}{q}$, ahol $p, q$ pozitív egészek és a tört nem egyszerűsíthető: $(p;\\ q) = 1$.', w: 'Indirekt bizonyításnál az állítás tagadásából indulunk ki.' },
      { t: 'Négyzetre emelve $2 = \\dfrac{p^2}{q^2}$, azaz $p^2 = 2q^2$.', w: 'Mindkét oldalt négyzetre emeljük, majd $q^2$-tel szorzunk.' },
      { t: '$p^2$ páros, ezért $p$ is páros.', w: 'Páratlan szám négyzete páratlan: $(2k+1)^2 = 4k^2+4k+1$.' },
      { t: 'Legyen $p = 2s$. Ekkor $4s^2 = 2q^2$, tehát $q^2 = 2s^2$.', w: 'Behelyettesítünk, majd 2-vel osztunk.' },
      { t: '$q^2$ páros, ezért $q$ is páros.', w: 'Ugyanaz az érv, mint a 3. lépésben.' },
      { t: '$p$ és $q$ is páros, tehát a tört egyszerűsíthető 2-vel. Ez ellentmond a $(p;\\ q) = 1$ feltevésnek.', w: 'Ellentmondásra jutottunk.' },
      { t: 'A feltevés hamis, tehát $\\sqrt{2}$ irracionális.', w: 'Az ellentmondásból következik, hogy az eredeti állítás igaz.' }] },
    { id: 'ind-osszeg', title: '1 + 2 + … + n = n(n+1)/2', kind: 'teljes indukció', slider: 'sum', claim: 'Minden $n \\ge 1$ egészre $1 + 2 + \\dots + n = \\dfrac{n(n+1)}{2}$.', steps: [
      { tag: 'kezdőlépés', t: '$n = 1$: a bal oldal $1$, a jobb oldal $\\dfrac{1\\cdot 2}{2} = 1$. Az állítás igaz.', w: 'Megmutatjuk, hogy a legkisebb $n$-re igaz.' },
      { tag: 'indukciós feltevés', t: 'Tegyük fel, hogy valamely $k \\ge 1$-re igaz: $1 + 2 + \\dots + k = \\dfrac{k(k+1)}{2}$.', w: 'Ezt használhatjuk a következő lépésben.' },
      { tag: 'indukciós lépés', t: 'Bizonyítandó: $1 + 2 + \\dots + k + (k+1) = \\dfrac{(k+1)(k+2)}{2}$.', w: 'Ez az állítás $n = k+1$-re.' },
      { tag: 'indukciós lépés', t: 'A bal oldal $= \\dfrac{k(k+1)}{2} + (k+1)$.', w: 'Az indukciós feltevést alkalmazzuk az első $k$ tagra.' },
      { tag: 'indukciós lépés', t: '$= (k+1)\\left(\\dfrac{k}{2} + 1\\right) = \\dfrac{(k+1)(k+2)}{2}$, ami a jobb oldal.', w: '$(k+1)$-et kiemeltük.' },
      { tag: 'következtetés', t: 'Az állítás $n=1$-re igaz, és ha $k$-ra igaz, akkor $k+1$-re is. A teljes indukció elve szerint minden $n \\ge 1$-re igaz.', w: 'Az indukció elve: kezdőlépés és öröklődés együtt elég.' }] },
    { id: 'ind-paratlan', title: '1 + 3 + … + (2n−1) = n²', kind: 'teljes indukció', slider: 'odd', claim: 'Minden $n \\ge 1$ egészre $1 + 3 + \\dots + (2n-1) = n^2$.', steps: [
      { tag: 'kezdőlépés', t: '$n = 1$: a bal oldal $1$, a jobb oldal $1^2 = 1$. Az állítás igaz.', w: 'A legkisebb $n$-re ellenőrzünk.' },
      { tag: 'indukciós feltevés', t: 'Tegyük fel, hogy valamely $k \\ge 1$-re igaz: $1 + 3 + \\dots + (2k-1) = k^2$.', w: 'Ezt használjuk fel.' },
      { tag: 'indukciós lépés', t: 'Bizonyítandó: $1 + 3 + \\dots + (2k-1) + (2k+1) = (k+1)^2$.', w: 'Az állítás $n = k+1$-re; az új tag $2(k+1)-1 = 2k+1$.' },
      { tag: 'indukciós lépés', t: 'A bal oldal $= k^2 + (2k+1)$.', w: 'Az indukciós feltevés az első $k$ tagra.' },
      { tag: 'indukciós lépés', t: '$= k^2 + 2k + 1 = (k+1)^2$, ami a jobb oldal.', w: 'Nevezetes azonosság: $(k+1)^2 = k^2 + 2k + 1$.' },
      { tag: 'következtetés', t: 'Az állítás $n = 1$-re igaz és öröklődik, ezért minden $n \\ge 1$-re igaz.', w: 'A teljes indukció elve.' }] },
    { id: 'ell-prim', title: 'Cáfolás: „minden prímszám páratlan”', kind: 'cáfolás ellenpéldával', slider: null, claim: 'Állítás: minden prímszám páratlan.', steps: [
      { t: 'Az állítás „minden” típusú, ezért egyetlen ellenpélda megcáfolja.', w: 'Egy általános állítás tagadása: van olyan elem, amelyre nem igaz.' },
      { t: 'A 2 prímszám, mert csak az 1 és önmaga osztja.', w: 'A prímszám definíciója.' },
      { t: 'A 2 páros, tehát nem páratlan.', w: 'A 2 osztható 2-vel.' },
      { t: 'Az állítás hamis. (Igaz marad: minden 2-nél nagyobb prímszám páratlan.)', w: 'Az ellenpélda elég a cáfoláshoz.' }] },
    { id: 'ell-euler', title: 'Cáfolás: n² + n + 41 mindig prím?', kind: 'cáfolás ellenpéldával', slider: 'euler', claim: 'Állítás: az $n^2 + n + 41$ minden nemnegatív egész $n$-re prímszám.', steps: [
      { t: 'Kipróbáljuk: $n=1$-re $43$, $n=2$-re $47$, $n=3$-ra $53$, mind prím.', w: 'A példák nem bizonyítanak, csak sejtést adnak.' },
      { t: 'Egészen $n = 39$-ig minden érték prím (a csúszkával ellenőrizheted).', w: 'Akárhány igaz példa sem bizonyítja az általános állítást.' },
      { t: '$n = 40$-re $40^2 + 40 + 41 = 1600 + 40 + 41 = 1681$.', w: 'Kiszámoljuk a következő értéket.' },
      { t: '$1681 = 41 \\cdot 41$, tehát összetett szám. Ez ellenpélda.', w: 'Az összetett szám definíciója: van 1-nél nagyobb, önmagánál kisebb osztója.' },
      { t: 'Az állítás hamis: elég egyetlen ellenpélda a cáfoláshoz.', w: 'Az „n²+n+41 prím” csak $0 \\le n \\le 39$-re igaz.' }] }
  ];
  MO.simDefs.push({
    id: 'bizonyitasi-semak', title: 'Bizonyítási módszerek lépésről lépésre', group: 'számelmélet és logika', topic: 'gondolkodas', sub: 'logika',
    desc: 'Kidolgozott direkt, indirekt, teljes indukciós és ellenpéldás bizonyítások, lépésenként felfedhető indoklással.',
    build: function (kit) {
      var opts = PROOFS.map(function (p) { return [p.id, p.title]; });
      var n = kit.el('<div>' +
        '<div class="md" style="margin-bottom:10px">' + kit.md('**Mit kér a követelmény?** Az 1.2.1 pont szerint **emelt szinten** kell ismerni a bizonyítási típusokat: direkt és indirekt bizonyítás, skatulyaelv, teljes indukció. **Középszinten** csak egyszerű állítások bizonyítása szerepel, a típusok neve nem. A $\\sqrt{2}$ irracionalitásának bizonyítása (2.3) szintén emelt szintű. Az ellenpéldával való cáfolás nincs külön néven felsorolva; az állítás igaz vagy hamis voltának eldöntéséhez tartozik (mindkét szinten).') + '</div>' +
        kit.select('proof', 'bizonyítás', opts, PROOFS[0].id) +
        '<div class="out" style="margin-top:10px"></div>' +
        '<div class="row" style="margin:10px 0"><button class="btn pri" type="button" data-act="next">következő lépés</button><button class="btn" type="button" data-act="all">mind</button><button class="btn" type="button" data-act="reset">elölről</button></div>' +
        '<div class="row" style="margin-bottom:12px"><button class="btn sm" type="button" data-preset="parat">páratlan + páratlan</button><button class="btn sm" type="button" data-preset="sqrt2">√2 irracionális</button><button class="btn sm" type="button" data-preset="ind-osszeg">teljes indukció: összeg</button><button class="btn sm" type="button" data-preset="ell-euler">ellenpélda: n²+n+41</button></div>' +
        '<div class="chk"><div class="lab">ellenőrzés konkrét n-re</div>' + kit.slider('n', 'n', 1, 45, 1, 5) + '<div class="chkout"></div></div></div>');
      var cur = PROOFS[0], k = 0, nv = 5;
      function pick(id) { for (var i = 0; i < PROOFS.length; i++) if (PROOFS[i].id === id) return PROOFS[i]; return PROOFS[0]; }
      function check() {
        var box = kit.$('.chk', n); box.style.display = cur.slider ? '' : 'none'; var o = kit.$('.chkout', n);
        if (!cur.slider) { o.innerHTML = ''; return; }
        if (cur.slider === 'euler') {
          var E = M.szamelmeletEuler(nv);
          o.innerHTML = '<div class="md">' + kit.md('$n = ' + nv + '$: $n^2 + n + 41 = ' + nv + '^2 + ' + nv + ' + 41 = ' + E.value + '$') + '</div>' + (E.prime ? '<p class="msg ok">' + E.value + ' prímszám.</p>' : '<p class="msg bad">' + E.value + ' összetett: ' + E.divisor + ' · ' + E.cofactor + '. Ellenpélda!</p>');
          return;
        }
        var I = M.szamelmeletInduction(cur.slider, nv), odd = cur.slider === 'odd';
        var lt = I.terms.length > 8 ? I.terms.slice(0, 3).join(' + ') + ' + … + ' + I.terms[I.terms.length - 1] : I.terms.join(' + ');
        o.innerHTML = kit.steps(['Bal oldal: $' + lt.replace(/…/g, '\\dots') + ' = ' + I.lhs + '$.', 'Jobb oldal: $' + (odd ? nv + '^2' : '\\dfrac{' + nv + '\\cdot ' + (nv + 1) + '}{2}') + ' = ' + I.rhs + '$.']) +
          '<p class="msg ' + (I.ok ? 'ok' : 'bad') + '">' + (I.ok ? 'A két oldal egyenlő: ' + I.lhs + ' = ' + I.rhs + '.' : 'A két oldal nem egyenlő.') + ' (Ez egy konkrét eset, nem bizonyítás.)</p>';
      }
      function render() {
        var o = kit.$('.out', n), h = '<div class="card" style="padding:10px"><span class="tag">' + cur.kind + '</span><div class="md" style="margin-top:6px"><b>Állítás.</b> ' + kit.md(cur.claim) + '</div></div>';
        if (k === 0) h += '<p class="dim">Nyomd meg a „következő lépés” gombot a bizonyítás felfedéséhez.</p>';
        for (var i = 0; i < k; i++) { var s = cur.steps[i];
          h += '<div class="card" style="padding:10px;margin-top:8px"><div class="lab">' + (i + 1) + '. lépés' + (s.tag ? ' <span class="tag">' + s.tag + '</span>' : '') + '</div><div class="md">' + kit.md(s.t) + '</div><div class="md dim">Indoklás: ' + kit.md(s.w) + '</div></div>'; }
        h += '<p class="dim" style="margin-top:8px">' + k + ' / ' + cur.steps.length + ' lépés' + (k === cur.steps.length ? ' – a bizonyítás kész.' : '') + '</p>';
        o.innerHTML = h; check();
      }
      kit.on(kit.$('[data-sel="proof"]', n), 'change', function (e) { cur = pick(e.target.value); k = 0; render(); });
      kit.$$('[data-act]', n).forEach(function (b) { kit.on(b, 'click', function () { var a = b.dataset.act; if (a === 'next') { if (k < cur.steps.length) k++; } else if (a === 'all') k = cur.steps.length; else k = 0; render(); }); });
      kit.$$('[data-preset]', n).forEach(function (b) { kit.on(b, 'click', function () { setSel(kit, n, 'proof', b.dataset.preset); k = 1; render(); }); });
      kit.bindSliders(n, function (v) { nv = v.n; check(); });
      render();
      return n;
    }
  });
})(typeof window !== 'undefined' ? window : globalThis);
