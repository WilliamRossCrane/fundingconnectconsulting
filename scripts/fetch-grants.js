import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import * as cheerio from "cheerio";
import Parser from "rss-parser";

const parser = new Parser();

const FEED_URL = "https://www.grants.gov.au/public_data/rss/rss.xml";
const LIST_URL = "https://www.grants.gov.au/go/list";
const SOURCE_NAME = "GrantConnect";
const MAX_RESULTS = 12;
const MIN_FILTERED_RESULTS = 6;
const MAX_LIST_PAGES = 12;
const REQUEST_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36",
  Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  "Accept-Language": "en-AU,en;q=0.9,en-US;q=0.8",
};

const RELEVANCE_KEYWORDS = [
  "indigenous",
  "aboriginal",
  "torres strait islander",
  "torres strait",
  "first nations",
  "community",
  "not-for-profit",
  "not for profit",
  "non-profit",
  "non profit",
  "business",
  "small business",
  "queensland",
  "regional",
  "capacity building",
  "multicultural",
  "arts",
  "culture",
];

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outputPath = path.resolve(__dirname, "../data/grants.json");
const MONTH_PATTERN =
  "January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec";
const PARTIAL_DATE_PATTERNS = [
  new RegExp(`\\b\\d{1,2}\\s+(?:${MONTH_PATTERN})\\s+\\d{4}\\b`, "i"),
  new RegExp(
    `\\b(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday),?\\s+\\d{1,2}\\s+(?:${MONTH_PATTERN})(?:\\s+\\d{4})?\\b`,
    "i",
  ),
  new RegExp(
    `\\b(?:\\d{1,2}(?::\\d{2})?\\s*(?:am|pm)|12\\s*noon|\\d{1,2}\\s*noon)\\s*(?:AEST|AEDT|ACST|ACDT|AWST)?\\s*,?\\s*(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday),?\\s+\\d{1,2}\\s+(?:${MONTH_PATTERN})(?:\\s+\\d{4})?\\b`,
    "i",
  ),
];

function normalizeWhitespace(value) {
  return (value || "").replace(/\s+/g, " ").trim();
}

function decodeHtml(value) {
  return cheerio.load("<div></div>")("div").html(value || "").text();
}

function buildAbsoluteUrl(url) {
  if (!url) {
    return "";
  }

  try {
    return new URL(url, LIST_URL).toString();
  } catch {
    return "";
  }
}

function parseGoId(value) {
  const match = normalizeWhitespace(value).match(/\bGO\d+\b/i);
  return match ? match[0].toUpperCase() : "";
}

function parseCloseDate(value) {
  const raw = normalizeWhitespace(value);

  if (!raw || /ongoing/i.test(raw)) {
    return "";
  }

  const sanitized = raw
    .replace(/\(.*?\)/g, "")
    .replace(/\bACT Local Time\b/gi, "")
    .trim();

  const dateMatch = sanitized.match(
    /^(\d{1,2})-([A-Za-z]{3})-(\d{4})(?:\s+(\d{1,2}):(\d{2})\s*(am|pm))?$/i,
  );

  if (!dateMatch) {
    return "";
  }

  const [, dayText, monthText, yearText, hourText, minuteText, meridiemText] =
    dateMatch;
  const monthIndex = [
    "jan",
    "feb",
    "mar",
    "apr",
    "may",
    "jun",
    "jul",
    "aug",
    "sep",
    "oct",
    "nov",
    "dec",
  ].indexOf(monthText.toLowerCase());

  if (monthIndex === -1) {
    return "";
  }

  const day = Number(dayText);
  const year = Number(yearText);
  let hour = hourText ? Number(hourText) : 0;
  const minute = minuteText ? Number(minuteText) : 0;

  if (meridiemText) {
    const meridiem = meridiemText.toLowerCase();

    if (meridiem === "pm" && hour < 12) {
      hour += 12;
    }

    if (meridiem === "am" && hour === 12) {
      hour = 0;
    }
  }

  const iso = new Date(Date.UTC(year, monthIndex, day, hour, minute)).toISOString();
  return Number.isNaN(Date.parse(iso)) ? "" : iso;
}

