import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormControl } from '@angular/forms';
import * as _moment from 'moment';
import { default as _rollupMoment } from 'moment';

import { FilterPipe, GroupByPipe, OrderPipe } from '../../table-result/table-pipe.pipe';
import { ResultsFootballComponent } from '../../results-football/results-football.component';
import { MatchResultService } from 'src/app/shared/_service/match-result/football-match-result.service';
import { TournamentsService } from 'src/app/shared/_service/tournaments/tournaments.service';
import { ResultsService } from 'src/app/shared/_service/results/results.service';
import { ResultParamsTable } from 'src/app/model/results.model';

const moment = _rollupMoment || _moment;

@Component({
  selector: 'app-dashboard-football',
  templateUrl: './dashboard-football.component.html',
  styleUrls: ['./dashboard-football.component.css']
})
export class DashboardFootballComponent extends ResultsFootballComponent {

  public filtersLoaded: Promise<boolean>;
  myDate = new FormControl(moment());

  resultsParams: ResultParamsTable = {
    selectedSport: 'FOOTBALL',
    page: 0,
    size: 25,
    totalPages: 1,
    totalElements: 0,
    tableData: []
  };

  constructor(
    protected resultsService: ResultsService,
    protected tournamentsService: TournamentsService,
    public datepipe: DatePipe,
    public filterPipe: FilterPipe,
    public orderPipe: OrderPipe,
    public groupByPipe: GroupByPipe,
    protected matchResultService: MatchResultService
  ) {
    super(resultsService, tournamentsService, datepipe, filterPipe, orderPipe, groupByPipe, matchResultService);
  }

}
