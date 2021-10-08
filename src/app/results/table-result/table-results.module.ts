
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgPipesModule } from 'angular-pipes';
import { TranslateModule } from '@ngx-translate/core';

import { TableResultsComponent } from './table-results/table-results.component';
import { FilterPipe, GroupByPipe, OrderPipe, TablePipePipe } from './table-pipe.pipe';
import { TableResultsFormula1Component } from './table-results-formula1/table-results-formula1.component';
import { LanguageComponent } from 'src/app/shared/language/language.component';
import { LanguageModule } from 'src/app/shared/language/language.module';
import { ResultDetailsModule } from '../result-details/result-details.module';
import { ClassificationsIconComponent } from './classifications-icon/classifications-icon.component';
import { MaterialModule } from 'src/app/material.module';

export interface DropdownLink {
  title: string;
  iconClass?: string;
  routerLink?: string;
}

export enum NavItemType {
  Sidebar = 1, // Only ever shown on sidebar
  NavbarLeft = 2, // Left-aligned icon-only link on navbar in desktop mode, shown above sidebar items on collapsed sidebar in mobile mode
  NavbarRight = 3 // Right-aligned link on navbar in desktop mode, shown above sidebar items on collapsed sidebar in mobile mode
}

export interface NavItem {
  type: NavItemType;
  title: string;
  routerLink?: string;
  iconClass?: string;
  numNotifications?: number;
  dropdownItems?: (DropdownLink | 'separator')[];
}

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    NgPipesModule,
    FormsModule,
    LanguageModule,
    TranslateModule,
    ResultDetailsModule,
    MaterialModule
  ],
  declarations: [
    TableResultsComponent,
    TablePipePipe,
    GroupByPipe,
    FilterPipe,
    OrderPipe,
    TableResultsFormula1Component,
    ClassificationsIconComponent,
  ],
  exports: [
    TableResultsComponent,
    TableResultsFormula1Component,
    OrderPipe
  ],
  entryComponents: [LanguageComponent]
})
export class TableResultsModule { }
