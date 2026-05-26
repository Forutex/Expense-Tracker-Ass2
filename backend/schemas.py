#Declaring the strcuture of the data receiving from API and sending to API on Python classes.
from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel


class UserRegister(BaseModel):
    username: str
    email: str
    password: str


class UserLogin(BaseModel):
    email: str
    password: str


class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    role: str

    class Config:
        from_attributes = True


class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[str] = None
    role: Optional[str] = None


class TokenResponse(BaseModel):
    access_token: str
    token_type: str


class ExpenseCreate(BaseModel):
    title: str
    amount: float
    category: str
    date: date
    description: Optional[str] = ""


class ExpenseUpdate(BaseModel):
    title: str
    amount: float
    category: str
    date: date
    description: Optional[str] = ""


class ExpenseResponse(BaseModel):
    id: int
    user_id: int
    title: str
    amount: float
    category: str
    date: date
    description: Optional[str] = ""

    class Config:
        from_attributes = True


class ActivityResponse(BaseModel):
    id: int
    user_id: int
    action: str
    detail: Optional[str] = ""
    created_at: datetime

    class Config:
        from_attributes = True