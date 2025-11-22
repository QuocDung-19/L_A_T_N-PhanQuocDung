package com.woodshop.backend.feature.admin.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.woodshop.backend.feature.admin.dto.AdminContentResponse;
import com.woodshop.backend.feature.admin.dto.AdminOrderResponse;
import com.woodshop.backend.feature.admin.dto.AdminProductResponse;
import com.woodshop.backend.feature.admin.dto.AdminUserResponse;
import com.woodshop.backend.feature.order.repository.OrderRepository;
import com.woodshop.backend.feature.product.repository.ProductRepository;
import com.woodshop.backend.feature.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepo;
    private final ProductRepository productRepo;
    private final OrderRepository orderRepo;
    // private final ContentRepository contentRepo; // nếu có module content

    // -------- User --------
    public List<AdminUserResponse> getAllUsers() {
        return userRepo.findAll().stream().map(user ->
                AdminUserResponse.builder()
                        .userID(user.getUserID())
                        .username(user.getUsername())
                        .phone(user.getPhone())
                        .gmail(user.getGmail())
                        .role(user.getRole().getName())
                        .build()
        ).toList();
    }

    // -------- Product --------
    public List<AdminProductResponse> getAllProducts() {
        return productRepo.findAll().stream().map(p ->
                AdminProductResponse.builder()
                        .productID(p.getProductID())
                        .name(p.getName())
                        .description(p.getDescription())
                        .price(p.getPrice())
                        .stock(p.getStock())
                        .category(p.getCategory().getName())
                        .build()
        ).toList();
    }

    // -------- Order --------
    public List<AdminOrderResponse> getAllOrders() {
        return orderRepo.findAll().stream().map(o ->
                AdminOrderResponse.builder()
                        .orderID(o.getOrderID())
                        .userID(o.getCustomer().getUserID())
                        .totalPrice(o.getTotalPrice())
                        .status(o.getStatus().name())
                        .items(
                                o.getItems().stream().map(item ->
                                        AdminOrderResponse.OrderItem.builder()
                                                .productID(item.getProduct().getProductID())
                                                .productName(item.getProduct().getName())
                                                .quantity(item.getQuantity())
                                                .price(item.getPrice())
                                                .build()
                                ).toList()
                        )
                        .build()
        ).toList();
    }

    // -------- Content --------
    public List<AdminContentResponse> getAllContent() {
        // giả sử bạn có contentRepo
        // return contentRepo.findAll().stream().map(c -> AdminContentResponse.builder()...)
        return List.of(); // tạm thời trả về empty
    }
}
