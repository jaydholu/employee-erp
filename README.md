# 🏢 Employee ERP Portal

A full-stack mini ERP system built with **FastAPI** (Python) + **React** (Vite), featuring JWT authentication, role-based access control, and a clean dashboard UI. Built as an educational project with production-style architecture.

---

## 📁 Project Structure

```
employee-erp/
├── .gitignore
├── .env.example
├── README.md
│
├── backend/
│   ├── app/
│   │   ├── core/
│   │   │   ├── settings.py         # Pydantic Settings — reads .env file
│   │   │   ├── database.py         # SQLAlchemy engine, session factory, Base
│   │   │   └── security.py         # JWT encode/decode, bcrypt hashing, auth guards
│   │   ├── models/
│   │   │   ├── user.py             # User ORM model (id, fullname, username, email, role)
│   │   │   ├── employee.py         # Employee ORM model (department, position, salary …)
│   │   │   └── performance.py      # Performance ORM model (scores, review_date)
│   │   ├── schemas/
│   │   │   ├── user.py             # Pydantic schemas for auth + token
│   │   │   ├── employee.py         # Pydantic schemas for employee CRUD
│   │   │   ├── performance.py      # Pydantic schemas for review CRUD
│   │   │   └── admin.py            # Pydantic schemas for admin management
│   │   ├── routes/
│   │   │   ├── auth.py             # POST /auth/login
│   │   │   ├── employees.py        # GET / POST / PUT /employees
│   │   │   ├── performance.py      # GET / POST /performance
│   │   │   └── admin.py            # POST / PUT / DELETE /admin  (CLI only)
│   │   └── services/
│   │       ├── auth_service.py     # Authenticate user, issue token
│   │       ├── employee_service.py # Business logic for employee CRUD
│   │       └── performance_service.py  # Business logic for reviews
│   ├── alembic/
│   │   ├── env.py                  # Alembic migration environment
│   │   └── versions/
│   │       └── 0001_initial.py     # Initial schema — creates all tables
│   ├── database/
│   │   └── employee_erp.db         # SQLite database (auto-created on first run)
│   ├── main.py                     # FastAPI app entry point — CORS + all routers
│   ├── alembic.ini                 # Alembic configuration
│   ├── requirements.txt            # Python dependencies
│   ├── seed.py                     # One-time script — creates default admin user
│   └── admins_only.py              # CLI tool — create / edit / delete admin accounts
│
└── frontend/
    ├── index.html
    ├── vite.config.js              # Vite dev server + proxy to backend
    ├── tailwind.config.js          # TailwindCSS config with custom font/color scale
    ├── postcss.config.js
    ├── package.json
    └── src/
        ├── main.jsx                # ReactDOM entry point
        ├── App.jsx                 # BrowserRouter + route definitions + auth guards
        ├── index.css               # Tailwind directives + global font-size override
        ├── components/
        │   ├── Layout.jsx          # Sidebar + Navbar shell (wraps all pages)
        │   ├── Navbar.jsx          # Top bar — page title, user avatar, logout
        │   ├── Sidebar.jsx         # Role-aware navigation links
        │   ├── EmployeeTable.jsx   # Searchable, sortable employee list
        │   ├── PerformanceCard.jsx # Review card with animated score bars
        │   └── StatCard.jsx        # KPI summary card for dashboard
        ├── pages/
        │   ├── Login.jsx           # Split-panel login form with show/hide password
        │   ├── Dashboard.jsx       # Admin KPI overview / Employee summary
        │   ├── Employees.jsx       # Table + Create & Edit modals
        │   ├── EmployeeProfile.jsx # Single employee detail view
        │   └── Performance.jsx     # Review cards + Add review form (admin)
        ├── services/
        │   └── api.js              # Axios instance, JWT interceptors, all API calls
        └── hooks/
            └── useAuth.js          # Login / logout + localStorage persistence
```

---

## ⚙️ Prerequisites

| Tool | Version |
|------|---------|
| Python | **3.11** |
| Node.js | **18+** |

> **No database setup needed.** SQLite creates `backend/database/employee_erp.db` automatically when you run migrations. No PostgreSQL, no MySQL, nothing to install.

---

## 🚀 Quick Start

### 1 — Clone the repository

```bash
git clone <your-repo-url>
cd employee-erp
```

---

### 2 — Backend Setup

#### Create a virtual environment (Python 3.11 required)

```bash
cd backend

# macOS / Linux
python3.11 -m venv venv
source venv/bin/activate

# Windows (PowerShell)
py -3.11 -m venv venv
.\venv\Scripts\Activate.ps1
```

> You should see `(venv)` at the start of your terminal prompt once it's active.

#### Install Python dependencies

```bash
pip install -r requirements.txt
```

#### Set up environment variables

```bash
cp ../.env.example .env
```

