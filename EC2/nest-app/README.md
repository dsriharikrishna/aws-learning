# NestJS REST API with PostgreSQL & Prisma

Production-ready NestJS backend microservice built with TypeScript, Prisma ORM, and PostgreSQL. Designed for deployment on AWS EC2 with Docker.

## Architecture

- **Framework**: NestJS 10 (TypeScript)
- **Database**: PostgreSQL 16 via Prisma ORM
- **Validation**: class-validator & class-transformer
- **Documentation**: Swagger / OpenAPI at `/api/nest/docs`
- **Container**: Multi-stage lightweight Alpine Dockerfile
- **Port**: 3002

## Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/nest/health` | Liveness health probe |
| `GET` | `/api/nest/ready` | Readiness probe (database connectivity) |
| `GET` | `/api/nest/docs` | Swagger / OpenAPI UI |
| `POST` | `/api/nest/products` | Create a new product |
| `GET` | `/api/nest/products` | List products (with pagination `page`, `limit`, `search`) |
| `GET` | `/api/nest/products/:id` | Fetch product by ID |
| `PATCH` | `/api/nest/products/:id` | Update product attributes |
| `DELETE` | `/api/nest/products/:id` | Remove a product |

## Local Development

```bash
cp .env.example .env
pnpm install
pnpm exec prisma generate
pnpm exec prisma migrate dev
pnpm run start:dev
```

## Running Tests

```bash
pnpm test
```

## Docker Deployment

```bash
docker compose up -d --build
```

