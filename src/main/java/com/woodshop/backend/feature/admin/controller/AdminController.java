package com.woodshop.backend.feature.admin.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.woodshop.backend.feature.admin.dto.AdminContentResponse;
import com.woodshop.backend.feature.admin.dto.AdminOrderResponse;
import com.woodshop.backend.feature.admin.dto.AdminProductResponse;
import com.woodshop.backend.feature.admin.dto.AdminUserResponse;
import com.woodshop.backend.feature.admin.service.AdminService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService service;

    @GetMapping("/users")
    public List<AdminUserResponse> getAllUsers() {
        return service.getAllUsers();
    }

    @GetMapping("/products")
    public List<AdminProductResponse> getAllProducts() {
        return service.getAllProducts();
    }

    @GetMapping("/orders")
    public List<AdminOrderResponse> getAllOrders() {
        return service.getAllOrders();
    }

    @GetMapping("/content")
    public List<AdminContentResponse> getAllContent() {
        return service.getAllContent();
    }
}
