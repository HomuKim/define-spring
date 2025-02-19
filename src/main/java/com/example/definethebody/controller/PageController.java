package com.example.definethebody.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import com.example.definethebody.model.Event;
import com.example.definethebody.model.Facility;
import com.example.definethebody.model.IntroMessage;
import com.example.definethebody.model.Trainer;
import com.example.definethebody.service.EventService;
import com.example.definethebody.service.FacilityService;
import com.example.definethebody.service.IntroService;
import com.example.definethebody.service.TrainerService;

// 웹 페이지 요청을 처리하는 컨트롤러 클래스
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

// 홈페이지 요청 처리
	@GetMapping("/")
	public String home(Model model) {
		List<Event> events = eventService.getAllEvents();
		model.addAttribute("events", events);
		return "index";
	}

// 이벤트 페이지 요청 처리
	@GetMapping("/events")
	public String showEvents(Model model) {
		List<Event> events = eventService.getAllEvents();
		model.addAttribute("events", events);

		// 전체 이벤트 리스트 출력 (디버깅 용도)
		System.out.println("모든 이벤트: " + events);

		// 이벤트의 세부 정보 출력 (디버깅 용도)
		for (Event event : events) {
			System.out.println("이벤트 ID: " + event.getId());
			System.out.println("이벤트 제목: " + event.getTitle());
			System.out.println("이벤트 이미지: " + event.getImage());
			System.out.println("이벤트 설명: " + event.getDescription());
			System.out.println("------------------------");
		}

		return "events";
	}

// 소개 페이지 요청 처리
	@GetMapping("/intro")
	public String intro(Model model) {
		IntroMessage ceoMessage = introService.getCeoMessage();
		IntroMessage managerMessage = introService.getManagerMessage();

		// CEO와 매니저 메시지를 모델에 추가, 없으면 빈 객체 추가
		model.addAttribute("ceoMessage", ceoMessage != null ? ceoMessage : new IntroMessage(null, null, null, null));
		model.addAttribute("managerMessage",
				managerMessage != null ? managerMessage : new IntroMessage(null, null, null, null));

		return "intro";
	}

// 트레이너 페이지 요청 처리
	@GetMapping("/trainers")
	public String trainers(Model model) {
		List<Trainer> trainers = trainerService.getAllTrainers();
		model.addAttribute("trainers", trainers);

		// 트레이너 정보 출력 (디버깅 용도)
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

// 시설 페이지 요청 처리
	@GetMapping("/facilities")
	public String showFacilities(Model model) {
		List<Facility> facilities = facilityService.getAllFacilities();
		model.addAttribute("facilities", facilities);
		return "facilities";
	}

// 시설 페이지 수정 처리
	@PostMapping("/facilities/update-image")
	public ResponseEntity<?> updateFacilityImage(@RequestParam("image") MultipartFile file,
			@RequestParam("facilityId") Long facilityId) {
		try {
			Facility updatedFacility = facilityService.updateFacilityImage(facilityId, file);
			String newImageUrl = updatedFacility.getImageUrl() + "?t=" + System.currentTimeMillis(); // 타임스탬프 추가
			return ResponseEntity.ok().body(Map.of("success", true, "newImageUrl", newImageUrl));
		} catch (Exception e) {
			return ResponseEntity.badRequest()
					.body(Map.of("success", false, "message", "Failed to update facility image: " + e.getMessage()));
		}
	}

	@PostMapping("/trainers/update-image")
	public ResponseEntity<?> updateTrainerImage(@RequestParam("fullImage") MultipartFile fullFile,
			@RequestParam("thumbnailImage") MultipartFile thumbnailFile, @RequestParam("trainerId") Long trainerId) {
		try {
			Trainer updatedTrainer = trainerService.updateTrainerImage(trainerId, fullFile, thumbnailFile);
			String newFullImageUrl = updatedTrainer.getFullImage() + "?t=" + System.currentTimeMillis();
			String newThumbnailImageUrl = updatedTrainer.getThumbnailImage() + "?t=" + System.currentTimeMillis();

			return ResponseEntity.ok().body(Map.of("success", true, "newFullImageUrl", newFullImageUrl,
					"newThumbnailImageUrl", newThumbnailImageUrl));
		} catch (Exception e) {
			return ResponseEntity.badRequest()
					.body(Map.of("success", false, "message", "Failed to update trainer images: " + e.getMessage()));
		}
	}

// 고객지원 페이지 요청 처리
	@GetMapping("/contact")
	public String contact() {
		return "contact";
	}
}
