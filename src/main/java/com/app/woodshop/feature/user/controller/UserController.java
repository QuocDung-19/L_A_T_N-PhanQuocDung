package com.app.woodshop.feature.user.controller;

import com.app.woodshop.common.ApiResponse;
import com.app.woodshop.feature.user.dto.request.UserRequest;
import com.app.woodshop.feature.user.dto.response.UserResponse;
import com.app.woodshop.feature.user.service.UserService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserController {

    UserService userService;

    // CHỈ ADMIN được xem danh sách user
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    ApiResponse<List<UserResponse>> findAll() {
        return ApiResponse.<List<UserResponse>>builder()
                .message("Lấy danh sách người dùng")
                .result(userService.findAll())
                .build();
    }

    // PUBLIC: ai cũng tạo tài khoản được
    @PostMapping
    ApiResponse<UserResponse> create(@RequestBody UserRequest request) {
        return ApiResponse.<UserResponse>builder()
                .message("Đăng kí người dùng: " + request.getFullName())
                .result(userService.create(request))
                .build();
    }

    // USER chỉ được xem chính họ, ADMIN xem tất cả
    @PreAuthorize("hasAnyRole('ADMIN','CUSTOMER')")
    @GetMapping("/{userID}")
    ApiResponse<UserResponse> findByID(@PathVariable String userID) {
        return ApiResponse.<UserResponse>builder()
                .message("Tìm người dùng dựa vào ID: " + userID)
                .result(userService.findById(userID))
                .build();
    }

    // USER chỉ update chính họ, ADMIN update bất kỳ ai
    @PreAuthorize("hasAnyRole('ADMIN','CUSTOMER')")
    @PutMapping("/{userID}")
    ApiResponse<UserResponse> update(@PathVariable String userID,
                                     @RequestBody UserRequest request) {
        return ApiResponse.<UserResponse>builder()
                .message("Cập nhật người dùng: " + userID)
                .result(userService.update(userID, request))
                .build();
    }

    // CHỈ ADMIN được xóa user
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{userID}")
    ApiResponse<String> delete(@PathVariable String userID) {
        userService.delete(userID);
        return ApiResponse.<String>builder()
                .message("Xóa người dùng: " + userID)
                .result(userID)
                .build();
    }

    @PreAuthorize("hasAnyRole('CUSTOMER','ADMIN','STAFF')")
    @GetMapping("/profile")
    ApiResponse<UserResponse> me(Authentication auth) {
        String userID = auth.getName();
        return ApiResponse.<UserResponse>builder()
                .message("Thông tin người dùng hiện tại")
                .result(userService.findById(userID))
                .build();
    }

    @PreAuthorize("hasAnyRole('CUSTOMER','ADMIN','STAFF')")
    @PutMapping("/profile")
    ApiResponse<UserResponse> updateMe(
            Authentication auth,
            @RequestBody UserRequest request) {

        String userID = auth.getName();
        return ApiResponse.<UserResponse>builder()
                .message("Cập nhật thông tin cá nhân")
                .result(userService.update(userID, request))
                .build();
    }
}