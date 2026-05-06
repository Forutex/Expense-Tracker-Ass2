from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import Base, engine
from routers import admin, auth, expenses

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Expense Tracker API"
)

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

app.include_router(auth.router)
app.include_router(expenses.router)
app.include_router(admin.router)


@app.get("/")
def root():
    return {
        "message": "Expense Tracker API is running"
    }