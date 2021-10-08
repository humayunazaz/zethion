import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild, OnChanges, ElementRef, SimpleChanges } from '@angular/core';

import { FBPostComponent, InitParams } from 'ngx-facebook';

import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DataService } from 'src/app/shared/_service/data/data.service';
import { SocialService } from 'src/app/shared/_service/social/social.service';
import { SingleYt } from '../../models/yt-post-model';
import { YoutubeItem } from '../youtube-item';
import { MetaData } from 'src/app/model/meta-data.model';
import { MetaService } from 'src/app/shared/_service/meta/meta.service';
import * as moment from 'moment';

@Component({
  selector: 'app-youtube-slide',
  templateUrl: './youtube-slide.component.html',
  styleUrls: ['./youtube-slide.component.scss']
})
export class YoutubeSlideComponent implements OnInit, OnChanges {

  @Input() item: SingleYt;
  @Input() index: number;
  @Input() hidden: boolean;
  @Output() opened = new EventEmitter<YoutubeItem>();
  @Output() error = new EventEmitter<boolean>();
  shareUrl: string;

  imageLoaded = false;

  constructor(
    private renderer: Renderer2,
    private element: ElementRef,
    private dialog: MatDialog,
    private router: Router,
    private dataService: DataService,
    private socialService: SocialService,
    private metaService: MetaService
  ) {
    // twServiceWrapper.init();
  }

  ngOnInit(): void {
    if (this.item && !this.item.hasOwnProperty('type')) {
      this.generateShareUrl();
    }
  }

  notifyImageError() {
    console.log(this.item);
    this.item.thumbnail = 'assets/img/placeholder.jpg';
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.hidden) {
      const hidden = changes.hidden.currentValue;
      if (this.element) {
        if (hidden) {
          this.renderer.addClass(this.element.nativeElement, 'd-none');
        } else {
          this.renderer.removeClass(this.element.nativeElement, 'd-none');
        }
      }
    }
  }

  onImageLoad() {
    this.imageLoaded = true;
  }

  openItem(data) {
    const metaData: MetaData = {
      title: data.socialPage.socialPageUsername,
      description: data.description,
      image: data.thumbnail
    }
    this.metaService.setMetaTags(metaData);
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
    this.dataService.openYtItem = data.postId;
    const url = this.generateUrl(this.item);
    this.router.navigate([`/${url}`]);
  }

  private generateShareUrl() {
    const url = this.generateUrl(this.item);
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
