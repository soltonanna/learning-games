/**
 * Shared settings for the dashboard and every game:
 *   - language    "en" (default) | "hy" | "ru"
 *   - timer       thinking time per question in seconds, 0 = off (default)
 *   - age         dashboard age filter, "7+" by default
 *
 * Choices are remembered in the browser (localStorage), so the language and
 * timer picked on the dashboard are used by every game, and vice versa.
 * A game page can also be opened in a language directly with ?lang=hy | ru | en.
 */
(function () {
  "use strict";

  var LANGS = [
    { id: "en", label: "EN",  name: "English",  speech: "en-US" },
    { id: "hy", label: "ՀԱՅ", name: "Հայերեն",  speech: "hy-AM" },
    { id: "ru", label: "РУС", name: "Русский",  speech: "ru-RU" }
  ];

  var TIMERS = [0, 10, 20, 30];

  /** Dashboard age groups. A game shows in a group if its age range overlaps it. */
  var AGE_GROUPS = [
    { id: "all" },
    { id: "3-4", label: "3–4", min: 3, max: 4 },
    { id: "5-6", label: "5–6", min: 5, max: 6 },
    { id: "7+",  label: "7+",  min: 7, max: 99 }
  ];

  /** Games without an `ages` value are treated as this. */
  var DEFAULT_AGES = "7+";

  var DEFAULTS = { lang: "en", timer: 0, age: "7+" };

  var VALID = {
    lang: function (v) { return LANGS.some(function (l) { return l.id === v; }); },
    timer: function (v) { return TIMERS.indexOf(Number(v)) !== -1; },
    age: function (v) { return AGE_GROUPS.some(function (a) { return a.id === v; }); }
  };

  var memory = {};

  function read(key) {
    try { return window.localStorage.getItem("playlearn-" + key); } catch (e) { return memory[key] == null ? null : memory[key]; }
  }
  function write(key, value) {
    memory[key] = String(value);
    try { window.localStorage.setItem("playlearn-" + key, String(value)); } catch (e) { /* private mode etc. */ }
  }

  function get(key) {
    var v = read(key);
    if (key === "timer" && v != null) v = Number(v);
    return v != null && VALID[key](v) ? v : DEFAULTS[key];
  }

  function set(key, value) {
    if (key === "timer") value = Number(value);
    if (VALID[key] && VALID[key](value)) write(key, value);
  }

  // ?lang=xx in the URL wins and is remembered.
  try {
    var urlLang = new URLSearchParams(window.location.search).get("lang");
    if (urlLang && VALID.lang(urlLang)) write("lang", urlLang);
  } catch (e) { /* old browser */ }

  /** Pick the current language out of { en, hy, ru }. Plain strings pass through. */
  function tr(value, lang) {
    if (value == null || typeof value !== "object") return value;
    lang = lang || get("lang");
    return value[lang] != null ? value[lang] : value.en;
  }

  /**
   * Number + word with the right plural form.
   *   en: [one, many]   ru: [one, few, many]   hy: [word] (Armenian uses the singular after numbers)
   */
  function plural(n, forms, lang) {
    lang = lang || get("lang");
    var f = forms[lang] || forms.en;
    if (lang === "ru") {
      var m10 = n % 10, m100 = n % 100;
      if (m10 === 1 && m100 !== 11) return f[0];
      if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return f[1];
      return f[2];
    }
    if (lang === "hy") return f[0];
    return n === 1 ? f[0] : f[1];
  }

  /** "4–5" → {min:4,max:5}, "7+" → {min:7,max:99}, "6" → {min:6,max:6}. */
  function parseAges(text) {
    var s = String(text || DEFAULT_AGES).trim();
    var nums = s.match(/\d+/g) || ["7"];
    var min = Number(nums[0]);
    if (/\+$/.test(s)) return { min: min, max: 99 };
    return { min: min, max: nums[1] ? Number(nums[1]) : min };
  }

  function matchesAge(gameAges, groupId) {
    if (groupId === "all") return true;
    var group = AGE_GROUPS.filter(function (a) { return a.id === groupId; })[0];
    if (!group) return true;
    var r = parseAges(gameAges);
    return r.min <= group.max && r.max >= group.min;
  }

  window.PlaySettings = {
    LANGS: LANGS,
    TIMERS: TIMERS,
    AGE_GROUPS: AGE_GROUPS,
    DEFAULT_AGES: DEFAULT_AGES,
    get: get,
    set: set,
    tr: tr,
    plural: plural,
    parseAges: parseAges,
    matchesAge: matchesAge,
    lang: function () { return get("lang"); },
    langInfo: function (id) {
      id = id || get("lang");
      return LANGS.filter(function (l) { return l.id === id; })[0] || LANGS[0];
    }
  };
})();
