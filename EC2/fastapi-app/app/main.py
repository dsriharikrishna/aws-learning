from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import health, users

app = FastAPI(
    title="FastAPI Users Microservice",
    description="Production-grade asynchronous REST API with SQLAlchemy 2.0 & PostgreSQL for AWS EC2",
    version="1.0.0",
    docs_url="/api/fastapi/docs",
    openapi_url="/api/fastapi/openapi.json",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router, prefix="/api/fastapi")
app.include_router(users.router, prefix="/api/fastapi")

