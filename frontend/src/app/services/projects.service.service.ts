import { Injectable } from '@angular/core';
import { Project } from '../interfaces/Project';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { HttpClient } from '@angular/common/http';
import BASE_URL from '../URL';
import { Credentials } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class ProjectsServiceService {

  projectSubject = new BehaviorSubject<Project[] | null>(null);
  projectSubjectObservable = this.projectSubject.asObservable()

  singleProjectSubject = new BehaviorSubject<Project | null>(null);
  singleProjectSubjectObservable = this.singleProjectSubject.asObservable();


  constructor(private http: HttpClient) { }

  fetchProjectsByTeam(credentials: Credentials, companyId: number, teamId: number | null) {
    return this.http.post<Project[]>(`${BASE_URL}/company/${companyId}/teams/${teamId}/projects`, credentials)
  }

  fetchUserProjects(credentials: Credentials, teamId: number) {
    return this.http.post<Project[]>(`${BASE_URL}/teams/${teamId}/projects`, credentials);
  }

  saveNewProject(companyId: number, teamId: number | null, projectRequest: any) {
    return this.http.post<Project>(`${BASE_URL}/company/${companyId}/teams/${teamId}/projects/create`, projectRequest)
  }

  updateProject(projectId: number | undefined, projectRequest: any) {
    return this.http.patch<Project>(`${BASE_URL}/projects/${projectId}`, projectRequest)
  }

}
