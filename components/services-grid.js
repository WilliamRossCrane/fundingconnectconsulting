/**
 * Services grid component.
 */

"use strict";

(function () {
  var icons = {
    search: [
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" focusable="false">',
      '  <circle cx="11" cy="11" r="8" stroke="#0E4D57" stroke-width="2" />',
      '  <path d="m21 21-4.35-4.35" stroke="#0E4D57" stroke-width="2" stroke-linecap="round" />',
      "</svg>",
    ].join("\n"),
    document: [
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" focusable="false">',
      '  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="#0E4D57" stroke-width="2" stroke-linecap="round" />',
      '  <polyline points="14,2 14,8 20,8" stroke="#0E4D57" stroke-width="2" />',
      '  <line x1="16" y1="13" x2="8" y2="13" stroke="#0E4D57" stroke-width="2" stroke-linecap="round" />',
      '  <line x1="16" y1="17" x2="8" y2="17" stroke="#0E4D57" stroke-width="2" stroke-linecap="round" />',
      "</svg>",
    ].join("\n"),
    monitor: [
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" focusable="false">',
      '  <rect x="2" y="3" width="20" height="14" rx="2" stroke="#0E4D57" stroke-width="2" />',
      '  <line x1="8" y1="21" x2="16" y2="21" stroke="#0E4D57" stroke-width="2" stroke-linecap="round" />',
      '  <line x1="12" y1="17" x2="12" y2="21" stroke="#0E4D57" stroke-width="2" stroke-linecap="round" />',
      "</svg>",
    ].join("\n"),
    people: [
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" focusable="false">',
      '  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="#0E4D57" stroke-width="2" stroke-linecap="round" />',
      '  <circle cx="9" cy="7" r="4" stroke="#0E4D57" stroke-width="2" />',
      '  <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="#0E4D57" stroke-width="2" stroke-linecap="round" />',
      "</svg>",
    ].join("\n"),
    pulse: [
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" focusable="false">',
      '  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" stroke="#0E4D57" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />',
      "</svg>",
    ].join("\n"),
    shield: [
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" focusable="false">',
      '  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#0E4D57" stroke-width="2" stroke-linecap="round" />',
      "</svg>",
    ].join("\n"),
  };

  var services = [
    {
      title: "Funding Identification",
      text: "We research and identify relevant government, philanthropic and corporate funding tailored to your organisation's goals and community priorities.",
      icon: icons.search,
    },
    {
      title: "Grant Writing",
      text: "Expert writers craft compelling, community-led applications that articulate your vision powerfully and satisfy funder requirements.",
      icon: icons.document,
    },
    {
      title: "Program Design",
      text: "We co-design culturally grounded programs alongside your community — evidence-informed, measurable and genuinely impactful.",
      icon: icons.monitor,
    },
    {
      title: "Stakeholder Engagement",
      text: "Meaningful consultation and partnership development with government, community and sector stakeholders.",
      icon: icons.people,
    },
    {
      title: "Monitoring &amp; Evaluation",
      text: "Robust M&amp;E frameworks that capture real impact and satisfy funder reporting — without the burden on your team.",
      icon: icons.pulse,
    },
    {
      title: "Capacity Building",
      text: "Workshops, mentoring and tailored training so your team has the skills to thrive long after our engagement ends.",
      icon: icons.shield,
    },
  ];

  function renderService(service) {
    return [
      '<li class="svc">',
      '  <div class="svc-icon" aria-hidden="true">',
      service.icon,
      "  </div>",
      "  <h3>" + service.title + "</h3>",
      "  <p>" + service.text + "</p>",
      "</li>",
    ].join("\n");
  }

  function renderServicesGrid() {
    window.FundingConnectComponents.setHtml(
      "services-grid-placeholder",
      [
        '<ul class="services-grid" role="list" aria-label="Our services">',
        services.map(renderService).join("\n"),
        "</ul>",
      ].join("\n"),
    );
  }

  document.addEventListener("DOMContentLoaded", renderServicesGrid);
})();
