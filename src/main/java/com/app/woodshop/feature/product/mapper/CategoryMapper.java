package com.app.woodshop.feature.product.mapper;
import com.app.woodshop.feature.product.dto.request.CategoryRequest;import com.app.woodshop.feature.product.dto.response.CategoryResponse;import com.app.woodshop.feature.product.entity.Category;import org.mapstruct.Mapper;
@Mapper(componentModel = "spring")public interface CategoryMapper {

    Category toCategory(CategoryRequest request);

    CategoryResponse toCategoryResponse(Category category);
}