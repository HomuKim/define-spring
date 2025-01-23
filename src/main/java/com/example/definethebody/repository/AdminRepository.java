package com.example.definethebody.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.definethebody.model.Admin;

public interface AdminRepository extends JpaRepository<Admin, Long> {
	Optional<Admin> findByUsername(String username);
}