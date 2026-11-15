/* MATEK OS – próbaérettségi és hivatalos feladatbank.
   A feladatok és a javítási útmutatók az Oktatási Hivatal közzétett emelt szintű
   feladatsoraiból kivágott képek; a pontozás az útmutató sorait követi.
   A számoló rész (MO.examCalc) DOM nélkül is tesztelhető. */
(function (root) {
  'use strict';
  var MO = root.MO = root.MO || {};
  MO.examData = MO.examData || {};

  /* ---------- számolás (DOM nélkül) ---------- */
  var C = MO.examCalc = {
    find: function (id) { var l = MO.exams || []; for (var i = 0; i < l.length; i++) if (l[i].id === id) return l[i]; return null; },
    name: function (ex) { return ex.y + '. ' + ex.s; },
    /* egy feladat részei: [{l, p, alts:[szakaszindexek]}] az útmutató szakaszaiból */
    groups: function (dt) {
      var g = [], by = {};
      dt.secs.forEach(function (s, i) { if (!by[s.l]) { by[s.l] = { l: s.l, p: s.p, alts: [] }; g.push(by[s.l]); } by[s.l].alts.push(i); });
      return g;
    },
    /* egy szakasz pontja a beírt értékekből (v: sorindex → pont, vagy v.all a sorokra nem bontható szakasznál) */
    secPoints: function (sec, v) {
      v = v || {};
      if (!sec.ok) return Math.max(0, Math.min(sec.p, +v.all || 0));
      var s = 0; sec.rows.forEach(function (r, i) { if (r[3] === 's') s += Math.max(0, Math.min(r[2], +v[i] || 0)); });
      return s;
    },
    /* egy feladat pontja: részenként a kiválasztott megoldási út pontjai */
    taskPoints: function (dt, sc) {
      sc = sc || {}; var sum = 0;
      C.groups(dt).forEach(function (g) { var a = (sc.alt && sc.alt[g.l] != null) ? sc.alt[g.l] : g.alts[0]; sum += C.secPoints(dt.secs[a], sc.v && sc.v[a]); });
      return sum;
    },
    /* a II. részből kihagyott feladat: a megjelölt, különben a szabály szerint az utolsó (9.) */
    omitted: function (rec) { return rec && rec.omit >= 5 && rec.omit <= 9 ? rec.omit : 9; },
    /* összesítés: pts = {n: pont} */
    summary: function (ex, rec) {
      var om = C.omitted(rec), pts = (rec && rec.pts) || {}, o = { p1: 0, p2: 0, max1: 0, max2: 0, omit: om, topics: {}, subs: {} };
      ex.tasks.forEach(function (t) {
        if (t.n === om) return;
        var got = pts[t.n] || 0;
        if (t.n <= 4) { o.p1 += got; o.max1 += t.p; } else { o.p2 += got; o.max2 += t.p; }
        var parts = (rec && rec.parts && rec.parts[t.n]) || {};
        (t.subs.length ? t.subs : [['-', t.p]]).forEach(function (s) {
          var tag = (t.tags[s[0]] || [])[0]; if (!tag) return;
          var tp = tag.split('/')[0], g = parts[s[0]] || 0;
          var a = o.topics[tp] = o.topics[tp] || { got: 0, max: 0 }; a.got += g; a.max += s[1];
          var b = o.subs[tag] = o.subs[tag] || { got: 0, max: 0 }; b.got += g; b.max += s[1];
        });
      });
      o.total = o.p1 + o.p2; o.max = o.max1 + o.max2; o.pct = o.max ? Math.round(o.total / o.max * 100) : 0;
      return o;
    },
    clock: function (sec) { sec = Math.max(0, Math.round(sec)); var h = Math.floor(sec / 3600), m = Math.floor(sec % 3600 / 60), s = sec % 60; return h + ':' + (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s; },
    used: function (rec, now) { return (rec.used || 0) + (rec.run ? (now - rec.run) / 1000 : 0); },
    /* osztályzat százalékhatárai emelt szinten (az érettségi vizsgaszabályzat szerint, a teljes vizsgára) */
    grades: [[60, 'jeles (5)'], [47, 'jó (4)'], [33, 'közepes (3)'], [25, 'elégséges (2)'], [0, 'elégtelen (1)']]
  };

  if (!MO.ui) return;            /* Node alatt csak a számoló rész kell */
  var U = MO.ui, V = U.V, st = U.st, esc = U.esc, el = U.el, $ = U.$, $$ = U.$$, on = U.on, main = U.main, session = U.session;
  var LIMIT = (MO.examSpec && MO.examSpec.minutes || 240) * 60;

  function recs() { return st.get('exams') || {}; }
  function rec(id) { return recs()[id] || {}; }
  function saveRec(id, r) { var all = recs(); all[id] = r; st.set('exams', all); }
  function subTitle(tag) { var p = tag.split('/'), f = MO.findSub && MO.findSub(p[0], p[1]); return f && f.sub ? f.sub.title : tag; }
  function topicTitle(id) { var t = (MO.topics || []).filter(function (x) { return x.id === id; })[0]; return t ? t.title : id; }
  function taskTags(t) { var o = [], seen = {}; Object.keys(t.tags).forEach(function (l) { t.tags[l].forEach(function (g) { if (!seen[g]) { seen[g] = 1; o.push(g); } }); }); return o; }

  function load(id, cb) {
    if (MO.examData[id]) return cb(MO.examData[id]);
    var s = document.createElement('script'); s.src = 'vizsgak/' + id + '/data.js';
    s.onload = function () { cb(MO.examData[id] || null); }; s.onerror = function () { cb(null); };
    document.head.appendChild(s);
  }
  function missing() { return '<div class="card" style="margin-top:16px"><p>Ennek a feladatsornak a fájljai nem érhetők el.</p><p class="dim">A feladatsorok a <span class="mono">vizsgak</span> mappában vannak; ellenőrizd, hogy a mappa a program mellett van-e.</p></div>'; }

  /* kép egy függőleges sávja, a szélességhez igazodva */
  function band(base, img, y0, y1) {
    var w = img[1], h = Math.max(1, y1 - y0);
    return '<div class="exband" style="aspect-ratio:' + w + '/' + h + '"><img loading="lazy" alt="" src="' + base + img[0] + '" style="margin-top:-' + (y0 / w * 100) + '%"></div>';
  }
  function taskImg(id, dt, n) { return '<div class="exim" title="Koppints a nagyításhoz"><img alt="' + n + '. feladat szövege (kép az eredeti feladatlapról)" width="' + dt.img[1] + '" height="' + dt.img[2] + '" src="vizsgak/' + id + '/' + dt.img[0] + '"></div>'; }

  /* ---------- pontozó panel egy feladathoz ---------- */
  function scorer(ex, t, dt, onChange) {
    var id = ex.id, base = 'vizsgak/' + id + '/', node = el('<div class="exscore"></div>');
    function state() { var r = rec(id); r.sc = r.sc || {}; r.sc[t.n] = r.sc[t.n] || { alt: {}, v: {} }; return r; }
    function commit(r) {
      var sc = r.sc[t.n]; r.pts = r.pts || {}; r.parts = r.parts || {};
      r.pts[t.n] = C.taskPoints(dt, sc); r.parts[t.n] = {};
      C.groups(dt).forEach(function (g) { var a = sc.alt[g.l] != null ? sc.alt[g.l] : g.alts[0]; var p = C.secPoints(dt.secs[a], sc.v[a]);
        /* az a1/a2 jellegű részek az útmutatóban egyben szerepelnek: arányosan osztjuk szét */
        var subs = t.subs.filter(function (s) { return s[0] === g.l || (s[0].charAt(0) === g.l && s[0].length > 1); });
        if (!subs.length) r.parts[t.n][g.l] = p; else subs.forEach(function (s) { r.parts[t.n][s[0]] = g.p ? p * s[1] / g.p : 0; }); });
      r.when = Date.now(); saveRec(id, r); if (onChange) onChange(r);
    }
    function draw() {
      var r = state(), sc = r.sc[t.n], h = '';
      C.groups(dt).forEach(function (g) {
        var a = sc.alt[g.l] != null ? sc.alt[g.l] : g.alts[0], sec = dt.secs[a], v = sc.v[a] || {};
 h += '<div class="card exsec"><div class="row" style="justify-content:space-between;align-items:baseline;flex-wrap:nowrap"><h3 style="margin:0">' + t.n + '.' + (g.l === '-' ? '' : ' ' + esc(g.l) + ')') + '</h3><span class="mono" data-sum="' + a + '">' + C.secPoints(sec, v) + ' / ' + g.p + ' pont</span></div>';
        h += '<button class="btn sm exzoom" type="button" data-zoom>Nagyítás</button>';
        if (g.alts.length > 1) h += '<p class="dim" style="margin:8px 0 6px">Az útmutató több megoldási utat ad. Válaszd azt, amelyik a tiédhez a legközelebb áll.</p><div class="row" style="margin-bottom:8px">' + g.alts.map(function (i, k) { return '<button class="btn sm" type="button" data-alt="' + g.l + ':' + i + '" aria-pressed="' + (i === a) + '">' + (k + 1) + '. megoldás</button>'; }).join('') + '</div>';
        if (!sec.ok) {
          h += band(base, dt.sol, sec.rows[0][0], sec.rows[0][1]) + '<div class="row" style="margin-top:10px;align-items:center"><label for="all' + a + '" class="dim" style="flex:1">Ennél a résznél az útmutató sorai nem bonthatók szét megbízhatóan. Add meg, hány pontot érsz el az útmutató alapján:</label><select id="all' + a + '" data-all="' + a + '">' + opts(g.p, v.all) + '</select></div>';
        } else sec.rows.forEach(function (rw, i) {
          if (rw[3] === 'o' || (i === 0 && rw[3] === 'i')) return;
          var ctl = '';
          if (rw[3] === 's') ctl = rw[2] === 1 ? '<label class="exchk"><input type="checkbox" data-row="' + a + ':' + i + '"' + (v[i] ? ' checked' : '') + '><span>1 p</span></label>' : '<label class="exchk"><select data-row="' + a + ':' + i + '" aria-label="Elért pont ebben a sorban">' + opts(rw[2], v[i]) + '</select><span>/ ' + rw[2] + ' p</span></label>';
          h += '<div class="exrow' + (rw[3] === 'n' ? ' note' : '') + '">' + band(base, dt.sol, rw[0], rw[1]) + '<div class="exctl">' + ctl + '</div></div>';
        });
        h += '</div>';
      });
      node.innerHTML = h;
    }
    function opts(max, cur) { var o = ''; for (var i = 0; i <= max; i++) o += '<option' + (i === (+cur || 0) ? ' selected' : '') + '>' + i + '</option>'; return o; }
    on(node, 'click', function (e) {
      var z = e.target.closest('[data-zoom]'); if (z) { var c = z.closest('.exsec'); c.classList.toggle('zoom'); z.setAttribute('aria-pressed', c.classList.contains('zoom')); return; }
      var b = e.target.closest('[data-alt]'); if (!b) return;
      var p = b.dataset.alt.split(':'), r = state(); r.sc[t.n].alt[p[0]] = +p[1]; commit(r); draw();
    });
    on(node, 'change', function (e) {
      var x = e.target, r = state(), sc = r.sc[t.n], a, p;
      if (x.dataset.row) { p = x.dataset.row.split(':'); a = +p[0]; sc.v[a] = sc.v[a] || {}; sc.v[a][p[1]] = x.type === 'checkbox' ? (x.checked ? 1 : 0) : +x.value; }
      else if (x.dataset.all) { a = +x.dataset.all; sc.v[a] = { all: +x.value }; }
      else return;
      commit(r);
      var lab = $('[data-sum="' + a + '"]', node); if (lab) lab.textContent = C.secPoints(dt.secs[a], sc.v[a]) + ' / ' + dt.secs[a].p + ' pont';
    });
    draw();
    return node;
  }

  /* a hibanaplóba kerül minden nem hibátlan feladat (feladatonként egy bejegyzés) */
  function logTask(ex, t, got) {
    var gen = 'ex:' + ex.id + ':' + t.n, errs = st.get('errors').filter(function (e) { return e.gen !== gen; });
    st.set('errors', errs);
    if (got >= t.p) return;
    var tag = taskTags(t)[0] || 'algebra/egyenletek', p = tag.split('/');
    U.logError({ gen: gen, seed: 0, sub: p[1], topic: p[0], title: C.name(ex) + ', ' + t.n + '. feladat – ' + t.title }, got + ' / ' + t.p + ' pont');
  }

  function tagLinks(t) { return taskTags(t).map(function (g) { return '<a class="tag" href="#tema-' + g.replace('/', '-') + '">' + esc(subTitle(g)) + '</a>'; }).join(' '); }

  /* ---------- egyetlen feladat gyakorlása ---------- */
  function viewTask(ex, n) {
    var t = ex.tasks[n - 1];
    main.innerHTML = U.head('feladatbank', C.name(ex) + ', ' + n + '. feladat', esc(t.title) + ' · ' + t.p + ' pont · ' + (n <= 4 ? 'I. rész' : 'II. rész')) + '<div id="xb"><p class="dim">Betöltés…</p></div>';
    load(ex.id, function (d) {
      var box = $('#xb', main); if (!box) return;
      if (!d) { box.innerHTML = missing(); return; }
      var dt = d.tasks[n - 1], r = rec(ex.id), scored = r.pts && r.pts[n] != null;
      box.innerHTML = '<div class="card">' + taskImg(ex.id, dt, n) + '</div><div class="row" style="margin:12px 0">' + tagLinks(t) + '</div>' +
        '<div class="row"><button class="btn" type="button" id="xs">' + (scored ? 'Pontozás megnyitása' : 'Megoldás és pontozás') + '</button><a class="btn" href="#vizsga-' + ex.id + '">A teljes feladatsor</a><a class="btn" href="#vizsga">Feladatbank</a></div><p class="dim" style="margin-top:10px">Oldd meg papíron, és csak utána nyisd meg a javítási útmutatót.</p><div id="xp"></div>';
      on($('#xs', box), 'click', function () {
        var p = $('#xp', box); if (p.firstChild) return;
        var res = el('<div class="card" style="position:sticky;bottom:calc(72px + env(safe-area-inset-bottom));z-index:3"><div class="row" style="justify-content:space-between;align-items:center"><strong id="xt"></strong><button class="btn sm" type="button" id="xd">Kész, mentés</button></div></div>');
        function upd(rr) { $('#xt', res).textContent = ((rr.pts && rr.pts[n]) || 0) + ' / ' + t.p + ' pont'; }
        p.appendChild(el('<h2>Javítási útmutató</h2>')); p.appendChild(scorer(ex, t, dt, upd)); p.appendChild(res); upd(rec(ex.id));
        on($('#xd', res), 'click', function () { var rr = rec(ex.id); rr.pts = rr.pts || {}; if (rr.pts[n] == null) rr.pts[n] = 0; rr.single = rr.single || {}; rr.single[n] = Date.now(); saveRec(ex.id, rr); logTask(ex, t, rr.pts[n]); this.textContent = 'Elmentve'; });
      });
    });
  }

  /* ---------- teljes feladatsor ---------- */
  function viewExam(ex) {
    var id = ex.id, r = rec(id);
    main.innerHTML = U.head('próbaérettségi', C.name(ex), 'Emelt szintű írásbeli · ' + MO.examSpec.minutes + ' perc · ' + MO.examSpec.total + ' pont') + '<div id="xb"><p class="dim">Betöltés…</p></div>';
    load(id, function (d) {
      var box = $('#xb', main); if (!box) return;
      if (!d) { box.innerHTML = missing(); return; }
      if (r.done) return result(box, d);
      if (r.run || r.used) return sitting(box, d);
      var rows = ex.tasks.map(function (t) { return '<a href="#vizsga-' + id + '-' + t.n + '"><span class="n">' + t.n + '.</span><span class="t">' + esc(t.title) + '</span><span class="s">' + t.p + ' p' + (r.pts && r.pts[t.n] != null ? ' · ' + r.pts[t.n] : '') + '</span></a>'; });
      box.innerHTML = '<div class="card"><p>A valódi vizsgához hasonlóan ' + MO.examSpec.minutes + ' perced van a két részre együtt. Az I. rész négy feladata kötelező, a II. rész öt feladatából négyet kell megoldani.</p><p class="dim">Papíron dolgozz; segédeszköz: függvénytáblázat, számológép, körző, vonalzó, szögmérő. Az óra megállítható. A végén a hivatalos javítási útmutató soraival pontozod magad.</p><div class="row"><button class="btn" type="button" id="xgo">Indítás</button></div></div>' +
        '<h2>Feladatok egyenként</h2><p class="dim">A címek elárulják a témát – ha vizsgahelyzetet szeretnél, ne olvasd el őket.</p><div class="list"><div class="it"><span class="n">I.</span><span class="t dim">kötelező feladatok</span></div>' + rows.slice(0, 4).join('') + '<div class="it"><span class="n">II.</span><span class="t dim">ötből négy feladat</span></div>' + rows.slice(4).join('') + '</div>' +
        (ex.y < 2024 ? '<p class="dim">Ez a feladatsor a 2024 előtti követelmények szerint készült, ezért előfordulhat benne olyan rész, amely a mostani követelményben nem szerepel.</p>' : '');
      var oc = MO.offline && MO.offline.card && MO.offline.card(id); if (oc) box.appendChild(oc);
      on($('#xgo', box), 'click', function () { var rr = rec(id); rr.run = Date.now(); rr.used = 0; rr.omit = null; rr.done = false; saveRec(id, rr); viewExam(ex); });
    });

    function sitting(box, d) {
      var cur = session.exTask && session.exTask.id === id ? session.exTask.n : 1;
      box.innerHTML = '<div class="card extimer"><div class="row" style="justify-content:space-between;align-items:center;flex-wrap:nowrap"><div><div class="lab">hátralévő idő</div><div class="mono" id="xc" style="font-size:26px"></div></div><div class="row" style="flex:none"><button class="btn sm" type="button" id="xp"></button><button class="btn sm" type="button" id="xe">Befejezés</button></div></div><div class="bar"><i id="xbar"></i></div></div>' +
        '<div class="row exnav" role="tablist" aria-label="Feladatok">' + ex.tasks.map(function (t) { return '<button class="btn sm" type="button" data-n="' + t.n + '">' + t.n + '.</button>'; }).join('') + '</div>' +
        '<div id="xt"></div><div class="card"><label for="xo">A II. részből kihagyott feladat</label><select id="xo" style="margin-top:8px;width:100%"><option value="">nem jelölöm meg (ekkor a 9. feladat marad ki)</option>' + [5, 6, 7, 8, 9].map(function (n) { return '<option value="' + n + '"' + (rec(id).omit === n ? ' selected' : '') + '>' + n + '. feladat</option>'; }).join('') + '</select></div>';
      function show(n) {
        cur = n; session.exTask = { id: id, n: n }; var t = ex.tasks[n - 1];
        $$('[data-n]', box).forEach(function (b) { b.setAttribute('aria-pressed', +b.dataset.n === n); });
        $('#xt', box).innerHTML = '<div class="card"><div class="row" style="justify-content:space-between;align-items:baseline;margin-bottom:8px"><span class="lab">' + (n <= 4 ? 'I. rész' : 'II. rész') + ' · ' + n + '. feladat</span><span class="mono dim">' + t.p + ' pont' + (t.subs.length ? ' (' + t.subs.map(function (s) { return s[0] + ') ' + s[1]; }).join(', ') + ')' : '') + '</span></div>' + taskImg(id, d.tasks[n - 1], n) + '</div><div class="row" style="margin-bottom:14px">' + (n > 1 ? '<button class="btn sm" type="button" data-n="' + (n - 1) + '">Előző</button>' : '') + (n < 9 ? '<button class="btn sm" type="button" data-n="' + (n + 1) + '">Következő</button>' : '') + '</div>';
      }
      function tick() {
        var c = $('#xc', box); if (!c || !document.body.contains(c)) { clearInterval(iv); return; }
        var rr = rec(id), left = LIMIT - C.used(rr, Date.now());
        c.textContent = left >= 0 ? C.clock(left) : '+' + C.clock(-left); $('#xbar', box).style.width = Math.max(0, Math.min(100, left / LIMIT * 100)) + '%';
        $('#xp', box).textContent = rr.run ? 'Szünet' : 'Folytatás';
        if (left < 0 && !c.dataset.over) { c.dataset.over = 1; c.parentNode.querySelector('.lab').textContent = 'lejárt az idő – túllépés'; }
      }
      var iv = setInterval(tick, 1000); tick(); show(cur);
      on(box, 'click', function (e) { var b = e.target.closest('[data-n]'); if (b) { show(+b.dataset.n); var x = $('#xt', box); if (x.getBoundingClientRect().top < 0) x.scrollIntoView(); } });
      on($('#xo', box), 'change', function () { var rr = rec(id); rr.omit = +this.value || null; saveRec(id, rr); });
      on($('#xp', box), 'click', function () { var rr = rec(id); if (rr.run) { rr.used = C.used(rr, Date.now()); rr.run = 0; } else rr.run = Date.now(); saveRec(id, rr); tick(); });
      on($('#xe', box), 'click', function () {
        if (this.dataset.sure) { var rr = rec(id); rr.used = C.used(rr, Date.now()); rr.run = 0; rr.done = true; rr.fin = Date.now(); saveRec(id, rr); clearInterval(iv); viewExam(ex); window.scrollTo(0, 0); }
        else { this.dataset.sure = 1; this.textContent = 'Biztosan befejezem'; }
      });
    }

    function result(box, d) {
      var rr = rec(id), om = C.omitted(rr);
      box.innerHTML = '<div id="xsum"></div><h2>Pontozás a javítási útmutató alapján</h2><p class="dim">Feladatonként nyisd meg az útmutatót, és jelöld be a megszerzett pontokat. A kihagyott feladat: ' + om + '.' + (rr.omit ? '' : ' (Nem jelölted meg, ezért a szabály szerint az utolsó marad ki.)') + '</p><div id="xl"></div><div class="row" style="margin-top:14px"><button class="btn" type="button" id="xlog">Hibás feladatok a hibanaplóba</button><button class="btn" type="button" id="xre">Újrakezdés</button></div>';
      function sum() {
        var r2 = rec(id), s = C.summary(ex, r2), g = C.grades.filter(function (x) { return s.pct >= x[0]; })[0];
        var tp = Object.keys(s.topics).map(function (k) { var a = s.topics[k]; return '<div style="padding:6px 0"><div class="row" style="justify-content:space-between;flex-wrap:nowrap;align-items:baseline"><span>' + esc(topicTitle(k)) + '</span><span class="mono dim" style="flex:none">' + Math.round(a.got * 10) / 10 + ' / ' + a.max + '</span></div><div class="bar"><i style="width:' + (a.max ? a.got / a.max * 100 : 0) + '%"></i></div></div>'; }).join('');
        var weak = Object.keys(s.subs).map(function (k) { return [k, s.subs[k]]; }).filter(function (x) { return x[1].max >= 3 && x[1].got / x[1].max < 0.6; }).sort(function (a, b) { return (b[1].max - b[1].got) - (a[1].max - a[1].got); }).slice(0, 5);
        $('#xsum', box).innerHTML = '<div class="card"><div class="exkv"><div><span class="lab">összesen</span><strong class="mono" style="font-size:26px">' + s.total + ' / ' + s.max + '</strong></div><div><span class="lab">I. rész</span><strong class="mono">' + s.p1 + ' / ' + s.max1 + '</strong></div><div><span class="lab">II. rész</span><strong class="mono">' + s.p2 + ' / ' + s.max2 + '</strong></div><div><span class="lab">felhasznált idő</span><strong class="mono">' + C.clock(r2.used || 0) + '</strong></div></div>' +
          '<p style="margin-top:12px">Az írásbeli ' + s.pct + '%-a. ' + 'Ha a szóbelin ugyanilyen arányban teljesítenél, az osztályzat: <strong>' + g[1] + '</strong>.</p><p class="dim">Az osztályzat a teljes vizsga (írásbeli ' + MO.examSpec.total + ' + szóbeli ' + MO.examSpec.oral.points + ' pont) százalékából adódik: 60%-tól jeles, 47%-tól jó, 33%-tól közepes, 25%-tól elégséges; mindkét vizsgarészen legalább 12% szükséges. A pontozás önértékelés, a valódi javítást tanár végzi.</p></div>' +
          '<h2>Témakörök szerint</h2><div class="card">' + (tp || '<p class="dim">Még nincs pontozott feladat.</p>') + '<p class="dim" style="margin-top:10px">A részfeladatok pontjai az elsődleges témakörükhöz számítanak.</p></div>' +
          (weak.length ? '<h2>Ezeket érdemes átnézni</h2><div class="list">' + weak.map(function (x) { return '<a href="#tema-' + x[0].replace('/', '-') + '"><span class="t">' + esc(subTitle(x[0])) + '</span><span class="s">' + Math.round(x[1].got * 10) / 10 + ' / ' + x[1].max + ' p</span></a>'; }).join('') + '</div>' : '');
      }
      var list = $('#xl', box);
      ex.tasks.forEach(function (t) {
        var isOm = t.n === om, it = el('<details class="card exdet"><summary><span class="mono">' + t.n + '.</span> <span>' + esc(t.title) + '</span> <span class="mono dim" data-p></span></summary><div data-body></div></details>');
        function lab(r2) { $('[data-p]', it).textContent = isOm ? 'kihagyva' : (((r2.pts && r2.pts[t.n]) || 0) + ' / ' + t.p + ' p'); }
        lab(rr);
        on(it, 'toggle', function () {
          var b = $('[data-body]', it); if (!it.open || b.firstChild) return;
          b.appendChild(el('<div style="margin:12px 0">' + taskImg(id, d.tasks[t.n - 1], t.n) + '<div class="row" style="margin-top:10px">' + tagLinks(t) + '</div></div>'));
          b.appendChild(scorer(ex, t, d.tasks[t.n - 1], function (r2) { lab(r2); sum(); }));
        });
        list.appendChild(it);
      });
      sum();
      on($('#xlog', box), 'click', function () { var r2 = rec(id), k = 0; ex.tasks.forEach(function (t) { if (t.n === om) return; var g = (r2.pts && r2.pts[t.n]) || 0; logTask(ex, t, g); if (g < t.p) k++; }); this.textContent = k + ' feladat a hibanaplóban'; });
      on($('#xre', box), 'click', function () { if (this.dataset.sure) { saveRec(id, {}); viewExam(ex); } else { this.dataset.sure = 1; this.textContent = 'Biztosan törlöm az eredményt'; } });
    }
  }

  /* ---------- főoldal: feladatsorok, feladatbank, szabályok ---------- */
  var oldRules = V.vizsga;
  V.vizsga = function (arg) {
    var exams = MO.exams || [];
    if (arg) {
      var m = /^(\d{4}-(?:majus|oktober))(?:-([1-9]))?$/.exec(arg), ex = m && C.find(m[1]);
      if (!ex) { main.innerHTML = U.head('vizsga', 'Nincs ilyen feladatsor') + '<a class="btn" href="#vizsga">Vissza</a>'; return; }
      return m[2] ? viewTask(ex, +m[2]) : viewExam(ex);
    }
    var tab = session.vt || 'sorok', all = recs();
    var h = U.head('vizsga', 'Próbaérettségi', exams.length + ' hivatalos emelt szintű feladatsor (2010–2026), ' + exams.length * 9 + ' feladat a javítási útmutatóval.') +
      '<div class="row" style="margin:14px 0">' + [['sorok', 'Feladatsorok'], ['bank', 'Feladatbank'], ['szab', 'A vizsga szerkezete']].map(function (x) { return '<button class="btn sm" type="button" data-tab="' + x[0] + '" aria-pressed="' + (tab === x[0]) + '">' + x[1] + '</button>'; }).join('') + '</div><div id="vb"></div>';
    main.innerHTML = h;
    var box = $('#vb', main);
    on(main.querySelector('.row'), 'click', function (e) { var b = e.target.closest('[data-tab]'); if (b) { session.vt = b.dataset.tab; V.vizsga(); } });
    if (tab === 'szab') { var keep = main.innerHTML; oldRules(); var body = main.innerHTML.replace(/^[\s\S]*?<h2>/, '<h2>'); main.innerHTML = keep; $('#vb', main).innerHTML = body; on(main.querySelector('.row'), 'click', function (e) { var b = e.target.closest('[data-tab]'); if (b) { session.vt = b.dataset.tab; V.vizsga(); } }); return; }
    if (tab === 'sorok') {
      var years = {}; exams.forEach(function (e) { (years[e.y] = years[e.y] || []).push(e); });
      box.innerHTML = '<div class="list">' + Object.keys(years).sort().reverse().map(function (y) {
        return '<div class="it" style="align-items:center"><span class="n">' + y + '</span><span class="t row" style="margin:0">' + years[y].map(function (e) {
          var r = all[e.id] || {}, s = r.done ? C.summary(e, r) : null;
          return '<a class="btn sm" href="#vizsga-' + e.id + '">' + e.s + (s ? ' · ' + s.total + ' p' : r.run || r.used ? ' · folyamatban' : '') + '</a>';
        }).join('') + '</span></div>';
      }).join('') + '</div><p class="dim">A 2024 előtti feladatsorok a korábbi követelmények szerint készültek; a szerkezetük és a pontozásuk megegyezik a maival. Forrás: Oktatási Hivatal.</p>';
      return;
    }
    /* feladatbank */
    var f = session.vf = session.vf || { topic: '', sub: '', part: '', state: '' };
    function subOpts() { var o = ''; (MO.topics || []).forEach(function (t) { if (t.id === 'alapok' || (f.topic && f.topic !== t.id)) return; t.subs.forEach(function (s) { o += '<option value="' + t.id + '/' + s.id + '"' + (f.sub === t.id + '/' + s.id ? ' selected' : '') + '>' + esc(s.title) + '</option>'; }); }); return o; }
    box.innerHTML = '<div class="row" style="align-items:stretch"><select data-f="topic" aria-label="Témakör" style="flex:1;min-width:150px"><option value="">minden témakör</option>' + (MO.topics || []).filter(function (t) { return t.id !== 'alapok'; }).map(function (t) { return '<option value="' + t.id + '"' + (f.topic === t.id ? ' selected' : '') + '>' + esc(t.title) + '</option>'; }).join('') + '</select><select data-f="sub" aria-label="Alfejezet" style="flex:1;min-width:150px"><option value="">minden alfejezet</option>' + subOpts() + '</select><select data-f="part" aria-label="Vizsgarész" style="flex:1;min-width:110px"><option value="">I. és II. rész</option><option value="1"' + (f.part === '1' ? ' selected' : '') + '>I. rész</option><option value="2"' + (f.part === '2' ? ' selected' : '') + '>II. rész</option></select><select data-f="state" aria-label="Állapot" style="flex:1;min-width:110px"><option value="">minden állapot</option><option value="new"' + (f.state === 'new' ? ' selected' : '') + '>még nem pontozott</option><option value="bad"' + (f.state === 'bad' ? ' selected' : '') + '>pontvesztéssel</option><option value="ok"' + (f.state === 'ok' ? ' selected' : '') + '>hibátlan</option></select></div><p class="dim" id="vn" style="margin:10px 0"></p><div id="vl"></div>';
    var shown = 40;
    function draw() {
      var out = [];
      exams.slice().reverse().forEach(function (e) {
        var r = all[e.id] || {};
        e.tasks.forEach(function (t) {
          var tags = taskTags(t), p = r.pts && r.pts[t.n];
          if (f.topic && !tags.some(function (g) { return g.indexOf(f.topic + '/') === 0; })) return;
          if (f.sub && tags.indexOf(f.sub) < 0) return;
          if (f.part && (f.part === '1') !== (t.n <= 4)) return;
          if (f.state === 'new' && p != null) return; if (f.state === 'bad' && !(p != null && p < t.p)) return; if (f.state === 'ok' && !(p != null && p >= t.p)) return;
          out.push('<a href="#vizsga-' + e.id + '-' + t.n + '"><span class="n">' + e.y + ' ' + (e.s === 'május' ? 'máj.' : 'okt.') + ' ' + t.n + '.</span><span class="t">' + esc(t.title) + '<br><span class="dim" style="font-size:13px">' + tags.map(subTitle).map(esc).join(' · ') + '</span></span><span class="s">' + (p != null ? p + ' / ' : '') + t.p + ' p</span></a>');
        });
      });
      $('#vn', box).textContent = out.length + ' feladat felel meg a szűrésnek';
      $('#vl', box).innerHTML = out.length ? '<div class="list">' + out.slice(0, shown).join('') + '</div>' + (out.length > shown ? '<button class="btn" type="button" id="vm">Még ' + Math.min(40, out.length - shown) + ' feladat</button>' : '') : '<div class="card"><p>Ilyen szűréssel nincs feladat.</p></div>';
      var mb = $('#vm', box); if (mb) on(mb, 'click', function () { shown += 40; draw(); });
    }
    on(box, 'change', function (e) { var k = e.target.dataset.f; if (!k) return; f[k] = e.target.value; if (k === 'topic') { f.sub = ''; V.vizsga(); return; } shown = 40; draw(); });
    draw();
  };

  /* a tananyag alfejezeteinél: hány hivatalos feladat tartozik ide */
  var oldTema = V.tema;
  V.tema = function (arg) {
    oldTema(arg);
    var m = /^([a-z]+)-([a-z0-9]+)$/.exec(arg || ''); if (!m || m[1] === 'alapok') return;
    var tag = m[1] + '/' + m[2], k = 0; (MO.exams || []).forEach(function (e) { e.tasks.forEach(function (t) { if (taskTags(t).indexOf(tag) >= 0) k++; }); });
    if (!k) return;
    var c = el('<div class="card" style="margin-top:16px"><div class="lab">hivatalos érettségi feladatok</div><p style="margin:8px 0 12px">' + k + ' feladat érinti ezt az alfejezetet a 2010–2026-os emelt szintű feladatsorokban.</p><button class="btn" type="button">Megnyitás a feladatbankban</button></div>');
    on($('button', c), 'click', function () { session.vt = 'bank'; session.vf = { topic: m[1], sub: tag, part: '', state: '' }; location.hash = '#vizsga'; });
    main.appendChild(c);
  };

  /* kezdőlap: hol tartasz a hivatalos feladatsorokkal */
  var oldHome = V.kezdolap;
  V.kezdolap = function () {
    oldHome();
    var all = recs(), ex = MO.exams || [], done = 0, scored = 0, run = null;
    ex.forEach(function (e) { var r = all[e.id]; if (!r) return; if (r.done) done++; else if (r.run || r.used) run = e; if (r.pts) scored += Object.keys(r.pts).length; });
    var c = el('<div><h2>Próbaérettségi</h2><div class="card"><p><strong>' + done + ' / ' + ex.length + '</strong> feladatsor megírva, <strong>' + scored + ' / ' + ex.length * 9 + '</strong> feladat pontozva.</p><div class="bar"><i style="width:' + (ex.length ? scored / (ex.length * 9) * 100 : 0) + '%"></i></div><div class="row" style="margin-top:12px">' + (run ? '<a class="btn" href="#vizsga-' + run.id + '">Folytatás: ' + C.name(run) + '</a>' : '') + '<a class="btn" href="#vizsga">Feladatsorok és feladatbank</a></div></div></div>');
    main.appendChild(c);
  };

  /* a feladatképek koppintásra nagyíthatók (vízszintesen görgethetők) */
  on(main, 'click', function (e) { var x = e.target.closest('.exim'); if (x) x.classList.toggle('zoom'); });

  U.render();
})(typeof window !== 'undefined' ? window : globalThis);
