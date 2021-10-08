import { Component, Input, LOCALE_ID, OnInit, ViewChild } from '@angular/core';
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
import { BasketballResults, BasketballResultsEntry } from '../../model/results-basketball.model';
import { TableDataResults } from '../../model/table-results.model';
import { ResultsService } from '../../shared/_service/results/results.service';
import { TournamentsService } from '../../shared/_service/tournaments/tournaments.service';
import { ResultParamsTable } from './../../model/results.model';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from "@angular/material/core";
import {MatDatepicker} from "@angular/material/datepicker";

declare var $: any;
const moment = _rollupMoment || _moment;


@Component({
  selector: 'app-results-basketball',
  templateUrl: './results-basketball.component.html',
  styleUrls: ['./results-basketball.component.scss'],
  providers: [
    OrderPipe,
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: MAT_MOMENT_DATE_FORMATS },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
    { provide: LOCALE_ID, useValue: { useUtc: true } }
  ]
})
export class ResultsBasketballComponent implements OnInit {

  public filtersLoaded: Promise<boolean>;
  myDate = new FormControl(moment());
  public loading = false;

  @ViewChild(MatDatepicker) datepicker: MatDatepicker<Date>;

  resultsParams: ResultParamsTable = {
    selectedSport: 'BASKETBALL',
    page: 0,
    size: 25,
    totalPages: 1,
    totalElements: 0,
    tableData: []
  };


  constructor(
    protected resultsService: ResultsService,
    protected tournamentsService: TournamentsService,
    private adapter: DateAdapter<any>,
    public datepipe: DatePipe,
    public filterPipe: FilterPipe,
    public orderPipe: OrderPipe,
    public groupByPipe: GroupByPipe) { }

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
      this.resultsParams.size).subscribe(
        (results: BasketballResults) => {
          this.resultsParams.totalPages = results.totalPages;
          this.resultsParams.totalElements = results.totalElements;
          for (const result of results.content) {
            this.setDataRow(result);
          }
          this.filtersLoaded = Promise.resolve(true);
          this.loading = false;
        },
        err => console.error(err)
      );
  }

  setDataRow(result: BasketballResultsEntry) {
    const tournament = result.tournamentStage.tournament;
    const tournamentId = tournament.id;

    let homeTeam = result.basketballMatchTeams[0];
    let awayTeam = result.basketballMatchTeams[1];
    if (homeTeam.location === 'AWAY') {
      homeTeam = awayTeam;
      awayTeam = result.basketballMatchTeams[0];
    }

    const tableDataRow: TableDataResults = {
      nation: tournament.competition.country.alpha2Code,
      tournamentId: tournamentId,
      tournamentName: tournament.competition.competitionName,
      matchId: result.id,
      homeTeam: homeTeam.team.name,
      homeTeamCode: homeTeam.team.mainCode,
      awayTeam: awayTeam.team.name,
      awayTeamCode: awayTeam.team.mainCode,
      homeScore: homeTeam.score,
      awayScore: awayTeam.score
    };
    this.resultsParams.tableData.push(tableDataRow);
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
