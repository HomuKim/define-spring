package com.example.definethebody.service;

import com.example.definethebody.model.Facility;
import com.example.definethebody.repository.FacilityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FacilityService {
	@Autowired
	private FacilityRepository facilityRepository;

	public List<Facility> getAllFacilities() {
		return facilityRepository.findAll();
	}
}
