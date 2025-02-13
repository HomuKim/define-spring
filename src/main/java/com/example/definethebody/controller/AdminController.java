package com.example.definethebody.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import com.example.definethebody.service.AdminService;

import jakarta.servlet.http.HttpSession;

@Controller
@RequestMapping("/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @PostMapping("/api/login")
    @ResponseBody
    public ResponseEntity<?> adminLogin(@RequestParam String username, @RequestParam String password,
                                        HttpSession session) {
        if (adminService.authenticateAdmin(username, password)) {
            session.setAttribute("isAdmin", true);
            return ResponseEntity.ok(Map.of("success", true, "message", "로그인 성공"));
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("success", false, "message", "로그인 실패"));
    }

    @GetMapping("/api/status")
    @ResponseBody
    public ResponseEntity<?> checkAdminStatus(HttpSession session) {
        Boolean isAdmin = (Boolean) session.getAttribute("isAdmin");
        return ResponseEntity.ok(Map.of("isAdmin", isAdmin != null && isAdmin));
    }

    @PostMapping("/api/logout")
    @ResponseBody
    public ResponseEntity<?> adminLogout(HttpSession session) {
        session.removeAttribute("isAdmin");
        return ResponseEntity.ok(Map.of("success", true, "message", "로그아웃 성공"));
    }
}
