import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormControl } from '@angular/forms';
import * as _moment from 'moment';
import { default as _rollupMoment } from 'moment';
const moment = _rollupMoment || _moment;

import { ResultsService } from 'src/app/shared/_service/results/results.service';
import { ResultParamsTable } from 'src/app/model/results.model';
import { BasketballResults, BasketballResultsEntry } from 'src/app/model/results-basketball.model';

@Component({
  selector: 'app-dashboard-basketball',
  templateUrl: './dashboard-basketball.component.html',
  styleUrls: ['./dashboard-basketball.component.css']
})
export class DashboardBasketballComponent implements OnInit {

  public filtersLoaded: Promise<boolean>;
  myDate = new FormControl(moment());
  resultsParams: ResultParamsTable = {
    selectedSport: 'BASKETBALL',
    page: 0,
    size: 25,
    totalPages: 1,
    totalElements: 0,
    tableData: []
  };

  constructor(
    private resultsService: ResultsService,
    private datepipe: DatePipe,
  ) { }

  ngOnInit() {
    this.getResults();
  }

  getResults() {
    const currentChoiceDate = this.datepipe.transform(this.myDate.value.toDate(), 'yyyy-MM-dd');
    return this.resultsService.getResultsByMatchDate(
      this.resultsParams.selectedSport,
      currentChoiceDate,
      this.resultsParams.page,
      this.resultsParams.size).subscribe((data: BasketballResults) => {
        console.log('Basketball dashboard component data:', data);
        this.resultsParams.totalPages = data.totalPages;
        this.resultsParams.totalElements = data.totalElements;
        for (const result of data.content) {
          this.setDataRow(result);
        }
        this.filtersLoaded = Promise.resolve(true);
      },
        err => console.error(err)
      );
  }

  setDataRow(result: BasketballResultsEntry) {
    const tournamentId = result.tournamentStage.tournament.id;

    //TODO every switch home-away must be generalized in father component/common utils
    let homeTeam = result.basketballMatchTeams[0];
    let awayTeam = result.basketballMatchTeams[1];
    if (homeTeam.location === 'AWAY') {
      homeTeam = awayTeam;
      awayTeam = result.basketballMatchTeams[0];
    }
    const tableDataRow = {
      nation: result.tournamentStage.tournament.competition.country.alpha2Code,
      tournamentId: tournamentId,
      tournamentName: result.tournamentStage.tournament.competition.competitionName,
      matchId: result.id,
      homeTeam: homeTeam.team.name,
      homeTeamCode: homeTeam.team.mainCode,
      awayTeam: awayTeam.team.name,
      awayTeamCode: awayTeam.team.mainCode,
      homeScore: homeTeam.score,
      awayScore: awayTeam.score,
      // prestige: prestige
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

}
