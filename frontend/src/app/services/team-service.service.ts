import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Team } from '../interfaces';
import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http';
import BASE_URL from '../URL';
import { Credentials } from '../interfaces/Credentials';

@Injectable({
  providedIn: 'root'
})
export class TeamServiceService {

  teamArraySubject = new BehaviorSubject<Team[] | undefined>(undefined);
  teamArraySubjectObservable = this.teamArraySubject.asObservable()
  teamSubject = new BehaviorSubject<Team | undefined>(undefined);
  teamSubjectObservable = this.teamSubject.asObservable()
  BASE_URL: any;

  constructor(private http: HttpClient) { }

  getNonAdminTeams(credentials: Credentials) {
    return this.http.post<Team[]>(`${BASE_URL}/teams/`, credentials)
  }

  getAdminTeams(companyId: number | undefined, credentials: Credentials) {
    return this.http.post<Team[]>(`${BASE_URL}/company/${companyId}/teams`, credentials)
  }

  createNewTeam(companyId: number | undefined, team: Team) {
    return this.http.post<Team[]>(`${BASE_URL}/company/${companyId}/teams/create`, team)
  }

  deleteTeam(id: number | null, credentials: Credentials): Observable<Team> {
    const url = `${BASE_URL}/teams/${id}`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.delete<Team>(url, { headers, body: credentials })
  }

  updateTeam(id: number | null, teamRequestDto: any): Observable<Team> {
    const url = `${BASE_URL}/teams/${id}`;
    return this.http.patch<Team>(url, teamRequestDto);
  }

  getProjectsCount(id: number) {
    return this.http.get<number>(`${BASE_URL}/teams/${id}/count`)
  }

}
