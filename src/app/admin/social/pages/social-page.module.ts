import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "../../../shared.module";
import { TranslateModule } from "@ngx-translate/core";
import { NgPipesModule } from "angular-pipes";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatMomentDateModule } from "@angular/material-moment-adapter";
import { SportModule } from "../../../shared/sport/sport.module";
import { NgxLoadingModule } from "ngx-loading";
import { SocialPagesComponent } from '../../social/pages/social-pages.component';
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { SocialPageRoutes } from './social-page.routing';
import { TableResultsModule } from 'src/app/results/table-result/table-results.module';

@NgModule({
  declarations: [
    SocialPagesComponent
  ],
  imports: [
    SharedModule,
    CommonModule,
    RouterModule.forChild(SocialPageRoutes),
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
export class SocialPageModule { }
