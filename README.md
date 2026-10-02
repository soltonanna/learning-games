# Play & Learn — children's learning games

Open `index.html` in a browser (double-click works, no server or build step needed).

**Online:** every push to `main` is published to GitHub Pages automatically
(`.github/workflows/pages.yml`) at `https://soltonanna.github.io/learning-games/`.

## Structure

```
index.html              Dashboard page
css/dashboard.css       Dashboard styles
js/settings.js          Shared settings: language, thinking time, age filter (remembered in the browser)
js/games-data.js        ← THE GAME CATALOG (themes + games). Edit this to add games.
js/dashboard.js         Renders language switch, theme/age filters, timer setting and cards
games/shared/engine.js  GameKit: shared multiple-choice engine (rounds, score, stars, read-aloud)
games/shared/game.css   Shared game styles
games/<game-id>/        One folder per game
```

## Languages, ages and thinking time

- **3 languages everywhere:** English (default), Armenian, Russian. Pick on the dashboard
  (EN / ՀԱՅ / РУС) or with ⚙️ inside any game. Every text is `{ en, hy, ru }`.
- **Age filter:** All ages / 3–4 / 5–6 / 7+ (7+ is the default). A game shows when its
  `ages` range overlaps the group. A game without `ages` counts as 7+.
- **Thinking time:** Off / 10 / 20 / 30 seconds per question. When time runs out the right
  answer is shown and the game moves on (no star for that question).

## Add a new game

1. Create `games/my-game/index.html` — copy any existing game and change the
   `id` and `makeQuestion(lang)` function. Each call returns one question:
   `{ prompt, visual, choices, answer, explain?, say?, key?, size? }`.
   Write texts with `GameKit.tr({ en: "...", hy: "...", ru: "..." })`.
2. Add an entry to `games` in `js/games-data.js`:

```js
{ id: "my-game", theme: "math", icon: "🧮", ages: "5–7", url: "games/my-game/index.html",
  title: { en: "My Game", hy: "Իմ խաղը", ru: "Моя игра" },
  description: { en: "One short sentence.", hy: "…", ru: "…" } }
```

The card, theme filter and counts update automatically. The game page reads its
title, icon and colours from the same entry.

- **New theme:** add `{ id, name: { en, hy, ru }, icon, color, soft }` to `themes`.
- **Preview image instead of emoji:** add `image: "images/my-game.png"`.
- **Not ready yet:** add `status: "soon"` — the card shows greyed out and isn't clickable.
- **Different game style** (drag & drop, memory cards…): the page doesn't have to use
  GameKit — any HTML page at `url` works.

## Run with Docker

```bash
docker compose up -d --build     # → http://localhost:8080
docker compose down              # stop
```

Live editing (no rebuild — just refresh the browser):

```bash
docker compose --profile dev up dev   # → http://localhost:8081
```

Without Compose:

```bash
docker build -t play-and-learn .
docker run -d -p 8080:80 --name play-and-learn play-and-learn
```
