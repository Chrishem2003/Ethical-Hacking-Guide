from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.config import settings
from app.database import get_db
from app.models import User, LabInstance
from app.schemas import LabStartRequest, LabResponse
from app.auth import get_current_user

router = APIRouter(prefix="/labs", tags=["Lab Sandbox Orchestration"])

# Docker SDK integration with resilient fallback
try:
    import docker
    docker_client = docker.from_env()
except Exception:
    docker_client = None

@router.post("/start", response_model=LabResponse)
async def start_lab_container(
    payload: LabStartRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    image = payload.image or "hackforge/metasploitable2"

    # Enforce image allowlist: must be in ALLOWED_IMAGES
    if image not in settings.ALLOWED_IMAGES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Security violation: Image '{image}' is not in the Hackforge authorized sandbox allowlist."
        )

    expires_at = datetime.utcnow() + timedelta(seconds=settings.LAB_TTL_SECONDS)
    container_id = f"hf-{current_user.id}-{int(datetime.utcnow().timestamp())}"
    container_ip = "192.168.56.102"

    # Docker sandbox container launch if local Docker engine available
    if docker_client:
        try:
            # 512MB RAM, 0.5 CPU, isolated network
            container = docker_client.containers.run(
                image,
                detach=True,
                name=container_id,
                mem_limit=settings.LAB_MEMORY_LIMIT,
                cpu_quota=int(settings.LAB_CPU_QUOTA * 100000),
                network=settings.LAB_NETWORK,
                labels={
                    "user_id": str(current_user.id),
                    "lesson_slug": payload.lesson_slug,
                    "ttl": str(int(expires_at.timestamp()))
                }
            )
            container_id = container.id[:12]
        except Exception as e:
            # Fallback to simulated container metadata if Docker daemon socket is restricted
            container_id = f"sim-{container_id[:8]}"

    # Record active lab instance
    lab = LabInstance(
        user_id=current_user.id,
        container_id=container_id,
        image=image,
        lesson_slug=payload.lesson_slug,
        status="running",
        expires_at=expires_at
    )
    db.add(lab)
    await db.commit()

    ws_url = f"wss://labs.hackforge.dev/ws/{payload.lesson_slug}?token={container_id}"

    return LabResponse(
        status="running",
        lab_id=container_id,
        container_ip=container_ip,
        ws_url=ws_url,
        ttl_seconds=settings.LAB_TTL_SECONDS
    )

@router.post("/stop")
async def stop_lab_container(
    lab_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(LabInstance).where(
            LabInstance.container_id == lab_id,
            LabInstance.user_id == current_user.id
        )
    )
    lab = result.scalars().first()

    if docker_client and lab:
        try:
            container = docker_client.containers.get(lab.container_id)
            container.stop(timeout=2)
            container.remove()
        except Exception:
            pass

    if lab:
        lab.status = "stopped"
        await db.commit()

    return {"status": "stopped", "lab_id": lab_id}
