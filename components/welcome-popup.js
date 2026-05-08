/**
 * welcome-popup.js
 *
 * Injects and controls the Acknowledgement of Country / First Nations
 * welcome popup. Shows once per session (stored in sessionStorage so it
 * reappears on a fresh tab but not on every page navigation within the SPA).
 *
 * Usage: just include this script — it self-initialises on DOMContentLoaded.
 */

(function () {
  "use strict";

  var STORAGE_KEY = "fcc_welcome_seen";

  /* ── Build the popup HTML ── */
  function createPopup() {
    var overlay = document.createElement("div");
    overlay.className = "welcome-overlay";
    overlay.id = "welcome-overlay";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", "Welcome to Funding Connect Consulting");

    overlay.innerHTML = [
      '<div class="welcome-card" id="welcome-card">',

      '  <button class="welcome-close" id="welcome-close" aria-label="Close welcome message">&#x2715;</button>',

      "  <!-- First Nations owned badge -->",
      '  <div class="welcome-badge">',
      '    <span class="welcome-badge-dot"></span>',
      "    <span>First Nations Owned Business</span>",
      "  </div>",

      "  <!-- Logo -->",
      '  <div class="welcome-logo">',
      '    <svg width="38" height="32" viewBox="0 0 40 34" fill="none" aria-hidden="true">',
      '      <path d="M3 31 Q3 10 20 10 Q37 10 37 31" stroke="#4A7F7B" stroke-width="3.5" fill="none" stroke-linecap="round"/>',
      '      <path d="M9 31 Q9 17 20 17 Q31 17 31 31" stroke="#C6D8D3" stroke-width="2" fill="none" stroke-linecap="round"/>',
      '      <circle cx="15" cy="11" r="6" fill="#4A7F7B"/>',
      '      <circle cx="24" cy="9" r="5.5" fill="#D18B3D"/>',
      "    </svg>",
      '    <span class="welcome-logo-text">Funding Connect Consulting</span>',
      "  </div>",

      '  <div class="welcome-divider"></div>',

      "  <!-- Acknowledgement of Country -->",
      '  <p class="welcome-ack-heading">Acknowledgement of Country</p>',
      '  <p class="welcome-ack-text">',
      "    Funding Connect Consulting acknowledges the Traditional Custodians of Country",
      "    throughout Australia and recognises their continuing connection to Land, Water",
      "    and Community. We pay our respects to Elders past, present and emerging, and",
      "    extend that respect to all Aboriginal and Torres Strait Islander peoples.",
      "  </p>",

      '  <button class="welcome-btn" id="welcome-enter">',
      "    Enter Site",
      "  </button>",

      "</div>",
    ].join("\n");

    return overlay;
  }

  /* ── Close with fade-out animation ── */
  function closePopup() {
    var overlay = document.getElementById("welcome-overlay");
    if (!overlay) return;

    overlay.classList.add("closing");
    overlay.addEventListener(
      "animationend",
      function () {
        overlay.remove();
      },
      { once: true },
    );

    // Remember for this session
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch (e) {}
  }

  /* ── Initialise ── */
  function init() {
    // Don't show if already seen this session
    try {
      if (sessionStorage.getItem(STORAGE_KEY)) return;
    } catch (e) {}

    var popup = createPopup();
    document.body.appendChild(popup);

    // Close button
    document
      .getElementById("welcome-close")
      .addEventListener("click", closePopup);

    // Enter site button
    document
      .getElementById("welcome-enter")
      .addEventListener("click", closePopup);

    // Click on overlay backdrop (outside card) also closes
    popup.addEventListener("click", function (e) {
      if (e.target === popup) closePopup();
    });

    // Escape key
    document.addEventListener("keydown", function onKey(e) {
      if (e.key === "Escape") {
        closePopup();
        document.removeEventListener("keydown", onKey);
      }
    });

    // Trap focus inside popup for accessibility
    var focusable = popup.querySelectorAll("button");
    var first = focusable[0];
    var last = focusable[focusable.length - 1];

    popup.addEventListener("keydown", function (e) {
      if (e.key !== "Tab") return;
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });

    // Auto-focus the enter button
    setTimeout(function () {
      document.getElementById("welcome-enter").focus();
    }, 100);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
