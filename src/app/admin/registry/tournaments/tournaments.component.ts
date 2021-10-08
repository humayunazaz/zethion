import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from "@angular/forms";
import { Subject } from "rxjs";
import { ALL } from "../../../model/sports.model";
import { Sport } from "../../../match/match.component";
import { MatDialog } from "@angular/material/dialog";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";
import { listYears, Tournament } from "../../../model/results.model";
import { TournamentPerspectives } from "../../../model/tournaments.model";
import { TournamentsService } from "../../../shared/_service/tournaments/tournaments.service";
import { AddTournamentComponent } from "./add-tournament/add-tournament.component";
import { ConfirmDialogComponent } from 'src/app/shared/dialogs/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-tournaments',
  templateUrl: './tournaments.component.html',
  styleUrls: ['./tournaments.component.scss']
})
export class TournamentsComponent implements OnInit {


  page: number = 0;
  size: number = 25;

  data: Tournament[] = [];
  formFilter: FormGroup;

  codeName: Subject<string> = new Subject();
  competitionName: string = '';

  sport: string = ALL.sport;
  selectedSport: Sport;

  country: string = ALL.sport;
  selectedCountry: any;

  startingYears: any[] = listYears();
  startingYear: any;
  selectedStartingYear: any;

  loading: boolean = false;
  editId: number;

  constructor(
    private tournamentService: TournamentsService,
    private formBuilder: FormBuilder,
    protected dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.codeName.pipe(debounceTime(300), distinctUntilChanged()).subscribe(value => {
      this.competitionName = value;
      this.__getTournaments();
    });
    this.formFilter = this.formBuilder.group({
      competitionName: [''],
      sport: [''],
      country: [''],
      startingYear: ['']
    }, {});
    this.__getTournaments();
  }

  __getTournaments() {
    this.loading = true;
    const sport = this.sport == ALL.sport ? null : this.sport;
    const country = this.country == ALL.sport ? null : this.country;
    const startingYear = this.startingYear == ALL.sport ? null : this.startingYear;
    this.tournamentService.getFilterTournaments(this.page, this.size, this.competitionName, sport, country, startingYear).
      subscribe((res: TournamentPerspectives) => {
        this.data = res.content;
        console.log(res.content)
        this.loading = false;
      }, error => {
        this.loading = false;
      });
  }

  changeName(event) {
    this.codeName.next(event);
  }

  sportChanged(selected) {
    this.selectedSport = selected;
    if (this.selectedSport) {
      this.sport = this.selectedSport.sport;
      this.__getTournaments();
    }
  }

  countryChanged(selected) {
    this.selectedCountry = selected;
    if (this.selectedCountry) {
      this.country = this.selectedCountry;
      this.__getTournaments();
    }
  }

  yearChanged(selected) {
    this.selectedStartingYear = selected;
    if (this.selectedStartingYear) {
      this.startingYear = this.selectedStartingYear;
      this.__getTournaments();
    }
  }

  loadNextData() {
    this.page += 1;
    this.__getTournaments();
  }

  loadPreviousData() {
    this.page -= 1;
    this.__getTournaments();
  }


  addTournament() {
    const ref = this.dialog.open(AddTournamentComponent, {
      minWidth: '60%',
      maxHeight: '100%',
      minHeight: '90%',
      data: {
      },
      panelClass: 'admin-modal'
    })

    ref.afterClosed().subscribe(result => {
      if (result) {
        this.__getTournaments()
      }
    });
  }

  delete(item) {
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
        this.tournamentService.deleteTournament(item.id).subscribe((res: any) => {
          this.__getTournaments();
        }, error => {
          console.log(error);
        });
      }
    });
  }

  edit(item) {
    this.tournamentService.getTournament(item.id)
      .subscribe((response: any) => {
        console.log('🚀 ~ file: tournaments.component.ts ~ line 157 ~ TournamentsComponent ~ .subscribe ~ response', response);
        const ref = this.dialog.open(AddTournamentComponent, {
          minWidth: '60%',
          maxHeight: '100%',
          minHeight: '90%',
          data: {
            competition: response.competition,
            tournament: {
              tournamentTeams: response.tournamentTeams,
              startingYear: response.startingYear,
              place: response.place
            },
          },
          panelClass: 'admin-modal'
        })

        ref.afterClosed().subscribe(result => {
          if (result) {
            this.__getTournaments()
          }
        });

      })
  }

  /*valueChanged(value, item){
    const lang = this.storageService.getLanguage()
    const competition : Competition = {
      ... item as Competition,
      translations: {}
    };
    competition.translations[lang] = value;
    console.log("Competition ===============  ", competition);
    //this.tournamentService.saveCompetition(competition).subscribe(response => {
      console.log(response)
    }, error => {
      console.log(error)
    })
  }*/

  toggle(id): void {
    this.editId = id;
  }
}
