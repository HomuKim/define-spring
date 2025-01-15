package com.example.definethebody.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class PageController {
	@GetMapping("/")
	public String home() {
		return "index";
	}

	@GetMapping("/event")
	public String event() {
		return "event";
	}

	@GetMapping("/intro")
	public String intro() {
		return "intro";
	}

	@GetMapping("/trainers")
	public String trainers() {
		return "trainers";
	}

	@GetMapping("/facilities")
	public String facilities() {
		return "facilities";
	}

	@GetMapping("/contact")
	public String contact() {
		return "contact";
	}

}
