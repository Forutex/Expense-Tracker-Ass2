from fastapi import APIRouter, HTTPException

from activity_utils import log_activity
from auth_utils import create_access_token, hash_password, verify_password
from database import SessionLocal
from models import User
from schemas import TokenResponse, UserLogin, UserRegister, UserResponse

router = APIRouter(
    prefix="/auth",
    tags=["Auth"]
)


@router.post("/register", response_model=UserResponse)
def register(user: UserRegister):
    db = SessionLocal()

    try:
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
        db.commit()
        db.refresh(new_user)

        return new_user

    finally:
        db.close()


@router.post("/login", response_model=TokenResponse)
def login(user: UserLogin):
    db = SessionLocal()

    try:
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

    finally:
        db.close()