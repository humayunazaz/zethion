import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { switchMap } from 'rxjs/operators';
import { MetaData } from 'src/app/model/meta-data.model';
import { MetaService } from 'src/app/shared/_service/meta/meta.service';
import { StoriesService } from 'src/app/shared/_service/stories/stories.service';
import { Paragraph, StoriesItem } from '../../models/stories-item';
import { SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-story-content',
  templateUrl: './story-content.component.html',
  styleUrls: ['./story-content.component.scss']
})
export class StoryContentComponent implements OnInit {

  titleImage: string;
  @Input() story: StoriesItem;
  @Input() ratingStars: string[];
  @Input() randomAds: SafeHtml[] = [];
  paragraphs: Paragraph[];
  youtubeVideo: string;
  innerImages: string[];
  hoverRating: number;
  @Output() isVisible: EventEmitter<number> = new EventEmitter<number>();

  constructor(
    private storiesService: StoriesService,
    private metaService: MetaService,
    private translate: TranslateService
  ) {
    this.hoverRating = 0;
  }

  ngOnInit(): void {
    this.setParagraphs();
    this.getMedias();
    this.setMetaTags();
  }

  private getMedias(): void {
    this.titleImage = this.story.medias.find((media) => media.mediaType === 'IMAGE' && media.urlToMedia.includes('TITLE')).urlToMedia;
    this.youtubeVideo = this.convertToEmbed(this.story.medias.find((media) => media.mediaType === 'VIDEO').urlToMedia);
    console.log('🚀 ~ file: story-content.component.ts ~ line 42 ~ StoryContentComponent ~ getMedias ~ youtubeVideo', this.youtubeVideo);
    this.innerImages = this.story.medias.filter((media) => media.mediaType === 'IMAGE' && media.urlToMedia.includes('P')).sort((prev, next) => prev.urlToMedia > next.urlToMedia ? 1 : -1).map((media) => media.urlToMedia);
    console.log('🚀 ~ file: story-content.component.ts ~ line 36 ~ StoryContentComponent ~ getMedias ~ this.innerImages', this.innerImages);
  }

  private setParagraphs(): void {
    this.paragraphs = this.story.paragraphs.sort((prev, next) => prev.code > next.code ? 1 : -1);
  }

  private convertToEmbed(url: string): string {
    const id = url.split('v=')[1];
    return `https://www.youtube.com/embed/${id}`;
  }

  hoverStar(rating: number): void {
    this.hoverRating = rating;
  }

  giveRating(rating: number): void {
    console.log(rating);
    this.storiesService.rateStory(this.story.id.toString(), rating.toString())
      .subscribe((response) => {
        console.log('🚀 ~ file: stories-item.component.ts ~ line 59 ~ StoriesItemComponent ~ .subscribe ~ response', response);
        if (response !== 'NaN') {
          this.story.clientRate = parseFloat(parseFloat(response).toFixed(1));
          this.story.rateAverage = parseFloat(parseFloat(response).toFixed(1));
        } else {
          this.story.clientRate = rating;
          this.story.rateAverage = rating;
        }
      });
  }

  private setMetaTags(): void {
    if (this.story) {
      let description, title;
      this.translate.get(`STORY.TITLE_${this.story.code}`)
        .pipe(switchMap((response) => {
          console.log('🚀 ~ file: story-content.component.ts ~ line 79 ~ StoryContentComponent ~ .subscribe ~ response', response);
          title = response;
          return this.translate.get(`STORY.SUBTITLE_${this.story.code}`)
        }))
        .pipe(switchMap((response) => {
          if (response) {
            console.log('🚀 ~ file: story-content.component.ts ~ line 79 ~ StoryContentComponent ~ .subscribe ~ response', response);
            title += ' - ' + response;
            return this.translate.get(`STORY.${this.paragraphs[0].code}_${this.story.code}`);
          }
        }))
        .subscribe((response) => {
          console.log('🚀 ~ file: story-content.component.ts ~ line 79 ~ StoryContentComponent ~ .subscribe ~ response', response);
          description = response;
          const meta: MetaData = {
            title,
            description,
            image: this.titleImage,
          }
          this.metaService.setMetaTags(meta);
        })
    }
  }

  onAppear(event: boolean, pageNumber: number): void {
    if (event) {
      console.log('🚀 ~ file: story-content.component.ts ~ line 102 ~ StoryContentComponent ~ onAppear ~ pageNumber', pageNumber);
      this.isVisible.emit(pageNumber);
    }
  }


}
