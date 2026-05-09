/**
 * Shared component helpers.
 *
 * Keeps vanilla component files small without introducing a framework.
 */

"use strict";

window.FundingConnectComponents = window.FundingConnectComponents || {};

window.FundingConnectComponents.setHtml = function (targetId, html) {
  var target = document.getElementById(targetId);
  if (!target) return;
  target.innerHTML = html;
};

window.FundingConnectComponents.escapeHtml = function (str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
};
