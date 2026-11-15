// A service worker előállítása: a program fájljainak listája és a tartalmukból képzett verziójel.
// Futtatás: node make-sw.js [a matek-os mappa útvonala]   (minden módosítás után, feltöltés előtt)
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const APP = path.resolve(process.argv[2] || path.join(__dirname, '../../matek-os'));
const files = [];
(function walk(d) { fs.readdirSync(d).sort().forEach(f => { const p = path.join(d, f), r = path.relative(APP, p).split(path.sep).join('/');
  if (fs.statSync(p).isDirectory()) { if (r !== 'vizsgak') walk(p); } else if (r !== 'sw.js') files.push(r); }); })(APP);
const h = crypto.createHash('sha1'); files.forEach(f => { h.update(f); h.update(fs.readFileSync(path.join(APP, f))); });
const ver = h.digest('hex').slice(0, 10);
const sw = `/* MATEK OS – service worker (előállítva: build/tools/make-sw.js). Ne szerkeszd kézzel. */
'use strict';
var VERSION = '${ver}', CORE = 'matekos-core-' + VERSION, EXAMS = 'matekos-vizsgak-v1';
var FILES = ${JSON.stringify(['./'].concat(files))};
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
`;
fs.writeFileSync(path.join(APP, 'sw.js'), sw);
console.log('sw.js kész: ' + files.length + ' fájl, verzió ' + ver + ', ' + (files.reduce((a, f) => a + fs.statSync(path.join(APP, f)).size, 0) / 1048576).toFixed(1) + ' MB');
