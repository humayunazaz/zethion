import { Component, EventEmitter, OnInit, Output, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

import { CountryService } from '../../_service/country/country.service';


@Component({
  selector: 'app-country-autocomplete',
  templateUrl: './country-autocomplete.component.html',
  styleUrls: ['./country-autocomplete.component.scss']
})
export class CountryAutocompleteComponent implements OnInit, OnChanges {

  control = new FormControl('', [this.customCountryValidator.bind(this)]);

  private countries: any[] = [];
  filteredCountries: Observable<any[]>;
  country = '';

  countryCode = '';
  @Input() Country = '';
  @Input() State = '';
  @Output('optionSelected') optionSelected = new EventEmitter<string>();

  constructor(private countryService: CountryService,
    private tranService: TranslateService,
  ) {
    this.control.disable();
  }

  private _filter(value: string): string[] {
    return this.countries.filter(country => country['country'].toLowerCase().includes(value.toLowerCase()));
  }

  private customCountryValidator(control: AbstractControl) {
    if (!this.countryCode || !this.countryCode.length) {
      return 'CountryCodeMissing';
    }
    return null;
  }

  ngOnInit() {
    this.getCountries();
    if (this.Country !== '') {
      this.country = this.Country;
    }
  }
  get formValid() {
    return this.control;
  }

  getCountries() {
    return this.countryService.getCountries(this.country).subscribe(
      (data) => {
        for (const country of data as any[]) {
          this.countries.push(country);
        }
        this.filteredCountries = this.control.valueChanges.pipe(
          startWith(''),
          map(value => this._filter(value))
        );
      },
      err => console.error(err)
    );
  }

  changeSelection(data) {
    this.countryCode = data;
    this.tranService.get('COUNTRY.' + this.countryCode).subscribe(result => {
      this.country = result;
      this.optionSelected.emit(this.countryCode);
    });
  }

  changeSelectionValue() {
    if (this.country === '') {
      this.optionSelected.emit('');
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.State === 'edit') {
      this.control.enable();
    } else if (this.State === 'save') {
      this.control.disable();
    }
  }

  displayFn(thisC): string {
    return thisC;
  }
}
