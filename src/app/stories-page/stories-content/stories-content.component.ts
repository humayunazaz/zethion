import { Component, Input, OnChanges, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/shared/_service/data/data.service';
import { StoriesItem } from '../models/stories-item';

@Component({
  selector: 'app-stories-content',
  templateUrl: './stories-content.component.html',
  styleUrls: ['./stories-content.component.scss']
})
export class StoriesContentComponent implements OnInit, OnChanges, OnDestroy {


  // ContentProvider members
  languages: string[] = [];
  countries: string[] = [];
  sports: string[] = [];
  page = 0;
  pageSize: number;
  tags: string[] = [];
  query = '';

  @Input() hidden = false;
  @Input() storiesBoxes: StoriesItem[][] = [];
  newsSlides: StoriesItem[] = [];
  isLastPage: boolean;
  isLastPageSubscription: Subscription;
  totalColumn: number;
  totalItem: number;

  @ViewChild('template', { static: true }) template;

  constructor(
    private viewContainerRef: ViewContainerRef,
    private dataService: DataService
  ) {
    this.isLastPage = false;
  }

  ngOnInit(): void {
    console.log('stories ====', this.storiesBoxes)
    this.viewContainerRef.createEmbeddedView(this.template);
  }

  ngOnChanges(): void {
    this.getIsLastPage();
  }

  private getIsLastPage(): void {
    this.isLastPageSubscription = this.dataService.getIsLastPage()
      .subscribe((response: boolean) => {
        if (response) {
          this.isLastPage = response;
          this.totalColumn = this.storiesBoxes.length;
          console.log('🚀 ~ file: stories-content.component.ts ~ line 51 ~ StoriesContentComponent ~ .subscribe ~ this.totalColumn', this.totalColumn);
          this.totalItem = this.storiesBoxes.reduce((accumulator, current: any) => accumulator + current.items.length, 0);
        }
      });
  }

  ngOnDestroy() {
    if (this.isLastPageSubscription) {
      this.isLastPageSubscription.unsubscribe();
    }
  }


}
