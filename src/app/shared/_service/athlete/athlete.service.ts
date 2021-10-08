import { EventEmitter, Injectable, Output } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { environment } from './../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AthleteService {

  private headers = new HttpHeaders();
  public opts = [];

  constructor(private http: HttpClient) { }

  setAthlete(athlete) {
    return this.http.post(
      '/api/setAthlete',
      athlete,
      { headers: this.headers }).pipe(map(response => {
        return response;
      }));
  }

  getAthletes(data: any) {
    return this.http.get<any>('api/getAthletesAutocomplete',
      {
        headers: this.headers,
        params: {
          sport: data.sport,
          query: data.query
        }
      }
    ).pipe(tap(data => this.opts = data));
  }

  getFilterAthlete(page = 0, size = 25, name: string, gender: string, sport: string, country: string, type: string, status: string): Observable<Object> {

    const params = {
      'page': page.toString(),
      'size': size.toString()
    };
    if (name !== null && name != '') {
      params['name'] = name
    }
    if (sport && sport != '') {
      params['sport'] = sport;
    }
    if (gender && gender != '') {
      params['gender'] = gender;
    }
    if (country && country != '') {
      params['country'] = country;
    }
    if (status && status != '') {
      params['status'] = status;
    }
    return this.http.get('/api/getFilterAthletes',
      {
        headers: this.headers,
        params: params
      }
    );
  }

  saveAthlete(athlete: any): Observable<Object> {
    const headers = new HttpHeaders();
    return this.http.post('/api/saveAthlete', athlete, { headers });
  }

  getAthlete(athleteId: number): Observable<Object> {
    return this.http.get('/api/getAthlete',
      {
        headers: this.headers,
        params: {
          'id': athleteId.toString()
        }
      }
    );
  }

  deleteAthlete(id: any): Observable<Object> {
    const headers = new HttpHeaders();
    return this.http.delete('/api/deleteAthlete/' + id,
      {
        headers: headers
      }
    );
  }

}
