/**
 * Page banner component.
 *
 * Used by About, Services and Connect pages.
 */

"use strict";

(function () {
  var bannerTargets = [
    {
      key: "about",
      targetId: "about-page-banner-placeholder",
    },
    {
      key: "services",
      targetId: "services-page-banner-placeholder",
    },
    {
      key: "connect",
      targetId: "connect-page-banner-placeholder",
    },
  ];

  function renderPageBanner(config) {
    var content = window.FCC_CONTENT.pageBanners[config.key];
    var escapeHtml = window.FundingConnectComponents.escapeHtml;
    if (!content) return;

    window.FundingConnectComponents.setHtml(
      config.targetId,
      [
        '<div class="page-banner">',
        '  <p class="tag" aria-hidden="true">' + escapeHtml(content.tag) + "</p>",
        "  <h1>" + content.heading + "</h1>",
        "  <p>" + escapeHtml(content.text) + "</p>",
        "</div>",
      ].join("\n"),
    );
  }

  document.addEventListener("DOMContentLoaded", function () {
    bannerTargets.forEach(renderPageBanner);
  });
})();
