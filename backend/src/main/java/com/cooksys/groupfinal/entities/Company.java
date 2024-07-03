package com.cooksys.groupfinal.entities;

import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor
@Data
public class Company {
	
	@Id
	@GeneratedValue
	private Long id;
	
	private String name;
	
	private String description;
	
	@OneToMany(mappedBy = "company")
	@EqualsAndHashCode.Exclude
	private Set<Announcement> announcements = new HashSet<>();
	
	@ManyToMany
	@EqualsAndHashCode.Exclude
	private Set<User> employees = new HashSet<>();
	
	@OneToMany(mappedBy = "company")
	@EqualsAndHashCode.Exclude
	private Set<Team> teams = new HashSet<>();

}
