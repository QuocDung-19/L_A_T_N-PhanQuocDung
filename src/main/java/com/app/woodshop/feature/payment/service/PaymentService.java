package com.app.woodshop.feature.payment.service;

import com.app.woodshop.common.enums.PaymentStatus;
import com.app.woodshop.feature.order.entity.Order;
import com.app.woodshop.feature.order.repository.OrderRepository;
import com.app.woodshop.feature.payment.dto.CreatePaymentRequest;
import com.app.woodshop.feature.payment.entity.Payment;
import com.app.woodshop.feature.payment.repository.PaymentRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;
    private final VNPayService vnPayService;

    @Transactional
    public String createVNPayPayment(CreatePaymentRequest req) {


        if (req.getOrderId() == null) {
            throw new IllegalArgumentException("OrderId must not be null");
        }


        Order order = orderRepository.findById(req.getOrderId())
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (paymentRepository.findByOrder(order).isPresent()) {
            throw new RuntimeException("Order already has a payment");
        }

        Payment payment = new Payment();
        payment.setOrder(order);
        payment.setAmount(order.getTotalAmount());
        payment.setMethod("VNPAY");
        payment.setStatus(PaymentStatus.PENDING);

        // dùng paymentId làm txnRef
        payment = paymentRepository.save(payment);
        payment.setTransactionNo(payment.getId().toString());

        paymentRepository.save(payment);

        return vnPayService.createPaymentUrl(
                payment.getTransactionNo(),
                payment.getAmount()
        );
    }
}
