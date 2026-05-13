import * as cheerio from "cheerio";

import {
  SOURCE_NAMES,
  buildAbsoluteUrl,
  cleanSummary,
  extractCloseDateFromText,
  fetchJson,
  fetchText,
  normalizeGrant,
  normalizeWhitespace,
  parseCsv,
  pickFirstNonEmpty,
} from "./shared.js";

const QLD_OPEN_DATA_DATASET_IDS = [
  "grants-finder",
  "1d72cbb9-5f99-4ad7-ae92-ddd87884527b",
];
const QLD_OPEN_DATA_BASE = "https://www.data.qld.gov.au";
const QLD_GRANTS_SITE = "https://www.grants.services.qld.gov.au/";

function pickField(record, fieldNames) {
  const entries = Object.entries(record);

  for (const fieldName of fieldNames) {
    const found = entries.find(([key, value]) => {
      return (
        normalizeWhitespace(value) &&
        key.toLowerCase() === fieldName.toLowerCase()
      );
    });

    if (found) {
      return normalizeWhitespace(found[1]);
    }
  }

  for (const fieldName of fieldNames) {
    const found = entries.find(([key, value]) => {
      return (
        normalizeWhitespace(value) &&
        key.toLowerCase().includes(fieldName.toLowerCase())
      );
    });

    if (found) {
      return normalizeWhitespace(found[1]);
    }
  }

  return "";
}

function normalizeQldRow(record, resourceUrl) {
  const title = pickField(record, [
    "Title",
    "Grant title",
    "Program name",
    "Name",
    "Opportunity",
  ]);
  const summary = pickField(record, [
    "Description",
    "Summary",
    "Details",
    "Overview",
    "Grant description",
  ]);
  const amount = pickField(record, [
    "Amount",
    "Funding",
    "Funding amount",
    "Grant amount",
    "Value",
  ]);
  const closeDateText = pickFirstNonEmpty([
    pickField(record, [
      "Closing date",
      "Close date",
      "Applications close",
      "Open/close dates",
    ]),
    extractCloseDateFromText(summary),
  ]);
  const link = pickField(record, [
    "Link",
    "Url",
    "URL",
    "Grant URL",
    "Web address",
    "Website",
  ]);

  return normalizeGrant(
    {
      title,
      goId: pickField(record, ["Id", "ID", "Grant ID", "Program ID"]),
      agency: pickField(record, ["Agency", "Department", "Provider"]),
      category: pickField(record, ["Category", "Type", "Support type", "Audience"]),
      closeDate: pickField(record, ["Closing date", "Close date"]),
      closeDateText,
      amount,
      summary,
      link: link || resourceUrl,
    },
    {
      source: SOURCE_NAMES.QLD,
      baseUrl: QLD_GRANTS_SITE,
    },
  );
}

async function fetchQldOpenDataPackage() {
  const errors = [];

  for (const datasetId of QLD_OPEN_DATA_DATASET_IDS) {
    try {
      const payload = await fetchJson(
        `${QLD_OPEN_DATA_BASE}/api/3/action/package_show?id=${encodeURIComponent(datasetId)}`,
        `Queensland open data package ${datasetId}`,
      );

      if (payload?.success && payload.result) {
        return payload.result;
      }
    } catch (error) {
      errors.push(`${datasetId}: ${error.message}`);
    }
  }

  throw new Error(`Queensland open data package lookup failed: ${errors.join(" | ")}`);
}

function chooseQldResources(dataset) {
  const resources = Array.isArray(dataset?.resources) ? dataset.resources : [];

  return resources.filter((resource) => {
    const haystack = `${resource.name || ""} ${resource.description || ""} ${resource.format || ""}`.toLowerCase();

    return (
      !haystack.includes("checklist contribution resources") &&
      !haystack.includes("checklist") &&
      (haystack.includes("grant") || haystack.includes("finder")) &&
      ["csv", "json"].includes(String(resource.format || "").toLowerCase())
    );
  });
}

async function fetchQldOpenDataGrants() {
  const dataset = await fetchQldOpenDataPackage();
  const candidateResources = chooseQldResources(dataset);

  if (!candidateResources.length) {
    throw new Error("No usable Queensland open data grant resources were found");
  }

  const grants = [];

  for (const resource of candidateResources) {
    try {
      const resourceUrl = resource.url || resource.download_url;

      if (!resourceUrl) {
        continue;
      }

      if (String(resource.format || "").toLowerCase() === "json") {
        const payload = await fetchJson(resourceUrl, `Queensland resource ${resource.name || resource.id}`);
        const rows = Array.isArray(payload)
          ? payload
          : Array.isArray(payload?.result?.records)
            ? payload.result.records
            : Array.isArray(payload?.records)
              ? payload.records
              : [];

        for (const row of rows) {
          const grant = normalizeQldRow(row, resourceUrl);

          if (grant.title !== "Untitled grant") {
            grants.push(grant);
          }
        }

        continue;
      }

      const csvText = await fetchText(
        resourceUrl,
        `Queensland resource ${resource.name || resource.id}`,
      );
      const rows = parseCsv(csvText);

      for (const row of rows) {
        const grant = normalizeQldRow(row, resourceUrl);

        if (grant.title !== "Untitled grant") {
          grants.push(grant);
        }
      }
    } catch (error) {
      console.warn(
        `Queensland resource ${resource.name || resource.id} could not be parsed: ${error.message}`,
      );
    }
  }

  if (!grants.length) {
    throw new Error("Queensland open data resources returned no grant rows");
  }

  return {
    grants,
    method: "open-data",
  };
}

function scrapeQldListing(html) {
  const $ = cheerio.load(html);
  const grants = [];
  const seenLinks = new Set();

  $("a[href]").each((_, element) => {
    const link = buildAbsoluteUrl($(element).attr("href"), QLD_GRANTS_SITE);
    const title = cleanSummary($(element).text());

    if (
      !link ||
      !title ||
      seenLinks.has(link) ||
      link.endsWith("#") ||
      !link.startsWith(QLD_GRANTS_SITE) ||
      link === QLD_GRANTS_SITE ||
      title.length < 6
    ) {
      return;
    }

    const card = $(element).closest("article, li, div, section");
    const contextText = cleanSummary(card.text());

    if (
      !/grant|rebate|loan|subsid|training/i.test(contextText) ||
      !/apply|eligib|fund|rebate|grant|loan|support/i.test(contextText)
    ) {
      return;
    }

    seenLinks.add(link);
    grants.push(
      normalizeGrant(
        {
          title,
          goId: "",
          agency: "",
          category: "",
          closeDate: "",
          closeDateText: extractCloseDateFromText(contextText),
          amount: "",
          summary: contextText,
          link,
        },
        {
          source: SOURCE_NAMES.QLD,
          baseUrl: QLD_GRANTS_SITE,
        },
      ),
    );
  });

  return grants;
}

async function fetchQldScrapedGrants() {
  const html = await fetchText(QLD_GRANTS_SITE, "Queensland grants finder HTML");
  const grants = scrapeQldListing(html);

  return {
    grants,
    method: grants.length ? "scrape-fallback" : "scrape-fallback-empty",
  };
}

export async function fetchQueenslandGrants() {
  try {
    return await fetchQldOpenDataGrants();
  } catch (error) {
    console.warn(`Queensland open data lookup failed: ${error.message}`);
  }

  return fetchQldScrapedGrants();
}
