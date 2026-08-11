from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from passlib.context import CryptContext
from datetime import datetime, timedelta, timezone
from jose import jwt

from app.database.database import get_db
from app.models import User

router = APIRouter(prefix="/api/auth", tags=["Auth"])

SECRET_KEY = "84627574b7a1af72194a0d2fbc3d52be24a0eba4313053196e9c43a44d28ba20"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class UserRegisterSchema(BaseModel):
    name: str
    username: str
    email: EmailStr
    password: str

class UserLoginSchema(BaseModel):
    email: EmailStr
    password: str

class TokenSchema(BaseModel):
    access_token: str
    token_type: str

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

@router.post("/register", response_model=TokenSchema, status_code=status.HTTP_201_CREATED)
def register_user(user_data: UserRegisterSchema, db: Session = Depends(get_db)):
    clean_email = user_data.email.strip().lower()
    clean_username = user_data.username.strip().lower()

    # Check if email exists
    existing_email = db.query(User).filter(User.email == clean_email).first()
    if existing_email:
        raise HTTPException(status_code=400, detail="Email is already registered")

    # Check if username exists
    existing_username = db.query(User).filter(User.username == clean_username).first()
    if existing_username:
        raise HTTPException(status_code=400, detail="Username is already taken")

    # Hash password
    hashed_password = pwd_context.hash(user_data.password)

    # Create new user record
    new_user = User(
        name=user_data.name.strip(),
        username=clean_username,
        email=clean_email,
        password=hashed_password,
        is_published=False,
        template_theme="cyberpunk"
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Generate and return JWT token so user is logged in automatically
    access_token = create_access_token(data={"sub": new_user.username})
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/login", response_model=TokenSchema)
def login_user(credentials: UserLoginSchema, db: Session = Depends(get_db)):
    clean_email = credentials.email.strip().lower()
    
    user = db.query(User).filter(User.email == clean_email).first()
    if not user or not pwd_context.verify(credentials.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # Generate and return JWT token
    access_token = create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}