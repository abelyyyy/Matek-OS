(function (root) {
  'use strict';
  var MO = root.MO = root.MO || {};
  var M = MO.models = MO.models || {};
  MO.simDefs = MO.simDefs || [];
  var K = null;

  /* ---------- segédek ---------- */
  function X(v) { return K.exact(v); }
  function nice(v) { for (var d = 1; d <= 1000; d++) { var n = v * d; if (Math.abs(n - Math.round(n)) < 1e-9) return true; } return false; }
  function eqTex(v) { return nice(v) ? '= ' + X(v) : '\\approx ' + K.tnum(v, 4); }
  function addTerm(v) { if (v === 0) return ''; return v < 0 ? ' - ' + X(-v) : ' + ' + X(v); }
  function coefTex(a, body) { if (a === 1) return body; if (a === -1) return '-' + body; return X(a) + body; }
  function linTex(m, q) {
    var s = m !== 0 ? coefTex(m, 'x') : '';
    if (q !== 0 || s === '') s = s === '' ? X(q) : s + addTerm(q);
    return s;
  }
  function T(s) { return '$' + s + '$'; }
  function kvHtml(rows) { return '<dl class="kv">' + rows.map(function (r) { return '<dt>' + K.md(r[0]) + '</dt><dd><div class="md" style="overflow-x:auto;overflow-y:hidden">' + K.md(r[1]) + '</div></dd>'; }).join('') + '</dl>'; }
  function bad(t) { return '<p class="msg bad">' + K.md(t) + '</p>'; }
  function setInputs(n, keys, vals) {
    keys.forEach(function (k, i) { var inp = K.$('[data-in="' + k + '"]', n); if (inp && vals[i] !== undefined) { inp.value = vals[i]; inp.dispatchEvent(new Event('input', { bubbles: true })); } });
  }

  /* ================= MODELLEK ================= */

  /* 1. transzformációk */
  var BASES = {
    sq: { label: 'x²', f: function (x) { return x * x; }, tex: function (a) { return a === 'x' ? 'x^2' : '\\left(' + a + '\\right)^2'; } },
    abs: { label: '|x|', f: function (x) { return Math.abs(x); }, tex: function (a) { return '\\left|' + a + '\\right|'; } },
    sqrt: { label: '√x', f: function (x) { return x >= 0 ? Math.sqrt(x) : NaN; }, tex: function (a) { return '\\sqrt{' + a + '}'; } },
    inv: { label: '1/x', f: function (x) { return x !== 0 ? 1 / x : NaN; }, tex: function (a) { return '\\dfrac{1}{' + a + '}'; } },
    exp2: { label: '2^x', f: function (x) { return Math.pow(2, x); }, tex: function (a) { return '2^{' + a + '}'; } },
    log2: { label: 'log₂ x', f: function (x) { return x > 0 ? Math.log(x) / Math.LN2 : NaN; }, tex: function (a) { return '\\log_2\\left(' + a + '\\right)'; } },
    sin: { label: 'sin x', f: Math.sin, tex: function (a) { return '\\sin\\left(' + a + '\\right)'; } },
    cos: { label: 'cos x', f: Math.cos, tex: function (a) { return '\\cos\\left(' + a + '\\right)'; } },
    cube: { label: 'x³', f: function (x) { return x * x * x; }, tex: function (a) { return a === 'x' ? 'x^3' : '\\left(' + a + '\\right)^3'; } }
  };
  var BASEKEYS = ['sq', 'abs', 'sqrt', 'inv', 'exp2', 'log2', 'sin', 'cos', 'cube'];
  M.transformBases = BASEKEYS;
  M.transform = function (base, a, b, c, d) {
    var B = BASES[base];
    return function (x) { var y = a * B.f(b * (x - c)) + d; return isFinite(y) ? y : NaN; };
  };
  /* az értelmezési tartomány: korlátozás típusa az argumentumra */
  M.transformDomain = function (base, b, c) {
    if (b === 0) return { type: 'const' };
    if (base === 'sqrt') return b > 0 ? { type: 'ge', x: c } : { type: 'le', x: c };
    if (base === 'log2') return b > 0 ? { type: 'gt', x: c } : { type: 'lt', x: c };
    if (base === 'inv') return { type: 'ne', x: c };
    return { type: 'all' };
  };

  /* 2. másodfokú */
  M.quadFn = function (a, b, c) {
    if (a === 0) return null;
    var D = b * b - 4 * a * c, u = -b / (2 * a), v = c - b * b / (4 * a), roots = [];
    if (D > 1e-12) { var s = Math.sqrt(D), r1 = (-b - s) / (2 * a), r2 = (-b + s) / (2 * a); roots = [Math.min(r1, r2), Math.max(r1, r2)]; }
    else if (Math.abs(D) <= 1e-12) roots = [u];
    return { a: a, b: b, c: c, D: D, u: u, v: v, roots: roots, up: a > 0, yint: c };
  };

  /* 3. exp-log */
  M.expLog = function (a, t, q) {
    if (!(a > 0) || Math.abs(a - 1) < 1e-9) return null;
    var y = Math.pow(a, t);
    return { a: a, t: t, p: [t, y], mirror: [y, t], inc: a > 1, logq: q > 0 ? Math.log(q) / Math.log(a) : NaN, logBack: Math.log(y) / Math.log(a) };
  };

  /* 4. lineáris törtfüggvény */
  M.fractional = function (a, b, c, d) {
    var f = function (x) { var den = c * x + d; return Math.abs(den) < 1e-12 ? NaN : (a * x + b) / den; };
    if (c === 0 && d === 0) return { type: 'undefined', f: f };
    if (c === 0) return { type: 'linear', f: f, m: a / d, q: b / d };
    var u = -d / c, v = a / c, det = a * d - b * c;
    if (det === 0) return { type: 'const', f: f, u: u, v: v };
    return { type: 'hyper', f: f, u: u, v: v, k: -det / (c * c), det: det };
  };

  /* 5. abszolútérték */
  M.absLinear = function (a, u, v, k) {
    var r = { bp: u, left: { m: -a, q: a * u + v }, right: { m: a, q: v - a * u }, ext: v, type: a > 0 ? 'min' : a < 0 ? 'max' : 'const' };
    var xs;
    if (a === 0) xs = (v === k) ? 'all' : [];
    else { var t = (k - v) / a; xs = t > 1e-12 ? [u - t, u + t] : Math.abs(t) <= 1e-12 ? [u] : []; }
    r.sol = xs; return r;
  };
  M.absSum = function (p, q, k) {
    var lo = Math.min(p, q), hi = Math.max(p, q), d = hi - lo, s = p + q, xs;
    if (k > d + 1e-12) xs = [(s - k) / 2, (s + k) / 2];
    else if (Math.abs(k - d) <= 1e-12) xs = d > 0 ? { from: lo, to: hi } : [lo];
    else xs = [];
    return { lo: lo, hi: hi, left: { m: -2, q: s }, mid: { m: 0, q: d }, right: { m: 2, q: -s }, min: d, sol: xs };
  };
  M.absSumValue = function (p, q, x) { return Math.abs(x - p) + Math.abs(x - q); };

  /* ================= 1. TRANSZFORMÁCIÓK ================= */
  MO.simDefs.push({
    id: 'transzformaciok', title: 'Függvénytranszformációk', group: 'függvények', topic: 'fuggvenyek', sub: 'valosfv',
    desc: 'Válassz alapfüggvényt, és négy csúszkával alakítsd az a·f(b·(x−c))+d függvénnyé: nyújtás, tükrözés, eltolás lépésről lépésre.',
    formulas: ['f-fv-transzformacio'],
    build: function (kit) {
      K = kit;
      var base = 'sq', last = null, p = null;
      var n = kit.el('<div><label class="f"><span>alapfüggvény f(x)</span><select data-k="base">' + BASEKEYS.map(function (k) { return '<option value="' + k + '">' + BASES[k].label + '</option>'; }).join('') + '</select></label>' +
        kit.slider('a', 'a (y irányú nyújtás, tükrözés)', -3, 3, 0.5, 2) + kit.slider('b', 'b (x irányú nyújtás, tükrözés)', -3, 3, 0.5, 1) +
        kit.slider('c', 'c (eltolás az x tengely mentén)', -5, 5, 0.5, 1) + kit.slider('d', 'd (eltolás az y tengely mentén)', -5, 5, 0.5, -3) +
        '<div class="row" style="margin:8px 0"><button class="btn sm" type="button" data-preset="sq,2,1,1,-3">2(x−1)²−3</button><button class="btn sm" type="button" data-preset="sq,-1,1,2,3">−(x−2)²+3</button>' +
        '<button class="btn sm" type="button" data-preset="sqrt,1,-1,0,0">√(−x)</button><button class="btn sm" type="button" data-preset="sin,2,2,0,0">2·sin 2x</button><button class="btn sm" type="button" data-preset="inv,1,1,2,1">1/(x−2)+1</button></div>' +
        kit.plotBox(300) + '<div class="legend"><span><i style="border-color:var(--c0,var(--fg))"></i>transzformált</span><span><i style="border-color:var(--c1);border-top-style:dashed"></i>eredeti f(x)</span></div><div class="out"></div></div>');
      function argTex(b, c) { var inner = 'x' + addTerm(-c); if (c === 0) return coefTex(b, 'x'); return b === 1 ? inner : coefTex(b, '\\left(' + inner + '\\right)'); }
      function fullTex(a, b, c, d) {
        if (a === 0) return X(d);
        var e = BASES[base].tex(argTex(b, c)), s = a === 1 ? e : a === -1 ? '-' + e : X(a) + '\\cdot ' + e;
        return s + addTerm(d);
      }
      function upd(v) {
        last = v; if (!p) return;
        var B = BASES[base], a = v.a, b = v.b, c = v.c, d = v.d, o = kit.$('.out', n);
        p.set({ curves: [{ f: M.transform(base, a, b, c, d) }, { f: B.f }] });
        var html = '';
        if (b === 0) {
          var y0 = a * B.f(0) + d;
          html = bad('b = 0 elfajuló eset: az argumentum minden $x$-re $0$, ezért a függvény ' + (isFinite(y0) ? 'konstans: $f(x) = ' + kit.tnum(y0, 3) + '$. Az $x$ irányú nyújtás $\\frac{1}{b}$-szeres lenne, ez $b = 0$-nál nem értelmezhető.' : 'sehol nincs értelmezve (az alapfüggvény a $0$ helyen nem értelmezett).'));
          o.innerHTML = html; return;
        }
        var st = [];
        st.push('**Alap:** $y = ' + B.tex('x') + '$ (szaggatott vonal).');
        var ab = Math.abs(b);
        st.push('**b = ' + kit.num(b, 1) + ':** az $x$ helyére $b\\cdot(x - c)$ kerül. ' + (ab === 1 ? '' : 'A grafikon az $x$ tengely mentén $\\frac{1}{|b|} = ' + X(1 / ab) + '$-szeresére ' + (ab > 1 ? 'összenyomódik' : 'széthúzódik') + '. ') + (b < 0 ? 'A negatív előjel miatt tükröződik az $y$ tengelyre. ' : '') + (b === 1 ? 'Nincs változás.' : ''));
        st.push('**c = ' + kit.num(c, 1) + ':** ' + (c === 0 ? 'nincs vízszintes eltolás.' : 'a grafikon ' + kit.num(Math.abs(c), 1) + ' egységgel ' + (c > 0 ? 'jobbra' : 'balra') + ' tolódik (a $b(x-c)$ alakban pontosan $c$ az eltolás, nem $\\frac{c}{b}$).'));
        if (a === 0) st.push('**a = 0** elfajuló eset: $0\\cdot f(\\dots) = 0$, a függvény konstans $f(x) = d = ' + X(d) + '$ (ott, ahol az alapfüggvény értelmezett).');
        else st.push('**a = ' + kit.num(a, 1) + ':** ' + (Math.abs(a) === 1 ? 'nincs függőleges nyújtás. ' : 'az $y$ tengely mentén $|a| = ' + X(Math.abs(a)) + '$-szoros nyújtás. ') + (a < 0 ? 'Az előjel miatt tükröződik az $x$ tengelyre.' : (a === 1 ? 'Nincs változás.' : '')));
        st.push('**d = ' + kit.num(d, 1) + ':** ' + (d === 0 ? 'nincs függőleges eltolás.' : kit.num(Math.abs(d), 1) + ' egységgel ' + (d > 0 ? 'felfelé' : 'lefelé') + ' tolódik.'));
        var dm = M.transformDomain(base, b, c), dtxt;
        if (dm.type === 'all') dtxt = '\\mathbb{R}'; else if (dm.type === 'ne') dtxt = 'x \\neq ' + X(dm.x);
        else dtxt = 'x ' + { ge: '\\ge', le: '\\le', gt: '>', lt: '<' }[dm.type] + ' ' + X(dm.x);
        html = '<div class="ans"><div class="md">' + kit.md(T('f(x) = ' + fullTex(a, b, c, d))) + '</div></div>' + kit.steps(st) + '<p class="dim">' + kit.md('Értelmezési tartomány: $' + dtxt + '$.') + '</p>';
        o.innerHTML = html;
      }
      kit.on(kit.$('[data-k="base"]', n), 'change', function () { base = this.value; if (last) upd(last); });
      setTimeout(function () { p = kit.mkPlot(kit.$('.plotbox', n), { xmin: -6, xmax: 6, ymin: -6, ymax: 6 }); kit.bindSliders(n, upd); }, 0);
      kit.$$('[data-preset]', n).forEach(function (bt) { kit.on(bt, 'click', function () {
        var s = bt.dataset.preset.split(','), sel = kit.$('[data-k="base"]', n); sel.value = s[0]; base = s[0];
        setInputs(n, ['a', 'b', 'c', 'd'], s.slice(1));
      }); });
      return n;
    }
  });

  /* ================= 2. MÁSODFOKÚ ================= */
  MO.simDefs.push({
    id: 'masodfoku-fv', title: 'Másodfokú függvény', group: 'függvények', topic: 'fuggvenyek', sub: 'valosfv',
    desc: 'Állítsd az a, b, c együtthatókat, és olvasd le a csúcsot, a teljes négyzetes alakot, a zérushelyeket, az értékkészletet és a monotonitást.',
    formulas: ['f-fv-masodfoku-csucs', 'f-fv-masodfoku-teljes-negyzet'],
    build: function (kit) {
      K = kit; var p = null;
      var n = kit.el('<div>' + kit.slider('a', 'a', -3, 3, 0.5, 1) + kit.slider('b', 'b', -8, 8, 0.5, -4) + kit.slider('c', 'c', -8, 8, 0.5, 3) +
        '<div class="row" style="margin:8px 0"><button class="btn sm" type="button" data-preset="1,-4,3">két zérushely</button><button class="btn sm" type="button" data-preset="1,-4,4">kettős zérushely</button>' +
        '<button class="btn sm" type="button" data-preset="1,-2,3">nincs zérushely</button><button class="btn sm" type="button" data-preset="-1,2,3">lefelé nyíló</button><button class="btn sm" type="button" data-preset="0.5,0,-2">0,5x² − 2</button></div>' +
        kit.plotBox(300) + '<div class="out"></div></div>');
      function upd(v) {
        if (!p) return; var o = kit.$('.out', n), r = M.quadFn(v.a, v.b, v.c);
        if (!r) { p.set({ curves: [{ f: function (x) { return v.b * x + v.c; } }], points: [], segments: [], labels: [] }); o.innerHTML = bad('Ha $a = 0$, akkor ez nem másodfokú függvény, hanem elsőfokú: $f(x) = ' + linTex(v.b, v.c) + '$. Az ábrán az egyenes látszik.'); return; }
        var lo = Math.min(-6, Math.floor(r.v) - 2), hi = Math.max(6, Math.ceil(r.v) + 2);
        var pts = [{ x: r.u, y: r.v, label: 'csúcs' }], labs = [];
        r.roots.forEach(function (z, i) { pts.push({ x: z, y: 0, label: r.roots.length === 1 ? 'x₀' : 'x' + (i ? '₂' : '₁') }); });
        if (r.c !== 0 || true) pts.push({ x: 0, y: r.c, label: 'P' });
        p.set({ xmin: -10, xmax: 10, ymin: lo, ymax: hi, curves: [{ f: function (x) { return v.a * x * x + v.b * x + v.c; } }], points: pts,
          segments: [{ a: [r.u, lo], b: [r.u, hi], dash: [5, 4], dim: true, color: 1 }], labels: [{ x: r.u, y: hi, text: 'x = ' + kit.num(r.u, 2), dx: 6, dy: 14, dim: true }] });
        var uxt = r.u === 0 ? 'x' : '\\left(x' + addTerm(-r.u) + '\\right)', sq = r.u === 0 ? 'x^2' : uxt + '^2', cf = coefTex(r.a, sq) + addTerm(r.v);
        var rr = r.roots.length === 2 ? 'x_1 ' + eqTex(r.roots[0]) + ',\\ x_2 ' + eqTex(r.roots[1]) : r.roots.length === 1 ? 'x_0 ' + eqTex(r.roots[0]) + ' \\text{ (kettős)}' : '\\text{nincs valós zérushely}';
        var ext = r.up ? 'minimum' : 'maximum';
        var ik = r.up ? '\\left[' + X(r.v) + ';\\ \\infty\\right[' : '\\left]-\\infty;\\ ' + X(r.v) + '\\right]';
        var mono = r.up ? 'szigorúan csökken: $\\left]-\\infty;\\ ' + X(r.u) + '\\right]$, szigorúan nő: $\\left[' + X(r.u) + ';\\ \\infty\\right[$' : 'szigorúan nő: $\\left]-\\infty;\\ ' + X(r.u) + '\\right]$, szigorúan csökken: $\\left[' + X(r.u) + ';\\ \\infty\\right[$';
        var rows = [['Csúcs', T('\\left(' + X(r.u) + ';\\ ' + X(r.v) + '\\right)')], ['Teljes négyzetes alak', T('f(x) = ' + cf)], ['Diszkrimináns', T('D = b^2 - 4ac = ' + X(r.D))],
          ['Zérushely(ek)', T(rr)], ['Értékkészlet', T(ik)], ['Monotonitás', mono], ['Szélsőérték', 'a függvénynek ' + ext + 'a van: helye $x = ' + X(r.u) + '$, értéke $' + X(r.v) + '$'], ['Tengelypont', T('(0;\\ ' + X(r.c) + ')')], ['Szimmetriatengely', T('x = ' + X(r.u))]];
        var st = [
          'Az $a = ' + X(r.a) + (r.up ? ' > 0$: a parabola felfelé nyílik.' : ' < 0$: a parabola lefelé nyílik.'),
          'Csúcs: $u = -\\dfrac{b}{2a} = ' + X(r.u) + '$, $v = f(u) = ' + X(r.v) + '$.',
          'Teljes négyzetté alakítás: $f(x) = a(x-u)^2 + v = ' + cf + '$.',
          'Diszkrimináns: $D = ' + X(v.b) + '^2 - 4\\cdot ' + X(r.a) + '\\cdot ' + X(r.c) + ' = ' + X(r.D) + '$. ' + (r.D > 1e-12 ? '$D > 0$, két zérushely: $x_{1,2} = \\dfrac{-b \\pm \\sqrt{D}}{2a}$, tehát $' + rr + '$.' : Math.abs(r.D) <= 1e-12 ? '$D = 0$: egy (kettős) zérushely, a parabola érinti az $x$ tengelyt.' : '$D < 0$: nincs valós zérushely, a parabola nem metszi az $x$ tengelyt.')
        ];
        o.innerHTML = kvHtml(rows) + kit.steps(st);
      }
      setTimeout(function () { p = kit.mkPlot(kit.$('.plotbox', n), { xmin: -10, xmax: 10, ymin: -6, ymax: 6 }); kit.bindSliders(n, upd); }, 0);
      kit.$$('[data-preset]', n).forEach(function (b) { kit.on(b, 'click', function () { setInputs(n, ['a', 'b', 'c'], b.dataset.preset.split(',')); }); });
      return n;
    }
  });

  /* ================= 3. EXP – LOG ================= */
  MO.simDefs.push({
    id: 'exp-log', title: 'Exponenciális és logaritmusfüggvény', group: 'függvények', topic: 'fuggvenyek', sub: 'valosfv',
    desc: 'Az a^x és a log_a x függvény az y = x egyenesre tükrös: húzd a pontot az exponenciális görbén, és nézd a tükörképét.',
    formulas: ['f-fv-exp-log-inverz'],
    build: function (kit) {
      K = kit; var p = null, st = { a: 2, t: 1, q: 8 };
      var n = kit.el('<div>' + kit.slider('a', 'a (az alap, a ≠ 1)', 0.2, 4, 0.1, 2) + kit.slider('t', 'a pont x koordinátája', -3, 3, 0.05, 1) + kit.slider('q', 'q (áttérésnél: log_a q)', 0.5, 64, 0.5, 8) +
        '<div class="row" style="margin:8px 0"><button class="btn sm" type="button" data-preset="2,3,8">2^x és log₂ x</button><button class="btn sm" type="button" data-preset="0.5,2,8">0,5^x (csökkenő)</button><button class="btn sm" type="button" data-preset="3,-1,27">3^x, log₃ 27</button><button class="btn sm" type="button" data-preset="1,1,8">a = 1 (tiltott)</button></div>' +
        kit.plotBox(320) + '<div class="legend"><span><i style="border-color:var(--c0,var(--fg))"></i>a^x</span><span><i style="border-color:var(--c1);border-top-style:dashed"></i>log_a x</span><span><i style="border-color:var(--c2);border-top-style:dotted"></i>y = x</span></div><div class="out"></div></div>');
      function render() {
        if (!p) return; var o = kit.$('.out', n), a = st.a, t = st.t, q = st.q, r = M.expLog(a, t, q);
        var line = { f: function (x) { return x; } };
        if (!r) {
          p.set({ curves: [{ f: function () { return 1; } }, { f: function () { return NaN; } }, line], points: [], segments: [], labels: [] });
          o.innerHTML = bad('Az $a = 1$ nem megengedett alap: $1^x = 1$ minden $x$-re (konstans, nem kölcsönösen egyértelmű), és $\\log_1 x$ nem értelmezhető. Válassz $a > 0$, $a \\neq 1$ értéket.');
          return;
        }
        var pm = r.p, qm = r.mirror, lg = Math.log(a);
        p.set({ curves: [{ f: function (x) { return Math.pow(a, x); } }, { f: function (x) { return x > 0 ? Math.log(x) / lg : NaN; } }, line],
          points: [{ x: pm[0], y: pm[1], label: 'P', drag: true, id: 'P' }, { x: qm[0], y: qm[1], label: 'P′' }],
          segments: [{ a: pm, b: qm, dash: [4, 4], dim: true, color: 2 }], labels: [] });
        var mono = r.inc ? '$a > 1$: mindkét függvény szigorúan monoton nő.' : '$0 < a < 1$: mindkét függvény szigorúan monoton csökken.';
        var rows = [['P ($a^x$ görbén)', T('P\\left(' + X(t) + ';\\ ' + X(pm[1]).replace(/^/, '') + '\\right)' + (nice(pm[1]) ? '' : '\\approx\\left(' + K.tnum(t, 3) + ';\\ ' + K.tnum(pm[1], 4) + '\\right)'))],
          ['P′ (tükörkép)', T('P\'\\left(' + (nice(pm[1]) ? X(pm[1]) : K.tnum(pm[1], 4)) + ';\\ ' + X(t) + '\\right)')],
          ['$a^x$', T('D = \\mathbb{R},\\ R = \\left]0;\\ \\infty\\right[')], ['$\\log_a x$', T('D = \\left]0;\\ \\infty\\right[,\\ R = \\mathbb{R}')], ['Monotonitás', mono]];
        var cb = '$\\log_{' + X(a) + '} ' + X(q) + ' = \\dfrac{\\lg ' + X(q) + '}{\\lg ' + X(a) + '} = \\dfrac{\\ln ' + X(q) + '}{\\ln ' + X(a) + '} ' + eqTex(r.logq) + '$';
        var steps = [
          'A két függvény egymás inverze: $\\log_a\\left(a^x\\right) = x$ és $a^{\\log_a x} = x$. A grafikonok az $y = x$ egyenesre tükrösek.',
          'A $P(t;\\ a^t)$ tükörképe $P\'(a^t;\\ t)$. Itt $t = ' + X(t) + '$, ezért $\\log_a\\left(' + (nice(pm[1]) ? X(pm[1]) : K.tnum(pm[1], 4)) + '\\right) = ' + X(t) + '$.',
          'Fix pontok: az $a^x$ görbe átmegy a $(0;1)$ és $(1;' + X(a) + ')$ ponton, a $\\log_a x$ görbe az $(1;0)$ és $(' + X(a) + ';1)$ ponton. ' + mono,
          '**Áttérés más alapra:** $\\log_a q = \\dfrac{\\log_b q}{\\log_b a}$ (bármely $b > 0,\\ b \\neq 1$ alapra). ' + cb + '. Ellenőrzés: $a^{' + K.tnum(r.logq, 4) + '} \\approx ' + K.tnum(Math.pow(a, r.logq), 3) + '$.'
        ];
        o.innerHTML = kvHtml(rows) + kit.steps(steps);
      }
      setTimeout(function () {
        p = kit.mkPlot(kit.$('.plotbox', n), { xmin: -6, xmax: 6, ymin: -6, ymax: 6, equal: true, onDrag: function (pt, x) {
          var t = Math.max(-3, Math.min(3, Math.round(x * 20) / 20)); st.t = t; var inp = kit.$('[data-in="t"]', n); inp.value = t; inp.dispatchEvent(new Event('input', { bubbles: true }));
        } });
        kit.bindSliders(n, function (v) { st.a = v.a; st.t = v.t; st.q = v.q; render(); });
      }, 0);
      kit.$$('[data-preset]', n).forEach(function (b) { kit.on(b, 'click', function () { setInputs(n, ['a', 't', 'q'], b.dataset.preset.split(',')); }); });
      return n;
    }
  });

  /* ================= 4. TÖRTFÜGGVÉNY ================= */
  MO.simDefs.push({
    id: 'tortfuggveny', title: 'Lineáris törtfüggvény', group: 'függvények', topic: 'fuggvenyek', sub: 'valosfv',
    desc: 'Az f(x) = (ax+b)/(cx+d) függvény aszimptotái, értelmezési tartománya, értékkészlete és átírása k/(x−u)+v alakra.',
    formulas: ['f-fv-transzformacio'],
    build: function (kit) {
      K = kit; var p = null;
      var n = kit.el('<div>' + kit.slider('a', 'a', -6, 6, 1, 2) + kit.slider('b', 'b', -6, 6, 1, 1) + kit.slider('c', 'c', -6, 6, 1, 1) + kit.slider('d', 'd', -6, 6, 1, -1) +
        '<div class="row" style="margin:8px 0"><button class="btn sm" type="button" data-preset="2,1,1,-1">(2x+1)/(x−1)</button><button class="btn sm" type="button" data-preset="1,0,1,-2">x/(x−2)</button>' +
        '<button class="btn sm" type="button" data-preset="-1,3,1,1">(−x+3)/(x+1)</button><button class="btn sm" type="button" data-preset="2,-2,1,-1">lyukas: (2x−2)/(x−1)</button><button class="btn sm" type="button" data-preset="2,1,0,1">c = 0: 2x+1</button></div>' +
        kit.plotBox(320) + '<div class="out"></div></div>');
      function upd(v) {
        if (!p) return; var o = kit.$('.out', n), a = v.a, b = v.b, c = v.c, d = v.d, r = M.fractional(a, b, c, d);
        var head = '$f(x) = \\dfrac{' + (linTex(a, b)) + '}{' + linTex(c, d) + '}$';
        var base = { xmin: -8, xmax: 8, ymin: -8, ymax: 8 }, curves = [{ f: r.f }], segs = [], labs = [], pts = [], circ = [];
        if (r.type === 'undefined') { p.set({ curves: [{ f: function () { return NaN; } }], segments: [], labels: [], points: [], circles: [] }); o.innerHTML = bad('Ha $c = 0$ és $d = 0$, a nevező minden $x$-re $0$: a függvény sehol sincs értelmezve.'); return; }
        var rows = [], st = [];
        if (r.type === 'hyper' || r.type === 'const') {
          segs.push({ a: [r.u, -8], b: [r.u, 8], dash: [5, 4], dim: true, color: 1 }); labs.push({ x: r.u, y: 7, text: 'x = ' + kit.num(r.u, 2), dx: 6, dy: 0, dim: true });
          if (r.type === 'hyper') { segs.push({ a: [-8, r.v], b: [8, r.v], dash: [5, 4], dim: true, color: 1 }); labs.push({ x: -7.8, y: r.v, text: 'y = ' + kit.num(r.v, 2), dx: 0, dy: -8, dim: true, align: 'left' }); }
        }
        var zero = '', yint = '';
        if (r.type === 'hyper') {
          var uT = X(r.u), vT = X(r.v), kT = X(r.k);
          if (a !== 0) { pts.push({ x: -b / a, y: 0, label: 'zérus' }); zero = T('x = -\\dfrac{b}{a} = ' + X(-b / a)); } else zero = 'nincs (a számláló nem nulla állandó)';
          if (d !== 0) { pts.push({ x: 0, y: b / d, label: 'P' }); yint = T('(0;\\ ' + X(b / d) + ')'); } else yint = 'nincs ($x = 0$ nem eleme az értelmezési tartománynak)';
          rows = [['Függvény', head], ['Függőleges aszimptota', T('x = ' + uT)], ['Vízszintes aszimptota', T('y = ' + vT)], ['Értelmezési tartomány', T('x \\in \\mathbb{R} \\setminus \\left\\{' + uT + '\\right\\}')],
            ['Értékkészlet', T('y \\in \\mathbb{R} \\setminus \\left\\{' + vT + '\\right\\}')], ['Zérushely', zero], ['Tengelypont', yint], ['Átírt alak', T('f(x) = \\dfrac{' + kT + '}{x' + addTerm(-r.u) + '}' + addTerm(r.v))],
            ['Monotonitás', r.k > 0 ? 'mindkét ágon szigorúan csökken' : 'mindkét ágon szigorúan nő']];
          st = ['**Polinomosztás:** $ax + b = \\dfrac{a}{c}\\,(cx+d) + \\left(b - \\dfrac{ad}{c}\\right)$, ezért $f(x) = \\dfrac{a}{c} + \\dfrac{b - \\frac{ad}{c}}{cx+d}$. Itt $\\dfrac{a}{c} = ' + vT + '$.',
            'A nevezőből kiemelünk $c$-t: $cx + d = c\\left(x + \\dfrac{d}{c}\\right) = c\\,(x - u)$, ahol $u = -\\dfrac{d}{c} = ' + uT + '$.',
            'Így $f(x) = \\dfrac{k}{x - u} + v$ alakú, ahol $k = \\dfrac{bc - ad}{c^2} = ' + kT + '$, $u = ' + uT + '$, $v = ' + vT + '$.',
            'A grafikon az $y = \\dfrac{k}{x}$ hiperbola eltoltja: az aszimptoták $x = ' + uT + '$ és $y = ' + vT + '$. ' + (r.k > 0 ? '$k > 0$: az ágak a metszéspont fölött-jobbra és alatta-balra vannak.' : '$k < 0$: az ágak a metszéspont fölött-balra és alatta-jobbra vannak.')];
        } else if (r.type === 'const') {
          circ.push({ x: r.u, y: r.v, r: 0.2, fill: false, color: 0 });
          labs.push({ x: r.u, y: r.v, text: 'lyuk', dx: 8, dy: -10 });
          rows = [['Függvény', head], ['Egyszerűsítve', T('f(x) = ' + X(r.v)) + ', ha $x \\neq ' + X(r.u) + '$'], ['Értelmezési tartomány', T('x \\in \\mathbb{R} \\setminus \\left\\{' + X(r.u) + '\\right\\}')], ['Értékkészlet', T('\\left\\{' + X(r.v) + '\\right\\}')],
            ['Lyuk', T('\\left(' + X(r.u) + ';\\ ' + X(r.v) + '\\right)')], ['Zérushely', r.v === 0 ? 'minden $x \\neq ' + X(r.u) + '$' : 'nincs'], ['Tengelypont', r.u !== 0 ? T('(0;\\ ' + X(r.v) + ')') : 'nincs ($x = 0$ nem eleme az értelmezési tartománynak)']];
          if (r.u !== 0 && r.v !== 0) pts.push({ x: 0, y: r.v, label: 'P' });
          st = ['Elfajuló eset: $ad - bc = ' + X(a * d) + ' - ' + X(b * c) + ' = 0$, ezért a számláló a nevező állandószorosa: $ax + b = \\dfrac{a}{c}(cx+d)$.',
            'Egyszerűsítés után $f(x) = \\dfrac{a}{c} = ' + X(r.v) + '$, de csak ott, ahol a nevező nem nulla: $x \\neq ' + X(r.u) + '$.',
            'A grafikon egy vízszintes egyenes, amelyből az $x = ' + X(r.u) + '$ pontot kihagytuk (lyuk). Nincs aszimptota.'];
        } else {
          var m = r.m, q = r.q;
          rows = [['Függvény', head], ['Átírva', T('f(x) = ' + linTex(m, q)) + ' (elsőfokú, $c = 0$)'], ['Aszimptota', 'nincs'], ['Értelmezési tartomány', T('\\mathbb{R}')], ['Értékkészlet', m !== 0 ? T('\\mathbb{R}') : T('\\left\\{' + X(q) + '\\right\\}')],
            ['Zérushely', m !== 0 ? T('x = ' + X(-q / m)) : (q === 0 ? 'minden valós szám' : 'nincs')], ['Tengelypont', T('(0;\\ ' + X(q) + ')')]];
          if (m !== 0) pts.push({ x: -q / m, y: 0, label: 'zérus' }); pts.push({ x: 0, y: q, label: 'P' });
          st = ['Elfajuló eset: $c = 0$, ezért a nevező az állandó $d = ' + X(d) + ' \\neq 0$.', '$f(x) = \\dfrac{a}{d}\\,x + \\dfrac{b}{d} = ' + linTex(m, q) + '$: ez egy egyenes, nincs aszimptota.'];
        }
        p.set({ xmin: -8, xmax: 8, ymin: -8, ymax: 8, curves: curves, segments: segs, labels: labs, points: pts, circles: circ });
        o.innerHTML = kvHtml(rows) + kit.steps(st);
      }
      setTimeout(function () { p = kit.mkPlot(kit.$('.plotbox', n), { xmin: -8, xmax: 8, ymin: -8, ymax: 8, equal: true }); kit.bindSliders(n, upd); }, 0);
      kit.$$('[data-preset]', n).forEach(function (b) { kit.on(b, 'click', function () { setInputs(n, ['a', 'b', 'c', 'd'], b.dataset.preset.split(',')); }); });
      return n;
    }
  });

  /* ================= 5. ABSZOLÚTÉRTÉK ================= */
  MO.simDefs.push({
    id: 'abszolutertek', title: 'Abszolútérték-függvény darabokra bontva', group: 'függvények', topic: 'fuggvenyek', sub: 'valosfv',
    desc: 'Az a|x−u|+v és a |x−p|+|x−q| függvény szakaszonként lineáris képlete, szélsőértéke, és az y = k egyenessel a megoldások száma.',
    formulas: ['f-fv-transzformacio'],
    build: function (kit) {
      K = kit; var p = null, mode = 1, last = null;
      var n = kit.el('<div><div class="row" style="margin-bottom:8px"><button class="btn sm" type="button" data-mode="1" aria-pressed="true">a|x−u|+v</button><button class="btn sm" type="button" data-mode="2" aria-pressed="false">|x−p|+|x−q|</button></div>' +
        '<div data-g="1">' + kit.slider('a', 'a', -3, 3, 0.5, 1) + kit.slider('u', 'u', -5, 5, 0.5, 1) + kit.slider('v', 'v', -5, 5, 0.5, -2) + '</div>' +
        '<div data-g="2" style="display:none">' + kit.slider('p', 'p', -5, 5, 0.5, -2) + kit.slider('q', 'q', -5, 5, 0.5, 3) + '</div>' + kit.slider('k', 'k (az y = k egyenes)', -4, 10, 0.5, 3) +
        '<div class="row" style="margin:8px 0"><button class="btn sm" type="button" data-preset="1,2,1,-3,-2,3,1">2|x−1|−3 = 1</button><button class="btn sm" type="button" data-preset="1,-1,-1,4,-2,3,2">−|x+1|+4 = 2</button>' +
        '<button class="btn sm" type="button" data-preset="2,1,0,0,-2,3,7">|x+2|+|x−3| = 7</button><button class="btn sm" type="button" data-preset="2,1,0,0,1,4,3">|x−1|+|x−4| = 3</button></div>' +
        kit.plotBox(320) + '<div class="out"></div></div>');
      function setMode(m) {
        mode = m; kit.$$('[data-mode]', n).forEach(function (b) { b.setAttribute('aria-pressed', String(+b.dataset.mode === m)); });
        kit.$$('[data-g]', n).forEach(function (g) { g.style.display = (+g.dataset.g === m) ? '' : 'none'; }); if (last) upd(last);
      }
      function solText(sol, kv) {
        if (sol === 'all') return '**végtelen sok** megoldás: minden valós $x$';
        if (sol.from !== undefined) return '**végtelen sok** megoldás: minden $x \\in \\left[' + X(sol.from) + ';\\ ' + X(sol.to) + '\\right]$';
        if (sol.length === 0) return '**nincs megoldás**';
        if (sol.length === 1) return '**1 megoldás:** $x = ' + X(sol[0]) + '$';
        return '**2 megoldás:** $x_1 = ' + X(sol[0]) + '$ és $x_2 = ' + X(sol[1]) + '$';
      }
      function upd(v) {
        last = v; if (!p) return; var o = kit.$('.out', n), k = v.k, f, r, st, rows, sol, pts = [], extra = [];
        if (mode === 1) {
          var a = v.a, u = v.u, vv = v.v; r = M.absLinear(a, u, vv, k); sol = r.sol;
          f = function (x) { return a * Math.abs(x - u) + vv; };
          pts.push({ x: u, y: vv, label: a === 0 ? 'f' : (a > 0 ? 'min' : 'max') });
          var ft = (a === 0) ? X(vv) : coefTex(a, '\\left|x' + addTerm(-u) + '\\right|').replace('\\left|x\\right|', '|x|') + addTerm(vv);
          if (u === 0 && a !== 0) ft = coefTex(a, '\\left|x\\right|') + addTerm(vv);
          rows = [['Függvény', T('f(x) = ' + ft)], ['Töréspont', T('x = ' + X(u))], ['Ha $x < ' + X(u) + '$', T('f(x) = ' + linTex(r.left.m, r.left.q))], ['Ha $x \\ge ' + X(u) + '$', T('f(x) = ' + linTex(r.right.m, r.right.q))],
            ['Szélsőérték', a === 0 ? 'állandó függvény, értéke $' + X(vv) + '$' : (a > 0 ? 'minimum' : 'maximum') + ', helye $x = ' + X(u) + '$, értéke $' + X(vv) + '$']];
          st = ['**Töréspont:** ott van, ahol az abszolútérték belseje nulla: $x - ' + X(u).replace(/^-/, '(-') + (u < 0 ? ')' : '') + ' = 0$, azaz $x = ' + X(u) + '$.',
            'Ha $x < ' + X(u) + '$: $|x - u| = -(x - u)$, ezért $f(x) = ' + (a === 0 ? X(vv) : X(a) + '\\cdot\\left(-(x' + addTerm(-u) + ')\\right)' + addTerm(vv)) + ' = ' + linTex(r.left.m, r.left.q) + '$.',
            'Ha $x \\ge ' + X(u) + '$: $|x - u| = x - u$, ezért $f(x) = ' + linTex(r.right.m, r.right.q) + '$.',
            a === 0 ? 'Elfajuló eset: $a = 0$, a függvény állandó, nincs szélsőérték-hely.' : '**Szélsőérték:** $|x-u| \\ge 0$, és $0$-t csak $x = u$-nál vesz fel, ezért a törésponton ' + (a > 0 ? 'minimum' : 'maximum') + ' van: $' + X(vv) + '$.',
            '**Egyenlet:** $' + (a === 0 ? X(vv) : coefTex(a, '|x' + addTerm(-u) + '|') + addTerm(vv)) + ' = ' + X(k) + '$. ' + (a === 0 ? 'Az $a = 0$ miatt ' : '$|x - u| = \\dfrac{k - v}{a} = ' + X((k - vv) / a) + '$, ezért ') + solText(sol) + '.'];
        } else {
          var pp = v.p, qq = v.q; r = M.absSum(pp, qq, k); sol = r.sol; f = function (x) { return M.absSumValue(pp, qq, x); };
          pts.push({ x: r.lo, y: r.min, label: r.lo === r.hi ? 'min' : '' }); if (r.lo !== r.hi) pts.push({ x: r.hi, y: r.min, label: '' });
          rows = [['Függvény', T('f(x) = |x' + addTerm(-pp) + '| + |x' + addTerm(-qq) + '|')], ['Töréspontok', T('x = ' + X(r.lo) + ',\\ x = ' + X(r.hi))],
            ['Ha $x < ' + X(r.lo) + '$', T('f(x) = ' + linTex(-2, pp + qq))], ['Ha $' + X(r.lo) + ' \\le x \\le ' + X(r.hi) + '$', T('f(x) = ' + X(r.min))], ['Ha $x > ' + X(r.hi) + '$', T('f(x) = ' + linTex(2, -(pp + qq)))],
            ['Minimum', 'értéke $' + X(r.min) + '$ (a két szám távolsága), ' + (r.lo === r.hi ? 'helye $x = ' + X(r.lo) + '$' : 'helye az egész $\\left[' + X(r.lo) + ';\\ ' + X(r.hi) + '\\right]$ szakasz') + '; maximum nincs']];
          st = ['**Töréspontok:** $x = ' + X(pp) + '$ és $x = ' + X(qq) + '$; ezek három szakaszra osztják a számegyenest.',
            'Ha $x < ' + X(r.lo) + '$: mindkét abszolútérték belseje negatív: $f(x) = (' + X(pp) + ' - x) + (' + X(qq) + ' - x) = ' + linTex(-2, pp + qq) + '$.',
            'Ha $' + X(r.lo) + ' \\le x \\le ' + X(r.hi) + '$: az egyik belseje nemnegatív, a másiké nempozitív, az $x$-ek kiesnek: $f(x) = ' + X(r.min) + '$ (állandó).',
            'Ha $x > ' + X(r.hi) + '$: mindkettő pozitív: $f(x) = ' + linTex(2, -(pp + qq)) + '$.',
            '**Egyenlet:** $|x - ' + X(pp) + '| + |x - ' + X(qq) + '| = ' + X(k) + '$. A minimum $' + X(r.min) + '$, ezért ' + (k < r.min - 1e-12 ? '$k < ' + X(r.min) + '$: ' : Math.abs(k - r.min) <= 1e-12 ? '$k = ' + X(r.min) + '$: ' : '$k > ' + X(r.min) + '$, a két ferde szakaszon $x = \\dfrac{' + X(pp + qq) + ' \\mp ' + X(k) + '}{2}$: ') + solText(sol) + '.'];
        }
        var xs = sol === 'all' ? [] : (sol.from !== undefined ? [] : sol);
        xs.forEach(function (x, i) { pts.push({ x: x, y: k, label: 'x' + (xs.length === 1 ? '' : i ? '₂' : '₁') }); });
        var segs = [{ a: [-12, k], b: [12, k], dash: [6, 4], color: 2 }];
        if (sol && sol.from !== undefined) segs.push({ a: [sol.from, k], b: [sol.to, k], w: 4, color: 2 });
        p.set({ curves: [{ f: f }], points: pts, segments: segs, labels: [{ y: k, text: 'y = ' + kit.num(k, 1), dy: -8, dim: true, align: 'left', x: -7.8 }] });
        rows.push(['Az $y = k$ egyenessel', solText(sol)]);
        o.innerHTML = kvHtml(rows) + kit.steps(st);
      }
      kit.$$('[data-mode]', n).forEach(function (b) { kit.on(b, 'click', function () { setMode(+b.dataset.mode); }); });
      setTimeout(function () { p = kit.mkPlot(kit.$('.plotbox', n), { xmin: -8, xmax: 8, ymin: -6, ymax: 12 }); kit.bindSliders(n, upd); }, 0);
      kit.$$('[data-preset]', n).forEach(function (b) { kit.on(b, 'click', function () {
        var s = b.dataset.preset.split(','); setMode(+s[0]); setInputs(n, ['a', 'u', 'v', 'p', 'q', 'k'], s.slice(1));
      }); });
      return n;
    }
  });
})(typeof window !== 'undefined' ? window : globalThis);
