/**
 * Contact information component.
 */

"use strict";

(function () {
  var icons = {
    email: [
      '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" focusable="false">',
      '  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="#0E4D57" stroke-width="2" />',
      '  <polyline points="22,6 12,13 2,6" stroke="#0E4D57" stroke-width="2" />',
      "</svg>",
    ].join("\n"),
    phone: [
      '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" focusable="false">',
      '  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.42 2 2 0 0 1 3.58 1.25h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.82a16 16 0 0 0 6.29 6.29l1.13-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" stroke="#0E4D57" stroke-width="2" />',
      "</svg>",
    ].join("\n"),
    location: [
      '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" focusable="false">',
      '  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="#0E4D57" stroke-width="2" />',
      '  <circle cx="12" cy="10" r="3" stroke="#0E4D57" stroke-width="2" />',
      "</svg>",
    ].join("\n"),
  };

  var contactItems = [
    {
      label: "Email",
      value: '<a href="mailto:hello@fundingconnect.com.au">hello@fundingconnect.com.au</a>',
      icon: icons.email,
    },
    {
      label: "Phone",
      value: '<a href="tel:+61700000000">(07) XXXX XXXX</a>',
      icon: icons.phone,
    },
    {
      label: "Location",
      value: "<span>Brisbane, Queensland</span>",
      icon: icons.location,
    },
  ];

  function renderContactItem(item) {
    return [
      '<li class="info-item">',
      '  <span class="info-icon" aria-hidden="true">',
      item.icon,
      "  </span>",
      '  <div class="info-text">',
      "    <strong>" + item.label + "</strong>",
      "    " + item.value,
      "  </div>",
      "</li>",
    ].join("\n");
  }

  function renderContactInfo() {
    window.FundingConnectComponents.setHtml(
      "contact-info-placeholder",
      [
        '<ul class="info-list" role="list">',
        contactItems.map(renderContactItem).join("\n"),
        "</ul>",
      ].join("\n"),
    );
  }

  document.addEventListener("DOMContentLoaded", renderContactInfo);
})();
