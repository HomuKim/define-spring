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

		if (fullFile != null) {
			String fullFileName = saveTrainerImage(trainerId, fullFile, "-full");
			trainer.setFullImage("/images/member/" + fullFileName);
		}

		if (thumbnailFile != null) {
			String thumbnailFileName = saveTrainerImage(trainerId, thumbnailFile, "-thumbnail");
			trainer.setThumbnailImage("/images/member/" + thumbnailFileName);
		}

		return trainerRepository.save(trainer);
	}

	private String saveTrainerImage(Long trainerId, MultipartFile file, String suffix) throws IOException {
		String fileExtension = getFileExtension(file.getOriginalFilename());
		String newFileName = generateNewFileName(trainerId) + suffix + "." + fileExtension;

		Path uploadPath = Paths.get("src/main/resources/static/images/member");
		if (!Files.exists(uploadPath)) {
			Files.createDirectories(uploadPath);
		}

		saveFile(file, uploadPath, newFileName);
		return newFileName;
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