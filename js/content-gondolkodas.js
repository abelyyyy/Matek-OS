/* MATEK OS – 1. Gondolkodási módszerek: halmazok, logika, kombinatorika, gráfok (tananyag és feladatgenerátorok). */
(function (root) {
  'use strict';
  var MO = root.MO = root.MO || {};
  var K = MO.taskKit, R = K.R, def = K.def, Q = MO.Q;
  MO.content = MO.content || {};

  /* ================= 1.1 HALMAZOK ================= */
  MO.content['gondolkodas/halmazok'] = {
    intro: R`A halmaz a matematika legalapvetőbb építőköve: egy dolgokból álló „gyűjtemény”, amelyről mindig egyértelműen eldönthető, hogy egy adott dolog beletartozik-e. Ebben a fejezetben megtanulod megadni a halmazokat, műveleteket végezni velük (unió, metszet, különbség, komplementer), megszámolni az elemeiket a logikai szita elvével, emelt szinten pedig a de Morgan-azonosságokat és a végtelen halmazok számosságát is. A követelmény 1.1 és 1.1.2 pontjában szerepel, és sok témakörben (szöveges feladatok, valószínűség, függvények értelmezési tartománya) halmazokkal fogalmazunk.`,
    theory: [
      { h: 'A halmaz és megadási módjai',
        b: R`A **halmaz** jól meghatározott dolgok összessége; a dolgokat a halmaz **elemeinek** nevezzük. Azt, hogy $a$ eleme az $A$ halmaznak, így írjuk: $a \in A$, ha nem eleme: $a \notin A$. Egy elem egy halmazban csak egyszer számít, és a sorrend mindegy.\n\nMegadási módok:\n- **felsorolás:** $A = \{1; 2; 3; 6\}$\n- **tulajdonsággal:** $A = \{x \in \mathbb{N}^+ \mid x \text{ osztója } 6\text{-nak}\}$\n- **szöveggel:** „a hat pozitív osztói”\n- **szemléltetés:** Venn-diagram, számegyenes, koordináta-rendszer.\n\nA számhalmazok jelei: $\mathbb{N}$ (természetes), $\mathbb{Z}$ (egész), $\mathbb{Q}$ (racionális), $\mathbb{R}$ (valós számok).` },
      { h: 'Részhalmaz, egyenlőség, üres halmaz, komplementer',
        b: R`- $A$ **részhalmaza** $B$-nek ($A \subseteq B$), ha $A$ minden eleme $B$-nek is eleme.\n- Két halmaz **egyenlő**, ha ugyanazok az elemeik; ekkor $A \subseteq B$ és $B \subseteq A$ is igaz.\n- Az **üres halmaz** ($\emptyset$) egyetlen elemet sem tartalmaz; minden halmaznak részhalmaza.\n- **Véges** a halmaz, ha az elemeinek száma egy természetes szám, különben **végtelen**.\n- Ha adott egy **alaphalmaz** $H$, és $A \subseteq H$, akkor $A$ **komplementere** (kiegészítő halmaza) a $H$ azon elemeiből áll, amelyek nincsenek $A$-ban: $\overline{A}$. Elemszáma: $|\overline{A}| = |H| - |A|$.\n\nFigyelj: a komplementer mindig az alaphalmazhoz képest értendő, ezért az alaphalmazt ki kell kötni.` },
      { h: 'Halmazműveletek: unió, metszet, különbség',
        b: R`- **Unió:** $A \cup B$ azok az elemek, amelyek $A$-ban **vagy** $B$-ben (vagy mindkettőben) benne vannak.\n- **Metszet:** $A \cap B$ azok az elemek, amelyek **mindkét** halmazban benne vannak. Ha $A \cap B = \emptyset$, a két halmaz **diszjunkt**.\n- **Különbség:** $A \setminus B$ az $A$ azon elemei, amelyek nincsenek $B$-ben. Általában $A \setminus B \neq B \setminus A$.\n\nPéldául $A = \{1; 2; 3; 4\}$, $B = \{3; 4; 5\}$ esetén $A \cup B = \{1; 2; 3; 4; 5\}$, $A \cap B = \{3; 4\}$, $A \setminus B = \{1; 2\}$, $B \setminus A = \{5\}$.\n\n**Ponthalmazok a koordináta-rendszerben:** a síkon az $\{(x; y) \mid y > x\}$ halmaz az $y = x$ egyenes feletti nyílt félsík; két feltétel „és” kapcsolata a két halmaz metszete (pl. $y > x$ és $x > 0$), a „vagy” kapcsolata az uniójuk. Szigorú egyenlőtlenségnél a határvonal nem tartozik a halmazhoz (szaggatott vonal), egyenlőségnél igen.` },
      { h: 'De Morgan-azonosságok', level: 'emelt',
        b: R`Az $H$ alaphalmazban, $A, B \subseteq H$ esetén:\n$$\overline{A \cup B} = \overline{A} \cap \overline{B}, \qquad \overline{A \cap B} = \overline{A} \cup \overline{B}$$\nSzavakkal: az unió komplementere a komplementerek metszete, a metszet komplementere a komplementerek uniója. Ugyanez igaz a logikában a „vagy” és az „és” tagadására.\n\nHaszna: bonyolult „nem ... vagy nem ...” feltételeket egyszerűbb alakra hozhatsz, és a komplementer elemszámát is könnyebb számolni.`,
        proof: R`Legyen $x \in H$ tetszőleges. $x \in \overline{A \cup B}$ pontosan akkor, ha $x \notin A \cup B$, vagyis $x \notin A$ és $x \notin B$, ez pontosan az, hogy $x \in \overline{A} \cap \overline{B}$. Tehát a két halmaz elemei megegyeznek. A második azonosság ugyanígy igazolható (x nincs a metszetben, ha legalább az egyikben nincs benne), vagy az elsőből: az $\overline{A}$ és $\overline{B}$ halmazokra alkalmazva az elsőt, majd komplementert véve.` },
      { h: 'Számosság és részhalmazok száma',
        b: R`Egy véges $A$ halmaz elemeinek számát **számosságnak** (elemszámnak) nevezzük, jele $|A|$.\n\nEgy $n$ elemű halmaz részhalmazainak száma $2^n$ (az üres halmazzal és magával a halmazzal együtt). Indok: minden elemről külön döntjük el, hogy bekerül-e a részhalmazba (2 lehetőség), így a döntések száma $2 \cdot 2 \cdots 2 = 2^n$.\n\nA $k$ elemű részhalmazok száma $\binom{n}{k}$ (lásd a kombinatorikát). **Valódi részhalmaz:** az $A$-tól különböző részhalmaz; így $n$ elemű halmaznak $2^n - 1$ valódi részhalmaza van.` },
      { h: 'A logikai szita elve',
        b: R`Két halmaz uniójának elemszáma:\n$$|A \cup B| = |A| + |B| - |A \cap B|$$\nA közös elemeket az összeadáskor kétszer számoltuk, ezért egyszer levonjuk.\n\nHárom halmazra:\n$$|A \cup B \cup C| = |A| + |B| + |C| - |A \cap B| - |A \cap C| - |B \cap C| + |A \cap B \cap C|$$\nA hármas metszetet háromszor számoltuk be, háromszor vontuk le, ezért egyszer vissza kell adni.\n\nGyakorlati tipp: rajzolj Venn-diagramot, és **a középső (hármas) metszettől kifelé** töltsd ki a tartományokat. Azokat, akik egyik halmazban sincsenek, az alaphalmaz elemszámából az unió elemszámát levonva kapod.` },
      { h: 'Végtelen halmazok, megszámlálhatóság', level: 'emelt',
        b: R`Egy végtelen halmaz **megszámlálhatóan végtelen**, ha elemei sorozatba rendezhetők, azaz létezik kölcsönösen egyértelmű megfeleltetés (bijekció) a halmaz és a pozitív egészek $\mathbb{N}^+$ halmaza között. Ilyen: $\mathbb{N}$, $\mathbb{Z}$, a páros számok halmaza, és $\mathbb{Q}$ is. Ez azért meglepő, mert a páros számok valódi részhalmazai az egészeknek, mégis „ugyanannyian” vannak.\n\nA **nem megszámlálhatóan végtelen** halmaz „nagyobb”: ilyen a valós számok $\mathbb{R}$ halmaza és bármely nem elfajuló intervallum, pl. $[0; 1]$.\n\nPéldák: véges halmaz: a hét napjai; megszámlálhatóan végtelen: a pozitív páros számok; nem megszámlálhatóan végtelen: a $[0; 1]$ intervallum.`,
        proof: R`A pozitív páros számok megszámlálhatóan végtelenek: az $f(n) = 2n$ megfeleltetés az $n$-hez a $2n$-et rendeli; ez minden pozitív egészhez pontosan egy párost rendel, és minden pozitív páros szám pontosan egy $n$ képe. Az egész számok is: a $0; 1; -1; 2; -2; \dots$ sorrend mindegyiket pontosan egyszer sorolja fel, a megfelelő hozzárendelés $g(n) = n/2$ páros $n$-re és $g(n) = -(n-1)/2$ páratlan $n$-re.` }
    ],
    examples: [
      { t: 'Két halmaz: sportolók az osztályban',
        p: R`Egy $30$ fős osztályban $18$ tanuló focizik, $15$ kosarazik, és $7$ tanuló mindkét sportot űzi. Hányan nem sportolnak egyik sportot sem?`,
        steps: [R`Legyen $F$ a focizók, $K$ a kosarazók halmaza: $|F| = 18$, $|K| = 15$, $|F \cap K| = 7$.`,
          R`A logikai szita szerint a legalább egy sportot űzők száma: $|F \cup K| = 18 + 15 - 7 = 26$.`,
          R`A komplementer elemszáma: $30 - 26 = 4$.`,
          R`Ellenőrzés Venn-diagrammal: csak foci $11$, csak kosár $8$, mindkettő $7$, ez együtt $26$, és $26 + 4 = 30$.`],
        ans: R`Négy tanuló nem sportol egyik sportot sem.`,
        checks: [['18+15-7', '26'], ['30-26', '4'], ['(18-7)+(15-7)+7', '26']] },
      { t: 'Három halmaz: nyelvtanulás',
        p: R`Egy $100$ fős évfolyamon angolul $40$-en, németül $35$-en, franciául $30$-an tanulnak. Angolul és németül is $15$, angolul és franciául is $12$, németül és franciául is $10$ diák tanul, mindhárom nyelvet $5$-en. Hányan nem tanulnak egyik nyelvet sem? Hányan tanulnak pontosan egy nyelvet?`,
        steps: [R`A szita három halmazra: $|A \cup N \cup F| = 40 + 35 + 30 - 15 - 12 - 10 + 5 = 73$.`,
          R`Egyik nyelvet sem tanulja: $100 - 73 = 27$ diák.`,
          R`Pontosan két nyelvet tanulók: a páronkénti metszetekből a hármast levonjuk: $(15 - 5) + (12 - 5) + (10 - 5) = 22$.`,
          R`Pontosan egy nyelvet tanulók: $73 - 22 - 5 = 46$.`,
          R`Ellenőrzés: csak angol $40 - 10 - 7 - 5 = 18$, csak német $35 - 10 - 5 - 5 = 15$, csak francia $30 - 7 - 5 - 5 = 13$; összesen $18 + 15 + 13 = 46$.`],
        ans: R`$27$ diák nem tanul egyik nyelvet sem, és $46$ diák tanul pontosan egy nyelvet.`,
        checks: [['40+35+30-15-12-10+5', '73'], ['100-73', '27'], ['(15-5)+(12-5)+(10-5)', '22'], ['73-22-5', '46'], ['(40-10-7-5)+(35-10-5-5)+(30-7-5-5)', '46']] },
      { t: 'Az egész számok megszámlálhatósága (emelt)',
        p: R`Bizonyítsd be, hogy az egész számok halmaza megszámlálhatóan végtelen!`,
        steps: [R`Meg kell adni egy kölcsönösen egyértelmű megfeleltetést $\mathbb{N}^+$ és $\mathbb{Z}$ között, azaz az egészeket sorba kell rendezni úgy, hogy mindegyik pontosan egyszer szerepeljen.`,
          R`A sorrend: $0; 1; -1; 2; -2; 3; -3; \dots$ Képlettel: $g(n) = \dfrac{n}{2}$, ha $n$ páros; $g(n) = -\dfrac{n-1}{2}$, ha $n$ páratlan.`,
          R`Próba: $g(1) = 0$, $g(2) = 1$, $g(3) = -1$, $g(6) = 3$, $g(7) = -3$.`,
          R`Minden pozitív egész $k$ pontosan egyszer szerepel: $g(2k) = k$; minden negatív $-k$ is: $g(2k+1) = -k$; a $0$ pedig $g(1)$. Így $g$ kölcsönösen egyértelmű.`],
        ans: R`Az egész számok sorba rendezhetők, ezért $\mathbb{Z}$ megszámlálhatóan végtelen.`,
        checks: [['6/2', '3'], ['-(7-1)/2', '-3'], ['-(1-1)/2', '0'], ['-(3-1)/2', '-1']] }
    ],
    sims: ['venn', 'szita'],
    mistakes: [R`Az unió elemszámánál elfelejted levonni a metszetet: $|A \cup B| \neq |A| + |B|$, csak diszjunkt halmazokra.`,
      R`A „nem sportol egyik sportot sem” és a „nem mindkettőt sportolja” különböző halmaz: az első $\overline{A \cup B}$, a második $\overline{A \cap B}$.`,
      R`Három halmaznál elfelejted a hármas metszetet visszaadni a végén: ez az összeg utolsó, pozitív tagja.`,
      R`A komplementert alaphalmaz nélkül számolod: $\overline{A}$ mindig valamihez képest értendő.`,
      R`Az üres halmazt és a $\{0\}$ halmazt összekeverik: az üres halmaznak nincs eleme, a $\{0\}$-nak egy eleme van, a $0$. Az üres halmaz számossága $0$, részhalmazainak száma $1$.`,
      R`A de Morgan-azonosságnál nem cseréled ki a műveletet: $\overline{A \cup B} = \overline{A} \cap \overline{B}$ (és nem $\overline{A} \cup \overline{B}$).`],
    exam: R`Közép- és emelt szinten is követelmény a halmazok megadása, az egyenlőség, részhalmaz, üres halmaz, véges és végtelen halmaz, komplementer fogalma, az unió, metszet, különbség, az egyszerűbb ponthalmazok ábrázolása koordináta-rendszerben, a véges halmaz elemszámának meghatározása és a logikai szita két-három halmazra. Emelt szinten ismerned kell a de Morgan-azonosságokat, példát kell mondanod véges, megszámlálhatóan végtelen és nem megszámlálhatóan végtelen halmazra, ismerned a megszámlálhatóan végtelen halmaz definícióját, és egyszerűbb esetben be kell bizonyítanod egy halmaz megszámlálható végtelenségét.`,
    cheat: [R`|A \cup B| = |A| + |B| - |A \cap B|`, R`|\overline{A}| = |H| - |A|`, R`|A \setminus B| = |A| - |A \cap B|`,
      R`\overline{A \cup B} = \overline{A} \cap \overline{B}, \quad \overline{A \cap B} = \overline{A} \cup \overline{B}`,
      R`|A \cup B \cup C| = |A| + |B| + |C| - |A \cap B| - |A \cap C| - |B \cap C| + |A \cap B \cap C|`, R`\text{egy } n \text{ elemű halmaz részhalmazainak száma: } 2^n`],
    cheatChecks: [['2^5', '32'], ['binom(5;0)+binom(5;1)+binom(5;2)+binom(5;3)+binom(5;4)+binom(5;5)', '2^5'], ['15+12-5', '22']],
    terms: ['halmaz', 'elem', 'részhalmaz', 'üres halmaz', 'komplementer', 'unió', 'metszet', 'különbség', 'diszjunkt', 'logikai szita', 'de Morgan', 'számosság', 'megszámlálhatóan végtelen', 'Venn-diagram']
  };

  def('gm-hal-1', 'gondolkodas', 'halmazok', 1, 'Két halmaz uniójának elemszáma', function (r) {
    var m = r.int(2, 9), a = m + r.int(2, 15), b = m + r.int(2, 15), u = a + b - m;
    return {
      q: R`Az $A$ halmaznak $${a}$, a $B$ halmaznak $${b}$ eleme van, a közös elemek száma $${m}$. Hány eleme van az $A \cup B$ halmaznak?`,
      answer: { type: 'num', value: u }, ansTex: K.T(u),
      verify: `${a}+${b}-${m}`,
      tip1: R`Használd a logikai szitát két halmazra.`,
      tip2: R`A közös elemeket az összeadáskor kétszer számoltad, ezért egyszer vond le őket.`,
      sol: [R`$|A \cup B| = |A| + |B| - |A \cap B| = ${a} + ${b} - ${m} = ${u}$`, R`Az unió elemszáma $${u}$.`]
    };
  });

  def('gm-hal-2', 'gondolkodas', 'halmazok', 1, 'Részhalmazok száma', function (r) {
    var n = r.int(3, 10), v = Math.pow(2, n), kind = r.int(0, 1);
    var ans = kind ? v - 1 : v;
    return {
      q: kind ? R`Egy halmaznak $${n}$ eleme van. Hány valódi részhalmaza van? (Valódi részhalmaz: a halmaztól különböző részhalmaz, az üres halmazt is beleértve.)`
              : R`Egy halmaznak $${n}$ eleme van. Hány részhalmaza van (az üres halmazt és magát a halmazt is beleértve)?`,
      answer: { type: 'num', value: ans }, ansTex: K.T(ans),
      verify: kind ? `2^${n}-1` : `2^${n}`,
      tip1: R`Minden elemről külön döntheted el, hogy bekerül-e a részhalmazba.`,
      tip2: R`Minden elemnél $2$ lehetőség van, így a részhalmazok száma $2^{${n}}$.` + (kind ? ' Ebből vond le a halmaz önmagát.' : ''),
      sol: [R`Egy $n$ elemű halmaz részhalmazainak száma $2^n = 2^{${n}} = ${v}$.`].concat(kind ? [R`A valódi részhalmazok száma ennél eggyel kevesebb: $${v} - 1 = ${v - 1}$.`] : [])
    };
  });

  def('gm-hal-3', 'gondolkodas', 'halmazok', 2, 'Egyik halmazban sem lévők száma', function (r) {
    var m = r.int(2, 8), a = m + r.int(3, 14), b = m + r.int(3, 14), z = r.int(2, 12), n = a + b - m + z;
    var what = r.pick([['angol', 'német'], ['foci', 'kosárlabda'], ['sakk', 'rajz']]);
    return {
      q: R`Egy csoport létszáma $${n}$. A(z) ${what[0]} szakkörre $${a}$ fő, a(z) ${what[1]} szakkörre $${b}$ fő jár, mindkettőre $${m}$ fő. Hányan nem járnak egyik szakkörre sem?`,
      answer: { type: 'num', value: z }, ansTex: K.T(z),
      verify: `${n}-${a}-${b}+${m}`,
      tip1: R`Előbb számold ki, hányan csinálnak legalább egyet a kettő közül.`,
      tip2: R`A legalább egyet csinálók száma $|A \cup B| = ${a} + ${b} - ${m}$; ezt vond ki az összlétszámból.`,
      sol: [R`$|A \cup B| = ${a} + ${b} - ${m} = ${a + b - m}$`, R`Egyiket sem csinálja: $${n} - ${a + b - m} = ${z}$.`, R`Ellenőrzés: $${a + b - m} + ${z} = ${n}$.`]
    };
  });

  def('gm-hal-4', 'gondolkodas', 'halmazok', 2, 'De Morgan-azonosság', function (r) {
    var uni = r.int(0, 1) === 0, nm = r.pick([['A', 'B'], ['P', 'Q'], ['X', 'Y'], ['M', 'N'], ['S', 'T'], ['F', 'G'], ['U', 'V'], ['C', 'D']]), x = nm[0], y = nm[1];
    var cx = '\\overline{' + x + '}', cy = '\\overline{' + y + '}';
    var and = cx + ' \\cap ' + cy, or = cx + ' \\cup ' + cy;
    var good = uni ? and : or;
    var bad = uni ? [or, '\\overline{' + x + ' \\cap ' + y + '}', x + ' \\cap ' + y] : [and, '\\overline{' + x + ' \\cup ' + y + '}', x + ' \\cup ' + y];
    var f = function (t) { return '$' + t + '$'; };
    return {
      q: uni ? R`Melyik halmaz egyenlő az $\overline{${x} \cup ${y}}$ halmazzal (az alaphalmazon belül)?` : R`Melyik halmaz egyenlő az $\overline{${x} \cap ${y}}$ halmazzal (az alaphalmazon belül)?`,
      answer: K.choice(r, f(good), bad.map(f)), ansTex: good,
      tip1: R`Gondolj a de Morgan-azonosságokra.`,
      tip2: uni ? R`Az unió komplementere azok az elemek, amelyek egyikben sincsenek benne.` : R`A metszet komplementere azok az elemek, amelyek legalább az egyikből hiányoznak.`,
      sol: uni ? [R`$z \in \overline{${x} \cup ${y}}$ pontosan akkor, ha $z \notin ${x}$ és $z \notin ${y}$.`, R`Ez azt jelenti, hogy $z \in ${and}$.`]
               : [R`$z \in \overline{${x} \cap ${y}}$ pontosan akkor, ha $z$ nincs benne mindkettőben, azaz $z \notin ${x}$ vagy $z \notin ${y}$.`, R`Ez azt jelenti, hogy $z \in ${or}$.`]
    };
  });

  function regions(r) {
    var t = r.int(1, 6), ab = r.int(1, 7), ac = r.int(1, 7), bc = r.int(1, 7), a1 = r.int(2, 12), b1 = r.int(2, 12), c1 = r.int(2, 12);
    return { t: t, ab: ab + t, ac: ac + t, bc: bc + t, A: a1 + ab + ac + t, B: b1 + ab + bc + t, C: c1 + ac + bc + t, one: a1 + b1 + c1, uni: a1 + b1 + c1 + ab + ac + bc + t };
  }
  function given3(g) {
    return R`$|A| = ${g.A}$, $|B| = ${g.B}$, $|C| = ${g.C}$, $|A \cap B| = ${g.ab}$, $|A \cap C| = ${g.ac}$, $|B \cap C| = ${g.bc}$, $|A \cap B \cap C| = ${g.t}$`;
  }

  def('gm-hal-5', 'gondolkodas', 'halmazok', 3, 'Három halmaz uniója (szita)', function (r) {
    var g = regions(r);
    return {
      q: R`Adott: ${given3(g)}. Hány eleme van az $A \cup B \cup C$ halmaznak?`,
      answer: { type: 'num', value: g.uni }, ansTex: K.T(g.uni),
      verify: `${g.A}+${g.B}+${g.C}-${g.ab}-${g.ac}-${g.bc}+${g.t}`,
      tip1: R`Alkalmazd a logikai szitát három halmazra.`,
      tip2: R`Az elemszámok összegéből vond le a három páronkénti metszetet, majd add hozzá a hármas metszetet.`,
      sol: [R`$|A \cup B \cup C| = ${g.A} + ${g.B} + ${g.C} - ${g.ab} - ${g.ac} - ${g.bc} + ${g.t}$`, R`$= ${g.uni}$`]
    };
  });

  def('gm-hal-6', 'gondolkodas', 'halmazok', 3, 'Pontosan egy halmazban lévők száma', function (r) {
    var g = regions(r);
    return {
      q: R`Adott: ${given3(g)}. Hány olyan elem van, amely a három halmaz közül pontosan egyben van benne?`,
      answer: { type: 'num', value: g.one }, ansTex: K.T(g.one),
      verify: `${g.A}+${g.B}+${g.C}-2*(${g.ab}+${g.ac}+${g.bc})+3*${g.t}`,
      tip1: R`Töltsd ki a Venn-diagram tartományait a hármas metszettől kifelé.`,
      tip2: R`Pontosan két halmazban van: $|A \cap B| - |A \cap B \cap C|$ és a hasonlók. A „csak $A$” tartomány: $|A|$ mínusz a másik két halmazzal közös rész, mivel a hármas metszet mindkét páronkénti metszetben benne van, azt egyszer vissza kell adni.`,
      sol: [R`Csak $A$-ban: $${g.A} - ${g.ab} - ${g.ac} + ${g.t} = ${g.A - g.ab - g.ac + g.t}$`, R`Csak $B$-ben: $${g.B} - ${g.ab} - ${g.bc} + ${g.t} = ${g.B - g.ab - g.bc + g.t}$`, R`Csak $C$-ben: $${g.C} - ${g.ac} - ${g.bc} + ${g.t} = ${g.C - g.ac - g.bc + g.t}$`,
        R`Összesen $${g.one}$ ilyen elem van.`]
    };
  });

  /* ================= 1.2 MATEMATIKAI LOGIKA ================= */
  MO.content['gondolkodas/logika'] = {
    intro: R`A matematikai logika a pontos gondolkodás nyelve: megmondja, mikor igaz egy állítás, hogyan kell helyesen tagadni, mit jelent a „ha ..., akkor ...”, és hogyan lehet valamit bizonyítani. A követelmény 1.2 pontja a tagadást, az „és”, „vagy”, „kizáró vagy” műveleteket, a feltételes és az ekvivalencia-állításokat, a „minden” és „van olyan” kifejezéseket, a megfordítást, az 1.2.1 pont pedig a bizonyítási módszereket (direkt, indirekt, skatulyaelv, teljes indukció) és a szükséges, elégséges feltételt kéri. Más témakörökben is szükséged lesz rá: az „igazold” típusú feladatoknál ezeket használod.`,
    theory: [
      { h: 'Állítás, igazságérték, tagadás',
        b: R`**Állításnak** nevezzük az olyan kijelentést, amelyről egyértelműen eldönthető, hogy igaz vagy hamis (ez az **igazságértéke**). „A $7$ prímszám” igaz állítás, „a $9$ prímszám” hamis; „Szép idő van” nem állítás.\n\nAz $A$ állítás **tagadása** ($\neg A$, „nem $A$”) pontosan akkor igaz, ha $A$ hamis. A tagadás a halmazok komplementerének felel meg. Tagadásnál a szó szerinti „nem” beszúrása helyett érdemes az állítás jelentését megfordítani: az „$x$ pozitív” tagadása „$x \le 0$”, nem „$x$ negatív” (a $0$ is lehet).\n\nA kétszeres tagadás az eredeti állítást adja: $\neg(\neg A) = A$.` },
      { h: 'Összetett állítások: és, vagy, kizáró vagy',
        b: R`Két állítást ($A$, $B$) összekapcsolhatunk:\n- **„és”** ($A \wedge B$): akkor igaz, ha mindkettő igaz; a halmazok metszetének felel meg.\n- **megengedő „vagy”** ($A \vee B$): akkor igaz, ha legalább az egyik igaz (akár mindkettő); az unió megfelelője. A matematikában a „vagy” alapesetben ez.\n- **kizáró „vagy”**: akkor igaz, ha pontosan az egyik igaz; a szimmetrikus differenciának, $(A \setminus B) \cup (B \setminus A)$ felel meg.\n\nTagadásuk (de Morgan): $\neg(A \wedge B) = \neg A \vee \neg B$, és $\neg(A \vee B) = \neg A \wedge \neg B$.\n\nKét állítás igazságtáblája $4$ sorból áll, $n$ állításé $2^n$ sorból.` },
      { h: 'Feltételes állítás és ekvivalencia',
        b: R`A **„ha $A$, akkor $B$”** állítás ($A \Rightarrow B$) csak akkor hamis, ha $A$ igaz, de $B$ hamis. Ha $A$ hamis, az állítás igaz (üres ígéret). Tagadása: $A$ igaz **és** $B$ hamis.\n\nAz **„akkor és csak akkor”** állítás ($A \Leftrightarrow B$) pontosan akkor igaz, ha $A$ és $B$ igazságértéke megegyezik; ez a „ha $A$, akkor $B$” és a „ha $B$, akkor $A$” együtt.\n\nA „ha $A$, akkor $B$” állítás **megfordítása**: „ha $B$, akkor $A$”. A két állítás igazságértéke általában független: „ha egy szám osztható $6$-tal, akkor osztható $3$-mal” igaz, a megfordítása („ha osztható $3$-mal, akkor osztható $6$-tal”) hamis, ellenpélda: $9$. A **kontrapozíció** ($\neg B \Rightarrow \neg A$) viszont az eredetivel mindig egyenértékű.` },
      { h: 'Kvantorok: „minden” és „van olyan”',
        b: R`- **„Minden $x$-re igaz, hogy ...”** ($\forall$): akkor igaz, ha egyetlen kivétel sincs; megdönteni **egy ellenpéldával** lehet.\n- **„Van olyan $x$, amelyre ...”** ($\exists$): akkor igaz, ha találunk **egy** példát; megdönteni csak úgy lehet, ha mindegyik elemre megmutatjuk, hogy nem teljesül.\n\nTagadásuk:\n- „Minden $x$-re $P(x)$” tagadása: „van olyan $x$, amelyre nem $P(x)$”.\n- „Van olyan $x$, hogy $P(x)$” tagadása: „minden $x$-re nem $P(x)$”.\n\nPélda: „Minden diák kapott ötöst” tagadása: „Van olyan diák, aki nem kapott ötöst” (és nem az, hogy „minden diák ötös nélkül maradt”).` },
      { h: 'Definíció, tétel, fordított tétel, szükséges és elégséges feltétel',
        b: R`A **definíció** egy fogalom pontos megadása, a **tétel** bizonyított állítás, jellemzően „ha ..., akkor ...” alakú: a feltétel az, amit adottnak veszünk, az állítás az, amit be kell látni. Egy tétel **megfordítása** nem biztos, hogy igaz. Ha a tétel és a megfordítása is igaz, **„akkor és csak akkor”** alakban mondhatók ki.\n\nHa $A \Rightarrow B$ igaz, akkor $A$ **elégséges** feltétele $B$-nek (elég, hogy $A$ teljesüljön), $B$ pedig **szükséges** feltétele $A$-nak (ha $B$ nincs meg, $A$ sem lehet). Ha $A \Leftrightarrow B$, akkor mindegyik szükséges és elégséges feltétele a másiknak.\n\nPélda: „Egy szám osztható $6$-tal” elégséges feltétele annak, hogy páros; „páros” szükséges feltétele a $6$-tal oszthatóságnak, de nem elégséges.`, level: 'emelt' },
      { h: 'Direkt és indirekt bizonyítás, skatulyaelv', level: 'emelt',
        b: R`- **Direkt bizonyítás:** a feltételből ismert tételekkel lépésről lépésre eljutunk az állításig.\n- **Indirekt bizonyítás:** feltesszük az állítás **tagadását**, és ebből ellentmondásra jutunk; így a tagadás hamis, az állítás igaz. Jó, ha az állítás „nincs olyan ...” vagy „irracionális” alakú.\n- **Skatulyaelv:** ha $n$ tárgyat $k$ skatulyába helyezünk és $n > k$, akkor van olyan skatulya, amelyben legalább két tárgy van. Általánosabban: ha $n > k \cdot m$, akkor van olyan skatulya, amelyben legalább $m + 1$ tárgy van.\n\nA skatulyaelv csak a létezést bizonyítja, azt nem mondja meg, melyik skatulyáról van szó.`,
        proof: R`Indirekt példa: „ha $n^2$ páros, akkor $n$ páros”. Tegyük fel, hogy $n^2$ páros, de $n$ páratlan, $n = 2k+1$. Ekkor $n^2 = 4k^2 + 4k + 1$ páratlan, ez ellentmond annak, hogy $n^2$ páros. Tehát $n$ páros. A skatulyaelvhez: ha mindegyik skatulyában legfeljebb $m$ tárgy lenne, akkor összesen legfeljebb $k m$ tárgy lenne, de $n > k m$; ez ellentmondás.` },
      { h: 'Teljes indukció', level: 'emelt',
        b: R`A teljes indukcióval a természetes számokra vonatkozó $P(n)$ állítást bizonyítjuk, két lépésben:\n1. **Alapeset:** $P(n_0)$ igaz (általában $n_0 = 1$).\n2. **Indukciós lépés:** tetszőleges $k \ge n_0$ esetén, ha $P(k)$ igaz (indukciós feltevés), akkor $P(k+1)$ is igaz.\n\nEkkor $P(n)$ minden $n \ge n_0$ természetes számra igaz, mint a dominó: az első eldől, és mindegyik eldöntése a következőt is eldönti. Mindkét lépés kötelező: ha az alapeset hiányzik, a lépés önmagában semmit sem bizonyít.`,
        proof: R`Példa: $1 + 3 + 5 + \dots + (2n-1) = n^2$. Alapeset: $n = 1$-re $1 = 1^2$. Lépés: ha $1 + 3 + \dots + (2k-1) = k^2$, akkor $1 + 3 + \dots + (2k-1) + (2k+1) = k^2 + 2k + 1 = (k+1)^2$, ami az állítás $k+1$-re.` }
    ],
    examples: [
      { t: 'Feltétel, megfordítás, igazságérték',
        p: R`Add meg a következő állítás megfordítását, és döntsd el mindkettő igazságértékét: „Ha egy egész szám osztható $6$-tal, akkor osztható $3$-mal.”`,
        steps: [R`Az eredeti: $6$-tal osztható $\Rightarrow$ $3$-mal osztható. Mivel $6 = 2 \cdot 3$, minden $6$-tal osztható szám $3$-mal is osztható: pl. $12 : 6 = 2$ és $12 : 3 = 4$. Az állítás igaz.`,
          R`A megfordítás: „Ha egy egész szám osztható $3$-mal, akkor osztható $6$-tal.”`,
          R`Egy „minden”-állítás hamisságához elég egy ellenpélda: a $9$ osztható $3$-mal, mert $9 : 3 = 3$, de nem osztható $6$-tal, mert $9 : 6 = 1{,}5$ nem egész.`],
        ans: R`Az eredeti állítás igaz, a megfordítása hamis (ellenpélda: $9$). A $6$-tal oszthatóság elégséges, de nem szükséges feltétele a $3$-mal oszthatóságnak.`,
        checks: [['12/6', '2'], ['12/3', '4'], ['9/3', '3'], ['9/6', '1,5']] },
      { t: 'Kvantoros állítás tagadása, ellenpélda',
        p: R`Igaz-e, hogy minden pozitív egész $n$-re az $n^2 + n + 41$ szám prím? Fogalmazd meg az állítás tagadását is.`,
        steps: [R`Az állítás: „minden pozitív egész $n$-re $n^2 + n + 41$ prím”. Tagadása: „van olyan pozitív egész $n$, amelyre $n^2 + n + 41$ nem prím”.`,
          R`Egy „minden”-állítás hamisságához elég egy ellenpélda. Ha $n = 40$, akkor $40^2 + 40 + 41 = 1681$.`,
          R`Mivel $41^2 = 1681$, a kapott szám a $41$ négyzete, tehát nem prím.`],
        ans: R`Az állítás hamis, mert $n = 40$-re $1681 = 41^2$ nem prím. A tagadás igaz: van olyan $n$, amelyre a szám nem prím. (Az első $39$ pozitív egészre a szám mindig prím, de ez még nem bizonyítás.)`,
        checks: [['40^2+40+41', '1681'], ['41^2', '1681'], ['41^2+41+41', '41*43']] },
      { t: 'Bizonyítás teljes indukcióval (emelt)',
        p: R`Bizonyítsd be teljes indukcióval, hogy minden pozitív egész $n$-re $1 + 2 + 3 + \dots + n = \dfrac{n(n+1)}{2}$.`,
        steps: [R`**Alapeset:** $n = 1$ esetén a bal oldal $1$, a jobb oldal $\dfrac{1 \cdot 2}{2} = 1$, egyenlők.`,
          R`**Indukciós feltevés:** valamely $k \ge 1$-re $1 + 2 + \dots + k = \dfrac{k(k+1)}{2}$.`,
          R`**Indukciós lépés:** $1 + 2 + \dots + k + (k+1) = \dfrac{k(k+1)}{2} + (k+1) = \dfrac{k(k+1) + 2(k+1)}{2} = \dfrac{(k+1)(k+2)}{2}$.`,
          R`Ez pontosan az állítás $k+1$-re: $\dfrac{(k+1)((k+1)+1)}{2}$. Az alapeset és a lépés alapján az állítás minden pozitív egész $n$-re igaz.`,
          R`Számpróba: $n = 4$-re $1 + 2 + 3 + 4 = 10 = \dfrac{4 \cdot 5}{2}$.`],
        ans: R`Teljes indukcióval beláttuk, hogy $1 + 2 + \dots + n = \dfrac{n(n+1)}{2}$ minden pozitív egész $n$-re.`,
        checks: [['k(k+1)/2+(k+1)', '(k+1)(k+2)/2'], ['1+2+3+4', '4*5/2'], ['1*2/2', '1']] }
    ],
    sims: ['igazsagtabla', 'bizonyitasi-semak', 'venn'],
    mistakes: [R`A „ha $A$, akkor $B$” állítás megfordítását az eredetivel egyenértékűnek hiszed. Nem az: a megfordítás külön ellenőrzendő (kontrapozíciója az, ami mindig egyenértékű).`,
      R`A „minden” tagadását „egyik sem”-nek mondod. A helyes tagadás: „van olyan, amelyre nem”.`,
      R`A „vagy”-ot kizárónak értelmezed: a matematikában a sima „vagy” megengedő, azaz mindkettő is lehet igaz.`,
      R`Ellenpéldából „bizonyítasz” igazat: egy példa „minden”-állítást nem bizonyít, csak megdönt; „van olyan”-állítást viszont egy példa bizonyít.`,
      R`Teljes indukciónál az alapesetet kihagyod, vagy az indukciós lépésben már a bizonyítandót használod fel.`,
      R`Összekevered a szükséges és az elégséges feltételt: ha $A \Rightarrow B$, akkor $A$ az elégséges, $B$ a szükséges feltétel.`],
    exam: R`Közép- és emelt szinten követelmény a matematikai szövegek értelmezése, a tagadás, az „és”, a megengedő és a kizáró „vagy” jelentése és kapcsolata a halmazműveletekkel, a „ha ..., akkor ...” és az „akkor és csak akkor” állítások igazságértéke, a „minden” és „van olyan” helyes használata, a definíciók és tételek pontos kimondása, egyszerű állítások bizonyítása, igaz-hamis eldöntése és a megfordítás megfogalmazása. Emelt szinten ismerned kell a direkt és indirekt bizonyítást, a skatulyaelvet és a teljes indukciót (példával), a szükséges, elégséges, szükséges és elégséges feltételt, és konkrét tételek megfordítását.`,
    cheat: [R`\neg(A \wedge B) = \neg A \vee \neg B`, R`\neg(A \vee B) = \neg A \wedge \neg B`, R`A \Rightarrow B \text{ hamis} \iff A \text{ igaz és } B \text{ hamis}`,
      R`A \Rightarrow B \equiv \neg B \Rightarrow \neg A`, R`\neg(\forall x\, P(x)) = \exists x\, \neg P(x), \quad \neg(\exists x\, P(x)) = \forall x\, \neg P(x)`, R`n > k \cdot m \Rightarrow \text{van skatulya, ahol legalább } m + 1 \text{ tárgy van}`],
    cheatChecks: [['2^3', '8'], ['k(k+1)/2+(k+1)', '(k+1)(k+2)/2']],
    terms: ['állítás', 'igazságérték', 'tagadás', 'konjunkció (és)', 'megengedő vagy', 'kizáró vagy', 'implikáció', 'ekvivalencia', 'megfordítás', 'kontrapozíció', 'kvantor', 'ellenpélda', 'szükséges feltétel', 'elégséges feltétel', 'indirekt bizonyítás', 'skatulyaelv', 'teljes indukció']
  };

  def('gm-log-1', 'gondolkodas', 'logika', 1, 'Igazságtábla sorainak száma', function (r) {
    var n = r.int(2, 15), v = Math.pow(2, n);
    return {
      q: R`Egy összetett állítás $${n}$ különböző egyszerű állításból áll. Hány sora van az igazságtábláján?`,
      answer: { type: 'num', value: v }, ansTex: K.T(v),
      verify: `2^${n}`,
      tip1: R`Minden egyszerű állítás igaz vagy hamis lehet.`,
      tip2: R`Minden állításnál $2$ lehetőség van, a sorok száma ezek szorzata.`,
      sol: [R`Minden állítás $2$ értéket vehet fel, így a sorok száma $2^{${n}} = ${v}$.`]
    };
  });

  def('gm-log-2', 'gondolkodas', 'logika', 1, 'Állítás megfordítása', function (r) {
    var m = r.pick([3, 4, 5, 6, 7, 9]), a = r.pick([2, 3, 4, 5]), p = a * m, f = function (x, y) { return R`„Ha egy egész szám osztható a(z) $${x}$ számmal, akkor osztható a(z) $${y}$ számmal.”`; };
    return {
      q: R`Mi a megfordítása a következő állításnak? ${f(p, m)}`,
      answer: K.choice(r, f(m, p), [R`„Ha egy egész szám nem osztható a(z) $${p}$ számmal, akkor nem osztható a(z) $${m}$ számmal.”`, R`„Ha egy egész szám nem osztható a(z) $${m}$ számmal, akkor nem osztható a(z) $${p}$ számmal.”`, R`„Van olyan egész szám, amely osztható a(z) $${p}$ számmal, de nem osztható a(z) $${m}$ számmal.”`]),
      ansTex: R`\text{a feltétel és az állítás felcserélve}`,
      tip1: R`A megfordításban a feltétel és a következmény helyet cserél.`,
      tip2: R`A „ha $A$, akkor $B$” megfordítása „ha $B$, akkor $A$”.`,
      sol: [R`Az eredeti: $A$ = „osztható a(z) $${p}$ számmal”, $B$ = „osztható a(z) $${m}$ számmal”, a tétel $A \Rightarrow B$.`, R`A megfordítás $B \Rightarrow A$: ha osztható a(z) $${m}$ számmal, akkor osztható a(z) $${p}$ számmal.`, R`(Ez hamis, a(z) $${m}$ maga ellenpélda; a megfordítás nem egyenértékű az eredetivel.)`]
    };
  });

  def('gm-log-3', 'gondolkodas', 'logika', 2, 'Hamis implikációk száma', function (r) {
    var pr = r.pick([[2, 3], [2, 4], [3, 2], [3, 4], [4, 3], [4, 6], [6, 4], [5, 2], [3, 5], [2, 5], [6, 3], [2, 6]]), a = pr[0], b = pr[1], l = MO.lcm(a, b), k = r.int(2, 5), N = l * k, cnt = 0;
    for (var i = 1; i <= N; i++) if (i % a === 0 && i % b !== 0) cnt++;
    return {
      q: R`Az $n$ szám az $1$ és $${N}$ közötti pozitív egészek (a határokat is beleértve) egyike. Hány olyan $n$ van, amelyre a „ha $n$ osztható a(z) $${a}$ számmal, akkor $n$ osztható a(z) $${b}$ számmal” állítás hamis?`,
      answer: { type: 'num', value: cnt }, ansTex: K.T(cnt),
      verify: `${N}/${a}-${N}/${l}`,
      tip1: R`Egy „ha $A$, akkor $B$” állítás akkor hamis, ha $A$ igaz és $B$ hamis.`,
      tip2: R`Számold meg a(z) $${a}$ többszöröseit, és vond le közülük azokat, amelyek a(z) $${b}$ számmal is oszthatók (ezek a(z) $${l}$ többszörösei).`,
      sol: [R`Hamis, ha $n$ osztható a(z) $${a}$ számmal, de nem osztható a(z) $${b}$ számmal.`, R`A(z) $${a}$ többszörösei: $${N / a}$ db. Ezek közül a(z) $${b}$ számmal is oszthatók (azaz $${l}$ többszörösei): $${N / l}$ db.`, R`A hamis esetek száma: $${N / a} - ${N / l} = ${cnt}$.`]
    };
  });

  def('gm-log-4', 'gondolkodas', 'logika', 2, 'Kvantoros állítás tagadása', function (r) {
    var g = r.pick(['ötöst', 'négyest', 'hármast', 'kettest']), pq = r.pick([[7, 11], [5, 13], [3, 8], [4, 9]]), h = r.pick([170, 180, 190]);
    var sh = r.pick([['derékszöge', 'derékszöge'], ['két egyenlő oldala', 'két egyenlő oldala'], ['tompaszöge', 'tompaszöge']]);
    var P = '$' + pq[0] + '$', Q2 = '$' + pq[1] + '$', H = '$' + h + '$';
    var T = r.pick([
      ['Minden diák kapott ' + g, 'Van olyan diák, aki nem kapott ' + g, ['Egyik diák sem kapott ' + g, 'Minden diák kapott nem ' + g, 'Van olyan diák, aki kapott ' + g]],
      ['Van olyan pozitív egész szám, amely osztható a(z) ' + P + ' számmal és a(z) ' + Q2 + ' számmal', 'Minden pozitív egész szám vagy nem osztható a(z) ' + P + ' számmal, vagy nem osztható a(z) ' + Q2 + ' számmal', ['Minden pozitív egész szám osztható a(z) ' + P + ' számmal és a(z) ' + Q2 + ' számmal', 'Van olyan pozitív egész szám, amely nem osztható a(z) ' + P + ' számmal és nem osztható a(z) ' + Q2 + ' számmal', 'Van olyan pozitív egész szám, amely nem osztható a(z) ' + P + ' számmal vagy nem osztható a(z) ' + Q2 + ' számmal']],
      ['Minden háromszögnek van ' + sh[0], 'Van olyan háromszög, amelynek nincs ' + sh[1], ['Egyik háromszögnek sincs ' + sh[0], 'Van olyan háromszög, amelynek van ' + sh[0], 'Minden háromszögnek nincs ' + sh[0]]],
      ['Van olyan sor, amelyben mindenki magasabb ' + H + ' cm-nél', 'Minden sorban van olyan, aki legfeljebb ' + H + ' cm magas', ['Minden sorban mindenki magasabb ' + H + ' cm-nél', 'Van olyan sor, amelyben mindenki legfeljebb ' + H + ' cm magas', 'Minden sorban van olyan, aki magasabb ' + H + ' cm-nél']]
    ]);
    return {
      q: R`Melyik az alábbi állítás tagadása? „${T[0]}.”`,
      answer: K.choice(r, '„' + T[1] + '.”', T[2].map(function (x) { return '„' + x + '.”'; })), ansTex: R`\text{a „minden” és a „van olyan” felcserélve, a tulajdonság tagadva}`,
      tip1: R`A „minden” tagadása nem az „egyik sem”.`,
      tip2: R`A „minden” tagadása „van olyan, amelyre nem”; a „van olyan” tagadása „minden esetben nem”.`,
      sol: [R`A kvantor megfordul (a „minden” „van olyan”-ra, a „van olyan” „minden”-re cserélődik), és a kijelentés tagadott lesz.`, R`Az „és” tagadása „vagy nem ... vagy nem”, a „vagy” tagadása „és nem ... és nem” (de Morgan).`, R`Ezért a helyes tagadás: „${T[1]}.”`]
    };
  });

  def('gm-log-5', 'gondolkodas', 'logika', 3, 'Skatulyaelv: hány kell?', function (r) {
    var k = r.int(3, 12), m = r.int(1, 5), ans = k * m + 1;
    var what = r.pick([['golyó', 'színű golyó van, mindegyik színből bőven', 'azonos színű'], ['diák', 'hónapban születhet egy diák (feltesszük, hogy a hónapok egyformán lehetségesek)', 'azonos hónapban született']]);
    var q = what[0] === 'golyó'
      ? R`Egy dobozban $${k}$ különböző színű golyó van, mindegyik színből bőven. Legkevesebb hányat kell vakon kihúzni ahhoz, hogy biztosan legyen közöttük $${m + 1}$ azonos színű?`
      : R`Egy évben $12$ hónap van. Legkevesebb hány embernek kell lennie egy teremben ahhoz, hogy biztosan legyen közöttük $${m + 1}$, aki ugyanabban a hónapban született?`;
    if (what[0] !== 'golyó') { k = 12; ans = 12 * m + 1; }
    return {
      q: q, answer: { type: 'num', value: ans }, ansTex: K.T(ans),
      verify: `${k}*${m}+1`,
      tip1: R`Gondolj a legrosszabb esetre: mikor kerülnénk a legkésőbb célba?`,
      tip2: R`A legrosszabb esetben minden színből (hónapból) pontosan $${m}$ darab van, még éppen nincs meg a kívánt szám. Ennyi után a következő már biztosan megoldja.`,
      sol: [R`A „skatulyák” száma $${k}$. A legrosszabb esetben mindegyikben $${m}$ tárgy van: összesen $${k} \cdot ${m} = ${k * m}$ tárgy, és még nincs $${m + 1}$ azonos.`, R`Eggyel több tárgynál a skatulyaelv szerint már lesz olyan skatulya, amelyben legalább $${m + 1}$ van.`, R`A szükséges létszám: $${k * m} + 1 = ${ans}$.`]
    };
  });

  def('gm-log-6', 'gondolkodas', 'logika', 3, 'Négyzetösszeg (teljes indukcióhoz)', function (r) {
    var n = r.int(3, 20), s = 0, i;
    for (i = 1; i <= n; i++) s += i * i;
    return {
      q: R`Teljes indukcióval bizonyítható, hogy $1^2 + 2^2 + \dots + n^2 = \dfrac{n(n+1)(2n+1)}{6}$ minden pozitív egész $n$-re. Mennyi $1^2 + 2^2 + \dots + ${n}^2$?`,
      answer: { type: 'num', value: s }, ansTex: K.T(s),
      verify: `${n}*(${n}+1)*(2*${n}+1)/6`,
      tip1: R`Helyettesítsd be az $n$ értékét a bizonyított képletbe.`,
      tip2: R`Itt $n + 1 = ${n + 1}$ és $2n + 1 = ${2 * n + 1}$.`,
      sol: [R`$\dfrac{n(n+1)(2n+1)}{6} = \dfrac{${n} \cdot ${n + 1} \cdot ${2 * n + 1}}{6} = ${s}$`, R`Ellenőrzés: a tagok összeadásával is $${s}$ jön ki.`]
    };
  });

  /* ================= 1.3 KOMBINATORIKA ================= */
  MO.content['gondolkodas/kombinatorika'] = {
    intro: R`A kombinatorika a „hányféleképpen” kérdések tudománya: sorbarendezések, kiválasztások, kódok, csapatok megszámolása. Az alapötlet mindössze két szabály (szorzás és összeadás), amelyből a permutáció, variáció és kombináció képletei következnek. A követelmény 1.3 pontja közép- és emelt szinten is kéri az egyszerű sorbarendezési és kiválasztási feladatokat, a komplementer eseteken át számolást és a binomiális együtthatókat; emelt szinten ismerned és bizonyítanod kell a képleteket, alkalmaznod a binomiális tételt, és ismerned a Pascal-háromszöget. A valószínűségszámítás számolásai is erre épülnek.`,
    theory: [
      { h: 'Összeadási és szorzási szabály, gráfos szemlélet',
        b: R`- **Szorzási szabály:** ha egy választás $a$ féleképpen, és bármelyikük után a következő $b$ féleképpen tehető meg, akkor a kettő együtt $a \cdot b$ féleképpen. Több lépésnél a lehetőségek száma szorzódik.\n- **Összeadási szabály:** ha két, egymást kizáró eset van, $a$ és $b$ lehetőséggel, az összes eset $a + b$.\n\nFa-diagrammal (vagy a lépések felsorolásával) szemléltethető. Mindig kérdezd meg: számít-e a **sorrend**, és **ismétlődhet-e** elem? Ezek döntik el, melyik típusról van szó.` },
      { h: 'Permutációk (sorbarendezések)',
        b: R`**Ismétlés nélküli permutáció:** $n$ különböző elem összes sorrendje $P_n = n! = n(n-1)\cdots 2 \cdot 1$, és $0! = 1$.\n\n**Ismétléses permutáció:** ha az $n$ elem között $k_1$, $k_2$, ..., $k_r$ egyforma van ($k_1 + \dots + k_r = n$), a különböző sorrendek száma\n$$P_n^{k_1; k_2; \dots; k_r} = \frac{n!}{k_1!\, k_2! \cdots k_r!}$$\nPélda: a MAMA szó betűinek különböző sorrendjei: $\dfrac{4!}{2!\,2!} = 6$.`,
        proof: R`Az $n$ különböző elem első helyére $n$, a másodikra $n-1$, ..., az utolsóra $1$ elem választható, így a szorzási szabály szerint $n!$ sorrend van. Ismétlésnél gondoljuk az egyforma elemeket megkülönböztetettnek: ekkor $n!$ sorrend van, de az egyforma elemek egymás közti $k_1!$, $k_2!$, ... felcserélései ugyanazt a (valódi) sorrendet adják, ezért az $n!$-t a $k_1!\,k_2!\cdots$ szorzattal osztani kell.` },
      { h: 'Variációk (kiválasztás sorrenddel)',
        b: R`$n$ különböző elemből $k$ darabot választunk úgy, hogy a **sorrend számít**.\n- **Ismétlés nélkül:** $V_n^k = \dfrac{n!}{(n-k)!} = n(n-1)\cdots(n-k+1)$ (pl. $n$ versenyző közül az első $k$ helyezett).\n- **Ismétléssel:** $V_n^{k,\text{ism}} = n^k$ (pl. $k$ jegyű kód $n$ számjegyből, ahol a jegyek ismétlődhetnek).`,
        proof: R`Ismétlés nélkül az első helyre $n$, a másodikra $n-1$, ..., a $k$-adikra $n-k+1$ elem választható; a szorzat éppen $\dfrac{n!}{(n-k)!}$. Ismétléssel minden helyre $n$ elem kerülhet, így $n \cdot n \cdots n = n^k$.` },
      { h: 'Kombinációk és binomiális együtthatók',
        b: R`$n$ különböző elemből $k$ darabot választunk úgy, hogy a **sorrend nem számít** (ismétlés nélkül): $C_n^k = \dbinom{n}{k} = \dfrac{n!}{k!\,(n-k)!}$. Ezek a **binomiális együtthatók** ($0 \le k \le n$).\n\nTulajdonságok: $\dbinom{n}{0} = \dbinom{n}{n} = 1$, $\dbinom{n}{1} = n$, $\dbinom{n}{k} = \dbinom{n}{n-k}$ (szimmetria: kiválasztani és kihagyni ugyanannyiféleképpen lehet), és $\dbinom{n}{k} + \dbinom{n}{k+1} = \dbinom{n+1}{k+1}$.\n\nPélda: az ötöslottó $\binom{90}{5}$ féle húzással jár, a kéttagú bizottság $12$ emberből $\binom{12}{2} = 66$.`,
        proof: R`A $k$ elemű sorrendes kiválasztások ($V_n^k$) úgy is megszámolhatók, hogy először kiválasztjuk a $k$ elemet ($C_n^k$ féleképpen), majd sorba rendezzük őket ($k!$ féleképpen): $V_n^k = C_n^k \cdot k!$. Ebből $C_n^k = \dfrac{n!}{(n-k)!\,k!}$.` },
      { h: 'Komplementer módszer és gyakorlati tippek',
        b: R`Ha a kedvező esetek közvetlen megszámolása sok esetszétválasztást kíván („legalább egy ...”, „nem mind ...”), számold meg inkább az **összes** esetet és a **nem kedvezőket**, és vond ki:\n$$\text{kedvező} = \text{összes} - \text{nem kedvező}$$\nPélda: $12$ emberből (ebből $7$ fiú) $4$ fős csoportban legalább egy lány: $\binom{12}{4} - \binom{7}{4}$.\n\nTippek: döntsd el előre, hogy sorrendes-e a feladat; „egymás mellett” esetén kezeld a párt egy elemként (és szorozd a belső sorrendjeivel); „kezdőszám nem lehet nulla” típusú megkötést előbb tedd meg.` },
      { h: 'A Pascal-háromszög', level: 'emelt',
        b: R`A **Pascal-háromszög** $n$-edik sorának ($n = 0; 1; 2; \dots$) elemei a $\dbinom{n}{0}, \dbinom{n}{1}, \dots, \dbinom{n}{n}$ binomiális együtthatók: $1$; $1\; 1$; $1\; 2\; 1$; $1\; 3\; 3\; 1$; $1\; 4\; 6\; 4\; 1$; ...\n\nAlapvető tulajdonságai:\n- minden elem a fölötte lévő két elem összege: $\dbinom{n}{k} + \dbinom{n}{k+1} = \dbinom{n+1}{k+1}$;\n- a sorok szimmetrikusak: $\dbinom{n}{k} = \dbinom{n}{n-k}$;\n- az $n$-edik sor elemeinek összege $2^n$.`,
        proof: R`Összegtulajdonság: az $n+1$ elemű halmaz $k+1$ elemű részhalmazai között azok, amelyek tartalmazzák a kiszemelt elemet, $\binom{n}{k}$ féle, amelyek nem, $\binom{n}{k+1}$ féle; együtt $\binom{n+1}{k+1}$. A sorösszeg: az $n$ elemű halmaz összes részhalmazainak száma $2^n$, és ezt a méret szerint szétosztva az összeg $\binom{n}{0} + \dots + \binom{n}{n}$.` },
      { h: 'A binomiális tétel', level: 'emelt',
        b: R`Bármely $a$, $b$ valós számra és pozitív egész $n$-re:\n$$(a + b)^n = \sum_{k=0}^{n} \binom{n}{k} a^{n-k} b^k$$\nPéldául $(a+b)^3 = a^3 + 3a^2 b + 3 a b^2 + b^3$. Az $a^{n-k}b^k$ együtthatója $\binom{n}{k}$, vagyis a Pascal-háromszög $n$-edik sora. Ha $a = b = 1$, az együtthatók összege $2^n$.`,
        proof: R`A $(a+b)^n$ szorzatban $n$ tényező van, és mindegyikből vagy $a$-t, vagy $b$-t választunk. Az $a^{n-k} b^k$ tag akkor keletkezik, ha $n$ tényezőből pontosan $k$-ból $b$-t választunk; ezt $\binom{n}{k}$ féleképpen tehetjük meg. A tagok összegzésével kapjuk a tételt.` }
    ],
    examples: [
      { t: 'Ötjegyű számok különböző számjegyekkel',
        p: R`Hány olyan ötjegyű pozitív egész szám van, amelynek minden számjegye különböző?`,
        steps: [R`Az első számjegy nem lehet $0$, így $9$ lehetőség van ($1$–$9$).`,
          R`A második számjegy bármi lehet a $10$ számjegyből, kivéve az elsőt: $9$ lehetőség (a $0$ most már szabad). Harmadiknak $8$, negyediknek $7$, ötödiknek $6$ lehetőség marad.`,
          R`A szorzási szabály szerint: $9 \cdot 9 \cdot 8 \cdot 7 \cdot 6 = 27\,216$.`,
          R`Ellenőrzés komplementerrel: nulla kezdőszámmal is számolva $10 \cdot 9 \cdot 8 \cdot 7 \cdot 6 = 30\,240$ ötjegyű sorozat van, ebből $9 \cdot 8 \cdot 7 \cdot 6 = 3024$ kezdődik $0$-val; $30\,240 - 3024 = 27\,216$.`],
        ans: R`Összesen $27\,216$ ilyen szám van.`,
        checks: [['9*9*8*7*6', '27216'], ['10*9*8*7*6', '30240'], ['9*8*7*6', '3024'], ['30240-3024', '27216']] },
      { t: 'Bizottság, komplementer módszerrel',
        p: R`Egy $12$ fős csoportban $7$ fiú és $5$ lány van. Hányféleképpen választható ki közülük egy $4$ fős bizottság úgy, hogy legalább egy lány legyen benne?`,
        steps: [R`Az összes $4$ fős bizottság száma (a sorrend nem számít): $\dbinom{12}{4} = \dfrac{12 \cdot 11 \cdot 10 \cdot 9}{24} = 495$.`,
          R`A „legalább egy lány” komplementere „csak fiúk”: $\dbinom{7}{4} = 35$ bizottság.`,
          R`A kedvező esetek száma: $495 - 35 = 460$.`,
          R`Ellenőrzés közvetlenül: $1$ lány: $5 \cdot \binom{7}{3} = 175$; $2$ lány: $\binom{5}{2}\binom{7}{2} = 210$; $3$ lány: $\binom{5}{3} \cdot 7 = 70$; $4$ lány: $\binom{5}{4} = 5$. Összesen $175 + 210 + 70 + 5 = 460$.`],
        ans: R`A bizottságot $460$ féleképpen lehet kiválasztani.`,
        checks: [['12*11*10*9/24', '495'], ['binom(12;4)', '495'], ['binom(7;4)', '35'], ['495-35', '460'], ['5*binom(7;3)+binom(5;2)*binom(7;2)+binom(5;3)*7+binom(5;4)', '460']] },
      { t: 'Binomiális tétel: együttható (emelt)',
        p: R`Mennyi a $(2x + 3)^5$ kifejtésében az $x^3$ együtthatója? Mennyi az összes együttható összege?`,
        steps: [R`A binomiális tétel szerint $(2x+3)^5 = \sum_{k=0}^{5} \binom{5}{k} (2x)^{k} \cdot 3^{5-k}$. Az $x^3$-t a $k = 3$ tag adja.`,
          R`Az együttható: $\dbinom{5}{3} \cdot 2^3 \cdot 3^2 = 10 \cdot 8 \cdot 9 = 720$.`,
          R`Az együtthatók összegét az $x = 1$ behelyettesítés adja: $(2 + 3)^5 = 5^5 = 3125$.`,
          R`Ellenőrzés a Pascal-háromszög $5$. sorával ($1; 5; 10; 10; 5; 1$): $\binom{5}{3} = 10$, és $\binom{5}{2} + \binom{5}{3} = 20 = \binom{6}{3}$.`],
        ans: R`Az $x^3$ együtthatója $720$, az együtthatók összege $3125$.`,
        checks: [['binom(5;3)*2^3*3^2', '720'], ['10*8*9', '720'], ['(2+3)^5', '3125'], ['binom(5;2)+binom(5;3)', 'binom(6;3)']] },
      { t: 'Ismétléses permutáció',
        p: R`Hány különböző sorrendben írhatók le a MATEMATIKA szó betűi?`,
        steps: [R`A szó $10$ betűs; az M $2$-szer, az A $3$-szor, a T $2$-szer fordul elő, az E, I, K egyszer.`,
          R`Ismétléses permutáció: $\dfrac{10!}{2!\,3!\,2!} = \dfrac{3\,628\,800}{24} = 151\,200$.`,
          R`Ellenőrzés: ha minden betűt megkülönböztetnénk, $10! = 3\,628\,800$ sorrend lenne; ezt az egyforma betűk felcserélései ($2 \cdot 6 \cdot 2 = 24$) szerint osztottuk.`],
        ans: R`$151\,200$ különböző sorrend van.`,
        checks: [['fakt(10)/(fakt(2)*fakt(3)*fakt(2))', '151200'], ['3628800/24', '151200']] }
    ],
    sims: ['kombinatorika', 'binomialis'],
    mistakes: [R`Összekevered a sorrendes és a sorrend nélküli kiválasztást: a lottóhúzás kombináció ($\binom{90}{5}$), a dobogós helyezés variáció.`,
      R`Az ismétléses és az ismétlés nélküli képletet felcseréled: a kód ($n^k$) ismétlődhet, a különböző jegyű szám nem.`,
      R`Kombinációnál elfelejted osztani $k!$-sal, vagy permutációnál az egyforma elemek $k!$-ával.`,
      R`„Legalább egy” típusú feladatnál sok esetet számolsz külön: egyszerűbb az összes esetből kivonni azt, amikor egy sincs (komplementer módszer).`,
      R`A számjegyes feladatoknál az első helyen nem engeded meg a $0$-t, vagy éppen elfelejted: egy $n$ jegyű szám nem kezdődhet $0$-val.`,
      R`Binomiális tételnél elfelejted az $a$ és $b$ együtthatóját is hatványozni: $(2x+3)^5$-ben a $2$-t és a $3$-at is a megfelelő hatványra kell emelni.`],
    exam: R`Közép- és emelt szinten is követelmény az egyszerű sorbarendezési, kiválasztási és egyéb kombinatorikai feladatok megoldása, a kedvező esetek számának meghatározása komplementer esetek segítségével is, és a binomiális együtthatók kiszámolása. Emelt szinten ismerned, bizonyítanod és alkalmaznod kell a permutáció (ismétlés nélkül és ismétléssel), a variáció (ismétlés nélkül és ismétléssel) és a kombináció (ismétlés nélkül) képleteit, ismerned és alkalmaznod kell a binomiális tételt, és ismerned kell a Pascal-háromszöget és alapvető tulajdonságait.`,
    cheat: [R`P_n = n!, \qquad P_n^{k_1; k_2; \dots} = \dfrac{n!}{k_1!\,k_2! \cdots}`, R`V_n^k = \dfrac{n!}{(n-k)!}, \qquad V_n^{k,\text{ism}} = n^k`, R`C_n^k = \dbinom{n}{k} = \dfrac{n!}{k!\,(n-k)!}`,
      R`\dbinom{n}{k} = \dbinom{n}{n-k}, \qquad \dbinom{n}{k} + \dbinom{n}{k+1} = \dbinom{n+1}{k+1}`, R`(a+b)^n = \sum_{k=0}^{n} \dbinom{n}{k} a^{n-k} b^k`, R`\dbinom{n}{0} + \dbinom{n}{1} + \dots + \dbinom{n}{n} = 2^n`],
    cheatChecks: [['binom(7;3)', 'fakt(7)/(fakt(3)*fakt(4))'], ['binom(7;3)', 'binom(7;4)'], ['binom(6;2)+binom(6;3)', 'binom(7;3)'], ['fakt(7)/fakt(7-3)', '7*6*5'], ['binom(4;0)+binom(4;1)+binom(4;2)+binom(4;3)+binom(4;4)', '2^4']],
    terms: ['szorzási szabály', 'permutáció', 'variáció', 'kombináció', 'faktoriális', 'ismétléses permutáció', 'ismétléses variáció', 'binomiális együttható', 'Pascal-háromszög', 'binomiális tétel', 'komplementer módszer']
  };


  def('gm-kom-1', 'gondolkodas', 'kombinatorika', 1, 'Sorbarendezések száma', function (r) {
    var n = r.int(4, 9), v = 1, i;
    for (i = 2; i <= n; i++) v *= i;
    var who = r.pick(['könyvet', 'gyereket', 'színes golyót', 'különböző matricát']);
    return {
      q: R`Hányféle sorrendben lehet egy polcra felsorakoztatni $${n}$ különböző ${who}?`,
      answer: { type: 'num', value: v }, ansTex: K.T(v),
      verify: `fakt(${n})`,
      tip1: R`Ez az ismétlés nélküli permutáció.`,
      tip2: R`Az első helyre $${n}$, a másodikra $${n - 1}$ lehetőség van, és így tovább.`,
      sol: [R`$P_{${n}} = ${n}! = ${v}$`]
    };
  });

  def('gm-kom-2', 'gondolkodas', 'kombinatorika', 1, 'Binomiális együttható kiszámítása', function (r) {
    var n = r.int(5, 12), k = r.int(2, n - 2), num = 1, i;
    for (i = 0; i < k; i++) num = num * (n - i) / (i + 1);
    return {
      q: R`Számítsd ki: $\dbinom{${n}}{${k}}$`,
      answer: { type: 'num', value: num }, ansTex: K.T(num),
      verify: `fakt(${n})/(fakt(${k})*fakt(${n - k}))`,
      tip1: R`$\dbinom{n}{k} = \dfrac{n!}{k!\,(n-k)!}$`,
      tip2: R`Itt $n - k = ${n - k}$. Egyszerűsíthetsz is: a nagyobb faktoriális egy részét kiejtheted.`,
      sol: [R`$\dbinom{${n}}{${k}} = \dfrac{${n}!}{${k}! \cdot ${n - k}!} = ${K.T(num)}$`, R`Szimmetria-ellenőrzés: $\dbinom{${n}}{${n - k}}$ ugyanennyi.`]
    };
  });

  def('gm-kom-3', 'gondolkodas', 'kombinatorika', 2, 'Ismétléses permutáció', function (r) {
    var a = r.int(2, 4), b = r.int(2, 3), c = r.int(1, 3), n = a + b + c, f = function (x) { var v = 1, i; for (i = 2; i <= x; i++) v *= i; return v; };
    var v = f(n) / (f(a) * f(b) * f(c));
    return {
      q: R`Egy sorba $${a}$ egyforma piros, $${b}$ egyforma kék és $${c}$ egyforma zöld golyót teszünk. Hány különböző színsorrend lehetséges?`,
      answer: { type: 'num', value: v }, ansTex: K.T(v),
      verify: `fakt(${n})/(fakt(${a})*fakt(${b})*fakt(${c}))`,
      tip1: R`Ismétléses permutációról van szó.`,
      tip2: R`Összesen $${n}$ golyó van; ${n === 5 ? 'az' : 'a'} $${n}!$ sorrendet osszuk az egyforma golyók felcserélhetőségével.`,
      sol: [R`$P = \dfrac{${n}!}{${a}!\,${b}!\,${c}!} = ${K.T(v)}$`]
    };
  });

  def('gm-kom-4', 'gondolkodas', 'kombinatorika', 2, 'Variáció: dobogó és kód', function (r) {
    var kind = r.int(0, 1), n = r.int(6, 12), k = r.int(2, 4), v = 1, i;
    if (kind === 0) {
      for (i = 0; i < k; i++) v *= (n - i);
      return {
        q: R`Egy versenyen $${n}$ versenyző indul. Hányféle lehet az első $${k}$ helyezett sorrendje (holtverseny nincs)?`,
        answer: { type: 'num', value: v }, ansTex: K.T(v), verify: `fakt(${n})/fakt(${n - k})`,
        tip1: R`A sorrend számít, és egy versenyző csak egy helyen végezhet: ismétlés nélküli variáció.`,
        tip2: R`Az első helyre $${n}$, a másodikra $${n - 1}$ versenyző kerülhet, és így tovább, összesen $${k}$ helyre.`,
        sol: [R`$V_{${n}}^{${k}} = \dfrac{${n}!}{${n - k}!} = ${K.T(v)}$`]
      };
    }
    v = Math.pow(n, k);
    return {
      q: R`Egy zárat $${k}$ jegyű kóddal nyithatunk, minden jegy $${n}$ szimbólum (betű vagy szám) bármelyike lehet, és a jegyek ismétlődhetnek. Hány különböző kód van?`,
      answer: { type: 'num', value: v }, ansTex: K.T(v), verify: `${n}^${k}`,
      tip1: R`A sorrend számít, és az elemek ismétlődhetnek: ismétléses variáció.`,
      tip2: R`Minden jegynél $${n}$ lehetőség van, és a lépések szorzódnak.`,
      sol: [R`$V^{ism} = ${n}^{${k}} = ${K.T(v)}$`]
    };
  });

  def('gm-kom-5', 'gondolkodas', 'kombinatorika', 3, 'Legalább egy lány a bizottságban', function (r) {
    var f = r.int(5, 9), l = r.int(3, 6), m = r.int(3, 4), C = function (n, k) { var v = 1, i; for (i = 0; i < k; i++) v = v * (n - i) / (i + 1); return v; };
    var v = C(f + l, m) - C(f, m);
    return {
      q: R`Egy csoportban $${f}$ fiú és $${l}$ lány van. Hányféleképpen választható ki $${m}$ fős bizottság úgy, hogy legalább egy lány legyen benne?`,
      answer: { type: 'num', value: v }, ansTex: K.T(v),
      verify: `binom(${f + l};${m})-binom(${f};${m})`,
      tip1: R`Használd a komplementer módszert.`,
      tip2: R`Az összes bizottságból vond le azokat, amelyekben csak fiúk vannak.`,
      sol: [R`Összes bizottság: $\dbinom{${f + l}}{${m}} = ${C(f + l, m)}$.`, R`Csak fiúkból álló: $\dbinom{${f}}{${m}} = ${C(f, m)}$.`, R`Kedvező: $${C(f + l, m)} - ${C(f, m)} = ${v}$.`]
    };
  });

  def('gm-kom-6', 'gondolkodas', 'kombinatorika', 3, 'Binomiális tétel: együttható', function (r) {
    var a = r.int(1, 3), b = r.nz(-3, 3), n = r.int(4, 7), k = r.int(2, n - 1), C = 1, i, v;
    for (i = 0; i < k; i++) C = C * (n - i) / (i + 1);
    v = C * Math.pow(a, k) * Math.pow(b, n - k);
    var lin = (a === 1 ? '' : String(a)) + 'x' + (b < 0 ? '-' : '+') + Math.abs(b);
    return {
      q: R`Mennyi az $x^{${k}}$ együtthatója a $(${K.tex(lin)})^{${n}}$ kifejtésében?`,
      answer: { type: 'num', value: v }, ansTex: K.T(v),
      verify: `binom(${n};${n - k})*${a}^${k}*(${b})^${n - k}`,
      tip1: R`Használd a binomiális tételt: az $x^k$-t tartalmazó tag $\binom{n}{k}(ax)^k b^{n-k}$.`,
      tip2: R`Itt $\binom{${n}}{${k}} = ${C}$; ne felejtsd el a(z) $${a}$ és a(z) $${K.par(b)}$ megfelelő hatványát sem.`,
      sol: [R`A keresett tag: $\dbinom{${n}}{${k}} \cdot ${K.par(a)}^{${k}} \cdot ${K.par(b)}^{${n - k}}$.`, R`$= ${C} \cdot ${Math.pow(a, k)} \cdot ${K.par(Math.pow(b, n - k))} = ${K.T(v)}$`]
    };
  });

  def('gm-kom-7', 'gondolkodas', 'kombinatorika', 3, 'Egymás mellett ülők', function (r) {
    var n = r.int(5, 12), nm = r.pick([['Anna', 'Béla'], ['Dóri', 'Gergő'], ['Eszter', 'Máté'], ['Lili', 'Zsolt']]), f = function (x) { var v = 1, i; for (i = 2; i <= x; i++) v *= i; return v; }, v = 2 * f(n - 1);
    return {
      q: R`$${n}$ ember leül egy sorba. Közülük ketten (${nm[0]} és ${nm[1]}) mindenképpen egymás mellett akarnak ülni. Hányféleképpen ülhetnek le?`,
      answer: { type: 'num', value: v }, ansTex: K.T(v),
      verify: `fakt(${n})/${n}*2`,
      tip1: R`Kezeld a két embert egyetlen „elemként”.`,
      tip2: R`Így $${n - 1}$ elemet kell sorba rendezni, és a páron belül még $2$ sorrend lehetséges.`,
      sol: [R`A pár egy elem: $${n - 1}$ elem sorrendje $${n - 1}! = ${f(n - 1)}$.`, R`A páron belül $2$ sorrend van: $2 \cdot ${f(n - 1)} = ${v}$.`]
    };
  });

  /* ================= 1.4 GRÁFOK ================= */
  MO.content['gondolkodas/grafok'] = {
    intro: R`A gráf pontokból és a köztük húzott vonalakból álló „kapcsolati ábra”: ismeretségek, útvonalak, mérkőzések, hálózatok szemléltetésére tökéletes. A követelmény 1.4 pontja szerint ismerned kell a pont, él, fokszám fogalmát, a fokszámok összege és az élek száma közötti összefüggést, és szituációkat kell gráfokkal szemléltetned. Emelt szinten a gráfok fogalmi rendszerét (hurok, séta, út, kör, fa, komplementer, izomorfia), a teljes gráf és a fa éleinek számát, és egy skatulyaelves bizonyítást is tudnod kell. Szöveges „ismeretség” vagy „bajnokság” típusú helyzeteket is gráffal modellezhetsz.`,
    theory: [
      { h: 'A gráf alapfogalmai',
        b: R`A **gráf** pontok (csúcsok) és élek halmaza; az él két pontot köt össze. Egy pont **fokszáma** a belőle induló élek száma. A **fokszámsor** a pontok fokainak felsorolása.\n\nEgy gráfot szemléltethetünk rajzzal: a pontok a szereplők, az élek a kapcsolatok (ismeretség, útvonal, mérkőzés). Az ábra alakja nem számít, csak az, hogy melyik pont melyikkel van összekötve.\n\nEgy pontot, amelynek foka $0$, **elszigetelt** pontnak nevezünk.` },
      { h: 'Egyszerű gráf, hurokél, többszörös él, teljes gráf',
        b: R`- **Hurokél:** olyan él, amely egy pontot önmagával köt össze. **Többszörös él:** két pont között több él is van.\n- **Egyszerű gráf:** nincs benne hurokél és többszörös él; ebben két pont között legfeljebb egy él van.\n- **Teljes gráf** ($K_n$): az $n$ pontú egyszerű gráf, amelyben bármely két pont össze van kötve. Éleinek száma $\dbinom{n}{2} = \dfrac{n(n-1)}{2}$.\n\nPélda: $K_5$-nek $\binom{5}{2} = 10$ éle van; ez egy 5 csapatos körmérkőzés mérkőzéseinek száma.`  },
      { h: 'A fokszámok összege',
        b: R`Bármely gráfban a fokszámok összege az élek számának kétszerese:\n$$\sum \text{fokszámok} = 2 \cdot e$$\nMert minden él két pontnak ad $1$-$1$ fokot. Következmények:\n- a fokszámok összege mindig **páros**;\n- a **páratlan fokú pontok száma páros** (a kézfogási tétel: nem lehet páratlan sok olyan ember, aki páratlan sokat fog kezet);\n- egy $n$ pontú, minden pontjában $d$ fokú gráf éleinek száma $\dfrac{n d}{2}$.\n\nEgy egyszerű gráfban egy pont foka legfeljebb $n - 1$.`,
        proof: R`Az élek számolásakor minden élt két pontnál is megszámolunk (a két végpontjánál), ezért a fokszámok összege $2e$. Mivel a páros fokok összege páros, a teljes összeg is páros, így a páratlan fokúak összege páros, ami csak páros darabszámú páratlan szám esetén teljesül.` },
      { h: 'Séta, út, kör, összefüggőség', level: 'emelt',
        b: R`- **Séta:** pontok és élek váltakozó sorozata, amelyben minden él a két szomszédos pontját köti össze; élek ismétlődhetnek.\n- **Körséta:** olyan séta, amely ugyanabban a pontban kezdődik és végződik.\n- **Út:** olyan séta, amelyben egy pont sem ismétlődik.\n- **Kör:** olyan körséta, amelyben (a kezdő- és végpont kivételével) egy pont sem ismétlődik, és egyetlen él sem ismétlődik.\n- **Összefüggő** a gráf, ha bármely két pontja között vezet út (séta).\n\nHa egy gráf nem összefüggő, akkor több **összefüggő komponensből** áll.` },
      { h: 'Komplementer gráf és izomorfia', level: 'emelt',
        b: R`Egy $G$ egyszerű gráf **komplementer gráfja** ugyanazokon a pontokon azokat az éleket tartalmazza, amelyek $G$-ben nincsenek meg. Így $G$ és komplementere éleinek összege a teljes gráf éleinek száma: $e(G) + e(\overline{G}) = \dbinom{n}{2}$, és egy pont foka $G$-ben $d$, komplementerében $n - 1 - d$.\n\nKét gráf **izomorf**, ha pontjaik között létezik olyan kölcsönösen egyértelmű megfeleltetés, amely az éleket élekbe viszi (ugyanaz a szerkezet, csak a pontok elhelyezése vagy elnevezése más). Izomorf gráfokban a pontok és élek száma és a fokszámsor is megegyezik, de ez fordítva nem elég az izomorfiához.` },
      { h: 'Fák', level: 'emelt',
        b: R`A **fa** olyan összefüggő gráf, amelyben nincs kör. Tulajdonságai:\n- egy $n$ pontú fának pontosan **$n - 1$ éle** van;\n- bármely két pontja között pontosan egy út vezet;\n- legalább két elsőfokú pontja (levele) van, ha $n \ge 2$;\n- ha egy éle elhagyjuk, a gráf nem lesz összefüggő; ha egy új élet húzunk be, kör keletkezik.\n\nGyakorlati példa: egy $n$ pontot összekötő legkevesebb élből álló hálózat fa, $n - 1$ éllel.`,
        proof: R`Az $n - 1$ él megmutatása: a fából elhagyva egy levelet és a hozzá tartozó élet, újra fát kapunk (ez összefüggő és körmentes marad). Ezt addig ismételve egyetlen ponthoz jutunk, $0$ éllel. Közben $n - 1$ pontot és ugyanennyi élet hagytunk el, így az élek száma $n - 1$.` },
      { h: 'Két azonos fokszámú pont létezése', level: 'emelt',
        b: R`**Tétel:** bármely legalább kétpontú egyszerű gráfban van két azonos fokszámú pont.\n\nÍgy emlékezhetsz: egy társaságban mindig van két ember, akinek ugyanannyi ismerőse van a társaságon belül.`,
        proof: R`Legyen $n \ge 2$ a pontok száma. Egy pont foka $0$ és $n - 1$ között lehet, ez $n$ lehetséges érték. De a $0$ és az $n-1$ fok nem fordulhat elő egyszerre: az $n-1$ fokú pont mindenkivel össze van kötve, így nincs $0$ fokú pont. Tehát a pontok fokai legfeljebb $n - 1$ különböző értéket vehetnek fel. Mivel $n$ pont van, a skatulyaelv szerint két pont foka megegyezik.` }
    ],
    examples: [
      { t: 'Fokszámösszeg: létezik-e ilyen gráf?',
        p: R`Egy rendezvényen $8$ ember vesz részt. Lehetséges-e, hogy mindegyikük pontosan $3$ másik emberrel ismerős? Mi a helyzet $7$ emberrel?`,
        steps: [R`Gráf: a pontok az emberek, az élek az ismeretségek. Mindegyik pont foka $3$.`,
          R`$8$ pont esetén a fokszámok összege $8 \cdot 3 = 24$, ami páros; az élek száma $\dfrac{24}{2} = 12$. Egy ilyen gráf létezik (pl. a kocka csúcsai és élei).`,
          R`$7$ pont esetén a fokszámok összege $7 \cdot 3 = 21$ páratlan. Mivel a fokszámok összege az élek számának kétszerese, nem lehet páratlan: ilyen gráf nincs.`],
        ans: R`Nyolc embernél lehetséges ($12$ ismeretség), hét embernél nem.`,
        checks: [['8*3', '24'], ['8*3/2', '12'], ['7*3', '21'], ['2*12', '24']] },
      { t: 'Bajnokság és komplementer gráf',
        p: R`Egy körmérkőzéses tornán $10$ csapat mindenki mással egyszer játszik. Hány mérkőzést játszanak? Egy másik, $6$ pontú egyszerű gráfnak $9$ éle van; hány éle van a komplementerének?`,
        steps: [R`A csapatok a pontok, a mérkőzések az élek; mindenki mindenkivel játszik, tehát teljes gráf: $10$ pontú, élei száma $\dbinom{10}{2} = \dfrac{10 \cdot 9}{2} = 45$.`,
          R`A $6$ pontú teljes gráfnak $\dbinom{6}{2} = 15$ éle van.`,
          R`A komplementer gráf azokat az éleket tartalmazza, amelyek a gráfból hiányoznak: $15 - 9 = 6$.`,
          R`Ellenőrzés: az élek összege $9 + 6 = 15$, ez éppen a teljes gráf élszáma.`],
        ans: R`A tornán $45$ mérkőzést játszanak, a komplementer gráfnak $6$ éle van.`,
        checks: [['10*9/2', '45'], ['binom(10;2)', '45'], ['binom(6;2)', '15'], ['15-9', '6'], ['9+6', '15']] },
      { t: 'Fa fokszámai (emelt)',
        p: R`Egy $10$ pontú fában minden pont foka $1$ vagy $3$. Hány elsőfokú pontja van?`,
        steps: [R`A fának $10$ pontja és $10 - 1 = 9$ éle van, így a fokszámok összege $2 \cdot 9 = 18$.`,
          R`Legyen $x$ az elsőfokú, $y$ a harmadfokú pontok száma: $x + y = 10$ és $x + 3y = 18$.`,
          R`A két egyenletet kivonva: $2y = 8$, tehát $y = 4$, és $x = 10 - 4 = 6$.`,
          R`Ellenőrzés: pontok száma $6 + 4 = 10$, fokszámösszeg $6 \cdot 1 + 4 \cdot 3 = 18$.`],
        ans: R`A fának $6$ elsőfokú pontja van.`,
        checks: [['10-1', '9'], ['2*(10-1)', '18'], ['(18-10)/2', '4'], ['10-4', '6'], ['6+3*4', '18']] }
    ],
    sims: ['grafok'],
    mistakes: [R`A fokszámösszeget az élek számával azonosítod: a fokszámok összege az élek számának **kétszerese**.`,
      R`A hurokélet a fokszámnál egyszeresen számolod: a hurokél a pont fokához $2$-t ad (kétszer számítja ugyanazt a pontot).`,
      R`Azt hiszed, hogy egyszerű gráfban egy pont foka lehet $n$: legfeljebb $n - 1$, mert önmagával nem köthető össze, és kétszer sem ugyanahhoz.`,
      R`A fát az „élek száma = pontok száma” módon számolod: a fa éleinek száma $n - 1$ (a körnek éppen annyi éle van, mint pontja).`,
      R`A komplementer gráfnál összekevered az éleket és a fokokat: élszám $\binom{n}{2} - e$, fok $n - 1 - d$.`,
      R`Páratlan sok páratlan fokú pontot fogadsz el: ilyen gráf nem létezik.`],
    exam: R`Közép- és emelt szinten is követelmény a konkrét szituációk gráfokkal való szemléltetése, egyszerű feladatok megoldása gráfokkal, a pont, él és fokszám fogalma, valamint a pontok fokszámösszege és az élek száma közötti összefüggés gyakorlati feladatokban. Emelt szinten definiálnod és alkalmaznod kell a többszörös él, hurokél, séta, körséta, út, kör, összefüggő gráf, egyszerű gráf, teljes gráf, fa, komplementer gráf és izomorf gráfok fogalmát, ismerned kell az $n$ pontú teljes gráf éleinek számát és a fa pontjai és élei számának összefüggését, és be kell tudnod bizonyítani, hogy legalább kétpontú egyszerű gráfban van két azonos fokszámú pont.`,
    cheat: [R`\sum \text{fokszámok} = 2e`, R`e(K_n) = \dbinom{n}{2} = \dfrac{n(n-1)}{2}`, R`\text{fa: } e = n - 1`, R`e(G) + e(\overline{G}) = \dbinom{n}{2}`, R`\text{egyszerű gráfban } 0 \le d \le n - 1`],
    cheatChecks: [['binom(6;2)', '6*5/2'], ['binom(10;2)', '10*9/2'], ['12*3/2', '18']],
    terms: ['gráf', 'pont', 'él', 'fokszám', 'hurokél', 'többszörös él', 'egyszerű gráf', 'teljes gráf', 'séta', 'út', 'kör', 'összefüggő gráf', 'fa', 'komplementer gráf', 'izomorf gráfok']
  };


  def('gm-gra-1', 'gondolkodas', 'grafok', 1, 'Élek száma a fokszámokból', function (r) {
    var n = r.int(4, 14), d = r.int(2, 6);
    if ((n * d) % 2) n++;
    var e = n * d / 2;
    return {
      q: R`Egy gráfnak $${n}$ pontja van, és mindegyik pontjának foka $${d}$. Hány éle van a gráfnak?`,
      answer: { type: 'num', value: e }, ansTex: K.T(e),
      verify: `${n}*${d}/2`,
      tip1: R`A fokszámok összege az élek számának kétszerese.`,
      tip2: R`A fokszámok összege $${n} \cdot ${d} = ${n * d}$.`,
      sol: [R`A fokszámok összege $${n} \cdot ${d} = ${n * d}$.`, R`Ez az élek számának kétszerese, így $e = \dfrac{${n * d}}{2} = ${e}$.`]
    };
  });

  def('gm-gra-2', 'gondolkodas', 'grafok', 1, 'Teljes gráf éleinek száma', function (r) {
    var n = r.int(4, 20), e = n * (n - 1) / 2;
    var what = r.pick(['mérkőzést játszanak egy körmérkőzéses bajnokságban a(z)', 'kézfogás történik, ha mindenki mindenkivel kezet fog a(z)']);
    return {
      q: what.indexOf('mérkőzést') === 0 ? R`Hány mérkőzést játszanak egy körmérkőzéses bajnokságban, ha a csapatok száma $${n}$, és mindenki mindenkivel egyszer játszik?`
        : R`Hány kézfogás történik, ha $${n}$ ember mindegyike mindenkivel pontosan egyszer kezet fog?`,
      answer: { type: 'num', value: e }, ansTex: K.T(e),
      verify: `binom(${n};2)`,
      tip1: R`Teljes gráf éleinek számát keresed.`,
      tip2: R`Az élek száma $\dfrac{n(n-1)}{2}$, itt $n = ${n}$.`,
      sol: [R`$e = \dbinom{${n}}{2} = \dfrac{${n} \cdot ${n - 1}}{2} = ${e}$`]
    };
  });

  function randGraph(r, n) {
    var deg = [], i, j, e = 0;
    for (i = 0; i < n; i++) deg.push(0);
    for (i = 0; i < n; i++) for (j = i + 1; j < n; j++) if (r() < 0.5) { deg[i]++; deg[j]++; e++; }
    return { deg: deg, e: e };
  }

  def('gm-gra-3', 'gondolkodas', 'grafok', 2, 'Komplementer gráf éleinek száma', function (r) {
    var n = r.int(5, 15), e = r.int(n - 1, Math.min(n * (n - 1) / 2 - 1, 3 * n)), t = n * (n - 1) / 2, c = t - e;
    return {
      q: R`Egy $${n}$ pontú egyszerű gráfnak $${e}$ éle van. Hány éle van a komplementer gráfjának?`,
      answer: { type: 'num', value: c }, ansTex: K.T(c),
      verify: `binom(${n};2)-${e}`,
      tip1: R`A gráf és komplementere együtt a teljes gráfot adja ki.`,
      tip2: R`A teljes gráf éleinek száma $\dbinom{${n}}{2} = ${t}$.`,
      sol: [R`A teljes gráf éleinek száma $\dbinom{${n}}{2} = ${t}$.`, R`A komplementer élei: $${t} - ${e} = ${c}$.`]
    };
  });

  def('gm-gra-4', 'gondolkodas', 'grafok', 2, 'Hiányzó fokszám', function (r) {
    var g, n = r.int(5, 7), i, s = 0;
    do { g = randGraph(r, n); } while (g.e < 3);
    var known = g.deg.slice(0, n - 1), x = g.deg[n - 1];
    known.forEach(function (d) { s += d; });
    return {
      q: R`Egy $${n}$ pontú egyszerű gráfnak $${g.e}$ éle van. Az első $${n - 1}$ pont fokszáma: $${known.join('; ')}$. Mennyi az utolsó pont fokszáma?`,
      answer: { type: 'num', value: x }, ansTex: K.T(x),
      verify: `2*${g.e}-${s}`,
      tip1: R`A fokszámok összege az élek számának kétszerese.`,
      tip2: R`A megadott fokszámok összege $${s}$.`,
      sol: [R`A fokszámok összege $2 \cdot ${g.e} = ${2 * g.e}$.`, R`Az ismert fokok összege $${s}$, így az utolsó pont foka $${2 * g.e} - ${s} = ${x}$.`]
    };
  });

  def('gm-gra-5', 'gondolkodas', 'grafok', 3, 'Fa elsőfokú pontjai', function (r) {
    var d = r.pick([3, 4]), y = r.int(2, 9), n = y * (d - 1) + 2, x = n - y;
    return {
      q: R`Egy fa $${n}$ pontú, és minden pontjának foka vagy $1$, vagy $${d}$. Hány elsőfokú pontja van?`,
      answer: { type: 'num', value: x }, ansTex: K.T(x),
      verify: `${n}-(${n}-2)/(${d}-1)`,
      tip1: R`A fának $n - 1$ éle van, így ismert a fokszámok összege.`,
      tip2: R`Legyen $x$ az elsőfokú, $y$ a(z) $${d}$ fokú pontok száma: $x + y = ${n}$ és $x + ${d}y = ${2 * (n - 1)}$.`,
      sol: [R`Az élek száma $${n} - 1 = ${n - 1}$, a fokszámok összege $${2 * (n - 1)}$.`, R`$x + y = ${n}$, $x + ${d}y = ${2 * (n - 1)}$. Kivonva: $${d - 1}y = ${n - 2}$, tehát $y = ${y}$.`, R`Így $x = ${n} - ${y} = ${x}$.`, R`Ellenőrzés: $${x} + ${d} \cdot ${y} = ${x + d * y} = ${2 * (n - 1)}$.`]
    };
  });

  def('gm-gra-6', 'gondolkodas', 'grafok', 3, 'Nem összefüggő gráf legtöbb éle', function (r) {
    var n = r.int(5, 20), e = (n - 1) * (n - 2) / 2;
    return {
      q: R`Legfeljebb hány éle lehet egy $${n}$ pontú, nem összefüggő egyszerű gráfnak?`,
      answer: { type: 'num', value: e }, ansTex: K.T(e),
      verify: `binom(${n}-1;2)`,
      tip1: R`Akkor lesz legtöbb él, ha a gráf egy elszigetelt pontból és egy teljes gráfból áll.`,
      tip2: R`Az elszigetelt pont mellett marad $${n - 1}$ pont, amelyek között minden él meghúzható.`,
      sol: [R`Ha a gráf nem összefüggő, legalább két komponense van. A legtöbb él akkor van, ha az egyik komponens egy pont, a másik a maradék $${n - 1}$ pontból álló teljes gráf.`, R`Ennek élei: $\dbinom{${n - 1}}{2} = ${e}$.`, R`(Más felbontásnál, pl. $2$ és $${n - 2}$ pont, kevesebb él lenne.)`]
    };
  });
})(typeof window !== "undefined" ? window : globalThis);