function cleanSummary(value) {
  return normalizeWhitespace(decodeHtml(value));
}

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

function extractAustralianDateText(text) {
  const normalizedText = cleanSummary(text);

  for (const pattern of PARTIAL_DATE_PATTERNS) {
    const match = normalizedText.match(pattern);

    if (match) {
      return normalizeWhitespace(match[0]);
    }
  }

  return "";
}

function extractCloseDateFromText(text) {
  const normalizedText = cleanSummary(text);
  const contextPatterns = [
    /(?:close(?:s|d)?|closing date|close date(?: & time)?|applications? (?:are )?due|deadline)\s*(?:at|on|by)?\s*([^.;]+)/i,
    /by\s+([^.;]+)\s*(?:for|to submit|to apply)/i,
  ];

  for (const pattern of contextPatterns) {
    const contextMatch = normalizedText.match(pattern);

    if (!contextMatch) {
      continue;
    }

    const dateText = extractAustralianDateText(contextMatch[1]);

    if (dateText) {
      return dateText;
    }
  }

  return "";
}

function parseFlexibleCloseDate(value) {
  const raw = normalizeWhitespace(value);

  if (!raw || /ongoing/i.test(raw)) {
    return { closeDate: "", closeDateText: raw };
  }

  const parsedIso = parseCloseDate(raw);

  if (parsedIso) {
    return {
      closeDate: parsedIso,
      closeDateText: raw,
    };
  }

  if (!/\b\d{4}\b/.test(raw)) {
    return {
      closeDate: "",
      closeDateText: extractAustralianDateText(raw) || raw,
    };
  }

  const nativeParsed = Date.parse(raw);

  if (!Number.isNaN(nativeParsed)) {
    return {
      closeDate: new Date(nativeParsed).toISOString(),
      closeDateText: raw,
    };
  }

  return {
    closeDate: "",
    closeDateText: extractAustralianDateText(raw) || raw,
  };
}

