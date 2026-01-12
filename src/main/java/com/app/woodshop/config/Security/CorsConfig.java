package com.app.woodshop.config.Security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();

        // FRONTEND ORIGIN
        config.addAllowedOrigin("http://localhost:3000");

        // ALLOW COOKIE / AUTH HEADER
        config.setAllowCredentials(true);

        // ALLOW ALL HEADER & METHOD
        config.addAllowedHeader("*");
        config.addAllowedMethod("*");

        // REGISTER
        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return new CorsFilter(source);
    }
}
