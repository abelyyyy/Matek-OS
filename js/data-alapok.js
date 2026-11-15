/* MATEK OS – Alapok témakör tananyaga. A „checks” párokat a tesztek a CAS-motorral
   újraszámolják: a két oldalnak egyenlőnek kell lennie. */
(function (root) {
  'use strict';
  var MO = root.MO = root.MO || {};
  var R = String.raw;
  var D = MO.content = MO.content || {};

  D.tortek = {
    intro: 'A törtekkel való biztos számolás minden későbbi témakör alapja: egyenletrendezésnél, valószínűségnél, deriválásnál és integrálásnál is folyamatosan törtekkel dolgozol. A követelmény 2.1 (alapműveletek) és 2.3 (racionális számok) pontjához tartozik.',
    theory: [
      { h: 'Mi a tört?', b: R`A $\dfrac{a}{b}$ tört ($b \ne 0$) azt jelenti: az egészet $b$ egyenlő részre osztjuk, és ebből $a$ részt veszünk. Az $a$ a **számláló**, a $b$ a **nevező**. Minden tört egy osztás is: $\dfrac{a}{b} = a : b$. A nevező soha nem lehet nulla.` },
      { h: 'Bővítés és egyszerűsítés', b: R`A tört értéke nem változik, ha a számlálót és a nevezőt ugyanazzal a nullától különböző számmal szorozzuk (bővítés) vagy osztjuk (egyszerűsítés): $\dfrac{a}{b} = \dfrac{a \cdot k}{b \cdot k}$. Egy tört akkor a legegyszerűbb alakú, ha a számláló és a nevező legnagyobb közös osztója $1$.` },
      { h: 'Összeadás, kivonás', b: R`Csak azonos nevezőjű törteket lehet közvetlenül összeadni: $\dfrac{a}{c} \pm \dfrac{b}{c} = \dfrac{a \pm b}{c}$. Különböző nevezőknél előbb közös nevezőre hozunk; a legkisebb közös nevező a nevezők legkisebb közös többszöröse.` },
      { h: 'Szorzás, osztás', b: R`Szorzás: számlálót a számlálóval, nevezőt a nevezővel: $\dfrac{a}{b} \cdot \dfrac{c}{d} = \dfrac{ac}{bd}$. Osztás: a reciprokkal szorzunk: $\dfrac{a}{b} : \dfrac{c}{d} = \dfrac{a}{b} \cdot \dfrac{d}{c}$ ($c \ne 0$). Szorzás előtt érdemes „keresztben” egyszerűsíteni.` },
      { h: 'Emeletes tört', b: R`A főtörtvonal osztás. Számold ki külön a számlálót és a nevezőt, majd oszd el őket: $\dfrac{\;\frac{a}{b}\;}{\frac{c}{d}} = \dfrac{a}{b} \cdot \dfrac{d}{c}$.` }
    ],
    examples: [
      { t: 'Közös nevezőre hozás', p: R`Számítsd ki: $\dfrac{5}{6} - \dfrac{3}{8} + \dfrac{1}{4}$`,
        steps: [R`A nevezők legkisebb közös többszöröse: $[6; 8; 4] = 24$.`, R`Bővítünk: $\dfrac{5}{6} = \dfrac{20}{24}$, $\dfrac{3}{8} = \dfrac{9}{24}$, $\dfrac{1}{4} = \dfrac{6}{24}$.`, R`$\dfrac{20 - 9 + 6}{24} = \dfrac{17}{24}$`, R`Ellenőrzés: a $17$ prímszám, a $24$-nek nem osztója, tehát a tört nem egyszerűsíthető.`],
        ans: R`$\dfrac{17}{24}$`, checks: [['5/6-3/8+1/4', '17/24'], ['5/6', '20/24'], ['3/8', '9/24']] },
      { t: 'Műveleti sorrend törtekkel', p: R`Számítsd ki: $\left(\dfrac{2}{3} - \dfrac{1}{2}\right) : \dfrac{5}{12} + \dfrac{3}{5}$`,
        steps: [R`Zárójel: $\dfrac{2}{3} - \dfrac{1}{2} = \dfrac{4}{6} - \dfrac{3}{6} = \dfrac{1}{6}$.`, R`Osztás: $\dfrac{1}{6} : \dfrac{5}{12} = \dfrac{1}{6} \cdot \dfrac{12}{5} = \dfrac{12}{30} = \dfrac{2}{5}$.`, R`Összeadás: $\dfrac{2}{5} + \dfrac{3}{5} = 1$.`],
        ans: R`$1$`, checks: [['(2/3-1/2)/(5/12)+3/5', '1'], ['2/3-1/2', '1/6'], ['(1/6)/(5/12)', '2/5']] }
    ],
    widget: 'fracbar',
    mistakes: [R`A számlálókat és a nevezőket külön összeadni hiba: $\dfrac{1}{2} + \dfrac{1}{3} \ne \dfrac{2}{5}$; helyesen $\dfrac{5}{6}$.`, R`Összegből nem lehet egyszerűsíteni: $\dfrac{a + b}{a} \ne b$. Egyszerűsíteni csak szorzatból szabad.`, 'Osztásnál a második törtet kell megfordítani, nem az elsőt.', 'A negatív előjel a tört egészére vonatkozik: kivonásnál a számláló minden tagjának előjele megfordul.'],
    exam: 'A követelmény 2.1 pontja a biztos alapműveleteket zsebszámológéppel is elvárja. A javítási-értékelési útmutató (2026. május) szerint számolási hiba esetén csak arra a részre nem jár pont, ahol a hiba történt: ha a hibás részeredménnyel helyes gondolatmenettel számolsz tovább, a további részpontok járnak. Egy elrontott tört tehát nem viszi el az egész feladatot, de pontot veszítesz vele.',
    cheat: [R`\dfrac{a}{b} \pm \dfrac{c}{d} = \dfrac{ad \pm bc}{bd}`, R`\dfrac{a}{b} \cdot \dfrac{c}{d} = \dfrac{ac}{bd}`, R`\dfrac{a}{b} : \dfrac{c}{d} = \dfrac{ad}{bc}`, R`\dfrac{a}{b} = \dfrac{ak}{bk} \quad (k \ne 0)`],
    cheatChecks: [['a/b+c/d', '(a*d+b*c)/(b*d)'], ['(a/b)/(c/d)', '(a*d)/(b*c)'], ['a/b', '(a*k)/(b*k)']],
    terms: ['számláló', 'nevező', 'közös nevező', 'reciprok', 'egyszerűsítés', 'bővítés', 'emeletes tört']
  };

  D.szazalek = {
    intro: 'A százalékszámítás a követelmény 2.7.1 pontja. A szöveges, modellalkotó feladatok egyik leggyakoribb eszköze: árváltozás, kamat, népességváltozás, keverési feladatok.',
    theory: [
      { h: 'Alap, százalékláb, százalékérték', b: R`$1\% = \dfrac{1}{100}$. Ha az **alap** $a$, a **százalékláb** $p$, akkor a **százalékérték**: $e = a \cdot \dfrac{p}{100}$. Ebből bármelyik kifejezhető: $a = \dfrac{100e}{p}$, $p = \dfrac{100e}{a}$.` },
      { h: 'Szorzótényező', b: R`$p\%$-os növelés után az új érték $a \cdot \left(1 + \dfrac{p}{100}\right)$, $p\%$-os csökkentés után $a \cdot \left(1 - \dfrac{p}{100}\right)$. Például $20\%$-os emelés szorzója $1{,}2$, $15\%$-os csökkentésé $0{,}85$.` },
      { h: 'Egymás utáni változások', b: R`Több változásnál a szorzótényezőket **összeszorozzuk**, a százaléklábakat nem adjuk össze. $+20\%$ majd $-20\%$: $1{,}2 \cdot 0{,}8 = 0{,}96$, ez $4\%$-os csökkenés.` },
      { h: 'Százalék és százalékpont', b: R`Ha egy arány $40\%$-ról $50\%$-ra nő, az $10$ **százalékpont** növekedés, de $25\%$-os növekedés, mert $\dfrac{50}{40} = 1{,}25$.` }
    ],
    examples: [
      { t: 'Áremelés, majd leárazás', p: 'Egy 24 000 Ft-os cipő árát 25%-kal megemelték, majd az új árból 20% kedvezményt adtak. Mennyi lett a végső ár, és hány százaléka ez az eredetinek?',
        steps: [R`Emelés után: $24\,000 \cdot 1{,}25 = 30\,000$ Ft.`, R`Kedvezmény után: $30\,000 \cdot 0{,}8 = 24\,000$ Ft.`, R`A két szorzó szorzata $1{,}25 \cdot 0{,}8 = 1$, ezért az ár pontosan az eredeti.`],
        ans: 'A végső ár 24 000 Ft, az eredeti ár 100%-a.', checks: [['24000*1,25', '30000'], ['30000*0,8', '24000'], ['1,25*0,8', '1']] },
      { t: 'Az alap visszakeresése', p: 'Egy városban a lakosok száma egy év alatt 4%-kal nőtt, így 52 000 fő lett. Mennyi volt egy évvel korábban?',
        steps: [R`Ha a korábbi létszám $x$, akkor $1{,}04 \cdot x = 52\,000$.`, R`$x = 52\,000 : 1{,}04 = 50\,000$`, R`Ellenőrzés: $50\,000 \cdot 0{,}04 = 2000$, és $50\,000 + 2000 = 52\,000$.`],
        ans: 'Egy évvel korábban 50 000 lakos volt.', checks: [['52000/1,04', '50000'], ['50000*0,04', '2000']] }
    ],
    widget: 'percent',
    mistakes: ['Az alap visszakeresésénél nem a végösszegből kell levonni a százalékot: 52 000 − 4% nem 50 000.', 'Egymás utáni változásoknál a százaléklábak nem adhatók össze.', 'Mindig tisztázd, minek a százalékáról van szó: a „mihez képest” adja az alapot.', 'A százalék és a százalékpont nem ugyanaz.'],
    exam: 'A vizsgaleírás szerint a feladatok 30–40%-a szöveges, modellalkotást igénylő feladat; ezekben a százalékszámítás a sorozatokhoz (kamatos kamat), a statisztikához és a valószínűséghez is kapcsolódik.',
    cheat: [R`e = a \cdot \dfrac{p}{100}`, R`a_{\text{új}} = a \left(1 \pm \dfrac{p}{100}\right)`, R`\text{szorzók szorzata: } q = q_1 \cdot q_2 \cdots q_n`],
    cheatChecks: [['a*(1+p/100)', 'a+a*p/100']],
    terms: ['alap', 'százalékláb', 'százalékérték', 'szorzótényező', 'százalékpont', 'kedvezmény', 'áremelés']
  };

  D.hatvany = {
    intro: 'A hatványozás azonosságai a követelmény 2.5 pontjában, a normálalak a 2.4 pontjában szerepel. Ezekre épül a gyökvonás, a logaritmus, az exponenciális egyenletek és a mértani sorozat.',
    theory: [
      { h: 'Egész kitevő', b: R`Pozitív egész $n$ esetén $a^n = \underbrace{a \cdot a \cdots a}_{n \text{ db}}$. Megállapodás szerint $a^0 = 1$ ($a \ne 0$) és $a^{-n} = \dfrac{1}{a^n}$ ($a \ne 0$). A $0^0$ nincs értelmezve.` },
      { h: 'Azonosságok', b: R`Azonos alap: $a^m \cdot a^n = a^{m+n}$, $\dfrac{a^m}{a^n} = a^{m-n}$, $\left(a^m\right)^n = a^{mn}$. Azonos kitevő: $(ab)^n = a^n b^n$, $\left(\dfrac{a}{b}\right)^n = \dfrac{a^n}{b^n}$. Összegre nincs ilyen szabály: $(a + b)^n \ne a^n + b^n$.` },
      { h: 'Törtkitevő', b: R`Pozitív $a$ esetén $a^{\frac{m}{n}} = \sqrt[n]{a^m}$. Például $8^{\frac{2}{3}} = \sqrt[3]{8^2} = 4$. Az azonosságok racionális kitevőre is érvényesek, ha az alap pozitív.` },
      { h: 'Normálalak', b: R`Minden pozitív szám felírható $a \cdot 10^k$ alakban, ahol $1 \le a < 10$ és $k$ egész. Például $0{,}00045 = 4{,}5 \cdot 10^{-4}$, $3\,200\,000 = 3{,}2 \cdot 10^{6}$. Szorzásnál a számokat összeszorozzuk, a kitevőket összeadjuk.` }
    ],
    examples: [
      { t: 'Azonosságok alkalmazása', p: R`Számítsd ki: $\dfrac{6^4 \cdot 3^{-2}}{2^3 \cdot 9}$`,
        steps: [R`Prímtényezőkre bontunk: $6^4 = 2^4 \cdot 3^4$ és $9 = 3^2$.`, R`$\dfrac{2^4 \cdot 3^4 \cdot 3^{-2}}{2^3 \cdot 3^2} = 2^{4-3} \cdot 3^{4-2-2} = 2^1 \cdot 3^0 = 2$`, R`Ellenőrzés számolással: $\dfrac{1296 \cdot \frac{1}{9}}{8 \cdot 9} = \dfrac{144}{72} = 2$.`],
        ans: R`$2$`, checks: [['6^4*3^(-2)/(2^3*9)', '2'], ['6^4', '1296'], ['1296/9', '144']] },
      { t: 'Számolás normálalakkal', p: R`Számítsd ki normálalakban: $\dfrac{4{,}8 \cdot 10^{7}}{1{,}6 \cdot 10^{-3}}$`,
        steps: [R`Számok: $4{,}8 : 1{,}6 = 3$.`, R`Tíz hatványai: $10^{7 - (-3)} = 10^{10}$.`, R`Az eredmény $3 \cdot 10^{10}$; a $3$ az $[1; 10[$ intervallumba esik, tehát ez normálalak.`],
        ans: R`$3 \cdot 10^{10}$`, checks: [['4,8*10^7/(1,6*10^(-3))', '3*10^10'], ['4,8/1,6', '3']] }
    ],
    widget: 'powplot',
    mistakes: [R`$-3^2 = -9$, de $(-3)^2 = 9$: a hatványozás erősebb a negatív előjelnél.`, R`$(a + b)^2 \ne a^2 + b^2$.`, R`A negatív kitevő nem negatív számot ad: $2^{-3} = \dfrac{1}{8}$.`, R`$a^m \cdot a^n$ kitevői összeadódnak, nem szorzódnak; szorzódni az $\left(a^m\right)^n$ esetben szorzódnak.`],
    exam: 'A követelmény emelt szinten az azonosságok bizonyítását is elvárja egész kitevőre. Feladatokban főleg exponenciális és logaritmusos egyenletek, valamint a mértani sorozat és a kamatos kamat számolásában kell.',
    cheat: [R`a^m a^n = a^{m+n}`, R`\dfrac{a^m}{a^n} = a^{m-n}`, R`\left(a^m\right)^n = a^{mn}`, R`(ab)^n = a^n b^n`, R`a^{-n} = \dfrac{1}{a^n}, \quad a^0 = 1`, R`a^{\frac{m}{n}} = \sqrt[n]{a^m} \quad (a > 0)`],
    cheatChecks: [['a^3*a^4', 'a^7'], ['a^5/a^2', 'a^3'], ['(a^3)^4', 'a^12'], ['(a*b)^3', 'a^3*b^3'], ['a^(-2)', '1/a^2'], ['8^(2/3)', '4']],
    terms: ['hatvány', 'alap', 'kitevő', 'negatív kitevő', 'törtkitevő', 'normálalak']
  };

  D.betus = {
    intro: 'Az algebrai kifejezések átalakítása a követelmény 2.6 pontja. Egyenletmegoldásnál, függvényvizsgálatnál és bizonyításoknál is erre támaszkodsz.',
    theory: [
      { h: 'Összevonás, zárójelfelbontás', b: R`Csak **egynemű** tagokat lehet összevonni (ugyanaz a betűs rész): $3x^2 + 5x - x^2 = 2x^2 + 5x$. Zárójel előtti mínusz minden tag előjelét megfordítja: $a - (b - c) = a - b + c$. Szorzásnál minden tagot minden taggal szorzunk: $(a + b)(c + d) = ac + ad + bc + bd$.` },
      { h: 'Nevezetes azonosságok', b: R`$(a + b)^2 = a^2 + 2ab + b^2$, $(a - b)^2 = a^2 - 2ab + b^2$, $a^2 - b^2 = (a + b)(a - b)$. Emelt szinten: $a^3 \pm b^3 = (a \pm b)(a^2 \mp ab + b^2)$, és általában $a^n - b^n = (a - b)\left(a^{n-1} + a^{n-2}b + \dots + b^{n-1}\right)$.` },
      { h: 'Szorzattá alakítás', b: R`Módszerek: **kiemelés** ($6x^2 - 9x = 3x(2x - 3)$), **nevezetes azonosság** ($x^2 - 25 = (x+5)(x-5)$), **csoportosítás**, és másodfokú kifejezésnél a gyöktényezős alak: $x^2 + px + q = (x - x_1)(x - x_2)$.` },
      { h: 'Algebrai törtek', b: R`Egyszerűsíteni csak szorzattá alakítás után lehet, és mindig meg kell adni a kikötést: a nevező nem lehet nulla. $\dfrac{x^2 - 9}{x - 3} = x + 3$, ha $x \ne 3$.` }
    ],
    examples: [
      { t: 'Felbontás és összevonás', p: R`Hozd egyszerűbb alakra: $(2x - 3)^2 - (x + 4)(x - 4)$`,
        steps: [R`$(2x - 3)^2 = 4x^2 - 12x + 9$`, R`$(x + 4)(x - 4) = x^2 - 16$`, R`$4x^2 - 12x + 9 - \left(x^2 - 16\right) = 3x^2 - 12x + 25$`, R`Ellenőrzés $x = 1$ helyen: az eredeti $(-1)^2 - 5 \cdot (-3) = 16$, az eredmény $3 - 12 + 25 = 16$.`],
        ans: R`$3x^2 - 12x + 25$`, checks: [['(2x-3)^2-(x+4)(x-4)', '3x^2-12x+25'], ['(2x-3)^2', '4x^2-12x+9'], ['(x+4)(x-4)', 'x^2-16'], ['3-12+25', '16']] },
      { t: 'Algebrai tört egyszerűsítése', p: R`Egyszerűsítsd: $\dfrac{x^2 - 6x + 9}{x^2 - 9}$`,
        steps: [R`Kikötés: $x^2 - 9 \ne 0$, azaz $x \ne 3$ és $x \ne -3$.`, R`Számláló: $x^2 - 6x + 9 = (x - 3)^2$. Nevező: $x^2 - 9 = (x - 3)(x + 3)$.`, R`$\dfrac{(x - 3)^2}{(x - 3)(x + 3)} = \dfrac{x - 3}{x + 3}$`],
        ans: R`$\dfrac{x - 3}{x + 3}$, ha $x \ne \pm 3$`, checks: [['(x^2-6x+9)/(x^2-9)', '(x-3)/(x+3)'], ['x^2-6x+9', '(x-3)^2'], ['x^2-9', '(x-3)(x+3)']] }
    ],
    widget: 'expand',
    mistakes: [R`$(a - b)^2$ középső tagja $-2ab$, az utolsó tag pedig $+b^2$.`, R`Összegből nem lehet egyszerűsíteni: $\dfrac{x^2 + 3}{x} \ne x + 3$.`, 'Az algebrai tört egyszerűsítése előtt a kikötést az eredeti nevezőre kell felírni.', R`$a^2 + b^2$ a valós számok körében nem alakítható szorzattá.`],
    exam: 'A követelmény középszinten a kéttagú négyzetét és a négyzetek különbségét, emelt szinten az $a^n - b^n$ és az $a^{2n+1} + b^{2n+1}$ szorzattá alakítását is kéri. Az utóbbiak az OH szóbeli képlettárában is szerepelnek.',
    cheat: [R`(a \pm b)^2 = a^2 \pm 2ab + b^2`, R`a^2 - b^2 = (a + b)(a - b)`, R`a^3 \pm b^3 = (a \pm b)\left(a^2 \mp ab + b^2\right)`, R`(a + b)^3 = a^3 + 3a^2b + 3ab^2 + b^3`],
    cheatChecks: [['(a+b)^2', 'a^2+2a*b+b^2'], ['(a-b)^2', 'a^2-2a*b+b^2'], ['a^2-b^2', '(a+b)(a-b)'], ['a^3-b^3', '(a-b)(a^2+a*b+b^2)'], ['a^3+b^3', '(a+b)(a^2-a*b+b^2)'], ['(a+b)^3', 'a^3+3a^2*b+3a*b^2+b^3'], ['a^5-b^5', '(a-b)(a^4+a^3*b+a^2*b^2+a*b^3+b^4)'], ['a^5+b^5', '(a+b)(a^4-a^3*b+a^2*b^2-a*b^3+b^4)']],
    terms: ['egynemű tagok', 'összevonás', 'kiemelés', 'nevezetes azonosság', 'szorzattá alakítás', 'algebrai tört', 'kikötés']
  };

  D.mertek = {
    intro: 'A mértékegységek átváltása nem külön követelménypont, de a geometriai (kerület, terület, felszín, térfogat) és a szöveges feladatokban végig szükség van rá. A válaszhoz mindig tartozik mértékegység.',
    theory: [
      { h: 'Előtagok', b: R`kilo (k) $= 10^3$, deci (d) $= 10^{-1}$, centi (c) $= 10^{-2}$, milli (m) $= 10^{-3}$. Hossz: $1\ \text{km} = 1000\ \text{m}$, $1\ \text{m} = 10\ \text{dm} = 100\ \text{cm} = 1000\ \text{mm}$.` },
      { h: 'Terület és térfogat', b: R`Területnél a hossz váltószámának **négyzetével**, térfogatnál a **köbével** számolunk: $1\ \text{m}^2 = 100\ \text{dm}^2 = 10^4\ \text{cm}^2$, $1\ \text{m}^3 = 1000\ \text{dm}^3 = 10^6\ \text{cm}^3$. Továbbá $1\ \text{ha} = 10^4\ \text{m}^2$, $1\ \text{km}^2 = 100\ \text{ha}$.` },
      { h: 'Űrtartalom, tömeg, idő', b: R`$1\ \text{liter} = 1\ \text{dm}^3$, $1\ \text{ml} = 1\ \text{cm}^3$, $1\ \text{hl} = 100\ \text{l}$. $1\ \text{t} = 1000\ \text{kg}$, $1\ \text{kg} = 100\ \text{dkg} = 1000\ \text{g}$. $1\ \text{h} = 60\ \text{min} = 3600\ \text{s}$.` },
      { h: 'Összetett mértékegységek', b: R`A számlálót és a nevezőt külön váltjuk át. $1\ \dfrac{\text{m}}{\text{s}} = 3{,}6\ \dfrac{\text{km}}{\text{h}}$, $1\ \dfrac{\text{g}}{\text{cm}^3} = 1000\ \dfrac{\text{kg}}{\text{m}^3}$.` }
    ],
    examples: [
      { t: 'Térfogat és űrtartalom', p: 'Egy téglatest alakú akvárium belső méretei: 80 cm, 35 cm és 40 cm. Hány liter víz fér bele?',
        steps: [R`$V = 80 \cdot 35 \cdot 40 = 112\,000\ \text{cm}^3$`, R`$1\ \text{dm}^3 = 1000\ \text{cm}^3$, ezért $112\,000\ \text{cm}^3 = 112\ \text{dm}^3$.`, R`$1\ \text{dm}^3 = 1$ liter.`],
        ans: 'Az akváriumba 112 liter víz fér.', checks: [['80*35*40', '112000'], ['112000/1000', '112']] },
      { t: 'Sebesség, idő, út', p: R`Egy vonat $108\ \dfrac{\text{km}}{\text{h}}$ sebességgel halad. Mennyi idő alatt halad át egy $240$ m hosszú hídon egy $180$ m hosszú szerelvény?`,
        steps: [R`$108\ \dfrac{\text{km}}{\text{h}} = 108 : 3{,}6 = 30\ \dfrac{\text{m}}{\text{s}}$`, R`A vonat elejének a híd elejétől a híd vége utánig, a szerelvény hosszával tovább kell haladnia: $240 + 180 = 420$ m.`, R`$t = \dfrac{s}{v} = \dfrac{420}{30} = 14\ \text{s}$`],
        ans: 'A szerelvény 14 másodperc alatt halad át a hídon.', checks: [['108/3,6', '30'], ['(240+180)/30', '14']] }
    ],
    widget: 'unit',
    mistakes: [R`$1\ \text{m}^2$ nem $100\ \text{cm}^2$, hanem $10\,000\ \text{cm}^2$.`, 'Képletbe csak egyeztetett mértékegységekkel szabad behelyettesíteni.', 'A percben megadott időt óra tizedes törtjeként átírni: 1 óra 30 perc = 1,5 h, nem 1,3 h.', 'A válaszból gyakran lemarad a mértékegység.'],
    exam: 'A javítási-értékelési útmutató (2026. május) tartalmi kérései szerint a mértékegység hiánya akkor jár pontlevonással, ha a hiányzó mértékegység a válaszban vagy mértékegység-átváltásban szerepel. A válaszodba és az átváltásokba ezért mindig írd ki.',
    cheat: [R`1\ \text{m}^2 = 10^4\ \text{cm}^2, \quad 1\ \text{m}^3 = 10^6\ \text{cm}^3`, R`1\ \text{l} = 1\ \text{dm}^3 = 1000\ \text{cm}^3`, R`1\ \dfrac{\text{m}}{\text{s}} = 3{,}6\ \dfrac{\text{km}}{\text{h}}`, R`1\ \text{ha} = 10^4\ \text{m}^2`],
    cheatChecks: [['100^2', '10^4'], ['100^3', '10^6'], ['3600/1000', '3,6']],
    terms: ['előtag', 'váltószám', 'liter', 'hektár', 'km/h', 'm/s', 'sűrűség']
  };

  D.aranyossag = {
    intro: 'Az egyenes és a fordított arányosság a követelmény 2.7 pontja: definíciójukat és grafikus ábrázolásukat is tudni kell. A hasonlóság, a trigonometria és a szöveges feladatok alapja.',
    theory: [
      { h: 'Arány', b: R`Két mennyiség aránya a hányadosuk: $a : b = \dfrac{a}{b}$. Az arány bővíthető és egyszerűsíthető: $12 : 18 = 2 : 3$. Arányos osztásnál az egészet az arányszámok összegének megfelelő számú egyenlő részre bontjuk.` },
      { h: 'Egyenes arányosság', b: R`Két változó mennyiség egyenesen arányos, ha összetartozó értékeik hányadosa állandó: $\dfrac{y}{x} = k$, azaz $y = kx$ ($k \ne 0$). Ahányszorosára nő az egyik, ugyanannyiszorosára nő a másik. A grafikon origón átmenő egyenes.` },
      { h: 'Fordított arányosság', b: R`Két változó mennyiség fordítottan arányos, ha összetartozó értékeik szorzata állandó: $x \cdot y = k$, azaz $y = \dfrac{k}{x}$ ($k \ne 0$). Ahányszorosára nő az egyik, annyiad részére csökken a másik. A grafikon hiperbola.` },
      { h: 'Melyik melyik?', b: 'Tedd fel a kérdést: ha az egyik mennyiség a kétszeresére nő, mi történik a másikkal? Ha az is a kétszeresére nő, egyenes; ha a felére csökken, fordított arányosság. Ha egyik sem, akkor a kapcsolat nem arányosság.' }
    ],
    examples: [
      { t: 'Fordított arányosság', p: 'Egy medencét 6 egyforma csap 10 óra alatt tölt meg. Mennyi idő alatt telne meg, ha 4 óra után 2 csap elromlik?',
        steps: [R`A teljes munka $6 \cdot 10 = 60$ csapóra.`, R`Az első 4 órában $6 \cdot 4 = 24$ csapóra készül el, hátravan $60 - 24 = 36$ csapóra.`, R`Ezt $4$ csap végzi: $36 : 4 = 9$ óra.`, R`Összesen $4 + 9 = 13$ óra.`],
        ans: 'A medence összesen 13 óra alatt telik meg.', checks: [['6*10', '60'], ['60-6*4', '36'], ['36/4', '9'], ['4+9', '13']] },
      { t: 'Arányos osztás', p: 'Három társ 5 : 3 : 2 arányban adta össze egy vállalkozás tőkéjét. A 4 200 000 Ft nyereséget ugyanilyen arányban osztják el. Mennyit kap a legkisebb részesedésű társ?',
        steps: [R`Az arányszámok összege $5 + 3 + 2 = 10$.`, R`Egy rész: $4\,200\,000 : 10 = 420\,000$ Ft.`, R`A legkisebb részesedés $2$ rész: $2 \cdot 420\,000 = 840\,000$ Ft.`, R`Ellenőrzés: $2\,100\,000 + 1\,260\,000 + 840\,000 = 4\,200\,000$.`],
        ans: 'A legkisebb részesedésű társ 840 000 Ft-ot kap.', checks: [['4200000/10', '420000'], ['2*420000', '840000'], ['5*420000+3*420000+2*420000', '4200000']] }
    ],
    widget: 'prop',
    mistakes: ['Nem minden „együtt növekvő” kapcsolat egyenes arányosság: a négyzet oldala és területe nem az.', 'Fordított arányosságnál a szorzat állandó, nem a hányados.', 'Arányos osztásnál az arányszámok összegével kell osztani, nem a tagok számával.', R`Az $y = kx + b$ ($b \ne 0$) lineáris függvény nem egyenes arányosság.`],
    exam: 'A követelmény a definíciót és a grafikus ábrázolást is kéri. Feladatokban a hasonlóságnál (hasonló síkidomok területének, hasonló testek térfogatának aránya) és a mozgásos, munkavégzéses szöveges feladatoknál jelenik meg.',
    cheat: [R`\text{egyenes: } \dfrac{y}{x} = k, \quad y = kx`, R`\text{fordított: } x \cdot y = k, \quad y = \dfrac{k}{x}`, R`a : b = c : d \iff ad = bc`],
    cheatChecks: [],
    terms: ['arány', 'egyenes arányosság', 'fordított arányosság', 'arányos osztás', 'aránypár', 'hiperbola']
  };

  D.abra = {
    intro: 'A statisztikai adatok ábrázolása a követelmény 5.1.1 pontja: kördiagramot, oszlopdiagramot és sodrófa (box-plot) diagramot készíteni és értelmezni is tudni kell. Sok feladat egy ábráról vagy táblázatból leolvasott adattal indul.',
    theory: [
      { h: 'Oszlopdiagram', b: 'Az oszlopok magassága arányos az ábrázolt értékkel. Leolvasás előtt mindig nézd meg a függőleges tengely beosztását és azt, hogy nulláról indul-e: a csonkított tengely torzítja az arányokat.' },
      { h: 'Kördiagram', b: R`A teljes kör a $100\%$, azaz $360^\circ$. Egy $p\%$-os részhez $3{,}6^\circ \cdot p$ középponti szög tartozik; fordítva, $\alpha$ középponti szög $\dfrac{\alpha}{360^\circ}$ részt jelent.` },
      { h: 'Sodrófa (box-plot) diagram', b: 'Öt adatot mutat: a legkisebb értéket, az alsó kvartilist, a mediánt, a felső kvartilist és a legnagyobb értéket. A „doboz” az adatok középső felét fogja közre.' },
      { h: 'Gyakoriság, relatív gyakoriság', b: R`A **gyakoriság** megmutatja, hányszor fordul elő egy érték. A **relatív gyakoriság** a gyakoriság és az összes adat számának hányadosa; a relatív gyakoriságok összege $1$.` }
    ],
    examples: [
      { t: 'Kördiagram szögei', p: 'Egy 30 fős osztályban 12-en járnak busszal, 9-en gyalog, 6-an kerékpárral, 3-an autóval iskolába. Mekkora középponti szög tartozik a kördiagramon az egyes csoportokhoz?',
        steps: [R`Egy tanulóhoz $360^\circ : 30 = 12^\circ$ tartozik.`, R`Busz: $12 \cdot 12^\circ = 144^\circ$, gyalog: $9 \cdot 12^\circ = 108^\circ$, kerékpár: $6 \cdot 12^\circ = 72^\circ$, autó: $3 \cdot 12^\circ = 36^\circ$.`, R`Ellenőrzés: $144^\circ + 108^\circ + 72^\circ + 36^\circ = 360^\circ$.`],
        ans: R`$144^\circ$, $108^\circ$, $72^\circ$ és $36^\circ$.`, checks: [['360/30', '12'], ['12*12', '144'], ['9*12', '108'], ['6*12', '72'], ['3*12', '36'], ['144+108+72+36', '360']] },
      { t: 'Átlag gyakorisági táblázatból', p: 'Egy dolgozat jegyei: 2 darab egyes, 3 darab kettes, 8 darab hármas, 7 darab négyes és 5 darab ötös. Mennyi az osztályátlag?',
        steps: [R`A dolgozatok száma: $2 + 3 + 8 + 7 + 5 = 25$.`, R`A jegyek összege: $2 \cdot 1 + 3 \cdot 2 + 8 \cdot 3 + 7 \cdot 4 + 5 \cdot 5 = 85$.`, R`Átlag: $85 : 25 = 3{,}4$.`],
        ans: 'Az osztályátlag 3,4.', checks: [['2+3+8+7+5', '25'], ['2*1+3*2+8*3+7*4+5*5', '85'], ['85/25', '3,4']] }
    ],
    widget: 'barchart',
    mistakes: ['A tengely beosztásának félreolvasása: nem minden osztás jelent egy egységet.', 'Gyakorisági táblázatnál az átlaghoz az értékeket a gyakoriságukkal kell súlyozni.', 'A kördiagramról arány olvasható le, darabszám csak akkor, ha az összes adat száma ismert.', 'Csonkított függőleges tengelynél az oszlopok magasságának aránya nem egyezik az értékek arányával.'],
    exam: 'A követelmény szerint tudni kell megfelelő diagramtípust választani és a választás mellett érvelni; emelt szinten adathalmazokat diagramok alapján összehasonlítani is.',
    cheat: [R`\text{középponti szög} = 360^\circ \cdot \dfrac{\text{gyakoriság}}{\text{összes adat}}`, R`\text{relatív gyakoriság} = \dfrac{\text{gyakoriság}}{\text{összes adat}}`, R`\overline{x} = \dfrac{f_1 x_1 + f_2 x_2 + \dots + f_k x_k}{f_1 + f_2 + \dots + f_k}`],
    cheatChecks: [],
    terms: ['oszlopdiagram', 'kördiagram', 'sodrófa', 'box-plot', 'gyakoriság', 'relatív gyakoriság', 'átlag']
  };

  /* Képletkártyák az Alapok témakörhöz */
  MO.formulas = [
    { id: 'tort-osszeg', sub: 'tortek', name: 'Törtek összege, különbsége', tex: R`\dfrac{a}{b} \pm \dfrac{c}{d} = \dfrac{ad \pm bc}{bd}`, vars: 'a, c: számlálók; b, d: nevezők', when: 'Különböző nevezőjű törtek összeadásakor, kivonásakor.', cond: R`$b \ne 0$, $d \ne 0$`, ex: R`$\dfrac{2}{3} + \dfrac{1}{4} = \dfrac{2 \cdot 4 + 3 \cdot 1}{3 \cdot 4} = \dfrac{11}{12}$`, check: [['2/3+1/4', '11/12']] },
    { id: 'tort-osztas', sub: 'tortek', name: 'Törtek osztása', tex: R`\dfrac{a}{b} : \dfrac{c}{d} = \dfrac{ad}{bc}`, vars: 'az osztó reciprokával szorzunk', when: 'Tört osztása törttel, emeletes törtek.', cond: R`$b \ne 0$, $c \ne 0$, $d \ne 0$`, ex: R`$\dfrac{3}{4} : \dfrac{9}{8} = \dfrac{3 \cdot 8}{4 \cdot 9} = \dfrac{2}{3}$`, check: [['(3/4)/(9/8)', '2/3']] },
    { id: 'szazalekertek', sub: 'szazalek', name: 'Százalékérték', tex: R`e = a \cdot \dfrac{p}{100}`, vars: 'a: alap; p: százalékláb; e: százalékérték', when: 'Egy mennyiség adott százalékának kiszámítása.', cond: '', ex: R`$350$-nek a $12\%$-a: $350 \cdot 0{,}12 = 42$`, check: [['350*12/100', '42']], calc: { inputs: [['a', 'alap', 350], ['p', 'százalékláb', 12]], expr: 'a*p/100', out: 'e', expect: 42 } },
    { id: 'szorzotenyezo', sub: 'szazalek', name: 'Százalékos változás szorzótényezője', tex: R`a_{\text{új}} = a \cdot \left(1 \pm \dfrac{p}{100}\right)`, vars: 'a: eredeti érték; p: a változás százalékban', when: 'Növelés, csökkentés; több változásnál a szorzók összeszorzódnak.', cond: '', ex: R`$8000$ Ft $15\%$-os emelés után: $8000 \cdot 1{,}15 = 9200$ Ft`, check: [['8000*1,15', '9200']], calc: { inputs: [['a', 'eredeti érték', 8000], ['p', 'változás (%), csökkenésnél negatív', 15]], expr: 'a*(1+p/100)', out: 'új érték', expect: 9200 } },
    { id: 'hatv-szorzas', sub: 'hatvany', name: 'Azonos alapú hatványok szorzása, osztása', tex: R`a^m \cdot a^n = a^{m+n}, \qquad \dfrac{a^m}{a^n} = a^{m-n}`, vars: 'a: alap; m, n: kitevők', when: 'Azonos alapú hatványok összevonása.', cond: R`osztásnál $a \ne 0$`, ex: R`$2^5 \cdot 2^{-2} = 2^3 = 8$`, check: [['2^5*2^(-2)', '8']] },
    { id: 'hatv-hatvany', sub: 'hatvany', name: 'Hatvány hatványa', tex: R`\left(a^m\right)^n = a^{mn}`, vars: 'a: alap; m, n: kitevők', when: 'Hatvány további hatványozása.', cond: '', ex: R`$\left(3^2\right)^3 = 3^6 = 729$`, check: [['(3^2)^3', '729']] },
    { id: 'neg-kitevo', sub: 'hatvany', name: 'Negatív és nulla kitevő', tex: R`a^{-n} = \dfrac{1}{a^n}, \qquad a^0 = 1`, vars: 'a: alap; n: pozitív egész', when: 'Negatív kitevőjű hatvány átírása.', cond: R`$a \ne 0$`, ex: R`$5^{-2} = \dfrac{1}{25} = 0{,}04$`, check: [['5^(-2)', '0,04']] },
    { id: 'normalalak', sub: 'hatvany', name: 'Normálalak', tex: R`x = a \cdot 10^k, \qquad 1 \le a < 10,\ k \in \mathbb{Z}`, vars: 'a: 1 és 10 közé eső szorzó; k: egész kitevő', when: 'Nagyon nagy vagy nagyon kicsi pozitív számok felírása.', cond: R`$x > 0$`, ex: R`$0{,}00072 = 7{,}2 \cdot 10^{-4}$`, check: [['7,2*10^(-4)', '0,00072']] },
    { id: 'negyzet-osszeg', sub: 'betus', name: 'Kéttagú négyzete', tex: R`(a \pm b)^2 = a^2 \pm 2ab + b^2`, vars: 'a, b: tetszőleges kifejezések', when: 'Zárójel felbontása, teljes négyzetté alakítás.', cond: '', ex: R`$(3x - 2)^2 = 9x^2 - 12x + 4$`, check: [['(3x-2)^2', '9x^2-12x+4']] },
    { id: 'negyzetek-kulonbsege', sub: 'betus', name: 'Négyzetek különbsége', tex: R`a^2 - b^2 = (a + b)(a - b)`, vars: 'a, b: tetszőleges kifejezések', when: 'Szorzattá alakítás, törtek egyszerűsítése, gyöktelenítés.', cond: '', ex: R`$4x^2 - 25 = (2x + 5)(2x - 5)$`, check: [['4x^2-25', '(2x+5)(2x-5)']] },
    { id: 'kobok', sub: 'betus', name: 'Köbök összege és különbsége', tex: R`a^3 \pm b^3 = (a \pm b)\left(a^2 \mp ab + b^2\right)`, vars: 'a, b: tetszőleges kifejezések', when: 'Harmadfokú kifejezések szorzattá alakítása (emelt szint).', cond: '', ex: R`$x^3 - 8 = (x - 2)\left(x^2 + 2x + 4\right)$`, check: [['x^3-8', '(x-2)(x^2+2x+4)']] },
    { id: 'sebesseg-valtas', sub: 'mertek', name: 'Sebesség átváltása', tex: R`1\ \dfrac{\text{m}}{\text{s}} = 3{,}6\ \dfrac{\text{km}}{\text{h}}`, vars: '', when: 'Mozgásos feladatokban a mértékegységek egyeztetése.', cond: '', ex: R`$72\ \dfrac{\text{km}}{\text{h}} = 72 : 3{,}6 = 20\ \dfrac{\text{m}}{\text{s}}$`, check: [['72/3,6', '20']], calc: { inputs: [['v', 'sebesség km/h-ban', 72]], expr: 'v/3,6', out: 'm/s', expect: 20 } },
    { id: 'egyenes-arany', sub: 'aranyossag', name: 'Egyenes arányosság', tex: R`\dfrac{y}{x} = k \quad\Longleftrightarrow\quad y = kx`, vars: 'x, y: összetartozó értékek; k: arányossági tényező', when: 'Ha az összetartozó értékek hányadosa állandó.', cond: R`$k \ne 0$`, ex: R`Ha $3$ kg $1350$ Ft, akkor $7$ kg: $\dfrac{1350}{3} \cdot 7 = 3150$ Ft`, check: [['1350/3*7', '3150']] },
    { id: 'forditott-arany', sub: 'aranyossag', name: 'Fordított arányosság', tex: R`x \cdot y = k \quad\Longleftrightarrow\quad y = \dfrac{k}{x}`, vars: 'x, y: összetartozó értékek; k: állandó szorzat', when: 'Ha az összetartozó értékek szorzata állandó.', cond: R`$k \ne 0$, $x \ne 0$`, ex: R`$8$ gép $15$ nap alatt, $12$ gép: $\dfrac{8 \cdot 15}{12} = 10$ nap alatt`, check: [['8*15/12', '10']] },
    { id: 'kozepponti-szog', sub: 'abra', name: 'Kördiagram középponti szöge', tex: R`\alpha = 360^\circ \cdot \dfrac{f}{n}`, vars: 'f: a csoport gyakorisága; n: az összes adat száma', when: 'Kördiagram készítése és leolvasása.', cond: '', ex: R`$40$ adatból $14$: $360^\circ \cdot \dfrac{14}{40} = 126^\circ$`, check: [['360*14/40', '126']], calc: { inputs: [['f', 'gyakoriság', 14], ['n', 'összes adat', 40]], expr: '360*f/n', out: 'fok', expect: 126 } }
  ];

  MO.formulas.forEach(function (f) { f.topic = 'alapok'; f.level = f.id === 'kobok' ? 'emelt' : 'közép'; });

  /* Szintfelmérő: alfejezetenként két kérdés (1. és 2. szint) */
  MO.placement = ['tort-1', 'tort-2', 'szaz-1', 'szaz-2', 'hatv-1', 'hatv-2', 'betu-1', 'betu-2', 'mert-1', 'mert-2', 'arany-1', 'arany-2', 'abra-1', 'abra-2'];

  if (typeof module !== 'undefined' && module.exports) module.exports = D;
})(typeof window !== 'undefined' ? window : globalThis);
