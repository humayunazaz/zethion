import { Injectable } from '@angular/core';
import {CookieService} from "ngx-cookie-service";
import { cookiesTypes } from '../../const/const';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  cookieTypes = cookiesTypes;
  expiresDate = new Date();
  constructor(
    private cookieService: CookieService
  ) {
    this.expiresDate.setFullYear(this.expiresDate.getFullYear() + 2);
  }


  deleteAll() {
    this.cookieService.deleteAll();
  }

  getLanguage() {
    if (this.cookieService.check('language')) {
      return this.cookieService.get('language');
    }
    return null;
  }
  setLanguage(language: string) {
    this.setCookie('language', language);
  }

  getUserLanguages(): string[] {
    if (this.cookieService.check('user-languages')) {
      //console.log(JSON.parse(this.cookieService.get('user-languages')));
      return JSON.parse(this.cookieService.get('user-languages'));
    }
    return [];
  }
  setUserLanguages(languages: string[]) {
    this.setCookie('user-languages', JSON.stringify(languages));
  }

  getCountries(): string[] {
    if (this.cookieService.check('countries')) {
      // //console.log('countries', this.cookieService.get('countries'));
      return JSON.parse(this.cookieService.get('countries'));
    }
    return [];
  }
  setCountries(countries: string[]) {
    this.setCookie('countries', JSON.stringify(countries));
  }

  getSports(): string[] {
    if (this.cookieService.check('sports')) {
      return JSON.parse(this.cookieService.get('sports'));
    }
    return [];
  }
  setSports(sports: string[]) {
    this.setCookie('sports', JSON.stringify(sports));
  }

  setCompleteSportsList(sports: string[]) {
    this.setCookie('completeSportsList', JSON.stringify(sports));
  }

  getCompleteSportsList(): string[] {
    if (this.cookieService.check('completeSportsList')) {
      return JSON.parse(this.cookieService.get('completeSportsList'));
    }
    return [];
  }

  getLoggedUser(): any {
    if (this.cookieService.check('loggedUser')) {
      return JSON.parse(this.cookieService.get('loggedUser'));
    }
    return null;
  }
  setLoggedUser(loggedUser: any) {
    this.setCookie('loggedUser', JSON.stringify(loggedUser));
  }

  getToken(): string {
    if (this.cookieService.check('token')) {
      return this.cookieService.get('token');
    }
    return '';
  }
  setToken(token: string) {
    this.setCookie('token', token);
  }

  getForgotPassword() {
    if (this.cookieService.check('forgotPassword')) {
      return this.cookieService.get('forgotPassword');
    }
    return '';
  }
  setForgotPassword(forgotPassword: string) {
    this.setCookie('forgotPassword', forgotPassword);
  }
  deleteForgotPassword() {
    this.cookieService.delete('forgotPassword');
  }

  getUsernameToChangePassword(): string {
    if (this.cookieService.check('usernameToChangePassword')) {
      return this.cookieService.get('usernameToChangePassword');
    }
    return '';
  }
  setUsernameToChangePassword(username: string) {
    this.setCookie('usernameToChangePassword', username);
  }
  deleteUsernameToChangePassword() {
    this.cookieService.delete('usernameToChangePassword');
  }

  getClientId(): string {
    if (this.cookieService.check('clientId')) {
      return this.cookieService.get('clientId');
    }
    return null;
  }

  setClientId(clientId: string) {
    this.setCookie('clientId', clientId);
  }

  getIP(): string {
    if (this.cookieService.check('IP')) {
      return this.cookieService.get('IP');
    }
    return null;
  }

  setIP(IP: string) {
    console.log(IP);
    this.setCookie('IP', IP);
  }

  // this will save the user actual country code
  setCountry(country: string) {
    this.setCookie('country', country);
  }

  getCountry(): string {
    if (this.cookieService.check('country')) {
      return this.cookieService.get('country');
    }
    return null;
  }

  setPlaceId(id: string) {
    this.setCookie('placeId', id);
  }

  getPlaceId(): string {
    if (this.cookieService.check('placeId')) {
      return this.cookieService.get('placeId');
    }
    return 'ND';
  }

  setCookieConsent(preference: any) {
    console.log(preference);
    this.setCookie('customCookieConsent', JSON.stringify(preference));
  }

  getCookieConsent(): any {
    if (this.cookieService.check('customCookieConsent')) {
      return JSON.parse(this.cookieService.get('customCookieConsent'));
    }
    return null;
  }

  setCookieConsentStatus(status: any) {
    console.log(status);
    this.setCookie('cookieConsentStatus', status);
  }

  getCookieConsentStatus(): any {
    if (this.cookieService.check('cookieConsentStatus')) {
      return this.cookieService.get('cookieConsentStatus');
    }
    return false;
  }

  checkCookieType(name: string) {
    const userPreference = this.getCookieConsent();
    if (this.cookieTypes.technicalCookies.includes(name)) {
      return true;
    } else if (userPreference) {
      if (this.cookieTypes.operationalCookies.includes(name) && userPreference.operational) {
        return true;
      } else {
        return false;
      }
    }
  }

  checkAnalyticalCookies() {
    const userPreference = this.getCookieConsent();
    return userPreference ? userPreference.analytical : true;
  }

  checkThirdPartyCookies() {
    const userPreference = this.getCookieConsent();
    return userPreference ? userPreference.thirdParty : true;
  }

  private setCookie(name: string, value: string) {
    //console.log("set cookie");
    //console.log(name, value);
    this.checkCookieType(name) ? this.cookieService.set(name, value, this.expiresDate, '/', null, true, 'None'): console.log('this cookie type cant be stored' + name);
  }
}
