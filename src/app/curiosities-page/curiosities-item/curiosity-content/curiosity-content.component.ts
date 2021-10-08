import { Component, Input, OnInit } from '@angular/core';
import { MetaData } from 'src/app/model/meta-data.model';
import { MetaService } from 'src/app/shared/_service/meta/meta.service';
import { CuriositiesItem } from '../../models/curiosities-item';
import { SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-curiosity-content',
  templateUrl: './curiosity-content.component.html',
  styleUrls: ['./curiosity-content.component.scss']
})
export class CuriosityContentComponent implements OnInit {

  @Input() curiosity: CuriositiesItem;
  @Input() randomAds: SafeHtml[] = [];
  constructor(
    private metaService: MetaService
  ) { }

  ngOnInit(): void {
    this.setMetaTags();
    console.log('🚀 ~ file: curiosity-content.component.ts ~ line 16 ~ CuriosityContentComponent ~ curiosity', this.curiosity);
  }

  private setMetaTags(): void {
    if (this.curiosity) {
      const meta: MetaData = {
        title: this.curiosity.title,
        description: this.curiosity.description,
        image: this.curiosity.urlToMedia
      }
      this.metaService.setMetaTags(meta);
    }
  }

}

