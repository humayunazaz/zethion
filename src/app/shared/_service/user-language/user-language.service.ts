import { Injectable } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { StorageService } from './../storage/storage.service';
import { CountryService } from './../country/country.service';
import { DataService } from './../data/data.service';

@Injectable({
  providedIn: 'root'
})
export class UserLanguageService {

  constructor(
    private storageService: StorageService,
    private countryService: CountryService,
    private translateService: TranslateService,
    private dataService: DataService
  ) { }

  // async retrieveUserLanguage(countryId: string) {

  //   let language: string;
  //   await (async () => {
  //     // Retrieve language from storage
  //     language = this.storageService.getLanguage();
  //     if (language) {
  //       this.printStatus('language', 'storage', language);
  //       return;
  //     }

  //     // If not found use language from window.navigator
  //     language = this.getLanguageFromWindowNavigator();
  //     if (language) {
  //       this.printStatus('language', 'window.navigator', language);
  //       return;
  //     }

  //     // If this fails retrieve language from country id
  //     language = await this.getLanguageFromCountryId(countryId);
  //     if (language) {
  //       this.printStatus('language', 'language-from-country', language);
  //       return;
  //     } else {
  //       // Final fallback: 'en'
  //       language = 'en';
  //       console.log(`Language was defaulted to [${language}]`);
  //     }
  //   })();

  //   // Save language to storage
  //   this.storageService.setLanguage(language);
  //   // Update translation service
  //   this.translateService.setDefaultLang(language);
  //   this.translateService.currentLang = language;
  //   // Update data service
  //   this.dataService.setAppLanguage(language);

  //   await this.retrieveUserLanguages(countryId);
  // }

  // private async retrieveUserLanguages(countryId: string) {

  //   // Retrieve language from storage
  //   let languages = this.storageService.getUserLanguages();
  //   if (languages && languages.length > 0) {
  //     this.printStatus('languages', 'storage', JSON.stringify(languages));
  //     return;
  //   }
  //   languages = [];
  //   const languagesSet = new Set<string>();
  //   const navLanguage = this.getLanguageFromWindowNavigator();
  //   if (navLanguage) {
  //     languagesSet.add(navLanguage);
  //   }

  //   const countryLanguage = await this.getLanguageFromCountryId(countryId);
  //   if (countryLanguage) {
  //     languagesSet.add(countryLanguage);
  //   }
  //   languages = Array.from(languagesSet);
  //   this.printStatus('languages', 'window.navigator+language-from-country', JSON.stringify(languages));

  //   this.storageService.setUserLanguages(languages);
  //   // this.dataService.setUserLanguages(languages);
  // }


  // private getLanguageFromWindowNavigator() {
  //   try {
  //     let language = window.navigator?.language;
  //     if (language?.includes('-')) {
  //       language = language.split('-')[0];
  //     }
  //     return language?.toLowerCase();
  //   } catch (err) {
  //     return null;
  //   }
  // }

  // private async getLanguageFromCountryId(countryId: string) {
  //   try {
  //     const countriesLanguages = await this.countryService.getCountriesLanguages();
  //     return countriesLanguages[countryId];
  //   } catch (err) {
  //     return null;
  //   }
  // }

  // private printStatus(property = 'language', method: string, language: string) {
  //   console.log(`UserLanguageService: Property [${property}] was acquired via method [${method}] with value [${language}]`);
  // }

}
