package com.woodshop.backend.feature.admin;

import com.woodshop.backend.feature.admin.controller.AdminController;
import com.woodshop.backend.feature.admin.dto.AdminUserResponse;
import com.woodshop.backend.feature.admin.service.AdminService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class AdminControllerTest {

    private MockMvc mvc;

    @Mock
    private AdminService adminService;

    @InjectMocks
    private AdminController adminController;

    @Test
    void testGetAllUsers() throws Exception {
        mvc = MockMvcBuilders.standaloneSetup(adminController).build();

        AdminUserResponse mockUser = AdminUserResponse.builder()
                .userID("1")
                .username("dung")
                .gmail("abc@gmail.com")
                .phone("123")
                .role("USER")
                .build();

        when(adminService.getAllUsers()).thenReturn(List.of(mockUser));

        mvc.perform(get("/api/admin/users"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].username").value("dung"));
    }
}
