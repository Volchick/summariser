from typing import Union

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from db import init_db, Summary, SessionLocal

from pydantic import BaseModel

from summarizer import summarize_pipeline

app = FastAPI()

# Добавляем CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Next.js dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    init_db()

class SummaryRequest(BaseModel):
    url: str

class SummaryResponse(BaseModel):
    id: int
    url: str
    summary: str

@app.post("/create", response_model=SummaryResponse)
def create_item(item: SummaryRequest):
    db = SessionLocal()
    try:
        new_item = Summary(url=item.url, summary="")
        db.add(new_item)
        db.commit()
        db.refresh(new_item)
        
        # Запускаем суммаризацию после сохранения в БД
        new_item.summary = summarize_pipeline(new_item.id, new_item.url)
        db.commit()
        db.refresh(new_item)
        
        return {"id": new_item.id, "url": new_item.url, "summary": new_item.summary}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()

@app.get("/get-all-items")
def get_all_items():
    db = SessionLocal()
    try:
        items = db.query(Summary).all()
        return items
    finally:
        db.close()

@app.get("/items/{item_id}", response_model=SummaryResponse)
def read_item(item_id: int):
    db = SessionLocal()
    try:
        item = db.query(Summary).filter(Summary.id == item_id).first()
        if item is None:
            raise HTTPException(status_code=404, detail="Item not found")
        return item
    finally:
        db.close()

@app.delete("/items/{item_id}")
def delete_item(item_id: int):
    db = SessionLocal()
    try:
        item = db.query(Summary).filter(Summary.id == item_id).first()
        if item is None:
            raise HTTPException(status_code=404, detail="Item not found")
        db.delete(item)
        db.commit()
        return {"message": "Item deleted successfully"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()