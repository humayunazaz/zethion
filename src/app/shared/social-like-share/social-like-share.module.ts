import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SocialShareComponent } from './social-share/social-share.component';
import { ShareModalComponent } from './social-share/share-modal/share-modal.component';
import { SocialLikeComponent } from './social-like/social-like.component';
import { LikeModalComponent } from './social-like/like-modal/like-modal.component';
import { SocialPageModalComponent } from './social-like/social-page-modal/social-page-modal.component';
import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';
import { ShareIconsModule } from 'ngx-sharebuttons/icons';
import { FacebookModule } from 'ngx-facebook';



@NgModule({
  declarations: [
    SocialShareComponent,
    ShareModalComponent,
    SocialLikeComponent,
    LikeModalComponent,
    SocialPageModalComponent
  ],
  imports: [
    CommonModule,
    ShareButtonsModule,
    ShareIconsModule,
    FacebookModule
  ],
  exports: [
    SocialShareComponent,
    ShareModalComponent,
    SocialLikeComponent,
    LikeModalComponent,
    SocialPageModalComponent
  ]
})
export class SocialLikeShareModule { }
