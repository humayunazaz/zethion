import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "../../shared.module";
import { TranslateModule } from "@ngx-translate/core";
import { NgPipesModule } from "angular-pipes";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatMomentDateModule } from "@angular/material-moment-adapter";
import { SportModule } from "../../shared/sport/sport.module";
import { NgxLoadingModule } from "ngx-loading";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { TableResultsModule } from 'src/app/results/table-result/table-results.module';
import { TagsComponent } from './tags.component';
import { AddEditTagComponent } from './add-edit-tag/add-edit-tag.component';
import { TagsRoutes } from './tags-routing.module';

@NgModule({
  declarations: [
    TagsComponent,
    AddEditTagComponent
  ],
  imports: [
    SharedModule,
    CommonModule,
    RouterModule.forChild(TagsRoutes),
    FormsModule,
    TableResultsModule,
    TranslateModule,
    NgPipesModule,
    MatDatepickerModule,
    MatMomentDateModule,
    ReactiveFormsModule,
    SportModule,
    NgxLoadingModule,
    MatAutocompleteModule
  ]
})
export class TagsModule { }
