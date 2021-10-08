import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { getClusters } from './translate.stub';
import { Translation } from './translate.model';

@Injectable({
  providedIn: 'root'
})
export class TranslateService {

  private headers = new HttpHeaders();

  constructor(private http: HttpClient) {
    this.headers.append('Content-Type', 'application/json');
  }
getFilterTranslations(code: string, cluster: string, languages: string[], page = 0, size = 25): Observable<Object> {

    const params = {
      'page': page.toString(),
      'size': size.toString()
    };


    if (code !== null && code != '') {
      params['code'] = code.toString();
    }

    if (cluster && cluster != '') {
      params['cluster'] = cluster.toString();
    }

    if (languages && languages.length > 0) {
      params['languages'] = languages.toString();
    }
    return this.http.get('/api/getFilterTranslations',
      {
        headers: this.headers,
        params: params
      }
    );
  }

  getClusterTranslations(): Observable<Object> {
    const params = {};
    return this.http.get('/api/getClusterTranslations',
      {
        headers: this.headers,
        params: params
      }
    );
  }


  getClustersStub() {
    return of(getClusters);
  }

  saveTranslation(translation: Translation) {
    const headers = new HttpHeaders();
    return this.http.post('/api/saveTranslation', translation, { headers: headers }).pipe(map(t => {
      return t;
    }));
  }

}
