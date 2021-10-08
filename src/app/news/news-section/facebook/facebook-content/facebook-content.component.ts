import { Component, Input, OnChanges, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';

import { BehaviorSubject, Subscription } from 'rxjs';

import { SocialType } from '../../social-type';
import { FacebookItem } from '../facebook-item';
import { FacebookContentBox } from './../facebook-content-box';
import { DataService } from 'src/app/shared/_service/data/data.service';

const PAGE_SIZE = 60;
@Component({
  selector: 'app-facebook-content',
  templateUrl: './facebook-content.component.html',
  styleUrls: ['./facebook-content.component.scss']
})
export class FacebookContentComponent implements OnInit, OnChanges, OnDestroy {

  languages: string[];
  countries: string[];
  sports: string[] = [];
  page: number = 0;
  pageSize: number;
  tags: string[];
  query: string;
  readonly socialType: SocialType = 'fb';
  @Input() hidden = false;
  @Input() fbBoxes: FacebookContentBox[] = [];
  fbSlides: FacebookItem[] = [];
  allLangPosts: any[] = [];
  @ViewChild('template', { static: true }) template;
  isLastPage: boolean;
  isLastPageSubscription: Subscription;
  totalColumn: number;
  totalItem: number;

  private slides$ = new BehaviorSubject<FacebookItem[]>([]);
  private rendered = false;

  constructor(
    private viewContainerRef: ViewContainerRef,
    private dataService: DataService
  ) {
    // fbServiceWrapper.init();
  }

  ngOnInit(): void {
    this.viewContainerRef.createEmbeddedView(this.template);
    console.log('🚀 ~ file: facebook-content.component.ts ~ line 51 ~ FacebookContentComponent ~ ngOnInit ~ this.fbBoxes', this.fbBoxes);
  }

  ngOnChanges(): void {
    this.getIsLastPage();
  }


  private getIsLastPage(): void {
    this.isLastPageSubscription = this.dataService.getIsLastPage()
      .subscribe((response: boolean) => {
        if (response) {
          this.isLastPage = response;
          this.totalColumn = this.fbBoxes.length;
          this.totalItem = this.fbBoxes.reduce((accumulator, current) => accumulator + current.items.length, 0);
        }
      });
  }

  openItem(item: FacebookItem) {
    console.log('FacebookContentComponent.openItem(), item:', item);
  }
  onItemError(item: FacebookItem) {
    this.removeItem(item);
  }

  removeItem(item: FacebookItem) {
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
