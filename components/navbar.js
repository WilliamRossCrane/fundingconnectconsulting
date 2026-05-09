/**
 * components/navbar.js
 *
 * Renders the site header/navigation and handles:
 *   - Active link state updates (called by showPage in script.js)
 *   - Mobile hamburger toggle
 */

(function () {
  "use strict";

  /* ── Template ── */
  var NAVBAR_HTML = [
    '<header role="banner">',
    '  <nav aria-label="Main navigation">',

    '    <button class="logo" onclick="showPage(\'home\')" aria-label="Funding Connect Consulting — go to home">',
    '      <svg width="38" height="32" viewBox="0 0 40 34" fill="none" aria-hidden="true" focusable="false">',
    '        <path d="M3 31 Q3 10 20 10 Q37 10 37 31" stroke="#0E4D57" stroke-width="4" fill="none" stroke-linecap="round"/>',
    '        <path d="M9 31 Q9 17 20 17 Q31 17 31 31" stroke="#4A7F7B" stroke-width="2.5" fill="none" stroke-linecap="round"/>',
    '        <circle cx="15" cy="11" r="6" fill="#0E4D57"/>',
    '        <circle cx="24" cy="9" r="5.5" fill="#D18B3D"/>',
    "      </svg>",
    '      <span class="logo-text">',
    "        <b>Funding Connect</b>",
    "        <small>Consulting</small>",
    "      </span>",
    "    </button>",

    '    <button class="nav-toggle" id="nav-toggle" aria-label="Toggle navigation menu" aria-expanded="false" aria-controls="nav-links">',
    "      <span></span>",
    "      <span></span>",
    "      <span></span>",
    "    </button>",

    '    <ul class="nav-links" id="nav-links" role="list">',
    '      <li><a href="#" id="nav-home"     onclick="showPage(\'home\')"     class="active" aria-current="page">Home</a></li>',
    '      <li><a href="#" id="nav-about"    onclick="showPage(\'about\')"    >About</a></li>',
    '      <li><a href="#" id="nav-services" onclick="showPage(\'services\')" >Services</a></li>',
    '      <li><a href="#" id="nav-connect"  onclick="showPage(\'connect\')"  class="nav-btn">Connect</a></li>',
    "    </ul>",

    "  </nav>",
    "</header>",
  ].join("\n");

  /* ── Inject ── */
  function renderNavbar() {
    var placeholder = document.getElementById("navbar-placeholder");
    if (!placeholder) return;
    placeholder.outerHTML = NAVBAR_HTML;
  }

  /* ── Mobile toggle ── */
  function closeMobileNav() {
    var toggle = document.getElementById("nav-toggle");
    var navLinks = document.getElementById("nav-links");
    if (!toggle || !navLinks) return;
    toggle.classList.remove("open");
    navLinks.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  }

  function initMobileNav() {
    var toggle = document.getElementById("nav-toggle");
    var navLinks = document.getElementById("nav-links");
    if (!toggle || !navLinks) return;

    toggle.addEventListener("click", function () {
      var isOpen = navLinks.classList.contains("open");
      if (isOpen) {
        closeMobileNav();
      } else {
        toggle.classList.add("open");
        navLinks.classList.add("open");
        toggle.setAttribute("aria-expanded", "true");
      }
    });

    document.addEventListener("click", function (e) {
      if (!toggle.contains(e.target) && !navLinks.contains(e.target)) {
        closeMobileNav();
      }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMobileNav();
    });
  }

  /* ── Active link updater — called by showPage() in script.js ── */
  window.setActiveNavLink = function (pageId) {
    document.querySelectorAll(".nav-links a").forEach(function (link) {
      link.classList.remove("active");
      link.removeAttribute("aria-current");
    });
    var activeLink = document.getElementById("nav-" + pageId);
    if (activeLink) {
      activeLink.classList.add("active");
      activeLink.setAttribute("aria-current", "page");
    }
    closeMobileNav();
  };

  /* ── Init ── */
  function init() {
    renderNavbar();
    initMobileNav();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
