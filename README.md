# 🎓 Kvízomat — Prototyp

Rodinná appka pro přípravu na přijímačky. TV-first design, AI výukový engine, gamifikace.

## Rychlý start

```bash
# 1. Nainstalovat závislosti
npm install

# 2. Nastavit API klíč
cp .env.example .env
# Otevřete .env a doplňte váš Anthropic API klíč:
# VITE_ANTHROPIC_API_KEY=sk-ant-...

# 3. Spustit vývojový server
npm run dev

# 4. Otevřít v prohlížeči
# http://localhost:5173
# Pro TV: roztáhněte okno prohlížeče na celou obrazovku (F11)
```

## Jak získat API klíč

1. Jděte na https://console.anthropic.com
2. API Keys → Create Key
3. Zkopírujte do `.env`

> ⚠️ API klíč je viditelný v browser devtools — vhodné pro prototyp/domácí použití.
> Pro produkci přidejte backend proxy.

## Struktura

```
src/
├── App.jsx              # Hlavní orchestrátor fází
├── App.css              # Globální styly (TV-first, dark mode)
├── data/questions.js    # Banka demo otázek
├── utils/claude.js      # Volání Anthropic API
└── components/
    ├── HomeScreen.jsx   # Úvodní obrazovka (streak, profily)
    ├── PhaseTeaching.jsx # AI výukový příklad
    ├── PhaseQuestion.jsx # Timer + otázka + MC výběr
    ├── PhaseReveal.jsx  # Dramatické odhalení + vysvětlení
    ├── SessionSummary.jsx # Závěrečné shrnutí
    └── ParentPanel.jsx  # Správa otázek (PIN: 0000)
```

## Přidávání otázek

**Přes UI (Parent Panel):**
1. Klikněte ⚙️ Správa otázek (PIN: 0000)
2. Záložka "➕ Přidat otázku"
3. Smart Paste: vložte text otázky → AI automaticky zparsuje
4. Nebo vyplňte ručně

**Přes kód:**
Přidejte objekt do `src/data/questions.js` dle formátu.

## TV mód

Otevřete Chrome, přejděte na http://localhost:5173, stiskněte F11.
Pro Chromecast: v Chrome klikněte ⋮ → Cast → Přenést záložku.

## Co je v MVP

- ✅ 5 demo otázek (matematika + čeština)
- ✅ AI výukový příklad (Claude API)
- ✅ Timer s papírem + MC odhalení
- ✅ 4 rodinné profily (Táta/Máma/Adéla/Tomáš)
- ✅ Bodování + streak počítadlo
- ✅ Parent Panel se Smart Paste
- ✅ Offline fallback (bez API klíče funguje se statickými texty)

## Co přijde dál (Fáze 2)

- [ ] Avatary a levely
- [ ] Journey Map (cesta na gymnázium)
- [ ] Spaced repetition (opakování špatných otázek)
- [ ] Push notifikace
- [ ] Mobilní odpovídání přes QR kód (websockets)
