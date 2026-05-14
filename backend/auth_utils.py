"""
Authentication utilities: password hashing and JWT token creation.

Uses bcrypt for password hashing (industry standard, slow-by-design to resist
brute force). JWT secret and algorithm are loaded from config (.env), so they
are never hardcoded in the codebase.
"""

from datetime import datetime, timedelta, timezone

from jose import jwt
from passlib.context import CryptContext

from config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    """Hash a plain-text password using bcrypt."""
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plain-text password against its bcrypt hash."""
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(data: dict) -> str:
    """
    Create a JWT access token containing the given payload.

    Adds an `exp` (expiry) claim based on ACCESS_TOKEN_EXPIRE_MINUTES from config.
    The token is signed using SECRET_KEY and ALGORITHM, both from config.
    """
    to_encode = data.copy()

    expire = datetime.now(timezone.utc) + timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
    )
    to_encode.update({"exp": expire})

    encoded_jwt = jwt.encode(
        to_encode,
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM,
    )

    return encoded_jwt