package com.app.woodshop.feature.order.service;

import com.app.woodshop.common.enums.OrderStatus;
import com.app.woodshop.common.enums.PaymentStatus;
import com.app.woodshop.common.exception.AppException;
import com.app.woodshop.common.exception.ErrorCode;
import com.app.woodshop.feature.order.dto.request.OrderCreateRequest;
import com.app.woodshop.feature.order.dto.response.OrderResponse;
import com.app.woodshop.feature.order.entity.Order;
import com.app.woodshop.feature.order.entity.OrderDetail;
import com.app.woodshop.feature.order.mapper.OrderMapper;
import com.app.woodshop.feature.product.entity.Product;
import com.app.woodshop.feature.product.repository.ProductRepository;
import com.app.woodshop.feature.order.repository.OrderRepository;
import com.app.woodshop.feature.user.repository.UserRepository;
import com.app.woodshop.feature.user.entity.User;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.AccessLevel;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class OrderService {

    OrderRepository orderRepository;
    ProductRepository productRepository;
    UserRepository userRepository;
    OrderMapper orderMapper;

    // ================== QUERY ==================

    public List<OrderResponse> findAll() {
        return orderRepository.findAll().stream()
                .map(orderMapper::toOrderResponse)
                .collect(Collectors.toList());
    }

    public List<OrderResponse> findByUserAndStatus(String userID, OrderStatus status) {
        User user = userRepository.findById(userID)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NO_EXISTS));

        List<Order> orders = (status == null)
                ? orderRepository.findByUser(user)
                : orderRepository.findByUserAndStatus(user, status);

        return orders.stream()
                .map(orderMapper::toOrderResponse)
                .collect(Collectors.toList());
    }

    public OrderResponse findById(Long orderID) {
        Order order = orderRepository.findById(orderID)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NO_EXISTS));

        return orderMapper.toOrderResponse(order);
    }

    // ================== CREATE ==================

    public OrderResponse create(OrderCreateRequest request) {

        User user = userRepository.findById(request.getUserID())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NO_EXISTS));

        List<OrderDetail> details = request.getItems().stream().map(item -> {

            Product product = productRepository.findById(item.getProductID())
                    .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NO_EXISTS));

            if (item.getPrice() == null || item.getQuantity() == null) {
                throw new AppException(ErrorCode.INVALID_REQUEST);
            }

            BigDecimal unitPrice = item.getPrice(); // giá 1 kiện
            BigDecimal quantity = BigDecimal.valueOf(item.getQuantity());

            BigDecimal finalPrice = unitPrice.multiply(quantity);

            return OrderDetail.builder()
                    .product(product)
                    .quantity(item.getQuantity())
                    .price(finalPrice) 
                    .build();

        }).collect(Collectors.toList());


        BigDecimal totalAmount = details.stream()
                .map(OrderDetail::getPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Order order = Order.builder()
                .user(user)
                .orderDate(LocalDate.now())
                .status(OrderStatus.PENDING)
                .paymentStatus(PaymentStatus.UNPAID)
                .totalAmount(totalAmount)
                .orderDetails(details)
                .build();

        details.forEach(d -> d.setOrder(order));

        return orderMapper.toOrderResponse(orderRepository.save(order));
    }

    // ================== UPDATE ==================

    // Staff / Admin xác nhận đơn
    public OrderResponse updateStatus(Long orderID, OrderStatus status) {

        Order order = orderRepository.findById(orderID)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NO_EXISTS));

        // Không cho hủy khi đã thanh toán
        if (order.getPaymentStatus() == PaymentStatus.PAID
                && status == OrderStatus.CANCELLED) {
            throw new AppException(ErrorCode.INVALID_REQUEST);
        }

        order.setStatus(status);
        return orderMapper.toOrderResponse(orderRepository.save(order));
    }

    // Staff / Admin xác nhận thanh toán
    public OrderResponse confirmPayment(Long orderID) {

        Order order = orderRepository.findById(orderID)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NO_EXISTS));

        if (order.getStatus() != OrderStatus.CONFIRMED) {
            throw new AppException(ErrorCode.INVALID_REQUEST);
        }

        order.setPaymentStatus(PaymentStatus.PAID);
        return orderMapper.toOrderResponse(orderRepository.save(order));
    }
}
