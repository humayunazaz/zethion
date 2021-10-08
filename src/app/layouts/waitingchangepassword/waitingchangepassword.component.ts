import { Router } from '@angular/router';
import { Component, EventEmitter, Output, OnInit } from '@angular/core';

import { SigninService } from 'src/app/shared/_service/signin/signin.service';
import { AbstractWaitingComponent } from "../waiting/waiting.component";
import { StorageService } from './../../shared/_service/storage/storage.service';
@Component({
  selector: 'app-waitingchangepassword',
  templateUrl: '../waiting/waiting.component.html',
  styleUrls: ['../waiting/waiting.component.css']
})
export class WaitingchangepasswordComponent extends AbstractWaitingComponent implements OnInit {

  constructor(
    protected signinService: SigninService,
    protected router: Router,
    private storageService: StorageService
  ) {
    super(signinService, router);
  }

  ngOnInit() {
    this.token = this.scrapToken();
    if (this.token) {
      this.signinService.changePassword(this.token).subscribe(response => {
        this.loading = false;
        this.confirm = "success";
        this.storageService.setUsernameToChangePassword(response['username']);
        setTimeout(() => {
          this.router.navigate(['reset_password']);
        }, 2000);
      },
        error => {
          this.loading = false;
          this.confirm = "danger"
          console.log(error);
        });
    }
  }

}
