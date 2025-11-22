package com.woodshop.backend.feature.admin.dto;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AdminProductResponse {
    String productID;
    String name;
    String description;
    Double price;
    Integer stock;
    String category;
    String categoryID;        // ID hoặc code
    String categoryName;
}
