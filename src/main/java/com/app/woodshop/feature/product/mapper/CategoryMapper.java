package com.app.woodshop.feature.product.mapper;
import com.app.woodshop.feature.product.dto.request.CategoryRequest;
import com.app.woodshop.feature.product.dto.response.CategoryResponse;
import com.app.woodshop.feature.product.entity.Category;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")public interface CategoryMapper {

    Category toCategory(CategoryRequest request);

    @Mapping(source = "categoryID", target = "categoryId")
    CategoryResponse toCategoryResponse(Category category);
}