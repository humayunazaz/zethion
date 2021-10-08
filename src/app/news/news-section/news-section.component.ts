import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef, ViewChildren, QueryList, ChangeDetectorRef, AfterViewChecked } from '@angular/core';

import { Subject, Subscription, SubscriptionLike } from 'rxjs';
import { combineLatest } from 'rxjs';

import { NewsService } from 'src/app/shared/_service/news/news.service';
import { DataService } from "../../shared/_service/data/data.service";
import { NetworkAwarePreloadStrategy } from 'src/app/NetworkAwarePreloadStrategy';
import { SocialType } from './social-type';
import { NewsContentComponent } from './news/news-content/news-content.component';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { FacebookContentComponent } from './facebook/facebook-content/facebook-content.component';
import { InstagramContentComponent } from './instagram/instagram-content/instagram-content.component';
import { Utilities } from 'src/app/shared/utilities';
import { ContentItem } from './content-item';
import { TwitterContentComponent } from './twitter/twitter-content/twitter-content.component';
import { ContentProvider } from './content-provider';
import { StorageService } from 'src/app/shared/_service/storage/storage.service';
import { FbServiceWrapperService } from './facebook/fb-service-wrapper.service';
import { Social } from 'src/app/model/social.component.models';

import { MatDialog } from "@angular/material/dialog";
import { SearchDialogComponent } from 'src/app/shared/dialogs/search-dialog/search-dialog.component';
import 'rxjs/add/operator/debounceTime';
import { NewsContent, SingleNews, SingleBoxes } from './models/news-model';
import { PreviouslyLoadedContent } from './models/loadedData';
import { SocialService } from '../../shared/_service/social/social.service';
import { FacebookContent, SingleFbBoxes, SingleFb } from './models/fb-post-model';
import { InstagramContent, SingleIg, SingleIgBoxes } from "./models/ig-post-model";
import { SingleTw, SingleTwBoxes, TwitterContent } from "./models/tw-post-model";
import { SingleYt, SingleYtBoxes, YouTubeContent } from "./models/yt-post-model";
import { IgServiceWrapperService } from "./instagram/ig-service-wrapper.service";
import { TwServiceWrapperService } from "./twitter/tw-service-wrapper.service";
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { FbdialogComponent } from './facebook/fbdialog/fbdialog.component';
import { NewsdialogComponent } from './news/newsdialog/newsdialog.component';
import { TwdialogComponent } from './twitter/twdialog/twdialog.component';
import { IgdialogComponent } from './instagram/igdialog/igdialog.component';
import { YtdialogComponent } from './youtube/ytdialog/ytdialog.component';
import { CookieConsentDialogComponent } from '../../shared/dialogs/cookie-consent-dialog/cookie-consent-dialog.component';
import { CookiesPreference } from '../../shared/dialogs/modals/cookie-preference';
import { takeUntil } from 'rxjs/operators';
// import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
// import { NgbCarousel } from '@ng-bootstrap/ng-bootstrap';

// jQuery
declare var $: any;

@Component({
  selector: 'app-news-section',
  templateUrl: './news-section.component.html',
  styleUrls: ['./news-section.component.scss']
})

export class NewsSectionComponent implements OnInit, OnDestroy, AfterViewInit, AfterViewChecked {

  // socialType: SocialType = 'zt';
  // contentSlides: any[] = [];
  // currShortcuts: object[] = [];
  infiniteScrollHorizontal: boolean;

  // @ViewChild(NewsContentComponent) private newsContentComponent: NewsContentComponent;
  // @ViewChild(FacebookContentComponent) private facebookContentComponent: FacebookContentComponent;
  @ViewChild(TwitterContentComponent) private twitterContentComponent: TwitterContentComponent;
  @ViewChild(InstagramContentComponent) private instagramContentComponent: InstagramContentComponent;
  @ViewChild(InfiniteScrollDirective) private infiniteScrollDirective: InfiniteScrollDirective;
  // @ViewChild('carousel', {static : true}) carousel: NgbCarousel;
  @ViewChild('desktopMosaicView') private mosaicView: ElementRef<HTMLDivElement>;

