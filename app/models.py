from sqlalchemy import Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)

    # This links the user to their saved queries
    queries = relationship("SavedQuery", back_populates="owner")

class SavedQuery(Base):
    __tablename__ = "saved_queries"

    id = Column(Integer, primary_key=True, index=True)
    prompt = Column(Text)          # What the user typed (e.g., "Show me sales")
    sql_generated = Column(Text)   # What Gemini generated
    chart_type = Column(String)    # e.g., "bar", "line"
    owner_id = Column(Integer, ForeignKey("users.id"))

    owner = relationship("User", back_populates="queries")