import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoriesPageRoutingModule } from './stories-page-routing.module';
import { StoriesComponent } from './stories/stories.component';
import { SharedModule } from '../shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { MenuModule } from '../shared/menu/menu.module';
import { SportMenuModule } from '../shared/sport-menu/sport-menu.module';
import { StoriesTileComponent } from './stories-tile/stories-tile.component';
import { StoriesSlideComponent } from './stories-slide/stories-slide.component';
import { StoriesItemComponent } from './stories-item/stories-item.component';
import { StoryContentComponent } from './stories-item/story-content/story-content.component';
import { StoriesContentComponent } from './stories-content/stories-content.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { StoryReportComponent } from './stories-item/story-report/story-report.component';
import { InViewportDirective } from '../shared/in-viewport/in-viewport.directive';
import { SocialLikeShareModule } from '../shared/social-like-share/social-like-share.module';


@NgModule({
  declarations: [
    StoriesComponent,
    StoriesTileComponent,
    StoriesSlideComponent,
    StoriesItemComponent,
    StoryContentComponent,
    StoriesContentComponent,
    StoryReportComponent,
    InViewportDirective
  ],
  imports: [
    CommonModule,
    StoriesPageRoutingModule,
    SharedModule,
    TranslateModule,
    MenuModule,
    SportMenuModule,
    InfiniteScrollModule,
    SocialLikeShareModule
  ]
})
export class StoriesPageModule { }
