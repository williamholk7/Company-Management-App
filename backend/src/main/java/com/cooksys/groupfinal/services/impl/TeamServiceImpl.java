package com.cooksys.groupfinal.services.impl;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

import com.cooksys.groupfinal.services.ProjectService;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import com.cooksys.groupfinal.dtos.CredentialsDto;

import com.cooksys.groupfinal.dtos.ProjectDto;
import com.cooksys.groupfinal.entities.Company;
import com.cooksys.groupfinal.entities.Project;
import com.cooksys.groupfinal.entities.Team;
import com.cooksys.groupfinal.exceptions.NotFoundException;
import com.cooksys.groupfinal.mappers.CredentialsMapper;
import com.cooksys.groupfinal.mappers.ProjectMapper;
import com.cooksys.groupfinal.dtos.TeamDto;
import com.cooksys.groupfinal.dtos.TeamRequestDto;
import com.cooksys.groupfinal.entities.User;
import com.cooksys.groupfinal.exceptions.BadRequestException;
import com.cooksys.groupfinal.mappers.TeamMapper;
import com.cooksys.groupfinal.repositories.CompanyRepository;
import com.cooksys.groupfinal.repositories.TeamRepository;
import com.cooksys.groupfinal.services.TeamService;
import com.cooksys.groupfinal.services.UserService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TeamServiceImpl implements TeamService {

    private final TeamRepository teamRepository;
    private final CompanyRepository companyRepository;
    private final TeamMapper teamMapper;
    private final UserService userService;
    private final ProjectService projectService;
    private final CredentialsMapper credentialsMapper;
    private final ProjectMapper projectMapper;

    private Team findTeam(Long id) {
        Optional<Team> team = teamRepository.findById(id);
        if (team.isEmpty()) {
            throw new NotFoundException("A team with the provided id does not exist.");
        }
        return team.get();
    }

    @Override
    public Set<ProjectDto> getProjectsByTeam(Long id, CredentialsDto credentialsDto) {
        Team team = findTeam(id);
        userService.authenticate(credentialsMapper.dtoToEntity(credentialsDto), "user");
        return projectMapper.entitiesToDtos(team.getProjects());
    }

    public TeamDto createTeam(Long companyId, TeamRequestDto teamRequestDto) {
        userService.authenticate(teamRequestDto.getCredentials(), "admin");
        Optional<Company> companyO = companyRepository.findById(companyId);
        if (companyO.isEmpty()) {
            throw new NotFoundException("The company id provided does not exist.");
        }
        Company company = companyO.get();
        Team team = teamMapper.dtoToEntity(teamRequestDto.getTeam());
        team.setCompany(company);
        return teamMapper.entityToDto(teamRepository.saveAndFlush(team));
    }

    public Set<TeamDto> getTeams(CredentialsDto credentialsDto) {
        User user = userService.authenticate(credentialsDto);
        return teamMapper.entitiesToDtos(user.getTeams());
    }

    public TeamDto patchTeam(Long id, TeamRequestDto teamRequestDto) {
        Team incomingTeam = teamMapper.dtoToEntity(teamRequestDto.getTeam());
        Optional<Team> currentTeamO = teamRepository.findById(id);
        if (currentTeamO.isEmpty()) {
            throw new NotFoundException("Team by id could not be found");
        }
        Team currentTeam = currentTeamO.get();
        User user = userService.authenticate(teamRequestDto.getCredentials(), "admin");
        if (currentTeam.getId().equals(incomingTeam.getId())) {
            if (incomingTeam.getName() != null) {
                currentTeam.setName(incomingTeam.getName());
            }
            if (incomingTeam.getDescription() != null) {
                currentTeam.setDescription(incomingTeam.getDescription());
            }
            if (incomingTeam.getTeammates() != null) {
                currentTeam.setTeammates(incomingTeam.getTeammates());
            }
            return teamMapper.entityToDto(teamRepository.saveAndFlush(currentTeam));
        } else {
            throw new BadRequestException("Edited team malformed, id mis-match");
        }
    }

    @Transactional
    public TeamDto deleteTeam(Long id, CredentialsDto credentialsDto) {
        userService.authenticate(credentialsDto, "admin");
        Optional<Team> teamO = teamRepository.findById(id);
        if (teamO.isEmpty()) {
            throw new NotFoundException("Team to delete not found");
        }
        Team team = teamO.get();
        Set<Project> projects = team.getProjects();
        projects.forEach(project -> project.setTeam(null));
        projectService.deleteAllProjects(projects);
        team.getProjects().removeAll(projects);
        teamRepository.delete(team);
        return teamMapper.entityToDto(team);
    }

    @Override
    public int getProjectsCount(Long id) {
        Optional<Team> team0 = teamRepository.findById(id);
        if (team0.isEmpty()) {
            throw new NotFoundException("Team not found");
        }
        Team team = team0.get();
        return team.getProjects().size();
    }

}
