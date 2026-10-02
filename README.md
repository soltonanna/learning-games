# Play & Learn — children's learning games

Open `index.html` in a browser (double-click works, no server or build step needed).

## Structure

```
index.html              Dashboard page
css/dashboard.css       Dashboard styles
js/games-data.js        ← THE GAME CATALOG (themes + games). Edit this to add games.
js/dashboard.js         Renders filters, theme sections and cards from the catalog
games/shared/engine.js  GameKit: shared multiple-choice engine (rounds, score, stars, read-aloud)
games/shared/game.css   Shared game styles
games/<game-id>/        One folder per game
```

## Add a new game

1. Create `games/my-game/index.html` — copy any existing game and change the
   `id` and `makeQuestion()` function. Each call returns one question:
   `{ prompt, visual, choices, answer, explain?, say?, key?, size? }`.
2. Add an entry to `games` in `js/games-data.js`:

```js
{ id: "my-game", title: "My Game", theme: "math", icon: "🧮",
  description: "One short sentence.", ages: "5–7", url: "games/my-game/index.html" }
```

The card, theme filter and counts update automatically. The game page reads its
title, icon and colours from the same entry.

- **New theme:** add `{ id, name, icon, color, soft }` to `themes`.
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
