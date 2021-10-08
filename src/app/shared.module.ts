import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MaterialModule } from './material.module';
import { RightbarComponent } from './shared/rightbar/rightbar.component';
import { NotFoundComponent } from './error/notfound/notfound.component';
import { WaitingconfirmComponent } from './layouts/waitingconfirm/waitingconfirm.component';
import { AbstractWaitingComponent } from './layouts/waiting/waiting.component';
import { WaitingchangepasswordComponent } from './layouts/waitingchangepassword/waitingchangepassword.component';
import { ConfirmDialogComponent } from './shared/dialogs/confirm-dialog/confirm-dialog.component';
import { ConfirmComponent } from './shared/confirm/confirm.component';
import { CookieConsentDialogComponent } from './shared/dialogs/cookie-consent-dialog/cookie-consent-dialog.component';
import { PrivacyPreferenceDialogComponent } from './shared/dialogs/privacy-preference-dialog/privacy-preference-dialog.component';
import { ResizeColumnDirective } from './shared/resize-column/resize-column.directive';
import { TeamAutocompleteComponent } from './admin/registry/tournaments/team-autocomplete/team-autocomplete.component';
import { TranslateModule } from '@ngx-translate/core';
import { QueryAutocompleteComponent } from './shared/sport/query-autocomplete/query-autocomplete.component';
import { CountryAutocompleteComponent } from './shared/sport/country-autocomplete/country-autocomplete.component';
import { PlaceAutocompleteComponent } from './shared/sport/city-autocomplete/place-autocomplete.component';
import { SanitizeYoutubePipe } from './news/news-section/youtube/sanitize-youtube/sanitize-youtube.pipe';
import { SearchReportComponent } from './news/news-section/search-report/search-report.component';
import { AmazonAffiliateComponent } from './shared/amazon-affiliate/amazon-affiliate.component';
import {ScriptHackComponent} from "./shared/ads/ad.component";
import { PaypalDonateComponent } from './shared/paypal-donate/paypal-donate.component';

@NgModule({
  imports: [
    MaterialModule,
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule
  ],
  exports: [
    MaterialModule,
    RightbarComponent,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    RouterModule,
    CookieConsentDialogComponent,
    PrivacyPreferenceDialogComponent,
    ResizeColumnDirective,
    TeamAutocompleteComponent,
    QueryAutocompleteComponent,
    CountryAutocompleteComponent,
    PlaceAutocompleteComponent,
    SanitizeYoutubePipe,
    SearchReportComponent,
    AmazonAffiliateComponent,
    ScriptHackComponent,
    PaypalDonateComponent
  ],
  declarations: [
    NotFoundComponent,
    RightbarComponent,
    WaitingconfirmComponent,
    AbstractWaitingComponent,
    WaitingchangepasswordComponent,
    ConfirmComponent,
    ConfirmDialogComponent,
    CookieConsentDialogComponent,
    PrivacyPreferenceDialogComponent,
    ResizeColumnDirective,
    TeamAutocompleteComponent,
    QueryAutocompleteComponent,
    CountryAutocompleteComponent,
    PlaceAutocompleteComponent,
    SanitizeYoutubePipe,
    SearchReportComponent,
    AmazonAffiliateComponent,
    ScriptHackComponent,
    PaypalDonateComponent
  ],
  entryComponents: [
    CookieConsentDialogComponent,
    PrivacyPreferenceDialogComponent
  ]
})
export class SharedModule { }
