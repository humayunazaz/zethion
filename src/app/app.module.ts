import { NgModule, Injectable } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { BrowserModule } from '@angular/platform-browser';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FlexLayoutModule } from '@angular/flex-layout';

import { NgxLoadingModule } from 'ngx-loading';
import {
  NgcCookieConsentConfig,
  NgcCookieConsentModule,
  NgcCookieConsentService,
  WindowService
} from "ngx-cookieconsent";
import { CookieService } from "ngx-cookie-service";
import { FacebookModule } from "ngx-facebook";
import { NgxTweetModule } from "ngx-tweet";
import { HammerGestureConfig, HammerModule, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { SidebarModule } from './shared/sidebar/sidebar.module';
import { NavbarModule } from './shared/navbar/navbar.module';
import { AdminLayoutComponent } from './layouts/admin/admin-layout.component';
import { TranslationLoader } from './shared/_service/translate/translationsloader';
import { MenubarComponent } from './shared/menubar/menubar.component';
import { LanguageModule } from './shared/language/language.module';
import { SigninModule } from './shared/signin/signin.module';
import { SharedModule } from './shared.module';
import { AppRoutes } from './app.routing';
import { OnfieldTestComponent } from './results/result-details/details-football/onfield-test/onfield-test.component';
import { LoginGuardService } from "./shared/_service/signin/login-guard.service";
import { ImagePreloadComponent } from './shared/_service/image-preload/image-preload-component/image-preload.component';
import { VersionCheckService } from "./shared/_service/version-check.service";
import { NgxGoogleAnalyticsModule, NgxGoogleAnalyticsRouterModule } from "ngx-google-analytics";
import { environment } from "../environments/environment";
import { MessageInterceptor } from './shared/_service/message/message.interceptor';

import { AdsenseModule } from 'ng2-adsense';

// custom configuration Hammerjs
@Injectable()
export class HammerConfig extends HammerGestureConfig {
  overrides = <any>{
    // I will only use the swap gesture so
    // I will deactivate the others to avoid overlaps
    'pinch': { enable: false },
    'rotate': { enable: false }
  };
}


export function HttpLoaderFactory(http: HttpClient) {
  return new TranslationLoader(http);
}

const cookieConfig: NgcCookieConsentConfig = {
  cookie: {
    domain: 'localhost' // or 'your.domain.com' // it is mandatory to set a domain, for cookies to work properly (see https://goo.gl/S2Hy2A)
  },
  palette: {
    popup: {
      background: '#fff'
    },
    button: {
      background: '#f1d600'
    }
  },
  theme: 'edgeless',
  type: 'opt-out'
};

@NgModule({
  imports: [
    SharedModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(AppRoutes, { scrollPositionRestoration: 'disabled' }),
    NgxLoadingModule.forRoot({}),
    SidebarModule,
    NavbarModule,
    BrowserModule,
    LanguageModule,
    SigninModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (HttpLoaderFactory),
        deps: [HttpClient]
      }
    }),
    DragDropModule,
    FlexLayoutModule,
    // NgcCookieConsentModule.forRoot(cookieConfig),
    FacebookModule.forRoot(),
    NgxTweetModule,
    HammerModule,
    NgxGoogleAnalyticsModule.forRoot('G-HRM0JK51BP'),
    NgxGoogleAnalyticsRouterModule,
    AdsenseModule.forRoot({
      adClient: 'ca-pub-9553091373172779'
    }),
  ],
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    MenubarComponent,
    OnfieldTestComponent,
    ImagePreloadComponent
  ],
  exports: [],
  bootstrap: [AppComponent],
  providers: [
    NgcCookieConsentService,
    WindowService,
    NgcCookieConsentConfig,
    CookieService,
    LoginGuardService,
    VersionCheckService,
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: HammerConfig
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MessageInterceptor,
      multi: true
    }
  ]
})
export class AppModule { }
