import { Stage, TeamStanding, GroupStageResults } from '../classifications.model';

export type FootballTournamentResults = FootballStageResults[];
export type FootballStageResults = FootballGroupStageResults[];
export type FootballStageType = 'FOOTBALL_KNOCKOUT' | 'FOOTBALL_CLASSIFICATION';
export class FootballStage extends Stage {
  stageType: FootballStageType;
}
export class FootballGroupStageResults extends GroupStageResults {
  teamStandings: FootballTeamStanding[];
  stage: FootballStage;
}

export type FootballKnockoutMatchRound = 'FIRST' | 'RETURN';

export class FootballTeamStanding extends TeamStanding {
  homeScoredGoals: number;
  homeConcededGoals: number;
  awayScoredGoals: number;
  awayConcededGoals: number;
  neutralScoredGoals: number;
  neutralConcededGoals: number;
  overtimeScoredGoals: number;
  penaltyScoredGoals: number;

  // Knockout
  scoredGoals: number;
  round: FootballKnockoutMatchRound;
  // Derived
  totalScoredGoals: number;
  totalConcededGoals: number;
}

