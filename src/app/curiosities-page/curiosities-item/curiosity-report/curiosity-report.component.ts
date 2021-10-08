import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { CuriositiesService } from 'src/app/shared/_service/curiosities/curiosities.service';
import { CuriositiesItem } from '../../models/curiosities-item';

@Component({
  selector: 'app-curiosity-report',
  templateUrl: './curiosity-report.component.html',
  styleUrls: ['./curiosity-report.component.scss']
})
export class CuriosityReportComponent implements OnInit {

  @Input() curiosity: CuriositiesItem;
  titleImage: string;

  constructor(
    private router: Router,
    private curiositiesService: CuriositiesService
  ) { }

  ngOnInit(): void {
  }

  async openCuriosity() {
    await this.curiositiesService.selectCuriosity(this.curiosity.id.toString()).toPromise();
    const url = this.generateUrl(this.curiosity);
    this.router.navigateByUrl(url);
  }

  private generateUrl(item: CuriositiesItem): string {
    const sport = item.sourceSport.toLowerCase();
    const publishedAt = this.convertDate(item.publishedAt);
    const title = item.title
      .split('_')
      .map((ele: string) => ele.toLowerCase())
      .join('-');
    return `curiosities/${sport}/${publishedAt}/${title}/${item.id}`;
  }

  private convertDate(publishedAt: Date): string {
    return moment(new Date(publishedAt)).format('YYYY-MM-DD');
  }

}
