/**
 * Shared country list for the Geography games (Flag Detective, Capital Cities…).
 *
 * Each row: [flag, level, region, [en, hy, ru], [capital en, hy, ru] | null, the?]
 *   level   1 = Easy (famous countries), 2 = Medium, 3 = Hard
 *   region  "europe" | "asia" | "africa" | "americas" | "oceania"
 *           (Hard level uses look-alike answers from the same region)
 *   capital null when the capital has the same name as the country or is debated —
 *           those countries are left out of Capital Cities only.
 *   the     true when English needs "the" (the United Kingdom, the Netherlands…)
 *
 * Use: CountryKit.forLevel("easy") → [{ flag, level, region, name:{en,hy,ru,the}, capital }]
 */
(function () {
  "use strict";

  var ROWS = [
    /* ---------------- Level 1 · Easy ---------------- */
    ["🇦🇲", 1, "asia", ["Armenia", "Հայաստան", "Армения"], ["Yerevan", "Երևան", "Ереван"]],
    ["🇷🇺", 1, "europe", ["Russia", "Ռուսաստան", "Россия"], ["Moscow", "Մոսկվա", "Москва"]],
    ["🇬🇪", 1, "asia", ["Georgia", "Վրաստան", "Грузия"], ["Tbilisi", "Թբիլիսի", "Тбилиси"]],
    ["🇫🇷", 1, "europe", ["France", "Ֆրանսիա", "Франция"], ["Paris", "Փարիզ", "Париж"]],
    ["🇮🇹", 1, "europe", ["Italy", "Իտալիա", "Италия"], ["Rome", "Հռոմ", "Рим"]],
    ["🇪🇸", 1, "europe", ["Spain", "Իսպանիա", "Испания"], ["Madrid", "Մադրիդ", "Мадрид"]],
    ["🇩🇪", 1, "europe", ["Germany", "Գերմանիա", "Германия"], ["Berlin", "Բեռլին", "Берлин"]],
    ["🇬🇧", 1, "europe", ["United Kingdom", "Մեծ Բրիտանիա", "Великобритания"], ["London", "Լոնդոն", "Лондон"], true],
    ["🇺🇸", 1, "americas", ["United States", "ԱՄՆ", "США"], ["Washington, D.C.", "Վաշինգտոն", "Вашингтон"], true],
    ["🇨🇦", 1, "americas", ["Canada", "Կանադա", "Канада"], ["Ottawa", "Օտտավա", "Оттава"]],
    ["🇧🇷", 1, "americas", ["Brazil", "Բրազիլիա", "Бразилия"], ["Brasília", "Բրազիլիա", "Бразилиа"]],
    ["🇦🇷", 1, "americas", ["Argentina", "Արգենտինա", "Аргентина"], ["Buenos Aires", "Բուենոս Այրես", "Буэнос-Айрес"]],
    ["🇲🇽", 1, "americas", ["Mexico", "Մեքսիկա", "Мексика"], ["Mexico City", "Մեխիկո", "Мехико"]],
    ["🇯🇵", 1, "asia", ["Japan", "Ճապոնիա", "Япония"], ["Tokyo", "Տոկիո", "Токио"]],
    ["🇨🇳", 1, "asia", ["China", "Չինաստան", "Китай"], ["Beijing", "Պեկին", "Пекин"]],
    ["🇮🇳", 1, "asia", ["India", "Հնդկաստան", "Индия"], ["New Delhi", "Նյու Դելի", "Нью-Дели"]],
    ["🇰🇷", 1, "asia", ["South Korea", "Հարավային Կորեա", "Южная Корея"], ["Seoul", "Սեուլ", "Сеул"]],
    ["🇦🇺", 1, "oceania", ["Australia", "Ավստրալիա", "Австралия"], ["Canberra", "Կանբերա", "Канберра"]],
    ["🇪🇬", 1, "africa", ["Egypt", "Եգիպտոս", "Египет"], ["Cairo", "Կահիրե", "Каир"]],
    ["🇬🇷", 1, "europe", ["Greece", "Հունաստան", "Греция"], ["Athens", "Աթենք", "Афины"]],
    ["🇹🇷", 1, "asia", ["Turkey", "Թուրքիա", "Турция"], ["Ankara", "Անկարա", "Анкара"]],
    ["🇺🇦", 1, "europe", ["Ukraine", "Ուկրաինա", "Украина"], ["Kyiv", "Կիև", "Киев"]],
    ["🇨🇭", 1, "europe", ["Switzerland", "Շվեյցարիա", "Швейцария"], ["Bern", "Բեռն", "Берн"]],
    ["🇳🇱", 1, "europe", ["Netherlands", "Նիդեռլանդներ", "Нидерланды"], ["Amsterdam", "Ամստերդամ", "Амстердам"], true],
    ["🇵🇹", 1, "europe", ["Portugal", "Պորտուգալիա", "Португалия"], ["Lisbon", "Լիսաբոն", "Лиссабон"]],
    ["🇸🇪", 1, "europe", ["Sweden", "Շվեդիա", "Швеция"], ["Stockholm", "Ստոկհոլմ", "Стокгольм"]],
    ["🇳🇴", 1, "europe", ["Norway", "Նորվեգիա", "Норвегия"], ["Oslo", "Օսլո", "Осло"]],
    ["🇫🇮", 1, "europe", ["Finland", "Ֆինլանդիա", "Финляндия"], ["Helsinki", "Հելսինկի", "Хельсинки"]],
    ["🇮🇷", 1, "asia", ["Iran", "Իրան", "Иран"], ["Tehran", "Թեհրան", "Тегеран"]],
    ["🇿🇦", 1, "africa", ["South Africa", "Հարավային Աֆրիկա", "Южная Африка"], ["Pretoria", "Պրետորիա", "Претория"]],

    /* ---------------- Level 2 · Medium ---------------- */
    ["🇧🇾", 2, "europe", ["Belarus", "Բելառուս", "Беларусь"], ["Minsk", "Մինսկ", "Минск"]],
    ["🇰🇿", 2, "asia", ["Kazakhstan", "Ղազախստան", "Казахстан"], ["Astana", "Աստանա", "Астана"]],
    ["🇺🇿", 2, "asia", ["Uzbekistan", "Ուզբեկստան", "Узбекистан"], ["Tashkent", "Տաշքենդ", "Ташкент"]],
    ["🇦🇿", 2, "asia", ["Azerbaijan", "Ադրբեջան", "Азербайджан"], ["Baku", "Բաքու", "Баку"]],
    ["🇵🇱", 2, "europe", ["Poland", "Լեհաստան", "Польша"], ["Warsaw", "Վարշավա", "Варшава"]],
    ["🇨🇿", 2, "europe", ["Czechia", "Չեխիա", "Чехия"], ["Prague", "Պրահա", "Прага"]],
    ["🇦🇹", 2, "europe", ["Austria", "Ավստրիա", "Австрия"], ["Vienna", "Վիեննա", "Вена"]],
    ["🇧🇪", 2, "europe", ["Belgium", "Բելգիա", "Бельгия"], ["Brussels", "Բրյուսել", "Брюссель"]],
    ["🇩🇰", 2, "europe", ["Denmark", "Դանիա", "Дания"], ["Copenhagen", "Կոպենհագեն", "Копенгаген"]],
    ["🇮🇪", 2, "europe", ["Ireland", "Իռլանդիա", "Ирландия"], ["Dublin", "Դուբլին", "Дублин"]],
    ["🇭🇺", 2, "europe", ["Hungary", "Հունգարիա", "Венгрия"], ["Budapest", "Բուդապեշտ", "Будапешт"]],
    ["🇷🇴", 2, "europe", ["Romania", "Ռումինիա", "Румыния"], ["Bucharest", "Բուխարեստ", "Бухарест"]],
    ["🇧🇬", 2, "europe", ["Bulgaria", "Բուլղարիա", "Болгария"], ["Sofia", "Սոֆիա", "София"]],
    ["🇷🇸", 2, "europe", ["Serbia", "Սերբիա", "Сербия"], ["Belgrade", "Բելգրադ", "Белград"]],
    ["🇭🇷", 2, "europe", ["Croatia", "Խորվաթիա", "Хорватия"], ["Zagreb", "Զագրեբ", "Загреб"]],
    ["🇮🇸", 2, "europe", ["Iceland", "Իսլանդիա", "Исландия"], ["Reykjavík", "Ռեյկյավիկ", "Рейкьявик"]],
    ["🇱🇹", 2, "europe", ["Lithuania", "Լիտվա", "Литва"], ["Vilnius", "Վիլնյուս", "Вильнюс"]],
    ["🇱🇻", 2, "europe", ["Latvia", "Լատվիա", "Латвия"], ["Riga", "Ռիգա", "Рига"]],
    ["🇪🇪", 2, "europe", ["Estonia", "Էստոնիա", "Эстония"], ["Tallinn", "Տալլին", "Таллин"]],
    ["🇲🇩", 2, "europe", ["Moldova", "Մոլդովա", "Молдова"], ["Chișinău", "Քիշնև", "Кишинёв"]],
    ["🇱🇧", 2, "asia", ["Lebanon", "Լիբանան", "Ливан"], ["Beirut", "Բեյրութ", "Бейрут"]],
    ["🇸🇾", 2, "asia", ["Syria", "Սիրիա", "Сирия"], ["Damascus", "Դամասկոս", "Дамаск"]],
    ["🇮🇱", 2, "asia", ["Israel", "Իսրայել", "Израиль"], null],
    ["🇸🇦", 2, "asia", ["Saudi Arabia", "Սաուդյան Արաբիա", "Саудовская Аравия"], ["Riyadh", "Էր Ռիադ", "Эр-Рияд"]],
    ["🇦🇪", 2, "asia", ["United Arab Emirates", "ԱՄԷ", "ОАЭ"], ["Abu Dhabi", "Աբու Դաբի", "Абу-Даби"], true],
    ["🇮🇶", 2, "asia", ["Iraq", "Իրաք", "Ирак"], ["Baghdad", "Բաղդադ", "Багдад"]],
    ["🇹🇭", 2, "asia", ["Thailand", "Թաիլանդ", "Таиланд"], ["Bangkok", "Բանգկոկ", "Бангкок"]],
    ["🇻🇳", 2, "asia", ["Vietnam", "Վիետնամ", "Вьетнам"], ["Hanoi", "Հանոյ", "Ханой"]],
    ["🇮🇩", 2, "asia", ["Indonesia", "Ինդոնեզիա", "Индонезия"], ["Jakarta", "Ջակարտա", "Джакарта"]],
    ["🇵🇭", 2, "asia", ["Philippines", "Ֆիլիպիններ", "Филиппины"], ["Manila", "Մանիլա", "Манила"], true],
    ["🇵🇰", 2, "asia", ["Pakistan", "Պակիստան", "Пакистан"], ["Islamabad", "Իսլամաբադ", "Исламабад"]],
    ["🇲🇳", 2, "asia", ["Mongolia", "Մոնղոլիա", "Монголия"], ["Ulaanbaatar", "Ուլան Բատոր", "Улан-Батор"]],
    ["🇳🇿", 2, "oceania", ["New Zealand", "Նոր Զելանդիա", "Новая Зеландия"], ["Wellington", "Վելինգտոն", "Веллингтон"]],
    ["🇨🇱", 2, "americas", ["Chile", "Չիլի", "Чили"], ["Santiago", "Սանտյագո", "Сантьяго"]],
    ["🇵🇪", 2, "americas", ["Peru", "Պերու", "Перу"], ["Lima", "Լիմա", "Лима"]],
    ["🇨🇴", 2, "americas", ["Colombia", "Կոլումբիա", "Колумбия"], ["Bogotá", "Բոգոտա", "Богота"]],
    ["🇨🇺", 2, "americas", ["Cuba", "Կուբա", "Куба"], ["Havana", "Հավանա", "Гавана"]],
    ["🇲🇦", 2, "africa", ["Morocco", "Մարոկո", "Марокко"], ["Rabat", "Ռաբաթ", "Рабат"]],
    ["🇳🇬", 2, "africa", ["Nigeria", "Նիգերիա", "Нигерия"], ["Abuja", "Աբուջա", "Абуджа"]],
    ["🇰🇪", 2, "africa", ["Kenya", "Քենիա", "Кения"], ["Nairobi", "Նայրոբի", "Найроби"]],
    ["🇪🇹", 2, "africa", ["Ethiopia", "Եթովպիա", "Эфиопия"], ["Addis Ababa", "Ադիս Աբեբա", "Аддис-Абеба"]],

    /* ---------------- Level 3 · Hard ---------------- */
    ["🇰🇬", 3, "asia", ["Kyrgyzstan", "Ղրղզստան", "Киргизия"], ["Bishkek", "Բիշքեկ", "Бишкек"]],
    ["🇹🇯", 3, "asia", ["Tajikistan", "Տաջիկստան", "Таджикистан"], ["Dushanbe", "Դուշանբե", "Душанбе"]],
    ["🇹🇲", 3, "asia", ["Turkmenistan", "Թուրքմենստան", "Туркменистан"], ["Ashgabat", "Աշխաբադ", "Ашхабад"]],
    ["🇦🇫", 3, "asia", ["Afghanistan", "Աֆղանստան", "Афганистан"], ["Kabul", "Քաբուլ", "Кабул"]],
    ["🇳🇵", 3, "asia", ["Nepal", "Նեպալ", "Непал"], ["Kathmandu", "Կատմանդու", "Катманду"]],
    ["🇧🇹", 3, "asia", ["Bhutan", "Բութան", "Бутан"], ["Thimphu", "Թիմփու", "Тхимпху"]],
    ["🇧🇩", 3, "asia", ["Bangladesh", "Բանգլադեշ", "Бангладеш"], ["Dhaka", "Դաքքա", "Дакка"]],
    ["🇱🇰", 3, "asia", ["Sri Lanka", "Շրի Լանկա", "Шри-Ланка"], null],
    ["🇲🇾", 3, "asia", ["Malaysia", "Մալայզիա", "Малайзия"], ["Kuala Lumpur", "Կուալա Լումպուր", "Куала-Лумпур"]],
    ["🇸🇬", 3, "asia", ["Singapore", "Սինգապուր", "Сингапур"], null],
    ["🇰🇭", 3, "asia", ["Cambodia", "Կամբոջա", "Камбоджа"], ["Phnom Penh", "Պնոմպեն", "Пномпень"]],
    ["🇱🇦", 3, "asia", ["Laos", "Լաոս", "Лаос"], ["Vientiane", "Վիենտյան", "Вьентьян"]],
    ["🇲🇲", 3, "asia", ["Myanmar", "Մյանմա", "Мьянма"], ["Naypyidaw", "Նայպյիդո", "Нейпьидо"]],
    ["🇶🇦", 3, "asia", ["Qatar", "Կատար", "Катар"], ["Doha", "Դոհա", "Доха"]],
    ["🇰🇼", 3, "asia", ["Kuwait", "Քուվեյթ", "Кувейт"], null],
    ["🇯🇴", 3, "asia", ["Jordan", "Հորդանան", "Иордания"], ["Amman", "Ամման", "Амман"]],
    ["🇴🇲", 3, "asia", ["Oman", "Օման", "Оман"], ["Muscat", "Մասկատ", "Маскат"]],
    ["🇨🇾", 3, "europe", ["Cyprus", "Կիպրոս", "Кипр"], ["Nicosia", "Նիկոսիա", "Никосия"]],
    ["🇲🇹", 3, "europe", ["Malta", "Մալթա", "Мальта"], ["Valletta", "Վալետա", "Валлетта"]],
    ["🇱🇺", 3, "europe", ["Luxembourg", "Լյուքսեմբուրգ", "Люксембург"], null],
    ["🇸🇰", 3, "europe", ["Slovakia", "Սլովակիա", "Словакия"], ["Bratislava", "Բրատիսլավա", "Братислава"]],
    ["🇸🇮", 3, "europe", ["Slovenia", "Սլովենիա", "Словения"], ["Ljubljana", "Լյուբլյանա", "Любляна"]],
    ["🇦🇱", 3, "europe", ["Albania", "Ալբանիա", "Албания"], ["Tirana", "Տիրանա", "Тирана"]],
    ["🇲🇰", 3, "europe", ["North Macedonia", "Հյուսիսային Մակեդոնիա", "Северная Македония"], ["Skopje", "Սկոպյե", "Скопье"]],
    ["🇧🇦", 3, "europe", ["Bosnia and Herzegovina", "Բոսնիա և Հերցեգովինա", "Босния и Герцеговина"], ["Sarajevo", "Սարաևո", "Сараево"]],
    ["🇲🇪", 3, "europe", ["Montenegro", "Չեռնոգորիա", "Черногория"], ["Podgorica", "Պոդգորիցա", "Подгорица"]],
    ["🇻🇪", 3, "americas", ["Venezuela", "Վենեսուելա", "Венесуэла"], ["Caracas", "Կարակաս", "Каракас"]],
    ["🇪🇨", 3, "americas", ["Ecuador", "Էկվադոր", "Эквадор"], ["Quito", "Կիտո", "Кито"]],
    ["🇧🇴", 3, "americas", ["Bolivia", "Բոլիվիա", "Боливия"], null],
    ["🇺🇾", 3, "americas", ["Uruguay", "Ուրուգվայ", "Уругвай"], ["Montevideo", "Մոնտեվիդեո", "Монтевидео"]],
    ["🇵🇾", 3, "americas", ["Paraguay", "Պարագվայ", "Парагвай"], ["Asunción", "Ասունսյոն", "Асунсьон"]],
    ["🇯🇲", 3, "americas", ["Jamaica", "Ճամայկա", "Ямайка"], ["Kingston", "Քինգսթոն", "Кингстон"]],
    ["🇵🇦", 3, "americas", ["Panama", "Պանամա", "Панама"], null],
    ["🇨🇷", 3, "americas", ["Costa Rica", "Կոստա Ռիկա", "Коста-Рика"], ["San José", "Սան Խոսե", "Сан-Хосе"]],
    ["🇩🇿", 3, "africa", ["Algeria", "Ալժիր", "Алжир"], null],
    ["🇹🇳", 3, "africa", ["Tunisia", "Թունիս", "Тунис"], null],
    ["🇱🇾", 3, "africa", ["Libya", "Լիբիա", "Ливия"], ["Tripoli", "Տրիպոլի", "Триполи"]],
    ["🇸🇩", 3, "africa", ["Sudan", "Սուդան", "Судан"], ["Khartoum", "Խարտում", "Хартум"]],
    ["🇬🇭", 3, "africa", ["Ghana", "Գանա", "Гана"], ["Accra", "Աքրա", "Аккра"]],
    ["🇸🇳", 3, "africa", ["Senegal", "Սենեգալ", "Сенегал"], ["Dakar", "Դաքար", "Дакар"]],
    ["🇨🇲", 3, "africa", ["Cameroon", "Կամերուն", "Камерун"], ["Yaoundé", "Յաունդե", "Яунде"]],
    ["🇹🇿", 3, "africa", ["Tanzania", "Տանզանիա", "Танзания"], ["Dodoma", "Դոդոմա", "Додома"]],
    ["🇺🇬", 3, "africa", ["Uganda", "Ուգանդա", "Уганда"], ["Kampala", "Կամպալա", "Кампала"]],
    ["🇦🇴", 3, "africa", ["Angola", "Անգոլա", "Ангола"], ["Luanda", "Լուանդա", "Луанда"]],
    ["🇿🇼", 3, "africa", ["Zimbabwe", "Զիմբաբվե", "Зимбабве"], ["Harare", "Հարարե", "Хараре"]],
    ["🇲🇬", 3, "africa", ["Madagascar", "Մադագասկար", "Мадагаскар"], ["Antananarivo", "Անտանանարիվու", "Антананариву"]],
    ["🇫🇯", 3, "oceania", ["Fiji", "Ֆիջի", "Фиджи"], ["Suva", "Սուվա", "Сува"]]
  ];

  var LEVEL_NUM = { easy: 1, medium: 2, hard: 3 };

  function trio(a) { return a ? { en: a[0], hy: a[1], ru: a[2] } : null; }

  var ALL = ROWS.map(function (r) {
    var name = trio(r[3]);
    if (r[5]) name.the = true;
    return { flag: r[0], level: r[1], region: r[2], name: name, capital: trio(r[4]) };
  });

  window.CountryKit = {
    all: ALL,
    /** Countries asked about on this level ("easy" | "medium" | "hard"). */
    forLevel: function (level) {
      var n = LEVEL_NUM[level] || 1;
      return ALL.filter(function (c) { return c.level === n; });
    },
    /** Countries that may appear as wrong answers: this level and the easier ones. */
    upToLevel: function (level) {
      var n = LEVEL_NUM[level] || 1;
      return ALL.filter(function (c) { return c.level <= n; });
    },
    /**
     * Wrong answers for `target`. On Hard they come from the same region when
     * possible (look-alike flags and nearby cities), otherwise at random.
     */
    distractors: function (target, pool, count, level, valueOf) {
      var others = pool.filter(function (c) { return c !== target && valueOf(c) != null && valueOf(c) !== valueOf(target); });
      var shuffled = window.GameKit.shuffle(others);
      if (level === "hard") {
        var near = shuffled.filter(function (c) { return c.region === target.region; });
        var far = shuffled.filter(function (c) { return c.region !== target.region; });
        shuffled = near.concat(far);
      }
      return shuffled.slice(0, count);
    },
    /** Answer buttons per level: Easy has 3, Medium and Hard have 4. */
    choiceCount: function (level) { return level === "easy" ? 3 : 4; }
  };
})();
