#user registration and login, password hashing, JWT token generation, and activity logging for authentication events.

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from activity_utils import log_activity
from auth_utils import create_access_token, hash_password, verify_password
from database import get_db
from middleware.auth_middleware import get_current_user
from models import User
from schemas import TokenResponse, UserLogin, UserRegister, UserResponse

router = APIRouter(
    prefix="/auth",
    tags=["Auth"]
)


@router.post("/register", response_model=UserResponse)
def register(
    user: UserRegister,
    db: Session = Depends(get_db)
):
    existing_user = db.query(User).filter(User.email == user.email).first()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    new_user = User(
        username=user.username,
        email=user.email,
        hashed_password=hash_password(user.password),
        role="user"
    )

    db.add(new_user)
    db.flush()

    log_activity(
        db,
        new_user.id,
        "register",
        "New user registered"
    )

    db.commit()
    db.refresh(new_user)

    return new_user


@router.post("/login", response_model=TokenResponse)
def login(
    user: UserLogin,
    db: Session = Depends(get_db)
):
    existing_user = db.query(User).filter(User.email == user.email).first()

    if not existing_user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    if not verify_password(user.password, existing_user.hashed_password):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    access_token = create_access_token(
        data={
            "sub": existing_user.email,
            "user_id": existing_user.id,
            "role": existing_user.role
        }
    )

    log_activity(
        db,
        existing_user.id,
        "login",
        "User logged in"
    )

    db.commit()

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }


@router.post("/logout")
def logout(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Logout endpoint.

    JWTs are stateless, so the actual "logout" happens client-side by
    deleting the stored token. This endpoint exists to log the logout
    event to user_activity for audit purposes, satisfying the brief's
    requirement to track login/logout activity.
    """
    log_activity(
        db,
        current_user.id,
        "logout",
        "User logged out"
    )

    db.commit()

    return {"message": "Logged out successfully"}