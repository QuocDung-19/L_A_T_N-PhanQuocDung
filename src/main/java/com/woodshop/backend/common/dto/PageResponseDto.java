package com.woodshop.backend.common.dto;

import org.springframework.data.domain.Page;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PageResponseDto<T> {
    private long totalElements;
    private int totalPages;
    private int pageNumber;
    private int pageSize;
    private Object content;

    public static <T> PageResponseDto<T> of(Page<T> page) {
        return new PageResponseDto<>(page.getTotalElements(), page.getTotalPages(), page.getNumber(), page.getSize(), page.getContent());
    }
}
