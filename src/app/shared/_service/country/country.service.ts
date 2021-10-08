import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';

import { environment } from './../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CountryService {

  private headers = new HttpHeaders();


  constructor(private http: HttpClient) { }

  getCountries(val: string): Observable<Object> {
    return this.http.get('/api/getCountries',
      {
        headers: this.headers,
        params: {
          'country': val,
        }
      }
    );
  }

  getCountriesLanguages(): Observable<Object> {
    return this.http.get('/api/getCountriesLanguages',
      {
        headers: this.headers
      }
    );
  }

}
