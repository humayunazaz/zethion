import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConsentPreference } from '../../const/const';
import { StorageService } from '../../_service/storage/storage.service';
import { CookiesPreference } from '../modals/cookie-preference';

@Component({
  selector: 'app-privacy-preference-dialog',
  templateUrl: './privacy-preference-dialog.component.html',
  styleUrls: ['./privacy-preference-dialog.component.scss']
})
export class PrivacyPreferenceDialogComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<PrivacyPreferenceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CookiesPreference,
    private storageService: StorageService,
    private matDialog: MatDialog
  ) {}
  consentPreference = ConsentPreference;
  cookiesConsentValues: CookiesPreference = this.data;
  singleCookieMode = false;
  singleView: any;
  ngOnInit() {
  }

  updateCookieValues(id, event) {
    event.checked ? this.cookiesConsentValues.updateSingle(id, true) : this.cookiesConsentValues.updateSingle(id, false);
  }

  singleCookiesView(preference) {
    this.singleCookieMode = true;
    this.singleView = preference;
  }

  goPreviousView() {
    this.singleCookieMode = false;
    this.singleView = null;
  }

  onNoClick() {
    this.dialogRef.close();
  }

  acceptAllCookies() {
    this.cookiesConsentValues.acceptAll();
    this.storageService.setCookieConsent(this.cookiesConsentValues);
    this.storageService.setCookieConsentStatus(true);
    this.matDialog.closeAll();
  }

  setCookiesChoice() {
    this.storageService.setCookieConsent(this.cookiesConsentValues);
    this.storageService.setCookieConsentStatus(true);
    this.matDialog.closeAll();
  }

}


