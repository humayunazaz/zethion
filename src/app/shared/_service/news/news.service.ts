import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class NewsService {
  hasShortCutImages = new BehaviorSubject(false);
  mouseScrollEvent = new BehaviorSubject(null);
  private headers = new HttpHeaders();
  socialType = new BehaviorSubject<string>('zt');

  constructor(private http: HttpClient) {
    this.headers.append('Content-Type', 'application/json');
  }

  getNews(languages: string[], countries: string[], type: string, tags: string[],
    query: string, page: number, size: number, sports: string[], lastId: number, lastNewsAdsId: number[]): Observable<any> {

    const params = {
      languages: languages.join(','),
      page: page.toString(),
      size: size.toString()
    };
    if (countries) {
      params['countries'] = countries.toString().toUpperCase();
    }
    if (type) {
      params['type'] = type;
    }
    if (tags) {
      params['tags'] = tags.join(',');
    }
    if (query) {
      params['query'] = query;
    }
    if (sports) {
      params['sports'] = sports.join(',');
    }
    if (lastId) {
      params['lastID'] = lastId;
    }
    //if (lastNewsAdsId && lastNewsAdsId.length) {
    //  params['excludeAds'] = lastNewsAdsId.join(',');
    //}
    //params['getAd'] = 1;
    return this.http.get<any>('/api/getNews',
      {
        headers: this.headers,
        params: params
      }
    );
  }

  getFilterNews(page = 0, size = 25, sport: string, country: string): Observable<Object> {
    const params = {
      'page': page.toString(),
      'size': size.toString(),
      type: 'OWN_NEWS'
    };
    if (sport && sport != '') {
      params['sport'] = sport;
    }
    if (country && country != '') {
      params['countries'] = country;
    }
    return this.http.get('/api/getNews',
      {
        headers: this.headers,
        params: params
      }
    );
  }

  getSingleNews(newsId: string) {
    return this.http.get<any>(`/api/getNew?id=${newsId}`, {
      headers: this.headers
    });
  }

  getShortcutImgs(languages: string[], type?: string, countries?: string[]): Observable<Object[]> {

    const language = languages?.length ? languages.join(',') : null;
    let country = countries?.length ? countries.join(',') : null;

    const params = {
      'languages': language,
      'countries': country
    };
    if (type === 'zt') {
      return this.http.get<Object[]>('/api/getTrendTags',
        {
          headers: this.headers,
          params: params
        }
      );
    }
    return this.http.get<Object[]>('/api/getTrendTagsPost',
      {
        headers: this.headers,
        params: params
      }
    );
  }

  saveNew(news: any): Observable<Object> {
    const headers = new HttpHeaders();
    return this.http.post('/api/saveNew', news, { headers });
  }

  selectNew(id: string): Observable<Object> {
    return this.http.get('/api/selectNew',
      {
        headers: this.headers,
        params: {
          'newId': id,
        }
      }
    );
  }

  deleteNew(id: number): Observable<Object> {
    const headers = new HttpHeaders();
    return this.http.delete('/api/deleteNew/' + id,
      {
        headers: headers
      }
    );
  }
  updateShortCutImagesStatus(status: boolean) {
    this.hasShortCutImages.next(status);
  }

  updateSocialType(type: string) {
    this.socialType.next(type);
  }
}


