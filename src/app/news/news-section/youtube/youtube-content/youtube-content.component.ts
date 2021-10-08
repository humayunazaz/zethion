import { Component, Input, OnChanges, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';

import { BehaviorSubject, Subscription } from 'rxjs';

import { SocialType } from '../../social-type';
import { YoutubeContentBox } from '../youtube-content-box';
import { YoutubeItem } from '../youtube-item';
import { DataService } from 'src/app/shared/_service/data/data.service';

const PAGE_SIZE = 60;
@Component({
  selector: 'app-youtube-content',
  templateUrl: './youtube-content.component.html',
  styleUrls: ['./youtube-content.component.scss']
})
export class YoutubeContentComponent implements OnInit, OnChanges, OnDestroy {

  languages: string[];
  countries: string[];
  sports: string[] = [];
  page: number = 0;
  pageSize: number;
  tags: string[];
  query: string;
  readonly socialType: SocialType = 'yt';

  @Input() hidden = false;
  @Input() ytBoxes: YoutubeContentBox[] = [];
  ytSlides: YoutubeItem[] = [];
  allLangPosts: any[] = [];
  @ViewChild('template', { static: true }) template;
  isLastPage: boolean;
  isLastPageSubscription: Subscription;
  totalColumn: number;
  totalItem: number;

  private slides$ = new BehaviorSubject<YoutubeItem[]>([]);
  private rendered = false;

  constructor(
    private viewContainerRef: ViewContainerRef,
    private dataService: DataService
  ) {
    // twServiceWrapper.init();
  }

  ngOnInit(): void {
    this.viewContainerRef.createEmbeddedView(this.template);
  }

  ngOnChanges(): void {
    this.getIsLastPage();
  }


  private getIsLastPage(): void {
    this.isLastPageSubscription = this.dataService.getIsLastPage()
      .subscribe((response: boolean) => {
        if (response) {
          this.isLastPage = response;
          this.totalColumn = this.ytBoxes.length;
          this.totalItem = this.ytBoxes.reduce((accumulator, current) => accumulator + current.items.length, 0);
        }
      });
  }

  openItem(item: YoutubeItem) {
    console.log('YoutubeContentComponent.openItem(), item:', item);
  }

  onItemError(item: YoutubeItem) {
    this.removeItem(item);
  }

  removeItem(item: YoutubeItem) {
    // for (const langId of Object.keys(this.allLangPosts)) {
    //   const thisLangContent = this.allLangPosts[langId];
    //   const postIndex = thisLangContent.content.findIndex(p => p.id === item.postId);
    //   if (postIndex > -1) {
    //     thisLangContent.content.splice(postIndex, 1);
    //     break;
    //   }
    // }
  }

  ngOnDestroy() {
    if (this.isLastPageSubscription) {
      this.isLastPageSubscription.unsubscribe();
    }
  }
}
