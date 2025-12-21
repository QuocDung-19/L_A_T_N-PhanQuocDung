package com.app.woodshop.feature.product.controller;

import com.app.woodshop.common.ApiResponse;
import com.app.woodshop.feature.product.entity.Product;
import com.app.woodshop.feature.product.service.ProductService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.AccessLevel;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/product")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ProductController {
    ProductService productService;

    // ================= PUBLIC (User, Customer, Staff, Admin) =================
    @GetMapping
    ApiResponse<List<Product>> findAll() {
        return ApiResponse.<List<Product>>builder()
                .message("Lấy danh sách sản phẩm")
                .result(productService.findAll())
                .build();
    }

    @GetMapping("/{productID}")
    ApiResponse<Product> findById(@PathVariable Long productID) {
        return ApiResponse.<Product>builder()
                .message("Lấy sản phẩm:" + productID)
                .result(productService.findById(productID))
                .build();
    }

    // ==================== ADMIN ONLY ====================
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<Product> create(
            @RequestPart("product") String productJson,
            @RequestPart(value = "image", required = false) MultipartFile image,
            @RequestPart(value = "video", required = false) MultipartFile video
    ) throws Exception {

        ObjectMapper mapper = new ObjectMapper();
        Product product = mapper.readValue(productJson, Product.class);

        product.setProductID(null);

        return ApiResponse.<Product>builder()
                .message("Tạo sản phẩm: " + product.getName())
                .result(productService.create(product, image, video))
                .build();
    }


    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{productID}")
    ApiResponse<Product> update(@RequestBody Product product) {
        return ApiResponse.<Product>builder()
                .message("Cập nhật sản phẩm: " + product.getProductID())
                .result(productService.update(product))
                .build();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{productID}")
    ApiResponse<String> delete(@PathVariable Long productID) {
        productService.delete(productID);
        return ApiResponse.<String>builder()
                .message("Xóa sản phẩm: " + productID)
                .build();
    }
}
