import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Sport } from '../../../match/match.component';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TournamentsService {

  private headers = new HttpHeaders();

  constructor(private http: HttpClient) {
    this.headers.append('Content-Type', 'application/json');
  }

  getTournaments(sport: string, limitDate: string): Observable<Object> {
    return this.http.get('/api/getTournaments',
      {
        headers: this.headers,
        params: {
          'sport': sport,
          'limitDate': limitDate
        }
      }
    );
  }

  getFilterTournaments(page = 0, size = 25, competitionName: string, sport: string, country: string, startingYear: number): Observable<Object> {

    const params = {
      'page': page.toString(),
      'size': size.toString()
    };
    if (competitionName !== null && competitionName != '') {
      params['competitionName'] = competitionName.replace(" ", "_");
    }
    if (sport && sport != '') {
      params['sport'] = sport;
    }
    if (country && country != '') {
      params['country'] = country;
    }
    if (startingYear) {
      params['startingYear'] = startingYear.toString();
    }
    return this.http.get('/api/getFilterTournaments',
      {
        headers: this.headers,
        params: params
      }
    );
  }

  getCompetitions(sport: Sport): Observable<any> {
    return this.http.get('/api/getCompetitions',
      {
        headers: this.headers,
        params: {
          'sport': sport.sport,
        }
      }
    );
  }

  getLastTournament(sport: string): Observable<Object> {

    return this.http.get('/api/resultsLastTournament',
      {
        headers: this.headers,
        params: {
          'sport': sport
        }
      }
    );
  }

  getTournamentStandings(tournamentId: number): Observable<Object> {

    return this.http.get('/api/getTournamentStandings',
      {
        headers: this.headers,
        params: {
          'id': tournamentId.toString()
        }
      }
    );
  }

  getTournament(tournamentId: number): Observable<Object> {

    return this.http.get('/api/getTournament',
      {
        headers: this.headers,
        params: {
          'id': tournamentId.toString()
        }
      }
    );
  }

  saveTournament(tournament: any): Observable<Object> {
    const headers = new HttpHeaders();
    return this.http.post('/api/saveTournament', tournament, { headers });
  }

  deleteTournament(id: number): Observable<Object> {
    const headers = new HttpHeaders();
    return this.http.delete(`/api/deleteTournament/${id}`, { headers });
  }

}
