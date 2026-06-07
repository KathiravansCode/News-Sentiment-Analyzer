from fastapi import APIRouter, Depends, HTTPException

from sqlalchemy.orm import Session
from datetime import datetime

from services.article_service import ArticleService
from services.news_service import NewsService
from services.sentiment_service import SentimentService

from models.search_history import SearchHistory

from database.dependencies import get_db

router = APIRouter(
    prefix="/news",
    tags=["News"]
)


@router.get("")
def get_news(keyword: str):

    if not keyword or not keyword.strip():
        raise HTTPException(
            status_code=400,
            detail="Keyword cannot be empty"
        )

    try:
        articles = NewsService.fetch_news(keyword.strip())
    except Exception as e:
        raise HTTPException(
            status_code=502,
            detail=f"Failed to fetch news: {str(e)}"
        )

    return {
        "keyword": keyword,
        "count": len(articles),
        "articles": articles
    }


@router.post("/fetch")
def fetch_and_save_news(
    keyword: str,
    db: Session = Depends(get_db)
):

    if not keyword or not keyword.strip():
        raise HTTPException(
            status_code=400,
            detail="Keyword cannot be empty"
        )

    keyword = keyword.strip()

    try:
        articles = NewsService.fetch_news(keyword)
    except Exception as e:
        raise HTTPException(
            status_code=502,
            detail=f"Failed to fetch from NewsAPI: {str(e)}"
        )

    positive = 0
    negative = 0
    neutral = 0
    saved = 0

    for article in articles:

        title = article.get("title")

        if not title or title == "[Removed]":
            continue

        sentiment_result = SentimentService.analyze(title)

        sentiment = sentiment_result["sentiment"]

        if sentiment == "positive":
            positive += 1
        elif sentiment == "negative":
            negative += 1
        else:
            neutral += 1

        published_at = None

        if article.get("published_at"):
            try:
                published_at = datetime.fromisoformat(
                    article["published_at"].replace("Z", "+00:00")
                )
            except ValueError:
                published_at = None

        article_data = {
            "title": article.get("title"),
            "source": article.get("source") or "Unknown",
            "category": "general",
            "author": article.get("author"),
            "description": article.get("description"),
            "url": article.get("url"),
            "published_at": published_at,
            "sentiment": sentiment_result["sentiment"],
            "score": sentiment_result["vader_score"]
        }

        result = ArticleService.save_article(db, article_data)

        if result:
            saved += 1

    # Save to search history
    history_entry = SearchHistory(
        keyword=keyword,
        article_count=saved,
        positive=positive,
        negative=negative,
        neutral=neutral,
        searched_at=datetime.utcnow()
    )

    db.add(history_entry)
    db.commit()

    return {
        "keyword": keyword,
        "fetched": len(articles),
        "saved_articles": saved,
        "positive": positive,
        "negative": negative,
        "neutral": neutral
    }