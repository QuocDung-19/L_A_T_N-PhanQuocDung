package com.woodshop.backend.feature.auth.util;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

class JwtUtilsTest {

    @Test
    void testGenerateAndValidateToken() {
        JwtUtil jwt = new JwtUtil();

        String token = jwt.generateToken("user123");
        Assertions.assertNotNull(token);
        Assertions.assertTrue(jwt.validateToken(token));

        String username = jwt.getUsernameFromToken(token);
        Assertions.assertEquals("user123", username);
    }

    @Test
    void testInvalidToken() {
        JwtUtil jwt = new JwtUtil();
        Assertions.assertFalse(jwt.validateToken("invalid.token.here"));
    }
}
