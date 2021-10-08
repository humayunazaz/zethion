import { Component, OnInit, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { SigninService } from '../../_service/signin/signin.service';
import { StorageService } from './../../_service/storage/storage.service';
@Component({
  selector: 'app-logoutconfirm',
  templateUrl: './logoutconfirm.component.html',
  styleUrls: ['./logoutconfirm.component.css']
})
export class LogoutconfirmComponent implements OnInit, AfterViewChecked {

  public loading = false;

  constructor(
    private signinService: SigninService,
    private dialog: MatDialog,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private storageService: StorageService
  ) { }

  ngOnInit() {
  }

  ngAfterViewChecked() {
    // document.getElementById('setFocus').focus();
    setTimeout(() => {
      // document.getElementById('setFocus').focus();
      // document.getElementById('calcelButton').blur();
    }, 100);
  }

  logout() {
    this.loading = true;
    setTimeout(() => {
      this.signinService.logout();
      this.storageService.deleteAll();
      this.dialog.closeAll();
      this.router.navigate(['/']);
    }, 500);
  }
  cancel() {
    this.dialog.closeAll();
  }

}
