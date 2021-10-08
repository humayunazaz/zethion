import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SearchDialogComponent } from 'src/app/shared/dialogs/search-dialog/search-dialog.component';
import { CuriositiesService } from 'src/app/shared/_service/curiosities/curiosities.service';
import { DataService } from 'src/app/shared/_service/data/data.service';
import { MetaService } from 'src/app/shared/_service/meta/meta.service';
import { StorageService } from 'src/app/shared/_service/storage/storage.service';
import { CuriositiesContent } from '../models/curiosities-model';
import { PreviouslyLoadedCuriosityContent } from '../models/curiositiesLoadedData';

// jQuery
declare var $: any;


@Component({
  selector: 'app-curiosities',
  templateUrl: './curiosities.component.html',
  styleUrls: ['./curiosities.component.scss']
})
export class CuriositiesComponent implements OnInit, AfterViewInit, OnDestroy {

  pageSize = 20;
  socialUpdating = false;
  @ViewChild('desktopMosaicView') private mosaicView: ElementRef<HTMLDivElement>;
  @ViewChild('mobileView') private mobileView: ElementRef<HTMLDivElement>;
  desktopView = true;
  infiniteScrollHorizontal: boolean;
  scrollWindow = false;
  isLastPage: boolean;
  @ViewChildren('curiosities') curiosities: QueryList<any>;

  data$: Subject<void> = new Subject();

  constructor(
    private curiositiesService: CuriositiesService,
    public dataService: DataService,
    protected searchDialog: MatDialog,
    private storageService: StorageService,
    private metaService: MetaService
  ) {
    this.isLastPage = false;
  }

