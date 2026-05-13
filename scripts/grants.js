"use strict";

(function () {
  var GRANTS_PATH = "./data/grants.json";
  var MAX_GRANTS = 6;

  function escapeHtml(value) {
    return window.FundingConnectComponents.escapeHtml(value || "");
  }

  function normalizeWhitespace(value) {
    return String(value || "").replace(/\s+/g, " ").trim();
  }

  function stripGoId(title) {
    return normalizeWhitespace(title).replace(/^GO\d+\s*:\s*/i, "").trim();
  }

  function formatCloseDate(grant) {
    if (grant.closeDateText) {
      return grant.closeDateText;
    }

    if (grant.closeDate) {
      var parsed = new Date(grant.closeDate);

      if (!Number.isNaN(parsed.getTime())) {
        return parsed.toLocaleDateString("en-AU", {
          day: "numeric",
          month: "short",
          year: "numeric",
        });
      }
    }

    return "Check official page";
  }

  function inferCategory(grant) {
    var explicitCategory = normalizeWhitespace(grant.category);

    if (explicitCategory) {
      return explicitCategory;
    }

    var text = [grant.title, grant.summary].join(" ").toLowerCase();
    var categoryRules = [
      { label: "Indigenous Programs", match: /indigenous|aboriginal|torres strait|first nations/ },
      { label: "Community Development", match: /community|capacity building|social support/ },
      { label: "Small Business", match: /small business|business|enterprise|economic/ },
      { label: "Arts & Culture", match: /arts|culture|museum|heritage/ },
      { label: "Regional Support", match: /regional|remote|queensland/ },
      { label: "Health & Wellbeing", match: /health|healing|wellbeing|mental health/ },
      { label: "Education & Training", match: /education|training|school|youth/ },
      { label: "Multicultural Communities", match: /multicultural|diverse|diaspora/ },
    ];

    for (var i = 0; i < categoryRules.length; i += 1) {
      if (categoryRules[i].match.test(text)) {
        return categoryRules[i].label;
      }
    }

    return "Grant Opportunity";
  }

  function inferFundingAmount(summary) {
    var text = normalizeWhitespace(summary);
    var patterns = [
      /\bup to \$[\d,.]+(?:\s*(?:million|billion|thousand))?\b/i,
      /\bfrom \$[\d,.]+(?:\s*(?:million|billion|thousand))?\s+to \$[\d,.]+(?:\s*(?:million|billion|thousand))?\b/i,
      /\$\s?[\d,.]+(?:\s*(?:million|billion|thousand))?\s*(?:-|to)\s*\$?\s?[\d,.]+(?:\s*(?:million|billion|thousand))?\b/i,
      /\btotal funding of up to \$[\d,.]+(?:\s*(?:million|billion|thousand))?\b/i,
      /\bgrants? (?:between|from) \$[\d,.]+(?:\s*(?:million|billion|thousand))?\s+(?:and|to)\s+\$[\d,.]+(?:\s*(?:million|billion|thousand))?\b/i,
    ];

    for (var i = 0; i < patterns.length; i += 1) {
      var match = text.match(patterns[i]);

      if (match) {
        return match[0].replace(/\s+/g, " ").trim();
      }
    }

    return "Funding available";
  }

  function hasUsableLink(grant) {
    return /^https?:\/\//i.test(normalizeWhitespace(grant.link));
  }

  function renderGrantCard(grant) {
    var title = stripGoId(grant.title) || "Grant opportunity";
    var link = hasUsableLink(grant) ? grant.link : "#";
    var tagName = hasUsableLink(grant) ? "a" : "article";
    var cardAttributes = hasUsableLink(grant)
      ? ' class="grant-card grant-card-link" role="listitem" href="' +
        escapeHtml(link) +
        '" target="_blank" rel="noopener noreferrer" aria-label="View official grant: ' +
        escapeHtml(title) +
        '"'
      : ' class="grant-card grant-card-fallback" role="listitem"';

    return [
      "<" + tagName + cardAttributes + ">",
      '  <p class="grant-cat">' + escapeHtml(inferCategory(grant)) + "</p>",
      '  <h3 class="grant-title">' + escapeHtml(title) + "</h3>",
      '  <p class="grant-amount">' + escapeHtml(inferFundingAmount(grant.summary)) + "</p>",
      '  <p class="grant-close">Closes: ' + escapeHtml(formatCloseDate(grant)) + "</p>",
      '  <span class="grant-link">View official grant</span>',
      "</" + tagName + ">",
    ].join("\n");
  }

  function renderFallback(message) {
    return [
      '<article class="grant-card grant-card-fallback" role="listitem">',
      '  <p class="grant-cat">Grant Updates</p>',
      '  <h3 class="grant-title">Recent Grant Opportunities</h3>',
      '  <p class="grant-close">' + escapeHtml(message) + "</p>",
      "</article>",
    ].join("\n");
  }

  function setCardsHtml(html) {
    var container = document.getElementById("grantCards");

    if (!container) {
      return;
    }

    container.innerHTML = html;
  }

  async function loadGrants() {
    var response = await fetch(GRANTS_PATH, {
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Grant data request failed with status " + response.status);
    }

    return response.json();
  }

  async function renderGrantCards() {
    var container = document.getElementById("grantCards");

    if (!container) {
      return;
    }

    try {
      var payload = await loadGrants();
      var grants = Array.isArray(payload && payload.grants) ? payload.grants.slice(0, MAX_GRANTS) : [];

      if (!grants.length) {
        setCardsHtml(
          renderFallback("Grant opportunities could not be loaded. Please check back soon."),
        );
        return;
      }

      setCardsHtml(grants.concat(grants).map(renderGrantCard).join("\n"));
    } catch (error) {
      console.warn("Unable to load local GrantConnect data:", error);
      setCardsHtml(
        renderFallback("Grant opportunities could not be loaded. Please check back soon."),
      );
    }
  }

  document.addEventListener("DOMContentLoaded", renderGrantCards);
})();
