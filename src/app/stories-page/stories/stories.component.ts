import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subject, Subscription, SubscriptionLike } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CookieConsentDialogComponent } from 'src/app/shared/dialogs/cookie-consent-dialog/cookie-consent-dialog.component';
import { CookiesPreference } from 'src/app/shared/dialogs/modals/cookie-preference';
import { SearchDialogComponent } from 'src/app/shared/dialogs/search-dialog/search-dialog.component';
import { DataService } from 'src/app/shared/_service/data/data.service';
import { MetaService } from 'src/app/shared/_service/meta/meta.service';
import { StorageService } from 'src/app/shared/_service/storage/storage.service';
import { StoriesService } from 'src/app/shared/_service/stories/stories.service';
import { StoriesContent } from '../models/stories-model';
import { PreviouslyLoadedStoryContent } from '../models/storiesLoadedData';

// jQuery
declare var $: any;


@Component({
  selector: 'app-stories',
  templateUrl: './stories.component.html',
  styleUrls: ['./stories.component.scss']
})
export class StoriesComponent implements OnInit, AfterViewInit, OnDestroy {

  pageSize = 20;
  socialUpdating = false;
  @ViewChild('desktopMosaicView') private mosaicView: ElementRef<HTMLDivElement>;
  @ViewChild('mobileView') private mobileView: ElementRef<HTMLDivElement>;
  desktopView = true;
  infiniteScrollHorizontal: boolean;
  scrollWindow = false;
  isLastPage: boolean;

  private videoCompletedSub: SubscriptionLike
  videoCompleted: boolean;
  count = 1;

  @ViewChildren('carousel') carousel: QueryList<any>;
  @ViewChildren('stories') stories: QueryList<any>;

  data$: Subject<void> = new Subject();

  constructor(
    private storiesService: StoriesService,
    public dataService: DataService,
    protected searchDialog: MatDialog,
    private storageService: StorageService,
    private metaService: MetaService,
    private router: Router
  ) {
    this.isLastPage = false;
    this.dataService.intervalId = [];
  }

