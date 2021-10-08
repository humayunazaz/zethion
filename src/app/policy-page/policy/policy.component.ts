import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { IPolicyNav } from './policy.modal';
import { policyNav } from './policyNavConst';
import { ConsentPreference } from '../../shared/const/const';
import { CookiesPreference } from '../../shared/dialogs/modals/cookie-preference';
import { StorageService } from '../../shared/_service/storage/storage.service';
import { UpdateRegisterVisitorModal } from '../../shared/_service/signin/user-modal';
import { SigninService } from '../../shared/_service/signin/signin.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { DataService } from '../../shared/_service/data/data.service';

@Component({
  selector: 'app-policy',
  templateUrl: './policy.component.html',
  styleUrls: ['./policy.component.scss']
})
export class PolicyComponent implements OnInit, OnDestroy, AfterViewInit {
  collapsed = true;
  policyCollapseNav: IPolicyNav[];
  fixSideNav = false;
  consentPreference = ConsentPreference;
  cookiesConsentValues: CookiesPreference;
  initialConsentValues: CookiesPreference;
  mobileMode = false;
  mobileNavCollapsed = true;
  @ViewChild('terms') private termsSection: ElementRef;
  @ViewChild('privacy') private privacySection: ElementRef;
  @ViewChild('cookiePolicy') private cookiePolicySection: ElementRef;
  @ViewChild('cookieManagement') private cookieManagementSection: ElementRef;
  @ViewChild('contacts') private contactSection: ElementRef;
  constructor(
    private storageService: StorageService,
    private signInService: SigninService,
    private router: Router,
    private dataService: DataService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.policyCollapseNav = policyNav;
    this.storageService.getCookieConsent() ?
      this.cookiesConsentValues = new CookiesPreference(this.storageService.getCookieConsent()) :
      this.cookiesConsentValues = new CookiesPreference();
    this.initialConsentValues = new CookiesPreference(this.cookiesConsentValues);

    this.dataService.windowWidth.subscribe((windowWidth: number) => {
      windowWidth <= 767 ? this.mobileMode = true : this.mobileMode = false;
    });
  }

  ngAfterViewInit() {
    this.activatedRoute.paramMap.subscribe((routeParams: any) => {
      console.log(routeParams);
      if (routeParams.get('policySubId') === 'terms') {
        setTimeout(() => {
          this.scrollTo(this.termsSection.nativeElement);
        }, 10);
      } else if (routeParams.get('policySubId') === 'privacy') {
        setTimeout(() => {
          this.scrollTo(this.privacySection.nativeElement);
        }, 10);
      } else if (routeParams.get('policySubId') === 'cookiePolicy') {
        setTimeout(() => {
          this.scrollTo(this.cookiePolicySection.nativeElement);
        }, 10);
      } else if (routeParams.get('policySubId') === 'cookieManagement') {
        setTimeout(() => {
          this.scrollTo(this.cookieManagementSection.nativeElement);
        }, 10);
      } else if (routeParams.get('policySubId') === 'contacts') {
        setTimeout(() => {
          this.scrollTo(this.contactSection.nativeElement);
        }, 10);
      }
    });
  }

  toggleCollapse(singleNav: IPolicyNav): void {
    singleNav.collapsed = !singleNav.collapsed;
  }

  scrollTo(el: HTMLElement): void {
    el.scrollIntoView({ behavior: 'smooth' });
    if (this.mobileMode) {
      this.mobileNavCollapsed = true;
    }
  }

  fixedSideNav(el: HTMLElement): void {
    el.scrollTop > 200 ? this.fixSideNav = true : this.fixSideNav = false;
  }

  scrollTop(el: HTMLElement): void {
    el.scrollTo({ top: 0, behavior: 'smooth' });
  }

  mainTitleScroll(el: string, singleNav: IPolicyNav): void {
    if (singleNav.collapsed) {
      this.policyCollapseNav.forEach(single => single.collapsed = true);
    }
    singleNav.collapsed = !singleNav.collapsed;
    this.router.navigate([`/info/${el}`]);
  }

  updateCookieValues(id, event): void {
    event.checked ? this.cookiesConsentValues.updateSingle(id, true) : this.cookiesConsentValues.updateSingle(id, false);
  }

  acceptAllCookies(el: HTMLElement): void {
    this.cookiesConsentValues.acceptAll();
    this.storageService.setCookieConsent(this.cookiesConsentValues);
    this.storageService.setCookieConsentStatus(true);
    this.updateRegisterVisitor(el);
  }

  setCookiesChoice(el: HTMLElement): void {
    this.storageService.setCookieConsent(this.cookiesConsentValues);
    this.storageService.setCookieConsentStatus(true);
    this.updateRegisterVisitor(el);
  }

  updateRegisterVisitor(el: HTMLElement): void {
    if (JSON.stringify(this.initialConsentValues) !== JSON.stringify(this.cookiesConsentValues)) {
      const updateRegisterVisitor = this.registerUserUpdatedCookies('USER_LANGUAGES', this.storageService.getUserLanguages());
      updateRegisterVisitor.setUserCustomizations('DEFAULT_LANGUAGE', [this.storageService.getLanguage()]);
      updateRegisterVisitor.setUserCustomizations('COUNTRIES', this.storageService.getCountries());
      updateRegisterVisitor.setUserCustomizations('USER_SPORT', this.storageService.getSports());
      updateRegisterVisitor.setUserCookieCustomizations('COOKIE', this.storageService.getCookieConsent());
      this.signInService.updateVisitor(updateRegisterVisitor).subscribe((res: any) => {
        this.initialConsentValues = this.storageService.getCookieConsent();
        this.router.navigate(['/']);
      }, err => {
        console.log('the update visitor failed');
      });
    }
  }

  registerUserUpdatedCookies(customCode: string, customItem: string[]): UpdateRegisterVisitorModal {
    return new UpdateRegisterVisitorModal(
      this.storageService.getClientId(), this.storageService.getIP(), this.storageService.getCountry(), customCode, customItem);
  }

  ngOnDestroy(): void {
    this.policyCollapseNav.forEach(singleNav => singleNav.collapsed = true);
  }

  toggleMainNav(): void {
    this.mobileNavCollapsed = !this.mobileNavCollapsed;
  }
}
