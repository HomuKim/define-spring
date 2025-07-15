package com.example.definethebody.repository;

import com.example.definethebody.model.Trainer;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface TrainerRepository extends JpaRepository<Trainer, Long> {
    List<Trainer> findAllByOrderByIdAsc();
}
