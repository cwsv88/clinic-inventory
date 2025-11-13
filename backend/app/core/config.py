from functools import lru_cache

from pydantic import AnyUrl, Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application configuration loaded from environment variables."""

    database_url: AnyUrl = Field(
        default="postgresql+psycopg://user:pass@host:5432/dbname",
        alias="DATABASE_URL",
        description="SQLAlchemy compatible database URL",
    )
    app_name: str = Field(default="Clinic Inventory API", alias="APP_NAME")
    api_v1_str: str = Field(default="/api/v1", alias="API_V1_STR")

    model_config = SettingsConfigDict(env_file=(".env",), env_file_encoding="utf-8", extra="ignore")

    @property
    def sqlalchemy_database_uri(self) -> str:
        """Return the SQLAlchemy-compatible database URI."""

        return str(self.database_url)


@lru_cache
def get_settings() -> Settings:
    """Cached settings to avoid reloading environment variables."""

    return Settings()  # type: ignore[arg-type]


settings = get_settings()
