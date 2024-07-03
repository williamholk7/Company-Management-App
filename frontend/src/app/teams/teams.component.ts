import { Component, OnInit } from '@angular/core';
import { Team } from '../interfaces/Team';
import { UserServiceService } from '../services/user-service.service';
import { FullUser } from '../interfaces/User';
import { Router } from '@angular/router';
import { TeamServiceService } from '../services/team-service.service';
import { Credentials } from '../interfaces/Credentials';
import { CompanyService } from '../services/company.service';
import { Company } from '../interfaces/Company';
import { OverlayServiceService } from '../services/overlay.service.service';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.css']
})
export class TeamsComponent implements OnInit {
  user: FullUser | null = null;
  teams: Team[] = [];
  credentials: Credentials | null = null;
  loading: boolean = false;
  error: string = '';
  company: Company | null = null;
  selectedTeam: Team | undefined = undefined;
  newTeam: Team | undefined = undefined;
  isAdmin: boolean = false;

  constructor(private userService: UserServiceService,
    private router: Router,
    private teamService: TeamServiceService,
    private companyService: CompanyService,
    private overlayService: OverlayServiceService) {

  }


  ngOnInit(): void {
    this.userService.userObservable.subscribe(user => this.user = user);

    if (!this.user) {
      this.router.navigate(['/'])
      return;
    }

    this.userService.credentialsObservable.subscribe(credentials => this.credentials = credentials);


    if (this.user.admin) {
      //fetch teams for admin
      this.isAdmin = true;
      this.companyService.selectedCompanyObservable.subscribe(comp => this.company = comp)
      this.loading = true;
      this.teamService.getAdminTeams(this.company?.id, this.credentials!).subscribe({
        next: data => {
          console.log(data);
          this.teams = data;
          this.loading = false;
          this.error = '';
          this.sortTeamsByName()
        },
        error: err => {
          this.error = err.error.message;
          this.loading = false;
          console.log(err);
        }
      })
    } else {
      //fetch For non-admin
      this.loading = true;
      this.teamService.getNonAdminTeams(this.credentials!).subscribe({
        next: data => {
          this.teams = data;
          this.loading = false;
          this.error = '';
          this.sortTeamsByName()
        },
        error: err => {
          this.error = err.error.message;
          this.loading = false;
          console.log(err);
        }
      })
    }
  }

  createNewTeam() {
    this.overlayService.showOverlay();
  }

  onTeamCreated(newTeam: Team) {
    if (newTeam) {
      console.log("New ID" + newTeam.id)
      this.teams.push(newTeam);
    }
  }

  onTeamUpdated(updatedTeam: Team) {
    const index = this.teams.findIndex(team => team.id === updatedTeam.id)
    this.teams[index] = updatedTeam
  }

  onTeamDeleted(deletedTeam: Team) {
    const index = this.teams.findIndex(team => team.id === deletedTeam.id)
    this.teams.splice(index, 1)
  }

  openEditOverlay(team: Team) {
    this.overlayService.showOverlay();
    if (team) {
      this.teamService.teamSubject.next(team);
    } else {
      console.log("Error selecting a team from edit button")
    }
  }

  sortTeamsByName() {
    this.teams.sort((a, b) => {
      if (a.name && b.name) {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });
  }

  viewTeamProjects(team: Team) {
    console.log("Team: ", team);
    if (team) {
      this.teamService.teamSubject.next(team); // Assuming teamSubject is defined in TeamService
      this.router.navigate(['/projects']);
    } else {
      console.log("There was an error navigating to team projects");
    }
  }
}
