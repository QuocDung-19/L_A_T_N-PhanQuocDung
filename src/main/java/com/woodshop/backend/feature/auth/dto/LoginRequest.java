package com.woodshop.backend.feature.auth.dto;

import lombok.Data;

@Data
public class LoginRequest {
    private String username;
    private String password;

    public LoginRequest(String loginuser, String number) {
    }

    public LoginRequest() {

    }
}
