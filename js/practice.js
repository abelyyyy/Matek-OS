/* MATEK OS – Gyakorlás (minden feladattípus), képletkártyák Leitner-rendszerben, hibanapló.
   Az ui.js után töltődik be, és annak nézeteit bővíti. */
(function () {
  'use strict';
  var MO = window.MO, U = MO.ui, V = U.V, st = U.st, $ = U.$, $$ = U.$$, on = U.on, el = U.el, md = U.md, tex = U.tex, esc = U.esc, C = MO.cas, M = MO.models, main = U.main, session = U.session;
  var B = MO.bank = MO.bank || {};
  var TYPES = { gen: 'számolós feladat', tf: 'igaz vagy hamis', spot: 'hibavadász', order: 'sorba rendezés', guided: 'vezetett megoldás' };

  /* ---------- a teljes feladatkészlet ---------- */
  function allItems() {
    var o = MO.genList().map(function (g) { return { id: g.id, type: 'gen', topic: g.topic, sub: g.sub, level: g.level, title: g.title }; });
    Object.keys(B).forEach(function (k) { var b = B[k]; o.push({ id: b.id, type: b.type, topic: b.topic, sub: b.sub, level: b.level, title: b.title }); });
    return o;
  }
  function stateOf(id) { var r = st.get('tasks')[id]; if (!r) return 'none'; if (r.last === 1 || (r.last === undefined && r.ok > 0 && !r.bad)) return 'done'; return 'bad'; }
  function subTitle(it) { var f = MO.findSub(it.topic, it.sub); return f && f.sub ? f.sub.title : it.sub; }
  function topicOptions() { return MO.topics.map(function (t) { return '<option value="' + t.id + '">' + esc((t.num ? t.num + '. ' : '') + t.title) + '</option>'; }).join(''); }
  function subOptionsOf(tid) { var t = MO.topics.filter(function (x) { return x.id === tid; })[0]; return '<option value="">minden alfejezet</option>' + (t ? t.subs.map(function (s) { return '<option value="' + s.id + '">' + esc(s.title) + '</option>'; }).join('') : ''); }
  function links(it) {
    var fs = MO.formulas.filter(function (f) { return f.topic === it.topic && f.sub === it.sub; }).slice(0, 3);
    return '<p class="dim" style="margin:14px 0 0"><a class="tag on" href="#tema-' + it.topic + '-' + it.sub + '">tananyag: ' + esc(subTitle(it)) + '</a> ' + fs.map(function (f) { return '<a class="tag" href="#keplet-' + f.id + '">' + esc(f.name) + '</a>'; }).join(' ') + '</p>';
  }
  function record(it, ok, given) {
    U.countTask({ gen: it.id }, ok);
    if (!ok) U.logError({ gen: it.id, seed: 0, sub: it.sub, topic: it.topic, title: it.title }, given || '');
  }
  function shell(it, body, label) {
    return el('<div class="card task"><div class="row" style="justify-content:space-between;margin-bottom:8px;flex-wrap:nowrap;align-items:baseline"><span class="lab">' + esc(label || it.title) + '</span><span class="tag" style="flex:none">' + TYPES[it.type] + ' · ' + it.level + '. szint</span></div>' + body + '<div class="msg" role="status" aria-live="polite"></div><div class="extra"></div><div class="row tools" style="margin-top:12px"></div></div>');
  }
  function nextBtn(node, opts) {
    if (!opts.onNext) return; var b = el('<button class="btn" type="button">' + (opts.nextLabel || 'Következő feladat') + '</button>'); on(b, 'click', opts.onNext); $('.tools', node).appendChild(b); b.focus();
  }
  function say(node, ok, text) { var m = $('.msg', node); m.className = 'msg ' + (ok ? 'ok' : 'bad'); m.textContent = text; }

  /* ---------- igaz vagy hamis ---------- */
  function cardTf(b, opts) {
    var node = shell(b, '<div class="md q">' + md(b.stmt) + '</div><div class="row" style="margin-top:14px" role="group" aria-label="Válasz"><button class="btn" type="button" data-v="1" style="flex:1">Igaz</button><button class="btn" type="button" data-v="0" style="flex:1">Hamis</button></div>');
    $$('[data-v]', node).forEach(function (btn) {
      on(btn, 'click', function () {
        var ans = btn.dataset.v === '1', ok = ans === b.truth;
        $$('[data-v]', node).forEach(function (x) { x.disabled = true; if ((x.dataset.v === '1') === b.truth) x.style.borderColor = 'var(--ok)'; });
        if (!ok) btn.style.borderColor = 'var(--bad)';
        say(node, ok, ok ? 'Helyes.' : 'Ez nem jó: az állítás ' + (b.truth ? 'igaz.' : 'hamis.'));
        $('.extra', node).innerHTML = '<div class="ans md" style="margin-top:12px"><span class="lab">Indoklás</span><br>' + md(b.why) + '</div>';
        record(b, ok, ans ? 'igaz' : 'hamis'); if (opts.onResult) opts.onResult(ok); nextBtn(node, opts);
      });
    });
    return node;
  }

  /* ---------- hibavadász ---------- */
  function cardSpot(b, opts) {
    var node = shell(b, '<div class="md q">' + md(b.problem) + '</div><p class="dim" style="margin:12px 0 8px">Az alábbi megoldásban hiba van. Koppints arra a sorra, ahol először rossz.</p><div class="lines" style="display:grid;gap:6px">' +
      b.lines.map(function (l, i) { return '<button class="btn md" type="button" data-i="' + i + '" style="justify-content:flex-start;text-align:left;height:auto;min-height:44px;padding:8px 12px"><span class="mono dim" style="margin-right:10px">' + (i + 1) + '.</span><span>' + md(l) + '</span></button>'; }).join('') + '</div>', subTitle(b)); /* a cím elárulná a hibát, ezért csak a válasz után jelenik meg */
    $$('[data-i]', node).forEach(function (btn) {
      on(btn, 'click', function () {
        var i = +btn.dataset.i, ok = i === b.wrong;
        $$('[data-i]', node).forEach(function (x) { x.disabled = true; if (+x.dataset.i === b.wrong) x.style.borderColor = 'var(--ok)'; });
        if (!ok) btn.style.borderColor = 'var(--bad)';
        say(node, ok, ok ? 'Megtaláltad.' : 'Nem ez az. A hibás sor: ' + (b.wrong + 1) + '.');
        $('.lab', node).textContent = b.title;
        $('.extra', node).innerHTML = '<div class="ans md" style="margin-top:12px"><span class="lab">Mi a hiba?</span><br>' + md(b.why) + '</div><div class="ans md" style="margin-top:8px"><span class="lab">Helyesen</span><br>' + md(b.fix) + '</div>';
        record(b, ok, (i + 1) + '. sor'); if (opts.onResult) opts.onResult(ok); nextBtn(node, opts);
      });
    });
    return node;
  }

  /* ---------- sorba rendezés ---------- */
  function cardOrder(b, opts) {
    var n = b.steps.length, r = MO.rng(opts.seed || U.seed()), perm, same;
    do { perm = r.shuffle(b.steps.map(function (s, i) { return i; })); same = perm.every(function (v, i) { return v === i; }); } while (same && n > 1);
    var node = shell(b, '<div class="md q">' + md(b.claim) + '</div><p class="dim" style="margin:12px 0 8px">Rakd helyes sorrendbe a lépéseket a nyilakkal.</p><ol class="ord" style="list-style:none;margin:0;padding:0;display:grid;gap:6px"></ol><div class="row" style="margin-top:12px"><button class="btn pri" type="button" data-a="check">Ellenőrzés</button><button class="btn sm" type="button" data-a="show">Megoldás</button></div>');
    var list = $('.ord', node), tries = 0, done = false;
    function draw(marks) {
      list.innerHTML = perm.map(function (si, pos) {
        var col = marks ? (marks[pos] ? 'var(--ok)' : 'var(--bad)') : 'var(--line)';
        return '<li style="display:flex;gap:8px;align-items:center;border:1px solid ' + col + ';border-radius:10px;padding:6px 8px"><span class="mono dim" style="flex:none;width:20px;text-align:right">' + (pos + 1) + '.</span><span class="md" style="flex:1;min-width:0">' + md(b.steps[si]) + '</span>' +
          (done ? '' : '<span style="flex:none;display:flex;gap:4px"><button class="btn sm" type="button" data-up="' + pos + '" aria-label="Feljebb" style="min-width:40px;padding:0"' + (pos === 0 ? ' disabled' : '') + '>↑</button><button class="btn sm" type="button" data-down="' + pos + '" aria-label="Lejjebb" style="min-width:40px;padding:0"' + (pos === n - 1 ? ' disabled' : '') + '>↓</button></span>') + '</li>';
      }).join('');
    }
    on(list, 'click', function (e) {
      var up = e.target.closest('[data-up]'), dn = e.target.closest('[data-down]'); if (done || (!up && !dn)) return;
      var i = up ? +up.dataset.up : +dn.dataset.down, j = up ? i - 1 : i + 1, t = perm[i]; perm[i] = perm[j]; perm[j] = t; draw();
      var f = $('[data-' + (up ? 'up' : 'down') + '="' + j + '"]', list); if (f && !f.disabled) f.focus();
    });
    function finish(ok, given) {
      done = true; $$('[data-a]', node).forEach(function (x) { x.remove(); });
      if (b.note) $('.extra', node).innerHTML = '<div class="ans md" style="margin-top:12px">' + md(b.note) + '</div>';
      record(b, ok, given); if (opts.onResult) opts.onResult(ok); nextBtn(node, opts);
    }
    on($('[data-a=check]', node), 'click', function () {
      tries++; var marks = perm.map(function (v, i) { return v === i; }), ok = marks.every(Boolean);
      if (ok) { say(node, true, tries === 1 ? 'Helyes sorrend.' : 'Most már helyes a sorrend.'); done = true; draw(marks); finish(tries === 1, tries + '. próbálkozásra'); }
      else { draw(marks); say(node, false, 'Még nem jó: a pirossal jelölt lépések nincsenek a helyükön.'); }
    });
    on($('[data-a=show]', node), 'click', function () { perm = b.steps.map(function (s, i) { return i; }); done = true; draw(perm.map(function () { return true; })); say(node, false, 'Ez a helyes sorrend. A feladat a hibanaplóba került.'); finish(false, '(megnézett megoldás)'); });
    draw(); return node;
  }

  /* ---------- vezetett megoldás ---------- */
  function cardGuided(b, opts) {
    var node = shell(b, '<div class="md q">' + md(b.problem) + '</div><div class="gsteps"></div>'), box = $('.gsteps', node), i = 0, failed = 0;
    function step() {
      if (i >= b.steps.length) {
        var ok = failed === 0; say(node, ok, ok ? 'Végig helyes.' : 'Kész. ' + failed + ' lépésnél kellett segítség.');
        if (b.final) $('.extra', node).innerHTML = '<div class="ans md" style="margin-top:12px"><span class="lab">Válasz</span><br>' + md(b.final) + '</div>';
        record(b, ok, failed + ' lépés hibás'); if (opts.onResult) opts.onResult(ok); nextBtn(node, opts); return;
      }
      var s = b.steps[i], choice = s.answer.type === 'choice', wrong = 0;
      var sn = el('<div style="border-top:1px solid var(--line);margin-top:14px;padding-top:12px"><div class="lab">' + (i + 1) + '. lépés / ' + b.steps.length + '</div><div class="md" style="margin-top:6px">' + md(s.q) + '</div>' +
        (choice ? '<div style="display:grid;gap:6px;margin-top:10px">' + s.answer.options.map(function (o, k) { return '<button class="btn md" type="button" data-o="' + k + '" style="justify-content:flex-start;text-align:left;height:auto;min-height:44px;padding:8px 12px">' + md(o) + '</button>'; }).join('') + '</div>'
          : '<form class="row" style="margin-top:10px;align-items:stretch"><input type="text" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="Válasz" placeholder="' + (s.answer.type === 'set' ? 'Értékek pontosvesszővel' : 'Válasz') + '" style="flex:1;min-width:140px"><button class="btn pri" type="submit">Ellenőrzés</button></form>') +
        '<div class="smsg msg" role="status" aria-live="polite"></div><div class="row" style="margin-top:8px"><button class="btn sm" type="button" data-h>Tipp</button></div><div class="sx"></div></div>');
      box.appendChild(sn);
      var sm = $('.smsg', sn);
      function close(ok) {
        $$('input,button', sn).forEach(function (x) { x.disabled = true; });
        $('.sx', sn).innerHTML = '<div class="md dim" style="margin-top:8px">' + (ok ? '' : '<span class="lab">Helyes válasz</span> ' + (choice ? md(s.answer.options[s.answer.correct]) : tex(s.ansTex)) + '<br>') + md(s.expl) + '</div>';
        if (!ok) failed++; i++; step();
      }
      function judge(ok, emsg) {
        if (emsg) { sm.className = 'smsg msg bad'; sm.textContent = emsg; return; }
        if (ok) { sm.className = 'smsg msg ok'; sm.textContent = 'Helyes.'; close(true); }
        else { wrong++; if (wrong >= 2 || choice) { sm.className = 'smsg msg bad'; sm.textContent = 'Ez nem jó, megmutatom.'; close(false); } else { sm.className = 'smsg msg bad'; sm.textContent = 'Ez nem jó. Még egyszer próbálhatod.'; } }
      }
      on($('[data-h]', sn), 'click', function (e) { e.target.disabled = true; $('.sx', sn).innerHTML = '<div class="md dim" style="margin-top:8px"><span class="lab">Tipp</span><br>' + md(s.hint) + '</div>'; });
      if (choice) $$('[data-o]', sn).forEach(function (o) { on(o, 'click', function () { var ok = +o.dataset.o === s.answer.correct; o.style.borderColor = ok ? 'var(--ok)' : 'var(--bad)'; judge(ok); }); });
      else { on($('form', sn), 'submit', function (e) { e.preventDefault(); var r = C.check(s.answer, $('input', sn).value); judge(r.ok, r.msg); }); if (i > 0) $('input', sn).focus(); }
    }
    step(); return node;
  }

  function itemCard(it, opts) {
    var node;
    if (it.type === 'gen') node = U.taskCard(MO.makeTask(it.id, opts.seed || U.seed()), opts);
    else { var b = B[it.id]; node = b.type === 'tf' ? cardTf(b, opts) : b.type === 'spot' ? cardSpot(b, opts) : b.type === 'order' ? cardOrder(b, opts) : cardGuided(b, opts); }
    node.appendChild(el(links(it))); return node;
  }
  function findItem(id) { return allItems().filter(function (x) { return x.id === id; })[0]; }

  /* ---------- Gyakorlás ---------- */
  V.gyakorlas = function () {
    var replay = session.replay, daily = session.daily; delete session.replay; delete session.daily;
    var f = session.gf = session.gf || { t: '', s: '', l: '', ty: '', stt: '', mode: '' }, items = allItems();
    var h = U.head('gyakorlás', daily ? 'Napi 10 perc' : replay ? 'Újra megoldom' : 'Feladatok', daily ? 'Öt vegyes feladat a kidolgozott alfejezetekből.' : replay ? '' : items.length + ' feladattípus; a számolós feladatok mindig új számokkal jönnek.');
    if (!daily && !replay) {
      var sel = function (id, lab, opts) { return '<select id="' + id + '" aria-label="' + lab + '" style="flex:1;min-width:150px">' + opts + '</select>'; };
      h += '<div class="row" style="margin:14px 0">' + sel('gt', 'Témakör', '<option value="">minden témakör</option>' + topicOptions()) + sel('gs', 'Alfejezet', subOptionsOf(f.t)) +
        sel('gl', 'Szint', '<option value="">minden szint</option><option value="1">1. szint</option><option value="2">2. szint</option><option value="3">3. szint</option>') +
        sel('gy', 'Feladattípus', '<option value="">minden típus</option>' + Object.keys(TYPES).map(function (k) { return '<option value="' + k + '">' + TYPES[k] + '</option>'; }).join('')) +
        sel('ga', 'Állapot', '<option value="">minden állapot</option><option value="none">megoldatlan</option><option value="bad">hibás</option><option value="done">kész</option>') +
        sel('gm', 'Mód', '<option value="">véletlen sorrend</option><option value="weak">gyenge területek előre</option>') + '</div>';
    }
    h += '<div id="gprog" class="mono dim" style="margin-bottom:10px"></div><div id="gtask"></div>';
    main.innerHTML = h;
    var box = $('#gtask', main), prog = $('#gprog', main), k = 0, okN = 0, lastId = null;
    function pool() {
      return items.filter(function (it) { return (!f.t || it.topic === f.t) && (!f.s || it.sub === f.s) && (!f.l || it.level === +f.l) && (!f.ty || it.type === f.ty) && (!f.stt || stateOf(it.id) === f.stt); });
    }
    function pick(list) {
      var r = MO.rng(U.seed());
      if (f.mode === 'weak') {
        var ts = st.get('tasks'), agg = {};
        items.forEach(function (it) { var rec = ts[it.id]; if (!rec) return; var a = agg[it.topic + '/' + it.sub] = agg[it.topic + '/' + it.sub] || { ok: 0, bad: 0 }; a.ok += rec.ok; a.bad += rec.bad; });
        var score = function (it) { var a = agg[it.topic + '/' + it.sub]; return a ? (a.bad + 1) / (a.ok + a.bad + 2) : 0.5; };
        list = list.slice().sort(function (a, b) { return score(b) - score(a); }).slice(0, Math.max(4, Math.ceil(list.length / 4)));
      }
      if (list.length > 1) list = list.filter(function (it) { return it.id !== lastId; });
      return r.pick(list);
    }
    function next() {
      box.innerHTML = '';
      if (daily) {
        if (k >= daily.length) { box.innerHTML = '<div class="card"><h3>Kész a mai adag</h3><p>' + okN + ' / ' + daily.length + ' feladat sikerült elsőre.</p><div class="row"><a class="btn pri" href="#kezdolap">Kezdőlap</a><a class="btn" href="#hibanaplo">Hibanapló</a></div></div>'; prog.textContent = ''; return; }
        prog.textContent = (k + 1) + ' / ' + daily.length; var first = true, it = findItem(daily[k].gen);
        box.appendChild(itemCard(it, { seed: daily[k].seed, onResult: function (ok) { if (ok && first) okN++; first = false; }, onNext: function () { k++; next(); } }));
      } else if (replay) {
        var ri = findItem(replay.gen);
        if (!ri) { box.innerHTML = '<p class="dim">Ez a feladat már nem érhető el.</p>'; return; }
        box.appendChild(itemCard(ri, { seed: replay.seed || undefined, nextLabel: ri.type === 'gen' ? 'Hasonló feladat új számokkal' : 'Vissza a hibanaplóhoz', onNext: function () { if (ri.type === 'gen') { replay = { gen: replay.gen, seed: U.seed() }; next(); } else location.hash = '#hibanaplo'; } }));
      } else {
        var list = pool(); prog.textContent = list.length + ' feladattípus felel meg a szűrésnek';
        if (!list.length) { box.innerHTML = '<div class="card"><p>Ilyen szűréssel nincs feladat.</p><p class="dim">Lazíts a feltételeken, például válaszd a „minden állapot” lehetőséget.</p></div>'; return; }
        var it2 = pick(list); lastId = it2.id; box.appendChild(itemCard(it2, { onNext: next }));
      }
    }
    if (!daily && !replay) {
      var map = { gt: 't', gs: 's', gl: 'l', gy: 'ty', ga: 'stt', gm: 'mode' };
      Object.keys(map).forEach(function (id) { $('#' + id, main).value = f[map[id]]; });
      Object.keys(map).forEach(function (id) {
        on($('#' + id, main), 'change', function (e) {
          f[map[id]] = e.target.value;
          if (id === 'gt') { f.s = ''; $('#gs', main).innerHTML = subOptionsOf(f.t); }
          next();
        });
      });
    }
    next();
  };

  /* ---------- Képletkártyák (Leitner) ---------- */
  function allCards() {
    var o = MO.formulas.map(function (fm) { return { id: 'f:' + fm.id, kind: 'képlet', front: fm.name, back: '<div class="mathblock">' + tex(fm.tex, true) + '</div>' + (fm.cond ? '<p class="md dim">' + md(fm.cond) + '</p>' : ''), topic: fm.topic, sub: fm.sub, level: fm.level, href: 'keplet-' + fm.id }; });
    U.workedSubs().forEach(function (w) {
      var tid = w.t ? w.t.id : w.topic, sid = w.s ? w.s.id : w.sub, c = U.cont(tid, sid); if (!c || !c.theory) return;
      c.theory.forEach(function (th, i) { o.push({ id: 't:' + tid + '/' + sid + ':' + i, kind: 'elmélet', front: th.h, back: '<div class="md" style="text-align:left">' + md(th.b) + '</div>', topic: tid, sub: sid, level: th.level === 'emelt' || th.emelt ? 'emelt' : 'közép', href: 'tema-' + tid + '-' + sid }); });
    });
    return o;
  }
  function cardRec(id) { var c = st.get('cards') || {}, r = c[id]; if (typeof r === 'number') r = { b: r, due: 0 }; return r || null; }
  V.kartyak = function () {
    var f = session.kf2 = session.kf2 || { t: '', lv: '', kind: '' }, all = allCards();
    main.innerHTML = U.head('képletkártyák', 'Kártyák', 'Mondd ki a választ, aztán fordítsd meg a kártyát. Amit tudtál, egyre ritkábban jön elő (1, 2, 4, 8, 16 nap múlva); amit nem, az hamar visszatér.') +
      '<div class="row" style="margin:14px 0"><select id="kt" aria-label="Témakör" style="flex:2;min-width:170px"><option value="">minden témakör</option>' + topicOptions() + '</select><select id="kl" aria-label="Szint" style="flex:1;min-width:120px"><option value="">minden szint</option><option value="közép">középszint</option><option value="emelt">emelt szint</option></select><select id="kk" aria-label="Fajta" style="flex:1;min-width:130px"><option value="">képlet és elmélet</option><option value="képlet">csak képlet</option><option value="elmélet">csak elmélet</option></select></div><div id="kstat" class="mono dim" style="margin-bottom:10px"></div><div id="cardbox"></div>';
    var queue = [], cur = null, open = false, box = $('#cardbox', main);
    function build() {
      var now = Date.now(), list = all.filter(function (c) { return (!f.t || c.topic === f.t) && (!f.lv || c.level === f.lv) && (!f.kind || c.kind === f.kind); });
      var due = [], fresh = [], boxes = [0, 0, 0, 0, 0];
      list.forEach(function (c) { var r = cardRec(c.id); if (!r) fresh.push(c); else { boxes[r.b - 1]++; if (M.leitnerDue(r, now)) due.push(c); } });
      due.sort(function (a, b) { return cardRec(a.id).due - cardRec(b.id).due; });
      queue = due.concat(MO.rng(U.seed()).shuffle(fresh).slice(0, 20));
      $('#kstat', main).textContent = list.length + ' kártya · esedékes: ' + due.length + ' · új: ' + fresh.length + ' · dobozok: ' + boxes.join(' / ');
      cur = queue.shift() || null; open = false; draw();
    }
    function draw() {
      if (!cur) { box.innerHTML = '<div class="card"><h3>Mára nincs több esedékes kártya</h3><p class="dim">Válts témakört, vagy gyere vissza holnap. Az új kártyákból egyszerre legfeljebb 20 kerül sorra.</p><a class="btn" href="#kepletter">Képlettár</a></div>'; return; }
      var r = cardRec(cur.id);
      box.innerHTML = '<div class="card" id="fc" style="min-height:230px;display:flex;flex-direction:column;justify-content:center;text-align:center;cursor:pointer"><div class="lab">' + cur.kind + ' · ' + esc(U.fSub({ topic: cur.topic, sub: cur.sub })) + ' · ' + (r ? r.b + '. doboz' : 'új') + '</div><h3 style="margin:12px 0">' + md(cur.front) + '</h3>' + (open ? cur.back : '<p class="dim">Szóköz vagy koppintás a megfordításhoz</p>') + '</div>' +
        '<div class="row">' + (open ? '<button class="btn" type="button" data-r="0" style="flex:1">Nem tudtam</button><button class="btn" type="button" data-r="1" style="flex:1">Nehezen</button><button class="btn pri" type="button" data-r="2" style="flex:1">Tudtam</button>' : '<button class="btn pri" type="button" data-r="flip">Megfordítom</button>') + '<span class="mono dim">még ' + queue.length + '</span></div>' + (open ? '<p style="margin-top:10px"><a class="tag" href="#' + cur.href + '">megnyitás</a></p>' : '');
      $$('[data-r]', box).forEach(function (b) { on(b, 'click', function () { act(b.dataset.r); }); });
      on($('#fc', box), 'click', function (e) { if (!open && !e.target.closest('a')) act('flip'); });
    }
    function act(r) {
      if (!cur) return;
      if (r === 'flip') { open = true; draw(); return; }
      var cards = st.get('cards') || {}; cards[cur.id] = M.leitner(cardRec(cur.id), +r, Date.now()); st.set('cards', cards);
      if (+r === 0) queue.push(cur);
      cur = queue.shift() || null; open = false; draw();
    }
    V.kartyak.key = function (e) {
      if (/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) return;
      if (e.code === 'Space') { e.preventDefault(); if (!open) act('flip'); }
      else if (open && /^[123]$/.test(e.key)) act(String(+e.key - 1));
    };
    [['kt', 't'], ['kl', 'lv'], ['kk', 'kind']].forEach(function (p) { $('#' + p[0], main).value = f[p[1]]; on($('#' + p[0], main), 'change', function (e) { f[p[1]] = e.target.value; build(); }); });
    build();
  };

  /* ---------- Hibanapló ---------- */
  V.hibanaplo = function () {
    var errs = st.get('errors'), f = session.ef = session.ef || { t: '', ty: '', q: '' }, shown = 40;
    var h = U.head('hibanapló', 'Elrontott feladatok', errs.length ? errs.length + ' bejegyzés.' : '');
    if (!errs.length) { main.innerHTML = h + '<div class="card" style="margin-top:16px"><p>Még nincs bejegyzés.</p><p class="dim">Ide kerül minden feladat, amelyet elsőre elrontottál, vagy amelynek megnézted a megoldását.</p><a class="btn" href="#gyakorlas">Gyakorlás</a></div>'; return; }
    h += '<div id="estat"></div><div class="row" style="margin:14px 0"><input type="search" id="eq" placeholder="Keresés a címben és a megjegyzésben" aria-label="Keresés" style="flex:2;min-width:180px"><select id="et" aria-label="Témakör" style="flex:2;min-width:170px"><option value="">minden témakör</option>' + topicOptions() + '</select><select id="ey" aria-label="Hibatípus" style="flex:1;min-width:150px"><option value="">minden hibatípus</option><option value="-">besorolatlan</option>' + MO.errorTypes.map(function (t) { return '<option>' + t + '</option>'; }).join('') + '</select></div><div id="el"></div>';
    main.innerHTML = h;
    function stats() {
      var all = st.get('errors'), bySub = {}, byType = {};
      all.forEach(function (e) { var k = e.topic + '/' + e.sub; bySub[k] = (bySub[k] || 0) + 1; byType[e.type || 'besorolatlan'] = (byType[e.type || 'besorolatlan'] || 0) + 1; });
      var top = Object.keys(bySub).sort(function (a, b) { return bySub[b] - bySub[a]; }).slice(0, 5), mx = top.length ? bySub[top[0]] : 1;
      $('#estat', main).innerHTML = '<div class="grid" style="margin-top:16px"><div class="card"><div class="lab">Leggyakoribb alfejezetek</div>' + top.map(function (k) { var p = k.split('/'), it = { topic: p[0], sub: p[1] }; return '<a href="#tema-' + p[0] + '-' + p[1] + '" style="display:block;padding:6px 0"><div class="row" style="justify-content:space-between;flex-wrap:nowrap;align-items:baseline"><span>' + esc(subTitle(it)) + '</span><span class="mono dim" style="flex:none">' + bySub[k] + '</span></div><div class="bar"><i style="width:' + (bySub[k] / mx * 100) + '%"></i></div></a>'; }).join('') + '</div>' +
        '<div class="card"><div class="lab">Hibatípusok</div><dl class="kv">' + Object.keys(byType).sort(function (a, b) { return byType[b] - byType[a]; }).map(function (k) { return '<dt>' + esc(k) + '</dt><dd>' + byType[k] + '</dd>'; }).join('') + '</dl><p class="dim" style="margin:0">Sorold be a hibáidat: így látszik, min érdemes változtatnod.</p></div></div>';
    }
    function draw() {
      var q = f.q.toLowerCase(), list = st.get('errors').filter(function (e) { return (!f.t || e.topic === f.t) && (!f.ty || (f.ty === '-' ? !e.type : e.type === f.ty)) && (!q || (e.title + ' ' + e.note).toLowerCase().indexOf(q) >= 0); });
      $('#el', main).innerHTML = list.length ? list.slice(0, shown).map(function (e) {
        var it = findItem(e.gen);
        return '<div class="card" data-id="' + e.id + '"><div class="row" style="justify-content:space-between"><span class="lab">' + esc(subTitle(e)) + ' · ' + new Date(e.t).toLocaleDateString('hu-HU') + '</span><span class="tag">' + (it ? TYPES[it.type] : 'feladat') + '</span></div><h3 style="margin-top:8px">' + esc(e.title) + '</h3><p>' + (/^ex:/.test(e.gen) ? 'Elért pont' : 'Beírt válasz') + ': <span class="mono">' + esc(e.given) + '</span></p><div class="row" style="align-items:stretch"><select data-f="type" aria-label="A hiba típusa" style="flex:1;min-width:170px"><option value="">a hiba típusa…</option>' + MO.errorTypes.map(function (x) { return '<option' + (x === e.type ? ' selected' : '') + '>' + x + '</option>'; }).join('') + '</select><input type="text" data-f="note" aria-label="Megjegyzés" placeholder="Megjegyzés" value="' + esc(e.note) + '" style="flex:2;min-width:180px"></div><div class="row" style="margin-top:10px">' + (it ? '<button class="btn sm" type="button" data-a="replay">Újra megoldom</button>' : /^ex:/.test(e.gen) ? '<a class="btn sm" href="#vizsga-' + e.gen.slice(3).replace(':', '-') + '">Feladat megnyitása</a>' : '') + '<a class="btn sm" href="#tema-' + e.topic + '-' + e.sub + '">Tananyag</a><button class="btn sm" type="button" data-a="del">Törlés</button></div></div>';
      }).join('') + (list.length > shown ? '<button class="btn" type="button" id="more-e">Még ' + (list.length - shown) + ' bejegyzés</button>' : '') : '<p class="dim">Nincs a szűrésnek megfelelő bejegyzés.</p>';
      var mb = $('#more-e', main); if (mb) on(mb, 'click', function () { shown += 40; draw(); });
    }
    function find(node) { var id = +node.closest('[data-id]').dataset.id, all = st.get('errors'); for (var i = 0; i < all.length; i++) if (all[i].id === id) return { all: all, i: i }; return null; }
    on($('#el', main), 'change', function (e) { var k = e.target.dataset.f; if (!k) return; var r = find(e.target); if (r) { r.all[r.i][k] = e.target.value; st.set('errors', r.all); if (k === 'type') stats(); } });
    on($('#el', main), 'click', function (e) {
      var a = e.target.dataset.a; if (!a) return; var r = find(e.target); if (!r) return;
      if (a === 'replay') { session.replay = { gen: r.all[r.i].gen, seed: r.all[r.i].seed }; location.hash = '#gyakorlas'; }
      else if (e.target.dataset.sure) { r.all.splice(r.i, 1); st.set('errors', r.all); stats(); draw(); }
      else { e.target.dataset.sure = 1; e.target.textContent = 'Biztosan törlöm'; }
    });
    $('#eq', main).value = f.q; $('#et', main).value = f.t; $('#ey', main).value = f.ty;
    on($('#eq', main), 'input', function (e) { f.q = e.target.value; shown = 40; draw(); });
    on($('#et', main), 'change', function (e) { f.t = e.target.value; shown = 40; draw(); });
    on($('#ey', main), 'change', function (e) { f.ty = e.target.value; shown = 40; draw(); });
    stats(); draw();
  };

  MO.practice = { allItems: allItems, allCards: allCards, itemCard: itemCard };
  U.render();
})();
