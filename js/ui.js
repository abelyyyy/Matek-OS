/* MATEK OS – felület: útvonalak, nézetek, feladatkártya, eszközök. */
(function () {
  'use strict';
  var MO = window.MO, C = MO.cas, st = MO.store, M = MO.models, Q = MO.Q;
  var main = document.getElementById('main'), plots = [], session = {}, cleanups = [];

  /* ---------- segédek ---------- */
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function tex(s, disp) {
    try { return window.katex.renderToString(s, { displayMode: !!disp, throwOnError: false, strict: false }); }
    catch (e) { return '<code>' + esc(s) + '</code>'; }
  }
  function md(s) {
    var open = false; /* a **félkövér** rész képletet is tartalmazhat, ezért a jelölőket sorban váltjuk */
    return String(s).split(/(\$\$[^$]+\$\$|\$[^$]+\$)/).map(function (p) {
      if (/^\$\$/.test(p)) return '<div class="mathblock">' + tex(p.slice(2, -2), true) + '</div>';
      if (/^\$/.test(p)) return tex(p.slice(1, -1));
      /* a String.raw szövegekben a sortörés betű szerinti „\\n”; a képleteken kívül ezt is sortörésnek vesszük */
      return esc(p.replace(/\\n/g, '\n')).replace(/\*\*/g, function () { open = !open; return open ? '<strong>' : '</strong>'; }).replace(/\n/g, '<br>');
    }).join('') + (open ? '</strong>' : '');
  }
  function el(html) { var d = document.createElement('div'); d.innerHTML = html.trim(); return d.firstChild; }
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
  function on(node, ev, fn) { node.addEventListener(ev, fn); }
  function seed() { return (Date.now() + Math.floor(Math.random() * 1e6)) >>> 0; }
  function subKey(tid, sid) { return tid + '/' + sid; }
  function cont(tid, sid) { return (tid === 'alapok' ? MO.content[sid] : MO.content[tid + '/' + sid]) || null; }
  function worked(tid, sid) { return !!cont(tid, sid); }
  function workedSubs() { var o = []; MO.topics.forEach(function (t) { t.subs.forEach(function (s) { if (worked(t.id, s.id)) o.push({ t: t, s: s }); }); }); return o; }
  function subOptions() { return workedSubs().map(function (x) { return '<option value="' + x.s.id + '">' + esc((x.t.num ? x.t.num + '. ' : '') + x.s.title) + '</option>'; }).join(''); }
  function subState(tid, sid) { return st.get('state')[subKey(tid, sid)] || 'none'; }
  var STATE = { none: 'nem kezdtem el', learning: 'tanulom', done: 'kész' };
  function coverage() {
    var w = 0, n = 0; MO.topics.forEach(function (t) { t.subs.forEach(function (s) { n++; if (worked(t.id, s.id)) w++; }); });
    return { worked: w, total: n };
  }
  function mkPlot(box, opts) {
    var cv = $('canvas', box), p = MO.plot.create(cv, opts); plots.push(p);
    $$('.zoom button', box).forEach(function (b) { on(b, 'click', function () { p.zoom(b.dataset.z === 'in' ? 1 / 1.4 : 1.4); }); });
    return p;
  }
  function plotBox(h) { return '<div class="plotbox"' + (h ? ' style="height:' + h + 'px"' : '') + '><canvas aria-label="Grafikon"></canvas><div class="zoom"><button type="button" data-z="in" aria-label="Nagyítás">+</button><button type="button" data-z="out" aria-label="Kicsinyítés">−</button></div></div>'; }
  function slider(id, label, min, max, step, val) {
    return '<label class="f"><span>' + esc(label) + ' <b data-out="' + id + '"></b></span><input type="range" data-in="' + id + '" min="' + min + '" max="' + max + '" step="' + step + '" value="' + val + '"></label>';
  }
  function bindSliders(root, fn) {
    function read() { var v = {}; $$('[data-in]', root).forEach(function (i) { v[i.dataset.in] = parseFloat(i.value); var o = $('[data-out="' + i.dataset.in + '"]', root); if (o) o.textContent = MO.num(v[i.dataset.in], 4); }); return v; }
    $$('[data-in]', root).forEach(function (i) { on(i, 'input', function () { fn(read()); }); });
    fn(read());
  }

  /* ---------- oszlopdiagram (SVG) ---------- */
  function barSvg(c) {
    var W = 340, H = 210, L = 34, B = 26, T = 22, mx = Math.max.apply(null, c.values), top = Math.max(10, Math.ceil(mx / 10) * 10);
    var ph = H - B - T, pw = W - L - 8, n = c.values.length, bw = pw / n, s = '<svg class="chart" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + esc(c.title) + '">';
    s += '<text x="' + L + '" y="12">' + esc(c.title) + '</text>';
    for (var v = 0; v <= top; v += 5) {
      var y = T + ph - v / top * ph, major = v % 10 === 0;
      s += '<line x1="' + L + '" x2="' + (W - 8) + '" y1="' + y + '" y2="' + y + '" stroke="var(--line)" stroke-width="' + (major ? 1 : 0.5) + '"/>';
      if (major) s += '<text x="' + (L - 6) + '" y="' + (y + 4) + '" text-anchor="end">' + v + '</text>';
    }
    c.values.forEach(function (val, i) {
      var h = val / top * ph, x = L + i * bw + bw * 0.2;
      s += '<rect x="' + x + '" y="' + (T + ph - h) + '" width="' + bw * 0.6 + '" height="' + h + '" fill="var(--fg)"/>';
      s += '<text x="' + (L + i * bw + bw / 2) + '" y="' + (H - 8) + '" text-anchor="middle">' + esc(c.labels[i]) + '</text>';
    });
    return s + '<line x1="' + L + '" x2="' + (W - 8) + '" y1="' + (T + ph) + '" y2="' + (T + ph) + '" stroke="var(--dim)"/></svg>';
  }

  /* ---------- feladatkártya ---------- */
  function logError(task, given) {
    var errs = st.get('errors');
    errs.unshift({ id: seed(), t: Date.now(), gen: task.gen, seed: task.seed, sub: task.sub, topic: task.topic, title: task.title, given: String(given).slice(0, 80), type: '', note: '' });
    if (errs.length > 400) errs.length = 400;
    st.set('errors', errs);
  }
  function countTask(task, ok) {
    var t = st.get('tasks'), r = t[task.gen] || { ok: 0, bad: 0 }; if (ok) r.ok++; else r.bad++; r.last = ok ? 1 : 0; t[task.gen] = r; st.set('tasks', t);
  }
  /* opts: { exam: nincs tipp, egy próbálkozás; onResult(ok); onNext() } */
  function taskCard(task, opts) {
    opts = opts || {};
    var node = el('<div class="card task"><div class="row" style="justify-content:space-between;margin-bottom:8px"><span class="lab">' + esc(task.title) + '</span><span class="tag">' + task.level + '. szint</span></div>' +
      '<div class="md q">' + md(task.q) + '</div>' + (task.chart ? barSvg(task.chart) : '') +
      (task.answer.type === 'choice' ? '<form class="choices" style="margin-top:14px"><input type="hidden"><div role="group" aria-label="Válaszlehetőségek">' + task.answer.options.map(function (o, i) { return '<button class="btn opt md" type="button" data-opt="' + i + '">' + md(o) + '</button>'; }).join('') + '</div><button class="btn pri" type="submit" style="margin-top:10px">Ellenőrzés</button></form>' :
      '<form class="row" style="margin-top:14px;align-items:stretch"><input type="text" autocomplete="off" autocapitalize="off" spellcheck="false" inputmode="text" aria-label="Válasz" placeholder="' + (task.answer.type === 'set' ? 'Értékek pontosvesszővel, pl. 2; 3 (vagy: nincs)' : 'Válasz') + '" style="flex:1;min-width:150px"><button class="btn pri" type="submit">Ellenőrzés</button></form>') +
      '<div class="msg" role="status" aria-live="polite"></div><div class="row tools" style="margin-top:12px"></div><div class="extra"></div></div>');
    var input = $('input', node), msg = $('.msg', node), tools = $('.tools', node), extra = $('.extra', node), tipN = 0, done = false, logged = false;
    $$('[data-opt]', node).forEach(function (b) { on(b, 'click', function () { if (done) return; input.value = b.dataset.opt; $$('[data-opt]', node).forEach(function (x) { x.setAttribute('aria-pressed', x === b); }); }); });
    function given() { return task.answer.type === 'choice' ? (task.answer.options[+input.value] || '').replace(/\$/g, '') : input.value; }
    function showSol() {
      if ($('.sol', extra)) return;
      extra.appendChild(el('<div class="sol"><ol class="steps">' + task.sol.map(function (s) { return '<li class="md">' + md(s) + '</li>'; }).join('') + '</ol><div class="ans md"><span class="lab">Megoldás</span><br>' + tex(task.ansTex) + '</div></div>'));
    }
    function finish(ok) {
      done = true; input.disabled = true; $('button[type=submit]', node).disabled = true; tools.innerHTML = '';
      $$('[data-opt]', node).forEach(function (b) { b.disabled = true; if (+b.dataset.opt === task.answer.correct && !opts.exam) b.classList.add('good'); });
      if (opts.onResult) opts.onResult(ok);
      if (opts.onNext) { var b = el('<button class="btn" type="button">' + (opts.nextLabel || 'Következő feladat') + '</button>'); on(b, 'click', opts.onNext); tools.appendChild(b); b.focus(); }
    }
    if (!opts.exam) {
      var bt = el('<button class="btn sm" type="button">Tipp</button>'), bs = el('<button class="btn sm" type="button">Megoldás</button>');
      on(bt, 'click', function () {
        tipN++; extra.appendChild(el('<div class="md dim" style="margin-top:10px"><span class="lab">' + tipN + '. tipp</span><br>' + md(tipN === 1 ? task.tip1 : task.tip2) + '</div>'));
        if (tipN >= 2) bt.disabled = true;
      });
      on(bs, 'click', function () {
        showSol(); if (!done) { if (!logged) { logError(task, '(megnézett megoldás)'); logged = true; countTask(task, false); } msg.className = 'msg dim'; msg.textContent = 'A megoldást megnézted, ez a feladat a hibanaplóba került.'; finish(false); }
      });
      tools.appendChild(bt); tools.appendChild(bs);
    }
    on($('form', node), 'submit', function (e) {
      e.preventDefault(); if (done) return;
      var r = C.check(task.answer, input.value);
      if (r.msg) { msg.className = 'msg bad'; msg.textContent = r.msg; return; }
      if (r.ok) {
        msg.className = 'msg ok'; msg.textContent = opts.exam ? 'Rögzítve.' : 'Helyes.';
        if (!logged) countTask(task, true);
        if (!opts.exam) showSol(); finish(true);
      } else {
        if (!logged) { logError(task, given()); logged = true; countTask(task, false); }
        if (opts.exam) { msg.className = 'msg dim'; msg.textContent = 'Rögzítve.'; finish(false); }
        else if (task.answer.type === 'choice') { msg.className = 'msg bad'; msg.textContent = 'Ez nem jó.'; showSol(); finish(false); }
        else { msg.className = 'msg bad'; msg.textContent = 'Ez nem jó. Próbáld újra, kérj tippet, vagy nézd meg a megoldást.'; input.select(); }
      }
    });
    return node;
  }

  /* ---------- eszközök (szimulációk) ---------- */
  var SIMS = [
    { id: 'fuggveny', title: 'Függvényábrázoló', desc: 'Saját képlet, érték, derivált, gyökök, határozott integrál.', sub: null },
    { id: 'tortek', title: 'Törtek összeadása', desc: 'Közös nevezőre hozás sávokkal szemléltetve.', sub: 'tortek', w: 'fracbar' },
    { id: 'szazalek', title: 'Százalékos változások', desc: 'Két egymás utáni változás szorzótényezői.', sub: 'szazalek', w: 'percent' },
    { id: 'hatvanyfv', title: 'Hatványok', desc: 'Az alap változtatásával a hatványértékek és a grafikon.', sub: 'hatvany', w: 'powplot' },
    { id: 'azonossag', title: 'Azonosság-ellenőrző', desc: 'Két kifejezés összehasonlítása véletlen pontokon.', sub: 'betus', w: 'expand' },
    { id: 'atvalto', title: 'Mértékegység-átváltó', desc: 'Hossz, terület, térfogat, tömeg, idő, sebesség.', sub: 'mertek', w: 'unit' },
    { id: 'aranyossag', title: 'Egyenes és fordított arányosság', desc: 'Grafikon és értéktáblázat az arányossági tényezővel.', sub: 'aranyossag', w: 'prop' },
    { id: 'diagram', title: 'Diagramok', desc: 'Oszlopdiagram, mutatók és a kördiagram szögei.', sub: 'abra', w: 'barchart' },
    { id: 'masodfoku', title: 'Másodfokú egyenlet megoldó', desc: 'Diszkrimináns, gyökök, Viète-formulák, gyöktényezős alak és csúcspont lépésenként.', group: 'számoló', w: 'quad' },
    { id: 'rendszer', title: 'Egyenletrendszer-megoldó', desc: 'Kétismeretlenes lineáris egyenletrendszer az egyenlő együtthatók módszerével.', group: 'számoló', w: 'lin2' },
    { id: 'derivalo', title: 'Deriváló és integráló', desc: 'Első és második derivált képlettel, ellenőrzés differenciahányadossal, határozott integrál.', group: 'számoló', w: 'deriv' },
    { id: 'tablazat', title: 'Értéktáblázat és előjeltábla', desc: 'Függvényértékek, zérushelyek, a függvény és a derivált előjele.', group: 'számoló', w: 'table' },
    { id: 'kamat', title: 'Kamat és törlesztés', desc: 'Kamatos kamat évről évre és egyenletes törlesztőrészlet táblázattal.', group: 'számoló', w: 'interest' }
  ];
  var W = {};
  W.fracbar = function () {
    var n = el('<div>' + slider('a', 'első számláló', 0, 12, 1, 1) + slider('b', 'első nevező', 1, 12, 1, 2) + slider('c', 'második számláló', 0, 12, 1, 1) + slider('d', 'második nevező', 1, 12, 1, 3) + '<div class="out"></div></div>');
    function bar(k, den, cls) { var s = '<div class="fracbar">'; for (var i = 0; i < den; i++) s += '<i class="' + (i < k ? cls : '') + '"></i>'; return s + '</div>'; }
    bindSliders(n, function (v) {
      var a = Math.min(v.a, v.b), c = Math.min(v.c, v.d), r = M.fracSum(a, v.b, c, v.d), over = r.top > r.lcm;
      $('.out', n).innerHTML = '<div class="md">' + tex('\\dfrac{' + a + '}{' + v.b + '}') + '</div>' + bar(a, v.b, 'on') + '<div class="md">' + tex('\\dfrac{' + c + '}{' + v.d + '}') + '</div>' + bar(c, v.d, 'on2') +
        '<div class="md">Közös nevező: ' + tex('[' + v.b + ';' + v.d + '] = ' + r.lcm) + '</div><div class="fracbar">' + (function () { var s = ''; for (var i = 0; i < r.lcm; i++) s += '<i class="' + (i < r.x ? 'on' : i < r.x + r.y ? 'on2' : '') + '"></i>'; return s; })() + '</div>' +
        '<div class="mathblock">' + tex('\\dfrac{' + a + '}{' + v.b + '} + \\dfrac{' + c + '}{' + v.d + '} = \\dfrac{' + r.x + '}{' + r.lcm + '} + \\dfrac{' + r.y + '}{' + r.lcm + '} = \\dfrac{' + r.top + '}{' + r.lcm + '}' + (r.res.d !== r.lcm || r.res.n !== r.top ? ' = ' + Q.tex(r.res) : ''), true) + '</div>' +
        (over ? '<p class="dim">Az összeg nagyobb egynél, ezért a sáv túlcsordulna: ' + tex(Q.tex(r.res) + ' > 1') + '.</p>' : '') +
        (a !== v.a || c !== v.c ? '<p class="dim">A számlálót a nevezőhöz igazítottam, hogy a tört legfeljebb 1 legyen.</p>' : '');
    });
    return n;
  };
  W.percent = function () {
    var n = el('<div>' + slider('a', 'kiinduló érték', 1000, 50000, 500, 24000) + slider('p', 'első változás (%)', -60, 100, 1, 25) + slider('q', 'második változás (%)', -60, 100, 1, -20) + '<div class="out"></div><div class="row"><button class="btn sm" type="button" data-set="20,-20">+20%, majd −20%</button><button class="btn sm" type="button" data-set="25,-20">+25%, majd −20%</button><button class="btn sm" type="button" data-set="-50,100">−50%, majd +100%</button></div></div>');
    function upd(v) {
      var r = M.percentChain(v.a, [v.p, v.q]), mx = Math.max(v.a, r.steps[0].value, r.value);
      function line(lbl, val) { return '<div class="lab" style="margin-top:8px">' + lbl + ' · ' + MO.big(Math.round(val * 100) / 100) + '</div><div class="bar" style="height:10px"><i style="width:' + (val / mx * 100) + '%"></i></div>'; }
      $('.out', n).innerHTML = line('kiinduló', v.a) + line('első változás után', r.steps[0].value) + line('második változás után', r.value) +
        '<div class="mathblock">' + tex(MO.tnum(r.steps[0].factor, 4) + ' \\cdot ' + MO.tnum(r.steps[1].factor, 4) + ' = ' + MO.tnum(r.factor, 4) + '\\quad\\Rightarrow\\quad ' + (r.total >= 0 ? '+' : '') + MO.tnum(r.total, 2) + '\\%', true) + '</div>' +
        '<p class="dim">A százaléklábak összege ' + MO.num(v.p + v.q) + '%, a tényleges változás ' + MO.num(r.total, 2) + '%.</p>';
    }
    bindSliders(n, upd);
    $$('[data-set]', n).forEach(function (b) { on(b, 'click', function () { var s = b.dataset.set.split(','); $('[data-in=p]', n).value = s[0]; $('[data-in=q]', n).value = s[1]; $('[data-in=p]', n).dispatchEvent(new Event('input')); }); });
    return n;
  };
  W.powplot = function () {
    var n = el('<div>' + slider('a', 'alap (a)', 0.2, 4, 0.1, 2) + plotBox(280) + '<div class="tblwrap out" style="margin-top:10px"></div></div>'), p = null;
    setTimeout(function () {
      p = mkPlot($('.plotbox', n), { xmin: -4, xmax: 4, ymin: -1, ymax: 9, curves: [{ f: function (x) { return Math.pow(2, x); } }] });
      bindSliders(n, function (v) {
        p.set({ curves: [{ f: function (x) { return Math.pow(v.a, x); } }], points: [{ x: 0, y: 1, label: '(0; 1)' }, { x: 1, y: v.a, label: '(1; a)' }] });
        var hd = '', row = ''; [-2, -1, 0, 1, 2, 3].forEach(function (k) { hd += '<th>' + tex('a^{' + k + '}') + '</th>'; row += '<td>' + MO.num(Math.pow(v.a, k), 4) + '</td>'; });
        $('.out', n).innerHTML = '<table class="t"><tr>' + hd + '</tr><tr>' + row + '</tr></table><p class="dim" style="margin-top:8px">' + (v.a > 1 ? 'Ha az alap nagyobb egynél, a hatvány a kitevővel együtt nő.' : v.a < 1 ? 'Ha az alap 0 és 1 közé esik, a hatvány a kitevő növelésével csökken.' : 'Az 1 minden hatványa 1.') + '</p>';
      });
    }, 0);
    return n;
  };
  W.expand = function () {
    var n = el('<div><label class="f"><span>első kifejezés</span><input type="text" value="(x+3)^2" autocomplete="off" autocapitalize="off" spellcheck="false"></label><label class="f"><span>második kifejezés</span><input type="text" value="x^2+6x+9" autocomplete="off" autocapitalize="off" spellcheck="false"></label><div class="out" role="status" aria-live="polite"></div><div class="row"><button class="btn sm" type="button" data-set="(a-b)^2|a^2-2a*b+b^2">kéttagú négyzete</button><button class="btn sm" type="button" data-set="a^3-b^3|(a-b)(a^2+a*b+b^2)">köbök különbsége</button><button class="btn sm" type="button" data-set="(x+2)^2|x^2+4">gyakori hiba</button></div></div>');
    var ins = $$('input', n);
    function upd() {
      var o = $('.out', n);
      try {
        var A = C.parse(ins[0].value), B = C.parse(ins[1].value), r = C.equivalent(A, B);
        var s = '<div class="mathblock">' + tex(C.toTex(A) + (r.equal ? ' = ' : ' \\ne ') + C.toTex(B), true) + '</div>';
        s += '<p class="msg ' + (r.equal ? 'ok' : 'bad') + '">' + (r.equal ? 'A két kifejezés ' + r.valid + ' véletlen ponton megegyezik: azonosak.' : r.domainDiff && !r.mismatch ? 'Az értékek egyeznek, de a két kifejezés értelmezési tartománya eltér.' : 'A két kifejezés nem azonos (' + r.mismatch + ' pontban eltér).') + '</p>';
        if (!r.equal) { var vs = C.vars(A).concat(C.vars(B)), env = {}; vs.forEach(function (k) { env[k] = 1; }); s += '<p class="dim">Például minden változó helyére 1-et írva: ' + MO.num(C.evalAst(A, env)) + ' és ' + MO.num(C.evalAst(B, env)) + '.</p>'; }
        o.innerHTML = s;
      } catch (e) { o.innerHTML = '<p class="msg bad">' + esc(e.cas ? e.message : 'Ezt nem tudom értelmezni.') + '</p>'; }
    }
    ins.forEach(function (i) { on(i, 'input', upd); });
    $$('[data-set]', n).forEach(function (b) { on(b, 'click', function () { var s = b.dataset.set.split('|'); ins[0].value = s[0]; ins[1].value = s[1]; upd(); }); });
    upd(); return n;
  };
  W.unit = function () {
    var cats = Object.keys(M.units), n = el('<div><label class="f"><span>mennyiség</span><select data-k="cat">' + cats.map(function (c) { return '<option>' + c + '</option>'; }).join('') + '</select></label><label class="f"><span>érték</span><input type="text" inputmode="decimal" value="72" data-k="val" autocomplete="off"></label><div class="row" style="align-items:flex-end"><label class="f" style="flex:1"><span>miből</span><select data-k="from"></select></label><label class="f" style="flex:1"><span>mibe</span><select data-k="to"></select></label></div><div class="out" role="status" aria-live="polite"></div><div class="row"><button class="btn sm" type="button" data-set="sebesség|72|km/h|m/s">km/h → m/s</button><button class="btn sm" type="button" data-set="terület|1|m²|cm²">m² → cm²</button><button class="btn sm" type="button" data-set="térfogat|112000|cm³ (ml)|dm³ (liter)">cm³ → liter</button></div></div>');
    var cat = $('[data-k=cat]', n), from = $('[data-k=from]', n), to = $('[data-k=to]', n), val = $('[data-k=val]', n);
    function fill(f, t) { var us = Object.keys(M.units[cat.value].u), o = us.map(function (u) { return '<option>' + u + '</option>'; }).join(''); from.innerHTML = o; to.innerHTML = o; from.value = f || us[us.length - 1]; to.value = t || us[0]; }
    function upd() {
      var v; try { v = C.evaluate(val.value, {}); } catch (e) { v = NaN; }
      var r = M.convert(cat.value, v, from.value, to.value), f = M.convert(cat.value, 1, from.value, to.value);
      $('.out', n).innerHTML = isFinite(r) ? '<div class="ans"><span class="lab">eredmény</span><br><strong>' + MO.big(parseFloat(r.toPrecision(12))) + ' ' + esc(to.value) + '</strong></div><p class="dim" style="margin-top:8px">Váltószám: 1 ' + esc(from.value) + ' = ' + MO.big(parseFloat(f.toPrecision(12))) + ' ' + esc(to.value) + '</p>' : '<p class="msg bad">Írj be egy számot.</p>';
    }
    on(cat, 'change', function () { fill(); upd(); }); [from, to].forEach(function (s) { on(s, 'change', upd); }); on(val, 'input', upd);
    $$('[data-set]', n).forEach(function (b) { on(b, 'click', function () { var s = b.dataset.set.split('|'); cat.value = s[0]; fill(s[2], s[3]); val.value = s[1]; upd(); }); });
    cat.value = 'sebesség'; fill('km/h', 'm/s'); upd(); return n;
  };
  W.prop = function () {
    var n = el('<div>' + slider('k', 'arányossági tényező (k)', 0.5, 12, 0.5, 6) + plotBox(300) + '<div class="legend"><span><i style="border-color:var(--c1)"></i>egyenes: y = kx (folytonos)</span><span><i style="border-color:var(--c2);border-top-style:dashed"></i>fordított: y = k/x (szaggatott)</span></div><div class="tblwrap out" style="margin-top:10px"></div></div>');
    setTimeout(function () {
      var p = mkPlot($('.plotbox', n), { xmin: -1, xmax: 9, ymin: -1, ymax: 13, curves: [] });
      bindSliders(n, function (v) {
        p.set({ curves: [{ f: function (x) { return v.k * x; } }, { f: function (x) { return x > 0 ? v.k / x : NaN; } }] });
        var xs = [1, 2, 4, 8], r = function (lbl, f) { return '<tr><td>' + lbl + '</td>' + xs.map(function (x) { return '<td>' + MO.num(f(x), 3) + '</td>'; }).join('') + '</tr>'; };
        $('.out', n).innerHTML = '<table class="t"><tr><th>x</th>' + xs.map(function (x) { return '<th>' + x + '</th>'; }).join('') + '</tr>' + r('y = kx', function (x) { return v.k * x; }) + r('y : x', function () { return v.k; }) + r('y = k/x', function (x) { return v.k / x; }) + r('x · y', function () { return v.k; }) + '</table><p class="dim" style="margin-top:8px">Egyenes arányosságnál a hányados, fordított arányosságnál a szorzat állandó.</p>';
      });
    }, 0);
    return n;
  };
  W.barchart = function () {
    var lab = ['H', 'K', 'Sze', 'Cs', 'P'], init = [35, 20, 45, 30, 50];
    var n = el('<div><div class="chartbox"></div>' + lab.map(function (l, i) { return slider('v' + i, l, 0, 60, 5, init[i]); }).join('') + '<div class="tblwrap out"></div></div>');
    bindSliders(n, function (v) {
      var vals = lab.map(function (l, i) { return v['v' + i]; }), s = M.stats(vals);
      $('.chartbox', n).innerHTML = barSvg({ title: 'Kölcsönzések egy héten (db)', labels: lab, values: vals });
      $('.out', n).innerHTML = '<table class="t"><tr><th>összeg</th><th>átlag</th><th>medián</th><th>terjedelem</th><th>szórás</th></tr><tr><td>' + s.sum + '</td><td>' + MO.num(s.mean, 2) + '</td><td>' + MO.num(s.median, 2) + '</td><td>' + s.range + '</td><td>' + MO.num(s.sd, 2) + '</td></tr></table>' +
        '<table class="t" style="margin-top:10px"><tr><th>kördiagram</th>' + lab.map(function (l) { return '<th>' + l + '</th>'; }).join('') + '</tr><tr><td>szög</td>' + s.angles.map(function (a) { return '<td>' + MO.num(a, 1) + '°</td>'; }).join('') + '</tr><tr><td>arány</td>' + vals.map(function (x) { return '<td>' + (s.sum ? MO.num(x / s.sum * 100, 1) : 0) + '%</td>'; }).join('') + '</tr></table>';
    });
    return n;
  };
  function simFuggveny() {
    var n = el('<div><label class="f"><span>f(x) – folytonos vonal</span><input type="text" data-f="0" value="x^2-2x-3" autocomplete="off" autocapitalize="off" spellcheck="false"></label><label class="f"><span>g(x) – szaggatott vonal (nem kötelező)</span><input type="text" data-f="1" value="" autocomplete="off" autocapitalize="off" spellcheck="false"></label>' + plotBox(340) +
      '<div class="row" style="margin-top:10px"><button class="btn sm" type="button" data-pre="x^2-2x-3|">másodfokú</button><button class="btn sm" type="button" data-pre="sin(x)|cos(x)">sin és cos</button><button class="btn sm" type="button" data-pre="2^x|log(2;x)">exp és log</button><button class="btn sm" type="button" data-pre="1/(x-1)|">törtfüggvény</button><button class="btn sm" type="button" data-pre="|x-2|-1|">abszolútérték</button><button class="btn sm" type="button" data-act="reset">alaphelyzet</button></div>' +
      '<div class="out" style="margin-top:14px"></div><div class="grid" style="margin-top:4px"><label class="f"><span>x helyettesítési érték</span><input type="text" data-k="x0" value="2" inputmode="decimal" autocomplete="off"></label><label class="f"><span>integrál alsó határa</span><input type="text" data-k="a" value="0" inputmode="decimal" autocomplete="off"></label><label class="f"><span>integrál felső határa</span><input type="text" data-k="b" value="3" inputmode="decimal" autocomplete="off"></label></div><div class="out2"></div>' +
      '<p class="dim mono" style="margin-top:14px">Beírás: 2x, x^2, sqrt(x), |x|, sin(x), cos(x), tg(x), ln(x), lg(x), log(2;x), exp(x), pi, e. Tizedesvessző használható.</p></div>');
    var ins = $$('[data-f]', n), p = null, DEF = { xmin: -6, xmax: 6, ymin: -5, ymax: 5 };
    function val(k) { try { return C.evaluate($('[data-k=' + k + ']', n).value, {}); } catch (e) { return NaN; } }
    function upd() {
      var curves = [], fills = [], out = '', out2 = '', f0 = null, ast0 = null;
      ins.forEach(function (inp, i) {
        if (!inp.value.trim()) { curves.push(null); return; }
        try {
          var c = C.compile(inp.value), bad = c.vars.filter(function (v) { return v !== 'x'; });
          if (bad.length) throw { cas: true, message: 'Csak x szerepelhet változóként.' };
          curves.push({ f: c.f }); if (i === 0) { f0 = c.f; ast0 = c.ast; }
        } catch (e) { curves.push(null); out += '<p class="msg bad">' + (i ? 'g' : 'f') + '(x): ' + esc(e.cas ? e.message : 'nem értelmezhető') + '</p>'; }
      });
      if (f0) {
        var o = p.opts, d = null; try { d = C.diff(ast0, 'x'); } catch (e) {}
        var rts = C.roots(f0, o.xmin, o.xmax, { df: d ? function (x) { return C.evalAst(d, { x: x }); } : null });
        out += '<div class="mathblock">' + tex('f(x) = ' + C.toTex(ast0) + (d ? '\\qquad f\'(x) = ' + C.toTex(d) : ''), true) + '</div>';
        out += '<p><span class="lab">zérushelyek a látható tartományban</span><br>' + (rts.length ? rts.map(function (r) { return 'x = ' + MO.num(r, 5); }).join(', &nbsp; ') : 'nincs') + '</p>';
        var x0 = val('x0'), a = val('a'), b = val('b');
        if (isFinite(x0)) out2 += '<p class="md">' + tex('f(' + MO.tnum(x0) + ') = ' + (isFinite(f0(x0)) ? MO.tnum(f0(x0), 6) : '\\text{nincs értelmezve}') + (d && isFinite(C.evalAst(d, { x: x0 })) ? ',\\qquad f\'(' + MO.tnum(x0) + ') = ' + MO.tnum(C.evalAst(d, { x: x0 }), 6) : '')) + '</p>';
        if (isFinite(a) && isFinite(b)) {
          var I = C.integrate(f0, a, b);
          out2 += '<p class="md">' + tex('\\displaystyle\\int_{' + MO.tnum(a) + '}^{' + MO.tnum(b) + '} f(x)\\,dx ' + (I.ok ? '\\approx ' + MO.tnum(I.value, 6) : '\\text{ nem számolható: a függvény a tartományban nincs mindenhol értelmezve}')) + (I.ok ? ' <span class="dim mono">&nbsp; becsült hiba: ' + I.err.toExponential(1).replace('.', ',') + '</span>' : '') + '</p>';
          if (I.ok) fills.push({ f: f0, a: Math.min(a, b), b: Math.max(a, b), color: 1 });
        }
        var pts = rts.map(function (r) { return { x: r, y: 0 }; }); if (isFinite(x0) && isFinite(f0(x0))) pts.push({ x: x0, y: f0(x0), label: 'f(' + MO.num(x0) + ')' });
        p.set({ curves: curves, fills: fills, points: pts });
      } else p.set({ curves: curves, fills: [], points: [] });
      $('.out', n).innerHTML = out; $('.out2', n).innerHTML = out2;
    }
    setTimeout(function () {
      var o = { curves: [], onview: function () { clearTimeout(upd.t); upd.t = setTimeout(upd, 120); } }; for (var k in DEF) o[k] = DEF[k];
      p = mkPlot($('.plotbox', n), o);
      $$('input', n).forEach(function (i) { on(i, 'input', upd); });
      $$('[data-pre]', n).forEach(function (b) { on(b, 'click', function () { var s = b.dataset.pre.split('|'); ins[0].value = s.slice(0, s.length - 1).join('|'); ins[1].value = s[s.length - 1]; upd(); }); });
      on($('[data-act=reset]', n), 'click', function () { p.set(DEF); upd(); });
      upd();
    }, 0);
    return n;
  }

  /* ---------- számoló eszközök ---------- */
  function numIn(k, label, val) { return '<label class="f" style="flex:1;min-width:84px"><span>' + label + '</span><input type="text" inputmode="text" data-n="' + k + '" value="' + val + '" autocomplete="off" autocapitalize="off" spellcheck="false"></label>'; }
  function readNums(root) { var o = {}, bad = false; $$('[data-n]', root).forEach(function (i) { var v; try { v = C.evaluate(i.value, {}); } catch (e) { v = NaN; } if (!isFinite(v)) bad = true; o[i.dataset.n] = v; }); return bad ? null : o; }
  function tn(v, d) { return v < 0 ? '(' + MO.tnum(v, d) + ')' : MO.tnum(v, d); }
  function isInt(v) { return v === Math.round(v) && Math.abs(v) < 1e9; }
  function exact(v) { /* egész együtthatókból számolt hányados pontos tört alakja, ha kis nevezőjű */
    for (var d = 1; d <= 1000; d++) { var n = v * d; if (Math.abs(n - Math.round(n)) < 1e-9) return Q.tex(Q.make(Math.round(n), d)); }
    return MO.tnum(v, 6);
  }
  function polyTex(cs, names) { /* együtthatók listájából rendezett alak */
    var s = '';
    cs.forEach(function (c, i) {
      if (c === 0) return; var nm = names[i], ab = Math.abs(c);
      s += (s ? (c < 0 ? ' - ' : ' + ') : (c < 0 ? '-' : '')) + (ab === 1 && nm ? '' : MO.tnum(ab, 6)) + nm;
    });
    return s || '0';
  }
  W.quad = function () {
    var n = el('<div><div class="row">' + numIn('a', 'a', '1') + numIn('b', 'b', '-5') + numIn('c', 'c', '6') + '</div><div class="row" style="margin-bottom:12px"><button class="btn sm" type="button" data-set="1|-5|6">két racionális gyök</button><button class="btn sm" type="button" data-set="1|-2|-1">irracionális gyökök</button><button class="btn sm" type="button" data-set="1|-6|9">kettős gyök</button><button class="btn sm" type="button" data-set="2|-4|5">nincs valós gyök</button></div><div class="out"></div>' + plotBox(280) + '</div>'), p = null;
    function upd() {
      var v = readNums(n), o = $('.out', n);
      if (!v) { o.innerHTML = '<p class="msg bad">Mindhárom mezőbe számot írj.</p>'; return; }
      var r = M.quad(v.a, v.b, v.c), st2 = [];
      if (r.kind === 'notquad') { o.innerHTML = '<p class="msg bad">Ha a = 0, az egyenlet nem másodfokú.</p>'; if (p) p.set({ curves: [], points: [] }); return; }
      st2.push('Az egyenlet: $' + polyTex([v.a, v.b, v.c], ['x^2', 'x', '']) + ' = 0$, ahol $a = ' + MO.tnum(v.a) + '$, $b = ' + MO.tnum(v.b) + '$, $c = ' + MO.tnum(v.c) + '$.');
      st2.push('Diszkrimináns: $D = b^2 - 4ac = ' + tn(v.b) + '^2 - 4 \\cdot ' + tn(v.a) + ' \\cdot ' + tn(v.c) + ' = ' + MO.tnum(r.D, 6) + '$.');
      if (r.kind === 'none') st2.push('Mivel $D < 0$, az egyenletnek nincs valós gyöke.');
      else {
        st2.push((r.kind === 'one' ? 'Mivel $D = 0$, egy (kétszeres) valós gyök van' : 'Mivel $D > 0$, két különböző valós gyök van') + ': $x_{1,2} = \\dfrac{-b \\pm \\sqrt{D}}{2a} = \\dfrac{' + MO.tnum(-v.b) + ' \\pm \\sqrt{' + MO.tnum(r.D, 6) + '}}{' + MO.tnum(2 * v.a) + '}$');
        if (r.rational) st2.push(r.kind === 'one' ? '$x_1 = x_2 = ' + Q.tex(r.q1) + '$' : '$\\sqrt{' + r.D + '} = ' + Math.sqrt(r.D) + '$, ezért $x_1 = ' + Q.tex(r.q1) + '$ és $x_2 = ' + Q.tex(r.q2) + '$.');
        else if (r.sq) st2.push((r.sq.k > 1 ? '$\\sqrt{' + r.D + '} = ' + r.sq.k + '\\sqrt{' + r.sq.m + '}$, ezért ' : '') + '$x_{1,2} = \\dfrac{' + MO.tnum(-v.b) + ' \\pm ' + (r.sq.k > 1 ? r.sq.k : '') + '\\sqrt{' + r.sq.m + '}}{' + MO.tnum(2 * v.a) + '}$, közelítőleg $x_1 \\approx ' + MO.tnum(r.x1, 4) + '$ és $x_2 \\approx ' + MO.tnum(r.x2, 4) + '$.');
        else st2.push('$x_1 \\approx ' + MO.tnum(r.x1, 6) + '$ és $x_2 \\approx ' + MO.tnum(r.x2, 6) + '$.');
        st2.push('Ellenőrzés a Viète-formulákkal: $x_1 + x_2 = -\\dfrac{b}{a} = ' + exact(r.sum) + '$ és $x_1 x_2 = \\dfrac{c}{a} = ' + exact(r.prod) + '$; a kapott gyökökkel $' + MO.tnum(r.x1 + r.x2, 6) + '$ és $' + MO.tnum(r.x1 * r.x2, 6) + '$.');
        if (r.rational) { var fac = function (q) { return q.n === 0 ? 'x' : '\\left(x ' + (q.n > 0 ? '- ' : '+ ') + Q.tex(Q.make(Math.abs(q.n), q.d)) + '\\right)'; }; st2.push('Gyöktényezős alak: $' + (v.a === 1 ? '' : v.a === -1 ? '-' : MO.tnum(v.a)) + fac(r.q1) + fac(r.q2) + '$.'); }
      }
      st2.push('A parabola csúcspontja: $\\left(-\\dfrac{b}{2a};\\ c - \\dfrac{b^2}{4a}\\right) = \\left(' + exact(r.vertex.x) + ';\\ ' + exact(r.vertex.y) + '\\right)$, a parabola ' + (v.a > 0 ? 'felfelé nyílik, itt minimuma van.' : 'lefelé nyílik, itt maximuma van.'));
      o.innerHTML = '<ol class="steps">' + st2.map(function (x) { return '<li class="md">' + md(x) + '</li>'; }).join('') + '</ol>';
      if (p) {
        var pts = [{ x: r.vertex.x, y: r.vertex.y }]; if (r.kind !== 'none') { pts.push({ x: r.x1, y: 0 }); pts.push({ x: r.x2, y: 0 }); }
        var w = Math.max(3, r.kind === 'none' ? 3 : (r.x2 - r.x1) * 0.9 + 2), hy = Math.max(3, Math.abs(r.vertex.y) * 1.4 + 1);
        p.set({ xmin: r.vertex.x - w, xmax: r.vertex.x + w, ymin: -hy, ymax: hy, curves: [{ f: function (x) { return v.a * x * x + v.b * x + v.c; } }], points: pts });
      }
    }
    setTimeout(function () { p = mkPlot($('.plotbox', n), { curves: [] }); upd(); }, 0);
    $$('[data-n]', n).forEach(function (i) { on(i, 'input', upd); });
    $$('[data-set]', n).forEach(function (b) { on(b, 'click', function () { var sv = b.dataset.set.split('|'); $$('[data-n]', n).forEach(function (i, k) { i.value = sv[k]; }); upd(); }); });
    return n;
  };
  W.lin2 = function () {
    var n = el('<div><div class="lab" style="margin-bottom:6px">első egyenlet: a₁x + b₁y = c₁</div><div class="row">' + numIn('a1', 'a₁', '2') + numIn('b1', 'b₁', '3') + numIn('c1', 'c₁', '12') + '</div><div class="lab" style="margin-bottom:6px">második egyenlet: a₂x + b₂y = c₂</div><div class="row">' + numIn('a2', 'a₂', '1') + numIn('b2', 'b₂', '-1') + numIn('c2', 'c₂', '1') + '</div><div class="row" style="margin-bottom:12px"><button class="btn sm" type="button" data-set="2|3|12|1|-1|1">egy megoldás</button><button class="btn sm" type="button" data-set="1|2|3|2|4|6">végtelen sok megoldás</button><button class="btn sm" type="button" data-set="1|2|3|2|4|7">nincs megoldás</button></div><div class="out"></div>' + plotBox(260) + '</div>'), p = null;
    function upd() {
      var v = readNums(n), o = $('.out', n);
      if (!v) { o.innerHTML = '<p class="msg bad">Minden mezőbe számot írj.</p>'; return; }
      var r = M.lin2(v.a1, v.b1, v.c1, v.a2, v.b2, v.c2), e1 = polyTex([v.a1, v.b1], ['x', 'y']) + ' = ' + MO.tnum(v.c1), e2 = polyTex([v.a2, v.b2], ['x', 'y']) + ' = ' + MO.tnum(v.c2), st2 = [];
      st2.push('Az egyenletrendszer: $\\begin{cases} ' + e1 + ' \\\\ ' + e2 + ' \\end{cases}$');
      st2.push('Az $y$ kiejtéséhez az első egyenlet szorzója $' + MO.tnum(v.b2) + '$, a másodiké $' + MO.tnum(v.b1) + '$; a szorzás után a két egyenletet kivonjuk egymásból: $\\left(' + tn(v.a1) + ' \\cdot ' + tn(v.b2) + ' - ' + tn(v.a2) + ' \\cdot ' + tn(v.b1) + '\\right) x = ' + tn(v.c1) + ' \\cdot ' + tn(v.b2) + ' - ' + tn(v.c2) + ' \\cdot ' + tn(v.b1) + '$, azaz $' + MO.tnum(r.D, 6) + ' \\cdot x = ' + MO.tnum(r.Dx, 6) + '$.');
      if (r.kind === 'one') {
        st2.push('Ebből $x = ' + exact(r.x) + '$.');
        st2.push('Ugyanígy az $x$ kiejtésével: $' + MO.tnum(r.D, 6) + ' \\cdot y = ' + MO.tnum(r.Dy, 6) + '$, tehát $y = ' + exact(r.y) + '$.');
        st2.push('Ellenőrzés: az első egyenlet bal oldala $' + MO.tnum(v.a1 * r.x + v.b1 * r.y, 6) + '$, a másodiké $' + MO.tnum(v.a2 * r.x + v.b2 * r.y, 6) + '$; ezek megegyeznek a jobb oldalakkal. A megoldás: $(x; y) = \\left(' + exact(r.x) + ';\\ ' + exact(r.y) + '\\right)$.');
      } else if (r.kind === 'inf') st2.push('A bal oldalon $0 \\cdot x$ áll, a jobb oldalon is $0$: a két egyenlet ugyanazt az összefüggést adja, ezért végtelen sok megoldás van (a két egyenes egybeesik).');
      else st2.push('A bal oldalon $0 \\cdot x$ áll, a jobb oldalon nem nulla: ez ellentmondás, az egyenletrendszernek nincs megoldása (a két egyenes párhuzamos).');
      o.innerHTML = '<ol class="steps">' + st2.map(function (x) { return '<li class="md">' + md(x) + '</li>'; }).join('') + '</ol>';
      if (p) {
        var line = function (a, b, c) { return b !== 0 ? { f: function (x) { return (c - a * x) / b; } } : null; }, cx = r.kind === 'one' ? r.x : 0, cy = r.kind === 'one' ? r.y : 0, segs = [];
        [[v.a1, v.b1, v.c1], [v.a2, v.b2, v.c2]].forEach(function (q) { if (q[1] === 0 && q[0] !== 0) segs.push({ a: [q[2] / q[0], cy - 100], b: [q[2] / q[0], cy + 100] }); });
        p.set({ xmin: cx - 6, xmax: cx + 6, ymin: cy - 4.5, ymax: cy + 4.5, curves: [line(v.a1, v.b1, v.c1), line(v.a2, v.b2, v.c2)], segments: segs, points: r.kind === 'one' ? [{ x: r.x, y: r.y, label: 'megoldás' }] : [] });
      }
    }
    setTimeout(function () { p = mkPlot($('.plotbox', n), { curves: [] }); upd(); }, 0);
    $$('[data-n]', n).forEach(function (i) { on(i, 'input', upd); });
    $$('[data-set]', n).forEach(function (b) { on(b, 'click', function () { var sv = b.dataset.set.split('|'); $$('[data-n]', n).forEach(function (i, k) { i.value = sv[k]; }); upd(); }); });
    return n;
  };
  function fnInput(val) { return '<label class="f"><span>f(x)</span><input type="text" data-fx value="' + val + '" autocomplete="off" autocapitalize="off" spellcheck="false"></label>'; }
  function readFn(root) {
    var c = C.compile($('[data-fx]', root).value);
    if (c.vars.filter(function (v) { return v !== 'x'; }).length) throw { cas: true, message: 'Csak x szerepelhet változóként.' };
    return c;
  }
  W.deriv = function () {
    var n = el('<div>' + fnInput('x^3-3x') + '<div class="row">' + numIn('x', 'ellenőrzés helye (x₀)', '2') + numIn('a', 'integrál alsó határa', '0') + numIn('b', 'integrál felső határa', '2') + '</div><div class="row" style="margin-bottom:12px"><button class="btn sm" type="button" data-set="x^3-3x">polinom</button><button class="btn sm" type="button" data-set="x*exp(-x)">szorzat</button><button class="btn sm" type="button" data-set="(x^2+1)/(x-1)">hányados</button><button class="btn sm" type="button" data-set="sin(2x)^2">összetett</button><button class="btn sm" type="button" data-set="sqrt(x^2+1)">gyökös</button></div><div class="out"></div>' + plotBox(280) + '<div class="legend"><span><i style="border-color:var(--c1)"></i>f (folytonos)</span><span><i style="border-color:var(--c2);border-top-style:dashed"></i>f′ (szaggatott)</span></div></div>'), p = null;
    function upd() {
      var o = $('.out', n), v = readNums(n);
      try {
        var c = readFn(n), d1 = C.diff(c.ast, 'x'), d2 = C.diff(d1, 'x'), h = '<div class="mathblock">' + tex('f(x) = ' + C.toTex(c.ast), true) + '</div><div class="mathblock">' + tex("f'(x) = " + C.toTex(d1), true) + '</div><div class="mathblock">' + tex("f''(x) = " + C.toTex(d2), true) + '</div>';
        if (v) {
          var x0 = v.x, hh = 1e-5, num = (c.f(x0 + hh) - c.f(x0 - hh)) / (2 * hh), sym = C.evalAst(d1, { x: x0 });
          h += '<p class="md"><span class="lab">ellenőrzés differenciahányadossal</span><br>' + (isFinite(sym) && isFinite(num) ? tex("f'(" + MO.tnum(x0) + ') = ' + MO.tnum(sym, 6) + ',\\qquad \\dfrac{f(x_0 + h) - f(x_0 - h)}{2h} \\approx ' + MO.tnum(num, 6) + '\\quad (h = 10^{-5})') : 'Ezen a helyen a derivált nincs értelmezve.') + '</p>';
          var I = C.integrate(c.f, v.a, v.b);
          h += '<p class="md"><span class="lab">határozott integrál (numerikusan)</span><br>' + tex('\\displaystyle\\int_{' + MO.tnum(v.a) + '}^{' + MO.tnum(v.b) + '} f(x)\\,dx ' + (I.ok ? '\\approx ' + MO.tnum(I.value, 6) : '\\text{ nem számolható ezen a tartományon}')) + (I.ok ? ' <span class="dim mono">&nbsp; becsült hiba: ' + I.err.toExponential(1).replace('.', ',') + '</span>' : '') + '</p>';
        }
        o.innerHTML = h + '<p class="dim">A derivált képlete szabályalapú szimbolikus deriválással készül; az egyszerűsítés nem teljes, ezért a te alakod ettől eltérhet, és mégis helyes lehet. Két alak azonosságát az Azonosság-ellenőrzővel döntheted el.</p>';
        if (p) p.set({ curves: [{ f: c.f }, { f: function (x) { return C.evalAst(d1, { x: x }); } }], points: v && isFinite(c.f(v.x)) ? [{ x: v.x, y: c.f(v.x), label: 'x₀' }] : [] });
      } catch (e) { o.innerHTML = '<p class="msg bad">' + esc(e.cas ? e.message : 'Ezt nem tudom értelmezni.') + '</p>'; }
    }
    setTimeout(function () { p = mkPlot($('.plotbox', n), { curves: [] }); upd(); }, 0);
    $$('input', n).forEach(function (i) { on(i, 'input', upd); });
    $$('[data-set]', n).forEach(function (b) { on(b, 'click', function () { $('[data-fx]', n).value = b.dataset.set; upd(); }); });
    return n;
  };
  W.table = function () {
    var n = el('<div>' + fnInput('x^3-3x') + '<div class="row">' + numIn('a', 'ettől', '-3') + numIn('b', 'eddig', '3') + numIn('s', 'lépésköz', '0,5') + '</div><div class="out"></div></div>');
    function signRow(name, tab) { return '<tr><td>' + name + '</td>' + tab.map(function (t) { return '<td>' + t.sign + '</td>'; }).join('') + '</tr>'; }
    function upd() {
      var o = $('.out', n), v = readNums(n);
      try {
        var c = readFn(n);
        if (!v || !(v.b > v.a) || !(v.s > 0)) throw { cas: true, message: 'A tartomány és a lépésköz legyen értelmes (ettől < eddig, lépésköz > 0).' };
        var steps = Math.round((v.b - v.a) / v.s); if (steps > 60) throw { cas: true, message: 'Legfeljebb 60 lépés fér a táblázatba; növeld a lépésközt.' };
        var d1 = C.diff(c.ast, 'x'), df = function (x) { return C.evalAst(d1, { x: x }); }, hd = '', row = '', row2 = '';
        for (var i = 0; i <= steps; i++) { var x = v.a + i * v.s; x = parseFloat(x.toPrecision(12)); hd += '<th>' + MO.num(x, 4) + '</th>'; row += '<td>' + (isFinite(c.f(x)) ? MO.num(c.f(x), 4) : '–') + '</td>'; row2 += '<td>' + (isFinite(df(x)) ? MO.num(df(x), 4) : '–') + '</td>'; }
        var r0 = C.roots(c.f, v.a, v.b, { df: df }), r1 = C.roots(df, v.a, v.b), fmtR = function (r) { return r.length ? r.map(function (x) { return MO.num(x, 5); }).join('; ') : 'nincs'; };
        var t0 = M.signTable(c.f, v.a, v.b, r0), t1 = M.signTable(df, v.a, v.b, r1), iv = function (t) { return '<th>]' + MO.num(t.from, 4) + '; ' + MO.num(t.to, 4) + '[</th>'; };
        o.innerHTML = '<div class="mathblock">' + tex('f(x) = ' + C.toTex(c.ast) + "\\qquad f'(x) = " + C.toTex(d1), true) + '</div><div class="lab">értéktáblázat</div><div class="tblwrap"><table class="t"><tr><th>x</th>' + hd + '</tr><tr><td>f(x)</td>' + row + "</tr><tr><td>f′(x)</td>" + row2 + '</tr></table></div>' +
          '<p style="margin-top:14px"><span class="lab">zérushelyek a tartományban</span><br>' + fmtR(r0) + '</p><div class="lab">a függvény előjele</div><div class="tblwrap"><table class="t"><tr><th>intervallum</th>' + t0.map(iv).join('') + '</tr>' + signRow('f', t0) + '</table></div>' +
          '<p style="margin-top:14px"><span class="lab">a derivált zérushelyei</span><br>' + fmtR(r1) + '</p><div class="lab">monotonitás</div><div class="tblwrap"><table class="t"><tr><th>intervallum</th>' + t1.map(iv).join('') + '</tr>' + signRow('f′', t1) + '<tr><td>f</td>' + t1.map(function (t) { return '<td>' + (t.sign === '+' ? 'nő' : t.sign === '−' ? 'csökken' : t.sign === '0' ? 'állandó' : '?') + '</td>'; }).join('') + '</tr></table></div>' +
          '<p class="dim" style="margin-top:10px">A zérushelyeket numerikus módszer keresi (előjelváltás és felezés), ezért közelítő értékek. A szakadási helyeket a tábla nem jelöli külön.</p>';
      } catch (e) { o.innerHTML = '<p class="msg bad">' + esc(e.cas ? e.message : 'Ezt nem tudom értelmezni.') + '</p>'; }
    }
    $$('input', n).forEach(function (i) { on(i, 'input', upd); }); upd(); return n;
  };
  W.interest = function () {
    var n = el('<div><div class="row" role="group" aria-label="Mód" style="margin-bottom:12px"><button class="btn sm" type="button" data-mode="c" aria-pressed="true">kamatos kamat</button><button class="btn sm" type="button" data-mode="a" aria-pressed="false">törlesztés</button></div>' + slider('P', 'tőke / hitel (Ft)', 100000, 10000000, 100000, 1000000) + slider('r', 'éves kamatláb (%)', 0, 25, 0.5, 5) + slider('n', 'évek száma', 1, 30, 1, 10) + '<div class="out"></div>' + plotBox(240) + '</div>'), p = null, mode = 'c', last = null;
    function upd(v) {
      last = v = v || last; var o = $('.out', n), rows = '', f;
      if (mode === 'c') {
        var c = M.compound(v.P, v.r, v.n);
        c.rows.forEach(function (r) { if (v.n <= 12 || r.n % Math.ceil(v.n / 10) === 0 || r.n === v.n) rows += '<tr><td>' + r.n + '</td><td>' + MO.big(Math.round(r.value)) + '</td></tr>'; });
        o.innerHTML = '<div class="mathblock">' + tex('T_n = T_0 \\cdot q^n = ' + MO.tbig(v.P) + ' \\cdot ' + MO.tnum(c.q, 4) + '^{' + v.n + '} \\approx ' + MO.tbig(Math.round(c.final)) + '\\ \\text{Ft}', true) + '</div><p class="dim">Kamat összesen: ' + MO.big(Math.round(c.interest)) + ' Ft. A szorzótényező q = 1 + p/100 = ' + MO.num(c.q, 4) + '.</p><div class="tblwrap"><table class="t"><tr><th>év vége</th><th>érték (Ft)</th></tr>' + rows + '</table></div>';
        f = function (x) { return x >= 0 && x <= v.n ? v.P * Math.pow(c.q, x) : NaN; };
        if (p) p.set({ xmin: -v.n * 0.08, xmax: v.n * 1.05, ymin: -c.final * 0.08, ymax: c.final * 1.1, curves: [{ f: f }], points: [{ x: v.n, y: c.final }] });
      } else {
        var a = M.annuity(v.P, v.r, v.n);
        a.rows.forEach(function (r) { if (v.n <= 12 || r.k % Math.ceil(v.n / 10) === 0 || r.k === v.n) rows += '<tr><td>' + r.k + '</td><td>' + MO.big(Math.round(r.interest)) + '</td><td>' + MO.big(Math.round(r.principal)) + '</td><td>' + MO.big(Math.round(r.balance)) + '</td></tr>'; });
        o.innerHTML = '<div class="ans"><span class="lab">éves törlesztőrészlet</span><br><strong>' + MO.big(Math.round(a.payment)) + ' Ft</strong></div><p class="dim" style="margin-top:8px">Összes befizetés: ' + MO.big(Math.round(a.total)) + ' Ft, ebből kamat: ' + MO.big(Math.round(a.total - v.P)) + ' Ft. Minden év végén a tartozás kamatozik, utána csökken a befizetett részlettel; a részlet akkora, hogy az utolsó év végére a tartozás éppen elfogy.</p><div class="tblwrap"><table class="t"><tr><th>év</th><th>kamat</th><th>tőkerész</th><th>tartozás</th></tr>' + rows + '</table></div>';
        if (p) p.set({ xmin: -v.n * 0.08, xmax: v.n * 1.05, ymin: -v.P * 0.08, ymax: v.P * 1.1, curves: [], segments: a.rows.map(function (r, i) { return { a: [i, i ? a.rows[i - 1].balance : v.P], b: [r.k, r.balance], w: 2 }; }), points: [{ x: 0, y: v.P }] });
      }
    }
    setTimeout(function () { p = mkPlot($('.plotbox', n), { curves: [], interactive: false }); bindSliders(n, upd); }, 0);
    $$('[data-mode]', n).forEach(function (b) { on(b, 'click', function () { mode = b.dataset.mode; $$('[data-mode]', n).forEach(function (x) { x.setAttribute('aria-pressed', x === b); }); if (p) p.set({ segments: [], points: [] }); upd(); }); });
    return n;
  };

  /* „Tipikus helyzet” gombok a csúszkás eszközökhöz */
  function addPresets(w, list) {
    var orig = W[w];
    W[w] = function () {
      var n = orig(), row = el('<div class="row" style="margin-top:12px"></div>');
      list.forEach(function (pr) {
        var b = el('<button class="btn sm" type="button" data-preset>' + esc(pr[0]) + '</button>');
        on(b, 'click', function () { Object.keys(pr[1]).forEach(function (k) { var i = k === 'fx' ? $('[data-fx]', n) : $('[data-in="' + k + '"]', n) || $('[data-n="' + k + '"]', n); if (i) { i.value = pr[1][k]; i.dispatchEvent(new Event('input')); } }); });
        row.appendChild(b);
      });
      n.appendChild(row); return n;
    };
  }
  addPresets('fracbar', [['1/2 + 1/3', { a: 1, b: 2, c: 1, d: 3 }], ['5/6 + 3/8', { a: 5, b: 6, c: 3, d: 8 }], ['3/4 + 1/4', { a: 3, b: 4, c: 1, d: 4 }]]);
  addPresets('powplot', [['a = 2', { a: 2 }], ['a = 0,5', { a: 0.5 }], ['a = 3', { a: 3 }]]);
  addPresets('prop', [['k = 6', { k: 6 }], ['k = 12', { k: 12 }], ['k = 1,5', { k: 1.5 }]]);
  addPresets('barchart', [['egyenletes', { v0: 30, v1: 30, v2: 30, v3: 30, v4: 30 }], ['növekvő', { v0: 10, v1: 20, v2: 30, v3: 40, v4: 50 }], ['kiugró érték', { v0: 15, v1: 20, v2: 60, v3: 15, v4: 20 }]]);
  addPresets('interest', [['1 millió Ft, 5%, 10 év', { P: 1000000, r: 5, n: 10 }], ['5 millió Ft, 8%, 20 év', { P: 5000000, r: 8, n: 20 }]]);
  addPresets('table', [['harmadfokú polinom', { fx: 'x^3-3x', a: '-3', b: '3', s: '0,5' }], ['negyedfokú polinom', { fx: 'x^4-4x^2', a: '-3', b: '3', s: '0,5' }], ['szinusz', { fx: 'sin(x)', a: '0', b: '6', s: '0,5' }]]);

  /* ---------- szimulációs keret: a sims-*.js fájlok ezt a készletet kapják ---------- */
  function mkPlot3d(box, scene, opts) {
    var p = MO.plot3d.create($('canvas', box), scene, opts); plots.push(p);
    $$('.zoom button', box).forEach(function (b) { on(b, 'click', function () { p.zoom(b.dataset.z === 'in' ? 1 / 1.3 : 1.3); }); });
    return p;
  }
  var kit = {
    el: el, $: $, $$: $$, on: on, esc: esc, tex: tex, md: md,
    slider: slider, bindSliders: bindSliders, numIn: numIn, readNums: readNums, fnInput: fnInput, readFn: readFn,
    plotBox: plotBox, mkPlot: mkPlot, mkPlot3d: mkPlot3d, barSvg: barSvg,
    select: function (key, label, options, value) {
      return '<label class="f"><span>' + esc(label) + '</span><select data-sel="' + key + '">' + options.map(function (o) { var v = o.pop ? o[0] : o, t = o.pop ? o[1] : o; return '<option value="' + esc(v) + '"' + (String(v) === String(value) ? ' selected' : '') + '>' + esc(t) + '</option>'; }).join('') + '</select></label>';
    },
    legend: function (items) { /* items: [[színsorszám 0–3, 'felirat'], ...] – a vonalstílus a görbék sorrendjét követi */
      var st2 = ['solid', 'dashed', 'dotted', 'dashed'];
      return '<div class="legend">' + items.map(function (it) { return '<span><i style="border-color:var(--c' + (it[0] + 1) + ');border-top-style:' + st2[it[0] % 4] + '"></i>' + esc(it[1]) + '</span>'; }).join('') + '</div>';
    },
    steps: function (list) { return '<ol class="steps">' + list.map(function (x) { return '<li class="md">' + md(x) + '</li>'; }).join('') + '</ol>'; },
    num: MO.num, tnum: MO.tnum, big: MO.big, tbig: MO.tbig, exact: exact, C: C, M: M, Q: Q, rng: MO.rng,
    onCleanup: function (fn) { cleanups.push(fn); },
    reducedMotion: function () { return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches); }
  };
  SIMS.forEach(function (s) { if (!s.group) s.group = s.sub ? 'alapok' : 'függvények'; });
  (MO.simDefs || []).forEach(function (d) { SIMS.push(d); });
  var GROUPS = ['függvények', 'sorozatok', 'analízis', 'geometria', 'térgeometria', 'kombinatorika és valószínűség', 'statisztika és gráfok', 'számelmélet és logika', 'számoló', 'alapok'];

  /* ---------- nézetek ---------- */
  var V = {};
  function head(lab, title, sub) { return '<div class="lab">' + esc(lab) + '</div><h1>' + esc(title) + '</h1>' + (sub ? '<p class="dim">' + sub + '</p>' : ''); }

  V.kezdolap = function () {
    var cov = coverage(), last = st.get('last'), pl = st.get('placement'), errs = st.get('errors');
    var next = null;
    MO.topics.forEach(function (t) { t.subs.forEach(function (s) { if (!next && worked(t.id, s.id) && subState(t.id, s.id) !== 'done') next = { t: t, s: s }; }); });
    var h = head('emelt szintű matematika', 'MATEK OS');
    h += '<div class="grid" style="margin-top:22px">';
    h += '<div class="card"><div class="lab">Folytatás</div><h3 style="margin-top:8px">' + (last ? esc(last.title) : 'Kezdd a szintfelmérővel') + '</h3><p class="dim">' + (last ? 'Itt hagytad abba.' : 'Tizennégy rövid kérdés megmutatja, melyik alapozó résszel érdemes kezdened.') + '</p><a class="btn pri" href="#' + (last ? last.route : 'tema-alapok') + '">' + (last ? 'Folytatom' : 'Hol tartok?') + '</a></div>';
    h += '<div class="card"><div class="lab">Napi 10 perc</div><h3 style="margin-top:8px">Öt vegyes feladat</h3><p class="dim">' + (errs.length ? 'Előnyben azok a részek, ahol korábban hibáztál.' : 'A kidolgozott alfejezetekből, emelkedő nehézséggel.') + '</p><button class="btn" type="button" data-act="daily">Indítás</button></div>';
    if (next) h += '<div class="card"><div class="lab">Következő lépés</div><h3 style="margin-top:8px">' + esc(next.s.title) + '</h3><p class="dim">' + esc(next.t.title) + ' · ' + STATE[subState(next.t.id, next.s.id)] + '</p><a class="btn" href="#tema-' + next.t.id + '-' + next.s.id + '">Megnyitom</a></div>';
    h += '</div><h2>Haladás témakörönként</h2><div class="card">';
    MO.topics.forEach(function (t) {
      var d = 0; t.subs.forEach(function (s) { if (subState(t.id, s.id) === 'done') d++; });
      h += '<a href="#tema-' + t.id + '" style="display:block;padding:8px 0"><div class="row" style="justify-content:space-between;flex-wrap:nowrap;align-items:baseline"><span>' + esc(t.title) + '</span><span class="mono dim" style="flex:none">' + d + ' / ' + t.subs.length + '</span></div><div class="bar"><i style="width:' + (d / t.subs.length * 100) + '%"></i></div></a>';
    });
    h += '</div><h2>Lefedettség – őszintén</h2><div class="card"><p><strong>' + cov.worked + ' / ' + cov.total + '</strong> alfejezet van kidolgozva tananyaggal, példákkal és feladatokkal.</p><div class="bar"><i style="width:' + (cov.worked / cov.total * 100) + '%"></i></div><p class="dim" style="margin-top:12px">A térkép a 2024-től érvényes vizsgakövetelmény öt témakörét követi. Ami nincs kidolgozva, azt a Tananyag oldal külön jelöli.</p></div>';
    h += '<h2>Mentés</h2><div class="card"><p class="dim">A haladásod ezen az eszközön tárolódik. Másik eszközre a Mentés és a Betöltés viszi át.</p><a class="btn" href="#adatok">Mentés / Betöltés</a></div>';
    if (pl) h += '<p class="dim mono" style="margin-top:18px">Utolsó szintfelmérő: ' + new Date(pl.t).toLocaleDateString('hu-HU') + ' · ' + pl.score + ' / ' + pl.max + '</p>';
    main.innerHTML = h;
    on($('[data-act=daily]', main), 'click', function () { session.daily = dailySet(); location.hash = '#gyakorlas'; });
  };
  function dailySet() {
    var gens = MO.genList(), errs = st.get('errors'), weight = {};
    errs.slice(0, 60).forEach(function (e) { weight[e.sub] = (weight[e.sub] || 0) + 1; });
    var r = MO.rng(seed()), pool = r.shuffle(gens).sort(function (a, b) { return (weight[b.sub] || 0) - (weight[a.sub] || 0); });
    var pick = [], used = {};
    pool.forEach(function (g) { if (pick.length < 5 && !used[g.sub]) { used[g.sub] = 1; pick.push(g); } });
    return pick.sort(function (a, b) { return a.level - b.level; }).map(function (g) { return { gen: g.id, seed: seed() }; });
  }

  V.tananyag = function () {
    var h = head('tananyag', 'Témakörök', 'A számozás a vizsgakövetelmény pontjait jelöli.');
    MO.topics.forEach(function (t) {
      h += '<h2>' + (t.num ? t.num + '. ' : '') + esc(t.title) + '</h2><div class="list">';
      t.subs.forEach(function (s) {
        var w = worked(t.id, s.id), stt = subState(t.id, s.id);
        h += '<a href="#tema-' + t.id + '-' + s.id + '"><span class="n">' + esc(s.req || '–') + '</span><span class="t' + (w ? '' : ' dim') + '">' + esc(s.title) + '</span><span class="s">' + (w ? STATE[stt] : 'nincs kidolgozva') + '</span></a>';
      });
      h += '</div>';
    });
    main.innerHTML = h;
  };

  V.tema = function (arg) {
    var i = arg.indexOf('-'), tid = i < 0 ? arg : arg.slice(0, i), sid = i < 0 ? null : arg.slice(i + 1), f = MO.findSub(tid, sid);
    if (!f) return notFound();
    if (!sid || !f.sub) return topicPage(f.topic);
    var t = f.topic, s = f.sub, d = cont(tid, sid);
    var h = '<a class="lab" href="#tema-' + t.id + '">← ' + esc(t.title) + '</a><h1 style="margin-top:8px">' + esc(s.title) + '</h1>';
    if (!d) {
      var fl = MO.formulas.filter(function (x) { return x.topic === tid && x.sub === sid; });
      main.innerHTML = h + '<div class="card" style="margin-top:18px"><p>Ennek az alfejezetnek a tananyaga még nincs kidolgozva.</p><p class="dim">A vizsgakövetelményben: ' + esc(s.req) + ' ' + esc(s.title) + '.</p></div>' +
        (fl.length ? '<h2>Képletkártyák ehhez az alfejezethez</h2><div class="list">' + fl.map(function (x) { return '<a href="#keplet-' + x.id + '"><span class="t">' + esc(x.name) + '</span><span class="s">' + x.level + '</span></a>'; }).join('') + '</div>' : '');
      return;
    }
    st.set('last', { route: 'tema-' + tid + '-' + sid, title: s.title });
    var key = subKey(tid, sid), cur = subState(tid, sid);
    h += '<div class="row" style="margin:12px 0 4px" role="group" aria-label="Állapot">' + Object.keys(STATE).map(function (k) { return '<button class="btn sm" type="button" data-state="' + k + '" aria-pressed="' + (k === cur) + '">' + STATE[k] + '</button>'; }).join('') + '</div>';
    h += '<h2>Áttekintés</h2><div class="md"><p>' + md(d.intro) + '</p></div>';
    h += '<h2>Elmélet</h2>' + d.theory.map(function (x) { return '<div class="card"><h3>' + md(x.h) + (x.level === 'emelt' ? ' <span class="tag">emelt</span>' : '') + '</h3><div class="md">' + md(x.b) + '</div>' + (x.proof ? '<details class="proof"><summary>Bizonyítás vázlata</summary><div class="md">' + md(x.proof) + '</div></details>' : '') + '</div>'; }).join('');
    h += '<h2>Kidolgozott példák</h2>' + d.examples.map(function (e, k) { return '<div class="card"><div class="lab">' + (k + 1) + '. példa · ' + esc(e.t) + '</div><div class="md" style="margin-top:8px">' + md(e.p) + '</div><ol class="steps">' + e.steps.map(function (x) { return '<li class="md">' + md(x) + '</li>'; }).join('') + '</ol><div class="ans md"><span class="lab">Válasz</span><br>' + md(e.ans) + '</div></div>'; }).join('');
    var simList = d.widget ? SIMS.filter(function (x) { return x.w === d.widget; }) : (d.sims || []).map(function (id) { return SIMS.filter(function (x) { return x.id === id; })[0]; }).filter(Boolean), sim = simList[0];
    if (sim) h += '<h2>Próbáld ki</h2><div class="card"><div class="row" style="justify-content:space-between;margin-bottom:10px"><h3 style="margin:0">' + esc(sim.title) + '</h3><a class="tag" href="#sim-' + sim.id + '">megnyitás a Laborban</a></div><div id="widget"></div></div>' +
      (simList.length > 1 ? '<p class="dim">További eszközök: ' + simList.slice(1).map(function (x) { return '<a class="tag on" href="#sim-' + x.id + '">' + esc(x.title) + '</a>'; }).join(' ') + '</p>' : '');
    h += '<h2>Gyakori hibák</h2><div class="card"><ul class="plain">' + d.mistakes.map(function (x) { return '<li class="md">' + md(x) + '</li>'; }).join('') + '</ul></div>';
    h += '<h2>Önellenőrző feladatok</h2><div class="row" role="group" aria-label="Szint">' + [1, 2, 3].map(function (l) { return '<button class="btn sm" type="button" data-level="' + l + '" aria-pressed="' + (l === 1) + '">' + l + '. szint</button>'; }).join('') + '</div><div id="task" style="margin-top:12px"></div>';
    h += '<h2>Érettségi kapcsolat</h2><div class="card md">' + md(d.exam) + '</div>';
    var fs = MO.formulas.filter(function (x) { return x.topic === tid && x.sub === sid; });
    h += '<h2>Puskalap</h2><div class="cheat">' + d.cheat.map(function (x) { return '<div>' + tex(x, true) + '</div>'; }).join('') + '</div>' + (fs.length ? '<p style="margin-top:12px" class="dim">Képletkártyák: ' + fs.map(function (x) { return '<a class="tag on" href="#keplet-' + x.id + '">' + esc(x.name) + '</a>'; }).join(' ') + '</p>' : '');
    h += '<h2>Jegyzet</h2><textarea id="note" aria-label="Saját jegyzet" placeholder="Saját jegyzet ehhez az alfejezethez">' + esc(st.get('notes')[key] || '') + '</textarea>';
    var nx = t.subs[f.index + 1], pv = t.subs[f.index - 1];
    h += '<div class="row" style="justify-content:space-between;margin-top:26px">' + (pv ? '<a class="btn" href="#tema-' + tid + '-' + pv.id + '">← ' + esc(pv.title) + '</a>' : '<span></span>') + (nx ? '<a class="btn" href="#tema-' + tid + '-' + nx.id + '">' + esc(nx.title) + ' →</a>' : '') + '</div>';
    main.innerHTML = h;
    if (sim) { var wn; try { wn = sim.build ? sim.build(kit) : W[sim.w](); } catch (e) { wn = el('<p class="dim">Az eszköz a Laborban nyitható meg.</p>'); } $('#widget', main).appendChild(wn); }
    $$('[data-state]', main).forEach(function (b) { on(b, 'click', function () { var m = st.get('state'); m[key] = b.dataset.state; st.set('state', m); $$('[data-state]', main).forEach(function (x) { x.setAttribute('aria-pressed', x === b); }); }); });
    on($('#note', main), 'input', function (e) { var m = st.get('notes'); m[key] = e.target.value; st.set('notes', m); });
    function load(level) {
      var gl = MO.genList({ topic: tid, sub: sid, level: level }), box = $('#task', main); box.innerHTML = '';
      if (!gl.length) { box.innerHTML = '<p class="dim">Ezen a szinten ehhez az alfejezethez még nincs feladat.</p>'; return; }
      var g = gl[Math.floor(Math.random() * gl.length)];
      box.appendChild(taskCard(MO.makeTask(g.id, seed()), { nextLabel: 'Új feladat', onNext: function () { load(level); } }));
    }
    $$('[data-level]', main).forEach(function (b) { on(b, 'click', function () { $$('[data-level]', main).forEach(function (x) { x.setAttribute('aria-pressed', x === b); }); load(+b.dataset.level); }); });
    load(1);
  };
  function topicPage(t) {
    var h = '<a class="lab" href="#tananyag">← Tananyag</a><h1 style="margin-top:8px">' + (t.num ? t.num + '. ' : '') + esc(t.title) + '</h1>' + (t.note ? '<p class="dim">' + esc(t.note) + '</p>' : '');
    if (t.id === 'alapok') h += '<div class="card" id="quiz" style="margin-top:16px"><div class="lab">Hol tartok?</div><h3 style="margin-top:8px">Szintfelmérő</h3><p class="dim">Tizennégy kérdés, alfejezetenként kettő. Tipp és megoldás itt nincs; a végén megmutatom, mivel érdemes kezdened.</p><button class="btn pri" type="button" data-act="quiz">Kezdés</button></div>';
    h += '<div class="list" style="margin-top:16px">' + t.subs.map(function (s) { var w = worked(t.id, s.id); return '<a href="#tema-' + t.id + '-' + s.id + '"><span class="n">' + esc(s.req || '–') + '</span><span class="t' + (w ? '' : ' dim') + '">' + esc(s.title) + '</span><span class="s">' + (w ? STATE[subState(t.id, s.id)] : 'nincs kidolgozva') + '</span></a>'; }).join('') + '</div>';
    main.innerHTML = h;
    var qb = $('[data-act=quiz]', main); if (qb) on(qb, 'click', function () { runQuiz($('#quiz', main), t); });
  }
  function runQuiz(box, t) {
    var list = MO.placement, i = 0, res = {};
    function step() {
      if (i >= list.length) return finish();
      var task = MO.makeTask(list[i], seed());
      box.innerHTML = '<div class="row" style="justify-content:space-between"><span class="lab">Szintfelmérő</span><span class="mono dim">' + (i + 1) + ' / ' + list.length + '</span></div><div class="bar" style="margin:8px 0 14px"><i style="width:' + (i / list.length * 100) + '%"></i></div>';
      var card = taskCard(task, { exam: true, nextLabel: i + 1 < list.length ? 'Tovább' : 'Eredmény', onResult: function (ok) { res[task.sub] = (res[task.sub] || 0) + (ok ? 1 : 0); }, onNext: function () { i++; step(); } });
      card.style.margin = '0'; card.style.border = '0'; card.style.padding = '0'; box.appendChild(card);
      var skip = el('<button class="btn sm" type="button" style="margin-top:12px">Nem tudom, tovább</button>');
      on(skip, 'click', function () { res[task.sub] = res[task.sub] || 0; i++; step(); }); box.appendChild(skip);
      on($('form', card), 'submit', function () { setTimeout(function () { if ($('input', card).disabled) skip.remove(); }, 0); });
      $('input', card).focus();
    }
    function finish() {
      var score = 0; t.subs.forEach(function (s) { score += res[s.id] || 0; });
      st.set('placement', { t: Date.now(), res: res, score: score, max: list.length });
      var first = t.subs.filter(function (s) { return (res[s.id] || 0) < 2; })[0];
      box.innerHTML = '<div class="lab">Eredmény</div><h3 style="margin-top:8px">' + score + ' / ' + list.length + ' pont</h3><div class="list" style="margin:12px 0">' + t.subs.map(function (s) { var r = res[s.id] || 0; return '<a href="#tema-' + t.id + '-' + s.id + '"><span class="n">' + r + ' / 2</span><span class="t">' + esc(s.title) + '</span><span class="s">' + (r === 2 ? 'rendben' : r === 1 ? 'ismételd át' : 'ezzel kezdd') + '</span></a>'; }).join('') + '</div>' +
        (first ? '<a class="btn pri" href="#tema-' + t.id + '-' + first.id + '">Kezdem: ' + esc(first.title) + '</a>' : '<p>Az alapok rendben vannak. A többi témakör kidolgozása után ott folytathatod.</p>');
    }
    step();
  }

  function fSub(f) { var r = MO.findSub(f.topic, f.sub); return r && r.sub ? r.sub.title : f.sub; }
  function topicOpts() { return MO.topics.filter(function (t) { return MO.formulas.some(function (f) { return f.topic === t.id; }); }).map(function (t) { return '<option value="' + t.id + '">' + esc((t.num ? t.num + '. ' : '') + t.title) + '</option>'; }).join(''); }
  V.kepletter = function () {
    var keep = session.kf || {}; session.kf = keep;
    var h = head('képlettár', 'Képletek', MO.formulas.length + ' kártya, mindegyik kóddal ellenőrzött példával.') + '<div class="row" style="margin:14px 0"><input type="search" id="fq" placeholder="Szűrés név szerint" aria-label="Szűrés" style="flex:2;min-width:180px"><select id="ft" aria-label="Témakör" style="flex:2;min-width:180px"><option value="">minden témakör</option>' + topicOpts() + '</select><select id="fs" aria-label="Alfejezet" style="flex:2;min-width:160px"></select><select id="fv" aria-label="Szint" style="flex:1;min-width:120px"><option value="">minden szint</option><option value="közép">középszint</option><option value="emelt">emelt szint</option></select><button class="btn sm" type="button" id="ff" aria-pressed="false">kedvencek</button><a class="btn sm" href="#kartyak">kártyák</a></div><div id="fn" class="mono dim" style="margin-bottom:10px"></div><div id="fl"></div>';
    main.innerHTML = h;
    function subs() {
      var t = MO.topics.filter(function (x) { return x.id === $('#ft', main).value; })[0];
      $('#fs', main).innerHTML = '<option value="">minden alfejezet</option>' + (t ? t.subs.filter(function (s) { return MO.formulas.some(function (f) { return f.topic === t.id && f.sub === s.id; }); }).map(function (s) { return '<option value="' + s.id + '">' + esc(s.title) + '</option>'; }).join('') : '');
      $('#fs', main).disabled = !t;
    }
    function draw() {
      var q = norm($('#fq', main).value), t = $('#ft', main).value, s = $('#fs', main).value, lv = $('#fv', main).value, fav = st.get('fav'), only = $('#ff', main).getAttribute('aria-pressed') === 'true';
      session.kf = { q: $('#fq', main).value, t: t, s: s, lv: lv, only: only };
      var list = MO.formulas.filter(function (f) { return (!t || f.topic === t) && (!s || f.sub === s) && (!lv || f.level === lv) && (!q || norm(f.name).indexOf(q) >= 0) && (!only || fav[f.id]); });
      $('#fn', main).textContent = list.length + ' találat';
      $('#fl', main).innerHTML = list.length ? '<div class="grid">' + list.map(function (f) { return '<a class="card" href="#keplet-' + f.id + '"><div class="row" style="justify-content:space-between;flex-wrap:nowrap;align-items:baseline"><span class="lab">' + esc(fSub(f)) + '</span><span class="tag' + (fav[f.id] ? ' on' : '') + '" style="flex:none">' + (fav[f.id] ? 'kedvenc · ' : '') + f.level + '</span></div><h3 style="margin-top:8px">' + esc(f.name) + '</h3><div class="mathblock">' + tex(f.tex, true) + '</div></a>'; }).join('') + '</div>' : '<p class="dim">Nincs találat.</p>';
    }
    $('#fq', main).value = keep.q || ''; $('#ft', main).value = keep.t || ''; subs(); $('#fs', main).value = keep.s || ''; $('#fv', main).value = keep.lv || ''; if (keep.only) $('#ff', main).setAttribute('aria-pressed', 'true');
    on($('#fq', main), 'input', draw); on($('#ft', main), 'change', function () { subs(); draw(); }); on($('#fs', main), 'change', draw); on($('#fv', main), 'change', draw);
    on($('#ff', main), 'click', function (e) { e.target.setAttribute('aria-pressed', e.target.getAttribute('aria-pressed') !== 'true'); draw(); });
    draw();
  };
  V.keplet = function (id) {
    var f = MO.formulas.filter(function (x) { return x.id === id; })[0]; if (!f) return notFound();
    var fav = st.get('fav'), chk = st.get('checked'), wk = worked(f.topic, f.sub);
    var h = '<a class="lab" href="#kepletter">← Képlettár</a><h1 style="margin-top:8px">' + esc(f.name) + '</h1><p class="dim"><a href="#tema-' + f.topic + '-' + f.sub + '">' + esc(fSub(f)) + '</a> · ' + f.level + ' szint</p><div class="card"><div class="mathblock">' + tex(f.tex, true) + '</div></div>';
    h += '<div class="row" style="margin-bottom:14px"><button class="btn sm" type="button" data-t="fav" aria-pressed="' + !!fav[id] + '">kedvenc</button><button class="btn sm" type="button" data-t="checked" aria-pressed="' + !!chk[id] + '">ellenőriztem</button></div>';
    h += '<div class="card">' + (f.vars ? '<div class="lab">Jelölések</div><p class="md">' + md(f.vars) + '</p>' : '') + '<div class="lab">Mikor használható</div><p class="md">' + md(f.when) + '</p>' + (f.cond ? '<div class="lab">Megkötések</div><p class="md">' + md(f.cond) + '</p>' : '') + '<div class="lab">Példa</div><div class="md">' + md(f.ex) + '</div></div>';
    if (f.calc) h += '<h2>Számoló</h2><div class="card" id="calc">' + f.calc.inputs.map(function (i) { return '<label class="f"><span>' + esc(i[1]) + '</span><input type="text" inputmode="decimal" data-v="' + i[0] + '" value="' + MO.num(i[2]) + '" autocomplete="off"></label>'; }).join('') + '<div class="ans" role="status" aria-live="polite"></div></div>';
    main.innerHTML = h;
    $$('[data-t]', main).forEach(function (b) { on(b, 'click', function () { var k = b.dataset.t, m = st.get(k); if (m[id]) delete m[id]; else m[id] = 1; st.set(k, m); b.setAttribute('aria-pressed', !!m[id]); }); });
    if (f.calc) {
      var calc = function () {
        var env = {}, bad = false; $$('[data-v]', main).forEach(function (i) { try { env[i.dataset.v] = C.evaluate(i.value, {}); } catch (e) { bad = true; } if (!isFinite(env[i.dataset.v])) bad = true; });
        var r = bad ? NaN : C.evaluate(f.calc.expr, env);
        $('#calc .ans', main).innerHTML = isFinite(r) ? '<span class="lab">' + esc(f.calc.out) + '</span><br><strong>' + MO.big(parseFloat(r.toPrecision(12))) + '</strong><div class="mathblock">' + tex(C.toTex(C.parse(f.calc.expr)) + '\\quad\\text{ahol}\\quad ' + f.calc.inputs.map(function (i) { return i[0] + ' = ' + MO.tnum(env[i[0]]); }).join(',\\ '), true) + '</div>' : 'Minden mezőbe számot írj; az eredmény így nem értelmezhető.';
      };
      $$('[data-v]', main).forEach(function (i) { on(i, 'input', calc); }); calc();
    }
  };
  V.kartyak = function () {
    var cards = st.get('cards') || {}, kt = session.kt || '', list = MO.formulas.filter(function (f) { return !kt || f.topic === kt; }).sort(function (a, b) { return (cards[a.id] || 1) - (cards[b.id] || 1); }), i = 0;
    main.innerHTML = head('képletkártyák', 'Kártyák', 'Mondd ki a képletet, aztán fordítsd meg a kártyát. Amit nem tudtál, hamarabb jön elő újra.') + '<select id="kt" aria-label="Témakör" style="margin-top:12px"><option value="">minden témakör</option>' + topicOpts() + '</select><div id="cardbox" style="margin-top:16px"></div>';
    $('#kt', main).value = kt; on($('#kt', main), 'change', function (e) { session.kt = e.target.value; V.kartyak(); });
    function draw(open) {
      var f = list[i % list.length], box = $('#cardbox', main);
      box.innerHTML = '<div class="card" style="min-height:220px;display:flex;flex-direction:column;justify-content:center;text-align:center"><div class="lab">' + esc(fSub(f)) + ' · ' + (cards[f.id] || 1) + '. doboz</div><h3 style="margin:12px 0">' + esc(f.name) + '</h3>' + (open ? '<div class="mathblock">' + tex(f.tex, true) + '</div>' : '<p class="dim">Szóköz vagy koppintás a megfordításhoz</p>') + '</div><div class="row">' + (open ? '<button class="btn" type="button" data-r="0">Nem tudtam</button><button class="btn pri" type="button" data-r="1">Tudtam</button>' : '<button class="btn pri" type="button" data-r="flip">Megfordítom</button>') + '<span class="mono dim">' + (i % list.length + 1) + ' / ' + list.length + '</span></div>';
      $$('[data-r]', box).forEach(function (b) { on(b, 'click', function () { act(b.dataset.r); }); });
      on($('.card', box), 'click', function () { if (!open) act('flip'); });
      V.kartyak.key = function (e) { if (e.code === 'Space' && !open && !/INPUT|TEXTAREA|SELECT|BUTTON/.test(document.activeElement.tagName)) { e.preventDefault(); act('flip'); } };
      function act(r) {
        if (r === 'flip') return draw(true);
        cards[f.id] = r === '1' ? Math.min(5, (cards[f.id] || 1) + 1) : 1; st.set('cards', cards); i++; draw(false);
      }
    }
    draw(false);
  };

  V.labor = function () {
    var h = head('labor', 'Eszközök és szimulációk', SIMS.length + ' eszköz, témakörönként.');
    GROUPS.forEach(function (g) {
      var list = SIMS.filter(function (x) { return x.group === g; }); if (!list.length) return;
      h += '<h2>' + esc(g) + '</h2><div class="grid">' + list.map(function (x) { return '<a class="card" href="#sim-' + x.id + '"><h3>' + esc(x.title) + '</h3><p class="dim" style="margin:0">' + esc(x.desc) + '</p></a>'; }).join('') + '</div>';
    });
    main.innerHTML = h;
  };
  V.sim = function (id) {
    var s = SIMS.filter(function (x) { return x.id === id; })[0]; if (!s) return notFound();
    var tp = s.topic || (s.sub ? 'alapok' : null), links = '';
    if (tp && s.sub && MO.findSub(tp, s.sub) && MO.findSub(tp, s.sub).sub) links += ' <a class="tag on" href="#tema-' + tp + '-' + s.sub + '">tananyag: ' + esc(MO.findSub(tp, s.sub).sub.title) + '</a>';
    (s.formulas || []).forEach(function (fid) { var f = MO.formulas.filter(function (x) { return x.id === fid; })[0]; if (f) links += ' <a class="tag on" href="#keplet-' + f.id + '">' + esc(f.name) + '</a>'; });
    main.innerHTML = '<a class="lab" href="#labor">← Labor</a><h1 style="margin-top:8px">' + esc(s.title) + '</h1><p class="dim">' + esc(s.desc) + '</p>' + (links ? '<p>' + links + '</p>' : '') + '<div class="card" id="simbox" style="margin-top:14px"></div>';
    var node; try { node = s.build ? s.build(kit) : s.w ? W[s.w]() : simFuggveny(); } catch (e) { node = el('<p class="msg bad">Ez az eszköz most nem tölthető be.</p>'); if (window.console) console.error(e); }
    $$('[data-set],[data-pre]', node).forEach(function (b) { b.setAttribute('data-preset', ''); });
    $('#simbox', main).appendChild(node);
  };

  V.gyakorlas = function () {
    var replay = session.replay, daily = session.daily; delete session.replay; delete session.daily;
    var h = head('gyakorlás', daily ? 'Napi 10 perc' : replay ? 'Újra megoldom' : 'Feladatok', daily ? 'Öt vegyes feladat a kidolgozott alfejezetekből.' : 'Minden feladat új számokkal jön, így akárhányszor gyakorolhatsz.');
    if (!daily && !replay) h += '<div class="row" style="margin:14px 0"><select id="gs" aria-label="Alfejezet" style="flex:1;min-width:170px"><option value="">minden alfejezet</option>' + subOptions() + '</select><select id="gl" aria-label="Szint" style="flex:1;min-width:120px"><option value="">minden szint</option><option value="1">1. szint</option><option value="2">2. szint</option><option value="3">3. szint</option></select><select id="gm" aria-label="Mód" style="flex:1;min-width:150px"><option value="">véletlen sorrend</option><option value="weak">gyenge területek előre</option></select></div>';
    h += '<div id="gprog" class="mono dim" style="margin-bottom:10px"></div><div id="gtask"></div>';
    main.innerHTML = h;
    var box = $('#gtask', main), k = 0, okN = 0;
    function pickGen() {
      var list = MO.genList({ sub: $('#gs', main).value || undefined, level: +$('#gl', main).value || undefined }), r = MO.rng(seed());
      if ($('#gm', main).value === 'weak') {
        var ts = st.get('tasks'), score = function (g) { var t = ts[g.id]; return t ? t.bad / (t.ok + t.bad) : 0.5; };
        list = list.sort(function (a, b) { return score(b) - score(a); }).slice(0, Math.max(3, Math.ceil(list.length / 3)));
      }
      return r.pick(list);
    }
    function next() {
      box.innerHTML = '';
      if (daily) {
        if (k >= daily.length) { box.innerHTML = '<div class="card"><h3>Kész a mai adag</h3><p>' + okN + ' / ' + daily.length + ' feladat sikerült elsőre.</p><div class="row"><a class="btn pri" href="#kezdolap">Kezdőlap</a><a class="btn" href="#hibanaplo">Hibanapló</a></div></div>'; $('#gprog', main).textContent = ''; return; }
        $('#gprog', main).textContent = (k + 1) + ' / ' + daily.length;
        var first = true;
        box.appendChild(taskCard(MO.makeTask(daily[k].gen, daily[k].seed), { onResult: function (ok) { if (ok && first) okN++; first = false; }, onNext: function () { k++; next(); } }));
      } else if (replay) {
        box.appendChild(taskCard(MO.makeTask(replay.gen, replay.seed), { nextLabel: 'Hasonló feladat új számokkal', onNext: function () { replay = { gen: replay.gen, seed: seed() }; next(); } }));
      } else {
        var g = pickGen(); box.appendChild(taskCard(MO.makeTask(g.id, seed()), { onNext: next }));
      }
    }
    if (!daily && !replay) ['#gs', '#gl', '#gm'].forEach(function (s) { on($(s, main), 'change', next); });
    next();
  };

  V.vizsga = function () {
    var X = MO.examSpec;
    main.innerHTML = head('vizsga', 'Próbaérettségi') + '<div class="card" style="margin-top:16px"><p>A hivatalos feladatsorok még nincsenek betöltve ebbe a részbe.</p></div>' +
      '<h2>Az emelt szintű vizsga szerkezete 2024-től</h2><div class="card"><div class="tblwrap"><table class="t"><tr><th>rész</th><th>feladat</th><th>pont</th></tr><tr><td>I. rész</td><td>' + X.part1.tasks + '</td><td>' + X.part1.points + '</td></tr><tr><td>II. rész</td><td>' + X.part2.tasks + ' feladatból ' + X.part2.choose + ', egyenként ' + X.part2.each + ' pont</td><td>' + X.part2.points + '</td></tr><tr><td>Írásbeli összesen</td><td>' + X.minutes + ' perc</td><td>' + X.total + '</td></tr><tr><td>Szóbeli</td><td>' + X.oral.minutes + ' perc</td><td>' + X.oral.points + '</td></tr></table></div>' +
      '<p class="dim" style="margin-top:12px">Az időt szabadon oszthatod be a két rész között. A II. részben az öt feladatból négyet kell megoldani; ha nem jelölöd meg a kihagyott feladatot, és a dolgozatból sem derül ki egyértelműen, automatikusan az utolsó feladat marad ki. Segédeszköz az írásbelin: függvénytáblázat (akár többféle is), szöveges adatok tárolására és megjelenítésére nem alkalmas zsebszámológép, körző, vonalzó, szögmérő.</p></div>' +
      '<h2>Irányadó tartalmi arányok</h2><div class="card">' + X.shares.map(function (s) { return '<div style="padding:6px 0"><div class="row" style="justify-content:space-between;flex-wrap:nowrap;align-items:baseline"><span>' + esc(s[0]) + '</span><span class="mono dim" style="flex:none">' + s[1] + '%</span></div><div class="bar"><i style="width:' + s[1] * 4 + '%"></i></div></div>'; }).join('') + '<p class="dim" style="margin-top:12px">Forrás: az Oktatási Hivatal matematika vizsgaleírása (2024-től érvényes). A feladatok 30–40%-a szöveges, modellalkotást igénylő feladat.</p></div>';
  };

  V.hibanaplo = function () {
    var errs = st.get('errors');
    var h = head('hibanapló', 'Elrontott feladatok', errs.length ? errs.length + ' bejegyzés.' : '');
    if (!errs.length) { main.innerHTML = h + '<div class="card" style="margin-top:16px"><p>Még nincs bejegyzés.</p><p class="dim">Ide kerül minden feladat, amelyet elsőre elrontottál, vagy amelynek megnézted a megoldását.</p><a class="btn" href="#gyakorlas">Gyakorlás</a></div>'; return; }
    h += '<div class="row" style="margin:14px 0"><select id="es" aria-label="Alfejezet" style="flex:1;min-width:160px"><option value="">minden alfejezet</option>' + subOptions() + '</select><select id="et" aria-label="Hibatípus" style="flex:1;min-width:160px"><option value="">minden hibatípus</option>' + MO.errorTypes.map(function (t) { return '<option>' + t + '</option>'; }).join('') + '</select></div><div id="el"></div>';
    main.innerHTML = h;
    function draw() {
      var s = $('#es', main).value, t = $('#et', main).value, list = st.get('errors').filter(function (e) { return (!s || e.sub === s) && (!t || e.type === t); });
      $('#el', main).innerHTML = list.length ? list.map(function (e) {
        var sub = MO.findSub(e.topic, e.sub);
        return '<div class="card" data-id="' + e.id + '"><div class="row" style="justify-content:space-between"><span class="lab">' + esc(sub && sub.sub ? sub.sub.title : e.sub) + ' · ' + new Date(e.t).toLocaleDateString('hu-HU') + '</span><span class="tag">' + esc(e.title) + '</span></div><p style="margin-top:8px">Beírt válasz: <span class="mono">' + esc(e.given) + '</span></p><div class="row" style="align-items:stretch"><select data-f="type" aria-label="A hiba típusa" style="flex:1;min-width:170px"><option value="">a hiba típusa…</option>' + MO.errorTypes.map(function (x) { return '<option' + (x === e.type ? ' selected' : '') + '>' + x + '</option>'; }).join('') + '</select><input type="text" data-f="note" aria-label="Megjegyzés" placeholder="Megjegyzés" value="' + esc(e.note) + '" style="flex:2;min-width:180px"></div><div class="row" style="margin-top:10px"><button class="btn sm" type="button" data-a="replay">Újra megoldom</button><button class="btn sm" type="button" data-a="del">Törlés</button></div></div>';
      }).join('') : '<p class="dim">Nincs a szűrésnek megfelelő bejegyzés.</p>';
    }
    function find(node) { var id = +node.closest('[data-id]').dataset.id, all = st.get('errors'); for (var i = 0; i < all.length; i++) if (all[i].id === id) return { all: all, i: i }; return null; }
    on($('#el', main), 'change', function (e) { var f = e.target.dataset.f; if (!f) return; var r = find(e.target); if (r) { r.all[r.i][f] = e.target.value; st.set('errors', r.all); } });
    on($('#el', main), 'click', function (e) {
      var a = e.target.dataset.a; if (!a) return; var r = find(e.target); if (!r) return;
      if (a === 'replay') { session.replay = { gen: r.all[r.i].gen, seed: r.all[r.i].seed }; location.hash = '#gyakorlas'; }
      else if (e.target.dataset.sure) { r.all.splice(r.i, 1); st.set('errors', r.all); draw(); }
      else { e.target.dataset.sure = 1; e.target.textContent = 'Biztosan törlöm'; }
    });
    on($('#es', main), 'change', draw); on($('#et', main), 'change', draw); draw();
  };

  V.adatok = function () {
    main.innerHTML = head('adatok', 'Mentés és beállítások') +
      '<h2>Megjelenés</h2><div class="card"><div class="row" role="group" aria-label="Téma"><button class="btn sm" type="button" data-theme-set="dark">sötét</button><button class="btn sm" type="button" data-theme-set="light">világos</button></div></div>' +
      '<h2>Mentés</h2><div class="card"><p class="dim">Másold ki ezt a szöveget, és illeszd be a másik eszközön a Betöltés mezőbe.</p><textarea id="exp" readonly aria-label="Mentés szövege"></textarea><div class="row" style="margin-top:10px"><button class="btn" type="button" id="copy">Másolás</button><span class="msg" id="cmsg" role="status" style="margin:0"></span></div></div>' +
      '<h2>Betöltés</h2><div class="card"><textarea id="imp" aria-label="Betöltendő mentés" placeholder="Ide illeszd be a mentés szövegét"></textarea><div class="row" style="margin-top:10px"><button class="btn" type="button" id="load">Betöltés</button><span class="msg" id="lmsg" role="status" style="margin:0"></span></div><p class="dim" style="margin-top:10px">A betöltés felülírja az ezen az eszközön tárolt haladást.</p></div>' +
      '<h2>Törlés</h2><div class="card"><p class="dim">Minden haladás, jegyzet és hibanapló törlése erről az eszközről.</p><button class="btn" type="button" id="reset">Minden adat törlése</button></div>';
    $('#exp', main).value = st.exportText();
    function mark() { $$('[data-theme-set]', main).forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.themeSet === st.get('theme')); }); }
    $$('[data-theme-set]', main).forEach(function (b) { on(b, 'click', function () { st.set('theme', b.dataset.themeSet); applyTheme(); mark(); $('#exp', main).value = st.exportText(); }); });
    mark();
    on($('#copy', main), 'click', function () {
      var ta = $('#exp', main), m = $('#cmsg', main), done = function () { m.className = 'msg ok'; m.textContent = 'Kimásolva.'; };
      ta.select();
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(ta.value).then(done, function () { m.className = 'msg dim'; m.textContent = 'Jelöld ki és másold kézzel.'; });
      else { try { document.execCommand('copy'); done(); } catch (e) { m.className = 'msg dim'; m.textContent = 'Jelöld ki és másold kézzel.'; } }
    });
    on($('#load', main), 'click', function () {
      var m = $('#lmsg', main);
      try { st.importText($('#imp', main).value.trim()); applyTheme(); m.className = 'msg ok'; m.textContent = 'Betöltve.'; $('#exp', main).value = st.exportText(); mark(); }
      catch (e) { m.className = 'msg bad'; m.textContent = 'Ezt nem tudtam betölteni: nem érvényes MATEK OS mentés.'; }
    });
    on($('#reset', main), 'click', function (e) {
      if (!e.target.dataset.sure) { e.target.dataset.sure = 1; e.target.textContent = 'Biztosan törlök mindent'; return; }
      st.reset(); applyTheme(); render();
    });
  };

  function notFound() { main.innerHTML = head('hiba', 'Nincs ilyen oldal') + '<a class="btn" href="#kezdolap">Kezdőlap</a>'; }

  /* ---------- kereső ---------- */
  var INDEX = null;
  function buildIndex() {
    INDEX = [];
    [['kezdolap', 'Kezdőlap'], ['tananyag', 'Tananyag'], ['kepletter', 'Képlettár'], ['kartyak', 'Képletkártyák'], ['labor', 'Labor'], ['gyakorlas', 'Gyakorlás'], ['vizsga', 'Vizsga'], ['hibanaplo', 'Hibanapló'], ['adatok', 'Adatok, mentés']].forEach(function (p) { INDEX.push({ k: 'oldal', t: p[1], h: p[0], x: '' }); });
    MO.topics.forEach(function (t) {
      INDEX.push({ k: 'témakör', t: t.title, h: 'tema-' + t.id, x: '' });
      t.subs.forEach(function (s) {
        INDEX.push({ k: 'téma', t: s.title, h: 'tema-' + t.id + '-' + s.id, x: s.req + ' ' + t.title });
        var d = cont(t.id, s.id);
        if (d) { d.terms.forEach(function (w) { INDEX.push({ k: 'fogalom', t: w, h: 'tema-' + t.id + '-' + s.id, x: s.title }); }); (d.terms || []).length; d.theory.forEach(function (th) { INDEX.push({ k: 'elmélet', t: th.h, h: 'tema-' + t.id + '-' + s.id, x: s.title }); }); }
      });
    });
    MO.formulas.forEach(function (f) { INDEX.push({ k: 'képlet', t: f.name, h: 'keplet-' + f.id, x: f.when }); });
    SIMS.forEach(function (s) { INDEX.push({ k: 'eszköz', t: s.title, h: 'sim-' + s.id, x: s.desc }); });
    MO.genList().forEach(function (g) { INDEX.push({ k: 'feladat', t: g.title + ' (' + g.level + '. szint)', h: 'tema-' + g.topic + '-' + g.sub, x: '' }); });
    (MO.exams || []).forEach(function (e) { INDEX.push({ k: 'vizsga', t: e.y + '. ' + e.s + ' – teljes feladatsor', h: 'vizsga-' + e.id, x: 'próbaérettségi' }); e.tasks.forEach(function (t) { INDEX.push({ k: 'érettségi', t: t.title, h: 'vizsga-' + e.id + '-' + t.n, x: e.y + '. ' + e.s + ', ' + t.n + '. feladat' }); }); });
  }
  function norm(s) { return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); }
  function searchOpen() {
    if (!INDEX) buildIndex();
    $('#more').hidden = true; $('#search').hidden = false; var q = $('#q'); q.value = ''; searchDraw(); q.focus();
  }
  function searchClose() { $('#search').hidden = true; }
  var selIdx = 0;
  function searchDraw() {
    var q = norm($('#q').value.trim()), words = q.split(/\s+/).filter(Boolean);
    var hits = INDEX.map(function (it) {
      var t = norm(it.t), x = norm(it.x), sc = 0;
      for (var i = 0; i < words.length; i++) { var w = words[i]; if (t.indexOf(w) === 0) sc += 5; else if (t.indexOf(w) > 0) sc += 3; else if (x.indexOf(w) >= 0) sc += 1; else return null; }
      return { it: it, sc: sc };
    }).filter(Boolean).sort(function (a, b) { return b.sc - a.sc; }).slice(0, 40);
    selIdx = 0;
    $('#res').innerHTML = hits.length ? hits.map(function (h, i) { return '<a href="#' + h.it.h + '"' + (i === 0 ? ' class="sel"' : '') + '><span class="k">' + h.it.k + '</span><span>' + esc(h.it.t) + (h.it.x && h.it.k !== 'képlet' && h.it.k !== 'eszköz' ? ' <span class="dim">· ' + esc(h.it.x) + '</span>' : '') + '</span></a>'; }).join('') : '<p class="dim" style="padding:14px 16px;margin:0">Nincs találat.</p>';
  }
  on($('#q'), 'input', searchDraw);
  on($('#q'), 'keydown', function (e) {
    var as = $$('#res a'); if (!as.length) return;
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); as[selIdx].classList.remove('sel'); selIdx = (selIdx + (e.key === 'ArrowDown' ? 1 : as.length - 1)) % as.length; as[selIdx].classList.add('sel'); as[selIdx].scrollIntoView({ block: 'nearest' }); }
    else if (e.key === 'Enter') { e.preventDefault(); location.hash = as[selIdx].getAttribute('href'); searchClose(); }
  });
  on($('#search'), 'click', function (e) { if (e.target.id === 'search' || e.target.closest('a')) searchClose(); });
  on($('#more'), 'click', function () { $('#more').hidden = true; });
  on(document, 'click', function (e) {
    var b = e.target.closest('[data-act]'); if (!b) return;
    if (b.dataset.act === 'search') searchOpen();
    if (b.dataset.act === 'more') { $('#more').hidden = !$('#more').hidden; }
  });
  on(document, 'keydown', function (e) {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); if ($('#search').hidden) searchOpen(); else searchClose(); }
    else if (e.key === 'Escape') { searchClose(); $('#more').hidden = true; }
    else if (V.kartyak.key && location.hash === '#kartyak') V.kartyak.key(e);
  });

  /* ---------- útvonalak ---------- */
  function applyTheme() {
    var th = st.get('theme') === 'light' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', th);
    var m = $('meta[name=theme-color]'); if (m) m.setAttribute('content', th === 'light' ? '#fafafa' : '#050505');
    plots.forEach(function (p) { p.redraw(); });
  }
  function render() {
    plots.forEach(function (p) { p.destroy(); }); plots = []; V.kartyak.key = null;
    cleanups.forEach(function (fn) { try { fn(); } catch (e) {} }); cleanups = [];
    var hsh = decodeURIComponent((location.hash || '#kezdolap').slice(1)) || 'kezdolap', name = hsh, arg = '';
    var m = /^(tema|keplet|sim|vizsga)-(.+)$/.exec(hsh); if (m) { name = m[1]; arg = m[2]; }
    var nav = name === 'tema' ? 'tananyag' : name === 'keplet' || name === 'kartyak' ? 'kepletter' : name === 'sim' ? 'labor' : name;
    $$('[data-nav]').forEach(function (a) { if (a.dataset.nav === nav) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
    (V[name] || notFound)(arg);
    window.scrollTo(0, 0);
    document.title = ($('h1', main) ? $('h1', main).textContent + ' · ' : '') + 'MATEK OS';
  }
  on(window, 'hashchange', render);
  applyTheme(); render();
  /* A practice.js ezekre épít (gyakorlás, kártyák, hibanapló) */
  MO.ui = { render: render, V: V, kit: kit, taskCard: taskCard, logError: logError, countTask: countTask, head: head, cont: cont, workedSubs: workedSubs, fSub: fSub, main: main, session: session, st: st, md: md, tex: tex, esc: esc, el: el, $: $, $$: $$, on: on, seed: seed };
})();
