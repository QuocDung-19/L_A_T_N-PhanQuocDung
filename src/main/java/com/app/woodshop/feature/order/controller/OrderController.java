package com.app.woodshop.feature.order.controller;

import com.app.woodshop.common.ApiResponse;
import com.app.woodshop.common.enums.OrderStatus;
import com.app.woodshop.feature.order.dto.request.OrderCreateRequest;
import com.app.woodshop.feature.order.dto.response.OrderResponse;
import com.app.woodshop.feature.order.entity.Order;
import com.app.woodshop.feature.order.service.OrderService;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.AccessLevel;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/order")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class OrderController {

    OrderService orderService;

    // Admin và Staff xem tất cả đơn hàng
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    @GetMapping
    ApiResponse<List<OrderResponse>> findAll() {
        return ApiResponse.<List<OrderResponse>>builder()
                .message("Danh sách tất cả đơn hàng")
                .result(orderService.findAll())
                .build();
    }

    // User xem đơn hàng của chính họ
    @PreAuthorize("hasAnyRole('ADMIN','CUSTOMER')")
    @GetMapping("/user/{userID}")
    ApiResponse<List<OrderResponse>> findByUser(
            @PathVariable String userID,
            @RequestParam(required = false) OrderStatus status) {

        return ApiResponse.<List<OrderResponse>>builder()
                .message("Danh sách đơn hàng")
                .result(orderService.findByUserAndStatus(userID, status))
                .build();
    }


    @PreAuthorize("hasRole('CUSTOMER')")
    @PostMapping
    ApiResponse<OrderResponse> create(@RequestBody OrderCreateRequest request) {
        return ApiResponse.<OrderResponse>builder()
                .message("Tạo đơn hàng thành công")
                .result(orderService.create(request))
                .build();
    }

    // Admin, Staff mới được xem chi tiết *bất kỳ*
    // Customer chỉ xem được đơn của họ
    @PreAuthorize("hasAnyRole('ADMIN','CUSTOMER','STAFF')")
    @GetMapping("/{orderID}")
    ApiResponse<OrderResponse> findById(@PathVariable Long orderID) {
        return ApiResponse.<OrderResponse>builder()
                .message("Lấy đơn hàng: " + orderID)
                .result(orderService.findById(orderID))
                .build();
    }

    // Chỉ staff và admin cập nhật trạng thái
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    @PatchMapping("/{orderID}/status/{status}")
    ApiResponse<OrderResponse> updateStatus(@PathVariable Long orderID,
                                            @PathVariable OrderStatus status) {
        return ApiResponse.<OrderResponse>builder()
                .message("Cập nhật đơn hàng: " + status.name())
                .result(orderService.updateStatus(orderID, status))
                .build();
    }

    // Staff / Admin xác nhận thanh toán
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    @PatchMapping("/{orderID}/confirm-payment")
    ApiResponse<OrderResponse> confirmPayment(@PathVariable Long orderID) {

        return ApiResponse.<OrderResponse>builder()
                .message("Xác nhận thanh toán cho đơn hàng")
                .result(orderService.confirmPayment(orderID))
                .build();
    }

}
