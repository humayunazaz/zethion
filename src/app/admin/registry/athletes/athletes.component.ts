import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Sport } from 'src/app/match/match.component';
import { listAthleteTypes, listGenders, listMediaStatus } from 'src/app/model/results.model';
import { ALL, Athlete } from 'src/app/model/sports.model';
import { ConfirmDialogComponent } from 'src/app/shared/dialogs/confirm-dialog/confirm-dialog.component';
import { AthleteService } from 'src/app/shared/_service/athlete/athlete.service';
import { AddEditAthleteComponent } from './add-edit-athlete/add-edit-athlete.component';

@Component({
  selector: 'app-athletes',
  templateUrl: './athletes.component.html',
  styleUrls: ['./athletes.component.scss']
})
export class AthletesComponent implements OnInit {
  page: number = 0;
  size: number = 25;

  athletes: Athlete[] = [];

  name: Subject<string> = new Subject();
  athleteName: string = '';

  sport: string = ALL.sport;
  selectedSport: Sport;

  country: string = ALL.sport;
  selectedCountry: any;

  status: string = 'ALL';
  type: string = 'ALL';
  gender: string = 'ALL';

  loading: boolean = false;
  editId: number;
  statuses = listMediaStatus();
  athleteTypes = listAthleteTypes();
  genders = listGenders();

  constructor(
    protected dialog: MatDialog,
    private athleteService: AthleteService
  ) {
    this.loading = false;
  }

  ngOnInit(): void {
    this.name.pipe(debounceTime(300), distinctUntilChanged()).subscribe(value => {
      this.athleteName = value.trim();
      this.getAthletes();
    });
    this.getAthletes();
    this.statuses.unshift({
      key: 'ALL',
      value: 'ALL',
    });
  }

  sportChanged(selected) {
    this.selectedSport = selected;
    if (this.selectedSport) {
      this.sport = this.selectedSport.sport;
      this.getAthletes();
    }
  }

  countryChanged(selected) {
    if (selected) {
      this.country = selected;
      this.getAthletes();
    }
  }

  typeChange(event) {
    if (event.value) {
      this.type = event.value;
      this.getAthletes();
    }
  }

  genderChange(event) {
    if (event.value) {
      this.gender = event.value;
      this.getAthletes();
    }
  }

  statusChange(event) {
    if (event.value) {
      this.status = event.value;
      this.getAthletes();
    }
  }

  loadNextData() {
    this.page += 1;
    this.getAthletes();
  }

  loadPreviousData() {
    this.page -= 1;
    this.getAthletes();
  }

  changeName(event) {
    console.log('🚀 ~ file: teams.component.ts ~ line 58 ~ TeamsComponent ~ changeName ~ event', event.target.value);
    this.name.next(event.target.value);
  }


  private getAthletes() {
    this.loading = true;
    const sport = this.sport === ALL.sport ? null : this.sport;
    const country = this.country === ALL.sport ? null : this.country;
    const status = this.status === 'ALL' ? null : this.status;
    const type = this.type === 'ALL' ? null : this.type;
    const gender = this.gender === 'ALL' ? null : this.gender;
    this.athleteService.getFilterAthlete(this.page, this.size, this.athleteName, gender, sport, country, type, status).
      subscribe((response: any) => {
        console.log('🚀 ~ file: tags.component.ts ~ line 52 ~ TagsComponent ~ subscribe ~ response', response);
        this.loading = false;
        this.athletes = response.content.map((athlete) => {
          return {
            ...athlete,
            birthDate: athlete.birthDate ? moment(new Date(athlete.birthDate)).format('YYYY-MM-DD') : null
          }
        });
      }, error => {
        this.loading = false;
      });
  }

  addAthlete() {
    const ref = this.dialog.open(AddEditAthleteComponent, {
      minWidth: '60%',
      maxHeight: '100%',
      minHeight: '90%',
      panelClass: 'admin-modal'
    })

    ref.afterClosed().subscribe(result => {
      if (result) {
        this.getAthletes();
      }
    });
  }

  edit(item) {
    this.athleteService.getAthlete(item.id)
      .subscribe((response: any) => {
        console.log('🚀 ~ file: tournaments.component.ts ~ line 157 ~ TournamentsComponent ~ .subscribe ~ response', response);
        const ref = this.dialog.open(AddEditAthleteComponent, {
          minWidth: '60%',
          maxHeight: '100%',
          minHeight: '90%',
          data: {
            athlete: response
          },
          panelClass: 'admin-modal'
        });
        ref.afterClosed().subscribe(result => {
          if (result) {
            this.getAthletes()
          }
        });

      });
  }

  delete(athlete) {
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
        this.athleteService.deleteAthlete(athlete.id).subscribe((res: any) => {
          this.getAthletes()
        }, error => {
          console.log(error);
        });
      }
    });
  }

}
