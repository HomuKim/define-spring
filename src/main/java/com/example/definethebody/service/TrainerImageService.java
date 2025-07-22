package com.example.definethebody.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import com.example.definethebody.model.TrainerImage;
import com.example.definethebody.repository.TrainerImageRepository;

import jakarta.transaction.Transactional;

@Service
public class TrainerImageService {
    private final TrainerImageRepository trainerImageRepository;

    @Autowired
    public TrainerImageService(TrainerImageRepository trainerImageRepository) {
        this.trainerImageRepository = trainerImageRepository;
    }

    // 등록 (또는 수정)
    @Transactional
    public TrainerImage save(TrainerImage trainerImage) {
        return trainerImageRepository.save(trainerImage);
    }

    @Transactional
    public Optional<TrainerImage> update(Long id, TrainerImage updateData) {
        return trainerImageRepository.findById(id)
                .map(existing -> {
                    // 필요한 필드만 업데이트
                    existing.setImagePath(updateData.getImagePath());
                    existing.setImageType(updateData.getImageType());
                    // ... 기타 필드
                    return trainerImageRepository.save(existing);
                });
    }

    // 삭제 (by ID)
    @Transactional
    public void deleteById(Long id) {
        trainerImageRepository.deleteById(id);
    }

    // 삭제 (엔티티로)
    @Transactional
    public void delete(TrainerImage trainerImage) {
        trainerImageRepository.delete(trainerImage);
    }

    public List<TrainerImage> findByTrainerIdOrderByIdAsc(Long trainerId) {
        return trainerImageRepository.findByTrainerIdOrderByIdAsc(trainerId);
    }

    public List<TrainerImage> findByTrainerIdAndImageType(Long trainerId, String imageType) {
        return trainerImageRepository.findByTrainerIdAndImageType(trainerId, imageType);
    }

    public TrainerImage findFirstByTrainerIdAndImageTypeOrderByIdAsc(Long trainerId, String imageType) {
        return trainerImageRepository.findFirstByTrainerIdAndImageTypeOrderByIdAsc(trainerId, imageType);
    }

}