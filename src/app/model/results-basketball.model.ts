import {ResultsEntryBase, ResultsBase, Team} from './results.model';
import {Athlete, Location, MatchResultType} from "./sports.model";
import {Time} from "@angular/common";


export interface BasketballResults extends ResultsBase {
  content: BasketballResultsEntry[];
}

export interface BasketballResultsEntry extends ResultsEntryBase {
  basketballMatchTeams: BasketballTeamStats[];
  matchPlayers: BasketballPlayerStats[];
  matchCoaches: BasketballCoachStats[];
}

export interface BasketballTeamStats {
  team: Team; //
  location: Location; //
  score: number; //
  finalResult: MatchResultType; //
  q1Score: number;
  q2Score: number;
  q3Score: number;
  q4Score: number;
}

export interface BasketballPlayerStats {
  athlete: Athlete;
  team: number;
  role: string;
  startingTeam: string;
  minutes: Time;
  fieldGoalsMade: number;
  fieldGoalsAttempted: number;
  threePointFieldGoalsMade: number;
  threePointFieldGoalsAttempted: number;
  freeThrowsMade: number;
  freeThrowsAttempted: number;
  offensiveRebounds: number;
  devensiveRebounds: number;
  rebounds: number;
  assists: number;
  steals: number;
  turnovers: number;
  blocks: number;
  blockedFieldGoalAttempts: number;
  personalFouls: number;
  points: number;
  plusMinus: number;
}

export interface BasketballCoachStats {
  athlete: Athlete;
  team: number;
}
