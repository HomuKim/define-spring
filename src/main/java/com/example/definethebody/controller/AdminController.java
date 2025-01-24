package com.example.definethebody.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.definethebody.service.AdminService;

import jakarta.servlet.http.HttpSession;

import java.util.Map;

@RestController
@RequestMapping("/admin")
public class AdminController {

	@Autowired
	private AdminService adminService;

	@PostMapping("/login")
	public ResponseEntity<?> adminLogin(@RequestBody Map<String, String> loginRequest, HttpSession session) {
		String username = loginRequest.get("username");
		String password = loginRequest.get("password");

		if (adminService.authenticateAdmin(username, password)) {
			session.setAttribute("adminLoggedIn", true);
			return ResponseEntity.ok().body(Map.of("success", true));
		} else {
			return ResponseEntity.ok().body(Map.of("success", false, "message", "Invalid credentials"));
		}
	}

	@GetMapping("/status")
	public ResponseEntity<?> checkAdminStatus(HttpSession session) {
		Boolean isAdmin = (Boolean) session.getAttribute("adminLoggedIn");
		return ResponseEntity.ok().body(Map.of("isAdmin", isAdmin != null && isAdmin));
	}

	@PostMapping("/logout")
	public ResponseEntity<?> adminLogout(HttpSession session) {
		session.removeAttribute("adminLoggedIn");
		return ResponseEntity.ok().body(Map.of("success", true));
	}
}
