package com.woodshop.backend.feature.product;

import com.woodshop.backend.feature.product.dto.ProductCreateRequest;
import com.woodshop.backend.feature.product.dto.ProductResponse;
import com.woodshop.backend.feature.product.dto.ProductUpdateRequest;
import com.woodshop.backend.feature.product.entity.Category;
import com.woodshop.backend.feature.product.repository.CategoryRepository;
import com.woodshop.backend.feature.product.repository.ProductRepository;
import com.woodshop.backend.feature.product.service.ProductService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class ProductServiceTest {

    @Autowired
    ProductService productService;

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
                .description("Test category")
                .build();
        categoryRepository.save(testCategory);
    }

    @Test
    void testCreateAndGetProduct() {
        ProductCreateRequest req = new ProductCreateRequest();
        req.setName("Service Product");
        req.setDescription("Desc");
        req.setPrice(200.0);
        req.setStock(5);
        req.setCategoryName(testCategory.getName());

        ProductResponse created = productService.createProduct(req);
        assertNotNull(created.getProductID());
        assertEquals("Service Product", created.getName());

        ProductResponse fetched = productService.getById(created.getProductID());
        assertEquals(created.getProductID(), fetched.getProductID());
    }

    @Test
    void testUpdateProduct() {
        ProductCreateRequest req = new ProductCreateRequest();
        req.setName("Old Product");
        req.setDescription("Old Desc");
        req.setPrice(100.0);
        req.setStock(10);
        req.setCategoryName(testCategory.getName());

        ProductResponse created = productService.createProduct(req);

        ProductUpdateRequest updateReq = new ProductUpdateRequest();
        updateReq.setName("Updated Product");
        updateReq.setPrice(300.0);

        ProductResponse updated = productService.updateProduct(created.getProductID(), updateReq);
        assertEquals("Updated Product", updated.getName());
        assertEquals(300.0, updated.getPrice());
    }

    @Test
    void testDeleteProduct() {
        ProductCreateRequest req = new ProductCreateRequest();
        req.setName("ToDelete");
        req.setDescription("Desc");
        req.setPrice(50.0);
        req.setStock(2);
        req.setCategoryName(testCategory.getName());

        ProductResponse created = productService.createProduct(req);
        productService.deleteProduct(created.getProductID());

        assertThrows(RuntimeException.class, () -> productService.getById(created.getProductID()));
    }

    @Test
    void testSearchProduct() {
        ProductCreateRequest req = new ProductCreateRequest();
        req.setName("Searchable Product");
        req.setDescription("Desc");
        req.setPrice(20.0);
        req.setStock(1);
        req.setCategoryName(testCategory.getName());

        productService.createProduct(req);

        List<ProductResponse> results = productService.search("searchable");
        assertEquals(1, results.size());
        assertEquals("Searchable Product", results.get(0).getName());
    }
}
