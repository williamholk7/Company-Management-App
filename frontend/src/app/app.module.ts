import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { CompanyComponent } from './company/company.component';
import { Routes, RouterModule } from '@angular/router';
import { AnnouncementsComponent } from './announcements/announcements.component';
import { NavbarComponent } from './navbar/navbar.component';
import { TeamsComponent } from './teams/teams.component';
import { TeamCardComponent } from './teams/team-card/team-card.component';
import { NewTeamOverlayComponent } from './teams/new-team-overlay/new-team-overlay.component';
import { AnnouncementCardComponent } from './announcements/announcement-card/announcement-card.component';
import { ProjectsComponent } from './projects/projects.component';
import { ProjectCardComponent } from './projects/project-card/project-card.component';
import { UsersComponent } from './users/users.component';


const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'company', component: CompanyComponent },
  { path: 'announcements', component: AnnouncementsComponent },
  { path: 'teams', component: TeamsComponent },
  { path: 'projects', component: ProjectsComponent },
  { path: 'users', component: UsersComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    CompanyComponent,
    AnnouncementsComponent,
    NavbarComponent,
    TeamsComponent,
    TeamCardComponent,
    NewTeamOverlayComponent,
    AnnouncementCardComponent,
    ProjectsComponent,
    ProjectCardComponent,
    UsersComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes),
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
