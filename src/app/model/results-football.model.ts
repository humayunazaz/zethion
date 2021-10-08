import { ResultsBase, ResultsEntryBase, Team, EventResult } from './results.model';
import { MatchResultType, Location, Athlete } from 'src/app/model/sports.model';


export interface FootballResults extends ResultsBase {
  content: FootballResultsEntry[];
}

export interface FootballResultsEntry extends ResultsEntryBase {
  footballmatchTeams: FootbalTeamStats[];
  matchPlayers: FootballPlayerStats[];
  matchCoaches: FootballCoachStats[];
}

export interface FootbalTeamStats {
  team: Team; //
  location: Location; //
  score: number; //
  finalResult: MatchResultType; //
  overtimeScore: number;
  penaltyScore: number;
  shots: number;
  shotsOnGoal: number;
  corners: number;
  freekicks: number;
  fouls: number;
  offsides: number;
  yellowcards: number;
  redcards: number;
}

export interface FootballPlayerStats {
  athlete: Athlete;
  team: number;
  role: string;
  startingTeam: string;
  eventResults: EventResult[];
}

export interface FootballCoachStats {
  athlete: Athlete;
  team: number;
}
