import { Component, Input, OnInit, SimpleChanges, OnChanges, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';

import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { TranslateService } from '@ngx-translate/core';
import { startWith, debounceTime, switchMap, map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

import { QueryService } from "../../_service/query/query.service";
import { DataService } from '../../_service/data/data.service';

@Component({
  selector: 'app-query-autocomplete',
  templateUrl: './query-autocomplete.component.html',
  styleUrls: ['./query-autocomplete.component.scss']
})
export class QueryAutocompleteComponent implements OnInit, OnChanges {

  control = new FormControl('');
  @ViewChild(MatAutocompleteTrigger) private inputAutoComplete: MatAutocompleteTrigger;

  public queries: Observable<any[]>;
  public query = '';
  @Input() Query = '';
  @Input() State = '';
  @Output() queryChanged = new EventEmitter<string>();
  loader = false;
  constructor(private queryService: QueryService,
    private tranService: TranslateService,
    protected data: DataService
  ) {
  }

  doFilter(value) {
    //console.log("this.query", value);
    if (value !== '') {
      const globalRet = {
        globalResults: []
      };
      const ret = this.getQueries(value)
        .pipe(
          map(response => {
            this.clearAllInterval();
            return globalRet.globalResults.concat(
              response.clientQueriesAutocomplete,
              response.allQueriesAutocomplete,
              response.googleAutocomplete)
          }
          ));

      // //console.log(ret);
      return ret;
    } else {
      return [];
    }
  }

  ngOnInit() {
    this.queries = this.control.valueChanges.pipe(
      startWith(''),
      debounceTime(400),
      switchMap(value => this.doFilter(this.query))
    );

    this.data.getLoader().subscribe(loader => {
      this.data.getIsLangChange().subscribe(langchanges => {
        //console.log('langchanges', langchanges);
        if (langchanges === true) {
          this.query = '';
        }
      });
      this.data.getQueryLoader().subscribe(Loader => {
        //console.log('QueryLoader', Loader)
        this.loader = Loader;
        if (this.loader === false) {
          this.query = '';
        }
      });
    });
  }

  get formValid() {
    return this.control;
  }

  getQueries(val: string) {
    return this.queryService.getQueries(val);
  }

  changeSelection(data: string) {
    this.queryChanged.emit(data);
    // this.comp.querySelected(data);
  }

  closePanel(evt): void {
    evt.stopPropagation();
    this.inputAutoComplete.closePanel();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.State === 'edit') {
      //console.log('edit state');
      this.control.enable();
    } else if (this.State === 'save') {
      //console.log('save state');
      this.control.disable();
    }
  }

  displayFn(thisC): string {
    return thisC['description'];
  }


  onEnterPressed() {
    //console.log('QueryAutocompleteComplonent, Enter pressed.');
    this.changeSelection(this.query);
    this.inputAutoComplete.closePanel();
  }

  clearAllInterval(): void {
    if (this.data.intervalId.length) {
      for (let i = 0; i < this.data.intervalId.length; i += 1) {
        clearInterval(this.data.intervalId[i]);
      }
      this.data.intervalId = [];
    }
  }


}
