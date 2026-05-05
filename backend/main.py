from datetime import date
from typing import List, Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy import Column, Date, DECIMAL, Integer, String, Text, TIMESTAMP, create_engine, text
from sqlalchemy.orm import declarative_base, sessionmaker

DATABASE_URL = "mysql+pymysql://root:kouta01053837@localhost/expense_tracker_ass2"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

app = FastAPI()

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Expense(Base):
    __tablename__ = "expenses"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    amount = Column(DECIMAL(10, 2), nullable=False)
    category = Column(String(100), nullable=False)
    date = Column(Date, nullable=False)
    description = Column(Text, nullable=True)
    created_at = Column(TIMESTAMP, server_default=text("CURRENT_TIMESTAMP"))


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
    title: str
    amount: float
    category: str
    date: date
    description: Optional[str] = ""

    class Config:
        from_attributes = True


@app.get("/expenses", response_model=List[ExpenseResponse])
def get_expenses():
    db = SessionLocal()
    try:
        expenses = db.query(Expense).order_by(Expense.date.desc(), Expense.id.desc()).all()
        return expenses
    finally:
        db.close()


@app.post("/expenses", response_model=ExpenseResponse)
def create_expense(expense: ExpenseCreate):
    db = SessionLocal()
    try:
        new_expense = Expense(
            title=expense.title,
            amount=expense.amount,
            category=expense.category,
            date=expense.date,
            description=expense.description,
        )
        db.add(new_expense)
        db.commit()
        db.refresh(new_expense)
        return new_expense
    finally:
        db.close()


@app.put("/expenses/{expense_id}", response_model=ExpenseResponse)
def update_expense(expense_id: int, expense: ExpenseUpdate):
    db = SessionLocal()
    try:
        existing = db.query(Expense).filter(Expense.id == expense_id).first()

        if not existing:
            raise HTTPException(status_code=404, detail="Expense not found")

        existing.title = expense.title
        existing.amount = expense.amount
        existing.category = expense.category
        existing.date = expense.date
        existing.description = expense.description

        db.commit()
        db.refresh(existing)
        return existing
    finally:
        db.close()


@app.delete("/expenses/{expense_id}")
def delete_expense(expense_id: int):
    db = SessionLocal()
    try:
        existing = db.query(Expense).filter(Expense.id == expense_id).first()

        if not existing:
            raise HTTPException(status_code=404, detail="Expense not found")

        db.delete(existing)
        db.commit()
        return {"message": "Expense deleted successfully"}
    finally:
        db.close()