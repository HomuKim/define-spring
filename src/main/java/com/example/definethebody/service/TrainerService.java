package com.example.definethebody.service;

import com.example.definethebody.model.Trainer;
import com.example.definethebody.repository.TrainerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Optional;

@Service
public class TrainerService {
	@Autowired
	private TrainerRepository trainerRepository;

	public List<Trainer> getAllTrainers() {
		return trainerRepository.findAll();
	}

	public Trainer updateTrainerImage(Long trainerId, MultipartFile fullFile, MultipartFile thumbnailFile)
			throws IOException {
		Trainer trainer = trainerRepository.findById(trainerId)
				.orElseThrow(() -> new RuntimeException("Trainer not found"));

		String fileExtension = getFileExtension(fullFile.getOriginalFilename());
		String newFileNameBase = generateNewFileName(trainerId);

		String fullFileName = newFileNameBase + "-full." + fileExtension;
		String thumbnailFileName = newFileNameBase + "-thumbnail." + fileExtension;

		Path uploadPath = Paths.get("src/main/resources/static/images/trainer");
		if (!Files.exists(uploadPath)) {
			Files.createDirectories(uploadPath);
		}

		saveFile(fullFile, uploadPath, fullFileName);
		saveFile(thumbnailFile, uploadPath, thumbnailFileName);

		trainer.setFullImage("/images/trainer/" + fullFileName);
		trainer.setThumbnailImage("/images/trainer/" + thumbnailFileName);
		return trainerRepository.save(trainer);
	}

	private void saveFile(MultipartFile file, Path uploadPath, String fileName) throws IOException {
		try (InputStream inputStream = file.getInputStream()) {
			Path filePath = uploadPath.resolve(fileName);
			Files.copy(inputStream, filePath, StandardCopyOption.REPLACE_EXISTING);
		}
	}

	private String getFileExtension(String fileName) {
		return Optional.ofNullable(fileName).filter(f -> f.contains(".")).map(f -> f.substring(f.lastIndexOf(".") + 1))
				.orElse("");
	}

	private String generateNewFileName(Long trainerId) {
		return "trainer" + trainerId;
	}
}