Your `.env` file should look like this:

```env
DATABASE_URL=sqlite:///./database/employee_erp.db
JWT_SECRET_KEY=change-this-to-something-long-and-random
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

> The `JWT_SECRET_KEY` is used to sign login tokens. Use any long random string in production.

#### Run database migrations

```bash
alembic upgrade head
```

This creates all the database tables inside `backend/database/employee_erp.db`. The file is created automatically — nothing else to do.

#### Create the default admin user

```bash
python seed.py
```

This creates one admin account you can log in with right away:

| Field | Value |
|-------|-------|
| Username | `admin` |
| Password | `admin@company` |

#### Start the backend server

```bash
uvicorn main:app --reload --port 8000
```

The API is now running at **http://localhost:8000**
Interactive API docs (Swagger UI): **http://localhost:8000/docs**

---

### 3 — Frontend Setup

Open a **new terminal** (keep the backend running):

```bash
cd frontend
npm install
npm run dev
```

The app is now running at **http://localhost:5173**

Log in with `admin` / `admin@company` to get started.

---

## 🔐 Authentication

- Login sends username + password to `POST /auth/login`.
- The server returns a JWT token (valid for 60 minutes by default).
- The token is saved in `localStorage` and automatically attached to every API request via an Axios interceptor.
- If a token expires or is invalid, the app redirects to the login page automatically.

---

## 👥 Roles & Permissions

There are two roles in the system: **Admin (HR)** and **Employee**.

| Feature | Admin | Employee |
|---|:---:|:---:|
| View all employees | ✅ | ❌ |
| Create new employee | ✅ | ❌ |
| Edit employee details | ✅ | ❌ |
| View any employee profile | ✅ | ❌ |
| Add performance review | ✅ | ❌ |
| View own profile | ✅ | ✅ |
| View own reviews | ✅ | ✅ |
| Manage admin accounts (CLI) | ✅ | ❌ |

---

## 🗄️ Database Schema

```
users
  id, fullname, username, email, password_hash, role (admin / employee)

employees
  id, user_id → users.id, department, position, joining_date, salary

performance
  id, employee_id → employees.id,
  communication, technical_skill, teamwork, leadership,
  overall_score (auto-computed as average of 4 scores), review_date
```

---

## 👤 Admin Management — CLI Script

Admin accounts are managed entirely through a command-line script (`create_admin.py`), not through the web interface. This is intentional — admin creation is a privileged operation that should be done by a developer or system administrator, not through a browser.

The script supports three commands: **create**, **edit**, and **delete**.

> **Before using any command:** make sure the backend server is running (`uvicorn main:app --reload --port 8000`) and your virtual environment is active.

---

### ➕ Create a new admin

Use this when you want to add another HR manager or administrator to the system.

**Interactive mode** (the script will ask you for everything):

```bash
python create_admin.py create
```

Example session:

```
=== Create Admin ===

Your admin username : admin
Your admin password : (type password, hidden)
✓  Authenticated.

New admin full name  : Priya Sharma
New admin username   : priya
New admin email      : priya@company.com
New admin password   : (type password, hidden)

✅  Admin created successfully!
    ID       : 2
    Name     : Priya Sharma
    Username : priya
    Email    : priya@company.com
    Role     : admin
```

**One-liner mode** (supply everything as flags — useful for scripts):

```bash
python create_admin.py create \
    --auth-user admin --auth-pass admin@company \
    --fullname "Priya Sharma" \
    --username priya \
    --email priya@company.com \
    --password priya@company
```

---

### ✏️ Edit an existing admin

Use this when an admin wants to update their own name, email, username, or password. An admin can also edit another admin's details.

Just leave any field **blank** if you don't want to change it.

**Interactive mode:**

```bash
python create_admin.py edit priya
```

Example session:

```
=== Edit Admin — 'priya' ===

Leave a field blank to keep the current value.

Your admin username : admin
Your admin password : (type password, hidden)
✓  Authenticated.

New full name  (blank = no change) :           ← pressed Enter, no change
New username   (blank = no change) :           ← pressed Enter, no change
New email      (blank = no change) : priya.sharma@company.com
New password   (blank = no change) :           ← pressed Enter, no change

✅  Admin updated successfully!
    ID       : 2
    Name     : Priya Sharma
    Username : priya
    Email    : priya.sharma@company.com
    Role     : admin
```

**One-liner mode** (only pass the fields you want to change):

```bash
# Change only the email
python create_admin.py edit priya \
    --auth-user admin --auth-pass admin@company \
    --email priya.sharma@company.com

# Change only the password
python create_admin.py edit priya \
    --auth-user priya --auth-pass priya@company \
    --password newSecurePassword123
