package com.app.woodshop.feature.order.entity;

import com.app.woodshop.common.enums.OrderStatus;
import com.app.woodshop.common.enums.PaymentStatus;
import com.app.woodshop.feature.payment.entity.Payment;
import com.app.woodshop.feature.user.entity.User;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "orders")
@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long orderID;

    @ManyToOne
    @JoinColumn(name = "userID", nullable = false)
    User user;

    LocalDate orderDate;

    BigDecimal totalAmount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    OrderStatus status;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    PaymentStatus paymentStatus;

    @OneToOne(mappedBy = "order", cascade = CascadeType.ALL)
    Payment payment;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    List<OrderDetail> orderDetails;

    @PrePersist
    protected void onCreate() {
        if (status == null) status = OrderStatus.PENDING;
        if (paymentStatus == null) paymentStatus = PaymentStatus.UNPAID;
        if (orderDate == null) orderDate = LocalDate.now();
    }
}
