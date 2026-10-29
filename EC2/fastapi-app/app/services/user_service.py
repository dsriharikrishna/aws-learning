from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, or_
from fastapi import HTTPException, status
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate

class UserService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_id(self, user_id: str) -> User:
        result = await self.db.execute(select(User).where(User.id == user_id))
        user = result.scalar_one_or_none()
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"User '{user_id}' not found")
        return user

    async def list_users(self, page: int = 1, limit: int = 10, search: Optional[str] = None):
        offset = (page - 1) * limit
        query = select(User)
        count_query = select(func.count()).select_from(User)

        if search:
            search_filter = or_(
                User.username.ilike(f"%{search}%"),
                User.email.ilike(f"%{search}%"),
                User.full_name.ilike(f"%{search}%")
            )
            query = query.where(search_filter)
            count_query = count_query.where(search_filter)

        total_result = await self.db.execute(count_query)
        total = total_result.scalar_one()

        items_result = await self.db.execute(
            query.order_by(User.created_at.desc()).offset(offset).limit(limit)
        )
        users = items_result.scalars().all()

        total_pages = (total + limit - 1) // limit if total > 0 else 0
        return {
            "data": users,
            "total": total,
            "page": page,
            "limit": limit,
            "total_pages": total_pages,
        }

    async def create_user(self, payload: UserCreate) -> User:
        conflict_query = select(User).where(
            or_(User.username == payload.username, User.email == payload.email)
        )
        existing = (await self.db.execute(conflict_query)).scalar_one_or_none()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="User with this username or email already exists"
            )

        new_user = User(**payload.model_dump())
        self.db.add(new_user)
        await self.db.commit()
        await self.db.refresh(new_user)
        return new_user

    async def update_user(self, user_id: str, payload: UserUpdate) -> User:
        user = await self.get_by_id(user_id)
        update_data = payload.model_dump(exclude_unset=True)

        if "username" in update_data or "email" in update_data:
            conditions = []
            if "username" in update_data:
                conditions.append(User.username == update_data["username"])
            if "email" in update_data:
                conditions.append(User.email == update_data["email"])
            conflict = (await self.db.execute(
                select(User).where(or_(*conditions), User.id != user_id)
            )).scalar_one_or_none()
            if conflict:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="Username or email already taken"
                )

        for key, value in update_data.items():
            setattr(user, key, value)

        await self.db.commit()
        await self.db.refresh(user)
        return user

    async def delete_user(self, user_id: str) -> None:
        user = await self.get_by_id(user_id)
        await self.db.delete(user)
        await self.db.commit()

