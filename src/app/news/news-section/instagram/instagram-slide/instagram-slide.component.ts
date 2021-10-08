import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild, OnChanges, ElementRef, SimpleChanges } from '@angular/core';

import { FBPostComponent, InitParams } from 'ngx-facebook';

import { InstagramItem } from '../instagram-item';
import { IgServiceWrapperService } from '../ig-service-wrapper.service';
import { MatDialog } from '@angular/material/dialog';
import { IgdialogComponent } from '../igdialog/igdialog.component';
import { SingleIg } from '../../models/ig-post-model';
import { SocialService } from 'src/app/shared/_service/social/social.service';
import { DataService } from 'src/app/shared/_service/data/data.service';
import { Router } from '@angular/router';
import { MetaData } from 'src/app/model/meta-data.model';
import { MetaService } from 'src/app/shared/_service/meta/meta.service';
import * as moment from 'moment';

@Component({
  selector: 'app-instagram-slide',
  templateUrl: './instagram-slide.component.html',
  styleUrls: ['../../facebook/facebook-slide/facebook-slide.component.scss']
})
export class InstagramSlideComponent implements OnInit, OnChanges {

  @Input() item: SingleIg;
  @Input() index: number;
  @Input() hidden: boolean;
  @Output() opened = new EventEmitter<InstagramItem>();
  @Output() error = new EventEmitter<boolean>();
  shareUrl: string;

  @ViewChild(FBPostComponent) private igComponent;
  imageLoaded = false;
  constructor(
    private renderer: Renderer2,
    private element: ElementRef,
    igServiceWrapper: IgServiceWrapperService,
    private dialog: MatDialog,
    private socialService: SocialService,
    private dataService: DataService,
    private router: Router,
    private metaService: MetaService
  ) {
    // igServiceWrapper.init();
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
      // image: data.urlToMedia
    }
    this.metaService.setMetaTags(metaData);
    // this.dialog.open(IgdialogComponent, {
    //   panelClass: 'custom-igdialog-container',
    //   data: this.item.postUrl,
    // });
    this.socialService.selectPost(data.id.toString()).subscribe(result => {
    }, error => {
      console.log(error);
    });
    this.dataService.openIgItem = data.postUrl;
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
    return `news/posts/${sport}/${publishedAt}/instagram/${title}/${item.id}`;
  }

  private convertDate(publishedAt: Date): string {
    return moment(new Date(publishedAt)).format('YYYY-MM-DD');
  }

}
