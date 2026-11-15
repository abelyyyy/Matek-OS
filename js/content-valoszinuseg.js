/* MATEK OS – 5. Valószínűség-számítás, statisztika: leíró statisztika, a valószínűség-számítás elemei (tananyag és feladatgenerátorok). */
(function (root) {
  'use strict';
  var MO = root.MO = root.MO || {};
  var K = MO.taskKit, R = K.R, def = K.def, Q = MO.Q;
  MO.content = MO.content || {};

  /* ---------- segédfüggvények ---------- */
  function sum(a) { var s = 0; for (var i = 0; i < a.length; i++) s += a[i]; return s; }
  function sorted(a) { return a.slice().sort(function (x, y) { return x - y; }); }
  function medianS(s) { var n = s.length; return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; }
  function medExpr(s) { var n = s.length; return n % 2 ? '(' + s[(n - 1) / 2] + '+' + s[(n - 1) / 2] + ')/2' : '(' + s[n / 2 - 1] + '+' + s[n / 2] + ')/2'; }
  function quart(a) { var s = sorted(a), n = s.length, h = Math.floor(n / 2); var lo = s.slice(0, h), hi = s.slice(n - h); return { s: s, lo: lo, hi: hi, q1: medianS(lo), q2: medianS(s), q3: medianS(hi) }; }
  function list(a) { return a.map(function (x) { return K.T(x); }).join(';\\ '); }
  function oa(n) { return (n === 1 || n === 5 || (n >= 50 && n < 60)) ? 'az' : 'a'; }
  function cs(x) { return String(Math.round(x * 100000) / 100000).replace('.', ','); }
  function C(n, k) { if (k < 0 || k > n) return 0; var v = 1; for (var i = 1; i <= k; i++) v = v * (n - k + i) / i; return Math.round(v); }
  function fixMean(a) { var n = a.length, rem = sum(a) % n; if (rem) a[n - 1] += n - rem; return a; }
  var N360 = [20, 24, 30, 36, 40, 45, 60, 72, 90, 120];

  /* ================= 5.1 LEÍRÓ STATISZTIKA ================= */
  MO.content['valoszinuseg/statisztika'] = {
    intro: R`A statisztika arról szól, hogyan lehet nagy adathalmazokból áttekinthető, összehasonlítható információt kinyerni: táblázatba rendezni, diagramon ábrázolni, és néhány jellemző számmal (átlag, medián, szórás, kvartilisek) leírni. Ebben a fejezetben végigmegyünk az adatok gyűjtésén és rendszerezésén, a gyakoriság és relatív gyakoriság fogalmán, a kör-, oszlop- és sodrófa-diagramon, a középértékeken és a szóródási mutatókon. Az érettségin ez a követelmény 5.1 pontja: közép- és emelt szinten is az adatok szemléltetése és jellemzése, emelt szinten az adathalmazok összehasonlítása, értelmezése.`,
    theory: [
      { h: 'Adatok gyűjtése, rendszerezése, gyakoriság',
        b: R`A vizsgált egyedek összessége a **sokaság**; ha nem tudjuk mindet megvizsgálni, **mintát** veszünk. A mintavétel **véletlenszerű**, ha a sokaság minden elemének ugyanakkora eséllyel kell bekerülnie a mintába (például sorsolással). Csak a véletlenszerű minta ad megbízható képet az egészről; ha például csak a barátaidat kérdezed meg, a minta torzított.\n\nAz adatokat **táblázatba** rendezzük. Ha az $n$ adat között egy érték $k$ alkalommal fordul elő, akkor ez az érték **gyakorisága** $k$, **relatív gyakorisága** pedig $r = \dfrac{k}{n}$. A relatív gyakoriságok összege mindig $1$ (azaz $100\%$), a gyakoriságok összege $n$.\n\nHa az adatok sokfélék (például testmagasságok), **osztályokba soroljuk** őket: egymás utáni intervallumokat (osztályokat) veszünk, és megszámoljuk, hány adat esik az egyes osztályokba. Ilyenkor az egyes adatok pontos értéke már nem látszik, csak az, melyik osztályba tartozik.` },
      { h: 'Diagramok: oszlop-, kör- és sodrófa-diagram',
        b: R`- **Oszlopdiagram:** kategóriák (vagy osztályok) gyakoriságát hasonlítja össze; az oszlopok magassága a gyakoriság vagy a relatív gyakoriság. Osztályokba sorolt adatoknál ez a **gyakorisági diagram**.\n- **Kördiagram:** az egész részekre bontását mutatja. Egy kategória körcikkének középponti szöge $\alpha = r \cdot 360^\circ$, ahol $r$ a relatív gyakoriság. Kevés (legfeljebb 5–6) kategóriánál jó, sok kategóriánál átláthatatlan.\n- **Sodrófa (box-plot) diagram:** öt adatot mutat: a legkisebb adatot, az alsó kvartilist, a mediánt, a felső kvartilist és a legnagyobb adatot. A „doboz” az alsó és felső kvartilis között van, benne a mediánt jelölő vonallal, a „bajuszok” a doboztól a legkisebb és legnagyobb adatig nyúlnak. Nagy adathalmazok összehasonlítására különösen alkalmas.\n\n**Melyiket válaszd?** Részarányokra kördiagram, kategóriák vagy osztályok összehasonlítására oszlopdiagram, adathalmazok eloszlásának és szóródásának összevetésére sodrófa; időbeli változásra vonaldiagram. A választást mindig indokold: mit akarsz megmutatni?\n\nDiagramról **információt olvashatsz ki**: az oszlopmagasságokból gyakoriságot, a körcikk szögéből részarányt (szög : $360^\circ$), a sodrófából a mediánt és a kvartiliseket.` },
      { h: 'Grafikus manipulációk felismerése',
        b: R`Egy diagram félrevezethet, akár szándékosan is. Tipikus trükkök és a javításuk:\n- **Csonkolt függőleges tengely:** az oszlopok nem nullától indulnak, ezért kis különbség is óriásinak látszik. Javítás: a tengely induljon $0$-ról.\n- **Egyenetlen vagy hiányzó skálabeosztás:** a tengelyen azonos hosszú szakaszok nem azonos értéket jelentenek. Javítás: egyenletes beosztás.\n- **Térhatású (3D) ábra, ábrák mérete:** a közelebbi vagy nagyobb elem túlzottan hangsúlyos. Ha egy képet kétszeres magasságúra rajzolnak, a területe négyszeres, pedig az adat csak kétszeres. Javítás: sík ábra, azonos szélességű oszlopok.\n- **Válogatott időszak vagy kategória:** csak azt az időtartamot mutatják, amelyik a mondanivalót támasztja alá. Javítás: a teljes adatsor ábrázolása.\n- **Hiányzó cím, mértékegység, mintaméret.**\n\nEgy kész diagramról azt kell tudnod megmondani, mi a félrevezető, és helyesen is meg kell tudnod rajzolni.` },
      { h: 'Átlag, módusz, medián',
        b: R`Legyenek az adatok $x_1; x_2; \dots; x_n$.\n- **Átlag (számtani közép):** $\overline{x} = \dfrac{x_1 + x_2 + \dots + x_n}{n}$. Tulajdonság: az adatok átlagtól való eltéréseinek összege $0$, és az átlag az adatok összegét $n$ egyenlő részre osztja.\n- **Medián:** az adatokat nagyság szerint növekvő sorrendbe rendezzük; páratlan számú adatnál a középső adat, páros számú adatnál a két középső adat átlaga. A medián a sorrendben „középen” áll: az adatok fele nála kisebb vagy egyenlő, fele nagyobb vagy egyenlő.\n- **Módusz:** a leggyakrabban előforduló adat. Több módusz is lehet, és ha minden adat csak egyszer fordul elő, a módusz nem informatív. Nem szám jellegű adatnál (például kedvenc szín) csak a módusz használható.\n\n**Ismert átlagú adathalmazok egyesítése.** Ha az első halmaz $n_1$ elemű, átlaga $m_1$, a második $n_2$ elemű, átlaga $m_2$, akkor az egyesített halmaz átlaga\n$$\overline{x} = \frac{n_1 m_1 + n_2 m_2}{n_1 + n_2}.$$\nMiért? Az első halmaz elemeinek összege $n_1 m_1$, a másodiké $n_2 m_2$, az egyesítettben az elemek összege ezek összege, az elemszám $n_1 + n_2$. Az átlagok egyszerű átlaga ($\frac{m_1+m_2}{2}$) csak akkor jó, ha $n_1 = n_2$.` },
      { h: 'Súlyozott számtani közép és a középérték megválasztása', level: 'emelt',
        b: R`Ha az $x_i$ értékek különböző **súllyal** ($w_i$) szerepelnek, a **súlyozott számtani közép**:\n$$\overline{x} = \frac{w_1 x_1 + w_2 x_2 + \dots + w_n x_n}{w_1 + w_2 + \dots + w_n}.$$\nGyakorisági táblázatnál a súlyok a gyakoriságok, az egyesített halmaz átlaga pedig az átlagok súlyozott közepe, a súlyok a létszámok. Ha a súlyok összege $1$ (relatív gyakoriságok), akkor a nevező $1$.\n\n**Melyik középértéket válaszd?**\n- **Átlag:** az összes adatot figyelembe veszi, de érzékeny a kiugró értékekre (egy rendkívül nagy fizetés felhúzza az átlagot).\n- **Medián:** kiugró értékekre nem érzékeny, ezért ferde eloszlású adatoknál (jövedelem, lakásárak) jobban jellemzi a „tipikus” értéket.\n- **Módusz:** kategorikus adatoknál, vagy ha a leggyakoribb értékre vagyunk kíváncsiak (például melyik cipőméretből kell a legtöbbet rendelni).\n\nMindig indokolni kell: milyen az adatok eloszlása, vannak-e kiugró értékek, mire használjuk a számot.` },
      { h: 'Terjedelem és kvartilisek',
        b: R`- **Terjedelem:** $t = x_{\max} - x_{\min}$, a legnagyobb és a legkisebb adat különbsége. Egyszerű, de egyetlen kiugró adat is nagyon megváltoztatja.\n- **Kvartilisek:** a rendezett adatokat a medián ($Q_2$) két részre osztja: egy **alsó** és egy **felső** félre. Az **alsó kvartilis** $Q_1$ az alsó fél mediánja, a **felső kvartilis** $Q_3$ a felső fél mediánja. Páratlan számú adatnál a mediánt (a középső adatot) **egyik félbe sem soroljuk be**. A kvartilisek tehát az adatokat nagyjából negyedekre osztják.\n- **Kvartilis-terjedelem:** $Q_3 - Q_1$; a középső adatok, nagyjából az adatok fele ekkora sávban van.\n\nPélda: $1;\ 3;\ 4;\ 6;\ 8;\ 9;\ 12;\ 15$ ($n = 8$). Medián: $\dfrac{6+8}{2} = 7$; az alsó fél $1; 3; 4; 6$, ennek mediánja $Q_1 = \dfrac{3+4}{2} = 3{,}5$; a felső fél $8; 9; 12; 15$, $Q_3 = \dfrac{9+12}{2} = 10{,}5$.\n\n**Fontos:** a kvartilis meghatározására nem létezik egyetlen elfogadott módszer, a számológépek és táblázatkezelők kissé eltérő értéket adhatnak. Ebben a tananyagban és a Labor statisztika eszközében a fenti szabályt használjuk (alsó és felső fél mediánja, páratlan elemszámnál a középső elem kihagyásával).\n\nA **sodrófa-diagram** az $x_{\min}$, $Q_1$, $Q_2$, $Q_3$, $x_{\max}$ értékekből készül.` },
      { h: 'Szórás',
        b: R`A **szórás** azt méri, hogy az adatok átlagosan mennyire térnek el az átlagtól. Az $x_1; \dots; x_n$ adatok szórása ($\overline{x}$ az átlag):\n$$\sigma = \sqrt{\frac{(x_1-\overline{x})^2 + (x_2-\overline{x})^2 + \dots + (x_n-\overline{x})^2}{n}}.$$\nA gyök alatti kifejezés a **szórásnégyzet** ($\sigma^2$). A követelmény szerinti szórás $n$-nel osztja a négyzetösszeget (nem $n - 1$-gyel).\n\nSzámolás lépései: (1) átlag, (2) az eltérések $x_i - \overline{x}$, (3) ezek négyzetei, (4) a négyzetek átlaga, (5) gyökvonás.\n\nHasznos átalakítás: $\sigma^2 = \overline{x^2} - \overline{x}^2$, vagyis a négyzetek átlaga mínusz az átlag négyzete. Ez a zárójelek felbontásából jön: $\frac{\sum (x_i-\overline{x})^2}{n} = \frac{\sum x_i^2}{n} - 2\overline{x}\cdot\frac{\sum x_i}{n} + \overline{x}^2 = \overline{x^2} - \overline{x}^2$.\n\nTulajdonságok: $\sigma \ge 0$, és $\sigma = 0$ pontosan akkor, ha minden adat egyenlő. Kiegészítés: ha minden adathoz ugyanazt a számot hozzáadjuk, a szórás nem változik; ha minden adatot $c$-vel szorzunk, a szórás $|c|$-szeresére változik.\n\nA zsebszámológép statisztikai üzemmódjában az $n$-nel osztó szórást ($\sigma_n$ vagy $x\sigma_n$) kell használni, nem a mintaszórást ($\sigma_{n-1}$).` },
      { h: 'Átlagos abszolút eltérés', level: 'emelt',
        b: R`Az **átlagos abszolút eltérés** az adatok átlagtól való távolságainak átlaga:\n$$\frac{|x_1-\overline{x}| + |x_2-\overline{x}| + \dots + |x_n-\overline{x}|}{n}.$$\nAz abszolút érték azért kell, mert az előjeles eltérések összege mindig $0$. A szóráshoz hasonlóan azt mutatja, mennyire szóródnak az adatok, de a nagy eltéréseket nem „erősíti fel” négyzetre emeléssel, ezért a kiugró értékekre kevésbé érzékeny. Mindig igaz, hogy az átlagos abszolút eltérés nem nagyobb a szórásnál.\n\nPélda: $2;\ 4;\ 9$, átlag $5$; az eltérések $-3;\ -1;\ 4$; az átlagos abszolút eltérés $\dfrac{3+1+4}{3} = \dfrac{8}{3} \approx 2{,}67$; a szórás $\sqrt{\dfrac{9+1+16}{3}} = \sqrt{\dfrac{26}{3}} \approx 2{,}94$.` },
      { h: 'Adathalmazok összehasonlítása, következtetések', level: 'emelt',
        b: R`Két adathalmazt (például két osztály dolgozateredményeit) több szempontból érdemes összevetni: **hol van a közepük** (átlag, medián), **mennyire szóródnak** (terjedelem, kvartilis-terjedelem, szórás), és hogyan oszlanak el.\n\n**Sodrófa-diagramok összehasonlítása** (azonos skálán):\n- melyiknek magasabb a mediánja;\n- melyik doboza keskenyebb (kisebb kvartilis-terjedelem, az adatok fele szűkebb sávban van), melyik bajusza hosszabb (nagyobb terjedelem);\n- szimmetrikus-e: a medián a doboz közepén van-e; ha közelebb van $Q_1$-hez, a felső fele szélesebben szóródik;\n- a doboz az adatok körülbelül felét, egy-egy bajusz körülbelül egy-egy negyedét fedi.\n\n**Következtetések:** kis mintából óvatosan általánosíts; két halmaz azonos átlaga mellett is lehet különböző a szóródás; az egyesített halmaz mediánját az egyes halmazok mediánjából általában nem lehet kiszámolni (az átlagot igen). Mindig mondd ki szövegesen is, mit jelent a szám a feladat szereplőire nézve.` }
    ],
    examples: [
      { t: 'Gyakorisági táblázat, relatív gyakoriság, középértékek',
        p: R`Egy dolgozat jegyei: az $1$-es jegyből $2$, a $2$-esből $3$, a $3$-asból $7$, a $4$-esből $8$, az $5$-ösből $5$ darab van. a) Hány dolgozatot írtak? b) Add meg a $4$-es relatív gyakoriságát, és mekkora körcikk tartozik hozzá kördiagramon? c) Mennyi az átlag, a medián és a módusz?`,
        steps: [R`a) $n = 2 + 3 + 7 + 8 + 5 = 25$ dolgozat.`,
          R`b) A $4$-es relatív gyakorisága $\dfrac{8}{25} = 0{,}32$ ($32\%$). A kördiagramon a körcikk középponti szöge $0{,}32 \cdot 360^\circ = 115{,}2^\circ$.`,
          R`c) Átlag: $\dfrac{1 \cdot 2 + 2 \cdot 3 + 3 \cdot 7 + 4 \cdot 8 + 5 \cdot 5}{25} = \dfrac{2 + 6 + 21 + 32 + 25}{25} = \dfrac{86}{25} = 3{,}44$.`,
          R`Medián: $25$ adat van, a rendezett sorozat $13.$ eleme a középső. A kumulált gyakoriságok: az $1$-esek $2$, az $1$–$2$ együtt $5$, az $1$–$3$ együtt $12$, az $1$–$4$ együtt $20$. A $13.$ elem tehát $4$-es.`,
          R`Módusz: a leggyakoribb jegy a $4$-es ($8$ db).`,
          R`Ellenőrzés: a relatív gyakoriságok $0{,}08 + 0{,}12 + 0{,}28 + 0{,}32 + 0{,}20 = 1$.`],
        ans: R`$25$ dolgozatot írtak; a $4$-es relatív gyakorisága $0{,}32$, a körcikk $115{,}2^\circ$; az átlag $3{,}44$, a medián $4$, a módusz $4$.`,
        checks: [['2+3+7+8+5', '25'], ['8/25', '0,32'], ['0,32*360', '115,2'], ['1*2+2*3+3*7+4*8+5*5', '86'], ['86/25', '3,44'], ['(25+1)/2', '13'], ['2/25+3/25+7/25+8/25+5/25', '1']] },
      { t: 'Terjedelem, kvartilisek, szórás',
        p: R`Kilenc tanuló percekben mért házifeladat-ideje: $9;\ 14;\ 4;\ 12;\ 16;\ 6;\ 11;\ 13;\ 5$. Határozd meg a terjedelmet, az átlagot, a mediánt, a kvartiliseket és a szórást, majd add meg a sodrófa-diagram öt adatát!`,
        steps: [R`Rendezés: $4;\ 5;\ 6;\ 9;\ 11;\ 12;\ 13;\ 14;\ 16$ ($n = 9$).`,
          R`Terjedelem: $16 - 4 = 12$.`,
          R`Átlag: $\dfrac{4+5+6+9+11+12+13+14+16}{9} = \dfrac{90}{9} = 10$.`,
          R`Medián: az $5.$ adat, $11$. Mivel $n$ páratlan, a mediánt egyik félbe sem soroljuk: az alsó fél $4; 5; 6; 9$, a felső fél $12; 13; 14; 16$.`,
          R`$Q_1 = \dfrac{5+6}{2} = 5{,}5$, $Q_3 = \dfrac{13+14}{2} = 13{,}5$, a kvartilis-terjedelem $13{,}5 - 5{,}5 = 8$.`,
          R`Szórás: az eltérések az átlagtól $-6;\ -5;\ -4;\ -1;\ 1;\ 2;\ 3;\ 4;\ 6$, négyzeteik összege $36 + 25 + 16 + 1 + 1 + 4 + 9 + 16 + 36 = 144$. $\sigma = \sqrt{\dfrac{144}{9}} = \sqrt{16} = 4$.`,
          R`Ellenőrzés a másik képlettel: a négyzetek átlaga $\dfrac{16+25+36+81+121+144+169+196+256}{9} = \dfrac{1044}{9} = 116$, ebből $116 - 10^2 = 16 = \sigma^2$.`],
        ans: R`Terjedelem $12$ perc, átlag $10$ perc, medián $11$ perc, $Q_1 = 5{,}5$, $Q_3 = 13{,}5$ perc, szórás $4$ perc. A sodrófa öt adata: $4;\ 5{,}5;\ 11;\ 13{,}5;\ 16$.`,
        checks: [['16-4', '12'], ['(4+5+6+9+11+12+13+14+16)/9', '10'], ['(9+1)/2', '5'], ['(5+6)/2', '5,5'], ['(13+14)/2', '13,5'], ['13,5-5,5', '8'], ['36+25+16+1+1+4+9+16+36', '144'], ['sqrt(144/9)', '4'], ['(16+25+36+81+121+144+169+196+256)/9-10^2', '16']] },
      { t: 'Hiányzó adat meghatározása átlagból és mediánból (emelt)',
        p: R`Hat pozitív egész szám: $4;\ 6;\ 7;\ x;\ y;\ 15$, ahol $7 < x < y < 15$. Az adatok átlaga $9$, mediánja $8{,}5$. a) Határozd meg $x$ és $y$ értékét! b) Számítsd ki az adatok szórását és átlagos abszolút eltérését! c) Add meg a kvartiliseket!`,
        steps: [R`a) A megadott feltételek miatt a rendezett sorrend $4;\ 6;\ 7;\ x;\ y;\ 15$. Hat adatnál a medián a $3.$ és $4.$ adat átlaga: $\dfrac{7 + x}{2} = 8{,}5$, ebből $x = 10$.`,
          R`Az átlag $9$, ezért az adatok összege $6 \cdot 9 = 54$. Így $4 + 6 + 7 + 10 + y + 15 = 54$, vagyis $42 + y = 54$, $y = 12$.`,
          R`Ellenőrzés: $7 < 10 < 12 < 15$ teljesül, az átlag $\dfrac{4+6+7+10+12+15}{6} = \dfrac{54}{6} = 9$, a medián $\dfrac{7+10}{2} = 8{,}5$.`,
          R`b) Az átlagtól való eltérések: $-5;\ -3;\ -2;\ 1;\ 3;\ 6$. Négyzetösszegük $25 + 9 + 4 + 1 + 9 + 36 = 84$, így $\sigma^2 = \dfrac{84}{6} = 14$, $\sigma = \sqrt{14} \approx 3{,}74$.`,
          R`Az átlagos abszolút eltérés: $\dfrac{5+3+2+1+3+6}{6} = \dfrac{20}{6} = \dfrac{10}{3} \approx 3{,}33$ (és valóban nem nagyobb a szórásnál).`,
          R`c) Az alsó fél $4; 6; 7$, a felső fél $10; 12; 15$, ezért $Q_1 = 6$, $Q_3 = 12$.`],
        ans: R`$x = 10$, $y = 12$; a szórás $\sqrt{14} \approx 3{,}74$, az átlagos abszolút eltérés $\dfrac{10}{3} \approx 3{,}33$; $Q_1 = 6$, $Q_3 = 12$.`,
        checks: [['(7+10)/2', '8,5'], ['6*9', '54'], ['54-(4+6+7+10+15)', '12'], ['(4+6+7+10+12+15)/6', '9'], ['25+9+4+1+9+36', '84'], ['84/6', '14'], ['sqrt(84/6)', 'sqrt(14)'], ['(5+3+2+1+3+6)/6', '10/3']] },
      { t: 'Két csoport átlagának egyesítése, súlyozott közép (emelt)',
        p: R`Egy évfolyam matematika-dolgozatát két csoport írta. Az A csoport $12$ fős, átlaga $4{,}5$; a B csoport $18$ fős, átlaga $3{,}5$. a) Mennyi az összes dolgozat átlaga? b) Fogalmazd meg ugyanezt súlyozott átlagként! c) Meghatározható-e az egyesített halmaz mediánja az adatokból?`,
        steps: [R`a) Az A csoport jegyeinek összege $12 \cdot 4{,}5 = 54$, a B csoporté $18 \cdot 3{,}5 = 63$. Együtt $54 + 63 = 117$ pont $12 + 18 = 30$ dolgozatra.`,
          R`Az átlag $\dfrac{117}{30} = 3{,}9$.`,
          R`b) A létszámok a súlyok: $\dfrac{12 \cdot 4{,}5 + 18 \cdot 3{,}5}{12 + 18}$. Ugyanez relatív súlyokkal: az A súlya $\dfrac{12}{30} = 0{,}4$, a B súlya $0{,}6$, az átlag $0{,}4 \cdot 4{,}5 + 0{,}6 \cdot 3{,}5 = 1{,}8 + 2{,}1 = 3{,}9$.`,
          R`Ellenőrzés: a két átlag egyszerű átlaga $4$ lenne, de a B csoport nagyobb, ezért az együttes átlag a $3{,}5$-hez van közelebb; $3{,}9 < 4$ ezt mutatja.`,
          R`c) Nem: az átlagokból és a létszámokból nem derül ki, hogyan oszlanak el az egyes jegyek, így a medián nem számolható ki. (Az átlag „összeadható”, a medián nem.)`],
        ans: R`Az összes dolgozat átlaga $3{,}9$. A medián a megadott adatokból nem határozható meg.`,
        checks: [['12*4,5', '54'], ['18*3,5', '63'], ['(54+63)/(12+18)', '3,9'], ['12/30', '0,4'], ['0,4*4,5+0,6*3,5', '3,9'], ['(4,5+3,5)/2', '4']] },
      { t: 'Sodrófa-diagramok összehasonlítása (emelt)',
        p: R`Két osztály dolgozatának pontszámaiból sodrófa-diagram készült. Az A osztályé: legkisebb $12$, $Q_1 = 20$, medián $26$, $Q_3 = 32$, legnagyobb $40$. A B osztályé: legkisebb $8$, $Q_1 = 22$, medián $26$, $Q_3 = 28$, legnagyobb $45$. Hasonlítsd össze az osztályokat! Igaz-e, hogy a B osztályban a tanulók fele $22$ és $28$ pont közé esett?`,
        steps: [R`Terjedelem: A: $40 - 12 = 28$; B: $45 - 8 = 37$. A B osztály adatai szélesebb sávban vannak.`,
          R`Kvartilis-terjedelem: A: $32 - 20 = 12$; B: $28 - 22 = 6$. A B osztály középső fele sokkal szorosabban csoportosul.`,
          R`A két medián egyenlő ($26$), tehát mindkét osztályban a tanulók fele $26$ pont vagy kevesebbet, fele $26$ vagy többet ért el.`,
          R`A B osztály doboza fele olyan széles ($6$ és $12$), de a bajuszai hosszabbak: a legkisebb és a legnagyobb adat távolabb van a dobozától, a tanulók (körülbelül) fele viszont $22$ és $28$ pont között van.`,
          R`A doboz ($Q_1$ és $Q_3$ között) az adatok legalább felét tartalmazza, tehát az állítás (a tanulók fele $22$ és $28$ pont közé esett) elfogadható: a B osztályban a tanulók körülbelül fele ebben a sávban van.`],
        ans: R`A mediánok egyenlők ($26$), az A osztály kvartilis-terjedelme $12$, a B osztályé $6$, a terjedelmek $28$ és $37$. Az állítás igaz.`,
        checks: [['40-12', '28'], ['45-8', '37'], ['32-20', '12'], ['28-22', '6'], ['12/6', '2']] }
    ],
    sims: ['statisztika', 'diagram'],
    mistakes: [R`A mediánt rendezés nélkül veszed: előbb mindig sorba kell rendezni az adatokat, csak utána keresd a középsőt.`,
      R`Páros elemszámnál a két középső adat közül csak az egyiket veszed mediánnak: a mediánjuk átlaga kell. Páratlan elemszámnál a kvartiliseknél pedig a középső adatot nem szabad egyik félbe sem beszámítani.`,
      R`A szórásnál elfelejted a gyökvonást (akkor szórásnégyzetet kapsz), vagy $n$ helyett $n - 1$-gyel osztasz (a követelmény szerinti szórás $n$-nel osztó), vagy az eltéréseket nem négyzetre emeled.`,
      R`Az átlagos abszolút eltérésnél elhagyod az abszolút értéket: az előjeles eltérések összege mindig $0$.`,
      R`Két csoport átlagát egyszerűen átlagolod: $\frac{m_1 + m_2}{2}$ csak azonos létszámnál jó, különben súlyozni kell a létszámokkal.`,
      R`Kördiagramnál a szöget $r \cdot 100$-zal számolod: a teljes körhöz $360^\circ$ tartozik, így $\alpha = r \cdot 360^\circ$.`,
      R`A relatív gyakoriságok összege nem $1$: ha nem jön ki az $1$ (vagy $100\%$), valahol számolási hiba van.`,
      R`A diagramon nem veszed észre a csonkolt tengelyt: ha az oszlopok nem $0$-ról indulnak, a kis különbség is nagynak látszik.`],
    exam: R`Közép- és emelt szinten is követelmény az adatok szemléltetése, táblázatba rendezése, a véletlenszerű mintavétel fogalma, a kör-, oszlop- és sodrófa-diagram készítése és olvasása, a diagramtípus megválasztása és indoklása, a grafikus manipulációk felismerése és javítása, valamint az osztályba sorolás, a gyakoriság és a relatív gyakoriság. A mutatók közül közép- és emelt szinten is kell az átlag, a kvartilisek, a medián, a módusz, a terjedelem, a szórás (definíció alapján vagy számológéppel), és ismert átlagú halmazok egyesítésének átlaga. Emelt szinten ezen felül a súlyozott számtani közép, az átlagos abszolút eltérés, a középérték indokolt megválasztása, sodrófa-diagramok összehasonlítása és statisztikai adatok értelmezése, következtetések levonása.`,
    cheat: [R`r = \dfrac{k}{n}, \qquad \alpha = r \cdot 360^\circ`,
      R`\overline{x} = \dfrac{x_1 + \dots + x_n}{n}, \qquad \overline{x} = \dfrac{n_1 m_1 + n_2 m_2}{n_1 + n_2}`,
      R`\text{súlyozott közép: } \dfrac{w_1 x_1 + \dots + w_n x_n}{w_1 + \dots + w_n}`,
      R`\text{medián: rendezés után a középső (páros } n \text{-nél a két középső átlaga)}`,
      R`t = x_{\max} - x_{\min}, \qquad Q_3 - Q_1`,
      R`Q_1,\ Q_3 \text{: az alsó, ill. felső fél mediánja (páratlan } n \text{-nél a középső elem kimarad)}`,
      R`\sigma = \sqrt{\dfrac{(x_1-\overline{x})^2 + \dots + (x_n-\overline{x})^2}{n}}, \qquad \sigma^2 = \overline{x^2} - \overline{x}^2`,
      R`\text{átlagos abszolút eltérés: } \dfrac{|x_1-\overline{x}| + \dots + |x_n-\overline{x}|}{n}`],
    cheatChecks: [['((2-5)^2+(8-5)^2)/2', '(2^2+8^2)/2-5^2'], ['0,25*360', '90'], ['(10*4+30*8)/(10+30)', '7'], ['(3+9)/2', '6']],
    terms: ['sokaság', 'minta', 'véletlenszerű mintavétel', 'gyakoriság', 'relatív gyakoriság', 'osztályba sorolás', 'oszlopdiagram', 'kördiagram', 'sodrófa-diagram', 'átlag', 'súlyozott közép', 'medián', 'módusz', 'terjedelem', 'kvartilis', 'szórás', 'szórásnégyzet', 'átlagos abszolút eltérés', 'grafikus manipuláció']
  };

  def('v-st-1', 'valoszinuseg', 'statisztika', 1, 'Kördiagram és relatív gyakoriság', function (r) {
    var kind = r.int(0, 2), w = r.pick(['nyár', 'tél', 'ősz', 'tavasz', 'mozi', 'színház', 'pizza', 'tészta']);
    if (kind === 2) {
      var n2 = r.pick([20, 25, 40, 50, 100, 200]), k2 = r.int(1, n2 - 1), v2 = k2 / n2 * 100;
      return {
        q: R`Egy felmérésben $${n2}$ embert kérdeztek meg. A „${w}” választ $${k2}$ fő adta. Hány százalék a válasz relatív gyakorisága? (A százalékjel nélkül add meg.)`,
        answer: { type: 'num', value: v2 }, ansTex: K.T(v2) + R`\%`,
        verify: `100*${k2}/${n2}`,
        tip1: R`A relatív gyakoriság a gyakoriság és az összes adat száma hányadosa.`,
        tip2: R`Számold ki a $\dfrac{${k2}}{${n2}}$ hányadost, majd szorozd meg ezzel: $100$.`,
        sol: [R`$r = \dfrac{${k2}}{${n2}} = ${K.T(k2 / n2, 4)}$`, R`Százalékban: $${K.T(k2 / n2, 4)} \cdot 100 = ${K.T(v2)}$.`, R`A relatív gyakoriság $${K.T(v2)}\%$.`]
      };
    }
    var n = r.pick(N360), k = r.int(1, n - 1), ang = 360 / n * k;
    if (kind === 0) {
      return {
        q: R`Egy kördiagramon $${n}$ megkérdezett válaszait ábrázoljuk. A „${w}” választ $${k}$ fő adta. Hány fokos a hozzá tartozó körcikk középponti szöge?`,
        answer: { type: 'num', value: ang }, ansTex: K.T(ang) + R`^\circ`,
        verify: `${k}/${n}*360`,
        tip1: R`A körcikk szöge a relatív gyakoriság és a $360^\circ$ szorzata.`,
        tip2: R`A relatív gyakoriság $\dfrac{${k}}{${n}}$; szorozd meg ezzel: $360$.`,
        sol: [R`$\alpha = \dfrac{${k}}{${n}} \cdot 360^\circ$`, R`$\alpha = ${K.T(360 / n)} \cdot ${k} = ${K.T(ang)}^\circ$`, R`A körcikk középponti szöge $${K.T(ang)}^\circ$.`]
      };
    }
    return {
      q: R`Egy kördiagramon $${n}$ megkérdezett válaszait ábrázoljuk. A „${w}” választ ábrázoló körcikk középponti szöge $${ang}^\circ$. Hányan választották ezt a választ?`,
      answer: { type: 'num', value: k }, ansTex: K.T(k),
      verify: `${ang}/360*${n}`,
      tip1: R`A körcikk szöge a teljes körhöz ($360^\circ$) viszonyítva a relatív gyakoriságot adja.`,
      tip2: R`A relatív gyakoriság $\dfrac{${ang}}{360}$; ezt szorozd meg az összes válaszadók számával.`,
      sol: [R`$r = \dfrac{${ang}}{360}$`, R`$k = r \cdot ${n} = \dfrac{${ang}}{360} \cdot ${n} = ${k}$`, R`$${k}$ fő választotta ezt a választ.`]
    };
  });

  def('v-st-2', 'valoszinuseg', 'statisztika', 1, 'Átlag, medián, terjedelem', function (r) {
    var n = r.int(5, 9), kind = r.int(0, 2), a = [], i;
    for (i = 0; i < n; i++) a.push(r.int(2, 15));
    if (kind === 0) fixMean(a);
    var s = sorted(a), sh = r.shuffle(a), tot = sum(a), res, qs, sols, ver, tp1, tp2;
    if (kind === 0) {
      res = tot / n;
      return {
        q: R`Egy adathalmaz elemei: $${list(sh)}$. Mennyi az átlaguk?`,
        answer: { type: 'num', value: res }, ansTex: K.T(res),
        verify: `(${a.join('+')})/${n}`,
        tip1: R`Add össze az összes adatot, és oszd el az adatok számával.`,
        tip2: R`Az adatok száma $${n}$, az összegük $${tot}$.`,
        sol: [R`Az összeg: $${a.join(' + ')} = ${tot}$.`, R`Átlag: $\dfrac{${tot}}{${n}} = ${K.T(res)}$.`]
      };
    }
    if (kind === 1) {
      res = medianS(s);
      var h = Math.floor(n / 2);
      return {
        q: R`Egy adathalmaz elemei: $${list(sh)}$. Mennyi a mediánjuk?`,
        answer: { type: 'num', value: res }, ansTex: K.T(res),
        verify: medExpr(s),
        tip1: R`Előbb rendezd növekvő sorrendbe az adatokat.`,
        tip2: n % 2 ? R`Az adatok száma páratlan ($${n}$), a középső ${oa((n + 1) / 2)} $${(n + 1) / 2}$. adat.` : R`Az adatok száma páros ($${n}$), a medián ${oa(n / 2)} $${n / 2}$. és ${oa(n / 2 + 1)} $${n / 2 + 1}$. adat átlaga.`,
        sol: [R`Rendezve: $${list(s)}$.`, n % 2 ? R`A középső ($${(n + 1) / 2}$.) adat: $${K.T(res)}$.` : R`A két középső adat $${K.T(s[h - 1])}$ és $${K.T(s[h])}$, átlaguk $${K.T(res)}$.`, R`A medián $${K.T(res)}$.`]
      };
    }
    res = s[n - 1] - s[0];
    return {
      q: R`Egy adathalmaz elemei: $${list(sh)}$. Mennyi a terjedelmük?`,
      answer: { type: 'num', value: res }, ansTex: K.T(res),
      verify: `${s[n - 1]}-${s[0]}`,
      tip1: R`A terjedelem a legnagyobb és a legkisebb adat különbsége.`,
      tip2: R`A legnagyobb adat $${s[n - 1]}$, a legkisebb $${s[0]}$.`,
      sol: [R`A legnagyobb adat $${s[n - 1]}$, a legkisebb $${s[0]}$.`, R`$t = ${s[n - 1]} - ${s[0]} = ${res}$`]
    };
  });

  def('v-st-3', 'valoszinuseg', 'statisztika', 2, 'Kvartilisek', function (r) {
    var n = r.int(7, 13), a = [], i, kind = r.int(0, 2);
    for (i = 0; i < n; i++) a.push(r.int(1, 40));
    var qq = quart(a), sh = r.shuffle(a), res, ver, name;
    if (kind === 0) { res = qq.q1; ver = medExpr(qq.lo); name = R`az alsó kvartilist ($Q_1$)`; }
    else if (kind === 1) { res = qq.q3; ver = medExpr(qq.hi); name = R`a felső kvartilist ($Q_3$)`; }
    else { res = qq.q3 - qq.q1; ver = medExpr(qq.hi) + '-' + medExpr(qq.lo); name = R`a kvartilis-terjedelmet ($Q_3 - Q_1$)`; }
    var odd = n % 2 === 1;
    return {
      q: R`Egy adathalmaz $${n}$ eleme: $${list(sh)}$. Add meg ${name}! (A kvartiliseket az alsó és a felső fél mediánjaként határozd meg; páratlan elemszámnál a középső elemet egyik félbe se számítsd.)`,
      answer: { type: 'num', value: res }, ansTex: K.T(res),
      verify: ver,
      tip1: R`Rendezd az adatokat, és válaszd ketté a mediánnál.`,
      tip2: odd ? R`Az adatok száma páratlan, ezért a középső ($${(n + 1) / 2}$.) adatot elhagyod; az alsó és a felső fél is $${(n - 1) / 2}$ elemű.` : R`Az adatok száma páros, az alsó és a felső fél is $${n / 2}$ elemű.`,
      sol: [R`Rendezve: $${list(qq.s)}$.`,
        R`Alsó fél: $${list(qq.lo)}$, felső fél: $${list(qq.hi)}$` + (odd ? R` (a mediánt kihagytuk, ez: $${K.T(qq.q2)}$).` : '.'),
        R`$Q_1 = ${K.T(qq.q1)}$, $Q_3 = ${K.T(qq.q3)}$.`].concat(kind === 2 ? [R`$Q_3 - Q_1 = ${K.T(qq.q3)} - ${K.par(qq.q1)} = ${K.T(res)}$.`] : [])
    };
  });

  def('v-st-4', 'valoszinuseg', 'statisztika', 2, 'Szórás és átlagos abszolút eltérés', function (r) {
    var n = r.int(5, 8), a = [], i, aae = r.int(0, 2) === 0;
    for (i = 0; i < n; i++) a.push(r.int(1, 12));
    fixMean(a);
    var m = sum(a) / n, d = a.map(function (x) { return x - m; }), sh = r.shuffle(a);
    var ss = sum(d.map(function (x) { return x * x; })), sd = Math.sqrt(ss / n);
    var sa = sum(d.map(function (x) { return Math.abs(x); })), ae = sa / n;
    var meanLine = R`Az átlag: $\overline{x} = \dfrac{${sum(a)}}{${n}} = ${m}$. Az eltérések az átlagtól: $${list(d)}$.`;
    if (aae) {
      return {
        q: R`Egy adathalmaz elemei: $${list(sh)}$. Mennyi az átlagos abszolút eltérésük? Két tizedesjegyre kerekítve add meg.`,
        answer: { type: 'num', value: ae, tol: 0.0051 }, ansTex: R`\approx ${K.T(ae, 2)}`,
        verify: '(' + a.map(function (x) { return '|' + x + '-' + m + '|'; }).join('+') + ')/' + n,
        tip1: R`Számold ki az átlagot, majd az adatok átlagtól való távolságainak (abszolút értékeinek) átlagát.`,
        tip2: R`Az átlag $${m}$; az eltérések abszolút értékeit add össze, és az összeget oszd el ennyivel: $${n}$.`,
        sol: [meanLine, R`Az abszolút értékek összege: $${d.map(function (x) { return Math.abs(x); }).join(' + ')} = ${sa}$.`, R`Az átlagos abszolút eltérés $\dfrac{${sa}}{${n}} \approx ${K.T(ae, 2)}$.`]
      };
    }
    var sqs = d.map(function (x) { return K.par(x) + '^2'; }).join(' + ');
    return {
      q: R`Egy adathalmaz elemei: $${list(sh)}$. Mennyi a szórásuk? Két tizedesjegyre kerekítve add meg.`,
      answer: { type: 'num', value: sd, tol: 0.0051 }, ansTex: R`\approx ${K.T(sd, 2)}`,
      verify: 'sqrt((' + a.map(function (x) { return x + '^2'; }).join('+') + ')/' + n + '-' + m + '^2)',
      tip1: R`Számold ki az átlagot, az átlagtól való eltérések négyzeteinek átlagát, és vonj gyököt.`,
      tip2: R`Az átlag $${m}$; az eltérések négyzetösszegét oszd el ennyivel: $${n}$ (nem eggyel kevesebbel).`,
      sol: [meanLine, R`$\sigma^2 = \dfrac{${sqs}}{${n}} = \dfrac{${ss}}{${n}}$`, R`$\sigma = \sqrt{\dfrac{${ss}}{${n}}} \approx ${K.T(sd, 2)}$`]
    };
  });

  def('v-st-5', 'valoszinuseg', 'statisztika', 3, 'Hiányzó adat átlagból és mediánból', function (r) {
    var a = r.int(1, 6), b = a + r.int(1, 3), c = b + r.int(1, 3), x = c + r.int(1, 4), y = x + r.int(1, 4);
    var S = a + b + c + x + y, f0 = y + 1, f = f0 + ((6 - (S + f0) % 6) % 6), tot = S + f, mean = tot / 6, med = (c + x) / 2;
    return {
      q: R`Hat egész szám: $${a};\ ${b};\ ${c};\ x;\ y;\ ${f}$, ahol $${c} < x < y < ${f}$. Az adatok átlaga $${K.T(mean)}$, mediánjuk $${K.T(med)}$. Mekkora $y$?`,
      answer: { type: 'num', value: y }, ansTex: K.T(y),
      verify: `6*${mean}-(${a}+${b}+${c}+(${2 * med}-${c})+${f})`,
      tip1: R`Hat adatnál a medián a harmadik és a negyedik adat átlaga; előbb ebből határozd meg $x$-et.`,
      tip2: R`Az adatok összege $6 \cdot ${K.T(mean)} = ${tot}$. Ha $x$ már megvan, ebből kapod $y$-t.`,
      sol: [R`A rendezett sorrend $${a};\ ${b};\ ${c};\ x;\ y;\ ${f}$, a medián a $3.$ és $4.$ adat átlaga: $\dfrac{${c} + x}{2} = ${K.T(med)}$, így $x = ${x}$.`,
        R`Az összeg: $6 \cdot ${K.T(mean)} = ${tot}$, tehát $${a} + ${b} + ${c} + ${x} + y + ${f} = ${tot}$, azaz $${S - y + f} + y = ${tot}$.`,
        R`$y = ${y}$.`,
        R`Ellenőrzés: $${c} < ${x} < ${y} < ${f}$ teljesül, az átlag $\dfrac{${tot}}{6} = ${K.T(mean)}$.`]
    };
  });

  def('v-st-6', 'valoszinuseg', 'statisztika', 3, 'Átlagok egyesítése, súlyozott átlag', function (r) {
    var kind = r.int(0, 2), N, n1, n2, m1, m2;
    if (kind === 2) {
      N = r.pick([20, 25, 40, 50]);
      var f = [], i, left = N;
      for (i = 0; i < 4; i++) { f.push(r.int(0, Math.floor(N / 5))); left -= f[i]; }
      f.push(left);
      var t = 0; for (i = 0; i < 5; i++) t += (i + 1) * f[i];
      var mean = t / N, parts = [];
      for (i = 0; i < 5; i++) parts.push((i + 1) + ': ' + f[i]);
      return {
        q: R`Egy dolgozat jegyeinek eloszlása (jegy: darabszám): $${parts.join(';\\ ')}$. Mennyi az osztályzatok átlaga? Pontosan, tizedes törtként add meg.`,
        answer: { type: 'num', value: mean }, ansTex: K.T(mean, 4),
        verify: '(' + f.map(function (x, j) { return (j + 1) + '*' + x; }).join('+') + ')/' + N,
        tip1: R`Súlyozott átlagot kell számolnod: a jegyek a számok, a darabszámok a súlyok.`,
        tip2: R`Az összes dolgozat száma $${N}$; a jegyek és darabszámok szorzatainak összegét oszd ezzel.`,
        sol: [R`A dolgozatok száma: $${f.join(' + ')} = ${N}$.`,
          R`A jegyek összege: $${f.map(function (x, j) { return (j + 1) + ' \\cdot ' + x; }).join(' + ')} = ${t}$.`,
          R`Átlag: $\dfrac{${t}}{${N}} = ${K.T(mean, 4)}$.`]
      };
    }
    N = r.pick([20, 25, 50]); n1 = r.int(5, N - 5); n2 = N - n1; m1 = r.int(2, 5); m2 = r.int(2, 5);
    var M = Math.round((n1 * m1 + n2 * m2) / N * 1000) / 1000;
    if (kind === 0) {
      return {
        q: R`Az A csoport $${n1}$ fős, átlaga $${m1}$; a B csoport $${n2}$ fős, átlaga $${m2}$. Mennyi a két csoport együttes átlaga? Pontosan, tizedes törtként add meg.`,
        answer: { type: 'num', value: M }, ansTex: K.T(M, 3),
        verify: `(${n1}*${m1}+${n2}*${m2})/(${n1}+${n2})`,
        tip1: R`Az átlagokat a létszámokkal kell súlyozni; az egyszerű átlagolás hibás.`,
        tip2: R`Az A csoportban az összeg $${n1} \cdot ${m1}$, a B csoportban $${n2} \cdot ${m2}$; az együttes létszám $${N}$.`,
        sol: [R`Az összegek: $${n1} \cdot ${m1} = ${n1 * m1}$ és $${n2} \cdot ${m2} = ${n2 * m2}$.`, R`Együtt $${n1 * m1 + n2 * m2}$ az összeg $${N}$ főre.`, R`Az átlag $\dfrac{${n1 * m1 + n2 * m2}}{${N}} = ${K.T(M, 3)}$.`]
      };
    }
    return {
      q: R`Az A csoport $${n1}$ fős, átlaga $${m1}$. A B csoport $${n2}$ fős. A két csoport együttes átlaga $${K.T(M, 3)}$. Mennyi a B csoport átlaga?`,
      answer: { type: 'num', value: m2 }, ansTex: K.T(m2),
      verify: `(${N}*${cs(M)}-${n1}*${m1})/${n2}`,
      tip1: R`Az együttes átlagból és a létszámból megkapod az összes adat összegét; ebből vond ki az A csoport összegét.`,
      tip2: R`Az együttes összeg $${N} \cdot ${K.T(M, 3)}$, az A csoporté $${n1} \cdot ${m1}$.`,
      sol: [R`Az összes adat összege: $${N} \cdot ${K.T(M, 3)} = ${K.T(N * M, 3)}$.`, R`Az A csoporté $${n1} \cdot ${m1} = ${n1 * m1}$, így a B csoporté $${K.T(N * M, 3)} - ${n1 * m1} = ${n2 * m2}$.`, R`A B csoport átlaga $\dfrac{${n2 * m2}}{${n2}} = ${m2}$.`]
    };
  });

  /* ================= 5.2 A VALÓSZÍNŰSÉG-SZÁMÍTÁS ELEMEI ================= */
  MO.content['valoszinuseg/valszam'] = {
    intro: R`A valószínűség-számítás a véletlen jelenségek mennyiségi leírása: megmondja, mennyire „várható” egy esemény. Ebben a fejezetben az események és műveleteik után a klasszikus modellt, a geometriai valószínűséget, a függetlenséget, a visszatevéses és visszatevés nélküli mintavételt, a várható értéket tanuljuk meg; emelt szinten a binomiális és hipergeometriai eloszlást, és a feltételes valószínűséget is. A követelmény 5.2 pontja tartalmazza ezeket a fogalmakat; a kombinatorikai alapok (összeszámlálás) a Gondolkodási módszerek fejezet kombinatorika részében találhatók.`,
    theory: [
      { h: 'Események és műveleteik',
        b: R`Egy **véletlen kísérlet** kimenetelét nem tudjuk előre. A kísérlet lehetséges kimeneteleit **elemi eseményeknek** nevezzük, ezek összessége az **eseménytér** (jele $H$). **Esemény** az eseménytér egy részhalmaza; az esemény **bekövetkezik**, ha a kísérlet kimenetele eleme. A **biztos esemény** az egész eseménytér, a **lehetetlen esemény** az üres halmaz.\n\nMűveletek (kockadobás: $H = \{1; 2; 3; 4; 5; 6\}$):\n- **összeg** $A + B$ (más jelöléssel $A \cup B$): bekövetkezik, ha $A$ vagy $B$ (legalább az egyik) bekövetkezik;\n- **szorzat** $A \cdot B$ ($A \cap B$): bekövetkezik, ha $A$ és $B$ is bekövetkezik;\n- **komplementer** $\overline{A}$: pontosan akkor következik be, ha $A$ nem;\n- $A$ és $B$ **egymást kizáró** események, ha nem következhetnek be egyszerre: $A \cdot B$ a lehetetlen esemény.\n\nPéldául $A$: „páros számot dobunk” $= \{2; 4; 6\}$, $B$: „legalább $5$-öt dobunk” $= \{5; 6\}$. Ekkor $A + B = \{2; 4; 5; 6\}$, $A \cdot B = \{6\}$, $\overline{A} = \{1; 3; 5\}$. A „nem $A$ és nem $B$” esemény az $\overline{A + B}$ (de Morgan).` },
      { h: 'A klasszikus modell és a relatív gyakoriság',
        b: R`**Klasszikus (Laplace-) modell:** ha a kísérletnek véges sok, egyformán valószínű elemi eseménye van, akkor egy $A$ esemény valószínűsége\n$$P(A) = \frac{k}{n} = \frac{\text{kedvező esetek száma}}{\text{összes eset száma}}.$$\nA kedvező és az összes eset számát általában kombinatorikával határozzuk meg.\n\nFigyelj a **modellre**: két szabályos kockánál a $36$ rendezett pár ($(2; 5)$ és $(5; 2)$ különbözik) egyformán valószínű, az összegek viszont nem ($7$-et $6$-féleképpen, $2$-t csak $1$-féleképpen kaphatunk).\n\n**Relatív gyakoriság és valószínűség.** Ha a kísérletet sokszor megismételjük, az $A$ esemény relatív gyakorisága $\dfrac{k}{n}$ ($k$ a bekövetkezések száma) általában az $A$ valószínűsége körül ingadozik, és az ingadozás a kísérletek számának növelésével egyre kisebb. Ezt a kapcsolatot szemlélteti a Labor Monte-Carlo eszköze. A valószínűség tehát a relatív gyakoriság „idealizált” értéke.` },
      { h: 'A valószínűség tulajdonságai: komplementer és összegszabály',
        b: R`Bármely $A$ eseményre $0 \le P(A) \le 1$; $P(\text{biztos}) = 1$, $P(\text{lehetetlen}) = 0$.\n\n**Komplementer:**\n$$P(\overline{A}) = 1 - P(A).$$\n**Összegszabály:** bármely két eseményre\n$$P(A + B) = P(A) + P(B) - P(A \cdot B).$$\nMiért? Az $A \cdot B$ elemeit a $P(A)$ és a $P(B)$ is tartalmazza, ezért kétszer számoltuk őket. Ha $A$ és $B$ egymást kizárják, $P(A \cdot B) = 0$, és $P(A + B) = P(A) + P(B)$.\n\n**„Legalább egy” típusú kérdéseknél** szinte mindig a komplementerrel számolj: „legalább egy” a „nincs egy sem” komplementere, és az utóbbit könnyű kiszámolni:\n$$P(\text{legalább egy}) = 1 - P(\text{egy sem}).$$\nPélda: két kockával legalább egy hatost dobunk: $1 - \left(\dfrac{5}{6}\right)^2 = \dfrac{11}{36}$.` },
      { h: 'Geometriai valószínűség',
        b: R`Ha a kísérlet kimenetele egy tartomány (szakasz, síkidom, test) véletlenszerűen, „egyenletesen” kiválasztott pontja, akkor a pont egy részhalmazba esésének valószínűsége a **mértékek arányával** egyenlő:\n$$P(A) = \frac{\text{kedvező tartomány mértéke}}{\text{teljes tartomány mértéke}}.$$\nA mérték szakasznál hosszúság, síkidomnál terület, testnél térfogat; a számlálóban és a nevezőben **azonos fajta** mérték áll.\n\nPélda: egy $10$ cm oldalú négyzetbe véletlenszerűen pontot dobunk. Annak a valószínűsége, hogy a pont a beírt körön belül van: $\dfrac{5^2 \pi}{10^2} = \dfrac{\pi}{4} \approx 0{,}785$.\n\nA módszer akkor jó, ha minden pont „egyformán esélyes” – ezt a feladat megfogalmazásában (véletlenszerűen, találomra) rögzíti. Ilyenkor általában koordináta-rendszerben ábrázolod a kedvező és az összes esetet.` },
      { h: 'Független események',
        b: R`Két esemény **független**, ha az egyik bekövetkezése nem befolyásolja a másik bekövetkezésének valószínűségét. Pontosan akkor igaz, ha\n$$P(A \cdot B) = P(A) \cdot P(B).$$\nTöbb független esemény együttes bekövetkezésének valószínűsége a valószínűségek szorzata: például egy kockával háromszor egymás után hatost dobunk: $\left(\dfrac{1}{6}\right)^3 = \dfrac{1}{216}$.\n\nGyakori tévedések:\n- **Egymást kizáró** és **független** nem ugyanaz. Ha $P(A) > 0$ és $P(B) > 0$, akkor az egymást kizáró események sosem függetlenek, mert $P(A \cdot B) = 0 \ne P(A) P(B)$. Intuitíve: ha az egyik bekövetkezett, a másik már biztosan nem következhet be.\n- Ha $A$ és $B$ független, akkor $A$ és $\overline{B}$ is az (kiegészítés), ezért a „nem történt meg” eseményekre is használható a szorzat.\n- A pénzérme előző dobásai nem „emlékeznek”: egymást követő dobások függetlenek.\n\nTáblázatból vagy szövegből is ellenőrizhető a függetlenség: számítsd ki $P(A \cdot B)$-t és $P(A) \cdot P(B)$-t, és hasonlítsd össze.` },
      { h: 'Mintavétel visszatevéssel és visszatevés nélkül',
        b: R`Egy urnában $N$ golyó van, ebből $K$ piros. Kihúzunk $n$ golyót.\n\n**Visszatevéses mintavétel:** minden húzás után visszatesszük a golyót, ezért a húzások **függetlenek**, és minden húzásnál ugyanakkora a piros valószínűsége: $p = \dfrac{K}{N}$. Például két húzásnál $P(\text{mindkettő piros}) = \left(\dfrac{K}{N}\right)^2$.\n\n**Visszatevés nélküli mintavétel:** a kihúzott golyó nem kerül vissza, a következő húzás valószínűsége az előzőtől függ. Két húzásnál $P(\text{mindkettő piros}) = \dfrac{K}{N} \cdot \dfrac{K-1}{N-1}$. Ez ugyanaz, mint ha egyszerre húznánk ki $n$ golyót; ilyenkor a klasszikus modellben a sorrendtől eltekintünk:\n$$P(\text{mindkettő piros}) = \frac{\binom{K}{2}}{\binom{N}{2}}.$$\n\n**Mikor melyik?** Ha a feladat szerint a kiválasztott elem visszakerül (vagy a sokaság olyan nagy, hogy a kivétel alig változtat), visszatevéses; ha egy darab nem szerepelhet kétszer (kártyahúzás, selejtes termék kiemelése a tételből), visszatevés nélküli.\n\nA „különböző színű két golyó” valószínűsége visszatevéssel $2 \cdot \dfrac{K}{N} \cdot \dfrac{N-K}{N}$ (a sorrend kétféle), visszatevés nélkül $\dfrac{K \cdot (N-K)}{\binom{N}{2}}$.` },
      { h: 'Binomiális és hipergeometriai eloszlás', level: 'emelt',
        b: R`Egy **valószínűségi változó** ($\xi$) a véletlen kísérlet kimeneteléhez egy számot rendel (például a kihúzott piros golyók számát).\n\n**Binomiális eloszlás (visszatevéses modell).** Ha $n$ egymástól független kísérletet végzünk, és mindegyikben $p$ a siker valószínűsége, akkor a sikerek száma $\xi$ $n$ és $p$ paraméterű binomiális eloszlású:\n$$P(\xi = k) = \binom{n}{k} p^k (1-p)^{n-k}, \qquad k = 0; 1; \dots; n.$$\nMiért? Egy rögzített sorrend, amelyben pontosan $k$ sikeres kísérlet van, $p^k (1-p)^{n-k}$ valószínűségű (a kísérletek függetlenek), és $\binom{n}{k}$-féleképpen választhatjuk ki, hányadik kísérletek legyenek a sikeresek. A valószínűségek összege $1$ (binomiális tétel). Várható értéke $E(\xi) = n \cdot p$.\n\n**Hipergeometriai eloszlás (visszatevés nélküli modell).** $N$ elemből $K$ kiemelt (például selejtes); $n$ elemet visszatevés nélkül kiválasztva a kiemeltek száma $\xi$:\n$$P(\xi = k) = \frac{\binom{K}{k} \binom{N-K}{n-k}}{\binom{N}{n}}.$$\nA kedvező esetek: $k$ elemet a $K$ kiemeltből, $n - k$ elemet a többiből. (Kiegészítés: $E(\xi) = n \cdot \dfrac{K}{N}$.)\n\n**Különbség:** a binomiális eloszlásnál a kísérletek függetlenek (visszatevés, vagy nagyon nagy sokaság), a hipergeometrikusnál a húzások egymástól függnek. Az érettségin konkrét valószínűségeket kell tudnod számolni ezekkel (például „pontosan $k$”, „legalább $k$” vagy „legfeljebb $k$” formában kitűzött kérdésekre).` },
      { h: 'Várható érték',
        b: R`Ha az $\xi$ valószínűségi változó az $x_1; x_2; \dots; x_m$ értékeket $p_1; p_2; \dots; p_m$ valószínűséggel veszi fel ($p_1 + \dots + p_m = 1$), akkor a **várható értéke**\n$$E(\xi) = x_1 p_1 + x_2 p_2 + \dots + x_m p_m.$$\nA várható érték azt mutatja, hogy a kísérlet sokszori ismétlésekor az értékek átlaga mihez közelít. Nem kell, hogy a változó valóban felvegye ezt az értéket: egy szabályos kockadobás várható értéke $\dfrac{1 + 2 + 3 + 4 + 5 + 6}{6} = 3{,}5$.\n\n**Játékok:** a **nyereség** várható értéke az $E(\text{nyeremény}) - \text{részvételi díj}$. Egy játék **igazságos**, ha ez $0$; ha negatív, hosszú távon a játékos veszít. Ellenőrzés: a valószínűségek összege legyen $1$.\n\nKiegészítés: $E(a\xi + b) = a E(\xi) + b$, és a binomiális eloszlás várható értéke $n p$.` },
      { h: 'Feltételes valószínűség', level: 'emelt',
        b: R`Az $A$ esemény **feltételes valószínűsége** a $B$ eseményre nézve (ha $P(B) > 0$): annak a valószínűsége, hogy $A$ bekövetkezik, feltéve, hogy $B$ már bekövetkezett:\n$$P(A \mid B) = \frac{P(A \cdot B)}{P(B)}.$$\nSzemlélet: $B$ az „új eseménytér”; klasszikus modellben $P(A \mid B) = \dfrac{|A \cdot B|}{|B|}$, azaz a $B$ esetei közül hány kedvező $A$-nak. Táblázatból közvetlenül kiolvasható: a feltételnek megfelelő sor vagy oszlop összegével osztunk.\n\n**Szorzási szabály:** $P(A \cdot B) = P(B) \cdot P(A \mid B)$. Ezzel egymás után bekövetkező, egymástól függő események valószínűsége is számolható (például visszatevés nélküli húzásnál); **fa-diagramon** az ágak valószínűségeit szorozzuk.\n\n**Függetlenség:** $A$ és $B$ pontosan akkor független, ha $P(A \mid B) = P(A)$, vagyis a feltétel nem változtat a valószínűségen.\n\nKiegészítés: ha a $B$ és $\overline{B}$ egymás komplementerei, akkor $P(A) = P(B) P(A \mid B) + P(\overline{B}) P(A \mid \overline{B})$ (a fa-diagram ágainak összege).\n\n**Figyelj:** $P(A \mid B)$ és $P(B \mid A)$ általában különböző: például $P(\text{sportol} \mid \text{fiú}) \ne P(\text{fiú} \mid \text{sportol})$. A feltétel mindig a szó „feltéve, hogy” után álló esemény, ez kerül a nevezőbe.` }
    ],
    examples: [
      { t: 'Két kockával: összegszabály, függetlenség',
        p: R`Két szabályos kockával dobunk. Az $A$ esemény: a dobott számok összege $8$; a $B$ esemény: mindkét dobott szám páros. a) Mennyi $P(A + B)$? b) Mennyi annak a valószínűsége, hogy sem $A$, sem $B$ nem következik be? c) Független-e $A$ és $B$?`,
        steps: [R`Az összes eset (rendezett pár): $6 \cdot 6 = 36$, ezek egyformán valószínűek, így használhatjuk a klasszikus modellt.`,
          R`$A$ kedvező esetei: $(2;6),\ (3;5),\ (4;4),\ (5;3),\ (6;2)$, ez $5$ eset, $P(A) = \dfrac{5}{36}$. $B$: mindkét szám a $\{2; 4; 6\}$ halmazból, $3 \cdot 3 = 9$ eset, $P(B) = \dfrac{9}{36} = \dfrac{1}{4}$.`,
          R`$A \cdot B$: az összeg $8$ és mindkét szám páros: $(2;6),\ (4;4),\ (6;2)$, $3$ eset, $P(A \cdot B) = \dfrac{3}{36} = \dfrac{1}{12}$.`,
          R`a) Összegszabály: $P(A + B) = \dfrac{5}{36} + \dfrac{9}{36} - \dfrac{3}{36} = \dfrac{11}{36}$.`,
          R`b) A „sem $A$, sem $B$” esemény $\overline{A + B}$: $P = 1 - \dfrac{11}{36} = \dfrac{25}{36}$.`,
          R`c) $P(A) \cdot P(B) = \dfrac{5}{36} \cdot \dfrac{9}{36} = \dfrac{5}{144}$, de $P(A \cdot B) = \dfrac{1}{12} = \dfrac{12}{144}$. A két érték különbözik, tehát $A$ és $B$ nem függetlenek.`],
        ans: R`$P(A + B) = \dfrac{11}{36} \approx 0{,}306$; annak valószínűsége, hogy sem $A$, sem $B$ nem következik be, $\dfrac{25}{36}$; az $A$ és $B$ esemény nem független.`,
        checks: [['5+9-3', '11'], ['(5+9-3)/36', '11/36'], ['1-11/36', '25/36'], ['3/36', '1/12'], ['5/36*9/36', '5/144'], ['3/36', '12/144']] },
      { t: 'Mintavétel, „legalább egy” és komplementer',
        p: R`Egy dobozban $20$ izzó van, ebből $4$ hibás. Találomra kiveszünk egyszerre $3$ izzót. a) Mennyi a valószínűsége, hogy pontosan egy hibás van közöttük? b) Mennyi a valószínűsége, hogy van közöttük hibás? c) Mennyi lenne b) válasza, ha az izzókat egyenként húznánk ki, és minden alkalommal visszatennénk?`,
        steps: [R`Az összes eset: $\dbinom{20}{3} = \dfrac{20 \cdot 19 \cdot 18}{6} = 1140$ (az egyszerre kihúzás a sorrendtől független, minden hármas egyformán valószínű).`,
          R`a) Pontosan egy hibás: $1$ hibásat a $4$-ből, $2$ jót a $16$ jóból: $\dbinom{4}{1} \cdot \dbinom{16}{2} = 4 \cdot 120 = 480$. $P = \dfrac{480}{1140} = \dfrac{8}{19} \approx 0{,}421$.`,
          R`b) A „legalább egy hibás” komplementere: „mind a három jó”. $\dbinom{16}{3} = 560$, így $P(\text{mind jó}) = \dfrac{560}{1140} = \dfrac{28}{57}$.`,
          R`$P(\text{van hibás}) = 1 - \dfrac{28}{57} = \dfrac{29}{57} \approx 0{,}509$.`,
          R`c) Visszatevéssel a húzások függetlenek, egy húzásnál a jó izzó valószínűsége $\dfrac{16}{20} = 0{,}8$. $P(\text{mind jó}) = 0{,}8^3 = 0{,}512$, így $P(\text{van hibás}) = 1 - 0{,}512 = 0{,}488$.`,
          R`Ellenőrzés: a b) rész két valószínűsége $\dfrac{28}{57} + \dfrac{29}{57} = 1$. A b) és c) eredménye közel van egymáshoz, de nem egyenlő: ez a két mintavételi modell különbségét mutatja.`],
        ans: R`a) $\dfrac{8}{19} \approx 0{,}421$; b) $\dfrac{29}{57} \approx 0{,}509$; c) $0{,}488$.`,
        checks: [['binom(20;3)', '1140'], ['4*binom(16;2)', '480'], ['480/1140', '8/19'], ['binom(16;3)/binom(20;3)', '28/57'], ['1-binom(16;3)/binom(20;3)', '29/57'], ['1-(16/20)^3', '0,488'], ['20*19*18/6', '1140']] },
      { t: 'Binomiális eloszlás (emelt)',
        p: R`Egy üzemben a termékek $20\%$-a másodosztályú, a termékek minősége egymástól független. Véletlenszerűen kiválasztunk $5$ terméket (a gyártás nagy, a mintavételt visszatevésesnek tekintjük). a) Mennyi a valószínűsége, hogy pontosan $2$ másodosztályú van a mintában? b) Mennyi a valószínűsége, hogy legalább egy? c) Mennyi a valószínűsége, hogy legfeljebb $2$? d) Mennyi a másodosztályú termékek számának várható értéke?`,
        steps: [R`A sikerek ($\xi$: másodosztályú termékek) száma binomiális eloszlású: $n = 5$, $p = 0{,}2$, $1 - p = 0{,}8$.`,
          R`a) $P(\xi = 2) = \dbinom{5}{2} \cdot 0{,}2^2 \cdot 0{,}8^3 = 10 \cdot 0{,}04 \cdot 0{,}512 = 0{,}2048$.`,
          R`b) A „legalább egy” komplementere: egy sem. $P(\xi = 0) = 0{,}8^5 = 0{,}32768$, ezért $P(\xi \ge 1) = 1 - 0{,}32768 = 0{,}67232$.`,
          R`c) $P(\xi = 1) = \dbinom{5}{1} \cdot 0{,}2 \cdot 0{,}8^4 = 5 \cdot 0{,}2 \cdot 0{,}4096 = 0{,}4096$. $P(\xi \le 2) = 0{,}32768 + 0{,}4096 + 0{,}2048 = 0{,}94208$.`,
          R`d) $E(\xi) = n \cdot p = 5 \cdot 0{,}2 = 1$.`,
          R`Ellenőrzés: a c) válasz $0{,}94208 > 0{,}2048$ és kisebb $1$-nél, és $P(\xi \ge 1) = 0{,}67232 \ge P(\xi = 2)$ ésszerű.`],
        ans: R`a) $0{,}2048$; b) $0{,}67232$; c) $0{,}94208$; d) $1$ termék.`,
        checks: [['binom(5;2)*0,2^2*0,8^3', '0,2048'], ['0,8^5', '0,32768'], ['1-0,8^5', '0,67232'], ['5*0,2*0,8^4', '0,4096'], ['0,32768+0,4096+0,2048', '0,94208'], ['5*0,2', '1']] },
      { t: 'Feltételes valószínűség táblázatból (emelt)',
        p: R`Egy $200$ fős évfolyamon $120$ fiú és $80$ lány van. A fiúk közül $90$, a lányok közül $40$ sportol rendszeresen. Találomra kiválasztunk egy tanulót. a) Mennyi a valószínűsége, hogy sportoló? b) Ha tudjuk, hogy a kiválasztott sportoló, mennyi a valószínűsége, hogy fiú? c) Mennyi a valószínűsége, hogy sportoló, ha tudjuk, hogy lány? d) Független-e a „fiú” és a „sportol” esemény?`,
        steps: [R`Táblázat: fiú: sportol $90$, nem sportol $30$; lány: sportol $40$, nem sportol $40$. A sportolók száma $90 + 40 = 130$.`,
          R`a) $P(S) = \dfrac{130}{200} = \dfrac{13}{20}$.`,
          R`b) A feltétel: „sportoló”, ez $130$ eset, ebből fiú $90$: $P(F \mid S) = \dfrac{90}{130} = \dfrac{9}{13}$. (Definícióval: $\dfrac{P(F \cdot S)}{P(S)} = \dfrac{90/200}{130/200}$.)`,
          R`c) A feltétel: „lány”, $80$ eset, ebből sportol $40$: $P(S \mid L) = \dfrac{40}{80} = \dfrac{1}{2}$.`,
          R`d) $P(F) = \dfrac{120}{200} = \dfrac{3}{5}$, így $P(F) \cdot P(S) = \dfrac{3}{5} \cdot \dfrac{13}{20} = \dfrac{39}{100}$. Viszont $P(F \cdot S) = \dfrac{90}{200} = \dfrac{45}{100}$. A kettő nem egyenlő, tehát a két esemény nem független. (Ugyanezt mutatja, hogy $P(S \mid F) = \dfrac{90}{120} = \dfrac{3}{4} \ne P(S) = \dfrac{13}{20}$.)`],
        ans: R`a) $\dfrac{13}{20} = 0{,}65$; b) $\dfrac{9}{13} \approx 0{,}692$; c) $\dfrac{1}{2}$; d) nem függetlenek.`,
        checks: [['90+40', '130'], ['130/200', '13/20'], ['90/130', '9/13'], ['(90/200)/(130/200)', '9/13'], ['40/80', '1/2'], ['3/5*13/20', '39/100'], ['90/200', '45/100'], ['(90/200)/(120/200)', '3/4']] },
      { t: 'Geometriai valószínűség: találkozás',
        p: R`Két barát megbeszélte, hogy $12$ és $13$ óra között találkoznak a téren. Mindketten véletlenszerű időpontban érkeznek, egymástól függetlenül, és a másikra legfeljebb $15$ percet várnak. Mennyi a valószínűsége, hogy találkoznak?`,
        steps: [R`Mérjük az érkezést percekben $12$ órától: az egyik barát $x$, a másik $y$ időpontban érkezik, $0 \le x \le 60$, $0 \le y \le 60$. Az $(x; y)$ pont véletlenszerűen esik egy $60 \times 60$-as négyzetbe, amelynek területe $3600$.`,
          R`Találkoznak, ha $|x - y| \le 15$. Ez a négyzet átlója körüli sáv.`,
          R`A komplementer esetben $|x - y| > 15$: a négyzet két sarkában egy-egy egyenlő szárú derékszögű háromszög, befogóik $60 - 15 = 45$ hosszúak. Területük együtt $2 \cdot \dfrac{45^2}{2} = 45^2 = 2025$.`,
          R`$P(\text{nem találkoznak}) = \dfrac{2025}{3600} = \dfrac{9}{16}$, így $P(\text{találkoznak}) = 1 - \dfrac{9}{16} = \dfrac{7}{16}$.`,
          R`Ellenőrzés a kedvező területtel: $3600 - 2025 = 1575$, és $\dfrac{1575}{3600} = \dfrac{7}{16}$.`],
        ans: R`A találkozás valószínűsége $\dfrac{7}{16} = 0{,}4375$.`,
        checks: [['45^2', '2025'], ['2*45^2/2', '2025'], ['2025/3600', '9/16'], ['1-9/16', '7/16'], ['(3600-2025)/3600', '7/16'], ['1-(45/60)^2', '7/16']] },
      { t: 'Várható érték: nyereményjáték',
        p: R`Egy játékban szabályos dobókockával dobunk. Ha hatost dobunk, $500$ Ft-ot, ha ötöst, $100$ Ft-ot kapunk, minden más esetben semmit. a) Mennyi a nyeremény várható értéke? b) A részvételi díj $120$ Ft. Mennyi a nyereség várható értéke? Milyen díjnál lenne igazságos a játék?`,
        steps: [R`A nyeremény $\xi$ értékei: $500$ ($p = \dfrac{1}{6}$), $100$ ($p = \dfrac{1}{6}$), $0$ ($p = \dfrac{4}{6}$); a valószínűségek összege $1$.`,
          R`a) $E(\xi) = 500 \cdot \dfrac{1}{6} + 100 \cdot \dfrac{1}{6} + 0 \cdot \dfrac{4}{6} = \dfrac{600}{6} = 100$ Ft.`,
          R`b) A nyereség várható értéke $100 - 120 = -20$ Ft: átlagosan minden játéknál $20$ Ft-ot veszítene a játékos.`,
          R`A játék akkor igazságos, ha a díj egyenlő a nyeremény várható értékével: $100$ Ft.`,
          R`Ellenőrzés: ha a díj $100$ Ft, a nyereség várható értéke $100 - 100 = 0$.`],
        ans: R`A nyeremény várható értéke $100$ Ft, a nyereségé $-20$ Ft; a játék $100$ Ft részvételi díjnál lenne igazságos.`,
        checks: [['500*1/6+100*1/6+0*4/6', '100'], ['(500+100)/6', '100'], ['100-120', '-20'], ['1/6+1/6+4/6', '1']] }
    ],
    sims: ['binomialis', 'felteteles', 'monte-carlo', 'kombinatorika', 'venn'],
    mistakes: [R`Két kockánál az összegeket tekinted egyformán valószínűnek: a $36$ rendezett pár a „jó” eseménytér, az összegek ($2$-től $12$-ig) nem egyformán valószínűek.`,
      R`„Legalább egy” típusú kérdésnél eseteket sorolsz fel és adsz össze: sokkal biztosabb a komplementer, $1 - P(\text{egy sem})$.`,
      R`Az egymást kizáró és a független események fogalmát összekeveri: ha két (nem lehetetlen) esemény kizárja egymást, akkor biztosan nem független.`,
      R`Az összegszabálynál elfelejted levonni a közös részt: $P(A + B) = P(A) + P(B) - P(A \cdot B)$; csak kizáró eseményeknél marad el a harmadik tag.`,
      R`Visszatevés nélküli húzásnál a nevezőt nem csökkented: a második húzásnál már eggyel kevesebb golyó van ($\frac{K}{N} \cdot \frac{K-1}{N-1}$, nem $\left(\frac{K}{N}\right)^2$).`,
      R`A binomiális eloszlásnál kihagyod a $\binom{n}{k}$ tényezőt, vagy a kitevők nem adnak $n$-t ($k + (n-k) = n$ kell).`,
      R`A feltételes valószínűségnél a feltételt és az eseményt felcseréled: $P(A \mid B)$ nevezőjében $P(B)$ áll, a feltétel valószínűsége.`,
      R`Geometriai valószínűségnél különböző mértéket osztasz (például hosszúságot területtel), vagy a nem megfelelő tartományt veszed teljes tartománynak.`,
      R`A várható értéknél a valószínűségek összege nem $1$; vagy azt hiszed, a várható érték egy tényleges, felvehető érték.`],
    exam: R`Közép- és emelt szinten is követelmény az esemény, eseménytér, elemi esemény, események összege és szorzata, a komplementer, az egymást kizáró és a független események fogalma; a klasszikus (Laplace-) modell és a komplementer valószínűsége; a relatív gyakoriság és a valószínűség szemléletes kapcsolata; a geometriai valószínűség; valószínűségek számítása visszatevéses és visszatevés nélküli mintavételnél; a várható érték fogalma és alkalmazása. Emelt szinten ezen felül a feltételes valószínűség definíciója és alkalmazása, a binomiális eloszlás (visszatevéses modell) és a hipergeometriai eloszlás (visszatevés nélküli modell) értelmezése, és ezekkel konkrét valószínűségek kiszámítása.`,
    cheat: [R`P(A) = \dfrac{k}{n} = \dfrac{\text{kedvező}}{\text{összes}}, \qquad P(\overline{A}) = 1 - P(A)`,
      R`P(A + B) = P(A) + P(B) - P(A \cdot B)`,
      R`A,\ B \text{ független} \iff P(A \cdot B) = P(A) \cdot P(B)`,
      R`P(A) = \dfrac{\text{kedvező tartomány mértéke}}{\text{teljes tartomány mértéke}}`,
      R`P(\xi = k) = \dbinom{n}{k} p^k (1-p)^{n-k}, \qquad E(\xi) = n p`,
      R`P(\xi = k) = \dfrac{\dbinom{K}{k}\dbinom{N-K}{n-k}}{\dbinom{N}{n}}`,
      R`E(\xi) = x_1 p_1 + x_2 p_2 + \dots + x_m p_m`,
      R`P(A \mid B) = \dfrac{P(A \cdot B)}{P(B)}, \qquad P(A \cdot B) = P(B) \cdot P(A \mid B)`,
      R`P(\text{legalább egy}) = 1 - P(\text{egy sem})`],
    cheatChecks: [['binom(5;2)*(1/2)^5', '10/32'], ['1-(5/6)^2', '11/36'], ['binom(4;2)*binom(6;1)/binom(10;3)', '36/120'], ['5*0,2', '1'], ['(1+2+3+4+5+6)/6', '3,5'], ['(1/6)^3', '1/216']],
    terms: ['esemény', 'eseménytér', 'elemi esemény', 'összeg esemény', 'szorzat esemény', 'komplementer esemény', 'egymást kizáró események', 'független események', 'klasszikus modell', 'geometriai valószínűség', 'visszatevéses mintavétel', 'visszatevés nélküli mintavétel', 'binomiális eloszlás', 'hipergeometriai eloszlás', 'várható érték', 'feltételes valószínűség', 'relatív gyakoriság', 'legalább egy']
  };

  var PQ = [[1, 2], [1, 5], [1, 4], [1, 10], [3, 10], [1, 6], [2, 5]];

  def('v-vsz-1', 'valoszinuseg', 'valszam', 1, 'Klasszikus és geometriai valószínűség', function (r) {
    var kind = r.int(0, 4);
    if (kind <= 1) {
      var p = r.int(2, 9), k = r.int(2, 9), z = r.int(1, 8), N = p + k + z, cols = [['piros', p], ['kék', k], ['zöld', z]], c = r.pick(cols);
      var cnt = c[1], neg = kind === 1, num = neg ? N - cnt : cnt;
      return {
        q: R`Egy dobozban $${p}$ piros, $${k}$ kék és $${z}$ zöld golyó van. Találomra kihúzunk egyet. Mennyi a valószínűsége, hogy a golyó ${neg ? 'nem ' : ''}${c[0]}? Törtként add meg.`,
        answer: { type: 'num', value: num / N }, ansTex: K.q(num, N),
        verify: neg ? `1-${cnt}/${N}` : `${cnt}/${N}`,
        tip1: R`Klasszikus modell: a kedvező esetek száma osztva az összes esettel.`,
        tip2: neg ? R`Az összes golyó száma $${N}$; a ${c[0]} színűek száma $${cnt}$, a többi kedvező.` : R`Az összes golyó száma $${N}$.`,
        sol: [R`Az összes eset: $${p} + ${k} + ${z} = ${N}$.`, neg ? R`Kedvező: $${N} - ${cnt} = ${num}$ (vagy komplementerrel: $1 - \dfrac{${cnt}}{${N}}$).` : R`Kedvező: a ${c[0]} golyók, $${cnt}$ db.`, R`$P = \dfrac{${num}}{${N}} = ${K.q(num, N)}$`]
      };
    }
    if (kind === 2) {
      var n = r.int(2, 3), val = (Math.pow(6, n) - Math.pow(5, n)) / Math.pow(6, n);
      return {
        q: R`$${n}$ szabályos dobókockával egyszerre dobunk. Mennyi a valószínűsége, hogy van köztük hatos? Törtként add meg.`,
        answer: { type: 'num', value: val }, ansTex: K.q(Math.pow(6, n) - Math.pow(5, n), Math.pow(6, n)),
        verify: `1-(5/6)^${n}`,
        tip1: R`Használd a komplementer eseményt: „nincs hatos”.`,
        tip2: R`Egy kockánál $\dfrac{5}{6}$ a valószínűsége, hogy nem hatos; a kockák függetlenek.`,
        sol: [R`$P(\text{nincs hatos}) = \left(\dfrac{5}{6}\right)^{${n}} = \dfrac{${Math.pow(5, n)}}{${Math.pow(6, n)}}$`, R`$P(\text{van hatos}) = 1 - \dfrac{${Math.pow(5, n)}}{${Math.pow(6, n)}} = ${K.q(Math.pow(6, n) - Math.pow(5, n), Math.pow(6, n))}$`]
      };
    }
    if (kind === 3) {
      var d = r.int(1, 3), L = r.int(2 * d + 4, 2 * d + 12), M = r.int(2 * d + 3, 2 * d + 9), kv = (L - 2 * d) * (M - 2 * d);
      return {
        q: R`Egy $${L}$ cm $\times$ $${M}$ cm-es téglalap alakú céltáblára véletlenszerűen lövünk (a lövés minden pontja egyformán valószínű). Mennyi a valószínűsége, hogy a találat a téglalap oldalaitól legalább $${d}$ cm távolságra van? Törtként add meg.`,
        answer: { type: 'num', value: kv / (L * M) }, ansTex: K.q(kv, L * M),
        verify: `1-(${L}*${M}-(${L}-${2 * d})*(${M}-${2 * d}))/(${L}*${M})`,
        tip1: R`Geometriai valószínűség: a kedvező terület osztva a teljes területtel.`,
        tip2: R`A kedvező pontok egy kisebb téglalapot alkotnak, amelynek mindkét oldala $${2 * d}$ cm-rel rövidebb.`,
        sol: [R`Teljes terület: $${L} \cdot ${M} = ${L * M}$ $\text{cm}^2$.`, R`Kedvező terület: $(${L} - ${2 * d})(${M} - ${2 * d}) = ${L - 2 * d} \cdot ${M - 2 * d} = ${kv}$ $\text{cm}^2$.`, R`$P = \dfrac{${kv}}{${L * M}} = ${K.q(kv, L * M)}$`]
      };
    }
    var Ls = r.int(8, 30), a = r.int(0, Ls - 4), b = r.int(a + 2, Ls);
    return {
      q: R`Egy $${Ls}$ cm hosszú szakaszon véletlenszerűen kiválasztunk egy pontot. Mennyi a valószínűsége, hogy a pont a szakasz egyik végpontjától mért $${a}$ és $${b}$ cm közötti részre esik? Törtként add meg.`,
      answer: { type: 'num', value: (b - a) / Ls }, ansTex: K.q(b - a, Ls),
      verify: `(${b}-${a})/${Ls}`,
      tip1: R`Geometriai valószínűség: a kedvező szakasz hossza osztva a teljes hosszal.`,
      tip2: R`A kedvező rész hossza $${b} - ${a}$.`,
      sol: [R`A kedvező szakasz hossza: $${b} - ${a} = ${b - a}$ cm.`, R`$P = \dfrac{${b - a}}{${Ls}} = ${K.q(b - a, Ls)}$`]
    };
  });

  def('v-vsz-2', 'valoszinuseg', 'valszam', 2, 'Visszatevéses és visszatevés nélküli húzás', function (r) {
    var p = r.int(2, 8), q = r.int(2, 8), N = p + q, kind = r.int(0, 3), num, den, ver, how, sol;
    var base = R`Egy urnában $${p}$ piros és $${q}$ kék golyó van. Két golyót húzunk`;
    if (kind === 0) { num = p * p; den = N * N; ver = `(${p}/${N})*(${p}/${N})`; how = R`egymás után, minden húzás után visszatéve a golyót. Mennyi a valószínűsége, hogy mindkettő piros?`; sol = [R`A húzások függetlenek, egy húzásnál $\dfrac{${p}}{${N}}$ a piros valószínűsége.`, R`$P = \left(\dfrac{${p}}{${N}}\right)^2 = \dfrac{${num}}{${den}} = ${K.q(num, den)}$`]; }
    else if (kind === 1) { num = p * (p - 1); den = N * (N - 1); ver = `binom(${p};2)/binom(${N};2)`; how = R`egyszerre (visszatevés nélkül). Mennyi a valószínűsége, hogy mindkettő piros?`; sol = [R`Az összes eset: $\dbinom{${N}}{2} = ${N * (N - 1) / 2}$, a kedvező: $\dbinom{${p}}{2} = ${p * (p - 1) / 2}$.`, R`$P = \dfrac{${p * (p - 1) / 2}}{${N * (N - 1) / 2}} = ${K.q(num, den)}$`, R`Ugyanez sorrenddel: $\dfrac{${p}}{${N}} \cdot \dfrac{${p - 1}}{${N - 1}}$.`]; }
    else if (kind === 2) { num = 2 * p * q; den = N * (N - 1); ver = `${p}*${q}/binom(${N};2)`; how = R`egyszerre (visszatevés nélkül). Mennyi a valószínűsége, hogy különböző színűek?`; sol = [R`Összes eset: $\dbinom{${N}}{2} = ${N * (N - 1) / 2}$; kedvező: egy piros és egy kék, $${p} \cdot ${q} = ${p * q}$.`, R`$P = \dfrac{${p * q}}{${N * (N - 1) / 2}} = ${K.q(num, den)}$`]; }
    else { num = 2 * p * q; den = N * N; ver = `${p}/${N}*${q}/${N}+${q}/${N}*${p}/${N}`; how = R`egymás után, minden húzás után visszatéve a golyót. Mennyi a valószínűsége, hogy különböző színűek?`; sol = [R`Két sorrend lehet: piros-kék vagy kék-piros, mindegyik valószínűsége $\dfrac{${p}}{${N}} \cdot \dfrac{${q}}{${N}}$.`, R`$P = 2 \cdot \dfrac{${p}}{${N}} \cdot \dfrac{${q}}{${N}} = \dfrac{${num}}{${den}} = ${K.q(num, den)}$`]; }
    return {
      q: base + ' ' + how + R` Törtként add meg.`,
      answer: { type: 'num', value: num / den }, ansTex: K.q(num, den),
      verify: ver,
      tip1: kind === 0 || kind === 3 ? R`Visszatevésnél a húzások függetlenek, a valószínűségeket szorozni lehet.` : R`Visszatevés nélkül a második húzásnál már eggyel kevesebb golyó van; használhatsz kombinációkat is.`,
      tip2: R`Az összes golyó száma $${N}$.`,
      sol: sol
    };
  });

  def('v-vsz-3', 'valoszinuseg', 'valszam', 2, 'Binomiális eloszlás', function (r) {
    var kind = r.int(0, 3) === 0 ? 1 : 0, pr, n, k, a, b;
    if (kind === 1) {
      pr = r.pick([[1, 2], [1, 5], [1, 4], [1, 10], [3, 10], [2, 5]]); a = pr[0]; b = pr[1]; n = r.int(5, 20);
      var e = n * a / b;
      return {
        q: R`Egy kísérletben a siker valószínűsége $${K.q(a, b)}$. A kísérletet egymástól függetlenül végezzük, a kísérletek száma $${n}$. Átlagosan hány sikeres kísérlet várható? (A binomiális eloszlás várható értéke.)`,
        answer: { type: 'num', value: e }, ansTex: K.T(e),
        verify: `${n}*${a}/${b}`,
        tip1: R`A binomiális eloszlás várható értéke $n \cdot p$.`,
        tip2: R`Itt $n = ${n}$ és $p = ${K.q(a, b)}$.`,
        sol: [R`$E(\xi) = n \cdot p = ${n} \cdot ${K.q(a, b)} = ${K.T(e)}$`]
      };
    }
    pr = r.pick(PQ); a = pr[0]; b = pr[1]; n = r.int(4, 8); k = r.int(0, n);
    var v = C(n, k) * Math.pow(a, k) * Math.pow(b - a, n - k) / Math.pow(b, n);
    return {
      q: R`Egy kísérletben a siker valószínűsége $${K.q(a, b)}$, a kísérletek egymástól függetlenek. Mennyi a valószínűsége, hogy $${n}$ kísérletből pontosan $${k}$ sikeres? Három tizedesjegyre kerekítve add meg.`,
      answer: { type: 'num', value: v, tol: 0.00051 }, ansTex: R`\approx ${K.T(v, 3)}`,
      verify: `binom(${n};${k})*${a}^${k}*${b - a}^${n - k}/${b}^${n}`,
      tip1: R`Binomiális eloszlás: $P(\xi = k) = \binom{n}{k} p^k (1-p)^{n-k}$.`,
      tip2: R`Itt $n = ${n}$, $k = ${k}$, $p = ${K.q(a, b)}$, $1 - p = ${K.q(b - a, b)}$.`,
      sol: [R`$P(\xi = ${k}) = \dbinom{${n}}{${k}} \cdot \left(${K.q(a, b)}\right)^{${k}} \cdot \left(${K.q(b - a, b)}\right)^{${n - k}}$`, R`$= ${C(n, k)} \cdot \dfrac{${Math.pow(a, k)} \cdot ${Math.pow(b - a, n - k)}}{${Math.pow(b, n)}} \approx ${K.T(v, 3)}$`]
    };
  });

  def('v-vsz-4', 'valoszinuseg', 'valszam', 2, 'Várható érték', function (r) {
    var kind = r.int(0, 2);
    if (kind === 2) {
      var vals = [r.int(0, 3), r.int(4, 7), r.int(8, 12), r.int(13, 20)], cn = [r.int(1, 6), r.int(1, 6), r.int(1, 6), 0];
      cn[3] = 20 - cn[0] - cn[1] - cn[2];
      var e2 = (vals[0] * cn[0] + vals[1] * cn[1] + vals[2] * cn[2] + vals[3] * cn[3]) / 20;
      var tab = vals.map(function (x, i) { return 'P(\\xi = ' + x + ') = \\dfrac{' + cn[i] + '}{20}'; }).join(',\\ ');
      return {
        q: R`Egy $\xi$ valószínűségi változó eloszlása: $${tab}$. Mennyi $\xi$ várható értéke?`,
        answer: { type: 'num', value: e2 }, ansTex: K.T(e2, 4),
        verify: `(${vals[0]}*${cn[0]}+${vals[1]}*${cn[1]}+${vals[2]}*${cn[2]}+${vals[3]}*${cn[3]})/20`,
        tip1: R`A várható érték az értékek és valószínűségeik szorzatának összege.`,
        tip2: R`A valószínűségek közös nevezője $20$; először a számlálókat szorozd az értékekkel.`,
        sol: [R`$E(\xi) = \dfrac{${vals[0]} \cdot ${cn[0]} + ${vals[1]} \cdot ${cn[1]} + ${vals[2]} \cdot ${cn[2]} + ${vals[3]} \cdot ${cn[3]}}{20}$`, R`$= \dfrac{${e2 * 20}}{20} = ${K.T(e2, 4)}$`]
      };
    }
    var t = r.int(2, 10), W = 60 * t, w6 = 10 * r.int(1, 6 * t - 1), w5 = W - w6, E = W / 6;
    if (kind === 0) {
      return {
        q: R`Szabályos dobókockával dobunk. Hatost dobva $${w6}$ Ft-ot, ötöst dobva $${w5}$ Ft-ot kapunk, minden más esetben semmit. Mennyi a nyeremény várható értéke forintban?`,
        answer: { type: 'num', value: E }, ansTex: K.T(E) + R`\ \text{Ft}`,
        verify: `(${w6}*1+${w5}*1+0*4)/6`,
        tip1: R`A várható érték: minden lehetséges nyereményt szorozz a valószínűségével, és add össze.`,
        tip2: R`A hatos és az ötös valószínűsége is $\dfrac{1}{6}$, a többi esetnek $\dfrac{4}{6}$.`,
        sol: [R`$E = ${w6} \cdot \dfrac{1}{6} + ${w5} \cdot \dfrac{1}{6} + 0 \cdot \dfrac{4}{6}$`, R`$E = \dfrac{${W}}{6} = ${K.T(E)}$ Ft.`]
      };
    }
    var fee = E + r.nz(-30, 30), prof = E - fee;
    if (fee <= 0) fee = E + 10, prof = -10;
    return {
      q: R`Szabályos dobókockával dobunk. Hatost dobva $${w6}$ Ft-ot, ötöst dobva $${w5}$ Ft-ot kapunk, minden más esetben semmit. A részvételi díj $${fee}$ Ft. Mennyi a nyereség (a nyeremény és a díj különbsége) várható értéke forintban?`,
      answer: { type: 'num', value: prof }, ansTex: K.T(prof) + R`\ \text{Ft}`,
      verify: `(${w6}+${w5})/6-${fee}`,
      tip1: R`A nyereség várható értéke a nyeremény várható értéke mínusz a részvételi díj.`,
      tip2: R`A nyeremény várható értéke $\dfrac{${w6} + ${w5}}{6}$.`,
      sol: [R`$E(\text{nyeremény}) = \dfrac{${w6} + ${w5}}{6} = ${K.T(E)}$ Ft.`, R`$E(\text{nyereség}) = ${K.T(E)} - ${fee} = ${K.T(prof)}$ Ft.`, prof < 0 ? R`A várható érték negatív, a játék a játékosnak hosszú távon veszteséges.` : R`A várható érték pozitív, a játék a játékosnak hosszú távon nyereséges.`]
    };
  });

  def('v-vsz-5', 'valoszinuseg', 'valszam', 3, 'Binomiális: legalább egy, legalább kettő, legfeljebb egy', function (r) {
    var pr = r.pick(PQ), a = pr[0], b = pr[1], n = r.int(4, 8), kind = r.int(0, 2), ctx = r.int(0, 1);
    var q0 = Math.pow(b - a, n) / Math.pow(b, n), q1 = n * a * Math.pow(b - a, n - 1) / Math.pow(b, n), val, ver, ev, pt = K.q(a, b), qt = K.q(b - a, b), sol;
    var evs = [['legalább egy selejtes van a kiválasztottak között', 'legalább egy találata van'], ['legalább két selejtes van a kiválasztottak között', 'legalább két találata van'], ['legfeljebb egy selejtes van a kiválasztottak között', 'legfeljebb egy találata van']];
    if (kind === 0) {
      val = 1 - q0; ver = `1-${b - a}^${n}/${b}^${n}`;
      sol = [R`A komplementer: egy sem. $P(\xi = 0) = \left(${qt}\right)^{${n}} \approx ${K.T(q0, 5)}$.`, R`$P(\xi \ge 1) = 1 - ${K.T(q0, 5)} \approx ${K.T(val, 3)}$.`];
    } else if (kind === 1) {
      val = 1 - q0 - q1; ver = `1-${b - a}^${n}/${b}^${n}-${n}*${a}*${b - a}^${n - 1}/${b}^${n}`;
      sol = [R`A komplementer: $\xi \le 1$. $P(\xi = 0) = \left(${qt}\right)^{${n}} \approx ${K.T(q0, 5)}$.`, R`$P(\xi = 1) = ${n} \cdot ${pt} \cdot \left(${qt}\right)^{${n - 1}} \approx ${K.T(q1, 5)}$.`, R`$P(\xi \ge 2) = 1 - ${K.T(q0, 5)} - ${K.T(q1, 5)} \approx ${K.T(val, 3)}$.`];
    } else {
      val = q0 + q1; ver = `${b - a}^${n}/${b}^${n}+${n}*${a}*${b - a}^${n - 1}/${b}^${n}`;
      sol = [R`$P(\xi = 0) = \left(${qt}\right)^{${n}} \approx ${K.T(q0, 5)}$.`, R`$P(\xi = 1) = ${n} \cdot ${pt} \cdot \left(${qt}\right)^{${n - 1}} \approx ${K.T(q1, 5)}$.`, R`$P(\xi \le 1) = ${K.T(q0, 5)} + ${K.T(q1, 5)} \approx ${K.T(val, 3)}$.`];
    }
    var first = ctx === 0 ? R`Egy gyártósoron minden termék egymástól függetlenül $${pt}$ valószínűséggel selejtes. Kiválasztunk $${n}$ terméket (a gyártás nagy, a mintavétel visszatevésesnek tekinthető).`
      : R`Egy lövő minden lövésnél egymástól függetlenül $${pt}$ valószínűséggel talál. Leadott $${n}$ lövést.`;
    return {
      q: first + ' ' + R`Mennyi a valószínűsége, hogy ${evs[kind][ctx]}? Három tizedesjegyre kerekítve add meg.`,
      answer: { type: 'num', value: val, tol: 0.00051 }, ansTex: R`\approx ${K.T(val, 3)}`,
      verify: ver,
      tip1: kind === 2 ? R`Add össze a $0$ és az $1$ sikeres kísérlet valószínűségét a binomiális képlettel.` : R`Használd a komplementer eseményt, és számold ki a binomiális eloszlás megfelelő tagjait.`,
      tip2: R`$n = ${n}$, $p = ${pt}$, $1 - p = ${qt}$; $P(\xi = k) = \binom{${n}}{k} p^k (1-p)^{${n}-k}$.`,
      sol: sol
    };
  });

  def('v-vsz-6', 'valoszinuseg', 'valszam', 3, 'Feltételes valószínűség táblázatból', function (r) {
    var a = r.int(3, 15), b = r.int(2, 15), c = r.int(3, 15), d = r.int(2, 15), N = a + b + c + d, kind = r.int(0, 2);
    var cx = r.pick([{ x: 'fiú', xs: 'fiúk', y: 'lány', ys: 'lányok', pos: 'sportoló', neg: 'nem sportoló' }, { x: 'férfi', xs: 'férfiak', y: 'nő', ys: 'nők', pos: 'dohányzó', neg: 'nem dohányzó' }]);
    var num, den, cond, what, ver, sol;
    if (kind === 0) { num = a; den = a + b; cond = cx.x; what = cx.pos; ver = `(${a}/${N})/(${a + b}/${N})`; sol = [R`A feltétel: „${cx.x}”, ez $${a} + ${b} = ${a + b}$ eset; ezek közül $${a}$ ${cx.pos}.`]; }
    else if (kind === 1) { num = a; den = a + c; cond = cx.pos; what = cx.x; ver = `(${a}/${N})/(${a + c}/${N})`; sol = [R`A feltétel: „${cx.pos}”, ez $${a} + ${c} = ${a + c}$ eset; ezek közül $${a}$ ${cx.x}.`]; }
    else { num = d; den = b + d; cond = cx.neg; what = cx.y; ver = `(${d}/${N})/(${b + d}/${N})`; sol = [R`A feltétel: „${cx.neg}”, ez $${b} + ${d} = ${b + d}$ eset; ezek közül $${d}$ ${cx.y}.`]; }
    return {
      q: R`Egy $${N}$ fős csoportban $${a + b}$ ${cx.x} és $${c + d}$ ${cx.y} van. A ${cx.xs} közül $${a}$, a ${cx.ys} közül $${c}$ ${cx.pos}. Találomra kiválasztunk egy embert. Tudjuk, hogy a kiválasztott ${cond}. Mennyi a valószínűsége, hogy ${what}? Törtként add meg.`,
      answer: { type: 'num', value: num / den }, ansTex: K.q(num, den),
      verify: ver,
      tip1: R`Feltételes valószínűség: a feltételnek megfelelő esetek között keresd a kedvezőeket.`,
      tip2: R`Készíts táblázatot (két sor, két oszlop): ${cx.x}: ${cx.pos} $${a}$, ${cx.neg} $${b}$; ${cx.y}: ${cx.pos} $${c}$, ${cx.neg} $${d}$.`,
      sol: sol.concat([R`$P = \dfrac{${num}}{${den}} = ${K.q(num, den)}$`, R`(A definícióval: $\dfrac{P(A \cdot B)}{P(B)} = \dfrac{${num}/${N}}{${den}/${N}}$.)`])
    };
  });
})(typeof window !== 'undefined' ? window : globalThis);
