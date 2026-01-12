package com.app.woodshop.feature.product.controller;

import com.app.woodshop.common.ApiResponse;
import com.app.woodshop.feature.product.dto.request.ProductRequest;
import com.app.woodshop.feature.product.dto.response.ProductResponse;
import com.app.woodshop.feature.product.entity.Product;
import com.app.woodshop.feature.product.mapper.ProductMapper;
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
    ProductMapper productMapper;

    // ================= PUBLIC (User, Customer, Staff, Admin) =================
    @GetMapping
    ApiResponse<List<ProductResponse>> findAll() {
        return ApiResponse.<List<ProductResponse>>builder()
                .message("Lấy danh sách sản phẩm")
                .result(productMapper.toProductResponseList(productService.findAll()))
                .build();
    }


    @GetMapping("/{productID}")
    ApiResponse<ProductResponse> findById(@PathVariable Long productID) {
        Product product = productService.findById(productID);
        ProductResponse response = productMapper.toProductResponse(product);
        return ApiResponse.<ProductResponse>builder()
                .message("Lấy sản phẩm:" + productID)
                .result(response)
                .build();
    }


    // ==================== ADMIN ONLY ====================
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<ProductResponse> create(
            @RequestPart("product") String productJson,
            @RequestPart(value = "image", required = false) MultipartFile image,
            @RequestPart(value = "video", required = false) MultipartFile video
    ) throws Exception {

        ObjectMapper mapper = new ObjectMapper();
        ProductRequest request = mapper.readValue(productJson, ProductRequest.class);

        Product product = productService.create(request, image, video);

        ProductResponse response = productMapper.toProductResponse(product);

        return ApiResponse.<ProductResponse>builder()
                .message("Tạo sản phẩm: " + product.getName())
                .result(response)
                .build();
    }


    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping(value = "/{productID}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<ProductResponse> update(
            @PathVariable Long productID,
            @RequestPart("product") String productJson,
            @RequestPart(value = "image", required = false) MultipartFile image,
            @RequestPart(value = "video", required = false) MultipartFile video
    ) throws Exception {

        ObjectMapper mapper = new ObjectMapper();
        ProductRequest request = mapper.readValue(productJson, ProductRequest.class);

        Product product = productService.update(productID, request, image, video);

        ProductResponse response = productMapper.toProductResponse(product);

        return ApiResponse.<ProductResponse>builder()
                .message("Cập nhật sản phẩm: " + product.getName())
                .result(response)
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
