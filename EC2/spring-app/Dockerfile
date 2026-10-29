# ── Stage 1: builder ─────────────────────────────────────────────────────────
FROM maven:3.9.9-eclipse-temurin-21-alpine AS builder

WORKDIR /app

COPY pom.xml .
RUN mvn dependency:go-offline -B

COPY src ./src
RUN mvn clean package -DskipTests

# ── Stage 2: production runner ───────────────────────────────────────────────
FROM eclipse-temurin:21-jre-alpine AS runner

WORKDIR /app

ENV PORT=3004

RUN addgroup --system --gid 1001 spring && \
    adduser --system --uid 1001 spring

# Install curl for healthcheck
RUN apk add --no-cache curl

COPY --from=builder /app/target/spring-app-*.jar app.jar

USER spring

EXPOSE 3004

HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD curl -f http://localhost:3004/api/spring/actuator/health || exit 1

ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]
