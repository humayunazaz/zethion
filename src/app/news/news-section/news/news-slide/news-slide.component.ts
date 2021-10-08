import { Component, EventEmitter, Input, OnInit, Output, OnChanges, Renderer2, ElementRef, SimpleChanges, ViewChild } from '@angular/core';
import { NewsItem } from '../news-item';
import { MatDialog } from '@angular/material/dialog';
import { NewsdialogComponent } from '../newsdialog/newsdialog.component';
import { DataService } from '../../../../shared/_service/data/data.service';
import { Router } from '@angular/router';
import { NewsService } from "../../../../shared/_service/news/news.service";
import * as moment from 'moment';

@Component({
  selector: 'app-news-slide',
  templateUrl: './news-slide.component.html',
  styleUrls: ['./news-slide.component.scss']
})
export class NewsSlideComponent implements OnInit, OnChanges {

  @Input() item: NewsItem;
  @Input() index: number;
  @Input() hidden: boolean;
  @Output() opened = new EventEmitter<NewsItem>();
  @Output() error = new EventEmitter<boolean>();
  shareUrl: string;

  constructor(
    private renderer: Renderer2,
    private element: ElementRef,
    private dialog: MatDialog,
    private dataService: DataService,
    private router: Router,
    private newService: NewsService
  ) {
  }

  ngOnInit(): void {
    if (this.item && !this.item.hasOwnProperty('type')) {
      this.generateShareUrl();
    }
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

  openNews() {
    // this.dialog.open(NewsdialogComponent, {
    //   panelClass: 'custom-dialog-container',
    //   data: this.item,
    // });
    this.newService.selectNew(this.item.id.toString()).subscribe(result => {
    }, error => {
      console.log(error);
    });
    this.dataService.openNewsItem = this.item;
    const url = this.generateUrl(this.item);
    this.router.navigate([`/${url}`]);
  }

  notifyImageError() {
    this.error.emit(true);
  }

  private generateShareUrl() {
    const url = this.generateUrl(this.item);
    this.shareUrl = `${window.location.origin}/${url}`;
  }

  private generateUrl(item): string {
    console.log('🚀 ~ file: news-slide.component.ts ~ line 77 ~ NewsSlideComponent ~ generateUrl ~ item', item);
    const sport = item.sourceSport.toLowerCase();
    const publishedAt = this.convertDate(item.publishedAt);
    const title = item.title
      .replace(/[$&+,:;=\\?@#|/'<>.^*()%!-\"\.]/g, ' ').split(' ')
      .filter((ele: string) => ele)
      .map((ele: string) => ele.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase())
      .join('-');
    return `news/${sport}/${publishedAt}/${title}/${item.id}`;
  }

  private convertDate(publishedAt: Date): string {
    return moment(new Date(publishedAt)).format('YYYY-MM-DD');
  }

}
