package com.woodshop.backend.feature.auth.service;

import com.woodshop.backend.feature.auth.dto.LoginRequest;
import com.woodshop.backend.feature.auth.dto.RefreshTokenRequest;
import com.woodshop.backend.feature.auth.dto.RegisterRequest;
import com.woodshop.backend.feature.auth.dto.TokenResponse;

public interface AuthService {
    TokenResponse register(RegisterRequest request);
    TokenResponse login(LoginRequest request);
    TokenResponse refreshToken(RefreshTokenRequest request);
    void logout(String refreshToken);
}
