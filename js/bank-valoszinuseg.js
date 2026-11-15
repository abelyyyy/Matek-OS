(function (root) {
  'use strict';
  var MO = root.MO = root.MO || {}; var R = String.raw; var B = MO.bank = MO.bank || {};
  function add(o) { B[o.id] = o; }

  /* ---------- Igaz–hamis: statisztika ---------- */

  add({ id: 'b-val-tf-1', type: 'tf', topic: 'valoszinuseg', sub: 'statisztika', level: 2, title: 'A legnagyobb elem növelése',
    stmt: R`Egy legalább három elemű adathalmaz legnagyobb elemét megnöveljük, a többi adat nem változik. Ekkor az átlag nő, a medián viszont nem változik.`, truth: true,
    why: R`Az összeg nő, az elemszám változatlan, ezért az átlag nő. A legnagyobb elem legalább háromelemű halmazban nem lehet a rendezett sorozat középső eleme (vagy a két középső egyike), ezért a középső elem(ek) értéke nem változik, így a medián sem.` });

  add({ id: 'b-val-tf-2', type: 'tf', topic: 'valoszinuseg', sub: 'statisztika', level: 1, title: 'A módusz egyértelműsége',
    stmt: R`Minden adathalmaznak pontosan egy módusza van.`, truth: false,
    why: R`Az $1;\ 1;\ 2;\ 2;\ 3$ adatoknál az $1$ és a $2$ is kétszer fordul elő, ezért két módusz van. Az $1;\ 2;\ 3$ adatoknál mindegyik érték egyszer szerepel, ott mindhárom módusznak tekinthető, vagy nincs értelmes módusz.` });

  add({ id: 'b-val-tf-3', type: 'tf', topic: 'valoszinuseg', sub: 'statisztika', level: 1, title: 'Eltolt adatok szórása',
    stmt: R`Ha egy adathalmaz minden elemét ugyanazzal a számmal megnöveljük, a szórás nem változik.`, truth: true,
    why: R`Az átlag is ugyanennyivel nő, ezért az $x_i - \overline{x}$ eltérések nem változnak. A szórás csak az eltérésekből számolható, így ugyanaz marad.` });

  add({ id: 'b-val-tf-4', type: 'tf', topic: 'valoszinuseg', sub: 'statisztika', level: 2, title: 'Megszorzott adatok szórása',
    stmt: R`Ha egy adathalmaz minden elemét megháromszorozzuk, a szórás nem változik.`, truth: false,
    why: R`A $2;\ 4$ adatok átlaga $3$, szórása $1$. A megháromszorozott $6;\ 12$ adatok átlaga $9$, az eltérések $\pm 3$, a szórás $3$. Általában a szórás is háromszorosára nő.` });

  add({ id: 'b-val-tf-5', type: 'tf', topic: 'valoszinuseg', sub: 'statisztika', level: 1, title: 'Medián és átlag kiugró értéknél',
    stmt: R`Az $1;\ 2;\ 3;\ 4;\ 100$ adatok mediánja kisebb, mint az átlaguk.`, truth: true,
    why: R`A medián a rendezett sorozat középső eleme: $3$. Az átlag $\dfrac{1+2+3+4+100}{5} = 22$. A kiugró érték az átlagot jelentősen megemeli, a mediánt nem.` });

  add({ id: 'b-val-tf-6', type: 'tf', topic: 'valoszinuseg', sub: 'statisztika', level: 2, title: 'Azonos átlag, azonos szórás?',
    stmt: R`Ha két adathalmaz átlaga egyenlő, akkor a szórásuk is egyenlő.`, truth: false,
    why: R`A $4;\ 6$ és az $1;\ 9$ adatok átlaga is $5$. Az első szórása $1$, a másodiké $4$, mert az eltérések $\pm 1$, illetve $\pm 4$.` });

  add({ id: 'b-val-tf-7', type: 'tf', topic: 'valoszinuseg', sub: 'statisztika', level: 2, title: 'Két adathalmaz egyesítése',
    stmt: R`Egy $10$ elemű adathalmaz átlaga $4$, egy $30$ elemű adathalmaz átlaga $8$. A két halmaz egyesítésének átlaga $7$.`, truth: true,
    why: R`Az összegek $10 \cdot 4 = 40$ és $30 \cdot 8 = 240$, az egyesítésnek $40$ eleme van: $\dfrac{40 + 240}{40} = 7$.`,
    check: ['(10*4+30*8)/40', '7'] });

  add({ id: 'b-val-tf-8', type: 'tf', topic: 'valoszinuseg', sub: 'statisztika', level: 2, title: 'Átlagok átlaga',
    stmt: R`Egy $20$ fős csoport átlaga $5$, egy $30$ fős csoporté $10$. A két csoport együttes átlaga a két átlag számtani közepe, vagyis $7{,}5$.`, truth: false,
    why: R`A csoportok különböző létszámúak, ezért súlyozott közép kell: $\dfrac{20 \cdot 5 + 30 \cdot 10}{50} = \dfrac{400}{50} = 8$. A nagyobb csoport átlaga jobban számít.`,
    check: ['(20*5+30*10)/50', '7,5'] });

  add({ id: 'b-val-tf-9', type: 'tf', topic: 'valoszinuseg', sub: 'statisztika', level: 1, title: 'Mikor nulla a szórás?',
    stmt: R`Egy adathalmaz szórása akkor és csak akkor $0$, ha az adathalmaz minden eleme egyenlő.`, truth: true,
    why: R`A szórás az eltérésnégyzetek átlagának gyöke. A négyzetek nemnegatívak, az átlaguk csak úgy lehet $0$, ha mindegyik $0$, azaz minden elem az átlaggal egyenlő. Fordítva, ha minden elem egyenlő, az átlag is ez az érték, az eltérések mind $0$.` });

  add({ id: 'b-val-tf-10', type: 'tf', topic: 'valoszinuseg', sub: 'statisztika', level: 1, title: 'A medián és az adatok',
    stmt: R`Egy adathalmaz mediánja mindig az adathalmaz egyik eleme.`, truth: false,
    why: R`Páros elemszámnál a medián a két középső adat átlaga. Az $1;\ 2;\ 3;\ 4$ adatok mediánja $2{,}5$, ami nem szerepel az adatok között.` });

  /* ---------- Igaz–hamis: valószínűség-számítás ---------- */

  add({ id: 'b-val-tf-11', type: 'tf', topic: 'valoszinuseg', sub: 'valszam', level: 2, title: 'Kizáró és független események',
    stmt: R`Ha két, pozitív valószínűségű esemény kizárja egymást, akkor ezek az események függetlenek.`, truth: false,
    why: R`Kizáró eseményekre $P(A \cdot B) = 0$, függetlenséghez viszont $P(A) \cdot P(B) > 0$ kellene. Például egy dobókockánál az „$1$-est dobunk” és a „$2$-est dobunk” kizárják egymást, de $P(A \cdot B) = 0 \ne \dfrac{1}{36} = P(A) \cdot P(B)$.` });

  add({ id: 'b-val-tf-12', type: 'tf', topic: 'valoszinuseg', sub: 'valszam', level: 2, title: 'Független események metszete',
    stmt: R`Ha két, pozitív valószínűségű esemény független, akkor nem zárják ki egymást.`, truth: true,
    why: R`Függetlenség esetén $P(A \cdot B) = P(A) \cdot P(B) > 0$, tehát a szorzatesemény nem lehetetlen, vagyis $A$ és $B$ nem zárja ki egymást.` });

  add({ id: 'b-val-tf-13', type: 'tf', topic: 'valoszinuseg', sub: 'valszam', level: 1, title: 'Az összegesemény valószínűsége',
    stmt: R`Bármely két $A$ és $B$ eseményre $P(A + B) = P(A) + P(B)$.`, truth: false,
    why: R`Csak kizáró eseményekre igaz. Dobókockánál legyen $A$ a páros, $B$ a legalább négyes dobás: $P(A) = P(B) = \dfrac{1}{2}$, de $A + B = \{2;\ 4;\ 5;\ 6\}$, így $P(A + B) = \dfrac{2}{3} \ne 1$. Általában $P(A + B) = P(A) + P(B) - P(A \cdot B)$.`,
    check: ['1/2+1/2', '2/3'] });

  add({ id: 'b-val-tf-14', type: 'tf', topic: 'valoszinuseg', sub: 'valszam', level: 2, title: 'A feltételes valószínűség iránya',
    stmt: R`Bármely két, pozitív valószínűségű $A$ és $B$ eseményre $P(A \mid B) = P(B \mid A)$.`, truth: false,
    why: R`Dobókockánál legyen $A$ a hatos, $B$ a páros dobás. Ekkor $P(A \mid B) = \dfrac{1}{3}$ (három páros szám közül az egyik a hatos), de $P(B \mid A) = 1$, mert a hatos mindig páros. A két érték csak $P(A) = P(B)$ esetén egyenlő.` });

  add({ id: 'b-val-tf-15', type: 'tf', topic: 'valoszinuseg', sub: 'valszam', level: 1, title: 'Két érme feldobása',
    stmt: R`Két szabályos pénzérmét feldobunk. A fejek száma $0$, $1$ vagy $2$ lehet, ezért mindhárom eset valószínűsége $\dfrac{1}{3}$.`, truth: false,
    why: R`Az elemi események a rendezett párok: FF, FI, IF, II, ezek egyformán valószínűek. Egy fej két elemi eseményben fordul elő, ezért valószínűsége $\dfrac{2}{4} = \dfrac{1}{2}$, a másik kettőé $\dfrac{1}{4}$.`,
    check: ['1/3', '1/2'] });

  add({ id: 'b-val-tf-16', type: 'tf', topic: 'valoszinuseg', sub: 'valszam', level: 2, title: 'Visszatevés nélküli húzás, két piros',
    stmt: R`Egy urnában $8$ golyó van, ebből $3$ piros. Visszatevés nélkül húzunk két golyót. Annak a valószínűsége, hogy mindkettő piros, $\dfrac{3}{28}$.`, truth: true,
    why: R`Összes eset: $\dbinom{8}{2} = 28$, kedvező eset: $\dbinom{3}{2} = 3$, így $P = \dfrac{3}{28}$. Ugyanez sorban: $\dfrac{3}{8} \cdot \dfrac{2}{7} = \dfrac{6}{56} = \dfrac{3}{28}$.`,
    check: ['binom(3;2)/binom(8;2)', '3/28'] });

  add({ id: 'b-val-tf-17', type: 'tf', topic: 'valoszinuseg', sub: 'valszam', level: 2, title: 'Függetlenség visszatevés nélkül',
    stmt: R`Egy urnában $3$ piros és $2$ kék golyó van. Visszatevés nélkül kétszer húzunk. Az „első húzott golyó piros” és a „második húzott golyó piros” események függetlenek.`, truth: false,
    why: R`Mindkét esemény valószínűsége $\dfrac{3}{5}$, de $P(\text{mindkettő piros}) = \dfrac{3}{5} \cdot \dfrac{2}{4} = \dfrac{3}{10}$, a függetlenséghez viszont $\dfrac{3}{5} \cdot \dfrac{3}{5} = \dfrac{9}{25}$ kellene, és $\dfrac{3}{10} \ne \dfrac{9}{25}$. Visszatevés nélkül az első húzás eredménye megváltoztatja a másodikét.`,
    check: ['3/10', '3/5*3/5'] });

  add({ id: 'b-val-tf-18', type: 'tf', topic: 'valoszinuseg', sub: 'valszam', level: 2, title: 'Geometriai valószínűség: beírt kör',
    stmt: R`Egy $10$ cm oldalú négyzet alakú lapra véletlenszerűen, egyenletes eloszlással ejtünk egy pontot. Annak a valószínűsége, hogy a pont a négyzetbe írt körbe esik, $\dfrac{\pi}{4}$.`, truth: true,
    why: R`A beírt kör sugara $5$ cm, területe $25\pi$ cm², a négyzet területe $100$ cm². A geometriai modell szerint $P = \dfrac{25\pi}{100} = \dfrac{\pi}{4} \approx 0{,}785$.`,
    check: ['25*pi/100', 'pi/4'] });

  add({ id: 'b-val-tf-19', type: 'tf', topic: 'valoszinuseg', sub: 'valszam', level: 1, title: 'A hatosok számának várható értéke',
    stmt: R`Egy szabályos kockával $30$-szor dobunk. A hatosok számának várható értéke $5$.`, truth: true,
    why: R`A hatosok száma binomiális eloszlású, $n = 30$, $p = \dfrac{1}{6}$. A várható érték $n \cdot p = 30 \cdot \dfrac{1}{6} = 5$.`,
    check: ['30*1/6', '5'] });

  add({ id: 'b-val-tf-20', type: 'tf', topic: 'valoszinuseg', sub: 'valszam', level: 1, title: 'Relatív gyakoriság és valószínűség',
    stmt: R`Egy véletlen kísérletet sokszor megismételve az esemény relatív gyakorisága általában a valószínűség közelében ingadozik, és a kísérletek számának növelésével egyre inkább ehhez közelít.`, truth: true,
    why: R`Ez a relatív gyakoriság és a valószínűség szemléletes kapcsolata (a nagy számok törvénye). Rövid sorozatban nagyobb lehet az eltérés, hosszú sorozatban a relatív gyakoriság stabilizálódik.` });

  add({ id: 'b-val-tf-21', type: 'tf', topic: 'valoszinuseg', sub: 'valszam', level: 3, title: 'Pontosan öt fej tíz dobásból',
    stmt: R`Szabályos pénzérmét $10$-szer dobunk fel. Annak a valószínűsége, hogy pontosan $5$ fejet kapunk, $\dfrac{1}{2}$.`, truth: false,
    why: R`A fejek száma binomiális, $n = 10$, $p = \dfrac{1}{2}$: $P(5) = \dbinom{10}{5} \cdot \left(\dfrac{1}{2}\right)^{10} = \dfrac{252}{1024} \approx 0{,}246$. Az $5$ fej a legvalószínűbb eredmény, de még így is kevesebb mint negyed az esélye.`,
    check: ['binom(10;5)/2^10', '1/2'] });

  /* ---------- Hibavadász ---------- */

  add({ id: 'b-val-spot-1', type: 'spot', topic: 'valoszinuseg', sub: 'statisztika', level: 1, title: 'Medián rendezés nélkül',
    problem: R`Határozd meg a $8;\ 3;\ 5;\ 10;\ 2;\ 6$ adatok mediánját.`,
    lines: [R`Az adatok száma $6$, páros, ezért a medián a két középső adat átlaga.`,
            R`A felsorolás középső két adata $5$ és $10$, az átlaguk $\dfrac{5+10}{2} = 7{,}5$.`,
            R`A medián $7{,}5$.`],
    wrong: 1,
    why: R`A mediánt a nagyság szerint rendezett sorozatból kell leolvasni, a felsorolás sorrendje nem számít. A rendezés nélküli középső adatok véletlenszerűek.`,
    fix: R`Rendezve: $2;\ 3;\ 5;\ 6;\ 8;\ 10$. A két középső adat $5$ és $6$, a medián $\dfrac{5+6}{2} = 5{,}5$.`,
    wrongCheck: ['(5+10)/2', '(5+6)/2'], fixCheck: ['(5+6)/2', '5,5'] });

  add({ id: 'b-val-spot-2', type: 'spot', topic: 'valoszinuseg', sub: 'statisztika', level: 1, title: 'Átlag gyakorisági táblázatból',
    problem: R`Egy $20$ fős osztály dolgozatjegyei: elégtelen $2$, elégséges $5$, közepes $8$, jó $3$, jeles $2$ darab (az érdemjegyek $1$ és $5$ között). Számítsd ki az átlagot.`,
    lines: [R`A létszám: $2 + 5 + 8 + 3 + 2 = 20$.`,
            R`Az átlag a jegyek átlaga: $\dfrac{1+2+3+4+5}{5} = 3$.`,
            R`Az osztályátlag tehát $3$.`],
    wrong: 1,
    why: R`A jegyeket súlyozni kell a gyakoriságukkal: a $3$-as jegyből $8$ van, az $1$-esből csak $2$. A jegyek egyszerű átlaga azt feltételezné, hogy mindegyik jegyből ugyanannyi van.`,
    fix: R`Az átlag $\dfrac{2 \cdot 1 + 5 \cdot 2 + 8 \cdot 3 + 3 \cdot 4 + 2 \cdot 5}{20} = \dfrac{58}{20} = 2{,}9$.`,
    wrongCheck: ['(1+2+3+4+5)/5', '(2*1+5*2+8*3+3*4+2*5)/20'], fixCheck: ['(2*1+5*2+8*3+3*4+2*5)/20', '2,9'] });

  add({ id: 'b-val-spot-3', type: 'spot', topic: 'valoszinuseg', sub: 'statisztika', level: 2, title: 'A szórás kiszámítása',
    problem: R`Számítsd ki a $2;\ 4;\ 4;\ 4;\ 5;\ 5;\ 7;\ 9$ adatok szórását.`,
    lines: [R`Az átlag $\dfrac{2+4+4+4+5+5+7+9}{8} = \dfrac{40}{8} = 5$.`,
            R`Az eltérések négyzete: $9;\ 1;\ 1;\ 1;\ 0;\ 0;\ 4;\ 16$, összegük $32$.`,
            R`Az eltérésnégyzetek átlaga $\dfrac{32}{8} = 4$.`,
            R`A szórás $4$.`],
    wrong: 3,
    why: R`Az eltérésnégyzetek átlaga a szórásnégyzet (variancia). A szórás ennek a négyzetgyöke, a négyzetgyökvonás kimaradt.`,
    fix: R`A szórás $\sqrt{4} = 2$.`,
    wrongCheck: ['4', 'sqrt(32/8)'], fixCheck: ['sqrt(32/8)', '2'] });

  add({ id: 'b-val-spot-4', type: 'spot', topic: 'valoszinuseg', sub: 'valszam', level: 2, title: 'Vagy-vagy nem kizáró eseményeknél',
    problem: R`Egy $32$ lapos magyar kártyából (négy szín, színenként $8$ lap, köztük egy ász) véletlenszerűen húzunk egy lapot. Mekkora a valószínűsége, hogy a lap piros színű vagy ász?`,
    lines: [R`A $32$ lap húzása egyformán valószínű, ezért a klasszikus modellt használjuk.`,
            R`$P(\text{piros}) = \dfrac{8}{32}$ és $P(\text{ász}) = \dfrac{4}{32}$.`,
            R`A „vagy” miatt összeadunk: $\dfrac{8}{32} + \dfrac{4}{32} = \dfrac{12}{32} = \dfrac{3}{8}$.`,
            R`A keresett valószínűség $\dfrac{3}{8}$.`],
    wrong: 2,
    why: R`Az összeadás csak kizáró eseményeknél helyes. A piros ász mindkét eseményben benne van, ezért kétszer számoltuk: ki kell vonni a metszet valószínűségét.`,
    fix: R`$P = \dfrac{8}{32} + \dfrac{4}{32} - \dfrac{1}{32} = \dfrac{11}{32}$.`,
    wrongCheck: ['8/32+4/32', '11/32'], fixCheck: ['8/32+4/32-1/32', '11/32'] });

  add({ id: 'b-val-spot-5', type: 'spot', topic: 'valoszinuseg', sub: 'valszam', level: 2, title: 'Húzás visszatevés nélkül',
    problem: R`Egy urnában $5$ piros és $3$ kék golyó van. Visszatevés nélkül kihúzunk két golyót egymás után. Mekkora a valószínűsége, hogy mindkettő piros?`,
    lines: [R`Összesen $8$ golyó van, az első húzásnál a piros valószínűsége $\dfrac{5}{8}$.`,
            R`A második húzásnál is $\dfrac{5}{8}$ a piros valószínűsége.`,
            R`A két húzás eredményét összeszorozzuk: $\dfrac{5}{8} \cdot \dfrac{5}{8} = \dfrac{25}{64}$.`],
    wrong: 1,
    why: R`Visszatevés nélkül a második húzásnál már csak $7$ golyó van, és ha az első piros volt, abból $4$ piros. A második húzás valószínűsége feltételes: $\dfrac{4}{7}$.`,
    fix: R`$P = \dfrac{5}{8} \cdot \dfrac{4}{7} = \dfrac{20}{56} = \dfrac{5}{14}$.`,
    wrongCheck: ['5/8*5/8', '5/8*4/7'], fixCheck: ['5/8*4/7', '5/14'] });

  add({ id: 'b-val-spot-6', type: 'spot', topic: 'valoszinuseg', sub: 'valszam', level: 2, title: 'Legalább egy hatos három dobásból',
    problem: R`Egy szabályos kockával háromszor dobunk. Mekkora a valószínűsége, hogy legalább egy hatost dobunk?`,
    lines: [R`A dobások függetlenek, mindegyikben $\dfrac{1}{6}$ a hatos valószínűsége.`,
            R`Legalább egy hatos: az első, vagy a második, vagy a harmadik dobás hatos, ezért összeadom: $\dfrac{1}{6} + \dfrac{1}{6} + \dfrac{1}{6} = \dfrac{1}{2}$.`,
            R`A keresett valószínűség $\dfrac{1}{2}$.`],
    wrong: 1,
    why: R`A három esemény nem kizáró: két vagy három hatost is dobhatunk, ezeket az összeadás többször számolja. Például hat dobásnál ez az összeg $1$ lenne, pedig a hatos dobása nem biztos esemény. A komplementerrel egyszerű a számolás.`,
    fix: R`A komplementer esemény: egyik dobás sem hatos. $P = 1 - \left(\dfrac{5}{6}\right)^3 = 1 - \dfrac{125}{216} = \dfrac{91}{216} \approx 0{,}421$.`,
    wrongCheck: ['3/6', '1-(5/6)^3'], fixCheck: ['1-(5/6)^3', '91/216'] });

  add({ id: 'b-val-spot-7', type: 'spot', topic: 'valoszinuseg', sub: 'valszam', level: 3, title: 'Binomiális valószínűség együttható nélkül',
    problem: R`Egy kosárlabdázó minden dobását egymástól függetlenül $0{,}6$ valószínűséggel találja el. Mekkora a valószínűsége, hogy $5$ dobásból pontosan $3$ találata lesz?`,
    lines: [R`Binomiális modell: $n = 5$, $p = 0{,}6$, a találatok száma $k = 3$.`,
            R`A keresett valószínűség: $0{,}6^3 \cdot 0{,}4^2$.`,
            R`Ez $0{,}216 \cdot 0{,}16 = 0{,}03456$.`,
            R`A valószínűség körülbelül $0{,}035$.`],
    wrong: 1,
    why: R`A $0{,}6^3 \cdot 0{,}4^2$ egyetlen rögzített sorrend valószínűsége (például az első három dobás talál). A $3$ találat az $5$ dobás közül $\dbinom{5}{3}$ különböző helyre eshet, és ezek kizárják egymást, ezért szorozni kell az együtthatóval.`,
    fix: R`$P = \dbinom{5}{3} \cdot 0{,}6^3 \cdot 0{,}4^2 = 10 \cdot 0{,}03456 = 0{,}3456$.`,
    wrongCheck: ['0,6^3*0,4^2', 'binom(5;3)*0,6^3*0,4^2'], fixCheck: ['binom(5;3)*0,6^3*0,4^2', '0,3456'] });

  add({ id: 'b-val-spot-8', type: 'spot', topic: 'valoszinuseg', sub: 'valszam', level: 2, title: 'Két kocka összege',
    problem: R`Két szabályos dobókockával dobunk egyszerre. Mekkora a valószínűsége, hogy a dobott számok összege legalább $11$?`,
    lines: [R`Az összeg a $2;\ 3;\ \dots;\ 12$ számok valamelyike, kedvező a $11$ és a $12$.`,
            R`Mivel $11$ különböző összeg lehetséges, ezek egyformán valószínűek, így $P = \dfrac{2}{11}$.`,
            R`A keresett valószínűség $\dfrac{2}{11}$.`],
    wrong: 1,
    why: R`Az összegek nem egyformán valószínűek. Egyformán valószínű elemi események a két kocka eredményeiből álló rendezett párok ($36$ darab), egy-egy összeg különböző számú párból jön létre.`,
    fix: R`Kedvező párok: $(5;6)$, $(6;5)$ és $(6;6)$, azaz $3$ db a $36$ közül. $P = \dfrac{3}{36} = \dfrac{1}{12}$.`,
    wrongCheck: ['2/11', '3/36'], fixCheck: ['3/36', '1/12'] });

  /* ---------- Sorba rendezés ---------- */

  add({ id: 'b-val-ord-1', type: 'order', topic: 'valoszinuseg', sub: 'valszam', level: 2, title: 'Klasszikus valószínűség összetett feladatban',
    claim: R`Rendezd sorba a megoldás lépéseit: egy urnában $4$ piros és $6$ kék golyó van. Visszatevés nélkül kihúzunk $3$ golyót. Mekkora a valószínűsége, hogy pontosan $2$ piros van közöttük?`,
    steps: [R`A sorrend nem számít, ezért az összes esetet kombinációval számoljuk: $\dbinom{10}{3} = 120$.`,
            R`Ugyanígy, sorrend nélkül számoljuk a kedvező eseteket: $2$ piros és $1$ kék golyó kell. A $4$ piros közül $2$-t $\dbinom{4}{2} = 6$ módon, a $6$ kék közül egyet $\dbinom{6}{1} = 6$ módon választhatunk.`,
            R`A két választás egymástól független, ezért a kedvező esetek száma a szorzatuk: $6 \cdot 6 = 36$.`,
            R`A klasszikus modell szerint $P = \dfrac{\text{kedvező}}{\text{összes}} = \dfrac{36}{120} = \dfrac{3}{10}$.`],
    note: R`A hipergeometriai eloszlás képlete: $\dfrac{\binom{4}{k}\binom{6}{3-k}}{\binom{10}{3}}$, itt $k = 2$.` });

  add({ id: 'b-val-ord-2', type: 'order', topic: 'valoszinuseg', sub: 'valszam', level: 2, title: 'Legalább egy selejtes: komplementerrel',
    claim: R`Rendezd sorba a megoldás lépéseit: egy üzem termékeinek $5\%$-a selejtes. Egymás után (visszatevéssel) kiválasztunk $4$ terméket. Mekkora a valószínűsége, hogy van közöttük legalább egy selejtes?`,
    steps: [R`Az $A$ esemény: „legalább egy selejtes”. Közvetlenül $1$, $2$, $3$ és $4$ selejtes esetét kellene összeadni, ezért a komplementerére térünk át.`,
            R`Az $\overline{A}$ esemény: „egyik termék sem selejtes”. Egy termék jó valószínűsége $0{,}95$.`,
            R`A kiválasztások függetlenek, ezért $P(\overline{A}) = 0{,}95^4 \approx 0{,}8145$.`,
            R`A komplementer szabály szerint $P(A) = 1 - P(\overline{A}) \approx 1 - 0{,}8145 = 0{,}1855$.`],
    note: R`A „legalább egy” típusú kérdéseknél a komplementer („egy sem”) általában sokkal egyszerűbb.` });

  add({ id: 'b-val-ord-3', type: 'order', topic: 'valoszinuseg', sub: 'statisztika', level: 1, title: 'A szórás kiszámításának lépései',
    claim: R`Rendezd sorba a $2;\ 4;\ 6;\ 8$ adatok szórásának kiszámítási lépéseit.`,
    steps: [R`Kiszámítjuk az átlagot: $\overline{x} = \dfrac{2+4+6+8}{4} = 5$.`,
            R`Meghatározzuk az adatok eltérését az átlagtól: $-3;\ -1;\ 1;\ 3$.`,
            R`Az eltéréseket négyzetre emeljük: $9;\ 1;\ 1;\ 9$.`,
            R`A négyzetek átlagát számoljuk (szórásnégyzet): $\dfrac{9+1+1+9}{4} = 5$.`,
            R`A szórás a szórásnégyzet négyzetgyöke: $\sqrt{5} \approx 2{,}24$.`],
    note: R`A szórást ebben a feladatbankban az adatok számával (nem eggyel kevesebbel) osztva számoljuk.` });

  add({ id: 'b-val-ord-4', type: 'order', topic: 'valoszinuseg', sub: 'valszam', level: 3, title: 'Binomiális valószínűség levezetése',
    claim: R`Rendezd sorba a levezetés lépéseit: egy szabályos kockával $6$-szor dobunk. Mekkora a valószínűsége, hogy pontosan $2$ hatost dobunk?`,
    steps: [R`A hatos a siker: $p = \dfrac{1}{6}$, a nem hatos valószínűsége $\dfrac{5}{6}$. A dobások függetlenek, ezért binomiális modellt használunk, $n = 6$.`,
            R`Egy rögzített sorrend, például az első két dobás hatos, a többi nem, valószínűsége $\left(\dfrac{1}{6}\right)^2 \cdot \left(\dfrac{5}{6}\right)^4$.`,
            R`A két hatos helyét a $6$ dobás közül $\dbinom{6}{2} = 15$ módon választhatjuk ki, és ezek az esetek kizárják egymást, mindegyiknek ugyanez a valószínűsége.`,
            R`Összegezve: $P = \dbinom{6}{2} \cdot \left(\dfrac{1}{6}\right)^2 \cdot \left(\dfrac{5}{6}\right)^4 = \dfrac{15 \cdot 625}{46656} = \dfrac{3125}{15552} \approx 0{,}2009$.`],
    note: R`Általában $P(k) = \dbinom{n}{k} p^k (1-p)^{n-k}$.` });

  add({ id: 'b-val-ord-5', type: 'order', topic: 'valoszinuseg', sub: 'valszam', level: 2, title: 'Feltételes valószínűség táblázatból',
    claim: R`Rendezd sorba a megoldás lépéseit. Egy $100$ fős csoportban $60$ lány és $40$ fiú van. A lányok közül $36$, a fiúk közül $16$ sportol rendszeresen. Egy véletlenül kiválasztott személyről tudjuk, hogy sportol. Mekkora a valószínűsége, hogy lány?`,
    steps: [R`Jelölje $L$, hogy a kiválasztott lány, $S$, hogy sportol. A keresett valószínűség $P(L \mid S) = \dfrac{P(L \cdot S)}{P(S)}$.`,
            R`Összesen $36 + 16 = 52$ sportoló van, ezért $P(S) = \dfrac{52}{100}$.`,
            R`Ezek közül a lányok száma $36$, vagyis $P(L \cdot S) = \dfrac{36}{100}$.`,
            R`Behelyettesítve: $P(L \mid S) = \dfrac{36/100}{52/100} = \dfrac{36}{52} = \dfrac{9}{13} \approx 0{,}692$.`],
    note: R`A feltétel miatt az eseménytér a $52$ sportolóra szűkül, ebből $36$ a kedvező.` });

  /* ---------- Vezetett megoldás ---------- */

  add({ id: 'b-val-gui-1', type: 'guided', topic: 'valoszinuseg', sub: 'statisztika', level: 2, title: 'Gyakorisági táblázat elemzése',
    problem: R`Egy $20$ fős csoportban megszámolták, hány hibát vétettek a tanulók egy tesztben. A hibák száma: $0;\ 1;\ 2;\ 3;\ 4$, ennyi tanulónak volt rendre $3;\ 5;\ 7;\ 3;\ 2$ db. Elemezd az adatokat: átlag, medián, módusz, szórás (a szórást az adatok számával osztva számold).`,
    steps: [
      { q: R`Mennyi a hibák átlagos száma?`, answer: { type: 'num', value: 1.8 }, ansTex: R`1{,}8`, verify: '(0*3+1*5+2*7+3*3+4*2)/20',
        hint: R`Súlyozott átlag: minden hibaszámot szorozz a gyakoriságával, add össze, és oszd el a létszámmal.`, expl: R`$\dfrac{0\cdot3 + 1\cdot5 + 2\cdot7 + 3\cdot3 + 4\cdot2}{20} = \dfrac{36}{20} = 1{,}8$.` },
      { q: R`Mennyi a medián?`, answer: { type: 'num', value: 2 }, ansTex: '2', verify: '(2+2)/2',
        hint: R`$20$ adat esetén a $10.$ és $11.$ adat átlaga a medián. Add össze a gyakoriságokat balról jobbra.`, expl: R`A halmozott gyakoriságok: $3;\ 8;\ 15;\ \dots$ Így a $10.$ és a $11.$ adat is $2$, a medián $2$.` },
      { q: R`Mennyi a módusz?`, answer: { type: 'num', value: 2 }, ansTex: '2', verify: '2',
        hint: R`A módusz a leggyakoribb érték.`, expl: R`A leggyakoribb hibaszám a $2$ ($7$ tanuló).` },
      { q: R`Mennyi a szórásnégyzet (az eltérésnégyzetek átlaga)?`, answer: { type: 'num', value: 1.36 }, ansTex: R`1{,}36`, verify: '(3*(0-1,8)^2+5*(1-1,8)^2+7*(2-1,8)^2+3*(3-1,8)^2+2*(4-1,8)^2)/20',
        hint: R`Minden hibaszám eltérésnégyzetét szorozd a gyakoriságával, majd oszd el $20$-szal.`, expl: R`$\dfrac{3 \cdot 3{,}24 + 5 \cdot 0{,}64 + 7 \cdot 0{,}04 + 3 \cdot 1{,}44 + 2 \cdot 4{,}84}{20} = \dfrac{27{,}2}{20} = 1{,}36$.` },
      { q: R`Mekkora a szórás két tizedesjegyre kerekítve?`, answer: { type: 'num', value: 1.17, tol: 0.01 }, ansTex: R`\approx 1{,}17`, verify: 'sqrt(1,36)',
        hint: R`A szórás a szórásnégyzet négyzetgyöke.`, expl: R`$\sqrt{1{,}36} \approx 1{,}166 \approx 1{,}17$.` }],
    final: R`Átlag: $1{,}8$ hiba, medián: $2$, módusz: $2$, szórás: kb. $1{,}17$.` });

  add({ id: 'b-val-gui-2', type: 'guided', topic: 'valoszinuseg', sub: 'statisztika', level: 1, title: 'Hiányzó adat az átlagból',
    problem: R`Egy kézilabdacsapat hat játékosa egy meccsen $12$, $7$, $9$, $15$, $4$ és $x$ gólt lőtt. Az egy játékosra jutó gólok átlaga $9$. Határozd meg $x$ értékét, majd az adatok szórását (az adatok számával osztva).`,
    steps: [
      { q: R`Mennyi a hat adat összege?`, answer: { type: 'num', value: 54 }, ansTex: '54', verify: '6*9',
        hint: R`Az átlag az összeg osztva az elemszámmal.`, expl: R`Az összeg az átlag és az elemszám szorzata: $6 \cdot 9 = 54$.` },
      { q: R`Mennyi az öt ismert adat összege?`, answer: { type: 'num', value: 47 }, ansTex: '47', verify: '12+7+9+15+4',
        hint: R`Add össze az $x$ nélküli adatokat.`, expl: R`$12 + 7 + 9 + 15 + 4 = 47$.` },
      { q: R`Mennyi $x$?`, answer: { type: 'num', value: 7 }, ansTex: '7', verify: '6*9-47',
        hint: R`A teljes összegből vond ki az ismert adatok összegét.`, expl: R`$x = 54 - 47 = 7$.` },
      { q: R`Mennyi a szórásnégyzet? Az adatok: $12;\ 7;\ 9;\ 15;\ 4;\ 7$, az átlag $9$.`, answer: { type: 'num', value: 13 }, ansTex: '13', verify: '((12-9)^2+(7-9)^2+(9-9)^2+(15-9)^2+(4-9)^2+(7-9)^2)/6',
        hint: R`Az eltérések: $3;\ -2;\ 0;\ 6;\ -5;\ -2$. Négyzetre emeld őket, és vedd az átlagukat.`, expl: R`$\dfrac{9 + 4 + 0 + 36 + 25 + 4}{6} = \dfrac{78}{6} = 13$.` },
      { q: R`Mekkora a szórás két tizedesjegyre kerekítve?`, answer: { type: 'num', value: 3.61, tol: 0.01 }, ansTex: R`\approx 3{,}61`, verify: 'sqrt(13)',
        hint: R`Vonj négyzetgyököt a szórásnégyzetből.`, expl: R`$\sqrt{13} \approx 3{,}606 \approx 3{,}61$.` }],
    final: R`$x = 7$, az adatok szórása $\sqrt{13} \approx 3{,}61$.` });

  add({ id: 'b-val-gui-3', type: 'guided', topic: 'valoszinuseg', sub: 'valszam', level: 2, title: 'Urnás feladat visszatevés nélkül',
    problem: R`Egy urnában $6$ piros és $4$ fehér golyó van. Visszatevés nélkül kihúzunk $3$ golyót. Számítsd ki a valószínűségeket.`,
    steps: [
      { q: R`Hányféleképpen húzhatunk ki $3$ golyót a $10$ közül (a sorrend nem számít)?`, answer: { type: 'num', value: 120 }, ansTex: '120', verify: 'binom(10;3)',
        hint: R`Kombináció: $\dbinom{10}{3}$.`, expl: R`$\dbinom{10}{3} = \dfrac{10 \cdot 9 \cdot 8}{6} = 120$.` },
      { q: R`Mennyi a valószínűsége, hogy mindhárom golyó piros? Közönséges törtként add meg.`, answer: { type: 'num', value: 1 / 6 }, ansTex: R`\dfrac{1}{6}`, verify: 'binom(6;3)/binom(10;3)',
        hint: R`Kedvező eset: a $6$ pirosból $3$-at választunk.`, expl: R`$\dfrac{\binom{6}{3}}{\binom{10}{3}} = \dfrac{20}{120} = \dfrac{1}{6}$.` },
      { q: R`Mennyi a valószínűsége, hogy pontosan $2$ piros és $1$ fehér golyót húzunk?`, answer: { type: 'num', value: 0.5 }, ansTex: R`\dfrac{1}{2}`, verify: 'binom(6;2)*binom(4;1)/binom(10;3)',
        hint: R`A pirosakat és a fehéret egymástól függetlenül választjuk, a lehetőségek száma szorzódik.`, expl: R`$\dfrac{\binom{6}{2}\binom{4}{1}}{\binom{10}{3}} = \dfrac{15 \cdot 4}{120} = \dfrac{1}{2}$.` },
      { q: R`Mennyi a valószínűsége, hogy legalább egy fehér golyó van a kihúzottak között? Közönséges törtként add meg.`, answer: { type: 'num', value: 5 / 6 }, ansTex: R`\dfrac{5}{6}`, verify: '1-binom(6;3)/binom(10;3)',
        hint: R`A komplementer esemény: nincs fehér, vagyis mind piros.`, expl: R`$1 - \dfrac{1}{6} = \dfrac{5}{6}$.` }],
    final: R`Összes eset: $120$; mind piros: $\dfrac{1}{6}$; pontosan $2$ piros: $\dfrac{1}{2}$; legalább egy fehér: $\dfrac{5}{6}$.` });

  add({ id: 'b-val-gui-4', type: 'guided', topic: 'valoszinuseg', sub: 'valszam', level: 3, title: 'Binomiális eloszlás: pontosan és legalább',
    problem: R`Egy gyártósoron minden alkatrész egymástól függetlenül $0{,}1$ valószínűséggel hibás. Véletlenszerűen kiválasztunk $8$ alkatrészt (a sorozat olyan nagy, hogy a kiválasztásokat függetlennek vehetjük). Add meg a valószínűségeket négy tizedesjegyre kerekítve.`,
    steps: [
      { q: R`Melyik eloszlással modellezzük a hibás alkatrészek számát?`, answer: { type: 'choice', options: [R`Binomiális, $n = 8$, $p = 0{,}1$`, R`Hipergeometriai, mert nincs visszatevés`, R`Egyenletes eloszlás $0$ és $8$ között`], correct: 0 },
        hint: R`Független ismétlések, mindegyiknél ugyanakkora a siker valószínűsége.`, expl: R`Független, azonos valószínűségű kísérletek számát számoljuk, ez a binomiális eloszlás.` },
      { q: R`Mennyi a valószínűsége, hogy egyik alkatrész sem hibás?`, answer: { type: 'num', value: 0.4305, tol: 0.0001 }, ansTex: R`\approx 0{,}4305`, verify: '0,9^8',
        hint: R`Mind a $8$ alkatrész jó: $0{,}9^8$.`, expl: R`$P(0) = 0{,}9^8 \approx 0{,}4305$.` },
      { q: R`Mennyi a valószínűsége, hogy pontosan $1$ alkatrész hibás?`, answer: { type: 'num', value: 0.3826, tol: 0.0001 }, ansTex: R`\approx 0{,}3826`, verify: '8*0,1*0,9^7',
        hint: R`$\dbinom{8}{1} \cdot 0{,}1 \cdot 0{,}9^7$.`, expl: R`$P(1) = 8 \cdot 0{,}1 \cdot 0{,}9^7 \approx 0{,}3826$.` },
      { q: R`Mennyi a valószínűsége, hogy legalább $2$ hibás alkatrész van?`, answer: { type: 'num', value: 0.1869, tol: 0.0001 }, ansTex: R`\approx 0{,}1869`, verify: '1-0,9^8-8*0,1*0,9^7',
        hint: R`Komplementer: $1 - P(0) - P(1)$.`, expl: R`$1 - 0{,}4305 - 0{,}3826 \approx 0{,}1869$. Pontosabban: $1 - 0{,}43046721 - 0{,}38263752 = 0{,}18689527$.` },
      { q: R`Mennyi a hibás alkatrészek számának várható értéke?`, answer: { type: 'num', value: 0.8 }, ansTex: R`0{,}8`, verify: '8*0,1',
        hint: R`Binomiális eloszlásnál $n \cdot p$.`, expl: R`$E = n \cdot p = 8 \cdot 0{,}1 = 0{,}8$.` }],
    final: R`$P(0) \approx 0{,}4305$, $P(1) \approx 0{,}3826$, $P(\text{legalább } 2) \approx 0{,}1869$, a várható érték $0{,}8$.` });

  add({ id: 'b-val-gui-5', type: 'guided', topic: 'valoszinuseg', sub: 'valszam', level: 3, title: 'Feltételes valószínűség két kockadobásnál',
    problem: R`Szabályos kockával kétszer dobunk. Az $A$ esemény: a két dobás összege $8$. A $B$ esemény: az első dobás páros.`,
    steps: [
      { q: R`Mennyi $P(A)$? Közönséges törtként add meg.`, answer: { type: 'num', value: 5 / 36 }, ansTex: R`\dfrac{5}{36}`, verify: '5/36',
        hint: R`Sorold fel a rendezett párokat, amelyeknek az összege $8$.`, expl: R`$(2;6),\ (3;5),\ (4;4),\ (5;3),\ (6;2)$: $5$ eset a $36$ közül.` },
      { q: R`Mennyi $P(A \cdot B)$, azaz az összeg $8$ és az első dobás páros? Közönséges törtként add meg.`, answer: { type: 'num', value: 1 / 12 }, ansTex: R`\dfrac{1}{12}`, verify: '3/36',
        hint: R`Az előző párok közül válaszd ki azokat, ahol az első szám páros.`, expl: R`$(2;6),\ (4;4),\ (6;2)$: $\dfrac{3}{36} = \dfrac{1}{12}$.` },
      { q: R`Mennyi $P(A \mid B)$? Közönséges törtként add meg.`, answer: { type: 'num', value: 1 / 6 }, ansTex: R`\dfrac{1}{6}`, verify: '(3/36)/(1/2)',
        hint: R`$P(A \mid B) = \dfrac{P(A \cdot B)}{P(B)}$, és $P(B) = \dfrac{1}{2}$.`, expl: R`$\dfrac{1/12}{1/2} = \dfrac{1}{6}$.` },
      { q: R`Mennyi $P(B \mid A)$?`, answer: { type: 'num', value: 0.6 }, ansTex: R`\dfrac{3}{5}`, verify: '(3/36)/(5/36)',
        hint: R`Most $P(A)$ a nevező.`, expl: R`$\dfrac{1/12}{5/36} = \dfrac{3}{5}$: az $5$ kedvező pár közül $3$ esetben páros az első szám.` },
      { q: R`Függetlenek-e az $A$ és $B$ események?`, answer: { type: 'choice', options: ['Igen, mert P(A | B) = P(B | A)', R`Nem, mert $P(A \mid B) = \dfrac{1}{6} \ne \dfrac{5}{36} = P(A)$`, 'Nem, mert kizárják egymást'], correct: 1 },
        hint: R`Függetlenségnél $P(A \mid B) = P(A)$ lenne.`, expl: R`$\dfrac{1}{6} = \dfrac{6}{36} \ne \dfrac{5}{36}$, tehát nem függetlenek. Kizáró sem, hiszen $P(A \cdot B) = \dfrac{1}{12} > 0$.` }],
    final: R`$P(A) = \dfrac{5}{36}$, $P(A \cdot B) = \dfrac{1}{12}$, $P(A \mid B) = \dfrac{1}{6}$, $P(B \mid A) = \dfrac{3}{5}$; az események nem függetlenek.` });

  add({ id: 'b-val-gui-6', type: 'guided', topic: 'valoszinuseg', sub: 'valszam', level: 2, title: 'Geometriai valószínűség céltáblán',
    problem: R`Egy $20$ cm oldalú négyzet alakú céltábla közepén $5$ cm sugarú kör alakú piros mező van. A lövés a táblának egy egyenletesen véletlen pontját találja el (a tábla minden pontja egyformán valószínű).`,
    steps: [
      { q: R`Mekkora a céltábla területe cm²-ben?`, answer: { type: 'num', value: 400 }, ansTex: '400', verify: '20^2',
        hint: R`Négyzet területe: oldal a négyzeten.`, expl: R`$20^2 = 400$ cm².` },
      { q: R`Mekkora a piros mező területe cm²-ben, két tizedesjegyre kerekítve?`, answer: { type: 'num', value: 78.54, tol: 0.01 }, ansTex: R`25\pi \approx 78{,}54`, verify: '25*pi',
        hint: R`$T = r^2 \pi$.`, expl: R`$5^2 \pi = 25\pi \approx 78{,}54$ cm².` },
      { q: R`Mekkora valószínűséggel találja el a piros mezőt? (négy tizedesjegyre kerekítve)`, answer: { type: 'num', value: 0.1963, tol: 0.001 }, ansTex: R`\dfrac{\pi}{16} \approx 0{,}1963`, verify: 'pi/16',
        hint: R`Geometriai modell: kedvező terület osztva az összes területtel.`, expl: R`$P = \dfrac{25\pi}{400} = \dfrac{\pi}{16} \approx 0{,}1963$.` },
      { q: R`Mekkora valószínűséggel nem találja el a piros mezőt? (négy tizedesjegyre kerekítve)`, answer: { type: 'num', value: 0.8037, tol: 0.001 }, ansTex: R`1 - \dfrac{\pi}{16} \approx 0{,}8037`, verify: '1-pi/16',
        hint: R`Komplementer esemény.`, expl: R`$1 - \dfrac{\pi}{16} \approx 0{,}8037$.` },
      { q: R`Mekkora sugarú piros mezővel lenne a találat valószínűsége pontosan $\dfrac{1}{4}$? Add meg cm-ben, két tizedesjegyre kerekítve.`, answer: { type: 'num', value: 5.64, tol: 0.01 }, ansTex: R`r = \dfrac{10}{\sqrt{\pi}} \approx 5{,}64`, verify: '10/sqrt(pi)',
        hint: R`Oldd meg: $\dfrac{r^2 \pi}{400} = \dfrac{1}{4}$.`, expl: R`$r^2 \pi = 100$, így $r = \dfrac{10}{\sqrt{\pi}} \approx 5{,}64$ cm (ez kisebb a tábla félélének hosszánál, ami $10$ cm, tehát elfér a táblán).` }],
    final: R`Tábla: $400$ cm², piros mező: $25\pi \approx 78{,}54$ cm², a találat valószínűsége $\dfrac{\pi}{16} \approx 0{,}1963$; a $\dfrac{1}{4}$ valószínűséghez kb. $5{,}64$ cm sugár kell.` });
})(typeof window !== 'undefined' ? window : globalThis);
