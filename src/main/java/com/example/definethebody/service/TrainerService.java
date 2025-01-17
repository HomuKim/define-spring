package com.example.definethebody.service;

import com.example.definethebody.model.Trainer;
import com.example.definethebody.repository.TrainerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TrainerService {
	@Autowired
	private TrainerRepository trainerRepository;

	public List<Trainer> getAllTrainers() {
		return trainerRepository.findAll();
	}
}
