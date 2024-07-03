import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Project } from 'src/app/interfaces/Project';
import { ProjectsServiceService } from 'src/app/services/projects.service.service';
import { OverlayServiceService } from '../../services/overlay.service.service';
import { Team } from 'src/app/interfaces/Team';

@Component({
  selector: 'app-project-card',
  templateUrl: './project-card.component.html',
  styleUrls: ['./project-card.component.css']
})
export class ProjectCardComponent implements OnInit{
  cardProject: Project = {
    id: 0,
    name: '',
    description: '',
    active: false,
    TeamDto: {} as Team
  };

  @Input() project : Project | null = null;
  @Output() projectUpdated: EventEmitter<any> = new EventEmitter<any>();
  @Output() editProject: EventEmitter<Project> = new EventEmitter<Project>();

  constructor(private projectService : ProjectsServiceService,
    private overlayService : OverlayServiceService
  ){}
  ngOnInit(): void {
    if(this.project) {
      this.cardProject = this.project;
    }
  }



onEditClick(project: Project) {
  if(project ){
     this.editProject.emit(project);
  }

}

  openOverlay() {
    this.overlayService.showOverlay();
  }


  updateProject() {
    this.projectUpdated.emit()
  }


}
