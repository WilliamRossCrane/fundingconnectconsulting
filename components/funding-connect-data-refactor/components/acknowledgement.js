/**
 * Acknowledgement of Country component.
 */

"use strict";

(function () {
  function renderAboutAcknowledgement() {
    var escapeHtml = window.FundingConnectComponents.escapeHtml;
    var acknowledgements = window.FCC_CONTENT.acknowledgements || {};

    window.FundingConnectComponents.setHtml(
      "about-acknowledgement-placeholder",
      [
        '<aside class="ack" aria-label="Acknowledgement of Country">',
        "  <h4>Acknowledgement of Country</h4>",
        "  <p>",
        "    " + escapeHtml(acknowledgements.full || ""),
        "  </p>",
        "</aside>",
      ].join("\n"),
    );
  }

  function renderConnectAcknowledgement() {
    var escapeHtml = window.FundingConnectComponents.escapeHtml;
    var acknowledgements = window.FCC_CONTENT.acknowledgements || {};

    window.FundingConnectComponents.setHtml(
      "connect-acknowledgement-placeholder",
      [
        '<aside class="ack-small" aria-label="Acknowledgement of Country">',
        "  <strong>Acknowledgement of Country</strong>",
        "  <p>",
        "    " + escapeHtml(acknowledgements.short || ""),
        "  </p>",
        "</aside>",
      ].join("\n"),
    );
  }

  document.addEventListener("DOMContentLoaded", function () {
    renderAboutAcknowledgement();
    renderConnectAcknowledgement();
  });
})();
