/**
 * GameKit — a tiny shared engine for multiple-choice learning games.
 *
 * A game page only needs to call:
 *
 *   GameKit.start({
 *     id: "count-fruits",          // must match an id in js/games-data.js
 *     rounds: 10,                  // optional, default 10
 *     makeQuestion: function () {  // called once per round
 *       return {
 *         key:     "unique-id",     // optional — avoids repeating questions
 *         prompt:  "How many apples?",
 *         say:     "How many apples?", // optional — text read aloud by 🔊
 *         visual:  "<div>...</div>",   // HTML shown in the big picture area
 *         choices: [1, 2, 3, 4],       // answer buttons (in display order)
 *         answer:  3,
 *         explain: "3 apples!",        // optional — shown after a right answer
 *         size:    "big"               // optional — "big" for numbers/letters
 *       };
 *     }
 *   });
 *
 * Title, icon and colours are read from the catalog, so they stay in one place.
 */
(function () {
  "use strict";

  /* ---------- Helpers games can use ---------- */

  function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
  function pick(list) { return list[Math.floor(Math.random() * list.length)]; }
  function shuffle(list) {
    var a = list.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
    }
    return a;
  }
  /** n random items from list, excluding any in `exclude`. */
  function sample(list, n, exclude) {
    exclude = exclude || [];
    return shuffle(list.filter(function (x) { return exclude.indexOf(x) === -1; })).slice(0, n);
  }
  /** `count` shuffled numbers in [min, max] including `answer`, mostly close to it. */
  function numberChoices(answer, min, max, count) {
    count = Math.min(count || 4, max - min + 1);
    var set = [answer];
    var guard = 0;
    while (set.length < count && guard++ < 200) {
      var c = guard < 40 ? answer + randInt(-3, 3) : randInt(min, max);
      if (c >= min && c <= max && set.indexOf(c) === -1) set.push(c);
    }
    return shuffle(set);
  }
  /** Correct answer + (count-1) distractors, shuffled. */
  function withDistractors(answer, pool, count) {
    return shuffle([answer].concat(sample(pool, (count || 4) - 1, [answer])));
  }

  var PRAISE = ["Great job!", "Super!", "You got it!", "Awesome!", "Well done!", "Brilliant!", "Yes!"];
  var RETRY = ["Almost! Try again.", "Not quite — have another go!", "Oops! Try another one."];

  /* ---------- Engine ---------- */

  function start(opts) {
    var catalog = window.LEARNING_GAMES || { themes: [], games: [] };
    var game = catalog.games.filter(function (g) { return g.id === opts.id; })[0] ||
      { title: opts.id, icon: "🎮", theme: "" };
    var theme = catalog.themes.filter(function (t) { return t.id === game.theme; })[0] ||
      { color: "#7C5CFF", soft: "#EFEBFF" };

    var rounds = opts.rounds || 10;
    var canSpeak = "speechSynthesis" in window;

    document.title = game.title + " · Play & Learn";
    document.documentElement.style.setProperty("--c", theme.color);
    document.documentElement.style.setProperty("--soft", theme.soft);

    var root = document.getElementById("game");
    root.innerHTML =
      '<header class="g-top">' +
        '<a class="g-back" href="../../index.html' + (game.theme ? "#" + game.theme : "") + '">' +
          '<span aria-hidden="true">←</span> <span class="g-back__label">All games</span></a>' +
        '<div class="g-title"><span aria-hidden="true">' + game.icon + "</span> " + escapeHTML(game.title) + "</div>" +
        '<div class="g-score" aria-label="Score"><span aria-hidden="true">⭐</span> <b id="g-score">0</b></div>' +
      "</header>" +
      '<div class="g-progress" role="progressbar" aria-valuemin="0" aria-valuemax="' + rounds + '">' +
        '<div class="g-progress__bar" id="g-bar"></div></div>' +
      '<main class="g-stage"><div class="g-card" id="g-card"></div></main>';

    var card = document.getElementById("g-card");
    var scoreEl = document.getElementById("g-score");
    var bar = document.getElementById("g-bar");
    var progress = bar.parentNode;

    var state;

    function reset() {
      state = { round: 0, score: 0, seen: {} };
      scoreEl.textContent = "0";
      nextQuestion();
    }

    function setProgress(n) {
      bar.style.width = (n / rounds * 100) + "%";
      progress.setAttribute("aria-valuenow", n);
    }

    function newQuestion() {
      var q, tries = 0;
      do { q = opts.makeQuestion(); tries++; }
      while (q.key != null && state.seen[q.key] && tries < 30);
      if (q.key != null) state.seen[q.key] = true;
      return q;
    }

    function speak(text) {
      if (!canSpeak || !text) return;
      window.speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(text);
      u.lang = "en-US";
      u.rate = 0.9;
      window.speechSynthesis.speak(u);
    }

    function nextQuestion() {
      if (state.round >= rounds) return finish();
      setProgress(state.round);
      var q = newQuestion();
      var firstTry = true;
      var locked = false;

      card.innerHTML =
        '<div class="g-prompt">' +
          '<h1 class="g-question">' + escapeHTML(q.prompt) + "</h1>" +
          (canSpeak ? '<button class="g-say" type="button" aria-label="Read the question aloud">🔊</button>' : "") +
        "</div>" +
        '<div class="g-visual">' + (q.visual || "") + "</div>" +
        '<div class="g-choices' + (q.size === "big" ? " g-choices--big" : "") +
          (q.choices.length === 2 ? " g-choices--two" : "") + '"></div>' +
        '<p class="g-feedback" aria-live="polite">&nbsp;</p>';

      var say = card.querySelector(".g-say");
      if (say) say.addEventListener("click", function () { speak(q.say || q.prompt); });

      var feedback = card.querySelector(".g-feedback");
      var choicesEl = card.querySelector(".g-choices");

      q.choices.forEach(function (choice) {
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "g-choice";
        btn.textContent = String(choice);
        btn.addEventListener("click", function () {
          if (locked || btn.disabled) return;
          if (choice === q.answer) {
            locked = true;
            if (firstTry) { state.score++; scoreEl.textContent = state.score; }
            btn.classList.add("is-right");
            feedback.className = "g-feedback is-right";
            feedback.textContent = pick(PRAISE) + (q.explain ? " " + q.explain : "");
            card.classList.add("g-pop");
            Array.prototype.forEach.call(choicesEl.children, function (b) { b.disabled = true; });
            state.round++;
            setProgress(state.round);
            setTimeout(function () { card.classList.remove("g-pop"); nextQuestion(); }, q.explain ? 1700 : 1100);
          } else {
            firstTry = false;
            btn.disabled = true;
            btn.classList.add("is-wrong");
            feedback.className = "g-feedback is-wrong";
            feedback.textContent = pick(RETRY);
          }
        });
        choicesEl.appendChild(btn);
      });
    }

    function finish() {
      setProgress(rounds);
      var ratio = state.score / rounds;
      var stars = ratio >= 0.9 ? 3 : ratio >= 0.6 ? 2 : 1;
      var msg = stars === 3 ? "Amazing work!" : stars === 2 ? "Great playing!" : "Good try — practice makes perfect!";

      card.innerHTML =
        '<div class="g-end">' +
          '<div class="g-stars" aria-label="' + stars + ' out of 3 stars">' +
            [1, 2, 3].map(function (i) {
              return '<span class="g-star' + (i <= stars ? " is-on" : "") + '" style="animation-delay:' + (i * 0.15) + 's">★</span>';
            }).join("") +
          "</div>" +
          '<h1 class="g-end__title">' + msg + "</h1>" +
          '<p class="g-end__score">You got <b>' + state.score + "</b> of " + rounds + " right on the first try.</p>" +
          '<div class="g-end__actions">' +
            '<button class="g-btn g-btn--primary" type="button" id="g-again">Play again</button>' +
            '<a class="g-btn" href="../../index.html' + (game.theme ? "#" + game.theme : "") + '">More games</a>' +
          "</div>" +
        "</div>";

      document.getElementById("g-again").addEventListener("click", reset);
    }

    reset();
  }

  function escapeHTML(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  window.GameKit = {
    start: start,
    randInt: randInt,
    pick: pick,
    shuffle: shuffle,
    sample: sample,
    numberChoices: numberChoices,
    withDistractors: withDistractors
  };
})();
