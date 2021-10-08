import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { listMediaStatus } from 'src/app/model/results.model';
import { TeamService } from 'src/app/shared/_service/team/team.service';

@Component({
  selector: 'app-add-edit-team',
  templateUrl: './add-edit-team.component.html',
  styleUrls: ['./add-edit-team.component.scss']
})
export class AddEditTeamComponent implements OnInit {

  addEditTeamForm: FormGroup;
  loading: boolean;
  isEdit: boolean;
  teamId: number;
  statuses = listMediaStatus();

  constructor(
    private matDialogRef: MatDialogRef<AddEditTeamComponent>,
    private formBuilder: FormBuilder,
    private teamService: TeamService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private translateService: TranslateService
  ) {
    this.loading = false;
  }

  ngOnInit(): void {
    this.createForm();
    if (this.data && this.data.hasOwnProperty('team') && this.data.team) {
      this.isEdit = true;
      this.setTeamData();
    } else {
      this.addTeamCode();
      this.addAthlete();
    }
  }

  private createForm(): void {
    this.addEditTeamForm = this.formBuilder.group({
      name: ['', Validators.required],
      shortName: ['', Validators.maxLength(3)],
      country: ['', Validators.required],
      city: [''],
      foundationYear: ['', Validators.pattern('^[0-9]+$')],
      sport: ['', Validators.required],
      teamCodes: this.formBuilder.array([]),
      athletes: this.formBuilder.array([]),
      status: ['ACTIVE']
    });
  }

  private setTeamData() {
    let city = '';
    if (this.data.team.city && this.data.team.city !== 'ND') {
      this.translateService.get('PLACE.' + this.data.team.city)
      .subscribe((response) => {
        console.log('🚀 ~ file: add-edit-team.component.ts ~ line 62 ~ AddEditTeamComponent ~ .subscribe ~ response', response);
        city = response;
      });
    }
    console.log('🚀 ~ file: add-edit-team.component.ts ~ line 59 ~ AddEditTeamComponent ~ setTeamData ~ city', city);
    this.addEditTeamForm.patchValue({
      name: this.data.team.name,
      shortName: this.data.team.shortName,
      country: this.data.team.country,
      city: this.data.team.city && this.data.team.city !== 'ND' ? {
        placeId: this.data.team.cty,
        description: city
      } : '',
      foundationYear: this.data.team.foundationYear,
      sport: this.data.team.sport,
      status: this.data.team.status
    });
    this.teamId = this.data.team.id;
    this.addEditTeamForm.controls.name.disable();
    this.addEditTeamForm.controls.country.disable();
    this.addEditTeamForm.controls.sport.disable();
    if (this.data.team.teamCodes.length) {
      const teamCodes = this.addEditTeamForm.controls.teamCodes as any;
      for (let index = 0; index < this.data.team.teamCodes.length; index += 1) {
        this.addTeamCode();
        teamCodes.controls[index].patchValue({
          system: this.data.team.teamCodes[index].system,
          code: this.data.team.teamCodes[index].code
        });
      }
    } else {
      this.addTeamCode();
    }
    if (this.data.team.contracts.length) {
      this.removeAll();
      const athletes = this.addEditTeamForm.controls.athletes as any;
      for (let index = 0; index < this.data.team.contracts.length; index += 1) {
        this.addAthlete();
        athletes.controls[index].patchValue({
          athlete: this.data.team.contracts[index].athlete,
          startDate: moment(new Date(this.data.team.contracts[index].startDate)),
          endDate: moment(new Date(this.data.team.contracts[index].endDate))
        });
      }
    } else {
      this.addAthlete();
    }
  }

  private createTeamCode(): FormGroup {
    return this.formBuilder.group({
      system: [''],
      code: [''],
      codeType: ['TEAM'],
      enable: [true]
    });
  }

  addTeamCode(): void {
    const control = this.addEditTeamForm.controls.teamCodes as any;
    control.push(this.createTeamCode());
  }

  removeTeamCode(index: number): void {
    const control = this.addEditTeamForm.controls.teamCodes as any;
    control.removeAt(index);
  }

  getTeamCodeControl() {
    return (this.addEditTeamForm.get('teamCodes') as any).controls;
  }

  private createAthleteGroup(): FormGroup {
    return this.formBuilder.group({
      athlete: [''],
      startDate: [''],
      endDate: ['']
    });
  }

  addAthlete(): void {
    const control = this.addEditTeamForm.controls.athletes as any;
    control.push(this.createAthleteGroup());
  }

  removeAthlete(index: number): void {
    const control = this.addEditTeamForm.controls.athletes as any;
    control.removeAt(index);
  }

