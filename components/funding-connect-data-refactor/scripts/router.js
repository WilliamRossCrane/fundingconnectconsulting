/**
 * Funding Connect Consulting — router.js
 *
 * Handles simple SPA page navigation.
 */

"use strict";

(function () {
  /**
   * Show a named page.
   * @param {string} pageId  'home' | 'about' | 'services' | 'connect'
   */
  function showPage(pageId) {
    document.querySelectorAll(".page").forEach(function (el) {
      el.classList.remove("active");
    });

    var target = document.getElementById("page-" + pageId);
    if (target) target.classList.add("active");

    if (typeof window.setActiveNavLink === "function") {
      window.setActiveNavLink(pageId);
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function initPageLinks() {
    document.addEventListener("click", function (event) {
      var link = event.target.closest("[data-page-link]");
      if (!link) return;

      event.preventDefault();
      showPage(link.getAttribute("data-page-link"));
    });
  }

  window.showPage = showPage;
  window.FundingConnectApp.initPageLinks = initPageLinks;
})();
