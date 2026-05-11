/**
 * Connect page forms component.
 *
 * Renders the contact tabs and form panels from data/site-content.js.
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

    if (field.type === "hidden") {
      return [
        '<input',
        '  type="hidden"',
        '  name="' + escapeHtml(field.name) + '"',
        '  value="' + escapeHtml(field.value || "") + '"',
        "/>",
      ].join("\n");
    }

    if (field.type === "checkbox") {
      return [
        '<label class="checkbox-field" for="' + escapeHtml(field.id) + '">',
        '  <input id="' + escapeHtml(field.id) + '" type="checkbox" name="' + escapeHtml(field.name) + '"' + (field.required ? " required" : "") + " />",
        '  <span>' + escapeHtml(field.checkboxLabel || "") + "</span>",
        "</label>",
      ].join("\n");
    }

    if (field.type === "textarea") {
      return [
        '<textarea',
        '  id="' + escapeHtml(field.id) + '"',
        '  name="' + escapeHtml(field.name) + '"',
        '  placeholder="' + escapeHtml(field.placeholder || "") + '"',
        field.required ? "  required" : "",
        "></textarea>",
      ].join("\n");
    }

    if (field.type === "select") {
      return [
        '<select id="' + escapeHtml(field.id) + '" name="' + escapeHtml(field.name) + '"' + (field.required ? " required" : "") + ">",
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
    var isHidden = field.type === "hidden";
    var isCheckbox = field.type === "checkbox";

    if (isHidden) {
      return renderFieldControl(field);
    }

    return [
      '<div class="field' + (isCheckbox ? " field-checkbox" : "") + '">',
      isCheckbox
        ? '  <p class="field-label">' + escapeHtml(field.label) + renderRequiredMarker(field) + "</p>"
        : '  <label for="' + escapeHtml(field.id) + '">' + escapeHtml(field.label) + renderRequiredMarker(field) + "</label>",
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
    var extraContent = options && options.extraContent;
    var formAction = config.formAction || "";
    var formMethod = config.formMethod || "POST";
    var hasForm = Array.isArray(config.fields) && config.fields.length > 0;
    var noteText = (options && options.note) || config.note || "";
    var note = noteText ? '<p class="form-note">' + escapeHtml(noteText) + "</p>" : "";
    var submitButton =
      config.submitLabel
        ? '<button type="submit" class="' +
          escapeHtml(options.buttonClass) +
          '" aria-label="' +
          escapeHtml(config.submitAriaLabel || config.submitLabel) +
          '">' +
          escapeHtml(config.submitLabel) +
          "</button>"
        : "";
    var successMessage =
      config.successMessage
        ? '<div class="form-success-banner" id="' +
          escapeHtml(panelId + "-success-banner") +
          '" role="status" aria-live="polite">' +
          escapeHtml(config.successMessage) +
          "</div>"
        : "";
    var bodyContent = [
      extraContent || "",
      successMessage,
      (config.fields || []).map(renderField).join("\n"),
      note,
      submitButton,
    ]
      .filter(Boolean)
      .join("\n");

    return [
      '<div',
      '  id="tab-' + escapeHtml(panelId) + '"',
      '  class="tab-panel' + (isActive ? " active" : "") + '"',
      '  role="tabpanel"',
      '  aria-labelledby="tab-btn-' + escapeHtml(panelId) + '"',
      '>',
      hasForm
        ? [
            '<form class="contact-form" action="' + escapeHtml(formAction) + '" method="' + escapeHtml(formMethod) + '">',
            bodyContent,
            "</form>",
          ].join("\n")
        : bodyContent,
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
        }),
        renderPanel(newsletter, "newsletter", {
          buttonClass: "btn btn-gold btn-full",
          extraContent: newsletter.intro
            ? [
                '<p class="newsletter-intro">' + escapeHtml(newsletter.intro) + "</p>",
                '<div class="newsletter-embed-shell">',
                '  <div class="newsletter-placeholder">',
                "  <!-- Paste Mailchimp embedded signup form code here -->",
                '    <h3>' +
                  escapeHtml(newsletter.embedHeading || "Mailchimp embedded form") +
                  "</h3>",
                '    <p>' + escapeHtml(newsletter.embedBody || "") + "</p>",
                '    <div class="newsletter-embed-target">Mailchimp embed goes here</div>',
                "  </div>",
                "</div>",
              ].join("\n")
            : "",
        }),
        "</div>",
      ].join("\n"),
    );
  }

  document.addEventListener("DOMContentLoaded", renderContactForms);
})();
