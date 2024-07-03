package com.cooksys.groupfinal.services.impl;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.stereotype.Service;

import com.cooksys.groupfinal.dtos.AnnouncementDto;
import com.cooksys.groupfinal.dtos.AnnouncementRequestDto;
import com.cooksys.groupfinal.dtos.CompanyDto;
import com.cooksys.groupfinal.dtos.CredentialsDto;
import com.cooksys.groupfinal.dtos.FullUserDto;
import com.cooksys.groupfinal.dtos.ProjectDto;
import com.cooksys.groupfinal.dtos.ProjectRequestDto;
import com.cooksys.groupfinal.dtos.TeamDto;
import com.cooksys.groupfinal.entities.Announcement;
import com.cooksys.groupfinal.entities.Company;
import com.cooksys.groupfinal.entities.Project;
import com.cooksys.groupfinal.entities.Team;
import com.cooksys.groupfinal.entities.User;
import com.cooksys.groupfinal.exceptions.NotFoundException;
import com.cooksys.groupfinal.mappers.AnnouncementMapper;
import com.cooksys.groupfinal.mappers.CompanyMapper;
import com.cooksys.groupfinal.mappers.CredentialsMapper;
import com.cooksys.groupfinal.mappers.ProjectMapper;
import com.cooksys.groupfinal.mappers.TeamMapper;
import com.cooksys.groupfinal.mappers.FullUserMapper;
import com.cooksys.groupfinal.repositories.AnnouncementRepository;
import com.cooksys.groupfinal.repositories.CompanyRepository;
import com.cooksys.groupfinal.repositories.ProjectRepository;
import com.cooksys.groupfinal.repositories.TeamRepository;
import com.cooksys.groupfinal.services.CompanyService;
import com.cooksys.groupfinal.services.UserService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CompanyServiceImpl implements CompanyService {
	
	private final CompanyRepository companyRepository;
	private final TeamRepository teamRepository;
	private final CompanyMapper companyMapper;
	private final FullUserMapper fullUserMapper;
	private final AnnouncementRepository announcementRepository;
	private final AnnouncementMapper announcementMapper;
	private final TeamMapper teamMapper;
	private final ProjectMapper projectMapper;
	private final ProjectRepository projectRepository;
	private final UserService userService;
	private final CredentialsMapper credentialsMapper;

	private Company findCompany(Long id) {
        Optional<Company> company = companyRepository.findById(id);
        if (company.isEmpty()) {
            throw new NotFoundException("A company with the provided id does not exist.");
        }
        return company.get();
    }
	
	private Team findTeam(Long id) {
        Optional<Team> team = teamRepository.findById(id);
        if (team.isEmpty()) {
            throw new NotFoundException("A team with the provided id does not exist.");
        }
        return team.get();
    }
	
	@Override
	public Set<CompanyDto> getAllCompanies(CredentialsDto credentialsDto) {
		userService.authenticate(credentialsDto, "admin");
		List<Company> companies = companyRepository.findAll();
    Set<Company> companySet = new HashSet<>(companies);
		return companyMapper.entitiesToDtos(companySet);
	}

	@Override
	public Set<FullUserDto> getAllUsers(Long id, CredentialsDto credentialsDto) {
		userService.authenticate(credentialsDto, "admin");
		Company company = findCompany(id);
		return fullUserMapper.entitiesToFullUserDtos(company.getEmployees());
	}

	@Override
	public Set<AnnouncementDto> getAllAnnouncements(Long id, CredentialsDto credentialsDto) {
		userService.authenticate(credentialsDto, "admin");
		Company company = findCompany(id);
		List<Announcement> sortedList = new ArrayList<Announcement>(company.getAnnouncements());
		sortedList.sort(Comparator.comparing(Announcement::getDate).reversed());
		Set<Announcement> sortedSet = new HashSet<Announcement>(sortedList);
		return announcementMapper.entitiesToDtos(sortedSet);
	}

	@Override
	public Set<TeamDto> getAllTeams(Long id, CredentialsDto credentialsDto) {
		userService.authenticate(credentialsDto, "admin");
		Company company = findCompany(id);
		return teamMapper.entitiesToDtos(company.getTeams());
	}

	@Override
	public Set<ProjectDto> getAllProjects(Long companyId, Long teamId, CredentialsDto credentialsDto) {
		userService.authenticate(credentialsMapper.dtoToEntity(credentialsDto), "admin");
		Company company = findCompany(companyId);
		Team team = findTeam(teamId);
		if (!company.getTeams().contains(team)) {
			throw new NotFoundException("A team with id " + teamId + " does not exist at company with id " + companyId + ".");
		}
		return projectMapper.entitiesToDtos(team.getProjects());
	}
	
	@Override
	public ProjectDto createProjectByTeam(Long companyId, Long teamId, ProjectRequestDto projectRequestDto) {
		userService.authenticate(credentialsMapper.dtoToEntity(projectRequestDto.getCredentials()), "admin");
		Company company = findCompany(companyId);
		Team team = findTeam(teamId);
		if (!company.getTeams().contains(team)) {
			throw new NotFoundException("A team with id " + teamId + " does not exist at company with id " + companyId + ".");
		}
		
		Project project = projectMapper.requestDtoToEntity(projectRequestDto);
		
		project.setActive(true);
		project.setTeam(team);
		
		projectRepository.saveAndFlush(project);

		return projectMapper.entityToDto(project);
	}

	@Override
	public AnnouncementDto createAnnouncement(Long id, AnnouncementRequestDto announcementRequestDto) {
		Company company = findCompany(id);
		
		User user = userService.authenticate(credentialsMapper.dtoToEntity(announcementRequestDto.getCredentials()), "admin");
		
		Announcement announcement = announcementMapper.requestDtoToEntity(announcementRequestDto);
		
		announcement.setAuthor(user);
		announcement.setCompany(company);
		
		announcementRepository.saveAndFlush(announcement);
		
		return announcementMapper.entityToDto(announcement);
	}

}
