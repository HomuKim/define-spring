package com.example.definethebody.controller;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.web.bind.annotation.RestController;


import com.example.definethebody.service.EventService;
import com.example.definethebody.service.FacilityService;
import com.example.definethebody.service.TrainerService;

@RestController
public class ContentsController {

    @Autowired
    private EventService eventService;
    @Autowired
    private TrainerService trainerService;
    @Autowired
    private FacilityService facilityService;

    // // 이미지 등록
    // @PostMapping
    // public ResponseEntity<?> uploadImage(...) { ... }

    // // 이미지 수정
    // @PutMapping("/{id}")
    // public ResponseEntity<?> updateImage(@PathVariable Long id, ...) { ... }

    // // 이미지 삭제
    // @DeleteMapping("/{id}")
    // public ResponseEntity<?> deleteImage(@PathVariable Long id) { ... }
}