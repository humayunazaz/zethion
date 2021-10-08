import {Component, EventEmitter, OnInit, Output, Input} from '@angular/core';
import { FormControl } from '@angular/forms';
import { CountryService } from '../../_service/country/country.service';


@Component({
  selector: 'app-country-select',
  templateUrl: './country-select.component.html',
  styleUrls: ['./country-select.component.css']
})
export class CountrySelectComponent implements OnInit {

  public countries: Array<any> = [];
  public selectedCountry: any;
  @Input() countryControl: FormControl;
  @Output() selected = new EventEmitter<any>();
  @Output() countryList = new EventEmitter<Array<any>>();
  @Input() hideAll: boolean = false;

  private ALL: string = "ALL";

  constructor(private countryService: CountryService) { }

  ngOnInit() {
    if (this.countryControl) {
      this.selectedCountry = this.countryControl.value;
    }
    if(this.hideAll == false){
      this.countries.push({code: this.ALL});
    }
    this.getCountries();
    this.selected.emit(this.selectedCountry);
    this.countryList.emit(this.countries);
  }

  changeCountry(data) {
    this.selectedCountry = data;
    this.selected.emit(this.selectedCountry);
  }

  getCountries() {
    return this.countryService.getCountries("").subscribe(
      data => {
        for (const country of data as any[]) {
          this.countries.push(country);
        }
      },
      err => console.error(err)
    );
  }

}
