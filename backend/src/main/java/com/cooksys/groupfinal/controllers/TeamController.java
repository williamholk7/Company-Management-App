package com.cooksys.groupfinal.controllers;

import java.util.Set;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cooksys.groupfinal.dtos.CredentialsDto;
import com.cooksys.groupfinal.dtos.ProjectDto;
import com.cooksys.groupfinal.dtos.TeamDto;
import com.cooksys.groupfinal.dtos.TeamRequestDto;
import com.cooksys.groupfinal.services.TeamService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/teams")
@RequiredArgsConstructor
public class TeamController {

	private final TeamService teamService;

	@PostMapping("/{id}/projects")
	public Set<ProjectDto> getProjectsByTeam(@PathVariable Long id, @RequestBody CredentialsDto credentialsDto) {
		return teamService.getProjectsByTeam(id, credentialsDto);
	}

	@PostMapping("/")
	public Set<TeamDto> getTeams(@RequestBody CredentialsDto credentialsDto) {
		return teamService.getTeams(credentialsDto);
	}

	@PatchMapping("/{id}")
	public TeamDto patchTeam(@PathVariable Long id, @RequestBody TeamRequestDto teamRequestDto) {
		return teamService.patchTeam(id, teamRequestDto);
	}

	@DeleteMapping("/{id}")
	public TeamDto deleteTeam(@PathVariable Long id, @RequestBody CredentialsDto credentialsDto) {
		return teamService.deleteTeam(id, credentialsDto);
	}

	@GetMapping("/{id}/count")
	public int getTeamProjectsCount(@PathVariable Long id) {
		return teamService.getProjectsCount(id);
	}

}
