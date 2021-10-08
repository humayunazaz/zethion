import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EditionService {

  private headers = new HttpHeaders();


  constructor(private http: HttpClient) { }

  getFilterEditions(page = 0, size = 25, competitionName: string, sport: string, year: number): Observable<Object> {

    const params = {
      'page': page.toString(),
      'size': size.toString()
    };
    if (competitionName !== null && competitionName != '') {
      params['competitionName'] = competitionName.replace(" ", "_");
    }
    if (sport && sport != '') {
      params['sport'] = sport;
    }
    if (year) {
      params['year'] = year.toString();
    }
    return this.http.get('/api/getFilterEditions',
      {
        headers: this.headers,
        params: params
      }
    );
  }

  getEdition(editionId: number): Observable<Object> {

    return this.http.get('/api/getEdition',
      {
        headers: this.headers,
        params: {
          'id': editionId.toString()
        }
      }
    );
  }

  saveEdition(edition: any): Observable<Object> {
    const headers = new HttpHeaders();
    return this.http.post('/api/saveEdition', edition, { headers });
  }

  deleteEdition(id: number): Observable<Object> {
    const headers = new HttpHeaders();
    return this.http.delete(`/api/deleteEdition/${id}`, { headers });
  }

}