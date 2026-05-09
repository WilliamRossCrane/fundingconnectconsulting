/**
 * About page values component.
 */

"use strict";

(function () {
  function renderValue(value) {
    var escapeHtml = window.FundingConnectComponents.escapeHtml;

    return [
      '<li class="value-row">',
      '  <span class="vdot" aria-hidden="true"></span>',
      "  <span><strong>" +
        escapeHtml(value.title) +
        "</strong> — " +
        escapeHtml(value.text) +
        "</span>",
      "</li>",
    ].join("\n");
  }

  function renderValues() {
    var values = window.FCC_CONTENT.values || [];

    window.FundingConnectComponents.setHtml(
      "values-placeholder",
      [
        '<aside class="values-box" aria-labelledby="values-heading">',
        '  <h3 id="values-heading">Our Values</h3>',
        '  <ul class="values-list" role="list">',
        values.map(renderValue).join("\n"),
        "  </ul>",
        "</aside>",
      ].join("\n"),
    );
  }

  document.addEventListener("DOMContentLoaded", renderValues);
})();
