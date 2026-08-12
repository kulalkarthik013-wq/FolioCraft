Markdown
# 🚀 FolioCraft — AI-Powered Portfolio Builder

An AI-powered portfolio builder and management platform built with **FastAPI**, **Next.js**, **SQLite**, and **Google Gemini AI**. It automatically converts a user's resume into structured portfolio information, featuring secure authentication, dynamic theme switching, and real-time dashboard customization.

---

## Features

- AI-powered resume analysis & parsing
- Automatic extraction of professional skills, projects, and work history
- PDF resume upload support
- Secure JWT-based authentication & user registration
- Full CRUD dashboard for real-time portfolio management
- Dynamic template theme switching (Cyberpunk, Minimalist, Developer)
- Public portfolio sharing links (`/portfolio/username`)
- Live preview and export tools
- SQLite database & SQLAlchemy ORM
- FastAPI REST API backend
- Modern Next.js App Router frontend

---

## Tech Stack

### Frontend

- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS

### Backend

- FastAPI
- SQLAlchemy
- SQLite
- Python-Jose (JWT)
- Passlib (Password Hashing)
- Uvicorn

### AI & Processing

- Google Gemini API (Gemini Flash)
- Python PDF text extraction parsers

---

## Project Structure

```text
FolioCraft/
│
├── backend/
│   │
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth.py
│   │   │   ├── resume.py
│   │   │   └── project.py
│   │   │
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   ├── user.py
│   │   │   ├── resume.py
│   │   │   ├── project.py
│   │   │   ├── skill.py
│   │   │   ├── education.py
│   │   │   ├── experience.py
│   │   │   └── certification.py
│   │   │
│   │   ├── schemas/
│   │   │
│   │   ├── services/
│   │   │   ├── ai_service.py
│   │   │   └── resume_service.py
│   │   │
│   │   ├── utils/
│   │   │   └── resume_parser.py
│   │   │
│   │   ├── database/
│   │   │   ├── database.py
│   │   │   └── session.py
│   │   │
│   │   ├── config.py
│   │   └── main.py
│   │
│   ├── uploads/
│   ├── .env
│   ├── .gitignore
│   └── requirements.txt
│
├── frontend/
│   │
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── public/
│   ├── package.json
│   ├── tsconfig.json
│   ├── next.config.ts
│   └── .gitignore
│
├── .gitignore
└── README.md
Installation
Clone Repository
Bash
git clone [https://github.com/kulalkarthik013-wq/FolioCraft.git](https://github.com/kulalkarthik013-wq/FolioCraft.git)
cd FolioCraft
Backend Setup
Create Virtual Environment

Bash
cd backend
python -m venv venv
Activate Environment

Windows
Bash
venv\Scripts\activate
Linux / macOS
Bash
source venv/bin/activate
Install Dependencies

Bash
pip install -r requirements.txt
or install manually

Bash
pip install fastapi
pip install uvicorn
pip install sqlalchemy
pip install google-generativeai
pip install python-jose
pip install passlib[bcrypt]
pip install python-multipart
pip install pydantic
Environment Variables (.env)
Create a .env file inside the backend/ directory:

Code snippet
GEMINI_API_KEY=your_google_gemini_api_key_here
SECRET_KEY=your_jwt_secret_key_here
Run Backend
Recommended

Bash
uvicorn app.main:app --reload
Backend URL

[http://127.0.0.1:8000](http://127.0.0.1:8000)
Swagger API Documentation

[http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
Frontend Setup
Open a new terminal window, navigate back to the root, and enter the frontend directory:

Bash
cd frontend
npm install
npm run dev
Frontend URL

http://localhost:3000
API Endpoints
Health Check
GET /
Authentication
POST /api/auth/register - Register a new user account

POST /api/auth/login - Authenticate and receive JWT token

User & Portfolio Profile
GET /api/users/me - Fetch current user profile details

GET /api/portfolio/me - Fetch current portfolio configuration data

PATCH /api/portfolio/settings - Update portfolio publish status or active theme

Resume Processing
POST /api/resume/upload - Upload PDF resume for AI parsing and database population

Database
SQLite database file managed via SQLAlchemy ORM.

Stores

Users

Resumes

Projects

Skills

Education

Experience

Certifications

AI Portfolio Generation Flow
User uploads Resume (PDF)
        │
        ▼
Extract Raw Text from PDF
        │
        ▼
Google Gemini AI Analysis
        │
        ▼
Extract Structured JSON (Name, Skills, Projects, Experience)
        │
        ▼
Save entities to SQLite Database via SQLAlchemy
        │
        ▼
Render Dynamic Portfolio Dashboard & Live Public URL
        │
  ┌─────┴──────┐
  │            │
Dashboard   Public View
Supported Customization
✅ AI Resume parsing for multiple layout formats

✅ Multiple theme presets (Cyberpunk, Minimalist, Developer)

✅ Real-time CRUD additions/deletions for skills, projects, and experience

✅ Public portfolio link routing (/portfolio/username)

✅ JWT security & protected routes

Future Improvements
Custom domain mapping for published portfolios

Advanced resume template customizer

PostgreSQL database migration

GitHub repository auto-sync for projects

Dark/Light mode theme engine expansion

Docker containerization & cloud deployment

License
This project is licensed under the MIT License.

Author
Karthik s Kulal

GitHub: https://github.com/kulalkarthik013-wq

⭐ If you like this project, don't forget to Star the repository!
