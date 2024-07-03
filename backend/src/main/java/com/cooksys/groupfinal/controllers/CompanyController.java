package com.cooksys.groupfinal.controllers;

import java.util.Set;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.cooksys.groupfinal.dtos.AnnouncementDto;
import com.cooksys.groupfinal.dtos.AnnouncementRequestDto;
import com.cooksys.groupfinal.dtos.CredentialsDto;
import com.cooksys.groupfinal.dtos.FullUserDto;
import com.cooksys.groupfinal.dtos.CompanyDto;
import com.cooksys.groupfinal.dtos.ProjectDto;
import com.cooksys.groupfinal.dtos.ProjectRequestDto;
import com.cooksys.groupfinal.dtos.TeamDto;
import com.cooksys.groupfinal.dtos.TeamRequestDto;
import com.cooksys.groupfinal.dtos.UserRequestDto;
import com.cooksys.groupfinal.services.CompanyService;
import com.cooksys.groupfinal.services.TeamService;
import com.cooksys.groupfinal.services.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/company")
@RequiredArgsConstructor
public class CompanyController {
	
	private final CompanyService companyService;
	private final TeamService teamService;
	private final UserService userService;
	
	@PostMapping("/")
	public Set<CompanyDto> getAllCompanies(@RequestBody CredentialsDto credentialsDto) {
		return companyService.getAllCompanies(credentialsDto);
	}

	@PostMapping("/{id}/users")
	public Set<FullUserDto> getAllUsers(@PathVariable Long id, @RequestBody CredentialsDto credentialsDto) {
		return companyService.getAllUsers(id, credentialsDto);
	}

	@PostMapping("/{id}/users/create")
	public FullUserDto createUser(@PathVariable Long id, @RequestBody UserRequestDto userRequestDto) {
		return userService.createUser(id, userRequestDto);
	}
	
	@PostMapping("/{id}/announcements")
	public Set<AnnouncementDto> getAllAnnouncements(@PathVariable Long id, @RequestBody CredentialsDto credentialsDto) {
		return companyService.getAllAnnouncements(id, credentialsDto);
	}
	
	@PostMapping("/{id}/teams")
	public Set<TeamDto> getAllTeams(@PathVariable Long id, @RequestBody CredentialsDto credentialsDto) {
		return companyService.getAllTeams(id, credentialsDto);
	}

	@PostMapping("/{id}/teams/create")
	public TeamDto createTeam(@PathVariable Long id, @RequestBody TeamRequestDto teamRequestDto) {
		return teamService.createTeam(id, teamRequestDto);
	}
	
	@PostMapping("/{companyId}/teams/{teamId}/projects") 
	public Set<ProjectDto> getAllProjects(@PathVariable Long companyId, @PathVariable Long teamId, @RequestBody CredentialsDto credentialsDto) {
		return companyService.getAllProjects(companyId, teamId, credentialsDto);
	}
	
	@PostMapping("/{companyId}/teams/{teamId}/projects/create")
	public ProjectDto createProjectByTeam(@PathVariable Long companyId, @PathVariable Long teamId, @RequestBody ProjectRequestDto projectRequestDto) {
		return companyService.createProjectByTeam(companyId, teamId, projectRequestDto);
	}
	
	@PostMapping("/{id}/announcements/create")
	public AnnouncementDto createAnnouncement(@PathVariable Long id, @RequestBody AnnouncementRequestDto announcementRequestDto) {
		return companyService.createAnnouncement(id, announcementRequestDto);
	}
	

}
