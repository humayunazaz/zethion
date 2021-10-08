import { Component, Input, OnInit, OnDestroy, Output, EventEmitter, HostBinding } from '@angular/core';
import { SubscriptionLike } from 'rxjs';

import { ImagePreloadService } from 'src/app/shared/_service/image-preload/image-preload.service';
import * as moment from 'moment';
import { CuriositiesItem } from '../models/curiosities-item';
import { CuriositiesService } from 'src/app/shared/_service/curiosities/curiosities.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-curiosities-tile',
  templateUrl: './curiosities-tile.component.html',
  styleUrls: ['./curiosities-tile.component.scss']
})
export class CuriositiesTileComponent implements OnInit {

  @Input() curiositiesItem: CuriositiesItem;
  @Input() isBottom: boolean;
  @Input() language: string;
  @Output() opened = new EventEmitter<CuriositiesItem>();

  imageLoaded = false;
  displayVideoThumb = true;
  shareUrl: string;

  private imageLoadedSub: SubscriptionLike;
  private imageErrorSub: SubscriptionLike;

  constructor(
    private imagePreloadService: ImagePreloadService,
    private curiositiesService: CuriositiesService,
    private router: Router
  ) { }

  ngOnInit(): void {
    //console.log('newsItem', this.newsItem);
    if (this.curiositiesItem && !this.curiositiesItem.hasOwnProperty('type')) {
      this.generateShareUrl();
    }
  }

  onVideoThumbError() {
    //console.log('NewsTileComponent.onVideThumbError, displayVideoThumb:', this.displayVideoThumb);
    this.displayVideoThumb = false;
  }

  onImageLoad() {
    this.imageLoaded = true;
  }

  notifyImageError(curiositiesItem) {
    // //console.log(curiositiesItem);
  }
  
  private generateShareUrl() {
    const url = this.generateUrl(this.curiositiesItem);
    this.shareUrl = `${window.location.origin}/${url}`;
  }

  async openCuriosity() {
    await this.curiositiesService.selectCuriosity(this.curiositiesItem.id.toString()).toPromise();
    const url = this.generateUrl(this.curiositiesItem);
    this.router.navigateByUrl(url);
  }

  private generateUrl(item): string {
    const sport = item.sourceSport.toLowerCase();
    const publishedAt = this.convertDate(item.publishedAt);
    const title = item.title
      .replace(/[$&+,:;=\\?@#|/'<>.^*()%!-\"\.]/g, ' ').split(' ')
      .filter((ele: string) => ele)
      .map((ele: string) => ele.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase())
      .join('-');
    return `curiosities/${sport}/${publishedAt}/${title}/${item.id}`;
  }

  private convertDate(publishedAt: Date): string {
    return moment(new Date(publishedAt)).format('YYYY-MM-DD');
  }
}
