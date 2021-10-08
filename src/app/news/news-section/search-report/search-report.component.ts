import { Component, Input, OnInit } from '@angular/core';
import { DataService } from 'src/app/shared/_service/data/data.service';
import { StorageService } from 'src/app/shared/_service/storage/storage.service';

@Component({
  selector: 'app-search-report',
  templateUrl: './search-report.component.html',
  styleUrls: ['./search-report.component.scss']
})
export class SearchReportComponent implements OnInit {

  searchReport: any;
  isFilterApplied: boolean;
  @Input() type: string;
  @Input() isOdd: boolean;
  currentLanguage: string;

  constructor(
    private dataService: DataService,
    private storageService: StorageService
  ) {
    this.isFilterApplied = false;
  }

  ngOnInit(): void {
    console.log('🚀 ~ file: search-report.component.ts ~ line 22 ~ SearchReportComponent ~ isOdd', this.isOdd);
    this.getUserLanguages();
    if (this.dataService.socialType || (this.dataService.countries && this.dataService.countries.length) || (this.dataService.userLanguages && this.dataService.userLanguages.length) || (this.dataService.sports && this.dataService.sports.length)) {
      this.isFilterApplied = true;
      this.searchReport = {
        socialType: !this.dataService.socialType ? 'Stories' : this.dataService.socialType === 'zt' ? 'News' : Social[this.dataService.socialType],
        query: this.dataService.query,
        tags: this.dataService.tags.join(', '),
        countries: this.dataService.countries.join(', '),
        languages: this.dataService.userLanguages.join(', '),
        sports: this.dataService.sports.join(', ')
      };
    }
  }

  private getUserLanguages() {
    this.currentLanguage = this.storageService.getLanguage();
  }

}

export enum Social {
  fb = 'Facebook',
  ig = 'Instagram',
  tw = 'Twitter',
  yt = 'Youtube'
}
