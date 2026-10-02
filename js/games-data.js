/**
 * GAME CATALOG — the only file you need to edit to add a game to the dashboard.
 *
 * Every text is written in 3 languages: { en: "...", hy: "...", ru: "..." }.
 * English is the default and is used if a translation is missing.
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
 *   ages         e.g. "4–5" or "7+". Used by the age filter. If left out, the game counts as "7+".
 *   url          page that opens when the card is clicked
 *   status       optional — "soon" shows the card greyed-out and not clickable
 *
 * Order matters: themes and games appear on the dashboard in the order listed.
 */
window.LEARNING_GAMES = {
  themes: [
    { id: "math",      icon: "🔢", color: "#FF7A30", soft: "#FFF0E5",
      name: { en: "Math", hy: "Մաթեմատիկա", ru: "Математика" } },
    { id: "geography", icon: "🌍", color: "#1FAA6B", soft: "#E3F7EC",
      name: { en: "Geography", hy: "Աշխարհագրություն", ru: "География" } },
    { id: "languages", icon: "🔤", color: "#7C5CFF", soft: "#EFEBFF",
      name: { en: "Languages", hy: "Լեզուներ", ru: "Языки" } },
    { id: "science",   icon: "🔬", color: "#169BDB", soft: "#E2F3FB",
      name: { en: "Science", hy: "Գիտություն", ru: "Наука" } },
    { id: "world",     icon: "🚗", color: "#E39A0B", soft: "#FDF3DC",
      name: { en: "World Around Us", hy: "Շրջակա աշխարհ", ru: "Окружающий мир" } },
    { id: "art",       icon: "🎨", color: "#EC4C8A", soft: "#FDE8F0",
      name: { en: "Art & Music", hy: "Արվեստ և երաժշտություն", ru: "Искусство и музыка" } }
  ],

  games: [
    {
      id: "count-fruits",
      theme: "math",
      icon: "🍎",
      ages: "3–5",
      url: "games/count-fruits/index.html",
      title: { en: "Count the Fruits", hy: "Հաշվիր մրգերը", ru: "Посчитай фрукты" },
      description: {
        en: "Count the fruits in the basket and tap the right number.",
        hy: "Հաշվի՛ր զամբյուղի մրգերը և սեղմի՛ր ճիշտ թիվը։",
        ru: "Посчитай фрукты в корзинке и нажми на правильное число."
      }
    },
    {
      id: "quick-sums",
      theme: "math",
      icon: "➕",
      ages: "4–5",
      url: "games/quick-sums/index.html",
      title: { en: "Quick Sums", hy: "Արագ գումարում", ru: "Быстрый счёт" },
      description: {
        en: "Add two numbers together — the dots help you count.",
        hy: "Գումարի՛ր երկու թիվ․ կետերը կօգնեն հաշվել։",
        ru: "Сложи два числа — точки помогут посчитать."
      }
    },
    {
      id: "flag-detective",
      theme: "geography",
      icon: "🚩",
      ages: "6–9",
      url: "games/flag-detective/index.html",
      title: { en: "Flag Detective", hy: "Դրոշների խուզարկու", ru: "Детектив флагов" },
      description: {
        en: "Look at the flag and find which country it belongs to. 118 countries, 3 levels.",
        hy: "Նայի՛ր դրոշին և գտի՛ր, թե որ երկրինն է։ 118 երկիր, 3 մակարդակ։",
        ru: "Посмотри на флаг и найди, какой стране он принадлежит. 118 стран, 3 уровня."
      }
    },
    {
      id: "capital-cities",
      theme: "geography",
      icon: "🏙️",
      ages: "7–10",
      url: "games/capital-cities/index.html",
      title: { en: "Capital Cities", hy: "Մայրաքաղաքներ", ru: "Столицы" },
      description: {
        en: "Every country has a capital city. Can you name them? 109 capitals, 3 levels.",
        hy: "Ամեն երկիր ունի մայրաքաղաք։ Կարո՞ղ ես անվանել դրանք։ 109 մայրաքաղաք, 3 մակարդակ։",
        ru: "У каждой страны есть столица. Сможешь их назвать? 109 столиц, 3 уровня."
      }
    },
    {
      id: "first-letter",
      theme: "languages",
      icon: "🅰️",
      ages: "4–6",
      url: "games/first-letter/index.html",
      title: { en: "First Letter", hy: "Առաջին տառը", ru: "Первая буква" },
      description: {
        en: "Say the word out loud and pick the letter it starts with.",
        hy: "Բարձրաձայն ասա՛ բառը և ընտրի՛ր այն տառը, որով այն սկսվում է։",
        ru: "Назови слово вслух и выбери, с какой буквы оно начинается."
      }
    },
    {
      id: "color-words",
      theme: "languages",
      icon: "🖍️",
      ages: "3–5",
      url: "games/color-words/index.html",
      title: { en: "Color Words", hy: "Գույների անունները", ru: "Названия цветов" },
      description: {
        en: "Learn the names of colours.",
        hy: "Սովորի՛ր գույների անունները։",
        ru: "Выучи, как называются цвета."
      }
    },
    {
      id: "spin-wheel",
      theme: "languages",
      icon: "🎡",
      ages: "4–7",
      url: "games/spin-wheel/index.html",
      title: { en: "Spin the Wheel", hy: "Պտտիր անիվը", ru: "Крути колесо" },
      description: {
        en: "Spin the alphabet wheel and say words that start with the letter.",
        hy: "Պտտի՛ր այբուբենի անիվը և ասա՛ բառեր ընկած տառով։",
        ru: "Крути колесо с буквами и называй слова на выпавшую букву."
      }
    },
    {
      id: "animal-homes",
      theme: "science",
      icon: "🐬",
      ages: "4–7",
      url: "games/animal-homes/index.html",
      title: { en: "Animal Homes", hy: "Ո՞վ որտեղ է ապրում", ru: "Кто где живёт?" },
      description: {
        en: "Where does each animal live? Ocean, jungle, farm or snow?",
        hy: "Որտե՞ղ է ապրում ամեն կենդանի՝ օվկիանոսում, ջունգլիներում, ագարակում, թե՞ ձյան մեջ։",
        ru: "Где живёт каждое животное? В океане, в джунглях, на ферме или среди льдов?"
      }
    },
    {
      id: "sink-or-float",
      theme: "science",
      icon: "🛟",
      ages: "4–7",
      url: "games/sink-or-float/index.html",
      title: { en: "Sink or Float?", hy: "Կսուզվի՞, թե՞ կլողա", ru: "Тонет или плавает?" },
      description: {
        en: "Guess what happens when you drop things into water.",
        hy: "Գուշակի՛ր, թե ինչ կլինի, եթե իրը գցես ջուրը։",
        ru: "Угадай, что будет, если бросить предмет в воду."
      }
    },
    {
      id: "car-brands",
      theme: "world",
      icon: "🚗",
      ages: "7+",
      url: "games/car-brands/index.html",
      title: { en: "Car Logos", hy: "Մեքենաների լոգոներ", ru: "Логотипы машин" },
      description: {
        en: "Look at the logo and guess the car brand — 3 answers, beat the timer! 45 brands, 3 levels.",
        hy: "Նայի՛ր լոգոյին և գուշակի՛ր մեքենայի մակնիշը․ 3 պատասխան, հասցրու՛ ժամանակին։ 45 մակնիշ, 3 մակարդակ։",
        ru: "Посмотри на логотип и угадай марку машины — 3 ответа, успей до конца таймера! 45 марок, 3 уровня."
      }
    },
    {
      id: "color-mixer",
      theme: "art",
      icon: "🎨",
      ages: "4–7",
      url: "games/color-mixer/index.html",
      status: "soon",
      title: { en: "Color Mixer", hy: "Խառնիր ներկերը", ru: "Смешай краски" },
      description: {
        en: "Mix two paints and discover a brand-new colour.",
        hy: "Խառնի՛ր երկու ներկ և ստացի՛ր նոր գույն։",
        ru: "Смешай две краски и открой новый цвет."
      }
    }
  ]
};
