package com.woodshop.backend.feature.order.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.woodshop.backend.feature.order.dto.OrderCreateRequest;
import com.woodshop.backend.feature.order.dto.OrderResponse;
import com.woodshop.backend.feature.order.dto.OrderUpdateStatusRequest;
import com.woodshop.backend.feature.order.service.OrderService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService service;

    @PostMapping
    public OrderResponse create(@RequestBody OrderCreateRequest request) {
        return service.createOrder(request);
    }

    @GetMapping("/user/{userId}")
    public List<OrderResponse> getUserOrders(@PathVariable String userId) {
        return service.getOrdersOfUser(userId);
    }

    @GetMapping
    public List<OrderResponse> getAll() {
        return service.getAll();
    }

    @PutMapping("/{orderId}/status")
    public OrderResponse updateStatus(
            @PathVariable String orderId,
            @RequestBody OrderUpdateStatusRequest request
    ) {
        return service.updateStatus(orderId, request);
    }
}
