/* MATEK OS – tananyag: Számelmélet, algebra 2.1–2.4 (alapműveletek, számelmélet, racionális/irracionális, valós számok) */
(function (root) {
  'use strict';
  var MO = root.MO = root.MO || {};
  var K = MO.taskKit, R = K.R, def = K.def, Q = MO.Q;
  MO.content = MO.content || {};

  /* ---------- segédek ---------- */
  function toBase(n, b) { var s = ''; if (n === 0) return '0'; while (n > 0) { s = (n % b) + s; n = Math.floor(n / b); } return s; }
  function fromBase(s, b) { var v = 0, i; for (i = 0; i < s.length; i++) v = v * b + Number(s.charAt(i)); return v; }
  function polyOf(s, b) { var a = [], i; for (i = 0; i < s.length; i++) a.push(s.charAt(i) + '*' + b + '^' + (s.length - 1 - i)); return a.join('+'); }
  function factor(n) { var f = [], p = 2; while (p * p <= n) { if (n % p === 0) { var e = 0; while (n % p === 0) { n /= p; e++; } f.push([p, e]); } p++; } if (n > 1) f.push([n, 1]); return f; }
  function facTex(n) { return factor(n).map(function (x) { return x[1] > 1 ? x[0] + '^{' + x[1] + '}' : String(x[0]); }).join(' \\cdot '); }
  function grp(s) { s = String(s); var o = '', i; for (i = 0; i < s.length; i++) { if (i && (s.length - i) % 3 === 0) o += '\\,'; o += s.charAt(i); } return o; }
  function decStr(m, dp) { var s = String(m); while (s.length < dp + 1) s = '0' + s; return dp > 0 ? s.slice(0, s.length - dp) + '{,}' + s.slice(s.length - dp) : s; }
  function isSq(n) { var s = Math.round(Math.sqrt(n)); return s * s === n; }
  function zeros(n) { var s = ''; while (n-- > 0) s += '0'; return s; }

  /* ================= 2.1 ALAPMŰVELETEK ================= */
  MO.content['algebra/alapmuveletek'] = {
    intro: R`Az alapműveletek (összeadás, kivonás, szorzás, osztás) biztonságos elvégzése és azonosságaik ismerete a követelmény 2.1 pontja. Ez minden más feladat alapja: egyetlen előjelhiba vagy rossz műveleti sorrend az egész megoldást elviheti. Önálló követelménypont, de szinte minden feladatban ott van: törtek, negatív számok, zárójelek, zsebszámológépes számolás.`,
    theory: [
      { h: 'Az alapműveletek és tagjaik',
        b: R`Összeadás: $a + b = c$ (**összeadandók**, **összeg**). Kivonás: $a - b = c$ (**kisebbítendő**, **kivonandó**, **különbség**); a kivonás ugyanaz, mint az ellentett hozzáadása: $a - b = a + (-b)$. Szorzás: $a \cdot b = c$ (**tényezők**, **szorzat**). Osztás: $a : b = c$ (**osztandó**, **osztó**, **hányados**); az osztás ugyanaz, mint a reciprokkal szorzás: $a : b = a \cdot \dfrac{1}{b}$.\n**Fontos:** nullával osztani nem lehet. Az $a : 0$ kifejezésnek nincs értelme, a $0 : a$ ($a \ne 0$) értéke viszont $0$.` },
      { h: 'Műveleti azonosságok',
        b: R`Összeadásra és szorzásra igaz:\n- **kommutativitás** (felcserélhetőség): $a + b = b + a$, $a \cdot b = b \cdot a$;\n- **asszociativitás** (csoportosíthatóság): $(a + b) + c = a + (b + c)$, $(a \cdot b) \cdot c = a \cdot (b \cdot c)$;\n- **disztributivitás** (a szorzás az összeadásra nézve): $a \cdot (b + c) = a \cdot b + a \cdot c$. Visszafelé olvasva ez a **kiemelés**.\nA kivonás és az osztás **nem** kommutatív és **nem** asszociatív: $8 - 5 \ne 5 - 8$, és $8 - (5 - 2) = 5$, de $(8 - 5) - 2 = 1$.` },
      { h: 'Műveleti sorrend és előjelszabályok',
        b: R`Sorrend: 1. zárójelek (belülről kifelé); 2. hatványozás; 3. szorzás és osztás, balról jobbra haladva; 4. összeadás és kivonás, balról jobbra haladva.\nElőjelek: $(-a)(-b) = ab$, $(-a) \cdot b = -ab$, hasonlóan az osztásnál. Zárójel felbontása: $a - (b + c) = a - b - c$ és $a - (b - c) = a - b + c$ (a mínusz jel megfordítja a zárójelben lévő tagok előjelét).\nFigyelj: $-3^2 = -9$, de $(-3)^2 = 9$.` },
      { h: 'Törtek és tizedestörtek',
        b: R`Összeadás, kivonás: közös nevezőre hozás után a számlálókat adjuk össze: $\dfrac{a}{b} \pm \dfrac{c}{d} = \dfrac{ad \pm bc}{bd}$ (célszerű a legkisebb közös nevezőt választani). Szorzás: $\dfrac{a}{b} \cdot \dfrac{c}{d} = \dfrac{ac}{bd}$. Osztás: a második törtet megfordítjuk, és szorzunk: $\dfrac{a}{b} : \dfrac{c}{d} = \dfrac{a}{b} \cdot \dfrac{d}{c}$ ($c \ne 0$).\nA törtet egyszerűsíteni a számláló és a nevező közös osztójával lehet, **szorzat** esetén tényezőnként; összeg tagjait külön egyszerűsíteni nem szabad. Tizedestörtekkel úgy számolunk, mint az egész számokkal, csak a tizedesvessző helyére figyelünk.` },
      { h: 'Biztonságos számolás zsebszámológéppel',
        b: R`Zsebszámológépnél a legtöbb hiba a begépelésből jön: **zárójelezd** a számlálót és a nevezőt (például $\dfrac{3 + 5}{2 + 6}$ így kerül be: $(3+5)/(2+6)$), a negatív számokat és a hatványalapot is. Mindig **becsüld meg** az eredményt fejben (kerekített számokkal), és hasonlítsd a kijelzőhöz. Köztes eredményt ne kerekíts: a pontos értékkel (vagy a memóriával) számolj tovább, és csak a végén kerekíts a kért pontossággal. Ha az eredmény kerekített, $\approx$ jelet írj, ne $=$ jelet.` }
    ],
    examples: [
      { t: 'Műveleti sorrend negatív szám és hatvány esetén',
        p: R`Számítsd ki: $18 - 3 \cdot (4 - 7)^2 + 12 : 4$.`,
        steps: [R`Zárójel: $4 - 7 = -3$.`, R`Hatványozás: $(-3)^2 = 9$ (a zárójel miatt az alap a $-3$, ezért pozitív az eredmény).`, R`Szorzás és osztás: $3 \cdot 9 = 27$, és $12 : 4 = 3$.`, R`Összeadás, kivonás balról jobbra: $18 - 27 + 3 = -9 + 3 = -6$.`, R`Ellenőrzés számológéppel: $18 - 3 \cdot (4-7)^2 + 12/4 = -6$.`],
        ans: R`A kifejezés értéke $-6$.`,
        checks: [['4-7', '-3'], ['(-3)^2', '9'], ['3*9', '27'], ['18-27+12/4', '-6']] },
      { t: 'Fejben számolás kiemeléssel',
        p: R`Számítsd ki fejben, a disztributivitást használva: a) $97 \cdot 46 + 3 \cdot 46$; b) $99 \cdot 37$.`,
        steps: [R`a) Közös tényező a $46$: $97 \cdot 46 + 3 \cdot 46 = (97 + 3) \cdot 46$.`, R`$100 \cdot 46 = 4600$.`, R`b) A 99-et felírjuk $100 - 1$ alakban: $99 \cdot 37 = (100 - 1) \cdot 37 = 100 \cdot 37 - 1 \cdot 37$.`, R`$3700 - 37 = 3663$.`, R`Ellenőrzés: $3663 / 37 = 99$.`],
        ans: R`a) $4600$; b) $3663$.`,
        checks: [['97*46+3*46', '4600'], ['(97+3)*46', '4600'], ['99*37', '100*37-37'], ['3700-37', '3663'], ['3663/37', '99']] },
      { t: 'Emeletes tört értéke (emelt szintű alapművelet)',
        p: R`Számítsd ki a kifejezés pontos értékét egyszerűsített tört alakban: $\dfrac{\dfrac{2}{3} - \dfrac{1}{4}}{\dfrac{5}{6} + \dfrac{1}{2}}$.`,
        steps: [R`Kikötés: az osztás akkor értelmes, ha a nevező nem nulla; ezt a számítás végén ellenőrizzük. Számláló: közös nevező $12$: $\dfrac{2}{3} - \dfrac{1}{4} = \dfrac{8}{12} - \dfrac{3}{12} = \dfrac{5}{12}$.`, R`Nevező: közös nevező $6$: $\dfrac{5}{6} + \dfrac{1}{2} = \dfrac{5}{6} + \dfrac{3}{6} = \dfrac{8}{6} = \dfrac{4}{3}$.`, R`Osztás = szorzás a reciprokkal: $\dfrac{5}{12} : \dfrac{4}{3} = \dfrac{5}{12} \cdot \dfrac{3}{4} = \dfrac{15}{48}$.`, R`Egyszerűsítés 3-mal: $\dfrac{15}{48} = \dfrac{5}{16}$.`, R`Ellenőrzés tizedestörttel: $5/16 = 0{,}3125$, a számláló $0{,}41\overline{6}$, a nevező $1{,}\overline{3}$, hányadosuk valóban $0{,}3125$.`],
        ans: R`A kifejezés értéke $\dfrac{5}{16}$.`,
        checks: [['2/3-1/4', '5/12'], ['5/6+1/2', '4/3'], ['(5/12)/(4/3)', '5/16'], ['(2/3-1/4)/(5/6+1/2)', '5/16']] }
    ],
    sims: ['tortek', 'atvalto'],
    mistakes: [
      R`$-3^2$ és $(-3)^2$ nem ugyanaz: az első $-9$, a második $9$. A hatványozás előbb történik, mint az előjel hatása, hacsak zárójel nem védi a negatív alapot.`,
      R`Az $8 : 2 \cdot 4$ értéke $16$, nem $1$: a szorzást és az osztást balról jobbra végezzük, nem a "szorzás előbb" elv szerint.`,
      R`Zárójel előtti mínusz jelnél elfelejtik az előjelváltást: $a - (b - c) = a - b + c$, nem $a - b - c$.`,
      R`Az osztás nem disztributív az osztóra nézve: $\dfrac{a}{b + c} \ne \dfrac{a}{b} + \dfrac{a}{c}$ (például $\dfrac{1}{1+1} = \dfrac{1}{2}$, de $\dfrac{1}{1} + \dfrac{1}{1} = 2$). Számlálót lehet tagonként osztani, nevezőt nem.`,
      R`Összeg tagját "egyszerűsítik": $\dfrac{3 + 4}{3}$ nem egyenlő 4-gyel. Csak szorzat tényezőit szabad egyszerűsíteni.`,
      R`A kivonást és az osztást felcserélhetőnek gondolják: $5 - 3 \ne 3 - 5$, és $6 : 3 \ne 3 : 6$.`
    ],
    exam: R`A követelmény szerint közép- és emelt szinten is el kell tudni végezni az alapműveleteket biztonságosan (zsebszámológéppel is), és ismerni, használni kell a műveleti azonosságokat (kommutativitás, asszociativitás, disztributivitás). Minden tört-, egyenlet- és számolási feladatban használni kell: a műveleti sorrend és az előjelek pontossága a többi témában is az eredmény helyességének feltétele.`,
    cheat: [R`a + b = b + a,\quad a \cdot b = b \cdot a`, R`(a + b) + c = a + (b + c)`, R`a \cdot (b + c) = a \cdot b + a \cdot c`, R`a - (b - c) = a - b + c`, R`\dfrac{a}{b} \pm \dfrac{c}{d} = \dfrac{ad \pm bc}{bd}`, R`\dfrac{a}{b} : \dfrac{c}{d} = \dfrac{ad}{bc}`],
    cheatChecks: [['a*(b+c)', 'a*b+a*c'], ['a-(b-c)', 'a-b+c'], ['a/b+c/d', '(a*d+b*c)/(b*d)'], ['(a/b)/(c/d)', '(a*d)/(b*c)']],
    terms: ['alapműveletek', 'kommutativitás', 'asszociativitás', 'disztributivitás', 'műveleti sorrend', 'ellentett', 'reciprok', 'kiemelés', 'közös nevező', 'egyszerűsítés']
  };

  def('a1-alap-1', 'algebra', 'alapmuveletek', 1, 'Műveleti sorrend', function (r) {
    var a = r.int(5, 40), b = r.int(2, 9), c = r.int(1, 9), d = r.int(1, 9), f = r.int(2, 6), e = f * r.int(2, 9);
    if (c === d) c += 1;
    var v = a - b * (c - d) * (c - d) + e / f;
    return {
      q: R`Számítsd ki: $${a} - ${b} \cdot (${c} - ${d})^2 + ${e} : ${f}$`,
      answer: { type: 'num', value: v }, ansTex: K.T(v),
      verify: `${a}-${b}*(${c}-${d})^2+${e}/${f}`,
      tip1: R`Előbb a zárójel, aztán a hatványozás, végül a szorzás/osztás és az összeadás/kivonás jön.`,
      tip2: R`A zárójel értéke: $${c} - ${d} = ${c - d}$.`,
      sol: [R`Zárójel: $${c} - ${d} = ${K.T(c - d)}$, ennek négyzete $${(c - d) * (c - d)}$.`, R`Szorzás, osztás: $${b} \cdot ${(c - d) * (c - d)} = ${b * (c - d) * (c - d)}$, és $${e} : ${f} = ${e / f}$.`, R`$${a} - ${b * (c - d) * (c - d)} + ${e / f} = ${K.T(v)}$`]
    };
  });

  def('a1-alap-2', 'algebra', 'alapmuveletek', 2, 'Kiemelés, kényelmes számolás', function (r) {
    var A = r.int(11, 89), B = 100 - A, c = r.int(12, 99), plus = r.int(0, 1) === 0, v = 100 * c;
    var expr = plus ? `${A} \\cdot ${c} + ${B} \\cdot ${c}` : `${A + 100} \\cdot ${c} - ${A} \\cdot ${c}`;
    return {
      q: R`Számítsd ki a disztributivitás segítségével, kiemeléssel: $${expr}$`,
      answer: { type: 'num', value: v }, ansTex: K.T(v),
      verify: plus ? `(${A}+${B})*${c}` : `(${A + 100}-${A})*${c}`,
      tip1: R`Emeld ki a közös tényezőt: $ab + ac = a(b + c)$.`,
      tip2: R`A közös tényező a(z) $${c}$, a zárójelbe a másik két szám összege vagy különbsége kerül.`,
      sol: plus ? [R`Kiemelve: $(${A} + ${B}) \cdot ${c}$.`, R`$${A} + ${B} = 100$, tehát az érték $100 \cdot ${c} = ${K.T(v)}$.`] : [R`Kiemelve: $(${A + 100} - ${A}) \cdot ${c}$.`, R`$${A + 100} - ${A} = 100$, tehát az érték $100 \cdot ${c} = ${K.T(v)}$.`]
    };
  });

  def('a1-alap-3', 'algebra', 'alapmuveletek', 3, 'Törtek műveletei', function (r) {
    var b = r.int(2, 9), d = r.int(2, 9), f = r.int(2, 9), a = r.int(1, 8), c = r.int(1, 8), e = r.int(1, 8), res, minus = r.int(0, 1) === 1;
    var prod = Q.mul(Q.make(c, d), Q.make(e, f));
    res = minus ? Q.sub(Q.make(a, b), prod) : Q.add(Q.make(a, b), prod);
    return {
      q: R`Számítsd ki a pontos értéket (egyszerűsített tört, például 7/12, vagy egész szám): $\dfrac{${a}}{${b}} ${minus ? '-' : '+'} \dfrac{${c}}{${d}} \cdot \dfrac{${e}}{${f}}$`,
      answer: { type: 'num', value: Q.val(res) }, ansTex: Q.tex(res),
      verify: `${a}/${b}${minus ? '-' : '+'}(${c}/${d})*(${e}/${f})`,
      tip1: R`A szorzást végezd el előbb, és csak utána add össze (vagy vond ki) a törteket.`,
      tip2: R`A szorzat: $\dfrac{${c}}{${d}} \cdot \dfrac{${e}}{${f}} = \dfrac{${c * e}}{${d * f}}$. Ezután hozd közös nevezőre.`,
      sol: [R`Szorzat: $\dfrac{${c}}{${d}} \cdot \dfrac{${e}}{${f}} = ${Q.tex(prod)}$.`, R`Összeg/különbség közös nevezővel: $\dfrac{${a}}{${b}} ${minus ? '-' : '+'} ${Q.tex(prod)} = ${Q.tex(res)}$.`]
    };
  });

  def('a1-alap-4', 'algebra', 'alapmuveletek', 2, 'Melyik műveleti azonosság?', function (r) {
    var t = r.int(0, 2), x = r.int(11, 60), y = r.int(11, 60), z = r.int(3, 40), txt, ok;
    if (t === 0) { txt = `${x} + ${y} = ${y} + ${x}`; ok = 'kommutativitás'; }
    else if (t === 1) { txt = `(${x} + ${y}) + ${z} = ${x} + (${y} + ${z})`; ok = 'asszociativitás'; }
    else { txt = `${z} \\cdot (${x} + ${y}) = ${z} \\cdot ${x} + ${z} \\cdot ${y}`; ok = 'disztributivitás'; }
    var all = ['kommutativitás', 'asszociativitás', 'disztributivitás'];
    return {
      q: R`Melyik műveleti azonosságot alkalmazzuk az alábbi egyenlőségben? $${txt}$`,
      answer: K.choice(r, ok, all.filter(function (s) { return s !== ok; }).concat(['az egyenlőség nem azonosság, hanem hibás'])),
      ansTex: '\\text{' + ok + '}',
      tip1: R`A kommutativitás sorrendcserét, az asszociativitás zárójel-áthelyezést, a disztributivitás szorzást összegre jelent.`,
      tip2: R`Nézd meg, mi változik az egyenlőség két oldala között: a sorrend, a zárójel helye, vagy a szorzó "szétosztódik".`,
      sol: [R`Az egyenlőség helyes, a két oldal között a következő változik: ${t === 0 ? 'a két tag sorrendje' : t === 1 ? 'a zárójel helye' : 'a szorzó szétosztódik az összeg tagjaira'}.`, R`Ez a(z) **${ok}** azonosság.`]
    };
  });

  def('a1-alap-5', 'algebra', 'alapmuveletek', 3, 'Emeletes tört', function (r) {
    var a = r.int(2, 6), c = r.int(2, 7), b = r.int(1, c * a - 1), d = r.int(1, 5), f = r.int(2, 7), e = r.int(1, 6);
    var num = Q.sub(Q.make(a, 1), Q.make(b, c)), den = Q.add(Q.make(d, 1), Q.make(e, f)), res = Q.div(num, den);
    return {
      q: R`Számítsd ki a pontos értéket (egyszerűsített tört vagy egész szám): $\dfrac{${a} - \dfrac{${b}}{${c}}}{${d} + \dfrac{${e}}{${f}}}$`,
      answer: { type: 'num', value: Q.val(res) }, ansTex: Q.tex(res),
      verify: `(${a}-${b}/${c})/(${d}+${e}/${f})`,
      tip1: R`Számold ki külön a számlálót és külön a nevezőt, aztán osszd el az egyiket a másikkal (reciprokkal szorzás).`,
      tip2: R`Számláló: $${a} - \dfrac{${b}}{${c}} = ${Q.tex(num)}$.`,
      sol: [R`Számláló: $${a} - \dfrac{${b}}{${c}} = ${Q.tex(num)}$.`, R`Nevező: $${d} + \dfrac{${e}}{${f}} = ${Q.tex(den)}$.`, R`Hányados: $${Q.tex(num)} : ${Q.tex(den)} = ${Q.tex(res)}$.`]
    };
  });

  /* ================= 2.2 SZÁMELMÉLET ================= */
  MO.content['algebra/szamelmelet'] = {
    intro: R`A számelmélet a természetes számok tulajdonságaival foglalkozik: oszthatóság, prímek, legnagyobb közös osztó, legkisebb közös többszörös, számrendszerek. A követelmény 2.2 pontja közép- és emelt szinten is sok gyakorlati feladatot ad (osztók száma, oszthatósági jegypótlás, ütemezési és szétosztási szöveges feladatok), emelten pedig a számelmélet alaptételét és a végtelen sok prímszámra vonatkozó bizonyítást is kéri.`,
    theory: [
      { h: 'Oszthatóság, osztó, többszörös',
        b: R`A természetes számok halmaza $\mathbb{N} = \{0; 1; 2; 3; \dots\}$. Azt mondjuk, hogy az $a$ egész szám **osztója** a $b$ egész számnak (és $b$ az $a$ **többszöröse**), ha van olyan $k$ egész szám, hogy $b = a \cdot k$. Jelölés: $a \mid b$. Például $6 \mid 42$, mert $42 = 6 \cdot 7$.\nAlapvető tulajdonságok: $1$ minden szám osztója; minden szám osztója önmagának; a $0$ minden szám többszöröse ($0 = a \cdot 0$); osztóként a $0$-t nem használjuk. Ha $a \mid b$ és $a \mid c$, akkor $a \mid (b + c)$ és $a \mid (b - c)$ is. Ha $a \mid b$ és $b \mid c$, akkor $a \mid c$.` },
      { h: 'Prímszámok és összetett számok',
        b: R`**Prímszám**: olyan 1-nél nagyobb természetes szám, aminek pontosan két pozitív osztója van: az $1$ és önmaga ($2; 3; 5; 7; 11; 13; \dots$). **Összetett szám**: olyan 1-nél nagyobb természetes szám, aminek kettőnél több pozitív osztója van (például $12$). Az $1$ sem nem prím, sem nem összetett; a $2$ az egyetlen páros prím.\nHa egy $n$ összetett, akkor van $\sqrt{n}$-nél nem nagyobb prímosztója, ezért elég az $n$-et a $\sqrt{n}$-ig terjedő prímekkel próbálgatni. A prímek kiszűrésére való az **Eratoszthenész szitája**: sorban kihúzzuk a kisebb prímek többszöröseit.` },
      { h: 'A számelmélet alaptétele', level: 'emelt',
        b: R`**Tétel (a számelmélet alaptétele).** Minden 1-nél nagyobb természetes szám felírható prímszámok szorzataként, és ez a felírás a tényezők sorrendjétől eltekintve egyértelmű. Azaz $n = p_1^{a_1} \cdot p_2^{a_2} \cdots p_k^{a_k}$, ahol a $p_i$ különböző prímek, az $a_i$ pozitív egészek, és ez a **prímtényezős felbontás** egyetlen.\nA gyakorlatban a felbontást a legkisebb prímmel való ismételt osztással végezzük: $360 = 2^3 \cdot 3^2 \cdot 5$. Az egyértelműség miatt két szám egyenlőségét, oszthatóságát a felbontásaikról le lehet olvasni.` },
      { h: 'Végtelen sok prímszám van', level: 'emelt',
        b: R`**Tétel.** A prímszámok száma végtelen.\nA bizonyítás indirekt: azt feltételezzük, hogy csak véges sok prím van, és ebből ellentmondásra jutunk. Ez a bizonyítás az emelt szintű követelmény része.`,
        proof: R`Tegyük fel, hogy csak véges sok prím van: $p_1, p_2, \dots, p_k$. Tekintsük az $N = p_1 \cdot p_2 \cdots p_k + 1$ számot. $N > 1$, ezért van prímosztója (az alaptétel szerint), legyen ez $q$. Ez a $q$ valamelyik $p_i$ kell legyen, hiszen az összes prímet felsoroltuk. De $p_i \mid p_1 \cdots p_k$, és ha $p_i \mid N$ is teljesülne, akkor $p_i \mid N - p_1 \cdots p_k = 1$, ami lehetetlen. Ellentmondás, tehát végtelen sok prím van.` },
      { h: 'Oszthatósági szabályok',
        b: R`A számjegyei alapján ($n$ utolsó jegye $a_0$) eldönthető az oszthatóság:\n- $10^k$-nal: ha az utolsó $k$ számjegy mind $0$;\n- 2-vel: ha az utolsó jegy páros; 5-tel: ha $a_0 \in \{0; 5\}$;\n- 4-gyel: ha az utolsó két jegyből álló szám osztható 4-gyel; 8-cal: az utolsó három jegyből álló szám osztható 8-cal;\n- 3-mal, 9-cel: ha a számjegyek összege osztható 3-mal, illetve 9-cel;\n- 6-tal: ha 2-vel és 3-mal is osztható.\nÖsszetett oszthatóság: ha $a$ és $b$ **relatív prímek**, és $a \mid n$, $b \mid n$, akkor $ab \mid n$. Például $4 \mid n$ és $9 \mid n$ esetén $36 \mid n$. (Fontos: $4 \mid n$ és $6 \mid n$ még nem jelenti, hogy $24 \mid n$, mert $4$ és $6$ nem relatív prímek.)\n**Kiegészítés:** 11-gyel akkor osztható $n$, ha a váltakozó előjelű számjegyösszege osztható 11-gyel.` },
      { h: 'Osztók száma', level: 'emelt',
        b: R`Ha $n = p_1^{a_1} \cdot p_2^{a_2} \cdots p_k^{a_k}$ a prímtényezős felbontás, akkor $n$ pozitív osztóinak száma $(a_1 + 1)(a_2 + 1) \cdots (a_k + 1)$. Például $360 = 2^3 \cdot 3^2 \cdot 5$ osztóinak száma $4 \cdot 3 \cdot 2 = 24$.\nSzűrt feladatoknál (páratlan osztók, négyzetszám-osztók) a kitevők megfelelő megszorításával számolunk: a páratlan osztóknál a $2$ kitevője $0$, így a szorzatból a 2-es tényező kimarad.`,
        proof: R`Egy $d$ szám akkor és csak akkor osztója $n$-nek, ha prímtényezős felbontásában csak az $n$-ben szereplő prímek fordulnak elő, mégpedig legfeljebb $n$-beli kitevővel. Így a $p_i$ kitevője $d$-ben $0; 1; \dots; a_i$ lehet, ez $a_i + 1$ választási lehetőség. A kitevők egymástól függetlenül választhatók, ezért az osztók száma a lehetőségek szorzata. Az alaptétel miatt különböző kitevőkombinációk különböző osztókat adnak.` },
      { h: 'Legnagyobb közös osztó, legkisebb közös többszörös, relatív prímek',
        b: R`Az $a$ és $b$ **legnagyobb közös osztója** ($\operatorname{lnko}(a; b)$, jelölés: $(a; b)$) a közös osztók közül a legnagyobb; **legkisebb közös többszöröse** ($\operatorname{lkkt}(a; b)$, jelölés: $[a; b]$) a pozitív közös többszörösök közül a legkisebb. Két szám **relatív prím**, ha $\operatorname{lnko}(a; b) = 1$, azaz nincs közös prímosztójuk (maguk nem feltétlenül prímek: $8$ és $15$).\nPrímtényezős felbontásból: az lnko-hoz a közös prímek **legkisebb** kitevős hatványait, az lkkt-hoz az összes prím **legnagyobb** kitevős hatványait szorozzuk. Két szám esetén $\operatorname{lnko}(a; b) \cdot \operatorname{lkkt}(a; b) = a \cdot b$.\nAz **euklideszi algoritmussal** is számolható az lnko: ismételt maradékos osztás, az utolsó nem nulla maradék az lnko. Szöveges feladatban az lnko "legnagyobb egyforma részekre osztást", az lkkt "mikor találkoznak újra" jellegű kérdésekhez tartozik.` },
      { h: 'Számrendszerek',
        b: R`A tízes számrendszerben a helyiértékek $10$ hatványai. Az $n$ alapú ($2 \le n \le 9$) számrendszerben a számjegyek $0; 1; \dots; n - 1$, a helyiértékek $n$ hatványai: $\overline{a_k a_{k-1} \dots a_0}_{(n)} = a_k n^k + \dots + a_1 n + a_0$.\n**Átírás tízesből $n$-esbe:** ismételten osztjuk $n$-nel, a maradékokat alulról felfelé olvassuk. **Visszafelé:** a helyiértékekkel szorzunk és összeadunk. Például $157 = 1112_{(5)}$, mert $1 \cdot 125 + 1 \cdot 25 + 1 \cdot 5 + 2 = 157$.\n**Emelt szint:** $n$ alapú számrendszerben felírt számok összeadása és kivonása az írásbeli módszerrel, csak az átvitel $n$-nél történik (összeadásnál $n$ lesz az "új tízes"; kivonásnál kölcsönzéskor $n$-et kapunk).` }
    ],
    examples: [
      { t: 'Prímtényezős felbontás, lnko és lkkt',
        p: R`Add meg a $360$ és a $420$ prímtényezős felbontását, legnagyobb közös osztóját és legkisebb közös többszörösét!`,
        steps: [R`$360 = 2^3 \cdot 3^2 \cdot 5$ és $420 = 2^2 \cdot 3 \cdot 5 \cdot 7$.`, R`lnko: a közös prímek legkisebb kitevővel: $2^2 \cdot 3 \cdot 5 = 60$.`, R`lkkt: minden prím legnagyobb kitevővel: $2^3 \cdot 3^2 \cdot 5 \cdot 7 = 2520$.`, R`Ellenőrzés: $60 \cdot 2520 = 151\,200 = 360 \cdot 420$.`],
        ans: R`$\operatorname{lnko}(360; 420) = 60$, $\operatorname{lkkt}(360; 420) = 2520$.`,
        checks: [['2^3*3^2*5', '360'], ['2^2*3*5*7', '420'], ['2^2*3*5', '60'], ['2^3*3^2*5*7', '2520'], ['60*2520', '360*420']] },
      { t: 'Számrendszer-átírás',
        p: R`Írd át a $157$ számot ötös számrendszerbe, majd a kapott számot ellenőrizd visszaírással tízes számrendszerbe.`,
        steps: [R`Osztások 5-tel: $157 : 5 = 31$, maradék $2$; $31 : 5 = 6$, maradék $1$; $6 : 5 = 1$, maradék $1$; $1 : 5 = 0$, maradék $1$.`, R`A maradékokat alulról felfelé olvasva: $1112_{(5)}$.`, R`Ellenőrzés: $1 \cdot 5^3 + 1 \cdot 5^2 + 1 \cdot 5 + 2 = 125 + 25 + 5 + 2 = 157$.`],
        ans: R`$157 = 1112_{(5)}$.`,
        checks: [['5*31+2', '157'], ['5*6+1', '31'], ['1*5^3+1*5^2+1*5+2', '157'], ['125+25+5+2', '157']] },
      { t: 'Osztók száma, szűrt osztók (emelt)',
        p: R`Hány pozitív osztója van a $2520$ számnak, és ezek közül hány páratlan?`,
        steps: [R`Prímtényezős felbontás: $2520 = 2^3 \cdot 3^2 \cdot 5 \cdot 7$.`, R`Az osztók száma: $(3 + 1)(2 + 1)(1 + 1)(1 + 1) = 4 \cdot 3 \cdot 2 \cdot 2 = 48$.`, R`Páratlan osztó nem tartalmazhat 2-es tényezőt, így a $2$ kitevője csak $0$ lehet: $(2 + 1)(1 + 1)(1 + 1) = 12$.`, R`Ellenőrzés: a páratlan osztók a $3^2 \cdot 5 \cdot 7 = 315$ osztói, és $315 = 3^2 \cdot 5 \cdot 7$ osztóinak száma valóban $12$.`],
        ans: R`A 2520-nak $48$ pozitív osztója van, ebből $12$ páratlan.`,
        checks: [['2^3*3^2*5*7', '2520'], ['(3+1)*(2+1)*(1+1)*(1+1)', '48'], ['(2+1)*(1+1)*(1+1)', '12'], ['3^2*5*7', '315']] },
      { t: 'Összeadás ötös számrendszerben (emelt)',
        p: R`Add össze $1112_{(5)}$ és $243_{(5)}$ értékét ötös számrendszerben, majd ellenőrizd tízes számrendszerben.`,
        steps: [R`Egyesek: $2 + 3 = 5 = 10_{(5)}$: írunk 0-t, átvitel $1$.`, R`Ötösök: $1 + 4 + 1 = 6 = 11_{(5)}$: írunk 1-et, átvitel $1$.`, R`Huszonötösök: $1 + 2 + 1 = 4$, írunk 4-et. Százhuszonötösök: $1$.`, R`Az eredmény $1410_{(5)}$. Ellenőrzés tízesben: $157 + 73 = 230$, és $1 \cdot 125 + 4 \cdot 25 + 1 \cdot 5 + 0 = 230$.`],
        ans: R`$1112_{(5)} + 243_{(5)} = 1410_{(5)}$.`,
        checks: [['2*25+4*5+3', '73'], ['157+73', '230'], ['1*125+4*25+1*5', '230']] }
    ],
    sims: ['primtenyezok', 'euklidesz', 'szita', 'szamrendszer'],
    mistakes: [
      R`Az $1$ nem prímszám (csak egy pozitív osztója van), és a $2$ az egyetlen páros prím. A $9$ és a $15$ nem prím, bár páratlanok.`,
      R`Az osztók számánál elfelejtik a $+1$-et: a $2^3$-nak négy osztója van ($1; 2; 4; 8$), nem három. Az osztók száma $(a_1+1)(a_2+1)\cdots$.`,
      R`Az lnko és az lkkt felcserélése: az lnko mindig osztója, az lkkt mindig többszöröse mindkét számnak. Az lnko legfeljebb a kisebb szám, az lkkt legalább a nagyobb szám.`,
      R`"Ha $4 \mid n$ és $6 \mid n$, akkor $24 \mid n$" hibás következtetés: a $4$ és a $6$ nem relatív prímek ($n = 12$ ellenpélda). Csak relatív prím osztókat lehet összeszorozni.`,
      R`Számrendszer-átírásnál a maradékokat felülről lefelé olvassák, pedig alulról felfelé kell. Az $n$ alapú számrendszerben nincs $n$ vagy annál nagyobb számjegy.`,
      R`A 3-mal való oszthatóságot az utolsó jegyből akarják eldönteni; ehhez a számjegyek összege kell. A 4-hez az utolsó két, a 8-hoz az utolsó három jegy.`
    ],
    exam: R`A követelmény szerint közép- és emelt szinten is ismerni kell az oszthatóság alapfogalmait, a prímszámot, az összetett számot, a prímtényezős felbontást, az lnko és lkkt kiszámítását (szöveges feladatokban is), a relatív prím fogalmát, a $10$ hatványaira és a $2, 3, 4, 5, 6, 8, 9$-re vonatkozó oszthatósági szabályokat, és a tízes számrendszerből $n \le 9$ alapúba (és vissza) való átírást. Emelt szinten ezen felül: a számelmélet alaptételének megfogalmazása, a végtelen sok prím bizonyítása, összetett oszthatósági feladatok, az osztók számának meghatározása, és $n$ alapú számok összeadása, kivonása.`,
    cheat: [R`n = p_1^{a_1} \cdot p_2^{a_2} \cdots p_k^{a_k}`, R`d(n) = (a_1+1)(a_2+1)\cdots(a_k+1)`, R`\operatorname{lnko}(a;b) \cdot \operatorname{lkkt}(a;b) = a \cdot b`, R`\operatorname{lnko}(a;b) = 1 \iff a,\ b \text{ relatív prímek}`, R`3 \mid n \iff 3 \mid \text{számjegyösszeg};\quad 9 \mid n \iff 9 \mid \text{számjegyösszeg}`, R`\overline{a_k \dots a_0}_{(n)} = a_k n^k + \dots + a_1 n + a_0`],
    cheatChecks: [['(3+1)*(2+1)*(1+1)', '24'], ['2^3*3^2*5', '360'], ['12*36', '6*72']],
    terms: ['osztó', 'többszörös', 'prímszám', 'összetett szám', 'prímtényezős felbontás', 'számelmélet alaptétele', 'legnagyobb közös osztó', 'legkisebb közös többszörös', 'relatív prímek', 'euklideszi algoritmus', 'oszthatósági szabály', 'számrendszer', 'helyiérték', 'Eratoszthenész szitája']
  };

  def('a1-szam-1', 'algebra', 'szamelmelet', 1, 'Legnagyobb közös osztó és legkisebb közös többszörös', function (r) {
    var g = r.int(2, 12), m = r.int(2, 9), n = r.int(2, 9);
    while (MO.gcd(m, n) !== 1 || m === n) { n = r.int(2, 9); m = r.int(2, 9); }
    var a = g * m, b = g * n, l = MO.lcm(a, b), asked = r.int(0, 1);
    return asked === 0 ? {
      q: R`Add meg az alábbi két szám legnagyobb közös osztóját: $${a}$ és $${b}$.`,
      answer: { type: 'num', value: g }, ansTex: K.T(g),
      verify: `${a}*${b}/${l}`,
      tip1: R`Bontsd prímtényezőkre mindkét számot, és vedd a közös prímek legkisebb kitevős hatványait.`,
      tip2: R`$${a} = ${facTex(a)}$, $${b} = ${facTex(b)}$.`,
      sol: [R`$${a} = ${facTex(a)}$, $${b} = ${facTex(b)}$.`, R`A közös prímtényezők legkisebb kitevővel: lnko $= ${g}$.`, R`Ellenőrzés: $${a} : ${g} = ${m}$ és $${b} : ${g} = ${n}$ relatív prímek.`]
    } : {
      q: R`Add meg az alábbi két szám legkisebb közös többszörösét: $${a}$ és $${b}$.`,
      answer: { type: 'num', value: l }, ansTex: K.T(l),
      verify: `${a}*${b}/${g}`,
      tip1: R`Az lkkt-hoz minden prímet a legnagyobb kitevőjével kell venni; vagy: $\operatorname{lkkt} = a \cdot b : \operatorname{lnko}$.`,
      tip2: R`$${a} = ${facTex(a)}$, $${b} = ${facTex(b)}$. Az lnko $${g}$.`,
      sol: [R`$${a} = ${facTex(a)}$, $${b} = ${facTex(b)}$, az lnko $${g}$.`, R`$\operatorname{lkkt} = \dfrac{${a} \cdot ${b}}{${g}} = ${K.T(l)}$.`]
    };
  });

  def('a1-szam-2', 'algebra', 'szamelmelet', 1, 'Átírás tízesből n alapú számrendszerbe', function (r) {
    var b = r.int(2, 9), n = r.int(20, 300), s = toBase(n, b), lines = [], x = n, rem;
    while (x > 0) { rem = x % b; lines.push(`$${x} : ${b} = ${Math.floor(x / b)}$, maradék $${rem}$`); x = Math.floor(x / b); }
    return {
      q: R`Írd át a(z) $${n}$ számot $${b}$ alapú számrendszerbe. (Csak a számjegyeket add meg egymás után.)`,
      answer: { type: 'num', value: Number(s) }, ansTex: s + '_{(' + b + ')}',
      verify: polyOf(s, 10),
      tip1: R`Oszd el ismételten a számot a számrendszer alapjával, és jegyezd fel a maradékokat.`,
      tip2: R`A maradékokat az utolsótól az első felé haladva kell leírni.`,
      sol: lines.concat([R`A maradékokat alulról felfelé olvasva: $${s}_{(${b})}$.`, R`Ellenőrzés: $${polyOf(s, b).replace(/\*/g, ' \\cdot ').replace(/\^(\d+)/g, '^{$1}')} = ${n}$.`])
    };
  });

  def('a1-szam-3', 'algebra', 'szamelmelet', 1, 'Átírás n alapú számrendszerből tízesbe', function (r) {
    var b = r.int(3, 9), len = r.int(3, 4), s = String(r.int(1, b - 1)), i;
    for (i = 1; i < len; i++) s += r.int(0, b - 1);
    var v = fromBase(s, b);
    return {
      q: R`Mennyi a tízes számrendszerben a $${s}_{(${b})}$ szám értéke? (A számot $${b}$ alapú számrendszerben írtuk fel.)`,
      answer: { type: 'num', value: v }, ansTex: K.T(v),
      verify: polyOf(s, b),
      tip1: R`Szorozd meg minden számjegyet a helyiértékével (az alap hatványával), és add össze őket.`,
      tip2: R`A helyiértékek jobbról balra: $1;\ ${b};\ ${b * b};\ ${b * b * b}$ stb.`,
      sol: [R`$${s}_{(${b})} = ${polyOf(s, b).replace(/\*/g, ' \\cdot ').replace(/\^(\d+)/g, '^{$1}')}$`, R`$= ${K.T(v)}$`]
    };
  });

  def('a1-szam-prim', 'algebra', 'szamelmelet', 1, 'Prímtényezők összege', function (r) {
    var P = [2, 3, 5, 7, 11, 13], ps = r.shuffle(P).slice(0, 3), a = r.int(1, 3), b = r.int(1, 2), n = Math.pow(ps[0], a) * Math.pow(ps[1], b) * ps[2], sum = ps[0] + ps[1] + ps[2];
    return {
      q: R`Mennyi a(z) $${n}$ szám különböző prímtényezőinek összege?`,
      answer: { type: 'num', value: sum }, ansTex: K.T(sum),
      verify: `${ps[0]}+${ps[1]}+${ps[2]}`,
      tip1: R`Bontsd prímtényezőkre a számot, és minden prímet csak egyszer vegyél figyelembe.`,
      tip2: R`A szám osztható a(z) $${Math.min(ps[0], ps[1], ps[2])}$ prímszámmal.`,
      sol: [R`$${n} = ${facTex(n)}$.`, R`A különböző prímek: $${factor(n).map(function (x) { return x[0]; }).join(';\\ ')}$, összegük $${sum}$.`]
    };
  });

  def('a1-szam-4', 'algebra', 'szamelmelet', 2, 'Pozitív osztók száma', function (r) {
    var ps = r.shuffle([2, 3, 5, 7]).slice(0, r.int(2, 3)), ex = ps.map(function () { return r.int(1, 4); }), n = 1, cnt = 1, i, parts = [], fs = [];
    for (i = 0; i < ps.length; i++) { n *= Math.pow(ps[i], ex[i]); cnt *= ex[i] + 1; parts.push('(' + ex[i] + '+1)'); fs.push('(' + (ex[i] + 1) + ')'); }
    return {
      q: R`Hány pozitív osztója van a(z) $${n}$ számnak?`,
      answer: { type: 'num', value: cnt }, ansTex: K.T(cnt),
      verify: parts.join('*'),
      tip1: R`Írd fel a prímtényezős felbontást, és használd, hogy az osztók számát a kitevők növelt értékeinek szorzata adja.`,
      tip2: R`$${n} = ${facTex(n)}$.`,
      sol: [R`$${n} = ${facTex(n)}$.`, R`Az osztók száma: $${ex.map(function (e) { return '(' + e + '+1)'; }).join(' \\cdot ')} = ${cnt}$.`]
    };
  });

  def('a1-szam-5', 'algebra', 'szamelmelet', 2, 'Hiányzó számjegy oszthatóság alapján', function (r) {
    if (r.int(0, 1) === 0) {
      var d1 = r.int(1, 9), d2 = r.int(1, 9), d3 = r.int(1, 9), s = d1 + d2 + d3;
      while (s % 9 === 0) { d3 = r.int(1, 9); s = d1 + d2 + d3; }
      var x = 9 - (s % 9), total = s + x;
      return {
        q: R`Melyik számjegyet írhatjuk a csillag helyére, hogy a $${d1}${d2}*${d3}$ négyjegyű szám osztható legyen 9-cel?`,
        answer: { type: 'num', value: x }, ansTex: K.T(x),
        verify: `${total}-${s}`,
        tip1: R`A 9-cel való oszthatóság feltétele, hogy a számjegyek összege osztható legyen 9-cel.`,
        tip2: R`Az ismert jegyek összege $${d1}+${d2}+${d3} = ${s}$. Melyik a legközelebbi 9-többszörös ez fölött?`,
        sol: [R`Az ismert jegyek összege $${s}$.`, R`A következő 9-többszörös $${total}$, ehhez $${total} - ${s} = ${x}$ hiányzik.`, R`Ellenőrzés: $${d1}+${d2}+${x}+${d3} = ${total}$, ez osztható 9-cel.`]
      };
    }
    var e1 = r.int(1, 9), e2 = r.int(1, 9), e3 = (9 - ((e1 + e2 + 5) % 9)) % 9, s2 = e1 + e2 + e3;
    return {
      q: R`Melyik számjegyet írhatjuk a csillag helyére, hogy az $${e1}${e2}${e3}*$ szám osztható legyen 45-tel? (Egyetlen számjegy jó.)`,
      answer: { type: 'num', value: 5 }, ansTex: '5',
      verify: `${s2 + 5}-${s2}`,
      tip1: R`Mivel $45 = 5 \cdot 9$, és 5 meg 9 relatív prímek, elég külön az 5-tel és a 9-cel való oszthatóságot vizsgálni.`,
      tip2: R`Az 5-tel való oszthatóság miatt az utolsó jegy $0$ vagy $5$. A 9-cel való oszthatóságot a jegyek összege dönti el.`,
      sol: [R`Az 5-tel való oszthatóság miatt a csillag $0$ vagy $5$.`, R`A többi jegy összege $${s2}$. A $0$ esetén az összeg $${s2}$, ez nem osztható 9-cel; az $5$ esetén $${s2 + 5}$, ez osztható 9-cel.`, R`A 9 és az 5 relatív prímek, ezért a szám osztható 45-tel, ha a csillag $5$.`]
    };
  });

  def('a1-szam-9', 'algebra', 'szamelmelet', 2, 'Relatív prím számpárok száma', function (r) {
    var pairs = [], cnt = 0, i, a, b, rel, items = [];
    for (i = 0; i < 4; i++) {
      if (r.int(0, 1) === 0) { do { a = r.int(6, 60); b = r.int(6, 60); } while (MO.gcd(a, b) !== 1 || a === b); }
      else { do { a = r.int(6, 60); b = r.int(6, 60); } while (MO.gcd(a, b) === 1 || a === b); }
      rel = MO.gcd(a, b) === 1; if (rel) cnt++; pairs.push('(' + a + ';\\ ' + b + ')'); items.push('$(' + a + ';\\ ' + b + ')$: lnko $= ' + MO.gcd(a, b) + '$, ' + (rel ? 'relatív prím' : 'nem relatív prím'));
    }
    return {
      q: R`Az alábbi számpárok közül hány relatív prím? $${pairs.join(',\\quad ')}$`,
      answer: { type: 'num', value: cnt }, ansTex: K.T(cnt),
      verify: String(cnt),
      tip1: R`Két szám relatív prím, ha az lnko-juk $1$, azaz nincs közös prímosztójuk.`,
      tip2: R`Keress közös osztót mindkét számnak: ha találsz 1-nél nagyobbat, a pár nem relatív prím.`,
      sol: items.concat([R`Összesen $${cnt}$ relatív prím pár van.`])
    };
  });

  def('a1-szam-6', 'algebra', 'szamelmelet', 3, 'Szöveges lnko / lkkt feladat', function (r) {
    var g = r.int(2, 9), m = r.int(2, 8), n = r.int(2, 8), t = r.int(0, 2);
    while (MO.gcd(m, n) !== 1 || m === n) { m = r.int(2, 8); n = r.int(2, 8); }
    var a = g * m, b = g * n;
    if (t === 0) {
      var l = g * m * n;
      return {
        q: R`Egy végállomásról az egyik autóbusz $${a}$ percenként, a másik $${b}$ percenként indul. Reggel együtt indultak. Hány perc múlva indul legközelebb ismét egyszerre a két busz?`,
        answer: { type: 'num', value: l }, ansTex: K.T(l) + '\\text{ perc}',
        verify: `${a}*${b}/${g}`,
        tip1: R`A két busz akkor indul újra együtt, ha az idő mindkét menetidő többszöröse. Melyik szám kell ehhez?`,
        tip2: R`A legkisebb ilyen idő a két szám legkisebb közös többszöröse. Számold ki a prímtényezős felbontásból.`,
        sol: [R`$${a} = ${facTex(a)}$, $${b} = ${facTex(b)}$.`, R`$\operatorname{lkkt}(${a}; ${b}) = ${K.T(l)}$.`, R`A két busz legközelebb $${l}$ perc múlva indul egyszerre.`]
      };
    }
    if (t === 1) {
      return {
        q: R`Egy $${a}$ cm × $${b}$ cm-es téglalap alakú lemezt hulladék nélkül, egyforma négyzetekre szeretnénk vágni. Legfeljebb hány centiméter lehet a négyzetek oldala? (Egész számú centiméteres oldal.)`,
        answer: { type: 'num', value: g }, ansTex: K.T(g) + '\\text{ cm}',
        verify: `${a}*${b}/(${g}*${m}*${n})`,
        tip1: R`A négyzet oldala mindkét oldalhossz osztója kell legyen.`,
        tip2: R`A legnagyobb közös osztót keressük: $\operatorname{lnko}(${a}; ${b})$.`,
        sol: [R`$${a} = ${facTex(a)}$, $${b} = ${facTex(b)}$.`, R`$\operatorname{lnko}(${a}; ${b}) = ${g}$.`, R`A négyzetek oldala legfeljebb $${g}$ cm lehet.`]
      };
    }
    var db = m * n;
    return {
      q: R`Egy $${a}$ cm × $${b}$ cm-es téglalap alakú lemezt hulladék nélkül, egyforma, lehető legnagyobb négyzetekre vágunk. Hány négyzet keletkezik?`,
      answer: { type: 'num', value: db }, ansTex: K.T(db) + '\\text{ db}',
      verify: `(${a}/${g})*(${b}/${g})`,
      tip1: R`Először a lehető legnagyobb négyzetoldalt keresd meg, ez a két oldal lnko-ja.`,
      tip2: R`A négyzet oldala $${g}$ cm. Hány ilyen négyzet fér el az egyik, hány a másik oldalon?`,
      sol: [R`$\operatorname{lnko}(${a}; ${b}) = ${g}$, ez a négyzet oldala.`, R`Az egyik oldalon $${a} : ${g} = ${m}$, a másikon $${b} : ${g} = ${n}$ négyzet fér el.`, R`Összesen $${m} \cdot ${n} = ${db}$ négyzet keletkezik.`]
    };
  });

  def('a1-szam-7', 'algebra', 'szamelmelet', 3, 'lnko és lkkt ismeretében a másik szám', function (r) {
    var g = r.int(2, 9), m = r.int(2, 8), n = r.int(2, 8);
    while (MO.gcd(m, n) !== 1 || m === n) { m = r.int(2, 8); n = r.int(2, 8); }
    var a = g * m, b = g * n, l = g * m * n;
    return {
      q: R`Két pozitív egész szám legnagyobb közös osztója $${g}$, legkisebb közös többszöröse $${l}$. Az egyik szám $${a}$. Mennyi a másik szám?`,
      answer: { type: 'num', value: b }, ansTex: K.T(b),
      verify: `${g}*${l}/${a}`,
      tip1: R`Két szám szorzata egyenlő az lnko és az lkkt szorzatával.`,
      tip2: R`$a \cdot b = ${g} \cdot ${l}$, és az egyik szám $${a}$.`,
      sol: [R`$a \cdot b = \operatorname{lnko} \cdot \operatorname{lkkt} = ${g} \cdot ${l} = ${g * l}$.`, R`$b = ${g * l} : ${a} = ${b}$.`, R`Ellenőrzés: $\operatorname{lnko}(${a}; ${b}) = ${g}$ és $\operatorname{lkkt}(${a}; ${b}) = ${l}$.`]
    };
  });

  def('a1-szam-8', 'algebra', 'szamelmelet', 3, 'Összeadás és kivonás n alapú számrendszerben', function (r) {
    var b = r.int(3, 9), X = r.int(40, 400), Y = r.int(20, 300), add = r.int(0, 1) === 0;
    if (!add && Y > X) { var t = X; X = Y; Y = t; }
    if (!add && X === Y) X += 1;
    var res = add ? X + Y : X - Y, sx = toBase(X, b), sy = toBase(Y, b), sr = toBase(res, b);
    return {
      q: R`Végezd el a műveletet $${b}$ alapú számrendszerben: $${sx}_{(${b})} ${add ? '+' : '-'} ${sy}_{(${b})}$. Az eredményt is $${b}$ alapú számrendszerben add meg (csak a számjegyeket).`,
      answer: { type: 'num', value: Number(sr) }, ansTex: sr + '_{(' + b + ')}',
      verify: polyOf(sr, 10),
      tip1: R`Írásbeli módszerrel, helyiértékenként haladj; az átvitel (vagy kölcsönzés) értéke itt $${b}$.`,
      tip2: R`Ellenőrizheted tízes számrendszerben is: $${sx}_{(${b})} = ${X}$ és $${sy}_{(${b})} = ${Y}$.`,
      sol: [R`Tízes számrendszerben a két szám $${X}$ és $${Y}$.`, R`$${X} ${add ? '+' : '-'} ${Y} = ${res}$.`, R`Visszaírva $${b}$ alapú számrendszerbe: $${res} = ${sr}_{(${b})}$.`, R`Az írásbeli művelet is ezt adja: $${sr}_{(${b})}$.`]
    };
  });

  /* ================= 2.3 RACIONÁLIS ÉS IRRACIONÁLIS SZÁMOK ================= */
  MO.content['algebra/racionalis'] = {
    intro: R`A racionális számok a két egész szám hányadosaként felírható számok, az irracionális számok pedig azok a valós számok, amelyek nem ilyenek, például $\sqrt{2}$ vagy $\pi$. A követelmény 2.3 pontja szerint ismerni kell ezek definícióját és kapcsolatukat a tizedestörtekkel; emelt szinten el kell dönteni, hogy $\sqrt{n}$ irracionális-e, be kell bizonyítani, hogy $\sqrt{2}$ irracionális, és tizedestörtből közönséges törtet kell képezni.`,
    theory: [
      { h: 'Racionális számok',
        b: R`**Racionális szám**: olyan szám, amely felírható két egész szám hányadosaként: $\dfrac{p}{q}$, ahol $p$ egész, $q$ egész és $q \ne 0$. A racionális számok halmaza: $\mathbb{Q}$. Minden egész szám racionális ($5 = \dfrac{5}{1}$), de nem minden racionális szám egész ($\dfrac{3}{4}$). Ugyanazt a számot sokféle tört írja fel ($\dfrac{1}{2} = \dfrac{2}{4}$), a legegyszerűbb alak az egyszerűsített tört, ahol $p$ és $q$ relatív prímek és $q > 0$.` },
      { h: 'Irracionális számok',
        b: R`**Irracionális szám**: olyan valós szám, amely nem írható fel két egész szám hányadosaként. Halmaza: $\mathbb{Q}^*$. Példák: $\sqrt{2}$, $\sqrt{3}$, $\pi$, $e$. Egy szám tizedestört alakja végtelen és nem szakaszos pontosan akkor, ha irracionális.\nMiért nem elég a "tizedestört"? Mert a $3{,}14$ és a $\dfrac{22}{7}$ is csak **közelítése** a $\pi$-nek; a $\pi$ tizedestört alakja ($3{,}14159\dots$) soha nem ismétlődik.` },
      { h: 'Racionális számok tizedestört alakja',
        b: R`**Tétel.** Egy valós szám pontosan akkor racionális, ha tizedestört alakja véges, vagy végtelen szakaszos. Ha egy tört nevezője (egyszerűsített alakban) csak 2-es és 5-ös prímtényezőt tartalmaz, a tizedestört **véges** ($\dfrac{3}{8} = 0{,}375$). Egyébként a tört **végtelen szakaszos** tizedestört ($\dfrac{1}{3} = 0{,}\overline{3}$, $\dfrac{1}{6} = 0{,}1\overline{6}$).\nA szakasz jelölése felülvonással: $0{,}\overline{27}$. Megjegyzés: $0{,}\overline{9} = 1$, ezt a szám egyetlen tizedestört alakjának tekintjük, ezért 9-es szakaszt nem használunk.` },
      { h: 'Tizedestört átírása közönséges törtté', level: 'emelt',
        b: R`**Véges tizedestört:** a tizedesjegyek számának megfelelő 10-hatvány a nevező: $0{,}375 = \dfrac{375}{1000} = \dfrac{3}{8}$.\n**Tiszta szakaszos** ($0{,}\overline{a_1 \dots a_m}$): a szakaszt osztjuk $10^m - 1$-gyel, azaz $m$ darab 9-essel: $0{,}\overline{36} = \dfrac{36}{99} = \dfrac{4}{11}$.\n**Vegyes szakaszos** ($0{,}p\overline{q}$, a tizedesvessző után $k$ jegy előszakasz, $m$ jegyű szakasz): a számláló a teljes jegysor ($pq$) mínusz az előszakasz ($p$), a nevező $m$ db 9-es után $k$ db $0$: $0{,}1\overline{6} = \dfrac{16 - 1}{90} = \dfrac{1}{6}$.\nBármely esetben a trükk: $x$-et szorozzuk 10-hatvánnyal, hogy a szakasz "egy lépéssel eltolódjon", majd kivonjuk az eredeti szorzatot.` },
      { h: 'Négyzetgyök: mikor irracionális?', level: 'emelt',
        b: R`**Tétel.** Ha $n$ természetes szám, akkor $\sqrt{n}$ pontosan akkor racionális, ha $n$ négyzetszám (és ekkor egész is). Különben $\sqrt{n}$ irracionális.\nEldöntés a gyakorlatban: ismerni kell a négyzetszámokat ($1; 4; 9; 16; 25; 36; 49; 64; 81; 100; 121; 144; \dots$). Ha $n$ nem négyzetszám, $\sqrt{n}$ irracionális; például $\sqrt{12} = 2\sqrt{3}$ irracionális, $\sqrt{49} = 7$ racionális. Egy $n$ szám akkor négyzetszám, ha a prímtényezős felbontásában minden kitevő páros.`,
        proof: R`Legyen $\sqrt{n} = \dfrac{p}{q}$ egyszerűsített tört ($p, q$ pozitív egészek, relatív prímek). Négyzetre emelve $n q^2 = p^2$. Ha $q > 1$, volna egy $r$ prím, amelyre $r \mid q$; ekkor $r \mid p^2$, így $r \mid p$, de $p$ és $q$ relatív prímek, ellentmondás. Tehát $q = 1$, és $\sqrt{n} = p$ egész, ezért $n = p^2$ négyzetszám.` },
      { h: R`A $\sqrt{2}$ irracionális`, level: 'emelt',
        b: R`**Tétel.** A $\sqrt{2}$ irracionális szám.\nIndirekt bizonyítás: feltesszük, hogy racionális, és ellentmondásra jutunk. A bizonyítás a páros és páratlan számok négyzetének tulajdonságán alapul: egy egész szám négyzete pontosan akkor páros, ha maga a szám páros.`,
        proof: R`Tegyük fel, hogy $\sqrt{2} = \dfrac{p}{q}$ egyszerűsített tört ($p, q$ egészek, relatív prímek, $q \ne 0$). Négyzetre emelve $2q^2 = p^2$, tehát $p^2$ páros, ezért $p$ is páros (páratlan szám négyzete páratlan). Legyen $p = 2k$. Ekkor $2q^2 = 4k^2$, azaz $q^2 = 2k^2$, így $q^2$ páros, tehát $q$ is páros. De akkor $p$ és $q$ is osztható 2-vel, ez ellentmond annak, hogy a tört egyszerűsített. Tehát $\sqrt{2}$ nem racionális.` },
      { h: 'Műveletek racionális és irracionális számokkal',
        b: R`Két racionális szám összege, különbsége, szorzata, hányadosa (0-val nem osztva) racionális. Ha $a$ racionális és $b$ irracionális, akkor $a + b$ irracionális; és ha $a \ne 0$, akkor $a \cdot b$ is irracionális (különben $b$ is racionális volna).\n**Két irracionális szám** összege, szorzata viszont lehet racionális is: $\sqrt{2} + (-\sqrt{2}) = 0$, $\sqrt{2} \cdot \sqrt{2} = 2$, $\sqrt{2} \cdot \sqrt{8} = 4$. Ezért az irracionális számok halmaza **nem zárt** a műveletekre. Ugyanígy két irracionális szám összege lehet irracionális is: $\sqrt{2} + \sqrt{3}$.` }
    ],
    examples: [
      { t: 'Tiszta szakaszos tizedestört átírása törtté',
        p: R`Írd fel közönséges tört alakban a $0{,}\overline{36}$ számot!`,
        steps: [R`Legyen $x = 0{,}363636\dots$ Mivel a szakasz $2$ jegyű, szorzunk 100-zal: $100x = 36{,}3636\dots$`, R`Kivonjuk az első egyenletet a másodikból: $100x - x = 36$, azaz $99x = 36$.`, R`$x = \dfrac{36}{99}$, egyszerűsítve 9-cel: $x = \dfrac{4}{11}$.`, R`Ellenőrzés: $4 : 11 = 0{,}\overline{36}$, mert $11 \cdot 0{,}\overline{36} = 4$ és $99 \cdot \dfrac{4}{11} = 36$.`],
        ans: R`$0{,}\overline{36} = \dfrac{4}{11}$.`,
        checks: [['36/99', '4/11'], ['99*(4/11)', '36'], ['100*(4/11)-4/11', '36']] },
      { t: 'Vegyes szakaszos tizedestört átírása törtté (emelt)',
        p: R`Írd fel egyszerűsített közönséges tört alakban az $1{,}2\overline{36}$ számot!`,
        steps: [R`Legyen $x = 1{,}2363636\dots$ A tizedesvessző után egy jegy előszakasz ($2$), és kétjegyű szakasz ($36$) van.`, R`Szorzunk 10-zel és 1000-rel, hogy a szakasz ugyanott kezdődjön: $10x = 12{,}363636\dots$ és $1000x = 1236{,}363636\dots$`, R`Kivonjuk: $990x = 1236 - 12 = 1224$.`, R`$x = \dfrac{1224}{990}$, egyszerűsítve 18-cal: $x = \dfrac{68}{55}$.`, R`Ellenőrzés: $1 + \dfrac{234}{990} = 1 + \dfrac{13}{55} = \dfrac{68}{55}$.`],
        ans: R`$1{,}2\overline{36} = \dfrac{68}{55}$.`,
        checks: [['1236-12', '1224'], ['1224/990', '68/55'], ['1+234/990', '68/55'], ['1+13/55', '68/55']] },
      { t: 'Hány irracionális négyzetgyök? (emelt)',
        p: R`Hány olyan $n$ egész szám van $1$ és $200$ között (a határokat is beleértve), amelyre $\sqrt{n}$ irracionális?`,
        steps: [R`$\sqrt{n}$ pontosan akkor racionális, ha $n$ négyzetszám; különben irracionális.`, R`A négyzetszámok $1^2, 2^2, \dots$ között az utolsó, ami legfeljebb $200$: $14^2 = 196$ ($15^2 = 225 > 200$). Tehát $14$ négyzetszám van.`, R`Az összes szám $200$, így az irracionális négyzetgyökűek száma $200 - 14 = 186$.`, R`Ellenőrzés: $\sqrt{196} = 14$, de $\sqrt{197}$ már irracionális.`],
        ans: R`$186$ ilyen szám van.`,
        checks: [['14^2', '196'], ['15^2', '225'], ['200-14', '186']] },
      { t: 'Irracionalitás bizonyítása a műveletek tulajdonságaival (emelt)',
        p: R`Bizonyítsd be, hogy $\sqrt{2} + 1$ irracionális, és számítsd ki a reciprokát!`,
        steps: [R`Tegyük fel indirekt, hogy $\sqrt{2} + 1 = r$ racionális.`, R`Ekkor $\sqrt{2} = r - 1$ is racionális volna (két racionális szám különbsége), ez ellentmond annak, hogy $\sqrt{2}$ irracionális. Így $\sqrt{2} + 1$ irracionális.`, R`A reciprok: bővítünk $\sqrt{2} - 1$-gyel: $\dfrac{1}{\sqrt{2}+1} = \dfrac{\sqrt{2}-1}{(\sqrt{2}+1)(\sqrt{2}-1)} = \dfrac{\sqrt{2}-1}{2-1} = \sqrt{2} - 1$.`, R`Ellenőrzés: $(\sqrt{2}+1)(\sqrt{2}-1) = 1$.`],
        ans: R`$\sqrt{2}+1$ irracionális, a reciproka $\sqrt{2} - 1$.`,
        checks: [['(sqrt(2)+1)-1', 'sqrt(2)'], ['(sqrt(2)+1)*(sqrt(2)-1)', '1'], ['1/(sqrt(2)+1)', 'sqrt(2)-1']] }
    ],
    sims: ['bizonyitasi-semak', 'tortek'],
    mistakes: [
      R`A $0{,}\overline{9}$ nem "majdnem $1$", hanem pontosan $1$: $x = 0{,}\overline{9} \Rightarrow 10x - x = 9 \Rightarrow x = 1$.`,
      R`"Végtelen tizedestört, tehát irracionális" hibás: $\dfrac{1}{3} = 0{,}\overline{3}$ végtelen, mégis racionális. Irracionális, ha végtelen és **nem szakaszos**.`,
      R`A $\pi$ nem egyenlő $3{,}14$-gyel vagy $\dfrac{22}{7}$-del: ezek közelítések, a $\pi$ irracionális.`,
      R`Két irracionális szám összege/szorzata nem feltétlenül irracionális: $\sqrt{2} \cdot \sqrt{2} = 2$. A műveletekre ezért nem zártak.`,
      R`Szakaszos tizedestörtnél rossz a nevező: két jegyű szakasznál $99$ (nem $100$), egy előszakasz esetén még egy $0$ kerül a nevező végére.`,
      R`$\sqrt{n}$ irracionális, ha $n$ nem egész is? Nem mindig: $\sqrt{\dfrac{9}{4}} = \dfrac{3}{2}$ racionális. A tétel természetes $n$-ekre szól.`
    ],
    exam: R`A követelmény szerint közép- és emelt szinten is tudni kell definiálni a racionális és az irracionális számot, és ismerni kapcsolatukat a tizedestörtekkel. Emelt szinten ezen felül: adott természetes $n$ esetén el kell tudni dönteni, hogy $\sqrt{n}$ irracionális-e; be kell tudni bizonyítani, hogy $\sqrt{2}$ irracionális; és tizedestört alakban megadott racionális számot közönséges tört alakba kell tudni írni.`,
    cheat: [R`\mathbb{Q} = \left\{ \dfrac{p}{q} \;\middle|\; p \in \mathbb{Z},\ q \in \mathbb{Z},\ q \ne 0 \right\}`, R`0{,}\overline{a} = \dfrac{a}{9},\quad 0{,}\overline{ab} = \dfrac{\overline{ab}}{99}`, R`0{,}p\overline{q} = \dfrac{\overline{pq} - p}{90}\ \text{(1 jegyű } p, q\text{)}`, R`n \in \mathbb{N}:\ \sqrt{n} \in \mathbb{Q} \iff n \text{ négyzetszám}`, R`\dfrac{a}{b}\ \text{véges tizedestört} \iff b\ \text{prímtényezői csak } 2,\ 5\ \text{(egyszerűsítve)}`],
    cheatChecks: [['(10*a+b)/99', '(10*a+b)/(100-1)'], ['(10*p+q-p)/90', '(9*p+q)/90']],
    terms: ['racionális szám', 'irracionális szám', 'véges tizedestört', 'végtelen szakaszos tizedestört', 'szakasz', 'egyszerűsített tört', 'négyzetszám', 'indirekt bizonyítás', 'ellentmondás', 'közönséges tört', 'Q és Q*']
  };

  def('a1-rac-1', 'algebra', 'racionalis', 1, 'Tiszta szakaszos tizedestört törtté', function (r) {
    var m = r.int(1, 2), p = '', i;
    do { p = ''; for (i = 0; i < m; i++) p += r.int(1, 8); } while (/^(.)\1*$/.test(p) && m === 2 && p === '99');
    var den = m === 1 ? 9 : 99, num = Number(p), qv = Q.make(num, den);
    return {
      q: R`Írd fel egyszerűsített közönséges tört alakban (például 4/11): $0{,}\overline{${p}}$`,
      answer: { type: 'num', value: Q.val(qv) }, ansTex: Q.tex(qv),
      verify: `${num}/${den}`,
      tip1: R`Szorozd meg $x$-et $10$ hatványával a szakasz hosszának megfelelően, és vond ki az eredeti szám $x$-szeresét.`,
      tip2: R`A szakasz $${m}$ jegyű, ezért a nevező $${den}$.`,
      sol: [R`$x = 0{,}\overline{${p}}$, $${m === 1 ? '10' : '100'}x = ${p}{,}\overline{${p}}$.`, R`$${den}x = ${num}$, így $x = \dfrac{${num}}{${den}} = ${Q.tex(qv)}$.`]
    };
  });

  def('a1-rac-2', 'algebra', 'racionalis', 2, 'Vegyes szakaszos tizedestört törtté', function (r) {
    var k = r.int(1, 2), m = r.int(1, 2), pre = '', per = '', i, I = r.int(0, 3);
    for (i = 0; i < k; i++) pre += r.int(1, 8);
    for (i = 0; i < m; i++) per += r.int(1, 8);
    var den = Math.pow(10, k) * (Math.pow(10, m) - 1), num = Number(pre + per) - Number(pre), frac = Q.make(num, den), tot = Q.add(Q.make(I, 1), frac);
    return {
      q: R`Írd fel egyszerűsített közönséges tört alakban (például 68/55): $${I}{,}${pre}\overline{${per}}$`,
      answer: { type: 'num', value: Q.val(tot) }, ansTex: Q.tex(tot),
      verify: `${I}+(${Number(pre + per)}-${Number(pre)})/${den}`,
      tip1: R`Két szorzással éred el, hogy a szakasz ugyanott kezdődjön, majd kivonod egymásból a két egyenletet.`,
      tip2: R`A nevező: a szakasz hosszának megfelelő számú 9-es, utána az előszakasz hosszának megfelelő számú $0$: $${den}$.`,
      sol: [R`A(z) $${I}$ egész rész után a $0{,}${pre}\overline{${per}}$ részt írjuk át.`, R`Számláló: $${pre}${per} - ${pre} = ${num}$; nevező: $${den}$. $0{,}${pre}\overline{${per}} = \dfrac{${num}}{${den}} = ${Q.tex(frac)}$.`, R`Az egész résszel együtt: $${Q.tex(tot)}$.`]
    };
  });

  def('a1-rac-3', 'algebra', 'racionalis', 2, 'Hány irracionális szám van a felsoroltak között?', function (r) {
    var rv = function (n) { return n + '-' + { 3: 'mal', 4: 'gyel', 5: 'tel', 6: 'tal', 7: 'tel', 8: 'cal', 9: 'cel', 10: 'zel', 11: 'gyel', 12: 'vel', 13: 'mal', 14: 'gyel' }[n]; };
    var pool = [], k = r.pick([2, 3, 5, 6, 7, 10, 11, 13]), s = r.int(3, 12), a = r.int(1, 8), d = r.int(1, 8), j = r.int(2, 9);
    pool.push({ t: '\\sqrt{' + k + '}', irr: true, why: (k === 5 ? 'az ' : 'a ') + k + ' nem négyzetszám' });
    pool.push({ t: '\\sqrt{' + (s * s) + '}', irr: false, why: 'egyenlő ' + rv(s) });
    pool.push({ t: '0{,}\\overline{' + d + '}', irr: false, why: 'szakaszos tizedestört' });
    pool.push({ t: '\\pi', irr: true, why: 'a $\\pi$ irracionális' });
    pool.push({ t: '\\sqrt{2} \\cdot \\sqrt{8}', irr: false, why: 'egyenlő 4-gyel' });
    pool.push({ t: '\\sqrt{' + k + '} + ' + j, irr: true, why: 'racionális + irracionális' });
    pool.push({ t: '\\dfrac{' + a + '}{' + (j + 1) + '}', irr: false, why: 'két egész hányadosa' });
    pool.push({ t: '\\sqrt{' + (k + 1) + '^2}', irr: false, why: 'egyenlő ' + rv(k + 1) });
    var chosen = r.shuffle(pool).slice(0, 5), cnt = 0, lines = [];
    chosen.forEach(function (c) { if (c.irr) cnt++; lines.push('$' + c.t + '$: ' + (c.irr ? 'irracionális' : 'racionális') + ' (' + c.why + ')'); });
    return {
      q: R`Hány irracionális szám van az alábbiak között? $${chosen.map(function (c) { return c.t; }).join(';\\quad ')}$`,
      answer: { type: 'num', value: cnt }, ansTex: K.T(cnt),
      verify: String(cnt),
      tip1: R`Egyenként döntsd el, hogy a szám felírható-e két egész hányadosaként; alakítsd egyszerűbb alakra.`,
      tip2: R`Négyzetszám gyöke egész, szakaszos tizedestört racionális, racionális + irracionális irracionális.`,
      sol: lines.concat([R`Összesen $${cnt}$ irracionális szám van.`])
    };
  });

  def('a1-rac-4', 'algebra', 'racionalis', 2, 'Irracionális négyzetgyökök száma', function (r) {
    var lo = r.int(1, 30), hi = lo + r.int(30, 170), first = Math.ceil(Math.sqrt(lo)), last = Math.floor(Math.sqrt(hi)), sq = last - first + 1, ans = (hi - lo + 1) - sq;
    return {
      q: R`Hány olyan $n$ egész szám van $${lo}$ és $${hi}$ között (a határokat is beleértve), amelyre $\sqrt{n}$ irracionális?`,
      answer: { type: 'num', value: ans }, ansTex: K.T(ans),
      verify: `(${hi}-${lo}+1)-(${last}-${first}+1)`,
      tip1: R`$\sqrt{n}$ pontosan akkor racionális, ha $n$ négyzetszám. Számold meg a négyzetszámokat a tartományban.`,
      tip2: R`A legkisebb négyzetszám a tartományban $${first}^2 = ${first * first}$, a legnagyobb $${last}^2 = ${last * last}$.`,
      sol: [R`A szóba jövő négyzetszámok: $${first}^2 = ${first * first}$ és $${last}^2 = ${last * last}$ között (a határokat is beleértve), ez $${last} - ${first} + 1 = ${sq}$ darab.`, R`Összesen $${hi - lo + 1}$ szám van, így az irracionális négyzetgyökűek száma $${hi - lo + 1} - ${sq} = ${ans}$.`]
    };
  });

  def('a1-rac-5', 'algebra', 'racionalis', 3, 'Mikor racionális a gyök?', function (r) {
    var s = r.pick([2, 3, 5, 6, 7, 10]), t = r.int(1, 4), C = s * t * t, N = r.int(100, 600), cnt = 0, n;
    for (n = 1; n <= N; n++) if (isSq(C * n)) cnt++;
    var ans = Math.floor(Math.sqrt(N / s) + 1e-9);
    return {
      q: R`Hány olyan $n$ pozitív egész szám van, amelyre $n \le ${N}$, és $\sqrt{${C} \cdot n}$ racionális szám?`,
      answer: { type: 'num', value: ans }, ansTex: K.T(ans),
      verify: String(cnt),
      tip1: R`A gyök akkor racionális, ha a gyök alatti szorzat négyzetszám. Bontsd fel ezt a számot: $${C}$. Mennyi benne a négyzetes rész?`,
      tip2: R`$${C} = ${s} \cdot ${t * t}$, ezért $${C} \cdot n$ akkor négyzetszám, ha $n = ${s} \cdot m^2$ alakú.`,
      sol: [R`$${C} = ${s} \cdot ${t}^2$, tehát $${C}n = ${t}^2 \cdot ${s}n$ pontosan akkor négyzetszám, ha $${s}n$ négyzetszám.`, R`Mivel $${s}$ négyzetmentes (nincs 1-nél nagyobb négyzetszám osztója), ez akkor teljesül, ha $n = ${s} m^2$ ($m$ pozitív egész).`, R`$${s} m^2 \le ${N}$, azaz $m^2 \le ${K.T(N / s, 2)}$ közelítőleg, $m \le ${ans}$: $${ans}$ ilyen szám van.`]
    };
  });

  def('a1-rac-6', 'algebra', 'racionalis', 1, 'Véges vagy szakaszos tizedestört?', function (r) {
    var b = r.pick([2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 14, 15, 16, 20, 24, 25, 30, 40, 45, 50]), a = r.int(1, 49), dn = b / MO.gcd(a, b), fin = true, x;
    x = dn; while (x % 2 === 0) x /= 2; while (x % 5 === 0) x /= 5; fin = (x === 1);
    var okT = fin ? 'véges tizedestört' : 'végtelen szakaszos tizedestört';
    return {
      q: R`Milyen alakú tizedestört a $\dfrac{${a}}{${b}}$ tört?`,
      answer: K.choice(r, okT, ['véges tizedestört', 'végtelen szakaszos tizedestört', 'végtelen, nem szakaszos tizedestört'].filter(function (s) { return s !== okT; }).concat([])),
      ansTex: '\\text{' + okT + '}',
      tip1: R`Egyszerűsítsd a törtet, és nézd meg a nevező prímtényezőit.`,
      tip2: R`Csak akkor véges a tizedestört, ha az egyszerűsített nevezőben kizárólag $2$ és $5$ szerepel.`,
      sol: [R`Egyszerűsítve a nevező $${dn}$.`, R`A nevező ${fin ? 'csak 2-es és 5-ös prímtényezőt tartalmaz' : 'olyan prímtényezőt is tartalmaz, ami nem $2$ és nem $5$'}, ezért ${fin ? 'véges' : 'végtelen szakaszos'} tizedestört.`, R`Irracionális nem lehet, mert a tört két egész hányadosa.`]
    };
  });

  def('a1-rac-7', 'algebra', 'racionalis', 3, 'Szakaszos tizedestörtek műveletei', function (r) {
    var A = r.int(1, 8), B = r.int(1, 8), C = r.int(11, 88), op = r.int(0, 2);
    while (C % 11 === 0) C += 1;
    var x = Q.make(C, 99), y = Q.make(B, 9), res, sym;
    if (op === 0) { res = Q.add(x, y); sym = '+'; } else if (op === 1) { res = Q.sub(x, y); sym = '-'; } else { res = Q.mul(x, y); sym = '\\cdot'; }
    var vsym = op === 0 ? '+' : op === 1 ? '-' : '*';
    return {
      q: R`Számítsd ki a pontos értéket egyszerűsített közönséges törtként (például 7/12): $0{,}\overline{${C}} ${sym} 0{,}\overline{${B}}$`,
      answer: { type: 'num', value: Q.val(res) }, ansTex: Q.tex(res),
      verify: `(${C}/99)${vsym}(${B}/9)`,
      tip1: R`Írd át mindkét számot közönséges törtté, és csak utána végezd el a műveletet.`,
      tip2: R`$0{,}\overline{${C}} = \dfrac{${C}}{99}$ és $0{,}\overline{${B}} = \dfrac{${B}}{9}$.`,
      sol: [R`$0{,}\overline{${C}} = \dfrac{${C}}{99} = ${Q.tex(x)}$, $0{,}\overline{${B}} = \dfrac{${B}}{9} = ${Q.tex(y)}$.`, R`$${Q.tex(x)} ${sym} ${Q.tex(y)} = ${Q.tex(res)}$.`]
    };
  });

  /* ================= 2.4 VALÓS SZÁMOK ================= */
  MO.content['algebra/valos'] = {
    intro: R`A valós számok halmaza minden eddigi számkört magában foglal: $\mathbb{N} \subset \mathbb{Z} \subset \mathbb{Q} \subset \mathbb{R}$, és az irracionális számokkal együtt a számegyenes minden pontjához tartozik egy szám. A követelmény 2.4 pontja ide sorolja az intervallumokat, az abszolútértéket, a normálalakot és a kerekítést is, emelt szinten pedig a műveletekre zárt számhalmazok fogalmát. Ezek más témákban (egyenlőtlenségek, függvények, számolás) sokszor előjönnek.`,
    theory: [
      { h: 'A valós számkör felépítése',
        b: R`Számhalmazok: $\mathbb{N}$ (természetes számok), $\mathbb{Z}$ (egész számok), $\mathbb{Q}$ (racionális számok), $\mathbb{Q}^*$ (irracionális számok), $\mathbb{R}$ (valós számok). Kapcsolatuk: $\mathbb{N} \subset \mathbb{Z} \subset \mathbb{Q} \subset \mathbb{R}$, és $\mathbb{R} = \mathbb{Q} \cup \mathbb{Q}^*$, ahol $\mathbb{Q} \cap \mathbb{Q}^* = \emptyset$.\nMiért kellett bővíteni? $\mathbb{N}$-ben nem mindig végezhető el a kivonás ($3 - 5$), ezért jött az $\mathbb{Z}$; $\mathbb{Z}$-ben nem mindig végezhető el az osztás ($3 : 5$), ezért jött az $\mathbb{Q}$; $\mathbb{Q}$-ban nincs például a $2$ négyzetgyöke, ezért jött az $\mathbb{R}$. Jelölés: $\mathbb{R}^+$ a pozitív, $\mathbb{R}^-$ a negatív valós számok halmaza.` },
      { h: 'Valós számok és a számegyenes',
        b: R`A számegyenes pontjai és a valós számok között **kölcsönösen egyértelmű megfeleltetés** van: minden valós számhoz tartozik egy pont, és a számegyenes minden pontja egy valós számnak felel meg. Ábrázoláshoz kijelölünk egy $0$ pontot és egy egységet; a pozitív számok jobbra, a negatívak balra kerülnek.\nHa $a < b$, akkor az $a$ a számegyenesen balra van a $b$-től. A racionális számok "sűrűn" helyezkednek el, mégis lyukak maradnak közöttük: az irracionális számok is hozzátartoznak a számegyeneshez. Például $\sqrt{2}$ megszerkeszthető egy $1$ befogójú egyenlő szárú derékszögű háromszög átfogójaként.` },
      { h: 'Műveletekre zárt számhalmazok', level: 'emelt',
        b: R`Egy $H$ számhalmaz **zárt** egy műveletre, ha a halmaz bármely két elemén elvégezve a műveletet, az eredmény is a halmaz eleme.\n- $\mathbb{N}$: zárt az összeadásra és a szorzásra; nem zárt a kivonásra ($3 - 5 \notin \mathbb{N}$) és az osztásra.\n- $\mathbb{Z}$: zárt az összeadásra, kivonásra, szorzásra; az osztásra nem ($3 : 5 \notin \mathbb{Z}$).\n- $\mathbb{Q}$ és $\mathbb{R}$: zártak az összeadásra, kivonásra, szorzásra, és az osztásra is (a $0$ osztó kivételével).\n- $\mathbb{Q}^*$ (irracionális számok): egyik műveletre sem zárt: $\sqrt{2} + (-\sqrt{2}) = 0$, $\sqrt{2} \cdot \sqrt{2} = 2$.\nEgy halmaz nem zártságát egyetlen **ellenpélda** igazolja; a zártságot általánosan kell bizonyítani.` },
      { h: 'Intervallumok',
        b: R`**Zárt intervallum**: $[a; b] = \{x \in \mathbb{R} \mid a \le x \le b\}$ (a végpontok is benne vannak). **Nyílt intervallum**: $]a; b[ = \{x \mid a < x < b\}$. **Balról zárt, jobbról nyílt**: $[a; b[$; **balról nyílt, jobbról zárt**: $]a; b]$. Az intervallum **hossza** $b - a$.\n**Végtelen intervallumok:** $[a; \infty[ = \{x \mid x \ge a\}$, $]a; \infty[$, $]-\infty; b]$, $]-\infty; b[$; az egész számegyenes $]-\infty; \infty[ = \mathbb{R}$. A $\pm\infty$ nem szám, ezért mellette mindig nyílt a zárójel.\nSzámegyenesen a zárt végpontot tele ponttal, a nyíltat üres körrel jelöljük. Intervallumokkal halmazműveletek is végezhetők: például $[1; 5[ \cap ]3; 8] = ]3; 5[$ és $[1; 5[ \cup ]3; 8] = [1; 8]$.` },
      { h: 'Az abszolútérték',
        b: R`Az $x$ valós szám **abszolútértéke**: $|x| = x$, ha $x \ge 0$, és $|x| = -x$, ha $x < 0$. Geometriai jelentése: a számegyenesen az $x$ távolsága a 0-tól; $|a - b|$ az $a$ és $b$ távolsága.\nTulajdonságok: $|x| \ge 0$; $|x| = 0 \iff x = 0$; $|-x| = |x|$; $|ab| = |a| \cdot |b|$; $\left|\dfrac{a}{b}\right| = \dfrac{|a|}{|b|}$ ($b \ne 0$); $\sqrt{x^2} = |x|$. A $\sqrt{x^2}$ **nem** egyenlő $x$-szel, ha $x < 0$.\n**Kiegészítés (egyszerű abszolútértékes egyenlőtlenségek):** $|x - a| < b$ azt jelenti, hogy $x$ távolsága $a$-tól kisebb $b$-nél, azaz $a - b < x < a + b$; $|x - a| = b$ ($b > 0$) esetén $x = a - b$ vagy $x = a + b$.` },
      { h: 'Normálalak',
        b: R`Egy pozitív szám **normálalakja** $a \cdot 10^k$, ahol $1 \le a < 10$ és $k$ egész. Nagyon nagy és nagyon kis számok rövid felírására használjuk: $45\,200\,000 = 4{,}52 \cdot 10^7$, $0{,}000375 = 3{,}75 \cdot 10^{-4}$. A kitevő megmutatja, hány helyiértéket kell a tizedesvesszőt jobbra ($k > 0$) vagy balra ($k < 0$) vinni. Negatív szám normálalakja: $-a \cdot 10^k$.\n**Műveletek:** szorzás: $(a \cdot 10^m)(b \cdot 10^n) = ab \cdot 10^{m+n}$; osztás: $\dfrac{a \cdot 10^m}{b \cdot 10^n} = \dfrac{a}{b} \cdot 10^{m-n}$. Ha a kapott első tényező nem esik $[1; 10[$-be, át kell alakítani: $12 \cdot 10^3 = 1{,}2 \cdot 10^4$. Összeadásnál/kivonásnál előbb közös kitevőre kell hozni a tagokat. A zsebszámológép is így ír ki nagy számot: $4{,}52\text{E}7$.` },
      { h: 'Kerekítés',
        b: R`Adott helyiértékre kerekítésnél megnézzük a következő (elhagyott) jegyet: ha $0; 1; 2; 3; 4$, akkor az utolsó megtartott jegy változatlan marad (**lefelé** kerekítünk); ha $5; 6; 7; 8; 9$, akkor eggyel nő (**felfelé** kerekítünk). A magyar szabály szerint a pontos fél egységet felfelé kerekítjük. Például egész tízesre: $4537 \approx 4540$; századra: $2{,}3649 \approx 2{,}36$; egészre: $7{,}5 \approx 8$.\nLánckerekítés tilos: a $2{,}449$ egészre kerekítve $2$, mert az első elhagyott jegy a $4$; a $2{,}449 \to 2{,}45 \to 2{,}5 \to 3$ hibás. Köztes számításnál ne kerekíts, csak a végeredményt kerekítsd, és használd az $\approx$ jelet.` }
    ],
    examples: [
      { t: 'Számolás normálalakkal',
        p: R`Számítsd ki és add meg normálalakban: a) $(3{,}6 \cdot 10^5) \cdot (2{,}5 \cdot 10^{-8})$; b) $\dfrac{4{,}5 \cdot 10^7}{1{,}5 \cdot 10^{-3}}$.`,
        steps: [R`a) A számokat külön szorozzuk: $3{,}6 \cdot 2{,}5 = 9$, a kitevőket összeadjuk: $5 + (-8) = -3$. Az eredmény $9 \cdot 10^{-3}$, ami normálalak ($1 \le 9 < 10$).`, R`Ellenőrzés: $9 \cdot 10^{-3} = 0{,}009$.`, R`b) A számokat osztjuk: $4{,}5 : 1{,}5 = 3$, a kitevőket kivonjuk: $7 - (-3) = 10$.`, R`Az eredmény $3 \cdot 10^{10}$, ami normálalak.`],
        ans: R`a) $9 \cdot 10^{-3} = 0{,}009$; b) $3 \cdot 10^{10}$.`,
        checks: [['3,6*2,5', '9'], ['5+(-8)', '-3'], ['9*10^(-3)', '0,009'], ['4,5/1,5', '3'], ['7-(-3)', '10']] },
      { t: 'Kerekítés valós feladatban',
        p: R`A Nap és a Föld távolsága $1{,}496 \cdot 10^8$ km, a fény sebessége $3 \cdot 10^5$ km/s. Hány másodperc alatt ér a Napból a fény a Földre? Kerekítsd az eredményt egész másodpercre!`,
        steps: [R`Idő $=$ út : sebesség $= \dfrac{1{,}496 \cdot 10^8}{3 \cdot 10^5}$ másodperc.`, R`$\dfrac{1{,}496}{3} \cdot 10^{8-5} = \dfrac{1{,}496}{3} \cdot 10^3 = \dfrac{1496}{3} = 498{,}666\dots$`, R`Egészre kerekítés: az első elhagyott jegy $6$, tehát felfelé kerekítünk: $\approx 499$.`, R`Ellenőrzés: $3 \cdot 499 \cdot 10^5 = 1{,}497 \cdot 10^8$, ami valóban közel van a távolsághoz; a kerekítés hibája kisebb, mint $\dfrac{1}{2}$.`],
        ans: R`A fény kb. $499$ másodperc (kb. $8$ perc $19$ másodperc) alatt ér a Földre.`,
        checks: [['1,496*10^8/(3*10^5)', '1496/3'], ['(1496/3)*3', '1496'], ['|499-1496/3|', '1/3']] },
      { t: 'Intervallumok metszete, unió, abszolútérték',
        p: R`Legyen $A = [-2; 5[$ és $B = ]1; 7]$. Add meg $A \cap B$-t és $A \cup B$-t, és számold meg a metszet egész elemeit! Mely $x$ valós számokra teljesül $|x - 3| < 2$?`,
        steps: [R`A metszet azok a számok, amelyek mindkét halmazban benne vannak: $x > 1$ (a $B$ miatt) és $x < 5$ (az $A$ miatt): $A \cap B = ]1; 5[$.`, R`Az unió: $A$ bal vége $-2$ (zárt), $B$ jobb vége $7$ (zárt), és a két intervallum átfedi egymást: $A \cup B = [-2; 7]$.`, R`A metszet egész elemei: $2; 3; 4$, azaz $3$ db.`, R`$|x - 3| < 2$ azt jelenti, hogy $x$ távolsága 3-tól kisebb 2-nél: $3 - 2 < x < 3 + 2$, azaz $1 < x < 5$, vagyis $x \in ]1; 5[$.`],
        ans: R`$A \cap B = ]1; 5[$, $A \cup B = [-2; 7]$, a metszetben $3$ egész szám van; $|x - 3| < 2 \iff x \in ]1; 5[$.`,
        checks: [['4-2+1', '3'], ['3-2', '1'], ['3+2', '5'], ['|-2|+|1|', '3']] },
      { t: 'Zárt halmazok és abszolútértékes egyenlet (emelt)',
        p: R`a) Igazold, hogy a racionális számok halmaza zárt az összeadásra, az irracionális számoké viszont nem. b) Oldd meg a valós számok halmazán: $|x - 2| + |x + 1| = 5$.`,
        steps: [R`a) Ha $\dfrac{a}{b}$ és $\dfrac{c}{d}$ racionális ($b, d \ne 0$), akkor összegük $\dfrac{ad + bc}{bd}$ két egész hányadosa, $bd \ne 0$, tehát racionális. Például $\dfrac{1}{2} + \dfrac{1}{3} = \dfrac{5}{6}$.`, R`Az irracionálisok nem zártak az összeadásra, mert $\sqrt{2}$ és $-\sqrt{2}$ irracionális, de összegük $0$ racionális.`, R`b) Az abszolútértékek előjelváltási helyei: $x = 2$ és $x = -1$. Három esetet vizsgálunk. Ha $x \ge 2$: $(x - 2) + (x + 1) = 2x - 1 = 5$, $x = 3$, ez megfelel a feltételnek.`, R`Ha $-1 \le x < 2$: $(2 - x) + (x + 1) = 3 \ne 5$, nincs megoldás. Ha $x < -1$: $(2 - x) + (-x - 1) = 1 - 2x = 5$, $x = -2$, ez megfelel a feltételnek.`, R`Ellenőrzés: $|3 - 2| + |3 + 1| = 1 + 4 = 5$ és $|-2 - 2| + |-2 + 1| = 4 + 1 = 5$.`],
        ans: R`a) $\mathbb{Q}$ zárt az összeadásra, $\mathbb{Q}^*$ nem. b) $x = 3$ vagy $x = -2$.`,
        checks: [['1/2+1/3', '5/6'], ['sqrt(2)+(-sqrt(2))', '0'], ['|3-2|+|3+1|', '5'], ['|-2-2|+|-2+1|', '5'], ['2*3-1', '5'], ['1-2*(-2)', '5']] }
    ],
    sims: ['abszolutertek', 'atvalto'],
    mistakes: [
      R`$|x|$ nem mindig $x$, és nem mindig $-x$: negatív $x$-nél $|x| = -x$ (pozitív). Az $|-5| = 5$, nem $-5$.`,
      R`$\sqrt{x^2} = x$ hibás: helyesen $\sqrt{x^2} = |x|$. Például $\sqrt{(-3)^2} = 3$, nem $-3$.`,
      R`A $\pm\infty$ végpontnál nem szabad zárt végpontot (befelé hajló szögletes zárójelet) írni: $]-\infty; 3]$ helyes, a $[-\infty; 3]$ hibás, mert a végtelen nem szám.`,
      R`Normálalak: $12 \cdot 10^3$ vagy $0{,}5 \cdot 10^3$ nem normálalak, mert az első tényező nem esik $[1; 10[$-be. Helyesen: $1{,}2 \cdot 10^4$, illetve $5 \cdot 10^2$.`,
      R`Lánckerekítés: $2{,}449 \to 2{,}45 \to 2{,}5 \to 3$ hibás, mert mindig az eredeti számból, az első elhagyott jegyet nézve kell kerekíteni (itt $2$).`,
      R`A számhalmazok zártságánál a kivonás $\mathbb{N}$-ben nem végezhető el mindig: $3 - 5 \notin \mathbb{N}$. A zártság azt jelenti, hogy **mindig** a halmazban marad az eredmény; egy ellenpélda elég a cáfolathoz.`
    ],
    exam: R`A követelmény közép- és emelt szinten is kéri a valós számkör felépítésének ($\mathbb{N}, \mathbb{Z}, \mathbb{Q}, \mathbb{Q}^*, \mathbb{R}$) és a számegyenessel való kapcsolatának ismeretét, a számok ábrázolását a számegyenesen, a nyílt és zárt intervallum fogalmát és jelölését, az abszolútérték definícióját, a normálalak felírását és a vele való számolást, valamint a helyes kerekítést adott helyiértékre. Emelt szinten tudni kell azt is, hogy mit értünk adott műveletekre zárt számhalmazon.`,
    cheat: [R`\mathbb{N} \subset \mathbb{Z} \subset \mathbb{Q} \subset \mathbb{R},\quad \mathbb{R} = \mathbb{Q} \cup \mathbb{Q}^*`, R`|x| = \begin{cases} x, & x \ge 0 \\ -x, & x < 0 \end{cases}`, R`|x - a| < b \iff a - b < x < a + b`, R`[a; b] = \{x \mid a \le x \le b\},\quad ]a; b[ = \{x \mid a < x < b\}`, R`a \cdot 10^k,\ 1 \le a < 10,\ k \in \mathbb{Z}`, R`(a \cdot 10^m)(b \cdot 10^n) = ab \cdot 10^{m+n}`],
    cheatChecks: [['(a*10^m)*(b*10^n)', 'a*b*10^(m+n)'], ['sqrt(x^2)', '|x|'], ['|a*b|', '|a|*|b|'], ['|a-b|', '|b-a|'], ['(a*10^m)/(b*10^n)', 'a/b*10^(m-n)']],
    terms: ['valós szám', 'számegyenes', 'zárt intervallum', 'nyílt intervallum', 'abszolútérték', 'normálalak', 'kerekítés', 'zárt számhalmaz', 'természetes számok', 'egész számok', 'racionális számok', 'irracionális számok']
  };

  def('a1-val-1', 'algebra', 'valos', 1, 'Normálalak kitevője', function (r) {
    var k = r.int(-9, 12), len = r.int(1, 4), D = String(r.int(1, 9)), i, shown, mant;
    for (i = 1; i < len; i++) D += r.int(i === len - 1 ? 1 : 0, 9);
    mant = D.length === 1 ? D : D.charAt(0) + '{,}' + D.slice(1);
    if (k >= 0) shown = D.length > k + 1 ? D.slice(0, k + 1) + '{,}' + D.slice(k + 1) : grp(D + zeros(k + 1 - D.length));
    else shown = '0{,}' + zeros(-k - 1) + D;
    return {
      q: R`Add meg a(z) $${shown}$ szám normálalakjában a $10$ hatványának kitevőjét.`,
      answer: { type: 'num', value: k }, ansTex: K.T(k),
      verify: String(k),
      tip1: R`A normálalakban az első tényező $1$ és $10$ között van ($1 \le a < 10$).`,
      tip2: R`Számold meg, hány helyiértéket kell a tizedesvesszőt elvinni, hogy a szám első jegye után álljon.`,
      sol: [R`A szám normálalakja: $${mant} \cdot 10^{${k}}$.`, R`A kitevő tehát $${K.T(k)}$.`]
    };
  });

  def('a1-val-2', 'algebra', 'valos', 2, 'Műveletek normálalakkal', function (r) {
    var A, B, m = r.int(-9, 9), n = r.int(-9, 9), op = r.int(0, 1), k, shift;
    do { A = r.int(11, 99); } while (A % 10 === 0);
    do { B = r.int(11, 99); } while (B % 10 === 0);
    var sa = Math.floor(A / 10) + '{,}' + (A % 10), sb = Math.floor(B / 10) + '{,}' + (B % 10);
    if (op === 0) {
      shift = A * B >= 1000 ? 1 : 0; k = m + n + shift;
      return {
        q: R`Mennyi a szorzat normálalakjában a $10$ hatványának kitevője? $(${sa} \cdot 10^{${m}}) \cdot (${sb} \cdot 10^{${n}})$`,
        answer: { type: 'num', value: k }, ansTex: K.T(k),
        verify: `(${m})+(${n})+${shift}`,
        tip1: R`Szorozd külön az első tényezőket, és add össze a kitevőket. Utána nézd meg, hogy az első tényező még $10$ alatt van-e.`,
        tip2: R`$${sa} \cdot ${sb} = ${K.T(A * B / 100, 4)}$. ${shift ? 'Ez $10$ vagy több, ezért át kell alakítani.' : 'Ez 10-nél kisebb, így nem kell átalakítani.'}`,
        sol: [R`$${sa} \cdot ${sb} = ${K.T(A * B / 100, 4)}$ és $${m} + (${n}) = ${m + n}$.`, shift ? R`Az első tényező $10$ vagy nagyobb: $${K.T(A * B / 100, 4)} \cdot 10^{${m + n}} = ${K.T(A * B / 1000, 5)} \cdot 10^{${m + n + 1}}$.` : R`Az első tényező $1$ és $10$ közé esik, így az eredmény már normálalak.`, R`A kitevő: $${K.T(k)}$.`]
      };
    }
    shift = A >= B ? 0 : -1; k = m - n + shift;
    return {
      q: R`Mennyi a hányados normálalakjában a $10$ hatványának kitevője? $\dfrac{${sa} \cdot 10^{${m}}}{${sb} \cdot 10^{${n}}}$`,
      answer: { type: 'num', value: k }, ansTex: K.T(k),
      verify: `(${m})-(${n})+(${shift})`,
      tip1: R`Oszd az első tényezőket egymással, vond ki a kitevőket, majd ellenőrizd, hogy az első tényező $1$ és $10$ között van-e.`,
      tip2: R`$${sa} : ${sb}$ ${A >= B ? 'legalább $1$' : '1-nél kisebb, ezért a tizedesvesszőt egy hellyel arrébb kell vinni, a kitevő eggyel csökken'}.`,
      sol: [R`Kitevők különbsége: $${m} - (${n}) = ${m - n}$.`, A >= B ? R`Az első tényezők hányadosa legalább $1$ (és 10-nél kisebb), tehát nincs szükség átalakításra.` : R`Az első tényezők hányadosa 1-nél kisebb, ezért 10-zel szorozva és a kitevőt 1-gyel csökkentve kapjuk a normálalakot.`, R`A kitevő: $${K.T(k)}$.`]
    };
  });

  def('a1-val-3', 'algebra', 'valos', 1, 'Kerekítés adott helyiértékre', function (r) {
    var dp = r.int(-2, 2), names = { '-2': 'százasokra', '-1': 'tízesekre', '0': 'egészekre', '1': 'tizedekre', '2': 'századokra' }, x, res, m, P, q, txt, ans, lo;
    if (dp >= 0) {
      lo = Math.pow(10, dp + 1) * 2; m = r.int(lo, lo * 50); if (m % 10 === 5) m += 1;
      q = Math.round(m / 10); txt = decStr(m, dp + 1); ans = decStr(q, dp);
      res = q / Math.pow(10, dp);
      return {
        q: R`Kerekítsd a(z) $${txt}$ számot ${names[dp]}.`,
        answer: { type: 'num', value: res, tol: 1e-9 }, ansTex: ans,
        verify: `${q}/${Math.pow(10, dp)}`,
        tip1: R`Nézd meg az első elhagyandó jegyet: $5$ vagy több esetén felfelé, $4$ vagy kevesebb esetén lefelé kerekítünk.`,
        tip2: R`Az elhagyott jegy a szám utolsó számjegye: $${m % 10}$.`,
        sol: [R`Az első elhagyott jegy $${m % 10}$, ezért ${m % 10 >= 5 ? 'felfelé' : 'lefelé'} kerekítünk.`, R`$${txt} \approx ${ans}$`]
      };
    }
    P = Math.pow(10, -dp); m = r.int(1000, 99999); if (m % P === P / 2) m += 1;
    q = Math.round(m / P); res = q * P;
    return {
      q: R`Kerekítsd a(z) $${grp(m)}$ számot ${names[dp]}.`,
      answer: { type: 'num', value: res }, ansTex: grp(res),
      verify: `${q}*${P}`,
      tip1: R`Nézd meg az első elhagyandó jegyet: $5$ vagy több esetén felfelé, $4$ vagy kevesebb esetén lefelé kerekítünk.`,
      tip2: R`Az utolsó ${-dp} jegyet kell elhagyni, ezek helyére nullák kerülnek.`,
      sol: [R`Az elhagyott rész $${m % P}$; a kerekítés helyiértékének fele $${P / 2}$, az elhagyott rész ${m % P > P / 2 ? 'több ennél, ezért felfelé kerekítünk' : 'kevesebb ennél, ezért lefelé kerekítünk'}.`, R`$${grp(m)} \approx ${grp(res)}$`]
    };
  });

  def('a1-val-4', 'algebra', 'valos', 2, 'Intervallumok metszete', function (r) {
    var a = r.int(-9, 3), b = a + r.int(3, 10), c = r.int(-9, 6), d = c + r.int(3, 10), oa = r.int(0, 1), ob = r.int(0, 1), oc = r.int(0, 1), od = r.int(0, 1), cnt = 0, x;
    function ins(v, lo, hi, ol, oh) { return (ol ? v > lo : v >= lo) && (oh ? v < hi : v <= hi); }
    for (x = -50; x <= 50; x++) if (ins(x, a, b, oa, ob) && ins(x, c, d, oc, od)) cnt++;
    var lo, ol, hi, oh, la, lb;
    if (a > c) { lo = a; ol = oa; } else if (a < c) { lo = c; ol = oc; } else { lo = a; ol = oa || oc; }
    if (b < d) { hi = b; oh = ob; } else if (b > d) { hi = d; oh = od; } else { hi = b; oh = ob || od; }
    var loI = lo + (ol ? 1 : 0), hiI = hi - (oh ? 1 : 0), ver = hiI >= loI ? `(${hiI})-(${loI})+1` : '0';
    function iv(p, q2, o1, o2) { return (o1 ? ']' : '[') + K.T(p) + ';\\ ' + K.T(q2) + (o2 ? '[' : ']'); }
    return {
      q: R`Hány egész szám van az $A = ${iv(a, b, oa, ob)}$ és a $B = ${iv(c, d, oc, od)}$ intervallum metszetében?`,
      answer: { type: 'num', value: cnt }, ansTex: K.T(cnt),
      verify: ver,
      tip1: R`Ábrázold a két intervallumot a számegyenesen, és keresd meg, hol fedik egymást; a nyílt végpont nem tartozik hozzá.`,
      tip2: R`A metszet bal végpontja a két bal végpont közül a nagyobb, a jobb végpontja a két jobb végpont közül a kisebb.`,
      sol: [R`A metszet: bal vége $${K.T(lo)}$ (${ol ? 'nyílt' : 'zárt'}), jobb vége $${K.T(hi)}$ (${oh ? 'nyílt' : 'zárt'}).`, hiI >= loI ? R`Az egész számok $${K.T(loI)}$ és $${K.T(hiI)}$ között vannak (a határokat is beleértve): $${hiI} - (${loI}) + 1 = ${cnt}$ db.` : R`A metszetnek nincs egész eleme, a válasz $0$.`]
    };
  });

  def('a1-val-5', 'algebra', 'valos', 2, 'Abszolútértékes egyenlőtlenség egész megoldásai', function (r) {
    var a = r.int(-9, 9), b = r.int(2, 9), strict = r.int(0, 1) === 0, cnt = strict ? 2 * b - 1 : 2 * b + 1, lo = strict ? a - b + 1 : a - b, hi = strict ? a + b - 1 : a + b;
    var xa = a === 0 ? 'x' : (a > 0 ? 'x - ' + a : 'x + ' + (-a));
    return {
      q: R`Hány egész szám elégíti ki az $|${xa}| ${strict ? '<' : '\\le'} ${b}$ egyenlőtlenséget?`,
      answer: { type: 'num', value: cnt }, ansTex: K.T(cnt),
      verify: strict ? `${b}+${b}-1` : `${b}+${b}+1`,
      tip1: R`Az $|x - a| < b$ azt jelenti, hogy $x$ távolsága $a$-tól kisebb $b$-nél. Írd át kettős egyenlőtlenséggé.`,
      tip2: R`$${K.T(a - b)} ${strict ? '<' : '\\le'} x ${strict ? '<' : '\\le'} ${K.T(a + b)}$.`,
      sol: [R`$|${xa}| ${strict ? '<' : '\\le'} ${b} \iff ${K.T(a - b)} ${strict ? '<' : '\\le'} x ${strict ? '<' : '\\le'} ${K.T(a + b)}$.`, R`Az egész megoldások $${K.T(lo)}$ és $${K.T(hi)}$ között vannak (a határokat is beleértve), ez $${hi} - (${lo}) + 1 = ${cnt}$ darab.`]
    };
  });

  def('a1-val-6', 'algebra', 'valos', 3, 'Két abszolútértékes egyenlet', function (r) {
    var a = r.nz(-9, 9), b = r.nz(-9, 9);
    while (Math.abs(a - b) < 2) b = r.nz(-9, 9);
    var D = Math.abs(a - b), none = r.int(0, 3) === 0, c;
    if (none) { c = r.int(1, D - 1); }
    else { c = D + r.int(1, 6); if ((a + b + c) % 2 !== 0) c += 1; }
    var xa = a > 0 ? 'x - ' + a : 'x + ' + (-a), xb = b > 0 ? 'x - ' + b : 'x + ' + (-b);
    var vals = none ? [] : [(a + b - c) / 2, (a + b + c) / 2];
    return {
      q: R`Oldd meg a valós számok halmazán: $|${xa}| + |${xb}| = ${c}$. A megoldásokat pontosvesszővel elválasztva add meg; ha nincs megoldás, írd be: nincs.`,
      answer: { type: 'set', values: vals }, ansTex: none ? '\\text{nincs megoldás}' : vals.map(function (v) { return K.T(v); }).join(';\\ '),
      verify: none ? '' : `(${a}+(${b})-${c})/2;(${a}+(${b})+${c})/2`,
      tip1: R`Az $|x - a| + |x - b|$ az $x$ távolságainak összege az $a$ és $b$ pontoktól. Mennyi ez, ha $x$ a két pont között van?`,
      tip2: R`A két pont távolsága $${D}$. Ha $x$ közöttük van, az összeg mindig $${D}$. Kívül: $${D} + 2 \cdot (\text{a legközelebbi ponttól mért távolság})$.`,
      sol: none ? [R`A két pont távolsága $${D}$, ez az összeg legkisebb értéke (a két pont között). Mivel $${c} < ${D}$, az egyenletnek nincs megoldása.`] : [R`A két pont távolsága $${D}$; az összeg legalább ennyi, és $${c} > ${D}$, ezért a megoldások a két ponton kívül vannak.`, R`A két megoldás szimmetrikus a két pont felezőpontjára: $m = \dfrac{${a} + (${b})}{2} = ${K.T((a + b) / 2)}$. A két ponton kívül az összeg $2 \cdot |x - m|$, ezért $|x - m| = ${K.T(c / 2)}$, azaz $x = m \pm ${K.T(c / 2)}$.`, R`$x = ${K.T(vals[0])}$ vagy $x = ${K.T(vals[1])}$. Ellenőrzés: $|${K.T(vals[1])} - (${a})| + |${K.T(vals[1])} - (${b})| = ${c}$.`]
    };
  });

  def('a1-val-7', 'algebra', 'valos', 2, 'Műveletekre zárt számhalmazok', function (r) {
    var sets = [
      { n: '\\mathbb{N}', z: { '+': 1, '-': 0, '\\cdot': 1 }, ce: { '-': '$3 - 5 \\notin \\mathbb{N}$' } },
      { n: '\\mathbb{Z}', z: { '+': 1, '-': 1, '\\cdot': 1 }, ce: {} },
      { n: '\\mathbb{Q}', z: { '+': 1, '-': 1, '\\cdot': 1 }, ce: {} },
      { n: '\\mathbb{R}', z: { '+': 1, '-': 1, '\\cdot': 1 }, ce: {} },
      { n: '\\mathbb{Q}^*', z: { '+': 0, '-': 0, '\\cdot': 0 }, ce: { '+': '$\\sqrt{2} + (-\\sqrt{2}) = 0$', '-': '$\\sqrt{2} - \\sqrt{2} = 0$', '\\cdot': '$\\sqrt{2} \\cdot \\sqrt{2} = 2$' } },
      { n: '\\text{a páros számok}', z: { '+': 1, '-': 1, '\\cdot': 1 }, ce: {} },
      { n: '\\text{a páratlan számok}', z: { '+': 0, '-': 0, '\\cdot': 1 }, ce: { '+': '$3 + 5 = 8$ páros', '-': '$5 - 3 = 2$ páros' } },
      { n: '[0;\\ 1]', z: { '+': 0, '-': 0, '\\cdot': 1 }, ce: { '+': '$1 + 1 = 2 \\notin [0; 1]$', '-': '$0 - 1 = -1 \\notin [0; 1]$' } },
      { n: '\\text{a negatív egészek}', z: { '+': 1, '-': 0, '\\cdot': 0 }, ce: { '-': '$-1 - (-2) = 1 > 0$', '\\cdot': '$(-1) \\cdot (-2) = 2 > 0$' } }
    ];
    var ops = ['+', '-', '\\cdot'], opNames = { '+': 'az összeadásra', '-': 'a kivonásra', '\\cdot': 'a szorzásra' }, op = r.pick(ops), chosen = r.shuffle(sets).slice(0, 5), cnt = 0, lines = [];
    chosen.forEach(function (s) { if (s.z[op]) cnt++; lines.push('$' + s.n + '$: ' + (s.z[op] ? 'zárt' : 'nem zárt' + (s.ce[op] ? ' (ellenpélda: ' + s.ce[op] + ')' : ''))); });
    return {
      q: R`Az alábbi halmazok közül hány zárt ${opNames[op]}? $${chosen.map(function (s) { return s.n; }).join(';\\quad ')}$${chosen.some(function (s) { return s.n === '\\mathbb{N}'; }) ? ' (Az $\\mathbb{N}$ a 0-t is tartalmazza.)' : ''}`,
      answer: { type: 'num', value: cnt }, ansTex: K.T(cnt),
      verify: String(cnt),
      tip1: R`Egy halmaz zárt a műveletre, ha bármely két elemén elvégezve az eredmény is a halmazban marad. Keress ellenpéldát!`,
      tip2: R`Gondolj ellenpéldára: két páratlan szám összege, két negatív szám szorzata, két irracionális szám összege...`,
      sol: lines.concat([R`Összesen $${cnt}$ halmaz zárt.`])
    };
  });

  def('a1-val-8', 'algebra', 'valos', 3, 'Abszolútérték és intervallum együtt', function (r) {
    var a = r.int(-6, 6), b = r.int(2, 7), c = r.int(-12, 6), d = c + r.int(4, 12), oc = r.int(0, 1), od = r.int(0, 1), lo = a - b, hi = a + b, cnt = 0, x;
    function inB(v) { return (oc ? v > c : v >= c) && (od ? v < d : v <= d); }
    for (x = -60; x <= 60; x++) if (x >= lo && x <= hi && inB(x)) cnt++;
    var loI = Math.max(lo, c + (oc ? 1 : 0)), hiI = Math.min(hi, d - (od ? 1 : 0)), ver = hiI >= loI ? `(${hiI})-(${loI})+1` : '0';
    var xa = a === 0 ? 'x' : (a > 0 ? 'x - ' + a : 'x + ' + (-a));
    var B = (oc ? ']' : '[') + K.T(c) + ';\\ ' + K.T(d) + (od ? '[' : ']');
    return {
      q: R`Legyen $A = \{x \in \mathbb{R} \mid |${xa}| \le ${b}\}$ és $B = ${B}$. Hány egész szám van az $A \cap B$ halmazban?`,
      answer: { type: 'num', value: cnt }, ansTex: K.T(cnt),
      verify: ver,
      tip1: R`Írd fel az $A$ halmazt intervallumként, majd keresd meg a két intervallum közös részét.`,
      tip2: R`$|x - a| \le b \iff a - b \le x \le a + b$, így $A = [${K.T(lo)};\ ${K.T(hi)}]$.`,
      sol: [R`$A = [${K.T(lo)};\ ${K.T(hi)}]$, $B = ${B}$.`, hiI >= loI ? R`A metszet egész elemei $${K.T(loI)}$ és $${K.T(hiI)}$ között vannak (a határokat is beleértve): $${hiI} - (${loI}) + 1 = ${cnt}$ darab.` : R`A két halmaznak nincs közös egész eleme: a válasz $0$.`]
    };
  });
})(typeof window !== 'undefined' ? window : globalThis);
