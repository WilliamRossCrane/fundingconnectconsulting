"use strict";

(function () {
  var GRANTS_PATH = "./data/grants.json";
  var MAX_GRANTS = 6;
  var AUTO_SCROLL_PX_PER_SECOND = 26;
  var USER_IDLE_DELAY_MS = 2200;
  var grantsCleanup = null;

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
      var parsed;
      var dateOnlyMatch = normalizeWhitespace(grant.closeDate).match(
        /^(\d{4})-(\d{2})-(\d{2})$/,
      );

      if (dateOnlyMatch) {
        parsed = new Date(
          Number(dateOnlyMatch[1]),
          Number(dateOnlyMatch[2]) - 1,
          Number(dateOnlyMatch[3]),
        );
      } else {
        parsed = new Date(grant.closeDate);
      }

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

  function inferFundingAmount(grant) {
    if (normalizeWhitespace(grant.amount)) {
      return normalizeWhitespace(grant.amount);
    }

    var summary = grant.summary || "";
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

  function renderCardMeta(grant) {
    var category = inferCategory(grant);
    var source = normalizeWhitespace(grant.source);

    if (!source) {
      return category;
    }

    return category + " • " + source;
  }

  function hasUsableLink(grant) {
    return /^https?:\/\//i.test(normalizeWhitespace(grant.link));
  }

  function renderGrantCard(grant) {
    var title = stripGoId(grant.title) || "Grant opportunity";
    var isLinked = hasUsableLink(grant);
    var link = isLinked ? grant.link : "#";
    var tagName = isLinked ? "a" : "article";
    var cardAttributes = isLinked
      ? ' class="grant-card grant-card-link" role="listitem" href="' +
        escapeHtml(link) +
        '" target="_blank" rel="noopener noreferrer" aria-label="View official grant: ' +
        escapeHtml(title) +
        '"'
      : ' class="grant-card grant-card-fallback" role="listitem"';

    return [
      "<" + tagName + cardAttributes + ">",
      '  <p class="grant-cat">' + escapeHtml(renderCardMeta(grant)) + "</p>",
      '  <h3 class="grant-title">' + escapeHtml(title) + "</h3>",
      '  <p class="grant-amount">' + escapeHtml(inferFundingAmount(grant)) + "</p>",
      '  <p class="grant-close">Closes: ' + escapeHtml(formatCloseDate(grant)) + "</p>",
      isLinked ? '  <span class="grant-link">View official grant</span>' : "",
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

  function renderLoadingCard() {
    return [
      '<article class="grant-card grant-card-loading" role="listitem" aria-hidden="true">',
      '  <p class="grant-cat">Grant Updates</p>',
      '  <h3 class="grant-title">Loading recent grant opportunities</h3>',
      '  <p class="grant-amount">Please wait a moment</p>',
      '  <p class="grant-close">Checking the latest local grant data.</p>',
      "</article>",
    ].join("\n");
  }

  function getCarouselElements() {
    return {
      wrap: document.getElementById("grantsTrackWrap"),
      container: document.getElementById("grantCards"),
    };
  }

  function setCardsHtml(html, options) {
    var elements = getCarouselElements();
    var container = elements.container;
    var config = options || {};

    if (!container) {
      return;
    }

    container.setAttribute("aria-busy", config.busy ? "true" : "false");
    container.innerHTML = html;

    if (elements.wrap) {
      elements.wrap.scrollLeft = 0;
    }
  }

  function showLoadingCard() {
    setCardsHtml(renderLoadingCard(), { busy: true });
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

  function duplicateGrants(grants) {
    if (grants.length < 2) {
      return grants.slice();
    }

    return grants.concat(grants);
  }

  function buildGrantCardsHtml(grants) {
    return duplicateGrants(grants).map(renderGrantCard).join("\n");
  }

  function initAutoplay() {
    var elements = getCarouselElements();
    var wrap = elements.wrap;
    var container = elements.container;
    var mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    var rafId = 0;
    var lastFrameTime = 0;
    var lastUserInteractionAt = 0;
    var isPointerInside = false;
    var isFocusInside = false;
    var isAutoScrolling = false;
    var loopWidth = 0;
    var hasOverflow = false;

    if (!wrap || !container) {
      return function () {};
    }

    function recalculateMetrics() {
      loopWidth = container.scrollWidth / 2;
      hasOverflow = wrap.scrollWidth > wrap.clientWidth + 1;

      if (!Number.isFinite(loopWidth) || loopWidth <= 0) {
        loopWidth = container.scrollWidth;
      }

      if (!hasOverflow) {
        wrap.scrollLeft = 0;
      } else if (wrap.scrollLeft >= loopWidth) {
        wrap.scrollLeft = wrap.scrollLeft - loopWidth;
      }
    }

    function shouldPause() {
      return (
        mediaQuery.matches ||
        !hasOverflow ||
        isPointerInside ||
        isFocusInside ||
        document.hidden ||
        Date.now() - lastUserInteractionAt < USER_IDLE_DELAY_MS
      );
    }

    function step(timestamp) {
      if (!lastFrameTime) {
        lastFrameTime = timestamp;
      }

      var delta = timestamp - lastFrameTime;
      lastFrameTime = timestamp;

      if (!shouldPause()) {
        var nextScrollLeft =
          wrap.scrollLeft + (AUTO_SCROLL_PX_PER_SECOND * delta) / 1000;

        if (nextScrollLeft >= loopWidth) {
          nextScrollLeft = nextScrollLeft - loopWidth;
        }

        isAutoScrolling = true;
        wrap.scrollLeft = nextScrollLeft;
        isAutoScrolling = false;
      }

      rafId = window.requestAnimationFrame(step);
    }

    function registerUserInteraction() {
      lastUserInteractionAt = Date.now();
    }

    function onPointerEnter() {
      isPointerInside = true;
    }

    function onPointerLeave() {
      isPointerInside = false;
    }

    function onFocusIn() {
      isFocusInside = true;
    }

    function onFocusOut(event) {
      if (!wrap.contains(event.relatedTarget)) {
        isFocusInside = false;
      }
    }

    function onUserScroll() {
      if (!isAutoScrolling) {
        registerUserInteraction();
      }
    }

    recalculateMetrics();
    rafId = window.requestAnimationFrame(step);

    wrap.addEventListener("mouseenter", onPointerEnter);
    wrap.addEventListener("mouseleave", onPointerLeave);
    wrap.addEventListener("focusin", onFocusIn);
    wrap.addEventListener("focusout", onFocusOut);
    wrap.addEventListener("pointerdown", registerUserInteraction, {
      passive: true,
    });
    wrap.addEventListener("touchstart", registerUserInteraction, {
      passive: true,
    });
    wrap.addEventListener("wheel", registerUserInteraction, {
      passive: true,
    });
    wrap.addEventListener("scroll", onUserScroll, { passive: true });
    window.addEventListener("resize", recalculateMetrics);
    document.addEventListener("visibilitychange", recalculateMetrics);
    mediaQuery.addEventListener("change", recalculateMetrics);

    return function cleanupAutoplay() {
      window.cancelAnimationFrame(rafId);
      wrap.removeEventListener("mouseenter", onPointerEnter);
      wrap.removeEventListener("mouseleave", onPointerLeave);
      wrap.removeEventListener("focusin", onFocusIn);
      wrap.removeEventListener("focusout", onFocusOut);
      wrap.removeEventListener("pointerdown", registerUserInteraction);
      wrap.removeEventListener("touchstart", registerUserInteraction);
      wrap.removeEventListener("wheel", registerUserInteraction);
      wrap.removeEventListener("scroll", onUserScroll);
      window.removeEventListener("resize", recalculateMetrics);
      document.removeEventListener("visibilitychange", recalculateMetrics);
      mediaQuery.removeEventListener("change", recalculateMetrics);
    };
  }

  async function initGrants() {
    var elements = getCarouselElements();

    if (!elements.container) {
      return;
    }

    if (typeof grantsCleanup === "function") {
      grantsCleanup();
      grantsCleanup = null;
    }

    showLoadingCard();

    try {
      var payload = await loadGrants();
      var grants = Array.isArray(payload && payload.grants)
        ? payload.grants.slice(0, MAX_GRANTS)
        : [];

      if (!grants.length) {
        setCardsHtml(
          renderFallback("Grant opportunities could not be loaded. Please check back soon."),
          { busy: false },
        );
        return;
      }

      setCardsHtml(buildGrantCardsHtml(grants), { busy: false });
      grantsCleanup = initAutoplay();
    } catch (error) {
      console.warn("Unable to load local GrantConnect data:", error);
      setCardsHtml(
        renderFallback("Grant opportunities could not be loaded. Please check back soon."),
        { busy: false },
      );
    }
  }

  window.FundingConnectApp = window.FundingConnectApp || {};
  window.FundingConnectApp.initGrants = initGrants;
})();