  private slidesSubs: SubscriptionLike[] = [];
  private dataServiceSub: SubscriptionLike;

  // private userLanguages: string[] = [];
  // private countries: string[] = [];
  // private sports: string[] = [];
  private pageSize = 20;
  private fbPageSize = 20;
  private igPageSize = 20;
  private twPageSize = 20;
  private ytPageSize = 20;
  // private tags: string[] = [];
  // private query = '';
  private isMac = false;
  // private page = 0;
  // private recurringCall = false;
  // private newsSlides:SingleNews[] = [];
  // private newsBoxes:SingleBoxes[] = [];
  // private fbBoxes:SingleFbBoxes[] = [];
  // private igBoxes:SingleIgBoxes[] = [];
  // private twBoxes:SingleTwBoxes[] = [];
  private previousSocial: string[] = [];
  // private countryBasedLoadedData: PreviouslyLoadedContent;
  // private lastNewsItemId = null;
  scrollWindow = false;
  fbNextButtonActive = false;
  igNextButtonActive = false;
  twNextButtonActive = false;
  ytNextButtonActive = false;
  fbContent: SingleFb[];
  igContent: SingleIg[];
  twContent: SingleTw[];
  ytContent: SingleYt[];
  nextSlide = 0;
  prevSlide = 0;
  desktopView = true;
  socialUpdating = false;

  isLastPage: boolean;

  data$: Subject<void> = new Subject();

  constructor(
    private newsService: NewsService,
    public dataService: DataService,
    private storageService: StorageService,
    private comp: NetworkAwarePreloadStrategy,
    private fbWrapper: FbServiceWrapperService,
    private igWrapper: IgServiceWrapperService,
    private twWrapper: TwServiceWrapperService,
    protected searchDialog: MatDialog,
    private socialService: SocialService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    this.isLastPage = false;
    this.dataService.contentSlides = [];
    this.dataService.isLoaded = false;
    // this.carousel.pause();
  }
  
  ngOnInit() {
    this.newsService.mouseScrollEvent.debounceTime(40).subscribe(event => {
      if (event && window.innerWidth > 767) {
        event.preventDefault();
        if (event.deltaX === -0) {
          // this enable the scroll effect of jquery slider
          // event.deltaY < 0 ?  this.scrollToPrevSlide() : this.scrollToNextSlide();
        }
      }
    });

    this.dataService.windowWidth.subscribe(currentWidth => {
      if (currentWidth <= 767) {
        this.infiniteScrollHorizontal = false;
        this.scrollWindow = true;
        this.desktopView = false;
      } else {
        this.infiniteScrollHorizontal = true;
        this.scrollWindow = false;
        this.desktopView = true;
      }
    });
    // this.carousel.pause();
  }

  ngAfterViewInit(): void {
    this.initialContent();
  }

  ngAfterViewChecked(): void {
    console.log('🚀 ~ file: footer-toggle.component.ts ~ line 20 ~ FooterToggleComponent ~ ngAfterViewChecked ~ ngAfterViewChecked');
    this.cdr.detectChanges();
  }


