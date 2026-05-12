/**
 * Funding Connect Consulting — forms.js
 *
 * Static form helpers for Formspree and embedded Mailchimp signup content.
 */

"use strict";

(function () {
  function setStatusMessage(element, message, state) {
    if (!element) return;

    element.textContent = message || "";
    element.classList.remove("is-success", "is-error", "is-pending");

    if (state) {
      element.classList.add(state);
    }
  }

  function initContactForm() {
    var contactForm = document.getElementById("contact-form");
    var contactStatus = document.getElementById("contact-form-status");

    if (!contactForm) return;

    contactForm.addEventListener("submit", async function (event) {
      event.preventDefault();

      var submitButton = contactForm.querySelector("button[type='submit']");
      var formData = new FormData(contactForm);
      var successMessage =
        contactForm.getAttribute("data-success-message") ||
        "Thanks! Your enquiry has been sent.";

      setStatusMessage(contactStatus, "Sending...", "is-pending");

      if (submitButton) {
        submitButton.disabled = true;
      }

      try {
        var response = await fetch(contactForm.action, {
          method: contactForm.method || "POST",
          body: formData,
          headers: {
            Accept: "application/json",
          },
        });

        if (response.ok) {
          setStatusMessage(contactStatus, successMessage, "is-success");
          contactForm.reset();
        } else {
          setStatusMessage(
            contactStatus,
            "Something went wrong. Please try again.",
            "is-error"
          );
        }
      } catch (error) {
        setStatusMessage(
          contactStatus,
          "Something went wrong. Please try again.",
          "is-error"
        );
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
        }
      }
    });
  }

  function buildMailchimpJsonpUrl(actionUrl) {
    var normalizedUrl = actionUrl.replace(
      "/subscribe/post?",
      "/subscribe/post-json?"
    );

    if (!/([?&])c=\?/.test(normalizedUrl)) {
      normalizedUrl += normalizedUrl.indexOf("?") === -1 ? "?c=?" : "&c=?";
    }

    return normalizedUrl;
  }

  function setMailchimpNodeState(node, message, state, allowHtml) {
    if (!node) return;

    node.style.display = message ? "block" : "none";
    node.classList.remove("is-pending", "is-success", "is-error");

    if (state) {
      node.classList.add(state);
    }

    if (allowHtml) {
      node.innerHTML = message || "";
    } else {
      node.textContent = message || "";
    }
  }

  function setMailchimpResponse(successNode, errorNode, message, state) {
    if (successNode) {
      setMailchimpNodeState(
        successNode,
        state === "is-success" || state === "is-pending" ? message : "",
        state,
        false
      );
    }

    if (errorNode) {
      setMailchimpNodeState(
        errorNode,
        state === "is-error" ? message : "",
        state,
        false
      );
    }
  }

  function initMailchimpForm() {
    var mailchimpForm = document.getElementById("mc-embedded-subscribe-form");

    if (!mailchimpForm) return;

    var successNode = document.getElementById("mce-success-response");
    var errorNode = document.getElementById("mce-error-response");

    mailchimpForm.addEventListener("submit", function (event) {
      event.preventDefault();

      var submitButton = mailchimpForm.querySelector(
        "button[type='submit'], input[type='submit']"
      );
      var formData = new FormData(mailchimpForm);
      var callbackName = "mailchimpCallback_" + Date.now();
      var script = document.createElement("script");
      var timeoutId;
      var actionUrl = buildMailchimpJsonpUrl(
        mailchimpForm.getAttribute("action") || ""
      );
      var params = new URLSearchParams(formData).toString();

      // Mailchimp embedded forms require the post-json endpoint because a static
      // site cannot submit cross-origin AJAX directly to the normal post URL.
      // JSONP works here by letting Mailchimp return a script callback instead.
      setMailchimpResponse(
        successNode,
        errorNode,
        "Subscribing...",
        "is-pending"
      );

      if (submitButton) {
        submitButton.disabled = true;
      }

      window[callbackName] = function (response) {
        window.clearTimeout(timeoutId);

        if (response && response.result === "success") {
          setMailchimpResponse(
            successNode,
            errorNode,
            "Thanks! Please check your email to confirm your subscription.",
            "is-success"
          );
          mailchimpForm.reset();
        } else {
          setMailchimpResponse(
            successNode,
            errorNode,
            (response && response.msg) ||
              "Something went wrong. Please try again.",
            "is-error"
          );
        }

        if (submitButton) {
          submitButton.disabled = false;
        }

        delete window[callbackName];
        script.remove();
      };

      timeoutId = window.setTimeout(function () {
        setMailchimpResponse(
          successNode,
          errorNode,
          "Something went wrong. Please try again.",
          "is-error"
        );

        if (submitButton) {
          submitButton.disabled = false;
        }

        delete window[callbackName];
        script.remove();
      }, 10000);

      script.src =
        actionUrl.replace("c=?", "c=" + callbackName) +
        (params ? "&" + params : "");
      script.async = true;
      document.body.appendChild(script);
    });
  }

  function initForms() {
    initContactForm();
    initMailchimpForm();
  }

  window.FundingConnectApp.initForms = initForms;
})();
