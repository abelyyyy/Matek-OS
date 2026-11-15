/* Kombinatorika és valószínűség – szimulációk: kombinatorika, binomialis, monte-carlo, felteteles */
(function (root) {
  'use strict';
  var MO = root.MO = root.MO || {};
  var M = MO.models = MO.models || {};
  MO.simDefs = MO.simDefs || [];
  var LET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  /* =====================  MODELLEK: kombinatorika  ===================== */
  M.valszamFact = function (n) { var r = 1, i; for (i = 2; i <= n; i++) r *= i; return r; };
  M.valszamBinom = function (n, k) {
    var r = 1, i;
    if (k < 0 || k > n) return 0;
    k = Math.min(k, n - k);
    for (i = 1; i <= k; i++) r = r * (n - k + i) / i;
    return Math.round(r);
  };
  M.valszamPascal = function (rows) {
    var t = [], i, j, r;
    for (i = 0; i < rows; i++) { r = []; for (j = 0; j <= i; j++) r.push(j === 0 || j === i ? 1 : t[i - 1][j - 1] + t[i - 1][j]); t.push(r); }
    return t;
  };
  /* a típus: order (számít-e a sorrend), rep (lehet-e ismétlődés), mode: 'p' (vannak egyforma elemek) vagy 'v' (újra és újra választunk) */
  M.valszamType = function (order, rep, mode, n, k) {
    if (order && !rep) return k === n ? 'perm' : 'var';
    if (order && rep) return mode === 'p' ? 'permRep' : 'varRep';
    if (!order && !rep) return 'comb';
    return 'combRep';
  };
  /* "2,3,2" -> csoportok; az n-ből kimaradó elemek mind különbözők */
  M.valszamGroups = function (text, n) {
    var parts = String(text).split(/[^0-9]+/).filter(function (s) { return s !== ''; }), g = [], sum = 0, i, v;
    for (i = 0; i < parts.length; i++) { v = parseInt(parts[i], 10); if (v > 0) { g.push(v); sum += v; } }
    if (sum > n) return { ok: false, groups: g, sum: sum, msg: 'Az ismétlődések összege (' + sum + ') nagyobb, mint n (' + n + '). Csökkentsd őket, vagy növeld n-t.' };
    return { ok: true, groups: g, sum: sum, rest: n - sum };
  };
  M.valszamCount = function (type, n, k, groups) {
    var F = M.valszamFact, r, i;
    switch (type) {
      case 'perm': return F(n);
      case 'permRep': r = F(n); for (i = 0; i < groups.length; i++) r /= F(groups[i]); return Math.round(r);
      case 'var': return k > n ? 0 : Math.round(F(n) / F(n - k));
      case 'varRep': return Math.pow(n, k);
      case 'comb': return M.valszamBinom(n, k);
      default: return M.valszamBinom(n + k - 1, k);
    }
  };
  M.valszamSpec = function (type, n, k, groups) {
    var s = { type: type, n: n, k: k, len: k, cnt: null, alpha: [] }, i, rest, g = groups || [], sum = 0;
    if (type === 'permRep') {
      s.cnt = g.slice(); for (i = 0; i < g.length; i++) sum += g[i];
      rest = n - sum; for (i = 0; i < rest; i++) s.cnt.push(1);
      for (i = 0; i < s.cnt.length; i++) s.alpha.push(LET.charAt(i));
      s.len = n;
    } else {
      for (i = 0; i < n; i++) s.alpha.push(LET.charAt(i));
      if (type === 'perm') s.len = n;
    }
    return s;
  };
  /* a prefix (betűindexek) után következő megengedett betűk indexei */
  M.valszamNext = function (spec, prefix) {
    var a = spec.alpha.length, out = [], i, last = prefix.length ? prefix[prefix.length - 1] : -1, used = [], j;
    for (i = 0; i < a; i++) used.push(0);
    for (j = 0; j < prefix.length; j++) used[prefix[j]]++;
    for (i = 0; i < a; i++) {
      switch (spec.type) {
        case 'perm': case 'var': if (!used[i]) out.push(i); break;
        case 'varRep': out.push(i); break;
        case 'comb': if (i > last) out.push(i); break;
        case 'combRep': if (i >= last) out.push(i); break;
        case 'permRep': if (used[i] < spec.cnt[i]) out.push(i); break;
      }
    }
    return out;
  };
  M.valszamWord = function (spec, idx) { return idx.map(function (i) { return spec.alpha[i]; }).join(''); };
  M.valszamEnum = function (spec, limit) {
    var res = [];
    function rec(pre) {
      var nx, i;
      if (res.length >= limit) return;
      if (pre.length === spec.len) { res.push(M.valszamWord(spec, pre)); return; }
      nx = M.valszamNext(spec, pre);
      for (i = 0; i < nx.length; i++) rec(pre.concat([nx[i]]));
    }
    rec([]);
    return res;
  };
  /* a fa első két szintje */
  M.valszamTree = function (spec, maxL1, maxL2) {
    var l1 = M.valszamNext(spec, []), nodes = [];
    l1.slice(0, maxL1).forEach(function (i) {
      var l2 = spec.len > 1 ? M.valszamNext(spec, [i]) : [];
      nodes.push({ label: spec.alpha[i], total2: l2.length, kids: l2.slice(0, maxL2).map(function (j) { return spec.alpha[i] + spec.alpha[j]; }) });
    });
    return { len: spec.len, total1: l1.length, nodes: nodes };
  };
  function falling(n, k) { var a = [], i; for (i = 0; i < k; i++) a.push(n - i); return a.join('\\cdot '); }
  function factStr(k) { var a = [], i; for (i = k; i >= 1; i--) a.push(i); return a.length ? a.join('\\cdot ') : '1'; }
  M.valszamFormula = function (type, n, k, groups) {
    var F = M.valszamFact, v = M.valszamCount(type, n, k, groups), big = MO.tbig, g = (groups || []).filter(function (x) { return x >= 2; }), r = { value: v };
    switch (type) {
      case 'perm':
        r.name = 'ismétlés nélküli permutáció'; r.gen = 'P_n = n!';
        r.sub = 'P_{' + n + '} = ' + n + '! = ' + factStr(n) + ' = ' + big(v); break;
      case 'permRep':
        r.name = 'ismétléses permutáció'; r.gen = 'P_n^{k_1,k_2,\\dots} = \\dfrac{n!}{k_1!\\cdot k_2!\\cdots}';
        r.sub = g.length ? '\\dfrac{' + n + '!}{' + g.map(function (x) { return x + '!'; }).join('\\cdot ') + '} = ' + big(v) : n + '! = ' + big(v) + '\\ \\text{(nincs egyforma elem)}';
        break;
      case 'var':
        r.name = 'ismétlés nélküli variáció'; r.gen = 'V_n^k = \\dfrac{n!}{(n-k)!} = n(n-1)\\cdots(n-k+1)';
        r.sub = k > n ? '\\text{k > n, ezért nem lehet ennyi különböző elemet kiválasztani: } 0' : '\\dfrac{' + n + '!}{(' + n + '-' + k + ')!} = ' + falling(n, k) + ' = ' + big(v);
        break;
      case 'varRep':
        r.name = 'ismétléses variáció'; r.gen = 'V_n^{k,\\text{ism}} = n^k';
        r.sub = n + '^{' + k + '} = ' + big(v); break;
      case 'comb':
        r.name = 'ismétlés nélküli kombináció'; r.gen = 'C_n^k = \\dbinom{n}{k} = \\dfrac{n!}{k!\\,(n-k)!}';
        r.sub = k > n ? '\\text{k > n, ezért nem lehet ennyi elemet kiválasztani: } 0' : '\\dbinom{' + n + '}{' + k + '} = \\dfrac{' + falling(n, k) + '}{' + factStr(k) + '} = ' + big(v);
        break;
      default:
        r.name = 'ismétléses kombináció'; r.extra = true;
        r.gen = 'C_n^{k,\\text{ism}} = \\dbinom{n+k-1}{k}';
        r.sub = '\\dbinom{' + n + '+' + k + '-1}{' + k + '} = \\dbinom{' + (n + k - 1) + '}{' + k + '} = ' + big(v);
    }
    return r;
  };

  /* =====================  MODELLEK: binomiális, hipergeometrikus  ===================== */
  M.valszamBinomPmf = function (n, p) {
    var a = [], k;
    for (k = 0; k <= n; k++) a.push(M.valszamBinom(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k));
    return a;
  };
  M.valszamHyperPmf = function (N, K, n) {
    var a = [], k, tot = M.valszamBinom(N, n);
    for (k = 0; k <= n; k++) a.push(tot ? M.valszamBinom(K, k) * M.valszamBinom(N - K, n - k) / tot : 0);
    return a;
  };
  M.valszamSum = function (arr, from, to) { var s = 0, i; for (i = Math.max(0, from); i <= Math.min(arr.length - 1, to); i++) s += arr[i]; return s; };

  /* =====================  MODELLEK: Monte-Carlo  ===================== */
  function qTex(q) {
    var v = q.n / q.d, d = q.d, f;
    if (q.d === 1) return String(q.n);
    f = MO.Q.tex(q);
    return f + (Math.abs(Math.round(v * 1e6) / 1e6 - v) < 1e-12 ? ' = ' : ' \\approx ') + MO.tnum(v, Math.abs(Math.round(v * 1e6) / 1e6 - v) < 1e-12 ? 6 : 4);
  }
  /* par: { s: kockaösszeg, r: piros, b: kék, m: létszám } */
  M.valszamMCSetup = function (exp, par) {
    var Q = MO.Q, cats = [], ev = 0, steps = [], q = null, val, i, s, c, pairs, T, r, b, m, prod;
    if (exp === 'dice') {
      s = par.s;
      for (i = 2; i <= 12; i++) cats.push({ label: String(i), q: Q.make(6 - Math.abs(i - 7), 36) });
      ev = s - 2; c = 6 - Math.abs(s - 7); pairs = [];
      for (i = 1; i <= 6; i++) if (s - i >= 1 && s - i <= 6) pairs.push('(' + i + ';' + (s - i) + ')');
      q = Q.make(c, 36);
      steps = ['Két kockával $6\\cdot 6 = 36$ egyformán valószínű dobáspár van (klasszikus modell).',
        'Az összeg akkor $' + s + '$, ha a pár ' + pairs.join(', ') + ': ez $' + c + '$ kedvező eset.',
        '$P(\\text{összeg} = ' + s + ') = \\dfrac{' + c + '}{36} = ' + qTex(q) + '$.'];
      return { cats: cats, ev: ev, q: q, val: q.n / q.d, name: 'két kocka összege ' + s, steps: steps, evLabel: 'az összeg ' + s };
    }
    if (exp === 'urnRep' || exp === 'urnNo') {
      r = par.r; b = par.b; T = r + b;
      if (exp === 'urnRep') {
        cats = [{ label: 'PP', q: Q.make(r * r, T * T) }, { label: 'PK', q: Q.make(r * b, T * T) }, { label: 'KP', q: Q.make(b * r, T * T) }, { label: 'KK', q: Q.make(b * b, T * T) }];
        q = cats[0].q;
        steps = ['Az urnában $' + r + '$ piros és $' + b + '$ kék golyó van, összesen $' + T + '$. Visszatevéssel húzunk, ezért a két húzás egymástól független.',
          'Mindkétszer piros: $P = \\dfrac{' + r + '}{' + T + '}\\cdot\\dfrac{' + r + '}{' + T + '} = ' + qTex(q) + '$.'];
      } else {
        cats = [{ label: 'PP', q: Q.make(r * (r - 1), T * (T - 1)) }, { label: 'PK', q: Q.make(r * b, T * (T - 1)) }, { label: 'KP', q: Q.make(b * r, T * (T - 1)) }, { label: 'KK', q: Q.make(b * (b - 1), T * (T - 1)) }];
        q = cats[0].q;
        steps = ['Az urnában $' + r + '$ piros és $' + b + '$ kék golyó van, összesen $' + T + '$. Visszatevés nélkül húzunk: a második húzásnál eggyel kevesebb golyó van.',
          'Mindkétszer piros: $P = \\dfrac{' + r + '}{' + T + '}\\cdot\\dfrac{' + (r - 1) + '}{' + (T - 1) + '} = ' + qTex(q) + '$' + (r === 1 ? ' (egy piros golyóból nem húzhatsz kettőt, ezért 0)' : '') + '.',
          'Másképp (kombinációkkal): $\\dfrac{\\binom{' + r + '}{2}}{\\binom{' + T + '}{2}} = ' + qTex(q) + '$.'];
      }
      return { cats: cats, ev: 0, q: q, val: q.n / q.d, name: 'két húzás, mindkettő piros', steps: steps, evLabel: 'mindkettő piros' };
    }
    if (exp === 'birthday') {
      m = par.m; prod = 1;
      for (i = 0; i < m; i++) prod *= (365 - i) / 365;
      val = 1 - prod;
      cats = [{ label: 'van egyező', p: val }, { label: 'nincs egyező', p: prod }];
      steps = ['$' + m + '$ ember születésnapja $365^{' + m + '}$ egyformán valószínű módon alakulhat (szökőnap nélkül).',
        'Komplementer esemény: mindenkinek különböző a születésnapja. Ez $365\\cdot 364\\cdots(365-' + m + '+1)$ eset.',
        '$P(\\text{van egyező}) = 1 - \\dfrac{365\\cdot 364\\cdots(365-' + m + '+1)}{365^{' + m + '}} \\approx ' + MO.tnum(val, 4) + '$.',
        'A tört számlálója és nevezője hatalmas szám, ezért itt tizedes törtet adunk meg.'];
      return { cats: cats, ev: 0, q: null, val: val, name: 'van két azonos napon született', steps: steps, evLabel: 'van két azonos napon született' };
    }
    /* pi */
    val = Math.PI / 4;
    cats = [{ label: 'negyedkörben', p: val }, { label: 'kívül', p: 1 - val }];
    steps = ['Véletlen pontot választunk az egységnégyzetben (oldal $1$, terület $1$). A negyedkör ($x^2+y^2\\le 1$) területe $\\dfrac{\\pi}{4}$.',
      'Geometriai valószínűség: $P = \\dfrac{T_{\\text{negyedkör}}}{T_{\\text{négyzet}}} = \\dfrac{\\pi/4}{1} = \\dfrac{\\pi}{4} \\approx ' + MO.tnum(val, 4) + '$.',
      'Ezért $\\pi \\approx 4\\cdot(\\text{relatív gyakoriság})$.'];
    return { cats: cats, ev: 0, q: null, val: val, name: 'a pont a negyedkörben van', steps: steps, evLabel: 'a pont a negyedkörben van' };
  };
  M.valszamMCCheckpoints = function (N) {
    var out = [], i, v, last = 0;
    for (i = 0; ; i++) { v = Math.round(Math.pow(10, i / 16)); if (v > N) break; if (v > last) { out.push(v); last = v; } }
    if (last !== N && N > 0) out.push(N);
    return out;
  };
  /* kísérlet futtatása adott maggal és darabszámmal (az első N kísérlet a magból mindig ugyanaz) */
  M.valszamMCRun = function (exp, par, seed, N) {
    var setup = M.valszamMCSetup(exp, par), rng = MO.rng(seed), counts = [], i, t, hits = 0, cp = M.valszamMCCheckpoints(N), ci = 0, curve = [], pts = [],
      step = Math.max(1, Math.ceil(N / 600)), x, y, cat, a, b2, seen, stamp, j, d, T = (par.r || 0) + (par.b || 0), first, second, ev = setup.ev, hit;
    for (i = 0; i < setup.cats.length; i++) counts.push(0);
    if (exp === 'birthday') seen = new Int32Array(365);
    for (t = 1; t <= N; t++) {
      if (exp === 'dice') { a = rng.int(1, 6); b2 = rng.int(1, 6); cat = a + b2 - 2; }
      else if (exp === 'urnRep') { first = rng.int(1, T) <= par.r; second = rng.int(1, T) <= par.r; cat = (first ? 0 : 2) + (second ? 0 : 1); }
      else if (exp === 'urnNo') {
        first = rng.int(1, T) <= par.r; second = rng.int(1, T - 1) <= (first ? par.r - 1 : par.r); cat = (first ? 0 : 2) + (second ? 0 : 1);
      } else if (exp === 'birthday') {
        stamp = t; cat = 1;
        for (j = 0; j < par.m; j++) { d = rng.int(0, 364); if (seen[d] === stamp) cat = 0; seen[d] = stamp; }
      } else {
        x = rng(); y = rng(); cat = (x * x + y * y <= 1) ? 0 : 1;
        if ((t - 1) % step === 0) pts.push([x, y, cat === 0 ? 1 : 0]);
      }
      counts[cat]++;
      if (cat === ev) hits++;
      if (t === cp[ci]) { curve.push([t, hits]); ci++; }
    }
    return { n: N, hits: hits, counts: counts, curve: curve, pts: pts };
  };

  /* =====================  MODELL: feltételes valószínűség  ===================== */
  /* a, ba, bna: P(A), P(B|A), P(B|nem A) egész százalékban; N a sokaság mérete */
  M.valszamCond = function (N, a, ba, bna) {
    var Q = MO.Q, one = Q.make(1, 1), pA = Q.make(a, 100), pnA = Q.make(100 - a, 100), pBA = Q.make(ba, 100), pBnA = Q.make(bna, 100),
      pAB = Q.mul(pA, pBA), pnAB = Q.mul(pnA, pBnA), pAnB = Q.mul(pA, Q.sub(one, pBA)), pnAnB = Q.mul(pnA, Q.sub(one, pBnA)),
      pB = Q.add(pAB, pnAB), zero = pB.n === 0, pAgB = zero ? null : Q.div(pAB, pB), indep = Q.sub(pAB, Q.mul(pA, pB)).n === 0,
      n1 = Math.round(N * a / 100), n11 = Math.round(N * pAB.n / pAB.d), n2 = N - n1, n21 = Math.round(N * pnAB.n / pnAB.d);
    return { pA: pA, pnA: pnA, pBA: pBA, pBnA: pBnA, pnBA: Q.sub(one, pBA), pnBnA: Q.sub(one, pBnA), pAB: pAB, pnAB: pnAB, pAnB: pAnB, pnAnB: pnAnB, pB: pB, zero: zero, pAgB: pAgB,
      pApB: Q.mul(pA, pB), indep: indep, n11: n11, n12: n1 - n11, n21: n21, n22: n2 - n21, nA: n1, nnA: n2 };
  };

  /* =====================  közös SVG-segédek  ===================== */
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function tx(x, y, s, o) {
    o = o || {};
    return '<text x="' + x + '" y="' + y + '" text-anchor="' + (o.a || 'middle') + '" style="font-size:' + (o.fs || 10) + 'px;' + (o.dim ? 'fill:var(--dim);' : '') + (o.bold ? 'font-weight:700;' : '') + '">' + esc(s) + '</text>';
  }
  function texProb(x) {
    var e, m;
    if (!isFinite(x) || x <= 0) return '0';
    if (x < 1e-4) { e = Math.floor(Math.log(x) / Math.LN10); m = x / Math.pow(10, e); return MO.tnum(m, 3) + '\\cdot 10^{' + e + '}'; }
    return MO.tnum(x, 4);
  }
  function setSlider(root0, id, v) {
    var inp = root0.querySelector('[data-in="' + id + '"]');
    if (!inp) return;
    inp.value = v; inp.dispatchEvent(new Event('input', { bubbles: true }));
  }
  function setPressed(btns, on) { btns.forEach(function (b) { b.setAttribute('aria-pressed', on(b) ? 'true' : 'false'); }); }

  /* =====================  1. KOMBINATORIKA  ===================== */
  function treeSvg(tree, label1, label2) {
    var rh = 16, y = 28, blocks = [], rows = 0, H, s, i, node, nrows, midY, j, ky, kid, W = 340;
    tree.nodes.forEach(function (nd) { nrows = Math.max(1, nd.kids.length + (nd.total2 > nd.kids.length ? 1 : 0)); blocks.push({ nd: nd, rows: nrows }); rows += nrows; });
    if (tree.total1 > tree.nodes.length) rows += 1;
    H = rows * rh + 40;
    s = '<svg class="fig" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Fa-diagram az első két szintről">';
    s += tx(106, 14, label1, { dim: true }) + (tree.len > 1 ? tx(250, 14, label2, { dim: true }) : '');
    var ys = [], tops = y;
    blocks.forEach(function (bl) { ys.push(tops + bl.rows * rh / 2); tops += bl.rows * rh; });
    var rootY = (ys.length ? (ys[0] + ys[ys.length - 1]) / 2 : 40);
    s += '<circle cx="12" cy="' + rootY + '" r="4" fill="var(--fg)"/>';
    blocks.forEach(function (bl, bi) {
      node = bl.nd; midY = ys[bi];
      s += '<line x1="14" y1="' + rootY + '" x2="96" y2="' + midY + '" stroke="var(--dim)" stroke-width="1"/>';
      s += '<circle cx="106" cy="' + midY + '" r="10" fill="var(--soft)" stroke="var(--fg)"/>' + tx(106, midY + 3.5, node.label, { bold: true });
      ky = midY - bl.rows * rh / 2 + rh / 2;
      var base = ys[bi] - bl.rows * rh / 2;
      for (j = 0; j < node.kids.length; j++) {
        kid = base + j * rh + rh / 2;
        s += '<line x1="116" y1="' + midY + '" x2="212" y2="' + kid + '" stroke="var(--dim)" stroke-width="1"/>' + tx(216, kid + 3.5, node.kids[j], { a: 'start', fs: 11 });
      }
      if (node.total2 > node.kids.length) s += tx(216, base + node.kids.length * rh + rh / 2 + 3.5, '… (' + node.total2 + ' ág)', { a: 'start', dim: true });
    });
    if (tree.total1 > tree.nodes.length) s += tx(106, tops + rh / 2 + 3, '⋮ (' + tree.total1 + ' ág)', { dim: true });
    return s + '</svg>';
  }
  function pascalSvg(n, k) {
    var R = Math.max(12, n + 1), W = 340, cw = (W - 24) / R, rh = 19, H = R * rh + 12, tbl = M.valszamPascal(R), s, i, j, cx, cy;
    function C(i0, j0) { return { x: W / 2 + 8 + (j0 - i0 / 2) * cw, y: 14 + i0 * rh }; }
    function box(i0, j0, stroke, dash) { var c = C(i0, j0); return '<rect x="' + (c.x - cw / 2 + 1) + '" y="' + (c.y - 8) + '" width="' + (cw - 2) + '" height="15" rx="3" fill="' + (dash ? 'none' : 'var(--soft)') + '" stroke="' + stroke + '" stroke-width="' + (dash === 2 ? 1.2 : 2) + '"' + (dash ? ' stroke-dasharray="3 2"' : '') + '/>'; }
    s = '<svg class="fig" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Pascal-háromszög">';
    if (k <= n) {
      if (n >= 1 && k !== n - k) s += box(n, n - k, 'var(--c2)', 1);
      if (n >= 1) {
        [[n - 1, k - 1], [n - 1, k]].forEach(function (a) {
          if (a[1] < 0 || a[1] > a[0]) return;
          var c = C(a[0], a[1]), d = C(n, k);
          s += box(a[0], a[1], 'var(--c3)', 2) + '<line x1="' + c.x + '" y1="' + (c.y + 7) + '" x2="' + d.x + '" y2="' + (d.y - 8) + '" stroke="var(--c3)" stroke-width="1"/>';
        });
      }
      s += box(n, k, 'var(--c1)', 0);
    }
    for (i = 0; i < R; i++) {
      s += tx(4, 14 + i * rh + 3, String(i), { a: 'start', fs: 8, dim: true });
      for (j = 0; j <= i; j++) { cx = C(i, j); s += tx(cx.x, cx.y + 3, String(tbl[i][j]), { fs: R > 12 ? 8 : 9 }); }
    }
    return s + '</svg>';
  }

  MO.simDefs.push({
    id: 'kombinatorika',
    title: 'Kombinatorikai kalkulátor',
    desc: 'Válaszolj két kérdésre (számít-e a sorrend, lehet-e ismétlődés), és megkapod a típust, a képletet, a számolást, az összes esetet és a Pascal-háromszöget.',
    group: 'kombinatorika és valószínűség',
    topic: 'gondolkodas', sub: 'kombinatorika',
    formulas: ['g-permutacio', 'g-permutacio-ism', 'g-variacio', 'g-variacio-ism', 'g-kombinacio', 'g-binom-szimmetria', 'g-pascal'],
    build: function (kit) {
      var st = { order: 1, rep: 0, mode: 'p' }, cur = { n: 5, k: 3 };
      function yn(q, label, v0) {
        return '<div class="lab" style="margin-top:8px">' + label + '</div><div class="row">' +
          '<button class="btn sm" type="button" data-q="' + q + '" data-v="1" aria-pressed="' + (v0 ? 'true' : 'false') + '">igen</button>' +
          '<button class="btn sm" type="button" data-q="' + q + '" data-v="0" aria-pressed="' + (v0 ? 'false' : 'true') + '">nem</button></div>';
      }
      var n = kit.el('<div>' + yn('order', 'Számít a sorrend?', 1) + yn('rep', 'Lehet ismétlődés?', 0) +
        '<div data-box="mode" style="display:none"><div class="lab" style="margin-top:8px">Melyik helyzet?</div><div class="row">' +
        '<button class="btn sm" type="button" data-m="p" aria-pressed="true">az n elem között vannak egyformák</button>' +
        '<button class="btn sm" type="button" data-m="v" aria-pressed="false">k-szor választunk az n elemből</button></div></div>' +
        kit.slider('n', 'n (elemek száma)', 1, 12, 1, 5) + kit.slider('k', 'k (kiválasztott elemek száma)', 1, 12, 1, 3) +
        '<div data-box="groups" style="display:none"><label class="f"><span>egyforma elemek csoportjai (pl. 2,3,2)</span><input type="text" data-groups value="2,2" autocomplete="off"></label></div>' +
        '<div class="row" style="margin-top:10px"><span class="lab" style="width:100%">Tipikus érettségi helyzetek</span>' +
        '<button class="btn sm" type="button" data-preset="1;0;5;5;p;">5 ember sorban</button>' +
        '<button class="btn sm" type="button" data-preset="0;0;8;3;p;">3 fős csapat 8 emberből</button>' +
        '<button class="btn sm" type="button" data-preset="1;1;10;4;v;">4 jegyű PIN-kód</button>' +
        '<button class="btn sm" type="button" data-preset="1;1;10;10;p;2,3,2">MATEMATIKA betűi</button>' +
        '<button class="btn sm" type="button" data-preset="1;0;10;3;p;">dobogó 10 versenyzőből</button></div>' +
        '<div class="out o-type" style="margin-top:12px"></div><div class="out o-steps"></div><div class="out o-list"></div>' +
        '<h4 class="lab" style="margin-top:16px">Pascal-háromszög</h4><div class="o-pascal"></div></div>');

      function render() {
        var nn = cur.n, kk = cur.k, type = M.valszamType(st.order, st.rep, st.mode, nn, kk), g = { ok: true, groups: [] }, f, html = '', spec, tree, list, why, o = kit.$('.o-type', n);
        kit.$('[data-box="mode"]', n).style.display = (st.order && st.rep) ? '' : 'none';
        kit.$('[data-box="groups"]', n).style.display = type === 'permRep' ? '' : 'none';
        if (type === 'permRep') g = M.valszamGroups(kit.$('[data-groups]', n).value, nn);
        why = (st.order ? 'A sorrend számít' : 'A sorrend nem számít') + ', ' + (st.rep ? 'az ismétlődés megengedett' : 'ismétlődés nincs') + '.';
        if (!g.ok) {
          o.innerHTML = '<p class="msg bad">' + kit.esc(g.msg) + '</p>';
          kit.$('.o-steps', n).innerHTML = ''; kit.$('.o-list', n).innerHTML = '';
        } else {
          f = M.valszamFormula(type, nn, kk, g.groups);
          o.innerHTML = '<p>' + why + ' <span class="tag on">' + f.name + '</span>' + (f.extra ? ' <span class="tag">kiegészítés: a követelményben nem szerepel</span>' : '') +
            (type === 'perm' ? ' <span class="tag">k = n</span>' : '') + (type === 'var' ? ' <span class="tag">k &lt; n; ha k = n, permutáció</span>' : '') + '</p>' +
            ((type === 'perm' || type === 'permRep') ? '<p class="dim">Itt k nem számít, mert mind az n elemet sorba rendezzük.</p>' : '');
          kit.$('.o-steps', n).innerHTML = kit.steps(['**Képlet:** $' + f.gen + '$', '**Behelyettesítés:** $' + f.sub + '$', '**Eredmény:** $' + MO.tbig(f.value) + '$ lehetőség.']);
          spec = M.valszamSpec(type, nn, kk, g.groups);
          if (f.value === 0) html = '<p class="msg bad">Ilyen kiválasztás nincs (k nagyobb n-nél), ezért nincs mit felsorolni.</p>';
          else if (f.value <= 30) {
            list = M.valszamEnum(spec, 31);
            html = '<div class="lab" style="margin-top:8px">Az összes eset (' + f.value + ' db; az elemek: ' + spec.alpha.join(', ') + (type === 'permRep' ? '; a betűk száma: ' + spec.cnt.join(', ') : '') + ')</div><div class="cells">' +
              list.map(function (w) { return '<span>' + w + '</span>'; }).join('') + '</div>';
          } else {
            tree = M.valszamTree(spec, 3, 3);
            html = '<div class="lab" style="margin-top:8px">' + MO.big(f.value) + ' eset van, ezért csak a fa első két szintjét rajzoljuk</div>' +
              treeSvg(tree, '1. hely: ' + tree.total1 + ' lehetőség', '2. hely: ágankénti ' + (tree.nodes[0] ? tree.nodes[0].total2 : 0));
          }
          kit.$('.o-list', n).innerHTML = html;
        }
        /* Pascal */
        var b = M.valszamBinom(nn, kk), p = kit.$('.o-pascal', n), t = '';
        if (kk > nn) t = '<p class="msg bad">k &gt; n: a ' + nn + '. sorban nincs ' + kk + '. elem, ezért $\\binom{' + nn + '}{' + kk + '} = 0$.</p>';
        else {
          t = kit.steps(['**Kiemelt elem:** $\\dbinom{' + nn + '}{' + kk + '} = ' + MO.tbig(b) + '$ (a ' + nn + '. sor ' + kk + '. eleme; a számozás 0-tól indul).',
            '**Szimmetria:** $\\dbinom{' + nn + '}{' + kk + '} = \\dbinom{' + nn + '}{' + (nn - kk) + '} = ' + MO.tbig(M.valszamBinom(nn, nn - kk)) + '$' + (kk === nn - kk ? ' (itt a két elem ugyanaz).' : ' (szaggatott keret).'),
            (kk === 0 || kk === nn) ? '**Szél:** a sorok szélén mindig $1$ áll: $\\dbinom{' + nn + '}{' + kk + '} = 1$.' :
              '**Két fölötte lévő összege:** $\\dbinom{' + nn + '}{' + kk + '} = \\dbinom{' + (nn - 1) + '}{' + (kk - 1) + '} + \\dbinom{' + (nn - 1) + '}{' + kk + '} = ' + M.valszamBinom(nn - 1, kk - 1) + ' + ' + M.valszamBinom(nn - 1, kk) + ' = ' + MO.tbig(b) + '$ (pontvonalas keretek).',
            '**Sorösszeg:** a ' + nn + '. sor elemeinek összege $2^{' + nn + '} = ' + MO.tbig(Math.pow(2, nn)) + '$.']);
        }
        p.innerHTML = pascalSvg(nn, kk) + '<p class="dim" style="font-size:12px">Folytonos keret: kiválasztott elem; szaggatott: szimmetrikus párja; pontvonalas: a két fölötte lévő elem.</p>' + '<div class="out">' + (kk > nn ? kit.md(t) : t) + '</div>';
      }
      kit.bindSliders(n, function (v) { cur.n = Math.round(v.n); cur.k = Math.round(v.k); render(); });
      kit.$$('[data-q]', n).forEach(function (bt) {
        kit.on(bt, 'click', function () {
          st[bt.dataset.q] = parseInt(bt.dataset.v, 10);
          setPressed(kit.$$('[data-q="' + bt.dataset.q + '"]', n), function (x) { return parseInt(x.dataset.v, 10) === st[bt.dataset.q]; });
          render();
        });
      });
      kit.$$('[data-m]', n).forEach(function (bt) {
        kit.on(bt, 'click', function () { st.mode = bt.dataset.m; setPressed(kit.$$('[data-m]', n), function (x) { return x.dataset.m === st.mode; }); render(); });
      });
      kit.on(kit.$('[data-groups]', n), 'input', render);
      kit.$$('[data-preset]', n).forEach(function (bt) {
        kit.on(bt, 'click', function () {
          var s = bt.dataset.preset.split(';');
          st.order = parseInt(s[0], 10); st.rep = parseInt(s[1], 10); st.mode = s[4];
          setPressed(kit.$$('[data-q="order"]', n), function (x) { return parseInt(x.dataset.v, 10) === st.order; });
          setPressed(kit.$$('[data-q="rep"]', n), function (x) { return parseInt(x.dataset.v, 10) === st.rep; });
          setPressed(kit.$$('[data-m]', n), function (x) { return x.dataset.m === st.mode; });
          if (s[5]) kit.$('[data-groups]', n).value = s[5];
          setSlider(n, 'n', s[2]); setSlider(n, 'k', s[3]); render();
        });
      });
      return n;
    }
  });

  /* =====================  2. BINOMIÁLIS ELOSZLÁS  ===================== */
  function barsSvg(pmf, kSel, mean, hp, labelK) {
    var W = 340, H = 200, L = 34, R = 6, T = 18, B = 26, n = pmf.length - 1, mx = 0, i, s, bw, x, h, top, step, ph = H - T - B, pw = W - L - R;
    for (i = 0; i <= n; i++) mx = Math.max(mx, pmf[i], hp && hp[i] ? hp[i] : 0);
    top = Math.max(0.05, Math.ceil(mx * 1.12 * 20) / 20);
    bw = pw / (n + 1);
    s = '<svg class="fig" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Oszlopdiagram a valószínűségekről">';
    [0, 0.5, 1].forEach(function (f) {
      var y = T + ph - f * ph;
      s += '<line x1="' + L + '" x2="' + (W - R) + '" y1="' + y + '" y2="' + y + '" stroke="var(--line)" stroke-width="' + (f === 0 ? 1 : 0.5) + '"/>' + tx(L - 4, y + 3, MO.num(top * f, 2), { a: 'end', fs: 9, dim: true });
    });
    step = n <= 12 ? 1 : n <= 24 ? 2 : 5;
    for (i = 0; i <= n; i++) {
      x = L + i * bw; h = pmf[i] / top * ph;
      s += '<rect x="' + (x + bw * 0.1) + '" y="' + (T + ph - h) + '" width="' + (bw * 0.8) + '" height="' + Math.max(h, 0) + '" fill="' + (i === kSel ? 'var(--fg)' : 'var(--c1)') + '" fill-opacity="' + (i === kSel ? 1 : 0.5) + '"/>';
      if (i % step === 0) s += tx(x + bw / 2, H - B + 12, String(i), { fs: 9, dim: true });
    }
    if (hp) {
      var pts = [];
      for (i = 0; i <= n; i++) { x = L + i * bw + bw / 2; pts.push(x + ',' + (T + ph - (hp[i] || 0) / top * ph)); }
      s += '<polyline points="' + pts.join(' ') + '" fill="none" stroke="var(--fg)" stroke-width="1.2" stroke-dasharray="3 2"/>';
      for (i = 0; i <= n; i++) s += '<circle cx="' + (L + i * bw + bw / 2) + '" cy="' + (T + ph - (hp[i] || 0) / top * ph) + '" r="2" fill="var(--bg)" stroke="var(--fg)" stroke-width="1"/>';
    }
    x = L + (mean + 0.5) * bw;
    s += '<line x1="' + x + '" x2="' + x + '" y1="' + T + '" y2="' + (T + ph) + '" stroke="var(--dim)" stroke-dasharray="4 3"/>' + tx(Math.min(W - 14, x + 4), 9, 'n·p', { a: 'start', fs: 9, dim: true });
    s += tx(L + (kSel + 0.5) * bw, Math.max(20, T + ph - pmf[kSel] / top * ph - 4), labelK, { fs: 9, bold: true });
    s += tx(W / 2, H - 2, 'k', { fs: 9, dim: true });
    return s + '</svg>';
  }

  MO.simDefs.push({
    id: 'binomialis',
    title: 'Binomiális eloszlás',
    desc: 'Állítsd az n és p értékét, válassz egy k-t: oszlopdiagram, P(ξ = k), P(ξ ≤ k), P(ξ ≥ k), várható érték, és összehasonlítás a visszatevés nélküli mintavétellel.',
    group: 'kombinatorika és valószínűség',
    topic: 'valoszinuseg', sub: 'valszam',
    formulas: ['v-binomialis', 'v-binomialis-varhato', 'v-hipergeometrikus'],
    build: function (kit) {
      var st = { q: '', cmp: false };
      var n = kit.el('<div>' + kit.slider('n', 'n (ismétlések száma)', 1, 40, 1, 10) + kit.slider('p', 'p (siker valószínűsége)', 0.01, 0.99, 0.01, 0.3) + kit.slider('k', 'k (kiemelt érték)', 0, 40, 1, 3) +
        '<div class="row" style="margin-top:8px"><button class="btn sm" type="button" data-bq="atleast" aria-pressed="false">legalább egy</button>' +
        '<button class="btn sm" type="button" data-bq="atmost2" aria-pressed="false">legfeljebb kettő</button>' +
        '<button class="btn sm" type="button" data-cmp="1" aria-pressed="false">összehasonlítás: visszatevés nélkül</button></div>' +
        '<div data-box="hyper" style="display:none">' + kit.slider('N', 'N (a sokaság elemszáma)', 10, 100, 1, 30) + '<p class="dim" style="margin:4px 0">A jelöltek száma $K = \\text{kerekítve}(p\\cdot N)$, így a sokaságban ugyanolyan az arány.</p></div>' +
        '<div class="out o-chart" style="margin-top:10px"></div><div class="out o-main"></div><div class="out o-q"></div><div class="out o-hyp"></div>' +
        '<div class="row" style="margin-top:10px"><span class="lab" style="width:100%">Tipikus érettségi helyzetek</span>' +
        '<button class="btn sm" type="button" data-preset="10;0.5;5;;0;30">érme 10-szer, pontosan 5 fej</button>' +
        '<button class="btn sm" type="button" data-preset="20;0.1;1;atleast;0;30">20 termék, 10% selejt, van selejtes</button>' +
        '<button class="btn sm" type="button" data-preset="12;0.25;6;;0;30">12 teszt kérdés, tippelés</button>' +
        '<button class="btn sm" type="button" data-preset="5;0.4;2;atmost2;1;30">5 húzás: 30-ból 12 jelölt</button></div></div>');

      function render(v) {
        var nn = Math.round(v.n), p = Math.round(v.p * 100) / 100, kk = Math.min(Math.round(v.k), nn), pmf = M.valszamBinomPmf(nn, p), S = M.valszamSum,
          pk = pmf[kk], le = S(pmf, 0, kk), ge = S(pmf, kk, nn), NN = Math.round(v.N), K = Math.round(p * NN), nh = Math.min(nn, NN), hp = null, html, q1 = 1 - p;
        kit.$('[data-box="hyper"]', n).style.display = st.cmp ? '' : 'none';
        if (st.cmp) hp = M.valszamHyperPmf(NN, K, nh);
        kit.$('.o-chart', n).innerHTML = barsSvg(pmf, kk, nn * p, hp, 'k=' + kk) +
          '<p class="dim" style="font-size:12px">Oszlop: binomiális (visszatevéses) eloszlás, a kiemelt oszlop teli. Szaggatott vonal karikákkal: hipergeometriai (visszatevés nélküli)' + (st.cmp ? '' : ' – kapcsolható') + '. A függőleges szaggatott vonal: a várható érték, n·p.</p>';
        html = kit.steps([
          '**Pontosan k:** $P(\\xi = ' + kk + ') = \\dbinom{' + nn + '}{' + kk + '}\\cdot p^{' + kk + '}\\cdot(1-p)^{' + (nn - kk) + '} = \\dbinom{' + nn + '}{' + kk + '}\\cdot ' + MO.tnum(p, 2) + '^{' + kk + '}\\cdot ' + MO.tnum(q1, 2) + '^{' + (nn - kk) + '} \\approx ' + texProb(pk) + '$',
          '**Legfeljebb k:** $P(\\xi \\le ' + kk + ') = \\sum_{i=0}^{' + kk + '} P(\\xi = i) \\approx ' + texProb(le) + '$',
          '**Legalább k:** $P(\\xi \\ge ' + kk + ') = ' + (kk === 0 ? '1' : '1 - P(\\xi \\le ' + (kk - 1) + ')') + ' \\approx ' + texProb(ge) + '$',
          '**Várható érték:** $E(\\xi) = n\\cdot p = ' + nn + '\\cdot ' + MO.tnum(p, 2) + ' = ' + MO.tnum(nn * p, 3) + '$',
          '**Ellenőrzés:** az összes valószínűség összege $\\sum_{i=0}^{' + nn + '} P(\\xi = i) = ' + MO.tnum(S(pmf, 0, nn), 6) + '$.']);
        kit.$('.o-main', n).innerHTML = (Math.round(v.k) > nn ? '<p class="dim">k legfeljebb n lehet, ezért k = ' + nn + '-nel számoltunk.</p>' : '') + html;
        var qh = '';
        if (st.q === 'atleast') qh = '<div class="ans">' + kit.md('**Legalább egy** (komplementerrel): $P(\\xi \\ge 1) = 1 - P(\\xi = 0) = 1 - (1-p)^n = 1 - ' + MO.tnum(q1, 2) + '^{' + nn + '} \\approx ' + texProb(1 - Math.pow(q1, nn)) + '$') + '</div>';
        if (st.q === 'atmost2') {
          var m2 = Math.min(2, nn), terms = [], i;
          for (i = 0; i <= m2; i++) terms.push(texProb(pmf[i]));
          qh = '<div class="ans">' + kit.md('**Legfeljebb kettő:** $P(\\xi \\le 2) = P(\\xi=0) + P(\\xi=1)' + (nn >= 2 ? ' + P(\\xi=2)' : '') + ' \\approx ' + terms.join(' + ') + ' \\approx ' + texProb(S(pmf, 0, m2)) + '$' + (nn < 2 ? ' (n &lt; 2, ezért csak ennyi tag van).' : '')) + '</div>';
        }
        kit.$('.o-q', n).innerHTML = qh;
        var hh = '';
        if (st.cmp) {
          var kh = Math.min(kk, nh), ph = hp[kh] || 0, possible = kk <= nh && kk <= K && nh - kk <= NN - K;
          hh = '<div class="lab" style="margin-top:12px">Visszatevés nélkül (hipergeometriai)</div>' +
            (nn > NN ? '<p class="dim">Visszatevés nélkül legfeljebb ' + NN + ' elemet húzhatsz, ezért n helyett ' + NN + '-nel számoltunk.</p>' : '') +
            kit.steps(['**Sokaság:** $N = ' + NN + '$, ebből $K = ' + K + '$ jelölt (arány: $K/N = ' + MO.tnum(K / NN, 3) + '$; a binomiális modellben $p = ' + MO.tnum(p, 2) + '$), $' + nh + '$ húzás.',
              '**Pontosan k:** $P(\\eta = ' + kk + ') = \\dfrac{\\binom{K}{k}\\binom{N-K}{n-k}}{\\binom{N}{n}} = \\dfrac{\\binom{' + K + '}{' + kk + '}\\binom{' + (NN - K) + '}{' + (nh - kk) + '}}{\\binom{' + NN + '}{' + nh + '}} \\approx ' + texProb(possible ? ph : 0) + '$' + (possible ? '' : ' (ilyen kimenet nem lehetséges)'),
              '**Összehasonlítás:** visszatevéssel $' + texProb(pk) + '$, visszatevés nélkül $' + texProb(possible ? ph : 0) + '$. Ha a sokaság sokkal nagyobb a mintánál, a kettő alig tér el.',
              '**Várható érték:** $E(\\eta) = n\\cdot\\dfrac{K}{N} = ' + MO.tnum(nh * K / NN, 3) + '$.']);
        }
        kit.$('.o-hyp', n).innerHTML = hh;
      }
      kit.bindSliders(n, render);
      function again() { kit.$('[data-in="k"]', n).dispatchEvent(new Event('input', { bubbles: true })); }
      kit.$$('[data-bq]', n).forEach(function (bt) {
        kit.on(bt, 'click', function () {
          st.q = st.q === bt.dataset.bq ? '' : bt.dataset.bq;
          setPressed(kit.$$('[data-bq]', n), function (x) { return x.dataset.bq === st.q; }); again();
        });
      });
      kit.on(kit.$('[data-cmp]', n), 'click', function () { st.cmp = !st.cmp; this.setAttribute('aria-pressed', st.cmp ? 'true' : 'false'); again(); });
      kit.$$('[data-preset]', n).forEach(function (bt) {
        kit.on(bt, 'click', function () {
          var s = bt.dataset.preset.split(';');
          st.q = s[3]; st.cmp = s[4] === '1';
          setPressed(kit.$$('[data-bq]', n), function (x) { return x.dataset.bq === st.q; });
          kit.$('[data-cmp]', n).setAttribute('aria-pressed', st.cmp ? 'true' : 'false');
          setSlider(n, 'N', s[5]); setSlider(n, 'n', s[0]); setSlider(n, 'p', s[1]); setSlider(n, 'k', s[2]);
        });
      });
      return n;
    }
  });

  /* =====================  3. MONTE-CARLO  ===================== */
  function catsSvg(setup, run) {
    var W = 340, H = 170, L = 34, R = 6, T = 14, B = 30, k = setup.cats.length, ph = H - T - B, pw = W - L - R, bw = pw / k, mx = 0, i, s, top, N = run ? run.n : 0, x, h, th, pc;
    for (i = 0; i < k; i++) { pc = setup.cats[i].q ? setup.cats[i].q.n / setup.cats[i].q.d : setup.cats[i].p; mx = Math.max(mx, pc, N ? run.counts[i] / N : 0); }
    top = Math.max(0.05, Math.ceil(mx * 1.15 * 20) / 20);
    s = '<svg class="fig" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="A kimenetek relatív gyakorisága és elméleti valószínűsége">';
    [0, 0.5, 1].forEach(function (f) { var y = T + ph - f * ph; s += '<line x1="' + L + '" x2="' + (W - R) + '" y1="' + y + '" y2="' + y + '" stroke="var(--line)" stroke-width="' + (f === 0 ? 1 : 0.5) + '"/>' + tx(L - 4, y + 3, MO.num(top * f, 2), { a: 'end', fs: 9, dim: true }); });
    for (i = 0; i < k; i++) {
      pc = setup.cats[i].q ? setup.cats[i].q.n / setup.cats[i].q.d : setup.cats[i].p;
      x = L + i * bw; h = N ? run.counts[i] / N / top * ph : 0; th = T + ph - pc / top * ph;
      s += '<rect x="' + (x + bw * 0.12) + '" y="' + (T + ph - h) + '" width="' + (bw * 0.76) + '" height="' + h + '" fill="' + (i === setup.ev ? 'var(--fg)' : 'var(--c1)') + '" fill-opacity="' + (i === setup.ev ? 0.9 : 0.5) + '"/>';
      s += '<line x1="' + (x + bw * 0.04) + '" x2="' + (x + bw * 0.96) + '" y1="' + th + '" y2="' + th + '" stroke="var(--fg)" stroke-width="1.5" stroke-dasharray="3 2"/>';
      s += tx(x + bw / 2, H - B + 12, setup.cats[i].label, { fs: k > 6 ? 10 : 11, dim: i !== setup.ev, bold: i === setup.ev });
    }
    return s + '</svg>';
  }
  function cloudSvg(run) {
    var S = 300, s = '<svg class="fig" viewBox="0 0 320 320" role="img" aria-label="Véletlen pontok az egységnégyzetben">', i, p;
    s += '<rect x="10" y="10" width="' + S + '" height="' + S + '" fill="none" stroke="var(--fg)"/>';
    s += '<path d="M10 310 L310 310 A300 300 0 0 0 10 10 Z" fill="var(--soft)" fill-opacity="0.6" stroke="var(--fg)" stroke-width="1.4" stroke-dasharray="5 3"/>';
    if (run) for (i = 0; i < run.pts.length; i++) {
      p = run.pts[i];
      s += p[2] ? '<circle cx="' + (10 + p[0] * S).toFixed(1) + '" cy="' + (310 - p[1] * S).toFixed(1) + '" r="1.9" fill="var(--fg)"/>'
        : '<circle cx="' + (10 + p[0] * S).toFixed(1) + '" cy="' + (310 - p[1] * S).toFixed(1) + '" r="1.9" fill="none" stroke="var(--dim)" stroke-width="0.9"/>';
    }
    return s + '</svg>';
  }
  function curveSvg(run, theory) {
    var W = 340, H = 180, L = 36, R = 8, T = 12, B = 28, pw = W - L - R, ph = H - T - B, s, ymax = Math.min(1, Math.max(0.1, theory * 2.5)), N = run ? run.n : 0, lx, X, Y, i, pts = [], e, d;
    s = '<svg class="fig" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="A relatív gyakoriság alakulása a kísérletek számának függvényében">';
    X = function (n) { return L + (Math.log(Math.max(1, n)) / Math.LN10) / Math.max(1, Math.log(Math.max(10, N)) / Math.LN10) * pw; };
    Y = function (f) { return T + ph - Math.max(0, Math.min(1, f / ymax)) * ph; };
    [0, 0.5, 1].forEach(function (f) { s += '<line x1="' + L + '" x2="' + (W - R) + '" y1="' + Y(ymax * f) + '" y2="' + Y(ymax * f) + '" stroke="var(--line)" stroke-width="' + (f === 0 ? 1 : 0.5) + '"/>' + tx(L - 4, Y(ymax * f) + 3, MO.num(ymax * f, 2), { a: 'end', fs: 9, dim: true }); });
    for (e = 0; e <= 6; e++) { d = Math.pow(10, e); if (d > Math.max(10, N)) break; s += tx(X(d), H - B + 12, String(d), { fs: 9, dim: true, a: X(d) > W - 22 ? 'end' : 'middle' }); }
    s += tx(L + pw / 2, H - 3, 'kísérletek száma (logaritmikus skála)', { fs: 9, dim: true });
    s += '<line x1="' + L + '" x2="' + (W - R) + '" y1="' + Y(theory) + '" y2="' + Y(theory) + '" stroke="var(--fg)" stroke-width="1.3" stroke-dasharray="5 3"/>' + tx(W - R - 2, Y(theory) - 4, 'elméleti: ' + MO.num(theory, 4), { a: 'end', fs: 9 });
    if (run && run.curve.length) {
      for (i = 0; i < run.curve.length; i++) pts.push(X(run.curve[i][0]).toFixed(1) + ',' + Y(run.curve[i][1] / run.curve[i][0]).toFixed(1));
      s += '<polyline points="' + pts.join(' ') + '" fill="none" stroke="var(--c1)" stroke-width="1.8"/>';
    } else s += tx(L + pw / 2, T + ph / 2, 'még nincs kísérlet', { dim: true });
    return s + '</svg>';
  }

  MO.simDefs.push({
    id: 'monte-carlo',
    title: 'Kísérletek sokszor megismételve',
    desc: 'Futtass 100, 1000 vagy 10 000 véletlen kísérletet (kockák, urna, születésnap, pontok a négyzetben), és nézd, hogyan közelíti a relatív gyakoriság az elméleti valószínűséget.',
    group: 'kombinatorika és valószínűség',
    topic: 'valoszinuseg', sub: 'valszam',
    formulas: ['v-relativ-gyakorisag', 'v-klasszikus', 'v-geometriai'],
    build: function (kit) {
      var SEED0 = 12345, CAP = 100000, st = { exp: 'dice', seed: SEED0, N: 1000 };
      var n = kit.el('<div>' + kit.select('exp', 'Kísérlet', [['dice', 'két kocka összege'], ['urnRep', 'urna, visszatevéssel'], ['urnNo', 'urna, visszatevés nélkül'], ['birthday', 'születésnap-paradoxon'], ['pi', 'geometriai valószínűség (π)']], 'dice') +
        '<div data-for="dice">' + kit.slider('s', 'a kockák összege', 2, 12, 1, 7) + '</div>' +
        '<div data-for="urnRep urnNo">' + kit.slider('r', 'piros golyók száma', 1, 8, 1, 3) + kit.slider('b', 'kék golyók száma', 1, 8, 1, 2) + '<p class="dim" style="margin:4px 0">Két golyót húzunk; az esemény: mindkettő piros.</p></div>' +
        '<div data-for="birthday">' + kit.slider('m', 'a csoport létszáma', 2, 60, 1, 23) + '</div>' +
        '<div class="row" style="margin-top:10px"><button class="btn sm" type="button" data-run="100">100 kísérlet</button><button class="btn sm" type="button" data-run="1000">1000 kísérlet</button><button class="btn sm" type="button" data-run="10000">10 000 kísérlet</button><button class="btn sm" type="button" data-reset="1">újrakezdés</button></div>' +
        '<div class="out o-status" style="margin-top:8px"></div><div class="out o-pic"></div><div class="out o-curve"></div><div class="out o-res"></div>' +
        '<div class="row" style="margin-top:10px"><span class="lab" style="width:100%">Tipikus érettségi helyzetek</span>' +
        '<button class="btn sm" type="button" data-preset="dice;7;3;2;23">két kocka, összeg 7</button>' +
        '<button class="btn sm" type="button" data-preset="urnNo;7;3;2;23">3 piros, 2 kék, visszatevés nélkül</button>' +
        '<button class="btn sm" type="button" data-preset="urnRep;7;3;2;23">3 piros, 2 kék, visszatevéssel</button>' +
        '<button class="btn sm" type="button" data-preset="birthday;7;3;2;23">23 fős csoport, születésnap</button>' +
        '<button class="btn sm" type="button" data-preset="pi;7;3;2;23">π közelítése pontokkal</button></div></div>');
      var vals = { s: 7, r: 3, b: 2, m: 23 };

      function render() {
        var par = { s: Math.round(vals.s), r: Math.round(vals.r), b: Math.round(vals.b), m: Math.round(vals.m) }, setup = M.valszamMCSetup(st.exp, par), run = st.N > 0 ? M.valszamMCRun(st.exp, par, st.seed, st.N) : null, rf, html, th = setup.val, steps;
        kit.$$('[data-for]', n).forEach(function (d) { d.style.display = d.dataset.for.split(' ').indexOf(st.exp) >= 0 ? '' : 'none'; });
        kit.$('.o-status', n).innerHTML = '<p class="dim" style="margin:0">Eddigi kísérletek: ' + MO.big(st.N) + ' · mag: ' + st.seed + (st.N >= CAP ? ' · elérted a ' + MO.big(CAP) + ' kísérletes korlátot' : '') + '</p>';
        kit.$('.o-pic', n).innerHTML = (st.exp === 'pi' ? cloudSvg(run) + '<p class="dim" style="font-size:12px">Teli pont: a negyedkörben, karika: kívül (legfeljebb ~600 pontot rajzolunk). Szaggatott ív: a negyedkör széle.</p>'
          : catsSvg(setup, run) + '<p class="dim" style="font-size:12px">Oszlop: relatív gyakoriság (a vizsgált esemény teli). Szaggatott vonal: elméleti valószínűség.</p>');
        kit.$('.o-curve', n).innerHTML = '<div class="lab">A relatív gyakoriság alakulása</div>' + curveSvg(run, th);
        if (run) {
          rf = run.hits / run.n;
          steps = ['**Kísérlet:** ' + setup.name + '. Eddig $' + MO.tbig(run.n) + '$ kísérlet volt, ebből $' + MO.tbig(run.hits) + '$-szor következett be az esemény.',
            '**Relatív gyakoriság:** $\\dfrac{' + MO.tbig(run.hits) + '}{' + MO.tbig(run.n) + '} \\approx ' + MO.tnum(rf, 4) + '$.'];
        } else steps = ['**Még nincs kísérlet.** Nyomd meg valamelyik kísérlet-gombot.'];
        steps = steps.concat(setup.steps);
        if (run) {
          steps.push('**Összevetés:** az eltérés $|' + MO.tnum(rf, 4) + ' - ' + MO.tnum(th, 4) + '| \\approx ' + MO.tnum(Math.abs(rf - th), 4) + '$. Sok kísérletnél a relatív gyakoriság általában az elméleti valószínűség közelében marad (szemléletes kapcsolat, nem bizonyítás).');
          if (st.exp === 'pi') steps.push('**π közelítése:** $4\\cdot' + MO.tnum(rf, 4) + ' \\approx ' + MO.tnum(4 * rf, 4) + '$ (a valódi érték $\\pi \\approx 3{,}1416$).');
        }
        kit.$('.o-res', n).innerHTML = kit.steps(steps);
      }
      kit.bindSliders(n, function (v) { vals = v; render(); });
      kit.on(kit.$('[data-sel="exp"]', n), 'change', function () { st.exp = this.value; render(); });
      kit.$$('[data-run]', n).forEach(function (bt) { kit.on(bt, 'click', function () { st.N = Math.min(CAP, st.N + parseInt(bt.dataset.run, 10)); render(); }); });
      kit.on(kit.$('[data-reset]', n), 'click', function () { st.seed += 1; st.N = 0; render(); });
      kit.$$('[data-preset]', n).forEach(function (bt) {
        kit.on(bt, 'click', function () {
          var s = bt.dataset.preset.split(';'), sel = kit.$('[data-sel="exp"]', n);
          st.exp = s[0]; sel.value = s[0]; st.N = 1000;
          setSlider(n, 's', s[1]); setSlider(n, 'r', s[2]); setSlider(n, 'b', s[3]); setSlider(n, 'm', s[4]);
        });
      });
      return n;
    }
  });

  /* =====================  4. FELTÉTELES VALÓSZÍNŰSÉG  ===================== */
  function probTreeSvg(c, nameA, nameB) {
    var W = 340, H = 230, N = MO.num, v = function (q) { return N(q.n / q.d, 4); }, s, ys = [28, 82, 148, 202];
    s = '<svg class="fig" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Valószínűségi fa">';
    s += '<circle cx="12" cy="115" r="4" fill="var(--fg)"/>';
    [[55, c.pA, 'A', 0], [175, c.pnA, 'Ā', 1]].forEach(function (a) {
      s += '<line x1="14" y1="115" x2="86" y2="' + a[0] + '" stroke="var(--dim)"/>' + tx(40, (115 + a[0]) / 2 + (a[3] ? 12 : -4), v(a[1]), { fs: 10 });
      s += '<circle cx="98" cy="' + a[0] + '" r="11" fill="var(--soft)" stroke="var(--fg)"/>' + tx(98, a[0] + 4, a[2], { bold: true, fs: 11 });
    });
    var L2 = [[55, 28, c.pBA, 'B', c.pAB, 'A·B'], [55, 82, c.pnBA, 'B̄', c.pAnB, 'A·B̄'], [175, 148, c.pBnA, 'B', c.pnAB, 'Ā·B'], [175, 202, c.pnBnA, 'B̄', c.pnAnB, 'Ā·B̄']];
    L2.forEach(function (a, i) {
      s += '<line x1="109" y1="' + a[0] + '" x2="170" y2="' + a[1] + '" stroke="var(--dim)"/>' + tx(131, (a[0] + a[1]) / 2 + (i % 2 ? 11 : -3), v(a[2]), { fs: 10 });
      s += '<circle cx="182" cy="' + a[1] + '" r="11" fill="var(--soft)" stroke="var(--fg)"/>' + tx(182, a[1] + 4, a[3], { bold: true, fs: 11 });
      s += tx(200, a[1] + 4, a[5] + ' = ' + v(a[4]), { a: 'start', fs: 10 });
    });
    s += tx(14, 12, 'ág: feltétel nélküli / feltételes valószínűség', { a: 'start', fs: 8, dim: true });
    return s + '</svg>';
  }
  MO.simDefs.push({
    id: 'felteteles',
    title: 'Feltételes valószínűség',
    desc: 'Két esemény egy sokaságban: valószínűségi fa és kontingencia-táblázat, P(A·B), P(B), P(A|B) lépésenként, és annak vizsgálata, hogy A és B független-e.',
    group: 'kombinatorika és valószínűség',
    topic: 'valoszinuseg', sub: 'valszam',
    formulas: ['v-feltetelesvalszam', 'v-fuggetlen'],
    build: function (kit) {
      var names = { A: 'a személy beteg', B: 'a teszt pozitív' };
      var n = kit.el('<div>' + kit.slider('N', 'a sokaság mérete', 1000, 100000, 1000, 100000) + kit.slider('a', 'P(A) (%)', 0, 100, 1, 1) + kit.slider('ba', 'P(B | A) (%)', 0, 100, 1, 99) + kit.slider('bna', 'P(B | nem A) (%)', 0, 100, 1, 5) +
        '<div class="row" style="margin-top:8px"><span class="lab" style="width:100%">Tipikus érettségi helyzetek</span>' +
        '<button class="btn sm" type="button" data-preset="100000;1;99;5;a személy beteg;a teszt pozitív">szűrővizsgálat</button>' +
        '<button class="btn sm" type="button" data-preset="10000;60;2;5;a termék az 1. gépről való;a termék selejtes">selejtes termék két gépről</button>' +
        '<button class="btn sm" type="button" data-preset="2000;40;25;25;a diák lány;a diák szemüveges">független események</button></div>' +
        '<p class="dim o-names" style="margin:8px 0 0"></p>' +
        '<div class="sim-grid" style="margin-top:8px"><div class="o-tree"></div><div class="o-tab"></div></div>' +
        '<div class="out o-res" style="margin-top:8px"></div>' +
        '<p class="dim" style="font-size:12px;margin-top:8px">A követelmény emelt szinten a feltételes valószínűség fogalmának definiálását és alkalmazását kéri; a középszintű rész a független eseményeket tartalmazza. A „teljes valószínűség” és a „Bayes-tétel” elnevezés nem szerepel benne: itt a P(B) számítása a fa két ágának összege, a P(A|B) pedig a definíció alkalmazása.</p></div>');

      function render(v) {
        var N = Math.round(v.N), a = Math.round(v.a), ba = Math.round(v.ba), bna = Math.round(v.bna), c = M.valszamCond(N, a, ba, bna), f = qTex, d6 = function (q) { return MO.tnum(q.n / q.d, 6); }, t, steps, tab, nB = c.n11 + c.n21, nnB = c.n12 + c.n22;
        kit.$('.o-names', n).textContent = 'A: ' + names.A + '. B: ' + names.B + '.';
        kit.$('.o-tree', n).innerHTML = '<div class="lab">Valószínűségi fa</div>' + probTreeSvg(c, names.A, names.B);
        tab = '<div class="lab">Kontingencia-táblázat (' + MO.big(N) + ' fő)</div><div class="tblwrap"><table class="t"><thead><tr><th></th><th>B</th><th>nem B</th><th>összesen</th></tr></thead><tbody>' +
          '<tr><th>A</th><td>' + MO.big(c.n11) + '</td><td>' + MO.big(c.n12) + '</td><td>' + MO.big(c.nA) + '</td></tr>' +
          '<tr><th>nem A</th><td>' + MO.big(c.n21) + '</td><td>' + MO.big(c.n22) + '</td><td>' + MO.big(c.nnA) + '</td></tr>' +
          '<tr><th>összesen</th><td>' + MO.big(nB) + '</td><td>' + MO.big(nnB) + '</td><td>' + MO.big(N) + '</td></tr></tbody></table></div>' +
          '<p class="dim" style="font-size:12px">A darabszámokat egészre kerekítettük.</p>';
        kit.$('.o-tab', n).innerHTML = tab;
        steps = ['**Közös előfordulás:** $P(A\\cdot B) = P(A)\\cdot P(B|A) = ' + MO.tnum(a / 100, 2) + '\\cdot ' + MO.tnum(ba / 100, 2) + ' = ' + d6(c.pAB) + '$',
          '**P(B) a fa két B-ágából:** $P(B) = P(A)\\cdot P(B|A) + P(\\overline{A})\\cdot P(B|\\overline{A}) = ' + d6(c.pAB) + ' + ' + d6(c.pnAB) + ' = ' + d6(c.pB) + '$'];
        if (c.zero) steps.push('**Feltételes valószínűség:** $P(B) = 0$, ezért $P(A|B) = \\dfrac{P(A\\cdot B)}{P(B)}$ nem értelmezett (nullával osztás): ha B lehetetlen esemény, nincs mire feltételezni.');
        else steps.push('**Feltételes valószínűség:** $P(A|B) = \\dfrac{P(A\\cdot B)}{P(B)} = \\dfrac{' + d6(c.pAB) + '}{' + d6(c.pB) + '} = ' + f(c.pAgB) + '$. A táblázatból: $\\dfrac{' + MO.tbig(c.n11) + '}{' + MO.tbig(nB) + '}$.');
        steps.push('**Független-e?** $P(A)\\cdot P(B) = ' + d6(c.pApB) + '$, $P(A\\cdot B) = ' + d6(c.pAB) + '$. ' + (c.indep ? 'A két érték egyenlő, ezért **A és B független**' + ((a === 0 || a === 100) ? ' (ha P(A) = 0 vagy 1, ez mindig teljesül)' : ' (ilyenkor $P(B|A) = P(B|\\overline{A}) = P(B)$ is igaz)') + '.' : 'A két érték nem egyenlő, ezért **A és B nem független**.'));
        kit.$('.o-res', n).innerHTML = (c.zero ? '<p class="msg bad">P(B) = 0: a feltételes valószínűség nem értelmezett.</p>' : '') + kit.steps(steps);
      }
      kit.bindSliders(n, render);
      kit.$$('[data-preset]', n).forEach(function (bt) {
        kit.on(bt, 'click', function () {
          var s = bt.dataset.preset.split(';');
          names = { A: s[4], B: s[5] };
          setSlider(n, 'N', s[0]); setSlider(n, 'a', s[1]); setSlider(n, 'ba', s[2]); setSlider(n, 'bna', s[3]);
        });
      });
      return n;
    }
  });
})(typeof window !== 'undefined' ? window : globalThis);
