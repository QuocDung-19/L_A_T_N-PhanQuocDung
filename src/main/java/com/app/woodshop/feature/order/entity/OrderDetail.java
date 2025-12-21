package com.app.woodshop.feature.order.entity;

import com.app.woodshop.feature.product.entity.Product;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Entity
@Table(name = "order_detail")
@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OrderDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    Long orderDetailID;

    @ManyToOne
    @JoinColumn(name = "orderID", nullable = false)
    Order order;

    @ManyToOne
    @JoinColumn(name = "productID", nullable = false)
    Product product;
    Integer quantity;
    BigDecimal price;
}
