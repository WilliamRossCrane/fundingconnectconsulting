/**
 * Services process steps component.
 */

"use strict";

(function () {
  function renderStep(step) {
    var escapeHtml = window.FundingConnectComponents.escapeHtml;

    return [
      '<li class="step">',
      '  <span class="step-num" aria-hidden="true">' +
        escapeHtml(step.number) +
        "</span>",
      "  <h3>" + escapeHtml(step.title) + "</h3>",
      "  <p>" + escapeHtml(step.text) + "</p>",
      "</li>",
    ].join("\n");
  }

  function renderProcessSteps() {
    var section = window.FCC_CONTENT.processSection || {};
    var steps = window.FCC_CONTENT.processSteps || [];
    var escapeHtml = window.FundingConnectComponents.escapeHtml

    window.FundingConnectComponents.setHtml(
      "process-steps-placeholder",
      [
        '<section class="process" aria-labelledby="process-heading">',
        '  <h2 id="process-heading">' + escapeHtml(section.heading || 'How we work') + '</h2>',
        '  <ol class="steps" aria-label="' + escapeHtml(section.ariaLabel || 'Our four-step process') + '">',
        steps.map(renderStep).join("\n"),
        "  </ol>",
        "</section>",
      ].join("\n"),
    );
  }

  document.addEventListener("DOMContentLoaded", renderProcessSteps);
})();
