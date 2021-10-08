import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

import {
  Formula1ResultsEntry, Formula1Pilot,
  Formula1Manche, Formula1MancheResult
} from 'src/app/model/results-formula1.model';
import { Formula1DataSession, Formula1DataSessionResult } from './table-results-formula1.model';
import { GroupByPipe, GroupByPipeObj, OrderPipe } from './../table-pipe.pipe';
import { AppConstants } from 'src/app/app-constants';

@Component({
  selector: 'app-table-results-formula1',
  templateUrl: './table-results-formula1.component.html',
  styleUrls: ['./table-results-formula1.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [GroupByPipe, OrderPipe, GroupByPipeObj]
})
export class TableResultsFormula1Component implements OnInit {

  @Input()
  public data: Formula1ResultsEntry[];
  @Input()
  public selectedSport: string;

  private dataSession: Formula1DataSession;
  public dataPresentation: Formula1DataSession[] = [];
  public url_logo_teams: string;

  private readonly ASSETS_URL_LOGO_TEAMS = AppConstants.ASSETS_URL_LOGO_TEAMS;

  constructor(
    private orderPipe: OrderPipe,
    private groupByObj: GroupByPipeObj) {
  }

  ngOnInit() {
    this.getDataPresentation();
    this.url_logo_teams = this.ASSETS_URL_LOGO_TEAMS + '/' + this.selectedSport;
  }

  getDataPresentation() {

    for (const resultsEntry of this.data) {
      this.dataSession = null;
      this.setDataSession(resultsEntry);
      this.dataPresentation.push(this.dataSession);
    }
  }

  setDataSession(resultsEntry: Formula1ResultsEntry) {
    const tournament = resultsEntry.tournamentStage.tournament;
    this.dataSession = {
      numberOfManches: [],
      session: resultsEntry.id,
      nation: tournament.competition.country.alpha2Code,
      tournamentId: tournament.id,
      tournamentName: tournament.competition.competitionName,
      sessionType: resultsEntry.session,
      results: []
    };

    for (const pilotMatch of resultsEntry.matchPilots) {
      this.setPilotResultsBase(pilotMatch);
    }

    let i = 0;
    for (const manche of resultsEntry.manches) {
      this.dataSession.numberOfManches.push({ manche: i });
      this.setDataManche(manche);
      ++i;
    }
  }

  setPilotResultsBase(pilotMatch: Formula1Pilot) {
    const pilot = pilotMatch.athlete;
    const team = pilotMatch.team;
    const pilotResultsBase: Formula1DataSessionResult = {
      pilotId: pilot.id,
      pilotName: pilot.firstName,
      pilotSurname: pilot.lastName,
      pilotCompactName: `${pilot.lastName} ${pilot.firstName.charAt(0)}.`,
      teamID: team['id'],
      team: team['name'],
      position: undefined,
      startingPosition: undefined,
      difference: undefined,
      fastestLap: [],
      speedTrap: undefined,
      laps: undefined,
      finalResult: undefined,
      absoluteFastestLap: undefined
    };
    this.dataSession.results.push(pilotResultsBase);
  }

  setDataManche(manche: Formula1Manche) {
    for (const result of manche.results) {
      this.setPilotResults(result, manche.id);
    }
  }

  setPilotResults(result: Formula1MancheResult, mancheId: number) {
    for (const pilotResultIndex in this.dataSession.results) {
      if ((result.athlete.firstName === this.dataSession.results[pilotResultIndex].pilotName) &&
        (result.athlete.lastName === this.dataSession.results[pilotResultIndex].pilotSurname)) {

        const activeResults = this.dataSession.results[pilotResultIndex];

        if (result.position !== undefined) {
          activeResults.position = result.position;
        }
        if (result.fastestLap !== undefined) {
          activeResults.fastestLap.push(
            {
              time: result.fastestLap,
              manche: mancheId
            });
          if (result.absoluteFastestLap === undefined ||
            result.fastestLap < activeResults.absoluteFastestLap) {
            activeResults.absoluteFastestLap = result.fastestLap;
          }
        }
        if (result.startingPosition !== undefined) {
          activeResults.startingPosition = result.startingPosition;
        }
        if (result.finalResult !== undefined) {
          activeResults.finalResult = result.finalResult;
        }
        if (result.speedTrap !== undefined) {
          activeResults.speedTrap = result.speedTrap;
        }
        if (result.laps !== undefined) {
          activeResults.laps = result.laps;
        }

        activeResults.difference =
          activeResults.startingPosition - activeResults.position;
      }

    }
  }

  teamLogoMissing(event) {
    event.target.src = AppConstants.MISSING_TEAM_LOGO_URL;
  }

}
