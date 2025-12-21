package com.app.woodshop.feature.order.controller;

import com.app.woodshop.common.ApiResponse;
import com.app.woodshop.feature.order.entity.News;
import com.app.woodshop.feature.order.service.NewsService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.AccessLevel;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/news")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@CrossOrigin(origins = "http://localhost:3000") // CORS FE
public class NewsController {

    NewsService newsService;

    // PUBLIC
    @GetMapping
    ApiResponse<List<News>> findAll() {
        return ApiResponse.<List<News>>builder()
                .message("Lấy danh sách tin tức")
                .result(newsService.findAll())
                .build();
    }

    @GetMapping("/{newsID}")
    ApiResponse<News> findById(@PathVariable Long newsID) {
        return ApiResponse.<News>builder()
                .message("Lấy tin tức: " + newsID)
                .result(newsService.findById(newsID))
                .build();
    }

    // ADMIN
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<News> create(
            @RequestPart("news") String newsJson,
            @RequestPart(value = "image", required = false) MultipartFile image
    ) throws Exception {
        ObjectMapper mapper = new ObjectMapper();
        News news = mapper.readValue(newsJson, News.class);
        news.setNewsID(null);

        return ApiResponse.<News>builder()
                .message("Tạo tin tức: " + news.getTitle())
                .result(newsService.create(news, image))
                .build();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<News> update(
            @RequestPart("news") String newsJson,
            @RequestPart(value = "image", required = false) MultipartFile image
    ) throws Exception {
        ObjectMapper mapper = new ObjectMapper();
        News news = mapper.readValue(newsJson, News.class);

        return ApiResponse.<News>builder()
                .message("Cập nhật tin tức: " + news.getNewsID())
                .result(newsService.update(news, image))
                .build();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{newsID}")
    ApiResponse<String> delete(@PathVariable Long newsID) {
        newsService.delete(newsID);
        return ApiResponse.<String>builder()
                .message("Xóa tin tức: " + newsID)
                .build();
    }
}
