import time
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from app.dependencies import get_db

router = APIRouter(tags=["health"])

_start_time = time.time()

@router.get("/health")
async def health():
    return {
        "status": "ok",
        "service": "fastapi-app",
        "timestamp": datetime.utcnow().isoformat(),
        "uptime": time.time() - _start_time,
    }

@router.get("/ready")
async def readiness(db: AsyncSession = Depends(get_db)):
    try:
        await db.execute(text("SELECT 1"))
        return {
            "status": "ready",
            "service": "fastapi-app",
            "database": "connected",
            "timestamp": datetime.utcnow().isoformat(),
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail={
                "status": "not_ready",
                "service": "fastapi-app",
                "database": "disconnected",
                "error": str(e),
                "timestamp": datetime.utcnow().isoformat(),
            },
        )

