package com.portfolio.springapp.health;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@Tag(name = "Health", description = "Liveness and readiness health endpoints")
@RestController
public class HealthController {

    private final JdbcTemplate jdbcTemplate;
    private final Instant startTime = Instant.now();

    public HealthController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Operation(summary = "Liveness probe")
    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        Map<String, Object> body = new HashMap<>();
        body.put("status", "ok");
        body.put("service", "spring-app");
        body.put("startTime", startTime.toString());
        body.put("timestamp", Instant.now().toString());
        return ResponseEntity.ok(body);
    }

    @Operation(summary = "Readiness probe")
    @GetMapping("/ready")
    public ResponseEntity<Map<String, Object>> ready() {
        Map<String, Object> body = new HashMap<>();
        try {
            jdbcTemplate.queryForObject("SELECT 1", Integer.class);
            body.put("status", "ready");
            body.put("service", "spring-app");
            body.put("database", "connected");
            body.put("timestamp", Instant.now().toString());
            return ResponseEntity.ok(body);
        } catch (Exception ex) {
            body.put("status", "not_ready");
            body.put("service", "spring-app");
            body.put("database", "disconnected");
            body.put("error", ex.getMessage());
            body.put("timestamp", Instant.now().toString());
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(body);
        }
    }
}

