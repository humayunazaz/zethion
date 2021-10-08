import { Component, Input, OnChanges, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';

import { BehaviorSubject, Subscription } from 'rxjs';
import { SocialType } from '../../social-type';
import { InstagramItem } from '../instagram-item';
import { InstagramContentBox } from './../instagram-content-box';
import { DataService } from 'src/app/shared/_service/data/data.service';

const PAGE_SIZE = 60;
@Component({
  selector: 'app-instagram-content',
  templateUrl: './instagram-content.component.html',
  styleUrls: ['./instagram-content.component.scss']
})
export class InstagramContentComponent implements OnInit, OnChanges, OnDestroy {

  languages: string[];
  countries: string[];
  sports: string[] = [];
  page: number = 0;
  pageSize: number;
  tags: string[];
  query: string;
  readonly socialType: SocialType = 'ig';

  @Input() hidden = false;
  @Input() igBoxes: InstagramContentBox[] = [];
  igSlides: InstagramItem[] = [];
  allLangPosts: any[] = [];
  @ViewChild('template', { static: true }) template;
  isLastPage: boolean;
  isLastPageSubscription: Subscription;
  totalColumn: number;
  totalItem: number;

  private slides$ = new BehaviorSubject<InstagramItem[]>([]);
  private rendered = false;

  constructor(
    private viewContainerRef: ViewContainerRef,
    private dataService: DataService
  ) {
    // igServiceWrapper.init();
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
        this.isLastPage = response;
        this.totalColumn = this.igBoxes.length;
        this.totalItem = this.igBoxes.reduce((accumulator, current) => accumulator + current.items.length, 0);
      });
  }

  openItem(item: InstagramItem) {
    console.log('InstagramContentComponent.openItem(), item:', item);
  }
  onItemError(item: InstagramItem) {
    this.removeItem(item);
  }

  removeItem(item: InstagramItem) {
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
