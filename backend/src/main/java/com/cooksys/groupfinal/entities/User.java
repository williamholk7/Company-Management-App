package com.cooksys.groupfinal.entities;

import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
@Table(name = "user_table")
@NoArgsConstructor
@Data
public class User {

	@Id
	@GeneratedValue
	private Long id;

	@Embedded
	private Credentials credentials;

	@Embedded
	private Profile profile;

	private boolean active;

	private boolean admin;

	private String status = "PENDING";

	@OneToMany(mappedBy = "author")
	@EqualsAndHashCode.Exclude
	@ToString.Exclude
	private Set<Announcement> announcements = new HashSet<>();

	@ManyToMany(mappedBy = "employees")
	@EqualsAndHashCode.Exclude
	@ToString.Exclude
	private Set<Company> companies = new HashSet<>();

	@ManyToMany(mappedBy = "teammates")
	@EqualsAndHashCode.Exclude
	@ToString.Exclude
	private Set<Team> teams = new HashSet<>();

}
