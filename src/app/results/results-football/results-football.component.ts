import { Component, LOCALE_ID, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DatePipe } from '@angular/common';
import {
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter
} from '@angular/material-moment-adapter';

import * as _moment from 'moment';
import { default as _rollupMoment } from 'moment';
import { FilterPipe, GroupByPipe, OrderPipe } from '../table-result/table-pipe.pipe';

import { FootballResultsEntry, FootballResults } from '../../model/results-football.model';
import { MatchResultService } from 'src/app/shared/_service/match-result/football-match-result.service';
import { TournamentsService } from '../../shared/_service/tournaments/tournaments.service';
import { ResultsService } from '../../shared/_service/results/results.service';
import { ResultParamsTable } from '../../model/results.model';
import { FootballTableDataResults } from '../../model/table-results.model';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from "@angular/material/core";
import {MatDatepicker} from "@angular/material/datepicker";

declare var $: any;
const moment = _rollupMoment || _moment;


@Component({
  selector: 'app-results-football',
  templateUrl: './results-football.component.html',
  styleUrls: ['./results-football.component.scss'],
  providers: [
    OrderPipe,
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: MAT_MOMENT_DATE_FORMATS },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
    { provide: LOCALE_ID, useValue: { useUtc: true } }
  ]
})
export class ResultsFootballComponent implements OnInit {

  public filtersLoaded: Promise<boolean>;
  myDate = new FormControl(moment());

  @ViewChild(MatDatepicker) datepicker: MatDatepicker<Date>;

  private SPORT = 'FOOTBALL';
  public loading = false;

  resultsParams: ResultParamsTable = {
    selectedSport: 'FOOTBALL',
    page: 0,
    size: 25,
    totalPages: 1,
    totalElements: 0,
    tableData: []
  };

  private adapter: DateAdapter<any>;


  constructor(
    protected resultsService: ResultsService,
    protected tournamentsService: TournamentsService,
    public datepipe: DatePipe,
    public filterPipe: FilterPipe,
    public orderPipe: OrderPipe,
    public groupByPipe: GroupByPipe,
    protected matchResultService: MatchResultService) { }

  ngOnInit() {
    this.getResults();
  }

  getResults() {
    this.loading = true;
    const currentChoiceDate = this.myDate.value.format('yyyy-MM-DD');
    return this.resultsService.getResultsByMatchDate(
      this.resultsParams.selectedSport,
      currentChoiceDate,
      this.resultsParams.page,
      this.resultsParams.size).subscribe((data: FootballResults) => {
        this.resultsParams.totalPages = data.totalPages;
        this.resultsParams.totalElements = data.totalElements;
        for (const result of data.content) {
          this.setDataRow(result);
        }
        this.filtersLoaded = Promise.resolve(true);
        this.loading = false;
      },
        err => {
          console.error(err);
          this.loading = false;
        }

      );
  }

  setDataRow(result: FootballResultsEntry) {
    const tournament = result.tournamentStage.tournament;
    const tournamentId = tournament.id;
    if (result.footballmatchTeams.length === 2) {
      let homeTeam = result.footballmatchTeams[0];
      let awayTeam = result.footballmatchTeams[1];
      if (homeTeam.location === 'AWAY') {
        homeTeam = awayTeam;
        awayTeam = result.footballmatchTeams[0];
      }
      const tableDataRow: FootballTableDataResults = {
        nation: tournament.competition.country.alpha2Code,
        tournamentId: tournamentId,
        tournamentName: tournament.competition.competitionName,
        matchId: result.id,
        matchDate: result.matchDate,
        matchTime: result.time,
        homeTeamId: homeTeam.team.id,
        homeTeam: homeTeam.team.name,
        homeTeamCode: homeTeam.team.mainCode,
        homeTeamshots: homeTeam.shots,
        homeTeamshotsOnGoal: homeTeam.shotsOnGoal,
        homeTeamcorners: homeTeam.corners,
        homeTeamfreekicks: homeTeam.freekicks,
        homeTeamfouls: homeTeam.fouls,
        homeTeamoffsides: homeTeam.offsides,
        awayTeamId: awayTeam.team.id,
        awayTeam: awayTeam.team.name,
        awayTeamCode: awayTeam.team.mainCode,
        awayTeamshots: awayTeam.shots,
        awayTeamshotsOnGoal: awayTeam.shotsOnGoal,
        awayTeamcorners: awayTeam.corners,
        awayTeamfreekicks: awayTeam.freekicks,
        awayTeamfouls: awayTeam.fouls,
        awayTeamoffsides: awayTeam.offsides,
        homeScore: homeTeam.score + (homeTeam.overtimeScore || 0),
        homeOvertimeScore: homeTeam.overtimeScore,
        homePenaltyScore: homeTeam.penaltyScore,
        awayScore: awayTeam.score + (awayTeam.overtimeScore || 0),
        awayOvertimeScore: awayTeam.overtimeScore,
        awayPenaltyScore: awayTeam.penaltyScore,
        isStatistics: undefined
      };
      this.resultsParams.tableData.push(tableDataRow);
      // this.getIsStatics(tableDataRow);
    }
  }
  getIsStatics(tableDataRow: FootballTableDataResults) {
    return this.matchResultService.getFootBallMatchResult(tableDataRow.matchId).subscribe(
      (e: FootballResultsEntry) => {
        tableDataRow.isStatistics = e.matchPlayers.length;
        this.resultsParams.tableData.push(tableDataRow);
      },
      err => console.log(err)
    );
  }

  handleScroll = () => {
    if (this.resultsParams.page < this.resultsParams.totalPages - 1 &&
      this.resultsParams.size * (this.resultsParams.page + 1) < this.resultsParams.totalElements) {
      this.resultsParams.page += 1;
      this.getResults();
    }
  }

  onDate(): void {
    this.resultsParams.tableData = [];
    this.resultsParams.page = 0;
    this.getResults();
  }
}