  initialContent() {
    this.dataService.countryBasedLoadedData = new PreviouslyLoadedContent(
      [], [], 'GB', this.dataService.socialType,
      this.dataService.page, this.dataService.countries);
    this.dataService
    .getUserLanguages()
    .pipe(takeUntil(this.data$))
    .subscribe((userLang: string[]) => {
      if (userLang) {
        this.dataService.userLanguages = this.storageService.getUserLanguages();
        this.dataService.countries = this.storageService.getCountries();
        this.dataService.sports = this.storageService.getSports();
        console.log(this.dataService.sports);
        this.dataService.tags = [];
        this.dataService.query = '';
        this.dataService.page = 0;
        this.dataService.newsBoxes = [];
        this.dataService.recurringCall = false;
        this.dataService.lastNewsItemId = null;
        this.dataService.lastFbItemId = null;
        this.dataService.lastIgItemId = null;
        this.dataService.lastTwItemId = null;
        this.dataService.lastYtItemId = null;
        this.dataService.lastNewsAdsId = [];
        this.dataService.lastFbAdsId = [];
        this.dataService.lastIgAdsId = [];
        this.dataService.lastTwAdsId = [];
        this.dataService.lastYtAdsId = [];
        this.foundingExistedData(this.dataService.userLanguages[0], this.dataService.socialType);
        this.newsService.getShortcutImgs(this.dataService.userLanguages, 'zt', this.dataService.countries).subscribe(shortCutImages => {
          // //console.log(shortCutImages);
          if (shortCutImages.length > 0) {
            this.newsService.updateShortCutImagesStatus(true);
            this.dataService.currShortcuts = shortCutImages;
          }
        });
      }
    });
  }

  foundingExistedData(langId: string, social: string) {
    const loadedData = this.dataService.countryBasedLoadedData.foundExistedContent(
      this.dataService.userLanguages[0], this.dataService.socialType, this.dataService.countries, this.dataService.page);
    if (loadedData) {
      this.dataService.contentSlides = loadedData.contentSlides;
      this.dataService.socialType === 'fb' ?
        this.dataService.fbBoxes = loadedData.contentBoxes : this.dataService.newsBoxes = loadedData.contentBoxes;
      this.dataService.socialType === 'ig' ?
        this.dataService.igBoxes = loadedData.contentBoxes : this.dataService.newsBoxes = loadedData.contentBoxes;
      this.dataService.socialType === 'tw' ?
        this.dataService.twBoxes = loadedData.contentBoxes : this.dataService.newsBoxes = loadedData.contentBoxes;
      this.dataService.socialType === 'yt' ?
        this.dataService.ytBoxes = loadedData.contentBoxes : this.dataService.newsBoxes = loadedData.contentBoxes;
      this.dataService.page = loadedData.page;
      this.dataService.isLoaded = true;
      setTimeout(() => {
        this.socialUpdating = false;
      }, 100);
    } else {
      this.dataService.page = 0;
      this.dataService.recurringCall = false;
      this.dataService.query = '';
      this.dataService.lastNewsItemId = '';
      this.emptyBoxesSlides();
      this.getLatestContent();
    }
  }

  emptyBoxesSlides() {
    this.dataService.contentSlides = [];
    this.dataService.socialType === 'fb' ? this.dataService.fbBoxes = [] : this.dataService.newsBoxes = [];
  }

  getLatestContent() {
    switch (this.dataService.socialType) {
      case 'zt':
        this.getNewsContent();
        break;
      case 'fb':
        this.getFacebookPosts();
        break;
      case 'tw':
        this.getTwitterPosts();
        break;
      case 'ig':
        this.getInstagramPosts();
        break;
      case 'yt':
        this.getYouTubePosts();
        break;
    }
  }

