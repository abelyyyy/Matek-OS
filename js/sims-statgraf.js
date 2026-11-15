/* Statisztika és gráfok – szimulációk: statisztika (adatsor elemzése), venn (halmazok), grafok */
(function (root) {
  'use strict';
  var MO = root.MO = root.MO || {};
  var M = MO.models = MO.models || {};
  MO.simDefs = MO.simDefs || [];

  /* =====================  MODELLEK: statisztika  ===================== */
  function parseNum(t) {
    t = String(t).replace(/−/g, '-').replace(',', '.');
    return /^[-+]?(\d+(\.\d*)?|\.\d+)$/.test(t) ? parseFloat(t) : NaN;
  }
  /* Adatsor beolvasása. Elválasztó: szóköz vagy pontosvessző (a tizedesvessző miatt). freq = true: „érték:gyakoriság” párok. */
  M.statgrafParse = function (text, freq) {
    var s = String(text || '').replace(/\s*:\s*/g, ':').trim();
    if (!s) return { ok: false, err: 'Írj be legalább egy számot.' };
    var tok = s.split(/[;\s]+/).filter(function (t) { return t.length; }), xs = [], i, j;
    for (i = 0; i < tok.length; i++) {
      if (freq) {
        var p = tok[i].split(':'), v = parseNum(p[0]), f = p.length === 2 ? parseNum(p[1]) : NaN;
        if (p.length !== 2 || !isFinite(v) || !isFinite(f) || f < 1 || f !== Math.floor(f)) return { ok: false, err: 'Hibás tétel: „' + tok[i] + '”. Add meg így: érték:gyakoriság (a gyakoriság pozitív egész), a tételeket szóközzel válaszd el.' };
        if (f > 500) return { ok: false, err: 'Egy gyakoriság legfeljebb 500 lehet.' };
        for (j = 0; j < f; j++) xs.push(v);
      } else {
        var x = parseNum(tok[i]);
        if (!isFinite(x)) return { ok: false, err: 'Nem szám: „' + tok[i] + '”. A számokat szóközzel vagy pontosvesszővel válaszd el; tizedesvessző használható.' };
        xs.push(x);
      }
      if (xs.length > 500) return { ok: false, err: 'Legfeljebb 500 adatot tudok kezelni.' };
    }
    return { ok: true, xs: xs };
  };
  function medianSorted(a) {
    var n = a.length; if (!n) return NaN;
    return n % 2 ? a[(n - 1) / 2] : (a[n / 2 - 1] + a[n / 2]) / 2;
  }
  /* Kvartilisek: a mediánnal kettéosztott alsó és felső fél mediánja (páratlan n-nél a középső elemet kihagyva). */
  M.statgrafQuartiles = function (sorted) {
    var n = sorted.length;
    if (n === 1) return { q1: sorted[0], q2: sorted[0], q3: sorted[0], lower: [], upper: [] };
    var lower = sorted.slice(0, Math.floor(n / 2)), upper = sorted.slice(Math.ceil(n / 2));
    return { q1: medianSorted(lower), q2: medianSorted(sorted), q3: medianSorted(upper), lower: lower, upper: upper };
  };
  M.statgrafStats = function (xs) {
    var s = xs.slice().sort(function (a, b) { return a - b; }), n = s.length, i, sum = 0;
    if (!n) return null;
    for (i = 0; i < n; i++) sum += s[i];
    var mean = sum / n, med = medianSorted(s), freq = [], cnt = {};
    s.forEach(function (x) { cnt[x] = (cnt[x] || 0) + 1; });
    Object.keys(cnt).map(parseFloat).sort(function (a, b) { return a - b; }).forEach(function (v) { freq.push({ v: v, f: cnt[v] }); });
    var mf = Math.max.apply(null, freq.map(function (e) { return e.f; }));
    var modes = (mf === 1 && n > 1) ? [] : freq.filter(function (e) { return e.f === mf; }).map(function (e) { return e.v; });
    var ss = 0, ad = 0, am = 0;
    for (i = 0; i < n; i++) { ss += (s[i] - mean) * (s[i] - mean); ad += Math.abs(s[i] - mean); am += Math.abs(s[i] - med); }
    var q = M.statgrafQuartiles(s);
    return { sorted: s, n: n, sum: sum, mean: mean, median: med, freq: freq, modes: modes, maxFreq: mf, min: s[0], max: s[n - 1], range: s[n - 1] - s[0],
      madMean: ad / n, madMedian: am / n, ss: ss, variance: ss / n, sd: Math.sqrt(ss / n), q1: q.q1, q3: q.q3, iqr: q.q3 - q.q1, lower: q.lower, upper: q.upper };
  };
  /* Hisztogram: [a; a+w) félig nyílt osztályok, az első osztály kezdete w többszöröse. */
  M.statgrafHist = function (xs, w) {
    var mn = Math.min.apply(null, xs), mx = Math.max.apply(null, xs), start = Math.floor(mn / w + 1e-9) * w;
    var k = Math.floor((mx - start) / w + 1e-9) + 1, bins = [], i;
    for (i = 0; i < k; i++) bins.push({ a: start + i * w, b: start + (i + 1) * w, count: 0 });
    xs.forEach(function (x) { var j = Math.min(k - 1, Math.max(0, Math.floor((x - start) / w + 1e-9))); bins[j].count++; });
    return { start: start, w: w, bins: bins };
  };
  /* „Mi történik, ha…”: egy érték hozzáadása. */
  M.statgrafWith = function (xs, v) { return { before: M.statgrafStats(xs), after: M.statgrafStats(xs.concat([v])) }; };

  /* =====================  MODELLEK: halmazok / Venn  ===================== */
  /* A tartományokat bitmaszk azonosítja: 1 = A, 2 = B, 4 = C; a 0 az alaphalmaz-beli, egyik halmazban sincs tartomány. */
  M.statgrafVennRegions2 = function (a, b, ab, u) {
    var err = [], all = [a, b, ab, u];
    if (!all.every(function (x) { return isFinite(x) && x === Math.floor(x); })) return { ok: false, errors: ['Az elemszámok egész számok kell legyenek.'], r: null };
    if (all.some(function (x) { return x < 0; })) err.push('Az elemszám nem lehet negatív.');
    var oa = a - ab, ob = b - ab, out = u - (a + b - ab);
    if (ab > a) err.push('Ellentmondás: |A ∩ B| = ' + ab + ' nagyobb, mint |A| = ' + a + ', így a „csak A” tartomány negatív (' + oa + ') lenne.');
    if (ab > b) err.push('Ellentmondás: |A ∩ B| = ' + ab + ' nagyobb, mint |B| = ' + b + ', így a „csak B” tartomány negatív (' + ob + ') lenne.');
    if (out < 0 && ab <= a && ab <= b) err.push('Ellentmondás: |A ∪ B| = ' + (a + b - ab) + ' nagyobb, mint az alaphalmaz mérete (' + u + '), így a külső tartomány negatív (' + out + ') lenne.');
    var r = [out, oa, ob, ab, 0, 0, 0, 0];
    return { ok: err.length === 0, errors: err, r: r };
  };
  M.statgrafVennSum = function (r, pred) { var s = 0, m; for (m = 0; m < r.length; m++) if (pred(m)) s += r[m]; return s; };
  M.statgrafVennSets = function (r, n) {
    var S = M.statgrafVennSum, o = {};
    o.A = S(r, function (m) { return m & 1; }); o.B = S(r, function (m) { return m & 2; });
    o.AB = S(r, function (m) { return (m & 3) === 3; });
    o.union = S(r, function (m) { return m !== 0; }); o.total = S(r, function () { return true; });
    if (n === 3) {
      o.C = S(r, function (m) { return m & 4; }); o.AC = S(r, function (m) { return (m & 5) === 5; });
      o.BC = S(r, function (m) { return (m & 6) === 6; }); o.ABC = r[7];
    }
    return o;
  };
  /* Logikai szita: a képlettel kapott és a tartományokból közvetlenül összeadott |A ∪ B (∪ C)|. */
  M.statgrafVennSita = function (r, n) {
    var o = M.statgrafVennSets(r, n), sita = n === 3 ? o.A + o.B + o.C - o.AB - o.AC - o.BC + o.ABC : o.A + o.B - o.AB;
    return { sita: sita, direct: o.union, ok: sita === o.union, sets: o };
  };
  function pc(m) { return (m & 1) + ((m >> 1) & 1) + ((m >> 2) & 1); }
  M.statgrafVennOps = function (n) {
    if (n === 3) return [
      { id: 'u3', tex: 'A\\cup B\\cup C', test: function (m) { return m !== 0; } },
      { id: 'i3', tex: 'A\\cap B\\cap C', test: function (m) { return m === 7; } },
      { id: 'ab', tex: 'A\\cap B', test: function (m) { return (m & 3) === 3; } },
      { id: 'abc', tex: '(A\\cap B)\\setminus C', test: function (m) { return m === 3; } },
      { id: 'aBC', tex: 'A\\setminus(B\\cup C)', test: function (m) { return m === 1; } },
      { id: 'abuc', tex: '(A\\cup B)\\setminus C', test: function (m) { return m === 1 || m === 2 || m === 3; } },
      { id: 'abc2', tex: 'A\\cap(B\\cup C)', test: function (m) { return (m & 1) && (m & 6); } },
      { id: 'co3', tex: '\\overline{A\\cup B\\cup C}', test: function (m) { return m === 0; } },
      { id: 'one', tex: 'pontosan egy halmaz eleme', test: function (m) { return pc(m) === 1; } },
      { id: 'two', tex: 'pontosan két halmaz eleme', test: function (m) { return pc(m) === 2; } }
    ];
    return [
      { id: 'u', tex: 'A\\cup B', test: function (m) { return m !== 0; } },
      { id: 'i', tex: 'A\\cap B', test: function (m) { return m === 3; } },
      { id: 'amb', tex: 'A\\setminus B', test: function (m) { return m === 1; } },
      { id: 'bma', tex: 'B\\setminus A', test: function (m) { return m === 2; } },
      { id: 'ca', tex: '\\overline{A}', test: function (m) { return !(m & 1); } },
      { id: 'cb', tex: '\\overline{B}', test: function (m) { return !(m & 2); } },
      { id: 'cu', tex: '\\overline{A\\cup B}', test: function (m) { return m === 0; } },
      { id: 'ci', tex: '\\overline{A\\cap B}', test: function (m) { return m !== 3; } },
      { id: 'sd', tex: 'A\\triangle B', test: function (m) { return m === 1 || m === 2; } }
    ];
  };
  /* Rögzített geometria és a tartományok útvonalai körívekből. */
  M.statgrafVennGeom = function (n) {
    if (n === 3) return { W: 340, H: 270, circles: [{ x: 125, y: 100, r: 70 }, { x: 215, y: 100, r: 70 }, { x: 170, y: 178, r: 70 }] };
    return { W: 340, H: 220, circles: [{ x: 125, y: 110, r: 75 }, { x: 215, y: 110, r: 75 }] };
  };
  M.statgrafVennPaths = function (n) {
    var g = M.statgrafVennGeom(n), C = g.circles, pts = [], angs = C.map(function () { return []; }), i, j, EPS = 0.6;
    function maskOf(x, y) { var m = 0; C.forEach(function (c, k) { if ((x - c.x) * (x - c.x) + (y - c.y) * (y - c.y) < c.r * c.r) m |= 1 << k; }); return m; }
    for (i = 0; i < C.length; i++) for (j = i + 1; j < C.length; j++) {
      var c1 = C[i], c2 = C[j], dx = c2.x - c1.x, dy = c2.y - c1.y, d = Math.sqrt(dx * dx + dy * dy), a = (c1.r * c1.r - c2.r * c2.r + d * d) / (2 * d), h = Math.sqrt(c1.r * c1.r - a * a);
      var xm = c1.x + a * dx / d, ym = c1.y + a * dy / d;
      [{ x: xm + h * dy / d, y: ym - h * dx / d }, { x: xm - h * dy / d, y: ym + h * dx / d }].forEach(function (p) {
        pts.push(p);
        [i, j].forEach(function (k) { var th = Math.atan2(p.y - C[k].y, p.x - C[k].x); if (th < 0) th += 2 * Math.PI; angs[k].push({ th: th, p: p }); });
      });
    }
    var arcs = {}, nm = 1 << C.length, m;
    for (m = 0; m < nm; m++) arcs[m] = [];
    C.forEach(function (c, k) {
      var L = angs[k].sort(function (p, q) { return p.th - q.th; });
      L.forEach(function (f, idx) {
        var t = L[(idx + 1) % L.length], span = t.th - f.th; if (span <= 0) span += 2 * Math.PI;
        var mid = f.th + span / 2, large = span > Math.PI ? 1 : 0;
        var mi = maskOf(c.x + (c.r - EPS) * Math.cos(mid), c.y + (c.r - EPS) * Math.sin(mid)), mo = maskOf(c.x + (c.r + EPS) * Math.cos(mid), c.y + (c.r + EPS) * Math.sin(mid));
        arcs[mi].push({ s: f.p, e: t.p, r: c.r, large: large, sweep: 1 });
        arcs[mo].push({ s: t.p, e: f.p, r: c.r, large: large, sweep: 0 });
      });
    });
    function f1(x) { return (Math.round(x * 10) / 10).toString(); }
    var paths = {}, ok = true;
    for (m = 0; m < nm; m++) {
      var list = arcs[m].slice(), d = '';
      while (list.length) {
        var cur = list.shift(), start = cur.s;
        d += 'M' + f1(start.x) + ',' + f1(start.y);
        for (;;) {
          d += 'A' + cur.r + ',' + cur.r + ' 0 ' + cur.large + ' ' + cur.sweep + ' ' + f1(cur.e.x) + ',' + f1(cur.e.y);
          if (cur.e === start) break;
          var ix = -1; list.forEach(function (a2, q) { if (ix < 0 && a2.s === cur.e) ix = q; });
          if (ix < 0) { ok = false; break; }
          cur = list.splice(ix, 1)[0];
        }
        d += 'Z';
      }
      if (m === 0) d = 'M0,0H' + g.W + 'V' + g.H + 'H0Z' + d;
      paths[m] = d;
    }
    /* feliratok helye: a tartomány pontjai közül a súlyponthoz legközelebbi */
    var sx = {}, sy = {}, cn = {}, centers = {};
    for (var x = 4; x < g.W; x += 3) for (var y = 4; y < g.H; y += 3) { var mk = maskOf(x, y); sx[mk] = (sx[mk] || 0) + x; sy[mk] = (sy[mk] || 0) + y; cn[mk] = (cn[mk] || 0) + 1; }
    for (m = 1; m < nm; m++) {
      var cx = sx[m] / cn[m], cy = sy[m] / cn[m], best = null, bd = 1e9;
      for (x = 4; x < g.W; x += 3) for (y = 4; y < g.H; y += 3) if (maskOf(x, y) === m) { var dd = (x - cx) * (x - cx) + (y - cy) * (y - cy); if (dd < bd) { bd = dd; best = [x, y]; } }
      centers[m] = best;
    }
    centers[0] = [g.W - 22, g.H - 12];
    return { paths: paths, centers: centers, ok: ok, geom: g };
  };

  /* =====================  MODELLEK: gráfok  ===================== */
  function ek(i, j) { return i < j ? [i, j] : [j, i]; }
  M.statgrafGraphKey = function (i, j) { var e = ek(i, j); return e[0] + '-' + e[1]; };
  M.statgrafGraphToggle = function (edges, i, j) {
    if (i === j) return edges.slice();
    var k = M.statgrafGraphKey(i, j), has = edges.some(function (e) { return M.statgrafGraphKey(e[0], e[1]) === k; });
    return has ? edges.filter(function (e) { return M.statgrafGraphKey(e[0], e[1]) !== k; }) : edges.concat([ek(i, j)]);
  };
  M.statgrafGraphComplement = function (n, edges) {
    var have = {}, out = [], i, j;
    edges.forEach(function (e) { have[M.statgrafGraphKey(e[0], e[1])] = 1; });
    for (i = 0; i < n; i++) for (j = i + 1; j < n; j++) if (!have[i + '-' + j]) out.push([i, j]);
    return out;
  };
  M.statgrafGraphInfo = function (n, edges) {
    var deg = [], adj = [], i;
    for (i = 0; i < n; i++) { deg.push(0); adj.push([]); }
    edges.forEach(function (e) { deg[e[0]]++; deg[e[1]]++; adj[e[0]].push(e[1]); adj[e[1]].push(e[0]); });
    var comp = [], seen = [], c = 0;
    for (i = 0; i < n; i++) seen.push(-1);
    for (i = 0; i < n; i++) if (seen[i] < 0) { var st = [i]; seen[i] = c; while (st.length) { var v = st.pop(); adj[v].forEach(function (w) { if (seen[w] < 0) { seen[w] = c; st.push(w); } }); } c++; }
    /* körmentesség: egyesítés-kereséssel, a komponensek számától függetlenül */
    var par = []; for (i = 0; i < n; i++) par.push(i);
    function find(x) { while (par[x] !== x) { par[x] = par[par[x]]; x = par[x]; } return x; }
    var acyclic = true;
    edges.forEach(function (e) { var a = find(e[0]), b = find(e[1]); if (a === b) acyclic = false; else par[a] = b; });
    var odd = deg.filter(function (d) { return d % 2; }).length, connected = c === 1;
    var euler = connected && edges.length > 0 ? (odd === 0 ? 'kör' : odd === 2 ? 'út' : 'nincs') : 'nincs';
    var dup = false, sd = deg.slice().sort(function (a, b) { return a - b; }); for (i = 1; i < n; i++) if (sd[i] === sd[i - 1]) dup = true;
    var degSum = deg.reduce(function (a, b) { return a + b; }, 0);
    return { n: n, e: edges.length, deg: deg, degSum: degSum, components: c, connected: connected, acyclic: acyclic, tree: connected && acyclic,
      complete: edges.length === n * (n - 1) / 2, odd: odd, euler: euler, dupDeg: dup };
  };
  M.statgrafGraphPreset = function (kind, n) {
    var e = [], i, j;
    if (kind === 'teljes') { for (i = 0; i < n; i++) for (j = i + 1; j < n; j++) e.push([i, j]); }
    else if (kind === 'kor') { for (i = 0; i < n; i++) e.push(ek(i, (i + 1) % n)); if (n === 2) e = [[0, 1]]; }
    else if (kind === 'ut') { for (i = 0; i + 1 < n; i++) e.push([i, i + 1]); }
    else if (kind === 'csillag') { for (i = 1; i < n; i++) e.push([0, i]); }
    else if (kind === 'fa') { for (i = 1; i < n; i++) e.push([Math.floor((i - 1) / 2), i]); }
    return e;
  };
  M.statgrafGraphLayout = function (n, kind) {
    var out = [], i;
    for (i = 0; i < n; i++) {
      if (kind === 'csillag' && i === 0) { out.push([0, 0]); continue; }
      var k = kind === 'csillag' ? i - 1 : i, m = kind === 'csillag' ? n - 1 : n, th = Math.PI / 2 + 2 * Math.PI * k / m;
      out.push([Math.round(Math.cos(th) * 1000) / 1000, Math.round(Math.sin(th) * 1000) / 1000]);
    }
    return out;
  };

  /* =====================  segédek a megjelenítéshez  ===================== */
  function f1(x) { return String(Math.round(x * 10) / 10); }
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var t = a % b; a = b; b = t; } return a; }

  /* =====================  1. STATISZTIKA  ===================== */
  MO.simDefs.push({
    id: 'statisztika',
    title: 'Adatsor elemzése',
    desc: 'Írj be egy adatsort, és lépésenként megkapod az átlagot, mediánt, móduszt, szórást, kvartiliseket, diagramokkal; kiugró érték hatásával.',
    group: 'statisztika és gráfok',
    topic: 'valoszinuseg', sub: 'statisztika',
    formulas: ['v-atlag', 'v-median', 'v-modusz', 'v-terjedelem', 'v-kvartilis', 'v-szoras', 'v-atlagos-abszolut-elteres'],
    build: function (kit) {
      var T = kit.tnum;
      function ap(x, d) { var r = Math.round(x * Math.pow(10, d)) / Math.pow(10, d); return (Math.abs(x - r) < 1e-9 ? '=' : '\\approx') + ' ' + T(x, d); }
      var n = kit.el('<div>' +
        kit.select('mode', 'megadás módja', [['list', 'adatsor (számok felsorolása)'], ['freq', 'gyakorisági táblázat (érték:gyakoriság)']], 'list') +
        '<label class="f"><span>adatok</span><input type="text" data-t="txt" value="2 3 3 5 7" autocomplete="off" autocapitalize="off" spellcheck="false"></label>' +
        '<p class="dim" style="margin:0 0 10px">Az elválasztó szóköz vagy pontosvessző (a tizedesvessző miatt), pl. <span class="mono">2,5; 3; 3; 5</span>. Gyakorisági módban: <span class="mono">4:3 5:6 7:2</span>.</p>' +
        '<div class="row" style="margin-bottom:12px"><button class="btn sm" type="button" data-preset="list|2 3 3 5 7">páratlan elemszám</button>' +
        '<button class="btn sm" type="button" data-preset="list|1 2 2 4 4 7 9 10">páros elemszám, két módusz</button>' +
        '<button class="btn sm" type="button" data-preset="freq|1:3 2:5 3:6 4:4 5:2">gyakorisági táblázat</button>' +
        '<button class="btn sm" type="button" data-preset="list|4 5 5 6 6 7 8">kiugró érték vizsgálata</button></div>' +
        '<div class="out"></div>' +
        '<div class="row" style="margin-top:14px">' + kit.select('chart', 'ábra', [['bar', 'oszlopdiagram'], ['box', 'sodrófa (box-plot)'], ['pie', 'kördiagram'], ['hist', 'hisztogram']], 'bar') + '</div>' +
        '<div class="hw">' + kit.slider('w', 'osztályszélesség', 0.5, 10, 0.5, 2) + '</div>' +
        '<div class="fig-out"></div>' +
        '<div class="lab" style="margin-top:16px">mi történik, ha…</div>' +
        '<div class="row" style="align-items:flex-end"><label class="f" style="flex:1;min-width:120px"><span>kiugró érték</span><input type="text" data-t="out" value="100" autocomplete="off" autocapitalize="off"></label>' +
        '<button class="btn" type="button" data-act="out" aria-pressed="false">kiugró érték hozzáadása</button></div>' +
        '<div class="whatif" style="margin-top:10px"></div></div>');
      var st = { w: 2, add: false }, out = kit.$('.out', n), figOut = kit.$('.fig-out', n), wi = kit.$('.whatif', n);
      function txt() { return kit.$('[data-t="txt"]', n).value; }
      function mode() { return kit.$('[data-sel="mode"]', n).value; }
      function chart() { return kit.$('[data-sel="chart"]', n).value; }

      function svgBar(S) {
        if (S.freq.length > 20) return '<p class="msg bad">Ennyi különböző értéknél (' + S.freq.length + ') az oszlopdiagram áttekinthetetlen; válaszd a hisztogramot.</p>';
        var W = 340, H = 200, L = 30, B = 34, Tp = 22, k = S.freq.length, mx = S.maxFreq, aw = W - L - 8, bw = Math.min(40, aw / k * 0.7), s = '', i;
        var step = mx <= 6 ? 1 : mx <= 12 ? 2 : Math.ceil(mx / 6);
        for (i = 0; i <= mx; i += step) { var y = H - B - (H - B - Tp) * i / mx; s += '<line x1="' + L + '" x2="' + (W - 8) + '" y1="' + f1(y) + '" y2="' + f1(y) + '" stroke="var(--line)" stroke-width="0.6"/><text x="' + (L - 5) + '" y="' + f1(y + 3.5) + '" text-anchor="end" font-size="10" fill="var(--dim)">' + i + '</text>'; }
        S.freq.forEach(function (e, q) {
          var cx = L + aw * (q + 0.5) / k, h = (H - B - Tp) * e.f / mx;
          s += '<rect x="' + f1(cx - bw / 2) + '" y="' + f1(H - B - h) + '" width="' + f1(bw) + '" height="' + f1(h) + '" fill="var(--c1)" fill-opacity="0.75" stroke="var(--fg)" stroke-width="1"/>' +
            '<text x="' + f1(cx) + '" y="' + f1(H - B - h - 4) + '" text-anchor="middle" font-size="10" fill="var(--fg)">' + e.f + '</text>' +
            '<text x="' + f1(cx) + '" y="' + (H - B + 14) + '" text-anchor="middle" font-size="10" fill="var(--fg)">' + kit.num(e.v, 2) + '</text>';
        });
        return '<svg class="fig" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Oszlopdiagram: az értékek gyakorisága"><line x1="' + L + '" x2="' + (W - 8) + '" y1="' + (H - B) + '" y2="' + (H - B) + '" stroke="var(--fg)"/>' + s +
          '<text x="' + (W / 2) + '" y="' + (H - 4) + '" text-anchor="middle" font-size="10" fill="var(--dim)">érték (oszlop felett: gyakoriság)</text></svg>';
      }
      function svgBox(S) {
        var W = 340, H = 140, x0 = 20, x1 = 320, rg = S.max - S.min;
        function sx(x) { return rg === 0 ? 170 : x0 + (x - S.min) / rg * (x1 - x0); }
        var yb = 40, hb = 36, ym = yb + hb / 2, s = '';
        s += '<line x1="' + f1(sx(S.min)) + '" x2="' + f1(sx(S.q1)) + '" y1="' + ym + '" y2="' + ym + '" stroke="var(--fg)" stroke-width="1.5"/>' +
          '<line x1="' + f1(sx(S.q3)) + '" x2="' + f1(sx(S.max)) + '" y1="' + ym + '" y2="' + ym + '" stroke="var(--fg)" stroke-width="1.5"/>' +
          '<line x1="' + f1(sx(S.min)) + '" x2="' + f1(sx(S.min)) + '" y1="' + (ym - 9) + '" y2="' + (ym + 9) + '" stroke="var(--fg)" stroke-width="1.5"/>' +
          '<line x1="' + f1(sx(S.max)) + '" x2="' + f1(sx(S.max)) + '" y1="' + (ym - 9) + '" y2="' + (ym + 9) + '" stroke="var(--fg)" stroke-width="1.5"/>' +
          '<rect x="' + f1(sx(S.q1)) + '" y="' + yb + '" width="' + f1(Math.max(1, sx(S.q3) - sx(S.q1))) + '" height="' + hb + '" fill="var(--soft)" stroke="var(--fg)" stroke-width="1.5"/>' +
          '<line x1="' + f1(sx(S.median)) + '" x2="' + f1(sx(S.median)) + '" y1="' + yb + '" y2="' + (yb + hb) + '" stroke="var(--fg)" stroke-width="3"/>' +
          '<path d="M' + f1(sx(S.mean)) + ',' + (yb - 12) + 'l5,6l-5,6l-5,-6z" fill="var(--c1)" stroke="var(--fg)" stroke-width="1"/>';
        [[S.min, 'min'], [S.q1, 'Q1'], [S.median, 'me'], [S.q3, 'Q3'], [S.max, 'max']].forEach(function (e, i) {
          var y = 100 + (i % 2) * 14;
          s += '<line x1="' + f1(sx(e[0])) + '" x2="' + f1(sx(e[0])) + '" y1="' + (yb + hb + 2) + '" y2="' + (y - 11) + '" stroke="var(--line)" stroke-width="0.8"/><text x="' + f1(sx(e[0])) + '" y="' + y + '" text-anchor="middle" font-size="10" fill="var(--fg)">' + e[1] + ' = ' + kit.num(e[0], 2) + '</text>';
        });
        s += '<text x="' + (W - 4) + '" y="12" text-anchor="end" font-size="10" fill="var(--dim)">rombusz: átlag (' + kit.num(S.mean, 2) + ')</text>';
        return '<svg class="fig" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Sodrófa diagram">' + s + '</svg>';
      }
      function svgPie(S) {
        if (S.freq.length > 8) return '<p class="msg bad">Ennyi különböző értéknél (' + S.freq.length + ') a kördiagram nem szemléletes (legfeljebb 8 érték); válaszd a hisztogramot.</p>';
        var cx = 90, cy = 100, r = 78, a0 = -Math.PI / 2, s = '', lg = '';
        S.freq.forEach(function (e, q) {
          var fr = e.f / S.n, a1 = a0 + fr * 2 * Math.PI, fc = 'var(--c' + (q % 4 + 1) + ')', fo = q < 4 ? 0.85 : 0.5;
          if (S.freq.length === 1) s += '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="' + fc + '" fill-opacity="' + fo + '" stroke="var(--fg)"/>';
          else s += '<path d="M' + cx + ',' + cy + 'L' + f1(cx + r * Math.cos(a0)) + ',' + f1(cy + r * Math.sin(a0)) + 'A' + r + ',' + r + ' 0 ' + (a1 - a0 > Math.PI ? 1 : 0) + ' 1 ' + f1(cx + r * Math.cos(a1)) + ',' + f1(cy + r * Math.sin(a1)) + 'Z" fill="' + fc + '" fill-opacity="' + fo + '" stroke="var(--bg)" stroke-width="1.5"/>';
          if (fr > 0.07) { var am = (a0 + a1) / 2; s += '<text x="' + f1(cx + r * 0.62 * Math.cos(am)) + '" y="' + f1(cy + r * 0.62 * Math.sin(am) + 3.5) + '" text-anchor="middle" font-size="10" fill="var(--fg)" font-weight="700">' + kit.num(e.v, 2) + '</text>'; }
          lg += '<rect x="190" y="' + (22 + q * 20) + '" width="11" height="11" fill="' + fc + '" fill-opacity="' + fo + '" stroke="var(--fg)" stroke-width="0.8"/><text x="207" y="' + (31 + q * 20) + '" font-size="11" fill="var(--fg)">' + kit.num(e.v, 2) + ': ' + e.f + ' db (' + kit.num(fr * 100, 1) + '%)</text>';
          a0 = a1;
        });
        return '<svg class="fig" viewBox="0 0 340 200" role="img" aria-label="Kördiagram a gyakoriságokról">' + s + lg + '</svg>';
      }
      function svgHist(xs, w) {
        var h = M.statgrafHist(xs, w), k = h.bins.length;
        if (k > 40) return '<p class="msg bad">Ilyen kis osztályszélességnél ' + k + ' osztály lenne; növeld az osztályszélességet.</p>';
        var W = 340, H = 210, L = 30, B = 40, Tp = 22, mx = Math.max.apply(null, h.bins.map(function (b) { return b.count; })), aw = W - L - 10, bw = aw / k, s = '', i;
        var step = mx <= 6 ? 1 : mx <= 12 ? 2 : Math.ceil(mx / 6);
        for (i = 0; i <= mx; i += step) { var y = H - B - (H - B - Tp) * i / mx; s += '<line x1="' + L + '" x2="' + (W - 10) + '" y1="' + f1(y) + '" y2="' + f1(y) + '" stroke="var(--line)" stroke-width="0.6"/><text x="' + (L - 5) + '" y="' + f1(y + 3.5) + '" text-anchor="end" font-size="10" fill="var(--dim)">' + i + '</text>'; }
        var every = k > 20 ? 4 : k > 10 ? 2 : 1;
        h.bins.forEach(function (b, q) {
          var x = L + q * bw, hh = (H - B - Tp) * b.count / mx;
          s += '<rect x="' + f1(x) + '" y="' + f1(H - B - hh) + '" width="' + f1(bw) + '" height="' + f1(hh) + '" fill="var(--c1)" fill-opacity="0.7" stroke="var(--fg)" stroke-width="1"/>';
          if (b.count) s += '<text x="' + f1(x + bw / 2) + '" y="' + f1(H - B - hh - 4) + '" text-anchor="middle" font-size="10" fill="var(--fg)">' + b.count + '</text>';
          if (q % every === 0) s += '<text x="' + f1(x) + '" y="' + (H - B + 13) + '" text-anchor="middle" font-size="9" fill="var(--fg)">' + kit.num(b.a, 2) + '</text>';
        });
        s += '<text x="' + f1(L + k * bw) + '" y="' + (H - B + 13) + '" text-anchor="middle" font-size="9" fill="var(--fg)">' + kit.num(h.bins[k - 1].b, 2) + '</text>';
        return '<svg class="fig" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Hisztogram"><line x1="' + L + '" x2="' + (W - 10) + '" y1="' + (H - B) + '" y2="' + (H - B) + '" stroke="var(--fg)"/>' + s +
          '<text x="' + (W / 2) + '" y="' + (H - 6) + '" text-anchor="middle" font-size="10" fill="var(--dim)">osztályok: [a; b), szélesség ' + kit.num(w, 2) + '</text></svg>';
      }

      function render() {
        var fm = mode() === 'freq', P = M.statgrafParse(txt(), fm);
        kit.$('.hw', n).style.display = chart() === 'hist' ? '' : 'none';
        if (!P.ok) { out.innerHTML = '<p class="msg bad">' + kit.esc(P.err) + '</p>'; figOut.innerHTML = ''; wi.innerHTML = ''; return; }
        var S = M.statgrafStats(P.xs), i, cells = '', shown = S.sorted.slice(0, 40), midLo = Math.floor((S.n - 1) / 2), midHi = Math.floor(S.n / 2);
        shown.forEach(function (x, q) { cells += '<span' + (q === midLo || q === midHi ? ' class="on"' : '') + '>' + kit.num(x, 4) + '</span>'; });
        var steps = [], nn = S.n;
        var sorted = '<div class="lab" style="margin-top:10px">rendezett minta (a kiemelt elem(ek) a középső)</div><div class="cells" style="margin:6px 0 10px">' + cells + (S.n > 40 ? '<span class="off">…</span>' : '') + '</div>';
        steps.push('**Elemszám:** $n=' + nn + '$.');
        steps.push('**Átlag:** $\\bar x=\\dfrac{\\sum x_i}{n}=\\dfrac{' + T(S.sum, 4) + '}{' + nn + '}' + ap(S.mean, 3) + '$.');
        steps.push(nn % 2 ? '**Medián:** $n=' + nn + '$ páratlan, ezért a rendezett minta középső, $' + ((nn + 1) / 2) + '.$ eleme: $m_e=' + T(S.median, 4) + '$.'
          : '**Medián:** $n=' + nn + '$ páros, ezért a két középső elem ($' + (nn / 2) + '.$ és $' + (nn / 2 + 1) + '.$: $' + T(S.sorted[nn / 2 - 1], 4) + '$ és $' + T(S.sorted[nn / 2], 4) + '$) átlaga: $m_e=' + T(S.median, 4) + '$.');
        steps.push(S.modes.length === 0 && nn > 1 ? '**Módusz:** minden érték pontosan egyszer szerepel, ezért nincs módusz.' : '**Módusz** (leggyakoribb érték, gyakorisága ' + S.maxFreq + '): $' + S.modes.map(function (x) { return T(x, 4); }).join(';\\ ') + '$' + (S.modes.length > 1 ? ' (több módusz van).' : '.'));
        steps.push('**Terjedelem:** $F-A=' + T(S.max, 4) + '-' + T(S.min, 4) + '=' + T(S.range, 4) + '$.');
        steps.push('**Átlagos abszolút eltérés** az átlagtól: $\\dfrac{\\sum|x_i-\\bar x|}{n}' + ap(S.madMean, 3) + '$. (A függvénytáblázat középeltérése a mediántól mért: $\\dfrac{\\sum|x_i-m_e|}{n}' + ap(S.madMedian, 3) + '$.)');
        steps.push('**Szórás** (n-nel osztva): $s=\\sqrt{\\dfrac{\\sum(x_i-\\bar x)^2}{n}}=\\sqrt{\\dfrac{' + T(S.ss, 4) + '}{' + nn + '}}=\\sqrt{' + T(S.variance, 4) + '}' + ap(S.sd, 3) + '$.');
        steps.push('**Kvartilisek:** alsó kvartilis (az alsó fél mediánja): $Q_1=' + T(S.q1, 4) + '$; felső kvartilis (a felső fél mediánja): $Q_3=' + T(S.q3, 4) + '$; különbségük $Q_3-Q_1=' + T(S.iqr, 4) + '$.');
        out.innerHTML = '<div class="ans"><div class="row" style="gap:6px 18px"><span>n = ' + kit.num(nn, 0) + '</span><span>átlag ' + kit.num(S.mean, 3) + '</span><span>medián ' + kit.num(S.median, 3) + '</span><span>szórás ' + kit.num(S.sd, 3) + '</span></div></div>' + sorted + kit.steps(steps) +
          '<p class="dim" style="margin-top:8px">Kvartilis-szabály: a mediánnal kettéosztjuk a rendezett mintát; $Q_1$ az alsó, $Q_3$ a felső fél mediánja, páratlan elemszámnál a középső (a mediánnal azonos) elemet kihagyva. A forrásaink nem rögzítik egyértelműen a módszert, ezért ez egy szokásos megállapodás; más szabályok kissé eltérő értéket adhatnak.</p>'.replace(/\$([^$]+)\$/g, function (a, b) { return kit.tex(b); });
        var c = chart();
        figOut.innerHTML = c === 'bar' ? svgBar(S) : c === 'box' ? svgBox(S) : c === 'pie' ? svgPie(S) : svgHist(S.sorted, st.w);
        renderWhat(P.xs, S);
      }
      function renderWhat(xs, S) {
        var b = kit.$('[data-act="out"]', n);
        b.setAttribute('aria-pressed', st.add ? 'true' : 'false'); b.textContent = st.add ? 'kiugró érték visszavétele' : 'kiugró érték hozzáadása';
        if (!st.add) { wi.innerHTML = '<p class="dim">Nyomd meg a gombot: hozzáadjuk a kiugró értéket, és megnézzük, mennyit változik az átlag és a medián.</p>'; return; }
        var v = parseNum(kit.$('[data-t="out"]', n).value);
        if (!isFinite(v)) { wi.innerHTML = '<p class="msg bad">A kiugró érték nem szám.</p>'; return; }
        var R = M.statgrafWith(xs, v), a = R.before, d = R.after;
        function rel(x, y) { return x === 0 ? '' : ' (' + (y >= x ? '+' : '−') + kit.num(Math.abs((y - x) / x) * 100, 1) + '%)'; }
        wi.innerHTML = '<div class="tblwrap"><table class="t"><tr><th></th><th>előtte</th><th>utána</th><th>változás</th></tr>' +
          '<tr><td>elemszám</td><td>' + a.n + '</td><td>' + d.n + '</td><td>+1</td></tr>' +
          '<tr><td>átlag</td><td>' + kit.num(a.mean, 3) + '</td><td>' + kit.num(d.mean, 3) + '</td><td>' + kit.num(d.mean - a.mean, 3) + rel(a.mean, d.mean) + '</td></tr>' +
          '<tr><td>medián</td><td>' + kit.num(a.median, 3) + '</td><td>' + kit.num(d.median, 3) + '</td><td>' + kit.num(d.median - a.median, 3) + rel(a.median, d.median) + '</td></tr>' +
          '<tr><td>szórás</td><td>' + kit.num(a.sd, 3) + '</td><td>' + kit.num(d.sd, 3) + '</td><td>' + kit.num(d.sd - a.sd, 3) + '</td></tr></table></div>' +
          kit.steps(['A hozzáadott érték: $' + T(v, 4) + '$; az új átlag $\\dfrac{' + T(a.sum, 4) + '+' + T(v, 4) + '}{' + d.n + '}' + ap(d.mean, 3) + '$, azaz az átlag $\\dfrac{v-\\bar x}{n+1}' + ap((v - a.mean) / (a.n + 1), 3) + '$-mal változott.',
            'A medián csak a rendezett sorrendben szomszédos elemek között lép egyet: az új medián $' + T(d.median, 4) + '$. A kiugró érték nagysága nem számít, csak az, hogy a minta melyik végére kerül.',
            'Következtetés: kiugró értékek mellett a medián (és a kvartilis) „robusztusabb”, az átlag és a szórás érzékeny rájuk.']);
      }
      kit.on(kit.$('[data-t="txt"]', n), 'input', render);
      kit.on(kit.$('[data-t="out"]', n), 'input', function () { if (st.add) render(); });
      kit.on(kit.$('[data-sel="mode"]', n), 'change', render);
      kit.on(kit.$('[data-sel="chart"]', n), 'change', render);
      kit.on(kit.$('[data-act="out"]', n), 'click', function () { st.add = !st.add; render(); });
      kit.$$('[data-preset]', n).forEach(function (b) { kit.on(b, 'click', function () {
        var p = b.dataset.preset.split('|'); kit.$('[data-sel="mode"]', n).value = p[0]; kit.$('[data-t="txt"]', n).value = p[1];
        kit.$('[data-t="out"]', n).value = p[1] === '4 5 5 6 6 7 8' ? '60' : '100';
        if (p[1] === '4 5 5 6 6 7 8') st.add = true;
        render();
      }); });
      kit.bindSliders(n, function (v) { st.w = v.w; render(); });
      return n;
    }
  });

  /* =====================  2. VENN  ===================== */
  MO.simDefs.push({
    id: 'venn',
    title: 'Venn-diagram és logikai szita',
    desc: 'Két és három halmaz tartományai, műveletek kiemelése, a logikai szita ellenőrzése, szöveges feladat és valószínűség.',
    group: 'statisztika és gráfok',
    topic: 'gondolkodas', sub: 'halmazok',
    formulas: ['g-szita-2', 'g-szita-3', 'g-halmaz-komplementer', 'g-halmaz-kulonbseg', 'g-halmaz-demorgan'],
    build: function (kit) {
      var T = kit.tnum;
      var NAMES = { 1: 'csak A', 2: 'csak B', 3: 'A ∩ B', 0: 'kívül', 4: 'csak C' };
      var R2 = [[1, 'csak A'], [2, 'csak B'], [3, 'A ∩ B (mindkettő)'], [0, 'egyikben sem']];
      var R3 = [[1, 'csak A'], [2, 'csak B'], [4, 'csak C'], [3, 'csak A ∩ B'], [5, 'csak A ∩ C'], [6, 'csak B ∩ C'], [7, 'A ∩ B ∩ C'], [0, 'egyikben sem']];
      var rowsHtml = '';
      R3.forEach(function (e) {
        rowsHtml += '<div class="row rg" data-m="' + e[0] + '" style="align-items:flex-end;flex-wrap:nowrap"><div style="flex:1;min-width:0">' + kit.slider('r' + e[0], e[1], 0, 60, 1, 0) + '</div><label class="f" style="width:74px;flex:none"><span>darab</span><input type="text" inputmode="numeric" data-rn="' + e[0] + '" value="0" autocomplete="off"></label></div>';
      });
      var n = kit.el('<div>' +
        kit.select('mode', 'mit adsz meg', [['2', 'két halmaz: a tartományok elemszáma'], ['3', 'három halmaz: a tartományok elemszáma'], ['t', 'szöveges feladat: |A|, |B|, |A ∩ B|, |U|']], '2') +
        '<div class="regs">' + rowsHtml + '</div>' +
        '<div class="txtin"><div class="row">' + kit.numIn('a', '|A|', '18') + kit.numIn('b', '|B|', '15') + kit.numIn('ab', '|A ∩ B|', '7') + kit.numIn('u', '|U| (alaphalmaz)', '30') + '</div></div>' +
        '<div class="row" style="margin:10px 0"><button class="btn sm" type="button" data-preset="2:12,8,5,5">két halmaz</button><button class="btn sm" type="button" data-preset="3:10,8,6,4,3,2,1,7">három halmaz</button>' +
        '<button class="btn sm" type="button" data-preset="t:18,15,7,30">szöveges feladat</button><button class="btn sm" type="button" data-preset="t:10,12,11,20">ellentmondó adatok</button><button class="btn sm" type="button" data-preset="e:18,15,7,30">valószínűség (események)</button></div>' +
        '<div class="row" style="margin-bottom:8px"><button class="btn sm" type="button" data-act="ev" aria-pressed="false">események: valószínűség</button></div>' +
        '<div class="lab">művelet kiválasztása</div><div class="ops row" style="margin:6px 0 10px"></div>' +
        '<div class="fig-out"></div><div class="out"></div></div>');
      var st = { mode: '2', op: 'u', ev: false, r: [0, 12, 8, 5, 0, 0, 0, 0], sv: [0, 0, 0, 0, 0, 0, 0, 0] };
      st.r = [5, 12, 8, 5, 0, 0, 0, 0];
      var figOut = kit.$('.fig-out', n), out = kit.$('.out', n), opsBox = kit.$('.ops', n);
      function nsets() { return st.mode === '3' ? 3 : 2; }

      function frac(k, d) { var g = gcd(k, d) || 1, a = k / g, b = d / g; return b === 1 ? String(a) : '\\dfrac{' + a + '}{' + b + '}'; }
      function syncFields() {
        kit.$$('[data-rn]', n).forEach(function (f) { var m = +f.dataset.rn; if (document.activeElement !== f) f.value = st.r[m]; });
      }
      function layout() {
        var k = nsets(), t = st.mode === 't';
        kit.$$('.rg', n).forEach(function (row) { var m = +row.dataset.m; var show = !t && (k === 3 || m <= 3); row.style.display = show ? '' : 'none'; });
        kit.$('.txtin', n).style.display = t ? '' : 'none';
        var ops = M.statgrafVennOps(k);
        if (!ops.some(function (o) { return o.id === st.op; })) st.op = ops[0].id;
        opsBox.innerHTML = ops.map(function (o) { return '<button class="btn sm" type="button" data-op="' + o.id + '" aria-pressed="' + (o.id === st.op ? 'true' : 'false') + '" aria-label="' + kit.esc(o.tex.replace(/\\/g, ' ')) + '">' + kit.tex(o.id === 'one' || o.id === 'two' ? '\\text{' + o.tex + '}' : o.tex) + '</button>'; }).join('');
      }
      function drawSvg(r, sel, ok) {
        var k = nsets(), G = M.statgrafVennPaths(k), g = G.geom, s = '', m, nm = 1 << k;
        for (m = 0; m < nm; m++) {
          var on = ok && sel(m);
          s += '<path d="' + G.paths[m] + '" fill-rule="evenodd" fill="' + (on ? 'var(--c1)' : 'var(--soft)') + '" fill-opacity="' + (on ? '0.55' : '0.6') + '" stroke="none"/>';
        }
        g.circles.forEach(function (c, i) { s += '<circle cx="' + c.x + '" cy="' + c.y + '" r="' + c.r + '" fill="none" stroke="var(--fg)" stroke-width="1.8"/>'; });
        s += '<rect x="1" y="1" width="' + (g.W - 2) + '" height="' + (g.H - 2) + '" fill="none" stroke="var(--line)" stroke-width="1.2"/>';
        var nl = ['A', 'B', 'C'];
        g.circles.forEach(function (c, i) {
          var lx = i === 0 ? c.x - c.r * 0.85 : i === 1 ? c.x + c.r * 0.85 : c.x + c.r * 0.9, ly = i === 2 ? c.y + c.r * 0.9 : c.y - c.r * 0.95;
          s += '<text x="' + f1(lx) + '" y="' + f1(ly) + '" text-anchor="middle" font-size="15" font-weight="700" fill="var(--fg)">' + nl[i] + '</text>';
        });
        for (m = 0; m < nm; m++) { var c2 = G.centers[m]; if (!c2) continue; s += '<text x="' + c2[0] + '" y="' + (c2[1] + 4) + '" text-anchor="middle" font-size="14" fill="var(--fg)">' + (ok ? r[m] : '?') + '</text>'; }
        s += '<text x="10" y="' + (g.H - 8) + '" font-size="11" fill="var(--dim)">U</text>';
        return '<svg class="fig" viewBox="0 0 ' + g.W + ' ' + g.H + '" role="img" aria-label="Venn-diagram: a kiválasztott művelet tartománya kiemelve">' + s + '</svg>';
      }
      function render() {
        layout(); syncFields();
        var k = nsets(), r, steps = [], msg = '', ok = true;
        if (st.mode === 't') {
          var v = kit.readNums(kit.$('.txtin', n));
          if (!v) { figOut.innerHTML = ''; out.innerHTML = '<p class="msg bad">Minden mezőbe számot írj.</p>'; return; }
          var P = M.statgrafVennRegions2(v.a, v.b, v.ab, v.u);
          r = P.r || [0, 0, 0, 0, 0, 0, 0, 0];
          if (!P.ok) {
            ok = false;
            figOut.innerHTML = drawSvg(r, function () { return false; }, false);
            out.innerHTML = P.errors.map(function (e) { return '<p class="msg bad">' + kit.esc(e) + '</p>'; }).join('') + '<p class="dim">Ilyen adatokkal nem létezik megfelelő halmazrendszer; ellenőrizd a megadott számokat.</p>';
            return;
          }
          steps.push('A kétszer számolt közös rész levonásával: csak A: $|A|-|A\\cap B|=' + T(v.a) + '-' + T(v.ab) + '=' + T(r[1]) + '$.');
          steps.push('Csak B: $|B|-|A\\cap B|=' + T(v.b) + '-' + T(v.ab) + '=' + T(r[2]) + '$.');
          steps.push('Az unió a szitaformulával: $|A\\cup B|=' + T(v.a) + '+' + T(v.b) + '-' + T(v.ab) + '=' + T(v.a + v.b - v.ab) + '$.');
          steps.push('Egyikben sem: $|U|-|A\\cup B|=' + T(v.u) + '-' + T(v.a + v.b - v.ab) + '=' + T(r[0]) + '$.');
        } else {
          r = st.r.slice(); if (k === 2) { r[4] = r[5] = r[6] = r[7] = 0; }
        }
        var ops = M.statgrafVennOps(k), op = ops.filter(function (o) { return o.id === st.op; })[0];
        figOut.innerHTML = drawSvg(r, op.test, true);
        var Sd = M.statgrafVennSita(r, k), o = Sd.sets, total = o.total;
        var parts = [], cnt = 0, m;
        for (m = 0; m < (1 << k); m++) if (op.test(m)) { parts.push((m === 0 ? 'kívül' : NAMES[m] || ((m & 1 ? 'A' : '') + (m & 2 ? 'B' : '') + (m & 4 ? 'C' : ''))) + ' (' + r[m] + ')'); cnt += r[m]; }
        var opTex = op.id === 'one' || op.id === 'two' ? '\\text{' + op.tex + '}' : '\\left|' + op.tex + '\\right|';
        var ans = '<div class="ans">' + kit.tex(opTex + '=' + cnt) + '<div class="dim" style="margin-top:4px">a kiemelt tartományok összege: ' + kit.esc(parts.join(' + ')) + '</div>';
        if (st.ev) ans += total > 0 ? '<div style="margin-top:6px">' + kit.tex('P=\\dfrac{' + cnt + '}{' + total + '}' + (gcd(cnt, total) > 1 && cnt > 0 ? '=' + frac(cnt, total) : '') + (Math.abs(cnt / total - Math.round(cnt / total * 10000) / 10000) < 1e-12 ? '=' + T(cnt / total, 4) : '\\approx ' + T(cnt / total, 4))) + '</div>' : '<div class="dim" style="margin-top:6px">Az alaphalmaz üres, valószínűség nem értelmezhető.</div>';
        ans += '</div>';
        var sz;
        if (k === 2) sz = kit.steps(['**Logikai szita két halmazra:** $|A\\cup B|=|A|+|B|-|A\\cap B|$.',
          'Behelyettesítve: $' + T(o.A) + '+' + T(o.B) + '-' + T(o.AB) + '=' + T(Sd.sita) + '$.',
          'Ellenőrzés a tartományok összegével: $' + r[1] + '+' + r[2] + '+' + r[3] + '=' + Sd.direct + '$' + (Sd.ok ? ' – megegyezik.' : ' – eltér!')]);
        else sz = kit.steps(['**Logikai szita három halmazra:** $|A\\cup B\\cup C|=|A|+|B|+|C|-|A\\cap B|-|A\\cap C|-|B\\cap C|+|A\\cap B\\cap C|$.',
          'Behelyettesítve: $' + [T(o.A), T(o.B), T(o.C)].join('+') + '-' + T(o.AB) + '-' + T(o.AC) + '-' + T(o.BC) + '+' + T(o.ABC) + '=' + T(Sd.sita) + '$. (A kétszeres és háromszoros metszetek nem „csak” tartományok: pl. $|A\\cap B|=' + T(o.AB) + '$ a ' + r[3] + ' + ' + r[7] + ' elemű tartományokból áll.)',
          'Ellenőrzés a hét tartomány összegével: $' + Sd.direct + '$ ' + (Sd.ok ? '– megegyezik.' : '– eltér!')]);
        var evx = '';
        if (st.ev && total > 0) {
          evx = '<div class="lab" style="margin-top:12px">valószínűségek (klasszikus modell: elemszámok aránya)</div>' + kit.steps([
            'Az alaphalmaz mérete $|U|=' + total + '$, ezért $P(A)=\\dfrac{' + o.A + '}{' + total + '}$, $P(B)=\\dfrac{' + o.B + '}{' + total + '}$' + (k === 3 ? ', $P(C)=\\dfrac{' + o.C + '}{' + total + '}$' : '') + '.',
            'A szita valószínűségekre: $P(A\\cup B)=P(A)+P(B)-P(A\\cap B)=\\dfrac{' + o.A + '+' + o.B + '-' + o.AB + '}{' + total + '}=\\dfrac{' + (o.A + o.B - o.AB) + '}{' + total + '}$ (két halmazra).',
            'A komplementer esemény: $P(\\overline{A\\cup B})=1-P(A\\cup B)=\\dfrac{' + (total - (o.A + o.B - o.AB)) + '}{' + total + '}$.']);
        }
        var txt = steps.length ? '<div class="lab" style="margin-top:12px">a hiányzó tartományok kiszámítása</div>' + kit.steps(steps) : '';
        out.innerHTML = ans + txt + '<div class="lab" style="margin-top:12px">logikai szita</div>' + sz + evx;
      }
      function setRegionVals(masks, vals) {
        masks.forEach(function (m, i) { st.r[m] = vals[i]; var sl = kit.$('[data-in="r' + m + '"]', n); sl.value = Math.min(60, vals[i]); st.sv[m] = parseFloat(sl.value); var lab = kit.$('[data-out="r' + m + '"]', n); if (lab) lab.textContent = String(sl.value); });
      }
      kit.on(kit.$('[data-sel="mode"]', n), 'change', function () { st.mode = this.value; render(); });
      kit.on(opsBox, 'click', function (e) { var b = e.target.closest ? e.target.closest('[data-op]') : null; if (b) { st.op = b.dataset.op; render(); } });
      kit.on(kit.$('.txtin', n), 'input', render);
      kit.$$('[data-rn]', n).forEach(function (f) { kit.on(f, 'input', function () {
        var m = +f.dataset.rn, v = parseInt(f.value, 10); if (!isFinite(v) || v < 0) v = 0; if (v > 999) v = 999;
        st.r[m] = v; var sl = kit.$('[data-in="r' + m + '"]', n); sl.value = Math.min(60, v); st.sv[m] = parseFloat(sl.value); var lab = kit.$('[data-out="r' + m + '"]', n); if (lab) lab.textContent = String(sl.value);
        render();
      }); });
      kit.on(kit.$('[data-act="ev"]', n), 'click', function () { st.ev = !st.ev; this.setAttribute('aria-pressed', st.ev ? 'true' : 'false'); render(); });
      kit.$$('[data-preset]', n).forEach(function (b) { kit.on(b, 'click', function () {
        var p = b.dataset.preset.split(':'), v = p[1].split(',').map(Number), md = p[0];
        if (md === '2') { st.mode = '2'; setRegionVals([1, 2, 3, 0], v); }
        else if (md === '3') { st.mode = '3'; setRegionVals([1, 2, 4, 3, 5, 6, 7, 0], v); }
        else { st.mode = 't'; ['a', 'b', 'ab', 'u'].forEach(function (key, i) { kit.$('[data-n="' + key + '"]', n).value = v[i]; }); if (md === 'e') { st.ev = true; kit.$('[data-act="ev"]', n).setAttribute('aria-pressed', 'true'); } }
        kit.$('[data-sel="mode"]', n).value = st.mode; render();
      }); });
      setRegionVals([0, 1, 2, 3, 4, 5, 6, 7], st.r);
      kit.bindSliders(n, function (v) {
        [0, 1, 2, 3, 4, 5, 6, 7].forEach(function (m) { var x = v['r' + m]; if (x !== st.sv[m]) { st.sv[m] = x; st.r[m] = x; } });
        render();
      });
      return n;
    }
  });

  /* =====================  3. GRÁFOK  ===================== */
  MO.simDefs.push({
    id: 'grafok',
    title: 'Gráfok: fokszám, fa, Euler-vonal',
    desc: 'Húzható csúcsok, élek be- és kikapcsolása szomszédsági táblázattal; fokszámok, összefüggőség, fa, teljes gráf, komplementer, Euler-vonal.',
    group: 'statisztika és gráfok',
    topic: 'gondolkodas', sub: 'grafok',
    formulas: ['g-fokszamosszeg', 'g-teljes-graf', 'g-fa'],
    build: function (kit) {
      var T = kit.tnum;
      var n = kit.el('<div>' + kit.slider('n', 'csúcsok száma', 3, 9, 1, 5) +
        '<div class="row" style="margin:8px 0"><button class="btn sm" type="button" data-preset="teljes">teljes gráf</button><button class="btn sm" type="button" data-preset="kor">kör</button><button class="btn sm" type="button" data-preset="ut">út</button><button class="btn sm" type="button" data-preset="csillag">csillag</button><button class="btn sm" type="button" data-preset="fa">fa</button><button class="btn sm" type="button" data-preset="kezfogas">kézfogások (6 ember)</button></div>' +
        kit.plotBox(300) +
        '<p class="dim" style="margin:6px 0">Húzd a csúcsokat. Élt a szomszédsági táblázat celláira kattintva adhatsz hozzá vagy törölhetsz (1: van él, 0: nincs).</p>' +
        '<div class="tblwrap adj"></div>' +
        '<div class="row" style="margin:10px 0"><button class="btn sm" type="button" data-act="comp" aria-pressed="false">komplementer gráf megjelenítése</button><button class="btn sm" type="button" data-act="clear">összes él törlése</button></div>' +
        '<div class="out"></div></div>');
      var st = { n: 5, edges: M.statgrafGraphPreset('kor', 5), pos: M.statgrafGraphLayout(5), comp: false, note: '' }, p = null, out = kit.$('.out', n), adj = kit.$('.adj', n);

      function drawPlot() {
        if (!p) return;
        var segs = [], i;
        if (st.comp) M.statgrafGraphComplement(st.n, st.edges).forEach(function (e) { segs.push({ a: st.pos[e[0]], b: st.pos[e[1]], dash: [5, 4], dim: true, w: 1.5 }); });
        st.edges.forEach(function (e) { segs.push({ a: st.pos[e[0]], b: st.pos[e[1]], w: 2.2 }); });
        var pts = st.pos.map(function (q, k) { return { x: q[0], y: q[1], label: String(k + 1), drag: true, id: k }; });
        p.set({ segments: segs, points: pts, onDrag: onDrag });
      }
      function onDrag(pt, x, y) {
        var k = pt && pt.id !== undefined ? pt.id : -1; if (k < 0 || k >= st.n) return;
        st.pos[k] = [x, y]; drawPlot();
      }
      function tableHtml() {
        var N = st.n, i, j, has = {}, h = '<table class="t" style="text-align:center"><tr><th></th>';
        st.edges.forEach(function (e) { has[e[0] + '-' + e[1]] = 1; });
        for (j = 0; j < N; j++) h += '<th>' + (j + 1) + '</th>';
        h += '</tr>';
        for (i = 0; i < N; i++) {
          h += '<tr><th>' + (i + 1) + '</th>';
          for (j = 0; j < N; j++) {
            if (j <= i) h += '<td class="dim">' + (i === j ? '–' : '') + '</td>';
            else { var on = has[i + '-' + j]; h += '<td style="padding:2px"><button class="btn sm" type="button" data-e="' + i + ',' + j + '" aria-pressed="' + (on ? 'true' : 'false') + '" aria-label="él a ' + (i + 1) + '. és ' + (j + 1) + '. csúcs között: ' + (on ? 'van' : 'nincs') + '" style="min-width:40px;min-height:40px;padding:0">' + (on ? 1 : 0) + '</button></td>'; }
          }
          h += '</tr>';
        }
        return h + '</table>';
      }
      function yesno(b) { return b ? 'igen' : 'nem'; }
      function render() {
        adj.innerHTML = tableHtml();
        drawPlot();
        var N = st.n, I = M.statgrafGraphInfo(N, st.edges), maxE = N * (N - 1) / 2, steps = [];
        var degTxt = I.deg.map(function (d, k) { return '$d(' + (k + 1) + ')=' + d + '$'; }).join(', ');
        var h = '';
        if (st.note) h += '<div class="msg ok">' + st.note + '</div>';
        h += '<div class="ans"><div class="row" style="gap:6px 18px"><span>csúcsok: ' + N + '</span><span>élek: ' + I.e + '</span><span>fokszámösszeg: ' + I.degSum + '</span></div></div>';
        steps.push('Csúcsok száma $n=' + N + '$, élek száma $e=' + I.e + '$.');
        steps.push('Fokszámok: ' + degTxt + '. Ezek összege $' + (I.deg.length ? I.deg.join('+') : '0') + '=' + I.degSum + '$, és valóban $2e=2\\cdot' + I.e + '=' + 2 * I.e + '$ (minden él két csúcs fokszámához számít).');
        steps.push(I.connected ? 'A gráf **összefüggő**: bármely csúcsból bármelyikbe el lehet jutni.' : 'A gráf **nem összefüggő**, ' + I.components + ' összefüggő részből áll.');
        steps.push('**Fa-e?** A fa összefüggő és körmentes, és ekkor az élek száma $n-1=' + (N - 1) + '$. Itt: összefüggő: ' + yesno(I.connected) + ', körmentes: ' + yesno(I.acyclic) + ', $e=' + I.e + '$. ' + (I.tree ? 'Tehát fa.' : 'Tehát nem fa.') + (I.connected && I.e === N - 1 && !I.acyclic ? ' (Ez nem fordulhat elő.)' : ''));
        steps.push('**Teljes gráf-e?** $n$ pontú teljes gráfnak $\\dfrac{n(n-1)}{2}=\\dfrac{' + N + '\\cdot' + (N - 1) + '}{2}=' + maxE + '$ éle van; itt $e=' + I.e + '$, ezért ' + (I.complete ? 'teljes gráf.' : 'nem teljes gráf (hiányzó élek: ' + (maxE - I.e) + ').'));
        steps.push('**Két azonos fokszámú pont:** ' + (I.dupDeg ? 'van (ez minden legalább kétpontú egyszerű gráfban így van).' : 'nincs két azonos fokszámú pont – ez egyszerű gráfban lehetetlen, ellenőrizd a gráfot.'));
        var eu;
        if (!I.connected) eu = 'A gráf nem összefüggő, ezért nincs Euler-vonal (az összes él egy vonallal nem járható be).';
        else if (I.e === 0) eu = 'Nincs él, nincs mit bejárni.';
        else if (I.euler === 'kör') eu = 'Páratlan fokú csúcs: 0 db, a gráf összefüggő, ezért van **Euler-kör** (zárt bejárás minden élen pontosan egyszer).';
        else if (I.euler === 'út') eu = 'Páratlan fokú csúcs: 2 db, a gráf összefüggő, ezért van **Euler-út** (nyílt bejárás minden élen pontosan egyszer, a két páratlan fokú csúcs között), de Euler-kör nincs.';
        else eu = 'Páratlan fokú csúcs: ' + I.odd + ' db (kettőnél több), ezért nincs Euler-vonal.';
        steps.push('**Euler-vonal** (kiegészítés, a követelmény 1.4 pontja nem említi): ' + eu);
        h += kit.steps(steps);
        if (st.comp) {
          var cE = M.statgrafGraphComplement(N, st.edges), CI = M.statgrafGraphInfo(N, cE);
          h += '<div class="lab" style="margin-top:12px">komplementer gráf (szaggatott élek az ábrán)</div>' + kit.steps([
            'A komplementer ugyanazokat a csúcsokat tartalmazza, és pontosan azokat az éleket, amelyek az eredeti gráfban hiányoznak: $e+\\bar e=\\dfrac{n(n-1)}{2}$, azaz $' + I.e + '+' + cE.length + '=' + maxE + '$.',
            'Fokszámok a komplementerben: ' + CI.deg.map(function (d, k) { return '$' + (N - 1) + '-' + I.deg[k] + '=' + d + '$'; }).join(', ') + ' (minden csúcsra $\\bar d=n-1-d$).',
            'A komplementer ' + (CI.connected ? 'összefüggő' : 'nem összefüggő') + ', és ' + (CI.tree ? 'fa.' : 'nem fa.')]);
        }
        out.innerHTML = h;
      }
      function setGraph(kind, count, note) {
        st.n = count; st.edges = kind === 'kezfogas' ? M.statgrafGraphPreset('teljes', count) : M.statgrafGraphPreset(kind, count);
        st.pos = M.statgrafGraphLayout(count, kind === 'csillag' ? 'csillag' : undefined); st.note = note || '';
        var sl = kit.$('[data-in="n"]', n); sl.value = count; var lab = kit.$('[data-out="n"]', n); if (lab) lab.textContent = String(count);
        render();
      }
      kit.on(adj, 'click', function (e) {
        var b = e.target.closest ? e.target.closest('[data-e]') : null; if (!b) return;
        var q = b.dataset.e.split(',').map(Number); st.edges = M.statgrafGraphToggle(st.edges, q[0], q[1]); st.note = ''; render();
      });
      kit.on(kit.$('[data-act="comp"]', n), 'click', function () { st.comp = !st.comp; this.setAttribute('aria-pressed', st.comp ? 'true' : 'false'); render(); });
      kit.on(kit.$('[data-act="clear"]', n), 'click', function () { st.edges = []; st.note = ''; render(); });
      kit.$$('[data-preset]', n).forEach(function (b) { kit.on(b, 'click', function () {
        var k = b.dataset.preset;
        if (k === 'kezfogas') setGraph('kezfogas', 6, 'Kézfogások: 6 ember mindegyike kezet fog mindenkivel. A csúcsok az emberek, az élek a kézfogások, így $K_6$ gráfot kapunk; a kézfogások száma $\\binom{6}{2}=15$, a fokszámösszeg $2\\cdot15=30$.'.replace(/\$([^$]+)\$/g, function (a, c) { return kit.tex(c); }));
        else setGraph(k, st.n < 3 ? 5 : st.n);
      }); });
      setTimeout(function () {
        p = kit.mkPlot(kit.$('.plotbox', n), { xmin: -1.45, xmax: 1.45, ymin: -1.45, ymax: 1.45, equal: true, axes: false, grid: false });
        kit.bindSliders(n, function (v) {
          var c = v.n;
          if (c !== st.n) {
            st.edges = st.edges.filter(function (e) { return e[0] < c && e[1] < c; });
            var lay = M.statgrafGraphLayout(c); for (var i = 0; i < c; i++) if (st.pos[i]) lay[i] = st.pos[i];
            st.pos = lay.slice(0, c); st.n = c; st.note = '';
          }
          render();
        });
      }, 0);
      return n;
    }
  });
})(typeof window !== 'undefined' ? window : globalThis);
