/* MATEK OS – Labor: szélsőérték-feladatok, Riemann-összeg, két görbe közötti terület, forgástest térfogata. */
(function (root) {
  'use strict';
  var MO = root.MO = root.MO || {};
  var M = MO.models = MO.models || {};
  MO.simDefs = MO.simDefs || [];
  var PI = Math.PI;

  /* ================= MODELLEK ================= */

  /* 1. szélsőérték-feladatok. kind: doboz | keritese | henger | tavolsag; par: a / L / V / p */
  M.analizis2Szelso = function (kind, par) {
    var o = { kind: kind, par: par };
    if (kind === 'doboz') {
      var a = par;
      o.lo = 0; o.hi = a / 2; o.step = 0.05; o.xdef = a / 4; o.type = 'max';
      o.f = function (x) { return x * (a - 2 * x) * (a - 2 * x); };
      o.df = function (x) { return (a - 2 * x) * (a - 6 * x); };
      o.xo = a / 6; o.fo = 2 * a * a * a / 27; o.xs = [o.xo];
    } else if (kind === 'keritese') {
      var L = par;
      o.lo = 0; o.hi = L / 2; o.step = 0.05; o.xdef = L / 8; o.type = 'max';
      o.f = function (x) { return x * (L - 2 * x); };
      o.df = function (x) { return L - 4 * x; };
      o.xo = L / 4; o.fo = L * L / 8; o.xs = [o.xo];
    } else if (kind === 'henger') {
      var V = par;
      o.lo = 0.5; o.hi = 12; o.step = 0.1; o.xdef = 4; o.type = 'min';
      o.f = function (r) { return r > 0 ? 2 * PI * r * r + 2 * V / r : NaN; };
      o.df = function (r) { return r > 0 ? 4 * PI * r - 2 * V / (r * r) : NaN; };
      o.xo = Math.cbrt(V / (2 * PI)); o.fo = 6 * PI * o.xo * o.xo; o.xs = [o.xo];
    } else if (kind === 'tavolsag') {
      var p = par;
      o.lo = -3; o.hi = 3; o.step = 0.05; o.xdef = 1; o.type = 'min';
      o.f = function (x) { return x * x + (x * x - p) * (x * x - p); };   /* a távolság négyzete */
      o.df = function (x) { return 4 * x * x * x + 2 * (1 - 2 * p) * x; };
      if (p > 0.5) { o.xo = Math.sqrt(p - 0.5); o.fo = p - 0.25; o.xs = [-o.xo, o.xo]; }
      else { o.xo = 0; o.fo = p * p; o.xs = [0]; }
    } else return null;
    return o;
  };

  /* 2. Riemann-összeg: alsó és felső közelítő összeg n egyenlő részre, részintervallumonként k mintapont */
  M.analizis2Riemann = function (f, a, b, n, k) {
    k = k || 24; n = Math.max(1, Math.round(n));
    var dx = (b - a) / n, lo = [], hi = [], s = 0, S = 0, i, j;
    for (i = 0; i < n; i++) {
      var mn = Infinity, mx = -Infinity;
      for (j = 0; j <= k; j++) {
        var v = f(a + i * dx + dx * j / k);
        if (!isFinite(v)) return { ok: false };
        if (v < mn) mn = v; if (v > mx) mx = v;
      }
      lo.push(mn); hi.push(mx); s += mn * dx; S += mx * dx;
    }
    return { ok: true, n: n, dx: dx, lo: lo, hi: hi, lower: s, upper: S, diff: S - s };
  };

  /* 3. terület két görbe között (g ≡ 0: görbe alatt az x tengelyig); a metszéspontokat MO.cas.roots keresi */
  M.analizis2Between = function (f, g, a, b) {
    var C = MO.cas, h = function (x) { return f(x) - g(x); }, i;
    for (i = 0; i <= 60; i++) if (!isFinite(h(a + (b - a) * i / 60))) return { ok: false, reason: 'undef' };
    var rs = C.roots(h, a, b).filter(function (r) { return r > a + 1e-9 && r < b - 1e-9; }).sort(function (x, y) { return x - y; });
    if (rs.length > 40) return { ok: false, reason: 'many' };
    var pts = [a].concat(rs, [b]), parts = [], total = 0, signed = 0, neg = 0;
    for (i = 0; i + 1 < pts.length; i++) {
      var x0 = pts[i], x1 = pts[i + 1], I = C.integrate(h, x0, x1);
      if (!I.ok || !isFinite(I.value)) return { ok: false, reason: 'int' };
      var mid = h((x0 + x1) / 2), top = Math.abs(I.value) < 1e-12 && Math.abs(mid) < 1e-12 ? 0 : (mid >= 0 ? 1 : -1);
      var area = Math.abs(I.value);
      parts.push({ x0: x0, x1: x1, signed: I.value, area: area, top: top });
      total += area; signed += I.value; if (I.value < 0) neg += -I.value;
    }
    return { ok: true, roots: rs, pts: pts, parts: parts, total: total, signed: signed, negPart: neg };
  };

  /* 4. forgástest (x tengely körül): V = π∫f² dx, korongos közelítés, nevezetes testek felismerése */
  M.analizis2Forgas = function (f, a, b, n) {
    var C = MO.cas, i, mn = Infinity, mx = -Infinity;
    for (i = 0; i <= 200; i++) {
      var v = f(a + (b - a) * i / 200);
      if (!isFinite(v)) return { ok: false, reason: 'undef' };
      mn = Math.min(mn, v); mx = Math.max(mx, v);
    }
    if (mn < -1e-9) return { ok: false, reason: 'neg' };
    var I = C.integrate(function (x) { var y = f(x); return y * y; }, a, b);
    if (!I.ok || !isFinite(I.value)) return { ok: false, reason: 'int' };
    n = Math.max(1, Math.round(n));
    var dx = (b - a) / n, rad = [], Vn = 0;
    for (i = 0; i < n; i++) { var r = f(a + (i + 0.5) * dx); rad.push(r); Vn += PI * r * r * dx; }
    var res = { ok: true, V: PI * I.value, integral: I.value, n: n, dx: dx, rad: rad, Vn: Vn, max: mx, known: M.analizis2ForgasKnown(f, a, b) };
    return res;
  };
  M.analizis2ForgasKnown = function (f, a, b) {
    var m = b - a, fa = f(a), fb = f(b), tol = 1e-7 * Math.max(1, Math.abs(fa), Math.abs(fb)), i, ok;
    var near = function (x, y) { return Math.abs(x - y) <= tol; };
    if (!(m > 0)) return null;
    ok = true; for (i = 0; i <= 10; i++) if (!near(f(a + m * i / 10), fa)) ok = false;
    if (ok && fa > 1e-9) return { kind: 'henger', r: fa, m: m, V: PI * fa * fa * m };
    ok = true; for (i = 0; i <= 10; i++) if (!near(f(a + m * i / 10), fa + (fb - fa) * i / 10)) ok = false;
    if (ok && near(fa, 0) && fb > 1e-9) return { kind: 'kup', r: fb, m: m, V: PI * fb * fb * m / 3 };
    if (ok && near(fb, 0) && fa > 1e-9) return { kind: 'kup', r: fa, m: m, V: PI * fa * fa * m / 3 };
    var R = m / 2, c0 = (a + b) / 2;
    ok = near(fa, 0) && near(fb, 0) && R > 0;
    for (i = 1; i < 10 && ok; i++) { var x = a + m * i / 10; if (!near(f(x), Math.sqrt(Math.max(0, R * R - (x - c0) * (x - c0))))) ok = false; }
    if (ok) return { kind: 'gomb', r: R, m: m, V: 4 * PI * R * R * R / 3 };
    return null;
  };
  /* 3D-s jelenet: korongok (két-két körvonal + alkotók) és a sima felület meridiánjai */
  M.analizis2ForgasScene = function (f, a, b, n, segs) {
    segs = segs || 24; n = Math.max(1, Math.round(n));
    var xm = (a + b) / 2, pts = [], edges = [], dx = (b - a) / n, i, j, t, c = 0;
    function circle(x, r, dash, dim) {
      var s0 = pts.length;
      for (j = 0; j < segs; j++) pts.push([x - xm, r * Math.cos(2 * PI * j / segs), r * Math.sin(2 * PI * j / segs)]);
      for (j = 0; j < segs; j++) edges.push({ v: [s0 + j, s0 + (j + 1) % segs], dash: !!dash, dim: !!dim });
      return s0;
    }
    for (i = 0; i < n; i++) {
      var r = f(a + (i + 0.5) * dx), s1 = circle(a + i * dx, r, false, false), s2 = circle(a + (i + 1) * dx, r, false, false);
      for (j = 0; j < segs; j += Math.max(1, Math.round(segs / 8))) edges.push({ v: [s1 + j, s2 + j], dim: true });
    }
    var mer = 6, K = 32;
    for (t = 0; t < mer; t++) {
      var th = PI * t / mer * 2, s0 = pts.length;
      for (i = 0; i <= K; i++) { var x = a + (b - a) * i / K, y = f(x); pts.push([x - xm, y * Math.cos(th), y * Math.sin(th)]); }
      for (i = 0; i < K; i++) edges.push({ v: [s0 + i, s0 + i + 1], color: 2, w: 1.2 });
    }
    var e0 = pts.length; pts.push([a - xm - 0.1 * (b - a), 0, 0], [b - xm + 0.1 * (b - a), 0, 0]); edges.push({ v: [e0, e0 + 1], dash: true, color: 1 });
    var labels = [{ i: e0 + 1, text: 'x tengely' }];
    return { points: pts, edges: edges, faces: [], labels: labels, dots: [] };
  };

  /* ================= SEGÉDEK ================= */
  function msg(k, t) { return '<p class="msg ' + k + '">' + t + '</p>'; }
  function eqs(v, d) { d = d === undefined ? 3 : d; var q = Math.pow(10, d); return Math.abs(v * q - Math.round(v * q)) < 1e-6 ? '=' : '\\approx'; }
  function cerr(e) { return e && e.cas && e.message ? e.message : 'Ezt a kifejezést nem tudom értelmezni.'; }
  function compileX(kit, s) {
    var c = kit.C.compile(s);
    if (c.vars.filter(function (v) { return v !== 'x'; }).length) throw { cas: true, message: 'Csak x szerepelhet változóként.' };
    return c;
  }
  function range(f, a, b, extraZero) {
    var mn = Infinity, mx = -Infinity, i;
    for (i = 0; i <= 200; i++) { var y = f(a + (b - a) * i / 200); if (isFinite(y)) { mn = Math.min(mn, y); mx = Math.max(mx, y); } }
    if (extraZero) { mn = Math.min(mn, 0); mx = Math.max(mx, 0); }
    if (!isFinite(mn) || !isFinite(mx)) return null;
    if (mx - mn < 1e-9) { mn -= 1; mx += 1; }
    var pad = (mx - mn) * 0.14; return [mn - pad, mx + pad];
  }
  function setPreset(n, kit, vals, sliderId) {
    var xs = kit.$$('input[type=text]', n); xs.forEach(function (inp, i) { if (vals[i] !== undefined) inp.value = vals[i]; });
  }

  /* ================= 1. SZÉLSŐÉRTÉK-FELADATOK ================= */
  var SZ = {
    doboz: { name: 'Hajtogatott doboz: maximális térfogat', pl: 'a (a lemez oldala, cm)', pmin: 10, pmax: 60, pstep: 1, pdef: 30, xl: 'x (a kivágott négyzet oldala, cm)' },
    keritese: { name: 'Kerítés a fal mellett: maximális terület', pl: 'L (a kerítés hossza, m)', pmin: 20, pmax: 100, pstep: 1, pdef: 60, xl: 'x (a falra merőleges oldal, m)' },
    henger: { name: 'Henger: minimális felszín adott térfogatnál', pl: 'V (a térfogat, cm³)', pmin: 200, pmax: 2000, pstep: 50, pdef: 1000, xl: 'r (az alapkör sugara, cm)' },
    tavolsag: { name: 'Pont és parabola: legkisebb távolság', pl: 'p (a P(0; p) pont második koordinátája)', pmin: -1, pmax: 4, pstep: 0.25, pdef: 2, xl: 'x (a parabola Q(x; x²) pontjának abszcisszája)' }
  };
  function szSteps(kit, k, par, c) {
    var T = function (x, d) { return kit.tnum(x, d === undefined ? 3 : d); }, S = [];
    if (k === 'doboz') {
      var a = par;
      S.push('**Változó:** a kivágott négyzetek oldala legyen $x$ (cm). A lemez oldala $a=' + T(a) + '$ cm.');
      S.push('**Értelmezési tartomány:** az alap oldala $a-2x>0$ és $x>0$, ezért $0<x<\\dfrac{a}{2}=' + T(a / 2) + '$.');
      S.push('**Célfüggvény:** a doboz alapja $(a-2x)\\times(a-2x)$, magassága $x$, így $V(x)=x\\,(a-2x)^2$.');
      S.push('**Derivált:** $V\'(x)=(a-2x)^2+x\\cdot 2(a-2x)\\cdot(-2)=(a-2x)(a-6x)$.');
      S.push('**A derivált zérushelye:** $V\'(x)=0$, és $a-2x>0$ a tartományban, ezért $a-6x=0$, azaz $x=\\dfrac{a}{6}' + eqs(a / 6) + T(a / 6) + '$.');
      S.push('**Igazolás:** $a-2x>0$ mindenütt, így $V\'$ előjelét $a-6x$ adja: ha $x<\\dfrac{a}{6}$, akkor $V\'>0$, ha $x>\\dfrac{a}{6}$, akkor $V\'<0$. $V\'$ előjele $+$-ról $-$-ra vált, tehát $x=\\dfrac a6$-ban a függvénynek **maximuma** van (a tartomány szélein $V=0$). $V_{\\max}=\\dfrac{2a^3}{27}' + eqs(c.fo) + T(c.fo) + '$.');
      S.push('**Válasz:** $' + T(a / 6) + '$ cm oldalú négyzeteket kell kivágni; a doboz legnagyobb térfogata $' + T(c.fo) + '$ cm³.');
    } else if (k === 'keritese') {
      var L = par;
      S.push('**Változó:** a falra merőleges oldalak hossza legyen $x$ (m), a fal mentén lévő oldalé $L-2x$, ahol $L=' + T(L) + '$ m.');
      S.push('**Értelmezési tartomány:** $x>0$ és $L-2x>0$, azaz $0<x<\\dfrac L2=' + T(L / 2) + '$.');
      S.push('**Célfüggvény:** $T(x)=x\\,(L-2x)=Lx-2x^2$.');
      S.push('**Derivált:** $T\'(x)=L-4x$.');
      S.push('**A derivált zérushelye:** $L-4x=0$, azaz $x=\\dfrac L4=' + T(L / 4) + '$.');
      S.push('**Igazolás:** ha $x<\\dfrac L4$, akkor $T\'>0$; ha $x>\\dfrac L4$, akkor $T\'<0$. Az előjel $+$-ról $-$-ra vált, ezért itt **maximum** van. $T_{\\max}=\\dfrac L4\\cdot\\dfrac L2=\\dfrac{L^2}{8}' + eqs(c.fo) + T(c.fo) + '$.');
      S.push('**Válasz:** a téglalap oldalai $' + T(L / 4) + '$ m és $' + T(L / 2) + '$ m (a fallal párhuzamos oldal a hosszabb); a legnagyobb terület $' + T(c.fo) + '$ m².');
    } else if (k === 'henger') {
      var V = par, r0 = c.xo;
      S.push('**Változó:** az alapkör sugara legyen $r$ (cm); a térfogat $V=' + T(V, 0) + '$ cm³, a magasság $h=\\dfrac{V}{\\pi r^2}$.');
      S.push('**Értelmezési tartomány:** $r>0$.');
      S.push('**Célfüggvény:** $A(r)=2\\pi r^2+2\\pi r h=2\\pi r^2+\\dfrac{2V}{r}$.');
      S.push('**Derivált:** $A\'(r)=4\\pi r-\\dfrac{2V}{r^2}=\\dfrac{4\\pi r^3-2V}{r^2}$.');
      S.push('**A derivált zérushelye:** $4\\pi r^3=2V$, azaz $r=\\sqrt[3]{\\dfrac{V}{2\\pi}}\\approx ' + T(r0) + '$ cm.');
      S.push('**Igazolás:** a nevező pozitív, így $A\'$ előjelét $4\\pi r^3-2V$ adja: ha $r<r_0$, akkor $A\'<0$; ha $r>r_0$, akkor $A\'>0$. Az előjel $-$-ról $+$-ra vált, tehát **minimum** van. Itt $V=2\\pi r_0^3$, ezért $h=\\dfrac{V}{\\pi r_0^2}=2r_0$, és $A_{\\min}=6\\pi r_0^2\\approx ' + T(c.fo) + '$ cm².');
      S.push('**Válasz:** a legkisebb felszínű henger sugara $\\approx ' + T(r0) + '$ cm, magassága $\\approx ' + T(2 * r0) + '$ cm (a magasság az átmérővel egyenlő); felszíne $\\approx ' + T(c.fo) + '$ cm².');
    } else {
      var p = par;
      S.push('**Változó:** a $P(0;\\ ' + T(p) + ')$ pontot és az $y=x^2$ parabola $Q(x;\\ x^2)$ pontját vizsgáljuk; a változó $x$.');
      S.push('**Értelmezési tartomány:** $x\\in\\mathbb R$.');
      S.push('**Célfüggvény:** elég a távolság négyzetét minimalizálni (a gyökvonás monoton): $g(x)=PQ^2=x^2+(x^2-p)^2=x^4+(1-2p)x^2+p^2$.');
      S.push('**Derivált:** $g\'(x)=4x^3+2(1-2p)x=2x\\,\\bigl(2x^2+1-2p\\bigr)$.');
      if (p > 0.5) {
        S.push('**A derivált zérushelye:** $x=0$ vagy $x^2=p-\\dfrac12=' + T(p - 0.5) + '$, azaz $x=\\pm\\sqrt{' + T(p - 0.5) + '}\\approx\\pm' + T(c.xo) + '$.');
        S.push('**Igazolás:** $g\'$ előjele $-,\\ +,\\ -,\\ +$ a $(-\\infty;-x_0)$, $(-x_0;0)$, $(0;x_0)$, $(x_0;\\infty)$ intervallumokon, ahol $x_0=\\sqrt{p-\\frac12}$. A $\\pm x_0$ helyeken az előjel $-$-ról $+$-ra vált: **minimum**; $x=0$-ban csak helyi maximum van ($g(0)=p^2=' + T(p * p) + '$). $g_{\\min}=p-\\dfrac14' + eqs(c.fo) + T(c.fo) + '$.');
        S.push('**Válasz:** a legközelebbi pontok $(\\pm' + T(c.xo) + ';\\ ' + T(p - 0.5) + ')$, a legkisebb távolság $\\sqrt{p-\\frac14}\\approx ' + T(Math.sqrt(c.fo)) + '$.');
      } else {
        S.push('**A derivált zérushelye:** $2x^2+1-2p\\ge 1-2p\\ge 0$, ezért $g\'$ zérushelye csak $x=0$ (ha $p=\\frac12$, ott is $x=0$ az egyetlen).');
        S.push('**Igazolás:** $g\'$ előjele megegyezik $x$ előjelével ($x<0$: $-$, $x>0$: $+$). Az előjel $-$-ról $+$-ra vált, tehát $x=0$-ban **minimum** van, $g(0)=p^2=' + T(c.fo) + '$.');
        S.push('**Válasz:** a legközelebbi pont a parabola csúcsa, $(0;0)$, a legkisebb távolság $|p|=' + T(Math.sqrt(c.fo)) + '$. (Ha $p\\le\\frac12$, a csúcs a legközelebbi pont.)');
      }
    }
    return S;
  }
  MO.simDefs.push({
    id: 'szelsoertek-feladatok', title: 'Szélsőérték-feladatok',
    desc: 'Négy klasszikus szélsőérték-feladat (doboz, kerítés, henger, parabola): húzd a változót, nézd a célfüggvény grafikonját, és kövesd az érettségi szintű megoldást.',
    group: 'analízis', topic: 'fuggvenyek', sub: 'derivalas', formulas: ['f-szelsoertek-derivalt'],
    build: function (kit) {
      var n = kit.el('<div>' + kit.select('task', 'Feladat', Object.keys(SZ).map(function (k) { return [k, SZ[k].name]; }), 'doboz') +
        kit.slider('p', 'paraméter', 10, 60, 1, 30) + kit.slider('x', 'változó', 0, 15, 0.05, 7.5) +
        '<div class="row" style="margin:6px 0 10px"><button class="btn sm" type="button" data-preset="doboz,30,3">doboz: 3 cm</button>' +
        '<button class="btn sm" type="button" data-preset="doboz,30,5">doboz: a/6</button>' +
        '<button class="btn sm" type="button" data-preset="keritese,60,10">kerítés: 60 m</button>' +
        '<button class="btn sm" type="button" data-preset="henger,1000,3">henger: 1 liter</button>' +
        '<button class="btn sm" type="button" data-preset="tavolsag,2,0.5">parabola: P(0; 2)</button></div>' +
        '<div class="lab">a helyzet</div>' + kit.plotBox(230) + '<div class="lab" style="margin-top:10px">a célfüggvény grafikonja</div>' + kit.plotBox(250) + '<div class="out"></div></div>');
      var pA = null, pB = null, sel = kit.$('[data-sel="task"]', n), ip = kit.$('[data-in="p"]', n), ix = kit.$('[data-in="x"]', n);
      function lab(id, txt) { var s = kit.$('[data-in="' + id + '"]', n).parentNode.firstChild; s.firstChild.nodeValue = txt + ' '; }
      function configure(task, par, x) {
        var cf = SZ[task]; lab('p', cf.pl);
        ip.min = cf.pmin; ip.max = cf.pmax; ip.step = cf.pstep; ip.value = par === undefined ? cf.pdef : par;
        var c = M.analizis2Szelso(task, parseFloat(ip.value));
        lab('x', cf.xl); ix.min = c.lo; ix.max = c.hi; ix.step = c.step; ix.value = x === undefined ? c.xdef : x;
      }
      function pic(task, par, x, c) {
        if (task === 'doboz') {
          var a = par, q = function (x0, y0) { return { pts: [[x0, y0], [x0 + x, y0], [x0 + x, y0 + x], [x0, y0 + x]], fill: true, alpha: 0.3, color: 1 }; };
          return { xmin: -a * 0.4, xmax: a * 1.4, ymin: -a * 0.1, ymax: a * 1.1, equal: true,
            polys: [{ pts: [[0, 0], [a, 0], [a, a], [0, a]] }, q(0, 0), q(a - x, 0), q(a - x, a - x), q(0, a - x), { pts: [[x, x], [a - x, x], [a - x, a - x], [x, a - x]], dash: [5, 4], dim: true }],
            labels: [{ x: x / 2, y: 0, text: 'x', dy: -12, align: 'center' }, { x: a / 2, y: x, text: 'a−2x', dy: 4, align: 'center' }], curves: [], points: [], segments: [], circles: [], fills: [] };
        }
        if (task === 'keritese') {
          var L = par, w = L - 2 * x;
          return { xmin: -L * 0.25, xmax: L * 1.25, ymin: -L * 0.18, ymax: L * 0.62, equal: true,
            polys: [{ pts: [[0, 0], [0, x], [w, x], [w, 0]], close: false, w: 2.5 }, { pts: [[0, 0], [w, 0], [w, x], [0, x]], fill: true, alpha: 0.16, color: 1 }],
            segments: [{ a: [-L * 0.08, 0], b: [L * 1.08, 0], w: 3, dim: true }],
            labels: [{ x: w / 2, y: x, text: 'L−2x', dy: -6, align: 'center' }, { x: 0, y: x / 2, text: 'x', dx: -10 }, { x: L * 0.5, y: 0, text: 'fal', dy: 14, align: 'center', dim: true }],
            curves: [], points: [], circles: [], fills: [] };
        }
        if (task === 'henger') {
          var r = x, h = par / (PI * r * r), S = Math.max(h, 2 * r), el = [], el2 = [], i;
          for (i = 0; i <= 40; i++) { var t = 2 * PI * i / 40; el.push([r * Math.cos(t), 0.22 * r * Math.sin(t)]); el2.push([r * Math.cos(t), h + 0.22 * r * Math.sin(t)]); }
          return { xmin: -0.75 * S, xmax: 0.75 * S, ymin: -0.2 * S, ymax: 1.15 * S, equal: true,
            polys: [{ pts: [[-r, 0], [-r, h], [r, h], [r, 0]], close: false }, { pts: el }, { pts: el2, fill: true, alpha: 0.16, color: 1 }],
            segments: [{ a: [0, h], b: [r, h], dash: [4, 3], dim: true }, { a: [r * 1.15, 0], b: [r * 1.15, h], dash: [4, 3], dim: true }],
            labels: [{ x: r / 2, y: h, text: 'r', dy: 4, align: 'center' }, { x: r * 1.15, y: h / 2, text: 'h=' + kit.num(h, 2), dx: 4 }],
            curves: [], points: [], circles: [], fills: [] };
        }
        var yq = x * x;
        return { xmin: -5.4, xmax: 5.4, ymin: -1.6, ymax: 6.4, equal: true, curves: [{ f: function (u) { return u * u; } }],
          points: [{ x: 0, y: par, label: 'P' }, { x: x, y: yq, label: 'Q', color: 2 }], segments: [{ a: [0, par], b: [x, yq], dash: [5, 4], w: 2 }],
          labels: [{ x: x / 2, y: (par + yq) / 2, text: 'd=' + kit.num(Math.sqrt(c.f(x)), 3), dy: -10, align: 'center' }], polys: [], circles: [], fills: [] };
      }
      function upd(v) {
        if (!pA || !pB) return;
        var task = sel.value, par = v.p, c = M.analizis2Szelso(task, par);
        ix.min = c.lo; ix.max = c.hi; ix.step = c.step;
        var x = Math.min(c.hi, Math.max(c.lo, parseFloat(ix.value))); ix.value = x;
        kit.$('[data-out="x"]', n).textContent = kit.num(parseFloat(ix.value), 4); x = parseFloat(ix.value);
        var fx = c.f(x), isMax = c.type === 'max', unit = { doboz: 'cm³', keritese: 'm²', henger: 'cm²', tavolsag: '' }[task];
        var name = { doboz: 'V', keritese: 'T', henger: 'A', tavolsag: 'g' }[task];
        pA.set(pic(task, par, x, c));
        var yr = isMax ? [-0.14 * c.fo, 1.25 * c.fo] : task === 'henger' ? [-0.14 * 2.5 * c.fo, 2.5 * c.fo] : [-0.1 * (c.fo + 14), c.fo + 14];
        var dxg = (c.hi - c.lo) * 0.05, pts = c.xs.map(function (xo) { return { x: xo, y: c.fo, label: isMax ? 'max' : 'min', color: 2 }; });
        pts.push({ x: x, y: fx, label: 'most' });
        pB.set({ xmin: c.lo - dxg, xmax: c.hi + dxg, ymin: yr[0], ymax: yr[1], equal: false, curves: [{ f: c.f }], points: pts,
          segments: [{ a: [x, 0], b: [x, fx], dash: [4, 4], dim: true }, { a: [c.lo, c.fo], b: [c.xs[c.xs.length - 1], c.fo], dash: [4, 4], dim: true }], polys: [], labels: [], circles: [], fills: [] });
        var ok = Math.abs(fx - c.fo) < 1e-9 * Math.max(1, c.fo);
        var cur = name + '(x)' + eqs(fx) + kit.tnum(fx, 3) + '\\ \\text{' + unit + '}', ext = name + '_{\\text{' + (isMax ? 'max' : 'min') + '}}' + eqs(c.fo) + kit.tnum(c.fo, 3) + '\\ \\text{' + unit + '}';
        if (task === 'tavolsag') { cur = 'g(x)=PQ^2' + eqs(fx) + kit.tnum(fx, 3) + ',\\ PQ' + eqs(Math.sqrt(fx)) + kit.tnum(Math.sqrt(fx), 3); ext = 'g_{\\min}' + eqs(c.fo) + kit.tnum(c.fo, 3) + ',\\ PQ_{\\min}' + eqs(Math.sqrt(c.fo)) + kit.tnum(Math.sqrt(c.fo), 3); }
        kit.$('.out', n).innerHTML = '<div class="ans">' + kit.tex(cur) + '<br>' + kit.tex(ext) + '</div>' +
          (ok ? msg('ok', 'Pontosan a ' + (isMax ? 'maximum' : 'minimum') + 'nál állsz.') : msg('ok', 'A mostani érték ' + (isMax ? 'kisebb' : 'nagyobb') + ' a szélsőértéknél, az eltérés ' + kit.num(Math.abs(fx - c.fo), 3) + '. Keresd meg a csúszkával, majd ellenőrizd a levezetéssel!')) +
          kit.steps(szSteps(kit, task, par, c));
      }
      setTimeout(function () {
        var bs = kit.$$('.plotbox', n);
        pA = kit.mkPlot(bs[0], { xmin: -1, xmax: 31, ymin: -1, ymax: 31, equal: true, interactive: false });
        pB = kit.mkPlot(bs[1], { xmin: 0, xmax: 1, ymin: 0, ymax: 1 });
        configure('doboz'); kit.bindSliders(n, upd);
      }, 0);
      kit.on(sel, 'change', function () { configure(sel.value); ip.dispatchEvent(new Event('input')); });
      kit.$$('[data-preset]', n).forEach(function (b) { kit.on(b, 'click', function () {
        var s = b.dataset.preset.split(','); sel.value = s[0]; configure(s[0], parseFloat(s[1]), parseFloat(s[2])); ip.dispatchEvent(new Event('input'));
      }); });
      return n;
    }
  });

  /* ================= 2. RIEMANN-ÖSSZEG ================= */
  MO.simDefs.push({
    id: 'riemann', title: 'Határozott integrál: alsó és felső közelítő összeg',
    desc: 'Kétoldali közelítés téglalapokkal: növeld a felosztás finomságát, és nézd, hogyan szorítja közre az alsó és a felső összeg az integrált.',
    group: 'analízis', topic: 'fuggvenyek', sub: 'integral', formulas: ['f-hat-integral-tulajdonsag', 'f-terulet-grafikon-alatt'],
    build: function (kit) {
      var n = kit.el('<div>' + kit.fnInput('x^2') + '<div class="row">' + kit.numIn('a', 'alsó határ (a)', '0') + kit.numIn('b', 'felső határ (b)', '2') + '</div>' +
        kit.slider('n', 'n (a részintervallumok száma)', 1, 100, 1, 8) +
        '<div class="row" style="margin:6px 0 10px"><button class="btn sm" type="button" data-preset="x^2~0~2~8">x² a [0; 2]-n</button>' +
        '<button class="btn sm" type="button" data-preset="sin(x)~0~pi~8">sin x a [0; π]-n</button>' +
        '<button class="btn sm" type="button" data-preset="x^3-3x~-2~2~10">x³−3x a [−2; 2]-n</button>' +
        '<button class="btn sm" type="button" data-preset="1/x~1~e~12">1/x az [1; e]-n</button></div>' +
        kit.plotBox(280) + kit.legend([[0, 'f'], [1, 'alsó összeg (kitöltve)'], [2, 'felső összeg (pontozott)']]) + '<div class="out"></div></div>');
      var p = null, inn = kit.$('[data-in="n"]', n);
      function stair(arr, a, dx) { var pts = [[a, 0]], i; for (i = 0; i < arr.length; i++) { pts.push([a + i * dx, arr[i]], [a + (i + 1) * dx, arr[i]]); } pts.push([a + arr.length * dx, 0]); return pts; }
      function refresh() {
        if (!p) return;
        var o = kit.$('.out', n), v = kit.readNums(n), nn = parseInt(inn.value, 10), c;
        try {
          c = compileX(kit, kit.$('[data-fx]', n).value);
          if (!v) throw { cas: true, message: 'A határok legyenek számok (pl. 0, 2, pi, e).' };
          if (!(v.b > v.a)) throw { cas: true, message: 'Legyen a < b.' };
          if (v.b - v.a > 200) throw { cas: true, message: 'Az intervallum legfeljebb 200 egység hosszú lehet.' };
          var f = c.f, R = M.analizis2Riemann(f, v.a, v.b, nn);
          if (!R.ok) throw { cas: true, message: 'Az f függvény az [a; b] intervallum egyes pontjain nincs értelmezve, vagy nem véges. Válassz másik intervallumot.' };
          var I = kit.C.integrate(f, v.a, v.b), T = function (x) { return kit.tnum(x, 5); }, rows = '';
          [4, 8, 16, 32, 64].forEach(function (m) { var Q = M.analizis2Riemann(f, v.a, v.b, m, 16); rows += '<tr' + (m === nn ? ' style="font-weight:700"' : '') + '><td>' + m + '</td><td>' + kit.num(Q.lower, 5) + '</td><td>' + kit.num(Q.upper, 5) + '</td><td>' + kit.num(Q.diff, 5) + '</td></tr>'; });
          var yr = range(f, v.a, v.b, true), Iv = I.ok ? I.value : NaN, between = I.ok && R.lower <= Iv + 1e-6 && Iv <= R.upper + 1e-6;
          p.set({ xmin: v.a - (v.b - v.a) * 0.08, xmax: v.b + (v.b - v.a) * 0.08, ymin: yr[0], ymax: yr[1], curves: [{ f: f }],
            polys: [{ pts: stair(R.lo, v.a, R.dx), fill: true, alpha: 0.2, color: 1 }, { pts: stair(R.hi, v.a, R.dx), color: 2, dash: [2, 3], close: false, w: 1.6 }], points: [], segments: [], labels: [], circles: [], fills: [] });
          o.innerHTML = '<div class="ans">' + kit.tex('s_{' + nn + '}' + eqs(R.lower, 5) + T(R.lower) + ',\\quad S_{' + nn + '}' + eqs(R.upper, 5) + T(R.upper)) + '<br>' + kit.tex('S_{' + nn + '}-s_{' + nn + '}' + eqs(R.diff, 5) + T(R.diff)) + '<br>' +
            (I.ok ? kit.tex('\\displaystyle\\int_{' + kit.tnum(v.a, 4) + '}^{' + kit.tnum(v.b, 4) + '} f(x)\\,dx\\approx ' + T(Iv)) : 'Az integrál numerikusan nem számolható.') + '</div>' +
            (between ? msg('ok', 'Az integrál az alsó és a felső összeg között van.') : '') +
            kit.steps([
              '**Felosztás:** az $[a;b]$ intervallumot $n=' + nn + '$ egyenlő részre osztjuk, egy rész hossza $\\Delta x=\\dfrac{b-a}{n}=' + T(R.dx) + '$.',
              '**Alsó és felső összeg:** minden részintervallumon vesszük az $f$ legkisebb ($m_i$) és legnagyobb ($M_i$) értékét (sűrű mintavétellel találtuk meg). $s_n=\\sum m_i\\,\\Delta x' + eqs(R.lower, 5) + T(R.lower) + '$, $S_n=\\sum M_i\\,\\Delta x' + eqs(R.upper, 5) + T(R.upper) + '$. Ahol $f$ negatív, a téglalap „előjeles” területe negatív.',
              '**Kétoldali közelítés:** $s_n\\le\\displaystyle\\int_a^b f(x)\\,dx\\le S_n$, a különbség $S_n-s_n' + eqs(R.diff, 5) + T(R.diff) + '$. Folytonos függvényre ez a különbség $n$ növelésével 0-hoz tart, és a két összeg közös határértéke a határozott integrál.',
              '**Monoton függvénynél** a különbség pontosan $|f(b)-f(a)|\\cdot\\Delta x$, ezért $n$ duplázásakor a felére csökken – nézd meg a táblázatot.'
            ]) + '<div class="lab">a két összeg közeledése</div><div class="tblwrap"><table class="t"><tr><th>n</th><th>alsó összeg</th><th>felső összeg</th><th>különbség</th></tr>' + rows + '</table></div>';
        } catch (e) { o.innerHTML = msg('bad', cerr(e)); }
      }
      setTimeout(function () { p = kit.mkPlot(kit.$('.plotbox', n), { xmin: -1, xmax: 3, ymin: -1, ymax: 5 }); kit.bindSliders(n, refresh); }, 0);
      kit.$$('input[type=text]', n).forEach(function (i) { kit.on(i, 'input', refresh); });
      kit.$$('[data-preset]', n).forEach(function (b) { kit.on(b, 'click', function () {
        var s = b.dataset.preset.split('~'); kit.$('[data-fx]', n).value = s[0]; kit.$('[data-n="a"]', n).value = s[1]; kit.$('[data-n="b"]', n).value = s[2]; inn.value = s[3]; inn.dispatchEvent(new Event('input'));
      }); });
      return n;
    }
  });

  /* ================= 3. TERÜLET KÉT GÖRBE KÖZÖTT ================= */
  MO.simDefs.push({
    id: 'ket-gorbe-terulet', title: 'Terület két görbe között',
    desc: 'Két függvény grafikonja közti terület: a metszéspontokat a program megkeresi, a területet szakaszonként, |f−g| integráljaként számolja; külön mód a görbe alatti területre.',
    group: 'analízis', topic: 'fuggvenyek', sub: 'integral', formulas: ['f-terulet-ket-gorbe', 'f-terulet-grafikon-alatt', 'f-newton-leibniz'],
    build: function (kit) {
      var n = kit.el('<div>' + kit.select('mode', 'Mód', [['ket', 'Két görbe között'], ['alatt', 'Görbe alatt, az x tengelyig']], 'ket') + kit.fnInput('x^2') +
        '<label class="f" data-grow><span>g(x)</span><input type="text" data-gx value="x+2" autocomplete="off" autocapitalize="off" spellcheck="false"></label>' +
        '<div class="row">' + kit.numIn('a', 'ettől (a)', '-3') + kit.numIn('b', 'eddig (b)', '3') + '</div>' +
        '<div class="row" style="margin:6px 0 10px"><button class="btn sm" type="button" data-preset="x^2~x+2~-3~3~ket">parabola és egyenes</button>' +
        '<button class="btn sm" type="button" data-preset="sin(x)~cos(x)~0~2pi~ket">sin és cos</button>' +
        '<button class="btn sm" type="button" data-preset="x^3-4x~0~-2~2~alatt">x³−4x: előjeles és tényleges</button>' +
        '<button class="btn sm" type="button" data-preset="x^2-1~0~-2~2~alatt">x²−1 az x tengelyig</button></div>' +
        kit.plotBox(290) + '<div id="lg"></div><div class="out"></div></div>');
      var p = null, sel = kit.$('[data-sel="mode"]', n), grow = kit.$('[data-grow]', n);
      function refresh() {
        if (!p) return;
        var o = kit.$('.out', n), v = kit.readNums(n), alt = sel.value === 'alatt', f, g;
        grow.style.display = alt ? 'none' : '';
        kit.$('#lg', n).innerHTML = alt ? kit.legend([[0, 'f']]) : kit.legend([[0, 'f (folytonos)'], [1, 'g (szaggatott)']]);
        try {
          f = compileX(kit, kit.$('[data-fx]', n).value).f; g = alt ? function () { return 0; } : compileX(kit, kit.$('[data-gx]', n).value).f;
          if (!v) throw { cas: true, message: 'A határok legyenek számok (pl. -3, 2pi).' };
          if (!(v.b > v.a)) throw { cas: true, message: 'Legyen a < b.' };
          if (v.b - v.a > 200) throw { cas: true, message: 'Az intervallum legfeljebb 200 egység hosszú lehet.' };
          var R = M.analizis2Between(f, g, v.a, v.b);
          if (!R.ok) throw { cas: true, message: R.reason === 'many' ? 'Túl sok metszéspont: a két függvény talán megegyezik.' : 'A függvény az intervallum egyes pontjain nincs értelmezve, vagy az integrál nem számolható. Válassz másik intervallumot.' };
          var T = function (x) { return kit.tnum(x, 4); }, ys = range(function (x) { var a1 = f(x), b1 = g(x); return isFinite(a1) ? a1 : b1; }, v.a, v.b, true), y2 = range(g, v.a, v.b, alt);
          var lo = Math.min(ys[0], y2 ? y2[0] : ys[0]), hi = Math.max(ys[1], y2 ? y2[1] : ys[1]);
          var fills = R.parts.map(function (q) { return alt ? { f: f, a: q.x0, b: q.x1, color: q.top >= 0 ? 0 : 1 } : { f: f, g: g, a: q.x0, b: q.x1, color: q.top >= 0 ? 0 : 1 }; });
          var pts = alt ? R.roots.map(function (r) { return { x: r, y: 0, label: kit.num(r, 3) }; }) : R.roots.map(function (r, i) { return { x: r, y: f(r), label: 'M' + (i + 1) }; });
          p.set({ xmin: v.a - (v.b - v.a) * 0.06, xmax: v.b + (v.b - v.a) * 0.06, ymin: lo, ymax: hi, curves: alt ? [{ f: f }] : [{ f: f }, { f: g }], fills: fills, points: pts, polys: [], segments: [], labels: [], circles: [] });
          var h = alt ? 'f(x)' : 'f(x)-g(x)', rows = R.parts.map(function (q, i) {
            return '<tr><td>' + kit.tex('[' + T(q.x0) + ';\\ ' + T(q.x1) + ']') + '</td><td>' + (alt ? (q.top > 0 ? 'x tengely fölött' : q.top < 0 ? 'x tengely alatt' : '—') : (q.top > 0 ? 'f' : q.top < 0 ? 'g' : '—')) + '</td><td>' + kit.tex(T(q.signed)) + '</td><td>' + kit.tex(T(q.area)) + '</td></tr>'; }).join('');
          var steps = [];
          steps.push(alt ? '**Zérushelyek:** $f(x)=0$ az $[' + T(v.a) + ';\\ ' + T(v.b) + ']$ intervallumon: ' + (R.roots.length ? '$x\\approx ' + R.roots.map(T).join(';\\ ') + '$' : 'nincs') + '. Ezek osztják szakaszokra az intervallumot, mert itt vált előjelet $f$.'
            : '**Metszéspontok:** $f(x)=g(x)$, azaz $f(x)-g(x)=0$ az $[' + T(v.a) + ';\\ ' + T(v.b) + ']$ intervallumon: ' + (R.roots.length ? '$x\\approx ' + R.roots.map(T).join(';\\ ') + '$' : 'nincs') + '. Ezek osztják szakaszokra az intervallumot, mert itt cserélődik, melyik függvény van felül.');
          steps.push('**Szakaszonként:** minden szakaszon $' + h + '$ állandó előjelű, ezért a terület $\\left|\\displaystyle\\int_{x_i}^{x_{i+1}}' + h + '\\,dx\\right|$. A szakaszok: ' + R.parts.map(function (q, i) { return '$T_' + (i + 1) + '=\\left|' + T(q.signed) + '\\right|=' + T(q.area) + '$'; }).join(', ') + '.');
          steps.push('**Összeg:** $T=\\sum T_i' + eqs(R.total, 4) + T(R.total) + '$.');
          if (alt) steps.push('**Előjeles integrál:** $\\displaystyle\\int_a^b f(x)\\,dx' + eqs(R.signed, 4) + T(R.signed) + '$. A negatív szakaszok területe $' + T(R.negPart) + '$, ezért a két érték különbsége $T-\\int f=2\\cdot' + T(R.negPart) + '=' + T(R.total - R.signed) + '$. Az x tengely alatti rész az integrálban levonódik, a területben hozzáadódik.');
          else steps.push('**Figyelem:** ha $|f-g|$ helyett egyben $\\int(f-g)\\,dx' + eqs(R.signed, 4) + T(R.signed) + '$-t számolnál, az előjelváltások miatt a részek kioltanák egymást; a terület csak az abszolút értékek összege.');
          o.innerHTML = '<div class="ans">' + kit.tex('T' + eqs(R.total, 4) + T(R.total) + (alt ? ',\\quad \\displaystyle\\int_a^b f' + eqs(R.signed, 4) + T(R.signed) : '')) + '</div>' + kit.steps(steps) +
            '<div class="tblwrap"><table class="t"><tr><th>szakasz</th><th>' + (alt ? 'f helyzete' : 'felül lévő') + '</th><th>előjeles integrál</th><th>terület</th></tr>' + rows + '</table></div>';
        } catch (e) { o.innerHTML = msg('bad', cerr(e)); }
      }
      setTimeout(function () { p = kit.mkPlot(kit.$('.plotbox', n), { xmin: -4, xmax: 4, ymin: -2, ymax: 10 }); refresh(); }, 0);
      kit.$$('input[type=text]', n).forEach(function (i) { kit.on(i, 'input', refresh); });
      kit.on(sel, 'change', refresh);
      kit.$$('[data-preset]', n).forEach(function (b) { kit.on(b, 'click', function () {
        var s = b.dataset.preset.split('~'); kit.$('[data-fx]', n).value = s[0]; kit.$('[data-gx]', n).value = s[1] === '0' ? 'x+2' : s[1]; kit.$('[data-n="a"]', n).value = s[2]; kit.$('[data-n="b"]', n).value = s[3]; sel.value = s[4]; refresh();
      }); });
      return n;
    }
  });

  /* ================= 4. FORGÁSTEST ================= */
  var KNAME = { kup: 'forgáskúp', henger: 'forgáshenger', gomb: 'gömb' };
  MO.simDefs.push({
    id: 'forgastest', title: 'Forgástest térfogata',
    desc: 'Forgasd az f(x) görbét az x tengely körül, és számold a térfogatot V = π∫f²dx képlettel; korongos közelítés, kúp, henger és gömb összevetése. A forgástest térfogata a 2024-től érvényes vizsgakövetelményben nem szerepel külön, kiegészítő anyag.',
    group: 'analízis', topic: 'fuggvenyek', sub: 'integral', formulas: ['f-forgastest-terfogat'],
    build: function (kit) {
      var n = kit.el('<div><p class="dim">Kiegészítő anyag: a forgástest térfogata a 2024-től érvényes vizsgakövetelményben nem szerepel külön.</p>' + kit.fnInput('2x/3') +
        '<div class="row">' + kit.numIn('a', 'ettől (a)', '0') + kit.numIn('b', 'eddig (b)', '3') + '</div>' + kit.slider('n', 'n (a korongok száma)', 1, 40, 1, 8) +
        '<div class="row" style="margin:6px 0 10px"><button class="btn sm" type="button" data-preset="2x/3~0~3~8">kúp (r = 2, m = 3)</button>' +
        '<button class="btn sm" type="button" data-preset="2~0~3~8">henger (r = 2, m = 3)</button>' +
        '<button class="btn sm" type="button" data-preset="sqrt(4-x^2)~-2~2~12">gömb (r = 2)</button>' +
        '<button class="btn sm" type="button" data-preset="x^2~0~2~10">parabola forgatva</button></div>' +
        '<div class="lab">a forgástest (húzd el, hogy forogjon)</div>' + kit.plotBox(280) + '<div class="lab" style="margin-top:10px">a síkbeli görbe és a korongok metszete</div>' + kit.plotBox(220) + '<div class="out"></div></div>');
      var p2 = null, p3 = null, inn = kit.$('[data-in="n"]', n);
      function refresh() {
        if (!p2 || !p3) return;
        var o = kit.$('.out', n), v = kit.readNums(n), nn = parseInt(inn.value, 10);
        try {
          var c = compileX(kit, kit.$('[data-fx]', n).value), f = c.f;
          if (!v) throw { cas: true, message: 'A határok legyenek számok.' };
          if (!(v.b > v.a)) throw { cas: true, message: 'Legyen a < b.' };
          if (v.b - v.a > 100) throw { cas: true, message: 'Az intervallum legfeljebb 100 egység hosszú lehet.' };
          var R = M.analizis2Forgas(f, v.a, v.b, nn);
          if (!R.ok) throw { cas: true, message: R.reason === 'neg' ? 'Most f(x) ≥ 0 kell az egész intervallumon (itt negatív értéket is felvesz).' : 'Az f függvény az intervallum egyes pontjain nincs értelmezve, vagy a térfogat nem számolható. Válassz másik intervallumot.' };
          var T = function (x) { return kit.tnum(x, 4); }, rr = R.max || 1, i, st = [[v.a, 0]];
          p3.setScene(M.analizis2ForgasScene(f, v.a, v.b, nn, 20));
          for (i = 0; i < nn; i++) st.push([v.a + i * R.dx, R.rad[i]], [v.a + (i + 1) * R.dx, R.rad[i]]); st.push([v.b, 0]);
          var padx = (v.b - v.a) * 0.1, ext = Math.max(rr * 1.25, (v.b - v.a) * 0.4, 0.1);
          p2.set({ xmin: v.a - padx, xmax: v.b + padx, ymin: -ext, ymax: ext, equal: true, curves: [{ f: f }, { f: function (x) { return -f(x); } }],
            polys: [{ pts: st, fill: true, alpha: 0.18, color: 1 }], points: [], segments: [], labels: [], circles: [], fills: [] });
          var kn = R.known, relErr = Math.abs(R.Vn - R.V) / Math.max(R.V, 1e-12), cmp = '', ksteps = [];
          if (kn) {
            var formula = kn.kind === 'kup' ? '\\dfrac{\\pi r^2 m}{3}' : kn.kind === 'henger' ? '\\pi r^2 m' : '\\dfrac{4}{3}\\pi r^3';
            cmp = '<div class="lab">összevetés az ismert képlettel: ' + KNAME[kn.kind] + '</div>' + kit.tex('r=' + T(kn.r) + (kn.kind === 'gomb' ? '' : ',\\ m=' + T(kn.m)) + ':\\quad V=' + formula + eqs(kn.V, 4) + T(kn.V)) +
              (Math.abs(kn.V - R.V) < 1e-6 * Math.max(1, kn.V) ? msg('ok', 'A numerikus integrál egyezik az ismert képlettel.') : msg('bad', 'Eltérés az ismert képlettől.'));
            ksteps.push('**Ismert eset:** ez egy ' + KNAME[kn.kind] + ' ($r=' + T(kn.r) + '$' + (kn.kind === 'gomb' ? '' : ', $m=' + T(kn.m) + '$') + '), térfogata $' + formula + eqs(kn.V, 4) + T(kn.V) + '$, ugyanazt kapjuk.');
          }
          o.innerHTML = '<div class="ans">' + kit.tex('V=\\pi\\displaystyle\\int_{' + T(v.a) + '}^{' + T(v.b) + '} f^2(x)\\,dx' + eqs(R.V, 4) + T(R.V)) + '</div>' +
            kit.steps([
              '**Korongok:** az $x$ tengely körül forgatva az $x$ helyen $r=f(x)$ sugarú kör keletkezik, területe $\\pi f^2(x)$.',
              '**Térfogat:** a vékony korongok térfogatát összegezve $V=\\pi\\displaystyle\\int_a^b f^2(x)\\,dx$; itt $\\displaystyle\\int f^2\\,dx' + eqs(R.integral, 4) + T(R.integral) + '$, tehát $V' + eqs(R.V, 4) + T(R.V) + '$.',
              '**Korongos közelítés $n=' + nn + '$ szelettel:** $V_n=\\pi\\sum f(x_i^*)^2\\,\\Delta x' + eqs(R.Vn, 4) + T(R.Vn) + '$ (a sugár a szelet felezőpontjában vett $f$-érték, $\\Delta x=' + T(R.dx) + '$). Eltérés: $' + kit.num(relErr * 100, 3) + '\\,\\%$.'
            ].concat(ksteps)) + cmp;
        } catch (e) { o.innerHTML = msg('bad', cerr(e)); }
      }
      setTimeout(function () {
        p2 = kit.mkPlot(kit.$$('.plotbox', n)[1], { xmin: -1, xmax: 4, ymin: -3, ymax: 3, equal: true });
        p3 = kit.mkPlot3d(kit.$$('.plotbox', n)[0], { points: [], edges: [], faces: [] }, { az: 0.5, el: 0.35 });
        kit.bindSliders(n, refresh);
      }, 0);
      kit.$$('input[type=text]', n).forEach(function (i) { kit.on(i, 'input', refresh); });
      kit.$$('[data-preset]', n).forEach(function (b) { kit.on(b, 'click', function () {
        var s = b.dataset.preset.split('~'); kit.$('[data-fx]', n).value = s[0]; kit.$('[data-n="a"]', n).value = s[1]; kit.$('[data-n="b"]', n).value = s[2]; inn.value = s[3]; inn.dispatchEvent(new Event('input'));
      }); });
      return n;
    }
  });
})(typeof window !== 'undefined' ? window : globalThis);
