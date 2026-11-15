/* MATEK OS – kis CAS-motor: értelmező, kiértékelés, szimbolikus deriválás,
   numerikus integrál és gyökkeresés, ekvivalencia-ellenőrzés. DOM-független. */
(function (root) {
  'use strict';
  var MO = root.MO = root.MO || {};
  var C = MO.cas = {};

  var FUNCS = { fakt: 1, binom: 1, sqrt: 1, gyok: 1, abs: 1, exp: 1, ln: 1, lg: 1, log: 1, sin: 1, cos: 1, tan: 1, tg: 1, ctg: 1, cot: 1 };
  var CONSTS = { pi: Math.PI, e: Math.E };
  var NAMES = Object.keys(FUNCS).concat(Object.keys(CONSTS)).sort(function (a, b) { return b.length - a.length; });

  function err(msg) { var e = new Error(msg); e.cas = true; return e; }

  /* ---------- tokenizálás ---------- */
  function tokenize(src) {
    var s = String(src).replace(/\s+/g, '')
      .replace(/\*\*/g, '^').replace(/[·×]/g, '*').replace(/[÷:]/g, '/')
      .replace(/[−–]/g, '-').replace(/π/g, 'pi').replace(/√/g, 'sqrt')
      .replace(/(\d),(\d)/g, '$1.$2');
    if (!s) throw err('Üres kifejezés.');
    var out = [], i = 0, m;
    while (i < s.length) {
      var ch = s[i];
      if (/[0-9.]/.test(ch)) {
        m = /^(\d+\.?\d*|\.\d+)/.exec(s.slice(i));
        if (!m) throw err('Hibás szám.');
        out.push({ t: 'num', v: parseFloat(m[0]) }); i += m[0].length;
      } else if (/[a-zA-Z]/.test(ch)) {
        m = /^[a-zA-Z]+/.exec(s.slice(i)); var w = m[0], j = 0;
        while (j < w.length) {
          var hit = null;
          for (var k = 0; k < NAMES.length; k++) {
            if (w.substr(j, NAMES[k].length).toLowerCase() === NAMES[k]) { hit = NAMES[k]; break; }
          }
          if (hit) { out.push({ t: FUNCS[hit] ? 'fn' : 'const', v: hit }); j += hit.length; }
          else { out.push({ t: 'var', v: w[j] }); j++; }
        }
        i += w.length;
      } else if ('+-*/^();|'.indexOf(ch) >= 0) { out.push({ t: ch }); i++; }
      else throw err('Ismeretlen jel: „' + ch + '”.');
    }
    return out;
  }

  /* ---------- AST-építők ---------- */
  function N(v) { return { t: 'num', v: v }; }
  function V(n) { return { t: 'var', n: n }; }
  function B(op, a, b) { return { t: 'bin', op: op, a: a, b: b }; }
  function F(n, args) { return { t: 'fn', n: n, args: args }; }
  function NEG(a) { return { t: 'neg', a: a }; }
  function isNum(x, v) { return x.t === 'num' && (v === undefined || x.v === v); }

  /* ---------- értelmező (Pratt) ---------- */
  var BP = { '+': [1, 2], '-': [1, 2], '*': [3, 4], '/': [3, 4], '^': [8, 7] };
  function parse(src) {
    var tk = tokenize(src), p = 0;
    function peek() { return tk[p]; }
    function startsAtom(t) { return t && (t.t === 'num' || t.t === 'var' || t.t === 'const' || t.t === 'fn' || t.t === '('); }
    function prefix() {
      var t = tk[p++];
      if (!t) throw err('A kifejezés váratlanul véget ért.');
      if (t.t === 'num') return N(t.v);
      if (t.t === 'var') return V(t.v);
      if (t.t === 'const') return { t: 'const', n: t.v };
      if (t.t === '-') return NEG(expr(5));
      if (t.t === '+') return expr(5);
      if (t.t === '(') { var e = expr(0); if (!peek() || peek().t !== ')') throw err('Hiányzik a bezáró zárójel.'); p++; return e; }
      if (t.t === '|') { var a = expr(0); if (!peek() || peek().t !== '|') throw err('Hiányzik az abszolútérték záró jele.'); p++; return F('abs', [a]); }
      if (t.t === 'fn') {
        if (!peek() || peek().t !== '(') throw err('A(z) ' + t.v + ' után zárójel kell, például ' + t.v + '(x).');
        p++; var args = [expr(0)];
        while (peek() && peek().t === ';') { p++; args.push(expr(0)); }
        if (!peek() || peek().t !== ')') throw err('Hiányzik a bezáró zárójel.'); p++;
        var n = t.v; if (n === 'tg') n = 'tan'; if (n === 'cot') n = 'ctg';
        if (n === 'gyok') { if (args.length === 1) return F('sqrt', args); if (args.length === 2) return B('^', args[1], B('/', N(1), args[0])); }
        if (n === 'log') { if (args.length === 1) return F('lg', args); if (args.length === 2) return F('log', args); }
        if (n === 'binom') { if (args.length === 2) return F(n, args); throw err('A binom függvénynek két argumentuma van: binom(n;k).'); }
        if (args.length !== 1) throw err('A(z) ' + t.v + ' függvénynek egy argumentuma van.');
        return F(n, args);
      }
      throw err('Váratlan jel: „' + t.t + '”.');
    }
    function expr(minBp) {
      var left = prefix();
      for (;;) {
        var t = peek(); if (!t) break;
        var op = null, bp;
        if (BP[t.t]) { op = t.t; bp = BP[op]; }
        else if (startsAtom(t)) { op = '*i'; bp = BP['*']; }
        else break;
        if (bp[0] < minBp) break;
        if (op !== '*i') p++;
        var right = expr(bp[1]);
        left = B(op === '*i' ? '*' : op, left, right);
      }
      return left;
    }
    var ast = expr(0);
    if (p < tk.length) throw err('Váratlan jel: „' + tk[p].t + '”.');
    return ast;
  }
  C.parse = parse;

  /* ---------- kiértékelés ---------- */
  function ev(a, env) {
    switch (a.t) {
      case 'num': return a.v;
      case 'const': return CONSTS[a.n];
      case 'var': var v = env ? env[a.n] : undefined; return typeof v === 'number' ? v : NaN;
      case 'neg': return -ev(a.a, env);
      case 'bin':
        var x = ev(a.a, env), y = ev(a.b, env);
        if (a.op === '+') return x + y;
        if (a.op === '-') return x - y;
        if (a.op === '*') return x * y;
        if (a.op === '/') return y === 0 ? NaN : x / y;
        if (x === 0 && y <= 0) return NaN;
        if (x < 0 && y !== Math.round(y)) {
          /* negatív alap, páratlan nevezőjű törtkitevő (pl. köbgyök) */
          var q = 1 / y;
          if (Math.abs(q - Math.round(q)) < 1e-12 && Math.abs(Math.round(q)) % 2 === 1) return -Math.pow(-x, y);
          return NaN;
        }
        return Math.pow(x, y);
      case 'fn':
        var u = ev(a.args[0], env);
        switch (a.n) {
          case 'fakt': return fact(u);
          case 'binom': var kk = ev(a.args[1], env); return (fact(u) !== fact(u) || fact(kk) !== fact(kk) || kk > u) ? NaN : Math.round(fact(u) / (fact(kk) * fact(u - kk)));
          case 'sqrt': return u < 0 ? NaN : Math.sqrt(u);
          case 'abs': return Math.abs(u);
          case 'exp': return Math.exp(u);
          case 'ln': return u <= 0 ? NaN : Math.log(u);
          case 'lg': return u <= 0 ? NaN : Math.log(u) / Math.LN10;
          case 'log': var w = ev(a.args[1], env); return (u <= 0 || u === 1 || w <= 0) ? NaN : Math.log(w) / Math.log(u);
          case 'sin': return Math.sin(u);
          case 'cos': return Math.cos(u);
          case 'tan': return Math.abs(Math.cos(u)) < 1e-15 ? NaN : Math.tan(u);
          case 'ctg': return Math.abs(Math.sin(u)) < 1e-15 ? NaN : Math.cos(u) / Math.sin(u);
        }
    }
    return NaN;
  }
  function fact(n) { if (!(n >= 0) || n !== Math.round(n) || n > 170) return NaN; var r = 1; for (var i = 2; i <= n; i++) r *= i; return r; }
  C.evalAst = function (ast, env) { var r = ev(ast, env); return isFinite(r) ? r : NaN; };
  C.evaluate = function (src, env) { return C.evalAst(parse(src), env); };

  function varsOf(a, set) {
    set = set || {};
    if (a.t === 'var') set[a.n] = 1;
    else if (a.t === 'neg') varsOf(a.a, set);
    else if (a.t === 'bin') { varsOf(a.a, set); varsOf(a.b, set); }
    else if (a.t === 'fn') a.args.forEach(function (x) { varsOf(x, set); });
    return set;
  }
  C.vars = function (ast) { return Object.keys(varsOf(ast)).sort(); };
  function hasVar(a, x) { return !!varsOf(a)[x]; }

  /* ---------- egyszerűsítő konstruktorok ---------- */
  function add(a, b) {
    if (isNum(a) && isNum(b)) return N(a.v + b.v);
    if (isNum(a, 0)) return b; if (isNum(b, 0)) return a;
    if (b.t === 'neg') return sub(a, b.a);
    if (isNum(b) && b.v < 0) return sub(a, N(-b.v));
    return B('+', a, b);
  }
  function sub(a, b) {
    if (isNum(a) && isNum(b)) return N(a.v - b.v);
    if (isNum(b, 0)) return a; if (isNum(a, 0)) return neg(b);
    if (b.t === 'neg') return add(a, b.a);
    return B('-', a, b);
  }
  function neg(a) {
    if (isNum(a)) return N(-a.v);
    if (a.t === 'neg') return a.a;
    if (a.t === 'bin' && a.op === '*' && isNum(a.a)) return mul(N(-a.a.v), a.b);
    return NEG(a);
  }
  function mul(a, b) {
    if (isNum(a) && isNum(b)) return N(a.v * b.v);
    if (isNum(a, 0) || isNum(b, 0)) return N(0);
    if (isNum(a, 1)) return b; if (isNum(b, 1)) return a;
    if (isNum(a, -1)) return neg(b); if (isNum(b, -1)) return neg(a);
    if (a.t === 'neg') return neg(mul(a.a, b));
    if (b.t === 'neg') return neg(mul(a, b.a));
    if (isNum(b) && !isNum(a)) return mul(b, a);
    if (isNum(a) && b.t === 'bin' && b.op === '*' && isNum(b.a)) return mul(N(a.v * b.a.v), b.b);
    if (!isNum(a) && a.t === 'bin' && a.op === '*' && isNum(a.a)) return mul(a.a, mul(a.b, b));
    if (!isNum(a) && b.t === 'bin' && b.op === '*' && isNum(b.a)) return mul(b.a, mul(a, b.b));
    if (!isNum(a) && same(a, b)) return pow(a, N(2));
    if (a.t === 'bin' && a.op === '^' && isNum(a.b) && same(a.a, b)) return pow(b, N(a.b.v + 1));
    if (b.t === 'bin' && b.op === '^' && isNum(b.b) && same(b.a, a)) return pow(a, N(b.b.v + 1));
    return B('*', a, b);
  }
  function div(a, b) {
    if (isNum(b, 1)) return a;
    if (isNum(a, 0)) return N(0);
    if (isNum(a) && isNum(b) && b.v !== 0 && a.v % b.v === 0) return N(a.v / b.v);
    if (a.t === 'neg') return neg(div(a.a, b));
    /* közös egész együttható kiemelése: 2x/(2y) = x/y */
    var ca = coef(a), cb = coef(b);
    if (ca[0] !== 1 && cb[0] !== 1 && ca[0] === Math.round(ca[0]) && cb[0] === Math.round(cb[0])) {
      var g = MO.gcd(ca[0], cb[0]);
      if (g > 1) return div(mul(N(ca[0] / g), ca[1]), mul(N(cb[0] / g), cb[1]));
    }
    return B('/', a, b);
  }
  function pow(a, b) {
    if (isNum(b, 1)) return a;
    if (isNum(b, 0)) return N(1);
    if (isNum(a) && isNum(b) && b.v > 0 && b.v === Math.round(b.v) && a.v === Math.round(a.v) && Math.abs(Math.pow(a.v, b.v)) < 1e12) return N(Math.pow(a.v, b.v));
    return B('^', a, b);
  }
  function same(a, b) { return str(a) === str(b); }
  function coef(a) {
    if (isNum(a)) return [a.v, N(1)];
    if (a.t === 'bin' && a.op === '*' && isNum(a.a)) return [a.a.v, a.b];
    return [1, a];
  }
  function simp(a) {
    switch (a.t) {
      case 'neg': return neg(simp(a.a));
      case 'bin':
        var x = simp(a.a), y = simp(a.b);
        return a.op === '+' ? add(x, y) : a.op === '-' ? sub(x, y) : a.op === '*' ? mul(x, y) : a.op === '/' ? div(x, y) : pow(x, y);
      case 'fn': return F(a.n, a.args.map(simp));
    }
    return a;
  }
  C.simplify = simp;

  /* ---------- szimbolikus deriválás ---------- */
  function d(a, x) {
    switch (a.t) {
      case 'num': case 'const': return N(0);
      case 'var': return N(a.n === x ? 1 : 0);
      case 'neg': return neg(d(a.a, x));
      case 'bin':
        var u = a.a, v = a.b, du, dv;
        if (a.op === '+') return add(d(u, x), d(v, x));
        if (a.op === '-') return sub(d(u, x), d(v, x));
        if (a.op === '*') return add(mul(d(u, x), v), mul(u, d(v, x)));
        if (a.op === '/') {
          if (!hasVar(v, x)) return div(d(u, x), v);
          return div(sub(mul(d(u, x), v), mul(u, d(v, x))), pow(v, N(2)));
        }
        du = d(u, x); dv = d(v, x);
        if (!hasVar(v, x)) return mul(mul(v, pow(u, simp(sub(v, N(1))))), du);
        if (!hasVar(u, x)) return mul(mul(a, F('ln', [u])), dv);
        return mul(a, add(mul(dv, F('ln', [u])), div(mul(v, du), u)));
      case 'fn':
        var g = a.args[0], dg = d(g, x);
        switch (a.n) {
          case 'sqrt': return div(dg, mul(N(2), a));
          case 'abs': return div(mul(dg, g), a);
          case 'exp': return mul(a, dg);
          case 'ln': return div(dg, g);
          case 'lg': return div(dg, mul(g, F('ln', [N(10)])));
          case 'log':
            if (!hasVar(g, x)) return div(d(a.args[1], x), mul(a.args[1], F('ln', [g])));
            return d(B('/', F('ln', [a.args[1]]), F('ln', [g])), x);
          case 'sin': return mul(F('cos', [g]), dg);
          case 'cos': return neg(mul(F('sin', [g]), dg));
          case 'tan': return div(dg, pow(F('cos', [g]), N(2)));
          case 'ctg': return neg(div(dg, pow(F('sin', [g]), N(2))));
        }
    }
    throw err('Ezt nem tudom deriválni.');
  }
  C.diff = function (ast, x) { return simp(d(simp(ast), x || 'x')); };

  /* ---------- kiírás ---------- */
  function fmt(v) {
    var r = Math.round(v * 1e10) / 1e10;
    return String(r);
  }
  function prec(a) {
    if (a.t === 'bin') return a.op === '+' || a.op === '-' ? 1 : a.op === '^' ? 4 : 2;
    if (a.t === 'neg') return 1.5;
    if (a.t === 'num' && a.v < 0) return 1.5;
    return 9;
  }
  function str(a) {
    switch (a.t) {
      case 'num': return fmt(a.v);
      case 'var': return a.n;
      case 'const': return a.n;
      case 'neg': return '-' + wrapS(a.a, 2);
      case 'fn': return (a.n === 'tan' ? 'tg' : a.n) + '(' + a.args.map(str).join(';') + ')';
      case 'bin':
        if (a.op === '+') return str(a.a) + '+' + wrapS(a.b, 1.6);
        if (a.op === '-') return str(a.a) + '-' + wrapS(a.b, 2);
        if (a.op === '*') return wrapS(a.a, 2) + '*' + wrapS(a.b, 2);
        if (a.op === '/') return wrapS(a.a, 2) + '/' + wrapS(a.b, 3);
        return wrapS(a.a, 5) + '^' + wrapS(a.b, 5);
    }
  }
  function wrapS(a, p) { return prec(a) < p ? '(' + str(a) + ')' : str(a); }
  C.toString = str;

  function texNum(v) { return fmt(v).replace('.', '{,}'); }
  function tex(a) {
    switch (a.t) {
      case 'num': return texNum(a.v);
      case 'var': return a.n;
      case 'const': return a.n === 'pi' ? '\\pi' : 'e';
      case 'neg': return '-' + wrapT(a.a, 2);
      case 'fn':
        var g = tex(a.args[0]);
        if (a.n === 'sqrt') return '\\sqrt{' + g + '}';
        if (a.n === 'abs') return '\\left|' + g + '\\right|';
        if (a.n === 'exp') return 'e^{' + g + '}';
        if (a.n === 'fakt') return (a.args[0].t === 'num' || a.args[0].t === 'var' ? g : '\\left(' + g + '\\right)') + '!';
        if (a.n === 'binom') return '\\dbinom{' + g + '}{' + tex(a.args[1]) + '}';
        if (a.n === 'log') return '\\log_{' + g + '}\\left(' + tex(a.args[1]) + '\\right)';
        var nm = { ln: '\\ln', lg: '\\lg', sin: '\\sin', cos: '\\cos', tan: '\\operatorname{tg}', ctg: '\\operatorname{ctg}' }[a.n];
        return nm + '\\left(' + g + '\\right)';
      case 'bin':
        if (a.op === '+') return tex(a.a) + '+' + wrapT(a.b, 1.6);
        if (a.op === '-') return tex(a.a) + '-' + wrapT(a.b, 2);
        if (a.op === '/') return '\\dfrac{' + tex(a.a) + '}{' + tex(a.b) + '}';
        if (a.op === '^') {
          var base = (a.a.t === 'fn' && a.a.n !== 'sqrt' && a.a.n !== 'abs') || prec(a.a) < 5 ? '\\left(' + tex(a.a) + '\\right)' : tex(a.a);
          return base + '^{' + tex(a.b) + '}';
        }
        var L = wrapT(a.a, 2), R = wrapT(a.b, 2);
        var rightStartsDigit = a.b.t === 'num' || (a.b.t === 'bin' && a.b.op === '^' && a.b.a.t === 'num');
        return L + (rightStartsDigit ? '\\cdot ' : '\\,') + R;
    }
  }
  function wrapT(a, p) {
    if (a.t === 'bin' && a.op === '/') return tex(a);
    return prec(a) < p ? '\\left(' + tex(a) + '\\right)' : tex(a);
  }
  C.toTex = tex;

  /* ---------- fordítás függvénnyé ---------- */
  C.compile = function (src) {
    var ast = parse(src);
    return { ast: ast, vars: C.vars(ast), f: function (x) { return C.evalAst(ast, typeof x === 'number' ? { x: x } : x); } };
  };

  /* ---------- numerikus integrál (adaptív Simpson, hibabecsléssel) ---------- */
  C.integrate = function (f, a, b, tol) {
    tol = tol || 1e-9;
    if (a === b) return { value: 0, err: 0, ok: true };
    var sign = 1; if (a > b) { var t = a; a = b; b = t; sign = -1; }
    var bad = false, errSum = 0;
    function S(fa, fm, fb, h) { return h / 6 * (fa + 4 * fm + fb); }
    function rec(x0, x1, f0, fm, f1, whole, eps, depth) {
      var m = (x0 + x1) / 2, lm = (x0 + m) / 2, rm = (m + x1) / 2;
      var flm = f(lm), frm = f(rm);
      if (!isFinite(flm) || !isFinite(frm)) { bad = true; return 0; }
      var left = S(f0, flm, fm, m - x0), right = S(fm, frm, f1, x1 - m);
      var delta = left + right - whole;
      if (depth <= 0 || Math.abs(delta) <= 15 * eps) { errSum += Math.abs(delta) / 15; return left + right + delta / 15; }
      return rec(x0, m, f0, flm, fm, left, eps / 2, depth - 1) + rec(m, x1, fm, frm, f1, right, eps / 2, depth - 1);
    }
    var n = 8, h = (b - a) / n, total = 0;
    for (var i = 0; i < n; i++) {
      var x0 = a + i * h, x1 = x0 + h, f0 = f(x0), fm = f((x0 + x1) / 2), f1 = f(x1);
      if (!isFinite(f0) || !isFinite(fm) || !isFinite(f1)) { bad = true; break; }
      total += rec(x0, x1, f0, fm, f1, S(f0, fm, f1, h), tol / n, 40);
    }
    return { value: bad ? NaN : sign * total, err: errSum, ok: !bad };
  };

  /* ---------- gyökkeresés (előjelváltás + felezés, érintő gyök Newtonnal) ---------- */
  C.roots = function (f, a, b, opts) {
    opts = opts || {};
    var n = opts.samples || 800, df = opts.df, out = [];
    var scale = Math.max(1, Math.abs(a), Math.abs(b));
    function push(x) {
      if (!(x >= a - 1e-12 && x <= b + 1e-12)) return;
      for (var i = 0; i < out.length; i++) if (Math.abs(out[i] - x) < 1e-7 * scale) return;
      out.push(Math.abs(x) < 1e-12 ? 0 : x);
    }
    function bisect(lo, hi, flo) {
      for (var k = 0; k < 80; k++) {
        var m = (lo + hi) / 2, fm = f(m);
        if (!isFinite(fm)) return NaN;
        if (fm === 0) return m;
        if ((fm > 0) === (flo > 0)) { lo = m; flo = fm; } else hi = m;
      }
      return (lo + hi) / 2;
    }
    var h = (b - a) / n, px = a, pf = f(a), ppf = NaN;
    if (pf === 0) push(a);
    for (var i = 1; i <= n; i++) {
      var x = a + i * h, fx = f(x);
      if (fx === 0) push(x);
      else if (isFinite(pf) && isFinite(fx) && pf !== 0 && (pf > 0) !== (fx > 0)) {
        var r = bisect(px, x, pf);
        /* pólusnál is előjelet vált a függvény: csak akkor gyök, ha ott kicsi az érték */
        if (isFinite(r) && Math.abs(f(r)) < 1e-6 * Math.max(1, Math.abs(pf), Math.abs(fx))) push(r);
      } else if (isFinite(ppf) && isFinite(pf) && isFinite(fx) && Math.abs(pf) < Math.abs(ppf) && Math.abs(pf) <= Math.abs(fx) && Math.abs(pf) < 1e-2) {
        /* érintő (páros multiplicitású) gyök jelöltje */
        var xn = px;
        for (var it = 0; it < 60; it++) {
          var fv = f(xn), dv = df ? df(xn) : (f(xn + 1e-6) - f(xn - 1e-6)) / 2e-6;
          if (!isFinite(fv) || !isFinite(dv) || dv === 0) break;
          var step = fv / dv; xn -= step;
          if (Math.abs(step) < 1e-13) break;
        }
        if (isFinite(xn) && Math.abs(xn - px) < 2 * h && Math.abs(f(xn)) < 1e-9) push(xn);
      }
      ppf = pf; px = x; pf = fx;
    }
    return out.sort(function (p, q) { return p - q; });
  };

  /* ---------- ekvivalencia: véletlen pontokon hasonlítjuk össze ---------- */
  C.equivalent = function (srcA, srcB, opts) {
    opts = opts || {};
    var A = typeof srcA === 'string' ? parse(srcA) : srcA, Bt = typeof srcB === 'string' ? parse(srcB) : srcB;
    var vs = {}; varsOf(A, vs); varsOf(Bt, vs); var names = Object.keys(vs);
    var rnd = MO.rng ? MO.rng(opts.seed || 20240507) : Math.random;
    var valid = 0, mismatch = 0, domainDiff = 0, tries = names.length ? 60 : 1;
    for (var i = 0; i < tries; i++) {
      var env = {};
      for (var k = 0; k < names.length; k++) {
        /* a pontok fele pozitív, hogy a gyökös, logaritmusos kifejezések is értelmezve legyenek */
        env[names[k]] = i % 2 ? 0.2 + 4.6 * rnd() : -5 + 10 * rnd();
      }
      var x = C.evalAst(A, env), y = C.evalAst(Bt, env);
      var fx = isFinite(x), fy = isFinite(y);
      if (!fx && !fy) continue;
      if (fx !== fy) { domainDiff++; continue; }
      valid++;
      if (Math.abs(x - y) > 1e-7 * Math.max(1, Math.abs(x), Math.abs(y))) mismatch++;
    }
    return { equal: valid >= (names.length ? 6 : 1) && mismatch === 0 && domainDiff === 0, valid: valid, mismatch: mismatch, domainDiff: domainDiff };
  };

  /* Beírt válasz ellenőrzése. task.answer: {type:'num', value, tol?, rel?} vagy {type:'expr', expr} */
  C.check = function (answer, input) {
    var txt = String(input == null ? '' : input).trim();
    if (!txt) return { ok: false, msg: 'Írj be egy választ.' };
    txt = txt.replace(/%$/, '').replace(/^[a-zA-Z]\s*=\s*/, '');
    if (answer.noParen && /[()|]/.test(txt)) return { ok: false, msg: 'Zárójel nélküli, összevont alakot várok.' };
    try {
      if (answer.type === 'num') {
        var ast = parse(txt);
        if (C.vars(ast).length) return { ok: false, msg: 'Számot várok, betű nélkül.' };
        var v = C.evalAst(ast, {});
        if (!isFinite(v)) return { ok: false, msg: 'Ez nem értelmezhető számként.' };
        var tol = answer.tol !== undefined ? answer.tol : 1e-9 * Math.max(1, Math.abs(answer.value));
        if (answer.rel) tol = Math.max(tol, answer.rel * Math.abs(answer.value));
        return { ok: Math.abs(v - answer.value) <= tol, value: v };
      }
      if (answer.type === 'set') {
        /* több érték pontosvesszővel elválasztva, tetszőleges sorrendben; üres halmaz: „nincs” */
        var want = answer.values.slice(), parts = /^(nincs( megoldás)?|∅|\{\s*\})$/i.test(txt) ? [] : txt.replace(/^\{|\}$/g, '').split(';').map(function (x) { return x.trim(); }).filter(Boolean);
        var got = parts.map(function (x) { var a2 = parse(x.replace(/^[a-zA-Z](_?\d)?\s*=\s*/, '')); if (C.vars(a2).length) throw err('Számokat várok, pontosvesszővel elválasztva.'); return C.evalAst(a2, {}); });
        if (got.some(function (g) { return !isFinite(g); })) return { ok: false, msg: 'Ez nem értelmezhető számként.' };
        if (got.length !== want.length) return { ok: false };
        var tl = answer.tol !== undefined ? answer.tol : 1e-9, used = [];
        for (var gi = 0; gi < got.length; gi++) {
          var hit = -1;
          for (var wi = 0; wi < want.length; wi++) if (!used[wi] && Math.abs(got[gi] - want[wi]) <= Math.max(tl, 1e-9 * Math.abs(want[wi]))) { hit = wi; break; }
          if (hit < 0) return { ok: false }; used[hit] = true;
        }
        return { ok: true };
      }
      if (answer.type === 'choice') { var ci = parseInt(txt, 10); return { ok: ci === answer.correct }; }
      if (answer.type === 'choice') { var ci = parseInt(txt, 10); return { ok: ci === answer.correct }; }
      if (answer.type === 'set') {
        /* több szám pontosvesszővel elválasztva, a sorrend nem számít; üres halmaz: „nincs” */
        var want = answer.values.slice().sort(function (p, q) { return p - q; });
        if (/^(nincs|nincs megoldás|∅|üres)$/i.test(txt)) return { ok: want.length === 0 };
        var parts = txt.replace(/[{}]/g, '').split(';').map(function (t) { return t.trim().replace(/^[a-zA-Z](_?\d)?\s*=\s*/, ''); }).filter(Boolean), got = [];
        for (var i = 0; i < parts.length; i++) {
          var a2 = parse(parts[i]); if (C.vars(a2).length) return { ok: false, msg: 'Számokat várok, pontosvesszővel elválasztva.' };
          var val = C.evalAst(a2, {}); if (!isFinite(val)) return { ok: false, msg: 'Az egyik érték nem értelmezhető számként.' };
          got.push(val);
        }
        got.sort(function (p, q) { return p - q; });
        if (got.length !== want.length) return { ok: false };
        for (var k = 0; k < want.length; k++) if (Math.abs(got[k] - want[k]) > (answer.tol !== undefined ? answer.tol : 1e-9 * Math.max(1, Math.abs(want[k])))) return { ok: false };
        return { ok: true };
      }
      if (answer.type === 'expr') {
        var r = C.equivalent(txt, answer.expr);
        return { ok: r.equal };
      }
    } catch (e) {
      return { ok: false, msg: e.cas ? e.message : 'Ezt nem tudom értelmezni.' };
    }
    return { ok: false, msg: 'Ismeretlen feladattípus.' };
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = C;
})(typeof window !== 'undefined' ? window : globalThis);