  getNewsContent() {
    this.dataService.setIsLastPage(false);
    const lastId = this.dataService.lastNewsItemId ? this.dataService.lastNewsItemId - 1 : null;
    // console.log('🚀 ~ file: news-section.component.ts ~ line 412 ~ NewsSectionComponent ~ getNewsContent ~ this.dataService.lastNewsItemId', this.dataService.lastNewsItemId);
    this.newsService.getNews(
      this.dataService.userLanguages, this.dataService.countries, "RSS", this.dataService.tags, this.dataService.query,
      this.dataService.page, this.pageSize, this.dataService.sports, lastId, this.dataService.lastNewsAdsId
    ).subscribe((response: any) => {
      const content = response.content;
      this.dataService.lastNewsAdsId.push(...content.filter((value) => value.hasOwnProperty('type') && (value.type === 'AFFILIATE' || value.type === 'ADS')).map((value) => value.id));
      this.dataService.isLoaded = true;
      if (!this.dataService.recurringCall) {
        const currentContent = new NewsContent(content, this.dataService.socialType, this.dataService.recurringCall);
        this.dataService.contentSlides = currentContent.slides;
        this.dataService.newsBoxes = currentContent.newsBoxes;
        console.log('🚀 ~ file: news-section.component.ts ~ line 299 ~ NewsSectionComponent ~ ).subscribe ~ this.dataService.newsBoxes', this.dataService.newsBoxes);
        this.dataService.lastNewsItemId = currentContent.getLastNewId();
      } else {
        if (content.length) {
          const currentContent = new NewsContent(content, this.dataService.socialType,
            this.dataService.recurringCall, this.dataService.newsBoxes);
          this.dataService.newsBoxes = currentContent.newsBoxes;
          this.dataService.lastNewsItemId = currentContent.getLastNewId();
        }
      }
      if (this.dataService.query === '' && this.dataService.tags.length === 0) {
        //console.log(this.dataService.query);
        this.dataService.countryBasedLoadedData.updateContent(
          this.dataService.userLanguages[0], this.dataService.contentSlides, this.dataService.newsBoxes,
          this.dataService.socialType, this.dataService.page, this.dataService.countries);
      }
      this.dataService.setLoader(false);
      this.dataService.setQueryLoader(false);
      this.socialUpdating = false;
      this.dataService.isSlideEmpty = !this.dataService.contentSlides.length;
      this.dataService.setIsLastPage(response.last);
      this.isLastPage = response.last;
      // console.log('🚀 ~ file: news-section.component.ts ~ line 528 ~ NewsSectionComponent ~ ).subscribe ~ this.dataService.contentSlides', this.dataService.contentSlides.length);
      //console.log(this.dataService.countryBasedLoadedData);
      console.log(this.dataService.newsBoxes);
      //console.log(this.dataService.lastNewsItemId);
    });
  }

  getFacebookPosts() {
    this.dataService.setIsLastPage(false);
    const lastId = this.dataService.lastFbItemId ? this.dataService.lastFbItemId - 1 : null;
    this.socialService.getPosts(Social.FACEBOOK, this.dataService.countries, this.dataService.tags, this.dataService.query, this.dataService.page,
      this.fbPageSize, this.dataService.sports, this.dataService.userLanguages, lastId, this.dataService.lastFbAdsId
    ).subscribe((response: any) => {
      //console.log(response);
      const content = response.content;
      this.dataService.lastFbAdsId.push(...content.filter((value) => value.hasOwnProperty('type') && (value.type === 'AFFILIATE' || value.type === 'ADS')).map((value) => value.id));
      this.dataService.isLoaded = true;
      this.fbContent = content;
      if (!this.dataService.recurringCall) {
        const currentContent = new FacebookContent(content, this.dataService.socialType, this.dataService.recurringCall);
        this.dataService.contentSlides = currentContent.slides;
        this.dataService.fbBoxes = currentContent.fbBoxes;
        console.log('🚀 ~ file: news-section.component.ts ~ line 340 ~ NewsSectionComponent ~ ).subscribe ~ this.dataService.fbBoxes', this.dataService.fbBoxes);
        this.dataService.lastFbItemId = currentContent.getLastId();
      } else {
        if (content.length) {
          const currentContent = new FacebookContent(
            content, this.dataService.socialType, this.dataService.recurringCall, this.dataService.fbBoxes);
          this.dataService.fbBoxes = currentContent.fbBoxes;
          this.dataService.lastFbItemId = currentContent.getLastId();
        }
      }
      if (this.dataService.query === '' && this.dataService.tags.length === 0) {
        //console.log(this.dataService.query);
        this.dataService.countryBasedLoadedData.updateContent(
          this.dataService.userLanguages[0], this.dataService.contentSlides, this.dataService.fbBoxes,
          this.dataService.socialType, this.dataService.page, this.dataService.countries);
      }
      this.socialUpdating = false;
      this.dataService.setLoader(false);
      this.dataService.setQueryLoader(false);
      this.dataService.isSlideEmpty = !this.dataService.contentSlides.length;
      this.dataService.setIsLastPage(response.last);
      this.isLastPage = response.last;
      //console.log(this.dataService.fbBoxes);
      //console.log(this.dataService.countryBasedLoadedData);
    });
  }

