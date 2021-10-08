import { Component, EventEmitter, Input, OnInit, Output, OnChanges, Renderer2, ElementRef, SimpleChanges, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { DataService } from 'src/app/shared/_service/data/data.service';
import { CuriositiesService } from 'src/app/shared/_service/curiosities/curiosities.service';
import { CuriositiesItem } from '../models/curiosities-item';

@Component({
  selector: 'app-curiosities-slide',
  templateUrl: './curiosities-slide.component.html',
  styleUrls: ['./curiosities-slide.component.scss']
})
export class CuriositiesSlideComponent implements OnInit {

  @Input() item: CuriositiesItem;
  @Input() index: number;
  @Output() opened = new EventEmitter<CuriositiesItem>();
  @Output() error = new EventEmitter<boolean>();
  shareUrl: string;

  constructor(
    private renderer: Renderer2,
    private element: ElementRef,
    private dialog: MatDialog,
    private dataService: DataService,
    private router: Router,
    private curiositiesService: CuriositiesService
  ) {
  }

  ngOnInit(): void {
    if (this.item && !this.item.hasOwnProperty('type')) {
      this.generateShareUrl();
    }
  }

  private generateShareUrl() {
    const url = this.generateUrl(this.item);
    this.shareUrl = `${window.location.origin}/${url}`;
  }

  notifyImageError() {
    this.error.emit(true);
  }

  async openCuriosity() {
    await this.curiositiesService.selectCuriosity(this.item.id.toString()).toPromise();
    const url = this.generateUrl(this.item);
    this.router.navigateByUrl(url);
  }

  private generateUrl(item): string {
    const sport = item.sourceSport.toLowerCase();
    const publishedAt = this.convertDate(item.publishedAt);
    const title = item.title
      .replace(/[$&+,:;=\\?@#|/'<>.^*()%!-\"\.]/g, ' ').split(' ')
      .filter((ele: string) => ele)
      .map((ele: string) => ele.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase())
      .join('-');
    return `curiosities/${sport}/${publishedAt}/${title}/${item.id}`;
  }

  private convertDate(publishedAt: Date): string {
    return moment(new Date(publishedAt)).format('YYYY-MM-DD');
  }

}
