package com.app.woodshop.feature.user.dto.response;

import com.app.woodshop.common.enums.UserRole;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserResponse {
    String userID;
    String username;
    UserRole role;
    String fullName;
    String email;
    String phone;
    String address;
}
