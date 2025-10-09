import express from "express";

import { scrapeScores } from "../utils/scrapeScores";
import { SPORTS, SPORT_URL_MAP, getScoreboardURL, isInSeason } from "../constants/sports";

const router = express.Router();

type Scores = {
  [key: string]: {};
};

const scores: Scores = {};
const activeIntervals: { [sport: string]: NodeJS.Timeout } = {};

const seconds = (n: number) => 1000 * n;
const hours = (n: number) => seconds(n * 3600);

/**
 * Starts scraping for a specific sport
 */
async function startSportScraping(sport: string) {
  // Don't start if already running
  if (activeIntervals[sport]) {
    console.log(`[Schedule] ${sport} scraping already active`);
    return;
  }

  const url = getScoreboardURL(sport);
  if (!url) return;

  try {
    const updateSport = async () => {
      if (!isInSeason(sport)) {
        console.log(`[Season Check] ${sport} is out of season, stopping scraping`);
        stopSportScraping(sport);
        return;
      }

      try {
        const data = await scrapeScores(url, sport);
        if (data) {
          scores[sport] = data;
        }
      } catch (error) {
        console.error(`[ERROR] ${sport} scraping failed:`, error);
      }
    };

    // Initial update
    await updateSport();

    // Set up interval for regular updates (every 30 seconds)
    activeIntervals[sport] = setInterval(async () => {
      await updateSport();
    }, seconds(30));

    console.log(`[Schedule] Started scraping for ${sport} (in season)`);
  } catch (error) {
    console.error(`[ERROR] Failed to start ${sport} scraping:`, error);
  }
}

/**
 * Stops scraping for a specific sport
 */
function stopSportScraping(sport: string) {
  if (activeIntervals[sport]) {
    clearInterval(activeIntervals[sport]);
    delete activeIntervals[sport];
    console.log(`[Schedule] Stopped scraping for ${sport}`);
  }
}

/**
 * Checks all sports and starts/stops scraping based on season status
 */
async function checkAndUpdateSeasons() {
  console.log(`[Season Check] Checking season status for all sports...`);
  
  for (const sport in SPORTS) {
    const inSeason = isInSeason(sport);
    const isActive = !!activeIntervals[sport];

    if (inSeason && !isActive) {
      console.log(`[Season Check] ${sport} season has started`);
      await startSportScraping(sport);
    } else if (!inSeason && isActive) {
      console.log(`[Season Check] ${sport} season has ended`);
      stopSportScraping(sport);
    } else if (inSeason && isActive) {
      console.log(`[Season Check] ${sport} is in season and active`);
    } else {
      console.log(`[Season Check] ${sport} is out of season`);
    }
  }
}

/**
 * Starts the schedule manager
 */
async function startSchedule() {
  console.log(`[Schedule] Initializing sports schedule manager...`);
  
  // Initial season check and start scraping for in-season sports
  await checkAndUpdateSeasons();

  // Check season status daily at 3 AM
  setInterval(async () => {
    await checkAndUpdateSeasons();
  }, hours(24));

  console.log(`[Schedule] Season checks will run daily`);
}

startSchedule();

router.get("/:sport/events", (req, res) => {
  const { sport } = req.params;

  if (!SPORT_URL_MAP[sport.toUpperCase()]) {
    return res.sendStatus(404);
  }

  res.json({
    date: new Date(),
    scores: scores[sport.toUpperCase()] || null,
  });
});

export default router;
