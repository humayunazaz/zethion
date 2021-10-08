import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { StorageService } from '../../_service/storage/storage.service'
import { CountryService } from '../../_service/country/country.service';
import { SportService } from '../../_service/sport/sport.service';
import { DataService } from '../../_service/data/data.service';
import { UpdateRegisterVisitorModal } from '../../_service/signin/user-modal';
import { SigninService } from '../../_service/signin/signin.service';
import { CookiesPreference } from '../modals/cookie-preference';
import {GLOBALSPORTS} from "../../../model/sports.model";


@Component({
  selector: 'app-search-dialog',
  templateUrl: './search-dialog.component.html',
  styleUrls: ['./search-dialog.component.scss']
})
export class SearchDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private matDialogRef: MatDialogRef<SearchDialogComponent>,
    private storagerService: StorageService,
    private countryService: CountryService,
    private sportService: SportService,
    private dataService: DataService,
    private signinService: SigninService
  ) {

      this.currShortcuts = data.shortcuts.map((item,index) => {
        item.selected = false;
        return item;
      });

    }


  currShortcuts: any[] = [];
  countries: any[] = [];
  sports: any[] = [];


  selectedSports: string[] = [];
  selectedCountries: string[] = [];
  query: string = "";
  cookiesConsentPreference: CookiesPreference;

  ngOnInit() {
    this.getCountries();
    this.getSports();
    this.cookiesConsentPreference = this.storagerService.getCookieConsent();
  }

  getCountries() {
    this.dataService.AllAvailableCountries.subscribe(
      (data) => {
        console.log(data);
        for (const country of data as any[]) {
          this.countries.push(country);
        }
        this.selectedCountries = this.storagerService.getCountries();
      },
      err => console.error(err)
    );
  }

  getSports() {
    for(const sport of GLOBALSPORTS as any[]){
      this.sports.push(sport);
    }
    this.selectedSports = this.storagerService.getSports();
    /*this.sportService.getSports().subscribe(
      (data) => {
        for(const sport of data as any[]){
          this.sports.push(sport);
        }
        this.selectedSports = this.storagerService.getSports();
      }
    )*/
  }


  selectTag(item){
    const tags = this.currShortcuts;
    const index = tags.findIndex(f=> f.id == item.id);
    tags[index].selected = !tags[index].selected;
    this.currShortcuts = tags;
  }


  clearTags(){
    this.currShortcuts = this.currShortcuts.map((item,index) => {
      item.selected = false;
      return item;
    })
  }

  async querySelected(selected: string) {
    this.query = selected;
  }

  closeDialog() {
    const selectedTags = this.currShortcuts.filter(f=> f.selected == true).map((item,index) => {return item.keyword});
    const data = {sports: this.selectedSports, countries: this.selectedCountries, query: this.query, tags : selectedTags};

    // Save the parameters to cookie
    this.storagerService.setCountries(this.selectedCountries);
    if (this.storagerService.getClientId() && this.cookiesConsentPreference.operational) {
      console.log('operational cookies are true');
      const updateRegisterUserCookies = new UpdateRegisterVisitorModal(
        this.storagerService.getClientId(), this.storagerService.getIP(),
        this.storagerService.getCountry(), 'USER_SPORT', this.selectedSports);
      updateRegisterUserCookies.setUserCustomizations('DEFAULT_LANGUAGE', [this.storagerService.getLanguage()]);
      updateRegisterUserCookies.setUserCustomizations('USER_LANGUAGES', this.storagerService.getUserLanguages());
      updateRegisterUserCookies.setUserCustomizations('COUNTRIES', this.storagerService.getCountries());
      this.signinService.updateVisitor(updateRegisterUserCookies).subscribe((response: any) => {
        this.storagerService.setSports(this.selectedSports);
      }, err => {
        console.log('the sport cookies couldnt set');
        this.storagerService.setSports(this.selectedSports);
      });
    }

    this.matDialogRef.close(data);
  }

}
