package com.example.definethebody.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import com.example.definethebody.model.Facility;
import com.example.definethebody.model.IntroMessage;
import com.example.definethebody.model.Trainer;
import com.example.definethebody.service.FacilityService;
import com.example.definethebody.service.IntroService;
import com.example.definethebody.service.TrainerService;

@Controller
public class PageController {

	@Autowired
	private IntroService introService;
	@Autowired
	private TrainerService trainerService;
	@Autowired
	private FacilityService facilityService;

	@GetMapping("/")
	public String home() {
		return "index";
	}

	@GetMapping("/event")
	public String event() {
		return "event";
	}

	@GetMapping("/intro")
	public String intro(Model model) {
		IntroMessage ceoMessage = introService.getCeoMessage();
		IntroMessage managerMessage = introService.getManagerMessage();

		model.addAttribute("ceoMessage", ceoMessage != null ? ceoMessage : new IntroMessage(null, null, null, null));
		model.addAttribute("managerMessage",
				managerMessage != null ? managerMessage : new IntroMessage(null, null, null, null));

		return "intro";
	}

	@GetMapping("/trainers")
	public String trainers(Model model) {
		// 트레이너 데이터 로딩
		List<Trainer> trainers = trainerService.getAllTrainers();
		model.addAttribute("trainers", trainers);

		return "trainers";
	}

	@GetMapping("/facilities")
	public String showFacilities(Model model) {
		List<Facility> facilities = facilityService.getAllFacilities();
		model.addAttribute("facilities", facilities);
		return "facilities";
	}

	@GetMapping("/contact")
	public String contact() {
		return "contact";
	}
}
