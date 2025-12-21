package com.app.woodshop.feature.user.repository;

import com.app.woodshop.feature.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User,String> {
    Optional<User> findByUsername(String name);
    boolean existsByUsername(String name);
}
