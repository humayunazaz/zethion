import { TranslateService } from '@ngx-translate/core';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {MatDialog} from "@angular/material/dialog";

import moment from 'moment';

import { SigninService } from '../../_service/signin/signin.service';
import { ConfirmComponent } from '../../confirm/confirm.component';
import { MustMatch } from '../../MustMatch';
import { StorageService } from './../../_service/storage/storage.service';


@Component({
  selector: 'app-signupform',
  templateUrl: './signupform.component.html',
  styleUrls: ['./signupform.component.scss']
})
export class SignupformComponent implements OnInit {

  signForm1: FormGroup;
  signForm2: FormGroup;
  formstate = 'form1';
  data = {
    status: true,
    message: 'Success'
  };
  registerData = {
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    country: '',
    gender: '',
    birthDate: '',
    birthPlace: '',
    phoneNumber: '',
    clientSecret: ''
    // phoneNumber: '',
  };
  private selectedCountry: string;
  country: string;
  place: string;

  constructor(
    private formBuilder: FormBuilder,
    private signinService: SigninService,
    private dialog: MatDialog,
    private translateService: TranslateService,
    private storageService: StorageService
  ) {
    this.signForm1 = this.formBuilder.group({
      Username: ['', Validators.required],
      // Password: ['', [Validators.required, Validators.pattern('(?^[0-9]*$)(?=.*[A-Z])(?!^[a-zA-Z]*$)^([a-zA-Z0-9]{8,30})$')]],
      Password: ['', [Validators.required, Validators.pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})'))]],
      ConfirmPassword: ['', Validators.required],
      Email: ['', [Validators.required, Validators.email]],
    }, {
      validator: MustMatch('Password', 'ConfirmPassword'),
    });
    this.signForm2 = this.formBuilder.group({
      Firstname: [''],
      Lastname: [''],
      Phonenumber: [''],
      Birthday: [''],
      Gender: ['']
    });

    // this.signForm1.get('Password').setValue('qweqweQ1');
    // this.signForm1.get('ConfirmPassword').setValue('qweqweQ1');
  }

  ngOnInit() {

  }

  getErrorMessage(pickerInput: string): string {
    if (!pickerInput || pickerInput === '') {
      return 'FORM.DATE_SELECTION';
    }
    return this.isMyDateFormat(pickerInput);
  }

  isMyDateFormat(date: string): string {
    if (date.length !== 10) {
      return 'FORM.DATE_INVALID';
    } else {
      const da = date.split('-');
      if (da.length !== 3 || da[0].length !== 4 || da[1].length !== 2 || da[2].length !== 2) {
        return 'FORM.DATE_INVALID';
      } else if (moment(date).isValid()) {
        return 'FORM.DATE_INVALID_TODAY';
      } else if (!moment(date).isValid()) {
        return 'FORM.DATE_INVALID_ERROR';
      }
    }
    return 'FORM.DATE_INVALID';
  }

  signUp() {
    this.registerData.firstName = this.signForm2.get('Firstname').value;
    this.registerData.lastName = this.signForm2.get('Lastname').value;
    this.registerData.country = this.country;
    this.registerData.phoneNumber = this.signForm2.get('Phonenumber').value;
    this.registerData.birthDate = this.signForm2.get('Birthday').value;
    this.registerData.birthPlace = this.place;
    this.registerData.gender = this.signForm2.get('Gender').value;
    this.registerData.clientSecret = this.__getSecret();
    console.log(this.registerData);
    this.signinService.signup(this.registerData).subscribe(async (response: any) => {
      const message = await this.translateService.getTranslation(response.message).toPromise();
      this.storageService.setForgotPassword('closed');
      this.dialog.closeAll();
      this.data = {
        status: true,
        message: (message as string)
      };
      this.dialog.open(ConfirmComponent, {
        panelClass: 'custom-dialog-container',
        width: '300px',
        height: '300px',
        data: this.data
      });
    }, async error => {
      // console.log(error);
      // console.log(error.error.message);
      const message = await this.translateService.get(error.error.message).toPromise();
      console.log(message);
      this.data = {
        status: false,
        message: message
      };
      this.dialog.open(ConfirmComponent, {
        panelClass: 'custom-dialog-container',
        width: '300px',
        height: '300px',
        data: this.data
      });
    });
  }

  __getSecret() {
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789~`!@#$%^&*()-_=+[{]}\\\\|;:\\\'\\",<.>/?';
    let charactersLength = characters.length;
    let result;
    for ( var i = 0; i < 9; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  get getForm1() {
    return this.signForm1.controls;
  }
  get getForm2() {
    return this.signForm2.controls;
  }

  callform_pre() {
    if (this.formstate === 'form2') {
      this.formstate = 'form1';
    }
  }
  callform_back() {
    this.dialog.closeAll();
  }
  callform_next() {
    if (this.signForm1.valid) {
      this.registerData.username = this.signForm1.get('Username').value;
      this.registerData.email = this.signForm1.get('Email').value;
      this.registerData.password = this.signForm1.get('Password').value;
      if (this.formstate === 'form1') {
        this.formstate = 'form2';
      }
    }
  }

  countrySelected(selected) {
    this.country = selected;
    console.log(this.country);
  }

  placeSelected(selected) {
    this.place = selected;
  }
}
