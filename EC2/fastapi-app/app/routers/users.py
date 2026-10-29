from typing import Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.dependencies import get_db
from app.services.user_service import UserService
from app.schemas.user import UserCreate, UserUpdate, UserResponse, UserListResponse

router = APIRouter(prefix="/users", tags=["users"])

@router.post("", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def create_user(payload: UserCreate, db: AsyncSession = Depends(get_db)):
    service = UserService(db)
    return await service.create_user(payload)

@router.get("", response_model=UserListResponse)
async def list_users(
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(10, ge=1, le=100, description="Items per page"),
    search: Optional[str] = Query(None, description="Search term for username or email"),
    db: AsyncSession = Depends(get_db),
):
    service = UserService(db)
    return await service.list_users(page=page, limit=limit, search=search)

@router.get("/{user_id}", response_model=UserResponse)
async def get_user(user_id: str, db: AsyncSession = Depends(get_db)):
    service = UserService(db)
    return await service.get_by_id(user_id)

@router.patch("/{user_id}", response_model=UserResponse)
async def update_user(user_id: str, payload: UserUpdate, db: AsyncSession = Depends(get_db)):
    service = UserService(db)
    return await service.update_user(user_id, payload)

@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(user_id: str, db: AsyncSession = Depends(get_db)):
    service = UserService(db)
    await service.delete_user(user_id)

