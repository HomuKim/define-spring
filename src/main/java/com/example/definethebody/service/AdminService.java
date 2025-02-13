package com.example.definethebody.service;

import org.springframework.stereotype.Service;

import com.example.definethebody.model.Admin;
import com.example.definethebody.repository.AdminRepository;

@Service
public class AdminService {

	private final AdminRepository adminRepository;

	public AdminService(AdminRepository adminRepository) {
		this.adminRepository = adminRepository;
	}

	public boolean authenticateAdmin(String username, String password) {
		Admin admin = adminRepository.findByUsername(username).orElse(null);
		return admin != null && admin.getPassword().equals(password);
	}
}
