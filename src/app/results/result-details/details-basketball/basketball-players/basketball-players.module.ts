import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasketballPlayersComponent } from './basketball-players.component';

@NgModule({
  declarations: [BasketballPlayersComponent],
  imports: [
    CommonModule
  ],
  exports: [
    BasketballPlayersComponent
  ],
  // entryComponents: [
  //   BallPossessionComponent
  // ]
})
export class BasketballPlayersModule {}

