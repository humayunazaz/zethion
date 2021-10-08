import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from "@angular/forms";
import { Subject } from "rxjs";
import { ALL } from "../../../model/sports.model";
import { Sport } from "../../../match/match.component";
import { MatDialog } from "@angular/material/dialog";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";
import { listYears, Edition } from "../../../model/results.model";
import { ConfirmDialogComponent } from 'src/app/shared/dialogs/confirm-dialog/confirm-dialog.component';
import { AddEditEditionComponent } from './add-edit-edition/add-edit-edition.component';
import { EditionService } from 'src/app/shared/_service/edition/edition.service';

@Component({
  selector: 'app-editions',
  templateUrl: './editions.component.html',
  styleUrls: ['./editions.component.scss']
})
export class EditionsComponent implements OnInit {


  page: number = 0;
  size: number = 25;

  data: Edition[] = [];
  formFilter: FormGroup;

  codeName: Subject<string> = new Subject();
  competitionName: string = '';

  sport: string = ALL.sport;
  selectedSport: Sport;

  years: any[] = listYears();
  year: any;
  selectedYear: any;

  loading: boolean = false;

  constructor(
    private editionService: EditionService,
    private formBuilder: FormBuilder,
    protected dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.codeName.pipe(debounceTime(300), distinctUntilChanged()).subscribe(value => {
      this.competitionName = value;
      this.getEdition();
    });
    this.formFilter = this.formBuilder.group({
      competitionName: [''],
      sport: [''],
      year: ['']
    }, {});
    this.getEdition();
  }

  getEdition() {
    this.loading = true;
    const sport = this.sport == ALL.sport ? null : this.sport;
    const year = this.year == ALL.sport ? null : this.year;
    this.editionService.getFilterEditions(this.page, this.size, this.competitionName, sport, year).
      subscribe((res: any) => {
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
      this.getEdition();
    }
  }

  yearChanged(selected) {
    this.selectedYear = selected;
    if (this.selectedYear) {
      this.year = this.selectedYear;
      this.getEdition();
    }
  }

  loadNextData() {
    this.page += 1;
    this.getEdition();
  }

  loadPreviousData() {
    this.page -= 1;
    this.getEdition();
  }


  addEdition() {
    const ref = this.dialog.open(AddEditEditionComponent, {
      minWidth: '60%',
      maxHeight: '100%',
      minHeight: '90%',
      data: {
      },
      panelClass: 'admin-modal'
    })

    ref.afterClosed().subscribe(result => {
      if (result) {
        this.getEdition()
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
        this.editionService.deleteEdition(item.id).subscribe((res: any) => {
          this.getEdition();
        }, error => {
          console.log(error);
        });
      }
    });
  }

  edit(item) {
    this.editionService.getEdition(item.id)
      .subscribe((response: any) => {
        console.log('🚀 ~ file: tournaments.component.ts ~ line 157 ~ TournamentsComponent ~ .subscribe ~ response', response);
        const ref = this.dialog.open(AddEditEditionComponent, {
          minWidth: '60%',
          maxHeight: '100%',
          minHeight: '90%',
          data: {
            edition: response
          },
          panelClass: 'admin-modal'
        })

        ref.afterClosed().subscribe(result => {
          if (result) {
            this.getEdition()
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

}
