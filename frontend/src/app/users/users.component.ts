import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Company, Credentials, FullUser, Profile } from '../interfaces';
import { CompanyService } from '../services/company.service';
import { UserServiceService } from '../services/user-service.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  user: FullUser | null = null
  credentials: Credentials | null = null;
  selectedCompany: Company | null = null;
  users: FullUser[] = []

  error: string = ''
  loading: boolean = false;
  showAddModal: boolean = false;

  addUserForm = new FormGroup({
    username: new FormControl<string>(''),
    firstName: new FormControl<string>(''),
    lastName: new FormControl<string>(''),
    email: new FormControl<string>(''),
    phone: new FormControl<string>(''),
    password: new FormControl<string>(''),
    confirmPassword: new FormControl<string>(''),
    admin: new FormControl<boolean>(false),
  })

  constructor(private router: Router, private userService: UserServiceService, private companyService: CompanyService) { }

  ngOnInit(): void {
    this.userService.userObservable.subscribe(user => this.user = user);
    if (!this.user || !this.user.admin) {
      this.router.navigate(['/'])
      return;
    }

    this.userService.credentialsObservable.subscribe(credentials => this.credentials = credentials);

    this.companyService.selectedCompanyObservable.subscribe(company => this.selectedCompany = company);

    if (this.credentials && this.selectedCompany) {
      this.fetchUsers(this.credentials, this.selectedCompany.id)
    }
  }

  fetchUsers(credentials: Credentials, companyId: number) {
    this.loading = true;
    this.userService.getCompanyUsers(credentials, companyId).subscribe({
      next: data => {
        console.log(data);
        this.users = data;
        this.error = '';
        this.loading = false;
      },
      error: err => {
        console.log(err);
        this.error = err.error.message
        this.loading = false;
      }
    })
  }

  toggleShowAddModal() {
    this.showAddModal = true;
  }

  closeAddModal() {
    this.showAddModal = false;
  }


  addUser() {
    const { username, firstName, lastName, email, phone, password, confirmPassword, admin } = this.addUserForm.controls;
    if (password.value !== confirmPassword.value) {
      // TODO: SHOW ERROR
      return
    }
    const credentials: Credentials = { username: username.value!, password: password.value! }
    const adminCredentials = this.credentials
    const profile: Profile = { firstName: firstName.value!, lastName: lastName.value!, email: email.value!, phone: phone.value! }

    this.userService.createNewUser(profile, credentials, adminCredentials!, admin.value!, this.selectedCompany!.id).subscribe({
      next: data => {
        console.log(data);
        this.users.push(data);
        this.showAddModal = false;
      },
      error: err => {
        console.log(err);
      }
    })
  }

  deleteUser(id: number) {
    let userToDelete = this.users.find(user => user.id == id)
    if(!userToDelete) {
      alert("Failed to delete user")
      return
    }
    if(confirm('Are you sure you want to delete '+userToDelete.profile.firstName+" "+userToDelete.profile.lastName+"?")) {
      this.userService.deleteUser(id, this.credentials!).subscribe({
        next: data => {
          console.log(data);
          this.users = this.users.filter(user => user.id !== id);
        },
        error: err => {
          console.log(err);
        }
      })
    }
  }
}
