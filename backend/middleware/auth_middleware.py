"""
Authentication and authorization middleware.

Provides FastAPI dependencies for protecting endpoints:
- get_current_user: Validates JWT, returns the authenticated User object.
- admin_required:   Builds on get_current_user, enforces admin role.

Design rationale:
- Dependency injection (Depends) lets us reuse auth logic across all routers
  without copy-paste. Each protected endpoint just declares which dependency
  it needs.
- admin_required composes get_current_user, so admin-only routes get both
  authentication and authorization in one parameter.
- Errors raise HTTPException with appropriate status codes (401 vs 403) to
  distinguish "not logged in" from "logged in but not allowed".
"""

from fastapi import Depends, HTTPException, Security, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session

from config import settings
from database import get_db
from models import User


http_bearer = HTTPBearer()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Security(http_bearer),
    db: Session = Depends(get_db),
) -> User:
    token = credentials.credentials
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM],
        )
        user_id: int = payload.get("user_id")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise credentials_exception

    return user


def admin_required(
    current_user: User = Depends(get_current_user),
) -> User:
    """
    Ensure the authenticated user has the 'admin' role.

    Raises 403 if the user is authenticated but not an admin.
    Used as a dependency on admin-only endpoints.
    """
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required",
        )

    return current_user
