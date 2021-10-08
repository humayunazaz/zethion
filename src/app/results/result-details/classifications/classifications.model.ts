import { Tournament, Team } from 'src/app/model/results.model';


export type StageType = any;

export type TournamentResults = StageResults[];
export type StageResults = GroupStageResults[];

export class GroupStageResults {
  teamStandings: TeamStanding[];
  stage: Stage;
  group: TournamentGroup;
}

export class TournamentGroup {
  id: number;
  group: string;
}

export type FinalGroupResult = 'QUALIFIED' | 'ELIMINATED' | 'FINAL_WINNER' | 'FINAL_LOSER';

export class TeamStanding {
  team: Team;
  position: number;
  matchId: number;
  homeWins: number;
  homeDraws: number;
  homeLosts: number;
  awayWins: number;
  awayDraws: number;
  awayLosts: number;
  neutralWins: number;
  neutralDraws: number;
  neutralLosts: number;
  homePoints: number;
  awayPoints: number;
  neutralPoints: number;
  // Optional
  finalGroupResult: FinalGroupResult;
  // Derived data
  totalWins: number;
  totalDraws: number;
  totalLosts: number;
  totalGames: number;
  totalHomeGames: number;
  totalAwayGames: number;
  totalPoints: number;
}

export class Stage {
  id: number;
  stageType: string;
  tournament: Tournament;
  stageday: number;
}

