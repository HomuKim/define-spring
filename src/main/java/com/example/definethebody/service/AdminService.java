package com.example.definethebody.service;

import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.definethebody.model.Admin;
import com.example.definethebody.repository.AdminRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminService {

	private final AdminRepository adminRepository;
	private final BCryptPasswordEncoder passwordEncoder;

	public boolean authenticateAdmin(String username, String password) {
		Admin admin = adminRepository.findByUsername(username)
				.orElseThrow(() -> new UsernameNotFoundException("Admin not found"));
		return passwordEncoder.matches(password, admin.getPassword());
	}
}
