import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { listTagTypes } from 'src/app/model/results.model';
import { TagsService } from 'src/app/shared/_service/tags/tags.service';
import {Sport} from "../../../match/match.component";

@Component({
  selector: 'app-add-edit-tag',
  templateUrl: './add-edit-tag.component.html',
  styleUrls: ['./add-edit-tag.component.scss']
})
export class AddEditTagComponent implements OnInit {

  public selectedSport: Sport;
  addEditTagForm: FormGroup;
  tagTypes: any = listTagTypes().slice(1)
  loading: boolean;
  isEdit: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private tagService: TagsService,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private matDialogRef: MatDialogRef<AddEditTagComponent>,
  ) {
    this.loading = false;
    this.isEdit = false;
    if (data && data.hasOwnProperty('tag') && data.tag) {
      this.isEdit = true;
    }
  }

  ngOnInit(): void {
    this.createForm();
    if (this.isEdit) {
      this.getFormData();
    }
  }

  private createForm(): void {
    this.addEditTagForm = this.formBuilder.group({
      keyword: ['', Validators.required],
      type: [null, Validators.required],
      sport: [''],
      subject: [''],
      imageUrl: ['', Validators.pattern('(https?:\/\/(?:www\\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\\.[^\\s]{2,}|www\\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\\.[^\\s]{2,}|https?:\/\/(?:www\\.|(?!www))[a-zA-Z0-9]+\\.[^\\s]{2,}|www\\.[a-zA-Z0-9]+\\.[^\\s]{2,})')]
    });
  }

  typeChanged(): void {
    console.log('type changed');
    if (this.addEditTagForm.value.type && this.addEditTagForm.value.type !== 'GENERAL') {
      this.addEditTagForm.controls.subject.reset();
      this.addEditTagForm.controls.sport.setValidators([Validators.required]);
      this.addEditTagForm.controls.sport.updateValueAndValidity();
    } else {
      this.addEditTagForm.controls.sport.clearValidators();
      this.addEditTagForm.controls.sport.updateValueAndValidity();
    }
  }

  sportsChanged(selected): void {
    console.log('sports changed');
    this.selectedSport = { sport: selected };
    if (this.addEditTagForm.value.sport) {
      this.addEditTagForm.controls.subject.setValidators([Validators.required]);
      this.addEditTagForm.controls.subject.updateValueAndValidity();
    } else {
      this.addEditTagForm.controls.subject.clearValidators();
      this.addEditTagForm.controls.subject.updateValueAndValidity();
    }
  }

  private getFormData(): void {
    if (this.data.tag.keyword) {
      this.addEditTagForm.controls.keyword.disable();
    }
    this.addEditTagForm.patchValue({
      keyword: this.data.tag.keyword || '',
      type: this.data.tag.type || 'GENERAL',
      sport: this.data.tag.type !== 'GENERAL' ? this.data.tag.sport : null,
      subject: this.data.tag.type !== 'GENERAL' ? this.data.tag.subject : null,
      imageUrl: this.data.tag.urlToImage || null
    });
  }

  addEditTag(): void {
    this.loading = true;
    if (!this.addEditTagForm.valid) {
      Object.keys(this.addEditTagForm.controls).forEach(field => {
        const control = this.addEditTagForm.get(field);
        if (control instanceof FormControl) {
          control.markAsTouched({ onlySelf: true });
        }
      });
    } else {
      let data = [];
      const keywords = this.addEditTagForm.getRawValue().keyword.split(',');
      for(let i=0; i<keywords.length; i++){
        const dataK = {
          keyword: keywords[i].split(' ').join('_').toUpperCase(),
          type: this.addEditTagForm.getRawValue().type !== 'GENERAL' ? this.addEditTagForm.getRawValue().type : null,
          idRef: this.addEditTagForm.getRawValue().type !== 'GENERAL' ? this.addEditTagForm.getRawValue().subject.id : null,
          urlToImage: this.addEditTagForm.getRawValue().imageUrl || null
        };
        data.push(dataK);
      }
      this.tagService.saveTag(data)
        .subscribe((response) => {
          this.loading = false;
          console.log('🚀 ~ file: add-edit-tag.component.ts ~ line 58 ~ AddEditTagComponent ~ .subscribe ~ response', response);
          this.matDialogRef.close(true);
        }, (error) => {
          this.loading = false;
          console.log('🚀 ~ file: add-edit-tag.component.ts ~ line 60 ~ AddEditTagComponent ~ .subscribe ~ error', error);
        });
    }
  }

}
