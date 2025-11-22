package com.woodshop.backend.feature.product.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.woodshop.backend.feature.product.entity.Category;

public interface CategoryRepository extends JpaRepository<Category, String> {
    Optional<Category> findByName(String name);
}
