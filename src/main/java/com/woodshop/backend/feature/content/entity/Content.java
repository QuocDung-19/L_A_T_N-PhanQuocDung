package com.woodshop.backend.feature.content.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Table(name = "contents")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Content {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String contentID;

    String title;

    @Column(length = 2000)
    String description;

    @Enumerated(EnumType.STRING)
    ContentType type;
}
