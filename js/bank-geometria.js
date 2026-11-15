(function (root) {
  'use strict';
  var MO = root.MO = root.MO || {}; var R = String.raw; var B = MO.bank = MO.bank || {};
  function add(o) { B[o.id] = o; }

  /* ===== IGAZ–HAMIS ===== */

  add({ id: 'b-geo-tf-1', type: 'tf', topic: 'geometria', sub: 'elemigeo', level: 1, title: 'Nem metsző egyenesek a térben',
    stmt: R`Ha két egyenes a térben nem metszi egymást, akkor párhuzamosak.`, truth: false,
    why: R`A térben létezhetnek kitérő egyenesek. Egy kocka $A(0;0;0)$, $B(1;0;0)$, $C(1;1;0)$, $G(1;1;1)$ csúcsai esetén az $AB$ és a $CG$ egyenesnek nincs közös pontja, mégsem párhuzamosak (az egyik vízszintes, a másik függőleges).` });

  add({ id: 'b-geo-tf-2', type: 'tf', topic: 'geometria', sub: 'elemigeo', level: 2, title: 'Parabola mint ponthalmaz',
    stmt: R`Ha az $F$ pont nem illeszkedik a $d$ egyenesre, akkor a síkban azon pontok halmaza, amelyek $F$-től és $d$-től egyenlő távolságra vannak, parabola.`, truth: true,
    why: R`Ez a parabola definíciója: $F$ a fókuszpont, $d$ a vezéregyenes. Az $F \in d$ esetben a halmaz egy egyenes lenne (a $d$ $F$-en átmenő merőlegese), ezért kell a feltétel.` });

  add({ id: 'b-geo-tf-3', type: 'tf', topic: 'geometria', sub: 'elemigeo', level: 2, title: 'Két ponttól egyenlő távolságra a térben',
    stmt: R`A térben két különböző ponttól egyenlő távolságra lévő pontok halmaza egy egyenes.`, truth: false,
    why: R`A síkban ez a halmaz a szakaszfelező merőleges egyenes, de a térben a szakaszfelező merőleges sík. Például az $A(0;0;0)$ és $B(2;0;0)$ pontoktól egyenlő távol van minden $(1;y;z)$ alakú pont, ez az $x = 1$ egyenletű sík.` });

  add({ id: 'b-geo-tf-4', type: 'tf', topic: 'geometria', sub: 'transzformaciok', level: 3, title: 'Két félfordulat egymás után',
    stmt: R`Ha a síkot először a $P$ pont körül félfordulattal, majd egy tőle különböző $Q$ pont körül szintén félfordulattal elforgatjuk, akkor az eredő transzformáció is egy forgatás.`, truth: false,
    why: R`Legyen $P = (0;0)$, $Q = (1;0)$. A $P$ körüli forgatás az $(x;y)$ pontot $(-x;-y)$-ba viszi, a $Q$ körüli forgatás az $(u;v)$ pontot $(2-u;-v)$-be. Az eredő leképezés $(x;y) \mapsto (x+2;\,y)$, ez a $2\overrightarrow{PQ}$ vektor szerinti eltolás, és nincs fixpontja, tehát nem forgatás.` });

  add({ id: 'b-geo-tf-5', type: 'tf', topic: 'geometria', sub: 'transzformaciok', level: 1, title: 'Hasonló háromszögek területaránya',
    stmt: R`Két hasonló háromszög hasonlóságának aránya $3$. Ekkor a nagyobb háromszög területe kilencszerese a kisebb háromszög területének.`, truth: true,
    why: R`Hasonló síkidomok területének aránya a hasonlóság arányának négyzete: $3^2 = 9$. Például egy $3$, $4$, $5$ oldalú háromszög területe $6$, a $9$, $12$, $15$ oldalú hasonló háromszögé $54 = 9 \cdot 6$.`,
    check: ['3^2', '9'] });

  add({ id: 'b-geo-tf-6', type: 'tf', topic: 'geometria', sub: 'transzformaciok', level: 2, title: 'Hasonló kockák',
    stmt: R`Két kocka térfogatának aránya $27$. Ekkor a nagyobbik kocka éle kilencszer akkora, mint a kisebbiké.`, truth: false,
    why: R`Hasonló testek térfogatának aránya a hasonlóság arányának köbe, ezért az élek aránya $\sqrt[3]{27} = 3$, nem $9$. Ellenőrzés: ha az élek aránya $9$ lenne, a térfogatok aránya $9^3 = 729$ volna.`,
    check: ['gyok(3;27)', '9'] });

  add({ id: 'b-geo-tf-7', type: 'tf', topic: 'geometria', sub: 'alakzatok', level: 3, title: 'Köré írt kör tompaszögű háromszögnél',
    stmt: R`Egy tompaszögű háromszög köré írt körének középpontja mindig a háromszög belsejében van.`, truth: false,
    why: R`Tompaszögű háromszögnél a köré írt kör középpontja a háromszögön kívül van. Például $A(0;0)$, $B(6;0)$, $C(3;1)$: a $C$-nél lévő szög tompa, mert $\overrightarrow{CA}\cdot\overrightarrow{CB} = (-3)\cdot 3 + (-1)\cdot(-1) = -8 < 0$. A középpont $(3;t)$ alakú, és $9 + t^2 = (t-1)^2$ miatt $t = -4$, tehát az $AB$ oldal túloldalán van.` });

  add({ id: 'b-geo-tf-8', type: 'tf', topic: 'geometria', sub: 'alakzatok', level: 2, title: 'Húrnégyszög paralelogramma',
    stmt: R`Ha egy paralelogramma húrnégyszög, akkor téglalap.`, truth: true,
    why: R`A paralelogramma szemközti szögei egyenlők, a húrnégyszög szemközti szögeinek összege $180^\circ$. Egyszerre mindkettő csak úgy teljesül, ha a szemközti szögek mind derékszögek, vagyis a négyszög minden szöge derékszög: téglalap.` });

  add({ id: 'b-geo-tf-9', type: 'tf', topic: 'geometria', sub: 'alakzatok', level: 2, title: 'Rombusz mint húrnégyszög',
    stmt: R`Minden rombusz húrnégyszög.`, truth: false,
    why: R`Egy rombusz szemközti szögei egyenlők, ezért csak akkor lehet a szemközti szögek összege $180^\circ$, ha mindegyik derékszög, azaz a rombusz négyzet. Ellenpélda: a $60^\circ$ és $120^\circ$ szögű rombuszban $60^\circ + 60^\circ = 120^\circ \ne 180^\circ$.` });

  add({ id: 'b-geo-tf-10', type: 'tf', topic: 'geometria', sub: 'alakzatok', level: 3, title: 'Thalész-tétel egy alakja',
    stmt: R`Az $ABC$ háromszög $AB$ oldalának felezőpontja $F$. Ha $CF = \dfrac{AB}{2}$, akkor a háromszög $C$-nél derékszögű.`, truth: true,
    why: R`Ekkor $FA = FB = FC$, tehát $C$ rajta van az $F$ középpontú, $AB$ átmérőjű körön. A Thalész-tétel szerint $ACB\angle = 90^\circ$. (Szögekkel: az $FAC$ és $FBC$ háromszögek egyenlő szárúak, így $\alpha + \beta = \gamma$, a szögösszegből $\gamma = 90^\circ$.)` });

  add({ id: 'b-geo-tf-11', type: 'tf', topic: 'geometria', sub: 'vektorok', level: 2, title: 'Skalárszorzat egyszerűsítése',
    stmt: R`Ha $\vec{a} \ne \vec{0}$ és $\vec{a}\cdot\vec{b} = \vec{a}\cdot\vec{c}$, akkor $\vec{b} = \vec{c}$.`, truth: false,
    why: R`A skalárszorzattal nem lehet "osztani". Ellenpélda: $\vec{a} = (1;0)$, $\vec{b} = (2;1)$, $\vec{c} = (2;5)$. Ekkor $\vec{a}\cdot\vec{b} = 2 = \vec{a}\cdot\vec{c}$, de $\vec{b} \ne \vec{c}$. Csak annyi következik, hogy $\vec{a}\cdot(\vec{b}-\vec{c}) = 0$, azaz $\vec{b}-\vec{c}$ merőleges az $\vec{a}$ vektorra.` });

  add({ id: 'b-geo-tf-12', type: 'tf', topic: 'geometria', sub: 'vektorok', level: 2, title: 'Vektor elforgatottja',
    stmt: R`Az $\vec{a} = (2;-3)$ vektor pozitív irányú (az óramutató járásával ellentétes) negyedfordulattal elforgatott képe a $(3;2)$ vektor.`, truth: true,
    why: R`Az $(x;y)$ vektor pozitív irányú negyedfordulattal elforgatott képe $(-y;x)$. Itt $x = 2$, $y = -3$, ezért az eredmény $(3;2)$. Ellenőrzés: $(2;-3)\cdot(3;2) = 6 - 6 = 0$, a hosszuk is egyenlő: $\sqrt{13}$.` });

  add({ id: 'b-geo-tf-13', type: 'tf', topic: 'geometria', sub: 'trigonometria', level: 3, title: 'Szinusztétel kétértelmű esete',
    stmt: R`Létezik két nem egybevágó háromszög, amelyben $a = 7$, $b = 10$ és az $a$ oldallal szemközti szög $\alpha = 30^\circ$.`, truth: true,
    why: R`A szinusztétel szerint $\sin\beta = \dfrac{10 \cdot \sin 30^\circ}{7} = \dfrac{5}{7} < 1$. Két szög adódik: $\beta_1 \approx 45{,}6^\circ$ és $\beta_2 = 180^\circ - \beta_1 \approx 134{,}4^\circ$. Mindkettő megfelel, mert $\beta_2 + \alpha \approx 164{,}4^\circ < 180^\circ$. (Szemléletesen: $b \sin\alpha = 5 < a = 7 < b = 10$.)` });

  add({ id: 'b-geo-tf-14', type: 'tf', topic: 'geometria', sub: 'trigonometria', level: 2, title: 'Oldalak négyzetösszege és a szög fajtája',
    stmt: R`Ha egy háromszögben $a^2 + b^2 < c^2$, akkor a $c$ oldallal szemközti szög hegyesszög.`, truth: false,
    why: R`A koszinusztétel szerint $\cos\gamma = \dfrac{a^2 + b^2 - c^2}{2ab}$, ami most negatív, ezért $\gamma$ tompaszög. Például a $2$, $2$, $3$ oldalú háromszögben $4 + 4 < 9$ és $\cos\gamma = -\dfrac{1}{8}$, azaz $\gamma \approx 97{,}2^\circ$.` });

  add({ id: 'b-geo-tf-15', type: 'tf', topic: 'geometria', sub: 'trigonometria', level: 2, title: 'Kétszeres szög koszinusza',
    stmt: R`Minden $\alpha$ szögre igaz, hogy $\cos 2\alpha = 1 - 2\sin^2\alpha$.`, truth: true,
    why: R`Az addíciós tételből $\cos 2\alpha = \cos^2\alpha - \sin^2\alpha$. Mivel $\cos^2\alpha = 1 - \sin^2\alpha$, ebből $\cos 2\alpha = 1 - 2\sin^2\alpha$.`,
    check: ['cos(2a)', '1-2*sin(a)^2'] });

  add({ id: 'b-geo-tf-16', type: 'tf', topic: 'geometria', sub: 'koordgeo', level: 2, title: 'Másodfokú egyenlet és kör',
    stmt: R`Az $x^2 + y^2 - 4x + 6y + 20 = 0$ egyenlet egy kör egyenlete.`, truth: false,
    why: R`Teljes négyzetté alakítva: $(x-2)^2 + (y+3)^2 = 4 + 9 - 20 = -7$. A bal oldal nemnegatív, a jobb oldal negatív, ezért nincs olyan pont, amely kielégítené: az egyenlet nem kör egyenlete (az üres halmazt adja).` });

  add({ id: 'b-geo-tf-17', type: 'tf', topic: 'geometria', sub: 'koordgeo', level: 2, title: 'Egyenesek merőlegessége',
    stmt: R`A $2x - 3y = 7$ és a $3x + 2y = 1$ egyenletű egyenesek merőlegesek egymásra.`, truth: true,
    why: R`A normálvektoraik $(2;-3)$ és $(3;2)$. Skalárszorzatuk $2\cdot3 + (-3)\cdot2 = 0$, ezért a normálvektorok merőlegesek, így az egyenesek is. (A meredekségek: $\frac{2}{3}$ és $-\frac{3}{2}$, szorzatuk $-1$.)`,
    check: ['2*3+(-3)*2', '0'] });

  add({ id: 'b-geo-tf-18', type: 'tf', topic: 'geometria', sub: 'koordgeo', level: 3, title: 'Érintő egyenlete',
    stmt: R`A $(x-1)^2 + (y+2)^2 = 25$ egyenletű kör $P(4;2)$ pontjában húzott érintőjének egyenlete $3x + 4y = 20$.`, truth: true,
    why: R`A $P$ pont rajta van a körön: $3^2 + 4^2 = 25$. A kör középpontja $K(1;-2)$, így $\overrightarrow{KP} = (3;4)$ az érintő normálvektora, az egyenlet $3x + 4y = 3\cdot4 + 4\cdot2 = 20$.` });

  add({ id: 'b-geo-tf-19', type: 'tf', topic: 'geometria', sub: 'keruletterulet', level: 2, title: 'A 13, 14, 15 oldalú háromszög beírt köre',
    stmt: R`A $13$, $14$ és $15$ egység oldalú háromszög beírt körének sugara $4$ egység.`, truth: true,
    why: R`A félkerület $s = 21$, a Heron-képlet szerint $t = \sqrt{21\cdot8\cdot7\cdot6} = \sqrt{7056} = 84$. A $t = sr$ összefüggésből $r = \dfrac{84}{21} = 4$.`,
    check: ['84/21', '4'] });

  add({ id: 'b-geo-tf-20', type: 'tf', topic: 'geometria', sub: 'keruletterulet', level: 2, title: 'Körcikk területe az ívhosszal',
    stmt: R`Egy $r$ sugarú körben az $i$ hosszúságú körívhez tartozó körcikk területe $i \cdot r$.`, truth: false,
    why: R`A helyes képlet $t = \dfrac{i \cdot r}{2}$. Ellenpélda: félkörnél $i = \pi r$, és a félkör területe $\dfrac{\pi r^2}{2}$, nem $\pi r^2$.`,
    check: ['i*r/2', 'i*r'] });

  add({ id: 'b-geo-tf-21', type: 'tf', topic: 'geometria', sub: 'felszinterfogat', level: 1, title: 'Kúp és henger térfogata',
    stmt: R`Egy forgáskúp térfogata harmada a vele azonos alapkörű és azonos magasságú forgáshenger térfogatának.`, truth: true,
    why: R`A kúp térfogata $V_k = \dfrac{r^2\pi m}{3}$, a hengeré $V_h = r^2\pi m$, ezért $V_k = \dfrac{1}{3}V_h$.` });

  add({ id: 'b-geo-tf-22', type: 'tf', topic: 'geometria', sub: 'felszinterfogat', level: 3, title: 'Csonkagúla térfogata',
    stmt: R`Az $m$ magasságú csonkagúla térfogata $\dfrac{(T + t)\,m}{2}$, ahol $T$ az alaplap, $t$ a fedőlap területe.`, truth: false,
    why: R`A helyes képlet $V = \dfrac{m}{3}\left(T + \sqrt{Tt} + t\right)$. Ellenpélda: négyzet alapú csonkagúla, alapélek $6$ és $3$, $m = 4$. Ekkor $T = 36$, $t = 9$, a helyes térfogat $\dfrac{4}{3}(36 + 18 + 9) = 84$, a megadott képlet viszont a $\dfrac{45 \cdot 4}{2} = 90$ értéket adná.` });

  /* ===== HIBAVADÁSZ ===== */

  add({ id: 'b-geo-spot-1', type: 'spot', topic: 'geometria', sub: 'trigonometria', level: 2, title: 'Koszinusztétel tompaszöggel',
    problem: R`Egy háromszög két oldala $5$ és $8$ egység, a közbezárt szög $120^\circ$. Mekkora a harmadik oldal?`,
    lines: [R`A koszinusztétel szerint $c^2 = a^2 + b^2 - 2ab\cos\gamma$, ahol $a = 5$, $b = 8$, $\gamma = 120^\circ$.`,
            R`A $120^\circ$ koszinusza: $\cos 120^\circ = \dfrac{1}{2}$.`,
            R`Behelyettesítve: $c^2 = 25 + 64 - 2\cdot5\cdot8\cdot\dfrac{1}{2} = 49$.`,
            R`Tehát $c = 7$ egység.`],
    wrong: 1,
    why: R`Tompaszög koszinusza negatív: $\cos 120^\circ = -\cos 60^\circ = -\dfrac{1}{2}$. A tanuló a $60^\circ$ értékét használta, ezért a harmadik oldal a $60^\circ$ szöghöz tartozó $7$ lett.`,
    fix: R`$\cos 120^\circ = -\dfrac{1}{2}$, ezért $c^2 = 25 + 64 + 40 = 129$, azaz $c = \sqrt{129} \approx 11{,}4$ egység.`,
    wrongCheck: ['cos(2*pi/3)', '1/2'], fixCheck: ['cos(2*pi/3)', '-1/2'] });

  add({ id: 'b-geo-spot-2', type: 'spot', topic: 'geometria', sub: 'transzformaciok', level: 1, title: 'Hasonló háromszög területe',
    problem: R`Két hasonló háromszög közül a kisebb oldalai $3$, $4$ és $5$ egység hosszúak. A nagyobb háromszög legrövidebb oldala $9$ egység. Mekkora a nagyobb háromszög területe?`,
    lines: [R`A hasonlóság aránya a megfelelő oldalak aránya: $\lambda = \dfrac{9}{3} = 3$.`,
            R`A kisebb háromszög derékszögű ($3^2 + 4^2 = 5^2$), területe $\dfrac{3\cdot4}{2} = 6$.`,
            R`A területek aránya egyenlő a hasonlóság arányával, így $T = 3 \cdot 6$.`,
            R`A nagyobb háromszög területe $18$ területegység.`],
    wrong: 2,
    why: R`Hasonló síkidomok területének aránya a hasonlóság arányának négyzete, nem maga az arány. A tanuló $\lambda$-t használta $\lambda^2$ helyett. (Ellenőrzés: a nagyobb háromszög $9$, $12$, $15$ oldalú, területe $\frac{9\cdot12}{2} = 54$.)`,
    fix: R`A területarány $\lambda^2 = 9$, ezért $T = 9 \cdot 6 = 54$ területegység.`,
    wrongCheck: ['3', '3^2'], fixCheck: ['3^2*6', '54'] });

  add({ id: 'b-geo-spot-3', type: 'spot', topic: 'geometria', sub: 'koordgeo', level: 2, title: 'Kör egyenletének átalakítása',
    problem: R`Határozd meg az $x^2 + y^2 - 6x + 4y - 12 = 0$ egyenletű kör középpontját és sugarát.`,
    lines: [R`Rendezzük az egyenletet: $x^2 - 6x + y^2 + 4y = 12$.`,
            R`Teljes négyzetté alakítunk: $x^2 - 6x = (x-3)^2 - 3$ és $y^2 + 4y = (y+2)^2 - 2$.`,
            R`Így $(x-3)^2 + (y+2)^2 = 12 + 3 + 2 = 17$.`,
            R`A kör középpontja $(3;-2)$, sugara $\sqrt{17}$.`],
    wrong: 1,
    why: R`A teljes négyzetté alakításnál a lineáris tag együtthatójának feléről a négyzetet kell levonni: $(x-3)^2 = x^2 - 6x + 9$, ezért $x^2 - 6x = (x-3)^2 - 9$, és hasonlóan $y^2 + 4y = (y+2)^2 - 4$. A tanuló csak az együttható felét vonta le.`,
    fix: R`$x^2 - 6x = (x-3)^2 - 9$ és $y^2 + 4y = (y+2)^2 - 4$, ezért $(x-3)^2 + (y+2)^2 = 12 + 9 + 4 = 25$. A középpont $(3;-2)$, a sugár $5$.`,
    wrongCheck: ['x^2-6x', '(x-3)^2-3'], fixCheck: ['x^2-6x', '(x-3)^2-9'] });

  add({ id: 'b-geo-spot-4', type: 'spot', topic: 'geometria', sub: 'koordgeo', level: 2, title: 'Irányvektor és normálvektor',
    problem: R`Írd fel az $A(1;2)$ ponton átmenő, $\vec{v} = (3;-1)$ irányvektorú egyenes egyenletét.`,
    lines: [R`Ha az egyenes normálvektora $\vec{n} = (A;B)$ és átmegy az $(x_0;y_0)$ ponton, akkor egyenlete $Ax + By = Ax_0 + By_0$.`,
            R`A megadott $(3;-1)$ vektort használjuk normálvektornak: $\vec{n} = (3;-1)$.`,
            R`Behelyettesítve: $3x - y = 3\cdot1 - 2 = 1$.`,
            R`Az egyenes egyenlete $3x - y = 1$.`],
    wrong: 1,
    why: R`A $(3;-1)$ vektor irányvektor, nem normálvektor: az egyenessel párhuzamos, nem merőleges rá. Normálvektornak a rá merőleges vektort kell venni, például az $(1;3)$ vektort, mert $(3;-1)\cdot(1;3) = 0$.`,
    fix: R`A normálvektor $\vec{n} = (1;3)$, ezért az egyenlet $x + 3y = 1\cdot1 + 3\cdot2 = 7$.`,
    wrongCheck: ['3*3+(-1)*(-1)', '0'], fixCheck: ['1*3+3*(-1)', '0'] });

  add({ id: 'b-geo-spot-5', type: 'spot', topic: 'geometria', sub: 'felszinterfogat', level: 2, title: 'Gúla térfogata',
    problem: R`Egy négyzet alapú egyenes gúla alapéle $6$, magassága $4$ egység. Számítsd ki a térfogatát és a felszínét.`,
    lines: [R`Az alap területe: $T = 6^2 = 36$.`,
            R`Az oldallap magassága a talppont és az alapél felezőpontja közti $3$ egység, valamint a $4$ egység magasság derékszögű háromszögéből: $h = \sqrt{3^2 + 4^2} = 5$.`,
            R`A térfogat: $V = T \cdot m = 36 \cdot 4 = 144$.`,
            R`A felszín: $A = 36 + 4\cdot\dfrac{6\cdot5}{2} = 96$.`,
            R`Tehát $V = 144$ és $A = 96$.`],
    wrong: 2,
    why: R`A gúla térfogata $V = \dfrac{T \cdot m}{3}$: a tanuló a hasábra vonatkozó $T \cdot m$ képletet használta, kimaradt az $\dfrac{1}{3}$ szorzó.`,
    fix: R`$V = \dfrac{36 \cdot 4}{3} = 48$ köbegység. A felszín változatlanul $A = 96$ négyzetegység.`,
    wrongCheck: ['36*4', '36*4/3'], fixCheck: ['36*4/3', '48'] });

  add({ id: 'b-geo-spot-6', type: 'spot', topic: 'geometria', sub: 'felszinterfogat', level: 2, title: 'Gúla oldallapjainak magassága',
    problem: R`Egy négyzet alapú egyenes gúla alapéle $10$, magassága $12$ egység. Mekkora a felszíne?`,
    lines: [R`Az alap területe: $T = 10^2 = 100$.`,
            R`Az oldallapok egyenlő szárú háromszögek, alapjuk $10$, magasságuk a gúla magassága: $12$.`,
            R`Egy oldallap területe: $\dfrac{10 \cdot 12}{2} = 60$.`,
            R`Négy oldallap együtt: $4 \cdot 60 = 240$.`,
            R`A felszín: $A = 100 + 240 = 340$.`],
    wrong: 1,
    why: R`A gúla magassága (testmagasság) az alaplapra merőleges, nem az oldallap magassága. Az oldallap magassága ennél hosszabb: a testmagasság és az alapél fele által alkotott derékszögű háromszög átfogója.`,
    fix: R`Az oldallap magassága $h = \sqrt{5^2 + 12^2} = 13$, egy oldallap területe $\dfrac{10\cdot13}{2} = 65$. A felszín: $A = 100 + 4\cdot65 = 360$ négyzetegység.`,
    wrongCheck: ['12', 'sqrt(5^2+12^2)'], fixCheck: ['13', 'sqrt(5^2+12^2)'] });

  add({ id: 'b-geo-spot-7', type: 'spot', topic: 'geometria', sub: 'vektorok', level: 2, title: 'Vektorok hajlásszöge',
    problem: R`Mekkora szöget zár be az $\vec{a} = (2;1)$ és a $\vec{b} = (1;3)$ vektor?`,
    lines: [R`A hajlásszög koszinusza: $\cos\varphi = \dfrac{\vec{a}\cdot\vec{b}}{|\vec{a}|\,|\vec{b}|}$.`,
            R`A skalárszorzat: $\vec{a}\cdot\vec{b} = 2\cdot1 + 1\cdot3 = 5$.`,
            R`A hosszak: $|\vec{a}| = 2^2 + 1^2 = 5$ és $|\vec{b}| = 1^2 + 3^2 = 10$.`,
            R`Ezért $\cos\varphi = \dfrac{5}{5 \cdot 10} = \dfrac{1}{10}$.`,
            R`Így $\varphi \approx 84{,}3^\circ$.`],
    wrong: 2,
    why: R`A vektor hossza a koordináták négyzetösszegének négyzetgyöke: $|\vec{a}| = \sqrt{2^2 + 1^2}$. A tanuló a gyökvonást kihagyta.`,
    fix: R`$|\vec{a}| = \sqrt{5}$, $|\vec{b}| = \sqrt{10}$, szorzatuk $\sqrt{50} = 5\sqrt{2}$. Ezért $\cos\varphi = \dfrac{5}{5\sqrt{2}} = \dfrac{\sqrt{2}}{2}$, azaz $\varphi = 45^\circ$.`,
    wrongCheck: ['2^2+1^2', 'sqrt(2^2+1^2)'], fixCheck: ['sqrt(2^2+1^2)*sqrt(1^2+3^2)', '5*sqrt(2)'] });

  add({ id: 'b-geo-spot-8', type: 'spot', topic: 'geometria', sub: 'trigonometria', level: 3, title: 'Szinusztétel és a második megoldás',
    problem: R`Egy háromszögben $a = 6$, $b = 3\sqrt{6}$ és $\alpha = 45^\circ$. Határozd meg a háromszög többi szögét.`,
    lines: [R`A szinusztétel szerint $\dfrac{\sin\beta}{b} = \dfrac{\sin\alpha}{a}$.`,
            R`Ebből $\sin\beta = \dfrac{3\sqrt{6}\cdot\frac{\sqrt{2}}{2}}{6} = \dfrac{\sqrt{3}}{2}$.`,
            R`Ebből $\beta = 60^\circ$, a $120^\circ$ már nem jöhet szóba, mert $\alpha + \beta$ akkor $180^\circ$ lenne.`,
            R`Ekkor $\gamma = 180^\circ - 45^\circ - 60^\circ = 75^\circ$.`,
            R`A háromszög szögei $45^\circ$, $60^\circ$ és $75^\circ$, ez az egyetlen megoldás.`],
    wrong: 2,
    why: R`A $\sin\beta = \frac{\sqrt{3}}{2}$ egyenletnek két megoldása van $0^\circ$ és $180^\circ$ között: $60^\circ$ és $120^\circ$. A $120^\circ$ sem zárható ki: $45^\circ + 120^\circ = 165^\circ < 180^\circ$, így ilyen háromszög is létezik.`,
    fix: R`Két megoldás van. Ha $\beta = 60^\circ$, akkor $\gamma = 75^\circ$. Ha $\beta = 120^\circ$, akkor $\gamma = 180^\circ - 45^\circ - 120^\circ = 15^\circ$.`,
    wrongCheck: ['2*pi/3+pi/4', 'pi'], fixCheck: ['sin(2*pi/3)', 'sin(pi/3)'] });

  add({ id: 'b-geo-spot-9', type: 'spot', topic: 'geometria', sub: 'keruletterulet', level: 1, title: 'Körív hossza',
    problem: R`Egy $6$ cm sugarú körben a középponti szög $60^\circ$. Mekkora a hozzá tartozó körív hossza?`,
    lines: [R`Az ív hossza $i = r\alpha$, ahol $\alpha$ a középponti szög radiánban.`,
            R`A szög $\alpha = 60$, a sugár $r = 6$ cm.`,
            R`Így $i = 6 \cdot 60 = 360$ cm.`,
            R`A körív hossza $360$ cm.`],
    wrong: 1,
    why: R`A $60$ a szög fokban mért értéke, de az $i = r\alpha$ képlethez radián kell. A tanuló keverte a fokot és a radiánt.`,
    fix: R`$\alpha = 60^\circ = \dfrac{\pi}{3}$, ezért $i = 6 \cdot \dfrac{\pi}{3} = 2\pi \approx 6{,}28$ cm.`,
    wrongCheck: ['60', 'pi/3'], fixCheck: ['60*pi/180', 'pi/3'] });

  add({ id: 'b-geo-spot-10', type: 'spot', topic: 'geometria', sub: 'alakzatok', level: 1, title: 'Sokszög átlói és szögösszege',
    problem: R`Egy konvex sokszögnek $35$ átlója van. Mekkora a belső szögeinek összege?`,
    lines: [R`Az $n$ oldalú konvex sokszög átlóinak száma $\dfrac{n(n-3)}{2}$.`,
            R`Az $\dfrac{n(n-3)}{2} = 35$ egyenletből $n^2 - 3n - 70 = 0$.`,
            R`A gyökök $n = 10$ és $n = -7$. Az oldalak száma pozitív, ezért $n = 10$.`,
            R`A belső szögek összege $n \cdot 180^\circ = 1800^\circ$.`],
    wrong: 3,
    why: R`A konvex $n$-szög belső szögeinek összege $(n-2)\cdot180^\circ$: a sokszög az egyik csúcsából húzott átlókkal $n-2$ háromszögre bontható. A tanuló az $n\cdot180^\circ$ értéket számolta ki.`,
    fix: R`A belső szögek összege $(10-2)\cdot180^\circ = 1440^\circ$.`,
    wrongCheck: ['10*180', '(10-2)*180'], fixCheck: ['(10-2)*180', '1440'] });

  /* ===== SORBA RENDEZÉS ===== */

  add({ id: 'b-geo-ord-1', type: 'order', topic: 'geometria', sub: 'alakzatok', level: 2, title: 'A Thalész-tétel bizonyítása',
    claim: R`Rendezd sorba a Thalész-tétel bizonyításának lépéseit: ha a $C$ pont az $AB$ átmérőjű kör egy pontja ($C \ne A, B$), akkor $ACB\angle = 90^\circ$.`,
    steps: [R`Legyen $O$ a kör középpontja, vagyis az $AB$ szakasz felezőpontja, és kössük össze $C$-t $O$-val.`,
            R`Az $OA$, $OB$ és $OC$ a kör sugarai, ezért egyenlők, így az $OAC$ és az $OBC$ háromszög egyenlő szárú.`,
            R`Az alapon fekvő szögek egyenlők: $\angle OAC = \angle OCA = \alpha$ és $\angle OBC = \angle OCB = \beta$.`,
            R`Az $ABC$ háromszög szögei $\alpha$, $\beta$ és $\angle ACB = \alpha + \beta$, mert az $OC$ szakasz az $ACB$ szögön belül halad.`,
            R`A szögösszeg: $\alpha + \beta + (\alpha + \beta) = 180^\circ$, tehát $\alpha + \beta = 90^\circ$, azaz $ACB\angle = 90^\circ$.`],
    note: R`A bizonyítás kulcsa a két egyenlő szárú háromszög, amelyeket a sugarak alkotnak.` });

  add({ id: 'b-geo-ord-2', type: 'order', topic: 'geometria', sub: 'alakzatok', level: 2, title: 'A Pitagorasz-tétel bizonyítása területtel',
    claim: R`Rendezd sorba a Pitagorasz-tétel területekkel végzett bizonyításának lépéseit.`,
    steps: [R`Vegyünk négy egybevágó derékszögű háromszöget, befogóik $a$ és $b$, átfogójuk $c$.`,
            R`Rakjuk össze őket egy $a+b$ oldalú négyzetté úgy, hogy az átfogók közrefognak egy belső négyszöget; ez egy $c$ oldalú négyzet.`,
            R`A nagy négyzet területét kétféleképpen számoljuk ki: $(a+b)^2$, illetve $4\cdot\dfrac{ab}{2} + c^2$.`,
            R`A két kifejezés egyenlő: $a^2 + 2ab + b^2 = 2ab + c^2$.`,
            R`Mindkét oldalból kivonjuk a $2ab$ tagot, így kapjuk: $a^2 + b^2 = c^2$.`],
    note: R`A bizonyítás ugyanazt a területet két különböző módon fejezi ki.` });

  add({ id: 'b-geo-ord-3', type: 'order', topic: 'geometria', sub: 'trigonometria', level: 3, title: 'A koszinusztétel bizonyítása',
    claim: R`Rendezd sorba a koszinusztétel koordinátageometriai bizonyításának lépéseit: az $ABC$ háromszögben $c^2 = a^2 + b^2 - 2ab\cos\gamma$.`,
    steps: [R`Helyezzük a háromszöget koordináta-rendszerbe: $C = (0;0)$, $B = (a;0)$ és $A = (b\cos\gamma;\ b\sin\gamma)$.`,
            R`A $c$ oldal az $A$ és $B$ pont távolsága, ezért $c^2 = (a - b\cos\gamma)^2 + (b\sin\gamma)^2$.`,
            R`A zárójelet felbontva: $c^2 = a^2 - 2ab\cos\gamma + b^2\cos^2\gamma + b^2\sin^2\gamma$.`,
            R`A $b^2$ közös tényezőt kiemelve és felhasználva, hogy $\cos^2\gamma + \sin^2\gamma = 1$: $b^2\cos^2\gamma + b^2\sin^2\gamma = b^2$.`,
            R`Ezért $c^2 = a^2 + b^2 - 2ab\cos\gamma$.`],
    note: R`A bizonyítás tompaszögű $\gamma$-ra is érvényes, mert a koordináták előjelesek.` });

  add({ id: 'b-geo-ord-4', type: 'order', topic: 'geometria', sub: 'trigonometria', level: 2, title: 'Háromszög megoldásának lépései',
    claim: R`Egy háromszögben $a = 5$, $b = 8$ és a közbezárt szög $\gamma = 60^\circ$. Rendezd sorba a háromszög megoldásának lépéseit.`,
    steps: [R`Két oldal és a közbezárt szög ismert, ezért koszinusztétellel számoljuk a harmadik oldalt: $c^2 = 25 + 64 - 2\cdot5\cdot8\cdot\dfrac{1}{2} = 49$, tehát $c = 7$.`,
            R`A szinusztétellel kiszámoljuk a kisebbik oldallal szemközti szög szinuszát: $\sin\alpha = \dfrac{a\sin\gamma}{c} = \dfrac{5\sqrt{3}}{14}$.`,
            R`Mivel $a < b$, az $\alpha$ szög hegyesszög, így az egyértelmű megoldás $\alpha \approx 38{,}2^\circ$.`,
            R`A harmadik szöget a szögösszegből kapjuk: $\beta = 180^\circ - 60^\circ - 38{,}2^\circ \approx 81{,}8^\circ$.`],
    note: R`Először a koszinusztételt használjuk, mert utána már a szinusztétel is felírható, és a kisebb oldallal szemközti szög biztosan hegyesszög.` });

  add({ id: 'b-geo-ord-5', type: 'order', topic: 'geometria', sub: 'koordgeo', level: 2, title: 'A kör egyenletének levezetése',
    claim: R`Rendezd sorba a kör egyenletének levezetését: a $K(u;v)$ középpontú, $r$ sugarú kör egyenlete.`,
    steps: [R`Legyen $P(x;y)$ a sík tetszőleges pontja.`,
            R`A $P$ pont akkor és csak akkor van a körön, ha a $K$ ponttól mért távolsága $r$: $KP = r$.`,
            R`A távolságot koordinátákkal felírva: $\sqrt{(x-u)^2 + (y-v)^2} = r$.`,
            R`Mindkét oldal nemnegatív, ezért a négyzetre emelés ekvivalens átalakítás: $(x-u)^2 + (y-v)^2 = r^2$.`,
            R`Az origó középpontú esetben ($u = v = 0$) ez az $x^2 + y^2 = r^2$ egyenlet.`],
    note: R`A kör egyenlete a távolság definíciójából következik.` });

  add({ id: 'b-geo-ord-6', type: 'order', topic: 'geometria', sub: 'koordgeo', level: 3, title: 'A kör érintőjének egyenlete',
    claim: R`Rendezd sorba a $K(u;v)$ középpontú, $r$ sugarú kör $P(x_0;y_0)$ pontjában húzott érintője egyenletének levezetését.`,
    steps: [R`Az érintő merőleges a $KP$ sugárra, ezért a $\overrightarrow{KP} = (x_0 - u;\ y_0 - v)$ vektor az érintő normálvektora.`,
            R`Az érintő egy tetszőleges $X(x;y)$ pontjára $\overrightarrow{PX} \perp \overrightarrow{KP}$, azaz $\overrightarrow{KP}\cdot\overrightarrow{PX} = 0$.`,
            R`Koordinátákkal felírva: $(x_0 - u)(x - x_0) + (y_0 - v)(y - y_0) = 0$.`,
            R`Az $x - x_0 = (x - u) - (x_0 - u)$ és $y - y_0 = (y - v) - (y_0 - v)$ átírással: $(x_0 - u)(x - u) + (y_0 - v)(y - v) = (x_0 - u)^2 + (y_0 - v)^2$.`,
            R`A $P$ a körön van, ezért a jobb oldal $r^2$: az érintő egyenlete $(x_0 - u)(x - u) + (y_0 - v)(y - v) = r^2$.`],
    note: R`Az utolsó lépés a $P$ pont körhöz tartozását használja fel.` });

  add({ id: 'b-geo-ord-7', type: 'order', topic: 'geometria', sub: 'transzformaciok', level: 3, title: 'A belső szögfelező tétel bizonyítása',
    claim: R`Rendezd sorba a belső szögfelező tétel bizonyításának lépéseit: ha az $ABC$ háromszög $A$-nál lévő szögének felezője a $BC$ oldalt $D$-ben metszi, akkor $\dfrac{BD}{DC} = \dfrac{AB}{AC}$.`,
    steps: [R`Húzzunk $C$-n át párhuzamost az $AD$ szögfelezővel; ez az $AB$ egyenest az $A$ csúcson túl az $E$ pontban metszi. Legyen $\angle BAD = \angle DAC = \varphi$.`,
            R`Az $AD \parallel EC$ miatt $\angle AEC = \angle BAD = \varphi$ (egyállású szögek) és $\angle ACE = \angle DAC = \varphi$ (váltószögek).`,
            R`Az $AEC$ háromszögben két szög egyenlő, ezért egyenlő szárú: $AE = AC$.`,
            R`A $B$ csúcsú szög szárait az $AD$ és $EC$ párhuzamosok metszik, ezért a párhuzamos szelők tétele szerint $\dfrac{BD}{DC} = \dfrac{BA}{AE}$, és $AE = AC$ miatt $\dfrac{BD}{DC} = \dfrac{AB}{AC}$.`],
    note: R`A segédvonal célja, hogy a szögfelezőből párhuzamos szelőket és egyenlő szárú háromszöget kapjunk.` });

  /* ===== VEZETETT MEGOLDÁS ===== */

  add({ id: 'b-geo-gui-1', type: 'guided', topic: 'geometria', sub: 'trigonometria', level: 2, title: 'Háromszög megoldása',
    problem: R`Az $ABC$ háromszögben $BC = a = 5$, $CA = b = 8$ egység, a $C$ csúcsnál lévő szög $\gamma = 60^\circ$. Határozd meg a háromszög $c = AB$ oldalát, legkisebb szögét, területét és köré írt körének sugarát.`,
    steps: [
      { q: R`Mekkora a $c = AB$ oldal?`, answer: { type: 'num', value: 7 }, ansTex: R`c = 7`, verify: 'sqrt(5^2+8^2-2*5*8*cos(pi/3))',
        hint: R`Két oldal és a közbezárt szög ismert: használd a koszinusztételt.`, expl: R`$c^2 = 25 + 64 - 2\cdot5\cdot8\cdot\cos 60^\circ = 89 - 40 = 49$, ezért $c = 7$.` },
      { q: R`Melyik szög a háromszög legkisebb szöge?`, answer: { type: 'choice', options: [R`$\alpha$ (az $a = 5$ oldallal szemközti)`, R`$\beta$ (a $b = 8$ oldallal szemközti)`, R`$\gamma$ (a $c = 7$ oldallal szemközti)`], correct: 0 },
        hint: R`Hasonlítsd össze az oldalak hosszát: a kisebb oldallal szemben kisebb szög van.`, expl: R`Az oldalak $5$, $8$ és $7$; a legkisebb oldal az $a = 5$, így vele szemben van a legkisebb szög, $\alpha$.` },
      { q: R`Mennyi $\sin\alpha$? Négy tizedesre kerekítve add meg.`, answer: { type: 'num', value: 0.6186, tol: 0.0001 }, ansTex: R`\sin\alpha = \dfrac{5\sqrt{3}}{14} \approx 0{,}6186`, verify: '5*sin(pi/3)/7',
        hint: R`Szinusztétel: $\dfrac{\sin\alpha}{a} = \dfrac{\sin\gamma}{c}$.`, expl: R`$\sin\alpha = \dfrac{5\sin 60^\circ}{7} = \dfrac{5\sqrt{3}}{14} \approx 0{,}6186$. Mivel $\alpha$ a legkisebb szög, hegyesszög, ezért $\alpha \approx 38{,}2^\circ$.` },
      { q: R`Mekkora a háromszög területe? Két tizedesre kerekítve add meg.`, answer: { type: 'num', value: 17.32, tol: 0.01 }, ansTex: R`t = 10\sqrt{3} \approx 17{,}32`, verify: '5*8*sin(pi/3)/2',
        hint: R`Két oldal és a közbezárt szög ismert: $t = \dfrac{ab\sin\gamma}{2}$.`, expl: R`$t = \dfrac{5\cdot8\cdot\sin 60^\circ}{2} = 10\sqrt{3} \approx 17{,}32$.` },
      { q: R`Mekkora a köré írt kör sugara? Két tizedesre kerekítve add meg.`, answer: { type: 'num', value: 4.04, tol: 0.01 }, ansTex: R`R = \dfrac{7}{\sqrt{3}} \approx 4{,}04`, verify: '7/(2*sin(pi/3))',
        hint: R`A kiterjesztett szinusztétel: $\dfrac{c}{\sin\gamma} = 2R$.`, expl: R`$2R = \dfrac{7}{\sin 60^\circ} = \dfrac{14}{\sqrt{3}}$, ezért $R = \dfrac{7}{\sqrt{3}} \approx 4{,}04$.` }],
    final: R`$c = 7$, a legkisebb szög $\alpha \approx 38{,}2^\circ$, a terület $10\sqrt{3} \approx 17{,}32$, a köré írt kör sugara $\dfrac{7}{\sqrt{3}} \approx 4{,}04$ egység.` });

  add({ id: 'b-geo-gui-2', type: 'guided', topic: 'geometria', sub: 'koordgeo', level: 2, title: 'Kör és egyenes metszéspontjai',
    problem: R`Határozd meg az $x^2 + y^2 = 25$ egyenletű kör és az $x + y = 7$ egyenletű egyenes közös pontjait, valamint a közös pontok által meghatározott húr hosszát.`,
    steps: [
      { q: R`Fejezd ki $y$-t az egyenes egyenletéből, $x$ segítségével.`, answer: { type: 'expr', expr: '7-x' }, ansTex: R`y = 7 - x`, verify: '7-x',
        hint: R`Az $x + y = 7$ egyenletet rendezd $y$-ra.`, expl: R`Az $x + y = 7$ egyenletből $y = 7 - x$.` },
      { q: R`Helyettesítsd be a kör egyenletébe. A rendezés és a $2$ közös osztóval való egyszerűsítés után az $x^2 - 7x + 12 = 0$ egyenletet kapod. Mik a gyökei?`, answer: { type: 'set', values: [3, 4] }, ansTex: R`x_1 = 3,\ x_2 = 4`, verify: ['(7-sqrt(49-48))/2', '(7+sqrt(49-48))/2'],
        hint: R`$x^2 + (7-x)^2 = 25$, ebből $2x^2 - 14x + 24 = 0$. Használd a megoldóképletet.`, expl: R`$D = 49 - 48 = 1$, ezért $x_{1,2} = \dfrac{7 \pm 1}{2}$, azaz $x_1 = 3$ és $x_2 = 4$. A megfelelő $y$ értékek $4$ és $3$: a metszéspontok $(3;4)$ és $(4;3)$.` },
      { q: R`Mekkora a kör középpontjának távolsága az egyenestől? Két tizedesre kerekítve add meg.`, answer: { type: 'num', value: 4.95, tol: 0.01 }, ansTex: R`d = \dfrac{7}{\sqrt{2}} \approx 4{,}95`, verify: '7/sqrt(2)',
        hint: R`Az $x + y - 7 = 0$ egyenes és az origó távolsága: $\dfrac{|0 + 0 - 7|}{\sqrt{1^2 + 1^2}}$.`, expl: R`$d = \dfrac{7}{\sqrt{2}} \approx 4{,}95$. Ez kisebb, mint a sugár ($5$), ezért az egyenes valóban két pontban metszi a kört.` },
      { q: R`Mekkora a húr hossza? Két tizedesre kerekítve add meg.`, answer: { type: 'num', value: 1.41, tol: 0.01 }, ansTex: R`2\sqrt{25 - \dfrac{49}{2}} = \sqrt{2} \approx 1{,}41`, verify: '2*sqrt(25-49/2)',
        hint: R`A húr felének, a távolságnak és a sugárnak derékszögű háromszöget alkot: a húr fele $\sqrt{r^2 - d^2}$.`, expl: R`$\sqrt{25 - \frac{49}{2}} = \sqrt{\frac{1}{2}}$, ezért a húr hossza $2\sqrt{\frac{1}{2}} = \sqrt{2} \approx 1{,}41$. Ez megegyezik a $(3;4)$ és $(4;3)$ pont távolságával.` }],
    final: R`A közös pontok: $(3;4)$ és $(4;3)$, a húr hossza $\sqrt{2} \approx 1{,}41$ egység.` });

  add({ id: 'b-geo-gui-3', type: 'guided', topic: 'geometria', sub: 'koordgeo', level: 2, title: 'Érintő egyenlete',
    problem: R`Írd fel az $(x+1)^2 + (y-2)^2 = 25$ egyenletű kör $P(2;-2)$ pontjában húzott érintőjének egyenletét.`,
    steps: [
      { q: R`Mekkora a kör sugara?`, answer: { type: 'num', value: 5 }, ansTex: 'r = 5', verify: 'sqrt(25)',
        hint: R`Az egyenlet $(x-u)^2 + (y-v)^2 = r^2$ alakú.`, expl: R`A jobb oldal $r^2 = 25$, ezért $r = 5$. A középpont $K(-1;2)$. A $P$ pont rajta van a körön: $3^2 + (-4)^2 = 25$.` },
      { q: R`Melyik vektor az érintő egy normálvektora?`, answer: { type: 'choice', options: [R`$(3;-4)$, azaz $\overrightarrow{KP}$`, R`$(4;3)$`, R`$(-1;2)$, azaz $\overrightarrow{OK}$`], correct: 0 },
        hint: R`Az érintő merőleges az érintési pontba húzott sugárra.`, expl: R`Az érintő merőleges a $KP$ sugárra, ezért $\overrightarrow{KP} = (2-(-1);\ -2-2) = (3;-4)$ az érintő normálvektora.` },
      { q: R`Az érintő egyenlete $3x - 4y = c$ alakú. Mennyi $c$ értéke?`, answer: { type: 'num', value: 14 }, ansTex: 'c = 14', verify: '3*2-4*(-2)',
        hint: R`Az érintő átmegy a $P(2;-2)$ ponton: helyettesítsd be.`, expl: R`$c = 3\cdot2 - 4\cdot(-2) = 6 + 8 = 14$.` },
      { q: R`Hol metszi az érintő az $y$ tengelyt? Add meg a metszéspont $y$ koordinátáját.`, answer: { type: 'num', value: -3.5 }, ansTex: R`y = -3{,}5`, verify: '14/(-4)',
        hint: R`Az $y$ tengelyen $x = 0$.`, expl: R`$x = 0$ esetén $-4y = 14$, ezért $y = -3{,}5$.` }],
    final: R`Az érintő egyenlete $3x - 4y = 14$.` });

  add({ id: 'b-geo-gui-4', type: 'guided', topic: 'geometria', sub: 'felszinterfogat', level: 3, title: 'Szabályos négyoldalú gúla hajlásszöggel',
    problem: R`Egy szabályos négyoldalú gúla alapéle $6$ egység, az oldallapjai az alaplappal $60^\circ$ szöget zárnak be. Határozd meg a gúla magasságát, felszínét és térfogatát.`,
    steps: [
      { q: R`Mekkora az oldallapok magassága (az alapélhez tartozó magasság az oldallapban)?`, answer: { type: 'num', value: 6 }, ansTex: 'h = 6', verify: '3/cos(pi/3)',
        hint: R`Az oldallap és az alaplap hajlásszöge az oldallap-magasság és az alap középpontjából az alapél felezőpontjába mutató $3$ egység hosszú szakasz szöge.`, expl: R`A $3$ egység hosszú szakasz az oldallap-magasság vetülete, ezért $\cos 60^\circ = \dfrac{3}{h}$, azaz $h = 6$.` },
      { q: R`Mekkora a gúla magassága? Három tizedesre kerekítve add meg.`, answer: { type: 'num', value: 5.196, tol: 0.001 }, ansTex: R`m = 3\sqrt{3} \approx 5{,}196`, verify: '3*tg(pi/3)',
        hint: R`Ugyanabban a derékszögű háromszögben: $\operatorname{tg} 60^\circ = \dfrac{m}{3}$.`, expl: R`$m = 3\operatorname{tg} 60^\circ = 3\sqrt{3} \approx 5{,}196$. Ellenőrzés: $m^2 + 3^2 = 27 + 9 = 36 = h^2$.` },
      { q: R`Mekkora a felszín?`, answer: { type: 'num', value: 108 }, ansTex: 'A = 108', verify: '36+4*6*6/2',
        hint: R`Az alap négyzet, az oldallapok négy egybevágó háromszög, alapjuk $6$, magasságuk $h$.`, expl: R`$A = 6^2 + 4\cdot\dfrac{6\cdot6}{2} = 36 + 72 = 108$.` },
      { q: R`Mekkora a térfogat? Két tizedesre kerekítve add meg.`, answer: { type: 'num', value: 62.35, tol: 0.01 }, ansTex: R`V = 36\sqrt{3} \approx 62{,}35`, verify: '36*sqrt(3)',
        hint: R`A gúla térfogata $\dfrac{T\cdot m}{3}$.`, expl: R`$V = \dfrac{36 \cdot 3\sqrt{3}}{3} = 36\sqrt{3} \approx 62{,}35$.` }],
    final: R`$m = 3\sqrt{3} \approx 5{,}196$, $A = 108$ négyzetegység, $V = 36\sqrt{3} \approx 62{,}35$ köbegység.` });

  add({ id: 'b-geo-gui-5', type: 'guided', topic: 'geometria', sub: 'felszinterfogat', level: 2, title: 'Csonkakúp felszíne és térfogata',
    problem: R`Egy forgási csonkakúp alapkörének sugara $5$, fedőkörének sugara $2$, alkotója $5$ egység. Számítsd ki a magasságát, térfogatát és felszínét.`,
    steps: [
      { q: R`Mekkora a csonkakúp magassága?`, answer: { type: 'num', value: 4 }, ansTex: 'm = 4', verify: 'sqrt(5^2-(5-2)^2)',
        hint: R`Az alkotó, a magasság és a két sugár különbsége derékszögű háromszöget alkot.`, expl: R`A sugarak különbsége $5 - 2 = 3$, ezért $m = \sqrt{5^2 - 3^2} = 4$.` },
      { q: R`Egészítsd ki a csonkakúpot kúppá. Mekkora a pótolt (kis) kúp magassága? Három tizedesre kerekítve add meg.`, answer: { type: 'num', value: 2.667, tol: 0.001 }, ansTex: R`x = \dfrac{8}{3} \approx 2{,}667`, verify: '8/3',
        hint: R`A kis kúp és a nagy kúp hasonló: $\dfrac{x}{x + 4} = \dfrac{2}{5}$.`, expl: R`Az $5x = 2x + 8$ egyenletből $x = \dfrac{8}{3} \approx 2{,}667$. A nagy kúp magassága $\dfrac{20}{3}$.` },
      { q: R`Mekkora a csonkakúp térfogata? Két tizedesre kerekítve add meg.`, answer: { type: 'num', value: 163.36, tol: 0.01 }, ansTex: R`V = 52\pi \approx 163{,}36`, verify: 'pi*4*(25+10+4)/3',
        hint: R`A nagy kúp és a kis kúp térfogatának különbsége, vagy a képlet: $V = \dfrac{\pi m}{3}(R^2 + Rr + r^2)$.`, expl: R`$V = \dfrac{500\pi}{9} - \dfrac{32\pi}{9} = 52\pi \approx 163{,}36$. A képlettel: $\dfrac{4\pi}{3}(25 + 10 + 4) = 52\pi$.` },
      { q: R`Mekkora a csonkakúp felszíne? Két tizedesre kerekítve add meg.`, answer: { type: 'num', value: 201.06, tol: 0.01 }, ansTex: R`A = 64\pi \approx 201{,}06`, verify: 'pi*(25+4+(5+2)*5)',
        hint: R`A felszín az alapkör, a fedőkör és a palást összege: $A = \pi\left(R^2 + r^2 + (R + r)a\right)$.`, expl: R`$A = \pi(25 + 4 + 7\cdot5) = 64\pi \approx 201{,}06$.` }],
    final: R`$m = 4$, $V = 52\pi \approx 163{,}36$ köbegység, $A = 64\pi \approx 201{,}06$ négyzetegység.` });

  add({ id: 'b-geo-gui-6', type: 'guided', topic: 'geometria', sub: 'vektorok', level: 2, title: 'Háromszög szöge skalárszorzattal',
    problem: R`Az $A(1;2)$, $B(4;3)$ és $C(2;5)$ pontok háromszöget határoznak meg. Határozd meg az $A$ csúcsnál lévő szöget a skalárszorzat segítségével, majd a háromszög területét.`,
    steps: [
      { q: R`Mekkora az $\overrightarrow{AB}\cdot\overrightarrow{AC}$ skalárszorzat?`, answer: { type: 'num', value: 6 }, ansTex: R`\overrightarrow{AB}\cdot\overrightarrow{AC} = 6`, verify: '3*1+1*3',
        hint: R`Először számold ki a vektorok koordinátáit a végpont és a kezdőpont különbségeként.`, expl: R`$\overrightarrow{AB} = (3;1)$, $\overrightarrow{AC} = (1;3)$, ezért a skalárszorzat $3\cdot1 + 1\cdot3 = 6$.` },
      { q: R`Mekkora az $|\overrightarrow{AB}|$ hossz? (A másik vektor hossza ugyanennyi.) Három tizedesre kerekítve add meg.`, answer: { type: 'num', value: 3.162, tol: 0.001 }, ansTex: R`\sqrt{10} \approx 3{,}162`, verify: 'sqrt(10)',
        hint: R`A vektor hossza a koordináták négyzetösszegének négyzetgyöke.`, expl: R`$|\overrightarrow{AB}| = \sqrt{3^2 + 1^2} = \sqrt{10}$, és $|\overrightarrow{AC}| = \sqrt{1^2 + 3^2} = \sqrt{10}$.` },
      { q: R`Mennyi az $A$ csúcsnál lévő szög koszinusza?`, answer: { type: 'num', value: 0.6 }, ansTex: R`\cos\alpha = \dfrac{3}{5}`, verify: '6/10',
        hint: R`$\cos\alpha = \dfrac{\overrightarrow{AB}\cdot\overrightarrow{AC}}{|\overrightarrow{AB}|\,|\overrightarrow{AC}|}$.`, expl: R`$\cos\alpha = \dfrac{6}{\sqrt{10}\cdot\sqrt{10}} = \dfrac{6}{10} = 0{,}6$.` },
      { q: R`Hány fokos ez a szög?`, answer: { type: 'choice', options: [R`kb. $36{,}9^\circ$`, R`kb. $53{,}1^\circ$`, R`kb. $63{,}4^\circ$`], correct: 1 },
        hint: R`Számológéppel: $\alpha = \arccos 0{,}6$.`, expl: R`$\alpha = \arccos 0{,}6 \approx 53{,}1^\circ$. (A $36{,}9^\circ$ koszinusza $0{,}8$.)` },
      { q: R`Mekkora a háromszög területe?`, answer: { type: 'num', value: 4 }, ansTex: 't = 4', verify: '1/2*sqrt(10)*sqrt(10)*sqrt(1-(3/5)^2)',
        hint: R`$t = \dfrac{1}{2}\,|AB|\,|AC|\sin\alpha$, és $\sin\alpha = \sqrt{1 - \cos^2\alpha}$.`, expl: R`$\sin\alpha = \sqrt{1 - 0{,}36} = 0{,}8$, így $t = \dfrac{1}{2}\cdot10\cdot0{,}8 = 4$.` }],
    final: R`Az $A$ csúcsnál lévő szög koszinusza $0{,}6$, a szög kb. $53{,}1^\circ$; a háromszög területe $4$ területegység.` });

  add({ id: 'b-geo-gui-7', type: 'guided', topic: 'geometria', sub: 'transzformaciok', level: 2, title: 'Hasonló kúpok',
    problem: R`Két hasonló forgáskúp közül a kisebbnek az alapkörének sugara $3$, magassága $4$, alkotója $5$ egység. A nagyobb kúp alkotója $15$ egység.`,
    steps: [
      { q: R`Mekkora a hasonlóság aránya (nagyobb : kisebb)?`, answer: { type: 'num', value: 3 }, ansTex: R`\lambda = 3`, verify: '15/5',
        hint: R`Hasonló testeknél bármely két megfelelő szakasz aránya ugyanannyi.`, expl: R`Az alkotók aránya $\dfrac{15}{5} = 3$.` },
      { q: R`Mekkora a nagyobb kúp felszíne? Két tizedesre kerekítve add meg.`, answer: { type: 'num', value: 678.58, tol: 0.01 }, ansTex: R`216\pi \approx 678{,}58`, verify: '216*pi',
        hint: R`A kisebb kúp felszíne $\pi r(r + a)$; a felszínek aránya $\lambda^2$.`, expl: R`A kisebb kúp felszíne $\pi\cdot3\cdot(3 + 5) = 24\pi$. A nagyobbé $3^2\cdot24\pi = 216\pi \approx 678{,}58$.` },
      { q: R`Mekkora a nagyobb kúp térfogata? Két tizedesre kerekítve add meg.`, answer: { type: 'num', value: 1017.88, tol: 0.01 }, ansTex: R`324\pi \approx 1017{,}88`, verify: '324*pi',
        hint: R`A térfogatok aránya $\lambda^3$.`, expl: R`A kisebb kúp térfogata $\dfrac{3^2\pi\cdot4}{3} = 12\pi$. A nagyobbé $3^3\cdot12\pi = 324\pi \approx 1017{,}88$.` },
      { q: R`A nagyobb kúpot a magasságának felénél az alappal párhuzamos síkkal elmetsszük. A levágott, csúcs felőli kis kúp térfogata a nagy kúp térfogatának hányad része? Tizedes törtként add meg.`, answer: { type: 'num', value: 0.125 }, ansTex: R`\left(\dfrac{1}{2}\right)^3 = 0{,}125`, verify: '(1/2)^3',
        hint: R`A levágott kúp hasonló a nagy kúphoz, a hasonlóság aránya $\dfrac{1}{2}$.`, expl: R`A térfogatok aránya a hasonlóság arányának köbe: $\left(\dfrac{1}{2}\right)^3 = \dfrac{1}{8}$.` }],
    final: R`$\lambda = 3$, a nagyobb kúp felszíne $216\pi \approx 678{,}58$, térfogata $324\pi \approx 1017{,}88$; a levágott kúp térfogata a nagy kúp $\dfrac{1}{8}$ része.` });
})(typeof window !== 'undefined' ? window : globalThis);
