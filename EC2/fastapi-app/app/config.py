from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PORT: int = 3003
    HOST: str = "0.0.0.0"
    ENVIRONMENT: str = "development"
    DATABASE_URL: str = "postgresql+asyncpg://fastapiuser:fastapipass@localhost:5434/fastapidb"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

settings = Settings()

