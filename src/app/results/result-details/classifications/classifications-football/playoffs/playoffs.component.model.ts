import { Team } from 'src/app/model/results.model';
import { FootballTeamStanding, FootballKnockoutMatchRound } from '../classifications-football.model';
import { TournamentGroup } from '../../classifications.model';

export class KnockoutMatchupResult {
  matchId: number;
  score1: number;
  score2: number;
  round: FootballKnockoutMatchRound;
}

export class MatchupTeam extends Team {
  qualified = false;
}

export class KnockoutMatchup {
  position: number;
  team1: MatchupTeam;
  team2: MatchupTeam;
  results: KnockoutMatchupResult[] = [];
  isBottom = false;
  hasLeft = false;

  addResult(teamStanding: FootballTeamStanding) {
    this.addTeam(teamStanding);
    this.addScore(teamStanding);
  }

  private addTeam(teamStanding: FootballTeamStanding) {
    const team = teamStanding.team as MatchupTeam;
    if (teamStanding.finalGroupResult &&
      (teamStanding.finalGroupResult === 'QUALIFIED' || teamStanding.finalGroupResult === 'FINAL_WINNER')) {
      team.qualified = true;
    }
    if ((!this.team1 || (team.id !== this.team1.id)) && (!this.team2 || (team.id !== this.team2.id))) {
      if (this.team1) {
        this.team2 = team;
      } else {
        this.team1 = team;
      }
    } else if (team.qualified) {
      if (this.team1.id === team.id) {
        this.team1.qualified = true;
      } else if (this.team2.id === team.id) {
        this.team2.qualified = true;
      }
    }
  }

  private addScore(teamStanding: FootballTeamStanding) {
    const index = this.getTeamIndex(teamStanding.team);
    const result = this.getResult(teamStanding.matchId);
    const totalScore = (teamStanding.scoredGoals || 0) + (teamStanding.overtimeScoredGoals || 0);
    if (index === 0) {
      result.score1 = totalScore;
    } else {
      result.score2 = totalScore;
    }
    result.round = teamStanding.round;
  }

  private getResult(matchId: number) {
    let result = this.results.find(r => r.matchId === matchId);
    if (!result) {
      result = new KnockoutMatchupResult();
      result.matchId = matchId;
      this.results.push(result);
    }
    return result;
  }

  private getTeamIndex(team: Team) {
    if (team.id === this.team1.id) {
      return 0;
    } else {
      return 1;
    }
  }
}

export class KnockoutGroupResults {
  group: TournamentGroup;
  results: KnockoutMatchup[] = [];
  maxPosition = -1;
}
