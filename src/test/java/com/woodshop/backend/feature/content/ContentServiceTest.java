package com.woodshop.backend.feature.content;

import com.woodshop.backend.feature.content.dto.ContentCreateRequest;
import com.woodshop.backend.feature.content.dto.ContentResponse;
import com.woodshop.backend.feature.content.dto.ContentUpdateRequest;
import com.woodshop.backend.feature.content.entity.Content;
import com.woodshop.backend.feature.content.entity.ContentType;
import com.woodshop.backend.feature.content.repository.ContentRepository;
import com.woodshop.backend.feature.content.service.ContentService;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

@SpringBootTest
class ContentServiceTest {

    @Autowired
    private ContentService contentService;

    @Autowired
    private ContentRepository contentRepository;

    private Content savedContent;

    @BeforeEach
    void setUp() {
        contentRepository.deleteAll();
        Content content = Content.builder()
                .title("Initial Title")
                .description("Initial Description")
                .type(ContentType.BANNER)
                .build();
        savedContent = contentRepository.save(content);
    }

    @Test
    void testCreateContent() {
        ContentCreateRequest request = new ContentCreateRequest();
        request.setTitle("New Banner");
        request.setDescription("New Banner Description");
        request.setType(ContentType.BANNER);

        ContentResponse response = contentService.createContent(request);
        Assertions.assertNotNull(response.getContentID());
        Assertions.assertEquals("New Banner", response.getTitle());
    }

    @Test
    void testUpdateContent() {
        ContentUpdateRequest request = new ContentUpdateRequest();
        request.setTitle("Updated Title");
        request.setDescription("Updated Description");
        request.setType(ContentType.INTRODUCTION);

        ContentResponse updated = contentService.update(savedContent.getContentID(), request);
        Assertions.assertEquals("Updated Title", updated.getTitle());
        Assertions.assertEquals(ContentType.INTRODUCTION, updated.getType());
    }

    @Test
    void testDeleteContent() {
        contentService.delete(savedContent.getContentID());
        Assertions.assertFalse(contentRepository.findById(savedContent.getContentID()).isPresent());
    }

    @Test
    void testGetAllContent() {
        List<ContentResponse> all = contentService.getAll();
        Assertions.assertFalse(all.isEmpty());
        Assertions.assertTrue(all.stream().anyMatch(c -> c.getContentID().equals(savedContent.getContentID())));
    }

    @Test
    void testGetByType() {
        List<ContentResponse> banners = contentService.getByType(ContentType.BANNER.name());
        Assertions.assertFalse(banners.isEmpty());
        Assertions.assertEquals(ContentType.BANNER, banners.get(0).getType());
    }
}
