import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Announcement, Credentials } from '../interfaces'
import BASE_URL from '../URL';

@Injectable({
  providedIn: 'root'
})
export class AnnouncementsService {

  constructor(private http: HttpClient) { }

  fetchUserAnnouncments(credentials: Credentials) {
    return this.http.post<Announcement[]>(`${BASE_URL}/announcements`, credentials)
  }

  fetchAdminAnnouncements(credentials: Credentials, companyId: number) {
    return this.http.post<Announcement[]>(`${BASE_URL}/company/${companyId}/announcements`, credentials)
  }

  postAnnouncement(credentials: Credentials, companyId: number, title: string, message: string) {
    return this.http.post<Announcement>(`${BASE_URL}/company/${companyId}/announcements/create`, { title, message, credentials })
  }
}
