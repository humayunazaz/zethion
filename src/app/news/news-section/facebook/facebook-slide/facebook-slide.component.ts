import {
  AfterViewInit, Component, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild, OnChanges, ElementRef, SimpleChanges
} from '@angular/core';

import { FacebookService, FBPostComponent, InitParams } from 'ngx-facebook';

import { FacebookItem } from '../facebook-item';
import { FbServiceWrapperService } from '../fb-service-wrapper.service';
import { MatDialog } from '@angular/material/dialog';
import { FbdialogComponent } from '../fbdialog/fbdialog.component';
import { SingleFb } from '../../models/fb-post-model';
import { Router } from '@angular/router';
import { DataService } from '../../../../shared/_service/data/data.service';
import { SocialService } from "../../../../shared/_service/social/social.service";
import { MetaData } from 'src/app/model/meta-data.model';
import { MetaService } from 'src/app/shared/_service/meta/meta.service';
import * as moment from 'moment';

@Component({
  selector: 'app-facebook-slide',
  templateUrl: './facebook-slide.component.html',
  styleUrls: ['./facebook-slide.component.scss']
})
export class FacebookSlideComponent implements OnInit, OnChanges {

  @Input() item: SingleFb;
  @Input() index: number;
  @Input() hidden: boolean;
  @Output() opened = new EventEmitter<SingleFb>();
  @Output() error = new EventEmitter<boolean>();
  shareUrl: string;

  @ViewChild(FBPostComponent) private fbComponent;
  imageLoaded = false;
  constructor(
    private renderer: Renderer2,
    private element: ElementRef,
    fbServiceWrapper: FbServiceWrapperService,
    private dialog: MatDialog,
    private router: Router,
    private dataService: DataService,
    private socialService: SocialService,
    private metaService: MetaService
  ) {
    // fbServiceWrapper.init();
  }

  ngOnInit(): void {
    if (this.item && !this.item.hasOwnProperty('type')) {
      this.generateShareUrl();
    }
  }

  notifyImageError() {
    console.log(this.item);
    this.item.thumbnail = '';
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
    console.log(item);
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
    return `news/posts/${sport}/${publishedAt}/facebook/${title}/${item.id}`;
  }

  private convertDate(publishedAt: Date): string {
    return moment(new Date(publishedAt)).format('YYYY-MM-DD');
  }

}
