/**
 * Funding Connect Consulting — utils.js
 *
 * Shared helpers used by app behaviour files.
 */

"use strict";

window.FundingConnectApp = window.FundingConnectApp || {};

window.FundingConnectApp.getTrimmedValue = function (elementId) {
  var el = document.getElementById(elementId);
  return el ? el.value.trim() : "";
};

window.FundingConnectApp.showSuccess = function (elementId) {
  var el = document.getElementById(elementId);
  if (!el) return;

  el.style.display = "block";

  setTimeout(function () {
    el.style.display = "none";
  }, 5000);
};

window.FundingConnectApp.clearFields = function (ids) {
  ids.forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.value = "";
  });
};
