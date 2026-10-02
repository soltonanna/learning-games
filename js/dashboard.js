/**
 * Dashboard UI — renders theme filters and game cards from window.LEARNING_GAMES.
 * You shouldn't need to touch this file to add games; edit js/games-data.js instead.
 */
(function () {
  "use strict";

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

  var filtersEl = document.getElementById("filters");
  var sectionsEl = document.getElementById("sections");

  function esc(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  function themeStyle(t) {
    return "--c:" + t.color + ";--soft:" + t.soft;
  }

  function gamesFor(themeId) {
    return games.filter(function (g) { return g.theme === themeId; });
  }

  function currentFilter() {
    var id = decodeURIComponent(location.hash.replace("#", ""));
    return themeById[id] ? id : "all";
  }

  /* ---------- Filters ---------- */

  function renderFilters(active) {
    var chips = [
      '<a class="chip' + (active === "all" ? " is-active" : "") + '" href="#all"' +
        (active === "all" ? ' aria-current="true"' : "") + ">" +
        '<span class="chip__icon" aria-hidden="true">✨</span>All games' +
        '<span class="chip__count">' + games.length + "</span></a>"
    ];

    themes.forEach(function (t) {
      var count = gamesFor(t.id).length;
      if (!count) return;
      var on = active === t.id;
      chips.push(
        '<a class="chip' + (on ? " is-active" : "") + '" href="#' + esc(t.id) + '" style="' + themeStyle(t) + '"' +
          (on ? ' aria-current="true"' : "") + ">" +
          '<span class="chip__icon" aria-hidden="true">' + esc(t.icon) + "</span>" + esc(t.name) +
          '<span class="chip__count">' + count + "</span></a>"
      );
    });

    filtersEl.innerHTML = chips.join("");
  }

  /* ---------- Cards ---------- */

  function cardHTML(g) {
    var t = themeById[g.theme];
    var soon = g.status === "soon";
    var tag = soon ? "div" : "a";
    var attrs = soon
      ? ' aria-disabled="true"'
      : ' href="' + esc(g.url) + '" aria-label="Play ' + esc(g.title) + '"';

    var preview = g.image
      ? '<img class="card__img" src="' + esc(g.image) + '" alt="" loading="lazy">'
      : '<span class="card__icon" aria-hidden="true">' + esc(g.icon) + "</span>";

    return (
      "<" + tag + ' class="card' + (soon ? " card--soon" : "") + '" style="' + themeStyle(t) + '"' + attrs + ">" +
        '<div class="card__preview">' + preview +
          (soon ? '<span class="card__badge">Coming soon</span>' : "") +
        "</div>" +
        '<div class="card__body">' +
          '<span class="card__theme">' + esc(t.icon) + " " + esc(t.name) + "</span>" +
          '<h3 class="card__title">' + esc(g.title) + "</h3>" +
          '<p class="card__desc">' + esc(g.description) + "</p>" +
        "</div>" +
        '<div class="card__foot">' +
          (g.ages ? '<span class="card__ages">Ages ' + esc(g.ages) + "</span>" : "<span></span>") +
          '<span class="card__play">' + (soon ? "Soon" : 'Play <span aria-hidden="true">▶</span>') + "</span>" +
        "</div>" +
      "</" + tag + ">"
    );
  }

  function renderSections(active) {
    var visible = active === "all" ? themes : [themeById[active]];

    sectionsEl.innerHTML = visible.map(function (t) {
      var list = gamesFor(t.id);
      if (!list.length) return "";
      return (
        '<section class="theme" id="theme-' + esc(t.id) + '" style="' + themeStyle(t) + '">' +
          '<h2 class="theme__title">' +
            '<span class="theme__badge" aria-hidden="true">' + esc(t.icon) + "</span>" +
            esc(t.name) +
            '<span class="theme__count">' + list.length + (list.length === 1 ? " game" : " games") + "</span>" +
          "</h2>" +
          '<div class="grid">' + list.map(cardHTML).join("") + "</div>" +
        "</section>"
      );
    }).join("");
  }

  function render() {
    var active = currentFilter();
    renderFilters(active);
    renderSections(active);
  }

  window.addEventListener("hashchange", render);
  render();
})();
