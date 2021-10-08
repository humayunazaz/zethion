import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { FootballResultsEntry, FootballPlayerStats, FootbalTeamStats } from 'src/app/model/results-football.model';
import { AppConstants } from 'src/app/app-constants';
import { MatchResultService } from 'src/app/shared/_service/match-result/football-match-result.service';
import { StatisticDetail } from 'src/app/model/statistic-detail.model';
import { MatchEventDetail } from 'src/app/model/match-event-detail.model';
import { PlayerDetail } from 'src/app/model/player-detail.model';
import { SportEvent } from 'src/app/model/events.model';
import { Location } from 'src/app/model/sports.model';
import { FootballTableDataResults } from 'src/app/model/table-results.model';


interface InputData {
  detail: FootballTableDataResults;
}

@Component({
  selector: 'app-details-football',
  templateUrl: './details-football.component.html',
  styleUrls: ['./details-football.component.scss']
})
export class DetailsFootballComponent implements OnInit {

  readonly ASSETS_URL_LOGO_TEAMS = AppConstants.ASSETS_URL_LOGO_TEAMS;
  public loadComponent: string;
  public url_logo_teams: string;
  public matchID: number;
  protected filterLoaded: Promise<boolean>;
  public statisticDetail = new StatisticDetail();
  public eventDetail: SportEvent[] = [];
  public playerDetail: PlayerDetail[] = [];
  private events: MatchEventDetail[] = [];
  public rate: number;
  public isStatisticshow = true;
  public hasOvertime = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: InputData,
    private matchResultService: MatchResultService) {

    console.log('details-football.component.data', data);

  }

  ngOnInit() {
    this.url_logo_teams = `${this.ASSETS_URL_LOGO_TEAMS}/FOOTBALL`;
    this.matchID = this.data.detail.matchId;
    this.getMatchResults();
  }

  loadMyChildComponent(selected: string) {
    this.loadComponent = selected;
  }

  getMatchResults() {
    return this.matchResultService.getFootBallMatchResult(this.matchID).subscribe(
      (data: FootballResultsEntry) => {
        console.log('DetailsFootballComponent.getMatchResults: data:', data);
        this.insertStaDetail(data.footballmatchTeams);
        this.insertPlayDetail(data.matchPlayers);
        this.filterLoaded = Promise.resolve(true);
        this.loadComponent = 'Timeline';
      },
      err => console.log(err)
    );
  }

  insertStaDetail(teams: FootbalTeamStats[]) {
    let homeTeam = teams.find(team => team.location === 'HOME');
    let awayTeam = teams.find(team => team.location === 'AWAY');

    if (homeTeam === undefined || awayTeam === undefined) {
      homeTeam = teams[0];
      awayTeam = teams[1];
    }

    this.hasOvertime = (homeTeam.overtimeScore !== undefined) || (awayTeam.overtimeScore !== undefined);

    this.statisticDetail.a_id = awayTeam.team.id;
    this.statisticDetail.a_name = awayTeam.team.name;
    this.statisticDetail.a_country = awayTeam.team.country;
    this.statisticDetail.a_mainCode = awayTeam.team.mainCode;
    this.statisticDetail.a_score = awayTeam.score;
    this.statisticDetail.a_overtimeScore = awayTeam.overtimeScore;
    this.statisticDetail.a_penaltyScore = awayTeam.penaltyScore;
    this.statisticDetail.a_ballPossession = 60;
    this.statisticDetail.a_shots = awayTeam.shots;
    this.statisticDetail.a_shotsOnTarget = awayTeam.shotsOnGoal;
    this.statisticDetail.a_fouls = awayTeam.fouls;
    this.statisticDetail.a_yellowCards = awayTeam.yellowcards;
    this.statisticDetail.a_RedCards = awayTeam.redcards;
    this.statisticDetail.a_corners = awayTeam.corners;
    this.statisticDetail.a_freekicks = awayTeam.freekicks;
    this.statisticDetail.a_offsides = awayTeam.offsides;
    this.statisticDetail.h_id = homeTeam.team.id;
    this.statisticDetail.h_name = homeTeam.team.name;
    this.statisticDetail.h_country = homeTeam.team.country;
    this.statisticDetail.h_mainCode = homeTeam.team.name;
    this.statisticDetail.h_score = homeTeam.score;
    this.statisticDetail.h_overtimeScore = homeTeam.overtimeScore;
    this.statisticDetail.h_penaltyScore = homeTeam.penaltyScore;
    this.statisticDetail.h_ballPossession = 40;
    this.statisticDetail.h_shots = homeTeam.shots;
    this.statisticDetail.h_shotsOnTarget = homeTeam.shotsOnGoal;
    this.statisticDetail.h_fouls = homeTeam.fouls;
    this.statisticDetail.h_yellowCards = homeTeam.yellowcards;
    this.statisticDetail.h_RedCards = homeTeam.redcards;
    this.statisticDetail.h_corners = homeTeam.corners;
    this.statisticDetail.h_freekicks = homeTeam.freekicks;
    this.statisticDetail.h_offsides = homeTeam.offsides;
  }
  insertPlayDetail(matchPlayers: FootballPlayerStats[]) {
    for (const matchPlayer of matchPlayers) {
      const playData = {
        type: matchPlayer.athlete.type,
        id: matchPlayer.athlete.id,
        firstName: matchPlayer.athlete.firstName,
        lastName: matchPlayer.athlete.lastName,
        country: matchPlayer.athlete.country,
        gender: matchPlayer.athlete.gender,
        birthDate: matchPlayer.athlete.birthDate,
        height: matchPlayer.athlete.height,
        role: matchPlayer.role,
        team: matchPlayer.team,
        teamLocation: undefined,
        startingTeam: matchPlayer.startingTeam,
        eventResults: matchPlayer.eventResults
      };
      this.playerDetail.push(playData);
    }
    this.insertTeamLocation(this.playerDetail);
    this.insertEventDetail(this.playerDetail);
  }
  insertEventDetail(playerDetail: PlayerDetail[]) {
    for (const player of playerDetail) {
      if (player.eventResults.length > 0) {
        for (const evt of player.eventResults) {
          const eventData = {
            eventname: evt.event,
            time: evt.time,
            minute: evt.minute,
            firstName: player.firstName,
            lastName: player.lastName,
            team: player.teamLocation,
            between: undefined
          };
          this.events.push(eventData);
        }
      }
    }

    this.insertEvent(this.events);
    this.addFieldStatistic([this.events, this.statisticDetail]);
  }
  insertTeamLocation(playerDetail) {
    for (const player of playerDetail) {
      if (player.team === this.statisticDetail.a_id) {
        player.teamLocation = 'AWAY';
      } else if (player.team === this.statisticDetail.h_id) {
        player.teamLocation = 'HOME';
      }
    }
  }

  getCompactName(firstName: string, lastName: string): string {
    return firstName.charAt(0) + '.' + lastName;
  }

  insertEvent(events) {
    for (const item of events) {
      const compactName = this.getCompactName(item.firstName, item.lastName);
      let assistName = '';
      if (item.eventname === 'GOAL') {
        for (const compare of events) {
          if (item.minute === compare.minute && compare.eventname === 'ASSIST') {
            assistName = this.getCompactName(compare.firstName, compare.lastName);
            break;
          }
        }
        const playerName = assistName.length > 0
          ? compactName + ' (' + assistName + ')'
          : compactName;

        const pushItem = {
          eventname: item.eventname,
          time: item.time,
          minute: item.minute,
          name: playerName,
          team: item.team,
          between: undefined
        };
        this.eventDetail.push(pushItem);
      } else if (item.eventname === 'OWN_GOAL') {
        const pushItem = {
          eventname: item.eventname,
          time: item.time,
          minute: item.minute,
          name: compactName,
          team: this.switchTeamLocation(item.team),
          between: undefined
        };
        this.eventDetail.push(pushItem);
      } else if (item.eventname === 'ENTERED_PLAYER') {
        for (const compare of events) {
          if (item.minute === compare.minute && compare.eventname === 'SUBSTITUTED_PLAYER') {
            const pushItem = {
              eventname: item.eventname,
              time: item.time,
              minute: item.minute,
              name: compactName + ' (' + this.getCompactName(compare.firstName, compare.lastName) + ')',
              team: item.team,
              between: undefined
            };
            this.eventDetail.push(pushItem);
            break;
          }
        }
      } else if (item.eventname === 'SUBSTITUTED_PLAYER' || item.eventname === 'ASSIST') {
        continue;
      } else {
        const pushItem = {
          eventname: item.eventname,
          time: item.time,
          minute: item.minute,
          name: compactName,
          team: item.team,
          between: undefined
        };
        this.eventDetail.push(pushItem);
      }
    }
  }

  private switchTeamLocation(teamLocation: Location): Location {
    if (teamLocation === 'AWAY') {
      return 'HOME';
    } else {
      return 'AWAY';
    }
  }

  addFieldStatistic([events, statisticDetail]) {
    // let home_red: number = 0;
    // let home_yellow: number = 0;
    // let away_red: number = 0;
    // let away_yellow: number = 0;
    // for(let item of events) {
    //   if (item.eventname == "YELLOW_CARD") {
    //     if (item.team == "HOME") {
    //       home_yellow++;
    //     } else if(item.team == "AWAY") {
    //       away_yellow++;
    //     }
    //   } else if (item.eventname == "RED_CARD") {
    //     if (item.team == "HOME") {
    //       home_red++;
    //     } else if( item.team == "AWAY") {
    //       away_red++;
    //     }
    //   }
    // }
    // statisticDetail.h_RedCards = home_red;
    // statisticDetail.a_RedCards = away_red;
    // statisticDetail.h_yellowCards = home_yellow;
    // statisticDetail.a_yellowCards = away_yellow;


    let compare = 0;
    const arrays = Object.keys(statisticDetail).map(key => ({ type: key, value: statisticDetail[key] }));

    for (const item of arrays) {
      if (item.type === 'a_shots' || item.type === 'h_shots' || item.type === 'a_fouls' ||
        item.type === 'h_fouls' || item.type === 'a_yellowCards' || item.type === 'h_yellowCards' ||
        item.type === 'a_corners' || item.type === 'h_corners' || item.type === 'a_freekicks' ||
        item.type === 'h_freekicks' || item.type === 'a_offsides' || item.type === 'h_offsides') {
        if (item.value > compare) {
          compare = item.value;
        }
      }
    }
    if (compare > 20) {
      this.rate = 100 / compare;

    } else {
      this.rate = 5;
    }
  }

  teamLogoMissing(event) {
    event.target.src = AppConstants.MISSING_TEAM_LOGO_URL;
  }
}
