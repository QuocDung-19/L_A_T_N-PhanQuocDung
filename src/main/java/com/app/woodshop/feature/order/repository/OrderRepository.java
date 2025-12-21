package com.app.woodshop.feature.order.repository;

import com.app.woodshop.common.enums.OrderStatus;
import com.app.woodshop.feature.order.entity.Order;
import com.app.woodshop.feature.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUser(User user);
    List<Order> findByUserAndStatus(User user, OrderStatus status);
}
