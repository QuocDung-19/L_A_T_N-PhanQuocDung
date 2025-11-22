package com.woodshop.backend.feature.auth.service;

import com.woodshop.backend.feature.auth.dto.LoginRequest;
import com.woodshop.backend.feature.auth.dto.RegisterRequest;
import com.woodshop.backend.feature.auth.dto.TokenResponse;
import com.woodshop.backend.feature.auth.dto.RefreshTokenRequest;
import com.woodshop.backend.feature.auth.entity.RefreshToken;
import com.woodshop.backend.feature.auth.repository.RefreshTokenRepository;
import com.woodshop.backend.feature.auth.util.JwtUtil;
import com.woodshop.backend.feature.user.entity.Role;
import com.woodshop.backend.feature.user.entity.User;
import com.woodshop.backend.feature.user.repository.RoleRepository;
import com.woodshop.backend.feature.user.repository.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    // refresh token expiry in seconds (30 days)
    private final long refreshTokenDurationSec = 30L * 24 * 3600;

    public AuthServiceImpl(UserRepository userRepository,
                           RoleRepository roleRepository,
                           RefreshTokenRepository refreshTokenRepository,
                           PasswordEncoder passwordEncoder,
                           JwtUtil jwtUtil,
                           AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.authenticationManager = authenticationManager;
    }

    @Override
    public TokenResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        Role role = roleRepository.findByName("ROLE_CUSTOMER")
                .orElseGet(() -> roleRepository.save(Role.builder().name("ROLE_CUSTOMER").build()));

        User user = User.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .gmail(request.getGmail())
                .role(role)
                .build();

        user = userRepository.save(user);

        String accessToken = jwtUtil.generateToken(user.getUsername());
        RefreshToken refreshToken = createRefreshToken(user);

        return TokenResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken.getToken())
                .tokenType("Bearer")
                .expiresIn(jwtUtil.getJwtExpirationMs() / 1000)
                .userId(user.getUserID())
                .username(user.getUsername())
                .build();
    }

    @Override
    public TokenResponse login(LoginRequest request) {
        // authenticate credentials
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String accessToken = jwtUtil.generateToken(user.getUsername());
        RefreshToken refreshToken = createRefreshToken(user);

        return TokenResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken.getToken())
                .tokenType("Bearer")
                .expiresIn(jwtUtil.getJwtExpirationMs() / 1000)
                .userId(user.getUserID())
                .username(user.getUsername())
                .build();
    }

    @Override
    public TokenResponse refreshToken(RefreshTokenRequest request) {
        String requestToken = request.getRefreshToken();
        RefreshToken stored = refreshTokenRepository.findByToken(requestToken)
                .orElseThrow(() -> new RuntimeException("Refresh token not found"));

        if (stored.isRevoked() || stored.getExpiryDate().isBefore(Instant.now())) {
            throw new RuntimeException("Refresh token is invalid or expired");
        }

        User user = stored.getUser();
        String accessToken = jwtUtil.generateToken(user.getUsername());

        return TokenResponse.builder()
                .accessToken(accessToken)
                .refreshToken(stored.getToken())
                .tokenType("Bearer")
                .expiresIn(jwtUtil.getJwtExpirationMs() / 1000)
                .userId(user.getUserID())
                .username(user.getUsername())
                .build();
    }

    @Override
    public void logout(String refreshToken) {
        Optional<RefreshToken> optional = refreshTokenRepository.findByToken(refreshToken);
        optional.ifPresent(rt -> {
            rt.setRevoked(true);
            refreshTokenRepository.save(rt);
        });
    }

    private RefreshToken createRefreshToken(User user) {
        // delete old tokens for same user (keep simple)
        refreshTokenRepository.deleteByUser(user);

        RefreshToken refreshToken = RefreshToken.builder()
                .token(UUID.randomUUID().toString())
                .user(user)
                .revoked(false)
                .expiryDate(Instant.now().plusSeconds(refreshTokenDurationSec))
                .build();

        return refreshTokenRepository.save(refreshToken);
    }
}
