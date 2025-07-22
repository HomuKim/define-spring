package com.example.definethebody.repository;

import com.example.definethebody.model.TrainerImage;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TrainerImageRepository extends JpaRepository<TrainerImage, Long> {
    // 트레이너별 이미지 목록 조회
    List<TrainerImage> findByTrainerIdOrderByIdAsc(Long trainerId);

    // 이미지 타입별 조회 등 커스텀 메서드 추가 가능
    List<TrainerImage> findByTrainerIdAndImageType(Long trainerId, String imageType);

    TrainerImage findFirstByTrainerIdAndImageTypeOrderByIdAsc(Long trainerId, String imageType);
}
