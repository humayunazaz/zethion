import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';



@Injectable({
  providedIn: 'root'
})
export class TagsService {

  private headers = new HttpHeaders();

  constructor(private http: HttpClient) {
    this.headers.append('Content-Type', 'application/json');
  }


  getMasterTags(page = 0, size = 25, keyword: string, type: string): Observable<Object> {
    const params = {
      page: page.toString(),
      size: size.toString(),
    };
    if (keyword) {
      params['keyword'] = keyword;
    }
    if (type && type !== 'ALL') {
      params['type'] = type;
    }
    return this.http.get('/api/getMasterTags',
      {
        headers: this.headers,
        params: params
      }
    );
  }
  
  getSubjectTags(type: string, id: number) {
    const params = {
      type: type,
      id: id.toString()
    };
    return this.http.get('/api/getSubjectTags',
      {
        headers: this.headers,
        params: params
      }
    );
  }

  saveTag(tag: any): Observable<Object> {
    const headers = new HttpHeaders();
    return this.http.post('/api/saveTags', tag, { headers });
  }

  deleteTag(id: number): Observable<Object> {
    const headers = new HttpHeaders();
    return this.http.delete(`/api/deleteTag/${id}`, { headers });
  }

}
