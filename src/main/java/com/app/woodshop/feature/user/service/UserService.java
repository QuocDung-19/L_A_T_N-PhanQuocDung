package com.app.woodshop.feature.user.service;

import com.app.woodshop.common.enums.UserRole;
import com.app.woodshop.common.exception.AppException;
import com.app.woodshop.common.exception.ErrorCode;
import com.app.woodshop.feature.user.dto.request.UserRequest;
import com.app.woodshop.feature.user.dto.response.UserResponse;
import com.app.woodshop.feature.user.entity.User;
import com.app.woodshop.feature.user.mapper.UserMapper;
import com.app.woodshop.feature.user.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
@Slf4j
public class UserService {
    UserRepository userRepository;
    UserMapper userMapper;
    PasswordEncoder passwordEncoder;

    public List<UserResponse> findAll(){
        return userRepository.findAll().stream()
                .map(userMapper::toUserResponse)
                .toList();
    }

    public UserResponse create(UserRequest request) {
        if(userRepository.existsByUsername(request.getUsername()))
            throw new AppException(ErrorCode.USER_EXISTS);

        User user = userMapper.toUser(request);
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        return userMapper.toUserResponse(
                userRepository.save(user));
    }

    public UserResponse findById(String userID) {
        User user = userRepository.findById(userID)
                .orElseThrow(()->new AppException(ErrorCode.USER_NO_EXISTS));
        return userMapper.toUserResponse(user);
    }

    public UserResponse update(String userID, UserRequest request) {
        User user = userRepository.findById(userID)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NO_EXISTS));
        User userUpdate = userMapper.toUser(request);
        userUpdate.setUserID(userID);
        if(request.getPassword() == null) {
            userUpdate.setPassword(user.getPassword());
        }else {
            userUpdate.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        return userMapper.toUserResponse(userRepository.save(userUpdate));
    }


    public void delete(String userID) {
        User user = userRepository.findById(userID)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NO_EXISTS));
        userRepository.delete(user);
    }
}
