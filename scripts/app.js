/**
 * Funding Connect Consulting — app.js
 *
 * Initialises page behaviour once the DOM is ready.
 */

"use strict";

document.addEventListener("DOMContentLoaded", function () {
  if (typeof window.FundingConnectApp.initPageLinks === "function") {
    window.FundingConnectApp.initPageLinks();
  }

  if (typeof window.FundingConnectApp.initTabs === "function") {
    window.FundingConnectApp.initTabs();
  }

  if (typeof window.FundingConnectApp.initForms === "function") {
    window.FundingConnectApp.initForms();
  }
});
