package com.cooksys.groupfinal.dtos;

import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Data
public class TeamRequestDto {
	
    private TeamDto team;
    
    private CredentialsDto credentials;

}
