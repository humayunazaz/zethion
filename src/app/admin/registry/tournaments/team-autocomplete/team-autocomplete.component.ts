import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, OnChanges } from '@angular/core';
import { FormControl } from '@angular/forms';


import { Observable, of } from 'rxjs';
import { startWith, debounceTime, switchMap, map, filter, tap } from 'rxjs/operators';

import { TranslateService } from '@ngx-translate/core';
import { TeamService } from '../../../../shared/_service/team/team.service';


@Component({
  selector: 'app-team-autocomplete',
  templateUrl: './team-autocomplete.component.html',
  styleUrls: ['./team-autocomplete.component.scss'],
})
export class TeamAutocompleteComponent implements OnInit, OnChanges {

  public results: Observable<any[]>;
  public searchQuery = '';
  @Input() type: string;
  @Input() sport: string;
  @Input() State: string = '';
  @Input() teamControl: FormControl;
  @Output() optionSelected = new EventEmitter<any>();

  constructor(
    private teamService: TeamService,
    private tranService: TranslateService,
  ) {
  }

  ngOnInit() {
    if (this.teamControl) {
      this.searchQuery = this.teamControl.value;
    }
    this.results = this.teamControl.valueChanges.pipe(
      debounceTime(400),
      switchMap(value => {
        if (typeof value === 'string' && value.length >= 3) {
          const data = {
            sport: this.sport,
            query: value
          }
          return this.getTeams(data);
        }
        return of(null)
      }));
  }

  get formValid() {
    return this.teamControl;
  }

  getTeams(data: any) {
    console.log('🚀 ~ file: team-autocomplete.component.ts ~ line 58 ~ TeamAutocompleteComponent ~ getTeams ~ this.type', this.type);
    return this.teamService.getTeams(data)
      .pipe(map(option => {
        return option || []
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
      this.teamControl.enable();
    } else if (this.State === 'save') {
      this.teamControl.disable();
    }
  }

  displayFn(thisC): string {
    if (thisC) {
      return thisC['name'];
    }
  }

}
