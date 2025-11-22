package com.woodshop.backend.feature.auth.util;

import java.security.Key;
import java.util.Date;

import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtil {

    private final Key key;
    private final long jwtExpirationMs;

    // Constructor mặc định
    public JwtUtil() {
        String secret = "please-change-this-secret-to-a-long-random-value-which-is-at-least-32-bytes!";
        key = Keys.hmacShaKeyFor(secret.getBytes());
        jwtExpirationMs = 15 * 60 * 1000L; // 15 minutes
    }

    // Constructor để test / tùy chỉnh
    public JwtUtil(String secret, long expirationMs) {
        key = Keys.hmacShaKeyFor(secret.getBytes());
        jwtExpirationMs = expirationMs;
    }

    public String generateToken(String username) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpirationMs);
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
            return true;
        } catch (JwtException ex) {
            return false;
        }
    }

    public String getUsernameFromToken(String token) {
        Claims claims = Jwts.parserBuilder().setSigningKey(key).build()
                .parseClaimsJws(token)
                .getBody();
        return claims.getSubject();
    }

    public long getJwtExpirationMs() {
        return jwtExpirationMs;
    }
}

