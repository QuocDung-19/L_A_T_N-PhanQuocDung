package com.woodshop.backend.feature.content.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.woodshop.backend.feature.content.dto.ContentCreateRequest;
import com.woodshop.backend.feature.content.dto.ContentResponse;
import com.woodshop.backend.feature.content.dto.ContentUpdateRequest;
import com.woodshop.backend.feature.content.service.ContentService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/contents")
@RequiredArgsConstructor
public class ContentController {

    private final ContentService service;

    @PostMapping
    public ContentResponse create(@RequestBody ContentCreateRequest request) {
        return service.createContent(request);
    }

    @GetMapping
    public List<ContentResponse> getAll() {
        return service.getAll();
    }

    @GetMapping("/type/{type}")
    public List<ContentResponse> getByType(@PathVariable String type) {
        return service.getByType(type);
    }

    @PutMapping("/{id}")
    public ContentResponse update(@PathVariable String id,
                                  @RequestBody ContentUpdateRequest request) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable String id) {
        service.delete(id);
        return "Deleted";
    }
}
