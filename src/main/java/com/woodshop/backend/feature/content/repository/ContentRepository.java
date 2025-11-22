package com.woodshop.backend.feature.content.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.woodshop.backend.feature.content.entity.Content;
import com.woodshop.backend.feature.content.entity.ContentType;

public interface ContentRepository extends JpaRepository<Content, String> {
    List<Content> findByType(ContentType type);
}
