import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

import {
  SOURCE_NAMES,
  buildSourceBalancedResults,
  dedupeGrants,
  groupGrantsBySource,
  isRelevantGrant,
  sortByCloseDate,
} from "./grant-sources/shared.js";
import {
  buildGrantConnectSourceNote,
  fetchGrantConnectGrants,
} from "./grant-sources/grantconnect.js";
import { fetchQueenslandGrants } from "./grant-sources/qld-grants.js";
import { fetchBusinessGovAuGrants } from "./grant-sources/business-gov-au.js";

const MAX_RESULTS = 18;
const MIN_FILTERED_RESULTS = 8;
const SOURCE_ORDER = [
  SOURCE_NAMES.GRANT_CONNECT,
  SOURCE_NAMES.QLD,
  SOURCE_NAMES.BUSINESS_GOV_AU,
];

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outputPath = path.resolve(__dirname, "../data/grants.json");

function createEmptySourceCounts() {
  return Object.fromEntries(
    SOURCE_ORDER.map((sourceName) => [
      sourceName,
      {
        fetched: 0,
        matched: 0,
        displayed: 0,
      },
    ]),
  );
}

function collectDisplayedCounts(displayedGrants) {
  const groups = groupGrantsBySource(displayedGrants, SOURCE_ORDER);
  const displayedCounts = {};

  for (const sourceName of SOURCE_ORDER) {
    displayedCounts[sourceName] = groups[sourceName]?.length || 0;
  }

  return displayedCounts;
}

async function loadAllSourceResults() {
  const sourceCounts = createEmptySourceCounts();
  const attemptedSources = [];
  const notes = [];
  const allFetchedGrants = [];
  let successfulSources = 0;

  const sourceLoaders = [
    {
      name: SOURCE_NAMES.GRANT_CONNECT,
      run: fetchGrantConnectGrants,
    },
    {
      name: SOURCE_NAMES.QLD,
      run: fetchQueenslandGrants,
    },
    {
      name: SOURCE_NAMES.BUSINESS_GOV_AU,
      run: fetchBusinessGovAuGrants,
    },
  ];

  for (const sourceLoader of sourceLoaders) {
    attemptedSources.push(sourceLoader.name);
    console.log(`Attempting source: ${sourceLoader.name}`);

    try {
      const result = await sourceLoader.run();
      const grants = Array.isArray(result?.grants) ? result.grants : [];

      sourceCounts[sourceLoader.name].fetched = grants.length;
      allFetchedGrants.push(...grants);
      successfulSources += 1;

      if (sourceLoader.name === SOURCE_NAMES.GRANT_CONNECT) {
        notes.push(buildGrantConnectSourceNote(result.method));
      } else if (result?.method) {
        notes.push(`${sourceLoader.name} (${result.method})`);
      } else {
        notes.push(sourceLoader.name);
      }

      console.log(`Source ${sourceLoader.name} fetched ${grants.length} grants.`);
    } catch (error) {
      console.warn(`Source ${sourceLoader.name} failed: ${error.message}`);
    }
  }

  return {
    allFetchedGrants,
    attemptedSources,
    notes,
    sourceCounts,
    successfulSources,
  };
}

function selectDisplayedGrants(dedupedGrants, sourceCounts) {
  const matchedGrants = dedupedGrants.filter(isRelevantGrant);
  const fallbackPool =
    matchedGrants.length >= MIN_FILTERED_RESULTS ? matchedGrants : dedupedGrants;

  const displayedGrants = buildSourceBalancedResults(
    matchedGrants,
    fallbackPool,
    MAX_RESULTS,
    SOURCE_ORDER,
  );
  const displayedCounts = collectDisplayedCounts(displayedGrants);

  for (const sourceName of SOURCE_ORDER) {
    sourceCounts[sourceName].matched = matchedGrants.filter(
      (grant) => grant.source === sourceName,
    ).length;
    sourceCounts[sourceName].displayed = displayedCounts[sourceName] || 0;
  }

  return {
    matchedGrants,
    displayedGrants,
  };
}

async function writeOutput(output) {
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, `${JSON.stringify(output, null, 2)}\n`);
}

async function main() {
  const {
    allFetchedGrants,
    attemptedSources,
    notes,
    sourceCounts,
    successfulSources,
  } = await loadAllSourceResults();

  const dedupedGrants = dedupeGrants(sortByCloseDate(allFetchedGrants));

  if (!dedupedGrants.length) {
    throw new Error(
      successfulSources
        ? "All sources returned zero usable grants after normalisation."
        : "Every grant source failed. No grants could be generated.",
    );
  }

  const { matchedGrants, displayedGrants } = selectDisplayedGrants(
    dedupedGrants,
    sourceCounts,
  );

  const output = {
    lastUpdated: new Date().toISOString(),
    sources: SOURCE_ORDER,
    sourceCounts,
    totalFetched: allFetchedGrants.length,
    totalMatched: matchedGrants.length,
    totalDisplayed: displayedGrants.length,
    grants: displayedGrants,
  };

  await writeOutput(output);

  console.log(`Sources attempted: ${attemptedSources.join(", ")}`);
  console.log(`Source methods used: ${notes.join(", ")}`);
  console.log(`Combined fetched grants: ${allFetchedGrants.length}`);
  console.log(`Combined matched grants: ${matchedGrants.length}`);
  console.log(`Saved grants: ${displayedGrants.length}`);
}

main().catch((error) => {
  console.error("Failed to fetch grants:", error.message);

  if (error.cause) {
    console.error("Cause:", error.cause);
  }

  process.exit(1);
});
