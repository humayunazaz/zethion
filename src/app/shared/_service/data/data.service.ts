import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { StorageService } from './../storage/storage.service';
import { PreviouslyLoadedContent } from '../../../news/news-section/models/loadedData';
import { SingleNews, SingleBoxes } from '../../../news/news-section/models/news-model';
import { SingleIgBoxes } from '../../../news/news-section/models/ig-post-model';
import { SingleFbBoxes } from '../../../news/news-section/models/fb-post-model';
import { SingleTwBoxes } from '../../../news/news-section/models/tw-post-model';
import { SocialType } from '../../../news/news-section/social-type';
import { NewsItem } from '../../../news/news-section/news/news-item';
import { SingleYtBoxes } from 'src/app/news/news-section/models/yt-post-model';
import { SingleStoryBoxes } from 'src/app/stories-page/models/stories-model';
import { PreviouslyLoadedStoryContent } from 'src/app/stories-page/models/storiesLoadedData';
import { SingleCuriosityBoxes } from 'src/app/curiosities-page/models/curiosities-model';
import { PreviouslyLoadedCuriosityContent } from 'src/app/curiosities-page/models/curiositiesLoadedData';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private _appLanguage$ = new BehaviorSubject(null);
  private _userLanguages$ = new BehaviorSubject(null);
  _countries$ = new BehaviorSubject([]);
  private _videoEnd$ = new BehaviorSubject(false);
  private _loader$ = new BehaviorSubject(false);
  private _queryLoader$ = new BehaviorSubject(false);
  private _languageChanged$ = new BehaviorSubject(false);
  appLanguage$ = this._appLanguage$.asObservable();
  userLanguages$ = this._userLanguages$.asObservable();
  countries$ = this._countries$.asObservable();
  videoCompleted$ = this._videoEnd$.asObservable();
  loader$ = this._loader$.asObservable();
  queryloader$ = this._queryLoader$.asObservable();
  languageChanged$ = this._languageChanged$.asObservable();
  visitorUserRegisted = new BehaviorSubject(this.storageService.getClientId() !== '' ? this.storageService.getClientId() : null);
  windowWidth = new BehaviorSubject(window.innerWidth);
  activePanHoverTileId = new BehaviorSubject(null);
  AllAvailableCountries = new BehaviorSubject(null);
  countriesUpdated = new BehaviorSubject(false);

  countryBasedLoadedData: PreviouslyLoadedContent = null;
  storyBasedLoadedData: PreviouslyLoadedStoryContent = null;
  curiosityBasedLoadedData: PreviouslyLoadedCuriosityContent = null;
  userLanguages: string[] = [];
  countries: string[] = [];
  page = 0;
  contentSlides: any[] = [];
  sports: string[] = [];
  tags: string[] = [];
  query = '';
  recurringCall = false;
  newsSlides: SingleNews[] = [];
  newsBoxes: SingleBoxes[] = [];
  fbBoxes: SingleFbBoxes[] = [];
  igBoxes: SingleIgBoxes[] = [];
  twBoxes: SingleTwBoxes[] = [];
  ytBoxes: SingleYtBoxes[] = [];
  storiesBoxes: SingleStoryBoxes[] = [];
  curiositiesBoxes: SingleCuriosityBoxes[] = [];
  lastNewsItemId = null;
  lastFbItemId = null;
  lastTwItemId = null;
  lastIgItemId = null;
  lastYtItemId = null;
  lastStoryItemId = null;
  lastCuriosityItemId = null;
  lastNewsAdsId = [];
  lastStoriesAdsId = [];
  lastCuriositiesAdsId = [];
  lastFbAdsId = [];
  lastIgAdsId = [];
  lastTwAdsId = [];
  lastYtAdsId = [];
  currShortcuts: object[] = [];
  socialType: SocialType = 'zt';
  openNewsItem: NewsItem = null;
  openFbItem: string = null;
  openTwItem: string = null;
  openIgItem: string = null;
  openYtItem: string = null;
  openStoryItem: string = null;
  scrolledLeft = 0;
  scrolledTop = 0;
  isLastPage: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoaded: boolean = false;
  isSlideEmpty: boolean = false;
  intervalId: any[];

  constructor(
    private storageService: StorageService
  ) {
  }

  setAppLanguage(language: string) {
    console.log(language);
    this._appLanguage$.next(language);
  }

  setUserLanguages(languages: string[]) {
    console.log(languages);
    this._userLanguages$.next(languages);
  }

  setCountries(countries: string[]) {
    this._countries$.next(countries);
  }

  setVideoCompleted(videoEnded: boolean) {
    this._videoEnd$.next(videoEnded);
    console.log('DataService.setVideoCompleted, videoEnded:', videoEnded);
  }

  setLanguageChanged(LangChange: boolean) {
    this._languageChanged$.next(LangChange);
  }

  setQueryLoader(queryLoader: boolean) {
    this._queryLoader$.next(queryLoader);
  }

  setLoader(Loader: boolean) {
    this._loader$.next(Loader);
  }


  public getAppLanguage(): Observable<string> {
    return this.appLanguage$;
  }

  public getUserLanguages(): Observable<string[]> {
    return this.userLanguages$;
  }

  public getCountries(): Observable<string[]> {
    return this.countries$;
  }

  public getVideoCompleted(): Observable<boolean> {
    return this.videoCompleted$;
  }

  public getLoader(): Observable<boolean> {
    return this.loader$;
  }

  public getQueryLoader(): Observable<boolean> {
    return this.queryloader$;
  }

  public getIsLangChange(): Observable<boolean> {
    return this.languageChanged$;
  }

  public setIsLastPage(isLastPage: boolean): void {
    this.isLastPage.next(isLastPage);
  }

  public getIsLastPage(): Observable<boolean> {
    return this.isLastPage.asObservable();
  }
}
