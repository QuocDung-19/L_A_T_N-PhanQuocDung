package com.woodshop.backend.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.woodshop.backend.feature.user.entity.Role;
import com.woodshop.backend.feature.user.entity.User;
import com.woodshop.backend.feature.user.repository.RoleRepository;
import com.woodshop.backend.feature.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Configuration
@RequiredArgsConstructor
public class AppRunner implements CommandLineRunner {

    private final RoleRepository roleRepo;
    private final UserRepository userRepo;
    private final PasswordEncoder encoder;

    @Override
    public void run(String... args) {
        // Tạo Roles nếu chưa có
        Role adminRole = roleRepo.findByName("ROLE_ADMIN")
                .orElseGet(() -> roleRepo.save(
                        Role.builder().name("ROLE_ADMIN").build()
                ));

        // Tạo tài khoản admin nếu chưa có
        if (userRepo.findByUsername("admin").isEmpty()) {
            User admin = User.builder()
                    .username("admin")
                    .password(encoder.encode("123456"))
                    .gmail("admin@gmail.com")
                    .phone("0123456789")
                    .role(adminRole)
                    .build();

            userRepo.save(admin);
            System.out.println("Default admin created: admin / 123456");
        }
    }
}
