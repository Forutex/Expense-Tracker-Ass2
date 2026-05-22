# CRUD, Search, recording operation logs

from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from activity_utils import log_activity
from database import get_db
from middleware.auth_middleware import get_current_user
from models import Expense
from schemas import ExpenseCreate, ExpenseResponse, ExpenseUpdate

router = APIRouter(
    prefix="/expenses",
    tags=["Expenses"]
)


# getting all expenses based on userID
@router.get("", response_model=List[ExpenseResponse])
def get_expenses(
    search: Optional[str] = None,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(Expense).filter(
        Expense.user_id == current_user.id
    )

    if search:
        search_text = f"%{search}%"

        query = query.filter(
            (Expense.title.like(search_text)) |
            (Expense.category.like(search_text)) |
            (Expense.description.like(search_text))
        )

    expenses = query.order_by(
        Expense.date.desc(),
        Expense.id.desc()
    ).all()

    return expenses


# creating new expense
@router.post("", response_model=ExpenseResponse)
def create_expense(
    expense: ExpenseCreate,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    new_expense = Expense(
        user_id=current_user.id,
        title=expense.title,
        amount=expense.amount,
        category=expense.category,
        date=expense.date,
        description=expense.description,
    )

    db.add(new_expense)
    db.flush()

    log_activity(
        db,
        current_user.id,
        "create_expense",
        f"Created expense: {expense.title}"
    )

    db.commit()
    db.refresh(new_expense)

    return new_expense

#updating expences
@router.put("/{expense_id}", response_model=ExpenseResponse)
def update_expense(
    expense_id: int,
    expense: ExpenseUpdate,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    existing_expense = db.query(Expense).filter(
        Expense.id == expense_id,
        Expense.user_id == current_user.id
    ).first()

    if not existing_expense:
        raise HTTPException(
            status_code=404,
            detail="Expense not found"
        )

    existing_expense.title = expense.title
    existing_expense.amount = expense.amount
    existing_expense.category = expense.category
    existing_expense.date = expense.date
    existing_expense.description = expense.description

    log_activity(
        db,
        current_user.id,
        "update_expense",
        f"Updated expense id: {expense_id}"
    )

    db.commit()
    db.refresh(existing_expense)

    return existing_expense


# deleting expenses
@router.delete("/{expense_id}")
def delete_expense(
    expense_id: int,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    existing_expense = db.query(Expense).filter(
        Expense.id == expense_id,
        Expense.user_id == current_user.id
    ).first()

    if not existing_expense:
        raise HTTPException(
            status_code=404,
            detail="Expense not found"
        )

    db.delete(existing_expense)

    log_activity(
        db,
        current_user.id,
        "delete_expense",
        f"Deleted expense id: {expense_id}"
    )

    db.commit()

    return {
        "message": "Expense deleted successfully"
    }