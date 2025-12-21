package com.app.woodshop.feature.order.service;

import com.app.woodshop.common.exception.AppException;
import com.app.woodshop.common.exception.ErrorCode;
import com.app.woodshop.feature.order.entity.News;
import com.app.woodshop.feature.order.repository.NewsRepository;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.AccessLevel;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class NewsService {

    NewsRepository newsRepository;

    public List<News> findAll() {
        return newsRepository.findAll();
    }

    public News findById(Long newsID) {
        return newsRepository.findById(newsID)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NO_EXISTS)); // reuse code
    }

    public News create(News news, MultipartFile image) {
        if (newsRepository.existsByTitle(news.getTitle()))
            throw new AppException(ErrorCode.PRODUCT_EXISTS);

        handleUpload(news, image);
        return newsRepository.save(news);
    }

    public News update(News news, MultipartFile image) {
        if (!newsRepository.existsById(news.getNewsID()))
            throw new AppException(ErrorCode.PRODUCT_NO_EXISTS);

        handleUpload(news, image);
        return newsRepository.save(news);
    }

    public void delete(Long newsID) {
        News news = newsRepository.findById(newsID)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NO_EXISTS));
        newsRepository.delete(news);
    }

    // ---------- PRIVATE HELPER ----------
    private void handleUpload(News news, MultipartFile image) {
        if (image != null && !image.isEmpty()) {
            news.setImageUrl(storeFile(image, "news-images"));
        }
    }

    private String storeFile(MultipartFile file, String folder) {
        try {
            String uploadDir = "uploads/" + folder;
            File dir = new File(uploadDir);
            if (!dir.exists()) dir.mkdirs();

            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            Path path = Paths.get(uploadDir, fileName);
            Files.copy(file.getInputStream(), path);

            return "/uploads/" + folder + "/" + fileName;

        } catch (IOException e) {
            throw new RuntimeException("Không thể lưu file", e);
        }
    }
}
