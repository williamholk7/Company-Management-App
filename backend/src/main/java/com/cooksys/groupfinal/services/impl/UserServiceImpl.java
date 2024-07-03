package com.cooksys.groupfinal.services.impl;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cooksys.groupfinal.dtos.CredentialsDto;
import com.cooksys.groupfinal.dtos.FullUserDto;
import com.cooksys.groupfinal.dtos.UserRequestDto;
import com.cooksys.groupfinal.entities.Announcement;
import com.cooksys.groupfinal.entities.Company;
import com.cooksys.groupfinal.entities.Credentials;
import com.cooksys.groupfinal.entities.Team;
import com.cooksys.groupfinal.entities.User;
import com.cooksys.groupfinal.exceptions.BadRequestException;
import com.cooksys.groupfinal.exceptions.NotAuthorizedException;
import com.cooksys.groupfinal.exceptions.NotFoundException;
import com.cooksys.groupfinal.exceptions.ForbiddenException;
import com.cooksys.groupfinal.mappers.CredentialsMapper;
import com.cooksys.groupfinal.mappers.FullUserMapper;
import com.cooksys.groupfinal.repositories.AnnouncementRepository;
import com.cooksys.groupfinal.repositories.CompanyRepository;
import com.cooksys.groupfinal.repositories.TeamRepository;
import com.cooksys.groupfinal.repositories.UserRepository;
import com.cooksys.groupfinal.services.AnnouncementService;
import com.cooksys.groupfinal.services.UserService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final TeamRepository teamRepository;
    private final AnnouncementRepository announcementRepository;
    private final CompanyRepository companyRepository;
    private final FullUserMapper fullUserMapper;
    private final CredentialsMapper credentialsMapper;

    private User findUser(String username) {
        Optional<User> user = userRepository.findByCredentialsUsernameAndActiveTrue(username);
        if (user.isEmpty()) {
            throw new NotFoundException("The username provided does not belong to an active user.");
        }
        return user.get();
    }
    
    private User findAnyUser(String username) {
    	Optional<User> user = userRepository.findByCredentialsUsername(username);
    	if (user.isEmpty()) {
            throw new NotFoundException("The username provided does not belong to an active user.");
        }
        return user.get();
    }

    @Override
    public User authenticate(CredentialsDto credentialsDto, String requiredRole) {
        User user = authenticate(credentialsDto);
        String role = user.isAdmin() ? "admin" : "user";
        if (!role.equals(requiredRole)) {
            throw new ForbiddenException("You (" + role + ") are not the required role of: " + requiredRole);
        }
        return user;
    }

    @Override
    public User authenticate(CredentialsDto credentialsDto) {
    	Credentials credentials = credentialsMapper.dtoToEntity(credentialsDto);
    	return authenticate(credentials);
    }

    @Override
    public User authenticate(Credentials credentials, String requiredRole) {
        User user = authenticate(credentials);
        String role = user.isAdmin() ? "admin" : "user";
        if (!role.equals(requiredRole)) {
            throw new ForbiddenException("You (" + role + ") are not the required role of: " + requiredRole);
        }
        return user;
    }

    @Override
    public User authenticate(Credentials credentials) {
        if (credentials.getUsername() == null || credentials.getPassword() == null) {
            throw new BadRequestException("A username and password are required.");
        }
        User userToValidate = findUser(credentials.getUsername());
        if (!userToValidate.getCredentials().equals(credentials)) {
            throw new NotAuthorizedException("The provided credentials are invalid.");
        }
        return userToValidate;
    }

    @Override
    public FullUserDto login(CredentialsDto credentialsDto) {
        Credentials credentialsToValidate = credentialsMapper.dtoToEntity(credentialsDto);
        if (credentialsToValidate.getUsername() == null || credentialsToValidate.getPassword() == null) {
            throw new BadRequestException("A username and password are required.");
        }
        User user = findAnyUser(credentialsToValidate.getUsername());
        if(!user.getCredentials().equals(credentialsToValidate)) {
            throw new NotAuthorizedException("The provided credentials are invalid.");
        }
        if (user.getStatus().equals("PENDING")) {
            user.setStatus("JOINED");
            user.setActive(true);
            userRepository.saveAndFlush(user);
        }
        return fullUserMapper.entityToFullUserDto(user);
    }

    @Override
    @Transactional
    public FullUserDto delete(Long userId, CredentialsDto credentialsDto) {
        Credentials credentialsToValidate = credentialsMapper.dtoToEntity(credentialsDto);
        authenticate(credentialsToValidate, "admin");
        Optional<User> userToRemove = userRepository.findById(userId);
        if (userToRemove.isEmpty()) {
            throw new NotFoundException("The user id provided does not belong to an active user.");
        }
        User removeUser = userToRemove.get();
        for (Company company : removeUser.getCompanies()) {
            company.getEmployees().remove(removeUser);
            companyRepository.save(company);
        }
        for (Team team : removeUser.getTeams()) {
            team.getTeammates().remove(removeUser);
            teamRepository.save(team);
        }
        Set<Announcement> announcements = removeUser.getAnnouncements();
        announcementRepository.deleteAll(announcements);
        removeUser.getAnnouncements().removeAll(announcements);
        userRepository.delete(removeUser);
        return fullUserMapper.entityToFullUserDto(removeUser);
    }

    @Override
    public FullUserDto createUser(Long companyId, UserRequestDto userRequestDto) {
        authenticate(userRequestDto.getAdminCredentials(), "admin");
        User user = fullUserMapper.requestDtoToEntity(userRequestDto);
        Optional<Company> companyO = companyRepository.findById(companyId);
        if (companyO.isEmpty()) {
            throw new NotFoundException("The company id provided does not exist.");
        }
        Company company = companyO.get();
        Set<Company> companies = new HashSet<Company>();
        companies.add(company);
        user.setCompanies(companies);
        userRepository.saveAndFlush(user);
        company.getEmployees().add(user);
        companyRepository.saveAndFlush(company);
        return fullUserMapper.entityToFullUserDto(user);
    }

}
