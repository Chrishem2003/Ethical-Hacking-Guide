import datetime
from sqlalchemy import (
    Column, Integer, String, Text, Boolean, ForeignKey, DateTime, Float, JSON
)
from sqlalchemy.orm import relationship
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    username = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    is_pro = Column(Boolean, default=False)
    lemon_squeezy_customer_id = Column(String(255), nullable=True)
    xp = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    progress_entries = relationship("Progress", back_populates="user", cascade="all, delete-orphan")
    active_labs = relationship("LabInstance", back_populates="user", cascade="all, delete-orphan")


class Track(Base):
    __tablename__ = "tracks"

    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String(100), unique=True, index=True, nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    order = Column(Integer, default=1)

    # Relationships
    modules = relationship("Module", back_populates="track", cascade="all, delete-orphan")


class Module(Base):
    __tablename__ = "modules"

    id = Column(Integer, primary_key=True, index=True)
    track_id = Column(Integer, ForeignKey("tracks.id"), nullable=True)
    slug = Column(String(100), unique=True, index=True, nullable=False)
    title = Column(String(255), nullable=False)
    part = Column(Integer, nullable=False, default=1)
    weeks_span = Column(String(50), nullable=True)
    is_pro = Column(Boolean, default=False)
    order = Column(Integer, default=1)

    # Relationships
    track = relationship("Track", back_populates="modules")
    lessons = relationship("Lesson", back_populates="module", cascade="all, delete-orphan")


class Lesson(Base):
    __tablename__ = "lessons"

    id = Column(Integer, primary_key=True, index=True)
    module_id = Column(Integer, ForeignKey("modules.id"), nullable=False)
    slug = Column(String(150), unique=True, index=True, nullable=False)
    title = Column(String(255), nullable=False)
    order = Column(Integer, default=1)
    video_url = Column(String(500), nullable=True)
    lab_image = Column(String(150), nullable=True)
    content_md = Column(Text, nullable=False)
    duration_minutes = Column(Integer, default=30)
    is_pro = Column(Boolean, default=False)

    # Relationships
    module = relationship("Module", back_populates="lessons")
    quizzes = relationship("Quiz", back_populates="lesson", cascade="all, delete-orphan")
    progress_records = relationship("Progress", back_populates="lesson", cascade="all, delete-orphan")


class Quiz(Base):
    __tablename__ = "quizzes"

    id = Column(Integer, primary_key=True, index=True)
    lesson_id = Column(Integer, ForeignKey("lessons.id"), nullable=False)
    question = Column(Text, nullable=False)
    options = Column(JSON, nullable=False)  # List of 4 string options
    answer_index = Column(Integer, nullable=False)
    explanation = Column(Text, nullable=False)

    # Relationships
    lesson = relationship("Lesson", back_populates="quizzes")


class Progress(Base):
    __tablename__ = "progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    lesson_id = Column(Integer, ForeignKey("lessons.id"), nullable=False)
    is_completed = Column(Boolean, default=False)
    quiz_score = Column(Integer, default=0)
    completed_at = Column(DateTime, nullable=True)

    # Relationships
    user = relationship("User", back_populates="progress_entries")
    lesson = relationship("Lesson", back_populates="progress_records")


class LabInstance(Base):
    __tablename__ = "lab_instances"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    container_id = Column(String(255), nullable=False)
    image = Column(String(150), nullable=False)
    lesson_slug = Column(String(150), nullable=False)
    status = Column(String(50), default="running")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    expires_at = Column(DateTime, nullable=False)

    # Relationships
    user = relationship("User", back_populates="active_labs")
