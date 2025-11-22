package com.woodshop.backend.feature.order.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.woodshop.backend.feature.order.entity.Order;
import com.woodshop.backend.feature.user.entity.User;

public interface OrderRepository extends JpaRepository<Order, String> {
    List<Order> findByCustomer(User user);
}
