/* MATEK OS – Alapok: paraméteres feladatgenerátorok. DOM-független.
   Minden generátor ad egy „verify” kifejezést is: a tesztek ezt a CAS-motorral
   számolják ki, és összevetik a megadott megoldással. */
(function (root) {
  'use strict';
  var MO = root.MO = root.MO || {};
  var Q = MO.Q, R = String.raw;
  var G = MO.gens = MO.gens || {};
  function T(x, d) { return MO.tnum(x, d); }
  function fr(n, d) { return (n < 0 ? '-' : '') + R`\dfrac{${Math.abs(n)}}{${d}}`; }
  function sgn(x) { return x < 0 ? '-' : '+'; }
  function par(x) { return x < 0 ? '(' + x + ')' : String(x); }
  function def(id, sub, level, title, gen) { G[id] = { id: id, topic: 'alapok', sub: sub, level: level, title: title, gen: gen }; }
  var DEN = [2, 3, 4, 5, 6, 8, 9, 10, 12];
  function properFrac(r) { var d = r.pick(DEN); return Q.make(r.int(1, d - 1), d); }

  /* ---------- Törtek ---------- */
  def('tort-1', 'tortek', 1, 'Törtek összeadása, kivonása', function (r) {
    var a = properFrac(r), b = properFrac(r), minus = r() < 0.5;
    while (b.d === a.d) b = properFrac(r);
    var res = minus ? Q.sub(a, b) : Q.add(a, b), L = MO.lcm(a.d, b.d), op = minus ? '-' : '+';
    var x = a.n * L / a.d, y = b.n * L / b.d, top = minus ? x - y : x + y;
    return {
      q: R`Számítsd ki, és add meg a legegyszerűbb alakban: $${Q.tex(a)} ${op} ${Q.tex(b)}$`,
      answer: { type: 'num', value: Q.val(res) }, ansTex: Q.tex(res),
      verify: `${a.n}/${a.d}${op}${b.n}/${b.d}`,
      tip1: 'Hozd közös nevezőre a két törtet.',
      tip2: R`A legkisebb közös nevező a két nevező legkisebb közös többszöröse: $${L}$.`,
      sol: [R`A közös nevező $[${a.d};${b.d}] = ${L}$.`,
        R`$${Q.tex(a)} ${op} ${Q.tex(b)} = ${fr(x, L)} ${op} ${fr(y, L)} = ${fr(top, L)}$`,
        (MO.gcd(top, L) > 1 ? R`A számláló és a nevező közös osztója $${MO.gcd(top, L)}$, egyszerűsítés után: ` : 'Ez már nem egyszerűsíthető: ') + R`$${Q.tex(res)}$.`]
    };
  });

  def('tort-2', 'tortek', 2, 'Törtek osztása és kivonása', function (r) {
    var a = properFrac(r), c = properFrac(r), e = properFrac(r);
    var quo = Q.div(a, c), res = Q.sub(quo, e);
    return {
      q: R`Számítsd ki: $${Q.tex(a)} : ${Q.tex(c)} - ${Q.tex(e)}$`,
      answer: { type: 'num', value: Q.val(res) }, ansTex: Q.tex(res),
      verify: `(${a.n}/${a.d})/(${c.n}/${c.d})-${e.n}/${e.d}`,
      tip1: 'Az osztás előbb jön, mint a kivonás.',
      tip2: 'Törttel úgy osztunk, hogy a reciprokával szorzunk.',
      sol: [R`Először az osztás: $${Q.tex(a)} : ${Q.tex(c)} = ${Q.tex(a)} \cdot ${fr(c.d, c.n)} = ${Q.tex(quo)}$.`,
        R`Utána a kivonás: $${Q.tex(quo)} - ${Q.tex(e)} = ${Q.tex(res)}$.`]
    };
  });

  def('tort-3', 'tortek', 3, 'Emeletes tört', function (r) {
    var a, b, c, e, den;
    do { a = properFrac(r); b = properFrac(r); c = properFrac(r); e = properFrac(r); den = Q.sub(c, e); } while (den.n === 0);
    var num = Q.add(a, b), res = Q.div(num, den);
    return {
      q: R`Számítsd ki: $\dfrac{${Q.tex(a)} + ${Q.tex(b)}}{${Q.tex(c)} - ${Q.tex(e)}}$`,
      answer: { type: 'num', value: Q.val(res) }, ansTex: Q.tex(res),
      verify: `(${a.n}/${a.d}+${b.n}/${b.d})/(${c.n}/${c.d}-${e.n}/${e.d})`,
      tip1: 'Számold ki külön a számlálót és külön a nevezőt.',
      tip2: 'A főtörtvonal osztást jelent: a számlálót szorozd a nevező reciprokával.',
      sol: [R`Számláló: $${Q.tex(a)} + ${Q.tex(b)} = ${Q.tex(num)}$.`,
        R`Nevező: $${Q.tex(c)} - ${Q.tex(e)} = ${Q.tex(den)}$.`,
        R`Hányados: $${Q.tex(num)} : ${den.n < 0 ? R`\left(${Q.tex(den)}\right)` : Q.tex(den)} = ${Q.tex(res)}$.`]
    };
  });

  /* ---------- Százalék ---------- */
  def('szaz-1', 'szazalek', 1, 'Százalékérték', function (r) {
    var X = 20 * r.int(2, 60), p = r.pick([5, 12, 15, 20, 25, 35, 40, 60, 75, 120]), v = X * p / 100;
    return {
      q: R`Mennyi a $${p}\%$-a ennek a számnak: $${X}$?`,
      answer: { type: 'num', value: v }, ansTex: T(v), verify: `${X}*${p}/100`,
      tip1: R`A $p\%$ azt jelenti: $\dfrac{p}{100}$-ad rész.`,
      tip2: R`Szorozd meg az alapot ezzel: $${T(p / 100)}$.`,
      sol: [R`$${X} \cdot \dfrac{${p}}{100} = ${X} \cdot ${T(p / 100)} = ${T(v)}$`]
    };
  });

  def('szaz-2', 'szazalek', 2, 'Egymás utáni változások', function (r) {
    var p = r.pick([10, 20, 25, 30, 40, 50]), q = r.pick([10, 20, 25, 30, 40]);
    var f = (1 + p / 100) * (1 - q / 100), ch = Math.round((f - 1) * 1e6) / 1e4;
    return {
      q: R`Egy termék árát először $${p}\%$-kal megemelték, majd az új árat $${q}\%$-kal csökkentették. Hány százalékkal változott összesen az ár az eredetihez képest? (Csökkenésnél negatív számot írj.)`,
      answer: { type: 'num', value: ch, tol: 1e-6 }, ansTex: T(ch) + R`\%`, verify: `((1+${p}/100)*(1-${q}/100)-1)*100`,
      tip1: 'A két változás nem adható össze: a második már a megváltozott árra vonatkozik.',
      tip2: R`Szorozd össze a szorzótényezőket: $${T(1 + p / 100)}$ és $${T(1 - q / 100)}$.`,
      sol: [R`Az emelés szorzótényezője $${T(1 + p / 100)}$, a csökkentésé $${T(1 - q / 100)}$; a második a már megemelt árra hat.`,
        R`$${T(1 + p / 100)} \cdot ${T(1 - q / 100)} = ${T(f)}$`,
        R`Az ár tehát az eredeti $${T(f * 100)}\%$-a, a változás $${T(ch)}\%$` + (ch < 0 ? ' (csökkenés).' : ch > 0 ? ' (növekedés).' : ' (nem változott).')]
    };
  });

  def('szaz-3', 'szazalek', 3, 'Az alap visszakeresése', function (r) {
    var p = r.pick([10, 15, 20, 25, 30, 40]), O = 2000 * r.int(2, 30), Y = O * (100 - p) / 100;
    return {
      q: R`Egy kabát ára $${p}\%$-os leárazás után $${MO.tbig(Y)}$ Ft. Mennyi volt az eredeti ára forintban?`,
      answer: { type: 'num', value: O }, ansTex: MO.tbig(O) + R`\text{ Ft}`, verify: `${Y}/(1-${p}/100)`,
      tip1: R`A leárazott ár az eredeti ár $${100 - p}\%$-a.`,
      tip2: R`Oszd el a leárazott árat ezzel: $${T((100 - p) / 100)}$.`,
      sol: [R`Ha az eredeti ár $x$ Ft, akkor $${T((100 - p) / 100)} \cdot x = ${MO.tbig(Y)}$.`,
        R`$x = ${MO.tbig(Y)} : ${T((100 - p) / 100)} = ${MO.tbig(O)}$`,
        R`Ellenőrzés: $${MO.tbig(O)} \cdot ${T((100 - p) / 100)} = ${MO.tbig(Y)}$. Az eredeti ár $${MO.tbig(O)}$ Ft volt.`]
    };
  });

  /* ---------- Hatványozás ---------- */
  def('hatv-1', 'hatvany', 1, 'Azonos alapú hatványok', function (r) {
    var b = r.pick([2, 3, 5]), m, n, k, e;
    do { m = r.int(-3, 6); n = r.int(-3, 6); k = r.int(-3, 6); e = m + n - k; } while (e < 0 || e > 4 || m === 0 || n === 0 || k === 0);
    var v = Math.pow(b, e);
    return {
      q: R`Számítsd ki: $\dfrac{${b}^{${m}} \cdot ${b}^{${n}}}{${b}^{${k}}}$`,
      answer: { type: 'num', value: v }, ansTex: String(v), verify: `(${b}^(${m})*${b}^(${n}))/${b}^(${k})`,
      tip1: 'Azonos alapú hatványok szorzásakor a kitevők összeadódnak, osztásakor kivonódnak.',
      tip2: R`A kitevő: $${m} + ${par(n)} - ${par(k)}$.`,
      sol: [R`$\dfrac{${b}^{${m}} \cdot ${b}^{${n}}}{${b}^{${k}}} = ${b}^{${m} + ${par(n)} - ${par(k)}} = ${b}^{${e}} = ${v}$`]
    };
  });

  def('hatv-2', 'hatvany', 2, 'Hatvány hatványa', function (r) {
    var m = r.int(2, 4), n = r.int(2, 3), k = r.nz(-3, 5), j = r.int(1, 6), E = m * n + k - j;
    return {
      q: R`Írd fel $a$ egyetlen hatványaként ($a > 0$): $\dfrac{\left(a^{${m}}\right)^{${n}} \cdot a^{${k}}}{a^{${j}}}$`,
      answer: { type: 'expr', expr: `a^(${E})` }, ansTex: E === 0 ? R`a^{0} = 1` : R`a^{${E}}`,
      verify: `((a^${m})^${n}*a^(${k}))/a^${j}`,
      tip1: 'Hatvány hatványozásakor a kitevők összeszorzódnak.',
      tip2: R`A kitevő: $${m} \cdot ${n} + ${par(k)} - ${j}$.`,
      sol: [R`$\left(a^{${m}}\right)^{${n}} = a^{${m * n}}$`,
        R`$\dfrac{a^{${m * n}} \cdot a^{${k}}}{a^{${j}}} = a^{${m * n} + ${par(k)} - ${j}} = a^{${E}}$` + (E === 0 ? R`$\; = 1$` : '')]
    };
  });

  def('hatv-3', 'hatvany', 3, 'Normálalak', function (r) {
    var p = r.pick([2, 4, 6, 8]), q = r.pick([1.5, 2.5, 3, 4.5]), d = r.pick([2, 4, 5]);
    var m = r.nz(-6, 8), n = r.nz(-6, 8), k = r.nz(-4, 6), M = p * q / d, e = m + n - k;
    while (M >= 10) { M /= 10; e++; } while (M < 1) { M *= 10; e--; }
    M = Math.round(M * 1e9) / 1e9;
    var v = p * q / d * Math.pow(10, m + n - k);
    return {
      q: R`Számítsd ki, és add meg normálalakban: $\dfrac{\left(${T(p)} \cdot 10^{${m}}\right) \cdot \left(${T(q)} \cdot 10^{${n}}\right)}{${d} \cdot 10^{${k}}}$` + '\nBeírás például így: 3,2*10^5',
      answer: { type: 'num', value: v, rel: 1e-9 }, ansTex: R`${T(M)} \cdot 10^{${e}}`,
      verify: `((${p}*10^(${m}))*(${q}*10^(${n})))/(${d}*10^(${k}))`,
      tip1: 'Külön számolj a számokkal és külön a tíz hatványaival.',
      tip2: R`A normálalakban a szorzó $1$ és $10$ közé esik: $1 \le a < 10$.`,
      sol: [R`Számok: $\dfrac{${T(p)} \cdot ${T(q)}}{${d}} = ${T(p * q / d)}$.`,
        R`Tíz hatványai: $10^{${m} + ${par(n)} - ${par(k)}} = 10^{${m + n - k}}$.`,
        R`Az eredmény $${T(p * q / d)} \cdot 10^{${m + n - k}}$` + (p * q / d >= 10 || p * q / d < 1 ? R`, normálalakban $${T(M)} \cdot 10^{${e}}$.` : ', ez már normálalak.')]
    };
  });

  /* ---------- Betűs kifejezések ---------- */
  function poly2(A, B2, C2) {
    var s = '';
    if (A) s += (A === 1 ? '' : A === -1 ? '-' : A) + 'x^2';
    if (B2) s += (s ? (B2 < 0 ? '-' : '+') : (B2 < 0 ? '-' : '')) + (Math.abs(B2) === 1 ? '' : Math.abs(B2)) + 'x';
    if (C2) s += (s ? (C2 < 0 ? '-' : '+') : (C2 < 0 ? '-' : '')) + Math.abs(C2);
    return s || '0';
  }
  def('betu-1', 'betus', 1, 'Kéttagú négyzete', function (r) {
    var b = r.int(1, 4), a = r.nz(-9, 9), bx = (b === 1 ? '' : b) + 'x';
    var exp = poly2(b * b, 2 * a * b, a * a);
    return {
      q: R`Bontsd fel a zárójelet: $\left(${bx} ${sgn(a)} ${Math.abs(a)}\right)^{2}$`,
      answer: { type: 'expr', expr: exp, noParen: true }, ansTex: exp.replace(/\^2/g, '^{2}'),
      verify: `(${b}*x+(${a}))^2`,
      tip1: R`Használd a nevezetes azonosságot: $(u \pm v)^2 = u^2 \pm 2uv + v^2$.`,
      tip2: R`Itt $u = ${bx}$ és $v = ${Math.abs(a)}$; a kétszeres szorzat $2 \cdot ${bx} \cdot ${Math.abs(a)}$.`,
      sol: [R`$\left(${bx} ${sgn(a)} ${Math.abs(a)}\right)^{2} = (${bx})^2 ${sgn(a)} 2 \cdot ${bx} \cdot ${Math.abs(a)} + ${Math.abs(a)}^2 = ${exp.replace(/\^2/g, '^{2}')}$`]
    };
  });

  def('betu-2', 'betus', 2, 'Szorzás és összevonás', function (r) {
    var a = r.int(2, 4), b = r.nz(-6, 6), c = r.int(1, 3), d = r.nz(-6, 6), e = r.nz(-5, 5);
    var cx = (c === 1 ? '' : c) + 'x';
    var p1 = poly2(a * c, a * d + b * c, b * d), p2 = poly2(1, 2 * e, e * e);
    var res = poly2(a * c - 1, a * d + b * c - 2 * e, b * d - e * e), t = function (s) { return s.replace(/\^2/g, '^{2}'); };
    return {
      q: R`Végezd el a műveleteket, és vond össze: $(${a}x ${sgn(b)} ${Math.abs(b)})(${cx} ${sgn(d)} ${Math.abs(d)}) - (x ${sgn(e)} ${Math.abs(e)})^{2}$`,
      answer: { type: 'expr', expr: res, noParen: true }, ansTex: t(res),
      verify: `(${a}*x+(${b}))*(${c}*x+(${d}))-(x+(${e}))^2`,
      tip1: 'Minden tagot minden taggal szorozz meg, a négyzetet pedig bontsd fel azonossággal.',
      tip2: 'A kivonásnál a felbontott négyzet minden tagjának előjele megfordul.',
      sol: [R`$(${a}x ${sgn(b)} ${Math.abs(b)})(${cx} ${sgn(d)} ${Math.abs(d)}) = ${t(p1)}$`,
        R`$(x ${sgn(e)} ${Math.abs(e)})^{2} = ${t(p2)}$`,
        R`A különbség: $${t(p1)} - \left(${t(p2)}\right) = ${t(res)}$`]
    };
  });

  def('betu-3', 'betus', 3, 'Algebrai tört egyszerűsítése', function (r) {
    var a = r.nz(-7, 7), b = r.nz(-7, 7); while (b === a) b = r.nz(-7, 7);
    var num = poly2(1, a + b, a * b), t = function (s) { return s.replace(/\^2/g, '^{2}'); };
    var res = 'x' + (b < 0 ? '-' : '+') + Math.abs(b);
    return {
      q: R`Egyszerűsítsd a törtet ($x \ne ${-a}$): $\dfrac{${t(num)}}{x ${sgn(a)} ${Math.abs(a)}}$`,
      answer: { type: 'expr', expr: res, noParen: true }, ansTex: res,
      verify: `(${num})/(x+(${a}))`,
      tip1: 'Alakítsd szorzattá a számlálót.',
      tip2: R`Keress két számot, amelyek összege $${a + b}$, szorzata $${a * b}$.`,
      sol: [R`A számláló szorzatalakja: $${t(num)} = (x ${sgn(a)} ${Math.abs(a)})(x ${sgn(b)} ${Math.abs(b)})$, mert $${par(a)} + ${par(b)} = ${a + b}$ és $${par(a)} \cdot ${par(b)} = ${a * b}$.`,
        R`Mivel $x \ne ${-a}$, a nevezővel egyszerűsíthetünk: $\dfrac{(x ${sgn(a)} ${Math.abs(a)})(x ${sgn(b)} ${Math.abs(b)})}{x ${sgn(a)} ${Math.abs(a)}} = ${res}$`]
    };
  });

  /* ---------- Mértékegységek ---------- */
  def('mert-1', 'mertek', 1, 'Sebesség átváltása', function (r) {
    var v = 18 * r.int(1, 8), ms = v / 3.6;
    return {
      q: R`Hány $\dfrac{\text{m}}{\text{s}}$ a $${v}\ \dfrac{\text{km}}{\text{h}}$ sebesség?`,
      answer: { type: 'num', value: ms }, ansTex: T(ms) + R`\ \dfrac{\text{m}}{\text{s}}`, verify: `${v}*1000/3600`,
      tip1: R`$1\ \text{km} = 1000\ \text{m}$ és $1\ \text{h} = 3600\ \text{s}$.`,
      tip2: R`A km/h-ban adott értéket el kell osztani ezzel: $3{,}6$.`,
      sol: [R`$${v}\ \dfrac{\text{km}}{\text{h}} = \dfrac{${v} \cdot 1000\ \text{m}}{3600\ \text{s}} = ${T(ms)}\ \dfrac{\text{m}}{\text{s}}$`]
    };
  });

  var UNITS = [
    ['m^2', 'cm^2', 1e4, R`1\ \text{m} = 100\ \text{cm}`, R`100^2`], ['dm^2', 'cm^2', 100, R`1\ \text{dm} = 10\ \text{cm}`, R`10^2`],
    ['m^3', 'dm^3', 1000, R`1\ \text{m} = 10\ \text{dm}`, R`10^3`], ['dm^3', 'cm^3', 1000, R`1\ \text{dm} = 10\ \text{cm}`, R`10^3`],
    ['km^2', 'm^2', 1e6, R`1\ \text{km} = 1000\ \text{m}`, R`1000^2`], ['cm^3', 'mm^3', 1000, R`1\ \text{cm} = 10\ \text{mm}`, R`10^3`]
  ];
  function ut(u) { var m = u.split('^'); return R`\text{${m[0]}}^{${m[1]}}`; }
  def('mert-2', 'mertek', 2, 'Terület és térfogat átváltása', function (r) {
    var u = r.pick(UNITS), x = r.pick([0.3, 0.75, 1.2, 2.5, 4, 12.5]), v = Math.round(x * u[2] * 1e6) / 1e6;
    return {
      q: R`Váltsd át: $${T(x)}\ ${ut(u[0])}$ hány $${ut(u[1])}$?`,
      answer: { type: 'num', value: v, rel: 1e-9 }, ansTex: MO.tbig(v) + R`\ ${ut(u[1])}`, verify: `${x}*${u[2]}`,
      tip1: R`Induló pont: $${u[3]}$.`,
      tip2: 'Területnél a váltószám négyzetével, térfogatnál a köbével kell szorozni.',
      sol: [R`$${u[3]}$, ezért $1\ ${ut(u[0])} = ${u[4]}\ ${ut(u[1])} = ${MO.tbig(u[2])}\ ${ut(u[1])}$.`,
        R`$${T(x)} \cdot ${MO.tbig(u[2])} = ${MO.tbig(v)}$, tehát $${T(x)}\ ${ut(u[0])} = ${MO.tbig(v)}\ ${ut(u[1])}$.`]
    };
  });

  def('mert-3', 'mertek', 3, 'Összetett átváltás', function (r) {
    if (r() < 0.5) {
      var rho = r.pick([0.8, 1.2, 2.7, 7.8, 11.3]), v = rho * 1000;
      return {
        q: R`Egy anyag sűrűsége $${T(rho)}\ \dfrac{\text{g}}{\text{cm}^3}$. Mennyi ez $\dfrac{\text{kg}}{\text{m}^3}$-ben?`,
        answer: { type: 'num', value: v, rel: 1e-9 }, ansTex: MO.tbig(v) + R`\ \dfrac{\text{kg}}{\text{m}^3}`, verify: `${rho}/1000*1000000`,
        tip1: R`$1\ \text{g} = 0{,}001\ \text{kg}$ és $1\ \text{cm}^3 = 0{,}000\,001\ \text{m}^3$.`,
        tip2: 'A számlálót és a nevezőt külön váltsd át, aztán oszd el őket.',
        sol: [R`$1\ \dfrac{\text{g}}{\text{cm}^3} = \dfrac{10^{-3}\ \text{kg}}{10^{-6}\ \text{m}^3} = 1000\ \dfrac{\text{kg}}{\text{m}^3}$`,
          R`$${T(rho)} \cdot 1000 = ${MO.tbig(v)}$, tehát a sűrűség $${MO.tbig(v)}\ \dfrac{\text{kg}}{\text{m}^3}$.`]
      };
    }
    var sp = r.pick([54, 72, 90, 108]), t = r.pick([5, 10, 15, 20, 25]), s = sp * 1000 / 60 * t;
    return {
      q: R`Egy autó $${sp}\ \dfrac{\text{km}}{\text{h}}$ állandó sebességgel halad. Hány métert tesz meg $${t}$ perc alatt?`,
      answer: { type: 'num', value: s, rel: 1e-9 }, ansTex: MO.tbig(s) + R`\ \text{m}`, verify: `${sp}*1000/3600*${t}*60`,
      tip1: 'Hozd azonos mértékegységre a sebességet és az időt.',
      tip2: R`$${sp}\ \dfrac{\text{km}}{\text{h}} = ${T(sp / 3.6)}\ \dfrac{\text{m}}{\text{s}}$, és $${t}$ perc $= ${t * 60}$ s.`,
      sol: [R`$${sp}\ \dfrac{\text{km}}{\text{h}} = ${T(sp / 3.6)}\ \dfrac{\text{m}}{\text{s}}$, az idő $${t} \cdot 60 = ${t * 60}\ \text{s}$.`,
        R`$s = v \cdot t = ${T(sp / 3.6)} \cdot ${t * 60} = ${MO.tbig(s)}\ \text{m}$`]
    };
  });

  /* ---------- Arányosság ---------- */
  def('arany-1', 'aranyossag', 1, 'Egyenes arányosság', function (r) {
    var u = r.pick([240, 360, 450, 520, 680]), a = r.int(2, 6), c = r.int(7, 15);
    return {
      q: R`$${a}$ kg alma $${MO.tbig(u * a)}$ Ft-ba kerül. Mennyibe kerül ugyanebből $${c}$ kg?`,
      answer: { type: 'num', value: u * c }, ansTex: MO.tbig(u * c) + R`\text{ Ft}`, verify: `${u * a}/${a}*${c}`,
      tip1: 'A tömeg és az ár egyenesen arányos: a hányadosuk állandó.',
      tip2: 'Számold ki először 1 kg árát.',
      sol: [R`1 kg ára: $${MO.tbig(u * a)} : ${a} = ${u}$ Ft.`, R`$${c}$ kg ára: $${c} \cdot ${u} = ${MO.tbig(u * c)}$ Ft.`]
    };
  });

  def('arany-2', 'aranyossag', 2, 'Fordított arányosság', function (r) {
    var total = r.pick([24, 36, 48, 60, 72, 120]), divs = [];
    for (var i = 2; i <= 12; i++) if (total % i === 0) divs.push(i);
    var n = r.pick(divs), m = r.pick(divs); while (m === n) m = r.pick(divs);
    return {
      q: R`Egy munkát $${n}$ ugyanolyan teljesítményű munkás $${total / n}$ nap alatt végez el. Hány nap alatt végezne ugyanezzel $${m}$ munkás?`,
      answer: { type: 'num', value: total / m }, ansTex: (total / m) + R`\text{ nap}`, verify: `${n}*${total / n}/${m}`,
      tip1: 'A munkások száma és az idő fordítottan arányos: a szorzatuk állandó.',
      tip2: R`A teljes munka $${n} \cdot ${total / n}$ „munkásnap”.`,
      sol: [R`A munka $${n} \cdot ${total / n} = ${total}$ munkásnap.`, R`$${m}$ munkásnak ehhez $${total} : ${m} = ${total / m}$ nap kell.`]
    };
  });

  def('arany-3', 'aranyossag', 3, 'Arányos osztás', function (r) {
    var u = r.pick([1200, 1500, 2500, 4000]), a = r.int(1, 7), b = r.int(1, 7), c = r.int(1, 7);
    while (b === a) b = r.int(1, 7); while (c === a || c === b) c = r.int(1, 7);
    var S = u * (a + b + c), mx = Math.max(a, b, c);
    return {
      q: R`$${MO.tbig(S)}$ Ft-ot három testvér között $${a} : ${b} : ${c}$ arányban osztanak szét. Hány forintot kap az, aki a legtöbbet kapja?`,
      answer: { type: 'num', value: u * mx }, ansTex: MO.tbig(u * mx) + R`\text{ Ft}`, verify: `${S}/(${a}+${b}+${c})*${mx}`,
      tip1: 'Az összeget annyi egyenlő részre osztjuk, amennyi az arányszámok összege.',
      tip2: R`Egy rész értéke: $${MO.tbig(S)} : ${a + b + c}$.`,
      sol: [R`Az arányszámok összege $${a} + ${b} + ${c} = ${a + b + c}$, egy rész $${MO.tbig(S)} : ${a + b + c} = ${MO.tbig(u)}$ Ft.`,
        R`A legnagyobb arányszám $${mx}$, ehhez $${mx} \cdot ${MO.tbig(u)} = ${MO.tbig(u * mx)}$ Ft tartozik.`,
        R`Ellenőrzés: $${[a, b, c].map(function (k) { return MO.tbig(k * u); }).join(' + ')} = ${MO.tbig(S)}$.`]
    };
  });

  /* ---------- Ábraolvasás ---------- */
  var DAYS = ['H', 'K', 'Sze', 'Cs', 'P'], DAYNAMES = ['hétfőn', 'kedden', 'szerdán', 'csütörtökön', 'pénteken'];
  /* Az értékek 5 többszörösei, hogy a rácsvonalakról pontosan leolvashatók legyenek */
  function chart(r) {
    var v = [];
    for (var i = 0; i < 5; i++) { var x; do { x = 5 * r.int(2, 12); } while (v.indexOf(x) >= 0); v.push(x); }
    return { type: 'bar', title: 'Egy könyvtár kölcsönzései egy héten (db)', labels: DAYS, values: v };
  }
  def('abra-1', 'abra', 1, 'Leolvasás oszlopdiagramról', function (r) {
    var c = chart(r), mx = Math.max.apply(null, c.values), mn = Math.min.apply(null, c.values);
    return {
      q: 'Az oszlopdiagram egy könyvtár napi kölcsönzéseit mutatja. Mennyivel több könyvet kölcsönöztek a legforgalmasabb napon, mint a leggyengébb napon?',
      chart: c, answer: { type: 'num', value: mx - mn }, ansTex: String(mx - mn), verify: `${mx}-${mn}`,
      tip1: 'Olvasd le a legmagasabb és a legalacsonyabb oszlop értékét.',
      tip2: 'A két érték különbsége a válasz.',
      sol: [R`A legnagyobb érték $${mx}$ (${DAYNAMES[c.values.indexOf(mx)]}), a legkisebb $${mn}$ (${DAYNAMES[c.values.indexOf(mn)]}).`, R`$${mx} - ${mn} = ${mx - mn}$`]
    };
  });
  def('abra-2', 'abra', 2, 'Átlag a diagramból', function (r) {
    var c = chart(r), s = c.values.reduce(function (p, q) { return p + q; }, 0);
    return {
      q: 'Az oszlopdiagram egy könyvtár napi kölcsönzéseit mutatja. Átlagosan hány könyvet kölcsönöztek naponta ezen a héten?',
      chart: c, answer: { type: 'num', value: s / 5 }, ansTex: T(s / 5), verify: `(${c.values.join('+')})/5`,
      tip1: 'Az átlag az értékek összege osztva az értékek számával.',
      tip2: 'Öt nap adatát kell összeadni, majd öttel osztani.',
      sol: [R`$${c.values.join(' + ')} = ${s}$`, R`$${s} : 5 = ${T(s / 5)}$`]
    };
  });
  def('abra-3', 'abra', 3, 'Részesedés százalékban', function (r) {
    var c = chart(r), s = c.values.reduce(function (p, q) { return p + q; }, 0), i = r.int(0, 4), pct = c.values[i] / s * 100;
    return {
      q: `Az oszlopdiagram egy könyvtár napi kölcsönzéseit mutatja. A heti összes kölcsönzés hány százaléka történt ${DAYNAMES[i]}? Egy tizedesjegyre kerekítve add meg.`,
      chart: c, answer: { type: 'num', value: pct, tol: 0.0501 }, ansTex: T(pct, 1) + R`\%`, verify: `${c.values[i]}/(${c.values.join('+')})*100`,
      tip1: 'Először a heti összeget kell kiszámolni.',
      tip2: 'A keresett arány: a napi érték osztva a heti összeggel, szorozva százzal.',
      sol: [R`Heti összeg: $${c.values.join(' + ')} = ${s}$.`, R`$\dfrac{${c.values[i]}}{${s}} \cdot 100\% \approx ${T(pct, 1)}\%$`]
    };
  });

  MO.genList = function (filter) {
    return Object.keys(G).map(function (k) { return G[k]; }).filter(function (g) {
      return !filter || ((!filter.sub || g.sub === filter.sub) && (!filter.topic || g.topic === filter.topic) && (!filter.level || g.level === filter.level));
    });
  };
  MO.makeTask = function (genId, seed) {
    var g = G[genId], t = g.gen(MO.rng(seed));
    t.gen = genId; t.seed = seed; t.sub = g.sub; t.topic = g.topic; t.level = g.level; t.title = g.title;
    return t;
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = G;
})(typeof window !== 'undefined' ? window : globalThis);
