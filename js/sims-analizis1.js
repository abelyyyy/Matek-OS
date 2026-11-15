(function (root) {
  'use strict';
  var MO = root.MO = root.MO || {};
  var M = MO.models = MO.models || {};
  MO.simDefs = MO.simDefs || [];

  /* ================= MODELLEK (DOM-független) ================= */

  /* --- számtani / mértani sorozat --- */
  M.seqTerms = function (type, a1, r, n) {
    var t = [], s = [], acc = 0, i, a;
    for (i = 1; i <= n; i++) {
      a = type === 'szt' ? a1 + (i - 1) * r : a1 * Math.pow(r, i - 1);
      acc += a; t.push(a); s.push(acc);
    }
    var an = t[n - 1], Sn;
    if (type === 'szt') Sn = n * (a1 + an) / 2;
    else Sn = r === 1 ? n * a1 : a1 * (Math.pow(r, n) - 1) / (r - 1);
    var inf = (type === 'mert' && Math.abs(r) < 1) ? a1 / (1 - r) : null;
    return { terms: t, sums: s, an: an, Sn: Sn, inf: inf };
  };

  /* --- ε–N: a sorozatok. thr(ε): a |aₙ − L| < ε feltétel ekvivalens az n > thr(ε) feltétellel --- */
  M.epsSeqs = [
    { id: 'inv', name: '1/n', tex: '\\dfrac{1}{n}', f: function (n) { return 1 / n; }, L: 0, thr: function (e) { return 1 / e; },
      thrTex: '\\left|\\dfrac1n-0\\right|=\\dfrac1n<\\varepsilon \\iff n>\\dfrac{1}{\\varepsilon}', thrVal: function (e) { return '\\dfrac{1}{' + MO.tnum(e, 4) + '}'; } },
    { id: 'frac', name: '(2n+1)/(n+3)', tex: '\\dfrac{2n+1}{n+3}', f: function (n) { return (2 * n + 1) / (n + 3); }, L: 2, thr: function (e) { return 5 / e - 3; },
      thrTex: '\\left|\\dfrac{2n+1}{n+3}-2\\right|=\\dfrac{5}{n+3}<\\varepsilon \\iff n>\\dfrac{5}{\\varepsilon}-3', thrVal: function (e) { return '\\dfrac{5}{' + MO.tnum(e, 4) + '}-3'; } },
    { id: 'alt', name: '(−1)ⁿ/n', tex: '\\dfrac{(-1)^n}{n}', f: function (n) { return (n % 2 ? -1 : 1) / n; }, L: 0, thr: function (e) { return 1 / e; },
      thrTex: '\\left|\\dfrac{(-1)^n}{n}-0\\right|=\\dfrac1n<\\varepsilon \\iff n>\\dfrac{1}{\\varepsilon}', thrVal: function (e) { return '\\dfrac{1}{' + MO.tnum(e, 4) + '}'; } },
    { id: 'geo', name: '0,8ⁿ', tex: '0{,}8^n', f: function (n) { return Math.pow(0.8, n); }, L: 0, thr: function (e) { return Math.log(e) / Math.log(0.8); },
      thrTex: '\\left|0{,}8^n-0\\right|=0{,}8^n<\\varepsilon \\iff n>\\dfrac{\\ln\\varepsilon}{\\ln 0{,}8}', thrVal: function (e) { return '\\dfrac{\\ln ' + MO.tnum(e, 4) + '}{\\ln 0{,}8}'; } },
    { id: 'osc', name: '(−1)ⁿ', tex: '(-1)^n', f: function (n) { return n % 2 ? -1 : 1; }, L: null },
    { id: 'quad', name: 'n²/(n+1)', tex: '\\dfrac{n^2}{n+1}', f: function (n) { return n * n / (n + 1); }, L: null }
  ];
  M.epsSeq = function (id) { for (var i = 0; i < M.epsSeqs.length; i++) if (M.epsSeqs[i].id === id) return M.epsSeqs[i]; return null; };
  /* Küszöbindex: a legkisebb N, amelytől kezdve minden tag |aₙ − L| < ε. Konvergens sorozatra képletből; divergensre null. */
  M.epsN = function (id, eps) {
    var s = M.epsSeq(id);
    if (!s || s.L === null || !(eps > 0)) return null;
    var N = Math.max(1, Math.floor(s.thr(eps)) + 1);
    /* lebegőpontos kerekítés elleni biztosíték (egyenlőségi határesetekben); a |aₙ − L| minden itt szereplő sorozatnál monoton csökken */
    while (!(Math.abs(s.f(N) - s.L) < eps)) N++;
    while (N > 1 && Math.abs(s.f(N - 1) - s.L) < eps) N--;
    return N;
  };

  /* --- rekurzív sorozat, pókháló --- */
  M.cosFix = function () { var lo = 0, hi = 1, k; for (k = 0; k < 100; k++) { var m = (lo + hi) / 2; if (Math.cos(m) - m > 0) lo = m; else hi = m; } return (lo + hi) / 2; };
  M.cobDefs = [
    { id: 'lin', name: '0,5x + 1', tex: '0{,}5x+1', f: function (x) { return 0.5 * x + 1; }, df: function () { return 0.5; }, fix: function () { return [2]; },
      fixTex: function () { return '0{,}5x+1=x \\iff x=2'; }, dfTex: "f'(x)=0{,}5", x0: [-2, 6, 0], view: [-2, 6] },
    { id: 'cos', name: 'cos x', tex: '\\cos x', f: function (x) { return Math.cos(x); }, df: function (x) { return -Math.sin(x); }, fix: function () { return [M.cosFix()]; },
      fixTex: function () { return '\\cos x=x \;\\Rightarrow\; x^*\\approx 0{,}7391 \;\\text{(numerikusan)}'; }, dfTex: "f'(x)=-\\sin x", x0: [-3, 3, 1], view: [-1.5, 2] },
    { id: 'log', name: 'r·x(1−x)', tex: 'r\\,x(1-x)', param: true, f: function (x, r) { return r * x * (1 - x); }, df: function (x, r) { return r * (1 - 2 * x); },
      fix: function (r) { var o = [0], q = 1 - 1 / r; if (Math.abs(q) > 1e-12) o.push(q); return o; },
      fixTex: function (r) { return 'r\\,x(1-x)=x \\iff x=0 \\text{ vagy } x=1-\\dfrac1r' + (Math.abs(1 - 1 / r) < 1e-12 ? ' \;(\\text{most egybeesnek})' : ''); }, dfTex: "f'(x)=r(1-2x)", x0: [0, 1, 0.2], view: [-0.1, 1.1] },
    { id: 'sqrt', name: '√(x+2)', tex: '\\sqrt{x+2}', f: function (x) { return x + 2 >= 0 ? Math.sqrt(x + 2) : NaN; }, df: function (x) { return 1 / (2 * Math.sqrt(x + 2)); }, fix: function () { return [2]; },
      fixTex: function () { return '\\sqrt{x+2}=x \\iff x^2=x+2,\\ x\\ge 0 \\iff x=2'; }, dfTex: "f'(x)=\\dfrac{1}{2\\sqrt{x+2}}", x0: [-2, 6, 0], view: [-2, 6] },
    { id: 'aff', name: '2x − 1', tex: '2x-1', f: function (x) { return 2 * x - 1; }, df: function () { return 2; }, fix: function () { return [1]; },
      fixTex: function () { return '2x-1=x \\iff x=1'; }, dfTex: "f'(x)=2", x0: [-1, 3, 1.1], view: [-1, 3] }
  ];
  M.cobDef = function (id) { for (var i = 0; i < M.cobDefs.length; i++) if (M.cobDefs[i].id === id) return M.cobDefs[i]; return null; };
  /* aₙ₊₁ = f(aₙ), a₁ = x0; n tagot ad (ha kilép az értelmezési tartományból, rövidebb) */
  M.cobTerms = function (def, r, x0, n) {
    var t = [x0], i, nx;
    for (i = 1; i < n; i++) { nx = def.f(t[i - 1], r); if (!isFinite(nx)) break; t.push(nx); }
    return t;
  };
  /* fixpontok és osztályozásuk |f′| alapján */
  M.cobFix = function (def, r) {
    return def.fix(r).map(function (x) {
      var d = def.df(x, r), a = Math.abs(d), kind = a < 1 - 1e-9 ? 'vonzó' : a > 1 + 1e-9 ? 'taszító' : 'határeset';
      return { x: x, d: d, kind: kind };
    });
  };
  /* a kiszámolt tagok alapján: konvergál / két érték között ingadozik / távolodik / nem eldönthető */
  M.cobVerdict = function (t) {
    var n = t.length, last = t[n - 1], pr = t[n - 2], tol = function (v) { return 1e-6 * (1 + Math.abs(v)); };
    if (n < 3) return { kind: 'kevés' };
    if (Math.abs(last - pr) <= tol(last)) return { kind: 'konv', limit: last };
    if (n >= 4) {
      var d1 = Math.abs(last - pr), d2 = Math.abs(pr - t[n - 3]), d3 = Math.abs(t[n - 3] - t[n - 4]);
      if (d1 < 0.95 * d2 && d2 < 0.95 * d3 && d1 < 0.05 * (1 + Math.abs(last))) return { kind: 'konv', limit: last , approx: true };
      if (d1 > 1.5 * d2 && d2 > 1.5 * d3 && Math.abs(last) > Math.abs(t[0]) + 1) return { kind: 'diverg' };
      if (Math.abs(last - t[n - 3]) <= tol(last)) return { kind: 'per2', a: last, b: pr };
    }
    return { kind: 'nem' };
  };

  /* --- derivált --- */
  M.diffQuot = function (f, x0, h) { return (f(x0 + h) - f(x0)) / h; };
  M.oneSided = function (f, x0) {
    var h = 1e-6 * Math.max(1, Math.abs(x0)), r = (f(x0 + h) - f(x0)) / h, l = (f(x0) - f(x0 - h)) / h;
    var ok = isFinite(r) && isFinite(l) && Math.abs(r - l) <= 1e-3 * (1 + Math.max(Math.abs(r), Math.abs(l)));
    return { right: r, left: l, smooth: ok };
  };
  M.tangent = function (m, x0, y0) { return { m: m, b: y0 - m * x0 }; };
  /* az ábra függőleges tartománya: a görbe 3–97 százalékos értékei, kis ráhagyással */
  M.autoY = function (fs, xmin, xmax, extra) {
    var v = [], i, k, x;
    (fs.length === undefined ? [fs] : fs).forEach(function (f) { for (i = 0; i <= 240; i++) { x = xmin + (xmax - xmin) * i / 240; k = f(x); if (isFinite(k)) v.push(k); } });
    (extra || []).forEach(function (e) { if (isFinite(e)) v.push(e); });
    if (!v.length) return [-5, 5];
    v.sort(function (a, b) { return a - b; });
    var lo = v[Math.floor(0.03 * (v.length - 1))], hi = v[Math.ceil(0.97 * (v.length - 1))];
    (extra || []).forEach(function (e) { if (isFinite(e)) { lo = Math.min(lo, e); hi = Math.max(hi, e); } });
    if (hi - lo < 1e-9) { lo -= 1; hi += 1; }
    var pad = 0.12 * (hi - lo);
    return [lo - pad, hi + pad];
  };

  /* --- függvényvizsgálat --- */
  M.classify = function (g, a, b, roots) {
    var inner = roots.filter(function (r) { return r > a && r < b; }), tab = M.signTable(g, a, b, inner);
    return { inner: inner, tab: tab, changes: inner.map(function (x, i) { return { x: x, before: tab[i].sign, after: tab[i + 1].sign }; }) };
  };
  M.extrema = function (f, df, a, b, r1) {
    return M.classify(df, a, b, r1).changes.map(function (c) {
      var kind = c.before === '+' && c.after === '−' ? 'max' : c.before === '−' && c.after === '+' ? 'min' : 'nincs';
      return { x: c.x, y: f(c.x), kind: kind };
    });
  };
  M.inflections = function (f, d2, a, b, r2) {
    return M.classify(d2, a, b, r2).changes.filter(function (c) { return (c.before === '+' && c.after === '−') || (c.before === '−' && c.after === '+'); }).map(function (c) {
      return { x: c.x, y: f(c.x), kind: c.before === '+' ? 'konvex→konkáv' : 'konkáv→konvex' };
    });
  };

  /* ================= SEGÉDEK (DOM nélkül) ================= */
  function setIn(kit, n, key, val) { var i = kit.$('[data-in="' + key + '"]', n); if (!i) return; i.value = val; i.dispatchEvent(new Event('input', { bubbles: true })); }
  function setSel(kit, n, key, val) { var s = kit.$('[data-sel="' + key + '"]', n); s.value = val; s.dispatchEvent(new Event('change', { bubbles: true })); }
  function par(kit, x, d) { return x < 0 ? '\\left(' + kit.tnum(x, d === undefined ? 4 : d) + '\\right)' : kit.tnum(x, d === undefined ? 4 : d); }
  function rv(kit, x) {
    if (!isFinite(x)) return ' \\text{ (nem értelmezett)}';
    var r = Math.round(x * 1e4) / 1e4, ex = Math.abs(x - r) < 1e-9 * Math.max(1, Math.abs(x));
    return (ex ? ' = ' : ' \\approx ') + (Math.abs(r) >= 1e4 ? kit.tbig(r) : kit.tnum(r, 4));
  }
  function lineTex(kit, m, b) {
    var mt = Math.abs(m - 1) < 1e-9 ? '' : Math.abs(m + 1) < 1e-9 ? '-' : kit.tnum(m, 4), s = '';
    if (Math.abs(m) < 1e-9) return kit.tnum(b, 4);
    s = mt + 'x';
    if (Math.abs(b) >= 5e-5) s += (b > 0 ? ' + ' : ' - ') + kit.tnum(Math.abs(b), 4);
    return s;
  }
  function msg(kit, cls, t) { return '<p class="msg ' + cls + '">' + kit.esc(t) + '</p>'; }
  function legendHtml(items) { return '<div class="legend">' + items.map(function (it) { return '<span><i style="border-color:var(--c' + it[0] + ');border-top-style:' + it[1] + '"></i>' + it[2] + '</span>'; }).join('') + '</div>'; }
  function tbl(rows) { return '<div class="tblwrap"><table class="t">' + rows.map(function (r, i) { return '<tr>' + r.map(function (c) { return (i === 0 || false ? '<th>' : '<td>') + c + (i === 0 ? '</th>' : '</td>'); }).join('') + '</tr>'; }).join('') + '</table></div>'; }
  function ivHead(t) { return ']' + MO.num(t.from, 4) + '; ' + MO.num(t.to, 4) + '['; }

  /* ================= 1. SZÁMTANI ÉS MÉRTANI SOROZAT ================= */
  MO.simDefs.push({
    id: 'sorozat', title: 'Számtani és mértani sorozat', topic: 'fuggvenyek', sub: 'sorozatok', group: 'sorozatok',
    desc: 'Állítsd be az első tagot, a különbséget vagy hányadost és n-et: látod a tagokat, a részletösszegeket és a képleteket.',
    formulas: ['f-szamtani-tag', 'f-szamtani-osszeg', 'f-vegtelen-sor'],
    build: function (kit) {
      var n = kit.el('<div>' +
        '<label class="f"><span>a sorozat típusa</span><select data-sel="type"><option value="szt">számtani sorozat</option><option value="mert">mértani sorozat</option></select></label>' +
        kit.slider('a1', 'első tag (a₁)', -10, 10, 0.5, 2) +
        '<div data-wrap="d">' + kit.slider('d', 'különbség (d)', -5, 5, 0.5, 2) + '</div>' +
        '<div data-wrap="q" style="display:none">' + kit.slider('q', 'hányados (q)', -2, 2, 0.1, 2) + '</div>' +
        kit.slider('n', 'a tagok száma (n)', 1, 30, 1, 8) +
        '<div class="row" style="margin:10px 0"><button class="btn sm" type="button" data-preset="szt,3,2,10">számtani: a₁ = 3, d = 2</button>' +
        '<button class="btn sm" type="button" data-preset="szt,20,-3,8">csökkenő számtani</button>' +
        '<button class="btn sm" type="button" data-preset="mert,2,2,10">mértani: q = 2</button>' +
        '<button class="btn sm" type="button" data-preset="mert,16,0.5,12">végtelen sor: q = 0,5</button>' +
        '<button class="btn sm" type="button" data-preset="mert,5,1,6">q = 1 eset</button></div>' +
        kit.plotBox(280) + legendHtml([[0, 'solid', 'fehér pontok: aₖ (a tagok)'], [1, 'solid', 'kék pontok: Sₖ (részletösszegek)']]) +
        '<div class="out"></div></div>');
      var p = null, last = null;
      function getV() {
        var v = {}; kit.$$('[data-in]', n).forEach(function (i) { v[i.dataset.in] = parseFloat(i.value); });
        v.type = kit.$('[data-sel="type"]', n).value; return v;
      }
      function upd(v) {
        v = v || getV(); last = v;
        var mert = v.type === 'mert';
        kit.$('[data-wrap="d"]', n).style.display = mert ? 'none' : '';
        kit.$('[data-wrap="q"]', n).style.display = mert ? '' : 'none';
        var r = mert ? Math.round(v.q * 1000) / 1000 : v.d, N = v.n, a1 = v.a1;
        var R = M.seqTerms(v.type, a1, r, N), o = kit.$('.out', n), h = '', steps = [];
        if (mert && (a1 === 0 || r === 0)) h += msg(kit, 'bad', a1 === 0 ? 'Elfajuló eset: ha a₁ = 0, minden tag 0 (a mértani sorozat első tagja nem lehet 0).' : 'Elfajuló eset: ha q = 0, a második tagtól kezdve minden tag 0 (a mértani sorozat hányadosa nem lehet 0).');
        var T = function (x) { return kit.tnum(x, 4); };
        if (!mert) {
          steps.push('**Általános tag:** $a_n = a_1 + (n-1)\\,d = ' + T(a1) + ' + (' + N + '-1)\\cdot' + par(kit, r) + rv(kit, R.an) + '$.');
          steps.push('**Az első n tag összege:** $S_n = \\dfrac{n\\,(a_1+a_n)}{2} = \\dfrac{' + N + '\\cdot(' + T(a1) + (R.an < 0 ? '+' + par(kit, R.an) : '+' + T(R.an)) + ')}{2}' + rv(kit, R.Sn) + '$.');
        } else {
          steps.push('**Általános tag:** $a_n = a_1\\cdot q^{\\,n-1} = ' + T(a1) + '\\cdot' + par(kit, r) + '^{' + (N - 1) + '}' + rv(kit, R.an) + '$.');
          if (r === 1) steps.push('**q = 1 külön eset:** minden tag egyenlő, ezért $S_n = n\\cdot a_1 = ' + N + '\\cdot' + T(a1) + rv(kit, R.Sn) + '$. (A $\\dfrac{a_1(q^n-1)}{q-1}$ alak itt 0-val osztana.)');
          else steps.push('**Az első n tag összege** ($q\\neq1$): $S_n = a_1\\cdot\\dfrac{q^n-1}{q-1} = ' + T(a1) + '\\cdot\\dfrac{' + par(kit, r) + '^{' + N + '}-1}{' + par(kit, r) + '-1}' + rv(kit, R.Sn) + '$.');
          if (a1 !== 0 && r !== 0) {
            if (R.inf !== null) steps.push('**Végtelen mértani sor:** mivel $|q| = ' + T(Math.abs(r)) + ' < 1$, a részletösszegek egy véges értékhez tartanak: $S_\\infty = \\dfrac{a_1}{1-q} = \\dfrac{' + T(a1) + '}{1-' + par(kit, r) + '}' + rv(kit, R.inf) + '$. Az ábrán ez a szaggatott vízszintes vonal.');
            else steps.push('**Végtelen mértani sor:** $|q| = ' + T(Math.abs(r)) + ' \\ge 1$, ezért a végtelen sor nem konvergens, nincs véges összege.');
          }
        }
        steps.push('Ellenőrzés: a táblázatban az $S_k$ sor a tagok egyenkénti összeadásából jön ki, az utolsó érték a képlettel egyezik.');
        var rows = ['<th>k</th>', '<td>aₖ</td>', '<td>Sₖ</td>'];
        R.terms.forEach(function (t, i) { rows[0] += '<th>' + (i + 1) + '</th>'; rows[1] += '<td>' + kit.num(t, 3) + '</td>'; rows[2] += '<td>' + kit.num(R.sums[i], 3) + '</td>'; });
        h += '<dl class="kv"><dt>a<sub>' + N + '</sub></dt><dd>' + kit.tex('a_{' + N + '}' + rv(kit, R.an)) + '</dd><dt>S<sub>' + N + '</sub></dt><dd>' + kit.tex('S_{' + N + '}' + rv(kit, R.Sn)) + '</dd>' +
          (R.inf !== null && a1 !== 0 && r !== 0 ? '<dt>S<sub>∞</sub></dt><dd>' + kit.tex('S_\\infty' + rv(kit, R.inf)) + '</dd>' : '') + '</dl>' +
          kit.steps(steps) + '<div class="lab" style="margin-top:12px">a tagok és a részletösszegek</div><div class="tblwrap"><table class="t"><tr>' + rows[0] + '</tr><tr>' + rows[1] + '</tr><tr>' + rows[2] + '</tr></table></div>' +
          '<p class="dim">A tagok diszkrét pontok (a sorozat a pozitív egészeken értelmezett függvény), ezért nincsenek összekötve. A táblázat értékei 3 tizedesre kerekítettek.</p>';
        o.innerHTML = h;
        if (!p) return;
        var pts = [], vals = [0], xmax = Math.max(N + 2, 6);
        R.terms.forEach(function (t, i) { pts.push({ x: i + 1, y: t, color: 0, label: i === N - 1 ? 'a' + (N) : undefined }); vals.push(t); });
        R.sums.forEach(function (s, i) { pts.push({ x: i + 1, y: s, color: 1, label: i === N - 1 ? 'S' + N : undefined }); vals.push(s); });
        var segs = [];
        if (R.inf !== null && a1 !== 0 && r !== 0) { segs.push({ a: [0, R.inf], b: [xmax, R.inf], dash: [5, 4], color: 2 }); vals.push(R.inf); }
        var lo = Math.min.apply(null, vals), hi = Math.max.apply(null, vals); if (hi - lo < 1e-9) { lo -= 1; hi += 1; } var pad = 0.12 * (hi - lo);
        p.set({ xmin: -0.5, xmax: xmax, ymin: lo - pad, ymax: hi + pad, curves: [], points: pts, segments: segs,
          labels: segs.length ? [{ x: xmax * 0.6, y: R.inf, text: 'S∞', dy: -8, color: 2 }] : [] });
      }
      setTimeout(function () { p = kit.mkPlot(kit.$('.plotbox', n), { xmin: -0.5, xmax: 10, ymin: -5, ymax: 25, curves: [], interactive: false }); kit.bindSliders(n, function () { upd(); }); }, 0);
      kit.on(kit.$('[data-sel="type"]', n), 'change', function () { upd(); });
      kit.$$('[data-preset]', n).forEach(function (b) { kit.on(b, 'click', function () {
        var s = b.dataset.preset.split(','); setSel(kit, n, 'type', s[0]);
        setIn(kit, n, 'a1', s[1]); setIn(kit, n, s[0] === 'szt' ? 'd' : 'q', s[2]); setIn(kit, n, 'n', s[3]);
      }); });
      return n;
    }
  });

  /* ================= 2. ε–N SZEMLÉLTETÉS ================= */
  MO.simDefs.push({
    id: 'epszilon-n', title: 'Sorozat határértéke: ε–N szemléltetés', topic: 'fuggvenyek', sub: 'sorozatok', group: 'sorozatok',
    desc: 'Válassz sorozatot és ε-t: látod a határérték körüli sávot és azt a küszöbindexet, amelytől minden tag a sávban marad.',
    formulas: ['f-sorozat-hatarertek-alap'],
    build: function (kit) {
      var opts = M.epsSeqs.map(function (s) { return '<option value="' + s.id + '">' + s.name + '</option>'; }).join('');
      var n = kit.el('<div>' +
        '<label class="f"><span>sorozat</span><select data-sel="seq">' + opts + '</select></label>' +
        kit.slider('eps', 'ε (a sáv félszélessége)', 0.05, 1, 0.01, 0.2) +
        '<div class="row" style="margin:10px 0"><button class="btn sm" type="button" data-preset="inv,0.1">1/n, ε = 0,1</button>' +
        '<button class="btn sm" type="button" data-preset="frac,0.25">(2n+1)/(n+3), ε = 0,25</button>' +
        '<button class="btn sm" type="button" data-preset="geo,0.05">0,8ⁿ, ε = 0,05</button>' +
        '<button class="btn sm" type="button" data-preset="osc,0.3">(−1)ⁿ: nincs határérték</button>' +
        '<button class="btn sm" type="button" data-preset="quad,0.3">n²/(n+1): divergens</button></div>' +
        kit.plotBox(280) + '<div class="out"></div></div>');
      var p = null;
      function upd() {
        var id = kit.$('[data-sel="seq"]', n).value, eps = parseFloat(kit.$('[data-in="eps"]', n).value), s = M.epsSeq(id), o = kit.$('.out', n), h = '';
        var pts = [], segs = [], labels = [], vals = [], i, nmax;
        if (s.L !== null) {
          var N = M.epsN(id, eps), thr = s.thr(eps); nmax = Math.min(Math.max(N + 6, 12), 130);
          for (i = 1; i <= nmax; i++) { var a = s.f(i); vals.push(a); pts.push({ x: i, y: a, color: i < N ? 2 : 0 }); }
          vals.push(s.L + eps, s.L - eps);
          segs.push({ a: [0, s.L], b: [nmax + 1, s.L], dash: [2, 3], color: 1 }, { a: [0, s.L + eps], b: [nmax + 1, s.L + eps], dash: [6, 4], color: 1 }, { a: [0, s.L - eps], b: [nmax + 1, s.L - eps], dash: [6, 4], color: 1 }, { a: [N - 0.5, 0], b: [N - 0.5, 0], dim: true });
          segs.pop(); segs.push({ a: [N - 0.5, s.L - eps], b: [N - 0.5, s.L + eps], dash: [3, 3], dim: true });
          labels.push({ x: nmax * 0.75, y: s.L + eps, text: 'L + ε', dy: -9, color: 1 }, { x: nmax * 0.75, y: s.L - eps, text: 'L − ε', dy: 12, color: 1 }, { x: N - 0.5, y: s.L + eps, text: 'N = ' + N, dy: -22, dx: 0 });
          var rows = [['n', 'aₙ', '|aₙ − L|', 'a sávban?']];
          for (i = Math.max(1, N - 2); i <= N + 2; i++) { var d = Math.abs(s.f(i) - s.L); rows.push([i, kit.num(s.f(i), 5), kit.num(d, 5), d < eps ? 'igen' : 'nem']); }
          var steps = [
            '**Határérték:** a sorozat konvergens, $L = ' + kit.tnum(s.L, 4) + '$. Az ε-sáv: $\\left]' + kit.tnum(s.L - eps, 4) + ';\\ ' + kit.tnum(s.L + eps, 4) + '\\right[$.',
            '**Mikor van egy tag a sávban?** $' + s.thrTex + '$.',
            '**Behelyettesítve:** $n>' + s.thrVal(eps) + (Math.abs(thr - Math.round(thr * 1e4) / 1e4) < 1e-9 ? ' = ' : ' \\approx ') + kit.tnum(thr, 4) + '$.',
            '**Küszöbindex:** az $n$ legkisebb olyan egész értéke, amelytől kezdve minden tag a sávban van: $N = ' + N + '$. Az $a_{' + Math.max(1, N - 1) + '}$ ' + (N > 1 ? 'még kívül van (narancs pont), az $a_{' + N + '}$ és minden további tag bent.' : 'már bent van, vagyis minden tag a sávban van.')
          ];
          h += '<div class="mathblock">' + kit.tex('a_n=' + s.tex + ',\\qquad \\lim_{n\\to\\infty}a_n=' + kit.tnum(s.L, 4), true) + '</div>' +
            '<div class="ans">N = ' + N + '</div>' + kit.steps(steps) + tbl(rows) +
            '<p class="dim">A küszöbindex azt jelenti: $n \\ge N$ esetén $|a_n-L|<\\varepsilon$ (a határon lévő tagot nem számítjuk a sávba). Kisebb ε-hoz nagyobb N tartozik.</p>'.replace(/\$([^$]*)\$/g, function (m, t) { return kit.tex(t); });
        } else {
          nmax = 24;
          for (i = 1; i <= nmax; i++) { var b = s.f(i); vals.push(b); pts.push({ x: i, y: b, color: 0 }); }
          if (id === 'osc') {
            segs.push({ a: [0, 1], b: [nmax + 1, 1], dash: [4, 4], dim: true }, { a: [0, -1], b: [nmax + 1, -1], dash: [4, 4], dim: true });
            vals.push(1.6, -1.6);
            h += '<div class="mathblock">' + kit.tex('a_n=(-1)^n,\\qquad \\text{a tagok: } -1,\\ 1,\\ -1,\\ 1,\\ \\dots', true) + '</div><div class="ans">nincs határérték (divergens)</div>' +
              kit.steps([
                'A sorozat két értéket vesz fel felváltva: $+1$-et és $-1$-et, a két érték távolsága $2$.',
                'Tegyük fel, hogy van határérték: $L$. Ha $\\varepsilon<1$, akkor az $L$ körüli $2\\varepsilon$ széles sávba a $-1$ és az $1$ közül legfeljebb az egyik fér bele (a távolságuk $2>2\\varepsilon$).',
                'Így végtelen sok tag mindig kívül marad a sávon, tehát semmilyen $L$-hez nem létezik küszöbindex. A sorozat nem konvergens. Az ε-csúszkának itt nincs hatása.'
              ].map(function (t) { return t; }));
          } else {
            segs.push({ a: [0, 0], b: [nmax + 1, 0], dim: true });
            h += '<div class="mathblock">' + kit.tex('a_n=\\dfrac{n^2}{n+1}', true) + '</div><div class="ans">nincs véges határérték (divergens)</div>' +
              kit.steps([
                '**Alsó becslés:** $\\dfrac{n^2}{n+1}=n-1+\\dfrac{1}{n+1}>n-1$ minden $n$-re (ellenőrzés: $(n-1)(n+1)=n^2-1<n^2$).',
                'A sorozat nem korlátos felülről, így nem lehet véges $L$ határértéke: egy véges $L$ körüli sávon kívül végtelen sok tag marad.',
                'A tagok minden határon túl nőnek; tágabb értelemben $\\lim a_n=+\\infty$, de ez nem véges határérték, ezért a sorozat nem konvergens.'
              ]);
          }
        }
        var tbl2 = '';
        o.innerHTML = h + tbl2;
        if (!p) return;
        var lo = Math.min.apply(null, vals), hi = Math.max.apply(null, vals); if (hi - lo < 1e-9) { lo -= 1; hi += 1; } var pad = 0.12 * (hi - lo);
        p.set({ xmin: -0.5, xmax: nmax + 1, ymin: Math.min(lo - pad, 0 - pad), ymax: hi + pad, curves: [], points: pts, segments: segs, labels: labels });
      }
      setTimeout(function () { p = kit.mkPlot(kit.$('.plotbox', n), { xmin: -0.5, xmax: 15, ymin: -0.5, ymax: 1.5, curves: [], interactive: false }); kit.bindSliders(n, upd); }, 0);
      kit.on(kit.$('[data-sel="seq"]', n), 'change', upd);
      kit.$$('[data-preset]', n).forEach(function (b) { kit.on(b, 'click', function () { var s = b.dataset.preset.split(','); setSel(kit, n, 'seq', s[0]); setIn(kit, n, 'eps', s[1]); }); });
      return n;
    }
  });

  /* ================= 3. PÓKHÁLÓ ================= */
  MO.simDefs.push({
    id: 'pokhalo', title: 'Rekurzív sorozat: pókháló-ábra', topic: 'fuggvenyek', sub: 'sorozatok', group: 'sorozatok',
    desc: 'Az aₙ₊₁ = f(aₙ) sorozat lépcsős vagy spirális útja az y = f(x) és az y = x között; fixpontok és konvergencia.',
    build: function (kit) {
      var opts = M.cobDefs.map(function (d) { return '<option value="' + d.id + '">f(x) = ' + d.name + '</option>'; }).join('');
      var n = kit.el('<div>' +
        '<label class="f"><span>az f függvény</span><select data-sel="fn">' + opts + '</select></label>' +
        '<div data-wrap="r" style="display:none">' + kit.slider('r', 'r paraméter', 0.5, 4, 0.1, 2.8) + '</div>' +
        kit.slider('x0', 'kezdőérték (a₁)', -2, 6, 0.1, 0) + kit.slider('n', 'a tagok száma', 2, 30, 1, 12) +
        '<div class="row" style="margin:10px 0"><button class="btn sm" type="button" data-preset="lin,0,12,">0,5x+1: vonzó fixpont</button>' +
        '<button class="btn sm" type="button" data-preset="cos,1,20,">cos x: spirál</button>' +
        '<button class="btn sm" type="button" data-preset="log,0.2,25,2.8">r = 2,8: konvergál</button>' +
        '<button class="btn sm" type="button" data-preset="log,0.2,30,3.2">r = 3,2: két érték</button>' +
        '<button class="btn sm" type="button" data-preset="aff,1.1,10,">2x−1: távolodik</button></div>' +
        kit.plotBox(300) + legendHtml([[0, 'solid', 'y = f(x)'], [1, 'dashed', 'y = x'], [2, 'solid', 'a sorozat útja']]) + '<div class="out"></div></div>');
      var p = null;
      function upd() {
        var id = kit.$('[data-sel="fn"]', n).value, def = M.cobDef(id), o = kit.$('.out', n);
        kit.$('[data-wrap="r"]', n).style.display = def.param ? '' : 'none';
        var r = parseFloat(kit.$('[data-in="r"]', n).value), x0 = parseFloat(kit.$('[data-in="x0"]', n).value), N = parseFloat(kit.$('[data-in="n"]', n).value);
        var t = M.cobTerms(def, r, x0, N), fx = M.cobFix(def, r), ver = M.cobVerdict(t), fT = def.name;
        var ftex = def.param ? 'r\\,x(1-x)' + ',\\ r=' + kit.tnum(r, 2) : def.tex;
        var steps = [
          '**A sorozat:** $a_1=' + kit.tnum(x0, 3) + ',\\ a_{n+1}=f(a_n)$, ahol $f(x)=' + ftex + '$. Az ábrán a függőleges lépés a görbéhez, a vízszintes lépés az $y=x$ egyeneshez visz.',
          '**Fixpontok** ($f(x)=x$): $' + def.fixTex(r) + '$.',
          '**Vonzó-e?** Ha egy $x^*$ fixpontra $|f\'(x^*)|<1$, akkor a közelében kezdődő sorozat hozzá tart; ha $|f\'(x^*)|>1$, eltaszítja a sorozatot; ha egyenlő 1-gyel, a derivált nem dönt. Itt $' + def.dfTex + '$.'
        ];
        var kvs = fx.map(function (q) {
          return '<dt>x* = ' + kit.num(q.x, 4) + '</dt><dd>f′(x*) = ' + kit.num(q.d, 4) + ', |f′(x*)| = ' + kit.num(Math.abs(q.d), 4) + ' → <b>' + q.kind + '</b>' +
            (q.kind === 'vonzó' ? ' (kis környezetében a sorozat konvergál hozzá)' : q.kind === 'taszító' ? ' (a sorozat eltávolodik tőle, hacsak nem pont ott indul)' : ' (a derivált nem dönt)') + '</dd>';
        }).join('');
        var vt;
        if (t.length < N) vt = 'A sorozat a ' + (t.length + 1) + '. tagnál kilépett az f értelmezési tartományából, ezért itt véget ér.';
        else if (ver.kind === 'konv') vt = ver.approx ? 'A tagok egyre kisebbet lépnek: a sorozat **konvergálni látszik**, $a_{' + t.length + '}\\approx' + kit.tnum(ver.limit, 4) + '$ (a határérték fixpont lesz; több taggal pontosabban látszik).' : 'A kiszámolt tagok alapján a sorozat **konvergál**: $a_n\\approx' + kit.tnum(ver.limit, 5) + '$, ez fixpont.';
        else if (ver.kind === 'per2') vt = 'A sorozat két érték között ingadozik ($\\approx' + kit.tnum(ver.a, 4) + '$ és $\\approx' + kit.tnum(ver.b, 4) + '$), ezért ebből a kezdőértékből **nem konvergál** (a fixpont taszító).';
        else if (ver.kind === 'diverg') vt = 'A tagok egyre gyorsabban távolodnak, a sorozat **divergál**.';
        else if (ver.kind === 'kevés') vt = 'Kevés tag van ahhoz, hogy megítéljük a viselkedést; növeld a tagok számát.';
        else vt = 'A megadott számú tag alapján még nem dönthető el: nem látszik konvergencia (lehet lassú konvergencia, periodikus vagy kaotikus viselkedés is). Növeld a lépésszámot.';
        steps.push('**A sorozat viselkedése (' + t.length + ' tag alapján):** ' + vt);
        var rows = ['<th>n</th>', '<td>aₙ</td>'];
        t.forEach(function (a, i) { rows[0] += '<th>' + (i + 1) + '</th>'; rows[1] += '<td>' + kit.num(a, 4) + '</td>'; });
        o.innerHTML = '<dl class="kv">' + kvs + '</dl>' + kit.steps(steps) + '<div class="lab" style="margin-top:12px">a tagok</div><div class="tblwrap"><table class="t"><tr>' + rows[0] + '</tr><tr>' + rows[1] + '</tr></table></div>' +
          '<p class="dim">A fixpontok vizsgálata a deriválttal helyi állítás: azt mondja meg, mi történik a fixpont közelében. A táblázat 4 tizedesre kerekít.</p>';
        if (!p) return;
        var path = [[t[0], 0]], i;
        for (i = 0; i < t.length; i++) { var fv = def.f(t[i], r); if (!isFinite(fv)) break; path.push([t[i], fv]); path.push([fv, fv]); }
        var pts = fx.map(function (q) { return { x: q.x, y: q.x, label: 'x*' }; }); pts.push({ x: t[0], y: 0, label: 'a₁' });
        p.set({ xmin: def.view[0], xmax: def.view[1], ymin: def.view[0], ymax: def.view[1], curves: [{ f: function (x) { return def.f(x, r); } }, { f: function (x) { return x; } }],
          polys: [{ pts: path, color: 2, w: 1.6, close: false }], points: pts });
      }
      function resetRange() {
        var def = M.cobDef(kit.$('[data-sel="fn"]', n).value), x = kit.$('[data-in="x0"]', n);
        x.min = def.x0[0]; x.max = def.x0[1]; x.step = def.id === 'log' ? 0.01 : 0.1; x.value = def.x0[2];
      }
      setTimeout(function () { p = kit.mkPlot(kit.$('.plotbox', n), { xmin: -2, xmax: 6, ymin: -2, ymax: 6, curves: [], interactive: false }); kit.bindSliders(n, upd); }, 0);
      kit.on(kit.$('[data-sel="fn"]', n), 'change', function () { resetRange(); kit.$('[data-in="x0"]', n).dispatchEvent(new Event('input', { bubbles: true })); });
      kit.$$('[data-preset]', n).forEach(function (b) { kit.on(b, 'click', function () {
        var s = b.dataset.preset.split(','); setSel(kit, n, 'fn', s[0]); setIn(kit, n, 'x0', s[1]); setIn(kit, n, 'n', s[2]); if (s[3]) setIn(kit, n, 'r', s[3]);
      }); });
      return n;
    }
  });

  /* ================= 4. A DERIVÁLT SZEMLÉLTETÉSE ================= */
  MO.simDefs.push({
    id: 'derivalt-erinto', title: 'A derivált: szelő és érintő', topic: 'fuggvenyek', sub: 'derivalas', group: 'analízis',
    desc: 'Húzd a P pontot a görbén, és csökkentsd h-t: a szelő meredeksége tart az érintő meredekségéhez, a derivált értékéhez.',
    formulas: ['f-derivalt-definicio'],
    build: function (kit) {
      var n = kit.el('<div>' + kit.fnInput('x^2') + kit.slider('x0', 'P helye (x₀)', -5, 5, 0.05, 1) + kit.slider('h', 'h (a Q pont távolsága P-től)', -2, 2, 0.05, 1) +
        '<div class="row" style="margin:10px 0"><button class="btn sm" type="button" data-preset="x^2~1~1">x², P az 1-ben</button>' +
        '<button class="btn sm" type="button" data-preset="x^3-3x~2~0.5">x³−3x, P a 2-ben</button>' +
        '<button class="btn sm" type="button" data-preset="sin(x)~0.5~1">sin x</button>' +
        '<button class="btn sm" type="button" data-preset="|x|~0~1">|x| a 0-ban: nem deriválható</button></div>' +
        kit.plotBox(300) + legendHtml([[0, 'solid', 'f'], [1, 'dashed', 'szelő (P és Q)'], [2, 'dotted', 'érintő P-ben']]) + '<div class="out"></div></div>');
      var p = null;
      function upd() {
        var o = kit.$('.out', n), x0 = parseFloat(kit.$('[data-in="x0"]', n).value), h = Math.round(parseFloat(kit.$('[data-in="h"]', n).value) * 1000) / 1000;
        var c;
        try { c = kit.readFn(n); } catch (e) { o.innerHTML = msg(kit, 'bad', e.cas && e.message ? e.message : 'Ezt nem tudom értelmezni.'); return; }
        var f = c.f, y0 = f(x0), html = '';
        var d1 = null; try { d1 = kit.C.diff(c.ast, 'x'); } catch (e) { d1 = null; }
        var win = [-6, 6], yq = isFinite(y0) && isFinite(f(x0 + h)) ? [y0, f(x0 + h)] : (isFinite(y0) ? [y0] : []);
        var yr = M.autoY([f], win[0], win[1], yq);
        var T = function (x) { return kit.tnum(x, 4); };
        if (!isFinite(y0)) {
          html = msg(kit, 'bad', 'Az f függvény az x₀ helyen nincs értelmezve, ott nincs P pont. Válassz másik helyet.');
          if (p) p.set({ xmin: win[0], xmax: win[1], ymin: yr[0], ymax: yr[1], curves: [{ f: f }], points: [], segments: [] });
          o.innerHTML = html; return;
        }
        var Q = f(x0 + h), os = M.oneSided(f, x0), curves = [{ f: f }], steps = [], tbl2 = '', tan = null, m = NaN;
        var fx = d1 ? kit.tex('f(x)=' + kit.C.toTex(c.ast) + (d1 ? ",\\quad f'(x)=" + kit.C.toTex(d1) : '')) : '';
        steps.push('**A két pont:** $P(x_0;\\,f(x_0))=P(' + T(x0) + ';\\,' + T(y0) + ')$' + (h !== 0 && isFinite(Q) ? ', $Q(x_0+h;\\,f(x_0+h))=Q(' + T(x0 + h) + ';\\,' + T(Q) + ')$.' : '.'));
        var sl = NaN;
        if (h === 0) steps.push('**h = 0:** a szelő nem értelmezett (a P és Q egybeesik, a differenciahányados 0-val osztana). Válassz 0-tól különböző h-t.');
        else if (!isFinite(Q)) steps.push('**Q nincs értelmezve:** az f függvény az $x_0+h=' + T(x0 + h) + '$ helyen nem értelmezett, ezért itt nincs szelő.');
        else {
          sl = (Q - y0) / h;
          steps.push('**Szelő meredeksége (differenciahányados):** $\\dfrac{f(x_0+h)-f(x_0)}{h}=\\dfrac{' + T(Q) + '-' + par(kit, y0) + '}{' + par(kit, h) + '}' + rv(kit, sl) + '$.');
          curves.push({ f: function (x) { return y0 + sl * (x - x0); } });
        }
        if (!os.smooth) {
          var bad = !isFinite(os.right) || !isFinite(os.left);
          steps.push(bad ? '**Nincs derivált:** az f függvény x₀ egyik oldalán nincs értelmezve (vagy nem folytonos), ezért nem létezik kétoldali differenciálhányados; nincs érintő.' :
            '**Nem differenciálható hely:** a két oldali differenciahányados eltér: jobbról $\\approx' + T(os.right) + '$, balról $\\approx' + T(os.left) + '$. A $h\\to0$ határérték nem létezik, ezért $f\'(x_0)$ sincs, és nincs érintő (a görbének itt töréspontja van).');
        } else {
          var dv = d1 ? kit.C.evalAst(d1, { x: x0 }) : NaN; m = isFinite(dv) ? dv : (os.right + os.left) / 2;
          tan = M.tangent(m, x0, y0);
          steps.push('**Ha h → 0**, a szelő az érintőhöz simul, meredeksége a deriválthoz tart: $f\'(x_0)=\\lim_{h\\to0}\\dfrac{f(x_0+h)-f(x_0)}{h}' + rv(kit, m) + '$' + (d1 ? ' (a deriváltfüggvényből számolva)' : ' (numerikus közelítés)') + '.');
          steps.push('**Az érintő egyenlete:** $y-f(x_0)=f\'(x_0)(x-x_0)$, azaz $y-' + par(kit, y0) + '=' + par(kit, m) + '\\,(x-' + par(kit, x0) + ')$, vagyis $y=' + lineTex(kit, tan.m, tan.b) + '$' + (Math.abs(tan.m * 1e4 - Math.round(tan.m * 1e4)) < 1e-6 && Math.abs(tan.b * 1e4 - Math.round(tan.b * 1e4)) < 1e-6 ? '.' : ' (4 tizedesre kerekítve).'));
          curves.push({ f: function (x) { return tan.m * x + tan.b; } });
        }
        var hs = [1, 0.1, 0.01, 0.001], rows = [['h', '(f(x₀+h) − f(x₀))/h', '(f(x₀) − f(x₀−h))/h']];
        hs.forEach(function (hh) { rows.push([kit.num(hh, 3), kit.num(M.diffQuot(f, x0, hh), 5), kit.num(M.diffQuot(f, x0, -hh), 5)]); });
        tbl2 = '<div class="lab" style="margin-top:12px">a szelők meredeksége, ahogy h → 0 (jobbról és balról)</div>' + tbl(rows) +
          '<p class="dim">' + (os.smooth ? 'Mindkét oszlop ugyanahhoz az értékhez tart: ez a derivált.' : 'A két oszlop különböző értékhez tart (vagy az egyik nincs értelmezve), ezért nincs derivált.') + ' A táblázat 5 tizedesre kerekít.</p>';
        html = '<div class="mathblock">' + (fx || kit.tex('f(x)=' + kit.C.toTex(c.ast), true)) + '</div>' +
          '<dl class="kv"><dt>differenciahányados</dt><dd>' + (isFinite(sl) ? kit.tex(kit.tnum(sl, 5)) : '–') + '</dd><dt>f′(x₀)</dt><dd>' + (os.smooth ? kit.tex(kit.tnum(m, 5)) : 'nem létezik') + '</dd><dt>érintő</dt><dd>' + (tan ? kit.tex('y=' + lineTex(kit, tan.m, tan.b)) : 'nincs') + '</dd></dl>' +
          kit.steps(steps) + tbl2;
        o.innerHTML = html;
        if (!p) return;
        var pts = [{ x: x0, y: y0, label: 'P', drag: true, id: 'P' }];
        if (h !== 0 && isFinite(Q)) pts.push({ x: x0 + h, y: Q, label: 'Q', color: 1 });
        p.set({ xmin: win[0], xmax: win[1], ymin: yr[0], ymax: yr[1], curves: curves, points: pts,
          onDrag: function (pt, x) { var s = kit.$('[data-in="x0"]', n); s.value = Math.max(-5, Math.min(5, Math.round(x * 20) / 20)); s.dispatchEvent(new Event('input', { bubbles: true })); } });
      }
      setTimeout(function () { p = kit.mkPlot(kit.$('.plotbox', n), { xmin: -6, xmax: 6, ymin: -6, ymax: 6, curves: [] }); kit.bindSliders(n, upd); }, 0);
      kit.on(kit.$('[data-fx]', n), 'input', upd);
      kit.$$('[data-preset]', n).forEach(function (b) { kit.on(b, 'click', function () {
        var s = b.dataset.preset.split('~'); kit.$('[data-fx]', n).value = s[0]; setIn(kit, n, 'x0', s[1]); setIn(kit, n, 'h', s[2]);
      }); });
      return n;
    }
  });

  /* ================= 5. FÜGGVÉNYVIZSGÁLAT ================= */
  MO.simDefs.push({
    id: 'fuggvenyvizsgalat', title: 'Függvényvizsgálat: f, f′, f″', topic: 'fuggvenyek', sub: 'derivalas', group: 'analízis',
    desc: 'Írj be egy függvényt: az előjeltáblák megmutatják a monotonitást és a konvexitást, a szélsőértékeket és az inflexiós pontokat.',
    formulas: ['f-monotonitas-derivalt', 'f-szelsoertek-derivalt', 'f-konvexitas'],
    build: function (kit) {
      var n = kit.el('<div>' + kit.fnInput('x^3-6x^2+9x+1') + '<div class="row">' + kit.numIn('a', 'ettől (a)', '-1') + kit.numIn('b', 'eddig (b)', '5') + '</div>' +
        '<div class="row" style="margin:10px 0"><button class="btn sm" type="button" data-preset="x^3-6x^2+9x+1~-1~5">harmadfokú: max és min</button>' +
        '<button class="btn sm" type="button" data-preset="x^4-2x^2~-2~2">negyedfokú: két inflexió</button>' +
        '<button class="btn sm" type="button" data-preset="x^3~-2~2">x³: nincs szélsőérték</button>' +
        '<button class="btn sm" type="button" data-preset="-x^2+4x~-1~5">parabola</button></div>' +
        kit.plotBox(300) + legendHtml([[0, 'solid', 'f'], [1, 'dashed', 'f′'], [2, 'dotted', 'f″']]) + '<div class="out"></div></div>');
      var p = null;
      function upd() {
        var o = kit.$('.out', n), v = kit.readNums(n);
        try {
          var c = kit.readFn(n);
          if (!v || !(v.b > v.a)) throw { cas: true, message: 'A tartomány legyen értelmes: a < b.' };
          if (v.b - v.a > 200) throw { cas: true, message: 'A tartomány legfeljebb 200 egység széles lehet.' };
          var d1 = kit.C.diff(c.ast, 'x'), d2 = kit.C.diff(d1, 'x');
          var f = c.f, df = function (x) { return kit.C.evalAst(d1, { x: x }); }, d2f = function (x) { return kit.C.evalAst(d2, { x: x }); };
          var r1 = kit.C.roots(df, v.a, v.b, { df: d2f }), r2 = kit.C.roots(d2f, v.a, v.b);
          var t1 = M.signTable(df, v.a, v.b, r1), t2 = M.signTable(d2f, v.a, v.b, r2);
          var ext = M.extrema(f, df, v.a, v.b, r1), inf = M.inflections(f, d2f, v.a, v.b, r2);
          var undef = 0, i; for (i = 0; i <= 100; i++) if (!isFinite(f(v.a + (v.b - v.a) * i / 100))) undef++;
          var T = function (x) { return kit.tnum(x, 4); }, fmt = function (r) { return r.length ? r.map(function (x) { return kit.num(x, 4); }).join('; ') : 'nincs'; };
          var mono = '<tr><td>f</td>' + t1.map(function (t) { return '<td>' + (t.sign === '+' ? 'nő' : t.sign === '−' ? 'csökken' : t.sign === '0' ? 'állandó' : '?') + '</td>'; }).join('') + '</tr>';
          var conv = '<tr><td>f</td>' + t2.map(function (t) { return '<td>' + (t.sign === '+' ? 'konvex' : t.sign === '−' ? 'konkáv' : t.sign === '0' ? 'lineáris' : '?') + '</td>'; }).join('') + '</tr>';
          var tableHtml = function (t, name, extra) { return '<div class="tblwrap"><table class="t"><tr><th>intervallum</th>' + t.map(function (x) { return '<th>' + ivHead(x) + '</th>'; }).join('') + '</tr><tr><td>' + name + '</td>' + t.map(function (x) { return '<td>' + x.sign + '</td>'; }).join('') + '</tr>' + extra + '</table></div>'; };
          var extL = ext.length ? ext.map(function (e) { return '<li>' + (e.kind === 'max' ? 'lokális maximum' : e.kind === 'min' ? 'lokális minimum' : 'nem szélsőérték (f′ itt nem vált előjelet)') + ': ' + kit.tex('x\\approx' + T(e.x) + ',\\ f(x)\\approx' + T(e.y)) + '</li>'; }).join('') : '<li>f′-nek nincs zérushelye a tartomány belsejében, ezért nincs lokális szélsőérték.</li>';
          var infL = inf.length ? inf.map(function (e) { return '<li>inflexiós pont (' + e.kind + '): ' + kit.tex('x\\approx' + T(e.x) + ',\\ f(x)\\approx' + T(e.y)) + '</li>'; }).join('') : '<li>nincs inflexiós pont a tartományban (f″ nem vált előjelet).</li>';
          var steps = [
            '**Deriváljuk kétszer:** $f\'(x)=' + kit.C.toTex(d1) + '$, $f\'\'(x)=' + kit.C.toTex(d2) + '$ (szabályalapú deriválás, az alak nem teljesen egyszerűsített).',
            '**f′ zérushelyei** a $[' + kit.tnum(v.a, 3) + ';\\ ' + kit.tnum(v.b, 3) + ']$ tartományon: ' + (r1.length ? '$x\\approx ' + r1.map(T).join(';\\ ') + '$' : 'nincs') + '. Ezek a lehetséges szélsőérték-helyek.',
            '**Monotonitás:** ahol $f\'>0$, ott f szigorúan nő, ahol $f\'<0$, ott csökken. Ha f′ a zérushelyén előjelet vált, ott lokális szélsőérték van (+ → −: maximum, − → +: minimum).',
            '**f″ zérushelyei:** ' + (r2.length ? '$x\\approx ' + r2.map(T).join(';\\ ') + '$' : 'nincs') + '. Ahol $f\'\'>0$, ott f konvex, ahol $f\'\'<0$, ott konkáv; ha f″ előjelet vált, ott inflexiós pont van.'
          ];
          o.innerHTML = '<div class="mathblock">' + kit.tex('f(x)=' + kit.C.toTex(c.ast), true) + kit.tex("f'(x)=" + kit.C.toTex(d1), true) + kit.tex("f''(x)=" + kit.C.toTex(d2), true) + '</div>' +
            (undef ? msg(kit, 'bad', 'Az f függvény a tartomány egyes pontjain nincs értelmezve; az eredmények csak az értelmezési tartományon belül érvényesek, a szakadási helyek környékén különösen óvatosan olvasd őket.') : '') +
            kit.steps(steps) +
            '<div class="lab">f′ előjele → monotonitás</div>' + tableHtml(t1, 'f′', mono) +
            '<div class="lab" style="margin-top:12px">f″ előjele → konvexitás</div>' + tableHtml(t2, 'f″', conv) +
            '<div class="lab" style="margin-top:12px">lokális szélsőértékek</div><ul>' + extL + '</ul>' +
            '<div class="lab">inflexiós pontok</div><ul>' + infL + '</ul>' +
            '<p class="dim">A zérushelyeket numerikus módszer (előjelváltás és felezés) keresi, ezért közelítő értékek (4 tizedesre kerekítve). A tábla a megadott [a; b] tartományra vonatkozik.</p>';
          if (!p) return;
          var pts = [];
          ext.forEach(function (e) { if (e.kind !== 'nincs') pts.push({ x: e.x, y: e.y, label: e.kind === 'max' ? 'max' : 'min' }); });
          inf.forEach(function (e) { pts.push({ x: e.x, y: e.y, label: 'infl.', color: 2 }); });
          var pad = 0.08 * (v.b - v.a), yr = M.autoY([f, df, d2f], v.a, v.b, pts.map(function (q) { return q.y; }));
          p.set({ xmin: v.a - pad, xmax: v.b + pad, ymin: yr[0], ymax: yr[1], curves: [{ f: f }, { f: df }, { f: d2f }], points: pts });
        } catch (e) { o.innerHTML = msg(kit, 'bad', e && e.cas && e.message ? e.message : 'Ezt nem tudom értelmezni.'); }
      }
      setTimeout(function () { p = kit.mkPlot(kit.$('.plotbox', n), { xmin: -2, xmax: 6, ymin: -6, ymax: 8, curves: [] }); upd(); }, 0);
      kit.$$('input', n).forEach(function (i) { kit.on(i, 'input', upd); });
      kit.$$('[data-preset]', n).forEach(function (b) { kit.on(b, 'click', function () {
        var s = b.dataset.preset.split('~'); kit.$('[data-fx]', n).value = s[0]; kit.$('[data-n="a"]', n).value = s[1]; kit.$('[data-n="b"]', n).value = s[2]; upd();
      }); });
      return n;
    }
  });
})(typeof window !== 'undefined' ? window : globalThis);
