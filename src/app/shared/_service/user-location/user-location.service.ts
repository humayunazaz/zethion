import { Injectable } from '@angular/core';

import { PlaceService } from './../place/place.service';
import { IpService } from './../ip/ip.service';
import { LocationService } from './../location/location.service';
import { UserLanguageService } from './../user-language/user-language.service';
import { StorageService } from './../storage/storage.service';
import { DataService } from '../data/data.service';
import {GeolocationService} from '@ng-web-apis/geolocation';
import {AppConstants} from '../../../app-constants';
import { TranslateService } from '@ngx-translate/core';
import { SigninService } from '../signin/signin.service';
import { SingleCustomizationCodeValue, NewRegisterVisitorModal, SingleUserCustomization } from '../signin/user-modal';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserLocationService {
  countryCode;
  appLanguage = 'en';
  placeId = this.storageService.getPlaceId();
  constructor(
    private locationService: LocationService,
    private ipService: IpService,
    private placeService: PlaceService,
    private userLanguageService: UserLanguageService,
    private storageService: StorageService,
    private dataService: DataService,
    private geoLocation: GeolocationService,
    private translateService: TranslateService,
    private signinService: SigninService
  ) { }


  // this will check the available countires and matched the user country, if country didn't matched, it make GB as user current language
  setUserUpdatedCountry(country: string[]) {
    const updatedCountry = [];
    AppConstants.SORTED_COUNTRIES.forEach(singleCountry => {
      if (country.includes(singleCountry.alphaTwoCode)) {
        updatedCountry.push(singleCountry);
      }
    });
    if (updatedCountry.length > 0) {
      const countries = [];
      let userLanguages = [];
      updatedCountry.forEach(singleUpdated => {
        countries.push(singleUpdated.alphaTwoCode);
        userLanguages = [...userLanguages, ...singleUpdated.languages];
      });
      console.log(userLanguages);
      this.setUserLanguageCountries(countries, userLanguages);
    } else {
      const countries = [AppConstants.DEFAULT_COUNTRY.country];
      const userLanguages = AppConstants.DEFAULT_COUNTRY.languages;
      this.setUserLanguageCountries(countries, userLanguages);
    }
  }

  private __getSecret() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789~`!@#$%^&*()-_=+[{]}\\\\|;:\\\'\\",<.>/?';
    const charactersLength = characters.length;
    let result = '';
    for (let i = 0; i < 9; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  signUpVisitor(registerParams, countries, userLanguages) {
    console.log(registerParams);
    this.signinService.signupVisitor(registerParams).subscribe((res: any) => {
      if (res.success && res.message === 'USER_CREATED') {
        this.storageService.setClientId(res.data.clientId);
        this.storageService.setIP(res.data.ip);
        this.setUserCookies(res.data.userCustomizationsDTO);
      } else {
        this.setFailedVisitorCookies(userLanguages, countries);
      }
    }, err => {
        this.setFailedVisitorCookies(userLanguages, countries);
    });
  }

  setFailedVisitorCookies(userLanguages, countries) {
    console.log('the sign up visitor failed');
      this.storageService.setLanguage(this.appLanguage);
      this.setTranslateServiceLang(this.appLanguage);
      this.storageService.setUserLanguages(userLanguages);
      this.storageService.setCountries(countries);
      this.dataService.setUserLanguages(userLanguages);
  }

  setUserCookies(customizationDTO: SingleUserCustomization[]) {
    console.log(customizationDTO);
    let userLanguages = [];
    customizationDTO.forEach(singleCustomizeItem => {
      if (singleCustomizeItem.customizationCode === 'DEFAULT_LANGUAGE') {
        this.storageService.setLanguage(singleCustomizeItem.values[0].value);
        this.setTranslateServiceLang(singleCustomizeItem.values[0].value);
      } else if (singleCustomizeItem.customizationCode === 'COUNTRIES') {
        const countries = this.formatCustomItemArray(singleCustomizeItem.values);
        this.storageService.setCountries(countries);
      } else if (singleCustomizeItem.customizationCode === 'USER_SPORT') {
        const sports = this.formatCustomItemArray(singleCustomizeItem.values);
        this.storageService.setCompleteSportsList(sports);
      } else if (singleCustomizeItem.customizationCode === 'USER_LANGUAGES') {
        userLanguages = this.formatCustomItemArray(singleCustomizeItem.values);
        this.storageService.setUserLanguages(userLanguages);
      }
    });
    this.dataService.setUserLanguages(userLanguages);
  }

  formatCustomItemArray(items: SingleCustomizationCodeValue[]) {
    const formatedItems = [];
    items.forEach((singleCustomItemValue: SingleCustomizationCodeValue) => {
      formatedItems.push(singleCustomItemValue.value);
    });
    return formatedItems;
  }

  setUserLanguageCountries(countries: string[], userLanguages: string[]) {
    const clientSecret = this.__getSecret();
    const registerVisitorParams = new NewRegisterVisitorModal(
      clientSecret, this.storageService.getIP(), this.countryCode, this.appLanguage, userLanguages, countries, this.placeId);
    console.log(registerVisitorParams);
    this.signUpVisitor(registerVisitorParams, countries, userLanguages);
  }

  setAppLanguage(language: string) {
    // this.storageService.setLanguage(language);
    // this.setTranslateServiceLang(language);
    this.appLanguage = language;
  }

  setTranslateServiceLang(language) {
    this.translateService.setDefaultLang(language);
    this.translateService.currentLang = language;
  }

  private getLanguageFromWindowNavigator() {
    try {
      let language = window.navigator.language;
      if (language.includes('-')) {
        language = language.split('-')[0];
      }
      language = language.toLowerCase();
      let matched = false;
      AppConstants.SORTED_LANGUAGES.forEach((singleLanguageContsant: string[]) => {
        if (singleLanguageContsant[0] === language) {
          matched = true;
        }
      });
      return matched ? language : 'en';
    } catch (err) {
      return null;
    }
  }

  // This will set GB as a default country for the user
  setUserDefaultCountry() {
    this.setAppLanguage(this.getLanguageFromWindowNavigator());
    this.setUserUpdatedCountry(['GB']);
  }

  // get user location by other means

  getUserLocation() {
    this.ipService.getCountry(this.storageService.getIP()).subscribe((country: any) => {
      console.log('location through IP is trigger');
      if (country) {
        this.countryCode = country.countryCode;
        this.setAppLanguage(this.getLanguageFromWindowNavigator());
        this.setUserUpdatedCountry([country.countryCode.toUpperCase()]);
      } else {
        this.setUserDefaultCountry();
      }
    }, err => {
      console.log('location through IP is failed, moving to default location');
      this.setUserDefaultCountry();
    });
  }

  // if the user device allowed, than it will get the geo location otherwise it will used the position
  getUserGeoLocation() {
    console.log('geo location is trigger will wait for the response');
    let securityBlock = true;
    this.geoLocation.pipe(take(1)).subscribe((position: any) => {
      console.log('geo location is trigger will wait for the response');
      securityBlock = false;
      if (position) {
        this.placeService.getPlaceByCoordinates(position.coords.latitude, position.coords.longitude)
        .pipe(take(1)).subscribe((countryCode: any) => {
          if (countryCode) {
            if (countryCode.country.length === 2) {
              this.countryCode = countryCode['country'];
              this.placeId = countryCode.placeId;
              this.storageService.setPlaceId(this.placeId);
              this.setAppLanguage(this.getLanguageFromWindowNavigator());
              this.setUserUpdatedCountry([countryCode['country']]);
            }
          }
        }, err => {
          console.log('get location by coordinates is failed, moving to user location');
          securityBlock = false;
          this.getUserLocation();
        });
      }
    }, err => {
      if (err) {
        console.log('geo location is blocked');
      }
    });

    setTimeout(() => {
      console.log(securityBlock);
      if (securityBlock) {
        this.getUserLocation();
      }
    }, 5000);
  }

  // this method will be called to get the country and language for new register user
  setClientCountryLanguage() {
    const userLanguage = this.storageService.getUserLanguages();
    const countries = this.storageService.getCountries();
    const language = this.storageService.getLanguage();

    this.getUserGeoLocation();
  }

}
