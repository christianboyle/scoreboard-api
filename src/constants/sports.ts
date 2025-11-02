const BASE_URL = "https://www.espn.com";

const SPORTS = {
  MLB: "MLB",
  // NBA: "NBA", // Disabled for now
  // NFL: "NFL", // Disabled for now
  // NCAAM: "NCAAM", // Disabled for now
  // NCAAF: "NCAAF", // Disabled for now
  // NHL: "NHL", // Disabled for now
};

const SPORT_URL_MAP = {
  [SPORTS.MLB]: "mlb",
  // [SPORTS.NBA]: "nba", // Disabled for now
  // [SPORTS.NFL]: "nfl", // Disabled for now
  // [SPORTS.NCAAM]: "mens-college-basketball", // Disabled for now
  // [SPORTS.NCAAF]: "college-football", // Disabled for now
  // [SPORTS.NHL]: "nhl", // Disabled for now
};

// Season dates configuration
// Format: { start: "MM-DD", end: "MM-DD" }
// NOTE: Update these dates each year as needed
const SEASON_DATES = {
  [SPORTS.MLB]: { start: "03-20", end: "11-01" }, // Spring training through World Series
  // [SPORTS.NBA]: { start: "10-15", end: "06-30" }, // Preseason through Finals
  // [SPORTS.NFL]: { start: "09-01", end: "02-15" }, // Regular season through Super Bowl
  // [SPORTS.NCAAM]: { start: "11-01", end: "04-15" }, // Regular season through Final Four
  // [SPORTS.NCAAF]: { start: "08-15", end: "01-15" }, // Regular season through CFP Championship
  // [SPORTS.NHL]: { start: "09-15", end: "06-30" }, // Preseason through Stanley Cup Finals
};

/**
 * Checks if a sport is currently in season
 * @param sport - The sport to check (e.g., "MLB", "NBA")
 * @returns true if the sport is currently in season, false otherwise
 */
const isInSeason = (sport: string): boolean => {
  const seasonDates = SEASON_DATES[sport];
  
  if (!seasonDates) {
    console.warn(`[Season Check] No season dates configured for ${sport}`);
    return false;
  }

  const now = new Date();
  const currentYear = now.getFullYear();
  
  // Parse start and end dates
  const [startMonth, startDay] = seasonDates.start.split("-").map(Number);
  const [endMonth, endDay] = seasonDates.end.split("-").map(Number);
  
  // Create date objects for comparison
  const seasonStart = new Date(currentYear, startMonth - 1, startDay);
  const seasonEnd = new Date(currentYear, endMonth - 1, endDay);
  
  // Handle seasons that span across year boundary (e.g., NFL, NBA, NHL)
  if (seasonEnd < seasonStart) {
    // Season spans across New Year (e.g., Sept to Feb)
    // Either we've passed the start date this year, OR we haven't passed the end date yet (from last year's season)
    return (now >= seasonStart) || (now <= seasonEnd);
  }
  
  // Normal season within same year
  return now >= seasonStart && now <= seasonEnd;
};

const getScoreboardURL = (sport: string) =>
  !SPORT_URL_MAP[sport]
    ? console.error("Sport not found")
    : `${BASE_URL}/${SPORT_URL_MAP[sport]}/scoreboard`;

const getStatsURL = (sport: string) =>
  !SPORT_URL_MAP[sport]
    ? console.error("Sport not found")
    : `${BASE_URL}/${SPORT_URL_MAP[sport]}/stats`;

export { SPORTS, SPORT_URL_MAP, SEASON_DATES, getScoreboardURL, getStatsURL, isInSeason };
