package com.woodshop.backend.feature.user;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.woodshop.backend.feature.user.dto.UserUpdateRequest;
import com.woodshop.backend.feature.user.entity.User;
import com.woodshop.backend.feature.user.repository.UserRepository;
import com.woodshop.backend.feature.auth.service.AuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class UserControllerTest {

    @Autowired
    MockMvc mockMvc;

    @Autowired
    ObjectMapper mapper;

    @Autowired
    AuthService authService;

    @Autowired
    UserRepository userRepository;

    private String token;

    @BeforeEach
    void setUp() {
        // tạo user test và login để lấy token
        User user = new User();
        user.setUsername("user_test");
        user.setPassword("123456");
        userRepository.save(user);

        token = authService.login(
                new com.woodshop.backend.feature.auth.dto.LoginRequest("user_test", "123456")
        ).getAccessToken();
    }

    @Test
    void testGetProfile() throws Exception {
        mockMvc.perform(get("/api/users/profile")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk());
    }

    @Test
    void testUpdateProfile() throws Exception {
        UserUpdateRequest updateRequest = new UserUpdateRequest();
        updateRequest.setPhone("0987654321");
        updateRequest.setGmail("updated@example.com");

        mockMvc.perform(put("/api/users/profile")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(updateRequest)))
                .andExpect(status().isOk());
    }
}
