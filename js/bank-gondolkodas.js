(function (root) {
  'use strict';
  var MO = root.MO = root.MO || {}; var R = String.raw; var B = MO.bank = MO.bank || {};
  function add(o) { B[o.id] = o; }

  /* ===================== IGAZ–HAMIS ===================== */

  add({ id: 'b-gon-tf-1', type: 'tf', topic: 'gondolkodas', sub: 'halmazok', level: 1, title: 'Halmazok különbsége',
    stmt: R`Bármely két $A$ és $B$ halmazra igaz, hogy $A \setminus B = B \setminus A$.`, truth: false,
    why: R`Ellenpélda: $A = \{1;\ 2\}$, $B = \{2;\ 3\}$. Ekkor $A \setminus B = \{1\}$, de $B \setminus A = \{3\}$. A különbségképzés nem kommutatív; a két különbség csak akkor egyenlő, ha $A = B$.` });

  add({ id: 'b-gon-tf-2', type: 'tf', topic: 'gondolkodas', sub: 'halmazok', level: 2, title: 'De Morgan-azonosság',
    stmt: R`Egy alaphalmaz részhalmazaira, $A$-ra és $B$-re igaz, hogy $\overline{A \cup B} = \overline{A} \cap \overline{B}$.`, truth: true,
    why: R`Ez az egyik de Morgan-azonosság. Egy $x$ elem pontosan akkor nincs az $A \cup B$ unióban, ha nincs $A$-ban és nincs $B$-ben sem, vagyis ha $x \in \overline{A}$ és $x \in \overline{B}$.` });

  add({ id: 'b-gon-tf-3', type: 'tf', topic: 'gondolkodas', sub: 'halmazok', level: 1, title: 'Részhalmazok száma',
    stmt: R`Egy $5$ elemű halmaznak $32$ részhalmaza van, ha az üres halmazt és magát a halmazt is részhalmaznak tekintjük.`, truth: true,
    why: R`Minden elemről két lehetőség közül döntünk (benne van a részhalmazban vagy nincs), ezért a részhalmazok száma $2^5 = 32$. Ebben az üres halmaz és az egész halmaz is benne van.`,
    check: ['2^5', '32'] });

  add({ id: 'b-gon-tf-4', type: 'tf', topic: 'gondolkodas', sub: 'halmazok', level: 2, title: 'Az unió elemszáma',
    stmt: R`Bármely két véges $A$ és $B$ halmazra $|A \cup B| = |A| + |B|$.`, truth: false,
    why: R`Ellenpélda: $A = \{1;\ 2\}$, $B = \{2;\ 3\}$. Ekkor $A \cup B = \{1;\ 2;\ 3\}$, így $|A \cup B| = 3$, de $|A| + |B| = 4$. Általában $|A \cup B| = |A| + |B| - |A \cap B|$; a két érték csak akkor egyezik, ha a halmazok diszjunktak.` });

  add({ id: 'b-gon-tf-5', type: 'tf', topic: 'gondolkodas', sub: 'halmazok', level: 3, title: 'Végtelen halmazok számossága',
    stmt: R`A pozitív páros számok halmaza „kisebb” számosságú, mint a pozitív egészek halmaza, hiszen valódi részhalmaza annak.`, truth: false,
    why: R`Végtelen halmaznál a valódi részhalmaz nem lehet kisebb számosságú. Az $n \mapsto 2n$ hozzárendelés kölcsönösen egyértelmű megfeleltetés a pozitív egészek és a pozitív páros számok között, így mindkét halmaz megszámlálhatóan végtelen.` });

  add({ id: 'b-gon-tf-6', type: 'tf', topic: 'gondolkodas', sub: 'logika', level: 2, title: 'Az implikáció megfordítása',
    stmt: R`Ha az „ha egy egész szám osztható $6$-tal, akkor páros” állítás igaz, akkor a megfordítása („ha egy egész szám páros, akkor osztható $6$-tal”) is igaz.`, truth: false,
    why: R`Az eredeti állítás igaz, a megfordítása viszont hamis: a $4$ páros, de nem osztható $6$-tal. Egy tétel megfordítása általában nem következik magából a tételből.` });

  add({ id: 'b-gon-tf-7', type: 'tf', topic: 'gondolkodas', sub: 'logika', level: 1, title: 'A „minden” tagadása',
    stmt: R`A „Minden prímszám páratlan” állítás tagadása: „Van olyan prímszám, amely nem páratlan.”`, truth: true,
    why: R`A „minden” típusú állítás tagadása „van olyan”, amelyre az állítás nem teljesül. A tagadás itt igaz is, mert a $2$ páros prímszám.` });

  add({ id: 'b-gon-tf-8', type: 'tf', topic: 'gondolkodas', sub: 'logika', level: 2, title: 'A „van olyan” tagadása',
    stmt: R`A „Van olyan egész szám, amely osztható öttel” állítás tagadása: „Van olyan egész szám, amely nem osztható öttel.”`, truth: false,
    why: R`A „van olyan” tagadása „egyik sem”, vagyis a helyes tagadás: egyetlen egész szám sem osztható öttel. A javasolt állítás ráadásul az eredetivel együtt is igaz (például $3$ nem osztható öttel, $10$ viszont igen), így nem lehet tagadása.` });

  add({ id: 'b-gon-tf-9', type: 'tf', topic: 'gondolkodas', sub: 'logika', level: 3, title: 'Szükséges és elégséges feltétel',
    stmt: R`Egész $n$ esetén az, hogy $n^2$ páros, szükséges és elégséges feltétele annak, hogy $n$ páros legyen.`, truth: true,
    why: R`Ha $n$ páros, $n = 2k$, akkor $n^2 = 4k^2$ páros (elégséges). Ha $n$ páratlan, $n = 2k + 1$, akkor $n^2 = 4k^2 + 4k + 1$ páratlan; tehát ha $n^2$ páros, akkor $n$ nem lehet páratlan (szükséges).` });

  add({ id: 'b-gon-tf-10', type: 'tf', topic: 'gondolkodas', sub: 'logika', level: 2, title: 'Elégséges, de nem szükséges feltétel',
    stmt: R`Az, hogy egy háromszög egyenlő oldalú, elégséges, de nem szükséges feltétele annak, hogy egyenlő szárú legyen.`, truth: true,
    why: R`Ha mindhárom oldal egyenlő, akkor két oldal is egyenlő, ezért a háromszög egyenlő szárú (elégséges). Nem szükséges, mert az $5,\ 5,\ 3$ egység oldalú háromszög egyenlő szárú, de nem egyenlő oldalú.` });

  add({ id: 'b-gon-tf-11', type: 'tf', topic: 'gondolkodas', sub: 'kombinatorika', level: 1, title: 'Küldöttség választása',
    stmt: R`Egy $5$ tagú társaságból $3$ tagú küldöttséget $10$-féleképpen lehet választani.`, truth: true,
    why: R`A küldöttség tagjai egyenrangúak, a sorrend nem számít, ezért kombinációról van szó: $\binom{5}{3} = 10$.`,
    check: ['binom(5;3)', '10'] });

  add({ id: 'b-gon-tf-12', type: 'tf', topic: 'gondolkodas', sub: 'kombinatorika', level: 2, title: 'A MATEMATIKA szó betűi',
    stmt: R`A MATEMATIKA szó betűinek összes lehetséges sorrendje (az egyforma betűk felcserélése nem számít külön) $10!$.`, truth: false,
    why: R`A $10$ betű között ismétlődések vannak: az M és a T kétszer, az A háromszor szerepel. A különböző sorrendek száma $\dfrac{10!}{2! \cdot 3! \cdot 2!} = 151200$, ami kisebb, mint $10!$.`,
    check: ['fakt(10)', 'fakt(10)/(fakt(2)*fakt(3)*fakt(2))'] });

  add({ id: 'b-gon-tf-13', type: 'tf', topic: 'gondolkodas', sub: 'kombinatorika', level: 2, title: 'Binomiális tétel együtthatója',
    stmt: R`Az $(x + y)^5$ kifejezés kifejtésében az $x^2 y^3$ tag együtthatója $5$.`, truth: false,
    why: R`A binomiális tétel szerint az $x^2 y^3$ tag együtthatója $\binom{5}{2} = 10$ (ugyanennyi $\binom{5}{3}$). Az $5$ az $x^4 y$ tag együtthatója.`,
    check: ['binom(5;2)', '5'] });

  add({ id: 'b-gon-tf-14', type: 'tf', topic: 'gondolkodas', sub: 'kombinatorika', level: 2, title: 'Ismétléses variáció',
    stmt: R`Azoknak a $4$ hosszúságú számsorozatoknak a száma, amelyek minden eleme a $0$, $1$ vagy $2$ szám valamelyike, $81$.`, truth: true,
    why: R`A sorozat mind a négy helyére egymástól függetlenül $3$ érték kerülhet, ez $3$ elem negyedosztályú ismétléses variációja: $3^4 = 81$.`,
    check: ['3^4', '81'] });

  add({ id: 'b-gon-tf-15', type: 'tf', topic: 'gondolkodas', sub: 'kombinatorika', level: 2, title: 'Tisztségek kiosztása',
    stmt: R`Egy $10$ fős csapatból elnököt, titkárt és pénztárost (három különböző tisztséget, mindegyiket más személy tölti be) $\binom{10}{3}$-féleképpen lehet választani.`, truth: false,
    why: R`A tisztségek különböznek, ezért a sorrend számít: ismétlés nélküli variációról van szó, $10 \cdot 9 \cdot 8 = 720$ lehetőség van. A $\binom{10}{3} = 120$ csak a három fős csoport kiválasztását számolja.`,
    check: ['binom(10;3)', '10*9*8'] });

  add({ id: 'b-gon-tf-16', type: 'tf', topic: 'gondolkodas', sub: 'kombinatorika', level: 3, title: 'A Pascal-háromszög szabálya',
    stmt: R`Igaz, hogy $\binom{9}{3} + \binom{9}{4} = \binom{10}{4}$.`, truth: true,
    why: R`Ez a Pascal-háromszög alapszabálya: $\binom{n}{k} + \binom{n}{k+1} = \binom{n+1}{k+1}$. Itt $n = 9$, $k = 3$: $84 + 126 = 210 = \binom{10}{4}$.`,
    check: ['binom(9;3)+binom(9;4)', 'binom(10;4)'] });

  add({ id: 'b-gon-tf-17', type: 'tf', topic: 'gondolkodas', sub: 'grafok', level: 1, title: 'A teljes gráf élszáma',
    stmt: R`A $8$ pontú teljes gráfnak $28$ éle van.`, truth: true,
    why: R`Az $n$ pontú teljes gráf élszáma $\dfrac{n(n-1)}{2}$, hiszen minden pontpár között van él. Itt $\dfrac{8 \cdot 7}{2} = 28$.`,
    check: ['8*7/2', '28'] });

  add({ id: 'b-gon-tf-18', type: 'tf', topic: 'gondolkodas', sub: 'grafok', level: 2, title: 'Háromfokú pontok gráfja',
    stmt: R`Létezik olyan $7$ pontú egyszerű gráf, amelyben minden pont foka $3$.`, truth: false,
    why: R`A fokszámok összege az élek számának kétszerese, ezért páros. Itt az összeg $7 \cdot 3 = 21$ lenne, ami páratlan, így ilyen gráf nem létezik.` });

  add({ id: 'b-gon-tf-19', type: 'tf', topic: 'gondolkodas', sub: 'grafok', level: 2, title: 'A fa élszáma',
    stmt: R`Minden $n$ pontú fának pontosan $n - 1$ éle van.`, truth: true,
    why: R`Ez a fák alaptétele: a fa összefüggő és körmentes gráf, amelyben a pontok száma eggyel nagyobb az élek számánál. (Indoklás: levelet törölve a pontok és az élek száma is eggyel csökken, végül egyetlen pont marad él nélkül.)` });

  add({ id: 'b-gon-tf-20', type: 'tf', topic: 'gondolkodas', sub: 'grafok', level: 3, title: 'Hat pont, öt él',
    stmt: R`Ha egy egyszerű gráfnak $6$ pontja és $5$ éle van, akkor a gráf biztosan fa.`, truth: false,
    why: R`Ellenpélda: egy háromszög (három pont, három él) és mellette egy három pontú út (két él). Ez $6$ pont és $5$ él, de nem összefüggő (és van benne kör), ezért nem fa. Az $n - 1$ él csak akkor jelent fát, ha a gráf összefüggő (vagy körmentes) is.` });

  /* ===================== HIBAVADÁSZ ===================== */

  add({ id: 'b-gon-spot-1', type: 'spot', topic: 'gondolkodas', sub: 'halmazok', level: 1, title: 'Nyelvtanulók száma',
    problem: R`Egy $40$ fős osztályban $25$-en tanulnak angolul, $18$-an németül, és $7$-en mindkét nyelvet tanulják. Hányan nem tanulnak egyik nyelvet sem?`,
    lines: [R`Jelölje $A$ az angolosok, $N$ a németesek halmazát: $|A| = 25$, $|N| = 18$, $|A \cap N| = 7$.`,
            R`Az unió elemszáma: $|A \cup N| = 25 + 18 - 7 - 7 = 29$.`,
            R`Ekkor egyik nyelvet sem tanulja $40 - 29 = 11$ tanuló.`,
            R`A válasz: $11$ tanuló.`],
    wrong: 1,
    why: R`A metszetet csak egyszer kell levonni: az $|A| + |N|$ összegben a mindkét nyelvet tanulók kétszer szerepelnek, ezért egyetlen levonással lesz mindenki egyszer számolva. A kétszeri levonás elveszi a metszet elemeit.`,
    fix: R`$|A \cup N| = 25 + 18 - 7 = 36$, így egyik nyelvet sem tanulja $40 - 36 = 4$ tanuló.`,
    wrongCheck: ['25+18-7-7', '25+18-7'],
    fixCheck: ['25+18-7', '36'] });

  add({ id: 'b-gon-spot-2', type: 'spot', topic: 'gondolkodas', sub: 'halmazok', level: 3, title: 'Háromhalmazos szita',
    problem: R`Egy $100$ fős csoportban $45$-en szeretik a focit, $40$-en a kosárlabdát, $30$-an a röplabdát. Focit és kosárlabdát is $15$-en, focit és röplabdát is $10$-en, kosárlabdát és röplabdát is $12$-en szeretnek; mindhárom sportot $5$-en. Hányan nem szeretnek egyik sportot sem?`,
    lines: [R`Jelölje $F$, $K$, $R$ a három sportot szeretők halmazát: $|F| = 45$, $|K| = 40$, $|R| = 30$, $|F \cap K| = 15$, $|F \cap R| = 10$, $|K \cap R| = 12$, $|F \cap K \cap R| = 5$.`,
            R`A logikai szita szerint $|F \cup K \cup R| = |F| + |K| + |R| - |F \cap K| - |F \cap R| - |K \cap R| - |F \cap K \cap R|$.`,
            R`Behelyettesítve: $45 + 40 + 30 - 15 - 10 - 12 - 5 = 73$.`,
            R`Egyik sportot sem szereti $100 - 73 = 27$ ember.`],
    wrong: 1,
    why: R`A hármas metszet előjele pozitív. A páronkénti metszetek levonásakor a hármas metszet elemeit háromszor vontuk le, miközben az összeadáskor háromszor szerepeltek: így összesen nullaszor számolódnának, ezért egyszer vissza kell adni őket.`,
    fix: R`$|F \cup K \cup R| = 45 + 40 + 30 - 15 - 10 - 12 + 5 = 83$, így egyik sportot sem szereti $100 - 83 = 17$ ember.`,
    wrongCheck: ['45+40+30-15-10-12-5', '83'],
    fixCheck: ['45+40+30-15-10-12+5', '83'] });

  add({ id: 'b-gon-spot-3', type: 'spot', topic: 'gondolkodas', sub: 'logika', level: 2, title: 'A „minden” tagadása',
    problem: R`Fogalmazd meg a következő állítás tagadását, és döntsd el, hogy melyik igaz: „Az $\{1;\ 2;\ 3;\ 4\}$ halmaz minden $x$ elemére $x^2 > 5$.”`,
    lines: [R`Az eredeti állítás: minden $x \in \{1;\ 2;\ 3;\ 4\}$ elemre teljesül, hogy $x^2 > 5$.`,
            R`Az állítás hamis, mert például $x = 1$ esetén $x^2 = 1$, ami nem nagyobb, mint $5$.`,
            R`Ezért a tagadásnak igaznak kell lennie.`,
            R`A „minden” tagadása az „egyik sem”, vagyis a tagadás: a halmaz egyik elemére sem igaz, hogy $x^2 > 5$.`,
            R`Tehát az igaz állítás: egyetlen $x$ elemre sem teljesül, hogy $x^2 > 5$.`],
    wrong: 3,
    why: R`A „minden” tagadása nem az „egyik sem”, hanem a „van olyan, amelyre nem”. Az „egyik sem” állítás hamis lenne, hiszen $x = 3$ és $x = 4$ esetén $x^2 > 5$ igaz, miközben a tagadásnak igaznak kell lennie.`,
    fix: R`A helyes tagadás: van olyan $x$ eleme a halmaznak, amelyre $x^2 \le 5$. Ez igaz, például $x = 1$ vagy $x = 2$ esetén.`,
    wrongCheck: ['3^2', '5'],
    fixCheck: ['1^2', '1'] });

  add({ id: 'b-gon-spot-4', type: 'spot', topic: 'gondolkodas', sub: 'kombinatorika', level: 1, title: 'Dobogós helyezések',
    problem: R`Egy $10$ fős versenyen az első három helyezett érmet kap: aranyat, ezüstöt, illetve bronzot. Hányféleképpen alakulhat a dobogó (ki melyik érmet kapja), ha nincs holtverseny?`,
    lines: [R`Az érmek különbözők, ezért az is számít, hogy ki melyik érmet kapja.`,
            R`Három versenyzőt választunk a tíz közül: $\binom{10}{3} = 120$.`,
            R`A dobogó tehát ennyiféleképpen alakulhat: $120$.`],
    wrong: 1,
    why: R`A $\binom{10}{3}$ azt számolja, hányféle háromfős csoport választható, a sorrendet figyelmen kívül hagyva. Itt a sorrend számít (arany, ezüst, bronz), ezért ismétlés nélküli variációt kell számolni.`,
    fix: R`Az aranyérmes $10$, az ezüstérmes $9$, a bronzérmes $8$ féleképpen lehet: $10 \cdot 9 \cdot 8 = 720$ dobogó.`,
    wrongCheck: ['binom(10;3)', '10*9*8'],
    fixCheck: ['10*9*8', '720'] });

  add({ id: 'b-gon-spot-5', type: 'spot', topic: 'gondolkodas', sub: 'kombinatorika', level: 2, title: 'Az ALMA betűi',
    problem: R`Hány különböző betűsorozat (értelmes vagy értelmetlen) készíthető az ALMA szó összes betűjének felhasználásával?`,
    lines: [R`Az ALMA szóban $4$ betű van, ebből az A betű kétszer szerepel.`,
            R`Ha a két A betűt megkülönböztetnénk, a betűk sorrendje $4! = 24$ lenne.`,
            R`Az A betűk megkülönböztetése nélkül is $24$ különböző sorozatot kapunk.`,
            R`Tehát $24$ különböző betűsorozat készíthető.`],
    wrong: 2,
    why: R`Ha a két A-t felcseréljük, ugyanazt a sorozatot kapjuk, ezért a $24$ sorrendben minden betűsorozat kétszer szerepel. Az ismétlődő elemek miatt osztani kell a felcserélési lehetőségek számával.`,
    fix: R`A két A felcserélésével minden sorozatot kétszer számoltunk, ezért $\dfrac{4!}{2!} = 12$ különböző betűsorozat készíthető.`,
    wrongCheck: ['fakt(4)', 'fakt(4)/fakt(2)'],
    fixCheck: ['fakt(4)/fakt(2)', '12'] });

  add({ id: 'b-gon-spot-6', type: 'spot', topic: 'gondolkodas', sub: 'kombinatorika', level: 2, title: 'Legalább egy hatos',
    problem: R`Egy szabályos dobókockával négyszer dobunk egymás után. Hány olyan dobássorozat van, amelyben legalább egy hatos szerepel?`,
    lines: [R`Az összes dobássorozat száma $6^4 = 1296$.`,
            R`Kiválasztjuk, hányadik dobás legyen hatos ($4$ lehetőség), a másik három dobás tetszőleges: $4 \cdot 6^3 = 864$.`,
            R`Tehát $864$ olyan sorozat van, amelyben van hatos.`],
    wrong: 1,
    why: R`A több hatost tartalmazó sorozatokat többször számoltuk: például a $6,\ 6,\ 1,\ 2$ sorozatot az első és a második dobás kiválasztásakor is. „Legalább egy” esetén a komplementer a jó módszer.`,
    fix: R`Hatos nélküli sorozat $5^4 = 625$ van, ezért a legalább egy hatost tartalmazók száma $1296 - 625 = 671$.`,
    wrongCheck: ['4*6^3', '6^4-5^4'],
    fixCheck: ['6^4-5^4', '671'] });

  add({ id: 'b-gon-spot-7', type: 'spot', topic: 'gondolkodas', sub: 'grafok', level: 1, title: 'Négyfokú pontok gráfja',
    problem: R`Egy egyszerű gráfnak $10$ pontja van, és minden pontjának a foka $4$. Hány éle van a gráfnak?`,
    lines: [R`A pontok fokainak összege $10 \cdot 4 = 40$.`,
            R`Az élek száma megegyezik a fokok összegével, tehát a gráfnak $40$ éle van.`,
            R`A gráf élszáma tehát $40$.`],
    wrong: 1,
    why: R`A fokok összegében minden élt kétszer számoltunk, egyszer-egyszer a két végpontjánál. A fokszámok összege az élek számának kétszerese, nem az élek száma.`,
    fix: R`Az élek száma a fokösszeg fele: $\dfrac{40}{2} = 20$ él.`,
    wrongCheck: ['10*4', '10*4/2'],
    fixCheck: ['10*4/2', '20'] });

  add({ id: 'b-gon-spot-8', type: 'spot', topic: 'gondolkodas', sub: 'grafok', level: 2, title: 'Fa pontjainak száma',
    problem: R`Egy fa pontjainak fokszámösszege $30$. Hány pontja van a fának?`,
    lines: [R`A fokszámösszeg az élek számának kétszerese, ezért a fának $30 / 2 = 15$ éle van.`,
            R`Fában a pontok száma eggyel kisebb az élek számánál, ezért $15 - 1 = 14$ pontja van.`,
            R`A fának tehát $14$ pontja van.`],
    wrong: 1,
    why: R`Fában az élek száma kisebb eggyel a pontok számánál, tehát fordítva: a pontok száma eggyel nagyobb az élek számánál. Például a két pontú fának $1$ éle van.`,
    fix: R`A pontok száma: $15 + 1 = 16$.`,
    wrongCheck: ['15-1', '15+1'],
    fixCheck: ['15+1', '16'] });

  /* ===================== SORBA RENDEZÉS ===================== */

  add({ id: 'b-gon-ord-1', type: 'order', topic: 'gondolkodas', sub: 'logika', level: 2, title: 'Skatulyaelv: tizenhárom ember',
    claim: R`Rendezd sorba a bizonyítás lépéseit: $13$ ember között van kettő, aki ugyanabban a hónapban született.`,
    steps: [R`Az embereket a születési hónapjuk szerint $12$ skatulyába (a naptári hónapokba) soroljuk.`,
            R`Tegyük fel, hogy minden skatulyában legfeljebb $1$ ember van.`,
            R`Ekkor az összes ember száma legfeljebb $12 \cdot 1 = 12$ lenne.`,
            R`Ez ellentmond annak, hogy $13$ ember van.`,
            R`Tehát van olyan skatulya, amelyben legalább $2$ ember van, vagyis ők ugyanabban a hónapban születtek.`],
    note: R`A skatulyaelv bizonyítása indirekt: megjelöljük a skatulyákat, feltesszük az ellenkezőjét, és ellentmondásra jutunk.` });

  add({ id: 'b-gon-ord-2', type: 'order', topic: 'gondolkodas', sub: 'grafok', level: 2, title: 'A fokszámok összege páros',
    claim: R`Rendezd sorba a bizonyítás lépéseit: egy egyszerű gráfban a fokszámok összege páros.`,
    steps: [R`Minden élnek pontosan két végpontja van.`,
            R`Ha összeadjuk a pontok fokait, minden élt pontosan kétszer számolunk: egyszer-egyszer a két végpontjánál.`,
            R`Ezért a fokszámok összege $2e$, ahol $e$ az élek száma.`,
            R`A $2e$ páros szám, tehát a fokszámok összege páros.`,
            R`Ebből következik, hogy a páratlan fokú pontok száma páros, különben az összeg páratlan lenne.`],
    note: R`Ez a kézfogási lemma: ugyanezért nem lehet páratlan sok ember, aki mind páratlan sok kezet fog.` });

  add({ id: 'b-gon-ord-3', type: 'order', topic: 'gondolkodas', sub: 'halmazok', level: 1, title: 'Egy n elemű halmaz részhalmazai',
    claim: R`Rendezd sorba a bizonyítás lépéseit: egy $n$ elemű halmaznak $2^n$ részhalmaza van.`,
    steps: [R`Legyenek a halmaz elemei $a_1,\ a_2,\ \dots,\ a_n$.`,
            R`Egy részhalmaz megadásához minden elemről el kell döntenünk, hogy benne van-e a részhalmazban.`,
            R`Minden elemnél $2$ lehetőség van (benne van vagy nincs), és a döntések egymástól függetlenek.`,
            R`A szorzási szabály szerint a döntéssorozatok száma $2 \cdot 2 \cdots 2 = 2^n$.`,
            R`Különböző döntéssorozatok különböző részhalmazokat adnak, és minden részhalmaz előáll, ezért a részhalmazok száma $2^n$.`],
    note: R`Ebbe az üres halmaz (minden döntés „nincs”) és az egész halmaz (minden döntés „van”) is beletartozik.` });

  add({ id: 'b-gon-ord-4', type: 'order', topic: 'gondolkodas', sub: 'grafok', level: 3, title: 'Két azonos fokszámú pont',
    claim: R`Rendezd sorba az indirekt bizonyítás lépéseit: bármely legalább kétpontú egyszerű gráfban van két azonos fokszámú pont.`,
    steps: [R`Tegyük fel indirekt, hogy van olyan $n \ge 2$ pontú egyszerű gráf, amelyben minden pont foka különböző.`,
            R`Egyszerű gráfban egy pont foka $0$ és $n - 1$ közötti egész szám, vagyis összesen $n$ különböző érték lehetséges.`,
            R`Mivel $n$ pontnak $n$ különböző foka van, a fokok pontosan a $0,\ 1,\ \dots,\ n - 1$ számok, mindegyik egyszer.`,
            R`Van tehát egy $n - 1$ fokú pont, amely az összes többi ponttal össze van kötve, és van egy $0$ fokú pont, amely senkivel sincs összekötve.`,
            R`Ez ellentmondás: a $0$ fokú pont is szomszédja kellene hogy legyen az $n - 1$ fokú pontnak.`,
            R`Az indirekt feltevés hamis, tehát van két azonos fokszámú pont.`],
    note: R`A kulcs az, hogy a $0$ és az $n - 1$ fok egyszerre nem fordulhat elő ugyanabban a gráfban.` });

  add({ id: 'b-gon-ord-5', type: 'order', topic: 'gondolkodas', sub: 'kombinatorika', level: 3, title: 'A Pascal-összefüggés indoklása',
    claim: R`Rendezd sorba az indoklás lépéseit kombinatorikus érveléssel: $\binom{n+1}{k+1} = \binom{n}{k} + \binom{n}{k+1}$.`,
    steps: [R`Számoljuk meg egy $n + 1$ elemű halmaz $k + 1$ elemű részhalmazait; ezek száma $\binom{n+1}{k+1}$.`,
            R`Emeljünk ki a halmazból egy rögzített elemet, legyen ez $x$.`,
            R`Először számoljuk meg azokat a részhalmazokat, amelyek tartalmazzák $x$-et: ezekhez a maradék $n$ elemből még $k$ elemet kell választani, ez $\binom{n}{k}$ részhalmaz.`,
            R`A fennmaradó részhalmazok nem tartalmazzák $x$-et, ezért a maradék $n$ elemből választunk $k + 1$ elemet: ez $\binom{n}{k+1}$ részhalmaz.`,
            R`Minden részhalmaz pontosan az egyik esetbe tartozik, ezért $\binom{n+1}{k+1} = \binom{n}{k} + \binom{n}{k+1}$.`],
    note: R`Az esetszétválasztás kulcsa, hogy a két eset kizárja egymást, és együtt lefedi az összes részhalmazt.` });

  add({ id: 'b-gon-ord-6', type: 'order', topic: 'gondolkodas', sub: 'logika', level: 3, title: 'Teljes indukció: páratlan számok összege',
    claim: R`Rendezd sorba a teljes indukciós bizonyítás lépéseit: $1 + 3 + 5 + \dots + (2n - 1) = n^2$ minden pozitív egész $n$-re.`,
    steps: [R`Alapeset: $n = 1$ esetén a bal oldal $1$, a jobb oldal $1^2 = 1$, tehát az állítás igaz.`,
            R`Az alapeset igazsága után tegyük fel, hogy valamely $k \ge 1$ esetén $1 + 3 + \dots + (2k - 1) = k^2$ (indukciós feltevés).`,
            R`Ekkor $1 + 3 + \dots + (2k - 1) + (2k + 1) = k^2 + (2k + 1)$.`,
            R`Mivel $k^2 + 2k + 1 = (k + 1)^2$, az állítás $n = k + 1$ esetén is igaz.`,
            R`A teljes indukció elve szerint az állítás minden pozitív egész $n$ esetén igaz.`],
    note: R`A teljes indukció két pillére: az alapeset és az, hogy az állítás öröklődik $k$-ról $k + 1$-re.` });

  /* ===================== VEZETETT MEGOLDÁS ===================== */

  add({ id: 'b-gon-gui-1', type: 'guided', topic: 'gondolkodas', sub: 'halmazok', level: 2, title: 'Nyelvtanulók három halmazzal',
    problem: R`Egy $60$ fős évfolyamon $30$-an tanulnak angolul, $25$-en németül, $20$-an franciául. Angolul és németül is $10$-en, angolul és franciául is $8$-an, németül és franciául is $6$-an tanulnak; mindhárom nyelvet $3$-an tanulják.`,
    steps: [
      { q: R`Hányan tanulnak legalább egy nyelvet?`, answer: { type: 'num', value: 54 }, ansTex: '54', verify: '30+25+20-10-8-6+3',
        hint: R`Használd a háromhalmazos logikai szitát: összeadás, páronkénti metszetek levonása, hármas metszet hozzáadása.`,
        expl: R`$30 + 25 + 20 - 10 - 8 - 6 + 3 = 54$.` },
      { q: R`Hányan nem tanulnak egyik nyelvet sem?`, answer: { type: 'num', value: 6 }, ansTex: '6', verify: '60-54',
        hint: R`Vond ki az évfolyam létszámából a legalább egy nyelvet tanulók számát.`,
        expl: R`$60 - 54 = 6$ tanuló.` },
      { q: R`Hányan tanulnak pontosan két nyelvet?`, answer: { type: 'num', value: 15 }, ansTex: '15', verify: '(10-3)+(8-3)+(6-3)',
        hint: R`A páronkénti metszetekben a mindhárom nyelvet tanulók is benne vannak: belőlük ki kell vonni őket.`,
        expl: R`Csak angol–német: $10 - 3 = 7$, csak angol–francia: $8 - 3 = 5$, csak német–francia: $6 - 3 = 3$. Összesen $7 + 5 + 3 = 15$.` },
      { q: R`Hányan tanulnak pontosan egy nyelvet?`, answer: { type: 'num', value: 36 }, ansTex: '36', verify: '54-15-3',
        hint: R`A legalább egy nyelvet tanulók közül vond ki a pontosan kettőt és a pontosan hármat tanulókat.`,
        expl: R`$54 - 15 - 3 = 36$.` }],
    final: R`Legalább egy nyelvet tanulók száma: $54$; egyiket sem tanulók száma: $6$; pontosan két nyelvet tanulók száma: $15$; pontosan egyet tanulók száma: $36$.` });

  add({ id: 'b-gon-gui-2', type: 'guided', topic: 'gondolkodas', sub: 'kombinatorika', level: 2, title: 'Páros háromjegyű számok',
    problem: R`Hány háromjegyű páros szám készíthető a $0, 1, 2, 3, 4$ számjegyekből, ha egy számban nincs két egyforma számjegy? (Háromjegyű szám nem kezdődhet nullával.)`,
    steps: [
      { q: R`Hány ilyen szám végződik $0$-ra?`, answer: { type: 'num', value: 12 }, ansTex: '12', verify: '4*3',
        hint: R`Az utolsó jegy rögzített, az első két jegyet a maradék négy számjegyből kell választani, sorrenddel.`,
        expl: R`Az első jegy $4$, a második $3$ féleképpen választható: $4 \cdot 3 = 12$.` },
      { q: R`Hány ilyen szám végződik $2$-re vagy $4$-re?`, answer: { type: 'num', value: 18 }, ansTex: '18', verify: '2*3*3',
        hint: R`Az utolsó jegyet $2$ féleképpen választhatod; az első jegy nem lehet $0$ és nem lehet az utolsó jegy.`,
        expl: R`Az utolsó jegy $2$ lehetőség, az első jegy $3$ (négy számjegy marad, de a $0$ nem jó), a középső $3$ (a maradék három számjegy bármelyike): $2 \cdot 3 \cdot 3 = 18$.` },
      { q: R`Hány ilyen szám van összesen?`, answer: { type: 'num', value: 30 }, ansTex: '30', verify: '12+18',
        hint: R`A két eset kizárja egymást, ezért az eredményeket összeadhatod.`,
        expl: R`$12 + 18 = 30$.` }],
    final: R`Összesen $30$ ilyen háromjegyű páros szám készíthető.` });

  add({ id: 'b-gon-gui-3', type: 'guided', topic: 'gondolkodas', sub: 'kombinatorika', level: 2, title: 'Fényképezkedés sorban',
    problem: R`Hat barát, köztük Anna és Béla, egy sorban áll fel fényképezkedéshez. Hányféle sorrend lehetséges, ha Anna és Béla szomszédosak? Hányféle, ha nem szomszédosak?`,
    steps: [
      { q: R`Ha Anna és Béla egymás mellett áll, és őket egyetlen egységnek tekintjük, hány egységet kell sorba rendezni?`, answer: { type: 'num', value: 5 }, ansTex: '5', verify: '5',
        hint: R`Négy másik barát és az Anna–Béla páros.`,
        expl: R`$4$ másik barát és $1$ páros: $5$ egység.` },
      { q: R`Hányféleképpen rendezhető sorba az $5$ egység?`, answer: { type: 'num', value: 120 }, ansTex: '120', verify: 'fakt(5)',
        hint: R`Ez $5$ különböző elem permutációja.`,
        expl: R`$5! = 120$.` },
      { q: R`Hányféleképpen állhat Anna és Béla a páron belül?`, answer: { type: 'num', value: 2 }, ansTex: '2', verify: '2',
        hint: R`Vagy Anna áll elöl, vagy Béla.`,
        expl: R`$2! = 2$ sorrend.` },
      { q: R`Hány olyan sorrend van, amelyben Anna és Béla szomszédosak?`, answer: { type: 'num', value: 240 }, ansTex: '240', verify: '2*fakt(5)',
        hint: R`Szorozd össze az egységek sorrendjét és a páron belüli sorrendet.`,
        expl: R`$5! \cdot 2 = 120 \cdot 2 = 240$.` },
      { q: R`Hány olyan sorrend van, amelyben Anna és Béla nem szomszédosak?`, answer: { type: 'num', value: 480 }, ansTex: '480', verify: 'fakt(6)-2*fakt(5)',
        hint: R`Használd a komplementer módszert: az összes sorrendből vond ki a szomszédos eseteket.`,
        expl: R`Az összes sorrend $6! = 720$, így $720 - 240 = 480$.` }],
    final: R`Szomszédosak $240$ sorrendben, nem szomszédosak $480$ sorrendben.` });

  add({ id: 'b-gon-gui-4', type: 'guided', topic: 'gondolkodas', sub: 'grafok', level: 2, title: 'Gráf fokszámokból',
    problem: R`Egy $7$ pontú egyszerű gráfban négy pont foka $4$, három pont foka $2$.`,
    steps: [
      { q: R`Mennyi a pontok fokszámainak összege?`, answer: { type: 'num', value: 22 }, ansTex: '22', verify: '4*4+3*2',
        hint: R`Add össze a fokokat: négy darab $4$ és három darab $2$.`,
        expl: R`$4 \cdot 4 + 3 \cdot 2 = 16 + 6 = 22$.` },
      { q: R`Hány éle van a gráfnak?`, answer: { type: 'num', value: 11 }, ansTex: '11', verify: '(4*4+3*2)/2',
        hint: R`A fokszámok összege az élek számának kétszerese.`,
        expl: R`$22 / 2 = 11$ él.` },
      { q: R`Hány élt kellene még behúzni, hogy a gráf teljes gráf legyen?`, answer: { type: 'num', value: 10 }, ansTex: '10', verify: 'binom(7;2)-11',
        hint: R`A $7$ pontú teljes gráf élszáma $\binom{7}{2}$.`,
        expl: R`A teljes gráfnak $\binom{7}{2} = 21$ éle van, tehát $21 - 11 = 10$ élt kellene hozzávenni.` },
      { q: R`Lehet-e ez a gráf fa?`, answer: { type: 'choice', options: ['Nem, mert egy 7 pontú fának 6 éle van', 'Igen, mert a fokszámösszeg páros', 'Igen, mert van benne 2 fokú pont'], correct: 0 },
        hint: R`Hasonlítsd össze az élek számát a fa élszámával.`,
        expl: R`Egy $7$ pontú fának $6$ éle van, ennek a gráfnak $11$, ezért nem lehet fa.` }],
    final: R`A gráf fokszámösszege $22$, élszáma $11$; a teljes gráfhoz $10$ él hiányzik, és a gráf nem lehet fa.` });

  add({ id: 'b-gon-gui-5', type: 'guided', topic: 'gondolkodas', sub: 'grafok', level: 3, title: 'Létezik-e ilyen gráf?',
    problem: R`Létezik-e olyan $6$ pontú egyszerű gráf, amelyben a pontok fokai $5, 5, 5, 5, 5, 1$?`,
    steps: [
      { q: R`Mennyi a fokszámok összege?`, answer: { type: 'num', value: 26 }, ansTex: '26', verify: '5*5+1',
        hint: R`Öt darab ötöst és egy egyest kell összeadni.`,
        expl: R`$5 \cdot 5 + 1 = 26$.` },
      { q: R`Teljesül-e a páros fokszámösszeg feltétele?`, answer: { type: 'choice', options: ['Igen, a $26$ páros', 'Nem, a $26$ páratlan', 'Ez nem dönthető el'], correct: 0 },
        hint: R`A fokszámok összege az élek számának kétszerese, tehát páros kell, hogy legyen.`,
        expl: R`A $26$ páros, tehát ez a szükséges feltétel teljesül; ebből még nem következik, hogy a gráf létezik.` },
      { q: R`Egy ötfokú pont a gráf mind az $5$ másik pontjával össze van kötve. Hány ötfokú pont szomszédja az egyfokú pontnak?`, answer: { type: 'num', value: 5 }, ansTex: '5', verify: '5',
        hint: R`Az egyfokú pont a többi öt pont mindegyikének a szomszédja kellene hogy legyen, ha azok ötfokúak.`,
        expl: R`Mind az öt ötfokú pont a gráf összes többi pontjával, így az egyfokú ponttal is össze van kötve: $5$ szomszéd.` },
      { q: R`Létezik-e ilyen gráf?`, answer: { type: 'choice', options: ['Igen', 'Nem, mert az egyfokú pontnak legalább 5 szomszédja lenne', 'Nem, mert a fokszámösszeg páratlan'], correct: 1 },
        hint: R`Hasonlítsd össze az egyfokú pont lehetséges szomszédainak számát a megadott fokkal.`,
        expl: R`Az egyfokú pontnak $5$ szomszédja lenne, de a foka $1$: ellentmondás. A páros fokszámösszeg tehát szükséges, de nem elégséges feltétel.` }],
    final: R`Ilyen gráf nem létezik: bár a fokszámösszeg páros, az öt darab ötfokú pont mindegyike összekötött az egyfokú ponttal, így annak a foka $5$ lenne.` });

  add({ id: 'b-gon-gui-6', type: 'guided', topic: 'gondolkodas', sub: 'kombinatorika', level: 2, title: 'Bizottságválasztás feltételekkel',
    problem: R`Egy társaság $7$ férfiból és $5$ nőből áll, köztük Pál és Panni. A társaságból $4$ tagú bizottságot választunk.`,
    steps: [
      { q: R`Hány különböző $4$ tagú bizottság választható összesen?`, answer: { type: 'num', value: 495 }, ansTex: '495', verify: 'binom(12;4)',
        hint: R`A bizottság tagjai egyenrangúak, tehát kombinációt számolunk $12$ emberből.`,
        expl: R`$\binom{12}{4} = 495$.` },
      { q: R`Hány olyan bizottság van, amelyben csak férfiak vannak?`, answer: { type: 'num', value: 35 }, ansTex: '35', verify: 'binom(7;4)',
        hint: R`Csak a $7$ férfi közül választunk.`,
        expl: R`$\binom{7}{4} = 35$.` },
      { q: R`Hány olyan bizottság van, amelyben legalább egy nő van?`, answer: { type: 'num', value: 460 }, ansTex: '460', verify: 'binom(12;4)-binom(7;4)',
        hint: R`Komplementer: az összes bizottságból vond ki a csak férfiakból állókat.`,
        expl: R`$495 - 35 = 460$.` },
      { q: R`Hány olyan bizottság van, amelyben Pál és Panni is benne van?`, answer: { type: 'num', value: 45 }, ansTex: '45', verify: 'binom(10;2)',
        hint: R`Ők már bent vannak, a másik két tagot a maradék $10$ emberből választjuk.`,
        expl: R`$\binom{10}{2} = 45$.` },
      { q: R`Hány bizottság választható úgy, hogy Pál és Panni nem lehet egyszerre benne?`, answer: { type: 'num', value: 450 }, ansTex: '450', verify: 'binom(12;4)-binom(10;2)',
        hint: R`Az összes bizottságból vond ki azokat, amelyekben mindketten benne vannak.`,
        expl: R`$495 - 45 = 450$.` }],
    final: R`Legalább egy nő $460$ bizottságban van; ha Pál és Panni nem lehet együtt, $450$ bizottság választható.` });
})(typeof window !== 'undefined' ? window : globalThis);
