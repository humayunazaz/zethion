import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FootballOnfieldComponent } from './football-onfield.component';

@NgModule({
  declarations: [FootballOnfieldComponent],
  imports: [
    CommonModule,
  ],
  exports: [
    FootballOnfieldComponent
  ]
})
export class FootballOnfieldModule { }
