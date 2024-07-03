import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { BasicUser, Company, Credentials } from '../interfaces';
import BASE_URL from '../URL';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  selectedCompanySubject = new BehaviorSubject<Company | null>(null);
  selectedCompanyObservable = this.selectedCompanySubject.asObservable();

  constructor(private http: HttpClient) { }

  setSelectedCompany(company: Company) {
    this.selectedCompanySubject.next(company);
  }

  getSelectedCompany() {
    return this.selectedCompanySubject.value
  }

  getUsersByCompany(companyId: number | undefined, credentials: Credentials) {
    return this.http.post<BasicUser[]>(`${BASE_URL}/company/${companyId}/users`, credentials)
  }
}


