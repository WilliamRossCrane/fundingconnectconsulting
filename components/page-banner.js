/**
 * Page banner component.
 *
 * Used by About, Services and Connect pages.
 */

"use strict";

(function () {
  var banners = [
    {
      targetId: "about-page-banner-placeholder",
      tag: "Who We Are",
      heading: "Built on Connection,<br />Trust &amp; Impact",
      text: "A consulting practice dedicated to strengthening Aboriginal and Torres Strait Islander organisations across Australia.",
    },
    {
      targetId: "services-page-banner-placeholder",
      tag: "What We Do",
      heading: "Our Services",
      text: "Specialist consulting designed around the unique needs and aspirations of Aboriginal and Torres Strait Islander communities.",
    },
    {
      targetId: "connect-page-banner-placeholder",
      tag: "Get in Touch",
      heading: "Let's Connect",
      text: "Whether you're starting your funding journey or need specialist support, we're here to help.",
    },
  ];

  function renderPageBanner(banner) {
    window.FundingConnectComponents.setHtml(
      banner.targetId,
      [
        '<div class="page-banner">',
        '  <p class="tag" aria-hidden="true">' + banner.tag + "</p>",
        "  <h1>" + banner.heading + "</h1>",
        "  <p>" + banner.text + "</p>",
        "</div>",
      ].join("\n"),
    );
  }

  document.addEventListener("DOMContentLoaded", function () {
    banners.forEach(renderPageBanner);
  });
})();
