import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { StoriesService } from 'src/app/shared/_service/stories/stories.service';
import { StoriesItem } from '../models/stories-item';

@Component({
  selector: 'app-stories-slide',
  templateUrl: './stories-slide.component.html',
  styleUrls: ['./stories-slide.component.scss']
})
export class StoriesSlideComponent implements OnInit {

  @Input() item: StoriesItem;
  @Input() index: number;
  @Output() opened = new EventEmitter<StoriesItem>();
  @Output() error = new EventEmitter<boolean>();

  titleImage: string;
  shareUrl: string;


  constructor(
    private router: Router,
    private storiesService: StoriesService
  ) {
  }

  ngOnInit(): void {
    this.titleImage = this.getTitleImage();
    this.generateShareUrl();
  }

  private getTitleImage(): string {
    return this.item.medias.find((media) => media.mediaType === 'IMAGE' && media.urlToMedia.includes('TITLE')).urlToMedia;
  }

  notifyImageError() {
    this.error.emit(true);
  }

  private generateShareUrl() {
    const url = this.generateUrl(this.item);
    this.shareUrl = `${window.location.origin}/${url}`;
  }

  async openStory() {
    await this.storiesService.selectStory(this.item.id.toString()).toPromise();
    const url = this.generateUrl(this.item);
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

}