  getInstagramPosts() {
    this.dataService.setIsLastPage(false);
    const lastId = this.dataService.lastIgItemId ? this.dataService.lastIgItemId - 1 : null;
    this.socialService.getPosts(Social.INSTAGRAM, this.dataService.countries, this.dataService.tags, this.dataService.query, this.dataService.page,
      this.igPageSize, this.dataService.sports, this.dataService.userLanguages, lastId, this.dataService.lastIgAdsId
    ).subscribe((response: any) => {
      //console.log(response);
      const content = response.content;
      this.dataService.lastIgAdsId.push(...content.filter((value) => value.hasOwnProperty('type') && (value.type === 'AFFILIATE' || value.type === 'ADS')).map((value) => value.id));
      this.dataService.isLoaded = true;
      this.igContent = content;
      if (!this.dataService.recurringCall) {
        const currentContent = new InstagramContent(content, this.dataService.socialType, this.dataService.recurringCall);
        this.dataService.contentSlides = currentContent.slides;
        this.dataService.igBoxes = currentContent.igBoxes;
        this.dataService.lastIgItemId = currentContent.getLastId();
      } else {
        if (content.length) {
          const currentContent = new InstagramContent(
            content, this.dataService.socialType, this.dataService.recurringCall, this.dataService.igBoxes);
          this.dataService.igBoxes = currentContent.igBoxes;
          this.dataService.lastIgItemId = currentContent.getLastId();
        }
      }
      if (this.dataService.query === '' && this.dataService.tags.length === 0) {
        this.dataService.countryBasedLoadedData.updateContent(
          this.dataService.userLanguages[0], this.dataService.contentSlides, this.dataService.igBoxes,
          this.dataService.socialType, this.dataService.page, this.dataService.countries);
      }
      this.socialUpdating = false;
      this.dataService.setLoader(false);
      this.dataService.setQueryLoader(false);
      this.dataService.isSlideEmpty = !this.dataService.contentSlides.length;
      this.dataService.setIsLastPage(response.last);
      this.isLastPage = response.last;
      //console.log(this.dataService.igBoxes);
      //console.log(this.dataService.countryBasedLoadedData);
    });
  }

  getTwitterPosts() {
    this.dataService.setIsLastPage(false);
    const lastId = this.dataService.lastTwItemId ? this.dataService.lastTwItemId - 1 : null;
    this.socialService.getPosts(Social.TWITTER, this.dataService.countries, this.dataService.tags, this.dataService.query, this.dataService.page,
      this.twPageSize, this.dataService.sports, this.dataService.userLanguages, lastId, this.dataService.lastTwAdsId
    ).subscribe((response: any) => {
      //console.log(response);
      const content = response.content;
      this.dataService.lastTwAdsId.push(...content.filter((value) => value.hasOwnProperty('type') && (value.type === 'AFFILIATE' || value.type === 'ADS')).map((value) => value.id));
      this.dataService.isLoaded = true;
      this.twContent = content;
      if (!this.dataService.recurringCall) {
        const currentContent = new TwitterContent(content, this.dataService.socialType, this.dataService.recurringCall);
        this.dataService.contentSlides = currentContent.slides;
        this.dataService.twBoxes = currentContent.twBoxes;
        this.dataService.lastTwItemId = currentContent.getLastId();
      } else {
        if (content.length) {
          const currentContent = new TwitterContent(
            content, this.dataService.socialType, this.dataService.recurringCall, this.dataService.twBoxes);
          this.dataService.twBoxes = currentContent.twBoxes;
          this.dataService.lastTwItemId = currentContent.getLastId();
        }
      }
      if (this.dataService.query === '' && this.dataService.tags.length === 0) {
        this.dataService.countryBasedLoadedData.updateContent(
          this.dataService.userLanguages[0], this.dataService.contentSlides, this.dataService.twBoxes,
          this.dataService.socialType, this.dataService.page, this.dataService.countries);
      }
      this.socialUpdating = false;
      this.dataService.setLoader(false);
      this.dataService.setQueryLoader(false);
      this.dataService.isSlideEmpty = !this.dataService.contentSlides.length;
      this.dataService.setIsLastPage(response.last);
      this.isLastPage = response.last;
      //console.log(this.dataService.twBoxes);
      //console.log(this.dataService.countryBasedLoadedData);
    });
  }

