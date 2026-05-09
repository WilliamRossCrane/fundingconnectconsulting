/**
 * Funding Connect Consulting — script.js
 *
 * Responsibilities:
 *   - SPA page routing (showPage)
 *   - Connect page tab switching
 *   - Enquiry & newsletter form handling
 *
 * Note: navbar, footer year, mobile nav toggle, and the welcome popup
 * are each handled by their own files in /components/.
 */

"use strict";

/* ─────────────────────────────────────────────
   Page routing
───────────────────────────────────────────── */

/**
 * Show a named page.
 * @param {string} pageId  'home' | 'about' | 'services' | 'connect'
 */
function showPage(pageId) {
  // Hide all pages
  document.querySelectorAll(".page").forEach(function (el) {
    el.classList.remove("active");
  });

  // Show requested page
  var target = document.getElementById("page-" + pageId);
  if (target) target.classList.add("active");

  // Delegate active link state to navbar component
  if (typeof window.setActiveNavLink === "function") {
    window.setActiveNavLink(pageId);
  }

  // Scroll to top
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ─────────────────────────────────────────────
   Tab switching (Connect page)
───────────────────────────────────────────── */

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

  clickedBtn.classList.add("active");
  clickedBtn.setAttribute("aria-selected", "true");
}

/* ─────────────────────────────────────────────
   Form helpers
───────────────────────────────────────────── */

function showSuccess(elementId) {
  var el = document.getElementById(elementId);
  if (!el) return;
  el.style.display = "block";
  setTimeout(function () {
    el.style.display = "none";
  }, 5000);
}

function clearFields(ids) {
  ids.forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.value = "";
  });
}

/* ─────────────────────────────────────────────
   Enquiry form
───────────────────────────────────────────── */

/**
 * TO CONNECT A REAL BACKEND:
 *   Formspree — replace the fetch URL with your Formspree endpoint.
 *   Vercel    — POST to /api/enquiry.js
 *   EmailJS   — https://www.emailjs.com
 */
function submitEnquiry() {
  var name = document.getElementById("e-name").value.trim();
  var email = document.getElementById("e-email").value.trim();

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
      clearFields(['e-name', 'e-org', 'e-email', 'e-phone', 'e-service', 'e-msg']);
      showSuccess('e-success');
    })
    .catch(function () {
      alert('Something went wrong. Please email us at hello@fundingconnect.com.au');
    });
  */

  clearFields(["e-name", "e-org", "e-email", "e-phone", "e-service", "e-msg"]);
  showSuccess("e-success");
}

/* ─────────────────────────────────────────────
   Newsletter form
───────────────────────────────────────────── */

/**
 * TO CONNECT A REAL BACKEND:
 *   Mailchimp / ConvertKit / Vercel Serverless Function
 */
function submitNewsletter() {
  var name = document.getElementById("n-name").value.trim();
  var email = document.getElementById("n-email").value.trim();

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
      clearFields(['n-name', 'n-email', 'n-org', 'n-state']);
      showSuccess('n-success');
    })
    .catch(function () {
      alert('Something went wrong. Please try again later.');
    });
  */

  clearFields(["n-name", "n-email", "n-org", "n-state"]);
  showSuccess("n-success");
}
