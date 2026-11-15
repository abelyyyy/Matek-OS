(function (root) {
  'use strict';
  var MO = root.MO = root.MO || {};
  var K = MO.taskKit, R = K.R, def = K.def, Q = MO.Q;
  MO.content = MO.content || {};

  /* ---------- segédek ---------- */
  var TRI = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29]];      /* pitagoraszi számhármasok */
  function rad(d) { return d * Math.PI / 180; }
  function dg(d) { return d + '^\\circ'; }
  function par(x) { return x < 0 ? '(' + x + ')' : '' + x; }
  function r2(x) { return Math.round(x * 100) / 100; }

  /* ================================================================== */
  /* 4.5 Trigonometria                                                   */
  /* ================================================================== */
  MO.content['geometria/trigonometria'] = {
    intro: R`A trigonometria a szögek és az oldalak kapcsolatát vizsgálja. Derékszögű háromszögben a szögfüggvények oldalarányok, az egységkör segítségével pedig tetszőleges forgásszögre is értelmezzük őket. A szinusz- és a koszinusztétellel bármilyen háromszög hiányzó adatai kiszámíthatók, ezért ez az alfejezet a magasságmérési, távolságmérési és síkgeometriai érettségi feladatok eszköztára (4.5 Trigonometria). Az emelt szint a szögfüggvények általános definícióját és az addíciós összefüggések alkalmazását is kéri; a trigonometrikus egyenletekkel az Algebra/Egyenletek alfejezet foglalkozik, itt csak a szögfüggvény-értékek kiszámítását gyakoroljuk.`,
    theory: [
      { h: 'Szögfüggvények derékszögű háromszögben',
        b: R`Egy derékszögű háromszögben az $\alpha$ hegyesszöggel szemközti befogó $a$, a mellette lévő befogó $b$, az átfogó $c$. Definíció:\n$$\sin\alpha = \dfrac{a}{c}, \quad \cos\alpha = \dfrac{b}{c}, \quad \operatorname{tg}\alpha = \dfrac{a}{b}, \quad \operatorname{ctg}\alpha = \dfrac{b}{a}.$$\nSzóval: szinusz = **szemközti / átfogó**, koszinusz = **melletti / átfogó**, tangens = **szemközti / melletti**, kotangens = **melletti / szemközti**.\nAz értékek csak a szögtől függnek, nem a háromszög méretétől, mert az azonos szögű derékszögű háromszögek hasonlók, és hasonló háromszögekben az oldalarányok egyenlők. Hegyesszögre $0 < \sin\alpha < 1$ és $0 < \cos\alpha < 1$, mert a befogók rövidebbek az átfogónál.\nPélda: a $3$, $4$, $5$ oldalú háromszögben a $3$ hosszú befogóval szemközti szögre $\sin\alpha = \dfrac{3}{5}$, $\cos\alpha = \dfrac{4}{5}$, $\operatorname{tg}\alpha = \dfrac{3}{4}$.` },
      { h: 'Nevezetes szögek: 30°, 45°, 60°',
        b: R`A $30^\circ$, $45^\circ$ és $60^\circ$ szögfüggvényeit pontosan tudni kell:\n$$\begin{array}{c|ccc} \alpha & 30^\circ & 45^\circ & 60^\circ \\ \hline \sin\alpha & \frac{1}{2} & \frac{\sqrt{2}}{2} & \frac{\sqrt{3}}{2} \\ \cos\alpha & \frac{\sqrt{3}}{2} & \frac{\sqrt{2}}{2} & \frac{1}{2} \\ \operatorname{tg}\alpha & \frac{\sqrt{3}}{3} & 1 & \sqrt{3} \end{array}$$\n**Honnan jönnek?** Egy $2$ oldalú szabályos háromszög magassága $\sqrt{3}$ (Pitagorasz-tétel), és a magasság a háromszöget két $30^\circ$–$60^\circ$–$90^\circ$-os derékszögű háromszögre bontja, amelynek oldalai $1$, $\sqrt{3}$, $2$. Egy $1$ oldalú négyzet átlója $\sqrt{2}$, és az átló két $45^\circ$–$45^\circ$–$90^\circ$-os háromszögre bontja, amelynek oldalai $1$, $1$, $\sqrt{2}$. Ezekből az oldalarányokból olvashatók le a táblázat értékei.` },
      { h: 'Alapvető összefüggések, pótszögek',
        b: R`Minden $\alpha$ szögre érvényes:\n$$\sin^2\alpha + \cos^2\alpha = 1, \qquad \operatorname{tg}\alpha = \dfrac{\sin\alpha}{\cos\alpha}, \qquad \operatorname{ctg}\alpha = \dfrac{\cos\alpha}{\sin\alpha} = \dfrac{1}{\operatorname{tg}\alpha}.$$\nHegyesszögnél az elsőt a Pitagorasz-tétel adja: $\left(\dfrac{a}{c}\right)^2 + \left(\dfrac{b}{c}\right)^2 = \dfrac{a^2 + b^2}{c^2} = 1$.\n**Pótszögek:** a derékszögű háromszög két hegyesszöge, $\alpha$ és $90^\circ - \alpha$, egymás pótszöge; az egyik szemközti befogója a másiknak a melletti befogója, ezért\n$$\sin(90^\circ - \alpha) = \cos\alpha, \quad \cos(90^\circ - \alpha) = \sin\alpha, \quad \operatorname{tg}(90^\circ - \alpha) = \operatorname{ctg}\alpha.$$\nEgyik függvény ismeretében a többi kiszámítható: ha $\alpha$ hegyesszög és $\sin\alpha = \dfrac{3}{5}$, akkor $\cos\alpha = \sqrt{1 - \dfrac{9}{25}} = \dfrac{4}{5}$ (hegyesszögnél a koszinusz pozitív).` },
      { h: 'Szögmérés: fok és radián, szög meghatározása számológéppel',
        b: R`A szöget **fokban** ($360^\circ$ a teljes kör) vagy **radiánban** mérjük. A radián (**emelt szint**) a szöghöz tartozó ív és a sugár hányadosa: az egységkörön az $\alpha$ középponti szöghöz $\alpha$ hosszúságú ív tartozik, így a teljes körhöz $2\pi$.\n$$180^\circ = \pi \text{ rad}, \qquad \alpha_{\text{rad}} = \alpha_{\text{fok}} \cdot \dfrac{\pi}{180^\circ}.$$\nNevezetes szögek: $30^\circ = \dfrac{\pi}{6}$, $45^\circ = \dfrac{\pi}{4}$, $60^\circ = \dfrac{\pi}{3}$, $90^\circ = \dfrac{\pi}{2}$, $180^\circ = \pi$. Ívhossz: $i = r \cdot \alpha_{\text{rad}}$.\n**Számológép:** ha a szögfüggvény értékét ismerjük, a szöget a $\sin^{-1}$, $\cos^{-1}$, $\tan^{-1}$ gombokkal kapjuk. Mindig ellenőrizd, hogy a gép **fok (DEG)** vagy **radián (RAD)** módban van-e! A $\sin^{-1}$ és a $\tan^{-1}$ csak a $[-90^\circ; 90^\circ]$ közötti, a $\cos^{-1}$ a $[0^\circ; 180^\circ]$ közötti szöget adja, a másik megoldást (pl. a $\sin\beta = 0{,}5$ egyenletnél a $150^\circ$-ot) nekünk kell megtalálni.` },
      { h: 'Tompaszögek: kiegészítő szögek',
        b: R`Két szög **kiegészítő szög**, ha összegük $180^\circ$. Tompaszög ($90^\circ < \alpha < 180^\circ$) szögfüggvényeit a kiegészítő szögből származtatjuk:\n$$\sin(180^\circ - \alpha) = \sin\alpha, \quad \cos(180^\circ - \alpha) = -\cos\alpha, \quad \operatorname{tg}(180^\circ - \alpha) = -\operatorname{tg}\alpha.$$\nEzek az egységkörről is leolvashatók (lásd a következő részt): a $180^\circ - \alpha$ szögű pont az $\alpha$ szögű pont tükörképe az $y$ tengelyre, ezért a magassága ($\sin$) ugyanaz, a vízszintes koordinátája ($\cos$) ellentettje.\nPéldák: $\sin 120^\circ = \sin 60^\circ = \dfrac{\sqrt{3}}{2}$; $\cos 120^\circ = -\cos 60^\circ = -\dfrac{1}{2}$; $\operatorname{tg} 135^\circ = -\operatorname{tg} 45^\circ = -1$.\nA tompaszög koszinusza és tangense negatív, a szinusza pozitív. Ez a szinusztételnél fontos: a $\sin\beta = 0{,}5$ egyenletnek két háromszögszög felel meg: $30^\circ$ és $150^\circ$.` },
      { h: 'A szögfüggvények általános definíciója: forgásszögek', level: 'emelt',
        b: R`Az **egységkör** az origó középpontú, $1$ sugarú kör. Az $x$ tengely pozitív felét az origó körül $\alpha$ szöggel pozitív (az óramutatóval ellentétes) irányba forgatva az egységkör egy $P$ pontját kapjuk. Definíció: $\cos\alpha$ a $P$ pont **első**, $\sin\alpha$ a **második** koordinátája: $P(\cos\alpha;\ \sin\alpha)$. Ez tetszőleges (negatív vagy $360^\circ$-nál nagyobb) forgásszögre is értelmezett. Továbbá $\operatorname{tg}\alpha = \dfrac{\sin\alpha}{\cos\alpha}$ ($\cos\alpha \neq 0$) és $\operatorname{ctg}\alpha = \dfrac{\cos\alpha}{\sin\alpha}$ ($\sin\alpha \neq 0$).\nHegyesszögnél ez ugyanazt adja, mint a derékszögű háromszögbeli definíció (az egységkör $P$ pontjából az $x$ tengelyre állított merőleges derékszögű háromszöget ad, amelynek átfogója $1$).\n**Következmények:** $-1 \leq \sin\alpha \leq 1$, $-1 \leq \cos\alpha \leq 1$; $\sin^2\alpha + \cos^2\alpha = 1$ (a $P$ pont az egységkörön van); a függvények $360^\circ$ szerint periodikusak; $\sin(-\alpha) = -\sin\alpha$, $\cos(-\alpha) = \cos\alpha$; $\sin(180^\circ + \alpha) = -\sin\alpha$, $\cos(180^\circ + \alpha) = -\cos\alpha$.\n**Előjelek negyedenként:** I. negyed ($0^\circ$–$90^\circ$): $\sin +$, $\cos +$; II.: $\sin +$, $\cos -$; III.: $\sin -$, $\cos -$; IV.: $\sin -$, $\cos +$. A tangens előjele a két előjel szorzata.` },
      { h: 'Addíciós összefüggések', level: 'emelt',
        b: R`Két szög összegének szögfüggvényeit a szögek szögfüggvényeiből számítjuk (a függvénytáblázatban megtalálhatók):\n$$\sin(\alpha + \beta) = \sin\alpha\cos\beta + \cos\alpha\sin\beta,$$\n$$\cos(\alpha + \beta) = \cos\alpha\cos\beta - \sin\alpha\sin\beta,$$\n$$\operatorname{tg}(\alpha + \beta) = \dfrac{\operatorname{tg}\alpha + \operatorname{tg}\beta}{1 - \operatorname{tg}\alpha \operatorname{tg}\beta}.$$\n**Kétszeres szög** ($\beta = \alpha$): $\sin 2\alpha = 2\sin\alpha\cos\alpha$, $\cos 2\alpha = \cos^2\alpha - \sin^2\alpha = 1 - 2\sin^2\alpha = 2\cos^2\alpha - 1$, $\operatorname{tg} 2\alpha = \dfrac{2\operatorname{tg}\alpha}{1 - \operatorname{tg}^2\alpha}$.\nA különbségre ($\alpha - \beta$) a $-\beta$ behelyettesítésével: $\sin(\alpha - \beta) = \sin\alpha\cos\beta - \cos\alpha\sin\beta$, $\cos(\alpha - \beta) = \cos\alpha\cos\beta + \sin\alpha\sin\beta$.\nPélda: $\sin 75^\circ = \sin(45^\circ + 30^\circ) = \dfrac{\sqrt{2}}{2}\cdot\dfrac{\sqrt{3}}{2} + \dfrac{\sqrt{2}}{2}\cdot\dfrac{1}{2} = \dfrac{\sqrt{6} + \sqrt{2}}{4}$.\n(A követelmény a tételek alkalmazását kéri, a bizonyításuk nem követelmény.)` },
      { h: 'A szinusztétel', 
        b: R`Bármely háromszögben az oldalak aránya egyenlő a szemközti szögek szinuszának arányával; pontosabban:\n$$\dfrac{a}{\sin\alpha} = \dfrac{b}{\sin\beta} = \dfrac{c}{\sin\gamma} = 2R,$$\nahol $R$ a háromszög köré írt körének sugara.\nHasználjuk, ha adott **két szög és egy oldal** (a harmadik szög $180^\circ$-ra egészíti ki őket), vagy **két oldal és az egyikkel szemközti szög**.\n**Figyelem, a kétértelmű eset:** ha $a$, $b$ és $\alpha$ adott, akkor $\sin\beta = \dfrac{b\sin\alpha}{a}$. Ha ez $1$-nél nagyobb, nincs háromszög; ha $1$, akkor $\beta = 90^\circ$; ha kisebb, akkor $\beta_1$ hegyesszög és $\beta_2 = 180^\circ - \beta_1$ lehet a megoldás. Ha $\alpha$ hegyesszög, akkor $b > a$ esetén **mindkettő megfelel** (két háromszög van), $b \leq a$ esetén csak $\beta_1$ (nagyobb oldallal nagyobb szög áll szemben, így $\beta \leq \alpha$ hegyesszög). Mindig ellenőrizd, hogy a szögek összege $180^\circ$-nál kisebb-e!`,
        proof: R`Az $ABC$ háromszögben a $C$ csúcsból húzott magasság talppontja $T$, hossza $m$. Az $ACT$ háromszögből (vagy tompaszög esetén a $180^\circ - \alpha$ szögű háromszögből, ahol a szinusz ugyanaz) $m = b\sin\alpha$, a $BCT$ háromszögből $m = a\sin\beta$. Ezért $b\sin\alpha = a\sin\beta$, azaz $\dfrac{a}{\sin\alpha} = \dfrac{b}{\sin\beta}$. Ugyanígy a másik két oldalra is. A $2R$-re: az $ABC$ háromszög köré írt körben húzzuk meg a $B$-ből induló $BA'$ átmérőt. A $BA'C$ szög kerületi szög ugyanazon az íven, mint $\alpha$, ezért $\alpha$ (vagy $180^\circ - \alpha$); a Thalész-tétel miatt $BCA'$ derékszög, így $\sin\alpha = \dfrac{a}{2R}$, azaz $\dfrac{a}{\sin\alpha} = 2R$.` },
      { h: 'A koszinusztétel és a háromszög megoldása',
        b: R`Bármely háromszögben egy oldal négyzete egyenlő a másik két oldal négyzetösszegének és e két oldal kétszeres szorzata és az **általuk bezárt szög** koszinuszának különbségével:\n$$c^2 = a^2 + b^2 - 2ab\cos\gamma, \quad a^2 = b^2 + c^2 - 2bc\cos\alpha, \quad b^2 = a^2 + c^2 - 2ac\cos\beta.$$\nDerékszögnél ($\cos 90^\circ = 0$) a Pitagorasz-tételt kapjuk; tompaszögnél $\cos\gamma < 0$, ezért $c^2 > a^2 + b^2$. A szög kifejezve: $\cos\gamma = \dfrac{a^2 + b^2 - c^2}{2ab}$, és egy $0^\circ$ és $180^\circ$ közötti szöget a koszinusza **egyértelműen** meghatároz.\n**Háromszög megoldása:**\n1. Három oldal: koszinusztétel a szögekre (mindig a legnagyobb oldallal szemközti szöggel kezdve, mert az lehet tompa).\n2. Két oldal és a közbezárt szög: koszinusztétel a harmadik oldalra, majd a szinusztétellel a **kisebb** oldallal szemközti szög (az biztosan hegyesszög), a harmadik szög pedig $180^\circ$-ra egészít ki.\n3. Egy oldal és két szög: a harmadik szög kiszámítása, majd szinusztétel.\n4. Két oldal és a nagyobbikkal szemközti szög: szinusztétel, egyértelmű. Két oldal és a **kisebbikkel** szemközti szög: kétértelmű eset, lásd az előző részt (a koszinusztétellel másodfokú egyenletet kapunk a harmadik oldalra, amelynek $0$, $1$ vagy $2$ pozitív gyöke lehet).\nA háromszög területe $t = \dfrac{ab\sin\gamma}{2}$ (lásd a Kerület, terület alfejezetet).`,
        proof: R`Helyezzük a háromszöget koordináta-rendszerbe: $C = (0; 0)$, $B = (a; 0)$, és $A$ a $CA$ szakasz $b$ hossza és a $\gamma$ szög miatt $A = (b\cos\gamma;\ b\sin\gamma)$ (ez az egységkör definíciójából következik, tetszőleges $\gamma$-ra, tompaszögre is). A távolságképlettel $c^2 = AB^2 = (a - b\cos\gamma)^2 + (b\sin\gamma)^2 = a^2 - 2ab\cos\gamma + b^2\cos^2\gamma + b^2\sin^2\gamma$. Mivel $\cos^2\gamma + \sin^2\gamma = 1$, ez $a^2 + b^2 - 2ab\cos\gamma$, ami az állítás.` }
    ],
    examples: [
      { t: 'Derékszögű háromszög szögfüggvényei',
        p: R`Egy derékszögű háromszög átfogója $13$ cm, az egyik befogója $5$ cm. Az $\alpha$ szög az $5$ cm-es befogóval szemközti hegyesszög. Határozd meg a hiányzó oldalt, az $\alpha$ szög szinuszát, koszinuszát, tangensét, és közelítőleg magát a szöget!`,
        steps: [R`Ábra: derékszögű háromszög, a derékszögű csúcsnál a két befogó találkozik, a $5$ cm-es befogóval szemben van $\alpha$, az átfogó $13$ cm.`, R`Pitagorasz-tétel: a másik befogó $b = \sqrt{13^2 - 5^2} = \sqrt{144} = 12$ cm.`, R`$\sin\alpha = \dfrac{5}{13}$, $\cos\alpha = \dfrac{12}{13}$, $\operatorname{tg}\alpha = \dfrac{5}{12}$.`, R`Ellenőrzés: $\sin^2\alpha + \cos^2\alpha = \dfrac{25}{169} + \dfrac{144}{169} = 1$, és $\operatorname{tg}\alpha = \dfrac{\sin\alpha}{\cos\alpha} = \dfrac{5/13}{12/13} = \dfrac{5}{12}$.`, R`A szög számológéppel (fok módban): $\alpha = \operatorname{tg}^{-1}\dfrac{5}{12} \approx 22{,}6^\circ$.`],
        ans: R`A másik befogó $12$ cm, $\sin\alpha = \dfrac{5}{13}$, $\cos\alpha = \dfrac{12}{13}$, $\operatorname{tg}\alpha = \dfrac{5}{12}$, $\alpha \approx 22{,}6^\circ$.`,
        checks: [['sqrt(13^2-5^2)', '12'], ['(5/13)^2+(12/13)^2', '1'], ['(5/13)/(12/13)', '5/12']] },
      { t: 'Torony magassága nevezetes szöggel',
        p: R`Egy torony talppontjától vízszintesen $40$ méterre állva a torony csúcsát $30^\circ$-os emelkedési szög alatt látjuk. A szemmagasságtól tekintsünk el. Milyen magas a torony? Add meg pontosan és tizedesre kerekítve is!`,
        steps: [R`Ábra: derékszögű háromszög; az egyik befogó a vízszintes távolság ($40$ m), a másik a torony magassága $h$, a $30^\circ$-os szög a megfigyelőnél van, a $h$ befogóval szemben.`, R`A szemközti és a melletti befogó hányadosa a tangens: $\operatorname{tg}30^\circ = \dfrac{h}{40}$.`, R`$\operatorname{tg}30^\circ = \dfrac{\sqrt{3}}{3}$, ezért $h = 40 \cdot \dfrac{\sqrt{3}}{3} = \dfrac{40\sqrt{3}}{3}$.`, R`Közelítés: $h \approx 40 \cdot 0{,}5774 \approx 23{,}09$ m.`, R`Ellenőrzés: az átfogó $\dfrac{40}{\cos 30^\circ} = \dfrac{80}{\sqrt{3}} \approx 46{,}19$ m, és $\sin30^\circ \cdot 46{,}19 \approx 23{,}09$ m, ugyanazt kapjuk.`],
        ans: R`A torony $\dfrac{40\sqrt{3}}{3} \approx 23{,}09$ méter magas.`,
        checks: [['tg(pi/6)', 'sqrt(3)/3'], ['40*tg(pi/6)', '40*sqrt(3)/3'], ['40/cos(pi/6)*sin(pi/6)', '40*tg(pi/6)']] },
      { t: 'Összefüggések, kétszeres szög (emelt)',
        p: R`Az $\alpha$ hegyesszögre $\sin\alpha = \dfrac{3}{5}$. Számítsd ki a $\cos\alpha$, $\operatorname{tg}\alpha$, $\sin 2\alpha$ és $\cos 2\alpha$ értékét, majd add meg a $2\alpha$ szög (tompa- vagy hegyesszög) fajtáját!`,
        steps: [R`$\sin^2\alpha + \cos^2\alpha = 1$, ezért $\cos^2\alpha = 1 - \dfrac{9}{25} = \dfrac{16}{25}$. Hegyesszögnél a koszinusz pozitív: $\cos\alpha = \dfrac{4}{5}$.`, R`$\operatorname{tg}\alpha = \dfrac{\sin\alpha}{\cos\alpha} = \dfrac{3/5}{4/5} = \dfrac{3}{4}$.`, R`Addíciós összefüggéssel: $\sin 2\alpha = 2\sin\alpha\cos\alpha = 2 \cdot \dfrac{3}{5} \cdot \dfrac{4}{5} = \dfrac{24}{25}$.`, R`$\cos 2\alpha = \cos^2\alpha - \sin^2\alpha = \dfrac{16}{25} - \dfrac{9}{25} = \dfrac{7}{25}$.`, R`Ellenőrzés: $\sin^2 2\alpha + \cos^2 2\alpha = \dfrac{576 + 49}{625} = 1$. Mivel $\cos 2\alpha > 0$ és $\sin 2\alpha > 0$, a $2\alpha$ az első negyedben van, tehát hegyesszög (valóban, $\alpha \approx 36{,}9^\circ$, $2\alpha \approx 73{,}7^\circ$).`],
        ans: R`$\cos\alpha = \dfrac{4}{5}$, $\operatorname{tg}\alpha = \dfrac{3}{4}$, $\sin 2\alpha = \dfrac{24}{25}$, $\cos 2\alpha = \dfrac{7}{25}$; a $2\alpha$ hegyesszög.`,
        checks: [['sqrt(1-(3/5)^2)', '4/5'], ['(3/5)/(4/5)', '3/4'], ['2*(3/5)*(4/5)', '24/25'], ['(4/5)^2-(3/5)^2', '7/25'], ['(24/25)^2+(7/25)^2', '1'], ['2*(3/4)/(1-(3/4)^2)', '24/7']] },
      { t: 'Háromszög megoldása két oldalból és a közbezárt szögből',
        p: R`Egy $ABC$ háromszögben $BC = a = 5$ cm, $CA = b = 8$ cm, és a $C$ csúcsnál lévő szög $\gamma = 60^\circ$. Számítsd ki a háromszög hiányzó oldalát és szögeit! A szögeket fokra, tizedre kerekítsd!`,
        steps: [R`Ábra: a $C$ csúcsból kiinduló két szakasz $5$ cm és $8$ cm hosszú, köztük $60^\circ$ van; az $AB = c$ oldal a $\gamma$ szöggel szemközt van.`, R`Koszinusztétel: $c^2 = a^2 + b^2 - 2ab\cos\gamma = 25 + 64 - 2 \cdot 5 \cdot 8 \cdot \dfrac{1}{2} = 49$, tehát $c = 7$ cm.`, R`Szinusztétel a kisebb oldallal szemközti $\alpha$ szögre (az biztosan hegyesszög): $\sin\alpha = \dfrac{a\sin\gamma}{c} = \dfrac{5 \cdot \frac{\sqrt{3}}{2}}{7} = \dfrac{5\sqrt{3}}{14} \approx 0{,}6186$, ezért $\alpha \approx 38{,}2^\circ$.`, R`A $\beta$ szöget a koszinusztétellel is ellenőrizhetjük: $\cos\beta = \dfrac{a^2 + c^2 - b^2}{2ac} = \dfrac{25 + 49 - 64}{70} = \dfrac{1}{7}$, így $\beta \approx 81{,}8^\circ$.`, R`Ellenőrzés: $\alpha + \beta + \gamma \approx 38{,}2^\circ + 81{,}8^\circ + 60^\circ = 180^\circ$.`],
        ans: R`$c = 7$ cm, $\alpha \approx 38{,}2^\circ$, $\beta \approx 81{,}8^\circ$.`,
        checks: [['sqrt(5^2+8^2-2*5*8*cos(pi/3))', '7'], ['5*sin(pi/3)/7', '5*sqrt(3)/14'], ['(25+49-64)/(2*5*7)', '1/7']] },
      { t: 'Kétértelmű eset: két megoldás (emelt, II. rész)',
        p: R`Egy $ABC$ háromszögben $BC = a = 7$ cm, $CA = b = 10$ cm, és az $A$ csúcsnál lévő szög $\alpha = 30^\circ$. Hány ilyen háromszög van? Számítsd ki mindegyikben a harmadik ($AB = c$) oldalt pontosan, és a $B$ csúcsnál lévő szöget tizedre kerekítve! Oldd meg a feladatot a koszinusztétellel is!`,
        steps: [R`Ábra: az $A$ csúcsnál $30^\circ$-os szög van, a szögszáron az $AC = 10$ cm hosszú szakasz végpontja $C$. A $C$ körül $7$ cm sugarú kör metszi a másik szögszárat; a távolság $C$-től a másik szögszárig $10\sin30^\circ = 5$ cm $< 7$ cm $< 10$ cm, ezért a kör két pontban metszi a félegyenest: két háromszög lesz.`, R`Szinusztétel: $\sin\beta = \dfrac{b\sin\alpha}{a} = \dfrac{10 \cdot \frac{1}{2}}{7} = \dfrac{5}{7} \approx 0{,}714 < 1$.`, R`Két szög felel meg: $\beta_1 \approx 45{,}6^\circ$ és $\beta_2 = 180^\circ - \beta_1 \approx 134{,}4^\circ$. Mindkettő jó, mert $\alpha + \beta_2 \approx 164{,}4^\circ < 180^\circ$.`, R`Koszinusztétel az $a$ oldalra: $a^2 = b^2 + c^2 - 2bc\cos\alpha$, azaz $49 = 100 + c^2 - 10\sqrt{3}\,c$, vagyis $c^2 - 10\sqrt{3}\,c + 51 = 0$.`, R`Diszkrimináns: $300 - 204 = 96 = (4\sqrt{6})^2$. Így $c = \dfrac{10\sqrt{3} \pm 4\sqrt{6}}{2} = 5\sqrt{3} \pm 2\sqrt{6}$.`, R`$c_1 = 5\sqrt{3} + 2\sqrt{6} \approx 13{,}56$ cm (itt $\beta_1 \approx 45{,}6^\circ$, $\gamma_1 \approx 104{,}4^\circ$), $c_2 = 5\sqrt{3} - 2\sqrt{6} \approx 3{,}76$ cm (itt $\beta_2 \approx 134{,}4^\circ$, $\gamma_2 \approx 15{,}6^\circ$). Mindkét gyök pozitív, tehát mindkettő valódi háromszöget ad.`, R`Ellenőrzés: $c_1$-et visszahelyettesítve $c^2 - 10\sqrt{3}\,c + 51 = 0$ teljesül, és a két gyök szorzata $b^2 - a^2 = 51$ (Viète), valóban $(5\sqrt{3})^2 - (2\sqrt{6})^2 = 75 - 24 = 51$.`],
        ans: R`Két háromszög van: $c_1 = 5\sqrt{3} + 2\sqrt{6} \approx 13{,}56$ cm, $\beta_1 \approx 45{,}6^\circ$, illetve $c_2 = 5\sqrt{3} - 2\sqrt{6} \approx 3{,}76$ cm, $\beta_2 \approx 134{,}4^\circ$.`,
        checks: [['10*0,5/7', '5/7'], ['(10*sqrt(3))^2-4*51', '96'], ['(10*sqrt(3)+sqrt(96))/2', '5*sqrt(3)+2*sqrt(6)'], ['sqrt(96)', '4*sqrt(6)'], ['(5*sqrt(3)+2*sqrt(6))^2-10*sqrt(3)*(5*sqrt(3)+2*sqrt(6))+51', '0'], ['(5*sqrt(3)-2*sqrt(6))*(5*sqrt(3)+2*sqrt(6))', '51']] }
    ],
    sims: ['egysegkor', 'trig-grafikon', 'trig-egyenlet', 'haromszog'],
    mistakes: [
      R`A számológép rossz módban van: fokban megadott szöghöz **DEG**, radiánban megadotthoz **RAD** kell. Ellenőrzésül: $\sin 30^\circ = 0{,}5$.`,
      R`A szögfüggvény nem additív: $\sin(\alpha + \beta) \neq \sin\alpha + \sin\beta$, és $\sin 2\alpha \neq 2\sin\alpha$. Használd az addíciós összefüggést. Ugyanígy $\sin^2\alpha$ azt jelenti, hogy $(\sin\alpha)^2$, nem $\sin(\alpha^2)$.`,
      R`A szinusztételnél a tompaszög elvész: a $\sin\beta = 0{,}5$ egyenletnek $30^\circ$ és $150^\circ$ is megoldása, a számológép viszont csak a hegyesszöget adja. Ha $a$, $b$ és $\alpha$ adott, és $a < b$, mindig vizsgáld meg a második háromszöget!`,
      R`A koszinusztételben a szög az oldal **szemközti** szöge: $c^2 = a^2 + b^2 - 2ab\cos\gamma$. Gyakori hiba a rossz szög behelyettesítése, a $2ab$ elfelejtése, és a negatív koszinusznál az előjel: tompaszögnél $-2ab\cos\gamma$ pozitív tag.`,
      R`A tompaszög koszinusza és tangense negatív: $\cos 120^\circ = -\dfrac{1}{2}$, nem $\dfrac{1}{2}$. A szinusz viszont pozitív: $\sin 120^\circ = \sin 60^\circ$.`,
      R`A $\operatorname{tg} 90^\circ$ nem értelmezett (a $\cos 90^\circ = 0$ miatt nullával osztanánk), és a $\sin\alpha$ sem lehet $1$-nél nagyobb: ha a szinusztételnél $\sin\beta > 1$ jön ki, nincs ilyen háromszög.`,
      R`A fok és a radián keveredése: $\pi$ rad $= 180^\circ$, nem $360^\circ$; $\dfrac{\pi}{3} = 60^\circ$. A CAS-ban és az érettségin is jelöld a mértékegységet.`
    ],
    exam: R`A követelmény (4.5) középszinten kéri a hegyesszögek szögfüggvényeinek definícióját derékszögű háromszögben, a tompaszögek szögfüggvényeinek származtatását kiegészítő szögből, a pótszögek, kiegészítő szögek és a $\sin^2\alpha + \cos^2\alpha = 1$, $\operatorname{tg}\alpha = \dfrac{\sin\alpha}{\cos\alpha}$ összefüggések alkalmazását, a $30^\circ$, $45^\circ$, $60^\circ$ szögfüggvényeit, a szög meghatározását számológéppel, a szinusz- és koszinusztétel alkalmazását és a szinusztétel bizonyítását. Emelten az általános (forgásszög-) definíció és az ismert összefüggések kiterjesztése, az addíciós összefüggések (sin, cos, tg az összegre és a kétszeres szögre) alkalmazása függvénytáblázat segítségével, továbbá a koszinusztétel bizonyítása szerepel. Alkalmazási területek: magasság- és távolságmérés, háromszög hiányzó adatainak kiszámítása, négyszögek és testek szögeinek meghatározása szinusz- és koszinusztétellel.`,
    cheat: [
      R`\sin\alpha = \dfrac{\text{szemközti}}{\text{átfogó}}, \quad \cos\alpha = \dfrac{\text{melletti}}{\text{átfogó}}, \quad \operatorname{tg}\alpha = \dfrac{\text{szemközti}}{\text{melletti}}`,
      R`\sin^2\alpha + \cos^2\alpha = 1, \quad \operatorname{tg}\alpha = \dfrac{\sin\alpha}{\cos\alpha}`,
      R`\sin(180^\circ - \alpha) = \sin\alpha, \quad \cos(180^\circ - \alpha) = -\cos\alpha`,
      R`\sin 30^\circ = \dfrac{1}{2},\ \sin 45^\circ = \dfrac{\sqrt{2}}{2},\ \sin 60^\circ = \dfrac{\sqrt{3}}{2}`,
      R`\dfrac{a}{\sin\alpha} = \dfrac{b}{\sin\beta} = \dfrac{c}{\sin\gamma} = 2R`,
      R`c^2 = a^2 + b^2 - 2ab\cos\gamma`,
      R`\sin(\alpha + \beta) = \sin\alpha\cos\beta + \cos\alpha\sin\beta, \quad \cos(\alpha + \beta) = \cos\alpha\cos\beta - \sin\alpha\sin\beta`,
      R`\sin 2\alpha = 2\sin\alpha\cos\alpha, \quad \cos 2\alpha = \cos^2\alpha - \sin^2\alpha`,
      R`180^\circ = \pi\ \text{rad}`
    ],
    cheatChecks: [['sin(2a)', '2sin(a)cos(a)'], ['cos(2a)', 'cos(a)^2-sin(a)^2'], ['sin(a+b)', 'sin(a)cos(b)+cos(a)sin(b)'], ['cos(a+b)', 'cos(a)cos(b)-sin(a)sin(b)'], ['sin(pi-a)', 'sin(a)'], ['cos(pi-a)', '-cos(a)'], ['sin(a)^2+cos(a)^2', '1'], ['tg(a)', 'sin(a)/cos(a)'], ['sin(pi/2-a)', 'cos(a)']],
    terms: ['szinusz', 'koszinusz', 'tangens', 'kotangens', 'pótszög', 'kiegészítő szög', 'nevezetes szögek', 'egységkör', 'forgásszög', 'radián', 'addíciós összefüggések', 'szinusztétel', 'koszinusztétel', 'kétértelmű eset', 'háromszög megoldása', 'köré írt kör sugara']
  };

  /* ---------- generátorok: trigonometria ---------- */
  def('g2-trig-1', 'geometria', 'trigonometria', 1, 'Szögfüggvény derékszögű háromszögben', function (r) {
    var t = r.pick(TRI), k = t[2] > 17 ? 1 : r.int(1, 3), a = t[0] * k, b = t[1] * k, c = t[2] * k;
    if (r.int(0, 1)) { var x = a; a = b; b = x; }
    var f = r.pick(['sin', 'cos', 'tg']), num, den, nm, vf, sol;
    if (f === 'sin') { num = a; den = c; nm = R`\sin\alpha`; vf = `${a}/sqrt(${a}^2+${b}^2)`; sol = R`$\sin\alpha = \dfrac{\text{szemközti}}{\text{átfogó}} = \dfrac{${a}}{${c}} = ${K.q(a, c)}$`; }
    else if (f === 'cos') { num = b; den = c; nm = R`\cos\alpha`; vf = `${b}/sqrt(${a}^2+${b}^2)`; sol = R`$\cos\alpha = \dfrac{\text{melletti}}{\text{átfogó}} = \dfrac{${b}}{${c}} = ${K.q(b, c)}$`; }
    else { num = a; den = b; nm = R`\operatorname{tg}\alpha`; vf = `${a}/${b}`; sol = R`$\operatorname{tg}\alpha = \dfrac{\text{szemközti}}{\text{melletti}} = \dfrac{${a}}{${b}} = ${K.q(a, b)}$`; }
    return {
      q: R`Egy derékszögű háromszög befogói $${a}$ és $${b}$ egység hosszúak. Az $\alpha$ hegyesszög a(z) $${a}$ hosszú befogóval szemközt van. Mennyi $${nm}$ értéke? (Törtet is megadhatsz.)`,
      answer: { type: 'num', value: num / den }, ansTex: K.q(num, den), verify: vf,
      tip1: R`Szemközti, melletti befogó és átfogó hányadosa. Előbb számold ki az átfogót!`,
      tip2: R`Az átfogó: $c = \sqrt{${a}^2 + ${b}^2} = ${c}$.`,
      sol: [R`Pitagorasz-tétel: $c = \sqrt{${a}^2 + ${b}^2} = ${c}$.`, sol, R`Egyszerűsítés után: $${K.q(num, den)}$.`]
    };
  });

  def('g2-trig-2', 'geometria', 'trigonometria', 1, 'Tompaszög szögfüggvénye kiegészítő szögből', function (r) {
    var d = r.pick([120, 135, 150]), f = r.pick(['sin', 'cos', 'tg']), ac = 180 - d;
    var ex = { sin: { 120: R`\dfrac{\sqrt{3}}{2}`, 135: R`\dfrac{\sqrt{2}}{2}`, 150: R`\dfrac{1}{2}` },
               cos: { 120: R`-\dfrac{1}{2}`, 135: R`-\dfrac{\sqrt{2}}{2}`, 150: R`-\dfrac{\sqrt{3}}{2}` },
               tg: { 120: R`-\sqrt{3}`, 135: R`-1`, 150: R`-\dfrac{\sqrt{3}}{3}` } };
    var fn = { sin: R`\sin`, cos: R`\cos`, tg: R`\operatorname{tg}` }[f];
    var m = r.pick([1, 2, 3]), v = r2(m * Math[f === 'tg' ? 'tan' : f](rad(d))), mt = m === 1 ? '' : m + R` \cdot `, mv = m === 1 ? '' : m + '*';
    var rule = f === 'sin' ? R`$\sin(180^\circ - \alpha) = \sin\alpha$` : f === 'cos' ? R`$\cos(180^\circ - \alpha) = -\cos\alpha$` : R`$\operatorname{tg}(180^\circ - \alpha) = -\operatorname{tg}\alpha$`;
    return {
      q: R`Számítsd ki két tizedesre kerekítve: $${mt}${fn} ${d}^\circ$.`,
      answer: { type: 'num', value: v, tol: 0.0051 }, ansTex: K.T(v, 2),
      verify: `${mv}${f}(${d}*pi/180)`,
      tip1: R`Tompaszög: használd a kiegészítő szögét ($180^\circ$-ra egészíti ki). Figyelj az előjelre!`,
      tip2: R`A kiegészítő szög $180^\circ - ${d}^\circ = ${ac}^\circ$, ennek a nevezetes értékét ismered.`,
      sol: [R`Kiegészítő szögek: $180^\circ - ${d}^\circ = ${ac}^\circ$. Szabály: ${rule}.`, R`$${fn} ${d}^\circ = ${f === 'sin' ? '' : '-'}${fn} ${ac}^\circ = ${ex[f][d]}$.`, R`Kerekítve: $${K.T(v, 2)}$.`]
    };
  });

  def('g2-trig-3', 'geometria', 'trigonometria', 2, 'Kétszeres szög szögfüggvénye', function (r) {
    var t = r.pick(TRI), p = t[0], q = t[1], c = t[2], sw = r.int(0, 1);
    if (sw) { var x = p; p = q; q = x; }
    var mode = r.pick(['sin2', 'cos2', 'tg2']), val, tex, vf, sol;
    if (mode === 'sin2') { val = 2 * p * q / (c * c); tex = K.q(2 * p * q, c * c); vf = `2*(${p}/${c})*sqrt(1-(${p}/${c})^2)`; sol = R`$\sin 2\alpha = 2\sin\alpha\cos\alpha = 2 \cdot \dfrac{${p}}{${c}} \cdot \dfrac{${q}}{${c}} = ${tex}$`; }
    else if (mode === 'cos2') { val = (q * q - p * p) / (c * c); tex = K.q(q * q - p * p, c * c); vf = `1-2*(${p}/${c})^2`; sol = R`$\cos 2\alpha = \cos^2\alpha - \sin^2\alpha = \dfrac{${q * q}}{${c * c}} - \dfrac{${p * p}}{${c * c}} = ${tex}$`; }
    else { val = 2 * p * q / (q * q - p * p); tex = K.q(2 * p * q, q * q - p * p); vf = `2*(${p}/${q})/(1-(${p}/${q})^2)`; sol = R`$\operatorname{tg} 2\alpha = \dfrac{2\operatorname{tg}\alpha}{1 - \operatorname{tg}^2\alpha}$, itt $\operatorname{tg}\alpha = \dfrac{${p}}{${q}}$, ezért $\operatorname{tg} 2\alpha = ${tex}$`; }
    if (mode === 'tg2' && q * q === p * p) { return null; }
    var nm = { sin2: R`\sin 2\alpha`, cos2: R`\cos 2\alpha`, tg2: R`\operatorname{tg} 2\alpha` }[mode];
    var given = mode === 'tg2' ? R`$\operatorname{tg}\alpha = ${K.q(p, q)}$` : R`$\sin\alpha = ${K.q(p, c)}$`;
    return {
      q: R`Az $\alpha$ hegyesszögre ${given}. Mennyi $${nm}$ értéke? (Törtet is megadhatsz.)`,
      answer: { type: 'num', value: val }, ansTex: tex, verify: vf,
      tip1: R`Használd a kétszeres szög képletét; ehhez kell a $\cos\alpha$ is.`,
      tip2: mode === 'tg2' ? R`Itt csak a tangens kell a képletbe.` : R`$\cos\alpha = \sqrt{1 - \sin^2\alpha} = ${K.q(q, c)}$ (hegyesszögnél pozitív).`,
      sol: [mode === 'tg2' ? R`A kétszeres szög tangensének képletébe a megadott tangens kerül.` : R`$\cos\alpha = \sqrt{1 - \sin^2\alpha} = \sqrt{1 - \dfrac{${p * p}}{${c * c}}} = ${K.q(q, c)}$, mert hegyesszögnél a koszinusz pozitív.`, sol]
    };
  });

  def('g2-trig-4', 'geometria', 'trigonometria', 2, 'Szinusztétel: oldal két szögből és egy oldalból', function (r) {
    var al = r.pick([30, 45, 60, 120]), be = r.pick([30, 45, 60, 135]), a = r.int(4, 20);
    if (al + be >= 180 || al === be) { be = 45; if (al === 45) be = 60; }
    var b = a * Math.sin(rad(be)) / Math.sin(rad(al)), v = r2(b);
    return {
      q: R`Egy háromszögben $a = ${a}$ cm, $\alpha = ${al}^\circ$ és $\beta = ${be}^\circ$. Mekkora a $b$ oldal? Két tizedesre kerekítve, cm-ben add meg.`,
      answer: { type: 'num', value: v, tol: 0.0051 }, ansTex: K.T(v, 2) + R`\ \text{cm}`,
      verify: `${a}*sin(${be}*pi/180)/sin(${al}*pi/180)`,
      tip1: R`Szinusztétel: $\dfrac{a}{\sin\alpha} = \dfrac{b}{\sin\beta}$.`,
      tip2: R`$b = \dfrac{a\sin\beta}{\sin\alpha}$; a szögek szinuszát a nevezetes értékekből vagy számológéppel kapod.`,
      sol: [R`Szinusztétel: $\dfrac{b}{\sin\beta} = \dfrac{a}{\sin\alpha}$.`, R`$b = \dfrac{${a} \cdot \sin ${be}^\circ}{\sin ${al}^\circ} \approx \dfrac{${a} \cdot ${K.T(Math.sin(rad(be)), 4)}}{${K.T(Math.sin(rad(al)), 4)}} \approx ${K.T(v, 2)}$`, R`Válasz: $b \approx ${K.T(v, 2)}$ cm.`]
    };
  });

  def('g2-trig-5', 'geometria', 'trigonometria', 2, 'Koszinusztétel: szög három oldalból', function (r) {
    var a, b, c, t = 0;
    do { a = r.int(3, 12); b = r.int(3, 12); c = r.int(3, 12); t++; } while ((a + b <= c || a + c <= b || b + c <= a) && t < 100);
    if (a + b <= c) { a = 6; b = 7; c = 8; }
    var num = a * a + b * b - c * c, den = 2 * a * b;
    return {
      q: R`Egy háromszög oldalai $a = ${a}$, $b = ${b}$ és $c = ${c}$. Mennyi a $c$ oldallal szemközti $\gamma$ szög koszinusza? (Törtet is megadhatsz.)`,
      answer: { type: 'num', value: num / den }, ansTex: K.q(num, den),
      verify: `(${a}^2+${b}^2-${c}^2)/(2*${a}*${b})`,
      tip1: R`Koszinusztétel: $c^2 = a^2 + b^2 - 2ab\cos\gamma$; rendezd át $\cos\gamma$-ra.`,
      tip2: R`$\cos\gamma = \dfrac{a^2 + b^2 - c^2}{2ab}$.`,
      sol: [R`A $c^2 = a^2 + b^2 - 2ab\cos\gamma$ egyenletből $\cos\gamma = \dfrac{a^2 + b^2 - c^2}{2ab}$.`, R`$\cos\gamma = \dfrac{${a * a} + ${b * b} - ${c * c}}{2 \cdot ${a} \cdot ${b}} = \dfrac{${num}}{${den}} = ${K.q(num, den)}$`, num < 0 ? R`A koszinusz negatív, ezért $\gamma$ tompaszög.` : R`A koszinusz pozitív, ezért $\gamma$ hegyesszög.`]
    };
  });

  def('g2-trig-6', 'geometria', 'trigonometria', 3, 'Kétértelmű eset: a nagyobbik harmadik oldal', function (r) {
    var al = r.pick([30, 45, 60]), b = r.int(8, 20), s = Math.sin(rad(al)), a, t = 0;
    do { a = r.int(Math.floor(b * s) + 1, b - 1); t++; } while (!(a > b * s + 0.05 && a < b) && t < 50);
    if (!(a > b * s && a < b)) { a = b - 1; }
    var D = a * a - b * b * s * s, c1 = b * Math.cos(rad(al)) + Math.sqrt(D), c2 = b * Math.cos(rad(al)) - Math.sqrt(D), v = r2(c1);
    var sb = b * s / a, be1 = Math.asin(sb) * 180 / Math.PI, be2 = 180 - be1;
    var cc = { 30: R`\dfrac{\sqrt{3}}{2}`, 45: R`\dfrac{\sqrt{2}}{2}`, 60: R`\dfrac{1}{2}` }[al];
    return {
      q: R`Egy $ABC$ háromszögben $BC = a = ${a}$ cm, $CA = b = ${b}$ cm, az $A$ csúcsnál lévő szög $\alpha = ${al}^\circ$. Két ilyen háromszög van. Mekkora a hosszabbik lehetséges $AB = c$ oldal? Két tizedesre kerekítve, cm-ben add meg.`,
      answer: { type: 'num', value: v, tol: 0.0051 }, ansTex: K.T(v, 2) + R`\ \text{cm}`,
      verify: `${b}*cos(${al}*pi/180)+sqrt(${a}^2-(${b}*sin(${al}*pi/180))^2)`,
      tip1: R`Írd fel a koszinusztételt az $a$ oldalra; $c$-re másodfokú egyenletet kapsz, aminek két pozitív gyöke van.`,
      tip2: R`$a^2 = b^2 + c^2 - 2bc\cos\alpha$, ebből $c = b\cos\alpha \pm \sqrt{a^2 - b^2\sin^2\alpha}$. A nagyobbik gyök kell.`,
      sol: [R`Mivel $${K.T(b * s, 2)} \approx b\sin\alpha < a < b$, két háromszög van (szinusztétellel: $\sin\beta = ${K.T(sb, 3)}$, $\beta_1 \approx ${K.T(be1, 1)}^\circ$ és $\beta_2 \approx ${K.T(be2, 1)}^\circ$).`, R`Koszinusztétel: $${a * a} = ${b * b} + c^2 - 2 \cdot ${b} \cdot ${cc} \cdot c$, ebből $c = ${b}\cos ${al}^\circ \pm \sqrt{${a * a} - ${b * b}\sin^2 ${al}^\circ}$.`, R`$c_{1,2} \approx ${K.T(b * Math.cos(rad(al)), 3)} \pm ${K.T(Math.sqrt(D), 3)}$, vagyis $c_1 \approx ${K.T(c1, 2)}$ és $c_2 \approx ${K.T(c2, 2)}$.`, R`Mindkettő pozitív, a hosszabbik $c \approx ${K.T(v, 2)}$ cm.`]
    };
  });

  def('g2-trig-7', 'geometria', 'trigonometria', 1, 'Szögfüggvények előjele forgásszögnél', function (r) {
    var d = r.int(1, 35) * 10; if (d % 90 === 0) d += 10;
    var ss = Math.sin(rad(d)) > 0, cs = Math.cos(rad(d)) > 0;
    function txt(sp, cp) { return R`$\sin\alpha ${sp ? '>' : '<'} 0$ és $\cos\alpha ${cp ? '>' : '<'} 0$`; }
    var correct = txt(ss, cs), wrong = [txt(!ss, cs), txt(ss, !cs), txt(!ss, !cs)];
    var qn = d < 90 ? 'I.' : d < 180 ? 'II.' : d < 270 ? 'III.' : 'IV.';
    return {
      q: R`Melyik állítás igaz az $\alpha = ${d}^\circ$ forgásszögre?`,
      answer: K.choice(r, correct, wrong), ansTex: R`\text{${qn} negyed}`,
      tip1: R`Melyik negyedben van a(z) $${d}^\circ$-os forgásszög végpontja az egységkörön?`,
      tip2: R`A szinusz a pont magassága (második koordináta), a koszinusz a vízszintes (első) koordinátája.`,
      sol: [R`A $${d}^\circ$ a(z) ${qn} negyedbe esik.`, R`Itt a végpont második koordinátája ${ss ? 'pozitív' : 'negatív'}, az első koordinátája ${cs ? 'pozitív' : 'negatív'}, azaz ${correct}.`]
    };
  });

  def('g2-trig-8', 'geometria', 'trigonometria', 3, 'Addíciós összefüggés két hegyesszöggel', function (r) {
    var t1 = r.pick(TRI), t2 = r.pick(TRI), g = 0;
    while (t2 === t1 && g++ < 20) t2 = r.pick(TRI);
    var p1 = t1[0], q1 = t1[1], c1 = t1[2], p2 = t2[0], q2 = t2[1], c2 = t2[2], mode = r.int(0, 1), num, nm, vf, sol;
    if (mode === 0) { num = p1 * q2 + q1 * p2; nm = R`\sin(\alpha + \beta)`; vf = `(${p1}/${c1})*sqrt(1-(${p2}/${c2})^2)+sqrt(1-(${p1}/${c1})^2)*(${p2}/${c2})`; sol = R`$\sin(\alpha + \beta) = \sin\alpha\cos\beta + \cos\alpha\sin\beta = \dfrac{${p1}}{${c1}} \cdot \dfrac{${q2}}{${c2}} + \dfrac{${q1}}{${c1}} \cdot \dfrac{${p2}}{${c2}} = \dfrac{${num}}{${c1 * c2}}$`; }
    else { num = q1 * q2 - p1 * p2; nm = R`\cos(\alpha + \beta)`; vf = `sqrt(1-(${p1}/${c1})^2)*sqrt(1-(${p2}/${c2})^2)-(${p1}/${c1})*(${p2}/${c2})`; sol = R`$\cos(\alpha + \beta) = \cos\alpha\cos\beta - \sin\alpha\sin\beta = \dfrac{${q1}}{${c1}} \cdot \dfrac{${q2}}{${c2}} - \dfrac{${p1}}{${c1}} \cdot \dfrac{${p2}}{${c2}} = \dfrac{${num}}{${c1 * c2}}$`; }
    var den = c1 * c2;
    return {
      q: R`Az $\alpha$ és a $\beta$ hegyesszög, $\sin\alpha = ${K.q(p1, c1)}$ és $\sin\beta = ${K.q(p2, c2)}$. Mennyi $${nm}$ értéke? (Törtet is megadhatsz.)`,
      answer: { type: 'num', value: num / den }, ansTex: K.q(num, den), verify: vf,
      tip1: R`Az addíciós képlethez mind a négy érték kell: $\sin$ és $\cos$ mindkét szögre.`,
      tip2: R`Hegyesszögnél $\cos = \sqrt{1 - \sin^2}$, így $\cos\alpha = ${K.q(q1, c1)}$ és $\cos\beta = ${K.q(q2, c2)}$.`,
      sol: [R`$\cos\alpha = ${K.q(q1, c1)}$ és $\cos\beta = ${K.q(q2, c2)}$ (hegyesszögek, pozitív gyök).`, sol, R`Egyszerűsítve: $${K.q(num, den)}$.`]
    };
  });

  /* ================================================================== */
  /* 4.6 Koordinátageometria                                             */
  /* ================================================================== */
  function addT(n) { return n === 0 ? '' : (n > 0 ? ' + ' + n : ' - ' + (-n)); }
  function lineTex(A, B, C) {
    var s = (A === 1 ? '' : A === -1 ? '-' : A) + 'x';
    if (B !== 0) s += (B < 0 ? ' - ' : ' + ') + (Math.abs(B) === 1 ? '' : Math.abs(B)) + 'y';
    return s + ' = ' + C;
  }
  function wp(t) { return t.charAt(0) === '-' ? '(' + t + ')' : t; }
  function circTex(u, v, rr) { return '(x' + addT(-u) + ')^2 + (y' + addT(-v) + ')^2 = ' + rr; }
  var P5 = [[3, 4], [4, 3], [5, 0], [0, 5]];       /* 5 sugarú egységnyi rácspontok (x, y) */
  function circPts(k) {
    var out = [];
    P5.forEach(function (p) {
      [[1, 1], [1, -1], [-1, 1], [-1, -1]].forEach(function (sg) {
        var q = [p[0] * sg[0] * k, p[1] * sg[1] * k];
        if (!out.some(function (o) { return o[0] === q[0] && o[1] === q[1]; })) out.push(q);
      });
    });
    return out;
  }

  MO.content['geometria/koordgeo'] = {
    intro: R`A koordinátageometria a síkidomok tulajdonságait számolással vizsgálja: a pontoknak koordinátapárt, az egyeneseknek, köröknek és parabolának egyenletet feleltet meg. Így a geometriai kérdések (távolság, metszéspont, érintő, hajlásszög) egyenletek megoldására vezethetők vissza. Más témákkal (másodfokú egyenlet, vektorok, trigonometria) is gyakran összekapcsolódik. A követelmény (4.6) pontok és vektorok, egyenes, kör és emelt szinten parabola kérdéseit tartalmazza; emelten több tételt le is kell vezetni.`,
    theory: [
      { h: 'Pontok és vektorok koordinátái, távolság',
        b: R`A síkban a pont helyét két koordináta adja: $A(x_1; y_1)$. Az $A$ pontból a $B(x_2; y_2)$ pontba mutató vektor koordinátái a végpont és a kezdőpont koordinátáinak különbsége:\n$$\overrightarrow{AB} = (x_2 - x_1;\ y_2 - y_1).$$\nA vektor abszolútértéke (hossza) a két pont **távolsága**; a Pitagorasz-tételből adódik:\n$$AB = |\overrightarrow{AB}| = \sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}.$$\nVektorok összege, különbsége, skalárral szorzata koordinátánként számolható: $(a_1; a_2) + (b_1; b_2) = (a_1 + b_1;\ a_2 + b_2)$, $\lambda\cdot(a_1; a_2) = (\lambda a_1;\ \lambda a_2)$.\nPélda: $A(1; 2)$, $B(4; 6)$: $\overrightarrow{AB} = (3; 4)$, $AB = \sqrt{9 + 16} = 5$.` },
      { h: 'Felezőpont, osztópontok, háromszög súlypontja',
        b: R`Az $A(x_1; y_1)$ és $B(x_2; y_2)$ pontokkal határolt szakasz **felezőpontja**:\n$$F\left(\dfrac{x_1 + x_2}{2};\ \dfrac{y_1 + y_2}{2}\right).$$\nA szakasz **harmadolópontjai** (az $A$-hoz közelebbi $H_1$ és a $B$-hez közelebbi $H_2$): $H_1\left(\dfrac{2x_1 + x_2}{3};\ \dfrac{2y_1 + y_2}{3}\right)$, $H_2\left(\dfrac{x_1 + 2x_2}{3};\ \dfrac{y_1 + 2y_2}{3}\right)$.\nÁltalában, ha a $P$ pont az $AB$ szakaszt $AP : PB = m : n$ arányban osztja, akkor $P\left(\dfrac{n x_1 + m x_2}{m + n};\ \dfrac{n y_1 + m y_2}{m + n}\right)$.\nAz $A$, $B$, $C$ csúcsú háromszög **súlypontja**:\n$$S\left(\dfrac{x_1 + x_2 + x_3}{3};\ \dfrac{y_1 + y_2 + y_3}{3}\right).$$\nA súlypont a súlyvonalakat a csúcstól számítva $2 : 1$ arányban osztja.\nPélda: $A(-2; 1)$, $B(4; 7)$: $F(1; 4)$; $H_1(0; 3)$, $H_2(2; 5)$.`,
        proof: R`Felezőpont: a $B$-be mutató $\overrightarrow{AB}$ vektor fele az $A$-ból az $F$-be mutató vektor, így $F = A + \tfrac{1}{2}\overrightarrow{AB} = \left(x_1 + \tfrac{x_2 - x_1}{2};\ y_1 + \tfrac{y_2 - y_1}{2}\right) = \left(\tfrac{x_1 + x_2}{2};\ \tfrac{y_1 + y_2}{2}\right)$. Harmadolópontok: $H_1 = A + \tfrac{1}{3}\overrightarrow{AB} = \left(\tfrac{2x_1 + x_2}{3};\ \dots\right)$ és $H_2 = A + \tfrac{2}{3}\overrightarrow{AB} = \left(\tfrac{x_1 + 2x_2}{3};\ \dots\right)$. Súlypont: legyen $F$ az $AB$ oldal felezőpontja. A súlypont a $CF$ súlyvonalat a $C$-től $2 : 1$ arányban osztja, így $S = C + \tfrac{2}{3}\overrightarrow{CF}$, azaz $x_S = x_3 + \tfrac{2}{3}\left(\tfrac{x_1 + x_2}{2} - x_3\right) = \tfrac{x_1 + x_2 + x_3}{3}$; az $y$ koordinátára ugyanígy.` },
      { h: 'Az egyenes egyenletei',
        b: R`**Nem függőleges** egyenes: $y = mx + b$, ahol $m$ a **meredekség** ($m = \operatorname{tg}\varphi$, $\varphi$ az $x$ tengely pozitív irányával bezárt szög), $b$ az $y$ tengelymetszet. **Függőleges** egyenes: $x = c$.\nMás kiindulási adatokból:\n- **ponton és meredekségen át:** $y - y_0 = m(x - x_0)$;\n- **két ponton át** ($P_1(x_1; y_1)$, $P_2(x_2; y_2)$, $x_1 \neq x_2$): $m = \dfrac{y_2 - y_1}{x_2 - x_1}$, majd $y - y_1 = m(x - x_1)$;\n- **normálvektoros alak:** ha az egyenes egy pontja $P_0(x_0; y_0)$ és egy normálvektora (merőleges vektora) $\mathbf{n}(A; B)$, akkor $Ax + By = Ax_0 + By_0$;\n- **irányvektoros alak:** ha az irányvektor $\mathbf{v}(v_1; v_2)$, akkor a normálvektor $(v_2; -v_1)$ (vagy a $-1$-szerese), és az egyenlet $v_2 x - v_1 y = v_2 x_0 - v_1 y_0$;\n- **paraméteres alak:** $x = x_0 + v_1 t$, $y = y_0 + v_2 t$ ($t \in \mathbb{R}$).\nAz $Ax + By = C$ általános alakból a meredekség $m = -\dfrac{A}{B}$ ($B \neq 0$).\nPélda: az $A(1; 2)$, $B(5; -4)$ ponton átmenő egyenes meredeksége $\dfrac{-4 - 2}{5 - 1} = -\dfrac{3}{2}$, egyenlete $y - 2 = -\dfrac{3}{2}(x - 1)$, azaz $3x + 2y = 7$.`,
        proof: R`Normálvektoros alak levezetése: egy $P(x; y)$ pont akkor és csak akkor van az egyenesen, ha a $\overrightarrow{P_0P} = (x - x_0;\ y - y_0)$ vektor merőleges a $\mathbf{n}(A; B)$ normálvektorra, azaz a skaláris szorzatuk nulla: $A(x - x_0) + B(y - y_0) = 0$, vagyis $Ax + By = Ax_0 + By_0$. A két ponton átmenő egyenlet: az irányvektor $\overrightarrow{P_1P_2} = (x_2 - x_1;\ y_2 - y_1)$, ennek egy normálvektora $(y_2 - y_1;\ -(x_2 - x_1))$, így $(y_2 - y_1)(x - x_1) - (x_2 - x_1)(y - y_1) = 0$, amiből $y - y_1 = \dfrac{y_2 - y_1}{x_2 - x_1}(x - x_1)$.` },
      { h: 'Párhuzamosság, merőlegesség, hajlásszög, metszéspont',
        b: R`Két egyenes $y = m_1x + b_1$ és $y = m_2x + b_2$:\n- **párhuzamos**, ha $m_1 = m_2$ (és $b_1 \neq b_2$; ha $b_1 = b_2$ is, egybeesnek);\n- **merőleges**, ha $m_1 \cdot m_2 = -1$ (a függőleges egyenesre a vízszintes merőleges).\nNormálvektorokkal ($\mathbf{n}_1(A_1; B_1)$, $\mathbf{n}_2(A_2; B_2)$): párhuzamos, ha a normálvektorok egymás skalárszorosai, merőleges, ha $A_1A_2 + B_1B_2 = 0$ (a skaláris szorzat nulla). Egy vektor $90^\circ$-os elforgatottja (pozitív irányban): $(a; b) \to (-b; a)$.\n**Hajlásszög:** két egyenes hajlásszöge a $0^\circ$ és $90^\circ$ közötti szög:\n$$\operatorname{tg}\varphi = \left|\dfrac{m_1 - m_2}{1 + m_1m_2}\right| \ (m_1m_2 \neq -1), \qquad \cos\varphi = \dfrac{|\mathbf{n}_1 \cdot \mathbf{n}_2|}{|\mathbf{n}_1|\,|\mathbf{n}_2|}.$$\nA tangensképlet az $m = \operatorname{tg}\varphi_i$ és a $\operatorname{tg}(\varphi_1 - \varphi_2)$ addíciós képletből jön.\n**Metszéspont:** a két egyenes egyenletéből álló egyenletrendszer megoldása (behelyettesítés vagy egyenlő együtthatók módszere). Egy megoldás: metszők; nincs megoldás: párhuzamosak; végtelen sok: egybeesnek.\nPélda: $2x - 3y = 16$ merőleges egyenese $3x + 2y = c$ alakú, mert $2 \cdot 3 + (-3) \cdot 2 = 0$.` },
      { h: 'A kör egyenlete',
        b: R`A **kör** azon pontok halmaza a síkban, amelyek egy adott ponttól (a középponttól) adott távolságra (a sugárra) vannak. A $K(u; v)$ középpontú, $r$ sugarú kör egyenlete:\n$$(x - u)^2 + (y - v)^2 = r^2.$$\nSpeciálisan az origó középpontú körre $x^2 + y^2 = r^2$.\nPélda: a $K(3; -2)$ középpontú, $5$ sugarú kör: $(x - 3)^2 + (y + 2)^2 = 25$. A $P(6; 2)$ pont rajta van a körön, mert $3^2 + 4^2 = 25$; a $Q(1; 1)$ pont belül van ($2^2 + 3^2 = 13 < 25$).\nA pont helyzete a körhöz képest: ha a pontot behelyettesítve a bal oldal $r^2$-nél kisebb, a pont **belül**, ha egyenlő, **rajta**, ha nagyobb, **kívül** van a körön.`,
        proof: R`Egy $P(x; y)$ pont akkor és csak akkor van a körön, ha a középponttól mért távolsága $r$, azaz $KP = r$. A távolságképlet szerint $KP = \sqrt{(x - u)^2 + (y - v)^2}$. Mindkét oldal nemnegatív, ezért négyzetre emelve ekvivalens átalakítást kapunk: $(x - u)^2 + (y - v)^2 = r^2$.` },
      { h: 'Kétismeretlenes másodfokú egyenlet és a kör', level: 'emelt',
        b: R`Ha a kör egyenletét felbontjuk, $x^2 + y^2 + Ax + By + C = 0$ alakot kapunk, ahol $A = -2u$, $B = -2v$, $C = u^2 + v^2 - r^2$. Fordítva: egy ilyen egyenlet teljes négyzetté alakítással rendezhető:\n$$\left(x + \dfrac{A}{2}\right)^2 + \left(y + \dfrac{B}{2}\right)^2 = \dfrac{A^2}{4} + \dfrac{B^2}{4} - C.$$\nA jobb oldal $r^2$. Ha $\dfrac{A^2 + B^2}{4} - C > 0$, az egyenlet **kör** egyenlete, középpontja $K\left(-\dfrac{A}{2}; -\dfrac{B}{2}\right)$, sugara $r = \sqrt{\dfrac{A^2 + B^2}{4} - C}$. Ha a jobb oldal $0$, az egyenlet egyetlen pontot (a $K$ pontot) határozza meg, ha negatív, nincs valós megoldása (üres halmaz).\nFelismerés: az $x^2$ és az $y^2$ együtthatója egyenlő (célszerűen $1$-re osztunk), és nincs $xy$-os tag.\nPélda: $x^2 + y^2 - 6x + 4y - 12 = 0$: $(x - 3)^2 - 9 + (y + 2)^2 - 4 - 12 = 0$, azaz $(x - 3)^2 + (y + 2)^2 = 25$; $K(3; -2)$, $r = 5$.` },
      { h: 'Kör és egyenes, érintő', level: 'emelt',
        b: R`**Kör és egyenes metszéspontjai:** az egyenes egyenletéből kifejezzük az egyik ismeretlent (pl. $y = mx + b$), behelyettesítjük a kör egyenletébe, és a kapott **másodfokú egyenlet** gyökei adják a metszéspontok $x$ koordinátáit; majd visszahelyettesítünk az egyenes egyenletébe. A diszkrimináns dönt: $D > 0$: két közös pont (**szelő**); $D = 0$: egy közös pont (**érintő**); $D < 0$: nincs közös pont. Azonos eredményt ad: az egyenes és a középpont $d$ távolságát $r$-rel összehasonlítani ($d < r$, $d = r$, $d > r$).\n**Érintő egyenlete:** ha a $P_0(x_0; y_0)$ pont rajta van a körön, a körhöz $P_0$-ban húzott érintő egyenlete\n$$(x_0 - u)(x - u) + (y_0 - v)(y - v) = r^2.$$\nAz érintő merőleges a $KP_0$ sugárra, ezért a normálvektora $\overrightarrow{KP_0} = (x_0 - u;\ y_0 - v)$.\nKülső pontból két érintő húzható, az érintési szakaszok egyenlő hosszúak, és hosszuk $\sqrt{d^2 - r^2}$ ($d$ a pont és a középpont távolsága).\n**Két kör kölcsönös helyzete:** a középpontok távolsága $d$, a sugarak $r_1 \geq r_2$. $d > r_1 + r_2$: nincs közös pont, kívül vannak; $d = r_1 + r_2$: kívülről érintik egymást; $r_1 - r_2 < d < r_1 + r_2$: két metszéspont; $d = r_1 - r_2$: belülről érintik egymást; $d < r_1 - r_2$: az egyik a másikban van. A metszéspontokat úgy kapjuk, hogy a két egyenletet kivonjuk egymásból (az $x^2$ és $y^2$ tagok kiesnek): ez a közös húr egyenesének egyenlete; ezt a körbe helyettesítjük.`,
        proof: R`Az érintő merőleges az érintési pontba húzott sugárra (ezt a kör érintőjének tulajdonságaként ismerjük). Így a $P(x; y)$ pont akkor és csak akkor van az érintőn, ha $\overrightarrow{P_0P} \perp \overrightarrow{KP_0}$, azaz a skaláris szorzatuk $0$: $(x_0 - u)(x - x_0) + (y_0 - v)(y - y_0) = 0$. Ezt átalakítva: $(x_0 - u)\big((x - u) - (x_0 - u)\big) + (y_0 - v)\big((y - v) - (y_0 - v)\big) = 0$, azaz $(x_0 - u)(x - u) + (y_0 - v)(y - v) = (x_0 - u)^2 + (y_0 - v)^2 = r^2$, mert $P_0$ a körön van.` },
      { h: 'A parabola', level: 'emelt',
        b: R`A **parabola** azon pontok halmaza a síkban, amelyek egy adott ponttól (a $F$ fókuszponttól) és egy adott egyenestől (a $d$ vezéregyenestől, $F \notin d$) egyenlő távolságra vannak. A csúcspont az origóban, a tengely az $y$ tengely, a fókusz $F\left(0; \dfrac{p}{2}\right)$, a vezéregyenes $y = -\dfrac{p}{2}$ esetén az egyenlet\n$$x^2 = 2py \quad (p \neq 0).$$\n$|p|$ a fókusz és a vezéregyenes távolsága; $p > 0$: felfelé, $p < 0$: lefelé nyílik. Az $y = ax^2$ alak ugyanez: $a = \dfrac{1}{2p}$.\n**Eltolt parabola** (tengelye az $y$ tengellyel párhuzamos): csúcsa $C(u; v)$, egyenlete $(x - u)^2 = 2p(y - v)$. Az $y = ax^2 + bx + c$ másodfokú függvény grafikonja is ilyen parabola: teljes négyzetté alakítva $y = a(x - u)^2 + v$.\n**Parabola és egyenes:** a közös pontokat egyenletrendszerrel keressük; a másodfokú egyenlet diszkriminánsa dönt (két, egy vagy nulla közös pont). Az $y$ tengellyel párhuzamos egyenes a parabolát mindig pontosan egy pontban metszi (de az nem érintő).\n**Kiegészítés** (nem követelmény): az $x^2 = 2py$ parabola $P_0(x_0; y_0)$ pontbeli érintője $x_0x = p(y + y_0)$.`,
        proof: R`Egy $P(x; y)$ pont a fókuszponttól $PF = \sqrt{x^2 + \left(y - \tfrac{p}{2}\right)^2}$, a vezéregyenestől $\left|y + \tfrac{p}{2}\right|$ távolságra van. A parabola definíciója szerint ezek egyenlők; négyzetre emelve: $x^2 + y^2 - py + \tfrac{p^2}{4} = y^2 + py + \tfrac{p^2}{4}$, amiből $x^2 = 2py$.` }
    ],
    examples: [
      { t: 'Háromszög adatai koordinátákból',
        p: R`Az $ABC$ háromszög csúcsai: $A(-2; 1)$, $B(6; -3)$, $C(2; 8)$. Add meg az $\overrightarrow{AB}$ vektor koordinátáit és hosszát, az $AB$ oldal $F$ felezőpontját és a háromszög $S$ súlypontját! Igazold, hogy az $S$ a $CF$ súlyvonalat a $C$-től számítva $2 : 1$ arányban osztja!`,
        steps: [R`Ábra: koordináta-rendszerben az $A$ a második negyedben közel az origóhoz, a $B$ a negyedik negyedben, a $C$ az első negyedben magasan.`, R`$\overrightarrow{AB} = (6 - (-2);\ -3 - 1) = (8; -4)$, hossza $|\overrightarrow{AB}| = \sqrt{8^2 + (-4)^2} = \sqrt{80} = 4\sqrt{5} \approx 8{,}94$.`, R`Felezőpont: $F\left(\dfrac{-2 + 6}{2};\ \dfrac{1 + (-3)}{2}\right) = F(2; -1)$.`, R`Súlypont: $S\left(\dfrac{-2 + 6 + 2}{3};\ \dfrac{1 - 3 + 8}{3}\right) = S(2; 2)$.`, R`Ellenőrzés: $\overrightarrow{CS} = (0; -6)$, $\overrightarrow{SF} = (0; -3)$, így $\overrightarrow{CS} = 2\,\overrightarrow{SF}$; az $S$ valóban a $CF$ szakasz $C$-hez közelebbi harmadolópontja.`],
        ans: R`$\overrightarrow{AB} = (8; -4)$, $AB = 4\sqrt{5}$; $F(2; -1)$; $S(2; 2)$; $CS : SF = 2 : 1$.`,
        checks: [['6-(-2)', '8'], ['-3-1', '-4'], ['sqrt(8^2+(-4)^2)', '4*sqrt(5)'], ['(-2+6)/2', '2'], ['(1+(-3))/2', '-1'], ['(-2+6+2)/3', '2'], ['(1-3+8)/3', '2'], ['sqrt(0^2+6^2)/sqrt(0^2+3^2)', '2']] },
      { t: 'Egyenes, merőleges egyenes, metszéspont, hajlásszög',
        p: R`Az $f$ egyenes egyenlete $2x - 3y = 16$. a) Írd fel a $P(3; 1)$ ponton átmenő, $f$-re merőleges $e$ egyenes egyenletét! b) Számítsd ki $e$ és $f$ metszéspontját! c) Mekkora szöget zár be az $y = 2x + 1$ és az $y = -3x + 4$ egyenes?`,
        steps: [R`a) $f$ normálvektora $(2; -3)$, így iránya a $(3; 2)$ vektor. Az $e$ merőleges $f$-re, tehát az $f$ irányvektora az $e$ normálvektora: $e$ normálvektora $(3; 2)$. A $P$ ponton át: $3x + 2y = 3 \cdot 3 + 2 \cdot 1 = 11$.`, R`Ellenőrzés: $f$ meredeksége $\dfrac{2}{3}$, $e$ meredeksége $-\dfrac{3}{2}$, a szorzatuk $-1$.`, R`b) A $3x + 2y = 11$ és $2x - 3y = 16$ rendszert oldjuk meg. Az elsőt $3$-mal, a másodikat $2$-vel szorozva: $9x + 6y = 33$ és $4x - 6y = 32$. Összeadva $13x = 65$, így $x = 5$, és $y = \dfrac{11 - 15}{2} = -2$. A metszéspont $M(5; -2)$.`, R`Ellenőrzés: $2 \cdot 5 - 3 \cdot (-2) = 16$ és $3 \cdot 5 + 2 \cdot (-2) = 11$, mindkét egyenletet kielégíti.`, R`c) $m_1 = 2$, $m_2 = -3$, $m_1m_2 = -6 \neq -1$. $\operatorname{tg}\varphi = \left|\dfrac{2 - (-3)}{1 + 2 \cdot (-3)}\right| = \left|\dfrac{5}{-5}\right| = 1$, ezért $\varphi = 45^\circ$.`, R`Ellenőrzés irányvektorokkal: $\mathbf{v}_1(1; 2)$, $\mathbf{v}_2(1; -3)$: $\cos\varphi = \dfrac{|1 - 6|}{\sqrt{5}\sqrt{10}} = \dfrac{5}{\sqrt{50}} = \dfrac{\sqrt{2}}{2}$, ami szintén $45^\circ$.`],
        ans: R`a) $e: 3x + 2y = 11$; b) $M(5; -2)$; c) $\varphi = 45^\circ$.`,
        checks: [['3*3+2*1', '11'], ['(2/3)*(-3/2)', '-1'], ['(33+32)/13', '5'], ['(11-3*5)/2', '-2'], ['abs((2-(-3))/(1+2*(-3)))', '1'], ['abs(1*1+2*(-3))/(sqrt(5)*sqrt(10))', 'sqrt(2)/2']] },
      { t: 'Kör egyenlete és érintője',
        p: R`Adott az $x^2 + y^2 - 6x + 4y - 12 = 0$ egyenlet. a) Igazold, hogy ez kör egyenlete, és add meg a középpontját és a sugarát! b) Igazold, hogy a $P(6; 2)$ pont a körön van! c) Írd fel a körhöz a $P$ pontban húzott érintő egyenletét!`,
        steps: [R`a) Teljes négyzetté alakítás: $(x^2 - 6x + 9) + (y^2 + 4y + 4) = 12 + 9 + 4$, azaz $(x - 3)^2 + (y + 2)^2 = 25$. A jobb oldal pozitív, ezért kör: $K(3; -2)$, $r = 5$.`, R`b) $P$ koordinátáit behelyettesítve: $(6 - 3)^2 + (2 + 2)^2 = 9 + 16 = 25$, tehát a $P$ rajta van a körön.`, R`c) A sugár $\overrightarrow{KP} = (3; 4)$, ez az érintő normálvektora. Az érintő: $3(x - 3) + 4(y + 2) = 25$, rendezve $3x + 4y = 26$.`, R`Ellenőrzés: a $P$ rajta van: $3 \cdot 6 + 4 \cdot 2 = 26$. A középpont távolsága az érintőtől: $\dfrac{|3 \cdot 3 + 4 \cdot (-2) - 26|}{\sqrt{3^2 + 4^2}} = \dfrac{25}{5} = 5 = r$, tehát az egyenes valóban érinti a kört.`],
        ans: R`a) $K(3; -2)$, $r = 5$; b) $(6-3)^2 + (2+2)^2 = 25$; c) az érintő egyenlete $3x + 4y = 26$.`,
        checks: [['(x-3)^2+(y+2)^2-25', 'x^2+y^2-6x+4y-12'], ['(6-3)^2+(2+2)^2', '25'], ['3*(x-3)+4*(y+2)-25', '3x+4y-26'], ['3*6+4*2', '26'], ['abs(3*3+4*(-2)-26)/sqrt(3^2+4^2)', '5']] },
      { t: 'Kör és egyenes metszéspontjai, érintők (emelt, II. rész)',
        p: R`Adott a $k$ kör: $(x - 3)^2 + (y + 2)^2 = 25$ és az $e$ egyenes: $y = x - 6$. a) Számítsd ki a kör és az egyenes metszéspontjait! b) Írd fel a körhöz ezekben a pontokban húzott érintők egyenletét! c) Számítsd ki a két érintő metszéspontját, és igazold, hogy ez a pont a két érintési ponttól egyenlő távolságra van!`,
        steps: [R`Ábra: a $K(3; -2)$ középpontú, $5$ sugarú kör; az $e$ egyenes meredeksége $1$, az $y$ tengelyt a $-6$-nál metszi, és a kört két pontban vágja.`, R`a) Behelyettesítés: $(x - 3)^2 + (x - 6 + 2)^2 = 25$, azaz $(x - 3)^2 + (x - 4)^2 = 25$. Kifejtve $2x^2 - 14x + 25 = 25$, vagyis $2x^2 - 14x = 0$, tehát $2x(x - 7) = 0$. Így $x = 0$ vagy $x = 7$; az egyenesből $y = -6$, illetve $y = 1$. A metszéspontok: $A(0; -6)$ és $B(7; 1)$. A diszkrimináns pozitív volt, így két metszéspont van.`, R`Ellenőrzés a körre: $(0 - 3)^2 + (-6 + 2)^2 = 9 + 16 = 25$ és $(7 - 3)^2 + (1 + 2)^2 = 16 + 9 = 25$.`, R`b) Érintő $A$-ban: $(0 - 3)(x - 3) + (-6 + 2)(y + 2) = 25$, azaz $-3x - 4y = 24$, vagyis $3x + 4y = -24$. Érintő $B$-ben: $(7 - 3)(x - 3) + (1 + 2)(y + 2) = 25$, azaz $4x + 3y = 31$.`, R`c) A két egyenletet kivonva: $(4x + 3y) - (3x + 4y) = 31 + 24$, azaz $x - y = 55$. Behelyettesítve ($x = y + 55$) az elsőbe: $3y + 165 + 4y = -24$, $7y = -189$, $y = -27$, $x = 28$. A metszéspont $M(28; -27)$.`, R`Távolságok: $MA = \sqrt{28^2 + 21^2} = \sqrt{1225} = 35$ és $MB = \sqrt{21^2 + 28^2} = 35$. Egyenlők, ahogy a külső pontból húzott érintőszakaszoknál lennie kell. Ellenőrzés: $KM^2 = 25^2 + 25^2 = 1250$, és $\sqrt{KM^2 - r^2} = \sqrt{1225} = 35$.`],
        ans: R`a) $A(0; -6)$ és $B(7; 1)$; b) $3x + 4y = -24$ és $4x + 3y = 31$; c) $M(28; -27)$, $MA = MB = 35$.`,
        checks: [['(x-3)^2+(x-4)^2-25', '2x^2-14x'], ['2*7^2-14*7', '0'], ['(0-3)^2+(-6+2)^2', '25'], ['(7-3)^2+(1+2)^2', '25'], ['3*28+4*(-27)', '-24'], ['4*28+3*(-27)', '31'], ['sqrt(28^2+21^2)', '35'], ['sqrt(21^2+28^2)', 'sqrt(1225)'], ['sqrt(25^2+25^2-25)', '35']] },
      { t: 'Parabola: egyenlet, fókusz, egyenes (emelt)',
        p: R`Az $x^2 = 2py$ alakú parabola átmegy a $P(4; 2)$ ponton. a) Írd fel a parabola egyenletét! b) Add meg a fókuszpontját és a vezéregyenesét, és igazold, hogy a $P$ pont egyenlő távol van tőlük! c) Hol metszi a parabolát az $y = x$ egyenes? d) Írd fel a parabolához a $P$ pontban húzott érintő egyenletét!`,
        steps: [R`a) $P$ koordinátáit behelyettesítve: $16 = 2p \cdot 2$, ebből $p = 4$. A parabola egyenlete $x^2 = 8y$.`, R`b) Fókusz: $F\left(0; \dfrac{p}{2}\right) = F(0; 2)$, vezéregyenes: $y = -2$. $PF = \sqrt{(4 - 0)^2 + (2 - 2)^2} = 4$, a $P$ és a vezéregyenes távolsága $2 - (-2) = 4$. Egyenlők.`, R`c) $y = x$ behelyettesítve: $x^2 = 8x$, így $x(x - 8) = 0$. A metszéspontok: $(0; 0)$ és $(8; 8)$.`, R`d) A $P$-n átmenő egyenes: $y = mx + b$, ahol $2 = 4m + b$, azaz $b = 2 - 4m$. Behelyettesítve: $x^2 = 8(mx + 2 - 4m)$, azaz $x^2 - 8mx + 32m - 16 = 0$. Az érintésnél a diszkrimináns nulla: $64m^2 - 4(32m - 16) = 64(m - 1)^2 = 0$, így $m = 1$, $b = -2$.`, R`Az érintő egyenlete $y = x - 2$. Ellenőrzés: $x^2 = 8x - 16$, azaz $(x - 4)^2 = 0$, kettős gyök, az egyetlen közös pont a $P$.`],
        ans: R`a) $x^2 = 8y$; b) $F(0; 2)$, $y = -2$, $PF = 4$ és a vezéregyenestől is $4$; c) $(0; 0)$ és $(8; 8)$; d) $y = x - 2$.`,
        checks: [['4^2/(2*2)', '4'], ['sqrt(4^2+(2-2)^2)', '4'], ['2-(-2)', '4'], ['8^2/8', '8'], ['64*m^2-4*(32*m-16)', '64*(m-1)^2'], ['x^2-8*(x-2)', '(x-4)^2']] }
    ],
    sims: ['koordinatageometria', 'vektorok'],
    mistakes: [
      R`A vektor koordinátáit **végpont mínusz kezdőpont** adja: $\overrightarrow{AB} = B - A$, nem $A - B$. A távolságnál az előjel nem számít, de a vektor irányánál igen.`,
      R`A felezőpont koordinátáit nem kell osztani a szakasz hosszával; a koordinátáknak az **átlaga**. A súlypontnál $3$-mal osztunk, nem $2$-vel.`,
      R`Merőleges egyenesek meredekségének szorzata $-1$ (nem $1$, nem $-m$): $m_2 = -\dfrac{1}{m_1}$. Az $Ax + By = C$ alakú egyenesre a merőleges $Bx - Ay = c'$ alakú.`,
      R`A kör egyenletében $(x - u)^2 + (y - v)^2 = r^2$: a jobb oldal **sugár négyzete**, nem a sugár; és a középpont koordinátáinak az előjele ellentétes: $(x + 2)^2$ a $-2$ koordinátát jelenti.`,
      R`Teljes négyzetté alakításnál elfelejtik a hozzáadott tagokat a jobb oldalon is kivonni: $x^2 - 6x = (x - 3)^2 - 9$. Ha a jobb oldal negatív lesz, az egyenlet nem kör egyenlete.`,
      R`Az érintő nem a kör és egy tetszőleges egyenes közös pontja: akkor érintő, ha **pontosan egy** közös pont van (diszkrimináns $0$). Az érintő merőleges az érintési pontba húzott sugárra.`,
      R`Parabolánál az $x^2 = 2py$ egyenletben $p$ a fókusz és a vezéregyenes távolsága, a fókusz $\dfrac{p}{2}$-nél van, nem $p$-nél. Az $y = ax^2$ alakból $p = \dfrac{1}{2a}$.`
    ],
    exam: R`A követelmény (4.6) középszinten a vektor koordinátáinak és abszolútértékének, két pont távolságának, a felezőpont koordinátáinak, az egyenesek $y = mx + b$ és $x = c$ alakú egyenletének, a metszéspont kiszámításának, a meredekséggel megadott egyenesek párhuzamosságának és merőlegességének, valamint a kör (középpont, sugár) egyenletének ismeretét kéri, egyszerű koordinátageometriai feladatokban. Emelt szinten a felezőpont és harmadolópontok, a háromszög súlypontja koordinátáinak igazolása, az egyenes egyenletének többféle alakja és levezetése, a párhuzamosság, merőlegesség és a hajlásszög, a kör egyenletének levezetése és a kétismeretlenes másodfokú egyenlettel való kapcsolata, a kör és egyenes metszéspontja, az érintő egyenlete, két kör kölcsönös helyzete és metszéspontjai, továbbá az $x^2 = 2py$ parabola levezetése és az $y$ tengellyel párhuzamos tengelyű parabolák feladatai szerepelnek.`,
    cheat: [
      R`AB = \sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}`,
      R`F\left(\dfrac{x_1 + x_2}{2};\ \dfrac{y_1 + y_2}{2}\right), \quad S\left(\dfrac{x_1 + x_2 + x_3}{3};\ \dfrac{y_1 + y_2 + y_3}{3}\right)`,
      R`y - y_0 = m(x - x_0), \quad m = \dfrac{y_2 - y_1}{x_2 - x_1}`,
      R`Ax + By = Ax_0 + By_0 \quad (\mathbf{n} = (A; B))`,
      R`e_1 \parallel e_2: m_1 = m_2; \qquad e_1 \perp e_2: m_1 m_2 = -1`,
      R`\operatorname{tg}\varphi = \left|\dfrac{m_1 - m_2}{1 + m_1m_2}\right|`,
      R`(x - u)^2 + (y - v)^2 = r^2`,
      R`(x_0 - u)(x - u) + (y_0 - v)(y - v) = r^2`,
      R`x^2 = 2py, \quad F\left(0; \dfrac{p}{2}\right), \quad y = -\dfrac{p}{2}`
    ],
    cheatChecks: [['(x-u)^2+(y-v)^2', 'x^2+y^2-2ux-2vy+u^2+v^2'], ['(x1+(x2-x1)/2)', '(x1+x2)/2'], ['x3+2/3*((x1+x2)/2-x3)', '(x1+x2+x3)/3'], ['x^2+(y-p/2)^2-(y+p/2)^2', 'x^2-2py']],
    terms: ['vektor koordinátái', 'távolság', 'felezőpont', 'osztópont', 'súlypont', 'meredekség', 'irányvektor', 'normálvektor', 'hajlásszög', 'kör egyenlete', 'érintő', 'szelő', 'parabola', 'fókuszpont', 'vezéregyenes', 'másodfokú egyenlet diszkriminánsa']
  };

  /* ---------- generátorok: koordinátageometria ---------- */
  def('g2-koord-1', 'geometria', 'koordgeo', 1, 'Két pont távolsága', function (r) {
    var t = r.pick([[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [9, 12, 15]]), dx = t[0] * r.pick([-1, 1]), dy = t[1] * r.pick([-1, 1]);
    if (r.int(0, 1)) { var z = dx; dx = dy; dy = z; }
    var x1 = r.int(-6, 6), y1 = r.int(-6, 6), x2 = x1 + dx, y2 = y1 + dy;
    return {
      q: R`Mekkora az $A(${x1}; ${y1})$ és a $B(${x2}; ${y2})$ pont távolsága?`,
      answer: { type: 'num', value: t[2] }, ansTex: K.T(t[2]),
      verify: `sqrt((${x2}-(${x1}))^2+(${y2}-(${y1}))^2)`,
      tip1: R`Vedd a koordináták különbségét, majd használd a Pitagorasz-tételt.`,
      tip2: R`$\Delta x = ${x2} - ${K.par(x1)} = ${dx}$ és $\Delta y = ${y2} - ${K.par(y1)} = ${dy}$.`,
      sol: [R`$\overrightarrow{AB} = (${x2} - ${K.par(x1)};\ ${y2} - ${K.par(y1)}) = (${dx}; ${dy})$.`, R`$AB = \sqrt{${K.par(dx)}^2 + ${K.par(dy)}^2} = \sqrt{${dx * dx + dy * dy}} = ${t[2]}$.`]
    };
  });

  def('g2-koord-2', 'geometria', 'koordgeo', 1, 'Szakasz végpontja a felezőpontból', function (r) {
    var ax = r.int(-8, 8), ay = r.int(-8, 8), fx = r.int(-8, 8), fy = r.int(-8, 8), useX = r.int(0, 1);
    var bx = 2 * fx - ax, by = 2 * fy - ay, val = useX ? bx : by;
    return {
      q: R`Az $AB$ szakasz felezőpontja $F(${fx}; ${fy})$, az egyik végpontja $A(${ax}; ${ay})$. Mennyi a $B$ pont ${useX ? '$x$' : '$y$'} koordinátája?`,
      answer: { type: 'num', value: val }, ansTex: K.T(val),
      verify: useX ? `2*(${fx})-(${ax})` : `2*(${fy})-(${ay})`,
      tip1: R`A felezőpont koordinátái a végpontok koordinátáinak átlagai.`,
      tip2: R`$${useX ? 'f_x = \\dfrac{a_x + b_x}{2}' : 'f_y = \\dfrac{a_y + b_y}{2}'}$, ebből fejezd ki a $B$ koordinátáját.`,
      sol: [useX ? R`$\dfrac{${ax} + b_x}{2} = ${fx}$, ebből $b_x = 2 \cdot ${K.par(fx)} - ${K.par(ax)} = ${bx}$.` : R`$\dfrac{${ay} + b_y}{2} = ${fy}$, ebből $b_y = 2 \cdot ${K.par(fy)} - ${K.par(ay)} = ${by}$.`, R`Tehát $B(${bx}; ${by})$.`]
    };
  });

  def('g2-koord-3', 'geometria', 'koordgeo', 2, 'Háromszög súlypontja', function (r) {
    var sx = r.int(-4, 4), sy = r.int(-4, 4), x1 = r.int(-7, 7), x2 = r.int(-7, 7), y1 = r.int(-7, 7), y2 = r.int(-7, 7);
    var x3 = 3 * sx - x1 - x2, y3 = 3 * sy - y1 - y2, useX = r.int(0, 1);
    return {
      q: R`Az $ABC$ háromszög csúcsai $A(${x1}; ${y1})$, $B(${x2}; ${y2})$ és $C(${x3}; ${y3})$. Mennyi a háromszög $S$ súlypontjának ${useX ? '$x$' : '$y$'} koordinátája?`,
      answer: { type: 'num', value: useX ? sx : sy }, ansTex: K.T(useX ? sx : sy),
      verify: useX ? `(${x1}+(${x2})+(${x3}))/3` : `(${y1}+(${y2})+(${y3}))/3`,
      tip1: R`A súlypont koordinátái a három csúcs megfelelő koordinátáinak átlagai.`,
      tip2: R`Add össze a három ${useX ? '$x$' : '$y$'} koordinátát, és oszd el hárommal.`,
      sol: [useX ? R`$x_S = \dfrac{${x1} + ${K.par(x2)} + ${K.par(x3)}}{3} = \dfrac{${x1 + x2 + x3}}{3} = ${sx}$` : R`$y_S = \dfrac{${y1} + ${K.par(y2)} + ${K.par(y3)}}{3} = \dfrac{${y1 + y2 + y3}}{3} = ${sy}$`, R`A súlypont: $S(${sx}; ${sy})$.`]
    };
  });

  def('g2-koord-4', 'geometria', 'koordgeo', 2, 'Párhuzamos, illetve merőleges egyenes', function (r) {
    var a = r.nz(-5, 5), b = r.nz(-4, 4), c = r.int(-9, 9), px = r.int(-5, 5), py = r.int(-5, 5), perp = r.int(0, 1), num, den;
    var eq = lineTex(a, b, c);
    if (!perp) { num = a * px + b * py; den = b; } else { num = a * py - b * px; den = a; }
    return {
      q: R`Az $f$ egyenes egyenlete $${eq}$. A $P(${px}; ${py})$ ponton átmenő, $f$-re ${perp ? 'merőleges' : 'párhuzamos'} egyenes az $y$ tengelyt hol metszi? Add meg a metszéspont $y$ koordinátáját. (Törtet is megadhatsz.)`,
      answer: { type: 'num', value: num / den }, ansTex: K.q(num, den),
      verify: perp ? `${py}-(${b}/${a})*(${px})` : `${py}+(${a}/${b})*(${px})`,
      tip1: perp ? R`Az $f$ meredeksége $-\dfrac{A}{B}$ alakú ($A$ az $x$, $B$ az $y$ együtthatója); a merőleges egyenes meredeksége ennek a negatív reciproka.` : R`A párhuzamos egyenes meredeksége ugyanaz, mint az $f$-é: $-\dfrac{A}{B}$ ($A$ az $x$, $B$ az $y$ együtthatója).`,
      tip2: R`Az $y - ${K.par(py)} = m(x - ${K.par(px)})$ egyenletbe az $x = 0$ helyettesítéssel kapod az $y$ tengelymetszetet.`,
      sol: [R`$f$ meredeksége $m_f = ${K.q(-a, b)}$.${perp ? ' A merőleges egyenes meredeksége a negatív reciprok: $m = ' + K.q(b, a) + '$ (a szorzatuk $-1$).' : ' A párhuzamos egyenesé ugyanennyi: $m = ' + K.q(-a, b) + '$.'}`, R`$y - ${K.par(py)} = ${wp(perp ? K.q(b, a) : K.q(-a, b))}\,(x - ${K.par(px)})$. Az $x = 0$ helyen $y = ${py} - ${wp(perp ? K.q(b, a) : K.q(-a, b))} \cdot ${K.par(px)} = ${K.q(num, den)}$.`]
    };
  });

  def('g2-koord-5', 'geometria', 'koordgeo', 2, 'Kör középpontja és sugara az egyenletből', function (r) {
    var u = r.nz(-6, 6), v = r.nz(-6, 6), rr = r.int(2, 9), A = -2 * u, B = -2 * v, C = u * u + v * v - rr * rr, mode = r.pick(['r', 'u', 'v']);
    var eq = 'x^2 + y^2' + (A < 0 ? ' - ' : ' + ') + Math.abs(A) + 'x' + (B < 0 ? ' - ' : ' + ') + Math.abs(B) + 'y' + (C === 0 ? '' : (C < 0 ? ' - ' : ' + ') + Math.abs(C)) + ' = 0';
    var what = mode === 'r' ? 'sugara' : mode === 'u' ? 'középpontjának $x$ koordinátája' : 'középpontjának $y$ koordinátája';
    var val = mode === 'r' ? rr : mode === 'u' ? u : v;
    return {
      q: R`Az $${eq}$ egyenlet egy kör egyenlete. Mekkora a kör ${what}?`,
      answer: { type: 'num', value: val }, ansTex: K.T(val),
      verify: mode === 'r' ? `sqrt((${A})^2/4+(${B})^2/4-(${C}))` : mode === 'u' ? `-(${A})/2` : `-(${B})/2`,
      tip1: R`Alakítsd teljes négyzetté az $x$-es és az $y$-os tagokat külön-külön.`,
      tip2: R`$x^2 ${A < 0 ? '-' : '+'} ${Math.abs(A)}x = (x ${A < 0 ? '-' : '+'} ${Math.abs(A / 2)})^2 - ${A * A / 4}$, hasonlóan az $y$-ra.`,
      sol: [R`$(x${addT(-u)})^2 - ${u * u} + (y${addT(-v)})^2 - ${v * v} ${C === 0 ? '' : (C < 0 ? '- ' : '+ ') + Math.abs(C)} = 0$`, R`Rendezve: $(x${addT(-u)})^2 + (y${addT(-v)})^2 = ${rr * rr}$, tehát $K(${u}; ${v})$, $r = ${rr}$.`, R`A keresett érték: $${K.T(val)}$.`]
    };
  });

  def('g2-koord-6', 'geometria', 'koordgeo', 3, 'Kör és egyenes: a húr hossza', function (r) {
    var k = r.pick([1, 2]), pts = circPts(k), u = r.int(-4, 4), v = r.int(-4, 4), rr = 5 * k;
    var i = r.int(0, pts.length - 1), j = r.int(0, pts.length - 1), g = 0;
    while (j === i && g++ < 30) j = r.int(0, pts.length - 1);
    if (j === i) j = (i + 1) % pts.length;
    var p1 = pts[i], p2 = pts[j], dx = p2[0] - p1[0], dy = p2[1] - p1[1], gg = MO.gcd(Math.abs(dx), Math.abs(dy));
    var A = dy / gg, B = -dx / gg;
    if (A < 0 || (A === 0 && B < 0)) { A = -A; B = -B; }
    var x1 = u + p1[0], y1 = v + p1[1], C = A * x1 + B * y1, ch = Math.sqrt(dx * dx + dy * dy), vv = r2(ch);
    var x2 = u + p2[0], y2 = v + p2[1], lt = A === 0 ? (B === 1 ? '' : B) + 'y = ' + C : lineTex(A, B, C);
    return {
      q: R`Adott a $k$ kör: $${circTex(u, v, rr * rr)}$ és az $e$ egyenes: $${lt}$. Az egyenes két pontban metszi a kört. Mekkora a két metszéspont távolsága? Két tizedesre kerekítve add meg.`,
      answer: { type: 'num', value: vv, tol: 0.0051 }, ansTex: K.T(vv, 2),
      verify: `2*sqrt(${rr}^2-(abs((${A})*(${u})+(${B})*(${v})-(${C}))/sqrt((${A})^2+(${B})^2))^2)`,
      tip1: R`Keresd meg a metszéspontokat: fejezd ki az egyik ismeretlent az egyenesből, helyettesítsd a kör egyenletébe. Vagy: a középpont egyenestől mért távolságából Pitagorasz-tétellel a húr fele.`,
      tip2: R`A középpont $K(${u}; ${v})$, a sugár $${rr}$. A másodfokú egyenlet két gyöke adja a metszéspontok koordinátáit; ezek rácspontok.`,
      sol: [R`A kör középpontja $K(${u}; ${v})$, sugara $r = \sqrt{${rr * rr}} = ${rr}$.`, R`Az egyenesen lévő pont koordinátáit a kör egyenletébe helyettesítve másodfokú egyenletet kapunk, amelynek két gyöke a két metszéspont megfelelő koordinátája; a metszéspontok: $P_1(${x1}; ${y1})$ és $P_2(${x2}; ${y2})$ (mindkettő kielégíti a kör és az egyenes egyenletét is).`, R`$P_1P_2 = \sqrt{(${x2} - ${K.par(x1)})^2 + (${y2} - ${K.par(y1)})^2} = \sqrt{${dx * dx} + ${dy * dy}} = \sqrt{${dx * dx + dy * dy}} \approx ${K.T(vv, 2)}$.`]
    };
  });

  def('g2-koord-7', 'geometria', 'koordgeo', 2, 'Parabola: távolság a fókusztól', function (r) {
    var p = r.int(1, 6), t = r.int(1, 3), x0 = 2 * p * t * r.pick([-1, 1]), y0 = 2 * p * t * t, val = y0 + p / 2;
    return {
      q: R`Az $x^2 = 2py$ egyenletű ($p > 0$) parabola átmegy a $P(${x0}; ${y0})$ ponton. Mekkora a $P$ pont távolsága a parabola fókuszpontjától?`,
      answer: { type: 'num', value: val }, ansTex: K.T(val),
      verify: `${y0}+(${x0})^2/(4*${y0})`,
      tip1: R`Előbb határozd meg $p$ értékét a $P$ koordinátáinak behelyettesítésével. A fókusz $F\left(0; \dfrac{p}{2}\right)$.`,
      tip2: R`A parabola pontja a fókusztól és a vezéregyenestől ($y = -\dfrac{p}{2}$) egyenlő távolságra van; a vezéregyenestől mért távolság $y_0 + \dfrac{p}{2}$.`,
      sol: [R`$${x0 * x0} = 2p \cdot ${y0}$, ebből $p = ${p}$.`, R`A fókusz $F(0; ${K.T(p / 2)})$, a vezéregyenes $y = -${K.T(p / 2)}$.`, R`$PF$ = a $P$ távolsága a vezéregyenestől $= ${y0} + ${K.T(p / 2)} = ${K.T(val)}$. Ellenőrzés: $PF = \sqrt{${x0 * x0} + (${y0} - ${K.T(p / 2)})^2} = ${K.T(val)}$.`]
    };
  });

  def('g2-koord-8', 'geometria', 'koordgeo', 3, 'Két érintő metszéspontja a kör külső pontjából', function (r) {
    var k = r.pick([1, 2]), pts = circPts(k), u = r.int(-4, 4), v = r.int(-4, 4), rr = 5 * k, t = 0, i, j, p1, p2, sx, sy;
    do { i = r.int(0, pts.length - 1); j = r.int(0, pts.length - 1); p1 = pts[i]; p2 = pts[j]; sx = p1[0] + p2[0]; sy = p1[1] + p2[1]; t++; } while ((i === j || (sx === 0 && sy === 0)) && t < 100);
    if (i === j || (sx === 0 && sy === 0)) { p1 = pts[0]; p2 = pts[1]; sx = p1[0] + p2[0]; sy = p1[1] + p2[1]; }
    var a1 = p1[0], b1 = p1[1], a2 = p2[0], b2 = p2[1], det = a1 * b2 - a2 * b1;
    /* érintők: a1*X + b1*Y = r^2, a2*X + b2*Y = r^2 (az (u,v) középpontú eltolás nélkül) */
    var X = rr * rr * (b2 - b1) / det, Y = rr * rr * (a1 - a2) / det, d = Math.sqrt(X * X + Y * Y), vv = r2(d);
    var x1 = u + a1, y1 = v + b1, x2 = u + a2, y2 = v + b2;
    return {
      q: R`Adott a $k$ kör: $${circTex(u, v, rr * rr)}$. Az $A(${x1}; ${y1})$ és a $B(${x2}; ${y2})$ pont a körön van. A körhöz $A$-ban és $B$-ben húzott érintők az $M$ pontban metszik egymást. Mekkora az $M$ pont távolsága a kör középpontjától? Két tizedesre kerekítve add meg.`,
      answer: { type: 'num', value: vv, tol: 0.0051 }, ansTex: K.T(vv, 2),
      verify: `${rr * rr}/sqrt((((${x1})+(${x2}))/2-(${u}))^2+(((${y1})+(${y2}))/2-(${v}))^2)`,
      tip1: R`Írd fel mindkét érintő egyenletét a $(x_0 - u)(x - u) + (y_0 - v)(y - v) = r^2$ képlettel, majd old meg az egyenletrendszert.`,
      tip2: R`A középpont $K(${u}; ${v})$, $r^2 = ${rr * rr}$. Az érintők: $${K.T(a1)}(x${addT(-u)}) + ${K.par(b1)}(y${addT(-v)}) = ${rr * rr}$ és $${K.T(a2)}(x${addT(-u)}) + ${K.par(b2)}(y${addT(-v)}) = ${rr * rr}$.`,
      sol: [R`Az érintők egyenlete az $X = x - ${K.par(u)}$, $Y = y - ${K.par(v)}$ jelöléssel: $${K.T(a1)}X + ${K.par(b1)}Y = ${rr * rr}$ és $${K.T(a2)}X + ${K.par(b2)}Y = ${rr * rr}$.`, R`A rendszer megoldása: $X = ${K.T(X, 3)}$, $Y = ${K.T(Y, 3)}$ (ez az $M$ koordinátái a középponthoz képest).`, R`$KM = \sqrt{X^2 + Y^2} \approx ${K.T(vv, 2)}$. (Ellenőrzés: $KM = \dfrac{r^2}{KF}$, ahol $F$ az $AB$ húr felezőpontja.)`]
    };
  });

  /* ================================================================== */
  /* 4.7 Kerület, terület                                                */
  /* ================================================================== */
  var HERON = [[3, 4, 5], [5, 12, 13], [13, 14, 15], [9, 10, 17], [10, 13, 13], [8, 15, 17], [7, 15, 20], [6, 25, 29], [17, 25, 28], [11, 13, 20]];
  function heronS(t) { return (t[0] + t[1] + t[2]) / 2; }
  function heronT(t) { var s = heronS(t); return Math.round(Math.sqrt(s * (s - t[0]) * (s - t[1]) * (s - t[2]))); }

  MO.content['geometria/keruletterulet'] = {
    intro: R`A kerület a síkidom határvonalának hossza, a terület a síkidom „nagysága”, azt mutatja meg, hány egységnégyzet fedi le. Az érettségi feladatok ezeket az adatokat számoltatják háromszögekre, négyszögekre, szabályos sokszögekre, a körre és részeire, és az eredményt más témakörökkel (trigonometria, koordinátageometria, szélsőérték) is összekapcsolhatják. A követelmény (4.7) közép- és emelt szinten is számon kéri a képleteket; emelt szinten a háromszög területképleteit, az $s \cdot r$ képletet, a négyszögek és szabályos sokszögek területképleteit bizonyítani is kell, a Héron-képletet pedig ismerni és alkalmazni.`,
    theory: [
      { h: 'Kerület és terület, mértékegységek',
        b: R`A **kerület** a síkidom határának hossza (cm, m, km), a **terület** a síkidom által lefedett rész nagysága (cm², m², ha, km²). Szemléletesen: a területet az egységnégyzetekkel való lefedés méri; az egybevágó síkidomok területe és kerülete egyenlő, a területet az átdarabolás nem változtatja.\nÁtváltások: $1\ \mathrm{m^2} = 10^4\ \mathrm{cm^2}$, $1\ \mathrm{ha} = 10^4\ \mathrm{m^2}$, $1\ \mathrm{km^2} = 100\ \mathrm{ha}$. Figyelj: a hosszúság átváltása $10$-es szorzó, a területé $10^2 = 100$-as (pl. $1\ \mathrm{m} = 100\ \mathrm{cm}$, de $1\ \mathrm{m^2} = 10\,000\ \mathrm{cm^2}$).\nA terület nem határozza meg a kerületet és fordítva: ugyanakkora területű téglalapok kerülete különböző lehet ($4 \times 9$ és $6 \times 6$: terület $36$, kerület $26$, illetve $24$).` },
      { h: 'A háromszög területe: $\\frac{a m}{2}$ és $\\frac{ab\\sin\\gamma}{2}$',
        b: R`Egy háromszög területe az egyik oldal és a hozzá tartozó magasság szorzatának fele:\n$$t = \dfrac{a \cdot m_a}{2} = \dfrac{b \cdot m_b}{2} = \dfrac{c \cdot m_c}{2}.$$\nHa két oldalt és a közbezárt szöget ismerjük:\n$$t = \dfrac{ab\sin\gamma}{2} = \dfrac{bc\sin\alpha}{2} = \dfrac{ac\sin\beta}{2}.$$\nSpeciális háromszögek: derékszögű háromszög ($a$, $b$ befogók): $t = \dfrac{ab}{2}$; szabályos háromszög (oldal $a$): $t = \dfrac{a^2\sqrt{3}}{4}$, magassága $m = \dfrac{a\sqrt{3}}{2}$.\nPélda: $a = 8$, $b = 5$, $\gamma = 30^\circ$: $t = \dfrac{8 \cdot 5 \cdot \frac{1}{2}}{2} = 10$.\nMegjegyzés: a $\sin\gamma$-t tompaszögnél is használhatjuk, mert $\sin(180^\circ - \gamma) = \sin\gamma > 0$.`,
        proof: R`Az $a$ oldalra állított $m_a$ magasság két derékszögű háromszögre bontja az $ABC$ háromszöget (hegyesszögeknél; ha az egyik szög tompa, a magasság talppontja az oldal meghosszabbításán van, és a két derékszögű háromszög területét kivonjuk). Minden derékszögű háromszög egy téglalap fele (a téglalapot az átlója két egybevágó háromszögre vágja). A két téglalap együtt $a \times m_a$ méretű, így $t = \dfrac{a \cdot m_a}{2}$. A trigonometrikus képlet: a $b$ oldalhoz tartozó szöggel $m_a = b\sin\gamma$ (az $m_a$, $b$ és az $a$ egyenesén lévő szakasz derékszögű háromszöget alkot, $\gamma$ az $m_a$-val szemközti szög), így $t = \dfrac{a \cdot b\sin\gamma}{2}$.` },
      { h: 'A háromszög területe: $t = s \\cdot r$',
        b: R`Ha a háromszög beírt körének sugara $r$, félkerülete $s = \dfrac{a + b + c}{2}$, akkor\n$$t = s \cdot r.$$\nEbből a beírt kör sugara: $r = \dfrac{t}{s}$. A beírt kör középpontja a belső szögfelezők metszéspontja, a kör az oldalakat érinti.\nPélda: $a = 13$, $b = 14$, $c = 15$: $s = 21$, $t = 84$ esetén $r = \dfrac{84}{21} = 4$.\nAz $s \cdot r$ képlet minden **érintősokszögre** is igaz (olyan sokszögre, amelynek van beírt köre): $t = s \cdot r$, ahol $s$ a félkerület.`,
        proof: R`Legyen $O$ a beírt kör középpontja. Az $O$ és a háromszög csúcsai három háromszögre bontják az $ABC$ háromszöget: $OBC$, $OCA$ és $OAB$. Mindháromnak a magassága a beírt kör $r$ sugara (a sugár merőleges az érintő oldalra), az alapjuk $a$, $b$, illetve $c$. Területük összege $t = \dfrac{a r}{2} + \dfrac{b r}{2} + \dfrac{c r}{2} = \dfrac{a + b + c}{2} \cdot r = s \cdot r$.` },
      { h: 'Héron-képlet',
        b: R`Ha a háromszög három oldala $a$, $b$, $c$, a félkerülete $s = \dfrac{a + b + c}{2}$, akkor\n$$t = \sqrt{s(s - a)(s - b)(s - c)}.$$\nHasználd, ha három oldal adott és a szögeket nem ismered. Együtt a $t = s\cdot r$ képlettel: $r = \sqrt{\dfrac{(s - a)(s - b)(s - c)}{s}}$.\nPélda: $a = 13$, $b = 14$, $c = 15$: $s = 21$, $t = \sqrt{21 \cdot 8 \cdot 7 \cdot 6} = \sqrt{7056} = 84$.\n**Kiegészítés** (nem követelmény): a köré írt kör sugara $R = \dfrac{abc}{4t}$ (a szinusztételből: $\sin\gamma = \dfrac{c}{2R}$, behelyettesítve $t = \dfrac{ab\sin\gamma}{2}$-be).`,
        proof: R`(Kiegészítés, a követelmény nem kéri a bizonyítást.) A koszinusztétellel $\cos\gamma = \dfrac{a^2 + b^2 - c^2}{2ab}$. Ezért $16t^2 = 4a^2b^2\sin^2\gamma = 4a^2b^2 - (a^2 + b^2 - c^2)^2 = \big(2ab - a^2 - b^2 + c^2\big)\big(2ab + a^2 + b^2 - c^2\big) = \big(c^2 - (a - b)^2\big)\big((a + b)^2 - c^2\big)$, ami szorzattá bontva $(c - a + b)(c + a - b)(a + b - c)(a + b + c) = 16\,s(s - a)(s - b)(s - c)$.` },
      { h: 'Négyszögek területe és kerülete',
        b: R`Jelölések: $a$, $b$ oldalak, $m$ magasság, $e$, $f$ átlók.\n- **téglalap:** $t = ab$, $k = 2(a + b)$; **négyzet:** $t = a^2$, $k = 4a$.\n- **paralelogramma:** $t = a \cdot m_a = ab\sin\alpha$, $k = 2(a + b)$.\n- **rombusz:** $t = a \cdot m = a^2\sin\alpha = \dfrac{e f}{2}$, $k = 4a$; az átlók merőlegesek és felezik egymást, így $a^2 = \left(\dfrac{e}{2}\right)^2 + \left(\dfrac{f}{2}\right)^2$.\n- **deltoid:** $t = \dfrac{e f}{2}$ (az átlók merőlegesek).\n- **trapéz** (párhuzamos oldalak $a$ és $c$, magasság $m$): $t = \dfrac{a + c}{2} \cdot m$; a középvonal hossza $\dfrac{a + c}{2}$.\nÁltalában: egy konvex négyszög területe felbontható két háromszögre egy átlóval; a nem nevezetes négyszögeknél ezt használjuk.`,
        proof: R`Téglalap: a területe $ab$ (az egységnégyzetekkel lefedve, definíció szerint). Paralelogramma: a magasságvonalak által levágott derékszögű háromszöget az átellenes oldalhoz illesztve $a \times m$-es téglalapot kapunk, így $t = a \cdot m$, és $m = b\sin\alpha$. Trapéz: az egyik átló két háromszögre bontja; az egyiknek az alapja $a$, a másiké $c$, a magasságuk is $m$, így $t = \dfrac{am}{2} + \dfrac{cm}{2} = \dfrac{a + c}{2}m$. Rombusz és deltoid: az $e$ átló a négyszöget két háromszögre bontja, amelyeknek az alapja $e$, magasságaik összege $f$ (mert $f \perp e$), így $t = \dfrac{e \cdot m_1}{2} + \dfrac{e \cdot m_2}{2} = \dfrac{e f}{2}$.` },
      { h: 'Szabályos sokszögek',
        b: R`A szabályos $n$-szög oldalai és szögei egyenlők; van beírt és köré írt köre, közös $O$ középponttal. Az $O$ a sokszöget $n$ egybevágó, egyenlő szárú háromszögre bontja, amelyek szára $R$ (a köré írt kör sugara), alapja $a$, csúcsánál a szög $\dfrac{360^\circ}{n}$, magasságuk a beírt kör sugara $r$ (az **apotéma**).\n$$t = n \cdot \dfrac{a \cdot r}{2} = \dfrac{n}{2}R^2 \sin\dfrac{360^\circ}{n}, \qquad k = n a.$$\nA belső szög $\dfrac{(n - 2) \cdot 180^\circ}{n}$; $a = 2R\sin\dfrac{180^\circ}{n}$, $r = R\cos\dfrac{180^\circ}{n}$.\nNevezetes esetek: szabályos háromszög $t = \dfrac{a^2\sqrt{3}}{4}$; négyzet $t = a^2$; szabályos hatszög (oldal $a = R$): $t = 6 \cdot \dfrac{a^2\sqrt{3}}{4} = \dfrac{3\sqrt{3}}{2}a^2$.`,
        proof: R`A $\dfrac{360^\circ}{n}$ középponti szögű, $R$ szárú háromszög területe $\dfrac{1}{2}R^2\sin\dfrac{360^\circ}{n}$ (két oldal és a közbezárt szög). Ebből az $n$ háromszög összege $t = \dfrac{n}{2}R^2\sin\dfrac{360^\circ}{n}$. Ugyanezt az alap és a magasság szorzatával is felírhatjuk: egy háromszög területe $\dfrac{a \cdot r}{2}$, így $t = n \cdot \dfrac{ar}{2} = \dfrac{k \cdot r}{2}$, ami a szabályos sokszög $s\cdot r$ képlete. Hatszögnél a középponti szög $60^\circ$, a háromszögek szabályosak, $a = R$.` },
      { h: 'A kör és részei',
        b: R`Kör (sugár $r$): kerület $k = 2\pi r$, terület $t = \pi r^2$.\n**Körív és körcikk.** Egy $\alpha$ középponti szöghöz tartozó körív hossza és a körcikk területe arányos a szöggel:\n$$i = 2\pi r \cdot \dfrac{\alpha}{360^\circ}, \qquad t_{\text{cikk}} = \pi r^2 \cdot \dfrac{\alpha}{360^\circ}.$$\nRadiánban mérve ($\alpha$ rad, **emelt**): $i = r\alpha$, $t_{\text{cikk}} = \dfrac{r^2\alpha}{2} = \dfrac{i\cdot r}{2}$.\n**Körszelet** (a húr és az ív közti rész): a körcikk és a középponti háromszög területének különbsége:\n$$t_{\text{szelet}} = \dfrac{r^2}{2}\left(\alpha - \sin\alpha\right) \quad (\alpha \text{ radiánban}),$$\nahol $\alpha < 180^\circ$ esetén a háromszöget levonjuk (és $\alpha > 180^\circ$ esetén a $\sin\alpha$ negatív, így hozzáadódik).\n**Körgyűrű** ($R$ külső, $r$ belső sugár): $t = \pi(R^2 - r^2)$, kerülete $2\pi(R + r)$.\nPélda: $r = 6$, $\alpha = 120^\circ = \dfrac{2\pi}{3}$: $i = 4\pi$, $t_{\text{cikk}} = 12\pi$, $t_{\text{szelet}} = 18\left(\dfrac{2\pi}{3} - \dfrac{\sqrt{3}}{2}\right) = 12\pi - 9\sqrt{3}$.` },
      { h: 'Hasonló síkidomok',
        b: R`Ha két síkidom hasonló, és a hasonlóság aránya $k$ (a megfelelő szakaszok arányai), akkor a **kerületek** aránya $k$, a **területek** aránya $k^2$:\n$$\dfrac{K'}{K} = k, \qquad \dfrac{T'}{T} = k^2.$$\nPélda: ha egy háromszög oldalait $3$-szorosára növeljük, a kerülete $3$-szorosa, a területe $9$-szerese lesz.\nA gyakorlatban: egy háromszög egyik oldalával párhuzamos szakasz a háromszögből hozzá hasonló kisebb háromszöget vág le; a területek aránya a megfelelő oldalak arányának négyzete. Ha a területek aránya $\dfrac{p}{q}$, a hasonlóság aránya $\sqrt{\dfrac{p}{q}}$.` },
      { h: 'Beírt és köré írt körök, összetett síkidomok',
        b: R`**Derékszögű háromszög** (befogók $a$, $b$, átfogó $c$): köré írt kör sugara $R = \dfrac{c}{2}$ (Thalész-tétel), beírt kör sugara $r = \dfrac{a + b - c}{2}$.\n**Szabályos háromszög** (oldal $a$): $R = \dfrac{a\sqrt{3}}{3}$, $r = \dfrac{a\sqrt{3}}{6}$, tehát $R = 2r$.\n**Téglalap**: köré írt kör sugara az átló fele. **Érintőnégyszög**: a szemközti oldalak összege egyenlő ($a + c = b + d$), és $t = s \cdot r$. **Húrnégyszög**: a szemközti szögek összege $180^\circ$.\n**Összetett síkidomok** területét felbontással vagy kivonással kapjuk: pl. egy körbe írt sokszögön kívüli rész = körterület $-$ sokszögterület; a körgyűrű, a körszelet, a „holdacska” mind két terület különbsége. Mindig rajzold le (vagy írd le szavakkal) az ábrát, és ellenőrizd, hogy a kapott terület nagyságrendileg elfér-e a síkidomban.` }
    ],
    examples: [
      { t: 'Háromszög három oldalból: Héron, beírt kör, magasság, szög',
        p: R`Egy háromszög oldalai $13$ cm, $14$ cm és $15$ cm. Számítsd ki a háromszög területét, a beírt körének sugarát, a $14$ cm-es oldalhoz tartozó magasságát és a legnagyobb szögét (tizedre kerekítve)!`,
        steps: [R`Félkerület: $s = \dfrac{13 + 14 + 15}{2} = 21$ cm.`, R`Héron-képlet: $t = \sqrt{21 \cdot (21 - 13)(21 - 14)(21 - 15)} = \sqrt{21 \cdot 8 \cdot 7 \cdot 6} = \sqrt{7056} = 84$ cm$^2$.`, R`A beírt kör sugara a $t = s \cdot r$ képletből: $r = \dfrac{84}{21} = 4$ cm.`, R`A $14$ cm-es oldalhoz tartozó magasság: $t = \dfrac{14 \cdot m}{2}$, ezért $m = \dfrac{2 \cdot 84}{14} = 12$ cm.`, R`A legnagyobb szög a $15$ cm-es oldallal szemközt van: koszinusztétellel $\cos\gamma = \dfrac{13^2 + 14^2 - 15^2}{2 \cdot 13 \cdot 14} = \dfrac{140}{364} = \dfrac{5}{13}$, ezért $\gamma \approx 67{,}4^\circ$.`, R`Ellenőrzés: $\sin\gamma = \sqrt{1 - \dfrac{25}{169}} = \dfrac{12}{13}$, és $t = \dfrac{13 \cdot 14 \cdot \frac{12}{13}}{2} = 84$, ugyanaz, mint a Héron-képlettel.`],
        ans: R`$t = 84\ \mathrm{cm^2}$, $r = 4$ cm, $m_{14} = 12$ cm, a legnagyobb szög $\approx 67{,}4^\circ$.`,
        checks: [['(13+14+15)/2', '21'], ['sqrt(21*8*7*6)', '84'], ['84/21', '4'], ['2*84/14', '12'], ['(13^2+14^2-15^2)/(2*13*14)', '5/13'], ['sqrt(1-(5/13)^2)', '12/13'], ['0,5*13*14*(12/13)', '84']] },
      { t: 'Egyenlő szárú trapéz',
        p: R`Egy egyenlő szárú trapéz alapjai $14$ cm és $6$ cm, szárai $5$ cm hosszúak. Számítsd ki a trapéz magasságát, területét, kerületét és az átlóját! (Ábra: a hosszabb alap alul, a rövidebb felül, a szárak szimmetrikusan dőlnek.)`,
        steps: [R`A rövidebb alap két végpontjából merőlegest állítunk a hosszabb alapra. A két derékszögű háromszög vízszintes befogói egyenlők: $\dfrac{14 - 6}{2} = 4$ cm, az átfogójuk a szár ($5$ cm).`, R`Pitagorasz-tétel: $m = \sqrt{5^2 - 4^2} = 3$ cm.`, R`Terület: $t = \dfrac{14 + 6}{2} \cdot 3 = 30$ cm$^2$.`, R`Kerület: $k = 14 + 6 + 5 + 5 = 30$ cm.`, R`Az átló: a hosszabb alapon a magasság talppontja a közelebbi csúcstól $4$ cm-re van, tehát az átló vízszintes vetülete $4 + 6 = 10$ cm, a függőleges $3$ cm. $e = \sqrt{10^2 + 3^2} = \sqrt{109} \approx 10{,}44$ cm.`, R`Ellenőrzés: az átlóval két háromszögre bontva: $\dfrac{14 \cdot 3}{2} + \dfrac{6 \cdot 3}{2} = 21 + 9 = 30$, ugyanaz.`],
        ans: R`$m = 3$ cm, $t = 30\ \mathrm{cm^2}$, $k = 30$ cm, $e = \sqrt{109} \approx 10{,}44$ cm.`,
        checks: [['(14-6)/2', '4'], ['sqrt(5^2-4^2)', '3'], ['(14+6)/2*3', '30'], ['14+6+5+5', '30'], ['sqrt(10^2+3^2)', 'sqrt(109)'], ['14*3/2+6*3/2', '30']] },
      { t: 'Körcikk és körszelet radiánban',
        p: R`Egy kör sugara $6$ cm. Egy $120^\circ$-os középponti szöghöz tartozó ív hosszát, a körcikk területét és a körszelet (az ív és a húr által határolt rész) területét számítsd ki pontosan és tizedre kerekítve!`,
        steps: [R`A szög radiánban: $120^\circ = \dfrac{2\pi}{3}$. Ívhossz: $i = r\alpha = 6 \cdot \dfrac{2\pi}{3} = 4\pi \approx 12{,}57$ cm.`, R`Körcikk: $t_{\text{cikk}} = \dfrac{r^2\alpha}{2} = \dfrac{36 \cdot \frac{2\pi}{3}}{2} = 12\pi \approx 37{,}70\ \mathrm{cm^2}$. (Ellenőrzés: a teljes kör területének $\dfrac{120}{360} = \dfrac{1}{3}$-a: $\dfrac{36\pi}{3} = 12\pi$.)`, R`A két sugár és a húr egyenlő szárú háromszöget alkot, amelynek a területe $\dfrac{1}{2}r^2\sin\alpha = \dfrac{1}{2} \cdot 36 \cdot \dfrac{\sqrt{3}}{2} = 9\sqrt{3} \approx 15{,}59\ \mathrm{cm^2}$.`, R`Körszelet = körcikk $-$ háromszög: $12\pi - 9\sqrt{3} \approx 37{,}70 - 15{,}59 = 22{,}11\ \mathrm{cm^2}$. (A képlettel: $\dfrac{r^2}{2}(\alpha - \sin\alpha) = 18\left(\dfrac{2\pi}{3} - \dfrac{\sqrt{3}}{2}\right)$, ugyanez.)`],
        ans: R`$i = 4\pi \approx 12{,}57$ cm, $t_{\text{cikk}} = 12\pi \approx 37{,}70\ \mathrm{cm^2}$, $t_{\text{szelet}} = 12\pi - 9\sqrt{3} \approx 22{,}11\ \mathrm{cm^2}$.`,
        checks: [['6*2*pi/3', '4*pi'], ['6^2*(2*pi/3)/2', '12*pi'], ['36*pi/3', '12*pi'], ['1/2*6^2*sin(2*pi/3)', '9*sqrt(3)'], ['6^2/2*(2*pi/3-sin(2*pi/3))', '12*pi-9*sqrt(3)']] },
      { t: 'Körbe írt szabályos háromszög és hatszög (emelt, II. rész)',
        p: R`Egy $10$ cm sugarú körbe szabályos háromszöget és szabályos hatszöget írunk. a) Számítsd ki a két sokszög területét! b) Mekkora a hatszög és a háromszög területének aránya? c) Mekkora a terület a körnek a hatszögön kívül eső részének? (Ábra: a kör középpontja $O$; a hatszög csúcsai a körön, az $O$ pontot a csúcsokkal összekötve hat szabályos háromszög keletkezik; a háromszög csúcsai a hatszög minden második csúcsa.)`,
        steps: [R`a) Hatszög: $6$ szabályos háromszög, oldaluk $R = 10$, területük egyenként $\dfrac{10^2\sqrt{3}}{4} = 25\sqrt{3}$. Így $t_6 = 6 \cdot 25\sqrt{3} = 150\sqrt{3} \approx 259{,}81\ \mathrm{cm^2}$.`, R`A szabályos háromszöget az $O$ pont $3$ egyenlő szárú háromszögre bontja: száruk $10$, a szárak szöge $120^\circ$. Egy ilyen háromszög területe $\dfrac{1}{2} \cdot 10 \cdot 10 \cdot \sin 120^\circ = 25\sqrt{3}$, tehát $t_3 = 3 \cdot 25\sqrt{3} = 75\sqrt{3} \approx 129{,}90\ \mathrm{cm^2}$.`, R`Ellenőrzés: a háromszög oldala a szinusztételből $a = 2R\sin 60^\circ = 10\sqrt{3}$, területe $\dfrac{(10\sqrt{3})^2\sqrt{3}}{4} = \dfrac{300\sqrt{3}}{4} = 75\sqrt{3}$, valóban.`, R`b) $\dfrac{t_6}{t_3} = \dfrac{150\sqrt{3}}{75\sqrt{3}} = 2$: a hatszög területe a háromszög kétszerese.`, R`c) A kör területe $t_k = 100\pi \approx 314{,}16\ \mathrm{cm^2}$. A hatszögön kívüli rész: $100\pi - 150\sqrt{3} \approx 314{,}16 - 259{,}81 = 54{,}35\ \mathrm{cm^2}$.`],
        ans: R`a) $t_6 = 150\sqrt{3} \approx 259{,}81\ \mathrm{cm^2}$, $t_3 = 75\sqrt{3} \approx 129{,}90\ \mathrm{cm^2}$; b) $2 : 1$; c) $100\pi - 150\sqrt{3} \approx 54{,}35\ \mathrm{cm^2}$.`,
        checks: [['10^2*sqrt(3)/4', '25*sqrt(3)'], ['6*25*sqrt(3)', '150*sqrt(3)'], ['1/2*10*10*sin(2*pi/3)', '25*sqrt(3)'], ['3*25*sqrt(3)', '75*sqrt(3)'], ['sqrt(3)/4*(10*sqrt(3))^2', '75*sqrt(3)'], ['150*sqrt(3)/(75*sqrt(3))', '2']] },
      { t: 'Hasonló háromszögek területe',
        p: R`Az $ABC$ háromszög területe $45\ \mathrm{cm^2}$, kerülete $36$ cm. Az $AB$ oldallal párhuzamos $DE$ szakasz ($D$ a $CA$, $E$ a $CB$ oldalon van) levágja a $CDE$ háromszöget, amelynek területe $20\ \mathrm{cm^2}$. Milyen arányban osztja a $D$ pont a $CA$ szakaszt? Mekkora a $CDE$ háromszög kerülete és az $ABED$ trapéz területe?`,
        steps: [R`A $DE \parallel AB$ miatt a $CDE$ és a $CAB$ háromszög szögei egyenlők (egyállású szögek), tehát hasonlók. A hasonlóság aránya $k$, ahol a területek aránya $k^2$.`, R`$k^2 = \dfrac{20}{45} = \dfrac{4}{9}$, ezért $k = \dfrac{2}{3}$.`, R`$k = \dfrac{CD}{CA} = \dfrac{2}{3}$, ezért $CD : DA = 2 : 1$.`, R`A kerületek aránya $k$: $K_{CDE} = \dfrac{2}{3} \cdot 36 = 24$ cm.`, R`A trapéz területe: $45 - 20 = 25\ \mathrm{cm^2}$.`, R`Ellenőrzés: $45 \cdot \left(\dfrac{2}{3}\right)^2 = 45 \cdot \dfrac{4}{9} = 20$, ahogy az adat mondta.`],
        ans: R`$CD : DA = 2 : 1$, a $CDE$ háromszög kerülete $24$ cm, az $ABED$ trapéz területe $25\ \mathrm{cm^2}$.`,
        checks: [['sqrt(20/45)', '2/3'], ['2/3*36', '24'], ['45-20', '25'], ['45*(2/3)^2', '20']] }
    ],
    sims: ['haromszog', 'kor-szogek'],
    mistakes: [
      R`A háromszög területénél a magasság **merőleges** a megfelelő oldalra, nem a szomszédos oldal. Ne a szárat helyettesítsd magasságként; tompaszögű háromszögnél a magasság a háromszögön kívül van.`,
      R`A trigonometrikus területképletben a szög a két ismert oldal **által közbezárt** szög: $\dfrac{ab\sin\gamma}{2}$. Ha a szög nem a két oldal között van, előbb számold ki a közbezárt szöget (vagy használj másik képletet).`,
      R`Héron-képletnél az $s$ a **fél**kerület: $s = \dfrac{a + b + c}{2}$, és gyök alatt négy tényező szorzata áll; elfelejtik az $s$-et önmagában, vagy a $\dfrac{1}{2}$-et.`,
      R`A körcikknél és a körívnél a szöget fokban $\dfrac{\alpha}{360^\circ}$-ként, radiánban az $\dfrac{r^2\alpha}{2}$ és $r\alpha$ képletbe kell tenni. Fokot ne írj a radiános képletbe!`,
      R`A hasonlóságnál a területek aránya a hasonlóság arányának **négyzete**: ha a hossz $2$-szeres, a terület $4$-szeres (nem $2$-szeres). Fordítva: $\dfrac{T'}{T} = 9$ esetén $k = 3$ (nem $9$).`,
      R`Mértékegység: cm$^2$-ről m$^2$-re $10\,000$-rel kell osztani, nem $100$-zal. A kerület és a terület mértékegysége különbözik, ne keverd őket.`,
      R`Trapéznél a középvonal $\dfrac{a + c}{2}$, a terület ezt szorozza a magassággal; a szárat nem szabad magasságnak venni (kivéve derékszögű trapéznél a derékszögű szárat). A rombusz területe $\dfrac{e f}{2}$, nem $e \cdot f$.`
    ],
    exam: R`A követelmény (4.7) középszinten a kerület és a terület szemléletes fogalmát, a háromszög területének kiszámítását különböző adatokból ($t = \dfrac{a m}{2} = \dfrac{ab\sin\gamma}{2}$), a nevezetes négyszögek, szabályos sokszögek, továbbá a kör, körcikk, körszelet és körgyűrű kerületének és területének kiszámítását kéri. Emelt szinten a háromszög területképleteinek bizonyítása, a $t = s\cdot r$ összefüggés bizonyítással, a Héron-képlet ismerete és alkalmazása, valamint a nevezetes négyszögek és szabályos sokszögek területképleteinek bizonyítása szerepel. A területet kapcsolhatják trigonometriához, koordinátageometriához vagy szélsőérték-feladatokhoz (pl. adott kerületű síkidomok közül a legnagyobb területű), és a hasonlóság területarány-tétele is felhasználható.`,
    cheat: [
      R`t = \dfrac{a m_a}{2} = \dfrac{ab\sin\gamma}{2}`,
      R`t = \sqrt{s(s-a)(s-b)(s-c)}, \quad s = \dfrac{a+b+c}{2}`,
      R`t = s \cdot r`,
      R`t_{\text{trapéz}} = \dfrac{a + c}{2} \cdot m, \quad t_{\text{rombusz}} = \dfrac{e f}{2}`,
      R`t_{n\text{-szög}} = \dfrac{n}{2}R^2\sin\dfrac{360^\circ}{n}`,
      R`k = 2\pi r, \quad t = \pi r^2, \quad t_{\text{cikk}} = \pi r^2 \dfrac{\alpha}{360^\circ}`,
      R`t_{\text{szelet}} = \dfrac{r^2}{2}(\alpha - \sin\alpha) \quad (\alpha \text{ rad})`,
      R`t_{\text{gyűrű}} = \pi(R^2 - r^2)`,
      R`\dfrac{K'}{K} = k, \quad \dfrac{T'}{T} = k^2`
    ],
    cheatChecks: [['(a+c)/2*m', 'a*m/2+c*m/2'], ['r^2/2*(x-sin(x))', 'r^2*x/2-1/2*r^2*sin(x)'], ['pi*(R^2-r^2)', 'pi*R^2-pi*r^2'], ['sqrt(3)/4*a^2', '3*sqrt(3)/2*a^2/6'], ['n/2*R^2*sin(2*pi/n)', 'n*R^2*sin(2*pi/n)/2']],
    terms: ['kerület', 'terület', 'Héron-képlet', 'félkerület', 'beírt kör', 'köré írt kör', 'trapéz', 'rombusz', 'deltoid', 'szabályos sokszög', 'körcikk', 'körív', 'körszelet', 'körgyűrű', 'hasonlóság aránya', 'apotéma']
  };

  /* ---------- generátorok: kerület, terület ---------- */
  def('g2-ker-1', 'geometria', 'keruletterulet', 1, 'Háromszög területe két oldalból és a szögből', function (r) {
    var a = r.int(4, 20), b = r.int(4, 20), g = r.pick([30, 150]), v = a * b / 4;
    return {
      q: R`Egy háromszög két oldala $${a}$ cm és $${b}$ cm hosszú, a közbezárt szögük $${g}^\circ$. Mekkora a háromszög területe cm$^2$ egységben?`,
      answer: { type: 'num', value: v }, ansTex: K.T(v) + R`\ \mathrm{cm^2}`,
      verify: `0,5*${a}*${b}*sin(${g}*pi/180)`,
      tip1: R`Használd a $t = \dfrac{ab\sin\gamma}{2}$ képletet.`,
      tip2: R`$\sin ${g}^\circ = \dfrac{1}{2}$ (a $150^\circ$ kiegészítő szöge a $30^\circ$).`,
      sol: [R`$t = \dfrac{${a} \cdot ${b} \cdot \sin ${g}^\circ}{2}$`, R`$\sin ${g}^\circ = \dfrac{1}{2}$, ezért $t = \dfrac{${a * b}}{4} = ${K.T(v)}$ cm$^2$.`]
    };
  });

  def('g2-ker-2', 'geometria', 'keruletterulet', 1, 'Körcikk területe π-vel kifejezve', function (r) {
    var rr = r.int(2, 12), al = r.pick([30, 45, 60, 90, 120, 135, 150, 180, 240, 270]), num = rr * rr * al;
    return {
      q: R`Egy $${rr}$ cm sugarú kör $${al}^\circ$-os középponti szögéhez tartozó körcikk területe $x\pi$ cm$^2$ alakban írható. Mennyi $x$? (Törtet is megadhatsz.)`,
      answer: { type: 'num', value: num / 360 }, ansTex: K.q(num, 360),
      verify: `(${al}/360)*${rr}^2`,
      tip1: R`A körcikk területe a kör területének $\dfrac{\alpha}{360^\circ}$-szorosa.`,
      tip2: R`A kör területe $${rr}^2\pi = ${rr * rr}\pi$.`,
      sol: [R`$t_{\text{cikk}} = \pi r^2 \cdot \dfrac{\alpha}{360^\circ} = \pi \cdot ${rr * rr} \cdot \dfrac{${al}}{360}$`, R`$= ${K.q(num, 360)}\pi$, tehát $x = ${K.q(num, 360)}$.`]
    };
  });

  def('g2-ker-3', 'geometria', 'keruletterulet', 2, 'Háromszög területe a Héron-képlettel', function (r) {
    var t = r.pick(HERON), k = (t[2] > 17 || t[0] + t[1] + t[2] > 40) ? 1 : r.int(1, 2), a = t[0] * k, b = t[1] * k, c = t[2] * k, s = (a + b + c) / 2, T = heronT(t) * k * k;
    return {
      q: R`Egy háromszög oldalai $${a}$ cm, $${b}$ cm és $${c}$ cm hosszúak. Mekkora a háromszög területe cm$^2$ egységben?`,
      answer: { type: 'num', value: T }, ansTex: K.T(T) + R`\ \mathrm{cm^2}`,
      verify: `sqrt((${a}+${b}+${c})/2*((${a}+${b}+${c})/2-${a})*((${a}+${b}+${c})/2-${b})*((${a}+${b}+${c})/2-${c}))`,
      tip1: R`Három oldal ismert: használd a Héron-képletet. Előbb a félkerület!`,
      tip2: R`$s = \dfrac{${a} + ${b} + ${c}}{2} = ${s}$.`,
      sol: [R`Félkerület: $s = \dfrac{${a} + ${b} + ${c}}{2} = ${s}$ cm.`, R`$t = \sqrt{s(s-a)(s-b)(s-c)} = \sqrt{${s} \cdot ${s - a} \cdot ${s - b} \cdot ${s - c}} = \sqrt{${s * (s - a) * (s - b) * (s - c)}} = ${T}$ cm$^2$.`]
    };
  });

  def('g2-ker-4', 'geometria', 'keruletterulet', 2, 'Háromszög beírt körének sugara', function (r) {
    var t = r.pick(HERON), k = (t[2] > 17 || t[0] + t[1] + t[2] > 40) ? 1 : r.int(1, 2), a = t[0] * k, b = t[1] * k, c = t[2] * k, s = (a + b + c) / 2, T = heronT(t) * k * k;
    return {
      q: R`Egy háromszög oldalai $${a}$ cm, $${b}$ cm és $${c}$ cm hosszúak. Mekkora a beírt körének sugara? (Törtet is megadhatsz, cm-ben.)`,
      answer: { type: 'num', value: T / s }, ansTex: K.q(T, s) + R`\ \text{cm}`,
      verify: `sqrt((${s}-${a})*(${s}-${b})*(${s}-${c})/${s})`,
      tip1: R`Használd a $t = s \cdot r$ összefüggést; a területet a Héron-képlettel kapod.`,
      tip2: R`$s = ${s}$, és $t = \sqrt{${s} \cdot ${s - a} \cdot ${s - b} \cdot ${s - c}}$.`,
      sol: [R`Félkerület: $s = ${s}$ cm; Héron-képlettel $t = \sqrt{${s} \cdot ${s - a} \cdot ${s - b} \cdot ${s - c}} = ${T}$ cm$^2$.`, R`$t = s \cdot r$, ebből $r = \dfrac{t}{s} = \dfrac{${T}}{${s}} = ${K.q(T, s)}$ cm.`]
    };
  });

  def('g2-ker-5', 'geometria', 'keruletterulet', 2, 'Rombusz kerülete az átlókból', function (r) {
    var t = r.pick([[3, 4, 5], [5, 12, 13], [6, 8, 10], [8, 15, 17], [9, 12, 15], [12, 16, 20]]), p = t[0], q = t[1], c = t[2], sw = r.int(0, 1);
    if (sw) { var z = p; p = q; q = z; }
    var e = 2 * p, f = 2 * q;
    return {
      q: R`Egy rombusz átlói $${e}$ cm és $${f}$ cm hosszúak. Mekkora a rombusz kerülete cm-ben?`,
      answer: { type: 'num', value: 4 * c }, ansTex: K.T(4 * c) + R`\ \text{cm}`,
      verify: `4*sqrt((${e}/2)^2+(${f}/2)^2)`,
      tip1: R`A rombusz átlói merőlegesek és felezik egymást; így derékszögű háromszögek keletkeznek.`,
      tip2: R`A derékszögű háromszög befogói $\dfrac{${e}}{2} = ${p}$ és $\dfrac{${f}}{2} = ${q}$, az átfogó a rombusz oldala.`,
      sol: [R`Az oldal: $a = \sqrt{${p}^2 + ${q}^2} = ${c}$ cm.`, R`A kerület: $4 \cdot ${c} = ${4 * c}$ cm. (A terület $\dfrac{${e} \cdot ${f}}{2} = ${e * f / 2}$ cm$^2$.)`]
    };
  });

  def('g2-ker-6', 'geometria', 'keruletterulet', 3, 'Körszelet területe', function (r) {
    var rr = r.int(4, 12), al = r.pick([60, 90, 120, 150]), ar = rad(al);
    var cikk = Math.PI * rr * rr * al / 360, tri = 0.5 * rr * rr * Math.sin(ar), v = r2(cikk - tri);
    return {
      q: R`Egy $${rr}$ cm sugarú körben egy húrhoz $${al}^\circ$-os középponti szög tartozik. Mekkora a húr és a kisebbik ív által határolt körszelet területe? Két tizedesre kerekítve, cm$^2$ egységben add meg.`,
      answer: { type: 'num', value: v, tol: 0.0051 }, ansTex: K.T(v, 2) + R`\ \mathrm{cm^2}`,
      verify: `${rr}^2/2*(${al}*pi/180-sin(${al}*pi/180))`,
      tip1: R`A körszelet területe a körcikk és a két sugár meg a húr által alkotott háromszög területének különbsége.`,
      tip2: R`A háromszög területe $\dfrac{1}{2}r^2\sin\alpha$, a körcikké $\pi r^2 \cdot \dfrac{\alpha}{360^\circ}$.`,
      sol: [R`Körcikk: $t_1 = \pi \cdot ${rr * rr} \cdot \dfrac{${al}}{360} \approx ${K.T(cikk, 3)}$ cm$^2$.`, R`Háromszög: $t_2 = \dfrac{1}{2} \cdot ${rr * rr} \cdot \sin ${al}^\circ \approx ${K.T(tri, 3)}$ cm$^2$.`, R`Körszelet: $t_1 - t_2 \approx ${K.T(v, 2)}$ cm$^2$.`]
    };
  });

  def('g2-ker-7', 'geometria', 'keruletterulet', 2, 'Hasonló síkidomok kerülete a területarányból', function (r) {
    var pr = r.pick([[2, 3], [3, 5], [2, 5], [3, 4], [4, 5], [3, 2], [5, 3], [5, 2]]), p = pr[0], q = pr[1], u = r.int(2, 9), w = r.int(2, 9);
    var T1 = p * p * u, T2 = q * q * u, K1 = p * w, K2 = q * w;
    return {
      q: R`Két hasonló síkidom területe $${T1}\ \mathrm{cm^2}$ és $${T2}\ \mathrm{cm^2}$. Az első kerülete $${K1}$ cm. Mekkora a második kerülete cm-ben?`,
      answer: { type: 'num', value: K2 }, ansTex: K.T(K2) + R`\ \text{cm}`,
      verify: `${K1}*sqrt(${T2}/${T1})`,
      tip1: R`A területek aránya a hasonlóság arányának négyzete, a kerületek aránya maga a hasonlóság aránya.`,
      tip2: R`$k = \sqrt{\dfrac{${T2}}{${T1}}} = \dfrac{${q}}{${p}}$.`,
      sol: [R`A hasonlóság aránya: $k = \sqrt{\dfrac{${T2}}{${T1}}} = \sqrt{\dfrac{${q * q}}{${p * p}}} = \dfrac{${q}}{${p}}$.`, R`A kerületek aránya is $k$: $K_2 = ${K1} \cdot \dfrac{${q}}{${p}} = ${K2}$ cm.`]
    };
  });

  def('g2-ker-8', 'geometria', 'keruletterulet', 3, 'Szabályos háromszög körgyűrűje', function (r) {
    var a = r.int(2, 14), num = a * a;
    return {
      q: R`Egy $${a}$ cm oldalú szabályos háromszög köré írt és beírt körei közötti körgyűrű területe $x\pi$ cm$^2$ alakban írható. Mennyi $x$? (Törtet is megadhatsz.)`,
      answer: { type: 'num', value: num / 4 }, ansTex: K.q(num, 4),
      verify: `(${a}*sqrt(3)/3)^2-(${a}*sqrt(3)/6)^2`,
      tip1: R`Szabályos háromszögben a köré írt kör sugara a magasság kétharmada, a beírt köré a magasság egyharmada. A gyűrű területe $\pi(R^2 - r^2)$.`,
      tip2: R`A magasság $m = \dfrac{${a}\sqrt{3}}{2}$.`,
      sol: [R`$m = \dfrac{${a}\sqrt{3}}{2}$, ezért $R = \dfrac{2}{3}m = \dfrac{${a}\sqrt{3}}{3}$ és $r = \dfrac{1}{3}m = \dfrac{${a}\sqrt{3}}{6}$.`, R`$R^2 - r^2 = \dfrac{${num}}{3} - \dfrac{${num}}{12} = \dfrac{${num}}{4}$.`, R`A gyűrű területe $\dfrac{${num}}{4}\pi$, tehát $x = ${K.q(num, 4)}$.`]
    };
  });

  /* ================================================================== */
  /* 4.8 Felszín, térfogat                                               */
  /* ================================================================== */
  var CONE = [[3, 4, 5], [4, 3, 5], [5, 12, 13], [12, 5, 13], [6, 8, 10], [8, 6, 10], [8, 15, 17], [15, 8, 17]];   /* r, m, alkotó */

  MO.content['geometria/felszinterfogat'] = {
    intro: R`A felszín a test határoló felületeinek összes területe, a térfogat a test által kitöltött tér nagysága. A követelmény (4.8) a hasábot, a forgáshengert, a gúlát, a forgáskúpot, a gömböt, a csonkagúlát és a csonkakúpot nevezi meg. A feladatokban több test is összekapcsolódhat (beírt gömb, csonkakúp, kiöntött folyadék), ezért a síkgeometriai és trigonometriai eszközök (Pitagorasz-tétel, hasonlóság, szögfüggvények) is kellenek. Emelt szinten a csonkagúla és a csonkakúp térfogatképletét bizonyítani is kell.`,
    theory: [
      { h: 'Felszín és térfogat, a testek részei',
        b: R`A test **felszíne** (A) a határoló lapok területének összege; a **térfogata** (V) azt mutatja meg, hány egységkocka tölti ki. Mértékegységek: $\mathrm{cm^2}$, $\mathrm{m^2}$, illetve $\mathrm{cm^3}$, $\mathrm{m^3}$; $1\ \mathrm{dm^3} = 1$ liter, $1\ \mathrm{m^3} = 10^6\ \mathrm{cm^3} = 1000$ liter.\nA hasáb, a henger és a gúla, kúp részei: **alaplap** (és hasábnál, hengernél, csonka testeknél **fedőlap**), **oldallapok**, ezek együtt a **palást**, **élek**, a testmagasság $m$ (az alaplap síkjától a fedőlap, illetve a csúcs síkjáig mért merőleges távolság).\n**Szemléletes alapelv (Cavalieri):** ha két testet párhuzamos síkokkal úgy metszünk, hogy a metszetek területe mindig egyenlő, akkor a testek térfogata egyenlő. Ezért ugyanakkora alapterületű és magasságú hasábok (ferdék is) térfogata ugyanakkora.` },
      { h: 'Hasáb és téglatest',
        b: R`Egyenes hasáb (alapterület $T$, alapkerület $K$, magasság $m$):\n$$V = T \cdot m, \qquad A = 2T + K \cdot m.$$\nA palást területe $K \cdot m$ (az oldallapok téglalapok, kiterítve egy $K \times m$ téglalapot adnak).\n**Téglatest** (élek $a$, $b$, $c$): $V = abc$, $A = 2(ab + bc + ca)$, a testátló $d = \sqrt{a^2 + b^2 + c^2}$. **Kocka** (él $a$): $V = a^3$, $A = 6a^2$, $d = a\sqrt{3}$.\nPélda: szabályos háromszög alapú egyenes hasáb, alapél $4$, magasság $10$: $T = \dfrac{4^2\sqrt{3}}{4} = 4\sqrt{3}$, $V = 40\sqrt{3} \approx 69{,}3$, $A = 2 \cdot 4\sqrt{3} + 12 \cdot 10 = 8\sqrt{3} + 120 \approx 133{,}9$.` },
      { h: 'Henger (forgáshenger)',
        b: R`A forgáshenger alapja $r$ sugarú kör, magassága $m$. Tengelymetszete $2r \times m$ méretű téglalap.\n$$V = \pi r^2 m, \qquad A = 2\pi r^2 + 2\pi r m = 2\pi r(r + m).$$\nA palást kiterítve $2\pi r \times m$ méretű téglalap, területe $2\pi r m$.\nPélda: $r = 5$, $m = 12$: $V = 300\pi \approx 942{,}5$, $A = 2\pi \cdot 5 \cdot 17 = 170\pi \approx 534{,}1$.\nFeladatoknál gyakori fordított kérdés: ismert $V$ és $r$, keresett $m$; vagy a palást kiterített téglalapjának oldalai (a téglalap egyik oldala $2\pi r$).` },
      { h: 'Gúla és kúp',
        b: R`**Gúla** (alapterület $T$, magasság $m$): $V = \dfrac{T \cdot m}{3}$, $A = T + \text{palást}$ (a palást az oldallapok területösszege).\nSzabályos négyzet alapú gúla (alapél $a$): az oldallapok egyenlő szárú háromszögek; az oldallap alaphoz tartozó magassága $m_o = \sqrt{m^2 + \left(\dfrac{a}{2}\right)^2}$ (**apotéma**), az oldalél $e = \sqrt{m^2 + \left(\dfrac{a\sqrt{2}}{2}\right)^2}$, a felszín $A = a^2 + 4 \cdot \dfrac{a \cdot m_o}{2} = a^2 + 2a\,m_o$.\n**Forgáskúp** (alapkör sugara $r$, magasság $m$, alkotó $a$, $a^2 = r^2 + m^2$):\n$$V = \dfrac{\pi r^2 m}{3}, \qquad A = \pi r^2 + \pi r a = \pi r(r + a).$$\nA kúp palástja kiterítve **körcikk**: sugara $a$, ívhossza $2\pi r$, középponti szöge $\dfrac{r}{a} \cdot 360^\circ$, területe $\pi r a$.\nPélda: $r = 6$, $m = 8$, $a = 10$: $V = 96\pi$, $A = 96\pi$, a palást nyílásszöge $216^\circ$.` },
      { h: 'Csonkagúla és csonkakúp',
        b: R`A gúlát (kúpot) az alaplappal párhuzamos síkkal elmetszve a csúcsot tartalmazó rész **hasonló** az eredetihez, a másik rész a **csonkagúla** (csonkakúp).\n**Csonkagúla** (alap- és fedőlap területe $T_1$ és $T_2$, magasság $m$):\n$$V = \dfrac{m}{3}\left(T_1 + \sqrt{T_1T_2} + T_2\right).$$\n**Csonkakúp** (alapkörök sugarai $R$ és $r$, magasság $m$, alkotó $a$, $a^2 = m^2 + (R - r)^2$):\n$$V = \dfrac{\pi m}{3}\left(R^2 + Rr + r^2\right), \quad A = \pi R^2 + \pi r^2 + \pi(R + r)a.$$\nA csonkakúp palástja kiterítve körgyűrű-cikk; területe $\pi(R + r)a$.\nSzemléletes ellenőrzés: ha $r = 0$, a csonkakúp kúppá válik, és a képlet $\dfrac{\pi m}{3}R^2$-re egyszerűsödik; ha $r = R$, hengert kapunk: $\dfrac{\pi m}{3} \cdot 3R^2 = \pi R^2 m$.`,
        proof: R`Legyen a csonkagúla a $T_1$ alapterületű, $M$ magasságú teljes gúlából a $T_2$ területű, $x$ magasságú kis gúla levágásával kapott test, így $m = M - x$. A két gúla hasonló, a hasonlóság aránya $k = \dfrac{x}{M}$, a területek aránya $k^2 = \dfrac{T_2}{T_1}$, vagyis $k = \sqrt{\dfrac{T_2}{T_1}}$. A térfogatok aránya $k^3$. Így $V = V_{\text{nagy}} - V_{\text{kicsi}} = \dfrac{T_1 M}{3}\left(1 - k^3\right)$. Mivel $m = M(1 - k)$, azaz $M = \dfrac{m}{1 - k}$, és $1 - k^3 = (1 - k)(1 + k + k^2)$, kapjuk $V = \dfrac{T_1 m}{3}(1 + k + k^2) = \dfrac{m}{3}\left(T_1 + kT_1 + k^2T_1\right) = \dfrac{m}{3}\left(T_1 + \sqrt{T_1T_2} + T_2\right)$. Csonkakúpnál $T_1 = \pi R^2$, $T_2 = \pi r^2$, $\sqrt{T_1T_2} = \pi Rr$.` },
      { h: 'Gömb',
        b: R`A gömb a térnek azon pontjai, amelyek egy adott ponttól (a középponttól) adott távolságra ($r$, a sugár) vannak.\n$$V = \dfrac{4}{3}\pi r^3, \qquad A = 4\pi r^2.$$\nA gömböt síkkal metszve a metszet kör; a gömb legnagyobb körmetszete (a középponton átmenő sík) $r$ sugarú, a gömb tengelymetszete tehát $r$ sugarú kör. Ha a sík a középponttól $d$ távolságra van, a metszetkör sugara $\sqrt{r^2 - d^2}$.\nSzép összefüggés (Arkhimédész): a gömböt kívülről közrefogó egyenes henger (sugara $r$, magassága $2r$) térfogata $2\pi r^3$, felszíne $6\pi r^2$, így a gömb térfogata a henger térfogatának $\dfrac{2}{3}$-a, felszíne is $\dfrac{2}{3}$-a.\nPélda: $r = 3$: $V = 36\pi \approx 113{,}1$, $A = 36\pi$.` },
      { h: 'Hasonló testek',
        b: R`Ha két test hasonló, és a megfelelő hosszúságok aránya $k$, akkor\n$$\dfrac{A'}{A} = k^2, \qquad \dfrac{V'}{V} = k^3.$$\nPélda: ha egy gömb sugarát $2$-szeresére növeljük, a felszíne $4$-szeres, a térfogata $8$-szoros lesz.\nGyakori alkalmazás: a gúlát (kúpot) az alaplappal párhuzamos síkkal elmetszve a leválasztott rész hasonló az egész gúlához. Ha a metszősík az alaptól a magasság felénél van, a kis gúla magassága az egész fele, térfogata $\dfrac{1}{8}$-a, a csonkagúla térfogata az egész $\dfrac{7}{8}$-a.\nFordított irányban: ha a térfogatok aránya $\dfrac{p}{q}$, a hosszak aránya $\sqrt[3]{\dfrac{p}{q}}$, a felszínek aránya $\left(\dfrac{p}{q}\right)^{2/3}$; vagy a felszínek aránya $\dfrac{p}{q}$ esetén a hosszak aránya $\sqrt{\dfrac{p}{q}}$.` },
      { h: 'Kiegészítés: testek hajlásszögei',
        b: R`(A 4.8 követelmény a felszín és térfogat számítását kéri; a hajlásszögek a testekkel kapcsolatos feladatokban szoktak előkerülni, ezért itt csak a szükséges eszközt foglaljuk össze.)\n**Egyenes és sík hajlásszöge:** az egyenes és a síkra vett merőleges vetületének szöge. Pl. a gúla oldalélének hajlásszöge az alaplappal: az oldalél és az alaplapon lévő vetülete (a csúcs vetülete és az alapcsúcs közötti szakasz) szöge: $\operatorname{tg}\psi = \dfrac{m}{\text{vetület}}$.\n**Két sík hajlásszöge:** a metszésvonalukra merőleges, a síkokban fekvő két egyenes szöge. Pl. a szabályos négyzet alapú gúla oldallapjának hajlásszöge az alappal: $\operatorname{tg}\varphi = \dfrac{m}{a/2}$ (az alapél felezőpontjában az alapélre merőleges két szakasz: az alapon a középpontig tartó $\dfrac{a}{2}$, az oldallapon az apotéma).\nA kúp alkotójának hajlásszöge az alappal: $\operatorname{tg}\beta = \dfrac{m}{r}$.\nA hajlásszöget mindig derékszögű háromszögben keressük, majd szögfüggvénnyel számoljuk; az ábrát (a metszősíkot) szavakkal is rögzítsd.` },
      { h: 'Összetett testek, feladatmegoldás',
        b: R`**Menete:** (1) rajzold le a testet és a vizsgált síkmetszetet (tengelymetszet, átlós metszet); (2) a síkmetszetben keress derékszögű háromszöget, hasonló háromszögeket; (3) határozd meg a hiányzó hosszúságokat (magasság, alkotó, sugár); (4) alkalmazd a képleteket; (5) ellenőrizd a mértékegységet és a nagyságrendet.\n**Gyakori feladattípusok:**\n- Beírt gömb (kúpba, hengerbe, gúlába): a gömb sugarát a tengelymetszet beírt körének sugaraként kapjuk, pl. kúpra $\rho = \dfrac{r \cdot m}{r + a}$ (mert a tengelymetszet háromszögének területe $r m$, félkerülete $a + r$).\n- Henger és kúp azonos alapkörrel és magassággal: $V_{\text{kúp}} = \dfrac{1}{3}V_{\text{henger}}$.\n- Kiöntés, olvasztás, átformálás: a térfogat megmarad.\n- Szélsőérték: adott felszínű testek közül a legnagyobb térfogatú (differenciálszámítással, lásd Analízis).\n- Forgástestek: egy síkidom forgatásával keletkező testek térfogatát integrállal is számíthatjuk (lásd az Integrálszámítás alfejezetet).` }
    ],
    examples: [
      { t: 'Henger, amelynek tengelymetszete négyzet',
        p: R`Egy forgáshenger tengelymetszete négyzet, ennek átlója $6\sqrt{2}$ cm. Számítsd ki a henger térfogatát és felszínét! (Ábra: a henger tengelyén átmenő sík téglalapot metsz ki, amelynek vízszintes oldala az alapkör átmérője, függőleges oldala a henger magassága; most ez négyzet.)`,
        steps: [R`A négyzet oldalát az átlójából kapjuk: $a = \dfrac{6\sqrt{2}}{\sqrt{2}} = 6$ cm (az átló $a\sqrt{2}$). Így az átmérő $2r = 6$, azaz $r = 3$ cm, a magasság $m = 6$ cm.`, R`Térfogat: $V = \pi r^2 m = \pi \cdot 9 \cdot 6 = 54\pi \approx 169{,}6\ \mathrm{cm^3}$.`, R`Felszín: $A = 2\pi r(r + m) = 2\pi \cdot 3 \cdot 9 = 54\pi \approx 169{,}6\ \mathrm{cm^2}$.`, R`Ellenőrzés: a palást $2\pi r m = 36\pi$, az alap és fedőlap együtt $2\pi r^2 = 18\pi$, összesen $54\pi$. A térfogat és a felszín számértéke egyenlő (a mértékegységük különbözik).`],
        ans: R`$V = 54\pi \approx 169{,}6\ \mathrm{cm^3}$, $A = 54\pi \approx 169{,}6\ \mathrm{cm^2}$.`,
        checks: [['6*sqrt(2)/sqrt(2)', '6'], ['pi*3^2*6', '54*pi'], ['2*pi*3*(3+6)', '54*pi'], ['2*pi*3*6+2*pi*3^2', '54*pi']] },
      { t: 'Szabályos négyzet alapú gúla és hajlásszögei',
        p: R`Egy szabályos négyzet alapú gúla alapéle $12$ cm, magassága $8$ cm. Számítsd ki a gúla felszínét, térfogatát és oldalélének hosszát, továbbá az oldallap és az alaplap hajlásszögének tangensét! (Ábra: az $ABCD$ négyzet alap, a csúcs $E$ az alap középpontja $O$ felett $8$ cm magasan; az $F$ az $AB$ él felezőpontja.)`,
        steps: [R`Az $OF$ szakasz az alapél fele: $OF = 6$ cm. Az $EOF$ derékszögű háromszögben $EF$ az oldallap alaphoz tartozó magassága (apotéma): $EF = \sqrt{8^2 + 6^2} = 10$ cm.`, R`Egy oldallap területe $\dfrac{12 \cdot 10}{2} = 60$ cm$^2$, a palást $4 \cdot 60 = 240$ cm$^2$. Az alap területe $12^2 = 144$ cm$^2$. Felszín: $A = 144 + 240 = 384$ cm$^2$.`, R`Térfogat: $V = \dfrac{144 \cdot 8}{3} = 384$ cm$^3$.`, R`Oldalél: $OA = \dfrac{12\sqrt{2}}{2} = 6\sqrt{2}$ (az alap félátlója), $EA = \sqrt{8^2 + (6\sqrt{2})^2} = \sqrt{64 + 72} = \sqrt{136} = 2\sqrt{34} \approx 11{,}66$ cm.`, R`Az oldallap és az alap hajlásszöge $\varphi$: az $EFO$ derékszögű háromszögben $\operatorname{tg}\varphi = \dfrac{EO}{OF} = \dfrac{8}{6} = \dfrac{4}{3}$, így $\varphi \approx 53{,}1^\circ$. (Az oldalél hajlásszögére $\operatorname{tg}\psi = \dfrac{8}{6\sqrt{2}} = \dfrac{2\sqrt{2}}{3}$, $\psi \approx 43{,}3^\circ$.)`],
        ans: R`$A = 384\ \mathrm{cm^2}$, $V = 384\ \mathrm{cm^3}$, az oldalél $2\sqrt{34} \approx 11{,}66$ cm, $\operatorname{tg}\varphi = \dfrac{4}{3}$ ($\varphi \approx 53{,}1^\circ$).`,
        checks: [['sqrt(8^2+6^2)', '10'], ['4*(12*10/2)', '240'], ['12^2+240', '384'], ['12^2*8/3', '384'], ['sqrt(8^2+(6*sqrt(2))^2)', '2*sqrt(34)'], ['8/6', '4/3'], ['8/(6*sqrt(2))', '2*sqrt(2)/3']] },
      { t: 'Forgáskúp és kiterített palástja',
        p: R`Egy forgáskúp alapkörének sugara $6$ cm, alkotója $10$ cm. Számítsd ki a kúp magasságát, felszínét és térfogatát, valamint a palástja kiterítésével kapott körcikk középponti szögét!`,
        steps: [R`Ábra: a tengelymetszet egyenlő szárú háromszög; az alapja $12$ cm, szárai $10$ cm; a magasság a háromszöget két derékszögű háromszögre bontja ($r = 6$, $m$, $a = 10$).`, R`Magasság: $m = \sqrt{10^2 - 6^2} = 8$ cm.`, R`Felszín: $A = \pi r(r + a) = \pi \cdot 6 \cdot 16 = 96\pi \approx 301{,}6\ \mathrm{cm^2}$. Ebből a palást $\pi r a = 60\pi$, az alap $36\pi$.`, R`Térfogat: $V = \dfrac{\pi r^2 m}{3} = \dfrac{\pi \cdot 36 \cdot 8}{3} = 96\pi \approx 301{,}6\ \mathrm{cm^3}$.`, R`A kiterített palást $10$ cm sugarú körcikk, amelynek ívhossza az alapkör kerülete, $2\pi \cdot 6 = 12\pi$. A középponti szög radiánban $\dfrac{12\pi}{10} = \dfrac{6\pi}{5}$, fokban $\dfrac{6}{10} \cdot 360^\circ = 216^\circ$.`],
        ans: R`$m = 8$ cm, $A = 96\pi \approx 301{,}6\ \mathrm{cm^2}$, $V = 96\pi \approx 301{,}6\ \mathrm{cm^3}$, a körcikk középponti szöge $216^\circ$.`,
        checks: [['sqrt(10^2-6^2)', '8'], ['pi*6*(6+10)', '96*pi'], ['pi*6^2*8/3', '96*pi'], ['2*pi*6/10', '6*pi/5'], ['6/10*360', '216'], ['pi*6*10+pi*6^2', '96*pi']] },
      { t: 'Csonkakúp térfogata és felszíne (emelt)',
        p: R`Egy csonkakúp alapkörének sugara $6$ cm, fedőkörének sugara $3$ cm, magassága $4$ cm. Számítsd ki az alkotóját, a térfogatát és a felszínét! Ellenőrizd a térfogatot a kiegészítő kúp módszerével is! (Ábra: a tengelymetszet egyenlő szárú trapéz, alapjai $12$ és $6$ cm, magassága $4$ cm.)`,
        steps: [R`Alkotó: a tengelymetszet szárát derékszögű háromszögből kapjuk, amelynek befogói $m = 4$ és $R - r = 3$: $a = \sqrt{4^2 + 3^2} = 5$ cm.`, R`Térfogat: $V = \dfrac{\pi m}{3}(R^2 + Rr + r^2) = \dfrac{4\pi}{3}(36 + 18 + 9) = \dfrac{4\pi}{3} \cdot 63 = 84\pi \approx 263{,}9\ \mathrm{cm^3}$.`, R`Palást: $\pi(R + r)a = \pi \cdot 9 \cdot 5 = 45\pi$. Felszín: $A = \pi R^2 + \pi r^2 + 45\pi = 36\pi + 9\pi + 45\pi = 90\pi \approx 282{,}7\ \mathrm{cm^2}$.`, R`Kiegészítő kúp: a levágott kis kúp magassága $x$, hasonló a teljes kúphoz: $\dfrac{x}{x + 4} = \dfrac{3}{6}$, ebből $x = 4$, a teljes kúp magassága $8$ cm.`, R`$V_{\text{nagy}} = \dfrac{\pi \cdot 36 \cdot 8}{3} = 96\pi$, $V_{\text{kicsi}} = \dfrac{\pi \cdot 9 \cdot 4}{3} = 12\pi$, a különbség $96\pi - 12\pi = 84\pi$, ugyanaz. (A kis kúp hasonlóságának aránya $\dfrac{1}{2}$, térfogata $\dfrac{96\pi}{8} = 12\pi$.)`],
        ans: R`$a = 5$ cm, $V = 84\pi \approx 263{,}9\ \mathrm{cm^3}$, $A = 90\pi \approx 282{,}7\ \mathrm{cm^2}$.`,
        checks: [['sqrt(4^2+3^2)', '5'], ['pi*4/3*(36+18+9)', '84*pi'], ['pi*(6+3)*5', '45*pi'], ['36*pi+9*pi+45*pi', '90*pi'], ['pi*36*8/3-pi*9*4/3', '84*pi'], ['96*pi/2^3', '12*pi']] },
      { t: 'Kúpba írt gömb (emelt, II. rész)',
        p: R`Egy forgáskúp alapkörének sugara $6$ cm, alkotója $10$ cm. A kúpba gömböt írunk (a gömb az alapot és a palástot is érinti). Számítsd ki a gömb sugarát, térfogatát és felszínét, majd azt, hogy a gömb térfogata a kúp térfogatának hányad része! Mekkora szöget zár be a kúp alkotója az alaplappal? (Ábra: tengelymetszet: egyenlő szárú háromszög, alapja $12$, szárai $10$, a magasság $8$; a beírt gömb tengelymetszete a háromszög beírt köre.)`,
        steps: [R`A kúp magassága $m = \sqrt{10^2 - 6^2} = 8$ cm. A gömb nagy köre a tengelymetszet-háromszög beírt köre, ezért sugarát $\rho = \dfrac{t}{s}$ adja.`, R`A háromszög területe: $t = \dfrac{12 \cdot 8}{2} = 48$, félkerülete $s = \dfrac{10 + 10 + 12}{2} = 16$. Tehát $\rho = \dfrac{48}{16} = 3$ cm.`, R`Gömb: $V_g = \dfrac{4}{3}\pi \cdot 3^3 = 36\pi \approx 113{,}1\ \mathrm{cm^3}$, $A_g = 4\pi \cdot 3^2 = 36\pi \approx 113{,}1\ \mathrm{cm^2}$.`, R`A kúp térfogata $V_k = \dfrac{\pi \cdot 36 \cdot 8}{3} = 96\pi$. Az arány: $\dfrac{36\pi}{96\pi} = \dfrac{3}{8} = 37{,}5\%$.`, R`Az alkotó hajlásszöge az alaplappal: $\operatorname{tg}\beta = \dfrac{m}{r} = \dfrac{8}{6} = \dfrac{4}{3}$, ezért $\beta \approx 53{,}1^\circ$.`, R`Ellenőrzés a gömb sugarára: a képlet $\rho = \dfrac{r m}{r + a} = \dfrac{48}{16} = 3$, egyezik; és hasonló háromszögekkel: a gömb középpontja az alaptól $3$ cm-re van, a csúcstól $5$ cm-re, az alkotótól mért távolsága $3$ = $5 \cdot \sin(\text{félnyílásszög})$, $\sin = \dfrac{6}{10}$, valóban $5 \cdot 0{,}6 = 3$.`],
        ans: R`$\rho = 3$ cm, $V_g = 36\pi \approx 113{,}1\ \mathrm{cm^3}$, $A_g = 36\pi \approx 113{,}1\ \mathrm{cm^2}$; a gömb térfogata a kúp térfogatának $\dfrac{3}{8}$ része; az alkotó hajlásszöge $\approx 53{,}1^\circ$.`,
        checks: [['sqrt(10^2-6^2)', '8'], ['(0,5*12*8)/((10+10+12)/2)', '3'], ['4/3*pi*3^3', '36*pi'], ['4*pi*3^2', '36*pi'], ['36/96', '3/8'], ['8/6', '4/3'], ['5*6/10', '3']] }
    ],
    sims: ['testek', 'kiteritett-halo', 'sikmetszet'],
    mistakes: [
      R`A gúla és a kúp térfogatában a $\dfrac{1}{3}$ szorzó elmarad: $V = \dfrac{T \cdot m}{3}$ (a hasábé $T \cdot m$).`,
      R`A **magasság** és az **alkotó** (kúpnál), illetve a **magasság** és az **apotéma** (gúlánál) különböző: a térfogathoz a magasság, a palástterülethez az alkotó, illetve az oldallap magassága kell. Az $a^2 = r^2 + m^2$ összefüggéssel váltsd át őket.`,
      R`A henger felszíne a $2\pi r^2$ (két alap) **és** a $2\pi r m$ palást összege; gyakori hiba az egyik elhagyása, vagy a palástnál a $\pi r m$ használata.`,
      R`Hasonlóságnál a felszín a hasonlóság arányának **négyzetével**, a térfogat a **köbével** szorzódik: $2$-szeres méretnél $4$-szeres felszín és $8$-szoros térfogat. A kettő keverése gyakori hiba.`,
      R`A csonkakúp térfogatában a középső tag $Rr$, nem $R^2$ vagy $r^2$-es; és a csonkakúp palástja $\pi(R + r)a$, nem $2\pi R a$. A csonkagúlánál a $\sqrt{T_1T_2}$ a **gyök** az alapterületek szorzatából.`,
      R`Mértékegységek: a térfogat köbös mértékegységű ($\mathrm{cm^3}$), a felszín négyzetes ($\mathrm{cm^2}$). Literre váltásnál $1\ \mathrm{dm^3} = 1$ liter, tehát $1000\ \mathrm{cm^3} = 1$ liter.`,
      R`A gömb felszíne $4\pi r^2$, térfogata $\dfrac{4}{3}\pi r^3$; ne keverd össze őket, és ne felejtsd el, hogy a sugár a gömb sugara, nem az átmérő: $d = 2r$.`
    ],
    exam: R`A követelmény (4.8) középszinten a felszín és térfogat szemléletes fogalmát, a hasáb, gúla, forgáshenger, forgáskúp, gömb, csonkagúla és csonkakúp felszínének és térfogatának kiszámítását kéri egyszerű esetekben. Emelt szinten ezen felül a csonkagúla és a csonkakúp térfogatképletének bizonyítása szerepel. A feladatok összetettek is lehetnek: testek kombinációja (beírt gömb, kúp a hengerben), hasonlóság a térfogatarányokhoz, szögfüggvények a testek elemeinek kiszámításához, és szélsőérték-feladatok (adott felszínű test legnagyobb térfogata). Az ábrát szavakkal is rögzítsd, és a képleteket a hivatalos képlettárból is ellenőrizheted.`,
    cheat: [
      R`V_{\text{hasáb}} = T \cdot m, \quad A = 2T + K \cdot m`,
      R`V_{\text{henger}} = \pi r^2 m, \quad A = 2\pi r(r + m)`,
      R`V_{\text{gúla}} = \dfrac{T \cdot m}{3}`,
      R`V_{\text{kúp}} = \dfrac{\pi r^2 m}{3}, \quad A = \pi r(r + a), \quad a^2 = r^2 + m^2`,
      R`V_{\text{csonkagúla}} = \dfrac{m}{3}\left(T_1 + \sqrt{T_1T_2} + T_2\right)`,
      R`V_{\text{csonkakúp}} = \dfrac{\pi m}{3}(R^2 + Rr + r^2), \quad A = \pi R^2 + \pi r^2 + \pi(R + r)a`,
      R`V_{\text{gömb}} = \dfrac{4}{3}\pi r^3, \quad A_{\text{gömb}} = 4\pi r^2`,
      R`\dfrac{A'}{A} = k^2, \quad \dfrac{V'}{V} = k^3`,
      R`\rho_{\text{kúpba írt gömb}} = \dfrac{r \cdot m}{r + a}`
    ],
    cheatChecks: [['pi*m/3*(R^2+R*r+r^2)', 'm/3*(pi*R^2+pi*R*r+pi*r^2)'], ['2*pi*r*(r+m)', '2*pi*r^2+2*pi*r*m'], ['pi*r*(r+a)', 'pi*r^2+pi*r*a'], ['(R^2*(m*R/(R-r))-r^2*(m*R/(R-r)-m))/3', 'm/3*(R^2+R*r+r^2)'], ['4/3*pi*(2*r)^3/(4/3*pi*r^3)', '8']],
    terms: ['felszín', 'térfogat', 'palást', 'alaplap', 'hasáb', 'téglatest', 'forgáshenger', 'gúla', 'forgáskúp', 'alkotó', 'apotéma', 'csonkagúla', 'csonkakúp', 'gömb', 'hasonló testek', 'beírt gömb', 'hajlásszög']
  };

  /* ---------- generátorok: felszín, térfogat ---------- */
  def('g2-fel-1', 'geometria', 'felszinterfogat', 1, 'Henger térfogata és felszíne', function (r) {
    var rr = r.int(2, 9), m = r.int(2, 15), v = r.int(0, 1), val = v ? rr * rr * m : 2 * rr * (rr + m);
    return {
      q: R`Egy forgáshenger alapkörének sugara $${rr}$ cm, magassága $${m}$ cm. A ${v ? 'térfogata' : 'felszíne'} $x\pi$ ${v ? 'cm$^3$' : 'cm$^2$'} alakban írható. Mennyi $x$?`,
      answer: { type: 'num', value: val }, ansTex: K.T(val),
      verify: v ? `${rr}^2*${m}` : `2*${rr}*${rr}+2*${rr}*${m}`,
      tip1: v ? R`$V = \pi r^2 m$` : R`$A = 2\pi r^2 + 2\pi r m$: két alapkör és a palást.`,
      tip2: v ? R`$r^2 = ${rr * rr}$.` : R`Az alapkörök együtt $2\pi \cdot ${rr * rr}$, a palást $2\pi \cdot ${rr} \cdot ${m}$.`,
      sol: v ? [R`$V = \pi r^2 m = \pi \cdot ${rr * rr} \cdot ${m} = ${val}\pi$.`, R`Tehát $x = ${val}$.`] : [R`$A = 2\pi r^2 + 2\pi r m = 2\pi \cdot ${rr * rr} + 2\pi \cdot ${rr} \cdot ${m}$.`, R`$= ${2 * rr * rr}\pi + ${2 * rr * m}\pi = ${val}\pi$, tehát $x = ${val}$.`]
    };
  });

  def('g2-fel-2', 'geometria', 'felszinterfogat', 1, 'Gömb térfogata és felszíne', function (r) {
    var rr = r.int(2, 12), v = r.int(0, 1), num = v ? 4 * rr * rr * rr : 4 * rr * rr, den = v ? 3 : 1;
    return {
      q: R`Egy gömb sugara $${rr}$ cm. A ${v ? 'térfogata' : 'felszíne'} $x\pi$ ${v ? 'cm$^3$' : 'cm$^2$'} alakban írható. Mennyi $x$? (Törtet is megadhatsz.)`,
      answer: { type: 'num', value: num / den }, ansTex: K.q(num, den),
      verify: v ? `(4/3)*${rr}^3` : `4*${rr}^2`,
      tip1: v ? R`$V = \dfrac{4}{3}\pi r^3$` : R`$A = 4\pi r^2$`,
      tip2: R`$r^${v ? 3 : 2} = ${v ? rr * rr * rr : rr * rr}$.`,
      sol: v ? [R`$V = \dfrac{4}{3}\pi r^3 = \dfrac{4}{3}\pi \cdot ${rr * rr * rr} = ${K.q(num, den)}\pi$.`, R`Tehát $x = ${K.q(num, den)}$.`] : [R`$A = 4\pi r^2 = 4\pi \cdot ${rr * rr} = ${num}\pi$.`, R`Tehát $x = ${num}$.`]
    };
  });

  def('g2-fel-3', 'geometria', 'felszinterfogat', 2, 'Szabályos négyzet alapú gúla', function (r) {
    var t = r.pick([[3, 4, 5], [4, 3, 5], [5, 12, 13], [12, 5, 13], [8, 15, 17], [15, 8, 17]]), a = 2 * t[0], m = t[1], ap = t[2], v = r.int(0, 1);
    var A = a * a + 2 * a * ap, V = a * a * m;
    return {
      q: R`Egy szabályos négyzet alapú gúla alapéle $${a}$ cm, magassága $${m}$ cm. Mekkora a ${v ? 'térfogata (cm$^3$ egységben; törtet is megadhatsz)' : 'felszíne (cm$^2$ egységben)'}?`,
      answer: { type: 'num', value: v ? V / 3 : A }, ansTex: v ? K.q(V, 3) + R`\ \mathrm{cm^3}` : K.T(A) + R`\ \mathrm{cm^2}`,
      verify: v ? `${a}^2*${m}/3` : `${a}^2+4*(${a}*sqrt(${m}^2+(${a}/2)^2)/2)`,
      tip1: v ? R`$V = \dfrac{T \cdot m}{3}$, ahol $T$ az alap területe.` : R`A felszín: az alap és a négy oldallap területe. Az oldallap magassága (apotéma) derékszögű háromszögből jön.`,
      tip2: v ? R`$T = ${a}^2 = ${a * a}$ cm$^2$.` : R`Az apotéma: $\sqrt{${m}^2 + ${a / 2}^2}$.`,
      sol: v ? [R`$T = ${a}^2 = ${a * a}$, $V = \dfrac{${a * a} \cdot ${m}}{3} = ${K.q(V, 3)}$ cm$^3$.`] : [R`Az oldallap magassága: $m_o = \sqrt{${m}^2 + ${a / 2}^2} = ${ap}$ cm.`, R`Egy oldallap területe $\dfrac{${a} \cdot ${ap}}{2} = ${a * ap / 2}$, a palást $4 \cdot ${a * ap / 2} = ${2 * a * ap}$ cm$^2$.`, R`$A = ${a * a} + ${2 * a * ap} = ${A}$ cm$^2$.`]
    };
  });

  def('g2-fel-4', 'geometria', 'felszinterfogat', 2, 'Forgáskúp térfogata, felszíne', function (r) {
    var t = r.pick(CONE), k = t[2] > 13 ? 1 : r.int(1, 2), rr = t[0] * k, m = t[1] * k, a = t[2] * k, v = r.int(0, 1), val, num, den, vf, tx;
    var gv = r.int(0, 1);
    if (v) { num = rr * rr * m; den = 3; val = num / den; vf = `${rr}^2*${m}/3`; tx = 'térfogata'; }
    else { num = rr * (rr + a); den = 1; val = num; vf = `${rr}^2+${rr}*sqrt(${rr}^2+${m}^2)`; tx = 'felszíne'; }
    return {
      q: v ? R`Egy forgáskúp alapkörének sugara $${rr}$ cm, alkotója $${a}$ cm. A térfogata $x\pi$ cm$^3$ alakban írható. Mennyi $x$? (Törtet is megadhatsz.)` : R`Egy forgáskúp alapkörének sugara $${rr}$ cm, magassága $${m}$ cm. A felszíne $x\pi$ cm$^2$ alakban írható. Mennyi $x$?`,
      answer: { type: 'num', value: val }, ansTex: K.q(num, den),
      verify: v ? `${rr}^2*sqrt(${a}^2-${rr}^2)/3` : vf,
      tip1: v ? R`A magasságot az alkotóból és a sugárból Pitagorasz-tétellel kapod: $m^2 = a^2 - r^2$.` : R`A felszínhez az alkotó kell: $a^2 = r^2 + m^2$. Felszín: alapkör + palást, $A = \pi r(r + a)$.`,
      tip2: v ? R`$m = \sqrt{${a}^2 - ${rr}^2} = ${m}$.` : R`$a = \sqrt{${rr}^2 + ${m}^2} = ${a}$.`,
      sol: v ? [R`$m = \sqrt{${a}^2 - ${rr}^2} = ${m}$ cm.`, R`$V = \dfrac{\pi r^2 m}{3} = \dfrac{\pi \cdot ${rr * rr} \cdot ${m}}{3} = ${K.q(num, den)}\pi$, tehát $x = ${K.q(num, den)}$.`] : [R`Alkotó: $a = \sqrt{${rr}^2 + ${m}^2} = ${a}$ cm.`, R`$A = \pi r(r + a) = \pi \cdot ${rr} \cdot ${rr + a} = ${val}\pi$, tehát $x = ${val}$.`]
    };
  });

  def('g2-fel-5', 'geometria', 'felszinterfogat', 2, 'Hasonló testek térfogata a felszínekből', function (r) {
    var pr = r.pick([[2, 3], [3, 4], [1, 2], [2, 5], [3, 5], [4, 3], [3, 2], [5, 2]]), p = pr[0], q = pr[1], u = r.int(2, 9), w = r.int(2, 9);
    var A1 = p * p * u, A2 = q * q * u, V1 = p * p * p * w, V2 = q * q * q * w;
    return {
      q: R`Két hasonló test felszíne $${A1}\ \mathrm{cm^2}$ és $${A2}\ \mathrm{cm^2}$. Az első térfogata $${V1}\ \mathrm{cm^3}$. Mekkora a második test térfogata cm$^3$ egységben?`,
      answer: { type: 'num', value: V2 }, ansTex: K.T(V2) + R`\ \mathrm{cm^3}`,
      verify: `${V1}*(sqrt(${A2}/${A1}))^3`,
      tip1: R`A felszínek aránya a hasonlóság arányának négyzete, a térfogatok aránya a köbe.`,
      tip2: R`$k = \sqrt{\dfrac{${A2}}{${A1}}} = \dfrac{${q}}{${p}}$.`,
      sol: [R`A hasonlóság aránya: $k = \sqrt{\dfrac{${A2}}{${A1}}} = \dfrac{${q}}{${p}}$.`, R`A térfogatok aránya $k^3 = \dfrac{${q * q * q}}{${p * p * p}}$, így $V_2 = ${V1} \cdot \dfrac{${q * q * q}}{${p * p * p}} = ${V2}$ cm$^3$.`]
    };
  });

  def('g2-fel-6', 'geometria', 'felszinterfogat', 3, 'Csonkakúp térfogata az alkotóból', function (r) {
    var t = r.pick([[3, 4, 5], [6, 8, 10], [5, 12, 13], [4, 3, 5]]), dd = t[0], m = t[1], a = t[2], rr = r.int(2, 8), RR = rr + dd, v = r.int(0, 1);
    var numV = m * (RR * RR + RR * rr + rr * rr), A = RR * RR + rr * rr + (RR + rr) * a;
    return {
      q: v ? R`Egy csonkakúp alapkörének sugara $${RR}$ cm, fedőkörének sugara $${rr}$ cm, alkotója $${a}$ cm. A térfogata $x\pi$ cm$^3$ alakban írható. Mennyi $x$? (Törtet is megadhatsz.)` : R`Egy csonkakúp alapkörének sugara $${RR}$ cm, fedőkörének sugara $${rr}$ cm, alkotója $${a}$ cm. A felszíne $x\pi$ cm$^2$ alakban írható. Mennyi $x$?`,
      answer: { type: 'num', value: v ? numV / 3 : A }, ansTex: v ? K.q(numV, 3) : K.T(A),
      verify: v ? `(${RR}^2*(sqrt(${a}^2-(${RR}-${rr})^2)*${RR}/(${RR}-${rr}))-${rr}^2*(sqrt(${a}^2-(${RR}-${rr})^2)*${RR}/(${RR}-${rr})-sqrt(${a}^2-(${RR}-${rr})^2)))/3` : `${RR}^2+${rr}^2+(${RR}+${rr})*${a}`,
      tip1: v ? R`Előbb a magasságot számold ki: a tengelymetszet trapézából a derékszögű háromszög befogói $m$ és $R - r$, átfogója $a$.` : R`A felszín: alapkör, fedőkör és a palást ($\pi(R + r)a$).`,
      tip2: v ? R`$R - r = ${dd}$, így $m = \sqrt{${a}^2 - ${dd}^2} = ${m}$.` : R`$\pi R^2 = ${RR * RR}\pi$, $\pi r^2 = ${rr * rr}\pi$.`,
      sol: v ? [R`$m = \sqrt{${a}^2 - (${RR} - ${rr})^2} = \sqrt{${a * a} - ${dd * dd}} = ${m}$ cm.`, R`$V = \dfrac{\pi m}{3}(R^2 + Rr + r^2) = \dfrac{\pi \cdot ${m}}{3}(${RR * RR} + ${RR * rr} + ${rr * rr}) = \dfrac{${numV}}{3}\pi = ${K.q(numV, 3)}\pi$.`, R`Tehát $x = ${K.q(numV, 3)}$.`] : [R`$A = \pi R^2 + \pi r^2 + \pi(R + r)a = \pi(${RR * RR} + ${rr * rr} + ${RR + rr} \cdot ${a})$.`, R`$= ${A}\pi$, tehát $x = ${A}$.`]
    };
  });

  def('g2-fel-7', 'geometria', 'felszinterfogat', 3, 'Kúpba írt gömb felszíne', function (r) {
    var t = r.pick(CONE), k = t[2] > 13 ? 1 : r.int(1, 2), rr = t[0] * k, m = t[1] * k, a = t[2] * k, num = 4 * rr * rr * m * m, den = (rr + a) * (rr + a);
    return {
      q: R`Egy forgáskúp alapkörének sugara $${rr}$ cm, magassága $${m}$ cm. A kúpba írt gömb felszíne $x\pi$ cm$^2$ alakban írható. Mennyi $x$? (Törtet is megadhatsz.)`,
      answer: { type: 'num', value: num / den }, ansTex: K.q(num, den),
      verify: `4*((${rr}*${m})/((${a}+${a}+2*${rr})/2))^2`,
      tip1: R`A gömb nagy köre a kúp tengelymetszetének (egyenlő szárú háromszög) beírt köre. Sugara $\rho = \dfrac{t}{s}$.`,
      tip2: R`Az alkotó $a = \sqrt{${rr}^2 + ${m}^2} = ${a}$; a tengelymetszet területe $\dfrac{2 \cdot ${rr} \cdot ${m}}{2} = ${rr * m}$, félkerülete $${a} + ${rr} = ${a + rr}$.`,
      sol: [R`Alkotó: $a = \sqrt{${rr}^2 + ${m}^2} = ${a}$ cm. A tengelymetszet háromszög: alap $${2 * rr}$, szárak $${a}$, területe $t = ${rr * m}$, félkerülete $s = ${a + rr}$.`, R`A beírt gömb sugara: $\rho = \dfrac{t}{s} = \dfrac{${rr * m}}{${a + rr}} = ${K.q(rr * m, a + rr)}$ cm.`, R`Felszín: $A = 4\pi\rho^2 = 4\pi \cdot \left(${K.q(rr * m, a + rr)}\right)^2 = ${K.q(num, den)}\pi$, tehát $x = ${K.q(num, den)}$.`]
    };
  });

  def('g2-fel-8', 'geometria', 'felszinterfogat', 3, 'Gúla oldalélének hajlásszöge', function (r) {
    var a = 2 * r.int(2, 6), m = r.int(3, 12), val = r2(m * Math.sqrt(2) / a);
    return {
      q: R`Egy szabályos négyzet alapú gúla alapéle $${a}$ cm, magassága $${m}$ cm. Az oldalél és az alaplap hajlásszögét $\psi$-vel jelöljük. Mennyi $\operatorname{tg}\psi$ értéke? Két tizedesre kerekítve add meg.`,
      answer: { type: 'num', value: val, tol: 0.0051 }, ansTex: K.T(val, 2),
      verify: `${m}/(${a}*sqrt(2)/2)`,
      tip1: R`Az oldalél alaplapra eső vetülete a négyzet alap félátlója. Derékszögű háromszög: a magasság, a félátló és az oldalél.`,
      tip2: R`A félátló $\dfrac{${a}\sqrt{2}}{2} \approx ${K.T(a * Math.sqrt(2) / 2, 3)}$.`,
      sol: [R`Az alap átlója $${a}\sqrt{2}$, a félátló $\dfrac{${a}\sqrt{2}}{2}$.`, R`A derékszögű háromszögben $\operatorname{tg}\psi = \dfrac{m}{\text{félátló}} = \dfrac{${m}}{${K.T(a * Math.sqrt(2) / 2, 3)}} \approx ${K.T(val, 2)}$.`]
    };
  });

  def('g2-fel-9', 'geometria', 'felszinterfogat', 2, 'Gúla oldallapjának hajlásszöge', function (r) {
    var a = 2 * r.int(2, 8), m = r.int(2, 14), num = 2 * m, den = a;
    return {
      q: R`Egy szabályos négyzet alapú gúla alapéle $${a}$ cm, magassága $${m}$ cm. Az oldallap és az alaplap hajlásszögét $\varphi$-vel jelöljük. Mennyi $\operatorname{tg}\varphi$ értéke? (Törtet is megadhatsz.)`,
      answer: { type: 'num', value: num / den }, ansTex: K.q(num, den),
      verify: `${m}/(${a}/2)`,
      tip1: R`Vedd az alapél felezőpontját: ide az alap középpontjából és a csúcsból is merőleges szakasz megy az élre.`,
      tip2: R`A derékszögű háromszög befogói: a gúla magassága és az alapél fele.`,
      sol: [R`Az alapél fele $\dfrac{${a}}{2} = ${a / 2}$ cm; ez az alap középpontjától az él felezőpontjáig mért távolság.`, R`$\operatorname{tg}\varphi = \dfrac{m}{a/2} = \dfrac{${m}}{${a / 2}} = ${K.q(num, den)}$.`]
    };
  });
})(typeof window !== 'undefined' ? window : globalThis);
