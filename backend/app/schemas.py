from typing import List, Optional, Any
from pydantic import BaseModel, EmailStr, ConfigDict
import datetime

# Auth Schemas
class UserRegister(BaseModel):
    email: EmailStr
    username: str
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    is_pro: bool
    username: str

class UserResponse(BaseModel):
    id: int
    email: EmailStr
    username: str
    is_pro: bool
    xp: int
    created_at: datetime.datetime

    model_config = ConfigDict(from_attributes=True)

# Quiz Schemas
class QuizOption(BaseModel):
    question: str
    options: List[str]
    answer_index: int
    explanation: str

class QuizSubmit(BaseModel):
    answers: dict[int, int]  # { question_index: selected_option_index }

class QuizResult(BaseModel):
    score: int
    total: int
    passed: bool
    xp_awarded: int
    message: str

# Lesson & Course Schemas
class LessonSummary(BaseModel):
    id: int
    slug: str
    title: string = ""
    order: int
    duration_minutes: int
    is_pro: bool

    model_config = ConfigDict(from_attributes=True)

class LessonDetail(BaseModel):
    id: int
    slug: str
    title: str
    order: int
    video_url: Optional[str]
    lab_image: Optional[str]
    content_md: str
    duration_minutes: int
    is_pro: bool
    quizzes: List[QuizOption] = []

    model_config = ConfigDict(from_attributes=True)

class ModuleResponse(BaseModel):
    id: int
    slug: str
    title: str
    part: int
    weeks_span: Optional[str]
    is_pro: bool
    lessons: List[LessonSummary] = []

    model_config = ConfigDict(from_attributes=True)

# Lab Schemas
class LabStartRequest(BaseModel):
    lesson_slug: str
    image: Optional[str] = "hackforge/metasploitable2"

class LabResponse(BaseModel):
    status: str
    lab_id: str
    container_ip: str
    ws_url: str
    ttl_seconds: int = 3600

# Progress Stats
class ProgressStats(BaseModel):
    total_completed: int
    total_lessons: int
    percent_complete: int
    xp: int
    streak_days: int
    is_pro: bool