function pickFirstNonEmpty(values) {
  for (const value of values) {
    const normalized = normalizeWhitespace(value);

    if (normalized) {
      return normalized;
    }
  }

  return "";
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
    .filter(([key, value]) => {
      if (typeof value !== "string") {
        return false;
      }

      return patterns.some((pattern) => pattern.test(key));
    })
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

function buildGrant(record) {
  const parsedCloseDate = parseFlexibleCloseDate(
    record.closeDate || record.closeDateText || "",
  );

  return {
    title: normalizeWhitespace(record.title) || "Untitled grant",
    goId: parseGoId(record.goId),
    agency: normalizeWhitespace(record.agency),
    category: normalizeWhitespace(record.category),
    closeDate: record.closeDate || parsedCloseDate.closeDate || "",
    closeDateText:
      normalizeWhitespace(record.closeDateText) ||
      parsedCloseDate.closeDateText ||
      "",
    summary: cleanSummary(record.summary) || "No summary available.",
    link: buildAbsoluteUrl(record.link),
    source: SOURCE_NAME,
  };
}

function getSearchableText(grant) {
  return [
    grant.title,
    grant.goId,
    grant.agency,
    grant.category,
    grant.summary,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function isRelevantGrant(grant) {
  const searchableText = getSearchableText(grant);
  return RELEVANCE_KEYWORDS.some((keyword) => searchableText.includes(keyword));
}

function sortByCloseDate(grants) {
  return [...grants].sort((left, right) => {
    const leftTime = left.closeDate ? Date.parse(left.closeDate) : Number.POSITIVE_INFINITY;
    const rightTime = right.closeDate ? Date.parse(right.closeDate) : Number.POSITIVE_INFINITY;
    return leftTime - rightTime;
  });
}

function selectFinalGrants(allGrants) {
  const deduped = dedupeGrants(sortByCloseDate(allGrants));
  const filtered = deduped.filter(isRelevantGrant);
  const finalGrants =
    filtered.length >= MIN_FILTERED_RESULTS
      ? filtered.slice(0, MAX_RESULTS)
      : deduped.slice(0, MAX_RESULTS);

  return {
    deduped,
    filtered,
    finalGrants,
  };
}

function dedupeGrants(grants) {
  const seen = new Map();

  for (const grant of grants) {
    const key = grant.goId || grant.link || grant.title.toLowerCase();

    if (!key || seen.has(key)) {
      continue;
    }

    seen.set(key, grant);
  }

  return [...seen.values()];
}

async function fetchText(url, label) {
  const response = await fetch(url, {
    headers: REQUEST_HEADERS,
    redirect: "follow",
  });

  if (!response.ok) {
    throw new Error(`${label} request failed with status ${response.status}`);
  }

  return response.text();
}

async function fetchFeedGrants() {
  console.log(`Trying GrantConnect feed: ${FEED_URL}`);

  const xml = await fetchText(FEED_URL, "Feed");
  const feed = await parser.parseString(xml);

  if (!feed?.items?.length) {
    throw new Error("Feed returned no grant items");
  }

  return feed.items.map((item) => {
    const metadata = extractFeedMetadata(item);

    return buildGrant({
      title: item.title,
      goId: item.title || item.link || item.guid,
      agency: metadata.agency,
      category: metadata.category,
      closeDate: metadata.closeDate,
      closeDateText: metadata.closeDateText,
      summary:
        item.contentSnippet ||
        item.content ||
        item.summary ||
        item.contentEncoded ||
        "",
      link: item.link || item.guid || "",
    });
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

      const titleNode = $(element).prevAll().filter((__, sibling) => {
        const siblingText = normalizeWhitespace($(sibling).text());
        return Boolean(siblingText) && !/^GO ID:?$/i.test(siblingText);
      }).first();

      current = {
        title: normalizeWhitespace(titleNode.text()),
        goId: text,
        link: href,
        agency: "",
        category: "",
        closeDate: "",
        closeDateText: "",
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
  console.log(`Fetching GrantConnect list page ${pageNumber}: ${pageUrl}`);

  const html = await fetchText(pageUrl, `HTML page ${pageNumber}`);
  const $ = cheerio.load(html);
  const rawBlocks = extractGrantBlocks($);
  const grants = rawBlocks.map(buildGrant).filter((grant) => grant.goId && grant.title);

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

async function loadGrants() {
  const errors = [];

  try {
    const grants = await fetchFeedGrants();
    console.log(`Feed fetch succeeded with ${grants.length} items.`);
    return { grants, method: "feed" };
  } catch (error) {
    errors.push(`Feed failed: ${error.message}`);
    console.warn(errors[errors.length - 1]);
  }

  try {
    const grants = await fetchHtmlGrants();
    console.log(`HTML fallback succeeded with ${grants.length} items.`);
    return { grants, method: "html-fallback" };
  } catch (error) {
    errors.push(`HTML fallback failed: ${error.message}`);
    console.warn(errors[errors.length - 1]);
  }

  throw new Error(
    `Unable to update GrantConnect data. ${errors.join(" | ")}`,
  );
}

async function writeOutput(grants, method) {
  const { filtered, finalGrants } = selectFinalGrants(grants);
  const output = {
    lastUpdated: new Date().toISOString(),
    source: SOURCE_NAME,
    sourceMethod: method,
    totalFetched: grants.length,
    totalMatched: filtered.length,
    totalDisplayed: finalGrants.length,
    grants: finalGrants,
  };

  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, `${JSON.stringify(output, null, 2)}\n`);

  console.log(
    `Saved ${finalGrants.length} grants to data/grants.json (${grants.length} fetched, ${filtered.length} matched keywords, source method: ${method}).`,
  );
}

async function main() {
  const { grants, method } = await loadGrants();
  await writeOutput(grants, method);
}

main().catch((error) => {
  console.error("Failed to fetch grants:", error.message);

  if (error.cause) {
    console.error("Cause:", error.cause);
  }

  process.exit(1);
});
