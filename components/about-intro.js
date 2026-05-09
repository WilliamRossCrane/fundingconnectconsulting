/**
 * About intro copy component.
 */

"use strict";

(function () {
  function renderAboutIntro() {
    var paragraphs = window.FCC_CONTENT.aboutIntro || [];
    var escapeHtml = window.FundingConnectComponents.escapeHtml;

    window.FundingConnectComponents.setHtml(
      "about-intro-placeholder",
      paragraphs
        .map(function (paragraph) {
          return "<p>" + escapeHtml(paragraph) + "</p>";
        })
        .join("\n"),
    );
  }

  document.addEventListener("DOMContentLoaded", renderAboutIntro);
})();
