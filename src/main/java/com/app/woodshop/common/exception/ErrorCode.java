package com.app.woodshop.common.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

@Getter
@AllArgsConstructor
public enum ErrorCode {
    ORDER_NO_EXISTS(1008,"Order không tồn tại", HttpStatus.BAD_REQUEST),
    PRODUCT_EXISTS(1007,"Product đã tồn tại", HttpStatus.BAD_REQUEST),
    PRODUCT_NO_EXISTS(1006,"Product không tồn tại", HttpStatus.BAD_REQUEST),
    PASSWORD_INVALID(1005,"Mật khẩu không hợp lệ", HttpStatus.BAD_REQUEST),
    AUTHENTICATION(1004,"Token không hợp lệ", HttpStatus.UNAUTHORIZED),
    AUTHORIZED(1003,"Bạn không có quyền truy cập", HttpStatus.FORBIDDEN),
    USER_EXISTS(1002,"User đã tồn tại", HttpStatus.BAD_REQUEST),
    USER_NO_EXISTS(1001,"User không tồn tại", HttpStatus.BAD_REQUEST),
    OTHER_ERROL(9999,"Lỗi khác chưa định nghĩa", HttpStatus.INTERNAL_SERVER_ERROR),
    CATEGORY_NO_EXISTS(1007,"Danh mục không tồn tại",HttpStatus.BAD_REQUEST),

    CATEGORY_NOT_FOUND(1006,"Category không tồn tại", HttpStatus.BAD_REQUEST),
    CATEGORY_EXISTS(1006,"Category không tồn tại", HttpStatus.BAD_REQUEST),
    UNAUTHORIZED(1010, "Bạn chưa đăng nhập hoặc token không hợp lệ", HttpStatus.BAD_REQUEST);

    int code;
    String message;
    HttpStatusCode httpStatus;
}
