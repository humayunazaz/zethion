import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild, ElementRef } from '@angular/core';

import { FBPostComponent } from 'ngx-facebook';

import { FacebookItem } from '../facebook-item';
import { FbServiceWrapperService } from '../fb-service-wrapper.service';
import { MatDialog } from '@angular/material/dialog';
import { FbdialogComponent } from '../fbdialog/fbdialog.component';
import { SingleFb } from '../../models/fb-post-model';
import { DataService } from '../../../../shared/_service/data/data.service';
import { Router } from '@angular/router';
import { SocialService } from "../../../../shared/_service/social/social.service";
import { MetaService } from 'src/app/shared/_service/meta/meta.service';
import { MetaData } from 'src/app/model/meta-data.model';
import * as moment from 'moment';

@Component({
  selector: 'app-facebook-tile',
  templateUrl: './facebook-tile.component.html',
  styleUrls: ['./facebook-tile.component.scss']
})
export class FacebookTileComponent implements OnInit {

  @Input() facebookItem: SingleFb;
  @Input() isOdd: boolean;
  @Input() language: string;
  @Input() hidden: boolean;
  @Output() opened = new EventEmitter<SingleFb>();
  @ViewChild(FBPostComponent) fbComponent;
  loadLazy = true;
  imageLoaded = false;
  activePanHoverId = null;
  shareUrl: string;

  constructor(
    private renderer: Renderer2,
    private element: ElementRef,
    fbServiceWrapper: FbServiceWrapperService,
    private dialog: MatDialog,
    private dataService: DataService,
    private router: Router,
    private socialService: SocialService,
    private metaService: MetaService
  ) {
    // fbServiceWrapper.init();
  }

  ngOnInit(): void {
    this.dataService.activePanHoverTileId.subscribe(id => {
      if (id && window.innerWidth <= 767) {
        this.activePanHoverId = id;
      } else {
        this.activePanHoverId = null;
      }
    });
    if (this.facebookItem && !this.facebookItem.hasOwnProperty('type')) {
      this.generateShareUrl();
    }
  }

  onImageLoad() {
    this.imageLoaded = true;
  }

  onPostClicked(item) {
    const metaData: MetaData = {
      title: item.socialPage.socialPageUsername,
      description: item.description,
      image: item.thumbnail
    }
    this.metaService.setMetaTags(metaData);
    let width;
    if (window.innerWidth <= 767) {
      width = window.innerWidth - 20;
    } else {
      width = 'auto';
    }
    const data = {
      id: item.id,
      socialPageName: item.socialPage.socialPageUsername
    };
    this.dataService.openFbItem = item.postId;
    this.socialService.selectPost(item.id.toString()).subscribe(result => {
    }, error => {
      console.log(error);
    });
    this.openItem(data);
  }

  openItem(data) {
    const url = this.generateUrl(this.facebookItem);
    console.log('🚀 ~ file: facebook-tile.component.ts ~ line 90 ~ FacebookTileComponent ~ openItem ~ url', url);
    this.router.navigate([`/${url}`]);
  }

  notifyImageError(facebookItem) {
    this.facebookItem.withOutThumbnail = true;
  }

  mobileHover() {
    this.dataService.activePanHoverTileId.next(this.facebookItem.postId);
  }

  private generateShareUrl() {
    const url = this.generateUrl(this.facebookItem);
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
    return `news/posts/${sport}/${publishedAt}/facebook/${title}/${item.id}`;
  }

  private convertDate(publishedAt: Date): string {
    return moment(new Date(publishedAt)).format('YYYY-MM-DD');
  }

}
