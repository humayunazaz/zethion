import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SportMenuComponent } from './sport-menu.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [SportMenuComponent],
  imports: [
    CommonModule,
    MatMenuModule,
    MatCheckboxModule,
    TranslateModule
  ],
  exports: [
    SportMenuComponent
  ]
})
export class SportMenuModule { }
