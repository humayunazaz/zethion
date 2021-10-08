import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FootballStatisticsComponent } from './football-statistics.component';
import { BallPossessionComponent } from './ball-possession/ball-possession.component';

@NgModule({
  declarations: [FootballStatisticsComponent,BallPossessionComponent],
  imports: [
    CommonModule
  ],
  exports: [
    FootballStatisticsComponent
  ],
  // entryComponents: [
  //   BallPossessionComponent
  // ]
})
export class FootballStatisticsModule {}

