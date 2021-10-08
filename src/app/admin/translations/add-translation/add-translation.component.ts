import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '../../../shared/_service/translate/translate.service';
import {Translation} from "../../../shared/_service/translate/translate.model";

@Component({
  selector: 'add-translation-dialog',
  templateUrl: './add-translation.component.html',
  styleUrls: ['./add-translation.component.scss']
})
export class AddTranslationComponent implements OnInit {

  languages: [];
  loading: boolean = false;

  code: string = '';
  cluster: string = '';
  language: string = '';
  translate: string = '';

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private translateService: TranslateService,
    private matDialogRef: MatDialogRef<AddTranslationComponent>) {
    this.languages = data.languages;
  }

  ngOnInit() {
  }

  submit(){
    if(this.loading)
      return;
    if(this.code == '' && this.cluster == '' && this.language == '' && this.translate == ''){
      alert('Please check your input');
      return;
    }
    this.loading = true;
    const data : Translation = {
      'code': this.code.toUpperCase(),
      'cluster': this.cluster.toUpperCase(),
      'language': this.language,
      'translatedText' : this.translate
    };
    this.translateService.saveTranslation(data).subscribe(response => {
      this.loading = false;
      this.matDialogRef.close(true);
    }, error => {
      console.log(error)
      this.loading = false;
      // this.matDialogRef.close(false);
    });

  }



}
