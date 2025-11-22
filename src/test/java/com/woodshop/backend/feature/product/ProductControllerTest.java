package com.woodshop.backend.feature.product;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.woodshop.backend.feature.product.dto.ProductCreateRequest;
import com.woodshop.backend.feature.product.dto.ProductUpdateRequest;
import com.woodshop.backend.feature.product.entity.Category;
import com.woodshop.backend.feature.product.repository.CategoryRepository;
import com.woodshop.backend.feature.product.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class ProductControllerTest {

    @Autowired
    MockMvc mockMvc;

    @Autowired
    ObjectMapper mapper;

    @Autowired
    ProductRepository productRepository;

    @Autowired
    CategoryRepository categoryRepository;

    private Category testCategory;

    @BeforeEach
    void setUp() {
        productRepository.deleteAll();
        categoryRepository.deleteAll();

        testCategory = Category.builder()
                .name("TestCat")
                .description("Category Desc")
                .build();
        categoryRepository.save(testCategory);
    }

    @Test
    void testCreateProduct() throws Exception {
        ProductCreateRequest req = new ProductCreateRequest();
        req.setName("Prod1");
        req.setDescription("Desc");
        req.setPrice(50.0);
        req.setStock(10);
        req.setCategoryName(testCategory.getName());

        mockMvc.perform(post("/api/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Prod1"))
                .andExpect(jsonPath("$.category").value(testCategory.getName()));
    }

    @Test
    void testGetAllProducts() throws Exception {
        mockMvc.perform(get("/api/products"))
                .andExpect(status().isOk());
    }

    @Test
    void testUpdateProduct() throws Exception {
        ProductCreateRequest req = new ProductCreateRequest();
        req.setName("OldProd");
        req.setDescription("Old Desc");
        req.setPrice(20.0);
        req.setStock(5);
        req.setCategoryName(testCategory.getName());

        var result = mockMvc.perform(post("/api/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(req)))
                .andReturn();

        String productId = mapper.readTree(result.getResponse().getContentAsString()).get("productID").asText();

        ProductUpdateRequest updateReq = new ProductUpdateRequest();
        updateReq.setName("UpdatedProd");

        mockMvc.perform(put("/api/products/" + productId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(updateReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("UpdatedProd"));
    }

    @Test
    void testDeleteProduct() throws Exception {
        ProductCreateRequest req = new ProductCreateRequest();
        req.setName("DeleteProd");
        req.setDescription("Desc");
        req.setPrice(30.0);
        req.setStock(2);
        req.setCategoryName(testCategory.getName());

        var result = mockMvc.perform(post("/api/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(req)))
                .andReturn();

        String productId = mapper.readTree(result.getResponse().getContentAsString()).get("productID").asText();

        mockMvc.perform(delete("/api/products/" + productId))
                .andExpect(status().isOk());
    }
}
