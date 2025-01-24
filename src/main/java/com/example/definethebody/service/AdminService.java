package com.example.definethebody.service;


import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.definethebody.model.Admin;
import com.example.definethebody.repository.AdminRepository;

@Service
public class AdminService {
	@Autowired
	private AdminRepository adminRepository;

	public boolean authenticateAdmin(String username, String password) {
		Optional<Admin> adminOpt = adminRepository.findByUsername(username);
		if (adminOpt.isPresent()) {
			// 실제 구현에서는 비밀번호를 암호화하여 저장하고 비교해야 합니다.
			return adminOpt.get().getPassword().equals(password);
		}
		return false;
	}
}