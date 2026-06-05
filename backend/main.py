from fastapi import FastAPI

from database.database import Base
from database.database import engine

from models.article import Article
from routers.news_router import router as news_router
Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(news_router)

@app.get("/health")
def health():
    return {
        "status": "running"
    }