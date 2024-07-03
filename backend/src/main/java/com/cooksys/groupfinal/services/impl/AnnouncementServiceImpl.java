package com.cooksys.groupfinal.services.impl;

import java.util.HashSet;
import java.util.Set;

import org.springframework.stereotype.Service;

import com.cooksys.groupfinal.dtos.AnnouncementDto;
import com.cooksys.groupfinal.dtos.CredentialsDto;
import com.cooksys.groupfinal.entities.Announcement;
import com.cooksys.groupfinal.entities.Company;
import com.cooksys.groupfinal.entities.User;
import com.cooksys.groupfinal.mappers.AnnouncementMapper;
import com.cooksys.groupfinal.mappers.CredentialsMapper;
import com.cooksys.groupfinal.repositories.AnnouncementRepository;
import com.cooksys.groupfinal.services.AnnouncementService;
import com.cooksys.groupfinal.services.UserService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AnnouncementServiceImpl implements AnnouncementService {
	
	private final UserService userService;
	private final AnnouncementMapper announcementMapper;
	private final AnnouncementRepository announcementRepository;
	private final CredentialsMapper credentialsMapper;
	
	@Override
	public Set<AnnouncementDto> getAnnouncements(CredentialsDto credentialsDto) {

		
		User user = userService.authenticate(credentialsMapper.dtoToEntity(credentialsDto), "user");
		
		Set<Company> companies = user.getCompanies();
		
		Set<Announcement> announcements = new HashSet<Announcement>();
		
		for(Company company: companies) {
			announcements.addAll(company.getAnnouncements());
		}
		
		return announcementMapper.entitiesToDtos(announcements);
	}

}