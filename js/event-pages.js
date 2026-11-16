(function () {
  "use strict";

  var W = window.WEDDING;
  var T = window.I18N;
  var eventSlug = document.body.getAttribute("data-event");
  var eventDetails = {
    sangeet: { title: "ev3_title", date: "ev3_date", time: W && W.sangeetTime, photo: "photos/mehadi.jpg" },
    haldi: { title: "ev1_title", date: "ev1_date", time: W && W.haldiTime, photo: "photos/haldi.jpg" },
    wedding: { title: "ev2_title", date: "ev2_date", time: W && W.weddingTime }
  };
  var event = eventDetails[eventSlug];
  var language = "en";

  if (!W || !T) throw new Error("Wedding configuration and translations are required.");
  if (!event) throw new Error("Unsupported event page: " + eventSlug);
  if (!event.time) throw new Error("A time must be configured for the " + eventSlug + " event.");

  var $ = function (selector, root) { return (root || document).querySelector(selector); };
  var $$ = function (selector, root) { return Array.prototype.slice.call((root || document).querySelectorAll(selector)); };
  var photo = $("#eventPhoto");

  function translate(key) {
    return (T[language] && T[language][key]) || T.en[key] || key;
  }

  function applyLanguage(nextLanguage) {
    language = nextLanguage;
    document.documentElement.lang = language === "mr" ? "mr" : "en";
    document.body.setAttribute("data-lang", language);
    $$("[data-i18n]").forEach(function (element) {
      element.textContent = translate(element.getAttribute("data-i18n"));
    });
    $$(".event-language button").forEach(function (button) {
      button.setAttribute("aria-pressed", String(button.getAttribute("data-lang") === language));
    });
    if (photo) photo.alt = event.photo
      ? translate(event.title)
      : (language === "mr" ? W.bride.mr + " आणि " + W.groom.mr : W.bride.en + " and " + W.groom.en);
    document.title = W.bride[language] + " & " + W.groom[language] + " | " + translate(event.title);
  }

  $$("[data-lang]").forEach(function (button) {
    button.addEventListener("click", function () {
      applyLanguage(button.getAttribute("data-lang"));
      try { localStorage.setItem("wedding-lang", language); } catch (error) {}
    });
  });

  var date = $("#eventDate");
  var time = $("#eventTime");
  if (!date || !time || !photo) throw new Error("Event page is missing required content.");
  date.setAttribute("data-i18n", event.date);
  time.textContent = event.time;
  photo.src = event.photo || W.couplePhoto;

  $$(".js-maps").forEach(function (link) {
    link.href = W.mapsUrl;
  });
  $$(".event-links a").forEach(function (link) {
    if (link.getAttribute("data-event-link") === eventSlug) link.setAttribute("aria-current", "page");
  });

  var savedLanguage = "en";
  try {
    if (localStorage.getItem("wedding-lang") === "mr") savedLanguage = "mr";
  } catch (error) {}
  applyLanguage(savedLanguage);
})();
