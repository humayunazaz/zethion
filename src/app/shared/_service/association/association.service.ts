import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AssociationService {
  private headers = new HttpHeaders();
  public opts = [];


  constructor(
    private http: HttpClient
  ) { }

  getAssociations(data: any) {
    return this.http.get<any>('api/getAssociationsAutocomplete',
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
