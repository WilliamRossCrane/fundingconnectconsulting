/**
 * Funding Connect Consulting — script.js
 *
 * Responsibilities:
 *   - SPA-style page routing (showPage)
 *   - Connect page tab switching
 *   - Enquiry & newsletter form handling
 *   - Grants ticker (slider) population
 *   - Footer year auto-update
 *   - Mobile hamburger nav toggle
 *
 * Form backend notes:
 *   The enquiry and newsletter forms currently show a success message client-side
 *   only. To make them functional, connect them to a backend such as:
 *     - Formspree  → https://formspree.io  (easiest, no-code)
 *     - Vercel Serverless Function  → /api/enquiry.js or /api/newsletter.js
 *     - EmailJS  → https://www.emailjs.com
 *   See the submitEnquiry() and submitNewsletter() functions below for the
 *   placeholder fetch() calls you can wire up.
 */

"use strict";

/* ─────────────────────────────────────────────
   Page routing
───────────────────────────────────────────── */

/**
 * Show a named page and update the nav active state.
 * @param {string} pageId  One of: 'home' | 'about' | 'services' | 'connect'
 */
function showPage(pageId) {
  // Hide all pages
  document.querySelectorAll(".page").forEach(function (el) {
    el.classList.remove("active");
  });

  // Show the requested page
  var target = document.getElementById("page-" + pageId);
  if (target) {
    target.classList.add("active");
  }

  // Update nav link active state + aria-current
  document.querySelectorAll(".nav-links a").forEach(function (link) {
    link.classList.remove("active");
    link.removeAttribute("aria-current");
  });

  var activeLink = document.getElementById("nav-" + pageId);
  if (activeLink) {
    activeLink.classList.add("active");
    activeLink.setAttribute("aria-current", "page");
  }

  // Close mobile nav if open
  closeMobileNav();

  // Scroll to top
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ─────────────────────────────────────────────
   Tab switching (Connect page)
───────────────────────────────────────────── */

/**
 * Switch between the Enquiry and Newsletter tabs.
 * @param {string} tabId   One of: 'enquiry' | 'newsletter'
 * @param {HTMLElement} clickedBtn  The button that was clicked
 */
function switchTab(tabId, clickedBtn) {
  // Hide all tab panels
  document.querySelectorAll(".tab-panel").forEach(function (panel) {
    panel.classList.remove("active");
  });

  // Deactivate all tab buttons
  document.querySelectorAll(".tab-btn").forEach(function (btn) {
    btn.classList.remove("active");
    btn.setAttribute("aria-selected", "false");
  });

  // Activate the selected panel
  var panel = document.getElementById("tab-" + tabId);
  if (panel) {
    panel.classList.add("active");
  }

  // Activate the clicked button
  clickedBtn.classList.add("active");
  clickedBtn.setAttribute("aria-selected", "true");
}

/* ─────────────────────────────────────────────
   Form helpers
───────────────────────────────────────────── */

/**
 * Display a success message, then hide it after 5 seconds.
 * @param {string} elementId  ID of the .form-success element
 */
function showSuccess(elementId) {
  var el = document.getElementById(elementId);
  if (!el) return;
  el.style.display = "block";
  setTimeout(function () {
    el.style.display = "none";
  }, 5000);
}

/**
 * Clear a list of form field values.
 * @param {string[]} ids  Array of element IDs to reset
 */
function clearFields(ids) {
  ids.forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.value = "";
  });
}

/* ─────────────────────────────────────────────
   Enquiry form submission
───────────────────────────────────────────── */

/**
 * Handle the enquiry form submit button click.
 *
 * TO CONNECT A REAL BACKEND:
 *   1. Formspree (simplest):
 *      - Sign up at https://formspree.io, create a form, get your endpoint URL.
 *      - Replace the fetch() URL below with your Formspree endpoint.
 *      - Set method: 'POST' and pass a FormData or JSON body.
 *
 *   2. Vercel Serverless Function:
 *      - Create /api/enquiry.js in your project.
 *      - Change the fetch URL to '/api/enquiry'.
 *      - The function receives the POST body and forwards it (e.g. via SendGrid/Resend).
 */
function submitEnquiry() {
  var name = document.getElementById("e-name").value.trim();
  var email = document.getElementById("e-email").value.trim();

  if (!name || !email) {
    alert("Please enter your name and email address.");
    return;
  }

  /* ── Uncomment and configure to connect a real backend ──
  var payload = {
    name:         name,
    organisation: document.getElementById('e-org').value.trim(),
    email:        email,
    phone:        document.getElementById('e-phone').value.trim(),
    service:      document.getElementById('e-service').value,
    message:      document.getElementById('e-msg').value.trim(),
  };

  fetch('https://formspree.io/f/YOUR_FORM_ID', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body:    JSON.stringify(payload),
  })
    .then(function (res) {
      if (!res.ok) throw new Error('Network error');
      clearFields(['e-name', 'e-org', 'e-email', 'e-phone', 'e-service', 'e-msg']);
      showSuccess('e-success');
    })
    .catch(function () {
      alert('Something went wrong. Please try emailing us directly at hello@fundingconnect.com.au');
    });
  */

  // ── Placeholder behaviour (remove once real backend is wired up) ──
  clearFields(["e-name", "e-org", "e-email", "e-phone", "e-service", "e-msg"]);
  showSuccess("e-success");
}

/* ─────────────────────────────────────────────
   Newsletter form submission
───────────────────────────────────────────── */

