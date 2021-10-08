import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Competition } from '../../../model/competions.model';

@Injectable({
  providedIn: 'root'
})
export class CompetitionService {

  private headers = new HttpHeaders();

  constructor(private http: HttpClient) {
    this.headers.append('Content-Type', 'application/json');
  }

  getFilterCompetitions(page = 0, size = 25,  competitionName: string, sport:string, country: string, competitionType: string[],  gender: string[]): Observable<Object> {

    const params = {
      'page': page.toString(),
      'size': size.toString()
    };
    if (competitionName !== null && competitionName != '') {
      params['competitionName'] = competitionName
    }
    if (sport && sport != '') {
      params['sport'] = sport;
    }
    if (country && country != '') {
      params['country'] = country;
    }
    if (competitionType && competitionType.length > 0) {
      params['competitionType'] = competitionType.toString();
    }

    if (gender && gender.length > 0) {
      params['gender'] = gender.toString();
    }
    return this.http.get('/api/getFilterCompetitions',
      {
        headers: this.headers,
        params: params
      }
    );
  }


  saveCompetition(competition: Competition) {
    const headers = new HttpHeaders();
    return this.http.post('/api/saveCompetition', competition, { headers: headers }).pipe(map(t => {
      return t;
    }));
  }

  deleteCompetition(id: any):Observable<Object>{
    const headers = new HttpHeaders();
    return this.http.delete('/api/deleteCompetition/'+id,
    {
      headers: headers
    }
  );

  }

}
