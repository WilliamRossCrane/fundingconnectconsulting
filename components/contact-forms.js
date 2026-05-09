/**
 * Connect page forms component.
 *
 * Renders the contact tabs and form panels from data/site-content.js while
 * preserving the field IDs used by scripts/forms.js.
 */

"use strict";

(function () {
  function renderRequiredMarker(field) {
    if (!field.required) return "";
    return ' <span aria-label="required">*</span>';
  }

  function renderOptions(field) {
    var escapeHtml = window.FundingConnectComponents.escapeHtml;
    var options = field.options || [];

    return [
      '<option value="">' + escapeHtml(field.placeholder || "Select...") + "</option>",
      options
        .map(function (option) {
          return (
            '<option value="' +
            escapeHtml(option.value) +
            '">' +
            escapeHtml(option.label) +
            "</option>"
          );
        })
        .join("\n"),
    ].join("\n");
  }

  function renderFieldControl(field) {
    var escapeHtml = window.FundingConnectComponents.escapeHtml;

    if (field.type === "textarea") {
      return [
        '<textarea',
        '  id="' + escapeHtml(field.id) + '"',
        '  name="' + escapeHtml(field.name) + '"',
        '  placeholder="' + escapeHtml(field.placeholder || "") + '"',
        "></textarea>",
      ].join("\n");
    }

    if (field.type === "select") {
      return [
        '<select id="' + escapeHtml(field.id) + '" name="' + escapeHtml(field.name) + '">',
        renderOptions(field),
        "</select>",
      ].join("\n");
    }

    return [
      '<input',
      '  id="' + escapeHtml(field.id) + '"',
      '  type="' + escapeHtml(field.type || "text") + '"',
      '  name="' + escapeHtml(field.name) + '"',
      '  placeholder="' + escapeHtml(field.placeholder || "") + '"',
      field.autocomplete
        ? '  autocomplete="' + escapeHtml(field.autocomplete) + '"'
        : "",
      field.required ? "  required" : "",
      "/>",
    ]
      .filter(Boolean)
      .join("\n");
  }

  function renderField(field) {
    var escapeHtml = window.FundingConnectComponents.escapeHtml;

    return [
      '<div class="field">',
      '  <label for="' + escapeHtml(field.id) + '">',
      "    " + escapeHtml(field.label) + renderRequiredMarker(field),
      "  </label>",
      renderFieldControl(field),
      "</div>",
    ].join("\n");
  }

  function renderTabs(config) {
    var escapeHtml = window.FundingConnectComponents.escapeHtml;
    var tabs = config.tabs || [];

    return [
      '<div class="tabs" role="tablist" aria-label="' +
        escapeHtml(config.tabsAriaLabel || "Contact form options") +
        '">',
      tabs
        .map(function (tab, index) {
          var isActive = index === 0;
          return [
            '<button',
            '  class="tab-btn' + (isActive ? " active" : "") + '"',
            '  role="tab"',
            '  id="tab-btn-' + escapeHtml(tab.id) + '"',
            '  aria-selected="' + (isActive ? "true" : "false") + '"',
            '  aria-controls="tab-' + escapeHtml(tab.id) + '"',
            '  data-tab="' + escapeHtml(tab.id) + '"',
            '>',
            "  " + escapeHtml(tab.label),
            "</button>",
          ].join("\n");
        })
        .join("\n"),
      "</div>",
    ].join("\n");
  }

  function renderPanel(config, panelId, options) {
    var escapeHtml = window.FundingConnectComponents.escapeHtml;
    var isActive = options && options.active;
    var buttonClass = options && options.buttonClass;
    var submitForm = options && options.submitForm;
    var extraContent = options && options.extraContent;

    return [
      '<div',
      '  id="tab-' + escapeHtml(panelId) + '"',
      '  class="tab-panel' + (isActive ? " active" : "") + '"',
      '  role="tabpanel"',
      '  aria-labelledby="tab-btn-' + escapeHtml(panelId) + '"',
      '>',
      extraContent || "",
      (config.fields || []).map(renderField).join("\n"),
      options && options.note ? '<p class="form-note">' + escapeHtml(options.note) + "</p>" : "",
      '<button type="button" class="' +
        escapeHtml(buttonClass) +
        '" data-submit-form="' +
        escapeHtml(submitForm) +
        '" aria-label="' +
        escapeHtml(config.submitAriaLabel) +
        '">',
      "  " + escapeHtml(config.submitLabel),
      "</button>",
      '<div class="form-success" id="' +
        escapeHtml(panelId === "enquiry" ? "e-success" : "n-success") +
        '" role="alert" aria-live="polite">',
      "  " + escapeHtml(config.successMessage),
      "</div>",
      "</div>",
    ]
      .filter(Boolean)
      .join("\n");
  }

  function renderContactForms() {
    var config = window.FCC_CONTENT.contactForms || {};
    var escapeHtml = window.FundingConnectComponents.escapeHtml;
    var newsletter = config.newsletter || {};

    window.FundingConnectComponents.setHtml(
      "contact-forms-placeholder",
      [
        '<div class="connect-right">',
        renderTabs(config),
        renderPanel(config.enquiry || {}, "enquiry", {
          active: true,
          buttonClass: "btn btn-deep btn-full",
          submitForm: "enquiry",
        }),
        renderPanel(newsletter, "newsletter", {
          buttonClass: "btn btn-gold btn-full",
          submitForm: "newsletter",
          extraContent: newsletter.intro
            ? '<p class="newsletter-intro">' + escapeHtml(newsletter.intro) + "</p>"
            : "",
          note: newsletter.note,
        }),
        "</div>",
      ].join("\n"),
    );
  }

  document.addEventListener("DOMContentLoaded", renderContactForms);
})();
