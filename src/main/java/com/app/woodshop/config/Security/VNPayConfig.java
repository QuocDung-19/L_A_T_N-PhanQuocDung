package com.app.woodshop.config.Security;

import org.springframework.stereotype.Component;

@Component
public class VNPayConfig {

    public static final String vnp_TmnCode = "XXXXXXX";
    public static final String vnp_HashSecret = "SECRET_KEY";
    public static final String vnp_Url =
            "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
    public static final String vnp_ReturnUrl =
            "http://localhost:8080/api/payment/vnpay/callback";
}
