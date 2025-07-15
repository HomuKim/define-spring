package com.example.definethebody.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "trainerImage")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TrainerImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    // 트레이너와의 외래키 관계 (Trainer 엔티티가 있다면 아래처럼 매핑 권장)
    // @ManyToOne(fetch = FetchType.LAZY)
    // @JoinColumn(name = "trainer_id")
    // private Trainer trainer;

    // Trainer 엔티티와 연결하지 않을 경우 아래처럼 유지 가능
    @Column(name = "trainer_id", nullable = false)
    private long trainerId;

    @Column(name = "image_path", nullable = false)
    private String imagePath;

    @Column(name = "image_type")
    private String imageType;

    @Column(name = "description")
    private String description;
}
