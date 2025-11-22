package com.woodshop.backend.feature.admin;

import com.woodshop.backend.feature.admin.dto.AdminProductResponse;
import com.woodshop.backend.feature.admin.service.AdminService;
import com.woodshop.backend.feature.product.entity.Category;
import com.woodshop.backend.feature.product.entity.Product;
import com.woodshop.backend.feature.product.repository.ProductRepository;

import com.woodshop.backend.feature.order.repository.OrderRepository;
import com.woodshop.backend.feature.user.repository.UserRepository;

import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

class AdminServiceTest {

    @Mock
    UserRepository userRepo;

    @Mock
    ProductRepository productRepo;

    @Mock
    OrderRepository orderRepo;

    @InjectMocks
    AdminService service;

    public AdminServiceTest() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetAllProducts() {
        Category cat = Category.builder()
                .categoryID("cat123")
                .name("Gỗ cao su")
                .description("Loại gỗ tốt")
                .build();

        Product product = Product.builder()
                .productID("prd001")
                .name("Bàn gỗ")
                .description("Bàn gỗ tự nhiên")
                .price(1500000.0)
                .stock(5)
                .category(cat)
                .build();

        when(productRepo.findAll()).thenReturn(List.of(product));

        List<AdminProductResponse> list = service.getAllProducts();

        assertEquals(1, list.size());
        AdminProductResponse p = list.get(0);

        assertEquals("prd001", p.getProductID());
        assertEquals("Bàn gỗ", p.getName());
        assertEquals("Gỗ cao su", p.getCategoryName());
        assertEquals("cat123", p.getCategoryID());
        assertEquals(1500000.0, p.getPrice());
        assertEquals(5, p.getStock());
    }
}
