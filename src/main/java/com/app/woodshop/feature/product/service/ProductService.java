package com.app.woodshop.feature.product.service;

import com.app.woodshop.common.exception.AppException;
import com.app.woodshop.common.exception.ErrorCode;
import com.app.woodshop.feature.product.dto.request.ProductRequest;
import com.app.woodshop.feature.product.entity.Category;
import com.app.woodshop.feature.product.entity.Product;
import com.app.woodshop.feature.product.repository.CategoryRepository;
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
    CategoryRepository categoryRepository;

    // =================== EXISTING (KHÔNG ĐỤNG) ===================
    public Product create(ProductRequest request,
                          MultipartFile image,
                          MultipartFile video) {

        if (productRepository.existsByName(request.getName()))
            throw new AppException(ErrorCode.PRODUCT_EXISTS);

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));

        Product product = Product.builder()
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .stock(request.getStock())
                .piecesNumber(request.getPiecesNumber())
                .length(request.getLength())
                .width(request.getWidth())
                .height(request.getHeight())
                .imageUrl(request.getImageUrl())       // thêm dòng này
                .videosUrl(request.getVideosUrl())
                .status(request.getStatus())
                .category(category)
                .build();

        handleUpload(product, image, video);
        return productRepository.save(product);
    }


    public Product update(Long productId,
                          ProductRequest request,
                          MultipartFile image,
                          MultipartFile video) {

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NO_EXISTS));

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setStock(request.getStock());
        product.setPiecesNumber(request.getPiecesNumber());
        product.setLength(request.getLength());
        product.setWidth(request.getWidth());
        product.setHeight(request.getHeight());
        product.setStatus(request.getStatus());
        product.setCategory(category);

        if (image != null && !image.isEmpty()) {
            product.setImageUrl(storeFile(image, "images"));
        } else if (request.getImageUrl() != null && !request.getImageUrl().isEmpty()) {
            product.setImageUrl(request.getImageUrl());
        }

        if (video != null && !video.isEmpty()) {
            product.setVideosUrl(storeFile(video, "videos"));
        } else if (request.getVideosUrl() != null && !request.getVideosUrl().isEmpty()) {
            product.setVideosUrl(request.getVideosUrl());
        }

        return productRepository.save(product);
    }
    public List<Product> findAll() {
        return productRepository.findAll();
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
