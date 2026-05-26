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

### Middleware & Security (Mark)

The main challenge was figuring out how to share auth logic across all the routes without copy-pasting it everywhere. FastAPI's `Depends()` solved this — `get_current_user` runs JWT validation automatically on any endpoint that uses it, and `admin_required` just builds on top for role checks.

Swagger's "Authorize" button also caused issues at first because the OAuth2 form it expected didn't match the JSON login endpoint. Fix was adding a separate `/auth/token` endpoint that handles OAuth2 form-data, while keeping `/auth/login` JSON for the React frontend.

Also spent time getting the small things right — 401 vs 403 status codes, moving secrets to a `.env` file, and adding global exception handlers so errors return clean JSON instead of stack traces.

---

## 7. How to Run

### Prerequisites
- Python 3.10+
- Node.js 18+
- MySQL 8+

### Backend Setup

From the `backend/` folder:

    python -m venv venv

Activate the virtual environment:

    # Mac/Linux:
    source venv/bin/activate

    # Windows:
    .\venv\Scripts\Activate.ps1

Install dependencies:

    pip install -r requirements.txt

Create a `.env` file in the `backend/` directory with the following variables:

    DATABASE_URL=mysql+pymysql://root:YOUR_PASSWORD@localhost/expense_tracker
    SECRET_KEY=YOUR_RANDOM_SECRET_KEY
    ALGORITHM=HS256
    ACCESS_TOKEN_EXPIRE_MINUTES=60

Create the MySQL database and import the schema:

    mysql -u root -p
    CREATE DATABASE expense_tracker;
    EXIT;
    mysql -u root -p expense_tracker < database/schema.sql

Run the backend server:

    uvicorn main:app --reload

The backend will be available at `http://localhost:8000`. Interactive API documentation is auto-generated at `http://localhost:8000/docs`.

### Frontend Setup

From the `frontend/` folder:

    npm install
    npm run dev

The frontend will be available at `http://localhost:5173`.

---

## 8. Workload Allocation

### Mark — Middleware & Security

Responsible for the authentication, authorization, and cross-cutting infrastructure that all backend features run on top of.

**Files written / owned:**
- `backend/auth_utils.py` — JWT token generation and bcrypt password hashing utilities
- `backend/middleware/auth_middleware.py` — `get_current_user` and `admin_required` FastAPI dependencies for protecting endpoints
- `backend/config.py` — environment-based settings management using pydantic-settings
- `backend/activity_utils.py` — activity logging helper for the `user_activity` entity
- `backend/main.py` — application entry point, CORS configuration, global exception handlers
- `backend/routers/auth.py` — register, login, logout, and `/auth/token` (Swagger OAuth2) endpoints
- `.gitignore` — environment-based secrets management

**Files contributed to:**
- `backend/routers/expenses.py` — added activity logging on create, update, delete
- `backend/routers/admin.py` — added activity logging on admin user update and delete

**Key technical decisions:**
- Used FastAPI dependency injection (`Depends`) instead of decorators for authentication, enabling clean composition — `admin_required` builds on top of `get_current_user` rather than duplicating logic
- Implemented bcrypt for password hashing (industry-standard, slow-by-design to resist brute-force attacks)
- Used JWT with HS256 for stateless authentication, compatible with a React/SPA frontend architecture
- Distinguished 401 (unauthenticated) from 403 (authenticated but forbidden) for correct HTTP semantics
- Added a separate `/auth/token` endpoint using OAuth2 form-data for Swagger UI's "Authorize" button, while keeping `/auth/login` JSON-based for the React frontend — both share the same JWT generation and activity logging
- Global exception handlers catch unhandled errors and return clean JSON responses instead of leaking stack traces to clients

### Ashley — Frontend

**Files written / owned:**
- `ProtectedRoute.jsx` - protects pages that require authentication (expense dashboard, admin dashboard)
- `AdminDashboard.jsx` - dashboard for Admin to update user details and view user activities
- `Login.jsx` - login page that navigates user to expense tracker or admin dashboard (by checking user role)
- `Signup.jsx` - sign up page for the user to create an account

**Files contributed to:**
- `Dashboard.jsx` - the original expense tracker (made by Kota) - minimal changes, I added a logout button and search function
- `App.jsx` - routing configuration, maps URL to pages
- `index.css` - used for styling the login, signup, dashboard, and admin dashboard pages

**Key technical decisions:**
- Incorporating error handling - Ensuring there are error messages when a user causes an error, e.g. wrong login information
- Route guard - checking user tokens and redirecting the user to the login page if there's no token, and renders pages correctly according to user
- Routing configuration - using React Router and protected routes so that the correct components are rendered, only logged in users can access expense dashboard
- Admin search functions: connects with backend to return matching records
- Expense search function: filters existing expenses array to return matching expenses

### Kota — Backend Features & CRUD
*[Kota to complete — list of files written and key decisions]*

### Felix — Database & Project Management

I was in charge of setting up and maintaining the MySQL database, making sure the schema matched what the backend needed, and keeping the project documentation up to date.

**Files written / owned:**
- `database/expensetracker.sql` — the MySQL schema dump covering all three tables (users, expenses, user_activities), so anyone on the team can recreate the database locally
- `README.md` — wrote and maintained the project documentation throughout the assignment

**Files contributed to:**
- `backend/auth_utils.py` — fixed a compatibility issue between passlib and Python 3.14 that was causing registration and login to crash with a 500 error; replaced it with direct bcrypt calls
- `backend/middleware/auth_middleware.py` — fixed the Swagger UI authorisation so that JWT tokens could be used to test the protected endpoints during development

**Key decisions:**
- Set up the three-table schema (users, expenses, user_activities) with foreign keys linking expenses and activity logs back to users, so data is properly isolated per account
- Kept the `.env` file out of version control so the database password and secret key are never exposed in the repository
- Exported the schema as a SQL dump file so the database can be fully recreated from scratch without any manual setup

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
