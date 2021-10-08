import { Injectable } from '@angular/core';
import {Router} from "@angular/router";
import {SigninService} from "../../_service/signin/signin.service";

@Injectable({
  providedIn: 'root'
})
export class LoginGuardService {

  constructor(public auth: SigninService, public router: Router) {}

  canActivate(): boolean {
    if (!this.auth.isAuthenticated()) {
      this.router.navigate(['signin']);
      return false;
    }
    return true;
  }
}
