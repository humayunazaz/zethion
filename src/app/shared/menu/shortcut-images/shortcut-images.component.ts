import { Component, Input, OnInit, ElementRef, Renderer2, Output, EventEmitter, ViewChild, AfterViewInit, ViewChildren, QueryList, OnDestroy } from '@angular/core';

import { DataService } from 'src/app/shared/_service/data/data.service';
import { fromEvent, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { Router } from '@angular/router';
import { NewsService } from '../../_service/news/news.service';
declare var $: any;

@Component({
  selector: 'app-shortcut-images',
  templateUrl: './shortcut-images.component.html',
  styleUrls: ['./shortcut-images.component.scss']
})
export class ShortcutImagesComponent implements OnInit, AfterViewInit, OnDestroy {
  // @ViewChild ('scrollable', {static: true}) public scrollable : ElementRef;
  @ViewChild('shortCutImages') public scrollableImages: ElementRef<any>;
  @ViewChildren('shortCutImages') isShortCutImageReady: QueryList<any>;

  @Input() currShortcuts: any[] = [];
  @Output() clicked = new EventEmitter<string>();
  curr: any;
  loader = false;
  scroll: boolean;
  previousPosition = -1;
  @Input() storiesMenu = false;
  @Input() curiositiesMenu = false;
  viewChildrenSubscription: Subscription;
  socialTypeSubscription: Subscription;

  constructor(
    private data: DataService,
    private elem: ElementRef,
    private renderer: Renderer2,
    private router: Router,
    private newsService: NewsService
  ) { }

  ngOnInit(): void {
    this.data.getLoader().subscribe(loader => {
      this.loader = loader;
      if (this.loader === false) {
        this.curr = '';
      }
    });
  }

  ngAfterViewInit() {
    if (!this.router.url.includes('news') && !this.router.url.includes('curiosities')) {
      this.viewChildrenSubscription = this.isShortCutImageReady.changes.subscribe((ele) => {
        if ($(ele.first.nativeElement).is(':visible') && $(ele.last.nativeElement).is(':visible')) {
          console.log('🚀 ~ file: shortcut-images.component.ts ~ line 42 ~ ShortcutImagesComponent ~ this.isShortCutImageReady.changes.subscribe ~ ele', ele);
          this.autoScroll();
        }
      })
    }
  }

  onScroll(event: WheelEvent) {
    if (event.deltaX === -0) {
      if (event.deltaY < 0) {
        this.scrollableImages.nativeElement.scrollLeft -= 30;
      } else {
        this.scrollableImages.nativeElement.scrollLeft += 30;
      }
      event.stopPropagation();
      event.preventDefault();
    }
  }

  shortcutClick(ele) {
    this.curr = ele.id;
    this.data.setLoader(true);
    console.log('🚀 ~ file: shortcut-images.component.ts ~ line 59 ~ ShortcutImagesComponent ~ shortcutClick ~ ele.keyword', ele.keyword);
    this.clicked.emit(ele.keyword);
    this.stopScroll();
    if (this.viewChildrenSubscription) {
      this.viewChildrenSubscription.unsubscribe();
    }
  }

  setInvisible(invisible) {
    if (invisible) {
      this.renderer.addClass(this.elem.nativeElement, 'invisible');
    } else {
      this.renderer.removeClass(this.elem.nativeElement, 'invisible');
    }
  }

  verticalScrollImages(event) {
    console.log(event);
  }

  private animate(targetElement, speed): void {
    const scrollWidth = $(targetElement).get(0).scrollWidth;
    const clientWidth = $(targetElement).get(0).clientWidth;
    const that = this;
    console.log('🚀 ~ file: shortcut-images.component.ts ~ line 85 ~ ShortcutImagesComponent ~ animate ~  $(targetElement)', $(targetElement));
    $(targetElement).animate({ scrollLeft: scrollWidth - clientWidth }, {
      duration: speed,
      complete: function () {
        targetElement.animate({ scrollLeft: 0 },
          {
            duration: speed,
            complete: function () {
              that.animate(targetElement, speed);
            }
          });
      }
    });
  }

  private autoScroll(): void {
    console.log('called ?');
    if ($('.shortCutImages').length) {
      $('.shortCutImages').each((index, ele) => {
        this.animate($(ele), 5000);
      });
    } else {
      this.animate($('.shortCutImages'), 5000);
    }
    this.animate($('#scrollable'), 5000);
    $('#scrollable').on('mouseover', function () {
      $('#scrollable').stop(true, false);
    });
    $('#scrollable').on('touchstart touchend', function () {
      $('#scrollable').stop(true, false);
    });
  }

  private stopScroll(): void {
    if ($('.shortCutImages').length) {
      $('.shortCutImages').each((index, ele) => {
        $(ele).stop(true, false);
      });
    } else {
      $('.shortCutImages').stop(true, false);
    }
  }

  ngOnDestroy(): void {
    console.log('on destroy?');
    this.stopScroll();
    if (this.viewChildrenSubscription) {
      this.viewChildrenSubscription.unsubscribe();
    }
  }

}
