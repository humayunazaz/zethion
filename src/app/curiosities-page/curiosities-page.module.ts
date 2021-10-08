import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CuriositiesPageRoutingModule } from './curiosities-page-routing.module';
import { CuriositiesItemComponent } from './curiosities-item/curiosities-item.component';
import { CuriositiesSlideComponent } from './curiosities-slide/curiosities-slide.component';
import { CuriositiesTileComponent } from './curiosities-tile/curiosities-tile.component';
import { CuriositiesContentComponent } from './curiosities-content/curiosities-content.component';
import { CuriositiesComponent } from './curiosities/curiosities.component';
import { SharedModule } from '../shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { MenuModule } from '../shared/menu/menu.module';
import { SportMenuModule } from '../shared/sport-menu/sport-menu.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { CuriosityContentComponent } from './curiosities-item/curiosity-content/curiosity-content.component';
import { CuriosityReportComponent } from './curiosities-item/curiosity-report/curiosity-report.component';
import { SafeHtmlPipe } from './safe-html/safe-html.pipe';
import { SocialLikeShareModule } from '../shared/social-like-share/social-like-share.module';


@NgModule({
  declarations: [
    CuriositiesItemComponent,
    CuriositiesSlideComponent,
    CuriositiesTileComponent,
    CuriositiesContentComponent,
    CuriositiesComponent,
    CuriosityContentComponent,
    CuriosityReportComponent,
    SafeHtmlPipe
  ],
  imports: [
    CommonModule,
    CuriositiesPageRoutingModule,
    SharedModule,
    TranslateModule,
    MenuModule,
    SportMenuModule,
    InfiniteScrollModule,
    SocialLikeShareModule
  ]
})
export class CuriositiesPageModule { }
