package com.cooksys.groupfinal.services;

import com.cooksys.groupfinal.dtos.CredentialsDto;
import com.cooksys.groupfinal.dtos.ProjectDto;
import com.cooksys.groupfinal.dtos.ProjectRequestDto;
import com.cooksys.groupfinal.entities.Project;

import java.util.Set;

public interface ProjectService {

	ProjectDto updateProject(Long id, ProjectRequestDto projectRequestDto);

	ProjectDto deleteProject(Long id, CredentialsDto credentialsDto);

    void deleteAllProjects(Set<Project> projects);
}
