import { Component, Input, OnChanges, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { SocialType } from '../../social-type';
import { TwitterItem } from '../twitter-item';
import { TwitterContentBox } from './../twitter-content-box';
import { DataService } from 'src/app/shared/_service/data/data.service';
import { BehaviorSubject, Subscription } from 'rxjs';

const PAGE_SIZE = 60;
@Component({
  selector: 'app-twitter-content',
  templateUrl: './twitter-content.component.html',
  styleUrls: ['./twitter-content.component.scss']
})
export class TwitterContentComponent implements OnInit, OnChanges, OnDestroy {

  languages: string[];
  countries: string[];
  sports: string[] = [];
  page: number = 0;
  pageSize: number;
  tags: string[];
  query: string;
  readonly socialType: SocialType = 'tw';

  @Input() hidden = false;
  @Input() twBoxes: TwitterContentBox[] = [];
  twSlides: TwitterItem[] = [];
  allLangPosts: any[] = [];
  @ViewChild('template', { static: true }) template;
  isLastPage: boolean;
  isLastPageSubscription: Subscription;
  totalColumn: number;
  totalItem: number;

  private slides$ = new BehaviorSubject<TwitterItem[]>([]);
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
          this.totalColumn = this.twBoxes.length;
          this.totalItem = this.twBoxes.reduce((accumulator, current) => accumulator + current.items.length, 0);
        }
      });
  }

  openItem(item: TwitterItem) {
    console.log('TwitterContentComponent.openItem(), item:', item);
  }
  onItemError(item: TwitterItem) {
    this.removeItem(item);
  }

  removeItem(item: TwitterItem) {
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
