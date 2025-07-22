package com.example.definethebody.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "TRAINERIMAGE")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TrainerImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trainer_id")
    private Trainer trainer;

    @Column(name = "image_path", nullable = false)
    private String imagePath;

    @Column(name = "image_type")
    private String imageType;
}
