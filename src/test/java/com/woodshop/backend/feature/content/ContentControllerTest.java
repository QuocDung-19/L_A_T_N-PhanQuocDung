package com.woodshop.backend.feature.content;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.woodshop.backend.feature.content.dto.ContentCreateRequest;
import com.woodshop.backend.feature.content.dto.ContentUpdateRequest;
import com.woodshop.backend.feature.content.entity.ContentType;
import com.woodshop.backend.feature.content.repository.ContentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class ContentControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper mapper;

    @Autowired
    private ContentRepository contentRepository;

    @BeforeEach
    void setUp() {
        contentRepository.deleteAll();
    }

    @Test
    void testCreateContent() throws Exception {
        ContentCreateRequest request = new ContentCreateRequest();
        request.setTitle("Integration Banner");
        request.setDescription("Integration Description");
        request.setType(ContentType.BANNER);

        mockMvc.perform(post("/api/contents")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Integration Banner"))
                .andExpect(jsonPath("$.type").value("BANNER"));
    }

    @Test
    void testGetAllContent() throws Exception {
        // Tạo trước 1 content
        ContentCreateRequest request = new ContentCreateRequest();
        request.setTitle("Test Banner");
        request.setDescription("Desc");
        request.setType(ContentType.BANNER);
        mockMvc.perform(post("/api/contents")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(request)))
                .andExpect(status().isOk());

        mockMvc.perform(get("/api/contents"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("Test Banner"));
    }

    @Test
    void testUpdateContent() throws Exception {
        // Tạo content
        var result = mockMvc.perform(post("/api/contents")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(new ContentCreateRequest("Old", "Old Desc", ContentType.BANNER))))
                .andReturn();

        String responseBody = result.getResponse().getContentAsString();
        String contentId = mapper.readTree(responseBody).get("contentID").asText();

        ContentUpdateRequest updateRequest = new ContentUpdateRequest();
        updateRequest.setTitle("Updated Title");
        updateRequest.setDescription("Updated Desc");
        updateRequest.setType(ContentType.INTRODUCTION);

        mockMvc.perform(put("/api/contents/" + contentId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(updateRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Updated Title"))
                .andExpect(jsonPath("$.type").value("INTRODUCTION"));
    }

    @Test
    void testDeleteContent() throws Exception {
        // Tạo content
        var result = mockMvc.perform(post("/api/contents")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(new ContentCreateRequest("To Delete", "Desc", ContentType.BANNER))))
                .andReturn();

        String contentId = mapper.readTree(result.getResponse().getContentAsString()).get("contentID").asText();

        mockMvc.perform(delete("/api/contents/" + contentId))
                .andExpect(status().isOk());

        mockMvc.perform(get("/api/contents"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isEmpty());
    }
}
