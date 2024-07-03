import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { UserServiceService } from '../services/user-service.service';
import { FullUser } from '../interfaces';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  user: FullUser | null = null;
  error: string = '';

  constructor(private router: Router, private userService: UserServiceService) { }

  ngOnInit(): void {
    this.userService.userObservable.subscribe(user => this.user = user)
  }

  loginForm: FormGroup = new FormGroup({
    username: new FormControl<string>(''),
    password: new FormControl<string>(''),
  })

  onSubmit() {
    const username = this.loginForm.controls['username'].value
    const password = this.loginForm.controls['password'].value
    this.userService.login(username, password).subscribe({
      next: (data: FullUser) => {
        this.userService.setUser(data);
        this.userService.setCredentials({ username, password })
        console.log(this.user)
        this.router.navigate(['/company'])
      },
      error: (error) => {
        this.error = error.error.message;
        console.log(error.error.message)
      }
    })
  }
}
