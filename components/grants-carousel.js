/**
 * Grants carousel component.
 */

"use strict";

(function () {
  function renderGrantsCarousel() {
    var section = window.FCC_CONTENT.grantsSection || {};
    var escapeHtml = window.FundingConnectComponents.escapeHtml;

    window.FundingConnectComponents.setHtml(
      "grants-carousel-placeholder",
      [
        '<section class="grants-section" aria-labelledby="grants-heading">',
        '  <div class="grants-header">',
        '    <h2 id="grants-heading">' + escapeHtml(section.heading || 'Recent Grant Opportunities') + '</h2>',
        '    <span aria-label="' + escapeHtml(section.statusAriaLabel || 'This section is updated regularly') + '">' + escapeHtml(section.status || 'Updated regularly') + '</span>',
        "  </div>",
        '  <div class="grants-track-wrap" aria-label="' + escapeHtml(section.trackAriaLabel || 'Scrolling grant opportunities — hover or focus to pause') + '">',
        '    <div class="grants-track" id="grantCards" role="list" aria-live="polite">',
        "    </div>",
        "  </div>",
        '  <p class="grants-disclaimer">Grant information is sourced from GrantConnect. Please refer to the official grant page for full eligibility and application details.</p>',
        "</section>",
      ].join("\n"),
    );
  }

  document.addEventListener("DOMContentLoaded", renderGrantsCarousel);
})();
