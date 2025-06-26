package com.example.definethebody.service;

import com.example.definethebody.model.Trainer;
import com.example.definethebody.repository.TrainerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class TrainerService {
    private final TrainerRepository trainerRepository;

    @Autowired
    public TrainerService(TrainerRepository trainerRepository) {
        this.trainerRepository = trainerRepository;
    }

    public List<Trainer> findAllTrainers() {
        return trainerRepository.findAll();
    }
}
