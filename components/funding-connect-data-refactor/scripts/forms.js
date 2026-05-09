/**
 * Funding Connect Consulting — forms.js
 *
 * Handles enquiry and newsletter form behaviour.
 */

"use strict";

(function () {
  /**
   * TO CONNECT A REAL BACKEND:
   *   Formspree — replace the fetch URL with your Formspree endpoint.
   *   Vercel    — POST to /api/enquiry.js
   *   EmailJS   — https://www.emailjs.com
   */
  function submitEnquiry() {
    var name = window.FundingConnectApp.getTrimmedValue("e-name");
    var email = window.FundingConnectApp.getTrimmedValue("e-email");

    if (!name || !email) {
      alert("Please enter your name and email address.");
      return;
    }

    /* ── Uncomment to connect a real backend ──
    fetch('https://formspree.io/f/YOUR_FORM_ID', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        name:         name,
        organisation: document.getElementById('e-org').value.trim(),
        email:        email,
        phone:        document.getElementById('e-phone').value.trim(),
        service:      document.getElementById('e-service').value,
        message:      document.getElementById('e-msg').value.trim(),
      }),
    })
      .then(function (res) {
        if (!res.ok) throw new Error('Network error');
        window.FundingConnectApp.clearFields(['e-name', 'e-org', 'e-email', 'e-phone', 'e-service', 'e-msg']);
        window.FundingConnectApp.showSuccess('e-success');
      })
      .catch(function () {
        alert('Something went wrong. Please email us at hello@fundingconnect.com.au');
      });
    */

    window.FundingConnectApp.clearFields([
      "e-name",
      "e-org",
      "e-email",
      "e-phone",
      "e-service",
      "e-msg",
    ]);
    window.FundingConnectApp.showSuccess("e-success");
  }

  /**
   * TO CONNECT A REAL BACKEND:
   *   Mailchimp / ConvertKit / Vercel Serverless Function
   */
  function submitNewsletter() {
    var name = window.FundingConnectApp.getTrimmedValue("n-name");
    var email = window.FundingConnectApp.getTrimmedValue("n-email");

    if (!name || !email) {
      alert("Please enter your name and email address.");
      return;
    }

    /* ── Uncomment to connect a real backend ──
    fetch('/api/newsletter', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name:         name,
        email:        email,
        organisation: document.getElementById('n-org').value.trim(),
        state:        document.getElementById('n-state').value,
      }),
    })
      .then(function (res) {
        if (!res.ok) throw new Error('Network error');
        window.FundingConnectApp.clearFields(['n-name', 'n-email', 'n-org', 'n-state']);
        window.FundingConnectApp.showSuccess('n-success');
      })
      .catch(function () {
        alert('Something went wrong. Please try again later.');
      });
    */

    window.FundingConnectApp.clearFields(["n-name", "n-email", "n-org", "n-state"]);
    window.FundingConnectApp.showSuccess("n-success");
  }

  function initForms() {
    var enquiryBtn = document.querySelector('[data-submit-form="enquiry"]');
    var newsletterBtn = document.querySelector('[data-submit-form="newsletter"]');

    if (enquiryBtn) enquiryBtn.addEventListener("click", submitEnquiry);
    if (newsletterBtn) newsletterBtn.addEventListener("click", submitNewsletter);
  }

  window.submitEnquiry = submitEnquiry;
  window.submitNewsletter = submitNewsletter;
  window.FundingConnectApp.initForms = initForms;
})();
