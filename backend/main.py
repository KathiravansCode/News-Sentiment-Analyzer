from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database.database import Base, engine
from routers.analytics_router import router as analytics_router
from routers.news_router import router as news_router

# Import all models so SQLAlchemy registers them before create_all
from models.article import Article
from models.search_history import SearchHistory

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="News Sentiment Analyzer API",
    version="2.0"
)

app.include_router(news_router)
app.include_router(analytics_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://newssentiment.duckdns.org",
        "http://localhost:5173",
        "http://localhost:4173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {
        "status": "running",
        "version": "2.0"
    }