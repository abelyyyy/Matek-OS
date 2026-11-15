/* MATEK OS – tananyag: Algebra 2.8 (egyenletek, egyenletrendszerek, egyenlőtlenségek, egyenlőtlenség-rendszerek) */
(function (root) {
  'use strict';
  var MO = root.MO = root.MO || {};
  var K = MO.taskKit, R = K.R, def = K.def;
  MO.content = MO.content || {};

  /* ---------- segédek ---------- */
  function tm(c, v, first) { var ab = Math.abs(c), s = c < 0 ? '-' : (first ? '' : '+'); return s + (ab === 1 && v ? '' : ab) + v; }
  function lx(a, b) { return K.tex(K.poly([a, b])); }                   /* ax+b TeX-ben */
  function xm(a) { return K.tex(K.poly([1, -a])); }                     /* x-a TeX-ben */
  function gcd2(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var t = a % b; a = b; b = t; } return a; }
  function setTex(v) { var s = v.slice().sort(function (p, q) { return p - q; }); return '\\{' + s.map(function (x) { return K.T(x); }).join(';\\ ') + '\\}'; }
  function rel(s) { return { '<': '<', '<=': '\\le', '>': '>', '>=': '\\ge' }[s]; }
  function holds(v, s) { return s === '<' ? v < 0 : s === '<=' ? v <= 0 : s === '>' ? v > 0 : v >= 0; }
  function trigPoly(A, B, C, f) {
    var out = '', parts = [[A, f.sq], [B, f.one], [C, '']];
    parts.forEach(function (p) {
      var c = p[0], sym = p[1]; if (!c) return;
      var ab = Math.abs(c), co = (sym === '' || ab !== 1) ? String(ab) : '';
      out += (c < 0 ? '-' : (out ? '+' : '')) + co + sym;
    });
    return out;
  }

  MO.content['algebra/egyenletek'] = {
    intro: R`Az egyenlet a matematika egyik legfontosabb eszköze: szinte minden "keresd meg azt a számot, amelyre..." típusú kérdés egyenletre vezet. Ebben az alfejezetben végigmegyünk a követelmény 2.8 pontján: az alapfogalmaktól (alaphalmaz, értelmezési tartomány, ekvivalens átalakítás, hamis gyök) az elsőfokú és másodfokú egyenleteken, a törtes, négyzetgyökös, abszolútértékes, exponenciális, logaritmusos és trigonometrikus egyenleteken át az egyenlőtlenségekig és a szöveges feladatokig. Az érettségi követelménye ezt a témakört közép- és emelt szinten is kéri: középszinten egyszerűbb alakban, emelt szinten összetettebb, többlépéses feladatokban (paraméterrel, kikötéssel, ellenőrzéssel).`,
    theory: [
      { h: 'Az egyenlet fogalma, alaphalmaz, értelmezési tartomány',
        b: R`**Egyenlet**: két kifejezés egyenlőségének felírása, ahol legalább az egyik kifejezés ismeretlent tartalmaz. Az **alaphalmaz** azon elemek halmaza, amelyek közül a megoldást keressük (pl. $\mathbb{R}$, $\mathbb{Z}$, $\mathbb{N}$). Az **értelmezési tartomány** az alaphalmaz azon elemeiből áll, amelyekre az egyenlet mindkét oldala értelmezve van. Tipikus tiltások:\n- nevező nem lehet $0$;\n- a négyzetgyök alatt nem lehet negatív szám;\n- a logaritmus argumentuma pozitív, az alapja pozitív és nem $1$;\n- $\operatorname{tg}$ nincs értelmezve ott, ahol $\cos x = 0$.\nA **megoldáshalmaz** (igazsághalmaz) az értelmezési tartomány azon elemeiből áll, amelyekre az egyenlőség igaz; ezek az egyenlet **gyökei**. Lehet, hogy a megoldáshalmaz üres, vagy az egész értelmezési tartomány (ekkor azonosságról beszélünk). Példa: $\dfrac{x^2-9}{x-3} = 0$. Az értelmezési tartomány $x \neq 3$, a számláló $x=\pm 3$-nál nulla, de a $3$ nem megengedett, így a megoldáshalmaz $\{-3\}$.\n**Értékkészlet-vizsgálat** (emelt szint): néha az oldalak értékkészletéből látszik a megoldás. Pl. $\sqrt{x} + x^2 + 1 = 0$-nak nincs megoldása, mert a bal oldal legalább $1$; $|x| + x^2 = 0$-ban két nemnegatív tag összege akkor $0$, ha mindkettő $0$, azaz $x=0$.\n**Mindig így járj el**: 1. kikötés (értelmezési tartomány), 2. megoldás, 3. a gyökök összevetése a kikötéssel, 4. ellenőrzés, 5. a megoldáshalmaz felírása.` },
      { h: 'Ekvivalens átalakítások, hamis gyök, gyökvesztés',
        b: R`Két egyenlet **ekvivalens**, ha az (azonos alaphalmazon vett) megoldáshalmazuk megegyezik. Az egyenletmegoldás alapja a **mérlegelv**: ugyanazt a műveletet végezzük el mindkét oldalon. Ekvivalens átalakítások:\n- mindkét oldalhoz ugyanazt a kifejezést hozzáadni (ha az értelmezési tartomány nem változik);\n- mindkét oldalt ugyanazzal a nullától különböző számmal szorozni vagy osztani;\n- mindkét oldalt azonos alapú, szigorúan monoton függvénnyel átalakítani (pl. $a^x$ és $\log_a$, ahol $a>0$, $a \neq 1$) az értelmezési tartományra ügyelve.\nA **következményegyenlet** megoldáshalmaza tartalmazza az eredetiét, de lehet benne több elem. Ilyet kapunk, ha **négyzetre emelünk** ($A = B \Rightarrow A^2 = B^2$, de fordítva nem igaz), ha **ismeretlent tartalmazó kifejezéssel szorzunk**, vagy ha az értelmezési tartomány kibővül. A többlet gyökök a **hamis gyökök**: ezeket **ellenőrzéssel** (behelyettesítés az eredeti egyenletbe) kell kiszűrni. Példa: $\sqrt{x+5} = x-1$. Négyzetre emelve $x^2 - 3x - 4 = 0$, $x=4$ vagy $x=-1$. A $-1$ hamis gyök: $\sqrt{4} = 2 \neq -2$.\n**Gyökvesztés**: ha ismeretlent tartalmazó kifejezéssel **osztunk**, elveszhet az a gyök, ahol az a kifejezés nulla. Az $x^2 = 3x$ egyenletet $x$-szel osztva csak $x=3$ jön ki, a helyes megoldás $x(x-3)=0$, vagyis $x=0$ vagy $x=3$. Ezért inkább rendezzünk $0$-ra és bontsunk szorzattá. Gyökvesztést okozhat az is, ha az értelmezési tartományt szűkítő azonosságot használunk (pl. $\lg x^2$ helyett $2\lg x$).\nSzabály: ha minden lépés ekvivalens volt, az ellenőrzés csak a hibák kiszűrésére jó; ha volt következményegyenletre vezető lépés, az ellenőrzés kötelező.` },
      { h: 'Elsőfokú egyenletek és egyenletrendszerek',
        b: R`**Elsőfokú egyenlet** egy ismeretlennel: $ax + b = 0$ ($a \neq 0$) alakra hozható, megoldása $x = -\dfrac{b}{a}$. Ha az együttható $a=0$, akkor $0 \cdot x = -b$: ha $b \neq 0$, nincs megoldás, ha $b=0$, minden valós szám megoldás.\n**Paraméteres elsőfokú egyenlet** (emelt szint): az együtthatók betűk (paraméterek), ezért **esetszétválasztás** kell. Példa: $(m-2)x = m^2 - 4$. Ha $m \neq 2$, osztunk $(m-2)$-vel: $x = m+2$. Ha $m = 2$: $0 \cdot x = 0$, minden valós $x$ megoldás. Ha a jobb oldal $m^2-4$ helyett $m$ lenne, $m=2$-re $0x = 2$ adódna: nincs megoldás.\n**Kétismeretlenes elsőfokú egyenletrendszer**: $a_1x + b_1y = c_1$, $a_2x + b_2y = c_2$. Módszerek: **behelyettesítés** (az egyik egyenletből kifejezzük az egyik ismeretlent), **egyenlő együtthatók módszere** (az egyenleteket megfelelő számmal szorozva az egyik ismeretlen kiesik az összeadáskor vagy kivonáskor), **grafikus megoldás** (két egyenes metszéspontja). Három eset van: **egy megoldás** (az egyenesek metszők, $a_1b_2 - a_2b_1 \neq 0$), **nincs megoldás** (párhuzamosak), **végtelen sok megoldás** (egybeesnek).\n**Háromismeretlenes rendszer** (emelt szint): két egyenletpár segítségével ugyanazt az ismeretlent kiejtjük, így kétismeretlenes rendszert kapunk. Példa: $x+y+z = 6$, $2x-y+z = 3$, $x+2y-z = 2$. Az első kettő különbsége: $-x+2y = 3$; az első és harmadik összege: $2x+3y = 8$. Az elsőből $x = 2y-3$, ezt behelyettesítve $7y = 14$, $y=2$, $x=1$, $z=3$. Ellenőrzés mindhárom egyenletbe!` },
      { h: 'Másodfokú egyenlet: megoldóképlet és diszkrimináns',
        b: R`Az egyismeretlenes **másodfokú egyenlet általános alakja**: $ax^2 + bx + c = 0$, ahol $a \neq 0$. A **diszkrimináns**: $D = b^2 - 4ac$. A **megoldóképlet**:\n$$x_{1,2} = \dfrac{-b \pm \sqrt{b^2 - 4ac}}{2a}$$\nA valós megoldások száma: $D>0$ esetén **két különböző** valós gyök, $D=0$ esetén **egy** (kétszeres) gyök, $D<0$ esetén **nincs** valós gyök.\n**Hiányos alakok**: ha $b=0$: $x^2 = -\dfrac{c}{a}$; ha $c=0$: $x(ax+b)=0$, azaz $x=0$ vagy $x=-\dfrac{b}{a}$. Ezeknél nem kell megoldóképlet.\n**Teljes négyzetté alakítás**: $x^2 + px + q = \left(x + \dfrac{p}{2}\right)^2 + q - \dfrac{p^2}{4}$. Pl. $x^2 - 6x + 5 = (x-3)^2 - 4 = 0$, így $x-3 = \pm 2$, $x = 5$ vagy $x = 1$. Ez a módszer a parabola csúcspontjának és az értékkészletnek a meghatározásához is kell.`,
        proof: R`A megoldóképlet igazolása (emelt szint): $ax^2+bx+c=0$ ($a \neq 0$) ekvivalens azzal, hogy $x^2 + \dfrac{b}{a}x + \dfrac{c}{a} = 0$. Teljes négyzetté alakítva $\left(x + \dfrac{b}{2a}\right)^2 - \dfrac{b^2}{4a^2} + \dfrac{c}{a} = 0$, azaz $\left(x + \dfrac{b}{2a}\right)^2 = \dfrac{b^2 - 4ac}{4a^2}$. A jobb oldal előjele $D$ előjelével egyezik (a nevező pozitív). Ha $D<0$, a bal oldal nemnegatív, így nincs valós gyök. Ha $D \geq 0$, gyököt vonva $x + \dfrac{b}{2a} = \pm\dfrac{\sqrt{D}}{2|a|}$, amiből $x = \dfrac{-b \pm \sqrt{D}}{2a}$ (a $\pm$ miatt az abszolútérték elhagyható). $D=0$-nál a két érték egybeesik.` },
      { h: 'Gyöktényezős alak és a gyökök–együtthatók összefüggése',
        b: R`Ha a $ax^2+bx+c=0$ egyenlet gyökei $x_1$ és $x_2$ (valós gyökök, $D \geq 0$), akkor a **gyöktényezős alak**: $ax^2 + bx + c = a(x - x_1)(x - x_2)$. $D=0$ esetén $x_1 = x_2$, ekkor $a(x-x_1)^2$. A **gyökök és együtthatók közötti összefüggések** (Viète-formulák):\n$$x_1 + x_2 = -\dfrac{b}{a}, \qquad x_1 \cdot x_2 = \dfrac{c}{a}$$\nFelhasználás gyökök kiszámítása nélkül:\n- $x_1^2 + x_2^2 = (x_1+x_2)^2 - 2x_1x_2$\n- $\dfrac{1}{x_1} + \dfrac{1}{x_2} = \dfrac{x_1+x_2}{x_1x_2}$\n- $(x_1 - x_2)^2 = (x_1+x_2)^2 - 4x_1x_2 = \dfrac{D}{a^2}$\n- adott gyökökhöz egyenlet: $x^2 - (x_1+x_2)x + x_1x_2 = 0$.\nA gyökök előjele is leolvasható: ha $\dfrac{c}{a} < 0$, a gyökök ellentétes előjelűek; ha $\dfrac{c}{a} > 0$, azonos előjelűek (az előjel a $-\dfrac{b}{a}$ előjele, feltéve $D \geq 0$). **Paraméteres másodfokú egyenletnél** (emelt szint) a feltételeket ($D>0$, $D=0$, gyökök összege, szorzata) a paraméterre vonatkozó egyenletté vagy egyenlőtlenséggé alakítjuk, és a kapott paraméterértékeket a $D$-feltétellel is összevetjük.`,
        proof: R`Ha $x_1, x_2$ a gyökök, a megoldóképlet szerint $x_1 + x_2 = \dfrac{-b+\sqrt{D}}{2a} + \dfrac{-b-\sqrt{D}}{2a} = \dfrac{-2b}{2a} = -\dfrac{b}{a}$, és $x_1x_2 = \dfrac{b^2 - D}{4a^2} = \dfrac{4ac}{4a^2} = \dfrac{c}{a}$ (a $(-b)^2 - (\sqrt{D})^2$ szerint). Ebből $a(x-x_1)(x-x_2) = a\left(x^2 - (x_1+x_2)x + x_1x_2\right) = ax^2 + bx + c$, ami a gyöktényezős alakot is igazolja.` },
      { h: 'Törtes egyenletek, szorzattá alakítás',
        b: R`**Törtes egyenlet**: az ismeretlen a nevezőben is szerepel. Lépések: 1. **kikötés**: minden nevező $\neq 0$; 2. közös nevezőre hozás, majd szorzás a közös nevezővel (ez nem ekvivalens átalakítás, ha a nevező ismeretlent tartalmaz, ezért a kikötés a döntő); 3. a kapott (pl. másodfokú) egyenlet megoldása; 4. a kikötést sértő gyökök elhagyása.\nPéldák: $\dfrac{x^2 - 9}{x - 3} = 0$. Egy tört akkor és csak akkor nulla, ha a számláló $0$ és a nevező nem $0$, ezért $x = -3$. $\dfrac{x}{x-1} = \dfrac{1}{x-1} + 2$. Kikötés: $x \neq 1$. Szorzás $(x-1)$-gyel: $x = 1 + 2(x-1)$, $x=1$. Ez sérti a kikötést, így **nincs megoldás** (hamis gyök!).\n**Szorzattá alakítás** (emelt szint): $A \cdot B = 0 \iff A = 0$ vagy $B = 0$ (ha mindkettő értelmezett). Eszközei: kiemelés, nevezetes azonosságok ($a^2-b^2$, $a^2 \pm 2ab + b^2$), csoportosítás. Pl. $x^3 - 4x = x(x-2)(x+2) = 0$, $x \in \{-2; 0; 2\}$. $x^3 - 2x^2 - 9x + 18 = x^2(x-2) - 9(x-2) = (x-2)(x-3)(x+3)$, gyökei $2$, $3$, $-3$. Ha egész együtthatós, főegyütthatója $1$ polinomnak van egész gyöke, az a konstans tag osztója (próbálgatásnál hasznos).` },
      { h: 'Másodfokúra visszavezethető egyenletek, másodfokú egyenletrendszerek',
        b: R`**Új ismeretlen bevezetése**: ha az egyenlet egy kifejezés (pl. $x^2$, $x + \frac{1}{x}$, $2^x$, $\sin x$) másodfokú függvénye, ezt a kifejezést $t$-vel jelöljük, megoldjuk a másodfokú egyenletet $t$-re, majd visszahelyettesítünk, miközben ügyelünk $t$ megengedett értékeire. Példák:\n- **Bikvadratikus**: $x^4 - 5x^2 + 4 = 0$. Legyen $t = x^2 \geq 0$: $t^2 - 5t + 4 = 0$, $t = 1$ vagy $t = 4$, így $x = \pm 1$ vagy $x = \pm 2$. Negatív $t$ gyököt el kell dobni.\n- $(x^2 + x)^2 - 8(x^2 + x) + 12 = 0$: $t = x^2+x$, $t = 2$ vagy $6$. Ezekből $x^2 + x - 2 = 0$ ($x = 1$ vagy $-2$) és $x^2 + x - 6 = 0$ ($x = 2$ vagy $-3$).\n- $x + \dfrac{1}{x} = \dfrac{5}{2}$ ($x \neq 0$): szorzás $2x$-szel: $2x^2 - 5x + 2 = 0$, $x = 2$ vagy $x = \dfrac{1}{2}$.\n**Másodfokú egyenletrendszer** (egyszerű): ha az egyik egyenlet elsőfokú, abból kifejezzük az egyik ismeretlent, és behelyettesítünk a másikba. Szimmetrikus esetben ($x+y = s$, $xy = p$) az $x$ és $y$ a $t^2 - st + p = 0$ egyenlet gyökei; az $x^2 + y^2 = (x+y)^2 - 2xy$ azonosság is gyakran kell. Pl. $x+y = 5$, $xy = 6$: $t^2 - 5t + 6 = 0$, így $(x;y) = (2;3)$ vagy $(3;2)$. A megoldás számpár; a végén minden párt ellenőrizni kell mindkét egyenletben.` },
      { h: 'Négyzetgyökös egyenletek',
        b: R`Alapfeladat ($\sqrt{x} + b = cx + d$ típus): **izoláljuk a gyököt**, majd **négyzetre emelünk**. A négyzetre emelés következményegyenletet ad, ezért **ellenőrizni kell**. A precíz felírás: $\sqrt{A} = B \iff B \geq 0$ és $A = B^2$ (ekkor az $A \geq 0$ automatikusan teljesül). Példa: $\sqrt{x+5} = x-1$. Kikötés: $x \geq -5$, és a jobb oldal nemnegatív, $x \geq 1$. Négyzetre emelés: $x^2 - 3x - 4 = 0$, $x = 4$ vagy $-1$. Csak $x=4$ felel meg ($x \geq 1$). Ellenőrzés: $\sqrt{9} = 3$ ✓.\n**Két négyzetre emelés** (emelt szint): ha két gyök van, pl. $\sqrt{x+3} - \sqrt{x-2} = 1$, az egyiket átvisszük: $\sqrt{x+3} = 1 + \sqrt{x-2}$, négyzetre emelés után még marad egy gyök: $x+3 = 1 + 2\sqrt{x-2} + x - 2$, innen $\sqrt{x-2} = 2$, majd $x=6$. A kikötés: $x \geq 2$. Ellenőrzés kötelező. Mindig először az értelmezési tartományt írd fel, mert a gyök alatti kifejezések mindegyikére kell kikötés. Ha az egyik oldal biztosan negatív, és a másik gyök (pl. $\sqrt{x} = -3$), akkor **nincs megoldás**, számolás nélkül.` },
      { h: 'Abszolútértékes egyenletek', level: 'emelt',
        b: R`**Definíció**: $|a| = a$, ha $a \geq 0$, és $|a| = -a$, ha $a < 0$. Geometriai jelentés: $|a - b|$ az $a$ és $b$ távolsága a számegyenesen. Tulajdonságok: $|a| \geq 0$, $|a|^2 = a^2$, $|a \cdot b| = |a| \cdot |b|$.\n**Alapeset**: $|A| = B$ akkor és csak akkor teljesül, ha $B \geq 0$ és ($A = B$ vagy $A = -B$). Pl. $|2x - 1| = 5$: $2x - 1 = 5$ vagy $2x-1 = -5$, azaz $x=3$ vagy $x=-2$.\n**Több abszolútérték**: az abszolútértékek belsejének **zérushelyei** felosztják a számegyenest szakaszokra; minden szakaszon elhagyjuk az abszolútérték-jeleket a megfelelő előjellel, megoldjuk az egyenletet, és a kapott gyököt csak akkor fogadjuk el, ha az **az adott szakaszba esik**. Példa: $|x - 1| + |x + 2| = 5$.\n- $x < -2$: $-(x-1) - (x+2) = -2x - 1 = 5$, $x = -3$ ✓ ($<-2$).\n- $-2 \leq x < 1$: $-(x-1) + (x+2) = 3 \neq 5$, nincs megoldás.\n- $x \geq 1$: $(x-1) + (x+2) = 2x + 1 = 5$, $x = 2$ ✓.\nA megoldáshalmaz $\{-3; 2\}$. Az alapesetből is látszik: $|A| = B$ és $B<0$ esetén nincs megoldás.` },
      { h: 'Exponenciális és logaritmusos egyenletek',
        b: R`**Exponenciális egyenlet**: az ismeretlen kitevőben áll. Alapelv: ha $a>0$, $a \neq 1$, akkor $a^{f(x)} = a^{g(x)} \iff f(x) = g(x)$ (az exponenciális függvény kölcsönösen egyértelmű). Lépések: azonos alapra hozás (hatványozás azonosságai), vagy ha ez nem megy, mindkét oldal logaritmusa: $a^x = b$ ($b>0$) $\Rightarrow x = \log_a b$. Egy hatvány értéke sosem $0$ vagy negatív, tehát $2^x = -4$-nek nincs megoldása. **Új ismeretlen** (emelt szint): $4^x - 5 \cdot 2^x + 4 = 0$; $t = 2^x > 0$: $t^2 - 5t + 4 = 0$, $t=1$ vagy $4$, így $x=0$ vagy $x=2$. **Exponenciális egyenletrendszer** (emelt): pl. $2^x \cdot 2^y = 32$ és $x - y = 1$; az első $2^{x+y} = 2^5$, azaz $x+y = 5$, így $x=3$, $y=2$.\n**Modellezés** (közép szint): exponenciális folyamat (kamatos kamat, lecsengés, szaporodás): $N(t) = N_0 \cdot q^t$. Egy adott érték eléréséhez az egyenletet $q^t = \dfrac{N}{N_0}$ alakra hozzuk, és $t = \log_q \dfrac{N}{N_0}$ adja az időt; kerekítésnél a szöveg kérdése dönt (pl. teljes évek).\n**Logaritmusos egyenlet** (emelt szint): értelmezési tartomány: az argumentum pozitív. Alapelv: $\log_a f = \log_a g \iff f = g$ (és $f,g>0$), valamint $\log_a f = c \iff f = a^c$. Azonosságok: $\log_a(xy) = \log_a x + \log_a y$ és $\log_a x^k = k\log_a x$ csak **pozitív** $x, y$-ra. Az összevonás vagy szétbontás megváltoztathatja az értelmezési tartományt, ezért a **kikötést az eredeti egyenletre** kell felírni, a megoldás végén pedig ellenőrizni. Példa: $\lg(x-1) + \lg(x+2) = 1$. Kikötés: $x>1$. Átalakítva $(x-1)(x+2) = 10$, $x^2 + x - 12 = 0$, $x=3$ vagy $x=-4$. A $-4$ sérti a kikötést (hamis gyök), a megoldás $x=3$.` },
      { h: 'Trigonometrikus egyenletek', level: 'emelt',
        b: R`Az alapegyenletek: $\sin x = c$ és $\cos x = c$ ($-1 \leq c \leq 1$, különben nincs megoldás), $\operatorname{tg} x = c$ (bármely valós $c$; $\cos x \neq 0$). Ha $\alpha$ egy megoldás, akkor (fokban, $k \in \mathbb{Z}$):\n- $\sin x = c$: $x = \alpha + k \cdot 360^\circ$ vagy $x = 180^\circ - \alpha + k \cdot 360^\circ$;\n- $\cos x = c$: $x = \pm\alpha + k \cdot 360^\circ$;\n- $\operatorname{tg} x = c$: $x = \alpha + k \cdot 180^\circ$.\n(Radiánban $360^\circ$ helyett $2\pi$, $180^\circ$ helyett $\pi$.) A szögfüggvények periodikusak, ezért az **alaphalmaz megadása** fontos: ha pl. $0^\circ \leq x < 360^\circ$, akkor a megoldások száma véges. Nevezetes értékek: $\sin 30^\circ = \dfrac{1}{2}$, $\sin 45^\circ = \dfrac{\sqrt{2}}{2}$, $\sin 60^\circ = \dfrac{\sqrt{3}}{2}$, $\cos 60^\circ = \dfrac{1}{2}$.\n**Azonosságok közvetlen alkalmazása**: $\sin^2 x + \cos^2 x = 1$, $\operatorname{tg} x = \dfrac{\sin x}{\cos x}$, $\sin(-x) = -\sin x$, $\cos(-x) = \cos x$, $\sin(90^\circ - x) = \cos x$. **Másodfokúra visszavezethető**: $2\cos^2 x + \sin x - 2 = 0$. Az azonosságot használva $\cos^2 x = 1 - \sin^2 x$, így $-2\sin^2 x + \sin x = 0$, $\sin x(1 - 2\sin x) = 0$. Innen $\sin x = 0$ vagy $\sin x = \dfrac{1}{2}$; $[0^\circ; 360^\circ[$-on: $0^\circ$, $180^\circ$, $30^\circ$, $150^\circ$. Ügyelj: a $t = \sin x$ új ismeretlenre $|t| \leq 1$; az ennél nagyobb $|t|$ gyököt el kell dobni.` },
      { h: 'Egyenlőtlenségek és egyenlőtlenség-rendszerek',
        b: R`**Elsőfokú egyenlőtlenség**: ugyanúgy megoldjuk, mint az egyenletet, de **negatív számmal szorozva vagy osztva a relációjel megfordul**. Pl. $-3x + 5 < 14$: $-3x < 9$, $x > -3$, a megoldás $]-3; \infty[$.\n**Másodfokú egyenlőtlenség**: ábrázoljuk a $f(x) = ax^2 + bx + c$ parabolát (a gyökök a zérushelyek). Ha $a>0$, a parabola a gyökökön kívül pozitív, a gyökök között negatív. Pl. $x^2 - x - 6 \leq 0$: gyökök $-2$ és $3$, a megoldás $[-2; 3]$. $x^2 - x - 6 > 0$: $]-\infty; -2[\ \cup\ ]3; \infty[$. Ha $D<0$, az előjel mindenhol az $a$ előjele.\n**Törtes egyenlőtlenség**: **tilos** ismeretlent tartalmazó nevezővel egyszerűen szorozni, mert az előjele nem ismert. Ehelyett rendezzük $0$-ra, hozzuk közös nevezőre, és **előjelvizsgálatot** végzünk: a számláló és a nevező zérushelyei szakaszokra osztják a számegyenest, minden szakaszon megnézzük a tört előjelét. Egy tört akkor $\geq 0$, ha számláló és nevező azonos előjelű, vagy a számláló $0$ (a nevező **sosem** lehet $0$). Alternatíva: esetszétválasztás a nevező előjele szerint.\n**Egyenlőtlenség-rendszer**: minden egyenlőtlenséget külön megoldunk, a megoldáshalmazok **metszete** a rendszer megoldása (számegyenesen ábrázolva). Pl. $2x - 1 > 3$ és $x^2 \leq 25$: $x > 2$ és $-5 \leq x \leq 5$, így a megoldás $]2; 5]$. **Megoldáshalmaz jelölése** (magyar): $[a; b]$ zárt, $]a; b[$ nyílt, $\cup$ unió, $\mathbb{R}$, $]-\infty; a[$ stb.` },
      { h: 'Nem algebrai egyenlőtlenségek', level: 'emelt',
        b: R`**Négyzetgyökös**: a kikötés a gyök alatti kifejezés $\geq 0$. $\sqrt{A} < B$ akkor és csak akkor, ha $A \geq 0$, $B > 0$ és $A < B^2$. Pl. $\sqrt{x+2} < x$: $x+2 \geq 0$, $x > 0$, $x + 2 < x^2$, tehát $x^2 - x - 2 > 0$, $x > 2$ (vagy $x<-1$, ami $x>0$ miatt kiesik): $]2; \infty[$. Fordítva, $\sqrt{A} > B$ esetén két eset: $B < 0$ és $A \geq 0$, vagy $B \geq 0$ és $A > B^2$.\n**Abszolútértékes**: $|x - a| < r \iff a - r < x < a + r$, és $|x - a| > r \iff x < a - r$ vagy $x > a + r$ (táv a számegyenesen!). Pl. $|2x - 3| \leq 5$: $-5 \leq 2x - 3 \leq 5$, $x \in [-1; 4]$. Több abszolútértéknél szakaszokra bontunk, mint az egyenletnél.\n**Exponenciális és logaritmusos**: az $a^x$ és $\log_a x$ függvény $a>1$-re **szigorúan növő** (a relációjel marad), $0<a<1$-re **szigorúan csökkenő** (a relációjel megfordul). Pl. $\left(\dfrac{1}{2}\right)^x > \dfrac{1}{8}$, azaz $\left(\dfrac{1}{2}\right)^x > \left(\dfrac{1}{2}\right)^3$, tehát $x<3$. $\log_2 (x - 1) \leq 3$: kikötés $x>1$, majd $x - 1 \leq 8$, $x \leq 9$; a megoldás $]1; 9]$.\n**Trigonometrikus**: az egységkör vagy a függvénygrafikon alapján oldjuk meg: pl. $\sin x > \dfrac{1}{2}$ a $[0^\circ; 360^\circ[$ intervallumon $]30^\circ; 150^\circ[$; a periódus miatt $k \cdot 360^\circ$-kal eltolva az összes megoldás.` },
      { h: 'Szöveges feladatok és grafikus megoldás',
        b: R`**Szöveges feladat lépései**: 1. **Értsd meg**: mi az ismert, mi a kérdés; készíts ábrát vagy táblázatot. 2. **Válaszd meg az ismeretlent**, és írd le, mit jelöl (mértékegységgel). 3. **Határozd meg az ismeretlen értelmezési tartományát** a szöveg alapján (pl. hossz, életkor, darabszám pozitív; darabszám egész). 4. **Írd fel az egyenletet vagy rendszert** a szöveg összefüggései alapján. 5. **Oldd meg** (a megoldás kikötéseivel). 6. **Vesd össze az eredményt a szöveggel**: a gyök megfelel-e az értelmezési tartománynak? (A negatív hossz, a törtszámú ember kiesik.) 7. **Ellenőrizd az eredeti szövegbe helyettesítve**, nem csak az egyenletbe. 8. **Válaszolj szövegesen**, mértékegységgel.\nTipikus típusok: **munka** (az egész munka $1$; $\dfrac{1}{x}$ a részmunka egy óra alatt), **mozgás** ($s = v \cdot t$), **keverés**, **számok**, **kamatos kamat**, **geometria** (terület, kerület, Pitagorasz).\n**Grafikus megoldás**: az $f(x) = g(x)$ egyenlet megoldásai az $f$ és $g$ grafikonjainak **metszéspontjainak $x$-koordinátái**; az $f(x) < g(x)$ megoldása azok az $x$-ek, ahol $f$ grafikonja $g$ alatt van. Egyenletrendszernél a két görbe metszéspontjai a számpárok. Pontatlan rajzból csak közelítést kapunk, ezért a grafikus úton talált gyököt célszerű behelyettesítéssel igazolni, vagy a grafikus megoldás csak a megoldások **számának** megállapítására szolgál.` }
    ],
    examples: [
      { t: 'Paraméteres másodfokú egyenlet (emelt)',
        p: R`Határozd meg az $m$ valós paraméter értékét úgy, hogy az $x^2 - 2mx + m + 2 = 0$ egyenletnek két különböző valós gyöke legyen, és a gyökök négyzetösszege $8$ legyen.`,
        steps: [
          R`**Két különböző valós gyök feltétele**: $D > 0$. $D = (2m)^2 - 4(m+2) = 4m^2 - 4m - 8 = 4(m-2)(m+1)$. Ez pozitív, ha $m < -1$ vagy $m > 2$.`,
          R`**Viète-formulák**: $x_1 + x_2 = 2m$ és $x_1 x_2 = m + 2$.`,
          R`A négyzetösszeg: $x_1^2 + x_2^2 = (x_1+x_2)^2 - 2x_1x_2 = 4m^2 - 2(m+2) = 4m^2 - 2m - 4$.`,
          R`Ennek $8$-nak kell lennie: $4m^2 - 2m - 4 = 8$, azaz $2m^2 - m - 6 = 0$. A gyökök: $m = \dfrac{1 \pm \sqrt{1 + 48}}{4} = \dfrac{1 \pm 7}{4}$, vagyis $m = 2$ vagy $m = -\dfrac{3}{2}$.`,
          R`**Visszavetés a feltételbe**: $m = 2$-re $D = 0$, tehát csak egy (kétszeres) gyök van, ez nem felel meg. $m = -\dfrac{3}{2}$-re $m<-1$, tehát $D>0$ ✓.`,
          R`**Ellenőrzés**: $m = -\dfrac{3}{2}$ esetén az egyenlet $x^2 + 3x + \dfrac{1}{2} = 0$, $D = 9 - 2 = 7 > 0$, a négyzetösszeg $(-3)^2 - 2 \cdot \dfrac{1}{2} = 8$ ✓.`
        ],
        ans: R`Az egyetlen megfelelő paraméterérték $m = -\dfrac{3}{2}$. (Az $m=2$ kiesik, mert ott kétszeres gyök van.)`,
        checks: [['4*m^2-4*(m+2)', '4*(m-2)*(m+1)'], ['(2*m)^2-2*(m+2)', '4*m^2-2*m-4'], ['2*(-3/2)^2-(-3/2)-6', '0'], ['4*(-3/2)^2-4*(-3/2+2)', '7'], ['(-3)^2-2*(1/2)', '8']] },
      { t: 'Logaritmusos egyenlet kikötéssel és hamis gyökkel (emelt)',
        p: R`Oldd meg a valós számok halmazán: $\log_2 (x+3) + \log_2 (x+1) = 3$.`,
        steps: [
          R`**Kikötés**: $x + 3 > 0$ és $x + 1 > 0$, tehát $x > -1$.`,
          R`**Átalakítás**: a logaritmusok összege a szorzat logaritmusa (pozitív argumentumokra): $\log_2 \big((x+3)(x+1)\big) = 3$. Ez a kikötés mellett ekvivalens azzal, hogy $(x+3)(x+1) = 2^3 = 8$.`,
          R`**Rendezés**: $x^2 + 4x + 3 = 8$, azaz $x^2 + 4x - 5 = 0$, $(x+5)(x-1) = 0$, így $x = -5$ vagy $x = 1$.`,
          R`**Kikötés ellenőrzése**: $x = -5$ nem felel meg ($-5 < -1$), **hamis gyök**: a szorzat valóban $(-2)(-4) = 8$, de a logaritmusok külön nem értelmezettek. $x = 1$ megfelel.`,
          R`**Ellenőrzés**: $\log_2 4 + \log_2 2 = 2 + 1 = 3$ ✓.`
        ],
        ans: R`Az egyenlet megoldása $x = 1$; a megoldáshalmaz $\{1\}$.`,
        checks: [['(x+3)*(x+1)', 'x^2+4x+3'], ['x^2+4x+3-8', '(x+5)*(x-1)'], ['(-5+3)*(-5+1)', '8'], ['log(2;4)+log(2;2)', '3'], ['2^3', '8']] },
      { t: 'Négyzetgyökös egyenlet két négyzetre emeléssel, ellenőrzéssel (emelt)',
        p: R`Oldd meg a valós számok halmazán: $\sqrt{x+3} - \sqrt{x-2} = 1$.`,
        steps: [
          R`**Kikötés**: $x + 3 \geq 0$ és $x - 2 \geq 0$, tehát $x \geq 2$.`,
          R`**Izolálás**: $\sqrt{x+3} = 1 + \sqrt{x-2}$. Mindkét oldal nemnegatív, ezért a négyzetre emelés ekvivalens átalakítás; az ellenőrzést a biztonság kedvéért mégis elvégezzük.`,
          R`**Első négyzetre emelés**: $x + 3 = 1 + 2\sqrt{x-2} + (x - 2)$, azaz $x + 3 = x - 1 + 2\sqrt{x-2}$, vagyis $4 = 2\sqrt{x-2}$, $\sqrt{x-2} = 2$.`,
          R`**Második négyzetre emelés**: $x - 2 = 4$, $x = 6$. Ez megfelel a kikötésnek ($6 \geq 2$).`,
          R`**Ellenőrzés**: $\sqrt{6+3} - \sqrt{6-2} = 3 - 2 = 1$ ✓.`
        ],
        ans: R`Az egyetlen megoldás $x = 6$.`,
        checks: [['(1+2)^2', '9'], ['6+3', '9'], ['6-2', '4'], ['sqrt(6+3)-sqrt(6-2)', '1'], ['(1+sqrt(4))^2', '9']] },
      { t: 'Törtes egyenlőtlenség előjelvizsgálattal (emelt)',
        p: R`Oldd meg a valós számok halmazán: $\dfrac{2x - 1}{x + 3} \leq 1$.`,
        steps: [
          R`**Kikötés**: $x + 3 \neq 0$, azaz $x \neq -3$. A nevező előjele nem ismert, ezért **nem szorzunk vele**.`,
          R`**Rendezés $0$-ra**: $\dfrac{2x-1}{x+3} - 1 = \dfrac{2x - 1 - (x+3)}{x+3} = \dfrac{x-4}{x+3} \leq 0$.`,
          R`**Előjelvizsgálat**: a számláló zérushelye $4$, a nevezőé $-3$.\n$x < -3$: számláló $-$, nevező $-$, a tört $+$.\n$-3 < x < 4$: számláló $-$, nevező $+$, a tört $-$.\n$x > 4$: mindkettő $+$, a tört $+$.\n$x=4$-nél a tört $0$, $x=-3$ nincs értelmezve.`,
          R`A $\leq 0$ a középső szakaszon és $x=4$-nél teljesül: $-3 < x \leq 4$.`,
          R`**Ellenőrzés mintaértékekkel**: $x=0$: $-\dfrac{1}{3} \leq 1$ ✓; $x=4$: $\dfrac{7}{7} = 1$ ✓; $x=5$: $\dfrac{9}{8} > 1$ ✗; $x=-4$: $\dfrac{-9}{-1} = 9 > 1$ ✗.`
        ],
        ans: R`A megoldáshalmaz $]-3; 4]$.`,
        checks: [['(2*x-1)/(x+3)-1', '(x-4)/(x+3)'], ['(2*0-1)/(0+3)', '-1/3'], ['(2*4-1)/(4+3)', '1'], ['(2*5-1)/(5+3)', '9/8'], ['(2*(-4)-1)/(-4+3)', '9']] },
      { t: 'Másodfokú egyenletrendszer',
        p: R`Oldd meg a valós számok halmazán: $x + 2y = 7$ és $x \cdot y = 6$.`,
        steps: [
          R`Az elsőből $x = 7 - 2y$. Behelyettesítés a másodikba: $(7 - 2y) \cdot y = 6$.`,
          R`Rendezve: $7y - 2y^2 = 6$, azaz $2y^2 - 7y + 6 = 0$.`,
          R`Diszkrimináns: $D = 49 - 4 \cdot 2 \cdot 6 = 1$, így $y = \dfrac{7 \pm 1}{4}$, vagyis $y = 2$ vagy $y = \dfrac{3}{2}$.`,
          R`Visszahelyettesítés: $y = 2$ esetén $x = 7 - 4 = 3$; $y = \dfrac{3}{2}$ esetén $x = 7 - 3 = 4$.`,
          R`**Ellenőrzés**: $(3; 2)$: $3 + 4 = 7$, $3 \cdot 2 = 6$ ✓. $\left(4; \dfrac{3}{2}\right)$: $4 + 3 = 7$, $4 \cdot \dfrac{3}{2} = 6$ ✓.`
        ],
        ans: R`A rendszernek két megoldása van: $(x; y) = (3; 2)$ és $(x; y) = \left(4; \dfrac{3}{2}\right)$.`,
        checks: [['(7-2*y)*y', '7*y-2*y^2'], ['49-4*2*6', '1'], ['2*2^2-7*2+6', '0'], ['2*(3/2)^2-7*(3/2)+6', '0'], ['4*3/2', '6']] },
      { t: 'Szöveges feladat: közös munka',
        p: R`Egy medencét az első cső egyedül $x$ óra alatt tölti meg, a második cső egyedül $5$ órával tovább tart. A két cső együtt $6$ óra alatt tölti meg a medencét. Hány óra alatt tölti meg a medencét az egyik és a másik cső egyedül?`,
        steps: [
          R`**Ismeretlen és értelmezési tartomány**: $x$ az első cső ideje órában, $x > 0$. A második cső ideje $x + 5$ óra.`,
          R`**Egyenlet**: egy óra alatt az első a medence $\dfrac{1}{x}$, a második $\dfrac{1}{x+5}$ részét tölti, együtt $\dfrac{1}{6}$ részt: $\dfrac{1}{x} + \dfrac{1}{x+5} = \dfrac{1}{6}$.`,
          R`Szorzás $6x(x+5)$-tel ($x>0$, ezért nem ad hamis gyököt): $6(x+5) + 6x = x(x+5)$, azaz $12x + 30 = x^2 + 5x$, $x^2 - 7x - 30 = 0$.`,
          R`$D = 49 + 120 = 169$, $x = \dfrac{7 \pm 13}{2}$, tehát $x = 10$ vagy $x = -3$.`,
          R`**Összevetés a szöveggel**: $x = -3$ negatív idő, nem lehet. $x = 10$, a második cső $15$ óra alatt tölt.`,
          R`**Ellenőrzés a szövegbe helyettesítve**: $\dfrac{1}{10} + \dfrac{1}{15} = \dfrac{3}{30} + \dfrac{2}{30} = \dfrac{1}{6}$, tehát együtt valóban $6$ óra alatt töltik meg ✓.`
        ],
        ans: R`Az első cső egyedül $10$ óra, a második egyedül $15$ óra alatt tölti meg a medencét.`,
        checks: [['6*(x+5)+6*x', '12*x+30'], ['12*x+30-x*(x+5)', '-(x^2-7*x-30)'], ['10^2-7*10-30', '0'], ['49+120', '169'], ['1/10+1/15', '1/6']] }
    ],
    sims: ['masodfoku', 'rendszer', 'grafikus-megoldo', 'parameteres', 'abszolutertek', 'trig-egyenlet', 'exp-log', 'fuggveny'],
    mistakes: [
      R`**Kikötés nélküli törtes vagy logaritmusos egyenlet.** A kapott gyököt nem veted össze az értelmezési tartománnyal, így hamis gyök marad a megoldásban (pl. $\dfrac{x}{x-1} = \dfrac{1}{x-1} + 2$-nél $x=1$). Először mindig a kikötés.`,
      R`**Négyzetre emelés után elmarad az ellenőrzés.** A négyzetre emelés következményegyenletet ad: $\sqrt{x+5} = x-1$-nél a $-1$ kijön, de nem megoldás.`,
      R`**Ismeretlent tartalmazó kifejezéssel osztás.** $x^2 = 3x$ osztása $x$-szel elveszíti az $x = 0$ gyököt. Rendezz $0$-ra, bonts szorzattá.`,
      R`**Negatív számmal szorzáskor nem fordítod meg a relációjelet.** $-2x < 6$ megoldása $x > -3$, nem $x < -3$. Ugyanez a törtes egyenlőtlenségnél: nevezővel (ismeretlen előjel) ne szorozz, inkább rendezz $0$-ra és végezz előjelvizsgálatot.`,
      R`**Rossz diszkrimináns vagy képlet.** Gyakori hiba a $-b$ előjelének elvesztése, a $2a$ elhagyása a nevezőből, vagy $D = b^2 - 4ac$ helyett $b^2 + 4ac$ (negatív $a$-nál, $c$-nél figyelj az előjelekre). Viète-nél $x_1 + x_2 = -\dfrac{b}{a}$ (a mínusz fontos), a szorzat $+\dfrac{c}{a}$.`,
      R`**Az abszolútértékes egyenletnél a szakaszba nem eső gyökök megtartása.** Ha az $x \geq 1$ esetben $x = -3$ jön ki, az nem megoldás, mert nem esik a szakaszba.`,
      R`**Logaritmus azonosság helytelen használata.** $\log_2(x+3)+\log_2(x+1) = \log_2(x+4)$ **hibás**; az összeg logaritmusa nem a logaritmusok összege. A helyes: $\log_a(xy) = \log_a x + \log_a y$. Az $\lg x^2 = 2\lg x$ csak $x > 0$-ra igaz ($\lg x^2 = 2\lg|x|$ minden $x \neq 0$-ra).`,
      R`**Intervallum és relációjel összekeverése.** A $<$ jel nyílt, a $\leq$ jel zárt végpontot jelent: $]-3; 4]$ és $]-3; 4[$ más halmaz. Az $\infty$ és $-\infty$ mellett mindig nyílt zárójel áll. A "vagy" uniót ($\cup$), az "és" metszetet jelent.`
    ],
    exam: R`A követelmény közép- és emelt szinten is kéri az alaphalmaz és megoldáshalmaz fogalmát, a mérlegelvet, az ekvivalens és következményegyenletre vezető átalakításokat, az új ismeretlen bevezetését, az értelmezési tartomány és értékkészlet vizsgálatát, a szöveges feladatok megoldását (az eredmény összevetésével a szöveggel). Közép szinten: elsőfokú egyenlet és rendszer, másodfokú egyenlet (megoldóképlet, diszkrimináns, teljes négyzet, gyöktényezős alak), egyszerű másodfokúra visszavezethető és $\sqrt{x}+b=cx+d$ típusú egyenletek, exponenciális egyenletek, egyszerű első- és másodfokú egyenlőtlenségek. Emelt szinten ezen felül: paraméteres elsőfokú és másodfokú egyenlet, háromismeretlenes rendszer, a megoldóképlet és a Viète-formulák igazolása, törtes egyenletek, egyszerű másodfokú rendszerek, két négyzetre emeléses gyökös egyenlet, abszolútértékes, logaritmusos, trigonometrikus egyenletek, egyenlőtlenség-rendszerek és nem algebrai egyenlőtlenségek.`,
    cheat: [
      R`ax^2+bx+c=0,\quad D=b^2-4ac,\quad x_{1,2}=\dfrac{-b\pm\sqrt{D}}{2a}`,
      R`D>0:\ 2\text{ gyök};\quad D=0:\ 1\text{ gyök};\quad D<0:\ \text{nincs valós gyök}`,
      R`ax^2+bx+c=a(x-x_1)(x-x_2),\quad x_1+x_2=-\dfrac{b}{a},\quad x_1x_2=\dfrac{c}{a}`,
      R`x_1^2+x_2^2=(x_1+x_2)^2-2x_1x_2`,
      R`\sqrt{A}=B\iff B\ge 0\ \text{és}\ A=B^2`,
      R`|A|=B\iff B\ge0\ \text{és}\ (A=B\ \text{vagy}\ A=-B)`,
      R`|x-a|<r\iff a-r<x<a+r`,
      R`a^{f}=a^{g}\iff f=g\ (a>0,\ a\ne1);\quad \log_a f=c\iff f=a^c\ (f>0)`,
      R`\sin x=c:\ x=\alpha+k\cdot360^\circ\ \text{vagy}\ 180^\circ-\alpha+k\cdot360^\circ`,
      R`\text{negatív számmal szorozva a relációjel megfordul}`
    ],
    cheatChecks: [
      ['(p+q)^2-2*p*q', 'p^2+q^2'],
      ['x^2-(p+q)*x+p*q', '(x-p)*(x-q)'],
      ['1/p+1/q', '(p+q)/(p*q)'],
      ['(p-q)^2', '(p+q)^2-4*p*q'],
      ['|x-3|^2', '(x-3)^2']
    ],
    terms: ['egyenlet', 'alaphalmaz', 'értelmezési tartomány', 'megoldáshalmaz', 'ekvivalens átalakítás', 'következményegyenlet', 'hamis gyök', 'gyökvesztés', 'mérlegelv', 'diszkrimináns', 'megoldóképlet', 'gyöktényezős alak', 'Viète-formulák', 'teljes négyzetté alakítás', 'új ismeretlen', 'bikvadratikus egyenlet', 'paraméteres egyenlet', 'előjelvizsgálat', 'egyenlőtlenség-rendszer', 'abszolútértékes egyenlet', 'logaritmusos egyenlet', 'exponenciális egyenlet', 'trigonometrikus egyenlet', 'grafikus megoldás']
  };

  /* ===================== feladatgenerátorok ===================== */

  def('a3-eg-1', 'algebra', 'egyenletek', 1, 'Elsőfokú egyenlet megoldása', function (r) {
    var x0 = r.int(-9, 9), a = r.nz(-8, 8), c, b = r.int(-12, 12), d;
    do { c = r.nz(-8, 8); } while (c === a);
    d = (a - c) * x0 + b;
    return {
      q: R`Oldd meg a valós számok halmazán az egyenletet: $${lx(a, b)} = ${lx(c, d)}$. Add meg az $x$ értékét.`,
      answer: { type: 'num', value: x0 }, ansTex: R`x=${K.T(x0)}`,
      verify: `((${d})-(${b}))/((${a})-(${c}))`,
      tip1: R`Rendezd az ismeretlent tartalmazó tagokat az egyik oldalra, a számokat a másikra.`,
      tip2: R`Az átrendezés után $${tm(a - c, 'x', true)} = ${d - b}$ adódik.`,
      sol: [
        R`Az ismeretlenes tagokat balra, a számokat jobbra rendezzük: $${tm(a - c, 'x', true)} = ${d - b}$.`,
        R`Osztunk az $x$ együtthatójával (ez nem nulla): $x = \dfrac{${d - b}}{${a - c}} = ${K.T(x0)}$.`,
        R`Ellenőrzés: bal oldal $${a * x0 + b}$, jobb oldal $${c * x0 + d}$. Egyenlők, tehát $x = ${K.T(x0)}$.`
      ]
    };
  });

  def('a3-eg-2', 'algebra', 'egyenletek', 1, 'Kétismeretlenes elsőfokú egyenletrendszer', function (r) {
    var x0 = r.int(-6, 6), y0 = r.int(-6, 6), a1, b1, a2, b2, det, askx = r() < 0.5, c1, c2;
    do { a1 = r.nz(-5, 5); b1 = r.nz(-5, 5); a2 = r.nz(-5, 5); b2 = r.nz(-5, 5); det = a1 * b2 - a2 * b1; } while (det === 0);
    c1 = a1 * x0 + b1 * y0; c2 = a2 * x0 + b2 * y0;
    var D = `((${a1})*(${b2})-(${a2})*(${b1}))`;
    return {
      q: R`Oldd meg az egyenletrendszert a valós számok halmazán: $\begin{cases} ${tm(a1, 'x', true) + tm(b1, 'y', false)} = ${c1} \\ ${tm(a2, 'x', true) + tm(b2, 'y', false)} = ${c2} \end{cases}$ Mennyi ${askx ? '$x$' : '$y$'} értéke?`,
      answer: { type: 'num', value: askx ? x0 : y0 }, ansTex: askx ? R`x=${K.T(x0)}` : R`y=${K.T(y0)}`,
      verify: askx ? `((${c1})*(${b2})-(${c2})*(${b1}))/${D}` : `((${a1})*(${c2})-(${a2})*(${c1}))/${D}`,
      tip1: R`Egyenlő együtthatók módszere: szorozd meg az egyenleteket úgy, hogy az egyik ismeretlen együtthatója azonos legyen.`,
      tip2: R`Az első egyenletet szorozd ezzel: $${b2}$, a másodikat ezzel: $${b1}$. Így az $y$ együtthatója mindkét helyen $${b1 * b2}$.`,
      sol: [
        R`Az első egyenletet szorozzuk ezzel: $${b2}$, a másodikat ezzel: $${b1}$, hogy az $y$ együtthatója egyenlő legyen ($${b1 * b2}$).`,
        R`Kivonva egymásból az egyenleteket: $${det === 1 ? '' : det === -1 ? '-' : det}x = ${c1 * b2 - c2 * b1}$, tehát $x = ${K.T(x0)}$.`,
        R`Visszahelyettesítve az első egyenletbe: $y = ${K.T(y0)}$. Ellenőrzés: $${c1}$ és $${c2}$ valóban kijön mindkét egyenletből.`
      ]
    };
  });

  def('a3-eg-3', 'algebra', 'egyenletek', 1, 'Másodfokú egyenlet megoldóképlettel', function (r) {
    var p = r.int(-8, 8), q;
    do { q = r.int(-8, 8); } while (q === p);
    var b = -(p + q), c = p * q, D = b * b - 4 * c;
    return {
      q: R`Oldd meg a valós számok halmazán: $${K.tex(K.poly([1, b, c]))} = 0$. A megoldásokat pontosvesszővel elválasztva add meg.`,
      answer: { type: 'set', values: [p, q] }, ansTex: R`x\in${setTex([p, q])}`,
      verify: `(-(${b})+sqrt((${b})^2-4*(${c})))/2;(-(${b})-sqrt((${b})^2-4*(${c})))/2`,
      tip1: R`Használd a megoldóképletet; $a = 1$, $b = ${b}$, $c = ${c}$.`,
      tip2: R`A diszkrimináns $D = b^2 - 4ac = ${D}$, a négyzetgyöke $${Math.sqrt(D)}$.`,
      sol: [
        R`$D = b^2 - 4ac = ${K.par(b)}^2 - 4 \cdot ${K.par(c)} = ${D}$, $\sqrt{D} = ${Math.sqrt(D)}$.`,
        R`$x = \dfrac{-${K.par(b)} \pm ${Math.sqrt(D)}}{2}$, tehát $x_1 = ${K.T(Math.max(p, q))}$ és $x_2 = ${K.T(Math.min(p, q))}$.`,
        R`Ellenőrzés Viète-képlettel: az összeg $${p + q} = -b$, a szorzat $${c} = c$ ✓.`
      ]
    };
  });

  def('a3-eg-4', 'algebra', 'egyenletek', 1, 'Elsőfokú egyenlőtlenség egész megoldása', function (r) {
    var a = r.nz(-7, 7), c, b = r.int(-15, 15), d = r.int(-15, 15), strict = r() < 0.5, k, m, x, best = null, big;
    do { c = r.nz(-7, 7); } while (c === a);
    k = a - c; m = d - b; big = k > 0;
    for (x = -80; x <= 80; x++) {
      var lhs = a * x + b, rhs = c * x + d, ok = strict ? lhs < rhs : lhs <= rhs;
      if (ok && (best === null || (big ? x > best : x < best))) best = x;
    }
    var rl = strict ? '<' : '\\le', flip = k < 0 ? (strict ? '>' : '\\ge') : rl;
    return {
      q: R`Melyik a ${big ? 'legnagyobb' : 'legkisebb'} egész szám, amely megoldása a valós számok halmazán az $${lx(a, b)} ${rl} ${lx(c, d)}$ egyenlőtlenségnek?`,
      answer: { type: 'num', value: best }, ansTex: K.T(best),
      verify: String(best),
      tip1: R`Rendezd az egyenlőtlenséget $x$-re; ha negatív számmal osztasz, a relációjel megfordul.`,
      tip2: R`Az átrendezés után $${tm(k, 'x', true)} ${rl} ${m}$ adódik. Figyelj arra, hogy a határérték megoldás-e.`,
      sol: [
        R`Rendezés: $${tm(k, 'x', true)} ${rl} ${m}$.`,
        R`Osztás ezzel: $${k}$.${k < 0 ? ' Negatív számmal osztunk, ezért a relációjel megfordul.' : ''} Így $x ${flip} ${K.q(m, k)}$.`,
        R`A ${big ? 'legnagyobb' : 'legkisebb'} egész megoldás: $${K.T(best)}$.`
      ]
    };
  });

  def('a3-eg-5', 'algebra', 'egyenletek', 1, 'A másodfokú egyenlet diszkriminánsa', function (r) {
    var a = r.nz(-4, 4), b = r.int(-9, 9), c = r.int(-9, 9), D = b * b - 4 * a * c;
    var cnt = D > 0 ? 'két különböző valós gyöke van' : D === 0 ? 'egy (kétszeres) valós gyöke van' : 'nincs valós gyöke';
    return {
      q: R`Mennyi a $${K.tex(K.poly([a, b, c]))} = 0$ másodfokú egyenlet diszkriminánsának értéke?`,
      answer: { type: 'num', value: D }, ansTex: K.T(D),
      verify: `(${b})^2-4*(${a})*(${c})`,
      tip1: R`A diszkrimináns képlete: $D = b^2 - 4ac$.`,
      tip2: R`Itt $a = ${a}$, $b = ${b}$, $c = ${c}$.`,
      sol: [
        R`$a = ${a}$, $b = ${b}$, $c = ${c}$.`,
        R`$D = b^2 - 4ac = ${K.par(b)}^2 - 4 \cdot ${K.par(a)} \cdot ${K.par(c)} = ${D}$.`,
        R`Mivel $D ${D > 0 ? '> 0' : D === 0 ? '= 0' : '< 0'}$, az egyenletnek ${cnt}.`
      ]
    };
  });

  def('a3-eg-6', 'algebra', 'egyenletek', 1, 'Hány valós gyöke van? (diszkrimináns)', function (r) {
    var a = r.nz(-4, 4), cat = r.int(0, 2), p = r.int(-5, 5), q, k, cs;
    if (cat === 2) { do { q = r.int(-5, 5); } while (q === p); cs = [a, -a * (p + q), a * p * q]; }
    else if (cat === 1) { cs = [a, -2 * a * p, a * p * p]; }
    else { k = r.int(1, 6); cs = [a, -2 * a * p, a * (p * p + k)]; }
    var D = cs[1] * cs[1] - 4 * cs[0] * cs[2];
    var txt = ['Nincs valós gyöke', 'Egy valós gyöke van', 'Két különböző valós gyöke van'];
    return {
      q: R`Hány valós gyöke van az $${K.tex(K.poly(cs))} = 0$ egyenletnek?`,
      answer: K.choice(r, txt[cat], [txt[(cat + 1) % 3], txt[(cat + 2) % 3], 'Végtelen sok valós gyöke van']),
      ansTex: R`\text{${txt[cat]}}`,
      tip1: R`Számítsd ki a diszkriminánst: $D = b^2 - 4ac$.`,
      tip2: R`$D > 0$: két gyök; $D = 0$: egy gyök; $D < 0$: nincs valós gyök.`,
      sol: [
        R`$D = ${K.par(cs[1])}^2 - 4 \cdot ${K.par(cs[0])} \cdot ${K.par(cs[2])} = ${D}$.`,
        R`${txt[cat]}, mert $D ${D > 0 ? '> 0' : D === 0 ? '= 0' : '< 0'}$.`
      ]
    };
  });

  def('a3-eg-7', 'algebra', 'egyenletek', 2, 'Négyzetgyökös egyenlet hamis gyökkel', function (r) {
    var q = r.int(-6, 2), p = q + 2 * r.int(1, 4) + 1, t = (p + q - 1) / 2, s = t * t - p * q, w = p - t;
    return {
      q: R`Oldd meg a valós számok halmazán: $\sqrt{${lx(1, s)}} = ${lx(1, -t)}$. A megoldásokat pontosvesszővel elválasztva add meg.`,
      answer: { type: 'set', values: [p] }, ansTex: R`x\in${setTex([p])}`,
      verify: `(${2 * t + 1}+sqrt(${4 * t + 1 + 4 * s}))/2`,
      tip1: R`Emeld négyzetre az egyenletet, de a végén ellenőrizz: a négyzetre emelés hamis gyököt hozhat be.`,
      tip2: R`Négyzetre emelés után $x^2 - ${2 * t + 1}x + ${t * t - s} = 0$ jellegű egyenletet kapsz ($x^2 ${K.sgn(-(2 * t + 1))} ${Math.abs(2 * t + 1)}x ${K.sgn(t * t - s)} ${Math.abs(t * t - s)} = 0$). A jobb oldal nemnegatív kell legyen.`,
      sol: [
        R`Kikötés: a gyök alatt $${lx(1, s)} \geq 0$, és a jobb oldal nemnegatív: $${lx(1, -t)} \geq 0$, azaz $x \geq ${t}$.`,
        R`Négyzetre emelés: $${lx(1, s)} = (${lx(1, -t)})^2$, rendezve $${K.tex(K.poly([1, -(2 * t + 1), t * t - s]))} = 0$. A gyökök: $x = ${p}$ és $x = ${q}$.`,
        R`$x = ${q}$ nem felel meg a $x \geq ${t}$ feltételnek (hamis gyök). Az $x = ${p}$ esetén $\sqrt{${w * w}} = ${w}$ ✓.`
      ]
    };
  });

  def('a3-eg-8', 'algebra', 'egyenletek', 2, 'Abszolútértékes egyenlet két abszolútértékkel', function (r) {
    var a = r.int(-6, 6), b, k, lo, hi;
    do { b = r.int(-6, 6); } while (b === a);
    k = Math.abs(a - b) + 2 * r.int(1, 4); lo = Math.min(a, b); hi = Math.max(a, b);
    var x1 = (a + b - k) / 2, x2 = (a + b + k) / 2;
    return {
      q: R`Oldd meg a valós számok halmazán: $\left|${xm(a)}\right| + \left|${xm(b)}\right| = ${k}$. A megoldásokat pontosvesszővel elválasztva add meg.`,
      answer: { type: 'set', values: [x1, x2] }, ansTex: R`x\in${setTex([x1, x2])}`,
      verify: `(${a}+(${b})-${k})/2;(${a}+(${b})+${k})/2`,
      tip1: R`Az abszolútértékek zérushelyei ($${lo}$ és $${hi}$) három szakaszra osztják a számegyenest; mindegyiken külön oldd meg.`,
      tip2: R`A két zérushely közötti szakaszon a bal oldal állandó ($${hi - lo}$). Egy gyököt csak akkor fogadj el, ha beleesik a szakaszba.`,
      sol: [
        R`Zérushelyek: $${lo}$ és $${hi}$. Három szakasz: $x < ${lo}$, $${lo} \leq x < ${hi}$, $x \geq ${hi}$.`,
        R`$x < ${lo}$: $${-lo - hi}$-ből a bal oldal $${a + b} - 2x = ${k}$, innen $x = ${K.T(x1)}$ ($< ${lo}$ ✓).`,
        R`$${lo} \leq x < ${hi}$: a bal oldal állandó, $${hi - lo} \neq ${k}$, itt nincs megoldás.`,
        R`$x \geq ${hi}$: $2x - ${K.par(a + b)} = ${k}$, innen $x = ${K.T(x2)}$ ($\geq ${hi}$ ✓).`
      ].map(function (s, i) { return i === 1 ? R`$x < ${lo}$ esetén mindkét abszolútérték belseje negatív, a bal oldal $${K.T(a + b)} - 2x = ${k}$ (előjelhelyesen: $-(x-${K.par(a)}) - (x-${K.par(b)})$), innen $x = ${K.T(x1)}$ ($< ${lo}$ ✓).` : s; })
    };
  });

  def('a3-eg-9', 'algebra', 'egyenletek', 2, 'Exponenciális egyenlet új ismeretlennel', function (r) {
    var A = r.pick([2, 3, 5]), u = r.int(0, 3), v;
    do { v = r.int(0, 3); } while (v === u);
    var S = Math.pow(A, u) + Math.pow(A, v), P = Math.pow(A, u + v);
    return {
      q: R`Oldd meg a valós számok halmazán: $${A}^{2x} - ${S} \cdot ${A}^x + ${P} = 0$. A megoldásokat pontosvesszővel elválasztva add meg.`,
      answer: { type: 'set', values: [u, v] }, ansTex: R`x\in${setTex([u, v])}`,
      verify: `ln(${Math.pow(A, u)})/ln(${A});ln(${Math.pow(A, v)})/ln(${A})`,
      tip1: R`Vezess be új ismeretlent: $t = ${A}^x$, és ne felejtsd el, hogy $t > 0$.`,
      tip2: R`Az új ismeretlennel $t^2 - ${S}t + ${P} = 0$. Oldd meg, majd az $${A}^x = t$ egyenletekből kapd meg $x$-et.`,
      sol: [
        R`Legyen $t = ${A}^x > 0$. Ekkor $${A}^{2x} = t^2$, és $t^2 - ${S}t + ${P} = 0$.`,
        R`$(t - ${Math.pow(A, u)})(t - ${Math.pow(A, v)}) = 0$ (a gyökök összege $${S}$, szorzata $${P}$), így $t = ${Math.pow(A, u)}$ vagy $t = ${Math.pow(A, v)}$. Mindkettő pozitív.`,
        R`$${A}^x = ${Math.pow(A, u)}$ esetén $x = ${u}$; $${A}^x = ${Math.pow(A, v)}$ esetén $x = ${v}$.`
      ]
    };
  });

  def('a3-eg-10', 'algebra', 'egyenletek', 2, 'Logaritmusos egyenlet kikötéssel', function (r) {
    var i = r.int(0, 2), j = r.int(i + 1, 5), d = Math.pow(2, j) - Math.pow(2, i), k = i + j, p = Math.pow(2, j), qq = -Math.pow(2, i);
    return {
      q: R`Oldd meg a valós számok halmazán: $\log_2 x + \log_2 (${xm(d)}) = ${k}$. A megoldásokat pontosvesszővel elválasztva add meg.`,
      answer: { type: 'set', values: [p] }, ansTex: R`x\in${setTex([p])}`,
      verify: `(${d}+sqrt(${d}^2+4*2^${k}))/2`,
      tip1: R`Kikötés: mindkét logaritmus argumentuma pozitív. Utána vond össze a logaritmusokat, és írd át hatványalakra.`,
      tip2: R`Az összevonás után $x(x - ${d}) = 2^{${k}} = ${Math.pow(2, k)}$. A megoldásokat vesd össze a kikötéssel.`,
      sol: [
        R`Kikötés: $x > 0$ és $x - ${d} > 0$, azaz $x > ${d}$.`,
        R`Összevonva: $\log_2 \big(x(x-${d})\big) = ${k}$, azaz $x(x-${d}) = 2^{${k}} = ${Math.pow(2, k)}$, rendezve $x^2 - ${d === 1 ? '' : d}x - ${Math.pow(2, k)} = 0$.`,
        R`A gyökök: $x = ${p}$ és $x = ${qq}$ (összegük $${d}$, szorzatuk $${-Math.pow(2, k)}$). A $${qq}$ nem felel meg a kikötésnek (hamis gyök).`,
        R`Ellenőrzés: $x = ${p}$ esetén $\log_2 ${p} + \log_2 ${p - d} = ${j} + ${i} = ${k}$ ✓.`
      ]
    };
  });

  def('a3-eg-11', 'algebra', 'egyenletek', 2, 'Másodfokú egyenlőtlenség egész megoldásainak száma', function (r) {
    var p = r.int(-8, 4), q = p + r.int(2, 9), sgn = r() < 0.5 ? 1 : -1, strict = r() < 0.5;
    var op = sgn === 1 ? (strict ? '<' : '<=') : (strict ? '>' : '>='), n = q - p + (strict ? -1 : 1), cnt = 0, x;
    for (x = -60; x <= 60; x++) if (holds(sgn * (x - p) * (x - q), op)) cnt++;
    var cs = [sgn, -sgn * (p + q), sgn * p * q];
    return {
      q: R`Hány egész szám elégíti ki a valós számok halmazán a $${K.tex(K.poly(cs))} ${rel(op)} 0$ egyenlőtlenséget?`,
      answer: { type: 'num', value: n }, ansTex: K.T(n),
      verify: String(cnt),
      tip1: R`Keresd meg a bal oldal gyökeit, és gondold végig, hol van a parabola a tengely alatt vagy felett.`,
      tip2: R`A gyökök: $${p}$ és $${q}$. A végpontok ${strict ? 'nem' : 'is'} megoldások${strict ? ' (szigorú reláció)' : ' (nem szigorú reláció)'}.`,
      sol: [
        R`A bal oldal gyöktényezős alakja: $${sgn === 1 ? '' : '-'}(${xm(p)})(${xm(q)})$, tehát a gyökök $${p}$ és $${q}$.`,
        R`A megoldás: $${strict ? ']' : '['}${p}; ${q}${strict ? '[' : ']'}$ (${sgn === 1 ? 'a gyökök között a parabola a tengely alatt van' : 'a gyökök között a lefelé nyíló parabola a tengely felett van'}).`,
        R`Az egész számok száma: $${q} - ${K.par(p)} ${strict ? '- 1' : '+ 1'} = ${n}$.`
      ]
    };
  });

  def('a3-eg-12', 'algebra', 'egyenletek', 3, 'Paraméteres másodfokú egyenlet gyökeinek négyzetösszege', function (r) {
    var p0 = r.int(2, 7), c, S;
    do { c = r.nz(-6, 6); } while (p0 * p0 <= 4 * c);
    S = p0 * p0 - 2 * c;
    return {
      q: R`Az $x^2 - px ${c < 0 ? '-' : '+'} ${Math.abs(c)} = 0$ egyenletben $p$ valós paraméter. Add meg $p$ összes olyan értékét, amelyre az egyenletnek két különböző valós gyöke van, és a gyökök négyzetösszege $${S}$. A megoldásokat pontosvesszővel elválasztva add meg.`,
      answer: { type: 'set', values: [p0, -p0] }, ansTex: R`p\in${setTex([p0, -p0])}`,
      verify: `sqrt(${S}+2*(${c}));-sqrt(${S}+2*(${c}))`,
      tip1: R`Viète-formulák: $x_1 + x_2 = p$ és $x_1 x_2 = ${c}$. A négyzetösszeg: $(x_1+x_2)^2 - 2x_1x_2$.`,
      tip2: R`A feltételből $p^2 - 2 \cdot ${K.par(c)} = ${S}$. Ne felejtsd ellenőrizni, hogy $D > 0$ teljesül-e.`,
      sol: [
        R`Viète: $x_1 + x_2 = p$, $x_1x_2 = ${c}$. Így $x_1^2 + x_2^2 = p^2 - 2 \cdot ${K.par(c)} = p^2 ${c < 0 ? '+' : '-'} ${2 * Math.abs(c)}$.`,
        R`A feltétel: $p^2 ${c < 0 ? '+' : '-'} ${2 * Math.abs(c)} = ${S}$, azaz $p^2 = ${p0 * p0}$, tehát $p = ${p0}$ vagy $p = ${-p0}$.`,
        R`$D = p^2 - 4 \cdot ${K.par(c)} = ${p0 * p0 - 4 * c} > 0$ mindkét $p$-re, tehát két különböző valós gyök van. Mindkét érték megfelel.`
      ]
    };
  });

  def('a3-eg-13', 'algebra', 'egyenletek', 3, 'Másodfokú egyenletrendszer', function (r) {
    var p = r.int(-7, 7), q, d, n, D2;
    do { q = r.int(-7, 7); } while (q === p);
    d = p + q; n = p * p + q * q; D2 = 2 * n - d * d;
    return {
      q: R`Oldd meg a valós számok halmazán: $x - y = ${d}$ és $x^2 + y^2 = ${n}$. Add meg $x$ összes lehetséges értékét pontosvesszővel elválasztva.`,
      answer: { type: 'set', values: [p, q] }, ansTex: R`x\in${setTex([p, q])}`,
      verify: `(${d}+sqrt(2*${n}-(${d})^2))/2;(${d}-sqrt(2*${n}-(${d})^2))/2`,
      tip1: R`Az elsőből fejezd ki $y$-t: $y = x - ${d}$, és helyettesítsd a másodikba.`,
      tip2: R`Behelyettesítés után $x^2 + (x - ${d})^2 = ${n}$, rendezve $2x^2 - ${2 * d}x + ${d * d - n} = 0$ jellegű másodfokú egyenlet adódik.`,
      sol: [
        R`$y = x - ${K.par(d)}$, ezt a másodikba: $x^2 + (x - ${K.par(d)})^2 = ${n}$.`,
        R`Rendezve: $${K.tex(K.poly([2, -2 * d, d * d - n]))} = 0$, $D = ${4 * d * d - 8 * (d * d - n)} = ${D2 * 4}$, $\sqrt{D} = ${2 * Math.abs(p - q)}$.`,
        R`$x = \dfrac{${2 * d} \pm ${2 * Math.abs(p - q)}}{4}$, így $x = ${K.T(Math.max(p, q))}$ vagy $x = ${K.T(Math.min(p, q))}$. A hozzájuk tartozó $y$ értékek: $${K.T(Math.max(p, q) - d)}$ és $${K.T(Math.min(p, q) - d)}$.`,
        R`Ellenőrzés: $x = ${K.T(p)}$, $y = ${K.T(-q)}$ esetén $x - y = ${d}$ és $x^2+y^2 = ${n}$ ✓.`
      ]
    };
  });

  def('a3-eg-14', 'algebra', 'egyenletek', 3, 'Törtes egyenlőtlenség: hány egész megoldás?', function (r) {
    var k = r.pick([2, 3, 4]), m = r.nz(-5, 5), a = r.int(-8, 8), b = a + (k - 1) * m, x0 = b + m, cnt = 0, x;
    for (x = -120; x <= 120; x++) { if (x === b) continue; var nn = (x - a) - k * (x - b), dd = x - b; if (nn * dd >= 0) cnt++; }
    return {
      q: R`Hány egész szám elégíti ki a valós számok halmazán az $\dfrac{${xm(a)}}{${xm(b)}} \geq ${k}$ egyenlőtlenséget?`,
      answer: { type: 'num', value: Math.abs(m) }, ansTex: K.T(Math.abs(m)),
      verify: String(cnt),
      tip1: R`Ne szorozz a nevezővel (az előjele nem ismert). Vond ki mindkét oldalból ezt a számot: $${k}$. Utána hozz közös nevezőre, és végezz előjelvizsgálatot.`,
      tip2: R`A nevező zérushelye $${b}$ (ez nem lehet megoldás), a számláló zérushelye $${x0}$.`,
      sol: [
        R`Kikötés: $x \neq ${b}$.`,
        R`Rendezés: $\dfrac{x - ${K.par(a)}}{x - ${K.par(b)}} - ${k} = \dfrac{${K.tex(K.poly([1 - k, k * b - a]))}}{x - ${K.par(b)}} \geq 0$. A számláló együtthatója ($${1 - k}$) negatív, a számlálóból $-${k - 1}$ kiemelhető, és ez $(x - ${K.par(x0)})$-ra bomlik, ezért az egyenlőtlenség $\dfrac{x - ${K.par(x0)}}{x - ${K.par(b)}} \leq 0$.`,
        R`Előjelvizsgálat: a tört akkor nempozitív, ha $x$ a $${Math.min(b, x0)}$ és $${Math.max(b, x0)}$ között van; $x = ${x0}$ megoldás (a tört $0$), $x = ${b}$ nem (a nevező $0$).`,
        R`A megoldáshalmaz $${m > 0 ? ']' + b + '; ' + x0 + ']' : '[' + x0 + '; ' + b + '['}$, ebben $${Math.abs(m)}$ egész szám van.`
      ]
    };
  });

  def('a3-eg-15', 'algebra', 'egyenletek', 3, 'Trigonometrikus egyenlet másodfokúra visszavezetve', function (r) {
    var useSin = r() < 0.5, vals = [-2, -1, 0, 1, 2], U, V, A = 4, B, C, g;
    var sinT = { '-2': [270], '-1': [210, 330], '0': [0, 180], '1': [30, 150], '2': [90] };
    var cosT = { '-2': [180], '-1': [120, 240], '0': [90, 270], '1': [60, 300], '2': [0] };
    U = r.pick(vals);
    do { V = r.pick(vals); } while (V === U);
    B = -2 * (U + V); C = U * V; g = gcd2(gcd2(A, B), C);
    A /= g; B /= g; C /= g;
    var tab = useSin ? sinT : cosT, angs = tab[String(U)].concat(tab[String(V)]).sort(function (p, q) { return p - q; });
    var f = useSin ? { sq: '\\sin^2 x', one: '\\sin x' } : { sq: '\\cos^2 x', one: '\\cos x' }, nm = useSin ? '\\sin x' : '\\cos x';
    function vtx(w) { return w === 0 ? '0' : (w === 2 ? '1' : w === -2 ? '-1' : (w < 0 ? '-' : '') + '\\dfrac{1}{2}').replace('\\dfrac{1}{2}', Math.abs(w) === 1 ? '\\dfrac{1}{2}' : '1'); }
    function half(w) { return w === 0 ? '0' : Math.abs(w) === 2 ? (w < 0 ? '-1' : '1') : (w < 0 ? '-' : '') + '\\dfrac{1}{2}'; }
    return {
      q: R`Oldd meg a $0^\circ \leq x < 360^\circ$ intervallumon az $${trigPoly(A, B, C, f)} = 0$ egyenletet. Add meg a megoldásokat fokban, pontosvesszővel elválasztva.`,
      answer: { type: 'set', values: angs }, ansTex: R`x\in${setTex(angs)}`,
      verify: angs.join(';'),
      tip1: R`Vezess be új ismeretlent: $t = ${nm}$ (ahol $-1 \leq t \leq 1$), oldd meg a másodfokú egyenletet, majd keresd meg a szögeket.`,
      tip2: R`A másodfokú egyenlet gyökei $t = ${half(U)}$ és $t = ${half(V)}$. Gondold végig mindkettőhöz az egységkörön a $0^\circ$ és $360^\circ$ közötti szögeket.`,
      sol: [
        R`Legyen $t = ${nm}$. Ekkor $${trigPoly(A, B, C, { sq: 't^2', one: 't' })} = 0$, ez ekvivalens azzal, hogy $(2t - ${K.par(U)})(2t - ${K.par(V)}) = 0$ (a bal oldal az $(2t - ${K.par(U)})(2t - ${K.par(V)})$ szorzat konstansszorosa).`,
        R`Innen $t = ${half(U)}$ vagy $t = ${half(V)}$; mindkettő eleme a $[-1; 1]$ intervallumnak, tehát mindkettő használható.`,
        R`$${nm} = ${half(U)}$ megoldásai: $${tab[String(U)].join('^\\circ;\\ ')}^\circ$; $${nm} = ${half(V)}$ megoldásai: $${tab[String(V)].join('^\\circ;\\ ')}^\circ$.`
      ]
    };
  });
})(typeof window !== 'undefined' ? window : globalThis);
