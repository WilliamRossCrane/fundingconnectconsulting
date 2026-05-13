import * as cheerio from "cheerio";

export const REQUEST_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36",
  Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,application/json;q=0.9,*/*;q=0.8",
  "Accept-Language": "en-AU,en;q=0.9,en-US;q=0.8",
};

export const SOURCE_NAMES = {
  GRANT_CONNECT: "GrantConnect",
  QLD: "Queensland Government",
  BUSINESS_GOV_AU: "business.gov.au",
};

export const RELEVANCE_KEYWORDS = [
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
  "social enterprise",
  "women",
  "youth",
  "local government",
  "sustainability",
];

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

export function normalizeWhitespace(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

export function decodeHtml(value) {
  return cheerio.load("<div></div>")("div").html(value || "").text();
}

export function cleanSummary(value) {
  return normalizeWhitespace(decodeHtml(value));
}

export function buildAbsoluteUrl(url, baseUrl = "") {
  if (!url) {
    return "";
  }

  try {
    return new URL(url, baseUrl || undefined).toString();
  } catch {
    return "";
  }
}

export function parseGoId(value) {
  const match = normalizeWhitespace(value).match(/\bGO\d+\b/i);
  return match ? match[0].toUpperCase() : "";
}

export function parseCloseDate(value) {
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

  const iso = new Date(
    Date.UTC(Number(yearText), monthIndex, Number(dayText), hour, minute),
  ).toISOString();

  return Number.isNaN(Date.parse(iso)) ? "" : iso;
}

export function extractAustralianDateText(text) {
  const normalizedText = cleanSummary(text);

  for (const pattern of PARTIAL_DATE_PATTERNS) {
    const match = normalizedText.match(pattern);

    if (match) {
      return normalizeWhitespace(match[0]);
    }
  }

  return "";
}

export function extractCloseDateFromText(text) {
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

export function parseFlexibleCloseDate(value) {
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

export function pickFirstNonEmpty(values) {
  for (const value of values) {
    const normalized = normalizeWhitespace(value);

    if (normalized) {
      return normalized;
    }
  }

  return "";
}

export function inferAmount(text) {
  const normalizedText = normalizeWhitespace(text);
  const patterns = [
    /\bup to \$[\d,.]+(?:\s*(?:million|billion|thousand))?\b/i,
    /\bfrom \$[\d,.]+(?:\s*(?:million|billion|thousand))?\s+to \$[\d,.]+(?:\s*(?:million|billion|thousand))?\b/i,
    /\$\s?[\d,.]+(?:\s*(?:million|billion|thousand))?\s*(?:-|to)\s*\$?\s?[\d,.]+(?:\s*(?:million|billion|thousand))?\b/i,
    /\btotal funding of up to \$[\d,.]+(?:\s*(?:million|billion|thousand))?\b/i,
    /\bgrants? (?:between|from) \$[\d,.]+(?:\s*(?:million|billion|thousand))?\s+(?:and|to)\s+\$[\d,.]+(?:\s*(?:million|billion|thousand))?\b/i,
  ];

  for (const pattern of patterns) {
    const match = normalizedText.match(pattern);

    if (match) {
      return normalizeWhitespace(match[0]);
    }
  }

  return "";
}

export function normalizeGrant(record, options = {}) {
  const source = options.source || "";
  const baseUrl = options.baseUrl || "";
  const summary = cleanSummary(record.summary) || "No summary available.";
  const parsedCloseDate = parseFlexibleCloseDate(
    record.closeDate || record.closeDateText || "",
  );
  const closeDate = normalizeWhitespace(record.closeDate) || parsedCloseDate.closeDate || "";
  const closeDateText =
    normalizeWhitespace(record.closeDateText) || parsedCloseDate.closeDateText || "";

  return {
    title: normalizeWhitespace(record.title) || "Untitled grant",
    goId: parseGoId(record.goId || record.id || record.title),
    agency: normalizeWhitespace(record.agency),
    category: normalizeWhitespace(record.category),
    closeDate,
    closeDateText,
    amount: normalizeWhitespace(record.amount) || inferAmount(summary),
    summary,
    link: buildAbsoluteUrl(record.link, baseUrl),
    source,
  };
}

export function getSearchableText(grant) {
  return [
    grant.title,
    grant.goId,
    grant.agency,
    grant.category,
    grant.summary,
    grant.amount,
    grant.source,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

export function isRelevantGrant(grant) {
  const searchableText = getSearchableText(grant);
  return RELEVANCE_KEYWORDS.some((keyword) => searchableText.includes(keyword));
}

export function sortByCloseDate(grants) {
  return [...grants].sort((left, right) => {
    const leftTime = left.closeDate ? Date.parse(left.closeDate) : Number.POSITIVE_INFINITY;
    const rightTime = right.closeDate ? Date.parse(right.closeDate) : Number.POSITIVE_INFINITY;
    return leftTime - rightTime;
  });
}

export function dedupeGrants(grants) {
  const seen = new Map();

  for (const grant of grants) {
    const key =
      normalizeWhitespace(grant.link).toLowerCase() ||
      normalizeWhitespace(grant.goId).toLowerCase() ||
      `${normalizeWhitespace(grant.title).toLowerCase()}|${normalizeWhitespace(grant.source).toLowerCase()}`;

    if (!key || seen.has(key)) {
      continue;
    }

    seen.set(key, grant);
  }

  return [...seen.values()];
}

export function groupGrantsBySource(grants, sourceNames) {
  const groups = {};

  for (const sourceName of sourceNames) {
    groups[sourceName] = [];
  }

  for (const grant of grants) {
    if (!groups[grant.source]) {
      groups[grant.source] = [];
    }

    groups[grant.source].push(grant);
  }

  return groups;
}

export function buildSourceBalancedResults(preferredGrants, fallbackGrants, limit, sourceNames) {
  const preferredGroups = groupGrantsBySource(sortByCloseDate(preferredGrants), sourceNames);
  const fallbackGroups = groupGrantsBySource(sortByCloseDate(fallbackGrants), sourceNames);
  const usedKeys = new Set();
  const results = [];

  function grantKey(grant) {
    return (
      normalizeWhitespace(grant.link).toLowerCase() ||
      normalizeWhitespace(grant.goId).toLowerCase() ||
      `${normalizeWhitespace(grant.title).toLowerCase()}|${normalizeWhitespace(grant.source).toLowerCase()}`
    );
  }

  function takeRound(groups) {
    let addedThisRound = false;

    for (const sourceName of sourceNames) {
      while (groups[sourceName]?.length) {
        const candidate = groups[sourceName].shift();
        const key = grantKey(candidate);

        if (usedKeys.has(key)) {
          continue;
        }

        usedKeys.add(key);
        results.push(candidate);
        addedThisRound = true;
        break;
      }

      if (results.length >= limit) {
        return true;
      }
    }

    return addedThisRound;
  }

  while (results.length < limit && takeRound(preferredGroups)) {
    continue;
  }

  while (results.length < limit && takeRound(fallbackGroups)) {
    continue;
  }

  return results.slice(0, limit);
}

export async function fetchText(url, label) {
  const response = await fetch(url, {
    headers: REQUEST_HEADERS,
    redirect: "follow",
  });

  if (!response.ok) {
    throw new Error(`${label} request failed with status ${response.status}`);
  }

  return response.text();
}

export async function fetchJson(url, label) {
  const response = await fetch(url, {
    headers: REQUEST_HEADERS,
    redirect: "follow",
  });

  if (!response.ok) {
    throw new Error(`${label} request failed with status ${response.status}`);
  }

  return response.json();
}

export function parseCsv(text) {
  const rows = [];
  let currentRow = [];
  let currentCell = "";
  let inQuotes = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const nextChar = text[index + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentCell += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (!inQuotes && char === ",") {
      currentRow.push(currentCell);
      currentCell = "";
      continue;
    }

    if (!inQuotes && (char === "\n" || char === "\r")) {
      if (char === "\r" && nextChar === "\n") {
        index += 1;
      }

      currentRow.push(currentCell);
      rows.push(currentRow);
      currentRow = [];
      currentCell = "";
      continue;
    }

    currentCell += char;
  }

  if (currentCell || currentRow.length) {
    currentRow.push(currentCell);
    rows.push(currentRow);
  }

  if (!rows.length) {
    return [];
  }

  const headers = rows[0].map((header) => normalizeWhitespace(header));

  return rows
    .slice(1)
    .filter((row) => row.some((cell) => normalizeWhitespace(cell)))
    .map((row) => {
      const record = {};

      headers.forEach((header, index) => {
        if (header) {
          record[header] = normalizeWhitespace(row[index] || "");
        }
      });

      return record;
    });
}
