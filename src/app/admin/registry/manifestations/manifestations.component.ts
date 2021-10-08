import { Component, OnInit } from '@angular/core';
import { ManifestationService } from "../../../shared/_service/manifestation/manifestation.service";
import { Manifestation } from "../../../model/manifestations.model";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { AddManifestationComponent } from './add-manifestation/add-manifestation.component';
import { MatDialog } from "@angular/material/dialog";

import { StorageService } from '../../../shared/_service/storage/storage.service';

import { debounceTime, distinctUntilChanged } from "rxjs/operators";
import { Subject } from "rxjs";
import { Sport } from 'src/app/match/match.component';
import { ALL } from 'src/app/model/sports.model';


import { ConfirmDialogComponent } from '../../../shared/dialogs/confirm-dialog/confirm-dialog.component';
import { AddEditEditionComponent } from '../editions/add-edit-edition/add-edit-edition.component';

declare const $: any;


@Component({
  selector: 'app-manifestations',
  templateUrl: './manifestations.component.html',
  styleUrls: ['./manifestations.component.scss']
})
export class ManifestationsComponent implements OnInit {


  data: Manifestation[] = [];
  filteredData: Manifestation[] = [];
  formFilter: FormGroup;

  nameSubject: Subject<string> = new Subject();
  name: string = '';

  sport: string = ALL.sport;
  selectedSport: Sport;


  genders: string[] = ['M', 'F', 'U']
  selectedGenders: string[] = [];


  loading: boolean = false;
  private _scroll: number = 0;
  editId: number;

  constructor(
    private manifestationService: ManifestationService,
    private formBuilder: FormBuilder,
    protected dialog: MatDialog,
    private storageService: StorageService
  ) { }

  ngOnInit(): void {
    this.nameSubject.pipe(debounceTime(300), distinctUntilChanged()).subscribe(value => {
      this.name = value;
      this.__filterManifestation();
    });
    this.formFilter = this.formBuilder.group({
      name: [''],
      sport: [''],
      gender: ['']
    }, {});
    Object.assign(this.selectedGenders, this.genders);
    this.__getManifestations();
  }


  __getManifestations() {
    this.loading = true;
    this.manifestationService.getManifestations().subscribe((res: [Manifestation]) => {
      this.data = res;
      this.loading = false;
      this.__filterManifestation();
    },
      error => {
        this.loading = false;
      });
  }
  __filterManifestation() {
    this.filteredData = this.data.filter(f =>
      (this.name == '' || f.name.indexOf(this.name.toUpperCase()) != -1) &&
      (this.sport == ALL.sport || f.sport.indexOf(this.sport.toUpperCase()) != -1) &&
      (this.selectedGenders.length == 0 || this.selectedGenders.indexOf(f.gender) != -1)
    )
  }

  changeName(event) {
    //This will not allow a clear filter on the name field
    // if (event.toString().length>2) {
    //   this.nameSubject.next(event);
    // }
    this.nameSubject.next(event);
  }

  sportChanged(selected) {
    this.selectedSport = selected;
    if (this.selectedSport) {
      this.sport = this.selectedSport.sport;
    }
    this.__filterManifestation();
  }

  genderChanged(checked, gender) {
    if (checked == true) {
      this.selectedGenders.push(gender)
    } else {
      this.selectedGenders.splice(this.selectedGenders.indexOf(gender), 1)
    }
    // this.selectedGenders = event.value;
    this.__filterManifestation();
  }


  addManifestation() {
    const ref = this.dialog.open(AddManifestationComponent, {
      minWidth: '60%',
      maxHeight: '100%',
      minHeight: '80%',
      data: {
        genders: this.genders
      },
      panelClass: 'admin-modal'
    })

    ref.afterClosed().subscribe(result => {
      if (result) {
        this.__getManifestations()
      }
    });
  }

  addEdition(item) {
    console.log('🚀 ~ file: manifestations.component.ts ~ line 135 ~ ManifestationsComponent ~ addEdition ~ item', item);
    const ref = this.dialog.open(AddEditEditionComponent, {
      minWidth: '60%',
      maxHeight: '100%',
      minHeight: '90%',
      data: {
        edition: {
          manifestation: item
        }
      },
      panelClass: 'admin-modal'
    })

    ref.afterClosed().subscribe(result => {
      if (result) {
        this.__getManifestations()
      }
    });
  }

  valueChanged(value, item) {
    const lang = this.storageService.getLanguage()
    const manifestation: Manifestation = {
      name: value.toUpperCase(),
      gender: item.gender,
      sport: item.sport,
      translations: {}
    };
    manifestation.translations[lang] = value;
    console.log("Manifestation ===============  ", manifestation);
    this.manifestationService.saveManifestation(manifestation).subscribe(response => {
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
        this.manifestationService.deleteManifestation(item.id).subscribe((res: any) => {
          this.__getManifestations()
        }, error => {
          console.log(error);
        });
      }
    });
  }

  edit(item) {
    const ref = this.dialog.open(AddManifestationComponent, {
      minWidth: '60%',
      maxHeight: '100%',
      minHeight: '90%',
      data: {
        genders: this.genders,
        manifestation: item
      },
      panelClass: 'admin-modal'
    })

    ref.afterClosed().subscribe(result => {
      if (result) {
        this.__getManifestations()
      }
    });
  }

  toggle(id): void {
    this.editId = id;
  }
}
