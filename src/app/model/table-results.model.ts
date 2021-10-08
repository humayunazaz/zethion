export interface TableDataResults {
  nation: string;
  tournamentId: number;
  tournamentName: string;
  matchId: number;
  matchDate?: Date;
  matchTime?: string;

  homeTeamId?: number;
  homeTeam: string;
  homeTeamCode: string;

  awayTeamId?: number;
  awayTeam: string;
  awayTeamCode: string;

  homeScore: number;
  awayScore: number;

  isStatistics?: number;
}


export interface FootballTableDataResults extends TableDataResults {

  homeTeamshots: number;
  homeTeamshotsOnGoal: number;
  homeTeamcorners: number;
  homeTeamfreekicks: number;
  homeTeamfouls: number;
  homeTeamoffsides: number;
  homeOvertimeScore: number;
  homePenaltyScore: number;

  awayTeamshots: number;
  awayTeamshotsOnGoal: number;
  awayTeamcorners: number;
  awayTeamfreekicks: number;
  awayTeamfouls: number;
  awayTeamoffsides: number;
  awayOvertimeScore: number;
  awayPenaltyScore: number;

}
export interface BasketballTableDataResults extends TableDataResults {

  homeTeamshots: number;
  homeTeamfouls: number;


  awayTeamshots: number;
  awayTeamfouls: number;

}
