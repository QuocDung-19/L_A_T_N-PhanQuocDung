package com.app.woodshop.feature.product.entity;

import com.app.woodshop.common.enums.ProductStatus;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Entity
@Table(name = "products")
@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long productID;
    String name;
    String description;
    BigDecimal price;
    Integer stock;
    Double length;
    Double width;
    Double height;
    String imageUrl;
    String videosUrl;

    @Enumerated(EnumType.STRING)
    ProductStatus status;
}
