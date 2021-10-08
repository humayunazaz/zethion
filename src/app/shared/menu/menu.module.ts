import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialModule } from './../../material.module';
import { FooterToggleComponent } from './footer-toggle/footer-toggle.component';
import { LikeComponent } from './like/like.component';
import { MenuComponent } from './menu.component';
import { ShortcutImagesComponent } from './shortcut-images/shortcut-images.component';
import { LanguageModule } from './../../shared/language/language.module';
import { SportModule } from 'src/app/shared/sport/sport.module';
import { InfoDialogComponent } from './../dialogs/info-dialog/info-dialog.component';
import { ThumbDialogComponent } from './../dialogs/thumb-dialog/thumb-dialog.component';
import { TranslateModule } from "@ngx-translate/core";
import { SportMenuModule } from '../sport-menu/sport-menu.module';


@NgModule({
  declarations: [
    MenuComponent,
    ShortcutImagesComponent,
    LikeComponent,
    FooterToggleComponent,
    ThumbDialogComponent,
    InfoDialogComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    LanguageModule,
    SportModule,
    MaterialModule,
    TranslateModule,
    SportMenuModule
  ],
  exports: [
    MenuComponent,
    ShortcutImagesComponent,
    LikeComponent,
    FooterToggleComponent,
    LanguageModule
  ]
})
export class MenuModule { }
