# Backend - Medical Imaging and Report Assistant

## Setup Instructions

### 1. Prerequisites
- Python 3.9+
- (Optional) PostgreSQL for production

### 2. Create a Virtual Environment
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Environment Variables
Copy `.env.example` to `.env` and edit as needed:
```bash
cp .env.example .env
```

### 5. Run Database Migrations
```bash
alembic upgrade head
```

### 6. Start the FastAPI Server
```bash
uvicorn app.main:app --reload
```

Visit [http://localhost:8000/docs](http://localhost:8000/docs) for the interactive API docs.

---

## Switching to PostgreSQL Later
- Change the `DATABASE_URL` in your `.env` to your PostgreSQL connection string (see example in `.env.example`).
- Run Alembic migrations on the new database.

---

## Project Structure
```
backend/
  app/
    main.py
    models/
    schemas/
    api/
    core/
    db/
  alembic/
  requirements.txt
  .env.example
  README.md
```

---

## Useful Commands
- `alembic revision --autogenerate -m "message"`  # Create new migration
- `alembic upgrade head`  # Apply migrations
- `uvicorn app.main:app --reload`  # Run server

---

## Notes
- Default DB is SQLite for easy local development.
- All code is portable to PostgreSQL.
- For OAuth, you’ll need to set up credentials with Google/GitHub and update your `.env`. 

---

## What is an `.env` file?

- It’s a file where you store secret settings and configuration (like passwords, secret keys, and database URLs).
- It is **not** included in version control (git), so your secrets stay private.

---

## Why do you need it?

- Your FastAPI backend reads settings (like the database URL and secret key for JWT) from this file.
- The `.env.example` file is a template showing what variables you need.

---

## How to do it (Step-by-Step)

1. **Copy the example file to a real config file:**

   Open a terminal and run:
   ```bash
   cp backend/.env.example backend/.env
   ```
   - On Windows, if `cp` doesn’t work, use:
     ```powershell
     copy backend\.env.example backend\.env
     ```

2. **Open `backend/.env` in your code editor.**

3. **Set a SECRET_KEY:**
   - Find the line:
     ```
     SECRET_KEY=your-secret-key
     ```
   - Change `your-secret-key` to any random string (for development, something like `mydevsecret123` is fine):
     ```
     SECRET_KEY=mydevsecret123
     ```

4. **(Optional) You can leave the other values as they are for now.**

---

## Example `.env` file

```
DATABASE_URL=sqlite:///./app.db
SECRET_KEY=mydevsecret123
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
```

---

**That’s it!**  
Your backend will now use the settings from `backend/.env` when you run it.

If you need help with the copy command or editing the file, let me know which OS and editor you’re using! 