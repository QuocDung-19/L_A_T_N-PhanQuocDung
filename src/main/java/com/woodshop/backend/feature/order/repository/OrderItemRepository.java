package com.woodshop.backend.feature.order.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.woodshop.backend.feature.order.entity.OrderItem;

public interface OrderItemRepository extends JpaRepository<OrderItem, String> {

}
