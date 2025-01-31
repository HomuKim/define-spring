package com.example.definethebody.service;

import com.example.definethebody.model.Facility;
import com.example.definethebody.repository.FacilityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.nio.file.Path;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;

@Service
public class FacilityService {

	@Autowired
	private FacilityRepository facilityRepository;

	public List<Facility> getAllFacilities() {
		return facilityRepository.findAll();
	}

	public Facility updateFacilityImage(Long facilityId, MultipartFile file) throws IOException {
		Facility facility = facilityRepository.findById(facilityId)
				.orElseThrow(() -> new RuntimeException("Facility not found"));

		String fileExtension = getFileExtension(file.getOriginalFilename());
		String newFileName = generateNewFileName(fileExtension);

		Path uploadPath = Paths.get("src/main/resources/static/images/facility");
		if (!Files.exists(uploadPath)) {
			Files.createDirectories(uploadPath);
		}

		try (InputStream inputStream = file.getInputStream()) {
			Path filePath = uploadPath.resolve(newFileName);
			Files.copy(inputStream, filePath, StandardCopyOption.REPLACE_EXISTING);
		}

		facility.setImageUrl("/images/facility/" + newFileName);
		return facilityRepository.save(facility);
	}

	private String getFileExtension(String fileName) {
		return fileName.substring(fileName.lastIndexOf('.'));
	}

	private String generateNewFileName(String fileExtension) {
		int maxNumber = 0;
		File folder = new File("src/main/resources/static/images/facility");
		File[] files = folder.listFiles((dir, name) -> name.startsWith("facility") && name.endsWith(fileExtension));

		if (files != null) {
			for (File file : files) {
				String fileName = file.getName();
				int number = Integer.parseInt(fileName.substring(8, fileName.lastIndexOf('.')));
				if (number > maxNumber) {
					maxNumber = number;
				}
			}
		}

		return "facility" + (maxNumber + 1) + fileExtension;
	}
}
