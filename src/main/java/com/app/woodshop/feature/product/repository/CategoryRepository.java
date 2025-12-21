package com.app.woodshop.feature.product.repository;
import com.app.woodshop.feature.product.entity.Category;import org.springframework.data.jpa.repository.JpaRepository;
public interface CategoryRepository extends JpaRepository<Category, Long> {
    boolean existsByName(String name);
}