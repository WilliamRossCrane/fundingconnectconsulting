/**
 * Funding Connect Consulting — tabs.js
 *
 * Handles Connect page tab switching.
 */

"use strict";

(function () {
  /**
   * @param {string} tabId        'enquiry' | 'newsletter'
   * @param {HTMLElement} clickedBtn
   */
  function switchTab(tabId, clickedBtn) {
    document.querySelectorAll(".tab-panel").forEach(function (panel) {
      panel.classList.remove("active");
    });

    document.querySelectorAll(".tab-btn").forEach(function (btn) {
      btn.classList.remove("active");
      btn.setAttribute("aria-selected", "false");
    });

    var panel = document.getElementById("tab-" + tabId);
    if (panel) panel.classList.add("active");

    if (clickedBtn) {
      clickedBtn.classList.add("active");
      clickedBtn.setAttribute("aria-selected", "true");
    }
  }

  function initTabs() {
    document.querySelectorAll("[data-tab]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        switchTab(btn.getAttribute("data-tab"), btn);
      });
    });
  }

  window.switchTab = switchTab;
  window.FundingConnectApp.initTabs = initTabs;
})();
