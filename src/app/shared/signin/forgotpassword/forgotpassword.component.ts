import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { StorageService } from './../../_service/storage/storage.service';
import { SigninService } from '../../_service/signin/signin.service';
import { ConfirmComponent } from '../../confirm/confirm.component';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.css']
})
export class ForgotpasswordComponent implements OnInit {

  forgotForm: FormGroup;
  email: string;
  data = {
    'status': true,
    'message': "success",
  }

  constructor(
    private formBuilder: FormBuilder,
    private signinService: SigninService,
    private dialog: MatDialog,
    private storageService: StorageService
  ) {
    this.forgotForm = this.formBuilder.group({
      Email: ['', [Validators.required, Validators.email]],
    })
  }

  ngOnInit() {
  }

  reset() {
    if (this.forgotForm.valid) {
      this.email = this.forgotForm.get('Email').value;
      this.signinService.recover(this.email).subscribe(response => {
        this.dialog.closeAll();
        this.storageService.setForgotPassword('closed');
        this.data = {
          message: 'Success',
          status: true
        }
        this.openConfirm();
      }, error => {
        this.dialog.closeAll();
        this.storageService.setForgotPassword('closed');
        this.data = {
          message: 'Failed',
          status: false
        }
        this.openConfirm();
      });
    }
  }

  openConfirm() {
    this.dialog.open(ConfirmComponent, {
      panelClass: 'custom-dialog-container',
      width: '300px',
      height: '300px',
      data: this.data
    });
  }

  get formValid() {
    return this.forgotForm.controls;
  }

}
