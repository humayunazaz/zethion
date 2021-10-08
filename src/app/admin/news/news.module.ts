import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NewsRoutingModule } from './news-routing.module';
import { NewsComponent } from './news.component';
import { AddEditNewsComponent } from './add-edit-news/add-edit-news.component';
import { SharedModule } from 'src/app/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableResultsModule } from 'src/app/results/table-result/table-results.module';
import { TranslateModule } from '@ngx-translate/core';
import { NgPipesModule } from 'angular-pipes';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { SportModule } from 'src/app/shared/sport/sport.module';
import { NgxLoadingModule } from 'ngx-loading';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
@NgModule({
  declarations: [NewsComponent, AddEditNewsComponent],
  imports: [
    SharedModule,
    CommonModule,
    NewsRoutingModule,
    FormsModule,
    TableResultsModule,
    TranslateModule,
    NgPipesModule,
    MatDatepickerModule,
    MatMomentDateModule,
    ReactiveFormsModule,
    SportModule,
    NgxLoadingModule,
    MatAutocompleteModule,
    CKEditorModule
  ]
})
export class NewsModule { }
