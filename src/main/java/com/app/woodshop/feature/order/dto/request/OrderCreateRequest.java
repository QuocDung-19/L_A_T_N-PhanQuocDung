package com.app.woodshop.feature.order.dto.request;

import lombok.Data;

import java.util.List;

@Data
public class OrderCreateRequest {
    private String userID;
    private List<OrderItem> items;

    @Data
    public static class OrderItem {
        private Long productID;
        private Integer quantity;
    }
}