  getYouTubePosts() {
    this.dataService.setIsLastPage(false);
    const lastId = this.dataService.lastYtItemId ? this.dataService.lastYtItemId - 1 : null;
    this.socialService.getPosts(Social.YOUTUBE, this.dataService.countries, this.dataService.tags, this.dataService.query, this.dataService.page,
      this.ytPageSize, this.dataService.sports, this.dataService.userLanguages, lastId, this.dataService.lastYtAdsId
    ).subscribe((response: any) => {
      //console.log(response);
      const content = response.content;
      this.dataService.lastYtAdsId.push(...content.filter((value) => value.hasOwnProperty('type') && (value.type === 'AFFILIATE' || value.type === 'ADS')).map((value) => value.id));
      this.dataService.isLoaded = true;
      this.ytContent = content;
      if (!this.dataService.recurringCall) {
        const currentContent = new YouTubeContent(content, this.dataService.socialType, this.dataService.recurringCall);
        this.dataService.contentSlides = currentContent.slides;
        this.dataService.ytBoxes = currentContent.ytBoxes;
        this.dataService.lastYtItemId = currentContent.getLastId();
      } else {
        if (content.length) {
          const currentContent = new YouTubeContent(
            content, this.dataService.socialType, this.dataService.recurringCall, this.dataService.ytBoxes);
          this.dataService.ytBoxes = currentContent.ytBoxes;
          this.dataService.lastYtItemId = currentContent.getLastId();
        }
      }
      if (this.dataService.query === '' && this.dataService.tags.length === 0) {
        this.dataService.countryBasedLoadedData.updateContent(
          this.dataService.userLanguages[0], this.dataService.contentSlides, this.dataService.ytBoxes,
          this.dataService.socialType, this.dataService.page, this.dataService.countries);
      }
      this.socialUpdating = false;
      this.dataService.setLoader(false);
      this.dataService.setQueryLoader(false);
      this.dataService.isSlideEmpty = !this.dataService.contentSlides.length;
      this.dataService.setIsLastPage(response.last);
      this.isLastPage = response.last;
      //console.log(this.dataService.twBoxes);
      //console.log(this.dataService.countryBasedLoadedData);
    });
  }

  setFbNextButton(items) {
    if (items.length < 20) {
      this.fbNextButtonActive = false;
    } else {
      this.fbNextButtonActive = true;
    }
    // //console.log(this.fbNextButtonActive);
  }

  previousFbBatch() {
    this.moveMosaicToStart();
    this.dataService.page -= 1;
    this.foundingExistedData(this.dataService.userLanguages[0], this.dataService.socialType);
  }

  nextFbBatch() {
    this.dataService.recurringCall = true;
    this.dataService.page += 1;
    this.foundingExistedData(this.dataService.userLanguages[0], this.dataService.socialType);
  }

  ngOnDestroy() {
    this.dataServiceSub?.unsubscribe();
    this.slidesSubs.forEach(sub => {
      sub?.unsubscribe();
    });
    this.data$.next();
    this.data$.complete();
  }

  onInfiniteScroll() {
    if (!this.isLastPage) {
      this.dataService.recurringCall = true;
      // this.dataService.page += 1;
      this.getLatestContent();
    }
  }