  removeAll(): void {
    const control = this.addEditTeamForm.controls.athletes as any;
    while (control.length !== 0) {
      control.removeAt(0)
    }
  }

  getAthleteControl() {
    return (this.addEditTeamForm.get('athletes') as any).controls;
  }

  changeSystem(index: number): void {
    const teamCodes = this.addEditTeamForm.controls.teamCodes as any;
    if (teamCodes.controls[index].value.system) {
      teamCodes.controls[index].controls.code.setValidators(Validators.compose([Validators.required, Validators.pattern('^[0-9]+$')]));
      teamCodes.controls[index].controls.code.updateValueAndValidity();
    } else {
      teamCodes.controls[index].controls.code.clearValidators([Validators.required]);
      teamCodes.controls[index].controls.code.updateValueAndValidity();
    }
  }

  changeCode(index: number): void {
    const teamCodes = this.addEditTeamForm.controls.teamCodes as any;
    if (teamCodes.controls[index].value.code) {
      teamCodes.controls[index].controls.system.setValidators(Validators.required);
      teamCodes.controls[index].controls.system.updateValueAndValidity();
    } else {
      teamCodes.controls[index].controls.system.clearValidators([Validators.required]);
      teamCodes.controls[index].controls.system.updateValueAndValidity();
    }
  }

  submit(): void {
    if (!this.addEditTeamForm.valid || !this.addEditTeamForm.controls.teamCodes.valid || !this.addEditTeamForm.controls.athletes.valid) {
      Object.keys(this.addEditTeamForm.controls).forEach(field => {
        const control = this.addEditTeamForm.get(field);
        if (control instanceof FormControl) {
          control.markAsTouched({ onlySelf: true });
        }
      });
      const teamCodesControl = this.addEditTeamForm.controls.teamCodes as any;
      teamCodesControl.controls.forEach((value, key) => {
        Object.keys(teamCodesControl.controls[key].controls).forEach(field => {
          const control = teamCodesControl.controls[key].get(field);
          if (control instanceof FormControl) {
            control.markAsTouched({ onlySelf: true });
          }
        });
      });
      const athletesControl = this.addEditTeamForm.controls.athletes as any;
      athletesControl.controls.forEach((value, key) => {
        Object.keys(athletesControl.controls[key].controls).forEach(field => {
          const control = athletesControl.controls[key].get(field);
          if (control instanceof FormControl) {
            control.markAsTouched({ onlySelf: true });
          }
        });
      });
    } else {
      this.loading = true;
      let contracts;
      if (this.addEditTeamForm.value.athletes && this.addEditTeamForm.value.athletes.length) {
        const athletes = this.addEditTeamForm.value.athletes.map((ele) => {
          return {
            athlete: ele.athlete,
            startDate: ele.startDate,
            endDate: ele.endDate
          }
        }).filter((ele) => ele.athlete.id);
        contracts = athletes.filter((athlete, index) => athletes.findIndex(data => data.athlete.id === athlete.athlete.id) === index).map((data) => {
          return {
            status: 'PURCHASED',
            athlete: {
              id: data.athlete.id,
              type: data.athlete.type,
              athleteType: this.addEditTeamForm.getRawValue().sport + '_' + data.athlete.type
            },
            startDate: data.startDate ? moment(new Date(data.startDate)).format('YYYY-MM-DD') : null,
            endDate: data.endDate ? moment(new Date(data.endDate)).format('YYYY-MM-DD') : null,
          }
        });
      }
      const teamCodes = this.addEditTeamForm.getRawValue().teamCodes.filter(value => value.system || value.code).map((value) => {
        return {
          ...value,
          system: value.system.toUpperCase().replace(' ', '_'),
        }
      })
      const data: any = {
        name: this.addEditTeamForm.getRawValue().name.toUpperCase().replace(' ', '_'),
        shortName: this.addEditTeamForm.getRawValue().shortName || null,
        sport: this.addEditTeamForm.getRawValue().sport,
        status: this.addEditTeamForm.getRawValue().status,
        country: this.addEditTeamForm.getRawValue().country,
        city: this.addEditTeamForm.getRawValue().city ? this.addEditTeamForm.getRawValue().city.description : 'ND',
        foundationYear: this.addEditTeamForm.getRawValue().foundationYear || null,
        teamCodes,
        translations: {},
        contracts
      };
      if (this.isEdit) {
        data.id = this.teamId;
      }
      console.log('🚀 ~ file: add-edit-team.component.ts ~ line 156 ~ AddEditTeamComponent ~ submit ~ data', data);
      this.teamService.saveTeam(data)
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
