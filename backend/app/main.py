from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routers import auth, courses, labs, quizzes, progress

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="HACKFORGE - Production-Grade Offensive Security Education API by Chrishem"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API Routers
app.include_router(auth.router, prefix="/api/v1")
app.include_router(courses.router, prefix="/api/v1")
app.include_router(labs.router, prefix="/api/v1")
app.include_router(quizzes.router, prefix="/api/v1")
app.include_router(progress.router, prefix="/api/v1")

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION
    }
