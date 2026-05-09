/**
 * Services process steps component.
 */

"use strict";

(function () {
  var steps = [
    {
      number: "01",
      title: "Listen",
      text: "We start by understanding your community, vision and specific needs — no assumptions.",
    },
    {
      number: "02",
      title: "Identify",
      text: "We map the funding landscape and pinpoint opportunities aligned to your priorities.",
    },
    {
      number: "03",
      title: "Develop",
      text: "We co-create compelling applications and program designs grounded in your community's story.",
    },
    {
      number: "04",
      title: "Support",
      text: "We stay alongside you through reporting, evaluation and planning for future rounds.",
    },
  ];

  function renderStep(step) {
    return [
      '<li class="step">',
      '  <span class="step-num" aria-hidden="true">' + step.number + "</span>",
      "  <h3>" + step.title + "</h3>",
      "  <p>" + step.text + "</p>",
      "</li>",
    ].join("\n");
  }

  function renderProcessSteps() {
    window.FundingConnectComponents.setHtml(
      "process-steps-placeholder",
      [
        '<section class="process" aria-labelledby="process-heading">',
        '  <h2 id="process-heading">How we work</h2>',
        '  <ol class="steps" aria-label="Our four-step process">',
        steps.map(renderStep).join("\n"),
        "  </ol>",
        "</section>",
      ].join("\n"),
    );
  }

  document.addEventListener("DOMContentLoaded", renderProcessSteps);
})();
