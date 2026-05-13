/**
 * Funding Connect Consulting — app.js
 *
 * Initialises page behaviour once the DOM is ready.
 */

"use strict";

import { renderGrantsCarousel } from "../components/grants-carousel.js";
import { initGrants } from "./grants.js";

function initApp() {
  renderGrantsCarousel();

  if (typeof window.FundingConnectApp.initPageLinks === "function") {
    window.FundingConnectApp.initPageLinks();
  }

  if (typeof window.FundingConnectApp.initTabs === "function") {
    window.FundingConnectApp.initTabs();
  }

  if (typeof window.FundingConnectApp.initForms === "function") {
    window.FundingConnectApp.initForms();
  }

  initGrants();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}
