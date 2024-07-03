package com.cooksys.groupfinal.services.impl;

import java.util.Optional;
import java.util.Set;

import org.springframework.stereotype.Service;

import com.cooksys.groupfinal.dtos.CredentialsDto;
import com.cooksys.groupfinal.dtos.ProjectDto;
import com.cooksys.groupfinal.dtos.ProjectRequestDto;
import com.cooksys.groupfinal.entities.Project;
import com.cooksys.groupfinal.entities.User;
import com.cooksys.groupfinal.exceptions.NotFoundException;
import com.cooksys.groupfinal.mappers.CredentialsMapper;
import com.cooksys.groupfinal.mappers.ProjectMapper;
import com.cooksys.groupfinal.repositories.ProjectRepository;
import com.cooksys.groupfinal.services.ProjectService;
import com.cooksys.groupfinal.services.UserService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProjectServiceImpl implements ProjectService {
	
	private final ProjectRepository projectRepository;
	private final ProjectMapper projectMapper;
	private final UserService userService;
	private final CredentialsMapper credentialsMapper;
	
	private Project findProject(Long id) {
		Optional<Project> project = projectRepository.findById(id);
		if(project.isEmpty()) {
			throw new NotFoundException("A project with the provided id does not exist.");
		}
		return project.get();
	}
	
	@Override
	public ProjectDto updateProject(Long id, ProjectRequestDto projectRequestDto) {
		Project projectToUpdate = findProject(id);
		
		User user = userService.authenticate(credentialsMapper.dtoToEntity(projectRequestDto.getCredentials()));
		
		if(!user.isAdmin() && !projectToUpdate.getTeam().getTeammates().contains(user)) {
			
			throw new NotFoundException("The user " + user.getCredentials().getUsername() + " is not assigned to this project.");
			
		}
		
		if(user.isAdmin()) {
			projectToUpdate.setActive(projectRequestDto.isActive());
		}
		
		projectToUpdate.setName(projectRequestDto.getName());
		
		projectToUpdate.setDescription(projectRequestDto.getDescription());
		
		
		projectRepository.save(projectToUpdate);
		
		return projectMapper.entityToDto(projectToUpdate);
	}

	@Override
	public ProjectDto deleteProject(Long id, CredentialsDto credentialsDto) {
		Project projectToDelete = findProject(id);
		
		userService.authenticate(credentialsMapper.dtoToEntity(credentialsDto), "admin");
		
		projectRepository.delete(projectToDelete);
		
		return projectMapper.entityToDto(projectToDelete);
	}

	@Override
	public void deleteAllProjects(Set<Project> projects) {
		projectRepository.deleteAll(projects);
	}

}
