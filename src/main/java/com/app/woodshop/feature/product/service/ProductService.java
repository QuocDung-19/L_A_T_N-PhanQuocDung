package com.app.woodshop.feature.product.service;

import com.app.woodshop.common.exception.AppException;
import com.app.woodshop.common.exception.ErrorCode;
import com.app.woodshop.feature.product.entity.Product;
import com.app.woodshop.feature.product.repository.ProductRepository;
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
public class ProductService {

    ProductRepository productRepository;

    // =================== EXISTING (KHÔNG ĐỤNG) ===================
    public List<Product> findAll() {
        return productRepository.findAll();
    }

    public Product create(Product product) {
        if (productRepository.existsByName(product.getName()))
            throw new AppException(ErrorCode.PRODUCT_EXISTS);

        return productRepository.save(product);
    }

    public Product update(Product request) {
        if (!productRepository.existsById(request.getProductID()))
            throw new AppException(ErrorCode.PRODUCT_NO_EXISTS);

        return productRepository.save(request);
    }

    public Product findById(Long productID) {
        return productRepository.findById(productID)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NO_EXISTS));
    }

    public void delete(Long productID) {
        Product product = productRepository.findById(productID)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NO_EXISTS));
        productRepository.delete(product);
    }

    // =================== NEW (UPLOAD FILE) ===================

    public Product create(Product product,
                          MultipartFile image,
                          MultipartFile video) {

        if (productRepository.existsByName(product.getName()))
            throw new AppException(ErrorCode.PRODUCT_EXISTS);

        handleUpload(product, image, video);
        return productRepository.save(product);
    }

    public Product update(Product product,
                          MultipartFile image,
                          MultipartFile video) {

        if (!productRepository.existsById(product.getProductID()))
            throw new AppException(ErrorCode.PRODUCT_NO_EXISTS);

        handleUpload(product, image, video);
        return productRepository.save(product);
    }

    // =================== PRIVATE HELPER ===================

    private void handleUpload(Product product,
                              MultipartFile image,
                              MultipartFile video) {

        if (image != null && !image.isEmpty()) {
            product.setImageUrl(storeFile(image, "images"));
        }

        if (video != null && !video.isEmpty()) {
            product.setVideosUrl(storeFile(video, "videos"));
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
