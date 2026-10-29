package com.portfolio.springapp.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Spring Boot Tasks Microservice")
                        .version("1.0.0")
                        .description("Production-grade Spring Boot 3 REST API with PostgreSQL, JPA, and Flyway")
                        .contact(new Contact().name("Dasari Sriharikrishna")));
    }
}

