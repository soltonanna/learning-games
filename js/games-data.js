/**
 * GAME CATALOG — the only file you need to edit to add a game to the dashboard.
 *
 * THEMES
 *   id     unique key, referenced by games[].theme
 *   name   label shown on chips and section headings
 *   icon   emoji shown next to the name
 *   color  main theme colour (cards, buttons, accents)
 *   soft   pale background tint for the theme
 *
 * GAMES
 *   id           unique key (also used by the game page to find its own info)
 *   title        card title
 *   theme        one of the theme ids above
 *   icon         emoji used as the card preview (used when no image is set)
 *   image        optional — path to a preview image, overrides the icon
 *   description  one short sentence for the card
 *   ages         optional — e.g. "4–6"
 *   url          page that opens when the card is clicked
 *   status       optional — "soon" shows the card greyed-out and not clickable
 *
 * Order matters: themes and games appear on the dashboard in the order listed.
 */
window.LEARNING_GAMES = {
  themes: [
    { id: "math",      name: "Math",        icon: "🔢", color: "#FF7A30", soft: "#FFF0E5" },
    { id: "geography", name: "Geography",   icon: "🌍", color: "#1FAA6B", soft: "#E3F7EC" },
    { id: "languages", name: "Languages",   icon: "🔤", color: "#7C5CFF", soft: "#EFEBFF" },
    { id: "science",   name: "Science",     icon: "🔬", color: "#169BDB", soft: "#E2F3FB" },
    { id: "art",       name: "Art & Music", icon: "🎨", color: "#EC4C8A", soft: "#FDE8F0" }
  ],

  games: [
    {
      id: "count-fruits",
      title: "Count the Fruits",
      theme: "math",
      icon: "🍎",
      description: "Count the fruits in the basket and tap the right number.",
      ages: "3–5",
      url: "games/count-fruits/index.html"
    },
    {
      id: "quick-sums",
      title: "Quick Sums",
      theme: "math",
      icon: "➕",
      description: "Add two numbers together — the dots help you count.",
      ages: "5–7",
      url: "games/quick-sums/index.html"
    },
    {
      id: "flag-detective",
      title: "Flag Detective",
      theme: "geography",
      icon: "🚩",
      description: "Look at the flag and find which country it belongs to.",
      ages: "6–9",
      url: "games/flag-detective/index.html"
    },
    {
      id: "capital-cities",
      title: "Capital Cities",
      theme: "geography",
      icon: "🏙️",
      description: "Every country has a capital city. Can you name them?",
      ages: "7–10",
      url: "games/capital-cities/index.html"
    },
    {
      id: "first-letter",
      title: "First Letter",
      theme: "languages",
      icon: "🅰️",
      description: "Say the word out loud and pick the letter it starts with.",
      ages: "4–6",
      url: "games/first-letter/index.html"
    },
    {
      id: "color-words",
      title: "Color Words",
      theme: "languages",
      icon: "🖍️",
      description: "Learn the names of colours in English.",
      ages: "3–5",
      url: "games/color-words/index.html"
    },
    {
      id: "spin-wheel",
      title: "Spin the Wheel",
      theme: "languages",
      icon: "🎡",
      description: "Spin the alphabet wheel and say words that start with the letter. Armenian, Russian or English!",
      ages: "4–7",
      url: "games/spin-wheel/index.html"
    },
    {
      id: "animal-homes",
      title: "Animal Homes",
      theme: "science",
      icon: "🐬",
      description: "Where does each animal live? Ocean, jungle, farm or snow?",
      ages: "4–7",
      url: "games/animal-homes/index.html"
    },
    {
      id: "sink-or-float",
      title: "Sink or Float?",
      theme: "science",
      icon: "🛟",
      description: "Guess what happens when you drop things into water.",
      ages: "4–7",
      url: "games/sink-or-float/index.html"
    },
    {
      id: "color-mixer",
      title: "Color Mixer",
      theme: "art",
      icon: "🎨",
      description: "Mix two paints and discover a brand-new colour.",
      ages: "4–7",
      url: "games/color-mixer/index.html",
      status: "soon"
    }
  ]
};
