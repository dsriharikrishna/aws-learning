from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, EmailStr, Field

class UserBase(BaseModel):
    username: str = Field(..., min_length=3, max_length=50, example="john_doe")
    email: EmailStr = Field(..., example="john@example.com")
    full_name: Optional[str] = Field(None, max_length=100, example="John Doe")
    is_active: bool = Field(True, example=True)

class UserCreate(UserBase):
    pass

class UserUpdate(BaseModel):
    username: Optional[str] = Field(None, min_length=3, max_length=50)
    email: Optional[EmailStr] = None
    full_name: Optional[str] = Field(None, max_length=100)
    is_active: Optional[bool] = None

class UserResponse(UserBase):
    id: str
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}

class UserListResponse(BaseModel):
    data: List[UserResponse]
    total: int
    page: int
    limit: int
    total_pages: int

