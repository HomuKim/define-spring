// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.stereotype.Service;
// import org.springframework.web.multipart.MultipartFile;

// import com.example.definethebody.model.Trainer;
// import com.example.definethebody.repository.TrainerRepository;

// import java.io.IOException;
// import java.io.InputStream;
// import java.nio.file.Files;
// import java.nio.file.Path;
// import java.nio.file.Paths;
// import java.nio.file.StandardCopyOption;
// import java.util.List;
// import java.util.Optional;
// import java.util.UUID;

// @Service
// public class TrainerService {
//     @Autowired
//     private TrainerRepository trainerRepository;

//     private final String IMAGE_UPLOAD_DIR = "/var/www/definethebody/images/member/";

//     public List<Trainer> getAllTrainers() {
//         return trainerRepository.findAll();
//     }

//     // 트레이너 상세 조회(예시)
//     public Trainer getTrainerById(Long trainerId) {
//         return trainerRepository.findById(trainerId)
//                 .orElseThrow(() -> new RuntimeException("트레이너를 찾을 수 없습니다. ID: " + trainerId));
//     }

//     // 트레이너 이미지 업로드
//     public String uploadTrainerImage(Long trainerId, MultipartFile file, String imageType) throws IOException {
//         if (file.isEmpty())
//             throw new IOException("파일이 비어 있습니다.");
//         String fileExtension = getFileExtension(file.getOriginalFilename());
//         if (!isAllowedExtension(fileExtension))
//             throw new IOException("허용되지 않은 파일 확장자입니다.");

//         String newFileName = UUID.randomUUID().toString() + "." + fileExtension;
//         Path uploadPath = Paths.get(IMAGE_UPLOAD_DIR);
//         if (!Files.exists(uploadPath))
//             Files.createDirectories(uploadPath);

//         Path filePath = uploadPath.resolve(newFileName);
//         try (InputStream inputStream = file.getInputStream()) {
//             Files.copy(inputStream, filePath, StandardCopyOption.REPLACE_EXISTING);
//         }

//         Trainer trainer = trainerRepository.findById(trainerId)
//                 .orElseThrow(() -> new RuntimeException("트레이너를 찾을 수 없습니다. ID: " + trainerId));

//         String imagePath = "/images/member/" + newFileName;

//         if ("thumbnail".equals(imageType)) {
//             trainer.setThumbnailImage(imagePath);
//         } else if ("profile".equals(imageType)) {
//             trainer.getProfileImages().add(imagePath);
//         } else if ("career".equals(imageType)) {
//             trainer.setCareerImage(imagePath);
//         } else if ("review".equals(imageType)) {
//             trainer.getReviewImages().add(imagePath);
//         }
//         trainerRepository.save(trainer);

//         return imagePath;
//     }

//     // 트레이너 이미지 삭제(예시)
//     public void deleteTrainerImage(Long trainerId, String imageType, String imagePath) throws IOException {
//         Trainer trainer = trainerRepository.findById(trainerId)
//                 .orElseThrow(() -> new RuntimeException("트레이너를 찾을 수 없습니다. ID: " + trainerId));
//         // 실제 파일 삭제 및 DB 경로 삭제 로직 추가 필요
//     }

//     // 파일 확장자 추출
//     private String getFileExtension(String fileName) {
//         return Optional.ofNullable(fileName)
//                 .filter(f -> f.contains("."))
//                 .map(f -> f.substring(f.lastIndexOf(".") + 1).toLowerCase())
//                 .orElse("");
//     }

//     // 허용 확장자 확인
//     private boolean isAllowedExtension(String ext) {
//         return List.of("jpg", "jpeg", "png", "gif").contains(ext);
//     }
// }
