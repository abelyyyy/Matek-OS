# MATEK OS

Interaktív tanulóapp az emelt szintű matematika érettségihez. Statikus webapp: nincs build lépés, nincs külső függőség, a KaTeX helyben van a `vendor` mappában.

## Kipróbálás

Csomagold ki a `matek-os.zip` fájlt, és nyisd meg a `matek-os/index.html` fájlt böngészőben.

## Feltöltés GitHub Pages-re

1. Hozz létre egy új, nyilvános tárolót `matek-os` néven.
2. Az **Add file → Upload files** oldalon húzd be a `matek-os` mappa **tartalmát** (az `index.html` a tároló gyökerébe kerüljön). A böngészős feltöltés egyszerre kb. 100 fájlt enged, ezért töltsd fel külön körökben:
   - 1. kör: `index.html`, `sw.js`, `manifest.webmanifest`, `css`, `js`, `icons`
   - 2. kör: `vendor` (KaTeX és 20 betűfájl)
   - további körök: a `vizsgak` mappa (34 feladatsor, mappánként 19 fájl, összesen kb. 38 MB). Egyszerre öt almappát húzz be (pl. `vizsgak/2010-majus` … `vizsgak/2012-majus`), így egy kör 95 fájl. Ha van GitHub Desktop vagy git a gépeden, azzal egy lépésben megy.
3. **Settings → Pages → Branch: main, mappa: / (root) → Save.**
4. Egy-két perc múlva az app itt érhető el: `https://<felhasználónév>.github.io/matek-os/`

## Telepítés telefonra, offline használat

A GitHub Pages-címet megnyitva az app telepíthető: Androidon a Chrome menüjében **Alkalmazás telepítése / Hozzáadás a kezdőképernyőhöz**, iPhone-on Safariban **Megosztás → Főképernyőhöz adás**. Az első megnyitáskor a program minden fájlja (kb. 2,4 MB) a készülékre kerül, ezután a tananyag, a képlettár, a labor és a gyakorlás internet nélkül is működik. A hivatalos feladatsorok képei külön tölthetők le: egyenként a feladatsor oldalán, vagy mind egyszerre az **Adatok, mentés** oldalon.

Az offline mód csak webcímről (https) megnyitva él; a kicsomagolt `index.html` közvetlen megnyitásakor nincs rá szükség, mert minden fájl a gépen van.

## Frissítés

Később elég a megváltozott fájlokat újra feltölteni ugyanarra a helyre. Ha bármelyik fájlt magad módosítod, futtasd le a `tools/make-sw.js` szkriptet (`node tools/make-sw.js .`), és töltsd fel az új `sw.js` fájlt is: ebben van a fájlok listája és a verziójel, amelyből a telefonok megtudják, hogy frissíteniük kell. A frissítés a következő megnyitáskor töltődik le, és az azt követő megnyitástól látszik.

## Mentés

A haladás a böngészőben tárolódik (eszközönként külön). Az **Adatok, mentés** oldalon szövegként kimásolható és másik eszközön betölthető.

## Mappák

- `index.html` – belépési pont
- `css/app.css` – megjelenés
- `js/` – `core.js` (tárolás, segédek), `cas.js` (kifejezés-értelmező, deriválás, integrál, gyökkeresés), `plot.js` (grafikon), `models.js` (szimulációk modelljei), `topics.js` (témakör-térkép), `tasks-alapok.js` (feladatgenerátorok), `data-alapok.js` (az Alapok tananyaga és képletei), `taskkit.js` (feladatsegédek), `content-*.js` (tananyag és feladatgenerátorok témakörönként), `formulas-*.js` (képletkártyák témakörönként), `plot3d.js` (térbeli ábrák), `sims-*.js` (a Labor szimulációi csoportonként), `bank-*.js` (rögzített feladatok: igaz–hamis, hibavadász, bizonyítás-rendező, vezetett megoldás), `ui.js` (felület), `practice.js` (gyakorlás, ismétlőkártyák, hibanapló), `exams-index.js` (a feladatsorok jegyzéke pontszámokkal és témacímkékkel), `offline.js` (offline működés, feladatsorok letöltése), `exam.js` (próbaérettségi, pontozás, feladatbank)
- `sw.js`, `manifest.webmanifest`, `icons/` – telepíthető, offline működő változat
- `vendor/katex/` – képletmegjelenítő
- `vizsgak/<év>-<majus|oktober>/` – a hivatalos emelt szintű feladatsorok (2010–2026): feladatonként a feladatlapból (`f1.png`…`f9.png`) és a javítási útmutatóból (`m1.png`…`m9.png`) kivágott kép, valamint a pontozás adatai (`data.js`). Forrás: Oktatási Hivatal.

- `tools/make-sw.js` (a csomag gyökerében, az app mappáján kívül) – az `sw.js` újragenerálása módosítás után
