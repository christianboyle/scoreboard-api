import fetch from "node-fetch";

import { getScoreboardApiURL } from "../constants/sports";
import { IScore, IVenue } from "../interfaces/events";

interface EspnTeam {
  shortDisplayName: string;
  alternateColor: string;
  color: string;
  displayName: string;
  name: string;
  logo: string;
  location: string;
  abbreviation: string;
  isActive: boolean;
}

interface EspnCompetitor {
  homeAway: "home" | "away";
  score: string;
  team: EspnTeam;
}

interface EspnStatusType {
  state: "pre" | "in" | "post";
  detail: string;
  shortDetail: string;
  completed: boolean;
}

interface EspnCompetition {
  competitors: EspnCompetitor[];
  status: {
    period: number;
    type: EspnStatusType;
  };
  venue?: IVenue;
}

interface EspnEvent {
  date: string;
  shortName: string;
  competitions: EspnCompetition[];
}

interface EspnScoreboardResponse {
  events?: EspnEvent[];
}

function mapCompetitor(competitor: EspnCompetitor) {
  const { team, score, homeAway } = competitor;

  return {
    shortDisplayName: team.shortDisplayName,
    alternateColor: team.alternateColor,
    color: team.color,
    displayName: team.displayName,
    name: team.name,
    logo: team.logo,
    location: team.location,
    abbreviation: team.abbreviation,
    isActive: team.isActive,
    score,
    homeAway,
    isHome: homeAway === "home",
  };
}

function mapEvent(event: EspnEvent): IScore | null {
  const competition = event.competitions[0];
  if (!competition) return null;

  const home = competition.competitors.find(
    (competitor) => competitor.homeAway === "home"
  );
  const away = competition.competitors.find(
    (competitor) => competitor.homeAway === "away"
  );

  if (!home || !away) return null;

  const { type, period } = competition.status;

  return {
    startTime: event.date,
    shortName: event.shortName,
    status: {
      inning: period,
      state: type.state,
      detail: type.detail,
      shortDetail: type.shortDetail,
      completed: type.completed,
    },
    teams: {
      awayTeam: mapCompetitor(away),
      homeTeam: mapCompetitor(home),
    },
    venue: competition.venue,
  };
}

export async function scrapeScores(sport: string): Promise<IScore[] | null> {
  const url = getScoreboardApiURL(sport);
  if (!url) return null;

  const res = await fetch(url, {
    headers: {
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`ESPN scoreboard API returned ${res.status} for ${sport}`);
  }

  const data = (await res.json()) as EspnScoreboardResponse;
  const events = data.events ?? [];

  if (!events.length) {
    console.warn(`[Scoreboard] No events returned for ${sport}`);
    return [];
  }

  const scores = events
    .map(mapEvent)
    .filter((score): score is IScore => score !== null);

  return scores;
}
