import { Component, Input, OnInit, ViewChild, ViewContainerRef, ChangeDetectorRef, OnDestroy, OnChanges } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, Subscription } from 'rxjs';

import { NetworkAwarePreloadStrategy } from 'src/app/NetworkAwarePreloadStrategy';
import { ImagePreloadService } from 'src/app/shared/_service/image-preload/image-preload.service';
import { NewsService } from 'src/app/shared/_service/news/news.service';
import { NewsItem } from '../news-item';
import { NewsContentBox } from '../news-content-box';
import { SocialType } from 'src/app/news/news-section/social-type';
import { Router } from '@angular/router';
import { DataService } from '../../../../shared/_service/data/data.service';
import * as moment from 'moment';

@Component({
  selector: 'app-news-content',
  templateUrl: './news-content.component.html',
  styleUrls: ['./news-content.component.scss']
})
export class NewsContentComponent implements OnInit, OnChanges, OnDestroy {

  // ContentProvider members
  languages: string[] = [];
  countries: string[] = [];
  sports: string[] = [];
  page = 0;
  pageSize: number;
  tags: string[] = [];
  query = '';
  readonly socialType: SocialType = 'zt';

  @Input() hidden = false;
  @Input() newsBoxes: NewsContentBox[] = [];
  newsSlides: NewsItem[] = [];
  allLangNews: any[] = [];
  isLastPage: boolean;
  isLastPageSubscription: Subscription;
  totalColumn: number;
  totalItem: number;

  @ViewChild('template', { static: true }) template;

  private slides$ = new BehaviorSubject<NewsItem[]>([]);

  constructor(
    private viewContainerRef: ViewContainerRef,
    private changeDetectorRef: ChangeDetectorRef,
    private newsService: NewsService,
    private preloadStrategy: NetworkAwarePreloadStrategy,
    private imagePreloadService: ImagePreloadService,
    private dialog: MatDialog,
    private router: Router,
    private dataService: DataService
  ) {
    this.isLastPage = false;
  }

  ngOnInit() {
    this.viewContainerRef.createEmbeddedView(this.template);
    console.log('🚀 ~ file: news-content.component.ts ~ line 35 ~ NewsContentComponent ~ newsBoxes', this.newsBoxes);
  }

  ngOnChanges(): void {
    this.getIsLastPage();
  }


  private getIsLastPage(): void {
    this.isLastPageSubscription = this.dataService.getIsLastPage()
      .subscribe((response: boolean) => {
        if (response) {
          this.isLastPage = response;
          this.totalColumn = this.newsBoxes.length;
          this.totalItem = this.newsBoxes.reduce((accumulator, current) => accumulator + current.items.length, 0);
        }
      });
  }

  openItem(item: NewsItem) {
    console.log(item);
    this.dataService.openNewsItem = item;
    const url = this.generateUrl(item);
    this.router.navigate([`/${url}`]);
  }

  private generateUrl(item): string {
    const sport = item.sourceSport.toLowerCase();
    const publishedAt = this.convertDate(item.publishedAt);
    const title = item.title
      .replace(/[$&+,:;=\\?@#|/'<>.^*()%!-\"\.]/g, ' ').split(' ')
      .filter((ele: string) => ele)
      .map((ele: string) => ele.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase())
      .join('-');
    return `news/${sport}/${publishedAt}/${title}/${item.id}`;
  }

  private convertDate(publishedAt: Date): string {
    return moment(new Date(publishedAt)).format('YYYY-MM-DD');
  }

  ngOnDestroy() {
    if (this.isLastPageSubscription) {
      this.isLastPageSubscription.unsubscribe();
    }
  }

}
