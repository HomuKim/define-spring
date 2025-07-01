package com.example.definethebody.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "trainers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Trainer {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)

	private Long id;
	private String name;
	private String position; // 예: CEO, GENERAL MANAGER, 트레이너 등

	@Column(name = "IMAGEPATH")
	private String imagePath; // 썸네일 이미지 경로
	private String instagramUrl; // 인스타그램 링크
}
