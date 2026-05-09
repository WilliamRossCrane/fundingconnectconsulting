/**
 * About page values component.
 */

"use strict";

(function () {
  var values = [
    {
      title: "Self-Determination",
      text: "Community voices lead every process.",
    },
    {
      title: "Cultural Safety",
      text: "Deep respect for Country and culture always.",
    },
    {
      title: "Transparency",
      text: "Honest, practical advice you can rely on.",
    },
    {
      title: "Accountability",
      text: "We answer to the communities we serve.",
    },
    {
      title: "Long-term Thinking",
      text: "Building capability, not dependency.",
    },
  ];

  function renderValue(value) {
    return [
      '<li class="value-row">',
      '  <span class="vdot" aria-hidden="true"></span>',
      "  <span><strong>" + value.title + "</strong> — " + value.text + "</span>",
      "</li>",
    ].join("\n");
  }

  function renderValues() {
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
