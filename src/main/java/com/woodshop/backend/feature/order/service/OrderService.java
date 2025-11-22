package com.woodshop.backend.feature.order.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.woodshop.backend.feature.order.dto.OrderCreateRequest;
import com.woodshop.backend.feature.order.dto.OrderResponse;
import com.woodshop.backend.feature.order.dto.OrderUpdateStatusRequest;
import com.woodshop.backend.feature.order.entity.Order;
import com.woodshop.backend.feature.order.entity.OrderItem;
import com.woodshop.backend.feature.order.entity.OrderStatus;
import com.woodshop.backend.feature.order.repository.OrderItemRepository;
import com.woodshop.backend.feature.order.repository.OrderRepository;
import com.woodshop.backend.feature.product.entity.Product;
import com.woodshop.backend.feature.product.repository.ProductRepository;
import com.woodshop.backend.feature.user.entity.User;
import com.woodshop.backend.feature.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepo;
    private final OrderItemRepository itemRepo;
    private final ProductRepository productRepo;
    private final UserRepository userRepo;

    public OrderResponse createOrder(OrderCreateRequest request) {

        User user = userRepo.findById(request.getUserID())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Order order = Order.builder()
                .customer(user)
                .status(OrderStatus.PENDING)
                .totalPrice(0.0)
                .build();

        orderRepo.save(order);

        List<OrderItem> items = new ArrayList<>();
        double total = 0;

        for (var reqItem : request.getItems()) {

            Product product = productRepo.findById(reqItem.getProductID())
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            double price = product.getPrice();

            OrderItem item = OrderItem.builder()
                    .order(order)
                    .product(product)
                    .quantity(reqItem.getQuantity())
                    .price(price)
                    .build();

            items.add(item);
            total += price * reqItem.getQuantity();
        }

        itemRepo.saveAll(items);

        order.setItems(items);
        order.setTotalPrice(total);
        orderRepo.save(order);

        return map(order);
    }

    public List<OrderResponse> getOrdersOfUser(String userId) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return orderRepo.findByCustomer(user).stream().map(this::map).toList();
    }

    public List<OrderResponse> getAll() {
        return orderRepo.findAll().stream().map(this::map).toList();
    }

    public OrderResponse updateStatus(String orderId, OrderUpdateStatusRequest request) {
        Order order = orderRepo.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        order.setStatus(request.getStatus());
        orderRepo.save(order);

        return map(order);
    }

    private OrderResponse map(Order o) {
        return OrderResponse.builder()
                .orderID(o.getOrderID())
                .userID(o.getCustomer().getUserID())
                .totalPrice(o.getTotalPrice())
                .status(o.getStatus().name())
                .items(
                        o.getItems().stream()
                                .map(item -> OrderResponse.OrderItemResponse.builder()
                                        .productID(item.getProduct().getProductID())
                                        .productName(item.getProduct().getName())
                                        .quantity(item.getQuantity())
                                        .price(item.getPrice())
                                        .build())
                                .toList()
                )
                .build();
    }

}
