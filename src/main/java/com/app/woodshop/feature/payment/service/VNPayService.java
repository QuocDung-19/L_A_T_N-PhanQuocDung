package com.app.woodshop.feature.payment.service;

import com.app.woodshop.config.Security.VNPayConfig;
import jakarta.xml.bind.DatatypeConverter;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigDecimal;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Map;
import java.util.TreeMap;
import java.util.stream.Collectors;

@Service
public class VNPayService {

    public String createPaymentUrl(String txnRef, BigDecimal amount) {

        if (txnRef == null || txnRef.isBlank()) {
            throw new IllegalArgumentException("Transaction reference is invalid");
        }

        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Payment amount is invalid");
        }

        // VNPay yêu cầu amount * 100
        long vnpAmount = amount.multiply(BigDecimal.valueOf(100)).longValue();

        Map<String, String> params = new TreeMap<>();
        params.put("vnp_Version", "2.1.0");
        params.put("vnp_Command", "pay");
        params.put("vnp_TmnCode", VNPayConfig.vnp_TmnCode);
        params.put("vnp_Amount", String.valueOf(vnpAmount));
        params.put("vnp_CurrCode", "VND");
        params.put("vnp_TxnRef", txnRef);
        params.put("vnp_OrderInfo", "Thanh toan don hang " + txnRef);
        params.put("vnp_OrderType", "other");
        params.put("vnp_Locale", "vn");
        params.put("vnp_ReturnUrl", VNPayConfig.vnp_ReturnUrl);
        params.put("vnp_IpAddr", "127.0.0.1");
        params.put(
                "vnp_CreateDate",
                LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"))
        );

        // Build query string
        String query = params.entrySet()
                .stream()
                .map(e -> e.getKey() + "=" + URLEncoder.encode(e.getValue(), StandardCharsets.UTF_8))
                .collect(Collectors.joining("&"));

        // Create secure hash
        String secureHash = hmacSHA512(VNPayConfig.vnp_HashSecret, query);

        return VNPayConfig.vnp_Url + "?" + query + "&vnp_SecureHash=" + secureHash;
    }

    /**
     * Hash HmacSHA512 theo chuẩn VNPay
     */
    private String hmacSHA512(String key, String data) {
        try {
            Mac mac = Mac.getInstance("HmacSHA512");
            mac.init(new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA512"));
            byte[] raw = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            return DatatypeConverter.printHexBinary(raw).toLowerCase();
        } catch (Exception e) {
            throw new RuntimeException("Error while hashing VNPay data", e);
        }
    }
}
