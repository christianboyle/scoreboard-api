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

const getScoreboardURL = (sport: string) =>
  !SPORT_URL_MAP[sport]
    ? console.error("Sport not found")
    : `${BASE_URL}/${SPORT_URL_MAP[sport]}/scoreboard`;

const getStatsURL = (sport: string) =>
  !SPORT_URL_MAP[sport]
    ? console.error("Sport not found")
    : `${BASE_URL}/${SPORT_URL_MAP[sport]}/stats`;

export { SPORTS, SPORT_URL_MAP, getScoreboardURL, getStatsURL };
