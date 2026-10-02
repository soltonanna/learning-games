/**
 * GameKit — a tiny shared engine for multiple-choice learning games.
 *
 * Every game works in 3 languages (English default, Armenian, Russian) and has an
 * optional "thinking time" countdown. Both are picked on the dashboard or with the
 * ⚙️ button inside the game, and are remembered (see js/settings.js).
 *
 * A game page only needs to call:
 *
 *   GameKit.start({
 *     id: "count-fruits",              // must match an id in js/games-data.js
 *     rounds: 10,                      // optional, default 10
 *     makeQuestion: function (lang) {  // called once per round; lang = "en" | "hy" | "ru"
 *       return {
 *         key:     "unique-id",         // optional — avoids repeating questions
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
 * Tip: GameKit.tr({ en: "...", hy: "...", ru: "..." }) picks the current language.
 * Title, icon and colours are read from the catalog, so they stay in one place.
 */
(function () {
  "use strict";

  var S = window.PlaySettings;

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

  /* ---------- Engine texts ---------- */

  var UI = {
    praise: {
      en: ["Great job!", "Super!", "You got it!", "Awesome!", "Well done!", "Brilliant!", "Yes!"],
      hy: ["Ապրե՛ս։", "Կեցցե՛ս։", "Ճիշտ է։", "Հրաշալի է։", "Շատ լավ։", "Սուպեր։"],
      ru: ["Молодец!", "Отлично!", "Правильно!", "Супер!", "Умница!", "Здорово!"]
    },
    retry: {
      en: ["Almost! Try again.", "Not quite — have another go!", "Oops! Try another one."],
      hy: ["Գրեթե։ Նորից փորձի՛ր։", "Ոչինչ, փորձի՛ր նորից։", "Վա՜յ, փորձի՛ր մեկ ուրիշը։"],
      ru: ["Почти! Попробуй ещё.", "Не совсем — попробуй снова!", "Ой! Попробуй другой ответ."]
    },
    timeUp: {
      en: "Time's up! The answer is {a}.",
      hy: "Ժամանակը սպառվեց։ Ճիշտ պատասխանն է՝ {a}։",
      ru: "Время вышло! Правильный ответ: {a}."
    },
    allGames: { en: "All games", hy: "Բոլոր խաղերը", ru: "Все игры" },
    readAloud: { en: "Read the question aloud", hy: "Կարդալ հարցը", ru: "Прочитать вопрос вслух" },
    score: { en: "Score", hy: "Միավորներ", ru: "Очки" },
    settings: { en: "Settings", hy: "Կարգավորումներ", ru: "Настройки" },
    language: { en: "Language", hy: "Լեզու", ru: "Язык" },
    timer: { en: "Thinking time", hy: "Մտածելու ժամանակ", ru: "Время на ответ" },
    off: { en: "Off", hy: "Անջատ", ru: "Выкл" },
    sec: { en: "s", hy: "վ", ru: "с" },
    restartNote: {
      en: "Changing a setting starts the game again.",
      hy: "Կարգավորումը փոխելիս խաղը նորից կսկսվի։",
      ru: "После изменения игра начнётся заново."
    },
    end3: { en: "Amazing work!", hy: "Հրաշալի՜ է", ru: "Потрясающе!" },
    end2: { en: "Great playing!", hy: "Լավ խաղացիր։", ru: "Отличная игра!" },
    end1: {
      en: "Good try — practice makes perfect!",
      hy: "Լավ փորձ էր․ մարզվի՛ր, և ամեն ինչ կստացվի։",
      ru: "Хорошая попытка — тренируйся, и всё получится!"
    },
    endScore: {
      en: "You got <b>{n}</b> of {r} right on the first try.",
      hy: "Առաջին փորձից ճիշտ է <b>{n}</b>-ը {r}-ից։",
      ru: "С первой попытки: <b>{n}</b> из {r}."
    },
    stars: { en: "{n} out of 3 stars", hy: "{n} աստղ 3-ից", ru: "{n} из 3 звёзд" },
    again: { en: "Play again", hy: "Նորից խաղալ", ru: "Играть снова" },
    more: { en: "More games", hy: "Այլ խաղեր", ru: "Другие игры" }
  };

  function t(key) { return S.tr(UI[key]); }

  /* ---------- Read-aloud ---------- */

  var canSpeak = "speechSynthesis" in window;

  /** A voice for the language, or null. English falls back to the default voice. */
  function voiceFor(lang) {
    if (!canSpeak) return null;
    var code = S.langInfo(lang).speech.toLowerCase();
    var prefix = code.slice(0, 2);
    var voices = window.speechSynthesis.getVoices() || [];
    var exact = voices.filter(function (v) { return v.lang && v.lang.toLowerCase().replace("_", "-") === code; })[0];
    return exact || voices.filter(function (v) { return v.lang && v.lang.toLowerCase().indexOf(prefix) === 0; })[0] || null;
  }

  function canSpeakLang(lang) {
    return canSpeak && (lang === "en" || !!voiceFor(lang));
  }

  function speak(text, lang) {
    if (!canSpeak || !text) return;
    window.speechSynthesis.cancel();
    var u = new SpeechSynthesisUtterance(text);
    u.lang = S.langInfo(lang).speech;
    var v = voiceFor(lang);
    if (v) u.voice = v;
    u.rate = 0.9;
    window.speechSynthesis.speak(u);
  }

  /* ---------- Engine ---------- */

  function start(opts) {
    var catalog = window.LEARNING_GAMES || { themes: [], games: [] };
    var game = catalog.games.filter(function (g) { return g.id === opts.id; })[0] ||
      { title: opts.id, icon: "🎮", theme: "" };
    var theme = catalog.themes.filter(function (th) { return th.id === game.theme; })[0] ||
      { color: "#7C5CFF", soft: "#EFEBFF" };

    var rounds = opts.rounds || 10;
    var home = "../../index.html" + (game.theme ? "#" + game.theme : "");
    var root = document.getElementById("game");

    document.documentElement.style.setProperty("--c", theme.color);
    document.documentElement.style.setProperty("--soft", theme.soft);

    var lang, timerSec, state, card, scoreEl, bar, progress, panel, gear;
    var timer = { id: null, end: 0 };
    var nextTimeout = null;

    function stopTimer() {
      if (timer.id) clearInterval(timer.id);
      timer.id = null;
    }

    function stopAll() {
      stopTimer();
      if (nextTimeout) clearTimeout(nextTimeout);
      nextTimeout = null;
      if (canSpeak) window.speechSynthesis.cancel();
    }

    function later(fn, ms) {
      if (nextTimeout) clearTimeout(nextTimeout);
      nextTimeout = setTimeout(function () { nextTimeout = null; fn(); }, ms);
    }

    /* ----- Page shell (header, settings panel, progress, card) ----- */

    function seg(attr, items, current) {
      return '<div class="g-seg" role="group">' + items.map(function (it) {
        var on = String(it.value) === String(current);
        return '<button type="button" class="g-seg__btn' + (on ? " is-active" : "") + '" data-' + attr + '="' + it.value + '"' +
          ' aria-pressed="' + on + '"' + (it.lang ? ' lang="' + it.lang + '"' : "") + ">" + it.label + "</button>";
      }).join("") + "</div>";
    }

    function build() {
      stopAll();
      lang = S.get("lang");
      timerSec = S.get("timer");

      var title = S.tr(game.title);
      document.documentElement.lang = lang;
      document.title = title + " · Play & Learn";

      root.innerHTML =
        '<header class="g-top">' +
          '<a class="g-back" href="' + home + '">' +
            '<span aria-hidden="true">←</span> <span class="g-back__label">' + escapeHTML(t("allGames")) + "</span></a>" +
          '<div class="g-title"><span aria-hidden="true">' + game.icon + "</span> " + escapeHTML(title) + "</div>" +
          '<div class="g-right">' +
            '<button class="g-gear" type="button" id="g-gear" aria-expanded="false" aria-controls="g-panel" title="' + escapeHTML(t("settings")) + '">' +
              '<span aria-hidden="true">⚙️</span><span class="g-gear__lang">' + escapeHTML(S.langInfo(lang).label) + "</span>" +
              (timerSec ? '<span class="g-gear__timer">⏱️' + timerSec + "</span>" : "") +
            "</button>" +
            '<div class="g-score" aria-label="' + escapeHTML(t("score")) + '"><span aria-hidden="true">⭐</span> <b id="g-score">0</b></div>' +
          "</div>" +
          '<div class="g-panel" id="g-panel" hidden>' +
            '<div class="g-panel__row"><span class="g-panel__label">🌐 ' + escapeHTML(t("language")) + "</span>" +
              seg("lang", S.LANGS.map(function (l) { return { value: l.id, label: escapeHTML(l.label), lang: l.id }; }), lang) +
            "</div>" +
            '<div class="g-panel__row"><span class="g-panel__label">⏱️ ' + escapeHTML(t("timer")) + "</span>" +
              seg("timer", S.TIMERS.map(function (s) {
                return { value: s, label: s ? s + "&nbsp;" + escapeHTML(t("sec")) : escapeHTML(t("off")) };
              }), timerSec) +
            "</div>" +
            '<p class="g-panel__note">' + escapeHTML(t("restartNote")) + "</p>" +
          "</div>" +
        "</header>" +
        '<div class="g-progress" role="progressbar" aria-valuemin="0" aria-valuemax="' + rounds + '">' +
          '<div class="g-progress__bar" id="g-bar"></div></div>' +
        '<main class="g-stage"><div class="g-card" id="g-card"></div></main>';

      card = document.getElementById("g-card");
      scoreEl = document.getElementById("g-score");
      bar = document.getElementById("g-bar");
      progress = bar.parentNode;
      panel = document.getElementById("g-panel");
      gear = document.getElementById("g-gear");

      gear.addEventListener("click", function (e) {
        e.stopPropagation();
        togglePanel(panel.hidden);
      });

      panel.addEventListener("click", function (e) {
        e.stopPropagation();
        var btn = e.target.closest("[data-lang],[data-timer]");
        if (!btn) return;
        if (btn.hasAttribute("data-lang")) S.set("lang", btn.getAttribute("data-lang"));
        if (btn.hasAttribute("data-timer")) S.set("timer", btn.getAttribute("data-timer"));
        build();
      });

      reset();
    }

    function togglePanel(open) {
      if (!panel) return;
      panel.hidden = !open;
      gear.setAttribute("aria-expanded", String(open));
    }

    document.addEventListener("click", function () { togglePanel(false); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") togglePanel(false); });

    /* ----- Rounds ----- */

    function reset() {
      stopAll();
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
      do { q = opts.makeQuestion(lang); tries++; }
      while (q.key != null && state.seen[q.key] && tries < 30);
      if (q.key != null) state.seen[q.key] = true;
      return q;
    }

    function startTimer(onTimeUp) {
      stopTimer();
      if (!timerSec) return;
      var box = card.querySelector(".g-timer");
      var fill = box.querySelector(".g-timer__bar");
      var num = box.querySelector(".g-timer__num");
      timer.end = Date.now() + timerSec * 1000;

      // Let the full bar paint first, then shrink it smoothly to zero.
      fill.style.transition = "none";
      fill.style.width = "100%";
      void fill.offsetWidth;
      fill.style.transition = "width " + timerSec + "s linear";
      fill.style.width = "0%";

      timer.id = setInterval(function () {
        var left = Math.max(0, Math.ceil((timer.end - Date.now()) / 1000));
        num.textContent = left;
        box.classList.toggle("is-low", left <= 3);
        if (left <= 0) { stopTimer(); onTimeUp(); }
      }, 200);
    }

    function freezeTimer() {
      stopTimer();
      var fill = card.querySelector(".g-timer__bar");
      if (fill) {
        fill.style.width = getComputedStyle(fill).width;
        fill.style.transition = "none";
      }
    }

    function nextQuestion() {
      stopAll();
      if (state.round >= rounds) return finish();
      setProgress(state.round);
      var q = newQuestion();
      var firstTry = true;
      var locked = false;

      card.innerHTML =
        '<div class="g-prompt">' +
          '<h1 class="g-question">' + escapeHTML(q.prompt) + "</h1>" +
          (canSpeak ? '<button class="g-say" type="button" aria-label="' + escapeHTML(t("readAloud")) + '"' +
            (canSpeakLang(lang) ? "" : " hidden") + ">🔊</button>" : "") +
        "</div>" +
        (timerSec
          ? '<div class="g-timer" aria-hidden="true"><span class="g-timer__icon">⏱️</span>' +
              '<div class="g-timer__track"><div class="g-timer__bar"></div></div>' +
              '<span class="g-timer__num">' + timerSec + "</span></div>"
          : "") +
        '<div class="g-visual">' + (q.visual || "") + "</div>" +
        '<div class="g-choices' + (q.size === "big" ? " g-choices--big" : "") +
          (q.choices.length === 2 ? " g-choices--two" : "") + '"></div>' +
        '<p class="g-feedback" aria-live="polite">&nbsp;</p>';

      var say = card.querySelector(".g-say");
      if (say) say.addEventListener("click", function () { speak(q.say || q.prompt, lang); });

      var feedback = card.querySelector(".g-feedback");
      var choicesEl = card.querySelector(".g-choices");
      var buttons = [];

      function lockAll() {
        locked = true;
        buttons.forEach(function (b) { b.disabled = true; });
      }

      q.choices.forEach(function (choice) {
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "g-choice";
        btn.textContent = String(choice);
        btn.addEventListener("click", function () {
          if (locked || btn.disabled) return;
          if (choice === q.answer) {
            freezeTimer();
            lockAll();
            if (firstTry) { state.score++; scoreEl.textContent = state.score; }
            btn.classList.add("is-right");
            feedback.className = "g-feedback is-right";
            feedback.textContent = pick(t("praise")) + (q.explain ? " " + q.explain : "");
            card.classList.add("g-pop");
            state.round++;
            setProgress(state.round);
            later(function () { card.classList.remove("g-pop"); nextQuestion(); }, q.explain ? 1700 : 1100);
          } else {
            firstTry = false;
            btn.disabled = true;
            btn.classList.add("is-wrong");
            feedback.className = "g-feedback is-wrong";
            feedback.textContent = pick(t("retry"));
          }
        });
        buttons.push(btn);
        choicesEl.appendChild(btn);
      });

      startTimer(function () {
        if (locked) return;
        lockAll();
        buttons.forEach(function (b, i) { if (q.choices[i] === q.answer) b.classList.add("is-reveal"); });
        feedback.className = "g-feedback is-timeup";
        feedback.textContent = t("timeUp").replace("{a}", String(q.answer));
        state.round++;
        setProgress(state.round);
        later(nextQuestion, 2400);
      });
    }

    function finish() {
      stopAll();
      setProgress(rounds);
      var ratio = state.score / rounds;
      var stars = ratio >= 0.9 ? 3 : ratio >= 0.6 ? 2 : 1;
      var msg = t("end" + stars);

      card.innerHTML =
        '<div class="g-end">' +
          '<div class="g-stars" aria-label="' + escapeHTML(t("stars").replace("{n}", stars)) + '">' +
            [1, 2, 3].map(function (i) {
              return '<span class="g-star' + (i <= stars ? " is-on" : "") + '" style="animation-delay:' + (i * 0.15) + 's">★</span>';
            }).join("") +
          "</div>" +
          '<h1 class="g-end__title">' + escapeHTML(msg) + "</h1>" +
          '<p class="g-end__score">' + t("endScore").replace("{n}", state.score).replace("{r}", rounds) + "</p>" +
          '<div class="g-end__actions">' +
            '<button class="g-btn g-btn--primary" type="button" id="g-again">' + escapeHTML(t("again")) + "</button>" +
            '<a class="g-btn" href="' + home + '">' + escapeHTML(t("more")) + "</a>" +
          "</div>" +
        "</div>";

      document.getElementById("g-again").addEventListener("click", reset);
    }

    // Voices load a moment after the page; show 🔊 once a voice for the language appears.
    if (canSpeak && "onvoiceschanged" in window.speechSynthesis) {
      window.speechSynthesis.addEventListener("voiceschanged", function () {
        var say = card && card.querySelector(".g-say");
        if (say) say.hidden = !canSpeakLang(lang);
      });
    }

    build();
  }

  function escapeHTML(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  window.GameKit = {
    start: start,
    tr: function (value) { return S.tr(value); },
    plural: function (n, forms) { return S.plural(n, forms); },
    get lang() { return S.get("lang"); },
    randInt: randInt,
    pick: pick,
    shuffle: shuffle,
    sample: sample,
    numberChoices: numberChoices,
    withDistractors: withDistractors
  };
})();
