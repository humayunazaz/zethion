import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectYearComponent } from './select-year/select-year.component';
import {TranslateModule} from '@ngx-translate/core';
import {FormsModule} from '@angular/forms';
import {MatSelectModule} from "@angular/material/select";

@NgModule({
  declarations: [SelectYearComponent],
  imports: [
    CommonModule,
    MatSelectModule,
    TranslateModule,
    FormsModule
  ],
  exports: [
    SelectYearComponent
  ]
})
export class FormCustomModule { }
