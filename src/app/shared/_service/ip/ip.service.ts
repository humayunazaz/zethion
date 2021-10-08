import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class IpService {

  private headers = new HttpHeaders();

  constructor(private http: HttpClient) {
    this.headers.append('Content-Type', 'application/json');
  }

  public getIPAddress(): Observable<Object> {
    return this.http.get("https://api.ipify.org",
      {
        headers: this.headers,
        params: {
          'format': 'json'
        }
      }
    );
  }

  public getCountry(ip: string): Observable<Object> {
    return this.http.get('/api/getCountryByIP',
      {
        headers: this.headers,
        params: {
          'IP': ip,
        }
      }
    );
  }
}
