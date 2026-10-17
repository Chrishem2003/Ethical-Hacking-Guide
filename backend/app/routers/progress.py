from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func

from app.database import get_db
from app.models import Progress, Lesson, User
from app.schemas import ProgressStats
from app.auth import get_current_user

router = APIRouter(prefix="/progress", tags=["Progress & Certificates"])

@router.get("/stats", response_model=ProgressStats)
async def get_progress_stats(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    total_lessons_res = await db.execute(select(func.count(Lesson.id)))
    total_lessons = total_lessons_res.scalar() or 24

    completed_res = await db.execute(
        select(func.count(Progress.id)).where(
            Progress.user_id == current_user.id,
            Progress.is_completed == True
        )
    )
    total_completed = completed_res.scalar() or 0

    percent = int((total_completed / max(1, total_lessons)) * 100)

    return ProgressStats(
        total_completed=total_completed,
        total_lessons=total_lessons,
        percent_complete=percent,
        xp=current_user.xp,
        streak_days=3,
        is_pro=current_user.is_pro
    )

@router.get("/certificate")
async def get_certificate_data(current_user: User = Depends(get_current_user)):
    cert_hash = f"HF-CERT-{abs(hash(current_user.email)) % 1000000:06d}"
    return {
        "student_name": current_user.username,
        "certificate_id": cert_hash,
        "track": "Offensive Security & Ethical Hacking Masterclass",
        "instructor": "Chrishem",
        "is_eligible": True
    }
