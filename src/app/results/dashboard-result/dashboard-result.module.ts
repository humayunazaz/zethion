import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCarouselModule } from '@ngbmodule/material-carousel';

import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import {
  PerfectScrollbarModule,
  PERFECT_SCROLLBAR_CONFIG,
  PerfectScrollbarConfigInterface
} from 'ngx-perfect-scrollbar';

import { DashboardResultComponent } from './dashboard-result.component';
import { ResultsModule } from '../results.module';
import { DashboardFootballComponent } from './dashboard-football/dashboard-football.component';
import { DashboardBasketballComponent } from './dashboard-basketball/dashboard-basketball.component';
import { DashboardFormula1Component } from './dashboard-formula1/dashboard-formula1.component';
import { TableResultsModule } from '../table-result/table-results.module';
import { SportModule } from 'src/app/shared/sport/sport.module';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

@NgModule({
  declarations: [
    DashboardResultComponent,
    DashboardFootballComponent,
    DashboardBasketballComponent,
    DashboardFormula1Component
  ],
  imports: [
    CommonModule,
    MatCarouselModule.forRoot(),
    PerfectScrollbarModule,
    ResultsModule,
    TableResultsModule,
    InfiniteScrollModule,
  ],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ],
  exports: [
    DashboardResultComponent
  ]
})
export class DashboardResultModule { }
