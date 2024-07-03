import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Company, FullUser, Team } from '../interfaces';
import { Credentials } from '../interfaces/Credentials';
import { Project } from '../interfaces/Project';
import { CompanyService } from '../services/company.service';
import { ProjectsServiceService } from '../services/projects.service.service';
import { TeamServiceService } from '../services/team-service.service';
import { UserServiceService } from '../services/user-service.service';


@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {
  user: FullUser | null = null;
  projectsList: Project[] = [];
  credentials: Credentials | null = null;
  company: Company | null = null;
  team: Team | undefined = undefined;
  error: string = '';
  selectedProject: Project | undefined = undefined;
  newProjectOverlayOpen = false;
  editProjectOverlayOpen = false;
  name: string = '';
  description: string = '';
  isActive: boolean = false;


  constructor(
    private userService: UserServiceService,
    private router: Router,
    private companyService: CompanyService,
    private teamService: TeamServiceService,
    private projectService: ProjectsServiceService,
  ) { }

  ngOnInit(): void {
    this.userService.userObservable.subscribe(user => this.user = user);
    this.userService.credentialsObservable.subscribe(credentials => this.credentials = credentials);
    this.companyService.selectedCompanyObservable.subscribe(company => this.company = company);
    this.teamService.teamSubjectObservable.subscribe(team => this.team = team);

    if (this.user?.admin) {
      if (this.credentials && this.company && this.team) {
        this.fetchProjects(this.credentials, this.company.id, this.team.id);
      } else {
        console.log("Error Fetching Projects");
      }
    } else {
      this.projectService.fetchUserProjects(this.credentials!, this.team?.id!).subscribe({
        next: data => {
          this.projectsList = data;
          this.error = '';
          console.log(this.projectsList)
        },
        error: err => {
          this.error = err.error.message;
          console.log(err);
        }
      })
    }
  }

  fetchProjects(credentials: Credentials, companyId: number, teamId: number | null) {
    this.projectService.fetchProjectsByTeam(credentials, companyId, teamId).subscribe({
      next: data => {
        this.projectsList = data;
        this.error = '';
        console.log(this.projectsList);
      },
      error: err => {
        this.error = err.error.message;
        console.log(err);
      }
    });
  }

  goToTeams() {
    this.router.navigate(['/teams']);
  }

  openOverlay(type: 'newProject' | 'editProject', project?: Project) {
    if (type === 'newProject') {
      this.newProjectOverlayOpen = true;
      this.selectedProject = undefined;
      this.resetForm();
    } else if (type === 'editProject' && project) {
      this.editProjectOverlayOpen = true;
      this.selectedProject = project;
      this.name = project.name || '';
      this.description = project.description || '';
      this.isActive = project.active || false;
    }
  }

  closeOverlay(type: 'newProject' | 'editProject') {
    if (type === 'newProject') {
      this.newProjectOverlayOpen = false;
      this.resetForm();
    } else if (type === 'editProject') {
      this.editProjectOverlayOpen = false;
      this.selectedProject = undefined;
    }
  }

  resetForm() {
    this.name = '';
    this.description = '';
    this.isActive = false;
  }

  saveNewProject() {
    if (this.company && this.credentials && this.team) {
      const projectRequestDto: any = {
        name: this.name,
        description: this.description,
        active: this.isActive,
        credentials: this.credentials
      };
      this.projectService.saveNewProject(this.company.id, this.team.id, projectRequestDto).subscribe({
        next: data => {
          if (data) {
            console.log('Project created successfully:', data);
            this.addProject(data);
            this.closeOverlay('newProject');
          }
        },
        error: err => {
          this.error = err.error.message;
          console.log(err);
        }
      });
    }
  }

  updateProject() {
    if (this.selectedProject && this.credentials) {
      const projectRequestDto: any = {
        name: this.selectedProject.name,
        description: this.selectedProject.description,
        active: this.isActive,
        credentials: this.credentials
      };

      this.projectService.updateProject(this.selectedProject.id, projectRequestDto).subscribe({
        next: data => {
          console.log('Project updated successfully:', data);
          this.updateProjects(data);
          this.closeOverlay('editProject');
        },
        error: err => {
          this.error = err.error.message;
          console.log(err);
        }
      });
    }
  }

  addProject(project: Project) {
    if (project) {
      this.projectsList.push(project);
    }
  }

  updateProjects(updatedProject: Project) {
    if (updatedProject) {
      const index = this.projectsList.findIndex(proj => proj.id === updatedProject.id);
      if (index !== -1) {
        this.projectsList[index] = updatedProject;
      }
    }
  }
}
