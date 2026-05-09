/**
 * About page pillars component.
 */

"use strict";

(function () {
  var icons = {
    people: [
      '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" focusable="false">',
      '  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="#0E4D57" stroke-width="2" stroke-linecap="round" />',
      '  <circle cx="9" cy="7" r="4" stroke="#0E4D57" stroke-width="2" />',
      '  <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="#0E4D57" stroke-width="2" stroke-linecap="round" />',
      "</svg>",
    ].join("\n"),
    heart: [
      '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" focusable="false">',
      '  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke="#D18B3D" stroke-width="2" stroke-linecap="round" />',
      "</svg>",
    ].join("\n"),
    shield: [
      '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" focusable="false">',
      '  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#4A7F7B" stroke-width="2" stroke-linecap="round" />',
      "</svg>",
    ].join("\n"),
  };

  var pillars = [
    {
      title: "Connection",
      text: "Linking organisations with the right opportunities, partners and networks to maximise their reach and impact.",
      icon: icons.people,
    },
    {
      title: "Trust",
      text: "Built through honest relationships, cultural respect and always putting community first in everything we do.",
      icon: icons.heart,
    },
    {
      title: "Impact",
      text: "Measurable outcomes that strengthen communities and support wellbeing across generations.",
      icon: icons.shield,
    },
  ];

  function renderPillar(pillar) {
    return [
      '<li class="pillar">',
      '  <div class="pillar-icon" aria-hidden="true">',
      pillar.icon,
      "  </div>",
      "  <h3>" + pillar.title + "</h3>",
      "  <p>" + pillar.text + "</p>",
      "</li>",
    ].join("\n");
  }

  function renderPillars() {
    window.FundingConnectComponents.setHtml(
      "pillars-placeholder",
      [
        '<ul class="pillars-row" role="list" aria-label="Our three pillars">',
        pillars.map(renderPillar).join("\n"),
        "</ul>",
      ].join("\n"),
    );
  }

  document.addEventListener("DOMContentLoaded", renderPillars);
})();
