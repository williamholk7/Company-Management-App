import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { BasicUser, Credentials, FullUser, Team } from 'src/app/interfaces';
import { CompanyService } from 'src/app/services/company.service';
import { OverlayServiceService } from 'src/app/services/overlay.service.service';
import { UserServiceService } from 'src/app/services/user-service.service';
import { TeamServiceService } from '../../services/team-service.service';

@Component({
  selector: 'app-new-team-overlay',
  templateUrl: './new-team-overlay.component.html',
  styleUrls: ['./new-team-overlay.component.css']
})
export class NewTeamOverlayComponent {
  isVisible = false;
  id: number = 0;
  name: string = ''
  description: string = ''
  availableUsers: BasicUser[] = [];
  selectedUsers: BasicUser[] = [];
  companyId: number | undefined = undefined;
  credentials: Credentials | null = null;
  user: FullUser | null = null;
  error: string = ''
  loading: boolean = false;
  selectedTeam: Team | undefined = undefined;

  @Output() teamCreated: EventEmitter<Team> = new EventEmitter<Team>();
  @Output() teamUpdated: EventEmitter<Team> = new EventEmitter<Team>();
  @Output() teamDeleted: EventEmitter<Team> = new EventEmitter<Team>();

  constructor(private overlayService: OverlayServiceService,
    private companyService: CompanyService,
    private userService: UserServiceService,
    private router: Router,
    private teamService: TeamServiceService) { }

  ngOnInit(): void {
    this.userService.userObservable.subscribe(user => this.user = user);

    this.userService.credentialsObservable.subscribe(credentials => this.credentials = credentials);
    console.log("cred" + this.credentials)

    if (!this.user || !this.credentials) {
      this.router.navigate(['/'])
      return;
    }

    this.teamService.teamSubjectObservable.subscribe(team => {
      this.selectedTeam = team;
      if (this.selectedTeam) {
        if(this.selectedTeam.id){
           this.id = this.selectedTeam.id
        }

        this.name = this.selectedTeam.name || '';
        this.description = this.selectedTeam.description || '';
        this.selectedUsers = this.selectedTeam.teammates || [];
      }
    });

    this.companyService.selectedCompanySubject.subscribe(comp => {
      this.companyId = comp?.id
    })

    if (this.companyId) {
      this.companyService.getUsersByCompany(this.companyId, this.credentials!).subscribe({
        next: data => {
          this.availableUsers = data;
          this.loading = false;
          this.error = '';
          console.log("Users Fetch" + data);
        },
        error: err => {
          this.error = err.error.message;
          this.loading = false;
          console.log(err);
        }
      })
    }

    this.overlayService.overlayVisibility$.subscribe(isVisible => {
      this.isVisible = isVisible;
    });
  }

  addUserToSelectedUsers(event: any) {
    if(event.target.value == null) return;
    const userId = event.target.value;
    const selectedUser = this.availableUsers.find(user => user.id === +userId);
    event.target.value = null;
    if (selectedUser) {
      this.selectedUsers.push(selectedUser);
    }
  }

  removeUser(userToRemove: BasicUser) {
    let index = this.selectedUsers.findIndex(user => user.id === userToRemove.id)
    this.selectedUsers.splice(index, 1);
  }

  submitNewTeam() {
    const newTeam: Team = {
      id: null,
      name: this.name,
      description: this.description,
      teammates: this.selectedUsers
    };

    const teamRequest: any = {
      team: newTeam,
      credentials: this.credentials
    };


    this.teamService.createNewTeam(this.companyId, teamRequest).subscribe({
      next: (data: any) => {
        console.log('Team created successfully:', data);
        newTeam.id = data.id;
        this.teamCreated.emit(newTeam);
        this.closeOverlay();
      },
      error: err => {
        this.error = err.error.message;
        this.loading = false;
        console.log(err);
      }
    })
  }

  isUserSelected(user: BasicUser) {
    return this.selectedUsers.some(u => u.id === user.id);
  }

  showOverlay() {
    this.isVisible = true;
  }

  closeOverlay() {
    this.resetForm()
    this.overlayService.hideOverlay();
  }

  deleteTeam() {
    if (this.companyId && this.credentials) {
      this.teamService.deleteTeam(this.id, this.credentials).subscribe({
        next: data => {
          if (data) {
            console.log('Team deleted successfully:', data);
            this.teamDeleted.emit(data);
            this.closeOverlay();
          }
        },
        error: err => {
          this.error = err.error.message;
          this.loading = false;
          console.log(err);
        }
      });
    }

  }

  updateTeam() {
    if (!this.selectedTeam) {
      console.error('No team selected to update');
      return;
    }

    const updatedTeam = {
      id: this.selectedTeam.id,
      name: this.name,
      description: this.description,
      teammates: this.selectedUsers
    }

    const teamRequest: any = {
      team: updatedTeam,
      credentials: this.credentials
    };

    this.teamService.updateTeam(this.selectedTeam.id, teamRequest)
      .subscribe(
        updatedTeam => {
          this.teamUpdated.emit(updatedTeam)
          this.closeOverlay()

        },
        error => {
          console.error('Failed to update team:', error);

        }
      );
  }

  private resetForm() {
    this.id = 0;
    this.name = '';
    this.description = '';
    this.selectedUsers = [];
    this.selectedTeam = undefined;
  }
}
