package com.app.woodshop.feature.product.mapper;

import com.app.woodshop.feature.product.dto.response.ProductResponse;
import com.app.woodshop.feature.product.entity.Product;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ProductMapper {


    @Mapping(source = "category.categoryID", target = "categoryId")
    @Mapping(source = "category.name", target = "categoryName")
    @Mapping(source = "status", target = "status")
    @Mapping(source = "length", target = "length")
    @Mapping(source = "width", target = "width")
    @Mapping(source = "height", target = "height")
    ProductResponse toProductResponse(Product product);

    List<ProductResponse> toProductResponseList(List<Product> products);
}

