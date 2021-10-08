import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, OnChanges } from '@angular/core';
import { FormControl } from '@angular/forms';


import { Observable, of } from 'rxjs';
import { startWith, debounceTime, switchMap, map, filter, tap } from 'rxjs/operators';

import { TranslateService } from '@ngx-translate/core';
import { TournamentsService } from '../../_service/tournaments/tournaments.service';
import { Sport } from 'src/app/match/match.component';


@Component({
  selector: 'app-competition-autocomplete',
  templateUrl: './competition-autocomplete.component.html',
  styleUrls: ['./competition-autocomplete.component.scss']
})
export class CompetitionAutocompleteComponent implements OnInit, OnChanges {

  public results: Observable<any>;
  public searchQuery = '';
  @Input() type: string;
  @Input() sport: string;
  @Input() State: string = '';
  @Input() competitionControl: FormControl;
  @Input() public selectedSport: Sport;
  @Output() optionSelected = new EventEmitter<any>();

  constructor(
    private tournamentService: TournamentsService,
    private tranService: TranslateService,
  ) {
  }

  ngOnInit() {
    if (this.competitionControl) {
      this.searchQuery = this.competitionControl.value;
    }
    this.results = this.competitionControl.valueChanges.pipe(
      debounceTime(400),
      switchMap(value => {
        if (typeof value === 'string' && value.length >= 3) {
          return this.getCompetitions(value);
        }
        return of(null)
      }));
  }

  get formValid() {
    return this.competitionControl;
  }

  getCompetitions(filter: string) {
    return this.tournamentService.getCompetitions(this.selectedSport)
      .pipe(map(option => {
        return filter ? option.filter((data) => data.competitionName.toUpperCase().includes(filter.toUpperCase())) : []
      }));
  }

  changeSelection(data) {
    this.optionSelected.emit(data);
  }

  changeSelectionValue() {
    this.optionSelected.emit('');
    // if (this.place === '') {
    //   this.optionSelected.emit('');
    // }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.State === 'edit') {
      this.competitionControl.enable();
    } else if (this.State === 'save') {
      this.competitionControl.disable();
    }
  }

  displayFn(thisC): string {
    if (thisC) {
      return thisC['competitionName'];
    }
  }

}
