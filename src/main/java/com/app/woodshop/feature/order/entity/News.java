package com.app.woodshop.feature.order.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Table(name = "news")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class News {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long newsID;

    @Column(nullable = false)
    String title;

    @Column(columnDefinition = "TEXT")
    String content;

    String imageUrl;

    @Column(nullable = false)
    String status; // ACTIVE / INACTIVE
}
