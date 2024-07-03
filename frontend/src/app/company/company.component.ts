import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Company, FullUser } from '../interfaces';
import { CompanyService } from '../services/company.service';
import { UserServiceService } from '../services/user-service.service';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent implements OnInit {
  user: FullUser | null = null;
  companyForm: FormGroup = new FormGroup({
    company: new FormControl<Company | null>(null)
  })

  constructor(private companyService: CompanyService, private userService: UserServiceService, private router: Router) { }

  ngOnInit(): void {
    this.userService.userObservable.subscribe(user => this.user = user);

    if (!this.user) {
      this.router.navigate(['/'])
    } else if (!this.user.admin) {
      this.router.navigate(['/announcements'])
    }
  }

  onSubmit() {
    this.companyService.setSelectedCompany(this.companyForm.controls['company'].value)
    this.router.navigate(['/announcements'])
  }
}
