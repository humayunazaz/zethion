import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild, OnChanges, ElementRef, SimpleChanges } from '@angular/core';

import { FBPostComponent, InitParams } from 'ngx-facebook';

import { TwitterItem } from '../twitter-item';
import { TwServiceWrapperService } from '../tw-service-wrapper.service';
import { MatDialog } from '@angular/material/dialog';
import { TwdialogComponent } from '../twdialog/twdialog.component';
import { SingleTw } from '../../models/tw-post-model';
import { Router } from '@angular/router';
import { DataService } from 'src/app/shared/_service/data/data.service';
import { SocialService } from 'src/app/shared/_service/social/social.service';
import { MetaData } from 'src/app/model/meta-data.model';
import { MetaService } from 'src/app/shared/_service/meta/meta.service';
import * as moment from 'moment';

@Component({
  selector: 'app-twitter-slide',
  templateUrl: './twitter-slide.component.html',
  styleUrls: ['../../facebook/facebook-slide/facebook-slide.component.scss']
})
export class TwitterSlideComponent implements OnInit, OnChanges {

  @Input() item: SingleTw;
  @Input() index: number;
  @Input() hidden: boolean;
  @Output() opened = new EventEmitter<TwitterItem>();
  @Output() error = new EventEmitter<boolean>();
  shareUrl: string;

  @ViewChild(FBPostComponent) private twComponent;
  imageLoaded = false;
  constructor(
    private renderer: Renderer2,
    private element: ElementRef,
    twServiceWrapper: TwServiceWrapperService,
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
    console.log('🚀 ~ file: twitter-slide.component.ts ~ line 63 ~ TwitterSlideComponent ~ openItem ~ data', data);
    const metaData: MetaData = {
      title: data.socialPage.socialPageUsername,
      description: data.description,
      image: data.thumbnail ? data.thumbnail : data.urlToMedia
    }
    this.metaService.setMetaTags(metaData);
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
    return `news/posts/${sport}/${publishedAt}/twitter/${title}/${item.id}`;
  }

  private convertDate(publishedAt: Date): string {
    return moment(new Date(publishedAt)).format('YYYY-MM-DD');
  }

}
