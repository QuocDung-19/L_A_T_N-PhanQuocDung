package com.app.woodshop.feature.user.entity;


import com.app.woodshop.common.enums.UserRole;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Table(name = "users")
@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String userID;

    @Column(nullable = false, unique = true)
    String username;
    String password;

    @Enumerated(EnumType.STRING)
    UserRole role;
    String fullName;
    String email;
    String phone;
    String address;
}
