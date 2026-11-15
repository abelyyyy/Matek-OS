/* MATEK OS – tananyag: Algebra 2.5–2.7, 2.9 (hatvány-gyök-logaritmus, betűkifejezések, arányosság-százalék, középértékek) */
(function (root) {
  'use strict';
  var MO = root.MO = root.MO || {};
  var K = MO.taskKit, R = K.R, def = K.def, Q = MO.Q;
  MO.content = MO.content || {};

  /* ---------- segédek ---------- */
  function rt(n, x) { return n === 2 ? '\\sqrt{' + x + '}' : '\\sqrt[' + n + ']{' + x + '}'; }
  function divisors(n) { var d = [], i; for (i = 1; i <= n; i++) if (n % i === 0) d.push(i); return d; }
  function pw(a, k) { return Math.pow(a, k); }
  function pct(x) { return K.T(x) + '\\%'; }

  /* ================= 2.5 HATVÁNY, GYÖK, LOGARITMUS ================= */
  MO.content['algebra/hatvanygyoklog'] = {
    intro: R`A hatványozás, a gyökvonás és a logaritmus egyetlen nagy család: ugyanazt a kapcsolatot ($a^x = b$) három irányból nézzük. A követelmény 2.5 pontja szerint ismerned kell a hatványozást racionális kitevővel, a hatványozás és a gyökvonás azonosságait, a logaritmus fogalmát, emelt szinten pedig a logaritmus azonosságait és az áttérést más alapra, bizonyítással együtt. Ez az exponenciális és logaritmusos egyenletek, a kamatszámítás és a függvényvizsgálat alapja.`,
    theory: [
      { h: 'Hatvány egész kitevővel, a permanencia elve',
        b: R`Pozitív egész $n$-re $a^n = \underbrace{a \cdot a \cdots a}_{n\text{ tényező}}$. Ha $a \neq 0$, akkor $a^0 = 1$ és $a^{-n} = \dfrac{1}{a^n}$. A $0^0$ és a negatív kitevős $0$ hatvány **nincs értelmezve**.\n**Miért pont így?** (permanencia elve, emelt szint) Azt szeretnénk, hogy a pozitív kitevőkre ismert azonosságok továbbra is igazak maradjanak. Ha $a^n \cdot a^0 = a^{n+0} = a^n$ érvényes, akkor $a^0$ csak $1$ lehet; ha $a^n \cdot a^{-n} = a^0 = 1$, akkor $a^{-n} = \dfrac{1}{a^n}$. Ugyanez a gondolat vezet majd a törtkitevőhöz is.` },
      { h: 'A hatványozás azonosságai',
        b: R`Ha az alapok és kitevők értelmesek ($a, b$ nem nulla, vagy a kitevő pozitív egész), akkor:\n$$a^k \cdot a^m = a^{k+m}, \qquad \dfrac{a^k}{a^m} = a^{k-m}, \qquad (a^k)^m = a^{k \cdot m}$$\n$$(a \cdot b)^k = a^k \cdot b^k, \qquad \left(\dfrac{a}{b}\right)^k = \dfrac{a^k}{b^k}$$\nGyakorlatban: azonos alapú hatványokat az **alap megtartásával** szorzunk (kitevők összeadódnak), azonos kitevőjűeket a **kitevő megtartásával** (alapok szorzódnak). Ügyelj: $-2^4 = -16$, de $(-2)^4 = 16$.`,
        proof: R`Középszint (konkrét alap, pozitív egész kitevő): $2^3 \cdot 2^4 = (2\cdot2\cdot2)(2\cdot2\cdot2\cdot2) = 2^7$, mert összesen $3+4$ tényező van; $(2^3)^2 = 2^3 \cdot 2^3 = 2^6$; $(2\cdot3)^3 = (2\cdot3)(2\cdot3)(2\cdot3) = 2^3 \cdot 3^3$ a szorzás felcserélhetősége miatt.\nEmelt szint (egész kitevő): pozitív $k, m$-re az $a^k a^m = a^{k+m}$ a tényezők megszámlálásából jön. Ha $m = -j < 0$, akkor $a^k a^{-j} = \dfrac{a^k}{a^j}$; ha $k > j$, $j$ tényezőt lehet egyszerűsíteni és $a^{k-j}$ marad, ha $k < j$, akkor $\dfrac{1}{a^{j-k}} = a^{k-j}$. Ha $k$ vagy $m$ nulla, az $a^0=1$ definíció adja az állítást. A többi azonosság ugyanígy, esetszétválasztással igazolható.` },
      { h: 'Az n-edik gyök és a négyzetgyök',
        b: R`Legyen $n \geq 2$ egész, $a \geq 0$. Az $\sqrt[n]{a}$ az a **nemnegatív** szám, amelynek $n$-edik hatványa $a$. Például $\sqrt{49} = 7$ (nem $\pm 7$!), $\sqrt[3]{125} = 5$.\nFontos: $\sqrt{a^2} = |a|$ minden valós $a$-ra, mert a négyzetgyök sosem negatív. Páratlan $n$ esetén (kiegészítés) negatív alapra is van gyök, pl. $\sqrt[3]{-8} = -2$, de a követelmény a nemnegatív alapú gyökre épít.\n**Négyzetgyök azonosságai** ($a, b \geq 0$, a másodiknál $b > 0$):\n$$\sqrt{a \cdot b} = \sqrt{a} \cdot \sqrt{b}, \qquad \sqrt{\dfrac{a}{b}} = \dfrac{\sqrt{a}}{\sqrt{b}}$$\nFigyelem: $\sqrt{a + b} \neq \sqrt{a} + \sqrt{b}$ (pl. $\sqrt{9+16} = 5$, de $3 + 4 = 7$).`,
        proof: R`(Emelt: a négyzetgyökvonás azonosságainak bizonyítása.) A $\sqrt{ab}$ definíció szerint az egyetlen nemnegatív szám, amelynek négyzete $ab$. A $\sqrt{a} \cdot \sqrt{b}$ nemnegatív (két nemnegatív szám szorzata), és négyzete $(\sqrt{a}\sqrt{b})^2 = (\sqrt{a})^2 (\sqrt{b})^2 = ab$. Tehát $\sqrt{a}\sqrt{b}$ ugyanaz a nemnegatív szám, mint $\sqrt{ab}$. A hányadosnál ugyanígy: $\dfrac{\sqrt{a}}{\sqrt{b}} \geq 0$ és négyzete $\dfrac{a}{b}$.` },
      { h: 'A gyökvonás azonosságai, gyöktelenítés',
        b: R`Ha $a, b \geq 0$ (nevezőben pozitív), $n, k \geq 2$ egész, akkor:\n$$\sqrt[n]{a \cdot b} = \sqrt[n]{a}\cdot\sqrt[n]{b}, \qquad \sqrt[n]{\dfrac{a}{b}} = \dfrac{\sqrt[n]{a}}{\sqrt[n]{b}}, \qquad \left(\sqrt[n]{a}\right)^k = \sqrt[n]{a^k}, \qquad \sqrt[k]{\sqrt[n]{a}} = \sqrt[nk]{a}$$\nEzekkel a gyökös kifejezések egyszerűsíthetők: $\sqrt[3]{54} = \sqrt[3]{27 \cdot 2} = 3\sqrt[3]{2}$. **Gyöktelenítés** (a nevező gyökmentessé tétele): $\dfrac{1}{\sqrt{a}} = \dfrac{\sqrt{a}}{a}$, és konjugálttal bővítve $\dfrac{1}{\sqrt{a} - \sqrt{b}} = \dfrac{\sqrt{a} + \sqrt{b}}{a - b}$ ($a \neq b$).`,
        proof: R`A bizonyítás a négyzetgyökéhez hasonló: $\sqrt[n]{a}\sqrt[n]{b}$ nemnegatív, és $n$-edik hatványa $\left(\sqrt[n]{a}\right)^n \left(\sqrt[n]{b}\right)^n = ab$, ezért egyenlő $\sqrt[n]{ab}$-vel. A hatványozásos azonosság: $\left(\sqrt[n]{a}\right)^k$ nemnegatív, $n$-edik hatványa $\left(\sqrt[n]{a}\right)^{nk} = \left(\left(\sqrt[n]{a}\right)^n\right)^k = a^k$.` },
      { h: 'Racionális kitevő, irracionális kitevő szemléletesen',
        b: R`Ha $a > 0$, $p$ egész, $q \geq 1$ egész, akkor $$a^{\frac{p}{q}} = \sqrt[q]{a^p} = \left(\sqrt[q]{a}\right)^p, \qquad \text{pl. } 8^{\frac{2}{3}} = \left(\sqrt[3]{8}\right)^2 = 4, \quad 16^{-\frac{3}{4}} = \dfrac{1}{8}.$$ Az alapnak pozitívnak kell lennie, különben az értelmezés ellentmondásos lenne (pl. $(-1)^{\frac{1}{3}}$ és $(-1)^{\frac{2}{6}}$ eltérő módon viselkedne). Az értelmezés azért pont ilyen, mert a hatványozás azonosságai (permanencia) megmaradnak: $\left(a^{\frac{1}{q}}\right)^q = a^1 = a$. Így a gyökök is hatványként írhatók, és az összes hatványazonosság használható gyökös kifejezéseken is.\n**Irracionális kitevő (emelt, szemléletesen):** $a^{\sqrt{2}}$ ($a > 0$) azt a számot jelenti, amelyhez az $a^{1}, a^{1{,}4}, a^{1{,}41}, a^{1{,}414}, \dots$ hatványok egyre jobban közelednek. A hatványozás azonosságai és a monotonitás itt is érvényesek: $a > 1$ esetén az $x \mapsto a^x$ szigorúan növő, $0 < a < 1$ esetén szigorúan csökkenő, és $a^x > 0$ minden $x$-re.` },
      { h: 'A logaritmus fogalma',
        b: R`Legyen $a > 0$, $a \neq 1$ és $b > 0$. A $b$ szám $a$ alapú logaritmusa az a kitevő, amelyre $a$-t emelve $b$-t kapjuk:\n$$\log_a b = x \iff a^x = b.$$\nPéldák: $\log_2 32 = 5$, mert $2^5 = 32$; $\log_3 \dfrac{1}{9} = -2$; $\log_{10} 1000 = 3$. Kikötések: az alap pozitív és nem $1$, az argumentum **pozitív**; negatív számnak és nullának nincs logaritmusa. A 10-es alapú logaritmus jele $\lg$, az $e$ alapúé $\ln$.\nKövetkezmények: $a^{\log_a b} = b$, $\log_a a^x = x$, $\log_a 1 = 0$, $\log_a a = 1$. A logaritmus tehát az exponenciális egyenlet megoldásának eszköze: $a^x = b \Rightarrow x = \log_a b$.` },
      { h: 'A logaritmus azonosságai', level: 'emelt',
        b: R`Ha $a > 0$, $a \neq 1$, $x, y > 0$ és $k$ valós:\n$$\log_a (x \cdot y) = \log_a x + \log_a y, \qquad \log_a \dfrac{x}{y} = \log_a x - \log_a y, \qquad \log_a x^k = k \cdot \log_a x.$$\nA szorzat logaritmusa tehát összeg, a hányadosé különbség, a hatványé a kitevő szorosa. Figyelem: $\log_a (x + y)$ **nem** bontható szét, és $\dfrac{\log_a x}{\log_a y} \neq \log_a \dfrac{x}{y}$. Egyenleteknél az átalakítás megváltoztathatja az értelmezési tartományt (pl. $\log_a x^2 = 2\log_a x$ csak $x > 0$-ra igaz; általában $2\log_a |x|$), ezért mindig ellenőrizz.`,
        proof: R`Legyen $\log_a x = u$ és $\log_a y = v$, azaz $x = a^u$, $y = a^v$. Szorzat: $xy = a^u a^v = a^{u+v}$, ezért $\log_a(xy) = u + v = \log_a x + \log_a y$. Hányados: $\dfrac{x}{y} = \dfrac{a^u}{a^v} = a^{u-v}$, így $\log_a \dfrac{x}{y} = u - v$. Hatvány: $x^k = (a^u)^k = a^{uk}$, tehát $\log_a x^k = k u = k \log_a x$. Mindhárom lépés a hatványozás azonosságaira és a logaritmus definíciójára épül.` },
      { h: 'Áttérés más alapra',
        b: R`Ha $a, c > 0$, $a, c \neq 1$ és $b > 0$, akkor\n$$\log_a b = \dfrac{\log_c b}{\log_c a}.$$\nKülönösen hasznos $c = 10$ vagy $c = e$ esetén, mert a zsebszámológépen általában csak $\lg$ és $\ln$ gomb van: $\log_5 20 = \dfrac{\lg 20}{\lg 5} \approx 1{,}86$ (középszinten is elvárt). Speciális eset: $\log_a b = \dfrac{1}{\log_b a}$ ($b \neq 1$). Ezzel az exponenciális egyenlet megoldása: $3^x = 50 \Rightarrow x = \log_3 50 = \dfrac{\lg 50}{\lg 3} \approx 3{,}56$.`,
        proof: R`(Emelt: az áttérési szabály bizonyítása.) Legyen $x = \log_a b$, azaz $a^x = b$. Vegyük mindkét oldal $c$ alapú logaritmusát: $\log_c a^x = \log_c b$. A hatvány logaritmusának azonossága szerint $x \cdot \log_c a = \log_c b$, és mivel $\log_c a \neq 0$ (hiszen $a \neq 1$), $x = \dfrac{\log_c b}{\log_c a}$.` }
    ],
    examples: [
      { t: 'Racionális kitevős hatványok értéke',
        p: R`Számítsd ki számológép nélkül: $16^{\frac{3}{4}} + 125^{-\frac{2}{3}}$.`,
        steps: [R`Az alapok pozitívak, így a törtkitevő gyökvonást jelent: $16^{\frac{3}{4}} = \left(\sqrt[4]{16}\right)^3$.`,
          R`$\sqrt[4]{16} = 2$, mert $2^4 = 16$, ezért $16^{\frac{3}{4}} = 2^3 = 8$.`,
          R`$125^{-\frac{2}{3}} = \dfrac{1}{125^{\frac{2}{3}}} = \dfrac{1}{\left(\sqrt[3]{125}\right)^2} = \dfrac{1}{5^2} = \dfrac{1}{25}$.`,
          R`Összeg: $8 + \dfrac{1}{25} = \dfrac{201}{25} = 8{,}04$.`],
        ans: R`A kifejezés értéke $\dfrac{201}{25} = 8{,}04$.`,
        checks: [['16^(3/4)', '8'], ['125^(-2/3)', '1/25'], ['16^(3/4)+125^(-2/3)', '201/25']] },
      { t: 'Logaritmus kiszámítása a definícióból',
        p: R`Számítsd ki: $\log_3 81 - \log_2 32 + \lg 0{,}001$.`,
        steps: [R`$\log_3 81 = 4$, mert $3^4 = 81$.`,
          R`$\log_2 32 = 5$, mert $2^5 = 32$.`,
          R`$\lg 0{,}001 = -3$, mert $10^{-3} = \dfrac{1}{1000} = 0{,}001$.`,
          R`Összegezve: $4 - 5 + (-3) = -4$.`],
        ans: R`A kifejezés értéke $-4$.`,
        checks: [['log(3;81)', '4'], ['log(2;32)', '5'], ['lg(0,001)', '-3'], ['log(3;81)-log(2;32)+lg(0,001)', '-4']] },
      { t: 'Exponenciális egyenlet áttéréssel',
        p: R`Hány év alatt éri el egy betét a kétszeresét, ha évi $4\%$-os kamatos kamatot kap? (Két tizedesre kerekítsd.)`,
        steps: [R`Az $n$ év utáni érték a kezdeti $T$-hez képest $T \cdot 1{,}04^n$. Azt keressük, mikor lesz ez $2T$: $1{,}04^n = 2$.`,
          R`Az egyenlet mindkét oldala pozitív, vegyük $10$-es alapú logaritmusát: $n \cdot \lg 1{,}04 = \lg 2$. Ez ekvivalens átalakítás, mert a logaritmus szigorúan monoton.`,
          R`$n = \dfrac{\lg 2}{\lg 1{,}04} \approx \dfrac{0{,}30103}{0{,}01703} \approx 17{,}67$.`,
          R`Ellenőrzés: $1{,}04^{17} \approx 1{,}948 < 2$, $1{,}04^{18} \approx 2{,}026 > 2$, tehát a kétszeres érték a $17$. és $18$. év között jön el.`],
        ans: R`A betét kb. $17{,}67$ év alatt éri el a kétszeresét; kamatjóváírás évente történik, így $18$ év után lesz először legalább kétszeres.`,
        checks: [['lg(2)/lg(1,04)', 'log(1,04;2)'], ['1,04^17', '1,947900496'], ['1,04^18', '2,025816515']] },
      { t: 'Logaritmusos egyenlet értelmezési tartománnyal',
        p: R`Oldd meg a valós számok halmazán: $\log_2 x + \log_2 (x - 2) = 3$.`,
        steps: [R`**Kikötés:** $x > 0$ és $x - 2 > 0$, vagyis $x > 2$.`,
          R`A szorzat logaritmusának azonosságával (a kikötés mellett érvényes): $\log_2 \big(x(x-2)\big) = 3$.`,
          R`A definíció szerint $x(x-2) = 2^3 = 8$, azaz $x^2 - 2x - 8 = 0$.`,
          R`Megoldóképlet: $x = \dfrac{2 \pm \sqrt{4 + 32}}{2} = \dfrac{2 \pm 6}{2}$, tehát $x_1 = 4$ és $x_2 = -2$.`,
          R`A $-2$ nem felel meg a kikötésnek ($-2 < 2$), hamis gyök. Ellenőrzés $x = 4$-re: $\log_2 4 + \log_2 2 = 2 + 1 = 3$. \checkmark`],
        ans: R`Az egyenlet egyetlen megoldása $x = 4$.`,
        checks: [['4*(4-2)', '8'], ['4^2-2*4-8', '0'], ['(-2)^2-2*(-2)-8', '0'], ['log(2;4)+log(2;4-2)', '3']] }
    ],
    sims: ['exp-log', 'hatvanyfv'],
    mistakes: [
      R`$(a + b)^2 = a^2 + b^2$ és $\sqrt{a + b} = \sqrt{a} + \sqrt{b}$ hamis. A hatványozás és a gyökvonás csak szorzásra és osztásra „megy át”, összeadásra nem. Ugyanez a logaritmusra: $\log(x+y) \neq \log x + \log y$.`,
      R`$\sqrt{x^2} = x$ helyett helyesen $\sqrt{x^2} = |x|$. Pl. $\sqrt{(-3)^2} = 3$, nem $-3$.`,
      R`Az $a^x$ kitevőinél előjel- és zárójelhiba: $-3^2 = -9$, de $(-3)^2 = 9$; $2^{-3} = \dfrac{1}{8}$, nem $-8$.`,
      R`Logaritmusos egyenletnél elmarad a kikötés (argumentum $> 0$), és a hamis gyök bent marad. Az azonosságok alkalmazása után mindig ellenőrizz az eredeti egyenletbe behelyettesítve.`,
      R`$\dfrac{\log_a x}{\log_a y}$ összekeverése a $\log_a \dfrac{x}{y}$ kifejezéssel (a hányados logaritmusa különbség, nem hányados). Az áttérésnél az argumentum logaritmusa kerül a számlálóba: $\log_a b = \dfrac{\log b}{\log a}$.`,
      R`A törtkitevős hatvány értelmezésénél negatív alap használata: $(-8)^{\frac{1}{3}}$ hatványként nem értelmezett, csak $a > 0$ esetén használjuk a $a^{\frac{p}{q}}$ jelölést.`
    ],
    exam: R`Középszinten a hatványozás racionális kitevővel, az azonosságok használata, a (négyzet)gyökvonás azonosságainak alkalmazása, az $\sqrt[n]{a}$ és a logaritmus fogalmának definiálása és használata feladatokban, valamint tetszőleges alapú logaritmus kiszámítása $10$-es alapú logaritmussal követelmény; a hatványozás azonosságainak bizonyítása konkrét alap és pozitív egész kitevő esetén. Emelt szinten ezen felül a permanencia elve, az irracionális kitevő szemléletes értelmezése, a hatványozás azonosságainak bizonyítása egész kitevőre, a négyzetgyökvonás azonosságainak bizonyítása, a szorzat, hányados és hatvány logaritmusára vonatkozó azonosságok ismerete és bizonyítása, valamint az áttérés szabályának bizonyítása és alkalmazása.`,
    cheat: [R`a^k a^m = a^{k+m}, \quad (a^k)^m = a^{km}, \quad a^{-n} = \dfrac{1}{a^n}`, R`a^{\frac{p}{q}} = \sqrt[q]{a^p} \quad (a > 0)`, R`\sqrt{ab} = \sqrt{a}\sqrt{b}, \quad \sqrt{a^2} = |a|`, R`\log_a b = x \iff a^x = b \quad (a>0,\ a\neq1,\ b>0)`, R`\log_a(xy) = \log_a x + \log_a y, \quad \log_a \dfrac{x}{y} = \log_a x - \log_a y`, R`\log_a x^k = k\log_a x, \quad \log_a b = \dfrac{\log_c b}{\log_c a}`],
    cheatChecks: [['log(a;b)', 'lg(b)/lg(a)'], ['log(a;x^3)', '3*log(a;x)']],
    terms: ['hatvány', 'kitevő', 'permanencia elve', 'n-edik gyök', 'gyöktelenítés', 'logaritmus', 'áttérés más alapra', 'értelmezési tartomány', 'hamis gyök']
  };

  /* ================= 2.6 BETŰKIFEJEZÉSEK ================= */
  MO.content['algebra/betukifejezesek'] = {
    intro: R`A betűkifejezések kezelése az egész algebra gerince: egyenletek megoldása, függvények vizsgálata és bizonyítások mind átalakításokra épülnek. A követelmény 2.6 pontja szerint a nevezetes azonosságok (kifejtés és szorzattá alakítás), az összevonás, kiemelés, algebrai kifejezések egyszerűsítése tartozik ide; emelt szinten a polinom fokszáma és rendezett alakja, valamint az $a^n - b^n$ és az $a^{2n+1} + b^{2n+1}$ kifejezések szorzattá alakítása.`,
    theory: [
      { h: 'Polinomok, fokszám, rendezett alak', level: 'emelt',
        b: R`**Polinom** (többtagú egész kifejezés) az $a_n x^n + a_{n-1}x^{n-1} + \dots + a_1 x + a_0$ alakú kifejezés. Ha $a_n \neq 0$, a polinom **foka** $n$ ($a_n$ a főegyüttható). Ha a tagokat a fokszám szerint csökkenő sorrendbe tesszük, **rendezett alakot** kapunk: $x^3 - 4x^2 + 5$ (a hiányzó tag együtthatója $0$). Műveletek: összevonáskor csak az **azonos fokú** tagok vonhatók össze; szorzáskor minden tagot minden taggal megszorzunk, és az azonos fokúakat összevonjuk. Két polinom összegének foka legfeljebb a nagyobb fok, **szorzatuk foka a fokok összege**: $\deg(PQ) = \deg P + \deg Q$ (nem nulla polinomokra). Például $(x^2 + 1)(x^3 - x)$ fokszáma $5$.` },
      { h: 'Nevezetes azonosságok',
        b: R`Mindhárom azonosság minden valós $a, b$-re igaz:\n$$(a + b)^2 = a^2 + 2ab + b^2, \qquad (a - b)^2 = a^2 - 2ab + b^2, \qquad a^2 - b^2 = (a + b)(a - b).$$\nKét irányban használjuk: **kifejtésre** ($(3x - 4)^2 = 9x^2 - 24x + 16$) és **szorzattá alakításra** ($x^2 - 25 = (x - 5)(x + 5)$). Fejszámolásnál is: $97 \cdot 103 = 100^2 - 3^2 = 9991$. Kiegészítés (nem követelmény, de hasznos): $(a \pm b)^3 = a^3 \pm 3a^2 b + 3ab^2 \pm b^3$.`,
        proof: R`Az első: $(a + b)^2 = (a + b)(a + b) = a^2 + ab + ba + b^2 = a^2 + 2ab + b^2$. A második ugyanígy, vagy $b$ helyére $-b$-t írva. A harmadik: $(a + b)(a - b) = a^2 - ab + ba - b^2 = a^2 - b^2$.` },
      { h: 'Szorzattá alakítás módszerei',
        b: R`A szorzattá alakítás (faktorizálás) célja, hogy a kifejezés szorzat legyen: így látszik, mikor nulla, és egyszerűsíthető.\n1. **Kiemelés**: $6x^3 - 9x^2 = 3x^2(2x - 3)$.\n2. **Csoportosítás**: $ax + ay + bx + by = a(x + y) + b(x + y) = (a + b)(x + y)$.\n3. **Nevezetes azonosság**: $4x^2 - 12x + 9 = (2x - 3)^2$; $9x^2 - y^2 = (3x - y)(3x + y)$.\n4. **Teljes négyzetté alakítás** után különbségi azonosság: $x^2 + 6x + 5 = (x + 3)^2 - 4 = (x + 1)(x + 5)$.\nÁltalában előbb kiemelünk, aztán nézzük a nevezetes azonosságokat. Mindig ellenőrizz: a kapott szorzat visszaszorzásával az eredeti kifejezést kell kapnod.` },
      { h: 'Az a^n − b^n és az a^{2n+1} + b^{2n+1} szorzattá alakítása', level: 'emelt',
        b: R`Minden pozitív egész $n$-re:\n$$a^n - b^n = (a - b)\left(a^{n-1} + a^{n-2} b + a^{n-3} b^2 + \dots + a b^{n-2} + b^{n-1}\right),$$\n$$a^{2n+1} + b^{2n+1} = (a + b)\left(a^{2n} - a^{2n-1} b + a^{2n-2} b^2 - \dots - a b^{2n-1} + b^{2n}\right).$$\nPéldák: $x^3 - 1 = (x - 1)(x^2 + x + 1)$; $x^5 + 32 = (x + 2)(x^4 - 2x^3 + 4x^2 - 8x + 16)$. Következmény oszthatósághoz: $a - b \mid a^n - b^n$, és $a + b \mid a^{2n+1} + b^{2n+1}$ (egész $a, b$-re); pl. $3^{2n+1} + 2^{2n+1}$ minden $n$-re osztható $5$-tel. Az $a^2 + b^2$ például nem bontható szorzattá a valós számok körében.`,
        proof: R`Az első azonosság: bontsuk fel a jobb oldalt: $(a - b)\sum_{k=0}^{n-1} a^{n-1-k} b^k = \sum_{k=0}^{n-1} a^{n-k} b^k - \sum_{k=0}^{n-1} a^{n-1-k} b^{k+1}$. A két összeg „teleszkopikusan” egyszerűsödik, csak $a^n$ és $-b^n$ marad. A második azonosság az elsőből jön, ha $b$ helyére $-b$-t írunk: a páratlan $2n+1$ kitevő miatt $(-b)^{2n+1} = -b^{2n+1}$, ezért $a^{2n+1} + b^{2n+1} = a^{2n+1} - (-b)^{2n+1} = (a + b)\left(a^{2n} - a^{2n-1} b + \dots + b^{2n}\right)$.` },
      { h: 'Algebrai törtek: értelmezés, egyszerűsítés',
        b: R`Algebrai tört: két polinom hányadosa, $\dfrac{A}{B}$. Csak azokra az értékekre értelmezett, ahol $B \neq 0$; ezt mindig **kikötésként** írjuk fel, **még az egyszerűsítés előtt**. Egyszerűsíteni csak a szorzatban álló tényezővel lehet (nem tagonként): $\dfrac{x^2 - 4}{x^2 - 4x + 4} = \dfrac{(x - 2)(x + 2)}{(x - 2)^2} = \dfrac{x + 2}{x - 2}$, ahol $x \neq 2$. Bővítéskor a számlálót és a nevezőt ugyanazzal a nemnulla kifejezéssel szorozzuk. Az eredeti és az egyszerűsített kifejezés csak a kikötésekkel együtt egyenlő.` },
      { h: 'Műveletek algebrai törtekkel',
        b: R`**Összeadás/kivonás**: közös nevezőre hozunk (legkisebb közös többszörös: szorzattá alakított nevezők legbővebb tényezői), majd a számlálókat összevonjuk: $\dfrac{1}{x - 1} - \dfrac{1}{x + 1} = \dfrac{(x + 1) - (x - 1)}{x^2 - 1} = \dfrac{2}{x^2 - 1}$.\n**Szorzás**: számláló a számlálóval, nevező a nevezővel; előtte érdemes szorzattá alakítani és egyszerűsíteni. **Osztás**: a második tört reciprokával szorzunk, ehhez a második tört számlálója is $\neq 0$ legyen: $\dfrac{A}{B} : \dfrac{C}{D} = \dfrac{A}{B} \cdot \dfrac{D}{C}$ ($B, C, D \neq 0$).\nA kikötéseket az eredeti kifejezés minden nevezőjéből és az osztó értékéből kell összegyűjteni.` },
      { h: 'Azonosság igazolása, kifejezés értéke, teljes négyzet',
        b: R`Azonosságot (pl. $\left(a + \dfrac{1}{a}\right)^2 - \left(a - \dfrac{1}{a}\right)^2 = 4$) úgy igazolunk, hogy az egyik oldalt ekvivalens átalakításokkal a másikra hozzuk, vagy mindkettőt ugyanarra az alakra. Egy kifejezés értékének számolásánál először egyszerűsíts, utána helyettesíts be.\n**Teljes négyzetté alakítás**: $x^2 + px + q = \left(x + \dfrac{p}{2}\right)^2 + q - \dfrac{p^2}{4}$. Ebből látszik, hogy a kifejezés legkisebb értéke $q - \dfrac{p^2}{4}$, amelyet $x = -\dfrac{p}{2}$-nél vesz fel. Ez az alapja sok szélsőérték-feladatnak és a másodfokú egyenlet megoldóképletének.` }
    ],
    examples: [
      { t: 'Szorzattá alakítás nevezetes azonosságokkal',
        p: R`Alakítsd szorzattá: $9x^2 - 24x + 16 - y^2$.`,
        steps: [R`Az első három tag teljes négyzet: $9x^2 - 24x + 16 = (3x - 4)^2$, mert $2 \cdot 3x \cdot 4 = 24x$.`,
          R`Így az eredeti kifejezés $(3x - 4)^2 - y^2$, ami két négyzet különbsége.`,
          R`A különbségi azonosság szerint $(3x - 4)^2 - y^2 = (3x - 4 - y)(3x - 4 + y)$.`,
          R`Ellenőrzés visszaszorzással: $(3x - 4)^2 - y^2 = 9x^2 - 24x + 16 - y^2$. \checkmark`],
        ans: R`$9x^2 - 24x + 16 - y^2 = (3x - y - 4)(3x + y - 4)$.`,
        checks: [['9x^2-24x+16', '(3x-4)^2'], ['9x^2-24x+16-y^2', '(3x-4-y)(3x-4+y)']] },
      { t: 'Algebrai tört egyszerűsítése',
        p: R`Egyszerűsítsd a $\left(\dfrac{1}{x - 1} - \dfrac{1}{x + 1}\right) : \dfrac{2}{x^2 - 1}$ kifejezést, és add meg, mely $x$-ekre értelmezett.`,
        steps: [R`**Kikötés:** $x \neq 1$, $x \neq -1$ (a nevezők miatt); a $\dfrac{2}{x^2 - 1}$ tört értéke sosem nulla, így az osztás ezen felül nem szab feltételt.`,
          R`Közös nevező: $\dfrac{1}{x - 1} - \dfrac{1}{x + 1} = \dfrac{(x + 1) - (x - 1)}{(x - 1)(x + 1)} = \dfrac{2}{x^2 - 1}$.`,
          R`Az osztás: $\dfrac{2}{x^2 - 1} : \dfrac{2}{x^2 - 1} = 1$.`,
          R`Ellenőrzés $x = 3$-ra: $\left(\dfrac{1}{2} - \dfrac{1}{4}\right) : \dfrac{2}{8} = \dfrac{1}{4} : \dfrac{1}{4} = 1$. \checkmark`],
        ans: R`A kifejezés értéke minden $x \neq \pm 1$ esetén $1$.`,
        checks: [['1/(x-1)-1/(x+1)', '2/(x^2-1)'], ['(1/2-1/4)/(2/8)', '1'], ['(1/(3-1)-1/(3+1))/(2/(3^2-1))', '1']] },
      { t: 'Oszthatóság igazolása szorzattá alakítással',
        p: R`Igazold, hogy $3^{2n+1} + 2^{2n+1}$ minden pozitív egész $n$-re osztható $5$-tel.`,
        steps: [R`A kitevő páratlan szám, $2n + 1$ alakú, ezért használható az $a^{2n+1} + b^{2n+1} = (a + b)(\dots)$ szorzattá alakítás $a = 3$, $b = 2$ választással.`,
          R`Eszerint $3^{2n+1} + 2^{2n+1} = (3 + 2)\left(3^{2n} - 3^{2n-1}\cdot 2 + \dots + 2^{2n}\right)$.`,
          R`A második tényező egész szám (egész számok összege és különbsége), így az egész kifejezés $5$-nek és egy egész számnak a szorzata.`,
          R`Ellenőrzés $n = 2$-re: $3^5 + 2^5 = 243 + 32 = 275 = 5 \cdot 55$, és a zárójel: $81 - 54 + 36 - 24 + 16 = 55$. \checkmark`],
        ans: R`A kifejezés $5 \cdot (\text{egész szám})$ alakú, tehát minden pozitív egész $n$-re osztható $5$-tel.`,
        checks: [['3^5+2^5', '275'], ['275/5', '55'], ['81-54+36-24+16', '55'], ['3^5+2^5', '(3+2)*(3^4-3^3*2+3^2*2^2-3*2^3+2^4)']] },
      { t: 'Hatványkülönbség egyszerűsítése tört alakban',
        p: R`Egyszerűsítsd az $\dfrac{x^6 - 1}{x^2 - 1}$ törtet. Mi a kikötés?`,
        steps: [R`**Kikötés:** $x^2 - 1 \neq 0$, tehát $x \neq 1$ és $x \neq -1$.`,
          R`Az $a^n - b^n$ azonosság $n = 3$-ra, $a = x^2$, $b = 1$ választással: $x^6 - 1 = (x^2)^3 - 1^3 = (x^2 - 1)(x^4 + x^2 + 1)$.`,
          R`Egyszerűsítünk az $x^2 - 1$ tényezővel (ez a kikötés miatt nem nulla): $\dfrac{x^6 - 1}{x^2 - 1} = x^4 + x^2 + 1$.`,
          R`Ellenőrzés $x = 2$-re: $\dfrac{64 - 1}{4 - 1} = 21$ és $16 + 4 + 1 = 21$. \checkmark`],
        ans: R`$\dfrac{x^6 - 1}{x^2 - 1} = x^4 + x^2 + 1$, ha $x \neq \pm 1$.`,
        checks: [['x^6-1', '(x^2-1)(x^4+x^2+1)'], ['(2^6-1)/(2^2-1)', '21'], ['2^4+2^2+1', '21']] }
    ],
    sims: ['azonossag', 'masodfoku'],
    mistakes: [
      R`$(a + b)^2 = a^2 + b^2$: hiányzik a kétszeres szorzat, a helyes: $a^2 + 2ab + b^2$. Ugyanígy $(a - b)^2 = a^2 - 2ab + b^2$, nem $a^2 - b^2$.`,
      R`Algebrai törtnél tagonkénti egyszerűsítés: $\dfrac{x + 3}{3} \neq x + 1$ és $\dfrac{x^2 + 4}{x + 2} \neq x + 2$. Csak szorzat tényezőit lehet egyszerűsíteni, ezért előbb szorzattá kell alakítani.`,
      R`Az értelmezési tartomány elfelejtése: $\dfrac{x^2 - 4}{x - 2} = x + 2$ csak $x \neq 2$ esetén igaz. A kikötést az eredeti kifejezés nevezőiből kell felírni.`,
      R`Előjelhiba zárójel előtti mínusznál: $a - (b - c) = a - b + c$, nem $a - b - c$. Hasonlóan $-(x - 3)^2 \neq (3 - x)^2$: az első mindig nempozitív, a második nemnegatív.`,
      R`Szorzattá alakításnál a kiemelés félbemarad: $6x^2 + 3x = 3x(2x + 1)$, nem $3(2x^2 + x)$ (ez még nem teljes kiemelés). Kiemelés után a zárójelben ugyanannyi tagnak kell maradnia, mint amennyi volt.`,
      R`Az $a^2 + b^2$ szorzattá alakítása a valós számok körében nem lehetséges, az $a^2 - b^2$ és az $a^3 + b^3$ azonban igen: a páratlan kitevőjű hatványösszeg és bármely hatványkülönbség bontható.`
    ],
    exam: R`Középszinten az $(a + b)^2$, $(a - b)^2$ és $a^2 - b^2$ kifejtése és szorzattá alakítása, valamint egyszerű algebrai műveletek (összevonás, szorzás, osztás, szorzattá alakítás kiemeléssel, nevezetes azonosságok) követelmény. Emelt szinten ismerned kell a polinom fokszámát és fokszám szerint rendezett alakját, és alkalmaznod kell az $a^n - b^n$, illetve az $a^{2n+1} + b^{2n+1}$ szorzattá alakítását feladatokban. Az algebrai átalakításokra egyenlet-, egyenlőtlenség- és függvényfeladatokban is szükség van.`,
    cheat: [R`(a \pm b)^2 = a^2 \pm 2ab + b^2`, R`a^2 - b^2 = (a - b)(a + b)`, R`a^n - b^n = (a - b)\left(a^{n-1} + a^{n-2}b + \dots + b^{n-1}\right)`, R`a^{2n+1} + b^{2n+1} = (a + b)\left(a^{2n} - a^{2n-1}b + \dots + b^{2n}\right)`, R`x^2 + px + q = \left(x + \dfrac{p}{2}\right)^2 + q - \dfrac{p^2}{4}`],
    cheatChecks: [['(a+b)^2', 'a^2+2ab+b^2'], ['(a-b)^2', 'a^2-2ab+b^2'], ['a^2-b^2', '(a-b)(a+b)'], ['a^5+b^5', '(a+b)(a^4-a^3b+a^2b^2-ab^3+b^4)'], ['a^4-b^4', '(a-b)(a^3+a^2b+ab^2+b^3)'], ['x^2+px+q', '(x+p/2)^2+q-p^2/4']],
    terms: ['polinom', 'fokszám', 'rendezett alak', 'nevezetes azonosság', 'szorzattá alakítás', 'kiemelés', 'algebrai tört', 'kikötés', 'teljes négyzetté alakítás']
  };

  /* ================= 2.7 ARÁNYOSSÁG, SZÁZALÉKSZÁMÍTÁS ================= */
  MO.content['algebra/aranyszazalek'] = {
    intro: R`Az arányosság és a százalékszámítás a mindennapi és az érettségi szöveges feladatok legfontosabb eszköze: árváltozás, kamat, oldatkeverés, munka és idő mind ide tartozik. A követelmény 2.7 pontja szerint ismerned kell az egyenes és a fordított arányosság definícióját és grafikonját, az arányosság fogalmát, a százalék fogalmát, és mindezt alkalmaznod kell feladatokban. A százalékszámítás kamatos kamattal, exponenciális folyamatokkal vagy statisztikai adatokkal együtt is előkerülhet.`,
    theory: [
      { h: 'Egyenes arányosság',
        b: R`Két mennyiség **egyenesen arányos**, ha az egyik értékének többszörözésekor a másik ugyanannyiszorosára változik, azaz hányadosuk állandó: $\dfrac{y}{x} = c$, vagyis $y = c \cdot x$ ($c \neq 0$ az arányossági tényező). Ha $x$ a kétszeresére nő, $y$ is a kétszeresére nő. Grafikonja az origón átmenő egyenes (szöveges feladatban általában félegyenes, mert a mennyiségek nemnegatívak). Példa: állandó egységár mellett a fizetendő összeg egyenesen arányos a mennyiséggel. Fontos: nem minden növekedés arányosság: a $y = 3x + 2$ összefüggés nem egyenes arányosság, mert nem megy át az origón.` },
      { h: 'Fordított arányosság',
        b: R`Két mennyiség **fordítottan arányos**, ha szorzatuk állandó: $x \cdot y = c$, vagyis $y = \dfrac{c}{x}$ ($c \neq 0$). Ha $x$ a kétszeresére nő, $y$ a felére csökken; ha $x$ a háromszorosára nő, $y$ a harmadára. Grafikonja hiperbola (pozitív mennyiségeknél egy ága, az első síknegyedben). Példa: ha $6$ munkás $10$ nap alatt végez egy munkával, akkor $15$ munkás $\dfrac{6 \cdot 10}{15} = 4$ nap alatt (a munkavégzés sebessége egyforma, a „munka” = munkás $\cdot$ nap állandó). Itt a szorzat az állandó, nem a hányados.` },
      { h: 'Arány, aránypár, osztás adott arányban',
        b: R`Az $a : b$ arány a két mennyiség hányadosa. **Aránypár**: $a : b = c : d$ ($b, d \neq 0$) pontosan akkor igaz, ha $ad = bc$ (a külső tagok szorzata egyenlő a belsőkével). Egy mennyiség **felosztása adott arányban**: ha $S$-t $a : b : c$ arányban osztjuk, akkor az egyes részek $S \cdot \dfrac{a}{a + b + c}$, $S \cdot \dfrac{b}{a + b + c}$, $S \cdot \dfrac{c}{a + b + c}$. Példa: $120$ eurót $2 : 3 : 5$ arányban osztunk, akkor $24$, $36$ és $60$ jut a részekre. Az arányt mindig azonos mértékegységben értelmezzük.` },
      { h: 'A százalék fogalma',
        b: R`A $p$ százalék ($p\%$) a $\dfrac{p}{100}$ szám. Három fogalom különböztethető meg: **alap** ($A$, ami a 100%), **százalékláb** ($p$) és **százalékérték** ($P$). Kapcsolatuk: $$P = A \cdot \dfrac{p}{100}.$$ Mindhárom kiszámítható a másik kettőből: $A = \dfrac{P \cdot 100}{p}$, $p = \dfrac{P}{A} \cdot 100$. Az alap mindig az, amihez viszonyítunk (pl. az eredeti ár). A százalék viszonyszám: $p\%$ nem egy tényleges mennyiség, hanem arány. A $100\%$ feletti értékek is értelmesek ($150\%$ az alap másfélszerese).` },
      { h: 'Százalékos változás, szorzótényezők',
        b: R`Egy mennyiség növelése $p\%$-kal azt jelenti, hogy az új érték az eredeti $\left(1 + \dfrac{p}{100}\right)$-szorosa; csökkentése $p\%$-kal: $\left(1 - \dfrac{p}{100}\right)$-szorosa. Egymás utáni változtatásoknál a szorzótényezők **összeszorzódnak**, nem összeadódnak: ha egy ár $20\%$-kal nő, majd $20\%$-kal csökken, a végső ár $1{,}2 \cdot 0{,}8 = 0{,}96$-szorosa, vagyis $4\%$-kal kevesebb, mint eredetileg. Visszafelé számolva osztunk a szorzótényezővel, nem „levonjuk a százalékot”. **Százalékpont**: két százalékérték különbsége. Ha a kamat $4\%$-ról $5\%$-ra nő, az $1$ százalékponttal, de $25\%$-kal nőtt ($\dfrac{5}{4} = 1{,}25$).` },
      { h: 'Kamatos kamat és exponenciális folyamatok',
        b: R`Ha egy $T$ kezdeti értéket évente $p\%$-os kamat növel úgy, hogy a kamat is kamatozik, az $n$ év múlva $$T_n = T \cdot q^n, \qquad q = 1 + \dfrac{p}{100}$$ (csökkenő folyamatnál $q = 1 - \dfrac{p}{100}$). Ez egy **mértani sorozat** (hányadosa $q$) vagy exponenciális függvény. Az $n$ kiszámításához logaritmus kell: $q^n = M \Rightarrow n = \dfrac{\lg M}{\lg q}$. Példa: $5\%$-os kamat mellett $\dfrac{\lg 2}{\lg 1{,}05} \approx 14{,}21$ év a megkétszerezés ideje. Az értelmezésre figyelj: a kamatjóváírás évente történik, ezért „hány teljes év” kérdésre felfelé kerekítés kell.` },
      { h: 'Keverési és oldatos feladatok, ár és ÁFA',
        b: R`**Keverés**: ha $m_1$ tömegű $c_1\%$-os és $m_2$ tömegű $c_2\%$-os oldatot keverünk, a kapott oldat $\dfrac{m_1 c_1 + m_2 c_2}{m_1 + m_2}\%$-os (a tiszta anyag mennyisége összeadódik). Ez súlyozott számtani közép, így az eredmény $c_1$ és $c_2$ között van. Egyenletet írunk fel: a tiszta anyag mennyisége az összeöntés előtt és után egyenlő.\n**Ár és ÁFA**: $27\%$ ÁFA mellett a bruttó ár $1{,}27$-szerese a nettónak; a nettó a bruttó $\dfrac{1}{1{,}27}$-szerese. Mindig tisztázd, melyik érték a $100\%$ (alap), mielőtt számolsz.` }
    ],
    examples: [
      { t: 'Egyenes és fordított arányosság',
        p: R`Egy munkát $6$ munkás $10$ nap alatt végez el, mindannyian egyforma ütemben dolgoznak. Hány nap alatt végez $15$ munkás?`,
        steps: [R`A munkások száma és az idő **fordítottan arányos**: ha többen dolgoznak, kevesebb nap kell. A szorzatuk (munkás $\cdot$ nap) a munka mennyiségét adja: $6 \cdot 10 = 60$ munkásnap.`,
          R`$15$ munkás esetén $15 \cdot x = 60$, tehát $x = \dfrac{60}{15} = 4$.`,
          R`Ellenőrzés: a munkások száma $2{,}5$-szeresére nőtt ($\dfrac{15}{6} = 2{,}5$), az idő $\dfrac{10}{2{,}5} = 4$ napra csökkent. \checkmark`],
        ans: R`$15$ munkás $4$ nap alatt végez.`,
        checks: [['6*10', '60'], ['6*10/15', '4'], ['15/6', '2,5'], ['10/2,5', '4']] },
      { t: 'Egymás utáni százalékos változások',
        p: R`Egy termék árát először $20\%$-kal emelték, majd $30\%$-kal csökkentették; így $21\,000$ Ft lett az ára. Mennyi volt az eredeti ár? Hány százalékkal változott összesen az ár?`,
        steps: [R`A szorzótényezők: emelés $1{,}2$, csökkentés $0{,}7$. Az összes változás szorzótényezője $1{,}2 \cdot 0{,}7 = 0{,}84$.`,
          R`Ha az eredeti ár $x$, akkor $x \cdot 0{,}84 = 21\,000$, innen $x = \dfrac{21\,000}{0{,}84} = 25\,000$.`,
          R`Ellenőrzés: $25\,000 \cdot 1{,}2 = 30\,000$, $30\,000 \cdot 0{,}7 = 21\,000$. \checkmark`,
          R`A teljes változás szorzótényezője $0{,}84$, ezért az ár összesen $16\%$-kal csökkent.`],
        ans: R`Az eredeti ár $25\,000$ Ft volt, az ár összesen $16\%$-kal csökkent.`,
        checks: [['1,2*0,7', '0,84'], ['21000/0,84', '25000'], ['25000*1,2', '30000'], ['30000*0,7', '21000']] },
      { t: 'Kamatos kamat: mennyi idő kell?',
        p: R`Egy bank évi $4{,}5\%$-os kamatot fizet, a kamatot évente tőkésíti. Legalább hány év után lesz a betét értéke legalább másfélszerese a befizetettnek?`,
        steps: [R`A tőke $n$ év után $T \cdot 1{,}045^n$. Feltétel: $1{,}045^n \geq 1{,}5$.`,
          R`Mindkét oldal pozitív, logaritmust véve (a $\lg$ szigorúan növő, az egyenlőtlenség iránya megmarad): $n \cdot \lg 1{,}045 \geq \lg 1{,}5$. Mivel $\lg 1{,}045 > 0$, oszthatunk vele: $n \geq \dfrac{\lg 1{,}5}{\lg 1{,}045} \approx 9{,}21$.`,
          R`Az $n$ egész szám, és a kamatot évente írják jóvá, ezért a legkisebb megfelelő érték $n = 10$.`,
          R`Ellenőrzés: $1{,}045^9 \approx 1{,}486 < 1{,}5$, $1{,}045^{10} \approx 1{,}553 \geq 1{,}5$. \checkmark`],
        ans: R`Legalább $10$ év után lesz a betét értéke a befizetett összeg legalább másfélszerese.`,
        checks: [['lg(1,5)/lg(1,045)', 'ln(1,5)/ln(1,045)'], ['10*lg(1,045)', 'lg(1,045^10)'], ['1,045^9', '1,486095140'], ['1,045^10', '1,552969422']] },
      { t: 'Oldatok keverése',
        p: R`$30\%$-os és $70\%$-os sóoldatból $10$ kg $54\%$-os oldatot szeretnénk előállítani. Hány kg kell a $30\%$-os oldatból?`,
        steps: [R`Legyen $x$ kg a $30\%$-os oldat, ekkor $(10 - x)$ kg a $70\%$-os; $0 \leq x \leq 10$.`,
          R`A tiszta só mennyisége megmarad: $0{,}3x + 0{,}7(10 - x) = 0{,}54 \cdot 10 = 5{,}4$.`,
          R`Rendezve: $7 - 0{,}4x = 5{,}4$, innen $x = \dfrac{1{,}6}{0{,}4} = 4$.`,
          R`Ellenőrzés: $0{,}3 \cdot 4 + 0{,}7 \cdot 6 = 1{,}2 + 4{,}2 = 5{,}4$, és $\dfrac{5{,}4}{10} = 54\%$. \checkmark`],
        ans: R`A $30\%$-os oldatból $4$ kg, a $70\%$-osból $6$ kg kell.`,
        checks: [['0,3*4+0,7*(10-4)', '5,4'], ['(7-5,4)/0,4', '4'], ['5,4/10', '0,54']] }
    ],
    sims: ['szazalek', 'aranyossag', 'kamat'],
    mistakes: [
      R`A százalékos változások összeadása: $+20\%$ és $-20\%$ nem ad $0\%$-ot, hanem $1{,}2 \cdot 0{,}8 = 0{,}96$, azaz $-4\%$. Mindig szorzótényezőkkel számolj.`,
      R`Az alap összekeverése: „a csökkentett árból” számolni a százalékot. Ha az akciós ár $20\%$-kal kisebb az eredetinél, az eredeti ár $\dfrac{\text{akciós ár}}{0{,}8}$, nem akciós ár $\cdot\ 1{,}2$.`,
      R`Százalék és százalékpont keverése: $4\%$-ról $5\%$-ra emelkedés $1$ százalékpont, de $25\%$ növekedés.`,
      R`Fordított arányosságnál a hányadost tekinteni állandónak (az egyeneshez hasonlóan): fordított arányosságnál a szorzat az állandó.`,
      R`Kamatos kamatnál a $q$ rossz képzése: $p\%$-os kamat mellett $q = 1 + \dfrac{p}{100}$, nem $p$ és nem $1 + p$. Például $5\%$ esetén $q = 1{,}05$.`
    ],
    exam: R`A követelmény szerint közép- és emelt szinten is ismerned kell az egyenes és fordított arányosság definícióját és grafikus ábrázolását, az arányosság és a százalék fogalmát, és feladatokban alkalmaznod kell őket. Az érettségin ez szöveges feladatokban (árváltozás, kamat, oldatok, munka és idő) jön elő; a kamatos kamat feladatokban mértani sorozatként és a logaritmussal oldott exponenciális egyenletként találkozol vele.`,
    cheat: [R`y = c\cdot x \ \text{(egyenes arányosság)}, \qquad x\cdot y = c \ \text{(fordított arányosság)}`, R`P = A\cdot\dfrac{p}{100}`, R`\text{növelés } p\%\text{-kal: szorzó } 1 + \dfrac{p}{100}`, R`T_n = T\cdot q^n, \quad q = 1 + \dfrac{p}{100}`, R`n = \dfrac{\lg M}{\lg q}`, R`\dfrac{m_1 c_1 + m_2 c_2}{m_1 + m_2}`],
    cheatChecks: [['(100+p)/100', '1+p/100'], ['lg(q^n)', 'n*lg(q)']],
    terms: ['egyenes arányosság', 'fordított arányosság', 'aránypár', 'százalék', 'alap', 'százalékláb', 'százalékérték', 'szorzótényező', 'kamatos kamat', 'százalékpont']
  };

  /* ================= 2.9 KÖZÉPÉRTÉKEK, EGYENLŐTLENSÉGEK ================= */
  MO.content['algebra/kozepertekek'] = {
    intro: R`Két pozitív szám „közepét” többféleképpen is meg lehet adni, és ezek nagyságrendi viszonya (a legfontosabb: a számtani közép legalább akkora, mint a mértani) a szélsőérték-feladatok egyik legerősebb eszköze. A követelmény 2.9 pontja emelt szinten kéri a számtani, mértani, négyzetes és harmonikus közép ismeretét, a köztük lévő egyenlőtlenségeket, a számtani–mértani közép közötti egyenlőtlenség bizonyítását két pozitív számra, és a belőle adódó feladatok megoldását. Ez a rész a „legnagyobb/legkisebb érték” típusú feladatok alapja.`,
    theory: [
      { h: 'Számtani és mértani közép', level: 'emelt',
        b: R`Az $a, b > 0$ számok **számtani közepe** $A = \dfrac{a + b}{2}$, **mértani közepe** $G = \sqrt{ab}$. A számtani közép a két szám számegyenesen vett felezőpontja; a mértani közép az, amellyel a $\dfrac{a}{x} = \dfrac{x}{b}$ aránypár teljesül. Példa: $a = 4$, $b = 9$ esetén $A = 6{,}5$, $G = 6$. A mértani közép csak nemnegatív számokra értelmezhető (nálunk pozitívak).` },
      { h: 'Harmonikus és négyzetes közép', level: 'emelt',
        b: R`Az $a, b > 0$ számok **harmonikus közepe** a reciprokaik számtani közepének reciproka: $$H = \dfrac{2}{\dfrac{1}{a} + \dfrac{1}{b}} = \dfrac{2ab}{a + b},$$ **négyzetes közepe** $$Q = \sqrt{\dfrac{a^2 + b^2}{2}}.$$ A harmonikus közép az „átlagolás reciprok szinten”: leggyakrabban átlagsebességnél jön elő (lásd lent). A négyzetes közép a négyzetek számtani közepének négyzetgyöke.` },
      { h: 'A közepek nagyságrendi viszonya', level: 'emelt',
        b: R`Ha $a, b > 0$ és $a \leq b$, akkor $$a \;\leq\; H \;\leq\; G \;\leq\; A \;\leq\; Q \;\leq\; b,$$ és bármelyik két szomszédos közép között pontosan akkor van egyenlőség, ha $a = b$ (ekkor mind egyenlő). Példa: $a = 1$, $b = 7$ esetén $H = 1{,}75$, $G \approx 2{,}65$, $A = 4$, $Q = 5$. A leggyakrabban használt tétel: $$\dfrac{a + b}{2} \geq \sqrt{ab} \quad (a, b > 0),$$ egyenlőség akkor és csak akkor, ha $a = b$. Ezt a **számtani–mértani közép közötti egyenlőtlenségnek** (SZ-M egyenlőtlenségnek) hívjuk.` },
      { h: 'A számtani–mértani egyenlőtlenség bizonyítása', level: 'emelt',
        b: R`Állítás: ha $a, b \in \mathbb{R}^+$, akkor $\dfrac{a + b}{2} \geq \sqrt{ab}$, és egyenlőség csak $a = b$ esetén. Azért fontos, mert egy **összeg** alsó korlátját adja a **szorzat** ismeretében, és fordítva: a szorzat felső korlátját az összeg ismeretében.`,
        proof: R`Mivel $a, b > 0$, léteznek $\sqrt{a}$ és $\sqrt{b}$. Egy valós szám négyzete nemnegatív, ezért $\left(\sqrt{a} - \sqrt{b}\right)^2 \geq 0$. Kifejtve: $a - 2\sqrt{a}\sqrt{b} + b \geq 0$, azaz $a + b \geq 2\sqrt{ab}$. Osztva $2$-vel: $\dfrac{a + b}{2} \geq \sqrt{ab}$. Egyenlőség pontosan akkor áll fenn, ha $\left(\sqrt{a} - \sqrt{b}\right)^2 = 0$, vagyis $\sqrt{a} = \sqrt{b}$, tehát $a = b$. Minden lépés ekvivalens, tehát a bizonyítás visszafelé is olvasható.` },
      { h: 'A többi egyenlőtlenség indoklása', level: 'emelt',
        b: R`A lánc többi tagját visszavezetjük az SZ-M egyenlőtlenségre. **$G \geq H$**: $\sqrt{ab} \geq \dfrac{2ab}{a + b}$ ekvivalens $a + b \geq 2\sqrt{ab}$-vel (átrendezve, pozitív számokkal szorozva). **$A \leq Q$**: mindkét oldal pozitív, négyzetre emelhető: $\dfrac{(a + b)^2}{4} \leq \dfrac{a^2 + b^2}{2}$, és ez ekvivalens $(a + b)^2 \leq 2a^2 + 2b^2$, azaz $0 \leq (a - b)^2$-tel. Ez a biztos alap, mert egy négyzet nemnegatív. A szélső egyenlőtlenségek ($a \leq H$ és $Q \leq b$) abból jönnek, hogy a közepek a két szám között vannak.`,
        proof: R`$H \leq G$ levezetése: $H = \dfrac{2ab}{a + b}$. Az SZ-M miatt $a + b \geq 2\sqrt{ab}$, ezért $H = \dfrac{2ab}{a + b} \leq \dfrac{2ab}{2\sqrt{ab}} = \sqrt{ab} = G$. $A \leq Q$ levezetése: $2a^2 + 2b^2 - (a + b)^2 = a^2 - 2ab + b^2 = (a - b)^2 \geq 0$, tehát $\dfrac{a^2 + b^2}{2} \geq \left(\dfrac{a + b}{2}\right)^2$, és mindkét oldal négyzetgyöke monoton.` },
      { h: 'Szélsőérték-feladatok az SZ-M egyenlőtlenséggel', level: 'emelt',
        b: R`Két alapeset ($a, b > 0$):\n- **Ha az összeg állandó ($a + b = s$)**, akkor a szorzat legfeljebb $\left(\dfrac{s}{2}\right)^2$, és ez akkor valósul meg, ha $a = b = \dfrac{s}{2}$. (Mert $\sqrt{ab} \leq \dfrac{s}{2}$.)\n- **Ha a szorzat állandó ($ab = P$)**, akkor az összeg legalább $2\sqrt{P}$, és ez akkor valósul meg, ha $a = b = \sqrt{P}$.\n**Módszer:** (1) azonosítsd a pozitív mennyiségeket; (2) alakítsd úgy a kifejezést, hogy az egyik oldal állandó legyen (pl. szorzat helyett összeg); (3) alkalmazd az egyenlőtlenséget; (4) **mutasd meg, hogy az egyenlőség elérhető** (a két tag egyenlő lehet), különben csak korlátot kaptál, nem szélsőértéket. Például $x > 0$ esetén $x + \dfrac{16}{x} \geq 2\sqrt{x \cdot \dfrac{16}{x}} = 8$, egyenlőség $x = \dfrac{16}{x}$, azaz $x = 4$-nél.` },
      { h: 'Alkalmazások: átlagsebesség, geometriai feladatok', level: 'emelt',
        b: R`**Átlagsebesség**: ha egy utat oda $v_1$, vissza $v_2$ sebességgel teszünk meg, az átlagsebesség a harmonikus közép, nem a számtani: $v = \dfrac{2s}{\frac{s}{v_1} + \frac{s}{v_2}} = \dfrac{2v_1 v_2}{v_1 + v_2}$. ($60$ és $40$ km/h esetén $48$ km/h, nem $50$.)\n**Geometriai alkalmazások**: adott kerületű téglalapok közül a négyzet területe a legnagyobb; adott területűek közül a négyzet kerülete a legkisebb. Az általánosítás: több azonos típusú tag esetén az SZ-M egyenlőtlenség a súlyozott alakban használható: $\dfrac{ua + vb}{2} \geq \sqrt{uv\,ab}$, ahol $u, v > 0$. **Kapcsolódó azonosság**: $a + \dfrac{1}{a} \geq 2$ minden $a > 0$-ra, és $(a + b)\left(\dfrac{1}{a} + \dfrac{1}{b}\right) \geq 4$.` }
    ],
    examples: [
      { t: 'A négy közép kiszámítása és összehasonlítása',
        p: R`Számítsd ki az $a = 1$ és $b = 7$ számok harmonikus, mértani, számtani és négyzetes közepét, és rendezd őket nagyság szerint.`,
        steps: [R`Harmonikus közép: $H = \dfrac{2ab}{a + b} = \dfrac{2 \cdot 7}{8} = \dfrac{7}{4} = 1{,}75$.`,
          R`Mértani közép: $G = \sqrt{1 \cdot 7} = \sqrt{7} \approx 2{,}65$.`,
          R`Számtani közép: $A = \dfrac{1 + 7}{2} = 4$.`,
          R`Négyzetes közép: $Q = \sqrt{\dfrac{1 + 49}{2}} = \sqrt{25} = 5$.`,
          R`Rendezve: $1 < 1{,}75 < 2{,}65 < 4 < 5 < 7$, vagyis $a < H < G < A < Q < b$, ahogy a tétel mondja (nincs egyenlőség, mert $a \neq b$).`],
        ans: R`$H = \dfrac{7}{4}$, $G = \sqrt{7} \approx 2{,}65$, $A = 4$, $Q = 5$, és $H < G < A < Q$.`,
        checks: [['2*1*7/(1+7)', '7/4'], ['2/(1/1+1/7)', '7/4'], ['sqrt(1*7)', 'sqrt(7)'], ['(1+7)/2', '4'], ['sqrt((1^2+7^2)/2)', '5']] },
      { t: 'Átlagsebesség harmonikus középpel',
        p: R`Egy autó egy utat oda $60$ km/h, vissza $40$ km/h átlagsebességgel tett meg. Mekkora az egész út átlagsebessége?`,
        steps: [R`Legyen az út hossza $s$ (egy irányban). Az átlagsebesség az összes út osztva az összes idővel; nem a sebességek számtani közepe, mert a két szakaszon az **idő** nem egyforma.`,
          R`Például $s = 120$ km esetén az oda út $\dfrac{120}{60} = 2$ óra, a vissza út $\dfrac{120}{40} = 3$ óra, összesen $5$ óra.`,
          R`Átlagsebesség: $\dfrac{240}{5} = 48$ km/h. Általában $v = \dfrac{2v_1 v_2}{v_1 + v_2} = \dfrac{2 \cdot 60 \cdot 40}{100} = 48$, ez a két sebesség harmonikus közepe, függetlenül $s$-től.`,
          R`Ellenőrzés a nagyságrendi viszonnyal: $H = 48 < A = 50$. \checkmark`],
        ans: R`Az átlagsebesség $48$ km/h.`,
        checks: [['2*60*40/(60+40)', '48'], ['2/(1/60+1/40)', '48'], ['240/(120/60+120/40)', '48']] },
      { t: 'Legkisebb érték az SZ-M egyenlőtlenséggel',
        p: R`Mi az $x + \dfrac{16}{x}$ kifejezés legkisebb értéke, ha $x > 0$? Mely $x$-nél veszi fel?`,
        steps: [R`$x > 0$ és $\dfrac{16}{x} > 0$, tehát a két tagra alkalmazható az SZ-M egyenlőtlenség.`,
          R`$\dfrac{x + \frac{16}{x}}{2} \geq \sqrt{x \cdot \dfrac{16}{x}} = \sqrt{16} = 4$, ezért $x + \dfrac{16}{x} \geq 8$.`,
          R`Egyenlőség pontosan akkor, ha a két tag egyenlő: $x = \dfrac{16}{x}$, vagyis $x^2 = 16$, és $x > 0$ miatt $x = 4$. Tehát az egyenlőség elérhető, a $8$ valódi minimum.`,
          R`Ellenőrzés: $x = 4$-nél $4 + \dfrac{16}{4} = 8$. Másik pontban, pl. $x = 2$: $2 + 8 = 10 > 8$. \checkmark`],
        ans: R`A kifejezés legkisebb értéke $8$, ezt $x = 4$-nél veszi fel.`,
        checks: [['4+16/4', '8'], ['2*sqrt(16)', '8'], ['x+16/x-8', '(x-4)^2/x']] },
      { t: 'Legnagyobb területű kert',
        p: R`Egy téglalap alakú kertet az egyik oldalán fal határol, a másik három oldalát $40$ méter kerítéssel kerítjük be. Mekkora lehet a kert legnagyobb területe?`,
        steps: [R`Legyen a falra merőleges oldal $x$, a fallal párhuzamos $y$ méter; $x, y > 0$. A kerítés hossza $2x + y = 40$, a terület $T = x \cdot y$.`,
          R`A szorzat helyett a $2x \cdot y$ szorzatot becsüljük: $2x$ és $y$ összege állandó ($40$), ezért az SZ-M egyenlőtlenség szerint $\sqrt{2x \cdot y} \leq \dfrac{2x + y}{2} = 20$, azaz $2xy \leq 400$.`,
          R`Ebből $T = xy \leq 200$. Egyenlőség $2x = y$ esetén áll fenn: $2x + 2x = 40$, így $x = 10$, $y = 20$.`,
          R`Ellenőrzés: $2 \cdot 10 + 20 = 40$ és $10 \cdot 20 = 200$. \checkmark`],
        ans: R`A kert legnagyobb területe $200$ m$^2$, ha a falra merőleges oldalak $10$ m, a fallal párhuzamos oldal $20$ m hosszú.`,
        checks: [['2*10+20', '40'], ['10*20', '200'], ['((2*10+20)/2)^2/2', '200'], ['(40/2)^2/2', '200']] }
    ],
    sims: ['szelsoertek-feladatok', 'fuggveny'],
    mistakes: [
      R`Az SZ-M egyenlőtlenség használata nem pozitív számokra: $a, b > 0$ kell. Például $a = b = -1$-re $\dfrac{a+b}{2} = -1$, de $\sqrt{ab} = 1$ lenne a mértani közép, így az állítás hamis lenne.`,
      R`A szélsőérték megadása anélkül, hogy megmutatnád: az egyenlőség elérhető. A $x + \dfrac{4}{x^2} \geq \dots$ típusú becslésnél a két tag szorzata nem állandó, a becslés használhatatlan; ilyenkor át kell csoportosítani.`,
      R`Az átlagsebesség kiszámítása a számtani középpel. Ha ugyanazt az utat két sebességgel tesszük meg, a harmonikus közép a helyes ($60$ és $40$ km/h esetén $48$, nem $50$).`,
      R`A közepek sorrendjének felcserélése: $H \leq G \leq A \leq Q$, ahol a harmonikus közép a legkisebb, a négyzetes a legnagyobb. Memóriamódszer: kisebbtől nagyobbig „H-G-A-Q”.`,
      R`A mértani közép tévesztése: $\sqrt{ab} \neq \sqrt{a}+\sqrt{b}$ és $\sqrt{a \cdot b}$ nem $\dfrac{a \cdot b}{2}$. Az összegre vonatkozó egyenlőtlenséget ne cseréld fel a szorzatéval: állandó összegnél a szorzatnak van felső, állandó szorzatnál az összegnek van alsó korlátja.`
    ],
    exam: R`Emelt szinten követelmény két pozitív szám számított középértékeinek (számtani, mértani, négyzetes, harmonikus) és nagyságrendi viszonyaikra vonatkozó tételeknek az ismerete, annak bizonyítása, hogy $\dfrac{a+b}{2} \geq \sqrt{ab}$, ha $a, b \in \mathbb{R}^+$, és feladatok megoldása a számtani és mértani közép közötti összefüggés alapján. Ez szélsőérték-feladatban (legnagyobb terület, legkisebb költség, legkisebb összeg) vagy egyenlőtlenség-bizonyításban jön elő; mindig igazold, hogy az egyenlőség elérhető.`,
    cheat: [R`A = \dfrac{a+b}{2}, \quad G = \sqrt{ab}`, R`H = \dfrac{2ab}{a+b}, \quad Q = \sqrt{\dfrac{a^2+b^2}{2}}`, R`H \leq G \leq A \leq Q \quad (a, b > 0), \text{ egyenlőség: } a = b`, R`a + b = s \Rightarrow ab \leq \dfrac{s^2}{4}`, R`ab = P \Rightarrow a + b \geq 2\sqrt{P}`, R`a + \dfrac{1}{a} \geq 2 \quad (a>0)`],
    cheatChecks: [['2/(1/a+1/b)', '2*a*b/(a+b)'], ['a+1/a-2', '(a-1)^2/a'], ['(a+b)^2/4-a*b', '(a-b)^2/4']],
    terms: ['számtani közép', 'mértani közép', 'harmonikus közép', 'négyzetes közép', 'SZ-M egyenlőtlenség', 'szélsőérték', 'egyenlőség esete', 'átlagsebesség']
  };

  function wrapChoice(o, ch) { o.answer = ch; return o; }

  /* ====================== GENERÁTOROK ====================== */

  /* ---- 2.5 hatvány, gyök, logaritmus ---- */
  def('a2-hgl-1', 'algebra', 'hatvanygyoklog', 1, 'Racionális kitevős hatvány értéke', function (r) {
    var b = r.int(2, 5), q = r.int(2, 3), p = r.int(1, 3), neg = r.int(0, 1) === 1, a = pw(b, q), e = neg ? -p : p;
    var val = pw(b, p), ans = neg ? K.q(1, val) : K.T(val);
    return {
      q: R`Számítsd ki számológép nélkül: $${a}^{${neg ? '-' : ''}\dfrac{${p}}{${q}}}$.`,
      answer: { type: 'num', value: neg ? 1 / val : val }, ansTex: ans,
      verify: neg ? `1/(${a}^(${p}/${q}))` : `${a}^(${p}/${q})`,
      tip1: R`Az $a^{\frac{p}{q}}$ az $a$ $q$-adik gyökének $p$-edik hatványa. Negatív kitevőnél vedd a reciprokot.`,
      tip2: R`Itt $${a} = ${b}^{${q}}$, ezért a(z) $${q}$. gyök $${b}$.`,
      sol: [R`$${a} = ${b}^{${q}}$, ezért $${a}^{\frac{${p}}{${q}}} = ${b}^{${p}} = ${val}$.`,
        neg ? R`Negatív kitevő: a kapott érték reciproka, $\dfrac{1}{${val}}$.` : R`A kitevő pozitív, így az eredmény $${val}$.`,
        R`Az érték: $${ans}$.`]
    };
  });

  def('a2-hgl-2', 'algebra', 'hatvanygyoklog', 1, 'Logaritmus értéke a definícióból', function (r) {
    var b = r.int(2, 7), k = r.nz(-3, 4), n = k > 0 ? pw(b, k) : 0, arg = k > 0 ? String(n) : R`\dfrac{1}{${pw(b, -k)}}`;
    return {
      q: R`Mennyi $\log_{${b}} ${arg}$ értéke?`,
      answer: { type: 'num', value: k }, ansTex: K.T(k),
      verify: k > 0 ? `log(${b};${n})` : `-log(${b};${pw(b, -k)})`,
      tip1: R`$\log_a x$ az a kitevő, amelyre $a$-t emelve $x$-et kapjuk.`,
      tip2: R`Keresd azt a kitevőt, amelyre $${b}^{\,?} = ${k > 0 ? n : '\\dfrac{1}{' + pw(b, -k) + '}'}$.`,
      sol: [R`A definíció: $\log_{${b}} x = y \iff ${b}^y = x$.`,
        k > 0 ? R`$${b}^{${k}} = ${n}$, ezért az érték $${k}$.` : R`$${b}^{${k}} = \dfrac{1}{${b}^{${-k}}} = \dfrac{1}{${pw(b, -k)}}$, ezért az érték $${k}$.`]
    };
  });

  def('a2-hgl-3', 'algebra', 'hatvanygyoklog', 2, 'Logaritmus azonosságainak alkalmazása', function (r) {
    var pr = r.pick([[2, 5], [2, 3], [3, 5], [2, 7]]), i = r.int(1, 4), A = pw(pr[0], i), B = pw(pr[1], i), b = pr[0] * pr[1], mode = r.int(0, 1);
    if (mode === 0) {
      return {
        q: R`Mennyi $\log_{${b}} ${A} + \log_{${b}} ${B}$ értéke?`,
        answer: { type: 'num', value: i }, ansTex: K.T(i),
        verify: `log(${b};${A})+log(${b};${B})`,
        tip1: R`Összeg logaritmusa: a szorzat logaritmusa, $\log_a x + \log_a y = \log_a (xy)$.`,
        tip2: R`Szorozd össze a két számot: $${A} \cdot ${B}$ a $${b}$ hányadik hatványa?`,
        sol: [R`$\log_{${b}} ${A} + \log_{${b}} ${B} = \log_{${b}} (${A} \cdot ${B}) = \log_{${b}} ${pw(b, i)}$.`,
          R`$${pw(b, i)} = ${b}^{${i}}$, ezért az érték $${i}$.`]
      };
    }
    var Bq = r.int(2, 9);
    return {
      q: R`Mennyi $\log_{${b}} ${Bq * pw(b, i)} - \log_{${b}} ${Bq}$ értéke?`,
      answer: { type: 'num', value: i }, ansTex: K.T(i),
      verify: `log(${b};${Bq * pw(b, i)})-log(${b};${Bq})`,
      tip1: R`Különbség logaritmusa: a hányados logaritmusa, $\log_a x - \log_a y = \log_a \dfrac{x}{y}$.`,
      tip2: R`Számítsd ki a hányadost: $\dfrac{${Bq * pw(b, i)}}{${Bq}}$.`,
      sol: [R`$\log_{${b}} ${Bq * pw(b, i)} - \log_{${b}} ${Bq} = \log_{${b}} \dfrac{${Bq * pw(b, i)}}{${Bq}} = \log_{${b}} ${pw(b, i)}$.`,
        R`$${pw(b, i)} = ${b}^{${i}}$, ezért az érték $${i}$.`]
    };
  });

  def('a2-hgl-4', 'algebra', 'hatvanygyoklog', 2, 'Gyökök szorzata', function (r) {
    var n = r.int(2, 4), c = r.int(2, 5), N = pw(c, n), ds = divisors(N).filter(function (d) { return d > 1 && d < N; }), A = r.pick(ds), B = N / A;
    return {
      q: R`Számítsd ki: $${rt(n, A)} \cdot ${rt(n, B)}$.`,
      answer: { type: 'num', value: c }, ansTex: K.T(c),
      verify: `gyok(${n};${A})*gyok(${n};${B})`,
      tip1: R`Azonos kitevőjű gyökök szorzata: $\sqrt[n]{a}\cdot\sqrt[n]{b} = \sqrt[n]{ab}$.`,
      tip2: R`$${A} \cdot ${B} = ${N}$. Melyik szám ${n}. hatványa ez?`,
      sol: [R`$${rt(n, A)} \cdot ${rt(n, B)} = ${rt(n, A + ' \\cdot ' + B)} = ${rt(n, N)}$.`,
        R`$${c}^{${n}} = ${N}$, ezért a gyök értéke $${c}$.`]
    };
  });

  def('a2-hgl-5', 'algebra', 'hatvanygyoklog', 2, 'Exponenciális egyenlet logaritmussal', function (r) {
    var a = r.int(2, 9), N = r.int(11, 300), v = Math.log(N) / Math.log(a), v2 = Math.round(v * 100) / 100;
    return {
      q: R`Oldd meg a valós számok halmazán: $${a}^x = ${N}$. A megoldást két tizedesre kerekítve add meg.`,
      answer: { type: 'num', value: v, tol: 0.0051 }, ansTex: R`x \approx ${K.T(v2, 2)}`,
      verify: `lg(${N})/lg(${a})`,
      tip1: R`Az $a^x = b$ megoldása $x = \log_a b$; számológéppel tízes alapú logaritmussal: $x = \dfrac{\lg b}{\lg a}$.`,
      tip2: R`Most $x = \dfrac{\lg ${N}}{\lg ${a}}$.`,
      sol: [R`Mindkét oldal pozitív, tehát logaritmust vehetünk: $x \cdot \lg ${a} = \lg ${N}$.`,
        R`$x = \dfrac{\lg ${N}}{\lg ${a}} \approx ${K.T(v2, 2)}$.`]
    };
  });

  def('a2-hgl-6', 'algebra', 'hatvanygyoklog', 3, 'Logaritmusos egyenlet kikötéssel', function (r) {
    var b = r.pick([2, 3, 5, 7]), k = r.int(2, 4), i, opts = [];
    for (i = 1; i < k; i++) if (i !== k - i && i > k - i) opts.push(i);
    var ii = opts.length ? r.pick(opts) : k, u = pw(b, ii), v = pw(b, k - ii), d = u - v;
    if (ii === k) { u = pw(b, k); v = 1; d = u - 1; }
    return {
      q: R`Oldd meg a valós számok halmazán: $\log_{${b}} x + \log_{${b}} (x - ${d}) = ${k}$.`,
      answer: { type: 'set', values: [u] }, ansTex: R`x = ${u}`,
      verify: String(u),
      tip1: R`Kikötés: mindkét logaritmus argumentuma pozitív. Utána a szorzat logaritmusával vonj össze egy logaritmussá.`,
      tip2: R`Az egyenlet: $x(x - ${d}) = ${b}^{${k}} = ${pw(b, k)}$. Oldd meg a másodfokú egyenletet, és szűrd ki a hamis gyököt.`,
      sol: [R`Kikötés: $x > 0$ és $x - ${d} > 0$, azaz $x > ${d}$.`,
        R`$\log_{${b}} \big(x(x - ${d})\big) = ${k}$, tehát $x^2 - ${d}x = ${pw(b, k)}$.`,
        R`$x^2 - ${d}x - ${pw(b, k)} = 0$, gyökei $x = ${u}$ és $x = ${-v}$.`,
        R`A $${-v}$ nem felel meg a kikötésnek, hamis gyök. Ellenőrzés: $\log_{${b}} ${u} + \log_{${b}} ${u - d} = ${k}$. \checkmark`,
        R`Az egyetlen megoldás $x = ${u}$.`]
    };
  });

  def('a2-hgl-7', 'algebra', 'hatvanygyoklog', 1, 'Melyik logaritmus-azonosság igaz?', function (r) {
    var a = r.pick(['a', 'b', 'c']), pr = r.pick([['x', 'y'], ['u', 'v'], ['p', 'q'], ['s', 't']]), k = r.pick(['k', 'n', 'm']), x = pr[0], y = pr[1];
    var good = R`$\log_{${a}} (${x}^{${k}}) = ${k} \cdot \log_{${a}} ${x}$`;
    return wrapChoice({
      q: R`Az alap $${a} > 0$, $${a} \neq 1$, $${x}$ és $${y}$ pozitív, a(z) $${k}$ tetszőleges valós szám. Melyik azonosság igaz?`,
      ansTex: R`\text{a hatvány logaritmusára vonatkozó azonosság}`,
      tip1: R`Próbáld ki konkrét számokkal, pl. alap $10$, a változók $10$ és $100$.`,
      tip2: R`Csak a szorzat, a hányados és a hatvány logaritmusa bontható; az összegé nem.`,
      sol: [R`Igaz: $\log_a x^k = k\log_a x$ (a hatvány logaritmusa a kitevő szorosa).`,
        R`Hamis: $\log_a (x+y) \neq \log_a x + \log_a y$; $\log_a (xy)$ összeg, nem szorzat; $\log_a \dfrac{x}{y}$ különbség, nem hányados.`]
    }, K.choice(r, good, [
      R`$\log_{${a}} (${x} + ${y}) = \log_{${a}} ${x} + \log_{${a}} ${y}$`,
      R`$\log_{${a}} (${x} \cdot ${y}) = \log_{${a}} ${x} \cdot \log_{${a}} ${y}$`,
      R`$\log_{${a}} \dfrac{${x}}{${y}} = \dfrac{\log_{${a}} ${x}}{\log_{${a}} ${y}}$`]));
  });

  def('a2-hgl-8', 'algebra', 'hatvanygyoklog', 3, 'Logaritmusok szorzata (áttérés)', function (r) {
    var x0 = r.pick([2, 3, 5]), k = r.int(2, 4), x1 = r.int(2, 9), x2 = r.int(2, 9), x3 = pw(x0, k);
    return {
      q: R`Számítsd ki: $\log_{${x0}} ${x1} \cdot \log_{${x1}} ${x2} \cdot \log_{${x2}} ${x3}$.`,
      answer: { type: 'num', value: k }, ansTex: K.T(k),
      verify: `log(${x0};${x1})*log(${x1};${x2})*log(${x2};${x3})`,
      tip1: R`Térj át közös alapra: $\log_a b = \dfrac{\lg b}{\lg a}$.`,
      tip2: R`A szorzatban a számlálók és nevezők kiesnek: $\dfrac{\lg ${x1}}{\lg ${x0}} \cdot \dfrac{\lg ${x2}}{\lg ${x1}} \cdot \dfrac{\lg ${x3}}{\lg ${x2}}$.`,
      sol: [R`Áttérés tízes alapra: $\dfrac{\lg ${x1}}{\lg ${x0}} \cdot \dfrac{\lg ${x2}}{\lg ${x1}} \cdot \dfrac{\lg ${x3}}{\lg ${x2}}$.`,
        R`Egyszerűsítés után $\dfrac{\lg ${x3}}{\lg ${x0}} = \log_{${x0}} ${x3}$.`,
        R`$${x3} = ${x0}^{${k}}$, ezért az érték $${k}$.`]
    };
  });

  /* ---- 2.6 betűkifejezések ---- */
  function lin(a, b) { return (a === 1 ? '' : String(a)) + 'x' + (b < 0 ? '-' : '+') + Math.abs(b); }

  def('a2-bet-1', 'algebra', 'betukifejezesek', 1, 'Kifejtés nevezetes azonossággal', function (r) {
    var a = r.int(1, 4), b = r.nz(-6, 6), e = K.poly([a * a, 2 * a * b, b * b]);
    return {
      q: R`Fejtsd ki a zárójelet, és rendezd csökkenő fokszám szerint: $(${K.tex(lin(a, b))})^2$. (A választ zárójel nélkül add meg.)`,
      answer: { type: 'expr', expr: e, noParen: true }, ansTex: K.tex(e),
      verify: `(${a}x+(${b}))^2`,
      tip1: R`$(u + v)^2 = u^2 + 2uv + v^2$, és $v$ lehet negatív is.`,
      tip2: R`Itt $u = ${a === 1 ? '' : a}x$ és $v = ${b}$; a kétszeres szorzat $2 \cdot ${a}x \cdot ${K.par(b)}$.`,
      sol: [R`$u^2 = ${K.tex(K.poly([a * a, 0, 0]))}$, $2uv = ${K.tex(K.poly([2 * a * b, 0]))}$, $v^2 = ${b * b}$.`,
        R`Összegezve: $${K.tex(e)}$.`]
    };
  });

  def('a2-bet-2', 'algebra', 'betukifejezesek', 1, 'Számolás nevezetes azonossággal', function (r) {
    var n = r.int(51, 99), m = 100 - n, v = n * n - m * m;
    return {
      q: R`Számítsd ki értékét fejben, nevezetes azonosság segítségével: $${n}^2 - ${m}^2$.`,
      answer: { type: 'num', value: v }, ansTex: K.T(v),
      verify: `${n}^2-${m}^2`,
      tip1: R`Használd az $a^2 - b^2 = (a - b)(a + b)$ azonosságot.`,
      tip2: R`$${n} + ${m} = 100$, a különbség $${n - m}$.`,
      sol: [R`$${n}^2 - ${m}^2 = (${n} - ${m})(${n} + ${m}) = ${n - m} \cdot 100$.`, R`Az érték $${K.B(v)}$.`]
    };
  });

  def('a2-bet-3', 'algebra', 'betukifejezesek', 2, 'Zárójelek felbontása, összevonás', function (r) {
    var a = r.int(1, 4), b = r.int(1, 6), c = 4 * a * b;
    return {
      q: R`Hozd a legegyszerűbb alakra: $(${a === 1 ? '' : a}x + ${b})^2 - (${a === 1 ? '' : a}x - ${b})^2$. (A választ zárójel nélkül add meg.)`,
      answer: { type: 'expr', expr: `${c}x`, noParen: true }, ansTex: `${c}x`,
      verify: `(${a}x+${b})^2-(${a}x-${b})^2`,
      tip1: R`Fejtsd ki mindkét négyzetet, vagy használd az $u^2 - v^2$ azonosságot.`,
      tip2: R`$u = ${a === 1 ? '' : a}x + ${b}$, $v = ${a === 1 ? '' : a}x - ${b}$; $u - v = ${2 * b}$, $u + v = ${2 * a}x$.`,
      sol: [R`$u^2 - v^2 = (u - v)(u + v) = ${2 * b} \cdot ${2 * a}x$.`, R`Az eredmény $${c}x$.`]
    };
  });

  def('a2-bet-4', 'algebra', 'betukifejezesek', 2, 'Algebrai tört értéke egyszerűsítés után', function (r) {
    var k = r.int(1, 9), t = r.int(3, 20);
    if (t === k) t += 1;
    return {
      q: R`Egyszerűsítsd a $\dfrac{x^2 - ${k * k}}{x - ${k}}$ törtet, majd számítsd ki az értékét, ha $x = ${t}$.`,
      answer: { type: 'num', value: t + k }, ansTex: K.T(t + k),
      verify: `(${t}^2-${k * k})/(${t}-${k})`,
      tip1: R`Alakítsd szorzattá a számlálót a különbségi azonossággal.`,
      tip2: R`$x^2 - ${k * k} = (x - ${k})(x + ${k})$, majd egyszerűsíts $(x - ${k})$-val ($x \neq ${k}$).`,
      sol: [R`Kikötés: $x \neq ${k}$. A számláló $(x - ${k})(x + ${k})$.`, R`Egyszerűsítve: $x + ${k}$.`, R`$x = ${t}$ esetén az érték $${t} + ${k} = ${t + k}$.`]
    };
  });

  def('a2-bet-5', 'algebra', 'betukifejezesek', 2, 'Algebrai tört egyszerűsítése', function (r) {
    var k = r.int(1, 9), s = r.pick([1, -1]), den = 'x^2' + (s > 0 ? '+' : '-') + (2 * k) + 'x+' + (k * k),
      ans = s > 0 ? `(x-${k})/(x+${k})` : `(x+${k})/(x-${k})`, ansT = s > 0 ? R`\dfrac{x - ${k}}{x + ${k}}` : R`\dfrac{x + ${k}}{x - ${k}}`;
    return {
      q: R`Egyszerűsítsd a $\dfrac{x^2 - ${k * k}}{${K.tex(den)}}$ törtet. Add meg az egyszerűbb alakot.`,
      answer: { type: 'expr', expr: ans }, ansTex: ansT,
      verify: `(x^2-${k * k})/(${den})`,
      tip1: R`Alakítsd szorzattá a számlálót és a nevezőt is (nevezetes azonosságok).`,
      tip2: R`A nevező teljes négyzet: $(x ${s > 0 ? '+' : '-'} ${k})^2$.`,
      sol: [R`Számláló: $(x - ${k})(x + ${k})$. Nevező: $(x ${s > 0 ? '+' : '-'} ${k})^2$.`,
        R`Egyszerűsítünk az $(x ${s > 0 ? '+' : '-'} ${k})$ tényezővel, ha $x \neq ${s > 0 ? -k : k}$.`,
        R`Az eredmény: $${ansT}$.`]
    };
  });

  def('a2-bet-6', 'algebra', 'betukifejezesek', 3, 'Páratlan kitevőjű hatványok összege', function (r) {
    var m = r.pick([3, 5, 7]), a = r.int(1, 4), b = r.int(1, 4), terms = [], i, val = 0, s = '';
    if (a === b) b = b === 4 ? 1 : b + 1;
    for (i = 0; i < m; i++) { var t = pw(a, m - 1 - i) * pw(b, i); val += (i % 2 === 0 ? t : -t); s += (i === 0 ? '' : (i % 2 === 0 ? ' + ' : ' - ')) + t; }
    return {
      q: R`Számítsd ki a $\dfrac{${a}^{${m}} + ${b}^{${m}}}{${a} + ${b}}$ hányados értékét az $a^{2n+1} + b^{2n+1}$ szorzattá alakításával (a hányados egész szám).`,
      answer: { type: 'num', value: val }, ansTex: K.T(val),
      verify: `(${a}^${m}+${b}^${m})/(${a}+${b})`,
      tip1: R`$a^{2n+1} + b^{2n+1}$ osztható $(a + b)$-vel; a másik tényező előjelei váltakoznak.`,
      tip2: R`$a^{${m}} + b^{${m}} = (a + b)(a^{${m - 1}} - a^{${m - 2}}b + \dots + b^{${m - 1}})$, $a = ${a}$, $b = ${b}$.`,
      sol: [R`$${a}^{${m}} + ${b}^{${m}} = (${a} + ${b})(${a}^{${m - 1}} - ${a}^{${m - 2}} \cdot ${b} + \dots + ${b}^{${m - 1}})$.`,
        R`A második tényező: $${s} = ${val}$.`,
        R`A hányados értéke $${val}$.`]
    };
  });

  def('a2-bet-7', 'algebra', 'betukifejezesek', 1, 'Szorzat fokszáma', function (r) {
    var m = r.int(2, 5), n = r.int(m + 1, 7), A = r.nz(-4, 4), B = r.nz(-4, 4);
    return wrapChoice({
      q: R`Mi a $(${A === 1 ? '' : A === -1 ? '-' : A}x^{${m}} + 1)(${B === 1 ? '' : B === -1 ? '-' : B}x^{${n}} - x)$ polinom foka?`,
      ansTex: R`\text{${m + n}}`,
      tip1: R`Két polinom szorzatának foka a fokok összege.`,
      tip2: R`Az első tényező foka $${m}$, a második tényezőé $${n}$.`,
      sol: [R`Az első tényező foka $${m}$, a másodiké $${n}$ (főegyütthatójuk nem nulla).`, R`A szorzat foka $${m} + ${n} = ${m + n}$.`]
    }, K.choice(r, '$' + (m + n) + '$', ['$' + (m * n) + '$', '$' + n + '$', '$' + (m + n - 1) + '$']));
  });

  def('a2-bet-8', 'algebra', 'betukifejezesek', 3, 'Teljes négyzet: legkisebb érték', function (r) {
    var p = 2 * r.nz(-5, 5), q = r.nz(-5, 20), v = q - p * p / 4;
    return {
      q: R`Mi az $x^2 ${K.sgn(p)} ${Math.abs(p)}x ${q < 0 ? '- ' + (-q) : '+ ' + q}$ kifejezés legkisebb értéke ($x \in \mathbb{R}$)?`,
      answer: { type: 'num', value: v }, ansTex: K.T(v),
      verify: `${q}-(${p})^2/4`,
      tip1: R`Alakítsd teljes négyzetté: $x^2 + px + q = \left(x + \dfrac{p}{2}\right)^2 + \dots$.`,
      tip2: R`Itt $\dfrac{p}{2} = ${p / 2}$, és a négyzet legkisebb értéke $0$.`,
      sol: [R`$x^2 ${K.sgn(p)} ${Math.abs(p)}x = (x ${K.sgn(p)} ${Math.abs(p / 2)})^2 - ${p * p / 4}$.`,
        R`A kifejezés $(x ${K.sgn(p)} ${Math.abs(p / 2)})^2 + (${q} - ${p * p / 4})$, a négyzet legalább $0$.`,
        R`A legkisebb érték $${q} - ${p * p / 4} = ${v}$, ha $x = ${-p / 2}$.`]
    };
  });

  /* ---- 2.7 arányosság, százalékszámítás ---- */
  def('a2-asz-1', 'algebra', 'aranyszazalek', 1, 'Növelés százalékkal', function (r) {
    var A = 100 * r.int(5, 60), p = r.pick([5, 10, 12, 15, 20, 25, 30, 40]), v = A * (100 + p) / 100;
    return {
      q: R`Egy termék ára $${K.B(A)}$ Ft. Az ár $${p}\%$-kal emelkedik. Mennyi az új ár (Ft)?`,
      answer: { type: 'num', value: v }, ansTex: K.B(v) + R`\ \text{Ft}`,
      verify: `${A}*(1+${p}/100)`,
      tip1: R`A $p\%$-os növelés szorzótényezője $1 + \dfrac{p}{100}$.`,
      tip2: R`A szorzótényező $${K.T(1 + p / 100)}$.`,
      sol: [R`A szorzótényező: $1 + \dfrac{${p}}{100} = ${K.T(1 + p / 100)}$.`, R`Az új ár: $${K.B(A)} \cdot ${K.T(1 + p / 100)} = ${K.B(v)}$ Ft.`]
    };
  });

  def('a2-asz-2', 'algebra', 'aranyszazalek', 1, 'Fordított arányosság: munkások és napok', function (r) {
    var n = r.int(4, 12), d = r.int(3, 10), W = n * d, ds = divisors(W).filter(function (x) { return x !== n && x <= 30 && x >= 2; }), m = ds.length ? r.pick(ds) : d, x = W / m;
    return {
      q: R`$${n}$ egyforma ütemben dolgozó munkás egy munkát $${d}$ nap alatt végez el. Hány nap alatt végezne vele $${m}$ munkás?`,
      answer: { type: 'num', value: x }, ansTex: K.T(x) + R`\ \text{nap}`,
      verify: `${n}*${d}/${m}`,
      tip1: R`A munkások száma és az idő fordítottan arányos, a szorzatuk állandó.`,
      tip2: R`A munka mennyisége $${n} \cdot ${d} = ${W}$ munkásnap.`,
      sol: [R`A munka: $${n} \cdot ${d} = ${W}$ munkásnap.`, R`$${m}$ munkás: $${W} : ${m} = ${x}$ nap.`]
    };
  });

  def('a2-asz-3', 'algebra', 'aranyszazalek', 2, 'Visszafelé számolás: az eredeti ár', function (r) {
    var A = 100 * r.int(5, 60), p = r.pick([10, 15, 20, 25, 30, 40]), f = A * (100 - p) / 100;
    return {
      q: R`Egy termék akciós ára $${K.B(f)}$ Ft, ami az eredeti árhoz képest $${p}\%$ kedvezményt jelent. Mennyi volt az eredeti ár (Ft)?`,
      answer: { type: 'num', value: A }, ansTex: K.B(A) + R`\ \text{Ft}`,
      verify: `${f}/(1-${p}/100)`,
      tip1: R`Az akciós ár az eredeti ár $\left(1 - \dfrac{p}{100}\right)$-szorosa; az eredeti ár a $100\%$.`,
      tip2: R`A szorzótényező $${K.T(1 - p / 100)}$, ezzel kell osztani az akciós árat.`,
      sol: [R`Ha az eredeti ár $x$, akkor $x \cdot ${K.T(1 - p / 100)} = ${K.B(f)}$.`, R`$x = \dfrac{${K.B(f)}}{${K.T(1 - p / 100)}} = ${K.B(A)}$ Ft.`,
        R`Ellenőrzés: $${K.B(A)} \cdot ${K.T(1 - p / 100)} = ${K.B(f)}$. \checkmark`]
    };
  });

  def('a2-asz-4', 'algebra', 'aranyszazalek', 2, 'Két egymás utáni változás', function (r) {
    var p = r.pick([10, 20, 30, 40, 50]), q = r.pick([10, 20, 30, 40, 50]), v = ((100 + p) * (100 - q) - 10000) / 100;
    return {
      q: R`Egy mennyiséget először $${p}\%$-kal növeltek, majd az így kapott értéket $${q}\%$-kal csökkentették. Hány százalékkal változott összesen az eredetihez képest? (Csökkenés esetén negatív számot adj meg.)`,
      answer: { type: 'num', value: v }, ansTex: K.T(v) + R`\%`,
      verify: `((1+${p}/100)*(1-${q}/100)-1)*100`,
      tip1: R`Szorozd össze a két szorzótényezőt.`,
      tip2: R`$${K.T(1 + p / 100)} \cdot ${K.T(1 - q / 100)}$, majd nézd meg, mennyi a különbség az eggyel.`,
      sol: [R`A szorzótényezők: $${K.T(1 + p / 100)}$ és $${K.T(1 - q / 100)}$.`, R`Együtt: $${K.T((100 + p) * (100 - q) / 10000, 4)}$.`,
        R`Ez $${K.T(v)}\%$-os változás (${v < 0 ? 'csökkenés' : 'növekedés'}).`]
    };
  });

  def('a2-asz-5', 'algebra', 'aranyszazalek', 2, 'Kamatos kamat', function (r) {
    var T = 100000 * r.int(2, 9), p = r.int(3, 6), n = r.int(3, 8), v = T * pw(1 + p / 100, n);
    return {
      q: R`Egy bankban $${K.B(T)}$ Ft-ot helyezünk el évi $${p}\%$-os kamatos kamatra (a kamatot évente tőkésítik). Mennyi lesz a pénz értéke $${n}$ év után? Egész forintra kerekítve add meg.`,
      answer: { type: 'num', value: v, tol: 0.51 }, ansTex: R`\approx ${K.B(Math.round(v))}\ \text{Ft}`,
      verify: `${T}*(1+${p}/100)^${n}`,
      tip1: R`$T_n = T \cdot q^n$, ahol $q = 1 + \dfrac{p}{100}$.`,
      tip2: R`$q = ${K.T(1 + p / 100)}$, a kitevő $${n}$.`,
      sol: [R`$q = 1 + \dfrac{${p}}{100} = ${K.T(1 + p / 100)}$.`, R`$T_{${n}} = ${K.B(T)} \cdot ${K.T(1 + p / 100)}^{${n}} \approx ${K.B(Math.round(v))}$ Ft.`]
    };
  });

  def('a2-asz-6', 'algebra', 'aranyszazalek', 3, 'Kamatos kamat: mennyi idő kell?', function (r) {
    var M = r.pick([1.5, 2, 3, 4]), p = r.int(3, 8), v = Math.log(M) / Math.log(1 + p / 100), v2 = Math.round(v * 100) / 100;
    return {
      q: R`Egy betét évi $${p}\%$-os kamatos kamatot kap. Hány év alatt nő a tőke a kezdeti érték $${K.T(M)}$ szorosára? (Két tizedesre kerekített, nem feltétlenül egész évet adj meg.)`,
      answer: { type: 'num', value: v, tol: 0.0051 }, ansTex: R`n \approx ${K.T(v2, 2)}`,
      verify: `lg(${M})/lg(1+${p}/100)`,
      tip1: R`Az egyenlet: $q^n = M$. Vegyél logaritmust.`,
      tip2: R`$${K.T(1 + p / 100)}^n = ${K.T(M)}$, tehát $n = \dfrac{\lg ${K.T(M)}}{\lg ${K.T(1 + p / 100)}}$.`,
      sol: [R`Az $${K.T(1 + p / 100)}^n = ${K.T(M)}$ egyenlet mindkét oldala pozitív, logaritmust vehetünk.`,
        R`$n = \dfrac{\lg ${K.T(M)}}{\lg ${K.T(1 + p / 100)}} \approx ${K.T(v2, 2)}$.`,
        R`Évente történő tőkésítésnél a kért érték a(z) $${Math.ceil(v)}$. év végére lesz meg.`]
    };
  });

  def('a2-asz-7', 'algebra', 'aranyszazalek', 3, 'Oldatok keverése', function (r) {
    var a = r.pick([10, 20, 30, 40]), b = r.pick([50, 60, 70, 80, 90]), x = r.int(1, 9), c = (a * x + b * (10 - x)) / 10;
    return {
      q: R`$${a}\%$-os és $${b}\%$-os oldat összeöntésével $10$ kg $${c}\%$-os oldatot kell készíteni. Hány kg kell a $${a}\%$-os oldatból?`,
      answer: { type: 'num', value: x }, ansTex: K.T(x) + R`\ \text{kg}`,
      verify: `(10*${b}-10*${c})/(${b}-${a})`,
      tip1: R`A tiszta oldott anyag mennyisége az összeöntés előtt és után ugyanannyi.`,
      tip2: R`Legyen $x$ kg a $${a}\%$-os oldat, $10 - x$ kg a másik. A keverék tiszta anyagtartalma $${K.T(c / 100)} \cdot 10 = ${K.T(c / 10)}$ kg.`,
      sol: [R`Legyen $x$ kg a $${a}\%$-os, $10 - x$ kg pedig $${b}\%$-os oldat.`,
        R`$${K.T(a / 100)}x + ${K.T(b / 100)}(10 - x) = ${K.T(c / 10)}$.`,
        R`$${K.T(b / 10)} - ${K.T((b - a) / 100)}x = ${K.T(c / 10)}$, innen $x = ${x}$.`,
        R`Ellenőrzés: $${K.T(a / 100)} \cdot ${x} + ${K.T(b / 100)} \cdot ${10 - x} = ${K.T(c / 10)}$. \checkmark`]
    };
  });

  def('a2-asz-8', 'algebra', 'aranyszazalek', 1, 'Fordított arányosság fogalma', function (r) {
    var pr = r.pick([['x', 'y'], ['t', 'v'], ['a', 'b']]), k = r.int(2, 9), x = pr[0], y = pr[1];
    return wrapChoice({
      q: R`Két fordítottan arányos mennyiség: $${x}$ és $${y}$. Mi történik $${y}$ értékével, ha $${x}$ értéke a(z) $${k}$ szorosára nő?`,
      ansTex: R`\text{az eredeti érték 1/${k} részére csökken}`,
      tip1: R`Fordított arányosságnál a szorzat állandó: $${x} \cdot ${y} = c$.`,
      tip2: R`Ha $${x}$ helyére $${k}${x}$ kerül, akkor $${y}$-nak $\dfrac{c}{${k}${x}}$-nek kell lennie.`,
      sol: [R`Az összefüggés $${x} \cdot ${y} = c$, ebből $${y} = \dfrac{c}{${x}}$.`, R`Ha $${x}$ a(z) $${k}$ szorosára nő, $${y}$ az eredeti érték $\dfrac{1}{${k}}$ részére csökken.`]
    }, K.choice(r, R`az eredeti érték $\dfrac{1}{${k}}$ részére csökken`, [R`a(z) $${k}$ szorosára nő`, R`$${k}$ egységgel csökken`, R`nem változik`]));
  });

  /* ---- 2.9 középértékek ---- */
  def('a2-koz-1', 'algebra', 'kozepertekek', 1, 'Mértani közép', function (r) {
    var s = r.pick([1, 2, 3, 5]), m = r.int(1, 5), n = r.int(1, 5);
    if (m === n) n = n === 5 ? 1 : n + 1;
    var a = s * m * m, b = s * n * n, g = s * m * n;
    return {
      q: R`Mennyi $${a}$ és $${b}$ mértani közepe?`,
      answer: { type: 'num', value: g }, ansTex: K.T(g),
      verify: `sqrt(${a}*${b})`,
      tip1: R`A mértani közép $\sqrt{ab}$.`,
      tip2: R`$${a} \cdot ${b} = ${a * b}$, ennek a négyzetgyöke kell.`,
      sol: [R`$G = \sqrt{${a} \cdot ${b}} = \sqrt{${a * b}}$.`, R`$${g}^2 = ${a * b}$, így $G = ${g}$.`]
    };
  });

  def('a2-koz-2', 'algebra', 'kozepertekek', 1, 'Harmonikus közép', function (r) {
    var s = r.int(1, 2), m = r.int(1, 4), n = r.int(1, 4);
    if (m === n) n = n === 4 ? 1 : n + 1;
    var a = (m + n) * s * m, b = (m + n) * s * n, h = 2 * s * m * n;
    return {
      q: R`Mennyi $${a}$ és $${b}$ harmonikus közepe?`,
      answer: { type: 'num', value: h }, ansTex: K.T(h),
      verify: `2/(1/${a}+1/${b})`,
      tip1: R`$H = \dfrac{2ab}{a + b}$, vagy a reciprokok számtani közepének reciproka.`,
      tip2: R`$a + b = ${a + b}$, $2ab = ${2 * a * b}$.`,
      sol: [R`$H = \dfrac{2 \cdot ${a} \cdot ${b}}{${a} + ${b}} = \dfrac{${2 * a * b}}{${a + b}}$.`, R`$H = ${h}$.`]
    };
  });

  def('a2-koz-3', 'algebra', 'kozepertekek', 2, 'Átlagsebesség oda-vissza', function (r) {
    var ps = [], a, b;
    for (a = 10; a <= 120; a += 10) for (b = a + 10; b <= 120; b += 10) if ((2 * a * b) % (a + b) === 0) ps.push([a, b]);
    var pr = r.pick(ps), v1 = pr[0], v2 = pr[1], h = 2 * v1 * v2 / (v1 + v2);
    return {
      q: R`Egy autó egy utat oda $${v1}$ km/h, vissza ugyanazon az úton $${v2}$ km/h átlagsebességgel tett meg. Mekkora az egész út átlagsebessége (km/h)?`,
      answer: { type: 'num', value: h }, ansTex: K.T(h) + R`\ \text{km/h}`,
      verify: `2*${v1}*${v2}/(${v1}+${v2})`,
      tip1: R`Az átlagsebesség az összes út osztva az összes idővel; nem a sebességek számtani közepe.`,
      tip2: R`Egy irányban $s$ km az út: az idők $\dfrac{s}{${v1}}$ és $\dfrac{s}{${v2}}$ óra.`,
      sol: [R`Egy irányban $s$ km az út, az összes út $2s$.`, R`Az idő: $\dfrac{s}{${v1}} + \dfrac{s}{${v2}}$.`,
        R`$v = \dfrac{2s}{\frac{s}{${v1}} + \frac{s}{${v2}}} = \dfrac{2 \cdot ${v1} \cdot ${v2}}{${v1} + ${v2}} = ${h}$ km/h (harmonikus közép).`]
    };
  });

  def('a2-koz-4', 'algebra', 'kozepertekek', 2, 'Legkisebb érték SZ-M egyenlőtlenséggel', function (r) {
    var m = r.int(1, 6), s = r.int(1, 6), n = m * s * s, v = 2 * m * s;
    return {
      q: R`Mi a legkisebb értéke a következő kifejezésnek, ha $x > 0$: $${m === 1 ? '' : m}x + \dfrac{${n}}{x}$?`,
      answer: { type: 'num', value: v }, ansTex: K.T(v),
      verify: `2*sqrt(${m}*${n})`,
      tip1: R`Alkalmazd az SZ-M egyenlőtlenséget a két tagra: összegük legalább $2\sqrt{\text{szorzatuk}}$.`,
      tip2: R`A két tag szorzata $${m}x \cdot \dfrac{${n}}{x} = ${m * n}$, állandó.`,
      sol: [R`$x > 0$, mindkét tag pozitív. $${m === 1 ? '' : m}x + \dfrac{${n}}{x} \geq 2\sqrt{${m * n}} = ${v}$.`,
        R`Egyenlőség, ha $${m === 1 ? '' : m}x = \dfrac{${n}}{x}$, azaz $x = ${s}$; ez pozitív, tehát elérhető.`,
        R`A legkisebb érték $${v}$.`]
    };
  });

  def('a2-koz-5', 'algebra', 'kozepertekek', 3, 'Legnagyobb területű kert osztófallal', function (r) {
    var k = r.int(2, 14), L = 6 * k, v = L * L / 12;
    return {
      q: R`Egy téglalap alakú kert egyik oldalát fal határolja. A kertet a falra merőleges három kerítés (két szélső és egy osztó) és a fallal párhuzamos egy kerítés határolja, összesen $${L}$ m kerítéssel. Mekkora lehet a kert legnagyobb területe (m$^2$)?`,
      answer: { type: 'num', value: v }, ansTex: K.T(v) + R`\ \text{m}^2`,
      verify: `(${L}/2)^2/3`,
      tip1: R`Ha a falra merőleges oldal $x$, a fallal párhuzamos $y$, akkor $3x + y = ${L}$, a terület $xy$.`,
      tip2: R`Becsüld a $3x \cdot y$ szorzatot az SZ-M egyenlőtlenséggel: $3x + y = ${L}$.`,
      sol: [R`$3x + y = ${L}$, $x, y > 0$, a terület $T = xy$.`,
        R`SZ-M: $\sqrt{3x \cdot y} \leq \dfrac{3x + y}{2} = ${L / 2}$, így $3xy \leq ${L * L / 4}$.`,
        R`$T \leq ${v}$. Egyenlőség: $3x = y = ${L / 2}$, azaz $x = ${L / 6}$, $y = ${L / 2}$ (elérhető).`]
    };
  });

  def('a2-koz-6', 'algebra', 'kozepertekek', 3, 'Reciprokösszeg legkisebb értéke', function (r) {
    var s = r.int(2, 24), v = 4 / s;
    return {
      q: R`Az $a$ és $b$ pozitív valós számok összege $${s}$. Mi az $\dfrac{1}{a} + \dfrac{1}{b}$ kifejezés legkisebb értéke? (Törtet is írhatsz.)`,
      answer: { type: 'num', value: v }, ansTex: K.q(4, s),
      verify: `1/(${s}/2)+1/(${s}/2)`,
      tip1: R`Írd át: $\dfrac{1}{a} + \dfrac{1}{b} = \dfrac{a + b}{ab}$, és az $ab$ szorzatot az összeg ismeretében becsüld felülről.`,
      tip2: R`Az SZ-M egyenlőtlenség szerint $ab \leq \left(\dfrac{${s}}{2}\right)^2$.`,
      sol: [R`$\dfrac{1}{a} + \dfrac{1}{b} = \dfrac{a + b}{ab} = \dfrac{${s}}{ab}$.`,
        R`$ab \leq \left(\dfrac{${s}}{2}\right)^2 = ${K.T(s * s / 4)}$, ezért a tört legalább $\dfrac{${s}}{${K.T(s * s / 4)}} = ${K.q(4, s)}$.`,
        R`Egyenlőség $a = b = ${K.T(s / 2)}$ esetén, tehát a legkisebb érték $${K.q(4, s)}$.`]
    };
  });

  def('a2-koz-7', 'algebra', 'kozepertekek', 1, 'A közepek sorrendje', function (r) {
    var a = r.int(1, 9), b = a + r.int(1, 9), big = r.int(0, 1) === 1;
    return wrapChoice({
      q: R`Az $a = ${a}$ és $b = ${b}$ számokra kiszámoljuk a számtani, mértani, harmonikus és négyzetes közepet. Melyik lesz közülük a ${big ? 'legnagyobb' : 'legkisebb'}?`,
      ansTex: R`\text{${big ? 'négyzetes' : 'harmonikus'}}`,
      tip1: R`A sorrend (különböző pozitív számoknál): $H < G < A < Q$.`,
      tip2: R`A harmonikus a reciprokok átlagának reciproka, a négyzetes a négyzetek átlagából vonunk gyököt.`,
      sol: [R`Különböző pozitív $a, b$-re $H < G < A < Q$ (harmonikus $<$ mértani $<$ számtani $<$ négyzetes).`, R`A ${big ? 'legnagyobb a négyzetes' : 'legkisebb a harmonikus'} közép.`]
    }, K.choice(r, big ? 'négyzetes' : 'harmonikus', big ? ['számtani', 'mértani', 'harmonikus'] : ['számtani', 'mértani', 'négyzetes']));
  });

  def('a2-koz-8', 'algebra', 'kozepertekek', 3, 'Súlyozott összeg legkisebb értéke', function (r) {
    var u = r.int(1, 5), v = r.int(1, 5), t = r.int(1, 3), P = u * v * t * t, val = 2 * u * v * t, ua = u === 1 ? '' : u, vb = v === 1 ? '' : v;
    return {
      q: R`Az $a$ és $b$ pozitív valós számokra $ab = ${P}$. Mi a legkisebb értéke a következő kifejezésnek: $${ua}a + ${vb}b$?`,
      answer: { type: 'num', value: val }, ansTex: K.T(val),
      verify: `2*sqrt(${u}*${v}*${P})`,
      tip1: R`Alkalmazd az SZ-M egyenlőtlenséget két tagra: $${ua}a$ és $${vb}b$.`,
      tip2: R`Szorzatuk: $${ua}a \cdot ${vb}b = ${u * v}ab = ${u * v * P}$.`,
      sol: [R`$\dfrac{${ua}a + ${vb}b}{2} \geq \sqrt{${ua}a \cdot ${vb}b} = \sqrt{${u * v * P}} = ${val / 2}$.`,
        R`Tehát $${ua}a + ${vb}b \geq ${val}$.`,
        R`Egyenlőség: $${ua}a = ${vb}b$ és $ab = ${P}$, ami megoldható pozitív számokkal ($a \approx ${K.T(Math.sqrt(P * v / u), 3)}$), tehát a legkisebb érték $${val}$.`]
    };
  });
})(typeof window !== 'undefined' ? window : globalThis);