```

> An admin can edit **themselves** — just use their own credentials in `--auth-user` / `--auth-pass`.

---

### 🗑️ Delete an admin

Use this to remove an admin account that is no longer needed.

> ⚠️ **Safety rule:** The system will **never delete the last remaining admin**. There must always be at least one admin account. If you try, you'll get an error message and nothing will be deleted.

**Interactive mode** (asks you to retype the username to confirm):

```bash
python create_admin.py delete priya
```

Example session:

```
=== Delete Admin — 'priya' ===

⚠️   This action is irreversible.

Your admin username : admin
Your admin password : (type password, hidden)
✓  Authenticated.

Type the username 'priya' again to confirm deletion : priya

✅  Admin 'priya' has been deleted successfully.
```

**One-liner mode** (use `--yes` to skip the confirmation — good for automation):

```bash
python create_admin.py delete priya \
    --auth-user admin --auth-pass admin@company \
    --yes
```

---

### 📋 Quick reference table

| Command | What it does | Who can run it |
|---|---|---|
| `create_admin.py create` | Add a new admin user | Any existing admin |
| `create_admin.py edit <username>` | Update an admin's details | Any admin (including self) |
| `create_admin.py delete <username>` | Remove an admin account | Any admin (cannot delete last one) |

---

## 📡 API Reference

### Auth

| Method | Endpoint | Auth required | Description |
|--------|----------|:---:|-------------|
| POST | `/auth/login` | ❌ | Login — returns JWT token |

### Employees

| Method | Endpoint | Auth required | Description |
|--------|----------|:---:|-------------|
| GET | `/employees/` | Admin | List all employees |
| POST | `/employees/` | Admin | Create new employee + user account |
| GET | `/employees/me` | Any | Get your own employee profile |
| GET | `/employees/{id}` | Admin / Self | Get one employee by ID |
| PUT | `/employees/{id}` | Admin | Update employee details |

### Performance

| Method | Endpoint | Auth required | Description |
|--------|----------|:---:|-------------|
| GET | `/performance/{employee_id}` | Admin / Self | Get all reviews for an employee |
| POST | `/performance/` | Admin | Add a new performance review |

### Admin Management (CLI only — no frontend page)

| Method | Endpoint | Auth required | Description |
|--------|----------|:---:|-------------|
| POST | `/admin/` | Admin | Create a new admin user |
| PUT | `/admin/edit/{username}` | Admin | Update an admin's details |
| DELETE | `/admin/delete/{username}` | Admin | Delete an admin account |

---

## 🧩 Architecture Notes

### Backend

- **`app/core/settings.py`** — All configuration (DB URL, JWT secret, token expiry) loaded from `.env` via `pydantic-settings`. Change values in `.env`, never in code.
- **`app/core/database.py`** — SQLAlchemy engine with SQLite. The `get_db()` function is a FastAPI dependency injected into every route that needs the database.
- **`app/core/security.py`** — Single place for password hashing (`bcrypt`), JWT creation/verification, and FastAPI dependency guards (`get_current_user`, `require_admin`).
- **Services layer** — All business logic (validation, DB queries, calculations) lives in `services/`. Routes just call services and return the result — keeps routes clean and testable.
- **Schemas** — Separate `Create`, `Update`, and `Out` Pydantic models for each resource. This prevents clients from sending fields they shouldn't (e.g. setting their own `role`), and controls exactly what gets returned.

### Frontend

- **`services/api.js`** — One Axios instance for the whole app. A request interceptor automatically adds the JWT header. A response interceptor catches `401 Unauthorized` and redirects to login globally.
- **`hooks/useAuth.js`** — Manages login/logout state. Auth data is stored in `localStorage` so it survives page refreshes.
- **`App.jsx`** — `PrivateRoute` component wraps protected pages. The `adminOnly` prop blocks employee users from admin-only pages.
- **Vite proxy** — In development, Vite forwards `/auth`, `/employees`, `/performance`, and `/admin` requests to `http://localhost:8000`, so there are no CORS issues.

---

## 🛠️ Development Tips

- After changing any ORM model, run `alembic revision --autogenerate -m "describe change"` then `alembic upgrade head`.
- Use **http://localhost:8000/docs** (Swagger UI) to test any API endpoint directly in the browser — no Postman needed.
- The `bulk_employees_generation.py` script in `backend/database/` can generate 20 fake employees at once using the `Faker` library. Useful for testing the employee table with real-looking data.
- To reset the database completely: delete `backend/database/employee_erp.db`, run `alembic upgrade head`, then `python seed.py`.

---

## 🏗️ Tech Stack

**Backend:** Python 3.11 · FastAPI · SQLAlchemy 2 · Alembic · SQLite · python-jose (JWT) · passlib + bcrypt · Pydantic v2 · pydantic-settings

**Frontend:** React 18 · Vite · TailwindCSS 3 · React Router v6 · Axios · DM Sans + DM Mono fonts
