"use strict";

(function () {
  var NEWSLETTER_EMBED_HTML = [
    '<div id="mc_embed_shell" class="newsletter-mailchimp">',
    "  <form",
    '    action="https://gmail.us4.list-manage.com/subscribe/post?u=3fddf78ceebabcd47064a1292&amp;id=4220c7f815&amp;f_id=00f4a7e2f0"',
    '    method="post"',
    '    id="mc-embedded-subscribe-form"',
    '    name="mc-embedded-subscribe-form"',
    '    class="newsletter-mailchimp-form"',
    "    novalidate",
    "  >",
    '    <div class="newsletter-mailchimp-grid">',
    '      <div class="mc-field-group">',
    '        <label for="mce-EMAIL">Email Address <span aria-hidden="true">*</span></label>',
    '        <input type="email" name="EMAIL" class="required email" id="mce-EMAIL" required value="" />',
    "      </div>",
    '      <div class="mc-field-group">',
    '        <label for="mce-FNAME">First Name <span aria-hidden="true">*</span></label>',
    '        <input type="text" name="FNAME" class="required text" id="mce-FNAME" required value="" />',
    "      </div>",
    '      <div class="mc-field-group newsletter-mailchimp-full">',
    '        <label for="mce-COMPANY">Organisation Name</label>',
    '        <input type="text" name="COMPANY" class="text" id="mce-COMPANY" value="" />',
    "      </div>",
    "    </div>",
    '    <div id="mce-responses" class="clear foot">',
    '      <div class="response" id="mce-error-response" style="display: none;"></div>',
    '      <div class="response" id="mce-success-response" style="display: none;"></div>',
    "    </div>",
    '    <div aria-hidden="true" class="newsletter-honeypot">',
    '      <input type="text" name="b_3fddf78ceebabcd47064a1292_4220c7f815" tabindex="-1" value="" />',
    "    </div>",
    '    <div class="newsletter-mailchimp-actions">',
    '      <input type="submit" name="subscribe" id="mc-embedded-subscribe" class="btn btn-gold" value="Subscribe" />',
    "    </div>",
    "  </form>",
    "</div>",
  ].join("\n");

  var contactIcons = {
    email: [
      '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" focusable="false">',
      '  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="#0E4D57" stroke-width="2" />',
      '  <polyline points="22,6 12,13 2,6" stroke="#0E4D57" stroke-width="2" />',
      "</svg>",
    ].join("\n"),
    phone: [
      '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" focusable="false">',
      '  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.42 2 2 0 0 1 3.58 1.25h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.82a16 16 0 0 0 6.29 6.29l1.13-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" stroke="#0E4D57" stroke-width="2" />',
      "</svg>",
    ].join("\n"),
    location: [
      '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" focusable="false">',
      '  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="#0E4D57" stroke-width="2" />',
      '  <circle cx="12" cy="10" r="3" stroke="#0E4D57" stroke-width="2" />',
      "</svg>",
    ].join("\n"),
  };

  function renderRequiredMarker(field) {
    if (!field.required) return "";
    return ' <span aria-label="required">*</span>';
  }

  function renderOptions(field) {
    var escapeHtml = window.FundingConnectComponents.escapeHtml;
    var options = field.options || [];

    return [
      '<option value="">' +
        escapeHtml(field.placeholder || "Select...") +
        "</option>",
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
        "<input",
        '  type="hidden"',
        '  name="' + escapeHtml(field.name) + '"',
        '  value="' + escapeHtml(field.value || "") + '"',
        "/>",
      ].join("\n");
    }

    if (field.type === "checkbox") {
      return [
        '<label class="checkbox-field" for="' + escapeHtml(field.id) + '">',
        '  <input id="' +
          escapeHtml(field.id) +
          '" type="checkbox" name="' +
          escapeHtml(field.name) +
          '"' +
          (field.required ? " required" : "") +
          " />",
        "  <span>" + escapeHtml(field.checkboxLabel || "") + "</span>",
        "</label>",
      ].join("\n");
    }

    if (field.type === "textarea") {
      return [
        "<textarea",
        '  id="' + escapeHtml(field.id) + '"',
        '  name="' + escapeHtml(field.name) + '"',
        '  placeholder="' + escapeHtml(field.placeholder || "") + '"',
        field.required ? "  required" : "",
        "></textarea>",
      ].join("\n");
    }

    if (field.type === "select") {
      return [
        '<select id="' +
          escapeHtml(field.id) +
          '" name="' +
          escapeHtml(field.name) +
          '"' +
          (field.required ? " required" : "") +
          ">",
        renderOptions(field),
        "</select>",
      ].join("\n");
    }

    return [
      "<input",
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
      '<div class="field field-type-' +
        escapeHtml(field.type || "text") +
        (isCheckbox ? " field-checkbox" : "") +
        '">',
      isCheckbox
        ? '  <p class="field-label">' +
          escapeHtml(field.label) +
          renderRequiredMarker(field) +
          "</p>"
        : '  <label for="' +
          escapeHtml(field.id) +
          '">' +
          escapeHtml(field.label) +
          renderRequiredMarker(field) +
          "</label>",
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
            "<button",
            '  class="tab-btn' + (isActive ? " active" : "") + '"',
            '  role="tab"',
            '  id="tab-btn-' + escapeHtml(tab.id) + '"',
            '  aria-selected="' + (isActive ? "true" : "false") + '"',
            '  aria-controls="tab-' + escapeHtml(tab.id) + '"',
            '  data-tab="' + escapeHtml(tab.id) + '"',
            ">",
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
    var contentWrapperClass = options && options.contentWrapperClass;
    var fieldsWrapperClass = options && options.fieldsWrapperClass;
    var formAction = config.formAction || "";
    var formMethod = config.formMethod || "POST";
    var hasForm = Array.isArray(config.fields) && config.fields.length > 0;
    var formId = panelId === "enquiry" ? ' id="contact-form"' : "";
    var statusMarkup =
      panelId === "enquiry"
        ? '<p id="contact-form-status" class="form-status" aria-live="polite"></p>'
        : "";
    var noteText = (options && options.note) || config.note || "";
    var note = noteText
      ? '<p class="form-note">' + escapeHtml(noteText) + "</p>"
      : "";
    var submitButton = config.submitLabel
      ? '<button type="submit" class="' +
        escapeHtml(options.buttonClass) +
        '" aria-label="' +
        escapeHtml(config.submitAriaLabel || config.submitLabel) +
        '">' +
        escapeHtml(config.submitLabel) +
        "</button>"
      : "";
    var bodyContent = [
      contentWrapperClass
        ? '<div class="' + escapeHtml(contentWrapperClass) + '">'
        : "",
      extraContent || "",
      fieldsWrapperClass
        ? '<div class="' + escapeHtml(fieldsWrapperClass) + '">'
        : "",
      (config.fields || []).map(renderField).join("\n"),
      fieldsWrapperClass ? "</div>" : "",
      note,
      submitButton,
      statusMarkup,
      contentWrapperClass ? "</div>" : "",
    ]
      .filter(Boolean)
      .join("\n");

    return [
      "<div",
      '  id="tab-' + escapeHtml(panelId) + '"',
      '  class="tab-panel' + (isActive ? " active" : "") + '"',
      '  role="tabpanel"',
      '  aria-labelledby="tab-btn-' + escapeHtml(panelId) + '"',
      ">",
      hasForm
        ? [
            '<form class="contact-form"' +
              formId +
              ' action="' +
              escapeHtml(formAction) +
              '" method="' +
              escapeHtml(formMethod) +
              '" data-success-message="' +
              escapeHtml(config.successMessage || "") +
              '">',
            bodyContent,
            "</form>",
          ].join("\n")
        : bodyContent,
      "</div>",
    ]
      .filter(Boolean)
      .join("\n");
  }

  function renderContactValue(item) {
    var escapeHtml = window.FundingConnectComponents.escapeHtml;

    if (item.href) {
      return (
        '<a href="' +
        escapeHtml(item.href) +
        '">' +
        escapeHtml(item.value) +
        "</a>"
      );
    }

    return "<span>" + escapeHtml(item.value) + "</span>";
  }

  function renderContactItem(item) {
    var escapeHtml = window.FundingConnectComponents.escapeHtml;

    return [
      '<li class="info-item">',
      '  <span class="info-icon" aria-hidden="true">',
      contactIcons[item.icon] || "",
      "  </span>",
      '  <div class="info-text">',
      "    <strong>" + escapeHtml(item.label) + "</strong>",
      "    " + renderContactValue(item),
      "  </div>",
      "</li>",
    ].join("\n");
  }

  function renderContactIntro() {
    var content = window.FCC_CONTENT.contactIntro;
    var escapeHtml = window.FundingConnectComponents.escapeHtml;
    if (!content) return;

    window.FundingConnectComponents.setHtml(
      "connect-intro-placeholder",
      [
        "<h2>" + escapeHtml(content.heading) + "</h2>",
        content.text ? "<p>" + escapeHtml(content.text) + "</p>" : "",
      ].join("\n")
    );
  }

  function renderContactInfo() {
    var contactInfo = window.FCC_CONTENT.contactInfo || [];

    window.FundingConnectComponents.setHtml(
      "contact-info-placeholder",
      [
        '<ul class="info-list" role="list">',
        contactInfo.map(renderContactItem).join("\n"),
        "</ul>",
      ].join("\n")
    );
  }

  function renderConnectAcknowledgement() {
    var acknowledgements = window.FCC_CONTENT.acknowledgements || {};
    var escapeHtml = window.FundingConnectComponents.escapeHtml;

    window.FundingConnectComponents.setHtml(
      "connect-acknowledgement-placeholder",
      [
        '<aside class="ack-small" aria-label="Acknowledgement of Country">',
        "  <strong>" +
          escapeHtml(acknowledgements.title || "Acknowledgement of Country") +
          "</strong>",
        "  <p>",
        "    " + escapeHtml(acknowledgements.short || ""),
        "  </p>",
        "</aside>",
      ].join("\n")
    );
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
          buttonClass: "btn btn-gold btn-full",
          contentWrapperClass: "form-panel-shell enquiry-panel-shell",
          extraContent: [
            '  <div class="form-panel-copy">',
            "    <h3>" +
              escapeHtml(
                (config.enquiry || {}).embedHeading || "Start your enquiry"
              ) +
              "</h3>",
            "    <p>" +
              escapeHtml(
                (config.enquiry || {}).embedBody ||
                  "Tell us a little about the support you need and we will get back to you."
              ) +
              "</p>",
            "  </div>",
          ].join("\n"),
          fieldsWrapperClass: "contact-form-grid",
          note: (config.enquiry || {}).note,
        }),
        renderPanel(newsletter, "newsletter", {
          buttonClass: "btn btn-gold btn-full",
          extraContent: newsletter.intro
            ? [
                '<div class="form-panel-shell newsletter-embed-shell">',
                '  <div class="form-panel-copy newsletter-placeholder">',
                "    <h3>" +
                  escapeHtml(
                    newsletter.embedHeading || "Mailchimp embedded form"
                  ) +
                  "</h3>",
                "    <p>" + escapeHtml(newsletter.embedBody || "") + "</p>",
                "  </div>",
                NEWSLETTER_EMBED_HTML,
                "</div>",
              ].join("\n")
            : "",
        }),
        "</div>",
      ].join("\n")
    );
  }

  function init() {
    renderContactIntro();
    renderContactInfo();
    renderConnectAcknowledgement();
    renderContactForms();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
