package com.woodshop.backend.feature.admin.dto;

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
public class AdminContentResponse {
    String contentID;
    String title;
    String description;
    String type; // BANNER, POLICY, INTRODUCTION, CONTACT
}
