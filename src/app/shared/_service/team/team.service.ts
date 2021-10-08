import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TeamService {


  private headers = new HttpHeaders();
  public opts = [];


  constructor(
    private http: HttpClient
  ) { }

  getTeams(data: any) {
    return this.http.get<any>('api/getTeamsAutocomplete',
      {
        headers: this.headers,
        params: {
          sport: data.sport,
          query: data.query
        }
      }
    ).pipe(tap(data => this.opts = data));
  }

  getFilterTeam(page = 0, size = 25, name: string, sport: string, country: string, status: string): Observable<Object> {

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
    if (country && country != '') {
      params['country'] = country;
    }
    if (status && status != '') {
      params['status'] = status;
    }
    return this.http.get('/api/getFilterTeams',
      {
        headers: this.headers,
        params: params
      }
    );
  }

  saveTeam(team: any): Observable<Object> {
    const headers = new HttpHeaders();
    return this.http.post('/api/saveTeam', team, { headers });
  }

  getTeam(teamId: number): Observable<Object> {
    return this.http.get('/api/getTeam',
      {
        headers: this.headers,
        params: {
          'id': teamId.toString()
        }
      }
    );
  }

  deleteTeam(id: any): Observable<Object> {
    const headers = new HttpHeaders();
    return this.http.delete('/api/deleteTeam/' + id,
      {
        headers: headers
      }
    );
  }

}