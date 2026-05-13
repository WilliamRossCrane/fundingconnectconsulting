/**
 * Funding Connect Consulting — app.js
 *
 * Initialises page behaviour once the DOM is ready.
 */

"use strict";

function initApp() {
  if (typeof window.FundingConnectApp.initPageLinks === "function") {
    window.FundingConnectApp.initPageLinks();
  }

  if (typeof window.FundingConnectApp.initTabs === "function") {
    window.FundingConnectApp.initTabs();
  }

  if (typeof window.FundingConnectApp.initForms === "function") {
    window.FundingConnectApp.initForms();
  }

  if (typeof window.FundingConnectApp.initGrants === "function") {
    window.FundingConnectApp.initGrants();
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}
