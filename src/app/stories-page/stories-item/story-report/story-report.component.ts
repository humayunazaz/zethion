import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { StoriesService } from 'src/app/shared/_service/stories/stories.service';
import { StoriesItem } from '../../models/stories-item';

@Component({
  selector: 'app-story-report',
  templateUrl: './story-report.component.html',
  styleUrls: ['./story-report.component.scss']
})
export class StoryReportComponent implements OnInit {

  @Input() story: StoriesItem;
  titleImage: string;

  constructor(
    private router: Router,
    private storiesService: StoriesService
  ) { }

  ngOnInit(): void {
    this.titleImage = this.getTitleImage();
  }

  private getTitleImage(): string {
    return this.story.medias.find((media) => media.mediaType === 'IMAGE' && media.urlToMedia.includes('TITLE')).urlToMedia;
  }

  async openStory() {
    await this.storiesService.selectStory(this.story.id.toString()).toPromise();
    const url = this.generateUrl(this.story);
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
