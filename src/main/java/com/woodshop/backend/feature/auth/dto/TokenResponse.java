package com.woodshop.backend.feature.auth.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TokenResponse {
    private String accessToken;
    private String refreshToken;
    private String tokenType; // "Bearer"
    private Long expiresIn;   // seconds (access token lifetime)
    private String userId;
    private String username;
}
