import asyncio
import json
import os
import re
from sqlalchemy.future import select
from app.database import AsyncSessionLocal, engine, Base
from app.models import Module, Lesson, Quiz, User
from app.auth import get_password_hash

CURRICULUM_FILE = os.path.join(os.path.dirname(__file__), "..", "content", "curriculum.json")

async def seed_database():
    print("[*] Initializing HACKFORGE Database schema...")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with AsyncSessionLocal() as db:
        # 1. Create or verify default demo user & admin
        demo_user_res = await db.execute(select(User).where(User.email == "student@hackforge.dev"))
        demo_user = demo_user_res.scalars().first()
        if not demo_user:
            demo_user = User(
                email="student@hackforge.dev",
                username="student",
                hashed_password=get_password_hash("hackforge2026"),
                is_pro=True,
                xp=500
            )
            db.add(demo_user)
            print("[+] Seeded demo student account (student@hackforge.dev / hackforge2026)")

        # 2. Parse curriculum.json
        if not os.path.exists(CURRICULUM_FILE):
            print(f"[!] Curriculum file not found at {CURRICULUM_FILE}")
            await db.commit()
            return

        with open(CURRICULUM_FILE, "r", encoding="utf-8") as f:
            lessons_data = json.load(f)

        print(f"[*] Parsing {len(lessons_data)} lessons from curriculum.json...")

        # Group by module
        modules_cache = {}

        for item in lessons_data:
            module_name = item.get("module", "General Foundations")
            part_number = item.get("part", 1)
            is_pro = item.get("is_pro", False)
            module_slug = re.sub(r'[^a-zA-Z0-9]+', '-', module_name.lower()).strip('-')

            if module_slug not in modules_cache:
                # Query or insert module
                mod_res = await db.execute(select(Module).where(Module.slug == module_slug))
                module_obj = mod_res.scalars().first()

                if not module_obj:
                    module_obj = Module(
                        slug=module_slug,
                        title=module_name,
                        part=part_number,
                        is_pro=is_pro,
                        order=part_number * 10
                    )
                    db.add(module_obj)
                    await db.flush()
                modules_cache[module_slug] = module_obj

            current_module = modules_cache[module_slug]

            # Upsert Lesson
            slug = item.get("slug")
            lesson_res = await db.execute(select(Lesson).where(Lesson.slug == slug))
            lesson_obj = lesson_res.scalars().first()

            if not lesson_obj:
                lesson_obj = Lesson(
                    module_id=current_module.id,
                    slug=slug,
                    title=item.get("title"),
                    order=item.get("order", 1),
                    video_url=item.get("video_url"),
                    lab_image=item.get("lab_image"),
                    content_md=item.get("content_md", ""),
                    is_pro=item.get("is_pro", False),
                    duration_minutes=35
                )
                db.add(lesson_obj)
                await db.flush()

                # Add Quizzes
                quizzes = item.get("quiz", [])
                for q in quizzes:
                    quiz_obj = Quiz(
                        lesson_id=lesson_obj.id,
                        question=q.get("question"),
                        options=q.get("options"),
                        answer_index=q.get("answer"),
                        explanation=q.get("explanation", "")
                    )
                    db.add(quiz_obj)

        await db.commit()
        print("[+] Curriculum successfully seeded! (Idempotent run completed)")

if __name__ == "__main__":
    asyncio.run(seed_database())
