// AdminApiController.java (API 엔드포인트 처리)
package com.example.definethebody.controller;

import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.definethebody.service.AdminService;

import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/admin")
public class AdminApiController {

	private final AdminService adminService;
	private final AuthenticationManager authenticationManager;

	public AdminApiController(AdminService adminService, AuthenticationManager authenticationManager) {
		this.adminService = adminService;
		this.authenticationManager = authenticationManager;
	}

	@PostMapping("/login")
	public ResponseEntity<?> adminLogin(@Valid @RequestBody LoginRequest request) {
		Authentication authentication = authenticationManager
				.authenticate(new UsernamePasswordAuthenticationToken(request.username(), request.password()));
		SecurityContextHolder.getContext().setAuthentication(authentication);
		return ResponseEntity.ok(Map.of("success", true, "message", "로그인 성공", "redirectUrl", "/admin/dashboard"));
	}

	@GetMapping("/status")
	public ResponseEntity<?> checkAdminStatus(HttpSession session) {
		Boolean isAdmin = (Boolean) session.getAttribute("isAdminLoggedIn");
		return ResponseEntity.ok(Map.of("isAdmin", isAdmin != null && isAdmin));
	}

	@PostMapping("/logout")
	public ResponseEntity<?> adminLogout(HttpSession session) {
		session.removeAttribute("isAdminLoggedIn");
		return ResponseEntity.ok(Map.of("success", true, "message", "로그아웃 성공"));
	}

	public record LoginRequest(String username, String password) {
	}
}
