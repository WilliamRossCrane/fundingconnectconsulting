/**
 * Home hero component.
 */

"use strict";

(function () {
  function renderHeroAction(action) {
    var escapeHtml = window.FundingConnectComponents.escapeHtml;

    return [
      '<button',
      '  class="' + escapeHtml(action.className || "btn") + '"',
      '  data-page-link="' + escapeHtml(action.page) + '"',
      '  aria-label="' + escapeHtml(action.ariaLabel || action.label) + '"',
      '>',
      "  " + escapeHtml(action.label),
      "</button>",
    ].join("\n");
  }

  function renderHomeHero() {
    var content = window.FCC_CONTENT.homeHero;
    var escapeHtml = window.FundingConnectComponents.escapeHtml;
    if (!content) return;

    window.FundingConnectComponents.setHtml(
      "home-hero-placeholder",
      [
        '<section class="home-hero" aria-labelledby="hero-heading">',
        '  <p class="hero-tag" aria-hidden="true">',
        "    " + escapeHtml(content.tag),
        "  </p>",
        '  <h1 id="hero-heading">' + content.heading + "</h1>",
        "  <p>",
        "    " + escapeHtml(content.text),
        "  </p>",
        '  <div class="hero-actions">',
        (content.actions || []).map(renderHeroAction).join("\n"),
        "  </div>",
        "</section>",
      ].join("\n"),
    );
  }

  document.addEventListener("DOMContentLoaded", renderHomeHero);
})();
