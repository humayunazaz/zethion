import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

import { DetailsBasketballComponent } from './details-basketball.component';
import { BasketballStatisticsModule } from './basketball-statistics/basketball-statistics.module';
import { BasketballPlayersModule } from './basketball-players/basketball-players.module';
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {MatCardModule} from "@angular/material/card";

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

@NgModule({
  declarations: [
    DetailsBasketballComponent
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    PerfectScrollbarModule,
    MatButtonToggleModule,
    MatCardModule,
    BasketballStatisticsModule,
    BasketballPlayersModule
  ],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ],
  exports: [
    DetailsBasketballComponent
  ],
  entryComponents: [
    DetailsBasketballComponent
  ]
})
export class DetailsBasketballModule {}
