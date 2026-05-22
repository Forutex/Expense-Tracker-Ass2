import logging

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.exc import SQLAlchemyError

from database import Base, engine
from routers import admin, auth, expenses

# Configure application logger.
# Errors are logged server-side for debugging, but clean messages
# (no stack traces) are returned to the client.
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("expense_tracker")

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


# ---------------------------------------------------------------------------
# Global exception handlers
# ---------------------------------------------------------------------------
# Without these, any unhandled error returns a generic 500 with a stack trace
# that leaks internal details to the client. These handlers return clean
# JSON responses while logging the full error server-side for debugging.

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(
    request: Request,
    exc: RequestValidationError,
):
    """Clean response when request body fails Pydantic validation."""
    return JSONResponse(
        status_code=422,
        content={
            "error": "Validation failed",
            "detail": exc.errors(),
        },
    )


@app.exception_handler(SQLAlchemyError)
async def database_exception_handler(
    request: Request,
    exc: SQLAlchemyError,
):
    """Clean response on any database error; logs full error server-side."""
    logger.error(f"Database error on {request.url}: {exc}")
    return JSONResponse(
        status_code=500,
        content={"error": "A database error occurred. Please try again."},
    )


@app.exception_handler(Exception)
async def generic_exception_handler(
    request: Request,
    exc: Exception,
):
    """Catch-all for any uncaught error."""
    logger.error(
        f"Unhandled exception on {request.url}: {exc}",
        exc_info=True,
    )
    return JSONResponse(
        status_code=500,
        content={"error": "An unexpected error occurred. Please try again."},
    )


# ---------------------------------------------------------------------------
# Routers
# ---------------------------------------------------------------------------

app.include_router(auth.router)
app.include_router(expenses.router)
app.include_router(admin.router)


@app.get("/")
def root():
    return {
        "message": "Expense Tracker API is running"
    }