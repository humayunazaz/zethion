import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ResultsService {

  constructor(private http: HttpClient) { }

  getResultsByMatchDate(
    sport: string,
    matchDate: string,
    page: number,
    size: number): Observable<Object> {

    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    return this.http.get('/api/results',
      {
        headers: headers,
        params: {
          sport,
          matchDate,
          page: '' + page,
          size: '' + size
        }
      }
    );
  }

  getResultsByTournament(sport: string, id: number): Observable<Object> {

    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    return this.http.get('/api/tournamentResults',
      {
        headers: headers,
        params: {
          'sport': sport,
          'id': '' + id
        }
      }
    );
  }



}

