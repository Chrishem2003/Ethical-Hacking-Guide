import os
from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(extra="ignore")

    PROJECT_NAME: str = "HACKFORGE API"
    VERSION: str = "2.6.0"
    API_V1_STR: str = "/api/v1"

    # No fallback database URL or signing key: deployment must supply real values.
    DATABASE_URL: str = Field(min_length=1)
    SECRET_KEY: str = Field(min_length=32)
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    REFRESH_TOKEN_EXPIRE_DAYS: int = 30

    LEMON_SQUEEZY_WEBHOOK_SECRET: str = ""
    BACKEND_CORS_ORIGINS: str = "http://localhost:3000"

    LAB_NETWORK: str = "hackforge_labs_net"
    LAB_MEMORY_LIMIT: str = "512m"
    LAB_CPU_QUOTA: float = 0.5
    LAB_TTL_SECONDS: int = 3600
    ALLOWED_IMAGES: list[str] = [
        "hackforge/dvwa",
        "hackforge/metasploitable2",
        "hackforge/juice-shop",
        "hackforge/kali-toolbox",
    ]

    @field_validator("SECRET_KEY")
    @classmethod
    def reject_placeholder_signing_keys(cls, value: str) -> str:
        normalized = value.strip().lower()
        blocked = {"replace_me", "change_me", "demo_secret", "hackforge_jwt_super_secret_production_key_2026"}
        if len(value.strip()) < 32 or normalized in blocked or "replace_with" in normalized or "change_me" in normalized:
            raise ValueError("SECRET_KEY must be a unique random value of at least 32 characters; placeholder keys are not allowed")
        return value

    @field_validator("DATABASE_URL")
    @classmethod
    def reject_placeholder_database_url(cls, value: str) -> str:
        if "replace_with" in value.lower() or "change_me" in value.lower():
            raise ValueError("DATABASE_URL must point to a configured database; placeholders are not allowed")
        return value


settings = Settings()
