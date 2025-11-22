package com.woodshop.backend.feature.user.service;

import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.woodshop.backend.feature.user.dto.UserCreateRequest;
import com.woodshop.backend.feature.user.dto.UserResponse;
import com.woodshop.backend.feature.user.dto.UserUpdateRequest;
import com.woodshop.backend.feature.user.entity.Role;
import com.woodshop.backend.feature.user.entity.User;
import com.woodshop.backend.feature.user.repository.RoleRepository;
import com.woodshop.backend.feature.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;


@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepo;
    private final RoleRepository roleRepo;
    private final PasswordEncoder encoder;

    public UserResponse createUser(UserCreateRequest request) {

        Role role = roleRepo.findByName(request.getRoleName())
                .orElseThrow(() -> new RuntimeException("Role not found"));

        User user = User.builder()
                .username(request.getUsername())
                .password(encoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .gmail(request.getGmail())
                .role(role)
                .build();

        userRepo.save(user);

        return map(user);
    }

    public List<UserResponse> getAll() {
        return userRepo.findAll().stream().map(this::map).toList();
    }

    public UserResponse getById(String id) {
        User user = userRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return map(user);
    }

    public UserResponse updateUser(String id, UserUpdateRequest request) {
        User user = userRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (request.getPhone() != null) user.setPhone(request.getPhone());
        if (request.getGmail() != null) user.setGmail(request.getGmail());

        if (request.getRoleName() != null) {
            Role role = roleRepo.findByName(request.getRoleName())
                    .orElseThrow(() -> new RuntimeException("Role not found"));
            user.setRole(role);
        }

        userRepo.save(user);
        return map(user);
    }

    public void deleteUser(String id) {
        userRepo.deleteById(id);
    }

    private UserResponse map(User user) {
        return UserResponse.builder()
                .userID(user.getUserID())
                .username(user.getUsername())
                .phone(user.getPhone())
                .gmail(user.getGmail())
                .role(user.getRole().getName())
                .build();
    }
}
