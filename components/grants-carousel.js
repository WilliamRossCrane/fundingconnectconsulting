/**
 * Grants carousel component.
 */

"use strict";

(function () {
  function renderLoadingCard() {
    return [
      '<article class="grant-card grant-card-loading" role="listitem" aria-hidden="true">',
      '  <p class="grant-cat">Grant Updates</p>',
      '  <h3 class="grant-title">Loading recent grant opportunities</h3>',
      '  <p class="grant-amount">Please wait a moment</p>',
      '  <p class="grant-close">Checking the latest local grant data.</p>',
      "</article>",
    ].join("\n");
  }

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
        '  <div class="grants-track-wrap" id="grantsTrackWrap" aria-label="' + escapeHtml(section.trackAriaLabel || 'Scrolling grant opportunities — hover or focus to pause') + '">',
        '    <div class="grants-track" id="grantCards" role="list" aria-live="polite" aria-busy="true">',
        renderLoadingCard(),
        "    </div>",
        "  </div>",
        '  <p class="grants-disclaimer">Grant information is sourced from GrantConnect, Queensland Government and business.gov.au. Please refer to each official grant page for full eligibility and application details.</p>',
        "</section>",
      ].join("\n"),
    );
  }

  document.addEventListener("DOMContentLoaded", renderGrantsCarousel);
})();
