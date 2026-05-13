"use strict";

(function () {
  var pillarIcons = {
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

  var serviceIcons = {
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

  function renderHeroAction(action) {
    var escapeHtml = window.FundingConnectComponents.escapeHtml;

    return [
      "<button",
      '  class="' + escapeHtml(action.className || "btn") + '"',
      '  data-page-link="' + escapeHtml(action.page) + '"',
      '  aria-label="' + escapeHtml(action.ariaLabel || action.label) + '"',
      ">",
      "  " + escapeHtml(action.label),
      "</button>",
    ].join("\n");
  }

  function renderHomeHero() {
    var content = window.FCC_CONTENT.homeHero;
    var escapeHtml = window.FundingConnectComponents.escapeHtml;
    if (!content) return;

    window.FundingConnectComponents.setHtml(
      "home-hero-placeholder",
      [
        '<section class="home-hero" aria-labelledby="hero-heading">',
        '  <p class="hero-tag" aria-hidden="true">',
        "    " + escapeHtml(content.tag),
        "  </p>",
        '  <h1 id="hero-heading">' + content.heading + "</h1>",
        "  <p>",
        "    " + escapeHtml(content.text),
        "  </p>",
        '  <div class="hero-actions">',
        (content.actions || []).map(renderHeroAction).join("\n"),
        "  </div>",
        "</section>",
      ].join("\n")
    );
  }

  function renderArchSvg() {
    return [
      '<svg width="120" height="96" viewBox="0 0 120 96" fill="none" aria-hidden="true" focusable="false">',
      '  <path d="M6 88 Q6 14 60 14 Q114 14 114 88" stroke="rgba(255,255,255,.25)" stroke-width="10" fill="none" stroke-linecap="round" />',
      '  <path d="M20 88 Q20 30 60 30 Q100 30 100 88" stroke="rgba(198,216,211,.45)" stroke-width="4" fill="none" stroke-linecap="round" />',
      '  <circle cx="46" cy="16" r="13" fill="rgba(255,255,255,.8)" />',
      '  <circle cx="68" cy="11" r="11" fill="#D18B3D" />',
      "</svg>",
    ].join("\n");
  }

  function renderHomeBlurb() {
    var content = window.FCC_CONTENT.homeBlurb;
    var escapeHtml = window.FundingConnectComponents.escapeHtml;
    if (!content) return;

    var link = content.link || {};
    var missionCard = content.missionCard || {};

    window.FundingConnectComponents.setHtml(
      "home-blurb-placeholder",
      [
        '<section class="blurb" aria-labelledby="blurb-heading">',
        '  <div class="blurb-text">',
        '    <h2 id="blurb-heading">' + escapeHtml(content.heading) + "</h2>",
        (content.paragraphs || [])
          .map(function (paragraph) {
            return "    <p>" + escapeHtml(paragraph) + "</p>";
          })
          .join("\n"),
        "    <p>",
        "      " + escapeHtml(content.finalParagraph || ""),
        '      <a href="#" data-page-link="' +
          escapeHtml(link.page || "about") +
          '" aria-label="' +
          escapeHtml(link.ariaLabel || link.label || "Learn more") +
          '">' +
          escapeHtml(link.label || "Learn more →") +
          "</a>",
        "    </p>",
        "  </div>",
        '  <div class="blurb-visual" aria-hidden="true">',
        '    <div class="arch-box">',
        renderArchSvg(),
        '      <p>"' + escapeHtml(missionCard.quote || "") + '"</p>',
        "      <cite>" + escapeHtml(missionCard.cite || "") + "</cite>",
        "    </div>",
        "  </div>",
        "</section>",
      ].join("\n")
    );
  }

  function renderAboutIntro() {
    var paragraphs = window.FCC_CONTENT.aboutIntro || [];
    var escapeHtml = window.FundingConnectComponents.escapeHtml;

    window.FundingConnectComponents.setHtml(
      "about-intro-placeholder",
      paragraphs
        .map(function (paragraph) {
          return "<p>" + escapeHtml(paragraph) + "</p>";
        })
        .join("\n")
    );
  }

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
    var valuesSection = window.FCC_CONTENT.valuesSection || {};
    var values = window.FCC_CONTENT.values || [];
    var escapeHtml = window.FundingConnectComponents.escapeHtml;

    window.FundingConnectComponents.setHtml(
      "values-placeholder",
      [
        '<aside class="values-box" aria-labelledby="values-heading">',
        '  <h3 id="values-heading">' +
          escapeHtml(valuesSection.heading || "Our Values") +
          "</h3>",
        '  <ul class="values-list" role="list">',
        values.map(renderValue).join("\n"),
        "  </ul>",
        "</aside>",
      ].join("\n")
    );
  }

  function renderPillar(pillar) {
    var escapeHtml = window.FundingConnectComponents.escapeHtml;

    return [
      '<li class="pillar">',
      '  <div class="pillar-icon" aria-hidden="true">',
      pillarIcons[pillar.icon] || "",
      "  </div>",
      "  <h3>" + escapeHtml(pillar.title) + "</h3>",
      "  <p>" + escapeHtml(pillar.text) + "</p>",
      "</li>",
    ].join("\n");
  }

  function renderPillars() {
    var section = window.FCC_CONTENT.pillarsSection || {};
    var pillars = window.FCC_CONTENT.pillars || [];
    var escapeHtml = window.FundingConnectComponents.escapeHtml;

    window.FundingConnectComponents.setHtml(
      "pillars-placeholder",
      [
        '<ul class="pillars-row" role="list" aria-label="' +
          escapeHtml(section.ariaLabel || "Our three pillars") +
          '">',
        pillars.map(renderPillar).join("\n"),
        "</ul>",
      ].join("\n")
    );
  }

  function renderAcknowledgement(targetId, className, text) {
    var acknowledgements = window.FCC_CONTENT.acknowledgements || {};
    var escapeHtml = window.FundingConnectComponents.escapeHtml;

    window.FundingConnectComponents.setHtml(
      targetId,
      [
        '<aside class="' +
          className +
          '" aria-label="Acknowledgement of Country">',
        targetId === "about-acknowledgement-placeholder"
          ? "  <h4>" +
            escapeHtml(acknowledgements.title || "Acknowledgement of Country") +
            "</h4>"
          : "  <strong>" +
            escapeHtml(acknowledgements.title || "Acknowledgement of Country") +
            "</strong>",
        "  <p>",
        "    " + escapeHtml(text || ""),
        "  </p>",
        "</aside>",
      ].join("\n")
    );
  }

  function renderService(service) {
    var escapeHtml = window.FundingConnectComponents.escapeHtml;

    return [
      '<li class="svc">',
      '  <div class="svc-icon" aria-hidden="true">',
      serviceIcons[service.icon] || "",
      "  </div>",
      "  <h3>" + escapeHtml(service.title) + "</h3>",
      "  <p>" + escapeHtml(service.text) + "</p>",
      "</li>",
    ].join("\n");
  }

  function renderServicesGrid() {
    var section = window.FCC_CONTENT.servicesSection || {};
    var services = window.FCC_CONTENT.services || [];
    var escapeHtml = window.FundingConnectComponents.escapeHtml;

    window.FundingConnectComponents.setHtml(
      "services-grid-placeholder",
      [
        '<ul class="services-grid" role="list" aria-label="' +
          escapeHtml(section.ariaLabel || "Our services") +
          '">',
        services.map(renderService).join("\n"),
        "</ul>",
      ].join("\n")
    );
  }

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
    var escapeHtml = window.FundingConnectComponents.escapeHtml;

    window.FundingConnectComponents.setHtml(
      "process-steps-placeholder",
      [
        '<section class="process" aria-labelledby="process-heading">',
        '  <h2 id="process-heading">' +
          escapeHtml(section.heading || "How we work") +
          "</h2>",
        '  <ol class="steps" aria-label="' +
          escapeHtml(section.ariaLabel || "Our four-step process") +
          '">',
        steps.map(renderStep).join("\n"),
        "  </ol>",
        "</section>",
      ].join("\n")
    );
  }

  function init() {
    var acknowledgements = window.FCC_CONTENT.acknowledgements || {};

    renderHomeHero();
    renderHomeBlurb();
    renderAboutIntro();
    renderValues();
    renderPillars();
    renderAcknowledgement(
      "about-acknowledgement-placeholder",
      "ack",
      acknowledgements.full || ""
    );
    renderServicesGrid();
    renderProcessSteps();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
