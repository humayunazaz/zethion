import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ManifestationService } from '../../../../shared/_service/manifestation/manifestation.service';
import { Manifestation } from '../../../../model/manifestations.model'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'add-manifestation-dialog',
  templateUrl: './add-manifestation.component.html',
  styleUrls: ['./add-manifestation.component.scss']
})
export class AddManifestationComponent implements OnInit {

  loading: boolean = false;

  manifestation: Manifestation = {
    gender: '', name: '', sport: '', translations: {
      en: '', it: '', fr: '', de: '', es: ''
    }
  }

  genders: string[] = []
  addManifestationForm: FormGroup;
  isEdit: boolean;
  manifestationId: number;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private manifestationService: ManifestationService,
    private matDialogRef: MatDialogRef<AddManifestationComponent>,
    private formBuilder: FormBuilder
  ) {
    this.genders = data.genders;
  }

  ngOnInit() {
    this.createForm();
    if (this.data && this.data.hasOwnProperty('manifestation') && this.data.manifestation) {
      this.isEdit = true;
      this.setManifestationData();
    } else {
      this.addManifestationCode();
    }
  }

  private createForm(): void {
    this.addManifestationForm = this.formBuilder.group({
      gender: ['', Validators.required],
      name: ['', Validators.required],
      sport: ['', Validators.required],
      translations: this.formBuilder.group({
        en: [''],
        it: [''],
        fr: [''],
        de: [''],
        es: [''],
      }),
      manifestationCodes: this.formBuilder.array([])
    });
  }

  private setManifestationData() {
    this.addManifestationForm.patchValue({
      name: this.data.manifestation.name,
      gender: this.data.manifestation.gender,
      sport: this.data.manifestation.sport,
      translations: this.formBuilder.group({
        en: this.data.manifestation.translations && this.data.manifestation.translations.hasOwnProperty('en') && this.data.manifestation.translations.en ? this.data.manifestation.translations.en : '',
        it: this.data.manifestation.translations && this.data.manifestation.translations.hasOwnProperty('it') && this.data.manifestation.translations.it ? this.data.manifestation.translations.it : '',
        fr: this.data.manifestation.translations && this.data.manifestation.translations.hasOwnProperty('fr') && this.data.manifestation.translations.fr ? this.data.manifestation.translations.fr : '',
        de: this.data.manifestation.translations && this.data.manifestation.translations.hasOwnProperty('de') && this.data.manifestation.translations.de ? this.data.manifestation.translations.de : '',
        es: this.data.manifestation.translations && this.data.manifestation.translations.hasOwnProperty('es') && this.data.manifestation.translations.es ? this.data.manifestation.translations.es : '',
      })
    });
    this.manifestationId = this.data.manifestation.id;
    this.addManifestationForm.controls.name.disable();
    if (this.data.manifestation.manifestationCodes.length) {
      const manifestationCodes = this.addManifestationForm.controls.manifestationCodes as any;
      for(let index = 0; index < this.data.manifestation.manifestationCodes.length; index +=1) {
        this.addManifestationCode();
        manifestationCodes.controls[index].patchValue({
          system: this.data.manifestation.manifestationCodes[index].system,
          code: this.data.manifestation.manifestationCodes[index].code
        });
      }
    } else {
      this.addManifestationCode();
    }
  }

  private createManifestationCode(): FormGroup {
    return this.formBuilder.group({
      system: [''],
      code: [''],
      codeType: ['COMPETITION'],
      enable: [true]
    });
  }

  addManifestationCode(): void {
    const control = this.addManifestationForm.controls.manifestationCodes as any;
    control.push(this.createManifestationCode());
  }

  removeManifestationCode(index: number): void {
    const control = this.addManifestationForm.controls.manifestationCodes as any;
    control.removeAt(index);
  }

  getManifestationCodeControl() {
    return (this.addManifestationForm.get('manifestationCodes') as any).controls;
  }

  sportChanged(event) {
    if (event) {
      // this.manifestation.sport = event.sport;
      this.addManifestationForm.patchValue({
        sport: event.sport
      });
    }
  }
  genderChanged(event) {
    // this.manifestation.gender = event.value;
    this.addManifestationForm.patchValue({
      gender: event.value
    });
  }

  changeSystem(index: number): void {
    const manifestationCodes = this.addManifestationForm.controls.manifestationCodes as any;
    console.log('🚀 ~ file: add-competition.component.ts ~ line 139 ~ AddCompetitionComponent ~ changeSystem ~ manifestationCodes.controsl[index].system', manifestationCodes.controls[index]);
    if (manifestationCodes.controls[index].value.system) {
      manifestationCodes.controls[index].controls.code.setValidators(Validators.compose([Validators.required, Validators.pattern('^[0-9]+$')]));
      manifestationCodes.controls[index].controls.code.updateValueAndValidity();
    } else {
      manifestationCodes.controls[index].controls.code.clearValidators([Validators.required]);
      manifestationCodes.controls[index].controls.code.updateValueAndValidity();
    }
  }

  changeCode(index: number): void {
    const manifestationCodes = this.addManifestationForm.controls.manifestationCodes as any;
    console.log('🚀 ~ file: add-competition.component.ts ~ line 139 ~ AddCompetitionComponent ~ changeSystem ~ manifestationCodes.controsl[index].system', manifestationCodes.controls[index]);
    if (manifestationCodes.controls[index].value.code) {
      manifestationCodes.controls[index].controls.system.setValidators(Validators.required);
      manifestationCodes.controls[index].controls.system.updateValueAndValidity();
    } else {
      manifestationCodes.controls[index].controls.system.clearValidators([Validators.required]);
      manifestationCodes.controls[index].controls.system.updateValueAndValidity();
    }
  }

  submit() {
    if (!this.addManifestationForm.valid || !this.addManifestationForm.controls.manifestationCodes.valid) {
      Object.keys(this.addManifestationForm.controls).forEach(field => {
        const control = this.addManifestationForm.get(field);
        if (control instanceof FormControl) {
          control.markAsTouched({ onlySelf: true });
        }
      });
      const manifestationCodesControl = this.addManifestationForm.controls.manifestationCodes as any;
      manifestationCodesControl.controls.forEach((value, key) => {
        Object.keys(manifestationCodesControl.controls[key].controls).forEach(field => {
          const control = manifestationCodesControl.controls[key].get(field);
          if (control instanceof FormControl) {
            control.markAsTouched({ onlySelf: true });
          }
        });
      });
    } else {
      const manifestationCodes = this.addManifestationForm.getRawValue().manifestationCodes.map((value) => {
        return {
          ...value,
          system: value.system.toUpperCase().replace(' ', '_'),
        }
      })
      const data = {
        ...this.addManifestationForm.getRawValue(),
        name: this.addManifestationForm.getRawValue().name.toUpperCase().replace(' ', '_'),
        manifestationCodes,
      };
      if (this.isEdit) {
        data.id = this.manifestationId;
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
      console.log('🚀 ~ file: add-competition.component.ts ~ line 121 ~ AddCompetitionComponent ~ submit ~ data', data);
      this.loading = true;
      this.manifestationService.saveManifestation(data).subscribe(response => {
        this.loading = false;
        this.matDialogRef.close(true);
      }, error => {
        console.log(error)
        this.loading = false;
      });
    }
  }
}
