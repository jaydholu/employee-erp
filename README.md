# 🏢 Employee ERP Portal

A full-stack mini ERP system built with **FastAPI** (Python) + **React** (Vite), featuring JWT authentication, role-based access control, and a clean dashboard UI.

---

## 📁 Project Structure

```
employee-erp/
├── .gitignore
├── .env.example
├── README.md
│
├── backend/
│   ├── database/
│   │   ├── bulk_employee_generation.py     # Fake employee data generation
│   │   └── employee_erp.db                 # database
│   ├── app/
│   │   ├── core/
│   │   │   ├── database.py                 # SQLAlchemy engine, session, Base
│   │   │   ├── config.py                   # Pydantic Settings (reads .env)
│   │   │   └── security.py                 # JWT encode/decode, password hash, auth deps
│   │   ├── models/
│   │   │   ├── user.py                     # User ORM model (id, fullname, username, email, role)
│   │   │   ├── employee.py                 # Employee ORM model (department, position, salary …)
│   │   │   └── performance.py              # Performance ORM model (scores, review_date)
│   │   ├── schemas/
│   │   │   ├── user.py                     # Pydantic schemas for auth + token
│   │   │   ├── employee.py                 # Pydantic schemas for employee CRUD
│   │   │   └── performance.py              # Pydantic schemas for review CRUD
│   │   ├── routes/
│   │   │   ├── auth.py                     # POST /auth/login
│   │   │   ├── employees.py                # GET/POST/PUT /employees
│   │   │   └── performance.py              # GET/POST /performance
│   │   ├── services/
│   │   │   ├── auth_service.py             # Authenticate user, issue token
│   │   │   ├── employee_service.py         # Business logic for employee CRUD
│   │   │   └── performance_service.py      # Business logic for reviews
│   ├── alembic/
│   │   ├── env.py                          # Alembic migration environment
│   │   └── versions/
│   │       └── 0001_initial.py             # Initial schema migration
│   ├── main.py                             # FastAPI app entry point, CORS, routers
│   ├── alembic.ini
│   ├── requirements.txt
│   └── seed.py                             # Creates default admin user
│
└── frontend/
    ├── index.html
    ├── vite.config.js                      # Vite + proxy to backend
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── package.json
    └── src/
        ├── main.jsx                        # ReactDOM entry point
        ├── App.jsx                         # BrowserRouter + route definitions
        ├── index.css                       # Tailwind directives + global styles
        ├── components/
        │   ├── Layout.jsx                  # Sidebar + Navbar shell
        │   ├── Navbar.jsx                  # Top bar with user info + logout
        │   ├── Sidebar.jsx                 # Role-aware navigation links
        │   ├── EmployeeTable.jsx           # Searchable employee list
        │   ├── PerformanceCard.jsx         # Review card with score bars
        │   └── StatCard.jsx                # Dashboard KPI card
        ├── pages/
        │   ├── Login.jsx                   # Split-panel login form
        │   ├── Dashboard.jsx               # Admin stats / Employee summary
        │   ├── Employees.jsx               # Table + Create / Edit modals
        │   ├── EmployeeProfile.jsx         # Single employee detail
        │   └── Performance.jsx             # Review list + Add review form
        ├── services/
        │   └── api.js                      # Axios instance, interceptors, all API calls
        └── hooks/
            └── useAuth.js                  # Login/logout + localStorage state
```

---

## ⚙️ Prerequisites

| Tool | Version |
|------|---------|
| Python | **3.11** |
| Node.js | 18+ |

> **No database setup needed** — SQLite creates a local `employee_erp.db` file automatically.

---

## 🚀 Quick Start

### 1 — Clone the repository

```bash
git clone <your-repo-url>
cd employee-erp
```

---

### 2 — Backend Setup

#### Create virtual environment (Python 3.11 required)

```bash
cd backend

# macOS / Linux
python3.11 -m venv venv
source venv/bin/activate

# Windows (PowerShell)
py -3.11 -m venv venv
.\venv\Scripts\Activate.ps1
```

#### Install dependencies

