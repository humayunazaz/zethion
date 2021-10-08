import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PeopleService {
  private headers = new HttpHeaders();
  public opts = [];


  constructor(
    private http: HttpClient
  ) { }

  getPeople(data: any) {
    return this.http.get<any>('api/getPeopleAutocomplete',
      {
        headers: this.headers,
        params: {
          sport: data.sport,
          query: data.query
        }
      }
    ).pipe(tap(data => this.opts = data));
  }
}
