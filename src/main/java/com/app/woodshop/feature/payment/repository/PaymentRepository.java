package com.app.woodshop.feature.payment.repository;

import com.app.woodshop.feature.order.entity.Order;
import com.app.woodshop.feature.payment.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

    Optional<Payment> findByOrder(Order order);

    Optional<Payment> findByTransactionNo(String transactionNo);

    boolean existsByOrder(Order order); // <<< THÊM DÒNG NÀY
}