```bash
pip install -r requirements.txt
```

#### Configure environment variables

```bash
cp ../.env.example .env
# Edit .env with your PostgreSQL credentials and a strong JWT secret
```

`.env` example:
```
DATABASE_URL=sqlite:///./database/employee_erp.db
JWT_SECRET_KEY=super-secret-key-change-me
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

#### Run Alembic migrations

> SQLite will create `backend/database/employee_erp.db` automatically — no DB server needed.

```bash
alembic upgrade head
```

#### Seed the admin user

```bash
python seed.py
# Creates: username=admin  password=admin@hal
```

#### Start the FastAPI server

```bash
uvicorn main:app --reload --port 8000
```

API docs available at: http://localhost:8000/docs

---

### 3 — Frontend Setup

```bash
cd ../frontend
npm install
npm run dev
```

App available at: http://localhost:5173

---

## 🔐 Authentication

- `POST /auth/login` accepts `application/x-www-form-urlencoded` (OAuth2 form).
- Returns a JWT `access_token` + `role`, `user_id`, `fullname`, `employee_id`.
- The token is stored in `localStorage` and auto-attached via Axios interceptor.
- Protected routes check for token; unauthorized access redirects to `/login`.

---

## 👥 Roles & Permissions

| Feature | Admin (HR) | Employee |
|---|---|---|
| View all employees | ✅ | ❌ |
| Create employee | ✅ | ❌ |
| Edit employee | ✅ | ❌ |
| View any employee profile | ✅ | ❌ |
| Add performance review | ✅ | ❌ |
| View own profile | ✅ | ✅ |
| View own reviews | ✅ | ✅ |

---

## 🗄️ Database Schema

```
users
  id, fullname, username, email, password_hash, role

employees
  id, user_id → users.id, department, position, joining_date, salary

performance
  id, employee_id → employees.id,
  communication, technical_skill, teamwork, leadership,
  overall_score (auto-computed), review_date
```

---

## 🧩 Architecture Notes

### Backend
- **`config.py`** — Single source of truth for env vars via `pydantic-settings`.
- **`database.py`** — SQLAlchemy engine + `get_db()` dependency injected into every route.
- **`utils/security.py`** — Centralises JWT creation/decoding, bcrypt hashing, and FastAPI dependency guards (`get_current_user`, `require_admin`).
- **Services layer** — All business logic lives in `services/`, keeping routers thin.
- **Schemas** — Separate `*Create`, `*Update`, `*Out` schemas prevent over-posting and control serialization.

### Frontend
- **`services/api.js`** — Single Axios instance. Request interceptor injects token; response interceptor handles 401 globally.
- **`hooks/useAuth.js`** — Login/logout state with localStorage persistence.
- **`App.jsx`** — `PrivateRoute` wrapper enforces auth & role; all layout wrapped in `<Layout>` (Sidebar + Navbar + `<Outlet>`).
- **Vite proxy** — Dev server proxies `/auth`, `/employees`, `/performance` to FastAPI, eliminating CORS issues in development.

---

## 📡 API Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/login` | None | Login, returns JWT |
| GET | `/employees/` | Admin | List all employees |
| POST | `/employees/` | Admin | Create employee + user |
| GET | `/employees/me` | Any | Own employee profile |
| GET | `/employees/{id}` | Admin / Self | Get employee by ID |
| PUT | `/employees/{id}` | Admin | Update employee |
| GET | `/performance/{employee_id}` | Admin / Self | Get reviews |
| POST | `/performance/` | Admin | Add review |

---

## 🛠️ Development Tips

- Run `alembic revision --autogenerate -m "your message"` after changing ORM models.
- Use `http://localhost:8000/docs` (Swagger UI) to test endpoints interactively.
- Seed more employees via the admin dashboard or directly through the API.

---

## 🏗️ Tech Stack

**Backend:** Python 3.11 · FastAPI · SQLAlchemy 2 · Alembic · SQLite · JWT (python-jose) · bcrypt (passlib) · Pydantic v2

**Frontend:** React 18 · Vite · TailwindCSS 3 · React Router v6 · Axios
