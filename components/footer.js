/**
 * components/footer.js
 *
 * Renders the site footer and keeps the copyright year current.
 */

(function () {
  "use strict";

  /* ── Template ── */
  var FOOTER_HTML = [
    '<footer role="contentinfo">',

    '  <div class="footer-top">',
    '    <div class="footer-brand">',
    '      <div class="footer-logo">',
    '        <svg width="34" height="29" viewBox="0 0 40 34" fill="none" aria-hidden="true" focusable="false">',
    '          <path d="M3 31 Q3 10 20 10 Q37 10 37 31" stroke="#4A7F7B" stroke-width="3.5" fill="none" stroke-linecap="round"/>',
    '          <path d="M9 31 Q9 17 20 17 Q31 17 31 31" stroke="#C6D8D3" stroke-width="2" fill="none" stroke-linecap="round"/>',
    '          <circle cx="15" cy="11" r="6" fill="#4A7F7B"/>',
    '          <circle cx="24" cy="9" r="5.5" fill="#D18B3D"/>',
    "        </svg>",
    "        <span>Funding Connect Consulting</span>",
    "      </div>",
    "      <p>Connecting Aboriginal and Torres Strait Islander organisations with funding opportunities and supporting program design across Australia.</p>",
    "    </div>",
    "  </div>",

    '  <div class="footer-bar">',
    '    <span>© <span id="footer-year"></span> Funding Connect Consulting. All rights reserved.</span>',
    "    <span>Brisbane, Queensland, Australia</span>",
    "  </div>",

    "</footer>",
  ].join("\n");

  /* ── Inject ── */
  function renderFooter() {
    var placeholder = document.getElementById("footer-placeholder");
    if (!placeholder) return;
    placeholder.outerHTML = FOOTER_HTML;
  }

  /* ── Year ── */
  function setFooterYear() {
    var el = document.getElementById("footer-year");
    if (el) el.textContent = new Date().getFullYear();
  }

  /* ── Init ── */
  function init() {
    renderFooter();
    setFooterYear();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
