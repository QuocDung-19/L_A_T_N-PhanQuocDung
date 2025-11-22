package com.woodshop.backend.feature.user;

import com.woodshop.backend.feature.user.entity.User;
import com.woodshop.backend.feature.user.repository.UserRepository;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class UserRepositoryTest {

    @Autowired
    UserRepository repo;

    @Test
    void testSaveUser() {
        User user = new User();
        user.setUsername("repo_test"); // dùng username
        user.setPassword("123");

        User saved = repo.save(user);
        Assertions.assertNotNull(saved.getUserID()); // ID trong entity là userID
    }

    @Test
    void testFindByUsername() {
        var user = repo.findByUsername("repo_test"); // dùng username
        Assertions.assertTrue(user.isPresent());
    }

    @Test
    void testExistsByUsername() {
        boolean exists = repo.existsByUsername("repo_test");
        Assertions.assertTrue(exists);
    }
}
