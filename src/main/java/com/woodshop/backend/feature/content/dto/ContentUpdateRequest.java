package com.woodshop.backend.feature.content.dto;

import com.woodshop.backend.feature.content.entity.ContentType;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ContentUpdateRequest {
    String title;
    String description;
    ContentType type;
}
