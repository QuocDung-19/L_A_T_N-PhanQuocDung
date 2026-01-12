package com.app.woodshop.feature.product.dto.response;

import com.app.woodshop.common.enums.ProductStatus;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductResponse {

    Long productID;
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


    Long categoryId;
    String categoryName;
}

