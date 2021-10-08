import { Component, OnInit, Inject } from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";

import { FootballTournamentResults, FootballStageResults } from './classifications-football.model';
import { TournamentsService } from 'src/app/shared/_service/tournaments/tournaments.service';

interface InputData {
  tournamentId: number;
  nation: string;
  tournamentName: string;
}

type ClassificationSection = 'regulars' | 'playoffs';

@Component({
  selector: 'app-classifications-football',
  templateUrl: './classifications-football.component.html',
  styleUrls: ['./classifications-football.component.scss']
})
export class ClassificationsFootballComponent implements OnInit {

  tournamentData: FootballTournamentResults;
  classificationStageData: FootballStageResults;
  knockoutStageData: FootballStageResults;
  tournamentInput: InputData;
  activeSection: ClassificationSection = 'regulars';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: InputData,
    private tournamentsService: TournamentsService
  ) {
    if (data) {
      console.log('ClassificationsFootballComponent: tournamentId:', data.tournamentId);
      this.tournamentInput = data;
    }

    // Forcing tournamentId to load existing data
    // this.tournamentInput.tournamentId = 11589;
    // this.tournamentInput.tournamentId = 128;
    // this.tournamentInput.tournamentId = 11623;

    this.tournamentsService.getTournamentStandings(this.tournamentInput.tournamentId)
      .subscribe((results: FootballTournamentResults) => {
        console.log(results);

        if (Array.isArray(results)) {
          for (const stageResults of results) {
            for (const groupResults of stageResults) {
              // groupResults.group.group = groupResults.group.group.split('_').join(' ');
              if (groupResults.stage.stageType === 'FOOTBALL_CLASSIFICATION') {
                this.classificationStageData = stageResults;
                break;
              } else {
                this.knockoutStageData = stageResults;
                break;
              }
            }
          }
        }

        this.tournamentData = results;
        // this.processClassificationData(this.classificationStageData);
      });
  }

  ngOnInit() {
  }

  activateSection(section: ClassificationSection) {
    console.log('Activating section:', section);
    this.activeSection = section;
  }

}
