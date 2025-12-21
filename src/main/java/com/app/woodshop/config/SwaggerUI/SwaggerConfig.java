package com.app.woodshop.config.SwaggerUI;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("WoodProject")
                        .version("1.0.0")
                        .description("API for WoodProject")
                        .contact(new Contact()
                                .name("Phan Quoc Dung")
                                .url("https://github.com/QuocDung-19/L_A_T_N-PhanQuocDung"))
                        .license(new License()
                                .name("MIT License")
                                .url("https://opensource.org/licenses/MIT")));
    }
}

