import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasketballStatisticsComponent } from './basketball-statistics.component';

@NgModule({
  declarations: [BasketballStatisticsComponent],
  imports: [
    CommonModule
  ],
  exports: [
    BasketballStatisticsComponent
  ],
  // entryComponents: [
  //   BallPossessionComponent
  // ]
})
export class BasketballStatisticsModule {}

