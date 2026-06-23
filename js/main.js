/* =============================================================================
   Pläster Gebäudereinigung — Interactions
   Lightweight vanilla JS. All motion respects prefers-reduced-motion.
   ========================================================================== */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* --- Footer year --------------------------------------------------------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* --- Header shadow on scroll -------------------------------------------- */
  var header = document.getElementById("header");
  var progress = document.getElementById("progress");

  function onScroll() {
    var y = window.scrollY || document.documentElement.scrollTop;
    if (header) header.classList.toggle("is-scrolled", y > 8);

    if (progress) {
      var docH = document.documentElement.scrollHeight - window.innerHeight;
      var pct = docH > 0 ? (y / docH) * 100 : 0;
      progress.style.width = pct + "%";
    }

    // subtle hero parallax (transform only)
    if (!reduceMotion) {
      var media = document.querySelector("[data-parallax]");
      if (media && y < window.innerHeight) {
        media.style.transform = "translateY(" + y * 0.18 + "px)";
      }
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* --- Mobile menu toggle -------------------------------------------------- */
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
    // Close after navigating
    menu.addEventListener("click", function (e) {
      if (e.target.closest("a")) closeMenu();
    });
    // Close on Escape
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });
  }

  /* --- Scroll reveal (IntersectionObserver) ------------------------------- */
  var revealEls = document.querySelectorAll(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    var io = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* --- Counter animation (count up on scroll into view) ------------------- */
  var counters = document.querySelectorAll("[data-count]");

  function animateCount(el) {
    var target = parseInt(el.getAttribute("data-count"), 10) || 0;
    if (reduceMotion) { el.textContent = target.toLocaleString("de-DE"); return; }
    var duration = 1600;
    var start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      // easeOutCubic
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased).toLocaleString("de-DE");
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  if (counters.length) {
    if (reduceMotion || !("IntersectionObserver" in window)) {
      counters.forEach(animateCount);
    } else {
      var cio = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.6 });
      counters.forEach(function (el) { cio.observe(el); });
    }
  }

  /* --- Contact form: validation + simulated submit ------------------------ */
  var form = document.getElementById("contactForm");
  var status = document.getElementById("formStatus");

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      // Trigger native validation UI (works with :user-invalid styling)
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

      // Simulated async submit — replace with real endpoint (fetch) in production
      setTimeout(function () {
        btn.disabled = false;
        btn.innerHTML = label;
        form.reset();
        if (status) {
          status.classList.add("is-visible");
          status.focus && status.focus();
          setTimeout(function () { status.classList.remove("is-visible"); }, 6000);
        }
      }, 900);
    });
  }
})();