  ngOnInit(): void {
    this.initialContent();
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

  initialContent() {
    this.dataService.curiosityBasedLoadedData = new PreviouslyLoadedCuriosityContent(
      [], [], 'GB',
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
          this.dataService.curiositiesBoxes = [];
          this.dataService.recurringCall = false;
          this.dataService.lastCuriosityItemId = null;
          this.dataService.lastCuriositiesAdsId = [];
          this.dataService.isLoaded = false;
          this.foundingExistedData(this.dataService.userLanguages[0], this.dataService.socialType);
          this.curiositiesService.getShortcutImgs(this.dataService.userLanguages, this.dataService.countries).subscribe(shortCutImages => {
            // //console.log(shortCutImages);
            if (shortCutImages.length > 0) {
              this.curiositiesService.updateShortCutImagesStatus(true);
              this.dataService.currShortcuts = shortCutImages;
            }
          });
        }
      });
  }

  ngAfterViewInit(): void {
    this.curiosities.changes
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

  foundingExistedData(langId: string, social: string) {
    const loadedData = this.dataService.curiosityBasedLoadedData.foundExistedContent(
      this.dataService.userLanguages[0], this.dataService.countries, this.dataService.page);
    if (loadedData) {
      this.dataService.contentSlides = loadedData.contentSlides;
      this.dataService.curiositiesBoxes = loadedData.contentBoxes;
      this.dataService.page = loadedData.page;
      this.dataService.isLoaded = true;
      setTimeout(() => {
        this.socialUpdating = false;
      }, 100);
    } else {
      this.dataService.page = 0;
      this.dataService.recurringCall = false;
      this.dataService.query = '';
      this.dataService.lastCuriosityItemId = '';
      this.emptyBoxesSlides();
      this.getCuriositiesContent();
    }
  }

  emptyBoxesSlides() {
    this.dataService.contentSlides = [];
    this.dataService.curiositiesBoxes = [];
  }

  filterContentAndRender(page: number, size: number, tags: string[], query: string) {
    this.dataService.isLoaded = false;
    this.dataService.isSlideEmpty = false;
    this.dataService.lastCuriosityItemId = null;
    this.dataService.lastCuriositiesAdsId = [];
    this.dataService.query = query;
    this.dataService.tags = tags;
    this.dataService.page = page;
    this.pageSize = size;
    this.dataService.recurringCall = false;
    this.moveMosaicToStart();
    this.getCuriositiesContent();
  }

  getCuriositiesContent() {
    this.dataService.setIsLastPage(false);
    const lastId = this.dataService.lastCuriosityItemId ? this.dataService.lastCuriosityItemId - 1 : null;
    // console.log('🚀 ~ file: news-section.component.ts ~ line 412 ~ NewsSectionComponent ~ getNewsContent ~ this.dataService.lastNewsItemId', this.dataService.lastNewsItemId);
    this.curiositiesService.getCuriosities(
      this.dataService.userLanguages, this.dataService.page, this.pageSize, this.dataService.sports,
      lastId, this.dataService.countries, this.dataService.tags, this.dataService.query, this.dataService.lastCuriositiesAdsId)
      .subscribe((response: any) => {
        const content = response.content;
        this.dataService.lastCuriositiesAdsId.push(...content.filter((value) => value.hasOwnProperty('type') && (value.type === 'AFFILIATE' || value.type === 'ADS')).map((value) => value.id))
        this.dataService.isLoaded = true;
        if (!this.dataService.recurringCall) {
          const currentContent = new CuriositiesContent(content, this.dataService.recurringCall);
          this.dataService.contentSlides = currentContent.slides;
          console.log('🚀 ~ file: curiosities.component.ts ~ line 142 ~ CuriositiesComponent ~ .subscribe ~ this.dataService.contentSlides', this.dataService.contentSlides);
          this.dataService.curiositiesBoxes = currentContent.curiositiesBoxes;
          this.dataService.lastCuriosityItemId = currentContent.getLastCuriositiesId();
        } else {
          if (content.length) {
            const currentContent = new CuriositiesContent(content,
              this.dataService.recurringCall, this.dataService.curiositiesBoxes);
            this.dataService.curiositiesBoxes = currentContent.curiositiesBoxes;
            this.dataService.lastCuriosityItemId = currentContent.getLastCuriositiesId();
          }
        }
        if (this.dataService.query === '' && this.dataService.tags.length === 0) {
          //console.log(this.dataService.query);
          this.dataService.curiosityBasedLoadedData.updateContent(
            this.dataService.userLanguages[0], this.dataService.contentSlides, this.dataService.curiositiesBoxes, this.dataService.page, this.dataService.countries);
        }
        this.dataService.setLoader(false);
        this.dataService.setQueryLoader(false);
        this.socialUpdating = false;
        this.dataService.isSlideEmpty = !this.dataService.contentSlides.length;
        this.dataService.setIsLastPage(response.last);
        this.isLastPage = response.last;
        // console.log('🚀 ~ file: news-section.component.ts ~ line 528 ~ NewsSectionComponent ~ ).subscribe ~ this.dataService.contentSlides', this.dataService.contentSlides.length);
        //console.log(this.dataService.curiosityBasedLoadedData);
        console.log(this.dataService.curiositiesBoxes);
        //console.log(this.dataService.lastCuriosityItemId);
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
    if (document.querySelector('.curiosities-optionX')) {
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
      this.getCuriositiesContent();
    }
  }

  scrollToNextSlide() {
    const testimonials = document.querySelector('#slideCuriositiesIndicators');
    const scroller = testimonials.querySelector('.im-carousel');

    const itemWidth = this.getSlideClientWidth();
    // ////console.log('NewsSectionComponent.scrollToNextSlide', scroller.scrollLeft, scroller.scrollWidth, itemWidth);
    if ((scroller.scrollLeft) < (scroller.scrollWidth - itemWidth)) {
      // ////console.log('Check succeeded');
      scroller.scrollBy({ left: itemWidth + 1, top: 0, behavior: 'smooth' });
    }
  }

  scrollToPrevSlide() {
    const testimonials = document.querySelector('#slideCuriositiesIndicators');
    const scroller = testimonials.querySelector('.im-carousel');
    const itemWidth = this.getSlideClientWidth();

    if (scroller.scrollLeft !== 0) {
      scroller.scrollBy({ left: -itemWidth, top: 0, behavior: 'smooth' });
    }
  }

  onScrollBigSlider(event) {
    this.curiositiesService.mouseScrollEvent.next(event);
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

  ngOnDestroy(): void {
    if (this.mobileView) {
      document.removeEventListener('scroll', this.updateMobileScroll.bind(this));
    }
    this.data$.next();
    this.data$.complete();
  }

}
