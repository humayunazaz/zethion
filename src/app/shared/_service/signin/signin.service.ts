import { EventEmitter, Injectable, Output } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { StorageService } from './../storage/storage.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SigninService {

  private user: any;
  loggedUser: Object;
  private headers = new HttpHeaders();

  @Output() change: EventEmitter<Object> = new EventEmitter();
  // storage: any;

  constructor(
    private http: HttpClient,
    private storageService: StorageService
  ) {
    this.headers.append('Content-Type', 'application/json');
  }

  login(credentials) {
    const headersCred = new HttpHeaders(credentials ? {
      authorization: 'Basic ' + btoa(credentials.username + ':' + credentials.password)
    } : {})
      .append('Content-Type', 'application/x-www-form-urlencoded;charset=UTF-8');

    // let body = 'username=${username}&password=${password}';
    const body = new URLSearchParams();
    body.set('username', credentials.username);
    body.set('password', credentials.password);

    return this.http.post('/login', body.toString(), { headers: headersCred }).pipe(map(user => {
      return user;
    }));
  }

  signup(credentials) {
    const headers = new HttpHeaders();
    const reqParam = {
      'username': credentials.username,
      'firstName': credentials.firstName,
      'lastName': credentials.lastName,
      'password': credentials.password,
      'email': credentials.email,
      'gender': credentials.gender,
      'birthDate': credentials.birthDate,
      'country': credentials.country,
      'birthPlace': credentials.birthPlace['place_id'],
      'contacts': [
        {
          'type': 'MOBILE',
          'number': credentials.phoneNumber
        }
      ],
      'userCustomizationsDTO': [
        {
          'customizationCode': 'DEFAULT_LANGUAGE',
          'values': [{ 'value': this.storageService.getLanguage(), 'enabled': 1 }]
        }
      ],
      'clientSecret': credentials.clientSecret
    };
    return this.http.post('/api/registerUser', reqParam, { headers: headers }).pipe(map(user => {
      return user;
    }));
  }

  signupVisitor(reqParam) {
    const headers = new HttpHeaders();
    // const reqParam = {
    //   'clientSecret': secret,
    //   'ip': ip,
    //   'countryCode': country,
    //   'place': 'ND', //TODO management with precise location and fallback on IP location
    //   'userCustomizationsDTO': [
    //     {
    //       'customizationCode': 'DEFAULT_LANGUAGE',
    //       'values': [{ 'value': this.storageService.getLanguage(), 'enabled': 1 }]
    //     }
    //   ],
    // };

    return this.http.post('/api/registerVisitor', reqParam, { headers: headers }).pipe(map(visitor => {
      console.log(visitor);
      return visitor;
    }));
  }

  updateVisitor(reqParam) {
    const headers = new HttpHeaders();
    // const reqParam = {
    //   'clientSecret': secret,
    //   'ip': ip,
    //   'countryCode': country,
    //   'place': 'ND', //TODO management with precise location and fallback on IP location
    //   'userCustomizationsDTO': [
    //     {
    //       'customizationCode': 'DEFAULT_LANGUAGE',
    //       'values': [{ 'value': this.storageService.getLanguage(), 'enabled': 1 }]
    //     }
    //   ],
    // };

    return this.http.post('/api/updateVisitor', reqParam, { headers: headers }).pipe(map(visitor => {
      console.log(visitor);
      return visitor;
    }));
  }

  updateUser(credentials) {
    const reqParam = {
      'id': credentials.id,
      'username': credentials.username,
      'firstName': credentials.firstName,
      'lastName': credentials.lastName,
      'password': credentials.password,
      'email': credentials.email,
      'gender': credentials.gender,
      'birthDate': credentials.birthDate,
      'country': {
        'code': credentials.country
      },
      'birthPlace': credentials.birthPlace,
      'contacts': [
        {
          'type': 'MOBILE',
          'number': credentials.phoneNumber
        }
      ]
    };
    return this.http.post('/api/updateUser', reqParam).pipe(map(user => {
      return user;
    }));
  }
  customizeData(credentials) {
    const reqParam = {
      'activeSport': credentials.customizeSport,
      'activeNews': credentials.customizeNews,
    };
    return this.http.post('/api/customizeData', reqParam).pipe(map(user => {
      return user;
    }));
  }


  confirmRegister(token) {
    return this.http.get(`/api/confirm?token=${token}`).pipe(map(user => {
      return user;
    }));
  }

  changePassword(token) {
    return this.http.get(`/api/change_password?token=${token}`).pipe(map(user => {
      return user;
    }));
  }

  resetPassword(password, username) {
    return this.http.get('/api/reset_password',
      {
        headers: this.headers,
        params: {
          'password': password,
          'username': username
        }
      }
    );
  }

  recover(email) {
    return this.http.get(`/api/recover_password?email=${email}`).pipe(map(email => {
      return email;
    }));
  }

  getLoggedUser(): Observable<any> {
    return this.user = this.http.get('/api/logged_user');
  }

  async updateLoggedUser() {
    console.log("update logged user");

    const data = await this.getLoggedUser().toPromise();
    console.log(data);
    this.storageService.setLoggedUser({
      username: data.username,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email
    });
    this.loggedUser = data;
    const username = 'username';
    if (!this.loggedUser[username]) {
      this.loggedUser = null;
    }
    this.change.emit(this.loggedUser);
  }

  logout() {
    const body = new URLSearchParams();
    return this.http.post('/logout', body.toString()).subscribe(response => {
      this.updateLoggedUser();
      return response;
    });
  }

  getUserCustomization(): Observable<any> {
    return this.http.get('/api/getUserCustomization');
  }

  activeCustomization(customization, value) {
    return this.http.get('/api/activeCustomization',
      {
        headers: this.headers,
        params: {
          'customization': customization,
          'value': value
        }
      }
    );
  }

  unactiveCustomization(customization, value) {
    return this.http.get('/api/unactiveCustomization',
      {
        headers: this.headers,
        params: {
          'customization': customization,
          'value': value
        }
      }
    );
  }

  public isAuthenticated(): boolean {
    const refreshToken = this.storageService.getToken();
    // Check whether the token is expired and return
    // true or false
    console.log(refreshToken);
    //return // TODO isTokenExpired(token);
    const isAuthenticated = this.storageService.getLoggedUser()?.username;
    console.log(isAuthenticated);
    return isAuthenticated;
  }

}
