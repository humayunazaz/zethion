import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Sport } from 'src/app/match/match.component';
import { Team } from 'src/app/model/teams.model';
import { ALL } from 'src/app/model/sports.model';
import { TeamService } from 'src/app/shared/_service/team/team.service';
import { AddEditTeamComponent } from './add-edit-team/add-edit-team.component';
import { listMediaStatus } from 'src/app/model/results.model';
import { ConfirmDialogComponent } from 'src/app/shared/dialogs/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.scss']
})
export class TeamsComponent implements OnInit {


  page: number = 0;
  size: number = 25;

  teams: Team[] = [];
  formFilter: FormGroup;

  name: Subject<string> = new Subject();
  teamName: string = '';

  sport: string = ALL.sport;
  selectedSport: Sport;

  country: string = ALL.sport;
  selectedCountry: any;

  status: string = 'ALL';

  loading: boolean = false;
  editId: number;
  statuses = listMediaStatus();

  constructor(
    protected dialog: MatDialog,
    private teamService: TeamService,
  ) { }

  ngOnInit(): void {
    this.name.pipe(debounceTime(300), distinctUntilChanged()).subscribe(value => {
      this.teamName = value.trim();
      this.getTeams();
    });
    this.getTeams();
    this.statuses.unshift({
      key: 'ALL',
      value: 'ALL',
    });
  }

  changeName(event) {
    console.log('🚀 ~ file: teams.component.ts ~ line 58 ~ TeamsComponent ~ changeName ~ event', event.target.value);
    this.name.next(event.target.value);
  }

  private getTeams(): void {
    this.loading = true;
    const sport = this.sport === ALL.sport ? null : this.sport;
    const country = this.country === ALL.sport ? null : this.country;
    const status = this.status === 'ALL' ? null : this.status;
    this.teamService.getFilterTeam(this.page, this.size, this.teamName, sport, country, status).
      subscribe((response: any) => {
        console.log('🚀 ~ file: tags.component.ts ~ line 52 ~ TagsComponent ~ subscribe ~ response', response);
        this.loading = false;
        this.teams = response.content;
      }, error => {
        this.loading = false;
      });
  }

  sportChanged(selected) {
    this.selectedSport = selected;
    if (this.selectedSport) {
      this.sport = this.selectedSport.sport;
      this.getTeams();
    }
  }

  countryChanged(selected) {
    if (selected) {
      this.country = selected;
      this.getTeams();
    }
  }

  statusChange(event) {
    if (event.value) {
      this.status = event.value;
      this.getTeams();
    }
  }

  loadNextData() {
    this.page += 1;
    this.getTeams();
  }

  loadPreviousData() {
    this.page -= 1;
    this.getTeams();
  }


  addTeam() {
    const ref = this.dialog.open(AddEditTeamComponent, {
      minWidth: '60%',
      maxHeight: '100%',
      minHeight: '90%',
      panelClass: 'admin-modal'
    })

    ref.afterClosed().subscribe(result => {
      if (result) {
        this.getTeams();
      }
    });
  }

  edit(item) {
    this.teamService.getTeam(item.id)
      .subscribe((response: any) => {
        console.log('🚀 ~ file: tournaments.component.ts ~ line 157 ~ TournamentsComponent ~ .subscribe ~ response', response);
        const ref = this.dialog.open(AddEditTeamComponent, {
          minWidth: '60%',
          maxHeight: '100%',
          minHeight: '90%',
          data: {
            team: response
          },
          panelClass: 'admin-modal'
        });
        ref.afterClosed().subscribe(result => {
          if (result) {
            this.getTeams()
          }
        });

      });
  }

  delete(team) {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      panelClass: 'custom-dialog-container',
      width: '300px',
      height: '300px',
      data: {
        message: "Are you sure you want to delete"
      },
    })

    ref.afterClosed().subscribe(result => {
      if (result) {
        this.teamService.deleteTeam(team.id).subscribe((res: any) => {
          this.getTeams();
        }, error => {
          console.log(error);
        });
      }
    });
  }

}
