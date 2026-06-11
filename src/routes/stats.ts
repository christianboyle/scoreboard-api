import express from "express";

import { scrapeStats } from "../utils/scrapeStats";
import { SPORTS, SPORT_URL_MAP } from "../constants/sports";

const router = express.Router();

type Scores = {
  [key: string]: {};
};

const stats: Scores = {};

const seconds = (n: number) => 1000 * n;

async function startSportStats(sport: string) {
  const updateSport = async () => {
    try {
      const data = await scrapeStats(sport);

      if (data) {
        stats[sport] = data;
      } else {
        console.warn(`[Stats] ${sport} returned no leader data`);
      }
    } catch (error) {
      console.error(`[ERROR] ${sport} stats fetch failed:`, error);
    }
  };

  await updateSport();

  setInterval(async () => {
    await updateSport();
  }, seconds(30));

  console.log(`[Schedule] Started stats fetching for ${sport}`);
}

async function startSchedule() {
  console.log(`[Schedule] Initializing stats schedule...`);

  for (const sport in SPORTS) {
    await startSportStats(sport);
  }
}

startSchedule();

router.get("/:sport/stats", (req, res) => {
  const { sport } = req.params;

  if (!SPORT_URL_MAP[sport.toUpperCase()]) {
    return res.sendStatus(404);
  }

  res.json({
    date: new Date(),
    stats: stats[sport.toUpperCase()] || null,
  });
});

export default router;
