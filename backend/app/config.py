import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "HACKFORGE API"
    VERSION: str = "2.6.0"
    API_V1_STR: str = "/api/v1"
    
    # Database
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", 
        "postgresql+asyncpg://hackforge:hackforge_secure_pass_2026@localhost:5432/hackforge"
    )
    
    # JWT Auth
    SECRET_KEY: str = os.getenv("SECRET_KEY", "hackforge_jwt_super_secret_production_key_2026")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    REFRESH_TOKEN_EXPIRE_DAYS: int = 30
    
    # Lemon Squeezy
    LEMON_SQUEEZY_WEBHOOK_SECRET: str = os.getenv("LEMON_SQUEEZY_WEBHOOK_SECRET", "demo_secret")
    
    # Lab Sandbox Container Orchestration
    LAB_NETWORK: str = "hackforge_labs_net"
    LAB_MEMORY_LIMIT: str = "512m"
    LAB_CPU_QUOTA: float = 0.5
    LAB_TTL_SECONDS: int = 3600  # 60 minutes
    ALLOWED_IMAGES: list[str] = [
        "hackforge/dvwa",
        "hackforge/metasploitable2",
        "hackforge/juice-shop",
        "hackforge/kali-toolbox"
    ]

settings = Settings()
