import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";

import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatDialogModule } from "@angular/material/dialog";
import { NgMarqueeModule } from 'ng-marquee';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

import { NewsdialogComponent } from './news-section/news/newsdialog/newsdialog.component';
import { NewsRoutes } from "./news.routing";
import { NewsSectionComponent } from './news-section/news-section.component';
import { SharedModule } from './../shared.module';
import { FacebookModule } from 'ngx-facebook';
import { NewsTileComponent } from './news-section/news/news-tile/news-tile.component';
import { FacebookTileComponent } from './news-section/facebook/facebook-tile/facebook-tile.component';
import { NewsSlideComponent } from './news-section/news/news-slide/news-slide.component';
import { FacebookSlideComponent } from './news-section/facebook/facebook-slide/facebook-slide.component';
import { InstagramSlideComponent } from './news-section/instagram/instagram-slide/instagram-slide.component';
import { InstagramTileComponent } from './news-section/instagram/instagram-tile/instagram-tile.component';
import { TwitterTileComponent } from './news-section/twitter/twitter-tile/twitter-tile.component';
import { TwitterSlideComponent } from './news-section/twitter/twitter-slide/twitter-slide.component';
import { NewsContentComponent } from './news-section/news/news-content/news-content.component';
import { FacebookContentComponent } from './news-section/facebook/facebook-content/facebook-content.component';
import { TwitterContentComponent } from './news-section/twitter/twitter-content/twitter-content.component';
import { InstagramContentComponent } from './news-section/instagram/instagram-content/instagram-content.component';
import { FbServiceWrapperService } from './news-section/facebook/fb-service-wrapper.service';

import { SearchDialogComponent } from 'src/app/shared/dialogs/search-dialog/search-dialog.component';
import { TranslateModule } from '@ngx-translate/core';
import { FbdialogComponent } from './news-section/facebook/fbdialog/fbdialog.component';
import { IgServiceWrapperService } from "./news-section/instagram/ig-service-wrapper.service";
import { TwServiceWrapperService } from "./news-section/twitter/tw-service-wrapper.service";
import { IgdialogComponent } from "./news-section/instagram/igdialog/igdialog.component";
import { TwdialogComponent } from "./news-section/twitter/twdialog/twdialog.component";
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxTweetModule } from 'ngx-tweet';
import { SanitizeHtmlPipe } from './news-section/instagram/sanitize-html/sanitize-html.pipe';
import { YtdialogComponent } from './news-section/youtube/ytdialog/ytdialog.component';
import { YoutubeSlideComponent } from './news-section/youtube/youtube-slide/youtube-slide.component';
import { YoutubeTileComponent } from './news-section/youtube/youtube-tile/youtube-tile.component';
import { YoutubeContentComponent } from './news-section/youtube/youtube-content/youtube-content.component';
import { SanitizeInstagramPipe } from './news-section/instagram/sanitize-instagram/sanitize-instagram.pipe';
import { SportMenuModule } from '../shared/sport-menu/sport-menu.module';
import { ModalOpeningContainerComponent } from './news-section/modal-container/modal-container.component';
import { MenuModule } from '../shared/menu/menu.module';
import { SocialLikeShareModule } from '../shared/social-like-share/social-like-share.module';
@NgModule({
  declarations: [
    NewsSectionComponent,
    NewsdialogComponent,
    NewsTileComponent,
    NewsSlideComponent,
    NewsContentComponent,
    FacebookTileComponent,
    FacebookSlideComponent,
    FacebookContentComponent,
    InstagramTileComponent,
    InstagramSlideComponent,
    InstagramContentComponent,
    TwitterTileComponent,
    TwitterSlideComponent,
    TwitterContentComponent,
    SearchDialogComponent,
    FbdialogComponent,
    IgdialogComponent,
    TwdialogComponent,
    SanitizeHtmlPipe,
    YtdialogComponent,
    YoutubeSlideComponent,
    YoutubeTileComponent,
    YoutubeContentComponent,
    SanitizeInstagramPipe,
    ModalOpeningContainerComponent,
  ],
  exports: [
    NewsdialogComponent
  ],
  imports: [
    CommonModule,
    NgMarqueeModule,
    DragDropModule,
    MatDialogModule,
    RouterModule.forChild(NewsRoutes),
    FormsModule,
    SharedModule,
    InfiniteScrollModule,
    CarouselModule,
    FacebookModule,
    TranslateModule,
    NgbCarouselModule,
    NgxTweetModule,
    SportMenuModule,
    MenuModule,
    SocialLikeShareModule
  ],
  entryComponents: [
    NewsdialogComponent,
    FbdialogComponent,
    IgdialogComponent,
    TwdialogComponent,
    YtdialogComponent
  ],
  providers: [
    FbServiceWrapperService,
    IgServiceWrapperService,
    TwServiceWrapperService
  ]
})
export class NewsModule { }
