import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class CuriositiesService {

  private headers = new HttpHeaders();
  hasShortCutImages = new BehaviorSubject(false);
  mouseScrollEvent = new BehaviorSubject(null);


  constructor(
    private http: HttpClient
  ) {
    this.headers.append('Content-Type', 'application/json');
  }

  getCuriosities(languages: string[], page: number, size: number, sports: string[], lastId: number, countries: string[], tags: string[], query: string, lastCuriositiesAdsId: number[]): Observable<any> {

    const params = {
      languages: languages.join(','),
      page: page.toString(),
      size: size.toString(),
      type: 'OWN_NEWS'
    };
    if (countries) {
      params['countries'] = countries.toString().toUpperCase();
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
    //if (lastCuriositiesAdsId && lastCuriositiesAdsId.length) {
    //  params['excludeAds'] = lastCuriositiesAdsId.join(',');
    //}
    //params['getAd'] = 1;
    return this.http.get<any>('/api/getNews',
      {
        headers: this.headers,
        params: params
      }
    );
  }

  selectCuriosity(curiosityId: string): Observable<Object> {
    return this.http.get('/api/selectNew',
      {
        headers: this.headers,
        params: {
          'newId': curiosityId,
        }
      }
    );
  }

  getSingleCuriosity(curiosityId: string) {
    return this.http.get<any>(`/api/getNew?id=${curiosityId}`, {
      headers: this.headers
    });
  }

  getRelatedCuriosities(storyId: string) {
    return this.http.get<any>(`/api/getRelatedCuriosities?id=${storyId}`, {
      headers: this.headers
    });
  }

  getShortcutImgs(languages: string[], countries?: string[]): Observable<Object[]> {

    const language = languages?.length ? languages.join(',') : null;
    let country = countries?.length ? countries.join(',') : null;

    const params = {
      'languages': language,
      'countries': country
    };
    return this.http.get<Object[]>('/api/getTrendTags',
      {
        headers: this.headers,
        params: params
      }
    );
  }

  updateShortCutImagesStatus(status: boolean) {
    this.hasShortCutImages.next(status);
  }

  getRandomAds(country: string) {
    return this.http.get<any>(`/api/getRandAdsByHtml?country=${country}&sport=MULTISPORTS`, {
      headers: this.headers
    });
  }

}
