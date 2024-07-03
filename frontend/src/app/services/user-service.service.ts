import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { BasicUser, Credentials, FullUser, Profile } from '../interfaces';
import { HttpClient } from '@angular/common/http';
import BASE_URL from '../URL';

@Injectable({
  providedIn: 'root',
})
export class UserServiceService {
  userSubject = new BehaviorSubject<FullUser | null>(null);
  userObservable = this.userSubject.asObservable();

  credentialSubject = new BehaviorSubject<Credentials | null>(null);
  credentialsObservable = this.credentialSubject.asObservable();

  constructor(private http: HttpClient) {}

  setUser(user: FullUser) {
    this.userSubject.next(user);
  }

  setCredentials(credentials: Credentials) {
    this.credentialSubject.next(credentials);
  }

  login(username: string, password: string): Observable<FullUser> {
    return this.http.post<FullUser>(`${BASE_URL}/users/login`, {
      username,
      password,
    });
  }

  logout() {
    this.userSubject.next(null);
    this.credentialSubject.next(null);
  }

  getUser() {
    return this.userSubject.value;
  }

  getCredentials() {
    return this.credentialSubject.value;
  }

  getCompanyUsers(credentials: Credentials, companyId: number) {
    return this.http.post<FullUser[]>(
      `${BASE_URL}/company/${companyId}/users`,
      credentials
    );
  }

  createNewUser(
    profile: Profile,
    credentials: Credentials,
    adminCredentials: Credentials,
    admin: boolean,
    compoanyId: number
  ) {
    return this.http.post<FullUser>(
      `${BASE_URL}/company/${compoanyId}/users/create`,
      { profile, credentials, adminCredentials, admin }
    );
  }

  deleteUser(id: number, credentials: Credentials) {
    return this.http.request<BasicUser>('delete', `${BASE_URL}/users/${id}`, {
      body: credentials,
    });
  }
}
