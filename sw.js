/* MATEK OS – service worker (előállítva: build/tools/make-sw.js). Ne szerkeszd kézzel. */
'use strict';
var VERSION = '9f0edd2b2f', CORE = 'matekos-core-' + VERSION, EXAMS = 'matekos-vizsgak-v1';
var FILES = ["./","css/app.css","icons/apple-touch-icon.png","icons/icon-192.png","icons/icon-512.png","icons/icon-maskable-512.png","index.html","js/bank-algebra.js","js/bank-fuggvenyek.js","js/bank-geometria.js","js/bank-gondolkodas.js","js/bank-valoszinuseg.js","js/cas.js","js/content-algebra1.js","js/content-algebra2.js","js/content-algebra3.js","js/content-fuggvenyek1.js","js/content-fuggvenyek2.js","js/content-geometria1.js","js/content-geometria2.js","js/content-gondolkodas.js","js/content-valoszinuseg.js","js/core.js","js/data-alapok.js","js/exam.js","js/exams-index.js","js/formulas-algebra.js","js/formulas-fuggvenyek.js","js/formulas-geometria.js","js/formulas-gondolkodas.js","js/formulas-valoszinuseg.js","js/models.js","js/offline.js","js/plot.js","js/plot3d.js","js/practice.js","js/sims-analizis1.js","js/sims-analizis2.js","js/sims-fv1.js","js/sims-fv2.js","js/sims-sikgeo.js","js/sims-statgraf.js","js/sims-szamelmelet.js","js/sims-tergeo.js","js/sims-valszam.js","js/taskkit.js","js/tasks-alapok.js","js/topics.js","js/ui.js","manifest.webmanifest","vendor/katex/fonts/KaTeX_AMS-Regular.woff2","vendor/katex/fonts/KaTeX_Caligraphic-Bold.woff2","vendor/katex/fonts/KaTeX_Caligraphic-Regular.woff2","vendor/katex/fonts/KaTeX_Fraktur-Bold.woff2","vendor/katex/fonts/KaTeX_Fraktur-Regular.woff2","vendor/katex/fonts/KaTeX_Main-Bold.woff2","vendor/katex/fonts/KaTeX_Main-BoldItalic.woff2","vendor/katex/fonts/KaTeX_Main-Italic.woff2","vendor/katex/fonts/KaTeX_Main-Regular.woff2","vendor/katex/fonts/KaTeX_Math-BoldItalic.woff2","vendor/katex/fonts/KaTeX_Math-Italic.woff2","vendor/katex/fonts/KaTeX_SansSerif-Bold.woff2","vendor/katex/fonts/KaTeX_SansSerif-Italic.woff2","vendor/katex/fonts/KaTeX_SansSerif-Regular.woff2","vendor/katex/fonts/KaTeX_Script-Regular.woff2","vendor/katex/fonts/KaTeX_Size1-Regular.woff2","vendor/katex/fonts/KaTeX_Size2-Regular.woff2","vendor/katex/fonts/KaTeX_Size3-Regular.woff2","vendor/katex/fonts/KaTeX_Size4-Regular.woff2","vendor/katex/fonts/KaTeX_Typewriter-Regular.woff2","vendor/katex/katex.min.css","vendor/katex/katex.min.js"];
self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CORE).then(function (c) { return c.addAll(FILES); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.filter(function (k) { return k.indexOf('matekos-core-') === 0 && k !== CORE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener('fetch', function (e) {
  var req = e.request, url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== self.location.origin) return;
  e.respondWith(caches.match(req, { ignoreSearch: true }).then(function (hit) {
    if (hit) return hit;
    return fetch(req).then(function (res) {
      /* a megnyitott feladatsorok fájljai megmaradnak offline használatra */
      if (res && res.ok && url.pathname.indexOf('/vizsgak/') >= 0) { var copy = res.clone(); caches.open(EXAMS).then(function (c) { c.put(req, copy); }); }
      return res;
    }).catch(function () {
      if (req.mode === 'navigate') return caches.match('./index.html');
      return new Response('', { status: 504, statusText: 'offline' });
    });
  }));
});
self.addEventListener('message', function (e) { if (e.data === 'version' && e.source) e.source.postMessage({ version: VERSION }); });
