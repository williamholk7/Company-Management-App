package com.cooksys.groupfinal.services;

import com.cooksys.groupfinal.dtos.CredentialsDto;
import com.cooksys.groupfinal.dtos.FullUserDto;
import com.cooksys.groupfinal.dtos.UserRequestDto;
import com.cooksys.groupfinal.entities.Credentials;
import com.cooksys.groupfinal.entities.User;

public interface UserService {

	FullUserDto login(CredentialsDto credentialsDto);

	User authenticate(Credentials credentials);

	User authenticate(Credentials credentials, String requiredRole);
  
	User authenticate(CredentialsDto credentials);

	User authenticate(CredentialsDto credentials, String requiredRole);

	FullUserDto delete(Long userId, CredentialsDto credentialsDto);

	FullUserDto createUser(Long compnayId, UserRequestDto userRequestDto);

}
