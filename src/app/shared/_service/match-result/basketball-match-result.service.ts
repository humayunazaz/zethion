import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MatchResultService {

  constructor(private http: HttpClient) { }

  getBasketBallMatchResult(matchID: number) {

    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    return this.http.get('/api/getMatchResults',
      {
        headers: headers,
        params: {
          'id': '' + matchID
        }
      }
    );
  }
}
