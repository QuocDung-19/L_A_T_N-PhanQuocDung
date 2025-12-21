package com.app.woodshop.feature.product.entity;
import jakarta.persistence.*;import lombok.*;import lombok.experimental.FieldDefaults;
@Entity@Table(name = "categories")@Data@Builder@AllArgsConstructor@NoArgsConstructor@FieldDefaults(level = AccessLevel.PRIVATE)public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @Column(nullable = false, unique = true)
    String name;

    String description;



}