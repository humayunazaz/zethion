import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CompetitionService } from '../../../../shared/_service/competition/competition.service';
import { Competition } from '../../../../model/competions.model';
import { CompetitionTypeSelect } from '../../../../model/competition-type.model';
import { ParticipationTypeSelection } from '../../../../model/participation-type.model';
import { CompetitionPrestigeSelect } from '../../../../model/competition-prestige.mode';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'add-competition-dialog',
  templateUrl: './add-competition.component.html',
  styleUrls: ['./add-competition.component.scss']
})
export class AddCompetitionComponent implements OnInit {

  loading: boolean = false;

  competition: Competition = {
    competitionName: '', competitionType: '', country: '', gender: '', level: '', partecipationType: '',
    prestige: '', sport: '', translations: { en: '', it: '', fr: '', de: '', es: '' }
  }

  genders: string[] = []
  competitionTypes: string[] = CompetitionTypeSelect;
  participationTypes: string[] = ParticipationTypeSelection;
  prestiges = CompetitionPrestigeSelect;
  addCompetitionForm: FormGroup;
  isEdit: boolean;
  competitionId: number;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private competitionService: CompetitionService,
    private matDialogRef: MatDialogRef<AddCompetitionComponent>,
    private formBuilder: FormBuilder
  ) {
    this.genders = this.data.genders;
    this.isEdit = false;
  }

  ngOnInit() {
    this.createForm();
    if (this.data && this.data.hasOwnProperty('competition') && this.data.competition) {
      this.isEdit = true;
      this.setCompetitionData();
    } else {
      this.addCompetitionCode();
    }
  }

  private createForm(): void {
    this.addCompetitionForm = this.formBuilder.group({
      competitionName: ['', Validators.required],
      competitionType: ['', Validators.required],
      country: ['', Validators.required],
      gender: ['', Validators.required],
      level: ['', Validators.compose([Validators.required, Validators.pattern('^[0-9]+$')])],
      partecipationType: ['', Validators.required],
      prestige: ['', Validators.required],
      sport: ['', Validators.required],
      translations: this.formBuilder.group({
        en: [''],
        it: [''],
        fr: [''],
        de: [''],
        es: [''],
      }),
      competitionCodes: this.formBuilder.array([])
    });
  }

  private setCompetitionData() {
    console.log('this.data.competition', this.data.competition);
    this.addCompetitionForm.patchValue({
      competitionName: this.data.competition.competitionName,
      competitionType: this.data.competition.competitionType,
      country: this.data.competition.country,
      gender: this.data.competition.gender,
      level: this.data.competition.level,
      partecipationType: this.data.competition.partecipationType,
      prestige: this.data.competition.prestige,
      sport: this.data.competition.sport,
      translations: this.formBuilder.group({
        en: this.data.competition.translations && this.data.competition.translations.hasOwnProperty('en') && this.data.competition.translations.en ? this.data.competition.translations.en : '',
        it: this.data.competition.translations && this.data.competition.translations.hasOwnProperty('it') && this.data.competition.translations.it ? this.data.competition.translations.it : '',
        fr: this.data.competition.translations && this.data.competition.translations.hasOwnProperty('fr') && this.data.competition.translations.fr ? this.data.competition.translations.fr : '',
        de: this.data.competition.translations && this.data.competition.translations.hasOwnProperty('de') && this.data.competition.translations.de ? this.data.competition.translations.de : '',
        es: this.data.competition.translations && this.data.competition.translations.hasOwnProperty('es') && this.data.competition.translations.es ? this.data.competition.translations.es : '',
      })
    });
    this.competitionId = this.data.competition.id;
    this.addCompetitionForm.controls.competitionName.disable();
    this.addCompetitionForm.controls.sport.disable();
    this.addCompetitionForm.controls.gender.disable();
    this.addCompetitionForm.controls.country.disable();
    this.addCompetitionForm.controls.level.disable();
    if (this.data.competition.competitionCodes.length) {
      const competitionCodes = this.addCompetitionForm.controls.competitionCodes as any;
      for(let index = 0; index < this.data.competition.competitionCodes.length; index +=1) {
        this.addCompetitionCode();
        competitionCodes.controls[index].patchValue({
          system: this.data.competition.competitionCodes[index].system,
          code: this.data.competition.competitionCodes[index].code
        });
      }
    } else {
      this.addCompetitionCode();
    }
  }

  private createCompetitionCode(): FormGroup {
    return this.formBuilder.group({
      system: [''],
      code: [''],
      codeType: ['COMPETITION'],
      enable: [true]
    });
  }

  addCompetitionCode(): void {
    const control = this.addCompetitionForm.controls.competitionCodes as any;
    control.push(this.createCompetitionCode());
  }

  removeCompetitionCode(index: number): void {
    const control = this.addCompetitionForm.controls.competitionCodes as any;
    control.removeAt(index);
  }

  getCompetitionCodeControl() {
    return (this.addCompetitionForm.get('competitionCodes') as any).controls;
  }

  sportChanged(event) {
    if (event) {
      // this.competition.sport = event.sport;
      this.addCompetitionForm.patchValue({
        sport: event.sport
      });
    }
  }

  genderChanged(event) {
    // this.competition.gender = event.value;
    this.addCompetitionForm.patchValue({
      gender: event.value
    });
  }

  countryChanged(selected) {
    if (selected) {
      // this.competition.country = selected;
      this.addCompetitionForm.patchValue({
        country: selected
      });
    }
  }

  changeCompetitionType(event) {
    // this.competition.competitionType = event.value
    this.addCompetitionForm.patchValue({
      competitionType: event.value
    });
  }

  changeParticipationType(event) {
    // this.competition.partecipationType = event.value
    this.addCompetitionForm.patchValue({
      partecipationType: event.value
    });
  }

  changePrestige(event) {
    // this.competition.prestige = event.value
    this.addCompetitionForm.patchValue({
      prestige: event.value
    });
  }

  changeSystem(index: number): void {
    const competitionCodes = this.addCompetitionForm.controls.competitionCodes as any;
    console.log('🚀 ~ file: add-competition.component.ts ~ line 139 ~ AddCompetitionComponent ~ changeSystem ~ competitionCodes.controsl[index].system', competitionCodes.controls[index]);
    if (competitionCodes.controls[index].value.system) {
      competitionCodes.controls[index].controls.code.setValidators(Validators.compose([Validators.required, Validators.pattern('^[0-9]+$')]));
      competitionCodes.controls[index].controls.code.updateValueAndValidity();
    } else {
      competitionCodes.controls[index].controls.code.clearValidators([Validators.required]);
      competitionCodes.controls[index].controls.code.updateValueAndValidity();
    }
  }

  changeCode(index: number): void {
    const competitionCodes = this.addCompetitionForm.controls.competitionCodes as any;
    console.log('🚀 ~ file: add-competition.component.ts ~ line 139 ~ AddCompetitionComponent ~ changeSystem ~ competitionCodes.controsl[index].system', competitionCodes.controls[index]);
    if (competitionCodes.controls[index].value.code) {
      competitionCodes.controls[index].controls.system.setValidators(Validators.required);
      competitionCodes.controls[index].controls.system.updateValueAndValidity();
    } else {
      competitionCodes.controls[index].controls.system.clearValidators([Validators.required]);
      competitionCodes.controls[index].controls.system.updateValueAndValidity();
    }
  }

  submit() {
    if (!this.addCompetitionForm.valid || !this.addCompetitionForm.controls.competitionCodes.valid) {
      Object.keys(this.addCompetitionForm.controls).forEach(field => {
        const control = this.addCompetitionForm.get(field);
        if (control instanceof FormControl) {
          control.markAsTouched({ onlySelf: true });
        }
      });
      const competitionCodesControl = this.addCompetitionForm.controls.competitionCodes as any;
      competitionCodesControl.controls.forEach((value, key) => {
        Object.keys(competitionCodesControl.controls[key].controls).forEach(field => {
          const control = competitionCodesControl.controls[key].get(field);
          if (control instanceof FormControl) {
            control.markAsTouched({ onlySelf: true });
          }
        });
      });
    } else {
      const competitionCodes = this.addCompetitionForm.getRawValue().competitionCodes.filter(value => value.system || value.code).map((value) => {
        return {
          ...value,
          system: value.system.toUpperCase().replace(' ', '_'),
        }
      })
      const data = {
        ...this.addCompetitionForm.getRawValue(),
        competitionName: this.addCompetitionForm.getRawValue().competitionName.toUpperCase().replace(' ', '_'),
        competitionCodes,
      };
      if (this.isEdit) {
        data.id = this.competitionId;
      }
      //Remove not available languages
      if (!data.translations.en) {
        delete data.translations.en;
      }
      if (!data.translations.it) {
        delete data.translations.it;
      }
      if (!data.translations.fr) {
        delete data.translations.fr;
      }
      if (!data.translations.de) {
        delete data.translations.de;
      }
      if (!data.translations.es) {
        delete data.translations.es;
      }
      if (!data.competitionCodes.length) {
        delete data.competitionCodes;
      }
      console.log('🚀 ~ file: add-competition.component.ts ~ line 121 ~ AddCompetitionComponent ~ submit ~ data', data);
      this.loading = true;
      this.competitionService.saveCompetition(data).subscribe(response => {
        this.loading = false;
        this.matDialogRef.close(true);
      }, error => {
        console.log(error)
        this.loading = false;
      });
    }
  }



}
