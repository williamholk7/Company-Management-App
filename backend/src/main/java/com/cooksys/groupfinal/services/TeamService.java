package com.cooksys.groupfinal.services;

import java.util.Set;

import com.cooksys.groupfinal.dtos.CredentialsDto;
import com.cooksys.groupfinal.dtos.ProjectDto;
import com.cooksys.groupfinal.dtos.TeamDto;
import com.cooksys.groupfinal.dtos.TeamRequestDto;

public interface TeamService {

  Set<ProjectDto> getProjectsByTeam(Long id, CredentialsDto credentialsDto);

  Set<TeamDto> getTeams(CredentialsDto credentialsDto);

  TeamDto createTeam(Long id, TeamRequestDto teamRequestDto);

  TeamDto patchTeam(Long id, TeamRequestDto teamPatchRequestDto);

  TeamDto deleteTeam(Long id, CredentialsDto credentialsDto);

  int getProjectsCount(Long id);

}
