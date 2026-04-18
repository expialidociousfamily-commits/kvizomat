export const questions = [
  {
    id: "mat_001",
    subject: "matematika",
    category: "zlomky",
    difficulty: 2,
    emoji: "🍕",
    question: "Vypočítejte: 2/3 + 1/4 = ?",
    options: { A: "8/12", B: "11/12", C: "3/12", D: "2/7" },
    correct_option: "B",
    answer: "11/12",
    answer_explanation: "Hledáme společného jmenovatele čísel 3 a 4. To je číslo 12. Převedeme: 2/3 = 8/12 a 1/4 = 3/12. Teď sečteme čitatele: 8 + 3 = 11. Výsledek je 11/12.",
    hints: ["Zkus najít číslo dělitelné 3 i 4", "Společný jmenovatel je 12"],
    static_teaching_note: "Zlomky sčítáme tak, že je nejdříve převedeme na stejného jmenovatele."
  },
  {
    id: "cj_001",
    subject: "čeština",
    category: "pravopis",
    difficulty: 2,
    emoji: "📝",
    question: "Které slovo je napsáno správně?\n\nVy__etá a) vybytá  b) vybitá  c) vybitá  d) vybytá",
    options: {
      A: "Baterie je vybitá.",
      B: "Baterie je vybytá.",
      C: "Baterie je vybitá.",
      D: "Baterie je vybytá."
    },
    correct_option: "A",
    answer: "vybitá",
    answer_explanation: "Slovo 'vybitá' pochází od slovesa 'bít' (bít se, boxovat). Vyjmenovaná slova po B jsou: být, bydlit, bývat, obyvatel, byt, příbytek, nábytek, dobytek, zbytky... Slovo 'bít' tam není, proto píšeme -i-.",
    hints: ["Zkus si vzpomenout na vyjmenovaná slova po B", "Pochází toto slovo od 'být' nebo od 'bít'?"],
    static_teaching_note: "Po B píšeme Y jen ve vyjmenovaných slovech a jim příbuzných."
  },
  {
    id: "mat_002",
    subject: "matematika",
    category: "slovní úlohy",
    difficulty: 3,
    emoji: "🚂",
    question: "Vlak ujel za 2 hodiny 160 km. Jak dlouho mu bude trvat celá cesta dlouhá 400 km, jede-li stejnou rychlostí?",
    options: { A: "4 hodiny", B: "4,5 hodiny", C: "5 hodiny", D: "6 hodiny" },
    correct_option: "C",
    answer: "5 hodin",
    answer_explanation: "Nejdřív zjistíme rychlost vlaku: 160 km ÷ 2 hod = 80 km/hod. Pak vypočítáme čas pro 400 km: 400 km ÷ 80 km/hod = 5 hodin.",
    hints: ["Nejdřív zjisti rychlost vlaku", "Rychlost = vzdálenost ÷ čas"],
    static_teaching_note: "Slovní úlohy o pohybu: rychlost = vzdálenost ÷ čas."
  },
  {
    id: "cj_002",
    subject: "čeština",
    category: "synonyma",
    difficulty: 2,
    emoji: "📚",
    question: "Které slovo je synonymum (slovo se stejným nebo podobným významem) slova STATEČNÝ?",
    options: { A: "zbabělý", B: "odvážný", C: "opatrný", D: "silný" },
    correct_option: "B",
    answer: "odvážný",
    answer_explanation: "Synonyma jsou slova s podobným významem. Statečný = odvážný = nebojácný. Zbabělý je opak (antonymum). Opatrný ani silný neznamenají totéž.",
    hints: ["Synonymum znamená slovo s podobným významem", "Nebojácný a odvážný jsou si podobná..."],
    static_teaching_note: "Synonyma jsou slova s podobným nebo stejným významem."
  },
  {
    id: "mat_003",
    subject: "matematika",
    category: "procenta",
    difficulty: 3,
    emoji: "💰",
    question: "Tričko stálo 400 Kč. Je zlevněno o 25 %. Kolik stojí po slevě?",
    options: { A: "375 Kč", B: "300 Kč", C: "350 Kč", D: "100 Kč" },
    correct_option: "B",
    answer: "300 Kč",
    answer_explanation: "25 % ze 400 Kč = 400 × 25 ÷ 100 = 100 Kč. Tato částka je sleva. Cena po slevě = 400 − 100 = 300 Kč.",
    hints: ["Nejdřív vypočítej kolik je 25% ze 400", "Pak odečti slevu od původní ceny"],
    static_teaching_note: "Procenta: p% z čísla X = X × p ÷ 100."
  }
]

export const PROFILES = [
  { id: 'tata',   name: 'Táta',   emoji: '👨', color: '#3d9efc' },
  { id: 'mama',   name: 'Máma',   emoji: '👩', color: '#f472b6' },
  { id: 'mia',    name: 'Mia',    emoji: '👧', color: '#a78bfa' },
  { id: 'centik', name: 'Centík', emoji: '👦', color: '#34d399' },
  { id: 'host',   name: 'Host',   emoji: '🙂', color: '#f97316' },
]
