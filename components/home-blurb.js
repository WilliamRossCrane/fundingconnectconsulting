/**
 * Home blurb component.
 */

"use strict";

(function () {
  function renderArchSvg() {
    return [
      '<svg width="120" height="96" viewBox="0 0 120 96" fill="none" aria-hidden="true" focusable="false">',
      '  <path d="M6 88 Q6 14 60 14 Q114 14 114 88" stroke="rgba(255,255,255,.25)" stroke-width="10" fill="none" stroke-linecap="round" />',
      '  <path d="M20 88 Q20 30 60 30 Q100 30 100 88" stroke="rgba(198,216,211,.45)" stroke-width="4" fill="none" stroke-linecap="round" />',
      '  <circle cx="46" cy="16" r="13" fill="rgba(255,255,255,.8)" />',
      '  <circle cx="68" cy="11" r="11" fill="#D18B3D" />',
      "</svg>",
    ].join("\n");
  }

  function renderHomeBlurb() {
    var content = window.FCC_CONTENT.homeBlurb;
    var escapeHtml = window.FundingConnectComponents.escapeHtml;
    if (!content) return;

    var link = content.link || {};
    var missionCard = content.missionCard || {};

    window.FundingConnectComponents.setHtml(
      "home-blurb-placeholder",
      [
        '<section class="blurb" aria-labelledby="blurb-heading">',
        '  <div class="blurb-text">',
        '    <h2 id="blurb-heading">' + escapeHtml(content.heading) + "</h2>",
        (content.paragraphs || [])
          .map(function (paragraph) {
            return "    <p>" + escapeHtml(paragraph) + "</p>";
          })
          .join("\n"),
        "    <p>",
        "      " + escapeHtml(content.finalParagraph || ""),
        '      <a href="#" data-page-link="' + escapeHtml(link.page || "about") + '" aria-label="' + escapeHtml(link.ariaLabel || link.label || "Learn more") + '">' + escapeHtml(link.label || "Learn more →") + "</a>",
        "    </p>",
        "  </div>",
        '  <div class="blurb-visual" aria-hidden="true">',
        '    <div class="arch-box">',
        renderArchSvg(),
        "      <p>\"" + escapeHtml(missionCard.quote || "") + "\"</p>",
        "      <cite>" + escapeHtml(missionCard.cite || "") + "</cite>",
        "    </div>",
        "  </div>",
        "</section>",
      ].join("\n"),
    );
  }

  document.addEventListener("DOMContentLoaded", renderHomeBlurb);
})();
