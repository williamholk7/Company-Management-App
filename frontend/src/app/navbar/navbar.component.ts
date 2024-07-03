import { Component, OnInit } from '@angular/core';
import { FullUser } from '../interfaces/User';
import { UserServiceService } from '../services/user-service.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit{
  user: FullUser | null = null;
  userIsAdmin : boolean = false;
  showMenu : boolean = false;

  constructor(private userService: UserServiceService, private router : Router) {

  }

  ngOnInit(): void {
    this.userService.userObservable.subscribe(user => this.user = user);
    if(this.user?.admin) {
      this.userIsAdmin = true;
    }
  }

  logout() {
    this.userService.logout();
    this.router.navigate(['/'])
  }

  toggleMenu() {
    this.showMenu = !this.showMenu;
  }

}
