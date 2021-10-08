import { NgModule, Injectable } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxLoadingModule } from 'ngx-loading';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { TranslateModule } from '@ngx-translate/core';
import { CarouselModule } from 'ngx-owl-carousel-o';

import { SharedModule } from './../shared.module';
import { DashboardComponent } from './dashboard.component';
import { DashboardRoutes } from './dashboard.routing';
import { SidebarModule } from '../shared/sidebar/sidebar.module';
import { ResultsModule } from '../results/results.module';
import { ProfileComponent } from './profile/profile.component';
import { CustomizeComponent } from './customize/customize.component';
import { SportModule } from '../shared/sport/sport.module';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { NewsModule } from '../news/news.module';
import { SearchComponent } from './search/search.component';
import { NgbPaginationModule, NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
// import { InfoDialogComponent } from '../shared/dialogs/info-dialog/info-dialog.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
// import { NewsSectionComponent } from '../news/news-section/news-section.component';
import { TableResultsModule } from '../results/table-result/table-results.module';
import { DashboardResultModule } from '../results/dashboard-result/dashboard-result.module';
// import { NewsContentComponent } from '../news/news-section/news/news-content/news-content.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(DashboardRoutes),
    FormsModule,
    ReactiveFormsModule,
    TableResultsModule,
    // NewsModule,
    SharedModule,
    TranslateModule,
    ResultsModule,
    SidebarModule,
    SportModule,
    DragDropModule,
    InfiniteScrollModule,
    NgxLoadingModule,
    // DashboardResultModule,
    CarouselModule,
    NgbPaginationModule,
    NgbAlertModule,
    NgbModule,
    MatProgressSpinnerModule
  ],
  declarations: [
    DashboardComponent,
    ProfileComponent,
    CustomizeComponent,
    ResetPasswordComponent,
    // NewsContentComponent,
    // NewsSectionComponent,
    SearchComponent,
    // InfoDialogComponent,
  ],
})
export class DashboardModule { }
