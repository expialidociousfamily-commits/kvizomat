export const questions = [
  {
    "id": "ma_2024_08",
    "subject": "matematika",
    "category": "obsah a obvod",
    "difficulty": 3,
    "emoji": "📐",
    "type": "an",
    "question": "Ve čtvercové síti jsou nakresleny dva obrazce A a B, jejichž vrcholy leží v mřížových bodech. Každý čtvereček má stranu délky 1 cm a obsah 1 cm². Rozhodněte o každém tvrzení, zda je pravdivé (A), či nikoli (N).",
    "correct_option": null,
    "answer": null,
    "answer_explanation": "8.1: Obsah obou obrazců je stejný – ANO. 8.2: Obsah obrazce A je 11 cm² – NE (obsah A je 12 cm²). 8.3: Obvod obrazce B je 16 cm – ANO (součet délek stran B dává 16 cm).",
    "hints": ["Obsah nepravidelných obrazců v síti vypočítáš doplněním na obdélník a odečtením rohů.", "Obvod = součet délek všech stran; u šikmých stran použij Pythagorovu trojici."],
    "static_teaching_note": "Obsah obrazce v síti určujeme pomocí tzv. Pick-ovy metody nebo doplněním na obdélník.",
    "played": false,
    "results": null,
    "subitems": [
      { "id": "8.1", "question": "Obsahy obou obrazců si jsou rovny.", "correct_option": "A" },
      { "id": "8.2", "question": "Obsah obrazce A je 11 cm².", "correct_option": "N" },
      { "id": "8.3", "question": "Obvod obrazce B je 16 cm.", "correct_option": "A" }
    ]
  },
  {
    "id": "ma_2024_09",
    "subject": "matematika",
    "category": "rychlost a práce",
    "difficulty": 3,
    "emoji": "✍️",
    "type": "mc",
    "question": "Tereza a její kamarádka Nikola píší novoroční přání. Všechna přání mají stejný text a každá z dívek píše stálou rychlostí. Tereza za každých 5 minut napíše 14 novoročenek, zatímco Nikola 10. Za jak dlouho společně napíší 120 novoročních přání?",
    "options": {
      "A": "za 24 minut",
      "B": "za 25 minut",
      "C": "za 30 minut",
      "D": "za 32 minut",
      "E": "za jiný počet minut"
    },
    "correct_option": "B",
    "answer": "za 25 minut",
    "answer_explanation": "Za 5 minut napíší dohromady 14 + 10 = 24 přání. Za 1 minutu tedy 24 ÷ 5 = 4,8 přání. Pro 120 přání: 120 ÷ 4,8 = 25 minut.",
    "hints": ["Nejdříve zjisti, kolik přání napíší obě dívky dohromady za 5 minut.", "Potom zjisti, za kolik minut zvládnou 120 přání při tomto společném tempu."],
    "static_teaching_note": "Úlohy o společné práci řešíme tak, že sečteme výkony obou pracovníků za stejný časový úsek.",
    "played": false,
    "results": null
  },
  {
    "id": "ma_2024_10",
    "subject": "matematika",
    "category": "logické myšlení",
    "difficulty": 2,
    "emoji": "🔷",
    "type": "mc",
    "question": "Který z uvedených obrázků (A–E) logicky nepatří mezi ostatní? (Každý obrázek zobrazuje čtverec s úhlopříčkami a jedním vystínovaným trojúhelníkem v různých polohách.)",
    "options": {
      "A": "Obrázek A – vystínovaný trojúhelník vlevo nahoře (vrchol nahoru)",
      "B": "Obrázek B – vystínovaný trojúhelník uprostřed nahoře (vrchol dolů)",
      "C": "Obrázek C – vystínovaný trojúhelník vlevo dole (vrchol dolů)",
      "D": "Obrázek D – vystínovaný trojúhelník vpravo (vrchol doleva)",
      "E": "Obrázek E – vystínovaný trojúhelník vpravo (malý, u rohu)"
    },
    "correct_option": "E",
    "answer": "Obrázek E",
    "answer_explanation": "V obrázcích A–D je vystínován vždy jeden ze čtyř shodných trojúhelníků vzniklých úhlopříčkami a jeho obsah je čtvrtina čtverce. V obrázku E je vystínován jiný, menší trojúhelník u rohu čtverce, který neodpovídá tomuto vzoru.",
    "hints": ["Porovnej, jak velký je zastíněný trojúhelník vůči celému čtverci v každém obrázku.", "Sleduj, zda jsou všechny zastíněné trojúhelníky shodné (stejně velké a stejného tvaru)."],
    "static_teaching_note": "V úlohách o logickém nepatří hledáme pravidlo platné pro většinu a jeden prvek, který ho porušuje.",
    "played": false,
    "results": null
  },
  {
    "id": "ma_2024_11",
    "subject": "matematika",
    "category": "obsah – šestiúhelník",
    "difficulty": 4,
    "emoji": "⬡",
    "type": "mc",
    "question": "Máme šestiúhelník ABCDEF, který lze úsečkami AD, BE a CF rozdělit na šest shodných rovnoramenných trojúhelníků. Body A, B, D a E leží ve vrcholech obdélníku. Obsah tmavé části šestiúhelníku je 112 cm². Jaký je obsah bílé části šestiúhelníku?",
    "options": {
      "A": "28 cm²",
      "B": "112 cm²",
      "C": "196 cm²",
      "D": "224 cm²",
      "E": "jiný obsah"
    },
    "correct_option": "B",
    "answer": "112 cm²",
    "answer_explanation": "Šestiúhelník je rozdělen na 6 shodných trojúhelníků. Z obrázku jsou 3 trojúhelníky tmavé a 3 bílé. Protože jsou všechny trojúhelníky shodné, mají stejný obsah. Tmavá část (3 trojúhelníky) = 112 cm², tedy i bílá část (3 trojúhelníky) = 112 cm².",
    "hints": ["Spočítej, kolik ze 6 shodných trojúhelníků je tmavých a kolik bílých.", "Všechny trojúhelníky jsou shodné – mají tedy stejný obsah."],
    "static_teaching_note": "Pokud je obrazec rozdělen na shodné díly, stačí spočítat počet tmavých a bílých dílů.",
    "played": false,
    "results": null
  },
  {
    "id": "ma_2024_12_1",
    "subject": "matematika",
    "category": "čtení grafu",
    "difficulty": 2,
    "emoji": "📊",
    "type": "mc",
    "question": "Graf znázorňuje přírůstek a úbytek obyvatel v obcích Lidov, Dámov a Pánov v letech 2019–2022. Jak se změnil počet obyvatel v Pánově během roku 2021?",
    "options": {
      "A": "Ubylo 5 obyvatel.",
      "B": "Ubylo 10 obyvatel.",
      "C": "Počet obyvatel se nezměnil.",
      "D": "Přibylo 5 obyvatel.",
      "E": "Přibylo 10 obyvatel."
    },
    "correct_option": "D",
    "answer": "Přibylo 5 obyvatel.",
    "answer_explanation": "Z grafu pro rok 2021 odečteme sloupec příslušející Pánovu (šrafovaný). Sloupec je na kladné straně osy a dosahuje hodnoty +5, tedy v Pánově přibylo 5 obyvatel.",
    "hints": ["Najdi v grafu rok 2021 a sloupec patřící Pánovu.", "Pozor na to, zda je sloupec nad nebo pod nulovou osou."],
    "static_teaching_note": "Při čtení sloupcového grafu sleduj vždy správný rok, správnou obec a znaménko (přírůstek vs. úbytek).",
    "played": false,
    "results": null
  },
  {
    "id": "ma_2024_12_2",
    "subject": "matematika",
    "category": "čtení grafu",
    "difficulty": 3,
    "emoji": "📊",
    "type": "mc",
    "question": "Graf znázorňuje přírůstek a úbytek obyvatel v obcích Lidov, Dámov a Pánov v letech 2019–2022. Jestliže na počátku čtyřletého období 1. ledna 2019 žilo v Lidově 300 obyvatel, kolik obyvatel žilo ve stejné obci po třech letech 31. prosince 2021?",
    "options": {
      "A": "290",
      "B": "295",
      "C": "305",
      "D": "310",
      "E": "315"
    },
    "correct_option": "C",
    "answer": "305",
    "answer_explanation": "Z grafu odečteme změny v Lidově za roky 2019, 2020 a 2021: +5, +5, –5 = celkem +5. Výsledný počet: 300 + 5 = 305 obyvatel.",
    "hints": ["Z grafu vyčti změnu počtu obyvatel v Lidově pro každý z let 2019, 2020 a 2021.", "Přírůstky přičti, úbytky odečti od počátečního stavu 300."],
    "static_teaching_note": "U takovýchto úloh je nutné kumulovat změny za každý rok postupně.",
    "played": false,
    "results": null
  },
  {
    "id": "ma_2024_12_3",
    "subject": "matematika",
    "category": "čtení grafu",
    "difficulty": 3,
    "emoji": "📊",
    "type": "mc",
    "question": "Graf znázorňuje přírůstek a úbytek obyvatel v obcích Lidov, Dámov a Pánov v letech 2019–2022. Jak se změnil počet obyvatel v Dámově za všechny čtyři roky dohromady?",
    "options": {
      "A": "Ubylo 5 obyvatel.",
      "B": "Počet obyvatel se nezměnil.",
      "C": "Přibylo 5 obyvatel.",
      "D": "Přibylo 15 obyvatel.",
      "E": "Jiný výsledek."
    },
    "correct_option": "B",
    "answer": "Počet obyvatel se nezměnil.",
    "answer_explanation": "Z grafu odečteme změny v Dámově: 2019: –5, 2020: –5, 2021: 0, 2022: +10. Celkový součet: –5 – 5 + 0 + 10 = 0. Počet obyvatel se za čtyři roky nezměnil.",
    "hints": ["Přečti hodnotu sloupce Dámov pro každý ze čtyř roků.", "Sečti všechny změny – nezapomeň na znaménka."],
    "static_teaching_note": "Změna za více období = součet všech dílčích změn (s jejich znaménky).",
    "played": false,
    "results": null
  },
  {
    "id": "ma_2024_13",
    "subject": "matematika",
    "category": "čas a cestování",
    "difficulty": 3,
    "emoji": "🚗",
    "type": "match",
    "question": "Pan Josef jel autem z Heraltic do Třebíče stálou rychlostí a cesta mu trvala 24 minut. V 7:08 byl v jedné třetině cesty. V polovině cesty projel přes železniční přejezd. Ke každé podúloze přiřaďte správný výsledek (A–F).",
    "options": {
      "A": "7:30",
      "B": "7:24",
      "C": "7:12",
      "D": "7:08",
      "E": "7:00",
      "F": "6:52"
    },
    "correct_option": { "13.1": "E", "13.2": "C", "13.3": "A" },
    "answer": "13.1 → E (7:00), 13.2 → C (7:12), 13.3 → A (7:30)",
    "answer_explanation": "Cesta trvá 24 minut. V 7:08 byl na 1/3 cesty → 1/3 z 24 = 8 minut uběhlo → vyjel v 7:00 (E). Přejezd je v 1/2 cesty → 1/2 z 24 = 12 minut po odjezdu → 7:00 + 12 = 7:12 (C). KdybY vyjel o 6 minut později (7:06), přijel by v 7:06 + 24 = 7:30 (A).",
    "hints": ["Nejdřív zjisti čas odjezdu z jedné třetiny cesty.", "Polovina z 24 minut je 12 minut – přičti ke zjištěnému času odjezdu."],
    "static_teaching_note": "Při úlohách o rovnoměrném pohybu pracujeme s poměry: 1/3 cesty = 1/3 celkového času.",
    "played": false,
    "results": null,
    "subitems": [
      { "id": "13.1", "question": "V kolik hodin pan Josef vyjel?", "correct_option": "E" },
      { "id": "13.2", "question": "V kolik hodin přejel pan Josef železniční přejezd?", "correct_option": "C" },
      { "id": "13.3", "question": "V kolik hodin by pan Josef přijel, kdyby vyjel o 6 minut později?", "correct_option": "A" }
    ]
  }
]

export const PROFILES = [
  { id: 'tata',   name: 'Táta',   emoji: '👨', color: '#3d9efc' },
  { id: 'mama',   name: 'Máma',   emoji: '👩', color: '#f472b6' },
  { id: 'mia',    name: 'Mia',    emoji: '👧', color: '#a78bfa' },
  { id: 'centik', name: 'Centík', emoji: '🦖', color: '#34d399' },
  { id: 'host',   name: 'Host',   emoji: '🙂', color: '#f97316' },
]
