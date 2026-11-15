(function (root) {
  'use strict';
  var MO = root.MO = root.MO || {};
  var K = MO.taskKit, R = K.R, def = K.def, Q = MO.Q;
  MO.content = MO.content || {};

  /* ---------- segédek ---------- */
  function px(cs) { return K.tex(K.poly(cs)); }                 /* polinom TeX-ben, csökkenő fokszám szerint */
  function ev(cs, x) { var s = 0; cs.forEach(function (c) { s = s * x + c; }); return s; }
  function dd(cs) { var n = cs.length - 1; return cs.slice(0, n).map(function (c, i) { return c * (n - i); }); }
  function par(x) { return x < 0 ? '(' + x + ')' : '' + x; }
  function add(n) { return n === 0 ? '' : (n > 0 ? ' + ' + n : ' - ' + (-n)); }
  function xm(a) { return 'x' + add(-a); }
  /* polinom primitív függvénye (TeX), C nélkül */
  function Ftex(cs) {
    var n = cs.length - 1, out = '';
    cs.forEach(function (c, i) {
      if (!c) return;
      var k = n - i + 1, g = MO.gcd(c, k), n1 = Math.abs(c) / g, d1 = k / g;
      var co = d1 === 1 ? (n1 === 1 ? '' : String(n1)) : '\\dfrac{' + n1 + '}{' + d1 + '}';
      var v = k === 1 ? 'x' : 'x^{' + k + '}';
      out += (out ? (c < 0 ? ' - ' : ' + ') : (c < 0 ? '-' : '')) + co + v;
    });
    return out || '0';
  }

  /* ================================================================== */
  /* 3.4.1 Határérték, folytonosság                                      */
  /* ================================================================== */
  MO.content['fuggvenyek/hatarertek'] = {
    intro: R`A határérték azt írja le, hogy mit „csinál” egy sorozat vagy egy függvény, amikor a változó egy értékhez vagy a végtelenhez közelít. A folytonosság szemléletesen azt jelenti, hogy a grafikon megszakítás nélkül, „felemelt ceruza nélkül” megrajzolható. A követelmény (3.4.1) a végesben vett véges, a végtelenben vett véges és a tágabb értelemben vett (végtelen) határérték, valamint a folytonosság **szemléletes** fogalmát kéri: ε–δ definíció nem kell, de a fogalmakat számolásban és indoklásban pontosan kell használni. Erre épül a derivált és az integrál is.`,
    theory: [
      { h: 'A sorozat határértéke (emlékeztető)', level: 'emelt',
        b: R`Az $(a_n)$ sorozat **határértéke** $A$ (véges szám), ha $A$ minden környezetén kívül a sorozatnak csak véges sok tagja van. Jelölés: $\lim_{n\to\infty} a_n = A$ vagy $a_n \to A$. Ilyenkor a sorozat **konvergens**.\nNevezetes határértékek: $\lim \dfrac{1}{n} = 0$, $\lim \dfrac{1}{n^k} = 0$ ($k > 0$), $\lim q^n = 0$ ha $|q| < 1$.\nHa a sorozat nem konvergens, akkor **divergens**; ennek két fajtája van: a $(-1)^n$ sorozatnak nincs határértéke, az $n^2$ sorozat pedig tágabb értelemben a $+\infty$-hez tart ($n^2 \to \infty$).\nPélda: $\dfrac{3n+1}{n+2} = \dfrac{3 + \frac{1}{n}}{1 + \frac{2}{n}} \to \dfrac{3}{1} = 3$. A sorozatok részletes tárgyalása a Sorozatok alfejezetben van; a függvényhatárérték ugyanerre az ötletre épül.` },
      { h: 'Függvény határértéke véges helyen', level: 'emelt',
        b: R`Szemléletesen: $\lim_{x\to a} f(x) = A$ azt jelenti, hogy ha $x$ az $a$-hoz (de nem az $a$-ba!) tetszőlegesen közel kerül, akkor $f(x)$ tetszőlegesen közel kerül $A$-hoz. A határérték az $a$ **környezetében** mutatott viselkedést írja le; maga az $f(a)$ érték (sőt az sem, hogy $f$ értelmezett-e $a$-ban) nem számít.\nPélda: $f(x) = \dfrac{x^2 - 1}{x - 1}$ az $x = 1$ helyen nem értelmezett, de $x \neq 1$ esetén $f(x) = x + 1$, ezért $\lim_{x\to 1} f(x) = 2$.\n**Egyoldali határértékek:** $\lim_{x \to a-0} f(x)$ (balról közelítünk) és $\lim_{x \to a+0} f(x)$ (jobbról közelítünk). A kétoldali határérték akkor és csak akkor létezik, ha a két egyoldali határérték létezik és egyenlő.\nPélda: $f(x) = \dfrac{|x|}{x}$ ($x \neq 0$): balról $-1$, jobbról $1$, ezért $0$-ban nincs határértéke.` },
      { h: 'Határérték a végtelenben', level: 'emelt',
        b: R`A $\lim_{x\to\infty} f(x) = A$ ($A$ véges) azt jelenti, hogy ha $x$ elég nagy, akkor $f(x)$ tetszőlegesen közel van $A$-hoz. Hasonlóan értelmezzük a $-\infty$-ben vett határértéket. Ekkor az $y = A$ egyenes az $f$ grafikonjának **vízszintes aszimptotája**.\nPélda: $\lim_{x\to\infty} \dfrac{1}{x} = 0$; $\lim_{x\to\infty} \dfrac{3x+1}{x+2} = 3$, tehát az $y = 3$ vízszintes aszimptota.\nNem minden függvénynek van határértéke a végtelenben: a $\sin x$ és a $\cos x$ ismétlődően ugyanazokat az értékeket veszi fel, ezért $\lim_{x\to\infty} \sin x$ nem létezik.` },
      { h: 'Tágabb értelemben vett határérték: ±∞', level: 'emelt',
        b: R`Ha $x \to a$ esetén $f(x)$ minden határon túl nő, akkor $\lim_{x\to a} f(x) = +\infty$; ha minden határon túl csökken, akkor $-\infty$. Ez **nem** véges határérték, a függvény ilyenkor „nem konvergens”, de a viselkedését mégis jól leírja. Ugyanígy értelmezzük a $\lim_{x\to\pm\infty} f(x) = \pm\infty$ jelölést is.\nPéldák: $\lim_{x\to 0} \dfrac{1}{x^2} = +\infty$; $\lim_{x \to \infty} x^3 = +\infty$; $\lim_{x\to -\infty} x^3 = -\infty$.\nAz $\dfrac{1}{x}$-nek a $0$-ban nincs kétoldali határértéke: $\lim_{x\to 0-0} \dfrac{1}{x} = -\infty$, $\lim_{x\to 0+0} \dfrac{1}{x} = +\infty$. Ha az $a$-nál az egyoldali határérték végtelen, akkor az $x = a$ egyenes az $f$ grafikonjának **függőleges aszimptotája**.` },
      { h: 'Határérték kiszámítása: szabályok és átalakítások', level: 'emelt',
        b: R`**Műveleti szabályok.** Ha $\lim_{x\to a} f(x) = A$ és $\lim_{x\to a} g(x) = B$ (véges számok), akkor $\lim (f+g) = A + B$, $\lim (f - g) = A - B$, $\lim (f \cdot g) = A \cdot B$, és ha $B \neq 0$, akkor $\lim \dfrac{f}{g} = \dfrac{A}{B}$. A polinomok és a belőlük képzett törtek határértéke ott, ahol értelmezettek, a helyettesítési érték.\n**Határozatlan alakok.** A $\dfrac{0}{0}$, $\dfrac{\infty}{\infty}$, $\infty - \infty$ alakból önmagában semmi nem következik; át kell alakítani:\n1. $\dfrac{0}{0}$: szorzattá bontás, egyszerűsítés (pl. $\dfrac{x^2 - 9}{x - 3} = x + 3$); gyökös kifejezésnél bővítés a konjugálttal: $\sqrt{u} - v = \dfrac{u - v^2}{\sqrt{u} + v}$.\n2. $\dfrac{\infty}{\infty}$ ($x \to \infty$, racionális tört): osztás a nevező legnagyobb hatványával. Ha a számláló és a nevező foka egyenlő, a határérték a főegyütthatók hányadosa; ha a számláló foka kisebb, a határérték $0$; ha nagyobb, $\pm\infty$.` },
      { h: 'A folytonosság szemléletes fogalma', level: 'emelt',
        b: R`Az $f$ függvény az $a$ pontban **folytonos**, ha $f$ értelmezett $a$-ban (és környezetében), létezik a $\lim_{x\to a} f(x)$ határérték, és az egyenlő a helyettesítési értékkel:\n$$\lim_{x \to a-0} f(x) = \lim_{x \to a+0} f(x) = f(a).$$\nSzemléletesen: a grafikon az $a$-nál nem ugrik, nem lyukas és nem szalad el a végtelenbe. Intervallumon folytonos az a függvény, amely az intervallum minden pontjában folytonos („ceruzaemelés nélkül” rajzolható).\n**Folytonosak** a polinomok, a racionális törtfüggvények (az értelmezési tartományukon), az $|x|$, a $\sin x$ és a $\cos x$; folytonos függvények összege, különbsége, szorzata, hányadosa (ahol a nevező nem nulla) és összetétele is folytonos.\n**Szakadási hely** a nem folytonos pont: *megszüntethető* (a határérték létezik, de $f(a)$ más vagy nincs értelmezve), *ugrás* (a két egyoldali határérték véges, de különböző) vagy *végtelen szakadás* (az egyik egyoldali határérték végtelen).` },
      { h: 'Folytonossági feladatok: szakaszonként megadott függvény', level: 'emelt',
        b: R`Szakaszonként megadott függvénynél (pl. $f(x) = x^2 + px$, ha $x \leq 2$, és $f(x) = 3x + 8$, ha $x > 2$) a szakaszok belsejében a függvény folytonos (polinom), tehát csak a **váltópontot** kell vizsgálni: a bal oldali határérték, a jobb oldali határérték és a helyettesítési érték egyezzen.\nMenete: (1) kiszámítjuk a bal oldali és a jobb oldali határértéket (itt a két polinom értékét a váltópontban); (2) kiszámítjuk $f(a)$-t; (3) a három érték egyenlőségéből felírjuk az egyenletet a paraméterre; (4) megoldjuk, és ellenőrizzük.\n**Kiegészítés** (nem követelmény): ha $f$ folytonos az $[a; b]$ intervallumon és $f(a)$, $f(b)$ ellentétes előjelű, akkor van zérushelye az intervallumon (Bolzano-tétel); ez magyarázza, miért „nem ugorhat át” a nullán a folytonos függvény.` }
    ],
    examples: [
      { t: 'Határérték véges helyen: 0/0 alak',
        p: R`Számítsd ki a $\lim_{x \to 3} \dfrac{x^2 - 9}{x - 3}$ határértéket!`,
        steps: [R`Közvetlen behelyettesítésnél $\dfrac{0}{0}$ jön ki, ez még nem válasz. A határérték csak az $x \neq 3$ értékektől függ, ezért átalakíthatunk.`, R`A számláló szorzattá alakítható: $x^2 - 9 = (x-3)(x+3)$.`, R`$x \neq 3$ esetén egyszerűsíthetünk: $\dfrac{x^2 - 9}{x - 3} = x + 3$.`, R`Az $x + 3$ polinom, ezért a határérték a helyettesítési érték: $3 + 3 = 6$.`, R`Ellenőrzés: pl. $x = 3{,}01$ esetén $\dfrac{3{,}01^2 - 9}{0{,}01} = \dfrac{0{,}0601}{0{,}01} = 6{,}01$, ami közel van a $6$-hoz.`],
        ans: R`A határérték $6$.`,
        checks: [['(x^2-9)/(x-3)', 'x+3'], ['3+3', '6'], ['(3,01^2-9)/0,01', '6,01']] },
      { t: 'Határérték a végtelenben',
        p: R`Számítsd ki a határértékeket: a) $\lim_{x\to\infty} \dfrac{3x^2 + 2x - 1}{5x^2 - 4}$; b) $\lim_{x\to\infty} \left(\sqrt{x^2 + x} - x\right)$.`,
        steps: [R`a) Osszuk el a számlálót és a nevezőt a nevező legnagyobb hatványával, $x^2$-tel: $\dfrac{3x^2 + 2x - 1}{5x^2 - 4} = \dfrac{3 + \frac{2}{x} - \frac{1}{x^2}}{5 - \frac{4}{x^2}}$.`, R`Ha $x \to \infty$, akkor $\dfrac{2}{x} \to 0$, $\dfrac{1}{x^2} \to 0$, $\dfrac{4}{x^2} \to 0$, ezért a határérték $\dfrac{3}{5}$.`, R`b) Itt $\infty - \infty$ alakú a kifejezés. Bővítünk a konjugálttal: $\sqrt{x^2 + x} - x = \dfrac{(x^2 + x) - x^2}{\sqrt{x^2 + x} + x} = \dfrac{x}{\sqrt{x^2 + x} + x}$.`, R`Pozitív $x$ esetén osszuk a számlálót és a nevezőt $x$-szel: $\dfrac{1}{\sqrt{1 + \frac{1}{x}} + 1}$.`, R`Ha $x \to \infty$, akkor $\dfrac{1}{x} \to 0$, így a határérték $\dfrac{1}{1 + 1} = \dfrac{1}{2}$.`],
        ans: R`a) $\dfrac{3}{5}$; b) $\dfrac{1}{2}$.`,
        checks: [['(3x^2+2x-1)/(5x^2-4)', '(3+2/x-1/x^2)/(5-4/x^2)'], ['3/5', '0,6'], ['sqrt(x^2+x)-x', 'x/(sqrt(x^2+x)+x)'], ['1/(1+1)', '0,5']] },
      { t: 'Szakadási helyek és aszimptoták',
        p: R`Legyen $f(x) = \dfrac{x^2 - x - 2}{x^2 - 4}$. Add meg az értelmezési tartományt, vizsgáld meg a határértéket az $x = 2$ és az $x = -2$ helyen, és add meg az aszimptotákat!`,
        steps: [R`A nevező: $x^2 - 4 = (x-2)(x+2) \neq 0$, ezért $D_f = \mathbb{R} \setminus \{-2; 2\}$.`, R`A számláló: $x^2 - x - 2 = (x-2)(x+1)$. Ezért $x \neq \pm 2$ esetén $f(x) = \dfrac{x+1}{x+2}$.`, R`$x \to 2$: $\lim_{x\to 2} \dfrac{x+1}{x+2} = \dfrac{3}{4}$. A határérték véges, az $f$ az $x = 2$-ben nincs értelmezve: **megszüntethető szakadás**.`, R`$x \to -2$: a számláló $-1$-hez tart, a nevező $0$-hoz. Jobbról ($x > -2$) a nevező pozitív: a hányados $-\infty$-hez tart; balról a nevező negatív: a hányados $+\infty$-hez. Ez **végtelen szakadás**, az $x = -2$ **függőleges aszimptota**.`, R`$x \to \pm\infty$: $\dfrac{x+1}{x+2} = 1 - \dfrac{1}{x+2} \to 1$, így az $y = 1$ **vízszintes aszimptota**.`],
        ans: R`$D_f = \mathbb{R} \setminus \{-2; 2\}$; $x = 2$-ben megszüntethető szakadás (a határérték $\dfrac{3}{4}$), $x = -2$-ben függőleges aszimptota; az $y = 1$ vízszintes aszimptota.`,
        checks: [['(x^2-x-2)/(x^2-4)', '(x+1)/(x+2)'], ['(2+1)/(2+2)', '3/4'], ['(x+1)/(x+2)', '1-1/(x+2)'], ['(x-2)*(x+1)', 'x^2-x-2']] },
      { t: 'Folytonossá tétel paraméterrel (emelt)',
        p: R`Az $f$ függvény: $f(x) = x^2 + px$, ha $x \leq 2$, és $f(x) = 3x + 8$, ha $x > 2$, ahol $p$ valós paraméter. Határozd meg $p$ értékét úgy, hogy $f$ folytonos legyen az $\mathbb{R}$ halmazon!`,
        steps: [R`Az $x < 2$ és az $x > 2$ tartományban $f$ polinom, tehát folytonos. Csak az $x = 2$ helyet kell vizsgálni.`, R`Helyettesítési érték: $f(2) = 2^2 + 2p = 4 + 2p$. Bal oldali határérték: $\lim_{x\to 2-0} (x^2 + px) = 4 + 2p$.`, R`Jobb oldali határérték: $\lim_{x\to 2+0} (3x + 8) = 3 \cdot 2 + 8 = 14$.`, R`A folytonosság feltétele: $4 + 2p = 14$, ebből $2p = 10$, azaz $p = 5$.`, R`Ellenőrzés: $p = 5$ esetén $f(2) = 4 + 10 = 14$, és a jobb oldali határérték is $14$, tehát valóban folytonos. Más $p$ esetén ugrás van a grafikonon.`],
        ans: R`$p = 5$.`,
        checks: [['2^2+2*5', '3*2+8'], ['2^2+2*5', '14'], ['(14-4)/2', '5']] }
    ],
    sims: ['epszilon-n', 'pokhalo'],
    mistakes: [
      R`A határérték nem a helyettesítési érték: $\lim_{x\to a} f(x)$ az $a$ **környezetében** mutatott viselkedés, $f(a)$ nem számít bele. Csak folytonos függvénynél egyezik meg a kettő.`,
      R`A $\dfrac{0}{0}$ nem $0$ és nem $1$ és nem „nincs”: határozatlan alak, ezért át kell alakítani (szorzattá bontás, egyszerűsítés, konjugálttal bővítés). Ugyanígy az $\infty - \infty$ sem $0$, és az $\dfrac{\infty}{\infty}$ sem $1$.`,
      R`Az $\dfrac{1}{x}$-nek a $0$-ban nincs kétoldali határértéke (balról $-\infty$, jobbról $+\infty$). Ha az egyoldali határértékek különböznek, a kétoldali határérték nem létezik.`,
      R`A $\infty$ nem szám: ha egy határérték $\infty$, a sorozat vagy függvény nem konvergens, hanem tágabb értelemben tart a végtelenhez. Végtelennel nem szabad úgy számolni, mint valós számmal.`,
      R`Racionális törtnél $x \to \infty$ esetén nem elég „a legnagyobb tagot nézni”, ha nem tudod megindokolni: oszd el a számlálót és a nevezőt a nevező legnagyobb hatványával, és vedd észre, hogy a többi tag nullához tart.`,
      R`Folytonos $\neq$ deriválható: az $|x|$ mindenhol folytonos, de a $0$-ban nem deriválható. Fordítva viszont minden deriválható függvény folytonos.`
    ],
    exam: R`A követelmény (3.4.1) csak az emelt szinten szerepel: ismerni kell a végesben vett véges, a végtelenben vett véges és a tágabb értelemben vett határérték szemléletes fogalmát, továbbá a folytonosság szemléletes fogalmát. Ilyen feladat lehet például, hogy egy grafikonról vagy képletből le tudod olvasni, mihez tart a függvény, tudsz aszimptotát és szakadási helyet keresni, és szakaszonként megadott függvényt paraméterrel folytonossá tudsz tenni. A határérték és a folytonosság a derivált és az integrál fogalmának előkészítése.`,
    cheat: [
      R`\lim_{x\to a} f(x) = A \iff \lim_{x\to a-0} f(x) = \lim_{x\to a+0} f(x) = A`,
      R`f \text{ folytonos } a\text{-ban} \iff \lim_{x\to a} f(x) = f(a)`,
      R`\lim_{x\to\infty} \dfrac{a_n x^n + \dots}{b_n x^n + \dots} = \dfrac{a_n}{b_n}`,
      R`\lim_{x\to\infty} \dfrac{1}{x} = 0, \qquad \lim_{x \to 0} \dfrac{1}{x^2} = +\infty`,
      R`\sqrt{u} - v = \dfrac{u - v^2}{\sqrt{u} + v}`
    ],
    cheatChecks: [['sqrt(u)-v', '(u-v^2)/(sqrt(u)+v)'], ['(3x^2+2x-1)/(5x^2-4)', '(3+2/x-1/x^2)/(5-4/x^2)']],
    terms: ['határérték', 'konvergens', 'divergens', 'bal oldali határérték', 'jobb oldali határérték', 'határérték a végtelenben', 'tágabb értelemben vett határérték', 'vízszintes aszimptota', 'függőleges aszimptota', 'folytonosság', 'szakadási hely', 'megszüntethető szakadás']
  };

  def('f2-hat-1', 'fuggvenyek', 'hatarertek', 1, 'Polinom határértéke véges helyen', function (r) {
    var a = r.nz(-4, 4), b = r.nz(-6, 6), c = r.nz(-9, 9), p = r.nz(-4, 4), v = a * p * p + b * p + c;
    return {
      q: R`Számítsd ki a határértéket: $\lim_{x \to ${p}} \left(${px([a, b, c])}\right)$.`,
      answer: { type: 'num', value: v }, ansTex: K.T(v),
      verify: `${par(a)}*${par(p)}^2+${par(b)}*${par(p)}+${par(c)}`,
      tip1: R`A polinom folytonos, ezért a határérték a helyettesítési érték.`,
      tip2: R`Írd be az $x$ helyére a(z) $${p}$ számot, a negatív számot tedd zárójelbe.`,
      sol: [R`A polinomfüggvény mindenhol folytonos, ezért a határérték megegyezik a helyettesítési értékkel.`, R`$${K.T(a)} \cdot ${K.par(p)}^2 + ${K.par(b)} \cdot ${K.par(p)} + ${K.par(c)} = ${K.T(a * p * p)} + ${K.par(b * p)} + ${K.par(c)} = ${K.T(v)}$`]
    };
  });

  def('f2-hat-2', 'fuggvenyek', 'hatarertek', 2, 'Racionális tört határértéke a végtelenben', function (r) {
    var m = r.int(1, 3), a = r.nz(-6, 6), d = r.nz(-6, 6), nc = [a], dc = [d], i;
    for (i = 0; i < m; i++) { nc.push(r.int(-7, 7)); dc.push(r.int(-7, 7)); }
    var ans = a / d;
    return {
      q: R`Számítsd ki a határértéket: $\lim_{x \to \infty} \dfrac{${px(nc)}}{${px(dc)}}$. (Törtet is megadhatsz.)`,
      answer: { type: 'num', value: ans }, ansTex: K.q(a, d),
      verify: `(${a})/(${d})`,
      tip1: R`Ugyanannyi a számláló és a nevező foka. Oszd el mindkettőt a nevező legnagyobb hatványával.`,
      tip2: R`A legnagyobb hatvány itt $x^{${m}}$; az osztás után minden más tag nullához tart.`,
      sol: [R`Osszuk el a számlálót és a nevezőt az $x^{${m}}$ hatvánnyal. A $\dfrac{c}{x^k}$ alakú tagok ($k \geq 1$) nullához tartanak.`, R`A számláló határértéke $${K.T(a)}$, a nevezőé $${K.T(d)}$, ezért a határérték $\dfrac{${K.T(a)}}{${K.T(d)}} = ${K.q(a, d)}$.`]
    };
  });

  def('f2-hat-3', 'fuggvenyek', 'hatarertek', 2, 'Határérték 0/0 alakból', function (r) {
    var p = r.nz(-5, 5), c = r.int(1, 3), k = r.nz(-6, 6), v = c * p + k;
    if (v === 0) k += 1, v = c * p + k;
    return {
      q: R`Számítsd ki a határértéket: $\lim_{x \to ${p}} \dfrac{${px([c, k - c * p, -p * k])}}{${xm(p)}}$.`,
      answer: { type: 'num', value: v }, ansTex: K.T(v),
      verify: `${c}*(${p})+(${k})`,
      tip1: R`Behelyettesítve $\dfrac{0}{0}$ adódik. Bontsd szorzattá a számlálót!`,
      tip2: R`A számlálónak gyöke a(z) $${p}$, ezért kiemelhető belőle az $(${xm(p)})$ tényező.`,
      sol: [R`A számláló és a nevező is $0$ a(z) $${p}$ helyen, ezért átalakítunk: $${px([c, k - c * p, -p * k])} = (${xm(p)})(${px([c, k])})$.`, R`$x \neq ${p}$ esetén egyszerűsítünk: a tört értéke $${px([c, k])}$.`, R`A határérték a helyettesítési érték: $${c} \cdot ${K.par(p)} + ${K.par(k)} = ${K.T(v)}$.`]
    };
  });

  def('f2-hat-4', 'fuggvenyek', 'hatarertek', 3, 'Folytonossá tétel paraméterrel', function (r) {
    var c0 = r.nz(-3, 3), m = r.nz(-4, 4), p, n;
    do { p = r.nz(-6, 6); n = c0 * c0 + p * c0 - m * c0; } while (n === 0);
    var cs = [m, n], left = c0 * c0 + p * c0, cp = (c0 < 0 ? '- ' : '+ ') + (Math.abs(c0) === 1 ? '' : Math.abs(c0)) + 'p';
    return {
      q: R`Az $f$ függvény: $$f(x) = \begin{cases} x^2 + px, & \text{ha } x \leq ${c0} \\ ${px(cs)}, & \text{ha } x > ${c0} \end{cases}$$ Mekkora a $p$ paraméter, ha az $f$ folytonos az $x = ${c0}$ helyen?`,
      answer: { type: 'num', value: p }, ansTex: K.T(p),
      verify: `(${m}*(${c0})+(${n})-(${c0})^2)/(${c0})`,
      tip1: R`A folytonossághoz a bal oldali határérték, a jobb oldali határérték és a helyettesítési érték egyenlő.`,
      tip2: R`A bal oldali határérték és a helyettesítési érték: $${c0}^2 + p \cdot ${K.par(c0)}$. A jobb oldali határérték a másik polinom értéke a(z) $${c0}$ helyen.`,
      sol: [R`Mindkét szakasz polinom, ezért csak az $x = ${c0}$ helyen kell vizsgálni.`, R`Bal oldali határérték és helyettesítési érték: $${K.par(c0)}^2 + p \cdot ${K.par(c0)} = ${c0 * c0} ${cp}$.`, R`Jobb oldali határérték: $${K.par(m)} \cdot ${K.par(c0)} + ${K.par(n)} = ${K.T(m * c0 + n)}$.`, R`Az egyenlőség: $${c0 * c0} ${cp} = ${K.T(m * c0 + n)}$, ebből $p = ${K.T(p)}$.`, R`Ellenőrzés: $p = ${K.T(p)}$ esetén a bal oldali érték $${K.T(left)}$, a jobb oldali is $${K.T(m * c0 + n)}$.`]
    };
  });

  def('f2-hat-5', 'fuggvenyek', 'hatarertek', 3, 'Gyökös kifejezés határértéke', function (r) {
    if (r() < 0.6) {
      var s = r.int(1, 6), a = r.int(-3, 8), b = s * s - a, rt = `\\sqrt{x${add(b)}}`;
      return {
        q: R`Számítsd ki a határértéket: $\lim_{x \to ${a}} \dfrac{${rt} - ${s}}{${xm(a)}}$. (Törtet is megadhatsz.)`,
        answer: { type: 'num', value: 1 / (2 * s) }, ansTex: K.q(1, 2 * s),
        verify: `1/(2*sqrt(${a + b}))`,
        tip1: R`Behelyettesítve $\dfrac{0}{0}$ jön ki. Bővítsd a törtet a számláló konjugáltjával.`,
        tip2: R`A konjugált: $${rt} + ${s}$. A számlálóban $(u - v)(u + v) = u^2 - v^2$.`,
        sol: [R`Bővítünk a konjugálttal: $\dfrac{(${rt} - ${s})(${rt} + ${s})}{(${xm(a)})(${rt} + ${s})} = \dfrac{x${add(b)} - ${s * s}}{(${xm(a)})(${rt} + ${s})}$.`, R`A számláló: $x${add(b - s * s)} = ${xm(a)}$, ezért $x \neq ${a}$ esetén egyszerűsíthetünk: $\dfrac{1}{${rt} + ${s}}$.`, R`A határérték: $\dfrac{1}{\sqrt{${a + b}} + ${s}} = \dfrac{1}{${s} + ${s}} = ${K.q(1, 2 * s)}$.`]
      };
    }
    var p = r.nz(-9, 9), q0 = r.int(-9, 9), rad = `\\sqrt{${px([1, p, q0])}}`;
    return {
      q: R`Számítsd ki a határértéket: $\lim_{x \to \infty} \left(${rad} - x\right)$. (Törtet is megadhatsz.)`,
      answer: { type: 'num', value: p / 2 }, ansTex: K.q(p, 2),
      verify: `(${p})/2`,
      tip1: R`Ez $\infty - \infty$ alak. Bővítsd a kifejezést $${rad} + x$-szel, így a számlálóban eltűnik az $x^2$.`,
      tip2: R`Bővítés után a számláló $${px([p, q0])}$. Oszd el a számlálót és a nevezőt $x$-szel.`,
      sol: [R`Bővítünk a konjugálttal: $${rad} - x = \dfrac{(${px([1, p, q0])}) - x^2}{${rad} + x} = \dfrac{${px([p, q0])}}{${rad} + x}$.`, R`Pozitív $x$ esetén osszuk a számlálót és a nevezőt $x$-szel: $\dfrac{${K.T(p)} + \frac{${K.T(q0)}}{x}}{\sqrt{1 + \frac{${K.T(p)}}{x} + \frac{${K.T(q0)}}{x^2}} + 1}$.`, R`$x \to \infty$ esetén a $\dfrac{1}{x}$ alakú tagok nullához tartanak: a határérték $\dfrac{${K.T(p)}}{1 + 1} = ${K.q(p, 2)}$.`]
    };
  });

  /* ================================================================== */
  /* 3.4.2 Differenciálszámítás                                          */
  /* ================================================================== */
  MO.content['fuggvenyek/derivalas'] = {
    intro: R`A differenciálszámítás azt vizsgálja, milyen gyorsan változik egy függvény egy adott helyen: a grafikon érintőjének meredeksége, a pillanatnyi sebesség, a növekedés üteme mind a derivált. Segítségével egyszerűen megkeressük a függvény növekedési és fogyási szakaszait, a legnagyobb és a legkisebb értékét. A követelmény (3.4.2) a differencia- és differenciálhányados definícióját, az összeg-, különbség-, konstansszoros, szorzat- és hányadosfüggvény, az (egyszerű) összetett függvény deriválását, az $x^n$ deriváltjának bizonyítását és a trigonometrikus függvények deriváltját kéri; alkalmazásként az érintőt, a szélsőérték-feladatokat és a polinomfüggvények vizsgálatát. Az $e^x$, $a^x$ és $\ln x$ deriváltja nem szerepel a követelményben.`,
    theory: [
      { h: 'Differenciahányados és differenciálhányados (derivált)', level: 'emelt',
        b: R`Az $f$ függvény **differenciahányadosa** az $x_0$ és $x$ ($x \neq x_0$) pont között: $$\dfrac{f(x) - f(x_0)}{x - x_0} = \dfrac{f(x_0 + h) - f(x_0)}{h} \quad (h = x - x_0).$$ Ez az $(x_0; f(x_0))$ és $(x; f(x))$ pontokon átmenő **szelő meredeksége**, fizikában az **átlagos változási sebesség**.\nAz $f$ **differenciálhányadosa (deriváltja)** az $x_0$ helyen a differenciahányados határértéke, ha ez létezik és véges: $$f'(x_0) = \lim_{x \to x_0} \dfrac{f(x) - f(x_0)}{x - x_0} = \lim_{h \to 0} \dfrac{f(x_0 + h) - f(x_0)}{h}.$$ Ilyenkor $f$ az $x_0$-ban **deriválható**. Az $f'(x_0)$ a grafikon $x_0$-beli érintőjének meredeksége, vagyis a **pillanatnyi változási sebesség**. Az $x \mapsto f'(x)$ a **deriváltfüggvény**.\nPélda: $f(x) = x^2$, $x_0 = 3$: $\dfrac{(3+h)^2 - 9}{h} = \dfrac{6h + h^2}{h} = 6 + h \to 6$, tehát $f'(3) = 6$.\nA deriválható függvény folytonos, de fordítva nem: az $|x|$ a $0$-ban folytonos, mégsem deriválható (a bal oldali differenciahányados $-1$, a jobb oldali $+1$).` },
      { h: 'A hatványfüggvény deriváltja: (x^n)\' = n·x^(n−1)', level: 'emelt',
        b: R`**Tétel.** Ha $n$ pozitív egész szám, akkor $(x^n)' = n x^{n-1}$. Továbbá a konstans függvény deriváltja $0$, és $(x)' = 1$.\nPéldák: $(x^2)' = 2x$, $(x^3)' = 3x^2$, $(x^5)' = 5x^4$, $(7)' = 0$. Az $\dfrac{1}{x}$ és a $\sqrt{x}$ derivált szabálya nem része a követelménynek, ezért $n$ mindig természetes szám.\nA tétel a polinomok deriválásának alapja: minden $a x^n$ tag deriváltja $a n x^{n-1}$.`,
        proof: R`Az $x_0$ helyen a differenciahányados: $\dfrac{x^n - x_0^n}{x - x_0}$. Az $a^n - b^n = (a - b)(a^{n-1} + a^{n-2} b + \dots + b^{n-1})$ azonosság alapján $x \neq x_0$ esetén $\dfrac{x^n - x_0^n}{x - x_0} = x^{n-1} + x^{n-2} x_0 + \dots + x x_0^{n-2} + x_0^{n-1}$. Ez a kifejezés $n$ tagból áll. Ha $x \to x_0$, mindegyik tag $x_0^{n-1}$-hez tart, tehát a határérték $n \cdot x_0^{n-1}$. Mivel $x_0$ tetszőleges, $(x^n)' = n x^{n-1}$.` },
      { h: 'Deriválási szabályok: összeg, konstansszoros, szorzat, hányados', level: 'emelt',
        b: R`Ha $f$ és $g$ deriválható, akkor:\n1. **konstansszoros:** $(c \cdot f)' = c \cdot f'$;\n2. **összeg, különbség:** $(f \pm g)' = f' \pm g'$;\n3. **szorzat:** $(f \cdot g)' = f' \cdot g + f \cdot g'$;\n4. **hányados** ($g \neq 0$): $\left(\dfrac{f}{g}\right)' = \dfrac{f' \cdot g - f \cdot g'}{g^2}$.\nPolinomot tagonként deriválunk: $(3x^4 - 5x^2 + 2x - 7)' = 12x^3 - 10x + 2$.\nPélda szorzatra: $(x^2(x+1))' = 2x(x+1) + x^2 \cdot 1 = 3x^2 + 2x$ (egyezik a kifejtett alak, $x^3 + x^2$ deriváltjával).\nPélda hányadosra: $\left(\dfrac{2x+1}{x^2+1}\right)' = \dfrac{2(x^2+1) - (2x+1) \cdot 2x}{(x^2+1)^2} = \dfrac{-2x^2 - 2x + 2}{(x^2+1)^2}$.\nA szorzat deriváltja **nem** a deriváltak szorzata, a hányadosé sem a deriváltak hányadosa.` },
      { h: 'Összetett függvény deriválása (láncszabály)', level: 'emelt',
        b: R`Ha $g$ deriválható az $x$-ben, és $f$ deriválható a $g(x)$-ben, akkor az összetett függvény deriválható, és $$\big(f(g(x))\big)' = f'\big(g(x)\big) \cdot g'(x).$$ Vagyis: a **külső** függvény deriváltját a belső függvény értékénél vesszük, és megszorozzuk a **belső** függvény deriváltjával.\nEgyszerű esetek: $\big((ax + b)^n\big)' = n a (ax+b)^{n-1}$; $\big(\sin(ax + b)\big)' = a \cos(ax + b)$; $\big((x^2 + 1)^3\big)' = 3(x^2+1)^2 \cdot 2x$.\nEllenőrzés kifejtéssel: $(2x + 1)^2 = 4x^2 + 4x + 1$, deriváltja $8x + 4$; láncszabállyal $2(2x+1) \cdot 2 = 8x + 4$.` },
      { h: 'A trigonometrikus függvények deriváltja', level: 'emelt',
        b: R`Radiánban mért szögre:\n$$(\sin x)' = \cos x, \qquad (\cos x)' = -\sin x,$$ $$(\operatorname{tg} x)' = \dfrac{1}{\cos^2 x} \quad (\cos x \neq 0), \qquad (\operatorname{ctg} x)' = -\dfrac{1}{\sin^2 x} \quad (\sin x \neq 0).$$\nA koszinusz képletét a láncszabályból is megkaphatjuk: $\cos x = \sin\left(\dfrac{\pi}{2} - x\right)$, ezért $(\cos x)' = \cos\left(\dfrac{\pi}{2} - x\right) \cdot (-1) = -\sin x$. A tangens a hányadosszabállyal: $\left(\dfrac{\sin x}{\cos x}\right)' = \dfrac{\cos x \cdot \cos x + \sin x \cdot \sin x}{\cos^2 x} = \dfrac{1}{\cos^2 x}$.\nPélda: $(x \cos x)' = \cos x - x \sin x$; $(\sin 3x)' = 3\cos 3x$.\n**Kiegészítés:** a $\sin$ deriváltjának bizonyításához a $\lim_{x\to 0} \dfrac{\sin x}{x} = 1$ határértéket használják; ez nem követelmény.` },
      { h: 'Az érintő egyenlete', level: 'emelt',
        b: R`Ha $f$ deriválható $x_0$-ban, akkor a grafikon $(x_0; f(x_0))$ pontjához húzott **érintő** meredeksége $f'(x_0)$, egyenlete $$y = f'(x_0)\,(x - x_0) + f(x_0).$$ Menete: (1) kiszámítjuk $f(x_0)$-t; (2) megkeressük $f'(x)$-et, kiszámítjuk $f'(x_0)$-t; (3) beírjuk a képletbe.\nPélda: $f(x) = x^2$, $x_0 = 3$: $f(3) = 9$, $f'(3) = 6$, így $y = 6(x - 3) + 9 = 6x - 9$.\nFordított feladat: ha az érintő meredeksége adott ($m$) vagy az érintő párhuzamos egy adott egyenessel, az $f'(x) = m$ egyenletből kapjuk az érintési pontok helyét. A **normális** (merőleges) meredeksége $-\dfrac{1}{f'(x_0)}$, ha $f'(x_0) \neq 0$.\nKét görbe **érinti egymást** az $x_0$ helyen, ha $f(x_0) = g(x_0)$ és $f'(x_0) = g'(x_0)$.` },
      { h: 'Monotonitás, szélsőérték és konvexitás polinomfüggvényeknél', level: 'emelt',
        b: R`Legyen $f$ deriválható egy $I$ intervallumon.\n**Monotonitás:** $f' > 0$ az $I$ belsejében $\Rightarrow$ $f$ szigorúan monoton nő; $f' < 0$ $\Rightarrow$ szigorúan monoton csökken. ($f' \geq 0$, illetve $f' \leq 0$ esetén monoton nő, illetve csökken.)\n**Lokális szélsőérték.** Szükséges feltétel: ha $f$-nek az értelmezési tartomány egy belső $x_0$ pontjában lokális szélsőértéke van, és ott deriválható, akkor $f'(x_0) = 0$. Ez **nem elégséges**: $f(x) = x^3$-nek $f'(0) = 0$, mégsincs szélsőértéke. Elégséges feltétel: ha $f'$ az $x_0$-ban előjelet vált, mínuszból pluszba, akkor ott **lokális minimum**, pluszból mínuszba **lokális maximum** van. (Kétszer deriválható $f$-nél: $f'(x_0) = 0$ és $f''(x_0) > 0$ esetén minimum, $f''(x_0) < 0$ esetén maximum.)\n**Konvexitás:** $f'' > 0$ $\Rightarrow$ konvex („felfelé nyitott”), $f'' < 0$ $\Rightarrow$ konkáv. **Inflexiós pont:** ahol $f''$ előjelet vált (ott $f'' = 0$).\n**Zárt intervallumon** ($[a; b]$) a folytonos függvény legnagyobb és legkisebb értékét a lokális szélsőértékhelyek és a két végpont értékeinek összehasonlításával kapjuk.` },
      { h: 'Szélsőérték-feladatok megoldása', level: 'emelt',
        b: R`Szöveges szélsőérték-feladatnál (legnagyobb térfogat, legkisebb költség, legnagyobb terület) a megoldás lépései:\n1. **Változó:** válaszd az ismeretlen mennyiséget $x$-nek (egység!).\n2. **Értelmezési tartomány:** a feladat szabja meg ($x > 0$, a hosszak nem lehetnek negatívak).\n3. **Célfüggvény:** írd fel a maximalizálandó vagy minimalizálandó mennyiséget **egy** változó függvényeként (a másik változót a feltételből fejezd ki).\n4. **Derivált:** számítsd ki $f'(x)$-et, oldd meg az $f'(x) = 0$ egyenletet, a tartományon kívüli gyököt hagyd el.\n5. **Igazolás:** mutasd meg, hogy tényleg szélsőérték (előjelváltás, $f''$, vagy zárt intervallumnál a végpontok), és hogy a keresett fajta (max/min).\n6. **Válasz:** a kérdésre mondatban, mértékegységgel; kérdezhetik a helyet és az értéket is.\nTipikus témák: dobozok, kerítések (téglalap kerülete és területe), hengerek, utak, költségfüggvények.` }
    ],
    examples: [
      { t: 'Derivált a definícióból',
        p: R`Határozd meg az $f(x) = x^2 - 3x$ függvény deriváltját az $x_0 = 2$ helyen a definíció alapján (a differenciahányados határértékével)! Ellenőrizd a deriválási szabállyal!`,
        steps: [R`$f(2) = 2^2 - 3 \cdot 2 = -2$. A differenciahányados: $\dfrac{f(2 + h) - f(2)}{h}$.`, R`$f(2 + h) = (2+h)^2 - 3(2 + h) = 4 + 4h + h^2 - 6 - 3h = -2 + h + h^2$.`, R`$\dfrac{f(2+h) - f(2)}{h} = \dfrac{(-2 + h + h^2) - (-2)}{h} = \dfrac{h + h^2}{h} = 1 + h$ ($h \neq 0$).`, R`Ha $h \to 0$, akkor $1 + h \to 1$, tehát $f'(2) = 1$.`, R`Ellenőrzés: $f'(x) = 2x - 3$, ezért $f'(2) = 2 \cdot 2 - 3 = 1$.`],
        ans: R`$f'(2) = 1$.`,
        checks: [['((2+h)^2-3*(2+h)-(2^2-3*2))/h', '1+h'], ['2*2-3', '1'], ['(2+h)^2-3*(2+h)', '-2+h+h^2']] },
      { t: 'Deriválási szabályok',
        p: R`Deriváld: a) $h(x) = (x^2 + 1)(3x - 2)$; b) $g(x) = \dfrac{2x+1}{x^2+1}$, és számítsd ki $g'(1)$ értékét!`,
        steps: [R`a) Szorzatszabály: $h'(x) = 2x(3x - 2) + (x^2 + 1) \cdot 3 = 6x^2 - 4x + 3x^2 + 3 = 9x^2 - 4x + 3$.`, R`Ellenőrzés kifejtéssel: $h(x) = 3x^3 - 2x^2 + 3x - 2$, ennek deriváltja $9x^2 - 4x + 3$, ugyanaz.`, R`b) Hányadosszabály ($x^2 + 1 > 0$, tehát a nevező sosem nulla): $g'(x) = \dfrac{2(x^2+1) - (2x+1) \cdot 2x}{(x^2+1)^2}$.`, R`A számláló: $2x^2 + 2 - 4x^2 - 2x = -2x^2 - 2x + 2$, tehát $g'(x) = \dfrac{-2x^2 - 2x + 2}{(x^2+1)^2}$.`, R`$g'(1) = \dfrac{-2 - 2 + 2}{4} = -\dfrac{1}{2}$.`],
        ans: R`a) $h'(x) = 9x^2 - 4x + 3$; b) $g'(x) = \dfrac{-2x^2 - 2x + 2}{(x^2+1)^2}$, $g'(1) = -\dfrac{1}{2}$.`,
        checks: [['2x*(3x-2)+(x^2+1)*3', '9x^2-4x+3'], ['(2*(x^2+1)-(2x+1)*2x)/(x^2+1)^2', '(-2x^2-2x+2)/(x^2+1)^2'], ['(2*(1+1)-(2+1)*2)/(1+1)^2', '-1/2']] },
      { t: 'Összetett és trigonometrikus függvények',
        p: R`Deriváld az $f(x) = (3x - 1)^4 + \sin 2x$ függvényt, és számítsd ki $f'(0)$ értékét! Deriváld az $x \cos x$ függvényt is, és add meg a deriváltját $x = \pi$ helyen!`,
        steps: [R`Az első tag összetett függvény: külső $u^4$, belső $3x - 1$. A láncszabály: $\big((3x-1)^4\big)' = 4(3x-1)^3 \cdot 3 = 12(3x-1)^3$.`, R`A második tag: $(\sin 2x)' = \cos 2x \cdot 2 = 2\cos 2x$.`, R`Összegezve: $f'(x) = 12(3x-1)^3 + 2\cos 2x$.`, R`$f'(0) = 12 \cdot (-1)^3 + 2\cos 0 = -12 + 2 = -10$.`, R`Az $x \cos x$ szorzat: $(x\cos x)' = 1 \cdot \cos x + x \cdot (-\sin x) = \cos x - x\sin x$. Az $x = \pi$ helyen: $\cos\pi - \pi \sin\pi = -1 - 0 = -1$.`],
        ans: R`$f'(x) = 12(3x-1)^3 + 2\cos 2x$, $f'(0) = -10$; $(x\cos x)' = \cos x - x\sin x$, értéke $\pi$-nél $-1$.`,
        checks: [['4*(3x-1)^3*3', '12(3x-1)^3'], ['12*(3*0-1)^3+2*cos(0)', '-10'], ['(3x-1)^3*12', '324x^3-324x^2+108x-12'], ['cos(pi)-pi*sin(pi)', '-1']] },
      { t: 'Érintő egyenlete és párhuzamos érintők',
        p: R`Legyen $f(x) = x^3 - 2x + 1$. a) Írd fel a grafikon $x_0 = 2$ abszcisszájú pontjához húzott érintő egyenletét! b) Mely pontokban párhuzamos az érintő az $y = x - 7$ egyenessel?`,
        steps: [R`$f(2) = 8 - 4 + 1 = 5$. $f'(x) = 3x^2 - 2$, ezért $f'(2) = 12 - 2 = 10$.`, R`Az érintő: $y = 10(x - 2) + 5 = 10x - 15$.`, R`b) Az $y = x - 7$ egyenes meredeksége $1$. Párhuzamos érintőnél $f'(x) = 1$, azaz $3x^2 - 2 = 1$, $3x^2 = 3$, $x = \pm 1$.`, R`$f(1) = 1 - 2 + 1 = 0$, $f(-1) = -1 + 2 + 1 = 2$. A pontok: $(1; 0)$ és $(-1; 2)$.`, R`Ellenőrzés: $f'(\pm 1) = 3 - 2 = 1$. Az érintők nem esnek egybe az $y = x - 7$ egyenessel, mert az nem megy át ezeken a pontokon ($1 - 7 \neq 0$, $-1 - 7 \neq 2$).`],
        ans: R`a) $y = 10x - 15$; b) a $(1; 0)$ és a $(-1; 2)$ pontban.`,
        checks: [['2^3-2*2+1', '5'], ['3*2^2-2', '10'], ['10*(x-2)+5', '10x-15'], ['3*1^2-2', '1'], ['1^3-2*1+1', '0'], ['(-1)^3-2*(-1)+1', '2']] },
      { t: 'Polinomfüggvény vizsgálata (emelt)',
        p: R`Az $f(x) = x^3 - 6x^2 + 9x + 1$ függvényt vizsgáld meg: monotonitás, lokális szélsőérték, konvexitás, inflexiós pont; majd add meg a függvény legnagyobb és legkisebb értékét a $[0; 4]$ intervallumon!`,
        steps: [R`$f'(x) = 3x^2 - 12x + 9 = 3(x^2 - 4x + 3) = 3(x - 1)(x - 3)$. Zérushelyei: $x = 1$ és $x = 3$.`, R`Előjel: ha $x < 1$, akkor $f' > 0$ (mindkét tényező negatív, szorzatuk pozitív); ha $1 < x < 3$, akkor $f' < 0$; ha $x > 3$, akkor $f' > 0$. Tehát $f$ szigorúan nő a $]-\infty; 1]$ és a $[3; \infty[$ intervallumon, szigorúan csökken az $[1; 3]$ intervallumon.`, R`$x = 1$-ben $f'$ pluszból mínuszba vált: lokális maximum, értéke $f(1) = 1 - 6 + 9 + 1 = 5$. $x = 3$-ban mínuszból pluszba vált: lokális minimum, értéke $f(3) = 27 - 54 + 27 + 1 = 1$.`, R`$f''(x) = 6x - 12$. $f'' < 0$, ha $x < 2$: konkáv; $f'' > 0$, ha $x > 2$: konvex. $x = 2$-ben $f''$ előjelet vált, ezért inflexiós pont: $f(2) = 8 - 24 + 18 + 1 = 3$, azaz $(2; 3)$. (Ellenőrzés a második deriválttal: $f''(1) = -6 < 0$ maximum, $f''(3) = 6 > 0$ minimum.)`, R`A $[0; 4]$ intervallumon összehasonlítjuk a kritikus pontok és a végpontok értékeit: $f(0) = 1$, $f(1) = 5$, $f(3) = 1$, $f(4) = 64 - 96 + 36 + 1 = 5$.`],
        ans: R`Lokális maximum: $(1; 5)$, lokális minimum: $(3; 1)$; konkáv $x < 2$, konvex $x > 2$, inflexiós pont $(2; 3)$. A $[0; 4]$ intervallumon a legnagyobb érték $5$ (az $x = 1$ és az $x = 4$ helyen), a legkisebb érték $1$ (az $x = 0$ és az $x = 3$ helyen).`,
        checks: [['3x^2-12x+9', '3(x-1)(x-3)'], ['1-6+9+1', '5'], ['27-54+27+1', '1'], ['8-24+18+1', '3'], ['6*1-12', '-6'], ['6*3-12', '6'], ['4^3-6*4^2+9*4+1', '5']] },
      { t: 'Szöveges szélsőérték-feladat: a legnagyobb térfogatú doboz (emelt)',
        p: R`Egy $24$ cm hosszú és $15$ cm széles téglalap alakú lemez négy sarkából egy-egy $x$ cm oldalú négyzetet vágunk ki, majd a kinyúló részeket felhajtva nyitott tetejű dobozt készítünk. Mekkora legyen $x$, hogy a doboz térfogata a lehető legnagyobb legyen? Mekkora ez a térfogat?`,
        steps: [R`**Értelmezési tartomány.** A doboz alapjának oldalai $24 - 2x$ és $15 - 2x$ cm, magassága $x$ cm. Mindhárom pozitív: $x > 0$ és $15 - 2x > 0$, azaz $0 < x < 7{,}5$.`, R`**Célfüggvény.** $V(x) = x(24 - 2x)(15 - 2x)$. Mivel $(24 - 2x)(15 - 2x) = 360 - 78x + 4x^2$, ezért $V(x) = 4x^3 - 78x^2 + 360x$.`, R`**Derivált.** $V'(x) = 12x^2 - 156x + 360 = 12(x^2 - 13x + 30) = 12(x - 3)(x - 10)$. Gyökei: $x = 3$ és $x = 10$. A $10$ nincs benne a $]0; 7{,}5[$ tartományban, ezért csak $x = 3$ jöhet szóba.`, R`**Igazolás.** A $]0; 3[$ intervallumon $V' > 0$ (pl. $V'(1) = 216 > 0$), a $]3; 7{,}5[$ intervallumon $V' < 0$ (pl. $V'(5) = -120 < 0$). A $V'$ pluszból mínuszba vált, ezért $x = 3$-ban lokális maximum van; mivel ez az egyetlen kritikus pont a tartományban, itt van az abszolút maximum. (Másképp: $V''(x) = 24x - 156$, $V''(3) = -84 < 0$.)`, R`**Érték.** $V(3) = 3 \cdot 18 \cdot 9 = 486$. Ellenőrzés a polinommal: $4 \cdot 27 - 78 \cdot 9 + 360 \cdot 3 = 108 - 702 + 1080 = 486$.`],
        ans: R`A doboz térfogata akkor a legnagyobb, ha a levágott négyzetek oldala $3$ cm; ekkor a térfogat $486\ \text{cm}^3$ (az alap $18 \times 9$ cm, a magasság $3$ cm).`,
        checks: [['(24-2x)(15-2x)', '360-78x+4x^2'], ['x*(360-78x+4x^2)', '4x^3-78x^2+360x'], ['12x^2-156x+360', '12(x-3)(x-10)'], ['12*1^2-156*1+360', '216'], ['12*5^2-156*5+360', '-120'], ['3*18*9', '486'], ['4*27-78*9+360*3', '486'], ['24*3-156', '-84']] }
    ],
    sims: ['derivalt-erinto', 'fuggvenyvizsgalat', 'szelsoertek-feladatok', 'derivalo', 'tablazat'],
    mistakes: [
      R`A szorzat deriváltja nem a deriváltak szorzata: $(f g)' = f'g + fg'$. Ugyanígy a hányados deriváltja nem $\dfrac{f'}{g'}$.`,
      R`A hányadosszabálynál a számlálóban a sorrend számít: $f'g - fg'$ (nem $fg' - f'g$), a nevezőben pedig $g^2$.`,
      R`Összetett függvénynél elmarad a belső függvény deriváltjával való szorzás: $\big((2x+1)^3\big)' = 3(2x+1)^2 \cdot 2$, nem csak $3(2x+1)^2$.`,
      R`Az $f'(x_0) = 0$ nem elég a szélsőértékhez: kell az előjelváltás (vagy az $f''$ vizsgálata). Az $x^3$ deriváltja $0$-ban nulla, de ott nincs szélsőérték.`,
      R`Az érintő egyenlete $y = f'(x_0)(x - x_0) + f(x_0)$, nem $y = f'(x_0)x$ és nem $y = f(x_0)(x - x_0)$: a meredekség a derivált, a pont második koordinátája a függvényérték.`,
      R`Szöveges szélsőérték-feladatban elfelejted az értelmezési tartományt, a hamis gyök kizárását vagy a szélsőérték igazolását. A zárt intervallumnál a végpontok értékét is vizsgálni kell.`,
      R`A konstans deriváltja $0$ (nem $1$), $(x)' = 1$. Trigonometrikus függvényeknél a szög radiánban értendő, és $(\cos x)' = -\sin x$ (a mínusz előjel gyakran kimarad).`
    ],
    exam: R`A követelmény (3.4.2) csak az emelt szinten szerepel. Tudnod kell a differencia- és differenciálhányados definícióját, az összeg-, különbség-, konstansszoros, szorzat- és hányadosfüggvény deriválási szabályát, az egyszerű összetett függvény deriválását, az $(x^n)' = nx^{n-1}$ ($n \in \mathbb{N}$) bizonyítását és a trigonometrikus függvények deriváltját. Alkalmazásként az érintő egyenletének felírása, szélsőérték-feladatok megoldása és polinomfüggvények vizsgálata (monotonitás, szélsőérték, konvexitás) a követelmény. Az $e^x$, $a^x$, $\ln x$ deriváltja nem szerepel benne.`,
    cheat: [
      R`f'(x_0) = \lim_{x\to x_0} \dfrac{f(x) - f(x_0)}{x - x_0}`,
      R`(x^n)' = n x^{n-1},\quad (c)' = 0,\quad (x)' = 1`,
      R`(cf)' = cf',\quad (f \pm g)' = f' \pm g'`,
      R`(fg)' = f'g + fg',\quad \left(\dfrac{f}{g}\right)' = \dfrac{f'g - fg'}{g^2}`,
      R`\big(f(g(x))\big)' = f'(g(x)) \cdot g'(x)`,
      R`(\sin x)' = \cos x,\ (\cos x)' = -\sin x,\ (\operatorname{tg} x)' = \dfrac{1}{\cos^2 x},\ (\operatorname{ctg} x)' = -\dfrac{1}{\sin^2 x}`,
      R`\text{érintő: } y = f'(x_0)(x - x_0) + f(x_0)`,
      R`f' > 0 \Rightarrow \nearrow,\ f' < 0 \Rightarrow \searrow;\ f'' > 0 \Rightarrow \text{konvex},\ f'' < 0 \Rightarrow \text{konkáv}`
    ],
    cheatChecks: [['2x(x+1)+x^2', '3x^2+2x'], ['(2x*(x+1)-x^2*1)/(x+1)^2', '(x^2+2x)/(x+1)^2'], ['(cos(x)*cos(x)+sin(x)*sin(x))/cos(x)^2', '1/cos(x)^2'], ['1/cos(x)^2', '1+tg(x)^2'], ['2*(2x+1)*2', '8x+4']],
    terms: ['differenciahányados', 'differenciálhányados', 'derivált', 'deriváltfüggvény', 'érintő', 'szelő', 'láncszabály', 'szorzatszabály', 'hányadosszabály', 'lokális szélsőérték', 'monotonitás', 'konvex', 'konkáv', 'inflexiós pont', 'célfüggvény']
  };

  def('f2-der-1', 'fuggvenyek', 'derivalas', 1, 'Polinom deriváltfüggvénye', function (r) {
    var n = r.int(2, 5), cs = [r.nz(-6, 6)], i, dcs, terms = [];
    for (i = 0; i < n; i++) cs.push(r.int(-7, 7));
    dcs = dd(cs);
    dcs.forEach(function (c, j) { terms.push(`(${c})*x^${dcs.length - 1 - j}`); });
    var e = K.poly(dcs);
    return {
      q: R`Add meg az $f(x) = ${px(cs)}$ függvény deriváltfüggvényét rendezett, zárójel nélküli alakban.`,
      answer: { type: 'expr', expr: e, noParen: true }, ansTex: K.tex(e),
      verify: terms.join('+'),
      tip1: R`Tagonként deriválj: $(ax^k)' = a k x^{k-1}$, a konstans deriváltja $0$.`,
      tip2: R`A legmagasabb fokú tag: $${K.par(cs[0])} x^{${n}}$ deriváltja $${K.par(cs[0] * n)} x^{${n - 1}}$.`,
      sol: [R`Összegfüggvény, ezért tagonként deriválunk az $(x^k)' = k x^{k-1}$ szabály szerint.`, R`$f'(x) = ${K.tex(e)}$`]
    };
  });

  def('f2-der-2', 'fuggvenyek', 'derivalas', 2, 'Derivált értéke: szorzat, hányados, összetett, szinusz', function (r) {
    var t = r.int(0, 3), v, tex, qq, sol, verify;
    if (t === 0) {
      var a = r.nz(-3, 3), b = r.int(-5, 5), c = r.nz(-3, 3), d = r.int(-5, 5), x0 = r.int(-3, 3);
      v = a * (c * x0 * x0 + d) + (a * x0 + b) * (2 * c * x0);
      qq = R`Legyen $f(x) = (${px([a, b])})(${px([c, 0, d])})$. Számítsd ki $f'(${x0})$ értékét.`;
      verify = `3*(${a})*(${c})*(${x0})^2+2*(${b})*(${c})*(${x0})+(${a})*(${d})`;
      sol = [R`Szorzatszabály: $f'(x) = (${px([a])})(${px([c, 0, d])}) + (${px([a, b])})(${px([2 * c, 0])})$.`, R`$f'(${x0}) = ${K.T(a)} \cdot ${K.par(c * x0 * x0 + d)} + ${K.par(a * x0 + b)} \cdot ${K.par(2 * c * x0)} = ${K.T(v)}$`];
      return { q: qq, answer: { type: 'num', value: v }, ansTex: K.T(v), verify: verify, tip1: R`Használd a szorzatszabályt: $(uv)' = u'v + uv'$.`, tip2: R`$u = ${px([a, b])}$, $v = ${px([c, 0, d])}$; deriváltjaik: $u' = ${K.T(a)}$, $v' = ${px([2 * c, 0])}$.`, sol: sol };
    }
    if (t === 1) {
      var a1 = r.nz(-4, 4), b1 = r.int(-5, 5), c1 = r.int(1, 4), x1 = r.int(-3, 3);
      var N = -a1 * x1 * x1 - 2 * b1 * x1 + a1 * c1, D = (x1 * x1 + c1) * (x1 * x1 + c1);
      return {
        q: R`Legyen $f(x) = \dfrac{${px([a1, b1])}}{${px([1, 0, c1])}}$. Számítsd ki $f'(${x1})$ értékét. (Törtet is megadhatsz.)`,
        answer: { type: 'num', value: N / D }, ansTex: K.q(N, D),
        verify: `(-(${a1})*(${x1})^2-2*(${b1})*(${x1})+(${a1})*(${c1}))/((${x1})^2+${c1})^2`,
        tip1: R`Használd a hányadosszabályt: $\left(\dfrac{u}{v}\right)' = \dfrac{u'v - uv'}{v^2}$.`,
        tip2: R`$u = ${px([a1, b1])}$, $v = ${px([1, 0, c1])}$, $u' = ${K.T(a1)}$, $v' = 2x$.`,
        sol: [R`$f'(x) = \dfrac{${K.T(a1)}(${px([1, 0, c1])}) - (${px([a1, b1])}) \cdot 2x}{(${px([1, 0, c1])})^2}$. A nevező sosem nulla.`, R`$f'(${x1}) = \dfrac{${K.T(a1)} \cdot ${K.par(x1 * x1 + c1)} - ${K.par(a1 * x1 + b1)} \cdot ${K.par(2 * x1)}}{${K.par(x1 * x1 + c1)}^2} = ${K.q(N, D)}$`]
      };
    }
    if (t === 2) {
      var a2 = r.nz(-3, 3), b2 = r.int(-4, 4), n2 = r.int(2, 3), x2 = r.int(-2, 2);
      v = n2 * a2 * Math.pow(a2 * x2 + b2, n2 - 1);
      var vf = n2 === 2 ? `2*(${a2})^2*(${x2})+2*(${a2})*(${b2})` : `3*(${a2})^3*(${x2})^2+6*(${a2})^2*(${b2})*(${x2})+3*(${a2})*(${b2})^2`;
      return {
        q: R`Legyen $f(x) = (${px([a2, b2])})^{${n2}}$. Számítsd ki $f'(${x2})$ értékét.`,
        answer: { type: 'num', value: v }, ansTex: K.T(v), verify: vf,
        tip1: R`Összetett függvény: külső a hatványozás, belső az $${px([a2, b2])}$. Láncszabály.`,
        tip2: R`$f'(x) = ${n2} \cdot (${px([a2, b2])})^{${n2 - 1}} \cdot ${K.par(a2)}$.`,
        sol: [R`Láncszabály: $f'(x) = ${n2}(${px([a2, b2])})^{${n2 - 1}} \cdot ${K.par(a2)}$.`, R`$f'(${x2}) = ${n2} \cdot ${K.par(a2 * x2 + b2)}^{${n2 - 1}} \cdot ${K.par(a2)} = ${K.T(v)}$`]
      };
    }
    var a3 = r.nz(-5, 5), b3 = r.int(1, 4);
    return {
      q: R`Legyen $f(x) = ${a3 === 1 ? '' : a3 === -1 ? '-' : a3}\sin(${b3 === 1 ? '' : b3}x)$. Számítsd ki $f'\left(\dfrac{\pi}{${3 * b3}}\right)$ értékét. (Törtet is megadhatsz.)`,
      answer: { type: 'num', value: a3 * b3 / 2 }, ansTex: K.q(a3 * b3, 2),
      verify: `(${a3})*(${b3})*cos(pi/3)`,
      tip1: R`Összetett függvény: a belső függvény $${b3 === 1 ? '' : b3}x$, deriváltja $${b3}$. A $\sin$ deriváltja $\cos$.`,
      tip2: R`$f'(x) = ${K.par(a3 * b3)}\cos(${b3 === 1 ? '' : b3}x)$. A behelyettesítés után $\cos\dfrac{\pi}{3}$ jön.`,
      sol: [R`Láncszabály: $f'(x) = ${K.par(a3)} \cdot \cos(${b3 === 1 ? '' : b3}x) \cdot ${b3} = ${K.par(a3 * b3)}\cos(${b3 === 1 ? '' : b3}x)$.`, R`Az $x = \dfrac{\pi}{${3 * b3}}$ helyen $${b3 === 1 ? '' : b3}x = \dfrac{\pi}{3}$, és $\cos\dfrac{\pi}{3} = \dfrac{1}{2}$, ezért $f'\left(\dfrac{\pi}{${3 * b3}}\right) = ${K.q(a3 * b3, 2)}$.`]
    };
  });

  def('f2-der-3', 'fuggvenyek', 'derivalas', 2, 'Az érintő egyenlete', function (r) {
    var n, cs, x0, m, f0, i;
    do {
      n = r.int(2, 3); cs = [r.nz(-3, 3)];
      for (i = 0; i < n; i++) cs.push(r.int(-5, 5));
      x0 = r.nz(-2, 3); m = ev(dd(cs), x0); f0 = ev(cs, x0);
    } while (m === 0 || f0 === 0);
    var nn = f0 - m * x0, e = K.poly([m, nn]);
    return {
      q: R`Írd fel az $f(x) = ${px(cs)}$ függvény grafikonjának $x_0 = ${x0}$ abszcisszájú pontjához húzott érintő egyenletét. Add meg az $y = mx + n$ egyenlet jobb oldalát, az $x$ függvényében.`,
      answer: { type: 'expr', expr: e }, ansTex: K.tex(e),
      verify: `(${m})*(x-(${x0}))+(${f0})`,
      tip1: R`Az érintő egyenlete $y = f'(x_0)(x - x_0) + f(x_0)$. Előbb számítsd ki $f(x_0)$-t és $f'(x_0)$-t.`,
      tip2: R`$f'(x) = ${px(dd(cs))}$; ebbe és az $f$ képletébe helyettesíts a(z) $${x0}$ helyen.`,
      sol: [R`$f(${x0}) = ${K.T(f0)}$. $f'(x) = ${px(dd(cs))}$, ezért $f'(${x0}) = ${K.T(m)}$.`, R`Az érintő: $y = ${m === 1 ? '' : m === -1 ? '-' : m}(x ${x0 < 0 ? '+' : '-'} ${Math.abs(x0)}) ${f0 < 0 ? '-' : '+'} ${Math.abs(f0)}$, rendezve: $y = ${K.tex(e)}$.`]
    };
  });

  def('f2-der-4', 'fuggvenyek', 'derivalas', 2, 'Lokális szélsőérték helye', function (r) {
    var p = r.int(-5, 3), k = r.int(1, 3), q = p + 2 * k, c = r.nz(-9, 9);
    var cs = [1, -3 * (p + k), 3 * p * q, c], mx = r.int(0, 1) === 1;
    var ans = mx ? p : q;
    return {
      q: R`Az $f(x) = ${px(cs)}$ függvénynek hol van a lokális ${mx ? 'maximuma' : 'minimuma'}? Add meg az $x$ koordinátát.`,
      answer: { type: 'num', value: ans }, ansTex: K.T(ans),
      verify: mx ? `((${p + q})-(${q - p}))/2` : `((${p + q})+(${q - p}))/2`,
      tip1: R`Keresd meg az $f'(x) = 0$ egyenlet gyökeit, majd nézd meg, hogyan változik $f'$ előjele.`,
      tip2: R`$f'(x) = ${px([3, -6 * (p + k), 3 * p * q])} = 3(${xm(p)})(${xm(q)})$.`,
      sol: [R`$f'(x) = ${px([3, -6 * (p + k), 3 * p * q])} = 3(${xm(p)})(${xm(q)})$. Zérushelyei: $x = ${p}$ és $x = ${q}$.`, R`$x < ${p}$ esetén $f' > 0$, $${p} < x < ${q}$ esetén $f' < 0$, $x > ${q}$ esetén $f' > 0$.`, R`A(z) $${p}$ helyen $f'$ pluszból mínuszba vált: lokális maximum. A(z) $${q}$ helyen mínuszból pluszba vált: lokális minimum.`, R`A keresett hely: $x = ${K.T(ans)}$.`]
    };
  });

  def('f2-der-5', 'fuggvenyek', 'derivalas', 3, 'Szöveges szélsőérték-feladat', function (r) {
    var t = r.int(0, 2), ask = r.int(0, 1);
    if (t === 0) {
      var k = r.int(2, 6), a = 6 * k, ans = ask ? 16 * k * k * k : k;
      return {
        q: R`Egy $${a}$ cm oldalú négyzet alakú kartonlemez négy sarkából egy-egy $x$ cm oldalú négyzetet kivágunk, majd a kinyúló részeket felhajtva nyitott dobozt készítünk. ${ask ? 'Mekkora a doboz legnagyobb térfogata cm³-ben?' : 'Mekkora legyen $x$ (cm-ben), hogy a doboz térfogata a lehető legnagyobb legyen?'}`,
        answer: { type: 'num', value: ans }, ansTex: ask ? R`${K.B(ans)}\ \text{cm}^3` : R`${k}\ \text{cm}`,
        verify: ask ? `${k}*(${a}-2*${k})^2` : `${a}/6`,
        tip1: R`Írd fel a térfogatot $x$ függvényeként: alapél $${a} - 2x$, magasság $x$. Ne feledd az értelmezési tartományt!`,
        tip2: R`$V(x) = x(${a} - 2x)^2$, $0 < x < ${a / 2}$. Deriváláskor szorzatszabályt használj, majd bontsd szorzattá a deriváltat.`,
        sol: [R`$V(x) = x(${a} - 2x)^2$, értelmezési tartomány: $0 < x < ${a / 2}$.`, R`$V'(x) = (${a} - 2x)^2 + x \cdot 2(${a} - 2x)(-2) = (${a} - 2x)(${a} - 6x)$.`, R`$V'(x) = 0$: $x = ${a / 2}$ (kívül esik a tartományon) vagy $x = ${k}$.`, R`A $]0; ${k}[$ intervallumon $V' > 0$, a $]${k}; ${a / 2}[$ intervallumon $V' < 0$, ezért $x = ${k}$ helyen abszolút maximum van.`, ask ? R`$V(${k}) = ${k} \cdot ${a - 2 * k}^2 = ${K.B(16 * k * k * k)}$ cm³.` : R`A keresett érték: $x = ${k}$ cm.`]
      };
    }
    if (t === 1) {
      var m = r.int(3, 15), L = 4 * m, ans1 = ask ? 2 * m * m : m;
      return {
        q: R`Egy kert egyik oldalát meglévő fal határolja, a másik három oldalra $${L}$ m hosszú kerítést építünk, így téglalap alakú területet kapunk. A falra merőleges oldalak hossza $x$ méter. ${ask ? 'Mekkora lehet a bekerített terület legnagyobb értéke (m²-ben)?' : 'Mekkora legyen $x$ (méterben), hogy a bekerített terület a legnagyobb legyen?'}`,
        answer: { type: 'num', value: ans1 }, ansTex: ask ? R`${K.B(2 * m * m)}\ \text{m}^2` : R`${m}\ \text{m}`,
        verify: ask ? `${m}*(${L}-2*${m})` : `${L}/4`,
        tip1: R`A fallal párhuzamos oldal hossza $${L} - 2x$. Írd fel a területet $x$ függvényében, és add meg az értelmezési tartományt.`,
        tip2: R`$T(x) = x(${L} - 2x)$, $0 < x < ${L / 2}$. Deriváld, és oldd meg a $T'(x) = 0$ egyenletet.`,
        sol: [R`$T(x) = x(${L} - 2x) = ${L}x - 2x^2$, $0 < x < ${L / 2}$.`, R`$T'(x) = ${L} - 4x = 0$, ebből $x = ${m}$.`, R`$T'(x) > 0$ az $x < ${m}$, és $T'(x) < 0$ az $x > ${m}$ esetén, tehát $x = ${m}$ helyen abszolút maximum van ($T'' = -4 < 0$).`, ask ? R`$T(${m}) = ${m} \cdot ${L - 2 * m} = ${K.B(2 * m * m)}$ m².` : R`A keresett érték: $x = ${m}$ m.`]
      };
    }
    var k2 = r.int(3, 12), area = k2 * k2, ans2 = ask ? 4 * k2 : k2;
    return {
      q: R`Egy téglalap területe $${area}$ cm². Az egyik oldala $x$ cm. ${ask ? 'Mekkora lehet a téglalap kerületének legkisebb értéke (cm-ben)?' : 'Mekkora legyen $x$ (cm-ben), hogy a téglalap kerülete a lehető legkisebb legyen?'}`,
      answer: { type: 'num', value: ans2 }, ansTex: ask ? R`${4 * k2}\ \text{cm}` : R`${k2}\ \text{cm}`,
      verify: ask ? `2*${k2}+2*${area}/${k2}` : `sqrt(${area})`,
      tip1: R`A másik oldal $\dfrac{${area}}{x}$. Írd fel a kerületet $x$ függvényében ($x > 0$).`,
      tip2: R`$K(x) = 2x + \dfrac{${2 * area}}{x}$. A derivált: $K'(x) = 2 - \dfrac{${2 * area}}{x^2}$.`,
      sol: [R`A másik oldal $\dfrac{${area}}{x}$ cm, így $K(x) = 2x + \dfrac{${2 * area}}{x}$, $x > 0$.`, R`$K'(x) = 2 - \dfrac{${2 * area}}{x^2} = 0$, ebből $x^2 = ${area}$, és $x > 0$ miatt $x = ${k2}$.`, R`$K'(x) < 0$, ha $x < ${k2}$, és $K'(x) > 0$, ha $x > ${k2}$: mínuszból pluszba vált, tehát $x = ${k2}$ helyen abszolút minimum van (négyzet).`, ask ? R`$K(${k2}) = 2 \cdot ${k2} + \dfrac{${2 * area}}{${k2}} = ${4 * k2}$ cm.` : R`A keresett érték: $x = ${k2}$ cm.`]
    };
  });

  /* ================================================================== */
  /* 3.4.3 Integrálszámítás                                              */
  /* ================================================================== */
  MO.content['fuggvenyek/integral'] = {
    intro: R`Az integrálszámítás a görbe alatti terület, az összegzés és a felhalmozódás matematikája: ha tudjuk, milyen gyorsan változik valami, az integrállal megkapjuk a teljes változást. A követelmény (3.4.3) szerint ismerni kell a határozott integrál szemléletes fogalmát és tulajdonságait, a kétoldali közelítés módszerét, az integrálfüggvényt, a primitív függvényt és a Newton–Leibniz-tételt, és ki kell tudni számolni a polinomfüggvények, valamint a szinusz- és koszinuszfüggvény grafikonja alatti területet. A deriválást megfordító gondolat a számolás kulcsa.`,
    theory: [
      { h: 'A határozott integrál szemléletes fogalma', level: 'emelt',
        b: R`Az $f$ folytonos függvény **határozott integrálja** az $[a; b]$ intervallumon, jelölése $\displaystyle\int_a^b f(x)\,dx$, az $f$ grafikonja és az $x$-tengely közötti, **előjeles** terület: ahol $f \geq 0$, ott a terület pozitív előjellel, ahol $f \leq 0$, ott negatív előjellel számít. Az $a$ és $b$ az integrálás alsó és felső határa.\nPéldák: ha $f(x) = c$ konstans, akkor $\int_a^b c\,dx = c(b - a)$ (téglalap); $\int_0^2 x\,dx = 2$ (háromszög területe: $\dfrac{2 \cdot 2}{2}$); $\int_{-1}^{1} x\,dx = 0$, mert a két háromszög területe ellentétes előjellel számít. Az $a = b$ esetben $\int_a^a f = 0$.\nA folytonos függvény minden zárt intervallumon integrálható. Az integrál **nem egyenlő** a „geometriai” területtel, ha az $f$ előjelet vált.` },
      { h: 'A kétoldali közelítés módszere', level: 'emelt',
        b: R`Osszuk az $[a; b]$ intervallumot $n$ részre (osztópontok). Az $i$-edik részintervallumon legyen $m_i$ az $f$ legkisebb, $M_i$ a legnagyobb értéke ($f$ folytonos). Az **alsó közelítő összeg** a $m_i \cdot \Delta x_i$ téglalapok területének összege ($s_n$), a **felső közelítő összeg** az $M_i \cdot \Delta x_i$ téglalapoké ($S_n$). Mindig $s_n \leq \int_a^b f \leq S_n$.\nFolytonos függvénynél, ha a felosztást minden határon túl finomítjuk, az $S_n - s_n$ különbség $0$-hoz tart, és a két összeg közös határértéke a határozott integrál. Ez a **kétoldali közelítés**.\nPélda: $\int_0^1 x^2\,dx$, az intervallumot $n$ egyenlő részre osztva (a $0$-tól $1$-ig növekvő $x^2$ legkisebb értéke a rész bal végén, legnagyobb a jobb végén). Az $1^2 + 2^2 + \dots + m^2 = \dfrac{m(m+1)(2m+1)}{6}$ összegzéssel: $$s_n = \dfrac{(n-1)(2n-1)}{6n^2}, \qquad S_n = \dfrac{(n+1)(2n+1)}{6n^2}.$$ Mindkettő $\dfrac{1}{3}$-hoz tart, ezért $\int_0^1 x^2\,dx = \dfrac{1}{3}$.` },
      { h: 'A határozott integrál tulajdonságai', level: 'emelt',
        b: R`Ha $f$ és $g$ folytonos az $[a; b]$ intervallumon, akkor:\n1. **konstansszoros:** $\int_a^b c f = c \int_a^b f$;\n2. **összeg, különbség:** $\int_a^b (f \pm g) = \int_a^b f \pm \int_a^b g$;\n3. **intervallum szerinti additivitás:** $\int_a^b f = \int_a^c f + \int_c^b f$ ($a \leq c \leq b$);\n4. **határok felcserélése:** $\int_b^a f = -\int_a^b f$;\n5. **monotonitás:** ha $f \leq g$ az $[a; b]$-n, akkor $\int_a^b f \leq \int_a^b g$; speciálisan $f \geq 0$ esetén $\int_a^b f \geq 0$.\nA szorzat integrálja **nem** az integrálok szorzata.\nPélda a 3. tulajdonságra: $\int_0^3 x^2\,dx = \int_0^1 x^2\,dx + \int_1^3 x^2\,dx = \dfrac{1}{3} + \dfrac{26}{3} = 9$. Szakaszonként megadott függvénynél és előjelváltásnál ezt használjuk.` },
      { h: 'Az integrálfüggvény', level: 'emelt',
        b: R`Az $f$ folytonos függvény $a$ ponthoz tartozó **integrálfüggvénye**: $$F(x) = \int_a^x f(t)\,dt.$$ Ez azt adja meg, mekkora az előjeles terület $a$-tól az $x$ változó végpontig. **Tétel:** ha $f$ folytonos, akkor az integrálfüggvény deriválható, és $F'(x) = f(x)$.\nSzemléletes indoklás: ha $x$-et $h$-val megnöveljük, a terület kb. egy $f(x)$ magas, $h$ széles téglalappal nő: $F(x + h) - F(x) \approx f(x) \cdot h$, vagyis $\dfrac{F(x+h) - F(x)}{h} \approx f(x)$, ami $h \to 0$ esetén pontosan $f(x)$.\nPélda: $f(t) = 2t$, $a = 0$: $F(x) = \int_0^x 2t\,dt = x^2$ (háromszög-terület: $\dfrac{x \cdot 2x}{2}$), és valóban $F'(x) = 2x = f(x)$.` },
      { h: 'Primitív függvény és határozatlan integrál', level: 'emelt',
        b: R`Az $F$ függvény az $f$ **primitív függvénye** az $I$ intervallumon, ha $F$ deriválható $I$-n és $F'(x) = f(x)$ ($x \in I$). Folytonos $f$-nek az integrálfüggvény mindig primitív függvénye, tehát van primitív függvény.\nHa $F$ az $f$ egy primitív függvénye, akkor $F + C$ ($C$ konstans) is az, és **nincs más**: két primitív függvény különbségének deriváltja $0$, ezért a különbség konstans. A primitív függvények halmazát **határozatlan integrálnak** nevezzük: $\int f(x)\,dx = F(x) + C$.\n**Alapintegrálok:** $\int x^n\,dx = \dfrac{x^{n+1}}{n+1} + C$ ($n \geq 0$ egész), $\int \sin x\,dx = -\cos x + C$, $\int \cos x\,dx = \sin x + C$. Polinomot tagonként integrálunk: $\int (3x^2 - 4x + 5)\,dx = x^3 - 2x^2 + 5x + C$.\nEllenőrzés mindig deriválással: $(x^3 - 2x^2 + 5x)' = 3x^2 - 4x + 5$. Konstansszorosra és összegre ugyanazok a szabályok érvényesek, mint a deriválásnál. **Kiegészítés:** $\int f(ax + b)\,dx = \dfrac{1}{a} F(ax + b) + C$ ($a \neq 0$), például $\int \sin 2x\,dx = -\dfrac{1}{2}\cos 2x + C$.` },
      { h: 'A Newton–Leibniz-tétel', level: 'emelt',
        b: R`**Tétel.** Ha $f$ folytonos az $[a; b]$ intervallumon, és $F$ az $f$ egy tetszőleges primitív függvénye, akkor $$\int_a^b f(x)\,dx = F(b) - F(a) = \big[F(x)\big]_a^b.$$ Ez az összekötő híd a terület és a deriválás között: a határozott integrált nem összegzéssel, hanem primitív függvénnyel számoljuk.\nPélda: $\int_1^3 (2x + 1)\,dx = \big[x^2 + x\big]_1^3 = (9 + 3) - (1 + 1) = 10$. A $C$ konstans kiesik: $(F(b) + C) - (F(a) + C) = F(b) - F(a)$, ezért a számolásnál elhagyjuk.`,
        proof: R`Legyen $\Phi(x) = \int_a^x f(t)\,dt$ az integrálfüggvény. Az előző tétel szerint $\Phi' = f$, tehát $\Phi$ az $f$ egy primitív függvénye. Ha $F$ is primitív függvény, akkor $F = \Phi + C$ valamilyen $C$ konstanssal. Ekkor $F(b) - F(a) = \big(\Phi(b) + C\big) - \big(\Phi(a) + C\big) = \Phi(b) - \Phi(a)$. Mivel $\Phi(a) = \int_a^a f = 0$ és $\Phi(b) = \int_a^b f$, azt kapjuk, hogy $F(b) - F(a) = \int_a^b f$.` },
      { h: 'Területszámítás integrállal', level: 'emelt',
        b: R`**1. Görbe és $x$-tengely.** Ha $f \geq 0$ az $[a; b]$-n, a terület $T = \int_a^b f$. Ha $f$ előjelet vált, a zérushelyeknél szakaszokra bontunk, és az integrálok **abszolút értékét** adjuk össze (vagy a negatív részre $-\int f$-et vesszük): $T = \int_a^b |f(x)|\,dx$. A teljes intervallumra számolt integrál a pozitív és a negatív rész különbsége, nem a terület!\n**2. Két görbe között.** Ha $f \geq g$ az $[a; b]$-n, akkor $T = \int_a^b \big(f(x) - g(x)\big)\,dx$. Először a metszéspontokat keressük ($f(x) = g(x)$), ezek adják az integrálás határait; ha több metszéspont van, minden szakaszon a felső függvény az „$f$”.\n**3. Szinusz és koszinusz.** Pl. $\int_0^{\pi} \sin x\,dx = \big[-\cos x\big]_0^{\pi} = 2$; $\int_0^{\pi/2} \cos x\,dx = 1$.\n**4. Paraméteres feladat.** Az integrált az $a$ paraméterrel számoljuk ki, majd az eredményből (pl. $T = \dfrac{a^3}{6}$) oldjuk meg a feltételt.\nGyorsítás: az $y = k(x-p)(x-q)$ parabola és az $x$-tengely közti terület $\dfrac{|k|(q-p)^3}{6}$; ez az integrálból levezethető.` },
      { h: 'Kiegészítés: forgástest térfogata (nem követelmény)',
        b: R`A forgástest térfogata nem szerepel a követelményben, ezért ez csak kiegészítés. Ha az $f \geq 0$ grafikonját az $x$-tengely körül megforgatjuk az $[a; b]$ intervallumon, a keletkező test térfogata $V = \pi \int_a^b \big(f(x)\big)^2\,dx$. A gondolat ugyanaz, mint a területnél: vékony korongokra osztjuk a testet, és összegezzük. Példa: $f(x) = x$, $[0; 3]$: $V = \pi \int_0^3 x^2\,dx = 9\pi$ (ez egy $3$ magas, $3$ sugarú kúp, $\dfrac{1}{3} \cdot 3^2 \pi \cdot 3 = 9\pi$).` }
    ],
    examples: [
      { t: 'Határozott integrál a Newton–Leibniz-tétellel',
        p: R`Számítsd ki az $\displaystyle\int_{-1}^{2} (3x^2 - 4x + 1)\,dx$ határozott integrált!`,
        steps: [R`A függvény polinom, tehát folytonos; tagonként integrálunk. Egy primitív függvény: $F(x) = x^3 - 2x^2 + x$, mert $(x^3 - 2x^2 + x)' = 3x^2 - 4x + 1$.`, R`$F(2) = 8 - 8 + 2 = 2$.`, R`$F(-1) = -1 - 2 - 1 = -4$.`, R`Newton–Leibniz: $\int_{-1}^{2} (3x^2 - 4x + 1)\,dx = F(2) - F(-1) = 2 - (-4) = 6$.`],
        ans: R`Az integrál értéke $6$.`,
        checks: [['3x^2-4x+1', '(x-1)(3x-1)'], ['2^3-2*2^2+2', '2'], ['(-1)^3-2*(-1)^2+(-1)', '-4'], ['2-(-4)', '6']] },
      { t: 'Terület az x-tengellyel, előjelváltással',
        p: R`Mekkora területet zár közre az $f(x) = x^2 - 4x$ függvény grafikonja, az $x$-tengely és az $x = 0$, $x = 5$ egyenesek?`,
        steps: [R`$f(x) = x(x - 4)$, zérushelyei $0$ és $4$. A $]0; 4[$ intervallumon $f < 0$ (a grafikon az $x$-tengely alatt van), a $]4; 5[$ intervallumon $f > 0$. Szakaszokra kell bontani.`, R`Egy primitív függvény: $F(x) = \dfrac{x^3}{3} - 2x^2$.`, R`$\int_0^4 f = F(4) - F(0) = \dfrac{64}{3} - 32 = -\dfrac{32}{3}$, a terület ennek abszolút értéke: $\dfrac{32}{3}$.`, R`$\int_4^5 f = F(5) - F(4) = \left(\dfrac{125}{3} - 50\right) - \left(\dfrac{64}{3} - 32\right) = -\dfrac{25}{3} + \dfrac{32}{3} = \dfrac{7}{3}$.`, R`Összesen: $T = \dfrac{32}{3} + \dfrac{7}{3} = \dfrac{39}{3} = 13$. (A teljes intervallumra számolt $\int_0^5 f = -\dfrac{25}{3}$ **nem** a terület.)`],
        ans: R`A terület $13$ területegység.`,
        checks: [['x^2-4x', 'x(x-4)'], ['64/3-32', '-32/3'], ['(125/3-50)-(64/3-32)', '7/3'], ['32/3+7/3', '13'], ['125/3-50', '-25/3']] },
      { t: 'Két görbe által közbezárt terület',
        p: R`Számítsd ki az $y = x^2$ parabola és az $y = x + 2$ egyenes által közbezárt síkidom területét!`,
        steps: [R`Metszéspontok: $x^2 = x + 2$, azaz $x^2 - x - 2 = 0$, ennek gyökei $x = -1$ és $x = 2$.`, R`A $]-1; 2[$ intervallumon az egyenes van a parabola fölött (pl. $x = 0$: $2 > 0$), ezért $T = \int_{-1}^{2} \big((x + 2) - x^2\big)\,dx$.`, R`Egy primitív függvény: $F(x) = \dfrac{x^2}{2} + 2x - \dfrac{x^3}{3}$.`, R`$F(2) = 2 + 4 - \dfrac{8}{3} = \dfrac{10}{3}$, $F(-1) = \dfrac{1}{2} - 2 + \dfrac{1}{3} = -\dfrac{7}{6}$.`, R`$T = F(2) - F(-1) = \dfrac{10}{3} + \dfrac{7}{6} = \dfrac{27}{6} = \dfrac{9}{2}$.`],
        ans: R`A terület $\dfrac{9}{2} = 4{,}5$ területegység.`,
        checks: [['x+2-x^2', '-(x-2)*(x+1)'], ['(2^2/2+2*2-2^3/3)-((-1)^2/2+2*(-1)-(-1)^3/3)', '9/2'], ['2+4-8/3', '10/3'], ['1/2-2+1/3', '-7/6'], ['10/3+7/6', '9/2']] },
      { t: 'Paraméteres területfeladat (emelt)',
        p: R`Az $f_a(x) = ax - x^2$ függvényben $a > 0$ paraméter. a) Fejezd ki az $f_a$ grafikonja és az $x$-tengely által közbezárt terület nagyságát $a$ függvényében! b) Mekkora $a$ esetén lesz ez a terület $36$? c) Ennél az $a$ értéknél mekkora területet zár közre az $f_a$ grafikonja és az $y = x$ egyenes?`,
        steps: [R`a) $ax - x^2 = x(a - x) = 0$, ha $x = 0$ vagy $x = a$. A $]0; a[$ intervallumon $f_a > 0$ (a parabola lefelé nyílik, ezért a két zérushelye között pozitív), így $T(a) = \int_0^a (ax - x^2)\,dx$.`, R`Primitív függvény: $\dfrac{ax^2}{2} - \dfrac{x^3}{3}$. $T(a) = \dfrac{a \cdot a^2}{2} - \dfrac{a^3}{3} = \dfrac{a^3}{2} - \dfrac{a^3}{3} = \dfrac{a^3}{6}$.`, R`b) $\dfrac{a^3}{6} = 36$, ebből $a^3 = 216$, $a = 6$ (valós gyök, és $a > 0$ teljesül).`, R`c) $a = 6$ esetén $6x - x^2 = x$, azaz $5x - x^2 = 0$, a metszéspontok: $x = 0$ és $x = 5$. Az intervallumon a parabola van az egyenes fölött, ezért $T = \int_0^5 \big((6x - x^2) - x\big)\,dx = \int_0^5 (5x - x^2)\,dx$.`, R`$\int_0^5 (5x - x^2)\,dx = \left[\dfrac{5x^2}{2} - \dfrac{x^3}{3}\right]_0^5 = \dfrac{125}{2} - \dfrac{125}{3} = \dfrac{125}{6}$. (Egyezik az $a - 1 = 5$ esetén a $\dfrac{(a-1)^3}{6}$ képlettel.)`],
        ans: R`a) $T(a) = \dfrac{a^3}{6}$; b) $a = 6$; c) $\dfrac{125}{6} \approx 20{,}83$ területegység.`,
        checks: [['a^3/2-a^3/3', 'a^3/6'], ['6^3/6', '36'], ['6x-x^2-x', '5x-x^2'], ['5*5^2/2-5^3/3', '125/6'], ['(6-1)^3/6', '125/6']] },
      { t: 'Szinusz és koszinusz közötti terület',
        p: R`Számítsd ki az $\displaystyle\int_0^{\pi} \sin x\,dx$ integrált, majd azt a területet, amelyet a $\sin x$ és a $\cos x$ grafikonja zár közre az $\left[\dfrac{\pi}{4}; \dfrac{5\pi}{4}\right]$ intervallumon!`,
        steps: [R`$\int_0^{\pi} \sin x\,dx = \big[-\cos x\big]_0^{\pi} = -\cos\pi - (-\cos 0) = 1 + 1 = 2$.`, R`A $\sin x = \cos x$ egyenlet megoldásai az $x = \dfrac{\pi}{4}$ és az $x = \dfrac{5\pi}{4}$ (egymás utáni metszéspontok). Köztük $\sin x \geq \cos x$ (pl. $x = \dfrac{\pi}{2}$: $1 > 0$).`, R`$T = \int_{\pi/4}^{5\pi/4} (\sin x - \cos x)\,dx = \big[-\cos x - \sin x\big]_{\pi/4}^{5\pi/4}$.`, R`$-\cos\dfrac{5\pi}{4} - \sin\dfrac{5\pi}{4} = \dfrac{\sqrt{2}}{2} + \dfrac{\sqrt{2}}{2} = \sqrt{2}$, és $-\cos\dfrac{\pi}{4} - \sin\dfrac{\pi}{4} = -\sqrt{2}$.`, R`$T = \sqrt{2} - (-\sqrt{2}) = 2\sqrt{2} \approx 2{,}83$.`],
        ans: R`$\int_0^{\pi} \sin x\,dx = 2$; a két görbe közötti terület $2\sqrt{2}$ területegység.`,
        checks: [['-cos(pi)-(-cos(0))', '2'], ['-cos(5*pi/4)-sin(5*pi/4)', 'sqrt(2)'], ['-cos(pi/4)-sin(pi/4)', '-sqrt(2)'], ['sqrt(2)-(-sqrt(2))', '2*sqrt(2)']] },
      { t: 'Kétoldali közelítés',
        p: R`Az $\int_0^1 x^2\,dx$ integrált közelítsd alsó és felső közelítő összeggel az $[0; 1]$ intervallum $4$ egyenlő részre osztásával! Hasonlítsd össze a pontos értékkel!`,
        steps: [R`Az osztópontok: $0$; $\dfrac{1}{4}$; $\dfrac{1}{2}$; $\dfrac{3}{4}$; $1$. A részintervallumok szélessége $\dfrac{1}{4}$. Az $x^2$ növekvő, ezért a legkisebb érték a bal, a legnagyobb a jobb végpontban van.`, R`Alsó összeg: $s_4 = \dfrac{1}{4}\left(0^2 + \left(\dfrac{1}{4}\right)^2 + \left(\dfrac{1}{2}\right)^2 + \left(\dfrac{3}{4}\right)^2\right) = \dfrac{1}{4} \cdot \dfrac{0 + 1 + 4 + 9}{16} = \dfrac{14}{64} = \dfrac{7}{32}$.`, R`Felső összeg: $S_4 = \dfrac{1}{4} \cdot \dfrac{1 + 4 + 9 + 16}{16} = \dfrac{30}{64} = \dfrac{15}{32}$.`, R`Tehát $\dfrac{7}{32} \leq \int_0^1 x^2\,dx \leq \dfrac{15}{32}$. A pontos érték (Newton–Leibniz): $\left[\dfrac{x^3}{3}\right]_0^1 = \dfrac{1}{3}$, és $\dfrac{7}{32} \approx 0{,}219 < 0{,}333 < \dfrac{15}{32} \approx 0{,}469$.`, R`A képletekkel: $s_n = \dfrac{(n-1)(2n-1)}{6n^2}$, $n = 4$ esetén $\dfrac{3 \cdot 7}{96} = \dfrac{7}{32}$, és $S_n = \dfrac{(n+1)(2n+1)}{6n^2} = \dfrac{5 \cdot 9}{96} = \dfrac{15}{32}$.`],
        ans: R`$\dfrac{7}{32} \leq \int_0^1 x^2\,dx \leq \dfrac{15}{32}$, a pontos érték $\dfrac{1}{3}$.`,
        checks: [['(1/4)*(0+1/16+4/16+9/16)', '7/32'], ['(1/4)*(1/16+4/16+9/16+1)', '15/32'], ['(4-1)*(2*4-1)/(6*4^2)', '7/32'], ['(4+1)*(2*4+1)/(6*4^2)', '15/32'], ['1^3/3-0^3/3', '1/3']] }
    ],
    sims: ['riemann', 'ket-gorbe-terulet', 'derivalo', 'forgastest'],
    mistakes: [
      R`A Newton–Leibniz-képletben a sorrend $F(b) - F(a)$: a felső határ értéke mínusz az alsóé. Fordított sorrendben az eredmény előjele rossz.`,
      R`Az $\int_a^b f$ előjeles terület: ha $f$ előjelet vált, a teljes intervallumra számolt integrál nem a terület. Zérushelyeknél szakaszokra kell bontani, és abszolút értékeket kell összeadni.`,
      R`Két görbe közti területnél $f - g$ a felső mínusz az alsó; az integrálás határai a metszéspontok. Ha a két függvény többször metszi egymást, minden szakaszon külön kell eldönteni, melyik a felső.`,
      R`Az $x^n$ integrálásánál a kitevőt eggyel növeljük, és az **új** kitevővel osztunk: $\int x^3\,dx = \dfrac{x^4}{4}$, nem $x^4$ és nem $3x^2$. Mindig ellenőrizd deriválással.`,
      R`A szinusz integrálja $-\cos x$ (nem $\cos x$): a mínusz előjel gyakran kimarad. Ellenőrzés: $(-\cos x)' = \sin x$.`,
      R`Határozatlan integrálnál a $+C$ kimarad; határozott integrálnál viszont a $C$ kiesik, ott nem kell kiírni. A szorzat integrálja nem az integrálok szorzata.`,
      R`A $\int f(ax + b)\,dx$ esetén nem elég a külső függvény primitív függvényét venni: osztani kell $a$-val (az $\int \sin 2x\,dx = -\dfrac{1}{2}\cos 2x$).`
    ],
    exam: R`A követelmény (3.4.3) csak az emelt szinten szerepel. Ismerned kell folytonos függvényekre a határozott integrál szemléletes fogalmát és tulajdonságait, a kétoldali közelítés módszerét, az integrálfüggvény és a primitív függvény fogalmát, valamint a Newton–Leibniz-tételt. Számolni polinomfüggvények, illetve a szinusz- és koszinuszfüggvény grafikonja alatti területet kell tudnod; a gyakorlatban ez két görbe közti terület, előjelváltásos terület és paraméteres feladat lehet. A forgástest térfogata nem szerepel a követelményben.`,
    cheat: [
      R`\int x^n\,dx = \dfrac{x^{n+1}}{n+1} + C \quad (n \geq 0)`,
      R`\int \sin x\,dx = -\cos x + C, \qquad \int \cos x\,dx = \sin x + C`,
      R`\int_a^b f(x)\,dx = \big[F(x)\big]_a^b = F(b) - F(a)`,
      R`\int_a^b f = \int_a^c f + \int_c^b f, \qquad \int_b^a f = -\int_a^b f`,
      R`T = \int_a^b \big(f(x) - g(x)\big)\,dx \quad (f \geq g)`,
      R`F(x) = \int_a^x f(t)\,dt \;\Rightarrow\; F'(x) = f(x)`,
      R`\int_p^q k(x-p)(x-q)\,dx = -\dfrac{k(q-p)^3}{6}`
    ],
    cheatChecks: [['(q^3-p^3)/3-(p+q)*(q^2-p^2)/2+p*q*(q-p)', '-(q-p)^3/6'], ['(n-1)*(2n-1)/(6n^2)', '(2n^2-3n+1)/(6n^2)'], ['-cos(pi)-(-cos(0))', '2'], ['(x^3-2x^2+x)', 'x*(x-1)^2']],
    terms: ['határozott integrál', 'primitív függvény', 'határozatlan integrál', 'integrálfüggvény', 'Newton–Leibniz-tétel', 'kétoldali közelítés', 'alsó közelítő összeg', 'felső közelítő összeg', 'előjeles terület', 'területszámítás']
  };

  /* primitív függvény és derivált polinomja: g[k-1] az x^k együtthatója */
  function buildPoly(r, n) {
    var g = [], k, fcs = [], F = [];
    for (k = n + 1; k >= 1; k--) g[k] = (k === n + 1) ? r.nz(-5, 5) : r.int(-6, 6);
    for (k = n + 1; k >= 1; k--) { F.push(g[k]); fcs.push(g[k] * k); }
    F.push(0);
    return { g: g, F: F, f: fcs };
  }

  def('f2-int-1', 'fuggvenyek', 'integral', 1, 'Polinom primitív függvénye', function (r) {
    var n = r.int(2, 3), b = buildPoly(r, n), e = K.poly(b.F), tms = [], k;
    for (k = n + 1; k >= 1; k--) tms.push(`(${b.g[k]})*x^${k}`);
    return {
      q: R`Add meg az $f(x) = ${px(b.f)}$ függvény azt a primitív függvényét, amelyre $F(0) = 0$. (Zárójel nélküli, rendezett alakban.)`,
      answer: { type: 'expr', expr: e, noParen: true }, ansTex: K.tex(e),
      verify: tms.join('+'),
      tip1: R`Tagonként integrálj: $\int a x^k\,dx = a\,\dfrac{x^{k+1}}{k+1}$. A feltétel miatt a konstans tag $0$.`,
      tip2: R`A legmagasabb fokú tag $${K.par(b.f[0])} x^{${n}}$, primitív függvénye $${K.par(b.F[0])} x^{${n + 1}}$.`,
      sol: [R`Tagonként integrálunk: $F(x) = ${K.tex(e)} + C$.`, R`$F(0) = C = 0$, tehát $C = 0$. Ellenőrzés deriválással: $F'(x) = ${px(b.f)}$.`]
    };
  });

  def('f2-int-2', 'fuggvenyek', 'integral', 1, 'Határozott integrál polinomból', function (r) {
    var n = r.int(2, 3), b = buildPoly(r, n), p = r.int(-3, 1), q = p + r.int(1, 4), k, v = 0, tms = [];
    for (k = 1; k <= n + 1; k++) { v += b.g[k] * (Math.pow(q, k) - Math.pow(p, k)); tms.push(`(${b.g[k]})*((${q})^${k}-(${p})^${k})`); }
    var Fq = 0, Fp = 0;
    for (k = 1; k <= n + 1; k++) { Fq += b.g[k] * Math.pow(q, k); Fp += b.g[k] * Math.pow(p, k); }
    return {
      q: R`Számítsd ki: $\displaystyle\int_{${p}}^{${q}} \left(${px(b.f)}\right)dx$.`,
      answer: { type: 'num', value: v }, ansTex: K.T(v),
      verify: tms.join('+'),
      tip1: R`Keress primitív függvényt tagonként, majd használd a Newton–Leibniz-képletet: $F(b) - F(a)$.`,
      tip2: R`Egy primitív függvény: $F(x) = ${K.tex(K.poly(b.F))}$. Helyettesíts a felső, majd az alsó határon.`,
      sol: [R`Egy primitív függvény: $F(x) = ${K.tex(K.poly(b.F))}$ (deriválással ellenőrizhető).`, R`$F(${q}) = ${K.T(Fq)}$, $F(${p}) = ${K.T(Fp)}$.`, R`$\int_{${p}}^{${q}} f(x)\,dx = F(${q}) - F(${p}) = ${K.T(Fq)} - ${K.par(Fp)} = ${K.T(v)}$.`]
    };
  });

  function pickParabola(r) {
    var p, d, k;
    do { p = r.int(-4, 2); d = r.int(2, 6); k = r.nz(-3, 3); } while ((Math.abs(k) * d * d * d) % 6 !== 0);
    return { p: p, q: p + d, d: d, k: k, area: Math.abs(k) * d * d * d / 6 };
  }

  def('f2-int-3', 'fuggvenyek', 'integral', 2, 'Parabola és az x-tengely közti terület', function (r) {
    var z = pickParabola(r), p = z.p, q = z.q, k = z.k, cs = [k, -k * (p + q), k * p * q], signed = -k * z.d * z.d * z.d / 6;
    return {
      q: R`Mekkora területet zár közre az $f(x) = ${px(cs)}$ függvény grafikonja és az $x$-tengely?`,
      answer: { type: 'num', value: z.area }, ansTex: K.T(z.area),
      verify: `|(${k})*((${q})^3-(${p})^3)/3-(${k})*(${p + q})*((${q})^2-(${p})^2)/2+(${k})*(${p * q})*(${q - p})|`,
      tip1: R`Előbb a zérushelyeket keresd meg: ezek lesznek az integrálás határai. A terület nem lehet negatív.`,
      tip2: R`$f(x) = ${K.par(k)}(${xm(p)})(${xm(q)})$. Integrálj a(z) $${p}$ és a(z) $${q}$ között.`,
      sol: [R`$f(x) = 0$: $${px(cs)} = ${K.par(k)}(${xm(p)})(${xm(q)})$, a zérushelyek $x = ${p}$ és $x = ${q}$.`, R`A zérushelyek között a függvény egyik előjelű (${k > 0 ? 'negatív' : 'pozitív'}), ezért a terület az integrál abszolút értéke. Primitív függvény: $F(x) = ${Ftex(cs)}$.`, R`$\int_{${p}}^{${q}} f(x)\,dx = F(${q}) - F(${p}) = ${K.T(signed)}$.`, R`A terület: $T = |${K.T(signed)}| = ${K.T(z.area)}$.`]
    };
  });

  def('f2-int-4', 'fuggvenyek', 'integral', 2, 'Szinusz és koszinusz integrálja', function (r) {
    var a = r.nz(-5, 5), b = r.nz(-5, 5), iv = r.pick([['0', '0', 'pi', R`\pi`], ['0', '0', 'pi/2', R`\dfrac{\pi}{2}`], ['pi/2', R`\dfrac{\pi}{2}`, 'pi', R`\pi`]]);
    var Lc = iv[0], Lt = iv[1], Uc = iv[2], Ut = iv[3];
    var cosv = function (s) { return s === '0' ? 1 : s === 'pi' ? -1 : 0; }, sinv = function (s) { return s === '0' ? 0 : s === 'pi' ? 0 : 1; };
    var v = (-a * cosv(Uc) + b * sinv(Uc)) - (-a * cosv(Lc) + b * sinv(Lc));
    var f = `${a === 1 ? '' : a === -1 ? '-' : a}\\sin x ${b < 0 ? '-' : '+'} ${Math.abs(b) === 1 ? '' : Math.abs(b)}\\cos x`;
    return {
      q: R`Számítsd ki: $\displaystyle\int_{${Lt}}^{${Ut}} \left(${f}\right)dx$.`,
      answer: { type: 'num', value: v }, ansTex: K.T(v),
      verify: `(-(${a})*cos(${Uc})+(${b})*sin(${Uc}))-(-(${a})*cos(${Lc})+(${b})*sin(${Lc}))`,
      tip1: R`$\int \sin x\,dx = -\cos x$ és $\int \cos x\,dx = \sin x$. Figyelj az előjelekre!`,
      tip2: R`Egy primitív függvény: $F(x) = ${K.par(-a)}\cos x + ${K.par(b)}\sin x$.`,
      sol: [R`Primitív függvény: $F(x) = ${K.par(-a)}\cos x + ${K.par(b)}\sin x$ (deriválással: $F'(x) = ${K.par(a)}\sin x + ${K.par(b)}\cos x$).`, R`$F\left(${Ut}\right) = ${K.T(-a * cosv(Uc) + b * sinv(Uc))}$, $F\left(${Lt}\right) = ${K.T(-a * cosv(Lc) + b * sinv(Lc))}$.`, R`Az integrál: $F\left(${Ut}\right) - F\left(${Lt}\right) = ${K.T(v)}$.`]
    };
  });

  def('f2-int-5', 'fuggvenyek', 'integral', 3, 'Összetett területfeladat', function (r) {
    if (r() < 0.65) {
      var z = pickParabola(r), p = z.p, q = z.q, k = z.k, u = r.int(-4, 4), v = r.int(-5, 5), w, zz;
      do { w = u + k * (p + q); zz = v - k * p * q; if (w === 0 && zz === 0) v += 1; } while (w === 0 && zz === 0);
      var par2 = [k, u, v], line = [w, zz], diff = [k, -k * (p + q), k * p * q];
      return {
        q: R`Mekkora területet zár közre az $y = ${px(par2)}$ parabola és az $y = ${px(line)}$ egyenes?`,
        answer: { type: 'num', value: z.area }, ansTex: K.T(z.area),
        verify: `|(${k})*((${q})^3-(${p})^3)/3-(${k})*(${p + q})*((${q})^2-(${p})^2)/2+(${k})*(${p * q})*(${q - p})|`,
        tip1: R`Keresd meg a metszéspontokat: oldd meg a $${px(par2)} = ${px(line)}$ egyenletet. Ezek az integrálás határai.`,
        tip2: R`A különbség: $${px(par2)} - (${px(line)}) = ${px(diff)} = ${K.par(k)}(${xm(p)})(${xm(q)})$.`,
        sol: [R`Metszéspontok: $${px(par2)} = ${px(line)}$, azaz $${px(diff)} = 0$, ebből $x = ${p}$ és $x = ${q}$.`, R`A két függvény különbsége $d(x) = ${px(diff)}$, ennek primitív függvénye $D(x) = ${Ftex(diff)}$.`, R`$\int_{${p}}^{${q}} d(x)\,dx = D(${q}) - D(${p}) = ${K.T(-k * z.d * z.d * z.d / 6)}$.`, R`A terület az integrál abszolút értéke: $T = ${K.T(z.area)}$.`]
      };
    }
    var a = r.int(2, 9), T = K.q(a * a * a, 6);
    return {
      q: R`Az $f_a(x) = ax - x^2$ ($a > 0$ paraméter) függvény grafikonja és az $x$-tengely által közbezárt síkidom területe $${T}$ területegység. Mekkora az $a$ értéke?`,
      answer: { type: 'num', value: a }, ansTex: K.T(a),
      verify: `gyok(3;6*(${a * a * a}/6))`,
      tip1: R`Az $f_a$ grafikonja az $x$-tengelyt két helyen metszi: ott, ahol $x = 0$, és ott, ahol $x = a$. Számítsd ki az integrált $a$-val kifejezve.`,
      tip2: R`$\int_0^a (ax - x^2)\,dx = \left[\dfrac{ax^2}{2} - \dfrac{x^3}{3}\right]_0^a$. Az eredmény $a$ harmadik hatványa lesz.`,
      sol: [R`$ax - x^2 = x(a - x)$, zérushelyei $0$ és $a$; közöttük $f_a > 0$.`, R`$T(a) = \int_0^a (ax - x^2)\,dx = \dfrac{a^3}{2} - \dfrac{a^3}{3} = \dfrac{a^3}{6}$.`, R`$\dfrac{a^3}{6} = ${T}$, ebből $a^3 = ${a * a * a}$, tehát $a = ${a}$ (és $a > 0$ teljesül).`]
    };
  });
})(typeof window !== 'undefined' ? window : globalThis);
