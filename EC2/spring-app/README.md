# Spring Boot REST API with PostgreSQL, JPA & Flyway

Production-grade Spring Boot 3 enterprise REST API service built with Java 21 LTS, Spring Data JPA, Hibernate, Flyway database migrations, and PostgreSQL. Designed for deployment on AWS EC2.

## Architecture

- **Framework**: Spring Boot 3.3.5 (Java 21 LTS)
- **Persistence**: Spring Data JPA / Hibernate
- **Migrations**: Flyway Migration scripts (`V1__create_tasks_table.sql`)
- **Documentation**: SpringDoc OpenAPI 3.0 UI at `/api/spring/docs`
- **Container**: Multi-stage lightweight `eclipse-temurin:21-jre-alpine` image with unprivileged user
- **Port**: 3004 (Context path: `/api/spring`)

## Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/spring/health` | Liveness health check |
| `GET` | `/api/spring/ready` | Readiness check verifying database connectivity |
| `GET` | `/api/spring/docs` | Swagger / OpenAPI UI |
| `POST` | `/api/spring/tasks` | Create a new task |
| `GET` | `/api/spring/tasks` | List tasks (page, limit, search, status filters) |
| `GET` | `/api/spring/tasks/{id}` | Retrieve task by ID |
| `PATCH` | `/api/spring/tasks/{id}` | Update task details |
| `DELETE` | `/api/spring/tasks/{id}` | Delete task |

## Local Development

```bash
# Set environment variables or run PostgreSQL
export DATABASE_URL=jdbc:postgresql://localhost:5432/springdb
export DATABASE_USERNAME=springuser
export DATABASE_PASSWORD=springpass

# Build and run
mvn spring-boot:run
```

## Running Tests

```bash
mvn test
```

## Docker Deployment

```bash
docker compose up -d --build
```

