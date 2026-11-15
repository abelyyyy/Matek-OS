(function (root) {
  'use strict';
  var MO = root.MO = root.MO || {}; var R = String.raw; var B = MO.bank = MO.bank || {};
  function add(o) { B[o.id] = o; }

  /* ===================== IGAZ–HAMIS ===================== */

  add({ id: 'b-alg-tf-1', type: 'tf', topic: 'algebra', sub: 'hatvanygyoklog', level: 2, title: 'Négyzetgyök és négyzet',
    stmt: R`Minden valós $a$ számra igaz, hogy $\sqrt{a^2} = a$.`, truth: false,
    why: R`Negatív $a$-ra nem igaz: $\sqrt{(-3)^2} = \sqrt{9} = 3 \ne -3$. Helyesen $\sqrt{a^2} = |a|$.`,
    check: ['sqrt(a^2)', 'a'] });

  add({ id: 'b-alg-tf-2', type: 'tf', topic: 'algebra', sub: 'alapmuveletek', level: 1, title: 'A kivonás csoportosítása',
    stmt: R`Minden valós $a$, $b$, $c$ számra $(a - b) - c = a - (b - c)$, vagyis a kivonás asszociatív.`, truth: false,
    why: R`Az $a = b = c = 1$ esetben a bal oldal $(1-1)-1 = -1$, a jobb oldal $1-(1-1) = 1$. Az összeadás asszociatív, a kivonás nem.`,
    check: ['(a-b)-c', 'a-(b-c)'] });

  add({ id: 'b-alg-tf-3', type: 'tf', topic: 'algebra', sub: 'szamelmelet', level: 1, title: 'Néggyel és hattal osztható szám',
    stmt: R`Ha egy természetes szám osztható néggyel is és hattal is, akkor osztható huszonnéggyel is.`, truth: false,
    why: R`Ellenpélda: $12$ osztható $4$-gyel és $6$-tal, de nem osztható $24$-gyel. A $4$ és a $6$ nem relatív prím, ezért a szorzatuk nem következik.` });

  add({ id: 'b-alg-tf-4', type: 'tf', topic: 'algebra', sub: 'szamelmelet', level: 2, title: 'Legnagyobb közös osztó és legkisebb közös többszörös',
    stmt: R`Minden $a$, $b$ pozitív egész számpárra $\text{lnko}(a;b) \cdot \text{lkkt}(a;b) = a \cdot b$.`, truth: true,
    why: R`Prímtényezős alakban minden prím kitevője az $a$-ban és $b$-ben szereplő két kitevő közül a kisebbik (lnko), illetve a nagyobbik (lkkt); a kettő összege a két kitevő összege, ami az $ab$ kitevője. Például $\text{lnko}(12;18) \cdot \text{lkkt}(12;18) = 6 \cdot 36 = 216 = 12 \cdot 18$.` });

  add({ id: 'b-alg-tf-5', type: 'tf', topic: 'algebra', sub: 'szamelmelet', level: 1, title: 'Oszthatóság néggyel',
    stmt: R`Ha egy természetes szám utolsó két számjegyéből alkotott szám osztható néggyel, akkor maga a szám is osztható néggyel.`, truth: true,
    why: R`A szám felírható $100k + m$ alakban, ahol $m$ az utolsó két számjegyből alkotott szám. A $100k$ osztható $4$-gyel, ezért a szám pontosan akkor osztható $4$-gyel, ha $m$ az.` });

  add({ id: 'b-alg-tf-6', type: 'tf', topic: 'algebra', sub: 'szamelmelet', level: 2, title: 'Oszthatóság nyolccal',
    stmt: R`Egy természetes szám pontosan akkor osztható nyolccal, ha az utolsó két számjegyéből alkotott szám osztható nyolccal.`, truth: false,
    why: R`Ellenpélda: a $100$ utolsó két számjegyéből alkotott szám $0$, ami osztható $8$-cal, de $100 = 8 \cdot 12 + 4$. A $100$ nem osztható $8$-cal; a nyolccal való oszthatósághoz az utolsó három számjegyet kell nézni, mert $1000$ osztható $8$-cal.` });

  add({ id: 'b-alg-tf-7', type: 'tf', topic: 'algebra', sub: 'racionalis', level: 1, title: 'Irracionális számok összege',
    stmt: R`Két irracionális szám összege mindig irracionális.`, truth: false,
    why: R`Ellenpélda: $\sqrt{2}$ és $-\sqrt{2}$ irracionális, az összegük $0$, ami racionális. Hasonlóan $\sqrt{2} + (3 - \sqrt{2}) = 3$.` });

  add({ id: 'b-alg-tf-8', type: 'tf', topic: 'algebra', sub: 'racionalis', level: 2, title: 'Racionális és irracionális szám összege',
    stmt: R`Ha $r$ racionális, $i$ pedig irracionális szám, akkor $r + i$ irracionális.`, truth: true,
    why: R`Indirekt: ha $r + i = q$ racionális lenne, akkor $i = q - r$ két racionális szám különbsége, tehát racionális, ami ellentmond annak, hogy $i$ irracionális.` });

  add({ id: 'b-alg-tf-9', type: 'tf', topic: 'algebra', sub: 'racionalis', level: 2, title: 'Végtelen tizedestört kilencesekkel',
    stmt: R`A $0{,}999\ldots$ (végtelen sok kilences) tizedestört értéke pontosan $1$.`, truth: true,
    why: R`Legyen $x = 0{,}999\ldots$. Ekkor $10x = 9{,}999\ldots$, a két egyenlőség különbsége $9x = 9$, így $x = 1$.` });

  add({ id: 'b-alg-tf-10', type: 'tf', topic: 'algebra', sub: 'valos', level: 1, title: 'Az összeg abszolútértéke',
    stmt: R`Minden valós $a$, $b$ számra $|a + b| = |a| + |b|$.`, truth: false,
    why: R`Ellenpélda: $a = 1$, $b = -1$ esetén $|a+b| = 0$, de $|a| + |b| = 2$. Általában csak a háromszög-egyenlőtlenség igaz: $|a+b| \le |a| + |b|$.`,
    check: ['|a+b|', '|a|+|b|'] });

  add({ id: 'b-alg-tf-11', type: 'tf', topic: 'algebra', sub: 'racionalis', level: 2, title: 'Irracionális számok szorzata',
    stmt: R`Két irracionális szám szorzata lehet racionális szám.`, truth: true,
    why: R`Például $\sqrt{2} \cdot \sqrt{2} = 2$, vagy $\sqrt{2} \cdot \dfrac{1}{\sqrt{2}} = 1$; mindkét tényező irracionális, a szorzat racionális.` });

  add({ id: 'b-alg-tf-12', type: 'tf', topic: 'algebra', sub: 'hatvanygyoklog', level: 3, title: 'Hányados logaritmusa',
    stmt: R`Ha $a > 0$, $a \ne 1$ és $b, c > 0$, akkor $\log_a \dfrac{b}{c} = \log_a b - \log_a c$.`, truth: true,
    why: R`Legyen $u = \log_a b$ és $v = \log_a c$, vagyis $a^u = b$ és $a^v = c$. Ekkor $\dfrac{b}{c} = \dfrac{a^u}{a^v} = a^{u-v}$, ezért $\log_a \dfrac{b}{c} = u - v$.` });

  add({ id: 'b-alg-tf-13', type: 'tf', topic: 'algebra', sub: 'hatvanygyoklog', level: 3, title: 'Hatvány logaritmusa és az értelmezési tartomány',
    stmt: R`Minden $x \ne 0$ valós számra $\lg(x^2) = 2 \lg x$.`, truth: false,
    why: R`Negatív $x$-re a bal oldal értelmezett, a jobb oldal nem: $x = -10$ esetén $\lg(100) = 2$, de $\lg(-10)$ nem létezik. Helyesen $\lg(x^2) = 2\lg|x|$, ha $x \ne 0$.` });

  add({ id: 'b-alg-tf-14', type: 'tf', topic: 'algebra', sub: 'hatvanygyoklog', level: 2, title: 'Hatvány hatványa',
    stmt: R`Minden pozitív $a$ számra $(a^3)^2 = a^{3^2}$.`, truth: false,
    why: R`Hatvány hatványánál a kitevők szorzódnak: $(a^3)^2 = a^{3 \cdot 2} = a^6$, míg $a^{3^2} = a^9$. Például $a = 2$-re $64$, illetve $512$.`,
    check: ['(a^3)^2', 'a^(3^2)'] });

  add({ id: 'b-alg-tf-15', type: 'tf', topic: 'algebra', sub: 'betukifejezesek', level: 2, title: 'Köbök különbsége',
    stmt: R`Minden valós $a$, $b$ számra $a^3 - b^3 = (a - b)(a^2 + ab + b^2)$.`, truth: true,
    why: R`A jobb oldalt kifejtve: $a^3 + a^2b + ab^2 - a^2b - ab^2 - b^3 = a^3 - b^3$.`,
    check: ['a^3-b^3', '(a-b)(a^2+a*b+b^2)'] });

  add({ id: 'b-alg-tf-16', type: 'tf', topic: 'algebra', sub: 'betukifejezesek', level: 3, title: 'Ötödik hatványok összege',
    stmt: R`Az $a^5 + b^5$ kifejezés szorzattá alakítható úgy, hogy az egyik tényezője $a + b$.`, truth: true,
    why: R`Páratlan kitevőnél $a^{2n+1} + b^{2n+1}$ osztható $a + b$-vel: $a^5 + b^5 = (a+b)(a^4 - a^3b + a^2b^2 - ab^3 + b^4)$, ami a jobb oldal kifejtésével ellenőrizhető.`,
    check: ['a^5+b^5', '(a+b)(a^4-a^3*b+a^2*b^2-a*b^3+b^4)'] });

  add({ id: 'b-alg-tf-17', type: 'tf', topic: 'algebra', sub: 'aranyszazalek', level: 1, title: 'Emelés és csökkentés ugyanannyi százalékkal',
    stmt: R`Ha egy termék árát $20\%$-kal megemelik, majd az új árat $20\%$-kal csökkentik, akkor visszakapjuk az eredeti árat.`, truth: false,
    why: R`A két változás szorzódik, nem összeadódik: $1{,}2 \cdot 0{,}8 = 0{,}96$, tehát a végső ár az eredeti ár $96\%$-a.`,
    check: ['1,2*0,8', '1'] });

  add({ id: 'b-alg-tf-18', type: 'tf', topic: 'algebra', sub: 'aranyszazalek', level: 1, title: 'Fordított arányosság',
    stmt: R`Ha $y$ fordítottan arányos $x$-szel, és $x$ értékét megkétszerezzük, akkor $y$ értéke a felére csökken.`, truth: true,
    why: R`Fordított arányosságnál $xy = k$ állandó, így $y = \dfrac{k}{x}$. Ha $x$ helyére $2x$ kerül, az új érték $\dfrac{k}{2x} = \dfrac{y}{2}$.` });

  add({ id: 'b-alg-tf-19', type: 'tf', topic: 'algebra', sub: 'egyenletek', level: 1, title: 'Egyenlőtlenség szorzása',
    stmt: R`Ha $a < b$, akkor minden valós $c$ számra $ac < bc$.`, truth: false,
    why: R`Negatív $c$-nél az egyenlőtlenség iránya megfordul: $2 < 3$, de $2 \cdot (-1) > 3 \cdot (-1)$. A $c = 0$ esetben pedig $0 < 0$ nem igaz.` });

  add({ id: 'b-alg-tf-20', type: 'tf', topic: 'algebra', sub: 'egyenletek', level: 2, title: 'Másodfokú egyenlet negatív konstanssal',
    stmt: R`Ha $c < 0$, akkor az $x^2 + bx + c = 0$ egyenletnek bármely valós $b$ esetén két különböző valós gyöke van.`, truth: true,
    why: R`A diszkrimináns $D = b^2 - 4c$. Mivel $b^2 \ge 0$ és $-4c > 0$, ezért $D > 0$, így két különböző valós gyök van.` });

  add({ id: 'b-alg-tf-21', type: 'tf', topic: 'algebra', sub: 'kozepertekek', level: 2, title: 'Számtani és mértani közép',
    stmt: R`Pozitív $a$, $b$ számokra $\dfrac{a+b}{2} \ge \sqrt{ab}$, és egyenlőség pontosan akkor áll fenn, ha $a = b$.`, truth: true,
    why: R`$\dfrac{a+b}{2} - \sqrt{ab} = \dfrac{(\sqrt{a} - \sqrt{b})^2}{2} \ge 0$, és ez pontosan akkor nulla, ha $\sqrt{a} = \sqrt{b}$, azaz $a = b$.` });

  add({ id: 'b-alg-tf-22', type: 'tf', topic: 'algebra', sub: 'kozepertekek', level: 2, title: 'Harmonikus és számtani közép',
    stmt: R`Két különböző pozitív szám harmonikus közepe nagyobb a számtani középnél.`, truth: false,
    why: R`Mindig a harmonikus közép a legkisebb: $H \le G \le A$. Például $a = 1$, $b = 4$ esetén $H = \dfrac{2 \cdot 1 \cdot 4}{1+4} = 1{,}6$, míg $A = 2{,}5$.` });

  /* ===================== HIBAVADÁSZ ===================== */

  add({ id: 'b-alg-spot-1', type: 'spot', topic: 'algebra', sub: 'egyenletek', level: 2, title: 'Gyökös egyenlet megoldása',
    problem: R`Oldd meg a valós számok halmazán: $\sqrt{x + 6} = x$.`,
    lines: [R`Kikötés: $x + 6 \ge 0$, azaz $x \ge -6$.`,
            R`Négyzetre emelés után: $x + 6 = x^2$.`,
            R`Rendezve: $x^2 - x - 6 = 0$, a gyökök $x_1 = 3$ és $x_2 = -2$.`,
            R`Mindkét gyök megfelel a kikötésnek, ezért a megoldások: $3$ és $-2$.`],
    wrong: 3,
    why: R`A négyzetre emelés nem ekvivalens átalakítás: a bal oldal nemnegatív, ezért $x \ge 0$ is kell. Az $x = -2$ hamis gyök: $\sqrt{4} = 2 \ne -2$.`,
    fix: R`Ellenőrzés: $x = 3$-ra $\sqrt{9} = 3$ igaz, $x = -2$-re hamis. Az egyetlen megoldás $x = 3$.`,
    wrongCheck: ['sqrt(-2+6)', '-2'],
    fixCheck: ['sqrt(3+6)', '3'] });

  add({ id: 'b-alg-spot-2', type: 'spot', topic: 'algebra', sub: 'hatvanygyoklog', level: 3, title: 'Logaritmusos egyenlet',
    problem: R`Oldd meg a valós számok halmazán: $\log_2 x + \log_2 (x - 3) = 2$.`,
    lines: [R`Kikötés: $x > 0$ és $x - 3 > 0$, azaz $x > 3$.`,
            R`A logaritmusok összegét egyetlen logaritmusba vonva: $\log_2 (x + (x - 3)) = 2$.`,
            R`Ebből $2x - 3 = 2^2 = 4$, azaz $x = 3{,}5$.`,
            R`Mivel $3{,}5 > 3$, a kikötésnek megfelel, ezért a megoldás $x = 3{,}5$.`],
    wrong: 1,
    why: R`A logaritmusok összege szorzat logaritmusa: $\log_a x + \log_a y = \log_a (xy)$, nem az összegé. Például $\log_2 4 + \log_2 4 = 4$, de $\log_2 (4 + 4) = 3$.`,
    fix: R`Helyesen $\log_2 (x(x-3)) = 2$, azaz $x^2 - 3x = 4$, vagyis $x^2 - 3x - 4 = 0$. A gyökök $x = 4$ és $x = -1$; a kikötés miatt csak $x = 4$ jó. Ellenőrzés: $\log_2 4 + \log_2 1 = 2 + 0 = 2$.`,
    wrongCheck: ['log(2;4)+log(2;4)', 'log(2;4+4)'],
    fixCheck: ['log(2;4)+log(2;4)', 'log(2;4*4)'] });

  add({ id: 'b-alg-spot-3', type: 'spot', topic: 'algebra', sub: 'alapmuveletek', level: 1, title: 'Osztás az ismeretlennel',
    problem: R`Oldd meg a valós számok halmazán: $x^2 = 3x$.`,
    lines: [R`Az egyenlet: $x^2 = 3x$.`,
            R`Mindkét oldalt elosztom $x$-szel: $x = 3$.`,
            R`Ellenőrzés: $3^2 = 9 = 3 \cdot 3$, tehát a $3$ megoldás.`,
            R`Az egyenletnek egyetlen megoldása van: $x = 3$.`],
    wrong: 1,
    why: R`Osztani csak nullától különböző kifejezéssel szabad, de $x$ lehet $0$ is. Az osztással elveszett az $x = 0$ megoldás.`,
    fix: R`Nullára rendezve: $x^2 - 3x = 0$, szorzattá alakítva $x(x - 3) = 0$. Innen $x = 0$ vagy $x = 3$; két megoldás van. Az $x = 0$ jó: $0^2 = 0 = 3 \cdot 0$.`,
    wrongCheck: ['2', '1'],
    fixCheck: ['0^2', '3*0'] });

  add({ id: 'b-alg-spot-4', type: 'spot', topic: 'algebra', sub: 'egyenletek', level: 1, title: 'Egyenlőtlenség iránya',
    problem: R`Oldd meg a valós számok halmazán: $5 - 2x < 1$.`,
    lines: [R`Az egyenlőtlenség: $5 - 2x < 1$.`,
            R`Mindkét oldalból $5$-öt kivonva: $-2x < -4$.`,
            R`Elosztom $-2$-vel: $x < 2$.`,
            R`A megoldáshalmaz: $]-\infty;\ 2[$.`],
    wrong: 2,
    why: R`Negatív számmal osztva az egyenlőtlenség iránya megfordul. Az $x = 0$ például nem megoldás: $5 - 0 = 5 > 1$.`,
    fix: R`Helyesen $x > 2$, a megoldáshalmaz $]2;\ \infty[$. A határon az egyenlőség áll: $5 - 2 \cdot 2 = 1$.`,
    wrongCheck: ['5-2*0', '1'],
    fixCheck: ['5-2*2', '1'] });

  add({ id: 'b-alg-spot-5', type: 'spot', topic: 'algebra', sub: 'valos', level: 2, title: 'Abszolútértékes egyenlet',
    problem: R`Oldd meg a valós számok halmazán: $|2x - 1| = 5$.`,
    lines: [R`Az abszolútérték definíciója: $|u| = u$, ha $u \ge 0$, és $|u| = -u$, ha $u < 0$.`,
            R`Mivel a jobb oldal pozitív, a $2x - 1$ kifejezés nem lehet negatív.`,
            R`Így $2x - 1 = 5$, azaz $x = 3$.`,
            R`Az egyenlet egyetlen megoldása $x = 3$.`],
    wrong: 1,
    why: R`Attól, hogy az abszolútérték értéke pozitív, a belseje még lehet negatív. Az $x = -2$ esetén $2x - 1 = -5$, és $|-5| = 5$.`,
    fix: R`Két eset van: $2x - 1 = 5$, ebből $x = 3$; vagy $2x - 1 = -5$, ebből $x = -2$. Mindkettő jó: $|2 \cdot 3 - 1| = 5$ és $|2 \cdot (-2) - 1| = 5$.`,
    wrongCheck: ['2*(-2)-1', '|2*(-2)-1|'],
    fixCheck: ['-(2*(-2)-1)', '5'] });

  add({ id: 'b-alg-spot-6', type: 'spot', topic: 'algebra', sub: 'aranyszazalek', level: 2, title: 'Egymás utáni százalékos változások',
    problem: R`Egy termék árát $25\%$-kal megemelik, majd az új árat $20\%$-kal csökkentik. Mennyit változott az ár az eredetihez képest?`,
    lines: [R`Legyen az eredeti ár $p$. A $25\%$-os emelés után az ár $1{,}25p$.`,
            R`A két változás összeadható: $+25\% - 20\% = +5\%$, tehát a végső ár $1{,}05p$.`,
            R`A végső ár az eredeti ár $105$ százaléka.`,
            R`Összességében tehát a termék drágább lett.`],
    wrong: 1,
    why: R`A csökkentés már az emelt árra vonatkozik, ezért a két változás szorzódik, nem adódik össze.`,
    fix: R`A végső ár $1{,}25p \cdot 0{,}8 = p$, tehát az ár összességében nem változott.`,
    wrongCheck: ['1,25*0,8', '1,05'],
    fixCheck: ['1,25*0,8', '1'] });

  add({ id: 'b-alg-spot-7', type: 'spot', topic: 'algebra', sub: 'betukifejezesek', level: 1, title: 'Összeg négyzetének kifejtése',
    problem: R`Oldd meg a valós számok halmazán: $(x + 3)^2 = x^2 + 15$.`,
    lines: [R`Az egyenlet: $(x + 3)^2 = x^2 + 15$.`,
            R`A bal oldalt kifejtve: $x^2 + 9 = x^2 + 15$.`,
            R`Mindkét oldalból $x^2$-et levonva: $9 = 15$, ami ellentmondás.`,
            R`Az egyenletnek nincs megoldása.`],
    wrong: 1,
    why: R`$(a+b)^2 = a^2 + 2ab + b^2$, a kettős szorzat nem hagyható el. Például $(2+3)^2 = 25$, de $2^2 + 3^2 = 13$.`,
    fix: R`Helyesen $x^2 + 6x + 9 = x^2 + 15$, ebből $6x = 6$, így $x = 1$. Ellenőrzés: $(1+3)^2 = 16 = 1 + 15$.`,
    wrongCheck: ['(2+3)^2', '2^2+3^2'],
    fixCheck: ['(2+3)^2', '2^2+2*2*3+3^2'] });

  add({ id: 'b-alg-spot-8', type: 'spot', topic: 'algebra', sub: 'hatvanygyoklog', level: 3, title: 'Exponenciális egyenlet új ismerettel',
    problem: R`Oldd meg a valós számok halmazán: $4^x - 3 \cdot 2^x - 4 = 0$.`,
    lines: [R`Legyen $t = 2^x$; ekkor $4^x = t^2$, és az egyenlet $t^2 - 3t - 4 = 0$.`,
            R`A gyökök: $t_1 = 4$ és $t_2 = -1$.`,
            R`Visszahelyettesítve: $2^x = 4$ miatt $x = 2$, és $2^x = -1$ miatt $x = -1$.`,
            R`Tehát két megoldás van: $x = 2$ és $x = -1$.`],
    wrong: 2,
    why: R`Az $x = -1$ nem megoldás: $2^{-1} = \dfrac{1}{2} \ne -1$. A $2^x$ mindig pozitív, ezért $t = -1$-hez nem tartozik valós $x$.`,
    fix: R`A $t_2 = -1$ gyököt el kell vetni, mert $2^x > 0$. Egyetlen megoldás marad: $x = 2$. Ellenőrzés: $16 - 12 - 4 = 0$.`,
    wrongCheck: ['2^(-1)', '-1'],
    fixCheck: ['2^2', '4'] });

  /* ===================== SORBA RENDEZÉS ===================== */

  add({ id: 'b-alg-ord-1', type: 'order', topic: 'algebra', sub: 'racionalis', level: 3, title: 'A gyök kettő irracionális',
    claim: R`Rendezd sorba az indirekt bizonyítás lépéseit: $\sqrt{2}$ irracionális szám.`,
    steps: [R`Tegyük fel indirekt, hogy $\sqrt{2} = \dfrac{p}{q}$, ahol $p$ és $q$ relatív prím pozitív egészek.`,
            R`Négyzetre emelve $2q^2 = p^2$, ezért $p^2$ páros, így $p$ is páros: $p = 2k$.`,
            R`Behelyettesítve $2q^2 = 4k^2$, azaz $q^2 = 2k^2$, ezért $q$ is páros.`,
            R`Ekkor $p$ és $q$ is osztható $2$-vel, ami ellentmond annak, hogy relatív prímek.`,
            R`Az indirekt feltevés hamis, tehát $\sqrt{2}$ irracionális.`],
    note: R`Az indirekt bizonyítás mindig a feltevéssel indul és az ellentmondással zárul.` });

  add({ id: 'b-alg-ord-2', type: 'order', topic: 'algebra', sub: 'szamelmelet', level: 3, title: 'Végtelen sok prímszám van',
    claim: R`Rendezd sorba az indirekt bizonyítás lépéseit: végtelen sok prímszám van.`,
    steps: [R`Tegyük fel indirekt, hogy csak véges sok prímszám van: $p_1, p_2, \dots, p_k$.`,
            R`Legyen $N = p_1 p_2 \cdots p_k + 1$; ez $1$-nél nagyobb természetes szám.`,
            R`Az $N$-nek van prímosztója, legyen ez $q$. Mivel az összes prímet felsoroltuk, $q$ egyenlő valamelyik $p_i$-vel.`,
            R`Ekkor $q$ osztója a $p_1 p_2 \cdots p_k$ szorzatnak és az $N$-nek is, ezért a különbségüknek, az $1$-nek is.`,
            R`Ez lehetetlen, mert egy prímszám nem osztója az egynek. Az indirekt feltevés hamis, tehát végtelen sok prím van.`],
    note: R`A bizonyítás nem állítja, hogy az $N$ prím; csak azt, hogy van olyan prímosztója, amely nincs a listán.` });

  add({ id: 'b-alg-ord-3', type: 'order', topic: 'algebra', sub: 'kozepertekek', level: 2, title: 'Számtani és mértani közép közti egyenlőtlenség',
    claim: R`Rendezd sorba a bizonyítás lépéseit: ha $a, b > 0$, akkor $\dfrac{a+b}{2} \ge \sqrt{ab}$.`,
    steps: [R`Mivel $a, b > 0$, léteznek a $\sqrt{a}$ és $\sqrt{b}$ valós számok.`,
            R`Valós szám négyzete nem negatív, ezért $(\sqrt{a} - \sqrt{b})^2 \ge 0$.`,
            R`A négyzetet kifejtve: $a - 2\sqrt{a}\sqrt{b} + b \ge 0$, ahol $\sqrt{a}\sqrt{b} = \sqrt{ab}$.`,
            R`Átrendezve: $a + b \ge 2\sqrt{ab}$.`,
            R`Kettővel osztva: $\dfrac{a+b}{2} \ge \sqrt{ab}$; egyenlőség pontosan akkor áll, ha $\sqrt{a} = \sqrt{b}$, azaz $a = b$.`],
    note: R`A kiindulás egy mindig igaz állítás (nemnegatív négyzet), amelyből ekvivalens átalakításokkal jutunk a bizonyítandóhoz.` });

  add({ id: 'b-alg-ord-4', type: 'order', topic: 'algebra', sub: 'egyenletek', level: 3, title: 'A másodfokú megoldóképlet levezetése',
    claim: R`Rendezd sorba a levezetés lépéseit: az $ax^2 + bx + c = 0$ ($a \ne 0$) egyenlet megoldóképlete.`,
    steps: [R`Az egyenletet $a$-val osztjuk: $x^2 + \dfrac{b}{a}x + \dfrac{c}{a} = 0$.`,
            R`Teljes négyzetté alakítunk: $\left(x + \dfrac{b}{2a}\right)^2 - \dfrac{b^2}{4a^2} + \dfrac{c}{a} = 0$.`,
            R`Átrendezve: $\left(x + \dfrac{b}{2a}\right)^2 = \dfrac{b^2 - 4ac}{4a^2}$.`,
            R`Ha $b^2 - 4ac \ge 0$, gyököt vonva: $x + \dfrac{b}{2a} = \pm\dfrac{\sqrt{b^2 - 4ac}}{2a}$.`,
            R`Innen $x = \dfrac{-b \pm \sqrt{b^2 - 4ac}}{2a}$.`],
    note: R`Ha $b^2 - 4ac < 0$, a jobb oldal negatív, a négyzet pedig nem lehet az, ezért nincs valós megoldás.` });

  add({ id: 'b-alg-ord-5', type: 'order', topic: 'algebra', sub: 'hatvanygyoklog', level: 3, title: 'A szorzat logaritmusa',
    claim: R`Rendezd sorba a bizonyítás lépéseit: ha $a > 0$, $a \ne 1$ és $x, y > 0$, akkor $\log_a (xy) = \log_a x + \log_a y$.`,
    steps: [R`Legyen $u = \log_a x$ és $v = \log_a y$; ezek léteznek, mert $x, y > 0$. A definíció szerint $a^u = x$ és $a^v = y$.`,
            R`A két egyenlőséget összeszorozva: $xy = a^u \cdot a^v$.`,
            R`A hatványozás azonossága szerint $a^u \cdot a^v = a^{u+v}$, tehát $xy = a^{u+v}$.`,
            R`A logaritmus definíciója szerint ebből $\log_a (xy) = u + v$.`,
            R`Visszahelyettesítve $u$-t és $v$-t: $\log_a (xy) = \log_a x + \log_a y$.`],
    note: R`A bizonyítás a logaritmus definíciójára és a hatványozás azonosságára épül.` });

  add({ id: 'b-alg-ord-6', type: 'order', topic: 'algebra', sub: 'szamelmelet', level: 3, title: 'A hárommal való oszthatóság szabálya',
    claim: R`Rendezd sorba a bizonyítás lépéseit: egy természetes szám pontosan akkor osztható hárommal, ha a számjegyeinek összege osztható hárommal.`,
    steps: [R`Legyen az $n$ szám tízes számrendszerbeli alakja $n = a_k 10^k + \dots + a_1 \cdot 10 + a_0$, ahol $a_i$ a számjegyek.`,
            R`Átírjuk: $n = a_k (10^k - 1) + \dots + a_1 (10 - 1) + (a_k + \dots + a_1 + a_0)$.`,
            R`Minden $i \ge 1$ esetén $10^i - 1 = 99\ldots9$, ami osztható kilenccel, tehát hárommal is; így az összeg első része osztható hárommal.`,
            R`Ezért $n$ pontosan akkor osztható hárommal, ha a másik rész, a számjegyek összege is osztható hárommal.`],
    note: R`Ugyanígy látható, hogy a kilenccel való oszthatóság is a számjegyek összegén múlik.` });

  /* ===================== VEZETETT MEGOLDÁS ===================== */

  add({ id: 'b-alg-gui-1', type: 'guided', topic: 'algebra', sub: 'egyenletek', level: 2, title: 'Másodfokú egyenlőtlenség',
    problem: R`Oldd meg a valós számok halmazán: $x^2 - x - 6 < 0$.`,
    steps: [
      { q: R`Mik az $x^2 - x - 6 = 0$ egyenlet gyökei?`, answer: { type: 'set', values: [-2, 3] }, ansTex: R`x_1 = -2,\ x_2 = 3`, verify: ['(1-sqrt(1+24))/2', '(1+sqrt(1+24))/2'],
        hint: R`Használd a megoldóképletet, vagy keress két számot, amelyek összege $1$, szorzata $-6$.`, expl: R`$D = 1 + 24 = 25$, ezért $x_{1,2} = \dfrac{1 \pm 5}{2}$.` },
      { q: R`Merre nyílik a parabola?`, answer: { type: 'choice', options: ['Felfelé', 'Lefelé', 'Ez nem parabola'], correct: 0 },
        hint: R`Nézd a főegyüttható előjelét.`, expl: R`A főegyüttható $1 > 0$, ezért a parabola felfelé nyílik: a két gyök között negatív.` },
      { q: R`Hány egész szám megoldása az egyenlőtlenségnek?`, answer: { type: 'num', value: 4 }, ansTex: '4', verify: '3-(-2)-1',
        hint: R`A megoldáshalmaz a $]-2; 3[$ nyílt intervallum.`, expl: R`Az egész megoldások: $-1$, $0$, $1$, $2$.` }],
    final: R`A megoldáshalmaz: $]-2;\ 3[$.` });

  add({ id: 'b-alg-gui-2', type: 'guided', topic: 'algebra', sub: 'hatvanygyoklog', level: 2, title: 'Exponenciális egyenlet új ismeretlennel',
    problem: R`Oldd meg a valós számok halmazán: $9^x - 4 \cdot 3^x + 3 = 0$.`,
    steps: [
      { q: R`Legyen $t = 3^x$. Milyen értékeket vehet fel $t$?`, answer: { type: 'choice', options: ['t > 0', 't ≥ 0', 'Tetszőleges valós szám'], correct: 0 },
        hint: R`Gondold végig, lehet-e egy pozitív alapú hatvány nulla vagy negatív.`, expl: R`Az exponenciális függvény értékkészlete a pozitív valós számok halmaza, ezért $t > 0$.` },
      { q: R`Mivel $9^x = t^2$, az egyenlet $t^2 - 4t + 3 = 0$. Mik a gyökei?`, answer: { type: 'set', values: [1, 3] }, ansTex: R`t_1 = 1,\ t_2 = 3`, verify: ['(4-sqrt(16-12))/2', '(4+sqrt(16-12))/2'],
        hint: R`Megoldóképlet, vagy szorzattá alakítás: két szám, amelyek összege $4$, szorzata $3$.`, expl: R`$D = 16 - 12 = 4$, így $t_{1,2} = \dfrac{4 \pm 2}{2}$. Mindkét gyök pozitív, tehát megfelel a feltételnek.` },
      { q: R`Add meg az $x$ értékeit, ha $3^x = t$ a két gyökre!`, answer: { type: 'set', values: [0, 1] }, ansTex: R`x_1 = 0,\ x_2 = 1`, verify: ['log(3;1)', 'log(3;3)'],
        hint: R`Az exponenciális függvény kölcsönösen egyértelmű: $3^x = 1$ és $3^x = 3$.`, expl: R`$3^x = 1$ esetén $x = 0$, $3^x = 3$ esetén $x = 1$. Ellenőrzés: $x = 0$-ra $1 - 4 + 3 = 0$, $x = 1$-re $9 - 12 + 3 = 0$.` }],
    final: R`Az egyenlet megoldásai: $x = 0$ és $x = 1$.` });

  add({ id: 'b-alg-gui-3', type: 'guided', topic: 'algebra', sub: 'hatvanygyoklog', level: 3, title: 'Logaritmusos egyenlet kikötéssel',
    problem: R`Oldd meg a valós számok halmazán: $\lg(x - 1) + \lg(x + 2) = 1$.`,
    steps: [
      { q: R`A kikötés szerint $x - 1 > 0$ és $x + 2 > 0$ is teljesül. Az $x$ minden megengedett értéke nagyobb, mint mekkora szám?`, answer: { type: 'num', value: 1 }, ansTex: '1', verify: '1',
        hint: R`Mindkét feltételnek egyszerre kell teljesülnie, a szigorúbbat kell venni.`, expl: R`Az első feltételből $x > 1$, a másodikból $x > -2$; a kettő közös része $x > 1$.` },
      { q: R`A szorzat logaritmusára vonatkozó azonosságot alkalmazva $\lg\big((x-1)(x+2)\big) = 1$. Mivel egyenlő a szorzat $(x-1)(x+2)$?`, answer: { type: 'num', value: 10 }, ansTex: '10', verify: '10^1',
        hint: R`A tízes alapú logaritmus definíciója: $\lg A = 1$ azt jelenti, hogy $A = 10^1$.`, expl: R`$\lg A = 1$ miatt $A = 10^1 = 10$.` },
      { q: R`Rendezd az $x^2 + x - 2 = 10$ egyenletet nullára, és add meg a gyököket!`, answer: { type: 'set', values: [-4, 3] }, ansTex: R`x_1 = -4,\ x_2 = 3`, verify: ['(-1-sqrt(1+48))/2', '(-1+sqrt(1+48))/2'],
        hint: R`A nullára rendezett alak $x^2 + x - 12 = 0$.`, expl: R`$D = 1 + 48 = 49$, így $x_{1,2} = \dfrac{-1 \pm 7}{2}$.` },
      { q: R`Melyik gyök felel meg a kikötésnek?`, answer: { type: 'num', value: 3 }, ansTex: '3', verify: '3',
        hint: R`Az $x = -4$ esetén $x - 1$ negatív.`, expl: R`Csak az $x = 3$ nagyobb $1$-nél. Ellenőrzés: $\lg 2 + \lg 5 = \lg 10 = 1$.` }],
    final: R`Az egyenlet egyetlen megoldása: $x = 3$.` });

  add({ id: 'b-alg-gui-4', type: 'guided', topic: 'algebra', sub: 'egyenletek', level: 3, title: 'Paraméteres másodfokú egyenlet',
    problem: R`Adott a $p$ valós paraméterrel az $x^2 - 2px + p + 6 = 0$ egyenlet. Mely $p$ értékekre van az egyenletnek két különböző valós gyöke?`,
    steps: [
      { q: R`Add meg a diszkrimináns negyedét, $\dfrac{D}{4}$-et $p$ függvényében (az $x^2 - 2px + p + 6$ alapján $\dfrac{D}{4} = p^2 - (p + 6)$ rendezett alakja)!`, answer: { type: 'expr', expr: 'p^2-p-6' }, ansTex: 'p^2 - p - 6', verify: '(p-3)(p+2)',
        hint: R`Itt $b = -2p$, ezért $D = 4p^2 - 4(p+6)$, és ennek a negyede $p^2 - p - 6$.`, expl: R`$D = (-2p)^2 - 4 \cdot 1 \cdot (p + 6) = 4p^2 - 4p - 24$, a negyede $p^2 - p - 6 = (p-3)(p+2)$.` },
      { q: R`Mely $p$ értékekre lesz $D = 0$?`, answer: { type: 'set', values: [-2, 3] }, ansTex: R`p_1 = -2,\ p_2 = 3`, verify: ['-2', '3'],
        hint: R`Használd a szorzattá alakított $(p-3)(p+2)$ alakot.`, expl: R`$(p-3)(p+2) = 0$ pontosan akkor, ha $p = 3$ vagy $p = -2$.` },
      { q: R`Mikor van két különböző valós gyök?`, answer: { type: 'choice', options: ['p < −2 vagy p > 3', '−2 < p < 3', 'p ≠ 3'], correct: 0 },
        hint: R`Két különböző valós gyök: $D > 0$; a $p^2 - p - 6$ felfelé nyíló parabola, a gyökein kívül pozitív.`, expl: R`A $(p-3)(p+2) > 0$ egyenlőtlenség megoldása a két gyökön kívüli rész: $p < -2$ vagy $p > 3$.` },
      { q: R`Hány egész $p$ értékre nincs valós gyök, ha $-5 \le p \le 5$?`, answer: { type: 'num', value: 4 }, ansTex: '4', verify: '3-(-2)-1',
        hint: R`Nincs valós gyök, ha $D < 0$, azaz $-2 < p < 3$.`, expl: R`Az egész értékek: $p = -1, 0, 1, 2$; az $-5 \le p \le 5$ korlát ezeket nem érinti.` }],
    final: R`Két különböző valós gyöke pontosan akkor van, ha $p < -2$ vagy $p > 3$.` });

  add({ id: 'b-alg-gui-5', type: 'guided', topic: 'algebra', sub: 'egyenletek', level: 2, title: 'Másodfokú egyenletrendszer',
    problem: R`Oldd meg a valós számok halmazán: $x - y = 2$ és $x^2 + y^2 = 34$.`,
    steps: [
      { q: R`Az első egyenletből $x = y + 2$. Helyettesítsd a másodikba, rendezd nullára, és oszd el $2$-vel: mik az $y$ lehetséges értékei?`, answer: { type: 'set', values: [-5, 3] }, ansTex: R`y_1 = -5,\ y_2 = 3`, verify: ['(-2-sqrt(4+60))/2', '(-2+sqrt(4+60))/2'],
        hint: R`$(y+2)^2 + y^2 = 34$ rendezve $2y^2 + 4y - 30 = 0$, osztva $2$-vel: $y^2 + 2y - 15 = 0$.`, expl: R`$D = 4 + 60 = 64$, így $y_{1,2} = \dfrac{-2 \pm 8}{2}$.` },
      { q: R`Mekkora $x$ tartozik az $y = 3$ értékhez?`, answer: { type: 'num', value: 5 }, ansTex: '5', verify: '3+2',
        hint: R`Használd az $x = y + 2$ összefüggést.`, expl: R`$x = 3 + 2 = 5$. Ellenőrzés: $5^2 + 3^2 = 34$.` },
      { q: R`Mekkora $x$ tartozik az $y = -5$ értékhez?`, answer: { type: 'num', value: -3 }, ansTex: '-3', verify: '-5+2',
        hint: R`Ugyanaz az összefüggés: $x = y + 2$.`, expl: R`$x = -5 + 2 = -3$. Ellenőrzés: $(-3)^2 + (-5)^2 = 9 + 25 = 34$.` },
      { q: R`Hány megoldáspárja van az egyenletrendszernek?`, answer: { type: 'num', value: 2 }, ansTex: '2', verify: '2',
        hint: R`Minden $y$ értékhez pontosan egy $x$ tartozik.`, expl: R`Két $y$ érték van, mindegyikhez egy $x$: két számpár.` }],
    final: R`A megoldások: $(x;\ y) = (5;\ 3)$ és $(x;\ y) = (-3;\ -5)$.` });

  add({ id: 'b-alg-gui-6', type: 'guided', topic: 'algebra', sub: 'aranyszazalek', level: 2, title: 'Keverési feladat',
    problem: R`Egy $20\%$-os és egy $50\%$-os sóoldat keverésével $3$ kg tömegű, $30\%$-os sóoldatot szeretnénk készíteni. Hány kg kell az egyes oldatokból?`,
    steps: [
      { q: R`Hány kg só van a kész $3$ kg tömegű, $30\%$-os oldatban?`, answer: { type: 'num', value: 0.9, tol: 0.001 }, ansTex: R`0{,}9`, verify: '0,3*3',
        hint: R`A só tömege az oldat tömegének $30\%$-a.`, expl: R`$0{,}3 \cdot 3 = 0{,}9$ kg.` },
      { q: R`Legyen $x$ kg a $20\%$-os oldat, így az $50\%$-osból $3 - x$ kg kell. A só mennyiségére $0{,}2x + 0{,}5(3 - x) = 0{,}9$. Mekkora $x$?`, answer: { type: 'num', value: 2 }, ansTex: '2', verify: '(0,9-1,5)/(0,2-0,5)',
        hint: R`Bontsd fel a zárójelet: $0{,}2x + 1{,}5 - 0{,}5x = 0{,}9$.`, expl: R`$-0{,}3x = -0{,}6$, ezért $x = 2$.` },
      { q: R`Hány kg kell az $50\%$-os oldatból?`, answer: { type: 'num', value: 1 }, ansTex: '1', verify: '3-2',
        hint: R`A két rész összesen $3$ kg.`, expl: R`$3 - 2 = 1$ kg. Ellenőrzés: $0{,}2 \cdot 2 + 0{,}5 \cdot 1 = 0{,}9$ kg só.` }],
    final: R`A $20\%$-os oldatból $2$ kg, az $50\%$-osból $1$ kg szükséges.` });

  add({ id: 'b-alg-gui-7', type: 'guided', topic: 'algebra', sub: 'egyenletek', level: 3, title: 'Két abszolútértékes kifejezés',
    problem: R`Oldd meg a valós számok halmazán: $|x - 2| + |x + 1| = 5$.`,
    steps: [
      { q: R`Mely $x$ értékeknél vált előjelet az $x - 2$ és az $x + 1$ kifejezés?`, answer: { type: 'set', values: [-1, 2] }, ansTex: R`x = -1,\ x = 2`, verify: ['-1', '2'],
        hint: R`Keresd meg, hol nulla az abszolútértékek belseje.`, expl: R`Az $x + 1 = 0$ és az $x - 2 = 0$ egyenletből $x = -1$, illetve $x = 2$. Három esetet kell vizsgálni.` },
      { q: R`Ha $-1 \le x < 2$, mekkora a bal oldal értéke?`, answer: { type: 'num', value: 3 }, ansTex: '3', verify: '(2-0)+(0+1)',
        hint: R`Ebben az intervallumban $|x - 2| = 2 - x$ és $|x + 1| = x + 1$.`, expl: R`$(2 - x) + (x + 1) = 3$, ami nem egyenlő $5$-tel, ezért itt nincs megoldás.` },
      { q: R`Ha $x \ge 2$, akkor $(x - 2) + (x + 1) = 5$. Mekkora $x$?`, answer: { type: 'num', value: 3 }, ansTex: '3', verify: '(5+1)/2',
        hint: R`$2x - 1 = 5$.`, expl: R`$x = 3$, ami teljesíti az $x \ge 2$ feltételt.` },
      { q: R`Ha $x < -1$, akkor $(2 - x) + (-x - 1) = 5$. Mekkora $x$?`, answer: { type: 'num', value: -2 }, ansTex: '-2', verify: '(1-5)/2',
        hint: R`$-2x + 1 = 5$.`, expl: R`$x = -2$, ami teljesíti az $x < -1$ feltételt.` }],
    final: R`Az egyenlet megoldásai: $x = -2$ és $x = 3$.` });

  add({ id: 'b-alg-gui-8', type: 'guided', topic: 'algebra', sub: 'kozepertekek', level: 2, title: 'Összeg minimuma a közepek közti egyenlőtlenséggel',
    problem: R`Mekkora az $x + \dfrac{9}{x}$ kifejezés legkisebb értéke pozitív $x$ esetén, és mikor veszi fel?`,
    steps: [
      { q: R`Mekkora a két tag, $x$ és $\dfrac{9}{x}$ szorzata?`, answer: { type: 'num', value: 9 }, ansTex: '9', verify: '9',
        hint: R`Az $x$ kiesik a szorzatból.`, expl: R`$x \cdot \dfrac{9}{x} = 9$, vagyis a szorzat állandó, éppen ez teszi alkalmazhatóvá a közepek közti egyenlőtlenséget.` },
      { q: R`A számtani és mértani közép közti egyenlőtlenség szerint $\dfrac{1}{2}\left(x + \dfrac{9}{x}\right) \ge \sqrt{9}$. Mekkora az összeg alsó korlátja?`, answer: { type: 'num', value: 6 }, ansTex: '6', verify: '2*sqrt(9)',
        hint: R`Szorozd meg az egyenlőtlenség mindkét oldalát kettővel.`, expl: R`$x + \dfrac{9}{x} \ge 2\sqrt{9} = 6$.` },
      { q: R`Melyik pozitív $x$-nél van egyenlőség?`, answer: { type: 'num', value: 3 }, ansTex: '3', verify: 'sqrt(9)',
        hint: R`Egyenlőség pontosan akkor áll, ha a két tag egyenlő: $x = \dfrac{9}{x}$.`, expl: R`$x^2 = 9$ és $x > 0$ miatt $x = 3$; ekkor $3 + 3 = 6$.` }],
    final: R`A legkisebb érték $6$, és az $x = 3$ helyen veszi fel.` });
})(typeof window !== 'undefined' ? window : globalThis);
