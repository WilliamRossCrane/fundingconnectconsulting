/**
 * Funding Connect Consulting — tabs.js
 *
 * Handles Connect page tab switching.
 */

"use strict";

(function () {
  var tabsBound = false;

  /**
   * @param {string} tabId        'enquiry' | 'newsletter'
   * @param {HTMLElement} clickedBtn
   */
  function switchTab(tabId, clickedBtn) {
    document.querySelectorAll(".tab-panel").forEach(function (panel) {
      panel.classList.remove("active");
      panel.hidden = true;
    });

    document.querySelectorAll(".tab-btn").forEach(function (btn) {
      btn.classList.remove("active");
      btn.setAttribute("aria-selected", "false");
    });

    var panel = document.getElementById("tab-" + tabId);
    if (panel) {
      panel.classList.add("active");
      panel.hidden = false;
    }

    if (clickedBtn) {
      clickedBtn.classList.add("active");
      clickedBtn.setAttribute("aria-selected", "true");
    }
  }

  function getInitialTabButton() {
    return document.querySelector(".tabs [data-tab]");
  }

  function handleTabClick(event) {
    var btn = event.target.closest("[data-tab]");
    if (!btn) return;

    switchTab(btn.getAttribute("data-tab"), btn);
  }

  function initTabs() {
    if (!tabsBound) {
      document.addEventListener("click", handleTabClick);
      tabsBound = true;
    }

    var initialTab = getInitialTabButton();
    if (initialTab) {
      switchTab(initialTab.getAttribute("data-tab"), initialTab);
    }
  }

  window.switchTab = switchTab;
  window.FundingConnectApp.initTabs = initTabs;
})();
