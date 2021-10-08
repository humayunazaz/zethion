import { Component, OnInit, LOCALE_ID } from '@angular/core';
import { DatePipe } from '@angular/common';

import {
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter
} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from "@angular/material/core";
import * as _moment from 'moment';
import { default as _rollupMoment } from 'moment';

import { OrderPipe, FilterPipe, GroupByPipe } from 'src/app/results/table-result/table-pipe.pipe';
import { SportType } from './../../model/sports.model';
import { TournamentChoice } from '../../shared/sport/tournament-select/tournament-select.component';
import { TournamentsService } from '../../shared/_service/tournaments/tournaments.service';
import { ResultsService } from 'src/app/shared/_service/results/results.service';
import { Formula1ResultsEntry, Formula1Tournament } from '../../model/results-formula1.model';


const moment = _rollupMoment || _moment;

@Component({
  selector: 'app-results-formula1',
  templateUrl: './results-formula1.component.html',
  styleUrls: ['./results-formula1.component.scss'],
  providers: [
    OrderPipe,
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: MAT_MOMENT_DATE_FORMATS },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
    { provide: LOCALE_ID, useValue: { useUtc: true } }
  ]
})
export class ResultsFormula1Component implements OnInit {

  public readonly selectedSport: SportType = 'FORMULA1';

  public gpChoices: TournamentChoice[] = [];
  public formula1Results: Formula1ResultsEntry[];
  public filtersLoaded: Promise<boolean>;
  public filtersLoadedResults: Promise<boolean>;
  public selectedTournamentId: number;

  constructor(
    protected resultsService: ResultsService,
    protected tournamentsService: TournamentsService,
    public datepipe: DatePipe,
    public filterPipe: FilterPipe,
    public orderPipe: OrderPipe,
    public groupByPipe: GroupByPipe) { }

  ngOnInit() {
    this.getGpChoices();
  }

  gpChanged(tournamentId: number) {
    this.selectedTournamentId = tournamentId;
    this.getResults();
  }

  getGpChoices() {
    const now = new Date();
    now.setDate(now.getDate() + 3);
    const limitDate = moment(now).format('yyyy-MM-DD');
    return this.tournamentsService.getTournaments(this.selectedSport, limitDate).subscribe(
      (tournaments: Formula1Tournament[]) => {
        for (const tournament of tournaments) {
          this.setTournament(tournament);
        }
        this.filtersLoaded = Promise.resolve(true);

        if (this.gpChoices.length) {
          this.selectedTournamentId = this.gpChoices[0].id;
        }
      },
      err => console.error(err)
    );
  }

  setTournament(tournament: Formula1Tournament) {
    const choice: TournamentChoice = {
      id: tournament.id,
      name: tournament.competition.competitionName
    };
    this.gpChoices.push(choice);
  }

  getResults() {
    return this.resultsService.getResultsByTournament(
      this.selectedSport,
      this.selectedTournamentId
    ).subscribe(
      (data: Formula1ResultsEntry[]) => {
        this.formula1Results = data;
        this.filtersLoadedResults = Promise.resolve(true);
      },
      err => console.error(err)
    );
  }

}
