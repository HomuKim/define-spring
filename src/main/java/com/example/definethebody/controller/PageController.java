package com.example.definethebody.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import com.example.definethebody.model.Event;
import com.example.definethebody.model.Facility;
import com.example.definethebody.model.Trainer;
import com.example.definethebody.model.TrainerImage;
import com.example.definethebody.service.EventService;
import com.example.definethebody.service.FacilityService;
import com.example.definethebody.service.TrainerImageService;
import com.example.definethebody.service.TrainerService;

// 웹 페이지 요청을 처리하는 컨트롤러 클래스
@Controller
public class PageController {

	@Autowired
	private EventService eventService;
	@Autowired
	private TrainerService trainerService;
	@Autowired
	private FacilityService facilityService;
	@Autowired
	private TrainerImageService trainerImageService;

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
			System.out.println("이벤트 이미지: " + event.getImageUrl());
			System.out.println("이벤트 설명: " + event.getDescription());
			System.out.println("------------------------");
		}

		return "events";
	}

	// 이벤트 데이터 API (JSON 반환)
	@GetMapping("/api/events")
	@ResponseBody
	public List<Event> getAllEventsApi() {
		return eventService.getAllEvents();
	}

	// 트레이너 페이지 요청 처리
	@GetMapping("/trainers")
	public String trainers(Model model) {
		List<Trainer> trainers = trainerService.findAllTrainers();
		Map<Long, String> trainerThumbnailMap = new HashMap<>();
		for (Trainer trainer : trainers) {
			// 대표 썸네일(예: image_type = 'profile' 또는 'thumbnail') 한 장만 뽑기
			TrainerImage thumbnail = trainerImageService
					.findFirstByTrainerIdAndImageTypeOrderByIdAsc(trainer.getId(), "thumbnail");
			String imgPath = (thumbnail != null) ? thumbnail.getImagePath() : "images/default-thumbnail.png";
			trainerThumbnailMap.put(trainer.getId(), imgPath);

		}
		model.addAttribute("trainerList", trainers);
		model.addAttribute("trainerThumbnailMap", trainerThumbnailMap);
		return "trainers";
	}

	// 트레이너 상세이미지 데이터 API (JSON 반환)
	@GetMapping("/api/trainers")
	@ResponseBody
	public List<Map<String, Object>> getTrainersWithImages() {
		List<Trainer> trainers = trainerService.findAllTrainers();
		List<Map<String, Object>> result = new ArrayList<>();
		for (Trainer trainer : trainers) {
			Map<String, Object> map = new HashMap<>();
			map.put("id", trainer.getId());
			map.put("name", trainer.getName());
			map.put("instagramUrl", trainer.getInstagramUrl());
			map.put("position", trainer.getPosition());

			// 이 트레이너의 이미지 리스트를 포함
			List<TrainerImage> images = trainerImageService.findByTrainerIdOrderByIdAsc(trainer.getId());
			List<Map<String, Object>> imageList = new ArrayList<>();
			for (TrainerImage img : images) {
				Map<String, Object> imgMap = new HashMap<>();
				imgMap.put("imagePath", img.getImagePath());
				imgMap.put("imageType", img.getImageType());
				imageList.add(imgMap);
			}
			map.put("images", imageList); // 트레이너별 이미지 정보 포함
			result.add(map);
		}
		return result;
	}

	// 시설 페이지 요청 처리
	@GetMapping("/facilities")
	public String showFacilities(Model model) {
		List<Facility> facilities = facilityService.getAllFacilities();
		model.addAttribute("facilities", facilities);
		return "facilities";
	}

	// 고객지원 페이지 요청 처리
	@GetMapping("/contact")
	public String contact() {
		return "contact";
	}
}
