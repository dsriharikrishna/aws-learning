# Python + FastAPI REST API with SQLAlchemy 2.0 & PostgreSQL

Production-grade asynchronous REST API microservice built with FastAPI, SQLAlchemy 2.0 (asyncio + asyncpg), Alembic migrations, and PostgreSQL. Designed for deployment on AWS EC2.

## Architecture

- **Framework**: FastAPI (Python 3.12)
- **ORM**: SQLAlchemy 2.0 (AsyncSession) + asyncpg driver
- **Validation**: Pydantic v2
- **Migrations**: Alembic (async execution engine)
- **Documentation**: Swagger UI at `/api/fastapi/docs` & ReDoc
- **Container**: Non-root `python:3.12-slim` Docker container
- **Port**: 3003

## Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/fastapi/health` | Service liveness probe |
| `GET` | `/api/fastapi/ready` | Readiness probe (database connectivity) |
| `GET` | `/api/fastapi/docs` | Swagger / OpenAPI UI |
| `POST` | `/api/fastapi/users` | Register a new user |
| `GET` | `/api/fastapi/users` | List users (paginated, with search query) |
| `GET` | `/api/fastapi/users/{id}` | Get user by ID |
| `PATCH` | `/api/fastapi/users/{id}` | Update user fields |
| `DELETE` | `/api/fastapi/users/{id}` | Remove a user |

## Local Development

```bash
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate
pip install -r requirements.txt -r requirements-dev.txt

# Run migrations
alembic upgrade head

# Run seed data
python scripts/seed.py

# Start dev server
uvicorn app.main:app --reload --port 3003
```

## Running Tests

```bash
pytest -v
```

## Docker Deployment

```bash
docker compose up -d --build
```

