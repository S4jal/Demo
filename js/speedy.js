/* =====================================================================
   Speedy Water Heaters — interactions
   ===================================================================== */
(function () {
  "use strict";

  /* ---------- sticky header shadow ---------- */
  var header = document.getElementById("header");
  var onScroll = function () {
    header.classList.toggle("is-stuck", window.scrollY > 8);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- mobile nav ---------- */
  var burger = document.getElementById("hamburger");
  var nav = document.getElementById("nav");
  if (burger && nav) {
    burger.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      burger.setAttribute("aria-expanded", String(open));
    });
    nav.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        nav.classList.remove("is-open");
        burger.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------- multi-step lead form ---------- */
  var form = document.getElementById("quoteForm");
  if (!form) return;

  var steps = Array.prototype.slice.call(form.querySelectorAll(".qstep"));
  var dots = Array.prototype.slice.call(document.querySelectorAll(".qcard__progress span"));
  var current = 0;

  function numbered() {
    return steps.filter(function (s) { return s.dataset.step !== "done"; });
  }
  function show(i) {
    var list = numbered();
    list.forEach(function (s, idx) { s.classList.toggle("is-active", idx === i); });
    dots.forEach(function (d, idx) { d.classList.toggle("on", idx <= i); });
    current = i;
  }
  function validate(stepEl) {
    var fields = stepEl.querySelectorAll("input, select");
    for (var i = 0; i < fields.length; i++) {
      if (!fields[i].checkValidity()) { fields[i].reportValidity(); return false; }
    }
    return true;
  }

  form.addEventListener("click", function (e) {
    var next = e.target.closest("[data-next]");
    var prev = e.target.closest("[data-prev]");
    var list = numbered();
    if (next) {
      if (!validate(list[current])) return;
      if (current < list.length - 1) show(current + 1);
    }
    if (prev && current > 0) show(current - 1);
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var list = numbered();
    if (!validate(list[current])) return;

    // --- POST the lead to your CRM / Zapier / email here ---
    var data = Object.fromEntries(new FormData(form).entries());
    console.log("Lead captured:", data);

    steps.forEach(function (s) { s.classList.remove("is-active"); });
    form.querySelector('[data-step="done"]').classList.add("is-active");
    dots.forEach(function (d) { d.classList.add("on"); });
  });

  show(0);
})();
