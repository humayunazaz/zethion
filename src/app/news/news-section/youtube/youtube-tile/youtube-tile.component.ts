import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild, ElementRef } from '@angular/core';

import { FBPostComponent } from 'ngx-facebook';

import { MatDialog } from '@angular/material/dialog';
import { DataService } from 'src/app/shared/_service/data/data.service';
import { Router } from '@angular/router';
import { SocialService } from 'src/app/shared/_service/social/social.service';
import { YoutubeItem } from '../youtube-item';
import { SingleYt } from '../../models/yt-post-model';
import { MetaData } from 'src/app/model/meta-data.model';
import { MetaService } from 'src/app/shared/_service/meta/meta.service';
import * as moment from 'moment';

@Component({
  selector: 'app-youtube-tile',
  templateUrl: './youtube-tile.component.html',
  styleUrls: ['./youtube-tile.component.scss']
})
export class YoutubeTileComponent implements OnInit {

  @Input() youtubeItem: SingleYt;
  @Input() isOdd: boolean;
  @Input() language: string;
  @Input() hidden: boolean;
  @Output() opened = new EventEmitter<YoutubeItem>();
  loadLazy = true;
  imageLoaded = false;
  activePanHoverId = null
  shareUrl: string;

  constructor(
    private renderer: Renderer2,
    private element: ElementRef,
    private dialog: MatDialog,
    private dataService: DataService,
    private router: Router,
    private socialService: SocialService,
    private metaService: MetaService
  ) {
    // twServiceWrapper.init();
  }

  ngOnInit(): void {
    this.dataService.activePanHoverTileId.subscribe(id => {
      if (id && window.innerWidth <= 767) {
        this.activePanHoverId = id;
      } else {
        this.activePanHoverId = null;
      }
    });
    if (this.youtubeItem && !this.youtubeItem.hasOwnProperty('type')) {
      this.generateShareUrl();
    }
  }

  onImageLoad() {
    this.imageLoaded = true;
  }

  onPostClicked(item) {
    console.log('🚀 ~ file: twitter-tile.component.ts ~ line 43 ~ TwitterTileComponent ~ onPostClicked ~ item', item);
    console.log('TwitterTileComponent.onPostClicked');
    this.openItem(item);
  }

  openItem(data) {
    const metaData: MetaData = {
      title: data.socialPage.socialPageUsername,
      description: data.description,
      image: data.thumbnail
    }
    this.metaService.setMetaTags(metaData);
    console.log('🚀 ~ file: twitter-slide.component.ts ~ line 63 ~ TwitterSlideComponent ~ openItem ~ data', data);
    this.socialService.selectPost(data.id.toString()).subscribe(result => {
    }, error => {
      console.log(error);
    });
    this.dataService.openYtItem = data.postId;
    const url = this.generateUrl(this.youtubeItem);
    this.router.navigate([`/${url}`]);
  }

  notifyImageError(twitterItem) {
    console.log(twitterItem);
    this.youtubeItem.withOutThumbnail = true;
  }

  mobileHover() {
    this.dataService.activePanHoverTileId.next(this.youtubeItem.postId);
  }

  private generateShareUrl() {
    const url = this.generateUrl(this.youtubeItem);
    this.shareUrl = `${window.location.origin}/${url}`;
  }

  private generateUrl(item): string {
    const sport = item.socialPage.sport.toLowerCase();
    const publishedAt = this.convertDate(item.publishedAt);
    const title = item.socialPage.socialPageUsername
      .replace(/[$&+,:;=\\?@#|/'<>.^*()%!-\"\.]/g, ' ').split(' ')
      .filter((ele: string) => ele)
      .map((ele: string) => ele.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase())
      .join('-');
    return `news/posts/${sport}/${publishedAt}/youtube/${title}/${item.id}`;
  }

  private convertDate(publishedAt: Date): string {
    return moment(new Date(publishedAt)).format('YYYY-MM-DD');
  }

}