  ngOnInit(): void {
    this.initialContent();
    this.checkCookiesConsentStatus();
    this.videoCompletedSub = this.dataService.getVideoCompleted().subscribe(vidEnd => {
      this.videoCompleted = vidEnd;
      //NOTE: Commenting out this code as it's scrolling to top for mobile even after video is completed
      // while opening modal and going back to news page
      // if (window.innerWidth <= 767 && vidEnd) {
      //   window.scrollTo(0, 0);
      // }
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
    this.metaService.setDefaultMetaTags();
  }

  ngAfterViewInit(): void {
    this.carousel.changes
      .pipe(takeUntil(this.data$))
      .subscribe((ele) => {
        if (this.dataService.contentSlides.length) {
          this.autoSlide();
          this.cancelOnHover();
        }
      });
    this.stories.changes
      .pipe(takeUntil(this.data$))
      .subscribe((ele) => {
        if (this.mosaicView) {
          this.mosaicView.nativeElement.scrollLeft = this.dataService.scrolledLeft;
        } else if (this.mobileView) {
          document.addEventListener('scroll', this.updateMobileScroll.bind(this));
          window.scrollTo({ top: this.dataService.scrolledTop, behavior: 'smooth' });
        }
      })
  }

  checkCookiesConsentStatus() {
    console.log(this.storageService.getCookieConsentStatus());
    if (!this.storageService.getCookieConsentStatus()) {
      this.callCookieConsent();
    }
  }

  callCookieConsent() {
    const modelRef = this.searchDialog.open(CookieConsentDialogComponent, {
      panelClass: 'custom-cookie-Consent'
    });

    modelRef.afterClosed().subscribe((preferenceSet: boolean) => {
      console.log(!preferenceSet);
      if (!preferenceSet) {
        const cookiesPreference = new CookiesPreference();
        this.storageService.setCookieConsent(cookiesPreference);
        this.storageService.setCookieConsentStatus(true);
      }
    });
  }
  initialContent() {
    this.dataService.storyBasedLoadedData = new PreviouslyLoadedStoryContent(
      [], [], 'GB',
      this.dataService.page, this.dataService.countries);
    this.dataService
      .getUserLanguages()
      .pipe((takeUntil(this.data$)))
      .subscribe((userLang: string[]) => {
        if (userLang) {
          this.dataService.userLanguages = this.storageService.getUserLanguages();
          this.dataService.countries = this.storageService.getCountries();
          this.dataService.sports = this.storageService.getSports();
          console.log(this.dataService.sports);
          this.dataService.tags = [];
          this.dataService.query = '';
          this.dataService.page = 0;
          this.dataService.storiesBoxes = [];
          this.dataService.recurringCall = false;
          this.dataService.lastStoryItemId = null;
          this.dataService.lastStoriesAdsId = [];
          this.dataService.isLoaded = false;
          this.foundingExistedData(this.dataService.userLanguages[0], this.dataService.socialType);
          this.storiesService.getShortcutImgs(this.dataService.userLanguages, this.dataService.countries).subscribe(shortCutImages => {
            // //console.log(shortCutImages);
            if (shortCutImages.length > 0) {
              this.storiesService.updateShortCutImagesStatus(true);
              this.dataService.currShortcuts = shortCutImages;
            }
          });
        }
      });
  }

  foundingExistedData(langId: string, social: string) {
    const loadedData = this.dataService.storyBasedLoadedData.foundExistedContent(
      this.dataService.userLanguages[0], this.dataService.countries, this.dataService.page);
    if (loadedData) {
      this.dataService.contentSlides = loadedData.contentSlides;
      this.dataService.storiesBoxes = loadedData.contentBoxes;
      this.dataService.page = loadedData.page;
      this.dataService.isLoaded = true;
      setTimeout(() => {
        this.socialUpdating = false;
      }, 100);
    } else {
      this.dataService.page = 0;
      this.dataService.recurringCall = false;
      this.dataService.query = '';
      this.dataService.lastStoryItemId = '';
      this.emptyBoxesSlides();
      this.getStoriesContent();
    }
  }

  emptyBoxesSlides() {
    this.dataService.contentSlides = [];
    this.dataService.storiesBoxes = [];
  }

  filterContentAndRender(page: number, size: number, tags: string[], query: string) {
    this.dataService.isLoaded = false;
    this.dataService.isSlideEmpty = false;
    this.dataService.lastStoryItemId = null;
    this.dataService.lastStoriesAdsId = [];
    this.dataService.query = query;
    this.dataService.tags = tags;
    this.dataService.page = page;
    this.pageSize = size;
    this.dataService.recurringCall = false;
    this.count = 1;
    this.clearAllInterval();
    this.moveMosaicToStart();
    this.getStoriesContent();
  }

  getStoriesContent() {
    this.dataService.setIsLastPage(false);
    // console.log('🚀 ~ file: news-section.component.ts ~ line 412 ~ NewsSectionComponent ~ getNewsContent ~ this.dataService.lastNewsItemId', this.dataService.lastNewsItemId);
    const lastId = this.dataService.lastStoryItemId ? this.dataService.lastStoryItemId - 1 : null;
    this.storiesService.getStories(
      this.dataService.userLanguages, this.dataService.page, this.pageSize, this.dataService.sports,
      lastId, this.dataService.countries, this.dataService.tags, this.dataService.query, this.dataService.lastStoriesAdsId)
      .subscribe((response: any) => {
        const content = response.content;
        this.dataService.lastStoriesAdsId.push(...content.filter((value) => value.hasOwnProperty('type') && (value.type === 'AFFILIATE' || value.type === 'ADS')).map((value) => value.id))
        this.dataService.isLoaded = true;
        if (!this.dataService.recurringCall) {
          const currentContent = new StoriesContent(content, this.dataService.recurringCall);
          this.dataService.contentSlides = currentContent.slides;
          this.dataService.storiesBoxes = currentContent.storiesBoxes;
          this.dataService.lastStoryItemId = currentContent.getLastStoriesId();
        } else {
          if (content.length) {
            const currentContent = new StoriesContent(content,
              this.dataService.recurringCall, this.dataService.storiesBoxes);
            this.dataService.storiesBoxes = currentContent.storiesBoxes;
            this.dataService.lastStoryItemId = currentContent.getLastStoriesId();
          }
        }
        if (this.dataService.query === '' && this.dataService.tags.length === 0) {
          //console.log(this.dataService.query);
          this.dataService.storyBasedLoadedData.updateContent(
            this.dataService.userLanguages[0], this.dataService.contentSlides, this.dataService.storiesBoxes, this.dataService.page, this.dataService.countries);
        }
        this.dataService.setLoader(false);
        this.dataService.setQueryLoader(false);
        this.socialUpdating = false;
        this.dataService.isSlideEmpty = !this.dataService.contentSlides.length;
        this.dataService.setIsLastPage(response.last);
        this.isLastPage = response.last;
        // console.log('🚀 ~ file: news-section.component.ts ~ line 528 ~ NewsSectionComponent ~ ).subscribe ~ this.dataService.contentSlides', this.dataService.contentSlides.length);
        //console.log(this.dataService.storyBasedLoadedData);
        console.log(this.dataService.storiesBoxes);
        //console.log(this.dataService.lastStoryItemId);
      });
  }

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

  updateMobileScroll() {
    if (document.querySelector('.stories-optionX')) {
      this.dataService.scrolledTop = document.documentElement.scrollTop;
    }
  }

  private moveMosaicToStart() {
    $(".tiles-container").scrollLeft(0);
    window.scrollTo(0, 0);
  }

  onInfiniteScroll() {
    if (!this.isLastPage) {
      this.dataService.recurringCall = true;
      // this.dataService.page += 1;
      this.getStoriesContent();
    }
  }

  scrollToNextSlide() {
    const testimonials = document.querySelector('#slideStoriesIndicators');
    const scroller = testimonials.querySelector('.im-carousel');

    const itemWidth = this.getSlideClientWidth();
    // ////console.log('NewsSectionComponent.scrollToNextSlide', scroller.scrollLeft, scroller.scrollWidth, itemWidth);
    if ((scroller.scrollLeft) < (scroller.scrollWidth - itemWidth)) {
      // ////console.log('Check succeeded');
      scroller.scrollBy({ left: itemWidth + 1, top: 0, behavior: 'smooth' });
    }
  }

  scrollToPrevSlide() {
    const testimonials = document.querySelector('#slideStoriesIndicators');
    const scroller = testimonials.querySelector('.im-carousel');
    const itemWidth = this.getSlideClientWidth();

    if (scroller.scrollLeft !== 0) {
      scroller.scrollBy({ left: -itemWidth, top: 0, behavior: 'smooth' });
    }
  }

  onScrollBigSlider(event) {
    this.storiesService.mouseScrollEvent.next(event);
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

  openItem(event) {

  }

  private autoSlide() {
    console.log('🚀 ~ file: news-section.component.ts ~ line 700 ~ NewsSectionComponent ~ autoSlide ~ this.count', this.count);
    if (this.count <= 3) {
      const intervalId = setInterval(() => {
        $('.icon-sb-right').click();
        this.count++;
        if (this.count > 3) {
          clearInterval(intervalId);
          this.autoSlide();
        }
      }, 2000);
      this.dataService.intervalId.push(intervalId)
    } else {
      const intervalId = setInterval(() => {
        $('.icon-sb-left').click();
        this.count--;
        if (this.count < 1) {
          clearInterval(intervalId);
          this.autoSlide();
        }
      }, 2000);
      this.dataService.intervalId.push(intervalId)
    }
  }

  cancelOnHover() {
    $('#slideStoriesIndicators').on('mouseover', () => {
      this.clearAllInterval();
    });
    $('#slideStoriesIndicators').on('touchstart touchend', () => {
      this.clearAllInterval();
    });
  }

  clearAllInterval(): void {
    if (this.dataService.intervalId.length) {
      for (let i = 0; i < this.dataService.intervalId.length; i += 1) {
        clearInterval(this.dataService.intervalId[i]);
      }
      this.dataService.intervalId = [];
    }
  }

  goToCuriosities(): void {
    this.dataService.scrolledTop = 0;
    this.dataService.scrolledLeft = 0;
    console.log('🚀 ~ file: stories.component.ts ~ line 392 ~ StoriesComponent ~ goToCuriosities ~ this.dataService.scrolledLeft', this.dataService.scrolledLeft);
    this.router.navigateByUrl('/curiosities');
  }

  ngOnDestroy(): void {
    this.videoCompletedSub?.unsubscribe();
    this.clearAllInterval();
    if (this.mobileView) {
      document.removeEventListener('scroll', this.updateMobileScroll.bind(this));
    }
    this.data$.next();
    this.data$.complete();
  }


}
