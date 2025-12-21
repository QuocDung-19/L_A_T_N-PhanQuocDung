package com.app.woodshop.feature.user.mapper;

import com.app.woodshop.feature.user.dto.request.UserRequest;
import com.app.woodshop.feature.user.dto.response.UserResponse;
import com.app.woodshop.feature.user.entity.User;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface UserMapper {
    User toUser(UserRequest request);
    UserResponse toUserResponse(User user);
}
