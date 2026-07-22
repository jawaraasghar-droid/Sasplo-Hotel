(function () {
  var STORAGE_KEY = "hr_lang";
  var DEFAULT_LANG = "en";
  var SUPPORTED = ["en", "ur", "pa", "ps", "hi", "de", "fr", "zh", "ar"];

  function resolvePath(obj, path) {
    var parts = path.split(".");
    var current = obj;
    for (var i = 0; i < parts.length; i++) {
      if (current == null) return undefined;
      current = current[parts[i]];
    }
    return current;
  }

  function getDictionary(lang) {
    return (window.HR_I18N && window.HR_I18N[lang]) || null;
  }

  function detectInitialLang() {
    try {
      var stored = localStorage.getItem(STORAGE_KEY);
      if (stored && SUPPORTED.indexOf(stored) !== -1) return stored;
    } catch (e) {}

    var browserLangs = navigator.languages || [navigator.language || ""];
    for (var i = 0; i < browserLangs.length; i++) {
      var code = (browserLangs[i] || "").slice(0, 2).toLowerCase();
      if (SUPPORTED.indexOf(code) !== -1) return code;
    }
    return DEFAULT_LANG;
  }

  function applyTranslations(lang) {
    var dict = getDictionary(lang) || getDictionary(DEFAULT_LANG);
    var fallbackDict = getDictionary(DEFAULT_LANG);
    if (!dict) return;

    var meta = dict.meta || { dir: "ltr" };
    document.documentElement.setAttribute("lang", lang);
    document.documentElement.setAttribute("dir", meta.dir || "ltr");

    var nodes = document.querySelectorAll("[data-i18n]");
    nodes.forEach(function (node) {
      var key = node.getAttribute("data-i18n");
      var value = resolvePath(dict, key);
      if (value === undefined && fallbackDict) value = resolvePath(fallbackDict, key);
      if (typeof value === "string") node.innerHTML = value;
    });

    var select = document.getElementById("lang-select");
    if (select && select.value !== lang) select.value = lang;
  }

  function setLanguage(lang) {
    if (SUPPORTED.indexOf(lang) === -1) lang = DEFAULT_LANG;
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {}
    applyTranslations(lang);
  }

  document.addEventListener("DOMContentLoaded", function () {
    var initialLang = detectInitialLang();
    applyTranslations(initialLang);

    var select = document.getElementById("lang-select");
    if (select) {
      select.value = initialLang;
      select.addEventListener("change", function () {
        setLanguage(select.value);
      });
    }
  });

  window.HR_setLanguage = setLanguage;
})();
