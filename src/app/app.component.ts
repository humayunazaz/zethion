import { Component, OnInit, HostListener, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { Subscription } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import {
  NgcCookieConsentService,
  NgcInitializeEvent,
  NgcNoCookieLawEvent,
  NgcStatusChangeEvent
} from "ngx-cookieconsent";

import { BreakpointObserverService, Breakpoint } from './shared/_service/breakpoint-observer/breakpoint-observer.service';
import { SigninService } from './shared/_service/signin/signin.service';
import { ImagesService } from './shared/_service/images/images.service';
import { StorageService } from './shared/_service/storage/storage.service';
import { UserLocationService } from './shared/_service/user-location/user-location.service';
import { DataService } from './shared/_service/data/data.service';
import {IpService} from "./shared/_service/ip/ip.service";
import {VersionCheckService} from "./shared/_service/version-check.service";
import {environment} from "../environments/environment";
import { MatDialog } from '@angular/material/dialog';
import { CookieConsentDialogComponent } from './shared/dialogs/cookie-consent-dialog/cookie-consent-dialog.component';


@Component({
  selector: 'app-my-app',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {

  public loading = true;
  @ViewChild('bpDetector') private bpDetector: ElementRef;
  private currentBreakpoint: Breakpoint = 'none';
  private isConsented = false;
  private clientSecret: string;
  private country: string;
  //keep refs to subscriptions to be able to unsubscribe later
  private popupOpenSubscription: Subscription;
  private popupCloseSubscription: Subscription;
  private initializeSubscription: Subscription;
  private statusChangeSubscription: Subscription;
  private revokeChoiceSubscription: Subscription;
  private noCookieLawSubscription: Subscription;

  constructor(
    private router: Router,
    private signinService: SigninService,
    private imagesService: ImagesService,
    private bpObserverService: BreakpointObserverService,
    // private ccService: NgcCookieConsentService,
    private storageService: StorageService,
    private userLocationService: UserLocationService,
    private dataService: DataService,
    private ipService: IpService,
    private versionCheckService: VersionCheckService,
    private matDialog: MatDialog
  ) {
    // local
    // sessionStorage.setItem('env', 'LOCAL');
    sessionStorage.setItem('env', 'DEVELOPMENT');
  }

  ngOnInit() {

    // this.versionCheckService.initVersionCheck(environment.versionCheckURL);

    // this.setClient();
    this.checkClientStatus();

    this.adjustToBrowserTheme();

    // Retrieve user location and language and save to storage
    // this.userLocationService.retrieveUserLocation();

    this.handleRouterLoading();

    // this.subscribeToCookieConsentObservables();

    // this.setupImagePreloading();

    // this.checkCookiesConsentStatus();
  }

  ngOnDestroy() {
    // unsubscribe to cookieconsent observables to prevent memory leaks
    // this.popupOpenSubscription.unsubscribe();
    // this.popupCloseSubscription.unsubscribe();
    // this.initializeSubscription.unsubscribe();
    // this.statusChangeSubscription.unsubscribe();
    // this.revokeChoiceSubscription.unsubscribe();
    // this.noCookieLawSubscription.unsubscribe();
  }

  ngAfterViewInit() {
    this.detectScreenSize();
  }

  // checkCookiesConsentStatus() {
  //   console.log(this.storageService.getCookieConsentStatus());
  //   if (!this.storageService.getCookieConsentStatus()) {
  //     this.callCookieConsent();
  //   }
  // }

  // callCookieConsent() {
  //   this.matDialog.open(CookieConsentDialogComponent, {
  //     disableClose: true,
  //     panelClass: 'custom-cookie-Consent'
  //   });
  // }

  // private subscribeToCookieConsentObservables() {
  //   // subscribe to cookieconsent observables to react to main events
  //   this.popupOpenSubscription = this.ccService.popupOpen$.subscribe(
  //     () => {
  //       // you can use this.ccService.getConfig() to do stuff...
  //     });

  //   this.popupCloseSubscription = this.ccService.popupClose$.subscribe(
  //     () => {
  //       // you can use this.ccService.getConfig() to do stuff...
  //     });

  //   this.initializeSubscription = this.ccService.initialize$.subscribe(
  //     (event: NgcInitializeEvent) => {
  //       // you can use this.ccService.getConfig() to do stuff...
  //     });

  //   this.statusChangeSubscription = this.ccService.statusChange$.subscribe(
  //     (event: NgcStatusChangeEvent) => {
  //       // you can use this.ccService.getConfig() to do stuff...
  //     });

  //   this.revokeChoiceSubscription = this.ccService.revokeChoice$.subscribe(
  //     () => {
  //       // you can use this.ccService.getConfig() to do stuff...
  //     });

  //   this.noCookieLawSubscription = this.ccService.noCookieLaw$.subscribe(
  //     (event: NgcNoCookieLawEvent) => {
  //       // you can use this.ccService.getConfig() to do stuff...
  //     });
  // }

  private setupImagePreloading() {
    /*this.imagesService.preload(
      [
        // menu icons
        'https://storage.cloud.google.com/spring-bucket-sb-gcs-admin/img/sport/ANIMATED_MENU_ICONS/FOOTBALL.gif',
        'https://storage.cloud.google.com/spring-bucket-sb-gcs-admin/img/sport/ANIMATED_MENU_ICONS/BASKETBALL.gif',
        'https://storage.cloud.google.com/spring-bucket-sb-gcs-admin/img/sport/ANIMATED_MENU_ICONS/TENNIS.gif',
        'https://storage.cloud.google.com/spring-bucket-sb-gcs-admin/img/sport/ANIMATED_MENU_ICONS/FORMULA1.gif',
        'https://storage.cloud.google.com/spring-bucket-sb-gcs-admin/img/sport/MENU_ICONS/FOOTBALL.png',
        'https://storage.cloud.google.com/spring-bucket-sb-gcs-admin/img/sport/MENU_ICONS/BASKETBALL.png',
        'https://storage.cloud.google.com/spring-bucket-sb-gcs-admin/img/sport/MENU_ICONS/TENNIS.png',
        'https://storage.cloud.google.com/spring-bucket-sb-gcs-admin/img/sport/MENU_ICONS/FORMULA1.png',

        // football event details
        'https://storage.cloud.google.com/spring-bucket-sb-gcs-admin/img/sport/FOOTBALL/ICONS/ENTERED_PLAYER.png',
        'https://storage.cloud.google.com/spring-bucket-sb-gcs-admin/img/sport/FOOTBALL/ICONS/GOAL.png',
        'https://storage.cloud.google.com/spring-bucket-sb-gcs-admin/img/sport/FOOTBALL/ICONS/OWN_GOAL.png',
        'https://storage.cloud.google.com/spring-bucket-sb-gcs-admin/img/sport/FOOTBALL/ICONS/RED_CARD.png',
        'https://storage.cloud.google.com/spring-bucket-sb-gcs-admin/img/sport/FOOTBALL/ICONS/SECOND_YELLOW_CARD.png',
        'https://storage.cloud.google.com/spring-bucket-sb-gcs-admin/img/sport/FOOTBALL/ICONS/YELLOW_CARD.png',
        'https://storage.cloud.google.com/spring-bucket-sb-gcs-admin/img/sport/FOOTBALL/ICONS/MISSED_PENALTY.png',
      ]
    );*/
  }

  private handleRouterLoading() {
    this.loading = true;
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      const body = document.getElementsByTagName('body')[0];
      const modalBackdrop = document.getElementsByClassName('modal-backdrop')[0];
      if (body.classList.contains('modal-open')) {
        body.classList.remove('modal-open');
        modalBackdrop.remove();
      }
      this.signinService.updateLoggedUser();
      this.loading = false;
    });
  }

  checkClientStatus () {
    const clientId = this.storageService.getClientId();
    const clientIP = this.storageService.getIP();
    if (clientIP && clientId) {
      this.checkClientCookiesStatus();
    } else {
      this.userLocationService.setTranslateServiceLang('en');
      this.ipService.getIPAddress().pipe(take(1)).subscribe((clientIp: any) => {
        if (clientIp) {
          this.storageService.setIP(clientIp.ip);
          this.ipService.getCountry(clientIp.ip).subscribe((ipCountryDetail: any) => {
            console.log(ipCountryDetail);
            this.country = ipCountryDetail.countryCode;
            this.storageService.setCountry(this.country);
            this.userLocationService.setClientCountryLanguage();
          }, err => {
            console.log('system cant get the country id');
          });
        }
      }, err => {
        console.log('system cant get the client IP');
      });
    }
  }

  // this will check if register client didn't clear the cookies
  checkClientCookiesStatus() {
    if (
        this.storageService.getUserLanguages().length > 0 &&
        this.storageService.getLanguage()) {
      this.dataService.setUserLanguages(this.storageService.getUserLanguages());
      this.userLocationService.setTranslateServiceLang(this.storageService.getLanguage());
    } else {
      this.userLocationService.setTranslateServiceLang('en');
      this.userLocationService.setClientCountryLanguage();
    }
  }



  @HostListener('window:resize', [])
  private onResize() {
    this.detectScreenSize();
  }

  private detectScreenSize() {
    if (!this.bpDetector || !this.bpDetector.nativeElement) {
      return;
    }
    this.dataService.windowWidth.next(window.innerWidth);
    const screenSize = this.bpDetector.nativeElement.className as Breakpoint;
    if (screenSize && this.currentBreakpoint !== screenSize) {
      this.currentBreakpoint = screenSize;
      this.bpObserverService.emitBreakpoint(screenSize);
      console.log(`Screen size change to ${screenSize} detected`);
    }
  }

  private adjustToBrowserTheme() {
    const mediaMatch = window.matchMedia('(prefers-color-scheme: dark)');
    this.changeFavIcon(mediaMatch);
    mediaMatch.addEventListener('change', this.changeFavIcon.bind(mediaMatch));
  }
  private changeFavIcon(mediaMatch: MediaQueryList) {
    const dark = mediaMatch.matches;
    const iconHref = dark
      ? './assets/img/favicon-lyre-dark.png'
      : './assets/img/favicon-lyre.png';

    const link = document.querySelector('#favIcon');
    link?.setAttribute('href', iconHref);
  }
}
