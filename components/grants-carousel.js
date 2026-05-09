/**
 * Grants carousel component.
 */

"use strict";

(function () {
  var grants = [
    {
      cat: "Health & Wellbeing",
      title: "Indigenous Health & Wellbeing Fund",
      amount: "Up to $150,000",
      close: "Closes 30 Jun 2026",
    },
    {
      cat: "Education",
      title: "First Nations Education Support Grants",
      amount: "Up to $80,000",
      close: "Closes 15 Jul 2026",
    },
    {
      cat: "Economic Development",
      title: "Indigenous Business Australia – Growth Fund",
      amount: "$50,000 – $500,000",
      close: "Open rolling",
    },
    {
      cat: "Housing",
      title: "Remote Housing Infrastructure Program",
      amount: "Up to $2,000,000",
      close: "Closes 1 Aug 2026",
    },
    {
      cat: "Culture & Arts",
      title: "AIATSIS Community Heritage Grants",
      amount: "Up to $30,000",
      close: "Closes 20 Jul 2026",
    },
    {
      cat: "Youth",
      title: "Strong Communities Youth Development",
      amount: "Up to $120,000",
      close: "Closes 31 Aug 2026",
    },
    {
      cat: "Environment",
      title: "Land & Sea Country Ranger Program",
      amount: "Up to $250,000",
      close: "Open rolling",
    },
    {
      cat: "Governance",
      title: "Governance & Capability Support Fund",
      amount: "Up to $60,000",
      close: "Closes 14 Sep 2026",
    },
  ];

  function renderGrantCard(grant) {
    var escapeHtml = window.FundingConnectComponents.escapeHtml;

    return [
      '<article class="grant-card" role="listitem">',
      '  <p class="grant-cat">' + escapeHtml(grant.cat) + "</p>",
      '  <p class="grant-title">' + escapeHtml(grant.title) + "</p>",
      '  <p class="grant-amount">' + escapeHtml(grant.amount) + "</p>",
      '  <p class="grant-close">' + escapeHtml(grant.close) + "</p>",
      "</article>",
    ].join("\n");
  }

  function renderGrantsCarousel() {
    var allGrants = grants.concat(grants); // duplicate for seamless loop

    window.FundingConnectComponents.setHtml(
      "grants-carousel-placeholder",
      [
        '<section class="grants-section" aria-labelledby="grants-heading">',
        '  <div class="grants-header">',
        '    <h2 id="grants-heading">Recent Grant Opportunities</h2>',
        '    <span aria-label="This section is updated regularly">Updated regularly</span>',
        "  </div>",
        '  <div class="grants-track-wrap" aria-label="Scrolling grant opportunities — hover to pause">',
        '    <div class="grants-track" id="grants-track" role="list" aria-live="off">',
        allGrants.map(renderGrantCard).join("\n"),
        "    </div>",
        "  </div>",
        "</section>",
      ].join("\n"),
    );
  }

  document.addEventListener("DOMContentLoaded", renderGrantsCarousel);
})();
