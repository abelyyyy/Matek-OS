(function (root) {
  'use strict';
  var MO = root.MO = root.MO || {};
  var K = MO.taskKit, R = K.R, def = K.def;
  MO.content = MO.content || {};

  /* pitagoraszi számhármasok (a, b, átfogó) */
  var TR = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29], [6, 8, 10]];
  function trip(r) { var t = r.pick(TR), k = r.int(1, 3); return [t[0] * k, t[1] * k, t[2] * k]; }
  var DEG = R`^\circ`;

  /* ===================== 4.1 Elemi geometria ===================== */
  MO.content['geometria/elemigeo'] = {
    intro: R`Az elemi geometria a sík és a tér legalapvetőbb fogalmait rendezi: mit tekintünk alapfogalomnak, axiómának, definíciónak és tételnek, hogyan helyezkedhetnek el egymáshoz képest pontok, egyenesek és síkok, hogyan mérjük a távolságukat és a hajlásszögüket, és milyen ponthalmazokat definiálunk a távolság segítségével (kör, gömb, szakaszfelező merőleges, szögfelező). Az érettségi követelmény 4.1 pontja ezt kéri; emelt szinten a kitérő egyenesek távolsága és hajlásszöge, valamint a parabola fogalma is szerepel. Térgeometriai feladatokban ezekre az alapokra támaszkodunk.`,
    theory: [
      { h: 'Alapfogalom, axióma, definíció, tétel',
        b: R`A geometria (és általában a matematika) felépítése négy elemből áll.\n\n- **Alapfogalom:** nem definiáljuk, csak a tulajdonságait rögzítjük (pont, egyenes, sík, illeszkedés, a pontok közötti „között van” viszony).\n- **Axióma:** bizonyítás nélkül elfogadott alapigazság, például: két különböző ponton át pontosan egy egyenes húzható; egy egyenesen kívüli ponton át pontosan egy párhuzamos húzható az egyenessel (párhuzamossági axióma).\n- **Definiált fogalom:** korábbi fogalmakkal pontosan megadott új fogalom (például: a *kör* egy adott ponttól egyenlő távolságra lévő pontok halmaza a síkban).\n- **Tétel:** bizonyított állítás, általában „ha A, akkor B” alakú. Az **A -> B** tétel **megfordítása** a „ha B, akkor A” állítás; ez nem következik automatikusan, külön bizonyítani kell (a Pitagorasz-tétel megfordítása igaz, de nem minden tételé: a „ha egy négyszög rombusz, akkor átlói merőlegesek” tétel megfordítása, vagyis hogy „ha egy négyszög átlói merőlegesek, akkor rombusz”, hamis, ellenpélda egy nem rombusz deltoid).` },
      { h: 'Térelemek és kölcsönös helyzetük',
        b: R`**Térelemek:** pont, egyenes, félegyenes, szakasz, sík, félsík, féltér (a sík által határolt térrész), szög, valamint a belőlük összerakott alakzatok.\n\n**Két egyenes** helyzete a térben:\n- **metsző:** pontosan egy közös pontjuk van;\n- **párhuzamos:** egy síkban vannak és nincs közös pontjuk (az egybeesőket is szokás párhuzamosnak tekinteni);\n- **kitérő:** nincsenek egy síkban, így nincs közös pontjuk, és nem is párhuzamosak.\n\n**Egyenes és sík:** az egyenes illeszkedik a síkra, vagy metszi (egy közös pont), vagy párhuzamos vele (nincs közös pont).\n\n**Két sík:** egybeesik, vagy metsző (közös egyenesük a metszésvonal), vagy párhuzamos (nincs közös pont).\n\nHasznos tény: egy síkot meghatároz három nem egy egyenesen levő pont; egy egyenes és egy rajta kívüli pont; két metsző egyenes; két párhuzamos egyenes. **Két kitérő egyenes nem fekszik közös síkban.**` },
      { h: 'Szögek, szögek osztályozása, szögpárok',
        b: R`A **szög** két közös kezdőpontú félegyenes (a szárak) által határolt síkrész. Nagyság szerint: **nullszög** ($0^\circ$), **hegyesszög** ($0^\circ < \alpha < 90^\circ$), **derékszög** ($90^\circ$), **tompaszög** ($90^\circ < \alpha < 180^\circ$), **egyenesszög** ($180^\circ$), **homorúszög** ($180^\circ < \alpha < 360^\circ$), **teljesszög** ($360^\circ$).\n\n**Nevezetes szögpárok:**\n- **Pótszögek:** összegük $90^\circ$.\n- **Kiegészítő szögek:** összegük $180^\circ$.\n- **Mellékszögek:** közös száruk van, a másik két száruk egy egyenest alkot; összegük $180^\circ$.\n- **Csúcsszögek:** két metsző egyenes által alkotott, egymással szemközti szögek; **egyenlők**.\n\n**Két egyenest metsző harmadik egyenesnél** a keletkező szögpárok: **váltószögek**, **egyállású** (megfelelő) szögek és **társszögek**. Ha a két egyenes **párhuzamos**, akkor a váltószögek és az egyállású szögek egyenlők, a társszögek összege $180^\circ$. Ez meg is fordítható: ha a váltószögek (vagy az egyállású szögek) egyenlők, vagy a társszögek összege $180^\circ$, akkor az egyenesek párhuzamosak.\n\nMerőleges szárú szögek: ha mindkettő hegyesszög (vagy mindkettő tompa), egyenlők; ha az egyik hegyes, a másik tompa, összegük $180^\circ$.` },
      { h: 'Távolság és hajlásszög',
        b: R`Két ponthalmaz **távolsága** a pontjaik közötti távolságok minimuma (ha van ilyen). Ebből adódnak a szokásos esetek:\n- **pont és egyenes (illetve sík)** távolsága: a pontból az egyenesre (síkra) bocsátott **merőleges szakasz** hossza, mert ez a legrövidebb;\n- **párhuzamos egyenesek** távolsága: az egyik egyenes tetszőleges pontjának távolsága a másiktól (mindenhol ugyanannyi);\n- **egyenes és vele párhuzamos sík**, valamint **párhuzamos síkok** távolsága: az egyik alakzat egy pontjának távolsága a másiktól.\n\n**Hajlásszög:**\n- **két metsző egyenesé:** a keletkező szögek közül a kisebbik (legfeljebb $90^\circ$); párhuzamos egyeneseké $0^\circ$;\n- **egyenes és sík:** az egyenes és a síkra vett **merőleges vetülete** által bezárt szög (merőleges egyenesnél $90^\circ$, párhuzamosnál $0^\circ$);\n- **két sík:** a metszésvonal egy pontjában mindkét síkban a metszésvonalra állított merőlegesek szöge. Párhuzamos síkoké $0^\circ$.` },
      { h: 'Kitérő egyenesek távolsága és hajlásszöge', level: 'emelt',
        b: R`Két **kitérő egyenes** hajlásszögét úgy kapjuk, hogy a tér egy tetszőleges pontján át mindkettővel párhuzamos egyenest húzunk, és ezeknek a metsző egyeneseknek vesszük a hajlásszögét (legfeljebb $90^\circ$). Ha ez $90^\circ$, a kitérő egyenesek **merőlegesek** egymásra.\n\nA **távolságuk**: létezik pontosan egy olyan egyenes, amely mindkettőt metszi és mindkettőre merőleges (**normáltranszverzális**); a két metszéspont távolsága a két kitérő egyenes távolsága. Ez ugyanannyi, mint\n- az egyik egyenes és a másikon át az elsővel párhuzamosan fektetett sík távolsága, illetve\n- a két egyenesen át fektetett, egymással párhuzamos síkok távolsága.\n\nSzámolásban gyakran ez a kényelmes út: a távolságot egy pont–sík távolságra vezetjük vissza, amit térfogatból (gúla $V = \dfrac{T \cdot m}{3}$) vagy koordinátákkal is meg lehet kapni.`,
        proof: R`Állítás: két kitérő egyenesnek pontosan egy normáltranszverzálisa van. Vázlat: legyen $e$ és $f$ kitérő. Fektessünk $f$-en át $e$-vel párhuzamos $S$ síkot, és vetítsük $e$-t merőlegesen $S$-re; a vetület $e'$ párhuzamos $e$-vel, így metszi $f$-et egy $Q$ pontban (mert $f$ és $e'$ egy síkban vannak és nem párhuzamosak). A $Q$-n át $S$-re állított merőleges metszi $e$-t egy $P$ pontban; $PQ$ merőleges $S$-re, tehát $e$-re és $f$-re is. Ez az egyetlen ilyen szakasz, és hossza $e$ és $S$ távolsága.` },
      { h: 'Ponthalmazok: kör, gömb, szakaszfelező merőleges, szögfelező, parabola',
        b: R`A távolság segítségével definiált ponthalmazok:\n- **Kör** (síkban) és **gömb** (térben): egy adott $O$ ponttól adott $r$ távolságra lévő pontok halmaza.\n- **Szakaszfelező merőleges:** a síkban az $A$ és $B$ ($A \neq B$) pontoktól egyenlő távolságra lévő pontok halmaza; az $AB$ szakasz felezőpontján átmenő, $AB$-re merőleges egyenes. A **térben** ugyanez a halmaz az $AB$ szakasz felezőpontján átmenő, $AB$-re merőleges **sík**.\n- **Szögfelező:** egy szög szárától egyenlő távolságra lévő, a szög belsejében fekvő pontok halmaza. Két metsző egyenestől egyenlő távolságra lévő pontok: a két egyenes szögfelező egyenesei (két egymásra merőleges egyenes).\n- Egy egyenestől adott $d > 0$ távolságra lévő pontok a síkban: két, az egyenessel párhuzamos egyenes.\n- **Parabola** (emelt szint): egy $F$ pont (fókusz) és egy $F$-et nem tartalmazó $e$ egyenes (vezéregyenes) egyenlő távolságra lévő pontjainak halmaza a síkban. Az $y = ax^2$ ($a \neq 0$) parabola fókusza $F\left(0; \dfrac{1}{4a}\right)$, vezéregyenese $y = -\dfrac{1}{4a}$.` }
    ],
    examples: [
      { t: 'Szögpárok párhuzamos egyeneseknél',
        p: R`Az $e$ és $f$ párhuzamos vízszintes egyenesek; $e$ van alul, $f$ felül. Az $E \in e$ és $F \in f$ pontokon átmenő $g$ egyenes az $e$ egyenessel $54^\circ$-os szöget zár be úgy, hogy az $E$ pontból jobbra induló félegyenesnek és az $EF$ félegyenesnek a szöge $54^\circ$. a) Mekkora az $EF$ félegyenes és az $E$-ből balra induló félegyenes szöge? b) Mekkora az $FE$ félegyenes és az $F$-ből balra induló félegyenes szöge? c) Mekkora az $FE$ félegyenes és az $F$-ből jobbra induló félegyenes szöge?`,
        steps: [R`a) A két szög mellékszög: közös szárú ($EF$) és a másik két szár ($E$-től jobbra, illetve balra) egy egyenest alkot. Összegük $180^\circ$, ezért a keresett szög $180^\circ - 54^\circ = 126^\circ$.`, R`b) Az $F$-nél lévő, balra induló félegyenes és az $FE$ félegyenes szöge az $E$-nél lévő $54^\circ$-os szög **váltószöge**. Mivel $e \parallel f$, a váltószögek egyenlők, így ez $54^\circ$.`, R`c) Az $F$-nél jobbra induló félegyenes és $FE$ szöge az előző szög mellékszöge, tehát $180^\circ - 54^\circ = 126^\circ$. Ugyanezt kapjuk társszögként is: az $E$-nél és az $F$-nél, a $g$ ugyanazon oldalán lévő belső szögek összege $54^\circ + 126^\circ = 180^\circ$.`, R`Ellenőrzés: a két bezárt szög $54^\circ$ és $126^\circ$ összege valóban $180^\circ$.`],
        ans: R`a) $126^\circ$, b) $54^\circ$, c) $126^\circ$.`,
        checks: [['180-54', '126'], ['180-126', '54'], ['54+126', '180']] },
      { t: 'Kocka testátlójának hajlásszöge az alaplappal',
        p: R`Az $ABCDEFGH$ kocka éle $6$ cm; az $ABCD$ az alaplap (körüljárás szerint $A, B, C, D$), az $E, F, G, H$ csúcsok rendre az $A, B, C, D$ fölött vannak. Mekkora az $AG$ testátló hossza, és mekkora szöget zár be az alaplap síkjával?`,
        steps: [R`Az $AG$ testátló vetülete az alaplapra az $AC$ lapátló (a $G$ merőleges vetülete $C$). Az $ABC$ egyenlő szárú derékszögű háromszögben Pitagorasz-tétellel $AC = \sqrt{6^2 + 6^2} = 6\sqrt{2}$.`, R`Az $ACG$ háromszög $C$-nél derékszögű ($CG$ merőleges az alaplapra), így $AG = \sqrt{AC^2 + CG^2} = \sqrt{72 + 36} = \sqrt{108} = 6\sqrt{3} \approx 10{,}39$ cm.`, R`Az egyenes és a sík hajlásszöge az egyenes és a vetülete szöge: $\varphi = \angle GAC$. Az $ACG$ derékszögű háromszögben $\operatorname{tg}\varphi = \dfrac{CG}{AC} = \dfrac{6}{6\sqrt{2}} = \dfrac{1}{\sqrt{2}} \approx 0{,}7071$.`, R`Ebből $\varphi \approx 35{,}26^\circ$. Ellenőrzés: $\sin\varphi = \dfrac{CG}{AG} = \dfrac{6}{6\sqrt{3}} = \dfrac{1}{\sqrt{3}} \approx 0{,}577$, és $\operatorname{tg}\varphi = \dfrac{\sin\varphi}{\cos\varphi} = \dfrac{1/\sqrt{3}}{\sqrt{2}/\sqrt{3}} = \dfrac{1}{\sqrt{2}}$, ez egyezik.`],
        ans: R`A testátló hossza $6\sqrt{3} \approx 10{,}39$ cm, az alaplappal bezárt szöge kb. $35{,}26^\circ$.`,
        checks: [['sqrt(6^2+6^2)', '6*sqrt(2)'], ['sqrt(72+36)', '6*sqrt(3)'], ['6/(6*sqrt(2))', '1/sqrt(2)'], ['6/(6*sqrt(3))', '1/sqrt(3)'], ['(1/sqrt(3))/(sqrt(2)/sqrt(3))', '1/sqrt(2)']] },
      { t: 'Kitérő egyenesek távolsága és hajlásszöge a kockában',
        p: R`Az $ABCDEFGH$ kocka éle $6$ cm, a csúcsok jelölése ugyanaz, mint az előző példában ($ABCD$ az alaplap, $E, F, G, H$ rendre az $A, B, C, D$ fölött). Az alaplap $AC$ átlója és a $BCGF$ oldallap $BG$ átlója kitérő egyenesek. Mekkora a hajlásszögük és a távolságuk?`,
        steps: [R`**Hajlásszög.** Az $EG$ szakasz párhuzamos $AC$-vel (az $ACGE$ téglalap szemközti oldalai). Így $AC$ és $BG$ hajlásszöge az $EG$ és $BG$ egyenesek szöge, azaz $\angle EGB$.`, R`Az $EGB$ háromszög mindhárom oldala egy-egy lapátló, hossza $6\sqrt{2}$. A háromszög szabályos, ezért $\angle EGB = 60^\circ$. A kitérő egyenesek hajlásszöge $60^\circ$.`, R`**Távolság.** Az $EGB$ sík tartalmazza a $BG$ egyenest és az $AC$-vel párhuzamos $EG$ egyenest, tehát párhuzamos $AC$-vel. Így a keresett távolság az $A$ pont távolsága az $EGB$ síktól; jelölje $d$.`, R`Számítsuk ki az $ABEG$ gúla ($A$, $B$, $E$, $G$ csúcsokkal) térfogatát kétféleképpen. Alapnak az $ABE$ háromszöget véve: $T_{ABE} = \dfrac{6 \cdot 6}{2} = 18$, a hozzá tartozó magasság $6$ (a $G$ távolsága az $ABFE$ laptól), így $V = \dfrac{1}{3} \cdot 18 \cdot 6 = 36$ cm³.`, R`Alapnak az $EGB$ szabályos háromszöget véve: $T_{EGB} = \dfrac{\sqrt{3}}{4} \cdot (6\sqrt{2})^2 = 18\sqrt{3}$, a magasság $d$, ezért $36 = \dfrac{1}{3} \cdot 18\sqrt{3} \cdot d$. Innen $d = \dfrac{108}{18\sqrt{3}} = \dfrac{6}{\sqrt{3}} = 2\sqrt{3} \approx 3{,}46$ cm.`, R`Ellenőrzés koordinátákkal: $A(0;0;0)$, $B(6;0;0)$, $D(0;6;0)$, $E(0;0;6)$ (így $C(6;6;0)$, $G(6;6;6)$); az $EGB$ sík egyenlete $x - y + z = 6$, az $A$ távolsága tőle $\dfrac{|0 - 0 + 0 - 6|}{\sqrt{3}} = 2\sqrt{3}$.`],
        ans: R`A két egyenes hajlásszöge $60^\circ$, távolságuk $2\sqrt{3} \approx 3{,}46$ cm.`,
        checks: [['6*6/2', '18'], ['(1/3)*18*6', '36'], ['sqrt(3)/4*72', '18*sqrt(3)'], ['3*36/(18*sqrt(3))', '2*sqrt(3)'], ['6/sqrt(3)', '2*sqrt(3)'], ['6/sqrt(1+1+1)', '2*sqrt(3)']] },
      { t: 'Parabola: fókusz és vezéregyenes',
        p: R`Az $y = \dfrac{x^2}{8}$ egyenletű parabolának hol van a fókusza és a vezéregyenese? Igazold, hogy a $P(4; 2)$ pont a parabolán van, és egyenlő távolságra van a fókusztól és a vezéregyenestől.`,
        steps: [R`Az $y = ax^2$ alakban $a = \dfrac{1}{8}$, ezért $\dfrac{1}{4a} = 2$. A fókusz $F(0; 2)$, a vezéregyenes az $y = -2$ egyenes.`, R`A $P(4;2)$ pont a parabolán van, mert $\dfrac{4^2}{8} = 2$.`, R`Távolság a fókusztól: $PF = \sqrt{(4-0)^2 + (2-2)^2} = 4$. Távolság a vezéregyenestől: $2 - (-2) = 4$. A két érték egyenlő, ahogy a definíció megkívánja.`, R`Általános ellenőrzés: ha $P(x; ax^2)$, akkor a vezéregyenestől $ax^2 + \dfrac{1}{4a}$ a távolsága, a fókusztól $\sqrt{x^2 + \left(ax^2 - \dfrac{1}{4a}\right)^2}$; a négyzeteket kivonva $\left(ax^2 + \dfrac{1}{4a}\right)^2 - \left(ax^2 - \dfrac{1}{4a}\right)^2 = x^2$, tehát a két távolság egyenlő.`],
        ans: R`$F(0; 2)$ a fókusz, az $y = -2$ a vezéregyenes; a $P$ pont mindkettőtől $4$ egység távolságra van.`,
        checks: [['16/8', '2'], ['1/(4*(1/8))', '2'], ['sqrt(4^2+(2-2)^2)', '2+2']] }
    ],
    sims: ['haromszog'],
    mistakes: [
      R`A kitérő és a párhuzamos egyenesek keverése: kitérő egyeneseknek sincs közös pontjuk, de **nincsenek egy síkban**. Ha van közös síkjuk és nem metszik egymást, akkor párhuzamosak.`,
      R`Pótszög és kiegészítő szög összekeverése: a pótszögek összege $90^\circ$, a kiegészítő szögeké (és a mellékszögeké) $180^\circ$.`,
      R`A társszögekről azt hiszik, hogy egyenlők. Párhuzamos egyeneseknél a **váltószögek és az egyállású szögek** egyenlők, a **társszögek** összege $180^\circ$.`,
      R`Egyenes és sík hajlásszögét a sík **normálisával** mérik: a helyes szög az egyenes és a **vetülete** között van; a normálissal bezárt szög ennek pótszöge.`,
      R`Pont és egyenes (sík) távolságát ferde szakasszal mérik. A távolság mindig a **merőleges** szakasz hossza.`,
      R`A kitérő egyenesek távolságára „$0$”-t írnak, mert nincs közös pontjuk. A távolság pozitív: a normáltranszverzális szakaszának hossza.`
    ],
    exam: R`A követelmény szerint közép- és emelt szinten is ismerni kell az alapfogalom, az axióma, a definiált fogalom és a bizonyított tétel különbségét, a térelemeket, a szög osztályozását és a szögpárokat, továbbá a pont–egyenes, pont–sík, párhuzamos egyenesek és párhuzamos síkok távolságát, valamint két egyenes, egyenes és sík, két sík hajlásszögét. Emelt szinten kitérő egyenesek távolságát és hajlásszögét is meg kell tudni határozni, és ismerni kell a parabola fogalmát. A szakaszfelező merőleges, a szögfelező, a kör és a gömb fogalmát feladatmegoldásban használni kell. Térgeometriai (pl. kocka, gúla, hasáb) feladatokban is alkalmazni kell.`,
    cheat: [R`\alpha + \beta = 90^\circ \ \text{(pótszögek)}, \qquad \alpha + \beta = 180^\circ \ \text{(mellékszögek, társszögek)}`, R`e \parallel f: \ \text{váltószögek, egyállású szögek egyenlők}`, R`d_{\text{testátló}} = \sqrt{a^2 + b^2 + c^2}, \qquad d_{\text{kocka}} = a\sqrt{3}`, R`\text{egyenes és sík hajlásszöge} = \text{egyenes és vetülete szöge}`, R`\text{parabola}: PF = d(P; e), \quad y = ax^2: \ F\left(0; \tfrac{1}{4a}\right)`],
    cheatChecks: [['sqrt(2^2+3^2+6^2)', '7'], ['sqrt(6^2+6^2+6^2)', '6*sqrt(3)'], ['1/(4*(1/8))', '2']],
    terms: ['axióma', 'alapfogalom', 'mellékszög', 'csúcsszög', 'váltószög', 'társszög', 'kitérő egyenesek', 'normáltranszverzális', 'hajlásszög', 'szakaszfelező merőleges', 'szögfelező', 'parabola', 'vezéregyenes', 'fókusz']
  };

  def('g1-eg-1', 'geometria', 'elemigeo', 1, 'Mellékszög, csúcsszög, pótszög', function (r) {
    var kind = r.int(0, 2), a, ans, q, tip1, tip2, sol, ver;
    if (kind === 0) {
      a = r.int(20, 160); ans = 180 - a; ver = '180-' + a;
      q = R`Egy szög nagysága $${a}^\circ$. Mekkora a mellékszöge (fokban)?`;
      tip1 = R`A mellékszögek összege $180^\circ$.`; tip2 = R`Vond ki a $180^\circ$-ból a megadott szöget.`;
      sol = [R`$180^\circ - ${a}^\circ = ${ans}^\circ$`, R`Ellenőrzés: $${a}^\circ + ${ans}^\circ = 180^\circ$.`];
    } else if (kind === 1) {
      a = r.int(20, 160); ans = 180 - a; ver = '180-' + a;
      q = R`Két egyenes metszi egymást, az egyik keletkezett szög nagysága $${a}^\circ$. Mekkora a csúcsszögének mellékszöge (fokban)?`;
      tip1 = R`A csúcsszögek egyenlők, a mellékszögek összege $180^\circ$.`; tip2 = R`A csúcsszög is $${a}^\circ$; ennek keresd a mellékszögét.`;
      sol = [R`A csúcsszög egyenlő az eredeti szöggel: $${a}^\circ$.`, R`A mellékszöge: $180^\circ - ${a}^\circ = ${ans}^\circ$.`];
    } else {
      a = r.int(5, 85); ans = 90 - a; ver = '90-' + a;
      q = R`Egy szög nagysága $${a}^\circ$. Mekkora a pótszöge (fokban)?`;
      tip1 = R`A pótszögek összege $90^\circ$.`; tip2 = R`Vond ki a $90^\circ$-ból a megadott szöget.`;
      sol = [R`$90^\circ - ${a}^\circ = ${ans}^\circ$`, R`Ellenőrzés: $${a}^\circ + ${ans}^\circ = 90^\circ$.`];
    }
    return { q: q, answer: { type: 'num', value: ans }, ansTex: K.T(ans) + DEG, verify: ver, tip1: tip1, tip2: tip2, sol: sol };
  });

  def('g1-eg-2', 'geometria', 'elemigeo', 1, 'Szögek párhuzamos egyeneseknél', function (r) {
    var a = r.pick([r.int(25, 85), r.int(95, 155)]), kind = r.int(0, 2), ans, nm, tip, ver;
    if (kind === 0) { ans = a; nm = 'váltószöge'; tip = R`Párhuzamos egyeneseknél a váltószögek egyenlők.`; ver = '' + a; }
    else if (kind === 1) { ans = a; nm = 'megfelelő (egyállású) szöge'; tip = R`Párhuzamos egyeneseknél az egyállású szögek egyenlők.`; ver = '' + a; }
    else { ans = 180 - a; nm = 'társszöge'; tip = R`Párhuzamos egyeneseknél a társszögek összege $180^\circ$.`; ver = '180-' + a; }
    return {
      q: R`Az $e$ és $f$ párhuzamos egyeneseket a $g$ egyenes metszi. A keletkező egyik szög nagysága $${a}^\circ$. Mekkora ennek a szögnek a ${nm} (fokban)?`,
      answer: { type: 'num', value: ans }, ansTex: K.T(ans) + DEG, verify: ver,
      tip1: R`Ismerd fel, milyen szögpárról van szó.`, tip2: tip,
      sol: [tip, R`A keresett szög: $${ans}^\circ$.`]
    };
  });

  def('g1-eg-3', 'geometria', 'elemigeo', 2, 'Téglatest testátlója', function (r) {
    var L = [[2, 3, 6, 7], [1, 4, 8, 9], [4, 4, 7, 9], [2, 6, 9, 11], [6, 6, 7, 11], [2, 10, 11, 15], [3, 4, 12, 13], [4, 8, 8, 12], [1, 2, 2, 3], [6, 6, 17, 19]];
    var t = r.pick(L), k = r.int(1, 3), v = r.shuffle(t.slice(0, 3)).map(function (x) { return x * k; }), d = t[3] * k, kind = r.int(0, 1);
    if (kind === 0) {
      return {
        q: R`Egy téglatest három, egy csúcsból induló éle $${v[0]}$, $${v[1]}$ és $${v[2]}$ cm hosszú. Hány cm a testátlója?`,
        answer: { type: 'num', value: d }, ansTex: K.T(d) + R`\ \text{cm}`, verify: `sqrt(${v[0]}^2+${v[1]}^2+${v[2]}^2)`,
        tip1: R`A testátló hossza három élből Pitagorasz-tétellel kétszer alkalmazva számolható.`,
        tip2: R`$d = \sqrt{a^2 + b^2 + c^2}$.`,
        sol: [R`$d = \sqrt{${v[0]}^2 + ${v[1]}^2 + ${v[2]}^2} = \sqrt{${v[0] * v[0]} + ${v[1] * v[1]} + ${v[2] * v[2]}} = \sqrt{${d * d}}$`, R`$d = ${d}$ cm.`]
      };
    }
    return {
      q: R`Egy téglatest testátlója $${d}$ cm, két, egy csúcsból induló éle $${v[0]}$ cm és $${v[1]}$ cm. Hány cm a harmadik éle?`,
      answer: { type: 'num', value: v[2] }, ansTex: K.T(v[2]) + R`\ \text{cm}`, verify: `sqrt(${d}^2-${v[0]}^2-${v[1]}^2)`,
      tip1: R`Használd a testátló képletét, és rendezd a hiányzó élre.`,
      tip2: R`$c^2 = d^2 - a^2 - b^2$.`,
      sol: [R`$c^2 = d^2 - a^2 - b^2 = ${d * d} - ${v[0] * v[0]} - ${v[1] * v[1]} = ${v[2] * v[2]}$`, R`$c = ${v[2]}$ cm.`, R`Ellenőrzés: $${v[0]}^2 + ${v[1]}^2 + ${v[2]}^2 = ${d * d} = ${d}^2$.`]
    };
  });

  def('g1-eg-4', 'geometria', 'elemigeo', 2, 'Távolsággal definiált ponthalmazok', function (r) {
    var nm = r.pick([['A', 'B'], ['P', 'Q'], ['M', 'N'], ['E', 'F'], ['X', 'Y'], ['C', 'D']]), x = nm[0], y = nm[1], n = r.int(2, 9), kind = r.int(0, 4), q, good, bad, why;
    if (kind === 0) {
      q = R`Egy síkban adott a(z) $${x}$ és $${y}$ pont ($${x} \neq ${y}$). Milyen alakzatot alkotnak a sík azon pontjai, amelyek $${x}$-től és $${y}$-tól egyenlő távolságra vannak?`;
      good = 'a szakaszfelező merőleges (egyenes)'; bad = ['az összekötő szakasz', 'egy kör', 'a szakasz két végpontja'];
      why = R`Ez a szakaszfelező merőleges definíciója.`;
    } else if (kind === 1) {
      q = R`A térben adott a(z) $${x}$ és $${y}$ pont ($${x} \neq ${y}$). Milyen alakzatot alkotnak a tér azon pontjai, amelyek $${x}$-től és $${y}$-tól egyenlő távolságra vannak?`;
      good = 'egy sík'; bad = ['egy egyenes', 'egy gömb', 'egy szakasz'];
      why = R`A térben a szakaszfelező merőleges egy sík: az $${x}${y}$ szakasz felezőpontján átmenő, rá merőleges sík.`;
    } else if (kind === 2) {
      q = R`A síkban adott az $e$ egyenes. Milyen alakzatot alkotnak a sík azon pontjai, amelyek az $e$ egyenestől $${n}$ cm távolságra vannak?`;
      good = 'két, az $e$-vel párhuzamos egyenes'; bad = ['egy, az $e$-vel párhuzamos egyenes', 'egy kör', 'egy $e$-re merőleges egyenes'];
      why = R`Az $e$ mindkét oldalán lehet olyan pont, amely $${n}$ cm-re van tőle, így két párhuzamos egyenest kapunk.`;
    } else if (kind === 3) {
      q = R`Két metsző egyenes a síkban $e$ és $f$. Milyen alakzatot alkotnak azok a pontok, amelyek $e$-től és $f$-től egyenlő távolságra vannak?`;
      good = 'két egymásra merőleges egyenes'; bad = ['egyetlen egyenes', 'egy kör', 'két párhuzamos egyenes'];
      why = R`A szögfelezők közül mindkét szögpárnak van egy-egy felezője; ez két, egymásra merőleges egyenes.`;
    } else {
      q = R`A síkban adott az $F$ pont és az $F$-et nem tartalmazó $e$ egyenes. Melyik alakzat az a ponthalmaz, amelynek pontjai $F$-től és $e$-től egyenlő távolságra vannak?`;
      good = 'parabola'; bad = ['kör', 'egyenes', 'két párhuzamos egyenes'];
      why = R`Ez a parabola definíciója: fókusz és vezéregyenes.`;
    }
    var g = function (t) { return '\\text{' + t.replace(/\$([^$]+)\$/g, '}$1\\text{') + '}'; }, f = function (t) { return '$' + g(t) + '$'; };
    return { q: q, answer: K.choice(r, f(good), bad.map(f)), ansTex: g(good), tip1: R`Idézd fel a ponthalmaz definícióját a távolság fogalmával.`, tip2: R`Képzeld el néhány ilyen pontot, és nézd meg, hová esnek.`, sol: [why] };
  });

  def('g1-eg-5', 'geometria', 'elemigeo', 3, 'Kitérő egyenesek távolsága a kockában', function (r) {
    var a = r.int(2, 15), kind = r.int(0, 2), q, val, ver, sol, tol = 0.0051, round = true;
    var cube = R`Az $ABCDEFGH$ kocka éle $${a}$ cm; az $ABCD$ az alaplap (körüljárás szerint), az $E, F, G, H$ csúcsok rendre az $A, B, C, D$ fölött vannak.`;
    if (kind === 0) {
      q = cube + R` Mekkora a távolsága a kitérő $AC$ és $BG$ egyeneseknek? (cm, két tizedesre kerekítve)`;
      val = a / Math.sqrt(3); ver = `${a}/sqrt(3)`;
      sol = [R`Az $EG \parallel AC$, ezért az $EGB$ sík párhuzamos $AC$-vel, és tartalmazza $BG$-t. A keresett távolság az $A$ és az $EGB$ sík távolsága.`, R`Az $EGB$ szabályos háromszög oldala $${a}\sqrt{2}$, területe $\dfrac{\sqrt{3}}{4} \cdot 2 \cdot ${a}^2$. Az $ABEG$ gúla térfogata $\dfrac{1}{3} \cdot \dfrac{${a}^2}{2} \cdot ${a}$.`, R`A két térfogat egyenlőségéből $d = \dfrac{${a}}{\sqrt{3}} \approx ${K.T(val, 2)}$ cm.`];
    } else if (kind === 1) {
      q = cube + R` Mekkora a távolsága a kitérő $AC$ és $BF$ egyeneseknek? (cm, két tizedesre kerekítve)`;
      val = a * Math.sqrt(2) / 2; ver = `${a}*sqrt(2)/2`;
      sol = [R`A $BF$ merőleges az alaplapra, tehát $AC$-re is. Ha $O$ az $AC$ felezőpontja, akkor $BO \perp AC$ (az $ABCD$ négyzet átlói merőlegesek).`, R`A $BO$ szakasz mindkét egyenesre merőleges és metszi is őket, ez a normáltranszverzális. Hossza az átló fele: $\dfrac{${a}\sqrt{2}}{2} \approx ${K.T(val, 2)}$ cm.`];
    } else {
      q = cube + R` Mekkora a távolsága a kitérő $AC$ és $FH$ egyeneseknek? (cm)`;
      val = a; ver = `${a}`; round = false;
      sol = [R`Az $AC$ az alaplap, az $FH$ a fedőlap átlója; a két lap párhuzamos síkokban van.`, R`Az $AC$ átló áthalad az alaplap, az $FH$ átló a fedőlap középpontján. A két középpontot összekötő szakasz mindkét átlót metszi, és merőleges mindkét lapra, így mindkét egyenesre is: ez a közös merőleges, hossza az él: $${a}$ cm.`];
    }
    return { q: q, answer: round ? { type: 'num', value: val, tol: tol } : { type: 'num', value: val }, ansTex: round ? R`\approx ${K.T(val, 2)}\ \text{cm}` : K.T(val) + R`\ \text{cm}`, verify: ver,
      tip1: R`Keress olyan síkot, amely az egyik egyenest tartalmazza és párhuzamos a másikkal; vagy keresd meg a közös merőlegest.`,
      tip2: kind === 0 ? R`Számold ki az $ABEG$ gúla térfogatát kétféle alappal.` : kind === 1 ? R`Az alaplapban merőleges szakaszt húzhatsz az $AC$ és a $B$ pont között.` : R`Az $FH$ és az $AC$ két párhuzamos sík egy-egy egyenese.`,
      sol: sol };
  });

  def('g1-eg-6', 'geometria', 'elemigeo', 3, 'Testátló és alaplap hajlásszögének tangense', function (r) {
    var t = r.pick([[3, 4, 5], [5, 12, 13], [6, 8, 10], [8, 15, 17]]), m = r.int(2, 20), val = m / t[2];
    return {
      q: R`Egy téglatest alaplapjának oldalai $${t[0]}$ cm és $${t[1]}$ cm, a téglatest magassága $${m}$ cm. Mekkora a testátló és az alaplap hajlásszögének tangense? (két tizedesre kerekítve)`,
      answer: { type: 'num', value: val, tol: 0.0051 }, ansTex: R`\operatorname{tg}\varphi \approx ${K.T(val, 2)}`,
      verify: `${m}/sqrt(${t[0]}^2+${t[1]}^2)`,
      tip1: R`A testátló vetülete az alaplapra az alaplap átlója.`,
      tip2: R`Az alaplap átlója Pitagorasz-tétellel számolható; a derékszögű háromszög egyik befogója a magasság.`,
      sol: [R`Az alaplap átlója $e = \sqrt{${t[0]}^2 + ${t[1]}^2} = ${t[2]}$ cm.`, R`A testátló, a vetülete (az alaplap átlója) és a magasság derékszögű háromszöget alkot: $\operatorname{tg}\varphi = \dfrac{${m}}{${t[2]}} \approx ${K.T(val, 2)}$.`]
    };
  });

  /* ===================== 4.2 Geometriai transzformációk ===================== */
  MO.content['geometria/transzformaciok'] = {
    intro: R`A geometriai transzformáció a sík (vagy a tér) pontjaihoz pontokat rendel úgy, hogy minden pontnak pontosan egy képe van, és minden pont egy pont képe. A követelmény két fő csoportot kér: az egybevágósági transzformációkat (eltolás, tengelyes és középpontos tükrözés, forgatás), amelyek a távolságokat megtartják, és a hasonlósági transzformációkat, amelyek a távolságokat állandó arányban változtatják. Emelt szinten a definíciókat pontosan, a párhuzamos szelők tételét, a belső szögfelező tételét (bizonyítással), a merőleges vetítést és a transzformációk és a függvények kapcsolatát is ismerni kell.`,
    theory: [
      { h: 'Transzformációk és függvények kapcsolata', level: 'emelt',
        b: R`A **transzformáció** a sík pontjainak egy olyan $P \mapsto P'$ leképezése a sík pontjaira, amely **kölcsönösen egyértelmű**: minden $P$-nek egyetlen képe van, és minden pont pontosan egy pont képe. Ilyenkor van **inverz transzformáció** is (a képet visszaviszi az eredetire), és két transzformáció egymás utáni végrehajtása is transzformáció (ez a függvények összetétele).\n\nA kapcsolat a függvényekkel kétféle:\n- a transzformáció maga is függvény, amelynek értelmezési tartománya és értékkészlete a sík;\n- egy $f$ függvény grafikonját (pontok halmazát) transzformálva új függvény grafikonját kapjuk:\n  - eltolás $(u; v)$ vektorral: $g(x) = f(x - u) + v$;\n  - tükrözés az $x$-tengelyre: $g(x) = -f(x)$; az $y$-tengelyre: $g(x) = f(-x)$; az origóra: $g(x) = -f(-x)$;\n  - az origó középpontú $\lambda$ arányú hasonlóság: $g(x) = \lambda f\left(\dfrac{x}{\lambda}\right)$.` },
      { h: 'Egybevágósági transzformációk: definíciók és tulajdonságok',
        b: R`Az **egybevágósági transzformációk** a távolságokat megtartják (két pont és képeik távolsága egyenlő). Ezek a síkban:\n- **Eltolás** a $\vec{v}$ vektorral: minden $P$ képe az a $P'$, amelyre $\overrightarrow{PP'} = \vec{v}$.\n- **Tengelyes tükrözés** a $t$ egyenesre: a $t$ pontjai fixek; a többi $P$ képe az a $P'$, amelyre $t$ a $PP'$ szakasz felező merőlegese.\n- **Középpontos tükrözés** az $O$ pontra: $O$ fix; a többi $P$ képe az a $P'$, amelyre $O$ a $PP'$ szakasz felezőpontja.\n- **Forgatás** az $O$ pont körül $\varphi$ szöggel: $O$ fix; a többi $P$ képére $OP' = OP$ és $\angle POP' = \varphi$ (a pozitív forgásirány az óramutató járásával ellentétes).\n\n**Tulajdonságok:** egyenest egyenesre, szakaszt vele egyenlő hosszú szakaszra, szöget vele egyenlő szögre visznek, megtartják a párhuzamosságot. A **körüljárási irányt** az eltolás, a középpontos tükrözés és a forgatás megtartja, a tengelyes tükrözés megfordítja. A középpontos tükrözés $180^\circ$-os forgatás.\n\n**Koordinátákkal** ($P(x; y)$): eltolás $(u; v)$-vel: $(x + u; y + v)$; tükrözés az $x$-tengelyre: $(x; -y)$; az $y$-tengelyre: $(-x; y)$; az origóra: $(-x; -y)$; forgatás az origó körül $+90^\circ$-kal: $(-y; x)$.` },
      { h: 'Egybevágóság, szimmetriák, térbeli egybevágósági transzformációk',
        b: R`Két alakzat **egybevágó**, ha van olyan egybevágósági transzformáció, amely az egyiket a másikba viszi. Ekkor megfelelő szakaszaik és szögeik egyenlők.\n\n**Háromszögek egybevágósági alapesetei:** két háromszög egybevágó, ha\n1. három oldaluk páronként egyenlő;\n2. két oldaluk és az általuk közbezárt szög páronként egyenlő;\n3. két oldaluk és a **nagyobbikkal szemközti** szög páronként egyenlő;\n4. egy oldaluk és az azon fekvő két szög páronként egyenlő.\n\n**Sokszögek** egybevágóságának feltétele (emelt): két $n$ szögű sokszög akkor és csak akkor egybevágó, ha csúcsaik úgy számozhatók, hogy az összes megfelelő oldal és az összes megfelelő szög páronként egyenlő. Háromszögeknél ebből a fenti három adat elegendő.\n\n**Szimmetriák:** egy alakzat tengelyesen szimmetrikus, ha van olyan tengely, amelyre tükrözve önmagába megy át (egyenlő szárú háromszög: $1$, rombusz és téglalap: $2$, négyzet: $4$, szabályos $n$-szög: $n$ tengely); középpontosan szimmetrikus, ha egy pontra tükrözve önmagába megy át (paralelogramma, kör); forgásszimmetriás, ha egy pont körüli valamilyen forgatással önmagába megy át (szabályos $n$-szög: $\dfrac{360^\circ}{n}$-os forgatással).\n\n**Térbeli egybevágósági transzformációkra példák** (emelt): eltolás vektorral, síkra tükrözés, pontra tükrözés, egyenes (tengely) körüli forgatás, és ezek összetételei (például a csavarmozgás).` },
      { h: 'Középpontos hasonlóság és hasonlósági transzformáció',
        b: R`**Középpontos hasonlóság** (nagyítás, kicsinyítés): adott az $O$ középpont és a $\lambda \neq 0$ arány. A $P$ pont képe a $P'$, amelyre $O$, $P$, $P'$ egy egyenesen vannak, $OP' = |\lambda| \cdot OP$, és $\lambda > 0$ esetén $P'$ a $P$-vel azonos oldalon, $\lambda < 0$ esetén az $O$-ra átellenes oldalon van. $|\lambda| > 1$ nagyítás, $|\lambda| < 1$ kicsinyítés; $\lambda = 1$ az identitás, $\lambda = -1$ a középpontos tükrözés.\n\n**Tulajdonságai:** minden szakaszt $|\lambda|$-szorosára változtat; az egyenest vele párhuzamos egyenesbe viszi (az $O$-n átmenő egyenesek fixek); a szögeket megtartja; a területet $\lambda^2$-szeresére változtatja. Az origó középpontú hasonlóság a $P(x; y)$ pontot a $(\lambda x; \lambda y)$ pontba viszi.\n\n**Hasonlósági transzformáció** (emelt szint definíciója): olyan transzformáció, amely a távolságokat állandó $k > 0$ arányban változtatja: bármely két pont és képeik távolságára $P'Q' = k \cdot PQ$. Ez ugyanaz, mint egy középpontos hasonlóság és egy egybevágósági transzformáció egymás utáni végrehajtása. Két alakzat **hasonló**, ha van olyan hasonlósági transzformáció, amely az egyiket a másikba viszi.` },
      { h: 'Hasonló háromszögek, hasonló alakzatok arányai',
        b: R`**Háromszögek hasonlóságának alapesetei:** két háromszög hasonló, ha\n1. két szögük páronként egyenlő;\n2. oldalaik aránya páronként egyenlő;\n3. két oldaluk aránya és az általuk közbezárt szög egyenlő;\n4. két oldaluk aránya és a nagyobbikkal szemközti szög egyenlő.\n\nHa a hasonlóság aránya $k$ (a kép és az eredeti hosszainak aránya), akkor:\n- megfelelő hosszúságok (oldal, kerület, magasság, sugár) aránya $k$;\n- **területek** (és felszínek) aránya $k^2$;\n- **térfogatok** aránya $k^3$.\n\nEzért például: ha az arány $k = \dfrac{2}{3}$, a kép területe az eredeti $\dfrac{4}{9}$-szerese, térfogata $\dfrac{8}{27}$-szerese. Mindig ellenőrizd, melyik alakzat a „kép” és melyik az „eredeti”; a fordított arány a reciprokot adja.` },
      { h: 'Párhuzamos szelők tétele és a belső szögfelező tétele', level: 'emelt',
        b: R`**Párhuzamos szelők tétele:** ha két, a $P$ pontban metsző egyenest két párhuzamos egyenes az $A$, $A'$, illetve $B$, $B'$ pontokban metsz ($AB \parallel A'B'$), akkor $\dfrac{PA}{PA'} = \dfrac{PB}{PB'}$, és $\dfrac{AB}{A'B'}$ ugyanennyi.\n\n**A tétel megfordítása:** ha az $A, A'$ pontok a $P$-ből induló egyik, a $B, B'$ pontok a másik félegyenesen vannak, és $\dfrac{PA}{PA'} = \dfrac{PB}{PB'}$, akkor $AB \parallel A'B'$.\n\n**Párhuzamos szelőszakaszok tétele:** ha két egyenest párhuzamos egyenesek metszenek, akkor az egyik egyenesen keletkező szakaszok aránya megegyezik a másik egyenesen keletkező megfelelő szakaszok arányával.\n\n**Belső szögfelező tétele:** a háromszög belső szögfelezője a szemközti oldalt a szög két szárának arányában osztja: ha az $ABC$ háromszög $C$-ből húzott szögfelezője az $AB$ oldalt a $P$ pontban metszi, akkor $\dfrac{AP}{PB} = \dfrac{AC}{BC} = \dfrac{b}{a}$.`,
        proof: R`Legyen $a = BC$, $b = AC$, a $C$-nél lévő szög $\gamma$. Húzzunk $B$-n át párhuzamost a $CP$ szögfelezővel; ez az $AC$ egyenest a $D$ pontban metszi ($C$ az $A$ és $D$ között van). A $BD$ és $CP$ párhuzamossága miatt $\angle CBD$ és $\angle BCP$ váltószögek, így $\angle CBD = \dfrac{\gamma}{2}$; az $\angle CDB$ a $\angle ACP$-vel egyállású, ezért szintén $\dfrac{\gamma}{2}$. Tehát a $CBD$ háromszög egyenlő szárú: $CD = CB = a$. Az $A$ csúcsból induló két egyenest a $CP \parallel DB$ párhuzamosok metszik, ezért a párhuzamos szelők tétele szerint $\dfrac{AP}{PB} = \dfrac{AC}{CD} = \dfrac{b}{a}$.` },
      { h: 'Merőleges vetítés', level: 'emelt',
        b: R`A **merőleges vetítés** a pontot a síkra (vagy egyenesre) bocsátott merőleges talppontjába viszi: a $P$ pont vetülete a $P$-n átmenő, a síkra merőleges egyenes és a sík metszéspontja. Síkban egy egyenesre vetítve a $P$ vetülete a $P$-ből az egyenesre húzott merőleges talppontja.\n\n**Tulajdonságai:**\n- az egyenest (ha nem párhuzamos a vetítés irányával, azaz nem merőleges a vetítés síkjára) egyenesre, a szakaszt szakaszra viszi;\n- megtartja a párhuzamosságot és az osztóviszonyt (a felezőpont vetülete a vetület felezőpontja);\n- **nem kölcsönösen egyértelmű**, ezért nem transzformáció a fenti értelemben: különböző pontoknak lehet ugyanaz a vetülete;\n- ha egy szakasz a vetítés síkjával $\varphi$ szöget zár be, a vetülete $\cos\varphi$-szeres hosszú;\n- ha egy síkidom síkja a vetítés síkjával $\alpha$ szöget zár be, a vetületének területe $\cos\alpha$-szorosa az eredeti területnek (kiegészítés: ez a tulajdonság akkor is érvényes, ha az idom síkjának van olyan egyenese, amely párhuzamos a vetítés síkjával, ami mindig teljesül).\n\nAlkalmazás: egyenes és sík hajlásszöge, árnyékképek (párhuzamos, merőlegesen érkező fény), testek vetületi képe.` }
    ],
    examples: [
      { t: 'Pont képe több transzformáció után',
        p: R`Az $A(2; 5)$ pontot tükrözzük az $y$-tengelyre, a kapott $A_1$ pontot elforgatjuk az origó körül $+90^\circ$-kal, így kapjuk az $A_2$ pontot. Végül az $A_2$ pontot az origó középpontú, $\lambda = -2$ arányú hasonlóságnak vetjük alá, ez az $A_3$ pont. Határozd meg az $A_1$, $A_2$, $A_3$ pontok koordinátáit, és ellenőrizd az origótól mért távolságokat.`,
        steps: [R`Az $y$-tengelyre tükrözéskor az $x$-koordináta ellentettje lesz: $A_1(-2; 5)$.`, R`A $+90^\circ$-os forgatás az origó körül az $(x; y)$ pontot az $(-y; x)$ pontba viszi: $A_2(-5; -2)$.`, R`A $\lambda = -2$ arányú, origó középpontú hasonlóság minden koordinátát $-2$-vel szoroz: $A_3(-2 \cdot (-5); -2 \cdot (-2)) = (10; 4)$.`, R`Ellenőrzés: $OA = OA_1 = OA_2 = \sqrt{2^2 + 5^2} = \sqrt{29}$, mert az egybevágósági transzformációk távolságtartók. $OA_3 = \sqrt{10^2 + 4^2} = \sqrt{116} = 2\sqrt{29}$, vagyis $|\lambda| = 2$-szerese, ahogy kell.`],
        ans: R`$A_1(-2; 5)$, $A_2(-5; -2)$, $A_3(10; 4)$.`,
        checks: [['-2*(-5)', '10'], ['-2*(-2)', '4'], ['sqrt(2^2+5^2)', 'sqrt(5^2+2^2)'], ['sqrt(10^2+4^2)', '2*sqrt(29)']] },
      { t: 'Csonkagúla térfogata hasonlósággal',
        p: R`Egy gúla alapterülete $90$ cm², magassága $9$ cm. Az alappal párhuzamos síkkal elmetsszük úgy, hogy a metszősík a csúcstól mért magasság $\dfrac{2}{3}$ részénél van. Mekkora a keletkező kis gúla és a csonkagúla térfogata, és mekkora a metszet területe?`,
        steps: [R`A teljes gúla térfogata $V = \dfrac{T \cdot m}{3} = \dfrac{90 \cdot 9}{3} = 270$ cm³.`, R`A levágott kis gúla hasonló a teljeshez, a hasonlóság aránya (a csúcstól mért magasságok aránya) $k = \dfrac{2}{3}$.`, R`A metszet területe $k^2$-szerese az alapterületnek: $90 \cdot \dfrac{4}{9} = 40$ cm². A kis gúla térfogata $k^3$-szerese: $270 \cdot \dfrac{8}{27} = 80$ cm³.`, R`A csonkagúla térfogata a különbség: $270 - 80 = 190$ cm³.`, R`Ellenőrzés a csonkagúla képletével ($m = 9 - 6 = 3$ cm): $V = \dfrac{m}{3}\left(T + \sqrt{T t} + t\right) = 1 \cdot (90 + \sqrt{90 \cdot 40} + 40) = 90 + 60 + 40 = 190$.`],
        ans: R`A kis gúla térfogata $80$ cm³, a csonkagúláé $190$ cm³, a metszet területe $40$ cm².`,
        checks: [['90*9/3', '270'], ['90*(2/3)^2', '40'], ['270*(2/3)^3', '80'], ['270-80', '190'], ['(9-6)/3*(90+sqrt(90*40)+40)', '190']] },
      { t: 'Trapéz átlóinak metszéspontja',
        p: R`Az $ABCD$ trapézban $AB \parallel CD$, $AB = 12$ cm, $CD = 8$ cm, a trapéz magassága $10$ cm. Az $AC$ és $BD$ átlók metszéspontja $M$. a) Mekkora az $AM : MC$ arány? b) Mekkora az $ABM$ és a $CDM$ háromszög területe? c) Mekkora az $M$-en át az alapokkal párhuzamosan húzott, a szárak közé eső szakasz hossza?`,
        steps: [R`a) Az $ABM$ és $CDM$ háromszögekben $\angle MAB = \angle MCD$ és $\angle MBA = \angle MDC$ (váltószögek, mert $AB \parallel CD$), így hasonlók. A hasonlóság aránya $\dfrac{AB}{CD} = \dfrac{12}{8} = \dfrac{3}{2}$, tehát $AM : MC = 3 : 2$.`, R`b) A hasonló háromszögek megfelelő magasságainak aránya is $3 : 2$; a két magasság összege a trapéz magassága ($10$ cm), így $m_{ABM} = 6$ cm és $m_{CDM} = 4$ cm. Ezért $T_{ABM} = \dfrac{12 \cdot 6}{2} = 36$ cm² és $T_{CDM} = \dfrac{8 \cdot 4}{2} = 16$ cm². (A területek aránya $\dfrac{36}{16} = \dfrac{9}{4} = k^2$, ahogy a hasonlóságnál kell.)`, R`c) Legyen a keresett szakasz az $EF$ ($E \in AD$, $F \in BC$, $M \in EF$). Az $ABD$ háromszögben $EM \parallel AB$, így $\dfrac{EM}{AB} = \dfrac{DM}{DB}$. Az $M$ az átlót $BM : MD = 3 : 2$ arányban osztja ($BM : MD = AB : CD$), ezért $\dfrac{DM}{DB} = \dfrac{2}{5}$ és $EM = 12 \cdot \dfrac{2}{5} = 4{,}8$ cm. Ugyanígy $MF = 4{,}8$ cm az $ABC$ háromszögben ($\dfrac{CM}{CA} = \dfrac{2}{5}$).`, R`Tehát $EF = 4{,}8 + 4{,}8 = 9{,}6$ cm.`, R`Ellenőrzés: a trapéz területe $\dfrac{(12 + 8) \cdot 10}{2} = 100$ cm²; az $AMD$ és $BMC$ háromszögek területe egyenlő (közös: $T_{ABD} = T_{ABC}$ miatt) és mértani közepe az $ABM$, $CDM$ területeknek: $\sqrt{36 \cdot 16} = 24$, és $36 + 16 + 24 + 24 = 100$.`],
        ans: R`a) $AM : MC = 3 : 2$; b) $T_{ABM} = 36$ cm², $T_{CDM} = 16$ cm²; c) $9{,}6$ cm.`,
        checks: [['12/8', '3/2'], ['12*6/2', '36'], ['8*4/2', '16'], ['12*2/5', '4,8'], ['2*4,8', '9,6'], ['sqrt(36*16)', '24'], ['36+16+24+24', '(12+8)*10/2']] },
      { t: 'Belső szögfelező tétele',
        p: R`Az $ABC$ háromszög oldalai: $BC = a = 10$ cm, $AC = b = 15$ cm, $AB = c = 20$ cm. A $C$ csúcsból húzott belső szögfelező az $AB$ oldalt a $P$ pontban metszi. Mekkora az $AP$ és a $PB$ szakasz? Mi a $T_{ACP} : T_{BCP}$ arány?`,
        steps: [R`A belső szögfelező tétele szerint $\dfrac{AP}{PB} = \dfrac{b}{a} = \dfrac{15}{10} = \dfrac{3}{2}$.`, R`A $P$ az $AB$ szakasz belső pontja, ezért $AP + PB = 20$. Az arány miatt $AP = 20 \cdot \dfrac{3}{3 + 2} = 12$ cm, $PB = 20 - 12 = 8$ cm.`, R`Ellenőrzés: $\dfrac{12}{8} = \dfrac{3}{2} = \dfrac{15}{10}$.`, R`Az $ACP$ és $BCP$ háromszögeknek a $C$-ből húzott magassága közös (az $AB$-re bocsátott merőleges), így területük az alapjaik arányában áll: $T_{ACP} : T_{BCP} = AP : PB = 3 : 2$.`],
        ans: R`$AP = 12$ cm, $PB = 8$ cm, a területek aránya $3 : 2$.`,
        checks: [['20*15/(10+15)', '12'], ['20-12', '8'], ['12/8', '15/10']] },
      { t: 'Merőleges vetület területe',
        p: R`Egy $10$ cm oldalú négyzet alakú lemez síkja $60^\circ$-os szöget zár be a vízszintes síkkal; a négyzet egyik oldala vízszintes. Mekkora a lemez merőleges vetületének területe a vízszintes síkon?`,
        steps: [R`A vízszintes oldal vetülete önmagával egyenlő hosszú: $10$ cm. A rá merőleges oldal a vízszintes síkkal $60^\circ$-ot zár be, így vetülete $\cos 60^\circ$-szoros hosszúságú: $10 \cdot \cos 60^\circ = 5$ cm.`, R`A vetület tehát $10 \times 5$ cm-es téglalap, területe $50$ cm².`, R`Ellenőrzés a területre vonatkozó szabállyal: $T' = T \cdot \cos\alpha = 100 \cdot \cos 60^\circ = 50$ cm².`],
        ans: R`A vetület területe $50$ cm².`,
        checks: [['10*cos(pi/3)', '5'], ['10*5', '50'], ['100*cos(pi/3)', '50']] }
    ],
    sims: ['geo-transzformaciok'],
    mistakes: [
      R`A hasonlóság arányát fordítva írják fel: mindig dönts el, hogy a kép és az eredeti arányát nézed-e. Nagyításnál $k > 1$, kicsinyítésnél $k < 1$.`,
      R`A területek arányát $k$-val, nem $k^2$-tel számolják, és a térfogatokét $k^2$-tel, nem $k^3$-bal. Hossz: $k$, terület és felszín: $k^2$, térfogat: $k^3$.`,
      R`A belső szögfelező tételében felcserélik az arányt: $\dfrac{AP}{PB} = \dfrac{b}{a}$, azaz a **szomszédos oldalak** arányával osztja a szemközti oldalt; a hosszabb szomszédos oldalhoz a hosszabb szakasz tartozik.`,
      R`A párhuzamos szelők tételében a metszéspontból mért teljes szakaszokat ($PA'$, $PB'$) összekeverik a szelőszakaszokkal ($AA'$, $BB'$). Rajzold le, melyik szakasz melyik oldalon van.`,
      R`Háromszög egybevágósági alapesetnél a két oldal és egy **nem közbezárt** szög általában nem elég; csak akkor igaz, ha a szög a **nagyobbikkal szemközt** van.`,
      R`A tengelyes tükrözés megfordítja a körüljárási irányt, a forgatás és az eltolás nem. Negatív arányú hasonlóságnál a kép az $O$ ponton túl, átellenes oldalon van.`
    ],
    exam: R`A követelmény szerint közép- és emelt szinten is ismerni kell az egybevágósági transzformációkat (eltolás, tengelyes és középpontos tükrözés, forgatás), tulajdonságaikat, a háromszögek egybevágósági és hasonlósági alapeseteit, a szimmetriákat, a középpontos hasonlóságot, valamint a hasonló síkidomok területének és a hasonló testek felszínének, térfogatának arányáról szóló tételeket. Emelt szinten ezen felül a transzformációk pontos definícióját, a hasonlósági transzformációt, a párhuzamos szelők tételét, megfordítását és a párhuzamos szelőszakaszok tételét, a belső szögfelező tételének bizonyítását, a merőleges vetítést és a transzformációk és függvények kapcsolatát kéri.`,
    cheat: [R`\frac{a'}{a} = k, \quad \frac{T'}{T} = k^2, \quad \frac{V'}{V} = k^3`, R`\frac{PA}{PA'} = \frac{PB}{PB'} \ (AB \parallel A'B')`, R`\frac{AP}{PB} = \frac{b}{a} \ \text{(belső szögfelező tétele)}`, R`(x;y) \mapsto (x;-y),\ (-x;y),\ (-x;-y),\ (-y;x)`, R`T' = T \cos\alpha \ \text{(merőleges vetület területe)}`],
    cheatChecks: [['100*cos(pi/3)', '50'], ['20*15/(10+15)', '12']],
    terms: ['egybevágósági transzformáció', 'eltolás', 'tengelyes tükrözés', 'középpontos tükrözés', 'forgatás', 'középpontos hasonlóság', 'hasonlósági transzformáció', 'hasonlóság aránya', 'párhuzamos szelők tétele', 'belső szögfelező tétele', 'merőleges vetítés', 'szimmetria']
  };

  def('g1-tr-1', 'geometria', 'transzformaciok', 1, 'Pont képe koordinátákkal', function (r) {
    var x = r.int(-9, 9), y = r.nz(-9, 9), kind = r.int(0, 4), u = r.nz(-6, 6), w = r.nz(-6, 6), asky = r.int(0, 1) === 1;
    var nm = ['az $x$-tengelyre tükrözzük', 'az $y$-tengelyre tükrözzük', 'az origóra tükrözzük', 'eltoljuk a $\\vec{v}(' + u + '; ' + w + ')$ vektorral', 'elforgatjuk az origó körül $+90^\\circ$-kal'][kind];
    var img = [[x, -y], [-x, y], [-x, -y], [x + u, y + w], [-y, x]][kind];
    var ver = [[`${x}`, `-(${y})`], [`-(${x})`, `${y}`], [`-(${x})`, `-(${y})`], [`${x}+(${u})`, `${y}+(${w})`], [`-(${y})`, `${x}`]][kind][asky ? 1 : 0];
    var ans = img[asky ? 1 : 0], rule = [R`$(x; y) \mapsto (x; -y)$`, R`$(x; y) \mapsto (-x; y)$`, R`$(x; y) \mapsto (-x; -y)$`, R`$(x; y) \mapsto (x + u; y + v)$`, R`$(x; y) \mapsto (-y; x)$`][kind];
    return {
      q: R`A $P(${K.T(x)}; ${K.T(y)})$ pontot ${nm}. Mennyi a kép ${asky ? '$y$' : '$x$'}-koordinátája?`.replace('$x$-koordinátája', '$x$-koordinátája'),
      answer: { type: 'num', value: ans }, ansTex: K.T(ans), verify: ver,
      tip1: R`Írd fel a transzformáció koordinátás szabályát.`, tip2: R`A szabály: ${rule}.`,
      sol: [R`A szabály: ${rule}.`, R`A kép: $P'(${K.T(img[0])}; ${K.T(img[1])})$, a keresett koordináta $${K.T(ans)}$.`]
    };
  });

  def('g1-tr-2', 'geometria', 'transzformaciok', 1, 'Hasonló alakzatok területe, térfogata', function (r) {
    var pq = r.pick([[2, 1], [3, 1], [3, 2], [1, 2], [2, 3], [1, 3], [4, 3], [5, 2], [3, 4], [5, 3]]), p = pq[0], q = pq[1], t = r.int(1, 12), vol = r.int(0, 1) === 1;
    var e = vol ? 3 : 2, base = Math.pow(q, e) * t, img = Math.pow(p, e) * t;
    return {
      q: vol ? R`Egy test térfogata $${base}$ cm³. Egy hozzá hasonló test hasonlóságának aránya (a kép és az eredeti megfelelő hosszainak aránya): $\dfrac{${p}}{${q}}$. Hány cm³ a hasonló test térfogata?`
             : R`Egy síkidom területe $${base}$ cm². Egy hozzá hasonló síkidom hasonlóságának aránya (a kép és az eredeti megfelelő hosszainak aránya): $\dfrac{${p}}{${q}}$. Hány cm² a hasonló síkidom területe?`,
      answer: { type: 'num', value: img }, ansTex: K.T(img) + (vol ? R`\ \text{cm}^3` : R`\ \text{cm}^2`), verify: `${base}*(${p}/${q})^${e}`,
      tip1: vol ? R`A térfogatok aránya a hasonlóság arányának köbe.` : R`A területek aránya a hasonlóság arányának négyzete.`,
      tip2: R`A hasonlóság aránya $k = \dfrac{${p}}{${q}}$.`,
      sol: [R`$k = \dfrac{${p}}{${q}}$, ezért az arány $k^${e} = \left(\dfrac{${p}}{${q}}\right)^${e}$.`, R`Az új érték: $${base} \cdot \left(\dfrac{${p}}{${q}}\right)^${e} = ${img}$.`]
    };
  });

  def('g1-tr-3', 'geometria', 'transzformaciok', 2, 'Párhuzamos szelők tétele', function (r) {
    var d = r.int(2, 9), m = r.int(2, 9), t = r.int(1, 5), kind = r.int(0, 1), e = d * t;
    var head = R`Az $ABC$ háromszög $AB$ oldalán a $D$, az $AC$ oldalán az $E$ pont belső pont, és $DE \parallel BC$. Tudjuk, hogy $AD = ${d}$ cm, $DB = ${m}$ cm,`;
    if (kind === 0) {
      return { q: head + R` $AE = ${e}$ cm. Hány cm az $EC$ szakasz?`, answer: { type: 'num', value: m * t }, ansTex: K.T(m * t) + R`\ \text{cm}`, verify: `${e}*${m}/${d}`,
        tip1: R`Használd a párhuzamos szelők tételét az $A$ csúcsból induló két oldalon.`, tip2: R`$\dfrac{AD}{DB} = \dfrac{AE}{EC}$.`,
        sol: [R`$\dfrac{AD}{DB} = \dfrac{AE}{EC}$, azaz $\dfrac{${d}}{${m}} = \dfrac{${e}}{EC}$.`, R`$EC = \dfrac{${e} \cdot ${m}}{${d}} = ${m * t}$ cm.`] };
    }
    return { q: head + R` $DE = ${e}$ cm. Hány cm a $BC$ oldal?`, answer: { type: 'num', value: (d + m) * t }, ansTex: K.T((d + m) * t) + R`\ \text{cm}`, verify: `${e}*(${d}+${m})/${d}`,
      tip1: R`Az $ADE$ és $ABC$ háromszögek hasonlók.`, tip2: R`$\dfrac{DE}{BC} = \dfrac{AD}{AB}$, ahol $AB = AD + DB$.`,
      sol: [R`$AB = ${d} + ${m} = ${d + m}$ cm, és $\dfrac{DE}{BC} = \dfrac{AD}{AB}$.`, R`$BC = DE \cdot \dfrac{AB}{AD} = ${e} \cdot \dfrac{${d + m}}{${d}} = ${(d + m) * t}$ cm.`] };
  });

  def('g1-tr-4', 'geometria', 'transzformaciok', 2, 'Belső szögfelező tétele', function (r) {
    var m, n, x, j, c;
    do { m = r.int(1, 5); n = r.int(1, 5); x = r.int(2, 6); j = r.int(1, x - 1); } while (m === n || (m + n) * j <= x * Math.abs(m - n));
    var a = m * x, b = n * x; c = (m + n) * j;
    var ap = n * j, pb = m * j;
    return {
      q: R`Az $ABC$ háromszögben $BC = ${a}$ cm, $AC = ${b}$ cm, $AB = ${c}$ cm. A $C$ csúcsból húzott belső szögfelező az $AB$ oldalt a $P$ pontban metszi. Hány cm az $AP$ szakasz?`,
      answer: { type: 'num', value: ap }, ansTex: K.T(ap) + R`\ \text{cm}`, verify: `${c}*${b}/(${a}+${b})`,
      tip1: R`A belső szögfelező a szemközti oldalt a szomszédos oldalak arányában osztja.`,
      tip2: R`$\dfrac{AP}{PB} = \dfrac{AC}{BC}$, és $AP + PB = AB$.`,
      sol: [R`$\dfrac{AP}{PB} = \dfrac{AC}{BC} = \dfrac{${b}}{${a}}$, és $AP + PB = ${c}$.`, R`$AP = ${c} \cdot \dfrac{${b}}{${a} + ${b}} = ${ap}$ cm.`, R`Ellenőrzés: $PB = ${c} - ${ap} = ${pb}$ cm, és $\dfrac{${ap}}{${pb}} = \dfrac{${b}}{${a}}$.`]
    };
  });

  def('g1-tr-5', 'geometria', 'transzformaciok', 2, 'Melyik transzformáció egybevágósági?', function (r) {
    var lam = r.pick([2, 3, 4, 5, 1.5, 0.5]), n = r.int(2, 9), kind = r.int(0, 2), q, good, bad, why;
    var f = function (t) { return '$\\text{' + t + '}$'; }, g = function (t) { return '\\text{' + t + '}'; };
    if (kind === 0) {
      q = R`Melyik transzformáció **nem** egybevágósági transzformáció?`;
      good = 'középpontos hasonlóság ' + String(lam).replace('.', ',') + ' arányú nagyítással/kicsinyítéssel'; bad = ['tengelyes tükrözés', 'forgatás ' + (10 * n) + ' fokkal', 'eltolás'];
      why = R`A hasonlóság a távolságokat $${K.T(lam)}$ arányban változtatja, tehát nem távolságtartó.`;
    } else if (kind === 1) {
      q = R`Egy háromszög minden oldalát megszorozzuk ezzel a számmal: $${K.T(lam)}$. Melyik állítás igaz a kapott háromszögre?`;
      good = 'hasonló az eredetihez, szögei egyenlők'; bad = ['egybevágó az eredetivel', 'a szögei is ' + String(lam).replace('.', ',') + '-szeresükre változnak', 'területe ' + String(lam).replace('.', ',') + '-szeres'];
      why = R`Az arányos oldalak miatt a háromszögek hasonlók: szögeik egyenlők, a területek aránya $${K.T(lam * lam)}$.`;
    } else {
      q = R`Melyik állítás igaz a forgatásra? (A forgatás szöge $${10 * n}^\circ$.)`;
      good = 'megtartja a távolságokat és a körüljárási irányt'; bad = ['megfordítja a körüljárási irányt', 'megváltoztatja a szakaszok hosszát', 'a szögeket a forgatás szögével növeli'];
      why = R`A forgatás egybevágósági transzformáció: távolságtartó, szögtartó, és megtartja a körüljárási irányt.`;
    }
    return { q: q, answer: K.choice(r, f(good), bad.map(f)), ansTex: g(good), tip1: R`Idézd fel, melyik transzformáció milyen tulajdonságokat tart meg.`, tip2: R`Az egybevágósági transzformációk a távolságokat és a szögeket megtartják.`, sol: [why] };
  });

  def('g1-tr-6', 'geometria', 'transzformaciok', 3, 'Trapéz átlóinak metszéspontja', function (r) {
    var pq = r.pick([[12, 8], [9, 6], [10, 5], [15, 10], [14, 7], [6, 4], [8, 4], [12, 9], [20, 15]]), p = pq[0], q = pq[1], u = r.int(1, 4), m = (p + q) * u, kind = r.int(0, 1);
    var head = R`Az $ABCD$ trapézban $AB \parallel CD$, $AB = ${p}$ cm, $CD = ${q}$ cm, a magassága $${m}$ cm. Az átlók metszéspontja $M$.`;
    if (kind === 0) {
      var h1 = u * p, val = p * h1 / 2;
      return { q: head + R` Mekkora az $ABM$ háromszög területe (cm²)?`, answer: { type: 'num', value: val }, ansTex: K.T(val) + R`\ \text{cm}^2`, verify: `${p}*(${m}*${p}/(${p}+${q}))/2`,
        tip1: R`Az $ABM$ és $CDM$ háromszögek hasonlók; a hasonlóság aránya az alapok aránya.`,
        tip2: R`A két magasság aránya $${p} : ${q}$, összegük a trapéz magassága. Az $ABM$ magassága $\dfrac{${p}}{${p} + ${q}} \cdot ${m}$.`,
        sol: [R`A hasonlóság aránya $\dfrac{AB}{CD} = \dfrac{${p}}{${q}}$, így a magasságok aránya is ennyi.`, R`$m_{ABM} = ${m} \cdot \dfrac{${p}}{${p} + ${q}} = ${h1}$ cm.`, R`$T_{ABM} = \dfrac{${p} \cdot ${h1}}{2} = ${K.T(val)}$ cm².`] };
    }
    var len = 2 * p * q / (p + q);
    return { q: head + R` Mekkora az $M$-en át az alapokkal párhuzamosan húzott, a szárak közé eső szakasz hossza? (cm, két tizedesre kerekítve)`, answer: { type: 'num', value: len, tol: 0.0051 }, ansTex: R`\approx ${K.T(len, 2)}\ \text{cm}`, verify: `2*${p}*${q}/(${p}+${q})`,
      tip1: R`Az $ABD$ és az $ABC$ háromszögben is használd a párhuzamos szelők tételét.`,
      tip2: R`$BM : MD = AB : CD = ${p} : ${q}$, így a szakasz egyik fele $${p} \cdot \dfrac{${q}}{${p} + ${q}}$.`,
      sol: [R`$\dfrac{DM}{DB} = \dfrac{${q}}{${p} + ${q}}$, ezért az $M$-től a száron lévő pontig terjedő szakasz $${p} \cdot \dfrac{${q}}{${p} + ${q}}$.`, R`A két fél egyenlő, így az egész szakasz $\dfrac{2 \cdot ${p} \cdot ${q}}{${p} + ${q}} \approx ${K.T(len, 2)}$ cm.`] };
  });

  def('g1-tr-7', 'geometria', 'transzformaciok', 3, 'Csonkagúla térfogata hasonlósággal', function (r) {
    var pq = r.pick([[1, 2], [1, 3], [2, 3], [3, 4], [2, 5], [3, 5]]), p = pq[0], q = pq[1], t = r.int(1, 6), V = q * q * q * t, cs = (q * q * q - p * p * p) * t;
    return {
      q: R`Egy gúla térfogata $${V}$ cm³. Az alappal párhuzamos síkkal a csúcstól mért magasság $\dfrac{${p}}{${q}}$ részénél elmetsszük. Hány cm³ a keletkező csonkagúla térfogata?`,
      answer: { type: 'num', value: cs }, ansTex: K.T(cs) + R`\ \text{cm}^3`, verify: `${V}-${V}*(${p}/${q})^3`,
      tip1: R`A levágott kis gúla hasonló az egészhez.`,
      tip2: R`A hasonlóság aránya $\dfrac{${p}}{${q}}$, a térfogatok aránya ennek köbe. A csonkagúla az egész és a kis gúla különbsége.`,
      sol: [R`A kis gúla térfogata: $${V} \cdot \left(\dfrac{${p}}{${q}}\right)^3 = ${p * p * p * t}$ cm³.`, R`A csonkagúla térfogata: $${V} - ${p * p * p * t} = ${cs}$ cm³.`]
    };
  });

  /* ===================== 4.3 Síkbeli és térbeli alakzatok ===================== */
  MO.content['geometria/alakzatok'] = {
    intro: R`Ebben a fejezetben a síkidomok és testek legfontosabb tételei vannak: a háromszögek nevezetes vonalai, pontjai és körei, a Pitagorasz-tétel, a magasság- és a befogótétel, a speciális négyszögek, a sokszögek szögei és átlói, a kör érintője, a kerületi és középponti szögek, a Thalész-tétel, valamint a hasábok, hengerek, gúlák, kúpok, gömbök és csonkjaik. A követelmény szerint középszinten a bizonyítást (Pitagorasz, Thalész, oldalfelező merőlegesek és szögfelezők metszéspontja, sokszögek szögösszege) is kéri; emelt szinten a további tételek bizonyítását is. Geometriai feladatokban ezekre a tételekre építünk.`,
    theory: [
      { h: 'Háromszögek osztályozása és alapösszefüggései',
        b: R`**Oldalak szerint:** általános, egyenlő szárú (két oldal egyenlő; az alapon fekvő szögek egyenlők), szabályos (mindhárom oldal egyenlő, szögei $60^\circ$). **Szögek szerint:** hegyesszögű, derékszögű, tompaszögű.\n\n**Alapösszefüggések:**\n- **háromszög-egyenlőtlenség:** bármely oldal kisebb a másik két oldal összegénél, és nagyobb a különbségüknél: $|a - b| < c < a + b$;\n- a **belső szögek** összege $180^\circ$;\n- a **külső szög** egyenlő a nem mellette fekvő két belső szög összegével, a külső szögek összege $360^\circ$;\n- **nagyobb oldallal szemben nagyobb szög van** (és fordítva).\n\n**Speciális háromszögek:** az egyenlő szárú háromszögben az alaphoz tartozó magasság, súlyvonal, szögfelező és oldalfelező merőleges egybeesik; a szabályos háromszög magassága $m = \dfrac{a\sqrt{3}}{2}$, területe $\dfrac{a^2\sqrt{3}}{4}$; a derékszögű háromszög átfogóhoz tartozó súlyvonala az átfogó fele (a Thalész-tétel megfordítása miatt).` },
      { h: 'Oldalfelező merőlegesek, szögfelezők: körülírt és beírt kör',
        b: R`- A háromszög **oldalfelező merőlegesei** egy pontban metszik egymást; ez a pont a három csúcstól egyenlő távolságra van, tehát a **körülírt kör középpontja** ($R$ a körülírt kör sugara). Hegyesszögű háromszögnél a belsejében, derékszögűnél az átfogó felezőpontja, tompaszögűnél a háromszögön kívül van.\n- A háromszög **belső szögfelezői** egy pontban metszik egymást (a háromszög belsejében); ez a pont a három oldaltól egyenlő távolságra van, tehát a **beírt kör középpontja** ($r$ a beírt kör sugara).\n- **Terület és sugarak:** $T = \dfrac{r \cdot (a + b + c)}{2} = r \cdot s$ ($s$ a félkerület). Derékszögű háromszögben $R = \dfrac{c}{2}$ és $r = \dfrac{a + b - c}{2}$.`,
        proof: R`*Oldalfelező merőlegesek.* Az oldalfelező merőleges az oldal két végpontjától egyenlő távolságra lévő pontok halmaza. Legyen $O$ az $AB$ és a $BC$ oldalfelező merőlegesének metszéspontja (metszik egymást, mert nem párhuzamosak: a csúcsok nincsenek egy egyenesen). Ekkor $OA = OB$ és $OB = OC$, így $OA = OC$, vagyis $O$ az $AC$ oldalfelező merőlegesén is rajta van. Az $O$ egyenlő távolságra van a három csúcstól, így az $OA$ sugarú $O$ középpontú kör átmegy a csúcsokon.\n\n*Szögfelezők.* A szögfelező a szög szárától egyenlő távolságra lévő pontok halmaza. Legyen $I$ az $A$ és $B$ csúcsnál húzott belső szögfelezők metszéspontja. Az $A$ szögfelezőjén $I$ egyenlő távolságra van az $AB$ és $AC$ egyenestől, a $B$-ből húzotton az $AB$ és $BC$ egyenestől. Így $I$ mindhárom oldalegyenestől egyenlő távolságra van, és (két belső szögfelező metszéspontjaként) a háromszög belsejében van, ezért a $C$-nél lévő szög belsejében is, tehát a $C$-nél lévő szögfelezőn is rajta van. A közös távolság $r$, az $r$ sugarú, $I$ középpontú kör mindhárom oldalt érinti.` },
      { h: 'Magasságvonal, súlyvonal, középvonal',
        b: R`- **Magasságvonal:** a csúcsból a szemközti oldal egyenesére állított merőleges; a három magasságvonal egy pontban, a **magasságpontban** metszi egymást (hegyesszögű háromszögben belül, derékszögűben a derékszögű csúcsban, tompaszögűben kívül).\n- **Súlyvonal:** a csúcsot a szemközti oldal felezőpontjával összekötő szakasz; a három súlyvonal egy pontban, a **súlypontban** metszi egymást, amely mindegyik súlyvonalat a csúcstól számítva $2 : 1$ arányban osztja.\n- **Középvonal:** két oldal felezőpontját összekötő szakasz; párhuzamos a harmadik oldallal és annak fele.\n\nA háromszög súlypontja a csúcsok koordinátáinak átlaga: $S\left(\dfrac{x_A + x_B + x_C}{3}; \dfrac{y_A + y_B + y_C}{3}\right)$. A súlyvonalak a háromszöget hat egyenlő területű részre osztják.`,
        proof: R`*Középvonal.* Az $ABC$ háromszög $AB$ és $AC$ oldalának felezőpontja $D$ és $E$. Az $A$ középpontú, $\dfrac{1}{2}$ arányú hasonlóság $B$-t $D$-be, $C$-t $E$-be viszi, ezért $DE \parallel BC$ és $DE = \dfrac{BC}{2}$.\n\n*Súlypont.* Legyenek $A_1$ és $B_1$ a $BC$ és $AC$ oldal felezőpontjai, az $AA_1$ és $BB_1$ súlyvonalak metszéspontja $S$. Az $A_1B_1$ középvonal, tehát párhuzamos az $AB$-vel és fele olyan hosszú. Az $ABS$ és $A_1B_1S$ háromszögek szögei egyenlők (váltószögek), így hasonlók $2 : 1$ aránnyal; ebből $AS : SA_1 = 2 : 1$ és $BS : SB_1 = 2 : 1$. Ugyanez igaz a $BB_1$ és $CC_1$ súlyvonalak metszéspontjára is, amely a $BB_1$ szakaszt $B$-től $2 : 1$ arányban osztja; a $BB_1$ szakaszon egyetlen ilyen pont van, ezért ez is $S$, tehát mindhárom súlyvonal átmegy $S$-en.\n\n*Magasságpont.* Húzzunk a csúcsokon át a szemközti oldalakkal párhuzamos egyeneseket; ezek egy $A'B'C'$ háromszöget alkotnak, amelyben $A$, $B$, $C$ rendre a $B'C'$, $C'A'$, $A'B'$ oldal felezőpontja (az $ABCB'$ és $ACBC'$ paralelogrammák miatt $AB' = BC = AC'$). Az $A$-ból $BC$-re állított merőleges így a $B'C'$ oldal felezőpontján áthaladó, rá merőleges egyenes, vagyis az $A'B'C'$ háromszög oldalfelező merőlegese. A három magasságvonal tehát egy háromszög oldalfelező merőlegese, ezért egy pontban metszik egymást.` },
      { h: 'Pitagorasz-tétel, magasságtétel, befogótétel',
        b: R`**Pitagorasz-tétel:** derékszögű háromszögben a befogók négyzetének összege egyenlő az átfogó négyzetével: $a^2 + b^2 = c^2$. **Megfordítása:** ha egy háromszög oldalaira $a^2 + b^2 = c^2$, akkor a háromszög derékszögű, és az átfogó $c$. Hasznos számhármasok: $3; 4; 5$, $5; 12; 13$, $8; 15; 17$, $7; 24; 25$.\n\nHa a derékszögű háromszög átfogóját a magasság talppontja $p$ és $q$ hosszú szakaszra osztja ($c = p + q$), és az átfogóhoz tartozó magasság $m$, akkor:\n- **magasságtétel** (emelt): $m^2 = p \cdot q$;\n- **befogótétel** (emelt): $a^2 = c \cdot p$, $b^2 = c \cdot q$ (a befogó az átfogó és a befogó átfogóra eső vetületének mértani közepe).\n\nA területet kétféleképpen felírva: $\dfrac{a \cdot b}{2} = \dfrac{c \cdot m}{2}$.`,
        proof: R`*Pitagorasz-tétel.* Vegyünk egy $a + b$ oldalú négyzetet, és helyezzünk el benne négy darab $a$, $b$ befogójú, $c$ átfogójú derékszögű háromszöget úgy, hogy a maradék rész egy $c$ oldalú négyzet legyen. Területekkel: $(a + b)^2 = 4 \cdot \dfrac{ab}{2} + c^2$, azaz $a^2 + 2ab + b^2 = 2ab + c^2$, amiből $a^2 + b^2 = c^2$.\n\n*Megfordítás.* Legyen $a^2 + b^2 = c^2$. Szerkesszünk derékszögű háromszöget $a$ és $b$ befogóval; átfogója a Pitagorasz-tétel szerint $x = \sqrt{a^2 + b^2} = c$. A két háromszög oldalai páronként egyenlők, tehát egybevágók, így az eredeti is derékszögű.\n\n*Magasság- és befogótétel.* Az $ABC$ háromszög derékszöge $C$-nél, $T$ a magasság talppontja. A $CBT$, $ACT$ és $ABC$ háromszögek szögei páronként egyenlők, tehát hasonlók. Az $ACT \sim CBT$ hasonlóságból $\dfrac{m}{p} = \dfrac{q}{m}$, ezért $m^2 = pq$. Az $ABC \sim ACT$ hasonlóságból $\dfrac{c}{b} = \dfrac{b}{q}$, azaz $b^2 = c \cdot q$ (és hasonlóan $a^2 = c \cdot p$).` },
      { h: 'Négyszögek és sokszögek',
        b: R`**Speciális négyszögek:** *trapéz* (van párhuzamos oldalpárja; egyenlő szárú trapéznál a szárak egyenlők, tengelyesen szimmetrikus); *paralelogramma* (két párhuzamos oldalpár; szemközti oldalak és szögek egyenlők, az átlók felezik egymást); *deltoid* (két-két szomszédos oldal egyenlő; átlói merőlegesek, az egyik átló a szimmetriatengely); *rombusz* (négy egyenlő oldal; átlói felezik egymást, merőlegesek és szögfelezők); *téglalap* (négy derékszög; átlói egyenlők, felezik egymást); *négyzet* (egyszerre rombusz és téglalap).\n\nA konvex négyszög belső szögeinek összege $360^\circ$, a külső szögeké is $360^\circ$.\n\n**Húrnégyszög** (köré kör írható; emelt): szemközti szögeinek összege $180^\circ$; megfordítva, ha egy konvex négyszög szemközti szögeinek összege $180^\circ$, akkor húrnégyszög. **Érintőnégyszög** (beírható kör; emelt): szemközti oldalainak összege egyenlő, $a + c = b + d$; ez megfordítva is igaz.\n\n**Konvex $n$ szögű sokszög:** egy csúcsból $n - 3$ átló indul, az átlók száma $\dfrac{n(n - 3)}{2}$; a belső szögek összege $(n - 2) \cdot 180^\circ$; a külső szögek összege $360^\circ$. **Szabályos sokszög:** minden oldala és minden szöge egyenlő; belső szöge $\dfrac{(n - 2) \cdot 180^\circ}{n}$, külső szöge $\dfrac{360^\circ}{n}$.`,
        proof: R`*Sokszögek.* Egy csúcsból a két szomszédjára és önmagára nem húzható átló, tehát $n - 3$ átló indul. Minden átlót két csúcsból számolnánk, ezért az átlók száma $\dfrac{n(n - 3)}{2}$. Egy csúcsból induló átlók a konvex sokszöget $n - 2$ háromszögre bontják, a háromszögek szögeinek összege adja a sokszög szögeinek összegét: $(n - 2) \cdot 180^\circ$. Minden csúcsnál a belső és a külső szög összege $180^\circ$, ezért a külső szögek összege $n \cdot 180^\circ - (n - 2) \cdot 180^\circ = 360^\circ$.\n\n*Húrnégyszög.* Az $ABCD$ húrnégyszögben a $\alpha = \angle DAB$ kerületi szög a $BCD$ ívhez, $\gamma = \angle BCD$ a $BAD$ ívhez tartozik. A kerületi szög a hozzá tartozó középponti szög (az ív szögmértéke) fele, így $\alpha + \gamma = \dfrac{1}{2}(\text{ív}_{BCD} + \text{ív}_{BAD}) = \dfrac{1}{2} \cdot 360^\circ = 180^\circ$. Fordítva: legyen $ABCD$ konvex négyszög, amelyben $\alpha + \gamma = 180^\circ$, és $k$ az $A$, $B$, $D$ pontokon átmenő kör. A konvexitás miatt $A$ és $C$ a $BD$ egyenes két különböző oldalán van. A $k$ kör $BD$ egyenesnek a $C$-t tartalmazó oldalán lévő íve az $A$ oldali ív kerületi szögét $180^\circ$-ra egészíti ki (az előbbi bizonyítás szerint), vagyis ennek az ívnek minden pontjából a $BD$ szakasz $180^\circ - \alpha$ szögben látszik. A $BD$-t egy adott szögben, az egyenes adott oldalán látó pontok halmaza egyetlen körív (látókör), és $\angle BCD = \gamma = 180^\circ - \alpha$, ezért a $C$ ezen az íven, tehát a $k$ körön van.\n\n*Érintőnégyszög.* A csúcsokból a beírt körhöz húzott érintőszakaszok páronként egyenlők: legyenek $x, y, z, w$ rendre az $A, B, C, D$ csúcsból húzott érintőszakaszok. Ekkor $AB + CD = (x + y) + (z + w) = (y + z) + (w + x) = BC + DA$.` },
      { h: 'Kör: részei, érintő, ívhossz, körcikk, radián',
        b: R`**A kör részei:** középpont, sugár, húr, átmérő, ív, körcikk, körszelet, szelő, érintő. Kerület: $K = 2\pi r$, terület: $T = \pi r^2$.\n\n**Érintő:** a kör érintője a körnek pontosan egy közös pontját tartalmazó egyenes; **merőleges az érintési pontba húzott sugárra**. A **külső pontból húzott két érintőszakasz egyenlő hosszú**.\n\n**Szögmérés:** fokban ($360^\circ$ a teljes kör) és **radiánban** (emelt): $\alpha$ radiánban az ív hosszának és a sugárnak a hányadosa, $\alpha = \dfrac{i}{r}$. Átváltás: $180^\circ = \pi$ rad, így $1\ \text{rad} \approx 57{,}3^\circ$.\n\n**Ív és körcikk:** a középponti szög arányos az íve hosszával és a körcikk területével. $\alpha$ fokban: $i = 2\pi r \cdot \dfrac{\alpha}{360^\circ}$, $T_{\text{cikk}} = \pi r^2 \cdot \dfrac{\alpha}{360^\circ}$; $\varphi$ radiánban: $i = r\varphi$, $T_{\text{cikk}} = \dfrac{r^2\varphi}{2}$.`,
        proof: R`*Az érintő merőleges az érintési pontba húzott sugárra.* Legyen az $e$ érintő a kört $T$-ben érinti, $O$ a középpont. Tegyük fel, hogy $OT$ nem merőleges $e$-re; legyen az $O$-ból $e$-re húzott merőleges talppontja $T' \neq T$. Tükrözzük $T$-t $T'$-re, a kép $T''$ szintén $e$-n van, és $OT'' = OT = r$ ($OT'$ a $TT''$ szakasz felező merőlegese). Így $e$-nek két közös pontja volna a körrel, ami ellentmond annak, hogy érintő. Tehát $OT \perp e$.\n\n*Az érintőszakaszok egyenlők.* Az $O$ középpontú kör érintőit a $P$ külső pontból húzzuk, az érintési pontok $T_1$ és $T_2$. Az $OT_1P$ és $OT_2P$ derékszögű háromszögekben $OT_1 = OT_2 = r$ és $OP$ közös átfogó, így Pitagorasz-tétellel $PT_1 = \sqrt{OP^2 - r^2} = PT_2$.` },
      { h: 'Kerületi és középponti szögek, Thalész-tétel, látókör',
        b: R`**Középponti szög:** a csúcsa a kör középpontja. **Kerületi szög:** a csúcsa a körvonalon van, a szárai húrok (vagy érintő és húr).\n\n- **Kerületi és középponti szögek tétele** (emelt): egy körív feletti kerületi szög fele az ugyanazon ívhez tartozó középponti szögnek.\n- **Kerületi szögek tétele** (emelt): ugyanazon ívhez tartozó kerületi szögek egyenlők.\n- **Thalész-tétel:** ha egy kör egy átmérőjének végpontjait összekötjük a körvonal bármely más pontjával, derékszögű háromszöget kapunk. **Megfordítása:** ha $\angle ACB = 90^\circ$, akkor $C$ rajta van az $AB$ átmérőjű körön.\n- **Látókör** (emelt): az $AB$ szakaszt egy adott $\varphi$ szögben látó pontok halmaza az $AB$ egyenes egy oldalán egy, az $A$-n és $B$-n átmenő körív; az egyenes két oldalán két szimmetrikus ív. $\varphi = 90^\circ$ esetén ez a Thalész-kör (félkör).`,
        proof: R`*Kerületi és középponti szög.* Legyen $O$ a kör középpontja, $A$, $B$, $C$ a körvonalon. Első eset: $AC$ átmérő. Az $OBC$ háromszög egyenlő szárú ($OB = OC$), így $\angle OBC = \angle OCB = \gamma$ a kerületi szög. Az $AOB$ középponti szög a háromszög külső szöge, értéke $2\gamma$. (Középponti szögön az ív szögmértékét értjük, $180^\circ$-nál nagyobb ívnél homorú szöget.) Második eset: az $O$ a kerületi szög szárai közötti szögtartomány belsejében van. A $C$-n át húzott $CD$ átmérő $D$ végpontja az $AB$ ívre esik, és a $CD$ a kerületi szöget $\angle ACD$-re és $\angle DCB$-re, a középponti szöget (az $AB$ ívet) $\angle AOD$-re és $\angle DOB$-re bontja. Mindkét részre az első eset érvényes: $\angle ACD = \tfrac{1}{2}\angle AOD$ és $\angle DCB = \tfrac{1}{2}\angle DOB$, ezeket összeadva $\angle ACB = \tfrac{1}{2}\angle AOB$. Harmadik eset: az $O$ kívül van a kerületi szögön; ekkor a $C$-n át húzott $CD$ átmérővel a $CB$ szár a $CA$ és $CD$ között halad (a másik elrendezésben $A$ és $B$ szerepe felcserélődik), és $\angle ACB = \angle ACD - \angle BCD = \tfrac{1}{2}\angle AOD - \tfrac{1}{2}\angle BOD = \tfrac{1}{2}\angle AOB$, mert az ívek különbsége az $AB$ ív.\n\n*Kerületi szögek tétele.* Az ugyanazon ívhez tartozó kerületi szögek mindegyike az ívhez tartozó középponti szög fele, ezért egyenlők.\n\n*Thalész-tétel.* Az $AB$ átmérő feletti kerületi szög az $AB$ félkör középponti szögének ($180^\circ$) fele, tehát $90^\circ$. (Közvetlenül: az $OAC$ és $OBC$ egyenlő szárú háromszögekben az alapszögek $\alpha$ és $\beta$, és $2\alpha + 2\beta = 180^\circ$, így $\alpha + \beta = 90^\circ$.)\n\n*Thalész megfordítása.* Legyen $\angle ACB = 90^\circ$, $M$ az $AB$ felezőpontja. Tükrözzük $C$-t $M$-re, a kép $C'$. Az $ACBC'$ négyszög átlói felezik egymást, tehát paralelogramma, és van derékszöge, ezért téglalap. A téglalap átlói egyenlők és felezik egymást: $MC = MA = MB$. Így $C$ az $M$ középpontú, $\dfrac{AB}{2}$ sugarú körön van.` },
      { h: 'Térbeli alakzatok: testek és részeik',
        b: R`**Hasáb:** két egybevágó, párhuzamos alaplap és téglalap vagy paralelogramma oldallapok; $V = T_a \cdot m$, felszín: $A = 2T_a + P$ ($P$ a palást).\n**Henger:** $V = \pi r^2 m$, $A = 2\pi r(r + m)$ (palást: $2\pi r m$).\n**Gúla:** egy alaplap és egy csúcs; $V = \dfrac{T_a \cdot m}{3}$.\n**Kúp:** alapkör, csúcs, alkotó $a$ (az alkotó, a sugár és a magasság: $a^2 = r^2 + m^2$); $V = \dfrac{\pi r^2 m}{3}$, $A = \pi r(r + a)$ (palást: $\pi r a$).\n**Gömb:** $V = \dfrac{4}{3}\pi r^3$, $A = 4\pi r^2$.\n**Csonkagúla** (az alappal párhuzamos síkkal levágott gúla alsó része): $V = \dfrac{m}{3}\left(T + \sqrt{Tt} + t\right)$, ahol $T$ az alsó, $t$ a felső lap területe.\n**Csonkakúp:** alsó sugár $R$, felső sugár $r$, magasság $m$, alkotó $a$: $V = \dfrac{\pi m}{3}\left(R^2 + Rr + r^2\right)$, palást $\pi(R + r)a$, felszín $\pi R^2 + \pi r^2 + \pi(R + r)a$.\n\nA csonka testek számolásánál gyakran hasznos kiegészíteni őket teljes gúlává (kúppá), és a levágott résszel hasonlóságot felírni (lásd a 4.2 pontot).` }
    ],
    examples: [
      { t: 'Magasság- és befogótétel',
        p: R`Az $ABC$ derékszögű háromszög derékszöge a $C$ csúcsnál van; a $C$-ből az $AB$ átfogóra húzott magasság talppontja $T$, és $AT = 9$ cm, $TB = 16$ cm. Számítsd ki a $CT$ magasságot, az $AC$ és $BC$ befogókat, és a háromszög területét!`,
        steps: [R`Az átfogó $AB = 9 + 16 = 25$ cm.`, R`Magasságtétel: $CT^2 = AT \cdot TB = 9 \cdot 16 = 144$, ezért $CT = 12$ cm.`, R`Befogótétel: $AC^2 = AT \cdot AB = 9 \cdot 25 = 225$, így $AC = 15$ cm; $BC^2 = TB \cdot AB = 16 \cdot 25 = 400$, így $BC = 20$ cm.`, R`Ellenőrzés Pitagorasz-tétellel: $15^2 + 20^2 = 225 + 400 = 625 = 25^2$. Terület kétféleképpen: $\dfrac{15 \cdot 20}{2} = 150$ és $\dfrac{25 \cdot 12}{2} = 150$.`],
        ans: R`$CT = 12$ cm, $AC = 15$ cm, $BC = 20$ cm, a terület $150$ cm².`,
        checks: [['sqrt(9*16)', '12'], ['sqrt(9*25)', '15'], ['sqrt(16*25)', '20'], ['15^2+20^2', '25^2'], ['15*20/2', '25*12/2']] },
      { t: 'A 13; 14; 15 oldalú háromszög sugarai',
        p: R`Az $ABC$ háromszög oldalai $AB = 13$ cm, $BC = 14$ cm, $CA = 15$ cm. Számítsd ki a területét, a beírt és a körülírt kör sugarát! (Az ábra: a $BC$ oldal vízszintes, $B$ bal oldalon, $C$ jobb oldalon; az $A$ csúcs a $BC$ felett van.)`,
        steps: [R`Az $A$ csúcs merőleges vetülete a $BC$ egyenesre legyen $T$. A $BT = x$ jelöléssel $AT^2 = 13^2 - x^2 = 15^2 - (14 - x)^2$. Ebből $169 - x^2 = 225 - 196 + 28x - x^2$, azaz $28x = 140$, $x = 5$. Tehát $BT = 5$ cm, $TC = 9$ cm és $m = AT = \sqrt{13^2 - 5^2} = 12$ cm. (Ellenőrzés: $\sqrt{15^2 - 9^2} = 12$.)`, R`Terület: $T_{ABC} = \dfrac{14 \cdot 12}{2} = 84$ cm².`, R`Beírt kör: a háromszöget az $I$ középpontból három háromszögre bontva $T = \dfrac{r \cdot (13 + 14 + 15)}{2} = 21r$, így $r = \dfrac{84}{21} = 4$ cm.`, R`Körülírt kör: koordinátákban $B(0; 0)$, $C(14; 0)$, $A(5; 12)$. A középpont a $BC$ oldalfelező merőlegesén van, $O(7; y)$. $OB^2 = OA^2$: $49 + y^2 = 4 + (y - 12)^2 = y^2 - 24y + 148$, ebből $24y = 99$, $y = \dfrac{33}{8}$.`, R`$R = OB = \sqrt{49 + \left(\dfrac{33}{8}\right)^2} = \sqrt{\dfrac{3136 + 1089}{64}} = \sqrt{\dfrac{4225}{64}} = \dfrac{65}{8} = 8{,}125$ cm.`, R`Ellenőrzés: $OC^2 = (14-7)^2 + y^2 = 49 + y^2$, ugyanannyi, mint $OB^2$; és $R > r$ is teljesül.`],
        ans: R`$T = 84$ cm², $r = 4$ cm, $R = \dfrac{65}{8} = 8{,}125$ cm.`,
        checks: [['sqrt(13^2-5^2)', '12'], ['sqrt(15^2-9^2)', '12'], ['5+9', '14'], ['14*12/2', '84'], ['84/21', '4'], ['(148-49)/24', '33/8'], ['sqrt(49+(33/8)^2)', '65/8']] },
      { t: 'Thalész-tétel és kör szögei',
        p: R`Az $AB$ átmérőjű kör átmérője $20$ cm. A kör $C$ pontjára $AC = 12$ cm. a) Mekkora a $BC$ szakasz? b) Mekkora a $C$-ből az $AB$ átmérőre húzott magasság? c) Mekkora az $\angle AOC$ középponti szög, ha $O$ a kör középpontja? (Fokban, két tizedesre kerekítve.)`,
        steps: [R`a) A Thalész-tétel szerint $\angle ACB = 90^\circ$, így Pitagorasz-tétellel $BC = \sqrt{AB^2 - AC^2} = \sqrt{400 - 144} = 16$ cm.`, R`b) A $C$-ből húzott magasság a háromszög területéből: $\dfrac{AC \cdot BC}{2} = \dfrac{AB \cdot m}{2}$, azaz $m = \dfrac{12 \cdot 16}{20} = 9{,}6$ cm.`, R`c) A kerületi szög $\angle ABC = \beta$ az $AC$ ívhez tartozik, $\operatorname{tg}\beta = \dfrac{AC}{BC} = \dfrac{12}{16} = \dfrac{3}{4}$, ezért $\beta \approx 36{,}87^\circ$.`, R`Az $AC$ ívhez tartozó középponti szög a kerületi szög kétszerese: $\angle AOC = 2\beta \approx 73{,}74^\circ$.`, R`Ellenőrzés: az $OAC$ egyenlő szárú háromszögben $OA = OC = 10$, $AC = 12$; $\cos\angle AOC = \dfrac{100 + 100 - 144}{2 \cdot 100} = 0{,}28$, és $\cos 73{,}74^\circ \approx 0{,}28$.`],
        ans: R`a) $BC = 16$ cm; b) $9{,}6$ cm; c) $\angle AOC \approx 73{,}74^\circ$.`,
        checks: [['sqrt(400-144)', '16'], ['12*16/20', '9,6'], ['12/16', '3/4'], ['2*36,87', '73,74'], ['(100+100-144)/(2*100)', '0,28']] },
      { t: 'Sokszög átlói és szögei',
        p: R`Melyik az a konvex sokszög, amelynek $54$ átlója van? Mekkora a belső szögeinek összege, és mekkora egy belső szöge, ha a sokszög szabályos?`,
        steps: [R`Az $n$ oldalú konvex sokszög átlóinak száma $\dfrac{n(n - 3)}{2}$. Az $\dfrac{n(n - 3)}{2} = 54$ egyenletből $n^2 - 3n - 108 = 0$ ($n \geq 3$ egész szám).`, R`A megoldóképlet szerint $n = \dfrac{3 \pm \sqrt{9 + 432}}{2} = \dfrac{3 \pm 21}{2}$, vagyis $n = 12$ vagy $n = -9$. A negatív érték nem lehet oldalszám, ezért $n = 12$.`, R`Belső szögek összege: $(12 - 2) \cdot 180^\circ = 1800^\circ$.`, R`Szabályos tizenkétszög egy belső szöge: $\dfrac{1800^\circ}{12} = 150^\circ$.`, R`Ellenőrzés: $\dfrac{12 \cdot 9}{2} = 54$, és a külső szög $180^\circ - 150^\circ = 30^\circ$, amiből $12 \cdot 30^\circ = 360^\circ$.`],
        ans: R`A sokszög tizenkétszög; belső szögeinek összege $1800^\circ$, szabályos esetben egy belső szöge $150^\circ$.`,
        checks: [['12*9/2', '54'], ['(12-2)*180', '1800'], ['1800/12', '150'], ['12*(180-150)', '360']] },
      { t: 'Kúp és csonkakúp',
        p: R`Egy forgáskúp alapkörének sugara $6$ cm, magassága $8$ cm. A kúpot az alappal párhuzamos síkkal a magasság felénél elmetsszük. Számítsd ki a kúp alkotóját, palástjának területét és térfogatát, majd a keletkező csonkakúp térfogatát és palástjának területét! (A választ $\pi$-vel kifejezve add meg.)`,
        steps: [R`Az alkotó: $a = \sqrt{6^2 + 8^2} = 10$ cm. A palást területe $\pi r a = 60\pi$ cm². A térfogat: $V = \dfrac{\pi \cdot 36 \cdot 8}{3} = 96\pi$ cm³.`, R`A magasság felénél lévő síkkal levágott kis kúp hasonló az eredetihez, aránya $\dfrac{1}{2}$: sugara $3$ cm, magassága $4$ cm, alkotója $5$ cm, térfogata $96\pi \cdot \dfrac{1}{8} = 12\pi$ cm³.`, R`A csonkakúp térfogata a különbség: $96\pi - 12\pi = 84\pi$ cm³ $\approx 263{,}9$ cm³.`, R`Ellenőrzés a csonkakúp képletével ($R = 6$, $r = 3$, $m = 4$): $V = \dfrac{\pi \cdot 4}{3}(36 + 18 + 9) = \dfrac{4 \cdot 63}{3}\pi = 84\pi$.`, R`A csonkakúp alkotója a két alkotó különbsége: $a_{cs} = 10 - 5 = 5$ cm. Palástja: $\pi(R + r)a_{cs} = \pi \cdot 9 \cdot 5 = 45\pi$ cm². (Ellenőrzés: $60\pi - \pi \cdot 3 \cdot 5 = 45\pi$.)`],
        ans: R`A kúp alkotója $10$ cm, palástja $60\pi$ cm², térfogata $96\pi$ cm³; a csonkakúp térfogata $84\pi \approx 263{,}9$ cm³, palástja $45\pi \approx 141{,}4$ cm².`,
        checks: [['sqrt(6^2+8^2)', '10'], ['pi*36*8/3', '96*pi'], ['96*pi/8', '12*pi'], ['96*pi-12*pi', '84*pi'], ['pi*4/3*(36+18+9)', '84*pi'], ['pi*9*5', '60*pi-pi*3*5']] }
    ],
    sims: ['haromszog', 'kor-szogek', 'sikmetszet'],
    mistakes: [
      R`A Pitagorasz-tételt nem derékszögű háromszögre alkalmazzák, vagy az átfogót nem a leghosszabb oldalnak veszik. Az átfogó a derékszöggel szemközti oldal.`,
      R`A magasságtételben és a befogótételben összekeverik a szakaszokat: $m^2 = p \cdot q$ (az átfogó két része), $a^2 = c \cdot p$ (az átfogó **egész hossza** és a befogó vetülete).`,
      R`A kerületi és a középponti szög kapcsolatát fordítva használják: a **középponti szög a kerületi szög kétszerese**, ugyanazon ívhez tartozik.`,
      R`A beírt és a körülírt kört felcserélik: a körülírt kör középpontja az **oldalfelező merőlegesek**, a beírt köré a **szögfelezők** metszéspontja.`,
      R`A súlypontot a magasságponttal keverik; a súlypont a súlyvonalat a csúcstól $2 : 1$ arányban osztja (a csúcshoz közelebbi rész a hosszabb).`,
      R`Húrnégyszögnél a szomszédos szögek összegét veszik $180^\circ$-nak; a **szemközti** szögek összege $180^\circ$. Érintőnégyszögnél a szemközti **oldalak** összegei egyenlők.`,
      R`A palástot és a teljes felszínt összekeverik; a csonkakúp alkotója nem a kúp alkotója, hanem a két alkotó különbsége.`
    ],
    exam: R`A követelmény szerint közép- és emelt szinten is tudni kell a síkidomok és testek csoportosítását, a háromszögek osztályozását és alapösszefüggéseit, a nevezetes vonalakat, pontokat és köröket, a Pitagorasz-tételt és megfordítását (a Pitagorasz-tétel bizonyítását is), a speciális négyszögeket, a sokszögek átlóinak számát és szögösszegét (bizonyítással), a kör érintőjére és a Thalész-tételre vonatkozó állításokat, a körcikk és ív arányosságát, valamint a hasábot, hengert, gúlát, kúpot, gömböt, csonkagúlát és csonkakúpot. Emelt szinten ezek mellett bizonyítani kell a nevezetes vonalakra vonatkozó tételeket, a Pitagorasz-tétel megfordítását, a magasság- és befogótételt, a húr- és érintőnégyszög tételét, a kerületi és középponti szögek tételét, és a látókör fogalmát is ismerni kell; a szöget radiánban is mérni kell tudni.`,
    cheat: [R`a^2 + b^2 = c^2, \qquad m^2 = p \cdot q, \qquad a^2 = c \cdot p`, R`\text{belső szögösszeg: } (n-2) \cdot 180^\circ, \qquad \text{átlók száma: } \frac{n(n-3)}{2}`, R`\text{kerületi szög} = \tfrac{1}{2}\,\text{középponti szög}, \quad \text{Thalész: } \angle ACB = 90^\circ`, R`\text{húrnégyszög: } \alpha + \gamma = 180^\circ, \qquad \text{érintőnégyszög: } a + c = b + d`, R`T = r \cdot s, \qquad R = \frac{c}{2} \ \text{(derékszögű háromszög)}`, R`V_{\text{kúp}} = \frac{\pi r^2 m}{3}, \quad V_{\text{gömb}} = \frac{4}{3}\pi r^3, \quad V_{\text{csonkagúla}} = \frac{m}{3}\left(T + \sqrt{Tt} + t\right)`],
    cheatChecks: [['sqrt(3^2+4^2)', '5'], ['sqrt(9*16)', '12'], ['12*9/2', '54'], ['(12-2)*180/12', '150'], ['(3+4-5)/2', '1'], ['3/3*(90+sqrt(90*40)+40)', '190']],
    terms: ['Pitagorasz-tétel', 'magasságtétel', 'befogótétel', 'súlypont', 'magasságpont', 'körülírt kör', 'beírt kör', 'középvonal', 'húrnégyszög', 'érintőnégyszög', 'Thalész-tétel', 'kerületi szög', 'középponti szög', 'látókör', 'radián', 'csonkakúp']
  };

  def('g1-al-1', 'geometria', 'alakzatok', 1, 'Pitagorasz-tétel', function (r) {
    var t = trip(r), swap = r.int(0, 1) === 1, a = swap ? t[1] : t[0], b = swap ? t[0] : t[1], c = t[2], kind = r.int(0, 1);
    if (kind === 0) {
      return { q: R`Egy derékszögű háromszög befogói $${a}$ cm és $${b}$ cm. Hány cm az átfogó?`, answer: { type: 'num', value: c }, ansTex: K.T(c) + R`\ \text{cm}`, verify: `sqrt(${a}^2+${b}^2)`,
        tip1: R`Használd a Pitagorasz-tételt.`, tip2: R`$c^2 = a^2 + b^2$.`,
        sol: [R`$c^2 = ${a}^2 + ${b}^2 = ${a * a} + ${b * b} = ${c * c}$`, R`$c = ${c}$ cm.`] };
    }
    return { q: R`Egy derékszögű háromszög átfogója $${c}$ cm, egyik befogója $${a}$ cm. Hány cm a másik befogó?`, answer: { type: 'num', value: b }, ansTex: K.T(b) + R`\ \text{cm}`, verify: `sqrt(${c}^2-${a}^2)`,
      tip1: R`Az átfogó a leghosszabb oldal; használd a Pitagorasz-tételt.`, tip2: R`$b^2 = c^2 - a^2$.`,
      sol: [R`$b^2 = c^2 - a^2 = ${c * c} - ${a * a} = ${b * b}$`, R`$b = ${b}$ cm.`, R`Ellenőrzés: $${a}^2 + ${b}^2 = ${c * c} = ${c}^2$.`] };
  });

  def('g1-al-2', 'geometria', 'alakzatok', 1, 'Sokszögek átlói és szögei', function (r) {
    var kind = r.int(0, 2), n, q, ans, ver, tip, sol;
    if (kind === 0) {
      n = r.int(5, 25); ans = n * (n - 3) / 2; ver = `${n}*(${n}-3)/2`;
      q = R`Hány átlója van egy konvex $${n}$ oldalú sokszögnek?`; tip = R`Egy csúcsból $n - 3$ átló indul, és minden átlót kétszer számolunk.`;
      sol = [R`$\dfrac{n(n - 3)}{2} = \dfrac{${n} \cdot ${n - 3}}{2} = ${ans}$`];
    } else if (kind === 1) {
      n = r.int(5, 30); ans = (n - 2) * 180; ver = `(${n}-2)*180`;
      q = R`Mennyi a konvex $${n}$ oldalú sokszög belső szögeinek összege (fokban)?`; tip = R`A sokszög $n - 2$ háromszögre bontható egy csúcsból húzott átlókkal.`;
      sol = [R`$(n - 2) \cdot 180^\circ = ${n - 2} \cdot 180^\circ = ${ans}^\circ$`];
    } else {
      n = r.pick([5, 8, 9, 10, 12, 15, 18, 20, 24, 30, 36]); ans = (n - 2) * 180 / n; ver = `(${n}-2)*180/${n}`;
      q = R`Mekkora egy belső szöge a szabályos $${n}$ oldalú sokszögnek (fokban)?`; tip = R`A belső szögek összege $(n - 2) \cdot 180^\circ$, és mind egyenlő.`;
      sol = [R`$\dfrac{(n - 2) \cdot 180^\circ}{n} = \dfrac{${n - 2} \cdot 180^\circ}{${n}} = ${ans}^\circ$`, R`Ellenőrzés: a külső szög $180^\circ - ${ans}^\circ = ${180 - ans}^\circ$, és $${n} \cdot ${180 - ans}^\circ = 360^\circ$.`];
    }
    return { q: q, answer: { type: 'num', value: ans }, ansTex: K.T(ans) + (kind === 0 ? '' : DEG), verify: ver, tip1: tip, tip2: R`Helyettesíts az $n = ${n}$ értékkel a képletbe.`, sol: sol };
  });

  def('g1-al-3', 'geometria', 'alakzatok', 2, 'Magasság- és befogótétel', function (r) {
    var kind = r.int(0, 1), k = r.int(1, 3);
    if (kind === 0) {
      var uv = r.pick([[3, 4], [4, 3], [5, 12], [12, 5], [6, 8], [8, 6]]), p = uv[0] * uv[0] * k, q = uv[1] * uv[1] * k, m = uv[0] * uv[1] * k;
      return { q: R`Az $ABC$ derékszögű háromszögben az átfogóhoz tartozó magasság talppontja az átfogót $${p}$ cm és $${q}$ cm hosszú szakaszra bontja. Hány cm az átfogóhoz tartozó magasság?`,
        answer: { type: 'num', value: m }, ansTex: K.T(m) + R`\ \text{cm}`, verify: `sqrt(${p}*${q})`,
        tip1: R`Használd a magasságtételt.`, tip2: R`$m^2 = p \cdot q$.`,
        sol: [R`$m^2 = p \cdot q = ${p} \cdot ${q} = ${m * m}$`, R`$m = ${m}$ cm.`] };
    }
    var t = r.pick([[3, 4, 5], [5, 12, 13], [8, 15, 17], [6, 8, 10]]), u = t[0], w = t[2], c = w * w * k, pp = u * u * k, a = u * w * k;
    return { q: R`Az $ABC$ derékszögű háromszög átfogója $AB = ${c}$ cm. Az $A$-nál lévő $AC$ befogó merőleges vetülete az átfogóra $${pp}$ cm hosszú. Hány cm az $AC$ befogó?`,
      answer: { type: 'num', value: a }, ansTex: K.T(a) + R`\ \text{cm}`, verify: `sqrt(${c}*${pp})`,
      tip1: R`Használd a befogótételt.`, tip2: R`$AC^2 = AB \cdot p$, ahol $p$ a befogó vetülete az átfogóra.`,
      sol: [R`$AC^2 = AB \cdot p = ${c} \cdot ${pp} = ${a * a}$`, R`$AC = ${a}$ cm.`] };
  });

  def('g1-al-4', 'geometria', 'alakzatok', 2, 'Kör szögei', function (r) {
    var kind = r.int(0, 3), q, ans, ver, tip, sol, x;
    if (kind === 0) {
      x = 2 * r.int(15, 85); ans = x / 2; ver = `${x}/2`;
      q = R`Egy körben az $AB$ ívhez tartozó középponti szög $${x}^\circ$. Mekkora az ugyanahhoz az ívhez tartozó kerületi szög (fokban)?`;
      tip = R`A kerületi szög a középponti szög fele.`; sol = [R`$\dfrac{${x}^\circ}{2} = ${ans}^\circ$`];
    } else if (kind === 1) {
      x = r.int(15, 85); ans = 2 * x; ver = `2*${x}`;
      q = R`Egy körben az $AB$ ívhez tartozó kerületi szög $${x}^\circ$. Mekkora az ugyanahhoz az ívhez tartozó középponti szög (fokban)?`;
      tip = R`A középponti szög a kerületi szög kétszerese.`; sol = [R`$2 \cdot ${x}^\circ = ${ans}^\circ$`];
    } else if (kind === 2) {
      x = r.int(50, 130); ans = 180 - x; ver = `180-${x}`;
      q = R`Az $ABCD$ húrnégyszögben az $A$ csúcsnál lévő szög $${x}^\circ$. Mekkora a $C$ csúcsnál lévő szög (fokban)?`;
      tip = R`Húrnégyszögben a szemközti szögek összege $180^\circ$.`; sol = [R`$180^\circ - ${x}^\circ = ${ans}^\circ$`];
    } else {
      x = r.int(10, 80); ans = 90 - x; ver = `90-${x}`;
      q = R`Az $AB$ átmérőjű kör egy $C$ pontjára $\angle CAB = ${x}^\circ$. Mekkora az $\angle ABC$ (fokban)?`;
      tip = R`A Thalész-tétel szerint $\angle ACB = 90^\circ$.`; sol = [R`$\angle ACB = 90^\circ$, ezért $\angle ABC = 180^\circ - 90^\circ - ${x}^\circ = ${ans}^\circ$.`];
    }
    return { q: q, answer: { type: 'num', value: ans }, ansTex: K.T(ans) + DEG, verify: ver, tip1: tip, tip2: R`Írd fel a megfelelő tételt számokkal.`, sol: sol };
  });

  def('g1-al-5', 'geometria', 'alakzatok', 2, 'Érintőszakasz, érintőnégyszög', function (r) {
    var kind = r.int(0, 2);
    if (kind === 0) {
      var t = trip(r), rr = t[0], tt = t[1], d = t[2];
      return { q: R`Egy kör sugara $${rr}$ cm. A kör $O$ középpontjától $${d}$ cm távolságra lévő $P$ pontból érintőt húzunk a körhöz. Hány cm az érintőszakasz hossza a $P$ ponttól az érintési pontig?`,
        answer: { type: 'num', value: tt }, ansTex: K.T(tt) + R`\ \text{cm}`, verify: `sqrt(${d}^2-${rr}^2)`,
        tip1: R`Az érintő merőleges az érintési pontba húzott sugárra: derékszögű háromszög keletkezik.`, tip2: R`Az átfogó $OP = ${d}$, az egyik befogó $r = ${rr}$.`,
        sol: [R`Az $O$, az érintési pont és $P$ derékszögű háromszöget alkot, az átfogó $OP$.`, R`$t^2 = ${d}^2 - ${rr}^2 = ${tt * tt}$, így $t = ${tt}$ cm.`] };
    }
    var a = r.int(4, 14), b = r.int(4, 14), c = r.int(4, 14), dd = a + c - b;
    if (dd < 2) { b = 4; dd = a + c - 4; }
    if (kind === 1) {
      return { q: R`Az $ABCD$ érintőnégyszög oldalai: $AB = ${a}$ cm, $BC = ${b}$ cm, $CD = ${c}$ cm. Hány cm a $DA$ oldal?`,
        answer: { type: 'num', value: dd }, ansTex: K.T(dd) + R`\ \text{cm}`, verify: `${a}+${c}-${b}`,
        tip1: R`Érintőnégyszögben a szemközti oldalak összege egyenlő.`, tip2: R`$AB + CD = BC + DA$.`,
        sol: [R`$AB + CD = BC + DA$, azaz $${a} + ${c} = ${b} + DA$.`, R`$DA = ${a + c} - ${b} = ${dd}$ cm.`] };
    }
    var x = r.int(2, 9), y = r.int(2, 9), z = r.int(2, 9), w = r.int(2, 9);
    return { q: R`Az $ABCD$ négyszögbe kör írható. Az érintési pontok az oldalakat úgy osztják, hogy az $A$ csúcsból $${x}$ cm, a $B$ csúcsból $${y}$ cm, a $C$ csúcsból $${z}$ cm, a $D$ csúcsból $${w}$ cm hosszú érintőszakaszok indulnak. Hány cm a négyszög kerülete?`,
      answer: { type: 'num', value: 2 * (x + y + z + w) }, ansTex: K.T(2 * (x + y + z + w)) + R`\ \text{cm}`, verify: `(${x}+${y})+(${y}+${z})+(${z}+${w})+(${w}+${x})`,
      tip1: R`Minden oldal két érintőszakasz összege.`, tip2: R`$AB = x + y$, $BC = y + z$, $CD = z + w$, $DA = w + x$.`,
      sol: [R`$AB = ${x + y}$, $BC = ${y + z}$, $CD = ${z + w}$, $DA = ${w + x}$ cm.`, R`A kerület: $${x + y} + ${y + z} + ${z + w} + ${w + x} = ${2 * (x + y + z + w)}$ cm. (Valóban $AB + CD = BC + DA$.)`] };
  });

  def('g1-al-6', 'geometria', 'alakzatok', 3, 'Beírt kör sugara', function (r) {
    var L = [[13, 14, 15, 84], [5, 5, 6, 12], [10, 13, 13, 60], [9, 10, 17, 36], [6, 25, 29, 60], [7, 15, 20, 42], [4, 13, 15, 24]], t = r.pick(L), a = t[0], b = t[1], c = t[2], T = t[3], s = (a + b + c) / 2, rr = T / s, kind = r.int(0, 1);
    if (kind === 0) {
      return { q: R`Egy háromszög oldalai $${a}$ cm, $${b}$ cm és $${c}$ cm, területe $${T}$ cm². Hány cm a beírt kör sugara? (két tizedesre kerekítve)`,
        answer: { type: 'num', value: rr, tol: 0.0051 }, ansTex: R`r \approx ${K.T(rr, 2)}\ \text{cm}`, verify: `${T}/((${a}+${b}+${c})/2)`,
        tip1: R`Bontsd a háromszöget három háromszögre a beírt kör középpontjából.`, tip2: R`A három kis háromszög magassága $r$, alapjai az oldalak: $T = \dfrac{r(a + b + c)}{2}$.`,
        sol: [R`$T = r \cdot s$, ahol $s = \dfrac{${a} + ${b} + ${c}}{2} = ${s}$.`, R`$r = \dfrac{T}{s} = \dfrac{${T}}{${s}} \approx ${K.T(rr, 2)}$ cm.`] };
    }
    var h = 2 * T / c;
    return { q: R`Egy háromszög oldalai $${a}$ cm, $${b}$ cm és $${c}$ cm, területe $${T}$ cm². Hány cm a $${c}$ cm hosszú oldalhoz tartozó magasság? (két tizedesre kerekítve)`,
      answer: { type: 'num', value: h, tol: 0.0051 }, ansTex: R`m \approx ${K.T(h, 2)}\ \text{cm}`, verify: `2*${T}/${c}`,
      tip1: R`Írd fel a területet az oldal és a hozzá tartozó magasság szorzatának feleként.`, tip2: R`$T = \dfrac{c \cdot m}{2}$, így $m = \dfrac{2T}{c}$.`,
      sol: [R`$m = \dfrac{2T}{c} = \dfrac{2 \cdot ${T}}{${c}} \approx ${K.T(h, 2)}$ cm.`] };
  });

  def('g1-al-7', 'geometria', 'alakzatok', 3, 'Csonkakúp térfogata', function (r) {
    var rr = 3 * r.int(1, 3), m = 4 * r.int(1, 3), f = r.pick([[1, 2], [1, 3], [2, 3], [1, 4], [3, 4]]), p = f[0], q = f[1];
    var lam = p / q, rs = rr * lam, ms = m * lam, V = (rr * rr * m - rs * rs * ms) / 3;
    return {
      q: R`Egy forgáskúp alapkörének sugara $${rr}$ cm, magassága $${m}$ cm. A kúpot az alappal párhuzamos síkkal a csúcstól mért magasság $\dfrac{${p}}{${q}}$ részénél elmetsszük. Mekkora a csonkakúp térfogata? A választ cm³-ben, a $\pi$ együtthatójaként add meg, két tizedesre kerekítve.`,
      answer: { type: 'num', value: V, tol: 0.0051 }, ansTex: R`V \approx ${K.T(V, 2)}\pi\ \text{cm}^3`, verify: `${rr}^2*${m}/3*(1-(${p}/${q})^3)`,
      tip1: R`A levágott kis kúp hasonló az egész kúphoz.`,
      tip2: R`A hasonlóság aránya $\dfrac{${p}}{${q}}$, a térfogatok aránya ennek köbe. A csonkakúp térfogata az egész és a kis kúp különbsége.`,
      sol: [R`Az egész kúp térfogata $V = \dfrac{r^2 \pi m}{3} = \dfrac{${rr}^2 \cdot ${m}}{3}\pi = ${K.T(rr * rr * m / 3, 2)}\pi$.`, R`A kis kúp térfogata az egész kúp térfogatának és a $\left(\dfrac{${p}}{${q}}\right)^3$ aránynak a szorzata, vagyis $${K.T(rr * rr * m / 3 * lam * lam * lam, 2)}\pi$.`, R`A csonkakúp: $V = ${K.T(rr * rr * m / 3, 2)}\pi - ${K.T(rr * rr * m / 3 * lam * lam * lam, 2)}\pi \approx ${K.T(V, 2)}\pi$ cm³.`]
    };
  });

  def('g1-al-8', 'geometria', 'alakzatok', 2, 'Húrnégyszög szögei', function (r) {
    var a, b;
    do { a = r.int(60, 120); b = r.int(60, 120); } while (a === b);
    var f = function (v) { return '$' + v.join('^\\circ;\\ ') + '^\\circ$'; };
    var good = f([180 - a, 180 - b]), ws = [f([180 - b, 180 - a]), f([190 - a, 175 - b]), f([a + 11, b + 5])];
    return {
      q: R`Az $ABCD$ konvex négyszög $A$ csúcsánál $${a}^\circ$, a $B$ csúcsánál $${b}^\circ$ a szög. Melyik lehetőség adja a $C$ és $D$ csúcsnál lévő szöget (ebben a sorrendben), ha az $ABCD$ húrnégyszög?`,
      answer: K.choice(r, good, ws), ansTex: R`\text{a szemközti szögek összege } 180^\circ`,
      tip1: R`Húrnégyszögben a szemközti szögek összege $180^\circ$.`, tip2: R`A $C$ az $A$-val, a $D$ a $B$-vel van szemben.`,
      sol: [R`Húrnégyszögben $\angle C = 180^\circ - \angle A = ${180 - a}^\circ$ és $\angle D = 180^\circ - \angle B = ${180 - b}^\circ$.`, R`A helyes lehetőség: ${good}.`]
    };
  });

  /* ===================== 4.4 Vektorok síkban és térben ===================== */
  MO.content['geometria/vektorok'] = {
    intro: R`A vektor irányított szakasz: hosszal és iránnyal jellemezzük. A vektorokkal összeadni, kivonni és skalárral szorozni lehet, koordinátáikkal pedig számolni is: ez a geometriai feladatok egyik leghatékonyabb eszköze (felezőpont, súlypont, párhuzamosság, merőlegesség, szög). Az érettségi követelmény 4.4 pontja szerint középszinten a vektor fogalmát, a műveleteket és a koordinátás alakot kell ismerni; emelt szinten a műveleti azonosságokat, a skaláris szorzatot (a koordinátás képlet bizonyításával), a hajlásszöget, a $90^\circ$-os elforgatást és az egyértelmű vektorfelbontás tételét is.`,
    theory: [
      { h: 'A vektor fogalma',
        b: R`A **vektor** irányított szakasz: egy kezdőpontja és egy végpontja van. Az $\overrightarrow{AB}$ vektor kezdőpontja $A$, végpontja $B$. Jele még: $\vec{a}$ vagy $\mathbf{a}$.\n\n- **Abszolútérték (hossz):** $|\vec{a}|$ az $AB$ szakasz hossza.\n- **Egyenlő vektorok:** hosszuk és irányuk azonos (a kezdőpontjuk nem számít).\n- **Nullvektor:** hossza $0$, iránya tetszőleges; jele $\vec{0}$.\n- **Ellentett vektor:** $-\vec{a}$ ugyanolyan hosszú, de ellentétes irányú; $\overrightarrow{BA} = -\overrightarrow{AB}$.\n- **Egységvektor:** hossza $1$. Az $\vec{a} \neq \vec{0}$ irányú egységvektor: $\dfrac{\vec{a}}{|\vec{a}|}$.\n- **Párhuzamos (kollineáris) vektorok:** egy egyenessel párhuzamosak, azaz egyirányúak vagy ellentétes irányúak; ekkor az egyik a másiknak skalárszorosa.\n\nAz origóból a $P$ pontba mutató vektor a $P$ **helyvektora**.` },
      { h: 'Műveletek vektorokkal és műveleti azonosságok',
        b: R`**Összeadás:** háromszögszabállyal ($\overrightarrow{AB} + \overrightarrow{BC} = \overrightarrow{AC}$) vagy paralelogramma-szabállyal (közös kezdőpontból). **Kivonás:** $\vec{a} - \vec{b} = \vec{a} + (-\vec{b})$; ha közös kezdőpontból veszed fel őket, a különbség a $\vec{b}$ végpontjától az $\vec{a}$ végpontjába mutat. **Skalárszoros:** $\lambda\vec{a}$ hossza $|\lambda| \cdot |\vec{a}|$; iránya $\lambda > 0$ esetén azonos, $\lambda < 0$ esetén ellentétes (a $0 \cdot \vec{a} = \vec{0}$).\n\n**Műveleti azonosságok** (emelt): $\vec{a} + \vec{b} = \vec{b} + \vec{a}$; $(\vec{a} + \vec{b}) + \vec{c} = \vec{a} + (\vec{b} + \vec{c})$; $\vec{a} + \vec{0} = \vec{a}$; $\vec{a} + (-\vec{a}) = \vec{0}$; $\lambda(\vec{a} + \vec{b}) = \lambda\vec{a} + \lambda\vec{b}$; $(\lambda + \mu)\vec{a} = \lambda\vec{a} + \mu\vec{a}$; $\lambda(\mu\vec{a}) = (\lambda\mu)\vec{a}$; $1 \cdot \vec{a} = \vec{a}$.\n\nHáromszög-egyenlőtlenség: $|\vec{a} + \vec{b}| \leq |\vec{a}| + |\vec{b}|$; egyenlőség csak akkor, ha a két vektor egyirányú.` },
      { h: 'Koordináták síkban és térben',
        b: R`Síkban az $\vec{i}(1; 0)$ és $\vec{j}(0; 1)$ **bázisvektorok** segítségével minden vektor $\vec{a} = a_1\vec{i} + a_2\vec{j}$ alakban írható, **koordinátái** $(a_1; a_2)$. Térben a harmadik bázisvektor $\vec{k}(0; 0; 1)$, a koordináták $(a_1; a_2; a_3)$.\n\n- **Műveletek:** $\vec{a} + \vec{b} = (a_1 + b_1; a_2 + b_2)$, $\vec{a} - \vec{b} = (a_1 - b_1; a_2 - b_2)$, $\lambda\vec{a} = (\lambda a_1; \lambda a_2)$ (térben ugyanígy a harmadik koordinátával).\n- **Abszolútérték:** $|\vec{a}| = \sqrt{a_1^2 + a_2^2}$ (térben $\sqrt{a_1^2 + a_2^2 + a_3^2}$).\n- Az $A(x_A; y_A)$ és $B(x_B; y_B)$ pontok esetén $\overrightarrow{AB} = (x_B - x_A; y_B - y_A)$, $AB = |\overrightarrow{AB}|$.\n- **Felezőpont:** $F\left(\dfrac{x_A + x_B}{2}; \dfrac{y_A + y_B}{2}\right)$; **háromszög súlypontja:** a három csúcs koordinátáinak átlaga. Ha $P$ az $AB$ szakaszon úgy van, hogy $AP : PB = m : n$, akkor $\vec{p} = \dfrac{n\vec{a} + m\vec{b}}{m + n}$ (a helyvektorokkal).` },
      { h: 'A skaláris szorzat', level: 'emelt',
        b: R`Két vektor **skaláris szorzata** (a skalárszorzat) egy szám: $\vec{a} \cdot \vec{b} = |\vec{a}| \cdot |\vec{b}| \cdot \cos\varphi$, ahol $\varphi$ a két vektor hajlásszöge ($0^\circ \leq \varphi \leq 180^\circ$); ha valamelyik vektor nullvektor, a szorzat $0$.\n\n**Tulajdonságai:**\n- $\vec{a} \cdot \vec{b} = \vec{b} \cdot \vec{a}$ (felcserélhető);\n- $(\lambda\vec{a}) \cdot \vec{b} = \lambda(\vec{a} \cdot \vec{b})$;\n- $\vec{a} \cdot (\vec{b} + \vec{c}) = \vec{a} \cdot \vec{b} + \vec{a} \cdot \vec{c}$ (disztributív);\n- $\vec{a} \cdot \vec{a} = |\vec{a}|^2$;\n- két nem nulla vektor **merőleges** pontosan akkor, ha skaláris szorzatuk $0$;\n- $\vec{a} \cdot \vec{b} > 0$ esetén a hajlásszög hegyesszög, $< 0$ esetén tompaszög.\n\nA skalárszorzat az $\vec{a}$ és a $\vec{b}$-re vetített vektor hosszának szorzata (előjelesen): $\vec{a} \cdot \vec{b} = |\vec{a}| \cdot (|\vec{b}| \cos\varphi)$.` },
      { h: 'Skalárszorzat koordinátákkal és hajlásszög', level: 'emelt',
        b: R`**Tétel:** ha $\vec{a}(a_1; a_2)$ és $\vec{b}(b_1; b_2)$, akkor $\vec{a} \cdot \vec{b} = a_1 b_1 + a_2 b_2$ (térben $a_1 b_1 + a_2 b_2 + a_3 b_3$).\n\n**Hajlásszög:** a skalárszorzat két alakjának egyenlőségéből $\cos\varphi = \dfrac{\vec{a} \cdot \vec{b}}{|\vec{a}| \cdot |\vec{b}|} = \dfrac{a_1 b_1 + a_2 b_2}{\sqrt{a_1^2 + a_2^2} \cdot \sqrt{b_1^2 + b_2^2}}$. Ebből $\varphi$ a $[0^\circ; 180^\circ]$ intervallumban egyértelmű.\n\n**Merőlegesség:** $\vec{a} \perp \vec{b} \Leftrightarrow a_1 b_1 + a_2 b_2 = 0$. **Párhuzamosság:** $\vec{a} \parallel \vec{b} \Leftrightarrow a_1 b_2 - a_2 b_1 = 0$.`,
        proof: R`Írjuk a vektorokat bázisvektorokkal: $\vec{a} = a_1\vec{i} + a_2\vec{j}$, $\vec{b} = b_1\vec{i} + b_2\vec{j}$. A disztributivitás és a skalárral szorzás tulajdonságai szerint $\vec{a} \cdot \vec{b} = a_1 b_1 (\vec{i} \cdot \vec{i}) + a_1 b_2 (\vec{i} \cdot \vec{j}) + a_2 b_1 (\vec{j} \cdot \vec{i}) + a_2 b_2 (\vec{j} \cdot \vec{j})$. A bázisvektorok egységnyiek és merőlegesek egymásra: $\vec{i} \cdot \vec{i} = \vec{j} \cdot \vec{j} = 1$, $\vec{i} \cdot \vec{j} = \vec{j} \cdot \vec{i} = 0$. Így $\vec{a} \cdot \vec{b} = a_1 b_1 + a_2 b_2$. Térben ugyanígy, három bázisvektorral.` },
      { h: 'A vektor $90^\\circ$-os elforgatottja', level: 'emelt',
        b: R`Az $\vec{a}(a_1; a_2)$ vektor **pozitív irányú** ($+90^\circ$-os, az óramutató járásával ellentétes) elforgatottja $\vec{a}^{\perp}(-a_2; a_1)$; a **negatív irányú** elforgatottja $(a_2; -a_1)$. Hossza ugyanaz, és $\vec{a} \cdot \vec{a}^{\perp} = -a_1 a_2 + a_2 a_1 = 0$.\n\n**Alkalmazások:**\n- ha $\overrightarrow{AB}$ adott, akkor az $A$-nál derékszögű, egyenlő szárú háromszög harmadik csúcsa $C = A + \overrightarrow{AB}^{\perp}$ (vagy a negatív forgatott);\n- az $(a_1; a_2)$ vektorra merőleges egyenes irányvektora $(-a_2; a_1)$; egy egyenes $n(A; B)$ normálvektora az $Ax + By = C$ egyenlet együtthatói;\n- **háromszög területe:** az $\overrightarrow{AB} = \vec{u}$, $\overrightarrow{AC} = \vec{w}$ vektorokkal $T = \dfrac{1}{2}\left|u_1 w_2 - u_2 w_1\right| = \dfrac{1}{2}\left|\vec{u}^{\perp} \cdot \vec{w}\right|$.` },
      { h: 'Vektorfelbontás', level: 'emelt',
        b: R`**Egyértelmű vektorfelbontás tétele:** ha $\vec{a}$ és $\vec{b}$ a síkban nem párhuzamos (nem kollineáris) vektorok, akkor a sík minden $\vec{v}$ vektora **egyértelműen** felírható $\vec{v} = \lambda\vec{a} + \mu\vec{b}$ alakban ($\lambda, \mu$ valós számok). Térben három nem egy síkba eső vektorral lehet minden vektort egyértelműen felbontani.\n\nKoordinátákkal ez egy kétismeretlenes lineáris egyenletrendszer: $v_1 = \lambda a_1 + \mu b_1$, $v_2 = \lambda a_2 + \mu b_2$; a megoldása egyértelmű, ha $a_1 b_2 - a_2 b_1 \neq 0$.\n\n**Alkalmazás:** pontok osztóarányának és kollinearitásának kifejezése. Például ha a $BC$ oldal $D$ pontja $BD : DC = 1 : 2$ arányú, akkor $\overrightarrow{AD} = \overrightarrow{AB} + \dfrac{1}{3}\overrightarrow{BC} = \dfrac{2}{3}\overrightarrow{AB} + \dfrac{1}{3}\overrightarrow{AC}$.`,
        proof: R`*Létezés.* Közös $O$ kezdőpontból vegyük fel $\vec{a} = \overrightarrow{OA}$, $\vec{b} = \overrightarrow{OB}$, $\vec{v} = \overrightarrow{OV}$. Húzzunk $V$-n át párhuzamost $OB$-vel, ez $OA$ egyenesét az $A'$ pontban metszi, és $V$-n át párhuzamost $OA$-val, ez $OB$ egyenesét $B'$-ben metszi (nem párhuzamosak). Az $OA'VB'$ paralelogrammára $\vec{v} = \overrightarrow{OA'} + \overrightarrow{OB'}$; mivel $\overrightarrow{OA'}$ párhuzamos $\vec{a}$-val, $\overrightarrow{OA'} = \lambda\vec{a}$, és hasonlóan $\overrightarrow{OB'} = \mu\vec{b}$.\n\n*Egyértelműség.* Ha $\lambda\vec{a} + \mu\vec{b} = \lambda'\vec{a} + \mu'\vec{b}$, akkor $(\lambda - \lambda')\vec{a} = (\mu' - \mu)\vec{b}$. Ha $\lambda \neq \lambda'$, akkor $\vec{a}$ a $\vec{b}$ skalárszorosa, azaz párhuzamosak, ami ellentmond a feltételnek. Tehát $\lambda = \lambda'$, majd $\mu = \mu'$.` }
    ],
    examples: [
      { t: 'Műveletek és hajlásszög koordinátákkal',
        p: R`Adott az $\vec{a}(3; -2)$ és a $\vec{b}(-1; 4)$ vektor. Számítsd ki a $2\vec{a} - 3\vec{b}$ vektort, az $|\vec{a}|$ és $|\vec{b}|$ hosszát, a skaláris szorzatot, valamint a két vektor hajlásszögét (fokban, két tizedesre kerekítve)!`,
        steps: [R`$2\vec{a} = (6; -4)$ és $3\vec{b} = (-3; 12)$, ezért $2\vec{a} - 3\vec{b} = (6 - (-3); -4 - 12) = (9; -16)$.`, R`$|\vec{a}| = \sqrt{3^2 + (-2)^2} = \sqrt{13}$, $|\vec{b}| = \sqrt{(-1)^2 + 4^2} = \sqrt{17}$.`, R`$\vec{a} \cdot \vec{b} = 3 \cdot (-1) + (-2) \cdot 4 = -3 - 8 = -11$.`, R`$\cos\varphi = \dfrac{-11}{\sqrt{13} \cdot \sqrt{17}} = \dfrac{-11}{\sqrt{221}} \approx -0{,}7400$. A koszinusz negatív, tehát $\varphi$ tompaszög: $\varphi \approx 137{,}73^\circ$.`, R`Ellenőrzés: $\cos 137{,}73^\circ \approx -0{,}740$, és a skalárszorzat előjele (negatív) is tompaszöget jelez.`],
        ans: R`$2\vec{a} - 3\vec{b} = (9; -16)$, $|\vec{a}| = \sqrt{13}$, $|\vec{b}| = \sqrt{17}$, $\vec{a} \cdot \vec{b} = -11$, $\varphi \approx 137{,}73^\circ$.`,
        checks: [['2*3-3*(-1)', '9'], ['2*(-2)-3*4', '-16'], ['3*(-1)+(-2)*4', '-11'], ['sqrt(13)*sqrt(17)', 'sqrt(221)'], ['13*17', '221'], ['(-11)^2', '121']] },
      { t: 'Paralelogramma negyedik csúcsa',
        p: R`Az $A(1; 2)$, $B(7; 4)$, $C(9; 9)$ pontok egy $ABCD$ paralelogramma egymás utáni csúcsai. Határozd meg a $D$ csúcs koordinátáit, az átlók metszéspontját és a paralelogramma területét!`,
        steps: [R`Paralelogrammában $\overrightarrow{AB} = \overrightarrow{DC}$. $\overrightarrow{AB} = (6; 2)$, ezért $D = C - \overrightarrow{AB} = (9 - 6; 9 - 2) = (3; 7)$.`, R`Az átlók felezik egymást: az $AC$ felezőpontja $\left(\dfrac{1 + 9}{2}; \dfrac{2 + 9}{2}\right) = (5; 5{,}5)$. Ellenőrzés a $BD$ felezőpontjával: $\left(\dfrac{7 + 3}{2}; \dfrac{4 + 7}{2}\right) = (5; 5{,}5)$, egyezik.`, R`Terület: $\overrightarrow{AB} = (6; 2)$, $\overrightarrow{AD} = (2; 5)$; $T = |6 \cdot 5 - 2 \cdot 2| = 26$. (Ellenőrzés elforgatással: $\overrightarrow{AB}^{\perp} = (-2; 6)$, $\overrightarrow{AB}^{\perp} \cdot \overrightarrow{AD} = -4 + 30 = 26$.)`, R`Ellenőrzés: $\overrightarrow{BC} = (2; 5) = \overrightarrow{AD}$, tehát valóban paralelogramma.`],
        ans: R`$D(3; 7)$, az átlók metszéspontja $(5; 5{,}5)$, a terület $26$ területegység.`,
        checks: [['9-6', '3'], ['9-2', '7'], ['(1+9)/2', '(7+3)/2'], ['(2+9)/2', '(4+7)/2'], ['6*5-2*2', '26'], ['-2*2+6*5', '26']] },
      { t: 'Háromszög magasságpontja és súlypontja vektorokkal',
        p: R`Az $ABC$ háromszög csúcsai: $A(-2; 1)$, $B(6; 1)$, $C(2; 6)$. a) Határozd meg a háromszög $M$ magasságpontját! b) Mekkora a $C$ csúcsnál lévő szög koszinusza? c) Mi a súlypont koordinátája, és mekkora a háromszög területe?`,
        steps: [R`a) $M(x; y)$ esetén $\overrightarrow{AM} \perp \overrightarrow{BC}$ és $\overrightarrow{BM} \perp \overrightarrow{AC}$. $\overrightarrow{BC} = (-4; 5)$, $\overrightarrow{AC} = (4; 5)$. Az első feltétel: $(x + 2) \cdot (-4) + (y - 1) \cdot 5 = 0$, azaz $-4x + 5y = 13$. A második: $(x - 6) \cdot 4 + (y - 1) \cdot 5 = 0$, azaz $4x + 5y = 29$.`, R`A két egyenletet összeadva $10y = 42$, $y = 4{,}2$; majd $4x = 29 - 21 = 8$, $x = 2$. Tehát $M(2; 4{,}2)$.`, R`Ellenőrzés a harmadik magassággal: $\overrightarrow{CM} = (0; -1{,}8)$, $\overrightarrow{AB} = (8; 0)$, skalárszorzatuk $0$, tehát $CM \perp AB$ is teljesül.`, R`b) $\overrightarrow{CA} = (-4; -5)$, $\overrightarrow{CB} = (4; -5)$. $\overrightarrow{CA} \cdot \overrightarrow{CB} = -16 + 25 = 9$, $|\overrightarrow{CA}| = |\overrightarrow{CB}| = \sqrt{41}$, így $\cos\gamma = \dfrac{9}{41} \approx 0{,}2195$ ($\gamma \approx 77{,}32^\circ$).`, R`c) Súlypont: $S\left(\dfrac{-2 + 6 + 2}{3}; \dfrac{1 + 1 + 6}{3}\right) = \left(2; \dfrac{8}{3}\right)$. Terület: $\overrightarrow{AB} = (8; 0)$, $\overrightarrow{AC} = (4; 5)$, $T = \dfrac{1}{2}|8 \cdot 5 - 0 \cdot 4| = 20$.`],
        ans: R`a) $M(2; 4{,}2)$; b) $\cos\gamma = \dfrac{9}{41} \approx 0{,}22$; c) $S\left(2; \dfrac{8}{3}\right)$, $T = 20$ területegység.`,
        checks: [['(2+2)*(-4)+(4,2-1)*5', '0'], ['(2-6)*4+(4,2-1)*5', '0'], ['0*8+(-1,8)*0', '0'], ['-4*4+(-5)*(-5)', '9'], ['(-2+6+2)/3', '2'], ['(1+1+6)/3', '8/3'], ['8*5/2', '20']] },
      { t: 'Vektorfelbontás és osztópont',
        p: R`a) Bontsd fel a $\vec{c}(7; 11)$ vektort az $\vec{a}(2; 1)$ és $\vec{b}(1; 3)$ vektorok irányában! b) Az $ABC$ háromszög $BC$ oldalának $D$ pontjára $BD : DC = 1 : 2$. Fejezd ki az $\overrightarrow{AD}$ vektort az $\overrightarrow{AB} = \vec{u}$ és $\overrightarrow{AC} = \vec{w}$ vektorokkal, és ellenőrizd az $A(0; 0)$, $B(6; 0)$, $C(0; 9)$ pontokkal!`,
        steps: [R`a) A felbontás létezik és egyértelmű, mert $a_1 b_2 - a_2 b_1 = 2 \cdot 3 - 1 \cdot 1 = 5 \neq 0$. A $\vec{c} = \lambda\vec{a} + \mu\vec{b}$ egyenletből: $2\lambda + \mu = 7$ és $\lambda + 3\mu = 11$.`, R`Az első egyenletből $\mu = 7 - 2\lambda$; a másodikba helyettesítve $\lambda + 21 - 6\lambda = 11$, azaz $-5\lambda = -10$, $\lambda = 2$ és $\mu = 3$. Ellenőrzés: $2 \cdot (2; 1) + 3 \cdot (1; 3) = (4 + 3; 2 + 9) = (7; 11)$.`, R`b) $\overrightarrow{AD} = \overrightarrow{AB} + \overrightarrow{BD} = \vec{u} + \dfrac{1}{3}\overrightarrow{BC}$, és $\overrightarrow{BC} = \vec{w} - \vec{u}$. Így $\overrightarrow{AD} = \vec{u} + \dfrac{1}{3}(\vec{w} - \vec{u}) = \dfrac{2}{3}\vec{u} + \dfrac{1}{3}\vec{w}$.`, R`Koordinátás ellenőrzés: $D = B + \dfrac{1}{3}(C - B) = (6 - 2; 0 + 3) = (4; 3)$, és $\dfrac{2}{3} \cdot (6; 0) + \dfrac{1}{3} \cdot (0; 9) = (4; 3)$. Egyezik.`],
        ans: R`a) $\vec{c} = 2\vec{a} + 3\vec{b}$; b) $\overrightarrow{AD} = \dfrac{2}{3}\vec{u} + \dfrac{1}{3}\vec{w}$.`,
        checks: [['2*3-1*1', '5'], ['2*2+3*1', '7'], ['2*1+3*3', '11'], ['2/3*6', '6-6/3'], ['1/3*9', '3']] },
      { t: 'Egyenlő szárú derékszögű háromszög harmadik csúcsa',
        p: R`Az $A(1; 2)$ és $B(4; 6)$ pontok az $ABC$ háromszög csúcsai, a háromszög $A$-nál derékszögű és egyenlő szárú. Határozd meg a $C$ csúcs lehetséges koordinátáit és a háromszög területét!`,
        steps: [R`$\overrightarrow{AB} = (3; 4)$, hossza $\sqrt{9 + 16} = 5$. Az $AC$ befogó merőleges $AB$-re és ugyanolyan hosszú, ezért $\overrightarrow{AC}$ az $\overrightarrow{AB}$ $+90^\circ$-os vagy $-90^\circ$-os elforgatottja.`, R`$\overrightarrow{AB}^{\perp} = (-4; 3)$, így $C_1 = A + (-4; 3) = (-3; 5)$. A másik irány: $(4; -3)$, így $C_2 = (1 + 4; 2 - 3) = (5; -1)$.`, R`Ellenőrzés: $\overrightarrow{AB} \cdot (-4; 3) = -12 + 12 = 0$ (merőleges), és $|(-4; 3)| = 5$.`, R`Terület: $T = \dfrac{5 \cdot 5}{2} = 12{,}5$ területegység.`],
        ans: R`$C_1(-3; 5)$ vagy $C_2(5; -1)$; a terület $12{,}5$ területegység.`,
        checks: [['sqrt(3^2+4^2)', '5'], ['1-4', '-3'], ['2+3', '5'], ['3*(-4)+4*3', '0'], ['5*5/2', '12,5']] }
    ],
    sims: ['vektorok'],
    mistakes: [
      R`A skalárszorzatot vektornak hiszik: a skalárszorzat **szám**. A skalárral való szorzás ($\lambda\vec{a}$) ezzel szemben vektort ad.`,
      R`A hajlásszög kiszámításakor elfelejtik a nevezőt: $\cos\varphi = \dfrac{\vec{a} \cdot \vec{b}}{|\vec{a}| \cdot |\vec{b}|}$, a hosszak szorzatával kell osztani.`,
      R`Az $\overrightarrow{AB}$ koordinátáit fordítva számolják: $\overrightarrow{AB} = B - A$ (végpont mínusz kezdőpont), $\overrightarrow{BA} = A - B$.`,
      R`A $90^\circ$-os elforgatottnál összekeverik az előjeleket: a pozitív irányú elforgatott $(a_1; a_2) \to (-a_2; a_1)$, a negatív $(a_2; -a_1)$. Mindig ellenőrizd: a skalárszorzat az eredetivel $0$ legyen.`,
      R`A vektorfelbontásnál párhuzamos (kollineáris) vektorokkal próbálnak felbontani; ekkor a felbontás nem létezik minden vektorra, és nem is egyértelmű. Először ellenőrizd: $a_1 b_2 - a_2 b_1 \neq 0$.`,
      R`A vektor abszolútértékénél elfelejtik a gyökvonást, vagy az $|\vec{a} + \vec{b}| = |\vec{a}| + |\vec{b}|$ összefüggést használják; ez általában nem igaz (csak egyirányú vektoroknál).`
    ],
    exam: R`A követelmény szerint közép- és emelt szinten is ismerni kell a vektor fogalmát, abszolútértékét, a nullvektort, az ellentett vektort, az összeget, különbséget, skalárszorost, a vektor koordinátáit és a műveletek koordinátás alakját, síkban és térben. Emelt szinten ezen felül a műveleti azonosságokat, a skaláris szorzat definícióját és tulajdonságait, a koordinátákkal adott vektorok hajlásszögének meghatározását, az egyértelmű vektorfelbontás tételét, a vektor $90^\circ$-os elforgatottjának koordinátáit és a skalárszorzat koordinátákból való kiszámítását (a tétel bizonyításával) kéri. Koordinátageometriai és síkgeometriai feladatokban is használni kell.`,
    cheat: [R`\overrightarrow{AB} = (x_B - x_A;\ y_B - y_A), \qquad |\vec{a}| = \sqrt{a_1^2 + a_2^2}`, R`\vec{a} \cdot \vec{b} = |\vec{a}||\vec{b}|\cos\varphi = a_1 b_1 + a_2 b_2`, R`\cos\varphi = \frac{a_1 b_1 + a_2 b_2}{\sqrt{a_1^2 + a_2^2}\,\sqrt{b_1^2 + b_2^2}}`, R`\vec{a} \perp \vec{b} \Leftrightarrow \vec{a} \cdot \vec{b} = 0, \qquad (a_1; a_2)^{\perp} = (-a_2; a_1)`, R`T_{ABC} = \tfrac{1}{2}\left|u_1 w_2 - u_2 w_1\right|, \qquad S\left(\tfrac{x_A + x_B + x_C}{3}; \tfrac{y_A + y_B + y_C}{3}\right)`],
    cheatChecks: [['3*(-1)+(-2)*4', '-11'], ['8*5/2', '1/2*(8*5-0*4)'], ['(-2+6+2)/3', '2']],
    terms: ['vektor', 'nullvektor', 'ellentett vektor', 'skalárszoros', 'helyvektor', 'bázisvektor', 'skaláris szorzat', 'hajlásszög', 'merőleges vektorok', 'elforgatott vektor', 'vektorfelbontás', 'kollineáris vektorok']
  };

  def('g1-v-1', 'geometria', 'vektorok', 1, 'Vektorműveletek koordinátákkal', function (r) {
    var a1 = r.nz(-8, 8), a2 = r.nz(-8, 8), b1 = r.nz(-8, 8), b2 = r.nz(-8, 8), m = r.nz(-3, 4), n = r.nz(-3, 4), asky = r.int(0, 1) === 1;
    var ans = asky ? m * a2 + n * b2 : m * a1 + n * b1, c = asky ? [a2, b2] : [a1, b1];
    var e = function (m, n) { return (m < 0 ? '-' : '') + (Math.abs(m) === 1 ? '' : Math.abs(m)) + R`\vec{a}` + (n < 0 ? ' - ' : ' + ') + (Math.abs(n) === 1 ? '' : Math.abs(n)) + R`\vec{b}`; };
    return {
      q: R`Adott az $\vec{a}(${K.T(a1)}; ${K.T(a2)})$ és a $\vec{b}(${K.T(b1)}; ${K.T(b2)})$ vektor. Mennyi ${m === 1 ? 'az' : 'a'} $${e(m, n)}$ vektor ${asky ? 'második' : 'első'} koordinátája?`,
      answer: { type: 'num', value: ans }, ansTex: K.T(ans), verify: `(${m})*(${c[0]})+(${n})*(${c[1]})`,
      tip1: R`A műveleteket koordinátánként végezd.`, tip2: R`A keresett koordináta: $${K.T(m)} \cdot ${K.par(c[0])} + ${K.par(n)} \cdot ${K.par(c[1])}$.`,
      sol: [R`$${e(m, n)} = (${K.T(m * a1 + n * b1)}; ${K.T(m * a2 + n * b2)})$`, R`A keresett koordináta: $${K.T(ans)}$.`]
    };
  });

  def('g1-v-2', 'geometria', 'vektorok', 1, 'Vektor hossza', function (r) {
    var t = trip(r), sx = r.pick([-1, 1]), sy = r.pick([-1, 1]), sw = r.int(0, 1) === 1, dx = sx * (sw ? t[1] : t[0]), dy = sy * (sw ? t[0] : t[1]);
    var x = r.int(-6, 6), y = r.int(-6, 6), bx = x + dx, by = y + dy;
    return {
      q: R`Az $A(${K.T(x)}; ${K.T(y)})$ és $B(${K.T(bx)}; ${K.T(by)})$ pontokra mekkora az $\overrightarrow{AB}$ vektor hossza?`,
      answer: { type: 'num', value: t[2] }, ansTex: K.T(t[2]), verify: `sqrt((${bx}-(${x}))^2+(${by}-(${y}))^2)`,
      tip1: R`Először számítsd ki a vektor koordinátáit: végpont mínusz kezdőpont.`, tip2: R`$|\overrightarrow{AB}| = \sqrt{d_1^2 + d_2^2}$.`,
      sol: [R`$\overrightarrow{AB} = (${K.T(bx)} - ${K.par(x)}; ${K.T(by)} - ${K.par(y)}) = (${K.T(dx)}; ${K.T(dy)})$`, R`$|\overrightarrow{AB}| = \sqrt{${dx * dx} + ${dy * dy}} = ${t[2]}$.`]
    };
  });

  def('g1-v-3', 'geometria', 'vektorok', 2, 'Merőleges vektorok', function (r) {
    var x1 = r.nz(-6, 6), y1 = r.pick([2, 3, 4, 5]), t = r.nz(-3, 3), x2 = y1 * t, p = -x1 * t, pos = r.int(0, 1) === 1;
    return {
      q: R`Adott az $\vec{a}(${K.T(x1)}; ${K.T(y1)})$ és a $\vec{b}(${K.T(x2)}; p)$ vektor. Mennyi a $p$ értéke, ha $\vec{a} \perp \vec{b}$?`,
      answer: { type: 'num', value: p }, ansTex: R`p = ${K.T(p)}`, verify: `-(${x1})*(${x2})/${y1}`,
      tip1: R`Két vektor akkor merőleges, ha a skaláris szorzatuk $0$.`, tip2: R`$${K.T(x1)} \cdot ${K.par(x2)} + ${y1} \cdot p = 0$.`,
      sol: [R`$\vec{a} \cdot \vec{b} = ${K.T(x1)} \cdot ${K.par(x2)} + ${y1} \cdot p = ${K.T(x1 * x2)} + ${y1}p = 0$`, R`$p = ${K.T(-x1 * x2)} / ${y1} = ${K.T(p)}$.`, R`Ellenőrzés: $${K.T(x1)} \cdot ${K.par(x2)} + ${y1} \cdot ${K.par(p)} = ${K.T(x1 * x2 + y1 * p)}$.`]
    };
  });

  def('g1-v-4', 'geometria', 'vektorok', 2, 'Két vektor hajlásszögének koszinusza', function (r) {
    var B = [[3, 4, 5], [4, 3, 5], [-3, 4, 5], [5, 12, 13], [12, -5, 13], [6, 8, 10], [8, 15, 17], [0, 5, 5], [7, 24, 25], [-4, 3, 5], [15, -8, 17], [-5, 0, 5]];
    var u, w, d;
    do { u = r.pick(B); w = r.pick(B); d = u[0] * w[1] - u[1] * w[0]; } while (d === 0);
    var dot = u[0] * w[0] + u[1] * w[1], val = dot / (u[2] * w[2]);
    return {
      q: R`Mekkora az $\vec{a}(${K.T(u[0])}; ${K.T(u[1])})$ és a $\vec{b}(${K.T(w[0])}; ${K.T(w[1])})$ vektor hajlásszögének koszinusza? (két tizedesre kerekítve)`,
      answer: { type: 'num', value: val, tol: 0.0051 }, ansTex: R`\cos\varphi \approx ${K.T(val, 2)}`,
      verify: `((${u[0]})*(${w[0]})+(${u[1]})*(${w[1]}))/(sqrt((${u[0]})^2+(${u[1]})^2)*sqrt((${w[0]})^2+(${w[1]})^2))`,
      tip1: R`A skaláris szorzat két alakjából: $\cos\varphi = \dfrac{\vec{a} \cdot \vec{b}}{|\vec{a}| \cdot |\vec{b}|}$.`,
      tip2: R`A hosszak: $|\vec{a}| = ${u[2]}$, $|\vec{b}| = ${w[2]}$. A skalárszorzat: $${K.T(u[0])} \cdot ${K.par(w[0])} + ${K.par(u[1])} \cdot ${K.par(w[1])}$.`,
      sol: [R`$\vec{a} \cdot \vec{b} = ${K.T(dot)}$, $|\vec{a}| = ${u[2]}$, $|\vec{b}| = ${w[2]}$.`, R`$\cos\varphi = \dfrac{${K.T(dot)}}{${u[2]} \cdot ${w[2]}} \approx ${K.T(val, 2)}$.`]
    };
  });

  def('g1-v-5', 'geometria', 'vektorok', 2, 'Hegyes-, derék- vagy tompaszög?', function (r) {
    var kind = r.int(0, 2), a1, a2, b1, b2, dot;
    do {
      a1 = r.nz(-6, 6); a2 = r.nz(-6, 6);
      if (kind === 1) { var t = r.nz(-3, 3); b1 = -a2 * t; b2 = a1 * t; } else { b1 = r.nz(-6, 6); b2 = r.nz(-6, 6); }
      dot = a1 * b1 + a2 * b2;
    } while ((kind === 0 ? dot <= 0 : kind === 2 ? dot >= 0 : false) || (a1 * b2 - a2 * b1) === 0);
    var nm = ['hegyesszög', 'derékszög', 'tompaszög'], good = '\\text{' + nm[kind] + '}', bad = [0, 1, 2].filter(function (k) { return k !== kind; }).map(function (k) { return '\\text{' + nm[k] + '}'; });
    return {
      q: R`Az $\vec{a}(${K.T(a1)}; ${K.T(a2)})$ és a $\vec{b}(${K.T(b1)}; ${K.T(b2)})$ vektor hajlásszöge milyen szög?`,
      answer: K.choice(r, '$' + good + '$', bad.map(function (x) { return '$' + x + '$'; })), ansTex: good,
      tip1: R`A skalárszorzat előjele árulja el a hajlásszög fajtáját.`, tip2: R`$\vec{a} \cdot \vec{b} > 0$: hegyesszög, $= 0$: derékszög, $< 0$: tompaszög.`,
      sol: [R`$\vec{a} \cdot \vec{b} = ${K.T(a1)} \cdot ${K.par(b1)} + ${K.par(a2)} \cdot ${K.par(b2)} = ${K.T(dot)}$.`, R`A szög tehát: $${good}$.`]
    };
  });

  def('g1-v-6', 'geometria', 'vektorok', 3, 'Vektorfelbontás', function (r) {
    var a1, a2, b1, b2, det;
    do { a1 = r.nz(-5, 5); a2 = r.nz(-5, 5); b1 = r.nz(-5, 5); b2 = r.nz(-5, 5); det = a1 * b2 - a2 * b1; } while (det === 0);
    var lam = r.nz(-4, 4), mu = r.nz(-4, 4), c1 = lam * a1 + mu * b1, c2 = lam * a2 + mu * b2, askl = r.int(0, 1) === 0;
    return {
      q: R`Bontsd fel a $\vec{c}(${K.T(c1)}; ${K.T(c2)})$ vektort az $\vec{a}(${K.T(a1)}; ${K.T(a2)})$ és $\vec{b}(${K.T(b1)}; ${K.T(b2)})$ vektorok irányában: $\vec{c} = \lambda\vec{a} + \mu\vec{b}$. Mennyi a ${askl ? '$\\lambda$' : '$\\mu$'} értéke?`,
      answer: { type: 'num', value: askl ? lam : mu }, ansTex: askl ? R`\lambda = ${K.T(lam)}` : R`\mu = ${K.T(mu)}`,
      verify: askl ? `((${c1})*(${b2})-(${c2})*(${b1}))/((${a1})*(${b2})-(${a2})*(${b1}))` : `((${a1})*(${c2})-(${a2})*(${c1}))/((${a1})*(${b2})-(${a2})*(${b1}))`,
      tip1: R`Koordinátánként írd fel az egyenletet: két egyenlet, két ismeretlen.`,
      tip2: R`$${K.T(c1)} = ${K.T(a1)}\lambda + ${K.par(b1)}\mu$ és $${K.T(c2)} = ${K.T(a2)}\lambda + ${K.par(b2)}\mu$.`,
      sol: [R`Az egyenletrendszer: $${K.T(a1)}\lambda + ${K.par(b1)}\mu = ${K.T(c1)}$, $${K.T(a2)}\lambda + ${K.par(b2)}\mu = ${K.T(c2)}$. A determináns $${K.T(a1)} \cdot ${K.par(b2)} - ${K.par(a2)} \cdot ${K.par(b1)} = ${K.T(det)} \neq 0$, ezért egyértelmű a megoldás.`, R`A megoldás: $\lambda = ${K.T(lam)}$, $\mu = ${K.T(mu)}$.`, R`Ellenőrzés: $\lambda\vec{a} + \mu\vec{b} = (${K.T(lam * a1 + mu * b1)}; ${K.T(lam * a2 + mu * b2)})$, ez egyezik a $\vec{c}$ vektorral.`]
    };
  });

  def('g1-v-7', 'geometria', 'vektorok', 3, 'Háromszög területe vektorokkal', function (r) {
    var x = r.int(-5, 5), y = r.int(-5, 5), u1, u2, w1, w2, d;
    do { u1 = r.nz(-6, 6); u2 = r.nz(-6, 6); w1 = r.nz(-6, 6); w2 = r.nz(-6, 6); d = u1 * w2 - u2 * w1; } while (d === 0);
    var T = Math.abs(d) / 2;
    return {
      q: R`Az $A(${K.T(x)}; ${K.T(y)})$, $B(${K.T(x + u1)}; ${K.T(y + u2)})$ és $C(${K.T(x + w1)}; ${K.T(y + w2)})$ csúcsú háromszögnek mekkora a területe (területegység)?`,
      answer: { type: 'num', value: T }, ansTex: K.T(T), verify: `sqrt(((${u1})^2+(${u2})^2)*((${w1})^2+(${w2})^2)-((${u1})*(${w1})+(${u2})*(${w2}))^2)/2`,
      tip1: R`Írd fel az $\overrightarrow{AB}$ és $\overrightarrow{AC}$ vektorokat.`, tip2: R`$T = \dfrac{1}{2}\left|u_1 w_2 - u_2 w_1\right|$; ez a $\vec{u}$ elforgatottjának és $\vec{w}$-nak a skalárszorzatából adódik.`,
      sol: [R`$\overrightarrow{AB} = (${K.T(u1)}; ${K.T(u2)})$, $\overrightarrow{AC} = (${K.T(w1)}; ${K.T(w2)})$.`, R`$T = \dfrac{1}{2}\left|${K.T(u1)} \cdot ${K.par(w2)} - ${K.par(u2)} \cdot ${K.par(w1)}\right| = \dfrac{1}{2} \cdot ${Math.abs(d)} = ${K.T(T)}$.`]
    };
  });

  def('g1-v-8', 'geometria', 'vektorok', 3, 'Derékszögű egyenlő szárú háromszög csúcsa', function (r) {
    var x = r.int(-6, 6), y = r.int(-6, 6), u = r.nz(-6, 6), w = r.nz(-6, 6), pos = r.int(0, 1) === 0, askx = r.int(0, 1) === 0;
    var cx = pos ? x - w : x + w, cy = pos ? y + u : y - u, ans = askx ? cx : cy;
    var vx = pos ? '-(' + w + ')' : '(' + w + ')', vy = pos ? '(' + u + ')' : '-(' + u + ')';
    return {
      q: R`Az $ABC$ háromszög $A(${K.T(x)}; ${K.T(y)})$ és $B(${K.T(x + u)}; ${K.T(y + w)})$ csúcsú, $A$-nál derékszögű és egyenlő szárú, és az $\overrightarrow{AC}$ vektor az $\overrightarrow{AB}$ vektor ${pos ? 'pozitív irányú ($+90^\\circ$-os)' : 'negatív irányú ($-90^\\circ$-os)'} elforgatottja. Mennyi a $C$ csúcs ${askx ? '$x$' : '$y$'}-koordinátája?`,
      answer: { type: 'num', value: ans }, ansTex: K.T(ans), verify: askx ? `${x}+${vx}` : `${y}+${vy}`,
      tip1: R`Az $\overrightarrow{AB}(a_1; a_2)$ elforgatottja pozitív irányban $(-a_2; a_1)$, negatív irányban $(a_2; -a_1)$.`,
      tip2: R`$\overrightarrow{AB} = (${K.T(u)}; ${K.T(w)})$, és $C = A + \overrightarrow{AC}$.`,
      sol: [R`$\overrightarrow{AB} = (${K.T(u)}; ${K.T(w)})$, ennek ${pos ? 'pozitív' : 'negatív'} elforgatottja $\overrightarrow{AC} = (${K.T(cx - x)}; ${K.T(cy - y)})$.`, R`$C = A + \overrightarrow{AC} = (${K.T(cx)}; ${K.T(cy)})$, a keresett koordináta $${K.T(ans)}$.`, R`Ellenőrzés: $\overrightarrow{AB} \cdot \overrightarrow{AC} = ${K.T(u * (cx - x) + w * (cy - y))}$.`]
    };
  });
})(typeof window !== 'undefined' ? window : globalThis);
