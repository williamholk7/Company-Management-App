package com.cooksys.groupfinal.controllers;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cooksys.groupfinal.dtos.CredentialsDto;
import com.cooksys.groupfinal.dtos.ProjectDto;
import com.cooksys.groupfinal.dtos.ProjectRequestDto;
import com.cooksys.groupfinal.services.ProjectService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/projects")
@RequiredArgsConstructor
public class ProjectController {
	
	private final ProjectService projectService;
	
	@PatchMapping("/{id}")
	public ProjectDto updateProject(@PathVariable Long id, @RequestBody ProjectRequestDto projectRequestDto) {
		return projectService.updateProject(id, projectRequestDto);
	}
	
	@DeleteMapping("/{id}")
	public ProjectDto deleteProject(@PathVariable Long id, @RequestBody CredentialsDto credentialsDto) {
		return projectService.deleteProject(id, credentialsDto);
	}

}
