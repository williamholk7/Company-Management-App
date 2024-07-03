import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BasicUser } from '../../interfaces/User';
import { Team } from 'src/app/interfaces';
import { TeamServiceService } from 'src/app/services/team-service.service';

@Component({
  selector: 'app-team-card',
  templateUrl: './team-card.component.html',
  styleUrls: ['./team-card.component.css']
})
export class TeamCardComponent implements OnInit {
  @Input() isAdmin: boolean | undefined = undefined;
  @Input() team!: Team;

  @Output() editTeamClick: EventEmitter<void> = new EventEmitter<void>();
  @Output() viewProjectsClick: EventEmitter<void> = new EventEmitter<void>();

  projectsCount: number = 0;

  constructor(private teamService: TeamServiceService) { }

  ngOnInit(): void {
    this.teamService.getProjectsCount(this.team.id!).subscribe({
      next: data => {
        this.projectsCount = data;
      },
      error: err => {
        console.log(err);
      }
    })
  }

  editTeam() {
    this.editTeamClick.emit();
  }

  viewTeamProjects() {
    console.log("Event Emitted")
    this.viewProjectsClick.emit();
  }
}
