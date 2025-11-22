package com.woodshop.backend.feature.order;

import com.woodshop.backend.feature.order.dto.OrderCreateRequest;
import com.woodshop.backend.feature.order.dto.OrderCreateRequest.Item;
import com.woodshop.backend.feature.order.dto.OrderResponse;
import com.woodshop.backend.feature.order.dto.OrderUpdateStatusRequest;
import com.woodshop.backend.feature.order.entity.OrderStatus;
import com.woodshop.backend.feature.order.repository.OrderRepository;
import com.woodshop.backend.feature.order.service.OrderService;
import com.woodshop.backend.feature.product.entity.Product;
import com.woodshop.backend.feature.product.repository.ProductRepository;
import com.woodshop.backend.feature.user.entity.User;
import com.woodshop.backend.feature.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class OrderServiceTest {

    @Autowired
    OrderService orderService;

    @Autowired
    OrderRepository orderRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    ProductRepository productRepository;

    private User testUser;
    private Product testProduct;

    @BeforeEach
    void setUp() {
        orderRepository.deleteAll();
        userRepository.deleteAll();
        productRepository.deleteAll();

        // tạo user dummy
        testUser = User.builder()
                .username("user1")
                .gmail("user1@test.com")
                .phone("123456")
                .build();
        userRepository.save(testUser);

        // tạo product dummy
        testProduct = Product.builder()
                .name("Test Product")
                .description("Test Desc")
                .price(100.0)
                .stock(10)
                .build();
        productRepository.save(testProduct);
    }

    @Test
    void testCreateAndGetOrder() {
        OrderCreateRequest request = new OrderCreateRequest();
        request.setUserID(testUser.getUserID());
        request.setItems(List.of(new Item(testProduct.getProductID(), 2)));

        OrderResponse created = orderService.createOrder(request);
        assertNotNull(created.getOrderID());
        assertEquals(200.0, created.getTotalPrice());

        List<OrderResponse> userOrders = orderService.getOrdersOfUser(testUser.getUserID());
        assertEquals(1, userOrders.size());
        assertEquals(created.getOrderID(), userOrders.get(0).getOrderID());
    }

    @Test
    void testUpdateStatus() {
        OrderCreateRequest request = new OrderCreateRequest();
        request.setUserID(testUser.getUserID());
        request.setItems(List.of(new Item(testProduct.getProductID(), 1)));

        OrderResponse created = orderService.createOrder(request);

        OrderUpdateStatusRequest statusRequest = new OrderUpdateStatusRequest();
        statusRequest.setStatus(OrderStatus.SHIPPING);

        OrderResponse updated = orderService.updateStatus(created.getOrderID(), statusRequest);
        assertEquals(OrderStatus.SHIPPING.name(), updated.getStatus());
    }

    @Test
    void testGetAllOrders() {
        // tạo 2 order
        OrderCreateRequest req1 = new OrderCreateRequest();
        req1.setUserID(testUser.getUserID());
        req1.setItems(List.of(new Item(testProduct.getProductID(), 1)));
        orderService.createOrder(req1);

        OrderCreateRequest req2 = new OrderCreateRequest();
        req2.setUserID(testUser.getUserID());
        req2.setItems(List.of(new Item(testProduct.getProductID(), 2)));
        orderService.createOrder(req2);

        List<OrderResponse> allOrders = orderService.getAll();
        assertEquals(2, allOrders.size());
    }
}
