import * as cheerio from "cheerio";
import Parser from "rss-parser";

import {
  SOURCE_NAMES,
  cleanSummary,
  extractAustralianDateText,
  extractCloseDateFromText,
  fetchText,
  normalizeGrant,
  normalizeWhitespace,
  parseFlexibleCloseDate,
  pickFirstNonEmpty,
} from "./shared.js";

const parser = new Parser();

const FEED_URL = "https://www.grants.gov.au/public_data/rss/rss.xml";
const LIST_URL = "https://www.grants.gov.au/go/list";
const MAX_LIST_PAGES = 12;

function extractLabeledValue(text, label) {
  const normalizedText = cleanSummary(text);
  const escapedLabel = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(
    `${escapedLabel}\\s*:?\\s*(.+?)(?=\\s+(?:GO ID|Agency|Primary Category|Category|Close Date(?: & Time)?|Description|Eligibility|Published?|Full Details)\\s*:|$)`,
    "i",
  );
  const match = normalizedText.match(regex);
  return match ? normalizeWhitespace(match[1]) : "";
}

function getFeedContentTexts(item) {
  const categories = Array.isArray(item.categories) ? item.categories : [];

  return [
    item.title,
    item.content,
    item.contentSnippet,
    item.summary,
    item.contentEncoded,
    item["content:encoded"],
    ...categories,
  ]
    .map(cleanSummary)
    .filter(Boolean);
}

function getDirectFieldValues(item, patterns) {
  return Object.entries(item)
    .filter(([key, value]) => typeof value === "string" && patterns.some((pattern) => pattern.test(key)))
    .map(([, value]) => cleanSummary(value))
    .filter(Boolean);
}

function isPlausibleMetadataValue(value) {
  const normalized = normalizeWhitespace(value);

  return Boolean(
    normalized &&
      normalized.length <= 180 &&
      !/https?:\/\//i.test(normalized) &&
      !/\b(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun),?\s+\d{1,2}\s+[A-Za-z]{3}\s+\d{4}/.test(
        normalized,
      ),
  );
}

function extractFeedMetadata(item) {
  const textCandidates = getFeedContentTexts(item);
  const agencyFromLabels = pickFirstNonEmpty(
    textCandidates.map((text) => extractLabeledValue(text, "Agency")),
  );
  const categoryFromLabels = pickFirstNonEmpty(
    textCandidates.flatMap((text) => [
      extractLabeledValue(text, "Primary Category"),
      extractLabeledValue(text, "Category"),
    ]),
  );
  const closeDateText = pickFirstNonEmpty([
    ...getDirectFieldValues(item, [/close.?date/i, /closing.?date/i]),
    ...textCandidates.flatMap((text) => [
      extractLabeledValue(text, "Close Date & Time"),
      extractLabeledValue(text, "Close Date"),
      extractLabeledValue(text, "Closing Date"),
      extractCloseDateFromText(text),
    ]),
  ]);
  const parsedCloseDate = parseFlexibleCloseDate(closeDateText);
  const categories = Array.isArray(item.categories)
    ? item.categories.map(normalizeWhitespace).filter(Boolean)
    : [];
  const directAgencyValues = getDirectFieldValues(item, [/agency/i]);
  const directCategoryValues = getDirectFieldValues(item, [/primary.?category/i, /category/i]);
  const agency = pickFirstNonEmpty([agencyFromLabels, ...directAgencyValues]);
  const category = pickFirstNonEmpty([
    categoryFromLabels,
    ...directCategoryValues,
    categories.join(", "),
  ]);

  return {
    agency: isPlausibleMetadataValue(agency) ? agency : "",
    category: isPlausibleMetadataValue(category) ? category : "",
    closeDate: parsedCloseDate.closeDate,
    closeDateText: parsedCloseDate.closeDateText,
  };
}

async function fetchFeedGrants() {
  const xml = await fetchText(FEED_URL, "GrantConnect feed");
  const feed = await parser.parseString(xml);

  if (!feed?.items?.length) {
    throw new Error("Feed returned no grant items");
  }

  return feed.items.map((item) => {
    const metadata = extractFeedMetadata(item);

    return normalizeGrant(
      {
        title: item.title,
        goId: item.title || item.link || item.guid,
        agency: metadata.agency,
        category: metadata.category,
        closeDate: metadata.closeDate,
        closeDateText: metadata.closeDateText,
        amount: "",
        summary:
          item.contentSnippet ||
          item.content ||
          item.summary ||
          item.contentEncoded ||
          "",
        link: item.link || item.guid || "",
      },
      { source: SOURCE_NAMES.GRANT_CONNECT, baseUrl: LIST_URL },
    );
  });
}

