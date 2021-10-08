import { Router } from '@angular/router';
import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { Location, LocationStrategy, PathLocationStrategy, PopStateEvent } from '@angular/common';

import { TranslateService } from "@ngx-translate/core";

import { DataService } from "../_service/data/data.service";
import { StorageService } from './../_service/storage/storage.service';
import { AppConstants } from 'src/app/app-constants';
import { UpdateRegisterVisitorModal } from '../_service/signin/user-modal';
import { SigninService } from '../_service/signin/signin.service';
import { isEqual } from "lodash-es";

@Component({
  selector: 'app-language',
  templateUrl: './language.component.html',
  styleUrls: ['./language.component.scss']
})
export class LanguageComponent implements OnInit {
  countriesList = AppConstants.SORTED_COUNTRIES;
  language: string;
  @Output() languageSelected = new EventEmitter();
  sortedLanguages = AppConstants.SORTED_LANGUAGES;
  displayedCountries = [];
  selectedCountries = [];
  preSelectedCountries = [];
  openModal = false;
  countriesChange = false;
  selectedLanguage: string;
  preSelectedLanguage: string;

  constructor(
    public translate: TranslateService,
    private data: DataService,
    private location: Location,
    private storageService: StorageService,
    private signInService: SigninService
  ) {
  }

  ngOnInit() {
    // this.data.getAppLanguage().subscribe(language => this.language = language);
    this.language = this.storageService.getLanguage();
    this.selectedLanguage = this.storageService.getLanguage();
    console.log('🚀 ~ file: language.component.ts ~ line 42 ~ LanguageComponent ~ ngOnInit ~ this.selectedLanguage', this.selectedLanguage);
    // this.selectedCountries = this.storageService.getCountries();
    this.countriesList.forEach(singleCountry => {
      const updatedCountry = { selected: false, ...singleCountry };
      if (this.storageService.getCountries().includes(singleCountry.alphaTwoCode)) {
        updatedCountry.selected = true;
        this.selectedCountries.push(updatedCountry);
      }
      this.displayedCountries.push(updatedCountry);
    });
    this.preSelectedCountries = [...this.selectedCountries];
    this.preSelectedLanguage = this.selectedLanguage;
  }

  onChange(checked, country) {
    checked ? this.selectedCountries.push(country) : this.removeCountry(country.alphaTwoCode);
    this.countriesChange = true;
  }

  languageSelect(language) {
    console.log('🚀 ~ file: language.component.ts ~ line 60 ~ LanguageComponent ~ languageSelect ~ language', language);
    this.selectedLanguage = language;
  }

  removeCountry(id) {
    let matchedIndex;
    this.selectedCountries.forEach((singleCountry: any, index) => {
      if (singleCountry.alphaTwoCode === id) {
        matchedIndex = index;
      }
    });
    this.selectedCountries.splice(matchedIndex, 1);
  }

  manageModalState() {
    if (this.openModal && this.countriesChange) {
      this.useLanguage(this.storageService.getLanguage());
    } else {
      this.openModal = !this.openModal;
    }
  }

  useLanguage(language: string) {
    // this.countriesChange = false;
    // this.data.countriesUpdated.next(false);
    if (this.openModal) {
      this.openModal = false;
    }
    // console.log(this.countriesChange);
    this.setSelectedCountry(this.selectedCountries, this.selectedLanguage);
    this.languageSelected.emit(this.selectedLanguage);
    this.translate.use(this.selectedLanguage);
  }

  filter(): void {
    if (!isEqual(this.preSelectedCountries, this.selectedCountries) || this.selectedLanguage !== this.preSelectedLanguage) {
      this.setSelectedCountry(this.selectedCountries, this.selectedLanguage);
      this.languageSelected.emit(this.selectedLanguage);
      this.translate.use(this.selectedLanguage);
      this.preSelectedCountries = [...this.selectedCountries];
      this.preSelectedLanguage = this.selectedLanguage;
      this.data.isSlideEmpty = false;
      this.data.isLoaded = false;
    }
  }

  getLanguageFlag(): string {
    return this.translate.currentLang;
  }

  setSelectedCountry(countries: any[], language: string) {
    const countriesId = [];
    const userLanguages = [language];
    countries.forEach(singleContry => {
      countriesId.push(singleContry.alphaTwoCode);
      singleContry.languages.forEach(singleLanguage => {
        if (!userLanguages.includes(singleLanguage)) {
          userLanguages.push(singleLanguage);
        }
      });
    });
    // console.log(userLanguages);
    if (this.storageService.getClientId()) {
      const updateRegisterVisitor = this.registerUserUpdatedCookies('USER_LANGUAGES', userLanguages);
      updateRegisterVisitor.setUserCustomizations('DEFAULT_LANGUAGE', [language]);
      updateRegisterVisitor.setUserCustomizations('COUNTRIES', countriesId);
      let updateSports = [];
      this.storageService.getSports().length > 0 ?
        updateSports = this.storageService.getSports() : updateSports = this.storageService.getCompleteSportsList();
      updateRegisterVisitor.setUserCustomizations('USER_SPORT', updateSports);
      updateRegisterVisitor.setUserCookieCustomizations('COOKIE', this.storageService.getCookieConsent());
      // console.log(updateRegisterVisitor);
      this.signInService.updateVisitor(updateRegisterVisitor).subscribe((res: any) => {
        this.updateVisitorCookies(countriesId, userLanguages, language);
        this.countriesChange = false;
      }, err => {
        console.log('the update visitor failed but values saved inside the cookies');
        this.updateVisitorCookies(countriesId, userLanguages, language);
      });
    } else {
      console.log('the visitor is not register yet but its values are saved inside the cookies');
    }
  }

  updateVisitorCookies(countriesId, userLanguages, language) {
    this.storageService.setCountries(countriesId);
    this.storageService.setUserLanguages(userLanguages);
    this.storageService.setLanguage(language);
    this.data.setCountries(countriesId);
    this.data.setUserLanguages(userLanguages);
    this.data.setAppLanguage(language);
  }

  registerUserUpdatedCookies(customCode: string, customItem: string[]) {
    return new UpdateRegisterVisitorModal(
      this.storageService.getClientId(), this.storageService.getIP(), this.storageService.getCountry(), customCode, customItem);
  }

  public isNews() {
    if (this.location.prepareExternalUrl(this.location.path()) === '/news') {
      return true;
    } else {
      return false;
    }
  }

}
