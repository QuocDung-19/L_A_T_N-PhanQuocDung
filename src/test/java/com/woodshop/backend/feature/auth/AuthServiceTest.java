package com.woodshop.backend.feature.auth;

import com.woodshop.backend.feature.auth.dto.LoginRequest;
import com.woodshop.backend.feature.auth.dto.RegisterRequest;
import com.woodshop.backend.feature.auth.service.AuthService;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class AuthServiceTest {

    @Autowired
    AuthService authService;

    @Test
    void testRegisterAndLogin() {
        RegisterRequest req = new RegisterRequest();
        req.setUsername("serviceuser");
        req.setPassword("123456");
        req.setPhone("0123456789");
        req.setGmail("serviceuser@example.com");

        var tokenResponse = authService.register(req);
        Assertions.assertNotNull(tokenResponse.getAccessToken());

        LoginRequest loginReq = new LoginRequest();
        loginReq.setUsername("serviceuser");
        loginReq.setPassword("123456");

        var loginResp = authService.login(loginReq);
        Assertions.assertNotNull(loginResp.getAccessToken());
    }

    @Test
    void testLoginWrongPassword() {
        LoginRequest loginReq = new LoginRequest();
        loginReq.setUsername("serviceuser");
        loginReq.setPassword("wrong");

        Assertions.assertThrows(RuntimeException.class, () -> authService.login(loginReq));
    }
}
