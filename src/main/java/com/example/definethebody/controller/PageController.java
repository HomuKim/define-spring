package com.example.definethebody.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import com.example.definethebody.model.Event;
import com.example.definethebody.model.Facility;
import com.example.definethebody.model.IntroMessage;
import com.example.definethebody.model.Trainer;
import com.example.definethebody.service.EventService;
import com.example.definethebody.service.FacilityService;
import com.example.definethebody.service.IntroService;
import com.example.definethebody.service.TrainerService;

@Controller
public class PageController {

	@Autowired
	private EventService eventService;
	@Autowired
	private IntroService introService;
	@Autowired
	private TrainerService trainerService;
	@Autowired
	private FacilityService facilityService;

	@GetMapping("/")
	public String home(Model model) {
		List<Event> events = eventService.getAllEvents();
		model.addAttribute("events", events);
		return "index";
	}

	@GetMapping("/events")
	public String showEvents(Model model) {
		List<Event> events = eventService.getAllEvents();
		model.addAttribute("events", events);

		// 전체 이벤트 리스트 출력
		System.out.println("모든 이벤트: " + events);

		// 이벤트의 세부 정보 출력
		for (Event event : events) {
			System.out.println("이벤트 ID: " + event.getId());
			System.out.println("이벤트 제목: " + event.getTitle());
			System.out.println("이벤트 이미지: " + event.getImage());
			System.out.println("이벤트 설명: " + event.getDescription());
			System.out.println("------------------------");
		}

		return "events";
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

		System.out.println("모든 트레이너: " + trainers);

		for (Trainer trainer : trainers) {
			System.out.println("트레이너 이름: " + trainer.getName());
			System.out.println("트레이너 풀 이미지: " + trainer.getFullImage());
			System.out.println("트레이너 썸네일 이미지: " + trainer.getThumbnailImage());
			System.out.println("트레이너 인스타그램 주소: " + trainer.getInstagramUrl());
			System.out.println("------------------------");
		}

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
