import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { DataService } from 'src/app/shared/_service/data/data.service';
import { StoriesService } from 'src/app/shared/_service/stories/stories.service';
import { StoriesItem } from '../models/stories-item';
import {StorageService} from "../../shared/_service/storage/storage.service";
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-stories-item',
  templateUrl: './stories-item.component.html',
  styleUrls: ['./stories-item.component.scss']
})
export class StoriesItemComponent implements OnInit {

  story: StoriesItem;
  relatedStories: StoriesItem[];
  hoverRating: number;
  ratingStars: string[];
  currentPage: number;
  shareUrl: string;
  currentLanguage: string;
  randomAds: SafeHtml[] = [];
  constructor(
    private storiesService: StoriesService,
    private activatedRoute: ActivatedRoute,
    public dataService: DataService,
    private storageService: StorageService,
    private router: Router,
    private domSanitizer: DomSanitizer
  ) {
    this.currentPage = 1;
    this.hoverRating = 0;
  }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params: any) => {
      const storyId = params.get('id');
      console.log('🚀 ~ file: story-content.component.ts ~ line 20 ~ StoryContentComponent ~ this.activatedRoute.paramMap.subscribe ~ storyId', storyId);
      this.story = null;
      this.getSingleStory(storyId);
      this.getRelatedStories(storyId);
    });
    this.currentLanguage = this.storageService.getCountry();
    this.storiesService.getRandomAds(this.currentLanguage).subscribe(ads => {
      ads.forEach(a => {
        const iframe = this.domSanitizer.bypassSecurityTrustHtml(a.html);
        this.randomAds.push(iframe);
      });
    });
  }

  private getSingleStory(storyId: string): void {
    this.storiesService.getSingleStory(storyId)
      .subscribe((response) => {
        console.log('🚀 ~ file: story-content.component.ts ~ line 28 ~ StoryContentComponent ~ .subscribe ~ response', response);
        this.story = response;
        this.story.rateAverage = parseFloat(parseFloat(this.story.rateAverage.toString()).toFixed(1));
        this.generateRatingStars();
        this.generateShareUrl();
      })
  }

  private getRelatedStories(storyId: string): void {
    this.storiesService.getRelatedStories(storyId)
      .subscribe((response) => {
        console.log('🚀 ~ file: stories-item.component.ts ~ line 44 ~ StoriesItemComponent ~ .subscribe ~ response', response);
        this.relatedStories = response.slice(0, 4);
      })
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
        this.generateRatingStars();
      });
  }

  private generateRatingStars(): void {
    if (this.story.rateAverage !== 'NaN') {
      this.ratingStars = [];
      if (Math.ceil(parseFloat(this.story.rateAverage.toString())) - parseFloat(this.story.rateAverage.toString()) > 0) {
        for (let i = 0; i < Math.floor(parseFloat(this.story.rateAverage.toString())); i += 1) {
          this.ratingStars.push('fa fa-star');
        }
        this.ratingStars.push('fas fa-star-half-alt');
      } else {
        for (let i = 0; i < Math.floor(parseFloat(this.story.rateAverage.toString())); i += 1) {
          this.ratingStars.push('fa fa-star');
        }
      }
      for (let i = 0; i < (5 - Math.ceil(parseFloat(this.story.rateAverage.toString()))); i += 1) {
        this.ratingStars.push('far fa-star');
      }
    }
  }

  highlightPage(pageNumber: number) {
    this.currentPage = pageNumber;
  }

  navigatePage(pageNumber: number): void {
    if (pageNumber !== this.currentPage) {
      this.currentPage = pageNumber;
      this.scrollToView(`page-${this.currentPage}`);
    }
  }

  private scrollToView(id) {
    const top = document.getElementById(id).offsetTop;
    document.querySelector('.story-item').scrollTo({ top, behavior: 'smooth' });
  }

  goBack(): void {
    this.router.navigateByUrl('/stories');
  }

  private generateShareUrl() {
    const url = this.generateUrl(this.story);
    this.shareUrl = `${window.location.origin}/${url}`;
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
