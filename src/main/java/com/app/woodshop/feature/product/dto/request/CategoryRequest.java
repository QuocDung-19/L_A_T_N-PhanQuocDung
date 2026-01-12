package com.app.woodshop.feature.product.dto.request;
import lombok.*;import lombok.experimental.FieldDefaults;
@Data@Builder@NoArgsConstructor@AllArgsConstructor@FieldDefaults(level = AccessLevel.PRIVATE)
public class CategoryRequest {
    Long categoryId;
    String name;
    String description;
}