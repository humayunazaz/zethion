import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PrivacyPreferenceDialogComponent } from '../privacy-preference-dialog/privacy-preference-dialog.component';
import { CookiesPreference } from '../modals/cookie-preference';
import { StorageService } from '../../_service/storage/storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cookie-consent-dialog',
  templateUrl: './cookie-consent-dialog.component.html',
  styleUrls: ['./cookie-consent-dialog.component.scss']
})
export class CookieConsentDialogComponent implements OnInit {
  cookiesPreferenceValues = new CookiesPreference(this.storageService.getCookieConsent());
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private matDialog: MatDialog,
    private storageService: StorageService,
    private dialogRef: MatDialogRef<CookieConsentDialogComponent>,
    private router: Router
  ) {}

  ngOnInit() {
  }

  openPrivacyDailog() {
    this.matDialog.open(PrivacyPreferenceDialogComponent, {
      panelClass: 'privacy-preference-dialog',
      data: this.cookiesPreferenceValues
    });
  }

  acceptAllCookies() {
    this.cookiesPreferenceValues.acceptAll();
    this.storageService.setCookieConsent(this.cookiesPreferenceValues);
    this.storageService.setCookieConsentStatus(true);
    this.dialogRef.close(true);
  }

  goToPolicy() {
    this.dialogRef.close(true);
    this.router.navigate(['/info/cookiePolicy']);
  }

}
