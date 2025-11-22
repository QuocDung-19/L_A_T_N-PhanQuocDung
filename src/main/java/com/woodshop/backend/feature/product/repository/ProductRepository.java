package com.woodshop.backend.feature.product.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.woodshop.backend.feature.product.entity.Product;

public interface ProductRepository extends JpaRepository<Product, String> {
    List<Product> findByNameContainingIgnoreCase(String keyword);
}
