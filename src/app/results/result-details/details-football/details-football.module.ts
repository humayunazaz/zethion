import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

import { DetailsFootballComponent } from './details-football.component';
import { FootballStatisticsModule } from './football-statistics/football-statistics.module';
import { FootballTimelineComponent } from './football-timeline/football-timeline.component';
import { FootballOnfieldModule } from './football-onfield/football-onfield.module';
import { TimelineComponent } from './football-timeline/timeline/timeline.component';
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatCardModule } from "@angular/material/card";

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

@NgModule({
  declarations: [
    DetailsFootballComponent,
    FootballTimelineComponent,
    TimelineComponent
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    PerfectScrollbarModule,
    MatButtonToggleModule,
    MatCardModule,
    FootballStatisticsModule,
    FootballOnfieldModule
  ],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ],
  exports: [
    DetailsFootballComponent
  ],
  entryComponents: [
    DetailsFootballComponent
  ]
})
export class DetailsFootballModule { }
