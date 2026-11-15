/* MATEK OS – a tananyag térképe. A témakörök és a számozás az Oktatási Hivatal
   2024-től érvényes matematika vizsgakövetelményét követik (B rész). */
(function (root) {
  'use strict';
  var MO = root.MO = root.MO || {};
  function S(id, req, title) { return { id: id, req: req, title: title }; }
  MO.topics = [
    { id: 'alapok', title: 'Alapok', note: 'Előismeretek szintfelmérővel', subs: [
      S('tortek', '2.1, 2.3', 'Törtek'), S('szazalek', '2.7.1', 'Százalékszámítás'), S('hatvany', '2.5, 2.4', 'Hatványozás, normálalak'),
      S('betus', '2.6', 'Betűs kifejezések'), S('mertek', '', 'Mértékegységek'), S('aranyossag', '2.7', 'Arányosság'), S('abra', '5.1.1', 'Ábraolvasás')] },
    { id: 'gondolkodas', num: '1', title: 'Gondolkodási módszerek, halmazok, logika, kombinatorika, gráfok', subs: [
      S('halmazok', '1.1', 'Halmazok'), S('logika', '1.2', 'Matematikai logika'), S('kombinatorika', '1.3', 'Kombinatorika'), S('grafok', '1.4', 'Gráfok')] },
    { id: 'algebra', num: '2', title: 'Számelmélet, algebra', subs: [
      S('alapmuveletek', '2.1', 'Alapműveletek'), S('szamelmelet', '2.2', 'A természetes számok halmaza, számelméleti ismeretek'),
      S('racionalis', '2.3', 'Racionális és irracionális számok'), S('valos', '2.4', 'Valós számok'), S('hatvanygyoklog', '2.5', 'Hatvány, gyök, logaritmus'),
      S('betukifejezesek', '2.6', 'Betűkifejezések, nevezetes azonosságok'), S('aranyszazalek', '2.7', 'Arányosság, százalékszámítás'),
      S('egyenletek', '2.8', 'Egyenletek, egyenletrendszerek, egyenlőtlenségek, egyenlőtlenség-rendszerek'), S('kozepertekek', '2.9', 'Középértékek, egyenlőtlenségek')] },
    { id: 'fuggvenyek', num: '3', title: 'Függvények, az analízis elemei', subs: [
      S('fuggveny', '3.1', 'A függvény'), S('valosfv', '3.2', 'Egyváltozós valós függvények'), S('sorozatok', '3.3', 'Sorozatok'),
      S('hatarertek', '3.4.1', 'Határérték, folytonosság'), S('derivalas', '3.4.2', 'Differenciálszámítás'), S('integral', '3.4.3', 'Integrálszámítás')] },
    { id: 'geometria', num: '4', title: 'Geometria, koordinátageometria, trigonometria', subs: [
      S('elemigeo', '4.1', 'Elemi geometria'), S('transzformaciok', '4.2', 'Geometriai transzformációk'), S('alakzatok', '4.3', 'Síkbeli és térbeli alakzatok'),
      S('vektorok', '4.4', 'Vektorok síkban és térben'), S('trigonometria', '4.5', 'Trigonometria'), S('koordgeo', '4.6', 'Koordinátageometria'),
      S('keruletterulet', '4.7', 'Kerület, terület'), S('felszinterfogat', '4.8', 'Felszín, térfogat')] },
    { id: 'valoszinuseg', num: '5', title: 'Valószínűség-számítás, statisztika', subs: [
      S('statisztika', '5.1', 'Leíró statisztika'), S('valszam', '5.2', 'A valószínűség-számítás elemei')] }
  ];
  /* Az emelt szintű írásbeli szerkezete a vizsgaleírás (C rész) szerint, 2024-től */
  MO.examSpec = { minutes: 240, total: 115, part1: { tasks: 4, points: 51 }, part2: { tasks: 5, choose: 4, each: 16, points: 64 }, oral: { minutes: 20, points: 35 },
    shares: [['Gondolkodási módszerek, halmazok, logika, kombinatorika, gráfok', 20], ['Számelmélet, algebra', 25], ['Függvények, az analízis elemei', 20], ['Geometria, koordinátageometria, trigonometria', 20], ['Valószínűség-számítás, statisztika', 15]] };
  MO.findSub = function (tid, sid) {
    for (var i = 0; i < MO.topics.length; i++) if (MO.topics[i].id === tid) {
      var t = MO.topics[i]; for (var j = 0; j < t.subs.length; j++) if (t.subs[j].id === sid) return { topic: t, sub: t.subs[j], index: j };
      return { topic: t };
    }
    return null;
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = MO.topics;
})(typeof window !== 'undefined' ? window : globalThis);
