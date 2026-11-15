/* MATEK OS – offline működés: a service worker bejegyzése és a feladatsorok letöltése.
   A program fájljait a service worker az első betöltéskor elmenti; a feladatsorok képei
   megnyitáskor vagy a „Letöltés offline-ra” gombbal kerülnek a tárolóba. */
(function (root) {
  'use strict';
  var MO = root.MO = root.MO || {}, EXAMS = 'matekos-vizsgak-v1';
  var web = typeof location !== 'undefined' && /^https?:$/.test(location.protocol);
  var O = MO.offline = {
    supported: !!(web && typeof navigator !== 'undefined' && 'serviceWorker' in navigator && typeof caches !== 'undefined'),
    /* egy feladatsor fájljai (DOM nélkül is tesztelhető) */
    files: function (id) { var o = ['vizsgak/' + id + '/data.js']; for (var n = 1; n <= 9; n++) o.push('vizsgak/' + id + '/f' + n + '.png', 'vizsgak/' + id + '/m' + n + '.png'); return o; },
    url: function (f) { return new URL(f, location.href).href; },
    /* hány fájl van meg a tárolóban */
    status: function (id) {
      return caches.open(EXAMS).then(function (c) { return Promise.all(O.files(id).map(function (f) { return c.match(O.url(f)); })); })
        .then(function (r) { var have = r.filter(Boolean).length; return { have: have, total: r.length, done: have === r.length }; });
    },
    download: function (id, onProgress) {
      var fs = O.files(id), k = 0;
      return caches.open(EXAMS).then(function (c) {
        return fs.reduce(function (p, f) {
          return p.then(function () { return c.match(O.url(f)); }).then(function (hit) {
            if (hit) return; return fetch(O.url(f)).then(function (res) { if (!res.ok) throw new Error('A letöltés nem sikerült: ' + f); return c.put(O.url(f), res); });
          }).then(function () { k++; if (onProgress) onProgress(k, fs.length); });
        }, Promise.resolve());
      });
    },
    remove: function (id) { return caches.open(EXAMS).then(function (c) { return Promise.all(O.files(id).map(function (f) { return c.delete(O.url(f)); })); }); },
    removeAll: function () { return caches.delete(EXAMS); },
    /* a teljesen letöltött feladatsorok azonosítói */
    list: function () { return Promise.all((MO.exams || []).map(function (e) { return O.status(e.id).then(function (s) { return s.done ? e.id : null; }); })).then(function (r) { return r.filter(Boolean); }); }
  };
  /* a manifestet csak webcímről kötjük be: fájlból megnyitva a böngésző hibát jelezne rá */
  if (web && typeof document !== 'undefined') { var ml = document.createElement('link'); ml.rel = 'manifest'; ml.href = 'manifest.webmanifest'; document.head.appendChild(ml); }
  if (O.supported) root.addEventListener('load', function () { navigator.serviceWorker.register('sw.js').catch(function () { /* offline mód nélkül is működik */ }); });

  if (!MO.ui) return;
  var U = MO.ui, V = U.V, el = U.el, $ = U.$, on = U.on;
  /* Adatok oldal: offline tároló */
  var oldAdatok = V.adatok;
  V.adatok = function () {
    oldAdatok();
    if (!O.supported) return;
    var c = el('<div><h2>Offline használat</h2><div class="card"><p id="ofs" class="dim">Ellenőrzés…</p><div class="row"><button class="btn sm" type="button" id="ofa">Minden feladatsor letöltése</button><button class="btn sm" type="button" id="ofd">Letöltött feladatsorok törlése</button></div><p class="dim" style="margin-top:10px">A tananyag, a képlettár, a labor és a gyakorlás internet nélkül is működik. A hivatalos feladatsorok képei (összesen kb. 38 MB) külön tölthetők le, egyenként a feladatsor oldalán is.</p></div></div>');
    U.main.appendChild(c);
    var total = (MO.exams || []).length, busy = false;
    function show() { O.list().then(function (l) { var s = $('#ofs', c); if (s) s.textContent = l.length + ' / ' + total + ' feladatsor érhető el internet nélkül.'; }); }
    on($('#ofa', c), 'click', function () {
      if (busy) return; busy = true; var b = this, i = 0, ex = MO.exams || [];
      (function next() {
        if (i >= ex.length || !document.body.contains(b)) { busy = false; if (document.body.contains(b)) { b.textContent = 'Minden feladatsor letöltése'; show(); } return; }
        b.textContent = 'Letöltés: ' + (i + 1) + ' / ' + ex.length;
        O.download(ex[i].id).then(function () { i++; next(); }, function () { busy = false; b.textContent = 'A letöltés megszakadt – újra'; show(); });
      })();
    });
    on($('#ofd', c), 'click', function () { if (this.dataset.sure) { var b = this; O.removeAll().then(function () { b.textContent = 'Letöltött feladatsorok törlése'; delete b.dataset.sure; show(); }); } else { this.dataset.sure = 1; this.textContent = 'Biztosan törlöm'; } });
    show();
  };
  /* a feladatsor oldalán megjelenő letöltőkártya (az exam.js hívja) */
  O.card = function (id) {
    if (!O.supported) return null;
    var c = el('<div class="card"><div class="row" style="justify-content:space-between;align-items:center"><span id="oft" class="dim" style="flex:1;min-width:160px">Ellenőrzés…</span><button class="btn sm" type="button" id="ofb" hidden></button></div></div>'), state = null;
    function show() { O.status(id).then(function (s) { state = s; $('#oft', c).textContent = s.done ? 'Ez a feladatsor internet nélkül is elérhető.' : 'Internet nélküli használathoz töltsd le a feladatsor képeit (' + s.have + ' / ' + s.total + ' fájl megvan).'; var b = $('#ofb', c); b.hidden = false; b.textContent = s.done ? 'Törlés a készülékről' : 'Letöltés offline-ra'; }); }
    on($('#ofb', c), 'click', function () {
      var b = this; if (!state) return;
      if (state.done) O.remove(id).then(show);
      else { b.disabled = true; O.download(id, function (k, n) { b.textContent = k + ' / ' + n; }).then(function () { b.disabled = false; show(); }, function () { b.disabled = false; $('#oft', c).textContent = 'A letöltés nem sikerült. Ellenőrizd az internetkapcsolatot.'; b.textContent = 'Újra'; state = { done: false }; }); }
    });
    show();
    return c;
  };
})(typeof window !== 'undefined' ? window : globalThis);
