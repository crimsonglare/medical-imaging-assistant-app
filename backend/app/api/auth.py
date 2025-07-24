from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.responses import RedirectResponse
from starlette.middleware.sessions import SessionMiddleware
from app.schemas.user import UserCreate, UserRead, UserUpdate
from app.models.user import User
from app.core.security import get_password_hash, verify_password, create_access_token
from app.core.deps import get_db, get_current_user
from app.core.oauth import oauth
from app.db.session import SessionLocal

router = APIRouter(prefix="/api/auth", tags=["auth"])

@router.post("/register", response_model=UserRead)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == user_in.email).first()
    if user:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed_password = get_password_hash(user_in.password)
    new_user = User(
        email=user_in.email,
        hashed_password=hashed_password,
        full_name=user_in.full_name,
        role=user_in.role,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.post("/token")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    access_token = create_access_token(data={"sub": user.email, "role": user.role})
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=UserRead)
def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.put("/me", response_model=UserRead)
def update_user_me(user_in: UserUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if user_in.full_name is not None:
        current_user.full_name = user_in.full_name
    if user_in.password is not None:
        current_user.hashed_password = get_password_hash(user_in.password)
    db.add(current_user)
    db.commit()
    db.refresh(current_user)
    return current_user

@router.get("/github/login")
async def github_login(request: Request):
    redirect_uri = request.url_for('github_callback')
    return await oauth.github.authorize_redirect(request, redirect_uri)

@router.get("/github/callback")
async def github_callback(request: Request):
    token = await oauth.github.authorize_access_token(request)
    resp = await oauth.github.get('user', token=token)
    user_data = resp.json()
    email = user_data.get('email')
    if not email:
        # Try to get primary email
        emails_resp = await oauth.github.get('user/emails', token=token)
        emails = emails_resp.json()
        for e in emails:
            if e.get('primary') and e.get('verified'):
                email = e['email']
                break
    if not email:
        raise HTTPException(status_code=400, detail="Email not found from GitHub")
    db = SessionLocal()
    user = db.query(User).filter(User.email == email).first()
    if not user:
        user = User(email=email, hashed_password="", full_name=user_data.get('name'), role="student")
        db.add(user)
        db.commit()
        db.refresh(user)
    access_token = create_access_token({"sub": user.email, "role": user.role})
    response = RedirectResponse(url=f"http://localhost:5173/oauth-success?token={access_token}")
    return response