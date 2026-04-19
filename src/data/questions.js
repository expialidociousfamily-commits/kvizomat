export const QUESTIONS_VERSION = 3

export const questions = [
  {
    "id": "ma_2024_09",
    "subject": "matematika",
    "category": "rychlost a čas",
    "difficulty": 2,
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
    "answer_explanation": "1. Za 5 minut napíše Tereza 14 přání a Nikola 10 přání, dohromady 14 + 10 = 24 přání za 5 minut.\n2. Potřebujeme napsat 120 přání: 120 ÷ 24 = 5.\n3. To znamená 5 pětiminutových úseků: 5 × 5 = 25 minut.",
    "hints": [
      "Nejprve zjisti, kolik přání napíší obě dívky dohromady za 5 minut.",
      "Podívej se, kolikrát se vejde jejich společný výkon do 120 přání."
    ],
    "static_teaching_note": "Úloha na společnou práci – sečti výkony obou pracovníků za stejný časový úsek, pak dělením najdi počet úseků.",
    "context": null,
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
    "question": "Pan Josef jel autem z Heraltic do Třebíče stálou rychlostí a cesta mu trvala 24 minut. V 7:08 byl v jedné třetině cesty. V polovině cesty projel přes železniční přejezd. Ke každé podúloze přiřaďte správný výsledek (A–F).\n\nMožnosti: A) 7:30 · B) 7:24 · C) 7:12 · D) 7:08 · E) 7:00 · F) 6:52",
    "options": {
      "A": "7:30",
      "B": "7:24",
      "C": "7:12",
      "D": "7:08",
      "E": "7:00",
      "F": "6:52"
    },
    "correct_option": { "1": "E", "2": "C", "3": "A" },
    "answer": "13.1 → E (7:00), 13.2 → C (7:12), 13.3 → A (7:30)",
    "answer_explanation": "Celková délka cesty: 24 minut.\n\n13.1 – Kdy pan Josef vyjel?\n- V 7:08 byl v 1/3 cesty, tedy urazil 1/3 z 24 minut = 8 minut jízdy.\n- Odjezd: 7:08 − 8 min = 7:00. → E\n\n13.2 – Kdy přejel železniční přejezd (v polovině cesty)?\n- Polovina cesty = 1/2 × 24 = 12 minut od odjezdu.\n- 7:00 + 12 min = 7:12. → C\n\n13.3 – Kdy by přijel, kdyby vyjel o 6 minut později?\n- Nový odjezd: 7:00 + 6 = 7:06. Cesta stále trvá 24 minut.\n- Příjezd: 7:06 + 24 = 7:30. → A",
    "hints": [
      "Nejprve vypočítej, kdy pan Josef vyjel – víš, v kolik hodin byl v 1/3 cesty a jak dlouho trvá celá cesta.",
      "Jakmile znáš čas odjezdu, stačí přičítat zlomky z 24 minut pro každou podúlohu."
    ],
    "subitems": [
      { "id": "1", "question": "V kolik hodin pan Josef vyjel?", "correct_option": "E" },
      { "id": "2", "question": "V kolik hodin přejel pan Josef železniční přejezd?", "correct_option": "C" },
      { "id": "3", "question": "V kolik hodin by pan Josef přijel, kdyby vyjel o 6 minut později?", "correct_option": "A" }
    ],
    "static_teaching_note": "Úloha procvičuje práci s časem a zlomky (1/3 a 1/2 z celkové doby). Klíčem je nejprve určit výchozí čas odjezdu a od něj odvíjet vše ostatní.",
    "context": null,
    "played": false,
    "results": null
  }
]

export const PROFILES = [
  { id: 'tata',   name: 'Táta',   emoji: '👨', color: '#3d9efc' },
  { id: 'mama',   name: 'Máma',   emoji: '👩', color: '#f472b6' },
  { id: 'mia',    name: 'Mia',    emoji: '👧', color: '#a78bfa' },
  { id: 'centik', name: 'Centík', emoji: '🦖', color: '#34d399' },
  { id: 'host',   name: 'Host',   emoji: '🙂', color: '#f97316' },
]
