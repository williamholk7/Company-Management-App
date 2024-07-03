import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Announcement, Company, Credentials, FullUser } from '../interfaces';
import { AnnouncementsService } from '../services/announcements.service';
import { CompanyService } from '../services/company.service';
import { UserServiceService } from '../services/user-service.service';

@Component({
  selector: 'app-announcements',
  templateUrl: './announcements.component.html',
  styleUrls: ['./announcements.component.css']
})
export class AnnouncementsComponent implements OnInit {
  user: FullUser | null = null;
  credentials: Credentials | null = null;
  selectedCompany: Company | null = null;

  announcements: Announcement[] = []
  loading: boolean = false;
  error: string = '';
  showModal: boolean = false;

  announcementForm: FormGroup = new FormGroup({
    title: new FormControl<string>(''),
    message: new FormControl<string>(''),
  })

  constructor(private router: Router, private announcementService: AnnouncementsService, private userService: UserServiceService, private companyService: CompanyService) { }

  ngOnInit(): void {
    this.userService.userObservable.subscribe(user => this.user = user);


    if (!this.user) {
      this.router.navigate(['/'])
      return;
    }

    this.userService.credentialsObservable.subscribe(credentials => this.credentials = credentials);

    if (!this.user.admin) {
      // fetch the generic /announcements endpoint
      this.loading = true;
      this.announcementService.fetchUserAnnouncments(this.credentials!).subscribe({
        next: data => {
          this.announcements = data;
          this.loading = false;
          this.error = '';
          console.log(data);
        },
        error: err => {
          this.error = err.error.message;
          this.loading = false;
          console.log(err.error.message);
        }
      })
    } else {
      this.companyService.selectedCompanyObservable.subscribe(company => this.selectedCompany = company);
      // fetch the specific company announcements here;
      this.loading = true;
      console.log(this.credentials)
      this.announcementService.fetchAdminAnnouncements(this.credentials!, this.selectedCompany!.id).subscribe({
        next: data => {
          this.announcements = data;
          this.loading = false;
          this.error = '';
          console.log(data);
        },
        error: err => {
          console.log(err.error.message)
          this.loading = false;
          this.error = err.error.message;
        }
      })
    }
  }

  toggleModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  onSubmit() {
    const { title, message } = this.announcementForm.controls
    this.announcementService.postAnnouncement(this.credentials!, this.selectedCompany!.id, title.value, message.value).subscribe({
      next: data => {
        this.announcements.unshift(data);
        this.showModal = false;
      },
      error: err => {
        console.log(err)
      }
    })
  }
}
