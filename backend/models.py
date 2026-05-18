#Declaring the structure of the database tables on Python classes.
from sqlalchemy import (
    Column,
    Date,
    DECIMAL,
    ForeignKey,
    Integer,
    String,
    Text,
    TIMESTAMP,
    text,
)

from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(50), nullable=False, server_default="user")
    created_at = Column(TIMESTAMP, server_default=text("CURRENT_TIMESTAMP"))


class Expense(Base):
    __tablename__ = "expenses"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    title = Column(String(255), nullable=False)
    amount = Column(DECIMAL(10, 2), nullable=False)
    category = Column(String(100), nullable=False)
    date = Column(Date, nullable=False)
    description = Column(Text, nullable=True)

    created_at = Column(TIMESTAMP, server_default=text("CURRENT_TIMESTAMP"))


class UserActivity(Base):
    __tablename__ = "user_activities"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    action = Column(String(100), nullable=False)
    detail = Column(Text, nullable=True)
    
    created_at = Column(TIMESTAMP, server_default=text("CURRENT_TIMESTAMP"))