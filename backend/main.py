from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database.database import Base
from database.database import engine
from routers.analytics_router import router as analytics_router
from models.article import Article
from routers.news_router import router as news_router
Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(news_router)
app.include_router(analytics_router)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.get("/health")
def health():
    return {
        "status": "running2",
        
    }