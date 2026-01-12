package com.app.woodshop.feature.product.service;
import com.app.woodshop.common.exception.AppException;
import com.app.woodshop.common.exception.ErrorCode;
import com.app.woodshop.feature.product.dto.request.CategoryRequest;
import com.app.woodshop.feature.product.dto.response.CategoryResponse;
import com.app.woodshop.feature.product.entity.Category;
import com.app.woodshop.feature.product.entity.Product;
import com.app.woodshop.feature.product.mapper.CategoryMapper;
import com.app.woodshop.feature.product.repository.CategoryRepository;
import lombok.*;import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import java.util.List;

@Service@RequiredArgsConstructor@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)public class CategoryService {

    CategoryRepository categoryRepository;
    CategoryMapper categoryMapper;

    public List<CategoryResponse> findAll() {
        return categoryRepository.findAll()
                .stream()
                .map(categoryMapper::toCategoryResponse)
                .toList();
    }

    public CategoryResponse create(CategoryRequest request) {
        if (categoryRepository.existsByName(request.getName()))
            throw new AppException(ErrorCode.CATEGORY_EXISTS);

        Category category = categoryMapper.toCategory(request);

        return categoryMapper.toCategoryResponse(categoryRepository.save(category));
    }

    public CategoryResponse update(Long categoryId, CategoryRequest request) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));

        category.setName(request.getName());
        category.setDescription(request.getDescription());

        return categoryMapper.toCategoryResponse(categoryRepository.save(category));
    }

    public void delete(Long categoryId) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));

        categoryRepository.delete(category);
    }


}