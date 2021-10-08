import {
  Component, OnInit, Input, Output, EventEmitter, AfterViewInit,
  ElementRef, AfterContentInit, ContentChild, ContentChildren, QueryList
} from '@angular/core';
import { MatDialog, MatDialogRef } from "@angular/material/dialog";

import { InfoDialogComponent } from "../../shared/dialogs/info-dialog/info-dialog.component";
import { DataService } from 'src/app/shared/_service/data/data.service';
import { FooterToggleComponent } from './footer-toggle/footer-toggle.component';
import { NewsService } from '../_service/news/news.service';
import { FbdialogComponent } from '../../news/news-section/facebook/fbdialog/fbdialog.component';
import { CountryService } from '../_service/country/country.service';
import { CookieConsentDialogComponent } from '../dialogs/cookie-consent-dialog/cookie-consent-dialog.component';
import { StorageService } from '../_service/storage/storage.service';
import { UpdateRegisterVisitorModal } from '../_service/signin/user-modal';
import { SigninService } from '../_service/signin/signin.service';
import { CookiesPreference } from '../dialogs/modals/cookie-preference';
import { ActivatedRoute, Router } from '@angular/router';
import { StoriesService } from '../_service/stories/stories.service';
import { CuriositiesService } from '../_service/curiosities/curiosities.service';


@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit, AfterContentInit {
  @Input()
  currShortcuts: object[] = [];
  @Input()
  shortcutImages: object[] = [];
  @Input() policyMenu = false;
  @Input() storiesMenu = false;
  @Input() newsMenu = false;
  @Input() curiositiesMenu = false;
  @Input() storyMenu = false;
  @Input() curiosityMenu = false;
  vidComp: boolean;
  showmenu = false;
  showStaticLogo = false;
  shortCutImagesStatus = false;
  @ContentChild(FooterToggleComponent) footerToggleComp;
  @ContentChild('menuLeft') menuLeft;
  @ContentChildren('showMenuInvisible') showMenuVisibleElements: QueryList<any>;
  availableCountries = [];
  query: string;
  initialCookieConsent: CookiesPreference;
  showSubInfoMenu = false;
  constructor(
    protected infoDialog: MatDialog,
    protected data: DataService,
    private newsService: NewsService,
    private countryService: CountryService,
    private dataService: DataService,
    private storageService: StorageService,
    private signInService: SigninService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private storiesService: StoriesService,
    private curiositiesService: CuriositiesService
  ) { }

  ngOnInit() {
    console.log('🚀 ~ file: menu.component.ts ~ line 66 ~ MenuComponent ~ ngOnInit ~ this.newsMenu', this.newsMenu);
    // if (!this.curiositiesMenu && !this.newsMenu) {
    //   this.storiesService.hasShortCutImages.subscribe((status: boolean) => {
    //     if (status && (this.router.url === '/' || this.router.url.includes('stories'))) {
    //       this.shortCutImagesStatus = status;
    //     }
    //   });
    // } else if (this.newsMenu) {
    //   this.newsService.hasShortCutImages.subscribe((status: boolean) => {
    //     if (status && this.router.url.includes('/news')) {
    //       this.shortCutImagesStatus = status;
    //     }
    //   });
    // } else if (this.curiositiesMenu) {
    //   this.curiositiesService.hasShortCutImages.subscribe((status: boolean) => {
    //     if (status && this.router.url.includes('curiosities')) {
    //       this.shortCutImagesStatus = status;
    //     }
    //   });
    // }
    this.data.getVideoCompleted().subscribe(vidEnd => {
      this.vidComp = vidEnd;
    });
    // this.countryService.getCountries("").subscribe((allCountries: any[]) => {
    //   console.log(allCountries);
    //   this.availableCountries = allCountries;
    //   this.data.AllAvailableCountries.next(allCountries);
    // });
  }

  ngAfterContentInit() {
    this.showStaticLogo = !this.footerToggleComp;
  }

  openInfo() {
    // this.infoDialog.open(InfoDialogComponent, {
    //   panelClass: 'custom-dialog-container',
    //   data: {
    //     'title': 'Info Dialog',
    //     'content': 'Info Content'
    //   }
    // });
    this.initialCookieConsent = this.storageService.getCookieConsent();
    const dialogRef = this.infoDialog.open(CookieConsentDialogComponent, {
      panelClass: 'custom-cookie-Consent'
    });

    dialogRef.afterClosed().subscribe(() => {
      if (JSON.stringify(this.initialCookieConsent) !== JSON.stringify(this.storageService.getCookieConsent())) {
        const updateRegisterVisitor = this.registerUserUpdatedCookies('USER_LANGUAGES', this.storageService.getUserLanguages());
        updateRegisterVisitor.setUserCustomizations('DEFAULT_LANGUAGE', [this.storageService.getLanguage()]);
        updateRegisterVisitor.setUserCustomizations('COUNTRIES', this.storageService.getCountries());
        updateRegisterVisitor.setUserCustomizations('USER_SPORT', this.storageService.getSports());
        updateRegisterVisitor.setUserCookieCustomizations('COOKIE', this.storageService.getCookieConsent());
        this.signInService.updateVisitor(updateRegisterVisitor).subscribe((res: any) => {
          console.log(res);
        }, err => {
          console.log('the update visitor failed');
        });
      }
    });
  }

  registerUserUpdatedCookies(customCode: string, customItem: string[]) {
    return new UpdateRegisterVisitorModal(
      this.storageService.getClientId(), this.storageService.getIP(), this.storageService.getCountry(), customCode, customItem);
  }

  goToMain(): void {
    if (!this.policyMenu && !this.newsMenu && !this.storyMenu && !this.curiositiesMenu && !this.curiosityMenu) {
      // this.dataService.lastNewsItemId = null;
      // this.menuLeft.changeLogo('home');
      this.dataService.lastStoryItemId = null;
    } else {
      this.router.navigate(['/']);
    }
  }

  goPrevious() {
    if (this.newsMenu || this.curiositiesMenu || this.storyMenu || this.policyMenu) {
      if (this.curiositiesMenu) {
        this.dataService.scrolledTop = 0;
        this.dataService.scrolledLeft = 0;
      }
      this.router.navigateByUrl('/');
    } else if (this.curiosityMenu) {
      this.router.navigateByUrl('/curiosities');
    }
  }

  togglemenu() {
    this.showmenu = !this.showmenu;
    this.showMenuVisibleElements?.forEach(elem => {
      elem.setInvisible(this.showmenu);
    });
  }

  goToPolicySection(id: string): void {
    this.newsService.updateShortCutImagesStatus(false);
    this.router.navigate([`/info/${id}`]);
  }

  showSubInfo(show: boolean) {
    this.showSubInfoMenu = show;
  }

  moveToInfo(): void {
    this.showSubInfoMenu = !this.showSubInfoMenu;
  }
}
