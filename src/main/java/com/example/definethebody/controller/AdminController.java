package com.example.definethebody.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
//AdminController.java

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.example.definethebody.service.AdminService;

import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {

	private final AdminService adminService;
	private final BCryptPasswordEncoder passwordEncoder;

	@PostMapping("/login")
	public ResponseEntity<?> adminLogin(@Valid @RequestBody LoginRequest request, HttpSession session) {
		if (adminService.authenticateAdmin(request.username(), request.password())) {
			session.setAttribute("adminLoggedIn", true);
			return ResponseEntity.ok(Map.of("success", true));
		}
		return ResponseEntity.status(401).body(Map.of("error", "인증 실패"));
	}

	public record LoginRequest(String username, String password) {
	}
}
