package com.woodshop.backend.feature.auth;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.woodshop.backend.feature.auth.dto.LoginRequest;
import com.woodshop.backend.feature.auth.dto.RegisterRequest;
import com.woodshop.backend.feature.auth.dto.RefreshTokenRequest;
import com.woodshop.backend.feature.auth.service.AuthService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class AuthControllerTest {

    @Autowired
    MockMvc mockMvc;

    @Autowired
    ObjectMapper mapper;

    @Autowired
    AuthService authService;

    @Test
    void testRegisterSuccess() throws Exception {
        RegisterRequest req = new RegisterRequest();
        req.setUsername("testuser");
        req.setPassword("123456");
        req.setPhone("0123456789");
        req.setGmail("testuser@example.com");

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(req)))
                .andExpect(status().isOk());
    }

    @Test
    void testLoginSuccess() throws Exception {
        // ensure user exists
        RegisterRequest req = new RegisterRequest();
        req.setUsername("loginuser");
        req.setPassword("123456");
        req.setPhone("0123456789");
        req.setGmail("loginuser@example.com");
        authService.register(req);

        LoginRequest loginReq = new LoginRequest();
        loginReq.setUsername("loginuser");
        loginReq.setPassword("123456");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(loginReq)))
                .andExpect(status().isOk());
    }

    @Test
    void testLoginWrongPassword() throws Exception {
        LoginRequest loginReq = new LoginRequest();
        loginReq.setUsername("loginuser");
        loginReq.setPassword("wrongpassword");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(loginReq)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void testRefreshToken() throws Exception {
        String token = authService.login(new LoginRequest("loginuser", "123456")).getAccessToken();
        RefreshTokenRequest req = new RefreshTokenRequest();
        req.setRefreshToken(token);

        mockMvc.perform(post("/api/auth/refresh")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(req)))
                .andExpect(status().isOk());
    }

    @Test
    void testLogout() throws Exception {
        String token = authService.login(new LoginRequest("loginuser", "123456")).getAccessToken();
        RefreshTokenRequest req = new RefreshTokenRequest();
        req.setRefreshToken(token);

        mockMvc.perform(post("/api/auth/logout")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(req)))
                .andExpect(status().isOk());
    }
}
