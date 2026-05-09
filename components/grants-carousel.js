/**
 * Grants carousel component.
 */

"use strict";

(function () {
  function renderGrantCard(grant) {
    var escapeHtml = window.FundingConnectComponents.escapeHtml;

    return [
      '<article class="grant-card" role="listitem">',
      '  <p class="grant-cat">' + escapeHtml(grant.category) + "</p>",
      '  <p class="grant-title">' + escapeHtml(grant.title) + "</p>",
      '  <p class="grant-amount">' + escapeHtml(grant.amount) + "</p>",
      '  <p class="grant-close">' + escapeHtml(grant.close) + "</p>",
      "</article>",
    ].join("\n");
  }

  function renderGrantsCarousel() {
    var section = window.FCC_CONTENT.grantsSection || {};
    var grants = window.FCC_CONTENT.grants || [];
    var allGrants = grants.concat(grants); // duplicate for seamless loop
    var escapeHtml = window.FundingConnectComponents.escapeHtml

    window.FundingConnectComponents.setHtml(
      "grants-carousel-placeholder",
      [
        '<section class="grants-section" aria-labelledby="grants-heading">',
        '  <div class="grants-header">',
        '    <h2 id="grants-heading">' + escapeHtml(section.heading || 'Recent Grant Opportunities') + '</h2>',
        '    <span aria-label="' + escapeHtml(section.statusAriaLabel || 'This section is updated regularly') + '">' + escapeHtml(section.status || 'Updated regularly') + '</span>',
        "  </div>",
        '  <div class="grants-track-wrap" aria-label="' + escapeHtml(section.trackAriaLabel || 'Scrolling grant opportunities — hover to pause') + '">',
        '    <div class="grants-track" id="grants-track" role="list" aria-live="off">',
        allGrants.map(renderGrantCard).join("\n"),
        "    </div>",
        "  </div>",
        "</section>",
      ].join("\n"),
    );
  }

  document.addEventListener("DOMContentLoaded", renderGrantsCarousel);
})();
