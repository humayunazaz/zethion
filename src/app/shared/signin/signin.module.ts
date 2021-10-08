import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { SignindialogComponent } from './signindialog/signindialog.component';
import { SignupformComponent } from './signupform/signupform.component';
import { SigninformComponent } from './signinform/signinform.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TestService } from '../_service/test/test.service';
import { HttpClientModule, HttpClientXsrfModule } from '@angular/common/http';
import { UserboxComponent } from './userbox/userbox.component';
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';
import { LogoutconfirmComponent } from './logoutconfirm/logoutconfirm.component';
import { NgxLoadingModule } from 'ngx-loading';
import { TranslateModule } from '@ngx-translate/core';
import { ConfirmComponent } from '../confirm/confirm.component';
import {MatDialogModule} from "@angular/material/dialog";
import {MatCardModule} from "@angular/material/card";
import {MatSelectModule} from "@angular/material/select";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatNativeDateModule} from "@angular/material/core";
import {MatInputModule} from "@angular/material/input";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatRadioModule} from "@angular/material/radio";
import {MatDatepickerModule} from "@angular/material/datepicker";
import { SharedModule } from 'src/app/shared.module';


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule,
    MatInputModule,
    FormsModule,
    HttpClientModule,
    NgxLoadingModule,
    HttpClientXsrfModule.withOptions({ cookieName: 'XSRF-TOKEN' }),
    RouterModule,
    TranslateModule,
    SharedModule
  ],
  declarations: [
    SignindialogComponent,
    SignupformComponent,
    SigninformComponent,
    UserboxComponent,
    ForgotpasswordComponent,
    LogoutconfirmComponent,
  ],
  providers: [
    TestService
  ],
  exports: [UserboxComponent, SignindialogComponent],
  entryComponents: [
    ConfirmComponent,
    SigninformComponent,
    SignupformComponent,
    LogoutconfirmComponent,
    SignindialogComponent,
    UserboxComponent,
    ForgotpasswordComponent,
  ]
})

export class SigninModule { }
