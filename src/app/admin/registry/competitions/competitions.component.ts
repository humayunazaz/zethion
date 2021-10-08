import { Component, OnInit } from '@angular/core';
import { CompetitionService } from '../../../shared/_service/competition/competition.service';
import { Competition, CompetitionPerspectives } from '../../../model/competions.model';

import { CompetitionType, CompetitionTypeSelect } from '../../../model/competition-type.model';

import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { AddCompetitionComponent } from './add-competition/add-competition.component';
import { MatDialog } from "@angular/material/dialog";

import { ConfirmDialogComponent } from '../../../shared/dialogs/confirm-dialog/confirm-dialog.component';

import { debounceTime, distinctUntilChanged } from "rxjs/operators";
import { Subject } from "rxjs";
import { Sport } from 'src/app/match/match.component';
import { ALL } from 'src/app/model/sports.model';
import { StorageService } from 'src/app/shared/_service/storage/storage.service';
import { AddTournamentComponent } from '../tournaments/add-tournament/add-tournament.component';

declare const $: any;


@Component({
  selector: 'app-competitions',
  templateUrl: './competitions.component.html',
  styleUrls: ['./competitions.component.scss']
})
export class CompetitionsComponent implements OnInit {


  page: number = 0;
  size: number = 25;

  data: Competition[] = [];
  formFilter: FormGroup;

  codeName: Subject<string> = new Subject();
  competitionName: string = '';

  sport: string = ALL.sport;
  selectedSport: Sport;


  country: string = ALL.sport;
  selectedCountry: any;

  genders: string[] = ['M', 'F', 'U']
  selectedGenders: string[] = [];

  competitionTypes: string[] = CompetitionTypeSelect;
  selectedCompetitionTypes: string[] = []

  loading: boolean = false;
  private _scroll: number = 0;
  editId: number;

  constructor(
    private competitionService: CompetitionService,
    private formBuilder: FormBuilder,
    protected dialog: MatDialog,
    private storageService: StorageService
  ) { }

  ngOnInit(): void {
    this.codeName.pipe(debounceTime(300), distinctUntilChanged()).subscribe(value => {
      console.log("Name debounce =========", value)
      this.competitionName = value;
      this.__getCompetitions();
    });
    this.formFilter = this.formBuilder.group({
      competitionName: [''],
      sport: [''],
      country: [''],
      competitionType: ['']
    }, {});

    Object.assign(this.selectedCompetitionTypes, this.competitionTypes);
    Object.assign(this.selectedGenders, this.genders);
    this.__getCompetitions();
  }


  __getCompetitions() {
    this.loading = true;
    const sport = this.sport == ALL.sport ? null : this.sport;
    const country = this.country == ALL.sport ? null : this.country;
    console.log("Genders =========", this.selectedGenders)
    this.competitionService.getFilterCompetitions(this.page, this.size, this.competitionName, sport, country, this.selectedCompetitionTypes, this.selectedGenders).
      subscribe((res: CompetitionPerspectives) => {
        this.data = res.content;
        this.loading = false;
      }, error => {
        this.loading = false;
      });
  }

  changeName(event) {
    console.log("Name Changed =========", event)
    this.codeName.next(event);
  }

  sportChanged(selected) {
    this.selectedSport = selected;
    if (this.selectedSport) {
      this.sport = this.selectedSport.sport;
      this.__getCompetitions();
    }
  }

  countryChanged(selected) {
    this.selectedCountry = selected;
    if (this.selectedCountry) {
      this.country = this.selectedCountry;
      this.__getCompetitions();
    }
  }


  genderChanged(checked, gender) {
    if (checked == true) {
      this.selectedGenders.push(gender)
    } else {
      this.selectedGenders.splice(this.selectedGenders.indexOf(gender), 1)
    }
    this.__getCompetitions();
  }

  changeCompetitionType(event) {
    this.__getCompetitions();
  }

  loadNextData() {
    this.page += 1;
    this.__getCompetitions();
  }

  loadPreviousData() {
    this.page -= 1;
    this.__getCompetitions();
  }


  addCompetition() {
    const ref = this.dialog.open(AddCompetitionComponent, {
      minWidth: '60%',
      maxHeight: '100%',
      minHeight: '90%',
      data: {
        genders: this.genders
      },
      panelClass: 'admin-modal'
    })

    ref.afterClosed().subscribe(result => {
      if (result) {
        this.__getCompetitions()
      }
    });
  }

  valueChanged(value, item) {
    const lang = this.storageService.getLanguage()
    const competition: Competition = {
      ...item as Competition,
      translations: {}
    };
    competition.translations[lang] = value;
    console.log("Competition ===============  ", competition);
    this.competitionService.saveCompetition(competition).subscribe(response => {
      console.log(response)
      this.editId = 0;
    }, error => {
      console.log(error)
    })
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
        this.competitionService.deleteCompetition(item.id).subscribe((res: any) => {
          this.__getCompetitions()
        }, error => {
          console.log(error);
        });
      }
    });
  }

  addTournament(item) {
    const competition = item;
    const ref = this.dialog.open(AddTournamentComponent, {
      minWidth: '60%',
      maxHeight: '100%',
      minHeight: '90%',
      data: {
        competition
      },
      panelClass: 'admin-modal'
    })

    ref.afterClosed().subscribe(result => {
      if (result) {
        // this.__getTournaments()
      }
    });
  }

  edit(item) {
    const ref = this.dialog.open(AddCompetitionComponent, {
      minWidth: '60%',
      maxHeight: '100%',
      minHeight: '90%',
      data: {
        genders: this.genders,
        competition: item
      },
      panelClass: 'admin-modal'
    })

    ref.afterClosed().subscribe(result => {
      if (result) {
        this.__getCompetitions()
      }
    });
  }

  toggle(id): void {
    this.editId = id;
  }

}
