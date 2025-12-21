package com.app.woodshop.feature.order.dto.response;

import com.app.woodshop.common.enums.OrderStatus;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
public class OrderResponse {
    private Long orderID;
    private String userID;
    private LocalDate orderDate;
    private BigDecimal totalAmount;
    private OrderStatus status;
    private List<OrderItemResponse> items;

    @Data
    @Builder
    public static class OrderItemResponse {
        private Long productID;
        private Integer quantity;
        private BigDecimal price;
    }
}
