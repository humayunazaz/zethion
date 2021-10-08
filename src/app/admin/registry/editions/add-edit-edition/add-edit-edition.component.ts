import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Sport } from "../../../../match/match.component";
import { listYears } from "../../../../model/results.model";
import moment from "moment";
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { EditionService } from 'src/app/shared/_service/edition/edition.service';

@Component({
  selector: 'app-add-edit-edition',
  templateUrl: './add-edit-edition.component.html',
  styleUrls: ['./add-edit-edition.component.scss']

})
export class AddEditEditionComponent implements OnInit {

  loading: boolean = false;

  public selectedManifestation: any;
  public selectedPlace: string;
  public selectedYear: number;

  public selectedSport: Sport;
  years: any[] = listYears().slice(1); //Removing All
  addEditionForm: FormGroup;


  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private matDialogRef: MatDialogRef<AddEditEditionComponent>,
    private formBuilder: FormBuilder,
    private editionService: EditionService
  ) {
    this.loading = false;
  }

  ngOnInit() {
    this.createForm();
    console.log('🚀 ~ file: add-tournament.component.ts ~ line 56 ~ AddTournamentComponent ~ ngOnInit ~ this.data ', this.data);
    if (this.data && this.data.hasOwnProperty('edition') && this.data.edition) {
      this.setTournamentData();
    }
  }

  private createForm(): void {
    this.addEditionForm = this.formBuilder.group({
      sport: ['', Validators.required],
      manifestation: [{ value: '', disabled: true }, Validators.required],
      place: [''],
      year: ['', Validators.required],
    });
  }

  sportChanged(selected) {
    this.selectedSport = { sport: selected };
    if (selected) {
      this.addEditionForm.controls.manifestation.enable();
    }
  }

  private setTournamentData() {
    this.selectedSport = { sport: this.data.edition.manifestation.sport };
    this.selectedManifestation = this.data.edition.manifestation;
    this.addEditionForm.patchValue({
      sport: this.data.edition.manifestation.sport,
      manifestation: this.data.edition.manifestation,
      place: this.data.edition && this.data.edition.place !== 'ND' ? this.data.edition.place : '',
      year: this.data.edition ? this.data.edition.year || '' : '',
    });
    console.log('🚀 ~ file: add-tournament.component.ts ~ line 150 ~ AddTournamentComponent ~ setTournamentData ~ this.addEditionForm', this.addEditionForm.value);
  }

  manifestationChanged(selected) {
    console.log('🚀 ~ file: add-tournament.component.ts ~ line 138 ~ AddTournamentComponent ~ competitionChanged ~ selected', selected);
    if (typeof selected !== 'number') {
      this.selectedManifestation = selected;
    }
  }

  yearChanged(selected) {
    this.selectedYear = selected;
  }

  placeSelected(selected) {
    this.selectedPlace = selected;
  }

  getErrorMessage(pickerInput: string): string {
    if (!pickerInput || pickerInput === '') {
      return 'FORM.DATE_SELECTION';
    }
    return this.isMyDateFormat(pickerInput);
  }

  isMyDateFormat(date: string): string {
    if (date.length !== 10) {
      return 'FORM.DATE_INVALID';
    } else {
      const da = date.split('-');
      if (da.length !== 3 || da[0].length !== 4 || da[1].length !== 2 || da[2].length !== 2) {
        return 'FORM.DATE_INVALID';
      } else if (moment(date).isValid()) {
        return 'FORM.DATE_INVALID_TODAY';
      } else if (!moment(date).isValid()) {
        return 'FORM.DATE_INVALID_ERROR';
      }
    }
    return 'FORM.DATE_INVALID';
  }

  addTournament(): void {
    if (!this.addEditionForm.valid) {
      Object.keys(this.addEditionForm.controls).forEach(field => {
        const control = this.addEditionForm.get(field);
        if (control instanceof FormControl) {
          control.markAsTouched({ onlySelf: true });
        }
      });
    } else {
      this.loading = true;
      const manifestation = { id: this.addEditionForm.value.manifestation.id };
      const data = {
        sport: this.addEditionForm.value.sport,
        manifestation,
        place: this.addEditionForm.value.place ? {
          ...this.addEditionForm.value.place,
          latitude: 0.0,
          longitude: 0.0
        } : {
          placeId: 'ND'
        },
        year: this.addEditionForm.value.year,
      };
      console.log('🚀 ~ file: add-tournament.component.ts ~ line 232 ~ AddTournamentComponent ~ addTournament ~ data', data);
      this.editionService.saveEdition(data)
        .subscribe((response) => {
          this.loading = false;
          console.log('🚀 ~ file: add-tournament.component.ts ~ line 228 ~ AddTournamentComponent ~ .subscribe ~ response', response);
          this.matDialogRef.close(true);
        }, (error) => {
          this.loading = false;
          console.log('🚀 ~ file: add-tournament.component.ts ~ line 231 ~ AddTournamentComponent ~ .subscribe ~ error', error);
        })
    }
  }



}
