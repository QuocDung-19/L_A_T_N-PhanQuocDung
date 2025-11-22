package com.woodshop.backend.config;

import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
@Slf4j
public class DatabaseConfig {

    // PostgreSQL
    @Value("${spring.datasource.url}")
    String pgUrl;

    // MongoDB
    @Value("${spring.data.mongodb.uri}")
    String mongoUri;

    // Redis
    @Value("${spring.redis.host}")
    String redisHost;

    @Value("${spring.redis.port}")
    int redisPort;

    @PostConstruct
    public void printDatabaseInfo() {
        log.info("===== DATABASE CONFIG LOADED =====");
        log.info("PostgreSQL URL: {}", pgUrl);
        log.info("MongoDB URI: {}", mongoUri);
        log.info("Redis: {}:{}", redisHost, redisPort);
        log.info("==================================");
    }
}
