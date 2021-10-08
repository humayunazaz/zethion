import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { listMediaCountry, listMediaType, listMediaLanguage } from 'src/app/model/results.model';
import { MediaService } from 'src/app/shared/_service/media/media.service';

@Component({
  selector: 'app-add-media',
  templateUrl: './add-media.component.html',
  styleUrls: ['./add-media.component.scss']
})
export class AddMediaComponent implements OnInit {

  addMediaForm: FormGroup;
  mediaType: any = listMediaType().slice(1);
  countries = listMediaCountry().slice(1);
  languages = listMediaLanguage();
  loading: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private mediaService: MediaService,
    private matDialogRef: MatDialogRef<AddMediaComponent>,
  ) {
    this.loading = false;
  }

  ngOnInit(): void {
    this.createForm();
  }

  private createForm(): void {
    this.addMediaForm = this.formBuilder.group({
      name: ['', Validators.required],
      language: ['', Validators.required],
      country: ['', Validators.required],
      type: ['', Validators.required],
      sport: ['', Validators.required],
      url: ['', Validators.pattern('(https?:\/\/(?:www\\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\\.[^\\s]{2,}|www\\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\\.[^\\s]{2,}|https?:\/\/(?:www\\.|(?!www))[a-zA-Z0-9]+\\.[^\\s]{2,}|www\\.[a-zA-Z0-9]+\\.[^\\s]{2,})')]
    });
  }

  addMedia(): void {
    this.loading = true;
    if (!this.addMediaForm.valid) {
      Object.keys(this.addMediaForm.controls).forEach(field => {
        const control = this.addMediaForm.get(field);
        if (control instanceof FormControl) {
          control.markAsTouched({ onlySelf: true });
        }
      });
    } else {
      this.loading = true;
      const data = {
        name: this.addMediaForm.value.name,
        mainLanguage: this.addMediaForm.value.language,
        country: this.addMediaForm.value.country,
        type: this.addMediaForm.value.type,
        url: this.addMediaForm.value.url || null,
        sport: this.addMediaForm.value.sport
      };
      this.mediaService.saveMedia(data)
        .subscribe((response) => {
          this.loading = false;
          this.matDialogRef.close(true);
        }, (error) => {
          this.loading = false;
        })
    }
  }

}
