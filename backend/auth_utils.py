"""
Authentication utilities: password hashing and JWT token creation.

Uses bcrypt for password hashing (industry standard, slow-by-design to resist
brute force). JWT secret and algorithm are loaded from config (.env), so they
are never hardcoded in the codebase.
"""

from datetime import datetime, timedelta, timezone

import bcrypt
from jose import jwt

from config import settings


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))


def create_access_token(data: dict) -> str:
    """
    Create a JWT access token containing the given payload.

    Adds an `exp` (expiry) claim based on ACCESS_TOKEN_EXPIRE_MINUTES from config.
    The token is signed using SECRET_KEY and ALGORITHM, both from config.
    """
    to_encode = data.copy()

    expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})

    encoded_jwt = jwt.encode(
        to_encode,
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM
    )

    return encoded_jwt