function extractGrantBlocks($) {
  const blocks = [];
  const marker = $("#main-content, main, body").first();
  let current = null;

  marker.find("a, p, div, dl, dt, dd, h2, h3, h4").each((_, element) => {
    const text = normalizeWhitespace($(element).text());
    const href = $(element).is("a") ? $(element).attr("href") : undefined;

    if (!text) {
      return;
    }

    if ($(element).is("a") && /\bGO\d+\b/i.test(text)) {
      if (current?.title || current?.goId) {
        blocks.push(current);
      }

      const titleNode = $(element)
        .prevAll()
        .filter((__, sibling) => {
          const siblingText = normalizeWhitespace($(sibling).text());
          return Boolean(siblingText) && !/^GO ID:?$/i.test(siblingText);
        })
        .first();

      current = {
        title: normalizeWhitespace(titleNode.text()),
        goId: text,
        link: href,
        agency: "",
        category: "",
        closeDate: "",
        closeDateText: "",
        amount: "",
        summary: "",
      };
      return;
    }

    if (!current) {
      return;
    }

    if (/^Close Date & Time:?$/i.test(text)) {
      current.closeDateLabelSeen = true;
      return;
    }

    if (current.closeDateLabelSeen && !current.closeDate) {
      const parsed = parseFlexibleCloseDate(text);
      current.closeDate = parsed.closeDate;
      current.closeDateText = parsed.closeDateText;
      current.closeDateLabelSeen = false;
      return;
    }

    if (/^Agency:?$/i.test(text)) {
      current.agencyLabelSeen = true;
      return;
    }

    if (current.agencyLabelSeen && !current.agency) {
      current.agency = text;
      current.agencyLabelSeen = false;
      return;
    }

    if (/^Primary Category:?$/i.test(text)) {
      current.categoryLabelSeen = true;
      return;
    }

    if (current.categoryLabelSeen && !current.category) {
      current.category = text;
      current.categoryLabelSeen = false;
      return;
    }

    if (/^Description:?$/i.test(text)) {
      current.summaryLabelSeen = true;
      return;
    }

    if (current.summaryLabelSeen && !current.summary && !/^Full Details$/i.test(text)) {
      current.summary = text;
      current.summaryLabelSeen = false;
    }
  });

  if (current?.title || current?.goId) {
    blocks.push(current);
  }

  return blocks;
}

async function fetchHtmlPage(pageNumber = 1) {
  const pageUrl =
    pageNumber === 1 ? LIST_URL : `${LIST_URL}?page=${encodeURIComponent(pageNumber)}`;
  const html = await fetchText(pageUrl, `GrantConnect HTML page ${pageNumber}`);
  const $ = cheerio.load(html);
  const rawBlocks = extractGrantBlocks($);
  const grants = rawBlocks
    .map((record) =>
      normalizeGrant(record, {
        source: SOURCE_NAMES.GRANT_CONNECT,
        baseUrl: LIST_URL,
      }),
    )
    .filter((grant) => grant.goId && grant.title);

  const paginationText = normalizeWhitespace($("body").text());
  const recordMatch = paginationText.match(/Showing\s+\d+-\d+\s+of\s+(\d+)\s+records/i);
  const totalRecords = recordMatch ? Number(recordMatch[1]) : grants.length;
  const totalPages = Math.min(
    MAX_LIST_PAGES,
    Math.max(1, Math.ceil(totalRecords / 15)),
  );

  return {
    grants,
    totalPages,
  };
}

async function fetchHtmlGrants() {
  const firstPage = await fetchHtmlPage(1);
  let allGrants = [...firstPage.grants];

  for (let pageNumber = 2; pageNumber <= firstPage.totalPages; pageNumber += 1) {
    try {
      const page = await fetchHtmlPage(pageNumber);
      allGrants = allGrants.concat(page.grants);
    } catch (error) {
      console.warn(
        `Skipping GrantConnect list page ${pageNumber} after parse/fetch error: ${error.message}`,
      );
    }
  }

  if (!allGrants.length) {
    throw new Error("HTML fallback returned zero grants");
  }

  return allGrants;
}

export async function fetchGrantConnectGrants() {
  const errors = [];

  try {
    const grants = await fetchFeedGrants();
    return { grants, method: "feed" };
  } catch (error) {
    errors.push(`Feed failed: ${error.message}`);
    console.warn(errors[errors.length - 1]);
  }

  try {
    const grants = await fetchHtmlGrants();
    return { grants, method: "html-fallback" };
  } catch (error) {
    errors.push(`HTML fallback failed: ${error.message}`);
    console.warn(errors[errors.length - 1]);
  }

  throw new Error(
    `Unable to update GrantConnect data. ${errors.join(" | ")}`,
  );
}

export function buildGrantConnectSourceNote(method) {
  return method === "html-fallback" ? "GrantConnect (HTML fallback)" : SOURCE_NAMES.GRANT_CONNECT;
}
