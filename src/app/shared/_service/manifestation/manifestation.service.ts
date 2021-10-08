import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Manifestation } from '../../../model/manifestations.model';

@Injectable({
  providedIn: 'root'
})
export class ManifestationService {

  private headers = new HttpHeaders();
  public opts = [];


  constructor(private http: HttpClient) {
    this.headers.append('Content-Type', 'application/json');
  }

  getManifestationsAutocomplete(data: any) {
    return this.http.get<any>('api/getManifestationsAutocomplete',
      {
        headers: this.headers,
        params: {
          sport: data.sport,
          query: data.query
        }
      }
    ).pipe(tap(data => this.opts = data));
  }

  getManifestations(): Observable<Object> {
    return this.http.get('/api/getManifestations',
      {
        headers: this.headers,
        params: {}
      }
    );
  }

  saveManifestation(manifestation: Manifestation) {
    const headers = new HttpHeaders();
    return this.http.post('/api/saveManifestation', manifestation, { headers: headers }).pipe(map(t => {
      return t;
    }));
  }

  deleteManifestation(id: any): Observable<Object> {
    const headers = new HttpHeaders();
    return this.http.delete('/api/deleteManifestation/' + id,
      {
        headers: headers
      }
    );

  }

}
