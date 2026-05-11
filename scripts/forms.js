/**
 * Funding Connect Consulting — forms.js
 *
 * Static-form helpers for Formspree and embedded newsletter signup content.
 */

"use strict";

(function () {
  function getSuccessUrl() {
    return window.location.origin + window.location.pathname + "?enquiry=thanks";
  }

  function setFormspreeRedirect() {
    var nextField = document.querySelector('input[name="_next"]');
    if (!nextField) return;
    nextField.value = getSuccessUrl();
  }

  function showEnquiryThankYou() {
    var params = new URLSearchParams(window.location.search);
    if (params.get("enquiry") !== "thanks") return;

    if (typeof window.showPage === "function") {
      window.showPage("connect");
    }

    var enquiryTabBtn = document.getElementById("tab-btn-enquiry");
    if (typeof window.switchTab === "function" && enquiryTabBtn) {
      window.switchTab("enquiry", enquiryTabBtn);
    }

    var banner = document.getElementById("enquiry-success-banner");
    if (banner) {
      banner.classList.add("is-visible");
    }

    if (window.history && typeof window.history.replaceState === "function") {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }

  function initForms() {
    setFormspreeRedirect();
    showEnquiryThankYou();
  }

  window.FundingConnectApp.initForms = initForms;
})();
