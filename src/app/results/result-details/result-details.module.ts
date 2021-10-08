import { NgPipesModule, GroupByPipe } from 'angular-pipes';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';

import { DetailsFootballModule } from './details-football/details-football.module';
import { DetailsBasketballModule } from './details-basketball/details-basketball.module';
import { ClassificationsFootballComponent } from './classifications/classifications-football/classifications-football.component';
import { RegularsComponent } from './classifications/classifications-football/regulars/regulars.component';
import { PlayoffsComponent } from './classifications/classifications-football/playoffs/playoffs.component';
import {ScriptHackComponent} from "../../shared/ads/ad.component";


@NgModule({
  declarations: [
    ClassificationsFootballComponent,
    RegularsComponent,
    PlayoffsComponent
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    DetailsFootballModule,
    DetailsBasketballModule,
    NgPipesModule
  ],
  exports: [

  ],
  entryComponents: [
    ClassificationsFootballComponent,
    ScriptHackComponent
  ]
})
export class ResultDetailsModule { }
