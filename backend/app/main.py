from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routers import auth, courses, labs, quizzes, progress

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="HACKFORGE - Offensive Security and Ethical Hacking Education API",
)

allowed_origins = [origin.strip() for origin in settings.BACKEND_CORS_ORIGINS.split(",") if origin.strip()]
if not allowed_origins:
    raise RuntimeError("BACKEND_CORS_ORIGINS must contain at least one explicit origin")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type", "X-Requested-With"],
)

app.include_router(auth.router, prefix="/api/v1")
app.include_router(courses.router, prefix="/api/v1")
app.include_router(labs.router, prefix="/api/v1")
app.include_router(quizzes.router, prefix="/api/v1")
app.include_router(progress.router, prefix="/api/v1")


@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": settings.PROJECT_NAME, "version": settings.VERSION}
