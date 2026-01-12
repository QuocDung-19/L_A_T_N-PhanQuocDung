package com.app.woodshop.feature.product.controller;

import com.app.woodshop.common.ApiResponse;
import com.app.woodshop.feature.product.dto.request.CategoryRequest;
import com.app.woodshop.feature.product.dto.response.CategoryResponse;
import com.app.woodshop.feature.product.entity.Category;
import com.app.woodshop.feature.product.entity.Product;
import com.app.woodshop.feature.product.service.CategoryService;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/category")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CategoryController {

    CategoryService categoryService;

    @GetMapping
    ApiResponse<List<CategoryResponse>> findAll() {
        return ApiResponse.<List<CategoryResponse>>builder()
                .message("Danh sách danh mục")
                .result(categoryService.findAll())
                .build();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    ApiResponse<CategoryResponse> create(@RequestBody CategoryRequest request) {
        return ApiResponse.<CategoryResponse>builder()
                .message("Tạo danh mục mới")
                .result(categoryService.create(request))
                .build();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    ApiResponse<CategoryResponse> update(
            @PathVariable Long id,
            @RequestBody CategoryRequest request) {

        return ApiResponse.<CategoryResponse>builder()
                .message("Cập nhật danh mục")
                .result(categoryService.update(id, request))
                .build();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    ApiResponse<String> delete(@PathVariable Long id) {
        categoryService.delete(id);
        return ApiResponse.<String>builder()
                .message("Xóa thành công")
                .result("OK")
                .build();
    }
}