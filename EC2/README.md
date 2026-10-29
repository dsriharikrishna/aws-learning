# AWS EC2 Multi-Backend Architecture

Production deployment orchestrator for 4 independent microservices fronted by an Nginx reverse proxy on Amazon EC2.

```
                   Internet / Client Requests
                              │
                              ▼ (Port 80/443)
                 ┌───────────────────────────┐
                 │     Nginx API Gateway     │
                 └──────────────┬────────────┘
         ┌───────────────┬──────┴────────┬───────────────┐
         │ /api/express/ │ /api/nest/    │ /api/fastapi/ │ /api/spring/
         ▼               ▼               ▼               ▼
   ┌───────────┐   ┌───────────┐   ┌───────────┐   ┌───────────┐
   │  Express  │   │  NestJS   │   │  FastAPI  │   │  Spring   │
   │ Port 3001 │   │ Port 3002 │   │ Port 3003 │   │ Port 3004 │
   └─────┬─────┘   └─────┬─────┘   └─────┬─────┘   └─────┬─────┘
         │               │               │               │
         └───────────────┼───────────────┼───────────────┘
                         ▼ (Private Subnet / Port 5432)
         ┌───────────────────────────────────────────────┐
         │          Amazon RDS PostgreSQL Multi-AZ       │
         │ (expressdb, nestdb, fastapidb, springdb)      │
         └───────────────────────────────────────────────┘
```

## Microservices Overview

| Service | Stack | Data Store / Tooling | Route Prefix | Tests Verified |
|---|---|---|---|---|
| **[express-app](./express-app)** | Node.js + Express + TypeScript | PostgreSQL (Prisma ORM) | `/api/express` | 9 unit & e2e tests passing |
| **[nest-app](./nest-app)** | NestJS + TypeScript | PostgreSQL (Prisma ORM) | `/api/nest` | 6 e2e tests passing |
| **[fastapi-app](./fastapi-app)** | Python 3.12 + FastAPI | PostgreSQL (SQLAlchemy 2.0 async + Alembic) | `/api/fastapi` | Async test fixtures & schemas |
| **[spring-app](./spring-app)** | Java 21 LTS + Spring Boot 3 | PostgreSQL (Spring Data JPA + Flyway) | `/api/spring` | WebMvcMock unit & e2e tests |

---

## Deployment on AWS EC2

### 1. Launch EC2 Instance
- **AMI**: Ubuntu Server 24.04 LTS or Amazon Linux 2023
- **Instance Type**: `t3.medium` or `t3.large`
- **Security Group**: Ingress on HTTP (80) and HTTPS (443) from `0.0.0.0/0`, SSH (22) from your IP only.

### 2. Configure Environment
```bash
git clone <your-repo> /opt/apps
cd /opt/apps/EC2
cp .env.example .env
```

### 3. Deploy All Services
```bash
docker compose up -d --build
```

