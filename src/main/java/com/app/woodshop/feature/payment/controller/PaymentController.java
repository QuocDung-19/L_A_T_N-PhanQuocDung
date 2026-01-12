package com.app.woodshop.feature.payment.controller;

import com.app.woodshop.common.enums.PaymentStatus;
import com.app.woodshop.feature.order.entity.Order;
import com.app.woodshop.feature.order.repository.OrderRepository;
import com.app.woodshop.feature.payment.dto.PaymentRequest;
import com.app.woodshop.feature.payment.entity.Payment;
import com.app.woodshop.feature.payment.repository.PaymentRepository;
import com.app.woodshop.feature.payment.service.VNPayService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Map;


@RestController
@RequestMapping("/payment")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentRepository paymentRepo;
    private final OrderRepository orderRepo;
    private final VNPayService vnPayService;

    @PostMapping("/create")
    public Map<String, Object> createPayment(@RequestBody PaymentRequest req) {

        Order order = orderRepo.findById(req.getOrderId())
                .orElseThrow(() -> new RuntimeException("Order not found"));

        Payment payment = paymentRepo.findByOrder(order)
                .orElseGet(() -> {
                    Payment p = new Payment();
                    p.setOrder(order);
                    p.setTransactionNo(String.valueOf(order.getOrderID()));
                    return p;
                });

        payment.setMethod(req.getMethod());
        payment.setAmount(order.getTotalAmount());
        payment.setStatus(PaymentStatus.PENDING);

        paymentRepo.save(payment);

        if ("VNPAY".equalsIgnoreCase(req.getMethod())) {
            String url = vnPayService.createPaymentUrl(
                    payment.getTransactionNo(),
                    payment.getAmount()
            );

            return Map.of("paymentUrl", url);
        }

        // COD
        payment.setStatus(PaymentStatus.PAID);
        paymentRepo.save(payment);

        return Map.of("message", "COD payment success");
    }


    @GetMapping("/vnpay/callback")
    public void callback(HttpServletRequest req, HttpServletResponse res) throws IOException {

        String responseCode = req.getParameter("vnp_ResponseCode");
        String txnRef = req.getParameter("vnp_TxnRef");

        Payment payment = paymentRepo.findByTransactionNo(txnRef)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        if ("00".equals(responseCode)) {
            payment.setStatus(PaymentStatus.PAID);
        } else {
            payment.setStatus(PaymentStatus.FAILED);
        }

        paymentRepo.save(payment);

        res.sendRedirect("http://localhost:3000/orders");
    }
}
