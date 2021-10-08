import { Component, Input, OnInit, OnDestroy, Output, EventEmitter, HostBinding } from '@angular/core';
import { SubscriptionLike } from 'rxjs';

import { NewsItem } from '../news-item';
import { ImagePreloadService } from 'src/app/shared/_service/image-preload/image-preload.service';
import { NewsService } from "../../../../shared/_service/news/news.service";
import * as moment from 'moment';

@Component({
  selector: 'app-news-tile',
  templateUrl: './news-tile.component.html',
  styleUrls: ['./news-tile.component.scss']
})
export class NewsTileComponent implements OnInit {

  @Input() newsItem: NewsItem;
  @Input() isBottom: boolean;
  @Input() language: string;
  @Input() hidden: boolean;
  @Output() opened = new EventEmitter<NewsItem>();
  @HostBinding('class.d-none') get displayNone() {
    return this.hidden;
  }

  imageLoaded = false;
  displayVideoThumb = true;
  shareUrl: string;

  private imageLoadedSub: SubscriptionLike;
  private imageErrorSub: SubscriptionLike;

  constructor(
    private imagePreloadService: ImagePreloadService,
    private newService: NewsService
  ) { }

  ngOnInit(): void {
    //console.log('newsItem', this.newsItem);
    if (this.newsItem && !this.newsItem.hasOwnProperty('type')) {
      this.generateShareUrl();
    }
  }

  openNews() {
    this.newService.selectNew(this.newsItem.id.toString()).subscribe(result => {
    }, error => {
      //console.log(error);
    });
    this.opened.emit(this.newsItem);
  }

  onVideoThumbError() {
    //console.log('NewsTileComponent.onVideThumbError, displayVideoThumb:', this.displayVideoThumb);
    this.displayVideoThumb = false;
  }

  onImageLoad() {
    this.imageLoaded = true;
  }

  notifyImageError(newsItem) {
    // //console.log(newsItem);
  }
  
  private generateShareUrl() {
    const url = this.generateUrl(this.newsItem);
    this.shareUrl = `${window.location.origin}/${url}`;
  }

  private generateUrl(item): string {
    console.log('🚀 ~ file: news-tile.component.ts ~ line 71 ~ NewsTileComponent ~ generateUrl ~ item', item);
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
}
