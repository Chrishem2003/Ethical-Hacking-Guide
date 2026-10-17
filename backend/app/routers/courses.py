from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.models import Module, Lesson, User, Progress, Track
from app.schemas import ModuleResponse, LessonDetail, LessonSummary
from app.auth import get_current_user

router = APIRouter(tags=["Courses & Lessons"])

@router.get("/courses", response_model=List[ModuleResponse])
async def get_curriculum(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Module).options(selectinload(Module.lessons)).order_by(Module.part, Module.order)
    )
    modules = result.scalars().all()
    return modules

@router.get("/lessons/{slug}", response_model=LessonDetail)
async def get_lesson_by_slug(
    slug: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(
        select(Lesson)
        .options(selectinload(Lesson.quizzes), selectinload(Lesson.module))
        .where(Lesson.slug == slug)
    )
    lesson = result.scalars().first()

    if not lesson:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Lesson '{slug}' not found."
        )

    # Server-Side Pro Gating Enforcement:
    # Lessons belonging to Part 3 or 4 require is_pro
    if lesson.module.part in (3, 4) and not current_user.is_pro:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This advanced lesson requires an active HACKFORGE Pro membership.",
        )

    return lesson

@router.post("/lessons/{slug}/complete")
async def complete_lesson(
    slug: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(select(Lesson).where(Lesson.slug == slug))
    lesson = result.scalars().first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")

    # Check existing progress
    prog_result = await db.execute(
        select(Progress).where(
            Progress.user_id == current_user.id,
            Progress.lesson_id == lesson.id
        )
    )
    progress = prog_result.scalars().first()

    if not progress:
        progress = Progress(
            user_id=current_user.id,
            lesson_id=lesson.id,
            is_completed=True,
            quiz_score=5
        )
        db.add(progress)
        current_user.xp += 250
    else:
        progress.is_completed = True

    await db.commit()
    return {"status": "completed", "slug": slug, "xp": current_user.xp}
