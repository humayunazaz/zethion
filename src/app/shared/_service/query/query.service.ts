import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { tap } from 'rxjs/operators';

import { StorageService } from './../storage/storage.service';

@Injectable({
  providedIn: 'root'
})
export class QueryService {


  private headers = new HttpHeaders();
  public opts = [];


  constructor(
    private http: HttpClient,
    private storageService: StorageService) { }

  getQueries(val: string) {
    return this.http.get<any>('/api/getNewsQueryAutocomplete',
        {
          headers: this.headers,
          params: {
            'query': val,
            'language': this.storageService.getLanguage()
          }
        }
      ).pipe(tap(data => this.opts = data));
  }

}
