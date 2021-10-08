import { Component, EventEmitter, HostBinding, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { StoriesService } from 'src/app/shared/_service/stories/stories.service';
import { StoriesItem } from '../models/stories-item';

@Component({
  selector: 'app-stories-tile',
  templateUrl: './stories-tile.component.html',
  styleUrls: ['./stories-tile.component.scss']
})
export class StoriesTileComponent implements OnInit {

  @Input() storiesItem: StoriesItem;
  @Input() isBottom: boolean;
  @Input() language: string;
  @Input() hidden: boolean;
  @Output() opened = new EventEmitter<StoriesItem>();
  @HostBinding('class.d-none') get displayNone() {
    return this.hidden;
  }

  imageLoaded = false;
  titleImage: string;
  shareUrl: string;

  constructor(
    private storiesServices: StoriesService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.titleImage = this.getTitleImage();
    this.generateShareUrl();
    console.log('🚀 ~ file: stories-tile.component.ts ~ line 27 ~ StoriesTileComponent ~ ngOnInit ~ this.titleImage', this.titleImage);
  }

  private getTitleImage(): string {
    return this.storiesItem.medias.find((media) => media.mediaType === 'IMAGE' && media.urlToMedia.includes('TITLE')).urlToMedia;
  }

  private generateShareUrl() {
    const url = this.generateUrl(this.storiesItem);
    this.shareUrl = `${window.location.origin}/${url}`;
  }

  async openStory() {
    await this.storiesServices.selectStory(this.storiesItem.id.toString()).toPromise();
    const url = this.generateUrl(this.storiesItem);
    this.router.navigateByUrl(url);
  }

  private generateUrl(item: StoriesItem): string {
    const sport = item.sport.toLowerCase();
    const publishedAt = this.convertDate(item.publishedAt);
    const title = item.code
      .split('_')
      .map((ele: string) => ele.toLowerCase())
      .join('-');
    return `stories/${sport}/${publishedAt}/${title}/${item.id}`;
  }

  private convertDate(publishedAt: Date): string {
    return moment(new Date(publishedAt)).format('YYYY-MM-DD');
  }


  onImageLoad() {
    this.imageLoaded = true;
  }

  notifyImageError(newsItem) {
    // //console.log(newsItem);
  }

}
