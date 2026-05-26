# Expense Tracker Web Application

---

## 1. Project Title

Expense Tracker Web Application

---

## 2. Problem Statement

This web application allows users to register and track their expenses with 5 elements: date, title, category, amount, and description (description is optional). 

Users can:
- View total expenses filtered by day, month, or year
- Select a specific day, month, and year to scope their view
- Add, edit, and delete expense entries
- See a category summary with percentage breakdowns
- Analyse spending trends over daily, monthly, and yearly periods
- Register an account and log in securely

---

## 3. Technical Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 (Vite) |
| Routing | React Router v7 |
| Styling | CSS (custom, with dark mode support) |
| Backend | Python, FastAPI |
| Authentication | JWT (JSON Web Tokens) with bcrypt password hashing |
| Database | MySQL 8 |
| ORM | SQLAlchemy |

---

## 4. Features

- User registration and login with JWT-based authentication
- Role-based access control (user / admin)
- Add, edit, and delete expenses
- View total expenses scoped by day, month, or year
- Category-based summary with percentage calculations
- Scrollable expense details table
- Trend analysis:
  - Daily (last 7 days)
  - Monthly (last 12 months)
  - Yearly (last 5 years)
- Admin panel: view all users, update user details, delete users, view activity logs

---

## 5. Folder Structure

```
Expense-Tracker-Ass2/
├── frontend/          React + Vite SPA (UI, routing, API calls)
│   └── src/
│       ├── pages/     Login and Dashboard pages
│       ├── components/ TopBar, ExpenseActions, ExpenseDetails, CategorySummary, Trends
│       └── styles/    CSS stylesheets
├── backend/           Python FastAPI REST API
│   ├── routers/       auth, expenses, admin endpoints
│   ├── middleware/    JWT authentication and role enforcement
│   ├── models.py      SQLAlchemy ORM models (User, Expense, UserActivity)
│   ├── schemas.py     Pydantic request/response validation
│   ├── auth_utils.py  Password hashing and JWT creation
│   └── main.py        App entry point, CORS, router registration
├── database/          MySQL schema dump
└── README.md
```

---

## 6. Challenges and Solutions

### Frontend (Kota)
The hardest challenge was the frontend section, due to the combination of JavaScript, HTML, and CSS. Even though HTML is handled in JS as JSX, understanding how to write HTML inside JavaScript using React was a steep learning curve. The solution was to repeatedly search for what was needed and keep trying. Errors were resolved through research and iteration. It took significant time but resulted in a strong understanding of React, JS, HTML, and CSS. Connecting the frontend to the database through an API was also a new concept that required learning.

### Database (Felix)

**Navigating the project stack:**
One challenge was understanding the layout of the full stack, particularly the relationship between the database, backend, and middleware layers. Because different team members were responsible for different parts, coordination was important. This required learning how to communicate with the person working on the middleware and backend to ensure the database schema matched what the API expected.

**GitHub workflow:**
There were learning curves around creating branches, understanding how to commit, and merging changes back into main through pull requests. The solution was consulting teammates and working through it hands-on. Once the process was understood, it became straightforward.

**Authentication setup:**
The authentication flow was initially confusing because some existing code was producing incorrect server responses. The Swagger UI authorization dialog (OAuth2 form) was not compatible with how the login endpoint worked. The fix involved reprogramming the auth middleware to use HTTPBearer, which allowed tokens to be pasted directly into the Swagger UI for testing.

**Learning MySQL:**
Coming from MongoDB, MySQL's relational structure and the MySQL Workbench UI felt more complex at first. The approach was to focus on learning only the core features needed for the project — creating tables, running SELECT queries, and verifying data — which made the tool manageable and effective for the assignment.

---

## 7. Workload Allocation

### Felix — Database & Project Management

I was responsible for setting up the MySQL database and making sure the schema matched what the backend needed, as well as keeping track of the project documentation.

**Files written / owned:**
- `database/expensetracker.sql` — the MySQL schema dump covering all three tables (users, expenses, user_activities), so anyone on the team can recreate the database locally
- `README.md` — wrote and maintained the project documentation throughout the assignment

**Files contributed to:**
- `backend/auth_utils.py` — fixed a compatibility issue between passlib and Python 3.14 that was causing registration and login to crash with a 500 error; replaced it with direct bcrypt calls
- `backend/middleware/auth_middleware.py` — fixed the Swagger UI authorisation so that JWT tokens could actually be used to test the protected endpoints during development

**Key decisions:**
- Set up the three-table schema (users, expenses, user_activities) with foreign keys linking expenses and activity logs back to users, so data is properly isolated per account
- Kept the `.env` file out of version control so the database password and secret key are never exposed in the repository
- Exported the schema as a SQL dump file so the database can be fully recreated from scratch without any manual setup
