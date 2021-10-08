import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, OnChanges } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';


import { Observable, of } from 'rxjs';
import { startWith, debounceTime, switchMap, map, filter, tap } from 'rxjs/operators';

import { TranslateService } from '@ngx-translate/core';
import { PlaceService } from '../../_service/place/place.service';


@Component({
  selector: 'app-place-autocomplete',
  templateUrl: './place-autocomplete.component.html',
  styleUrls: ['./place-autocomplete.component.scss']
})
export class PlaceAutocompleteComponent implements OnInit, OnChanges {

  control = new FormControl('');

  public places: Observable<any[]>;
  public place = '';
  @Input() Place = '';
  @Input() State = '';
  @Input() placeControl: FormControl;
  @Output() optionSelected = new EventEmitter<any>();

  constructor(private placeService: PlaceService,
    private tranService: TranslateService,
  ) {
  }

  doFilter(value) {
    return this.getPlaces(value)
      .pipe(map(option => {
        if (!this.placeControl) {
          return option && option.length && option.filter((prediction) => !prediction.types.includes('country')) || []
        }
        return option && option.length &&
          option.filter((prediction) => !prediction.types.includes('country')).map((prediction) => {
            return {
              placeId: prediction.placeId,
              description: prediction.description
            }
          })
          || []
      }));
  }

  ngOnInit() {
    if (this.placeControl) {
      this.control = this.placeControl;
      this.place = this.placeControl.value;
    }
    this.places = this.control.valueChanges.pipe(
      debounceTime(400),
      switchMap(value => typeof value === 'string' ? this.doFilter(value) : of([])
      ));
  }

  get formValid() {
    return this.control;
  }

  getPlaces(val: string) {
    return this.placeService.getPlaces(val);
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
      this.control.enable();
    } else if (this.State === 'save') {
      this.control.disable();
    }
  }

  displayFn(thisC): string {
    if (thisC) {
      return thisC['description'];
    }
  }

}