  scrollToNextSlide() {
    // if (this.nextSlide === 0) {
    //   this.nextSlide += 1;
    // }
    // if (this.nextSlide === 1) {
    //   this.carousel.next();
    // }
    // setTimeout(() => {
    //   this.nextSlide = 0;
    // }, 100);
    const testimonials = document.querySelector('#slideNewsIndicators');
    const scroller = testimonials.querySelector('.im-carousel');

    const itemWidth = this.getSlideClientWidth();
    // ////console.log('NewsSectionComponent.scrollToNextSlide', scroller.scrollLeft, scroller.scrollWidth, itemWidth);
    if ((scroller.scrollLeft) < (scroller.scrollWidth - itemWidth)) {
      // ////console.log('Check succeeded');
      scroller.scrollBy({ left: itemWidth + 1, top: 0, behavior: 'smooth' });
    }
  }

  scrollToPrevSlide() {
    // if (this.prevSlide === 0) {
    //   this.prevSlide += 1;
    // }
    // if (this.prevSlide === 1) {
    //   this.carousel.prev();
    // }
    // setTimeout(() => {
    //   this.prevSlide = 0;
    // }, 100);
    const testimonials = document.querySelector('#slideNewsIndicators');
    const scroller = testimonials.querySelector('.im-carousel');
    const itemWidth = this.getSlideClientWidth();

    if (scroller.scrollLeft !== 0) {
      scroller.scrollBy({ left: -itemWidth, top: 0, behavior: 'smooth' });
    }
  }

  private getSlideClientWidth(): number {
    let width = 0;
    $('.im-carousel__item').each((idx, itm) => {
      if (itm.clientWidth) {
        width = itm.clientWidth;
        return false;
      }
    });
    return width;
  }


  // if layout orientation change then adjust the scroller.
  // private orientationChange(m) {
  //   // const pthis = this;
  //   // // //console.log('NewsSectionComponent.orientationChange, m:', m);
  //   // if (m.matches) {
  //   //   // if landscape
  //   //   // pthis.infiniteScrollHorizontal = true;
  //   //   // add mouse wheen trigger event on right side news boxes.
  //   //   $(".tiles-container").mousewheel(function (event, delta) {
  //   //     //console.log(event);
  //   //     //console.log(delta);
  //   //     event.preventDefault();
  //   //     // Check navigator value, 'MAC' may involve other browsers
  //   //     if (pthis.isMac) {
  //   //       this.scrollLeft -= (delta * .9);
  //   //     } else {
  //   //       this.scrollLeft -= (delta * 100);
  //   //     }
  //   //     // ////console.log('tiles-container.mousewheel:', event, delta, this.scrollLeft);
  //   //   });
  //   // } else {
  //   //   // if portrait
  //   //   // pthis.infiniteScrollHorizontal = false;
  //   //   $(".tiles-container").unbind();
  //   // }
  // }

  mosaicScroll(event) {
    if (event.deltaX === -0) {
      this.mosaicView.nativeElement.scrollLeft += (event.deltaY * .9);
      // console.log(this.mosaicView.nativeElement.scrollLeft);
      this.dataService.scrolledLeft = this.mosaicView.nativeElement.scrollLeft;
    }

    if (event.deltaY === -0) {
      this.mosaicView.nativeElement.scrollLeft += (event.deltaX * .9);
      // console.log(this.mosaicView.nativeElement.scrollLeft);
      this.dataService.scrolledLeft = this.mosaicView.nativeElement.scrollLeft;
    }
  }

  onScrollBigSlider(event) {
    this.newsService.mouseScrollEvent.next(event);
  }

  private moveMosaicToStart() {
    $(".tiles-container").scrollLeft(0);
    window.scrollTo(0, 0);
  }
  private moveToFirstSlide() {
    $(".im-carousel").scrollLeft(0);
  }

