import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MediaService {
  private headers = new HttpHeaders();
  public opts = [];


  constructor(
    private http: HttpClient
  ) { }

  getMasterMedia(page = 0, size = 25, name: string, country: string, type: string): Observable<Object> {
    const params = {
      page: page.toString(),
      size: size.toString(),
    };
    if (name) {
      params['name'] = name;
    }
    if (country && country !== 'ALL') {
      params['country'] = country;
    }
    if (type && type !== 'ALL') {
      params['type'] = type;
    }
    return this.http.get('/api/getMasterMedia',
      {
        headers: this.headers,
        params: params
      }
    );
  }

  getMedias(data: any) {
    return this.http.get<any>('api/getMediasAutocomplete',
      {
        headers: this.headers,
        params: {
          sport: data.sport,
          query: data.query
        }
      }
    ).pipe(tap(data => this.opts = data));
  }

  saveMedia(media: any): Observable<Object> {
    const headers = new HttpHeaders();
    return this.http.post('/api/saveMedia', media, { headers });
  }

  deleteMedia(id: number): Observable<Object> {
    const headers = new HttpHeaders();
    return this.http.delete(`/api/deleteMedia/${id}`, { headers });
  }

}
