import { ChangeDetectionStrategy, Component, Input, OnInit, Inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { SportType } from 'src/app/model/sports.model';
import { GroupByPipe } from '../table-pipe.pipe';
import { AppConstants } from 'src/app/app-constants';
import { ImagesService } from 'src/app/shared/_service/images/images.service';
import { DetailsFootballComponent } from 'src/app/results/result-details/details-football/details-football.component';
import { DetailsBasketballComponent } from 'src/app/results/result-details/details-basketball/details-basketball.component';
import { TableDataResults } from 'src/app/model/table-results.model';
// tslint:disable-next-line: max-line-length
import { ClassificationsFootballComponent } from 'src/app/results/result-details/classifications/classifications-football/classifications-football.component';

@Component({
  selector: 'app-table-results',
  templateUrl: './table-results.component.html',
  styleUrls: ['./table-results.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [GroupByPipe]
})
export class TableResultsComponent implements OnInit {


  @Input() public data: TableDataResults[];
  @Input() public selectedSport: SportType;


  public searchString: string;
  private images;
  readonly ASSETS_URL_LOGO_TEAMS = AppConstants.ASSETS_URL_LOGO_TEAMS;
  public url_logo_teams: string;

  constructor(private imagesService: ImagesService,
    public dialog: MatDialog,
  ) {
   }


  ngOnInit() {
    this.url_logo_teams = `${this.ASSETS_URL_LOGO_TEAMS}/${this.selectedSport}`;
    this.images = this.imagesService.images;
    console.log('table-results.component.ts', this.data);
  }

  showDetail(item: TableDataResults) {
    if (item.isStatistics !== 0) {
      if (this.selectedSport === 'FOOTBALL') {
        const dialogRef = this.dialog.open(DetailsFootballComponent, {
          width: '750px',
          height: '85%',
          panelClass: 'custom-modalbox',
          data: {
            detail: item
          }
        });
        dialogRef.afterClosed().subscribe(result => {
        });
      } else if (this.selectedSport === 'BASKETBALL') {
        const dialogRef = this.dialog.open(DetailsBasketballComponent, {
          width: '100%',
          height: '85%',
          maxWidth:'100%',
          panelClass: 'custom-modalbox',
          data: {
            detail: item
          }
        });
        dialogRef.afterClosed().subscribe(result => {
        });
      }
    }
  }

  showClassifications(tournamentData: TableDataResults[]) {

    let dialogData: any;

    if (tournamentData && tournamentData.length) {
      dialogData = {
        tournamentId: tournamentData[0].tournamentId,
        tournamentName: tournamentData[0].tournamentName,
        nation: tournamentData[0].nation
      };
    }

    const dialogRef = this.dialog.open(ClassificationsFootballComponent, {
      width: '85%',
      maxWidth: '1048px',
      height: '85%',
      panelClass: 'custom-modalbox',
      data: {
        ...dialogData
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('Classifications component closed');
    });
  }


  teamLogoMissing(event) {
    event.target.src = AppConstants.MISSING_TEAM_LOGO_URL;
  }
}
