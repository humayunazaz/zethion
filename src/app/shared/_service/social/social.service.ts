import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { Social, SocialPageType } from "../../../model/social.component.models";
import { map } from "rxjs/operators";
import { ALL } from "../../../model/sports.model";

@Injectable({
  providedIn: 'root'
})
export class SocialService {

  private headers = new HttpHeaders();

  constructor(private http: HttpClient) {
    this.headers.append('Content-Type', 'application/json');
  }

  getSocialMaster(
    pageType: SocialPageType, socials: Social[], name: string,
    sport: string, page: number, size: number, id?: number[]): Observable<Object> {
    const params = {
      'type': pageType.toString(),
      'page': page.toString(),
      'size': size.toString()
    };
    if (socials !== null) {
      params['socials'] = socials.toString();
    }
    if (name) {
      params['name'] = name;
    }
    if (sport && sport !== ALL.sport) {
      params['sport'] = sport;
    }
    if (id && id.length) {
      params['id'] = id.join(',');
    }

    return this.http.get('/api/getSocialMaster',
      {
        headers: this.headers,
        params: params
      }
    );
  }

  getPosts(
    social: Social,
    countries: string[],
    tags: string[],
    query: string,
    page = 0,
    size = 20,
    sports: string[],
    languages: string[],
    lastId: number,
    lastSocialAdsId: number[]
  ) {
    const params = {
      social,
      countries: countries.toString(),
      page: page.toString(),
      size: size.toString(),
      languages: languages.join(',')
    };
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
    //if (lastSocialAdsId && lastSocialAdsId.length) {
    //  params['excludeAds'] = lastSocialAdsId.join(',');
    //}
    //params['getAd'] = 1;
    return this.http.get<object[]>('/api/getPosts', {
      headers: this.headers,
      params: params
    });
  }

  getPostById(id: string) {
    return this.http.get('/api/getPostById', {
      headers: this.headers,
      params: { id }
    });
  }

  selectPost(id: string): Observable<Object> {
    return this.http.get('/api/selectPost',
      {
        headers: this.headers,
        params: {
          'postId': id,
        }
      }
    );
  }

  tryAutomaticPagesSetting(item: any) {
    const body = new URLSearchParams();
    const postURL = "/api/setMasterSocial/" + item.type + "/" + item.id;
    return this.http.post(postURL, body.toString(), { headers: this.headers }).subscribe(response => {
      return response;
    }, error => {
      console.log(error);
      return error;
    });
  }

  getInstagramAPI(url: string) {
    return this.http.get(url, {
      headers: this.headers,
      params: {
        '__a': '1'
      }
    });
  }

  getTwitterProfilePicture(url: string) {
    if (!url.includes('https') && !url.includes('http')) {
      url = 'https://' + url;
    }
    return this.http.get('/api/twitterProfilePicture', {
      headers: this.headers,
      params: {
        url,
      },
      responseType: 'text'
    });
  }

  getSocials(
    pageType: string, page: number, size: number, id: number[]): Observable<Object> {
    const params = {
      'type': pageType.toString(),
      'page': page.toString(),
      'size': size.toString()
    };
    if (id && id.length) {
      params['id'] = id.join(',');
    }
    return this.http.get('/api/getSocialMaster',
      {
        headers: this.headers,
        params: params
      }
    );
  }

}
