from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr

# --- IMPORTS FROM YOUR OTHER FILES ---
from app import models, auth, database
from app.database import engine, get_db
from app.engine import generate_business_insight  # <--- ADD THIS AT TOP

# Create the database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="SynapseBI API")

# (Keep your CORS Middleware code here...)

# (Keep your UserCreate and UserLogin Pydantic classes here...)

# --- EXISTING ROUTES ---
@app.get("/")
def read_root():
    return {"message": "Welcome to SynapseBI Backend!"}

@app.post("/signup")
def signup(user: models.UserCreate, db: Session = Depends(get_db)):
    # ... your signup logic ...
    pass

@app.post("/login")
def login(user_credentials: models.UserLogin, db: Session = Depends(get_db)):
    # ... your login logic ...
    pass

# --- NEW AI ROUTE (Add this at the very bottom) ---
@app.post("/ask-ai")
def ask_ai(prompt: str):
    try:
        # Call the Gemini Engine
        result = generate_business_insight(prompt)
        return result
    except Exception as e:
        # If Gemini fails or API key is missing, this handles the error
        raise HTTPException(status_code=500, detail=str(e))