export interface IStatLeaderAthlete {
  id: string;
  displayName: string;
  shortName: string;
  jersey?: string;
}

export interface IStatLeaderTeam {
  id: string;
  displayName: string;
  abbreviation?: string;
}

export interface IStatLeader {
  displayValue: string;
  value: number;
  athlete: IStatLeaderAthlete;
  team?: IStatLeaderTeam;
}

export interface IStatCategory {
  name: string;
  displayName: string;
  shortDisplayName: string;
  abbreviation: string;
  leaders: IStatLeader[];
}