/**
 * Handle the newsletter subscribe button click.
 *
 * TO CONNECT A REAL BACKEND:
 *   - Mailchimp: use their embedded form or the Mailchimp API.
 *   - ConvertKit: POST to their subscribe endpoint.
 *   - Vercel Serverless Function: /api/newsletter.js
 */
function submitNewsletter() {
  var name = document.getElementById("n-name").value.trim();
  var email = document.getElementById("n-email").value.trim();

  if (!name || !email) {
    alert("Please enter your name and email address.");
    return;
  }

  /* ── Uncomment and configure to connect a real backend ──
  var payload = {
    name:         name,
    email:        email,
    organisation: document.getElementById('n-org').value.trim(),
    state:        document.getElementById('n-state').value,
  };

  fetch('/api/newsletter', {         // or your Mailchimp/ConvertKit endpoint
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(payload),
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

  // ── Placeholder behaviour ──
  clearFields(["n-name", "n-email", "n-org", "n-state"]);
  showSuccess("n-success");
}

/* ─────────────────────────────────────────────
   Grants slider
───────────────────────────────────────────── */

/**
 * Grant opportunity data.
 * Update these entries whenever new grants are available.
 * Dates have been set to 2026 so the page doesn't appear expired.
 */
var GRANTS = [
  {
    cat: "Health & Wellbeing",
    title: "Indigenous Health & Wellbeing Fund",
    amount: "Up to $150,000",
    close: "Closes 30 Jun 2026",
  },
  {
    cat: "Education",
    title: "First Nations Education Support Grants",
    amount: "Up to $80,000",
    close: "Closes 15 Jul 2026",
  },
  {
    cat: "Economic Development",
    title: "Indigenous Business Australia – Growth Fund",
    amount: "$50,000 – $500,000",
    close: "Open rolling",
  },
  {
    cat: "Housing",
    title: "Remote Housing Infrastructure Program",
    amount: "Up to $2,000,000",
    close: "Closes 1 Aug 2026",
  },
  {
    cat: "Culture & Arts",
    title: "AIATSIS Community Heritage Grants",
    amount: "Up to $30,000",
    close: "Closes 20 Jul 2026",
  },
  {
    cat: "Youth",
    title: "Strong Communities Youth Development",
    amount: "Up to $120,000",
    close: "Closes 31 Aug 2026",
  },
  {
    cat: "Environment",
    title: "Land & Sea Country Ranger Program",
    amount: "Up to $250,000",
    close: "Open rolling",
  },
  {
    cat: "Governance",
    title: "Governance & Capability Support Fund",
    amount: "Up to $60,000",
    close: "Closes 14 Sep 2026",
  },
];

/**
 * Build the grants slider by duplicating the cards for a seamless loop.
 */
function buildGrantsSlider() {
  var track = document.getElementById("grants-track");
  if (!track) return;

  // Duplicate the list so the CSS animation creates a seamless infinite loop
  var allGrants = GRANTS.concat(GRANTS);

  track.innerHTML = allGrants
    .map(function (g) {
      return [
        '<article class="grant-card" role="listitem">',
        '  <p class="grant-cat">' + escapeHtml(g.cat) + "</p>",
        '  <p class="grant-title">' + escapeHtml(g.title) + "</p>",
        '  <p class="grant-amount">' + escapeHtml(g.amount) + "</p>",
        '  <p class="grant-close">' + escapeHtml(g.close) + "</p>",
        "</article>",
      ].join("\n");
    })
    .join("");
}

/**
 * Basic HTML-escape to avoid XSS when inserting data into innerHTML.
 * @param {string} str
 * @returns {string}
 */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/* ─────────────────────────────────────────────
   Footer year
───────────────────────────────────────────── */

/**
 * Keep the footer copyright year current automatically.
 */
function setFooterYear() {
  var el = document.getElementById("footer-year");
  if (el) {
    el.textContent = new Date().getFullYear();
  }
}

/* ─────────────────────────────────────────────
   Mobile hamburger nav
───────────────────────────────────────────── */

/**
 * Close the mobile nav drawer.
 */
function closeMobileNav() {
  var toggle = document.getElementById("nav-toggle");
  var navLinks = document.getElementById("nav-links");
  if (!toggle || !navLinks) return;
  toggle.classList.remove("open");
  navLinks.classList.remove("open");
  toggle.setAttribute("aria-expanded", "false");
}

/**
 * Initialise the mobile hamburger toggle.
 * Opens/closes the nav drawer; also closes on outside tap or Escape key.
 */
function initMobileNav() {
  var toggle = document.getElementById("nav-toggle");
  var navLinks = document.getElementById("nav-links");
  if (!toggle || !navLinks) return;

  toggle.addEventListener("click", function () {
    var isOpen = navLinks.classList.contains("open");
    if (isOpen) {
      closeMobileNav();
    } else {
      toggle.classList.add("open");
      navLinks.classList.add("open");
      toggle.setAttribute("aria-expanded", "true");
    }
  });

  // Close on outside tap
  document.addEventListener("click", function (e) {
    if (!toggle.contains(e.target) && !navLinks.contains(e.target)) {
      closeMobileNav();
    }
  });

  // Close on Escape key
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeMobileNav();
  });
}

/* ─────────────────────────────────────────────
   Initialise on DOM ready
───────────────────────────────────────────── */
document.addEventListener("DOMContentLoaded", function () {
  buildGrantsSlider();
  setFooterYear();
  initMobileNav();
});
