/* =====================================================================
   Summit Water Heaters — interactions
   ===================================================================== */
(function () {
  "use strict";

  /* ---------- sticky header shadow ---------- */
  var header = document.getElementById("header");
  var onScroll = function () {
    if (window.scrollY > 8) header.classList.add("is-stuck");
    else header.classList.remove("is-stuck");
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- mobile nav ---------- */
  var burger = document.getElementById("hamburger");
  var nav = document.getElementById("nav");
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

  /* ---------- multi-step lead form ---------- */
  var form = document.getElementById("leadForm");
  if (!form) return;

  var steps = Array.prototype.slice.call(form.querySelectorAll(".step"));
  var dots = Array.prototype.slice.call(document.querySelectorAll(".leadform__progress .dot"));
  var current = 0; // index into the numbered (non-done) steps

  function numberedSteps() {
    return steps.filter(function (s) { return s.dataset.step !== "done"; });
  }

  function show(index) {
    var list = numberedSteps();
    list.forEach(function (s, i) { s.classList.toggle("is-active", i === index); });
    dots.forEach(function (d, i) { d.classList.toggle("is-active", i <= index); });
    current = index;
  }

  // validate only the fields inside the currently visible step
  function validateStep(stepEl) {
    var fields = stepEl.querySelectorAll("input, select");
    for (var i = 0; i < fields.length; i++) {
      var f = fields[i];
      if (!f.checkValidity()) {
        f.reportValidity();
        return false;
      }
    }
    return true;
  }

  form.addEventListener("click", function (e) {
    var nextBtn = e.target.closest("[data-next]");
    var prevBtn = e.target.closest("[data-prev]");
    if (nextBtn) {
      var list = numberedSteps();
      if (!validateStep(list[current])) return;
      if (current < list.length - 1) show(current + 1);
    }
    if (prevBtn) {
      if (current > 0) show(current - 1);
    }
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var list = numberedSteps();
    if (!validateStep(list[current])) return;

    // --- where you'd POST the lead to your CRM / email / Zapier ---
    var data = Object.fromEntries(new FormData(form).entries());
    console.log("Lead captured:", data);
    // Example: fetch("/api/lead", {method:"POST", body: JSON.stringify(data)});

    // show success state
    list.forEach(function (s) { s.classList.remove("is-active"); });
    var done = form.querySelector('[data-step="done"]');
    done.classList.add("is-active");
    dots.forEach(function (d) { d.classList.add("is-active"); });
  });

  show(0);
})();
