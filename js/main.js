/* =============================================================================
   Pläster Gebäudereinigung — Interactions (Motion / Framer Motion engine)
   Uses the Motion vanilla API (window.Motion: animate, inView, stagger, hover)
   for scroll-triggered fades, staggered reveals and hover transitions.
   All motion respects prefers-reduced-motion.
   ========================================================================== */
(function () {
  "use strict";

  var M = window.Motion || {};
  var hasMotion = M && typeof M.inView === "function" && typeof M.animate === "function";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var EASE = [0.22, 1, 0.36, 1];

  /* --- Footer year --- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* --- Header shadow + reading progress --- */
  var header = document.getElementById("header");
  var progress = document.getElementById("progress");
  function onScroll() {
    var y = window.scrollY || document.documentElement.scrollTop;
    if (header) header.classList.toggle("is-scrolled", y > 8);
    if (progress) {
      var docH = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (docH > 0 ? (y / docH) * 100 : 0) + "%";
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* --- Mobile menu --- */
  var toggle = document.getElementById("navToggle");
  var menu = document.getElementById("navMenu");
  function closeMenu() {
    if (!menu) return;
    menu.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Menü öffnen");
  }
  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var open = menu.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Menü schließen" : "Menü öffnen");
    });
    menu.addEventListener("click", function (e) { if (e.target.closest("a")) closeMenu(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeMenu(); });
  }

  /* --- Scroll reveals, stagger & hover via Motion --- */
  if (reduce || !hasMotion) {
    // No-JS / reduced-motion safety: make everything visible
    document.querySelectorAll(".reveal").forEach(function (el) { el.style.opacity = 1; });
    document.querySelectorAll(".reveal[data-stagger] > *").forEach(function (el) { el.style.opacity = 1; });
  } else {
    // Scroll-triggered fades (single elements)
    M.inView(".reveal:not([data-stagger])", function (el) {
      M.animate(el, { opacity: [0, 1], y: [28, 0] }, { duration: 0.6, ease: EASE });
    }, { amount: 0.15 });

    // Staggered reveals (grids / lists)
    M.inView(".reveal[data-stagger]", function (container) {
      container.style.opacity = 1;
      var kids = Array.prototype.slice.call(container.children);
      M.animate(kids, { opacity: [0, 1], y: [22, 0] },
        { delay: M.stagger(0.07), duration: 0.5, ease: EASE });
    }, { amount: 0.2 });

    // Smooth hover lift on interactive cards
    if (typeof M.hover === "function") {
      M.hover(".service-card, .project-card, .testimonial", function (el) {
        M.animate(el, { y: -6 }, { duration: 0.25, ease: EASE });
        return function () { M.animate(el, { y: 0 }, { duration: 0.25, ease: EASE }); };
      });
    }
  }

  /* --- Counters (count up when scrolled into view) --- */
  var counters = document.querySelectorAll("[data-count]");
  function runCount(el) {
    var target = parseInt(el.getAttribute("data-count"), 10) || 0;
    if (reduce) { el.textContent = target.toLocaleString("de-DE"); return; }
    var duration = 1600, start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased).toLocaleString("de-DE");
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if (counters.length) {
    if (reduce || !hasMotion) {
      counters.forEach(runCount);
    } else {
      M.inView(counters, function (el) { runCount(el); }, { amount: 0.6 });
    }
  }

  /* --- Contact form: validation + simulated submit --- */
  var form = document.getElementById("contactForm");
  var status = document.getElementById("formStatus");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        var firstInvalid = form.querySelector(":invalid");
        if (firstInvalid) firstInvalid.focus();
        return;
      }
      var btn = form.querySelector('button[type="submit"]');
      var label = btn.innerHTML;
      btn.disabled = true;
      btn.textContent = "Wird gesendet …";
      setTimeout(function () {
        btn.disabled = false;
        btn.innerHTML = label;
        form.reset();
        if (status) {
          status.classList.add("is-visible");
          setTimeout(function () { status.classList.remove("is-visible"); }, 6000);
        }
      }, 900);
    });
  }
})();
