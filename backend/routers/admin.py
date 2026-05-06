from typing import List

from fastapi import APIRouter, Depends, HTTPException

from database import SessionLocal
from middleware.auth_middleware import admin_required
from models import User, UserActivity
from schemas import ActivityResponse, UserResponse, UserUpdate

router = APIRouter(
    prefix="/admin",
    tags=["Admin"]
)


@router.get("/users", response_model=List[UserResponse])
def get_all_users(
    current_admin=Depends(admin_required)
):
    db = SessionLocal()

    try:
        users = db.query(User).order_by(User.id.asc()).all()
        return users

    finally:
        db.close()


@router.put("/users/{user_id}", response_model=UserResponse)
def update_user(
    user_id: int,
    user_update: UserUpdate,
    current_admin=Depends(admin_required)
):
    db = SessionLocal()

    try:
        existing_user = db.query(User).filter(User.id == user_id).first()

        if not existing_user:
            raise HTTPException(
                status_code=404,
                detail="User not found"
            )

        if user_update.username is not None:
            existing_user.username = user_update.username

        if user_update.email is not None:
            duplicate_email_user = db.query(User).filter(
                User.email == user_update.email,
                User.id != user_id
            ).first()

            if duplicate_email_user:
                raise HTTPException(
                    status_code=400,
                    detail="Email already used by another user"
                )

            existing_user.email = user_update.email

        if user_update.role is not None:
            if user_update.role not in ["user", "admin"]:
                raise HTTPException(
                    status_code=400,
                    detail="Role must be either 'user' or 'admin'"
                )

            existing_user.role = user_update.role

        db.commit()
        db.refresh(existing_user)

        return existing_user

    finally:
        db.close()


@router.delete("/users/{user_id}")
def delete_user(
    user_id: int,
    current_admin=Depends(admin_required)
):
    db = SessionLocal()

    try:
        existing_user = db.query(User).filter(User.id == user_id).first()

        if not existing_user:
            raise HTTPException(
                status_code=404,
                detail="User not found"
            )

        if existing_user.id == current_admin.id:
            raise HTTPException(
                status_code=400,
                detail="Admin cannot delete their own account"
            )

        db.delete(existing_user)
        db.commit()

        return {
            "message": "User deleted successfully"
        }

    finally:
        db.close()


@router.get("/activities", response_model=List[ActivityResponse])
def get_all_activities(
    current_admin=Depends(admin_required)
):
    db = SessionLocal()

    try:
        activities = db.query(UserActivity).order_by(
            UserActivity.created_at.desc()
        ).all()

        return activities

    finally:
        db.close()