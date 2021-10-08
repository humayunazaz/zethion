import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';

import { TournamentChoice } from 'src/app/shared/sport/tournament-select/tournament-select.component';
import { TournamentsService } from 'src/app/shared/_service/tournaments/tournaments.service';
import { ResultsService } from 'src/app/shared/_service/results/results.service';
import { Formula1Tournament, Formula1ResultsEntry } from 'src/app/model/results-formula1.model';
import { SportType } from 'src/app/model/sports.model';

@Component({
  selector: 'app-dashboard-formula1',
  templateUrl: './dashboard-formula1.component.html',
  styleUrls: ['./dashboard-formula1.component.css']
})
export class DashboardFormula1Component implements OnInit {

  public readonly selectedSport: SportType = 'FORMULA1';

  public gpChoices: TournamentChoice[] = [];
  public filtersLoadedResults: Promise<boolean>;
  public outputSelectedTournament: number;
  public data: Formula1ResultsEntry[];
  public filtersLoaded: Promise<boolean>;


  private selectedTournament: number;

  constructor(
    protected resultsService: ResultsService,
    protected tournamentsService: TournamentsService,
    public datepipe: DatePipe) { }

  ngOnInit() {
    this.getGpChoices();
  }

  gpChanged(data: number) {
    console.log('Formula1 selected tournament id', data);
    this.selectedTournament = data;
    this.getResults();
  }

  getGpChoices() {
    const now = new Date();
    now.setDate(now.getDate() + 3);
    const limitDate = this.datepipe.transform(now, 'yyyy-MM-dd');
    return this.tournamentsService.getTournaments(
      this.selectedSport,
      limitDate).subscribe((data: Formula1Tournament[]) => {
        for (const tournament of data) {
          this.setChoices(tournament);
        }
        this.filtersLoaded = Promise.resolve(true);

        // Set to Australian Grand Prix
        this.outputSelectedTournament = this.gpChoices.find(choice =>
          choice.name.includes('Australian')).id;
      },
        err => console.error(err)
      );
  }

  setChoices(tournament: Formula1Tournament) {
    const choice = {
      id: tournament.id,
      name: tournament.competition.competitionName
    };
    this.gpChoices.push(choice);
  }

  getResults() {
    return this.resultsService.getResultsByTournament(
      this.selectedSport,
      this.selectedTournament
    ).subscribe(
      (data: Formula1ResultsEntry[]) => {
        console.log('getResultsByTournament', data);
        this.data = data;
        this.filtersLoadedResults = Promise.resolve(true);
      },
      err => console.error(err)
    );
  }
}
