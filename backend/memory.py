import os
from datetime import datetime
from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, Text
from sqlalchemy.orm import declarative_base, sessionmaker

DATABASE_URL = os.environ.get("DATABASE_URL", "sqlite:///./alphaintel.db")

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

class ThesisHistory(Base):
    __tablename__ = "thesis_history"

    id = Column(Integer, primary_key=True, index=True)
    ticker = Column(String, index=True)
    company_name = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    investment_score = Column(Integer)
    verdict = Column(String)
    
    bull_thesis = Column(Text)
    bear_thesis = Column(Text)
    memo_html = Column(Text)

def init_db():
    Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
