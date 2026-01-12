package com.app.woodshop.feature.product.dto.request;

import com.app.woodshop.common.enums.ProductStatus;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonIgnoreProperties(ignoreUnknown = true)
public class ProductRequest {

    String name;
    String description;
    BigDecimal price;
    Integer stock;
    Integer piecesNumber;
    Double length;
    Double width;
    Double height;
    ProductStatus status;
    String imageUrl;
    String videosUrl;

    private Long categoryId;
}
