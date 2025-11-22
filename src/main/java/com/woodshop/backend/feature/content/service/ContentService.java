package com.woodshop.backend.feature.content.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.woodshop.backend.feature.content.dto.ContentCreateRequest;
import com.woodshop.backend.feature.content.dto.ContentResponse;
import com.woodshop.backend.feature.content.dto.ContentUpdateRequest;
import com.woodshop.backend.feature.content.entity.Content;
import com.woodshop.backend.feature.content.entity.ContentType;
import com.woodshop.backend.feature.content.repository.ContentRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ContentService {

    private final ContentRepository contentRepo;

    public ContentResponse createContent(ContentCreateRequest request) {
        Content content = Content.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .type(request.getType())
                .build();
        contentRepo.save(content);
        return map(content);
    }

    public List<ContentResponse> getAll() {
        return contentRepo.findAll().stream().map(this::map).toList();
    }

    public List<ContentResponse> getByType(String type) {
        return contentRepo.findByType(Enum.valueOf(ContentType.class, type.toUpperCase()))
                .stream().map(this::map).toList();
    }

    public ContentResponse update(String id, ContentUpdateRequest request) {
        Content c = contentRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Content not found"));

        if (request.getTitle() != null) c.setTitle(request.getTitle());
        if (request.getDescription() != null) c.setDescription(request.getDescription());
        if (request.getType() != null) c.setType(request.getType());

        contentRepo.save(c);
        return map(c);
    }

    public void delete(String id) {
        contentRepo.deleteById(id);
    }

    private ContentResponse map(Content c) {
        return ContentResponse.builder()
                .contentID(c.getContentID())
                .title(c.getTitle())
                .description(c.getDescription())
                .type(c.getType())
                .build();
    }
}
