(function (root) {
  'use strict';
  var MO = root.MO = root.MO || {}; var R = String.raw; var B = MO.bank = MO.bank || {};
  function add(o) { B[o.id] = o; }

  /* ================= IGAZ-HAMIS ================= */

  add({ id: 'b-fv-tf-1', type: 'tf', topic: 'fuggvenyek', sub: 'fuggveny', level: 1, title: 'Értékkészlet és képhalmaz',
    stmt: R`Egy $f: A \to B$ függvény értékkészlete mindig megegyezik a $B$ képhalmazzal.`, truth: false,
    why: R`Nem igaz. Az $f: \mathbb{R} \to \mathbb{R}$, $f(x) = x^2$ függvény képhalmaza $\mathbb{R}$, de az értékkészlete csak $[0;\infty[$, mert egy négyzet sosem negatív. Az értékkészlet a képhalmaznak csak részhalmaza.` });

  add({ id: 'b-fv-tf-2', type: 'tf', topic: 'fuggvenyek', sub: 'fuggveny', level: 2, title: 'A négyzetfüggvény leszűkítésének inverze',
    stmt: R`Az $f: [0;\infty[ \to [0;\infty[$, $f(x) = x^2$ függvénynek van inverze, és az inverz a $g(x) = \sqrt{x}$ függvény.`, truth: true,
    why: R`Ha $x_1, x_2 \ge 0$ és $x_1^2 = x_2^2$, akkor $(x_1 - x_2)(x_1 + x_2) = 0$. Az összeg csak úgy lehet nulla, ha mindkét szám nulla, ezért mindenképp $x_1 = x_2$: az $f$ kölcsönösen egyértelmű (minden $y \ge 0$ előáll $y = (\sqrt{y})^2$ alakban). Az $y = x^2$ egyenletből $x \ge 0$ mellett $x = \sqrt{y}$, azaz az inverz $\sqrt{x}$.` });

  add({ id: 'b-fv-tf-3', type: 'tf', topic: 'fuggvenyek', sub: 'fuggveny', level: 2, title: 'Az összetétel sorrendje',
    stmt: R`Az $f(x) = x + 1$ és a $g(x) = x^2$ függvényre minden valós $x$-re igaz, hogy $f(g(x)) = g(f(x))$.`, truth: false,
    why: R`Az összetett függvény képzésénél a sorrend számít. Például $x = 2$-re $f(g(2)) = f(4) = 5$, de $g(f(2)) = g(3) = 9$. Általában $f(g(x)) = x^2 + 1$, míg $g(f(x)) = x^2 + 2x + 1$, és ezek csak $x = 0$-ra egyenlők.`,
    check: ['2^2+1', '(2+1)^2'] });

  add({ id: 'b-fv-tf-4', type: 'tf', topic: 'fuggvenyek', sub: 'valosfv', level: 1, title: 'Páros függvény felismerése',
    stmt: R`Az $f: \mathbb{R} \to \mathbb{R}$, $f(x) = x^4 + x^2$ függvény páros.`, truth: true,
    why: R`Minden valós $x$-re $f(-x) = (-x)^4 + (-x)^2 = x^4 + x^2 = f(x)$, ezért $f$ páros, a grafikonja az $y$ tengelyre szimmetrikus.`,
    check: ['(-2)^4+(-2)^2', '2^4+2^2'] });

  add({ id: 'b-fv-tf-5', type: 'tf', topic: 'fuggvenyek', sub: 'valosfv', level: 1, title: 'Páros vagy páratlan',
    stmt: R`Minden $\mathbb{R} \to \mathbb{R}$ függvény vagy páros, vagy páratlan.`, truth: false,
    why: R`Az $f(x) = x + 1$ függvény ellenpélda. $f(1) = 2$ és $f(-1) = 0$, ezért nem páros ($f(-1) \ne f(1)$), és nem páratlan sem ($f(-1) = 0 \ne -2 = -f(1)$).` });

  add({ id: 'b-fv-tf-6', type: 'tf', topic: 'fuggvenyek', sub: 'valosfv', level: 2, title: 'A sin 3x periódusa',
    stmt: R`Az $f(x) = \sin 3x$ függvény legkisebb pozitív periódusa $\dfrac{2\pi}{3}$.`, truth: true,
    why: R`$f(x + p) = \sin(3x + 3p)$, és ez pontosan akkor egyezik meg minden $x$-re $\sin 3x$-szel, ha $3p$ a szinuszfüggvény $2\pi$ periódusának egész számú többszöröse. A legkisebb pozitív eset $3p = 2\pi$, azaz $p = \dfrac{2\pi}{3}$.` });

  add({ id: 'b-fv-tf-7', type: 'tf', topic: 'fuggvenyek', sub: 'valosfv', level: 2, title: 'Monoton függvények különbsége',
    stmt: R`Ha az $f$ és a $g$ függvény is szigorúan monoton növekedő a valós számok halmazán, akkor az $f - g$ függvény is szigorúan monoton növekedő.`, truth: false,
    why: R`Ellenpélda: $f(x) = x$ és $g(x) = 2x$ is szigorúan monoton nő, de $(f - g)(x) = -x$ szigorúan monoton csökken. Összegre igaz lenne az állítás, különbségre nem.` });

  add({ id: 'b-fv-tf-8', type: 'tf', topic: 'fuggvenyek', sub: 'sorozatok', level: 1, title: 'Korlátos sorozat konvergens?',
    stmt: R`Minden korlátos számsorozat konvergens.`, truth: false,
    why: R`Az $a_n = (-1)^n$ sorozat korlátos ($|a_n| = 1$), de a tagjai felváltva $-1$ és $1$, ezért nincs határértéke. A korlátosság szükséges, de nem elégséges feltétel a konvergenciához.` });

  add({ id: 'b-fv-tf-9', type: 'tf', topic: 'fuggvenyek', sub: 'sorozatok', level: 2, title: 'Konvergens sorozat korlátos',
    stmt: R`Minden konvergens számsorozat korlátos.`, truth: true,
    why: R`Legyen $a_n \to A$. Az $\varepsilon = 1$ választással van olyan $N$ küszöbindex, hogy $n > N$ esetén $|a_n - A| < 1$, tehát $|a_n| < |A| + 1$. A véges sok kezdő tag mellett a $\max\{|a_1|, \dots, |a_N|, |A| + 1\}$ szám az egész sorozat korlátja.` });

  add({ id: 'b-fv-tf-10', type: 'tf', topic: 'fuggvenyek', sub: 'sorozatok', level: 2, title: 'Végtelen mértani sor összege',
    stmt: R`Az $a_1 = 3$ első tagú, $q = -\dfrac{1}{2}$ hányadosú végtelen mértani sor konvergens, és az összege $2$.`, truth: true,
    why: R`Mivel $|q| = \dfrac{1}{2} < 1$, a sor konvergens, és $S = \dfrac{a_1}{1 - q} = \dfrac{3}{1 + \frac{1}{2}} = \dfrac{3}{\frac{3}{2}} = 2$.`,
    check: ['3/(1-(-1/2))', '2'] });

  add({ id: 'b-fv-tf-11', type: 'tf', topic: 'fuggvenyek', sub: 'sorozatok', level: 3, title: 'Konvergens sorozatok összege',
    stmt: R`Ha az $(a_n)$ és a $(b_n)$ sorozat is konvergens, akkor az $(a_n + b_n)$ sorozat is konvergens, és $\lim (a_n + b_n) = \lim a_n + \lim b_n$.`, truth: true,
    why: R`Ez a konvergens sorozatok összegére vonatkozó tétel. Vázlat: ha $a_n \to A$ és $b_n \to B$, akkor adott $\varepsilon > 0$-hoz van olyan küszöb, amelytől mindkét sorozatra $|a_n - A| < \dfrac{\varepsilon}{2}$ és $|b_n - B| < \dfrac{\varepsilon}{2}$. Ekkor $|(a_n + b_n) - (A + B)| \le |a_n - A| + |b_n - B| < \varepsilon$.` });

  add({ id: 'b-fv-tf-12', type: 'tf', topic: 'fuggvenyek', sub: 'sorozatok', level: 3, title: 'Konvergens összeg, divergens tagok',
    stmt: R`Ha az $(a_n + b_n)$ sorozat konvergens, akkor az $(a_n)$ és a $(b_n)$ sorozat is konvergens.`, truth: false,
    why: R`Ellenpélda: $a_n = n$ és $b_n = -n$. Az összegük a konstans $0$ sorozat, ami konvergens, de az $(a_n)$ sem és a $(b_n)$ sem korlátos, ezért egyik sem konvergens.` });

  add({ id: 'b-fv-tf-13', type: 'tf', topic: 'fuggvenyek', sub: 'hatarertek', level: 2, title: 'Határérték és értelmezettség',
    stmt: R`Ha az $f$ függvény az $x_0$ helyen nincs értelmezve, akkor az $x_0$ helyen nem létezik a határértéke.`, truth: false,
    why: R`A határérték az $x_0$ környezetében (az $x_0$-tól különböző pontokban) felvett értékektől függ. Az $f(x) = \dfrac{x^2 - 1}{x - 1}$ az $1$ helyen nincs értelmezve, de $x \ne 1$ esetén $f(x) = x + 1$, ezért $\lim_{x \to 1} f(x) = 2$.` });

  add({ id: 'b-fv-tf-14', type: 'tf', topic: 'fuggvenyek', sub: 'hatarertek', level: 2, title: 'Határérték a végtelenben',
    stmt: R`$\displaystyle \lim_{x \to \infty} \dfrac{3x^2 + 1}{x^2 - 5} = 3$.`, truth: true,
    why: R`A számlálót és a nevezőt is osztva $x^2$-tel: $\dfrac{3 + \frac{1}{x^2}}{1 - \frac{5}{x^2}}$. Ha $x \to \infty$, akkor $\dfrac{1}{x^2} \to 0$ és $\dfrac{5}{x^2} \to 0$, így a hányados határértéke $\dfrac{3}{1} = 3$.` });

  add({ id: 'b-fv-tf-15', type: 'tf', topic: 'fuggvenyek', sub: 'hatarertek', level: 2, title: 'Az 1/x határértéke a nullában',
    stmt: R`Az $f(x) = \dfrac{1}{x}$ függvény határértéke a $0$ helyen $+\infty$.`, truth: false,
    why: R`Jobbról közeledve ($x > 0$, $x \to 0$) az értékek $+\infty$-hez tartanak, de balról közeledve ($x < 0$) $-\infty$-hez. A két oldali határérték különbözik, ezért a $0$ helyen nincs határérték (sem véges, sem végtelen).` });

  add({ id: 'b-fv-tf-16', type: 'tf', topic: 'fuggvenyek', sub: 'hatarertek', level: 3, title: 'Szakadás egy darabolt függvénynél',
    stmt: R`Legyen $f(x) = x$, ha $x < 1$, és $f(x) = x + 1$, ha $x \ge 1$. Ez a függvény az $1$ helyen nem folytonos.`, truth: true,
    why: R`Balról $\lim_{x \to 1^-} f(x) = 1$, és $f(1) = 2$. A folytonossághoz az kellene, hogy a határérték megegyezzen a helyettesítési értékkel, de $1 \ne 2$, tehát az $1$ helyen ugrás van.` });

  add({ id: 'b-fv-tf-17', type: 'tf', topic: 'fuggvenyek', sub: 'derivalas', level: 2, title: 'A derivált nulla, tehát szélsőérték?',
    stmt: R`Ha az $f$ differenciálható függvényre $f'(x_0) = 0$, akkor $f$-nek az $x_0$ helyen szélsőértéke van.`, truth: false,
    why: R`Az $f(x) = x^3$ függvényre $f'(x) = 3x^2$, így $f'(0) = 0$, de $f$ szigorúan monoton nő, ezért a $0$ helyen nincs szélsőértéke. Az $f'(x_0) = 0$ feltétel szükséges, de nem elégséges feltétel: a deriváltnak előjelet is kell váltania.` });

  add({ id: 'b-fv-tf-18', type: 'tf', topic: 'fuggvenyek', sub: 'derivalas', level: 2, title: 'Az abszolútérték deriválhatósága',
    stmt: R`Az $f(x) = |x|$ függvény folytonos a $0$ helyen, de ott nem differenciálható.`, truth: true,
    why: R`Folytonos, mert $\lim_{x \to 0} |x| = 0 = f(0)$. A differenciahányados: $\dfrac{|h| - 0}{h}$, ami $h > 0$ esetén $1$, $h < 0$ esetén $-1$. A két oldali határérték különbözik, ezért a határérték, vagyis a derivált, nem létezik.` });

  add({ id: 'b-fv-tf-19', type: 'tf', topic: 'fuggvenyek', sub: 'derivalas', level: 2, title: 'A szorzat deriváltja',
    stmt: R`Differenciálható függvények szorzatának deriváltja a deriváltak szorzata: $(f \cdot g)' = f' \cdot g'$.`, truth: false,
    why: R`Ellenpélda: $f(x) = g(x) = x$. Ekkor $(f \cdot g)(x) = x^2$, aminek a deriváltja $2x$, de $f'(x) \cdot g'(x) = 1 \cdot 1 = 1$. A helyes szabály: $(f \cdot g)' = f' \cdot g + f \cdot g'$.` });

  add({ id: 'b-fv-tf-20', type: 'tf', topic: 'fuggvenyek', sub: 'derivalas', level: 3, title: 'Monotonitás és első derivált',
    stmt: R`Ha egy polinomfüggvény deriváltja az $]a;b[$ intervallum minden pontjában pozitív, akkor a függvény ezen az intervallumon szigorúan monoton növekedő.`, truth: true,
    why: R`Legyen $a < x_1 < x_2 < b$. A Lagrange-középértéktétel szerint van olyan $\xi \in\, ]x_1; x_2[$, hogy $f(x_2) - f(x_1) = f'(\xi)(x_2 - x_1)$. Itt $f'(\xi) > 0$ és $x_2 - x_1 > 0$, ezért $f(x_2) > f(x_1)$.` });

  add({ id: 'b-fv-tf-21', type: 'tf', topic: 'fuggvenyek', sub: 'integral', level: 2, title: 'Határozott integrál és terület',
    stmt: R`A $\sin x$ grafikonja és az $x$ tengely által a $[0;2\pi]$ intervallumon közrezárt terület megegyezik az $\displaystyle \int_0^{2\pi} \sin x \, dx$ határozott integrállal.`, truth: false,
    why: R`Az integrál előjeles: $\displaystyle \int_0^{2\pi} \sin x \, dx = \bigl[-\cos x\bigr]_0^{2\pi} = -1 + 1 = 0$, mert a tengely alatti rész negatívan számít. A terület ennél nagyobb: $\displaystyle \int_0^{\pi} \sin x \, dx + \left|\int_{\pi}^{2\pi} \sin x \, dx\right| = 2 + 2 = 4$.` });

  add({ id: 'b-fv-tf-22', type: 'tf', topic: 'fuggvenyek', sub: 'integral', level: 3, title: 'Newton–Leibniz és a primitív függvény választása',
    stmt: R`Ha az $f$ folytonos függvénynek $F$ egy primitív függvénye az $[a;b]$ intervallumon, akkor $\displaystyle \int_a^b f(x) \, dx = F(b) - F(a)$, és az érték nem függ attól, hogy melyik primitív függvényt választjuk.`, truth: true,
    why: R`Ez a Newton–Leibniz-tétel. Két primitív függvény csak konstansban különbözik: ha $G = F + c$, akkor $G(b) - G(a) = F(b) + c - F(a) - c = F(b) - F(a)$, tehát a konstans kiesik.` });

  /* ================= HIBAVADASZ ================= */

  add({ id: 'b-fv-spot-1', type: 'spot', topic: 'fuggvenyek', sub: 'valosfv', level: 2, title: 'Eltolás iránya',
    problem: R`Hogyan kapjuk meg a $g(x) = (x - 3)^2 + 1$ függvény grafikonját az $f(x) = x^2$ grafikonjából? Add meg a csúcs koordinátáit.`,
    lines: [R`A $g(x) = (x - 3)^2 + 1$ az $f$ függvényből $f(x - 3) + 1$ alakban áll elő.`,
            R`Az $f(x - 3)$ a grafikont az $x$ tengely mentén tolja el, a $+1$ az $y$ tengely mentén.`,
            R`A kivonás miatt balra tolunk $3$ egységnyit, a $+1$ miatt felfelé $1$ egységnyit.`,
            R`Az $f$ csúcsa az origó volt, ezért a $g$ csúcsa a $(-3;\ 1)$ pont.`],
    wrong: 2,
    why: R`Az $f(x - c)$ ($c > 0$) a grafikont jobbra tolja $c$ egységnyit, mert az $f$ minimumát most az $x - 3 = 0$, azaz az $x = 3$ helyen veszi fel. A „mínusz” jel miatt nem balra, hanem jobbra kell tolni.`,
    fix: R`A grafikont jobbra tolunk $3$ egységnyit és felfelé $1$ egységnyit, így a csúcs a $(3;\ 1)$ pont.`,
    wrongCheck: ['(-3-3)^2+1', '1'], fixCheck: ['(3-3)^2+1', '1'] });

  add({ id: 'b-fv-spot-2', type: 'spot', topic: 'fuggvenyek', sub: 'fuggveny', level: 2, title: 'Értelmezési tartomány négyzetgyökkel',
    problem: R`Add meg az $f(x) = \sqrt{x^2 - 4}$ függvény legbővebb értelmezési tartományát a valós számok halmazán.`,
    lines: [R`A gyök alatt nemnegatív kifejezésnek kell állnia: $x^2 - 4 \ge 0$.`,
            R`Ez ekvivalens azzal, hogy $x^2 \ge 4$.`,
            R`Mindkét oldalból négyzetgyököt vonva $x \ge 2$ adódik.`,
            R`Az értelmezési tartomány tehát $[2;\infty[$.`],
    wrong: 2,
    why: R`A $\sqrt{x^2}$ nem $x$, hanem $|x|$. Például $x = -3$ esetén $\sqrt{(-3)^2} = 3 \ne -3$, és $x = -3$ jó érték: $(-3)^2 - 4 = 5 \ge 0$.`,
    fix: R`Helyesen $|x| \ge 2$, azaz $x \le -2$ vagy $x \ge 2$. Az értelmezési tartomány $]-\infty;\,-2] \cup [2;\,\infty[$.`,
    wrongCheck: ['sqrt((-3)^2)', '-3'], fixCheck: ['sqrt((-3)^2)', '|-3|'] });

  add({ id: 'b-fv-spot-3', type: 'spot', topic: 'fuggvenyek', sub: 'sorozatok', level: 1, title: 'Számtani sorozat általános tagja',
    problem: R`Egy számtani sorozat első tagja $5$, különbsége $3$. Mennyi a sorozat huszadik tagja?`,
    lines: [R`Adott: $a_1 = 5$ és $d = 3$.`,
            R`A számtani sorozat általános tagja: $a_n = a_1 + n \cdot d$.`,
            R`Ebből $a_{20} = 5 + 20 \cdot 3 = 65$.`,
            R`A sorozat huszadik tagja $65$.`],
    wrong: 1,
    why: R`A képlet hibás: az $a_1$-hez csak $(n - 1)$-szer adjuk hozzá a különbséget. A rossz képlet az $n = 1$ esetben sem működik: $a_1 + 1 \cdot d \ne a_1$.`,
    fix: R`Helyesen $a_n = a_1 + (n - 1) d$, így $a_{20} = 5 + 19 \cdot 3 = 62$.`,
    wrongCheck: ['5+1*3', '5'], fixCheck: ['5+(20-1)*3', '62'] });

  add({ id: 'b-fv-spot-4', type: 'spot', topic: 'fuggvenyek', sub: 'sorozatok', level: 2, title: 'Divergens mértani sor',
    problem: R`Számítsd ki a $4 + 8 + 16 + \dots$ végtelen mértani sor összegét.`,
    lines: [R`Az első tag $a_1 = 4$, a hányados $q = \dfrac{8}{4} = 2$.`,
            R`Mivel mértani sorról van szó, az összegét az $S = \dfrac{a_1}{1 - q}$ képlettel számolhatjuk.`,
            R`$S = \dfrac{4}{1 - 2} = -4$.`,
            R`A sor összege $-4$.`],
    wrong: 1,
    why: R`Az $S = \dfrac{a_1}{1 - q}$ képlet csak $|q| < 1$ esetén használható. Itt $q = 2$, a tagok növekednek, a részletösszegek (például $4 + 8 + 16 = 28$) minden határon túl nőnek, ezért a sor divergens. Pozitív tagú sor összege amúgy sem lehet negatív.`,
    fix: R`Mivel $|q| = 2 > 1$, a sor divergens, ezért nincs (véges) összege.`,
    wrongCheck: ['4+8+16', '-4'], fixCheck: ['8/4', '2'] });

  add({ id: 'b-fv-spot-5', type: 'spot', topic: 'fuggvenyek', sub: 'derivalas', level: 2, title: 'Szorzatfüggvény deriválása',
    problem: R`Deriváld az $f(x) = (x^2 + 1)(x^3 - 2x)$ függvényt.`,
    lines: [R`A függvény két tényező szorzata: $u(x) = x^2 + 1$ és $v(x) = x^3 - 2x$.`,
            R`A tényezők deriváltjai: $u'(x) = 2x$ és $v'(x) = 3x^2 - 2$.`,
            R`Ezért $f'(x) = u'(x) \cdot v'(x) = 2x(3x^2 - 2)$.`,
            R`Kifejtve: $f'(x) = 6x^3 - 4x$.`],
    wrong: 2,
    why: R`A szorzat deriváltja nem a tényezők deriváltjainak szorzata. Ellenőrzés az $x = 1$ helyen: a rossz képlet $2$-t ad, a helyes derivált viszont $2 \cdot (-1) + 2 \cdot 1 = 0$.`,
    fix: R`$f'(x) = u'v + uv' = 2x(x^3 - 2x) + (x^2 + 1)(3x^2 - 2) = 5x^4 - 3x^2 - 2$.`,
    wrongCheck: ['2*1*(3*1^2-2)', '2*1*(1^3-2*1)+(1^2+1)*(3*1^2-2)'], fixCheck: ['2*2*(2^3-2*2)+(2^2+1)*(3*2^2-2)', '5*2^4-3*2^2-2'] });

  add({ id: 'b-fv-spot-6', type: 'spot', topic: 'fuggvenyek', sub: 'derivalas', level: 2, title: 'Belső derivált kihagyása',
    problem: R`Deriváld az $f(x) = \sin 3x$ függvényt, és add meg az $f'(0)$ értéket.`,
    lines: [R`Az $f$ összetett függvény: a külső függvény $\sin u$, a belső $u = 3x$.`,
            R`A külső függvény deriváltja $\cos u$, a belső függvényé $u' = 3$.`,
            R`Ezért $f'(x) = \cos 3x$.`,
            R`Behelyettesítve $f'(0) = \cos 0 = 1$.`],
    wrong: 2,
    why: R`Az összetett függvény deriválási szabálya szerint a külső függvény deriváltját meg kell szorozni a belső függvény deriváltjával: $f'(x) = \cos 3x \cdot 3$. A belső deriváltat kihagyva a rossz képlet $1$-et ad, miközben a helyes érték $3$.`,
    fix: R`$f'(x) = 3 \cos 3x$, ezért $f'(0) = 3 \cos 0 = 3$.`,
    wrongCheck: ['cos(3*0)', '3*cos(3*0)'], fixCheck: ['3*cos(3*0)', '3'] });

  add({ id: 'b-fv-spot-7', type: 'spot', topic: 'fuggvenyek', sub: 'derivalas', level: 3, title: 'Szélsőérték igazolása nélkül',
    problem: R`Határozd meg az $f(x) = x^3 - 3x^2 + 3x$ polinomfüggvény lokális szélsőértékeit.`,
    lines: [R`A derivált: $f'(x) = 3x^2 - 6x + 3$.`,
            R`Ez $3(x - 1)^2$ alakba írható, ezért $f'(x) = 0$ csak az $x = 1$ helyen teljesül.`,
            R`Mivel $f'(1) = 0$, az $x = 1$ helyen lokális szélsőérték van.`,
            R`A szélsőérték értéke $f(1) = 1 - 3 + 3 = 1$.`],
    wrong: 2,
    why: R`Az $f'(x_0) = 0$ csak szükséges feltétel. A deriváltnak az $x_0$ helyen előjelet is kell váltania. Itt $f'(x) = 3(x - 1)^2 \ge 0$ mindenütt, így nincs előjelváltás. Például $f(0) = 0 < f(1) = 1 < f(2) = 2$, tehát az $1$ nem szélsőérték.`,
    fix: R`Mivel $f'$ nem vált előjelet, az $f$ az egész számegyenesen szigorúan monoton nő, és nincs lokális szélsőértéke. Az $x = 1$ csak egy vízszintes érintőjű (teraszpont) hely.`,
    wrongCheck: ['2^3-3*2^2+3*2', '1^3-3*1^2+3*1'], fixCheck: ['3*(1-1)^2', '0'] });

  add({ id: 'b-fv-spot-8', type: 'spot', topic: 'fuggvenyek', sub: 'integral', level: 3, title: 'Előjeles integrál mint terület',
    problem: R`Számítsd ki a $\sin x$ grafikonja és az $x$ tengely által a $[0;2\pi]$ intervallumon közrezárt terület nagyságát.`,
    lines: [R`A $\sin x$ egy primitív függvénye $-\cos x$.`,
            R`A terület $T = \displaystyle \int_0^{2\pi} \sin x \, dx = \bigl[-\cos x\bigr]_0^{2\pi}$.`,
            R`Ez $-\cos 2\pi + \cos 0 = -1 + 1 = 0$.`,
            R`A terület tehát $0$.`],
    wrong: 1,
    why: R`A határozott integrál előjeles: ahol a függvény negatív, ott az integrál is negatív hozzájárulást ad. A $[\pi; 2\pi]$ szakaszon $\sin x \le 0$, ezért a két félperiódus járuléka kiejti egymást. A terület nem egyenlő az integrállal.`,
    fix: R`A területet szakaszonként számoljuk: $T = \displaystyle \int_0^{\pi} \sin x \, dx + \left|\int_{\pi}^{2\pi} \sin x \, dx\right| = 2 + |-2| = 4$.`,
    wrongCheck: ['-cos(2*pi)+cos(0)', '4'], fixCheck: ['(-cos(pi)+cos(0))+|-cos(2*pi)+cos(pi)|', '4'] });

  /* ================= SORBA RENDEZES ================= */

  add({ id: 'b-fv-ord-1', type: 'order', topic: 'fuggvenyek', sub: 'sorozatok', level: 2, title: 'A számtani sorozat összegképlete',
    claim: R`Rendezd sorba a lépéseket: igazold, hogy a számtani sorozat első $n$ tagjának összege $S_n = \dfrac{n(a_1 + a_n)}{2}$.`,
    steps: [R`Felírjuk az összeget: $S_n = a_1 + a_2 + \dots + a_{n-1} + a_n$.`,
            R`Ugyanezt az összeget fordított sorrendben is felírjuk: $S_n = a_n + a_{n-1} + \dots + a_2 + a_1$.`,
            R`A két egyenletet tagonként összeadva: $2S_n = (a_1 + a_n) + (a_2 + a_{n-1}) + \dots + (a_n + a_1)$.`,
            R`Számtani sorozatban minden zárójel értéke ugyanaz: $a_k + a_{n+1-k} = a_1 + a_n$, mert az egyik tag annyival nő, amennyivel a másik csökken.`,
            R`A jobb oldalon $n$ darab $(a_1 + a_n)$ áll, tehát $2S_n = n(a_1 + a_n)$.`,
            R`Mindkét oldalt $2$-vel osztva: $S_n = \dfrac{n(a_1 + a_n)}{2}$.`],
    note: R`A bizonyítás a számtani sorozat szimmetriáján alapul: a „végekről” egyforma távolságra lévő tagok összege állandó.` });

  add({ id: 'b-fv-ord-2', type: 'order', topic: 'fuggvenyek', sub: 'sorozatok', level: 2, title: 'A mértani sorozat összegképlete',
    claim: R`Rendezd sorba a lépéseket: igazold, hogy $q \ne 1$ esetén a mértani sorozat első $n$ tagjának összege $S_n = a_1 \cdot \dfrac{1 - q^n}{1 - q}$.`,
    steps: [R`Felírjuk az összeget: $S_n = a_1 + a_1 q + a_1 q^2 + \dots + a_1 q^{n-1}$.`,
            R`Az egyenlet mindkét oldalát megszorozzuk $q$-val: $q S_n = a_1 q + a_1 q^2 + \dots + a_1 q^{n-1} + a_1 q^n$.`,
            R`Az első egyenletből kivonjuk a másodikat: a közös tagok kiesnek, így $S_n - q S_n = a_1 - a_1 q^n$.`,
            R`Mindkét oldalon kiemelünk: $S_n (1 - q) = a_1 (1 - q^n)$.`,
            R`Mivel $q \ne 1$, oszthatunk $1 - q$-val: $S_n = a_1 \cdot \dfrac{1 - q^n}{1 - q}$.`],
    note: R`A $q = 1$ eset külön van: ott minden tag $a_1$, így $S_n = n a_1$.` });

  add({ id: 'b-fv-ord-3', type: 'order', topic: 'fuggvenyek', sub: 'derivalas', level: 3, title: 'Az x^n deriváltjának levezetése',
    claim: R`Rendezd sorba a lépéseket: igazold, hogy $(x^n)' = n x^{n-1}$ minden $n \ge 1$ egész számra.`,
    steps: [R`A definíció szerint $(x^n)' = \displaystyle \lim_{h \to 0} \dfrac{(x + h)^n - x^n}{h}$.`,
            R`A binomiális tétellel $(x + h)^n = x^n + n x^{n-1} h + \dbinom{n}{2} x^{n-2} h^2 + \dots + h^n$.`,
            R`Kivonjuk $x^n$-t és osztunk $h$-val: a hányados $n x^{n-1} + \dbinom{n}{2} x^{n-2} h + \dots + h^{n-1}$.`,
            R`Ha $h \to 0$, akkor minden olyan tag nullához tart, amelyben $h$ szerepel.`,
            R`Csak az első tag marad, tehát $(x^n)' = n x^{n-1}$.`],
    note: R`Az $n = 1$ esetben a hányados végig $1$, ez is beleillik a képletbe.` });

  add({ id: 'b-fv-ord-4', type: 'order', topic: 'fuggvenyek', sub: 'derivalas', level: 3, title: 'A szorzat deriválási szabályának bizonyítása',
    claim: R`Rendezd sorba a lépéseket: igazold, hogy differenciálható $f$ és $g$ esetén $(f \cdot g)' = f' \cdot g + f \cdot g'$.`,
    steps: [R`Felírjuk a differenciahányadost: $\dfrac{f(x + h) g(x + h) - f(x) g(x)}{h}$.`,
            R`A számlálóhoz hozzáadjuk és ki is vonjuk az $f(x + h) g(x)$ szorzatot, így az érték nem változik.`,
            R`Átcsoportosítva és kiemelve: $f(x + h) \cdot \dfrac{g(x + h) - g(x)}{h} + g(x) \cdot \dfrac{f(x + h) - f(x)}{h}$.`,
            R`Ha $h \to 0$, a két törtből $g'(x)$ és $f'(x)$ lesz, és $f(x + h) \to f(x)$, mert a differenciálható függvény folytonos.`,
            R`Ezért a határérték $f(x) g'(x) + g(x) f'(x)$, vagyis $(f \cdot g)' = f' \cdot g + f \cdot g'$.`],
    note: R`A fortély az „ügyes nulla” beszúrása, ami szétválasztja a két tényező változását.` });

  add({ id: 'b-fv-ord-5', type: 'order', topic: 'fuggvenyek', sub: 'derivalas', level: 2, title: 'Szélsőérték-feladat megoldása',
    claim: R`Rendezd sorba egy szélsőérték-feladat megoldásának lépéseit (például: adott kerületű téglalapok közül melyiknek a legnagyobb a területe).`,
    steps: [R`Megállapítjuk, melyik mennyiség szélsőértékét keressük, és bevezetjük a változókat.`,
            R`A feltételből kifejezzük az egyik változót, így egyváltozós célfüggvényt kapunk, és megadjuk a változó megengedett értékeit.`,
            R`Meghatározzuk a célfüggvény deriváltját, és megoldjuk az $f'(x) = 0$ egyenletet.`,
            R`Előjelvizsgálattal igazoljuk, hogy a megengedett értékek között talált helyen valóban maximum (vagy minimum) van.`,
            R`Kiszámítjuk a kérdezett mennyiségeket, és szöveges választ adunk.`],
    note: R`Másodfokú célfüggvénynél a csúcs vizsgálata is elég, deriválás nélkül.` });

  add({ id: 'b-fv-ord-6', type: 'order', topic: 'fuggvenyek', sub: 'integral', level: 2, title: 'Terület két görbe között',
    claim: R`Rendezd sorba a lépéseket: számítsd ki az $f(x) = x^2$ és a $g(x) = x + 2$ grafikonja által közrezárt terület nagyságát.`,
    steps: [R`A metszéspontokat az $x^2 = x + 2$ egyenlet adja: $x^2 - x - 2 = 0$, ennek gyökei $x_1 = -1$ és $x_2 = 2$.`,
            R`Megállapítjuk, melyik grafikon van felül a $]-1; 2[$ intervallumon: $g(0) = 2 > 0 = f(0)$, tehát a $g$.`,
            R`A terület a különbségfüggvény integrálja: $T = \displaystyle \int_{-1}^{2} (x + 2 - x^2) \, dx$.`,
            R`Egy primitív függvény: $F(x) = \dfrac{x^2}{2} + 2x - \dfrac{x^3}{3}$.`,
            R`A Newton–Leibniz-tétellel $T = F(2) - F(-1) = \dfrac{10}{3} - \left(-\dfrac{7}{6}\right) = \dfrac{9}{2} = 4{,}5$.`],
    note: R`Mindig a felső függvényből vonjuk ki az alsót, így az integrandus nemnegatív.` });

  /* ================= VEZETETT MEGOLDAS ================= */

  add({ id: 'b-fv-gui-1', type: 'guided', topic: 'fuggvenyek', sub: 'valosfv', level: 2, title: 'Másodfokú függvény jellemzése',
    problem: R`Jellemezd az $f: \mathbb{R} \to \mathbb{R}$, $f(x) = -x^2 + 4x + 5$ függvényt.`,
    steps: [
      { q: R`Mik az $f$ zérushelyei?`, answer: { type: 'set', values: [-1, 5] }, ansTex: R`x_1 = -1,\ x_2 = 5`, verify: ['(4-sqrt(16+20))/2', '(4+sqrt(16+20))/2'],
        hint: R`Szorozd meg az egyenletet $-1$-gyel, így $x^2 - 4x - 5 = 0$ adódik.`, expl: R`$x^2 - 4x - 5 = 0$, a diszkrimináns $16 + 20 = 36$, ezért $x_{1,2} = \dfrac{4 \pm 6}{2}$.` },
      { q: R`Hol van a parabola csúcsának $x$ koordinátája?`, answer: { type: 'num', value: 2 }, ansTex: '2', verify: '-4/(2*(-1))',
        hint: R`A csúcs a két zérushely számtani közepénél van, vagy használd az $x = -\dfrac{b}{2a}$ képletet.`, expl: R`$x = -\dfrac{4}{2 \cdot (-1)} = 2$, ami a zérushelyek $\dfrac{-1 + 5}{2} = 2$ közepe is.` },
      { q: R`Mekkora a függvény legnagyobb értéke?`, answer: { type: 'num', value: 9 }, ansTex: '9', verify: '-(2^2)+4*2+5',
        hint: R`A főegyüttható negatív, ezért a csúcsban maximum van. Helyettesíts be a csúcs $x$ koordinátájába.`, expl: R`$f(2) = -4 + 8 + 5 = 9$.` },
      { q: R`Mi az $f$ értékkészlete?`, answer: { type: 'choice', options: [R`$]-\infty;\ 9]$`, R`$[9;\ \infty[$`, R`$]-\infty;\ 5]$`], correct: 0 },
        hint: R`A parabola lefelé nyílik, a legnagyobb érték a csúcsban van.`, expl: R`A függvény minden értéke legfeljebb $9$, és a $9$-nél kisebb értékeket is mind felveszi, ezért $\operatorname{Rf} = ]-\infty;\ 9]$.` },
      { q: R`Hány egész $x$ helyen pozitív a függvény értéke?`, answer: { type: 'num', value: 5 }, ansTex: '5', verify: '5-(-1)-1',
        hint: R`A függvény a két zérushely között pozitív (lefelé nyíló parabola).`, expl: R`$f(x) > 0$, ha $-1 < x < 5$. Az egész megoldások: $0$, $1$, $2$, $3$, $4$.` }],
    final: R`Zérushelyek: $-1$ és $5$. A csúcs $(2;\ 9)$, ez maximum. Az értékkészlet $]-\infty;\ 9]$, a függvény a $]-1;\ 5[$ intervallumon pozitív.` });

  add({ id: 'b-fv-gui-2', type: 'guided', topic: 'fuggvenyek', sub: 'sorozatok', level: 2, title: 'Kamatos kamat',
    problem: R`Egy bank évi $4\%$ kamatot fizet, a kamatot évente tőkésíti. Egy számlán $500\,000$ forintot helyezünk el, és a futamidő alatt semmit nem veszünk ki és nem teszünk be.`,
    steps: [
      { q: R`Mekkora az éves kamattényező?`, answer: { type: 'choice', options: [R`$1{,}04$`, R`$0{,}04$`, R`$4$`], correct: 0 },
        hint: R`A tőke minden évben $100\%$-ról $104\%$-ra nő.`, expl: R`A kamattényező $1 + \dfrac{4}{100} = 1{,}04$.` },
      { q: R`Hányszorosára nő a tőke $6$ év alatt? Három tizedesre kerekítve add meg.`, answer: { type: 'num', value: 1.265, tol: 0.0005 }, ansTex: R`1{,}265`, verify: '1,04^6',
        hint: R`Minden évben $1{,}04$-del szorzunk.`, expl: R`$1{,}04^6 \approx 1{,}2653$, ami három tizedesre kerekítve $1{,}265$.` },
      { q: R`Hány forint lesz a számlán $6$ év után? Ezer forintra kerekítve add meg.`, answer: { type: 'num', value: 633000, tol: 500 }, ansTex: R`633\,000`, verify: '500000*1,04^6',
        hint: R`Szorozd meg a kezdőtőkét a hatéves növekedési tényezővel.`, expl: R`$500\,000 \cdot 1{,}04^6 \approx 632\,660$, ami ezerre kerekítve $633\,000$ forint.` },
      { q: R`Oldd meg az $1{,}04^n = 1{,}4$ egyenletet $n$-re (a $700\,000$ forint eléréséhez). Két tizedesre kerekítve add meg.`, answer: { type: 'num', value: 8.58, tol: 0.005 }, ansTex: R`8{,}58`, verify: 'ln(1,4)/ln(1,04)',
        hint: R`Vedd mindkét oldal logaritmusát: $n \cdot \lg 1{,}04 = \lg 1{,}4$.`, expl: R`$n = \dfrac{\lg 1{,}4}{\lg 1{,}04} \approx 8{,}58$.` },
      { q: R`Hány teljes év elteltével haladja meg a számlán lévő összeg a $700\,000$ forintot?`, answer: { type: 'choice', options: [R`$8$ év`, R`$9$ év`, R`$10$ év`], correct: 1 },
        hint: R`A kamatot évente írják jóvá, ezért csak egész évek számítanak, és az előző lépésben kapott érték nem egész.`, expl: R`A $8$. év végén még kevesebb van ($1{,}04^8 \approx 1{,}369 < 1{,}4$), a $9$. év végén már több ($1{,}04^9 \approx 1{,}423 > 1{,}4$).` }],
    final: R`$6$ év alatt a tőke $1{,}265$-szeresére nő, a számlán kb. $633\,000$ forint lesz. A $700\,000$ forintot $9$ év múlva haladja meg.` });

  add({ id: 'b-fv-gui-3', type: 'guided', topic: 'fuggvenyek', sub: 'derivalas', level: 2, title: 'Polinom érintője',
    problem: R`Írd fel az $f(x) = x^3 - 3x + 1$ függvény grafikonjának $x_0 = 2$ abszcisszájú pontjához tartozó érintőjének egyenletét.`,
    steps: [
      { q: R`Add meg az $f'(x)$ deriváltfüggvényt.`, answer: { type: 'expr', expr: '3x^2-3' }, ansTex: R`3x^2 - 3`, verify: '3*x^2-3',
        hint: R`Használd az $(x^n)' = n x^{n-1}$ szabályt tagonként.`, expl: R`$(x^3)' = 3x^2$, $(-3x)' = -3$, a konstans deriváltja $0$.` },
      { q: R`Mekkora az $f(2)$ helyettesítési érték?`, answer: { type: 'num', value: 3 }, ansTex: '3', verify: '2^3-3*2+1',
        hint: R`Helyettesíts $x = 2$-t a függvénybe.`, expl: R`$f(2) = 8 - 6 + 1 = 3$, tehát az érintési pont $(2;\ 3)$.` },
      { q: R`Mekkora az érintő meredeksége, azaz $f'(2)$?`, answer: { type: 'num', value: 9 }, ansTex: '9', verify: '3*2^2-3',
        hint: R`Az érintő meredeksége az érintési pontban a derivált értéke.`, expl: R`$f'(2) = 3 \cdot 4 - 3 = 9$.` },
      { q: R`Add meg az érintő egyenletét $y = \dots$ alakban.`, answer: { type: 'expr', expr: '9x-15' }, ansTex: R`y = 9x - 15`, verify: '3+9*(x-2)',
        hint: R`Az $(x_0; y_0)$ ponton átmenő, $m$ meredekségű egyenes egyenlete: $y - y_0 = m(x - x_0)$.`, expl: R`$y - 3 = 9(x - 2)$, azaz $y = 9x - 15$.` },
      { q: R`Hol metszi az érintő az $x$ tengelyt? Két tizedesre kerekítve add meg az $x$ koordinátát.`, answer: { type: 'num', value: 1.67, tol: 0.005 }, ansTex: R`1{,}67`, verify: '15/9',
        hint: R`Old meg a $9x - 15 = 0$ egyenletet.`, expl: R`$x = \dfrac{15}{9} = \dfrac{5}{3} \approx 1{,}67$.` }],
    final: R`Az érintő egyenlete $y = 9x - 15$, az $x$ tengelyt az $x = \dfrac{5}{3}$ helyen metszi.` });

  add({ id: 'b-fv-gui-4', type: 'guided', topic: 'fuggvenyek', sub: 'derivalas', level: 3, title: 'Doboz maximális térfogata',
    problem: R`Egy $12$ cm oldalú négyzet alakú kartonlap négy sarkából egybevágó, $x$ cm oldalú négyzeteket vágunk ki, majd az oldalakat felhajtva nyitott tetejű dobozt hajtogatunk. Mekkora $x$ esetén lesz a doboz térfogata a legnagyobb?`,
    steps: [
      { q: R`Mi az $x$ megengedett értékeinek halmaza?`, answer: { type: 'choice', options: [R`$0 < x < 6$`, R`$0 < x < 12$`, R`$x > 0$`], correct: 0 },
        hint: R`A doboz alapjának oldala $12 - 2x$, és ennek pozitívnak kell lennie.`, expl: R`Az alap oldala $12 - 2x > 0$, azaz $x < 6$, és természetesen $x > 0$.` },
      { q: R`A térfogat $V(x) = x(12 - 2x)^2 = 4x^3 - 48x^2 + 144x$. Add meg a $V'(x)$ függvényt.`, answer: { type: 'expr', expr: '12x^2-96x+144' }, ansTex: R`12x^2 - 96x + 144`, verify: '12*x^2-96*x+144',
        hint: R`Deriváld tagonként a kifejtett alakot.`, expl: R`$V'(x) = 3 \cdot 4x^2 - 2 \cdot 48x + 144 = 12x^2 - 96x + 144$.` },
      { q: R`Mik a $V'(x) = 0$ egyenlet gyökei?`, answer: { type: 'set', values: [2, 6] }, ansTex: R`x_1 = 2,\ x_2 = 6`, verify: ['(8-sqrt(64-48))/2', '(8+sqrt(64-48))/2'],
        hint: R`Oszd az egyenletet $12$-vel: $x^2 - 8x + 12 = 0$.`, expl: R`$x_{1,2} = \dfrac{8 \pm \sqrt{64 - 48}}{2} = \dfrac{8 \pm 4}{2}$.` },
      { q: R`Melyik gyök a megoldás, és miért?`, answer: { type: 'choice', options: [R`$x = 2$: benne van a $]0;\,6[$ intervallumban, és ott $V'$ pozitívról negatívra vált`, R`$x = 6$: ez a nagyobb gyök, tehát nagyobb a térfogat`, R`$x = 2$: mert ez a kisebb gyök`], correct: 0 },
        hint: R`Vizsgáld, melyik gyök esik a megengedett tartományba, és hogyan változik ott a derivált előjele.`, expl: R`A $6$ nem megengedett érték (ott az alap oldala nulla lenne). A $V'(x) = 12(x - 2)(x - 6)$ a $]0;\,2[$ intervallumon pozitív, a $]2;\,6[$ intervallumon negatív, ezért az $x = 2$ helyen lokális, és a tartományban abszolút maximum van.` },
      { q: R`Mekkora a maximális térfogat köbcentiméterben?`, answer: { type: 'num', value: 128 }, ansTex: '128', verify: '2*(12-2*2)^2',
        hint: R`Helyettesítsd be az $x = 2$ értéket a térfogatfüggvénybe.`, expl: R`$V(2) = 2 \cdot (12 - 4)^2 = 2 \cdot 64 = 128$.` }],
    final: R`A térfogat $x = 2$ cm esetén a legnagyobb, ekkor $128$ cm$^3$.` });

  add({ id: 'b-fv-gui-5', type: 'guided', topic: 'fuggvenyek', sub: 'integral', level: 2, title: 'Parabola és az x tengely közötti terület',
    problem: R`Számítsd ki az $f(x) = x^2 - 4x + 3$ függvény grafikonja és az $x$ tengely által közrezárt véges síkidom területét.`,
    steps: [
      { q: R`Mik az $f$ zérushelyei?`, answer: { type: 'set', values: [1, 3] }, ansTex: R`x_1 = 1,\ x_2 = 3`, verify: ['(4-sqrt(16-12))/2', '(4+sqrt(16-12))/2'],
        hint: R`Oldd meg az $x^2 - 4x + 3 = 0$ egyenletet.`, expl: R`$x_{1,2} = \dfrac{4 \pm \sqrt{4}}{2} = \dfrac{4 \pm 2}{2}$, vagyis $1$ és $3$.` },
      { q: R`Add meg az $f$ egy primitív függvényét (konstans tag nélkül).`, answer: { type: 'expr', expr: 'x^3/3-2x^2+3x' }, ansTex: R`\dfrac{x^3}{3} - 2x^2 + 3x`, verify: 'x^3/3-2*x^2+3*x',
        hint: R`Az $x^n$ egy primitív függvénye $\dfrac{x^{n+1}}{n+1}$.`, expl: R`$\dfrac{x^3}{3} - 4 \cdot \dfrac{x^2}{2} + 3x = \dfrac{x^3}{3} - 2x^2 + 3x$.` },
      { q: R`Mennyi az $\displaystyle \int_1^3 f(x) \, dx$ értéke? Két tizedesre kerekítve add meg.`, answer: { type: 'num', value: -1.33, tol: 0.005 }, ansTex: R`-1{,}33`, verify: '-4/3',
        hint: R`Newton–Leibniz: $F(3) - F(1)$. Itt $F(3) = 9 - 18 + 9 = 0$.`, expl: R`$F(3) = 0$ és $F(1) = \dfrac{1}{3} - 2 + 3 = \dfrac{4}{3}$, ezért az integrál $-\dfrac{4}{3} \approx -1{,}33$.` },
      { q: R`Hogyan kapjuk meg ebből a területet?`, answer: { type: 'choice', options: [R`$T = -\displaystyle\int_1^3 f(x) \, dx$, mert az $f$ a $[1; 3]$ intervallumon nem pozitív`, R`$T = \displaystyle\int_1^3 f(x) \, dx$, az integrál mindig a terület`, R`$T = 2 \displaystyle\int_1^3 f(x) \, dx$, mert két gyök van`], correct: 0 },
        hint: R`A felfelé nyíló parabola a két zérushelye között az $x$ tengely alatt halad.`, expl: R`A parabola felfelé nyílik, ezért a gyökei között negatív. A tengely alatti rész integrálja negatív, a területhez az ellentettjét vesszük.` },
      { q: R`Mekkora a terület? Két tizedesre kerekítve add meg.`, answer: { type: 'num', value: 1.33, tol: 0.005 }, ansTex: R`1{,}33`, verify: '4/3',
        hint: R`Az előző két lépés eredményét használd.`, expl: R`$T = \dfrac{4}{3} \approx 1{,}33$.` }],
    final: R`A keresett terület $\dfrac{4}{3} \approx 1{,}33$ területegység.` });

  add({ id: 'b-fv-gui-6', type: 'guided', topic: 'fuggvenyek', sub: 'hatarertek', level: 3, title: 'Határértékek kiszámítása',
    problem: R`Számítsd ki a $\displaystyle \lim_{x \to 2} \dfrac{x^2 - 4}{x^2 - x - 2}$ és a $\displaystyle \lim_{n \to \infty} \dfrac{3n^2 + n}{n^2 + 5}$ határértéket.`,
    steps: [
      { q: R`Mit kapunk, ha az első törtben közvetlenül a $2$ értéket helyettesítjük be?`, answer: { type: 'choice', options: [R`$\dfrac{0}{0}$ alakot, ezért átalakítás kell`, R`A nevező nulla, a számláló nem, ezért a határérték $\infty$`, R`$1$-et, ezért a határérték $1$`], correct: 0 },
        hint: R`Számold ki külön a számláló és a nevező értékét a $2$ helyen.`, expl: R`A számláló $4 - 4 = 0$, a nevező $4 - 2 - 2 = 0$. A $\dfrac{0}{0}$ nem határozott érték, a törtet át kell alakítani.` },
      { q: R`Szorzattá alakítva és egyszerűsítve add meg a törtet $x \ne 2$ esetén.`, answer: { type: 'expr', expr: '(x+2)/(x+1)' }, ansTex: R`\dfrac{x+2}{x+1}`, verify: '(x^2-4)/(x^2-x-2)',
        hint: R`Használd az $x^2 - 4 = (x-2)(x+2)$ azonosságot, a nevezőt pedig a gyökei alapján bontsd tényezőkre.`, expl: R`$x^2 - x - 2 = (x - 2)(x + 1)$, ezért a tört $\dfrac{(x-2)(x+2)}{(x-2)(x+1)} = \dfrac{x+2}{x+1}$.` },
      { q: R`Mekkora az első határérték? Két tizedesre kerekítve add meg.`, answer: { type: 'num', value: 1.33, tol: 0.005 }, ansTex: R`1{,}33`, verify: '4/3',
        hint: R`Az egyszerűsített alakba már behelyettesíthetsz $x = 2$-t.`, expl: R`$\dfrac{2 + 2}{2 + 1} = \dfrac{4}{3} \approx 1{,}33$.` },
      { q: R`Mekkora a $\displaystyle \lim_{n \to \infty} \dfrac{3n^2 + n}{n^2 + 5}$ határérték?`, answer: { type: 'num', value: 3 }, ansTex: '3', verify: '3',
        hint: R`Oszd el a számlálót és a nevezőt is $n^2$-tel.`, expl: R`A tört $\dfrac{3 + \frac{1}{n}}{1 + \frac{5}{n^2}}$ alakú, és $\dfrac{1}{n} \to 0$, $\dfrac{5}{n^2} \to 0$, ezért a határérték $\dfrac{3}{1} = 3$.` },
      { q: R`Mit mondhatunk az $f(x) = \dfrac{x^2 - 4}{x^2 - x - 2}$ függvényről a $2$ helyen?`, answer: { type: 'choice', options: [R`Nincs ott értelmezve, de a határértéke létezik`, R`Ott folytonos`, R`Ott nincs határértéke`], correct: 0 },
        hint: R`Gondold végig: van-e helyettesítési érték, és van-e határérték?`, expl: R`A nevező a $2$ helyen nulla, tehát $f(2)$ nem létezik. A határérték viszont létezik ($\frac{4}{3}$), ezért a hiba megszüntethető szakadás.` }],
    final: R`$\displaystyle \lim_{x \to 2} \dfrac{x^2 - 4}{x^2 - x - 2} = \dfrac{4}{3}$ és $\displaystyle \lim_{n \to \infty} \dfrac{3n^2 + n}{n^2 + 5} = 3$.` });

})(typeof window !== 'undefined' ? window : globalThis);
