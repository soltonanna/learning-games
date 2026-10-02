/**
 * Dashboard UI — renders the language switch, theme + age filters, thinking-time
 * setting and game cards from window.LEARNING_GAMES.
 * You shouldn't need to touch this file to add games; edit js/games-data.js instead.
 */
(function () {
  "use strict";

  var S = window.PlaySettings;
  var catalog = window.LEARNING_GAMES || { themes: [], games: [] };
  var themes = catalog.themes;
  var themeById = {};
  themes.forEach(function (t) { themeById[t.id] = t; });

  // Ignore (and warn about) games pointing at a theme that doesn't exist.
  var games = catalog.games.filter(function (g) {
    if (!themeById[g.theme]) {
      console.warn('[Play & Learn] Game "' + g.id + '" has unknown theme "' + g.theme + '"');
      return false;
    }
    return true;
  });

  /* ---------- Dashboard texts ---------- */

  var UI = {
    heroTitle: { en: "What shall we learn today?", hy: "Ի՞նչ ենք սովորելու այսօր", ru: "Чему научимся сегодня?" },
    heroSub: {
      en: "Pick a game, tap it, and start playing!",
      hy: "Ընտրի՛ր խաղը, սեղմի՛ր և սկսի՛ր խաղալ։",
      ru: "Выбери игру, нажми на неё и начинай играть!"
    },
    allGames: { en: "All games", hy: "Բոլոր խաղերը", ru: "Все игры" },
    age: { en: "Age", hy: "Տարիք", ru: "Возраст" },
    allAges: { en: "All ages", hy: "Բոլորը", ru: "Все" },
    timer: { en: "Thinking time", hy: "Մտածելու ժամանակ", ru: "Время на ответ" },
    off: { en: "Off", hy: "Անջատ", ru: "Выкл" },
    sec: { en: "s", hy: "վ", ru: "с" },
    timerHint: {
      en: "Each question gets a countdown.",
      hy: "Յուրաքանչյուր հարցի համար ժամաչափ կլինի։",
      ru: "У каждого вопроса будет таймер."
    },
    language: { en: "Language", hy: "Լեզու", ru: "Язык" },
    agesLabel: { en: "Ages {a}", hy: "{a} տարեկան", ru: "{a} лет" },
    play: { en: "Play", hy: "Խաղալ", ru: "Играть" },
    soon: { en: "Soon", hy: "Շուտով", ru: "Скоро" },
    comingSoon: { en: "Coming soon", hy: "Շուտով", ru: "Скоро" },
    game: { en: ["game", "games"], hy: ["խաղ"], ru: ["игра", "игры", "игр"] },
    empty: {
      en: "No games for this age here yet.",
      hy: "Այս տարիքի համար այստեղ դեռ խաղեր չկան։",
      ru: "Для этого возраста здесь пока нет игр."
    },
    showAllAges: { en: "Show all ages", hy: "Ցույց տալ բոլոր տարիքները", ru: "Показать все возрасты" },
    footer: {
      en: "Made with care for curious little minds.",
      hy: "Ստեղծված է սիրով՝ փոքրիկ հետաքրքրասերների համար։",
      ru: "Сделано с любовью для маленьких любознаек."
    }
  };

  function t(key) { return S.tr(UI[key]); }

  var $ = function (id) { return document.getElementById(id); };
  var els = {
    lang: $("lang"),
    filters: $("filters"),
    ages: $("ages"),
    timer: $("timer"),
    sections: $("sections"),
    heroTitle: $("hero-title"),
    heroSub: $("hero-sub"),
    footer: $("footer")
  };

  function esc(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  function themeStyle(th) { return "--c:" + th.color + ";--soft:" + th.soft; }

  function visibleGames() {
    var age = S.get("age");
    return games.filter(function (g) { return S.matchesAge(g.ages, age); });
  }

  function currentTheme() {
    var id = decodeURIComponent(location.hash.replace("#", ""));
    return themeById[id] ? id : "all";
  }

  /* ---------- Language switch ---------- */

  function renderLang(lang) {
    els.lang.setAttribute("aria-label", t("language"));
    els.lang.innerHTML = S.LANGS.map(function (l) {
      var on = l.id === lang;
      return '<button type="button" class="lang__btn' + (on ? " is-active" : "") + '" data-lang="' + l.id + '"' +
        ' aria-pressed="' + on + '" title="' + esc(l.name) + '" lang="' + l.id + '">' + esc(l.label) + "</button>";
    }).join("");
  }

  /* ---------- Theme chips ---------- */

  function renderFilters(active, list) {
    function count(themeId) { return list.filter(function (g) { return g.theme === themeId; }).length; }

    var chips = [
      '<a class="chip' + (active === "all" ? " is-active" : "") + '" href="#all"' +
        (active === "all" ? ' aria-current="true"' : "") + ">" +
        '<span class="chip__icon" aria-hidden="true">✨</span>' + esc(t("allGames")) +
        '<span class="chip__count">' + list.length + "</span></a>"
    ];

    themes.forEach(function (th) {
      if (!games.some(function (g) { return g.theme === th.id; })) return;
      var n = count(th.id);
      var on = active === th.id;
      chips.push(
        '<a class="chip' + (on ? " is-active" : "") + (n ? "" : " is-empty") + '" href="#' + esc(th.id) + '" style="' + themeStyle(th) + '"' +
          (on ? ' aria-current="true"' : "") + ">" +
          '<span class="chip__icon" aria-hidden="true">' + esc(th.icon) + "</span>" + esc(S.tr(th.name)) +
          '<span class="chip__count">' + n + "</span></a>"
      );
    });

    els.filters.innerHTML = chips.join("");
  }

  /* ---------- Age + timer settings ---------- */

  function segButton(attr, value, label, on) {
    return '<button type="button" class="seg__btn' + (on ? " is-active" : "") + '" data-' + attr + '="' + esc(value) + '"' +
      ' aria-pressed="' + on + '">' + label + "</button>";
  }

  function renderSettings() {
    var age = S.get("age");
    var timer = S.get("timer");

    els.ages.innerHTML =
      '<span class="setting__label"><span aria-hidden="true">🎂</span> ' + esc(t("age")) + "</span>" +
      '<div class="seg" role="group" aria-label="' + esc(t("age")) + '">' +
        S.AGE_GROUPS.map(function (a) {
          return segButton("age", a.id, a.id === "all" ? esc(t("allAges")) : esc(a.label), a.id === age);
        }).join("") +
      "</div>";

    els.timer.innerHTML =
      '<span class="setting__label" title="' + esc(t("timerHint")) + '"><span aria-hidden="true">⏱️</span> ' + esc(t("timer")) + "</span>" +
      '<div class="seg" role="group" aria-label="' + esc(t("timer")) + '">' +
        S.TIMERS.map(function (s) {
          return segButton("timer", s, s ? s + "&nbsp;" + esc(t("sec")) : esc(t("off")), s === timer);
        }).join("") +
      "</div>";
  }

  /* ---------- Cards ---------- */

  function cardHTML(g) {
    var th = themeById[g.theme];
    var soon = g.status === "soon";
    var title = S.tr(g.title);
    var tag = soon ? "div" : "a";
    var attrs = soon
      ? ' aria-disabled="true"'
      : ' href="' + esc(g.url) + '" aria-label="' + esc(t("play") + " · " + title) + '"';

    var preview = g.image
      ? '<img class="card__img" src="' + esc(g.image) + '" alt="" loading="lazy">'
      : '<span class="card__icon" aria-hidden="true">' + esc(g.icon) + "</span>";

    var ages = g.ages || S.DEFAULT_AGES;

    return (
      "<" + tag + ' class="card' + (soon ? " card--soon" : "") + '" style="' + themeStyle(th) + '"' + attrs + ">" +
        '<div class="card__preview">' + preview +
          (soon ? '<span class="card__badge">' + esc(t("comingSoon")) + "</span>" : "") +
        "</div>" +
        '<div class="card__body">' +
          '<span class="card__theme">' + esc(th.icon) + " " + esc(S.tr(th.name)) + "</span>" +
          '<h3 class="card__title">' + esc(title) + "</h3>" +
          '<p class="card__desc">' + esc(S.tr(g.description)) + "</p>" +
        "</div>" +
        '<div class="card__foot">' +
          '<span class="card__ages">' + esc(t("agesLabel").replace("{a}", ages)) + "</span>" +
          '<span class="card__play">' + (soon ? esc(t("soon")) : esc(t("play")) + ' <span aria-hidden="true">▶</span>') + "</span>" +
        "</div>" +
      "</" + tag + ">"
    );
  }

  function renderSections(active, list) {
    var shown = active === "all" ? themes : [themeById[active]];

    var html = shown.map(function (th) {
      var items = list.filter(function (g) { return g.theme === th.id; });
      if (!items.length) return "";
      return (
        '<section class="theme" id="theme-' + esc(th.id) + '" style="' + themeStyle(th) + '">' +
          '<h2 class="theme__title">' +
            '<span class="theme__badge" aria-hidden="true">' + esc(th.icon) + "</span>" +
            esc(S.tr(th.name)) +
            '<span class="theme__count">' + items.length + " " + esc(S.plural(items.length, UI.game)) + "</span>" +
          "</h2>" +
          '<div class="grid">' + items.map(cardHTML).join("") + "</div>" +
        "</section>"
      );
    }).join("");

    if (!html) {
      html =
        '<div class="empty">' +
          '<div class="empty__icon" aria-hidden="true">🧸</div>' +
          "<p>" + esc(t("empty")) + "</p>" +
          '<button type="button" class="empty__btn" data-age="all">' + esc(t("showAllAges")) + "</button>" +
        "</div>";
    }

    els.sections.innerHTML = html;
  }

  /* ---------- Render ---------- */

  function render() {
    var lang = S.get("lang");
    var active = currentTheme();
    var list = visibleGames();

    document.documentElement.lang = lang;
    els.heroTitle.textContent = t("heroTitle");
    els.heroSub.textContent = t("heroSub");
    els.footer.textContent = t("footer");

    renderLang(lang);
    renderFilters(active, list);
    renderSettings();
    renderSections(active, list);
  }

  document.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-lang],[data-age],[data-timer]");
    if (!btn) return;
    if (btn.hasAttribute("data-lang")) S.set("lang", btn.getAttribute("data-lang"));
    if (btn.hasAttribute("data-age")) S.set("age", btn.getAttribute("data-age"));
    if (btn.hasAttribute("data-timer")) S.set("timer", btn.getAttribute("data-timer"));
    render();
  });

  window.addEventListener("hashchange", render);
  // Coming back with the browser's Back button: pick up settings changed inside a game.
  window.addEventListener("pageshow", render);
  render();
})();
