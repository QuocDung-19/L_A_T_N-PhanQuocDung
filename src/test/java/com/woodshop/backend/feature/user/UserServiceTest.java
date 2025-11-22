package com.woodshop.backend.feature.user;

import com.woodshop.backend.feature.user.dto.UserUpdateRequest;
import com.woodshop.backend.feature.user.entity.User;
import com.woodshop.backend.feature.user.repository.UserRepository;
import com.woodshop.backend.feature.user.service.UserService;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class UserServiceTest {

    @Autowired
    UserService userService;

    @Autowired
    UserRepository userRepository;

    @Test
    void testUpdateUser() {
        User user = new User();
        user.setUsername("service_user");
        user.setPassword("123");
        userRepository.save(user);

        UserUpdateRequest request = new UserUpdateRequest();
        request.setPhone("0123456789");
        request.setGmail("service_user@example.com");

        // Gọi đúng phương thức và nhận về UserResponse
        var updatedResponse = userService.updateUser(user.getUserID(), request);

        Assertions.assertEquals("0123456789", updatedResponse.getPhone());
        Assertions.assertEquals("service_user@example.com", updatedResponse.getGmail());
    }

    @Test
    void testGetProfile() {
        User user = new User();
        user.setUsername("service_user2");
        user.setPassword("123");
        userRepository.save(user);

        // Gọi phương thức getById trả về UserResponse
        var profileResponse = userService.getById(user.getUserID());

        Assertions.assertEquals("service_user2", profileResponse.getUsername());
    }
}
