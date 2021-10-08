import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild, ElementRef } from '@angular/core';

import { FBPostComponent } from 'ngx-facebook';

import { InstagramItem } from '../instagram-item';
import { IgServiceWrapperService } from '../ig-service-wrapper.service';
import { MatDialog } from '@angular/material/dialog';
import { IgdialogComponent } from '../igdialog/igdialog.component';
import { SingleIg } from '../../models/ig-post-model';
import { DataService } from 'src/app/shared/_service/data/data.service';
import { SocialService } from 'src/app/shared/_service/social/social.service';
import { Router } from '@angular/router';
import { MetaData } from 'src/app/model/meta-data.model';
import { MetaService } from 'src/app/shared/_service/meta/meta.service';
import * as moment from 'moment';

@Component({
  selector: 'app-instagram-tile',
  templateUrl: './instagram-tile.component.html',
  styleUrls: ['./instagram-tile.component.scss']
})
export class InstagramTileComponent implements OnInit {

  @Input() instagramItem: SingleIg;
  @Input() isOdd: boolean;
  @Input() language: string;
  @Input() hidden: boolean;
  @Output() opened = new EventEmitter<InstagramItem>();
  @ViewChild(FBPostComponent) igComponent;
  loadLazy = true;
  imageLoaded = false;
  activePanHoverId = null;
  shareUrl: string;

  constructor(
    private renderer: Renderer2,
    private element: ElementRef,
    igServiceWrapper: IgServiceWrapperService,
    private dialog: MatDialog,
    private dataService: DataService,
    private socialService: SocialService,
    private router: Router,
    private metaService: MetaService
  ) {
    // igServiceWrapper.init();
  }

  ngOnInit(): void {
    this.dataService.activePanHoverTileId.subscribe(id => {
      if (id && window.innerWidth <= 767) {
        this.activePanHoverId = id;
      } else {
        this.activePanHoverId = null;
      }
    });
    if (this.instagramItem && !this.instagramItem.hasOwnProperty('type')) {
      this.generateShareUrl();
    }
  }

  onImageLoad() {
    this.imageLoaded = true;
  }

  openItem(data) {
    const metaData: MetaData = {
      title: data.socialPage.socialPageUsername,
      description: data.description,
      // image: data.urlToMedia
    }
    this.metaService.setMetaTags(metaData);
    console.log('🚀 ~ file: instagram-tile.component.ts ~ line 62 ~ InstagramTileComponent ~ openItem ~ data', data);
    // this.dialog.open(IgdialogComponent, {
    //   panelClass: 'custom-igdialog-container',
    //   data: item,
    // });
    this.socialService.selectPost(data.id.toString()).subscribe(result => {
    }, error => {
      console.log(error);
    });
    this.dataService.openIgItem = data.postUrl;
    const url = this.generateUrl(this.instagramItem);
    this.router.navigate([`/${url}`]);
  }


  notifyImageError(instagramItem) {
    console.log(instagramItem);
    this.instagramItem.withOutThumbnail = true;
  }

  mobileHover() {
    this.dataService.activePanHoverTileId.next(this.instagramItem.postId);
  }

  private generateShareUrl() {
    const url = this.generateUrl(this.instagramItem);
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
    return `news/posts/${sport}/${publishedAt}/instagram/${title}/${item.id}`;
  }

  private convertDate(publishedAt: Date): string {
    return moment(new Date(publishedAt)).format('YYYY-MM-DD');
  }

}
