/**
 * Connect page sidebar intro component.
 */

"use strict";

(function () {
  function renderContactIntro() {
    var content = window.FCC_CONTENT.contactIntro;
    var escapeHtml = window.FundingConnectComponents.escapeHtml;
    if (!content) return;

    window.FundingConnectComponents.setHtml(
      "connect-intro-placeholder",
      [
        "<h2>" + escapeHtml(content.heading) + "</h2>",
        content.text ? "<p>" + escapeHtml(content.text) + "</p>" : "",
      ].join("\n"),
    );
  }

  document.addEventListener("DOMContentLoaded", renderContactIntro);
})();
