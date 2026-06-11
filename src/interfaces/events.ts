export interface IEvents {
  date: string;
  scores: IScore[];
}

export interface IVenue {
  id: string;
  fullName: string;
  address?: {
    city: string;
    state: string;
  };
  indoor?: boolean;
}

export interface IScore {
  startTime: string;
  shortName: string;
  status: IStatus;
  teams: {
    awayTeam: ITeam;
    homeTeam: ITeam;
  };
  venue?: IVenue;
}

export interface IStatus {
  inning: number;
  state: "pre" | "in" | "post";
  detail: string;
  shortDetail: string;
  completed: boolean;
}

export interface ITeam {
  shortDisplayName: string;
  alternateColor: string;
  color: string;
  displayName: string;
  name: string;
  logo: string;
  location: string;
  abbreviation: string;
  isActive: boolean;
  score: string;
  homeAway: "home" | "away";
  isHome?: boolean;
}
