/**
 * Acknowledgement of Country component.
 */

"use strict";

(function () {
  function renderAboutAcknowledgement() {
    window.FundingConnectComponents.setHtml(
      "about-acknowledgement-placeholder",
      [
        '<aside class="ack" aria-label="Acknowledgement of Country">',
        "  <h4>Acknowledgement of Country</h4>",
        "  <p>",
        "    We acknowledge the Traditional Custodians of Country throughout Australia and recognise their continuing connection to Land, Water and Community. We pay our respects to Elders past, present and emerging.",
        "  </p>",
        "</aside>",
      ].join("\n"),
    );
  }

  function renderConnectAcknowledgement() {
    window.FundingConnectComponents.setHtml(
      "connect-acknowledgement-placeholder",
      [
        '<aside class="ack-small" aria-label="Acknowledgement of Country">',
        "  <strong>Acknowledgement of Country</strong>",
        "  <p>",
        "    We acknowledge the Traditional Custodians of Country throughout Australia and their continuing connection to Land, Water and Community.",
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
