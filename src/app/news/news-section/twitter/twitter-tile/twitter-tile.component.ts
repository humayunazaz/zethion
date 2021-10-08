import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild, ElementRef } from '@angular/core';

import { FBPostComponent } from 'ngx-facebook';

import { TwitterItem } from '../twitter-item';
import { TwServiceWrapperService } from '../tw-service-wrapper.service';
import { MatDialog } from '@angular/material/dialog';
import { TwdialogComponent } from '../twdialog/twdialog.component';
import { SingleTw } from '../../models/tw-post-model';
import { DataService } from 'src/app/shared/_service/data/data.service';
import { Router } from '@angular/router';
import { SocialService } from 'src/app/shared/_service/social/social.service';
import { MetaData } from 'src/app/model/meta-data.model';
import { MetaService } from 'src/app/shared/_service/meta/meta.service';
import * as moment from 'moment';

@Component({
  selector: 'app-twitter-tile',
  templateUrl: './twitter-tile.component.html',
  styleUrls: ['./twitter-tile.component.scss']
})
export class TwitterTileComponent implements OnInit {

  @Input() twitterItem: SingleTw;
  @Input() isOdd: boolean;
  @Input() language: string;
  @Input() hidden: boolean;
  @Output() opened = new EventEmitter<TwitterItem>();
  loadLazy = true;
  imageLoaded = false;
  activePanHoverId = null
  shareUrl: string;

  constructor(
    private renderer: Renderer2,
    private element: ElementRef,
    twServiceWrapper: TwServiceWrapperService,
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
    if (this.twitterItem && !this.twitterItem.hasOwnProperty('type')) {
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
      image: data.thumbnail ? data.thumbnail : data.urlToMedia
    }
    this.metaService.setMetaTags(metaData);
    // this.dialog.open(TwdialogComponent, {
    //   panelClass: 'custom-twdialog-container',
    //   width: '500px',
    //   data: item,
    // });
    console.log('🚀 ~ file: twitter-slide.component.ts ~ line 63 ~ TwitterSlideComponent ~ openItem ~ data', data);
    // this.dialog.open(TwdialogComponent, {
    //   panelClass: 'custom-twdialog-container',
    //   width: '500px',
    //   data: this.item,
    // });
    this.socialService.selectPost(data.id.toString()).subscribe(result => {
    }, error => {
      console.log(error);
    });
    this.dataService.openTwItem = data.postId;
    const url = this.generateUrl(this.twitterItem);
    this.router.navigate([`/${url}`]);
  }

  notifyImageError(twitterItem) {
    console.log(twitterItem);
    this.twitterItem.withOutThumbnail = true;
  }

  mobileHover() {
    this.dataService.activePanHoverTileId.next(this.twitterItem.postId);
  }

  private generateShareUrl() {
    const url = this.generateUrl(this.twitterItem);
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
    return `news/posts/${sport}/${publishedAt}/twitter/${title}/${item.id}`;
  }

  private convertDate(publishedAt: Date): string {
    return moment(new Date(publishedAt)).format('YYYY-MM-DD');
  }

}
