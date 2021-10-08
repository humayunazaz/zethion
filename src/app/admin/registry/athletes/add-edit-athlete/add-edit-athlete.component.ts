import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { listAthleteTypes, listGenders, listLateralities, listMediaStatus } from 'src/app/model/results.model';
import { AthleteService } from 'src/app/shared/_service/athlete/athlete.service';

@Component({
  selector: 'app-add-edit-athlete',
  templateUrl: './add-edit-athlete.component.html',
  styleUrls: ['./add-edit-athlete.component.scss']
})
export class AddEditAthleteComponent implements OnInit {

  addEditAthleteForm: FormGroup;
  loading: boolean;
  isEdit: boolean;
  athleteId: number;
  statuses = listMediaStatus();
  athleteTypes = listAthleteTypes().slice(1);
  lateralities = listLateralities();
  genders = listGenders().slice(1);

  constructor(
    private matDialogRef: MatDialogRef<AddEditAthleteComponent>,
    private formBuilder: FormBuilder,
    private athleteService: AthleteService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private translateService: TranslateService
  ) {
    this.loading = false;
  }

  ngOnInit(): void {
    this.createForm();
    if (this.data && this.data.hasOwnProperty('athlete') && this.data.athlete) {
      this.isEdit = true;
      this.setAthleteData();
    } else {
      this.addAthleteCode();
      this.addTeam();
    }
  }

