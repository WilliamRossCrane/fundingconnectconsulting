import * as cheerio from "cheerio";

import {
  SOURCE_NAMES,
  fetchText,
} from "./shared.js";

const BUSINESS_GOV_AU_URL = "https://business.gov.au/grants-and-programs";

function discoverPublicApiCandidates(html) {
  const $ = cheerio.load(html);
  const candidates = new Set();

  $("script, link").each((_, element) => {
    const source = $(element).attr("src") || $(element).attr("href") || "";

    if (/api|json|graphql/i.test(source)) {
      candidates.add(source);
    }
  });

  const htmlMatches = html.match(/https?:\/\/[^"'\\s]+(?:api|json)[^"'\\s]*/gi) || [];

  for (const match of htmlMatches) {
    candidates.add(match);
  }

  return [...candidates];
}

export async function fetchBusinessGovAuGrants() {
  const html = await fetchText(BUSINESS_GOV_AU_URL, "business.gov.au grants finder");
  const apiCandidates = discoverPublicApiCandidates(html);

  if (!apiCandidates.length) {
    console.warn(
      "business.gov.au did not expose a clear public unauthenticated grants API from the public page. Returning no grants for this source.",
    );
    return {
      grants: [],
      method: "no-public-endpoint",
      source: SOURCE_NAMES.BUSINESS_GOV_AU,
    };
  }

  console.warn(
    `business.gov.au exposed possible asset/API references, but no reliable documented public grants endpoint was confirmed: ${apiCandidates.join(", ")}`,
  );

  return {
    grants: [],
    method: "unconfirmed-endpoint",
    source: SOURCE_NAMES.BUSINESS_GOV_AU,
  };
}
