package com.woodshop.backend.feature.product.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.woodshop.backend.feature.product.dto.ProductCreateRequest;
import com.woodshop.backend.feature.product.dto.ProductResponse;
import com.woodshop.backend.feature.product.dto.ProductUpdateRequest;
import com.woodshop.backend.feature.product.entity.Category;
import com.woodshop.backend.feature.product.entity.Product;
import com.woodshop.backend.feature.product.repository.CategoryRepository;
import com.woodshop.backend.feature.product.repository.ProductRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepo;
    private final CategoryRepository categoryRepo;

    public ProductResponse createProduct(ProductCreateRequest request) {

        Category category = categoryRepo.findByName(request.getCategoryName())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        Product product = Product.builder()
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .stock(request.getStock())
                .category(category)
                .build();

        productRepo.save(product);

        return map(product);
    }

    public List<ProductResponse> getAll() {
        return productRepo.findAll().stream().map(this::map).toList();
    }

    public ProductResponse getById(String id) {
        Product product = productRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        return map(product);
    }

    public List<ProductResponse> search(String keyword) {
        return productRepo.findByNameContainingIgnoreCase(keyword)
                .stream().map(this::map).toList();
    }

    public ProductResponse updateProduct(String id, ProductUpdateRequest request) {
        Product p = productRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (request.getName() != null) p.setName(request.getName());
        if (request.getDescription() != null) p.setDescription(request.getDescription());
        if (request.getPrice() != null) p.setPrice(request.getPrice());
        if (request.getStock() != null) p.setStock(request.getStock());

        if (request.getCategoryName() != null) {
            Category cat = categoryRepo.findByName(request.getCategoryName())
                    .orElseThrow(() -> new RuntimeException("Category not found"));
            p.setCategory(cat);
        }

        productRepo.save(p);
        return map(p);
    }

    public void deleteProduct(String id) {
        productRepo.deleteById(id);
    }

    private ProductResponse map(Product product) {
        return ProductResponse.builder()
                .productID(product.getProductID())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .stock(product.getStock())
                .category(product.getCategory().getName())
                .build();
    }
}
