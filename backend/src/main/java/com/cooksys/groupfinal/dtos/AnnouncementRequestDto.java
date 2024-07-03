package com.cooksys.groupfinal.dtos;

import java.sql.Timestamp;

import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Data
public class AnnouncementRequestDto {
	
	private String title;
    
    private String message;
    
    private CredentialsDto credentials;

}
