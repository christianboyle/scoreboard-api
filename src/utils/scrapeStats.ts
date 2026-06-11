import fetch from "node-fetch";

import { getStatsApiURL } from "../constants/sports";
import { IStatCategory, IStatLeader } from "../interfaces/stats";

interface EspnStatLeaderAthlete {
  id: string;
  displayName: string;
  shortName: string;
  jersey?: string;
}

interface EspnStatLeaderTeam {
  id: string;
  displayName: string;
  abbreviation?: string;
}

interface EspnStatLeader {
  displayValue: string;
  value: number;
  athlete?: EspnStatLeaderAthlete;
  team?: EspnStatLeaderTeam;
  statistics?: unknown;
}

interface EspnStatCategory {
  name: string;
  displayName: string;
  shortDisplayName: string;
  abbreviation: string;
  leaders: EspnStatLeader[];
}

interface EspnStatisticsResponse {
  stats?: {
    categories?: EspnStatCategory[];
  };
}

const MAX_LEADERS_PER_CATEGORY = 25;

function mapLeader(leader: EspnStatLeader): IStatLeader | null {
  if (!leader.athlete) return null;

  return {
    displayValue: leader.displayValue,
    value: leader.value,
    athlete: {
      id: leader.athlete.id,
      displayName: leader.athlete.displayName,
      shortName: leader.athlete.shortName,
      jersey: leader.athlete.jersey,
    },
    team: leader.team
      ? {
          id: leader.team.id,
          displayName: leader.team.displayName,
          abbreviation: leader.team.abbreviation,
        }
      : undefined,
  };
}

function mapCategory(category: EspnStatCategory): IStatCategory {
  const leaders = category.leaders
    .slice(0, MAX_LEADERS_PER_CATEGORY)
    .map(mapLeader)
    .filter((leader): leader is IStatLeader => leader !== null);

  return {
    name: category.name,
    displayName: category.displayName,
    shortDisplayName: category.shortDisplayName,
    abbreviation: category.abbreviation,
    leaders,
  };
}

export async function scrapeStats(sport: string): Promise<IStatCategory[] | null> {
  const url = getStatsApiURL(sport);
  if (!url) return null;

  const res = await fetch(url, {
    headers: {
      Accept: "application/json",
      "Accept-Encoding": "gzip, deflate, br",
    },
  });

  if (!res.ok) {
    throw new Error(`ESPN stats API returned ${res.status} for ${sport}`);
  }

  const data = (await res.json()) as EspnStatisticsResponse;
  const categories = data.stats?.categories ?? [];

  if (!categories.length) {
    console.warn(`[Stats] No leader categories returned for ${sport}`);
    return [];
  }

  return categories.map(mapCategory);
}
