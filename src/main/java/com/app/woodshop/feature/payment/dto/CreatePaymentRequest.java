package com.app.woodshop.feature.payment.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class CreatePaymentRequest {
    private Long orderId;
    private String method;
    private BigDecimal amount;
}