  socialChanged(social: SocialType) {
    this.dataService.isLoaded = false;
    this.dataService.query = '';
    this.dataService.tags = [];
    this.dataService.page = 0;
    this.dataService.recurringCall = false;
    if (social === 'home' || social === 'zt') {
      if (social === 'home') {
        social = 'zt';
        this.getNewsContent();
      }
      this.newsService.getShortcutImgs(this.dataService.userLanguages, social, this.dataService.countries).subscribe(shortCutImages => {
        // //console.log(shortCutImages);
        if (shortCutImages.length > 0) {
          this.newsService.updateShortCutImagesStatus(true);
          this.dataService.currShortcuts = shortCutImages;
        }
      });
    } else {
      //console.log('🚀 ~ file: news-section.component.ts ~ line 610 ~ NewsSectionComponent ~ this.newsService.getShortcutImgs ~ this.dataService.countries', this.dataService.countries);
      this.newsService.getShortcutImgs(this.dataService.userLanguages, social, this.dataService.countries).subscribe(shortCutImages => {
        // //console.log(shortCutImages);
        if (shortCutImages.length > 0) {
          this.newsService.updateShortCutImagesStatus(true);
          this.dataService.currShortcuts = shortCutImages;
        }
      });
    }
    this.socialUpdating = true;
    this.dataService.socialType = social;
    this.dataService.contentSlides = [];
    this.dataService.scrolledLeft = 0;
    this.moveMosaicToStart();
    this.moveToFirstSlide();
    this.foundingExistedData(this.dataService.userLanguages[0], this.dataService.socialType);
    this.newsService.updateSocialType(social);
  }

  hasBoxesContent(): boolean {
    switch (this.dataService.socialType) {
      case 'zt':
        return this.dataService.newsBoxes.length > 0;
      case 'fb':
        return this.dataService.fbBoxes.length > 0;
      case 'ig':
        return this.dataService.igBoxes.length > 0;
      case 'tw':
        return this.dataService.twBoxes.length > 0;
      case 'yt':
        return this.dataService.ytBoxes.length > 0;
    }
  }

  filterContentAndRender(page: number, size: number, tags: string[], query: string) {
    this.dataService.isLoaded = false;
    this.dataService.isSlideEmpty = false;
    this.dataService.lastNewsItemId = null;
    this.dataService.lastFbItemId = null;
    this.dataService.lastIgItemId = null;
    this.dataService.lastTwItemId = null;
    this.dataService.lastYtItemId = null;
    this.dataService.lastNewsAdsId = [];
    this.dataService.lastFbAdsId = [];
    this.dataService.lastIgAdsId = [];
    this.dataService.lastTwAdsId = [];
    this.dataService.lastYtAdsId = [];
    this.dataService.query = query;
    this.dataService.tags = tags;
    this.dataService.page = page;
    this.pageSize = size;
    this.dataService.recurringCall = false;
    this.moveMosaicToStart();
    this.getLatestContent();
  }

  querySelected(selected: string) {
    //console.log("query selec into news component", selected);
    this.dataService.setQueryLoader(true);
    this.filterContentAndRender(0, 20, [], selected);
  }

  advancedSearch() {
    const ref = this.searchDialog.open(SearchDialogComponent, {
      minWidth: '100%',
      maxHeight: '100%',
      minHeight: '100%',
      data: {
        shortcuts: this.dataService.currShortcuts
      },
    });

    ref.afterClosed().subscribe(result => {
      if (result) {
        //console.log(result);
        this.dataService.countries = result.countries;
        this.dataService.sports = result.sports;
        this.filterContentAndRender(0, 20, result.tags, result.query);
        //Perhaps we should clear the filter after this
      }
    });
  }

  filterBySport(selectedSports) {
    console.log('🚀 ~ file: news-section.component.ts ~ line 905 ~ NewsSectionComponent ~ filterBySport ~ selectedSports', selectedSports);
    this.dataService.sports = selectedSports;
    this.filterContentAndRender(0, 20, this.dataService.tags, this.dataService.tags.join(', '));
  }

  onItemError(p) {
    //console.log(p);
  }

}
