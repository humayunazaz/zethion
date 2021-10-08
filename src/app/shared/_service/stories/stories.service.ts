import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class StoriesService {

  private headers = new HttpHeaders();
  hasShortCutImages = new BehaviorSubject(false);
  mouseScrollEvent = new BehaviorSubject(null);


  constructor(
    private http: HttpClient
  ) {
    this.headers.append('Content-Type', 'application/json');
  }

  getStories(languages: string[], page: number, size: number, sports: string[], lastId: number, countries: string[], tags: string[], query: string, lastStoriesAdsId: number[]): Observable<any> {

    const params = {
      languages: languages.join(','),
      page: page.toString(),
      size: size.toString()
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
    //if (lastStoriesAdsId && lastStoriesAdsId.length) {
    //  params['excludeAds'] = lastStoriesAdsId.join(',');
    //}
    //params['getAd'] = 1;
    return this.http.get<any>('/api/getStories',
      {
        headers: this.headers,
        params: params
      }
    );
  }

  selectStory(storyId: string): Observable<Object> {
    return this.http.get('/api/selectStory',
      {
        headers: this.headers,
        params: {
          'storyId': storyId,
        }
      }
    );
  }

  rateStory(storyId: string, rate: string): Observable<string> {
    return this.http.get('/api/rateStory',
      {
        headers: this.headers,
        params: {
          'storyId': storyId,
          'rate': rate
        },
        responseType: 'text'
      }
    );
  }


  getSingleStory(storyId: string) {
    return this.http.get<any>(`/api/getStory?id=${storyId}`, {
      headers: this.headers
    });
  }

  getRelatedStories(storyId: string) {
    return this.http.get<any>(`/api/getRelatedStories?id=${storyId}`, {
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
    return this.http.get<Object[]>('/api/getTrendTagsStory',
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
