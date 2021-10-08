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
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { TableResultsModule } from 'src/app/results/table-result/table-results.module';
import { AddEditTeamComponent } from './add-edit-team/add-edit-team.component';
import { TeamsComponent } from './teams.component';
import { TeamsRoutes } from './teams-routing.module';

@NgModule({
  declarations: [
    TeamsComponent,
    AddEditTeamComponent
  ],
  imports: [
    SharedModule,
    CommonModule,
    RouterModule.forChild(TeamsRoutes),
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
export class TeamsModule { }