  private createForm(): void {
    this.addEditAthleteForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      country: ['', Validators.required],
      secondaryCountry: [''],
      gender: ['', Validators.required],
      birthDate: [''],
      birthPlace: [''],
      height: [''],
      type: ['', Validators.required],
      laterality: [''],
      sport: ['', Validators.required],
      athleteCodes: this.formBuilder.array([]),
      teams: this.formBuilder.array([]),
      status: ['ACTIVE']
    });
  }

  private setAthleteData() {
    let birthPlace = '';
    if (this.data.athlete.birthPlace && this.data.athlete.birthPlace !== 'ND') {
      this.translateService.get('PLACE.' + this.data.athlete.birthPlace)
      .subscribe((response) => {
        birthPlace = response;
      });
    }
    this.addEditAthleteForm.patchValue({
      firstName: this.data.athlete.firstName,
      lastName: this.data.athlete.lastName,
      country: this.data.athlete.country,
      secondaryCountry: this.data.athlete.secondaryCountry || '',
      gender: this.data.athlete.gender,
      birthDate: this.data.athlete.birthDate ? moment(new Date(this.data.athlete.birthDate)) : '',
      birthPlace: this.data.athlete.birthPlace && this.data.athlete.birthPlace !== 'ND' ? {
        placeId: this.data.athlete.birthPlace,
        description: birthPlace
      } : '',
      height: this.data.athlete.height || '',
      type: this.data.athlete.type,
      laterality: this.data.athlete.laterality || '',
      sport: this.data.athlete.sport,
      status: this.data.athlete.status
    });
    this.athleteId = this.data.athlete.id;
    this.addEditAthleteForm.controls.sport.disable();
    if (this.data.athlete.athleteCodes.length) {
      const athleteCodes = this.addEditAthleteForm.controls.athleteCodes as any;
      for (let index = 0; index < this.data.athlete.athleteCodes.length; index += 1) {
        this.addAthleteCode();
        athleteCodes.controls[index].patchValue({
          system: this.data.athlete.athleteCodes[index].system,
          code: this.data.athlete.athleteCodes[index].code
        });
      }
    } else {
      this.addAthleteCode();
    }
    if (this.data.athlete.contracts.length) {
      this.removeAll();
      const teams = this.addEditAthleteForm.controls.teams as any;
      for (let index = 0; index < this.data.athlete.contracts.length; index += 1) {
        this.addTeam();
        teams.controls[index].patchValue({
          team: this.data.athlete.contracts[index].team,
          startDate: moment(new Date(this.data.athlete.contracts[index].startDate)),
          endDate: moment(new Date(this.data.athlete.contracts[index].endDate))
        });
      }
    } else {
      this.addTeam();
    }
  }

  private createAthleteCode(): FormGroup {
    return this.formBuilder.group({
      system: [''],
      code: [''],
      codeType: ['ATHLETE'],
      enable: [true]
    });
  }

  addAthleteCode(): void {
    const control = this.addEditAthleteForm.controls.athleteCodes as any;
    control.push(this.createAthleteCode());
  }

  removeAthleteCode(index: number): void {
    const control = this.addEditAthleteForm.controls.athleteCodes as any;
    control.removeAt(index);
  }

  getAthleteCodeControl() {
    return (this.addEditAthleteForm.get('athleteCodes') as any).controls;
  }

  private createAthleteGroup(): FormGroup {
    return this.formBuilder.group({
      team: [''],
      startDate: [''],
      endDate: ['']
    });
  }

  addTeam(): void {
    const control = this.addEditAthleteForm.controls.teams as any;
    control.push(this.createAthleteGroup());
  }

  removeTeam(index: number): void {
    const control = this.addEditAthleteForm.controls.teams as any;
    control.removeAt(index);
  }

  removeAll(): void {
    const control = this.addEditAthleteForm.controls.teams as any;
    while (control.length !== 0) {
      control.removeAt(0)
    }
  }

  getTeamControl() {
    return (this.addEditAthleteForm.get('teams') as any).controls;
  }

  changeSystem(index: number): void {
    const athleteCodes = this.addEditAthleteForm.controls.athleteCodes as any;
    if (athleteCodes.controls[index].value.system) {
      athleteCodes.controls[index].controls.code.setValidators(Validators.compose([Validators.required, Validators.pattern('^[0-9]+$')]));
      athleteCodes.controls[index].controls.code.updateValueAndValidity();
    } else {
      athleteCodes.controls[index].controls.code.clearValidators([Validators.required]);
      athleteCodes.controls[index].controls.code.updateValueAndValidity();
    }
  }

  changeCode(index: number): void {
    const athleteCodes = this.addEditAthleteForm.controls.athleteCodes as any;
    if (athleteCodes.controls[index].value.code) {
      athleteCodes.controls[index].controls.system.setValidators(Validators.required);
      athleteCodes.controls[index].controls.system.updateValueAndValidity();
    } else {
      athleteCodes.controls[index].controls.system.clearValidators([Validators.required]);
      athleteCodes.controls[index].controls.system.updateValueAndValidity();
    }
  }

  submit(): void {
    console.log('🚀 ~ file: add-edit-athlete.component.ts ~ line 194 ~ AddEditAthleteComponent ~ submit ~ this.addEditAthleteForm', this.addEditAthleteForm);
    if (!this.addEditAthleteForm.valid || !this.addEditAthleteForm.controls.athleteCodes.valid || !this.addEditAthleteForm.controls.teams.valid) {
      Object.keys(this.addEditAthleteForm.controls).forEach(field => {
        const control = this.addEditAthleteForm.get(field);
        if (control instanceof FormControl) {
          control.markAsTouched({ onlySelf: true });
        }
      });
      const athleteCodesControl = this.addEditAthleteForm.controls.athleteCodes as any;
      athleteCodesControl.controls.forEach((value, key) => {
        Object.keys(athleteCodesControl.controls[key].controls).forEach(field => {
          const control = athleteCodesControl.controls[key].get(field);
          if (control instanceof FormControl) {
            control.markAsTouched({ onlySelf: true });
          }
        });
      });
      const teamsControl = this.addEditAthleteForm.controls.teams as any;
      teamsControl.controls.forEach((value, key) => {
        Object.keys(teamsControl.controls[key].controls).forEach(field => {
          const control = teamsControl.controls[key].get(field);
          if (control instanceof FormControl) {
            control.markAsTouched({ onlySelf: true });
          }
        });
      });
    } else {
      this.loading = true;
      let contracts;
      console.log('🚀 ~ file: add-edit-athlete.component.ts ~ line 224 ~ AddEditAthleteComponent ~ submit ~ this.addEditAthleteForm.value.teams.length', this.addEditAthleteForm.value.teams.length);
      if (this.addEditAthleteForm.value.teams && this.addEditAthleteForm.value.teams.length) {
        const teams = this.addEditAthleteForm.value.teams.map((ele) => {
          return {
            team: ele.team,
            startDate: ele.startDate,
            endDate: ele.endDate
          }
        }).filter((ele) => ele.team.id);
        contracts = teams.filter((team, index) => teams.findIndex(data => data.team.id === team.team.id) === index).map((data) => {
          return {
            status: 'PURCHASED',
            team: {
              id: data.team.id,
            },
            startDate: data.startDate ? moment(new Date(data.startDate)).format('YYYY-MM-DD') : null,
            endDate: data.endDate ? moment(new Date(data.endDate)).format('YYYY-MM-DD') : null,
          }
        });
      }
      const athleteCodes = this.addEditAthleteForm.getRawValue().athleteCodes.filter(value => value.system || value.code).map((value) => {
        return {
          ...value,
          system: value.system.toUpperCase().replace(' ', '_'),
        }
      })
      const data: any = {
        firstName: this.addEditAthleteForm.getRawValue().firstName,
        lastName: this.addEditAthleteForm.getRawValue().lastName,
        country: this.addEditAthleteForm.getRawValue().country,
        secondaryCountry: this.addEditAthleteForm.getRawValue().secondaryCountry || null,
        gender: this.addEditAthleteForm.getRawValue().gender,
        birthDate: this.addEditAthleteForm.getRawValue().birthDate ? moment(new Date(this.addEditAthleteForm.getRawValue().birthDate)).format('YYYY-MM-DD') : null,
        birthPlace: this.addEditAthleteForm.getRawValue().birthPlace ? this.addEditAthleteForm.getRawValue().birthPlace.description : 'ND',
        height: this.addEditAthleteForm.getRawValue().height || null,
        type: this.addEditAthleteForm.getRawValue().type,
        athleteType: this.addEditAthleteForm.getRawValue().sport + '_' + this.addEditAthleteForm.getRawValue().type,
        laterality: this.addEditAthleteForm.getRawValue().laterality || null,
        sport: this.addEditAthleteForm.getRawValue().sport,
        status: this.addEditAthleteForm.getRawValue().status,
        athleteCodes,
        translations: {},
        contracts
      };
      if (this.isEdit) {
        data.id = this.athleteId;
      }
      console.log('🚀 ~ file: add-edit-team.component.ts ~ line 156 ~ AddEditTeamComponent ~ submit ~ data', data);
      this.athleteService.saveAthlete(data)
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
