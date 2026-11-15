(function (root) {
  'use strict';
  var MO = root.MO = root.MO || {};
  var K = MO.taskKit, R = K.R, def = K.def, Q = MO.Q;
  MO.content = MO.content || {};

  /* ---------- segédek ---------- */
  /* polinom TeX-alakban (c2*v^2 + c1*v + c0), előjelhelyesen */
  function P(c2, c1, c0, v) {
    var o = '';
    [[c2, v + '^2'], [c1, v], [c0, '']].forEach(function (t) {
      var c = t[0], s = t[1]; if (!c) return;
      var ab = Math.abs(c), body = (ab === 1 && s) ? s : ab + s;
      o += o ? (c < 0 ? ' - ' : ' + ') + body : (c < 0 ? '-' : '') + body;
    });
    return o || '0';
  }
  /* ' + 3' / ' - 2' / '' */
  function add(n) { return n === 0 ? '' : (n > 0 ? ' + ' + n : ' - ' + (-n)); }
  /* x - a alak */
  function xm(a, v) { return (v || 'x') + add(-a); }
  function par(x) { return x < 0 ? '(' + x + ')' : '' + x; }

  /* ================================================================== */
  /* 3.1 A függvény                                                      */
  /* ================================================================== */
  MO.content['fuggvenyek/fuggveny'] = {
    intro: R`A függvény a matematika egyik legfontosabb fogalma: minden olyan helyzetben ott van, ahol egy mennyiség egy másiktól függ (út az időtől, ár a mennyiségtől, kamat az időtől). Ebben a részben a fogalmat pontosan tisztázzuk: értelmezési tartomány, értékkészlet, helyettesítési érték, kölcsönösen egyértelmű hozzárendelés. Emelt szinten ezt kiegészítjük a függvényműveletekkel, a megszorítással és kiterjesztéssel, az inverzfüggvénnyel és az összetett függvénnyel (követelmény: 3.1). A 3.2 és a 3.4 pontok mind erre épülnek.`,
    theory: [
      { h: 'A függvény fogalma',
        b: R`Legyen adott két nemüres halmaz, $A$ és $B$. Az $f$ **függvény** (hozzárendelés) $A$ minden eleméhez pontosan egy $B$-beli elemet rendel. Jelölés: $f: A \to B$, $x \mapsto f(x)$.\n**Értelmezési tartomány** ($D_f$): az $A$ halmaz, vagyis azok az $x$ értékek, amelyekhez hozzárendelünk valamit.\n**Képhalmaz**: a $B$ halmaz, ahová a hozzárendelt értékek kerülhetnek.\n**Helyettesítési érték**: $f(x)$, vagyis az $x$-hez rendelt elem.\n**Értékkészlet** ($R_f$): a ténylegesen felvett értékek halmaza, $R_f = \{ f(x) \mid x \in D_f \} \subseteq B$.\nFontos: egy $x$-hez **egyetlen** érték tartozik, de két különböző $x$-hez tartozhat ugyanaz az érték.` },
      { h: 'A függvény megadási módjai',
        b: R`Függvényt megadhatunk **képlettel** ($f(x) = 3x - 2$), **utasítással** („minden számhoz rendeljük a négyzetét”), **értéktáblázattal**, **grafikonnal** vagy nyíldiagrammal.\nA grafikon az $\{(x; f(x)) \mid x \in D_f\}$ pontok halmaza. Egy görbe akkor grafikonja valamilyen függvénynek, ha minden függőleges egyenes legfeljebb egy pontban metszi (nincs egy $x$-hez két érték).\nA szöveges feladatoknál mindig nevezd meg a változót, és írd fel a képletet: pl. egy taxi indulási díja $700$ Ft, kilométerenként $300$ Ft, ekkor $f(x) = 700 + 300x$, ahol $x \geq 0$ a megtett út km-ben.\nA gyakorlati problémákban az értelmezési tartományt a szöveg szabja meg (a távolság nem lehet negatív, a darabszám egész).` },
      { h: 'Értelmezési tartomány és értékkészlet meghatározása',
        b: R`Ha az értelmezési tartományt nem adják meg, akkor a **legbővebb** olyan halmaz, amelyen a képlet értelmezhető. Kikötések:\n1. a nevező nem lehet $0$;\n2. páros gyök alatt nem lehet negatív szám ($\sqrt{u}$: $u \geq 0$);\n3. a logaritmus argumentuma pozitív, az alap pozitív és nem $1$.\nPélda: $f(x) = \dfrac{\sqrt{x+3}}{x-1}$ esetén $x + 3 \geq 0$ és $x \neq 1$, tehát $D_f = [-3; \infty[ \setminus \{1\}$.\nAz értékkészlet meghatározása nehezebb: gondold végig, mely $y$ értékekre van megoldása az $f(x) = y$ egyenletnek, vagy használd az alapfüggvények ismert értékkészletét és a transzformációkat. Pl. $f(x) = x^2 + 1$: $x^2 \geq 0$, ezért $R_f = [1; \infty[$.` },
      { h: 'Helyettesítési érték és egyenlet: f(x) = c',
        b: R`A helyettesítési érték kiszámításához az $x$ helyére beírjuk az adott számot (negatív számot zárójelben): ha $f(x) = x^2 - 3x$, akkor $f(-2) = (-2)^2 - 3 \cdot (-2) = 10$.\nAz **$f(x) = c$** egyenlet megoldása azt jelenti, hogy megkeressük az összes olyan $x \in D_f$ számot, amelyhez a $c$ érték tartozik. Ez lehet egy megoldás, több megoldás is, vagy nincs megoldás (ha $c \notin R_f$). Pl. $x^2 - 3x = 10$ megoldásai: $x = 5$ és $x = -2$; mindkettőhöz $10$ tartozik.\nA grafikonról úgy olvasol le: az $x$-hez tartozó értéket a megfelelő függőleges vonalnál, az $f(x) = c$ megoldásait a $y = c$ vízszintes egyenesnek a grafikonnal alkotott metszéspontjainál.` },
      { h: 'Kölcsönösen egyértelmű hozzárendelés és megfordítása',
        b: R`Egy hozzárendelés **kölcsönösen egyértelmű** (más szóval **egy-egy értelmű**), ha az értelmezési tartomány különböző elemeihez az értékkészlet különböző elemeit rendeli, azaz minden értékhez **pontosan egy** kiindulási elem tartozik. A grafikonon: minden vízszintes egyenes legfeljebb egy pontban metszi a görbét.\nPéldák: $x \mapsto 2x + 1$ kölcsönösen egyértelmű $\mathbb{R}$-en; $x \mapsto x^2$ nem az ($f(2) = f(-2)$), de a $[0; \infty[$ intervallumon már igen.\n**Megfordítás:** ha a hozzárendelés kölcsönösen egyértelmű, megfordíthatjuk: az értékhez hozzárendeljük az eredeti elemet. Képlettel: az $y = f(x)$ egyenletből kifejezzük $x$-et, majd az $x$ és $y$ betűt felcseréljük. A grafikon a megfordításkor az $y = x$ egyenesre tükröződik.\nPélda: $y = 2x + 1 \Rightarrow x = \dfrac{y-1}{2}$, vagyis a megfordított hozzárendelés: $x \mapsto \dfrac{x-1}{2}$.` },
      { h: 'Az inverzfüggvény', level: 'emelt',
        b: R`Legyen $f: D_f \to R_f$ kölcsönösen egyértelmű függvény. Az **inverzfüggvénye** az az $f^{-1}$ függvény, amelyre $D_{f^{-1}} = R_f$, $R_{f^{-1}} = D_f$, és\n$$f^{-1}\big(f(x)\big) = x \quad (x \in D_f), \qquad f\big(f^{-1}(y)\big) = y \quad (y \in R_f).$$\nA grafikonok az $y = x$ egyenesre szimmetrikusak. **Tétel:** csak a kölcsönösen egyértelmű függvénynek van inverze; ha az $f$ szigorúan monoton, akkor kölcsönösen egyértelmű.\nMenete: (1) vizsgáld meg, hogy $f$ kölcsönösen egyértelmű-e (ha nem, szűkítsd le az értelmezési tartományt); (2) $y = f(x)$-ből fejezd ki $x$-et; (3) cseréld fel a változókat; (4) írd fel az új értelmezési tartományt, ami az eredeti értékkészlet.\nPélda: $f(x) = (x-2)^2 + 3$, $D_f = [2; \infty[$. Itt $R_f = [3; \infty[$, $y = (x-2)^2 + 3 \Rightarrow x = 2 + \sqrt{y - 3}$ (mert $x \geq 2$), így $f^{-1}(x) = 2 + \sqrt{x-3}$, $D_{f^{-1}} = [3; \infty[$.`,
        proof: R`Az $A$ pont $(a; b)$ pontosan akkor van az $f$ grafikonján, ha $b = f(a)$, vagyis ha $a = f^{-1}(b)$, azaz a $(b; a)$ pont rajta van az $f^{-1}$ grafikonján. A $(a; b)$ és $(b; a)$ pontok egymás tükörképei az $y = x$ egyenesre, ezért a két grafikon is egymás tükörképe.` },
      { h: 'Műveletek függvényekkel', level: 'emelt',
        b: R`Legyen $f$ és $g$ két függvény, $D = D_f \cap D_g$ (a közös értelmezési tartomány). Ekkor\n$(f + g)(x) = f(x) + g(x)$, $(f - g)(x) = f(x) - g(x)$, $(f \cdot g)(x) = f(x) \cdot g(x)$ mindhárom $D$-n értelmezett, és\n$\left(\dfrac{f}{g}\right)(x) = \dfrac{f(x)}{g(x)}$ azokon az $x \in D$ helyeken, ahol $g(x) \neq 0$.\nPélda: $f(x) = \sqrt{x+2}$, $g(x) = \sqrt{5-x}$: $D_f = [-2; \infty[$, $D_g = ]-\infty; 5]$, ezért az $f + g$ értelmezési tartománya $[-2; 5]$. Az $\dfrac{f}{g}$ hányados tartománya $[-2; 5[$, mert $g(5) = 0$.` },
      { h: 'Megszorítás (leszűkítés) és kiterjesztés', level: 'emelt',
        b: R`Az $f: A \to B$ függvény **megszorítása (leszűkítése)** az $A_1 \subseteq A$ halmazra az az $f|_{A_1}$ függvény, amelyre $D = A_1$ és $f|_{A_1}(x) = f(x)$ minden $x \in A_1$-re. Ha $A_1 \subset A$, akkor az $f$ az $f|_{A_1}$ **kiterjesztése**: olyan függvény, amely a kisebb halmazon ugyanazt csinálja, mint az eredeti, de nagyobb halmazon is értelmezett.\nA megszorítás leggyakoribb haszna az inverz képzése: $x \mapsto x^2$ nem kölcsönösen egyértelmű, de a $[0; \infty[$ intervallumra leszűkítve igen, és inverze $x \mapsto \sqrt{x}$. A $]-\infty; 0]$ intervallumra leszűkítve inverze $x \mapsto -\sqrt{x}$.\nMás: $f(x) = \dfrac{x^2 - 1}{x - 1}$ ($x \neq 1$) kiterjesztése az $x \mapsto x + 1$ függvény ($x \in \mathbb{R}$); a kettő egyenlő, ahol az elsőt értelmezzük.` },
      { h: 'Az összetett függvény', level: 'emelt',
        b: R`Az $f$ és $g$ függvényből képzett **összetett függvény** (először $g$, utána $f$): $(f \circ g)(x) = f\big(g(x)\big)$. Itt $g$ a **belső**, $f$ a **külső** függvény. Értelmezési tartománya azon $x \in D_g$ számok halmaza, amelyekre $g(x) \in D_f$.\nPélda: $f(x) = \sqrt{x}$, $g(x) = x^2 - 9$. Ekkor $(f \circ g)(x) = \sqrt{x^2 - 9}$, tartománya $x^2 \geq 9$, azaz $]-\infty; -3] \cup [3; \infty[$. A másik sorrend: $(g \circ f)(x) = (\sqrt{x})^2 - 9 = x - 9$, de csak $x \geq 0$ esetén!\nA sorrend nem cserélhető fel: általában $f \circ g \neq g \circ f$. Az inverzfüggvény az összetételre azt mondja: $f \circ f^{-1}$ és $f^{-1} \circ f$ az azonosság (a megfelelő halmazon).` }
    ],
    examples: [
      { t: 'Értelmezési tartomány és helyettesítési érték',
        p: R`Legyen $f(x) = \dfrac{\sqrt{x+3}}{x-1}$. Add meg az értelmezési tartományát, számítsd ki $f(6)$-ot és $f(-3)$-at!`,
        steps: [R`Kikötések: a gyökjel alatt $x + 3 \geq 0$, azaz $x \geq -3$; a nevező nem nulla: $x \neq 1$. Mivel $1 \geq -3$, a kizárt $1$ benne van a $[-3; \infty[$ intervallumban, ezért $D_f = [-3; \infty[ \setminus \{1\}$.`, R`$f(6) = \dfrac{\sqrt{6+3}}{6-1} = \dfrac{\sqrt{9}}{5} = \dfrac{3}{5}$.`, R`$f(-3) = \dfrac{\sqrt{-3+3}}{-3-1} = \dfrac{0}{-4} = 0$. Ez a $-3$ benne van a tartományban, mert a $0$ gyöke megengedett.`, R`Ellenőrzés: $f(1)$ nem értelmezett, mert a nevező $0$.`],
        ans: R`$D_f = [-3; \infty[ \setminus \{1\}$, $f(6) = \dfrac{3}{5}$, $f(-3) = 0$.`,
        checks: [['sqrt(6+3)/(6-1)', '3/5'], ['sqrt(-3+3)/(-3-1)', '0'], ['sqrt(1+3)', '2']] },
      { t: 'Inverzfüggvény képzése',
        p: R`Legyen $f(x) = \dfrac{2x+1}{x-3}$ ($x \neq 3$). Add meg az inverzfüggvényét, és ellenőrizd az eredményt egy helyettesítési értékkel!`,
        steps: [R`$f(x) = 2 + \dfrac{7}{x-3}$, tehát minden érték pontosan egyszer vehető fel, kivéve a $2$-t: $R_f = \mathbb{R} \setminus \{2\}$, és $f$ kölcsönösen egyértelmű.`, R`Fejezzük ki $x$-et az $y = \dfrac{2x+1}{x-3}$ egyenletből: $y(x - 3) = 2x + 1$, azaz $yx - 3y = 2x + 1$, ebből $x(y - 2) = 3y + 1$.`, R`Mivel $y \neq 2$, oszthatunk: $x = \dfrac{3y+1}{y-2}$. A változókat felcserélve $f^{-1}(x) = \dfrac{3x+1}{x-2}$, értelmezési tartománya $\mathbb{R} \setminus \{2\}$, azaz éppen $R_f$.`, R`Ellenőrzés: $f(5) = \dfrac{11}{2}$, és $f^{-1}\left(\dfrac{11}{2}\right) = \dfrac{\frac{33}{2} + 1}{\frac{11}{2} - 2} = \dfrac{35/2}{7/2} = 5$.`],
        ans: R`$f^{-1}(x) = \dfrac{3x+1}{x-2}$, $D_{f^{-1}} = \mathbb{R} \setminus \{2\}$.`,
        checks: [['(2*5+1)/(5-3)', '11/2'], ['(3*(11/2)+1)/((11/2)-2)', '5'], ['(2*((3x+1)/(x-2))+1)/(((3x+1)/(x-2))-3)', 'x']] },
      { t: 'Összetett függvény és értelmezési tartománya',
        p: R`Legyen $f(x) = \sqrt{x}$ és $g(x) = x^2 - 9$. Add meg az $f \circ g$ és a $g \circ f$ függvényt az értelmezési tartományukkal, és számítsd ki $(f \circ g)(5)$ és $(g \circ f)(16)$ értékét!`,
        steps: [R`$(f \circ g)(x) = \sqrt{x^2 - 9}$. Feltétel: $x^2 - 9 \geq 0$, azaz $|x| \geq 3$, így a tartomány $]-\infty; -3] \cup [3; \infty[$.`, R`$(g \circ f)(x) = (\sqrt{x})^2 - 9 = x - 9$, de csak az $f$ tartományán: $x \geq 0$. Tehát $(g \circ f)(x) = x - 9$ ($x \geq 0$). Látszik, hogy a két összetett függvény különbözik.`, R`$(f \circ g)(5) = \sqrt{25 - 9} = \sqrt{16} = 4$.`, R`$(g \circ f)(16) = (\sqrt{16})^2 - 9 = 16 - 9 = 7$, és ez egyezik az $x - 9$ képlettel is: $16 - 9 = 7$.`],
        ans: R`$(f \circ g)(x) = \sqrt{x^2 - 9}$ ($|x| \geq 3$), $(g \circ f)(x) = x - 9$ ($x \geq 0$); $(f \circ g)(5) = 4$, $(g \circ f)(16) = 7$.`,
        checks: [['sqrt(5^2-9)', '4'], ['(sqrt(16))^2-9', '7'], ['16-9', '7']] },
      { t: 'Inverz leszűkített függvényhez (emelt szint)',
        p: R`Az $f$ függvény: $f(x) = x^2 - 4x + 7$, $D_f = [2; \infty[$. Mutasd meg, hogy $f$-nek van inverze, add meg $f^{-1}$-et és annak értelmezési tartományát, majd számolj ellenőrzést!`,
        steps: [R`Teljes négyzetté alakítva $f(x) = (x-2)^2 + 3$. A $[2; \infty[$ intervallumon $x - 2 \geq 0$ és a négyzetfüggvény ott szigorúan nő, ezért $f$ szigorúan monoton nő, tehát kölcsönösen egyértelmű. Az értékkészlet $R_f = [3; \infty[$.`, R`$y = (x-2)^2 + 3 \Rightarrow (x-2)^2 = y - 3$. Mivel $x - 2 \geq 0$, a gyök nemnegatív: $x - 2 = \sqrt{y-3}$, vagyis $x = 2 + \sqrt{y-3}$.`, R`Változócsere után $f^{-1}(x) = 2 + \sqrt{x - 3}$, $D_{f^{-1}} = [3; \infty[ = R_f$. (A $-\sqrt{\cdot}$ hamis volna: az a $]-\infty; 2]$ ágat adná.)`, R`Ellenőrzés: $f(5) = 25 - 20 + 7 = 12$, és $f^{-1}(12) = 2 + \sqrt{9} = 5$.`],
        ans: R`$f^{-1}(x) = 2 + \sqrt{x-3}$, $D_{f^{-1}} = [3; \infty[$.`,
        checks: [['5^2-4*5+7', '12'], ['2+sqrt(12-3)', '5'], ['(2+sqrt(12-3))^2-4*(2+sqrt(12-3))+7', '12']] }
    ],
    sims: ['fuggveny', 'transzformaciok'],
    mistakes: [
      R`Az inverzfüggvény **nem** a reciprok: $f^{-1}(x) \neq \dfrac{1}{f(x)}$. A $-1$ itt a megfordítást jelenti.`,
      R`Az értelmezési tartomány megállapításakor elfelejted a kikötéseket (nevező $\neq 0$, gyök alatt $\geq 0$), vagy az összetett függvénynél csak a külső függvény tartományát nézed.`,
      R`Az inverz képzésénél nem ellenőrzöd a kölcsönös egyértelműséget: $x^2$ az egész számegyenesen nem invertálható, csak leszűkítve ($x \geq 0$ vagy $x \leq 0$).`,
      R`Az összetett függvénynél felcseréled a sorrendet: $(f \circ g)(x) = f(g(x))$ azt jelenti, hogy **előbb $g$**, aztán $f$.`,
      R`Kihagyod a változócserét: $y = f(x)$-ből $x = \dots$ még nem az inverzfüggvény képlete az $x$ változóval; a végén cseréld fel $x$-et és $y$-t.`
    ],
    exam: R`Középszinten ismerni kell a függvény fogalmát, az értelmezési tartományt, az értékkészletet, a hozzárendelést és a helyettesítési értéket; szöveges feladatból képletet kell felírni, $f(x) = c$ alapján az $x$-et meghatározni, a kölcsönösen egyértelmű hozzárendelést megfordítani és a megfordítást ábrázolni. Emelt szinten az alapvető függvénytani fogalmak pontos definícióját, a függvényműveleteket (összeg, különbség, szorzat, hányados), a megszorítás és kiterjesztés fogalmát, az inverzfüggvényt és az összetett függvény képzését kéri a követelmény.`,
    cheat: [R`D_f:\ \text{nevező} \neq 0,\ \sqrt{u}:\ u \geq 0,\ \log:\ u > 0`, R`f^{-1}\big(f(x)\big) = x,\quad D_{f^{-1}} = R_f`, R`(f \circ g)(x) = f\big(g(x)\big)`, R`\left(\dfrac{f}{g}\right)(x) = \dfrac{f(x)}{g(x)},\ g(x) \neq 0`, R`y = f(x) \Rightarrow x = f^{-1}(y)`],
    cheatChecks: [['(2*((x-3)/2))+3', 'x'], ['((2x+1)-1)/2', 'x']],
    terms: ['függvény', 'értelmezési tartomány', 'értékkészlet', 'képhalmaz', 'helyettesítési érték', 'kölcsönösen egyértelmű', 'inverzfüggvény', 'összetett függvény', 'megszorítás', 'kiterjesztés']
  };

  def('f1-fv-helyettesites', 'fuggvenyek', 'fuggveny', 1, 'Helyettesítési érték', function (r) {
    var a = r.nz(-4, 4), b = r.nz(-6, 6), c = r.nz(-9, 9), x = r.nz(-4, 4), v = a * x * x + b * x + c;
    return {
      q: R`Legyen $f(x) = ${P(a, b, c, 'x')}$. Számítsd ki $f(${x})$ értékét.`,
      answer: { type: 'num', value: v }, ansTex: K.T(v),
      verify: `${par(a)}*(${par(x)})^2+(${par(b)})*(${par(x)})+(${par(c)})`,
      tip1: R`Írd be az $x$ helyére a megadott számot, a negatív számot tedd zárójelbe.`,
      tip2: R`Előbb a hatványt, aztán a szorzást, végül az összeadást végezd el.`,
      sol: [R`$f(${x}) = ${K.T(a)} \cdot ${K.par(x)}^2 + ${K.par(b)} \cdot ${K.par(x)} + ${K.par(c)} = ${K.T(a * x * x)} + ${K.par(b * x)} + ${K.par(c)} = ${K.T(v)}$`]
    };
  });

  def('f1-fv-fogalom', 'fuggvenyek', 'fuggveny', 1, 'Kölcsönösen egyértelmű függvény felismerése', function (r) {
    var a = r.int(2, 60);
    return {
      q: R`Az alábbi hozzárendelések közül, ahol $x \in \mathbb{R}$ és $a = ${a}$, melyik kölcsönösen egyértelmű?`,
      answer: K.choice(r, R`$x \mapsto ${a}x^3$`, [R`$x \mapsto ${a}x^2$`, R`$x \mapsto |${a}x|$`, R`$x \mapsto ${a}\cos x$`]),
      ansTex: R`\text{az } x \mapsto ${a}x^3 \text{ hozzárendelés}`,
      tip1: R`Kölcsönösen egyértelmű az, ahol különböző $x$-ekhez különböző érték tartozik.`,
      tip2: R`Keress olyan két különböző $x$-et, amelyhez ugyanaz az érték tartozik: pl. $x$ és $-x$.`,
      sol: [R`Az $x^2$, az $|x|$ és a koszinusz páros függvények: $f(1) = f(-1)$, így nem kölcsönösen egyértelműek.`, R`Az $x \mapsto ${a}x^3$ szigorúan monoton nő, ezért különböző $x$-ekhez különböző érték tartozik: kölcsönösen egyértelmű.`]
    };
  });

  def('f1-fv-ertelmezesi', 'fuggvenyek', 'fuggveny', 2, 'Értelmezési tartomány elemei', function (r) {
    var a = r.int(-5, 3), b = a + r.int(1, 5), cnt = b - a + 3;
    return {
      q: R`Legyen $f(x) = \dfrac{\sqrt{${xm(a)}}}{${xm(b)}}$. Hány egész szám tartozik az $f$ értelmezési tartományához a $[${a - 3}; ${b + 3}]$ intervallumból?`,
      answer: { type: 'num', value: cnt }, ansTex: K.T(cnt),
      verify: `(${b + 3}-(${a})+1)-1`,
      tip1: R`Két kikötés van: a gyök alatt nem lehet negatív szám, a nevező pedig nem lehet nulla.`,
      tip2: R`Az első kikötésből $x \geq ${a}$. Számold meg az egész számokat a $${a}$ és a $${b + 3}$ között (a végpontokat is), majd hagyd ki azt az egyet, ahol a nevező nulla.`,
      sol: [R`Gyökjel alatt: $${xm(a)} \geq 0$, azaz $x \geq ${a}$. Nevező: $${xm(b)} \neq 0$, azaz $x \neq ${b}$.`, R`A tartomány a $[${a}; \infty[ \setminus \{${b}\}$. A megadott intervallumban $${a}, ${a + 1}, \dots, ${b + 3}$ jön szóba: ez $${b + 3 - a + 1}$ egész szám.`, R`Ebből ki kell venni az $x = ${b}$ esetet: $${b + 3 - a + 1} - 1 = ${cnt}$.`]
    };
  });

  def('f1-fv-inverz', 'fuggvenyek', 'fuggveny', 2, 'Inverzfüggvény helyettesítési értéke', function (r) {
    var a = r.nz(-4, 4), b = r.nz(-9, 9), x0 = r.int(-5, 5), k = a * x0 + b, ca = a === 1 ? '' : a === -1 ? '-' : K.T(a);
    return {
      q: R`Legyen $f(x) = ${P(0, a, b, 'x')}$. Mennyi az $f^{-1}(${k})$ értéke?`,
      answer: { type: 'num', value: x0 }, ansTex: K.T(x0),
      verify: `(${par(k)}-(${par(b)}))/(${par(a)})`,
      tip1: R`Az $f^{-1}(${k})$ azt az $x$ számot jelenti, amelyre $f(x) = ${k}$.`,
      tip2: R`Oldd meg az $${P(0, a, b, 'x')} = ${k}$ egyenletet.`,
      sol: [R`$f^{-1}(${k}) = x$ azt jelenti, hogy $f(x) = ${k}$, tehát $${P(0, a, b, 'x')} = ${k}$.`, R`Átrendezve $${ca}x = ${K.T(k - b)}$, ebből $x = ${K.T(x0)}$.`, R`Ellenőrzés: $f(${x0}) = ${K.T(a)} \cdot ${K.par(x0)} + ${K.par(b)} = ${K.T(k)}$.`]
    };
  });

  def('f1-fv-osszetett', 'fuggvenyek', 'fuggveny', 2, 'Összetett függvény értéke', function (r) {
    var a = r.nz(-4, 4), b = r.int(-6, 6), c = r.int(-8, 8), x = r.int(-4, 4), fg = r.int(0, 1) === 0, v, nm, vf;
    if (fg) { v = a * (x * x + c) + b; nm = 'f \\circ g'; vf = `${par(a)}*((${par(x)})^2+(${par(c)}))+(${par(b)})`; }
    else { v = (a * x + b) * (a * x + b) + c; nm = 'g \\circ f'; vf = `(${par(a)}*(${par(x)})+(${par(b)}))^2+(${par(c)})`; }
    var gt = fg ? R`$(f \circ g)(${x}) = f(g(${x})) = f(${K.T(x * x + c)}) = ${K.T(v)}$` : R`$(g \circ f)(${x}) = g(f(${x})) = g(${K.T(a * x + b)}) = ${K.T(v)}$`;
    return {
      q: R`Legyen $f(x) = ${P(0, a, b, 'x')}$ és $g(x) = ${P(1, 0, c, 'x')}$. Mennyi $(${nm})(${x})$ értéke?`,
      answer: { type: 'num', value: v }, ansTex: K.T(v),
      verify: vf,
      tip1: R`Az összetett függvényben előbb a belső (jobb oldali) függvényt kell kiszámolni.`,
      tip2: fg ? R`Először $g(${x}) = ${K.T(x * x + c)}$, ezt kell $f$-be helyettesíteni.` : R`Először $f(${x}) = ${K.T(a * x + b)}$, ezt kell $g$-be helyettesíteni.`,
      sol: [gt]
    };
  });

  def('f1-fv-osszeg-tart', 'fuggvenyek', 'fuggveny', 2, 'Két függvény összegének értelmezési tartománya', function (r) {
    var a = r.int(1, 8), b = r.int(1, 8), cnt = a + b + 1;
    return {
      q: R`Legyen $f(x) = \sqrt{x + ${a}}$ és $g(x) = \sqrt{${b} - x}$. Hány egész szám van az $f + g$ függvény értelmezési tartományában?`,
      answer: { type: 'num', value: cnt }, ansTex: K.T(cnt),
      verify: `(${b}-(-${a}))+1`,
      tip1: R`Az összeg ott van értelmezve, ahol mindkét függvény: a két tartomány metszetén.`,
      tip2: R`Az $f$-hez $x \geq -${a}$, a $g$-hez $x \leq ${b}$ kell.`,
      sol: [R`$D_f = [-${a}; \infty[$, $D_g = ]-\infty; ${b}]$.`, R`A metszet: $[-${a}; ${b}]$. Ebben az egész számok: $-${a}, \dots, ${b}$, ez $${b} + ${a} + 1 = ${cnt}$ szám.`]
    };
  });

  def('f1-fv-inverz-gyok', 'fuggvenyek', 'fuggveny', 3, 'Gyökös függvény inverze', function (r) {
    var a = r.int(-4, 4), b = r.int(-5, 5), m = r.int(1, 6), k = b + m, v = m * m + a;
    return {
      q: R`Az $f$ függvény: $f(x) = \sqrt{${xm(a)}} ${add(b)}$, $D_f = [${a}; \infty[$. Mennyi az $f^{-1}(${k})$ értéke?`,
      answer: { type: 'num', value: v }, ansTex: K.T(v),
      verify: `(${par(k)}-(${par(b)}))^2+(${par(a)})`,
      tip1: R`Fejezd ki $x$-et az $y = \sqrt{${xm(a)}} ${add(b)}$ egyenletből, vagy keresd azt az $x$-et, amelyre $f(x) = ${k}$.`,
      tip2: R`A gyökös kifejezést rendezd egyedül az egyik oldalra, majd négyzetre emelve kapod $x$-et.`,
      sol: [R`Az $f(x) = ${k}$ egyenletből $\sqrt{${xm(a)}} = ${K.T(k - b)}$.`, R`Mindkét oldal nemnegatív, négyzetre emelhetünk: $${xm(a)} = ${m * m}$, így $x = ${K.T(v)}$.`, R`Ellenőrzés: $x \geq ${a}$ teljesül, és $f(${v}) = \sqrt{${m * m}} ${add(b)} = ${k}$.`]
    };
  });

  def('f1-fv-osszetett-egyenlet', 'fuggvenyek', 'fuggveny', 3, 'Egyenlet összetett függvénnyel', function (r) {
    var a = r.nz(-3, 3), b = r.int(-6, 6), c = r.nz(-5, 5), x0 = r.int(1, 5), k = a * (x0 * x0 + c) + b,
      rt = `(((${par(k)}-(${par(b)}))/(${par(a)}))-(${par(c)}))`;
    return {
      q: R`Legyen $f(x) = ${P(0, a, b, 'x')}$ és $g(x) = ${P(1, 0, c, 'x')}$. Oldd meg a valós számok halmazán az $(f \circ g)(x) = ${k}$ egyenletet. A megoldásokat pontosvesszővel elválasztva add meg.`,
      answer: { type: 'set', values: [x0, -x0] }, ansTex: R`${x0};\ ${-x0}`,
      verify: `sqrt${rt};-sqrt${rt}`,
      tip1: R`Írd fel az összetett függvényt: $(f \circ g)(x) = f(g(x))$.`,
      tip2: R`Az egyenlet $${K.T(a)} \cdot (${P(1, 0, c, 'x')}) ${add(b)} = ${k}$; először fejezd ki az $x^2$ kifejezést.`,
      sol: [R`$(f \circ g)(x) = ${K.T(a)} \cdot (${P(1, 0, c, 'x')}) ${add(b)} = ${k}$.`, R`Rendezve: $x^2 + ${K.par(c)} = ${K.T((k - b) / a)}$, tehát $x^2 = ${x0 * x0}$.`, R`$x = ${x0}$ vagy $x = ${-x0}$. Mindkettő értelmes, ellenőrzés: $g(\pm ${x0}) = ${K.T(x0 * x0 + c)}$, $f(${K.T(x0 * x0 + c)}) = ${k}$.`]
    };
  });

  /* ================================================================== */
  /* 3.2 Egyváltozós valós függvények                                    */
  /* ================================================================== */
  MO.content['fuggvenyek/valosfv'] = {
    intro: R`Itt ismerkedsz meg az érettségi **elemi függvényeinek tárával**: a lineáris, négyzet-, másodfokú, gyök-, fordított arányossági, exponenciális függvénnyel (középszint), emelt szinten pedig az $x^n$, az abszolútérték-, a szögfüggvények és a logaritmusfüggvény is hozzájön. Mindegyiknél tudnod kell a grafikont és a jellemzést (értékkészlet, zérushely, monotonitás, szélsőérték, paritás, korlátosság, periodicitás, konvexitás). Emelt szinten a transzformációkkal és az összetett függvényekkel bármelyikből újat gyártasz, és másodfokúra vezető szélsőérték-feladatokat is meg kell oldanod (követelmény: 3.2, 3.2.1, 3.2.2).`,
    theory: [
      { h: 'A jellemzés szempontjai',
        b: R`Egy függvény jellemzése: **zérushely**: ahol $f(x) = 0$ (a grafikon az $x$-tengelyt metszi). **Növekedés/fogyás**: $f$ az $I$ intervallumon (szigorúan) **monoton nő**, ha $x_1 < x_2 \Rightarrow f(x_1) < f(x_2)$; (szigorúan) **monoton fogy**, ha $x_1 < x_2 \Rightarrow f(x_1) > f(x_2)$. **Szélsőérték**: az $f$-nek az $x_0$ helyen **maximuma** van, ha $f(x) \leq f(x_0)$ az értelmezési tartomány (egy környezetének) minden $x$-ére; minimum fordítva. **Korlátosság**: felülről korlátos, ha van $K$, hogy $f(x) \leq K$ mindenütt; alulról korlátos, ha $f(x) \geq k$; korlátos, ha mindkettő.\n**Paritás**: $f$ **páros**, ha $D_f$ szimmetrikus a $0$-ra és $f(-x) = f(x)$ (a grafikon az $y$-tengelyre szimmetrikus); **páratlan**, ha $f(-x) = -f(x)$ (a grafikon az origóra szimmetrikus). **Periodikus**, ha van olyan $p > 0$, hogy $f(x + p) = f(x)$ minden $x \in D_f$-re (a legkisebb ilyen $p$ az alapperiódus).` },
      { h: 'Lineáris függvény: x ↦ ax + b',
        b: R`$f(x) = ax + b$, $D_f = \mathbb{R}$. A grafikon egyenes: $a$ a **meredekség** (iránytangens: $a = \dfrac{f(x_2) - f(x_1)}{x_2 - x_1}$), $b$ az $y$-tengelymetszet. Ha $a > 0$, szigorúan nő; ha $a < 0$, szigorúan fogy; ha $a = 0$, konstans.\nZérushely (ha $a \neq 0$): $x = -\dfrac{b}{a}$. Értékkészlet ($a \neq 0$): $\mathbb{R}$; nincs szélsőérték, nem korlátos (kivéve az $a=0$ esetet). Az $f(x) = ax$ páratlan; $a \neq 0$ és $b \neq 0$ esetén nem páros és nem páratlan. Kölcsönösen egyértelmű ($a \neq 0$), inverze: $x \mapsto \dfrac{x - b}{a}$.` },
      { h: 'Négyzetfüggvény és hatványfüggvények: x ↦ x^n',
        b: R`$f(x) = x^2$: $D_f = \mathbb{R}$, $R_f = [0; \infty[$, zérushely $x = 0$, ez egyben a minimum; $]-\infty; 0]$-on szigorúan fogy, $[0; \infty[$-en szigorúan nő; páros; alulról korlátos, felülről nem; (alulról) **konvex**.\nAz $x \mapsto x^n$ ($n \in \mathbb{N}^+$): **páros $n$** esetén a grafikon a négyzetfüggvényére hasonlít: páros függvény, $R_f = [0; \infty[$, a $0$-ban minimum, $x \leq 0$-n fogy, $x \geq 0$-n nő. **Páratlan $n$** esetén a grafikon az $x^3$-ére hasonlít: páratlan függvény, $R_f = \mathbb{R}$, szigorúan nő az egész számegyenesen, nincs szélsőérték. Minden $x^n$ zérushelye csak a $0$, és az $(1; 1)$ ponton mindegyik átmegy. (Középszinten az $x^2$ függvényt kell ismerni, az általános $x^n$ emelt szintű.)` },
      { h: 'Másodfokú függvény: x ↦ ax² + bx + c',
        b: R`$f(x) = ax^2 + bx + c$ ($a \neq 0$), grafikonja **parabola**. Teljes négyzetté alakítás: $f(x) = a\left(x + \dfrac{b}{2a}\right)^2 + c - \dfrac{b^2}{4a}$. A **csúcs**: $\left(-\dfrac{b}{2a};\ c - \dfrac{b^2}{4a}\right)$.\n**$a > 0$:** felfelé nyílik, a csúcsban **minimuma** van; $R_f = \left[c - \dfrac{b^2}{4a}; \infty\right[$; a csúcstól balra fogy, jobbra nő; alulról korlátos. **$a < 0$:** lefelé nyílik, a csúcsban maximuma van, $R_f = \left]-\infty; c - \dfrac{b^2}{4a}\right]$.\n**Zérushelyek:** $x_{1,2} = \dfrac{-b \pm \sqrt{b^2 - 4ac}}{2a}$; a diszkrimináns $D = b^2 - 4ac$ szerint $D > 0$: két, $D = 0$: egy, $D < 0$: nincs zérushely. A függvény a $x = -\dfrac{b}{2a}$ egyenesre szimmetrikus. A parabola $a > 0$ esetén konvex, $a < 0$ esetén konkáv.` },
      { h: 'Abszolútérték-függvény: x ↦ |x|', level: 'emelt',
        b: R`$|x| = x$, ha $x \geq 0$, és $|x| = -x$, ha $x < 0$. Geometriai jelentése: az $x$ távolsága a $0$-tól. $D_f = \mathbb{R}$, $R_f = [0; \infty[$, zérushely $x = 0$ (ez a minimum is); $]-\infty; 0]$-on szigorúan fogy, $[0; \infty[$-en szigorúan nő; **páros**; alulról korlátos, felülről nem; a grafikon „V” alakú, szögpontja az origó.\nA grafikon $x \geq 0$ esetén az $y = x$ egyenes, $x < 0$ esetén az $y = -x$ egyenes. Az $|f(x)|$ grafikonját úgy kapod, hogy az $f$ grafikonjának az $x$-tengely alatti részét tükrözöd az $x$-tengelyre. Az $|x - p| = k$ egyenlet ($k > 0$): $x = p \pm k$, a $p$-től $k$ távolságra levő számok.` },
      { h: 'Négyzetgyökfüggvény: x ↦ √x',
        b: R`$f(x) = \sqrt{x}$, $D_f = [0; \infty[$, $R_f = [0; \infty[$. Zérushely: $x = 0$ (ez a minimum is). Szigorúan monoton nő, alulról korlátos ($0$), felülről nem; nem páros, nem páratlan (nem szimmetrikus a tartománya); **konkáv**. A grafikon az $y = x^2$ parabola $x \geq 0$-hoz tartozó ágának tükörképe az $y = x$ egyenesre, vagyis az $x \mapsto \sqrt{x}$ az $x \mapsto x^2$ ($x \geq 0$) inverze.\nVigyázz: $\sqrt{x^2} = |x|$, nem $x$.` },
      { h: 'Fordított arányosság: x ↦ 1/x és x ↦ a/x',
        b: R`$f(x) = \dfrac{1}{x}$: $D_f = \mathbb{R} \setminus \{0\}$, $R_f = \mathbb{R} \setminus \{0\}$, nincs zérushely, **páratlan**, nincs szélsőérték. A grafikon **hiperbola**, két ága az I. és III. síknegyedben van; mindkét ágon (külön-külön) szigorúan fogy; $]-\infty; 0[$-n konkáv, $]0; \infty[$-en konvex. A koordinátatengelyek az aszimptoták (a grafikon ezekhez tetszőlegesen közel kerül, de nem éri el).\n$f(x) = \dfrac{a}{x}$ ($a \neq 0$): $a > 0$ esetén az I. és III., $a < 0$ esetén a II. és IV. síknegyedben vannak az ágak (és $a < 0$ esetén mindkét ágon szigorúan nő). Az $\dfrac{1}{x}$ a középszint része is (hozzárendelés: $x \mapsto \dfrac{1}{x}$); fordított arányosság: $x \cdot y = a$ állandó.` },
      { h: 'Exponenciális függvény: x ↦ aˣ',
        b: R`$f(x) = a^x$, ahol $a > 0$, $a \neq 1$. $D_f = \mathbb{R}$, $R_f = ]0; \infty[$, nincs zérushely, a grafikon az $(0; 1)$ ponton megy át. Ha $a > 1$: szigorúan **nő**, ha $0 < a < 1$: szigorúan **fogy**. Nincs szélsőérték, alulról korlátos ($0$ a pontos alsó korlát, de nem veszi fel), felülről nem; nem páros, nem páratlan. Konvex. Az $x$-tengely vízszintes aszimptota.\nFontos azonosságok: $a^{x+y} = a^x \cdot a^y$, $a^{-x} = \dfrac{1}{a^x}$, $(a^x)^y = a^{xy}$. Az exponenciális függvény kölcsönösen egyértelmű, ezért $a^x = a^y \iff x = y$; ez az exponenciális egyenletek alapja. Az $a^x$ és az $\left(\dfrac{1}{a}\right)^x$ grafikonja az $y$-tengelyre szimmetrikus.` },
      { h: 'Logaritmusfüggvény: x ↦ log_a x', level: 'emelt',
        b: R`$f(x) = \log_a x$ ($a > 0$, $a \neq 1$) az $x \mapsto a^x$ függvény **inverze**, ezért $D_f = ]0; \infty[$, $R_f = \mathbb{R}$. Zérushely: $x = 1$ (mert $\log_a 1 = 0$), és $\log_a a = 1$. $a > 1$ esetén szigorúan nő, $0 < a < 1$ esetén szigorúan fogy; nincs szélsőérték, nem korlátos; nem páros, nem páratlan. $a > 1$ esetén konkáv, $0 < a < 1$ esetén konvex. Az $y$-tengely függőleges aszimptota. A grafikon az $a^x$ grafikonjának tükörképe az $y = x$ egyenesre.\nAzonosságok ($x, y > 0$): $\log_a(xy) = \log_a x + \log_a y$, $\log_a \dfrac{x}{y} = \log_a x - \log_a y$, $\log_a x^k = k \log_a x$, áttérés más alapra: $\log_a b = \dfrac{\log_c b}{\log_c a}$. A $\lg$ a $10$-es, az $\ln$ az $e$ alapú logaritmus. Egyenletnél a kikötést ($x > 0$) mindig írd fel.` },
      { h: 'Szinusz- és koszinuszfüggvény', level: 'emelt',
        b: R`A szögeket radiánban is kezeljük ($180^\circ = \pi$). $f(x) = \sin x$: $D_f = \mathbb{R}$, $R_f = [-1; 1]$, **periodikus**, alapperiódusa $2\pi$, **páratlan**. Zérushelyek: $k\pi$ ($k \in \mathbb{Z}$). Maximum ($1$): $\dfrac{\pi}{2} + 2k\pi$; minimum ($-1$): $-\dfrac{\pi}{2} + 2k\pi$ (azaz $\dfrac{3\pi}{2} + 2k\pi$). Korlátos. Nő a $\left[-\dfrac{\pi}{2}; \dfrac{\pi}{2}\right]$ intervallumon, fogy a $\left[\dfrac{\pi}{2}; \dfrac{3\pi}{2}\right]$-n, és így tovább.\n$f(x) = \cos x$: $D_f = \mathbb{R}$, $R_f = [-1; 1]$, periódusa $2\pi$, **páros**. Zérushelyek: $\dfrac{\pi}{2} + k\pi$. Maximum ($1$): $2k\pi$; minimum ($-1$): $\pi + 2k\pi$. Nő $[-\pi; 0]$-n, fogy $[0; \pi]$-n.\nÖsszefüggések: $\cos x = \sin\left(x + \dfrac{\pi}{2}\right)$, $\sin^2 x + \cos^2 x = 1$. Az $a \sin(bx + c) + d$ alakú függvények: amplitúdó $|a|$, periódus $\dfrac{2\pi}{|b|}$, $d$ a középvonal.` },
      { h: 'Tangensfüggvény', level: 'emelt',
        b: R`$f(x) = \operatorname{tg} x = \dfrac{\sin x}{\cos x}$. $D_f = \mathbb{R} \setminus \left\{\dfrac{\pi}{2} + k\pi \mid k \in \mathbb{Z}\right\}$ (ahol $\cos x = 0$), $R_f = \mathbb{R}$. **Periodikus**, alapperiódusa $\pi$ (nem $2\pi$!), **páratlan**. Zérushelyek: $k\pi$. Minden $\left]-\dfrac{\pi}{2} + k\pi; \dfrac{\pi}{2} + k\pi\right[$ intervallumon szigorúan nő; nincs szélsőértéke, nem korlátos. Az $x = \dfrac{\pi}{2} + k\pi$ egyenesek függőleges aszimptoták. A grafikon $\left]0; \dfrac{\pi}{2}\right[$-n konvex, $\left]-\dfrac{\pi}{2}; 0\right[$-n konkáv.\nGyakori értékek: $\operatorname{tg}\dfrac{\pi}{4} = 1$, $\operatorname{tg}\dfrac{\pi}{6} = \dfrac{\sqrt{3}}{3}$, $\operatorname{tg}\dfrac{\pi}{3} = \sqrt{3}$.` },
      { h: 'Függvénytranszformációk',
        b: R`Egy $f$ grafikonjából az alábbi transzformációkkal kapjuk az újakat. **Közép:** $f(x) + c$: eltolás az $y$ irányában $c$-vel (fel, ha $c > 0$); $f(x + c)$: eltolás az $x$ irányában $-c$-vel (vigyázat: $c > 0$ esetén **balra**); $c \cdot f(x)$: függőleges nyújtás/zsugorítás $c$-szeres, $c < 0$ esetén még az $x$-tengelyre tükrözés is; $|f(x)|$: az $x$-tengely alatti rész tükrözése az $x$-tengelyre.\n**Emelt:** $c \cdot f(x + b) + d$ és $c \cdot f(ax) + d$ alakú függvények. Az $f(ax)$: **vízszintes** nyújtás/zsugorítás $\dfrac{1}{a}$-szoros arányban ($a > 1$: összenyomás az $y$-tengely felé), $a < 0$ esetén még az $y$-tengelyre tükrözés; az $f(-x)$ az $y$-tengelyre, a $-f(x)$ az $x$-tengelyre tükrözi a grafikont. Sorrend: a zárójelen belüli ($x$ irányú) átalakítások először, a zárójelen kívüliek ($y$ irányú: szorzás, majd eltolás) utána.\nA tulajdonságok a transzformáltból is leolvashatók: pl. $g(x) = -2|x - 1| + 3$ egy lefelé nyíló „V”, szögpontja $(1; 3)$, maximuma $3$, értékkészlete $]-\infty; 3]$.` },
      { h: 'Konvexitás és konkavitás', level: 'emelt',
        b: R`Az $f$ függvény egy $I$ intervallumon **konvex** (lefelé domború), ha a grafikon bármely két pontját összekötő húr a grafikon **felett** (vagy rajta) halad: bármely $x_1, x_2 \in I$ és $0 \leq t \leq 1$ esetén $f\big(t x_1 + (1-t)x_2\big) \leq t f(x_1) + (1-t) f(x_2)$. **Konkáv** (felfelé domború), ha ez fordítva igaz, a húr a grafikon alatt halad.\nPéldák: $x^2$, $|x|$, $a^x$ konvex; $\sqrt{x}$, $\log_a x$ ($a > 1$) konkáv; $x^3$ konkáv $]-\infty; 0]$-n és konvex $[0; \infty[$-en. Az átmeneti pont, ahol az $f$ konvexből konkávba vált (vagy fordítva), az **inflexiós pont** ($x^3$-nél az origó). Ha $f$ konvex, akkor $\dfrac{f(x_1) + f(x_2)}{2} \geq f\left(\dfrac{x_1 + x_2}{2}\right)$ (Jensen-egyenlőtlenség egyszerű esete).` },
      { h: 'Függvényvizsgálat és másodfokúra vezető szélsőérték-feladatok',
        b: R`**Függvényvizsgálat elemi úton:** (1) értelmezési tartomány, (2) zérushely, (3) paritás, periodicitás, (4) monotonitás, szélsőérték, (5) értékkészlet, korlátosság, (6) konvexitás; mindezt az alapfüggvény és a transzformációk ismeretében olvasd le a grafikonról.\n**Szélsőérték-feladatok:** ha a mennyiség (terület, költség, bevétel) egyetlen változó másodfokú függvénye, akkor $f(x) = ax^2 + bx + c$ teljes négyzetté alakítással a csúcsnál veszi fel a szélsőértékét. Menete: (1) válaszd meg a változót és állapítsd meg a lehetséges értékeit (tartomány!), (2) írd fel a függvényt, (3) alakítsd teljes négyzetté, (4) ellenőrizd, hogy a csúcs benne van-e a tartományban, (5) válaszolj szövegesen.\nPélda: 40 m kerítésből, a fal mentén, három oldalról kerítünk téglalap alakú részt. Ha a falra merőleges oldal $x$, a falmenti oldal $40 - 2x$, a terület $T(x) = x(40 - 2x) = -2(x - 10)^2 + 200$, tehát $x = 10$ m-nél maximális: $200\ \text{m}^2$. A tartomány: $0 < x < 20$.` }
    ],
    examples: [
      { t: 'Másodfokú függvény jellemzése',
        p: R`Jellemezd az $f(x) = x^2 - 6x + 5$ függvényt: add meg a zérushelyeit, a szélsőértékét, az értékkészletét és a monotonitását!`,
        steps: [R`Teljes négyzetté alakítva: $f(x) = (x - 3)^2 - 4$. A főegyüttható pozitív, így felfelé nyíló parabola, csúcsa $(3; -4)$.`, R`Zérushely: $(x - 3)^2 = 4 \Rightarrow x - 3 = \pm 2$, így $x_1 = 1$ és $x_2 = 5$. Ellenőrzés: $1 - 6 + 5 = 0$ és $25 - 30 + 5 = 0$.`, R`A minimum $-4$, az $x = 3$ helyen; felülről nem korlátos, tehát $R_f = [-4; \infty[$.`, R`Monotonitás: $]-\infty; 3]$-on szigorúan fogy, $[3; \infty[$-en szigorúan nő. Konvex, nem páros, nem páratlan (a tengelye nem az $y$-tengely).`],
        ans: R`Zérushelyek: $1$ és $5$; minimum: $-4$ az $x = 3$ helyen; $R_f = [-4; \infty[$; fogy $]-\infty; 3]$-n, nő $[3; \infty[$-en.`,
        checks: [['x^2-6x+5', '(x-3)^2-4'], ['1^2-6*1+5', '0'], ['5^2-6*5+5', '0']] },
      { t: 'Transzformáció és jellemzés abszolútértékkel',
        p: R`Ábrázold és jellemezd a $g(x) = -2 \cdot |x - 1| + 3$ függvényt! Add meg a zérushelyeit, az értékkészletét és a szélsőértékét.`,
        steps: [R`Az alapfüggvény $|x|$. Az $|x - 1|$ az $1$-gyel jobbra tolt „V”; a $-2 \cdot$ függőlegesen kétszeresére nyújt és az $x$-tengelyre tükröz (lefelé nyíló „Λ”); végül a $+3$ feltolja $3$ egységgel. A szögpont tehát $(1; 3)$.`, R`Maximum: $g(1) = 3$. A függvény lefelé nyílik, ezért $R_g = ]-\infty; 3]$, felülről korlátos, alulról nem.`, R`Zérushely: $-2|x - 1| + 3 = 0 \Rightarrow |x - 1| = \dfrac{3}{2}$, ebből $x = 1 \pm \dfrac{3}{2}$: $x_1 = -\dfrac{1}{2}$, $x_2 = \dfrac{5}{2}$.`, R`Monotonitás: $]-\infty; 1]$-en szigorúan nő, $[1; \infty[$-en szigorúan fogy. Ellenőrzés: $g\left(\dfrac{5}{2}\right) = -2 \cdot \dfrac{3}{2} + 3 = 0$.`],
        ans: R`Maximum: $3$ az $x = 1$ helyen; zérushelyek: $-\dfrac{1}{2}$ és $\dfrac{5}{2}$; $R_g = ]-\infty; 3]$.`,
        checks: [['-2*|1-1|+3', '3'], ['-2*|-1/2-1|+3', '0'], ['-2*|5/2-1|+3', '0']] },
      { t: 'Szélsőérték-feladat kerítéssel (emelt szint)',
        p: R`Egy $40$ m hosszú kerítéssel egy házfal mentén téglalap alakú kifutót kerítünk el (a fal mentén nem kell kerítés). Mekkorák legyenek az oldalak, hogy a terület a lehető legnagyobb legyen? Mekkora ez a terület?`,
        steps: [R`Legyen a falra merőleges oldal hossza $x$ (m). Ekkor a fallal párhuzamos oldal $40 - 2x$ m. A hosszak pozitívak: $0 < x < 20$.`, R`A terület: $T(x) = x(40 - 2x) = -2x^2 + 40x$. Teljes négyzetté alakítva: $T(x) = -2(x - 10)^2 + 200$.`, R`Az $a = -2 < 0$ miatt a parabola lefelé nyílik, ezért a csúcsban van a maximum: $x = 10$, ami benne van a $]0; 20[$ tartományban. $T(10) = 10 \cdot 20 = 200$.`, R`A fallal párhuzamos oldal $40 - 2 \cdot 10 = 20$ m. Ellenőrzés: $x = 9$ és $x = 11$ esetén $T = 198$, mindkettő kisebb, mint $200$.`],
        ans: R`A falra merőleges oldalak $10$ m, a falmenti oldal $20$ m hosszú legyen; a legnagyobb terület $200\ \text{m}^2$.`,
        checks: [['10*(40-2*10)', '200'], ['-2*(x-10)^2+200', 'x*(40-2x)'], ['40-2*10', '20'], ['9*(40-2*9)', '198']] },
      { t: 'Trigonometrikus függvény jellemzése (emelt szint)',
        p: R`Jellemezd az $f(x) = 2\sin(3x) + 1$ függvényt: add meg a periódusát, értékkészletét, és két zérushelyét a $[0; \pi]$ intervallumon!`,
        steps: [R`Az alapfüggvény $\sin x$. A $3x$ miatt vízszintesen $\dfrac{1}{3}$-ára zsugorodik, ezért a periódus $\dfrac{2\pi}{3}$. A $2 \cdot$ az amplitúdót $2$-re növeli, a $+1$ pedig feltolja a középvonalat $y = 1$-re.`, R`Értékkészlet: $\sin(3x) \in [-1; 1]$, ezért $f(x) \in [2 \cdot (-1) + 1; 2 \cdot 1 + 1] = [-1; 3]$. A függvény korlátos; a maximum $3$ ($3x = \dfrac{\pi}{2}$, $x = \dfrac{\pi}{6}$ helyen), a minimum $-1$.`, R`Zérushely: $2\sin(3x) + 1 = 0 \Rightarrow \sin(3x) = -\dfrac{1}{2}$. Ez $3x = \dfrac{7\pi}{6} + 2k\pi$ vagy $3x = \dfrac{11\pi}{6} + 2k\pi$ esetén teljesül; $k = 0$-ra $x = \dfrac{7\pi}{18}$ és $x = \dfrac{11\pi}{18}$, mindkettő eleme $[0; \pi]$-nek.`, R`Ellenőrzés: $f\left(\dfrac{7\pi}{18}\right) = 2\sin\dfrac{7\pi}{6} + 1 = 2 \cdot \left(-\dfrac{1}{2}\right) + 1 = 0$.`],
        ans: R`Periódus: $\dfrac{2\pi}{3}$; $R_f = [-1; 3]$; zérushelyek (pl.): $\dfrac{7\pi}{18}$ és $\dfrac{11\pi}{18}$.`,
        checks: [['2*sin(3*(7*pi/18))+1', '0'], ['2*sin(3*(11*pi/18))+1', '0'], ['2*sin(3*(pi/6))+1', '3'], ['2*sin(3*(pi/6+2*pi/3))+1', '2*sin(3*(pi/6))+1']] }
    ],
    sims: ['fuggveny', 'transzformaciok', 'masodfoku-fv', 'abszolutertek', 'tortfuggveny', 'exp-log', 'trig-grafikon', 'fuggvenyvizsgalat'],
    mistakes: [
      R`Az $f(x + c)$ transzformációnál elrontod az irányt: $f(x + 3)$ a grafikont **balra** tolja $3$-mal, nem jobbra.`,
      R`A $\sqrt{x^2}$ nem $x$, hanem $|x|$. Hasonlóan $\sqrt{x}$-nek csak $x \geq 0$ esetén van értelme.`,
      R`A tangensfüggvény periódusa $\pi$, nem $2\pi$; a szinuszé és koszinuszé $2\pi$. Az $\sin(bx)$ periódusa $\dfrac{2\pi}{b}$.`,
      R`Az értékkészletet összekevered az értelmezési tartománnyal, vagy a csúcsot $-\dfrac{b}{2a}$ helyett $\dfrac{b}{2a}$-nak veszed.`,
      R`Az exponenciális függvény értékkészlete $]0; \infty[$ (nem tartalmazza a $0$-t), a logaritmusé $\mathbb{R}$, de értelmezési tartománya $]0; \infty[$. Logaritmusos egyenletnél hamis gyök lehet: ellenőrizd a kikötést.`,
      R`Az $\dfrac{1}{x}$ függvényt az egész értelmezési tartományán fogyónak mondod: csak a két ágon külön-külön fogy, együtt nem, hiszen $f(-1) = -1 < f(1) = 1$.`
    ],
    exam: R`Középszinten az $x \mapsto ax + b$, $x^2$, $ax^2 + bx + c$, $\sqrt{x}$, $\dfrac{1}{x}$, $a^x$ függvényeket kell ismerni, ábrázolni, jellemezni (értékkészlet, zérushely, növekedés, fogyás, szélsőérték), továbbá az $f(x) + c$, $f(x + c)$, $c \cdot f(x)$, $|f(x)|$ transzformációkat. Emelt szinten ehhez jön az $x^n$, $|x|$, $\dfrac{a}{x}$, $\sin x$, $\cos x$, $\operatorname{tg} x$, $\log_a x$, az összetett függvények, a $c \cdot f(x + b) + d$ és $c \cdot f(ax) + d$ transzformáció, a periodicitás, paritás, korlátosság, a konvexitás/konkavitás, és a másodfokú függvényre vezető szélsőérték-feladatok.`,
    cheat: [R`ax^2 + bx + c = a\left(x + \dfrac{b}{2a}\right)^2 + c - \dfrac{b^2}{4a}`, R`x_{1,2} = \dfrac{-b \pm \sqrt{b^2 - 4ac}}{2a}`, R`\log_a b = \dfrac{\ln b}{\ln a}, \quad \log_a(xy) = \log_a x + \log_a y`, R`\operatorname{tg} x = \dfrac{\sin x}{\cos x}, \quad \sin^2 x + \cos^2 x = 1`, R`a\sin(bx) + d:\ T = \dfrac{2\pi}{|b|},\ \text{amplitúdó } |a|`, R`f(x + c):\ \text{eltolás } -c\text{-vel az } x \text{ irányban}`],
    cheatChecks: [['a*x^2+b*x+c', 'a*(x+b/(2a))^2+c-b^2/(4a)'], ['sin(x)^2+cos(x)^2', '1'], ['tg(x)', 'sin(x)/cos(x)'], ['log(2;x)', 'ln(x)/ln(2)']],
    terms: ['zérushely', 'monotonitás', 'szélsőérték', 'korlátosság', 'paritás', 'periodicitás', 'konvex', 'konkáv', 'parabola', 'hiperbola', 'abszolútérték', 'transzformáció', 'amplitúdó', 'szögfüggvény']
  };

  def('f1-lin-meredekseg', 'fuggvenyek', 'valosfv', 1, 'Egyenes meredeksége két pontból', function (r) {
    var m = r.nz(-5, 5), x1 = r.int(-5, 3), dx = r.int(1, 5), y1 = r.int(-8, 8), x2 = x1 + dx, y2 = y1 + m * dx;
    return {
      q: R`Egy lineáris függvény grafikonja átmegy az $(${x1}; ${y1})$ és a $(${x2}; ${y2})$ pontokon. Mennyi a függvény $x$ együtthatója (a meredekség)?`,
      answer: { type: 'num', value: m }, ansTex: K.T(m),
      verify: `(${par(y2)}-(${par(y1)}))/(${par(x2)}-(${par(x1)}))`,
      tip1: R`A meredekség az $y$ értékek különbsége osztva az $x$ értékek különbségével.`,
      tip2: R`$m = \dfrac{y_2 - y_1}{x_2 - x_1}$.`,
      sol: [R`$m = \dfrac{${y2} - ${K.par(y1)}}{${x2} - ${K.par(x1)}} = \dfrac{${K.T(y2 - y1)}}{${dx}} = ${K.T(m)}$`]
    };
  });

  def('f1-lin-zerus', 'fuggvenyek', 'valosfv', 1, 'Lineáris függvény zérushelye', function (r) {
    var a = r.nz(-6, 6), x0 = r.int(-7, 7), b = -a * x0, ca = a === 1 ? '' : a === -1 ? '-' : K.T(a);
    return {
      q: R`Mi az $f(x) = ${P(0, a, b, 'x')}$ függvény zérushelye?`,
      answer: { type: 'num', value: x0 }, ansTex: K.T(x0),
      verify: `-(${par(b)})/(${par(a)})`,
      tip1: R`A zérushelyen a függvény értéke $0$.`,
      tip2: R`Oldd meg az $${P(0, a, b, 'x')} = 0$ egyenletet.`,
      sol: [R`$${P(0, a, b, 'x')} = 0 \Rightarrow ${ca}x = ${K.T(-b)} \Rightarrow x = ${K.T(x0)}$`, R`Ellenőrzés: $f(${x0}) = ${K.T(a)} \cdot ${K.par(x0)} ${add(b)} = 0$.`]
    };
  });

  def('f1-paritas', 'fuggvenyek', 'valosfv', 1, 'Páratlan függvény felismerése', function (r) {
    var n = r.pick([3, 5, 7]), m = r.pick([2, 4, 6]), c = r.int(2, 30);
    return {
      q: R`Az alábbi függvények közül melyik páratlan? Itt $c = ${c}$.`,
      answer: K.choice(r, R`$x \mapsto ${c}x^{${n}}$`, [R`$x \mapsto ${c}x^{${m}}$`, R`$x \mapsto ${c}|x|$`, R`$x \mapsto ${c}\cos x$`]),
      ansTex: R`\text{az } x \mapsto ${c}x^{${n}} \text{ függvény}`,
      tip1: R`Páratlan az a függvény, amelyre $f(-x) = -f(x)$ minden $x$-re.`,
      tip2: R`Helyettesítsd az $x$ helyére $-x$-et, és nézd meg, mit kapsz.`,
      sol: [R`Páratlan kitevőnél $(-x)^{${n}} = -x^{${n}}$, ezért $x^{${n}}$ páratlan.`, R`Az $x^{${m}}$, az $|x|$ és a $\cos x$ páros: $f(-x) = f(x)$.`]
    };
  });

  def('f1-mfv-szelsoertek', 'fuggvenyek', 'valosfv', 2, 'Másodfokú függvény szélsőértéke', function (r) {
    var a = r.nz(-3, 3), p = r.int(-4, 4), q = r.int(-9, 9), b = -2 * a * p, c = a * p * p + q, ext = a > 0 ? 'legkisebb' : 'legnagyobb';
    return {
      q: R`Mennyi az $f(x) = ${P(a, b, c, 'x')}$ függvény ${ext} értéke?`,
      answer: { type: 'num', value: q }, ansTex: K.T(q),
      verify: `${par(c)}-(${par(b)})^2/(4*(${par(a)}))`,
      tip1: R`Alakítsd teljes négyzetté a kifejezést, vagy keresd meg a parabola csúcsát.`,
      tip2: R`A csúcs $x$ koordinátája $-\dfrac{b}{2a} = ${K.T(p)}$; ezt helyettesítsd vissza.`,
      sol: [R`$f(x) = ${K.T(a)}\left(x ${add(-p)}\right)^2 ${add(q)}$.`, R`A főegyüttható ${a > 0 ? 'pozitív' : 'negatív'}, ezért a ${ext} érték a csúcsban van, az $x = ${K.T(p)}$ helyen, és értéke $${K.T(q)}$.`]
    };
  });

  def('f1-trans-gyok', 'fuggvenyek', 'valosfv', 2, 'Transzformált gyökfüggvény értéke', function (r) {
    var c = r.nz(-4, 4), b = r.int(-3, 3), d = r.int(-6, 6), m = r.int(1, 5), k = m * m - b, v = c * m + d;
    return {
      q: R`Legyen $g(x) = ${K.T(c)} \cdot \sqrt{x${add(b)}} ${add(d)}$. Számítsd ki $g(${k})$ értékét.`,
      answer: { type: 'num', value: v }, ansTex: K.T(v),
      verify: `(${par(c)})*sqrt(${par(k)}+(${par(b)}))+(${par(d)})`,
      tip1: R`Helyettesítsd be az $x$ helyére a megadott számot, és előbb a gyök alatti kifejezést számold ki.`,
      tip2: R`A gyök alatt $${k} ${add(b)} = ${m * m}$ áll.`,
      sol: [R`$g(${k}) = ${K.T(c)} \cdot \sqrt{${m * m}} ${add(d)} = ${K.T(c)} \cdot ${m} ${add(d)} = ${K.T(v)}$`]
    };
  });

  def('f1-exp-egyenlet', 'fuggvenyek', 'valosfv', 2, 'Exponenciális egyenlet', function (r) {
    var a = r.pick([2, 3, 5]), t = r.int(1, 4), s = r.int(-3, 3), x0 = t - s;
    return {
      q: R`Oldd meg a valós számok halmazán: $${a}^{x${add(s)}} = ${Math.pow(a, t)}$. Mennyi $x$ értéke?`,
      answer: { type: 'num', value: x0 }, ansTex: K.T(x0),
      verify: `log(${a};${Math.pow(a, t)})-(${par(s)})`,
      tip1: R`Írd fel a jobb oldalt is ugyanannak az alapnak a hatványaként.`,
      tip2: R`$${Math.pow(a, t)} = ${a}^{${t}}$, és az exponenciális függvény kölcsönösen egyértelmű, ezért a kitevők egyenlők.`,
      sol: [R`$${Math.pow(a, t)} = ${a}^{${t}}$, így $${a}^{x${add(s)}} = ${a}^{${t}}$.`, R`A kitevőknek egyenlőnek kell lenniük: $x${add(s)} = ${t}$, ebből $x = ${K.T(x0)}$.`, R`Ellenőrzés: $${a}^{${x0}${add(s)}} = ${a}^{${t}} = ${Math.pow(a, t)}$.`]
    };
  });

  def('f1-trig-periodus', 'fuggvenyek', 'valosfv', 2, 'Szinuszfüggvény periódusa', function (r) {
    var b = r.int(2, 6), c = r.nz(-4, 4), d = r.int(-5, 5);
    return {
      q: R`Az $f(x) = ${K.T(c)} \cdot \sin\dfrac{x}{${b}} ${add(d)}$ függvény legkisebb pozitív periódusa $k\pi$. Mennyi $k$ értéke?`,
      answer: { type: 'num', value: 2 * b }, ansTex: K.T(2 * b),
      verify: `2*pi/(1/${b})/pi`,
      tip1: R`A $\sin(bx)$ periódusa $\dfrac{2\pi}{b}$; az amplitúdó és az eltolás nem változtatja a periódust.`,
      tip2: R`Itt $b = \dfrac{1}{${b}}$.`,
      sol: [R`Az $\sin\dfrac{x}{${b}}$ periódusa $\dfrac{2\pi}{1/${b}} = ${2 * b}\pi$. A $${K.T(c)} \cdot$ ${d === 0 ? 'csak nyújt' : 'és a $' + add(d) + '$ csak nyújt és eltol'}, a periódus ugyanaz.`, R`Tehát $k = ${2 * b}$.`]
    };
  });

  def('f1-abs-egyenlet', 'fuggvenyek', 'valosfv', 2, 'Abszolútértékes egyenlet', function (r) {
    var p = r.int(-6, 6), k = r.int(1, 7);
    return {
      q: R`Oldd meg a valós számok halmazán: $|${xm(p)}| = ${k}$. A megoldásokat pontosvesszővel elválasztva add meg.`,
      answer: { type: 'set', values: [p - k, p + k] }, ansTex: R`${p - k};\ ${p + k}`,
      verify: `(${par(p)})-${k};(${par(p)})+${k}`,
      tip1: R`Az abszolútérték a nullától mért távolság: két szám van, amelynek az abszolútértéke $${k}$.`,
      tip2: R`$${xm(p)} = ${k}$ vagy $${xm(p)} = -${k}$.`,
      sol: [R`$|${xm(p)}| = ${k}$, tehát $${xm(p)} = ${k}$ vagy $${xm(p)} = -${k}$.`, R`$x = ${p + k}$ vagy $x = ${p - k}$. Ellenőrzés: $|${p + k} ${add(-p)}| = |${p - k} ${add(-p)}| = ${k}$.`]
    };
  });

  def('f1-trig-zerus', 'fuggvenyek', 'valosfv', 3, 'Szinuszfüggvény zérushelyeinek száma', function (r) {
    var b = r.int(2, 6), c = r.nz(-4, 4);
    return {
      q: R`Hány zérushelye van az $f(x) = ${K.T(c)} \cdot \sin(${b}x)$ függvénynek a $[0; 2\pi[$ intervallumon?`,
      answer: { type: 'num', value: 2 * b }, ansTex: K.T(2 * b),
      verify: `2*pi/(pi/${b})`,
      tip1: R`A szinusz zérushelyei egymástól fél periódus távolságra vannak.`,
      tip2: R`$${b}x = k\pi$, azaz $x = \dfrac{k\pi}{${b}}$; keresd meg, hány egész $k$ esik $0 \leq x < 2\pi$-be.`,
      sol: [R`$${K.T(c)} \cdot \sin(${b}x) = 0 \iff \sin(${b}x) = 0 \iff ${b}x = k\pi$, azaz $x = \dfrac{k\pi}{${b}}$ ($k \in \mathbb{Z}$).`, R`Ebből $0 \leq \dfrac{k\pi}{${b}} < 2\pi$, vagyis $0 \leq k < ${2 * b}$. A $k = 0, 1, \dots, ${2 * b - 1}$ értékek adják a megoldásokat: $${2 * b}$ darab.`]
    };
  });

  def('f1-szelsoertek', 'fuggvenyek', 'valosfv', 3, 'Kerítés mellett maximális terület', function (r) {
    var m = r.int(5, 20), L = 4 * m, T = 2 * m * m;
    return {
      q: R`Egy házfal mentén $${L}$ méter hosszú kerítéssel téglalap alakú területet kerítünk be (a fal mentén nem kell kerítés). Hány négyzetméter a legnagyobb bekeríthető terület?`,
      answer: { type: 'num', value: T }, ansTex: R`${K.B(T)}\ \text{m}^2`,
      verify: `(${L}/4)*(${L}-2*(${L}/4))`,
      tip1: R`Legyen a falra merőleges oldal $x$. Ekkor a fallal párhuzamos oldal $${L} - 2x$.`,
      tip2: R`A terület $T(x) = x(${L} - 2x) = -2x^2 + ${L}x$. Ennek a lefelé nyíló parabolának a csúcsa adja a maximumot.`,
      sol: [R`$T(x) = x(${L} - 2x) = -2x^2 + ${L}x = -2(x - ${m})^2 + ${T}$.`, R`A maximum az $x = ${m}$ helyen van ($0 < x < ${L / 2}$, tehát megfelel), a terület $${T}$.`, R`A fallal párhuzamos oldal ekkor $${L} - 2 \cdot ${m} = ${L - 2 * m}$ m. Válasz: a legnagyobb terület $${K.B(T)}\ \text{m}^2$.`]
    };
  });

  /* ================================================================== */
  /* 3.3 Sorozatok                                                       */
  /* ================================================================== */
  MO.content['fuggvenyek/sorozatok'] = {
    intro: R`A sorozat olyan függvény, amelynek értelmezési tartománya a pozitív egész számok halmaza: sorban megadott számok $a_1, a_2, a_3, \dots$. A számtani és a mértani sorozat, a kamatos kamat és a járadék a mindennapi pénzügyek alapja (középszint), a határérték és a végtelen mértani sor pedig a későbbi analízis (3.4) kapuja (emelt szint). Ebben a részben a követelmény 3.3, 3.3.1, 3.3.2 és 3.3.3 pontját dolgozzuk fel: a megadási módoktól a konvergenciáig.`,
    theory: [
      { h: 'A sorozat fogalma és megadási módjai',
        b: R`A **számsorozat** olyan függvény, amelynek értelmezési tartománya a pozitív egész számok halmaza ($\mathbb{N}^+$), értékei valós számok: $n \mapsto a_n$. Az $a_n$ az $n$-edik tag, a sorozatot $(a_n)$-nel jelöljük.\nMegadási módok:\n1. **utasítással**: „a pozitív páratlan számok növekvő sorrendben” ($1, 3, 5, \dots$);\n2. **képlettel** (explicit): $a_n = \dfrac{n}{n+1}$, ebből bármelyik tag közvetlenül kiszámolható;\n3. **rekurzióval**: megadjuk az első tagot (vagy tagokat) és azt, hogyan kapjuk a következőt az előzőből: $a_1 = 3$, $a_{n+1} = 2a_n - 1$. Ennél a tagok sorban számolhatók: $3, 5, 9, 17, \dots$\nA rekurzív sorozatnál mindig meg kell adni a kezdőtagot is, különben nincs egyértelmű sorozat.` },
      { h: 'Monotonitás és korlátosság', level: 'emelt',
        b: R`Az $(a_n)$ sorozat **monoton növekedő**, ha $a_{n+1} \geq a_n$ minden $n$-re; **szigorúan monoton növekedő**, ha $a_{n+1} > a_n$. **Monoton csökkenő**, ha $a_{n+1} \leq a_n$; szigorúan, ha $a_{n+1} < a_n$. (Egy módszer: vizsgáld az $a_{n+1} - a_n$ előjelét, vagy ha pozitív tagokról van szó, az $\dfrac{a_{n+1}}{a_n}$ és az $1$ viszonyát.)\n**Felülről korlátos**, ha van olyan $K$ szám, hogy $a_n \leq K$ minden $n$-re; **alulról korlátos**, ha van $k$, hogy $a_n \geq k$; **korlátos**, ha mindkettő.\nPéldák: $a_n = \dfrac{1}{n}$ szigorúan csökkenő, korlátos ($0 < a_n \leq 1$); $a_n = (-1)^n$ nem monoton, de korlátos; $a_n = n^2$ szigorúan nő, alulról korlátos, felülről nem.` },
      { h: 'Számtani sorozat',
        b: R`A sorozat **számtani sorozat**, ha bármely két szomszédos tagjának különbsége állandó: $a_{n+1} - a_n = d$ (a **differencia**). Ekkor\n$$a_n = a_1 + (n-1)d.$$\nA definícióból következik, hogy minden tag a két szomszédja számtani közepe: $a_n = \dfrac{a_{n-1} + a_{n+1}}{2}$ ($n \geq 2$). Ha $d > 0$, a sorozat szigorúan nő, ha $d < 0$, szigorúan csökken, $d = 0$ esetén konstans. Az $a_n$ egy $n$-ben elsőfokú függvény, ezért a grafikonja egy egyenesen levő pontok sorozata.\nTétel (összegképlet): az első $n$ tag összege $S_n = \dfrac{a_1 + a_n}{2} \cdot n = \dfrac{2a_1 + (n-1)d}{2} \cdot n$.\nPélda: $a_3 = 7$, $a_8 = 22$: $d = \dfrac{22 - 7}{8 - 3} = 3$.`,
        proof: R`Az összegképlet bizonyítása (Gauss-trükk): $S_n = a_1 + a_2 + \dots + a_n$ és fordított sorrendben $S_n = a_n + a_{n-1} + \dots + a_1$. A két egyenletet tagonként összeadva $2S_n = (a_1 + a_n) + (a_2 + a_{n-1}) + \dots$, és minden zárójel értéke $a_1 + a_n$, mert $a_k + a_{n+1-k} = a_1 + (k-1)d + a_1 + (n-k)d = 2a_1 + (n-1)d$. Így $2S_n = n(a_1 + a_n)$. Az általános tag levezetése: minden lépésben $d$-t adunk hozzá, $a_n$-hez az $a_1$-ből $n - 1$ lépés kell, tehát $a_n = a_1 + (n-1)d$.` },
      { h: 'Mértani sorozat',
        b: R`A sorozat **mértani sorozat**, ha bármely két szomszédos tagjának hányadosa állandó: $\dfrac{a_{n+1}}{a_n} = q$ (a **hányados**; $a_1 \neq 0$, $q \neq 0$). Ekkor\n$$a_n = a_1 \cdot q^{n-1}.$$\nMinden tag négyzete a szomszédai szorzata: $a_n^2 = a_{n-1} \cdot a_{n+1}$ (pozitív tagoknál $a_n$ a szomszédok mértani közepe). Ha $q > 1$ és $a_1 > 0$, szigorúan nő; ha $0 < q < 1$ és $a_1 > 0$, szigorúan csökken; ha $q < 0$, váltakozó előjelű (nem monoton); $q = 1$ esetén konstans.\nTétel (összegképlet): $q \neq 1$ esetén $S_n = a_1 \cdot \dfrac{q^n - 1}{q - 1}$, $q = 1$ esetén $S_n = n \cdot a_1$.\nPélda: $a_1 = 3$, $q = 2$: $3, 6, 12, 24, \dots$; $a_5 = 3 \cdot 2^4 = 48$, $S_5 = 3 \cdot \dfrac{2^5 - 1}{2 - 1} = 93$.`,
        proof: R`Az összegképlet bizonyítása: $S_n = a_1 + a_1 q + a_1 q^2 + \dots + a_1 q^{n-1}$. Szorozzuk meg $q$-val: $q S_n = a_1 q + a_1 q^2 + \dots + a_1 q^n$. A két egyenlet különbségében a középső tagok kiesnek: $qS_n - S_n = a_1 q^n - a_1$, azaz $S_n(q - 1) = a_1(q^n - 1)$. Ha $q \neq 1$, osztunk $(q - 1)$-gyel. Az általános tag: $a_1$-ből $n - 1$ darab $q$-val szorzás után kapjuk $a_n$-t.` },
      { h: 'Kamatos kamat, járadék, törlesztőrészlet',
        b: R`**Kamatos kamat:** ha a $K_0$ tőke után a kamat évi $p\%$, és a kamatot a tőkéhez csatolják, akkor $n$ év múlva $K_n = K_0 \left(1 + \dfrac{p}{100}\right)^n = K_0 q^n$, ahol $q = 1 + \dfrac{p}{100}$ a kamattényező. Ez mértani sorozat. Az ismeretlen ($K_0$, $p$, $n$) kiszámolható: $n$-hez logaritmus kell, $p$-hez gyökvonás.\n**Gyűjtőjáradék:** ha minden időszak végén $A$ összeget fizetünk be $n$ időszakon át ($q$ kamattényezővel), a befizetések értéke az utolsó befizetéskor: $A q^{n-1} + \dots + A q + A = A \cdot \dfrac{q^n - 1}{q - 1}$ (mértani sorösszeg). Ha a befizetés az időszak elején történik, ennek $q$-szorosa a végösszeg.\n**Törlesztőrészlet:** a $H$ hitelt $n$ egyenlő részletben, időszakonként a végén $T$ összegekkel törlesztjük: $H q^n = T \cdot \dfrac{q^n - 1}{q - 1}$, innen $T = H q^n \cdot \dfrac{q - 1}{q^n - 1}$.\nA megtakarítás és a hitel kockázatai: a kamat változhat (változó kamatozás), az infláció csökkenti a tőke valódi értékét, és a hitelnél a kamat és a díjak a THM-ben jelennek meg. Mindig kerekíts a feladatban kért pontosságra, a forintot jellemzően egészre.` },
      { h: 'Konvergencia és határérték', level: 'emelt',
        b: R`Az $(a_n)$ sorozat **konvergens**, és határértéke $A$, ha minden $\varepsilon > 0$ számhoz van olyan $N$ küszöbindex, hogy $n > N$ esetén $|a_n - A| < \varepsilon$. Jelölés: $\lim_{n \to \infty} a_n = A$. Szemléletesen: a sorozat tagjai $A$-hoz tetszőlegesen közel kerülnek, és onnan már ott is maradnak. Ha nincs ilyen $A$, a sorozat **divergens**.\nEgyszerű határértékek: $\lim \dfrac{1}{n} = 0$, $\lim \dfrac{1}{n^k} = 0$ ($k > 0$), $\lim q^n = 0$, ha $|q| < 1$; $\lim q^n = \infty$, ha $q > 1$; a $q \leq -1$ esetén divergens (nincs határérték).\nTétel: minden konvergens sorozat korlátos; a monoton és korlátos sorozat konvergens. A $\varepsilon$-os definícióval igazolhatsz egyszerű határértéket: pl. $a_n = \dfrac{2n+1}{n+3} \to 2$, mert $|a_n - 2| = \dfrac{5}{n+3} < \varepsilon$ ha $n > \dfrac{5}{\varepsilon} - 3$.` },
      { h: 'Határértéktételek konvergens sorozatokra', level: 'emelt',
        b: R`Ha $a_n \to A$ és $b_n \to B$ (konvergensek), akkor\n$a_n + b_n \to A + B$, $a_n - b_n \to A - B$, $a_n \cdot b_n \to A \cdot B$, és ha $B \neq 0$ (és $b_n \neq 0$), akkor $\dfrac{a_n}{b_n} \to \dfrac{A}{B}$. Állandóval szorzásnál is igaz: $c \cdot a_n \to c \cdot A$.\nAlkalmazás: racionális törtek határértékénél a nevező legmagasabb $n$-hatványával osztunk, és felhasználjuk, hogy $\dfrac{1}{n^k} \to 0$:\n$$\lim_{n \to \infty} \dfrac{3n^2 + 5n - 2}{n^2 + 4} = \lim \dfrac{3 + \frac{5}{n} - \frac{2}{n^2}}{1 + \frac{4}{n^2}} = \dfrac{3}{1} = 3.$$\nHa a számláló fokszáma nagyobb, a sorozat divergens (a határérték $+\infty$ vagy $-\infty$, a főegyütthatók hányadosának előjele szerint); ha a nevezőé nagyobb, nulla. Vigyázat: a tételt csak akkor használhatod, ha mindkét sorozat konvergens; a $\infty - \infty$ vagy a $\dfrac{\infty}{\infty}$ alakot előbb át kell alakítani.` },
      { h: 'Végtelen mértani sor', level: 'emelt',
        b: R`Az $a_1 + a_1 q + a_1 q^2 + \dots$ **végtelen mértani sor** részletösszegei ($q \neq 1$ esetén) $S_n = a_1 \cdot \dfrac{1 - q^n}{1 - q}$. A sor **konvergens**, ha az $(S_n)$ részletösszeg-sorozat konvergens; ez pontosan akkor teljesül, ha $|q| < 1$ (vagy $a_1 = 0$). Ekkor az **összege**\n$$S = \dfrac{a_1}{1 - q}.$$\nHa $|q| \geq 1$ (és $a_1 \neq 0$), a sor divergens.\nPélda: $1 + \dfrac{1}{2} + \dfrac{1}{4} + \dfrac{1}{8} + \dots = \dfrac{1}{1 - 1/2} = 2$. Periodikus tizedes tört: $0{,}\dot{3} = \dfrac{3}{10} + \dfrac{3}{100} + \dots = \dfrac{3/10}{1 - 1/10} = \dfrac{1}{3}$. Szöveges feladatoknál (pattogó labda, egymásba írt alakzatok) a sor általában az utak, területek összege.` }
    ],
    examples: [
      { t: 'Számtani sorozat összege',
        p: R`Egy számtani sorozat harmadik tagja $7$, nyolcadik tagja $22$. Mennyi a sorozat első $20$ tagjának összege?`,
        steps: [R`Az $a_8 - a_3 = 5d$, ezért $5d = 22 - 7 = 15$, és $d = 3$.`, R`$a_3 = a_1 + 2d$, így $a_1 = 7 - 2 \cdot 3 = 1$.`, R`A huszadik tag: $a_{20} = a_1 + 19d = 1 + 19 \cdot 3 = 58$.`, R`$S_{20} = \dfrac{a_1 + a_{20}}{2} \cdot 20 = \dfrac{1 + 58}{2} \cdot 20 = 590$. Ellenőrzés a másik képlettel: $S_{20} = \dfrac{2 \cdot 1 + 19 \cdot 3}{2} \cdot 20 = \dfrac{59}{2} \cdot 20 = 590$.`],
        ans: R`A sorozat differenciája $3$, első tagja $1$, az első $20$ tag összege $590$.`,
        checks: [['(22-7)/(8-3)', '3'], ['7-2*3', '1'], ['1+19*3', '58'], ['(1+58)/2*20', '590'], ['(2*1+19*3)/2*20', '590']] },
      { t: 'Kamatos kamat',
        p: R`Egy bankban $500\,000$ Ft-ot helyezünk el évi $10\%$-os kamatos kamatra, a kamatot évente tőkésítik. Mennyi lesz a számlán $3$ év múlva? Legalább hány év múlva lesz a számlán több, mint $1\,000\,000$ Ft?`,
        steps: [R`A kamattényező $q = 1 + \dfrac{10}{100} = 1{,}1$. $K_3 = 500\,000 \cdot 1{,}1^3 = 500\,000 \cdot 1{,}331 = 665\,500$ Ft.`, R`Az $500\,000 \cdot 1{,}1^n > 1\,000\,000$ feltételből $1{,}1^n > 2$. Mindkét oldal logaritmusát véve $n \cdot \lg 1{,}1 > \lg 2$, ahonnan $n > \dfrac{\lg 2}{\lg 1{,}1} \approx 7{,}27$.`, R`Mivel $n$ egész, $n \geq 8$. Ellenőrzés: $500\,000 \cdot 1{,}1^7 = 974\,358{,}55$ Ft, ez még nem elég; $500\,000 \cdot 1{,}1^8 = 1\,071\,794{,}405$ Ft, ez már több.`],
        ans: R`$3$ év múlva $665\,500$ Ft lesz a számlán, és legalább $8$ év múlva lesz több, mint $1\,000\,000$ Ft.`,
        checks: [['500000*1.1^3', '665500'], ['500000*1.1^7', '974358.55'], ['500000*1.1^8', '1071794.405']] },
      { t: 'Végtelen mértani sor: pattogó labda (emelt szint)',
        p: R`Egy labdát $2$ m magasról leejtünk. Minden földetérés után az előző magasság $\dfrac{3}{5}$-ére pattan vissza. Mennyi utat tesz meg összesen a labda, amíg megáll (az elméleti modell szerint)?`,
        steps: [R`Az első esés $2$ m. A $k$-adik pattanás után a labda $2 \cdot \left(\dfrac{3}{5}\right)^k$ magasra emelkedik, majd ugyanennyit esik vissza: ez $k \geq 1$-re $2 \cdot 2 \cdot \left(\dfrac{3}{5}\right)^k$ utat jelent.`, R`A pattanások utainak összege mértani sor: első tagja $4 \cdot \dfrac{3}{5} = \dfrac{12}{5}$, hányadosa $q = \dfrac{3}{5}$. Mivel $|q| < 1$, a sor konvergens: $S = \dfrac{12/5}{1 - 3/5} = \dfrac{12/5}{2/5} = 6$.`, R`Az összes út $2 + 6 = 8$ m. Ellenőrzés a másik felbontással: $2 \cdot \dfrac{2 \cdot 3/5}{1 - 3/5} = 2 \cdot 3 = 6$.`],
        ans: R`A labda összesen $8$ métert tesz meg.`,
        checks: [['2*(3/5)/(1-3/5)', '3'], ['4*(3/5)/(1-3/5)', '6'], ['2+2*3', '8']] },
      { t: 'Határérték és küszöbindex (emelt szint)',
        p: R`Legyen $a_n = \dfrac{2n+1}{n+3}$. Határozd meg a sorozat határértékét, majd add meg azt a legkisebb $N$ küszöbindexet, amelytől kezdve minden tagra $|a_n - 2| < 0{,}01$.`,
        steps: [R`Osszuk a számlálót és nevezőt $n$-nel: $a_n = \dfrac{2 + \frac{1}{n}}{1 + \frac{3}{n}}$. Mivel $\dfrac{1}{n} \to 0$, a határértéktételek szerint $a_n \to \dfrac{2}{1} = 2$.`, R`$|a_n - 2| = \left|\dfrac{2n + 1 - 2(n+3)}{n+3}\right| = \dfrac{5}{n+3}$.`, R`$\dfrac{5}{n+3} < 0{,}01 \iff n + 3 > 500 \iff n > 497$. Tehát az $n \geq 498$ tagokra teljesül.`, R`Ellenőrzés: $n = 497$-nél $\dfrac{5}{500} = 0{,}01$, ez nem kisebb; $n = 498$-nál $\dfrac{5}{501} < 0{,}01$.`],
        ans: R`A határérték $2$; a legkisebb jó küszöb: $n \geq 498$.`,
        checks: [['(2x+1)/(x+3)', '(2+1/x)/(1+3/x)'], ['(2x+1)/(x+3)-2', '-5/(x+3)'], ['5/(497+3)', '0.01']] }
    ],
    sims: ['sorozat', 'epszilon-n', 'kamat', 'pokhalo'],
    mistakes: [
      R`A számtani sorozat általános tagjánál $n$-et írsz $(n-1)$ helyett: $a_n = a_1 + (n-1)d$, mert az első tagtól $n - 1$ lépés kell. Ugyanez a mértani $a_1 q^{n-1}$ képletre.`,
      R`A kamatos kamatnál a kamattényezőt $p$-nek veszed: a $5\%$ kamathoz $q = 1{,}05$ tartozik, nem $0{,}05$ és nem $5$.`,
      R`A végtelen mértani sor összegképletét $|q| \geq 1$ esetén is használod: $\dfrac{a_1}{1-q}$ csak $|q| < 1$-re igaz (különben a sor divergens).`,
      R`A határértéktételeket divergens sorozatokra is alkalmazod, vagy $\dfrac{\infty}{\infty}$ alakban egyszerűen „$1$”-et írsz. Előbb alakítsd át (pl. oszd az $n$ legnagyobb hatványával).`,
      R`A gyűjtőjáradék végösszegénél nem tisztázod, hogy a befizetés az időszak elején vagy végén történik: az elején történő befizetés a végösszeget $q$-szorosára növeli.`
    ],
    exam: R`Középszinten a sorozat fogalmát és megadási módjait (utasítás, képlet, rekurzió), a számtani és mértani sorozat $a_n$-re és $S_n$-re vonatkozó összefüggéseit (az összegképletek bizonyításával együtt), a kamatos kamat, gyűjtőjáradék és törlesztőrészlet számítását kéri a követelmény, megtakarítási és hitelfelvételi feladatokkal. Emelt szinten az $a_n$ levezetését, a sorozat jellemzését (monotonitás, korlátosság), a konvergencia szemléletes fogalmát és definícióját egyszerű sorozatokra, a határértéktételek alkalmazását, és az egyszerű végtelen mértani sorokat várják el.`,
    cheat: [R`a_n = a_1 + (n-1)d, \qquad S_n = \dfrac{a_1 + a_n}{2} \cdot n`, R`a_n = a_1 \cdot q^{n-1}, \qquad S_n = a_1 \cdot \dfrac{q^n - 1}{q - 1}`, R`K_n = K_0\left(1 + \dfrac{p}{100}\right)^n`, R`\text{gyűjtőjáradék: } A \cdot \dfrac{q^n - 1}{q - 1}, \qquad T = H q^n \cdot \dfrac{q-1}{q^n - 1}`, R`S = \dfrac{a_1}{1 - q}, \quad |q| < 1`, R`\lim \dfrac{1}{n} = 0, \qquad \lim q^n = 0 \ (|q| < 1)`],
    cheatChecks: [['(a+(a+(n-1)d))/2*n', '(2a+(n-1)d)/2*n'], ['K*(1+p/100)^n', 'K*((100+p)/100)^n'], ['a/(1-q)', 'a*1/(1-q)']],
    terms: ['sorozat', 'rekurzió', 'számtani sorozat', 'differencia', 'mértani sorozat', 'hányados', 'kamatos kamat', 'járadék', 'törlesztőrészlet', 'konvergencia', 'határérték', 'végtelen mértani sor', 'monotonitás', 'korlátosság']
  };

  def('f1-sor-szt', 'fuggvenyek', 'sorozatok', 1, 'Számtani sorozat n-edik tagja', function (r) {
    var a1 = r.int(-9, 9), d = r.nz(-6, 6), n = r.int(5, 30), an = a1 + (n - 1) * d;
    return {
      q: R`Egy számtani sorozat első tagja $${K.T(a1)}$, különbsége $${K.T(d)}$. Mennyi a(z) $${n}$. tagja?`,
      answer: { type: 'num', value: an }, ansTex: K.T(an),
      verify: `${par(a1)}+(${n}-1)*(${par(d)})`,
      tip1: R`Használd az $a_n = a_1 + (n-1)d$ képletet.`,
      tip2: R`Itt $n - 1 = ${n - 1}$.`,
      sol: [R`$a_{${n}} = a_1 + (n-1)d = ${K.T(a1)} + ${n - 1} \cdot ${K.par(d)} = ${K.T(an)}$`]
    };
  });

  def('f1-sor-mertani-tag', 'fuggvenyek', 'sorozatok', 1, 'Mértani sorozat n-edik tagja', function (r) {
    var a1 = r.nz(-5, 5), q = r.pick([2, 3, -2, -3, 4]), n = r.int(4, 7), an = a1 * Math.pow(q, n - 1);
    return {
      q: R`Egy mértani sorozat első tagja $${K.T(a1)}$, hányadosa $${K.T(q)}$. Mennyi a(z) $${n}$. tagja?`,
      answer: { type: 'num', value: an }, ansTex: K.T(an),
      verify: `${par(a1)}*(${par(q)})^(${n}-1)`,
      tip1: R`Használd az $a_n = a_1 \cdot q^{n-1}$ képletet.`,
      tip2: R`Itt a kitevő $n - 1 = ${n - 1}$; a negatív hányadost zárójelbe írd.`,
      sol: [R`$a_{${n}} = a_1 \cdot q^{n-1} = ${K.T(a1)} \cdot ${K.par(q)}^{${n - 1}} = ${K.T(a1)} \cdot ${K.par(Math.pow(q, n - 1))} = ${K.T(an)}$`]
    };
  });

  def('f1-sor-osszeg', 'fuggvenyek', 'sorozatok', 2, 'Számtani sorozat összege', function (r) {
    var a1 = r.int(-10, 10), d = r.nz(-5, 5), n = r.int(8, 25), an = a1 + (n - 1) * d, S = (a1 + an) * n / 2;
    return {
      q: R`Egy számtani sorozat első tagja $${K.T(a1)}$, különbsége $${K.T(d)}$. Mennyi az első $${n}$ tag összege?`,
      answer: { type: 'num', value: S }, ansTex: K.T(S),
      verify: `(2*${par(a1)}+(${n}-1)*(${par(d)}))/2*${n}`,
      tip1: R`Használd az $S_n = \dfrac{a_1 + a_n}{2} \cdot n$ képletet; előbb számold ki az utolsó tagot.`,
      tip2: R`$a_{${n}} = ${K.T(a1)} + ${n - 1} \cdot ${K.par(d)} = ${K.T(an)}$.`,
      sol: [R`$a_{${n}} = a_1 + (n-1)d = ${K.T(an)}$.`, R`$S_{${n}} = \dfrac{${K.T(a1)} + ${K.par(an)}}{2} \cdot ${n} = ${K.T(S)}$`]
    };
  });

  def('f1-sor-rekurziv', 'fuggvenyek', 'sorozatok', 2, 'Rekurzív sorozat tagja', function (r) {
    var a1 = r.int(-3, 5), q = r.pick([2, 3, -2, -3]), d = r.int(-4, 4), k = r.int(4, 6), a = a1, i;
    for (i = 2; i <= k; i++) a = q * a + d;
    var sg = d === 0 ? '' : add(d);
    return {
      q: R`Egy sorozatot rekurzívan adtunk meg: $a_1 = ${K.T(a1)}$, $a_{n+1} = ${K.T(q)} \cdot a_n ${sg}$. Mennyi a(z) $${k}$. tag?`,
      answer: { type: 'num', value: a }, ansTex: K.T(a),
      verify: `(${par(q)})^(${k}-1)*(${par(a1)}+(${par(d)})/(${par(q)}-1))-(${par(d)})/(${par(q)}-1)`,
      tip1: R`Számold ki sorban a tagokat: $a_2$, $a_3$, ... a megadott szabály szerint.`,
      tip2: R`$a_2 = ${K.T(q)} \cdot ${K.par(a1)} ${sg} = ${K.T(q * a1 + d)}$.`,
      sol: (function () { var out = [], x = a1, j; for (j = 2; j <= k; j++) { var y = q * x + d; out.push(R`$a_{${j}} = ${K.T(q)} \cdot ${K.par(x)} ${sg} = ${K.T(y)}$`); x = y; } return out; })()
    };
  });

  def('f1-sor-vegtelen', 'fuggvenyek', 'sorozatok', 2, 'Végtelen mértani sor összege', function (r) {
    var s = r.pick([1, -1]), b = r.pick([2, 3, 4, 5]), t = r.int(1, 6), a1 = (b - s) * t, S = b * t,
      qt = (s < 0 ? '-' : '') + '\\dfrac{1}{' + b + '}';
    return {
      q: R`Egy végtelen mértani sor első tagja $${a1}$, hányadosa $${qt}$. Mennyi a sor összege?`,
      answer: { type: 'num', value: S }, ansTex: K.T(S),
      verify: `${a1}/(1-(${s}/${b}))`,
      tip1: R`Mivel $|q| < 1$, a sor konvergens, és $S = \dfrac{a_1}{1 - q}$.`,
      tip2: R`A nevező: $1 - ${s < 0 ? '(' + qt + ')' : qt} = ${K.q(b - s, b)}$ (tört alakban).`,
      sol: [R`$|q| = \dfrac{1}{${b}} < 1$, ezért a sor konvergens.`, R`$S = \dfrac{a_1}{1 - q} = \dfrac{${a1}}{${K.q(b - s, b)}} = ${K.T(S)}$`]
    };
  });

  def('f1-sor-kamat', 'fuggvenyek', 'sorozatok', 2, 'Kamatos kamat: végösszeg', function (r) {
    var p = r.pick([10, 20]), n = p === 10 ? r.int(2, 4) : r.int(2, 3), K0 = 1000 * r.int(1, 60), v = Math.round(K0 * Math.pow(1 + p / 100, n));
    return {
      q: R`Egy bankbetét éves kamata $${p}\%$, a kamatot évente tőkésítik. Mennyi lesz a számlán $${n}$ év múlva, ha most $${K.B(K0)}$ Ft-ot helyezünk el? (Add meg forintban.)`,
      answer: { type: 'num', value: v, tol: 0.5 }, ansTex: R`${K.B(v)}\ \text{Ft}`,
      verify: `${K0}*((${100 + p})/100)^${n}`,
      tip1: R`Használd a $K_n = K_0 \cdot q^n$ képletet, ahol $q$ a kamattényező.`,
      tip2: R`$q = 1 + \dfrac{${p}}{100} = ${(100 + p) / 100 === 1.1 ? '1{,}1' : '1{,}2'}$.`,
      sol: [R`A kamattényező $q = ${(100 + p) / 100 === 1.1 ? '1{,}1' : '1{,}2'}$.`, R`$K_{${n}} = ${K.B(K0)} \cdot ${(100 + p) / 100 === 1.1 ? '1{,}1' : '1{,}2'}^{${n}} = ${K.B(v)}$ Ft.`]
    };
  });

  def('f1-sor-mono', 'fuggvenyek', 'sorozatok', 2, 'Szigorúan monoton csökkenő sorozat', function (r) {
    var k = r.int(2, 30);
    return {
      q: R`Az alábbi sorozatok közül melyik szigorúan monoton csökkenő? Itt a pozitív szám $${k}$.`,
      answer: K.choice(r, R`$a_n = \dfrac{${k}}{n}$`, [R`$a_n = (-1)^n \cdot ${k}$`, R`$a_n = n + ${k}$`, R`$a_n = ${k} \cdot 2^n$`]),
      ansTex: R`\text{az } a_n = \dfrac{${k}}{n} \text{ sorozat}`,
      tip1: R`Nézd meg, hogy az $a_{n+1}$ kisebb-e, mint $a_n$.`,
      tip2: R`Írd fel az első néhány tagot mind a négy sorozatnál.`,
      sol: [R`$\dfrac{${k}}{n}$ tagjai: $${k}, ${K.q(k, 2)}, \dots$, mindig kisebbek, mert a nevező nő.`, R`A $(-1)^n \cdot ${k}$ váltakozik, az $n + ${k}$ és a $${k} \cdot 2^n$ szigorúan nő.`]
    };
  });

  def('f1-sor-hatarertek', 'fuggvenyek', 'sorozatok', 3, 'Racionális törtsorozat határértéke', function (r) {
    var a = r.int(1, 9), b = r.int(-5, 5), c = r.int(-6, 6), d = r.pick([2, 4, 5]), e = r.int(1, 8), v = a / d;
    return {
      q: R`Számítsd ki a határértéket: $\lim_{n \to \infty} \dfrac{${P(a, b, c, 'n')}}{${P(d, 0, e, 'n')}}$.`,
      answer: { type: 'num', value: v, tol: 0.000001 }, ansTex: K.q(a, d),
      verify: `(${a}+${par(b)}/1000000000+${par(c)}/1000000000000000000)/(${d}+${e}/1000000000000000000)`,
      tip1: R`Oszd a számlálót és a nevezőt is a nevező legmagasabb $n$-hatványával.`,
      tip2: R`Az $\dfrac{1}{n}$ és az $\dfrac{1}{n^2}$ típusú tagok nullához tartanak.`,
      sol: [R`$\dfrac{${P(a, b, c, 'n')}}{${P(d, 0, e, 'n')}} = \dfrac{${a} ${b === 0 ? '' : add(b) + '\\cdot\\frac{1}{n}'} ${c === 0 ? '' : add(c) + '\\cdot\\frac{1}{n^2}'}}{${d} + ${e}\cdot\frac{1}{n^2}}$`, R`Mivel $\dfrac{1}{n} \to 0$ és $\dfrac{1}{n^2} \to 0$, a határértékre a határértéktételek szerint $\dfrac{${a}}{${d}} = ${K.q(a, d)}$ adódik.`]
    };
  });

  def('f1-sor-gyujtojaradek', 'fuggvenyek', 'sorozatok', 3, 'Gyűjtőjáradék végösszege', function (r) {
    var p = r.pick([10, 20]), n = p === 10 ? r.int(3, 4) : 3, A = 1000 * r.int(1, 9), q = (100 + p) / 100, v = Math.round(A * (Math.pow(q, n) - 1) / (q - 1)),
      qs = p === 10 ? '1{,}1' : '1{,}2', terms = [], i;
    for (i = 0; i < n; i++) terms.push(`((${100 + p})/100)^${i}`);
    return {
      q: R`Minden év végén $${K.B(A)}$ Ft-ot fizetünk be egy számlára, amelynek éves kamata $${p}\%$ (a kamat évente tőkésül). Hány forint lesz a számlán a $${n}$. befizetés után közvetlenül? (Egész forintra add meg.)`,
      answer: { type: 'num', value: v, tol: 0.5 }, ansTex: R`${K.B(v)}\ \text{Ft}`,
      verify: `${A}*(${terms.join('+')})`,
      tip1: R`Az utolsó befizetés nem kamatozik, az azt megelőző egy évet, és így tovább: ez mértani sor.`,
      tip2: R`Az összeg: $${A} \cdot (1 + q + q^2 + \dots + q^{${n - 1}})$, ahol $q = ${qs}$.`,
      sol: [R`A kamattényező $q = ${qs}$. A befizetések értéke: $${K.B(A)} \cdot (q^{${n - 1}} + \dots + q + 1)$.`, R`Mértani sorösszeggel: $${K.B(A)} \cdot \dfrac{${qs}^{${n}} - 1}{${qs} - 1} = ${K.B(v)}$ Ft.`]
    };
  });

  def('f1-sor-szt-adott', 'fuggvenyek', 'sorozatok', 3, 'Számtani sorozat összege két adott tagból', function (r) {
    var a1 = r.int(-6, 8), d = r.nz(-4, 4), p = r.int(2, 5), s = p + r.int(2, 5), n = r.int(10, 20),
      ap = a1 + (p - 1) * d, as = a1 + (s - 1) * d, an = a1 + (n - 1) * d, S = (a1 + an) * n / 2,
      dd = `((${par(as)}-(${par(ap)}))/${s - p})`;
    return {
      q: R`Egy számtani sorozat $${p}$. tagja $${K.T(ap)}$, $${s}$. tagja $${K.T(as)}$. Mennyi az első $${n}$ tag összege?`,
      answer: { type: 'num', value: S }, ansTex: K.T(S),
      verify: `${n}/2*((${par(ap)}-${p - 1}*${dd})+(${par(ap)}+${n - p}*${dd}))`,
      tip1: R`Előbb a differenciát számold ki a két tag különbségéből, majd az első tagot.`,
      tip2: R`$a_{${s}} - a_{${p}} = ${s - p}d$.`,
      sol: [R`$${s - p}d = ${K.T(as)} - ${K.par(ap)} = ${K.T(as - ap)}$, tehát $d = ${K.T(d)}$.`, R`$a_1 = a_{${p}} - ${p === 2 ? '' : p - 1}d = ${K.T(a1)}$, és $a_{${n}} = a_1 + ${n - 1}d = ${K.T(an)}$.`, R`$S_{${n}} = \dfrac{${K.T(a1)} + ${K.par(an)}}{2} \cdot ${n} = ${K.T(S)}$`]
    };
  });

  def('f1-sor-kuszob', 'fuggvenyek', 'sorozatok', 3, 'Küszöbindex a határértékhez', function (r) {
    var p = r.int(1, 5), s = r.int(1, 6), k = r.nz(-3, 3), rr = p * s + k, A = Math.abs(k), N = 100 * A - s + 1;
    return {
      q: R`Az $a_n = \dfrac{${P(0, p, rr, 'n')}}{n + ${s}}$ sorozat határértéke $${p}$. Add meg a legkisebb olyan $n$ pozitív egészet, amelytől kezdve minden tagra $|a_n - ${p}| < 0{,}01$.`,
      answer: { type: 'num', value: N }, ansTex: K.T(N),
      verify: `${A}/0.01-${s}+1`,
      tip1: R`Számítsd ki az $|a_n - ${p}|$ értékét egy közös törtben, hogy egyszerű alakot kapj.`,
      tip2: R`$|a_n - ${p}| = \dfrac{${A}}{n + ${s}}$. Ennek kell kisebbnek lennie, mint $0{,}01$.`,
      sol: [R`$a_n - ${p} = \dfrac{${P(0, p, rr, 'n')} - ${p === 1 ? '' : p}(n + ${s})}{n + ${s}} = \dfrac{${K.T(k)}}{n + ${s}}$, abszolút értéke $\dfrac{${A}}{n + ${s}}$ (mert $n + ${s} > 0$).`, R`$\dfrac{${A}}{n + ${s}} < 0{,}01 \iff n + ${s} > ${100 * A} \iff n > ${100 * A - s}$.`, R`A legkisebb ilyen egész szám: $n = ${N}$.`]
    };
  });
})(typeof window !== 'undefined' ? window : globalThis);
