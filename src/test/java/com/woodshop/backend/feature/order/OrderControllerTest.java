package com.woodshop.backend.feature.order;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.woodshop.backend.feature.order.dto.OrderCreateRequest;
import com.woodshop.backend.feature.order.dto.OrderCreateRequest.Item;
import com.woodshop.backend.feature.order.dto.OrderUpdateStatusRequest;
import com.woodshop.backend.feature.order.entity.OrderStatus;
import com.woodshop.backend.feature.order.repository.OrderRepository;
import com.woodshop.backend.feature.product.entity.Product;
import com.woodshop.backend.feature.product.repository.ProductRepository;
import com.woodshop.backend.feature.user.entity.User;
import com.woodshop.backend.feature.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class OrderControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper mapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OrderRepository orderRepository;

    private User testUser;
    private Product testProduct;

    @BeforeEach
    void setUp() {
        orderRepository.deleteAll();
        productRepository.deleteAll();
        userRepository.deleteAll();

        testUser = User.builder()
                .username("dung")
                .gmail("abc@gmail.com")
                .phone("123456")
                .build();
        userRepository.save(testUser);

        testProduct = Product.builder()
                .name("Wood Table")
                .description("Test Product")
                .price(100.0)
                .stock(10)
                .build();
        productRepository.save(testProduct);
    }

    @Test
    void testCreateOrder() throws Exception {
        Item item = new Item(testProduct.getProductID(), 2);
        OrderCreateRequest request = new OrderCreateRequest();
        request.setUserID(testUser.getUserID());
        request.setItems(List.of(item));

        mockMvc.perform(post("/api/orders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.userID").value(testUser.getUserID()))
                .andExpect(jsonPath("$.items[0].productID").value(testProduct.getProductID()));
    }

    @Test
    void testGetAllOrders() throws Exception {
        // Tạo 1 đơn hàng
        Item item = new Item(testProduct.getProductID(), 1);
        OrderCreateRequest request = new OrderCreateRequest();
        request.setUserID(testUser.getUserID());
        request.setItems(List.of(item));

        mockMvc.perform(post("/api/orders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(request)))
                .andExpect(status().isOk());

        mockMvc.perform(get("/api/orders"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].userID").value(testUser.getUserID()));
    }

    @Test
    void testGetOrdersOfUser() throws Exception {
        Item item = new Item(testProduct.getProductID(), 1);
        OrderCreateRequest request = new OrderCreateRequest();
        request.setUserID(testUser.getUserID());
        request.setItems(List.of(item));

        mockMvc.perform(post("/api/orders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(request)))
                .andExpect(status().isOk());

        mockMvc.perform(get("/api/orders/user/" + testUser.getUserID()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].userID").value(testUser.getUserID()));
    }

    @Test
    void testUpdateOrderStatus() throws Exception {
        Item item = new Item(testProduct.getProductID(), 1);
        OrderCreateRequest request = new OrderCreateRequest();
        request.setUserID(testUser.getUserID());
        request.setItems(List.of(item));

        var result = mockMvc.perform(post("/api/orders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(request)))
                .andReturn();

        String orderId = mapper.readTree(result.getResponse().getContentAsString()).get("orderID").asText();

        OrderUpdateStatusRequest updateRequest = new OrderUpdateStatusRequest();
        updateRequest.setStatus(OrderStatus.CONFIRMED);

        mockMvc.perform(put("/api/orders/" + orderId + "/status")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(updateRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("CONFIRMED"));
    }
}
