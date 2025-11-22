package com.woodshop.backend.feature.auth.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.woodshop.backend.feature.auth.entity.RefreshToken;
import com.woodshop.backend.feature.user.entity.User;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, String> {
    Optional<RefreshToken> findByToken(String token);
    void deleteByUser(User user);
}
