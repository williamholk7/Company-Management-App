package com.cooksys.groupfinal.services;

import java.util.Set;

import com.cooksys.groupfinal.dtos.AnnouncementDto;
import com.cooksys.groupfinal.dtos.AnnouncementRequestDto;
import com.cooksys.groupfinal.dtos.CompanyDto;
import com.cooksys.groupfinal.dtos.CredentialsDto;
import com.cooksys.groupfinal.dtos.FullUserDto;
import com.cooksys.groupfinal.dtos.ProjectDto;
import com.cooksys.groupfinal.dtos.ProjectRequestDto;
import com.cooksys.groupfinal.dtos.TeamDto;

public interface CompanyService {

	Set<CompanyDto> getAllCompanies(CredentialsDto credentialsDto);

	Set<FullUserDto> getAllUsers(Long id, CredentialsDto credentialsDto);

	Set<AnnouncementDto> getAllAnnouncements(Long id, CredentialsDto credentialsDto);

	Set<TeamDto> getAllTeams(Long id, CredentialsDto credentialsDto);

	Set<ProjectDto> getAllProjects(Long companyId, Long teamId, CredentialsDto credentialsDto);
	
	ProjectDto createProjectByTeam(Long companyId, Long teamId, ProjectRequestDto projectRequestDto);

	AnnouncementDto createAnnouncement(Long id, AnnouncementRequestDto announcementRequestDto);

}
