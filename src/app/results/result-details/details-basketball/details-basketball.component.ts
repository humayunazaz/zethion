import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { BasketballResultsEntry, BasketballPlayerStats, BasketballTeamStats } from 'src/app/model/results-basketball.model';
import { AppConstants } from 'src/app/app-constants';
import { MatchResultService } from 'src/app/shared/_service/match-result/basketball-match-result.service';
import { StatisticBasketDetail } from 'src/app/model/statistic-detail.model';
import { MatchEventDetail } from 'src/app/model/match-event-detail.model';
import { PlayerBasketDetail } from 'src/app/model/player-detail.model';
import { SportEvent } from 'src/app/model/events.model';
import { Location } from 'src/app/model/sports.model';
import { BasketballTableDataResults } from 'src/app/model/table-results.model';


interface InputData {
  detail: BasketballTableDataResults;
  players: BasketballPlayerStats;
  playersHome: BasketballPlayerStats;
  playersAway: BasketballPlayerStats;
}

@Component({
  selector: 'app-details-basketball',
  templateUrl: './details-basketball.component.html',
  styleUrls: ['./details-basketball.component.scss']
})
export class DetailsBasketballComponent implements OnInit {

  readonly ASSETS_URL_LOGO_TEAMS = AppConstants.ASSETS_URL_LOGO_TEAMS;
  public loadComponent: string;
  public url_logo_teams: string;
  public matchID: number;
  protected filterLoaded: Promise<boolean>;
  public statisticDetail = new StatisticBasketDetail();
  public playerDetail: PlayerBasketDetail[] = [];
  public playerAwayDetail: PlayerBasketDetail[] = [];
  public playerHomeDetail: PlayerBasketDetail[] = [];
  public rate: number;
  public isStatisticshow = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: InputData,
    private matchResultService: MatchResultService) {

    console.log('details-basketball.component.data', data);

  }

  ngOnInit() {
    this.url_logo_teams = `${this.ASSETS_URL_LOGO_TEAMS}/BASKETBALL`;
    this.matchID = this.data.detail.matchId;
    this.getMatchResults();
  }

  loadMyChildComponent(selected: string) {
    this.loadComponent = selected;
  }

  getMatchResults() {
    return this.matchResultService.getBasketBallMatchResult(this.matchID).subscribe(
      (data: BasketballResultsEntry) => {
        console.log('DetailsBasketballComponent.getMatchResults: data:', data);
        this.insertStaDetail(data.basketballMatchTeams);
        this.insertPlayDetail(data.matchPlayers);
        this.filterLoaded = Promise.resolve(true);
        this.loadComponent = 'Statistics';
      },
      err => console.log(err)
    );
  }

  insertStaDetail(teams: BasketballTeamStats[]) {
    let homeTeam = teams.find(team => team.location === 'HOME');
    let awayTeam = teams.find(team => team.location === 'AWAY');

    if (homeTeam === undefined || awayTeam === undefined) {
      homeTeam = teams[0];
      awayTeam = teams[1];
    }

    //this.hasOvertime = (homeTeam.overtimeScore !== undefined) || (awayTeam.overtimeScore !== undefined);

    this.statisticDetail.a_id = awayTeam.team.id;
    this.statisticDetail.a_name = awayTeam.team.name;
    this.statisticDetail.a_country = awayTeam.team.country;
    this.statisticDetail.a_mainCode = awayTeam.team.mainCode;
    this.statisticDetail.a_q1Score = awayTeam.q1Score;
    this.statisticDetail.a_q2Score = awayTeam.q2Score;
    this.statisticDetail.a_q3Score = awayTeam.q3Score;
    this.statisticDetail.a_q4Score = awayTeam.q4Score;
    this.statisticDetail.a_score = awayTeam.score;

    this.statisticDetail.h_id = homeTeam.team.id;
    this.statisticDetail.h_name = homeTeam.team.name;
    this.statisticDetail.h_country = homeTeam.team.country;
    this.statisticDetail.h_mainCode = homeTeam.team.name;
    this.statisticDetail.h_q1Score = homeTeam.q1Score;
    this.statisticDetail.h_q2Score = homeTeam.q2Score;
    this.statisticDetail.h_q3Score = homeTeam.q3Score;
    this.statisticDetail.h_q4Score = homeTeam.q4Score;
    this.statisticDetail.h_score = homeTeam.score;
  }
  insertPlayDetail(matchPlayers: BasketballPlayerStats[]) {
    for (const matchPlayer of matchPlayers) {
      const playBasketData = {
        type: matchPlayer.athlete.type,
        id: matchPlayer.athlete.id,
        firstName: matchPlayer.athlete.firstName,
        lastName: matchPlayer.athlete.lastName,
        compactName: matchPlayer.athlete.firstName.charAt(0) + '.' + matchPlayer.athlete.lastName,
        country: matchPlayer.athlete.country,
        gender: matchPlayer.athlete.gender,
        birthDate: matchPlayer.athlete.birthDate,
        height: matchPlayer.athlete.height,
        role: matchPlayer.role,
        team: matchPlayer.team,

        teamLocation: undefined,
        /* percentage */
        fieldGoalsPercentage: 0,
        freeThrowsPercentage: 0,
        threePointsPercentage: 0,

        startingTeam: matchPlayer.startingTeam,
        assists: matchPlayer.assists,

        minutes: matchPlayer.minutes,
        fieldGoalsMade: matchPlayer.fieldGoalsMade,
        fieldGoalsAttempted: matchPlayer.fieldGoalsAttempted,
        threePointFieldGoalsMade: matchPlayer.threePointFieldGoalsMade,
        threePointFieldGoalsAttempted: matchPlayer.threePointFieldGoalsAttempted,
        freeThrowsMade: matchPlayer.freeThrowsMade,
        freeThrowsAttempted: matchPlayer.freeThrowsAttempted,
        offensiveRebounds: matchPlayer.offensiveRebounds,
        devensiveRebounds: matchPlayer.devensiveRebounds,
        rebounds: matchPlayer.rebounds,
        steals: matchPlayer.steals,
        turnovers: matchPlayer.turnovers,
        blocks: matchPlayer.blocks,
        blockedFieldGoalAttempts: matchPlayer.blockedFieldGoalAttempts,
        personalFouls: matchPlayer.personalFouls,
        points: matchPlayer.points,
        plusMinus: matchPlayer.plusMinus

      };
      this.playerDetail.push(playBasketData);
    }
    this.insertTeamLocationAndPercentages(this.playerDetail);
   // this.insertEventDetail(this.playerDetail);
  }

  insertTeamLocationAndPercentages(playerDetail) {
    for (const player of playerDetail) {
      if(player.fieldGoalsMade !==0 && player.fieldGoalsAttempted !==undefined){
        player.fieldGoalsPercentage = player.fieldGoalsMade*100/player.fieldGoalsAttempted;
      }
      if(player.freeThrowsMade !==0 && player.freeThrowsAttempted !==undefined){
      player.freeThrowsPercentage = player.freeThrowsMade*100/player.freeThrowsAttempted;
      }
      if(player.threePointFieldGoalsMade !==0 && player.threePointFieldGoalsAttempted !==undefined){
      player.threePointsPercentage = player.threePointFieldGoalsMade*100/player.threePointFieldGoalsAttempted;
      }
      if (player.team === this.statisticDetail.a_id) {
        this.playerAwayDetail.push(player);
        player.teamLocation = 'AWAY';
      } else if (player.team === this.statisticDetail.h_id) {
        this.playerHomeDetail.push(player);
        player.teamLocation = 'HOME';
      }
    }
  }

  teamLogoMissing(event) {
    event.target.src = AppConstants.MISSING_TEAM_LOGO_URL;
  }
}
