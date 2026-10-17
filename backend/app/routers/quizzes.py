from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.models import Lesson, Quiz, Progress, User
from app.schemas import QuizSubmit, QuizResult
from app.auth import get_current_user

router = APIRouter(prefix="/quizzes", tags=["Quizzes & Evaluation"])

@router.post("/{lesson_slug}/submit", response_model=QuizResult)
async def submit_quiz(
    lesson_slug: str,
    submission: QuizSubmit,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(
        select(Lesson).options(selectinload(Lesson.quizzes)).where(Lesson.slug == lesson_slug)
    )
    lesson = result.scalars().first()

    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found.")

    quizzes = lesson.quizzes
    total = len(quizzes)
    if total == 0:
        return QuizResult(
            score=0,
            total=0,
            passed=True,
            xp_awarded=100,
            message="No quiz required for this module."
        )

    score = 0
    for idx, quiz in enumerate(quizzes):
        user_choice = submission.answers.get(idx)
        if user_choice == quiz.answer_index:
            score += 1

    passing_score = int(total * 0.8)
    passed = score >= passing_score

    # Gate lesson completion: only mark completed if passed
    if passed:
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
                quiz_score=score
            )
            db.add(progress)
            current_user.xp += 250
        else:
            if not progress.is_completed:
                current_user.xp += 250
            progress.is_completed = True
            progress.quiz_score = max(progress.quiz_score, score)

        await db.commit()

    return QuizResult(
        score=score,
        total=total,
        passed=passed,
        xp_awarded=250 if passed else 0,
        message="Mastery validated! Lesson completion unlocked." if passed else "Score under 80% passing threshold. Please review theory and retake."
    )
