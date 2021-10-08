import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin.component';
import { RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "../shared.module";
import { TranslateModule } from "@ngx-translate/core";
import { NgPipesModule } from "angular-pipes";
import { InfiniteScrollModule } from "ngx-infinite-scroll";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatMomentDateModule } from "@angular/material-moment-adapter";
import { SportModule } from "../shared/sport/sport.module";
import { NgxLoadingModule } from "ngx-loading";
import { AdminRoutes } from "./admin.routing";
import { TableResultsModule } from '../results/table-result/table-results.module';

import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MenuModule } from '../shared/menu/menu.module';
import { MessageToastrComponent } from '../shared/message-toastr/message-toastr.component';

@NgModule({
  declarations: [
    AdminComponent,
    MessageToastrComponent
  ],
  imports: [
    SharedModule,
    CommonModule,
    RouterModule.forChild(AdminRoutes),
    FormsModule,
    TableResultsModule,
    TranslateModule,
    NgPipesModule,
    InfiniteScrollModule,
    MatDatepickerModule,
    MatMomentDateModule,
    ReactiveFormsModule,
    SportModule,
    NgxLoadingModule,
    MatAutocompleteModule,
    MenuModule
  ],
  entryComponents: [AdminComponent]
})
export class AdminModule { }
