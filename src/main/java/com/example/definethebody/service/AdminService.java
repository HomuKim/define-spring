package com.example.definethebody.service;

import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.definethebody.model.Admin;
import com.example.definethebody.repository.AdminRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminService {

	private final AdminRepository adminRepository;
	private final PasswordEncoder passwordEncoder;

	public boolean authenticateAdmin(String username, String password) {
		Admin admin = adminRepository.findByUsername(username)
				.orElseThrow(() -> new UsernameNotFoundException("Admin not found"));
		return passwordEncoder.matches(password, admin.getPassword());
	}

	public Object loadAdminByUsername(String username) {
		// TODO Auto-generated method stub
		return null;
	}
}
